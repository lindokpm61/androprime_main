# Backend — Architecture Note

This directory is a placeholder. There is no separate backend service.

All backend logic is colocated in the Next.js application using the App Router pattern:

```
frontend/app/api/
├── checkout/
│   ├── kit/route.ts          POST — creates Stripe checkout session for a kit
│   ├── subscription/route.ts POST — creates Stripe checkout session for a supplement subscription
│   └── portal/route.ts       POST — generates Stripe billing portal session
├── webhooks/
│   ├── stripe/route.ts       POST — handles all Stripe events (payment, subscription)
│   └── vitall/route.ts       POST — live Vitall lab webhook: maps status codes, enqueues result jobs on QStash
├── jobs/
│   ├── process-result/route.ts  POST — QStash-triggered job: normalises biomarkers, writes to DB, emits CIO event
│   └── bundle-sweep/route.ts    POST — bundle dispatch sweep (dark behind BUNDLES_ENABLED)
├── vitall/
│   └── dispatch/route.ts     POST — live Vitall kit dispatch route
├── results/
│   └── qualifier/route.ts    POST — saves post-result qualifier responses
├── account/
│   ├── export/route.ts           POST — GDPR data export (LIVE 2026-07-19)
│   └── erasure-request/route.ts  POST — GDPR erasure request (LIVE 2026-07-19)
├── supplement-waitlist/
│   └── join/route.ts         POST — supplement waitlist opt-in
├── lowt-nurture/consent/route.ts       POST — version-locked low-T nurture consent
├── borderline-nurture/consent/route.ts POST — version-locked borderline-T nurture consent
├── founding-member/
│   └── join/route.ts         POST — RETIRED: returns 410 Gone (FM programme closed 2026-06-04)
├── revalidate/route.ts       POST — on-demand ISR revalidation (blog publish path)
├── events/route.ts           POST — analytics event sink
└── forms/
    ├── contact/route.ts       POST — anonymous contact form
    ├── newsletter/route.ts    POST — blog newsletter opt-in
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
| Results normaliser | `lib/results/normaliser.ts` | Converts Vitall lab payload → biomarker_values rows (live/verified, E2E-proven 2026-06-25) |
| Results classifier | `lib/results/classifier.ts` | Applies Andro Prime thresholds to produce dashboard bands |

## Webhook flow

```
Stripe → /api/webhooks/stripe
  ├─ kit purchase    → INSERT kit_orders → trigger Vitall dispatch (app/api/vitall/dispatch) → emitEvent('purchase')
  └─ subscription    → INSERT supplement_subscriptions → emitEvent('subscription_started')

Lab (Vitall — live) → /api/webhooks/vitall
  └─ result ready    → QStash enqueue → /api/jobs/process-result
                          └─ INSERT lab_results + biomarker_values → emitEvent('result_received')
     Non-result Vitall status codes update kit_orders.status via STATUS_MAP;
     sample-issue / data-purged / order-cancelled are handled out-of-band.
```

The founding-member opt-in is retired (`/api/founding-member/join` returns 410 Gone; FM programme closed 2026-06-04).

## Lab dispatch (Vitall — live)

`/api/vitall/dispatch` is the live Vitall dispatch route (`KIT_TEST_CODES` maps each kit shortCode to its Vitall test codes). There is no Thriva route: Thriva/Forth were ruled out and Vitall is the confirmed lab (E2E-proven 2026-06-25).
