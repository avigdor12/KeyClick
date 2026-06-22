import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const KEY = 'KeyClick_Schedule_Table'

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT value FROM system_DB_Records WHERE key = $1', [KEY]
    )
    const value = result.rows[0]?.value ?? null
    return NextResponse.json({ data: value ? JSON.parse(value) : null })
  } catch (e) {
    return NextResponse.json({ data: null, error: String(e) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [KEY, JSON.stringify(body)]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
