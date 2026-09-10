// ═══════════════════════════════════════════════════════════════════════════
// ❄  הוקפא 10.09.2026 — נושא השירותים הבנקאיים הישירים כולו מוקפא (החלטת אביגדור).
//    קוד לא-נגיש: אין כפתור באתר ואין כתובת שמפעילים את המסלול הזה.
//    נשמר ולא נמחק (מחיקה תשבור אינדקסים/ניתוב). אין להרחיב — לתקן רק אם מבטלים את ההקפאה.
//    תיעוד: Doc/AI Claude Code/Removal_Banking_Services.html
// ═══════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get('country')
  if (!country) return NextResponse.json({ error: 'missing country' }, { status: 400 })

  const tokenRes = await fetch(`${NORDIGEN_BASE}/token/new/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenRes.ok) return NextResponse.json({ error: tokenData }, { status: tokenRes.status })

  const res = await fetch(`${NORDIGEN_BASE}/institutions/?country=${country}`, {
    headers: { Authorization: `Bearer ${tokenData.access}` },
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
  return NextResponse.json(data)
}
