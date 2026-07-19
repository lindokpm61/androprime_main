# Approval Record: CA-024 Account data controls (F4)

**Artefact:** `09_website-app/frontend/components/account/DataPrivacySection.tsx` (the "Data & privacy" section on `/account`: data-use statement, results CSV download, and erasure-request button) plus the wording surfaced by `app/api/account/erasure-request/route.ts`. Dark behind `ACCOUNT_DATA_CONTROLS_ENABLED` (default OFF).
**Type:** Customer-facing data-use statement + erasure-request UI (special-category data, UK GDPR).
**Version:** 2026-07-19-v1

**Pre-flight:** 2026-07-19 via `.claude/skills/compliance-preflight/scan.js`. **0 HARD / 0 REVIEW** after one benign-English hygiene edit applied pre-record: "we treat them as special-category data" changed to "we handle them as" (the scanner reads «treat» as a medicinal claim; "handle" is meaning-preserving, no claim change, same precedent as commit `71f30d3`). Judgement pass: the statement is factual against 03_compliance (health data = special category; Art 9(2)(a) explicit consent captured at checkout, see CA-018; EU/Ireland data residency; Vitall named as an independent controller per `data-controller-position.md` §4). The erasure copy is request-only and honest ("we will action your request within 30 days; some records, such as proof of purchase, may be kept where the law requires it"): it promises a request plus 30-day action, not instant deletion.

**Required signers:** Ewa (clinical / compliance read) + Keith (business).

**Decision:** APPROVED 2026-07-19. Ewa read and approved the data-use + erasure wording in-session (reported by Keith; countersignature recommended). Keith (business) approved the copy.

**Conditions (copy approval only; NOT a flag-flip authorisation):**
1. Before `ACCOUNT_DATA_CONTROLS_ENABLED` goes on, Keith must confirm the erasure ops-alert destination (the `OPS_ALERT_EMAIL` address that `emitOpsAlert` routes erasure requests to) and the 30-day SLA the copy commits to. The SLA is 30 days (now in the approved copy); the address is the outstanding operational confirmation.
2. This approves the erasure-REQUEST feature only. Automated deletion is NOT built and is NOT in scope here; it remains blocked on the empty `03_compliance/deletion-policy/` (retention rules owed: UK tax 6-year retention, Vitall independent-controller data, Stripe/CIO records keyed on email). Building automated deletion needs that policy first.
3. Flipping the flag on is a separate go/no-go (production env change).

**Related:** consent record CA-018 (health-processing consent at checkout); `03_compliance/data-controller-position.md` §4 and §4a; the deletion-policy blocker and sign-off gate in ClickUp `869e66u2y`; plan doc 2026-07-17.
