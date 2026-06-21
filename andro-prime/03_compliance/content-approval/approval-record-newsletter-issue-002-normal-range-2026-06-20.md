# Approval Record — Newsletter Issue 002: the myth of the "normal range" (v1)

| Field | Value |
|---|---|
| Register ID | CA-017 |
| Artefact path | `06_marketing/content/email/newsletter/issue-002-myth-of-normal-range.md` |
| Version | `v1` |
| Content type | Customer-facing editorial email (newsletter broadcast) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-20 |
| Required signers | **Ewa (clinical) + Keith (business)** |
| Decision | 🟠 **PENDING — awaiting Ewa clinical sign-off** (Pillar C / testosterone = higher-sensitivity than Issue-001) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 06_marketing/content/email/newsletter/issue-002-myth-of-normal-range.md`
- **Run date:** 2026-06-20
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 3` (after rewording the compliance-notes meta-block; the only initial 🔴 was the literal "TRT is available" appearing *inside* the doc's own note "No implication TRT is available" — a negation in the meta, never a body claim; reworded out).
- **Judgement pass:** done — EFSA wording (no ingredient benefit claimed; no ingredient named, silent-ingredient respected by omission), **Phase-0 boundary HELD** (body states "We don't offer TRT; that's a clinical decision for a clinician"; no "TRT is live/on sale" implication, no "be first when we launch" framing), FM-CTA gate (no FM CTA; sole action is the quiz), retest framing ("retest in 8 to 12 weeks", "the direction is the answer" — never "fixed/cured"). GP-referral thresholds reproduced verbatim in substance from the source article.

## 2. Items flagged for human decision

All three 🟠 are `«TRT»` matches. None is a CTA; each is a compliant boundary/guardrail statement carried verbatim-in-substance from the **Ewa-approved** source article `myth-of-normal-range.mdx` (published 2026-06-18). Ewa to confirm the testosterone framing + thresholds for the newsletter context.

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| issue-002 body (~L73) | "We don't offer TRT; that's a clinical decision for a clinician." | Scanner flags any `«TRT»`; this is the Phase-0 boundary statement, not a CTA | Ewa (clinical) | ☐ pending |
| issue-002 body (~L78) | "…you're already on prescription TRT, that's a GP conversation from the start." | GP-referral guardrail (carried from approved article's "already on prescription TRT" line) | Ewa (clinical) | ☐ pending |
| issue-002 body | Testosterone bands + Wu 2010 sub-11 finding (8 nmol/L referral line; 8–11 grey zone + 3 symptoms; >40% peak loss by 60) | Clinical thresholds + cohort interpretation reproduced in an email; confirm no threshold softened vs the approved article | Ewa (clinical) | ☐ pending |
| issue-002 L106 (meta) | "TRT framing held to Phase 0 boundary…" | `«TRT»` inside the internal compliance-notes block; not customer-facing | Ewa (clinical) | ☐ pending (meta only) |

## 3. Conditions of approval (on sign-off)

- Built as a Customer.io **broadcast** (not a triggered campaign) to the `Newsletter Subscribers` segment; stays DRAFT until human go/no-go on send.
- Quiz pointer link carries `?utm_source=newsletter&utm_medium=email&utm_campaign=issue-002-normal-range` (attribution; do not strip).
- One-click unsubscribe present in footer (`{% unsubscribe_url %}` TAG); `{{ customer.first_name | default: 'there' }}` (no-name rule).
- No threshold may be softened vs `myth-of-normal-range.mdx` at build time.

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | ☐ PENDING | — | — |
| Business (Keith) | Keith Antony | ☐ PENDING | — | — |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

## 5. Outcome

- Final decision: **PENDING — not approved.** Do not build the CIO broadcast or send until Ewa (clinical) + Keith (business) sign.
- Register: filed PENDING 2026-06-20.
- Notes: Sourced from the Ewa-approved `myth-of-normal-range.mdx`; claims pre-verified there. Testosterone/Pillar C sensitivity is the reason Ewa sign-off is mandatory before this is built as a broadcast (Issue-001/CRP was lower-sensitivity and went straight to approved). Send remains a separate go/no-go regardless; the subscriber list is only now accruing (seq-07 welcome went live 2026-06-20).
