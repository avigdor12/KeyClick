import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { detectSource } from '@/lib/traffic-source'
import { requireAdmin } from '@/lib/kc-security'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      ip TEXT,
      user_name TEXT,
      entered_at TIMESTAMPTZ DEFAULT now(),
      last_seen_at TIMESTAMPTZ DEFAULT now()
    )
  `)
  await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS country TEXT`)
  await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS region TEXT`)
  // [Claude Code 03.11.2026, לפי הנחיית המשתמש] מקור הגעה + דף ההפניה (כמו ביומן דף נחיתה)
  await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS source TEXT`)
  await pool.query(`ALTER TABLE visits ADD COLUMN IF NOT EXISTS referrer TEXT`)
}

function isPublicIp(ip: string): boolean {
  if (!ip || ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') return false
  if (/^10\./.test(ip) || /^192\.168\./.test(ip) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return false
  return true
}

async function lookupGeo(ip: string): Promise<{ country: string | null; region: string | null }> {
  if (!isPublicIp(ip)) return { country: null, region: null }
  try {
    const r = await fetch(`https://ipwho.is/${ip}`)
    const d = await r.json()
    if (!d.success) return { country: null, region: null }
    return { country: d.country ?? null, region: d.region ?? null }
  } catch {
    return { country: null, region: null }
  }
}

export async function GET(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'נתוני ביקורים'); if (denied) return denied
  try {
    await ensureTable()
    const result = await pool.query('SELECT id, ip, user_name, entered_at, last_seen_at, country, region, source FROM visits ORDER BY entered_at ASC')
    return NextResponse.json({ visits: result.rows })
  } catch (e) {
    return NextResponse.json({ visits: [], error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const body: { clientIp?: string; referrer?: string; search?: string } = await req.json().catch(() => ({}))
    const clientIp = body.clientIp || ''
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
                ?? req.headers.get('x-real-ip')
                ?? (req as NextRequest & { ip?: string }).ip
    const isLoopback = !rawIp || rawIp === '::1' || rawIp === '127.0.0.1'
    const ip = isLoopback ? (clientIp || rawIp || 'unknown') : rawIp

    // if this IP already has an open (not-yet-exited) visit, don't touch it — reuse it
    const open = await pool.query(
      `SELECT id FROM visits WHERE ip=$1 AND (EXTRACT(EPOCH FROM (last_seen_at - entered_at)) <= 1) ORDER BY entered_at DESC LIMIT 1`,
      [ip]
    )
    if (open.rows.length > 0) {
      return NextResponse.json({ ok: true, id: open.rows[0].id, reused: true })
    }

    const matched = await pool.query('SELECT name FROM users WHERE last_ip=$1 LIMIT 1', [ip])
    const userName = matched.rows[0]?.name ?? null
    const geo = await lookupGeo(ip)
    const referrer = String(body.referrer || '').slice(0, 300)
    const source = detectSource(referrer, String(body.search || ''))
    const result = await pool.query(
      'INSERT INTO visits (ip, user_name, country, region, source, referrer) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [ip, userName, geo.country, geo.region, source, referrer || null]
    )
    return NextResponse.json({ ok: true, id: result.rows[0].id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// משתמש התחבר עם סיסמה - כותבים את שמו בשורת הביקור הפתוחה (השם נלקח מטבלת המשתמשים לפי המספר, לא מהדפדפן)
export async function PATCH(req: NextRequest) {
  try {
    const { id, userId } = await req.json()
    if (!id || !userId) return NextResponse.json({ ok: false })
    await pool.query('UPDATE visits SET user_name=(SELECT name FROM users WHERE id=$2) WHERE id=$1', [id, userId])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'מחיקת נתוני ביקורים'); if (denied) return denied
  try {
    await ensureTable()
    await pool.query('DELETE FROM visits')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
