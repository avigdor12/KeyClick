// [Claude Code 03.11.2026, לפי הנחיית המשתמש] זיהוי מקור הגעה - משותף ליומן "חי" (visits) וליומן "דף נחיתה" (landing_visits).
// מקור הגעה: utm_source בקישור, אחרת fbclid (פייסבוק מוסיפה לקישורים יוצאים), אחרת לפי דף ההפניה
export function detectSource(referrer: string, search: string): string {
  const params = new URLSearchParams(search || '')
  const utm = params.get('utm_source')
  if (utm) return utm.toLowerCase().slice(0, 40)
  if (params.get('fbclid')) return 'facebook'
  if (!referrer) return 'direct'
  let host = ''
  try { host = new URL(referrer).hostname.toLowerCase() } catch { return 'other' }
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host)) return 'facebook'
  if (/(^|\.)instagram\.com$/.test(host)) return 'instagram'
  if (/(^|\.)(whatsapp\.com|wa\.me)$/.test(host)) return 'whatsapp'
  if (/(^|\.)google\./.test(host)) return 'google'
  if (/(^|\.)keyclick\.org$/.test(host)) return 'keyclick'
  return host.slice(0, 60)
}
