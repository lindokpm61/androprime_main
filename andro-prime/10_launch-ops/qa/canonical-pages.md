# QA: Canonical Pages
## Code-level audit — April 2026

Audit method: code review against `lp-implementation-checklist.md` canonical page QA criteria.
Full read: `/kits/testosterone/`. Spot-check only on other canonical pages — full audit needed before launch.

---

## Canonical Page QA Criteria (from lp-implementation-checklist.md)

- Header still functions on desktop and mobile
- Sticky CTA anchors to the correct section
- No broken drawer/hamburger JS remains
- Footer remains intact
- Page still feels like a legitimate site page, not an orphaned campaign shell

---

## `/kits/testosterone/` — Full Review

| Check | Result | Notes |
|-------|--------|-------|
| Nav: marketing variant | PASS | Uses `<Nav>` default `variant="marketing"` |
| Full nav links visible | PASS | Tests, Supplements, Founding Member, Blog |
| Hamburger / mobile drawer functional | PASS | Nav component has working mobile toggle (code reviewed) |
| Logo links to `/` | PASS | |
| Sticky CTA in nav | PASS | "Choose your test" → `/kits` |
| Dominant CTA visible in hero | PASS | "Order the Kit — £99" prominent |
| `id="order"` section at bottom | PASS | |
| KitCheckoutButton wired | PASS | `kitType="testosterone"` |
| Trust bar present | PASS | 4 items |
| FAQ section present | PASS | FaqAccordion component |
| Biomarker detail section | PASS | 5 biomarkers with descriptions |
| GMC oversight section | PASS | |
| Kit 3 compare section at bottom | PASS | Adjacent kit link — appropriate for canonical pages |
| Canonical page indexable | PASS | No `robots: noindex` |
| Em dash in CTA button text | FAIL | "Order the Kit — £99" and "See Kit 3 — £179" use em dashes. Brand voice rule: no em dashes in published copy. |

**Action required:** Replace em dashes in CTA button copy on canonical testosterone page.

---

## Pages Not Individually Read (require audit before launch)

| Page | File | Key checks |
|------|------|-----------|
| `/kits/energy-recovery/` | `app/(marketing)/kits/energy-recovery/page.tsx` | KitCheckoutButton kitType, trust bar, FAQ, biomarkers |
| `/kits/hormone-recovery/` | `app/(marketing)/kits/hormone-recovery/page.tsx` | 9 biomarkers present, KitCheckoutButton kitType |
| `/supplements/daily-stack/` | `app/(marketing)/supplements/daily-stack/page.tsx` | SubscribeButton productSlug, EFSA claims only |
| `/supplements/collagen/` | `app/(marketing)/supplements/collagen/page.tsx` | Price correct (£29.95), SubscribeButton, no medicinal claims |
| `/kits/` (hub) | `app/(marketing)/kits/page.tsx` | Links to all 3 kit pages, no broken JS |
| `/supplements/` (hub) | `app/(marketing)/supplements/page.tsx` | Links to both supplement pages |
| `/test-selector/` | `app/(marketing)/test-selector/page.tsx` | Quiz flow, correct recommendations |
| `/founding-member/` | `app/(marketing)/founding-member/page.tsx` | Deposit CTA, correct framing (not "TRT available now") |
| `/how-it-works/` | `app/(marketing)/how-it-works/page.tsx` | Process steps accurate |
| `/faq/` | `app/(marketing)/faq/page.tsx` | No prohibited claims |
| `/about/` | `app/(marketing)/about/page.tsx` | |
| `/contact/` | `app/(marketing)/contact/page.tsx` | Form working |
| `/privacy/` | `app/(marketing)/privacy/page.tsx` | Privacy notice published |
| `/terms/` | `app/(marketing)/terms/page.tsx` | |
| `/blog/` | `app/(marketing)/blog/page.tsx` | |
| `/waitlist/` | `app/(marketing)/waitlist/page.tsx` | Form working |

---

## Known Issues

| Priority | Issue | File | Action |
|----------|-------|------|--------|
| P2 | Em dash in CTA button text | `app/(marketing)/kits/testosterone/page.tsx:63,329` | Replace `—` with colon or full stop |
| P1 | Collagen supplement canonical page: verify price is £29.95 | `app/(marketing)/supplements/collagen/page.tsx` | Read and confirm before launch |
| P1 | Founding member page: verify no TRT availability claims | `app/(marketing)/founding-member/page.tsx` | Read and audit for compliance |

---

## Items Requiring Live Test

- Header scroll behaviour (border thickness change on scroll)
- Mobile drawer open/close animation
- KitCheckoutButton loading state and Stripe redirect
- FAQ accordion expand/collapse
- Test selector quiz flow and recommendation logic
- Contact and waitlist forms submit correctly
- All internal hrefs resolve to correct pages
- Page renders at 375px, 768px, 1280px

**Blocked by:** Supabase auth (for checkout), Stripe Price IDs, Coolify deployment.
