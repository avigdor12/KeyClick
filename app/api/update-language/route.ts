import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncUserByEmailToApp } from '@/lib/mf-sync'
import { requireSelf } from '@/lib/kc-security'
// [22.11.2026] שלב 3 בתיקון האבטחה (lib/kc-security.ts): כל פעולה נבדקת מול בעל האישור החתום - לקוח רק על החשבון שלו, מנהל על כולם.
// ניסיון על חשבון אחר נחסם ונרשם ב"חשד לפריצה".

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  const { email, language } = await req.json()
  if (!email || !language) return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  const denied = await requireSelf(req, 'שינוי שפה', { email }, true); if (denied) return denied
  await pool.query('UPDATE users SET language = $1 WHERE email = $2', [language, email])
  await syncUserByEmailToApp(email)
  return NextResponse.json({ success: true })
}
