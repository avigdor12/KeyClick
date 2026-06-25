import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now(),
      closed_at TIMESTAMPTZ,
      is_active BOOLEAN DEFAULT true
    )
  `)
  await pool.query(`
    ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS session_id INTEGER
  `)
}

// GET ?userId=X → get active session (create if none)
export async function GET(req: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(req.url)
    const userId = Number(searchParams.get('userId'))
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    let result = await pool.query(
      'SELECT * FROM feedback_sessions WHERE user_id=$1 AND is_active=true ORDER BY created_at DESC LIMIT 1',
      [userId]
    )
    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO feedback_sessions (user_id) VALUES ($1) RETURNING *',
        [userId]
      )
    }
    return NextResponse.json({ session: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

// POST { userId, action: 'close' } → close active session, return new session
export async function POST(req: NextRequest) {
  try {
    await ensureTables()
    const { userId, action } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    if (action === 'close') {
      await pool.query(
        'UPDATE feedback_sessions SET is_active=false, closed_at=now() WHERE user_id=$1 AND is_active=true',
        [userId]
      )
      const result = await pool.query(
        'INSERT INTO feedback_sessions (user_id) VALUES ($1) RETURNING *',
        [userId]
      )
      return NextResponse.json({ session: result.rows[0] })
    }
    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
