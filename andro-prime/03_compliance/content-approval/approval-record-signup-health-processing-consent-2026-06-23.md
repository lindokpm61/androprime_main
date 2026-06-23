# Approval Record — Signup wellness health-data processing consent (v1)

| Field | Value |
|---|---|
| Register ID | CA-018 |
| Artefact path | `09_website-app/frontend/components/commerce/CheckoutDetailsForm.tsx` (required Consent A checkbox at checkout) |
| Version | `2026-06-23-v1` (matches `HEALTH_PROCESSING_CONSENT_VERSION` in `lib/auth/consentVersions.ts`) |
| Content type | Customer-facing consent UI (checkout / point of purchase, special-category / health data) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-23 |
| Required signers | Ewa (clinical) + Keith (business) |
| Source | ClickUp task 34 (`869d99m8m`), Half 1 — proposal `03_compliance/2026-06-23-signup-clinical-optin-consent.md` |
| Placement note | Wording approved as drafted; **placement is at checkout (point of purchase)**, not behind the results dashboard. An earlier same-day build placed it as a post-login gate and was reverted — gating already-paid results on consent breaches "freely given". Same approved wording, so the version string is unchanged. |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 09_website-app/frontend/app/auth/consent/page.tsx 09_website-app/frontend/lib/auth/actions.ts 09_website-app/frontend/lib/auth/consentVersions.ts`
- **Run date:** 2026-06-23
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 0`
- **Judgement pass:** done — no `diagnose`/`treat`/`cure`/"You have…"; no TRT, no clinical service, no "available now" claim (Consent A is wellness processing only); no EFSA ingredient claim / silent-ingredient absent; not a founding-member CTA; "customer ≠ patient" (no "patient" in copy); explicit, un-bundled, un-pre-ticked; links to the privacy policy; no em dashes.
- **Disposition of every HARD hit:** none (0 HARD).

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| consent/page.tsx (Consent A label) | "I consent to Andro Prime processing my health information, including my test results and the answers I provide, to run my test service and show me my results. How we use your data." | Explicit Art 9(2)(a) consent wording for special-category (health) data; must stay wellness-only and Phase-0-safe. | Ewa (clinical) | ☑ APPROVED |

## 3. Conditions of approval

- The on-screen wording is version-locked to `HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'`. Any wording change requires a new version string AND a fresh CA record (the stored consent record must point at exactly what was shown — Art 7(1)).
- **Lawful basis is interim-approved by Keith** (Art 6(1)(b) contract + Art 9(2)(a) explicit consent). Solicitor confirmation of the §8 questions in the proposal — in particular the freely-given tension on a *required* Art 9 consent — is **deferred**, overlapping task #06 (`869d99kzh`). Same posture as CA-014.
- **Copy approval only — NOT a ship/activation authorisation.** Deploy still gated on: migration `20260623_users_health_processing_consent.sql` applied to prod; privacy policy + `dpia/phase0-dpia.md` updated for this consent flow; backfill decision for pre-existing accounts (which never saw this gate).
- Scope: this record covers **Consent A only**. Half 2 (the future-clinical-services opt-in) is held pending the solicitor CQC-recruiting question and will take its own CA record when cleared.

## 4. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | recorded on Keith's representation — countersignature recommended for the clinical record | 2026-06-23 |
| Business (Keith) | Keith Antony | APPROVED | "approved Half 1" | 2026-06-23 |
| Contractual (Solicitor) | n/a | not required for copy | lawful-basis confirmation deferred (overlaps task #06) | — |

## 5. Outcome

- Final decision: **APPROVED** (copy)
- Register updated: 2026-06-23
- Notes: Half 1 built at **checkout** (`CheckoutDetailsForm` → `/api/checkout/kit` enforce + Stripe metadata → Stripe webhook stamp), migration applied to prod, typecheck + `next build` clean. The earlier post-login gate was reverted. Half 2 held. See proposal `03_compliance/2026-06-23-signup-clinical-optin-consent.md` for the full model + deploy gates.
