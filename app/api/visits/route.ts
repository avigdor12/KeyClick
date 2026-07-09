import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

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

export async function GET() {
  try {
    await ensureTable()
    const result = await pool.query('SELECT id, ip, user_name, entered_at, last_seen_at, country, region FROM visits ORDER BY entered_at ASC')
    return NextResponse.json({ visits: result.rows })
  } catch (e) {
    return NextResponse.json({ visits: [], error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { clientIp } = await req.json().catch(() => ({ clientIp: '' }))
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
    const result = await pool.query(
      'INSERT INTO visits (ip, user_name, country, region) VALUES ($1,$2,$3,$4) RETURNING id',
      [ip, userName, geo.country, geo.region]
    )
    return NextResponse.json({ ok: true, id: result.rows[0].id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE() {
  try {
    await ensureTable()
    await pool.query('DELETE FROM visits')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
