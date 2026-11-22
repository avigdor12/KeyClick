import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { LICENSE_TYPES } from '@/lib/license-types'
import { requireSelf, isAdminRequest, refuseLicenseTheft } from '@/lib/kc-security'
import { readKcUserId } from '@/lib/kc-auth'
// [22.11.2026] תוכניות שלקוח רשאי לבחור בעצמו (כמו CHANGE_PLAN_OPTIONS בדף הפרופיל). כל תוכנית אחרת (למשל 'מערכת' = מנהל) - רק מנהל
const CUSTOMER_PLANS: string[] = [LICENSE_TYPES.User_Trial, LICENSE_TYPES.User_Monthly, LICENSE_TYPES.User_Annual, LICENSE_TYPES.User_One_Time]

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, licenseType, planStart, planEnd } = await req.json()
    if (!userId || !licenseType) return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    // [22.11.2026] רק בעל החשבון (או מנהל) משנה תוכנית; לקוח - רק לתוכניות הלקוח. אחרת נחסם ונרשם ב"חשד לפריצה"
    const denied = await requireSelf(req, 'שינוי תוכנית', { id: userId }, true); if (denied) return denied
    if (!CUSTOMER_PLANS.includes(licenseType) && !(await isAdminRequest(req))) {
      // גניבת רשיון -> סגירת האתר, הודעת התרעה, חסימת חשבון
      return refuseLicenseTheft(req, `בקשה לרשיון "${licenseType}"`, readKcUserId(req), Number(userId))
    }

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_start DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_end DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS user_plan TEXT;
    `)

    const isActive = !['System_Suspended_NonPayment', 'User_Cancelled'].includes(licenseType)
    const result = await pool.query(
      `UPDATE users SET license_type=$1, user_plan=$2, plan_start=$3, plan_end=$4, is_active=$5
       WHERE id=$6
       RETURNING id, name, email, language, license_type AS "M_Finance_license_type", is_active, last_ip, plan_start, plan_end`,
      [licenseType, licenseType, planStart ?? null, planEnd ?? null, isActive, userId]
    )
    if (result.rowCount === 0) return NextResponse.json({ error: 'user not found' }, { status: 404 })
    await syncUsersToApp([Number(userId)])
    return NextResponse.json({ user: result.rows[0] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
