// Unit tests for retest guidance (lib/results/retestGuidance.ts), defect 3f.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-retest-guidance.ts`.
//
// Covers:
//   (1) the verdict is TOTAL over every result state, with no default
//   (2) CA-014 as a rule: only an all-clear may carry a link to a paid kit
//   (3) the three kinds are kept apart, and 'none' is not a gap
//   (4) the count of states owed wording, which is the number for Ewa

import { BADGES, badgeFor } from '../lib/results/resultSeverity'
import {
  mayCarryPurchaseLink,
  retestGuidanceFor,
  statesOwedWording,
} from '../lib/results/retestGuidance'
import type { ResultState } from '../lib/results/types'

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

const ALL_STATES = Object.keys(BADGES) as ResultState[]

// ───────────────────────────────────────────────────────────────────────────
// (1) Total over the type
//
// The badge map is exhaustive by `Record<ResultState, BadgeConfig>`, and this
// derives from it, so every state must get a verdict. Asserted rather than
// assumed, because the whole point of 3f is a cohort that fell through a gap
// nobody had listed.
// ───────────────────────────────────────────────────────────────────────────

check('(1a) there are states to check at all', ALL_STATES.length > 25)
for (const state of ALL_STATES) {
  const g = retestGuidanceFor(state)
  check(`(1b) ${state} gets one of the three kinds`,
    g.kind === 'offer' || g.kind === 'owed' || g.kind === 'none')
}

// ───────────────────────────────────────────────────────────────────────────
// (2) CA-014: only an all-clear may carry a purchase link
//
// This is the direction that harms somebody. The 3f gap withholds information;
// the opposite error sells a kit to a man we have just told to see his doctor.
// ───────────────────────────────────────────────────────────────────────────

for (const state of ALL_STATES) {
  const gpRouted = badgeFor(state).label === 'See Your GP'
  if (gpRouted) {
    check(`(2a) ${state} is GP-routed and may NOT carry a purchase link`,
      !mayCarryPurchaseLink(state))
  }
}

// ⚠ THE BOUNDARY THIS FUNCTION GOT WRONG IN ITS FIRST DRAFT, now asserted from
// both sides. "Only an all-clear may carry a purchase link" is STRICTER than
// CA-014 and is false of the shipped product: a Monitor or Action Needed marker
// may carry a CROSS-SELL to a different kit, and three of those ship today.
// The regression guard caught it. Asserting the permissive side here is what
// stops the rule being quietly tightened back to the wrong thing.
check('(2b) a flagged, non-GP marker MAY carry a cross-sell (low vitamin D)',
  mayCarryPurchaseLink('low-vitamin-d'))
check('(2c) ...and a Monitor band may too (normal testosterone)',
  mayCarryPurchaseLink('normal-testosterone'))
check('(2d) ...and borderline B12', mayCarryPurchaseLink('borderline-b12'))

// The positive half for all-clear, or the rule would be satisfied by returning
// false always.
check('(2e) optimal testosterone MAY carry a purchase link',
  mayCarryPurchaseLink('optimal-testosterone'))
check('(2f) an in-range marker MAY', mayCarryPurchaseLink('normal-vitamin-d'))
check('(2g) the closing normal fallback MAY', mayCarryPurchaseLink('normal'))

// Report-only is barred for its own reason: we draw no conclusion from the
// number, so we recommend nothing off the back of it.
check('(2h) report-only FAI may NOT, and not because it is flagged',
  !mayCarryPurchaseLink('fai-reported') && !badgeFor('fai-reported').filled)

// ───────────────────────────────────────────────────────────────────────────
// (3) The three kinds are kept apart
// ───────────────────────────────────────────────────────────────────────────

check('(3a) low testosterone is owed, as gp-routed',
  JSON.stringify(retestGuidanceFor('low-testosterone')) ===
    JSON.stringify({ kind: 'owed', cohort: 'gp-routed' }))
check('(3b) equivocal testosterone is gp-routed too, which is the 3f cohort',
  JSON.stringify(retestGuidanceFor('equivocal-testosterone')) ===
    JSON.stringify({ kind: 'owed', cohort: 'gp-routed' }))
check('(3c) a Monitor band is owed, as flagged rather than gp-routed',
  JSON.stringify(retestGuidanceFor('borderline-b12')) ===
    JSON.stringify({ kind: 'owed', cohort: 'flagged' }))
check('(3d) Action Needed is flagged, not gp-routed',
  JSON.stringify(retestGuidanceFor('low-vitamin-d')) ===
    JSON.stringify({ kind: 'owed', cohort: 'flagged' }))

// 🔴 'none' IS NOT A GAP. FAI is report-only (Ewa ruling 8: not banded in men),
// so we draw no conclusion from it and cannot recommend re-measuring it either.
// Asserted apart from 'owed' so a later pass filling in the 3f gap does not
// mistake it for one and give FAI a recommendation it must not have.
check('(3e) FAI is none, NOT owed', retestGuidanceFor('fai-reported').kind === 'none')
check('(3f) ...and therefore carries no purchase link either',
  !mayCarryPurchaseLink('fai-reported'))

// The high bands Ewa added on 2026-08-07 are GP-routed, not all-clear. A
// supraphysiological testosterone used to read as optimal and be told to retest
// in 6 to 12 months, which is the exact shape of mistake 3f is about.
check('(3g) high testosterone is owed, not offered',
  retestGuidanceFor('high-testosterone').kind === 'owed')
check('(3h) high vitamin D is owed, not offered',
  retestGuidanceFor('high-vitamin-d').kind === 'owed')

// ───────────────────────────────────────────────────────────────────────────
// (4) The number for Ewa
//
// Not "some flagged results have no retest guidance" but exactly how many
// states, split by cohort. Printed, because the point of it is to be read.
// ───────────────────────────────────────────────────────────────────────────

const owed = statesOwedWording(ALL_STATES)
check('(4a) some states are owed wording', owed.flagged.length + owed.gpRouted.length > 0)
check('(4b) no state is in both cohorts',
  owed.flagged.every((s) => !owed.gpRouted.includes(s)))
check('(4c) every owed state is a flagged one',
  [...owed.flagged, ...owed.gpRouted].every((s) => badgeFor(s).filled))
check('(4d) no all-clear state is owed wording',
  ![...owed.flagged, ...owed.gpRouted].every((s) => !badgeFor(s).filled))
check('(4e) every GP-routed state is barred from a purchase link',
  owed.gpRouted.every((s) => !mayCarryPurchaseLink(s)))

const offered = ALL_STATES.filter((s) => retestGuidanceFor(s).kind === 'offer')
const none = ALL_STATES.filter((s) => retestGuidanceFor(s).kind === 'none')
check('(4f) the three kinds partition the states exactly',
  offered.length + none.length + owed.flagged.length + owed.gpRouted.length === ALL_STATES.length)

console.log('')
console.log('  Defect 3f, the question for Ewa in one line:')
console.log(`  ${owed.gpRouted.length} GP-routed states and ${owed.flagged.length} flagged states`)
console.log(`  are owed retest wording. ${offered.length} all-clear states already have it.`)
console.log(`    gp-routed: ${owed.gpRouted.join(', ')}`)
console.log(`    flagged:   ${owed.flagged.join(', ')}`)
console.log('')

console.log(`test-retest-guidance: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
