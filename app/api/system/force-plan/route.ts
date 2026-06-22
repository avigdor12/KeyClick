import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const LICENSE_TYPE_MAP: Record<string, string> = {
  System_Free_Run: 'תקופת הרצה',
  User_VIP_Free:   'VIP',
  System_Owner:    'מערכת',
}

const SCHEDULE_IDX: Record<string, number> = {
  System_Free_Run: 1,
  User_VIP_Free:   3,
  System_Owner:    -1,
}

export async function POST(req: NextRequest) {
  try {
    const { userId, systemForce } = await req.json()
    if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS system_force TEXT`)
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS user_plan TEXT`)

    const forceValue = systemForce && systemForce !== 'User' ? systemForce : null

    if (forceValue) {
      const licenseType = LICENSE_TYPE_MAP[forceValue]

      // read schedule from DB
      let planEnd: string | null = null
      const schedIdx = SCHEDULE_IDX[forceValue] ?? -1
      if (schedIdx >= 0) {
        const sched = await pool.query(`SELECT value FROM system_DB_Records WHERE key='KeyClick_Schedule_Table'`)
        const rows: { months?: string }[] = JSON.parse(sched.rows[0]?.value ?? 'null')?.rows ?? []
        const months = parseInt(rows[schedIdx]?.months ?? '0') || 0
        if (months > 0) {
          const end = new Date()
          end.setMonth(end.getMonth() + months)
          planEnd = end.toISOString().slice(0, 10)
        }
      }

      await pool.query(
        `UPDATE users SET system_force=$1, license_type=$2,
         user_plan = COALESCE(NULLIF(user_plan, ''), license_type),
         plan_start = CURRENT_DATE, plan_end = $3
         WHERE id=$4`,
        [forceValue, licenseType, planEnd, userId]
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
