import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const text = await req.text()
    const { id } = JSON.parse(text)
    if (!id) return NextResponse.json({ ok: false })
    await pool.query('UPDATE visits SET last_seen_at=now() WHERE id=$1', [id])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
