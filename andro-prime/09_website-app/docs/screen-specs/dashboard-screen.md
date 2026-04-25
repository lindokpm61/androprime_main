# Screen Specs — Dashboard

**Version:** 1.0
**Date:** 2026-04-24
**Status:** Active
**Route:** `/app/dashboard`

---

## Purpose

The customer's single destination throughout the entire journey. Displays the current status of their order before results arrive, then switches to the full results view once results are available. The URL never changes — the screen evolves.

---

## Persistent Layout (both states)

### App nav bar

Full-width. `bg-white border-b-2 border-black`. Height `h-16`. Sticky (`position: sticky; top: 0; z-index: 50`).

Left: AndroPrime logo (wordmark).

Right (desktop): Account link — `ACCOUNT` in Inter font-black uppercase tracking-widest text-xs. On mobile: hamburger icon (square linecaps, consistent with icon system) that opens a slide-in drawer.

No marketing links in the app nav. This is a product interface, not a marketing surface.

---

## State A — Pre-Results (order placed through to analysis)

Shown when order status is any of: `order-placed`, `kit-sent`, `sample-received`, `testo-analysis`.

---

### Section 1 — Status tracker

`border-b-4 border-black`. Background `bg-white`. Padding `py-12 px-6`.

**Eyebrow:**
```
YOUR ORDER
```

**Heading (Inter font-black ~2.5rem):**
```
Your kit is on its way.
```
(or appropriate copy per current status — see status copy table below)

**Status tracker — horizontal on desktop, vertical on mobile:**

Four steps. Each step: a label + a square status dot (8px) + connecting line between steps.

| Step | Label |
|---|---|
| 1 | KIT DISPATCHED |
| 2 | SAMPLE RECEIVED |
| 3 | ANALYSING |
| 4 | RESULTS READY |

Visual treatment:
- Completed steps: dot `bg-black`, label `text-black font-black`, connecting line `bg-black h-[2px]`
- Current step: dot `bg-black` with a square outer ring (`ring-2 ring-black ring-offset-2`), label `text-black font-black`, underlined
- Upcoming steps: dot `bg-gray-200`, label `text-gray-400`, connecting line `bg-gray-200 h-[2px]`

No animation. No pulse. Static indicator only — consistent with brand.

**Status copy by order status:**

| Vitall status | Heading | Subtext |
|---|---|---|
| `order-placed` | "Your kit is being prepared." | "We've placed your order with the lab. Your kit will be dispatched within 1–2 working days." |
| `kit-sent` | "Your kit is on its way." | "Your kit has been dispatched. It should arrive within 2–3 working days." |
| `sample-received` | "We've got your sample." | "Your sample has arrived at the lab. Analysis takes 1–3 working days." |
| `testo-analysis` | "Your sample is being analysed." | "The lab is processing your results. You'll get an email as soon as they're ready." |

Subtext: Merriweather text-base text-gray-600, `max-w-lg`.

---

### Section 2 — Educational content cards

`border-t-4 border-black`. Padding `py-12 px-6`.

**Eyebrow:**
```
WHILE YOU WAIT
```

**Heading:**
```
What we're testing.
```

Four static cards in a `grid-cols-1 md:grid-cols-2 gap-6` grid. Each card: `border-2 border-black rounded-none p-8`.

**Card 1 — What the kit tests:**
Title (Inter font-black uppercase): `WHAT'S IN YOUR KIT`
Body (Merriweather): Brief plain-English description of the biomarkers in the kit ordered. Dynamically populated from order data.
- Kit 1: "Your kit tests Total Testosterone and Sex Hormone Binding Globulin — the two markers that tell you where your testosterone actually stands, not just whether you're 'in range'."
- Kit 2: "Your kit tests Vitamin D, Active B12, hs-CRP, and Ferritin — the four markers most directly linked to energy, recovery, and inflammation in active men."

**Card 2 — What testosterone does:**
Title: `TESTOSTERONE AND YOU`
Body: "Testosterone affects energy, mood, sleep quality, body composition, and libido. Most men know it matters — but very few know their actual number. The 'normal' range is 8–35 nmol/L. That's a 4x difference. Where you sit in that range matters."

**Card 3 — What happens at the lab:**
Title: `AT THE LAB`
Body: "Your sample is tested by a UKAS-accredited laboratory. Each biomarker is measured against a calibrated reference range. Your results are reviewed before they're released — you'll get a notification the moment they're ready."

**Card 4 — How to read your results:**
Title: `READING YOUR RESULTS`
Body: "Your results will show your number, what it means in plain English, and what — if anything — we'd recommend doing about it. No jargon. No generic advice. Everything you see will be specific to your numbers."

---

## State B — Post-Results

Shown when order status is `results-available` and results are stored in Supabase.

The status tracker and educational cards are replaced entirely by the results view.

---

### Section 1 — Panel summary

`border-b-4 border-black`. Padding `py-12 px-6`.

**Eyebrow:**
```
YOUR RESULTS
```

**Heading (Inter font-black ~2.5rem, dynamically generated):**

One or two lines that summarise the overall panel picture. Examples:
- "Your testosterone is in range. Your Vitamin D needs attention."
- "Your testosterone is below the optimal range."
- "All markers in range."

Copy generated from result flags and values — not a template. Written per result combination.

**Subtext (Merriweather text-base text-gray-600):**
```
Reviewed by [Dr Ewa Lindo, GMC registered]. Scroll down to see your full results.
```

**Date label** (JetBrains Mono uppercase text-xs text-gray-400):
```
RESULTS FROM [DATE]
```

---

### Section 2 — Per-biomarker result cards

Full-width column. `px-6 py-8`. Cards stacked vertically with `border-t-4 border-black` between each.

Each card follows the 5-part structure — see [biomarker-result-card.md](./biomarker-result-card.md) for the full card spec.

Card order on the dashboard follows clinical priority:
1. Testosterone (if present)
2. Vitamin D
3. Active B12
4. hs-CRP (with qualifier gate — see qualifier-card.md)
5. Ferritin
6. SHBG (if present, shown after Testosterone)

---

### Section 3 — Cross-sell (conditional)

Shown only when cross-sell conditions are met (see flow-4-results-to-action.md Part C).

`border-t-4 border-black`. `bg-gray-50`. Padding `py-12 px-6`.

**Heading:**
```
One more thing worth knowing.
```

Single card with secondary button CTA. See cross-sell logic in flow-4.

---

### Section 4 — Retest prompt (conditional)

Shown when T > 20 nmol/L (all markers in range, no supplement path).

`border-t-4 border-black`. Padding `py-12 px-6`.

**Eyebrow:**
```
WHAT'S NEXT
```

**Heading:**
```
Track the trend.
```

**Body:**
```
One result tells you where you stand today. A second result — in 3 to 6 months — tells you whether things are staying there. Men who retest get a clearer picture of what's actually driving changes.
```

**Button:**
```
SET A RETEST REMINDER  →
```
Secondary button. Triggers a simple date-picker modal. Saves a `retest_reminder_date` against the account and schedules a Customer.io reminder email.

---

## Password set prompt (first visit only)

Shown as a dismissible banner at the very top of the dashboard, above the nav, on first load after magic link authentication. Only shown if `password_prompt_dismissed` is false and no password is set.

Background: `bg-black text-white`. Full width. Padding `py-3 px-6`. Single line on desktop, two lines on mobile.

Left content:
```
Set a password to make it easier to sign in next time.
```
Inter text-sm.

Right: Two inline actions:
- `SET PASSWORD` — opens a modal (see password-set modal spec below)
- `×` dismiss icon — sets `password_prompt_dismissed` flag, removes the banner immediately

**Password set modal:**

Triggered by "SET PASSWORD" in the banner. Overlay on the dashboard — does not navigate away.

Content:
- Heading: "Set your password."
- Password field + Confirm password field
- Requirements note (Merriweather text-sm gray-600): "Minimum 8 characters."
- Primary button: `SAVE PASSWORD  →`
- On success: modal closes, banner removed, toast-style confirmation at bottom of screen: "Password set. You can now sign in with your email and password." (auto-dismisses after 4 seconds)

---

## Mobile

- Nav: logo left, hamburger right. Drawer slides in from right with `ACCOUNT` link and sign-out option.
- Status tracker: vertical stack. Dots left-aligned, labels right of dots, connecting lines vertical.
- Educational cards: single column, full width.
- Results cards: single column, full width.
- Password banner: stacks vertically, dismiss icon top-right of the banner.

---

## Component Reference

| Component | Token / class |
|---|---|
| App nav | `h-16 border-b-2 border-black sticky top-0 bg-white z-50 flex items-center justify-between px-6` |
| Section padding | `py-12 px-6` |
| Section divider | `border-t-4 border-black` |
| Status tracker container | `flex items-center gap-0` (desktop) / `flex flex-col gap-6` (mobile) |
| Tracker dot — complete | `w-2 h-2 bg-black rounded-none` |
| Tracker dot — current | `w-2 h-2 bg-black rounded-none ring-2 ring-black ring-offset-2` |
| Tracker dot — upcoming | `w-2 h-2 bg-gray-200 rounded-none` |
| Tracker line | `flex-1 h-[2px] bg-black` (complete) / `bg-gray-200` (upcoming) |
| Educational card | `border-2 border-black rounded-none p-8` |
| Password banner | `bg-black text-white py-3 px-6 flex items-center justify-between` |
| Panel summary heading | Inter font-black ~2.5rem leading-tight |
| Results date label | JetBrains Mono uppercase tracking-[0.15em] text-xs text-gray-400 |
