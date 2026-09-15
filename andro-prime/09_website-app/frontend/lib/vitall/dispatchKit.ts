import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { emitEvent } from '@/lib/customerio/emit'
import { cioKeyFromEmail } from '@/lib/customerio/identity'
import { createOrder } from '@/lib/vitall/client'
import { buildVitallPatient } from '@/lib/vitall/identity'
import { isAlreadyDispatched } from '@/lib/vitall/alreadyDispatched'
import type { VitallPatientAddress } from '@/lib/vitall/types'
import type { KitType } from '@/lib/results/types'

/**
 * Dispatch a kit to Vitall for a paid order.
 *
 * ── WHY THIS IS A FUNCTION AND NOT A ROUTE (changed 2026-09-15) ───────────
 * This was `POST /api/vitall/dispatch` until Gate 3 was proved on a live
 * purchase. It existed as an HTTP endpoint only because two server modules
 * called their own app over the public internet rather than calling a function,
 * and the cost of that convenience was a door anyone could knock on:
 * unauthenticated, service-role-backed, reading a customer's identity and
 * address and creating a real Vitall order — a physical box and a lab fee. No
 * signature, no secret, no session. The sibling `/api/jobs/*` routes all verify
 * a QStash signature; this one verified nothing.
 *
 * Removing the route is a better fix than locking it, because a lock can be
 * missing. A shared secret absent from the deployment environment turns "anyone
 * can dispatch a kit" into "nobody's paid order dispatches, silently", which is
 * worse. A function that does not exist on the network cannot be called from the
 * network and cannot be misconfigured into refusing its own callers.
 *
 * It is also strictly MORE reliable than the HTTP hop it replaces: no DNS, no
 * TLS, no proxy, no cold start, no request timeout between the webhook and the
 * dispatch it triggers.
 *
 * ── THE RETURN SHAPE IS THE OLD HTTP CONTRACT, DELIBERATELY ───────────────
 * `lib/bundles/dispatch.ts` decides whether to retry tomorrow by reading the
 * response status, and reports failures as `dispatch_status_${status}`. Those
 * numbers are therefore part of the contract, not an implementation detail of a
 * transport that no longer exists, so every one of them is preserved exactly:
 * 400 bad input, 404 order/user missing, 422 incomplete patient or address, 502
 * Vitall refused, 500 our write failed, 200 dispatched or already dispatched.
 * Collapsing them to a boolean would silently change which failures retry.
 */

// Maps our kit types to Vitall test shortCodes configured on our account.
// Provided by Ben Starling (Vitall) 2026-05-08.
const KIT_TEST_CODES: Record<KitType, string[]> = {
  testosterone: ['andro-prime-hormone-check'],
  'energy-recovery': ['andro-prime-energy-metabolism'],
  'hormone-recovery': ['andro-prime-combo-test'],
}

/**
 * `users.sex` is `text` with a CHECK constraint (`sex IS NULL OR sex IN ('male','female')`),
 * not a Postgres enum, so the generated Supabase types cannot express it and emit `string`.
 * Vitall's `/order/create` accepts only these two values.
 *
 * The narrowing used to be carried by hand-editing `lib/supabase/types.ts` to say
 * `'male' | 'female' | null`, and it was silently lost the moment that generated file was
 * regenerated on 2026-08-14. So it lives here instead, at the boundary that actually cares,
 * where a regeneration cannot erase it and where a bad value is caught at run time rather than
 * only being assumed away at compile time.
 */
const PATIENT_SEX = ['male', 'female'] as const
type PatientSex = (typeof PATIENT_SEX)[number]
const isPatientSex = (v: unknown): v is PatientSex =>
  typeof v === 'string' && (PATIENT_SEX as readonly string[]).includes(v)

export interface DispatchKitInput {
  orderId: string
  kitType: KitType
}

export interface DispatchOutcome {
  /** True for the cases the route used to answer 2xx. */
  ok: boolean
  /** The exact status the route used to return. See the header. */
  status: number
  /** The exact body the route used to return, for logs and callers. */
  body: Record<string, unknown>
}

const fail = (status: number, error: string): DispatchOutcome => ({
  ok: false,
  status,
  body: { error },
})

export async function dispatchKit({ orderId, kitType }: DispatchKitInput): Promise<DispatchOutcome> {
  if (!orderId || !kitType) {
    return fail(400, 'Missing orderId or kitType')
  }

  const testCodes = KIT_TEST_CODES[kitType]
  if (!testCodes) {
    return fail(400, `Unknown kitType: ${kitType}`)
  }

  if (!process.env.VITALL_CLIENT_ID || !process.env.VITALL_CLIENT_SECRET) {
    console.warn('[vitall-dispatch] Vitall credentials not configured — skipping dispatch')
    return { ok: true, status: 200, body: { skipped: true, reason: 'vitall_not_configured' } }
  }

  const supabase = createSupabaseAdminClient()

  // Pull the full patient record from kit_orders → users
  const { data: order, error: orderError } = await supabase
    .from('kit_orders')
    .select('id, user_id, shipping_address, status, vitall_order_id')
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    console.error('[vitall-dispatch] Could not load kit_orders row:', orderError?.message)
    return fail(404, 'Order not found')
  }

  /*
   * 🔴 IDEMPOTENCY. Nothing used to stop a repeat call: the code read the order,
   * called Vitall, then set `status: 'dispatched'` unconditionally. A second
   * invocation with the same orderId created a second Vitall order — a second
   * physical box, a second lab fee — and emitted a second `kit_dispatched` event.
   * Added 2026-09-15, while the surface was still a public HTTP endpoint.
   *
   * ⚠ THIS IS A 200, NOT A 409, AND THAT IS LOAD-BEARING. `lib/bundles/dispatch.ts`
   * marks a bundle `dispatched` only on a 2xx and otherwise leaves the row in
   * `awaiting_window` for the next daily sweep to retry. The case this guard exists
   * for is precisely the ambiguous one — Vitall succeeded, our write or our caller
   * did not — and answering that retry with a non-2xx would strand the bundle in
   * `awaiting_window` forever, retrying daily and being refused every time. The kit
   * shipped, so the honest answer to "dispatch this" is "done", with
   * `alreadyDispatched` saying it was not done just now.
   */
  if (isAlreadyDispatched(order)) {
    console.warn(
      `[vitall-dispatch] Refusing repeat dispatch for order ${orderId} ` +
        `(status=${order.status}, vitall_order_id=${order.vitall_order_id ?? 'null'})`,
    )
    return {
      ok: true,
      status: 200,
      body: {
        dispatched: true,
        alreadyDispatched: true,
        vitall_order_id: order.vitall_order_id,
      },
    }
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select(
      // No `phone`: it is deliberately not sent to Vitall (see the patient block
      // below). `email` is still read, but only to key the Customer.io event on
      // OUR canonical identifier — it is never forwarded to Vitall.
      'id, email, first_name, last_name, date_of_birth, sex, address_line1, address_line2, address_city, address_county, address_postal_code, address_country',
    )
    .eq('id', order.user_id)
    .single()

  if (userError || !user) {
    console.error('[vitall-dispatch] Could not load user:', userError?.message)
    return fail(404, 'User not found')
  }

  // Per-order shipping snapshot wins for the lab dispatch (in case the user
  // updated their profile address between order and dispatch). Fall back to
  // the user record if the order has no snapshot.
  const orderShipping = (order.shipping_address ?? null) as
    | {
        line1?: string | null
        line2?: string | null
        city?: string | null
        state?: string | null
        postal_code?: string | null
        country?: string | null
      }
    | null

  const line2 = orderShipping?.line2 ?? user.address_line2 ?? undefined
  const city = orderShipping?.city ?? user.address_city ?? ''
  // Vitall's /order/create requires a non-empty county (an empty string returns
  // 400 "Patient details are incomplete"). Source it from Stripe's `state` field
  // (captured into shipping_address.state / users.address_county), and fall back
  // to the city so the field is never empty.
  const county = orderShipping?.state ?? user.address_county ?? city
  const address: VitallPatientAddress = {
    line1: orderShipping?.line1 ?? user.address_line1 ?? '',
    ...(line2 ? { line2 } : {}),
    city,
    county: county || city,
    postCode: orderShipping?.postal_code ?? user.address_postal_code ?? '',
  }

  if (!user.first_name || !user.last_name || !user.date_of_birth || !isPatientSex(user.sex)) {
    console.error('[vitall-dispatch] Patient profile incomplete for order', orderId)
    return fail(422, 'Patient profile incomplete (missing name, DOB, or sex)')
  }

  if (!address.line1 || !address.city || !address.postCode) {
    console.error('[vitall-dispatch] Shipping address incomplete for order', orderId)
    return fail(422, 'Shipping address incomplete')
  }

  let vitallOrderId: string
  try {
    const vitallResponse = await createOrder({
      partnerOrderId: orderId,
      collection: 'self-collection',
      tests: testCodes,
      // Built by lib/vitall/identity.ts, which is the single place the
      // "synthetic address, never the customer's real mailbox, and no phone"
      // rule lives. Its signature takes no email and no phone, so neither can be
      // passed here by accident. Tested by scripts/test-vitall-patient-payload.ts.
      patient: buildVitallPatient(
        {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          sex: user.sex,
          date_of_birth: user.date_of_birth,
        },
        address,
      ),
    })
    vitallOrderId = vitallResponse.order.orderId
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Vitall API error'
    console.error('[vitall-dispatch] createOrder failed:', message)
    return fail(502, message)
  }

  const { error: updateError } = await supabase
    .from('kit_orders')
    .update({ status: 'dispatched', vitall_order_id: vitallOrderId })
    .eq('id', orderId)

  if (updateError) {
    console.error('[vitall-dispatch] Failed to update kit_orders:', updateError.message)
    return fail(500, 'Failed to update order status')
  }

  // Key the CIO event on the EMAIL (canonical identifier) so T-02 lands on the
  // same profile as the order-confirmation + any signup. See lib/customerio/identity.
  if (user.email) {
    await emitEvent(cioKeyFromEmail(user.email), {
      name: 'kit_dispatched',
      data: { kit_type: kitType, order_id: orderId, vitall_order_id: vitallOrderId },
    })
  }

  return { ok: true, status: 200, body: { dispatched: true, vitall_order_id: vitallOrderId } }
}
