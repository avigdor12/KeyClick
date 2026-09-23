import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import crypto from 'crypto'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// אסימון כניסה ל-M_Finance_app (23.09.2026): KeyClick מאשר שהלקוח מחובר, והאפליקציה פותחת לו חיבור בלי סיסמה.
// האסימון: payload.signature (base64url). payload = { uid, email, exp, n }. חתום ב-HMAC-SHA256 במפתח המשותף MF_SYNC_SECRET.
// תקף לדקה אחת, ולשימוש אחד בלבד (האפליקציה רושמת את n ודוחה שימוש חוזר).
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.MF_SYNC_SECRET, appUrl = process.env.MF_APP_URL
    if (!secret || !appUrl) return NextResponse.json({ error: 'not configured' }, { status: 503 })
    const { userId } = await req.json()
    const r = await pool.query('SELECT id, email, is_active FROM users WHERE id = $1', [Number(userId)])
    const u = r.rows[0]
    if (!u) return NextResponse.json({ error: 'user not found' }, { status: 404 })
    if (!u.is_active) return NextResponse.json({ error: 'user not active' }, { status: 403 })
    const payload = Buffer.from(JSON.stringify({ uid: u.id, email: u.email, exp: Date.now() + 60_000, n: crypto.randomBytes(16).toString('hex') })).toString('base64url')
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url')
    const token = payload + '.' + sig
    return NextResponse.json({ token, url: appUrl.replace(/\/$/, '') + '/?kct=' + encodeURIComponent(token) })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
