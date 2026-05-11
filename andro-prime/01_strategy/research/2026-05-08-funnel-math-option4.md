# Funnel Math, LTV & Option 4 Viability

*Research Agent C. 2026-05-08. Internal data sourced from Andro Prime strategy & product docs. Source confidence tagged inline (H/M/L). UK & NI scope.*

---

## Executive summary

- **Phase 0 cash-LTV per Kit 1 customer is structurally weak across all four options.** Even under the most generous mid-case (Option 4), a Kit 1 customer is worth approximately £55–£105 of *Phase 0 cash* per acquired buyer. The £75 founding-member deposit is a refundable liability, not revenue, and supplement margin is thin against base spend by the time PT bonuses, the 10% discount, and Stripe are taken out. **Kit 1's value is almost entirely deferred (post-CQC TRT) — not in-period cash.** (H — derived from `phase0-financial-model-v1.md` and `phase0-marketing-plan.md` v2.2.)
- **Option 4 is the only option that produces a defensible *in-period* LTV uplift on Kit 1.** It captures the ~50–70% of Kit 1 buyers (normal-T + borderline) who currently exit the funnel with no recurring revenue. Mid-case lift: ~£40–£70 per Kit 1 buyer in incremental supplement gross profit over 6 months. (M — supplement conversion benchmarks are uncertain; tenure assumption is the largest swing variable.)
- **The CQC-trigger threshold is the highest-stakes downstream variable.** At today's volumes (Kit 1 minimum: 75 over 6 months at ~15–20% low-T base rate × 8–12% Kit 1→FM conversion = **~1–2 deposits from Kit 1 over 6 months**), Kit 1 *cannot* hit the 40-deposit CQC trigger inside Phase 0 by itself. Kit 3 contributes ~10–18 more. **Demoting Kit 1 (Options 1, 3) only loses ~3–5 deposits over 6 months — meaningful but not catastrophic.** The trigger is not made by Kit 1 alone in any option.
- **Option 4's EFSA-claim ceiling is workable for normal/borderline tiers, but constrained for the low-T tier.** The "Daily Stack while you wait" framing (Zinc → normal T maintenance + Active B12 + D3) is already drafted in seq-03b Email 3 and is compliantly defensible. The genuinely hard tier is **borderline T (12–15)** — copy must avoid implying the supplement will *raise* a low-but-not-clinical level. Cleared with current EFSA register.
- **Operational complexity for Option 4 is moderate (3/5).** Single-SKU works (Daily Stack already maps Zinc to Kit 1). Email-sequence lift is real but bounded — repurposing seq-03c (normal results) and seq-03d (borderline) plus modifying seq-03b. Founding-member becomes a cross-cutting elective layer (separate page/email, not result-gated).
- **Decoupling founding-member from low-T trigger creates an ASA-readable risk that needs founder + Ewa sign-off.** If FM becomes elective and Kit 1 normal-T customers can opt in, the CTA narrative shifts from "your blood says low T → reserve a TRT slot" to "be early for our future clinical service" — closer to a generic pre-sale and weaker on the Phase 0 / Mode A / Mode B boundary policed by `03_compliance/CONTEXT.md`. Not unworkable, but the framing must be redrafted by Ewa, not adapted from the current seq-03b.
- **Best score on unit economics: Option 4 (mid-case) > Option 2 > Option 1 > Option 3.** Option 4 wins on incremental supplement revenue and wins the ICP-3-misrouted-to-Kit-1 cohort. Option 2 (reposition with recovery markers) doubles Kit 1's COGS and erodes the £99 price floor. Options 1 and 3 simplify the model but waste a measurable supplement bridge already drafted in seq-03b.
- **Founder-call territory (flagged below):** whether post-CQC clinical is genuinely the long-term mission (drives Kit 1's deferred-revenue case); whether brand cohesion across wellness → clinical pivot matters more than Phase 0 cashflow; risk tolerance for redrafting the FM CTA away from a clinical trigger.

---

## LTV math by option

### Shared inputs (sourced from internal docs)

| Variable | Value | Source | Confidence |
|---|---|---|---|
| Kit 1 retail | £99 (£89.10 with PT 10% code) | `phase0-marketing-plan.md` v2.2 §0; `kit-1-testosterone-health-check.md` §1 | H |
| Kit 1 COGS | £58.50 | `phase0-financial-model-v1.md` §2.1; `commission-structure.md` §2 | H |
| Kit 1 net direct | £38.02 | `commission-structure.md` §2 | H |
| Kit 1 net affiliate (no bonus) | £13.37 | `commission-structure.md` §2 | H |
| Kit 1 blended (50/50, v2.2) | £25.70 | `phase0-marketing-plan.md` v2.2 §1 | H |
| Daily Stack subscription | £34.95/mo | `daily-stack.md`; `phase0-financial-model-v1.md` §2.2 | H |
| Daily Stack COGS (planning) | £15.00 (range £12–£17.50) | `phase0-financial-model-v1.md` §2.2; blueprint §3.1 | M |
| Daily Stack gross margin | £19.95 (57.1%) | `phase0-financial-model-v1.md` §2.2 | H |
| Founding-member list | Non-cash email opt-in (£75 cash deposit shelved 2026-05-08 — see banner note above) | `master-implementation-blueprint.md` §7.4; seq-03b Email 3 | H |
| Founding-member CTA trigger | T < 12 nmol/L (Kit 1 or Kit 3 only) | `03_compliance/CONTEXT.md` §Special Cases | H |
| Kit 1 supplement-conversion baseline | ~8% (lowest of 3 kits) | `kit-3-hormone-recovery-check.md` §5 ("~8% Kit 1") | M |
| Population low-T rate (Kit 1 buyers <12 nmol/L) | 30–35% expected | `master-implementation-blueprint.md` §8.4 | M |
| Kit 1 → founding-member conversion | 8–12% of all Kit 1 buyers (planning case) | `master-implementation-blueprint.md` §8.4 | M |
| Supplement subscriber tenure | **Not specified internally** — Gate 0C target churn <8%/mo (~12-month half-life) | `master-implementation-blueprint.md` §8.2; `phase0-marketing-plan.md` v2.2 §10 | **L** (internal gap) |
| Industry benchmark — DTC supplement-box monthly churn | 10–15%/mo (3–6 months avg tenure) | External: subscription industry studies (Marketing LTB / Swell 2026) | M |

> **Critical assumption:** I've used a **planning case of 4 months average tenure** for Daily Stack subscribers (between 3-month industry benchmark and the Gate 0C target of <8% churn). This is the single largest swing variable in all LTV math below — sensitivity flagged at the end of the section.

### LTV model logic

For each Kit 1 buyer in Phase 0, LTV = Kit 1 net contribution (in-period) + (low-T probability × FM-deposit cash float, marked at zero net revenue because refundable) + (supplement-conversion probability × Daily Stack margin × tenure).

The £75 deposit is **not** counted as Phase 0 revenue — it is held separately per blueprint §7.4 and is refundable under Consumer Rights Act terms. It only converts to revenue post-CQC. For Phase 0 LTV purposes, treated at £0 cash but flagged as deferred-revenue option value.

### Per-option LTV table (per acquired Kit 1 buyer, Phase 0 cash only)

Assumptions: blended affiliate mix per v2.2 (50/50 direct/affiliate); Daily Stack tenure = 3 / 4 / 6 months for low/mid/high. Phase 0 = 6 months.

| Option | Kit 1 net (blended) | Kit 1→supplement conv % | Supplement gross margin / customer | Low-T % buyers | Cash-LTV Low | Cash-LTV Mid | Cash-LTV High | Deferred (FM deposits, refundable) |
|---|---|---|---|---|---|---|---|---|
| **Option 1 — Demote Kit 1** (no marketing push, organic-only) | £25.70 | 8% (current default) | £19.95 × tenure × conv = £4.79 / £6.38 / £9.58 | 30% | **£30.49** | **£32.08** | **£35.28** | £75 × 8–12% = £6–£9 deferred per buyer |
| **Option 2 — Reposition Kit 1** (add recovery markers) | ~£15–20 (COGS up; assume +£12 lab cost = £70.50 COGS; price unchanged at £99) | 12–15% (closer to Kit 2 because broader panel) | £19.95 × tenure × 13.5% = £8.08 / £10.77 / £16.16 | 25% (broader buyer profile dilutes low-T %) | **£23.08** | **£25.77** | **£31.16** | £75 × 6–9% = £4.50–£6.75 deferred |
| **Option 3 — Drop Kit 1 entirely** | £0 (no Kit 1 sales) | n/a | n/a | n/a (no Kit 1 funnel) | **£0 from Kit 1; FM pipeline relies on Kit 3 only** | — | — | £0 from Kit 1 |
| **Option 4 — Pair Kit 1 with supplement regardless of result + FM elective** | £25.70 | **18–25%** (matches Kit 2 because all tiers get bridge copy) | £19.95 × tenure × 21.5% = £12.87 / £17.16 / £25.74 | 30% (unchanged trigger logic; deposit is now opt-in for normal-T too) | **£38.57** | **£42.86** | **£51.44** | FM elective opt-in: ~3–8% of Kit 1 buyers (estimated from external benchmarks — see §3 below). £75 × 5% = £3.75 deferred, but pool widens to all buyers, not just low-T |

**Sensitivity to tenure assumption (Option 4 mid):** at 3-month tenure: £37.50 LTV. At 6-month tenure: £51.44. At 12-month tenure (Gate 0C target): £77.32. **The tenure assumption alone moves Option 4 LTV by ~2x.**

**Confidence flags:**
- Option 1 LTV: M-H (uses today's actual numbers).
- Option 2 LTV: L (assumed +£12 COGS for added markers — not validated against Vitall quote; conversion uplift is a guess).
- Option 4 LTV: M (conversion uplift assumes Kit 1 supplement copy converts at Kit 2 rates — defensible because both end in result-driven bridge, but unproven).

---

## Founding-member pipeline analysis

### Phase 0 volume baseline (per `phase0-marketing-plan.md` v2.2 §1, minimum case)

| Kit | 6-mo volume (minimum) | 6-mo volume (stretch) |
|---|---|---|
| Kit 1 | 75 | ~120 |
| Kit 2 | 210 | ~270 |
| Kit 3 | 90 | ~120 |
| **Total** | **375** | **~510** |

(Note: the v2.2 mix is heavily Kit-2-weighted vs the financial model's V1.0 split. The 73 / 136 / 42 split in `phase0-financial-model-v1.md` §4.1 is the conservative case.)

### FM-deposit volume per option (Phase 0, 6 months)

Trigger is unchanged in Options 1, 2, 3: T < 12 nmol/L → FM deposit. Conversion math from blueprint §8.4: 30–35% of Kit 1 buyers register low T, of which 25%+ click FM CTA, of which 40%+ convert to deposit = blended **8–12% of all Kit 1 / Kit 3 buyers**.

| Option | Kit 1 deposits | Kit 3 deposits | Total Phase 0 FM deposits | Hits 40-deposit CQC trigger? |
|---|---|---|---|---|
| **Option 1 — Demote Kit 1** | 75 × 8% = **6** | 90 × 8–12% = **7–11** | **13–17** | **No.** Below trigger by ~25. |
| **Option 2 — Reposition Kit 1** (broader panel dilutes low-T % to ~6–9% conv) | 75 × 7% = **5** | 90 × 8–12% = **7–11** | **12–16** | **No.** Below trigger. |
| **Option 3 — Drop Kit 1** | 0 | 90 × 8–12% = **7–11** | **7–11** | **No.** Far below trigger. |
| **Option 4 — Decouple FM from low-T** | (a) Low-T-triggered: 75 × 8% = 6 + (b) Elective opt-in: 75 × 5% = ~4 | (a) Kit 3 low-T: 7–11 + (b) Kit 3 elective: ~4 | **21–25** (low-T) + **~8** (elective) = **~29–33** | **No, but closest.** Within ~10 of trigger. |
| **Baseline (current model)** | 75 × 8–12% = 6–9 | 90 × 8–12% = 7–11 | **13–20** | **No.** |

> **Critical finding:** ***Under no option does the 40-deposit CQC trigger fire by Month 6 from Kit 1 + Kit 3 alone at v2.2 minimum-case volumes.*** This is true today, irrespective of the option chosen. The trigger only fires under stretch volumes (~510 total kits) AND if Kit 1+Kit 3 volume (210 stretch) is at the upper end.
>
> **Implication:** Option 1 and Option 3 lose 3–5 deposits over Phase 0. That is a real loss but does not change whether the CQC trigger fires by M6. The trigger has a separate volume problem that no kit option fixes.

### Option 4 elective opt-in rate — external benchmark

There is no internal data point. External benchmarks (M):

| Comparable | Conversion to recurring/membership | Source / note |
|---|---|---|
| Function Health (annual membership pre-sale) | Not publicly disclosed; ~$365/yr after launch from $499 launch price suggests price-sensitivity | Lexology / Heart Fit |
| InsideTracker (tier upgrade from one-time test buyer to subscription) | Not publicly disclosed | Generation Lab / Gene Food |
| DTC subscription-box trial-to-paid (general) | Median 2.66% high-priced; 1.49% low-priced (download-to-paying) | RevenueCat 2025 |
| Health & Fitness app trial-to-paid | Median 39.9%; top 10% 68.3% | RevenueCat 2025 |
| Premium DTC opt-in to deposit/waitlist (general) | 2–8% of cold visitors; 5–15% of warm/post-purchase audiences | Industry benchmarks (typical pre-launch waitlists) |

**My estimate for Option 4 elective FM opt-in among normal-T Kit 1 buyers:** **3–8% (planning case 5%).** This is the rate at which a buyer who has just been told "your testosterone is fine" would still elect to put down a £75 refundable deposit for a future clinical service. Lower than today's 8–12% of all Kit 1 buyers because the urgency narrative ("your blood is telling you something") is gone.

### Phase 0 pipeline-quality consequences

Pipeline quality is more important than raw count for the post-CQC TRT business. A low-T-triggered deposit converts to TRT at 70–85% (blueprint §3.3). An elective opt-in (Option 4 incremental layer) converts to TRT at a meaningfully lower rate — they have no clinical reason to be there. Defensible estimate: 30–50% TRT conversion. **Therefore one Option 4 incremental deposit is worth ~0.4 of a low-T-triggered deposit in long-term value.** This argues for keeping the low-T trigger primary, even under Option 4.

---

## EFSA-claim audit for Option 4 supplement bridge

Pulled from `03_compliance/CONTEXT.md`, `daily-stack.md`, `icp-kit-supplement-alignment-april2026.md` §4 and §7, and `copy-content-context.md` Compliance Checklist.

The Daily Stack (V7.2) carries three EFSA-approved claims and one silent ingredient:

| Ingredient | Approved claim | Phase 0 use |
|---|---|---|
| Zinc | "Contributes to the maintenance of normal testosterone levels" | Permitted |
| Vitamin D3 | "Contributes to normal muscle function" | Permitted |
| Active B12 (Methylcobalamin) | "Contributes to normal energy-yielding metabolism" / "normal psychological function" | Permitted |
| Ashwagandha KSM-66 | **No claim — silent ingredient** | **Not mentionable, anywhere** |

### What is compliantly say-able at each Kit 1 result tier under Option 4

| Result tier | Compliant supplement-bridge copy | Hard constraints | Risk level |
|---|---|---|---|
| **Optimal (T > 20 nmol/L)** | "Your testosterone is in the optimal range. Zinc contributes to the maintenance of normal testosterone levels, and the Daily Stack provides 30mg alongside Vitamin D3 and Active B12 — common deficiencies in UK men. Many men in your range take it as a maintenance step." | Cannot say "preventative" (medicinal). Cannot say "stops decline" (medicinal). Cannot promise outcomes. | **L** — wellness/maintenance framing is well-established and EFSA-anchored. |
| **Normal (T 15–20 nmol/L)** | "Your testosterone is in range. Zinc contributes to the maintenance of normal testosterone levels — that's the EFSA-approved claim, and it's the single most well-evidenced mineral for keeping levels where they are. The Daily Stack contains 30mg." (Existing copy in `icp-kit-supplement-alignment` §4.2) | Same as optimal. Cannot imply Daily Stack will *raise* T. | **L** — already drafted, already compliant. |
| **Borderline (T 12–15 nmol/L)** | "Your testosterone is at the lower end of the typical range. Zinc contributes to the maintenance of normal testosterone levels. The Daily Stack also includes Vitamin D and Active B12 — both directly tied to energy and recovery. We'd recommend a retest in 3 months to track movement." | **Hardest tier.** Cannot say "supplements will move you out of borderline." Cannot say "raise your testosterone." Cannot frame as treatment. The retest framing must use "find out how your levels have changed" — not "find out if it worked" (per `03_compliance/CONTEXT.md` Red-Flag table). | **M** — copy is feasible but every word matters. Ewa must sign off. |
| **Low (T < 12 nmol/L)** | "While you wait — support the basics." Zinc + D3 + Active B12 framing; explicit disclaimer "These won't replace TRT — and we'll be straight with you about that." (Already drafted in seq-03b Email 3, lines 113–127.) | Cannot frame as alternative to TRT. Cannot imply supplements address the underlying clinical deficiency. The honest disclaimer is mandatory. | **L–M** — already drafted and compliant; Ewa-reviewed in seq-03b. The narrative tension (low-T result + supplement upsell + FM deposit) is high but the language is solid. |

### Constraint summary

The **borderline tier (T 12–15)** is the only genuinely tight space. The temptation in copy will be to imply that taking the Daily Stack might move someone from borderline to normal. **The EFSA register has no claim that supports this** — Zinc's claim is "maintenance of normal," not "elevation of borderline." Copy must not cross that line.

The **Ashwagandha trap is real but well-managed** — the silent-ingredient rule already governs all copy across all sequences (`03_compliance/CONTEXT.md` Special Cases). Option 4 does not add new risk here.

The **ASA "exaggerated savings claim" rule** (v2.2 plan §3) does not bear directly on Option 4 unless Option 4 introduces a discount on the Daily Stack at the bridge moment. Recommend not introducing a Kit-1-result-specific Daily Stack discount, to avoid this trap.

### Per-tier compliance verdict

Option 4 is **not constrained to the point of compromising the conversion narrative.** All four tiers have defensible bridge copy. The main compliance lift is in the borderline tier and in redrafting the FM CTA under the elective model. Both are tractable but require Ewa sign-off before launch.

### External ASA enforcement context (M)

Per ASA monthly insights and `Lexology` 2025–2026 coverage: ASA enforcement on testosterone-related supplement claims has been **active and tightening**. Five rulings in August 2025 against unlicensed medicinal claims; nine more in December 2025. The risk is not theoretical. Option 4 increases Kit-1-supplement-bridge surface area (more bridges = more copy = more audit exposure), but the structural EFSA-anchor model is already the right defensive posture.

---

## Operational complexity assessment for Option 4

### Sub-scored on the five dimensions

| Dimension | Score (1–5, 5 = most complex) | Reasoning |
|---|---|---|
| **Single SKU vs differentiated formulations** | **1** | Daily Stack already covers all four tiers via personalised hero-ingredient copy (`daily-stack.md` §Result-to-Copy Triggers; `icp-kit-supplement-alignment` §4.2). Zinc as the hero for normal/optimal T; same SKU, different copy. **No new formulation needed.** This is the cleanest dimension of Option 4. |
| **Results-engine logic changes** | **2** | Existing dashboard logic (`icp-kit-supplement-alignment` §8 canonical table) already maps each result tier to a primary CTA. Option 4 changes the FM CTA from "primary on T<12" to "secondary/elective on every Kit 1 result." This is a single conditional flip per tier in `results-engine/conversion-rules.md`. The thresholds doc (`thresholds.md`) is currently a placeholder — it needs population anyway, regardless of option. **Modest lift.** |
| **Manufacturing / fulfilment** | **2** | If Option 4 lifts Kit 1 → Daily Stack conversion from 8% → ~20%, additional supplement subscribers from Kit 1 = (75 × 12pp uplift × 4-month tenure) ≈ 36 extra subscriber-months over 6 months. Daily Stack MOQ is 500 units (`daily-stack.md` §Manufacturer Brief). Phase 0 minimum case is ~20 active subs by M6 (`phase0-financial-model-v1.md` §6); Option 4 might bring this to ~30. **Within MOQ comfortably.** |
| **Copy & email-sequence work** | **3** | Existing sequences: seq-03b (low-T) and seq-03c (normal results) already exist in `09_website-app/frontend/email-templates/sequences/`. Option 4 needs: (a) seq-03b modification (FM becomes optional, supplement primary); (b) seq-03c expanded with Kit-1-Zinc-hero variant; (c) new seq-03d (borderline) — already exists; (d) new elective FM landing page + opt-in flow + pre-deposit nurture. **Estimated: 6–10 emails of new/modified copy + one new page + Ewa review on each.** Material but bounded. |
| **CQC-trigger redefinition** | **4** | Currently the trigger is 40+ FM deposits (blueprint §1.3 strategy CONTEXT.md Gates table). Under Option 4, deposits split into low-T-triggered (high-conversion-quality) vs elective (lower-quality). Concrete proposal: redefine trigger as **40+ deposits where ≥30 are low-T-triggered (Kit 1 or Kit 3 confirmed T<12)**. This preserves the pipeline-quality argument that drove the original 40-deposit threshold. The April 22 thinking (per memory `project_product_ideas.md`) suggested the trigger could become "40+ active subscribers" — that is a distinct redefinition that decouples the trigger from clinical signal entirely. The clinical signal preservation matters: a trigger of "40 active supplement subscribers" hands CQC a weaker case for clinical demand. **Founder + Ewa call required.** |

### Total operational complexity score: **2.4 / 5 (low–moderate)**

The lift is real but not blocking. The hardest single piece is the CQC-trigger redefinition (a strategy decision more than an ops one). Single-SKU and minimal results-engine changes mean the build cost is contained.

---

## Scorecard

| Option | Phase 0 LTV per Kit 1 customer (mid) | FM pipeline volume (6 mo, Kit 1+Kit 3) | Operational complexity (1–5) | EFSA-compliance risk (L/M/H) | Margin defensibility vs Medichecks |
|---|---|---|---|---|---|
| **Option 1 — Demote** | £32.08 | 13–17 | 1 | **L** (no new bridges) | **L** — Kit 1 still nominally available at £99 vs Medichecks £55–95. Looks expensive in isolation. |
| **Option 2 — Reposition (add recovery)** | £25.77 | 12–16 | 4 (new panel, new lab cost, new copy, may push Kit 1 over £99) | **M** (broader markers = more bridge claims to police) | **M** — broader panel partially escapes direct Medichecks comparison if priced cleanly, but COGS rise erodes margin. |
| **Option 3 — Drop entirely** | £0 (no Kit 1 funnel) | 7–11 | 1 (deletion-only) | **L** | n/a — no Kit 1 to compare. |
| **Option 4 — Pair + decouple FM** | **£42.86** | 21–33 (incl. ~8 elective deposits of lower clinical quality) | 2.4 | **M** (borderline tier + redrafted FM CTA) | **M-H** — Kit 1 + Daily Stack as a system is a different value proposition to a £55 Medichecks one-off test. The supplement bridge IS the differentiator. |

### One-paragraph commentary per option

**Option 1 — Demote.** Cleanest operationally. Loses ~3–5 deposits over Phase 0 vs the current model. Saves no real cost (Kit 1 is already low-margin and PT-fee-eaten). Wastes the seq-03b sequence already built. Does not solve the Medichecks comparison; it just hides the kit. The ~75 Kit 1 buyers in the v2.2 minimum case still happen organically — they're just not actively marketed. **Verdict: viable but unambitious. Best for a founder who has decided post-CQC clinical is genuinely lower priority than supplement subscription as the long-term mission.**

**Option 2 — Reposition (add recovery markers).** Solves the Medichecks comparison the most directly. Costs the most operationally — Vitall quote needed for a new panel, new dashboard logic, new copy, possibly a price increase to £109–119 to absorb COGS, bringing Kit 1 into Kit 2's price territory and creating internal cannibalisation. The benefit (escape from Medichecks comparison) is real but expensive to engineer. **Verdict: high cost, contested benefit. Option 4 captures most of the same upside (Kit 1 stops being a dead-end product) at lower ops cost.**

**Option 3 — Drop entirely.** Maximum simplification. Kit 3 picks up the FM pipeline (~7–11 deposits over 6 months) — meaningfully below the 40-deposit trigger but the trigger is also missed under Options 1 and 2 in any case. Loses the ICP 1 ("GP said normal") narrative that anchors `seq-03b`, Keith's brand story, and the entire NHS-gap content angle. **Verdict: unambitious; loses brand asset. Hard to recommend unless founder is genuinely re-platforming away from the testosterone narrative.**

**Option 4 — Pair + decouple.** Highest in-period LTV. Captures the wasted normal-T cohort. Operationally moderate but tractable. Compliance risk is real but bounded — borderline tier and FM-CTA redraft are the two genuine asks. The CQC-trigger redefinition is a real strategic decision the founder must make explicitly. **Verdict: best on unit economics; depends on founder appetite for Phase 0 operational lift in exchange for a structurally better Kit 1 economic.**

---

## Founder-call flags

The data does not resolve these. They require explicit founder + Ewa decisions.

1. **Is post-CQC clinical genuinely the long-term mission?** If yes, Kit 1's deferred-revenue value (TRT pipeline) is the largest single LTV component and Options 1 / 3 (demote / drop) destroy the most value. If clinical is now optional or distant, supplement subscription is the actual business and Option 4 is the cleanest economic answer. **The data cannot resolve this — it's a strategic identity question.**
2. **Does brand cohesion across wellness → clinical pivot matter more than Phase 0 cashflow?** Option 4 weakens the FM CTA's clinical narrative (FM becomes elective; weaker pipeline-quality signal). Phase 0 cashflow improves (more supplement subs from Kit 1). The two are in tension. **Founder + Ewa call.**
3. **Risk tolerance for adding Phase 0 operational complexity.** Option 4's 2.4/5 complexity is moderate but real. Sequence rewrites + new opt-in flow + Ewa review on every new copy block. If Keith's bandwidth is the binding constraint (per `project_outstanding_tasks.md`), Option 4 may not be deliverable inside the v2.2 launch window.
4. **CQC-trigger redefinition philosophy.** "40 low-T-triggered deposits" preserves clinical signal. "40 active supplement subscribers" decouples CQC trigger from clinical demand entirely, which weakens the case to the regulator. **Founder + Ewa call. Recommend Ewa-led.**
5. **Whether to retain the £75 deposit at all under Option 4.** The April 22 product-ideas memo flagged subscription-as-FM-entry as a separate idea. If FM is decoupled from low-T anyway, the £75 deposit becomes a less elegant mechanism — a £39.95 supplement subscription would do most of the same intent-signalling job with real (not refundable) revenue. **This is a separate sub-decision inside Option 4.**

---

## Research gaps & follow-up cost

### Internal data missing

| Gap | Impact | Cost to resolve |
|---|---|---|
| Daily Stack subscriber average tenure (planning vs actual) | High — single largest swing variable in all LTV math | £0 — needs Keith decision on planning assumption (set in `master-implementation-blueprint.md`); validates with M3 actuals once supplements live |
| `04_products/results-engine/thresholds.md` is a placeholder | Medium — Ewa thresholds are a blueprint §7.2 BLOCKER; results-engine logic depends on them | £0 — Ewa sign-off |
| `04_products/results-engine/results-to-product-mapping.md` is a placeholder | Medium — option 4 conversion rules have nowhere to live currently | £0 — internal documentation lift |
| Vitall quote for an expanded Kit 1 panel (Option 2 sizing) | Medium — Option 2 economics are unverified | £0 — email Vitall |
| Realistic Kit 1 → Daily Stack conversion rate at v2.2 pricing | High — current 8% estimate is from `kit-3-hormone-recovery-check.md` (relative inference, not measured) | £0 — measurement begins at launch |
| FM-CTA conversion rate from non-low-T cohort | High for Option 4 sizing | Requires soft-launch test at M2–M3 |
| Confirmatory `04_products/catalogue/non-regulated-tier-v72-financials.md` reconciliation with v1.0 financial model | Medium — V7.2 uses £89/£99/£149 retail vs v2.2's £99/£119/£179. There is an unresolved pricing inconsistency between `non-regulated-tier-v72-financials.md` and `phase0-financial-model-v1.md`/v2.2 marketing plan. This affects every kit margin calculation. | £0 — Keith reconciliation; flagged here as data hygiene issue. |

### External sources accessed (M confidence)

- ASA monthly insights / Lexology coverage of supplement claim rulings 2025–2026
- DTC subscription-box churn benchmarks (Marketing LTB, Swell, RevenueCat 2025)
- Function Health and InsideTracker public pricing (Heart Fit, Lexology, Generation Lab) — note: actual conversion rates are not publicly disclosed; my Option 4 elective-opt-in estimate is interpolated from generic consumer subscription benchmarks, not direct comparable data.

### External sources I could not access

- Direct ASA case-law on testosterone supplement bridges specifically (the rulings I found are aggregate counts, not specific copy-level precedents — paid ASA case database access would resolve)
- Function Health / InsideTracker actual conversion-to-membership rates (paywalled in industry reports — RevenueCat-quality data would resolve)
- Reddit MCP — not invoked in this pass; UK consumer perception of supplement subscription pricing in the £35/mo range would marginally improve Option 4 LTV confidence but is not load-bearing for the recommendation

---

*Compiled: 2026-05-08. Owner: Research Agent C. UK & NI scope. UK English. Internal data citations reference specific file paths above. Read alongside Agent A and Agent B research outputs for the full kit-strategy decision pack.*
