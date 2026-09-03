import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// דגל גלובלי: האם גרסת Release נחסמת מהפעלה גולמית של ה-exe (דאבל-קליק ישיר, בלי הפעלה דרך
// האתר/פרוטוקול). האפליקציה קוראת את זה ב-MyApplication_Startup רק בהפעלה גולמית.
// ברירת מחדל בטוחה: חסום. רק ערך מפורש '0' מכבה את החסימה.
// המתג בטופס הדיבאג של האפליקציה (Ver_Release_Block) כותב לכאן.

export async function GET() {
  try {
    const result = await pool.query("SELECT value FROM system_DB_Records WHERE key='Ver_Release_Block'")
    const blocked = result.rows[0]?.value !== '0'
    return NextResponse.json({ blocked })
  } catch {
    return NextResponse.json({ blocked: true })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { blocked } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['Ver_Release_Block', blocked ? '1' : '0'],
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
