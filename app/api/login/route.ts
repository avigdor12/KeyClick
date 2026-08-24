import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password, clientIp, uuidBiosCode } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })

  const result = await pool.query(
    'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", password_hash, "UUID_Local_BIOS" FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא', code: 'NOT_FOUND' }, { status: 401 })

  if (user.password_hash) {
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  if (!user.UUID_Local_BIOS) {
    return NextResponse.json({ error: 'לא נמצא קוד מכשיר רשום, יש להתקין את האפליקציה', code: 'NEEDS_INSTALL' }, { status: 409 })
  }

  if (!uuidBiosCode) {
    return NextResponse.json({ error: 'התהליך לא הצליח. פנה למנהל המערכת.', code: 'CRITICAL_FAILURE' }, { status: 409 })
  }

  if (user.UUID_Local_BIOS !== uuidBiosCode) {
    return NextResponse.json({ error: 'פרטי הלקוח רשומים במחשב אחר', code: 'WRONG_DEVICE' }, { status: 409 })
  }

  if (!user.is_active) {
    return NextResponse.json({ error: 'הרישום נכשל, נא לפנות למנהל המערכת', code: 'NEEDS_PLAN' }, { status: 409 })
  }

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? (req as NextRequest & { ip?: string }).ip
  const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
  const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

  await pool.query('UPDATE users SET last_ip=$1 WHERE id=$2', [ip, user.id])

  const { password_hash, ...userWithoutPass } = user
  return NextResponse.json({ success: true, user: { ...userWithoutPass, last_ip: ip } })
}
