import { NextRequest, NextResponse } from 'next/server'
import { decodeSession } from '@/lib/banking-session'

// Turns the encrypted, browser-held session blob back into a plain connection/account
// list for the UI. Pure decrypt+parse — no database access, nothing persisted.
export async function POST(req: NextRequest) {
  const { bsession } = await req.json()
  if (!bsession) return NextResponse.json({ error: 'missing bsession' }, { status: 400 })

  try {
    const session = decodeSession(bsession)
    return NextResponse.json({
      connections: [{
        id: session.institution_id,
        provider: session.provider,
        institution_name: session.institution_name,
        status: 'active',
        created_at: new Date().toISOString(),
      }],
      accounts: session.accounts.map(a => ({
        id: a.external_id,
        connection_id: session.institution_id,
        iban: a.iban,
        name: a.name,
        currency: a.currency,
        account_type: a.account_type,
        balance: a.balance,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'invalid session' }, { status: 400 })
  }
}
