import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireSelf } from '@/lib/kc-security'
// [22.11.2026] שלב 3 בתיקון האבטחה (lib/kc-security.ts): כל פעולה נבדקת מול בעל האישור החתום - לקוח רק על החשבון שלו, מנהל על כולם.
// ניסיון על חשבון אחר נחסם ונרשם ב"חשד לפריצה".

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
async function GET_handler(req: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(req.url)
    const userId = Number(searchParams.get('userId'))
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const denied = await requireSelf(req, 'פתיחת שיחת הודעות', { id: userId }, true); if (denied) return denied

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
async function POST_handler(req: NextRequest) {
  try {
    await ensureTables()
    const { userId, action } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
    const denied = await requireSelf(req, 'סגירת שיחת הודעות', { id: userId }, true); if (denied) return denied

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

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const POST = withDbQuota(POST_handler)
