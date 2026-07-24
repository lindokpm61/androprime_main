// Unit tests for the bundle checkout + webhook decision logic (lib/bundles/
// checkout.ts). Same runner-free style as the other suites: assert loudly, exit
// non-zero on any failure. Run with `npm test` or
// `npx tsx scripts/test-bundle-checkout.ts`.
//
// Covers:
//   (1) resolveBundleCheckout: flag-off rejects; unknown bundle rejects;
//       bundle/kitType mismatch rejects; each valid bundle resolves to the right
//       config (base kit + second kit + price env).
//   (2) computeBundleDueAt: +90d ISO for the two timed bundles, null for
//       Confirmation.
//   (3) the type-guard validators used by the webhook.

import {
  resolveBundleCheckout,
  computeBundleDueAt,
  isValidBundleType,
  isValidKitType,
} from '../lib/bundles/checkout'
import { BUNDLE_CONFIG, SECOND_DISPATCH_DELAY_DAYS } from '../lib/bundles/config'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`[FAIL] ${label}`)
  }
}

const DAY_MS = 24 * 60 * 60 * 1000
const NOW = new Date('2026-07-24T12:00:00.000Z')

// (1a) Flag-off rejects even a perfectly-formed bundle request (dark launch).
const flagOff = resolveBundleCheckout('prove_it', 'energy-recovery', false)
check('(1a) flag OFF -> rejected', flagOff.ok === false)
check(
  '(1a) flag OFF -> 400 "Bundles are not available"',
  flagOff.ok === false && flagOff.status === 400 && flagOff.error === 'Bundles are not available',
)

// (1b) Unknown bundle key rejects.
const unknown = resolveBundleCheckout('mystery_box', 'testosterone', true)
check('(1b) unknown bundle -> rejected 400', unknown.ok === false && unknown.status === 400)

// (1c) bundle/kitType mismatch rejects (Confirmation ships a testosterone base,
// so an energy-recovery kitType must not resolve it).
const mismatch = resolveBundleCheckout('confirmation', 'energy-recovery', true)
check('(1c) bundle/kitType mismatch -> rejected 400', mismatch.ok === false && mismatch.status === 400)

// A mismatch for every bundle against a deliberately-wrong base kit.
const wrongBase: Record<string, string> = {
  confirmation: 'hormone-recovery',
  prove_it: 'testosterone',
  full_picture: 'energy-recovery',
}
for (const [bundle, badKit] of Object.entries(wrongBase)) {
  const r = resolveBundleCheckout(bundle, badKit, true)
  check(`(1c) ${bundle} + wrong base kit (${badKit}) -> rejected`, r.ok === false)
}

// (1d) Each valid bundle resolves to its correct base kit, second kit, and price
// env. Asserted straight off BUNDLE_CONFIG so this test also pins the Phase A map.
const expected: Record<string, { base: string; second: string; env: string }> = {
  confirmation: {
    base: 'testosterone',
    second: 'testosterone',
    env: 'STRIPE_PRICE_BUNDLE_CONFIRMATION',
  },
  prove_it: {
    base: 'energy-recovery',
    second: 'energy-recovery',
    env: 'STRIPE_PRICE_BUNDLE_PROVEIT',
  },
  full_picture: {
    base: 'hormone-recovery',
    second: 'energy-recovery',
    env: 'STRIPE_PRICE_BUNDLE_FULLPICTURE',
  },
}
for (const [bundle, exp] of Object.entries(expected)) {
  const r = resolveBundleCheckout(bundle, exp.base, true)
  check(`(1d) ${bundle} + correct base kit -> ok`, r.ok === true)
  if (r.ok) {
    check(`(1d) ${bundle} -> baseKitType = ${exp.base}`, r.config.baseKitType === exp.base)
    check(`(1d) ${bundle} -> secondKitType = ${exp.second}`, r.config.secondKitType === exp.second)
    check(`(1d) ${bundle} -> stripePriceEnv = ${exp.env}`, r.config.stripePriceEnv === exp.env)
    check(`(1d) ${bundle} -> bundleType echoed`, r.bundleType === bundle)
  }
  // Cross-check against the source-of-truth config directly.
  check(`(1d) ${bundle} config matches BUNDLE_CONFIG`, BUNDLE_CONFIG[bundle as keyof typeof BUNDLE_CONFIG].secondKitType === exp.second)
}

// (2) computeBundleDueAt: +90d for the two timed bundles, null for Confirmation.
// Assert against an INDEPENDENT hardcoded instant, not a recomputation of the
// implementation's own expression (which would only be a change-detector):
// 2026-07-24T12:00:00Z + 90 days = 2026-10-22T12:00:00Z (Jul 24->31 is 7, Aug 31,
// Sep 30, Oct 22 = 90). Verifier NIT 2026-07-24.
const FIXED_NOW = new Date('2026-07-24T12:00:00.000Z')
const EXPECTED_90D_ISO = '2026-10-22T12:00:00.000Z'
check('(2) prove_it due_at = fixed now + 90d (independent literal)', computeBundleDueAt('prove_it', FIXED_NOW) === EXPECTED_90D_ISO)
check('(2) full_picture due_at = fixed now + 90d (independent literal)', computeBundleDueAt('full_picture', FIXED_NOW) === EXPECTED_90D_ISO)
const expected90d = new Date(NOW.getTime() + SECOND_DISPATCH_DELAY_DAYS * DAY_MS).toISOString()
check('(2) prove_it due_at = now + 90d (ISO)', computeBundleDueAt('prove_it', NOW) === expected90d)
check('(2) full_picture due_at = now + 90d (ISO)', computeBundleDueAt('full_picture', NOW) === expected90d)
check('(2) confirmation due_at = null (result-triggered)', computeBundleDueAt('confirmation', NOW) === null)
check('(2) SECOND_DISPATCH_DELAY_DAYS is 90', SECOND_DISPATCH_DELAY_DAYS === 90)

// (3) validators used by the webhook to defend the bundle_dispatches insert.
check('(3) isValidBundleType("prove_it") -> true', isValidBundleType('prove_it') === true)
check('(3) isValidBundleType("nope") -> false', isValidBundleType('nope') === false)
check('(3) isValidBundleType(undefined) -> false', isValidBundleType(undefined) === false)
check('(3) isValidKitType("energy-recovery") -> true', isValidKitType('energy-recovery') === true)
check('(3) isValidKitType("plasma") -> false', isValidKitType('plasma') === false)
check('(3) isValidKitType(undefined) -> false', isValidKitType(undefined) === false)

if (failures > 0) {
  console.error(`\n${failures} bundle-checkout assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} bundle-checkout assertion(s) passed.`)
process.exit(0)
