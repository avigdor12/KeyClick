import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] צפיה במדריכים: כל כניסה לדף מדריכים וסרטונים או לאחת מ-6 המגירות.
// האתר שולח POST בכניסה ו-sendBeacon ל-exit ביציאה; מוצג בבשימוש המערכת > איסוף נתונים > צפיה במדריכים.

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_views (
      id SERIAL PRIMARY KEY,
      entered_at TIMESTAMPTZ DEFAULT now(),
      left_at TIMESTAMPTZ,
      page TEXT,
      lang TEXT,
      user_id INTEGER,
      user_name TEXT,
      user_email TEXT,
      visit_id INTEGER,
      from_page TEXT,
      ip TEXT,
      country TEXT,
      region TEXT,
      city TEXT,
      device TEXT,
      os TEXT,
      browser TEXT,
      user_agent TEXT,
      screen TEXT,
      viewport TEXT,
      max_scroll INTEGER,
      fullscreen BOOLEAN
    )
  `)
  // הגדלת הדף בדפדפן וקנה המידה של מערכת ההפעלה, באחוזים (מסך וחלון נרשמים בנקודות מסך אמיתיות)
  await pool.query(`ALTER TABLE guide_views ADD COLUMN IF NOT EXISTS zoom INTEGER`)
  await pool.query(`ALTER TABLE guide_views ADD COLUMN IF NOT EXISTS os_scale INTEGER`)
}

// זיהוי מכשיר, מערכת הפעלה ודפדפן מתוך user-agent
function parseAgent(ua: string): { device: string; os: string; browser: string } {
  let device = 'מחשב'
  if (/bot|crawl|spider|slurp|facebookexternalhit|preview|headless/i.test(ua)) device = 'רובוט'
  else if (/iPad|Tablet/i.test(ua)) device = 'טאבלט'
  else if (/Mobi|Android|iPhone/i.test(ua)) device = 'טלפון'
  let os = ''
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'Mac'
  else if (/Linux/i.test(ua)) os = 'Linux'
  let browser = ''
  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera'
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung'
  else if (/FBAN|FBAV/i.test(ua)) browser = 'Facebook'
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome'
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox'
  else if (/Safari/i.test(ua)) browser = 'Safari'
  return { device, os, browser }
}

function decodeHeader(v: string | null): string | null {
  if (!v) return null
  try { return decodeURIComponent(v) } catch { return v }
}

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query(`SELECT id, entered_at, left_at, page, lang, user_name, user_email, visit_id, from_page, ip, country, region, city,
      device, os, browser, screen, viewport, zoom, os_scale, max_scroll, fullscreen FROM guide_views ORDER BY entered_at ASC`)
    return NextResponse.json({ views: result.rows })
  } catch (e) {
    return NextResponse.json({ views: [], error: String(e) })
  }
}

// ניקוי הטבלה - כפתור איפוס באיסוף נתונים > צפיה במדריכים
export async function DELETE() {
  try {
    await ensureTable()
    await pool.query('DELETE FROM guide_views')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const body = await req.json().catch(() => ({})) as {
      page?: string; lang?: string; userId?: number | null; visitId?: number | null; fromPage?: string | null
      screenW?: number; screenH?: number; viewportW?: number; viewportH?: number; zoom?: number; osScale?: number; clientIp?: string
    }
    const page = String(body.page || '').slice(0, 40)
    if (!page.startsWith('guides')) return NextResponse.json({ ok: false })
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? (req as NextRequest & { ip?: string }).ip
    const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
    const ip = isLoopback ? (body.clientIp || rawIp || 'unknown') : rawIp
    // המשתמש לפי המספר שבדפדפן (השם והמייל מטבלת המשתמשים), אחרת לפי כתובת ה-IP כמו בטבלת הביקורים
    const userId = Number(body.userId) || null
    const u = userId
      ? await pool.query('SELECT id, name, email FROM users WHERE id=$1', [userId])
      : await pool.query('SELECT id, name, email FROM users WHERE last_ip=$1 LIMIT 1', [ip])
    const user = u.rows[0] ?? null
    const ua = req.headers.get('user-agent') || ''
    const { device, os, browser } = parseAgent(ua)
    const screen = body.screenW && body.screenH ? `${body.screenW}x${body.screenH}` : null
    const viewport = body.viewportW && body.viewportH ? `${body.viewportW}x${body.viewportH}` : null
    const result = await pool.query(
      `INSERT INTO guide_views (page, lang, user_id, user_name, user_email, visit_id, from_page, ip, country, region, city, device, os, browser, user_agent, screen, viewport, zoom, os_scale)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id`,
      [page, String(body.lang || '').slice(0, 5) || null, user?.id ?? null, user?.name ?? null, user?.email ?? null,
       Number(body.visitId) || null, body.fromPage ? String(body.fromPage).slice(0, 40) : null, ip,
       req.headers.get('x-vercel-ip-country') || null, decodeHeader(req.headers.get('x-vercel-ip-country-region')), decodeHeader(req.headers.get('x-vercel-ip-city')),
       device, os || null, browser || null, ua.slice(0, 400) || null, screen, viewport,
       Math.round(Number(body.zoom)) || null, Math.round(Number(body.osScale)) || null]
    )
    return NextResponse.json({ ok: true, id: result.rows[0].id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
