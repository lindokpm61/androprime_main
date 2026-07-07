# Compliance — Current State

Volatile status for the compliance workspace. Durable rules, the Pre-Flight Checklist, EFSA claims, and red-flag language are in `CONTEXT.md`. The full decision ledger is `content-approval/content-approval-register.md`; this file is the at-a-glance live status. Update the date on each change.

_Last updated: 2026-07-07._

---

## Content-approval status (live tally)

Source of truth for individual decisions: `content-approval/content-approval-register.md`. **The register's "As of 2026-06-04: 13 APPROVED, 2 PENDING" header line is itself stale** — CA-016 through CA-020 have since been filed. Current standing:

- **17 APPROVED / 3 PENDING** (CA-001 → CA-020).
- **Pending:**
  - **CA-001** (PT-Brief v2.3) — Ewa + Keith signed; **solicitor** §E commission clause outstanding.
  - **CA-002** (PT-Attestation v2.3) — Ewa + Keith signed; **solicitor** clause 9 outstanding.
  - **CA-017** (Newsletter Issue 002, "myth of the normal range") — awaiting **Ewa + Keith**; CIO broadcast build + send gated on sign-off.

> "APPROVED" in the register means **copy-approved**, not shipped. Only a named human sets a row to APPROVED — never automation.

## Approved but still gated (copy-approved ≠ live)

- **CA-006** (partner activation comms) — copy only; build/activation gated on isolated CIO partner space, Attio→CIO sync, e-sign, FirstPromoter, and CA-001/003.
- **CA-011** (Phase 0a partner broadcast) — approved; broadcast still gated on CA-006 build.
- **CA-012** (Newsletter Issue 001, CRP) — approved; send gated on go/no-go + subscriber-list accrual.
- **CA-014 / CA-015** (low-T nurture consent copy + seq-03b) — approved; activation gated on migration + Customer.io DPA/SCCs + sequence build; seq-03b builds as **DRAFT only**, activation a separate go/no-go.
- **CA-018** (health-data processing consent, Consent A) — **Half 1** built at checkout 2026-06-23, prod migration applied, **deploy pending**. **Half 2** (clinical opt-in) held pending solicitor CQC-recruiting question.
- **CA-019** (kit collection instructions) — approved; ship gated: push live **before** Vitall customer-emails disabled; CIO re-upload as DRAFT; Vitall per-kit protocol confirmation (Ben thread).
- **CA-020** (seq-03c/03d testosterone-value reword) — applied + live as draft templates; seq-03c activation-ready; **seq-03d stays draft** pending trigger redesign.

## Low-T routing (verified live)

Low-T (<12 nmol/L) result routing changed 2026-06-04 to **GP referral, no upsell** + consent-gated nurture (CA-013 result-card copy, CA-014 consent UI, CA-015 seq-03b). Verified live in `09_website-app/frontend/lib/results/classifier.ts`. Superseded the prior TRT-service + founding-member-queue pitch. Solicitor confirmation of the nurture lawful basis is **deferred to post-launch** (ClickUp `869d99kzh`; Keith interim-approved 2026-06-04).

**GP-framing sweep done 2026-07-07** — "GP-built report"/"personalised report" removed from live docs and site strings per the "Ewa signs off the system" ruling; the `clinical-governance-copy-corrections.md` conflict (it re-proposed "GP-built report") is resolved with a dated ruling note. Standard chip **"GP-designed report" pending Ewa confirmation**. Escalated: v2.4 brief corrections (`06_marketing/affiliates/briefs/v2.4-framing-corrections.md`, bundle with parked CA-001/002), blog MDX bylines (CA-011 verb framing flagged), Keith's LinkedIn posts 1/2/4, canonical-site testimonial "interpreted by doctors". Changed site strings (`app/(marketing)/page.tsx`, `canonical-site/home/index.html`) need a deploy to take effect. Preflight on changed strings: 0 HARD / 2 REVIEW (both pre-existing "Harley Street TRT-trained" credential text).

**Doc-layer sweep completed 2026-07-07** — all live-rule docs corrected or SUPERSEDED-bannered (29 files; report: `04_products/results-engine/2026-06-04-low-t-routing-decision-sweep-report-2026-07-07.md`). Escalations still open: `06_marketing/content/linkedin/keith-launch-posts-v1.md` Post 5 FM-scarcity line (Keith, review note added in-file); `privacy/privacy-policy.md` still advertises the FM list at ~33/37/90/117 (Keith + Ewa, legal doc — launch-blocking, untouched by the sweep); `brand-licence/inter-company-brand-licence.md` L86 "founding member deposits" (solicitor, pre-flagged in-file).

## DPIA — outstanding actions before launch

From `dpia/phase0-dpia.md` §5. Done: **ICO registration ZC172852** (2026-06-12); **Vitall controller-to-controller agreement executed 2026-06-02**. Still open:

- Confirm Supabase data-centre location is UK/EU — **Pending**.
- Health-data consent checkbox (CA-018) — built at checkout, migration applied, **deploy pending**.
- Backfill: pre-existing / guest customers hold no `health_processing_consent_version` — decide whether retained results need a separate consent touch — **Pending**.
- Separate Art 9(2)(a) opt-in for low-T storage + nurture — **Pending (gates nurture activation)**.
- Update privacy policy to describe the low-T nurture purpose + lawful basis — **Pending**.
- Data-deletion workflow (manual acceptable for launch) — **Pending**.
- Confirm all biomarker panels exclude unstable postal markers — **In progress** (panel builder; Keith/Ewa).
- Solicitor confirmations (checkout lawful basis; low-T nurture) — **Deferred** (Keith interim-approved).

## Deposits

- Founding-member **£75 deposit shelved 2026-05-08**; FM is now a non-cash email opt-in (page taken down 2026-06-04, dormant).
- Supplement Gate-0A: **deposit mechanic shelved 2026-05-08** — counted by first paid subscription invoice (per `10_launch-ops/implementation-checklists/qa-gates.md`).

## Known gaps / owed (compliance-doc hygiene)

- **`pre-launch-checklist.md` — DRAFT assembled 2026-07-02** (consolidates qa-gates Gates 1–5 + 0A, the approval register, and DPIA §5). **Pending Keith/Ewa ratification** before it governs go-live.
- **DPIA internal contradiction (unreconciled):** §4 risk row still says "Customer.io is US-based: UK IDTA standard contractual clauses to be executed before launch," while §5 and the processor table conclude the DPA (EU SCCs + UK Addendum) + DPF UK-Extension cert mean **no separate IDTA is needed**. Reconcile the risk row.
- **Missing directories referenced by `CONTEXT.md`:** `deletion-policy/` and `lab-partner-data-governance/` do not exist on disk; the Vitall DSA / sub-processor schedule currently lives only as prose in the DPIA.
- **`deposits/supplement-pre-order-terms.md` is stale** — dated April, still deposit-based with `[£TBC]` prices, not reconciled with the 2026-05-08 deposit shelving or the supplements-deferred plan.
