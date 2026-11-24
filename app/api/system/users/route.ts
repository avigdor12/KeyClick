import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function GET_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'רשימת המשתמשים'); if (denied) return denied
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_start DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_end DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS system_force TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(10);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS notes TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS weighted_score INTEGER DEFAULT 10;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS ip_registration VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password BOOLEAN DEFAULT false;
    `)
    const result = await pool.query(
      'SELECT id, name, email, language, country, currency, license_type AS "M_Finance_license_type", is_active, last_ip, ip_registration, created_at, last_login_at, login_count, source, plan_start, plan_end, system_force, notes, weighted_score, temp_password FROM users ORDER BY id'
    )
    return NextResponse.json({ users: result.rows })
  } catch (e) {
    return NextResponse.json({ users: [], error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
