# Products: Current State

Volatile status for the products workspace. Durable rules + routing are in `CONTEXT.md`. Update the date on each change.

_Last updated: 2026-08-02._

---

## Supplement formulation: PROPOSED changes (the two zinc items RULED 2026-08-02; the rest still UNAPPROVED)

From `supplements/formulation-evidence-review-2026-07-02.md` (RCT/meta evidence base). **Except where marked APPROVED or DECLINED below, nothing here is approved.** Live specs stand; every dose/form change needs **Ewa (safety + claims) + manufacturer sign-off**. Trials inform the product, not the claims (EFSA list still governs all copy).

### Daily Stack (capsules)

- ✅ **Zinc 30 mg → 25 mg — APPROVED (Ewa, 2026-08-02, email).** 30 mg exceeds the EU supplemental UL of 25 mg. Gluconate form fine. **Applied the same day** to `supplements/daily-stack.md` and to all three site surfaces (`lp/daily-stack` ×2, `supplements/daily-stack`); the site had been publishing 30 mg. Logged under CA-030.
- ❌ **Add copper — DECLINED (Ewa, 2026-08-02):** _"25mg zinc low enough."_ The depletion rationale was put to her alongside the reduction and she ruled the lower dose removes the need. **Consequence: the clean 4-active spec holds, so Gate 0A's capped-downside condition is undisturbed.** Note this doc said ~1 mg and `supplements/daily-stack.md` said ~2 mg; the discrepancy is now moot, but do not re-propose either figure without new evidence.
- **Vitamin D3: keep 4,000 IU.** Best-evidenced cofactor is **magnesium** (Dai 2018), NOT K2. ⚠️ See the K2 + magnesium open decisions below.
- **Active B12: keep 1,000 mcg methylcobalamin** (already optimal; do NOT upgrade to 5,000 mcg; no added benefit). Keep "active form" positioning but never claim clinical superiority over cyanocobalamin.
- **Ashwagandha KSM-66: keep exactly 600 mg** (validated dose). See the hepatotoxicity safety flag below.

### Joint & Recovery Collagen (powder): biggest fixes

- **Pick one lane (open decision):** **A** = UC-II 40 mg standalone (best-matched evidence for active men + exercise-induced joint discomfort; drop hydrolysed collagen) **or B** = hydrolysed collagen 10 g + fix MSM + HA (remove UC-II). **Do NOT ship both at current doses**: UC-II 20 mg + hydrolysed is the one configuration with a failed RCT behind it (Sci Rep 2025, null).
- If lane B: **MSM 500 mg → 3 g** (500 mg is sub-therapeutic; no RCT supports it) and **HA 5 mg → ~80–120 mg** (5 mg has no oral RCT support).
- Vitamin C 80 mg: keep (adequate cofactor).
- **Free upgrade:** add a **"take ~1 h before training"** usage instruction (Shaw 2017: collagen + vit C pre-exercise drives tendon/ligament synthesis). Evidence-based, costs nothing.

### Pipeline loops (pre-launch, not built)

- **Omega-3:** rTG form, 2 g EPA/DHA, EPA-forward ratio. Frame around triglycerides / Omega-3-Index correction + mood: **NOT** heart-disease prevention (primary-prevention CV trials null). Vegan algal SKU is a softgel (Rawcreation can't make it).
- **Thyroid (Se + I):** **selenomethionine ~100 mcg** (not selenite; 200 mcg has a diabetes signal). **Reconsider/minimise iodine**: high-dose iodine can flare autoimmune thyroiditis in exactly the target population. Ewa gate mandatory.
- **Homocysteine B-complex:** **5-MTHF (methylfolate) 400–800 mcg** + **B12 methylcobalamin 250–500 mcg** + **token B6 only**. Marker/retest framing only: hard clinical endpoints are null.

## Product-safety flags: require Ewa review

These are real product-safety issues (silent externally, but material for formulation/label sign-off):

- **Ashwagandha hepatotoxicity**: NIH LiverTox rates it a "probable" cause of liver injury (score C); 2023 case series; trials only ran 8–12 wks. Consider a liver caution + duration/cycling note.
- **Omega-3 → atrial fibrillation**: dose-dependent (Gencer 2021 meta HR 1.25; >1 g/day HR 1.49). At 2 g the risk is intermediate but non-zero: add a label caution for anyone with prior AFib/palpitations.
- **B6 neuropathy**: EFSA cut the UL to **12 mg/day (2023)**; keep total B6 well under it (the 25–50 mg in old trials is unsafe for chronic use).
- **Folic acid → prostate-cancer signal** (Figueiredo 2009, HR 2.63): a specific reason to use **5-MTHF at modest dose, never high folic acid** in a male product. (Folic acid also masks B12 deficiency; dose B12 adequately.)

## Open decisions (Keith / Ewa)

1. **Collagen lane**: UC-II standalone (A) vs hydrolysed route (B). Biggest single decision; blocks MSM/HA dosing.
2. **⚠️ K2 contradiction in the source doc**: the evidence row says K2 is speculative/marketing with a possible-harm hint and "never claim K2 is needed"; the doc's own Priority-changes list says "add K2 100 mcg." Resolve. Evidence-based default = **do not add K2**; if any D3 cofactor, magnesium is the supported one.
3. **⚠️ Magnesium vs V7.2**: magnesium is the best-evidenced D3 cofactor, but V7.2 *removed* Mg from the Daily Stack (a marketing-logic call: no kit trigger, and Mg is unreliable on finger-prick per the haemolysis constraint). Reconcile the formulation-science case against the removal decision.
4. **Iodine** in the thyroid loop: include at all? Safety liability in the autoimmune-thyroid target population.
5. **Ashwagandha**: duration/cycling policy + liver caution wording.

## Results-engine & product decisions: recent status

Recent swept decisions now reflected in `CONTEXT.md`; live/sign-off status tracked here.

- **2026-07-08: post-result cross-sell = complement, not superset (LIVE in `classifier.ts`).** A normal-T Kit 1 result cross-sells **Kit 2** unconditionally (the old `energy_symptoms` gate was removed); Kit 2 → Kit 1 stays gated (multi-deficiency, or Vit-D/B12 deficiency at age ≥40); Kit 3 carries no post-result kit cross-sell and is now a front-of-funnel default only. Classifier suite green, tsc + build clean. Decision: `results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`.
- **2026-07-09: Gate 0A criteria RESTATED** (canonical in `01_strategy/CONTEXT.md` → "Gates Reference"). The old "25+ supplement pre-orders" bar is retired; 0A is now a capped-downside spend authorisation (first-run exposure capped ~£5,950, small MOQ, clean 4-active spec). The "not ordered until Gate 0A" rule is unchanged; only the criteria that define 0A moved.
- **2026-07-17: retest cadence table drafted (PROPOSED, pending Ewa sign-off).** All-clear (Bucket C) cadence is **6–12 months** (already agreed and live on the marketing site; the dashboard button's "3 months" and card copy's "3–6 months" are drift to correct down to it). Bucket B ("acting on a finding") retest is ~3 months; Bucket A (GP-routed) carries no Andro Prime interval. Two narrow items still need Ewa's tick before the feature is customer-facing: the red-flag GP-first line, and the symptom → panel wordings. Nothing ships against any row until Ewa signs. Table: `results-engine/2026-07-17-retest-cadence-table.md`.
