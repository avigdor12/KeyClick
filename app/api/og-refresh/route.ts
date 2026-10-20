import { NextRequest, NextResponse } from 'next/server'
import { refreshFacebookOg } from '@/lib/og-refresh'

// [20.10.2026] מופעל ע"י Vercel Cron אחרי חצות (vercel.json): מבקש מפייסבוק לקרוא מחדש את תגיות התצוגה, כדי שפוסט חדש
// יקבל את התמונה המתחלפת של היום (app/page.tsx, OG_ROTATE). בלי זה פייסבוק נשאר עם התמונה הישנה עד 30 יום.
// משתני סביבה: FB_APP_TOKEN = "APP_ID|APP_SECRET" של אפליקציית פייסבוק, CRON_SECRET - Vercel שולח אותו בכותרת Authorization
export const maxDuration = 60   // פייסבוק עונה לפעמים לאט על הרענון

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await refreshFacebookOg())
}
