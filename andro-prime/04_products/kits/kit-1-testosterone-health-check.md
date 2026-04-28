# Kit 1 — Testosterone Health Check
## Product Specification | V7.2 — April 2026

**Owner:** Keith Antony
**Status:** Active. Phase 0 launch product (Week 0).
**Cross-references:**
- `04_products/catalogue/product-catalogue-v7-1.md` (V7.2 — pricing source of truth)
- `04_products/icp-kit-supplement-alignment-april2026.md` (selling logic, copy frame, cross-sell)
- `04_products/CONTEXT.md` (results-engine trigger rules)
- `06_marketing/positioning/product-marketing-context.md` (ICP, voice, customer language)
- `03_compliance/CONTEXT.md` (red-flag language, EFSA claims, Phase 0 boundary)

> **Kit 1 is the testosterone-only test.** Its scope is strictly testosterone. Do not frame it as explaining general fatigue, energy, or recovery symptoms — those belong to Kit 2 and Kit 3. Getting this wrong produces a known negative-review failure mode.

---

## 1. Product Summary

| Field | Detail |
|---|---|
| **Product name** | Andro Prime Testosterone Health Check |
| **Tagline** | "Find out where you stand. 5 minutes. No GP needed." |
| **Price** | **£99 (£89.10 with PT/influencer 10% code)** |
| **Format** | At-home finger-prick blood collection kit |
| **Lab partner** | Vitall (UKAS ISO 15189 accredited) |
| **COGS (Vitall-quoted)** | £58.50 |
| **Gross margin (direct sale)** | £40.50 (40.9%) |
| **Net per affiliate sale (no bonus)** | £13.37 — see `commission-structure.md` for detail |
| **Turnaround** | Kit arrives 2–3 days; results 48–72 hours after sample receipt |
| **Results delivery** | Andro Prime branded dashboard (API from Vitall) |
| **Regulatory position** | Wellness product. CE/UKCA marked IVD. **No CQC. No diagnosis.** |
| **Launch status** | Phase 0, Week 0 |
| **Expected volume** | 20–30/month at minimum case; 30–50/month at stretch case (per master plan v2.2) |

---

## 2. Target ICP

**Primary:** ICP 1 — Symptomatic Achiever
- Age: 38–54
- Profile: Professional, dad, business owner. High-functioning but quietly not himself anymore.
- Core complaint: GP said his testosterone is "normal" but he doesn't feel right
- What he's hiring this kit for: validation + a path forward
- Trust trigger: Keith's story, NHS gap content, Dr Ewa Lindo's credentials

**Secondary:** ICP 3 — Curious Maintainer (tertiary buyer)
- May purchase Kit 1 for prevention/baseline rather than symptoms
- Note: ICP 3 is more naturally aligned with Kit 3 (broader panel)

**Anti-persona (do not target in copy):**
- Men under 35
- Men with no symptoms looking for a "complete health MOT" — they should be routed to Kit 3
- Men wanting TRT prescription on Day 1 — they should be routed to founding member deposit if T <12 nmol/L

**Customer language (used in copy):**
- "Knackered all the time"
- "Not myself anymore"
- "GP said I'm fine but I'm not"
- "My motivation has just gone"
- "Testosterone borderline — doctor said don't worry about it"

---

## 3. Biomarker Panel

| Biomarker | Unit | Why included |
|---|---|---|
| Total Testosterone | nmol/L | Primary measure; the headline number |
| SHBG (Sex Hormone-Binding Globulin) | nmol/L | Without it, Total T is incomplete; SHBG affects bioavailable T |
| Free Androgen Index (FAI) | calculated | Calculated ratio; gives clinical picture beyond Total T alone |
| Albumin | g/L | Required for Free T calculation |
| Free Testosterone | calculated (nmol/L) | The clinically relevant fraction; what's actually doing the work |

**Threshold values:** Currently in `results-engine/thresholds.md` (placeholder). Authoritative thresholds:
- T < 12 nmol/L: Low (founding member deposit trigger)
- T 12–15 nmol/L: Borderline (Daily Stack + retest reminder)
- T 15–20 nmol/L: Normal range (Daily Stack zinc-hero trigger)
- T > 20 nmol/L: Optimal (no supplement CTA; retest 6–12 months)

These thresholds are referenced in `icp-kit-supplement-alignment-april2026.md` Section 8.

---

## 4. Copy Frame

### Permitted (use these)

**Hero claims:**
- "Find out where your testosterone stands. 5 minutes. No GP needed."
- "GP said your testosterone is normal. Normal means not ill — not optimised. Here's the actual number."
- "If testosterone is the cause, you'll know. If it isn't, we'll tell you that too."

**Symptom hooks (NHS gap angle):**
- "Your GP said your testosterone is normal. Here's why that might not be the full story."
- "Five minutes and a finger prick tells you more than a 10-minute GP appointment ever will."
- "£99 to actually know — versus £200+ for a private clinic consultation that doesn't even include the test."

**Premium-pricing language:**
- "It's £99. I think it's worth it." (PT script)
- "A private clinic consultation alone is £200+. This is the test, the lab, and the GP interpretation — for £99."
- Don't apologise for the price. Don't lead with discount.

### Forbidden (per `03_compliance/CONTEXT.md`)

- "Diagnose," "diagnosis"
- "Treat," "treatment," "cure"
- "You have low testosterone" — replace with "Your results indicate..."
- "TRT is available now"
- "Find out why you're tired" — too broad for this panel; this is a Kit 2 or Kit 3 frame
- "Find out why you're knackered" — same; testosterone alone doesn't explain general fatigue

### Critical scoping rule

**Never frame Kit 1 as explaining general fatigue, energy, or recovery symptoms.** A man with ICP 1 symptoms buys Kit 1, his T is 14 nmol/L (normal range), he gets a Daily Stack recommendation, takes it 2 months, still feels terrible — because the actual cause was Vitamin D or B12. This produces a negative review. The frame must always be "find out if testosterone is the cause" — narrow and defensible.

---

## 5. Results-Engine Logic

| Result | Primary CTA | Secondary CTA | Notes |
|---|---|---|---|
| T < 12 nmol/L | **Founding Member Deposit** (£75 refundable) | Daily Stack (honest framing: "while you wait — support the basics") | Compliance: never diagnose. Frame as "your results indicate..." |
| T 12–15 nmol/L (borderline) | Daily Stack (zinc hero) | Kit 3 upsell or retest reminder | Borderline framing — "worth monitoring" |
| T 15–20 nmol/L (normal range) | Daily Stack (zinc hero — "for maintenance") | Kit 2 cross-sell IF energy symptoms stated at checkout | Most common result band |
| T > 20 nmol/L (optimal) | None | Retest reminder (6–12 months) | "Your levels are good. No supplement needed right now." |

**EFSA claim for Daily Stack zinc-hero copy:**
> "Zinc contributes to the maintenance of normal testosterone levels."

This is the only EFSA-approved testosterone-related supplement claim. Use it exactly. Do not paraphrase.

**Compliance note for founding member CTA:** Only triggered by T < 12 nmol/L from Kit 1 or Kit 3. Never inferred from Kit 2 markers alone. This is both a compliance rule and a product integrity rule.

---

## 6. Cross-Sell Architecture

### Direction 1: Kit 1 → Kit 2 (primary cross-sell)

**When to trigger:** T result is 12–20 nmol/L AND buyer indicated fatigue or energy symptoms at checkout or on quiz.

**Where it appears:** Results dashboard, after T interpretation, before Daily Stack CTA.

**The copy (from `icp-kit-supplement-alignment` Section 3):**
> *"Good news — your testosterone is in range. That rules out one of the main causes. But Vitamin D, B12, and inflammation are the other major drivers of exactly what you're describing — and we can't see those from this test. A lot of men who get a normal T result find their actual answer in Kit 2. It checks all four energy and recovery markers for £119."*

**CTA:** "Check your energy markers — Kit 2, £119" (secondary button, below Daily Stack CTA)

### What NOT to cross-sell

- **Do not cross-sell Kit 3** as upsell from Kit 1 within the same journey. Kit 3 is a standalone entry product, not a premium upgrade. Cross-selling Kit 3 mid-journey feels like dismissing the product just bought.
- **Do not bundle Kit 1 + Kit 2 at discount** — Kit 1 + Kit 2 cross-sell at full price is £218 total revenue (vs Kit 3 single purchase at £179), better unit economics.

---

## 7. Compliance Scoping

| Rule | Detail |
|---|---|
| **Phase 0 boundary** | Kit 1 is wellness product. No clinical diagnosis. No prescribing. |
| **Founding member trigger** | Only T < 12 nmol/L. Never from energy markers. |
| **Diagnostic language** | Forbidden. Use "your results indicate" not "you have low testosterone." |
| **TRT mention** | Only as future programme — "be first when we launch." Never "available now." |
| **Ashwagandha** | Daily Stack contains it but it is a silent ingredient. No copy mention anywhere. |
| **Affiliate brief** | All PTs and influencers signed-attested before code issuance — see `pt-programme.md` Section 5 |

**EFSA claims permitted on Kit 1 → Daily Stack cross-sell copy:**
- Zinc — "contributes to the maintenance of normal testosterone levels"
- Active B12 (Methylcobalamin) — "contributes to normal energy-yielding metabolism" / "contributes to normal psychological function"
- Vitamin D3 — "contributes to normal muscle function"

---

## 8. Launch Operations

### Lab partner (Vitall)

- UKAS ISO 15189 accredited
- Commercial terms in progress (see `05_partners/`)
- API integration for results delivery (see `09_website-app/backend/`)
- Estimated dispatch: 2–3 days after order; results: 48–72 hours after sample receipt

### Manufacturing / fulfilment

- White-label kit packaging by Vitall
- Andro Prime branding on outer packaging only
- Return postage via Royal Mail Tracked 24
- COGS: £58.50 fully loaded (kit + lab processing + return postage + results delivery)

### Pricing operations

- £99 RRP on canonical site and direct LP variants
- £89.10 with PT/influencer 10% code via FirstPromoter
- Stripe checkout handles discount logic via FirstPromoter integration
- No customer-facing "RRP £X" anchoring — the £99 price is the default

---

## 9. Strategic Role

Kit 1 is the **TRT pipeline builder.** Every low-T result (T < 12 nmol/L) is a pre-qualified clinical lead.

Volume math:
- 20–30 Kit 1 sales/month at M1 → 1.5–4 founding member deposits/month (5–15% conversion at low T base rate of 15–20%)
- M3: 30–40 Kit 1 sales/month → 3–8 deposits/month
- M6: 40–50 Kit 1 sales/month → 5–10 deposits/month
- Cumulative by Gate 0C trigger (~Week 16): ~40 deposits = CQC application filed

Without Kit 1's specific testosterone scope, the founding member deposit has no defensible trigger. This is the only kit that produces clinical-tier leads. Kit 2 cannot trigger founding member CTA (compliance rule). Kit 3 can but is positioned as comprehensive baseline, not symptom-specific.

---

## 10. Open Items

1. Threshold values formally captured in `results-engine/thresholds.md` (currently a placeholder)
2. Vitall commercial terms finalised in writing
3. Kit packaging design — Andro Prime branded outer, Vitall functional inner — sign-off needed
4. Results dashboard Kit 1 view — design iteration ongoing in `09_website-app/frontend/`
5. Pricing benchmark in copy: define exactly which competitor comparisons to use ("MediChecks Testosterone Test £55–95")
6. Founding member deposit dashboard CTA — UX design needed for the T < 12 trigger flow
7. Kit 1 results PDF — branded document for customer download (in addition to dashboard view)

---

*Compiled: April 2026*
*Owner: Keith Antony*
*Version: V7.2 (premium pricing reconciled)*
*Cross-references: catalogue V7.2, ICP alignment doc, products CONTEXT, compliance CONTEXT*
