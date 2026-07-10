import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visit_sampling_config (
      id INTEGER PRIMARY KEY DEFAULT 1,
      run_enabled BOOLEAN NOT NULL DEFAULT false,
      start_date TIMESTAMP,
      end_date TIMESTAMP,
      end_enabled BOOLEAN NOT NULL DEFAULT true,
      CONSTRAINT single_row CHECK (id = 1)
    )
  `)
  await pool.query(`ALTER TABLE visit_sampling_config ALTER COLUMN start_date TYPE TIMESTAMP`)
  await pool.query(`ALTER TABLE visit_sampling_config ALTER COLUMN end_date TYPE TIMESTAMP`)
  await pool.query(`INSERT INTO visit_sampling_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING`)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query(`SELECT run_enabled, to_char(start_date, 'YYYY-MM-DD"T"HH24:MI') AS start_date, to_char(end_date, 'YYYY-MM-DD"T"HH24:MI') AS end_date, end_enabled FROM visit_sampling_config WHERE id=1`)
    return NextResponse.json({ config: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ config: null, error: String(e) })
  }
}

export async function PUT(req: Request) {
  try {
    await ensureTable()
    const { runEnabled, startDate, endDate, endEnabled } = await req.json()
    await pool.query(
      'UPDATE visit_sampling_config SET run_enabled=$1, start_date=$2, end_date=$3, end_enabled=$4 WHERE id=1',
      [runEnabled, startDate || null, endDate || null, endEnabled]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
