import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: NextRequest) {
  try {
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? (req as NextRequest & { ip?: string }).ip
    const clientIp = req.nextUrl.searchParams.get('clientIp') ?? ''
    const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
    const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

    if (ip !== 'unknown') {
      const byIp = await pool.query(
        'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE last_ip=$1 LIMIT 1',
        [ip]
      )
      if (byIp.rows.length > 0) {
        return NextResponse.json({ user: byIp.rows[0], identified_by: 'ip', current_ip: ip })
      }
    }

    return NextResponse.json({ user: null, identified_by: 'none', current_ip: ip })
  } catch (e) {
    return NextResponse.json({ user: null, identified_by: 'error' })
  }
}
