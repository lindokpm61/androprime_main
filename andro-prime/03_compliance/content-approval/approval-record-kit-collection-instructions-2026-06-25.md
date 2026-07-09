# Approval Record — Kit collection instructions (no-fast fix + timing/logistics rules)

| Field | Value |
|---|---|
| Register ID | CA-019 |
| Artefact path | `09_website-app/frontend/email-templates/transactional/transactional-emails.md` (T-01, T-02) · `09_website-app/frontend/email-templates/sequences/seq-02-post-purchase.md` (Email 2) · mirrored HTML: `html/transactional-t01-order-confirmed.html`, `html/transactional-t02-kit-dispatched.html`, `html/seq-02-email-2-sample-instructions.html` |
| Version | `2026-06-25-v1` |
| Content type | Lifecycle/transactional email — sample-collection instructions (pre-analytical) |
| Submitted by | Keith |
| Submitted date | 2026-06-25 |
| Required signers | Ewa (clinical — result-validity logic) + Keith |

## Background

Triggered by a live E2E Kit 1 test order: Vitall sent its own branded customer
email. Decision is to disable Vitall's customer-facing emails (operational
request sent to Ben Starling, separate) and own all customer comms ourselves.
That surfaced that Vitall's email carried four collection-critical instructions
we did not communicate, plus one we contradicted. This record covers closing
that gap before Vitall's email is switched off.

## Changes approved

1. **Fasting instruction removed (all kits).** Prior copy said "fast first thing,
   this is the most important step." No marker in any panel (testosterone, Active
   B12, hs-CRP, albumin, vitamin D, ferritin) is fasting-dependent. Replaced with
   "No need to fast." Matches Vitall's own Kit 1 instruction.
2. **Logistics rules added (all kits):** collect Monday–Friday; post the same day
   you collect. Framed as the rules that decide whether a sample is usable.
3. **Hormone-kit-only rules**, Liquid-branched on
   `event.kit_type == 'testosterone' or 'hormone-recovery'`: collect 7–10am
   (testosterone diurnal peak); 72-hour washout from hormone creams/gels/sprays +
   keep away from the collection hand (contamination). Not shown for
   `energy-recovery` (Kit 2 — no testosterone).
4. **Safety valves added** (T-01, T-02): "Kit not arrived within 7 days? Reply and
   we'll send a replacement, no charge."

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js <file>`
- **Run date:** 2026-06-25
- **Result:** transactional-emails.md `🔴 HARD: 0  🟠 REVIEW: 6` · seq-02-post-purchase.md `🔴 HARD: 1  🟠 REVIEW: 0`
- **Judgement pass:** done — checked EFSA wording (no ingredient claims present),
  Phase-0 boundary (no clinical/TRT claims; collection instructions only),
  silent-ingredient (Ashwagandha absent), FM-CTA gate (untouched), retest framing
  (untouched). The edited collection content introduced **0 HARD / 0 REVIEW**.
- **Disposition of every HARD/REVIEW hit (all pre-existing, none in edited blocks):**
  - transactional-emails.md:122 «diagnosis» — 🟢 in the T-03 disclaimer negation. Compliant. Not edited.
  - transactional-emails.md:126/133/140/144 «founding member» — T-04 (FM list confirmed). Pre-existing, gated correctly. Not edited.
  - transactional-emails.md:234 «fix» — T-07 "how to fix it quickly" (payment dunning, not retest/efficacy). Benign. Not edited.
  - seq-02-post-purchase.md:85 «treat» — internal Customer.io build note ("treat it as preparation, not repetition"). Benign, not customer-facing, pre-existing. Not edited.

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| seq-02 Email 2 / T-02 | "Take your sample between 7 and 10am … truest reading" | Result-validity claim (diurnal timing) | Ewa | ☑ APPROVED |
| seq-02 Email 2 / T-02 | "hormone creams, gels or sprays … 72 hours before … can contaminate the sample" | Result-validity / contamination guidance | Ewa | ☑ APPROVED |
| seq-02 Email 2 / T-02 | "No need to fast" (all kits) | Result-validity (no fasting-dependent marker) | Ewa | ☑ APPROVED |

## 3. Conditions of approval

- **Vitall protocol confirmation (operational, not a copy gate):** verify the
  per-kit collection requirements match Vitall's actual test protocols, esp.
  Kit 2/3. Folded into the open Ben Starling thread.
- **Sequence the switch:** push the updated comms live **before** Vitall's
  customer emails are disabled, so there is no window where neither party tells
  customers how to collect.
- **Customer.io:** these are source artefacts. If T-01/T-02/seq-02 are already
  loaded in CIO, the CIO content must be re-uploaded. Build/keep as DRAFT;
  activation is a separate go/no-go. No CIO change made under this record.

### §3 status update — 2026-07-09 (Ben/Vitall thread close-out)

Per Keith (2026-07-09), both operational conditions were agreed with Ben (Vitall);
the services agreement is signed. Recorded here on Keith's in-session
representation (same standard as the Ewa signature block above); written
confirmation from Ben is recommended for the compliance record.

- **Vitall protocol confirmation** — Ben (Vitall) confirms the per-kit collection
  requirements (esp. Kit 2/3) match Vitall's actual test protocols. Met on Keith's
  representation. ⚠️ Written confirmation from Ben **not yet filed in-repo — file
  on receipt**, so this condition stays **formally open** until the written record
  lands. Non-blocking for copy (this was flagged operational, not a copy gate).
- **Sequence the switch** — AGREED with Ben: our updated kit-collection comms go
  live **before** Vitall's customer-facing emails are disabled. This condition
  governs activation sequencing and remains a live go/no-go check at switch-on;
  the agreement removes the earlier open dependency.

Cross-ref: `05_partners/labs/vitall/vitall-negotiation-log.md` (2026-07-09 close-out)
and `CONTEXT.md`.

## 4. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Ewa Lindo | APPROVED (on Keith's in-session representation; countersignature recommended for the clinical record) | §3 | 2026-06-25 |
| Business (Keith) | Keith | APPROVED | §3 | 2026-06-25 |
| Contractual (Solicitor) | n/a | not required (no commercial/contractual terms) | | |

## 5. Outcome

- Final decision: APPROVED (copy/clinical-logic) — ship gated on §3 conditions
- Register updated: 2026-06-25
- Notes: Vitall customer-email disable request sent to Ben Starling (operational,
  separate). Collection instructions now owned in our comms.
