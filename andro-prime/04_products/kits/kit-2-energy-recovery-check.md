# Kit 2 — Men's Energy & Recovery Check
## Product Specification | V7.2 — April 2026

**Owner:** Keith Antony
**Status:** Active. Phase 0 launch product (Week 6 staged launch).
**Cross-references:**
- `04_products/catalogue/product-catalogue-v7-1.md` (V7.2 — pricing source of truth)
- `04_products/icp-kit-supplement-alignment-april2026.md` (selling logic, copy frame, cross-sell)
- `04_products/CONTEXT.md` (results-engine trigger rules)
- `06_marketing/positioning/product-marketing-context.md` (ICP, voice, customer language)
- `03_compliance/CONTEXT.md` (red-flag language, EFSA claims, Phase 0 boundary)

> **Kit 2 is the broadest funnel product.** It's positioned for active men who don't think they have a hormone problem — so it must NEVER mention testosterone on the product page or in PT/influencer copy. The frame is energy and recovery, not hormones.

---

## 1. Product Summary

| Field | Detail |
|---|---|
| **Product name** | Andro Prime Men's Energy & Recovery Check |
| **Tagline** | "Tired. Sore. Slow to recover. Find out why." |
| **Price** | **£119 (£107.10 with PT/influencer 10% code)** |
| **Format** | At-home finger-prick blood collection kit |
| **Lab partner** | Vitall (UKAS ISO 15189 accredited) |
| **COGS (Vitall-quoted)** | £63.00 |
| **Gross margin (direct sale)** | £56.00 (47.1%) |
| **Net per affiliate sale (no bonus)** | £26.42 — see `commission-structure.md` |
| **Turnaround** | Kit arrives 2–3 days; results within 2 to 5 working days after sample receipt |
| **Results delivery** | Andro Prime branded dashboard with personalised supplement recommendations |
| **Regulatory position** | Wellness product. CE/UKCA marked IVD. **No CQC. No diagnosis.** |
| **Launch status** | Phase 0, Week 6 staged launch (after Kit 1 has 6 weeks of operating evidence) |
| **Expected volume** | 35–50/month at minimum case; 50–80/month at stretch case (per master plan v2.2) |
| **Strategic role** | Highest volume product. Primary driver of supplement subscriptions. |

---

## 2. Target ICP

**Primary:** ICP 2 — Proactive Optimiser
- Age: 35–50
- Profile: Active men. Training hard. Not recovering like they used to.
- Core complaint: Fatigue, slow recovery, joint stiffness, declining performance
- What they're hiring this kit for: a specific biomarker answer + a proven supplement recommendation
- Trust trigger: data, PT endorsement, supplement science

**Secondary:** ICP 3 — Curious Maintainer
- May purchase Kit 2 over Kit 3 if they're symptom-driven (not pure baseline)

**Anti-persona (do not target):**
- Men with hormone-specific concerns — they should be routed to Kit 1
- Men under 35
- Men wanting a "complete health MOT" — they should be routed to Kit 3

**Customer language (used in copy):**
- "Sore for 3 days after a workout that used to take 1"
- "Tired all the time"
- "Joints ache after training"
- "Doing everything right, nothing's changing"
- "I used to be able to push through this"

---

## 3. Biomarker Panel

| Biomarker | Unit | Why included |
|---|---|---|
| Vitamin D (25-OH) | nmol/L | UK men deficient Oct–Mar regardless of diet; primary energy/recovery driver |
| Active B12 (Holotranscobalamin) | pmol/L | Active form, more clinically useful than Total B12; energy + cognition |
| hs-CRP (high-sensitivity C-reactive protein) | mg/L | Inflammation marker; explains slow recovery, joint soreness |
| Ferritin | µg/L | Iron stores; explains fatigue when low |

**Note on zinc:** Zinc requires venous draw for accuracy. Excluded from finger-prick panel. Recommended as general supplement in results report based on epidemiological data — does not appear as a tested marker.

**Threshold values — authoritative source: `results-engine/thresholds.md`** (Ewa-APPROVED 2026-06-16, reconciled into `classifier.ts`). Do not hardcode bands here; the approved scheme is:

- **Vitamin D (25-OH):** `<25` critically low (GP-flagged in code) · `25–<50` low · `≥50` normal. (The old ">75 optimal" band is dropped — stricter than every UK national standard, a private-lab construct.)
- **Active B12 (holoTC):** NICE NG239 three-band — `<25` low · `25–70` borderline/indeterminate · `>70` normal. (Supersedes the old single `<35` cut.)
- **hs-CRP:** `≤1` normal · `>1–3` elevated · `>3–10` moderate · `>10` → GP referral (no supplement CTA).
- **Ferritin:** `<30` low → GP referral · `30–100` borderline/indeterminate · **`>300` high → GP referral** (new male high-flag; the old scheme silently treated anything >100 as normal).

Per-band routing/CTA (incl. Phase 0a waitlist behaviour): `04_products/CONTEXT.md` (Results-Engine Trigger Rules) + `results-engine/results-to-product-mapping.md`.

---

## 4. Copy Frame

### Permitted (use these)

**Hero claims:**
- "Tired. Sore. Slow to recover. Find out why."
- "Sore for 3 days after a workout that used to take 1. Your blood knows why."
- "4 markers. The ones that actually explain why your energy has gone."
- "This test checks the 4 markers that most directly explain why active men stop recovering like they used to."

**Symptom hooks:**
- "You're doing everything right. So why doesn't your body agree?"
- "The one test the NHS won't run for you — and the one you actually need."
- "Why recovery gets harder after 40: 4 markers explain it."

**Premium-pricing language (PT-deliverable):**
- "It's £119 (£107 with my code)."
- "Not the cheapest at-home test out there — but it's the most thorough one for active men."
- "MediChecks gives you a number. Andro Prime gives you an answer."

### Forbidden (per `03_compliance/CONTEXT.md` and Kit 2-specific rules)

- **"Testosterone" — anywhere on the Kit 2 page or in Kit 2 marketing copy.** This is the kit for men who don't think they have a hormone problem; mentioning T immediately repositions the product wrongly.
- "Diagnose," "diagnosis"
- "Treat," "treatment," "cure"
- "Andro Prime cured my fatigue" or any equivalent
- "Inflammation cured" / "Reduces inflammation" — medicinal claim
- "Heals your joints" — medicinal claim (Collagen recommendation has its own EFSA-approved language)
- "Ashwagandha"
- Discount language above 10%

### Critical scoping rule

**Kit 2 cannot trigger the founding-member CTA.** Founding-member list is testosterone-only (Kit 1 or Kit 3 with T < 12 nmol/L). Never infer low T from energy markers. This is both a compliance rule and a product integrity rule. The mechanic is a non-cash email opt-in.

---

## 5. Results-Engine Logic

| Result | Primary CTA | Secondary CTA | Notes |
|---|---|---|---|
| Low Vitamin D (< 50 nmol/L) | **Daily Stack (D3 hero)** | None | EFSA: "Vitamin D contributes to normal muscle function" |
| Low Active B12 | **Daily Stack (B12 hero)** | None | EFSA: "B12 contributes to normal energy-yielding metabolism" |
| Elevated hs-CRP (1–10 mg/L) AND joint symptoms confirmed via qualifier | **Joint & Recovery Collagen** | Daily Stack | Joint symptoms qualifier MUST fire before Collagen CTA |
| Elevated hs-CRP (1–10 mg/L) WITHOUT joint symptoms | Lifestyle guidance | None | "Often driven by training, sleep, diet — no supplement needed right now" |
| hs-CRP > 10 mg/L | **GP referral prompt** | None | Clinical-level inflammation; do not cross-sell supplements |
| Low Ferritin (< 30 µg/L) | **GP referral prompt + dietary guidance + letter template** | None | Iron supplementation has overdose risk; clinical only |
| 2+ deficiencies (any combination) | **Complete Men's Stack bundle (£54.95/mo)** | Individual products as fallback | Bundle saves ~£10/mo vs separate |

> **Routing authority = `04_products/CONTEXT.md`** (Results-Engine Trigger Rules, Phase 0a/0b columns). In **Phase 0a** the supplement CTAs above are **waitlist** opt-ins (see §9 footnote). Bands are governed by `results-engine/thresholds.md` (§3). Note **critically-low Vitamin D (<25) → GP referral, no supplement CTA** (a GP-block state in `classifier.ts`, per the 2026-06-16 Ewa sign-off) — it does NOT route to the Daily Stack/waitlist.

### Joint symptoms qualifier (Kit 2-specific UX requirement)

Between hs-CRP result display and Collagen recommendation, dashboard prompts:
> *"Do you experience joint stiffness or soreness after training?"* (Yes / No)

If Yes → Collagen recommendation fires
If No → Lifestyle guidance only

This qualifier is a UX decision point, not a medical screening question. Logic lives in `results-engine/qualifier-logic.md` (currently placeholder — flagged for build).

### Ferritin dead-end (Kit 2-specific)

Low Ferritin (< 30 µg/L) results in **no supplement CTA.** Affects ~10–15% of Kit 2 buyers. Result must still feel actionable:

> *"Your iron stores are lower than they should be. We don't sell iron supplements — iron overdose is a real clinical risk, and it needs to be dosed based on your specific numbers by a GP. Here's what your result means and a letter template you can take to your NHS appointment."*

This maintains trust and brand credibility even without a conversion. Letter template in `09_website-app/frontend/email-templates/`.

---

## 6. Cross-Sell Architecture

### Direction 1: Kit 2 → Daily Stack / Collagen / Bundle (primary in-result conversion)

This is the supplement-conversion engine. ~12% target conversion at M3, scaling to 15%+ at M6.

### Direction 2: Kit 2 → Kit 1 (secondary cross-sell — energy-to-testosterone)

**When to trigger:** 2+ deficiencies in Kit 2 results, OR any single deficiency AND buyer is age 40+.

**Where it appears:** Results dashboard, after the supplement recommendation section, as a secondary section titled "One more thing worth knowing."

**The copy:**
> *"Your energy markers explain a lot of what you've been experiencing. One more thing worth knowing: testosterone also directly affects recovery speed and how your body responds to training — especially after 40. We haven't tested it here. Kit 1 checks your testosterone in 5 minutes for £99."*

**CTA:** "Check your testosterone — Kit 1, £99" (secondary button)

**Revenue note:** Kit 1 + Kit 2 cross-sell journey = £218 total. Better than a single Kit 3 (£179) AND builds richer data picture.

### What NOT to cross-sell

- **Kit 3 cross-sell from Kit 2 is now conditional, not blocked.** The 2026-05-26 repositioning makes Kit 3 the Kit 1 post-result upsell (primary path). For Kit 2 buyers, a Kit 3 cross-sell is only appropriate when 2+ deficiencies surface OR another clinically-coherent reason (age 40+ AND symptom mismatch). Do not auto-fire Kit 3 from every Kit 2 result — the natural Kit 2 next step is still Kit 1 (per §6.2 above), which itself may then upsell into Kit 3 if the result warrants. See [[project-kit3-repositioning]].
- **Do not mention the founding-member list on Kit 2 results.** Compliance rule — never infer low T from energy markers.

---

## 7. Compliance Scoping

| Rule | Detail |
|---|---|
| **Phase 0 boundary** | Kit 2 is wellness product. No clinical diagnosis. No prescribing. |
| **Testosterone mention** | Forbidden on Kit 2 page and in Kit 2 marketing copy |
| **Founding-member trigger** | NEVER from Kit 2 alone. Compliance rule. List is a non-cash email opt-in (no payment, no deposit). |
| **Diagnostic language** | Forbidden. Use "your results indicate." |
| **Joint symptoms qualifier** | MUST fire before Collagen CTA. Skipping qualifier = compliance violation. |
| **hs-CRP > 10 referral** | MUST display GP referral prompt. No supplement CTA. |
| **Ashwagandha** | Daily Stack contains it; silent ingredient. No copy mention anywhere. |
| **Collagen claims** | Only EFSA: "Vitamin C contributes to normal collagen formation for the normal function of cartilage." Never "heals joints," "reduces inflammation." |
| **B12 claims** | Only EFSA: "Contributes to normal energy-yielding metabolism" / "contributes to normal psychological function." Never "improves mood," "treats brain fog." |
| **Vitamin D claims** | Only EFSA: "Contributes to normal muscle function." |

---

## 8. Launch Operations

### Lab partner (Vitall)

- UKAS ISO 15189 accredited (same as Kit 1)
- 4-marker panel — confirmed feasibility with Vitall April 2026
- API integration shared with Kit 1
- Estimated dispatch: 2–3 days; results: within 2 to 5 working days after sample receipt

### Manufacturing / fulfilment

- White-label by Vitall
- Andro Prime branding on outer packaging
- Same return postage as Kit 1 (Royal Mail Tracked 24)
- COGS: £63.00 fully loaded

### Staged launch logic

Kit 2 launches **Week 6** (not Week 0) because:
- Kit 1 needs 6 weeks of operating evidence before Kit 2 dilutes attention
- Allows Kit 1 founding-member-list funnel to mature first (TRT day-1 readiness signal)
- Reduces operational complexity at launch
- Gate 0A check at Week 6 confirms whether Kit 1 funnel is healthy before adding Kit 2

If Gate 0A signals "cut" → Kit 2 launch may delay or be reconsidered.

---

## 9. Strategic Role

Kit 2 is the **broadest funnel product.** Captures men who would never buy a testosterone test but will buy an energy/recovery test.

Volume math (per master plan v2.2):
- M1: not yet launched (Week 6 launch)
- M2: 25–35 Kit 2 sales/month (~50% of total kit volume)
- M3: 50–60 Kit 2 sales/month (~55%)
- M6: 60–80 Kit 2 sales/month (~55%)

Kit 2 is the **primary driver of supplement subscriptions** — Daily Stack and Collagen both have direct biomarker triggers from this kit. ~70% of kit-to-supplement conversions come from Kit 2 buyers.

> **Phase 0a footnote (2026-05-23).** In Phase 0a, supplements are not yet on sale (sourcing 2 to 3 months out). For the Phase 0a window, Kit 2 drives **supplement-waitlist opt-ins** rather than subscriptions. Subscriptions reinstate in Phase 0b when the Daily Stack, Collagen, and Complete Men's Stack ship. See `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md` and `04_products/CONTEXT.md` (Results-Engine Trigger Rules — Phase 0a / Phase 0b columns).

---

## 10. Open Items

1. ~~Threshold values formally captured in `results-engine/thresholds.md`~~ — **DONE** (Ewa-approved 2026-06-16, reconciled into `classifier.ts`).
2. Joint symptoms qualifier UX — design + copy in `results-engine/qualifier-logic.md` (placeholder)
3. Ferritin GP letter template — copy in `09_website-app/frontend/email-templates/`
4. hs-CRP > 10 referral copy — needs Ewa sign-off
5. Kit 2 results dashboard view — design iteration ongoing
6. Complete Men's Stack bundle SKU setup (£54.95/mo) — Stripe product needed
7. Lab partner backup capacity — Vitall capped at ~150/month? Confirm Week -8.
8. Kit 2 staged-launch communication — needs PR/social plan for Week 6 announcement

---

*Compiled: April 2026*
*Owner: Keith Antony*
*Version: V7.2 (premium pricing reconciled)*
*Cross-references: catalogue V7.2, ICP alignment doc, products CONTEXT, compliance CONTEXT*
