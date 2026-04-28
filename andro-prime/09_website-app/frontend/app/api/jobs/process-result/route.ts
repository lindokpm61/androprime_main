import { NextRequest, NextResponse } from 'next/server'
import { verifyQStashRequest } from '@/lib/qstash/verify'
import { normalise } from '@/lib/results/normaliser'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import type { VitallWebhookPayload } from '@/lib/vitall/types'
import type { NormalisedBiomarker, KitType } from '@/lib/results/types'

function buildCioTraits(kitType: string, biomarkers: NormalisedBiomarker[]): Record<string, unknown> {
  const find = (name: string) => biomarkers.find((b) => b.markerName === name)?.value ?? null
  const traits: Record<string, unknown> = { kit_type_latest: kitType }

  if (kitType === 'testosterone' || kitType === 'hormone-recovery') {
    const t = find('Testosterone')
    if (t !== null) {
      traits.testosterone_value = t
      traits.low_testosterone = t < 12
      traits.borderline_testosterone = t >= 12 && t < 15
    }
  }

  if (kitType === 'energy-recovery' || kitType === 'hormone-recovery') {
    const vd = find('Vitamin D')
    const b12 = find('Active B12')
    const crp = find('hs-CRP')
    const ferritin = find('Ferritin')
    if (vd !== null) traits.low_vitamin_d = vd < 50
    if (b12 !== null) traits.low_b12 = b12 < 37.5
    if (crp !== null) {
      traits.elevated_crp = crp > 1.0
      traits.crp_level = crp
    }
    if (ferritin !== null) traits.low_ferritin = ferritin < 30
  }

  return traits
}

export async function POST(request: NextRequest) {
  let rawBody: string
  try {
    rawBody = await verifyQStashRequest(request)
  } catch {
    return NextResponse.json({ error: 'Invalid QStash signature' }, { status: 401 })
  }

  let payload: VitallWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // partner_order_id is our kit_orders.id, sent as partnerOrderId when creating the Vitall order
  const { partner_order_id } = payload
  if (!partner_order_id) {
    return NextResponse.json({ error: 'Missing partner_order_id in payload' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Resolve user_id and kit_type from our order record
  const { data: order, error: orderError } = await supabase
    .from('kit_orders')
    .select('id, user_id, kit_type')
    .eq('id', partner_order_id)
    .single()

  if (orderError || !order) {
    console.error('[process-result] kit_order not found for partner_order_id:', partner_order_id)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { user_id: userId, kit_type: kitType, id: orderId } = order

  // Idempotency: skip if already processed
  const { data: existing } = await supabase
    .from('lab_results')
    .select('id')
    .eq('order_id', orderId)
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json({ received: true, skipped: true })
  }

  const { data: result, error: resultError } = await supabase
    .from('lab_results')
    .insert({
      order_id: orderId,
      user_id: userId,
      kit_type: kitType as KitType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw_payload: payload as unknown as any,
    })
    .select('id')
    .single()

  if (resultError || !result) {
    console.error('[process-result] Failed to insert lab_results:', resultError?.message)
    return NextResponse.json({ error: 'Failed to store result' }, { status: 500 })
  }

  let biomarkers
  try {
    biomarkers = normalise(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Normalisation failed'
    console.error('[process-result] Normalisation error:', message)
    return NextResponse.json({ error: message }, { status: 422 })
  }

  const biomarkerRows = biomarkers.map((b) => ({
    result_id: result.id,
    marker_name: b.markerName,
    value: b.value,
    unit: b.unit,
    reference_low: b.referenceLow,
    reference_high: b.referenceHigh,
  }))

  const { error: biomarkerError } = await supabase.from('biomarker_values').insert(biomarkerRows)

  if (biomarkerError) {
    console.error('[process-result] Failed to insert biomarker_values:', biomarkerError.message)
  }

  await emitEvent(userId, {
    name: 'result_received',
    data: { kit_type: kitType, result_id: result.id, order_id: orderId },
  })

  await identifyUser(userId, buildCioTraits(kitType, biomarkers))

  return NextResponse.json({ received: true })
}
