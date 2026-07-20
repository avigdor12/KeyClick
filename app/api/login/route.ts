import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password, clientIp } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })

  const result = await pool.query(
    'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", password_hash, ip_registration FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא', code: 'NOT_FOUND' }, { status: 401 })

  if (user.password_hash) {
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? (req as NextRequest & { ip?: string }).ip
  const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
  const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

  if (user.ip_registration && ip && user.ip_registration !== ip) {
    return NextResponse.json({ error: 'פרטי הלקוח רשומים במחשב אחר' }, { status: 409 })
  }

  await pool.query("UPDATE system_DB_Records SET value=$1 WHERE key='Current_User'", [String(user.id)])
  await pool.query('UPDATE users SET last_ip=$1 WHERE id=$2', [ip, user.id])

  const { password_hash, ...userWithoutPass } = user
  return NextResponse.json({ success: true, user: { ...userWithoutPass, last_ip: ip } })
}
