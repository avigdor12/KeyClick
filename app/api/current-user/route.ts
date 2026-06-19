import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
    const userId = Number(cur.rows[0]?.value ?? 0)
    if (!userId) return NextResponse.json({ user: null })
    const result = await pool.query(
      'SELECT id, name, email, language, license_type, is_active, is_m_finance_installed FROM users WHERE id=$1',
      [userId]
    )
    return NextResponse.json({ user: result.rows[0] ?? null })
  } catch (e) {
    return NextResponse.json({ user: null })
  }
}
