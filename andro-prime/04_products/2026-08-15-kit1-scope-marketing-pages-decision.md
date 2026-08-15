# Decision: Kit 1 fatigue framing on the marketing pages is split and routed, not deleted

**Date:** 2026-08-15
**Owner:** Keith Antony (decision delegated and taken 2026-08-15)
**Status:** ✅ **DECIDED, APPLIED AND VERIFIED IN A REAL RENDER 2026-08-15 (Keith's go).** All four
pages edited, `tsc --noEmit` exit 0, `compliance-preflight` **0 HARD**, regression tests pass.
⚠️ **Committed to the working tree only. Not pushed, therefore not deployed.**
**Workspace:** `04_products` (rule owner), executed in `09_website-app`
**Open since:** 2026-08-02, in `03_compliance/STATE.md`

---

## The problem, restated from the evidence rather than the summary

Kit 1 measures testosterone only (Total T, SHBG, FAI, Albumin, Free T). `04_products/CONTEXT.md` §5
and the "Kit 1 copy scope" rule are explicit: do not frame Kit 1 as explaining general fatigue, energy
or recovery, because those belong to Kit 2 and Kit 3. **CA-025 approved that rule on 2026-07-19 and it
is live in the results engine** behind `KIT_SCOPE_NOTE_ENABLED`.

The marketing pages contradict the engine. Four of them:

| Page | File | The out-of-scope copy |
|---|---|---|
| `/kits/testosterone` | `app/(marketing)/kits/testosterone/page.tsx` | **L264** *"you're still tired, your focus is gone"*; **L281-282** symptom cards *"Exhausted by 3pm no matter how much sleep you get"* and *"Brain fog. Losing focus at work."* Two of the three symptom cards are not testosterone-scoped. |
| `/lp/testosterone` | `app/lp/testosterone/page.tsx` | **L254, L271-272**, the same copy. This is a **paid-ad landing page**, so it is the one with money behind it. |
| `/kits` | `app/(marketing)/kits/page.tsx` | **L226** Kit 1 "Right for": *"Low energy, low drive, 'not myself' symptoms"*. |
| `/` | `app/(marketing)/page.tsx` | **L358** Kit 1 card: *"Essential for men experiencing fatigue, reduced muscle mass, or low drive."* |

`03_compliance/STATE.md` already established this is **not a new clinical ruling** and should not go to
Ewa as one: CA-025 settled the rule, so this is a `/decision-sweep` of an approved decision. What was
left open, and what is decided here, is **the routing half**: where fatigue intent goes, because
deleting the words alone relocates the problem rather than fixing it.

---

## Decision: apply the CA-033 remedy. Split the presentation and route it. Delete nothing.

**Three days ago the identical defect was found and fixed one layer down, and that fix is the
template.** `TestSelectorQuiz.tsx` Q1 option (a) read *"I am knackered, my drive has gone, or I just do
not feel like myself anymore"*, which is two presentations in one option, and it returned Kit 1 to
fatigue readers. CA-033 fixed it **by splitting the option, not by rewriting the map**: (a) narrowed to
the hormonal presentation, a new value `d` carried the fatigue picture to Kit 2, every other branch
untouched.

The marketing pages have the same defect in prose form and get the same remedy. Four reasons:

1. **Deleting the fatigue words fails on its own terms.** It strips the strongest hook from the
   highest-intent page and leaves the fatigue reader with nowhere to go, which is the outcome
   `04_products/CONTEXT.md` names as the negative-review scenario: *man buys Kit 1, T is normal, gets
   Daily Stack, still feels terrible because the cause was Vit D or B12.* Silence routes him to Kit 1
   anyway, just with worse copy.
2. **One rule should have one remedy.** The quiz and the pages enforce the same CA-025 rule. Fixing
   one by splitting and the other by deleting leaves the site with two behaviours for one rule and
   nothing recording why.
3. **The replacement wording already exists on our own site and is already shipped.** `/kits` L287,
   the **Kit 2** row, reads *"If the issue is hormones, Kit 1 or Kit 3 is the better fit."* The Kit 1
   entries need the mirror of that sentence. So this is a **claim reduction plus an
   already-approved-direction wording**, not new claims copy.
4. **`/kits/testosterone` already has the mechanism.** L503 carries a Kit 3 cross-sell
   (*"Want to check testosterone AND energy/recovery markers?"*). The page can already hand a reader
   sideways; it just does not do it for the fatigue reader, and it points at Kit 3 (£179) where Kit 2
   (£119) is the honest complement per the 2026-07-08 complement rule.

### Sign-off: Keith's call, not Ewa's, and the reasoning is load-bearing

Exactly the CA-033 parallel. **Because the remedy removes the out-of-scope outcome rather than
accepting it, the CA-025 clinical question does not reopen.** Had the decision been to keep the
fatigue framing on Kit 1 and argue it was within scope, that would need Ewa's signature and not a
business call. It was not, so it does not. Recorded here explicitly because that distinction is what
makes this safe to take as a business decision.

---

## The copy, per page. Drafted, pre-flighted, NOT shipped

`compliance-preflight` on **the customer-facing copy in isolation** (the blocks below, extracted and
scanned on their own): **0 HARD / 0 REVIEW**, zero em dashes.

⚠️ Scanning this *whole document* returns **0 HARD / 8 REVIEW**, and all eight are the word
"fix"/"fixed"/"fixes" in the internal prose above and below, caught by the retest-efficacy rule
("never say fixed"). **None is in the copy.** The right test for a decision doc is the extracted copy,
not the doc, because an internal document discussing a remedy will always trip a rule about promising
one. Noted so the next reader does not treat the 8 as a finding, and because the doc-versus-copy
distinction is a real gap in how the scanner gets pointed at things.

### 1. `/kits/testosterone` and 2. `/lp/testosterone` (same copy, both pages)

**L264 / L254**, narrow the lead to the hormonal presentation:

> You're doing everything right. You're training. You're eating well. But your drive has gone, your training has stalled, and you don't feel like yourself anymore.

**The symptom cards**, replacing the two out-of-scope ones and keeping the third:

> - **Drive and motivation just gone.** Libido has flatlined.
> - **Training has stalled.** Strength and muscle going backwards on the same programme.
> - **Mood and edge have flattened,** and it is not just a bad week.

**Then the routing card, new, directly beneath them.** This is the piece that stops the fix relocating
the problem:

> **Mainly tired, foggy, or slow to recover?** Testosterone is not the first thing to check. The Energy and Recovery Check looks at Vitamin D, Active B12, inflammation and iron stores instead. [See Kit 2: £119 → `/kits/energy-recovery`]

**Also on `/kits/testosterone` L503:** repoint the existing sideways cross-sell from Kit 3 (£179) to
Kit 2 (£119), or keep both. Kit 3 is a front-of-funnel default and Kit 2 is the complement, per the
2026-07-08 complement rule; offering only the £179 option to a reader we have just told to look
elsewhere reads as an upsell. **Flagged rather than decided**: it touches the kit ladder, not the
scope rule.

### 3. `/kits` L226

> **Right for:** Low drive, stalled training, "not myself" symptoms

And the mirror sentence into the Kit 1 body, matching L287's existing Kit 2 wording:

> If the main problem is tiredness, poor recovery or fogginess, Kit 2 is the better fit.

### 4. `/` homepage L358

> Baseline hormonal assessment. For men whose drive, training response or muscle have gone backwards.

**Deliberately NOT changed on the homepage: the "Symptom Diagnostic" block (L263-266).** It lists
persistent fatigue, prolonged recovery, diminished drive and brain fog, which reads out of scope in
isolation. In place it is not: it sits under an H2 about **testosterone thresholds specifically**, it
carries no CTA of its own, and it is followed by the **three-kit** grid rather than by Kit 1 alone. The
homepage sells the range; the defect there is the Kit 1 card claiming fatigue, and that is L358. Fixing
only L358 is the smaller change and the correct one. **Recorded so a later reviewer does not re-flag
the block and "fix" it into incoherence.**

---

## Applied and verified 2026-08-15

**Not asserted from the diff. Checked in a real browser render at two viewports.**

- ✅ **All four pages edited**, 48 insertions / 9 deletions. `tsc --noEmit` **exit 0**.
- ✅ **`compliance-preflight` across all four: 0 HARD.** Two REVIEW hits, both on the homepage and
  **both pre-existing** (the Collagen EFSA line at L455 and a code comment about the 2026-06-04 FM
  removal at L473). Confirmed against the diff: neither is in the changed lines.
- ✅ **Rendered-DOM assertions on a clean dev server**, all four pages HTTP 200: the new strings are
  present and the out-of-scope ones are gone. `exhausted by 3pm` and `brain fog` no longer appear on
  either Kit 1 surface; `low energy, low drive` is gone from `/kits`; `essential for men experiencing
  fatigue` is gone from the homepage. **0 failures.**
- ✅ **Screenshots read as images at 1400px and at a true 390px mobile viewport**, with
  `document.scrollWidth === window.innerWidth === 390` on both Kit 1 surfaces, so the new routing card
  introduces no horizontal overflow. The dashed border reads as distinct from the symptom cards and
  the button matches the site's existing style.
- ✅ **Regressions pass:** `test-quiz-routing.ts` 21/21 (the CA-033 assertions that no fatigue
  combination returns Kit 1), `test-kit-cta.ts` 11 pillars clean.
- ⚠️ **Working tree only. Not pushed, so not deployed.** A push to `main` is a deploy, so this ships
  when Keith pushes.

**Two things found while verifying, neither caused by this change:**

1. 🔴 **The dev server on `localhost:3000` returns 500 on every page**, including four this change
   never touched (`/about`, `/faq`, `/how-it-works`, `/blog`). A clean server on another port serves
   all four at 200. Pre-existing and unrelated, but somebody is looking at a broken local site.
2. 🔵 **A verification method that produced a false negative, recorded so it is not repeated.** The
   first render check reported the new copy absent from the paid LP. It was there. The probe matched
   case-sensitively against `innerText`, which returns text **after** CSS `text-transform: uppercase`,
   so `"Training has stalled"` never matched the rendered `"TRAINING HAS STALLED"`. **A case-sensitive
   assertion against rendered text is unsound on any site that uppercases in CSS**, and this one
   uppercases nearly every heading. All assertions are now lowercased on both sides.

## What is owed

1. ~~Keith's go on the four edits~~ ✅ given and applied 2026-08-15. They are claim reductions on
   approved-direction wording, so no fresh CA number is strictly required, but the register should
   carry a line because four customer-facing pages changed.
2. **The Kit 3 vs Kit 2 sideways offer on `/kits/testosterone` L503**, flagged above, is a kit-ladder
   question and is not decided here.
3. **Regression coverage.** CA-033 shipped `scripts/test-quiz-routing.ts` with 21 assertions that
   assert **no** fatigue combination returns Kit 1, rather than pinning today's output. Prose has no
   equivalent guard, and the drift this document fixes is exactly what an unguarded rule looks like
   after four weeks. **Recommend a string-level check** in the same suite: fail if the Kit 1 page,
   the Kit 1 LP, or the Kit 1 card on `/kits` and `/` contains `fatigue`, `tired`, `exhausted` or
   `brain fog` outside a block that also links to `/kits/energy-recovery`. Cheap, and it is the only
   thing here that prevents the same regression in October.
