// ═══════════════════════════════════════════════════════════════════════════
// ❄  הוקפא 10.09.2026 — נושא השירותים הבנקאיים הישירים כולו מוקפא (החלטת אביגדור).
//    קוד לא-נגיש: אין כפתור באתר ואין כתובת שמפעילים את המסלול הזה.
//    נשמר ולא נמחק (מחיקה תשבור אינדקסים/ניתוב). אין להרחיב — לתקן רק אם מבטלים את ההקפאה.
//    תיעוד: Doc/AI Claude Code/Removal_Banking_Services.html
// ═══════════════════════════════════════════════════════════════════════════
import { encrypt, decrypt } from './banking-crypto'

export type BankSessionAccount = {
  external_id: string
  iban: string
  name: string
  currency: string
  account_type: string
  balance: number
}

export type BankSession = {
  provider: 'nordigen' | 'plaid' | 'il'
  institution_id: string
  institution_name: string
  access_token: string
  refresh_token?: string
  accounts: BankSessionAccount[]
}

// Encodes the connection + account data in an encrypted, opaque blob that lives only
// in the browser (URL param -> React state) — never written to any server-side store.
export function encodeSession(session: BankSession): string {
  return encodeURIComponent(encrypt(JSON.stringify(session)))
}

export function decodeSession(blob: string): BankSession {
  return JSON.parse(decrypt(decodeURIComponent(blob))) as BankSession
}
