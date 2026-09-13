import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// [Claude Code 13.09.2026, לפי הנחיית המשתמש] הלקוח בוחר סיסמה חדשה בעצמו (אחרי כניסה עם סיסמה זמנית שהמנהל קבע) -
// מוריד את דגל temp_password בסיום.
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json()
    console.log(`[change-password] בקשת החלפת סיסמה מהלקוח email="${email}"`)
    if (!email || !newPassword) { console.log('[change-password] חסר מידע'); return NextResponse.json({ error: 'חסר מידע' }, { status: 400 }) }

    const hash = await bcrypt.hash(newPassword, 10)
    const result = await pool.query('UPDATE users SET password_hash=$1, temp_password=false WHERE email=$2', [hash, email])
    if (result.rowCount === 0) { console.log(`[change-password] משתמש לא נמצא email="${email}"`); return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 }) }

    console.log(`[change-password] הצלחה email="${email}" temp_password=false`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.log(`[change-password] שגיאה: ${String(err)}`)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
