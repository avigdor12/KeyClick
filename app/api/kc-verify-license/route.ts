import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { readKcUserId } from '@/lib/kc-auth'
import { securityPool, blockedState, refuseLicenseTheft } from '@/lib/kc-security'

// [22.11.2026 אביגדור] גניבת רשיון: בכל שינוי של הרשיון בזיכרון הדפדפן (app/HomeClient.tsx) הדפדפן שולח אותו לכאן.
// שינוי חוקי (בחירת תוכנית, שינוי של המנהל, כניסה) מגיע תמיד מהשרת - זהה למסד. רשיון ששונה בדפדפן לא זהה למסד ->
// קוד פריצה 3 (גניבת רשיון), קודי חסימה 1,2,4: סגירת האתר, הודעת התרעה, חסימת חשבון עד "שחרור כללי".
async function POST_handler(req: Request) {
  const uid = readKcUserId(req)
  if (!uid) return NextResponse.json({ ok: true })   // אין משתמש מחובר - אין מה לבדוק
  const blocked = await blockedState(req, uid); if (blocked) return blocked
  const { license } = await req.json().catch(() => ({})) as { license?: string }
  if (license === undefined || license === null) return NextResponse.json({ ok: true })
  const pool = await securityPool()
  const r = await pool.query('SELECT license_type FROM users WHERE id = $1', [uid])
  const real = r.rows[0]?.license_type ?? null
  if (real === license) return NextResponse.json({ ok: true })
  return refuseLicenseTheft(req, `רשיון בדפדפן "${license}" - במסד "${real ?? ''}"`, uid, uid)
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
