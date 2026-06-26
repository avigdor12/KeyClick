import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? (req as NextRequest & { ip?: string }).ip
                ?? 'localhost'

    const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
    const userId = Number(cur.rows[0]?.value ?? 0)

    if (userId) {
      const result = await pool.query(
        'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE id=$1',
        [userId]
      )
      if (result.rows.length > 0) {
        return NextResponse.json({ user: result.rows[0], identified_by: 'current_user', current_ip: ip })
      }
    }

    if (ip !== 'unknown') {
      const byIp = await pool.query(
        'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE last_ip=$1 LIMIT 1',
        [ip]
      )
      if (byIp.rows.length > 0) {
        await pool.query("UPDATE system_DB_Records SET value=$1 WHERE key='Current_User'", [String(byIp.rows[0].id)])
        return NextResponse.json({ user: byIp.rows[0], identified_by: 'ip', current_ip: ip })
      }
    }

    return NextResponse.json({ user: null, identified_by: 'none', current_ip: ip })
  } catch (e) {
    return NextResponse.json({ user: null, identified_by: 'error' })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { field, value } = await req.json()
    const allowed = ['is_active', 'is_m_finance_installed']
    if (!allowed.includes(field)) return NextResponse.json({ ok: false, error: 'field not allowed' }, { status: 400 })

    const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
    const userId = Number(cur.rows[0]?.value ?? 0)
    if (!userId) return NextResponse.json({ ok: false, error: 'no current user' }, { status: 400 })

    await pool.query(`UPDATE users SET ${field}=$1 WHERE id=$2`, [value, userId])
    const result = await pool.query(
      'SELECT id, name, email, language, currency, license_type AS "M_Finance_license_type", is_active, is_m_finance_installed AS "is_M_Finance_installed", last_ip, created_at, plan_start, plan_end, system_force FROM users WHERE id=$1',
      [userId]
    )
    return NextResponse.json({ ok: true, user: result.rows[0] })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
    const userId = Number(cur.rows[0]?.value ?? 0)
    if (!userId) return NextResponse.json({ ok: false, error: 'no current user' }, { status: 400 })

    await pool.query('DELETE FROM users WHERE id=$1', [userId])
    await pool.query("UPDATE system_DB_Records SET value='0' WHERE key='Current_User'")
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
