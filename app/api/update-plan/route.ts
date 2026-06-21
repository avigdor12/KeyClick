import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, licenseType } = await req.json()
    if (!userId || !licenseType) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

    const result = await pool.query(
      `UPDATE users SET mf_license_type=$1, mf_license_start=NOW()
       WHERE id=$2
       RETURNING id, name, last_name, email, language, country, mf_license_type, mf_license_start, mf_license_until, is_active, is_m_finance_installed, last_ip`,
      [licenseType, userId]
    )
    if (result.rowCount === 0) return NextResponse.json({ error: 'user not found' }, { status: 404 })
    return NextResponse.json({ user: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
