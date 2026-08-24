import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { LICENSE_TYPES } from '@/lib/license-types'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { uuidBiosCode } = await req.json()
  if (!uuidBiosCode) return NextResponse.json({ authorized: false, isSystemManager: false })

  const result = await pool.query(
    'SELECT license_type, is_active FROM users WHERE "UUID_Local_BIOS" = $1',
    [uuidBiosCode]
  )
  const user = result.rows[0]
  if (!user) return NextResponse.json({ authorized: false, isSystemManager: false })

  const authorized = user.is_active === true
  const isSystemManager = authorized && user.license_type === LICENSE_TYPES.System_Owner

  return NextResponse.json({ authorized, isSystemManager })
}
