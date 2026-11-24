import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const KEY = 'KeyClick_Schedule_Table'

async function GET_handler() {
  try {
    const result = await pool.query(
      'SELECT value FROM system_DB_Records WHERE key = $1', [KEY]
    )
    const value = result.rows[0]?.value ?? null
    return NextResponse.json({ data: value ? JSON.parse(value) : null })
  } catch (e) {
    return NextResponse.json({ data: null, error: String(e) }, { status: 500 })
  }
}

async function POST_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'שינוי טבלת המחירים'); if (denied) return denied
  try {
    const body = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [KEY, JSON.stringify(body)]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const POST = withDbQuota(POST_handler)
