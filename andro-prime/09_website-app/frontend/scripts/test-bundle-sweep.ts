// Unit tests for the bundle mechanism's pure decision logic. Same runner-free
// style as the other suites: assert loudly, exit non-zero on any failure. Run
// with `npx tsx scripts/test-bundle-sweep.ts`.
//
// Covers:
//   (1) shouldTriggerConfirmation bands (the Ewa threshold line): only low (< 12)
//       triggers, >= 12 (borderline 12–<15 or all-clear >=15) banks.
//   (2) The sweep state-machine predicates: isTriggerMatured, needsAddressCheck,
//       isWindowElapsed — with a fixed clock, no DB.
//   (3) The soft-window arithmetic: addressWindowEndsAt.

import { shouldTriggerConfirmation, ADDRESS_CHECK_WINDOW_DAYS } from '../lib/bundles/config'
import {
  isTriggerMatured,
  needsAddressCheck,
  isWindowElapsed,
  addressWindowEndsAt,
  type BundleDispatchRow,
} from '../lib/bundles/sweep'

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

// A fixed reference instant so every transition is deterministic (no Date.now()).
const NOW = new Date('2026-07-24T12:00:00.000Z')

// Build a bundle_dispatches row fixture, overriding only what a test cares about.
function makeRow(overrides: Partial<BundleDispatchRow>): BundleDispatchRow {
  return {
    id: 'bundle-1',
    parent_order_id: 'order-1',
    user_id: 'user-1',
    kit_type: 'energy-recovery',
    bundle_type: 'prove_it',
    status: 'scheduled',
    due_at: null,
    triggered_at: null,
    address_check_at: null,
    second_order_id: null,
    // Added by the membership_v1 migration, which generalised this table from
    // "the second kit of a bundle" to "a kit owed to a user at a future date".
    // A bundle row is source 'bundle' with no membership; a membership retest
    // is the mirror image. The sweep reads both.
    source: 'bundle',
    membership_id: null,
    created_at: NOW.toISOString(),
    updated_at: NOW.toISOString(),
    ...overrides,
  }
}

// (1) shouldTriggerConfirmation bands. Boundary is < 12 (BORDERLINE_T_FLOOR),
// aligned to the GP-referral low-T threshold: only a LOW first reading triggers the
// recheck; >= 12 (borderline 12–<15 or all-clear >=15) banks. Aligned 2026-07-25.
check('(1) 11.9 (just under 12) -> triggers', shouldTriggerConfirmation(11.9) === true)
check('(1) 11 (low) -> triggers', shouldTriggerConfirmation(11) === true)
check('(1) 12 (boundary) -> does NOT trigger (banks)', shouldTriggerConfirmation(12) === false)
check('(1) 14.9 (borderline top) -> does NOT trigger (banks)', shouldTriggerConfirmation(14.9) === false)
check('(1) 15 (all-clear floor) -> does NOT trigger (banks)', shouldTriggerConfirmation(15) === false)
check('(1) 20 (clearly normal) -> does NOT trigger', shouldTriggerConfirmation(20) === false)

// (2a) isTriggerMatured — scheduled + due_at reached.
check(
  '(2a) scheduled + due_at in the past -> matured',
  isTriggerMatured(makeRow({ status: 'scheduled', due_at: '2026-07-23T12:00:00.000Z' }), NOW) === true,
)
check(
  '(2a) scheduled + due_at exactly now -> matured (<=)',
  isTriggerMatured(makeRow({ status: 'scheduled', due_at: NOW.toISOString() }), NOW) === true,
)
check(
  '(2a) scheduled + due_at in the future -> NOT matured',
  isTriggerMatured(makeRow({ status: 'scheduled', due_at: '2026-07-25T12:00:00.000Z' }), NOW) === false,
)
check(
  '(2a) scheduled + null due_at (Confirmation awaiting result) -> NOT matured',
  isTriggerMatured(makeRow({ status: 'scheduled', due_at: null }), NOW) === false,
)
check(
  '(2a) already trigger_met + due_at past -> NOT re-matured (idempotent)',
  isTriggerMatured(makeRow({ status: 'trigger_met', due_at: '2026-07-23T12:00:00.000Z' }), NOW) === false,
)

// (2b) needsAddressCheck — only rows in trigger_met.
check('(2b) trigger_met -> needs address check', needsAddressCheck(makeRow({ status: 'trigger_met' })) === true)
check('(2b) awaiting_window -> does NOT need address check', needsAddressCheck(makeRow({ status: 'awaiting_window' })) === false)
check('(2b) scheduled -> does NOT need address check', needsAddressCheck(makeRow({ status: 'scheduled' })) === false)

// (3) addressWindowEndsAt — send time + ADDRESS_CHECK_WINDOW_DAYS.
const sentAt = '2026-07-20T12:00:00.000Z'
const expectedEnd = new Date(new Date(sentAt).getTime() + ADDRESS_CHECK_WINDOW_DAYS * DAY_MS)
check(
  '(3) window ends at address_check_at + ADDRESS_CHECK_WINDOW_DAYS',
  addressWindowEndsAt(makeRow({ address_check_at: sentAt }))?.getTime() === expectedEnd.getTime(),
)
check('(3) null address_check_at -> null window end', addressWindowEndsAt(makeRow({ address_check_at: null })) === null)

// (2c) isWindowElapsed — awaiting_window + window elapsed since the email.
// With a 4-day window: sent 5 days ago -> elapsed; sent 1 day ago -> not yet.
const fiveDaysAgo = new Date(NOW.getTime() - 5 * DAY_MS).toISOString()
const oneDayAgo = new Date(NOW.getTime() - 1 * DAY_MS).toISOString()
// Exactly the window edge: sent ADDRESS_CHECK_WINDOW_DAYS ago -> elapsed (<=).
const exactlyWindowAgo = new Date(NOW.getTime() - ADDRESS_CHECK_WINDOW_DAYS * DAY_MS).toISOString()
check(
  '(2c) awaiting_window + sent 5d ago (>4d window) -> elapsed',
  isWindowElapsed(makeRow({ status: 'awaiting_window', address_check_at: fiveDaysAgo }), NOW) === true,
)
check(
  '(2c) awaiting_window + sent exactly the window ago -> elapsed (<=)',
  isWindowElapsed(makeRow({ status: 'awaiting_window', address_check_at: exactlyWindowAgo }), NOW) === true,
)
check(
  '(2c) awaiting_window + sent 1d ago (<4d window) -> NOT elapsed',
  isWindowElapsed(makeRow({ status: 'awaiting_window', address_check_at: oneDayAgo }), NOW) === false,
)
check(
  '(2c) awaiting_window + no address_check_at -> NOT elapsed',
  isWindowElapsed(makeRow({ status: 'awaiting_window', address_check_at: null }), NOW) === false,
)
check(
  '(2c) already dispatched + sent 5d ago -> NOT elapsed (idempotent)',
  isWindowElapsed(makeRow({ status: 'dispatched', address_check_at: fiveDaysAgo }), NOW) === false,
)

if (failures > 0) {
  console.error(`\n${failures} bundle-sweep assertion(s) failed (${passes} passed).`)
  process.exit(1)
}
console.log(`\nAll ${passes} bundle-sweep assertion(s) passed.`)
process.exit(0)
