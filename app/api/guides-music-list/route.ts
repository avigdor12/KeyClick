import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'music')
    const files = fs.readdirSync(dir).filter(f => /\.(mp3|ogg|wav|m4a)$/i.test(f))
    return NextResponse.json({ files })
  } catch {
    return NextResponse.json({ files: [] })
  }
}
