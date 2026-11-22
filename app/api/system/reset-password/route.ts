import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUserByEmailToApp } from '@/lib/mf-sync'
import { hashPassword } from '@/lib/password'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'איפוס סיסמה למשתמש'); if (denied) return denied
  try {
    const { email, newPassword } = await req.json()
    console.log(`[reset-password] בקשת איפוס מהמנהל email="${email}"`)
    if (!email || !newPassword) { console.log('[reset-password] חסר מידע'); return NextResponse.json({ error: 'חסר מידע' }, { status: 400 }) }

    try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password BOOLEAN DEFAULT false`) } catch { /* ignore */ }

    const hash = hashPassword(newPassword)
    const result = await pool.query('UPDATE users SET password_hash=$1, temp_password=true WHERE email=$2', [hash, email])
    if (result.rowCount === 0) { console.log(`[reset-password] משתמש לא נמצא email="${email}"`); return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 }) }

    await syncUserByEmailToApp(email)
    console.log(`[reset-password] הצלחה email="${email}" temp_password=true`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(`[reset-password] שגיאה: ${String(err)}`)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
