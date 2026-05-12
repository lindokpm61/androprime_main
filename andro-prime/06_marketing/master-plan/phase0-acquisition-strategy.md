# Andro Prime — Phase 0 Acquisition Strategy (v3)
## Option 4 Locked | Premium Pricing | Affiliate-Only | Right-Sized v2.3 Stack | Two-Stage Gate | 2026-05-08

**Owner:** Keith Antony
**Cross-references:**
- `06_marketing/master-plan/phase0-marketing-plan.md` (v2.2 — pending v2.3 reconciliation)
- `06_marketing/affiliates/pt-programme.md` (v2.3 — PT execution detail)
- `06_marketing/affiliates/influencer-programme.md` (v2.2 — pending v2.3 reconciliation)
- `06_marketing/affiliates/commission-structure.md` (v2.3 — fee/bonus/discount canonical reference)
- `04_products/catalogue/product-catalogue-v7-1.md` (V7.2 — pricing source of truth)
- `01_strategy/research/2026-05-08-phase0-cash-target-benchmark.md` (Phase 0 cash-target reality check)

**Replaces:** v2.2.

> **Scope of this document:** Channel sequencing, recruitment funnel math, week-by-week acquisition actions, CAC tracking. Strategic posture lives in the master plan. Channel-specific execution lives in the programme files. This document is the bridge — it tells you what to do, in what order, in which week, to actually land 100 active PTs and 25 active influencers by M3.

> **v2.2 → v3 changes summary:**
> - Affiliate stack right-sized to v2.3 (first-month activation bonus removed; tier retention cash → one-off graduation bonuses; monthly contests removed; flagship retainer → per-piece content payments; gym free-kit cap 8 → 3 head trainers).
> - Option 4 (kit-led entry → result → supplement subscription) locked. Kit 1 and Kit 2 promoted at equal pace (no "Kit 2 leads" framing).
> - **Founding Member £75 deposit shelved 2026-05-08.** This doc previously treated FM deposits as a Phase 0 cash-flow input and CQC "trigger" — both reframed. FM as a non-cash opt-in marker may continue; cash float is no longer a planning assumption.
> - "CQC trigger" language retired. The 40-marker number is an internal TRT day-1 commercial-readiness target, not a regulatory gate.
> - Daily Stack subscriber tenure (days 15–45 onboarding) flagged as the dominant Phase 0 gating factor (per cash-target benchmark research).

---

## 1. Strategic Overview

### The Core Principle: Borrow Trust, Don't Buy It

The standard DTC launch playbook — spend on cold paid ads, build brand over time — is structurally disadvantaged for Andro Prime at premium pricing because:

1. **Cold audiences don't buy a £119 home blood test from an unknown brand.** Conversion rates on cold paid traffic at premium price points run 0.3–0.8% in this category — meaning £40+ CAC against ~£38 net per kit before bonuses. Loss-making.
2. **Funded competitors dominate paid acquisition.** Voy has a seven-figure ad budget. MediChecks has decade-long SEO authority. Bidding against them on cold traffic from Day 1 is expensive and slow.
3. **Premium price + new brand = trust friction.** A £107.10 PT-coded kit from someone's trusted trainer converts. The same kit from an Instagram ad doesn't — at premium price points, the recommendation source matters more than the message.

**The alternative:** Start where trust already exists. Deploy through voices the ICP already trusts. Affiliates create the warm audience. Paid media is excluded entirely in Phase 0.

**Page architecture implication:** Phase 0 traffic does not go to browse-heavy canonical product pages. The structure is: connected public site for trust and direct discovery + reduced-navigation `/lp/` variants for affiliate and email traffic. LP variants follow a single-CTA rule. Full spec: `09_website-app/docs/lp-architecture.md`.

### Acquisition Model Summary (v3)

| Layer | Channel | Effective CAC | Budget Type | Active From |
|---|---|---|---|---|
| 1 | PT affiliate (hero) | £25–£35 (£15 fee + £11.90 discount + per-kit bonuses) | Variable, paid out of revenue | Week 1 |
| 2 | Micro-influencer affiliate | £25–£35 (same structure) | Variable, paid out of revenue | Week 1 |
| 3 | Keith's LinkedIn | Time only | n/a | Week -8 (organic build) |
| 4 | Earned media + PR | Time only | n/a | M2+ (slow burn) |
| 5 | SEO + content | Time + minor tooling | <£100/month tools | M1 onwards |
| 6 | Reddit | Time only | n/a | Week -6 onwards |
| **Excluded** | **Google Search, Meta, YouTube, TikTok, podcast sponsorship, LinkedIn ads** | **n/a** | **£0** | **Re-evaluate at M3** |

> Affiliate fees and per-kit bonuses are paid from revenue — not in advance. They are a variable cost of sale. Fixed pre-launch costs (PT-cohort free kits ~£1,750 + gym partnership free kits ~£1,890) are sunk pre-launch.

### Budget Allocation (Monthly, Phase 0 — v3 / v2.3 affiliate stack)

| Category | Monthly Budget |
|---|---|
| Paid media | **£0** |
| FirstPromoter affiliate platform | £100 |
| Customer.io email platform | £125 (scaling to £200 from M3) |
| Asset/content tooling (Canva, Loom, etc.) | £50–80 |
| **Total fixed monthly tooling** | **£275–400** |
| Affiliate fees (variable, ~50% of kits at flat £15) | Avg £350/mo at minimum case |
| Affiliate per-kit bonuses (Kit 3 +£10, supplement conversion +£10) | Avg £300–500/mo |
| PT tier graduation bonuses (one-off Silver £200, Gold £400; not recurring) | ~£1,400 over 6 months total (~£235/mo averaged) |
| Quarterly + annual contest prizes (no monthly contests in v2.3) | ~£4,000 over 6 months total (~£670/mo averaged) |
| Flagship per-piece content payments (mid-case, capped 2/mo per flagship) | ~£500/mo |

**See master plan v2.2 Section 13 (pending v2.3 reconciliation) for full 6-month budget. v2.3 affiliate-programme cost summary in `pt-programme.md` Section 13: ~£13,240 over 6 months.**

---

## 2. Pre-Launch Phase (Weeks -8 to 0)

Everything in this phase is preparation. No kits are sold. This period exists to ensure that on launch day, the trust infrastructure is already in place and the cohort tagging is in order.

### Week -8 to -6: PT Identification & Outreach Wave 1

**Target outreach:** 600 cold DMs to UK PTs over 3 weeks (200/week).

**Sourcing channels:**
- Instagram: `#personaltraineruk`, `#londonPT`, `#manchesterPT`, `#leedsPT`, `#bristolPT`, `#mensfitnessuk`, `#over40fitness`, `#strengthcoachuk`
- LinkedIn: search "personal trainer UK" + location filters
- PT registries: CIMSPA directory, REPs (Register of Exercise Professionals)
- Reverse-search competitor brand tags to find unsponsored PTs

**Cohort tagging:** Critical from Week -8 onwards. Every outreach contact gets a tag in `pt-network/outreach-tracker.csv` of either `flagship-candidate`, `first-wave-candidate`, or `standard-candidate`. The free-kit allocation depends on this tag — flagship and first-wave get free kits; standard does not.

**Outreach DM template:** Full text in `pt-programme.md` Section 4.1 (v2.3). Hybrid-model summary: "£15 per referral + Kit 3 / supplement bonuses, your code gives clients 10% off, top performers earn one-off Silver/Gold graduation bonuses + quarterly + annual contest prizes."

**Week -6 milestone:** 150–200 PTs replied positively. 30–40 onboarded. First-wave cohort (15–20 PTs) identified and free Kit 2 sends queued.

### Week -8 to -5: Influencer Identification & Outreach

**Target outreach:** 100–120 cold DMs to UK micro-influencers.

**Target creator profile:**
- UK-based (essential for NHS messaging)
- Male audience 80%+ skew
- Content category: men's fitness, health optimisation, biohacking, 40+ lifestyle, PT/coaching
- Follower range: 10,000–150,000 (micro and mid-tier — better engagement than macro)
- Engagement rate >2%
- Not currently sponsored by direct competitors (Voy, MediChecks, Numan, Manual, etc.)

**Outreach template:** Full text in `influencer-programme.md`. Hybrid-model summary: "Free kit (first 25 only), £15 per referral + bonuses, your code gives audience 10% off."

**Week -5 milestone:** 25–35 creators replied positively. 12–18 confirmed for free kit. First sends dispatched.

### Week -7 to -5: Flagship PT Programme Initiation

**Target:** 3–5 flagship PT relationships.

**Approach:** Warm intros preferred (LinkedIn second-degree, mutual acquaintance, journalist intro). Personal email (not DM) with longer letter explaining brand, science, and offer. Loom video link.

**Commercial terms (v2.3 — restructured from v2.2):**
- Free Kit 3 (£98 COGS each) (unchanged)
- **£100 per piece of co-branded content delivered, capped at 2 pieces/month per flagship** (replaces v2.2's £250/mo open-ended retainer; pays for output, not retained commitment)
- £15 per referral + **£10 Kit 3 bonus (standardised across all PTs in v2.3; was £20 differential for flagships)** + £10 supplement conversion bonus
- **No PT-refers-PT cash bonus** (v2.2's £25 sub-PT bonus removed in v2.3; informal introductions still welcomed)
- Reserved early-access TRT slot at clinical launch
- Permanent placement on "Trusted Partners" page (opt-in)

**Week -5 milestone:** 1–2 flagship deals signed. Free Kit 3 sends dispatched. Co-branded content briefs in motion.

### Week -7 to -4: Gym Partnerships

**Target:** 30 independent UK gyms approached → 10 partnerships secured.

**Definition of "independent":** Privately owned, single-location or small group (2–5 sites). Strength-focused, performance-focused, or boutique recovery-focused. No chain gyms (Pure Gym, David Lloyd, Virgin).

**Outreach approach (gym owner, not individual PTs) — v2.3:**
- **Free Kit 2 to up to 3 head trainers per gym** (capped in v2.3; was up to 8 in v2.2). 10 gyms × 3 kits × £63 COGS = ~£1,890 budget.
- £15 per referral commission per PT + 10% member discount via gym code
- Sub-head PTs at the gym join on standard terms (no free kit, 10% customer discount via code)
- Co-branded LinkedIn post from Keith featuring the gym
- Pre-written gym member newsletter paragraph
- QR code at reception linking to gym-specific kit page

**Week -4 milestone:** 8–10 gym partnerships confirmed. PT lists obtained. Gym-coded kit pages live on `/lp/` infrastructure.

### Week -6 to -3: PT Onboarding & Brief Pack Distribution

**Onboarding flow per PT (full detail in `pt-programme.md` Section 4):**

1. Confirmation email (Day 0)
2. PT Brief PDF read (Days 0–1)
3. 20-minute onboarding call OR async video walkthrough (Days 1–4)
4. Signed compliance attestation (DocuSign)
5. Code goes live
6. Free kit dispatched (flagship and first-wave only)
7. Day-7 check-in email

**Cohort tag transition at Week -3:**

After Week -3, **no new PT receives a free kit.** Standard PTs onboarded from Week -3 onwards operate on the 10% customer discount alone. This is the central cost-control mechanic of the v2.2 hybrid model.

This must be communicated explicitly in onboarding from Week -3 — see `pt-programme.md` Section 4 for the standard-PT onboarding script.

### Week -4 to -1: Keith's LinkedIn Foundation

**Minimum viable presence at Week -1:**
- LinkedIn profile fully completed with Andro Prime in role
- 5 published posts:
  1. Why Keith started Andro Prime (founder story)
  2. "My GP told me my testosterone was normal. He was right. Here's why it still wasn't enough."
  3. "What 9 biomarkers tell you about your health that your GP doesn't test"
  4. NHS gap in men's testosterone care
  5. Introducing Dr Ewa Lindo and why her credentials matter

**Posting cadence from Week -4:** 3 posts/week minimum, 5 stretch.

**Engagement volume:** 100+ comments per week on adjacent posts (UK men's fitness, founder content, GP/clinical voices). 30 min/day.

### Week -2 to 0: Infrastructure Setup & Final QA

**FirstPromoter:**
- Account live, connected to Stripe
- All confirmed PT and influencer codes created
- Cohort tagging in place (free-kit recipient flag, tier flag)
- End-to-end dummy order test confirming attribution + commission + bonus calculation works

**Compliance audit script:**
- Python or Zapier flow scraping Instagram and LinkedIn for handle mentions + flagged terms (ashwagandha, TRT, diagnose, treat, cure, "save 15%/20%/etc")
- Outputs flagged content to Google Sheet for Keith's weekly review
- Tested against 10 sample posts before launch

**Email sequences (Customer.io):**
- seq-01 through seq-05 built and tested with dummy data
- All Liquid variables verified
- Unsubscribe links working
- Sender reputation warmed (5–10 daily test sends from Keith's address starting Week -4)

**Week -1 milestone:** All systems tested. PT count: 50 onboarded. Influencer count: 8–12 confirmed. First-wave free kits dispatched. Email list at 200+ signups.

---

## 3. Launch Phase (Weeks 1–6)

### Week 1: Go Live

**Day 1 actions:**
- All three kits go live simultaneously on canonical site + LP variants
- All affiliate codes activate in FirstPromoter
- PT and influencer affiliates notified ("your code is live")
- Keith publishes LinkedIn launch post
- Founding member programme goes live alongside Kit 1
- PT-only newsletter goes out — "your code is live, here's the brief one more time"

**Week 1–2 monitoring:**
- Daily review: Stripe revenue, FirstPromoter attribution, content audit script flags
- PT activation tracking: which onboarded PTs have made any sale or posted any content?
- Cold DM continuation: 200/week sustained outreach for second-wave PT recruitment

**Target Week 1–2 outcomes:**
- 11–18 cumulative kit sales
- 0–2 founding-member list opt-ins
- 3–5 influencer posts live
- First-wave PTs starting to post content
- Compliance violations: 0–1

### Week 3: PULSE CHECK GATE (early-warning, not kill decision)

| Signal | Healthy | Yellow flag | Red flag (consider cut) |
|---|---|---|---|
| Cold DM reply rate (cumulative) | ≥6% | 3–5% | <2% |
| % of onboarded PTs who've posted any content | ≥40% | 20–39% | <15% |
| Total kit sales | ≥10 | 5–9 | <3 |
| PT-sourced sales as % of total | ≥35% | 20–34% | <10% |
| Compliance violations | 0–1 | 2 | 3+ |

**Action at Week 3:**
- Multiple yellow flags: restructure (rebrief, new content templates, different outreach hook)
- Multiple red flags: serious review (Section 6 below — restructure or cut decision tree)
- All signals healthy: continue, accelerate second-wave recruitment

**Don't cut on a single Week 3 signal — they're noisy.** PT activation needs 30–45 days to read accurately because the recommendation → client decision → purchase cycle compounds across multiple sessions.

### Week 4–5: Build Momentum

**Week 4 actions:**
- Second-wave PT onboarding (target: another 30–40 PTs onboarded)
- **(v2.3 change: no first-month activation bonus paid; activation re-evaluated at M2 with non-cash levers — priority onboarding, named recognition in monthly newsletter, group webinar)**
- Press outreach begins for Tier 2 publications (Men's Health UK pitch sent)
- First Reddit answers from Keith's account (after building 50+ helpful comments)

**Week 5 actions:**
- **(v2.3 change: no monthly contest results in v2.3 — quarterly + annual only. First quarterly results announce in Week 11.)** Recognition slot in monthly newsletter for top-volume + top-revenue PTs.
- PT spotlight on Keith's LinkedIn (with consent)
- First flagship PT co-branded content goes live (£100 content payment due 15th of month following publication)
- Email list: 350–500 signups

### Week 6: GO/NO-GO GATE 0A

| Signal | Continue | Restructure | Cut PT engine, pivot |
|---|---|---|---|
| Cumulative kit sales | ≥40 | 25–39 | <20 |
| Active PTs (sold in last 30d) | ≥15 | 8–14 | <5 |
| PT-sourced sales | ≥35% of total | 20–34% | <15% |
| Founding-member list opt-ins | ≥15 | 8–14 | <5 |
| Avg sales per active PT (30 days) | ≥0.8 | 0.4–0.7 | <0.3 |

**Action at Week 6:**
- 3+ "Continue" signals: place Daily Stack MOQ order, continue execution, plan M2 acceleration
- 3+ "Restructure" signals: pause PT recruitment for 1 week, fix what's broken (briefing pack, asset pack, recruitment angle), then resume
- 3+ "Cut" signals: cut PT engine as primary channel, pivot to paid + organic. **Note: this doesn't kill Phase 0** — kits + supplements + founding member programme continue, just sourced differently.

**Concurrent at Week 6:**
- Supplement pre-order campaign launches via email (seq-03a Email 3)
- 25+ pre-orders → place 500-unit Daily Stack MOQ
- Cold Meta does NOT activate (excluded from v2.2 entirely)

---

## 4. Scale Phase (Weeks 7–12)

### Week 7–8: Volume Acceleration

- Onboarding next 30 PTs from second outreach wave
- Kit 3 launch promoted to existing Kit 1/2 buyers
- Kit 3 bonus structure activated (PT earns +£10 per Kit 3)
- Influencer programme volume push (target 20+ active by M3)
- Second flagship PT co-branded content piece

### Week 9: Supplement Launch

- Daily Stack inventory arrives
- seq-04 supplement onboarding sequence goes live
- First supplement subscribers paying
- Press outreach for Tier 1 publications (Men's Health UK lead)

### Week 10: Gate 0B Review

| Signal | Healthy |
|---|---|
| Kit 2/3 → supplement conversion | ≥10% |
| Active influencer count | ≥18 |
| PT count active | ≥40 |
| Cumulative kits | ≥75 |

If healthy → push influencer programme to 25+ active by M3, continue PT recruitment toward 100 active.

### Week 11–12: M3 Strategic Review

**Review checklist:**
- Cumulative kits: target 110–165
- Per-kit blended net contribution: ≥£25
- Supplement conversion rate: ≥12%
- Founding-member list opt-ins cumulative: 25–40
- CQC application status: in motion or filed
- Compliance violations (rolling 30 days): <3% of audited content
- Cash position: monthly net cash positive or close to it

**Decisions at M3:**
- Re-evaluate paid media stance (per master plan v2.2 Section 15.8)
- Restructure bonus stack if per-kit net dropping below floor
- Decide on flagship PT continuation (renew retainers or wind down)
- Brief v3 financial model for end of M2 reforecast

---

## 5. CQC Parallel Track (v3 — language reframed 2026-05-08)

CQC application runs independently of Phase 0 marketing — it is not gated on supplement profitability and was never regulator-gated on FM signups. The previous "CQC trigger: 40+ deposits" framing has been retired (per memory: CQC has no patient-volume requirement; the 40 figure is an internal TRT day-1 commercial-readiness target, not a regulatory gate).

**Internal TRT day-1 commercial-readiness target:** 40+ FM markers (non-cash opt-in signups indicating genuine demand for regulated clinical services).

**Why 40 markers:**
- Provides forecastable patient intake for TRT day-1 economics
- Each marker is a known future patient candidate at £185/month
- De-risks the 3–6 month CQC wait period — known patient pipeline on approval day

**Note on Founding Member deposit (£75) — shelved 2026-05-08:** The cash deposit was shelved because Phase 0 cash-flow no longer relies on deposit float. FM as a non-cash opt-in marker may continue (waitlist signup, expression of intent). The "40 × £75 = £3,000 cash float" rationale is no longer in play.

**CQC preparation runs alongside Phase 0 regardless of FM marker count:**
- Clinical governance documentation (Dr Ewa Lindo to lead)
- DSP pharmacy selection (Pharmacierge or Healistic)
- E-prescribing system selection (SignatureRx or Healistic)
- CQC Registered Manager appointment
- CQC application submission target: end of Month 3

---

## 6. Channel Cut Decision Tree (if Week 6 signals red)

If 3+ "Cut" signals at Week 6:

**Step 1: Diagnose** (within 7 days)
- Is the issue PT recruitment (not enough PTs onboarded) or PT activation (PTs onboarded but not selling)?
- Is the issue brand awareness (no traffic) or conversion (traffic but no purchase)?
- Are compliance violations destroying the channel or is it just slow?

**Step 2: Pivot options ranked by feasibility**

| Option | Cost to switch | Speed | Risk |
|---|---|---|---|
| Influencer-led (shift volume to influencers) | Low (already ramping) | Fast (4–6 weeks) | Channel still organic, validated direction |
| Paid Google Search | £1,500–3,000/mo | Medium (4 weeks to optimise) | Above-water at premium pricing; deviates from "no paid" stance |
| Earned media + PR push | Time only | Slow (8–12 weeks) | Hard to forecast; press cycles unpredictable |
| Direct B2B (workplace wellness, gym chains) | Medium (relationship build) | Slow (3–6 months) | New channel with new compliance considerations |

**Step 3: Communicate to active PT cohort**

If cutting the PT engine: don't strand active PTs. Maintain their codes, pay out earned bonuses, transition them to "alumni" status with possible reactivation later. This preserves goodwill — these are people who tried to help. Burning the relationship is worse than the channel itself underperforming.

---

## 7. KPIs and Tripwires

### Weekly (recap from master plan v2.2 Section 10)

| Metric | M1 target | M3 target | Tripwire |
|---|---|---|---|
| New PTs onboarded | 8–12 | 6–8 | < 3 for 2 weeks |
| Kit sales | 5–8 | 12–18 | < 3/week for 2 weeks |
| % via affiliate code | ≥40% | ≥55% | < 30% for 2 weeks |
| Compliance violations | 0–1 | 0–1 | > 2 in any week |
| PT activation rate (sale within 45d) — v2.3 baseline (no first-month bonus) | 35–45% (M1) | 50–60% (M3) | < 40% sustained |
| Per-kit blended net | ≥£25 | ≥£25 | < £25 for 30 days |

### Monthly (recap from master plan v2.2 Section 10)

| Metric | M1 | M3 | M6 |
|---|---|---|---|
| Cumulative kits | 20–30 | 110–165 | 375–490 |
| Active PTs (sold in last 30d) | 12–18 | 45–60 | 75–100 |
| Active influencers | 6–8 | 12–18 | 18–25 |
| Supplement subscribers | 0 | 15–25 | 50–75 |
| Supplement MRR | £0 | £465–775 | £1,550–2,325 |
| Founding member markers (non-cash opt-in signups; deposit shelved 2026-05-08) | 5–10 | 25–40 | 60–90 |

### Expansion Decision Framework

**Scale supplements (add SKUs) when:**
- Supplement MRR > £2,500/month
- Churn ≤ 3%/month
- 2+ customer requests for a specific product type

**Expand kits (add panels) when:**
- Kit-to-supplement conversion > 20%
- Kit volume > 80/month consistently
- A biomarker gap is identified from customer feedback

**Internal TRT day-1 commercial-readiness target (was previously labelled "CQC trigger" — relabelled v3):**
- 40+ FM markers (non-cash opt-in signups). Not a regulatory gate.

**Re-introduce paid media when (M3+ decision):**
- v3 financial model justifies CAC at premium pricing
- Sufficient retargeting audience built (≥5,000 site visitors, ≥1,000 email subscribers)
- Per-kit blended net contribution stable at ≥£30

---

## 8. Acquisition Timeline Summary

| Week | Activity |
|---|---|
| -8 | Begin PT cold DM outreach (200/week). Begin influencer identification. Waitlist landing page live. Keith's first 2 LinkedIn posts. **Vitall fulfilment capacity confirmation.** |
| -7 | Continue outreach. Free kits to 12–18 confirmed influencers + 1–2 flagship PTs dispatched. Reach out to 30 independent UK gyms. |
| -6 | Continue outreach. PT briefing pack v1 finalised (Ewa sign-off). FirstPromoter setup. **First-wave free kits dispatched to 15–20 high-credibility PTs.** |
| -5 | First flagship PT call. Onboard first 10 PTs (free-kit recipients). Keith's posts 3–4. |
| -4 | PT count: 25 onboarded. Influencer count: 8 confirmed. Compliance moderation system tested. |
| -3 | PT count: 35. Email list 100+. **Free-kit cohort closed — beyond this, new PTs onboard with 10% discount only.** |
| -2 | PT count: 45. Soft sandbox launch for top-5 PTs only. |
| -1 | PT count: 50. Final compliance audit. Launch email queued. |
| **0** | **LAUNCH. All codes live. Public site live. PT-only newsletter goes out.** |
| 1 | Daily monitoring. Target: 5–8 sales. |
| 2 | First flagship PT public post live. Target: 6–10 sales (cumulative 11–18). |
| **3** | **PULSE CHECK GATE.** Section 3 thresholds. Don't cut on single signal. |
| 4 | Cumulative target: 20–30 sales. (v2.3: no first-month activation bonuses; non-cash recognition only.) |
| 5 | (v2.3: no monthly contest in M2 — quarterly results land Week 11.) Recognition slot in newsletter. PT spotlight on Keith's LinkedIn. |
| **6** | **GO/NO-GO GATE 0A.** Section 3 thresholds. Place Daily Stack MOQ if continue. |
| 7 | Onboard next 30 PTs from second outreach wave. |
| 8 | Kit 3 launch promoted. Kit 3 bonus structure live. |
| 9 | Daily Stack inventory arrives. seq-04 live. Press outreach begins. |
| 10 | **Gate 0B review.** Push influencer programme to 25 active. |
| 11 | **First quarterly contest payouts (v2.3):** Top PT £750 + collab post; Best Newcomer PT £250 + newsletter recognition. |
| 12 | **M3 strategic review.** Phase 0 financial-model rerun against v2.3 affiliate stack. |
| 16 | **Gate 0C window (v3 reframe):** 200+ kits AND 40+ FM markers AND MRR > £1,500 → CQC application filed. (FM markers are non-cash opt-in signups; deposit shelved.) |
| 24 | **End M6 review.** Annual PT of the Year £2,000 announced. v3 plan with informed-by-data targets. |

---

*Compiled: April 2026 | Updated: 2026-05-08 (v3) | Owner: Keith Antony / Andro Prime*
*Version: 3 — v2.3 affiliate stack + Option 4 lock + FM deposit shelving + CQC trigger language reframe*
*Replaces: v2.2*
*Cross-reference: master plan v2.2 (pending v2.3 reconciliation), pt-programme v2.3, influencer-programme v2.2 (pending v2.3 reconciliation), commission-structure v2.3, product-catalogue V7.2, phase0-cash-target-benchmark 2026-05-08*
