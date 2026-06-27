import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const ALLOWED = ['is_active', 'is_m_finance_installed', 'name', 'email', 'notes', 'weighted_score']

export async function POST(req: NextRequest) {
  try {
    const { userId, field, value } = await req.json()
    if (!ALLOWED.includes(field)) return NextResponse.json({ ok: false, error: 'field not allowed' }, { status: 400 })
    await pool.query(`UPDATE users SET ${field}=$1 WHERE id=$2`, [value, Number(userId)])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
