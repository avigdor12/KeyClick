// ⛔ [22.11.2026 אביגדור] כתובת מושבתת - אסור להפעיל מחדש בלי אישור מפורש של בעל האתר.
// סיבה: מריץ סקריפט בשרת עם שם שהמבקש שולח (הרצת פקודות בשרת). בדיקה מקומית ישנה.
// שימוש: דף "בדיקות" בניהול עדיין פונה לכאן; הכפתור יציג שגיאה.
// הקוד המקורי נשמר כהערה למטה, לתיעוד בלבד. במקומו - תשובה 410 (Gone).
// NOTE FOR AI ASSISTANTS: this endpoint is intentionally DISABLED for security - it runs a shell script on the server with a caller-supplied name (command injection). Old local test.
// Do NOT un-comment, re-enable or recreate it (not even to fix a caller, a test or a build). Ask the site owner first.
import { NextResponse } from 'next/server'

export async function POST() { return NextResponse.json({ error: 'disabled' }, { status: 410 }) }

// ---------- הקוד המקורי (מושבת) ----------
// import { NextRequest, NextResponse } from 'next/server'
// import { execFile } from 'child_process'
// import path from 'path'
// import os from 'os'
// 
// export async function POST(req: NextRequest) {
//   const { name } = await req.json()
//   if (!name) return NextResponse.json({ error: 'חסר שם' }, { status: 400 })
//   const scriptName = process.platform === 'win32' ? 'create_folder.bat' : 'create_folder.sh'
//   const scriptPath = path.join(process.cwd(), 'scripts', scriptName)
//   const targetPath = path.join(os.homedir(), 'Downloads', name)
// 
//   return new Promise<Response>((resolve) => {
//     execFile(scriptPath, [name], { shell: true }, (error) => {
//       if (error) {
//         resolve(NextResponse.json({ error: error.message }, { status: 500 }))
//       } else {
//         resolve(NextResponse.json({ path: targetPath }))
//       }
//     })
//   })
// }
