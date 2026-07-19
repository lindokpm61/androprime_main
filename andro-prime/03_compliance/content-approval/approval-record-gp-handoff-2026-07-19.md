# Approval Record: CA-023 GP handoff summary (F3 / U1)

**Artefact:** `09_website-app/frontend/app/(app)/results-dashboard/handoff/page.tsx` (the printable one-page GP summary: identity block, UKAS ISO 15189 accreditation line, per-kit marker table with reference ranges, "Questions to ask your GP", and the not-a-diagnosis disclaimer using the "Ewa-approved recommendation logic" framing). Dark behind `GP_HANDOFF_ENABLED` (default OFF).
**Type:** Customer-facing results wording (advocacy handoff to the customer's own GP; no clinical claim, no diagnosis).
**Version:** 2026-07-19-v1

**Pre-flight:** 2026-07-19 via `.claude/skills/compliance-preflight/scan.js`. **0 HARD / 0 REVIEW.** The three scanner hits were all «diagnosis» inside the not-a-diagnosis disclaimer (negation context, compliant). Judgement pass: no EFSA/efficacy claim; Phase 0 boundary held (no prescribing, no TRT); the accreditation line states "UKAS ISO 15189 accredited laboratory" per the Vitall agreement wording (no UKAS symbol); the disclaimer explicitly says the reading comes from Andro Prime's recommendation logic, not from a doctor's review of the individual case.

**Required signers:** Ewa (clinical / results copy) + Keith (business).

**Decision:** APPROVED 2026-07-19. Ewa (clinical) approved the template wording, reading it in-session; reported by Keith (countersignature recommended for the clinical record, per the standing register convention). Keith (business) approved.

**Conditions (copy approval only; the feature is NOT authorised to go live):** turning `GP_HANDOFF_ENABLED` on is a separate deliberate go/no-go (a production env change). The feature is byte-inert until then.

**Related:** plan `09_website-app/docs/2026-07-17-bucket-ab-implementation-plan.md`; sign-off gate ClickUp `869e66u2y`; sibling records CA-024 (account data controls), CA-025 (kit-scope note).
