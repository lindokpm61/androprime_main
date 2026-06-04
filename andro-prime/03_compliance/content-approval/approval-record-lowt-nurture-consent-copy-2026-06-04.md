# Approval Record — Low-T nurture consent opt-in copy (v1)

| Field | Value |
|---|---|
| Register ID | CA-014 |
| Artefact path | `09_website-app/frontend/components/results-engine/LowTNurtureConsent.tsx` (on-card opt-in label + confirmation message) |
| Version | `2026-06-04-v1` (matches `LOWT_NURTURE_CONSENT_VERSION` in `app/api/lowt-nurture/consent/route.ts`) |
| Content type | Customer-facing consent UI (results-engine opt-in, special-category data) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-04 |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 09_website-app/frontend/components/results-engine/LowTNurtureConsent.tsx 09_website-app/frontend/app/api/lowt-nurture/consent/route.ts`
- **Run date:** 2026-06-04
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 0`
- **Judgement pass:** done — no `diagnose`/`treat`/`cure`/"You have…"; **no TRT or "available now" claim** (uses the permitted "future men's health service, including when it becomes available" framing); no EFSA ingredient claim / silent-ingredient absent; not a founding-member CTA; explicit, un-bundled, un-pre-ticked opt-in with unsubscribe/withdrawal stated; no em dashes.
- **Disposition of every HARD hit:** none (0 HARD).

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| LowTNurtureConsent.tsx (opt-in label) | "Keep my result on file and email me occasional updates about Andro Prime's future men's health service, including when it becomes available. This is optional, I can unsubscribe any time, and I consent to Andro Prime processing my testosterone result for this purpose." | Explicit Art 9(2)(a) consent wording for special-category data; future-service framing must stay pre-CQC-safe. | Ewa (clinical) | ☑ APPROVED |
| LowTNurtureConsent.tsx (confirmation) | "Thanks. We have your consent on file and will keep you informed. You can unsubscribe from any email we send, or ask us to remove you at any time." | Post-consent confirmation — withdrawal/right-to-erasure signposting. | Ewa (clinical) | ☑ APPROVED |

## 3. Conditions of approval

- Lawful basis + conditions: `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md` (Keith interim-approved Art 6(1)(a) + 9(2)(a); solicitor review deferred post-launch).
- The on-screen wording is version-locked to `LOWT_NURTURE_CONSENT_VERSION = '2026-06-04-v1'`. Any wording change requires a new version string AND a fresh CA record (the stored consent record must point at exactly what was shown — Art 7(1)).
- **Copy approval only — NOT a ship/activation authorisation.** Deploy still gated on: migration applied to prod, UK IDTA/SCCs + special-category DPA with Customer.io before the `low_testosterone` trait transfers, and the nurture sequence itself (separate CA when drafted).

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | recorded on Keith's representation — countersignature recommended for the clinical record | 2026-06-04 |
| Business (Keith) | Keith Antony | APPROVED | "consent copy approved" | 2026-06-04 |
| Contractual (Solicitor) | n/a | not required for copy | low-T nurture lawful basis tracked separately (solicitor deferred post-launch) | — |

## 5. Outcome

- Final decision: **APPROVED** (copy)
- Register updated: 2026-06-04
- Notes: Copy already in the tree (`7ad2c8f`); closes item #2 of the low-T Ewa sign-off list. Remaining low-T Ewa item: the nurture **sequence** emails (CA when built). Activation gates (migration, Customer.io DPA/SCCs, sequence build) tracked in `04_products/results-engine/2026-06-04-low-t-routing-decision.md`.
