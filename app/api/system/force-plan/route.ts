import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const LICENSE_TYPE_MAP: Record<string, string> = {
  System_Free_Run: 'תקופת הרצה',
  User_VIP_Free:   'VIP',
  System_Owner:    'מערכת',
}

const LICENSE_TO_SCHED_IDX: Record<string, number> = {
  'תקופת הרצה':   1,
  'תקופת נסיון':  2,
  'VIP':           3,
  'מערכת':         -1,
  'חודשי':         4,
  'שנתי':          5,
  'כניסה בודדת':   6,
}

async function getScheduleMonths(idx: number): Promise<number> {
  if (idx < 0) return 0
  const sched = await pool.query(`SELECT value FROM system_DB_Records WHERE key='KeyClick_Schedule_Table'`)
  const rows: { months?: string }[] = JSON.parse(sched.rows[0]?.value ?? 'null')?.rows ?? []
  return parseInt(rows[idx]?.months ?? '0') || 0
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
      await pool.query(
        `UPDATE users SET system_force=$1, license_type=$2,
         user_plan = COALESCE(NULLIF(user_plan, ''), license_type),
         plan_start = CURRENT_DATE, plan_end = NULL
         WHERE id=$3`,
        [forceValue, licenseType, userId]
      )
    } else {
      const userRow = await pool.query(
        `SELECT user_plan, created_at FROM users WHERE id=$1`, [userId]
      )
      const userPlan  = userRow.rows[0]?.user_plan ?? ''
      const createdAt = userRow.rows[0]?.created_at ? new Date(userRow.rows[0].created_at) : null

      const schedIdx = LICENSE_TO_SCHED_IDX[userPlan] ?? -1
      const months   = await getScheduleMonths(schedIdx)

      const planStart = createdAt ? createdAt.toISOString().slice(0, 10) : null
      let planEnd: string | null = null
      if (months > 0 && createdAt) {
        const end = new Date(createdAt)
        end.setMonth(end.getMonth() + months)
        planEnd = end.toISOString().slice(0, 10)
      }

      await pool.query(
        `UPDATE users SET system_force=NULL,
         license_type = COALESCE(NULLIF(user_plan, ''), license_type),
         plan_start = $2, plan_end = $3
         WHERE id=$1`,
        [userId, planStart, planEnd]
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
