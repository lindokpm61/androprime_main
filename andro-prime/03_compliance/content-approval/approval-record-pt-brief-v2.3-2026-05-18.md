# Approval Record — PT-Brief-v2.3.md (v2.3)

| Field | Value |
|---|---|
| Register ID | CA-001 |
| Artefact path | `06_marketing/affiliates/briefs/PT-Brief-v2.3.md` |
| Version | v2.3 |
| Content type | Partner brief (external-facing, partner-distributed) |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-18 |
| Required signers | Ewa + Keith + **Solicitor** |

## 1. Pre-flight evidence

- Command: `node .claude/skills/compliance-preflight/scan.js <file>`, run 2026-05-18.
- Result: 0 HARD after the single real fix logged on ClickUp 41 (a stray ingredient name in a reviewer comment in the gym file, removed). Remaining scanner hits across the brief set are prohibition lists / attestation negations quoting banned terms to forbid them — compliance instruction text, correctly retained, not violations.
- Judgement pass: done vs `03_compliance/CONTEXT.md` — EFSA wording, Phase-0 boundary, silent-ingredient (name confirmed absent — no-name allowlist approach), FM-CTA gate, retest framing.

## 2. Flagged items — decisions taken

| Item | Risk / rule | Decision (2026-05-18) |
|---|---|---|
| "reserved early-access TRT slot" reward (Gold / PT-of-the-Year) | Forward-looking inducement tied to a not-yet-live regulated service (Phase-0 boundary) | **Reworded** to "a priority place on the TRT launch waitlist when we go live." Applied to PT-Brief §tier table + contests; propagated to commission-structure.md, pt-programme.md, influencer-programme.md for source-of-truth consistency. |
| "typically within 48 hours" SLA | Contingent on Vitall written confirmation (task 18, not yet received) | **Approved with condition** (see §3): re-sweep the SLA-bearing briefs if Vitall confirms a different figure. Does not block. |
| No-name silent-ingredient approach (Section C + severe-violations line) | Net-new compliance design vs the old named approach | Affirmed by Ewa's clinical sign-off. |
| Ewa title "Medical Director" | Title accuracy | Affirmed. |
| New commission section §E + recoup/dispute wording | Net-new financial/contractual terms | **Solicitor review still required** — see §4. |

## 3. Conditions of approval

1. Reviewer HTML comment blocks (v2.2→v2.3 change logs) **must be stripped at PDF/DOCX generation**.
2. 48h SLA: if Vitall confirms a different SLA in writing (task 18), re-sweep PT-Brief / Influencer-Brief / Gym one-pager and re-record.
3. **Solicitor sign-off on the §E commission section + attestation clause 9 money wording is still outstanding** — this artefact is NOT fully approved and must not ship until the solicitor signs.

## 4. Signature block

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims | Dr Ewa Lindo | APPROVED | No-name silent-ingredient approach affirmed | 2026-05-18 |
| Business | Keith Antony | APPROVED-WITH-CONDITIONS | TRT-slot reworded (applied); 48h SLA condition logged | 2026-05-18 |
| Contractual | Solicitor | **PENDING** | §E commission + attestation clause 9 | — |

> Entered by Claude Code on Keith Antony's explicit instruction ("Ewa and I are signing off"), 2026-05-18. Ewa's sign-off is recorded on Keith's representation that she has approved — recommend Ewa countersign directly for the clinical record.

## 5. Outcome

- Final decision: **PENDING** — Ewa + Keith halves cleared; solicitor outstanding. Register row stays PENDING.
- Register updated: 2026-05-18.

## 6. Post-approval re-sweep log

| Date | Change | Trigger | Pre-flight delta | Sign-off status |
|---|---|---|---|---|
| 2026-05-26 | §"Permitted credibility-led framing" testimonial line updated: removed "GP-built report, GMC-registered prescriber" → "recommendation logic signed off by a GMC-registered GP". | Phase 0 boundary clarification ([[feedback-no-bespoke-clinician-interpretation]]): Ewa signs off the SYSTEM, not bespoke per-customer reports; Phase 0 has no prescribing. Same wording propagated from sitewide sweep (commit `abcd1ae`). | Scanner re-run on edited file shows 0 new HARD/REVIEW hits on line 75; aggregate totals unchanged (pre-existing prohibition-list pattern). Net: 2 banned phrasings removed, 0 introduced. | Re-edit reduces claim strength only. Does not require fresh Ewa sign-off per [[feedback-no-bespoke-clinician-interpretation]] rule. Flag to Ewa on next contact. Solicitor sign-off on §E commission section + clause 9 still outstanding — separate from this edit. |
