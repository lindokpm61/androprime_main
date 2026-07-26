# Approval Record: CA-027 Bundle address-check email

**Artefact:** `09_website-app/frontend/email-templates/sequences/bundle-address-check.md` (Email 1, "Please confirm your delivery address"). Built as a DRAFT Customer.io campaign 2026-07-26: campaign `24` ("T-11 — Bundle Address Check"), email action `108`, template `55` (from Keith / identity 1).
**Type:** Customer-facing transactional email (delivery-address confirmation before the bundle second-kit auto-dispatch). No health claim, no result classification, no clinical content by design.
**Version:** v1 2026-07-26.

**Pre-flight:** 2026-07-26 via `.claude/skills/compliance-preflight/scan.js`. **0 HARD / 0 REVIEW** (clean). Copy also run through `/stop-slop` (active voice throughout; removed passive "about to be prepared for dispatch", the "review and update" doublet, "currently on your account" padding, and the filler "just"). No em dash. Liquid lint 0 errors (local + live CIO body); no `{% if %}` branches, so no test-send gate. Judgement pass: pure logistics; the only CTA links to `/account`; "4 days" mirrors `ADDRESS_CHECK_WINDOW_DAYS` in `lib/bundles/config.ts`.

**Required signers:** Ewa (clinical / compliance) + Keith (business).

**Decision:** APPROVED 2026-07-26. Ewa + Keith approved the copy (reported by Keith in-session; countersignature recommended for the clinical record).

**Conditions (copy approval only):** the campaign stays DRAFT. Activation is a separate go/no-go gated on `BUNDLES_ENABLED` and `ACCOUNT_ADDRESS_ENABLED` being live in Coolify (else the CTA lands on an account page without the address section).

**Live status:** DRAFT, not activated. Bundles remain dark behind `BUNDLES_ENABLED`.

**Related:** bundle go-live checklist in `09_website-app/STATE.md` (item #7); address-update surface #8 (dark behind `ACCOUNT_ADDRESS_ENABLED`); ClickUp `869e74vwz`.
