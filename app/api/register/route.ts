import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { name, email, password, language } = await req.json()

  if (!email || !name) {
    return NextResponse.json({ error: 'שם ואימייל חובה' }, { status: 400 })
  }

  if (password && password.length < 6) {
    return NextResponse.json({ error: 'סיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
  }

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'אימייל כבר קיים במערכת' }, { status: 400 })
  }

  const hash = password ? await bcrypt.hash(password, 10) : null
  await pool.query(
    'INSERT INTO users (name, email, password_hash, language, license_type) VALUES ($1, $2, $3, $4, $5)',
    [name, email, hash, language || 'English', 'תקופת הרצה']
  )

  return NextResponse.json({ success: true })
}
