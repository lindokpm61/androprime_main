# Approval Record: CA-025 Kit-scope note (F5)

**Artefact:** `09_website-app/frontend/components/results-engine/KitTabs.tsx` (the "WHAT THIS TEST DID NOT TELL YOU" paragraph, shown only on a normal-testosterone Kit 1 result). Dark behind `KIT_SCOPE_NOTE_ENABLED` (default OFF).
**Type:** Customer-facing results wording (scope / limits note enforcing the Kit 1 testosterone-only rule).
**Version:** 2026-07-19-v1

**Pre-flight:** 2026-07-19 via `.claude/skills/compliance-preflight/scan.js`. **0 HARD / 0 REVIEW** (clean, no hits). Judgement pass: enforces the 03_compliance Kit 1 scope rule (Kit 1 measures testosterone only, never framed as explaining general fatigue); no efficacy / EFSA claim; the Kit 2 pointer is framed as scope, not upsell ("if low energy or recovery is your concern, the Energy & Recovery Check looks at those markers").

**Required signers:** Ewa (clinical / results copy) + Keith (business). The task gate names "compliance pre-flight"; recorded with clinical sign-off for parity with the sibling results-wording records.

**Decision:** APPROVED 2026-07-19. Ewa approved the paragraph in-session (reported by Keith; countersignature recommended). Keith (business) approved. Pre-flight clean.

**Conditions (copy approval only):** flipping `KIT_SCOPE_NOTE_ENABLED` on is a separate go/no-go (production env change).

**Related:** plan doc 2026-07-17; ClickUp `869e66u2y`; sibling records CA-023, CA-024.
