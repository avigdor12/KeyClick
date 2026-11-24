import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireSelf } from '@/lib/kc-security'
// [22.11.2026] הודעת מערכת כללית (user_id ריק) - "נקראה" נשמר לכל לקוח בנפרד בטבלה feedback_user_state (ראה app/api/feedback/route.ts)
// [22.11.2026] שלב 3 בתיקון האבטחה (lib/kc-security.ts): כל פעולה נבדקת מול בעל האישור החתום - לקוח רק על החשבון שלו, מנהל על כולם.
// ניסיון על חשבון אחר נחסם ונרשם ב"חשד לפריצה".

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function GET_handler(req: NextRequest) {
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS customer_read BOOLEAN DEFAULT false`)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    if (!userId) return NextResponse.json({ hasUnread: false })
    const denied = await requireSelf(req, 'בדיקת הודעות שלא נקראו', { id: userId }, true); if (denied) return denied
    await pool.query(`CREATE TABLE IF NOT EXISTS feedback_user_state (user_id INTEGER NOT NULL, message_id INTEGER NOT NULL, hidden BOOLEAN NOT NULL DEFAULT FALSE, read BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY (user_id, message_id))`)
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM feedback_messages m
       WHERE (m.user_id=$1 OR (m.is_system=true AND m.user_id IS NULL))
         AND m.customer_read=false
         AND (m.is_system=true OR m.reply_text IS NOT NULL)
         AND NOT EXISTS (SELECT 1 FROM feedback_user_state s WHERE s.user_id=$1 AND s.message_id=m.id AND (s.read OR s.hidden))`,
      [Number(userId)]
    )
    return NextResponse.json({ hasUnread: (result.rows[0]?.count ?? 0) > 0 })
  } catch (e) {
    return NextResponse.json({ hasUnread: false, error: String(e) })
  }
}

async function PATCH_handler(req: NextRequest) {
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS customer_read BOOLEAN DEFAULT false`)
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ ok: false })
    const denied = await requireSelf(req, 'סימון הודעות כנקראו', { id: userId }, true); if (denied) return denied
    await pool.query(`CREATE TABLE IF NOT EXISTS feedback_user_state (user_id INTEGER NOT NULL, message_id INTEGER NOT NULL, hidden BOOLEAN NOT NULL DEFAULT FALSE, read BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY (user_id, message_id))`)
    // הודעות של הלקוח עצמו - בהודעה; הודעות מערכת כלליות - רק אצלו
    await pool.query(
      `UPDATE feedback_messages SET customer_read=true
       WHERE user_id=$1
         AND customer_read=false
         AND (is_system=true OR reply_text IS NOT NULL)`,
      [Number(userId)]
    )
    await pool.query(
      `INSERT INTO feedback_user_state (user_id, message_id, read)
       SELECT $1, id, TRUE FROM feedback_messages WHERE is_system=true AND user_id IS NULL AND customer_read=false
       ON CONFLICT (user_id, message_id) DO UPDATE SET read = TRUE`,
      [Number(userId)]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const PATCH = withDbQuota(PATCH_handler)
