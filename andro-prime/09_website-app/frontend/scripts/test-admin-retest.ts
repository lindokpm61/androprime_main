// Unit tests for the admin retest-date control (lib/admin/retestDate.ts),
// defect A1. Same runner-free style as the other suites.
// Run with `npm test` or `npx tsx scripts/test-admin-retest.ts`.
//
// This control is the only lever support has over the field the nightly sweep
// selects on, so a bad move here posts a real kit or strands a member. The
// refusal table is therefore asserted exhaustively rather than sampled.
//
// Covers:
//   (1) the reason is mandatory and must be readable later
//   (2) the date is sanity-bounded, but a PAST date is allowed on purpose
//   (3) the in-flight refusal, which is the one about the machine
//   (4) dispatchesOnNextSweep, the flag the UI warns on

import {
  MAX_YEARS_AHEAD,
  MIN_REASON_LENGTH,
  REFUSAL_MESSAGE,
  validateRetestMove,
  type RetestMoveRefusal,
} from '../lib/admin/retestDate'
import { RETEST_IN_FLIGHT_DAYS, type MembershipLike } from '../lib/membership/entitlement'

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

const NOW = new Date('2026-09-13T12:00:00.000Z')
const DAY_MS = 24 * 60 * 60 * 1000
const iso = (d: Date) => d.toISOString()
const daysFromNow = (n: number) => new Date(NOW.getTime() + n * DAY_MS)

const member = (over: Partial<MembershipLike> = {}): MembershipLike => ({
  status: 'active',
  next_retest_due_at: iso(daysFromNow(60)),
  retest_claimed_at: null,
  ...over,
})

const GOOD_REASON = 'Ticket 412: GP asked for an earlier recheck.'

function refusalOf(r: ReturnType<typeof validateRetestMove>): RetestMoveRefusal | null {
  return r.ok ? null : r.refusal
}

// ───────────────────────────────────────────────────────────────────────────
// (1) The reason
// ───────────────────────────────────────────────────────────────────────────

check('(1a) an empty reason is refused',
  refusalOf(validateRetestMove({ membership: member(), newDueAt: daysFromNow(10), reason: '', now: NOW }))
    === 'no-reason')
check('(1b) whitespace is not a reason',
  refusalOf(validateRetestMove({ membership: member(), newDueAt: daysFromNow(10), reason: '   ', now: NOW }))
    === 'no-reason')
check('(1c) a too-short reason is refused',
  refusalOf(validateRetestMove({ membership: member(), newDueAt: daysFromNow(10), reason: 'asked', now: NOW }))
    === 'reason-too-short')
check('(1d) the boundary: exactly the minimum is accepted',
  validateRetestMove({
    membership: member(), newDueAt: daysFromNow(10), reason: 'x'.repeat(MIN_REASON_LENGTH), now: NOW,
  }).ok)
check('(1e) one under the minimum is not',
  refusalOf(validateRetestMove({
    membership: member(), newDueAt: daysFromNow(10), reason: 'x'.repeat(MIN_REASON_LENGTH - 1), now: NOW,
  })) === 'reason-too-short')
// Length is measured on the TRIMMED reason, or padding defeats the rule.
check('(1f) padding a short reason with spaces does not pass it',
  refusalOf(validateRetestMove({
    membership: member(), newDueAt: daysFromNow(10), reason: '  hi  '.padEnd(40), now: NOW,
  })) === 'reason-too-short')

// ───────────────────────────────────────────────────────────────────────────
// (2) The date
// ───────────────────────────────────────────────────────────────────────────

check('(2a) an unreadable date is refused',
  refusalOf(validateRetestMove({
    membership: member(), newDueAt: new Date('nonsense'), reason: GOOD_REASON, now: NOW,
  })) === 'bad-date')

// 🔴 A PAST DATE IS ALLOWED AND THAT IS THE POINT. Granting an early retest is
// the main use of this control and the way to grant one is to move the date to
// now. Asserted so a later "tidy-up" cannot refuse it as obviously wrong.
check('(2b) A DATE IN THE PAST IS ALLOWED, because that is how an early retest is granted',
  validateRetestMove({ membership: member(), newDueAt: daysFromNow(-1), reason: GOOD_REASON, now: NOW }).ok)
check('(2c) today is allowed',
  validateRetestMove({ membership: member(), newDueAt: NOW, reason: GOOD_REASON, now: NOW }).ok)

check('(2d) a date inside the ceiling is allowed',
  validateRetestMove({
    membership: member(), newDueAt: daysFromNow(365 * MAX_YEARS_AHEAD - 2), reason: GOOD_REASON, now: NOW,
  }).ok)
check('(2e) a fat-fingered year is refused',
  refusalOf(validateRetestMove({
    membership: member(), newDueAt: new Date('2125-09-13T00:00:00.000Z'), reason: GOOD_REASON, now: NOW,
  })) === 'too-far-out')

check('(2f) a membership with no date has nothing to move',
  refusalOf(validateRetestMove({
    membership: member({ next_retest_due_at: null }), newDueAt: daysFromNow(10), reason: GOOD_REASON, now: NOW,
  })) === 'no-entitlement')
check('(2g) no membership at all is the same refusal',
  refusalOf(validateRetestMove({
    membership: null, newDueAt: daysFromNow(10), reason: GOOD_REASON, now: NOW,
  })) === 'no-entitlement')

// ───────────────────────────────────────────────────────────────────────────
// (3) In flight — the refusal that is about the machine, not the money
//
// `claimed` inside the window means a kit is physically in the post and the
// sweep has already rolled the date a year forward. Moving it back to now would
// put the membership straight back into the sweep's selection; the sweep claims
// BEFORE it inserts and the open-dispatch index would refuse the insert, so the
// member would be stamped claimed and sent nothing. That is the 3b failure mode
// re-entered by hand.
// ───────────────────────────────────────────────────────────────────────────

const inFlight = member({ retest_claimed_at: iso(daysFromNow(-2)) })

check('(3a) moving an in-flight retest BACKWARDS is refused',
  refusalOf(validateRetestMove({
    membership: inFlight, newDueAt: daysFromNow(-1), reason: GOOD_REASON, now: NOW,
  })) === 'in-flight-backwards')
check('(3b) ...including to exactly now',
  refusalOf(validateRetestMove({
    membership: inFlight, newDueAt: NOW, reason: GOOD_REASON, now: NOW,
  })) === 'in-flight-backwards')

// Forwards is fine: pushing a date out while a kit is in the post changes
// nothing about the kit and is a legitimate correction.
check('(3c) moving an in-flight retest FORWARDS is allowed',
  validateRetestMove({ membership: inFlight, newDueAt: daysFromNow(400), reason: GOOD_REASON, now: NOW }).ok)

// Once the window has passed he has the kit, so the refusal lifts.
const landed = member({ retest_claimed_at: iso(daysFromNow(-(RETEST_IN_FLIGHT_DAYS + 1))) })
check('(3d) past the in-flight window, a backwards move is allowed again',
  validateRetestMove({ membership: landed, newDueAt: daysFromNow(-1), reason: GOOD_REASON, now: NOW }).ok)

// ───────────────────────────────────────────────────────────────────────────
// (4) The flag the UI warns on
// ───────────────────────────────────────────────────────────────────────────

const willDispatch = validateRetestMove({
  membership: member(), newDueAt: daysFromNow(-1), reason: GOOD_REASON, now: NOW,
})
check('(4a) a past date reports that the sweep will owe a kit',
  willDispatch.ok && willDispatch.dispatchesOnNextSweep)

const wontDispatch = validateRetestMove({
  membership: member(), newDueAt: daysFromNow(30), reason: GOOD_REASON, now: NOW,
})
check('(4b) a future date reports that it will not',
  wontDispatch.ok && !wontDispatch.dispatchesOnNextSweep)

// Every refusal has a message an operator can act on. A refusal code with no
// sentence behind it is a dead end on a screen somebody is using under
// pressure, which is the exact thing A1 exists to remove.
const ALL_REFUSALS: RetestMoveRefusal[] = [
  'no-reason', 'reason-too-short', 'bad-date', 'too-far-out', 'in-flight-backwards', 'no-entitlement',
]
for (const r of ALL_REFUSALS) {
  check(`(4c) ${r} has a usable message`,
    typeof REFUSAL_MESSAGE[r] === 'string' && REFUSAL_MESSAGE[r].length > 20)
}

console.log(`test-admin-retest: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
