import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: NextRequest) {
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS customer_read BOOLEAN DEFAULT false`)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ hasUnread: false })
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM feedback_messages
       WHERE (user_id=$1 OR (is_system=true AND user_id IS NULL))
         AND customer_read=false
         AND (is_system=true OR reply_text IS NOT NULL)`,
      [Number(userId)]
    )
    return NextResponse.json({ hasUnread: (result.rows[0]?.count ?? 0) > 0 })
  } catch (e) {
    return NextResponse.json({ hasUnread: false, error: String(e) })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS customer_read BOOLEAN DEFAULT false`)
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ ok: false })
    await pool.query(
      `UPDATE feedback_messages SET customer_read=true
       WHERE (user_id=$1 OR (is_system=true AND user_id IS NULL))
         AND customer_read=false
         AND (is_system=true OR reply_text IS NOT NULL)`,
      [Number(userId)]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
