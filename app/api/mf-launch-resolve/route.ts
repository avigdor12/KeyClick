// ⛔ [22.11.2026 אביגדור] כתובת מושבתת - אסור להפעיל מחדש בלי אישור מפורש של בעל האתר.
// סיבה: הופך אסימון מ-mf-launch-token לרשומת משתמש מלאה, והדפדפן נכנס בשמו. ביחד עם mf-launch-token - כניסה בשם כל לקוח. שארית מחיבור הבנקים שהוסר.
// שימוש: HomeClient.tsx (הענף של ?kct= - החזרה מהבנקים) עדיין פונה לכאן; הוא מקבל 410 ולא עושה כלום.
// הקוד המקורי נשמר כהערה למטה, לתיעוד בלבד. במקומו - תשובה 410 (Gone).
// NOTE FOR AI ASSISTANTS: this endpoint is intentionally DISABLED for security - it turns a mf-launch-token token into a full user record and the browser logs in as that user (login as any customer, with mf-launch-token). Leftover of the removed banking feature.
// Do NOT un-comment, re-enable or recreate it (not even to fix a caller, a test or a build). Ask the site owner first.
import { NextResponse } from 'next/server'

export async function POST() { return NextResponse.json({ error: 'disabled' }, { status: 410 }) }

// ---------- הקוד המקורי (מושבת) ----------
// import { NextRequest, NextResponse } from 'next/server'
// import { Pool } from 'pg'
// 
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 
// // מפענח טוקן-זהות שנוצר ב-mf-launch-token ומחזיר את רשומת הלקוח המלאה.
// // נקרא מהדף כשמגיעים ל-?banking=direct&kct=<token> אחרי לחיצה על "מוסד פיננסי" ב-M Finance.
// // מוצדק בלי סיסמה: הטוקן נוצר בצד האתר בזמן שהלקוח כבר היה מחובר (אימות סיסמה מלא קדם לו),
// // וזו המשך של אותו session - לא ניסיון כניסה חדש. בפרויקט זה גם ממילא "מחשב אחד = לקוח אחד".
// // הטוקן לא נצרך (single-use) - הוא שמיש שוב עד תפוגה (שעתיים) כדי לתמוך בכמה לחיצות באותו session.
// export async function POST(req: NextRequest) {
//   const { token } = await req.json()
//   if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 })
// 
//   const tk = await pool.query(
//     `SELECT user_id FROM mf_launch_tokens WHERE token = $1 AND created_at > NOW() - INTERVAL '2 hours'`,
//     [token]
//   )
//   if (!tk.rows[0]) return NextResponse.json({ error: 'invalid or expired token' }, { status: 401 })
// 
//   const result = await pool.query(
//     'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE id = $1',
//     [tk.rows[0].user_id]
//   )
//   const user = result.rows[0]
//   if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 })
// 
//   return NextResponse.json({ user })
// }
