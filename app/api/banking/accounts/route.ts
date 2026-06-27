import { NextRequest, NextResponse } from 'next/server'
import { getUserConnections, getAccountsByConnection, updateConnectionStatus } from '@/lib/banking-db'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })

  const connections = await getUserConnections(parseInt(userId))
  const accounts = (await Promise.all(connections.map(c => getAccountsByConnection(c.id)))).flat()
  return NextResponse.json({ connections, accounts })
}

export async function DELETE(req: NextRequest) {
  const { connectionId } = await req.json()
  if (!connectionId) return NextResponse.json({ error: 'missing connectionId' }, { status: 400 })
  await updateConnectionStatus(connectionId, 'revoked')
  return NextResponse.json({ ok: true })
}
