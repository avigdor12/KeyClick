import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { deleteVisitors, VISITOR_EMAIL_DOMAIN } from '@/lib/visitor'

// [Claude Code 27.10.2026, לפי הנחיית המשתמש] כפתור "איפוס משתמשים" בטבלת המשתמשים: מוחק רשומות אורח (visitor, בלי סיסמה)
// שהדף שלהן כבר לא פעיל - בלי סימן חיים יותר מ-20 דקות (אורח פעיל שולח סימן חיים כל 15 דקות)

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST() {
  try {
    const old = await pool.query(
      `SELECT id FROM users WHERE email LIKE $1 AND password_hash IS NULL AND COALESCE(last_login_at, created_at) < now() - interval '20 minutes'`,
      ['%' + VISITOR_EMAIL_DOMAIN]
    )
    const ids: number[] = old.rows.map(r => r.id)
    await deleteVisitors(ids)
    return NextResponse.json({ ok: true, deleted: ids })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
