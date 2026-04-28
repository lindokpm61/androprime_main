# Affiliate Programme — Context
## 06_marketing/affiliates/

> Read `../../CLAUDE.md` (root) before any affiliate work.
> For GTM detail and sales enablement, read `../../07_sales/CONTEXT.md`.
> For acquisition strategy and channel sequencing, read `../master-plan/phase0-acquisition-strategy.md`.

---

## What This Directory Contains

All assets, trackers, outreach templates, and configuration for Andro Prime's affiliate programme.

The affiliate programme is the **primary acquisition channel in Phase 0**. It is commission-only (no upfront spend) and operates through two distinct partner types: micro-influencers and personal trainers.

---

## Directory Map

```
06_marketing/affiliates/
├── CONTEXT.md                ← This file
├── commission-structure.md   ← Rate card, code formats, payout rules
├── influencer-programme.md   ← Influencer-specific outreach, onboarding, content rules
├── pt-programme.md           ← PT-specific outreach, onboarding, recommendation scripts
├── influencer/               ← Outreach tracker, kit sends log, content log
├── pt-network/               ← PT affiliate list, outreach status, codes issued
└── codes-and-tracking/       ← Master code registry; FirstPromoter config and setup
```

---

## Commission Structure (v2.2 — April 2026)

> **Updated April 2026** to reconcile with `01_strategy/financial-model/phase0-financial-model-v1.xlsx` (premium pricing) and `06_marketing/master-plan/phase0-marketing-plan.md` v2.2 (hybrid free-kit model + 10% customer discount via PT codes). The earlier percentage-commission + 15% discount structure is retired.

| Partner Type | Customer Discount | Affiliate Fee | Bonuses | Code Format |
|---|---|---|---|---|
| PT affiliate (Bronze, default) | 10% via code | £15 flat per kit | +£10 Kit 3, +£10 supplement conv, +£10 first-month | `PT[NAME]15` (legacy format) |
| PT affiliate (Silver) | 10% via code | £15 flat + £100/mo retention | Same | Same |
| PT affiliate (Gold) | 10% via code | £15 flat + £200/mo retention | Same | Same |
| PT affiliate (Flagship) | 10% via code (optional) | £15 flat + £20 Kit 3 bonus + £250/mo retainer | Same | Custom |
| Influencer | 10% via code | £15 flat per kit | Same as PT | `[NAME]15` |
| Customer referral | None (referral link) | £10 store credit to referrer | — | Auto-generated |

### Financial check (Kit 2 — £119 RRP, £107.10 with PT 10% code)

| Line | Direct sale | PT-coded sale (with 10% discount) |
|---|---|---|
| Customer pays | £119.00 | £107.10 |
| 10% discount cost | — | £11.90 |
| PT base fee | — | £15.00 |
| Stripe (2.5%) | £2.98 | £2.68 |
| Kit COGS | £63.00 | £63.00 |
| **Net margin on kit (no supplement bonus)** | **£53.02** | **£26.42** |
| Net margin (with supplement subscriber within 60d, -£10 bonus) | n/a | £16.42 |

> Net is positive on the kit alone before supplement conversion LTV. PT-coded sales generate roughly half the per-kit net contribution of direct sales — discount + flat fee + bonus stack absorbs ~£26/kit. Premium pricing makes this work.

### Free kit policy (v2.2 hybrid)

| PT cohort | Free kit? |
|---|---|
| Flagship PTs (3–5) | Free Kit 3 (£98 COGS each) |
| First-wave PTs (15–20, Weeks -8 to -3) | Free Kit 2 (£63 COGS each) |
| Standard PTs (Week -3 onwards) | No free kit; 10% customer discount only |

Total free kit budget over 6 months: ~£1,750. Detailed rationale in `pt-programme.md` Section 4.

---

## Partner Types

### Micro-Influencers

**Target profile:**
- UK-based (geo-targeting matters for NHS messaging)
- Male audience, 80%+ skew
- Content category: men's fitness, health optimisation, biohacking, 40+ lifestyle, PT/coaching
- Follower range: 10,000–150,000 (micro and mid-tier)
- Engagement rate: >2%
- Not currently sponsored by a direct competitor

**Outreach volume target:** Contact 40–60 creators to secure 15–25 active affiliates.

**What they receive:**
- Free kit (first 25 only — pre-launch send to highest-fit creators)
- Unique affiliate code (`[NAME]15`) — £15 flat referral fee per kit, plus standard bonus stack (Kit 3 +£10, supplement conv +£10, first-month +£10). Code generates 10% customer discount.
- No obligation to post — if they like it and their audience would benefit, they share it

**Full outreach template and tracker:** `influencer-programme.md` and `influencer/`

---

### Personal Trainers

**Why PTs are high leverage:**
- A PT who understands biomarker-led training will recommend Kit 2 to every client with fatigue or slow recovery
- It makes their service better, generates commission, and (in v2.2 hybrid model) helps the client save 10% via the PT's code
- 100 active PTs at 1.0–1.2 client referrals/month average = 100–120 kit sales/month at ~£26 effective CAC per kit (£15 fee + £11.90 discount, before bonuses). Premium pricing supports this CAC structure; the previous £44 pricing model would not have.

**Target profile:**
- UK-based freelance or studio PTs
- Specialises in: 35+ men, body composition, sports performance, rehabilitation
- Active on Instagram or LinkedIn
- Has a client base of 15+ active clients

**Outreach volume target:** Contact 300–500 PTs. Target 50+ active affiliates by launch.

**What they receive:**
- Free kit (flagship PTs and first-wave 15–20 only; standard PTs do not receive a free kit)
- Unique discount code (`PT[NAME]15` — legacy format) generating 10% customer discount + £15 flat referral fee per kit, plus bonus stack (Kit 3 +£10, supplement conv +£10, first-month +£10) and tier retention (Silver £100/mo, Gold £200/mo)
- Monthly commission and bonus payments via bank transfer

**Full outreach template and tracker:** `pt-programme.md` and `pt-network/`

---

## Tracking Platform

**Platform:** FirstPromoter (Stripe-native)

FirstPromoter is the chosen platform because it integrates directly with Stripe, which means:
- Commissions are calculated automatically on each Stripe payment event
- No manual attribution or CSV exports needed
- Codes and links both trackable
- Monthly payout reports generated automatically

**Setup location:** `codes-and-tracking/`

**Required before launch:**
1. FirstPromoter account connected to Stripe
2. All PT and influencer codes created and tested
3. End-to-end dummy order test confirming commission attribution works
4. Payout schedule confirmed (monthly, via bank transfer)

---

## Pre-Launch Affiliate Timeline

| Week | Action |
|---|---|
| Week -6 | Begin influencer identification and outreach |
| Week -5 | Begin PT outreach (300–500 contacts) |
| Week -4 | Send free kits to confirmed influencer partners |
| Week -2 | Set up FirstPromoter; create codes for all confirmed partners |
| Week -1 | Test tracking end-to-end with a dummy order |
| **Week 1** | **Launch: all codes live, partners notified** |
| Week 2–3 | Influencer content begins going live; monitor attribution |

---

## Influencer Content Rules

- No obligation to post positive content — authenticity is required, not guaranteed positivity
- No medical claims about test results or symptoms — direct to kit page only
- Must include `#ad` or `#gifted` in any sponsored post (ASA requirement)
- Content should show the kit experience, not promise clinical outcomes
- Do not brief influencers to say "this cured my fatigue" or equivalent

All influencer brief templates: `influencer-programme.md`

---

## Compliance Notes

- Affiliates must not make diagnostic claims ("this tells you if you have low testosterone")
- Affiliates must not reference TRT or clinical services as currently available
- Acceptable: "I tested my levels at home — here's what I found out"
- Not acceptable: "Get on TRT if your results are low" or any treatment implication
- All affiliate content is the affiliate's responsibility under ASA rules; Andro Prime should brief affiliates in writing before code issuance

---

## KPIs

| Metric | Target (Month 1) | Target (Month 3) |
|---|---|---|
| Active affiliates | 10–20 | 25–50 |
| Affiliate-sourced kit sales | >30% of total | >30% of total |
| Average commission paid per kit | £7–9 | £7–9 |
| PT affiliate outreach sent | 300–500 | — |
| Influencer posts live | 5–8 | 15–25 |

**Tripwire:** If affiliate-sourced sales fall below 15% of total in Month 2, increase PT outreach aggressively and review influencer kit-send conversion rate.
