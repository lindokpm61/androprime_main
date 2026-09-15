/**
 * What a Stripe refund means for one of our orders.
 *
 * The rule lives here rather than inside the webhook for the same reason
 * `alreadyDispatched.ts` exists: the handler talks to Stripe, Supabase and
 * Customer.io, so anything decided inside it is untestable, and this decision
 * governs a customer's money and a second physical kit. Pure in, verdict out,
 * and `scripts/test-refund-classification.ts` drives it over the cases.
 *
 * ── WHY `charge.refunded` AND NOT `payment_intent.canceled` ───────────────
 * Refunding a succeeded payment leaves its PaymentIntent at `succeeded`.
 * Verified on the live Gate 3 order (S2-9): £99 fully refunded, intent still
 * `succeeded`, charge `refunded: true`. Stripe models a refund against the
 * CHARGE, so `payment_intent.canceled` catches nothing at all while looking
 * exactly like the fix — it fires only for an intent abandoned before capture.
 *
 * ── WHY FULL AND PARTIAL CANNOT SHARE A BRANCH ────────────────────────────
 * `charge.refunded` fires on BOTH, with no field that says which. The only
 * signal is the arithmetic. This is not a hypothetical split: the T&Cs sell a
 * bundle whose retest portion is separately refundable ("you can ask us to
 * refund the retest portion instead of banking it, at any time before it is
 * dispatched"), so a partial refund against a bundle charge is a supported
 * product behaviour. Treating it as a full refund would mark a £179 order
 * `refunded` over a £20 goodwill adjustment, hide it from the dashboard, and
 * cancel the very retest the customer is still owed.
 */

/** The fields of a Stripe Charge this decision reads. */
export interface RefundableCharge {
  /** Total captured, in minor units (pence). */
  amount: number
  /** Cumulative refunded across all refunds on this charge, in pence. */
  amount_refunded: number
}

/**
 * Has the whole charge been given back?
 *
 * `>=` rather than `===` is defensive — Stripe will not refund past the
 * captured amount, but the consequence of reading an over-refund as "partial"
 * is an order left at `dispatched` with no money behind it, which is the
 * failure this whole path exists to prevent.
 *
 * The `amount_refunded > 0` term is what stops a zero-amount charge (a 100%
 * coupon, a trial) reading as fully refunded on `0 >= 0` when nothing was ever
 * paid and nothing was ever given back.
 */
export function isFullRefund(charge: RefundableCharge): boolean {
  if (charge.amount_refunded <= 0) return false
  return charge.amount_refunded >= charge.amount
}

/** A refund that took back some but not all of the money. */
export function isPartialRefund(charge: RefundableCharge): boolean {
  if (charge.amount_refunded <= 0) return false
  return charge.amount_refunded < charge.amount
}

/**
 * `bundle_dispatches` rows a full refund must stop.
 *
 * The second kit of a bundle is owed by a row in that table, not by a second
 * charge — so refunding the bundle takes the money back while the daily sweep
 * (app/api/jobs/bundle-sweep) carries on toward posting kit two at our cost.
 * These three statuses are the ones still upstream of that dispatch.
 *
 * Deliberately excluded: `dispatched` (the box has gone — cancelling the row
 * would only falsify the record), and `not_needed` / `cancelled` (already off
 * the path; re-writing them would churn `updated_at` for nothing).
 */
export const CANCELLABLE_DISPATCH_STATUSES = [
  'scheduled',
  'trigger_met',
  'awaiting_window',
] as const

/** `bundle_dispatches` statuses a refund deliberately leaves alone. */
export const UNCANCELLABLE_DISPATCH_STATUSES = [
  'dispatched',
  'not_needed',
  'cancelled',
] as const

const CANCELLABLE = new Set<string>(CANCELLABLE_DISPATCH_STATUSES)

/** True when a refund should cancel this owed-kit row. */
export function shouldCancelDispatch(status: string): boolean {
  return CANCELLABLE.has(status)
}
