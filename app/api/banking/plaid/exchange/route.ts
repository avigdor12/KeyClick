import { NextRequest, NextResponse } from 'next/server'
import { encodeSession } from '@/lib/banking-session'

const PLAID_BASE = 'https://sandbox.plaid.com'

// Stateless: the exchanged access token + account list are handed straight back to the
// browser inside an encrypted session blob. Nothing is written to Neon.
export async function POST(req: NextRequest) {
  const { publicToken, institutionName } = await req.json()
  if (!publicToken) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  const exchangeRes = await fetch(`${PLAID_BASE}/item/public_token/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      public_token: publicToken,
    }),
  })
  const exchangeData = await exchangeRes.json()
  if (!exchangeRes.ok) return NextResponse.json({ error: exchangeData }, { status: exchangeRes.status })

  const accessToken = exchangeData.access_token

  const accountsRes = await fetch(`${PLAID_BASE}/accounts/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: accessToken,
    }),
  })
  const accountsData = await accountsRes.json()

  const institutionId = accountsData.item?.institution_id ?? ''
  const accounts = (accountsData.accounts ?? []).map((acc: { account_id: string; mask?: string; name?: string; balances?: { iso_currency_code?: string; current?: number }; type?: string }) => ({
    external_id: acc.account_id,
    iban: acc.mask ? `****${acc.mask}` : '',
    name: acc.name ?? '',
    currency: acc.balances?.iso_currency_code ?? 'USD',
    account_type: acc.type ?? '',
    balance: acc.balances?.current ?? 0,
  }))

  const bsession = encodeSession({
    provider: 'plaid',
    institution_id: institutionId,
    institution_name: institutionName ?? '',
    access_token: accessToken,
    accounts,
  })

  return NextResponse.json({
    ok: true,
    bsession,
    connections: [{ id: institutionId, provider: 'plaid', institution_name: institutionName ?? '', status: 'active', created_at: new Date().toISOString() }],
    accounts: accounts.map((a: { external_id: string; iban: string; name: string; currency: string; account_type: string; balance: number }) => ({
      id: a.external_id, connection_id: institutionId, iban: a.iban, name: a.name, currency: a.currency, account_type: a.account_type, balance: a.balance,
    })),
  })
}
