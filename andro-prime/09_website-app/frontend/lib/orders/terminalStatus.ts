/**
 * Order statuses that later events must not write over.
 *
 * `order_status` is mostly a pipeline — pending → paid → dispatched →
 * sample_registered → processing → results_received — and the lab webhook
 * advances it by mapping Vitall's status code straight onto the row. That is
 * correct for the pipeline and wrong for everything that leaves it, because
 * three of the values are not stages, they are endings written by a different
 * authority:
 *
 *   `refunded`     the merchant gave the money back        (Stripe)
 *   `cancelled`    the lab abandoned the order             (Vitall)
 *   `data_purged`  the record was erased under GDPR        (Vitall, Art 17)
 *
 * Nothing downstream re-checks them, so a late lab callback silently restores
 * the row to a pipeline stage and the ending disappears. The concrete case: an
 * order refunded while its sample is already with the lab. The kit cannot be
 * un-posted, so the sample is processed and Vitall reports `results-available`
 * hours or days later — which, unguarded, sets `results_received` and erases the
 * only record in our system that the customer was refunded at all. The same
 * shape erases a GDPR erasure, which is worse: that one carries a legal
 * obligation and no other row proves it happened.
 *
 * ── WHY THIS IS A FILTER AND NOT A READ-THEN-WRITE ────────────────────────
 * Applied as a `.not('status', 'in', ...)` on the UPDATE itself, so the check
 * and the write are one statement. A read-then-write would leave a window in
 * which a refund landing between the two is overwritten anyway — narrow, but
 * this path already runs concurrently (lab callback and Stripe webhook are
 * independent senders) and the window is exactly when both fire.
 *
 * Added 2026-09-15 with the refund handler (S2-9). Before it, the ending simply
 * lost to whichever event arrived last.
 */

/** Endings. Written by refund/cancellation/erasure, never by the lab pipeline. */
export const TERMINAL_ORDER_STATUSES = ['refunded', 'cancelled', 'data_purged'] as const

export type TerminalOrderStatus = (typeof TERMINAL_ORDER_STATUSES)[number]

const TERMINAL = new Set<string>(TERMINAL_ORDER_STATUSES)

/** True when this status is an ending that a pipeline update must not overwrite. */
export function isTerminalOrderStatus(status: string): boolean {
  return TERMINAL.has(status)
}

/**
 * The terminal set as a PostgREST `in` list, for use with `.not('status', 'in', …)`.
 *
 * Built from the array above rather than written out, so the guard cannot drift
 * from the list it is supposed to enforce — the failure mode of a hand-written
 * copy is that it keeps working while protecting one fewer status than it says.
 */
export const TERMINAL_ORDER_STATUSES_SQL_LIST = `(${TERMINAL_ORDER_STATUSES.map(
  (s) => `"${s}"`,
).join(',')})`
