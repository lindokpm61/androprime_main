# Biomarker Thresholds — Result-Engine Bands (Kit 1 / 2 / 3)

**Status: ✅ APPROVED — Dr Ewa Lindo, 2026-06-16 (email, all 10 points). Engine reconciled into `classifier.ts` the same day.**
Single source of truth for the biomarker bands the results engine uses to classify a customer's result and choose the recommendation. This supersedes the scattered (and previously conflicting) band statements in the individual kit docs.

> **Final locked decisions (Ewa, 2026-06-16):** (1) Testosterone — keep single 12–20 normal; **split the low band into <8 clear-deficiency / 8–12 equivocal AND flag <5.2 for endocrinology** ("do both"). (2) Vitamin D — keep code scheme. (3) **Vitamin D <25 → GP referral.** (4) **Active B12 → NG239 three-band (<25 / 25–70 / >70).** (5) Ferritin — relabel 30–100 "borderline/indeterminate"; **add a high band → GP, action threshold set to >300 µg/L** (Ewa: "300–400 is fine", conservative end chosen). (6) hs-CRP — no change. (7) SHBG / Free T — **match the lab assay, no fixed numbers**; Albumin standard <35 flag. (8) FAI — report-only. (9) **GP-referral set = low-T (all bands) + CRP>10 + ferritin<30 + albumin<35 + vit-D<25 + high-ferritin.**
>
> **Net code changes shipped 2026-06-16:** testosterone three-way low split (`severely-low` <5.2 / `low` 5.2–8 / `equivocal` 8–12, all GP-routed, severely-low copy flags endocrinology); SHBG + bar zones now assay-driven (lab `referenceLow`/`referenceHigh`, 17–55 fallback); ferritin `high-ferritin` band >300 → GP; B12 `<25` low / `25–70` `borderline-b12` / `>70` normal; `critically-low-vitamin-d` moved into the GP-block set (and out of the supplement multi-deficiency count); `low_b12` CIO trait realigned to `<25`. New customer-facing card strings for the net-new states are drafted in `biomarker-copy.ts` and **still need Ewa's wording confirmation** (logic approved, exact copy pending).

> **AUDIT TRAIL, verified against ClickUp 2026-08-27.** The approval record of record is ClickUp
> task **`869d99kxw`** ("01. Ewa threshold sign-off, biomarker bands Kit 1, 2, 3", Sprint /
> Pre-launch, status `complete`, closed 2026-06-16). Its two comments are the contemporaneous
> record:
>
> - **2026-06-16**: "Dr Ewa Lindo approved the biomarker bands for Kit 1/2/3 by email (all 10
>   points). Engine reconciled to the approved thresholds the same day." Names the Active B12 NG239
>   three-band and the ferritin `>300` GP band explicitly. Commits `4f05ad6`, `b706798`.
> - **2026-08-07**: re-ratification after Vitall supplied per-assay male reference ranges on
>   2026-08-06, which the June sign-off was made without. Ewa's verbatim answers: B12 **"Keep NICE
>   NG239"** (assay cut 37.5), ferritin **"Keep 300"** (lab ceiling 442), testosterone **"over
>   29+"**, FAI **"fine for now"**, vitamin D upper band yes, albumin no. Commits `56f3a5e`,
>   `1ce4850`, `56b8ff9`.
>
> ⚠️ **Two gaps this audit surfaced, both open.** (1) The ClickUp task's own Definition of Done
> required the sign-off be documented in `03_compliance/ewa-signoffs/`; **that directory has never
> existed**, and there is **no approval record in `03_compliance/content-approval/` for the
> biomarker bands** despite that being the convention every other approval follows. The substantive
> record exists (this file, the email, the ClickUp comments) but not where a compliance reader is
> told to look. (2) See the card-copy warning below: two live GP-referral states render copy Ewa
> has not approved.

**What Ewa is signing off:** the *system logic* (the bands, the cut-points, the routing), not any per-customer interpretation. Per the no-bespoke-clinician-interpretation rule, Andro Prime does not produce per-customer GP reports; Ewa approves the thresholds + recommendation triggers that the engine applies uniformly.

**Verbatim source of the live values:** `09_website-app/frontend/lib/results/classifier.ts` (`resolveState`, lines ~113-146). Per-band customer-facing copy lives in `lib/results/biomarker-copy.ts` (low-T card copy already approved as CA-013). The numbers below are transcribed from the code exactly as it runs in production today; they have never had a documented clinical sign-off, which is why this task is open.

**Assay confirmations on file (Vitall; note added 2026-08-04).** The marker and assay identities these bands assume are confirmed in writing by Ben Starling (Vitall Commercial Director) and recorded in `05_partners/labs/vitall/correspondence/`. Cited here because this file bands on them and previously carried no provenance, which caused two separate re-openings of settled questions.

| Assumption | Confirmed | Source |
|---|---|---|
| **hs-CRP, not standard CRP** | 2026-04-30, "your profile includes hsCRP", answering an explicit hs-CRP-vs-standard-CRP question | `2026-04-30-ben-service-agreement-thread.md` §Email 3 |
| **Active B12 (holotranscobalamin), not total B12** | 2026-04-30, "your profile includes Active B12"; unit `pmol/L` confirmed 2026-07-20 | same, + Gmail thread `19f70d67aa19b5f5` |
| **Albumin measured, not assumed constant** | 2026-04-30; and **returned as a standalone reported line in `g/L`** 2026-07-21 | same |
| Ferritin `µg/L` · Vitamin D `nmol/L` · CRP `mg/L` | 2026-07-20 and 2026-07-21 | Gmail thread `19f70d67aa19b5f5` |
| **All nine markers returned, all units, and the per-assay male reference ranges** | **2026-08-06** | Gmail thread `19f70d67aa19b5f5`; reconciled in [`05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md`](../../05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md) |

### Vitall's per-assay male reference ranges (confirmed 2026-08-06)

The ranges that were owed below. **These are the lab's reference intervals, not clinical bands.** Ben's
instruction is explicit: *"don't hardcode these, always use the reference ranges which are returned with
each result"* — they vary by age and the lab can change them, and three labs may run our samples (Inuvi
default, Alderley Lighthouse and TDL as backups). They are recorded here as the provenance for the bands,
and as the fallback of last resort, never as a substitute for the returned value.

| Marker | Vitall male range | Our band | Agreement |
|---|---|---|---|
| Total Testosterone | 8.64 - 29.00 nmol/L | low `<12`, normal 12-20, optimal 20-29, **high `>29` → GP** | **Deliberately different at the low end** (the whole test-led thesis); upper band added 2026-08-07 |
| SHBG | 20.6 - 76.7 nmol/L | the returned range, fallback now 20.6-76.7 | ✅ ruling 7 satisfied; generic 17-55 fallback retired 2026-08-06 |
| Albumin | 35 - 50 g/L | `<35` → GP | ✅ exact match at the flag |
| Free Testosterone | 0.1980 - 0.6190 nmol/L | `< referenceLow` | ✅ dynamic, ruling 6 satisfied |
| Free Androgen Index | 35.0 - 92.6 **%** | report-only, not banded | ✅ ruling 8; unit `%` confirmed (was recorded as "ratio") |
| Vitamin D (25-OH) | 50 - 250 nmol/L | `<25` GP, `<50` low, 50-250 normal, **`>250` → GP** | ✅ exact match at both ends; upper band added 2026-08-07 |
| Active B12 | **>37.5** pmol/L | `<25` low, 25-70 borderline, `>70` normal | Deliberately tighter than the assay cut. Ewa re-ratified NG239 with 37.5 in front of her, 2026-08-07 |
| CRP | <1.00 mg/L | `≤1` normal, `>1`/`>3`/`>10` | ✅ exact match at 1 |
| Ferritin | 30 - 442 µg/L | `<30` GP, ≤100, ≤300, `>300` GP | ✅ at the low end. Ewa re-ratified 300 with the 442 ceiling in front of her, 2026-08-07 |

### ✅ Ewa's ruling on all five, 2026-08-07 (email, verbatim answers)

Put to her with the assay figures beside each band, which is what she did not have on 2026-06-16.

| # | Question | Her answer | Consequence |
|---|---|---|---|
| 1 | Active B12: our NG239 25/70 against the assay's own 37.5 cut | **"Keep NICE NG239"** | No change. Bands stand, now ratified with 37.5 visible |
| 2 | Ferritin high band: our `>300` against the lab's 442 ceiling | **"Keep 300"** | No change. Stands, with 442 visible |
| 3 | High testosterone: no band existed at all | **"over 29+"** | **New band `> 29` → GP referral** |
| 4 | The redrafted FAI report-only wording | **"wording is fine for now"** | Approved. "For now" is hers; treat as provisional, not closed |
| 5 | Upper bands for Vitamin D and Albumin | **Vitamin D yes, Albumin no** | **New band `> 250` → GP referral.** Albumin left open |

On Vitamin D she gave both the reasoning and the shape she wanted: *"supplementation makes a result above 250
a realistic scenario for us, and I'd rather the system flags it appropriately than leaves it undefined"*, and
*"can we treat >250 nmol/L as a high/clinical review flag rather than just a technical out-of-range result?"*
Hence GP-block rather than a red bar. Albumin: *"happy to leave that for now unless there's a clinical reason
to add an upper band."*

> **The two new bands were not a classifier-only change.** `isTestosteroneAllClear()` and the Vitamin D leg of
> `results_all_clear` both had no upper bound either, and both feed **Customer.io**. Without fixing them a man
> at 35 nmol/L would have been GP-referred on his dashboard while simultaneously being routed into the
> **seq-03c reassurance sequence for normal results**. Both closed in the same change, with regression
> assertions pinning the cut-points and the CIO signal.
>
> **Card copy for the two new states is DRAFTED, NOT APPROVED.** Her reply gave the numbers and the routing;
> the email had put the wording to her as her call and she did not send any. Both blocks are marked pending in
> `biomarker-copy.ts`.

**Units / how to read:** `<` and `≤` are reproduced exactly as coded (boundary values matter). "Result state" is the internal code label. "Routes to" is the recommendation the engine fires.

**"Research-backed recommendation" column:** added 2026-06-08 from two verified deep-research passes against UK primary sources (BSSM 2023, Society for Endocrinology / ACB 2023, SACN 2016, NICE CKS, NICE NG239, British Society for Haematology, AHA/CDC 2003). Each recommendation gives the consensus position so Ewa confirms a specific value rather than picking blind. Full citations in the Sources section at the foot. **These are recommendations for Ewa to ratify, not a substitute for her clinical sign-off.**

---

## Kit 1 — Testosterone Health Check (5 markers)
Panel: Total Testosterone, SHBG, Albumin (measured) + Free Androgen Index, Free Testosterone (calculated).

### Total Testosterone (nmol/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| Low | `< 12` | `low-testosterone` | **GP referral** (per 2026-06-04 low-T decision) + consent-gated nurture | **Keep `<12` as the low cut.** UK consensus diagnostic cut-point is <12 nmol/L (BSSM 2023, Grade A). [S1] |
| Normal | `12 – 20` (`≤ 20`) | `normal-testosterone` | Normal → Kit 2 cross-sell (complement rule 2026-07-08) | **Keep single 12–20 normal band.** No UK source supports a 12–15 split. [S1][S2] |
| Optimal | `> 20 – 29` (`≤ 29`) | `optimal-testosterone` | No supplement CTA; retest 6-12 mo | **Confirm.** No clinical "optimal" threshold exists; >20 as a positive-framing band is fine but is a product choice, not a guideline. [S1] |
| **High** | `> 29` | `high-testosterone` | **GP referral** (Ewa 2026-08-07, "over 29+") | **New.** No upper bound existed; a result above the assay's own 29.00 ceiling read as "optimal" with a retest CTA. Not in LOW_T_STATES, so no low-T nurture opt-in and no `low_testosterone` CIO flag. |

> ✅ **Discrepancy resolved by research:** `kit-1-…md §3` specifies a **12-15 "borderline"** band. **Drop it.** No UK guideline (BSSM, SfE/ACB) recognises 12–15 as equivocal — the real grey zone is **8–12 nmol/L** (below your low cut, so it already routes to GP). The kit doc's supplement-push/FM framing is separately superseded by the 2026-06-04 low-T → GP decision. [S1][S2]
>
> **Optional refinement for Ewa:** split the existing `<12` into `<8` (definite deficiency) and `8–12` (equivocal — free-T-supported). Both still GP-route under the current model, so this is presentational only. **Additional referral trigger to consider:** TT `<5.2` nmol/L with low LH/FSH or raised prolactin → endocrinology / pituitary MRI (BSSM 2023). [S1]

### SHBG (nmol/L)
| Band | Range | Result state | Research-backed recommendation |
|---|---|---|---|
| Low | `< referenceLow` | `shbg-low` | ✅ **Resolved 2026-08-06.** Bands come from the range the lab returns with each result, per ruling 7. SHBG has no UK consensus range; it is assay-specific. [S3] |
| Normal | within the returned range | `shbg-normal` | As above. |
| High | `> referenceHigh` | `shbg-high` | As above. |

> ✅ **The generic 17–55 fallback is retired (2026-08-06).** It only ever applied when a payload arrived
> without a parseable range, but it was materially wrong for this assay: it would have called an SHBG of 60
> "high" when Vitall reports normal to **76.7**. The fallback is now Vitall's own male interval,
> **20.6–76.7** (`SHBG_FALLBACK_LOW` / `SHBG_FALLBACK_HIGH` in `classifier.ts`), so a missing range degrades
> to the right assay rather than to a generic one. Live results are unaffected: they carry their own range
> and always did.

### Free Testosterone (calculated, nmol/L)
| Band | Rule | Result state | Research-backed recommendation |
|---|---|---|---|
| Low | `value < referenceLow` | `ft-low` | **Dynamic lab-reference-low is acceptable.** If Ewa prefers a fixed anchor, use **<225 pmol/L (0.225 nmol/L)** — the SfE/BSSM supportive-treatment cut-point. Calculated via the Vermeulen equation (standard). [S1][S2] |
| Normal | at/above reference-low | `ft-normal` | |

### Albumin (g/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| Low | `< 35` | `low-albumin` | **GP-block state** (GP referral) | **Keep `<35` → GP.** Standard UK hypoalbuminaemia flag; UK lab ranges are 35–50 / 35–52 g/L (assay-dependent; some lower limits 31–34). Confirm against Vitall's assay. Low albumin can reflect liver disease, malnutrition, inflammation or nephrotic syndrome, so GP routing is appropriate. [S4] |
| Normal | `≥ 35` | `normal-albumin` | — | |

> **Free Androgen Index (FAI):** in the Kit 1 panel, and the engine does **not** classify it into a band. **Ruling: keep FAI report-only, do not band it in men.**
>
> ⚠️ **Implementation defect found and fixed 2026-08-06 — the copy needs Ewa's confirmation.** "Report-only"
> was implemented by simply having no `case` for FAI, so it fell through to the engine's `default` state.
> That default is not neutral. It badged the card **"Optimal"**, headed the footer **"Keep it up"**, and told
> the customer **"This marker is within the normal range"** and **"No action is needed for this marker"** —
> for *any* value, including one below the lab's floor of 35.0, which the bar simultaneously rendered red.
> Those strings also print on the **CSV export and the GP handoff sheet**, so a false "within the normal
> range" was going onto a document a clinician reads. FAI now has its own `fai-reported` state: no badge
> verdict ("Reported"), no traffic-light bar at all, no CTA, and copy that gives the number and its context
> without grading it. The ruling is unchanged; only its implementation was wrong. **The new wording is
> **approved by Ewa 2026-08-07 ("wording is fine for now"), and her "for now" is doing work, so treat it as provisional rather than closed.** In men, FAI correlates poorly with calculated free testosterone (r²=0.21–0.46) and overestimates it at low SHBG; the paper that showed this recommends calculated free testosterone, not FAI, when a total testosterone result is ambiguous. UK lab practice follows: North Bristol reports calculated free testosterone for males and FAI for females. Calculated free testosterone (above) is the preferred derived metric. [S3][S5]
>
> **Citation corrected 2026-07-30.** This paragraph previously read: *"SfE states FAI is 'of limited value in men'"*, citing [S1][S5]. The SfE/ACB 2023 position statement [S2] **does not mention FAI at all** (verified by fetching it, 2026-07-30). The ruling itself is unaffected and stands: it is carried by [S5] Ho 2006 and [S3] North Bristol, which is what the paragraph now cites. Ewa approved the correction ("Yes correct it to the right sources", relayed by Keith 2026-07-30). Found while reframing the `free-androgen-index` article, which had made FAI the answer and cut across this ruling.

---

## Kit 2 — Energy & Recovery Check (4 markers)
Panel: Vitamin D (25-OH), Active B12, hs-CRP, Ferritin.

### Vitamin D, 25-OH (nmol/L)
| Band | Range | Result state | Research-backed recommendation |
|---|---|---|---|
| Critically low | `< 25` | `critically-low-vitamin-d` | **Keep `<25`.** This is the SACN population-protective floor and the NICE severe-deficiency line. **Recommend this also GP-routes** (see GP-block note). [S6][S7] |
| Low | `25 – < 50` | `low-vitamin-d` | **Keep.** Matches NICE CKS / Royal Osteoporosis Society "deficient / may be inadequate" zone (ROS uses <30 as the treat line within this band). [S7] |
| Normal | `50 – 250` (`≤ 250`) | `normal-vitamin-d` | **Keep `≥50` as sufficient.** Matches NICE/SACN. [S6][S7] |
| **High** | `> 250` | `high-vitamin-d` | **New 2026-08-07 (Ewa): GP referral, as a clinical-review flag rather than a bare out-of-range.** Her reasoning: we sell a 4,000 IU D3 stack, so a supplementing man who retests is the realistic route to this reading. Being GP-blocked also suppresses every supplement CTA on the card. |

> ✅ **Discrepancy resolved by research:** `kit-2-…md` states **<50 low, 50-75 borderline, >75 optimal**. **The code scheme wins — do not adopt the kit-note scheme.** The **>75 "optimal"** band is stricter than *every* UK national standard (SACN, NICE, ROS) and is a private-lab construct. For a clinician sign-off, presenting >75 as "the NHS range" would be inaccurate. One genuine UK inter-source gap to be aware of: severe-deficiency line is **<25 (SACN/NICE)** vs **<30 (ROS treatment line)** — the code's `<25` is the more conservative, defensible choice. [S6][S7]

### Active B12, Holotranscobalamin (pmol/L)

> ✅ **RATIFIED AND SHIPPED. This section previously carried a "CODE CHANGE RECOMMENDED / Ewa to
> confirm" banner for a change that was ratified on 2026-06-16 and shipped the same day in
> `4f05ad6`, and re-ratified on 2026-08-07. Corrected 2026-08-27; the sweep never reached this
> layer.** The bands below are what `lib/results/classifier.ts` actually runs.

| Band | Range | Result state | Status |
|---|---|---|---|
| Low | `< 25` | `low-b12` | ✅ Shipped. NG239 low / deficient |
| Borderline | `25 – 70` (`≤ 70`) | `borderline-b12` | ✅ Shipped. NG239 indeterminate zone (reflexes to MMA in clinical practice) |
| Normal | `> 70` | `normal-b12` | ✅ Shipped. NG239 "deficiency unlikely" |

> **`37.5` is NOT a competing band, and this is the thing that causes the confusion.** `>37.5` is
> **Vitall's assay reference range**, which we display as the lab's own verdict. `<25 / 25–70 / >70`
> are **our action bands**, deliberately tighter. Both are correct and both are shown: a value of
> 45 pmol/L is *normal to the lab* and *borderline on our bands*, and that disagreement is the
> product. Ewa was shown 37.5 explicitly on 2026-08-07 and answered **"Keep NICE NG239"**.
> In code: `referenceRange.low = 37.5` on the marker, bands in `classifier.ts:325-327`.

> **Provenance.** NICE NG239 (2024) operative bands for active B12 (holoTC): `<25` low/deficient ·
> `25–70` indeterminate · `>70` deficiency unlikely. Study cut-points span 19–77 pmol/L and NG239
> leaves the exact figure to the assay manufacturer. [S8][S9]

### hs-CRP (mg/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| High | `> 10` | `high-crp` | **GP-block state** (GP referral) | **Keep `>10` cut.** Per AHA/CDC, >10 mg/L = acute inflammation/infection, not chronic CV risk — should not be used for CV scoring; clinically the action is "retest ≥2 weeks apart, use lower value, seek acute cause." GP routing is the safe DTC call. [S10][S11] |
| Moderate | `> 3 – ≤ 10` | `moderate-crp` | **Keep.** AHA/CDC: >3 = high CV risk. [S10][S11] |
| Elevated | `> 1 – ≤ 3` | `elevated-crp` | **Keep.** AHA/CDC: 1–3 = average CV risk. [S10][S11] |
| Normal | `≤ 1` | `normal-crp` | — | **Keep.** AHA/CDC: <1 = low CV risk. [S10][S11] |

> ✅ **Confirmed:** cut-points `>1 / >3 / >10` match the AHA/CDC 2003 consensus banding exactly. **Band labels** (code: elevated/moderate/high) are a product choice — confirm wording. CRP `>10` → GP is appropriate. [S10][S11]

### Ferritin (µg/L)

> ✅ **BOTH "ITEMS FOR EWA" ARE RATIFIED AND SHIPPED. This section previously said the engine had
> "no high-ferritin flag at all" and listed two open items; both were ratified 2026-06-16 and
> shipped the same day in `4f05ad6`. Corrected 2026-08-27, same sweep miss as Active B12 above.**

| Band | Range | Result state | Routes to | Status |
|---|---|---|---|---|
| Low | `< 30` | `low-ferritin` | **GP referral** | ✅ Shipped. NICE CKS sensitive iron-deficiency cut [S12][S13] |
| Borderline | `30 – 100` (`≤ 100`) | `suboptimal-ferritin` | — | ✅ Shipped, and **relabelled in the customer copy**: `biomarker-copy.ts` reads "Your iron stores are in the borderline range" and "indeterminate rather than reassuring". **The internal state id is still `suboptimal-ferritin`**, which is a naming leftover, not a live band question |
| Normal | `> 100 – 300` (`≤ 300`) | `normal-ferritin` | — | ✅ Shipped |
| High | `> 300` | `high-ferritin` | **GP referral** | ✅ Shipped. Ewa set the action threshold at 300 ("300-400 is fine", conservative end chosen). Warrants TSAT and possible haemochromatosis / liver work-up [S13][S14] |

> **The one thing still genuinely open** is cosmetic: rename the `suboptimal-ferritin` state id to
> match the copy it renders. No clinical or customer-facing consequence, so it is a tidy-up, not a
> gate.

---

## Kit 3 — Hormone & Recovery Check (9 markers)
Kit 3 = **Kit 1 panel + Kit 2 panel** (same markers, same bands as above). No Kit-3-specific thresholds; it applies all of the above. The combined-result precedence (which marker leads when several are out of range) is a **separate open item** — see `kit3-combined-result-rule.md` (also Ewa-pending).

---

## GP-referral ("GP-block") states — for clinical review
The engine treats these result states as requiring a **GP referral** rather than a product/supplement recommendation (code: `GP_BLOCK_STATES` + the 2026-06-04 low-T routing):
- `high-crp` (CRP > 10) — **confirmed appropriate.** [S10][S11]
- `low-ferritin` (< 30) — **confirmed appropriate.** [S12]
- `low-albumin` (< 35) — **confirmed appropriate.** [S4]
- `low-testosterone` (< 12) — added by the 2026-06-04 low-T → GP decision; **confirmed appropriate.** [S1]

**Research-backed additions to consider:**
- **`critically-low-vitamin-d` (< 25) → GP.** Currently NOT GP-blocked. NICE/ROS recommend clinician-directed treatment below the deficiency line, not OTC supplements. **Recommend adding to the GP-block set.** [S6][S7]
- **High ferritin → GP** (see Ferritin note) — currently no route exists for markedly raised ferritin. [S13][S14]

---

## Summary of decisions — ✅ all ratified by Ewa 2026-06-16
Each carried a research-backed recommendation; Ewa confirmed all of them (and chose "do both" on point 1's optional split + the <5.2 endocrinology flag). Listed here as the record of what was asked and agreed.
1. **Testosterone:** keep single 12–20 normal (recommended — drop the kit-note 12–15 borderline). Optionally split `<8` / `8–12` below the low cut. Add the `<5.2` + low-gonadotrophin pituitary-referral trigger?
2. **Vitamin D:** keep code `<25 / <50 / ≥50` (recommended) over kit-note `<50 / 50–75 / >75`.
3. **Active B12:** **change** single `<37.5` to NG239 three-band `<25 / 25–70 / >70` (recommended). Assay-match to Vitall.
4. **Ferritin:** keep `<30` → GP; relabel 30–100 to "borderline/indeterminate"; **add a high-ferritin band + GP route** and set the male upper action threshold.
5. **hs-CRP:** confirm band labels; `>10` → GP confirmed.
6. **SHBG / Albumin / Free T:** assay-match SHBG to Vitall (not generic 17–55); keep albumin `<35` → GP; Free T dynamic ref-low OK (or fix `<225` pmol/L).
7. **FAI:** keep report-only (recommended — do not band in men).
8. **GP-block set:** add `critically-low-vitamin-d` (<25) and a high-ferritin state; otherwise complete.

---

## Sources (verified deep-research, 2026-06-08)
- **[S1] BSSM 2023** — British Society for Sexual Medicine guidelines on male testosterone deficiency. `<12` diagnostic cut; 8–12 grey zone (check free T); `<5.2` + low LH/FSH or raised prolactin → endocrinology/pituitary MRI. https://pmc.ncbi.nlm.nih.gov/articles/PMC10307648/
- **[S2] Society for Endocrinology / ACB joint position statement 2023** — `<8` likely hypogonadism, 8–12 equivocal, >12 unlikely; "action cutoffs, not reference ranges." Also: *"When SHBG is in the reference range, calculated free testosterone has no diagnostic value beyond total testosterone."* **Does NOT mention the free androgen index anywhere** (verified 2026-07-30); do not cite it for any FAI claim. Use [S5] Ho 2006 and [S3] North Bristol for those. https://journals.sagepub.com/doi/10.1177/00045632231179022
- **[S3] North Bristol NHS Trust (Severn Pathology) — SHBG** — male 13–90 nmol/L; calculated free T reported for males, FAI for females. https://www.nbt.nhs.uk/severn-pathology/requesting/test-information/shbg
- **[S4] UK NHS pathology handbooks — Albumin** — Severn 35–50 g/L, UH Sussex 35–52, Royal Liverpool 35–50; assay-dependent lower limits. https://pathology.uhsussex.nhs.uk/pug/biochemistry-immunology/biochemistry-tests/107-albumin-serum
- **[S5] Ho et al., Ann Clin Biochem 2006** — FAI correlates poorly with calculated free T (r²=0.21–0.46), overestimates at low SHBG. https://pubmed.ncbi.nlm.nih.gov/17036414/
- **[S6] SACN, Vitamin D and Health 2016** — single 25 nmol/L population-protective floor; not a disease-diagnostic line. https://assets.publishing.service.gov.uk/media/5a804e36ed915d74e622dafa/SACN_Vitamin_D_and_Health_report.pdf
- **[S7] National (Royal) Osteoporosis Society vitamin D guideline (Aspray et al., Age & Ageing 2014)** — `<30` deficient/treat, 30–50 may be inadequate, >50 sufficient. https://pubmed.ncbi.nlm.nih.gov/25074538/
- **[S8] NICE NG239 (2024), Vitamin B12 deficiency in over-16s** — holoTC `<25` / 25–70 indeterminate / >70; reference ranges not standardised across manufacturers. https://www.nice.org.uk/guidance/ng239
- **[S9] NICE MIB40 — Active B12 assay** — specialist cut-off commentary (19–34 pmol/L per Heil 2012); labs define own ranges. https://www.nice.org.uk/advice/mib40
- **[S10] AHA/CDC 2003 (Pearson et al., Circulation), Markers of Inflammation** — hs-CRP `<1` low / 1–3 average / >3 high CV risk. https://www.ahajournals.org/doi/10.1161/01.cir.0000125690.80303.a8
- **[S11] hs-CRP application review (PMC2639398)** — `>10` mg/L not for CV scoring (acute inflammation); retest ≥2 weeks, use lower value. https://pmc.ncbi.nlm.nih.gov/articles/PMC2639398/
- **[S12] NICE CKS — Anaemia (iron deficiency)** — ferritin `<30` µg/L = iron deficiency (sensitive cut).
- **[S13] British Society for Haematology — laboratory diagnosis of iron deficiency / raised ferritin** — TSAT is the key follow-up; raised ferritin has multiple causes. https://b-s-h.org.uk/guidelines/guidelines/investigation-and-management-of-a-raised-serum-ferritin
- **[S14] RUH Bath — Ferritin: a guide for GPs** — `<24` men = iron-deficiency anaemia; 24–100 exclusion zone; high-ferritin work-up (FBC/LFT/TSAT/CRP). https://www.ruh.nhs.uk/pathology/documents/clinical_guidelines/HAEM_Ferritin_a_guide_for_GPs.pdf

> **Source caveats:** SHBG, Free T and albumin reference ranges are assay/analyser-specific — match to Vitall's actual assay before locking into the engine. NICE NG239 does not *mandate* a single holoTC number (it cites 25/70 as working figures and leaves ranges to manufacturers). The male high-ferritin action threshold is trust-specific (no single UK number; >340 µg/L is one example, not universal).

---

## Sign-off
| Role | Name | Decision | Date |
|---|---|---|---|
| Clinical / thresholds | Dr Ewa Lindo | ✅ APPROVED — values + routing (email, all 10 points; "do both + flag endocrinology if under 5.2"; "300-400 is fine"; "match the lab, no fixed numbers"). New card **wording** approved in follow-up email 2026-06-16 02:33 UTC ("Wording approved"). | 2026-06-16 |
| Business | Keith Antony | ☐ PENDING (directed implementation + commit 2026-06-16; formal row confirm owed) | — |

> **Post-approval status (2026-06-16):**
> 1. ✅ **Engine reconciled** into `classifier.ts` (`resolveState`, `resolveBarZones`, `GP_BLOCK_STATES`, `DEFICIENCY_STATES`, `resolveCtas`) + `types.ts` (4 new states) + `biomarker-copy.ts` (4 new copy blocks; relabels). Net-new code: B12 three-band, high-ferritin band, testosterone three-way low split, assay-driven SHBG. `processResult.ts` `low_b12` CIO trait realigned to `<25`. Typecheck + `next build` clean; band boundaries verified. Committed `4f05ad6` on `main`.
> 2. ✅ **Card copy wording APPROVED** by Ewa 2026-06-16 02:33 UTC ("Wording approved") — covers severely-low-T, equivocal-T, borderline-B12, high-ferritin, revised critically-low-vit-D, and the suboptimal→borderline ferritin relabel. Ferritin high-flag set at **>300 µg/L** (conservative end of her "300-400 is fine"; not separately overridden).
> 3. ☐ **Update the conflicting kit docs** (`kit-1-…`, `kit-2-…`) to point here — still outstanding.
> 4. ☐ **Keith business-row confirm** + **close ClickUp task 01**.
>
> **Amendment (2026-07-30): FAI citation corrected, ruling unchanged.**
> The FAI note under Kit 1 attributed *"FAI is of limited value in men"* to the Society for Endocrinology. It does not say that; [S2] does not mention FAI at all. The **decision Ewa signed on 2026-06-16 is unaffected and still stands** (FAI report-only, not banded in men, calculated free testosterone preferred): it rests on [S5] Ho 2006 and [S3] North Bristol, both re-verified against source on 2026-07-30, and the paragraph now cites those. Ewa approved the correction: *"Yes correct it to the right sources"* (relayed by Keith, 2026-07-30; her prior email of 2026-07-29 23:44 UTC had already cleared the related Kit 1 spec reword, "C: no objection"). **This is a sourcing fix to an approved document, not a re-opening of the threshold sign-off.**
> Surfaced by the `free-androgen-index` article reframe, which had made FAI the answer and cut across this ruling; that article is staged as a proposed revision and is with Ewa (ClickUp `869ebf36k`).
