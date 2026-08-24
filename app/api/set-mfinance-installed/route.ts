import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, uuidLocalBios } = await req.json()

  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "UUID_Local_BIOS" VARCHAR(50)')

  if (email) {
    await pool.query('UPDATE users SET is_m_finance_installed = true, "UUID_Local_BIOS" = COALESCE(NULLIF($2, \'\'), "UUID_Local_BIOS") WHERE email = $1', [email, uuidLocalBios ?? ''])
    return NextResponse.json({ ok: true })
  }

  // No email identifies which customer this install belongs to — do NOT fall back to the
  // global Current_User system pointer here, it is shared across all sessions/computers and
  // previously caused this UUID to get written onto an unrelated customer's record.
  return NextResponse.json({ ok: false, error: 'no email provided, cannot identify customer' })
}
