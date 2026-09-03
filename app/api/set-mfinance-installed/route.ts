import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, uuidLocalBios } = await req.json()
  console.log(`[set-mfinance-installed] received email="${email || '(empty)'}" uuidLocalBios="${uuidLocalBios || '(empty)'}"`)

  await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "UUID_Local_BIOS" VARCHAR(50)')

  if (email) {
    // UUID = החדש אם ניתן, אחרת נשמר הקיים. is_m_finance_installed נדלק אך ורק כשבסופו של דבר
    // יש UUID ברשומה - כדי שהדגל וה-UUID לא יוכלו לא להסכים (זה מה שחסם את handleInstall).
    const result = await pool.query(
      `UPDATE users
         SET "UUID_Local_BIOS"     = COALESCE(NULLIF($2, ''), "UUID_Local_BIOS"),
             is_m_finance_installed = (COALESCE(NULLIF($2, ''), "UUID_Local_BIOS") IS NOT NULL)
       WHERE email = $1
       RETURNING id, email, "UUID_Local_BIOS", is_m_finance_installed`,
      [email, uuidLocalBios ?? ''],
    )
    console.log(`[set-mfinance-installed] UPDATE matched ${result.rowCount} row(s): ${JSON.stringify(result.rows)}`)
    const row = result.rows[0]
    return NextResponse.json({ ok: !!row?.UUID_Local_BIOS, uuidRegistered: !!row?.UUID_Local_BIOS })
  }

  // No email identifies which customer this install belongs to — do NOT fall back to the
  // global Current_User system pointer here, it is shared across all sessions/computers and
  // previously caused this UUID to get written onto an unrelated customer's record.
  console.log('[set-mfinance-installed] no email provided, skipping update')
  return NextResponse.json({ ok: false, error: 'no email provided, cannot identify customer' })
}
