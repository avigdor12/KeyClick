import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS keyclick_updates (
      id           SERIAL PRIMARY KEY,
      product      VARCHAR(50)  NOT NULL,
      version      VARCHAR(20)  NOT NULL,
      release_date DATE         NOT NULL,
      release_time VARCHAR(5),
      description  TEXT,
      created_at   TIMESTAMP    DEFAULT NOW()
    )
  `)
  await pool.query(`ALTER TABLE keyclick_updates ADD COLUMN IF NOT EXISTS release_time VARCHAR(5)`)
}

async function GET_handler() {
  try {
    await ensureTable()
    const result = await pool.query(
      "SELECT id, product, version, TO_CHAR(release_date,'YYYY-MM-DD') AS release_date, release_time, description, created_at FROM keyclick_updates ORDER BY release_date DESC, id DESC"
    )
    return NextResponse.json({ ok: true, updates: result.rows })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

async function POST_handler(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'הוספת עדכון'); if (denied) return denied
  try {
    await ensureTable()
    const { product, version, release_date, release_time, description } = await req.json()
    const result = await pool.query(
      'INSERT INTO keyclick_updates (product, version, release_date, release_time, description) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [product, version, release_date, release_time ?? '', description ?? '']
    )
    return NextResponse.json({ ok: true, update: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

async function DELETE_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'מחיקת העדכונים'); if (denied) return denied
  try {
    await ensureTable()
    await pool.query('DELETE FROM keyclick_updates')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const POST = withDbQuota(POST_handler)
export const DELETE = withDbQuota(DELETE_handler)
