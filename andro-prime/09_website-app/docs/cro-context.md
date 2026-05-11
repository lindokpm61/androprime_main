# CRO Context — Andro Prime

*Last updated: April 2026*
*Skills: page-cro, signup-cro, onboarding-cro, form-cro, popup-cro, paywall-upgrade-cro*

> Read `../../06_marketing/positioning/product-marketing-context.md` first. This file adds CRO-specific detail.
> For the canonical results dashboard logic, read `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 8. That document supersedes any conflicting CTA table in this file.

---

## Conversion Architecture

### Page hierarchy and primary CTAs

| Page | Primary CTA | Secondary CTA | Target conversion |
|---|---|---|---|
| Homepage | "Find out what your blood is telling you" — Test Selector | "Start with Kit 1 — £99" | Click to kit or selector |
| Test Selector | Recommend kit — "Get your [Kit Name]" | — | Kit purchase |
| Kit 1 page | "Get your Testosterone Check — £99" | "See what's included" | Add to cart |
| Kit 2 page | "Get your Energy & Recovery Check — £119" | "See what's included" | Add to cart |
| Kit 3 page | "Get your Hormone & Recovery Check — £179" | "Compare kits" | Add to cart |
| Results dashboard | Context-specific (see below) | — | Supplement sub or founding member deposit |
| Founding member | "Secure your place — £75 deposit" | "Learn more about TRT" | Deposit |
| Waitlist | "Join the waitlist" | — | Email capture |

### Results dashboard CTA logic (conditional — follow canonical table)

Source of truth: `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 8.

Dashboard sections follow the 5-part structure: Result → Explain → Educate → Recommend → Convert. Never lead directly with a CTA.

Elevated hs-CRP requires a qualifier question before any recommendation: "Do you experience joint stiffness or soreness after training?" — shown between the hs-CRP result and recommendation section.

| Result | Qualifier needed? | Primary CTA | Secondary CTA | What NOT to show |
|---|---|---|---|---|
| T < 12 nmol/L | None | Founding member deposit | Daily Stack ("while you wait" framing) | Supplement CTA without honest framing |
| T 12–20 nmol/L | Check if energy symptoms stated | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) | Founding member CTA |
| T > 20 nmol/L | None | Retest reminder (6–12 months) | — | Any supplement push |
| Low Vit D | None | Daily Stack (D3 hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) | Collagen CTA |
| Low Magnesium | None | Daily Stack (Mg hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) | Collagen CTA |
| Elevated hs-CRP + joint symptoms | Ask joint symptoms question | Joint & Recovery Collagen | — | Testosterone CTA |
| Elevated hs-CRP, no joint symptoms | Ask joint symptoms question | Lifestyle guidance only | — | Any supplement push |
| hs-CRP > 10 mg/L | None | GP referral — no supplement CTA | — | Any supplement push |
| Multiple deficiencies | None | Complete Men's Stack (£54.95/mo) | Individual products as fallback | Individual product CTAs as primary |
| Low Ferritin < 30 µg/L | None | Dietary guidance + GP referral note | — | Any supplement push |
| Low B12 (Kit 3, if confirmed) | None | Daily Stack (B12 hero) | — | — |

**Rule:** Never show a generic "shop supplements" CTA on the results dashboard. Always match the CTA to the specific result.

---

## Landing Page CRO Requirements

### Above-the-fold must-haves (every kit page)
1. **Price visible** — reduces unqualified ad clicks
2. **"UKAS ISO 15189 Accredited Lab"** — lab trust signal
3. **"No GP needed"** — removes friction objection
4. **"Results in 48 hours"** — urgency/convenience
5. **Single primary CTA button** — one action only

### Trust signals (below fold, ordered by impact)
1. Dr Ewa Lindo introduction + GMC number
2. Keith's founder story (ICP 1 pages) or performance angle (ICP 2 pages)
3. UKAS accreditation badge
4. "Your result. Your dashboard. Your recommendation." — personalisation signal
5. How it works (3 steps: order — finger prick — results)
6. FAQs (schema-marked)

### What to avoid
- Multiple competing CTAs
- Stock photography
- Long paragraphs — break into short lines
- "Comprehensive solution" / wellness marketing language
- Any mention of TRT as currently available on wellness pages

---

## Signup & Waitlist Flow

### Waitlist page (`/waitlist/`)
- Single field: email address only. No name, no phone.
- CTA: "Join the waitlist"
- Below field: "No spam. One email when we launch."
- Trigger: adds to `seq-01-pre-launch-waitlist/` email sequence

### Post-purchase flow (kit order confirmed)
- Confirmation page: reinforces what happens next (dispatch — sample — results)
- Triggers `seq-02-post-purchase-pending/` — 3 emails: dispatch — sample instructions — result ready
- No upsell on confirmation page — focus is on completing the test, not selling more

### Post-result flow (results dashboard)
- Conditional CTA based on result (see CTA logic above)
- Single action per result screen — no overwhelm
- "What does this mean?" expandable section for each biomarker
- Email triggered based on result type — `seq-03a` or `seq-03b`

---

## Popup & On-Site Capture

### Exit-intent popup (kit pages only)
- Trigger: exit intent or 60s on page without scroll to CTA
- Offer: "Not sure which kit? Take the 2-minute quiz —"
- Does NOT offer a discount — we don't discount kits on ad-driven traffic
- Links to `/test-selector/`

### Waitlist popup (pre-launch period only)
- Trigger: 30s on homepage
- Message: "Launching soon — join the waitlist for early access"
- Single email field
- Remove once kits are live

### Rules
- No popups on the results dashboard — conversion moment is too sensitive
- No popups on the founding member page — intentional, considered purchase
- Mobile popups: slide-up from bottom only, never full-screen modal on mobile

---

## Form Optimisation

### Test selector quiz (`/test-selector/`)
- 3 questions maximum
- Progress indicator (1 of 3)
- No email required to see recommendation
- Result screen shows recommended kit with price and single "Get your [Kit Name]" CTA
- Optional: "Email me my recommendation" — low friction list building

### Founding member deposit form
- Fields: Name, email, phone (optional)
- Payment: Stripe — card only
- Below form: "Your £75 is fully refundable. Applied as credit when TRT launches."
- Trust: Dr Ewa Lindo photo + "Reviewed by Dr Ewa Lindo, GMC-registered"

---

## A/B Test Priorities (in order)

| Priority | Element | Hypothesis | Page |
|---|---|---|---|
| 1 | CTA button copy | "Get your Testosterone Check" vs "Find out your testosterone level" | Kit 1 |
| 2 | Price position | Above fold vs below first value prop | All kit pages |
| 3 | Hero headline | Symptom-led vs data-led | Kit 2 |
| 4 | Keith photo vs no photo | Founder trust increases conversion | Homepage |
| 5 | Test selector CTA | "Which kit is right for you?" vs "Not sure? Take the quiz" | Homepage |

Do not run A/B tests until 100+ weekly visitors per variant. At Phase 0 traffic levels, use qualitative signals (heatmaps, session recordings) first.

---

## Onboarding CRO (Post-Purchase)

### Supplement subscriber onboarding (`seq-04-subscriber-onboarding/`)
Goal: ensure the subscriber understands what to expect in weeks 1–4, so they don't cancel before seeing results.

| Email | Timing | Goal |
|---|---|---|
| Dispatch | Day 0 | Confirm shipment, set expectations |
| Week 1 expectations | Day 3 | "You won't feel anything yet — that's normal" |
| Check-in | Day 14 | "How's it going?" + FAQ objection handling |
| Retest prompt | Day 75–80 | "Time to retest — see what's changed" (20% off relevant kit) |
| Referral | Day 90 | "Know someone who should check their levels?" |

### Key onboarding principle
Set a timeline. Tell them when to expect results. The biggest churn driver is subscribers cancelling at week 3 because "it's not working" when 8–12 weeks is the minimum effective period for Vit D supplementation. For the retest prompt copy and rationale, see `../../04_products/icp-kit-supplement-alignment-april2026.md` Section 6.
