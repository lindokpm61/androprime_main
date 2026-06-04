# Approval Record — Low-T result-card recommendation copy (GP referral) (v1)

| Field | Value |
|---|---|
| Register ID | CA-013 |
| Artefact path | `09_website-app/frontend/lib/results/biomarker-copy.ts` (low-testosterone `recommendation`) + `09_website-app/frontend/lib/results/classifier.ts` (`FT_LOW_WITH_LOW_T_RECOMMENDATION`) |
| Version | `v1` (low-T routing decision 2026-06-04) |
| Content type | Results-engine recommendation copy (customer-facing results wording) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-04 |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 09_website-app/frontend/lib/results/biomarker-copy.ts 09_website-app/frontend/lib/results/classifier.ts`
- **Run date:** 2026-06-04
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 8` — **none of the 8 REVIEW hits fall on the two approved blocks.** They are all pre-existing unrelated lines (SHBG `fix`, the EFSA zinc/D3/B12 supplement recommendation lines, and the literal word `fix` in a `// defect fix` code comment). A targeted scan of the two new blocks alone returns 0/0.
- **Judgement pass:** done — no `diagnose`/`treat`/`cure`/"You have…"; both blocks report the measured result factually and signpost "speak to your GP"; **no TRT or future-service promise** (the rewrite removed the prior "We are building that service / register now to secure your place at the front of the queue" text); no EFSA ingredient claim; no founding-member/queue framing; no em dashes.
- **Disposition of every HARD hit:** none (0 HARD).

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| biomarker-copy.ts (low-testosterone `recommendation`) | "Your testosterone is below the level where lifestyle changes and supplements alone are likely to make a meaningful difference. The most appropriate next step is to speak to your GP, who can confirm this result, look for any underlying cause, and talk you through your options. Take your result with you so they have the full picture." | Results wording for a clinically-low result — clinical signposting. | Ewa (clinical) | ☑ APPROVED |
| classifier.ts `FT_LOW_WITH_LOW_T_RECOMMENDATION` | "Your free testosterone is below range, and your total testosterone is also low. This combination is more significant than either in isolation. The most appropriate next step is to speak to your GP, who can confirm these results and discuss what they mean for you. Take your results with you." | Combined low free-T + low total-T wording — clinical signposting. | Ewa (clinical) | ☑ APPROVED |

## 3. Conditions of approval

- Replaces the prior low-T recommendation copy that pitched the TRT service + founding-member queue (removed in commit `99a31eb`).
- Routing context: low-T primary CTA is GP referral (commit `0188907`); thresholds (T < 12 → GP) signed by Ewa 2026-06-04. See `04_products/results-engine/2026-06-04-low-t-routing-decision.md`.
- The separate low-T **nurture consent** copy (`LowTNurtureConsent.tsx`) is a DIFFERENT artefact and is NOT covered by this record — it is pending its own Ewa sign-off.

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | direction approved direct ("change to: speak to your GP"); recorded on Keith's representation — countersignature recommended for the clinical record | 2026-06-04 |
| Business (Keith) | Keith Antony | APPROVED | confirmed both sentences verbatim ("both sentences you wrote are ok to go") | 2026-06-04 |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

## 5. Outcome

- Final decision: **APPROVED**
- Register updated: 2026-06-04
- Notes: Copy already in the tree (`99a31eb`); this record closes item #1 of the low-T Ewa sign-off list. Deploy of the low-T → GP routing remains subject to the non-copy gates (migration apply, Customer.io DPA, etc.) tracked in the routing decision note. Remaining low-T Ewa item: CA for the nurture consent copy (pending).
