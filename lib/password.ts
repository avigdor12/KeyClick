import crypto from 'crypto'
import bcrypt from 'bcryptjs'

// גיבוב סיסמה אחיד לשני האתרים (23.09.2026): scrypt, באותו פורמט בדיוק כמו ב-M_Finance_app (api/_lib/mf_auth.js):
// scrypt$N$r$p$salt(hex)$key(hex). סיסמאות ישנות שנשמרו ב-bcrypt ($2...) ממשיכות לעבוד באימות.
const SCRYPT = { N: 16384, r: 8, p: 1 }

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(String(password), salt, 64, SCRYPT)
  return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('hex'), key.toString('hex')].join('$')
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
  if (!stored) return false
  const p = String(stored).split('$')
  if (p.length === 6 && p[0] === 'scrypt') {
    const expected = Buffer.from(p[5], 'hex')
    const actual = crypto.scryptSync(String(password), Buffer.from(p[4], 'hex'), expected.length, { N: +p[1], r: +p[2], p: +p[3] })
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  }
  return bcrypt.compare(String(password), String(stored))
}
