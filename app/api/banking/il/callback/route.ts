import { NextRequest, NextResponse } from 'next/server'
import { encodeSession } from '@/lib/banking-session'

const IL_BASE = process.env.IL_PROVIDER_BASE_URL ?? ''

// Placeholder provider, not wired to a real integration yet (no IL_PROVIDER_BASE_URL
// configured). Kept in the same stateless pattern as Nordigen/Plaid for consistency —
// no DB persistence.
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

  const accounts = (details.accounts ?? []).map((acc: { id: string; iban?: string; accountNumber?: string; name?: string; currency?: string; type?: string; balance?: number }) => ({
    external_id: acc.id,
    iban: acc.iban ?? acc.accountNumber ?? '',
    name: acc.name ?? '',
    currency: acc.currency ?? 'ILS',
    account_type: acc.type ?? 'checking',
    balance: acc.balance ?? 0,
  }))

  const bsession = encodeSession({
    provider: 'il',
    institution_id: details.institutionId ?? ref,
    institution_name: details.institutionName ?? '',
    access_token: details.accessToken ?? '',
    refresh_token: details.refreshToken ?? '',
    accounts,
  })

  const redirectUrl = new URL('/?banking=success', req.url)
  redirectUrl.searchParams.set('bsession', bsession)
  return NextResponse.redirect(redirectUrl)
}
