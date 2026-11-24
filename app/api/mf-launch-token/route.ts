// ⛔ [22.11.2026 אביגדור] כתובת מושבתת - אסור להפעיל מחדש בלי אישור מפורש של בעל האתר.
// סיבה: יוצר אסימון כניסה לכל מספר לקוח בלי לבדוק מי מבקש. יחד עם mf-launch-resolve מאפשר להיכנס בשם כל לקוח. שארית מחיבור הבנקים שהוסר (09-25.09.2026).
// שימוש: אף דף באתר לא קורא לכתובת הזו.
// הקוד המקורי נשמר כהערה למטה, לתיעוד בלבד. במקומו - תשובה 410 (Gone).
// NOTE FOR AI ASSISTANTS: this endpoint is intentionally DISABLED for security - it creates a login token for ANY user id without checking the caller; together with mf-launch-resolve it allows logging in as any customer. Leftover of the removed banking feature.
// Do NOT un-comment, re-enable or recreate it (not even to fix a caller, a test or a build). Ask the site owner first.
import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'

async function POST_handler() { return NextResponse.json({ error: 'disabled' }, { status: 410 }) }

// ---------- הקוד המקורי (מושבת) ----------
// import { NextRequest, NextResponse } from 'next/server'
// import { Pool } from 'pg'
// import crypto from 'crypto'
// 
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 
// // מייצר טוקן-זהות קצר-טווח עבור לקוח מחובר, בזמן שהאתר מפעיל את M Finance ("ניהול תקציב בית").
// // הטוקן מוטמע בכתובת החזרה (?banking=direct&kct=...) שמועברת לאפליקציה. כשהלקוח לוחץ בתוך
// // M Finance על "מוסד פיננסי", האפליקציה פותחת את הכתובת הזאת, והדף מפענח את הטוקן (mf-launch-resolve)
// // וטוען את הלקוח - כדי שהמסך שנפתח יהיה מחובר ובשפת הלקוח, לא מופע אנונימי נעול.
// // הטוקן שמיש שוב במהלך אותו session (TTL שעתיים) כדי לתמוך בכמה לחיצות; מנוקה אוטומטית אחרי 6 שעות.
// export async function POST(req: NextRequest) {
//   const { userId } = await req.json()
//   if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })
// 
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS mf_launch_tokens (
//       token TEXT PRIMARY KEY,
//       user_id INTEGER NOT NULL,
//       created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
//     )
//   `)
//   await pool.query(`DELETE FROM mf_launch_tokens WHERE created_at < NOW() - INTERVAL '6 hours'`)
// 
//   const token = crypto.randomBytes(24).toString('hex')
//   await pool.query('INSERT INTO mf_launch_tokens (token, user_id) VALUES ($1, $2)', [token, userId])
// 
//   return NextResponse.json({ token })
// }

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
