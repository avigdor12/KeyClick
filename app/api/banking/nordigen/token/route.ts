import { NextResponse } from 'next/server'

const NORDIGEN_BASE = 'https://bankaccountdata.gocardless.com/api/v2'

export async function GET() {
  const res = await fetch(`${NORDIGEN_BASE}/token/new/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    }),
  })
  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
  return NextResponse.json({ access: data.access, refresh: data.refresh })
}
