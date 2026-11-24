import { withDbQuota } from '@/lib/kc-security'
import { NextRequest, NextResponse } from 'next/server'
import { touchVisitor, visitorKeyOk } from '@/lib/visitor'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] סימן חיים של אורח (כל 15 דקות כשהדף פתוח), כדי שהניקוי לא ימחק אורח פעיל

async function POST_handler(req: NextRequest) {
  try {
    const { id, key } = await req.json()
    if (!(await visitorKeyOk(Number(id), String(key || '')))) return NextResponse.json({ ok: false }, { status: 403 })
    await touchVisitor(Number(id))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}

// [24.11.2026] מסד מושהה בגלל המכסה (53000) -> הודעת תחזוקה ללקוח בכל פעולה (lib/kc-security.ts withDbQuota)
export const POST = withDbQuota(POST_handler)
