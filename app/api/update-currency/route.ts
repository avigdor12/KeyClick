import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUsersToApp } from '@/lib/mf-sync'
import { requireSelf } from '@/lib/kc-security'
// [22.11.2026] שלב 3 בתיקון האבטחה (lib/kc-security.ts): כל פעולה נבדקת מול בעל האישור החתום - לקוח רק על החשבון שלו, מנהל על כולם.
// ניסיון על חשבון אחר נחסם ונרשם ב"חשד לפריצה".

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const { userId, currency } = await req.json()
    const denied = await requireSelf(req, 'שינוי מטבע', { id: userId }, true); if (denied) return denied
    await pool.query(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(10)'
    )
    await pool.query(
      'UPDATE users SET currency=$1 WHERE id=$2',
      [currency ?? null, userId]
    )
    await syncUsersToApp([Number(userId)])
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
