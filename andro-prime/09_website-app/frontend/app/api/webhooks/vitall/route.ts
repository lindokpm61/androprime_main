import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { VitallWebhookPayload, VitallOrderStatusCode } from '@/lib/vitall/types'
import type { Database } from '@/lib/supabase/types'

type KitOrderStatus = Database['public']['Tables']['kit_orders']['Row']['status']

// Maps Vitall status codes to our kit_orders.status enum values
const STATUS_MAP: Partial<Record<VitallOrderStatusCode, KitOrderStatus>> = {
  'order-placed': 'dispatched',
  'kit-sent': 'dispatched',
  'sample-received': 'sample_registered',
  'tests-analysis': 'processing',
  'results-available': 'results_received',
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  const signature = request.headers.get('x-vitall-signature') ?? ''
  const secret = process.env.VITALL_WEBHOOK_SECRET
  if (!secret) {
    console.error('[vitall-webhook] VITALL_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  let signaturesMatch = false
  try {
    signaturesMatch = timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    // Buffer lengths differ — signature is invalid
  }

  if (!signaturesMatch) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: VitallWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { vitall_order_id, partner_order_id, order_status } = payload
  const statusCode = order_status?.code
  const newStatus = STATUS_MAP[statusCode]

  // Update kit_orders with latest Vitall status and store vitall_order_id
  if (newStatus && partner_order_id) {
    const supabase = createSupabaseAdminClient()
    const { error } = await supabase
      .from('kit_orders')
      .update({ status: newStatus, vitall_order_id })
      .eq('id', partner_order_id)

    if (error) {
      console.error('[vitall-webhook] Failed to update kit_orders:', error.message)
    }
  }

  // Only queue result processing when results are ready
  if (statusCode !== 'results-available') {
    return NextResponse.json({ received: true }, { status: 202 })
  }

  const qstashToken = process.env.QSTASH_TOKEN
  if (!qstashToken) {
    console.error('[vitall-webhook] QSTASH_TOKEN is not set')
    return NextResponse.json({ error: 'Queue not configured' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'

  try {
    const client = new Client({ token: qstashToken })
    await client.publishJSON({
      url: `${siteUrl}/api/jobs/process-result`,
      body: payload,
    })
  } catch (err) {
    console.error('[vitall-webhook] Failed to enqueue to QStash:', err)
    return NextResponse.json({ error: 'Failed to enqueue job' }, { status: 500 })
  }

  return NextResponse.json({ received: true }, { status: 202 })
}
