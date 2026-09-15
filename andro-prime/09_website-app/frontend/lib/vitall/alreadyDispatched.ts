/**
 * Has a kit already been sent for this order?
 *
 * The rule lives here rather than inside the dispatch code itself
 * (`lib/vitall/dispatchKit.ts`) for the same reason `buildVitallPatient` does:
 * that function talks to Supabase and to Vitall, so anything decided inside it is
 * untestable, and this decision guards a physical dispatch and a lab fee. Pure in,
 * boolean out, and `scripts/test-vitall-already-dispatched.ts` drives it over the
 * whole enum.
 *
 * ── WHY `status === 'dispatched'` IS THE WRONG TEST ───────────────────────
 * `order_status` runs pending → paid → dispatched → sample_registered →
 * processing → results_received, plus cancelled / refunded / sample_failed /
 * on_hold / data_purged. An order sitting at `results_received` was dispatched
 * long ago and has been through the lab; matching only the literal `dispatched`
 * would wave it through and post a second box.
 *
 * ── WHY `vitall_order_id` IS NOT SUFFICIENT EITHER ────────────────────────
 * It is the STRONGER signal, because it exists only as the result of a real
 * Vitall order. But it is not complete: at the time of writing, 6 of the 7
 * `results_received` rows in production carry no `vitall_order_id`, having been
 * seeded rather than dispatched through the route. Either signal alone misses
 * cases the other catches, so both are checked and either is enough.
 *
 * ── WHAT IS DELIBERATELY NOT HERE ─────────────────────────────────────────
 * `pending`, `cancelled`, `refunded` and `on_hold` are not "already done", they
 * are "should not dispatch at all" — a different refusal, needing a different
 * answer to the caller. The dispatch route still sends kits for those today.
 * Recorded in qa/direction-f-migration-audit.md rather than fixed here, because
 * widening a guard on the payment-to-dispatch path is a separate decision from
 * making it idempotent.
 */

/** Statuses that mean a kit has already left for this order. */
export const ALREADY_DISPATCHED_STATUSES = [
  'dispatched',
  'sample_registered',
  'processing',
  'results_received',
  'sample_failed',
  'data_purged',
] as const

/** Statuses at which a dispatch has NOT yet happened for this order. */
export const NOT_YET_DISPATCHED_STATUSES = [
  'pending',
  'paid',
  'cancelled',
  'refunded',
  'on_hold',
] as const

const DISPATCHED = new Set<string>(ALREADY_DISPATCHED_STATUSES)

export interface DispatchState {
  status: string
  vitall_order_id: string | null
}

/**
 * True when a repeat dispatch would duplicate a kit that has already gone out.
 *
 * Either signal is enough: a Vitall order id proves one was created, and a
 * post-dispatch status proves the order moved past that point even if the id was
 * never recorded.
 */
export function isAlreadyDispatched(order: DispatchState): boolean {
  if (order.vitall_order_id) return true
  return DISPATCHED.has(order.status)
}
