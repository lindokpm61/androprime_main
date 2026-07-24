// Pure decision logic for the bundle checkout + webhook wiring, factored out of
// the routes so the validation and due_at arithmetic are testable without Stripe,
// a DB, or a live clock. The checkout route (app/api/checkout/kit) uses
// resolveBundleCheckout to gate a bundle purchase; the Stripe webhook
// (app/api/webhooks/stripe) uses the validators + computeBundleDueAt to build the
// bundle_dispatches row. Everything here is inert unless BUNDLES_ENABLED is on —
// the flag is passed in, never read here, so these stay pure.

import type { KitType } from '@/lib/results/types'
import {
  BUNDLE_CONFIG,
  BUNDLE_TYPES,
  SECOND_DISPATCH_DELAY_DAYS,
  type BundleConfig,
  type BundleType,
} from './config'

const DAY_MS = 24 * 60 * 60 * 1000

// The three kit_type enum values (mirrors the Supabase public.kit_type enum).
// Kept here so the webhook can validate second_kit_type without re-declaring it.
export const KIT_TYPES: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']

export function isValidBundleType(value: string | undefined | null): value is BundleType {
  return typeof value === 'string' && (BUNDLE_TYPES as string[]).includes(value)
}

export function isValidKitType(value: string | undefined | null): value is KitType {
  return typeof value === 'string' && (KIT_TYPES as string[]).includes(value)
}

// Result of validating a bundle checkout request. On success it carries the
// resolved config (the caller then resolves the price env + metadata); on failure
// it carries the exact { status, error } to return, matching the route's idiom.
export type BundleCheckoutResolution =
  | { ok: true; bundleType: BundleType; config: BundleConfig }
  | { ok: false; status: number; error: string }

// Validate a bundle purchase: the flag must be on (dark launch — no valid client
// sends `bundle` while it is off), the bundle must be a known SKU, and the base
// kitType must match that bundle's baseKitType (the bundle price ships THAT base
// kit first). Price-env resolution stays in the route (it reads process.env).
export function resolveBundleCheckout(
  bundle: string,
  kitType: string,
  bundlesEnabled: boolean,
): BundleCheckoutResolution {
  if (!bundlesEnabled) {
    return { ok: false, status: 400, error: 'Bundles are not available' }
  }
  if (!isValidBundleType(bundle)) {
    return { ok: false, status: 400, error: 'Invalid bundle' }
  }
  const config = BUNDLE_CONFIG[bundle]
  if (kitType !== config.baseKitType) {
    return { ok: false, status: 400, error: 'Invalid bundle for this kit' }
  }
  return { ok: true, bundleType: bundle, config }
}

// due_at for the owed second kit, stamped at purchase in the Stripe webhook.
// Timed bundles (Prove-It / Full-picture) are due now + SECOND_DISPATCH_DELAY_DAYS
// (~90d) as an ISO string; Confirmation is result-triggered, so it carries no
// due_at at purchase (null) and the result hook sets it later.
export function computeBundleDueAt(bundleType: BundleType, now: Date): string | null {
  if (bundleType === 'confirmation') return null
  return new Date(now.getTime() + SECOND_DISPATCH_DELAY_DAYS * DAY_MS).toISOString()
}
