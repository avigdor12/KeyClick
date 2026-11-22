import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { requireAdmin, requireSelf, requireLoggedIn } from '@/lib/kc-security'
import { readKcUserId } from '@/lib/kc-auth'
// [22.11.2026] הודעת מערכת כללית (is_system, user_id ריק) משותפת לכל הלקוחות: מחיקה / קריאה של לקוח נשמרות לכל לקוח בנפרד
// בטבלה feedback_user_state - ולא בהודעה עצמה (שם היא נמחקה / סומנה כנקראה אצל כולם).
// [22.11.2026] שלב 3 בתיקון האבטחה (lib/kc-security.ts): כל פעולה נבדקת מול בעל האישור החתום - לקוח רק על החשבון שלו, מנהל על כולם.
// ניסיון על חשבון אחר נחסם ונרשם ב"חשד לפריצה".
// רשימת כל ההודעות ותשובת המנהל - מנהל בלבד. מחיקה / סימון נקרא של הלקוח - בעל ההודעה (הודעת מערכת כללית - כל משתמש מחובר).

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// הודעת מערכת כללית - שייכת לכל הלקוחות
async function isBroadcast(id: unknown): Promise<boolean> {
  const r = await pool.query('SELECT 1 FROM feedback_messages WHERE id = $1 AND is_system = true AND user_id IS NULL', [Number(id)])
  return !!r.rowCount
}

// בדיקת בעלות על הודעה קיימת לפי המספר שלה
async function requireMsgOwner(req: NextRequest, action: string, id: unknown): Promise<Response | null> {
  const r = await pool.query('SELECT user_id, is_system FROM feedback_messages WHERE id = $1', [Number(id)])
  const m = r.rows[0]
  if (!m) return requireLoggedIn(req, action)
  if (m.user_id === null && m.is_system) return requireLoggedIn(req, action)
  return requireSelf(req, action, { id: m.user_id }, true)
}

async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback_messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      user_name TEXT,
      sent_date TEXT,
      title TEXT,
      body TEXT,
      rating_site INTEGER,
      rating_budget INTEGER,
      reply_text TEXT,
      reply_date TEXT,
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS customer_read BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS deleted_by_customer BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS deleted_by_admin BOOLEAN DEFAULT false`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS body_lang TEXT`)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT`)
  // [Claude Code 26.10.2026, לפי הנחיית המשתמש] השם וה-IP שהלקוח ראה מעל הטופס ברגע השליחה, כדי שהמנהל יראה בדיוק אותו דבר
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS header_name TEXT`)
  await pool.query(`ALTER TABLE feedback_messages ADD COLUMN IF NOT EXISTS header_ip TEXT`)
  await pool.query(`CREATE TABLE IF NOT EXISTS feedback_user_state (user_id INTEGER NOT NULL, message_id INTEGER NOT NULL, hidden BOOLEAN NOT NULL DEFAULT FALSE, read BOOLEAN NOT NULL DEFAULT FALSE, PRIMARY KEY (user_id, message_id))`)
}

export async function GET(req: NextRequest) {
  try {
    await ensureTable()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const sessionId = searchParams.get('sessionId')
    if (userId) { const denied = await requireSelf(req, 'קריאת הודעות', { id: userId }, true); if (denied) return denied }
    if (userId && sessionId) {
      const result = await pool.query(
        `SELECT * FROM feedback_messages
         WHERE ((user_id=$1 AND session_id=$2) OR (is_system=true AND (user_id=$1 OR user_id IS NULL)))
           AND deleted_by_customer=false AND NOT EXISTS (SELECT 1 FROM feedback_user_state s WHERE s.user_id=$1 AND s.message_id=feedback_messages.id AND s.hidden)
         ORDER BY created_at ASC`,
        [Number(userId), Number(sessionId)]
      )
      return NextResponse.json({ messages: result.rows })
    }
    if (userId) {
      const result = await pool.query(
        `SELECT * FROM feedback_messages
         WHERE (user_id=$1 OR (is_system=true AND user_id IS NULL))
           AND deleted_by_customer=false AND NOT EXISTS (SELECT 1 FROM feedback_user_state s WHERE s.user_id=$1 AND s.message_id=feedback_messages.id AND s.hidden)
         ORDER BY created_at DESC LIMIT 10`,
        [Number(userId)]
      )
      return NextResponse.json({ messages: result.rows })
    }
    const deniedAll = await requireAdmin(req, 'קריאת כל ההודעות'); if (deniedAll) return deniedAll
    const view = searchParams.get('view')
    const deletedCol = view === 'feedback' ? 'deleted_by_customer' : 'deleted_by_admin'
    const result = await pool.query(`SELECT fm.*, u.last_ip as sender_ip, u.country as sender_country, u.language as sender_language FROM feedback_messages fm LEFT JOIN users u ON u.id = fm.user_id WHERE fm.${deletedCol}=false ORDER BY fm.created_at ASC`)
    return NextResponse.json({ messages: result.rows })
  } catch (e) {
    return NextResponse.json({ messages: [], error: String(e) })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureTable()
    const { userId, userName, sentDate, title, body, ratingSite, ratingBudget, sessionId, bodyLang, headerName, headerIp } = await req.json()
    const denied = await requireSelf(req, 'שליחת הודעה', { id: userId }, true); if (denied) return denied
    // שפת ההודעה: מה שהלקוח שלח, אחרת שפת המשתמש מהמסד, אחרת עברית
    let msgLang: string = bodyLang || 'he'
    if (!bodyLang && userId) {
      try {
        const u = await pool.query(`SELECT language FROM users WHERE id=$1`, [Number(userId)])
        if (u.rows[0]?.language) msgLang = u.rows[0].language
      } catch { /* keep default */ }
    }
    const result = await pool.query(
      `INSERT INTO feedback_messages (user_id, user_name, sent_date, title, body, rating_site, rating_budget, session_id, body_lang, header_name, header_ip)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [userId ?? null, userName ?? null, sentDate ?? null, title ?? null, body ?? null, ratingSite ?? null, ratingBudget ?? null, sessionId ?? null, msgLang, headerName ?? '', headerIp ?? '']
    )
    return NextResponse.json({ ok: true, id: result.rows[0].id })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await ensureTable()
    const { id, scope } = await req.json()
    const denied = scope === 'system' ? await requireAdmin(req, 'מחיקת הודעה (מנהל)') : await requireMsgOwner(req, 'מחיקת הודעה', id)
    if (denied) return denied
    if (scope !== 'system' && await isBroadcast(id)) {
      await pool.query('INSERT INTO feedback_user_state (user_id, message_id, hidden) VALUES ($1, $2, TRUE) ON CONFLICT (user_id, message_id) DO UPDATE SET hidden = TRUE', [readKcUserId(req), Number(id)])
      return NextResponse.json({ ok: true })
    }
    const column = scope === 'system' ? 'deleted_by_admin' : 'deleted_by_customer'
    await pool.query(`UPDATE feedback_messages SET ${column}=true WHERE id=$1`, [id])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await ensureTable()
    const { id, replyText, replyDate, isRead, customerRead } = await req.json()
    // תשובה / סימון נקרא אצל המנהל - מנהל בלבד; סימון נקרא אצל הלקוח - בעל ההודעה
    const adminOnly = replyText !== undefined || replyDate !== undefined || isRead !== undefined
    const denied = adminOnly ? await requireAdmin(req, 'תשובה להודעה') : await requireMsgOwner(req, 'סימון הודעה כנקראה', id)
    if (denied) return denied
    if (!adminOnly && customerRead === true && await isBroadcast(id)) {
      await pool.query('INSERT INTO feedback_user_state (user_id, message_id, read) VALUES ($1, $2, TRUE) ON CONFLICT (user_id, message_id) DO UPDATE SET read = TRUE', [readKcUserId(req), Number(id)])
      return NextResponse.json({ ok: true })
    }
    const updates: string[] = []
    const values: unknown[] = []
    let i = 1
    if (replyText !== undefined) { updates.push(`reply_text=$${i++}`); values.push(replyText); updates.push(`deleted_by_customer=false`) }
    if (replyDate !== undefined) { updates.push(`reply_date=$${i++}`); values.push(replyDate) }
    if (isRead !== undefined) { updates.push(`is_read=$${i++}`); values.push(isRead) }
    if (customerRead !== undefined) { updates.push(`customer_read=$${i++}`); values.push(customerRead) }
    if (!updates.length) return NextResponse.json({ ok: false })
    values.push(id)
    await pool.query(`UPDATE feedback_messages SET ${updates.join(',')} WHERE id=$${i}`, values)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
