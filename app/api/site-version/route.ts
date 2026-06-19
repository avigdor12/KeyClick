import { NextResponse } from 'next/server'
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
  } catch (e) {
    console.error('site-version error:', e)
    return NextResponse.json({ line1: 'KeyClick: M Solution Group', line2: 'TEST 99.99' })
  }
}
