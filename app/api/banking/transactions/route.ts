import { NextRequest, NextResponse } from 'next/server'
import { getConnection, getTransactionsByAccount, saveTransaction } from '@/lib/banking-db'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get('accountId')
  if (!accountId) return NextResponse.json({ error: 'missing accountId' }, { status: 400 })

  const accRes = await pool.query('SELECT * FROM bank_accounts WHERE id=$1', [parseInt(accountId)])
  const account = accRes.rows[0]
  if (!account) return NextResponse.json({ error: 'account not found' }, { status: 404 })

  const connection = await getConnection(account.connection_id)
  if (!connection) return NextResponse.json({ error: 'connection not found' }, { status: 404 })

  if (connection.provider === 'nordigen') {
    const res = await fetch(`${NORDIGEN_BASE}/accounts/${account.external_id}/transactions/`, {
      headers: { Authorization: `Bearer ${connection.access_token}` },
    })
    const data = await res.json()
    const txs = data.transactions?.booked ?? []
    for (const tx of txs) {
      await saveTransaction(
        account.id,
        tx.transactionId ?? tx.internalTransactionId ?? String(Date.now()),
        tx.bookingDate ?? '',
        tx.remittanceInformationUnstructured ?? tx.creditorName ?? '',
        parseFloat(tx.transactionAmount?.amount ?? '0'),
        tx.transactionAmount?.currency ?? '',
        ''
      )
    }
  }

  const transactions = await getTransactionsByAccount(account.id)
  return NextResponse.json(transactions)
}
