# Biomarker Thresholds — Result-Engine Bands (Kit 1 / 2 / 3)

**Status: DRAFT FOR EWA SIGN-OFF (ClickUp task 01). NOT yet approved.**
Single source of truth for the biomarker bands the results engine uses to classify a customer's result and choose the recommendation. Once Ewa signs this off it supersedes the scattered (and currently conflicting) band statements in the individual kit docs.

**What Ewa is signing off:** the *system logic* (the bands, the cut-points, the routing), not any per-customer interpretation. Per the no-bespoke-clinician-interpretation rule, Andro Prime does not produce per-customer GP reports; Ewa approves the thresholds + recommendation triggers that the engine applies uniformly.

**Verbatim source of the live values:** `09_website-app/frontend/lib/results/classifier.ts` (`resolveState`, lines ~113-146). Per-band customer-facing copy lives in `lib/results/biomarker-copy.ts` (low-T card copy already approved as CA-013). The numbers below are transcribed from the code exactly as it runs in production today; they have never had a documented clinical sign-off, which is why this task is open.

**Units / how to read:** `<` and `≤` are reproduced exactly as coded (boundary values matter). "Result state" is the internal code label. "Routes to" is the recommendation the engine fires.

**"Research-backed recommendation" column:** added 2026-06-08 from two verified deep-research passes against UK primary sources (BSSM 2023, Society for Endocrinology / ACB 2023, SACN 2016, NICE CKS, NICE NG239, British Society for Haematology, AHA/CDC 2003). Each recommendation gives the consensus position so Ewa confirms a specific value rather than picking blind. Full citations in the Sources section at the foot. **These are recommendations for Ewa to ratify, not a substitute for her clinical sign-off.**

---

## Kit 1 — Testosterone Health Check (5 markers)
Panel: Total Testosterone, SHBG, Albumin (measured) + Free Androgen Index, Free Testosterone (calculated).

### Total Testosterone (nmol/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| Low | `< 12` | `low-testosterone` | **GP referral** (per 2026-06-04 low-T decision) + consent-gated nurture | **Keep `<12` as the low cut.** UK consensus diagnostic cut-point is <12 nmol/L (BSSM 2023, Grade A). [S1] |
| Normal | `12 – 20` (`≤ 20`) | `normal-testosterone` | Normal/ambiguous → Kit 3 upsell path | **Keep single 12–20 normal band.** No UK source supports a 12–15 split. [S1][S2] |
| Optimal | `> 20` | `optimal-testosterone` | No supplement CTA; retest 6-12 mo | **Confirm.** No clinical "optimal" threshold exists; >20 as a positive-framing band is fine but is a product choice, not a guideline. [S1] |

> ✅ **Discrepancy resolved by research:** `kit-1-…md §3` specifies a **12-15 "borderline"** band. **Drop it.** No UK guideline (BSSM, SfE/ACB) recognises 12–15 as equivocal — the real grey zone is **8–12 nmol/L** (below your low cut, so it already routes to GP). The kit doc's supplement-push/FM framing is separately superseded by the 2026-06-04 low-T → GP decision. [S1][S2]
>
> **Optional refinement for Ewa:** split the existing `<12` into `<8` (definite deficiency) and `8–12` (equivocal — free-T-supported). Both still GP-route under the current model, so this is presentational only. **Additional referral trigger to consider:** TT `<5.2` nmol/L with low LH/FSH or raised prolactin → endocrinology / pituitary MRI (BSSM 2023). [S1]

### SHBG (nmol/L)
| Band | Range | Result state | Research-backed recommendation |
|---|---|---|---|
| Low | `< 17` | `shbg-low` | **Assay-match to Vitall — do NOT lock 17–55 generically.** SHBG has no UK consensus range; it is assay-specific. One NHS lab (Severn) uses 13–90 nmol/L for men. Pull the reference interval from Vitall's actual analyser. [S3] |
| Normal | `17 – 55` (`≤ 55`) | `shbg-normal` | As above — confirm against Vitall. |
| High | `> 55` | `shbg-high` | As above — confirm against Vitall. |

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

> **Free Androgen Index (FAI):** in the Kit 1 panel but the engine does **not** classify it into a state. **Recommendation: keep FAI report-only — do not band it in men.** SfE states FAI is "of limited value in men"; it correlates poorly with calculated free T and overestimates at low SHBG. Calculated free testosterone (above) is the preferred derived metric. [S1][S5]

---

## Kit 2 — Energy & Recovery Check (4 markers)
Panel: Vitamin D (25-OH), Active B12, hs-CRP, Ferritin.

### Vitamin D, 25-OH (nmol/L)
| Band | Range | Result state | Research-backed recommendation |
|---|---|---|---|
| Critically low | `< 25` | `critically-low-vitamin-d` | **Keep `<25`.** This is the SACN population-protective floor and the NICE severe-deficiency line. **Recommend this also GP-routes** (see GP-block note). [S6][S7] |
| Low | `25 – < 50` | `low-vitamin-d` | **Keep.** Matches NICE CKS / Royal Osteoporosis Society "deficient / may be inadequate" zone (ROS uses <30 as the treat line within this band). [S7] |
| Normal | `≥ 50` | `normal-vitamin-d` | **Keep `≥50` as sufficient.** Matches NICE/SACN. [S6][S7] |

> ✅ **Discrepancy resolved by research:** `kit-2-…md` states **<50 low, 50-75 borderline, >75 optimal**. **The code scheme wins — do not adopt the kit-note scheme.** The **>75 "optimal"** band is stricter than *every* UK national standard (SACN, NICE, ROS) and is a private-lab construct. For a clinician sign-off, presenting >75 as "the NHS range" would be inaccurate. One genuine UK inter-source gap to be aware of: severe-deficiency line is **<25 (SACN/NICE)** vs **<30 (ROS treatment line)** — the code's `<25` is the more conservative, defensible choice. [S6][S7]

### Active B12, Holotranscobalamin (pmol/L)
| Band | Range | Result state | Research-backed recommendation |
|---|---|---|---|
| Low | `< 37.5` | `low-b12` | **Change recommended — see below.** |
| Normal | `≥ 37.5` | `normal-b12` | **Change recommended — see below.** |

> ⚠️ **CODE CHANGE RECOMMENDED.** Both the code's single `<37.5` cut and the kit doc's `<35` sit *inside* the NICE NG239 indeterminate zone and neither matches the guideline's three-band structure. **NICE NG239 (2024) operative bands for active B12 (holoTC): `<25` low/deficient · `25–70` indeterminate (would reflex to MMA in clinical practice) · `>70` deficiency unlikely.** Study cut-points span 19–77 pmol/L and NG239 leaves the exact figure to the assay manufacturer, so confirm Vitall's assay range, but 25/70 are NG239's working figures. **Recommended bands: `<25` low · `25–70` borderline/indeterminate · `>70` normal.** This is the clean answer to "37.5 or 35?" — arguably neither as a single cut. Ewa to confirm. [S8][S9]

### hs-CRP (mg/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| High | `> 10` | `high-crp` | **GP-block state** (GP referral) | **Keep `>10` cut.** Per AHA/CDC, >10 mg/L = acute inflammation/infection, not chronic CV risk — should not be used for CV scoring; clinically the action is "retest ≥2 weeks apart, use lower value, seek acute cause." GP routing is the safe DTC call. [S10][S11] |
| Moderate | `> 3 – ≤ 10` | `moderate-crp` | **Keep.** AHA/CDC: >3 = high CV risk. [S10][S11] |
| Elevated | `> 1 – ≤ 3` | `elevated-crp` | **Keep.** AHA/CDC: 1–3 = average CV risk. [S10][S11] |
| Normal | `≤ 1` | `normal-crp` | — | **Keep.** AHA/CDC: <1 = low CV risk. [S10][S11] |

> ✅ **Confirmed:** cut-points `>1 / >3 / >10` match the AHA/CDC 2003 consensus banding exactly. **Band labels** (code: elevated/moderate/high) are a product choice — confirm wording. CRP `>10` → GP is appropriate. [S10][S11]

### Ferritin (µg/L)
| Band | Range | Result state | Routes to | Research-backed recommendation |
|---|---|---|---|---|
| Low | `< 30` | `low-ferritin` | **GP-block state** (GP referral) | **Keep `<30` → GP.** NICE CKS modern sensitive iron-deficiency cut. (Classic `<15` is older/more specific.) [S12][S13] |
| Suboptimal | `30 – 100` (`≤ 100`) | `suboptimal-ferritin` | **Relabel.** The 30–100 band is real but it is an **indeterminate / exclusion zone** (iron deficiency still possible if inflammation is present), NOT "suboptimal" (private-lab framing). Suggest "borderline / indeterminate." [S12][S13] |
| Normal | `> 100` | `normal-ferritin` | **`100` is NOT the male upper limit — gap to fix.** Male upper reference is ~300–400 µg/L (no single UK figure; >340 is trust-specific). The engine has **no high-ferritin flag** at all. High ferritin warrants TSAT and possible haemochromatosis / liver work-up. **Recommend adding a high-ferritin band → GP.** Ewa to set the male upper action threshold. [S13][S14] |

> ⚠️ **Two items for Ewa.** (1) Relabel the 30–100 band from "suboptimal" to "borderline/indeterminate." (2) **Add a high-ferritin GP route** — currently anything >100 is silently "normal," so a markedly raised ferritin (haemochromatosis, liver disease, acute-phase) is never flagged. [S12][S13][S14]

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

## Summary of decisions needed from Ewa
Each carries a research-backed recommendation; Ewa confirms or overrides.
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
- **[S2] Society for Endocrinology / ACB joint position statement 2023** — `<8` likely hypogonadism, 8–12 equivocal, >12 unlikely; "action cutoffs, not reference ranges." https://journals.sagepub.com/doi/10.1177/00045632231179022
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
| Clinical / thresholds | Dr Ewa Lindo | ☐ PENDING | — |
| Business | Keith Antony | ☐ PENDING | — |

> On Ewa's approval: (1) reconcile any band she changes back into `classifier.ts` (with a regression-fixture update) — note the **Active B12 three-band change** and the **high-ferritin band** are net-new code, not just value tweaks; (2) update the conflicting kit docs to point here as the single source of truth; (3) log as a CA entry in the content-approval register (clinical-data sign-off); (4) close ClickUp task 01.
