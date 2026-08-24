import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { uuidBiosCode } = await req.json()
  if (!uuidBiosCode) return NextResponse.json({ taken: false })

  await pool.query('CREATE INDEX IF NOT EXISTS users_uuid_local_bios_idx ON users ("UUID_Local_BIOS")')

  const result = await pool.query('SELECT id FROM users WHERE "UUID_Local_BIOS" = $1', [uuidBiosCode])
  return NextResponse.json({ taken: result.rows.length > 0 })
}
