// Unit tests for the reorder path (lib/kits/reorder.ts), defect 3e.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-reorder.ts`.
//
// Covers:
//   (1) reorderHref: the three kits, and the fallback for anything else
//   (2) resolveRetestCta: only the retest CTA moves, and only for a known kit
//   (3) THE CONSTRAINT: the shared CTA table still defaults to the catalogue,
//       because it is rendered on logged-out surfaces that have no viewer

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { isKnownKit, reorderHref, resolveRetestCta } from '../lib/kits/reorder'
import type { Cta, KitType } from '../lib/results/types'

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

// ───────────────────────────────────────────────────────────────────────────
// (1) reorderHref
// ───────────────────────────────────────────────────────────────────────────

const KITS: KitType[] = ['testosterone', 'energy-recovery', 'hormone-recovery']
for (const kit of KITS) {
  check(`(1a) ${kit} points at its own product page`, reorderHref(kit) === `/kits/${kit}`)
  check(`(1b) ${kit} is a known kit`, isKnownKit(kit))
}

// The fallback is the STATUS QUO, not a 404. A kit slug added to the database
// and not to this list must degrade to the old dead end rather than to a broken
// link, which is why this is asserted rather than left to read as obvious.
check('(1c) an unknown slug falls back to the catalogue', reorderHref('vitamin-d-only') === '/kits')
check('(1d) null falls back to the catalogue', reorderHref(null) === '/kits')
check('(1e) undefined falls back to the catalogue', reorderHref(undefined) === '/kits')
check('(1f) empty string falls back to the catalogue', reorderHref('') === '/kits')
check('(1g) an unknown slug is not a known kit', !isKnownKit('vitamin-d-only'))

// ───────────────────────────────────────────────────────────────────────────
// (2) resolveRetestCta
// ───────────────────────────────────────────────────────────────────────────

const retestCta: Cta = { type: 'retest-reminder', label: 'Retest in 6–12 months', href: '/kits' }
const gpCta: Cta = { type: 'gp-referral', label: 'Speak to your GP', href: '/results-dashboard/handoff' }
const kit1Cta: Cta = { type: 'kit-1-cross-sell', label: 'Test your testosterone', href: '/kits/testosterone' }

check('(2a) the retest CTA is repointed at the kit that produced the result',
  resolveRetestCta(retestCta, 'energy-recovery')?.href === '/kits/energy-recovery')

// The LABEL is approved copy and says nothing about which kit. Only the
// destination becomes specific; the words must not move.
check('(2b) the label is left exactly alone',
  resolveRetestCta(retestCta, 'energy-recovery')?.label === retestCta.label)
check('(2c) the type is left exactly alone',
  resolveRetestCta(retestCta, 'energy-recovery')?.type === 'retest-reminder')

// Every other CTA type passes through untouched, identity included, so a caller
// can tell cheaply whether anything was resolved.
check('(2d) the GP referral is untouched', resolveRetestCta(gpCta, 'testosterone') === gpCta)
check('(2e) a cross-sell is untouched', resolveRetestCta(kit1Cta, 'energy-recovery') === kit1Cta)
check('(2f) null passes through', resolveRetestCta(null, 'testosterone') === null)

// An unknown kit must leave the CTA exactly as the shared table had it, which
// is the same dead end as today rather than a guess.
check('(2g) an unknown kit leaves the retest CTA alone',
  resolveRetestCta(retestCta, 'not-a-kit') === retestCta)
check('(2h) a null kit leaves the retest CTA alone',
  resolveRetestCta(retestCta, null) === retestCta)

// Already-correct input is returned identically rather than rebuilt.
const alreadyPointed: Cta = { ...retestCta, href: '/kits/testosterone' }
check('(2i) an already-correct href is returned unchanged',
  resolveRetestCta(alreadyPointed, 'testosterone') === alreadyPointed)

// Resolving twice is the same as resolving once.
const once = resolveRetestCta(retestCta, 'hormone-recovery')
const twice = resolveRetestCta(once, 'hormone-recovery')
check('(2j) resolving is idempotent', once?.href === twice?.href && twice === once)

// ───────────────────────────────────────────────────────────────────────────
// (3) THE CONSTRAINT THAT MADE THIS A RESOLVER
//
// 🔴 The obvious fix for 3e was to edit `retestReminder.href` in
// lib/results/classifier.ts from '/kits' to the customer's kit. It cannot be
// done there: that table is ONE SHARED CONSTANT, rendered on logged-out
// surfaces as well as the signed-in dashboard, and a static string cannot know
// whose result it is attached to.
//
// So the default must STAY '/kits'. If someone later "fixes" it in the table,
// every logged-out surface starts pointing a stranger at a specific product on
// the strength of somebody else's result, and nothing else would catch it.
// ───────────────────────────────────────────────────────────────────────────

const classifierSource = readFileSync(
  join(__dirname, '..', 'lib', 'results', 'classifier.ts'),
  'utf8',
)
const retestBlock = classifierSource.slice(
  classifierSource.indexOf('retestReminder: {'),
  classifierSource.indexOf('gpReferral: {'),
)
check('(3a) the retest-reminder block was found, so this check is not vacuous',
  retestBlock.includes("type: 'retest-reminder'"))
check('(3b) THE CONSTRAINT: the shared CTA table still defaults to /kits',
  retestBlock.includes("href: '/kits'"))
check('(3c) ...and has not been pointed at a specific kit',
  !retestBlock.includes("href: '/kits/"))

console.log(`test-reorder: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
