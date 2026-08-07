# Products: Current State

Volatile status for the products workspace. Durable rules + routing are in `CONTEXT.md`. Update the date on each change.

_Last updated: 2026-08-07 (Ewa ruled on all five open band questions; two new GP-routed upper bands built)._

---

## Ewa ruled on all five open band questions, and two new upper bands are built (2026-08-07)

**Decided by Dr Ewa Lindo, 2026-08-07, by email**, put to her with Vitall's per-assay reference ranges
beside each band, which is what she did not have on 2026-06-16. Her answers verbatim:

| Question | Ewa | Outcome |
|---|---|---|
| Active B12: our NG239 25/70 vs the assay's own 37.5 cut | "Keep NICE NG239" | No change; re-ratified with 37.5 visible |
| Ferritin high band: our `>300` vs the lab's 442 ceiling | "Keep 300" | No change; re-ratified with 442 visible |
| High testosterone (no band existed) | "over 29+" | **New band `> 29` → GP referral** |
| The redrafted FAI report-only wording | "wording is fine for now" | Approved. Her "for now" is preserved; treat as provisional |
| Upper bands for Vitamin D / Albumin | Vitamin D yes, Albumin no | **New band `> 250` → GP referral**; albumin left open |

On Vitamin D she specified the shape, not just the number: *"can we treat >250 nmol/L as a high/clinical
review flag rather than just a technical out-of-range result?"* So it is a GP-block state, which also
suppresses every supplement CTA on that card. That matters here more than anywhere, because the card it
suppresses is the one offering our own 4,000 IU D3.

**Card copy for both new states is DRAFTED, NOT APPROVED.** She gave numbers and routing; the wording was
put to her as her call and she sent none. A reply asking for a line on each is drafted in Gmail, unsent.
Both blocks are marked pending in `biomarker-copy.ts` and in `thresholds.md`.

Full record, including the four range-comparison rows that previously read "conflicts" or "no high band
exists": `results-engine/thresholds.md`.

## The results-engine badge vocabulary is written down for the first time (2026-08-07)

`results-engine/dashboard-copy.md` was an empty placeholder ("Placeholder item 1"). It now holds the six
status-badge labels, what each applies to, and the outline-versus-filled rule. **"Optimal" is retired as
the label for merely in-range (Keith, 2026-08-07)** because it contradicted our own `myth-of-normal-range`
article on the page where it matters most; it survives on testosterone alone, where the `>20` band is a
signed positive-framing product choice. In-range markers now read "In range". The rest of the dashboard
copy is still owed and listed in that file.

## `thresholds.md` now carries its assay provenance; the hs-CRP question was re-opened twice for want of it (2026-08-04)

`results-engine/thresholds.md` bands on assay identities (hs-CRP not standard CRP, Active B12 as holotranscobalamin, albumin measured not assumed) that were **confirmed in writing by Vitall on 2026-04-30** and recorded in `05_partners/labs/vitall/correspondence/2026-04-30-ben-service-agreement-thread.md`. The thresholds file cited none of it: zero references to Ben, Vitall, or any correspondence. It said only "confirm against Vitall's assay", with no indication whether that had already happened.

**Consequence:** the CRP assay was surfaced as an open, material risk twice, and on the second occasion was one step from an email asking Vitall to re-confirm something they had answered three months earlier in reply to a question that named the exact distinction ("hs-CRP, not standard CRP"). Keith caught it both times from memory.

- **Added:** an assay-provenance table at the head of `thresholds.md`, citing the 2026-04-30 confirmation and the 2026-07-20/21 unit confirmations, with the Gmail thread ID.
- **Deliberately NOT closed:** the reference-range items. Ben has confirmed marker identity and units; he has **never** supplied per-assay reference ranges. SHBG (code still carries a generic 17–55 fallback against Ewa's 2026-06-16 ruling 7 "match the lab assay"), Active B12's NG239 range, and Vitall's albumin range behind `<35` all remain genuinely owed. The new note says so explicitly so the table is not misread as closing them.
- **Noted, not fixed:** `thresholds.md` still carries the pre-approval sentence "they have never had a documented clinical sign-off, which is why this task is open" directly under a header reading "Status: ✅ APPROVED — Dr Ewa Lindo, 2026-06-16". Same class of stale artifact; left for whoever next touches the file with Ewa.

Sweep context and the parallel shelf-life finding: `01_strategy/STATE.md` (2026-08-04 entry).

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
