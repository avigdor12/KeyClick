import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    const id = Number(userId)
    if (!id) return NextResponse.json({ ok: false, error: 'missing userId' }, { status: 400 })

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM payments WHERE user_id=$1', [id])
      await client.query('DELETE FROM feedback_messages WHERE user_id=$1', [id])
      await client.query('DELETE FROM keyclick_reminders WHERE user_id=$1', [id])
      await client.query('DELETE FROM feedback_sessions WHERE user_id=$1', [id])
      await client.query('DELETE FROM users WHERE id=$1', [id])
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
