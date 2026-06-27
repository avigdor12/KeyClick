import { NextRequest, NextResponse } from 'next/server'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

export async function POST(req: NextRequest) {
  const { institutionId, userId } = await req.json()
  if (!institutionId || !userId) return NextResponse.json({ error: 'missing params' }, { status: 400 })

  const tokenRes = await fetch(`${NORDIGEN_BASE}/token/new/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenRes.ok) return NextResponse.json({ error: tokenData }, { status: tokenRes.status })

  const callbackUrl = `${process.env.NEXTAUTH_URL}/api/banking/nordigen/callback`

  const res = await fetch(`${NORDIGEN_BASE}/requisitions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenData.access}`,
    },
    body: JSON.stringify({
      redirect: callbackUrl,
      institution_id: institutionId,
      reference: `user_${userId}_${Date.now()}`,
    }),
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })

  return NextResponse.json({ link: data.link, requisitionId: data.id })
}
