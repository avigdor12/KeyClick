import { NextRequest, NextResponse } from 'next/server'
import { initBankingTables, saveConnection, saveAccount } from '@/lib/banking-db'

const IL_BASE = process.env.IL_PROVIDER_BASE_URL ?? ''

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref')
  if (!ref) return NextResponse.redirect(new URL('/?banking=error', req.url))

  if (!IL_BASE || !process.env.IL_PROVIDER_KEY) {
    return NextResponse.redirect(new URL('/?banking=error&reason=not_configured', req.url))
  }

  const detailsRes = await fetch(`${IL_BASE}/connections/${ref}`, {
    headers: { Authorization: `Bearer ${process.env.IL_PROVIDER_KEY}` },
  })
  const details = await detailsRes.json()
  if (!detailsRes.ok) return NextResponse.redirect(new URL('/?banking=error', req.url))

  await initBankingTables()
  const connectionId = await saveConnection(
    details.userId ?? 'unknown', 'il',
    details.institutionId ?? ref, details.institutionName ?? '',
    details.accessToken ?? '', details.refreshToken ?? '',
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  )

  for (const acc of details.accounts ?? []) {
    await saveAccount(
      connectionId, acc.id,
      acc.iban ?? acc.accountNumber ?? '',
      acc.name ?? '', acc.currency ?? 'ILS',
      acc.type ?? 'checking', acc.balance ?? 0
    )
  }

  return NextResponse.redirect(new URL('/?banking=success', req.url))
}
