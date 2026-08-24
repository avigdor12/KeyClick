import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })

  const result = await pool.query(
    'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, password_hash, "UUID_Local_BIOS" FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא', code: 'NOT_FOUND' }, { status: 401 })

  if (user.password_hash) {
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const { password_hash, ...userWithoutPass } = user

  if (!user.UUID_Local_BIOS) {
    return NextResponse.json({ error: 'לא נמצא קוד מכשיר רשום, יש להתקין את האפליקציה', code: 'NEEDS_INSTALL', user: userWithoutPass }, { status: 409 })
  }

  return NextResponse.json({ ok: true, user: userWithoutPass })
}
