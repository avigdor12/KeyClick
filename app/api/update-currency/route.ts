import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, currency } = await req.json()
    await pool.query(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(10)'
    )
    await pool.query(
      'UPDATE users SET currency=$1 WHERE id=$2',
      [currency ?? null, userId]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
