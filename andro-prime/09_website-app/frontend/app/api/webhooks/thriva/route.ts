import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  const signature = request.headers.get('x-thriva-signature') ?? ''
  const secret = process.env.THRIVA_WEBHOOK_SECRET
  if (!secret) {
    console.error('[thriva-webhook] THRIVA_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  let signaturesMatch = false
  try {
    signaturesMatch = timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    // Buffer lengths differ — signature is wrong
  }

  if (!signaturesMatch) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const qstashToken = process.env.QSTASH_TOKEN
  if (!qstashToken) {
    console.error('[thriva-webhook] QSTASH_TOKEN is not set')
    return NextResponse.json({ error: 'Queue not configured' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://androprime.co.uk'

  try {
    const client = new Client({ token: qstashToken })
    await client.publishJSON({
      url: `${siteUrl}/api/jobs/process-result`,
      body: JSON.parse(rawBody),
    })
  } catch (err) {
    console.error('[thriva-webhook] Failed to enqueue to QStash:', err)
    return NextResponse.json({ error: 'Failed to enqueue job' }, { status: 500 })
  }

  return NextResponse.json({ received: true }, { status: 202 })
}
