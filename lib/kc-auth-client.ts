// [22.11.2026 אביגדור] אישור כניסה חתום - צד הדפדפן (שלב 1 בתיקון האבטחה, ראה lib/kc-auth.ts).
// עוטף את fetch פעם אחת: תשובה מהשרת עם כותרת x-kc-token - האישור נשמר בזיכרון של הלשונית (משתנה במודול, לא localStorage/sessionStorage/עוגייה);
// כל פנייה ל-/api באותה לשונית נשלחת עם הכותרת x-kc-auth. ריענון הדף מוחק את האישור, כמו את המשתמש עצמו.
// כך לא צריך לשנות אף קריאת fetch בקוד.

const TOKEN_HEADER = 'x-kc-token'
const AUTH_HEADER = 'x-kc-auth'
let kcToken = ''

export function clearKcToken() { kcToken = '' }

// [22.11.2026] שלב 2: השרת חסם פנייה (lib/kc-security.ts, כותרת x-kc-blocked) -> חלון "כניסה חסומה, פנה למנהל המערכת".
// מוצג פעם אחת בכל פעם (אם החלון כבר פתוח - לא נפתח חלון נוסף).
// x-kc-kick (קוד חסימה 1, סגירת האתר): האישור נמחק מיד, והלחיצה על "אישור" טוענת את הדף מחדש = המשתמש מנותק.
const BLOCKED_HEADER = 'x-kc-blocked'
const KICK_HEADER = 'x-kc-kick'
let kicked = false
const OK_LABEL: Record<string, string> = { he: 'אישור', en: 'OK', ru: 'ОК', de: 'OK', fr: 'OK', es: 'Aceptar', ja: 'OK', ar: 'موافق', zh: '确定', it: 'OK', hi: 'ठीक है' }
function showBlocked(text: string) {
  if (document.getElementById('kc-blocked-box')) return
  const bg = document.createElement('div')
  bg.id = 'kc-blocked-box'
  bg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:2147483647;display:flex;align-items:center;justify-content:center'
  const box = document.createElement('div')
  // [24.11.2026] כיוון הטקסט וכפתור האישור לפי שפת הלקוח (cookie keyclick_lang) - הודעת התחזוקה מגיעה בשפת הלקוח
  const lang = (document.cookie.match(/(?:^|;\s*)keyclick_lang=([a-z]{2})/) || [])[1] || 'en'
  box.dir = lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'
  box.style.cssText = 'background:#fff;border:3px solid #c0392b;border-radius:10px;padding:24px 32px;font:bold 18px Arial,sans-serif;color:#c0392b;text-align:center;max-width:90vw'
  box.textContent = text
  const ok = document.createElement('button')
  ok.textContent = OK_LABEL[lang] || OK_LABEL.en
  ok.style.cssText = 'display:block;margin:18px auto 0;padding:6px 24px;font:bold 14px Arial,sans-serif;background:#c0392b;color:#fff;border:none;border-radius:6px;cursor:pointer'
  ok.onclick = () => { if (kicked) window.location.reload(); else bg.remove() }
  box.appendChild(ok)
  bg.appendChild(box)
  document.body.appendChild(bg)
}

function isApiUrl(input: RequestInfo | URL): boolean {
  const u = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (u.startsWith('/api/')) return true
  try { const p = new URL(u, window.location.href); return p.origin === window.location.origin && p.pathname.startsWith('/api/') } catch { return false }
}

if (typeof window !== 'undefined') {
  const w = window as typeof window & { __kcFetchWrapped?: boolean }
  if (!w.__kcFetchWrapped) {
    w.__kcFetchWrapped = true
    const orig = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const api = isApiUrl(input)
      if (api && kcToken) {
        const h = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
        h.set(AUTH_HEADER, kcToken)
        init = { ...init, headers: h }
      }
      const res = await orig(input, init)
      if (api) {
        const t = res.headers.get(TOKEN_HEADER); if (t) kcToken = t
        if (res.headers.get(KICK_HEADER)) { kicked = true; kcToken = '' }
        const b = res.headers.get(BLOCKED_HEADER)
        if (b) { try { showBlocked(decodeURIComponent(b)) } catch { /* ignore */ } }
      }
      return res
    }
  }
}
