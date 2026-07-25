// Unit tests for the Confirmation-bundle result decision (resolveConfirmationOutcome).
// Same runner-free style as the other suites: assert loudly, exit non-zero on any
// failure. Run with `npm test` or `npx tsx scripts/test-bundle-confirmation.ts`.
//
// Covers the two branches of the pure decision function (DB-free):
//   (1) trigger (< 12 nmol/L, aligned to the GP-referral low-T threshold): triggeredAt = asOf ISO, dueAt = asOf + interval days.
//   (2) bank    (>= 12 nmol/L, i.e. borderline 12–<15 or all-clear >=15): triggeredAt = null, dueAt = asOf + 6 months, with
//       correct month arithmetic across a year boundary.
//   (3) ISO string shapes on both branches.

import { resolveConfirmationOutcome } from '../lib/bundles/confirmation'
import { CONFIRMATION_INTERVAL_DAYS, BANK_RECHECK_MONTHS } from '../lib/bundles/config'

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
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

// A fixed reference instant so every expected date is deterministic (no
// Date.now()). 2026-09-15T00:00:00Z — chosen so the +6-month bank date crosses
// the year boundary into 2027.
const AS_OF = new Date('2026-09-15T00:00:00.000Z')

function expectedTriggerDueIso(asOf: Date): string {
  const due = new Date(asOf)
  due.setDate(due.getDate() + CONFIRMATION_INTERVAL_DAYS)
  return due.toISOString()
}
function expectedBankDueIso(asOf: Date): string {
  const due = new Date(asOf)
  due.setMonth(due.getMonth() + BANK_RECHECK_MONTHS)
  return due.toISOString()
}

// (1) trigger branch — low (< 12, aligned to the GP-referral low-T threshold).
// triggeredAt set, dueAt = asOf + CONFIRMATION_INTERVAL_DAYS. 8, 11, 11.9 (just under 12).
for (const value of [8, 11, 11.9]) {
  const outcome = resolveConfirmationOutcome(value, AS_OF)
  check(`(1) ${value} -> kind 'trigger'`, outcome.kind === 'trigger')
  check(`(1) ${value} -> triggeredAt = asOf ISO`, outcome.triggeredAt === AS_OF.toISOString())
  check(`(1) ${value} -> dueAt = asOf + ${CONFIRMATION_INTERVAL_DAYS} days`, outcome.dueAt === expectedTriggerDueIso(AS_OF))
  check(`(1) ${value} -> triggeredAt is ISO string`, typeof outcome.triggeredAt === 'string' && ISO_RE.test(outcome.triggeredAt))
  check(`(1) ${value} -> dueAt is ISO string`, ISO_RE.test(outcome.dueAt))
}

// (2) bank branch — not low (>= 12): borderline 12–<15 AND all-clear >=15.
// triggeredAt null, dueAt = asOf + 6 months. 12 (boundary banks), 14.9 (borderline top), 15, 20.
for (const value of [12, 14.9, 15, 20]) {
  const outcome = resolveConfirmationOutcome(value, AS_OF)
  check(`(2) ${value} -> kind 'bank'`, outcome.kind === 'bank')
  check(`(2) ${value} -> triggeredAt = null`, outcome.triggeredAt === null)
  check(`(2) ${value} -> dueAt = asOf + ${BANK_RECHECK_MONTHS} months`, outcome.dueAt === expectedBankDueIso(AS_OF))
  check(`(2) ${value} -> dueAt is ISO string`, ISO_RE.test(outcome.dueAt))
}

// (2b) explicit month-arithmetic-across-year-end check: 2026-09-15 + 6mo = 2027-03-15.
// Assert on the calendar DATE, not the exact instant: setMonth advances in local
// time (mirroring retestDueAtUnix), so a DST boundary between Sep and Mar can shift
// the wall-clock hour by one. The date landing on 2027-03-15 is what the spec pins
// (the sweep compares due_at months out, so an hour is immaterial).
{
  const outcome = resolveConfirmationOutcome(20, new Date('2026-09-15T00:00:00.000Z'))
  check('(2b) 2026-09-15 + 6mo banks to the 2027-03-15 date', outcome.dueAt.startsWith('2027-03-15'))
}

// (3) with the default interval (0) the trigger dueAt equals asOf exactly — a
// sanity check that guards against an accidental non-zero default drift.
{
  const outcome = resolveConfirmationOutcome(11, AS_OF)
  check(
    '(3) default interval 0 -> trigger dueAt === asOf',
    CONFIRMATION_INTERVAL_DAYS !== 0 ||
      new Date(outcome.dueAt).getTime() === AS_OF.getTime(),
  )
  check(
    '(3) trigger dueAt >= asOf (interval never negative)',
    new Date(outcome.dueAt).getTime() >= AS_OF.getTime(),
  )
  check(
    '(3) trigger dueAt = asOf + interval days (ms match)',
    new Date(outcome.dueAt).getTime() === AS_OF.getTime() + CONFIRMATION_INTERVAL_DAYS * DAY_MS,
  )
}

if (failures > 0) {
  console.error(`\n${failures} bundle-confirmation assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} bundle-confirmation assertion(s) passed.`)
process.exit(0)
