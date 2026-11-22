import { Pool } from 'pg'
import { LICENSE_TYPES } from '@/lib/license-types'
import { readKcUserId, KC_AUTH_HEADER } from '@/lib/kc-auth'
import { BREACH, MEASURE } from '@/lib/kc-security-codes'

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
export async function logIncident(req: Request, breach: number, measures: number[], action: string, actorId: number | null, targetId?: number | null, targetEmail?: string | null) {
  try {
    await ensureTable()
    await pool.query(
      `INSERT INTO security_incidents (kind, breach, measures, action, actor_id, target_id, target_email, ip, country, region, city, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [String(breach), breach, measures.join(','), action, actorId, targetId ?? null, targetEmail ?? null, requestIp(req),
       geo(req, 'x-vercel-ip-country'), geo(req, 'x-vercel-ip-country-region'), geo(req, 'x-vercel-ip-city'),
       (req.headers.get('user-agent') || '').slice(0, 400)]
    )
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

// מקרה של משתמש מזוהה -> 1,2,4 (סגירת האתר, הודעת התרעה, חסימת חשבון); לא מזוהה -> 2
async function refuse(req: Request, breach: number, action: string, actorId: number | null, targetId?: number | null, targetEmail?: string | null): Promise<Response> {
  const measures = actorId ? [MEASURE.CLOSE_SITE, MEASURE.WARNING, MEASURE.ACCOUNT_BLOCK] : [MEASURE.WARNING]
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
