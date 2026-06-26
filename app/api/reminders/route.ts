import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS keyclick_reminders (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      title      TEXT NOT NULL,
      date       DATE NOT NULL,
      time       VARCHAR(5),
      type       VARCHAR(10) NOT NULL DEFAULT 'manual',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable()
    const userId = req.nextUrl.searchParams.get('user_id')
    if (!userId) return NextResponse.json({ ok: false, error: 'missing user_id' })
    const result = await pool.query(
      "SELECT id, user_id, title, TO_CHAR(date,'YYYY-MM-DD') AS date, time, type, created_at FROM keyclick_reminders WHERE user_id=$1 ORDER BY date ASC, time ASC",
      [userId]
    )
    return NextResponse.json({ ok: true, reminders: result.rows })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { user_id, title, date, time, type } = await req.json()
    const result = await pool.query(
      'INSERT INTO keyclick_reminders (user_id, title, date, time, type) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [user_id, title, date, time ?? null, type ?? 'manual']
    )
    return NextResponse.json({ ok: true, reminder: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const id     = req.nextUrl.searchParams.get('id')
    const userId = req.nextUrl.searchParams.get('user_id')
    const type   = req.nextUrl.searchParams.get('type')
    if (id) {
      await pool.query('DELETE FROM keyclick_reminders WHERE id=$1', [id])
    } else if (userId && type) {
      await pool.query('DELETE FROM keyclick_reminders WHERE user_id=$1 AND type=$2', [userId, type])
    } else {
      return NextResponse.json({ ok: false, error: 'missing id or user_id+type' })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
