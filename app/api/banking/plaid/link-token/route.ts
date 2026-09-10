// ═══════════════════════════════════════════════════════════════════════════
// ❄  הוקפא 10.09.2026 — נושא השירותים הבנקאיים הישירים כולו מוקפא (החלטת אביגדור).
//    קוד לא-נגיש: אין כפתור באתר ואין כתובת שמפעילים את המסלול הזה.
//    נשמר ולא נמחק (מחיקה תשבור אינדקסים/ניתוב). אין להרחיב — לתקן רק אם מבטלים את ההקפאה.
//    תיעוד: Doc/AI Claude Code/Removal_Banking_Services.html
// ═══════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server'

const PLAID_BASE = 'https://sandbox.plaid.com'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

  const res = await fetch(`${PLAID_BASE}/link/token/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      client_name: 'KeyClick',
      country_codes: ['US'],
      language: 'en',
      user: { client_user_id: String(userId) },
      products: ['transactions'],
    }),
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
  return NextResponse.json({ link_token: data.link_token })
}
