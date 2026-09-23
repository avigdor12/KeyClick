import { Pool } from 'pg'

// שליחת רשומות משתמש מ-KeyClick לאפליקציה M_Finance_app (23.09.2026).
// KeyClick מנהל את רשומת המשתמש; כל יצירה, שינוי או מחיקה נשלחים לשרת האפליקציה (api/mf-user-sync.js), עם מפתח סודי משותף.
// הגדרות שרת: MF_APP_URL (כתובת האפליקציה) ו-MF_SYNC_SECRET (זהה לאפליקציה). בלי שתיהן - לא נשלח כלום.
// שליחה שנכשלה מנוסה שוב (3 ניסיונות). כשל סופי לא עוצר את הפעולה ב-KeyClick; "שלח הכל" משלים פערים.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// שפה נשמרת כקוד. רשומות ישנות עם שם השפה מומרות לקוד לפני השליחה
const LANG_CODE_BY_NAME: Record<string, string> = {
  'English': 'en', 'Русский': 'ru', 'Deutsch': 'de', 'Français': 'fr', 'עברית': 'he', 'Español': 'es',
  '日本語': 'ja', 'العربية': 'ar', '中文': 'zh', 'Italiano': 'it', 'हिंदी': 'hi',
}

const FIELDS = 'id, email, name, password_hash, temp_password, language, country, currency, license_type, user_plan, system_force, ' +
  'plan_start, plan_end, is_active, cancelled_at, created_at, last_login_at, login_count, ip_registration, last_ip, source, notes, weighted_score'

async function post(body: unknown): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.MF_APP_URL, secret = process.env.MF_SYNC_SECRET
  if (!url || !secret) return { ok: false, error: 'not configured' }
  let last = ''
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch(url.replace(/\/$/, '') + '/api/mf-user-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-mf-sync-secret': secret },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      })
      if (r.ok) return { ok: true }
      last = `status ${r.status} ${await r.text().catch(() => '')}`
      if (r.status === 401 || r.status === 400) break   // מפתח או בקשה שגויים - ניסיון חוזר לא יעזור
    } catch (e) { last = String(e) }
    if (attempt < 3) await new Promise(res => setTimeout(res, attempt * 700))
  }
  console.log(`[mf-sync] נכשל: ${last}`)
  return { ok: false, error: last }
}

// שולח את הרשומות העדכניות של המשתמשים לפי id. 'all' = כל המשתמשים (השלמת פערים / הפעלה ראשונה)
export async function syncUsersToApp(ids: number[] | 'all'): Promise<{ ok: boolean; count?: number; error?: string }> {
  if (!process.env.MF_APP_URL || !process.env.MF_SYNC_SECRET) return { ok: false, error: 'not configured' }
  try {
    try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP, ADD COLUMN IF NOT EXISTS login_count INTEGER NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS source TEXT`) } catch { /* ignore */ }
    const r = ids === 'all'
      ? await pool.query(`SELECT ${FIELDS} FROM users ORDER BY id`)
      : await pool.query(`SELECT ${FIELDS} FROM users WHERE id = ANY($1::int[])`, [ids.filter(Boolean).map(Number)])
    if (!r.rows.length) return { ok: true, count: 0 }
    const users = r.rows.map(u => ({ ...u, language: LANG_CODE_BY_NAME[u.language] ?? u.language }))
    const res = await post({ action: 'upsert', users })
    return { ...res, count: users.length }
  } catch (e) {
    console.log(`[mf-sync] שגיאה: ${String(e)}`)
    return { ok: false, error: String(e) }
  }
}

export async function syncUserByEmailToApp(email: string) {
  try {
    const r = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (r.rows[0]) return syncUsersToApp([r.rows[0].id])
  } catch (e) { console.log(`[mf-sync] שגיאה: ${String(e)}`) }
  return { ok: false }
}

export async function syncDeleteToApp(ids: number[]) {
  return post({ action: 'delete', ids })
}

// מתג החירום של KeyClick: כניסה ישירה של מנהל המערכת לאתר האפליקציה (נשמר גם באפליקציה)
export async function syncDirectEntryToApp(on: boolean) {
  return post({ action: 'direct-entry', on })
}
