# Phase 0 Pre-Launch Triage

**Date:** 2026-05-12
**Owner:** Keith Antony
**Sprint horizon:** 14 days expected (target 26 May 2026), 21 days planned (cushion 2 June 2026)
**Launch definition:** Customer can place an order, pay, receive a kit, get a result back. Operational minimum.
**Source inputs:** 54 outstanding tasks from memory punch list + 12 V7 implications items
**Status:** LOCKED 2026-05-12 — Decisions 1-5 confirmed by Keith. Cowork prompt built against this triage.

---

## Triage Method

For each item, the test is: *"If this is not done on launch day, can a customer still place an order, pay, receive a kit, and get a result back?"*

- **YES, customer journey works without it** → Bucket 3 (soft-launch) or Bucket 4 (parallel)
- **NO, customer journey breaks without it** → Bucket 1 (pre-launch)

V7 §11 items get cross-mapped to outstanding items where they overlap, to avoid double-tracking.

---

## BUCKET 1 — HARD PRE-LAUNCH (must be done before first paying customer)

These items genuinely gate the launch. If they're not done, either the customer journey is broken or you're exposed to a real regulatory/compliance risk.

### B1a. Compliance hard blockers (8 items)

| # | Item | Why it gates launch | V7 §11 overlap |
|---|------|---------------------|----------------|
| 1 | Ewa threshold sign-off — biomarker bands Kit 1/2/3 | Without thresholds, the results dashboard cannot display real data. Customer journey breaks at "get a result back." | V7 row 5 (Ewa retainer arrangement confirmed) |
| 2 | Ewa sign-off on prohibited-terms.md | Required for content/copy across site, emails, dashboard. Without it, ASA/MHRA exposure on every customer touchpoint. | V7 row 4 (Ewa review step in content workflow) + V7 row 5 |
| 3 | Founding-member CTA language — Ewa sign-off | FM opt-in copy needs clinical sign-off before going live. | V7 row 5 |
| 4 | Inter-company brand licence | This one is **arguable** — see notes below. Likely defer to Bucket 4 if single-entity decision (V7 §2.1) supersedes the need for inter-company licence. |
| 5 | Data Controller doc — Prima Medical Group Ltd details + ICO + solicitor | Required for lawful processing under GDPR. Cannot accept customer data without this. | V7 row 10 (signup flow consent broadening) |
| 6 | Supplement pre-order prices — fill £TBC | If supplements are sold at launch, prices must be locked. If supplements deferred to post-launch (Gate 0A trigger), this is Bucket 3. **Needs Keith call.** |
| 7 | Lab partner DPA — Vitall service agreement | Without DPA in place, you cannot legally transfer customer PII to Vitall. Customer journey breaks at "receive a kit / get a result." |
| 8 | Solicitor confirmation on lawful basis (Consent / Article 6(1)(a)) | Required for legal defensibility of FM list and data processing. |
| 9 | Vitall clinical-governance posture confirmation | If Vitall doesn't provide clinical sign-off on results, Ewa becomes the sign-off authority and her involvement scope expands. Affects items 1, 2, 3. |

**Net new compliance: 8 items** (excluding item 4 which is conditional)

### B1b. Vitall integration (must work end-to-end before any kit ships)

| # | Item | Why it gates launch |
|---|------|---------------------|
| 10 | Vitall service agreement reply to Ben (7-point reply draft ready) | Until this conversation closes, Vitall integration is not contracted. |
| 11 | Provide Ben alternative contact for credentials zip password | Procedural, but blocks credential handover. |
| 12 | End-to-end test in Vitall don't-fulfil mode for each kit type | Cannot ship a real kit without confirming the integration works in test mode first. Customer journey validation. |
| 13 | Confirm webhook retry policy + failed sample handling with Vitall | Edge case but if a sample fails on launch day, you need to know how to handle it. |
| 14 | QR/barcode on physical kit ↔ digital activation link | Required for customer to activate their kit. Customer journey breaks at activation. |
| 15 | Engineering: Vitall webhook flow + types | If `lib/vitall/` result normaliser is broken, results never reach customer. |
| 16 | Engineering: rename THRIVA_ env vars → VITALL_ | Hygiene but if any reference remains, integration breaks. |
| 17 | 48h vs 72h SLA written confirmation from Vitall | If launch copy says 48h and Vitall delivers 72h, customer-facing exposure on day 1. Required to lock copy. |
| 18 | Send webhook URL + secret to Ben | Currently in flight. Without this, webhook doesn't fire. **Already drafted — needs sending.** |
| 19 | VITALL_WEBHOOK_SECRET in Coolify | Once Ben confirms, env var must be set. |

**Net new Vitall: 10 items**

### B1c. Checkout, auth, payments (must work or no orders)

| # | Item | Why it gates launch |
|---|------|---------------------|
| 20 | Azure app registration for Microsoft OAuth | If using MS OAuth for login, this is blocking. **Question: is MS OAuth in scope for launch, or is email-only sufficient?** Could move to Bucket 3 if not required. |
| 21 | Coolify Stripe price IDs (DAILY_STACK, COLLAGEN, COMPLETE_STACK) | If supplements ship at launch, these must be set. If supplements deferred, move to Bucket 3. **Tied to item 6 decision.** |
| 22 | Archive STRIPE_PRICE_FOUNDING_MEMBER | Hygiene — non-cash FM list shouldn't have a Stripe Price object linked. Low effort, do it. |
| 23 | Self-serve "leave founding-member list" page | If FM list is live, GDPR requires self-serve removal. Currently using mailto — acceptable for launch? **Compliance call needed.** |

**Net new checkout: 4 items** (with 2 conditional pending Keith decisions)

### B1d. App / results dashboard (the "get a result back" step)

| # | Item | Why it gates launch |
|---|------|---------------------|
| 24 | Live data wiring (results dashboard) | Customer journey requires this. Blocked on items 1 (Ewa thresholds) and 7 (Vitall DPA). |

**Net new dashboard: 1 item** (downstream of others)

### B1e. Environment / deployment (must be live)

| # | Item | Why it gates launch |
|---|------|---------------------|
| 25 | Build all CIO sequences + transactional emails | Without transactional emails, customer doesn't get order confirmation, activation email, results-ready email. Customer journey breaks. **IN PROGRESS.** |
| 26 | Activate n8n workflows with real credentials | Order-to-fulfilment automation. Without it, manual handling on every order. Possibly survivable for first N orders, but risky. |

**Net new environment: 2 items**

### B1f. QA (must pass before paying customers)

| # | Item | Why it gates launch |
|---|------|---------------------|
| 27 | Canonical pages audit (10 pages) | If pages have wrong pricing, broken links, missing legal copy — customer-facing issues on launch day. |
| 28 | QA checkout E2E | Single most important pre-launch test. Blocked on Stripe + Supabase + Vitall live credentials. |
| 29 | QA results dashboard with real data | Cannot launch without verifying customer can actually see their results. |
| 30 | Live browser mobile QA at 375/390/768/1280 | Most customers will be on mobile. A broken mobile experience equals zero conversion. |

**Net new QA: 4 items**

### B1g. V7 §11 items not already mapped above

| V7 item | Bucket 1 placement | Notes |
|---------|-------------------|-------|
| Brand voice update to lead with "patient-owned data" | YES Bucket 1 | Affects every customer-facing surface |
| Content pipeline pillar mix (40/40/20) | YES Bucket 1 | Affects pre-launch content production |
| Customer.io lifecycle: wellness-tier journey | YES Bucket 1 | Part of CIO sequences (item 25 above), expands scope |
| Ewa review step in content workflow | Mapped to compliance items 1, 2, 3 | Same item, different framing |
| Ewa retainer arrangement confirmed and signed | Mapped to compliance items 1, 2, 3 | Same item |
| Phase 0 dashboard adds gate metrics + cash position tile | YES Bucket 1 | If launch happens without measurement infrastructure, gate evaluation impossible |
| Tracker analytics infrastructure (log-in tracking) scoped | YES Bucket 1 | Scoping is pre-launch; actual build can run into M1-M2 |
| Founder bridge loan availability confirmed for M11 | NO — Bucket 4 | M11 is 5+ months away; confirmation can happen pre-M9 |
| Tracker v1 designed as brand-visible asset | NO — Bucket 4 | Tracker v1 ships M3-M4 per decision doc, not pre-launch |
| Signup flow consent broadens to allow downstream clinical opt-in | YES Bucket 1 | Mapped to compliance items 5, 8 |
| CRM tags for future hair loss / GLP-1 segmentation | YES Bucket 1 | Trivial to do pre-launch, expensive to retrofit |
| Documented Gate failure response protocols | YES Bucket 1 | Should exist before Gate 0A fires at Week 6 |

**Net new V7-specific (not duplicated): 7 items**

### B1h. Content review and brand

| # | Item | Why it gates launch |
|---|------|---------------------|
| 31 | Prohibited terms list agreed in writing between Keith and Ewa | Required for content sign-off workflow (V7-derived). Mapped to compliance item 2 — same item different framing. **No new item.** |
| 32 | Retroactive audit of published LinkedIn content against prohibited terms | If existing posts contain prohibited language, exposure exists from day 1 of launch. |
| 33 | Kit 3 result conflict rule — copy not yet written | If Kit 3 returns conflict result on launch day, you have no copy. Blocking edge case. |
| 34 | Voice review on brand "From £99 one-liner" | Customer-facing brand copy. Should be voice-checked before launch. |

**Net new content/brand: 3 items** (item 31 already counted in compliance)

### B1i. V2.2 pricing migration

| # | Item | Why it gates launch |
|---|------|---------------------|
| 35 | Regression test after SLA confirmed | All pricing must be consistent on launch day. Send test emails through each sequence. Verify Stripe charges £99/£119/£179. |

**Net new pricing: 1 item**

---

## BUCKET 1 SUMMARY

**Total Bucket 1 items: ~33 unique** (after deduplication of V7 ↔ outstanding overlaps)

Breakdown by area:
- Compliance: 8
- Vitall integration: 10
- Checkout/auth/payments: 4 (with 2 conditional)
- Results dashboard: 1
- Environment/deployment: 2
- QA: 4
- Content/brand: 3
- Pricing migration: 1

This is the sprint scope. **33 items in 21 days = ~1.6 items per day.** Achievable but tight, especially given external dependencies (Ewa availability, Vitall response time, solicitor review).

---

## BUCKET 2 — V7 §11 ITEMS (already absorbed into Bucket 1)

7 V7 items are already in Bucket 1 (see B1g above). 5 V7 items are deferred:

| V7 item | Why deferred | Bucket |
|---------|--------------|--------|
| Ewa review step in content workflow | Duplicate of compliance items | Already in B1 |
| Ewa retainer arrangement confirmed | Duplicate of compliance items | Already in B1 |
| Founder bridge loan confirmed for M11 | M11 is 5+ months away; not a pre-launch item | Bucket 4 |
| Tracker v1 designed as brand-visible asset | Tracker v1 ships M3-M4, not pre-launch | Bucket 4 |
| Tracker analytics infrastructure scoped | Scoping is pre-launch (in B1); build runs M1-M3 | Bucket 4 for build |

---

## BUCKET 3 — SOFT-LAUNCH WINDOW (first 1-3 weeks live)

Not pre-launch critical. Customer can buy a kit without these being done. These activate demand and acquisition; they don't gate the operational ability to serve a customer.

| # | Item | Notes |
|---|------|-------|
| 36 | Post Keith's 5 pre-launch LinkedIn posts | Drafts exist. Can post first week of launch. Launch != demand activation. |
| 37 | Influencer outreach: 40-60 UK micro-influencers, free kits to 15-20 | Multi-week activity. Start during launch week. |
| 38 | PT affiliate network outreach (300+ contacts) | This is a *campaign*, not a task. Spread over weeks 1-4. |
| 39 | FirstPromoter account setup + API key | Required for affiliate tracking. Can be set up post-launch as first PTs onboard. |
| 40 | Pre-launch waitlist (200+ sign-ups target) | The waitlist *is* a pre-launch activity but the **target** is post-launch. If the FM list (which is live pre-launch) acts as the waitlist mechanism, this might already be running. |
| 41 | Google Search campaign structure | Paid acquisition planning; can launch Week 2-3. |
| 42 | Meta pixel + event tracking | Implementation can be done pre-launch (~half day) but the campaigns it serves are post-launch. **Edge case: implement pre-launch, deploy post-launch.** |
| 43 | Verify ?promo= URL param applies FirstPromoter coupon | Blocked on FirstPromoter setup. |
| 44 | SUBSCRIBER10 Stripe coupon (10% off, 14-day validity) | Needs creating if used in launch promo. **Question: is SUBSCRIBER10 used in pre-launch comms?** If yes, Bucket 1. If launch-week onwards, Bucket 3. |
| 45 | Build replacement n8n workflow for founding_member_list opt-in alerts | Nice-to-have for ops visibility. Manual handling acceptable for first few opt-ins. |
| 46 | Update lab-partner-comparison.md + lab-partner-rankings-addendum.md | Internal documentation hygiene. Not customer-facing. |

**Total Bucket 3: 11 items**

---

## BUCKET 4 — PARALLEL / EXTERNAL (do not put on critical path)

Blocked on external parties, or naturally happen later in the timeline.

| # | Item | Why parallel |
|---|------|--------------|
| 47 | Inter-company brand licence (item 4 above) | **Open question:** V7 §2.1 reaffirms single-entity. If Andro Prime Ltd is the only entity, inter-company licence may not be required. Solicitor call to confirm. If not needed, drop from list entirely. |
| 48 | Supplement manufacturer: ashwagandha novel food check | Supplements blocked on Gate 0A (25+ pre-orders). Gate 0A is *post*-launch. |
| 49 | Supplement manufacturer: stability testing | Same — post Gate 0A. |
| 50 | Supplement manufacturer: label design + Ewa sign-off | Same — post Gate 0A. |
| 51 | Founder bridge loan confirmed for M11 (V7) | M11 is 5+ months away. |
| 52 | Tracker v1 design as brand-visible asset (V7) | Ships M3-M4. |
| 53 | Tracker analytics build (V7 — scoping in B1, build later) | Scoping pre-launch; build M1-M3. |
| 54 | Drop legacy `founding_member_deposits` Supabase table | Currently FROZEN. Drop when historical rows confirmed unneeded. |

**Total Bucket 4: 8 items**

---

## DECISIONS LOCKED (2026-05-12)

| Decision | Outcome | Impact |
|----------|---------|--------|
| **D1: Supplements at launch?** | NO — post-Gate-0A only | Items 6, 21 → Bucket 3 |
| **D2: MS OAuth required?** | NO — email-only fine | Item 20 → Bucket 3 |
| **D3: Inter-company brand licence?** | DROP — V7 §2.1 supersedes | Item 4 deleted entirely |
| **D4: FM removal page or mailto?** | Mailto acceptable with 7-day SLA | Item 23 → Bucket 3 |
| **D5: SUBSCRIBER10 in pre-launch?** | NO — launch-week onwards | Item 44 → Bucket 3 |

**Net effect on Bucket 1:** 4 items move out, 1 item dropped = sprint scope reduces from ~30 to **~25 items**.

---

## FINAL BUCKETING (decisions locked)

| Bucket | Item count | Sprint impact |
|--------|-----------|---------------|
| **B1 — Pre-launch** | ~25 | 21-day sprint scope (~1.2 items/day) |
| **B2 — V7 in B1** | (absorbed in B1) | — |
| **B3 — Soft-launch** | ~18 (Decisions added 4 items) | First 1-3 weeks live |
| **B4 — Parallel/external** | ~7 | Background, owner has dates but not in sprint |
| **DROPPED** | 1 (item 4) | V7 single-entity supersedes |
| **TOTAL active** | ~50 unique items | — |

---

## THE HONEST READ

**30 items in 21 days is the tight end of achievable.** It assumes:
- Ewa is available for sign-offs as needed (compliance items 1, 2, 3 cluster on her bandwidth)
- Vitall responds within 2-3 days on the outstanding items (Vitall items 10, 13, 17)
- The solicitor responds within 5-7 days on compliance items 4, 5, 8
- No new strategic questions trigger V7 rewrites or scope expansion
- Daily check loop is actually followed

If any one of those assumptions fails, the sprint slips. 21 days is the planning cushion, not the comfortable scope.

**Bucket 3 is genuinely deferrable.** Marketing activation can happen in launch-week-plus. Customers who buy a kit on launch day are not being acquired through LinkedIn launch posts that ship that same day — they're FM-list opt-ins from pre-launch comms (already in motion) and direct traffic from existing audience.

**Bucket 4 is largely "happens when it happens."** Supplement items wait for Gate 0A. Founder bridge waits for M11. Tracker v1 waits for M3-M4.

---

## NEXT STEPS (in order)

1. ~~Keith confirms Decisions 1-5~~ DONE 2026-05-12
2. ~~Cowork prompt rewritten~~ DONE — at `cowork-prompts/phase0-prelaunch-tracker-prompt-v2.md`
3. **You run the Cowork prompt** to create ClickUp structure + dashboard
4. **Daily check loop starts** with Bucket 1 only on the burndown

---

*Triage document. LOCKED 2026-05-12.*
