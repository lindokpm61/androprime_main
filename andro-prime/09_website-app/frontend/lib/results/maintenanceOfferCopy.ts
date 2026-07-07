import type { KitType } from './types'

// All-clear maintenance offer — customer-facing copy, lifted VERBATIM from
// `07_sales/funnel/all-clear-maintenance-offer-copy.md` (DRAFT, pending Ewa +
// compliance sign-off). This card only ever renders behind the
// MAINTENANCE_OFFER_ENABLED flag (default OFF), so nothing here is live.
//
// The EFSA claim sentences are reproduced exactly as approved in the compliance
// allowlist; do NOT paraphrase. The doc's footnote superscripts (¹²³) are
// documentation cross-references to the claims-mapping table, NOT part of the
// customer-facing claim, so they are omitted from the rendered strings. No em
// dashes. The V7.2 silent ingredient is never named.
export const MAINTENANCE_OFFER_COPY = {
  // Headline + framing + waitlist honesty are identical across all kits.
  headline: 'YOUR LEVELS ARE GOOD. HERE IS HOW TO KEEP THEM THERE.',
  body1: 'Your results came back in range. That is good news, and nothing here needs fixing.',
  body3:
    'Supplements are not on sale yet. Join the waitlist and you will be first to know when the Daily Stack ships, with a founding-customer discount.',
  buttonLabel: 'Join the supplement waitlist',
  // Phase 0a: the waitlist opt-in page, never a checkout (the subscription route
  // deliberately 400s until Phase 0b).
  href: '/supplement-waitlist',
  // Body line 2 — the claims block. Only the claims block varies by kit, because
  // the permitted claims are driven entirely by which markers the kit measured:
  //   testosterone (Kit 1)    -> Zinc / testosterone only (no D/B12 marker)
  //   energy-recovery (Kit 2) -> Vitamin D + Active B12 (no testosterone marker)
  //   hormone-recovery (Kit 3)-> all three
  claimsByKit: {
    testosterone:
      'The Daily Stack is the maintenance dose of the nutrient tied to that marker. Zinc contributes to the maintenance of normal testosterone levels. The point is holding a good result, not pushing it higher.',
    'energy-recovery':
      'The Daily Stack is the maintenance dose of the nutrients tied to those markers. Vitamin D contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism and normal psychological function.',
    'hormone-recovery':
      'The Daily Stack is the maintenance dose of the nutrients tied to those markers. Zinc contributes to the maintenance of normal testosterone levels. Vitamin D contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism and normal psychological function.',
  } satisfies Record<KitType, string>,
} as const

// Select the per-kit claims block. Pure and exported so the render layer and the
// regression test share one source of truth for which claims a kit may carry.
export function maintenanceClaimsForKit(kitType: KitType): string {
  return MAINTENANCE_OFFER_COPY.claimsByKit[kitType]
}
