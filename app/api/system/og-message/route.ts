import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { refreshFacebookOg } from '@/lib/og-refresh'

// [20.10.2026] "הודעה מתחת לתמונת הפרסום" - השורה שמתחת לתמונה בתצוגה המקדימה (og:title) בפייסבוק/ווטסאפ וכו'.
// text = הנוסח בעברית, tx = התרגומים לשאר השפות (מתורגמים בדפדפן בלחיצת "עדכון"). ריק = הכותרת הקבועה ב-app/page.tsx.
// אחרי שמירה מבקש מפייסבוק לרענן מיד (lib/og-refresh).
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const maxDuration = 60   // פייסבוק עונה לפעמים לאט על הרענון

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT value FROM system_DB_Records WHERE key='KeyClick_OG_Message'"
    )
    const raw = result.rows[0]?.value
    if (!raw) return NextResponse.json({ text: '', tx: {}, date: '' })
    const { text, tx, date } = JSON.parse(raw)
    return NextResponse.json({ text: text ?? '', tx: tx ?? {}, date: date ?? '' })
  } catch {
    return NextResponse.json({ text: '', tx: {}, date: '' })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, tx, date } = await req.json()
    await pool.query(
      `INSERT INTO system_DB_Records (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      ['KeyClick_OG_Message', JSON.stringify({ text: text ?? '', tx: tx ?? {}, date: date ?? '' })]
    )
    const fb = await refreshFacebookOg()
    const bad = fb.results.find(r => !r.ok)
    return NextResponse.json({ ok: true, fb: { ok: fb.ok, error: fb.error ?? (bad ? `${bad.url}: ${bad.error}` : null) } })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
