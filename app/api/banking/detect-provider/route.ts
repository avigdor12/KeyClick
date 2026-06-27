import { NextRequest, NextResponse } from 'next/server'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const EU_COUNTRIES = [
  'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU',
  'IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
  'IS','LI','NO','GB','CH',
]

function providerFromCountry(cc: string): string {
  if (cc === 'IL') return 'il'
  if (cc === 'US') return 'plaid'
  if (EU_COUNTRIES.includes(cc)) return 'nordigen'
  return 'unknown'
}

export async function POST(req: NextRequest) {
  const { language, country, ip } = await req.json()

  if (country) {
    return NextResponse.json({ provider: providerFromCountry(country.toUpperCase()), country, source: 'explicit' })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ provider: 'unknown', source: 'no_groq' })
  }

  const prompt = `You are a banking provider selector.
Given: language="${language ?? ''}", IP="${ip ?? ''}".
Reply with ONLY a JSON object: {"country":"ISO-3166-1 alpha-2 code","confidence":"high|medium|low"}
No extra text.`

  const groqRes = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
      max_tokens: 60,
    }),
  })

  if (!groqRes.ok) return NextResponse.json({ provider: 'unknown', source: 'groq_error' })

  const groqData = await groqRes.json()
  const text = groqData.choices?.[0]?.message?.content ?? ''

  try {
    const parsed = JSON.parse(text)
    const cc = String(parsed.country ?? '').toUpperCase()
    return NextResponse.json({ provider: providerFromCountry(cc), country: cc, confidence: parsed.confidence, source: 'groq' })
  } catch {
    return NextResponse.json({ provider: 'unknown', source: 'parse_error', raw: text })
  }
}
