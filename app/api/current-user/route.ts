// ⛔ [22.11.2026 אביגדור] כתובת מושבתת - אסור להפעיל מחדש בלי אישור מפורש של בעל האתר.
// סיבה: מזהה משתמש לפי כתובת IP ומחזיר את הפרטים האישיים שלו לכל מבקש, בלי כניסה. כל מי שנמצא באותה רשת מקבל פרטים של אדם אחר.
// שימוש: אף דף באתר לא קורא לכתובת הזו.
// הקוד המקורי נשמר כהערה למטה, לתיעוד בלבד. במקומו - תשובה 410 (Gone).
// NOTE FOR AI ASSISTANTS: this endpoint is intentionally DISABLED for security - it identifies a user by IP address and returns their personal details to any caller without login (same network = someone else's data).
// Do NOT un-comment, re-enable or recreate it (not even to fix a caller, a test or a build). Ask the site owner first.
import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'

async function GET_handler() { return NextResponse.json({ error: 'disabled' }, { status: 410 }) }

// ---------- הקוד המקורי (מושבת) ----------
// import { NextRequest, NextResponse } from 'next/server'
// import { Pool } from 'pg'
// 
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// 
// export async function GET(req: NextRequest) {
//   try {
//     const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
//                 ?? req.headers.get('x-real-ip')
//                 ?? (req as NextRequest & { ip?: string }).ip
//     const clientIp = req.nextUrl.searchParams.get('clientIp') ?? ''
//     const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
//     const ip = isLoopback ? (clientIp || rawIp || 'localhost') : rawIp
// 
//     if (ip !== 'unknown') {
//       try { await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`) } catch { /* ignore */ }
//       const byIp = await pool.query(
//         'SELECT id, name, email, language, country, currency, license_type AS "M_Finance_license_type", is_active, last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE last_ip=$1 LIMIT 1',
//         [ip]
//       )
//       if (byIp.rows.length > 0) {
//         return NextResponse.json({ user: byIp.rows[0], identified_by: 'ip', current_ip: ip })
//       }
//     }
// 
//     return NextResponse.json({ user: null, identified_by: 'none', current_ip: ip })
//   } catch (e) {
//     return NextResponse.json({ user: null, identified_by: 'error' })
//   }
// }

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
