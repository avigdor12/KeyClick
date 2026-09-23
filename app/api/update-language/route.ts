import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUserByEmailToApp } from '@/lib/mf-sync'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, language } = await req.json()
  if (!email || !language) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  await pool.query('UPDATE users SET language = $1 WHERE email = $2', [language, email])
  await syncUserByEmailToApp(email)
  return NextResponse.json({ success: true })
}
