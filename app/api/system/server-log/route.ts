import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/kc-security'
import { readKcUserId } from '@/lib/kc-auth'
import { readServerLog, clearServerLog, knownAdminUid, rememberAdmin, dbConnErrorCode } from '@/lib/kc-server-log'

export const dynamic = 'force-dynamic'

// [24.11.2026] יומן השרת (lib/kc-server-log.ts) ללשונית "בשימוש המערכת > מוניטור > שרת". רק מנהל המערכת.
// המסד זמין: בדיקת מנהל רגילה (requireAdmin), ומספר המנהל נשמר במאגר.
// המסד לא זמין: המנהל מזוהה לפי אישור הכניסה החתום מול המספר השמור - כך אפשר לצפות ביומן גם בזמן השהיית המסד.
// הפעולה הזאת לא עטופה ב-withDbQuota: המנהל לא מנותק כאן.
// תשובה: null = מנהל (dbDown - האם המסד לא זמין); אחרת התשובה לסירוב
async function adminCheck(req: NextRequest, action: string): Promise<{ denied: Response | null; dbDown: boolean }> {
  const uid = readKcUserId(req)
  try {
    const denied = await requireAdmin(req, action); if (denied) return { denied, dbDown: false }
    if (uid) await rememberAdmin(uid)
    return { denied: null, dbDown: false }
  } catch (e) {
    if (!dbConnErrorCode(e)) return { denied: NextResponse.json({ events: [], error: String(e) }, { status: 500 }), dbDown: false }
    if (!uid || uid !== await knownAdminUid()) return { denied: NextResponse.json({ events: [], error: 'db_down' }, { status: 503 }), dbDown: true }
    return { denied: null, dbDown: true }
  }
}

export async function GET(req: NextRequest) {
  const { denied, dbDown } = await adminCheck(req, 'צפייה ביומן השרת'); if (denied) return denied
  try {
    return NextResponse.json({ events: await readServerLog(), dbDown })
  } catch (e) {
    return NextResponse.json({ events: [], dbDown, error: String(e) })
  }
}

// איפוס היומן
export async function DELETE(req: NextRequest) {
  const { denied } = await adminCheck(req, 'איפוס יומן השרת'); if (denied) return denied
  try {
    await clearServerLog()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
