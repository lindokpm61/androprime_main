# Kit 3 — Combined Result Rule (Low Testosterone + Energy/Recovery Deficiencies)

> ⚠️ **Low-T CTA target updated 2026-06-04 (Ewa CA-013).** The *logic* of this doc still holds: when T < 12, the low-T result is the report headline and its card carries the primary CTA with **no** energy/supplement upsell (Tier 2 is absolute — never bury or upsell over a low-T result). **What changed: that primary CTA is now a GP referral (+ optional consent-gated nurture opt-in), NOT the founding-member list** (FM taken down). Throughout this doc read every "primary CTA = founding-member list" as **"primary CTA = GP referral."** The `DEFICIENCY_STATES` defect described below was fixed, and the shared low-T branch now returns `CTAS.gpReferral` (one swap fixes Kit 1 + Kit 3). Authoritative: `04_products/CONTEXT.md` + `2026-06-04-low-t-routing-decision.md`.

**Status:** v1 (Phase 0a — supplements deferred). v2 reinstates direct supplement CTAs when supplements ship in Phase 0b. **Low-T CTA = GP referral (see banner).**
**Owner workspace:** `04_products/results-engine`
**Applies to:** Kit 3 (Men's Hormone & Recovery Check) only. Kit 1 and Kit 2 each produce a single result category and are unaffected.
**Related:** `classifier.ts`, `biomarker-copy.ts`, `seq-03b-low-t.md`, `seq-03a-energy-results.md`, `/03_compliance/CONTEXT.md`, `04_products/CONTEXT.md` (Results-Engine Trigger Rules), `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`.

---

## 1. The problem

Kit 3 tests both the testosterone panel and the energy/recovery panel in one kit. A single Kit 3 customer can therefore return, on the same report, **both**:

- Low testosterone (Total T < 12 nmol/L), which must route to a GP referral (no upsell; consent-gated nurture optional), and
- One or more energy/recovery deficiencies (low Vitamin D, low Active B12, elevated hs-CRP 1–10 with joint symptoms), which originally routed to the Daily Stack / Complete Men's Stack.

These two findings drive two different, competing journeys. There was no written rule for which one leads, and a live defect in the results engine resolves the conflict the wrong way (see §4).

This rule defines the precedence, the dashboard copy the customer sees, the CTA matrix, the required code change, and the email-sequence handling.

**Phase 0a context for v1.** Phase 0 supplements (Daily Stack, Joint & Recovery Collagen, Complete Men's Stack) will not be available at Phase 0a launch. Sourcing is incomplete (estimated 2 to 3 months out). The original v2 of this rule assumed supplements ship in tandem and routed every non-FM CTA to a buyable subscription. Until supplements ship in Phase 0b, every supplement CTA is replaced with an opt-in to the **supplement waitlist** (a non-cash mechanic that mirrors the founding-member list — see `01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`). This rule is the v1 expression of that policy as it applies to Kit 3.

---

## 2. Governing principle

**On a Kit 3 report, the testosterone result always leads. Energy/recovery findings are supporting context, never the headline, and never displace the low-T GP referral (CA-013).**

Rationale: T < 12 nmol/L is the most clinically significant finding Kit 3 can surface and is the result the GP-referral pathway exists for. An energy-deficiency supplement upsell sitting above or in place of it would (a) bury the result the customer most needs to see, (b) breach the non-negotiable trigger rule in `/03_compliance/CONTEXT.md` and `04_products/CONTEXT.md`, and (c) read as selling to a man who has just learned his testosterone is low.

This principle is unchanged from v2. Only the downstream CTAs that sit beneath it have shifted, to reflect Phase 0a supplement deferral.

---

## 3. Precedence ladder

Evaluated top-down. The first tier that matches sets the **primary** CTA for the report. Lower tiers may only contribute **secondary** context/CTAs.

| Tier | Condition | Primary CTA (v1) | Secondary CTA (v1) | Never overridden by |
|---|---|---|---|---|
| 1 | Any GP hard-block marker: hs-CRP > 10 mg/L, Ferritin < 30, Albumin < 35 | GP-referral prompt **on that marker's card** | — (no supplement/waitlist/FM CTA on that card) | anything |
| 2 | Total T < 12 nmol/L | **GP referral (CA-013), no upsell** | **None** (the referral is the sole focus; do not split attention; consent-gated nurture is built separately) | tiers 3–4 |
| 3 | Total T 12–15 nmol/L (borderline) **with** ≥1 energy deficiency | **Supplement waitlist** | — | tier 4 |
| 4 | Total T ≥ 15 / normal, energy deficiencies only | **Supplement waitlist** (per existing energy-deficiency rules — biomarker education stays on the marker cards) | — | — |

Notes:
- Tier 1 is **per-marker** and coexists with Tier 2. A Kit 3 man can have low T (Tier 2 sets the report headline + primary CTA) **and** Ferritin < 30 (that specific marker card still shows the GP-referral prompt). The GP prompt is never suppressed and never converted into a supplement, waitlist, or any other CTA.
- Tier 2 is **absolute**: when T < 12, the primary CTA is the GP referral (CA-013) regardless of how many energy markers are also out of range. The "Complete Men's Stack" bundle is **not** offered as the primary CTA in this scenario. In v1 the Daily Stack secondary is dropped entirely: the GP referral is the sole focus, with no upsell. The biomarker education for energy markers stays on each marker's own card.
- Energy deficiencies in a Tier 2 report are still shown on their own marker cards with their normal explanatory/education copy. In v1 each of those cards offers the **supplement waitlist** as the next step (with OTC suggestion where clinically appropriate — see `biomarker-copy.md`), never a checkout.
- v2 (Phase 0b) restores the original Tier 2 secondary (single honest Daily Stack mention) and the Tier 3–4 direct supplement CTAs. The waitlist mechanic does not survive into v2 in its primary form; opted-in customers are migrated to launch broadcast segments.

---

## 4. Required results-engine change (apply only after sign-off)

**Defect:** `DEFICIENCY_STATES` in `classifier.ts` includes `low-testosterone` and `normal-testosterone`. The deficiency count therefore mixes the testosterone result with energy markers, so low-T + one energy deficiency = 2 → `hasMultiDeficiency` true → the `multi-deficiency` branch in `resolveCtas` returns `completeMensStack` as the primary CTA for the testosterone card **before** the `low-testosterone` branch is reached. The correct low-T CTA (now the GP referral) is silently suppressed. This breaks Tier 2.

**Fix (specified, to be applied as part of the broader Phase 0a engineering ticket on branch `chore/phase0a-supplement-waitlist-build`):**

1. Remove `'low-testosterone'` and `'normal-testosterone'` from `DEFICIENCY_STATES`. The multi-deficiency / Complete Men's Stack branch should be driven by **energy/recovery markers only** (Vitamin D, Active B12, hs-CRP), matching the `04_products/CONTEXT.md` trigger table ("2+ deficiencies (Kit 2 or Kit 3)").
2. Result: `deficiencyCount` is computed on energy markers only; the `low-testosterone` branch is always reached and returns `primaryCta: gpReferral` with **no** secondary CTA (per §3 and the 2026-06-04 low-T routing decision). (This supersedes the original v1/v2 spec, which returned `foundingMember`; the founding-member list is no longer a results CTA.)
3. The Complete Men's Stack / multi-deficiency branch still surfaces correctly when there are 2+ *energy* deficiencies and testosterone is normal/borderline (Tiers 3–4). In v1, that branch's CTA is `supplementWaitlist`; in v2 it reverts to `completeMensStack`.
4. Add a regression fixture: Kit 3, T = 9 nmol/L + Vitamin D < 50 + Active B12 < 37.5. Expected: testosterone card `primaryCta = gp-referral`, no secondary CTA; energy-marker cards show their own waitlist CTAs; Complete Men's Stack does **not** appear as any primary CTA. (Add to `lib/results/fixtures/`.)

The Kit 3 defect fix and the regression fixture ship in the same commit on `chore/phase0a-supplement-waitlist-build` as the broader CTA-matrix rewire (see plan §3.1). This rule must be signed off before that commit lands.

---

## 5. Combined-result dashboard copy

Shown as the **panel summary block at the top of the Kit 3 results dashboard** when Tier 2 applies (T < 12) **and** at least one energy/recovery marker is out of range. It sits above the individual marker cards. Voice anchored to `seq-03b` (empathetic, direct, no spin, no medicinal claims). v1 wording below; v2 will reinstate a single honest Daily Stack mention in the closing paragraph.

> ### Your results
>
> Your Kit 3 panel covers two things: your testosterone, and the energy and recovery markers that affect how you feel day to day. Each marker below is explained in plain English, to a standard signed off by Dr Ewa Lindo, a GMC-registered GP.
>
> **Start with your testosterone.** Your result indicates a total testosterone below 12 nmol/L. That is the most important number on this report, and it is the one we want you to focus on first. It does not mean anything is medically urgent. It does mean there is a specific, measurable explanation for a lot of what you have likely been experiencing, and a clear path from here. Read the testosterone card below, then the short series of emails I will send you over the next few days. They explain what this threshold means and what your options are, including the GP referral we include so you can take this to your own doctor.
>
> **Your energy and recovery markers add detail to the same picture.** Some of these have come back below their optimal range too. That is common alongside a testosterone result like yours. They do not change the headline, and acting on them is not a substitute for the testosterone pathway. I will always be straight with you about that. Each marker card below explains the result in plain English and shows you the next sensible step for that specific marker. Where an over-the-counter option is appropriate, the card will say so. Where it is not, the card will say so.
>
> Take the testosterone result first. The rest is context, in order of what matters.

If any GP hard-block marker is also present (hs-CRP > 10, Ferritin < 30, Albumin < 35), append this paragraph to the block:

> One of your markers ({{ marker_name }}) is outside the range where general guidance is appropriate. We have flagged it on its own card with a recommendation to speak to your GP about that specific result. That is separate from your testosterone result and from anything we offer. Please act on it independently.

**Liquid / data notes:** `{{ marker_name }}` populated from the first GP-block marker present. Block renders only when `kit_type_latest = 'hormone-recovery'` AND `testosterone_value < 12` AND `energy_marker_flag_count >= 1`. Reuses existing attributes; introduces no new user attribute.

**Notes on v1 wording (changes from v2 draft):**

- The v2 line "supporting these basics can make a measurable difference to how you feel while the clinical service is being built" has been removed. In Phase 0a we cannot offer a buyable supplement to support those basics today, and that sentence implied we could. The replacement framing routes the customer to the marker-level cards, which carry the honest OTC suggestion (where applicable) and the supplement-waitlist opt-in.
- No supplement product is named in this block. Product naming lives on the marker cards, where it is paired with the EFSA-approved claim wording and the waitlist mechanic.
- No em-dash anywhere; commas, colons, and full stops only.
- The Daily Stack's silent ingredient is not named anywhere (see `02_brand/prohibited-terms.md` §4).
- "Your result indicates" (not "you have"). "Speak to your GP" (not "consult your doctor").

---

## 6. Email sequence handling

The parallel-sequence rule already exists in `seq-03b-low-t.md` (§"Parallel sequence handling (Kit 3 only)") and `seq-03a-energy-results.md`. This rule confirms and tightens it. No new sequence is created here.

- **seq-03b handles the testosterone arm.** It is the lead sequence for any Kit 3 customer with T < 12. The Daily Stack secondary in seq-03b Email 3 is being adjusted on branch `chore/phase0a-email-sequences` per the §3.4 sequencing table in the plan doc. **Stop-goals unchanged.** seq-03b's CIO stop-goal is still `founding_member_listed`, which remains defined but **dormant** — no longer a low-T conversion target since 2026-06-04 (low-T converts on GP-referral acknowledgement; see `conversion-rules.md`).
- **seq-03a handles the energy arm and is not suppressed.** It runs in parallel for the energy markers. Supplement CTAs in seq-03a Emails 3 and 5 are being adjusted to waitlist CTAs on branch `chore/phase0a-email-sequences`. **Stop-goals unchanged.**
- **No duplicate supplement pitch.** seq-03a's marker-driven waitlist CTAs stand on their own logic. Do not add a supplement or waitlist pitch into seq-03b at Email 3 over and above what the Phase 0a rewrite already settles.
- **One addition (carry-over from v2):** seq-03b Email 1 currently says "Dr Ewa has reviewed your full panel (total testosterone, SHBG, Free Androgen Index, and Albumin)". For Kit 3 buyers this panel list is incomplete. Add a Liquid branch so Kit 3 recipients see "your full hormone and recovery panel" rather than the Kit 1 marker list. Flagged for the seq-03b build, not changed here.

Cross-reference: all seq-03 rewrites are happening on branch `chore/phase0a-email-sequences`. Stop-goals on seq-03b (and seq-03a) do **not** change as part of v1.

---

## 7. Compliance checklist (for Ewa review)

| Line / decision | Rule it satisfies |
|---|---|
| "Your result indicates a total testosterone below 12 nmol/L" — never "you have low testosterone" | Red-flag table — definitive medical statement |
| No "diagnose / treat / cure / fix" anywhere | Red-flag table |
| Low-T (T < 12 on Kit 3) routes to GP referral (CA-013), no upsell; never triggered from energy markers | `/03_compliance` + `04_products` Special Cases (non-negotiable) |
| "for when our clinical service launches" — never "TRT is available" | Phase 0 boundary |
| No supplement product named in §5 dashboard block (Phase 0a) | Phase 0a supplement deferral (`01_strategy/2026-05-23-phase0-supplements-deferred-plan.md`) |
| Marker-level supplement guidance routes to the waitlist (non-cash opt-in) and, where clinically appropriate, suggests OTC | EFSA approved-claims table + Phase 0a mechanic |
| Supplement CTAs route to waitlist (non-cash opt-in), never to a checkout that would 400 | Phase 0a customer-experience integrity |
| Silent ingredient (Daily Stack botanical) not named anywhere in this file | Silent-ingredient rule (root CLAUDE.md guardrail #3, `02_brand/prohibited-terms.md` §4) |
| No £75 deposit reference; founding-member described as non-cash list | FM deposit shelved 2026-05-08 |
| GP hard-block markers always surfaced independently, never converted to a sale or a waitlist opt-in | Results-engine trigger table (GP referral, no cross-sell) |
| Kit 3 energy framing permitted (Kit 3 covers both panels) | Kit-scoping special case (the Kit 1-only restriction does not apply to Kit 3) |
| No em-dash anywhere in §5 customer-facing block | `02_brand/brand-description.md` v1.1 / no-em-dash rule |

---

## 8. Approval log

| Item | Reviewer | Status | Date |
|---|---|---|---|
| Precedence ladder (§3) — v1 | Dr Ewa Lindo | Pending | — |
| Required classifier change (§4) — v1 application | Keith / engineering | Pending (gated on §3) | — |
| Combined dashboard copy (§5) — v1 | Dr Ewa Lindo (compliance) + Keith (voice) | Pending | — |
| Email handling (§6) | Keith | Pending | — |

The approval record for v1 is **CA-010 (Phase 0a Kit 3 combined-result rule v1)** — distinct from CA-008 (Vitall + clinical-review correspondence) and CA-009 (Phase 0a waitlist copy template + T-10). It will be logged in `03_compliance/content-approval/` once Ewa signs off.

**v2 note.** When supplements ship in Phase 0b, the v2 reinstatement (Tier 2 secondary = Daily Stack honest mention; Tiers 3–4 primary = direct supplement CTAs) requires a separate approval cycle. The §5 dashboard block will need a new closing paragraph that names a buyable product, and that paragraph will need its own EFSA / Phase-0-boundary pass before activation. v2 does not inherit v1's approval.
