import type { Metadata } from 'next'
import { Pool } from 'pg'
import Home from './HomeClient'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

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

// [20.10.2026] תמונות מתחלפות - נושא לכל יום בשבוע לפי שעון ישראל (ראשון=עוגה ... שבת=חשבון), public/og/<topic>.jpg
// נבנות ע"י Site-Setup\og_rotate_images.ps1 לכל 11 השפות (<topic>.jpg לעברית, <topic>-xx.jpg לשאר); המשפטים כאן מודפסים ע"י og_rotate_images.cjs --ts
// בחצות app/api/og-refresh מבקש מפייסבוק לקרוא את הכתובות מחדש, אחרת הוא נשאר עם התמונה הישנה עד 30 יום
const OG_TOPICS = ['pie', 'graph', 'classify', 'mapping', 'planning', 'database', 'account']
const OG_ROTATE: Record<string, string[]> = {
  he: ["התקציב והמאזן בידיים שלכם - פרוסה אחר פרוסה", "רואים לאן הכסף הולך - חודש אחרי חודש", "כל הוצאה מסווגת - לבד, בלי מאמץ", "טוענים קובץ מהבנק - והמערכת מבינה אותו", "מתכננים היום - את התקציב של מחר", "כל הנתונים שלכם - שמורים במקום אחד", "עו\"ש ואשראי - סוף סוף בתמונה אחת"],
  en: ["Your budget and balance in your hands - slice by slice", "See where the money goes - month after month", "Every expense gets classified - on its own, no effort", "Upload a file from your bank - and the system understands it", "Plan today - tomorrow's budget", "All your data - saved in one place", "Checking and credit cards - finally in one picture"],
  ru: ["Бюджет и баланс в ваших руках - кусочек за кусочком", "Видно, куда уходят деньги - месяц за месяцем", "Каждый расход распределяется - сам, без усилий", "Загружаете файл из банка - и система его понимает", "Планируйте сегодня - бюджет на завтра", "Все ваши данные - хранятся в одном месте", "Текущий счёт и кредитки - наконец в одной картине"],
  de: ["Budget und Bilanz in Ihren Händen - Stück für Stück", "Sehen Sie, wohin das Geld geht - Monat für Monat", "Jede Ausgabe wird zugeordnet - von selbst, ohne Aufwand", "Bankdatei hochladen - und das System versteht sie", "Heute planen - das Budget von morgen", "Alle Ihre Daten - an einem Ort gespeichert", "Girokonto und Kreditkarten - endlich in einem Bild"],
  fr: ["Votre budget et votre équilibre en main - part après part", "Voyez où va l'argent - mois après mois", "Chaque dépense est classée - toute seule, sans effort", "Chargez le fichier de votre banque - et le système le comprend", "Planifiez aujourd'hui - le budget de demain", "Toutes vos données - réunies en un seul endroit", "Compte courant et cartes - enfin dans une seule vue"],
  es: ["El presupuesto y el balance en sus manos - porción a porción", "Vean adónde va el dinero - mes tras mes", "Cada gasto se clasifica - solo, sin esfuerzo", "Suban un archivo del banco - y el sistema lo entiende", "Planifiquen hoy - el presupuesto de mañana", "Todos sus datos - guardados en un solo lugar", "Cuenta corriente y tarjetas - por fin en una sola imagen"],
  ja: ["予算もバランスも皆さんの手に - ひと切れずつ", "お金の行き先が見える - 毎月、ひと目で", "すべての支出を自動で分類 - 手間いらず", "銀行のファイルを読み込むだけ - システムが理解します", "今日、計画する - 明日の予算を", "すべてのデータを - ひとつの場所に保存", "普通預金とクレジットカード - ついにひとつの画面に"],
  ar: ["الميزانية والتوازن بين أيديكم - شريحة بعد شريحة", "ترون أين يذهب المال - شهرًا بعد شهر", "كل مصروف يُصنَّف - تلقائيًا، بلا جهد", "حمّلوا ملفًا من البنك - والنظام يفهمه", "خطّطوا اليوم - لميزانية الغد", "كل بياناتكم - محفوظة في مكان واحد", "الحساب الجاري والبطاقات - أخيرًا في صورة واحدة"],
  zh: ["预算与平衡，掌握在你们手中 - 一块接一块", "看清钱花在哪里 - 一个月接一个月", "每笔支出自动分类 - 轻松省力", "上传银行文件 - 系统自动识别", "今天规划 - 明天的预算", "你们的所有数据 - 保存在同一个地方", "活期账户与信用卡 - 终于一目了然"],
  it: ["Budget e bilancio nelle vostre mani - fetta dopo fetta", "Vedete dove vanno i soldi - mese dopo mese", "Ogni spesa viene classificata - da sola, senza fatica", "Caricate il file della banca - e il sistema lo capisce", "Pianificate oggi - il budget di domani", "Tutti i vostri dati - salvati in un unico posto", "Conto corrente e carte - finalmente in un'unica immagine"],
  hi: ["बजट और संतुलन आपके हाथ में - एक-एक टुकड़ा करके", "देखिए पैसा कहाँ जाता है - महीने दर महीने", "हर खर्च का वर्गीकरण - अपने आप, बिना मेहनत", "बैंक की फ़ाइल अपलोड करें - और सिस्टम उसे समझ लेता है", "आज योजना बनाएँ - कल के बजट की", "आपका सारा डेटा - एक ही जगह सुरक्षित", "चालू खाता और क्रेडिट कार्ड - आख़िरकार एक ही तस्वीर में"],
}

function israelWeekday(): number {
  const d = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jerusalem', weekday: 'short' }).format(new Date())
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(d)
}

// [20.10.2026] "הודעה מתחת לתמונת הפרסום" ממסך יחסי ציבור (app/api/system/og-message) - מחליפה את og:title בלבד, לא את שם הלשונית.
// עברית = text, שאר השפות = tx[code] (תורגם בשמירה). ריק או תקלה = הכותרת הקבועה מ-OG
async function ogMessage(code: string): Promise<string> {
  try {
    const r = await pool.query("SELECT value FROM system_DB_Records WHERE key='KeyClick_OG_Message'")
    const raw = r.rows[0]?.value
    if (!raw) return ''
    const { text, tx } = JSON.parse(raw)
    if (!text) return ''
    return code === 'he' ? text : (tx?.[code] || text)
  } catch {
    return ''
  }
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string | string[] }> }): Promise<Metadata> {
  const p = (await searchParams).lang
  const code = typeof p === 'string' && OG[p] ? p : 'he'
  const m = OG[code]
  const url = code === 'he' ? 'https://keyclick.org/' : `https://keyclick.org/?lang=${code}`
  const day = israelWeekday()
  const rot = OG_ROTATE[code] ? { topic: OG_TOPICS[day], text: OG_ROTATE[code][day] } : undefined
  const suffix = code === 'he' ? '' : `-${code}`
  const imageUrl = rot ? `https://keyclick.org/og/${rot.topic}${suffix}.jpg` : `https://keyclick.org/og${suffix}.jpg`
  const image = { url: imageUrl, width: 2400, height: 1260 }
  const description = rot ? rot.text : m.description
  const ogTitle = (await ogMessage(code)) || m.title
  return {
    title: m.title,
    openGraph: { type: 'website', url, title: ogTitle, description, locale: m.locale, images: [image] },
    twitter: { card: 'summary_large_image', images: [image.url] },
  }
}

export default function Page() {
  return <Home />
}
