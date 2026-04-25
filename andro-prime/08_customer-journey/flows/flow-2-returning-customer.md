# Flow 2 — Returning Customer

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active

## Purpose

Maps how a customer who has previously purchased and accessed the app returns to the dashboard. Covers two sub-paths: customers who have set a password, and customers who have not.

---

## Prerequisites

- Customer has an existing Andro Prime account in Supabase (created at checkout)
- Customer has previously accessed the dashboard via magic link (Flow 1)

---

## Flow

### Step 1 — Customer arrives at login

**Trigger:** Customer navigates directly to the site, clicks a link in a lifecycle email, or their previous session has expired.

**Screen:** `/auth/login`

Content shown:
- Email field
- Password field
- "Sign in" button
- "Send me a link instead" link below the form
- "Buy a kit" link for visitors who have not purchased (routes to canonical site kit pages)

No sign-up option. No social login.

---

### Step 2 — Branch on customer state

**Branch A — Customer has a password set:**
Customer enters email and password and submits.

System actions:
- Validate credentials against Supabase Auth
- On success: create session, redirect to `/app/dashboard`
- On failure: show inline error "Email or password not recognised." Do not specify which field is wrong. Offer "Send me a link instead" as a fallback.

**Branch B — Customer has no password set:**
Customer enters email but cannot complete the password field — or chooses "Send me a link instead."

Proceed to Step 3.

---

### Step 3 — Magic link request

**Trigger:** Customer clicks "Send me a link instead" or submits the request-link form.

**Screen:** `/auth/request-link`

Content shown:
- Email field (pre-filled if coming from the login screen)
- "Send link" button
- Brief copy: "We'll send a sign-in link to your email. It expires in 24 hours."

**System actions on submit:**
- Look up email in Supabase
- Branch on result:

**Branch A — Email found (existing customer):**
- Generate new single-use magic link token, store with 24-hour expiry
- Fire magic link email via Customer.io
- Show confirmation screen: "Check your email. We've sent a sign-in link to [email]."

**Branch B — Email not found:**
- Show same confirmation screen as Branch A (do not confirm whether the email exists — security best practice)
- No email sent

---

### Step 4 — Customer clicks magic link in email

**Trigger:** Customer clicks the sign-in link in the email.

**Screen:** `/auth/magic?token=TOKEN_VALUE`

Validation and branching is identical to Flow 1 Step 3:

- **Token valid** → create session, redirect to `/app/dashboard`
- **Token expired** → "This link has expired." + send new link CTA
- **Token already used** → "This link has already been used." + login or send new link CTA
- **Token invalid** → "This link isn't valid." + send new link CTA

---

### Step 5 — Dashboard load

**Trigger:** Successful session. Customer redirected to `/app/dashboard`.

**Screen:** Dashboard — pre-results or post-results state depending on order status in Supabase.

- If results are not yet available: pre-results state with status tracker at current step
- If results are available: post-results state with full results view

Password prompt behaviour:
- If `password_prompt_dismissed` is false and no password is set: show dismissible prompt
- If already dismissed or password is set: do not show

---

## End State

Customer is authenticated and on the dashboard at the correct state for their current order status.

---

## Error States Summary

| Error | Screen shown | Resolution |
|---|---|---|
| Wrong email or password | Inline error on login form | Customer retries or uses magic link |
| Email not found on link request | Same confirmation screen shown (no indication) | No action needed |
| Token expired | "This link has expired" + send new link CTA | Customer requests new link |
| Token already used | "This link has already been used" | Customer logs in or requests new link |
| Token invalid | "This link isn't valid" + send new link CTA | Customer requests new link |

---

## Data Written During This Flow

| Data point | Written to | When |
|---|---|---|
| Magic link token + expiry | Supabase `magic_link_tokens` | Step 3 — on request |
| Token used flag | Supabase `magic_link_tokens` | Step 4 — on successful validation |
| Authenticated session | Supabase Auth | Step 4 or Step 2A — on successful auth |
