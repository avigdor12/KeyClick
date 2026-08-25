import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// מזהה לקוח חוזר לפי UUID של המחשב (שמור בדפדפן), לא לפי IP - ה-UUID ייחודי למחשב.
// מכוון: מחזיר רק מייל ושפה, לא סיסמה ולא סוג רישיון/הרשאת מנהל - אלה נקבעים רק אחרי
// כניסה מאומתת עם סיסמה, לא לפני.
// חריג יחיד: בסביבת פיתוח (NODE_ENV=development), מוחזר גם רשומת המשתמש המלאה - משמש את
// הדגל העוקף (Dev_Bypass_Login) כדי לזהות אם המפתח הוא System_Owner. לא נחשף בפרודקשן.
export async function POST(req: NextRequest) {
  const { uuidBiosCode } = await req.json()
  if (!uuidBiosCode) return NextResponse.json({ found: false })

  const result = await pool.query(
    'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE "UUID_Local_BIOS" = $1 LIMIT 1',
    [uuidBiosCode]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ found: false })

  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({ found: true, email: user.email, language: user.language, user })
  }
  return NextResponse.json({ found: true, email: user.email, language: user.language })
}
