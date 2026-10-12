import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// [Claude Code 12.10.2026, לפי הנחיית המשתמש] כניסות לדף הנחיתה (landing.keyclick.org).
// דף הנחיתה שולח sendBeacon בכל כניסה; מוצג בבשימוש המערכת > איסוף נתונים > דף נחיתה.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS landing_visits (
      id SERIAL PRIMARY KEY,
      ip TEXT,
      entered_at TIMESTAMPTZ DEFAULT now(),
      country TEXT,
      lang TEXT,
      source TEXT,
      referrer TEXT
    )
  `)
}

// מקור הגעה: utm_source בקישור, אחרת fbclid (פייסבוק מוסיפה לקישורים יוצאים), אחרת לפי דף ההפניה
function detectSource(referrer: string, search: string): string {
  const params = new URLSearchParams(search || '')
  const utm = params.get('utm_source')
  if (utm) return utm.toLowerCase().slice(0, 40)
  if (params.get('fbclid')) return 'facebook'
  if (!referrer) return 'direct'
  let host = ''
  try { host = new URL(referrer).hostname.toLowerCase() } catch { return 'other' }
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)) return 'facebook'
  if (/(^|\.)instagram\.com$/.test(host)) return 'instagram'
  if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(host)) return 'whatsapp'
  if (/(^|\.)google\./.test(host)) return 'google'
  if (/(^|\.)keyclick\.org$/.test(host)) return 'keyclick'
  return host.slice(0, 60)
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query('SELECT id, ip, entered_at, country, lang, source FROM landing_visits ORDER BY entered_at ASC')
    return NextResponse.json({ visits: result.rows })
  } catch (e) {
    return NextResponse.json({ visits: [], error: String(e) })
  }
}

// ניקוי הטבלה - כפתור איפוס באיסוף נתונים > דף נחיתה (לפי בקשת המשתמש)
export async function DELETE() {
  try {
    await ensureTable()
    await pool.query('DELETE FROM landing_visits')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  // רק דף הנחיתה רושם כניסות
  if (req.headers.get('origin') !== 'https://landing.keyclick.org') {
    return NextResponse.json({ ok: false }, { status: 403 })
  }
  try {
    await ensureTable()
    const text = await req.text().catch(() => '')
    let body: { lang?: string; referrer?: string; search?: string } = {}
    try { body = JSON.parse(text || '{}') } catch { body = {} }
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
    const country = req.headers.get('x-vercel-ip-country') || null
    const lang = String(body.lang || '').slice(0, 5) || null
    const referrer = String(body.referrer || '').slice(0, 300)
    const source = detectSource(referrer, String(body.search || ''))
    await pool.query(
      'INSERT INTO landing_visits (ip, country, lang, source, referrer) VALUES ($1,$2,$3,$4,$5)',
      [ip, country, lang, source, referrer || null]
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
