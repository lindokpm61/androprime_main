/**
 * The recurring-product catalogue. SINGLE SOURCE OF TRUTH for slug → display
 * name, display price, and which Stripe price the checkout should use.
 *
 * It was three sources until 2026-08-26: this map, a private `SUB_PRICE_IDS` in
 * app/api/checkout/subscription/route.ts, and three `*_MO` constants in
 * lib/pricing.ts. All three named the same products and all three had drifted
 * out of the live range. A duplicated fact is invisible exactly while the
 * copies agree, and the first correction is what makes it visible, so fixing
 * one of three would have converted a quiet inaccuracy into a loud
 * contradiction. They are collapsed here instead; the `*_MO` constants were
 * dead (no consumers) and are deleted.
 *
 * RETIRED IS NOT DELETED. `productName()` feeds the account UI and four
 * Customer.io email payloads in the Stripe webhook, so a slug that someone
 * still holds a subscription to must keep rendering a name. Retired entries
 * stay and are simply not purchasable: `purchasable: false` keeps them out of
 * checkout without breaking the display path for an existing subscriber.
 */

export interface ProductInfo {
  name: string
  /** Display price, customer-facing. */
  price: string
  /**
   * Env var holding the Stripe price id. Absent for retired products, which is
   * what makes them structurally impossible to check out: there is no price to
   * resolve, not merely a flag saying not to.
   */
  stripePriceEnv?: string
  /** False for products no longer sold. They still render for existing holders. */
  purchasable: boolean
}

export const PRODUCT_MAP: Record<string, ProductInfo> = {
  /**
   * Membership v1. No physical goods (Keith, 2026-08-26): the retest
   * entitlement, the dashboard and trend, the check-in loop, member pricing.
   * £47/month, adopted for VAT-threshold stability rather than for revenue.
   * Gated end to end by MEMBERSHIP_ENABLED (lib/flags.ts).
   */
  membership: {
    name: 'Andro Prime Membership',
    price: '£47/mo',
    stripePriceEnv: 'STRIPE_PRICE_MEMBERSHIP',
    purchasable: true,
  },

  // --- Retired. Kept so an existing subscriber's row still renders a name. ---
  'daily-stack': {
    name: 'Daily Stack',
    price: '£34.95/mo',
    purchasable: false,
  },
  collagen: {
    name: 'Joint & Recovery Collagen',
    price: '£29.95/mo',
    purchasable: false,
  },
  'complete-mens-stack': {
    name: "Complete Men's Stack",
    price: '£54.95/mo',
    purchasable: false,
  },
}

/** Display name for a product slug. Falls back to the raw slug if unmapped. */
export function productName(slug: string | null | undefined): string {
  if (!slug) return ''
  return PRODUCT_MAP[slug]?.name ?? slug
}

/** Every slug a customer is allowed to start a new subscription to. */
export function purchasableSlugs(): string[] {
  return Object.entries(PRODUCT_MAP)
    .filter(([, info]) => info.purchasable)
    .map(([slug]) => slug)
}

/**
 * The Stripe price id for a slug, or null when the slug is unknown, retired, or
 * its env var is unset. One function, so the checkout route cannot disagree
 * with the catalogue about what is on sale.
 */
export function stripePriceIdFor(slug: string | null | undefined): string | null {
  if (!slug) return null
  const info = PRODUCT_MAP[slug]
  if (!info || !info.purchasable || !info.stripePriceEnv) return null
  return process.env[info.stripePriceEnv] ?? null
}
