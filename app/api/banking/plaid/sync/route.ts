import { NextRequest, NextResponse } from 'next/server'
import { decodeSession, encodeSession } from '@/lib/banking-session'

const PLAID_BASE = 'https://sandbox.plaid.com'

// Not currently wired to any UI button (kept for parity/future use). Stateless: takes
// the browser-held session blob instead of a DB connectionId, refreshes transactions
// and balances live from Plaid, and returns a refreshed blob — no DB read/write.
export async function POST(req: NextRequest) {
  const { bsession } = await req.json()
  if (!bsession) return NextResponse.json({ error: 'missing bsession' }, { status: 400 })

  let session
  try {
    session = decodeSession(bsession)
  } catch {
    return NextResponse.json({ error: 'invalid session' }, { status: 400 })
  }
  if (session.provider !== 'plaid') return NextResponse.json({ error: 'invalid session' }, { status: 404 })

  const startDate = new Date(); startDate.setMonth(startDate.getMonth() - 3)
  const txRes = await fetch(`${PLAID_BASE}/transactions/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: session.access_token,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
    }),
  })
  const txData = await txRes.json()

  const balancesRes = await fetch(`${PLAID_BASE}/accounts/balance/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: session.access_token,
    }),
  })
  const balancesData = await balancesRes.json()
  const balanceByExternalId = new Map<string, number>(
    (balancesData.accounts ?? []).map((acc: { account_id: string; balances?: { current?: number } }) => [acc.account_id, acc.balances?.current ?? 0])
  )

  const refreshedAccounts = session.accounts.map(a => ({
    ...a,
    balance: balanceByExternalId.get(a.external_id) ?? a.balance,
  }))

  const newBsession = encodeSession({ ...session, accounts: refreshedAccounts })

  return NextResponse.json({ ok: true, count: txData.transactions?.length ?? 0, bsession: newBsession })
}
