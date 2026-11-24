import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { deleteVisitors, visitorKeyOk } from '@/lib/visitor'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] יציאת אורח מהאתר (sendBeacon ב-pagehide): הרשומה וכל הנתונים שלה נמחקים מיד, רק עם המפתח של האורח

async function POST_handler(req: NextRequest) {
  try {
    const { id, key } = JSON.parse(await req.text())
    if (!(await visitorKeyOk(Number(id), String(key || '')))) return NextResponse.json({ ok: false }, { status: 403 })
    await deleteVisitors([Number(id)])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
