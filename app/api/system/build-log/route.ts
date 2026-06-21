import { NextResponse } from 'next/server'

export async function GET() {
  const token     = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID

  if (!token)     return NextResponse.json({ error: 'VERCEL_TOKEN חסר — הוסף אותו ב-Vercel Environment Variables' }, { status: 500 })
  if (!projectId) return NextResponse.json({ error: 'VERCEL_PROJECT_ID חסר' }, { status: 500 })

  try {
    // Get latest deployment
    const depRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1&target=production`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!depRes.ok) {
      const txt = await depRes.text()
      return NextResponse.json({ error: `Vercel API error ${depRes.status}: ${txt}` }, { status: 502 })
    }
    const depData = await depRes.json()
    const dep = depData.deployments?.[0]
    if (!dep) return NextResponse.json({ error: 'לא נמצאו deployments' }, { status: 404 })

    // Get build events for this deployment
    const evRes = await fetch(
      `https://api.vercel.com/v2/deployments/${dep.uid}/events?builds=1&limit=2000`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!evRes.ok) {
      const txt = await evRes.text()
      return NextResponse.json({ error: `Events API error ${evRes.status}: ${txt}` }, { status: 502 })
    }

    // Events come as NDJSON (newline-delimited JSON)
    const raw = await evRes.text()
    const events: { type: string; created: number; payload?: { text?: string; exitCode?: number; name?: string } }[] = []
    for (const line of raw.split('\n')) {
      const t = line.trim()
      if (!t) continue
      try { events.push(JSON.parse(t)) } catch { /* skip malformed */ }
    }

    return NextResponse.json({
      deployment: {
        id:        dep.uid,
        url:       dep.url,
        state:     dep.state,
        readyState: dep.readyState,
        createdAt: dep.createdAt,
        buildingAt: dep.buildingAt,
        ready:     dep.ready,
        meta:      dep.meta,
      },
      events,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
