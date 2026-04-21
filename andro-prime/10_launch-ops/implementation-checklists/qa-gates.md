# QA Gates
## April 2026 — Phase 0

Defines what must pass before each phase of launch can proceed. A gate is either open or closed. If closed, the associated work does not ship.

---

## Gate 1: LP Pages Ship

Must pass before any LP URL is promoted (paid ads, affiliate links, influencer posts, social).

### Required

- [ ] All P0 and P1 code fixes from `qa/lp-pages.md` resolved:
  - [ ] Collagen LP price corrected to £29.95/month
  - [ ] hormone-recovery LP checkout button wired OR page removed
  - [ ] Foundations LP FSA/HSA claim removed
  - [ ] Testosterone and energy-recovery LP upsell CTAs removed from hero
- [ ] Duplicate Kit 3 LP decision made (keep `/lp/foundations/` or `/lp/hormone-recovery/`, not both)
- [ ] Prohibited terms audit passed on all LP copy
- [ ] Ewa sign-off on founding member CTA copy
- [ ] Privacy notice published on website
- [ ] All LP pages render correctly at 375px, 768px, 1280px (browser test)
- [ ] All `#order` anchors resolve correctly
- [ ] Meta pixel installed (for LP traffic measurement)

### Optional at Gate 1 (can ship without)
- Unique CTA IDs added
- noindex decision made
- Em dashes replaced (P2 — fix before scale, not before soft launch)

---

## Gate 2: Canonical Pages Ship (public indexing)

Must pass before canonical kit and supplement pages are submitted to Google Search Console.

### Required

- [ ] All canonical pages read and audited individually (see `qa/canonical-pages.md` — currently only testosterone done)
- [ ] Canonical testosterone page em dash fixed in CTA
- [ ] Supplement collagen canonical page: price confirmed as £29.95
- [ ] Founding member canonical page: no TRT availability claims
- [ ] Privacy, Terms pages live and linked in footer
- [ ] Test selector quiz tested end-to-end

---

## Gate 3: Checkout Live

Must pass before taking real money.

### Required

- [ ] Supabase project live (EU Frankfurt, DPA signed, migrations run)
- [ ] Stripe in live mode: all 7 Price IDs created and set in env vars
- [ ] Kit checkout flow end-to-end tested (all 3 kits)
- [ ] Subscription checkout flow end-to-end tested (Daily Stack, Collagen)
- [ ] Founding member deposit flow tested
- [ ] Stripe webhook: checkout.session.completed creates order record
- [ ] Supabase order record contains correct user_id, kit_type, and status
- [ ] Thriva dispatch called after kit purchase (stub or real)
- [ ] Customer.io triggered after purchase (seq-01 confirmation)
- [ ] Deposit acknowledgement checkbox present at checkout
- [ ] Deposit funds route to designated account (not operating account)

---

## Gate 4: Results Dashboard Live

Must pass before real results are shown to any user.

### Required

- [ ] Ewa threshold sign-off document complete and filed
- [ ] Lab contract signed (real Thriva data flowing)
- [ ] Thriva webhook handler live and tested
- [ ] Auth redirect verified (unauthenticated users sent to `/auth/login`, not blank page)
- [ ] Compliance component review complete:
  - [ ] No "diagnose"/"diagnosis" in any MarkerCard or ResultExplain copy
  - [ ] "Your results indicate..." framing confirmed throughout
  - [ ] Founding member CTA fires only on T < 12 nmol/L from Kit 1 or Kit 3
  - [ ] Collagen CTA requires hs-CRP elevation AND joint symptoms qualifier
  - [ ] No TRT availability claim in founding member CTA copy
- [ ] All 10 dev fixture scenarios tested in development
- [ ] Results dashboard mobile layout verified at 375px

---

## Gate 5: Marketing Scale

Must pass before paid ads spend increases past testing budget or affiliate codes issued at scale.

### Required

- [ ] Gate 1 and Gate 3 both passed
- [ ] Meta pixel installed and verified (Events Manager)
- [ ] Google Search campaigns built and tracking set up
- [ ] FirstPromoter set up and linked to Stripe
- [ ] Affiliate silent ingredient brief delivered in writing (ashwagandha rule)
- [ ] Gate 0A met: 25+ supplement pre-orders OR Gate 0A decision made to proceed without it

---

## Gate 0A: Supplement Inventory Order

Do not place supplement MOQ order until this gate passes.

### Required

- [ ] 25+ supplement pre-orders with confirmed deposits received
- [ ] Lab contract signed (so kit revenue is live before committing inventory spend)
- [ ] Manufacturer quote accepted
- [ ] Stability testing path confirmed
- [ ] Label design approved by Ewa

---

## CQC Trigger (not a gate — a trigger)

When 40+ founding member deposits received, begin CQC application regardless of other gate status.

| Metric | Current | Trigger |
|--------|---------|---------|
| Founding member deposits | 0 | 40 |

---

## Summary

| Gate | Prerequisite for | Currently |
|------|-----------------|-----------|
| Gate 1: LP Pages Ship | Affiliate + social promotion | CLOSED |
| Gate 2: Canonical Pages Ship | SEO indexing | CLOSED |
| Gate 3: Checkout Live | Taking real orders | CLOSED |
| Gate 4: Results Dashboard Live | Showing real results | CLOSED |
| Gate 5: Marketing Scale | Paid ads + affiliate scale | CLOSED |
| Gate 0A: Supplement Order | Inventory commitment | CLOSED |

All gates closed as of 2026-04-20. Primary blocker for everything: Section 1 compliance items and Supabase/Stripe environment setup.
