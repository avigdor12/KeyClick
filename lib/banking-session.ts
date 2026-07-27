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
