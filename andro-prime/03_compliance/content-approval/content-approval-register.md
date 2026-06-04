# Content Approval Register

The master ledger of external-facing content submitted for compliance sign-off.
Read `README.md` first. **CONTEXT.md is the law; this file records decisions
only. Only a named human sets a row to APPROVED — never Claude/automation.**

**Legend — Decision:** `PENDING` (awaiting one or more signers) · `APPROVED`
(all required signers signed; name + date in the record) · `REJECTED` (sent
back; see record) · `SUPERSEDED` (replaced by a later version).

**As of 2026-06-04: 12 APPROVED (copy), 3 PENDING (CA-001/002 solicitor; CA-015 low-T nurture sequence awaiting Ewa + Keith).** CA-015 (seq-03b low-T result + consented nurture, GP-referral rewrite) FILED PENDING 2026-06-04 — pre-flight 0 HARD / 6 REVIEW (all "TRT" in meta/build notes; body TRT-free); 1 wellbeing-adjacent line flagged for Ewa; supersedes CA-008 seq-03b on approval; build as DRAFT only. CA-014 (Low-T nurture consent opt-in copy) APPROVED 2026-06-04 — Ewa + Keith; pre-flight 0 HARD / 0 REVIEW; version-locked to `LOWT_NURTURE_CONSENT_VERSION`; copy-only, activation gated on migration + Customer.io IDTA/SCCs + DPA + sequence build. CA-013 (Low-T result-card GP-referral copy) APPROVED 2026-06-04 — Ewa approved the "speak to your GP" direction, Keith confirmed both sentences verbatim; pre-flight 0 HARD / 0 REVIEW on the two blocks; replaces the prior TRT-service + founding-member-queue pitch. CA-012 (Newsletter Issue 001, CRP) APPROVED 2026-05-31 — Keith + Ewa both agreed, recorded on Keith's in-session confirmation; pre-flight clean (0 HARD, 0 REVIEW); send gated on go/no-go + subscriber-list accrual (guest capture only fixed today). CA-011 (Phase 0a partner addendum + broadcast) APPROVED 2026-05-25 — Ewa direct written sight received same day from her own address at 23:50 UTC ("CA-011 signoff approval"); Keith approved on his own instruction. Pre-flight clean (0 HARD, 1 REVIEW cleared via judgement). Broadcast still gated on CA-006 build (partner channel). CA-009 + CA-010 approved by Ewa direct written sign-off received 2026-05-23 at 20:46 UTC from her own address; closes outstanding blocker #50 and unblocks the Phase 0a deploy chain.
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
| CA-009 | Supplement waitlist copy template + T-10 (Phase 0a) — covers `/supplement-waitlist`, `/supplements/*`, `/lp/*`, seq-03a/c/d Email 3, the SupplementWaitlistForm copy, and T-10 transactional | Customer-facing waitlist mechanic / lifecycle email | v1 (Phase 0a) | 2026-05-23 · 1 HARD (T-10 Ashwagandha in compliance-notes block — documented exception, same pattern as CA-008's seq-03b:11–12); 9 REVIEW (all documented or surfaced) | Keith + Ewa (clinical) | ✅ APPROVED 2026-05-23 — Ewa direct written sign-off received from `ewalindo@live.co.uk` at 20:46 UTC; Keith approved on his own instruction | `approval-record-supplement-waitlist-template-2026-05-23.md` |
| CA-010 | Kit 3 combined-result rule v1 (Phase 0a) — supersedes the 2026-05-18 v2 draft for Phase 0a; v2 will re-approve when supplements ship | Results-engine logic + customer-facing combined-result dashboard copy | v1 (Phase 0a) | 2026-05-23 · 2 HARD (both inside §7 compliance checklist quoting forbidden phrases to forbid them — internal, not customer-facing; same documented-exception pattern as CA-008); 5 REVIEW | Keith + Ewa (clinical) | ✅ APPROVED 2026-05-23 — Ewa direct written sign-off received from `ewalindo@live.co.uk` at 20:46 UTC; Keith approved on his own instruction. Closes outstanding blocker #50 | `approval-record-kit3-combined-result-rule-v1-2026-05-23.md` |
| CA-011 | Phase 0a partner addendum + broadcast — `06_marketing/affiliates/phase0a-supplements-deferred-addendum-2026-05-23.md` + `06_marketing/affiliates/partner-activation-phase0a-broadcast-2026-05-23.md` | Partner-facing addendum + partner broadcast email | v1 (Phase 0a) | 2026-05-24 · 0 HARD; 1 REVIEW (TRT word in addendum §6 meta-compliance block — cleared via judgement, same documented-exception pattern as CA-007/008/009/010) | Keith + Ewa (sight) — solicitor NOT required (no CA-001/002 money clause amendment, by design) | ✅ APPROVED 2026-05-25 — Ewa direct written sight received from `ewalindo@live.co.uk` at 23:50 UTC; Keith approved on his own instruction. Broadcast still gated on CA-006 build (partner channel) | `approval-record-phase0a-partner-addendum-2026-05-24.md` |
| CA-012 | Newsletter Issue 001 (CRP / inflammation) — `06_marketing/content/email/newsletter/issue-001-crp-blood-test.md`; cold-to-warm bridge editorial broadcast, reframed from the Ewa-approved `crp-blood-test.mdx` | Customer-facing editorial email (newsletter broadcast) | v1 | 2026-05-31 · 0 HARD; 0 REVIEW | Keith + Ewa (clinical) | ✅ APPROVED 2026-05-31 — Keith + Ewa both agreed; recorded on Keith's in-session confirmation (countersignature recommended for the clinical record). Send is a separate go/no-go; list near-empty until guest capture fix (`8274a0d`) accrues subscribers | `approval-record-newsletter-issue-001-crp-2026-05-31.md` |
| CA-013 | Low-T result-card recommendation copy (GP referral) — `09_website-app/frontend/lib/results/biomarker-copy.ts` (low-testosterone) + `classifier.ts` (`FT_LOW_WITH_LOW_T_RECOMMENDATION`) | Results-engine recommendation copy (customer-facing results wording) | v1 | 2026-06-04 · 0 HARD; 0 REVIEW on the two blocks (8 REVIEW elsewhere, unrelated) | Keith + Ewa (clinical) | ✅ APPROVED 2026-06-04 — Ewa approved the direction direct ("speak to your GP"); Keith confirmed both sentences verbatim. Replaces the prior TRT/FM-queue pitch (`99a31eb`). Routing deploy still subject to non-copy gates | `approval-record-lowt-card-gp-referral-copy-2026-06-04.md` |
| CA-014 | Low-T nurture consent opt-in copy — `09_website-app/frontend/components/results-engine/LowTNurtureConsent.tsx` (opt-in label + confirmation) | Customer-facing consent UI (special-category opt-in) | `2026-06-04-v1` | 2026-06-04 · 0 HARD; 0 REVIEW | Keith + Ewa (clinical) | ✅ APPROVED 2026-06-04 — Ewa + Keith. Version-locked to `LOWT_NURTURE_CONSENT_VERSION`. Copy approval only — activation gated on migration + Customer.io IDTA/SCCs + DPA + sequence build | `approval-record-lowt-nurture-consent-copy-2026-06-04.md` |
| CA-015 | seq-03b low-T result + consented nurture (GP-referral rewrite) — `09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md` | Customer-facing lifecycle email sequence (result notification + special-category nurture) | v2 | 2026-06-04 · 0 HARD (1 reworded out); 6 REVIEW (all "TRT" in meta/build notes — body TRT-free) | Keith + Ewa (clinical) | 🟠 PENDING — Ewa clinical sign-off (1 wellbeing-adjacent line flagged) + Keith. Supersedes CA-008 seq-03b on approval; build as DRAFT only | `approval-record-seq-03b-low-t-nurture-2026-06-04.md` |

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

*Created 2026-05-18 · Updated 2026-05-20 (CA-008 APPROVED on Ewa's direct clinical sign-off; closes blocker #3) · Updated 2026-05-23 (CA-009 + CA-010 added as one packet for the Phase 0a supplements-deferred adjustment — see `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`) · Updated 2026-05-23 (CA-009 + CA-010 APPROVED on Ewa's direct written sign-off; closes blocker #50; unblocks Phase 0a deploy chain) · Updated 2026-05-24 (CA-011 filed PENDING for the Phase 0a partner addendum + broadcast; pre-flight clean; awaits Keith + Ewa sight) · Updated 2026-05-25 (CA-011 APPROVED on Ewa's direct written sight + Keith's instruction) · Updated 2026-05-26 (CA-001 + CA-003 post-approval re-sweep — testimonial line "GP-built report, GMC-registered prescriber" replaced with "recommendation logic signed off by a GMC-registered GP" to align with no-bespoke-clinician-interpretation rule + Phase 0 no-prescribing boundary; claim reduction only, no fresh sign-off required; entries in each record §6) · Owner: Keith Antony · Law: `03_compliance/CONTEXT.md`.*
