// [24.11.2026] יומן השרת: כשלי חיבור למסד הנתונים (מכסה 53000, חיבור שנפל, רשת וכו') נרשמים ב-Vercel Blob (מאגר kc-server-log),
// שלא תלוי ב-Neon - כך הרישום עובד גם כשהמסד מושהה. מוצג בלשונית "בשימוש המערכת > מוניטור > שרת" (app/api/system/server-log).
// מגבלת התוכנית החינמית: 2,000 כתיבות/רשימות בחודש. לכן האירועים נאספים בזיכרון ונכתבים לכל היותר פעם ב-10 דקות
// (האירוע הראשון נכתב מיד). אירועים זהים (אותו קוד, פעולה, משתמש ו-IP) מתאחדים לשורה אחת עם מספר חזרות.
import { put, list, get, del } from '@vercel/blob'

const PREFIX = 'server-log/'
const ADMIN_FILE = 'server-log-admin.json'
const FLUSH_MS = 10 * 60 * 1000

export type ServerLogEvent = {
  first_at: string; last_at: string; code: string; message: string
  method: string; path: string; uid: number | null; ip: string; country: string; count: number
}

// קודי שגיאה של כשל חיבור / זמינות מסד (לא שגיאות בשאילתה עצמה)
export function dbConnErrorCode(e: unknown): string | null {
  const err = e as { code?: string; message?: string } | null
  const code = err?.code || ''
  if (['53000', '53300', '57P01', '57P02', '57P03', '28P01', '28000', '3D000', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'ECONNRESET', 'EAI_AGAIN', 'EHOSTUNREACH'].includes(code)) return code
  if (/^08/.test(code)) return code
  if (/Connection terminated|timeout exceeded when trying to connect|Connection timeout/i.test(err?.message || '')) return 'CONN'
  return null
}

const buffer = new Map<string, ServerLogEvent>()
let lastFlush = 0

function reqIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || ''
}

export async function recordDbError(req: Request, e: unknown, uid: number | null) {
  const code = dbConnErrorCode(e)
  if (!code || !process.env.BLOB_READ_WRITE_TOKEN) return
  try {
    const now = new Date().toISOString()
    let path = ''
    try { path = new URL(req.url).pathname } catch { /* ignore */ }
    const ip = reqIp(req)
    const key = [code, req.method, path, uid ?? '', ip].join('|')
    const ex = buffer.get(key)
    if (ex) { ex.count++; ex.last_at = now }
    else buffer.set(key, {
      first_at: now, last_at: now, code, message: String((e as Error)?.message || '').slice(0, 200),
      method: req.method, path, uid, ip, country: req.headers.get('x-vercel-ip-country') || '', count: 1,
    })
    if (Date.now() - lastFlush >= FLUSH_MS) await flush()
  } catch (err) {
    console.log(`[server-log] record failed: ${String(err)}`)
  }
}

async function flush() {
  if (!buffer.size) return
  const events = [...buffer.values()]
  buffer.clear()
  lastFlush = Date.now()
  const name = `${PREFIX}${new Date().toISOString().replace(/[:.]/g, '-')}-${Math.random().toString(36).slice(2, 8)}.json`
  await put(name, JSON.stringify(events), { access: 'private', contentType: 'application/json', addRandomSuffix: false })
  console.log(`[server-log] wrote ${events.length} events -> ${name}`)
}

async function readJson<T>(pathname: string): Promise<T | null> {
  const r = await get(pathname, { access: 'private', useCache: false })
  if (!r || !r.stream) return null
  return JSON.parse(await new Response(r.stream).text()) as T
}

// היומן לתצוגה: 100 הקבצים האחרונים (רשימה אחת + קריאה לכל קובץ) + מה שעוד בזיכרון של המופע הזה
export async function readServerLog(): Promise<ServerLogEvent[]> {
  const out: ServerLogEvent[] = []
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { blobs } = await list({ prefix: PREFIX, limit: 1000 })
    const latest = blobs.sort((a, b) => a.pathname.localeCompare(b.pathname)).slice(-100)
    for (const b of latest) {
      try { const ev = await readJson<ServerLogEvent[]>(b.pathname); if (Array.isArray(ev)) out.push(...ev) } catch { /* ignore */ }
    }
  }
  out.push(...buffer.values())
  return out.sort((a, b) => a.first_at.localeCompare(b.first_at))
}

// איפוס - מחיקת כל קובצי היומן (קובץ המנהל נשאר) וגם מה שבזיכרון של המופע הזה
export async function clearServerLog() {
  buffer.clear()
  if (!process.env.BLOB_READ_WRITE_TOKEN) return
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 })
  if (blobs.length) await del(blobs.map(b => b.url))
}

// מנהל המערכת בלי המסד: מספר המשתמש של המנהל נשמר במאגר כשהוא נכנס ללשונית "שרת" בזמן שהמסד זמין.
// כך כשהמסד מושהה אפשר לזהות אותו לפי אישור הכניסה החתום בלבד. נשמר בזיכרון של המופע (קריאה אחת למופע)
let adminCache: { uid: number | null; at: number } | null = null
export async function knownAdminUid(): Promise<number | null> {
  if (adminCache && Date.now() - adminCache.at < 10 * 60 * 1000) return adminCache.uid
  let uid: number | null = null
  try { if (process.env.BLOB_READ_WRITE_TOKEN) uid = (await readJson<{ uid: number }>(ADMIN_FILE))?.uid ?? null } catch { /* ignore */ }
  adminCache = { uid, at: Date.now() }
  return uid
}
export async function rememberAdmin(uid: number) {
  if ((await knownAdminUid()) === uid || !process.env.BLOB_READ_WRITE_TOKEN) return
  await put(ADMIN_FILE, JSON.stringify({ uid }), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true })
  adminCache = { uid, at: Date.now() }
}
