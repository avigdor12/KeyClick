import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { LICENSE_TYPES } from '@/lib/license-types'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='Dev_Bypass_Login'"
    )
    const enabled = result.rows[0]?.value === '1'
    // בסביבת פיתוח בלבד: כשהעקיפה דולקת, מוחזרת רשומת מנהל המערכת (System_Owner) לזיהוי ישיר, בלי קוד מחשב
    if (enabled && process.env.NODE_ENV === 'development') {
      const u = await pool.query(
        'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE license_type = $1 ORDER BY id LIMIT 1',
        [LICENSE_TYPES.System_Owner]
      )
      return NextResponse.json({ enabled, user: u.rows[0] ?? null })
    }
    return NextResponse.json({ enabled })
  } catch {
    return NextResponse.json({ enabled: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { enabled } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['Dev_Bypass_Login', enabled ? '1' : '0']
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
