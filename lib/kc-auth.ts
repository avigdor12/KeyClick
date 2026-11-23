import crypto from 'crypto'

// [22.11.2026 אביגדור] אישור כניסה חתום (שלב 1 בתיקון האבטחה).
// אחרי כניסה מוצלחת (login, register, visitor, visitor/register, dev-bypass-login) השרת מחזיר בכותרת x-kc-token אישור חתום:
// מספר המשתמש + זמן + מספר אקראי, חתום ב-HMAC-SHA256 במפתח KC_SESSION_SECRET (משתנה סביבה - מקומית ב-.env.local, באתר החי ב-Vercel).
// הדפדפן שומר את האישור בזיכרון של הלשונית בלבד (lib/kc-auth-client.ts) ושולח אותו בכותרת x-kc-auth בכל פנייה ל-/api.
// לכל לשונית אישור משלה - שני משתמשים בשתי לשוניות עובדים במקביל. ריענון / יציאה - האישור נמחק (כמו המשתמש עצמו).
// בלי תפוגה (החלטת אביגדור): האישור תקף כל עוד הלשונית מחוברת.
// [22.11.2026] נשקל ונדחה - תפוגה בשרת (למשל שעה בלי פעילות, כמו הניתוק בדפדפן ב-HomeClient: IDLE_LOGOUT_MS).
//   הפער הידוע: השרת לא שומר אישורים, ולכן אחרי ניתוק / סגירה בדפדפן אישור שהועתק קודם עדיין תקף בשרת.
//   הסיכון נמוך: העתקת האישור מחייבת גישה למחשב הלקוח בזמן שהוא מחובר (וירוס / גישה פיזית), והמעתיק יכול רק את מה שהלקוח עצמו רשאי -
//   כל ניסיון מעבר לזה נתפס ונחסם (lib/kc-security.ts).
//   הסיבה לדחייה: שעון השרת ושעון הדפדפן נפרדים - חשש לחוסר סנכרון שינתק לקוח פעיל; פתרון נכון מחייב מנגנון חידוש מסובך שתקלה בו תחסום לקוחות אמיתיים.
//   הודעת "ניתוק" מהדפדפן לשרת לא מספיקה לבד (כיבוי מחשב / ניתוק רשת / סגירה בכוח - ההודעה לא נשלחת).
// בשלב 1 שום פעולה לא נחסמת: readKcUserId רק קורא. החסימה - בשלבים 2-3.
// אין מפתח (KC_SESSION_SECRET חסר) - לא נוצר אישור, והכניסה ממשיכה לעבוד כרגיל.

export const KC_TOKEN_HEADER = 'x-kc-token'   // שרת -> דפדפן
export const KC_AUTH_HEADER = 'x-kc-auth'     // דפדפן -> שרת

function secret(): string { return process.env.KC_SESSION_SECRET || '' }

function sign(payload: string, s: string): string { return crypto.createHmac('sha256', s).update(payload).digest('base64url') }

// אישור חדש למשתמש; null כשאין מפתח או אין מספר משתמש
export function issueKcToken(uid: number): string | null {
  const s = secret()
  const id = Number(uid)
  if (!s || !Number.isInteger(id) || id <= 0) return null
  const payload = Buffer.from(JSON.stringify({ uid: id, iat: Date.now(), n: crypto.randomBytes(8).toString('hex') })).toString('base64url')
  return payload + '.' + sign(payload, s)
}

// מצרף אישור לתשובה (אם יש מפתח); מחזיר את אותה תשובה
export function withKcToken<T extends Response>(res: T, uid: number): T {
  const t = issueKcToken(uid)
  if (t) res.headers.set(KC_TOKEN_HEADER, t)
  return res
}

// מספר המשתמש מתוך האישור שהדפדפן שלח; null כשאין אישור, האישור פגום או החתימה לא תקינה
export function readKcUserId(req: Request): number | null {
  const s = secret()
  const t = req.headers.get(KC_AUTH_HEADER) || ''
  const dot = t.indexOf('.')
  if (!s || dot <= 0) return null
  const payload = t.slice(0, dot), got = Buffer.from(t.slice(dot + 1)), expected = Buffer.from(sign(payload, s))
  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return null
  try {
    const p = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const id = Number(p.uid)
    return Number.isInteger(id) && id > 0 ? id : null
  } catch { return null }
}

