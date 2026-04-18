import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { normalise } from '@/lib/results/normaliser'
import type { ThrivaWebhookPayload } from '@/lib/results/types'

export async function POST(request: NextRequest) {
  // TODO: Replace this stub with HMAC verification against Thriva's shared secret
  // before handing the webhook URL to Thriva. An unsigned endpoint lets anyone
  // forge lab results for any userId in the payload.
  const signature = request.headers.get('x-thriva-signature')
  console.log('[thriva-webhook] x-thriva-signature:', signature ?? '(none)')

  let payload: ThrivaWebhookPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { orderId, userId, kitType } = payload
  if (!orderId || !userId || !kitType) {
    return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  // Insert lab_results row
  const { data: result, error: resultError } = await supabase
    .from('lab_results')
    .insert({
      order_id: orderId,
      user_id: userId,
      kit_type: kitType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      raw_payload: payload as unknown as any,
    })
    .select('id')
    .single()

  if (resultError || !result) {
    console.error('[thriva-webhook] Failed to insert lab_results:', resultError?.message)
    return NextResponse.json({ error: 'Failed to store result' }, { status: 500 })
  }

  // Normalise and insert biomarker_values
  let biomarkers
  try {
    biomarkers = normalise(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Normalisation failed'
    console.error('[thriva-webhook] Normalisation error:', message)
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

  const { error: biomarkerError } = await supabase
    .from('biomarker_values')
    .insert(biomarkerRows)

  if (biomarkerError) {
    console.error('[thriva-webhook] Failed to insert biomarker_values:', biomarkerError.message)
    return NextResponse.json({ error: 'Failed to store biomarkers' }, { status: 500 })
  }

  return NextResponse.json({ received: true }, { status: 202 })
}
