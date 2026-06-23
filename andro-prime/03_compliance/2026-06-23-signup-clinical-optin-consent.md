# Signup consent — broaden for wellness processing + future clinical opt-in

**Status:** Half 1 (Consent A) APPROVED + BUILT (working tree, not deployed) — Ewa + Keith, 2026-06-23, CA-018. Half 2 (Consent B) HELD pending solicitor CQC-recruiting question. See §9.
**Date:** 2026-06-23
**Owner:** Keith + Dev
**Reviewers required:** Dr Ewa Lindo (clinical/claims) + solicitor (lawful basis + CQC recruiting question)
**ClickUp:** Task 34 (`869d99m8m`) — "Signup flow consent broadens to allow downstream clinical opt-in (V7 multi-vertical optionality)"
**Source strategy:** V7 repositioning (patient-owned data, multi-vertical optionality) — see `02_brand` / `project_brand_v7_repositioning`
**Pattern reference:** low-T nurture explicit opt-in — `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`, `components/results-engine/LowTNurtureConsent.tsx`, `app/api/lowt-nurture/consent/route.ts` (CA-014)

---

## 1. Why this exists

The signup consent page today captures only **age (18+ gate)** and **one marketing checkbox** (`users.marketing_consent`). See `app/auth/consent/page.tsx` + `consentAction` in `lib/auth/actions.ts`.

Task 34 asks for two things:

1. **Wellness health-data processing consent** made explicit at signup (today it is not a captured, explicit consent — it leans on privacy-policy acceptance elsewhere in the journey).
2. **An explicit, optional opt-in for future clinical services** (TRT post-CQC, and later verticals), so willing customers can be contacted when those launch, captured separately and revocably.

This document proposes the consent model, the exact copy, the data model, and the build, and flags the legal questions that gate it.

---

## 2. The headline compliance risk (read first)

Half 2 builds a **pre-CQC list of people who have expressed interest in TRT**. That is adjacent to the same CQC/ASA "recruiting an undocumented subscriber base before registration" risk that keeps the Founding-Member list **Kit-1-dashboard-only and T < 12 nmol/L gated** (see `feedback_fm_list_not_in_content`, CONTEXT.md Special Cases).

**This opt-in is broader than the FM mechanic** — it would sit at signup, open to everyone, ungated by any test result. Whether that is permissible at all before CQC registration is a **solicitor decision**, not a copy decision. The proposed mitigations (future-tense "when we launch" framing, "not available yet", no clinical processing now, explicit + withdrawable consent, kept entirely separate from the FM list) are necessary but may not be sufficient. **Do not build Half 2 until the solicitor clears the recruiting question.** Half 1 can likely proceed independently.

The two halves are therefore separable and should be approved separately.

---

## 3. Proposed consent model — three distinct, unbundled items

Each item is its own decision. None pre-ticked except where noted. None bundled into another.

| # | Consent | Required? | Lawful basis (for solicitor confirmation) | Where stored |
| --- | --- | --- | --- | --- |
| A | Wellness health-data processing (test results + answers, to deliver the service) | Required to use the service | Art 6(1)(b) contract **+** Art 9(2)(a) explicit consent | `users.health_processing_consent_version` + `..._at` |
| B | Future clinical-services interest (TRT etc.) | **Optional**, unticked | Art 6(1)(a) consent **+** Art 9(2)(a) explicit consent (interest in TRT can imply health status) | new `clinical_interest_consent` table |
| C | Marketing/educational emails (existing) | Optional, unticked | Art 6(1)(a) consent / PECR | `users.marketing_consent` (unchanged) |

Notes for the solicitor:
- **A "required consent" tension:** Art 9 cannot ride on "necessary for the contract"; a special-category condition is needed on top of Art 6, and Art 9(2)(a) explicit consent is the cleanest Phase 0 route. But consent must be freely given, and a consent that is a precondition of the service is in tension with that. Please confirm whether Art 9(2)(a) is the right condition here, or whether another condition / framing is preferred. This overlaps the deferred lawful-basis task (#06, `869d99kzh`).
- **B special-category treatment:** even though B is an expression of future interest rather than processing of a result, linking a named individual to "interested in TRT" can reveal health status. We propose treating B as Art 9(2)(a) explicit consent to be safe. Confirm.

---

## 4. Draft copy (customer-facing — version-locked)

House style: no em dashes, plain English, 18+, future services described only as "when they launch" / "not available yet". `customers ≠ patients` (do not use "patient" in customer-facing copy — V7 internal-only term).

### A. Wellness health-data processing (required checkbox, blocks submit until ticked)

> I consent to Andro Prime processing my health information, including my test results and the answers I provide, to run my test service and show me my results. [How we use your data]

### B. Future clinical-services interest (optional, unticked)

> Optional: I would like to hear about Andro Prime's future clinical services, including testosterone replacement therapy (TRT), when they launch. These services are not available yet. This is optional, separate from my test service, and I can withdraw at any time.

### C. Marketing/educational emails (existing copy, unchanged)

> I'm happy to receive Andro Prime updates and educational emails.

**Confirmation-state copy for B** (after save, mirrors low-T pattern):

> Thanks. We have your consent on file and will let you know when these services launch. You can withdraw at any time.

Red-flag check against CONTEXT.md table: no "diagnose / treat / cure"; "TRT ... when they launch" uses the permitted "be first when we launch" framing, not "available now"; no prescription implied; no FM-list / deposit reference. **"clinical services" is used rather than "treatment services"** to avoid the "treatment" medicinal-claim flag.

---

## 5. Data model

Mirror the low-T pattern (dedicated, versioned, withdrawable record) for B; a versioned stamp on `users` for A.

### New table — `clinical_interest_consent`
```
id                uuid pk default gen_random_uuid()
user_id           uuid null  (FK auth.users)        -- guest-safe, like lowt_nurture_consent
email             text not null
consent_version   text not null
source            text not null default 'signup'
consented_at      timestamptz not null default now()
withdrawn_at      timestamptz null
```
Idempotent on active (non-withdrawn) email, exactly as `app/api/lowt-nurture/consent/route.ts`.

### `users` additions (for A)
```
health_processing_consent_version  text null
health_processing_consented_at     timestamptz null
```

### Version constants — `lib/auth/consentVersions.ts`
```
export const HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'
export const CLINICAL_INTEREST_CONSENT_VERSION = '2026-06-23-v1'
```
(Lives outside `route.ts` for the same `next build` route-export reason noted in `lib/results/lowtNurtureConsent.ts`. Bump the version whenever the copy changes — Art 7(1) accountability; the stored record must point at exactly the wording shown.)

---

## 6. Component & wiring plan

- **`app/auth/consent/page.tsx`** — add checkbox A (required) and checkbox B (optional, unticked) above the existing marketing checkbox C. A blocks submit until ticked (client `required` + server re-check).
- **`consentAction` (`lib/auth/actions.ts`)** — already runs the 18+ server gate. Add: reject if A not present; write A's version + timestamp to `users`; if B ticked, insert into `clinical_interest_consent` (idempotent); keep writing C to `marketing_consent`.
- **Withdrawal path for B** — account settings toggle (sets `withdrawn_at`), matching the low-T withdrawable model. Not a launch blocker for capture, but required before any clinical-marketing send.
- **No CIO trait for B at capture time.** Unlike low-T (which sends a health trait on consent), B should NOT push any health-derived trait to Customer.io pre-CQC. Store the consent only. Wiring B into any campaign is a separate, post-CQC decision.

---

## 7. Boundary check (Phase 0 vs post-CQC)

- B describes TRT strictly as a future service ("when they launch", "not available yet"). No availability claim, no prescription implied. ✓
- B does not create any contractual right to a future service. ✓
- B is kept entirely separate from the Founding-Member list (which stays T < 12, Kit-1-dashboard-only). A signup opt-in must **not** write to the FM list. ✓
- No health claim, supplement claim, or Ashwagandha exposure. ✓
- Residual: the **existence** of a pre-CQC TRT-interest list is the open risk in §2.

---

## 8. Open questions for review

**For the solicitor:**
1. **CQC recruiting:** is an open, ungated pre-CQC "interested in future TRT" opt-in permissible at all? If conditional, on what conditions? (Gates Half 2 entirely.)
2. Is Art 9(2)(a) the correct condition for A, given the freely-given tension on a required consent? Preferred alternative framing if not?
3. Confirm B is treated as special-category (Art 9) and the wording is sufficient for explicit consent.
4. Retention + withdrawal handling for `clinical_interest_consent` (align with `deletion-policy/`).

**For Ewa:**
5. Sign-off on the A and B copy (claims/clinical tone), issuing CA records and locking each to its version string.

**For Keith:**
6. Approve Half 1 / Half 2 split and sequencing (recommend: ship Half 1 once solicitor confirms basis; hold Half 2 until the recruiting question clears).

---

## 9. Build & deploy gating

Copy approval is **not** a ship authorisation (same rule as CA-014).

### Half 1 — Consent A (wellness health-data processing) — APPROVED + BUILT 2026-06-23

- [x] Ewa + Keith copy sign-off — **CA-018** (`approval-record-signup-health-processing-consent-2026-06-23.md`); version-locked to `HEALTH_PROCESSING_CONSENT_VERSION = '2026-06-23-v1'`.
- [x] Code built in working tree (typecheck clean, pre-flight 0 HARD / 0 REVIEW): `app/auth/consent/page.tsx` (required checkbox), `lib/auth/actions.ts` (`consentAction` server gate + version stamp), `lib/auth/consentVersions.ts`, `lib/supabase/types.ts`, migration `database/migrations/20260623_users_health_processing_consent.sql`.
- [ ] **Solicitor** confirmation on §8 Q2 (Art 9(2)(a) on a *required* consent — freely-given tension). Keith interim-approved the basis; deferred, overlaps #06. Same posture as CA-014.
- [ ] Migration applied to prod (`users` columns).
- [ ] Privacy policy sub-section + DPIA (`dpia/phase0-dpia.md`) updated for this consent flow.
- [ ] **Backfill decision** for pre-existing accounts — they passed `/auth/consent` before this gate existed, so they have no `health_processing_consent_version`. Decide whether to re-prompt on next login or treat historically.
- [ ] Deploy (commit/push → Coolify). Build is staged but NOT deployed.

### Half 2 — Consent B (future clinical opt-in) — HELD

- [ ] **Solicitor** sign-off on §8 Q1 (CQC recruiting — gates Half 2 entirely) + Q3.
- [ ] Ewa CA record for B copy, version-locked.
- [ ] Migration for new `clinical_interest_consent` table.
- [ ] `data-controller-position.md` updated if B introduces any new processing/processor.
- [ ] Withdrawal path live before any clinical-marketing send.
- [ ] Not built — do not build until Q1 clears.

---

*Drafted by Claude for Keith, 2026-06-23. Legal determinations herein are proposals for the solicitor and Ewa to confirm, not advice.*
