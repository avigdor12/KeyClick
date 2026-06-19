import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name, email, language, license_type, is_active, is_m_finance_installed, last_ip, created_at FROM users ORDER BY id'
    )
    return NextResponse.json({ users: result.rows })
  } catch (e) {
    return NextResponse.json({ users: [], error: String(e) })
  }
}
