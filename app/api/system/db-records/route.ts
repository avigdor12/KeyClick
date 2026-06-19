import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query('SELECT key, value FROM system_DB_Records ORDER BY key')
    return NextResponse.json({ records: result.rows })
  } catch (e) {
    return NextResponse.json({ records: [], error: String(e) })
  }
}
