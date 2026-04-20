# ICP, Kit & Supplement Alignment Analysis — Andro Prime
## Strategic Findings & Copy/Infrastructure Implications | April 2026

**Version:** 1.0
**Owner:** Keith Anthony
**Status:** Active — supersedes any conflicting copy or dashboard logic in earlier documents
**Cross-reference:** `catalogue/non-regulated-tier-v7.md`, `catalogue/product-catalogue-v7-1.md`, `../06_marketing/positioning/product-marketing-context.md`

> **For copy and web skills:** Read this file after `product-marketing-context.md` and before writing any kit page, results dashboard, supplement page, or email sequence. This document defines the correct selling logic, ingredient claims, dashboard flow, and cross-sell triggers. Where this file conflicts with `non-regulated-tier-v7.md` or the product catalogue, **this file takes precedence** on copy and UX decisions.

---

## 1. WHAT THIS DOCUMENT COVERS

This is the output of a full ICP-vs-product alignment review conducted April 2026, before lab partner negotiations. It covers:

1. How well each kit matches its target ICP — and where the gaps are
2. The correct cross-sell architecture between kits (which direction, when to trigger, what to say)
3. Supplement range issues and one formulation change
4. A revised selling principle for the results dashboard (result → educate → recommend → convert)
5. The retest loop mechanic and where it lives in the email sequences
6. Compliance implications for copy

---

## 2. KIT-TO-ICP ALIGNMENT

### Kit 1 (Testosterone Health Check, £29) — ICP 1 Primary

**Target ICP:** ICP 1 — Symptomatic Achiever. Fatigue, low libido, brain fog, loss of drive. GP said "normal."

**Alignment score:** Partial. Strong when testosterone is the cause. Weak when it isn't.

**The critical failure scenario to avoid in copy and dashboard:**
A man with ICP 1 symptoms buys Kit 1. His T is 14 nmol/L (normal range). He gets a Daily Stack recommendation. He takes it for 2 months. He still feels terrible — because his actual cause was Vitamin D deficiency or B12. He writes a negative review.

**Copy implication:** Never frame Kit 1 as "find out why you're knackered." Frame it as "find out if testosterone is the cause." That's a specific, defensible claim. The broader symptom attribution belongs to Kit 2 and Kit 3.

**Correct Kit 1 copy frame:**
- "Find out where your testosterone actually stands. 5 minutes. No GP needed."
- "GP said your testosterone is normal. Normal means not ill — not optimised. Here's the number."
- "If testosterone is the cause, you'll know. If it isn't, we'll tell you that too."

---

### Kit 2 (Energy & Recovery Check, £44) — ICP 2 Primary

**Target ICP:** ICP 2 — Proactive Optimiser. Training hard, not recovering. Energy dips, persistent soreness.

**Alignment score:** Strong. The four markers (Vit D, Active B12, hs-CRP, Ferritin) are the right panel for this ICP.

**Copy frame for Kit 2:**
- Lead with the symptom, not the biomarker. "Sore for 3 days" not "elevated hs-CRP."
- "This test checks the 4 markers that most directly explain why active men stop recovering like they used to."
- Never mention testosterone on the Kit 2 page — this is the product for men who don't think they have a hormone problem.

**Ferritin dead end — critical copy note:**
Low Ferritin (< 30 µg/L) results in no supplement CTA. This affects ~10–15% of Kit 2 buyers. The result must still feel actionable:

> *"Your iron stores are lower than they should be. We don't sell iron supplements — iron overdose is a real clinical risk, and it needs to be dosed based on your specific numbers by a GP. Here's what your result means and a letter template you can take to your NHS appointment."*

This maintains trust, generates goodwill, and keeps the brand credibility intact even without a conversion.

---

### Kit 3 (Hormone & Recovery Check, £69) — ICP 3 Primary

**Target ICP:** ICP 3 — Curious Maintainer. No specific complaint. Wants a baseline. Health-conscious, prevention-focused.

**Alignment score:** Moderate. The panel is correct, but the name "MOT" overpromises.

**The problem:** An ICP 3 buyer expecting a "health MOT" will likely compare Kit 3 to Medichecks' Well Man test (~£89, 15+ markers). Kit 3 has 6–7 markers. The expectation gap creates post-purchase disappointment.

**Name and positioning change (effective immediately in all copy):**

Do not use "MOT" as the primary framing. Use one of these instead:
- *"The Men's Hormone & Recovery Check"* — accurate, specific, not overpromising
- *"7 markers. The ones that actually explain how you feel."* — differentiates from broad unfocused panels

If "MOT" is retained anywhere (e.g. for SEO reasons on the product URL), it must be qualified:
- OK: "The health check your GP doesn't offer — your hormones, energy, and inflammation in one kit."
- Not OK: "Comprehensive health MOT" — implies coverage it doesn't have

**Kit 3 copy frame:**
- "If you're tired and recovering slowly and you don't know whether it's hormones, nutrition, or inflammation — this tells you."
- "Six results. Each one specific to how men over 40 actually feel and perform."
- The quiz should recommend Kit 3 when there is ambiguity — highest margin, best supplement conversion.

---

### ICP 4 (High-Performance Seeker) — No Current Product

No current product for ICP 4. Do not try to speak to them in kit copy. If they land on the site, they'll self-select out. One exception:

**Add a waitlist hook on the homepage or test selector page only:**
> *"Want a comprehensive optimisation panel — testosterone, thyroid, metabolic, cardiovascular? We're building it. [Join the list]."*

This captures ICP 4 emails for the post-CQC premium panel without creating false product expectations. Do not build a full page for this — a modal or footer hook is sufficient.

---

## 3. CROSS-SELL ARCHITECTURE

### Direction 1: Kit 1 → Kit 2 (primary cross-sell)

**When to trigger:** T result is 12–20 nmol/L (normal range) AND the buyer indicated fatigue or energy symptoms at checkout or on the quiz.

**Where it appears:** Results dashboard — after the T interpretation, before the Daily Stack CTA.

**The copy:**

> *"Good news — your testosterone is in range. That rules out one of the main causes. But Vitamin D, B12, and inflammation are the other major drivers of exactly what you're describing — and we can't see those from this test. A lot of men who get a normal T result find their actual answer in Kit 2. It checks all four energy and recovery markers for £44."*

**CTA:** "Check your energy markers — Kit 2, £44" (secondary button, below the Daily Stack CTA)

**Do not:** Present the cross-sell as "you need to buy another test." Present it as "here's the next logical step to get the full answer."

---

### Direction 2: Kit 2 → Kit 1 (secondary cross-sell — energy-to-testosterone)

**When to trigger:** 2+ deficiencies in Kit 2 results, OR any single deficiency AND buyer is age 40+.

**Where it appears:** Results dashboard — after the supplement recommendation section, as a secondary section titled "One more thing worth knowing."

**The copy:**

> *"Your energy markers explain a lot of what you've been experiencing. One more thing worth knowing: testosterone also directly affects recovery speed and how your body responds to training — especially after 40. We haven't tested it here. Kit 1 checks your testosterone in 5 minutes for £29."*

**CTA:** "Check your testosterone — Kit 1, £29" (secondary button)

**Revenue note for context:** Kit 1 + Kit 2 cross-sell journey = £73 total. Kit 3 = £69. The cross-sell path earns more than a single Kit 3 purchase and builds a richer data picture from the same customer.

---

### What NOT to cross-sell

- Do not cross-sell Kit 3 as an upsell from Kit 1 or Kit 2 on the same journey. Kit 3 is a standalone entry point, not a premium upgrade path. Upselling within a journey feels like you're dismissing the product they just bought.
- Do not mention the founding member programme in Kit 2 results unless a Kit 1 cross-sell was completed and returned low T. Never assume low T from energy/recovery symptoms alone.

---

## 4. SUPPLEMENT RANGE — WHAT CHANGED AND WHY

### 4.1 Daily Stack Formulation Change

**Old formulation:** Zinc, Magnesium Glycinate, Vitamin D3, Omega-3, Ashwagandha KSM-66

**New formulation (for manufacturer brief):**

| Ingredient | Dose | EFSA claim | Use in copy |
|---|---|---|---|
| Zinc | 30mg | "Contributes to the maintenance of normal testosterone levels" | Yes — Kit 1 normal T trigger |
| Magnesium Glycinate | 400mg | "Contributes to the reduction of tiredness and fatigue" | Yes — Kit 2 low Mg trigger |
| Vitamin D3 | 4,000 IU | "Contributes to normal muscle function" | Yes — Kit 2/3 low D trigger |
| Vitamin B12 (Methylcobalamin) | 1,000mcg | "Contributes to normal energy-yielding metabolism" / "contributes to normal psychological function" | Yes — Kit 3 B12 trigger (pending Thriva confirmation) |
| Ashwagandha KSM-66 | 600mg | **None approved — silent ingredient. Do not mention in copy.** | No |

**Why Omega-3 was removed:** The only EFSA claim available for Omega-3 is cardiovascular function. This has no relevance to ICP 1 or ICP 2 language (fatigue, recovery, testosterone). It was an unjustifiable ingredient from a copy standpoint. It may be reintroduced as a standalone product post-CQC for cardiovascular monitoring with TRT patients.

**Why B12 was added:** B12 deficiency causes fatigue, brain fog, and flat mood — exactly the ICP 1 symptom cluster that Kit 1 cannot address with testosterone alone. Adding B12 means the Daily Stack has a direct ingredient hook for four distinct result triggers (low D, low Mg, normal T maintenance, low B12). Confirm B12 inclusion in Kit 3 during Thriva negotiations.

**Ashwagandha compliance rule — mandatory for all affiliates and influencers:**
Ashwagandha has no approved EFSA health claim. Do not mention it in:
- Any Andro Prime copy (website, email, social)
- Any affiliate brief
- Any influencer talking points

It is listed on the label because it's in the formulation. It cannot be sold on. If an affiliate or influencer makes a claim about ashwagandha raising testosterone or reducing stress, the ASA complaint lands on Andro Prime. Brief every partner explicitly and in writing.

---

### 4.2 Daily Stack — Result-Specific Copy Hooks

The stack is one product. The copy should make each trigger feel personalised to the specific deficiency. Lead with the hero ingredient for their result.

**Kit 1 — Normal T (12–20 nmol/L) trigger:**
> *"Your testosterone is in range. Zinc is the single most well-evidenced mineral for keeping it there — and most UK men don't get enough from diet alone. The Daily Stack contains 30mg, along with Magnesium and Vitamin D3 to support the wider systems that keep your levels where they are."*

EFSA claim: "Zinc contributes to the maintenance of normal testosterone levels."

**Kit 2 — Low Vitamin D trigger:**
> *"Your Vitamin D is below where it should be. Between October and March, most UK men don't get enough sunlight to maintain healthy levels regardless of what they eat. The Daily Stack contains 4,000 IU of D3 — the dose most research suggests for correction, alongside Magnesium to support the same energy and recovery systems."*

EFSA claim: "Vitamin D contributes to normal muscle function."

**Kit 2 or Kit 3 — Low B12 trigger:**
> *"Your B12 is below optimal. B12 plays a direct role in energy metabolism and how well your brain functions day-to-day. The Daily Stack includes 1,000mcg of Methylcobalamin — the active form that's absorbed most efficiently."*

EFSA claims: "Contributes to normal energy-yielding metabolism" / "contributes to normal psychological function."

**Multiple deficiencies — bundle trigger:**
> *"Your results show low levels in more than one marker. Rather than picking one supplement, the Complete Men's Stack covers everything your results indicate — Daily Stack plus Collagen, at £54.95/month instead of £64.90."*

---

### 4.3 Collagen — Refined Trigger Logic

**Old trigger:** Elevated hs-CRP → Joint & Recovery Collagen

**Problem:** hs-CRP is a general inflammation marker. Many men with elevated CRP have no joint symptoms — the collagen recommendation feels irrelevant and conversion drops. Also, hs-CRP > 10 mg/L may indicate something that needs GP attention, not a supplement.

**New trigger logic:**

| hs-CRP level | Joint symptoms reported? | Action |
|---|---|---|
| 1–3 mg/L (mildly elevated) | Yes | Collagen recommendation (full copy) |
| 1–3 mg/L (mildly elevated) | No | Lifestyle guidance only. "Often driven by training recovery, sleep, and diet. No supplement needed right now — here's what the research suggests." |
| > 3 mg/L (elevated) | Yes | Collagen recommendation (full copy) + mention reviewing GP if persistent |
| > 3 mg/L (elevated) | No | Lifestyle guidance + "If this stays elevated on your next test, speak to your GP." |
| > 10 mg/L | Either | GP referral. "This level of inflammation warrants a conversation with your doctor. We'd recommend booking an appointment before taking any supplement." |

**Implementation note:** The qualifier question ("do you experience joint stiffness or soreness after training?") should appear on the results dashboard between the hs-CRP result and the recommendation section, triggered only when hs-CRP is elevated. It is a UX decision point, not a medical screening question — keep it simple and non-clinical.

**Collagen copy frame (when triggered correctly):**
> *"Your inflammation marker is elevated. In active men, this often reflects joint and connective tissue stress — the soreness that takes longer to go away than it used to. Joint & Recovery Collagen provides 10g of hydrolysed collagen peptides plus Vitamin C, which contributes to normal collagen formation for the normal function of cartilage."*

EFSA claim: "Vitamin C contributes to normal collagen formation for the normal function of cartilage."

**Do not say:** "Collagen heals your joints" — medicinal claim. **Do not say:** "Reduces inflammation" — medicinal claim.

---

### 4.4 Founding Member + Supplement (Not in V7 Model)

**The gap:** Men with T < 12 nmol/L (founding members) currently receive no supplement CTA. The model moves them straight to the deposit. This is a significant missed revenue opportunity from Andro Prime's most engaged cohort.

**The correct approach:** Founding member deposit is the primary CTA. Daily Stack is a secondary CTA, framed honestly.

**The copy (in seq-03b email 3 or on the dashboard below the founding member CTA):**

> *"These won't replace TRT — and we'll be straight with you about that. But Zinc, Magnesium, Vitamin D, and B12 are the four building blocks your body needs to function as well as it can with the levels you've got. Most men with low testosterone are also below optimal on at least two of these. The Daily Stack covers all of them for £34.95/month, and you can cancel any time."*

**What this is NOT:** A claim that supplements fix low testosterone. It is an honest, evidence-consistent statement about supporting general function while waiting. This framing is EFSA-compliant and clinically defensible.

**Placement:** Below the founding member CTA, as a separate section. Heading: "While you wait — support the basics."

---

## 5. THE REVISED SELLING PRINCIPLE — RESULTS DASHBOARD

### Old model: Result → Supplement CTA

The problem: a product recommendation sitting immediately after a result the customer is still absorbing feels opportunistic. For the founding member (T < 12), a "buy supplements" button right after bad news is tone-deaf. For a mildly elevated CRP result, it feels like a cash grab.

### New model: Result → Explain → Educate → Recommend → Convert

Every results section should follow this five-part structure. This applies to all kits, all markers, all recommendations.

**Structure for each marker on the dashboard:**

```
1. YOUR RESULT — plain English, no jargon
   "Your Vitamin D is 32 nmol/L."

2. WHAT THIS MEANS — personalised to their number and stated symptoms
   "This is below the level most research considers optimal for energy and muscle function.
   In the UK between October and March, this is more common than most people realise —
   sunlight alone can't maintain adequate levels."

3. WHAT THE EVIDENCE SAYS — educational, honest, not a sales pitch
   "Vitamin D3 supplementation at 4,000 IU/day has been shown in multiple trials to bring
   levels to the optimal range (75–125 nmol/L) within 3–4 months. Diet helps but is rarely
   sufficient on its own."

4. WHAT WE RECOMMEND — the Andro Prime product, framed as the data-led conclusion
   "The Daily Stack contains 4,000 IU of Vitamin D3 — the research-backed dose — alongside
   Magnesium and Zinc. [Buy Daily Stack — £34.95/month]"

5. WHAT ELSE TO KNOW — honest secondary information
   "Vitamin D levels typically improve in 8–12 weeks. At your 3-month retest, we'll be
   able to see how much they've moved."
```

**Why this model converts better AND retains better:**
- Customers who understand *why* they're taking a supplement stick with it longer than customers who bought on impulse
- The recommendation feels justified, not pushed — the data did the selling, not the UI
- It matches the brand promise ("data first") in the actual product experience

**Copy tone on the dashboard:** Keith's voice, not a medical report. Not formal. Not warm-and-fuzzy wellness. Direct and plain, as though Keith has looked at their results and is explaining them personally.

---

## 6. THE RETEST LOOP — WHERE IT LIVES

This mechanic needs to be built before Gate 0A.

**The principle:** Supplement subscribers have no way to know if what they're taking is working. This causes quiet churn at Month 2–3. A retest closes the loop and reduces churn by making the subscriber's progress visible.

**The mechanic:**

- Trigger: Supplement subscriber, Day 90 (email 4 or 5 in seq-04)
- Offer: 20% off the relevant retest kit (subscriber-only discount)
- Message:

> *"You've been on the Daily Stack for 3 months. Time to see if your levels have moved. Your subscriber discount takes Kit 2 down to £35.20 — and the result will tell you exactly where you stand now vs when you started."*

**Three outcomes from the retest — all of them are wins:**
1. **Improved:** Confirmation the supplement is working. Churn probability drops significantly.
2. **Unchanged:** An opportunity to investigate why (sleep? absorption? dose?) — keeps them engaged rather than quietly cancelling.
3. **Worsened:** Triggers a conversation with the clinical team / Ewa. Reinforces clinical credibility. May surface a founding member candidate.

**Add to seq-04 (subscriber onboarding):** Email 4 at Day 75–80, prompting the Day 90 retest. File: `seq-04-email-04-retest-prompt.md` in the email sequences folder.

**Copy for the retest email subject line options:**
- "3 months in — time to check your numbers"
- "Has your Vitamin D moved? Let's find out."
- "Your result then vs now — Kit 2 at 20% off"

---

## 7. COMPLIANCE — UPDATED RULES

In addition to the existing rules in root `CLAUDE.md`:

| Rule | Context |
|---|---|
| Never say ashwagandha raises testosterone or reduces stress | No EFSA claim exists. Silent ingredient. Not mentionable in copy. |
| Never say collagen heals joints or reduces inflammation | Medicinal claims. Use: "contributes to normal collagen formation for the normal function of cartilage." |
| Never say B12 improves mood or treats brain fog | Use: "contributes to normal psychological function" and "contributes to normal energy-yielding metabolism." |
| Never cross-sell to founding member deposit based on Kit 2 result alone | Founding member CTA requires a confirmed testosterone result (T < 12 nmol/L). Never infer low T from energy markers. |
| Never position the retest as "find out if the supplement cured you" | Use "find out how your levels have changed." Supplements don't cure — they support. |
| Kit 1 copy must not claim to explain all fatigue/energy symptoms | Kit 1 tests testosterone only. Limit copy claims to testosterone. |

---

## 8. RESULTS DASHBOARD CONDITIONAL LOGIC (CANONICAL TABLE)

This table supersedes any conflicting version in other workspace CONTEXT files.

| Result | Qualifier needed? | Primary CTA | Secondary CTA |
|---|---|---|---|
| T < 12 nmol/L | None | Founding member deposit | Daily Stack ("while you wait" framing) |
| T 12–20 nmol/L | Check if energy symptoms stated | Daily Stack (zinc hero) | Kit 2 cross-sell (if energy symptoms) |
| T > 20 nmol/L | None | Retest reminder (6–12 months) | None |
| Low Vit D | None | Daily Stack (D3 hero) | Kit 1 cross-sell (if age 40+ or 2+ deficiencies) |
| Elevated hs-CRP | Ask joint symptoms question | Collagen (if joint symptoms: Yes) | Lifestyle guidance (if joint symptoms: No) |
| hs-CRP > 10 mg/L | None | GP referral — no supplement CTA | None |
| Low Ferritin < 30 µg/L | None | GP referral + dietary guidance | None |
| Low B12 (Kit 2 or Kit 3) | None | Daily Stack (B12 hero) | None |
| 2+ deficiencies | None | Complete Men's Stack (£54.95/mo) | Individual products as fallback |

---

## 9. KIT PAGE COPY CONSTRAINTS

| Page | Hero claim | Do not claim |
|---|---|---|
| Kit 1 `/kits/testosterone/` | "Find out where your testosterone stands" | "Find out why you're tired" — too broad for this panel |
| Kit 2 `/kits/energy-recovery/` | "Find out why you're not recovering" | Anything about testosterone |
| Kit 3 `/kits/hormone-recovery/` | "9 markers. Hormones, energy, recovery, inflammation." | "Comprehensive health MOT" or "full health check" |
| `/supplements/daily-stack/` | Lead with zinc/T claim for ICP 1 traffic; Mg claim for ICP 2 traffic | Any ashwagandha claim |
| `/supplements/collagen/` | Vitamin C — collagen formation — cartilage function | "Heals joints" / "reduces inflammation" |

---

## 10. CHANGES SUMMARY — WHAT'S NEW VS V7

| Change | Applies to | Priority |
|---|---|---|
| Kit 1 copy scoped to testosterone specifically — not general fatigue | Kit 1 page, all Kit 1 ads | High |
| "MOT" dropped or qualified in Kit 3 copy and positioning | Kit 3 page, Kit 3 ads, quiz | High |
| Kit 1 → Kit 2 cross-sell in results dashboard (normal T + energy symptoms) | Dashboard | High |
| Kit 2 → Kit 1 cross-sell in results dashboard (2+ deficiencies or age 40+) | Dashboard | Medium |
| Daily Stack: B12 replaces Omega-3 in formulation brief | Manufacturer brief, all supplement copy | High |
| Ashwagandha: silent ingredient — no copy mentions anywhere | All copy, all affiliate briefs | High |
| Daily Stack copy personalised to hero ingredient per trigger | Dashboard, supplement page, emails | High |
| Founding member secondary CTA — Daily Stack (honest framing) | Dashboard, seq-03b email 3 | High |
| Collagen trigger: add joint symptoms qualifier question | Dashboard | Medium |
| hs-CRP > 10 — GP referral not supplement CTA | Dashboard | High |
| Results dashboard follows 5-part structure (result → explain → educate → recommend → convert) | Dashboard, all result emails | High |
| Retest prompt added to seq-04 as email 4 at Day 75–80 | seq-04 email sequence | Medium |
| ICP 4 waitlist hook (one element, homepage or test selector only) | Homepage, test selector | Low |

---

*Last updated: April 2026*
*Owner: Keith Anthony*
*Status: Active — derived from ICP/kit/supplement alignment review, April 2026*
