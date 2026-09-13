import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json()
    console.log(`[reset-password] בקשת איפוס מהמנהל email="${email}"`)
    if (!email || !newPassword) { console.log('[reset-password] חסר מידע'); return NextResponse.json({ error: 'חסר מידע' }, { status: 400 }) }

    try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password BOOLEAN DEFAULT false`) } catch { /* ignore */ }

    const hash = await bcrypt.hash(newPassword, 10)
    const result = await pool.query('UPDATE users SET password_hash=$1, temp_password=true WHERE email=$2', [hash, email])
    if (result.rowCount === 0) { console.log(`[reset-password] משתמש לא נמצא email="${email}"`); return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 }) }

    console.log(`[reset-password] הצלחה email="${email}" temp_password=true`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(`[reset-password] שגיאה: ${String(err)}`)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
