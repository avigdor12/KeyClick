// ═══════════════════════════════════════════════════════════════════════════
// ❄  הוקפא 10.09.2026 — נושא השירותים הבנקאיים הישירים כולו מוקפא (החלטת אביגדור).
//    קוד לא-נגיש: אין כפתור באתר ואין כתובת שמפעילים את המסלול הזה.
//    נשמר ולא נמחק (מחיקה תשבור אינדקסים/ניתוב). אין להרחיב — לתקן רק אם מבטלים את ההקפאה.
//    תיעוד: Doc/AI Claude Code/Removal_Banking_Services.html
// ═══════════════════════════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server'

// Stateless by design: no bank connection/account data is persisted server-side anymore
// (see lib/banking-session.ts). This endpoint has nothing to look up — every real
// connection/account list lives only in the browser's decoded session state.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ connections: [], accounts: [] })
}

export async function DELETE(_req: NextRequest) {
  // Nothing is stored server-side to revoke; disconnect is handled client-side.
  return NextResponse.json({ ok: true })
}
