// Unit tests for the repeat-dispatch guard in `lib/vitall/dispatchKit.ts`.
// Same runner-free style as the other suites: assert loudly, exit non-zero on
// any failure. Run with `npx tsx scripts/test-vitall-already-dispatched.ts`.
//
// Why this file exists: until 2026-09-15 the dispatch path had no idempotency
// guard at all. It read the order, called Vitall, and set `status: 'dispatched'`
// unconditionally, so a second invocation with the same orderId created a second
// Vitall order — a second physical box, a second lab fee, a second
// `kit_dispatched` event. At the time it was a PUBLIC, unauthenticated HTTP
// endpoint (`POST /api/vitall/dispatch`), so "only our own code calls it" was
// never a control. That route has since been removed and its body moved into
// `lib/vitall/dispatchKit.ts` (S2-2 in qa/direction-f-migration-audit.md), which
// closes the door — but the guard stays, because a caller bug, a Stripe webhook
// retry or a bundle-sweep retry can still ask twice.
//
// What these assertions protect, specifically:
//   (1) EVERY status in the `order_status` enum is classified. A twelfth value
//       added to the DB without being classified here fails this suite rather
//       than silently defaulting to "dispatch it" — which is the dangerous
//       default, because the unclassified branch is the one that spends money.
//   (2) `status === 'dispatched'` is not the test. An order at
//       `results_received` has been through the lab and must not be re-sent.
//   (3) `vitall_order_id` alone is enough, whatever the status says. Six of the
//       seven `results_received` rows in production carry no id, so neither
//       signal is complete on its own and either must be sufficient.
//   (4) The only state that dispatches is a paid order with no Vitall id.

import {
  isAlreadyDispatched,
  ALREADY_DISPATCHED_STATUSES,
  NOT_YET_DISPATCHED_STATUSES,
} from '../lib/vitall/alreadyDispatched'

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

/* The enum as it exists in Postgres, in order. Mirrored rather than imported
   because it is a DB type and this is a plain script — so the mirror is GUARDED
   by test (1) below: the two classification lists must together equal this list
   exactly, which is what makes a new enum value fail loudly here. */
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

console.log('\nRepeat-dispatch guard\n')

// (1) Every enum value is classified exactly once.
const classified = [...ALREADY_DISPATCHED_STATUSES, ...NOT_YET_DISPATCHED_STATUSES]
check(
  `every order_status is classified — enum has ${ORDER_STATUS_ENUM.length}, lists cover ${classified.length}`,
  classified.length === ORDER_STATUS_ENUM.length,
)
check(
  'no status is classified twice',
  new Set(classified).size === classified.length,
)
for (const status of ORDER_STATUS_ENUM) {
  check(`'${status}' appears in exactly one classification list`, classified.includes(status as never))
}
for (const status of classified) {
  check(
    `'${status}' is a real order_status value (not a typo)`,
    (ORDER_STATUS_ENUM as readonly string[]).includes(status),
  )
}

// (2) Post-dispatch statuses block, with no Vitall id present.
for (const status of ALREADY_DISPATCHED_STATUSES) {
  check(
    `'${status}' blocks a repeat dispatch even with no vitall_order_id`,
    isAlreadyDispatched({ status, vitall_order_id: null }) === true,
  )
}

// (3) A Vitall id blocks regardless of status — including 'paid'.
for (const status of ORDER_STATUS_ENUM) {
  check(
    `'${status}' + a vitall_order_id blocks`,
    isAlreadyDispatched({ status, vitall_order_id: 'vit_abc123' }) === true,
  )
}

// (4) Only an un-dispatched status with no id is allowed through.
for (const status of NOT_YET_DISPATCHED_STATUSES) {
  check(
    `'${status}' with no vitall_order_id does NOT block`,
    isAlreadyDispatched({ status, vitall_order_id: null }) === false,
  )
}

// The live callers both insert `status: 'paid'`, so this is the path that must
// stay open or every real purchase stops shipping.
check(
  "the live path — 'paid' with no vitall_order_id — dispatches",
  isAlreadyDispatched({ status: 'paid', vitall_order_id: null }) === false,
)

// An empty string is not an id. Postgres `text` is nullable here, and a blank
// would otherwise read as truthy-adjacent to a careless check.
check(
  "an empty vitall_order_id is not treated as dispatched",
  isAlreadyDispatched({ status: 'paid', vitall_order_id: '' }) === false,
)

console.log(`\ntest-vitall-already-dispatched: ${passes} passed, ${failures} failed\n`)
process.exit(failures > 0 ? 1 : 0)
