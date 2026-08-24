import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { name, email, password, language, clientIp } = await req.json()

  if (!email) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  if (password && password.length < 6) {
    return NextResponse.json({ error: 'סיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
  }

  const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email])
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'כתובת המייל כבר רשומה, נא להתחבר', code: 'ALREADY_REGISTERED' }, { status: 409 })
  }

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? (req as NextRequest & { ip?: string }).ip
  const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
  const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

  const hash = password ? await bcrypt.hash(password, 10) : null
  await pool.query(
    'INSERT INTO users (name, email, password_hash, language, license_type, last_ip) VALUES ($1,$2,$3,$4,$5,$6)',
    [name || null, email, hash, language || 'English', 'תקופת הרצה', ip]
  )

  return NextResponse.json({ success: true, status: 'created' })
}
