<!--
RETROSPECTIVE TRANSCRIPTION, drafted by Claude 2026-08-27.
This records an approval that ALREADY HAPPENED on 2026-06-16. It does not grant one.
The signature rows are DELIBERATELY BLANK and must be completed by the named humans.
What is being countersigned here is that this transcription faithfully represents the
2026-06-16 email approval, NOT a fresh clinical decision.
-->

# Approval Record — Biomarker bands, results engine (Kit 1 / 2 / 3), v1

| Field | Value |
|---|---|
| Register ID | CA-043 |
| Artefact path | `04_products/results-engine/thresholds.md` (bands) + `09_website-app/frontend/lib/results/classifier.ts` (`resolveState`) + `lib/results/biomarker-copy.ts` (card copy) |
| Version | v1, the 10-point sign-off of 2026-06-16 |
| Content type | Results wording + system logic (clinical) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-16 (approval received same day) |
| Required signers | Ewa (clinical/claims) |
| Record status | 🟠 **TRANSCRIPTION PENDING COUNTERSIGNATURE** |

> **Why this record exists 72 days late.** ClickUp task `869d99kxw` ("01. Ewa threshold sign-off,
> biomarker bands Kit 1, 2, 3") carried a Definition of Done requiring the sign-off be documented in
> `03_compliance/ewa-signoffs/`. **That directory has never existed**, and no record was filed in
> `content-approval/` either, which is where every other approval in this business lives and where
> the register indexes them. Keith's own closing comment on the task noted the gap at the time
> ("sign-off was instead recorded in thresholds.md + the compliance content-approval register.
> Substantive DoD met"), but the register entry was never created. Found 2026-08-27 while verifying
> the Active B12 bands. **The approval is real and evidenced; only its filing was missing.**

## 0. Evidence of the approval (the audit trail)

| Source | What it says |
|---|---|
| **ClickUp `869d99kxw`**, comment 2026-06-16 | "Dr Ewa Lindo approved the biomarker bands for Kit 1/2/3 by email (all 10 points). Engine reconciled to the approved thresholds the same day." |
| **Ewa's email**, 2026-06-16 | The primary record. Held in `keith@andro-prime.com`. **Not yet attached to this record: see Conditions.** |
| **`thresholds.md` header** | "Status: ✅ APPROVED — Dr Ewa Lindo, 2026-06-16 (email, all 10 points)." |
| **`thresholds.md`** card-copy note | "Card copy wording APPROVED by Ewa 2026-06-16 02:33 UTC ('Wording approved')" |
| **Code** | `4f05ad6` feat(results-engine): reconcile biomarker thresholds to Ewa sign-off; `b706798` docs(thresholds): record Ewa card-copy wording approval |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js`
- **Run date:** ❌ **NOT RUN AT THE TIME.** This section cannot be completed honestly for v1: the
  artefact was approved on 2026-06-16 and no pre-flight record exists for the file as it stood that
  day. **No retrospective scan is recorded here, because a scan of today's file is not evidence
  about June's file.** The current-state scan belongs to CA-044 and is recorded there.
- **Judgement pass:** Performed 2026-08-27 against the current file, findings in CA-044 §2.

## 2. Items flagged for human decision

None recorded at the time. The 2026-08-27 judgement pass raised four items against the **current**
card copy; they are listed in **CA-044 §2** rather than duplicated here, because two of them sit in
copy blocks this v1 approval did not cover.

## 3. Conditions of approval

1. **Attach the 2026-06-16 email.** The primary evidence is a Gmail message that exists outside this
   repo. Until it is exported to `content-approval/correspondence/`, this record cites a source a
   compliance reader cannot open. This is the single condition that matters.
2. **Scope of what was signed.** Ewa signed the *system logic*: the bands, the cut-points, the
   routing, plus the card wording named in the 02:33 UTC reply. Per
   `clinical-governance-position.md` she does **not** review individual customer results, and no
   output may be described as a "GP-built" or "personalised" report.
3. **`03_compliance/ewa-signoffs/` is retired as a location.** The convention is
   `content-approval/`. If the old path is referenced anywhere else, point it here.

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and date.
**Signing here confirms this transcription is faithful to the 2026-06-16 approval. It is not a
fresh clinical decision and does not re-open the bands.**

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | | | | |
| Business (Keith) | | | | |
| Contractual (Solicitor) | N/A | N/A | N/A | N/A |

## 5. Outcome

- Final decision: **The underlying approval is APPROVED (2026-06-16).** This transcription is
  `🟠 PENDING` countersignature.
- Register updated: 2026-08-27 (CA-043 added)
- Notes: Superseded in part by **CA-044** (re-ratification 2026-08-07, which added two GP-routed
  bands and revisited B12 and ferritin with the assay figures present).

## Appendix — what was locked on 2026-06-16

Reproduced from `thresholds.md`, which is the source of truth. All ten points approved.

1. **Testosterone:** keep single 12-20 normal; split the low band into `<8` clear-deficiency /
   `8-12` equivocal, and flag `<5.2` for endocrinology ("do both").
2. **Vitamin D:** keep the code scheme (`<25` / `<50` / `≥50`).
3. **Vitamin D `<25` → GP referral.**
4. **Active B12 → NICE NG239 three-band** (`<25` low / `25-70` borderline / `>70` normal).
5. **Ferritin:** relabel `30-100` to "borderline / indeterminate"; add a high band → GP, action
   threshold `>300 µg/L` (Ewa: "300-400 is fine", conservative end chosen).
6. **hs-CRP:** no change.
7. **SHBG / Free T:** match the lab assay, no fixed numbers. Albumin standard `<35` flag.
8. **FAI:** report-only, not banded.
9. **GP-referral set** = low-T (all bands) + CRP `>10` + ferritin `<30` + albumin `<35` +
   vitamin D `<25` + high ferritin.
10. **Card copy wording approved** 02:33 UTC, covering severely-low-T, equivocal-T, borderline-B12,
    high-ferritin, revised critically-low-vitamin-D, and the suboptimal→borderline ferritin relabel.
