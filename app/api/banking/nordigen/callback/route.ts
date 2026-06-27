import { NextRequest, NextResponse } from 'next/server'
import { initBankingTables, saveConnection, saveAccount } from '@/lib/banking-db'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return NextResponse.redirect(new URL('/?banking=error', req.url))

  const tokenRes = await fetch(`${NORDIGEN_BASE}/token/new/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenRes.ok) return NextResponse.redirect(new URL('/?banking=error', req.url))

  const reqRes = await fetch(`${NORDIGEN_BASE}/requisitions/${ref}/`, {
    headers: { Authorization: `Bearer ${tokenData.access}` },
  })
  const reqData = await reqRes.json()
  if (!reqRes.ok || !reqData.accounts?.length) return NextResponse.redirect(new URL('/?banking=error', req.url))

  const userId = parseInt(reqData.reference?.split('_')[1] ?? '0')
  if (!userId) return NextResponse.redirect(new URL('/?banking=error', req.url))

  const instRes = await fetch(`${NORDIGEN_BASE}/institutions/${reqData.institution_id}/`, {
    headers: { Authorization: `Bearer ${tokenData.access}` },
  })
  const instData = await instRes.json()
  const institutionName = instData.name ?? reqData.institution_id

  await initBankingTables()
  const connectionId = await saveConnection(
    userId, 'nordigen',
    reqData.institution_id, institutionName,
    tokenData.access, tokenData.refresh,
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  )

  for (const accountId of reqData.accounts) {
    const [detailRes, balRes] = await Promise.all([
      fetch(`${NORDIGEN_BASE}/accounts/${accountId}/details/`, { headers: { Authorization: `Bearer ${tokenData.access}` } }),
      fetch(`${NORDIGEN_BASE}/accounts/${accountId}/balances/`, { headers: { Authorization: `Bearer ${tokenData.access}` } }),
    ])
    const detail = await detailRes.json()
    const bal = await balRes.json()
    const acc = detail.account ?? {}
    const balance = parseFloat(bal.balances?.[0]?.balanceAmount?.amount ?? '0')
    await saveAccount(connectionId, accountId, acc.iban ?? '', acc.name ?? '', acc.currency ?? '', acc.cashAccountType ?? '', balance)
  }

  return NextResponse.redirect(new URL('/?banking=success', req.url))
}
