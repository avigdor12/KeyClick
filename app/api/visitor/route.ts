import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import crypto from 'crypto'
import { syncUsersToApp } from '@/lib/mf-sync'
import { LICENSE_TYPES } from '@/lib/license-types'
import { VISITOR_EMAIL_DOMAIN, ensureVisitorColumns, hashVisitorKey, purgeStaleVisitors } from '@/lib/visitor'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] רשומת אורח: מבקר לא רשום שפותח את ניהול תקציב בית מקבל רשומת משתמש visitor_<id>
// בתוכנית תקופת הרצה, רק לצורך הרצת האפליקציה. בלי סיסמה, ונמחקת ביציאה מהאתר (ראה lib/visitor.ts).
// התשובה מחזירה מפתח סודי (key) שרק הדפדפן של האורח מחזיק; במסד נשמר רק ה-hash שלו.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { language, clientIp } = await req.json().catch(() => ({})) as { language?: string; clientIp?: string }
    await ensureVisitorColumns()
    await purgeStaleVisitors()
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? (req as NextRequest & { ip?: string }).ip
    const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
    const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp
    const country = req.headers.get('x-vercel-ip-country') || null
    const key = crypto.randomBytes(24).toString('base64url')
    // last_ip לא נקבע: זיהוי משתמש לפי IP לא צריך להחזיר רשומת אורח לאחרים באותה רשת
    const tempEmail = 'visitor_' + crypto.randomBytes(8).toString('hex') + VISITOR_EMAIL_DOMAIN
    const inserted = await pool.query(
      `INSERT INTO users (name, email, password_hash, language, license_type, user_plan, ip_registration, country, source, last_login_at, login_count, visitor_key)
       VALUES ('visitor', $1, NULL, $2, $3, $4, $5, $6, 'Visitor', now(), 1, $7) RETURNING id`,
      // license_type ו-user_plan בפרמטרים נפרדים: סוגי העמודות שונים, ופרמטר אחד לשתיהן נכשל ב-Postgres
      [tempEmail, language || 'he', LICENSE_TYPES.System_Free_Run, LICENSE_TYPES.System_Free_Run, ip, country, hashVisitorKey(key)]
    )
    const id = inserted.rows[0].id
    const updated = await pool.query(
      `UPDATE users SET name = $2, email = $3 WHERE id = $1
       RETURNING id, name, email, language, license_type AS "M_Finance_license_type", is_active, last_ip, ip_registration, country, created_at, plan_start, plan_end, system_force, currency`,
      [id, `visitor_${id}`, `visitor_${id}${VISITOR_EMAIL_DOMAIN}`]
    )
    await syncUsersToApp([id])
    return NextResponse.json({ ok: true, user: updated.rows[0], key })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
