import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='KeyClick_Gate_Message'"
    )
    const raw = result.rows[0]?.value
    if (!raw) return NextResponse.json({ text: '', date: '' })
    const { text, date } = JSON.parse(raw)
    return NextResponse.json({ text: text ?? '', date: date ?? '' })
  } catch {
    return NextResponse.json({ text: '', date: '' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, date } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['KeyClick_Gate_Message', JSON.stringify({ text, date })]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
