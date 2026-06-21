import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT key, value FROM system_DB_Records WHERE key IN ('KeyClick_Build_Log', 'KeyClick_Site_Version_Id')"
    )
    const rows: Record<string, string> = {}
    for (const r of result.rows) rows[r.key] = r.value

    return NextResponse.json({
      buildLog:  rows['KeyClick_Build_Log']        ?? null,
      dbVersion: rows['KeyClick_Site_Version_Id']  ?? null,
      buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
