import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'
import type { VitallWebhookPayload, VitallOrderStatusCode } from '@/lib/vitall/types'
import type { Database } from '@/lib/supabase/types'

type KitOrderStatus = Database['public']['Tables']['kit_orders']['Row']['status']

// Maps Vitall status codes to our kit_orders.status enum values.
// 'tests-analysis' is the live spelling (confirmed by Ben Starling 2026-06-16);
// 'testo-analysis' is the docs' typo, kept defensively.
// Handled out-of-band below (not in this map): 'sample-issue' (whole-order
// failure → sample_failed) and 'data-purged' (GDPR erasure → loud audit log).
// Vitall sequences may skip stages (e.g. 1,2,3,5 or 1,2,5) — each event updates
// the latest status independently, so skipped stages are fine.
const STATUS_MAP: Partial<Record<VitallOrderStatusCode, KitOrderStatus>> = {
  'order-placed': 'dispatched',
  'kit-sent': 'dispatched',
  'sample-received': 'sample_registered',
  'tests-analysis': 'processing',
  'testo-analysis': 'processing',
  'results-available': 'results_received',
  // Occasional lifecycle statuses (Ben Starling 2026-06-16):
  'order-on-hold': 'on_hold',
  'order-cancelled': 'cancelled',
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  // Vitall sends the HMAC in a header literally named `Signature`. Header
  // lookups are case-insensitive, so `signature` matches what Vitall sends.
  const signature = request.headers.get('signature') ?? ''
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
    console.error(
      `[vitall-webhook] signature verification failed (signature header present: ${signature.length > 0}, body bytes: ${rawBody.length})`,
    )
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

  // Failed/insufficient sample (whole order). Set status = sample_failed and emit
  // the CIO event the automated recollection email triggers on. Full-panel redo
  // (Keith 2026-06-03); recollection itself is arranged via care@vitall.co.uk
  // until Vitall expose a recollection API.
  if (statusCode === 'sample-issue') {
    if (partner_order_id) {
      const supabase = createSupabaseAdminClient()
      const { data: order, error } = await supabase
        .from('kit_orders')
        .update({ status: 'sample_failed', vitall_order_id })
        .eq('id', partner_order_id)
        .select('user_id, kit_type')
        .single()
      if (error || !order) {
        console.error('[vitall-webhook] Failed to set sample_failed status:', error?.message)
      } else {
        await emitEvent(order.user_id, {
          name: 'sample_failed',
          data: { kit_type: order.kit_type, order_id: partner_order_id },
        })
      }
    }
    console.error(
      `[vitall-webhook] SAMPLE FAILED for order ${partner_order_id} (vitall ${vitall_order_id}) — full-panel redo; recollection via care@vitall.co.uk`,
    )
    return NextResponse.json({ received: true, sampleIssue: true }, { status: 202 })
  }

  // GDPR erasure executed on Vitall's side (Ben Starling 2026-06-16). Record it
  // loudly for our audit trail and mark the order. We deliberately do NOT cascade
  // an automatic delete of our own controller-held records here — erasure of our
  // retained copy is a separate, deliberate process; a webhook must never trigger
  // an irreversible bulk delete.
  if (statusCode === 'data-purged') {
    if (partner_order_id) {
      const supabase = createSupabaseAdminClient()
      const { error } = await supabase
        .from('kit_orders')
        .update({ status: 'data_purged', vitall_order_id })
        .eq('id', partner_order_id)
      if (error) {
        console.error('[vitall-webhook] Failed to set data_purged status:', error.message)
      }
    }
    console.warn(
      `[vitall-webhook] DATA PURGED by Vitall for order ${partner_order_id} (vitall ${vitall_order_id}) — GDPR erasure on the lab side. Our own retained copy is governed separately and is NOT auto-deleted.`,
    )
    return NextResponse.json({ received: true, dataPurged: true }, { status: 202 })
  }

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
