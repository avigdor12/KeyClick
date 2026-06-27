import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    nordigen: !!(process.env.NORDIGEN_SECRET_ID && process.env.NORDIGEN_SECRET_KEY),
    plaid: !!(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET),
    il: !!(process.env.IL_PROVIDER_KEY && process.env.IL_PROVIDER_BASE_URL),
    groq: !!process.env.GROQ_API_KEY,
  })
}
