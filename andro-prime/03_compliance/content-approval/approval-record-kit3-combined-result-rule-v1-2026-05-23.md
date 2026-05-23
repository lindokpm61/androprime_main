# Approval Record — Kit 3 Combined-Result Rule (v1, Phase 0a)

| Field | Value |
|---|---|
| Register ID | CA-010 |
| Artefact path | `andro-prime/04_products/results-engine/kit3-combined-result-rule.md` |
| Version | **v1 (Phase 0a — supplements deferred)**. Supersedes the 2026-05-18 v2 draft for Phase 0a. v2 will be re-approved separately when supplements ship in Phase 0b. |
| Content type | Results-engine logic + customer-facing combined-result dashboard copy |
| Submitted by | Keith Antony |
| Submitted date | 2026-05-23 |
| Required signers | **Dr Ewa Lindo (clinical + compliance)** + **Keith Antony (voice + business)** |
| ClickUp | [869d99m6z](https://app.clickup.com/t/869d99m6z) (scope redirected from v2 to v1 on 2026-05-23) |

## 1. Scope — what Ewa is signing off

This is **not** the same artefact Ewa was previously asked to review on 2026-05-18.

The 2026-05-18 draft (v2) routed Kit 3 customers with multi-deficiency results to Daily Stack / Complete Men's Stack CTAs. Phase 0 supplements are now deferred 2 to 3 months ([`01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`](../../01_strategy/2026-05-23-phase0-supplements-deferred-plan.md)). The rule has been **redrafted as v1**: every direct supplement CTA in the precedence ladder and dashboard copy is replaced with the supplement-waitlist mechanic (CA-009).

Ewa is being asked to sign off **three things**:

1. **§3 Precedence ladder** — the clinical decision logic. The non-negotiable T < 12 nmol/L rule for the FM CTA is preserved. The energy-deficiency tiers now route to the waitlist, not to a purchase.
2. **§5 Combined-result dashboard copy** — the customer-facing block shown when a Kit 3 customer has both low T and at least one energy/recovery marker out of range. Rewritten in seq-03b voice; no implication of a buyable supplement today.
3. **§7 Compliance checklist** — the line-by-line mapping of decisions to compliance rules, updated for the waitlist mechanic.

Plus a Keith voice check on §5 and §6.

## 2. Pre-flight evidence

- **Command:** `node .claude/skills/compliance-preflight/scan.js andro-prime/04_products/results-engine/kit3-combined-result-rule.md`
- **Run date:** 2026-05-23
- **Result:** 🔴 **HARD: 2** (both documented exceptions, see §2.1) · 🟠 REVIEW: 5 (surfaced in §2.2)
- **Judgement pass:** done. §5 customer-facing block contains no banned literals, no medicinal claims, no specific date for supplement launch, no silent-ingredient mention. Phase 0 / clinical-service boundary clean ("for when our clinical service launches", not "TRT is available"). FM CTA gate (Total T < 12 on Kit 1 or Kit 3) explicitly enforced by Tier 2 of §3. GP hard-block markers always surface independently (Tier 1, never overridden).

### 2.1 Disposition of the 2 HARD hits

Both HARDs sit inside the **§7 compliance checklist**, which is internal-only (it is Ewa's review sheet, not customer-facing copy). Both are the documented "rule-quoting" exception — the checklist quotes a forbidden phrase in order to forbid it.

| `file:line` | Phrase | Why it stays |
|---|---|---|
| `kit3-combined-result-rule.md:116` | `"you have low testosterone"` (inside the checklist row that bans this exact phrasing) | Rule-quoting in compliance checklist. Same pattern as CA-008's documented exceptions at `seq-03b-low-t.md:11–12`. The line forbids the phrase; deleting it would weaken the checklist's purpose. Not in customer-facing copy. |
| `kit3-combined-result-rule.md:119` | `"TRT is available"` (inside the checklist row that bans this exact phrasing) | Same. The checklist row reads: *"`for when our clinical service launches` — never `TRT is available`"*. Quoting the banned phrase to forbid it. Not in customer-facing copy. |

### 2.2 REVIEW hits surfaced for Ewa

| `file:line` | Phrase (verbatim) | Risk / rule | Signer | Decision |
|---|---|---|---|---|
| `:58`, `:65` | "Fix (specified, to be applied as part of the broader Phase 0a engineering ticket…)" / "The Kit 3 defect fix and the regression fixture ship…" | Scanner flags "fix" — engineering-defect context, NOT customer-facing retest framing. Not customer-facing copy. | Ewa (informational) | ☐ |
| `:79` | "not a substitute" (in §5 dashboard copy) | Disclaimer pattern. Reviewer should verify the medical-advice disclaimer is correctly worded. **Customer-facing.** | Ewa | ☐ |
| `:117` | "diagnose / treat / cure / fix" (checklist row forbidding these terms) | Rule-quoting exception. Internal-only. | Ewa (informational) | ☐ |
| `:124` | "£75 deposit reference" (checklist row enforcing the non-cash rule) | Rule-quoting exception (the row exists to enforce that £75 deposits are not mentioned). Internal-only. | Ewa (informational) | ☐ |

## 3. Live classifier defect — fix already applied

The 2026-05-18 review surfaced a defect in `classifier.ts`: `'low-testosterone'` and `'normal-testosterone'` were in `DEFICIENCY_STATES`, so a Kit 3 customer with low T + 1 energy deficiency routed to the multi-deficiency branch and lost the FM CTA. **Fix applied 2026-05-23** on `chore/phase0a-supplement-waitlist-build` (merged into `main` at `4c12e20`):

- Both states removed from `DEFICIENCY_STATES`.
- Regression fixture added: `lib/results/fixtures/kit3-low-t-plus-vitamin-d-and-b12.ts` — Kit 3 with T = 9, Vit D = 30, B12 = 25; expects testosterone card primary = FM list, Vit D + B12 cards primary = supplement waitlist, no Complete Men's Stack anywhere.
- `npm test` clean. `tsc --noEmit` clean.

Sign-off on this approval record unlocks the deploy of that fix (gated on this CA + CA-009).

## 4. Conditions of approval

- Deploys with CA-009 (waitlist copy template) as one packet. Neither activates alone.
- v1 is Phase 0a-only; v2 (when supplements ship) requires a separate re-approval.
- Closes outstanding blocker #50 (FM-CTA suppression defect on Kit 3 multi-deficiency).

## 5. Signature block — humans only

| Role | Name | Decision (APPROVED / REJECTED / APPROVED-WITH-CONDITIONS) | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims | Dr Ewa Lindo | **APPROVED** | Direct written sign-off received via email from her own address (see §7); covers §3 precedence ladder, §5 dashboard copy, §7 compliance checklist as drafted | 2026-05-23 |
| Voice / business | Keith Antony | **APPROVED** | Voice + §5 copy approved as drafted; recorded on Keith's instruction during the 2026-05-23 session | 2026-05-23 |

## 6. Outcome

- Final decision: **APPROVED 2026-05-23.** Ewa's direct written sign-off received the same day from her own address (see §7); Keith approved on his own instruction during the same session.
- Register updated: 2026-05-23 (CA-010 row flipped to ✅ APPROVED).
- Notes: Bundled and approved together with CA-009 (supplement-waitlist copy template) — see ClickUp [869ddvr2b](https://app.clickup.com/t/869ddvr2b). Supersedes the original 2026-05-18 v2 ask on ClickUp [869d99m6z](https://app.clickup.com/t/869d99m6z), which can now move to closed. Unblocks: deploy of the Kit 3 classifier fix (in code on `main` since `4c12e20`), the Kit 3 regression fixture, and the §5 dashboard copy. **Closes outstanding blocker #50** (FM-CTA suppression defect on Kit 3 multi-deficiency). Remaining activation gates are operational, not compliance: production Supabase migration apply, push `main`, CIO segment + event wiring.

## 7. Clinical sign-off — evidence (received 2026-05-23)

Email from Dr Ewa Lindo, received directly by Keith at `keith@andro-prime.com`. Sent from Ewa's own address, not transcribed via Keith — satisfies the "not transcribable on representation" rule (same standard as CA-008 and compliance blocker #1).

| Field | Value |
|---|---|
| From | Dr Ewa Lindo `<ewalindo@live.co.uk>` |
| To | `keith@andro-prime.com` |
| Date | 23 May 2026, 20:46 UTC (21:46 BST) |
| Subject | Re: Two compliance sign-offs in one packet (Phase 0a) |
| Gmail message id | `19e569695b7c83e2` (thread `19e5692607721cfd`) |

Verbatim transcript:

> Hi Keith
>
> Signing off CA-09 and CA-10
>
> Let move forward
>
> Dr E Lindo

The email is explicit ("Signing off CA-09 and CA-10"), references both approval records by ID (her shorthand "CA-09" / "CA-10" maps to CA-009 / CA-010 — confirmed by the email-thread context, which contains both record IDs in full and lists each artefact path), dated, and sent from her own address. Brief, but explicit. Sufficient for the audit trail by the same standard CA-008 was closed on. PDF screenshot of the original Gmail thread retained by Keith.
