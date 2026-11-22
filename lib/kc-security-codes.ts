import { LICENSE_TYPES } from '@/lib/license-types'

// [22.11.2026 אביגדור] טבלאות הקודים של "חשד לפריצה" (בשימוש המערכת > איסוף נתונים > אבטחת מידע).
// הקובץ משותף לשרת ולדפדפן (בלי מסד). במסד נשמרים breach (קוד פריצה) ו-measures (קודי חסימה, מופרדים בפסיקים).

// קוד פריצה - התופעה שהתגלתה
export const BREACH = { UNAUTHORIZED: 1, FAKE_ID: 2, LICENSE_THEFT: 3, LOGIN_FAILS: 4 } as const
export const BREACH_CODES: { code: number; label: string }[] = [
  { code: 1, label: 'פנייה לא מורשית לשרת' },
  { code: 2, label: 'ID משתמש מזויף' },
  { code: 3, label: 'גניבת רשיון' },
  { code: 4, label: 'Login כשלים רבים' },
]

// קוד חסימה - האמצעי שהשרת הפעיל (השרת בלבד כותב בעמודה הזו)
export const MEASURE = { CLOSE_SITE: 1, WARNING: 2, ACCESS_BLOCK: 3, ACCOUNT_BLOCK: 4, SUSPEND: 5 } as const
export const BLOCK_CODES: { code: number; label: string }[] = [
  { code: 1, label: 'סגירת האתר' },
  { code: 2, label: 'הודעת התרעה' },
  { code: 3, label: 'חסימת גישה' },
  { code: 4, label: 'חסימת חשבון קיים' },
  { code: 5, label: 'השהייה' },
]

// החלטת מנהל - המנהל בלבד בוחר (עמודה נפרדת מהשרת). שחרור - מסיר את חסימת החשבון ואת חסימת ה-IP של המקרה
export const DECISION = { CHECK: 1, KEEP_BLOCK: 2, RELEASE: 3 } as const
export const DECISION_CODES: { code: number; label: string }[] = [
  { code: 1, label: 'בדיקה' },
  { code: 2, label: 'המשך חסימה' },
  { code: 3, label: 'שחרור' },
]

// קוד רשיון - לפי הסדר ב-lib/license-types.ts
export const LICENSE_CODES: { code: number; label: string }[] = Object.values(LICENSE_TYPES).map((label, i) => ({ code: i + 1, label }))
export const licenseCode = (license: string | null) => license ? (LICENSE_CODES.find(l => l.label === license)?.code ?? null) : null
