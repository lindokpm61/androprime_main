/**
 * WHAT EACH STRIPE PRICE IS SUPPOSED TO BE. PURE: no network, no env, no clock.
 * Defect P3.
 *
 * ── THE DEFECT ────────────────────────────────────────────────────────────
 * Every checkout route resolves a Stripe price id out of an environment
 * variable and hands it straight to Stripe. **Nothing has ever checked that the
 * price object behind that id charges the amount this repo says it charges.**
 * The repo's number and Stripe's number are two copies of one fact held in two
 * systems, and only one of them takes the money.
 *
 * The failure mode is not a broken page. It is a correct-looking checkout that
 * charges a real card the wrong amount, and the first person to find out is the
 * customer. P3 was recorded as a task, which is the wrong instrument: a task is
 * discovered on a board a week later, and this is only checkable at one moment.
 *
 * ── WHY THE EXPECTED AMOUNTS ARE DERIVED AND NEVER RETYPED ────────────────
 * `lib/subscriptions/products.ts` exists because the same fact was once in
 * three places and all three had drifted. Retyping `4700` here would recreate
 * exactly that, one layer down, in the file whose whole job is to catch drift.
 * So every number below is computed from the catalogue that already owns it:
 * kit amounts from `PRICING`, the membership amount parsed out of the same
 * display string the kit pages render. **If the catalogue moves, this moves
 * with it, and the check keeps testing Stripe rather than testing itself.**
 *
 * ── THE BUNDLES ARE DELIBERATELY UNPRICED HERE, AND THAT IS NOT AN OMISSION ─
 * `lib/bundles/config.ts` says it outright: bundle prices are *"working
 * hypotheses pending the Van Westendorp WTP read, so the SKU must be a single
 * env swap to reprice."* The repo makes no claim about what a bundle costs, so
 * asserting an amount for one would be inventing a claim in order to have
 * something to check. They get `pence: null`, which means **assert the shape,
 * report the amount, never fail on it**. A check that fabricates its own
 * expectation is worse than no check: it fails on correct repricing and trains
 * the reader to ignore it.
 *
 * ── THE DENOMINATOR COMES FROM THE CATALOGUES, NOT FROM THIS FILE ──────────
 * The list is built by walking `PRICING`, `PRODUCT_MAP` and `BUNDLE_CONFIG`
 * rather than by listing env vars by hand, so a product added to any of them is
 * covered here by default. A hand-written list would have silently stopped
 * being exhaustive on the first new SKU, and it would have looked complete the
 * whole time.
 */

import { PRICING } from '@/lib/pricing'
import { PRODUCT_MAP } from '@/lib/subscriptions/products'
import { BUNDLE_CONFIG } from '@/lib/bundles/config'

/** Recurring monthly, or a single payment. */
export type PriceShape = 'monthly' | 'one_off'

export interface PriceExpectation {
  /** The environment variable holding the Stripe price id. */
  env: string
  /** Human label, for the report. */
  label: string
  /** `monthly` asserts a month-interval recurrence; `one_off` asserts none. */
  shape: PriceShape
  /**
   * Expected amount in pence, or `null` where this repo states no price and the
   * verifier should report Stripe's figure rather than judge it.
   */
  pence: number | null
  /** Where the expectation came from. Printed, so a surprise is traceable. */
  source: string
  /** The flag gating the surface that spends this price, if any. */
  gatedBy: string | null
}

/**
 * Pounds to pence, rounded rather than truncated.
 *
 * ⚠ `34.95 * 100` is `3494.9999999999995` in IEEE-754, so a bare `Math.floor`
 * or a `| 0` here would expect a price one penny low and fail against a
 * perfectly correct Stripe object. The bug would look like a Stripe problem.
 */
export function poundsToPence(pounds: number): number {
  return Math.round(pounds * 100)
}

/**
 * Read a customer-facing display price into an amount and a shape.
 *
 * Accepts the two forms the catalogue actually uses, `£47/mo` and `£34.95/mo`,
 * plus the bare `£99` form. Returns null on anything else rather than guessing:
 * an unparseable price must surface as a gap in coverage, never as a silently
 * skipped assertion.
 */
export function parseDisplayPrice(
  display: string,
): { pence: number; shape: PriceShape } | null {
  const match = /^£(\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?)(\/mo)?$/.exec(display.trim())
  if (!match) return null
  const pounds = Number(match[1].replace(/,/g, ''))
  if (!Number.isFinite(pounds)) return null
  return { pence: poundsToPence(pounds), shape: match[2] ? 'monthly' : 'one_off' }
}

/** Every Stripe price this application can spend, and what it should be. */
export function priceExpectations(): PriceExpectation[] {
  const out: PriceExpectation[] = []

  // ── Kits. One-off payments, amount owned by PRICING.rrp. ──────────────────
  //
  // The env var name is derived from the PRICING key (`KIT_1` →
  // `STRIPE_PRICE_KIT_1`) rather than restated, which is what makes a fourth
  // kit covered the day it is added. `scripts/test-price-expectations.ts`
  // asserts by source-read that the checkout route resolves the same names, so
  // this derivation cannot drift away from the route that actually spends them.
  for (const [key, kit] of Object.entries(PRICING)) {
    out.push({
      env: `STRIPE_PRICE_${key}`,
      label: kit.name,
      shape: 'one_off',
      pence: poundsToPence(kit.rrp),
      source: `PRICING.${key}.rrp = ${kit.rrp}`,
      gatedBy: null,
    })
  }

  // ── Recurring products. Amount parsed from the catalogue's display price. ──
  //
  // Retired products carry no `stripePriceEnv` at all, which is the thing that
  // makes them structurally uncheckoutable, so they are skipped here for the
  // same reason: there is no price to verify.
  for (const [slug, info] of Object.entries(PRODUCT_MAP)) {
    if (!info.purchasable || !info.stripePriceEnv) continue
    const parsed = parseDisplayPrice(info.price)
    out.push({
      env: info.stripePriceEnv,
      label: info.name,
      shape: parsed?.shape ?? 'monthly',
      pence: parsed?.pence ?? null,
      source: parsed
        ? `PRODUCT_MAP.${slug}.price = ${info.price}`
        : `PRODUCT_MAP.${slug}.price = ${info.price} (UNPARSEABLE, amount not asserted)`,
      gatedBy: slug === 'membership' ? 'MEMBERSHIP_ENABLED' : null,
    })
  }

  // ── Bundles. Shape asserted, amount reported only. See the header. ────────
  for (const [type, cfg] of Object.entries(BUNDLE_CONFIG)) {
    out.push({
      env: cfg.stripePriceEnv,
      label: `Bundle: ${type}`,
      shape: 'one_off',
      pence: null,
      source: 'no price claimed in repo (lib/bundles/config.ts: working hypothesis)',
      gatedBy: 'BUNDLES_ENABLED',
    })
  }

  return out
}

/** What a live Stripe price looks like, reduced to the fields we judge. */
export interface ObservedPrice {
  active: boolean
  currency: string
  unitAmount: number | null
  recurringInterval: string | null
  recurringIntervalCount: number | null
}

export type PriceProblem =
  | 'env-unset'
  | 'not-found'
  | 'inactive'
  | 'wrong-currency'
  | 'wrong-amount'
  | 'should-recur'
  | 'should-not-recur'
  | 'wrong-interval'

/**
 * Judge one observed price against its expectation. PURE, so the whole refusal
 * table is drivable from a test without touching Stripe.
 *
 * ⚠ **Silence is not a pass.** A missing env var returns `env-unset` rather
 * than an empty problem list, because "we could not check it" and "we checked
 * it and it was right" are opposite outcomes that a boolean would merge. At
 * switch-on the first is the more likely one and the more dangerous.
 */
export function judgePrice(
  expected: PriceExpectation,
  observed: ObservedPrice | null,
  envValue: string | undefined,
): PriceProblem[] {
  if (!envValue) return ['env-unset']
  if (!observed) return ['not-found']

  const problems: PriceProblem[] = []

  if (!observed.active) problems.push('inactive')
  if (observed.currency.toLowerCase() !== 'gbp') problems.push('wrong-currency')

  if (expected.shape === 'monthly') {
    if (!observed.recurringInterval) {
      problems.push('should-recur')
    } else if (
      observed.recurringInterval !== 'month' ||
      (observed.recurringIntervalCount ?? 1) !== 1
    ) {
      problems.push('wrong-interval')
    }
  } else if (observed.recurringInterval) {
    problems.push('should-not-recur')
  }

  // Only judged where the repo actually claims an amount. See the header.
  if (expected.pence !== null && observed.unitAmount !== expected.pence) {
    problems.push('wrong-amount')
  }

  return problems
}

/** One-line human explanation per problem, for the verifier's output. */
export const PROBLEM_TEXT: Record<PriceProblem, string> = {
  'env-unset': 'the environment variable is not set, so nothing could be checked',
  'not-found': 'Stripe has no price with that id on this account',
  inactive: 'the price is archived in Stripe and a checkout with it will fail',
  'wrong-currency': 'the price is not in GBP',
  'wrong-amount': 'Stripe would charge a different amount from the one this repo states',
  'should-recur': 'this is sold as a subscription and the price is a one-off',
  'should-not-recur': 'this is sold once and the price would set up a recurring charge',
  'wrong-interval': 'the price recurs on an interval other than every one month',
}
