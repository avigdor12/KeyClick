import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { verifyPassword } from '@/lib/password'
import { withKcToken } from '@/lib/kc-auth'
import { loginLocked, recordLoginFailure, clearLoginFailures, logLoginLocked, LOGIN_LOCKED_TEXT, blockedState, blockedResponse, securityPool } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password, clientIp } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  // [22.11.2026] כתובת IP חסומה (חסימת גישה מטבלת חשד לפריצה) - אין כניסה
  const ipBlocked = await blockedState(req, null); if (ipBlocked) return ipBlocked
  // [22.11.2026] Login כשלים רבים (lib/kc-security.ts): 5 כושלים ב-15 דקות לאותו אימייל -> השהייה ל-15 דקות, ונרשם ב"חשד לפריצה"
  if (await loginLocked(email)) {
    await logLoginLocked(req, email)
    return NextResponse.json({ error: LOGIN_LOCKED_TEXT, code: 'LOGIN_LOCKED' }, { status: 429 })
  }

  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`) } catch { /* ignore */ }
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password BOOLEAN DEFAULT false`) } catch { /* ignore */ }
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP, ADD COLUMN IF NOT EXISTS login_count INTEGER NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS source TEXT`) } catch { /* ignore */ }
  const result = await pool.query(
    'SELECT id, name, email, language, country, license_type AS "M_Finance_license_type", is_active, password_hash, temp_password FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) { await recordLoginFailure(req, email); return NextResponse.json({ error: 'משתמש לא נמצא', code: 'NOT_FOUND' }, { status: 401 }) }

  if (user.password_hash) {
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) { await recordLoginFailure(req, email); return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 }) }
    await clearLoginFailures(email)
  }

  // [22.11.2026] חשבון חסום (חסימת חשבון / חסימת גישה מטבלת חשד לפריצה) - אין כניסה עד "שחרור כללי"
  const sp = await securityPool()
  const sb = await sp.query('SELECT security_blocked FROM users WHERE id = $1', [user.id])
  if (sb.rows[0]?.security_blocked) { console.log(`[login] security_blocked email="${email}"`); return blockedResponse() }

  if (!user.is_active) {
    return NextResponse.json({ error: 'התהליך לא הצליח. נא לפנות למנהל המערכת.', code: 'NEEDS_PLAN' }, { status: 409 })
  }

  if (user.temp_password) {
    console.log(`[login] temp_password=true email="${email}" => הלקוח יידרש לבחור סיסמה חדשה`)
  }

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? (req as NextRequest & { ip?: string }).ip
  const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
  const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

  await pool.query('UPDATE users SET last_ip=$1, last_login_at=now(), login_count=login_count+1 WHERE id=$2', [ip, user.id])
  await syncUsersToApp([user.id])

  const { password_hash, ...userWithoutPass } = user
  // [22.11.2026] אישור כניסה חתום בכותרת x-kc-token (lib/kc-auth.ts)
  return withKcToken(NextResponse.json({ success: true, user: { ...userWithoutPass, last_ip: ip } }), user.id)
}
