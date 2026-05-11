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
│   └── thriva/route.ts       POST — historic Thriva stub; Vitall webhook route to be added under app/api/webhooks/vitall
├── jobs/
│   └── process-result/route.ts  POST — QStash-triggered job: normalises biomarkers, writes to DB, emits CIO event
├── vitall/
│   └── dispatch/route.ts     POST — live Vitall kit dispatch route
├── thriva/
│   └── dispatch/route.ts     POST — historic Thriva stub (Vitall now selected; pending retirement)
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
| Results normaliser | `lib/results/normaliser.ts` | Converts lab raw payload → biomarker_values rows (originally Thriva-shaped; needs Vitall verification) |
| Results classifier | `lib/results/classifier.ts` | Applies Andro Prime thresholds to produce dashboard bands |

## Webhook flow

```
Stripe → /api/webhooks/stripe
  ├─ kit purchase    → INSERT kit_orders → trigger Vitall dispatch (app/api/vitall/dispatch) → emitEvent('purchase')
  ├─ subscription    → INSERT supplement_subscriptions → emitEvent('subscription_started')
  └─ deposit         → INSERT founding_member_deposits → emitEvent('founding_member_deposit')

Lab (Vitall — live; Thriva stub historic) → /api/webhooks/thriva (to be migrated to /api/webhooks/vitall)
  └─ result ready    → QStash enqueue → /api/jobs/process-result
                          └─ INSERT lab_results + biomarker_values → emitEvent('result_received')
```

## Lab dispatch (Vitall live; Thriva stub historic)

`/api/vitall/dispatch` is the live Vitall dispatch route. The historic Thriva stub at `/api/thriva/dispatch` is retained for reference and should be retired once the Vitall pipeline is fully wired.
