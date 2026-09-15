// Unit tests for the refund/dispute decision logic in `lib/orders/refund.ts`
// and the terminal-status guard in `lib/orders/terminalStatus.ts`. Same
// runner-free style as the other suites: assert loudly, exit non-zero on any
// failure. Run with `npx tsx scripts/test-refund-classification.ts`.
//
// Why this file exists: until 2026-09-15 a refund moved the money and nothing
// else. Stripe was not subscribed to the event, the webhook had no branch for
// it, and `kit_orders.status = 'refunded'` had no writer anywhere — while the
// account page already rendered a label for it. Proven on a live £99 order:
// refunded at 01:20:06, and eighteen minutes later the app still said
// `dispatched` with a kit in the post (S2-9 in qa/direction-f-migration-audit.md).
//
// What these assertions protect, specifically:
//   (1) FULL and PARTIAL are separated by arithmetic, because `charge.refunded`
//       carries no field that says which. Getting this wrong in the partial
//       direction marks a live order refunded, hides it, and cancels a retest
//       the customer is still owed — and the T&Cs SELL that partial refund
//       ("you can ask us to refund the retest portion instead of banking it"),
//       so it is a supported path, not an edge case.
//   (2) A zero-amount charge does not read as "fully refunded" on `0 >= 0`.
//   (3) EVERY bundle_dispatches status is classified. A new value added to the
//       DB CHECK constraint without being classified here fails this suite
//       rather than silently defaulting to "leave it running" — the
//       unclassified branch is the one that keeps spending money.
//   (4) EVERY order_status is classified terminal or not, and the three
//       endings are terminal. An ending that stops being guarded is erased by
//       the next lab callback, silently.

import {
  isFullRefund,
  isPartialRefund,
  shouldCancelDispatch,
  CANCELLABLE_DISPATCH_STATUSES,
  UNCANCELLABLE_DISPATCH_STATUSES,
} from '../lib/orders/refund'
import {
  isTerminalOrderStatus,
  TERMINAL_ORDER_STATUSES,
  TERMINAL_ORDER_STATUSES_SQL_LIST,
} from '../lib/orders/terminalStatus'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`  [FAIL] ${label}`)
  }
}

/* The bundle_dispatches CHECK constraint as it exists in Postgres
   (database/migrations/20260725_bundle_dispatches.sql). Mirrored rather than
   imported because the generated types widen this column to plain `string` —
   so the mirror is GUARDED by test (3) below. */
const BUNDLE_DISPATCH_STATUSES = [
  'scheduled',
  'trigger_met',
  'awaiting_window',
  'dispatched',
  'not_needed',
  'cancelled',
] as const

/* The order_status enum as it exists in Postgres, in order. Same mirroring
   rationale as scripts/test-vitall-already-dispatched.ts. */
const ORDER_STATUS_ENUM = [
  'pending',
  'paid',
  'dispatched',
  'sample_registered',
  'processing',
  'results_received',
  'cancelled',
  'refunded',
  'sample_failed',
  'on_hold',
  'data_purged',
] as const

console.log('\nRefund classification + terminal-status guard\n')

// ── (1) Full vs partial ────────────────────────────────────────────────────

// The live case this whole path was built from: Gate 3, £99 in, £99 back.
check(
  'the live Gate 3 refund (£99 of £99) is FULL',
  isFullRefund({ amount: 9900, amount_refunded: 9900 }) === true,
)
check(
  'the live Gate 3 refund is not also partial',
  isPartialRefund({ amount: 9900, amount_refunded: 9900 }) === false,
)

// The case the T&Cs sell: the retest portion of a bundle refunded on its own.
check(
  'a bundle retest-portion refund (£20 of £179) is PARTIAL',
  isPartialRefund({ amount: 17900, amount_refunded: 2000 }) === true,
)
check(
  'a bundle retest-portion refund is NOT full — the order stays live',
  isFullRefund({ amount: 17900, amount_refunded: 2000 }) === false,
)

// A penny short is still not a full refund. This is the boundary that decides
// whether an order is hidden from its owner.
check(
  'one penny short of the full amount is partial, not full',
  isFullRefund({ amount: 9900, amount_refunded: 9899 }) === false &&
    isPartialRefund({ amount: 9900, amount_refunded: 9899 }) === true,
)

// Two partials that together clear the charge. `amount_refunded` is cumulative,
// so the second event must read as full even though its own refund was partial.
check(
  'cumulative partials reaching the total read as FULL',
  isFullRefund({ amount: 17900, amount_refunded: 17900 }) === true,
)

// Defensive: an over-refund must not read as "partial" and leave the order live.
check(
  'an over-refund reads as full, never as partial',
  isFullRefund({ amount: 9900, amount_refunded: 10000 }) === true &&
    isPartialRefund({ amount: 9900, amount_refunded: 10000 }) === false,
)

// ── (2) Nothing refunded ───────────────────────────────────────────────────

check(
  'a charge with nothing refunded is neither full nor partial',
  isFullRefund({ amount: 9900, amount_refunded: 0 }) === false &&
    isPartialRefund({ amount: 9900, amount_refunded: 0 }) === false,
)
check(
  'a zero-amount charge does not read as fully refunded on 0 >= 0',
  isFullRefund({ amount: 0, amount_refunded: 0 }) === false,
)
check(
  'a negative amount_refunded (reversal) is not a refund',
  isFullRefund({ amount: 9900, amount_refunded: -100 }) === false &&
    isPartialRefund({ amount: 9900, amount_refunded: -100 }) === false,
)

// full and partial are mutually exclusive across the whole grid.
for (const amount of [0, 1, 2000, 9900, 17900]) {
  for (const refunded of [-1, 0, 1, 1999, 2000, 9899, 9900, 17900, 20000]) {
    const charge = { amount, amount_refunded: refunded }
    check(
      `full/partial are mutually exclusive for amount=${amount} refunded=${refunded}`,
      !(isFullRefund(charge) && isPartialRefund(charge)),
    )
  }
}

// ── (3) Owed second kits ───────────────────────────────────────────────────

const classifiedDispatch = [...CANCELLABLE_DISPATCH_STATUSES, ...UNCANCELLABLE_DISPATCH_STATUSES]
check(
  `every bundle_dispatches status is classified — constraint has ${BUNDLE_DISPATCH_STATUSES.length}, lists cover ${classifiedDispatch.length}`,
  classifiedDispatch.length === BUNDLE_DISPATCH_STATUSES.length,
)
check(
  'no bundle_dispatches status is classified twice',
  new Set(classifiedDispatch).size === classifiedDispatch.length,
)
for (const status of BUNDLE_DISPATCH_STATUSES) {
  check(
    `'${status}' appears in exactly one dispatch classification list`,
    classifiedDispatch.includes(status as never),
  )
}
for (const status of classifiedDispatch) {
  check(
    `'${status}' is a real bundle_dispatches status (not a typo)`,
    (BUNDLE_DISPATCH_STATUSES as readonly string[]).includes(status),
  )
}

for (const status of CANCELLABLE_DISPATCH_STATUSES) {
  check(`a refund cancels an owed kit at '${status}'`, shouldCancelDispatch(status) === true)
}
for (const status of UNCANCELLABLE_DISPATCH_STATUSES) {
  check(`a refund leaves '${status}' alone`, shouldCancelDispatch(status) === false)
}

// The one that costs real money if it regresses: a bundle refunded the day
// after purchase, second kit still sitting at 'scheduled'.
check(
  "the money case — a 'scheduled' second kit is stopped by a refund",
  shouldCancelDispatch('scheduled') === true,
)
// And the one that would falsify the record if it regressed the other way.
check(
  "a kit already posted ('dispatched') is NOT retroactively cancelled",
  shouldCancelDispatch('dispatched') === false,
)

// ── (4) Terminal statuses ──────────────────────────────────────────────────

for (const status of TERMINAL_ORDER_STATUSES) {
  check(
    `'${status}' is a real order_status value (not a typo)`,
    (ORDER_STATUS_ENUM as readonly string[]).includes(status),
  )
  check(`'${status}' is terminal`, isTerminalOrderStatus(status) === true)
}

/* The expectation, restated independently of the module under test.
   Deriving this list by filtering the enum with TERMINAL_ORDER_STATUSES — the
   obvious way to write it — produces a test that CANNOT FAIL: drop a status
   from the terminal set and it silently moves to the pipeline side, so the
   arithmetic still balances and every loop still passes. Caught by running the
   suite against a deliberately broken terminal set (control 3, 2026-09-15): it
   should have raised two failures and raised one. A test whose expected value
   is computed from the thing it is testing asserts only that the code equals
   itself. */
const EXPECTED_TERMINAL = ['refunded', 'cancelled', 'data_purged']
const EXPECTED_PIPELINE = [
  'pending',
  'paid',
  'dispatched',
  'sample_registered',
  'processing',
  'results_received',
  'sample_failed',
  'on_hold',
]

check(
  `the terminal set is exactly the ${EXPECTED_TERMINAL.length} endings — got [${[...TERMINAL_ORDER_STATUSES].join(', ')}]`,
  TERMINAL_ORDER_STATUSES.length === EXPECTED_TERMINAL.length &&
    EXPECTED_TERMINAL.every((s) => (TERMINAL_ORDER_STATUSES as readonly string[]).includes(s)),
)
for (const status of EXPECTED_PIPELINE) {
  check(`'${status}' is a pipeline stage, not an ending`, isTerminalOrderStatus(status) === false)
}
check(
  `every order_status is classified — enum has ${ORDER_STATUS_ENUM.length}, expectations cover ${EXPECTED_TERMINAL.length + EXPECTED_PIPELINE.length}`,
  EXPECTED_TERMINAL.length + EXPECTED_PIPELINE.length === ORDER_STATUS_ENUM.length &&
    ORDER_STATUS_ENUM.every((s) =>
      [...EXPECTED_TERMINAL, ...EXPECTED_PIPELINE].includes(s),
    ),
)

// The specific regression: the lab reporting results on a refunded order.
check(
  "'refunded' blocks a late 'results-available' callback",
  isTerminalOrderStatus('refunded') === true,
)
check(
  "'sample_failed' does NOT block — it is a lab outcome, not an ending",
  isTerminalOrderStatus('sample_failed') === false,
)

// The SQL list is built from the array, so it cannot protect fewer statuses
// than the array names — assert the shape PostgREST actually needs.
check(
  'the PostgREST list is parenthesised',
  TERMINAL_ORDER_STATUSES_SQL_LIST.startsWith('(') && TERMINAL_ORDER_STATUSES_SQL_LIST.endsWith(')'),
)
for (const status of TERMINAL_ORDER_STATUSES) {
  check(
    `the PostgREST list quotes '${status}'`,
    TERMINAL_ORDER_STATUSES_SQL_LIST.includes(`"${status}"`),
  )
}
check(
  'the PostgREST list names every terminal status and nothing else',
  TERMINAL_ORDER_STATUSES_SQL_LIST.split(',').length === TERMINAL_ORDER_STATUSES.length,
)

console.log(`\ntest-refund-classification: ${passes} passed, ${failures} failed\n`)
process.exit(failures > 0 ? 1 : 0)
