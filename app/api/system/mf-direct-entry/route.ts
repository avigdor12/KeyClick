import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { syncDirectEntryToApp } from '@/lib/mf-sync'

export const dynamic = 'force-dynamic'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// מתג חירום (23.09.2026): כניסה ישירה של מנהל המערכת לאתר M_Finance_app עם סיסמה, בלי KeyClick.
// נשמר כאן (system_DB_Records, MF_App_Direct_Entry) ונשלח לאפליקציה. מתג מקביל נמצא בדף "בשמוש המערכת" של האפליקציה.
// ברירת מחדל: כבוי. רק ערך מפורש '1' מדליק.
export async function GET() {
  try {
    const r = await pool.query("SELECT value FROM system_DB_Records WHERE key='MF_App_Direct_Entry'")
    return NextResponse.json({ enabled: r.rows[0]?.value === '1' })
  } catch {
    return NextResponse.json({ enabled: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { enabled } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['MF_App_Direct_Entry', enabled ? '1' : '0'],
    )
    const sent = await syncDirectEntryToApp(!!enabled)
    return NextResponse.json({ ok: true, sentToApp: sent.ok, error: sent.error })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
