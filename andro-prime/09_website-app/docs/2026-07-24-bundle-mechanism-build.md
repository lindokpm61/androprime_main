# Two-kit bundle mechanism — build record

_Date: 2026-07-24. Status: **code COMPLETE + verified, dark behind `BUNDLES_ENABLED`, uncommitted**. Nothing deployed, nothing applied to any DB. Owner: 09_website-app._

Implements the plan at `your-read-is-correct-jazzy-catmull.md` (route-to-implementation, 2026-07-24). This doc is the durable build record; live/dated status lives in `STATE.md` — read that first for what is currently owed before the flag can flip.

---

## 1. Architecture

**One insight makes this a small build:** Andro Prime already controls when every order reaches Vitall. Vitall never sees the Stripe payment — our system calls Vitall's `/order/create` once per kit, whenever we choose. A bundle is just two ordinary Vitall orders placed ~11–13 weeks apart, manufactured entirely in our own processes.

The mechanism is three pieces on top of the existing single-kit flow:

1. **One new table** (`bundle_dispatches`) records the *owed second kit* — a row per bundle purchase, holding its state machine position.
2. **One daily sweep** (`/api/jobs/bundle-sweep`, QStash-scheduled) advances every row's state machine each run: matures due rows, sends the address-check email, and performs the second dispatch once the soft window elapses.
3. **One result hook** (in `processVitallResult`) resolves the Confirmation bundle's outcome — trigger the retest, or bank it — when the first result lands.

**The second dispatch reuses `/api/vitall/dispatch` verbatim** (no fork, no new Vitall integration code). That route already resolves the patient's *current* address at call time and inserts into `kit_orders`, so:

- a customer who updates their address during the soft address-check window is handled with zero extra code
- the second kit is created as an ordinary new `kit_orders` row (`stripe_payment_intent` left null — the shared bundle payment lives on the parent order; the row-to-row linkage is `bundle_dispatches`, not a second charge)

## 2. Data model — `bundle_dispatches`

Migration: `database/migrations/20260725_bundle_dispatches.sql` (+ supabase-mirrored copy via `scripts/sync-supabase-migrations.ps1`). **Not applied to any DB yet.**

| column | purpose |
| --- | --- |
| `id` | uuid pk |
| `parent_order_id` → `kit_orders(id)` | the first kit's order |
| `user_id` → `users(id)` | denormalised for RLS (authenticated read own rows) |
| `kit_type` (`public.kit_type`) | the **second** kit to ship — may differ from the base kit (Full-picture ships a Kit 2 off a Kit 3 base) |
| `bundle_type` | `'confirmation' \| 'prove_it' \| 'full_picture'` |
| `status` | state machine, see below |
| `due_at` | timed bundles: purchase + ~90d. Confirmation: null until the first result |
| `triggered_at` | when the trigger was satisfied |
| `address_check_at` | when the address-check email was sent — starts the soft window |
| `second_order_id` → `kit_orders(id)` | the second kit's order row, created at dispatch |
| `created_at` / `updated_at` | |

RLS: authenticated users read their own rows; every write goes through the service-role admin client (Stripe webhook + sweep + the ops cancel script), so there is deliberately no insert/update policy.

### State machine

`scheduled` → `trigger_met` → `awaiting_window` → `dispatched` (terminals: `not_needed` — reserved for forward-compat, unused today — and `cancelled`).

- **`scheduled`**: created at purchase. Timed bundles (Prove-It, Full-picture) carry `due_at = purchase + 90d`. Confirmation carries `due_at = null` until the result hook fires.
- **`trigger_met`**: the daily sweep flips a `scheduled` row here once `due_at <= now`.
- On entering `trigger_met`, the sweep sends the CIO `bundle_address_check` event and stamps `address_check_at`, moving the row to **`awaiting_window`**.
- **`awaiting_window` → `dispatched`**: once `address_check_at + ADDRESS_CHECK_WINDOW_DAYS (4) <= now`, the sweep performs the second dispatch (see §4) and marks the row `dispatched`.
- **Confirmation all-clear (bank path)**: the result hook sets `due_at = result + BANK_RECHECK_MONTHS (6mo)` and leaves `status = 'scheduled'` — the same sweep dispatches the banked kit at the recheck. No separate code path.
- **Manual refund-on-request**: any open (non-dispatched) row can be flipped to `cancelled` via `scripts/ops/cancel-bundle.ts <bundle_dispatch_id>` (refuses if the row is already `dispatched` or `cancelled`, guards the update on the status it just read so a concurrent sweep run can't be silently clobbered). Run **after** the manual £70 Stripe refund. See §5.

## 3. The three SKUs

| Bundle | Base kit (ships immediately) | Second kit (owed) | Trigger | Price | Ewa gate |
| --- | --- | --- | --- | --- | --- |
| **Confirmation** (customer-facing: **Recheck Bundle**) | Kit 1 — testosterone | Kit 1 retest (£70 portion) | **Result** — first testosterone result low (`shouldTriggerConfirmation`, t < 12 nmol/L; aligned to GP-referral low-T 2026-07-25) | £169 | Threshold + `CONFIRMATION_INTERVAL_DAYS` |
| **Prove-It** *(flagship)* | Kit 2 — energy-recovery | Kit 2 retest (£80 portion) | **Timed** — day ~90 | £199 | Day-90 interval |
| **Full-picture** | Kit 3 — hormone-recovery | **Kit 2** retest (£80 portion) | **Timed** — day ~90 | £259 | Day-90 interval |

Source of truth: `lib/bundles/config.ts` (`BUNDLE_CONFIG`). Every price is a single env var per SKU (`STRIPE_PRICE_BUNDLE_CONFIRMATION` / `_PROVEIT` / `_FULLPICTURE`), so the working prices (£169/£199/£259 — accepted 2026-07-21 to unblock build + modelling, pending the Van Westendorp WTP read) are a one-line reprice, not a code change.

Key constants (all in `lib/bundles/config.ts`, each a single reviewable line for sign-off):

- `shouldTriggerConfirmation(testosteroneValue)` — `value < BORDERLINE_T_FLOOR` (12 nmol/L), aligned to the signed-off GP-referral low-T threshold. **Ewa sign-off 2026-07-25 (Keith relay).** Was `< BORDERLINE_T_CEILING` (15); borderline 12–<15 now banks instead of triggering.
- `CONFIRMATION_INTERVAL_DAYS = 0` — gap between the first result and the confirmatory second dispatch once triggered. Default 0 = due immediately at trigger time. BSSM-style two-sample confirmation implies a minimum gap between samples, so Ewa's sign-off maps to editing this one constant, not a redesign. **Pending Ewa sign-off.**
- `SECOND_DISPATCH_DELAY_DAYS = 90` — Prove-It / Full-picture timed interval. **Pending Ewa sign-off.**
- `BANK_RECHECK_MONTHS = 6` — bank-path recheck window.
- `ADDRESS_CHECK_WINDOW_DAYS = 4` — soft address-confirmation grace period.

## 4. Checkout, webhook, result hook

- **Checkout** (`app/api/checkout/kit/route.ts`): accepts an optional `bundle` param. `resolveBundleCheckout` (`lib/bundles/checkout.ts`) gates on `BUNDLES_ENABLED`, validates the bundle type, and checks the requested `kitType` matches that bundle's base kit. On success, the route resolves `process.env[bundleConfig.stripePriceEnv]` as the Stripe price and adds `bundle_type` + `second_kit_type` to the Stripe metadata — **`kit_type` in metadata stays the base kit**, so the existing first-kit insert + dispatch flow in the webhook is completely untouched. One line item, one payment, `mode: 'payment'` throughout.
- **Stripe webhook** (`app/api/webhooks/stripe/route.ts`): after inserting kit 1 and triggering its dispatch (unchanged), if `metadata.bundle_type` is present and `BUNDLES_ENABLED`, `createBundleDispatch` inserts the `bundle_dispatches` row. `computeBundleDueAt` (`lib/bundles/checkout.ts`) returns `null` for Confirmation (result-triggered) or `now + 90d` for the timed bundles.
- **Result hook** (`lib/results/processResult.ts`, ~line 281): after biomarkers are inserted, looks up an open Confirmation `bundle_dispatches` row for the order. `resolveConfirmationOutcome` (`lib/bundles/confirmation.ts`, pure/DB-free, unit tested with a fixed clock) returns either:
  - `kind: 'trigger'` — `triggered_at = now`, `due_at = now + CONFIRMATION_INTERVAL_DAYS`, row stays `scheduled` for the sweep to mature.
  - `kind: 'bank'` — `triggered_at = null`, `due_at = now + BANK_RECHECK_MONTHS`, row stays `scheduled`.

  The hook only ever *sets dates* — it never dispatches or emails. All dispatch/email side effects live in the sweep.

- **Second dispatch** (`lib/bundles/dispatch.ts`, `dispatchSecondKit`): builds a fresh address snapshot from the user's current address columns (not the original order snapshot), inserts a new `kit_orders` row (`status: 'paid'`, no `stripe_payment_intent`), links `second_order_id` back onto the bundle row **before** calling Vitall (so an ambiguous Vitall outcome plus a retry can never double-ship), then `POST /api/vitall/dispatch` and only marks the bundle `dispatched` on a 2xx response. Any failure leaves the row in `awaiting_window` so the next daily sweep retries — idempotent by construction (reuses an existing `second_order_id` if one was already created).

## 5. Bank-not-refund decision + refund-on-request ops path

**Decision (2026-07-24):** on a Confirmation all-clear first result, the default is to **bank** the prepaid second kit (reschedule it to auto-dispatch at the 6-month recheck), not refund it. Auto-refunding the £70 second-test portion loses the Stripe processing fee on the full £169 bundle, dropping contribution to ~£36 — below the £38 a single Kit 1 already contributes. Banking keeps contribution at ~£48 with COGS deferred, and reuses the same sweep with no new automated refund code.

**Caveat — refund-on-request is honoured no-questions-asked.** If a customer emails asking for a refund of the second-kit portion:

1. Support issues a **manual** Stripe refund of the £70 second-test portion (no automated refund code exists or is planned for this path).
2. Support runs `npx tsx scripts/ops/cancel-bundle.ts <bundle_dispatch_id>` to flip the row to `cancelled` so the sweep never dispatches it. The script refuses if the row is already `dispatched` (already shipped — a separate manual decision) or already `cancelled`.

This stays a deliberate human ops path, not automation — low volume, human-triggered, and it is the only way an owed kit gets cancelled today (the `not_needed` status exists in the schema for a possible future explicit off-ramp but nothing in code sets it yet).

## 6. Feature flag

Everything is gated behind `BUNDLES_ENABLED` (`lib/flags.ts`, `isBundlesEnabled()`, reads `process.env.BUNDLES_ENABLED === 'true'`), mirroring the existing `isRetestReminderEnabled()` pattern. Flag off:

- kit detail pages render `BundleChoice` as nothing — byte-identical to today
- checkout rejects any `bundle` param with a 400
- the Stripe webhook never writes a `bundle_dispatches` row
- the result hook and the sweep both no-op (the sweep route verifies the QStash signature and returns `{ skipped: true }` without touching any row)

This lets the code sit merged and dark while solicitor, Ewa, and compliance clear their gates independently.

**Once live, never toggle `BUNDLES_ENABLED` off while any Confirmation bundle is still awaiting its first result.** The result hook fires exactly once per result (the `lab_results` idempotency check means a result is never reprocessed). If the flag is off when that one-shot event arrives, the hook is skipped and the bundle row is stranded at `scheduled` with null dates permanently, even after the flag comes back on; the owed kit would then need a manual date stamp to recover. Timed bundles (Prove-It / Full-picture) are immune: their `due_at` is stamped at purchase. Integration-verifier finding, 2026-07-24.

## 7. Go-live checklist

Same list as `STATE.md`'s bundle entry (source of truth for live status — check there for anything resolved since this doc was written):

1. Solicitor D2 gate — bundle terms incl. banked-kit 12-month validity.
2. F3/F4 ClickUp build gates (subtasks of B1 prereqs `869e74vwz`).
3. Ewa sign-off — Confirmation threshold **DONE (aligned to t<12 + Phase-0 wellness framing signed off, 2026-07-25)**; still owed: `CONFIRMATION_INTERVAL_DAYS` + the day-~90 interval.
4. Compliance pre-flight on the `BundleChoice` copy.
5. Create 3 Stripe bundle prices + populate the env vars.
6. ~~Register the QStash Schedule for `/api/jobs/bundle-sweep`.~~ **DONE 2026-07-26** (scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`).
7. ~~Build the CIO `bundle_address_check` campaign.~~ **BUILT DRAFT 2026-07-26** (campaign `24`, email action `108`, template `55`; pre-flight 0 HARD, Liquid lint 0 errors; not activated).
8. Confirm/build the address-update surface the address-check email links to.
9. ~~Apply the migration to a live/staging DB.~~ **DONE 2026-07-26** (live Supabase `androprime`/`phqrjtnflovicgkngieu`; table + RLS + policy + indexes + trigger verified).
10. Reprice, if the Van Westendorp read moves the working prices.

## 8. Operational runbook

### QStash Schedule registration

**REGISTERED 2026-07-26** (scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, POST, not paused). Registered once via the QStash Schedules API with the `QSTASH_TOKEN`:

```
Cron:        0 6 * * *            (daily, ~06:00 UTC)
Destination: POST https://andro-prime.com/api/jobs/bundle-sweep
```

The route is QStash-signature-verified (`lib/qstash/verify.ts`, same helper the results job uses). Do not use a single long QStash delay for the ~90-day timed bundles — it risks QStash's max single-message-delay cap. The sweep instead stores a date and polls daily, mirroring the retest-reminder shape (store a date, act when it arrives).

### Environment variables needed before flag-flip

- `BUNDLES_ENABLED=true` (currently unset/false everywhere)
- `STRIPE_PRICE_BUNDLE_CONFIRMATION`
- `STRIPE_PRICE_BUNDLE_PROVEIT`
- `STRIPE_PRICE_BUNDLE_FULLPICTURE`

None of the three Stripe price envs exist yet — the Stripe products/prices themselves have not been created.

### Running the test suites

Three new suites, wired into `npm test` (runs the full existing chain plus these three, in order):

```
npx tsx scripts/test-bundle-sweep.ts         # 20 assertions — state-machine transitions, window arithmetic
npx tsx scripts/test-bundle-confirmation.ts  # 27 assertions — trigger/bank resolution, threshold + date math
npx tsx scripts/test-bundle-checkout.ts      # 37 assertions — checkout validation, due_at computation
```

Or just `npm test` to run everything (classifier, consent-gate, maintenance-offer, kit-CTA, account-export, retest-reminder, then the three bundle suites). All green as of this build; `tsc --noEmit` clean.

### Manual refund-on-request

```
npx tsx scripts/ops/cancel-bundle.ts <bundle_dispatch_id>
```

Run only **after** the manual £70 Stripe refund has been issued. Prints the row before and after; refuses to touch an already-`dispatched` or already-`cancelled` row.

## 9. Critical files

- `database/migrations/20260725_bundle_dispatches.sql` (+ synced supabase copy) — new, not applied
- `lib/bundles/config.ts`, `checkout.ts`, `confirmation.ts`, `sweep.ts`, `dispatch.ts` — new
- `app/api/jobs/bundle-sweep/route.ts` — new
- `scripts/ops/cancel-bundle.ts` — new
- `scripts/test-bundle-sweep.ts`, `test-bundle-confirmation.ts`, `test-bundle-checkout.ts` — new
- `app/api/checkout/kit/route.ts` — edited (bundle param + metadata)
- `app/api/webhooks/stripe/route.ts` — edited (`createBundleDispatch`)
- `lib/results/processResult.ts` — edited (Confirmation trigger/bank hook, ~line 281)
- `components/commerce/KitCheckoutButton.tsx` + the three kit detail pages, `CheckoutDetailsForm.tsx` — edited (bundle choice + threading through the details redirect)
- `lib/flags.ts` — edited (`isBundlesEnabled`)
- `lib/supabase/types.ts` — edited (`bundle_dispatches` row type)
- Reused unchanged: `app/api/vitall/dispatch/route.ts`, `lib/vitall/client.ts`, `lib/qstash/verify.ts`, `lib/customerio/emit.ts`, `lib/results/classifier.ts`
