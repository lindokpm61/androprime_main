import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { normalise, hasSampleFailure } from './normaliser'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import type { VitallWebhookPayload } from '@/lib/vitall/types'
import type { NormalisedBiomarker, KitType } from './types'

type Admin = SupabaseClient<Database>

export interface ProcessResultOutcome {
  status: number
  body: Record<string, unknown>
}

export function buildCioTraits(
  kitType: string,
  biomarkers: NormalisedBiomarker[],
): Record<string, unknown> {
  const find = (name: string) => biomarkers.find((b) => b.markerName === name)?.value ?? null
  const traits: Record<string, unknown> = { kit_type_latest: kitType }

  // Testosterone-derived traits are NOT emitted to Customer.io here. They reveal
  // a health condition (special category) and CIO is a US processor. As of the
  // 2026-06-04 low-T routing decision the `low_testosterone` flag is sent to CIO
  // ONLY after the customer gives explicit nurture consent — see
  // app/api/lowt-nurture/consent/route.ts. The raw testosterone value and the
  // borderline flag are kept server-side and never sent to CIO. (Energy-marker
  // traits below remain unconditional pending a separate data-minimisation
  // decision tied to the supplement-waitlist consent — flagged in the DPIA §4.)

  if (kitType === 'energy-recovery' || kitType === 'hormone-recovery') {
    const vd = find('Vitamin D')
    const b12 = find('Active B12')
    const crp = find('hs-CRP')
    const ferritin = find('Ferritin')
    if (vd !== null) traits.low_vitamin_d = vd < 50
    // low_b12 mirrors the engine's clinically-low band only. The 2026-06-16
    // threshold sign-off moved B12 to the NICE NG239 three-band scheme; the
    // 25–70 indeterminate band is deliberately NOT flagged here, to avoid an
    // automated email asserting deficiency on an indeterminate result.
    if (b12 !== null) traits.low_b12 = b12 < 25
    if (crp !== null) {
      traits.elevated_crp = crp > 1.0
      traits.crp_level = crp
    }
    if (ferritin !== null) traits.low_ferritin = ferritin < 30
  }

  return traits
}

// Marks a kit order as a failed sample (full-panel redo) and emits the CIO event
// the automated recollection email triggers on. Used by both the no-usable-marker
// and partial-failure paths.
async function markSampleFailed(
  supabase: Admin,
  orderId: string,
  userId: string,
  kitType: string,
): Promise<ProcessResultOutcome> {
  const { error } = await supabase
    .from('kit_orders')
    .update({ status: 'sample_failed' })
    .eq('id', orderId)
  if (error) {
    console.error('[process-result] Failed to set sample_failed status:', error.message)
  }
  await emitEvent(userId, {
    name: 'sample_failed',
    data: { kit_type: kitType, order_id: orderId },
  })
  console.warn(
    `[process-result] SAMPLE FAILED for order ${orderId} — full-panel redo; recollection via Vitall dashboard / care@vitall.co.uk`,
  )
  return { status: 200, body: { received: true, sampleIssue: true } }
}

/**
 * Core results-available handler, decoupled from HTTP/QStash transport so it can
 * be driven directly by the local E2E harness (scripts/e2e-vitall-local.ts) as
 * well as by the QStash-verified job route. The raw payload is persisted to
 * lab_results before normalisation (data-ownership safeguard — we keep the full
 * lab record even if it can't be parsed). Returns an HTTP status + body the
 * caller maps to a response.
 */
export async function processVitallResult(
  payload: VitallWebhookPayload,
  supabase: Admin,
): Promise<ProcessResultOutcome> {
  // partner_order_id is our kit_orders.id, sent as partnerOrderId at order creation
  const { partner_order_id } = payload
  if (!partner_order_id) {
    return { status: 400, body: { error: 'Missing partner_order_id in payload' } }
  }

  // Resolve user_id and kit_type from our order record
  const { data: order, error: orderError } = await supabase
    .from('kit_orders')
    .select('id, user_id, kit_type')
    .eq('id', partner_order_id)
    .single()

  if (orderError || !order) {
    console.error('[process-result] kit_order not found for partner_order_id:', partner_order_id)
    return { status: 404, body: { error: 'Order not found' } }
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
    return { status: 200, body: { received: true, skipped: true } }
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
    return { status: 500, body: { error: 'Failed to store result' } }
  }

  // Failed/insufficient sample. Policy (Keith 2026-06-03): any failed marker fails
  // the whole order — full-panel redo, no partial release. Raw payload is already
  // persisted above (data-ownership). Route to sample_failed + fire the CIO event
  // the recollection email triggers on, rather than storing partial biomarkers.
  if (hasSampleFailure(payload)) {
    return markSampleFailed(supabase, orderId, userId, kitType)
  }

  let biomarkers: NormalisedBiomarker[]
  try {
    biomarkers = normalise(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Normalisation failed'
    // results-available but nothing usable and nothing explicitly flagged failed —
    // still a sample issue from our side. Genuine data errors (e.g. unit mismatch)
    // still surface as 422.
    if (/No recognised biomarkers|No results/i.test(message)) {
      return markSampleFailed(supabase, orderId, userId, kitType)
    }
    console.error('[process-result] Normalisation error:', message)
    return { status: 422, body: { error: message } }
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

  return { status: 200, body: { received: true } }
}
