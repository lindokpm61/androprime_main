import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import { normalise, hasSampleFailure } from './normaliser'
import { emitEvent, identifyUser } from '@/lib/customerio/emit'
import { cioKeyForUserId } from '@/lib/customerio/identity'
import { kitName } from '@/lib/kits/names'
import { isTestosteroneAllClear } from './classifier'
import { isRetestReminderEnabled } from '@/lib/flags'
import { hasHealthProcessingConsent } from './healthProcessingConsent'
import type { VitallWebhookPayload } from '@/lib/vitall/types'
import type { NormalisedBiomarker, KitType } from './types'

type Admin = SupabaseClient<Database>

// Retest reminder cadence (Phase 2). The single date, measured from the result
// date, at which the all-clear retest nudge is scheduled in Customer.io. 6
// months = the START of the agreed 6–12 month all-clear window
// (04_products/results-engine/2026-07-17-retest-cadence-table.md), so the
// reminder lands as the window opens and gives the customer the full window to
// act. One tunable value; the seasonal (Vitamin D) and symptom-overlay
// refinements are deliberately out of scope for this v1. Pending Keith/Ewa
// confirmation of the exact trigger point within the window.
export const RETEST_REMINDER_MONTHS = 6

// Customer.io stores date attributes as Unix seconds. Compute result-date +
// cadence and floor to seconds so CIO recognises `retest_due_at` as a date the
// campaign can wait until.
function retestDueAtUnix(asOf: Date): number {
  const due = new Date(asOf)
  due.setMonth(due.getMonth() + RETEST_REMINDER_MONTHS)
  return Math.floor(due.getTime() / 1000)
}

export interface ProcessResultOutcome {
  status: number
  body: Record<string, unknown>
}

export function buildCioTraits(
  kitType: string,
  biomarkers: NormalisedBiomarker[],
  hasHealthProcessingConsent: boolean,
  asOf: Date = new Date(),
): Record<string, unknown> {
  const find = (name: string) => biomarkers.find((b) => b.markerName === name)?.value ?? null
  const traits: Record<string, unknown> = { kit_type_latest: kitType }

  // Testosterone-derived traits are NOT emitted to Customer.io here. They reveal
  // a health condition (special category) and CIO is a US processor. As of the
  // 2026-06-04 low-T routing decision the `low_testosterone` flag is sent to CIO
  // ONLY after the customer gives explicit nurture consent — see
  // app/api/lowt-nurture/consent/route.ts. The raw testosterone value and the
  // borderline flag are kept server-side and never sent to CIO. (Energy-marker
  // traits below are gated on the CA-018 health-processing consent (2026-07-07);
  // raw crp_level is kept but gated too (NOT dropped: seq-03a's hs-CRP >10 branch
  // compares the numeric value, so removing it would break that email logic).
  // See DPIA §4.)

  const isEnergyKit = kitType === 'energy-recovery' || kitType === 'hormone-recovery'
  const isTestosteroneKit = kitType === 'testosterone' || kitType === 'hormone-recovery'

  // `results_all_clear` — a single POSITIVE, present boolean that drives seq-03c
  // (Normal). The old segment 22 keyed on the absence of six negative flags,
  // which never matched: a normal profile carries no positive signal in CIO
  // (and a Kit-1 normal-T profile carried no testosterone signal at all, as the
  // T flags are withheld). This mirrors seq-03a, which fires reliably because it
  // keys on flags that ARE sent and transition to true. We collect, per kit, the
  // clear/not-clear verdict for each marker we actually have, and emit
  // all_clear = every present marker is in its clear band. Markers absent from
  // the panel are simply not part of the AND, so an incomplete panel never
  // produces a false "all clear". See docs/seq-03-results-signal-fix-spec-2026-06-26.md.
  const clearVerdicts: boolean[] = []

  if (isEnergyKit) {
    const vd = find('Vitamin D')
    const b12 = find('Active B12')
    const crp = find('hs-CRP')
    const ferritin = find('Ferritin')
    // The five energy-marker traits are only assigned when the user has CA-018
    // health-processing consent (fail-closed — see hasHealthProcessingConsent).
    // The clearVerdicts pushes stay UNGATED so `results_all_clear` (a separate,
    // low-sensitivity signal) is unaffected by the consent gate.
    if (vd !== null) {
      if (hasHealthProcessingConsent) traits.low_vitamin_d = vd < 50
      clearVerdicts.push(vd >= 50)
    }
    // low_b12 mirrors the engine's clinically-low band only. The 2026-06-16
    // threshold sign-off moved B12 to the NICE NG239 three-band scheme; the
    // 25–70 indeterminate band is deliberately NOT flagged here, to avoid an
    // automated email asserting deficiency on an indeterminate result.
    if (b12 !== null) {
      if (hasHealthProcessingConsent) traits.low_b12 = b12 < 25
      clearVerdicts.push(b12 >= 25)
    }
    if (crp !== null) {
      if (hasHealthProcessingConsent) {
        traits.elevated_crp = crp > 1.0
        traits.crp_level = crp
      }
      clearVerdicts.push(crp <= 1.0)
    }
    if (ferritin !== null) {
      if (hasHealthProcessingConsent) traits.low_ferritin = ferritin < 30
      clearVerdicts.push(ferritin >= 30)
    }
  }

  if (isTestosteroneKit) {
    // The raw testosterone value and the low/borderline flags are NOT sent (see
    // the note above + the low-T routing decision). `results_all_clear` reveals
    // only the *absence* of any flag — a low-sensitivity reassurance signal,
    // Ewa-confirmed (§3 of the fix spec) — so the normal-T cohort can be routed
    // to seq-03c. Borderline (12–<15) is excluded here: it is NOT all-clear, and
    // its nurture is consent-gated separately (seq-03d), exactly like low-T.
    const t = find('Testosterone')
    if (t !== null) clearVerdicts.push(isTestosteroneAllClear(t))
  }

  if (clearVerdicts.length > 0) {
    const allClear = clearVerdicts.every(Boolean)
    traits.results_all_clear = allClear
    // Phase 2 retest reminder (dark — behind RETEST_REMINDER_ENABLED, default
    // OFF). On a whole-result all-clear, stamp the date a retest is due so a
    // single Customer.io campaign can nudge ALL kit buyers when it arrives (the
    // seq-04 e5 Day-90 prompt only reaches supplement subscribers). Its mere
    // presence implies all_clear = true, which is already emitted above, so it
    // reveals nothing new and needs no extra consent gate. Flag OFF → never set
    // → byte-identical output and no campaign can fire.
    if (allClear && isRetestReminderEnabled()) {
      traits.retest_due_at = retestDueAtUnix(asOf)
    }
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
  // Key the CIO event on the EMAIL (canonical identifier), resolved from the
  // user id, so it lands on the same profile. See lib/customerio/identity.
  const cioKey = await cioKeyForUserId(supabase, userId)
  if (cioKey) {
    await emitEvent(cioKey, {
      name: 'sample_failed',
      data: { kit_type: kitType, order_id: orderId },
    })
  }
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

  // A results-available event can legitimately arrive with no results attached —
  // the lab may fire the notification before (or without) the payload, or send a
  // placeholder/malformed event (confirmed against Ben Starling's 2026-06-23
  // resend of order 322941383, sent deliberately with no results). This is NOT a
  // sample failure: routing it to markSampleFailed would fire the CIO recollection
  // email telling the customer their sample failed (wrong), and persisting an empty
  // lab_results row would block the real results later via the idempotency check.
  // Treat it as a benign no-op — log loudly and wait for a populated event.
  const panels = Array.isArray(payload.results) ? payload.results : []
  const hasAnyResultRows = panels.some(
    (p) => Array.isArray(p?.results) && p.results.length > 0,
  )
  if (!hasAnyResultRows) {
    console.warn(
      `[process-result] results-available for order ${orderId} carried no results — ignoring (not a sample failure). Awaiting a populated event.`,
    )
    return { status: 200, body: { received: true, emptyResults: true } }
  }

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
    // still a sample issue from our side. Unit mismatches no longer throw (they are
    // logged + stored as-sent, see normaliser); any remaining throw is a genuine
    // structural/data error and surfaces as 422.
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

  // Key the result-ready event + trait sync on the EMAIL (canonical identifier),
  // resolved from the user id, so T-03 and the seq-03 routing flags land on the
  // same profile as the order/dispatch emails. See lib/customerio/identity.
  const cioKey = await cioKeyForUserId(supabase, userId)
  if (cioKey) {
    await emitEvent(cioKey, {
      name: 'result_received',
      data: { kit_type: kitType, kit_name: kitName(kitType), result_id: result.id, order_id: orderId },
    })
    // Gate the energy-marker traits on the CA-018 health-processing consent
    // (fail-closed). The lookup never throws out of here, so a guest/no-consent
    // user still gets their non-health traits + results_all_clear synced and the
    // result_received event above still fires (service delivery, not gated).
    const hasHealthConsent = await hasHealthProcessingConsent(supabase, userId)
    await identifyUser(cioKey, buildCioTraits(kitType, biomarkers, hasHealthConsent))
  }

  return { status: 200, body: { received: true } }
}
