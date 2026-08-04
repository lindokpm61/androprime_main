// Second-kit dispatch helper for the bundle sweep.
//
// `/api/vitall/dispatch` reads the patient + address from a kit_orders row, so
// the owed second kit needs its own row. This helper creates that row (a fresh
// address snapshot from the user's current address columns, no second Stripe
// charge) and then calls the SAME dispatch endpoint the first kit uses, so the
// second kit is just another ordinary Vitall order placed on our schedule.
//
// Unlike the Stripe webhook's fire-and-forget first dispatch, this AWAITs the
// dispatch response and only marks the bundle 'dispatched' on success — on any
// failure the row stays 'awaiting_window' so the next daily sweep retries.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/types'
import type { BundleDispatchRow } from './sweep'

import { SITE_URL } from '@/lib/site-url'

export interface DispatchResult {
  ok: boolean
  orderId?: string
  reason?: string
}

export async function dispatchSecondKit(
  supabase: SupabaseClient<Database>,
  bundleRow: BundleDispatchRow,
): Promise<DispatchResult> {
  // Reuse an already-created second order if a prior sweep run inserted it but
  // failed at the Vitall hop. This keeps at most ONE second kit_orders row per
  // bundle, so a retry never ships two kits.
  let secondOrderId = bundleRow.second_order_id

  if (!secondOrderId) {
    // Build a FRESH address snapshot from the user's current address columns,
    // matching the shape buildShippingAddressJson writes in the Stripe webhook
    // ({ name, line1, line2, city, state, postal_code, country }, where `state`
    // carries the UK county). Resolving it now means a customer who updated their
    // address during the soft window ships to the new one.
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(
        'first_name, last_name, address_line1, address_line2, address_city, address_county, address_postal_code, address_country',
      )
      .eq('id', bundleRow.user_id)
      .single()

    if (userError || !user) {
      console.error('[bundle-dispatch] Could not load user for bundle', bundleRow.id, userError?.message)
      return { ok: false, reason: 'user_not_found' }
    }

    const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || null
    const shippingAddress = {
      name,
      line1: user.address_line1 ?? null,
      line2: user.address_line2 ?? null,
      city: user.address_city ?? null,
      state: user.address_county ?? null,
      postal_code: user.address_postal_code ?? null,
      country: user.address_country ?? null,
    }

    // stripe_payment_intent stays null — the shared bundle payment lives on the
    // parent order; the linkage is bundle_dispatches, not a second charge.
    const { data: order, error: insertError } = await supabase
      .from('kit_orders')
      .insert({
        user_id: bundleRow.user_id,
        kit_type: bundleRow.kit_type,
        status: 'paid',
        shipping_address: shippingAddress,
      })
      .select('id')
      .single()

    if (insertError || !order) {
      console.error('[bundle-dispatch] Failed to insert second kit_orders for bundle', bundleRow.id, insertError?.message)
      return { ok: false, reason: 'insert_failed' }
    }

    secondOrderId = order.id

    // Record the order id back onto the bundle row immediately (status stays
    // 'awaiting_window'), so a later retry reuses it instead of inserting again.
    // FATAL on failure: if the link is not durably persisted BEFORE the Vitall
    // POST, an ambiguous Vitall outcome (order created, response lost) plus a
    // re-insert on the next run could ship the customer two kits. Bailing here
    // leaves only an orphaned never-dispatched kit_orders row (status 'paid',
    // harmless) and the next sweep reuses or re-links safely.
    const { error: linkError } = await supabase
      .from('bundle_dispatches')
      .update({ second_order_id: secondOrderId })
      .eq('id', bundleRow.id)
    if (linkError) {
      console.error('[bundle-dispatch] Failed to link second_order_id for bundle', bundleRow.id, linkError.message)
      return { ok: false, orderId: secondOrderId, reason: 'link_failed' }
    }
  }

  // Reuse the existing dispatch endpoint verbatim (it resolves the current
  // address at call time and calls Vitall's order/create). AWAIT and check the
  // response — on non-OK, leave the row in 'awaiting_window' so the next daily
  // sweep retries; do NOT mark dispatched.
  let response: Response
  try {
    response = await fetch(`${SITE_URL}/api/vitall/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: secondOrderId, kitType: bundleRow.kit_type }),
    })
  } catch (err) {
    console.error('[bundle-dispatch] Vitall dispatch request failed for bundle', bundleRow.id, err)
    return { ok: false, orderId: secondOrderId, reason: 'dispatch_request_failed' }
  }

  if (!response.ok) {
    console.error('[bundle-dispatch] Vitall dispatch non-OK for bundle', bundleRow.id, response.status)
    return { ok: false, orderId: secondOrderId, reason: `dispatch_status_${response.status}` }
  }

  const { error: updateError } = await supabase
    .from('bundle_dispatches')
    .update({ status: 'dispatched', second_order_id: secondOrderId })
    .eq('id', bundleRow.id)
    .eq('status', 'awaiting_window')

  if (updateError) {
    console.error('[bundle-dispatch] Failed to mark bundle dispatched for', bundleRow.id, updateError.message)
    return { ok: false, orderId: secondOrderId, reason: 'status_update_failed' }
  }

  return { ok: true, orderId: secondOrderId }
}
