import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, uuidLocalBios } = await req.json()
  console.log(`[set-mfinance-installed] received email="${email || '(empty)'}" uuidLocalBios="${uuidLocalBios || '(empty)'}"`)

  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "UUID_Local_BIOS" VARCHAR(50)')

  if (email) {
    const result = await pool.query('UPDATE users SET is_m_finance_installed = true, "UUID_Local_BIOS" = COALESCE(NULLIF($2, \'\'), "UUID_Local_BIOS") WHERE email = $1 RETURNING id, email, "UUID_Local_BIOS"', [email, uuidLocalBios ?? ''])
    console.log(`[set-mfinance-installed] UPDATE matched ${result.rowCount} row(s): ${JSON.stringify(result.rows)}`)
    return NextResponse.json({ ok: true })
  }

  // No email identifies which customer this install belongs to — do NOT fall back to the
  // global Current_User system pointer here, it is shared across all sessions/computers and
  // previously caused this UUID to get written onto an unrelated customer's record.
  console.log('[set-mfinance-installed] no email provided, skipping update')
  return NextResponse.json({ ok: false, error: 'no email provided, cannot identify customer' })
}
