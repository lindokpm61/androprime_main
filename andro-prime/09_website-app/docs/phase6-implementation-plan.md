# Phase 6 Implementation Plan — Remaining App Screens

**Version:** 1.0
**Owner:** Keith Antony
**Status:** Active
**Date:** April 2026

---

## Context

Phase 5 delivered the results dashboard — the full classifier, fixture layer, component set, and server-side data query. The three remaining authenticated app screens (`founding-member-status`, `subscriptions`, `account`) are all protected placeholders: routes work, layout enforces auth, but pages return `<AppPlaceholder>`.

Phase 6 replaces those three placeholders with production UI.

**Key dependency note:**

The `supplement_subscriptions` and `founding_member_deposits` tables are already defined in `lib/supabase/types.ts`. They are populated by the Stripe webhook handler, which is built in Phase 7. Phase 6 builds the UI that reads from those tables and handles the empty state gracefully. When Phase 7 lands, data flows in automatically — no Phase 6 files need revisiting.

This mirrors the Phase 5 approach: results dashboard was built against the schema before any real result was returned by the lab partner (originally Thriva, now Vitall per the 2026-05-01 selection).

**Path convention:**

All Next.js paths are relative to `09_website-app/frontend/` unless stated otherwise.

---

## Architecture

Each screen follows the same dependency chain established in Phase 5:

```
Supabase tables (already defined, populated by Phase 7 Stripe webhook)
    → lib query function   (server-only, anon client with session — RLS enforced)
        → app/(app)/[screen]/page.tsx   (async server component)
            → CSS classes   (styles/pages/[screen].css)
```

No client components are needed for Phase 6 — all data is read-only from the user's perspective. The only interactive element is the "Manage subscription" link on the subscriptions page, which is an anchor to a Phase 7 API route.

---

## File Creation Order

9 files, in dependency sequence.

| Order | File | Depends On |
|---|---|---|
| 1 | `lib/founding-member/getDepositStatus.ts` | `lib/supabase/server.ts`, `lib/supabase/types.ts` |
| 2 | `lib/subscriptions/getSubscriptions.ts` | `lib/supabase/server.ts`, `lib/supabase/types.ts` |
| 3 | `lib/account/getAccountData.ts` | `lib/supabase/server.ts`, `lib/supabase/types.ts` |
| 4 | `app/(app)/founding-member-status/page.tsx` | `lib/founding-member/getDepositStatus.ts` |
| 5 | `app/(app)/subscriptions/page.tsx` | `lib/subscriptions/getSubscriptions.ts` |
| 6 | `app/(app)/account/page.tsx` | `lib/account/getAccountData.ts` |
| 7 | `styles/pages/founding-member-status.css` | Nothing |
| 8 | `styles/pages/subscriptions.css` | Nothing |
| 9 | `styles/pages/account.css` | Nothing (file exists as placeholder — replace contents) |

---

## Step 1 — Founding Member Deposit Query

**File:** `lib/founding-member/getDepositStatus.ts`

Server-only. Uses `createSupabaseServerClient` (anon client with session — RLS enforced).

```typescript
export type DepositState =
  | { state: 'not-started' }
  | { state: 'pending'; depositId: string; createdAt: string }
  | { state: 'paid'; depositId: string; paidAt: string }
  | { state: 'cancelled'; depositId: string }
  | { state: 'refunded'; depositId: string }

export async function getDepositStatus(userId: string): Promise<DepositState>
```

Fetch sequence:

1. Query `founding_member_deposits` where `user_id = userId`, order by `created_at DESC`, limit 1
2. If no row → return `{ state: 'not-started' }`
3. Map `status` field to the appropriate discriminated union variant
4. Return the result

`paid_at` is nullable in the schema — only present when `status === 'paid'`. Do not read `paid_at` on any other state.

---

## Step 2 — Subscriptions Query

**File:** `lib/subscriptions/getSubscriptions.ts`

Server-only. Uses `createSupabaseServerClient`.

```typescript
export type SubscriptionStatus =
  | 'incomplete'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'unpaid'

export interface SubscriptionRow {
  id: string
  productSlug: string
  productName: string
  price: string
  status: SubscriptionStatus
  startedAt: string
}

export async function getSubscriptions(userId: string): Promise<SubscriptionRow[]>
```

Fetch sequence:

1. Query `supplement_subscriptions` where `user_id = userId`, order by `started_at DESC`
2. Map each row using the product display map below
3. Return the mapped array (empty array if no rows)

**Product display map** — source of truth for names and prices:

```typescript
const PRODUCT_MAP: Record<string, { name: string; price: string }> = {
  'daily-stack':        { name: 'Daily Stack',                 price: '£34.95/mo' },
  'collagen':           { name: 'Joint & Recovery Collagen',   price: '£29.95/mo' },
  'complete-mens-stack':{ name: 'Complete Men\'s Stack',       price: '£54.95/mo' },
}
```

If `product_slug` is not in the map (forward compatibility), fall back to the raw slug as name and omit the price string (render as `''`).

**Note on renewal date:** Renewal date is not stored in the Supabase schema — it lives in Stripe. Phase 6 displays `started_at` only. The "Manage subscription" link points to `/api/checkout/portal` (built in Phase 7). Do not attempt to surface renewal date here.

---

## Step 3 — Account Data Query

**File:** `lib/account/getAccountData.ts`

Server-only. Uses `createSupabaseServerClient`.

```typescript
export type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'dispatched'
  | 'sample_registered'
  | 'processing'
  | 'results_received'
  | 'cancelled'
  | 'refunded'

export interface KitOrderSummary {
  id: string
  kitType: KitType
  kitName: string
  status: OrderStatus
  orderedAt: string
  hasResults: boolean
}

export interface AccountData {
  email: string
  age: number | null
  orders: KitOrderSummary[]
  hasActiveSubscription: boolean
  hasDeposit: boolean
}

export async function getAccountData(userId: string, userEmail: string): Promise<AccountData>
```

Fetch sequence — run in parallel:

1. `users` table row for `userId` — select `age`
2. `kit_orders` for `userId` — select `id`, `kit_type`, `status`, `ordered_at` — order by `ordered_at DESC`
3. `supplement_subscriptions` for `userId` — select `status` — filter `status IN ('active', 'trialing', 'past_due')`
4. `founding_member_deposits` for `userId` — select `status` — filter `status = 'paid'`

Then:

5. For each kit order, check `lab_results` where `order_id = order.id` — if any row exists, `hasResults = true`
6. Map kit types to display names using `KIT_NAMES` constant
7. Return `AccountData`

**Kit display name map:**

```typescript
const KIT_NAMES: Record<KitType, string> = {
  'testosterone':      'Testosterone Health Check',
  'energy-recovery':   'Energy & Recovery Check',
  'hormone-recovery':  'Hormone & Recovery Check',
}
```

`hasActiveSubscription` is `true` if any subscription row has `status` in `['active', 'trialing', 'past_due']`.
`hasDeposit` is `true` if any deposit row has `status = 'paid'`.

`email` is passed in from the auth session — do not re-query Supabase auth for it.

---

## Step 4 — Founding Member Status Page

**File:** `app/(app)/founding-member-status/page.tsx`

Replaces the placeholder. Server component — no `'use client'`.

```typescript
export const metadata = {
  title: 'Founding Member Status',
  robots: { index: false, follow: false },
}
```

Structure:

1. Call `getCurrentUser()` — narrowed from layout guarantee
2. Call `getDepositStatus(user.id)`
3. Render the correct state panel based on discriminated union variant

**State panels:**

| State | Heading | Body | CTA |
|---|---|---|---|
| `not-started` | "Reserve your place" | "Pay the £75 deposit now to secure your place at the front of the queue when we launch TRT. Fully refundable — applied as credit when you sign up." | Link to `/founding-member` |
| `pending` | "Your deposit is being processed" | "We've received your payment request. This usually clears within a few minutes." | None |
| `paid` | "You're in." | "Your £75 deposit is confirmed. You'll be among the first contacted when Andro Prime launches TRT. We'll be in touch." | None |
| `cancelled` | "Deposit cancelled" | "Your deposit was not completed. If this was unexpected, contact us." | Link to `/founding-member` |
| `refunded` | "Deposit refunded" | "Your deposit has been returned. You're welcome to re-apply when TRT launches." | Link to `/founding-member` |

**Compliance rule — enforced at copy level:**

Never imply TRT is currently available. The `paid` state heading is "You're in." — not "You're enrolled" or "Your TRT is confirmed." No clinical language on this page.

The link to `/founding-member` surfaces the canonical page for full context — do not duplicate that page's copy here.

---

## Step 5 — Subscriptions Page

**File:** `app/(app)/subscriptions/page.tsx`

Replaces the placeholder. Server component — no `'use client'`.

```typescript
export const metadata = {
  title: 'Your Subscriptions',
  robots: { index: false, follow: false },
}
```

Structure:

1. Call `getCurrentUser()`
2. Call `getSubscriptions(user.id)`
3. If empty array → render no-subscriptions holding state
4. If array has rows → map each to a subscription card

**Subscription card — per row:**

- Product name + price
- Status badge (maps to label + colour variant):

| Status | Label | Visual |
|---|---|---|
| `active` | Active | Positive (matches `status-indicator--optimal`) |
| `trialing` | Trial | Neutral |
| `past_due` | Payment due | Warning (matches `status-indicator--warning`) |
| `incomplete` | Incomplete | Warning |
| `unpaid` | Unpaid | Warning |
| `cancelled` | Cancelled | Muted |

- Started date (formatted as "Started DD Month YYYY")
- "Manage subscription" anchor → `/api/checkout/portal` (Phase 7 route, not yet live — renders as a greyed link with a note "Billing management coming soon" until Phase 7 is complete. Remove the note in Phase 7.)

**No-subscriptions state:**

"You don't have an active subscription. Browse our supplements to get started." — link to `/supplements`.

---

## Step 6 — Account Page

**File:** `app/(app)/account/page.tsx`

Replaces the placeholder. Server component — no `'use client'`.

```typescript
export const metadata = {
  title: 'Your Account',
  robots: { index: false, follow: false },
}
```

Structure:

1. Call `getCurrentUser()` — pull `email` from auth user object
2. Call `getAccountData(user.id, user.email)`
3. Render three sections:

**Section 1 — Profile**

Email address (read-only — Supabase auth owns this). Age if present. No edit functionality in Phase 6 — profile editing is a post-launch enhancement.

**Section 2 — Test history**

Table/list of kit orders, ordered newest first.

| Column | Content |
|---|---|
| Kit | Kit display name |
| Status | Status label (plain text — not a badge) |
| Date | `ordered_at` formatted as "DD Month YYYY" |
| Action | "View results" link to `/results-dashboard` if `hasResults === true`; "Awaiting results" plain text otherwise |

If no orders: "No tests ordered yet." with link to `/kits`.

**Section 3 — Quick links**

- Link to `/account/subscriptions` if `hasActiveSubscription`, otherwise link to `/supplements`
- Link to `/founding-member-status`
- `mailto:` support link — `support@andro-prime.com`

---

## Step 7 — CSS

### `styles/pages/founding-member-status.css`

```css
.founding-member-status { @apply bg-stone-100 px-6 py-12; }
.founding-member-status__inner { @apply mx-auto max-w-3xl; }
.founding-member-status__panel { @apply border-4 border-black bg-white px-8 py-10; }
.founding-member-status__heading { @apply font-serif text-3xl mb-4; }
.founding-member-status__body { @apply text-base leading-relaxed mb-6; }
```

### `styles/pages/subscriptions.css`

```css
.subscriptions { @apply bg-stone-100 px-6 py-12; }
.subscriptions__inner { @apply mx-auto max-w-3xl; }
.subscriptions__card { @apply border-4 border-black bg-white px-8 py-8 mb-6; }
.subscriptions__product { @apply font-serif text-2xl mb-1; }
.subscriptions__price { @apply font-mono text-sm text-stone-500 mb-4; }
.subscriptions__meta { @apply text-sm text-stone-600; }
.subscriptions__manage { @apply text-sm underline; }
.subscriptions__manage--disabled { @apply text-stone-400 no-underline cursor-not-allowed; }
.subscriptions__empty { @apply border-4 border-black bg-white px-8 py-16 text-center; }
```

### `styles/pages/account.css`

Replaces the existing placeholder file.

```css
.account { @apply bg-stone-100 px-6 py-12; }
.account__inner { @apply mx-auto max-w-3xl; }
.account__section { @apply border-4 border-black bg-white px-8 py-8 mb-6; }
.account__section-heading { @apply font-serif text-xl mb-6 pb-4 border-b-2 border-black; }
.account__profile-field { @apply flex justify-between py-3 border-b border-stone-200 last:border-b-0; }
.account__profile-label { @apply text-sm text-stone-500; }
.account__profile-value { @apply text-sm font-medium; }
.account__order-row { @apply grid grid-cols-4 gap-4 py-3 border-b border-stone-200 text-sm last:border-b-0; }
.account__order-header { @apply grid grid-cols-4 gap-4 py-2 text-xs font-mono uppercase tracking-wider text-stone-500; }
.account__quicklink { @apply block py-3 border-b border-stone-200 text-sm underline last:border-b-0; }
.account__empty { @apply text-sm text-stone-500 py-4; }
```

---

## Rule Enforcement Summary

| Rule | Enforced where |
|---|---|
| No TRT availability implied on founding member status page | Copy constants in page.tsx — never says "enrolled", "programme", or "TRT confirmed" |
| Founding member CTA only links to canonical page — no inline deposit action | `not-started` state links to `/founding-member`, not a checkout route |
| Renewal date not surfaced until Stripe data is available | Phase 7 responsibility — page shows started date only |
| Product names and prices match CLAUDE.md source of truth | `PRODUCT_MAP` constant in `getSubscriptions.ts` — one place to update |
| Result history links to `/results-dashboard` only when results exist | `hasResults` flag from `getAccountData` — no dead links |
| All three pages excluded from search indexing | `metadata.robots` in each page file |

---

## Deliverables

- Founding member status page correctly renders all five deposit states
- Subscriptions page correctly renders active subscriptions and empty state, with status badges
- Account page shows profile, full kit order history with correct action links, and quick links
- All three pages excluded from search indexing
- TypeScript: zero errors
- Build: clean

Phase 6 is complete when all three screens render correctly in dev, all states are visually reachable, and the build is clean. Stripe data does not need to be live — the empty states are the acceptance criteria for data that Phase 7 will provide.

---

## Changelog

| Date | Change |
|---|---|
| April 2026 (v1.0) | Initial plan |
