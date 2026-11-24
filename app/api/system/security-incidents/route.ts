import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { requireAdmin, securityPool } from '@/lib/kc-security'
import { DECISION } from '@/lib/kc-security-codes'

// [22.11.2026 אביגדור] טבלת "חשד לפריצה" (בשימוש המערכת > איסוף נתונים > אבטחת מידע). מנהל בלבד.
// GET   - כל המקרים, עם פרטי הפורץ (actor - לפי אישור הכניסה; IP ומדינה - של הפנייה) ופרטי המשתמש שעליו ניסה לפעול (target - מטבלת המשתמשים)
// PATCH - { id, notes } עמודת הערות (טקסט חופשי של המנהל).
// PATCH - { id, status } עמודת החלטת מנהל: '' / '1' בדיקה / '2' המשך חסימה / '3' שחרור (מסיר את חסימת החשבון ואת חסימת ה-IP של המקרה).
// PATCH - { seenAll: true } הקשה על "הודעה מהשרת": כל המקרים סומנו כנראו, וההתראה נעלמת עד מקרה חדש.
// DELETE - איפוס: מוחק את כל המקרים (כפתור "איפוס", כמו בשאר הטבלאות). מקרה שטופל לא מפעיל את ההתראה "הודעה מהשרת"

async function GET_handler(req: Request) {
  const denied = await requireAdmin(req, 'צפייה בטבלת חשד לפריצה'); if (denied) return denied
  try {
    const pool = await securityPool()
    const r = await pool.query(`
      SELECT s.id, s.created_at, s.last_at, s.hits, s.kind, s.action, s.actor_id, s.target_id, s.target_email,
             s.ip, s.country, s.region, s.city, s.user_agent, s.status, s.notes, s.breach, s.measures, s.source,
             a.name AS actor_name, a.email AS actor_email, a.license_type AS actor_license,
             a.country AS actor_country,
             t.id AS target_user_id, t.name AS target_name, COALESCE(t.email, s.target_email) AS target_user_email,
             t.license_type AS target_license, t.last_ip AS target_ip, t.country AS target_country
      FROM security_incidents s
      LEFT JOIN users a ON a.id = s.actor_id
      LEFT JOIN users t ON t.id = s.target_id OR (s.target_id IS NULL AND s.target_email IS NOT NULL AND lower(t.email) = lower(s.target_email))
      ORDER BY s.id`)
    return NextResponse.json({ incidents: r.rows })
  } catch (e) {
    return NextResponse.json({ incidents: [], error: String(e) })
  }
}

async function PATCH_handler(req: Request) {
  const denied = await requireAdmin(req, 'סימון מקרה כטופל'); if (denied) return denied
  try {
    const { id, status, notes, seenAll } = await req.json().catch(() => ({})) as { id?: number; status?: string; notes?: string; seenAll?: boolean }
    const pool = await securityPool()
    if (seenAll) { await pool.query('UPDATE security_incidents SET seen = TRUE WHERE seen = FALSE'); return NextResponse.json({ ok: true }) }
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
    if (notes !== undefined) {
      await pool.query('UPDATE security_incidents SET notes = $1 WHERE id = $2', [String(notes).slice(0, 4000), Number(id)])
    } else {
      if (!['', '1', '2', '3', '4'].includes(String(status)))   // [23.11.2026] + 4 ללא שינוי
      return NextResponse.json({ error: 'bad decision' }, { status: 400 })
      await pool.query('UPDATE security_incidents SET status = $1 WHERE id = $2', [status, Number(id)])
      if (Number(status) === DECISION.RELEASE) {
        const inc = (await pool.query('SELECT actor_id, ip FROM security_incidents WHERE id = $1', [Number(id)])).rows[0]
        if (inc?.actor_id) await pool.query('UPDATE users SET security_blocked = FALSE WHERE id = $1', [inc.actor_id])
        if (inc?.ip) await pool.query('DELETE FROM security_blocked_ips WHERE ip = $1', [inc.ip])
        console.log(`[security] release incident=${id} actor=${inc?.actor_id ?? 'none'} ip=${inc?.ip ?? ''}`)
      }
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

async function DELETE_handler(req: Request) {
  const denied = await requireAdmin(req, 'איפוס טבלת חשד לפריצה'); if (denied) return denied
  try {
    const pool = await securityPool()
    await pool.query('DELETE FROM security_incidents')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const PATCH = withDbQuota(PATCH_handler)
export const DELETE = withDbQuota(DELETE_handler)
