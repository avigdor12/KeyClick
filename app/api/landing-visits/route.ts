import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { detectSource } from '@/lib/traffic-source'
import { requireAdmin } from '@/lib/kc-security'

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

// מקור הגעה: lib/traffic-source.ts (משותף עם יומן "חי", 03.11.2026)

async function GET_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'נתוני ביקורים בדף הנחיתה'); if (denied) return denied
  try {
    await ensureTable()
    const result = await pool.query('SELECT id, ip, entered_at, country, lang, source FROM landing_visits ORDER BY entered_at ASC')
    return NextResponse.json({ visits: result.rows })
  } catch (e) {
    return NextResponse.json({ visits: [], error: String(e) })
  }
}

// ניקוי הטבלה - כפתור איפוס באיסוף נתונים > דף נחיתה (לפי בקשת המשתמש)
async function DELETE_handler(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'מחיקת ביקורים בדף הנחיתה'); if (denied) return denied
  try {
    await ensureTable()
    await pool.query('DELETE FROM landing_visits')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

async function POST_handler(req: NextRequest) {
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

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const GET = withDbQuota(GET_handler)
export const DELETE = withDbQuota(DELETE_handler)
export const POST = withDbQuota(POST_handler)
