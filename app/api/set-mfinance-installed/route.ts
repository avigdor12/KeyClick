import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, uuidLocalBios } = await req.json()

  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='UUID_Local_Computer')
         AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='UUID_Local_BIOS')
      THEN
        ALTER TABLE users RENAME COLUMN "UUID_Local_Computer" TO "UUID_Local_BIOS";
      ELSE
        ALTER TABLE users ADD COLUMN IF NOT EXISTS "UUID_Local_BIOS" VARCHAR(50);
      END IF;
    END $$;
  `)

  if (email) {
    await pool.query('UPDATE users SET is_m_finance_installed = true, "UUID_Local_BIOS" = COALESCE(NULLIF($2, \'\'), "UUID_Local_BIOS") WHERE email = $1', [email, uuidLocalBios ?? ''])
    return NextResponse.json({ ok: true })
  }

  const cur = await pool.query("SELECT value FROM system_DB_Records WHERE key='Current_User'")
  const userId = Number(cur.rows[0]?.value ?? 0)
  if (userId) {
    await pool.query('UPDATE users SET is_m_finance_installed = true, "UUID_Local_BIOS" = COALESCE(NULLIF($2, \'\'), "UUID_Local_BIOS") WHERE id = $1', [userId, uuidLocalBios ?? ''])
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false })
}
