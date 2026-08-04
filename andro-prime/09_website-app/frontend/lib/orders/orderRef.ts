/**
 * Customer-facing order reference.
 *
 * `kit_orders.id` is a UUID: correct as a primary key, useless as something a
 * customer reads down a phone or quotes in a support email. `kit_orders.order_seq`
 * (migration `20260804_kit_orders_order_seq.sql`) is a short identity sequence;
 * this renders it.
 *
 * The `AP-` prefix lives here rather than in the database so it can change
 * without a data migration. Three identifiers, each for whoever it is for:
 *
 *   order_ref (AP-10042)  the customer
 *   id (UUID)             our systems; sent to Vitall as partnerOrderId
 *   vitall_order_id       Vitall / Ben, internal only, never customer-facing
 *
 * Spec: docs/2026-08-04-customer-facing-order-reference-spec.md
 */

export const ORDER_REF_PREFIX = 'AP-'

/**
 * Returns `AP-10042`, or null when the row has no sequence value. Null is a real
 * case rather than a defensive one: the confirmation page can render before the
 * Stripe webhook has inserted the order, so callers must handle it.
 */
export function formatOrderRef(orderSeq: number | null | undefined): string | null {
  if (orderSeq === null || orderSeq === undefined) return null
  if (!Number.isFinite(orderSeq)) return null
  return `${ORDER_REF_PREFIX}${orderSeq}`
}

/**
 * The inverse, for support lookup. Returns the `order_seq` behind a reference a
 * customer has quoted, or null if the input is not one.
 *
 * Deliberately forgiving about how it arrives, because it arrives however the
 * customer read it out: `AP-10042`, `ap 10042`, `AP10042`, or just `10042`. It is
 * NOT forgiving about the number itself — anything non-numeric after the prefix
 * is null, so a search box can fall through to matching an email or a Vitall id
 * instead of running a nonsense query.
 */
export function parseOrderRef(input: string | null | undefined): number | null {
  if (!input) return null

  const cleaned = input.trim().replace(/[\s–—-]/g, '')
  if (cleaned === '') return null

  const withoutPrefix = /^ap/i.test(cleaned) ? cleaned.slice(2) : cleaned
  if (!/^\d+$/.test(withoutPrefix)) return null

  const parsed = Number(withoutPrefix)
  return Number.isSafeInteger(parsed) ? parsed : null
}
