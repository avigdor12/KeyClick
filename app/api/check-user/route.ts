import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, id } = await req.json()

  if (id) {
    const result = await pool.query(
      'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed" FROM users WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) return NextResponse.json({ exists: false, user: null })
    return NextResponse.json({ exists: true, user: result.rows[0] })
  }

  if (email) {
    const result = await pool.query(
      'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed" FROM users WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) return NextResponse.json({ exists: false, user: null })
    return NextResponse.json({ exists: true, user: result.rows[0] })
  }

  return NextResponse.json({ exists: false, user: null })
}
