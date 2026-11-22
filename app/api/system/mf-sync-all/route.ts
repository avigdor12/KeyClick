import { NextResponse } from 'next/server'
import { syncUsersToApp } from '@/lib/mf-sync'
import { requireAdmin } from '@/lib/kc-security'

// שליחת כל רשומות המשתמשים ל-M_Finance_app (23.09.2026): הפעלה ראשונה, והשלמת פערים אחרי שליחה שנכשלה
export async function POST(req: Request) {
  // [22.11.2026] פעולת ניהול - רק מנהל המערכת (lib/kc-security.ts). אחרת נחסם ונרשם ב"חשד לפריצה"
  const denied = await requireAdmin(req, 'סנכרון כל המשתמשים ל-M Finance'); if (denied) return denied
  const r = await syncUsersToApp('all')
  return NextResponse.json(r, { status: r.ok ? 200 : 500 })
}
