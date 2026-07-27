import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/banking-session'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

type NordigenTx = {
  transactionId?: string
  internalTransactionId?: string
  bookingDate?: string
  valueDate?: string
  remittanceInformationUnstructured?: string
  creditorName?: string
  transactionAmount?: { amount?: string; currency?: string }
}

// Stateless: the encrypted session blob (holding the OAuth access token) is decoded
// per-request and Nordigen is called live. Nothing is read from or written to a DB.
export async function GET(req: NextRequest) {
  const bsession = req.nextUrl.searchParams.get('bsession')
  const accountId = req.nextUrl.searchParams.get('accountId')
  if (!bsession || !accountId) return NextResponse.json({ error: 'missing bsession/accountId' }, { status: 400 })

  let session
  try {
    session = decodeSession(bsession)
  } catch {
    return NextResponse.json({ error: 'invalid session' }, { status: 400 })
  }

  if (session.provider !== 'nordigen') {
    return NextResponse.json({ transactions: [] })
  }

  const res = await fetch(`${NORDIGEN_BASE}/accounts/${accountId}/transactions/`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  })
  const data = await res.json()
  const booked: NordigenTx[] = data.transactions?.booked ?? []

  const transactions = booked.map((tx, i) => ({
    id: tx.transactionId ?? tx.internalTransactionId ?? String(i),
    date: tx.bookingDate ?? '',
    description: tx.remittanceInformationUnstructured ?? tx.creditorName ?? '',
    amount: parseFloat(tx.transactionAmount?.amount ?? '0'),
    currency: tx.transactionAmount?.currency ?? '',
    category: '',
  }))

  return NextResponse.json({ transactions })
}
