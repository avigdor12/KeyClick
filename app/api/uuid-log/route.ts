import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

export const dynamic = 'force-dynamic'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// לוג משותף לתהליך ה-UUID handshake. שלושת הצדדים (דפדפן / אפליקציה / שרת) שולחים
// לכאן שורות עם run_id משותף, וה-GET מחזיר אותן כטקסט אחד לפי סדר זמן.
// אין גידור בהרשאת מנהל - סתם כתובת שפותחים בדפדפן ומקבלים קובץ.

async function ensureTable() {
  await pool.query(`CREATE TABLE IF NOT EXISTS uuid_handshake_log (
    id BIGSERIAL PRIMARY KEY,
    run_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    step TEXT,
    msg TEXT,
    ts_client TEXT,
    ts_server TIMESTAMPTZ NOT NULL DEFAULT now()
  )`)
  await pool.query(`CREATE INDEX IF NOT EXISTS uuid_handshake_log_run_idx ON uuid_handshake_log (run_id, id)`)
}

export async function POST(req: NextRequest) {
  await ensureTable()
  let b: Record<string, unknown> = {}
  try { b = await req.json() } catch { return NextResponse.json({ ok: false, error: 'bad json' }) }

  const run_id = String(b.run_id ?? '').slice(0, 80)
  if (!run_id) return NextResponse.json({ ok: false, error: 'no run_id' })

  await pool.query(
    `INSERT INTO uuid_handshake_log (run_id, actor, step, msg, ts_client) VALUES ($1,$2,$3,$4,$5)`,
    [
      run_id,
      String(b.actor ?? '').slice(0, 20),
      String(b.step ?? '').slice(0, 24),
      String(b.msg ?? '').slice(0, 600),
      String(b.ts_client ?? '').slice(0, 40),
    ],
  )
  return NextResponse.json({ ok: true })
}

export async function GET(req: NextRequest) {
  await ensureTable()
  const url = new URL(req.url)

  const key = process.env.UUID_LOG_KEY
  if (key && url.searchParams.get('key') !== key) {
    return new NextResponse('forbidden', { status: 403 })
  }

  let run = url.searchParams.get('run')
  if (!run && url.searchParams.get('last')) {
    const r = await pool.query(`SELECT run_id FROM uuid_handshake_log ORDER BY id DESC LIMIT 1`)
    run = r.rows[0]?.run_id ?? null
  }

  const rows = run
    ? (await pool.query(`SELECT * FROM uuid_handshake_log WHERE run_id = $1 ORDER BY id`, [run])).rows
    : (await pool.query(`SELECT * FROM uuid_handshake_log ORDER BY id DESC LIMIT 200`)).rows.reverse()

  const plain = (s: string) => new NextResponse(s, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  if (rows.length === 0) return plain('(אין רשומות)')

  const fmtRel = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(Math.max(0, ms % 1000)).padStart(3, '0')}`
  }

  const t0 = new Date(rows[0].ts_server).getTime()
  let prev = t0
  const out: string[] = [
    `run ${rows[0].run_id}`,
    `${rows.length} events · התחלה ${new Date(rows[0].ts_server).toISOString()}`,
    '─'.repeat(78),
  ]
  for (const r of rows) {
    const tt = new Date(r.ts_server).getTime()
    const gap = tt - prev
    prev = tt
    const delta = gap > 0 ? `+${(gap / 1000).toFixed(1)}s` : ''
    out.push(
      `${fmtRel(tt - t0)}  ${delta.padStart(6)}  ${String(r.actor).padEnd(8)} ${('[' + (r.step ?? '') + ']').padEnd(8)} ${r.msg ?? ''}`,
    )
  }
  const body = out.join('\n') + '\n'

  const headers: Record<string, string> = { 'Content-Type': 'text/plain; charset=utf-8' }
  if (!url.searchParams.get('view')) {
    headers['Content-Disposition'] = `attachment; filename="uuid-${String(rows[0].run_id).slice(0, 12)}.log"`
  }
  return new NextResponse(body, { headers })
}
