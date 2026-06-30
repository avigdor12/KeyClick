import { NextResponse } from 'next/server'

const EXE_URL = 'https://github.com/avigdor12/KeyClick/releases/download/v69.03/M_Finance-win-Setup.exe'

export async function GET() {
  const res  = await fetch(EXE_URL)
  const blob = await res.arrayBuffer()
  return new NextResponse(blob, {
    headers: {
      'Content-Type':        'application/octet-stream',
      'Content-Disposition': 'attachment; filename="M_Finance_Setup.exe"',
    },
  })
}






