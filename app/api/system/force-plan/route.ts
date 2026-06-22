import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, systemForce } = await req.json()
    if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS system_force TEXT`)

    const forceValue = systemForce && systemForce !== 'User' ? systemForce : null
    await pool.query(`UPDATE users SET system_force=$1 WHERE id=$2`, [forceValue, userId])

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
