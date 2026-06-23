# Passwordless sign-in + hardened 18+ gate

**Date:** 2026-06-12
**Owner:** Keith (approved create-on-link recommendation)
**Status:** Built, typechecks + `next build` clean. Not yet smoke-tested against live Supabase.

## Why

Two bugs from the post-purchase flow review shared one root cause — the app assumed a
password exists, but most buyers are **passwordless guests** (their account is created
for them by the Stripe webhook, with no password):

- **#5** The login page only offered OAuth + email/password. A guest who never set a
  password and doesn't use Google/Microsoft could only get in via "Reset password."
- **#3** When `/auth/post-checkout` auto-login silently failed (Stripe session >1h old,
  or missing email), `/order/confirmed` showed a "Create your account" CTA →
  `/auth/signup`, which **errors** ("already registered") because the webhook already
  created that email's account.

## What was built

A unified passwordless entry, reusing the existing OTP infra (`signInWithOtp` already
powered the now-deprecated activate flow; `/auth/callback` already exchanges the code):

1. **`sendLoginLinkAction`** (`lib/auth/actions.ts`) — sends a one-time sign-in link via
   `signInWithOtp`, `emailRedirectTo = /auth/callback?next=…`. `shouldCreateUser` left at
   default **true**: an unknown email is created and sent a link (create-on-link).
2. **`/auth/link`** page + a new `mode: 'link'` on `AuthCard` (mirrors the passwordless
   `reset` mode: no password, no OAuth, button "Email me a sign-in link"). Cross-linked
   from the login card.
3. **`/order/confirmed` fallback** repointed from `/auth/signup` to
   `/auth/link?next=/results-dashboard` ("Get a sign-in link" / "Use a password instead").
4. **`requireAuthenticatedUser`** redirect now carries `?next=/results-dashboard`, so a
   guest arriving from the results email isn't dead-ended.

## Compliance: 18+ gate (had to harden as part of this)

Create-on-link means brand-new accounts arrive without an age on record, so the 18+ gate
had to be made reliable:

- **Replaced the fragile 30-second "new user" timer** in `/auth/callback` with an
  **age-null check**: anyone whose `users.age` is null is routed to `/auth/consent`
  before the dashboard. The old timer was broken for email magic links anyway (delivery +
  click routinely exceeds 30s), so this is a correctness fix, not just a new-path add.
- **`consentAction` now enforces 18+ server-side** (rejects missing/under-18, not just the
  form's `min` hint); the consent age field is now `required`.

### Behaviour change to know about
Any existing account with a **null age** (e.g. a paying guest whose age was never captured)
now sees the one-time `/auth/consent` step on first magic-link/OAuth login. This is
intended — it closes a real 18+ data gap and also gives the results classifier an age.

## Update 2026-06-23 — magic-link PKCE bug found on first live test + fixed

First live smoke test of the magic-link path failed: clicking the emailed link returned
**"PKCE code verifier not found in storage"** at `/auth/callback`. Root cause: the flow
reused the OAuth-style PKCE `code` + `exchangeCodeForSession`, which needs the code
verifier stored at request time (`signInWithOtp`, server action) to survive the email
round-trip in a cookie. For emailed links that is fragile (verifier not present when the
link opens), so the exchange fails even though Supabase itself verified the user (the
`auth.users` row was created + confirmed; no app session was established).

**Fix:** `/auth/callback` now verifies email links **statelessly** via
`verifyOtp({ type, token_hash })` when `token_hash` + `type` are present, and keeps
`exchangeCodeForSession` only for the OAuth `code` path (where the verifier is set
client-side in the same browser). No PKCE verifier is needed for email.

**REQUIRED manual step (Supabase Dashboard → Authentication → Email Templates → "Magic
Link"):** change the link target from `{{ .ConfirmationURL }}` to a token-hash URL, e.g.

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Log In</a>
```

`{{ .RedirectTo }}` already carries `?next=…` (from `emailRedirectTo` in
`sendLoginLinkAction`), so appending `&token_hash=…&type=email` preserves the dynamic
`next` AND adds the stateless token. `/auth/callback` (callback route) is already on the
Auth redirect allow-list. Until this template change is made, the code change is
backward-compatible (still handles `code`) but the live flow stays broken.

## Not done / follow-ups

- **Live smoke test** against Supabase (retry after the template change): request a link
  for an existing guest email → click → land on `/results-dashboard`; and a brand-new
  email → consent → dashboard.
- Password auth left in place (additive change).
- The deprecated `/activate` magic-link path was left untouched (dead).
