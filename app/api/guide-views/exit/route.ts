import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] יציאה מדף מדריך (sendBeacon): זמן יציאה, עומק גלילה מרבי ומסך מלא

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req: NextRequest) {
  try {
    const text = await req.text()
    const { id, maxScroll, fullscreen } = JSON.parse(text)
    if (!id) return NextResponse.json({ ok: false })
    const scroll = Math.max(0, Math.min(100, Math.round(Number(maxScroll) || 0)))
    await pool.query('UPDATE guide_views SET left_at=now(), max_scroll=$2, fullscreen=$3 WHERE id=$1 AND left_at IS NULL', [id, scroll, !!fullscreen])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
