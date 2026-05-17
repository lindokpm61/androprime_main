// Canonical supplement product map. Single source of truth for slug → display
// name / price. Consumed by getSubscriptions (account UI) and the Stripe
// webhook (transactional email payloads T-06/T-07/T-08).

export interface ProductInfo {
  name: string
  price: string
}

export const PRODUCT_MAP: Record<string, ProductInfo> = {
  'daily-stack':         { name: 'Daily Stack',               price: '£34.95/mo' },
  'collagen':            { name: 'Joint & Recovery Collagen', price: '£29.95/mo' },
  'complete-mens-stack': { name: 'Complete Men\'s Stack',     price: '£54.95/mo' },
}

/** Display name for a product slug. Falls back to the raw slug if unmapped. */
export function productName(slug: string | null | undefined): string {
  if (!slug) return ''
  return PRODUCT_MAP[slug]?.name ?? slug
}
