import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureColumn() {
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS is_broadcast BOOLEAN DEFAULT false`)
}

export async function POST(req: NextRequest) {
  try {
    await ensureColumn()
    const { userId, userName, title, text, date } = await req.json()
    if (!text || !String(text).trim()) return NextResponse.json({ ok: false, error: 'text required' })

    if (userId) {
      // single recipient — one independent copy
      const result = await pool.query(
        `INSERT INTO feedback_messages (user_id, user_name, sent_date, title, reply_text, reply_date, is_read, is_system)
         VALUES ($1,$2,$3,$4,$5,$3,true,true) RETURNING id`,
        [userId, userName ?? null, date ?? null, title ?? null, text]
      )
      return NextResponse.json({ ok: true, id: result.rows[0].id })
    }

    // broadcast to all customers — an independent copy (own row) per recipient, like separate letters
    const usersResult = await pool.query('SELECT id, name FROM users')
    const ids: number[] = []
    for (const u of usersResult.rows) {
      const result = await pool.query(
        `INSERT INTO feedback_messages (user_id, user_name, sent_date, title, reply_text, reply_date, is_read, is_system, is_broadcast)
         VALUES ($1,$2,$3,$4,$5,$3,true,true,true) RETURNING id`,
        [u.id, u.name ?? null, date ?? null, title ?? null, text]
      )
      ids.push(result.rows[0].id)
    }
    return NextResponse.json({ ok: true, ids })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
