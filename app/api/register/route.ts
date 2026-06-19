import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { name, email, password, language, clientIp } = await req.json()

  if (password && password.length < 6) {
    return NextResponse.json({ error: 'סיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
  }

  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? (req as NextRequest & { ip?: string }).ip
  const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
  const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp

  const existing = email
    ? await pool.query('SELECT * FROM users WHERE email=$1', [email])
    : await pool.query('SELECT * FROM users WHERE last_ip=$1', [ip])

  if (existing.rows.length > 0) {
    const user = existing.rows[0]
    const updates: string[] = []
    const vals: unknown[] = []
    let i = 1
    if (name && name !== user.name)           { updates.push(`name=$${i++}`);          vals.push(name) }
    if (language && language !== user.language){ updates.push(`language=$${i++}`);      vals.push(language) }
    if (ip && ip !== user.last_ip)            { updates.push(`last_ip=$${i++}`);        vals.push(ip) }
    if (password) {
      const hash = await bcrypt.hash(password, 10)
      updates.push(`password_hash=$${i++}`)
      vals.push(hash)
    }
    if (updates.length > 0) {
      vals.push(user.id)
      await pool.query(`UPDATE users SET ${updates.join(',')} WHERE id=$${i}`, vals)
      return NextResponse.json({ success: true, status: 'updated' })
    }
    return NextResponse.json({ success: true, status: 'exists' })
  }

  const hash = password ? await bcrypt.hash(password, 10) : null
  await pool.query(
    'INSERT INTO users (name, email, password_hash, language, license_type, last_ip) VALUES ($1,$2,$3,$4,$5,$6)',
    [name || null, email || null, hash, language || 'English', 'תקופת הרצה', ip]
  )

  return NextResponse.json({ success: true, status: 'created' })
}
