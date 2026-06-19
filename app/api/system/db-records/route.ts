import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const tablesResult = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    )
    const tables: { name: string; rows: Record<string, unknown>[] }[] = []
    for (const t of tablesResult.rows) {
      const name = t.table_name as string
      const rowsResult = await pool.query(`SELECT * FROM "${name}" LIMIT 200`)
      tables.push({ name, rows: rowsResult.rows })
    }
    return NextResponse.json({ tables })
  } catch (e) {
    return NextResponse.json({ tables: [], error: String(e) })
  }
}
