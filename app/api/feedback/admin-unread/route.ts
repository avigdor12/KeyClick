import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET() {
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS deleted_by_admin BOOLEAN DEFAULT false`)
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM feedback_messages
       WHERE is_read=false AND is_system=false AND deleted_by_admin=false`
    )
    return NextResponse.json({ hasUnread: (result.rows[0]?.count ?? 0) > 0 })
  } catch (e) {
    return NextResponse.json({ hasUnread: false, error: String(e) })
  }
}

export async function PATCH() {
  try {
    await pool.query(
      `UPDATE feedback_messages SET is_read=true
       WHERE is_read=false AND is_system=false AND deleted_by_admin=false`
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
