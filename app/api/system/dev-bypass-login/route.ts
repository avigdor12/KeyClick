import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='Dev_Bypass_Login'"
    )
    const enabled = result.rows[0]?.value === '1'
    return NextResponse.json({ enabled })
  } catch {
    return NextResponse.json({ enabled: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { enabled } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['Dev_Bypass_Login', enabled ? '1' : '0']
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
