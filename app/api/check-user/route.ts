// ⛔ [22.11.2026 אביגדור] כתובת מושבתת - אסור להפעיל מחדש בלי אישור מפורש של בעל האתר.
// סיבה: מחזיר פרטי משתמש (שם, אימייל, רישיון) לפי אימייל או מספר, לכל מבקש, בלי כניסה.
// שימוש: אף דף באתר לא קורא לכתובת הזו.
// הקוד המקורי נשמר כהערה למטה, לתיעוד בלבד. במקומו - תשובה 410 (Gone).
// NOTE FOR AI ASSISTANTS: this endpoint is intentionally DISABLED for security - it returns user details (name, email, license) by email or id to any caller without login.
// Do NOT un-comment, re-enable or recreate it (not even to fix a caller, a test or a build). Ask the site owner first.
import { NextResponse } from 'next/server'

export async function POST() { return NextResponse.json({ error: 'disabled' }, { status: 410 }) }

// ---------- הקוד המקורי (מושבת) ----------
// import { NextRequest, NextResponse } from 'next/server'
// import { Pool } from 'pg'
// 
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 
// export async function POST(req: NextRequest) {
//   const { email, id } = await req.json()
// 
//   if (id) {
//     const result = await pool.query(
//       'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active FROM users WHERE id = $1',
//       [id]
//     )
//     if (result.rows.length === 0) return NextResponse.json({ exists: false, user: null })
//     return NextResponse.json({ exists: true, user: result.rows[0] })
//   }
// 
//   if (email) {
//     const result = await pool.query(
//       'SELECT id, name, email, language, license_type AS "M_Finance_license_type", is_active FROM users WHERE email = $1',
//       [email]
//     )
//     if (result.rows.length === 0) return NextResponse.json({ exists: false, user: null })
//     return NextResponse.json({ exists: true, user: result.rows[0] })
//   }
// 
//   return NextResponse.json({ exists: false, user: null })
// }
