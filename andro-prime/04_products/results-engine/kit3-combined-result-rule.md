# Kit 3 — Combined Result Rule (Low Testosterone + Energy/Recovery Deficiencies)

**Status:** DRAFT — requires Dr Ewa Lindo compliance sign-off + Keith voice check before publishing or activating in the results engine or Customer.io.
**Owner workspace:** `04_products/results-engine`
**Applies to:** Kit 3 (Men's Hormone & Recovery Check) only. Kit 1 and Kit 2 each produce a single result category and are unaffected.
**Related:** `classifier.ts`, `biomarker-copy.ts`, `seq-03b-low-t.md`, `seq-03a-energy-results.md`, `/03_compliance/CONTEXT.md`, `04_products/CONTEXT.md` (Results-Engine Trigger Rules).

---

## 1. The problem

Kit 3 tests both the testosterone panel and the energy/recovery panel in one kit. A single Kit 3 customer can therefore return, on the same report, **both**:

- Low testosterone (Total T < 12 nmol/L) — which must route to the founding-member list, and
- One or more energy/recovery deficiencies (low Vitamin D, low Active B12, elevated hs-CRP 1–10 with joint symptoms) — which route to the Daily Stack / Complete Men's Stack.

These two findings drive two different, competing journeys. There was no written rule for which one leads, and a live defect in the results engine resolves the conflict the wrong way (see §4).

This rule defines the precedence, the dashboard copy the customer sees, the CTA matrix, the required code change, and the email-sequence handling.

---

## 2. Governing principle

**On a Kit 3 report, the testosterone result always leads. Energy/recovery findings are supporting context, never the headline, and never displace the founding-member CTA.**

Rationale: T < 12 nmol/L is the most clinically significant finding Kit 3 can surface and is the result the founding-member pathway exists for. An energy-deficiency supplement upsell sitting above or in place of it would (a) bury the result the customer most needs to see, (b) breach the non-negotiable trigger rule in `/03_compliance/CONTEXT.md` and `04_products/CONTEXT.md`, and (c) read as selling a £54.95/mo bundle to a man who has just learned his testosterone is low.

---

## 3. Precedence ladder

Evaluated top-down. The first tier that matches sets the **primary** CTA for the report. Lower tiers may only contribute **secondary** context/CTAs.

| Tier | Condition | Primary CTA | Secondary CTA | Never overridden by |
|---|---|---|---|---|
| 1 | Any GP hard-block marker: hs-CRP > 10 mg/L, Ferritin < 30, Albumin < 35 | GP-referral prompt **on that marker's card** | — (no supplement/FM CTA on that card) | anything |
| 2 | Total T < 12 nmol/L | **Founding-member list** | Daily Stack (single honest mention) | tiers 3–4 |
| 3 | Total T 12–15 nmol/L (borderline) **with** ≥1 energy deficiency | Daily Stack | — | tier 4 |
| 4 | Total T ≥ 15 / normal, energy deficiencies only | per existing energy rules (Daily Stack / Complete Men's Stack if 2+ energy markers) | — | — |

Notes:
- Tier 1 is **per-marker** and coexists with Tier 2. A Kit 3 man can have low T (Tier 2 sets the report headline + primary CTA) **and** Ferritin < 30 (that specific marker card still shows the GP-referral prompt). The GP prompt is never suppressed and never converted into a supplement or founding-member CTA.
- Tier 2 is **absolute**: when T < 12, the primary CTA is the founding-member list regardless of how many energy markers are also out of range. The "Complete Men's Stack" bundle is **not** offered as the primary CTA in this scenario. The only supplement mention is the Daily Stack, as a single secondary, honestly framed ("won't replace TRT") — consistent with `seq-03b` Email 3.
- Energy deficiencies in a Tier 2 report are still shown on their own marker cards with their normal explanatory/education copy and their **own secondary** Daily Stack CTA — they are informative, just not the report headline.

---

## 4. Required results-engine change (apply only after sign-off)

**Defect:** `DEFICIENCY_STATES` in `classifier.ts` includes `low-testosterone` and `normal-testosterone`. The deficiency count therefore mixes the testosterone result with energy markers, so low-T + one energy deficiency = 2 → `hasMultiDeficiency` true → the `multi-deficiency` branch in `resolveCtas` returns `completeMensStack` as the primary CTA for the testosterone card **before** the `low-testosterone` branch is reached. The founding-member CTA is silently suppressed. This breaks Tier 2.

**Fix (specified, not yet applied — gated on this rule's sign-off):**

1. Remove `'low-testosterone'` and `'normal-testosterone'` from `DEFICIENCY_STATES`. The multi-deficiency / Complete Men's Stack bundle should be driven by **energy/recovery markers only** (Vitamin D, Active B12, hs-CRP), matching the `04_products/CONTEXT.md` trigger table ("2+ deficiencies (Kit 2 or Kit 3)").
2. Result: `deficiencyCount` is computed on energy markers only; the `low-testosterone` branch is always reached and returns `primaryCta: foundingMember`, `secondaryCta: dailyStackZinc` as intended.
3. The Complete Men's Stack still surfaces correctly when there are 2+ *energy* deficiencies and testosterone is normal/borderline (Tiers 3–4) — its intended use.
4. Add a regression fixture: Kit 3, T = 9 nmol/L + Vitamin D < 50 + Active B12 < 37.5. Expected: testosterone card `primaryCta = founding-member-list`, `secondaryCta = daily-stack-*`; Complete Men's Stack does **not** appear as any primary CTA. (Add to `lib/results/fixtures/`.)

This is a logic change to a claim-sensitive path. Do not apply it until this rule is signed off; then apply with the fixture in the same commit.

---

## 5. Combined-result dashboard copy

Shown as the **panel summary block at the top of the Kit 3 results dashboard** when Tier 2 applies (T < 12) **and** at least one energy/recovery marker is out of range. It sits above the individual marker cards. Voice anchored to `seq-03b` (empathetic, direct, no spin).

> ### Your results
>
> Your Kit 3 panel covers two things: your testosterone, and the energy and recovery markers that affect how you feel day to day. Dr Ewa Lindo has reviewed the full panel and her notes are alongside each marker below.
>
> **Start with your testosterone.** Your results indicate a total testosterone below 12 nmol/L. That is the most important number on this report, and it is the one we want you to focus on first. It does not mean anything is medically urgent. It does mean there is a specific, measurable explanation for a lot of what you have likely been experiencing — and a clear path from here. Read the testosterone card below, then the short series of emails I will send you over the next few days. They explain what this threshold means and what your options are, including the founding-member list for when our clinical service launches.
>
> **Your energy and recovery markers add detail to the same picture.** Some of these have come back below their optimal range too. That is common alongside a testosterone result like yours. They do not change the headline, and addressing them is not a substitute for the testosterone pathway — I will always be straight with you about that. But they are worth understanding, because supporting these basics can make a measurable difference to how you feel while the clinical service is being built. Each marker is explained on its own card below.
>
> Take the testosterone result first. The rest is context, in order of what matters.

If any GP hard-block marker is also present (hs-CRP > 10, Ferritin < 30, Albumin < 35), append this paragraph to the block:

> One of your markers ({{ marker_name }}) is outside the range where general guidance is appropriate. We have flagged it on its own card with a recommendation to speak to your GP about that specific result. That is separate from your testosterone result and from anything we offer — please act on it independently.

**Liquid / data notes:** `{{ marker_name }}` populated from the first GP-block marker present. Block renders only when `kit_type_latest = 'hormone-recovery'` AND `testosterone_value < 12` AND `energy_marker_flag_count >= 1`. Reuses existing attributes; introduces no new user attribute.

---

## 6. Email sequence handling

The parallel-sequence rule already exists in `seq-03b-low-t.md` (§"Parallel sequence handling (Kit 3 only)", line ~290) and `seq-03a-energy-results.md`. This rule confirms and tightens it — no new sequence is created:

- **seq-03b handles the testosterone arm.** It is the lead sequence for any Kit 3 customer with T < 12. Unchanged.
- **seq-03a handles the energy arm and is not suppressed.** It runs in parallel for the energy markers. Unchanged.
- **No duplicate supplement pitch.** The only Daily Stack mention in seq-03b stays at Email 3, framed as "won't replace TRT" (existing copy, compliant). seq-03a's supplement CTAs stand on their own marker logic. Do not add a Complete Men's Stack pitch to seq-03b.
- **One addition:** seq-03b Email 1 currently says "Dr Ewa has reviewed your full panel (total testosterone, SHBG, Free Androgen Index, and Albumin)". For Kit 3 buyers this panel list is incomplete. Add a Liquid branch so Kit 3 recipients see "your full hormone and recovery panel" rather than the Kit 1 marker list. Flagged for the seq-03b build, not changed here.

No change to stop-goals: seq-03b still stops on `founding_member_listed`; seq-03a on its existing goals.

---

## 7. Compliance checklist (for Ewa review)

| Line / decision | Rule it satisfies |
|---|---|
| "Your results indicate a total testosterone below 12 nmol/L" — never "you have low testosterone" | Red-flag table — definitive medical statement |
| No "diagnose / treat / cure / fix" anywhere | Red-flag table |
| Founding-member CTA primary only at T < 12 on Kit 3; never from energy markers | `/03_compliance` + `04_products` Special Cases (non-negotiable) |
| "for when our clinical service launches" / "while the clinical service is being built" — never "TRT is available" | Phase 0 boundary |
| Daily Stack as honest secondary only, "not a substitute" | Phase 0 / persuasion-vs-compliance |
| No supplement ingredient claims made in the combined block; ingredient EFSA claims remain only where already approved (seq-03b Email 3, marker cards) | EFSA approved-claims table |
| Ashwagandha not mentioned | Silent-ingredient rule |
| No £75 deposit reference; founding-member described as non-cash list | FM deposit shelved 2026-05-08 |
| GP hard-block markers always surfaced independently, never converted to a sale | Results-engine trigger table (GP referral, no cross-sell) |
| Kit 3 energy framing permitted (Kit 3 covers both panels) | Kit-scoping special case (the Kit 1-only restriction does not apply to Kit 3) |

---

## 8. Approval log

| Item | Reviewer | Status | Date |
|---|---|---|---|
| Precedence ladder (§3) | Dr Ewa Lindo | Pending | — |
| Required classifier change (§4) | Keith / engineering | Pending (gated on §3) | — |
| Combined dashboard copy (§5) | Dr Ewa Lindo (compliance) + Keith (voice) | Pending | — |
| Email handling (§6) | Keith | Pending | — |
