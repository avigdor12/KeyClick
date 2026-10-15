import type { Metadata } from 'next'
import Home from './HomeClient'

// [15.10.2026] כתובת לכל שפה: keyclick.org/?lang=en וכו' (עברית - בלי lang). כאן נבחרות תגיות התצוגה לפייסבוק/ווטסאפ לפי השפה:
// תמונה public/og.jpg (עברית) או public/og-xx.jpg, וכותרת ותיאור כמו בדף הנחיתה. הדף עצמו - HomeClient.tsx, והשפה נבחרת שם מ-lang
const OG: Record<string, { title: string; description: string; locale: string }> = {
  he: {"title":"KeyClick — כלים דיגיטליים לכל אחד","description":"טכנולוגיה טובה לא צריכה תואר בהנדסה כדי להשתמש בה","locale":"he_IL"},
  en: {"title":"KeyClick — Digital tools for everyone","description":"Good technology needs no engineering degree","locale":"en_US"},
  ru: {"title":"KeyClick — цифровые инструменты для каждого","description":"Хорошая технология не требует диплома инженера","locale":"ru_RU"},
  de: {"title":"KeyClick — digitale Werkzeuge für alle","description":"Gute Technik braucht kein Ingenieurstudium","locale":"de_DE"},
  fr: {"title":"KeyClick — des outils numériques pour tous","description":"Une bonne technologie n'exige pas de diplôme d'ingénieur","locale":"fr_FR"},
  es: {"title":"KeyClick — herramientas digitales para todos","description":"La buena tecnología no exige un título de ingeniería","locale":"es_ES"},
  ja: {"title":"KeyClick — すべての人のためのデジタルツール","description":"良い技術に工学の学位はいらない","locale":"ja_JP"},
  ar: {"title":"KeyClick — أدوات رقمية للجميع","description":"التقنية الجيدة لا تتطلب شهادة هندسة لاستخدامها","locale":"ar_AR"},
  zh: {"title":"KeyClick — 面向所有人的数字工具","description":"好技术不需要工程学位","locale":"zh_CN"},
  it: {"title":"KeyClick — strumenti digitali per tutti","description":"Una buona tecnologia non richiede una laurea in ingegneria","locale":"it_IT"},
  hi: {"title":"KeyClick — सभी के लिए डिजिटल उपकरण","description":"अच्छी तकनीक के लिए इंजीनियरिंग की डिग्री ज़रूरी नहीं","locale":"hi_IN"},
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }): Promise<Metadata> {
  const p = (await searchParams).lang
  const code = typeof p === 'string' && OG[p] ? p : 'he'
  const m = OG[code]
  const url = code === 'he' ? 'https://keyclick.org/' : `https://keyclick.org/?lang=${code}`
  const image = { url: code === 'he' ? 'https://keyclick.org/og.jpg' : `https://keyclick.org/og-${code}.jpg`, width: 2400, height: 1260 }
  return {
    title: m.title,
    openGraph: { type: 'website', url, title: m.title, description: m.description, locale: m.locale, images: [image] },
    twitter: { card: 'summary_large_image', images: [image.url] },
  }
}

export default function Page() {
  return <Home />
}
