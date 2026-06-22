import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_start DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_end DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS system_force TEXT;
    `)
    const result = await pool.query(
      'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users ORDER BY id'
    )
    return NextResponse.json({ users: result.rows })
  } catch (e) {
    return NextResponse.json({ users: [], error: String(e) })
  }
}
