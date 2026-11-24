import { withDbQuota } from '@/lib/kc-security'
import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      amount NUMERIC(10,2),
      currency VARCHAR(10),
      plan VARCHAR(50),
      payment_date TIMESTAMP DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'success'
    )
  `)
}

async function GET_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'נתוני גבייה'); if (denied) return denied
  try {
    await ensureTable()
    const result = await pool.query(
      'SELECT id, user_id, amount, currency, plan, payment_date, status FROM payments ORDER BY user_id, payment_date DESC'
    )
    return NextResponse.json({ payments: result.rows })
  } catch (e) {
    return NextResponse.json({ payments: [], error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
