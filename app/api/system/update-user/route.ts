import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const ALLOWED = ['is_active', 'name', 'email', 'notes', 'weighted_score', 'country']

async function POST_handler(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'עדכון פרטי משתמש'); if (denied) return denied
  try {
    const { userId, field, value } = await req.json()
    if (!ALLOWED.includes(field)) return NextResponse.json({ ok: false, error: 'field not allowed' }, { status: 400 })
    await pool.query(`UPDATE users SET "${field}"=$1 WHERE id=$2`, [value, Number(userId)])
    await syncUsersToApp([Number(userId)])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
