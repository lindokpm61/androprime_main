<!--
TEMPLATE — do not sign this file. Copy to:
  approval-record-<artefact-slug>-<YYYY-MM-DD>.md
Fill every section. The signature block is completed by the named human only —
never by Claude/automation. CONTEXT.md is the law.
-->

# Approval Record — <ARTEFACT> (<VERSION>)

| Field | Value |
|---|---|
| Register ID | CA-XXX |
| Artefact path | `<repo/relative/path>` |
| Version | `<v2.3 / v1 draft / …>` |
| Content type | `<partner brief / attestation / email sequence / LP / ad / social / results wording / compliance reference>` |
| Submitted by | `<name>` |
| Submitted date | `<YYYY-MM-DD>` |
| Required signers | `<Ewa / Keith / Solicitor — list all>` |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js <file>`
- **Run date:** `<YYYY-MM-DD>`
- **Result:** `🔴 HARD: <n>   🟠 REVIEW: <n>`
- **Judgement pass:** `<done / not done>` — checked EFSA wording, Phase-0
  boundary, silent-ingredient (name absent?), FM-CTA gate, retest framing.
- **Disposition of every HARD hit:** `<fixed / N/A — explain each. A rulebook
  quoting banned terms to forbid them is the documented exception — state so
  explicitly if that applies.>`

## 2. Items flagged for human decision

List each 🟠 REVIEW item / efficacy-adjacent line **verbatim**, with `file:line`,
why it is risky, and which signer must decide. These are surfaced, not rewritten.

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| | | | | ☐ |

## 3. Conditions of approval

Anything that must be true before/at ship (e.g. "strip reviewer HTML comment
blocks at PDF generation", "depends on CA-00X", "48h SLA contingent on Vitall").

## 4. Signature block — humans only

Approval requires **all** required signers. A signer writes their own name and
date. Until every required row is signed, the register stays PENDING.

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | | | | |
| Business (Keith) | | | | |
| Contractual (Solicitor) | | | | |

## 5. Outcome

- Final decision: `<APPROVED / REJECTED / SUPERSEDED>`
- Register updated: `<YYYY-MM-DD>`
- Notes: `<links to follow-up, superseding version, or rejection reasons>`
