import { Pool } from 'pg'
import crypto from 'crypto'
import { syncDeleteToApp } from '@/lib/mf-sync'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] רשומות אורח (visitor_<id>): נתונים בלי סיסמה לא נשארים בשרת.
// הרשומה נמחקת ביציאה מהאתר (api/visitor/exit) עם מפתח סודי שנמסר רק לדפדפן של האורח.
// גיבוי: אורח בלי סימן חיים (api/visitor/ping כל 15 דקות) יותר משעתיים נמחק ביצירת האורח הבא.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const VISITOR_EMAIL_DOMAIN = '@visitor.keyclick'
const VISITOR_TTL = '2 hours'

export const hashVisitorKey = (key: string) => crypto.createHash('sha256').update(key).digest('hex')

export async function ensureVisitorColumns() {
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_plan TEXT, ADD COLUMN IF NOT EXISTS country TEXT, ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP, ADD COLUMN IF NOT EXISTS login_count INTEGER NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS source TEXT, ADD COLUMN IF NOT EXISTS visitor_key TEXT`) } catch { /* ignore */ }
}

// מוחק רשומות אורח (רק כתובת האורח ובלי סיסמה), כאן ובאפליקציה יחד עם כל הנתונים שלהן
export async function deleteVisitors(ids: number[]) {
  if (!ids.length) return
  const rows = await pool.query(`SELECT id FROM users WHERE id = ANY($1::int[]) AND email LIKE $2 AND password_hash IS NULL`, [ids, '%' + VISITOR_EMAIL_DOMAIN])
  const del: number[] = rows.rows.map(r => r.id)
  if (!del.length) return
  await pool.query('DELETE FROM keyclick_reminders WHERE user_id = ANY($1::int[])', [del]).catch(() => {})
  await pool.query('DELETE FROM users WHERE id = ANY($1::int[])', [del])
  await syncDeleteToApp(del)
}

export async function purgeStaleVisitors() {
  try {
    const old = await pool.query(
      `SELECT id FROM users WHERE email LIKE $1 AND password_hash IS NULL AND COALESCE(last_login_at, created_at) < now() - $2::interval`,
      ['%' + VISITOR_EMAIL_DOMAIN, VISITOR_TTL]
    )
    await deleteVisitors(old.rows.map(r => r.id))
  } catch (e) {
    console.log(`[visitor] ניקוי אורחים ישנים נכשל: ${String(e)}`)
  }
}

// האם המפתח שייך לרשומת האורח
export async function visitorKeyOk(id: number, key: string): Promise<boolean> {
  if (!id || !key) return false
  const r = await pool.query(`SELECT visitor_key FROM users WHERE id = $1 AND email LIKE $2 AND password_hash IS NULL`, [id, '%' + VISITOR_EMAIL_DOMAIN])
  const stored = r.rows[0]?.visitor_key
  if (!stored) return false
  const a = Buffer.from(stored), b = Buffer.from(hashVisitorKey(key))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function touchVisitor(id: number) {
  await pool.query('UPDATE users SET last_login_at = now() WHERE id = $1', [id])
}
