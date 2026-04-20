# Backend — Architecture Note

This directory is a placeholder. There is no separate backend service.

All backend logic is colocated in the Next.js application using the App Router pattern:

```
frontend/app/api/
├── checkout/
│   ├── kit/route.ts          POST — creates Stripe checkout session for a kit
│   ├── subscription/route.ts POST — creates Stripe checkout session for a supplement subscription
│   ├── deposit/route.ts      POST — creates Stripe checkout session for founding member deposit
│   └── portal/route.ts       POST — generates Stripe billing portal session
├── webhooks/
│   ├── stripe/route.ts       POST — handles all Stripe events (payment, subscription, deposit)
│   └── thriva/route.ts       POST — receives Thriva lab results, enqueues to QStash
├── jobs/
│   └── process-result/route.ts  POST — QStash-triggered job: normalises biomarkers, writes to DB, emits CIO event
├── thriva/
│   └── dispatch/route.ts     POST — stub for Thriva kit dispatch (replace with real API once onboarded)
├── results/
│   └── qualifier/route.ts    POST — saves post-result qualifier responses
└── forms/
    ├── contact/route.ts       POST — anonymous contact form
    ├── waitlist/route.ts      POST — waitlist email capture
    └── test-selector/route.ts POST — quiz completion handler
```

## Key libraries

| Library | Location | Purpose |
|---------|----------|---------|
| Supabase admin client | `lib/supabase/admin.ts` | Server-side DB writes (bypasses RLS) |
| Stripe client | `lib/stripe/client.ts` | Stripe SDK initialisation |
| Customer.io | `lib/customerio/emit.ts` | Event emission and user identification |
| QStash verifier | `lib/qstash/verify.ts` | Validates Upstash QStash webhook signatures |
| Auth session | `lib/auth/session.ts` | `requireAuthenticatedApiUser()` guard for API routes |
| Results normaliser | `lib/results/normaliser.ts` | Converts Thriva raw payload → biomarker_values rows |
| Results classifier | `lib/results/classifier.ts` | Applies Andro Prime thresholds to produce dashboard bands |

## Webhook flow

```
Stripe → /api/webhooks/stripe
  ├─ kit purchase    → INSERT kit_orders → trigger Thriva dispatch → emitEvent('purchase')
  ├─ subscription    → INSERT supplement_subscriptions → emitEvent('subscription_started')
  └─ deposit         → INSERT founding_member_deposits → emitEvent('founding_member_deposit')

Thriva → /api/webhooks/thriva
  └─ result ready    → QStash enqueue → /api/jobs/process-result
                          └─ INSERT lab_results + biomarker_values → emitEvent('result_received')
```

## Thriva dispatch stub

`/api/thriva/dispatch` currently logs the dispatch and updates order status to `dispatched`.
Replace the `console.log` stub with the real Thriva API call once the lab contract is signed
and the endpoint format is confirmed by Thriva during onboarding.
