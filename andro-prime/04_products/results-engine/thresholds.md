# Biomarker Thresholds — Result-Engine Bands (Kit 1 / 2 / 3)

**Status: DRAFT FOR EWA SIGN-OFF (ClickUp task 01). NOT yet approved.**
Single source of truth for the biomarker bands the results engine uses to classify a customer's result and choose the recommendation. Once Ewa signs this off it supersedes the scattered (and currently conflicting) band statements in the individual kit docs.

**What Ewa is signing off:** the *system logic* (the bands, the cut-points, the routing), not any per-customer interpretation. Per the no-bespoke-clinician-interpretation rule, Andro Prime does not produce per-customer GP reports; Ewa approves the thresholds + recommendation triggers that the engine applies uniformly.

**Verbatim source of the live values:** `09_website-app/frontend/lib/results/classifier.ts` (`resolveState`, lines ~113-146). Per-band customer-facing copy lives in `lib/results/biomarker-copy.ts` (low-T card copy already approved as CA-013). The numbers below are transcribed from the code exactly as it runs in production today; they have never had a documented clinical sign-off, which is why this task is open.

**Units / how to read:** `<` and `≤` are reproduced exactly as coded (boundary values matter). "Result state" is the internal code label. "Routes to" is the recommendation the engine fires.

---

## Kit 1 — Testosterone Health Check (5 markers)
Panel: Total Testosterone, SHBG, Albumin (measured) + Free Androgen Index, Free Testosterone (calculated).

### Total Testosterone (nmol/L)
| Band | Range | Result state | Routes to | Clinical basis — **Ewa to confirm** |
|---|---|---|---|---|
| Low | `< 12` | `low-testosterone` | **GP referral** (per 2026-06-04 low-T decision) + consent-gated nurture | [Ewa to supply guideline + confirm 12 cut-point] |
| Normal | `12 – 20` (`≤ 20`) | `normal-testosterone` | Normal/ambiguous → Kit 3 upsell path | [confirm] |
| Optimal | `> 20` | `optimal-testosterone` | No supplement CTA; retest 6-12 mo | [confirm] |

> ⚠️ **Discrepancy to resolve:** `kit-1-…md §3` specifies a **12-15 "borderline"** band (Daily Stack + retest) and 15-20 "normal". The **code has no 12-15 band** — it treats all of 12-20 as `normal-testosterone`. Also the kit doc's borderline framing (supplement push, founding-member trigger) is **superseded** by the 2026-06-04 decision (low-T → GP, no supplement/FM). Ewa: confirm we drop the borderline band, or re-introduce it with GP-appropriate wording.

### SHBG (nmol/L)
| Band | Range | Result state | Clinical basis — **Ewa to confirm** |
|---|---|---|---|
| Low | `< 17` | `shbg-low` | [no kit-doc band on record — Ewa to set/confirm] |
| Normal | `17 – 55` (`≤ 55`) | `shbg-normal` | [confirm] |
| High | `> 55` | `shbg-high` | [confirm] |

### Free Testosterone (calculated, nmol/L)
| Band | Rule | Result state | Note |
|---|---|---|---|
| Low | `value < referenceLow` | `ft-low` | Uses the **lab-supplied reference-low** (dynamic), not a fixed number. Ewa: confirm the reference source is acceptable, or set a fixed cut. |
| Normal | at/above reference-low | `ft-normal` | |

### Albumin (g/L)
| Band | Range | Result state | Routes to | Clinical basis — **Ewa to confirm** |
|---|---|---|---|---|
| Low | `< 35` | `low-albumin` | **GP-block state** (GP referral) | [confirm 35 cut-point + GP routing] |
| Normal | `≥ 35` | `normal-albumin` | — | |

> Note: **Free Androgen Index (FAI)** is in the Kit 1 panel but the engine does **not** classify it into a state (no band in code). Ewa: confirm FAI is report-only, or specify bands.

---

## Kit 2 — Energy & Recovery Check (4 markers)
Panel: Vitamin D (25-OH), Active B12, hs-CRP, Ferritin.

### Vitamin D, 25-OH (nmol/L)
| Band | Range | Result state | Clinical basis — **Ewa to confirm** |
|---|---|---|---|
| Critically low | `< 25` | `critically-low-vitamin-d` | [<25 ≈ NICE deficiency — Ewa to confirm] |
| Low | `25 – < 50` | `low-vitamin-d` | [confirm] |
| Normal | `≥ 50` | `normal-vitamin-d` | [confirm] |

> ⚠️ **Discrepancy:** `kit-2-…md` states **<50 low, 50-75 borderline, >75 optimal**. The **code** has no "borderline" or ">75 optimal" band (treats `≥50` as `normal`) and adds a **<25 "critically low"** band the kit doc omits. Ewa: pick one scheme.

### Active B12, Holotranscobalamin (pmol/L)
| Band | Range | Result state | Clinical basis — **Ewa to confirm** |
|---|---|---|---|
| Low | `< 37.5` | `low-b12` | [confirm 37.5] |
| Normal | `≥ 37.5` | `normal-b12` | [confirm] |

> ⚠️ **Discrepancy:** `kit-2-…md` says **<35 low, 35-70 borderline, >70 optimal**. Code uses **37.5** as the single low/normal cut and has no borderline/optimal split. Ewa: confirm the cut-point and whether borderline/optimal bands are wanted.

### hs-CRP (mg/L)
| Band | Range | Result state | Routes to | Clinical basis — **Ewa to confirm** |
|---|---|---|---|---|
| High | `> 10` | `high-crp` | **GP-block state** (GP referral) | [confirm — kit doc agrees >10 = referral] |
| Moderate | `> 3 – ≤ 10` | `moderate-crp` | [confirm] |
| Elevated | `> 1 – ≤ 3` | `elevated-crp` | [confirm] |
| Normal | `≤ 1` | `normal-crp` | — | |

> Note: cut-points roughly match the kit doc; **band names differ** (code: elevated/moderate/high; doc: mildly-elevated/elevated/referral). Ewa: confirm labels. CRP > 10 correctly routes to GP.

### Ferritin (µg/L)
| Band | Range | Result state | Routes to | Clinical basis — **Ewa to confirm** |
|---|---|---|---|---|
| Low | `< 30` | `low-ferritin` | **GP-block state** (GP referral) | [confirm — kit doc agrees <30 = GP] |
| Suboptimal | `30 – 100` (`≤ 100`) | `suboptimal-ferritin` | [confirm — not in kit doc] |
| Normal | `> 100` | `normal-ferritin` | [confirm upper bound] |

> ⚠️ **Discrepancy:** kit doc only records **<30 low**; code adds a **30-100 "suboptimal"** and **>100 "normal"** split. Ewa: confirm the suboptimal band + the 100 boundary.

---

## Kit 3 — Hormone & Recovery Check (9 markers)
Kit 3 = **Kit 1 panel + Kit 2 panel** (same markers, same bands as above). No Kit-3-specific thresholds; it applies all of the above. The combined-result precedence (which marker leads when several are out of range) is a **separate open item** — see `kit3-combined-result-rule.md` (also Ewa-pending).

---

## GP-referral ("GP-block") states — for clinical review
The engine treats these result states as requiring a **GP referral** rather than a product/supplement recommendation (code: `GP_BLOCK_STATES` + the 2026-06-04 low-T routing):
- `high-crp` (CRP > 10)
- `low-ferritin` (< 30)
- `low-albumin` (< 35)
- `low-testosterone` (< 12) — added by the 2026-06-04 low-T → GP decision

Ewa: confirm this is the correct, complete set of "stop, see your GP" triggers (e.g. should `critically-low-vitamin-d` < 25 also route to GP rather than supplement guidance?).

---

## Summary of decisions needed from Ewa
1. **Testosterone:** keep code's single 12-20 "normal", or restore a 12-15 borderline band (with GP-appropriate, non-supplement wording)?
2. **Vitamin D:** code (`<25 / <50 / ≥50`) vs kit doc (`<50 / 50-75 / >75`) — which scheme?
3. **Active B12:** cut at **37.5** (code) or **35** (doc)? Borderline/optimal bands wanted?
4. **Ferritin:** confirm the 30-100 "suboptimal" band + the 100 upper boundary.
5. **hs-CRP:** confirm band labels; confirm >10 → GP.
6. **SHBG / Albumin / Free T:** confirm cut-points (no kit-doc record); confirm Free T reference source.
7. **FAI:** report-only, or banded?
8. **GP-block set:** confirm complete; decide on critically-low Vit D.

---

## Sign-off
| Role | Name | Decision | Date |
|---|---|---|---|
| Clinical / thresholds | Dr Ewa Lindo | ☐ PENDING | — |
| Business | Keith Antony | ☐ PENDING | — |

> On Ewa's approval: (1) reconcile any band she changes back into `classifier.ts` (with a regression-fixture update), (2) update the conflicting kit docs to point here as the single source of truth, (3) log as a CA entry in the content-approval register (clinical-data sign-off), (4) close ClickUp task 01.
