import { NextRequest, NextResponse } from 'next/server'
import { getConnection, getAccountsByConnection, saveTransaction } from '@/lib/banking-db'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const PLAID_BASE = 'https://sandbox.plaid.com'

export async function POST(req: NextRequest) {
  const { connectionId } = await req.json()
  if (!connectionId) return NextResponse.json({ error: 'missing connectionId' }, { status: 400 })

  const connection = await getConnection(connectionId)
  if (!connection || connection.provider !== 'plaid') return NextResponse.json({ error: 'invalid connection' }, { status: 404 })

  const accounts = await getAccountsByConnection(connectionId)

  const startDate = new Date(); startDate.setMonth(startDate.getMonth() - 3)
  const txRes = await fetch(`${PLAID_BASE}/transactions/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: connection.access_token,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: new Date().toISOString().slice(0, 10),
    }),
  })
  const txData = await txRes.json()

  for (const tx of txData.transactions ?? []) {
    const account = accounts.find(a => a.external_id === tx.account_id)
    if (!account) continue
    await saveTransaction(
      account.id, tx.transaction_id,
      tx.date ?? '', tx.name ?? '',
      tx.amount ?? 0, tx.iso_currency_code ?? 'USD', tx.category?.[0] ?? ''
    )
  }

  const balancesRes = await fetch(`${PLAID_BASE}/accounts/balance/get`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      access_token: connection.access_token,
    }),
  })
  const balancesData = await balancesRes.json()
  for (const acc of balancesData.accounts ?? []) {
    await pool.query(
      'UPDATE bank_accounts SET balance=$1, last_updated=NOW() WHERE external_id=$2',
      [acc.balances?.current ?? 0, acc.account_id]
    )
  }

  return NextResponse.json({ ok: true, count: txData.transactions?.length ?? 0 })
}
