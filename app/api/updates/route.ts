import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS keyclick_updates (
      id           SERIAL PRIMARY KEY,
      product      VARCHAR(50)  NOT NULL,
      version      VARCHAR(20)  NOT NULL,
      release_date DATE         NOT NULL,
      release_time VARCHAR(5),
      description  TEXT,
      created_at   TIMESTAMP    DEFAULT NOW()
    )
  `)
  await pool.query(`ALTER TABLE keyclick_updates ADD COLUMN IF NOT EXISTS release_time VARCHAR(5)`)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query(
      "SELECT id, product, version, TO_CHAR(release_date,'YYYY-MM-DD') AS release_date, release_time, description, created_at FROM keyclick_updates ORDER BY release_date DESC, id DESC"
    )
    return NextResponse.json({ ok: true, updates: result.rows })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { product, version, release_date, release_time, description } = await req.json()
    const result = await pool.query(
      'INSERT INTO keyclick_updates (product, version, release_date, release_time, description) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [product, version, release_date, release_time ?? '', description ?? '']
    )
    return NextResponse.json({ ok: true, update: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE() {
  try {
    await ensureTable()
    await pool.query('DELETE FROM keyclick_updates')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
