import { NextRequest, NextResponse } from 'next/server'

// Stateless by design: no bank connection/account data is persisted server-side anymore
// (see lib/banking-session.ts). This endpoint has nothing to look up — every real
// connection/account list lives only in the browser's decoded session state.
export async function GET(_req: NextRequest) {
  return NextResponse.json({ connections: [], accounts: [] })
}

export async function DELETE(_req: NextRequest) {
  // Nothing is stored server-side to revoke; disconnect is handled client-side.
  return NextResponse.json({ ok: true })
}
