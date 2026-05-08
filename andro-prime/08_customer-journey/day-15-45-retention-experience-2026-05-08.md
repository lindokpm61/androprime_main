# Day 15–45 Retention Experience Design

*The single highest-leverage operational lever in Phase 0. 2026-05-08.*

---

## Why this document exists

The Phase 0 cash-target benchmark (`01_strategy/research/2026-05-08-phase0-cash-target-benchmark.md`, Section 6) is unambiguous: **Daily Stack subscriber tenure is the single biggest gating factor in the entire 12-month plan.**

The arithmetic:

- A one-month tenure swing in the 3–6 month range moves 6-month net contribution by roughly £2,000 and 12-month net contribution by £4,000–5,000.
- The planning case assumes 4-month average tenure. Industry-average replenishment-subscription retention is 12-month half-life. The planning case is conservative.
- At 3-month tenure, Phase 0 fails to self-fund. At 6-month tenure, it over-delivers by ~50%.
- The critical churn window for supplement subscriptions is **days 15–45.** That window contains two specific stress points: the end of the honeymoon period (Day 15–25) and the second billing event (Day 30).

This document designs the operational experience across that window. It covers the email touchpoints, the physical-product unboxing, and the metrics that prove whether any of it is working. Every recommendation here is anchored to one question: does this make the customer more likely to be on the subscription at Day 46 than at Day 14?

---

## The customer journey through Day 15–45

A linear walkthrough of what actually happens, day by day, for a Daily Stack subscriber who came in via Kit 2 (the most common path):

| Day | Event |
|---|---|
| 0 | Customer buys Kit 2. Order confirmation email fires. |
| 1–3 | Kit dispatched. Tracking email fires. |
| 4–7 | Kit arrives. Customer is reminded to take the sample (seq-02 Email 2). |
| 7–10 | Customer takes finger-prick sample. Returns by Royal Mail. |
| 10–12 | Lab processes; result lands in dashboard. |
| 12–14 | Result email fires (seq-03a). Daily Stack subscription offer is in the result page. Customer subscribes — this is the start of the retention clock. |
| 14–17 | First Daily Stack delivery dispatched and arrives. Customer takes first capsule. **Honeymoon window opens.** |
| **15–25** | Customer takes the supplement daily. They notice nothing measurable (correctly — supplements don't act like drugs). The novelty wears off. **First doubt enters.** |
| **25–30** | Second billing approaches. Customer sees the £34.95 charge on their bank statement and asks the silent question: *"Is this actually doing anything?"* |
| 30 | Second billing fires. Second delivery dispatched. |
| 30–33 | Second delivery arrives. **This is a high-leverage moment.** A second box on the doorstep is either reassuring or it triggers the cancel decision. |
| 33–45 | Customer is past two billings. If they're still here, they have implicitly committed twice. Tenure probability rises sharply from this point. |

The "is it working?" anxiety **peaks around Day 25–35**. That's the operational target. Address it directly, with honesty, before the customer reaches for the cancel button.

---

## Existing seq-04 review

`seq-04-subscriber-onboarding.md` is a 5-email sequence currently scheduled at: Day 0 (transactional), Day 5, Day 20, Day 30, Day 75.

**What works:**

- Email 2 (Day 5) sets accurate expectations on the supplement timeline: "Weeks 1–2: nothing measurable." This is the right framing — the most common failure mode for supplement subscribers is expecting drug-like effects.
- Email 3 (Day 20) is a check-in with a reply-prompt. The "what's been the biggest change you've noticed, if any?" question is well-judged — it converts a passive subscriber into an engaged one.
- Email 4 (Day 30) acknowledges the second delivery and frames the retest as the close-the-loop mechanism. The "most common reason men cancel isn't that it stopped working, it's that they have no way to know whether it's working" line is the strongest piece of retention copy in the sequence.
- Compliance is clean: "find out how your levels have changed," not "find out if it worked." Retest framing is correct.

**What's missing for the Day 15–45 window:**

1. **No Day 15 nudge.** The honeymoon-fade window opens around Day 15. Email 2 fires at Day 5 (early novelty); Email 3 fires at Day 20 (already past peak doubt). There's a gap.
2. **No pre-billing acknowledgement.** The customer hits Day 30 with no warning that the charge is coming. A short Day-25 "your second delivery is on its way next week" note would soften the bank-statement moment.
3. **No "is it working?" check-in around Day 35.** Email 4 acknowledges the second delivery on Day 30 but pivots immediately to retest framing. The customer is more likely thinking "should I cancel?" than "should I book a retest in 60 days?" at that moment.
4. **No physical-product layer.** Email is half the experience. The unboxing and the insert design are not specified anywhere in the current sequence brief.

**Verdict:** seq-04 needs **augmentation, not redraft.** The voice, compliance posture, and overall arc are sound. The gaps are two new touchpoints (Day 15, Day 35) and one repurposing of Email 4 (split the second-delivery acknowledgement from the retest pitch) plus the physical-product layer.

---

## Recommended Day 15–45 retention touchpoints

Five touchpoints across the window. Touchpoints 1, 3 and 4 are net-new. Touchpoint 2 is an augmentation of seq-04 Email 3. Touchpoint 5 is the existing seq-04 Email 4, lightly reframed.

### Touchpoint 1: Day 15 nudge — "Two weeks in"

**Format:** Short email. ~80 words. SMS-length feel.
**Purpose:** Re-engage during the honeymoon-fade window, before the doubt sets in. Reinforce the habit. No CTA beyond reply.
**Voice:** Keith. Direct, light.
**Compliance:** No EFSA claims needed at this length. Habit framing only.

**Sample copy:**

> Subject: Two weeks in.
>
> Two weeks in. Most men either forget a day or two by now, or they've slotted it next to coffee and stopped thinking about it.
>
> If it's the first one — no drama, just put the bottle next to whatever you do every morning. The habit is the product as much as the supplement is.
>
> If it's the second — you're doing it right. Don't read anything into how you feel yet. Week 4 onwards is where the picture starts to form.
>
> Keith
> Andro Prime

### Touchpoint 2: Day 25 "what to expect" pre-billing email

**Format:** Email. ~200 words.
**Purpose:** Pre-empt the second-billing surprise. Set expectation that the next charge is coming. Reframe month 2 as the meaningful month, not the routine one.
**Voice:** Keith. Practical.
**Compliance:** Use Active B12 energy-metabolism claim and Vitamin D3 muscle-function claim verbatim if referenced. No "is it working" framing yet — that comes at Day 35.

**Sample copy:**

> Subject: Your second delivery is dispatching in 5 days.
>
> Quick heads-up: your next Daily Stack billing is on [Day 30], and the next delivery dispatches the same day.
>
> Why I'm flagging it: month two is when the picture starts to form. The active ingredients have built up. Vitamin D3 contributes to normal muscle function. Active B12 contributes to normal energy-yielding metabolism. Those claims are conservative on purpose — what they mean in practice is that markers move before the subjective experience does, and the subjective experience builds gradually rather than landing in one obvious moment.
>
> If anything's wrong — a delivery issue, a billing question, or you want to pause for a month — your account page is the quickest route: andro-prime.com/account. Or reply here and I'll sort it.
>
> Keith
> Andro Prime

### Touchpoint 3: Day 30 second-delivery moment

**Format:** Physical (insert in second box) + a short transactional email when delivery is dispatched.
**Purpose:** Make the second-delivery arrival a positive signal rather than a "another box" moment. The customer has now physically acquired two months of product — that's a commitment marker we should acknowledge.

**Email (~60 words):**

> Subject: Box two is on the way.
>
> Your second Daily Stack delivery has just left us. You should have it in 2–3 working days.
>
> One small thing: there's a card in this box. Worth a 30-second read when you open it.
>
> Keith
> Andro Prime

**Insert in second box (printed card, A6, single side):**

> **Month two.**
>
> Most men cancel a supplement subscription because they have no way to know whether it's working — not because it stopped working.
>
> The retest at Day 90 closes that loop. We'll send you a 10% subscriber code at Day 75. No action needed from you now.
>
> Until then, the only thing that matters is taking these every morning.
>
> Keith — Andro Prime

### Touchpoint 4: Day 35 "is it working?" check-in

**The single most important touchpoint in the entire window.** This is the email that addresses the silent question directly, before the customer cancels.

**Format:** Email. ~280 words. Reply-prompt at the end.
**Purpose:** Address the "is it working?" anxiety with honesty rather than reassurance. Honest framing — supplements aren't dramatic, they're foundational. Reference EFSA claims to anchor what the supplement actually does.
**Voice:** Keith. The most "pub test" of all the emails.
**Compliance:** EFSA claims used verbatim. No "raises testosterone." No "fixes." No ashwagandha. Retest framing uses "find out how your levels have changed."

**Sample copy:**

> Subject: Five weeks in. The honest answer.
>
> Five weeks in. If you're starting to wonder whether this is actually doing anything, you're asking the right question. Most men do at this point.
>
> The honest answer is: it depends what "working" means.
>
> If you're expecting it to feel like a drug — a step change, an obvious lift — you'll be disappointed. That's not what supplements do. It's also not what the EFSA-approved claims behind the formula say they do.
>
> What the formula actually does:
>
> - **Zinc** contributes to the maintenance of normal testosterone levels.
> - **Vitamin D3** contributes to normal muscle function.
> - **Active B12** contributes to normal energy-yielding metabolism.
>
> Read those carefully. None of them say "raises" or "fixes." They say "contributes to maintenance of normal." That's the right way to think about Daily Stack: it's keeping the floor solid, not raising the ceiling. Foundational, not transformative.
>
> The reason to stay on it long enough to retest at Day 90 isn't that you'll feel a transformation by then. It's that the blood markers will tell you whether your levels have actually moved — and that number is more honest than how you feel on any given Tuesday.
>
> If you've noticed something — energy, recovery, sleep, anything — I'd genuinely like to hear about it. Reply to this. I read every one.
>
> Keith
> Andro Prime

### Touchpoint 5: Day 45 retention nudge

**Format:** Email. ~150 words.
**Purpose:** Just past the second billing. Customer has committed twice. Reinforce the long-game framing. Soft mention of the Day-90 retest. Quiet confidence rather than retention-anxiety energy.
**Voice:** Keith. Brief.
**Compliance:** Retest framing uses "how your levels have changed." No fix/cure language.

**Sample copy:**

> Subject: Day 45. You're past the hard bit.
>
> Day 45. You're past the second billing, you've taken roughly 90 capsules, and the supplement has had time to build up properly.
>
> The next milestone is Day 90 — the retest window. Your before-result is already in your dashboard. The after-result will sit alongside it, and you'll see exactly how your levels have changed across the markers we measured the first time.
>
> I'll send you the subscriber code for the retest at Day 75. No action needed from you now.
>
> Keep going.
>
> Keith
> Andro Prime

---

## First physical-product unboxing experience

Email is half of retention. The product-side experience is the other half. The first Daily Stack box (arriving Day 14–17) and the second box (arriving Day 30–33) are both retention moments, not just fulfilment events.

### First box (Day 14–17 arrival)

**Packaging:**

- Outer box: matt black, no shouting. Brand-consistent with kit packaging so the customer recognises it as Andro Prime.
- Inner: bottle in a plain corrugated cradle. No tissue paper, no fillers. The aesthetic is "considered," not "luxe."

**Insert — the start-here card (A5, double-sided):**

- Front: "Daily Stack — Month 1." Three lines on dosing: 2 capsules with food, ideally morning, consistency over perfection.
- Back: "What to expect." Three short paragraphs:
  - Weeks 1–2: nothing measurable. This is normal.
  - Weeks 3–5: some men notice gradual changes; some notice nothing yet. Both are normal.
  - Weeks 8–12: the right window for a retest.
- Bottom: "Reply to any of our emails to reach Keith directly."

**What to AVOID on the first-box insert:**

- Any "boost," "raises," "fixes" language.
- Any reference to ashwagandha. (Silent ingredient — root `CLAUDE.md` rule.)
- Any leaflet-style "supplement facts" panel that reads like a pharmacy product. The label has the technical detail; the insert is the human voice.
- Any hard CTA. The first box is not a sell moment.

### Second box (Day 30–33 arrival)

**Packaging:** Identical to first box — consistency itself is a signal.
**Insert:** The "Month two" card specified in Touchpoint 3 above. A6, single side, ~70 words.
**Optional:** A small physical token of the Day-90 retest — e.g. a card with "Day 90 retest — coming soon, 10% subscriber discount." Sets the expectation that the journey has a measurable end-point.

### What to AVOID across both boxes

- Branded swag (stickers, keyrings, etc.). The ICP is 35–55 men who have no use for any of it. It signals fluff.
- Discount inserts for unrelated products. Cross-sell belongs in email, not in the box.
- Anything that reads like a clinical leaflet. The voice has to match the email voice. If Keith wouldn't say it to a friend, it doesn't go in the box.

---

## Compliance constraints to bake in

Every piece of copy in this document — and every variant a copywriter might produce from these directions — must clear the following gates. These reflect `03_compliance/CONTEXT.md` and `04_products/supplements/daily-stack.md`.

**Permitted EFSA claims (verbatim, or plain-English derivatives that do not exceed):**

- Zinc: "Contributes to the maintenance of normal testosterone levels."
- Vitamin D3: "Contributes to normal muscle function."
- Active B12 (Methylcobalamin): "Contributes to normal energy-yielding metabolism" and/or "Contributes to normal psychological function."

**Banned vocabulary across all retention copy:**

- "Diagnose," "diagnosis," "treat," "treatment," "cure."
- "Raises testosterone," "boosts testosterone," "fixes" (anything).
- "Clinically proven" without a specific RCT citation.
- Any mention of ashwagandha, in any context, ever. It is a silent ingredient. Affiliate briefs, influencer talking points, customer emails, packaging inserts, social — all silent.
- "Find out if it worked" or any retest framing that implies fix/cure. Always: "find out how your levels have changed."

**Edge cases flagged in this document:**

1. **Touchpoint 4 ("is it working?" honesty framing):** The email explicitly says "if you're expecting it to feel like a drug, you'll be disappointed." This is unusual copy for a supplement brand and could be read as undermining the product. It is not — it is honest expectation-setting that is consistent with the EFSA "contributes to maintenance" claims (which are themselves modest). Keith should sign off on this email personally before it goes live; if compliance review wants softer framing, the alternative is to lead with the EFSA claims first and the "honest answer" framing second.
2. **Retest framing across Touchpoints 4 and 5:** Both use "how your levels have changed." Confirmed compliant per `03_compliance/CONTEXT.md` Special Cases. Do not let a copywriter adjust this to "see if it worked" or similar.
3. **Touchpoint 3 insert ("most men cancel because they have no way to know whether it's working"):** This is retention-honest copy lifted from existing seq-04 Email 4. Already in production-style use. Compliant.

---

## Metrics to instrument

What to measure from launch, and where the source of truth lives:

| Metric | Definition | Source | Target (Phase 0 planning case) |
|---|---|---|---|
| Day-30 churn | % of Daily Stack subscribers who cancel before second billing fires | Stripe (subscription cancellation events) | <25% |
| Day-45 churn | % cancelled before Day 45 (past second billing) | Stripe | <30% cumulative |
| Day-90 retention | % still active at Day 90 (the retest window) | Stripe | >50% (planning case is 4-mo half-life) |
| Touchpoint open rates | Opens per send for Touchpoints 1–5 | Customer.io | >45% on Touchpoint 4 (highest-stakes) |
| Touchpoint 3 reply rate | Replies to the "is it working?" email | Customer.io / inbox | >5% (proxy for engagement) |
| "Is it working?" support volume | Inbound tickets/replies asking about results, timeline, doubt | Helpscout (or Intercom) tag | Decreasing trend over 3 cohorts |
| Day-90 retest conversion | % of Day-75 retest-prompt recipients who buy a retest kit | Stripe + Customer.io | >15% (the longer-term success measure) |

**Cohort tracking matters more than aggregate numbers.** Tag every Daily Stack subscriber with their start month. The question to answer monthly: "Is the M1 cohort retaining better than the M0 cohort? Is M2 better than M1?" If the touchpoints work, every cohort should retain better than the one before it as the sequence is iterated.

**One leading indicator worth instrumenting:** capsule-stockout signals. If a customer's second delivery would arrive after they'd run out (e.g. delivery slipped), churn risk doubles. Stockout-risk emails (a Day 27 "your second delivery is on track for [date]" note) cost almost nothing and protect the most fragile moment in the journey.

---

## Implementation priority

Not everything needs to ship for M1. Ranked:

### M1 — must ship at launch

1. **Touchpoint 4: Day 35 "is it working?" check-in.** Highest-leverage single touchpoint. Build this first.
2. **Touchpoint 1: Day 15 nudge.** Cheapest to build (short email, no Liquid logic). Closes the seq-04 gap.
3. **First-box insert (start-here card).** The first box is going out from Day 14 of operations. The insert has to be in the box.
4. **Day-30 churn cohort tracking in Stripe + Customer.io.** Without this, none of the rest can be measured.

### M2 — ship within 6 weeks of launch

5. **Touchpoint 2: Day 25 pre-billing email.** Augments existing seq-04 Email 3 timing.
6. **Touchpoint 3 second-box insert.** Requires print run; lead time is the bottleneck.
7. **Touchpoint 5: Day 45 retention nudge.** Lower priority than 1–4 because it fires after the highest-risk window.
8. **Stockout-risk Day 27 trigger.** Engineering work to wire delivery-status signal into Customer.io.

### M3 — iterate based on cohort data

9. **A/B test on Touchpoint 4 framing.** Honesty version vs softer EFSA-claim-led version. Measure Day-90 retention by variant.
10. **Reply-rate analysis on Touchpoint 4.** Use the actual customer language in M2-onwards copy iteration.
11. **Retest-conversion uplift testing.** Whether the Touchpoint 3 insert reference materially improves Day-90 retest conversion.

**Rough cost/benefit:**

- Touchpoint 4 alone, if it adds one month of average tenure, is worth £4,000–5,000 of 12-month net contribution — for a ~£200 copywriter cost and ~2 hours of Customer.io build. Highest ROI item in the entire Phase 0 plan.
- The full Day 15–45 retention package (Touchpoints 1–5 + inserts + cohort instrumentation) costs a few thousand pounds to build and could swing the planning case by 1.5–2 months of average tenure if all five work as intended. That's £6,000–10,000 of net contribution movement at 12 months.

---

## Cross-references

- `09_website-app/frontend/email-templates/sequences/seq-04-subscriber-onboarding.md` — existing 5-email sequence; this document specifies augmentations, not replacement.
- `04_products/supplements/daily-stack.md` — V7.2 formulation, EFSA claims, ashwagandha silent-ingredient rule.
- `06_marketing/content/copy-content-context.md` — voice rules, pub-test, Keith voice anchor.
- `03_compliance/CONTEXT.md` — red-flag language, EFSA approved claims, retest framing rule.
- `01_strategy/research/2026-05-08-phase0-cash-target-benchmark.md` — Section 6, the benchmarking that identifies tenure as the dominant gating factor.
- `01_strategy/financial-model/option-4-financial-model-2026-05-08.md` — v2 model, §4.1 tenure sensitivity.
- `09_website-app/frontend/email-templates/transactional/transactional-emails.md` — T-05 subscription-confirmed transactional referenced by seq-04 Email 1.

---

*End of design doc. 2026-05-08. UK English. UK & NI scope. For Keith review and seq-04 augmentation brief.*
