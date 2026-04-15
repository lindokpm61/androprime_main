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

## Commission Structure

| Partner Type | Client Discount | Affiliate Commission | Code Format | Example |
|---|---|---|---|---|
| Influencer | None | 20% of kit sale | `[NAME]20` | `JAMES20` |
| PT affiliate | 15% off kit price | 20% commission | `PT[NAME]15` | `PTMARK15` |
| Customer referral | 10% off | £10 store credit | Auto-generated link | — |

### Financial check (Kit 2 — £44 RRP)

| Line | Influencer deal | PT deal |
|---|---|---|
| Customer pays | £44.00 | £37.40 (15% off) |
| Commission paid | £8.80 | £7.48 |
| Kit COGS | £22.00 | £22.00 |
| Net margin on kit | £13.20 | £7.92 |

> Net is positive on the kit alone, before supplement conversion LTV. The PT deal is thinner but the PT is also sourcing the customer — no paid CAC on top.

### Combined cost note (PT deal)

The 35% combined cost (15% client discount + 20% PT commission) on Kit 2 at £44 = £15.40 cost of acquisition. Kit 2 gross profit after COGS is £22. Net after affiliate cost = £6.60 per referred kit — positive before supplement LTV.

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
- Free kit (pre-launch send)
- Unique affiliate code (`[NAME]20`) — 20% commission on every sale, no discount to audience
- No obligation to post — if they like it and their audience would benefit, they share it

**Full outreach template and tracker:** `influencer-programme.md` and `influencer/`

---

### Personal Trainers

**Why PTs are high leverage:**
- A PT who understands biomarker-led training will recommend Kit 2 to every client with fatigue or slow recovery
- It makes their service better, costs them nothing, and earns commission
- 50 active PT affiliates at 4 client referrals/month = 200 kit sales/month at ~£9 CAC

**Target profile:**
- UK-based freelance or studio PTs
- Specialises in: 35+ men, body composition, sports performance, rehabilitation
- Active on Instagram or LinkedIn
- Has a client base of 15+ active clients

**Outreach volume target:** Contact 300–500 PTs. Target 50+ active affiliates by launch.

**What they receive:**
- Free kit (sent pre-launch)
- Unique discount code (`PT[NAME]15`) — 15% off for clients, 20% commission for PT
- Monthly commission payments via bank transfer

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
