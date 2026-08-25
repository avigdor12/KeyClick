import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// מזהה לקוח חוזר לפי UUID של המחשב (שמור בדפדפן), לא לפי IP - ה-UUID ייחודי למחשב.
// מכוון: מחזיר רק מייל ושפה, לא סיסמה ולא סוג רישיון/הרשאת מנהל - אלה נקבעים רק אחרי
// כניסה מאומתת עם סיסמה, לא לפני.
export async function POST(req: NextRequest) {
  const { uuidBiosCode } = await req.json()
  if (!uuidBiosCode) return NextResponse.json({ found: false })

  const result = await pool.query(
    'SELECT email, language FROM users WHERE "UUID_Local_BIOS" = $1 LIMIT 1',
    [uuidBiosCode]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ found: false })

  return NextResponse.json({ found: true, email: user.email, language: user.language })
}
