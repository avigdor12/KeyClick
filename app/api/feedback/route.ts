import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback_messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      user_name TEXT,
      sent_date TEXT,
      title TEXT,
      body TEXT,
      rating_site INTEGER,
      rating_budget INTEGER,
      reply_text TEXT,
      reply_date TEXT,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `)
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    if (userId && sessionId) {
      const result = await pool.query(
        'SELECT * FROM feedback_messages WHERE user_id=$1 AND session_id=$2 ORDER BY created_at ASC',
        [Number(userId), Number(sessionId)]
      )
      return NextResponse.json({ messages: result.rows })
    }
    if (userId) {
      const result = await pool.query(
        'SELECT * FROM feedback_messages WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10',
        [Number(userId)]
      )
      return NextResponse.json({ messages: result.rows })
    }
    const result = await pool.query(`SELECT fm.*, u.last_ip as sender_ip FROM feedback_messages fm LEFT JOIN users u ON u.id = fm.user_id ORDER BY fm.created_at ASC`)
    return NextResponse.json({ messages: result.rows })
  } catch (e) {
    return NextResponse.json({ messages: [], error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { userId, userName, sentDate, title, body, ratingSite, ratingBudget, sessionId } = await req.json()
    const result = await pool.query(
      `INSERT INTO feedback_messages (user_id, user_name, sent_date, title, body, rating_site, rating_budget, session_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [userId ?? null, userName ?? null, sentDate ?? null, title ?? null, body ?? null, ratingSite ?? null, ratingBudget ?? null, sessionId ?? null]
    )
    return NextResponse.json({ ok: true, id: result.rows[0].id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const { id } = await req.json()
    await pool.query('DELETE FROM feedback_messages WHERE id=$1', [id])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureTable()
    const { id, replyText, replyDate, isRead } = await req.json()
    const updates: string[] = []
    const values: unknown[] = []
    let i = 1
    if (replyText !== undefined) { updates.push(`reply_text=$${i++}`); values.push(replyText) }
    if (replyDate !== undefined) { updates.push(`reply_date=$${i++}`); values.push(replyDate) }
    if (isRead !== undefined) { updates.push(`is_read=$${i++}`); values.push(isRead) }
    if (!updates.length) return NextResponse.json({ ok: false })
    values.push(id)
    await pool.query(`UPDATE feedback_messages SET ${updates.join(',')} WHERE id=$${i}`, values)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
