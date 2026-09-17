<!--
The text written to the ClickUp task for CA-052, kept here so the board and the repo
can be diffed. The BOARD is the hub and outranks this file; this is the mirror.
Written by `09_website-app/frontend/scripts/clickup-approval-task.ts`.
-->

🟢 **APPROVED — Keith, 2026-09-17. Nothing is owed.** N-1 was ruled before the signature, in his words *"N-1: no change"*: the built version stands, and no code moved on the ruling. 🟢 **This was the last copy record gating the flag flip** — CA-050, CA-051 and CA-052 are all signed, the interlock reads 0 sentences on 0 pages, and nothing still outstanding on `MEMBERSHIP_ENABLED` is a copy question. Nobody else is required. Ewa is not a signer, on the same tested condition as CA-050 and CA-051.

**This is H-A**, the one HARD finding that survived CA-050's signature. That record's condition 1 said so in its own words: it holds *"whether or not this record is signed first"*.

**Artefact:** `09_website-app/frontend/lib/membership/subscriptionCopy.ts`, the new shared constant `RENEWAL_CLAUSE` and its four consumers: the `/kits` C1 money block, both kit-LP FAQ answers, and the homepage membership sentence.

**Record:** `03_compliance/content-approval/approval-record-renewal-start-anchor-2026-09-17.md`
**Register:** `content-approval-register.md`, row CA-052. **Defect:** H-A.

## What was wrong

> On day 31 that card is charged GBP 47 a month.

**A charge date with no starting point, in a paragraph that anchors on *today*.** A buyer counts 31 days from checkout. **Day 1 is the day the RESULT lands**, and the real gap adds dispatch, sampling, return post and lab turnaround, so the true first charge is weeks later than the sentence implies. It is a priced representation of when money leaves a card, on the surface the DMCC Act 2024 Part 4 prominence duty is being honoured on.

**The direction of the error favours the customer**, which is exactly why no phrase-matching gate could see it.

## What it says now, and why this is not new wording

> The price on the card is everything you pay today, and it includes your first 30 days of membership. **It starts when your first result lands, and on day 31 it becomes GBP 47 a month. Cancel anytime.** No charge to see your own results, and no surprise second test.

**The bolded clause is lifted verbatim from your own homepage sentence**, which CA-050 already approved and which was already saying it correctly while `/kits` and both FAQs were not. It is now one constant with four consumers rather than four sentences, so they cannot drift apart again.

**Delta measured against the approved CA-050 baseline, field by field, not asserted:**

- **Flag OFF: no field changed.** Nothing currently live moves.
- **Flag ON: three fields** changed, the C1 paragraph and the two FAQ answers.
- **The homepage sentence is byte-identical.** It reads the constant instead of spelling the clause out, and the output is character for character what CA-050 approved.

## The decision, ruled

- ✅ **N-1 RULED: NO CHANGE, Keith 2026-09-17.** The built version stands: C1 states the fact in the same words as the homepage, the two kit-LP FAQs and the constant they all read. **No code moved on the ruling.** The alternative, keeping *"that card is charged"* everywhere, is recorded as considered and refused rather than never raised, and it would have changed the homepage sentence CA-050 already signed. Original framing kept below.

### The original framing, kept because the reasoning is the record

- 🔵 **N-1: C1 loses *"that card is charged"*.** The old C1 said *"On day 31 that card is charged GBP 47 a month"* while the homepage said *"it becomes GBP 47 a month"*. **Keeping both would put one fact in two vocabularies within the payload, which is the exact defect you ruled on as F4 on 2026-09-17**, so one had to go and the anchored homepage version is the one that carries the fix. **What that costs is C1's concrete card language**, which is the more vivid way to say money is leaving a card, and C1 is the money block. **The alternative** is `It starts when your first result lands, and on day 31 that card is charged GBP 47 a month.` everywhere, which keeps the card verb and is still a recombination of approved fragments, but it is a wording change on the homepage sentence you already signed. Your call.

## Two things flagged rather than decided

- 🟠 **The new clause is unconditional, and it is the same shape as CA-050's K-1.** *"It starts when your first result lands"* is stated without exception, while `startOnResult.ts` refuses a membership outright for a confirmed testosterone under 12 nmol/L, which is your own ruling of 2026-09-17. **K-1 said the same thing about *"included in the price of every kit"***. This record does not create the issue and does not worsen it, but it adds a call site: **if K-1 ever gets a scope word, this clause needs the same one**, or the two sentences will disagree about the same exception. Naming the exception outright would put a clinical routing fact on a buy page and pull Ewa in; a scope word would not.
- ⚠ **The two FAQ answers get about 38 characters longer**, because the clause is a sentence rather than a subordinate phrase. No layout consequence: they are accordion answers, not chips.

## How it is enforced, rather than just written

**H-A happened because the rule existed only as prose.** The homepage obeyed it and three other surfaces did not, and nothing could tell the difference. So `scripts/test-standing-claim.ts` now asserts it:

- **Case 10: no string in the flag-on payload may name the charge day without naming the starting point.** It walks the whole payload rather than a list of fields, so a new sentence inherits the rule automatically.
- **Case 10b: every surface that states it must state it in the SAME wording** (the F4 rule, mechanised).
- **Case 10c: the anchor phrase is read out of the approved 2026-09-11 draft** rather than typed into the test.

**Both were mutation-verified**, and 10b failed that test the first time: it derived its expected clause from the first surface it found, so reverting *that* surface made every assertion pass while the defect was present. **A check that reads its expected value out of the data it is checking cannot fail when the first row is the wrong one.** It now requires every mention to yield a clause and the set of clauses to have exactly one member.

## Pre-flight

**0 HARD / 0 REVIEW / 0 CODE-COMMENT on both payloads.** Unit of scan was the extracted copy, not the module. 41 assertions in the suite, `typecheck`, `npm test` and the copy interlock all clean; the interlock reads 0 sentences on 0 pages.

## Conditions

**Supersedes CA-050's C1 paragraph and its two FAQ answers on approval.** The rest of CA-050 stands, including the homepage sentence, which is unchanged. `STRIPE_PRICE_MEMBERSHIP` is still unset, inherited. The flip is still a rebuild and redeploy rather than an env change.

---

✅ **SIGNED 2026-09-17.** Claude created this at `pending` and never moved it; Keith did. Recording a ruling and performing the approval stayed two separate acts.

⚠ **N-2 SURVIVES THE SIGNATURE AS A STANDING TIE, not as an owed item.** The clause is unconditional while `startOnResult.ts` refuses a membership for a confirmed testosterone under 12, the same shape as CA-050's K-1. **If K-1 ever takes a scope word, this clause needs the same one**, or the two sentences will disagree about the same exception.

⚠ **Board first this time, then the repo.** The record was written after this task existed, which is the order the convention asks for and the opposite of what happened on CA-050.
