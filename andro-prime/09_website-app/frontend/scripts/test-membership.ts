// Unit tests for the membership entitlement rules (lib/membership/entitlement.ts).
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npm test` or `npx tsx scripts/test-membership.ts`.
//
// This logic decides whether a real kit is posted to someone, and it otherwise
// only runs inside a nightly job against live data, which is why it is pure and
// why the table below is exhaustive rather than illustrative.
//
// Covers:
//   (1) isActiveStatus, including the two judgement calls (past_due counts,
//       cancelled does not) and agreement with the database's partial index.
//   (2) Retest cadence: day 90 for a member with a number to move, annual for
//       an all-clear member, annual thereafter.
//   (3) entitlementState across the full cross-product of status x date x
//       claimed, with the precedence order asserted explicitly.
//   (4) isRetestDispatchable, the one question the sweep asks.

import {
  ACTIVE_MEMBER_STATUSES,
  ANNUAL_RETEST_DAYS,
  FIRST_CYCLE_RETEST_DAYS,
  entitlementState,
  firstRetestDueAt,
  isActiveStatus,
  isRetestDispatchable,
  nextRetestAfter,
  type MembershipLike,
  type SubscriptionStatus,
} from '../lib/membership/entitlement'

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

const NOW = new Date('2026-08-26T12:00:00.000Z')
const DAY_MS = 24 * 60 * 60 * 1000
const iso = (d: Date) => d.toISOString()
const daysFromNow = (n: number) => new Date(NOW.getTime() + n * DAY_MS)

const ALL_STATUSES: SubscriptionStatus[] = [
  'incomplete', 'trialing', 'active', 'past_due', 'cancelled', 'unpaid',
]

// (1) isActiveStatus
check('(1a) active', isActiveStatus('active'))
check('(1b) trialing', isActiveStatus('trialing'))
check('(1c) incomplete counts (Stripe uses it between checkout and first payment)',
  isActiveStatus('incomplete'))
// past_due counts on purpose: Stripe sets it while dunning is still running and
// the T-07 chain gives the customer three emails to fix a card. Withdrawing the
// entitlement on the first failed payment would punish an expired card.
check('(1d) past_due counts, because dunning is still running', isActiveStatus('past_due'))
check('(1e) cancelled does NOT', !isActiveStatus('cancelled'))
check('(1f) unpaid does NOT (dunning has finished and failed)', !isActiveStatus('unpaid'))
check('(1g) null', !isActiveStatus(null))
check('(1h) undefined', !isActiveStatus(undefined))
// Guards the pair: the list here and the partial unique index
// memberships_one_live_per_user must describe the same set, or the database
// will permit a second "live" membership the code thinks is impossible.
check('(1i) exactly four active statuses, matching the partial unique index',
  ACTIVE_MEMBER_STATUSES.length === 4)
check('(1j) every status is classified',
  ALL_STATUSES.every((s) => typeof isActiveStatus(s) === 'boolean'))

// (2) Cadence
const started = new Date('2026-01-01T00:00:00.000Z')
const flaggedFirst = firstRetestDueAt(started, true)
const allClearFirst = firstRetestDueAt(started, false)
check('(2a) a member with a number to move retests at day 90',
  flaggedFirst.getTime() === started.getTime() + FIRST_CYCLE_RETEST_DAYS * DAY_MS)
check('(2b) an all-clear member goes annual from the start',
  allClearFirst.getTime() === started.getTime() + ANNUAL_RETEST_DAYS * DAY_MS)
check('(2c) the two cadences genuinely differ', flaggedFirst.getTime() !== allClearFirst.getTime())
check('(2d) day 90 is 8-to-12 weeks, long enough for vitamin D or B12 to move',
  FIRST_CYCLE_RETEST_DAYS >= 56 && FIRST_CYCLE_RETEST_DAYS <= 98)
check('(2e) every retest after the first is annual',
  nextRetestAfter(flaggedFirst).getTime() === flaggedFirst.getTime() + ANNUAL_RETEST_DAYS * DAY_MS)

// (3) entitlementState
const make = (o: Partial<MembershipLike>): MembershipLike => ({
  status: 'active',
  next_retest_due_at: iso(daysFromNow(30)),
  retest_claimed_at: null,
  ...o,
})

check('(3a) no membership at all', entitlementState(null, NOW).kind === 'none')

const pending = entitlementState(make({}), NOW)
check('(3b) active, date ahead => pending', pending.kind === 'pending')
check('(3c) ...and reports days remaining',
  pending.kind === 'pending' && pending.daysRemaining === 30)

check('(3d) active, date passed => due',
  entitlementState(make({ next_retest_due_at: iso(daysFromNow(-1)) }), NOW).kind === 'due')
check('(3e) date exactly now => due (boundary is inclusive)',
  entitlementState(make({ next_retest_due_at: iso(NOW) }), NOW).kind === 'due')
check('(3f) no due date set => none',
  entitlementState(make({ next_retest_due_at: null }), NOW).kind === 'none')
check('(3g) an unparseable date is none, not a crash',
  entitlementState(make({ next_retest_due_at: 'not-a-date' }), NOW).kind === 'none')

// THE RULE THE WHOLE REFRAMING RESTS ON: the entitlement is conditional on
// being active ON the date. A lapsed member whose date has passed gets nothing.
// If this ever goes green as 'due', the credit ledger has effectively returned.
check('(3h) cancelled member, date passed => NOTHING owed',
  entitlementState(
    make({ status: 'cancelled', next_retest_due_at: iso(daysFromNow(-10)) }), NOW).kind === 'none')
check('(3i) unpaid member, date passed => NOTHING owed',
  entitlementState(
    make({ status: 'unpaid', next_retest_due_at: iso(daysFromNow(-10)) }), NOW).kind === 'none')
check('(3j) past_due member, date passed => STILL owed, dunning is running',
  entitlementState(
    make({ status: 'past_due', next_retest_due_at: iso(daysFromNow(-1)) }), NOW).kind === 'due')

// Precedence: claimed beats everything, so a webhook replay or a double sweep
// run cannot post a second kit. That is real postage, not a bookkeeping error.
check('(3k) claimed beats due',
  entitlementState(
    make({ next_retest_due_at: iso(daysFromNow(-5)), retest_claimed_at: iso(daysFromNow(-4)) }),
    NOW).kind === 'claimed')
check('(3l) claimed beats a cancelled status too',
  entitlementState(
    make({ status: 'cancelled', retest_claimed_at: iso(daysFromNow(-4)) }), NOW).kind === 'claimed')

// (4) The sweep's single question, across the full cross-product.
//
// The expected active set is written out LITERALLY here rather than obtained by
// calling isActiveStatus. Deriving the expectation from the function under test
// makes the assertion tautological: it moves with the bug and can never fail.
// Caught exactly that way, by sabotaging isActiveStatus and watching this block
// stay green while the literal assertions above went red.
const EXPECTED_ACTIVE = new Set<SubscriptionStatus>(['incomplete', 'trialing', 'active', 'past_due'])

let dispatchable = 0
for (const status of ALL_STATUSES) {
  for (const offset of [-10, 0, 10]) {
    for (const claimed of [null, iso(daysFromNow(-1))]) {
      const m = make({ status, next_retest_due_at: iso(daysFromNow(offset)), retest_claimed_at: claimed })
      const got = isRetestDispatchable(m, NOW)
      const want = claimed === null && EXPECTED_ACTIVE.has(status) && offset <= 0
      check(`(4) ${status} due${offset >= 0 ? '+' : ''}${offset}d claimed=${claimed !== null} => ${want}`,
        got === want)
      if (got) dispatchable += 1
    }
  }
}
// Sanity on the loop itself: if this were 0 the 36 assertions above would all
// be trivially true and would prove nothing.
check('(4x) the cross-product actually produced dispatchable cases', dispatchable > 0)

console.log(`test-membership: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
