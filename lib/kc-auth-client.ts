// [22.11.2026 אביגדור] אישור כניסה חתום - צד הדפדפן (שלב 1 בתיקון האבטחה, ראה lib/kc-auth.ts).
// עוטף את fetch פעם אחת: תשובה מהשרת עם כותרת x-kc-token - האישור נשמר בזיכרון של הלשונית (משתנה במודול, לא localStorage/sessionStorage/עוגייה);
// כל פנייה ל-/api באותה לשונית נשלחת עם הכותרת x-kc-auth. ריענון הדף מוחק את האישור, כמו את המשתמש עצמו.
// כך לא צריך לשנות אף קריאת fetch בקוד.

const TOKEN_HEADER = 'x-kc-token'
const AUTH_HEADER = 'x-kc-auth'
let kcToken = ''

export function clearKcToken() { kcToken = '' }

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
      if (api) { const t = res.headers.get(TOKEN_HEADER); if (t) kcToken = t }
      return res
    }
  }
}
