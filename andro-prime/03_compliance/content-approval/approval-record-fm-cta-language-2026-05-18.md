# Approval Record — Founding-Member CTA Language (non-cash framing)

| Field | Value |
|---|---|
| Register ID | CA-008 |
| Artefact(s) | seq-03b copy + rendered emails + T-04 + FM landing page + results-dashboard CTA (see §1) |
| Version | current (2026-05-18) |
| Content type | Customer-facing FM CTA copy / clinical-adjacent results copy |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-18 |
| Required signers | Keith (non-cash/business framing) + **Dr Ewa Lindo (clinical — TRT efficacy/safety assertions)** |
| ClickUp | `869d99kyu` ("03. Founding-member CTA language") — DoD: approved CTA copy + deployed across landing pages |

## 1. Scope — every surface the FM CTA language appears on

- `09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md` (canonical copy spec, Emails 1–7)
- `09_website-app/frontend/email-templates/html/seq-03b-email-3-founding-member.html` (rendered FM CTA email)
- `09_website-app/frontend/email-templates/html/transactional-t04-fm-list-confirmed.html` (T-04 confirmation)
- `09_website-app/automations/customerio/sequences.md` — "Founding-Member List Non-Cash Framing Rule"
- `09_website-app/frontend/app/(marketing)/founding-member/page.tsx` (the landing page — "deployed across landing pages" DoD; **copy not yet individually pre-flighted — pending, see §3**)
- `09_website-app/frontend/app/(app)/founding-member-status/page.tsx` + `ResultConvert.tsx` (in-app FM CTA panel, gated on T<12 per the precedence ladder)

## 2. Pre-flight evidence

- Scanner run 2026-05-18 over the seq-03b copy + email-3 + T-04. **0 genuine HARD.** The 3 HARD hits are the documented exception: `seq-03b-low-t.md:11–12` are the compliance-notes block quoting banned phrases to forbid them; `:65` is benign narrative ("they'd say there's nothing to treat" = the GP's view, not an AP medicinal claim). 62 REVIEW = the FM/TRT and ingredient+benefit heuristics firing on every "founding member"/"TRT" mention (expected — this IS the FM sequence) and on the EFSA lines.
- Judgement pass vs `03_compliance/CONTEXT.md` FM-CTA special case:
  - **Gate — PASS.** Trigger = `testosterone_value < 12` AND (`kit_type_latest = 'testosterone'` OR `'hormone-recovery'`). Never Kit 2. Exactly the CONTEXT.md rule.
  - **Non-cash framing — PASS (exemplary).** "No payment. No commitment. No Stripe checkout… just your email… leave any time… no payment was taken." No deposit / "securing" / "reserve" / payment language anywhere. This is the literal subject of blocker #03 and it is clean.
  - **Results wording — PASS.** "Your results indicate…", not "You have low testosterone". TRT framed as future ("when the service opens", "working through CQC registration"), not live.
  - **EFSA wording — PASS.** Email 3 ingredient lines are verbatim the approved claims: Zinc → "maintenance of normal testosterone levels"; Active B12 → "normal energy-yielding metabolism"; Vitamin D → "normal muscle function". No silent ingredient named.

## 3. Clinical assertions — SOFTENED 2026-05-18 (Keith decision: "all three")

The three flagged clinical efficacy/safety assertions were softened per Keith's explicit decision, in both the canonical `seq-03b-low-t.md` **and** the rendered HTML (`seq-03b-email-2/3/5`). Re-pre-flight 2026-05-18: **zero new HARD introduced**; remaining HARD are the pre-existing documented exceptions (compliance-notes block + benign "nothing to treat" narrative). The clinical-claim surface is materially reduced from "Andro Prime asserts clinical fact" to "hedged / clinician-deferred."

| Loc | Was (flagged) | Now (softened) |
|---|---|---|
| Email 3 | "TRT is **the clinically appropriate intervention** for [<12] in men experiencing symptoms…" | "…**one of the options a clinician may discuss**… whether it's right for you is **an individual clinical decision Dr Ewa would make, not something a result alone determines**." |
| Email 5 | "the evidence for safety is well-established… **the answer is: with proper clinical oversight, yes**." | "…risks are almost always tied to **unsupervised** use… **safety depends on that oversight**… the specifics for your situation are **a conversation for Dr Ewa, not something to settle by email**." |
| Email 2 | "most research finds… **cluster between 15 and 25 nmol/L. Below 12 is where the correlation … becomes significantly stronger.** Your result puts you below that threshold." + "Your result is showing a specific, measurable cause." | "**some research… suggests**… mid-to-upper part of the range… **it's not settled science, and a number alone doesn't explain how you feel**" + "a result like this is a specific, measurable thing **to take to a clinician**." |

**Landing-page / in-app surfaces — PRE-FLIGHTED 2026-05-18, PASS (no changes needed):** `app/(marketing)/founding-member/page.tsx`, `components/founding-member/JoinForm.tsx`, `app/(app)/founding-member-status/page.tsx`, `components/results-engine/ResultConvert.tsx`. Scanner: **0 HARD**, 18 REVIEW (expected FM/TRT-mention noise). Non-cash framing exemplary; Phase-0 boundary clean; **zero clinical efficacy/safety claims on these surfaces** (pure list mechanics, unlike seq-03b). Gate confirmed in code: `classifier.ts` fires `CTAS.foundingMember` only on `state === 'low-testosterone'` = Testosterone < 12 (matches CONTEXT.md). `ResultConvert.tsx` is presentational only.

**Cross-reference (NOT in scope for #03, do not fix here):** `classifier.ts` `DEFICIENCY_STATES` includes `low-testosterone`/`normal-testosterone` → the documented Kit 3 low-T + energy-deficiency FM-CTA suppression defect, tracked as outstanding blocker **#50** (gated on Ewa's Kit 3 combined-result-rule sign-off). Affects *when* the CTA shows, not its language.

**Still required before close:** Ewa's **direct written clinical sign-off on the softened seq-03b Email 2/3/5 text** (lower bar than the originals, but Email 3/5 still discuss TRT clinically — countersignature, not transcribed via Keith). This is now the *only* open item for #03.

## 4. Signature block

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Business / non-cash framing | Keith Antony | APPROVED — non-cash framing only | Scope limited to the FM non-cash/opt-in framing | 2026-05-18 |
| Clinical / claims | Dr Ewa Lindo | **APPROVED — softened seq-03b Email 2/3/5 text** | Direct written sign-off received via email (see §6); covers the §3 softened TRT efficacy/safety assertions | 2026-05-20 |

> Keith's non-cash-framing approval was recorded on his instruction (2026-05-18). Ewa's clinical sign-off was held back until received directly from her, not transcribed on Keith's representation (cf. blocker #01 rule). Received 2026-05-20 — see §6.

## 5. Outcome

- Final decision: **APPROVED 2026-05-20.** Non-cash framing (the blocker's named concern) clean and Keith-approved (2026-05-18). The §3 clinical assertions were softened 2026-05-18 per Keith ("all three") in the canonical `.md` + rendered HTML (re-scan: zero new HARD). The landing page / JoinForm / status page / ResultConvert were pre-flighted 2026-05-18 — PASS, 0 HARD, no changes needed; gate confirmed in `classifier.ts`. Dr Ewa Lindo's direct written clinical sign-off on the softened seq-03b Email 2/3/5 text received by email 2026-05-20 (see §6) — the only previously-open item is now closed.
- **Closes compliance blocker #3** (FM CTA / TRT efficacy/safety assertions). ClickUp `869d99kyu` can move to closed.
- **Scope clarification:** this approval covers the FM-CTA language only. It does NOT silently resolve outstanding blocker #50 (the Kit 3 low-T + energy-deficiency `DEFICIENCY_STATES` classifier suppression defect) — that affects *when* the CTA shows, not its language, and remains gated on Ewa's separate sign-off of the Kit 3 combined-result rule.
- Register: CA-008 = ✅ APPROVED.

## 6. Clinical sign-off — evidence (received 2026-05-20)

Email from Dr Ewa Lindo, received directly by Keith at `keith@andro-prime.com`. Verbatim transcript below; PDF screenshot of the original Gmail thread retained by Keith. This is the direct countersignature required by §4 and the §1 blocker-#01 rule.

| Field | Value |
|---|---|
| From | Dr Ewa Lindo `<ewalindo@live.co.uk>` |
| To | `keith@andro-prime.com` |
| Date | 20 May 2026, 00:46 |
| Subject | sign off |

> Hi
>
> This my agreed sign-off on SOFTENED seq-03b Email 2/3/5 text
>
> Thanks
> Dr E Lindo

The email explicitly names the artefacts in scope (the softened seq-03b Email 2/3/5 text per §3 of this record). Sent from Ewa's own address, not transcribed via Keith — satisfies the "not transcribable on representation" rule. Brief but explicit and dated; sufficient for the audit trail.
