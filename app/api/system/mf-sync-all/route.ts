import { NextResponse } from 'next/server'
import { syncUsersToApp } from '@/lib/mf-sync'

// שליחת כל רשומות המשתמשים ל-M_Finance_app (23.09.2026): הפעלה ראשונה, והשלמת פערים אחרי שליחה שנכשלה
export async function POST() {
  const r = await syncUsersToApp('all')
  return NextResponse.json(r, { status: r.ok ? 200 : 500 })
}
