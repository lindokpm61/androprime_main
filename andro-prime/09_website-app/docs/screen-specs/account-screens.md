# Screen Specs — Account Screens

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Routes covered:** `/app/account`, `/app/subscriptions`, `/app/founding-member-status`

---

## Shared Layout — App Inner Pages

All account area screens share the same persistent layout:

**App nav bar:** Same as dashboard — logo left, `ACCOUNT` link right (active state on account pages), `border-b-2 border-black`.

**Page header:** `border-b-4 border-black py-10 px-6`. Eyebrow label + page title.

**Content:** `px-6 py-10`. `max-w-3xl` column. Left-aligned.

---

## Screen 1 — Account (`/app/account`)

### Purpose
Central hub for account details, order history, and links to subscriptions and founding member status. Not a conversion surface.

### Page header

Eyebrow: `YOUR ACCOUNT`
Heading: `Account`

---

### Section 1 — Personal details

`border-b-2 border-black py-8`

**Eyebrow:** `DETAILS`

Two-column `grid-cols-2 gap-6` (single column on mobile). Each field is a read-only row:

```
EMAIL ADDRESS
keithantony@gmail.com      [ EDIT ]
```

```
NAME
Keith Antony               [ EDIT ]
```

```
PASSWORD
••••••••                   [ CHANGE ]
```

Field label: JetBrains Mono uppercase text-xs text-gray-400.
Field value: Inter font-black text-base.
Edit/Change link: Inter font-black uppercase text-xs underline tracking-widest.

Clicking EDIT opens an inline edit form below the row — does not navigate away.

---

### Section 2 — Orders

`border-b-2 border-black py-8`

**Eyebrow:** `ORDERS`

List of past orders. Each order row: `border-2 border-black rounded-none p-5 mb-4`.

Row content:
- Left: Kit name (Inter font-black) + order date below (JetBrains Mono text-xs text-gray-400)
- Right: Status badge + "View results" link (if results available)

Status badge: `border-2 border-black rounded-none px-3 py-1 font-sans font-black uppercase text-xs`. No colour — black on white for all states. Status label text:
- `ORDER PLACED`
- `KIT DISPATCHED`
- `SAMPLE RECEIVED`
- `ANALYSING`
- `RESULTS READY` — badge fills black, text white when results are available

"View results" link: routes to `/app/dashboard` (dashboard always shows the most recent order's results).

If no orders: placeholder state — `border-2 border-black rounded-none p-8 text-center`. Body text: "You haven't placed any orders yet." + `BUY A KIT  →` primary button linking to canonical site.

---

### Section 3 — Quick links

`py-8`

**Eyebrow:** `MANAGE`

Two large link rows, each `border-2 border-black rounded-none p-6 flex items-center justify-between mb-4 hover:bg-gray-50`:

```
Subscriptions
Active supplement subscriptions and billing          →
```

```
Founding Member Status
Your deposit status and clinical waitlist            →
```

Inter font-black for title. Merriweather text-sm text-gray-600 for description.

---

### Section 4 — Danger zone

`border-t-4 border-black pt-8`

Text link only — no button. `font-sans text-sm text-gray-400 underline`:
```
Sign out
```

No "delete account" option in Phase 0 — handled via support.

---

## Screen 2 — Subscriptions (`/app/subscriptions`)

### Purpose
Shows active supplement subscriptions, billing status, and allows cancellation. Aligned to Stripe billing state.

### Page header

Eyebrow: `SUBSCRIPTIONS`
Heading: `Your subscriptions`

---

### State A — Active subscription(s)

Each subscription: full-width card `border-2 border-black rounded-none p-6 mb-6`.

**Card layout:**

Top row: Product name (Inter font-black text-lg) + status tag right-aligned.
Status tag: `ACTIVE` in `border-2 border-black rounded-none px-3 py-1 font-sans font-black uppercase text-xs`.

Below: Two-column row (stacked on mobile):
- Left: `NEXT BILLING DATE` label + date value
- Right: `AMOUNT` label + price value

Both in JetBrains Mono uppercase text-xs label / Inter font-black text-base value.

Bottom row: Two text links:
- `MANAGE BILLING` — opens Stripe customer portal in new tab
- `CANCEL SUBSCRIPTION` — see cancellation flow below

**Cancellation flow:**

Clicking `CANCEL SUBSCRIPTION` shows an inline confirmation within the card — does not navigate away.

```
Are you sure you want to cancel?

Your subscription is active until [next billing date].
After that, you won't be charged again.

[ CANCEL SUBSCRIPTION ]    [ KEEP MY SUBSCRIPTION ]
```

`CANCEL SUBSCRIPTION` is a secondary button (white bg, black border). `KEEP MY SUBSCRIPTION` is the primary button (black bg). This ordering intentionally makes keeping the subscription the prominent action.

On confirmation: Stripe subscription cancelled via API. Card updates to show `CANCELLED` status tag. Copy updates to show final active date.

---

### State B — No active subscriptions

Placeholder state. `border-2 border-black rounded-none p-10 text-center`.

**Heading:** `No active subscriptions.`
**Body:** "Your supplement subscriptions will appear here."

No CTA on this screen — conversions happen via the results dashboard, not the account area.

---

## Screen 3 — Founding Member Status (`/app/founding-member-status`)

### Purpose
Shows whether a founding member deposit has been paid, and what happens next. The customer may reach this screen at any time after paying the deposit. Must not imply TRT is currently available.

### Page header

Eyebrow: `FOUNDING MEMBER`
Heading: `Your status`

---

### State A — Deposit paid

**Status banner (full width, `bg-black text-white py-8 px-6`):**

Left: Status dot (white, 8px square) + eyebrow `DEPOSIT CONFIRMED`
Heading: `You're in.`
Subtext: "Your £49 deposit is held in full. When we launch the clinical service, you'll be among the first contacted — and your deposit goes straight towards your first month."

Deposit reference + date in JetBrains Mono text-xs text-gray-400 (white context): `DEPOSIT REF: [REF] · PAID [DATE]`

---

**Section — What happens next:**

`border-b-2 border-black py-8`

**Eyebrow:** `NEXT STEPS`

Three-step list. Each step: Inter font-black uppercase text-sm + Merriweather body text-sm text-gray-600 below.

```
1   WE COMPLETE CQC REGISTRATION
    We're in the process of registering as a regulated clinical provider.
    This is a legal requirement before we can offer TRT.

2   YOU GET AN EARLY NOTIFICATION
    As a founding member, you'll be contacted before we open to the public.
    You'll have the option to book your clinical assessment first.

3   YOUR DEPOSIT IS APPLIED
    Your £49 deposit is deducted from your first month's subscription.
    If you decide not to proceed, your deposit is refunded in full.
```

---

**Section — Refund policy:**

`border-t-2 border-black py-8`

**Eyebrow:** `REFUND POLICY`

Body (Merriweather text-sm text-gray-600):
"Your deposit is fully refundable at any time before the clinical service launches. To request a refund, contact us at [support email]. We'll process it within 5 working days."

Text link: `REQUEST A REFUND` — opens email client with pre-filled subject line, or routes to a support contact form.

---

### State B — No deposit paid

This screen is only accessible if the customer navigated here directly (e.g. from the account quick links). They have not paid a deposit.

**Heading:** `Founding member programme`

Body (Merriweather text-base text-gray-600):
"If your testosterone results came back below the optimal threshold, you may be eligible for our founding member programme — a refundable deposit that secures your place in the clinical waiting list for when we launch TRT in the UK."

"If you haven't had your results back yet, check your dashboard."

Button: `GO TO MY DASHBOARD  →`

No deposit CTA on this screen. Conversion happens via the results dashboard, not here.

---

## Mobile (all account screens)

- Two-column grids collapse to single column
- Order rows: status badge and "View results" link stack below kit name
- Subscription cards: billing details stack vertically
- Founding member status banner: stacks vertically
- All section padding reduced to `py-6`

---

## Component Reference

| Component | Token / class |
|---|---|
| Page header | `border-b-4 border-black py-10 px-6` |
| Content column | `max-w-3xl px-6 py-10` |
| Detail row label | JetBrains Mono uppercase text-xs text-gray-400 mb-1 |
| Detail row value | Inter font-black text-base |
| Edit link | `font-sans font-black uppercase text-xs underline tracking-widest` |
| Order / subscription card | `border-2 border-black rounded-none p-6 mb-4` |
| Status tag | `border-2 border-black rounded-none px-3 py-1 font-sans font-black uppercase text-xs` |
| Status tag — results ready | `bg-black text-white border-2 border-black rounded-none px-3 py-1 font-sans font-black uppercase text-xs` |
| Quick link row | `border-2 border-black rounded-none p-6 flex items-center justify-between mb-4 hover:bg-gray-50 cursor-pointer` |
| Cancellation confirmation | Inline within card, `border-t-2 border-black mt-4 pt-4` |
| Founding member banner | `bg-black text-white py-8 px-6` |
| Step number + title | Inter font-black uppercase text-sm |
| Step body | Merriweather text-sm text-gray-600 mt-1 |
