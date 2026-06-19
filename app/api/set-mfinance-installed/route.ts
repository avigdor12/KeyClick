import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'missing email' }, { status: 400 })
  await pool.query('UPDATE users SET is_m_finance_installed = true WHERE email = $1', [email])
  return NextResponse.json({ ok: true })
}
