import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import crypto from 'crypto'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// מייצר טוקן-זהות קצר-טווח עבור לקוח מחובר, בזמן שהאתר מפעיל את M Finance ("ניהול תקציב בית").
// הטוקן מוטמע בכתובת החזרה (?banking=direct&kct=...) שמועברת לאפליקציה. כשהלקוח לוחץ בתוך
// M Finance על "מוסד פיננסי", האפליקציה פותחת את הכתובת הזאת, והדף מפענח את הטוקן (mf-launch-resolve)
// וטוען את הלקוח - כדי שהמסך שנפתח יהיה מחובר ובשפת הלקוח, לא מופע אנונימי נעול.
// הטוקן שמיש שוב במהלך אותו session (TTL שעתיים) כדי לתמוך בכמה לחיצות; מנוקה אוטומטית אחרי 6 שעות.
export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mf_launch_tokens (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`DELETE FROM mf_launch_tokens WHERE created_at < NOW() - INTERVAL '6 hours'`)

  const token = crypto.randomBytes(24).toString('hex')
  await pool.query('INSERT INTO mf_launch_tokens (token, user_id) VALUES ($1, $2)', [token, userId])

  return NextResponse.json({ token })
}
