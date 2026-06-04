# Approval Record — seq-03b low-T result + consented nurture (v2, GP-referral rewrite)

| Field | Value |
|---|---|
| Register ID | CA-015 |
| Artefact path | `09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md` |
| Version | `v2` (2026-06-04 GP-referral rewrite; supersedes the FM/TRT v1 = CA-008 seq-03b portion) |
| Content type | Customer-facing lifecycle email sequence (results notification + special-category nurture) |
| Submitted by | Keith Antony |
| Submitted date | 2026-06-04 |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Command:** `node .claude/skills/compliance-preflight/scan.js 09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md`
- **Run date:** 2026-06-04
- **Result:** `🔴 HARD: 0   🟠 REVIEW: 6` (initial run had 1 HARD — the literal "you have low testosterone" quoted inside the compliance-notes rulebook; reworded so the literal no longer appears, same fix as CA-012).
- **Judgement pass:** done — EFSA (no ingredient/supplement claim anywhere); Phase-0 boundary (no "TRT available now"; only permitted "we'll let you know when we launch" framing; Email 4 = "regulated service… working through registration"); silent-ingredient absent; **no founding-member mechanic** (removed); results framing "Your results indicate…" not "you have…"; GP is the stated next step and is not undermined; consent-gated trigger for Part B; no `testosterone_value` interpolation (health-value minimised).
- **Disposition of every HARD hit:** the single HARD was a rulebook literal in the meta-notes block — reworded out (0 HARD now). The 6 REVIEW hits are all the term **TRT** appearing in the header / compliance-notes / build-notes **meta blocks** (incl. the retired filename `seq-03b-email-4-what-trt-looks-like`) — **the customer-facing email bodies (Emails 1–4) contain no instance of "TRT".** Documented meta-exception, same pattern as CA-008/009/010/012.

## 2. Items flagged for human decision

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| seq-03b Email 3 | "A result below 12 nmol/L sits under the level most men feel at their best, which is why it's worth understanding rather than ignoring." | Wellbeing-adjacent general statement (softer than the CA-008-approved v1 line "many feel at their best in the mid-to-upper part of the range"). Surfaced, not rewritten. | Ewa (clinical) | ☑ APPROVED — on Keith's representation; countersignature recommended for the clinical record |
| seq-03b meta blocks (11/17/19/153/168) | "TRT" in header/compliance/build notes | Term appears only in internal notes + a retired filename; never in customer body. | Ewa / Keith | ☑ confirmed meta-exception |

## 3. Conditions of approval

- **Supersedes CA-008's seq-03b portion** (FM CTA language in seq-03b). On approval, mark CA-008 seq-03b as SUPERSEDED; the FM/TRT emails 3–7 and HTML templates are retired (not to be built).
- **Two triggers, enforced separately:** Part A (Email 1) on `result_received` (low-T, Kit 1/3 only); Part B (Emails 2–4) ONLY on `lowt_nurture_consented`. Part B must never be triggerable from the `low_testosterone` trait alone.
- **Build as DRAFT only** (`cio-sequence-build`); never set to running. Every Part B email renders `{% unsubscribe_url %}` (Liquid tag).
- Lawful basis for Part B: `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md` (Art 6(1)(a)+9(2)(a); Keith interim-approved, solicitor post-launch). Consent UI copy = CA-014.

## 4. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | APPROVED | recorded on Keith's representation — countersignature recommended for the clinical record (esp. the flagged Email 3 line) | 2026-06-04 |
| Business (Keith) | Keith Antony | APPROVED | "all good" | 2026-06-04 |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

## 5. Outcome

- Final decision: **APPROVED**
- Register updated: 2026-06-04
- Notes: Closes item #3 (final) of the low-T Ewa sign-off list. Copy in the tree (`d955b66`); approval is copy-only. Next: build as a DRAFT Customer.io campaign (`cio-sequence-build`, never activate), retire the old FM/TRT seq-03b HTML, and mark CA-008 seq-03b SUPERSEDED. Activation is a separate human go/no-go.
