import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })

  const result = await pool.query(
    'SELECT id, name, email, language, license_type, is_active, password_hash FROM users WHERE email = $1',
    [email]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 401 })

  if (user.password_hash) {
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
              ?? req.headers.get('x-real-ip')
              ?? 'unknown'

  if (ip !== 'unknown') {
    await pool.query('UPDATE users SET last_ip=$1 WHERE id=$2', [ip, user.id])
  }

  const { password_hash, ...userWithoutPass } = user
  return NextResponse.json({ success: true, user: { ...userWithoutPass, last_ip: ip } })
}
