import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const EXE_URL = 'https://github.com/avigdor12/KeyClick/releases/download/v72.2.1/M_Finance-win-Setup.exe'

// מפנים את הדפדפן ישירות לקובץ ב-GitHub במקום להזרים 139MB דרך הפונקציה.
// כך אין תעבורת Fast Origin Transfer דרך Vercel לכל הורדה.
export async function GET() {
  return NextResponse.redirect(EXE_URL, 302)
}









