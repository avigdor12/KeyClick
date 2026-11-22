import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'קריאת רשומות המערכת'); if (denied) return denied
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
