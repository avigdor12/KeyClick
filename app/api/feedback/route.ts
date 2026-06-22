import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, title, message, ratingSite, ratingBudget } = await req.json()
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        title TEXT,
        message TEXT,
        rating_site INTEGER,
        rating_budget INTEGER,
        sent_at TIMESTAMP DEFAULT NOW(),
        reply TEXT,
        replied_at TIMESTAMP
      )
    `)
    await pool.query(
      `INSERT INTO feedback (user_id, title, message, rating_site, rating_budget) VALUES ($1,$2,$3,$4,$5)`,
      [userId ?? null, title ?? '', message ?? '', ratingSite ?? null, ratingBudget ?? null]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT f.*, u.name, u.last_name, u.email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      ORDER BY f.sent_at DESC
    `)
    return NextResponse.json({ messages: result.rows })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, reply } = await req.json()
    await pool.query(
      `UPDATE feedback SET reply=$1, replied_at=NOW() WHERE id=$2`,
      [reply, id]
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
