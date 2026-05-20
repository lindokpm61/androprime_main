# Content Approval Register

The master ledger of external-facing content submitted for compliance sign-off.
Read `README.md` first. **CONTEXT.md is the law; this file records decisions
only. Only a named human sets a row to APPROVED — never Claude/automation.**

**Legend — Decision:** `PENDING` (awaiting one or more signers) · `APPROVED`
(all required signers signed; name + date in the record) · `REJECTED` (sent
back; see record) · `SUPERSEDED` (replaced by a later version).

**As of 2026-05-20: 6 APPROVED (copy), 2 PENDING (solicitor outstanding).**
Ewa + Keith signed off CA-003 through CA-007 on 2026-05-18 (transcribed on
Keith's explicit instruction; Ewa's sign-off recorded on Keith's representation
— countersignature recommended for the clinical record). CA-008 (FM CTA
language) APPROVED 2026-05-20 — Ewa's direct written clinical sign-off on the
softened seq-03b Email 2/3/5 text received by email; closes compliance
blocker #3. CA-001/002 await the solicitor money clause. APPROVED here means
copy-approved — see each record for ship/build conditions (PDF comment-block
strip, 48h-SLA re-sweep, CIO build gating).

| ID | Artefact | Type | Ver | Pre-flight | Required signers | Decision | Record |
|---|---|---|---|---|---|---|---|
| CA-001 | `06_marketing/affiliates/briefs/PT-Brief-v2.3.md` | Partner brief | v2.3 | 2026-05-18 · 0 HARD | Ewa + Keith + Solicitor | 🟠 PENDING (Ewa+Keith signed; **solicitor** outstanding) | `approval-record-pt-brief-v2.3-2026-05-18.md` |
| CA-002 | `06_marketing/affiliates/briefs/PT-Attestation-v2.3.md` | Attestation | v2.3 | 2026-05-18 · 0 HARD | Ewa + Keith + Solicitor | 🟠 PENDING (Ewa+Keith signed; **solicitor** outstanding) | `approval-record-pt-attestation-v2.3-2026-05-18.md` |
| CA-003 | `06_marketing/affiliates/briefs/Influencer-Brief-v2.3.md` | Partner brief | v2.3 | 2026-05-18 · 0 HARD | Ewa + Keith | ✅ APPROVED (cond: SLA re-sweep; strip comments at PDF) | `approval-record-influencer-brief-v2.3-2026-05-18.md` |
| CA-004 | `06_marketing/affiliates/briefs/Influencer-Attestation-v2.3.md` | Attestation | v2.3 | 2026-05-18 · 0 HARD | Ewa + Keith | ✅ APPROVED (cond: strip comments at PDF) | `approval-record-influencer-attestation-v2.3-2026-05-18.md` |
| CA-005 | `06_marketing/affiliates/briefs/Gym-Partnership-Onepager-v2.3.md` | Partner one-pager | v2.3 | 2026-05-18 · 0 HARD | Ewa + Keith | ✅ APPROVED (cond: SLA re-sweep; strip comments at PDF) | `approval-record-gym-onepager-v2.3-2026-05-18.md` |
| CA-006 | `06_marketing/affiliates/partner-activation-comms.md` | Partner email sequence copy | v1 draft | 2026-05-18 · clean, 1 REVIEW | Ewa | ✅ APPROVED (copy only — **not** a ship/build authorisation) | `approval-record-partner-activation-comms-2026-05-18.md` |
| CA-007 | `02_brand/prohibited-terms.md` | Compliance reference (Keith↔Ewa agreed list) | draft | 2026-05-18 · rulebook-quoting exception; silent-ingredient name absent | Keith + Ewa | ✅ APPROVED — closes blockers #2 & #48 | `approval-record-prohibited-terms-2026-05-18.md` |
| CA-008 | FM CTA language (seq-03b + T-04 + /founding-member page + ResultConvert) | Customer-facing FM CTA / clinical-adjacent | current | 2026-05-18 · non-cash PASS; clinical TRT claims **softened** (Keith "all three"); landing/JoinForm/status/ResultConvert pre-flighted **PASS 0 HARD** | Keith + Ewa (clinical) | ✅ APPROVED 2026-05-20 — Ewa's direct written clinical sign-off on softened seq-03b Email 2/3/5 received by email; closes blocker #3 | `approval-record-fm-cta-language-2026-05-18.md` |

## Notes / conditions

- **CA-001/002 are NOT fully approved.** Ewa + Keith signed their halves
  2026-05-18; the **solicitor** must still sign the §E commission section
  (PT-Brief) and attestation clause 9 (PT-Attestation) before they ship.
- **Deltas resolved at sign-off (2026-05-18):**
  - "reserved early-access TRT slot" reward → **reworded** to "a priority place
    on the TRT launch waitlist when we go live"; applied to PT-Brief and
    propagated to commission-structure.md / pt-programme.md /
    influencer-programme.md for source-of-truth consistency.
  - PT-Attestation clause 10 deposit reference → **removed** (softened wording).
  - 48h SLA → approved **with condition**: re-sweep CA-001/003/005 if Vitall
    confirms a different SLA in writing (task 18).
  - prohibited-terms §6 → recommended answers adopted: de-named in 02_brand,
    CONTEXT.md the named law, inflated-discount HARD rule added to `scan.js`.
- **CA-006 is copy-approved only.** Build/activation remain gated on the
  isolated CIO partner space, Attio→CIO sync, e-sign mechanism, FirstPromoter,
  and CA-001/003 approval for the brief link. Not a ship authorisation.
- **PDF/DOCX generation** of CA-001…005 must strip the reviewer HTML comment
  blocks (instruction is in each `.md`).
- Clinical data sign-offs that are not copy (biomarker thresholds, Kit 3
  combined-result rule) are tracked in outstanding-tasks / ClickUp, not here.

*Created 2026-05-18 · Updated 2026-05-20 (CA-008 APPROVED on Ewa's direct clinical sign-off; closes blocker #3) · Owner: Keith Antony · Law: `03_compliance/CONTEXT.md`.*
