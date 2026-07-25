# SOP: Subscription & Billing Ops

**Runs in:** `cadences/daily-ops.md` (failed-payment glance), `cadences/monthly-ops.md` (full subscription + dunning review).
**Purpose:** Handle Stripe failed payments, dunning, and refunds: catch involuntary churn early and keep the subscription base healthy. Note dunning is a Stripe Dashboard-only setting and the Smart-Retries-vs-CIO-emails decision is deferred to Phase 0b; refunds are a deliberate manual action (a Vitall cancellation never auto-refunds).
**Owner:** `07_sales` (lifecycle, save-offers, `seq-05` churn) + `09_website-app` (Stripe integration + webhooks).

Status: to be drafted.
