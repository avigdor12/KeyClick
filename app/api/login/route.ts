import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { verifyPassword } from '@/lib/password'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password, clientIp } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })

  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`) } catch { /* ignore */ }
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password BOOLEAN DEFAULT false`) } catch { /* ignore */ }
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP, ADD COLUMN IF NOT EXISTS login_count INTEGER NOT NULL DEFAULT 0, ADD COLUMN IF NOT EXISTS source TEXT`) } catch { /* ignore */ }
  const result = await pool.query(
    'SELECT id, name, email, language, country, license_type AS "M_Finance_license_type", is_active, password_hash, temp_password FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא', code: 'NOT_FOUND' }, { status: 401 })

  if (user.password_hash) {
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

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
  return NextResponse.json({ success: true, user: { ...userWithoutPass, last_ip: ip } })
}
