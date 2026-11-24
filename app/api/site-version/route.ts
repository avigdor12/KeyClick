import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function GET_handler() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='KeyClick_Site_Version_Id'"
    )
    const raw = result.rows[0]?.value ?? '|'
    const [line1, line2] = raw.split('|')
    return NextResponse.json({ line1: line1 ?? '', line2: line2 ?? '' })
  } catch {
    return NextResponse.json({ line1: 'KeyClick: M Solution Group', line2: 'ver 05.11  11.07.2026 02.00' })
  }
}

async function PATCH_handler(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'שינוי גרסת האתר'); if (denied) return denied
  try {
    const { line1, line2 } = await req.json()
    const value = `${line1}|${line2}`
    await pool.query(
      "INSERT INTO system_DB_Records (key, value) VALUES ('KeyClick_Site_Version_Id', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [value]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const PATCH = withDbQuota(PATCH_handler)
