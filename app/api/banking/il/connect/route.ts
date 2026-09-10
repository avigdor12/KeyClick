// ═══════════════════════════════════════════════════════════════════════════
// ❄  הוקפא 10.09.2026 — נושא השירותים הבנקאיים הישירים כולו מוקפא (החלטת אביגדור).
//    קוד לא-נגיש: אין כפתור באתר ואין כתובת שמפעילים את המסלול הזה.
//    נשמר ולא נמחק (מחיקה תשבור אינדקסים/ניתוב). אין להרחיב — לתקן רק אם מבטלים את ההקפאה.
//    תיעוד: Doc/AI Claude Code/Removal_Banking_Services.html
// ═══════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server'

const IL_BASE = process.env.IL_PROVIDER_BASE_URL ?? ''

export async function POST(req: NextRequest) {
  const { userId, institutionId } = await req.json()
  if (!userId || !institutionId) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  if (!IL_BASE || !process.env.IL_PROVIDER_KEY) {
    return NextResponse.json({ error: 'IL provider not configured' }, { status: 503 })
  }

  const res = await fetch(`${IL_BASE}/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.IL_PROVIDER_KEY}` },
    body: JSON.stringify({ userId, institutionId, redirect: `${process.env.NEXTAUTH_URL}/api/banking/il/callback` }),
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
  return NextResponse.json({ link: data.link })
}
