# Flow 1 — First-Time Access (Post-Purchase)

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active

## Purpose

Maps the complete journey from checkout completion to the customer's first authenticated session inside the Andro Prime app. Every customer goes through this flow. It establishes the account, delivers the magic link, and lands the customer in the dashboard for the first time.

---

## Prerequisites

- Customer has completed checkout on the Andro Prime canonical site
- Stripe payment has succeeded
- Andro Prime order record has been created in Supabase
- Vitall order has been placed via API (triggered on checkout completion)

---

## Flow

### Step 1 — Checkout complete

**Trigger:** Stripe payment success webhook received.

**System actions:**
- Create order record in Supabase with status `order-placed`
- Create customer account in Supabase (email only — no password)
- Generate a single-use magic link token, store against the customer account with expiry (24 hours)
- Fire Vitall `POST /order/create` with customer and order data
- Store Vitall `orderId` against the Andro Prime order record

**Screen:** Order confirmation page on the canonical site.

Content shown:
- Order confirmed message
- Kit name and order reference
- "We'll email you a link to your results dashboard" — sets expectation for the magic link email
- No password prompt. No account creation form.

---

### Step 2 — Order confirmation email sent

**Trigger:** Supabase account creation complete + magic link token generated.

**System action:** Customer.io fires T-01 order confirmation email to the customer's email address.

**Email contains:**
- Order confirmation and kit name
- "Access your dashboard" CTA — contains the magic link URL with the token as a URL parameter
- What happens next (brief: kit being prepared, they'll get a dispatch notification)
- Token is single-use and expires in 24 hours. After expiry, a new link can be requested from `/auth/request-link`.

---

### Step 3 — Customer clicks magic link

**Trigger:** Customer clicks the "Access your dashboard" CTA in the email.

**Screen:** `/auth/magic?token=TOKEN_VALUE`

**System actions:**
- Validate token: check it exists, has not been used, and has not expired
- Branch on validation result (see below)

**Branch A — Token valid:**
- Mark token as used
- Create authenticated session
- Redirect to `/app/dashboard`
- Proceed to Step 4

**Branch B — Token expired (>24 hours):**
- Show error screen: "This link has expired."
- CTA: "Send me a new link" → routes to `/auth/request-link` pre-filled with the customer's email
- No redirect to dashboard until a new valid token is used

**Branch C — Token already used:**
- Show message: "This link has already been used."
- If the customer has a password set: show login form
- If no password set: CTA "Send me a new link" → `/auth/request-link`

**Branch D — Token not found / malformed:**
- Show generic error: "This link isn't valid."
- CTA: "Send me a new link" → `/auth/request-link`

---

### Step 4 — First dashboard load

**Trigger:** Successful session created. Customer redirected to `/app/dashboard`.

**Screen:** Dashboard — pre-results state.

**System action:** Check order status from Supabase. At this point status is `order-placed` or `kit-sent` depending on timing.

Content shown:
- Status tracker: 4 steps (Kit dispatched → Sample received → Analysing → Results ready). Current step highlighted based on order status in Supabase.
- Educational content cards below the tracker (static, non-interactive):
  - What your kit is testing
  - What testosterone actually does
  - What happens at the lab
  - How to read your results when they arrive
- Password prompt: dismissible banner at the top of the screen. Copy: "Set a password to make it easier to come back." CTA: "Set password" → modal or inline form. Dismiss option saves a `password_prompt_dismissed` flag against the account so it does not reappear.

**Data state at this point:**
- Customer is authenticated
- Order status: `order-placed` or `kit-sent`
- No results in Supabase yet
- Password: not set (unless customer acts on the prompt)

---

### Step 5 — Password set (optional)

**Trigger:** Customer taps "Set password" on the dashboard prompt.

**Screen:** Inline modal or inline form on the dashboard. Does not navigate away.

Fields:
- New password
- Confirm password

**System action on submit:** Update customer account in Supabase with hashed password. Dismiss the password prompt permanently.

**On success:** Modal closes. Customer remains on dashboard. Prompt does not reappear.

**On skip/dismiss:** `password_prompt_dismissed` flag set. Prompt does not reappear. Customer remains on dashboard with no password set — future access via magic link only until they set one later from the account area.

---

## End State

Customer is authenticated, in the dashboard, and sees the status tracker at the correct current step. The flow ends here. Subsequent dashboard updates are driven by Vitall webhooks — see Flow 3 (Results to Action) for what happens when results arrive.

---

## Error States Summary

| Error | Screen shown | Resolution |
|---|---|---|
| Token expired | "This link has expired" + send new link CTA | Customer requests new magic link |
| Token already used | "This link has already been used" + login or new link CTA | Customer logs in or requests new link |
| Token invalid / not found | "This link isn't valid" + send new link CTA | Customer requests new magic link |
| Vitall order creation fails | Order is confirmed to customer — retry is handled server-side via QStash queue. Customer experience is unaffected. | QStash retries Vitall API call. Alert fired to Andro Prime team if retries exhausted. |
| Customer.io email fails | Order confirmed on screen — email retry handled by Customer.io | Customer can request a new link from `/auth/request-link` using their email address |

---

## Data Written During This Flow

| Data point | Written to | When |
|---|---|---|
| Customer account (email) | Supabase `users` | Step 1 — checkout complete |
| Order record | Supabase `orders` | Step 1 — checkout complete |
| Vitall `orderId` | Supabase `orders` | Step 1 — after Vitall API response |
| Magic link token + expiry | Supabase `magic_link_tokens` | Step 1 |
| Token used flag | Supabase `magic_link_tokens` | Step 3 — on successful validation |
| Authenticated session | Supabase Auth | Step 3 — on successful validation |
| `password_prompt_dismissed` flag | Supabase `users` | Step 5 — on dismiss |
| Customer password (hashed) | Supabase Auth | Step 5 — on password set |

---

## Customer.io Events Fired During This Flow

| Event | Fired when |
|---|---|
| `purchase` | Step 1 — checkout complete |
| `kit_order_placed` | Step 1 — after Vitall order confirmed |
