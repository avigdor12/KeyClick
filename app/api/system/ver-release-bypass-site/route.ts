import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// דגל גלובלי: האם גרסת Release מדלגת על בדיקת הרשאת האתר (Check_App_Authorization) ורצה ללא תנאי.
// bypass=true  -> Release רצה חופשי, בלי לדרוש הרשאה מהאתר.
// bypass=false -> Release רצה רק אם Check_App_Authorization מחזיר authorized=true.
// ברירת מחדל בטוחה: false (חובה הרשאה). רק ערך מפורש '1' מפעיל את ה-bypass.
// המתג בטופס הדיבאג של האפליקציה (Ver_Release_Bypass_Site) כותב לכאן. האפליקציה קוראת את זה
// ב-MyApplication_Startup בכל הפעלה של Release.

export async function GET() {
  try {
    const result = await pool.query("SELECT value FROM system_DB_Records WHERE key='Ver_Release_Bypass_Site'")
    const bypass = result.rows[0]?.value === '1'
    return NextResponse.json({ bypass })
  } catch {
    return NextResponse.json({ bypass: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bypass } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['Ver_Release_Bypass_Site', bypass ? '1' : '0'],
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
