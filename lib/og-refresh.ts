// [20.10.2026] מבקש מפייסבוק לקרוא מחדש את תגיות התצוגה של כל 11 הכתובות (עברית - בלי lang).
// משמש את app/api/og-refresh (Vercel Cron בלילה) ואת app/api/system/og-message (לחיצת "עדכון" במסך יחסי ציבור).
// FB_APP_TOKEN = "APP_ID|APP_SECRET" של אפליקציית פייסבוק
// גם עם www: האתר מפנה את keyclick.org ל-www.keyclick.org, ופייסבוק עלול לשמור את שתי הכתובות בנפרד
const PATHS = ['/', ...['en', 'ru', 'de', 'fr', 'es', 'ja', 'ar', 'zh', 'it', 'hi'].map(l => `/?lang=${l}`)]
const URLS = ['https://keyclick.org', 'https://www.keyclick.org'].flatMap(h => PATHS.map(p => h + p))

export type OgRefreshResult = { url: string; ok: boolean; image: string | null; error: string | null }

export async function refreshFacebookOg(): Promise<{ ok: boolean; error?: string; results: OgRefreshResult[] }> {
  const token = process.env.FB_APP_TOKEN
  if (!token) return { ok: false, error: 'FB_APP_TOKEN missing', results: [] }

  const results: OgRefreshResult[] = []
  for (const u of URLS) {
    try {
      const r = await fetch(`https://graph.facebook.com/?id=${encodeURIComponent(u)}&scrape=true&access_token=${encodeURIComponent(token)}`, { method: 'POST' })
      const body = await r.json()
      results.push({ url: u, ok: r.ok, image: body?.image?.[0]?.url ?? null, error: body?.error?.message ?? null })
    } catch (e) {
      results.push({ url: u, ok: false, image: null, error: String(e) })
    }
  }
  return { ok: results.every(x => x.ok), results }
}
