import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const EXE_URL = 'https://github.com/avigdor12/KeyClick/releases/download/v69.87.1/M_Finance-win-Setup.exe'

export async function GET() {
  const res = await fetch(EXE_URL, { redirect: 'follow' })
  if (!res.ok || !res.body) {
    return new NextResponse('download unavailable', { status: 502 })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename="M_Finance_Setup.exe"',
  }
  const len = res.headers.get('content-length')
  if (len) headers['Content-Length'] = len

  // מעבירים את גוף התגובה כ-stream, בלי לאגור את כל ה-139MB בפונקציה קודם.
  return new NextResponse(res.body, { headers })
}



