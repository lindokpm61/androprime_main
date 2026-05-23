# Approval Record — Supplement Waitlist Copy Template (v1)

| Field | Value |
|---|---|
| Register ID | CA-009 |
| Artefact(s) | The standard "supplement waitlist" mention pattern used across results-engine cards, seq-03a/c/d Email 3 + Email 5, the new /supplement-waitlist landing, /supplements/* and /lp/* coming-soon pages, and the new T-10 transactional confirmation. (Per-page application listed in §1.) |
| Version | v1 (Phase 0a — supplements deferred 2 to 3 months) |
| Content type | Customer-facing waitlist opt-in copy / lifecycle email |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-23 |
| Required signers | **Keith (business / mechanic)** + **Dr Ewa Lindo (clinical / compliance)** |
| ClickUp | [869ddvqzx](https://app.clickup.com/t/869ddvqzx) (engineering) + [869ddvr15](https://app.clickup.com/t/869ddvr15) (content) — both gated on this approval before deploy |

## 1. Scope — every surface the waitlist mention appears on

**Customer-facing pages** (Phase 0a only; reverts to direct supplement CTAs in Phase 0b):
- `09_website-app/frontend/app/(marketing)/supplement-waitlist/page.tsx` — the dedicated waitlist landing.
- `09_website-app/frontend/app/(marketing)/supplements/page.tsx` — coming-soon hub.
- `09_website-app/frontend/app/(marketing)/supplements/daily-stack/page.tsx`.
- `09_website-app/frontend/app/(marketing)/supplements/collagen/page.tsx`.
- `09_website-app/frontend/app/lp/daily-stack/page.tsx`.
- `09_website-app/frontend/app/lp/collagen/page.tsx`.
- Sweep wording on home / how-it-works / faq / kits (no buyable supplement CTA; one consistent "we will recommend supplements; our own range launches shortly, join the early list").

**Email surfaces**:
- `seq-03a-energy-results.md` Email 3 + 5 + rendered HTML.
- `seq-03c-normal-results.md` Email 3 + rendered HTML.
- `seq-03d-borderline-t.md` Email 3 + rendered HTML.
- (Note: seq-03b Email 3 — Daily Stack secondary REMOVED, no waitlist substitute; FM list is the focus. Approved under CA-008 + tracked in §3 below.)
- NEW **T-10 Supplement Waitlist Confirmation** transactional: `transactional-t10-supplement-waitlist-confirmed.md` + HTML.

**Form + mechanic** (engineering, ships with this template):
- `app/api/supplement-waitlist/join/route.ts`.
- `components/supplement-waitlist/SupplementWaitlistForm.tsx`.
- `lib/supplement-waitlist/getSupplementWaitlistStatus.ts`.
- DB migration `20260523_create_supplement_waitlist.sql`.
- Result-card CTA `'supplement-waitlist'` wired into `classifier.ts`.

## 2. Pre-flight evidence

- **Command:** `node .claude/skills/compliance-preflight/scan.js <8 files>`
- **Run date:** 2026-05-23
- **Result after benign-English fixes:** 🔴 **HARD: 1** (T-10 line 109 — documented exception, see §2.1) · 🟠 REVIEW: 9 (all documented or surfaced for Ewa, see §2.2)
- **Judgement pass:** done. EFSA wording verbatim for every named ingredient (Vit D → muscle function; Active B12 → energy metabolism + psychological function; Zinc → testosterone maintenance). Phase 0 / clinical-service boundary clean (no "TRT is available", no "we will diagnose"). Silent-ingredient name absent throughout customer-facing copy. FM-CTA gate (Total T < 12 on Kit 1 or Kit 3) untouched. No retest/efficacy "fixed" framing in customer-facing copy.

### 2.1 Disposition of the 1 remaining HARD hit

| `file:line` | Phrase | Why it stays | Documented-exception precedent |
|---|---|---|---|
| `transactional-t10-supplement-waitlist-confirmed.md:109` | `Ashwagandha` | The line is in the file's **internal compliance-notes block** forbidding the term (verbatim: *"No mention of any silent ingredient. No Ashwagandha reference, anywhere."*) — quoting the forbidden phrase to enforce the rule. Not customer-facing copy; not in the rendered HTML. | CA-008 documented the same pattern at `seq-03b-low-t.md:11–12` (compliance-notes block forbids banned phrases). Same rule-quoting exception applies. |

### 2.2 REVIEW hits surfaced for the signers (verbatim, not silently rewritten)

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| `seq-03a-energy-results.md:14–15` | "heals joints", "treats brain fog" (in compliance-notes block) | Documented-exception rule-quoting (pre-existing CA-008 pattern; not customer-facing). | Ewa | ☐ |
| `seq-03a-energy-results.md:63` | "do not constitute a diagnosis or medical advice" | Disclaimer pattern; scanner's NEG guard treats as compliant. | Ewa | ☐ |
| `supplement-waitlist/page.tsx:92` | "A purchase or a deposit" inside disclaimer ("this is what this is *not*"). | Disclaimer pattern; explicitly distinguishing the waitlist from a deposit (FM-list non-cash language consistent with CA-008). | Keith | ☐ |
| `seq-03b-low-t.md:11` (pre-existing) | (CA-008 documented exception, untouched) | n/a — referenced for completeness | Ewa | ☐ |
| Three pre-existing REVIEW hits in seq-03a Email 2 ("only reliable fix" / "sleep doesn't fix") and seq-03c lines 17 and 189 | Not introduced by this change; flagged here for completeness. | Pre-existing wellness-cohort guardrail notes, not customer-facing. | Ewa (informational) | ☐ |

## 3. Waitlist mention pattern (the standardised block)

Used verbatim across emails and pages so the customer experience is consistent. Mentioned once per surface, never stacked.

> Your [marker] is below the optimal range. [Where applicable: an OTC option, using EFSA-verbatim wording for the named ingredient — Vitamin D3 from any chemist supports normal muscle function; oral Active B12 supports normal energy-yielding metabolism.]
>
> We are also building the Andro Prime Daily Stack, a curated supplement designed around the markers Kit 2 and Kit 3 cover. It launches as soon as our manufacturing partner is confirmed. Join the early-access list and you will be the first to dispatch, with a founding-customer discount when it ships.
>
> [Join the early-access list — `/supplement-waitlist`]

**Timing:** vague only. "Launches shortly" / "as soon as our manufacturing partner is confirmed". No specific month, ever (per plan §4 decision).

**No payment / commitment** language: identical to the FM list. "No payment, no commitment, no Stripe checkout — just your email. Leave any time."

## 4. Conditions of approval

- The waitlist mechanic must NOT activate (no live deploy of the form, no live result-card CTA) until **both** CA-009 and CA-010 are APPROVED. They ship together.
- T-10 must NOT be activated in CIO until CA-009 is APPROVED.
- The supplement-waitlist mechanic is Phase 0a only. When supplements ship (Phase 0b), the v2 of the results engine + sequences reinstates direct supplement CTAs; that v2 will require its own re-approval cycle.
- Any future change to the waitlist mention pattern (the block in §3) requires a new minor approval record or an amendment to this one.

## 5. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims | Dr Ewa Lindo | | | |
| Business / mechanic | Keith Antony | | | |

## 6. Outcome

- Final decision: PENDING
- Register updated: 2026-05-23 (entry created)
- Notes: Bundled with CA-010 (Kit 3 combined-result rule v1) into one Ewa review packet — see ClickUp [869ddvr2b](https://app.clickup.com/t/869ddvr2b).
