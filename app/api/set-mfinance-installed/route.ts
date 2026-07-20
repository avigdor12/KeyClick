import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (email) {
    await pool.query('UPDATE users SET is_m_finance_installed = true WHERE email = $1', [email])
    return NextResponse.json({ ok: true })
  }

  const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
  const userId = Number(cur.rows[0]?.value ?? 0)
  if (userId) {
    await pool.query('UPDATE users SET is_m_finance_installed = true WHERE id = $1', [userId])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false })
}
