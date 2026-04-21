# QA: LP Pages
## Code-level audit — April 2026

Audit method: code review of all LP page TSX files against `lp-implementation-checklist.md` criteria.
Live browser testing blocked pending: Supabase project, Stripe Price IDs, Coolify deployment.

---

## LP Shell (shared) — tested via `app/lp/layout.tsx` and `components/shared/Nav.tsx`

| Check | Result | Notes |
|-------|--------|-------|
| Logo only in header | PASS | Nav `variant="lp"` hides all browse links |
| No hamburger or mobile drawer | PASS | `showLinks = variant !== 'lp'` removes both |
| Single CTA in nav | PASS | Defaults to `href="#order"` |
| Legal footer present | PASS | Minimal footer in LP layout |
| No blog links | PASS | Confirmed across all variants |

---

## LP Variant: `/lp/testosterone/`

| Check | Result | Notes |
|-------|--------|-------|
| Header: logo only, single CTA | PASS | Via LP layout |
| All CTA buttons point to same action | FAIL | Hero and final CTA both contain upsell text link to `/lp/hormone-recovery` — competing CTA visible in hero above fold |
| No supplement links | PASS | |
| No public clinical-path distraction | PASS | |
| Trust proof present | PASS | Trust bar with 4 items |
| KitCheckoutButton wired | PASS | `kitType="testosterone"` |
| `id="order"` anchor on final CTA section | PASS | |
| Unique IDs on individual CTA elements | FAIL | No `id` on buttons/links — blocks granular analytics tracking |
| `.type-hero-page` class on H1 | FAIL | Uses inline Tailwind classes only |
| No hardcoded hex colours | PASS | All Tailwind tokens |

**Action required:**
- Remove or visually demote the Kit 3 upsell link from hero so it does not appear as a competing CTA above the fold. Move to a post-CTA footnote if retention is preferred.
- Add unique `id` attributes to each CTA button/link.

---

## LP Variant: `/lp/energy-recovery/`

| Check | Result | Notes |
|-------|--------|-------|
| Header: logo only, single CTA | PASS | Via LP layout |
| All CTA buttons point to same action | FAIL | Hero and order card both contain text link to `/lp/hormone-recovery` ("Want testosterone markers too? Kit 3 for £69") |
| No supplement links | PASS | |
| Trust proof present | PASS | Trust bar + clinical oversight |
| KitCheckoutButton wired | PASS | `kitType="energy-recovery"` |
| `id="order"` anchor | PASS | On FAQ/order section |
| Unique IDs on CTA elements | FAIL | |
| `.type-hero-page` on H1 | FAIL | Inline Tailwind |
| No hardcoded hex colours | PASS | |

**Action required:**
- Remove or demote Kit 3 upsell text link from hero and order card sticky panel.
- Add unique IDs to CTA elements.

---

## LP Variant: `/lp/foundations/`

| Check | Result | Notes |
|-------|--------|-------|
| Header: logo only | PASS | |
| All CTAs point to same action | PASS | No competing upsell links in this variant |
| Kit 3 clearly justified | PASS | "9 biomarkers", "full picture" framing |
| No competing downgrade CTA | PASS | No Kit 1/Kit 2 buy links |
| Trust proof present | PASS | Clinical oversight section |
| KitCheckoutButton wired | PASS | `kitType="hormone-recovery"` — correct, maps to Kit 3 price ID |
| `id="order"` anchor | PASS | |
| Unique IDs on CTAs | FAIL | |
| FSA/HSA claim | FAIL | CTA section footer reads "FSA/HSA eligible" — US tax accounts, not applicable to UK customers. Remove. |
| `.type-hero-page` on H1 | FAIL | Inline Tailwind |

**Action required:**
- Remove "FSA/HSA eligible" from CTA footer copy.
- Add unique IDs to CTA elements.

---

## LP Variant: `/lp/daily-stack/`

| Check | Result | Notes |
|-------|--------|-------|
| Header: logo only | PASS | |
| No one-off CTA | PASS | Only SubscribeButton present |
| No bundle CTA | PASS | |
| All CTAs route to subscription path | PASS | `productSlug="daily-stack"` |
| Trust proof present | PASS | Clinical oversight, EFSA claims shown |
| `id="order"` anchor | PASS | |
| Unique IDs on CTAs | FAIL | |
| Em dashes in copy | FAIL | "Subscribe &mdash; £34.95/mo" in hero CTA and "four things most men over 35 are genuinely low in &mdash; in one daily sachet" — brand voice rule: no em dashes in published copy |
| `.type-hero-page` on H1 | FAIL | Inline Tailwind |
| Ashwagandha not mentioned | PASS | Silent ingredient rule observed |

**Action required:**
- Replace em dashes with full stops or commas per brand voice rules.

---

## LP Variant: `/lp/collagen/`

| Check | Result | Notes |
|-------|--------|-------|
| Header: logo only | PASS | |
| No one-off CTA | PASS | |
| No bundle CTA | PASS | |
| All CTAs route to subscription | PASS | `productSlug="collagen"` |
| Trust proof present | PASS | |
| `id="order"` anchor | PASS | |
| Unique IDs on CTAs | FAIL | |
| Price correct | CRITICAL FAIL | Page shows £39.95/month throughout (hero CTA, order card). Product spec defines collagen at £29.95/month. Price wrong by £10/month. |
| Em dashes in copy | FAIL | "Subscribe &mdash; £39.95/mo" twice (hero, built-for section) |
| `.type-hero-page` on H1 | FAIL | |

**Action required:**
- Fix price to £29.95/month across all instances before any page goes live.
- Replace em dashes.

---

## Undocumented 6th LP: `/lp/hormone-recovery/`

This page exists and was not in the original 5-variant plan. It duplicates `/lp/foundations/` — both are Kit 3 at £69.

| Check | Result | Notes |
|-------|--------|-------|
| Checkout button wired | CRITICAL FAIL | Uses plain `<button>` element, no checkout API call. Clicking does nothing. |
| Compare table | FAIL | Shows "Order →" links for Kit 1 and Kit 2 pointing to canonical pages — browse exits from an LP |
| Em dashes in copy | FAIL | "Order the Kit &mdash; £69" multiple times |
| Unique IDs on CTAs | FAIL | |
| Noindex tag | FAIL | No noindex — duplicate of `/lp/foundations/` |

**Decision required:**
- Choose one Kit 3 LP route and redirect or remove the other.
- If keeping `/lp/hormone-recovery/`, wire checkout with `KitCheckoutButton kitType="hormone-recovery"`.

---

## Summary Table

| Variant | Shell | CTA Focus | Trust | Checkout | Blocking Issues |
|---------|-------|-----------|-------|----------|-----------------|
| `/lp/testosterone/` | PASS | FAIL | PASS | PASS | Competing upsell, no CTA IDs |
| `/lp/energy-recovery/` | PASS | FAIL | PASS | PASS | Competing upsell, no CTA IDs |
| `/lp/foundations/` | PASS | PASS | PASS | PASS | FSA/HSA claim, no CTA IDs |
| `/lp/daily-stack/` | PASS | PASS | PASS | PASS | Em dashes, no CTA IDs |
| `/lp/collagen/` | PASS | PASS | PASS | PASS | Wrong price, em dashes |
| `/lp/hormone-recovery/` | PASS | FAIL | PASS | CRITICAL FAIL | Checkout not wired, duplicate route |

---

## Issues Requiring Fix Before Launch

| Priority | Issue | File | Action |
|----------|-------|------|--------|
| P0 | ~~Collagen price wrong (£39.95 not £29.95)~~ | `app/lp/collagen/page.tsx` | FIXED 2026-04-20 |
| P0 | ~~hormone-recovery LP checkout not wired~~ | `app/lp/hormone-recovery/page.tsx` | FIXED 2026-04-20 — KitCheckoutButton wired |
| P1 | ~~FSA/HSA claim (US term, UK business)~~ | `app/lp/foundations/page.tsx` | FIXED 2026-04-20 — replaced with correct copy |
| P1 | Competing upsell CTAs on testosterone and energy-recovery | Both LP pages | Move upsell below CTA section or remove |
| P2 | Em dashes in daily-stack and collagen copy | Both LP pages | Replace per brand voice rules |
| P2 | Em dashes on hormone-recovery LP | `app/lp/hormone-recovery/page.tsx` | Replace |
| P2 | No unique IDs on CTA elements | All LP variants | Add `id` per analytics requirements |
| P3 | H1s not using `.type-hero-page` class | All LP variants | Refactor to semantic class |
| INFO | LP pages have no noindex tag | All LP variants | Decision pending per architecture spec |
