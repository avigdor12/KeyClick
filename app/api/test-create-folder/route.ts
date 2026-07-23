import { NextRequest, NextResponse } from 'next/server'
import { execFile } from 'child_process'
import path from 'path'
import os from 'os'

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name) return NextResponse.json({ error: 'חסר שם' }, { status: 400 })
  const scriptPath = path.join(process.cwd(), 'scripts', 'create_folder.bat')
  const targetPath = path.join(os.homedir(), 'Downloads', name)

  return new Promise<Response>((resolve) => {
    execFile(scriptPath, [name], { shell: true }, (error) => {
      if (error) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }))
      } else {
        resolve(NextResponse.json({ path: targetPath }))
      }
    })
  })
}
