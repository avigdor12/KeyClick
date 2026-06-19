import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? 'unknown'

    const byIp = ip !== 'unknown'
      ? await pool.query(
          'SELECT id, name, email, language, license_type, is_active, is_m_finance_installed, last_ip FROM users WHERE last_ip=$1 LIMIT 1',
          [ip]
        )
      : { rows: [] }

    if (byIp.rows.length > 0) {
      return NextResponse.json({ user: byIp.rows[0], identified_by: 'ip' })
    }

    return NextResponse.json({ user: null, identified_by: 'none' })
  } catch (e) {
    return NextResponse.json({ user: null, identified_by: 'error' })
  }
}
