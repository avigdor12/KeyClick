import { NextRequest, NextResponse } from 'next/server'

// זיהוי שפה לפי מדינת המבקר (כמו בדף הנחיתה). Vercel מספק את המדינה בכותרת
// x-vercel-ip-country. ממפים מדינה -> קוד שפה ומציבים cookie keyclick_lang.
// אם ה-cookie כבר קיים (המשתמש בחר, או שכבר זוהה) - לא נוגעים.
const BY_COUNTRY: Record<string, string> = {
  IL: 'he',
  SA: 'ar', AE: 'ar', EG: 'ar', JO: 'ar', LB: 'ar', KW: 'ar', QA: 'ar', BH: 'ar',
  OM: 'ar', IQ: 'ar', MA: 'ar', DZ: 'ar', TN: 'ar', LY: 'ar', SD: 'ar', YE: 'ar', SY: 'ar', PS: 'ar',
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  FR: 'fr', BE: 'fr', MC: 'fr', LU: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es',
  GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es', SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es',
  IT: 'it', SM: 'it', VA: 'it',
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
  JP: 'ja',
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh', SG: 'zh',
  IN: 'hi',
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|flags|favicon.ico).*)'],
}

export default function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (req.cookies.get('keyclick_lang')) return res

  const country = (req.headers.get('x-vercel-ip-country') || '').toUpperCase()
  const lang = BY_COUNTRY[country] || 'he'
  res.cookies.set('keyclick_lang', lang, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}
