/*
 * `lib/stripe/priceExpectations.ts`: what each Stripe price should be, and the
 * refusal table the live check judges against. Defect P3.
 *
 *   npx tsx scripts/test-price-expectations.ts
 *
 * This is the half of P3 that can be tested without secrets or a network. The
 * live read is `scripts/verify-stripe-prices.ts`, which is a switch-on command
 * rather than a test, for the reason recorded in its header.
 *
 * Four things here are load-bearing and the rest are worked examples:
 *
 *   (1) THE DENOMINATOR. Section 4 derives the set of prices this app can spend
 *       from the catalogues themselves and asserts the expectation list covers
 *       every one. A hand-written list would look complete forever and stop
 *       being exhaustive on the first new SKU.
 *
 *   (2) THE DUPLICATED FACT. Section 5 reads the kit checkout route's SOURCE and
 *       asserts it resolves the same env var names this module derives. The two
 *       are separate derivations of one fact, so renaming a price env in the
 *       route without renaming it here would otherwise leave the live check
 *       confidently verifying a variable nothing spends.
 *
 *   (3) THE ROUNDING TRAP. `34.95 * 100` is 3494.9999999999995. A truncating
 *       conversion expects a price one penny low and fails against a correct
 *       Stripe object, which reads as a Stripe fault rather than an arithmetic
 *       one. Asserted directly in section 1.
 *
 *   (4) SILENCE IS NOT A PASS. An unset env var must judge as `env-unset` and
 *       never as an empty problem list, because "could not check" and "checked
 *       and correct" are opposite outcomes. Section 3.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  poundsToPence,
  parseDisplayPrice,
  priceExpectations,
  judgePrice,
  PROBLEM_TEXT,
  type ObservedPrice,
  type PriceProblem,
} from '../lib/stripe/priceExpectations'
import { PRICING } from '../lib/pricing'
import { PRODUCT_MAP } from '../lib/subscriptions/products'
import { BUNDLE_CONFIG } from '../lib/bundles/config'

let failures = 0
let passes = 0

function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`  ✗ ${label}`)
  }
}

function section(name: string): void {
  console.log(`\n${name}`)
}

/** A correct live price, which each case then spoils in exactly one way. */
function observed(over: Partial<ObservedPrice> = {}): ObservedPrice {
  return {
    active: true,
    currency: 'gbp',
    unitAmount: 4700,
    recurringInterval: 'month',
    recurringIntervalCount: 1,
    ...over,
  }
}

const membership = () => {
  const found = priceExpectations().find((e) => e.env === 'STRIPE_PRICE_MEMBERSHIP')
  if (!found) throw new Error('membership expectation missing; section 4 explains why that matters')
  return found
}
const kit1 = () => {
  const found = priceExpectations().find((e) => e.env === 'STRIPE_PRICE_KIT_1')
  if (!found) throw new Error('kit 1 expectation missing')
  return found
}
const bundle = () => {
  const found = priceExpectations().find((e) => e.env === 'STRIPE_PRICE_BUNDLE_CONFIRMATION')
  if (!found) throw new Error('confirmation bundle expectation missing')
  return found
}

// ── 1. Pounds to pence, including the float trap ────────────────────────────
section('1. poundsToPence')

check('99 → 9900', poundsToPence(99) === 9900)
check('47 → 4700', poundsToPence(47) === 4700)
check('THE TRAP: 34.95 → 3495, not 3494', poundsToPence(34.95) === 3495)
check('29.95 → 2995', poundsToPence(29.95) === 2995)
check('54.95 → 5495', poundsToPence(54.95) === 5495)
check('107.10 → 10710', poundsToPence(107.1) === 10710)
check('0 → 0', poundsToPence(0) === 0)

// ── 2. Parsing the catalogue's display prices ───────────────────────────────
section('2. parseDisplayPrice')

check("'£47/mo' → 4700 monthly", (() => {
  const p = parseDisplayPrice('£47/mo')
  return p?.pence === 4700 && p.shape === 'monthly'
})())

check("'£34.95/mo' → 3495 monthly", (() => {
  const p = parseDisplayPrice('£34.95/mo')
  return p?.pence === 3495 && p.shape === 'monthly'
})())

check("'£99' → 9900 one-off", (() => {
  const p = parseDisplayPrice('£99')
  return p?.pence === 9900 && p.shape === 'one_off'
})())

check("'£1,199' → 119900 one-off", (() => {
  const p = parseDisplayPrice('£1,199')
  return p?.pence === 119900 && p.shape === 'one_off'
})())

check('surrounding whitespace is tolerated', parseDisplayPrice('  £47/mo  ')?.pence === 4700)
check('an unparseable price returns null rather than guessing', parseDisplayPrice('from £47') === null)
check('a bare number returns null', parseDisplayPrice('47') === null)
check('a non-GBP symbol returns null', parseDisplayPrice('$47/mo') === null)
check('an empty string returns null', parseDisplayPrice('') === null)

// ── 3. The refusal table ────────────────────────────────────────────────────
section('3. judgePrice')

check('a correct monthly price has no problems',
  judgePrice(membership(), observed(), 'price_live_1').length === 0)

check('SILENCE IS NOT A PASS: an unset env is env-unset, not clean',
  (() => {
    const p = judgePrice(membership(), observed(), undefined)
    return p.length === 1 && p[0] === 'env-unset'
  })())

check('an unset env is env-unset even when a price was somehow observed',
  judgePrice(membership(), observed(), '').includes('env-unset'))

check('a missing Stripe object is not-found',
  (() => {
    const p = judgePrice(membership(), null, 'price_gone')
    return p.length === 1 && p[0] === 'not-found'
  })())

check('an archived price is caught',
  judgePrice(membership(), observed({ active: false }), 'p').includes('inactive'))

check('a non-GBP price is caught',
  judgePrice(membership(), observed({ currency: 'usd' }), 'p').includes('wrong-currency'))

check('THE ONE THAT COSTS MONEY: a wrong amount is caught',
  judgePrice(membership(), observed({ unitAmount: 4900 }), 'p').includes('wrong-amount'))

check('an amount one penny out is caught',
  judgePrice(membership(), observed({ unitAmount: 4699 }), 'p').includes('wrong-amount'))

check('a subscription sold as a one-off is caught',
  judgePrice(membership(), observed({ recurringInterval: null, recurringIntervalCount: null }), 'p')
    .includes('should-recur'))

check('a yearly interval on a monthly product is caught',
  judgePrice(membership(), observed({ recurringInterval: 'year' }), 'p').includes('wrong-interval'))

check('every-3-months on a monthly product is caught',
  judgePrice(membership(), observed({ recurringIntervalCount: 3 }), 'p').includes('wrong-interval'))

check('a one-off kit that would recur is caught',
  judgePrice(kit1(), observed({ unitAmount: 9900 }), 'p').includes('should-not-recur'))

check('a correct one-off kit passes',
  judgePrice(
    kit1(),
    observed({ unitAmount: 9900, recurringInterval: null, recurringIntervalCount: null }),
    'p',
  ).length === 0)

check('problems accumulate rather than short-circuiting',
  judgePrice(membership(), observed({ active: false, currency: 'usd', unitAmount: 1 }), 'p').length === 3)

check('every problem code has human text',
  (Object.keys(PROBLEM_TEXT) as PriceProblem[]).every((k) => PROBLEM_TEXT[k].length > 0))

// ── 3b. The bundles: shape judged, amount deliberately not ──────────────────
section('3b. Unpriced entries report rather than assert')

check('a bundle claims no amount', bundle().pence === null)

check('ANY amount passes for a bundle, because the repo claims none',
  judgePrice(
    bundle(),
    observed({ unitAmount: 12345, recurringInterval: null, recurringIntervalCount: null }),
    'p',
  ).length === 0)

check('but a bundle that would recur is still caught',
  judgePrice(bundle(), observed({ unitAmount: 12345 }), 'p').includes('should-not-recur'))

check('and an archived bundle price is still caught',
  judgePrice(
    bundle(),
    observed({ active: false, unitAmount: 1, recurringInterval: null, recurringIntervalCount: null }),
    'p',
  ).includes('inactive'))

// ── 4. THE DENOMINATOR, derived from the catalogues ─────────────────────────
section('4. Coverage is derived, not listed')

const expectations = priceExpectations()
const covered = new Set(expectations.map((e) => e.env))

for (const key of Object.keys(PRICING)) {
  check(`PRICING.${key} is covered`, covered.has(`STRIPE_PRICE_${key}`))
}

for (const [slug, info] of Object.entries(PRODUCT_MAP)) {
  if (info.purchasable && info.stripePriceEnv) {
    check(`purchasable product '${slug}' is covered`, covered.has(info.stripePriceEnv))
  } else {
    check(`retired product '${slug}' is NOT checked, having no price to check`,
      !info.stripePriceEnv || !covered.has(info.stripePriceEnv))
  }
}

for (const [type, cfg] of Object.entries(BUNDLE_CONFIG)) {
  check(`bundle '${type}' is covered`, covered.has(cfg.stripePriceEnv))
}

check('no env var is expected twice', covered.size === expectations.length)
check('every expectation names a STRIPE_PRICE_ variable',
  expectations.every((e) => e.env.startsWith('STRIPE_PRICE_')))
check('every expectation carries a source, so a surprise is traceable',
  expectations.every((e) => e.source.length > 0))
check('the membership expectation is £47 per month',
  membership().pence === 4700 && membership().shape === 'monthly')
check('the membership expectation records its gate',
  membership().gatedBy === 'MEMBERSHIP_ENABLED')
check('kit expectations are ungated, because kits are on sale today',
  kit1().gatedBy === null)

// ── 5. THE DUPLICATED FACT: the route resolves the same names ───────────────
section('5. The kit checkout route spends the variables this module checks')

const routeSource = readFileSync(
  resolve(process.cwd(), 'app/api/checkout/kit/route.ts'),
  'utf8',
)

for (const key of Object.keys(PRICING)) {
  const envName = `STRIPE_PRICE_${key}`
  check(`the route reads ${envName}`, routeSource.includes(envName))
}

const routeEnvNames = [...routeSource.matchAll(/STRIPE_PRICE_[A-Z0-9_]+/g)].map((m) => m[0])
check('the route reads no kit price variable this module does not know about',
  routeEnvNames.every((name) => covered.has(name)))

// ── Report ──────────────────────────────────────────────────────────────────
console.log('')
if (failures > 0) {
  console.error(`✗ ${failures} failed, ${passes} passed`)
  process.exit(1)
}
console.log(`✓ ${passes} assertions passed`)
