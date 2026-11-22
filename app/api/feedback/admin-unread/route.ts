import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin, securityPool } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'בדיקת הודעות חדשות (מנהל)'); if (denied) return denied
  try {
    await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS deleted_by_admin BOOLEAN DEFAULT false`)
    const result = await pool.query(
      `SELECT COUNT(*)::int AS count FROM feedback_messages
       WHERE is_read=false AND is_system=false AND deleted_by_admin=false`
    )
    // [22.11.2026] securityAlert - יש מקרה "חשד לפריצה" חדש שהמנהל עוד לא הקיש עליו ב"הודעה מהשרת" -> אצל המנהל: צליל + השורה "הודעה מהשרת" (כמו הודעה חדשה מלקוח)
    let securityAlert = false
    try {
      const sp = await securityPool()
      const sr = await sp.query('SELECT COUNT(*)::int AS count FROM security_incidents WHERE seen = FALSE')
      securityAlert = (sr.rows[0]?.count ?? 0) > 0
    } catch { /* ignore */ }
    return NextResponse.json({ hasUnread: (result.rows[0]?.count ?? 0) > 0, securityAlert })
  } catch (e) {
    return NextResponse.json({ hasUnread: false, error: String(e) })
  }
}

export async function PATCH(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'סימון הודעות כנקראו (מנהל)'); if (denied) return denied
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
