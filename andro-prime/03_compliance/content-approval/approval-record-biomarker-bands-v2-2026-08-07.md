<!--
RETROSPECTIVE TRANSCRIPTION, drafted by Claude 2026-08-27.
Records the 2026-08-07 re-ratification, which ALREADY HAPPENED. It does not grant one.
Signature rows DELIBERATELY BLANK, completed by the named humans only.
NOTE: this record carries a LIVE OPEN ITEM (§2, item A) that is not merely a filing gap.
-->

# Approval Record — Biomarker bands, results engine (Kit 1 / 2 / 3), v2

| Field | Value |
|---|---|
| Register ID | CA-044 |
| Artefact path | `04_products/results-engine/thresholds.md` + `09_website-app/frontend/lib/results/classifier.ts` + `lib/results/biomarker-copy.ts` |
| Version | v2, the 2026-08-07 re-ratification (supersedes CA-043 in part) |
| Content type | Results wording + system logic (clinical) |
| Submitted by | Keith Antony |
| Submitted date | 2026-08-07 |
| Required signers | Ewa (clinical/claims) |
| Record status | 🔴 **PARTIAL. Numbers and routing APPROVED. Card copy for two live states NOT APPROVED.** |

> **Why v2 exists.** Vitall supplied their per-assay male reference ranges on **2026-08-06**, which
> **the June sign-off was made without** (three were recorded as owed). Ewa was asked again with the
> assay figures beside each band, so v2 is the first time the bands were ratified against the
> numbers the lab actually returns.

## 0. Evidence of the approval (the audit trail)

**ClickUp `869d99kxw`**, comment 2026-08-07. Ewa's verbatim answers:

| Question put | Her answer | Consequence |
|---|---|---|
| Active B12: our NG239 `25/70` against the assay's own `37.5` cut | **"Keep NICE NG239"** | No change. Bands stand, now ratified with 37.5 visible |
| Ferritin: our `300` action threshold against the lab ceiling of `442` | **"Keep 300"** | No change |
| Testosterone: no upper band existed at all | **"over 29+"** | New GP-routed `high-testosterone` state |
| Vitamin D upper band | **Yes**, as "a high/clinical review flag rather than just a technical out-of-range result" | New GP-**blocked** `high-vitamin-d` state; suppresses the D3 supplement CTA on that card |
| FAI wording | **"fine for now"** | Provisional, not closed |
| Albumin upper band | **No** | No change |

Commits `56f3a5e`, `1ce4850`, `56b8ff9`. Knock-on closed in the same pass:
`isTestosteroneAllClear()` and the vitamin D leg of `results_all_clear` had no upper bound either,
and both feed Customer.io, so **a man at 35 nmol/L would have been GP-referred on his dashboard
while being enrolled in seq-03c, the reassurance sequence for normal results.** Regression coverage
26 → 34 assertions.

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js andro-prime/09_website-app/frontend/lib/results/biomarker-copy.ts`
- **Run date:** 2026-08-27
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 7   🟡 CODE-COMMENT: 2   🔵 SIGNED EXCEPTION: 0`
- **Judgement pass:** done. Checked EFSA wording against the `03_compliance/CONTEXT.md` table,
  Phase-0 boundary, silent-ingredient (**"ashwagandha" absent, confirmed**), FM-CTA gate, retest
  framing.
- **Disposition of every HARD hit:** none to dispose of, 0 HARD.
- **CODE-COMMENT hits (2):** `biomarker-copy.ts:168` and `:309`, both the word "treat" inside source
  comments. Confirmed **not** rendered strings. Gate not failed.

## 2. Items flagged for human decision

### A. 🔴 THE BLOCKING ONE: two live GP-referral states render copy Ewa has not approved

Her 2026-08-07 reply gave the **numbers and the routing**. The email put the **wording** to her as
her call and **she sent none**. Both blocks are marked pending in source and **both render to
customers today**.

| `file:line` | State | Status |
|---|---|---|
| `biomarker-copy.ts:81` | `high-testosterone` (`> 29`) | `// WORDING BELOW IS DRAFTED, NOT APPROVED` |
| `biomarker-copy.ts:170` | `high-vitamin-d` (`> 250`) | `// WORDING DRAFTED, NOT APPROVED` |

Keith's ClickUp comment, 2026-08-07: *"Still open: card copy for the two new states is drafted, not
approved... Reply drafted, unsent."* **Open 20 days as at 2026-08-27. No later approval exists
anywhere in ClickUp.** This is not a filing gap; it is unapproved clinical copy in production.

### B. 🟠 EFSA wording deviations found by the judgement pass

Surfaced, **not rewritten**. Two of these sit in copy blocks that the 2026-06-16 wording approval
did **not** name, so they have never been signed by anyone.

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| `biomarker-copy.ts:277` (`normal-b12`) | "at a level that **supports normal energy metabolism and cognitive function**" | Three deviations from the approved B12 claims: "supports" not "contributes to"; "energy metabolism" not "energy-**yielding** metabolism"; and **"cognitive function" is not an approved claim** (the approved one is "normal psychological function"). Not covered by the 2026-06-16 wording approval | Ewa | ☐ |
| `biomarker-copy.ts:162` (`normal-vitamin-d`) | "enough to support normal muscle function **and immune response**" | The CONTEXT.md table authorises **only** "contributes to normal muscle function" for Vitamin D3. "Immune response" is an extension beyond the table. (EFSA does authorise an immune claim for vitamin D, so the fix may be to use its exact wording **and** add it to the table, but that is Ewa's call.) Not covered by the 2026-06-16 approval | Ewa | ☐ |
| `biomarker-copy.ts:262` (`low-b12`) | "Methylcobalamin, **a highly bioavailable form** that contributes to normal energy-yielding metabolism and normal psychological function" | Both benefit claims are **exact** approved wording ✅. The flag is "a highly bioavailable form": an unqualified comparative product claim not covered by any approved claim | Ewa | ☐ |
| `biomarker-copy.ts:14` (SHBG education) | "It does not have a direct **fix**; it is a marker that informs how you interpret..." | Scanner matched the retest/efficacy rule. **Disposition: N/A, negation.** The sentence denies a fix rather than promising one, the same shape as the "diagnosis in a negation" case the scanner itself passes 🟢. Recorded for completeness | Ewa | ☐ |

### C. ✅ Checked and clean, recorded so they are not re-litigated

| `file:line` | Phrase | Finding |
|---|---|---|
| `:68` | "Zinc contributes to the maintenance of normal testosterone levels" | **Exact** EFSA wording ✅ |
| `:156` | "Vitamin D3, which contributes to normal muscle function" | **Exact** EFSA wording ✅ |
| `:271` (`borderline-b12`) | "contributes to normal energy-yielding metabolism" | **Exact** EFSA wording ✅, and this block **was** covered by the 2026-06-16 approval |

## 3. Conditions of approval

1. **Item A must close before this record can read APPROVED.** Either Ewa approves the two card-copy
   blocks, or the states render an approved fallback. Numbers and routing are not in question.
2. **Item B needs a decision on three lines.** They are live now and predate both sign-offs.
3. **Attach the 2026-08-07 email** to `content-approval/correspondence/`, as for CA-043.
4. **FAI wording is provisional**, not closed. Ewa's "fine for now" is doing work.
5. Ewa signs the **system logic**, never a per-customer interpretation.

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and date.
**The bands (numbers and routing) are already approved per §0 and are not re-opened by signing.
What needs a decision here is §2 item A and item B.**

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | | | | |
| Business (Keith) | | | | |
| Contractual (Solicitor) | N/A | N/A | N/A | N/A |

## 5. Outcome

- Final decision: 🔴 **PENDING.** Bands APPROVED 2026-08-07; **card copy for `high-testosterone`
  and `high-vitamin-d` NOT APPROVED and live**; three EFSA lines await a decision.
- Register updated: 2026-08-27 (CA-044 added)
- Notes: supersedes **CA-043** on B12, ferritin, testosterone upper, vitamin D upper and FAI.
  CA-043 remains the record for the other five of the original ten points.
