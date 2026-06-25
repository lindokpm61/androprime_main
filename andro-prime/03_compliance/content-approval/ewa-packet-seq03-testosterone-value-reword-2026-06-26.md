# Ewa review packet — seq-03c / seq-03d testosterone-value reword (CA-020, PENDING)

| Field | Value |
|---|---|
| Register ID | CA-020 (pending) |
| Artefacts | `email-templates/html/seq-03c-email-1-results-in.html` + `email-templates/html/seq-03d-email-{1,2,4}-*.html` (and their `.md` sources) |
| Content type | Customer-facing results-notification email copy (testosterone) |
| Submitted by | Keith (drafted for Ewa) |
| Submitted date | 2026-06-26 |
| Required signers | Ewa (clinical / claims) + Keith |

## Why this change

The seq-03c (Normal) Kit-1 branch and the whole seq-03d (Borderline) sequence
print the customer's exact testosterone figure via `{{ customer.testosterone_value }}`.
That value is **deliberately never sent to Customer.io** (special-category health
data, US processor — see `buildCioTraits` in `processResult.ts` and the DPIA).
So the variable renders empty and the send **fails** (same failure class as the
T-02 tracking-url bug). The number must come out of the email copy.

**Key point that makes this safe and simple:** sequence membership already implies
the band. Everyone in seq-03c's `kit_type_latest == 'testosterone'` branch is
**normal**; everyone in seq-03d is **borderline (lower end of normal)**. So the
copy can state the band as **static text** — no variable, no health data sent to
CIO, exact figure stays in the dashboard (where it's consented + UK-resident).

## Proposed rewordings (current → proposed) — Ewa to confirm clinical phrasing

**1. seq-03c email-1, Kit-1 branch:**
- CURRENT: "Your testosterone is `{{ customer.testosterone_value }}` nmol/L, which puts you comfortably within the normal range. SHBG, Free Androgen Index, and Albumin all look fine."
- PROPOSED: "Your testosterone came back comfortably within the normal range, and your SHBG, Free Androgen Index, and Albumin all look fine. Your exact numbers are in your dashboard."

**2. seq-03d email-1:**
- CURRENT: "Your testosterone came back at `{{ customer.testosterone_value }}` nmol/L. The NHS reference range runs from around 8 to 29 nmol/L, so you're within normal limits. But you're at the lower end, and that's worth understanding, not dismissing."
- PROPOSED: "Your testosterone came back within normal limits, but at the lower end of the range. (The NHS reference range runs from around 8 to 29 nmol/L; your exact figure is in your dashboard.) That's worth understanding, not dismissing."

**3. seq-03d email-2 (subject line):**
- CURRENT: "Why `{{ customer.testosterone_value }}` nmol/L matters - even if your GP says you're fine."
- PROPOSED: "Why a lower-end-of-normal result matters - even if your GP says you're fine."

**4. seq-03d email-2 (body):**
- CURRENT: "Your testosterone is `{{ customer.testosterone_value }}` nmol/L."
- PROPOSED: "Your testosterone came back at the lower end of the normal range."
- (Following line — "You're not deficient… threshold around 8 to 10 nmol/L… above that…" — unchanged; it speaks to the band, not the figure.)

**5. seq-03d email-4 (trend check):**
- CURRENT: "A month since your results. Your testosterone was `{{ customer.testosterone_value }}` nmol/L, lower end of normal."
- PROPOSED: "A month since your results, which came back at the lower end of normal."

## Notes for the signer

- No definitive medical statements introduced; "lower end of the normal range" is
  qualitative + factual. NHS reference range retained as context, figure removed.
- No TRT / founding-member language touched (FM is down; low-T routes to GP). This
  packet is scoped to the value lines only — CTAs unchanged.
- Compliance pre-flight: the change **removes** a data field and adds no new claim;
  net risk reduction. Full `scan.js` pass to be attached on build.

## SEPARATE from this copy sign-off — seq-03d trigger redesign (Keith + engineering)

seq-03d cannot currently fire at all: its trigger filter `borderline_testosterone == true`
is also never sent to CIO. Reweaving the copy does not fix that. Recommended
direction (mirrors the approved low-T pattern): **consent-gate it** — a
`borderline_nurture_consented` event set after the customer opts in on the
dashboard (like `lowt_nurture_consented` / seq-03b), so a minimal consented flag
triggers the sequence and no raw value/band is pushed pre-consent. Alternative:
fold borderline guidance into the dashboard only. This is a Keith/eng decision and
is NOT required for the seq-03c reword (seq-03c already triggers correctly).

## Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Ewa Lindo | APPROVED (on Keith's in-session representation; countersignature recommended for the clinical record) | static-text rewordings only; seq-03d trigger redesign is a SEPARATE Keith/eng decision | 2026-06-26 |
| Business (Keith) | Keith | APPROVED | | 2026-06-26 |

## Outcome

- Final decision: **APPROVED** 2026-06-26 (Ewa + Keith).
- **Applied + live:** all 5 lines reworded to static text in the HTML templates,
  markdown sources, and the CIO draft templates (seq-03c action 38 / tmpl 19;
  seq-03d actions 45/47/51 / tmpls 23/24/25/26). Live bodies verified `testosterone_value`-free; lint 0 errors.
- **seq-03c** is now activation-ready (no copy blocker). **seq-03d** copy is fixed
  but the campaign stays draft pending the trigger-redesign decision (the
  `borderline_testosterone` flag is not sent to CIO).
