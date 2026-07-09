# QA: Checkout End-to-End

**Refreshed 2026-06-17 against current code.** Supersedes the April 2026 code-audit
(which predated guest checkout, live Stripe, the `/order/confirmed` success page, and
the `kit_orders` schema). This is the runbook for the live checkout E2E (ClickUp
`869d99m5a`). It is **runnable now** — it does not depend on Vitall (the one leg that
does is flagged below).

---

## The flow (what actually happens)

| # | Step | Where |
|---|------|-------|
| 1 | Customer clicks buy on a kit page | `components/commerce/KitCheckoutButton.tsx` → `POST /api/checkout/kit` |
| 2 | Route validates kit, resolves price ID + DOB/sex (18+ gate), resolves any `?discount=` coupon, creates a Stripe Checkout Session | `app/api/checkout/kit/route.ts` |
| 3 | Customer pays on Stripe-hosted Checkout (GB shipping + phone + billing collected) | Stripe |
| 4 | Stripe fires `checkout.session.completed` → signature-verified, idempotent, resolves user (logged-in / existing-by-email / **new guest** + magic-link email), mirrors PII to `users`, inserts `kit_orders` (`status='paid'`), emits CIO `purchase`, GA4 `kit_purchase`, then triggers dispatch | `app/api/webhooks/stripe/route.ts` |
| 5 | Dispatch calls Vitall `createOrder` → sets `status='dispatched'` + `vitall_order_id` | `app/api/vitall/dispatch/route.ts` |
| 6 | Customer lands on the confirmation page | `success_url = /order/confirmed?session_id=…` (cancel → `/kits`) |

**Key facts that differ from the old doc:**
- **No login required** — guest checkout is supported. `getCurrentUser()` may be null; the webhook creates an auth user from the Stripe email and sends a `guest_purchase_account_created` magic-link email.
- **DOB + sex** come from the profile or the request body. If neither has them, the route returns `{ needsDetails: true }` (200) and the frontend must collect them. Body DOB is gated at **18+**.
- **Step 5 now works** — the earlier Vitall `/order/create` 401 ("service agreement not in place") is resolved: the services agreement was executed 2026-06-02 and ordering is enabled. Live dispatch was proven end-to-end 2026-06-25 (order `322942444`), setting `status='dispatched'` + `vitall_order_id`. `triggerVitallDispatch` is still best-effort (errors are caught/logged), so a dispatch hiccup would not break the checkout — the order would simply stay at `status='paid'`. Full dispatch → results is covered by the separate live-Vitall E2E, not this one.

---

## Wiring status (verified 2026-06-17)

| Env var | Local `.env.local` | Notes |
|---|---|---|
| `STRIPE_PRICE_KIT_1/2/3` | set | **Live** price IDs (kits in live mode since 2026-05-23) |
| `STRIPE_SECRET_KEY` | set | `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | set | `whsec_…` |
| `NEXT_PUBLIC_SITE_URL` | set | drives success/cancel URLs + dispatch self-call |
| `STRIPE_COUPON_SUBSCRIBER10` / `_LAUNCHDAY10` | unset locally | **Set in prod Coolify (confirmed 2026-06-17)** → discount path is testable in prod. Local unset is fine: a bad/absent code degrades to full price by design. |

**Before running against prod, confirm in Coolify (all confirmed present 2026-06-17):** the three live `STRIPE_PRICE_KIT_*`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, both `STRIPE_COUPON_*`. Also confirm the Stripe Dashboard webhook endpoint points at `https://andro-prime.com/api/webhooks/stripe` and is subscribed to `checkout.session.completed`.

---

## Test approach (money)

Kits are in **live Stripe mode** — there is no test-card path in prod. Two clean options:

- **Real card + refund (recommended).** Buy one kit with a real card, verify, then refund the PaymentIntent in the Stripe Dashboard. Only the Stripe fee (~1.5% + 20p) is non-refundable. Note: dispatch now succeeds, so a real purchase creates a live Vitall order and a physical kit will ship — cancel the Vitall order too if you don't want a kit sent, and refunding Stripe does not cancel the lab order.
- **100%-off live coupon.** Create a one-off 100%-off coupon in the Stripe Dashboard, temporarily map it into `STRIPE_COUPON_*` (or add a throwaway code to the allowlist), and check out at £0. More setup; also exercises the discount path.

Use a real, monitored email you control (e.g. `keith+cotest@…`) so you can confirm the guest magic-link email actually arrives.

---

## Runbook — happy path (do this first)

Run once as a **guest** (most important path) and once **logged-in**.

1. Open an incognito window (guest). Go to a kit page, click buy.
2. If prompted, enter DOB (≥18) + sex → confirm it does **not** 400 and proceeds.
3. Confirm redirect to Stripe Checkout; the **amount matches** the page price (pricing-regression check, ClickUp `869d99m7a`).
4. Pay (real card). Confirm redirect to **`/order/confirmed?session_id=…`** and the page renders the confirmation.
5. **DB:** a `kit_orders` row exists for the new user — `status='paid'`, correct `kit_type`, `stripe_payment_intent` set, `shipping_address` populated.
6. **DB:** a `users` row exists with name/phone/address/DOB/sex mirrored from Stripe.
7. **Email:** the `guest_purchase_account_created` magic-link email arrives; the link logs you in.
8. **CIO:** a `purchase` event on that user; **GA4:** a `kit_purchase` event in Realtime (or the first-party `events` table).
9. **Dispatch:** logs show the dispatch call to Vitall succeeding; order flips to `status='dispatched'` with a `vitall_order_id` set. ✅ (dispatch proven live 2026-06-25, order `322942444`).
10. Repeat logged-in: the order should attach to the existing user (no new guest user, no magic-link email).

---

## Edge cases to cover

- **18+ gate:** a DOB under 18 in the body → 400 "must be 18 or over".
- **needsDetails:** logged-in user with no DOB/sex on file and none in body → `{ needsDetails: true }`, frontend collects them.
- **Cancel:** abandon Stripe Checkout → lands on `/kits`, no `kit_orders` row created.
- **Idempotency:** Stripe retries `checkout.session.completed` (or replay from Dashboard) → exactly one `kit_orders` row (guarded by `processed_stripe_events`); no duplicate `purchase` email.
- **Discount path (after coupons set in Coolify):** `?discount=SUBSCRIBER10` → 10% off at checkout, `discount_code` in metadata.
- **All three kits:** repeat for testosterone / energy-recovery / hormone-recovery — verify each maps to the right price + `kit_type`.
- **FirstPromoter:** if a `?fpr=` referral cookie is present, `fp_tid` rides through metadata to the webhook.

---

## Cleanup after the run

- **Refund** each real-card PaymentIntent in the Stripe Dashboard.
- **Delete the test rows:** the guest user + its `kit_orders` (and any `lab_results`). No script exists for this yet — do it by `user_id` in Supabase, or say the word and I'll add a `--cleanup` to a small checkout-test script keyed on a `co-test+…` email prefix.

---

## What this E2E does NOT cover (separate tracks)

- **Lab dispatch + results** — dispatch itself now works (proven 2026-06-25); the full results-return leg is covered by the live-Vitall E2E (`869d99m1k`) and the results-dashboard QA (`869d99m6m`).
- **Subscriptions** — `STRIPE_PRICE_DAILY_STACK/COLLAGEN/COMPLETE_STACK` are intentionally unset (Phase 0b); subscription checkout is deferred until supplements ship.
