import { NextRequest, NextResponse } from 'next/server'
import { encodeSession } from '@/lib/banking-session'

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

  const instRes = await fetch(`${NORDIGEN_BASE}/institutions/${reqData.institution_id}/`, {
    headers: { Authorization: `Bearer ${tokenData.access}` },
  })
  const instData = await instRes.json()
  const institutionName = instData.name ?? reqData.institution_id

  // No DB persistence: account details/balances are fetched live and handed straight
  // to the browser inside an encrypted session blob. Nothing is written to Neon.
  const accounts = []
  for (const accountId of reqData.accounts as string[]) {
    const [detailRes, balRes] = await Promise.all([
      fetch(`${NORDIGEN_BASE}/accounts/${accountId}/details/`, { headers: { Authorization: `Bearer ${tokenData.access}` } }),
      fetch(`${NORDIGEN_BASE}/accounts/${accountId}/balances/`, { headers: { Authorization: `Bearer ${tokenData.access}` } }),
    ])
    const detail = await detailRes.json()
    const bal = await balRes.json()
    const acc = detail.account ?? {}
    const balance = parseFloat(bal.balances?.[0]?.balanceAmount?.amount ?? '0')
    accounts.push({
      external_id: accountId,
      iban: acc.iban ?? '',
      name: acc.name ?? '',
      currency: acc.currency ?? '',
      account_type: acc.cashAccountType ?? '',
      balance,
    })
  }

  const bsession = encodeSession({
    provider: 'nordigen',
    institution_id: reqData.institution_id,
    institution_name: institutionName,
    access_token: tokenData.access,
    refresh_token: tokenData.refresh,
    accounts,
  })

  const redirectUrl = new URL('/?banking=success', req.url)
  redirectUrl.searchParams.set('bsession', bsession)
  return NextResponse.redirect(redirectUrl)
}
