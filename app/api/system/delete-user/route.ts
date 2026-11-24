import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncDeleteToApp } from '@/lib/mf-sync'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function POST_handler(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'מחיקת משתמש'); if (denied) return denied
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
    await syncDeleteToApp([id])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
