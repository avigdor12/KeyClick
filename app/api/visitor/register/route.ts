import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { hashPassword } from '@/lib/password'
import { visitorKeyOk } from '@/lib/visitor'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] הרשמה מאוחרת של אורח (מכרטיסיית האורח באפליקציה): השם, המייל והסיסמה נכתבים
// לרשומת האורח עצמה במקום visitor_<id>, כך שכל הנתונים שנטענו נשארים. עם סיסמה הרשומה כבר לא נחשבת אורח ולא נמחקת.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { id, key, name, email, password, language } = await req.json()
    if (!(await visitorKeyOk(Number(id), String(key || '')))) return NextResponse.json({ ok: false, error: 'visitor' }, { status: 403 })
    const cleanName = String(name || '').trim(), cleanEmail = String(email || '').trim()
    if (!cleanName) return NextResponse.json({ ok: false, error: 'name' }, { status: 400 })
    if (!EMAIL_RE.test(cleanEmail)) return NextResponse.json({ ok: false, error: 'email' }, { status: 400 })
    if (String(password || '').length < 6) return NextResponse.json({ ok: false, error: 'password_length' }, { status: 400 })
    const existing = await pool.query('SELECT id FROM users WHERE lower(email) = lower($1)', [cleanEmail])
    if (existing.rows.length) return NextResponse.json({ ok: false, error: 'exists' }, { status: 409 })
    const updated = await pool.query(
      `UPDATE users SET name = $2, email = $3, password_hash = $4, language = COALESCE($5, language), visitor_key = NULL WHERE id = $1
       RETURNING id, name, email, language, license_type AS "M_Finance_license_type", is_active, last_ip, ip_registration, country, created_at, plan_start, plan_end, system_force, currency`,
      [Number(id), cleanName, cleanEmail, hashPassword(String(password)), language || null]
    )
    await syncUsersToApp([Number(id)])
    return NextResponse.json({ ok: true, user: updated.rows[0] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
