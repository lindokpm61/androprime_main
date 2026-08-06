# Vitall analytes reconciliation — Ben's 2026-08-06 reply vs everything we hold

**Date:** 2026-08-06 | **Owner:** Keith
**Status:** Findings, **plus the build fixes now applied** (see §6). No clinical band was changed: the three items that need Ewa are still open and are listed in §5.
**Trigger:** Ben Starling's reply on Gmail thread `19f70d67aa19b5f5`, 2026-08-06 18:02 UTC, which supplied the per-code analyte table and the male reference ranges that `04_products/results-engine/thresholds.md` has been carrying as owed since 2026-08-04.
**Scope checked:** results-engine ingestion and classification, Ewa's signed thresholds, the signed services agreement Schedule 1, the kit specs, live site and LP copy, and the dev fixtures.

---

## 1. The confirmed truth (Ben, 2026-08-06)

All nine markers confirmed **returned**. Ranges are the lab's own, and Ben's explicit instruction is that they are **not to be hardcoded**: *"They can vary by age and are sometimes changed by the lab. So don't hardcode these, always use the reference ranges which are returned with each result."*

| Marker | Codes | Unit | Male reference range |
|---|---|---|---|
| Total Testosterone | hormone-check, combo | nmol/L | 8.64 - 29.00 |
| SHBG | hormone-check, combo | nmol/L | 20.6 - 76.7 |
| Albumin | hormone-check, combo | g/L | 35 - 50 |
| Free Testosterone (calculated) | hormone-check, combo | nmol/L | 0.1980 - 0.6190 |
| Free Androgen Index | hormone-check, combo | **%** | 35.0 - 92.6 |
| Vitamin D (25-OH) | energy-metabolism, combo | nmol/L | 50 - 250 |
| Active B12 | energy-metabolism, combo | pmol/L | >37.5 |
| CRP | energy-metabolism, combo | mg/L | <1.00 |
| Ferritin | energy-metabolism, combo | µg/L | 30 - 442 |

Also confirmed: FAI is **returned by Vitall**, we do not calculate it. Three labs will run our samples: **Inuvi Diagnostics** (default), **Alderley Lighthouse Labs** (backup), **The Doctors Laboratory** (backup and referrals).

---

## 2. Verdict

| # | Finding | Severity | Owner |
|---|---|---|---|
| 1 | FAI tells every customer "within the normal range, no action needed" regardless of value, while the bar renders it red | **Blocker** | Build (Ewa confirms copy) |
| 2 | No high-testosterone band anywhere in the engine | **High** | Ewa |
| 3 | Active B12: our 25/70 bands vs the assay's own >37.5 cut, ratified before the range existed | **High** | Ewa |
| 4 | Ferritin: our >300 GP flag vs the lab's 442 upper, same problem | **High** | Ewa |
| 5 | SHBG fallback range 17-55 is wrong against the real assay 20.6-76.7 | Medium | Build |
| 6 | Active B12's reference range never displays to the customer | Medium | Build |
| 7 | Testosterone card copy quotes a reference range that is not the lab's | Medium | Build (Ewa confirms copy) |
| 8 | The site's UKAS claim now spans three labs, only one of which we have named evidence for | Medium | Keith |
| 9 | Schedule 1 prices 4/4/8 markers; we sell 5/4/9. The extra one is FAI | Medium | Keith |
| 10 | Every dev fixture carries a reference range that differs from the real assay | Low | Build |
| 11 | Ferritin unit string comparison will warn on every result (`ug/L` vs `µg/L`) | Low | Build |
| 12 | Two marker-name strings are unverified against the live payload | Low | Build, at first live result |
| 13 | No high band for Vitamin D (lab upper 250) or Albumin (lab upper 50) | Low | Ewa |

---

## 3. Findings

### 1. BLOCKER — FAI asserts normality for every value, including below range

Ewa's ruling 8 (2026-06-16) is **"FAI: report-only, do not band it in men"**, and the clinical reasoning in `thresholds.md` is sound. The implementation does not report it neutrally. It asserts it is normal.

`resolveState()` has no `case 'Free Androgen Index'`, so FAI falls to `default: return 'normal'` ([classifier.ts:268](../../../09_website-app/frontend/lib/results/classifier.ts#L268)). The `normal` copy block reads, verbatim ([biomarker-copy.ts:271-278](../../../09_website-app/frontend/lib/results/biomarker-copy.ts#L271)):

> **"This marker is within the normal range"** … **"No action is needed for this marker."**

Meanwhile `resolveBarZones()` falls to its default, which derives zones from the lab range: everything below `referenceLow` renders **critical (red)** ([classifier.ts:477-480](../../../09_website-app/frontend/lib/results/classifier.ts#L477)). Ben has now given us `referenceLow` = 35.0.

So a man with FAI 28 sees his number in the red band, directly above the sentence "This marker is within the normal range" and "No action is needed". The card contradicts itself, and the text is false.

FAI is not a minor marker in our copy. It is in Kit 1's headline marker list on every kit page, and the FAQ sells it as *"free testosterone via FAI"* ([faq/page.tsx:27](../../../09_website-app/frontend/app/(marketing)/faq/page.tsx#L27)).

**Fix:** give FAI its own state and copy that reports the number and its range without asserting a verdict, which is what "report-only" was meant to be. Ewa confirms the wording. Do not band it into low/normal/high, that part of her ruling stands.

### 2. HIGH — nothing flags a high testosterone

The engine's top band is `value > 20 → optimal-testosterone`, with a retest-in-6-to-12-months CTA and no upper bound ([classifier.ts:224-225](../../../09_website-app/frontend/lib/results/classifier.ts#L224)). The lab's male upper is **29.00**. A result of 35 nmol/L, which is above the assay's reference ceiling and is what exogenous testosterone use looks like, is labelled **"optimal"** and told to retest in six months.

`thresholds.md` never considers a high band. The 2026-06-16 sign-off covered the low end in detail (three sub-bands plus an endocrinology flag) and left the ceiling open. Kit 1's whole buyer profile makes this reachable.

**Fix:** Ewa sets a high-T action threshold and its routing. This is a clinical call, not a build one.

### 3. HIGH — Active B12 bands were ratified without the assay range, which now contradicts them

Our bands are NICE NG239: `<25` low, `25-70` borderline, `>70` normal ([classifier.ts:264-267](../../../09_website-app/frontend/lib/results/classifier.ts#L264)). **Vitall's own cut is >37.5.**

This matters more than a normal disagreement, because NG239 explicitly leaves the exact figure to the assay manufacturer, which `thresholds.md` itself records: *"NG239 leaves the exact figure to the assay manufacturer, so confirm Vitall's assay range."* That confirmation was listed as still owed in the 2026-08-04 warning box. It has now arrived and it says 37.5.

Live consequence: a man at 40 pmol/L is inside the lab's range and is told by us he is **borderline**, with a supplement-waitlist CTA.

**Fix:** put 37.5 in front of Ewa and have her re-ratify or revise. She may well keep NG239, but she should make that call knowing the manufacturer's figure, which she did not have on 2026-06-16.

### 4. HIGH — ferritin's high band sits well below the lab's ceiling

We flag `>300 → high-ferritin → GP referral` ([classifier.ts:259-260](../../../09_website-app/frontend/lib/results/classifier.ts#L259)). The lab's male upper is **442**.

Ewa chose 300 from "300-400 is fine", conservative end, and `thresholds.md` records that she was choosing without an assay range in hand (*"Ewa to set the male upper action threshold"*, with the range listed as owed). A man at 350 will see the range **30 - 442** printed on his own card and a red band telling him to see his GP.

**Fix:** same as #3. Re-ratify with 442 visible. The referral may still be right; it should be a decision, not an artefact of missing data.

### 5. MEDIUM — SHBG fallback range is materially wrong

Ewa's ruling 7 is "match the lab, no fixed numbers". The code does exactly that in normal operation, banding SHBG against the returned range. But the fallback when the lab omits a range is **17-55** ([classifier.ts:231-232](../../../09_website-app/frontend/lib/results/classifier.ts#L231), and the same pair again in `resolveBarZones` at [L429-430](../../../09_website-app/frontend/lib/results/classifier.ts#L429)). The real assay is **20.6-76.7**.

If a payload ever arrives without a parseable range, we would call SHBG 60 "high" when the lab calls it normal to 76.7. That is a wrong result presented with full confidence.

**Fix:** set the fallback to 20.6-76.7 and note its provenance. This closes an item `thresholds.md` has carried as owed since June.

### 6. MEDIUM — the customer never sees Active B12's reference range

`MarkerCard` gates the whole REF block on `referenceHigh !== null` ([MarkerCard.tsx:84](../../../09_website-app/frontend/components/results-engine/MarkerCard.tsx#L84)). Active B12's range is `>37.5`, so `referenceHigh` is null and **no range renders at all**. Every other marker on the card shows one.

The GP handoff page handles this correctly, with an explicit `> low` branch ([handoff/page.tsx:46-51](../../../09_website-app/frontend/app/(app)/results-dashboard/handoff/page.tsx#L46)). The customer-facing card does not.

QA will not catch this, because the B12 fixture sets `high: 188.0`, a bound the real assay does not return. The dev view is structurally different from the live view for this marker.

### 7. MEDIUM — the testosterone card states a reference range that is not ours

[biomarker-copy.ts:11](../../../09_website-app/frontend/lib/results/biomarker-copy.ts#L11) tells the customer: *"The reference range runs from roughly 9 to 27.6 nmol/L."* That is the fixture range. The lab's is **8.64 - 29.00**, and the live REF display renders it on the same card.

Hedged with "roughly", so the floor survives, but the ceiling is out by 1.4 and it sits next to the real number.

### 8. MEDIUM — the UKAS claim now covers three labs

Twenty page files carry "UKAS ISO 15189 accredited lab", including the results dashboard and the GP handoff sheet, which states it as fact about the samples analysed. Ben named three labs and **pointed at the public UKAS register rather than confirming their status in writing**, which is not what the July catch-up asked for.

This is a live claim on the site today, and the GP handoff version is a clinical-facing assertion. Verify all three on the register, record the certificate numbers, and keep chasing the written confirmation. Note the likely spelling is **Alderley Lighthouse Labs**, Ben wrote "Lighthous".

### 9. MEDIUM — the ninth marker is not in the contract

Schedule 1 §5 of the signed agreement prices the panels as:

- Kit 1: Free Testosterone, Albumin, SHBG, Testosterone — **4**
- Kit 2: Vitamin D, CRP, Active B12, Ferritin — **4**
- Kit 3: the union — **8**

We sell **5 / 4 / 9**. The difference in both cases is **FAI**, which appears nowhere in Schedule 1. "All 9 markers" is on the Kit 3 page, its metadata, the LP, and the kits index.

The 2026-08-04 close-out draft flagged this as a known internal question and deliberately kept it out of the email. **It is now decidable:** Ben has confirmed in writing that FAI is returned. Get it into the contract as a schedule amendment while he is responsive, or the marketing claim rests on one email.

### 10-13. LOW

- **Fixtures diverge from the real assay across the board:** Testosterone 9.0-27.6 vs 8.64-29.00, SHBG 18.3-54.1 vs 20.6-76.7, Free T 0.17-0.81 vs 0.198-0.619, FAI 24.0-104.0 vs 35.0-92.6, Vitamin D 50-175 vs 50-250, Ferritin 30-400 vs 30-442, Active B12 37.5-188 vs >37.5. Only Albumin and hs-CRP match. Update them so QA sees what customers will.
- **Unit string comparison:** `EXPECTED_UNITS` holds Ferritin as `'ug/L'` ([normaliser.ts:38](../../../09_website-app/frontend/lib/results/normaliser.ts#L38)); Ben's table uses `µg/L`. If the payload sends the micro sign, every ferritin result logs a UNIT MISMATCH warning. Not fatal by design, but it makes the guard useless as a signal. Normalise before comparing.
- **Two marker names are unverified:** `NAME_MAP` has no `'Free Testosterone (calculated)'` or `'Vitamin D (25-OH)'`. Those strings are from Keith's own table, not proven payload names, and the code comment records the live catalogue names as `Free Testosterone` and `Vitamin D`. An unmapped name is **silently skipped** ([normaliser.ts:70-71](../../../09_website-app/frontend/lib/results/normaliser.ts#L70)), so a mismatch loses the marker without an error. Confirm against the first real payload from the Kit 1 order now in fulfilment.
- **No high band for Vitamin D or Albumin.** Lab uppers are 250 and 50; the engine treats anything above 50 nmol/L and 35 g/L as normal forever. Vitamin D matters slightly more than it looks, because we sell a 4,000 IU D3 stack and a supplementing customer's retest is the realistic route to a reading over 250.

---

## 4. What checks out

Worth stating plainly, because most of it does.

- **All nine markers confirmed returned**, and **every unit matches** what the engine expects. `normaliser.ts:85` carried a standing note that Vitamin D, hs-CRP and Active B12 units were "still unconfirmed against real Vitall output". Ben has now confirmed all three. That note can be cleared.
- **Four bands match the lab's own boundary exactly:** Albumin `<35` against a 35-50 range, Ferritin `<30` against 30-442, Vitamin D `≥50` against 50-250, hs-CRP `≤1` against `<1.00`.
- **FAI's expected unit is already `%`**, which is what Ben confirmed, against the "ratio" in Keith's table.
- **All four reference-range formats Ben returned parse correctly** through `parseReference`: `8.64 - 29.00`, `>37.5`, `<1.00`, `0.1980 - 0.6190`.
- **The hs-CRP assay question is closed**, confirmed in writing 2026-04-30 and cited in `thresholds.md`. No gap there.
- **Free T's dynamic reference-low works** with the confirmed 0.198 floor.
- **The architecture is right.** Ben's "don't hardcode" instruction is compatible with what we built: the display shows the lab's returned range, and Ewa's signed bands are a separate clinical decision layer. Three labs with differing intervals is a reason that separation matters, not a reason to change it.

**One pattern worth naming.** Three markers will show the customer a lab range and a verdict that disagree with it: testosterone (in range at 10, GP-referred by us), ferritin (in range at 350, GP-referred by us), Active B12 (in range at 40, borderline to us). For testosterone that disagreement **is the brand thesis** and the `myth-of-normal-range` article exists to explain it. For the other two it currently reads as an error. This needs one UI decision, a line on the card explaining why our band differs from the printed range, not three separate fixes.

---

## 5. Before a customer sees a result

**Ewa (clinical, blocking):**
1. High-testosterone threshold and routing. Does not exist today.
2. Re-ratify Active B12 25/70 against the assay's 37.5.
3. Re-ratify the ferritin 300 GP flag against the lab's 442 ceiling.
4. Confirm the FAI report-only wording once drafted.
5. Optional: high bands for Vitamin D and Albumin.

**Build:**
6. FAI state and copy (finding 1). This is the one that puts wrong information in front of a customer.
7. SHBG fallback to 20.6-76.7.
8. `MarkerCard` reference-range display for a `>` bound.
9. Testosterone card copy range.
10. Fixtures to the real assay ranges; unit-string normalisation.
11. Verify the two marker-name strings against the first live payload.

**Keith (commercial and compliance):**
12. Verify all three labs on the UKAS register, record it, keep chasing written confirmation.
13. Get FAI into Schedule 1, or accept that "9 markers" rests on an email.
14. Chase the insurance certificate, now pushed to next week.

**Then:** update `thresholds.md` with the confirmed ranges, clear its 2026-08-04 warning box, update the assay-provenance table, and close the items in `vitall-negotiation-log.md`.

---

## 6. Build fixes applied 2026-08-06

All of the build column above, done in one pass. **No clinical band was changed**: everything here either
implements a ruling Ewa has already given, or corrects a value against a source of truth.

| Finding | Change | File |
|---|---|---|
| 1 | New `fai-reported` state: badge "Reported" not "Optimal", footer "For reference" not "Keep it up", no traffic-light bar, no CTA, and copy that states the number without grading it. Added to `CLEAR_STATES` so it cannot veto an all-clear (FAI previously resolved to `normal`, which was already in that list, so omitting it would have broken the maintenance offer and the seq-03c signal). | `types.ts`, `classifier.ts`, `biomarker-copy.ts`, `StatusBadge.tsx`, `ResultRecommend.tsx` |
| 5 | SHBG fallback 17-55 retired for Vitall's 20.6-76.7, as named constants with provenance. | `classifier.ts` |
| 6 | Reference-range display handles a lower-bound-only range, so Active B12's ">37.5" now renders on the card and on the bar instead of nothing. | `MarkerCard.tsx`, `TrafficLightBar.tsx` |
| 7 | Testosterone evidence copy now says "roughly 8.6 to 29 nmol/L". | `biomarker-copy.ts` |
| 10 | All fixture reference ranges aligned to the confirmed assay, including B12's missing upper bound, which is what hid finding 6 from QA. | `lib/results/fixtures/*.ts` |
| 11 | Unit comparison folds µ/μ/u, case and spacing, so the mismatch guard stops firing on every ferritin result and stays a real signal. | `normaliser.ts` |
| 12 | Added defensive name aliases, and an unmapped marker now **warns** instead of being dropped in silence. That path could lose a tracked marker with nothing in the logs. | `normaliser.ts` |

**Found in passing, and fixed:** the results card told a normal-testosterone customer that *"The Daily Stack
provides 30mg of elemental zinc"*. The dose was reduced to **25 mg** on Ewa's approval 2026-08-02, and
`daily-stack.md` records that as "applied to all three site surfaces the same day". The results engine was
not one of the three. The LP was already correct. Corrected in `biomarker-copy.ts` and in
`07_sales/funnel/all-clear-maintenance-offer-copy.md`, which carried the same stale figure.

**Verification.** `tsc --noEmit` clean. Results-engine regression suites pass: 26 classifier assertions,
42 maintenance-offer, 28 account-export, 37 consent-gate, 9 retest-reminder, plus the kit-CTA and rulings
gates. The cards were then rendered in a throwaway dev route and **screenshotted** at FAI 28 (below the
lab floor), FAI 60 (in range), Active B12 45, and testosterone 16.2, confirming the badge, the absent bar,
the ">37.5" reference display and the corrected range copy. The route was deleted afterwards.

> ⚠️ **`npm test` cannot currently run.** It fails at its first step, `typecheck:scripts`, on three
> pre-existing errors in content-engine scripts unrelated to the results engine
> (`doctor-heartbeat.ts` ×2, `metricool-schedule.ts` ×1). The results suites had to be invoked directly.
> Worth fixing on its own: the guard that protects the results engine is currently gated behind an
> unrelated broken typecheck, so nobody running `npm test` gets to it.

**Still open and unchanged:** everything in the Ewa column of §5, plus the Keith column. The FAI wording is
drafted, not approved.

---

*Findings §1-5 are reconciliation. §6 is what was built. No clinical band was altered.*
