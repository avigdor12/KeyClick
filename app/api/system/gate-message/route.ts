import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function GET_handler() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='KeyClick_Gate_Message'"
    )
    const raw = result.rows[0]?.value
    if (!raw) return NextResponse.json({ text: '', date: '' })
    const { text, date } = JSON.parse(raw)
    return NextResponse.json({ text: text ?? '', date: date ?? '' })
  } catch {
    return NextResponse.json({ text: '', date: '' })
  }
}

async function POST_handler(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'שינוי הודעת דף השער'); if (denied) return denied
  try {
    const { text, date } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['KeyClick_Gate_Message', JSON.stringify({ text, date })]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const POST = withDbQuota(POST_handler)
