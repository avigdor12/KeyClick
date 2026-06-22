import { NextResponse } from 'next/server'

export const revalidate = 3600

const FALLBACK: Record<string, number> = {
  USD: 1, EUR: 0.92, ILS: 3.70, JPY: 150, SAR: 3.75, CNY: 7.20, RUB: 90, INR: 83
}

export async function GET() {
  try {
    const res = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const usd = data.usd as Record<string, number>
    const rates: Record<string, number> = {
      USD: 1,
      EUR: usd.eur ?? FALLBACK.EUR,
      ILS: usd.ils ?? FALLBACK.ILS,
      JPY: usd.jpy ?? FALLBACK.JPY,
      SAR: usd.sar ?? FALLBACK.SAR,
      CNY: usd.cny ?? FALLBACK.CNY,
      RUB: usd.rub ?? FALLBACK.RUB,
      INR: usd.inr ?? FALLBACK.INR,
    }
    return NextResponse.json({ rates })
  } catch {
    return NextResponse.json({ rates: FALLBACK })
  }
}
