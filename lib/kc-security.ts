import pg, { Pool } from 'pg'
import { AsyncLocalStorage } from 'node:async_hooks'
import { LICENSE_TYPES } from '@/lib/license-types'
import { readKcUserId, KC_AUTH_HEADER } from '@/lib/kc-auth'
import { BREACH, MEASURE } from '@/lib/kc-security-codes'
import { dbConnErrorCode, recordDbError, knownAdminUid } from '@/lib/kc-server-log'

// [22.11.2026 אביגדור] תיקון האבטחה - בדיקת הרשאה בשרת, רישום "חשד לפריצה" וחסימות.
// requireAdmin - פעולות ניהול: רק משתמש שהאישור החתום שלו (lib/kc-auth.ts) שייך למנהל (System_Owner לפי המסד, לא לפי הדפדפן).
// requireSelf  - פעולה על חשבון מסוים: רק בעל החשבון (ID/מייל היעד = בעל האישור); allowAdmin - גם מנהל.
// כל ניסיון נרשם בטבלה security_incidents עם קוד פריצה וקודי חסימה (lib/kc-security-codes.ts):
//   פנייה לא מורשית (1): משתמש מזוהה -> סגירת האתר + הודעת התרעה + חסימת חשבון (1,2,4); לא מזוהה -> הודעת התרעה (2)
//   ID משתמש מזויף (2): אישור שהחתימה שלו פגומה -> 2; ID/מייל של משתמש אחר בבקשה -> 1,2,4
//   גניבת רשיון (3): רשיון בדפדפן שונה מהמסד, או בקשה לרשיון שאינו של לקוח -> 1,2,4
//   Login כשלים רבים (4): 5 כושלים ב-15 דקות לאותו מייל -> הודעת התרעה + השהייה (2,5)
// חסימת חשבון: users.security_blocked = true - הכניסה והאישור הישן נחסמים עד "שחרור" (החלטת מנהל 3) מהטבלה.
// security_blocked_ips - כתובות IP חסומות (שחרור מוחק גם אותן). החלטת המנהל נשמרת בעמודה status ('' / '1' / '2' / '3').
// התשובה לחסימה: 403 + כותרת x-kc-blocked (הודעה) ו-x-kc-kick (סגירת האתר - הדפדפן מנתק את המשתמש). ראה lib/kc-auth-client.ts.
// מחרוזות בעברית בלבד בשלב הזה - תרגום ל-11 השפות בסוף (כלל העבודה של אביגדור).

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const KC_BLOCKED_HEADER = 'x-kc-blocked'
export const KC_KICK_HEADER = 'x-kc-kick'
export const BLOCKED_TEXT = 'כניסה חסומה, פנה למנהל המערכת'

let tableReady = false
async function ensureTable() {
  if (tableReady) return
  await pool.query(`
    CREATE TABLE IF NOT EXISTS security_incidents (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      kind TEXT NOT NULL,
      action TEXT NOT NULL,
      actor_id INTEGER,
      target_id INTEGER,
      target_email TEXT,
      ip TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      user_agent TEXT,
      handled BOOLEAN NOT NULL DEFAULT FALSE,
      hits INTEGER NOT NULL DEFAULT 1,
      last_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`)
  // status = החלטת מנהל: '' עוד לא נבחר, '1' בדיקה, '2' המשך חסימה, '3' שחרור (lib/kc-security-codes.ts). העמודות handled/hits/last_at הישנות לא בשימוש
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE security_incidents ALTER COLUMN status SET DEFAULT ''`)
  // הערות המנהל; seen - המנהל הקיש על "הודעה מהשרת" אחרי שהמקרה נרשם
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS notes TEXT`)
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS seen BOOLEAN NOT NULL DEFAULT FALSE`)
  // קוד פריצה וקודי חסימה (מופרדים בפסיקים, למשל '1,2,4')
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS breach INTEGER`)
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS measures TEXT NOT NULL DEFAULT ''`)
  // [24.11.2026] מקור הבקשה (הערכה אוטומטית): משתמש / סורק / בוט / לא ידוע. ראה classifySource
  await pool.query(`ALTER TABLE security_incidents ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT ''`)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS security_blocked BOOLEAN NOT NULL DEFAULT FALSE`)
  await pool.query(`CREATE TABLE IF NOT EXISTS security_blocked_ips (ip TEXT PRIMARY KEY, incident_id INTEGER, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
  tableReady = true
}
export async function securityPool() { await ensureTable(); return pool }

export function requestIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || ''
}
function geo(req: Request, h: string): string {
  const v = req.headers.get(h) || ''
  try { return decodeURIComponent(v) } catch { return v }
}

// רישום מקרה. measures - קודי החסימה שהופעלו. חסימת חשבון (4) מבוצעת כאן בפועל
// [24.11.2026] מקור הבקשה - הערכה לפי סימנים, לא ודאות:
//   משתמש  - הבקשה הגיעה עם אישור כניסה של משתמש (actorId)
//   בוט    - הדפדפן מדווח על עצמו ככלי אוטומטי (curl, python, bot, crawler...)
//   סורק   - כמה בקשות מאותה כתובת IP בתוך 2 שניות, בלי אישור כניסה (מתעדכן אחרי הרישום, כשמגיעה הבקשה השנייה)
//   לא ידוע - אף כלל לא מתאים
export const SOURCE = { USER: 'משתמש', SCANNER: 'סורק', BOT: 'בוט', UNKNOWN: 'לא ידוע' }
const BOT_UA = /bot|crawl|spider|scan|curl|wget|python|httpclient|go-http|java\/|okhttp|axios|node-fetch|libwww|headless|^$/i
export function classifySource(actorId: number | null, userAgent: string): string {
  if (actorId) return SOURCE.USER
  if (BOT_UA.test(userAgent.trim())) return SOURCE.BOT
  return SOURCE.UNKNOWN
}

export async function logIncident(req: Request, breach: number, measures: number[], action: string, actorId: number | null, targetId?: number | null, targetEmail?: string | null) {
  try {
    await ensureTable()
    const ua = (req.headers.get('user-agent') || '').slice(0, 400)
    const ip = requestIp(req)
    await pool.query(
      `INSERT INTO security_incidents (kind, breach, measures, action, actor_id, target_id, target_email, ip, country, region, city, user_agent, source)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [String(breach), breach, measures.join(','), action, actorId, targetId ?? null, targetEmail ?? null, ip,
       geo(req, 'x-vercel-ip-country'), geo(req, 'x-vercel-ip-country-region'), geo(req, 'x-vercel-ip-city'),
       ua, classifySource(actorId, ua)]
    )
    // סורק: כמה בקשות בלי אישור כניסה מאותה כתובת בתוך 2 שניות -> כולן מסומנות "סורק" (גם אלה שנרשמו לפני)
    if (!actorId && ip) await pool.query(
      `UPDATE security_incidents SET source = $2
       WHERE ip = $1 AND actor_id IS NULL AND source = $3 AND created_at > NOW() - INTERVAL '2 seconds'
         AND (SELECT count(*) FROM security_incidents WHERE ip = $1 AND actor_id IS NULL AND created_at > NOW() - INTERVAL '2 seconds') >= 2`,
      [ip, SOURCE.SCANNER, SOURCE.UNKNOWN])
    if (actorId && measures.includes(MEASURE.ACCOUNT_BLOCK)) await pool.query('UPDATE users SET security_blocked = TRUE WHERE id = $1 AND license_type IS DISTINCT FROM $2', [actorId, LICENSE_TYPES.System_Owner])
    console.log(`[security] breach=${breach} measures=${measures.join(',')} action="${action}" actor=${actorId ?? 'none'} target=${targetId ?? targetEmail ?? 'none'} ip=${requestIp(req)}`)
  } catch (e) {
    console.log(`[security] logIncident failed: ${String(e)}`)
  }
}

// kick - סגירת האתר: הדפדפן מוחק את האישור ומנתק את המשתמש
export function blockedResponse(kick = false): Response {
  const headers: Record<string, string> = { [KC_BLOCKED_HEADER]: encodeURIComponent(BLOCKED_TEXT) }
  if (kick) headers[KC_KICK_HEADER] = '1'
  return Response.json({ error: BLOCKED_TEXT, code: 'KC_BLOCKED' }, { status: 403, headers })
}

// [24.11.2026] מסד הנתונים מושהה כי נגמרה המכסה החודשית של Neon (קוד שגיאה 53000). המכסה מתחדשת ב-1 לחודש הבא.
// התשובה עם כותרת x-kc-blocked - הדפדפן מציג את ההודעה בחלון הקיים (lib/kc-auth-client.ts). שגיאה אחרת -> null
// ההודעה בשפת הלקוח לפי cookie keyclick_lang (נקבע ב-middleware.ts ובבחירת שפה באתר). ברירת מחדל: אנגלית
const DB_QUOTA_TEXT: Record<string, string> = {
  he: 'האתר בתחזוקה, יתחדש בתאריך {d}, תודה על ההבנה, איתך הסליחה',
  en: 'The site is under maintenance and will resume on {d}. Thank you for your understanding, and we apologize for the inconvenience.',
  ru: 'Сайт на техническом обслуживании и возобновит работу {d}. Спасибо за понимание, приносим свои извинения.',
  de: 'Die Website wird gewartet und ist ab {d} wieder verfügbar. Vielen Dank für Ihr Verständnis, wir bitten um Entschuldigung.',
  fr: 'Le site est en maintenance et reprendra le {d}. Merci de votre compréhension, nous vous prions de nous excuser.',
  es: 'El sitio está en mantenimiento y se reanudará el {d}. Gracias por su comprensión, le pedimos disculpas.',
  ja: 'サイトはメンテナンス中です。{d}に再開します。ご理解いただきありがとうございます。ご不便をおかけして申し訳ありません。',
  ar: 'الموقع قيد الصيانة وسيعود للعمل في {d}. شكرًا لتفهمكم، ونعتذر عن الإزعاج.',
  zh: '网站正在维护，将于{d}恢复。感谢您的理解，给您带来不便，敬请谅解。',
  it: 'Il sito è in manutenzione e riprenderà il {d}. Grazie per la comprensione, ci scusiamo per il disagio.',
  hi: 'साइट रखरखाव में है और {d} को फिर से शुरू होगी। आपकी समझ के लिए धन्यवाद, असुविधा के लिए क्षमा करें।',
}
// [24.11.2026] לקוח מחובר (באמצע עבודה): משפט נוסף, ואחרי "אישור" הוא מנותק וחוזר לדף הבית (כותרת x-kc-kick)
const DB_QUOTA_WORK_TEXT: Record<string, string> = {
  he: 'הנתונים שנשמרו עד עכשיו שמורים, ניתן לחזור לעבודה בתאריך הנ"ל.',
  en: 'Your data saved so far is safe; you can return to work on that date.',
  ru: 'Сохранённые данные в безопасности; вы сможете вернуться к работе в указанную дату.',
  de: 'Ihre bisher gespeicherten Daten sind sicher; Sie können ab dem genannten Datum weiterarbeiten.',
  fr: 'Vos données enregistrées jusqu\'à présent sont en sécurité ; vous pourrez reprendre le travail à cette date.',
  es: 'Sus datos guardados hasta ahora están seguros; podrá volver a trabajar en esa fecha.',
  ja: 'これまでに保存されたデータは安全です。上記の日付から作業を再開できます。',
  ar: 'البيانات التي تم حفظها حتى الآن آمنة، ويمكنك العودة إلى العمل في التاريخ المذكور.',
  zh: '目前已保存的数据是安全的，您可以在上述日期恢复工作。',
  it: 'I dati salvati finora sono al sicuro; potrai riprendere il lavoro in quella data.',
  hi: 'अब तक सहेजा गया डेटा सुरक्षित है; आप उक्त तारीख को काम पर लौट सकते हैं।',
}
export function dbQuotaResponse(e: unknown, req: Request): Response | null {
  if ((e as { code?: string } | null)?.code !== '53000') return null
  const m = (req.headers.get('cookie') || '').match(/(?:^|;\s*)keyclick_lang=([a-z]{2})/)
  const lang = m && DB_QUOTA_TEXT[m[1]] ? m[1] : 'en'
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  const date = lang === 'he'
    ? `01/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
    : new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d)
  let text = DB_QUOTA_TEXT[lang].replace('{d}', date).replace('..', '.') // ru: התאריך מסתיים ב-"г."
  const inWork = !!readKcUserId(req)
  if (inWork) text += (/[.。]$/.test(text) ? ' ' : '. ') + DB_QUOTA_WORK_TEXT[lang]
  console.log(`[db] 53000 quota exhausted (inWork=${inWork}): ${(e as Error)?.message ?? ''}`)
  const headers: Record<string, string> = { [KC_BLOCKED_HEADER]: encodeURIComponent(text) }
  if (inWork) headers[KC_KICK_HEADER] = '1'
  return Response.json({ error: text, code: 'DB_QUOTA' }, { status: 503, headers })
}

// [24.11.2026] עטיפה לכל פעולת שרת (app/api/**/route.ts): אם במהלך הבקשה פנייה כלשהי למסד נכשלה בקוד 53000 (מכסה) -
// הלקוח מקבל את הודעת התחזוקה, גם אם הפעולה עצמה תפסה את השגיאה והחזירה תשובה אחרת.
// אין פנייה נוספת למסד ואין בדיקה מראש: רק רישום של קוד השגיאה כשהיא קורית (pg query/connect), לפי הבקשה הנוכחית.
// [24.11.2026] dbErr - כשל החיבור הראשון בבקשה (כל סוג: מכסה, רשת, חיבור שנפל), נרשם ביומן השרת (lib/kc-server-log.ts)
type DbReqState = { quota: boolean; dbErr: unknown }
const dbQuotaStore = new AsyncLocalStorage<DbReqState>()
function markQuota(s: DbReqState | undefined, err: unknown) {
  if (!s || !err) return
  if ((err as { code?: string } | null)?.code === '53000') s.quota = true
  if (!s.dbErr && dbConnErrorCode(err)) s.dbErr = err
}
function patchPg(proto: Record<string, unknown>, name: string) {
  const orig = proto[name] as ((...a: unknown[]) => unknown) | undefined
  if (typeof orig !== 'function') return
  proto[name] = function (this: unknown, ...args: unknown[]) {
    const s = dbQuotaStore.getStore()
    const last = args[args.length - 1]
    if (typeof last === 'function') {
      args[args.length - 1] = function (this: unknown, err: unknown, ...rest: unknown[]) { markQuota(s, err); return (last as (...a: unknown[]) => unknown).call(this, err, ...rest) }
      return orig.apply(this, args)
    }
    const r = orig.apply(this, args) as { then?: (a: undefined, b: (e: unknown) => void) => unknown } | undefined
    if (r && typeof r.then === 'function') r.then(undefined, (e: unknown) => markQuota(s, e))
    return r
  }
}
let pgPatched = false
function ensurePgPatched() {
  if (pgPatched) return
  pgPatched = true
  patchPg(pg.Pool.prototype as unknown as Record<string, unknown>, 'query')
  patchPg(pg.Pool.prototype as unknown as Record<string, unknown>, 'connect')
  patchPg(pg.Client.prototype as unknown as Record<string, unknown>, 'query')
  patchPg(pg.Client.prototype as unknown as Record<string, unknown>, 'connect')
}
export function withDbQuota<R extends Request, A extends unknown[]>(h: (req: R, ...rest: A) => Response | Promise<Response>) {
  ensurePgPatched()
  return async (req: R, ...rest: A): Promise<Response> => {
    const s: DbReqState = { quota: false, dbErr: null }
    let res: Response | null = null, thrown: unknown = null
    try { res = await dbQuotaStore.run(s, () => h(req, ...rest)) } catch (e) { thrown = e; markQuota(s, e) }
    if (s.dbErr) await recordDbError(req, s.dbErr, readKcUserId(req))
    if (s.quota) return await quotaFor(req)
    if (thrown) throw thrown
    return res!
  }
}
// מנהל המערכת (מזוהה בלי המסד, lib/kc-server-log.ts knownAdminUid) לא מנותק ולא מקבל חלון - כדי שיוכל לצפות ביומן השרת
async function quotaFor(req: Request): Promise<Response> {
  const uid = readKcUserId(req)
  if (uid && uid === await knownAdminUid()) return Response.json({ error: 'db_quota', code: 'DB_QUOTA' }, { status: 503 })
  return dbQuotaResponse({ code: '53000' }, req)!
}

// מקרה של משתמש מזוהה -> 1,2,4 (סגירת האתר, הודעת התרעה, חסימת חשבון); לא מזוהה -> 2
async function refuse(req: Request, breach: number, action: string, actorId: number | null, targetId?: number | null, targetEmail?: string | null): Promise<Response> {
  // [23.11.2026] דחיית כניסה (6) נרשמת תמיד - הבקשה נדחתה בלי נתונים
  const measures = actorId ? [MEASURE.CLOSE_SITE, MEASURE.WARNING, MEASURE.ACCOUNT_BLOCK, MEASURE.REFUSE] : [MEASURE.WARNING, MEASURE.REFUSE]
  await logIncident(req, breach, measures, action, actorId, targetId, targetEmail)
  return blockedResponse(!!actorId)
}

// אישור שנשלח אבל החתימה שלו לא תקינה (ID ששונה) - ID משתמש מזויף
function forgedApproval(req: Request, uid: number | null): boolean {
  return !uid && !!req.headers.get(KC_AUTH_HEADER)
}

async function isAdminId(uid: number): Promise<boolean> {
  const r = await pool.query('SELECT license_type FROM users WHERE id = $1', [uid])
  return r.rows[0]?.license_type === LICENSE_TYPES.System_Owner
}

// חשבון חסום או IP חסום -> תשובת חסימה (בלי רישום נוסף); אחרת null
export async function blockedState(req: Request, uid: number | null): Promise<Response | null> {
  await ensureTable()
  // המנהל לא נחסם לעולם (כדי שיוכל לשחרר גם אם חסם בטעות IP משותף, למשל של מקום העבודה)
  if (uid && await isAdminId(uid)) return null
  const ip = requestIp(req)
  if (ip) {
    const b = await pool.query('SELECT 1 FROM security_blocked_ips WHERE ip = $1', [ip])
    if (b.rowCount) return blockedResponse(true)
  }
  if (uid) {
    const u = await pool.query('SELECT security_blocked FROM users WHERE id = $1', [uid])
    if (u.rows[0]?.security_blocked) return blockedResponse(true)
  }
  return null
}

// null = מותר; אחרת - התשובה לסירוב (כבר נרשם)
export async function requireAdmin(req: Request, action: string): Promise<Response | null> {
  const uid = readKcUserId(req)
  const blocked = await blockedState(req, uid); if (blocked) return blocked
  if (uid && await isAdminId(uid)) return null
  return refuse(req, forgedApproval(req, uid) ? BREACH.FAKE_ID : BREACH.UNAUTHORIZED, action, uid)
}

export async function requireSelf(req: Request, action: string, target: { id?: number | string | null; email?: string | null }, allowAdmin = false): Promise<Response | null> {
  const uid = readKcUserId(req)
  const blocked = await blockedState(req, uid); if (blocked) return blocked
  const tid = target.id !== undefined && target.id !== null && target.id !== '' ? Number(target.id) : null
  const temail = target.email ? String(target.email) : null
  if (!uid) return refuse(req, forgedApproval(req, uid) ? BREACH.FAKE_ID : BREACH.UNAUTHORIZED, action, null, tid, temail)
  if (tid !== null && tid === uid) return null
  if (tid === null && temail) {
    const r = await pool.query('SELECT id FROM users WHERE lower(email) = lower($1)', [temail])
    if (r.rows[0]?.id === uid) return null
  }
  if (allowAdmin && await isAdminId(uid)) return null
  return refuse(req, BREACH.FAKE_ID, action, uid, tid, temail)
}

// גניבת רשיון: משתמש מזוהה ביקש / החזיק רשיון שאינו שלו
export async function refuseLicenseTheft(req: Request, action: string, actorId: number | null, targetId?: number | null): Promise<Response> {
  return refuse(req, BREACH.LICENSE_THEFT, action, actorId, targetId)
}

// משתמש מחובר כלשהו (אישור תקין); אחרת נחסם ונרשם - להודעות מערכת משותפות שאין להן בעלים
export async function requireLoggedIn(req: Request, action: string): Promise<Response | null> {
  const uid = readKcUserId(req)
  const blocked = await blockedState(req, uid); if (blocked) return blocked
  if (uid) return null
  return refuse(req, forgedApproval(req, uid) ? BREACH.FAKE_ID : BREACH.UNAUTHORIZED, action, null)
}

// האם מבקש הוא מנהל (בלי לרשום ובלי לחסום) - לבדיקות משנה בתוך פעולה מותרת
export async function isAdminRequest(req: Request): Promise<boolean> {
  const uid = readKcUserId(req)
  return !!uid && await isAdminId(uid)
}

// ---------- Login כשלים רבים ----------
// 5 ניסיונות כושלים לאותו אימייל ב-15 דקות -> השהייה של 15 דקות (מהניסיון הכושל האחרון), וכל ניסיון בזמן ההשהייה נרשם
export const LOGIN_MAX_FAILS = 5
export const LOGIN_LOCK_MINUTES = 15
export const LOGIN_LOCKED_TEXT = 'יותר מדי ניסיונות כניסה כושלים. נסה שוב בעוד 15 דקות'
let failsReady = false
async function ensureFails() {
  if (failsReady) return
  await pool.query(`CREATE TABLE IF NOT EXISTS login_failures (id SERIAL PRIMARY KEY, email TEXT NOT NULL, ip TEXT, at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
  failsReady = true
}
export async function loginLocked(email: string): Promise<boolean> {
  await ensureFails()
  const r = await pool.query(`SELECT count(*)::int AS n FROM login_failures WHERE lower(email) = lower($1) AND at > NOW() - ($2 || ' minutes')::interval`, [email, String(LOGIN_LOCK_MINUTES)])
  return (r.rows[0]?.n ?? 0) >= LOGIN_MAX_FAILS
}
export async function logLoginLocked(req: Request, email: string) {
  await logIncident(req, BREACH.LOGIN_FAILS, [MEASURE.WARNING, MEASURE.SUSPEND], 'כניסה - יותר מדי ניסיונות כושלים', null, null, email)
}
export async function recordLoginFailure(req: Request, email: string) {
  try { await ensureFails(); await pool.query('INSERT INTO login_failures (email, ip) VALUES ($1, $2)', [email, requestIp(req)]) } catch (e) { console.log(`[security] recordLoginFailure failed: ${String(e)}`) }
}
export async function clearLoginFailures(email: string) {
  try { await ensureFails(); await pool.query('DELETE FROM login_failures WHERE lower(email) = lower($1)', [email]) } catch { /* ignore */ }
}

// ---------- הגבלת הרשמות ----------
// [22.11.2026] מניעת הצפת המסד ברשומות מזויפות: מאותה כתובת IP בשעה - עד 5 הרשמות, ועד 30 רשומות מבקר
// (מבקר - יותר, כי כמה אנשים יכולים לגלוש מאותה רשת, למשל משרד). מעבר לזה - תשובה 429, בלי רישום רשומה.
export const SIGNUP_LIMITS = { register: 5, visitor: 30 } as const
export const SIGNUP_LIMIT_TEXT = 'יותר מדי הרשמות מהכתובת הזו. נסה שוב בעוד שעה'
let signupReady = false
export async function signupLimited(req: Request, kind: keyof typeof SIGNUP_LIMITS): Promise<Response | null> {
  try {
    if (!signupReady) {
      await pool.query(`CREATE TABLE IF NOT EXISTS signup_attempts (id SERIAL PRIMARY KEY, kind TEXT NOT NULL, ip TEXT NOT NULL, at TIMESTAMPTZ NOT NULL DEFAULT NOW())`)
      signupReady = true
    }
    const ip = requestIp(req)
    if (!ip) return null
    await pool.query(`DELETE FROM signup_attempts WHERE at < NOW() - interval '1 hour'`)
    const r = await pool.query('SELECT count(*)::int AS n FROM signup_attempts WHERE kind = $1 AND ip = $2', [kind, ip])
    if ((r.rows[0]?.n ?? 0) >= SIGNUP_LIMITS[kind]) {
      console.log(`[security] signup limit kind=${kind} ip=${ip}`)
      return Response.json({ error: SIGNUP_LIMIT_TEXT, code: 'SIGNUP_LIMIT' }, { status: 429 })
    }
    await pool.query('INSERT INTO signup_attempts (kind, ip) VALUES ($1, $2)', [kind, ip])
  } catch (e) { console.log(`[security] signupLimited failed: ${String(e)}`) }
  return null
}
