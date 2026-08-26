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
//   (5) The check-in loop's marker-linked question sets.
//   (6) markerToMove: which single number the member is asked to move.
//   (7) Day keys and the streak, including the not-yet-today grace rule.
//   (8) Adherence series and the logged-days count.
//   (9) What the check-in route will accept as an answer.
//  (10) betterCoupon: which discount a member actually gets at kit checkout.
//  (11) Flagged-vs-loop: the three states the paywall has to tell apart.
//  (12) The 30-day offer window: when a membership may be JOINED at all.

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
import {
  ALL_CHECKIN_KEYS,
  ENERGY_QUESTION,
  SCALE_MAX,
  SCALE_MIN,
  adherenceSeries,
  currentStreak,
  dayKey,
  isValidAnswer,
  loggedWithin,
  markerToMove,
  questionByKey,
  questionsFor,
  type CheckinEntry,
  type CheckinMarkerKey,
} from '../lib/membership/checkin'
import { betterCoupon, type ComparableCoupon } from '../lib/membership/pricingRules'
import { anyFlagged, isFlaggedState } from '../lib/results/resultSeverity'
import {
  MEMBERSHIP_OFFER_WINDOW_DAYS,
  canJoinMembership,
  offerState,
} from '../lib/membership/offer'

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


// ───────────────────────────────────────────────────────────────────────────
// (5) The check-in loop's question sets
//
// The loop is marker-linked and that is the whole discipline, so the shape of
// each set is asserted rather than assumed: three taps, the last of which is
// the shared symptom question.
// ───────────────────────────────────────────────────────────────────────────

const LOOP_MARKERS: CheckinMarkerKey[] = ['vitamin-d', 'active-b12', 'ferritin']

for (const marker of LOOP_MARKERS) {
  const questions = questionsFor(marker)
  check(`(5a) ${marker} asks exactly three taps`, questions.length === 3)
  check(`(5b) ${marker} ends on the shared energy question`,
    questions[2].key === ENERGY_QUESTION.key)
  check(`(5c) ${marker} keys are all distinct`,
    new Set(questions.map((q) => q.key)).size === 3)
  for (const q of questions) {
    check(`(5d) ${q.key} is in the route's allowlist`, ALL_CHECKIN_KEYS.includes(q.key))
    check(`(5e) ${q.key} round-trips through questionByKey`,
      questionByKey(q.key)?.key === q.key)
  }
}

check('(5f) an unknown key resolves to null, so the route rejects it',
  questionByKey('checkin.made.up') === null)
check('(5g) energy appears once in the allowlist despite being in every set',
  ALL_CHECKIN_KEYS.filter((k) => k === ENERGY_QUESTION.key).length === 1)

// ───────────────────────────────────────────────────────────────────────────
// (6) Which marker the member is asked to move
//
// The expected answers are written LITERALLY, never derived by calling
// markerToMove, for the reason section (4) records: an expectation computed
// from the function under test moves with the bug and can never fail.
// ───────────────────────────────────────────────────────────────────────────

check('(6a) no results at all means no loop', markerToMove([]) === null)
check('(6b) an all-clear panel means no loop',
  markerToMove(['normal-testosterone', 'normal-vitamin-d', 'normal-b12', 'normal-ferritin']) === null)
check('(6c) low vitamin D selects the vitamin D loop',
  markerToMove(['normal-testosterone', 'low-vitamin-d']) === 'vitamin-d')
check('(6d) low B12 selects the B12 loop', markerToMove(['low-b12']) === 'active-b12')
check('(6e) low ferritin selects the ferritin loop', markerToMove(['low-ferritin']) === 'ferritin')
check('(6f) borderline B12 still gets a loop', markerToMove(['borderline-b12']) === 'active-b12')
check('(6g) suboptimal ferritin still gets a loop',
  markerToMove(['suboptimal-ferritin']) === 'ferritin')

// Severity beats order-of-appearance: critically low outranks every merely low
// reading regardless of which came first in the list.
check('(6h) critically low vitamin D outranks low ferritin',
  markerToMove(['low-ferritin', 'critically-low-vitamin-d']) === 'vitamin-d')
check('(6i) critically low vitamin D outranks low B12',
  markerToMove(['low-b12', 'critically-low-vitamin-d']) === 'vitamin-d')
check('(6j) a low reading outranks a borderline one',
  markerToMove(['borderline-b12', 'low-ferritin']) === 'ferritin')
check('(6k) selection does not depend on input order',
  markerToMove(['low-vitamin-d', 'low-b12']) === markerToMove(['low-b12', 'low-vitamin-d']))

// Markers with no honest daily behaviour to log get no loop, deliberately.
check('(6l) low testosterone gets no loop: it does not move on wellness supplements',
  markerToMove(['low-testosterone']) === null)
check('(6m) severely low testosterone gets no loop either',
  markerToMove(['severely-low-testosterone']) === null)
check('(6n) raised hs-CRP gets no loop: no single behaviour we can ask about',
  markerToMove(['elevated-crp', 'high-crp', 'moderate-crp']) === null)
check('(6o) a HIGH reading is never a loop', markerToMove(['high-vitamin-d', 'high-ferritin']) === null)

// ───────────────────────────────────────────────────────────────────────────
// (7) Day keys and the streak
// ───────────────────────────────────────────────────────────────────────────

const entryOn = (offsetDays: number, key = 'checkin.energy'): CheckinEntry => ({
  questionKey: key,
  capturedAt: iso(daysFromNow(offsetDays)),
})

check('(7a) dayKey is the UTC calendar date', dayKey(NOW) === '2026-08-26')
check('(7b) dayKey ignores the time of day',
  dayKey(new Date('2026-08-26T23:59:59.999Z')) === '2026-08-26')

check('(7c) no entries is a zero streak', currentStreak([], NOW) === 0)
check('(7d) today alone is a streak of one', currentStreak([entryOn(0)], NOW) === 1)

// The grace rule: a streak not yet extended today is not broken. It is 9am and
// the day is not over. Breaking it at midnight teaches him to stop opening it.
check('(7e) yesterday alone still counts, because today is not over',
  currentStreak([entryOn(-1)], NOW) === 1)
check('(7f) yesterday and the day before, with today unlogged, is two',
  currentStreak([entryOn(-1), entryOn(-2)], NOW) === 2)
check('(7g) an unbroken run including today counts every day',
  currentStreak([entryOn(0), entryOn(-1), entryOn(-2), entryOn(-3)], NOW) === 4)
check('(7h) a gap ends the streak at the gap',
  currentStreak([entryOn(0), entryOn(-1), entryOn(-3), entryOn(-4)], NOW) === 2)
check('(7i) a run that stopped two days ago is a zero streak',
  currentStreak([entryOn(-2), entryOn(-3)], NOW) === 0)
check('(7j) several taps on one day are still one day',
  currentStreak(
    [entryOn(0, 'checkin.energy'), entryOn(0, 'checkin.vitamin-d.supplement')],
    NOW,
  ) === 1)
check('(7k) an unparseable timestamp is ignored rather than counted',
  currentStreak([{ questionKey: 'checkin.energy', capturedAt: 'not-a-date' }], NOW) === 0)

// ───────────────────────────────────────────────────────────────────────────
// (8) Adherence series and the logged count
// ───────────────────────────────────────────────────────────────────────────

const fullDay = (offset: number): CheckinEntry[] => [
  entryOn(offset, 'checkin.vitamin-d.supplement'),
  entryOn(offset, 'checkin.vitamin-d.daylight'),
  entryOn(offset, 'checkin.energy'),
]

const series7 = adherenceSeries([...fullDay(0), ...fullDay(-2), entryOn(-4)], 3, 7, NOW)
check('(8a) the series is exactly the window length', series7.length === 7)
check('(8b) the series runs oldest first and ends today',
  series7[0].day === '2026-08-20' && series7[6].day === '2026-08-26')
check('(8c) a complete day is a full bar', series7[6].fraction === 1)
check('(8d) a completely missed day is zero', series7[5].answered === 0 && series7[5].fraction === 0)
check('(8e) a partial day is a partial bar',
  series7[2].answered === 1 && Math.abs(series7[2].fraction - 1 / 3) < 1e-9)
check('(8f) every day carries the same denominator',
  series7.every((day) => day.total === 3))

// More distinct taps than the loop asks for cannot push a bar past full. The
// chart is a proportion, and a proportion over one would render off the top.
const overfull = adherenceSeries(
  [entryOn(0, 'a'), entryOn(0, 'b'), entryOn(0, 'c'), entryOn(0, 'd')], 3, 1, NOW)
check('(8g) a day is capped at the question count', overfull[0].fraction === 1)

check('(8h) a zero-question loop cannot divide by zero',
  adherenceSeries([entryOn(0)], 0, 1, NOW)[0].fraction === 0)

check('(8i) loggedWithin counts distinct days inside the window',
  JSON.stringify(loggedWithin([...fullDay(0), ...fullDay(-2), entryOn(-4)], 7, NOW)) ===
    JSON.stringify({ logged: 3, of: 7 }))
check('(8j) loggedWithin ignores entries older than the window',
  loggedWithin([entryOn(-30)], 7, NOW).logged === 0)
check('(8k) a perfect week reads as logged N of N',
  loggedWithin([0, -1, -2, -3, -4, -5, -6].map((d) => entryOn(d)), 7, NOW).logged === 7)

// ───────────────────────────────────────────────────────────────────────────
// (9) What the route will accept as an answer
// ───────────────────────────────────────────────────────────────────────────

const boolQ = questionsFor('vitamin-d')[0]
const scaleQ = ENERGY_QUESTION

check('(9a) true is a valid boolean answer', isValidAnswer(boolQ, true))
check('(9b) false is a valid boolean answer', isValidAnswer(boolQ, false))
check('(9c) a number is not a boolean answer', !isValidAnswer(boolQ, 1))
check('(9d) a string is not a boolean answer', !isValidAnswer(boolQ, 'true'))
check('(9e) null is not a boolean answer', !isValidAnswer(boolQ, null))

check('(9f) the bottom of the scale is valid', isValidAnswer(scaleQ, SCALE_MIN))
check('(9g) the top of the scale is valid', isValidAnswer(scaleQ, SCALE_MAX))
check('(9h) below the scale is refused', !isValidAnswer(scaleQ, SCALE_MIN - 1))
check('(9i) above the scale is refused', !isValidAnswer(scaleQ, SCALE_MAX + 1))
check('(9j) a fractional score is refused', !isValidAnswer(scaleQ, 3.5))
check('(9k) a boolean is not a scale answer', !isValidAnswer(scaleQ, true))
check('(9l) NaN is refused', !isValidAnswer(scaleQ, Number.NaN))

// ───────────────────────────────────────────────────────────────────────────
// (10) Which discount a member actually gets
//
// Stripe Checkout takes ONE discount, so this decides what a customer is
// charged. Both directions are asserted, including the case where the member
// deliberately does NOT win.
// ───────────────────────────────────────────────────────────────────────────

const pct = (id: string, percentOff: number): ComparableCoupon => ({ id, percentOff, amountOff: null })
const amt = (id: string, amountOff: number): ComparableCoupon => ({ id, percentOff: null, amountOff })

check('(10a) no coupon on either side is no discount', betterCoupon(null, null) === null)
check('(10b) a code with no membership applies the code',
  betterCoupon(pct('SUB10', 10), null)?.source === 'code')
check('(10c) a membership with no code applies the member price',
  betterCoupon(null, pct('MEMBER', 25))?.source === 'member')
check('(10d) the larger percentage wins when the member price is bigger',
  betterCoupon(pct('SUB10', 10), pct('MEMBER', 25))?.source === 'member')
check('(10e) the larger percentage wins when the CODE is bigger',
  betterCoupon(pct('LAUNCH50', 50), pct('MEMBER', 25))?.source === 'code')
check('(10f) a tie goes to the code, keeping campaign attribution intact',
  betterCoupon(pct('SUB25', 25), pct('MEMBER', 25))?.source === 'code')
check('(10g) percent against fixed amount is not comparable, so the explicit code wins',
  betterCoupon(pct('SUB10', 10), amt('MEMBER', 1000))?.source === 'code')
check('(10h) fixed amount against percent also honours the explicit code',
  betterCoupon(amt('TENOFF', 1000), pct('MEMBER', 25))?.source === 'code')
check('(10i) the chosen coupon carries the right id',
  betterCoupon(pct('SUB10', 10), pct('MEMBER', 25))?.coupon.id === 'MEMBER')
check('(10j) undefined is handled like null on both sides',
  betterCoupon(undefined, undefined) === null &&
    betterCoupon(undefined, pct('MEMBER', 25))?.source === 'member')



// ───────────────────────────────────────────────────────────────────────────
// (11) "Something is wrong" and "there is something to log" are DIFFERENT
//      questions, and the paywall has to tell three states apart.
//
// THIS SECTION EXISTS BECAUSE OF A REAL BUG, caught by rendering the screen
// against a real account. The paywall branched on `marker ? A : B`, so a man
// with low testosterone — flagged, GP-routed, and with no daily behaviour the
// loop can honestly ask him about — fell into the all-clear branch and would
// have been told "nothing is wrong today" directly after being told to see his
// GP. The two questions are now asked separately.
// ───────────────────────────────────────────────────────────────────────────

check('(11a) low testosterone IS flagged', isFlaggedState('low-testosterone'))
check('(11b) low testosterone has NO loop', markerToMove(['low-testosterone']) === null)
check('(11c) THE BUG: flagged with no loop is not the all-clear case',
  isFlaggedState('low-testosterone') && markerToMove(['low-testosterone']) === null)

check('(11d) severely low testosterone is flagged', isFlaggedState('severely-low-testosterone'))
check('(11e) equivocal testosterone is flagged', isFlaggedState('equivocal-testosterone'))
check('(11f) raised hs-CRP is flagged but has no loop',
  isFlaggedState('high-crp') && markerToMove(['high-crp']) === null)
check('(11g) borderline testosterone (Monitor) counts as flagged',
  isFlaggedState('normal-testosterone'))

// The genuinely all-clear labels must NOT be flagged, or every member lands in
// the "something is wrong" branch and the all-clear screen is unreachable.
for (const clear of [
  'optimal-testosterone', 'ft-normal', 'shbg-normal', 'normal-vitamin-d',
  'normal-crp', 'normal-ferritin', 'normal-b12', 'normal-albumin', 'normal',
] as const) {
  check(`(11h) ${clear} is not flagged`, !isFlaggedState(clear))
}

// Free androgen index is REPORTED, never interpreted (Ewa ruling 8). If it were
// flagged, every Kit 3 buyer would be told something needs attention on the
// strength of a number we have decided not to band.
check('(11i) the free androgen index is reported, not flagged',
  !isFlaggedState('fai-reported'))

check('(11j) an all-clear panel is not flagged',
  !anyFlagged(['optimal-testosterone', 'normal-vitamin-d', 'normal-b12', 'fai-reported']))
check('(11k) one flagged marker flags the whole panel',
  anyFlagged(['normal-vitamin-d', 'normal-b12', 'low-ferritin']))
check('(11l) an empty panel is not flagged', !anyFlagged([]))

// Every state that HAS a loop must also be flagged. A loop offered against a
// marker the result card calls "In range" would be asking a man to work on a
// number we have just told him is fine.
for (const state of [
  'critically-low-vitamin-d', 'low-vitamin-d', 'low-b12',
  'borderline-b12', 'low-ferritin', 'suboptimal-ferritin',
] as const) {
  check(`(11m) ${state} has a loop and is flagged`,
    markerToMove([state]) !== null && isFlaggedState(state))
}



// ───────────────────────────────────────────────────────────────────────────
// (12) The 30-day offer window
//
// THE RULE (Keith, 2026-08-26): a membership may be joined only while a lab
// result has come back within the last 30 days. One sentence that does the work
// of four, and this block asserts each of the four sides of it:
//
//   - a new customer's window opens when his result lands
//   - declining closes it, and another kit at full retail opens a new one
//   - a cancelled member rejoining needs a recent result too, so he cannot
//     cycle subscribe / claim / cancel / wait / resubscribe
//   - nothing carries over on rejoining
//
// This decides whether money can be taken, so the boundary is asserted on both
// sides rather than sampled.
// ───────────────────────────────────────────────────────────────────────────

check('(12a) the window is 30 days', MEMBERSHIP_OFFER_WINDOW_DAYS === 30)

check('(12b) no result at all means no offer', offerState(null, NOW).kind === 'no-result')
check('(12c) an unparseable result date is treated as no result',
  offerState(new Date('nonsense'), NOW).kind === 'no-result')
check('(12d) cannot join with no result', !canJoinMembership(null, NOW))

check('(12e) a result that landed today opens the window',
  offerState(daysFromNow(0), NOW).kind === 'open')
check('(12f) a result from yesterday is still open',
  offerState(daysFromNow(-1), NOW).kind === 'open')

// The boundary, from both sides. Day 29 is in, day 31 is out, and day 30 is the
// moment it shuts: `closesAt <= now` closes it, so exactly-30-days-old is CLOSED.
check('(12g) 29 days old is open', offerState(daysFromNow(-29), NOW).kind === 'open')
check('(12h) exactly 30 days old is closed', offerState(daysFromNow(-30), NOW).kind === 'closed')
check('(12i) 31 days old is closed', offerState(daysFromNow(-31), NOW).kind === 'closed')
check('(12j) a year old is closed', offerState(daysFromNow(-365), NOW).kind === 'closed')

// The countdown the paywall prints. Getting this wrong shows a man the wrong
// deadline on the screen that asks him for money.
const openState = offerState(daysFromNow(-10), NOW)
check('(12k) the closing date is 30 days after the result',
  openState.kind === 'open' &&
    openState.closesAt.getTime() === daysFromNow(20).getTime())
check('(12l) days remaining counts down from the result, not from today',
  openState.kind === 'open' && openState.daysRemaining === 20)
const almostShut = offerState(daysFromNow(-29), NOW)
check('(12m) the last day reads as one day remaining',
  almostShut.kind === 'open' && almostShut.daysRemaining === 1)

const shutState = offerState(daysFromNow(-40), NOW)
check('(12n) a closed window reports when it closed',
  shutState.kind === 'closed' &&
    shutState.closedAt.getTime() === daysFromNow(-10).getTime())

// canJoinMembership is the single question the checkout route asks. It must
// agree with offerState across the whole range, and the expected answers are
// written LITERALLY rather than derived from offerState, for the reason section
// (4) records: an expectation computed from the code under test moves with the
// bug and can never fail.
const WINDOW_CASES: { age: number; canJoin: boolean }[] = [
  { age: 0, canJoin: true },
  { age: -1, canJoin: true },
  { age: -15, canJoin: true },
  { age: -29, canJoin: true },
  { age: -30, canJoin: false },
  { age: -31, canJoin: false },
  { age: -90, canJoin: false },
  { age: -365, canJoin: false },
]
for (const c of WINDOW_CASES) {
  check(`(12o) a result ${Math.abs(c.age)} days old => canJoin ${c.canJoin}`,
    canJoinMembership(daysFromNow(c.age), NOW) === c.canJoin)
}

// A future-dated result (clock skew, a backfill) must not be treated as expired.
check('(12p) a result dated in the future is open, not closed',
  offerState(daysFromNow(2), NOW).kind === 'open')

// THE HOLE THIS CLOSES, stated as a test so it cannot be reopened by accident:
// buy a kit, decline, wait, then subscribe purely to collect an included retest.
check('(12q) THE HOLE: a man who declined and returned three months later cannot join',
  !canJoinMembership(daysFromNow(-90), NOW))
check('(12r) ...and a fresh kit result lets him back in',
  canJoinMembership(daysFromNow(0), NOW))

// The window governs JOINING, never STAYING. Nothing in this module can end a
// membership, so an existing member with an ancient result keeps his
// entitlement: that is entitlementState's job, and it does not consult the
// window at all.
const oldResultMember = make({ next_retest_due_at: iso(daysFromNow(30)) })
check('(12s) a member with a year-old result still holds his entitlement',
  !canJoinMembership(daysFromNow(-365), NOW) &&
    entitlementState(oldResultMember, NOW).kind === 'pending')


console.log(`test-membership: ${passes} passed, ${failures} failed`)
if (failures > 0) process.exit(1)
