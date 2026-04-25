# Screen Specs — Auth Screens

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Routes covered:** `/auth/login`, `/auth/magic`, `/auth/request-link`

---

## Design Principles for Auth Screens

- Minimal. No decoration. The brand presence is the logo and the type.
- Centre-column layout. Single focused action per screen.
- No sidebar, no nav links, no distractions.
- Error states are inline — never a separate error page.
- All inputs: `border-2 border-black rounded-none` — consistent with brand.
- Auth screens are outside the main app nav. No hamburger menu, no account links.

---

## Screen 1 — Login (`/auth/login`)

### Purpose
Entry point for returning customers. Covers both password-authenticated customers and those requesting a magic link.

### Layout

**Container:** Full viewport height. Vertically centred column. Max width `max-w-sm` (384px). Horizontal padding `px-6`.

**Header (top of column):**
- Logo: AndroPrime wordmark in Inter font-black uppercase, black on white. No logo mark needed at this size. Centred.
- Below logo: `border-b-2 border-black` divider, full width of the container.

**Body:**

Eyebrow label (JetBrains Mono, uppercase, tracking wide):
```
SIGN IN
```

Heading (Inter font-black, ~2rem):
```
Welcome back.
```

Subtext (Merriweather, body, gray-600):
```
Enter your email and password below.
```

Form:
- Email field
  - Label: `EMAIL ADDRESS` (Inter font-black uppercase text-xs tracking-widest)
  - Input: full width, `border-2 border-black rounded-none py-3 px-4`, `font-sans text-base`
  - Type: `email`, autocomplete: `email`
- Password field
  - Label: `PASSWORD`
  - Input: full width, same styling as email
  - Type: `password`, autocomplete: `current-password`
  - Show/hide toggle: small text button aligned right inside the field — `SHOW` / `HIDE` in Inter font-black uppercase text-xs

Primary button:
```
SIGN IN  →
```
Full width. `bg-black text-white border-2 border-black rounded-none py-4 font-sans font-black uppercase tracking-widest text-sm`. Hover: inverts to `bg-white text-black`.

Divider:
```
─────── OR ───────
```
`text-gray-400 text-xs font-sans uppercase tracking-widest`. Thin `border-t border-gray-200` lines either side.

Magic link fallback (text link, not a button):
```
Send me a sign-in link instead
```
Centred. `font-sans font-black uppercase tracking-widest text-xs underline`. Routes to `/auth/request-link` pre-filled with email if entered.

**Footer (bottom of column):**
Separator line `border-t-2 border-black`.
```
Don't have an account?   Buy a kit →
```
`font-sans text-sm text-gray-600`. "Buy a kit →" links to the canonical site kit selector page. This line should feel secondary — it is for non-customers only.

### States

**Default:** Form empty, no errors shown.

**Error — wrong credentials:**
Inline error below the password field. Red is not in the palette — use black.
```
Email or password not recognised. Try again, or send a sign-in link instead.
```
`font-sans text-sm font-black border-l-4 border-black pl-3`. The phrase "send a sign-in link instead" is a hyperlink to `/auth/request-link`.

**Loading (after submit):**
Button text replaced by a static loading label: `SIGNING IN...`. Button disabled. No spinner — consistent with the no-animation brand direction.

**Success:** Redirect to `/app/dashboard`. No success screen shown.

### Mobile

Single column, full width. `px-6` padding preserved. Logo size reduced to ~20px wordmark height. All elements stack vertically. No changes to interaction model.

---

## Screen 2 — Magic Link Landing (`/auth/magic`)

### Purpose
Validates the token from the email CTA and creates a session. Customer lands here from the email — they should be on the dashboard within 1–2 seconds if the token is valid.

### Layout

**Container:** Same as Screen 1 — centred column, `max-w-sm`, vertically centred.

**Header:** Logo only. No nav. No divider needed on this screen.

### States

**State A — Validating (default on load):**

Eyebrow:
```
SIGNING YOU IN
```

Heading:
```
One moment.
```

Subtext (Merriweather, gray-600):
```
We're verifying your link.
```

No spinner. No animation. Static text. Redirect fires within 1–2 seconds on valid token.

---

**State B — Token expired:**

Eyebrow:
```
LINK EXPIRED
```

Heading:
```
This link has expired.
```

Subtext:
```
Sign-in links expire after 24 hours. Request a new one below.
```

Button:
```
SEND ME A NEW LINK  →
```
Full-width primary button. Routes to `/auth/request-link`.

---

**State C — Token already used:**

Eyebrow:
```
LINK ALREADY USED
```

Heading:
```
This link has already been used.
```

Subtext:
```
Each sign-in link works once. If you're already signed in, go to your dashboard. Otherwise, request a new link.
```

Two actions stacked:
1. Primary button: `GO TO DASHBOARD  →` → `/app/dashboard`
2. Text link below: `Send me a new link` → `/auth/request-link`

---

**State D — Token invalid / not found:**

Eyebrow:
```
LINK NOT VALID
```

Heading:
```
This link isn't valid.
```

Subtext:
```
The link may have been copied incorrectly. Request a new one and try again.
```

Button:
```
SEND ME A NEW LINK  →
```
Full-width primary button. Routes to `/auth/request-link`.

---

### Mobile
No layout changes. States are identical.

---

## Screen 3 — Request a New Link (`/auth/request-link`)

### Purpose
Allows customers without a password (or with an expired/used link) to receive a new magic link. Intentionally minimal — one field, one action.

### Layout

**Container:** Same centred column pattern.

**Header:** Logo + `border-b-2 border-black` divider.

**Body:**

Eyebrow:
```
SIGN IN
```

Heading:
```
We'll send you a link.
```

Subtext:
```
Enter your email address. We'll send a sign-in link — it's valid for 24 hours.
```

Form:
- Email field
  - Label: `EMAIL ADDRESS`
  - Input: full width, standard styling
  - Type: `email`, autocomplete: `email`
  - Pre-filled if redirected from `/auth/login` with email already entered

Primary button:
```
SEND LINK  →
```
Full-width. Same primary button style.

**Footer:**
```
Remember your password?   Sign in →
```
Routes back to `/auth/login`. Same secondary footer style as Screen 1.

### States

**Default:** Email field empty or pre-filled. No errors.

**Loading (after submit):**
Button: `SENDING...`. Disabled.

**Confirmation (same screen — no redirect):**
Form is replaced by:

Eyebrow:
```
LINK SENT
```

Heading:
```
Check your email.
```

Subtext:
```
We've sent a sign-in link to [email address]. It expires in 24 hours.
```

Small secondary note below (Merriweather text-sm gray-600):
```
Didn't get it? Check your spam folder, or tap below to try again.
```

Text link: `Send again` — resets the form to allow re-submission. Rate-limited server-side (max 3 requests per 15 minutes per email).

**Note:** The confirmation screen is identical whether the email exists in the system or not. Do not confirm or deny whether an account exists — security best practice.

**Error — invalid email format:**
Inline below the field:
```
Please enter a valid email address.
```
Client-side validation only. Same inline error style as Screen 1.

### Mobile
No layout changes.

---

## Component Reference (all auth screens)

| Component | Token / class |
|---|---|
| Page background | `bg-white` |
| Column container | `max-w-sm mx-auto px-6 min-h-screen flex flex-col justify-center` |
| Logo wordmark | Inter font-black uppercase tracking-tighter, ~24px |
| Eyebrow label | JetBrains Mono uppercase tracking-[0.15em] text-xs |
| Screen heading | Inter font-black ~2rem |
| Body text | Merriweather text-base text-gray-600 leading-relaxed |
| Input field | `w-full border-2 border-black rounded-none py-3 px-4 font-sans text-base focus:outline-none focus:ring-0 focus:border-black` |
| Input label | Inter font-black uppercase tracking-widest text-xs mb-1 |
| Primary button | `w-full bg-black text-white border-2 border-black rounded-none py-4 font-sans font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors duration-200` |
| Inline error | `font-sans text-sm font-black border-l-4 border-black pl-3 mt-2` |
| Divider line | `border-t-2 border-black` |
| Footer text | `font-sans text-sm text-gray-600` |
| Text link | `font-sans font-black uppercase tracking-widest text-xs underline` |
