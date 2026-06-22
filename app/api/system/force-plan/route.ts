import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const LICENSE_TYPE_MAP: Record<string, string> = {
  System_Free_Run: 'תקופת הרצה',
  User_VIP_Free:   'VIP',
  System_Owner:    'מערכת',
}

export async function POST(req: NextRequest) {
  try {
    const { userId, systemForce } = await req.json()
    if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS system_force TEXT`)

    const forceValue = systemForce && systemForce !== 'User' ? systemForce : null

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_plan TEXT`)

    if (forceValue) {
      const licenseType = LICENSE_TYPE_MAP[forceValue]
      await pool.query(
        `UPDATE users SET system_force=$1, license_type=$2,
         user_plan = COALESCE(NULLIF(user_plan, ''), license_type),
         plan_start = CURRENT_DATE, plan_end = NULL
         WHERE id=$3`,
        [forceValue, licenseType, userId]
      )
    } else {
      await pool.query(
        `UPDATE users SET system_force=NULL,
         license_type = COALESCE(NULLIF(user_plan, ''), license_type)
         WHERE id=$1`,
        [userId]
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
