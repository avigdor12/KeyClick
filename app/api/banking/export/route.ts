import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Record_Source values (matching M Finance ModuleData.vb)
const BANK_DIRECT   = 2
const CREDIT_DIRECT = 3

function makeId(date: string, txId: number): string {
  const d = new Date(date)
  const mm  = String(d.getMonth() + 1).padStart(2, '0')
  const dd  = String(d.getDate()).padStart(2, '0')
  const yy  = String(d.getFullYear()).slice(2)
  const seq = String(txId).padStart(6, '0')
  return `ID_${mm}_${dd}_${yy}_${seq}`
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

  const { rows } = await pool.query<{
    tx_id: number; tx_date: string; description: string
    amount: number; currency: string; category: string
    iban: string; acc_name: string; account_type: string; balance: number
    institution_name: string
  }>(`
    SELECT
      t.id          AS tx_id,
      t.date        AS tx_date,
      t.description,
      t.amount,
      t.currency,
      t.category,
      a.iban,
      a.name        AS acc_name,
      a.account_type,
      a.balance,
      c.institution_name
    FROM bank_transactions t
    JOIN bank_accounts     a ON a.id = t.account_id
    JOIN bank_connections  c ON c.id = a.connection_id
    WHERE c.user_id = $1
      AND c.status  = 'active'
    ORDER BY t.date DESC
  `, [parseInt(userId)])

  const records = rows.map(r => {
    const isCreditCard = r.account_type === 'credit'
    const debit  = r.amount < 0 ? Math.abs(r.amount) : 0
    const credit = r.amount > 0 ? r.amount : 0

    return {
      record_id:           makeId(r.tx_date, r.tx_id),
      source:              isCreditCard ? CREDIT_DIRECT : BANK_DIRECT,
      is_credit_card:      isCreditCard,
      format_info:         'OpenBanking',
      institution_name:    r.institution_name,
      account_number:      r.iban,
      credit_card_number:  isCreditCard ? r.iban : '',
      transaction_date:    r.tx_date,
      value_date:          r.tx_date,
      description:         r.description,
      debit_amount:        debit,
      credit_amount:       credit,
      balance:             r.balance,
      currency:            r.currency,
      category:            r.category,
      notes:               '',
      num_of_months:       0,
      category_tag:        '',
    }
  })

  return NextResponse.json({ count: records.length, records })
}
