import { NextResponse } from 'next/server'

// Personal banking data (connections/accounts/transactions) is no longer persisted
// anywhere server-side — it only ever exists inside the browser's encrypted session
// blob for the duration of a single visit. Nothing to show here by design.
export async function GET() {
  return NextResponse.json({
    connections: [],
    accounts: [],
    transactions: [],
    note: 'Banking data is not persisted server-side (stateless session flow) — nothing to display here.',
  })
}
