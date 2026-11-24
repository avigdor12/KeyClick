import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function GET_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'קריאת יומן הבנייה'); if (denied) return denied
  try {
    const result = await pool.query(
      "SELECT key, value FROM system_DB_Records WHERE key IN ('KeyClick_Build_Log', 'KeyClick_Site_Version_Id')"
    )
    const rows: Record<string, string> = {}
    for (const r of result.rows) rows[r.key] = r.value

    return NextResponse.json({
      buildLog:  rows['KeyClick_Build_Log']        ?? null,
      dbVersion: rows['KeyClick_Site_Version_Id']  ?? null,
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
