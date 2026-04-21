# Launch Readiness
## April 2026 — Phase 0

Status as of 2026-04-20. Based on code audit, outstanding tasks memory, and QA docs.

---

## How to Use This Document

Work through each section in order. Nothing in a later section can be signed off until all blocking items in the earlier sections are resolved. Compliance blockers are non-negotiable — they gate everything else.

---

## Section 1: Compliance (must complete before first public order)

| Item | Owner | Status |
|------|-------|--------|
| Ewa sign-off: biomarker thresholds for Kit 1, 2, 3 (low/borderline/normal/optimal bands) | Ewa | NOT STARTED |
| Prohibited terms list agreed in writing (Keith and Ewa) | Keith + Ewa | NOT STARTED |
| Brand/CQC content audit — all pages against prohibited terms | Keith | NOT STARTED |
| Founding member CTA copy — Ewa written sign-off | Ewa | NOT STARTED |
| Inter-company brand licence: Prima Medical Group Ltd → Andro Prime Ltd | Solicitor | NOT STARTED |
| Data Controller position documented (Prima Medical Group as controller) | Solicitor | NOT STARTED |
| DPIA completed and filed (ICO template) | Keith | NOT STARTED |
| Privacy notice live on website | Keith | NOT STARTED |
| Deposit refund terms drafted and published | Solicitor | NOT STARTED |
| Deposits held in designated account separate from operating revenue | Keith | NOT STARTED |
| Customer deposit acknowledgement checkbox live at checkout | Dev | NOT STARTED |
| Thriva data processing agreement in lab contract | Legal | NOT STARTED |

---

## Section 2: Lab Partner

| Item | Owner | Status |
|------|-------|--------|
| Partnership enquiry sent to Thriva Solutions | Keith | NOT STARTED |
| Partnership enquiry sent to Vitall (backup) | Keith | NOT STARTED |
| Benchmark pricing enquiries sent to BloodLink and Forth | Keith | NOT STARTED |
| Discovery calls booked and completed | Keith | NOT STARTED |
| Lab contract signed (API access, DPA, white-label branding, rolling term) | Keith | NOT STARTED |
| Thriva dispatch stub replaced with real API call | Dev | BLOCKED (lab contract) |

---

## Section 3: Supplement Manufacturer

| Item | Owner | Status |
|------|-------|--------|
| Quotes received from Supplement Factory / Natures Aid / Arena Health (1k + 2.5k MOQs) | Keith | NOT STARTED |
| Ashwagandha novel food regulatory position confirmed (FSA, unchanged since March 2026) | Keith | NOT STARTED |
| Stability testing arranged (FSA requirement — non-negotiable before first shipment) | Manufacturer | NOT STARTED |
| Label design complete and compliance reviewed | Designer | NOT STARTED |
| Ewa sign-off on label before print | Ewa | NOT STARTED |
| Gate 0A met: 25+ supplement pre-orders with deposits received | — | NOT MET |

---

## Section 4: Environment and Deployment

| Item | Owner | Status |
|------|-------|--------|
| Supabase project created (EU Frankfurt region) | Dev | NOT STARTED |
| Supabase DPA signed | Dev | NOT STARTED |
| Database migrations run (`database/migrations/`) | Dev | NOT STARTED |
| Stripe Price IDs created for all 7 products | Dev | NOT STARTED |
| All env vars set in `.env.local` and Coolify | Dev | NOT STARTED |
| Coolify VPS deployment configuration complete | Dev | NOT STARTED |
| Monitoring setup complete | Dev | NOT STARTED |
| Customer.io account created | Keith | NOT STARTED |
| Customer.io sequences seq-01 through seq-05 built | Dev/Keith | NOT STARTED |
| FirstPromoter account set up (`FIRSTPROMOTER_API_KEY`) | Keith | NOT STARTED |

---

## Section 5: Code Fixes (from QA audit)

These must be fixed before any page goes live.

| Item | Priority | File | Status |
|------|----------|------|--------|
| Collagen LP price: fix £39.95 → £29.95 everywhere | P0 | `app/lp/collagen/page.tsx` | FIXED 2026-04-20 |
| hormone-recovery LP: wire checkout button (plain `<button>` does nothing) | P0 | `app/lp/hormone-recovery/page.tsx` | FIXED 2026-04-20 |
| Foundations LP: remove "FSA/HSA eligible" (US term, UK business) | P1 | `app/lp/foundations/page.tsx` | FIXED 2026-04-20 |
| Testosterone + energy-recovery LPs: remove/demote competing Kit 3 upsell CTAs from hero | P1 | Both LP pages | NOT FIXED |
| Daily Stack + Collagen LPs: replace em dashes in copy | P2 | Both LP pages | NOT FIXED |
| hormone-recovery LP: replace em dashes in copy | P2 | `app/lp/hormone-recovery/page.tsx` | NOT FIXED |
| Canonical testosterone page: replace em dash in CTA button | P2 | `app/(marketing)/kits/testosterone/page.tsx` | NOT FIXED |
| All LP variants: add unique `id` to each CTA element | P2 | All LP pages | NOT FIXED |
| Decision: keep `/lp/hormone-recovery/` or `/lp/foundations/` (duplicate Kit 3 LP) | P1 | — | UNDECIDED |

---

## Section 6: QA Sign-Off

Each QA doc must have all blocking items resolved before sign-off.

| Document | Status |
|----------|--------|
| `qa/lp-pages.md` | IN PROGRESS — blocking issues documented |
| `qa/canonical-pages.md` | PARTIAL — testosterone only, others pending read |
| `qa/results-dashboard.md` | BLOCKED — Ewa thresholds, Supabase, Thriva |
| `qa/checkout.md` | BLOCKED — Stripe Price IDs, Supabase |
| `qa/mobile-responsive.md` | PARTIAL — code review complete, browser test pending |

---

## Section 7: Marketing and Pre-Launch

| Item | Owner | Status |
|------|-------|--------|
| 5 pre-launch LinkedIn posts written and scheduled | Keith | NOT STARTED |
| Influencer outreach: DM 40-60 UK micro-influencers | Keith | NOT STARTED |
| 15-20 kit sends confirmed | Keith | NOT STARTED |
| PT affiliate network outreach (300+ contacts target) | Keith | NOT STARTED |
| Pre-launch waitlist LP live | Dev/Keith | NOT STARTED |
| 200+ waitlist sign-ups achieved before Day 0 | — | NOT MET |
| Google Search campaign structure built | Keith | NOT STARTED |
| Meta pixel installed and event tracking configured | Dev | NOT STARTED |

---

## Section 8: Content and Workflow

| Item | Owner | Status |
|------|-------|--------|
| ClickUp content review list created | Keith | NOT STARTED |
| n8n `content-review-trigger` workflow activated with real credentials | Dev | NOT STARTED |
| n8n `kpi-weekly-digest` workflow activated | Dev | NOT STARTED |
| n8n `deposit-gate-alert` workflow activated | Dev | NOT STARTED |
| Supabase `content_review_log` table live | Dev | NOT STARTED |
| Retroactive LinkedIn content audit against prohibited terms | Keith | NOT STARTED |

---

## Launch Decision

Do not open orders to the public until the following are complete:

1. All Section 1 (compliance) items — no exceptions
2. Lab contract signed (Section 2)
3. All P0 and P1 code fixes (Section 5)
4. Supabase and Stripe live (Section 4)
5. Privacy notice published (Section 1)
6. Checkout QA live test passed (Section 6)

Everything else can run in parallel or shortly after.
