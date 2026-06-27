import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='KeyClick_Site_Version_Id'"
    )
    const raw = result.rows[0]?.value ?? '|'
    const [line1, line2] = raw.split('|')
    return NextResponse.json({ line1: line1 ?? '', line2: line2 ?? '' })
  } catch {
    return NextResponse.json({ line1: 'KeyClick: M Solution Group', line2: 'ver 05.04  28.06.2026 02.40' })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { line1, line2 } = await req.json()
    const value = `${line1}|${line2}`
    await pool.query(
      "INSERT INTO system_DB_Records (key, value) VALUES ('KeyClick_Site_Version_Id', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [value]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
