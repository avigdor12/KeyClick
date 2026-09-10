import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// זיהוי מדינה מ-IP (אותו שירות שטבלת visits משתמשת בו), פעם אחת בהרשמה
async function lookupCountry(ip: string): Promise<string | null> {
  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip === 'unknown'
    || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)) return null
  try {
    const r = await fetch(`https://ipwho.is/${ip}`)
    const d = await r.json()
    return d?.success ? (d.country ?? null) : null
  } catch { return null }
}

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
  try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`) } catch { /* ignore */ }
  const country = await lookupCountry(ip)
  const inserted = await pool.query(
    `INSERT INTO users (name, email, password_hash, language, license_type, last_ip, ip_registration, country)
     VALUES ($1,$2,$3,$4,$5,$6,$6,$7)
     RETURNING id, name, email, language, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, ip_registration, country`,
    [name || null, email, hash, language || 'English', 'תקופת הרצה', ip, country]
  )

  return NextResponse.json({ success: true, status: 'created', user: inserted.rows[0] })
}
