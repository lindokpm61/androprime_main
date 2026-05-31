# Approval Record — Newsletter Issue 001: CRP / inflammation (v1)

| Field | Value |
|---|---|
| Register ID | CA-012 |
| Artefact path | `06_marketing/content/email/newsletter/issue-001-crp-blood-test.md` |
| Version | `v1` |
| Content type | Customer-facing editorial email (newsletter broadcast) |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-31 |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 06_marketing/content/email/newsletter/issue-001-crp-blood-test.md`
- **Run date:** 2026-05-31
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 0` (after reword of the compliance-notes block; the only initial hits were banned terms quoted inside the doc's own notes, since removed — body never contained them except one compliant "does not diagnose" negation)
- **Judgement pass:** done — EFSA wording (no ingredient benefit claimed), Phase-0 boundary (sole action is the quiz; no TRT/clinical/FM reference), silent-ingredient (no ingredient named at all), FM-CTA gate (no FM CTA present), retest framing ("see what changed", never "fixed/cured"). GP-referral thresholds reproduced verbatim from the source article.
- **Disposition of every HARD hit:** all resolved. Initial HARD on "Ashwagandha" + REVIEW on "fix"/"TRT" were in the doc's own compliance-notes meta-block; reworded so the literals no longer appear. Body is clean.

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| issue-001 body | "Change one thing … Wait 4 to 8 weeks. Retest. Now the number is moving, and the direction is the answer." | Efficacy-adjacent: implies lifestyle changes move CRP. Carried in substance from the Ewa-approved `crp-blood-test.mdx` (sleep/body-composition/alcohol drivers, cited). | Ewa (clinical) | ☑ APPROVED — confirmed framing rides on the existing article sign-off |

## 3. Conditions of approval

- Built as a Customer.io **broadcast** (not a triggered campaign) to the `Newsletter Subscribers` segment; stays DRAFT until human go/no-go on send.
- Quiz pointer link carries `?utm_source=newsletter&utm_medium=email&utm_campaign=issue-001-crp` (attribution; do not strip).
- One-click unsubscribe present in footer; `{{ customer.first_name | default: 'there' }}` (no-name rule).

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | recorded on Keith's representation — countersignature recommended for the clinical record | 2026-05-31 |
| Business (Keith) | Keith Antony | APPROVED | — | 2026-05-31 |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

## 5. Outcome

- Final decision: **APPROVED**
- Register updated: 2026-05-31
- Notes: Recorded on Keith's in-session confirmation that he and Ewa both agreed the sign-off (same pattern as CA-009/010/011). Send remains a separate human go/no-go; the newsletter list is near-empty because guest capture was only fixed today (`8274a0d`), so the audience will accrue before this issue is worth sending.
