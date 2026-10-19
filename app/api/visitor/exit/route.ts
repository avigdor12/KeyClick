import { NextRequest, NextResponse } from 'next/server'
import { deleteVisitors, visitorKeyOk } from '@/lib/visitor'

// [Claude Code 19.10.2026, לפי הנחיית המשתמש] יציאת אורח מהאתר (sendBeacon ב-pagehide): הרשומה וכל הנתונים שלה נמחקים מיד, רק עם המפתח של האורח

export async function POST(req: NextRequest) {
  try {
    const { id, key } = JSON.parse(await req.text())
    if (!(await visitorKeyOk(Number(id), String(key || '')))) return NextResponse.json({ ok: false }, { status: 403 })
    await deleteVisitors([Number(id)])
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
