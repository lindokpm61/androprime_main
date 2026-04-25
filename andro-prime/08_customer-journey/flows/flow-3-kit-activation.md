# Flow 3 — Kit Activation

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active

## Purpose

Maps the journey when a customer receives their kit in the post, scans the QR code on the kit insert, and activates the kit inside the app. This flow is an engagement and onboarding step — it is not a technical requirement for the lab pipeline. Vitall handles sample-to-order matching internally. If a customer never activates, results are still delivered and displayed normally.

---

## Prerequisites

- Customer has an existing Andro Prime account (created at checkout)
- Kit has been dispatched by Vitall (webhook `kit-sent` received)
- Kit insert contains a QR code with the kit code baked into the URL as a parameter

---

## Flow

### Step 1 — Kit arrives

**Trigger:** Physical kit arrives with the customer.

The kit insert contains a QR code. The QR code URL format:
```
https://androprime.co.uk/activate?kit=KIT_CODE
```

The kit code is unique per kit and pre-printed by Vitall at fulfilment. It corresponds to the Vitall order ID or a mapped internal reference.

---

### Step 2 — Customer scans QR code

**Trigger:** Customer scans QR code with phone camera.

**Screen:** `/activate?kit=KIT_CODE`

The kit code is read from the URL parameter — the customer does not type it.

**System action:** Check authentication state.

**Branch A — Customer is already authenticated (active session):**
Proceed to Step 4 directly. Skip Step 3.

**Branch B — Customer is not authenticated:**
Proceed to Step 3. Preserve the `kit=KIT_CODE` parameter through the auth flow so it is not lost.

---

### Step 3 — Authentication (unauthenticated customers only)

**Screen:** Inline prompt on the `/activate` page — not a full redirect to `/auth/login`.

Content shown:
- Brief copy: "Enter your email to continue. We'll send you a sign-in link."
- Email field
- "Send link" button

**System actions on submit:**
- Look up email in Supabase
- If found: generate magic link token, append `redirect=/activate?kit=KIT_CODE` to the magic link URL, fire email
- If not found: show same confirmation screen (do not reveal whether email exists)

**Confirmation screen:**
"Check your email — we've sent a sign-in link. Come back to this page once you've signed in."

**When customer clicks magic link in email:**
- Token validated (same logic as Flow 1 Step 3)
- On success: session created, customer redirected to `/activate?kit=KIT_CODE`
- Proceed to Step 4

---

### Step 4 — Kit confirmation screen

**Trigger:** Customer is authenticated and on `/activate?kit=KIT_CODE`.

**System actions:**
- Validate kit code: look up KIT_CODE in Supabase, confirm it maps to an order belonging to this customer
- Branch on validation:

**Branch A — Kit code valid and belongs to this customer:**
Show confirmation screen. Content:
- "Your kit is registered." confirmation
- Kit name (e.g. Testosterone Health Check)
- Sample collection instructions — step by step, plain English:
  1. Do the test in the morning (before 10am where possible)
  2. Wash hands in warm water for 30 seconds to improve blood flow
  3. Use the lancet on the side of a fingertip, not the pad
  4. Fill the sample tube to the line
  5. Seal the tube and place in the biohazard bag
  6. Post using the pre-paid envelope provided
- CTA: "Go to my dashboard" → `/app/dashboard`

**Branch B — Kit code valid but belongs to a different customer:**
Show error: "This kit doesn't match your account. If you think this is wrong, contact support."
No activation recorded. No instructions shown.

**Branch C — Kit code not found:**
Show error: "We couldn't find this kit. Try scanning the QR code again, or contact support."
CTA: Link to support contact.

**Branch D — Kit already activated:**
Show message: "This kit has already been activated."
CTA: "Go to my dashboard" → `/app/dashboard`

---

### Step 5 — Activation recorded

**Trigger:** Branch A in Step 4 — kit code valid and confirmed.

**System actions:**
- Write `kit_activated_at` timestamp against the order record in Supabase
- Fire `kit_activated` event to Customer.io

---

### Step 6 — Return to dashboard

**Trigger:** Customer taps "Go to my dashboard."

**Screen:** `/app/dashboard` — pre-results state.

Status tracker reflects current order status (likely `kit-sent` at this point). Educational content cards visible below the tracker.

No change to dashboard state as a result of activation — the activation is a background data point only.

---

## End State

Kit is marked as activated in Supabase. Customer is on the dashboard in the pre-results state. Sample collection instructions have been shown.

---

## Error States Summary

| Error | Screen shown | Resolution |
|---|---|---|
| Kit code belongs to different customer | Error message + support link | Customer contacts support |
| Kit code not found | Error message + support link | Customer contacts support or rescans |
| Kit already activated | Confirmation message + dashboard CTA | No action needed |
| Email not found on auth step | Same confirmation screen shown | No email sent, no activation |
| Magic link expired during activation flow | Standard token expiry error | Customer requests new link, redirect preserves kit code |

---

## Data Written During This Flow

| Data point | Written to | When |
|---|---|---|
| `kit_activated_at` timestamp | Supabase `orders` | Step 5 — on successful confirmation |

---

## Customer.io Events Fired During This Flow

| Event | Fired when |
|---|---|
| `kit_activated` | Step 5 — on successful activation |
