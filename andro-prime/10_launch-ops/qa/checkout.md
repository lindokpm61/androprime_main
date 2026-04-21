# QA: Checkout End-to-End
## Code-level audit — April 2026

Audit method: code review of all checkout API routes and commerce components.
Live testing blocked pending: Stripe Price IDs configured, Supabase project live, Coolify deployment.

---

## Checkout Routes Reviewed

| Route | File | Purpose |
|-------|------|---------|
| `POST /api/checkout/kit` | `app/api/checkout/kit/route.ts` | One-off kit purchase (Kit 1, 2, 3) |
| `POST /api/checkout/subscription` | `app/api/checkout/subscription/route.ts` | Subscription (Daily Stack, Collagen, Complete Stack) |
| `POST /api/checkout/deposit` | `app/api/checkout/deposit/route.ts` | Founding member £75 deposit — not individually read |
| `POST /api/checkout/portal` | `app/api/checkout/portal/route.ts` | Billing portal — not individually read |

---

## Kit Checkout (`/api/checkout/kit`)

| Check | Result | Notes |
|-------|--------|-------|
| Auth required | PASS | `requireAuthenticatedApiUser` — 401 if not logged in |
| Input validation | PASS | Validates `kitType` against allowed list |
| Price ID missing returns 400 | PASS | Returns error, does not crash |
| Stripe mode: `payment` | PASS | Correct for one-off purchase |
| Currency GBP | PASS | |
| Customer email forwarded | PASS | `customer_email: auth.email` |
| Metadata: user_id, kit_type, type | PASS | Required for Stripe webhook processing |
| Success URL | PASS | `/account?checkout=success` |
| Cancel URL | PASS | `/kits` — routes to browse page, not LP origin |
| Kit type mapping | PASS | testosterone→KIT_1, energy-recovery→KIT_2, hormone-recovery→KIT_3 |
| Env vars configured | BLOCKED | `STRIPE_PRICE_KIT_1`, `STRIPE_PRICE_KIT_2`, `STRIPE_PRICE_KIT_3` not set |

**Note on cancel URL:** If user initiates from an LP and cancels Stripe, they land on `/kits` not the originating LP. Minor UX issue for LP flows.

---

## Subscription Checkout (`/api/checkout/subscription`)

| Check | Result | Notes |
|-------|--------|-------|
| Auth required | PASS | |
| Input validation | PASS | Validates `productSlug` |
| Stripe mode: `subscription` | PASS | |
| Currency GBP | PASS | |
| Metadata: user_id, product_slug, type | PASS | |
| Success URL | PASS | `/account?checkout=success` |
| Cancel URL | PASS | `/subscriptions` |
| Slug mapping | PASS | daily-stack, collagen, complete-mens-stack |
| Env vars configured | BLOCKED | `STRIPE_PRICE_DAILY_STACK`, `STRIPE_PRICE_COLLAGEN`, `STRIPE_PRICE_COMPLETE_STACK` not set |

---

## Commerce Components

| Component | File | Status |
|-----------|------|--------|
| KitCheckoutButton | `components/commerce/KitCheckoutButton.tsx` | Wired to `/api/checkout/kit` — not individually read |
| SubscribeButton | `components/commerce/SubscribeButton.tsx` | Wired to `/api/checkout/subscription` — not individually read |
| BillingPortalButton | `components/commerce/BillingPortalButton.tsx` | Wired to `/api/checkout/portal` — not individually read |

**Read each component before launch** to verify: loading state, error handling, disabled state during request.

---

## Stripe Webhook

| Check | Result | Notes |
|-------|--------|-------|
| Webhook handler exists | PASS | `app/api/webhooks/stripe/route.ts` |
| Events processed | NEEDS CHECK | Verify `checkout.session.completed` and `customer.subscription.*` handled |
| Supabase write on completion | NEEDS CHECK | Orders, dispatch records, subscription state |
| Thriva dispatch triggered post-kit-purchase | NEEDS CHECK | `app/api/thriva/dispatch/route.ts` |

---

## Env Vars Required Before Live Test

```
STRIPE_PRICE_KIT_1=price_xxx          # Kit 1: £29
STRIPE_PRICE_KIT_2=price_xxx          # Kit 2: £44
STRIPE_PRICE_KIT_3=price_xxx          # Kit 3: £69
STRIPE_PRICE_DAILY_STACK=price_xxx    # Daily Stack: £34.95/mo
STRIPE_PRICE_COLLAGEN=price_xxx       # Collagen Pro: £29.95/mo
STRIPE_PRICE_COMPLETE_STACK=price_xxx # Complete Stack: £54.95/mo
STRIPE_PRICE_DEPOSIT=price_xxx        # Founding Member: £75
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_SITE_URL=https://androprime.co.uk
```

---

## Live Test Script (run after env vars configured)

1. Create test Supabase account
2. Confirm auth: signup → login → session token present
3. Navigate to `/lp/testosterone/` → click "Order Kit → £29"
4. Confirm Stripe Checkout opens (test mode, card 4242 4242 4242 4242)
5. Complete payment → confirm redirect to `/account?checkout=success`
6. Verify order record in Supabase `orders` table
7. Verify Thriva dispatch called (check `thriva_dispatches` table or logs)
8. Repeat for Kit 2 (`/lp/energy-recovery/`) and Kit 3 (`/lp/foundations/`)
9. Repeat for Daily Stack and Collagen subscription flows
10. Test founding member deposit flow from `/founding-member/`
11. Test subscription cancellation → billing portal from `/subscriptions/`
12. Test Stripe webhook: cancel subscription → verify Supabase subscription status updated
13. Test failed payment → verify no order record created

---

## Blocking Issues

| Priority | Issue | Action |
|----------|-------|--------|
| P0 | Stripe Price IDs not configured | Create products in Stripe dashboard (test mode first), copy Price IDs to .env.local |
| P0 | Supabase project not created | Create EU Frankfurt project, run `database/migrations/` |
| P0 | Collagen LP price wrong (£39.95 shown, £29.95 in spec) | Fix LP copy before setting up Stripe price — Stripe price must match page |
| P0 | hormone-recovery LP checkout not wired | Will silently fail until fixed — see lp-pages QA |
| P1 | Deposit and portal routes not individually audited | Read and verify before launch |
| P1 | Commerce components not individually audited | Read KitCheckoutButton, SubscribeButton, BillingPortalButton |
| P1 | Webhook handler events not verified | Read `app/api/webhooks/stripe/route.ts` |
