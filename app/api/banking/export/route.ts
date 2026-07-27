import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/banking-session'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

// Record_Source values (matching M Finance ModuleData.vb)
const BANK_DIRECT   = 2
const CREDIT_DIRECT = 3

type NordigenTx = {
  bookingDate?: string
  valueDate?: string
  remittanceInformationUnstructured?: string
  creditorName?: string
  transactionAmount?: { amount?: string; currency?: string }
}

function makeId(date: string, seq: number): string {
  const d = new Date(date)
  const mm  = String(d.getMonth() + 1).padStart(2, '0')
  const dd  = String(d.getDate()).padStart(2, '0')
  const yy  = String(d.getFullYear()).slice(2)
  return `ID_${mm}_${dd}_${yy}_${String(seq).padStart(6, '0')}`
}

type ExportRecord = {
  record_id: string
  source: number
  is_credit_card: boolean
  format_info: string
  institution_name: string
  account_number: string
  credit_card_number: string
  transaction_date: string
  value_date: string
  description: string
  debit_amount: number
  credit_amount: number
  balance: number
  currency: string
  category: string
  notes: string
  num_of_months: number
  category_tag: string
}

// Stateless: builds M_Finance-format records directly from a live Nordigen call using
// the access token held in the browser's encrypted session blob. No DB read/write.
export async function GET(req: NextRequest) {
  const bsession = req.nextUrl.searchParams.get('bsession')
  if (!bsession) return NextResponse.json({ error: 'missing bsession' }, { status: 400 })

  let session
  try {
    session = decodeSession(bsession)
  } catch {
    return NextResponse.json({ error: 'invalid session' }, { status: 400 })
  }

  if (session.provider !== 'nordigen') return NextResponse.json({ count: 0, records: [] })

  let seq = 0
  const records: ExportRecord[] = []
  for (const acc of session.accounts) {
    const isCreditCard = acc.account_type === 'credit'
    const res = await fetch(`${NORDIGEN_BASE}/accounts/${acc.external_id}/transactions/`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const data = await res.json()
    const booked: NordigenTx[] = data.transactions?.booked ?? []

    for (const tx of booked) {
      const amount = parseFloat(tx.transactionAmount?.amount ?? '0')
      const debit  = amount < 0 ? Math.abs(amount) : 0
      const credit = amount > 0 ? amount : 0
      const txDate = tx.bookingDate ?? ''

      records.push({
        record_id:           makeId(txDate, seq++),
        source:              isCreditCard ? CREDIT_DIRECT : BANK_DIRECT,
        is_credit_card:      isCreditCard,
        format_info:         'OpenBanking',
        institution_name:    session.institution_name,
        account_number:      acc.iban,
        credit_card_number:  isCreditCard ? acc.iban : '',
        transaction_date:    txDate,
        value_date:          tx.valueDate ?? txDate,
        description:         tx.remittanceInformationUnstructured ?? tx.creditorName ?? '',
        debit_amount:        debit,
        credit_amount:       credit,
        balance:             acc.balance,
        currency:            tx.transactionAmount?.currency ?? acc.currency,
        category:            '',
        notes:               '',
        num_of_months:       0,
        category_tag:        '',
      })
    }
  }

  return NextResponse.json({ count: records.length, records })
}
