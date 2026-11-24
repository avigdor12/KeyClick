// [24.11.2026] צמצום הפניות למסד (מכסת Neon): בדיקות תקופתיות רצות רק כשיש מישהו מול האתר.
// pollAllowed() = הלשונית מוצגת על המסך וגם הייתה פעילות (עכבר/מקלדת/גלילה/מגע) ב-10 הדקות האחרונות.
// כשהתנאי חוזר להתקיים (חזרה ללשונית או פעולה ראשונה אחרי הפסקה) נשלח האירוע kc-poll-resume -
// הבדיקות מאזינות לו ורצות מיד, כך שההתראות לא מתעכבות.
// כך המסד יכול "להירדם" (אחרי 5 דקות בלי פניות) כשהלשונית ברקע או כשאף אחד לא עובד.

export const POLL_IDLE_MS = 10 * 60 * 1000
export const POLL_RESUME_EVENT = 'kc-poll-resume'

let lastActivity = Date.now()

export function pollAllowed(): boolean {
  if (typeof document === 'undefined') return true
  return document.visibilityState === 'visible' && Date.now() - lastActivity < POLL_IDLE_MS
}

if (typeof window !== 'undefined') {
  const w = window as typeof window & { __kcPollInstalled?: boolean }
  if (!w.__kcPollInstalled) {
    w.__kcPollInstalled = true
    const resume = () => window.dispatchEvent(new Event(POLL_RESUME_EVENT))
    const onActivity = () => {
      const was = pollAllowed()
      lastActivity = Date.now()
      if (!was && pollAllowed()) resume()
    }
    ;['mousedown', 'mousemove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(ev =>
      window.addEventListener(ev, onActivity, { passive: true, capture: true }))
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') { lastActivity = Date.now(); resume() }
    })
  }
}
