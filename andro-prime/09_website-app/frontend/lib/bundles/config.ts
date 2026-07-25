// Single source of truth for the two-kit bundle mechanism.
//
// A bundle is one Stripe payment that ships kit 1 immediately (the existing
// kit_orders + Vitall flow, unchanged) and owes a SECOND kit dispatched later by
// a trigger. Three SKUs share the machinery; everything here is gated behind
// BUNDLES_ENABLED (lib/flags.ts) at the surfaces that consume it.

import { BORDERLINE_T_FLOOR } from '@/lib/results/classifier'
import type { KitType } from '@/lib/results/types'

export type BundleType = 'confirmation' | 'prove_it' | 'full_picture'

export const BUNDLE_TYPES: BundleType[] = ['confirmation', 'prove_it', 'full_picture']

export interface BundleConfig {
  // The kit shipped immediately on purchase (the parent kit_orders row).
  baseKitType: KitType
  // The kit owed and dispatched later (the bundle_dispatches row). Full-picture
  // ships a Kit 2 (energy-recovery) retest off a Kit 3 base, so this can differ
  // from baseKitType.
  secondKitType: KitType
  // Env var holding the Stripe price id for this bundle SKU. Prices are working
  // hypotheses pending the Van Westendorp WTP read, so the SKU must be a single
  // env swap to reprice.
  stripePriceEnv: string
}

export const BUNDLE_CONFIG: Record<BundleType, BundleConfig> = {
  confirmation: {
    baseKitType: 'testosterone',
    secondKitType: 'testosterone',
    stripePriceEnv: 'STRIPE_PRICE_BUNDLE_CONFIRMATION',
  },
  prove_it: {
    baseKitType: 'energy-recovery',
    secondKitType: 'energy-recovery',
    stripePriceEnv: 'STRIPE_PRICE_BUNDLE_PROVEIT',
  },
  full_picture: {
    baseKitType: 'hormone-recovery',
    secondKitType: 'energy-recovery',
    stripePriceEnv: 'STRIPE_PRICE_BUNDLE_FULLPICTURE',
  },
}

// Timed bundles (Prove-It / Full-picture): the second kit is dispatched ~90 days
// after purchase. due_at is stamped at purchase = now + this.
export const SECOND_DISPATCH_DELAY_DAYS = 90

// Confirmation bundle: the gap between the first result and the confirmatory
// second dispatch, once the low/borderline trigger has fired. Default 0 = the
// second kit is due immediately at trigger time. BSSM-style two-sample
// confirmation implies a minimum gap between samples, so Ewa's clinical sign-off
// maps to editing THIS ONE constant (not a redesign). Exported so the value is a
// single reviewable line. Pending Ewa sign-off.
export const CONFIRMATION_INTERVAL_DAYS = 0

// Confirmation bank path: on an all-clear first result the prepaid second kit is
// re-scheduled to auto-dispatch at the recheck this many months out, rather than
// refunded (refunding loses the Stripe fee on the full bundle). Support honours a
// refund on request as a manual path (scripts/ops/cancel-bundle.ts).
export const BANK_RECHECK_MONTHS = 6

// Soft address-check window: after the address-check email is sent, wait this
// many days for the customer to confirm/update their address, then auto-dispatch
// to whatever address is current. Resolving the address at dispatch time means a
// mid-window update needs no extra code.
export const ADDRESS_CHECK_WINDOW_DAYS = 4

// Recheck (Confirmation) trigger predicate — the SINGLE reviewable line for the
// threshold. The prepaid recheck kit is owed when the first testosterone reading
// is clinically LOW, aligned to the signed-off GP-referral low-T threshold of
// 12 nmol/L (value < BORDERLINE_T_FLOOR). A reading of 12 or above — borderline
// (12–<15) or all-clear (>=15) — BANKS instead of triggering. Aligned down from the
// earlier <15 trigger per Keith/Ewa 2026-07-25, so the borderline band no longer
// triggers an immediate recheck. Ewa's sign-off owns this boundary.
export function shouldTriggerConfirmation(testosteroneValue: number): boolean {
  return testosteroneValue < BORDERLINE_T_FLOOR
}
