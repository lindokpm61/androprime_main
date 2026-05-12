# Paid & Measurement Context — Andro Prime

*Last updated: April 2026*
*Skills: paid-ads, ad-creative, ab-test-setup, analytics-tracking*

> Read `../positioning/product-marketing-context.md` first. This file adds paid media and measurement detail.

---

## Paid Media Overview

### Channel activation timeline

| Channel | Status | Budget | Active from |
|---|---|---|---|
| Google Search | Active | £2,000/mo (Month 1) | Week 1 |
| Meta warm retargeting | Hold | £900/mo | Week 4 (after pixel data) |
| Cold Meta | Hold | £600–1,200/mo | Week 6 (after social proof exists) |
| YouTube pre-roll | Hold | £400/mo | Month 5 |

### Cold Meta prerequisites (do not launch until ALL met)
1. 3+ genuine influencer posts live (social proof)
2. Supplement pre-orders confirmed (proof of demand)
3. Real reviews or results data published on site
4. Meta Pixel has minimum 3 weeks of data
5. Gate 0A passed (Week 6)

---

## Google Search

### Campaign structure

**Campaign 1: Kit 1 — Testosterone intent**
- Ad groups by symptom cluster: Low T symptoms / GP dismissed / Borderline range / Home test
- Match types: Phrase + Exact. No broad in Month 1.
- Bidding: Maximise conversions. Target CPA: £40 once 30+ conversions.

**Campaign 2: Kit 2 — Energy & Recovery intent**
- Ad groups: Fatigue/energy / Gym recovery / Inflammation / General men's health
- Highest volume campaign — allocate 50%+ of Search budget here

**Campaign 3: Kit 3 — Hormone & Recovery**
- Ad groups: Men's health check / Comprehensive test / General wellbeing
- Lower volume — branded premium angle
- Do not use "MOT" as primary ad copy framing (see `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 2 for rationale)

### Ad copy rules (Google)
- Include price in at least one headline per ad: "Testosterone Check — £99"
- Lead with symptom in headline 1, solution in headline 2, price or trust in headline 3
- Use all 15 headline slots and 4 description slots — let Google test
- Sitelinks: "How it works," "What's included," "About the lab," "Test selector"
- Callout extensions: "UKAS Accredited Lab," "Results in 48 Hours," "No GP Needed," "Free UK Delivery"

### Negative keyword list (apply immediately)
`free, nhs, symptoms of, what is, how to, reddit, forum, diagnosis, diagnose, women, female, menopause, children, dog, cat, animal`

---

## Meta Ads

### Warm retargeting (Week 4+)

**Audiences:**
- Site visitors (no purchase) — 7 days
- Kit page viewers (no purchase) — 14 days
- Test selector completers (no purchase) — 7 days
- Email subscribers — matched list

**Creative:** Social proof angle. "Still thinking about it?" + customer language + low-friction CTA.

**Format:** Single image or short carousel. No video needed for retargeting.

### Cold Meta (Week 6+)

**Audiences (in priority order):**
1. Lookalike (1%) of kit purchasers
2. Interest: men's health, fitness, testosterone, biohacking, UK-only, age 35–55
3. Broad (age/gender only): men, 35–55, UK — let Meta optimise

**Creative format priority:**
1. Testimonial/social proof video (from influencer content)
2. Pattern interrupt: text-on-screen symptom statement
3. Keith talking to camera (founder authenticity)
4. Static image: product + stat card

**Copy pattern:** Symptom in first line. Problem in second. Offer in third. CTA last.
Example:
> "Still sore 3 days after the gym.
> Not the workout. Not the sleep. Might be your Vitamin D.
> Energy & Recovery Check — £119. Results in 48 hours."

---

## Affiliate & Influencer Tracking

### Tracking setup (FirstPromoter — Stripe-native)

FirstPromoter handles all three affiliate types in one dashboard. Sits directly on Stripe — commission calculated from Stripe revenue events.

**Influencer codes (v2.3):** Stripe Coupon object per influencer (10% customer discount) tied to FirstPromoter campaign. Influencer earns £15 flat per kit referral + £10 Kit 3 upsell + £10 supplement-conversion bonus.

**PT codes (v2.3):** Stripe Coupon object per PT (10% customer discount) tied to FirstPromoter campaign. PT earns £15 flat per kit referral + £10 Kit 3 upsell + £10 supplement-conversion bonus + one-off graduation bonuses (Silver £200 / Gold £400). Coupon objects must be created in Stripe at PT onboarding.

**Customer referral:** Unique referral link per customer via FirstPromoter. £10 credit to referrer, 10% off for referee.

**Attribution:** FirstPromoter cookie + Stripe coupon metadata. Supplemented by UTM parameters.

**UTM structure:**
- `utm_source=influencer` / `utm_medium=social` / `utm_campaign=[name]`
- `utm_source=pt` / `utm_medium=referral` / `utm_campaign=[pt-name]`
- `utm_source=google` / `utm_medium=cpc` / `utm_campaign=kit1|kit2|kit3`

**Code registry:** `../affiliates/codes-and-tracking/`

---

## Analytics & Tracking Setup

### Analytics stack

| Tool | Role | Implementation |
|---|---|---|
| Plausible Analytics | Primary web analytics | Lightweight script (1KB), no cookies, EU-hosted, UK GDPR compliant. £9/mo. Tracks all pages. |
| GA4 | Ad conversion tracking only | Server-side events for key conversions (purchase, sign-up). NOT a page-level tracking script. |
| Meta Pixel | Meta ad attribution | Server-side Conversions API for key events. Reduces iOS signal loss. |
| Microsoft Clarity | Session recording / heatmaps | Free. **Must exclude `/dashboard/*` entirely** — never record biomarker results screens. |
| Sentry | Error monitoring | Catches silent Vitall webhook failures, dashboard render errors, payment errors. Free tier. |

### Required events (fired server-side from Next.js API routes)

| Event | Fired from | Sent to |
|---|---|---|
| `page_view` | All pages (client) | Plausible |
| `kit_viewed` | Kit product pages | Plausible, GA4 |
| `checkout_started` | Stripe checkout init | GA4, Meta |
| `purchase` | Stripe `payment_intent.succeeded` webhook | GA4, Meta, Customer.io |
| `kit_dispatched` | Vitall dispatch webhook | Customer.io |
| `result_received` | Vitall results webhook | Customer.io (triggers seq-03a or 03b) |
| `quiz_complete` | Test selector result screen | Plausible |
| `waitlist_signup` | Waitlist form submit | Plausible, Customer.io |
| `founding_member_listed` | Founding-member list opt-in form submitted (non-cash) | GA4, Customer.io |
| `subscription_started` | Stripe `customer.subscription.created` | GA4, Customer.io |
| `subscribe` | Email capture (any) | List growth |

### Weekly KPI dashboard (review every Monday)

| Metric | Target | Alert threshold |
|---|---|---|
| Kit sales/week | 15–25 | < 5 for 2 weeks — audit acquisition |
| Blended paid CAC | ≤ £50 | > £55 for 2 weeks — pause, rebuild copy |
| Google Search CTR | > 5% | < 2% — rewrite headlines |
| Supplement conversion | ≥ 15% of kit buyers | < 10% after 80 results — restructure email seq |
| Affiliate-driven sales % | > 30% of total | < 15% — more PT outreach |

**Save dashboard outputs to:** `../../../10_launch-ops/dashboards/`

---

## A/B Test Framework

### Current test priorities

See `../../../09_website-app/docs/cro-context.md` for full CRO test list. For paid specifically:

| Priority | Element | Variants | Channel |
|---|---|---|---|
| 1 | Kit 2 headline | Symptom-led vs data-led | Google, Meta |
| 2 | Ad creative format | Text card vs Keith video | Meta cold |
| 3 | Landing page CTA copy | "Get your check" vs "Find out your level" | All |

### Test rules
- Minimum 100 conversions per variant before calling a winner on Google
- Minimum 50 conversions per variant on Meta (lower intent signals acceptable for creative tests)
- Do not run more than 2 tests simultaneously on the same page
- Document all test results in `../../../10_launch-ops/dashboards/`

---

## Budget Allocation by Month

| Month | Google | Meta Retargeting | Meta Cold | YouTube | Total |
|---|---|---|---|---|---|
| 1 | £2,000 | — | — | — | £2,000 |
| 2 | £1,600 | £900 | — | — | £2,500 |
| 3 | £1,800 | £900 | £300 | — | £3,000 |
| 4 | £1,500 | £900 | £600 | — | £3,000 |
| 5 | £1,600 | £900 | £600 | £400 | £3,500 |
| 6 | £1,800 | £1,000 | £800 | £400 | £4,000 |
