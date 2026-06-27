import { NextRequest, NextResponse } from 'next/server'
import { initBankingTables, saveConnection, saveAccount } from '@/lib/banking-db'

const PLAID_BASE = 'https://sandbox.plaid.com'

export async function POST(req: NextRequest) {
  const { publicToken, userId, institutionName } = await req.json()
  if (!publicToken || !userId) return NextResponse.json({ error: 'missing params' }, { status: 400 })

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

  await initBankingTables()
  const connectionId = await saveConnection(
    userId, 'plaid',
    accountsData.item?.institution_id ?? '', institutionName ?? '',
    accessToken, '', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  )

  for (const acc of accountsData.accounts ?? []) {
    await saveAccount(
      connectionId, acc.account_id,
      acc.mask ? `****${acc.mask}` : '',
      acc.name ?? '', acc.balances?.iso_currency_code ?? 'USD',
      acc.type ?? '', acc.balances?.current ?? 0
    )
  }

  return NextResponse.json({ ok: true, connectionId })
}
