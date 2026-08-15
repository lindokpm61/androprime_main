# Inclusion scope: what the inflammatory-markers hub says about non-lifestyle causes

**Date:** 2026-08-15
**Owner:** Keith Antony (scope) / **Dr Ewa Lindo (clinical ruling, required before anything ships)**
**Status:** PROPOSAL. Nothing here is approved and nothing has been written into the article.
**Target:** [`/blog/inflammatory-markers-blood-test`](../../09_website-app/frontend/content/blog/inflammatory-markers-blood-test.mdx),
section `### The other half: when it isn't lifestyle`.
**Why:** S19 Q1 (2026-08-15) ruled we name the causes rather than write around them, and that
the posture is **include by default, then decide what is in**. This is that list.

---

## What the hub already says, so we are not re-arguing settled ground

The section exists. It currently reads, in full: *"a dental infection (a low-grade abscess can run
hs-CRP up for months without much pain). Gut issues. An undiagnosed autoimmune condition. A long-tail
post-viral picture. None of these are things you fix with a better protein shake. They're things you
take to a GP."*

So **infection and autoimmune are already published and already Ewa-approved in that form.** The
question is not whether to introduce the category. It is whether to name the specific conditions the
AI Overview names, add the two categories we omit entirely, and restructure the passage so an answer
engine can lift it.

## The gap, measured against the live AI Overview

The AIO's causes block, verbatim structure: **Infections** (bacterial or viral, rise quickly) /
**Injuries or Surgery** (trauma or recent operations) / **Autoimmune Diseases** (rheumatoid arthritis,
lupus) / **Other Factors** (obesity, smoking, stress, pregnancy). The People Also Ask block adds
*"What cancers show high inflammatory markers?"*.

| # | Item | Recommendation | Reasoning and framing |
| --- | --- | --- | --- |
| 1 | **Injury, surgery, recent procedures** | ✅ **INCLUDE** | The one outright omission with no compliance dimension at all. A man who had a hernia repair or a dental extraction six weeks ago has a mechanical explanation for a raised number and no way to know it from our page. Purely factual, no condition named, no risk. Highest value-to-risk item on the list. |
| 2 | **Named autoimmune conditions: rheumatoid arthritis, lupus** | ✅ **INCLUDE** | The hub already says "an undiagnosed autoimmune condition"; naming two examples adds specificity without adding a claim type. Stating that RA and lupus are associated with raised inflammatory markers is a fact about the markers, published by the NHS and every source cited in the AIO. It is not a statement about the reader. **Frame as an example set, never a checklist**: "conditions like rheumatoid arthritis or lupus", not a list a reader can score himself against. |
| 3 | **Acute infection, and the scale of it** | ✅ **INCLUDE** | The hub covers the low-grade dental case but not the acute one, which is the more common reason a man sees a genuinely high number. Include the magnitude, because it is the single most reassuring fact on this page: a CRP of 60 during a chest infection is a different object from a CRP of 4 in a well man. Already partially covered by the existing "over 10 mg/L: your GP that week" threshold. |
| 4 | **Smoking** | ✅ **INCLUDE** | We already name alcohol and ultra-processed food as lifestyle drivers. Omitting smoking from that set is an inconsistency, not a safeguard. Sits in the lifestyle H3s, not this section. |
| 5 | **Cancer** | ✅ **INCLUDE, and this is the counter-intuitive one** | See below. The safest published position is to address it, because the alternative is silence on the one question the reader is actually asking. |
| 6 | **Obesity / visceral fat** | ➖ **ALREADY IN** | Covered as its own H3. No change. |
| 7 | **Stress** | ➖ **ALREADY IN** | Covered via sleep debt and training load. Naming it separately would duplicate the `signs-of-stress-in-men` article. |
| 8 | **Pregnancy** | ❌ **EXCLUDE** | Off-ICP. We write for UK men. |

## Item 5, cancer: why including it is lower risk than omitting it

The instinct is that mentioning cancer in wellness copy is the risky choice. On this page it is the
opposite, for three reasons.

1. **The reader has already asked.** It is a live People Also Ask entry on the target query. A man
   looking at a flagged marker has typed it, or thought it. Our page currently lists several causes
   and stops short of the one he is worried about, which reads as evasion and leaves him to infer.
2. **Silence permits the worse inference.** Without a sentence saying these markers are non-specific
   and cannot rule cancer in or out, a raised CRP on our page is left ambiguous. Saying so plainly
   corrects a misconception rather than creating one.
3. **It lets us disclaim a capability we must disclaim anyway.** The genuinely dangerous claim near
   this topic is any suggestion that our kit screens for cancer. Writing the passage is what forces
   that disclaimer onto the page in explicit words. Omitting the topic omits the disclaimer too.

**The framing, and every clause of it is load-bearing:**

> Inflammatory markers are not a cancer test. They cannot rule cancer in and they cannot rule it out.
> They rise in a long list of conditions, most of them common and none of them diagnosable from this
> number alone. If your result is high and it stays high after a retest, that is a GP conversation,
> and it is the reason the retest exists.

What that does: states the non-specificity, explicitly denies screening capability, avoids naming any
cancer type, gives no symptom checklist, and routes to a GP. It makes no statement about the reader.

🔴 **This is a clinical judgement and Ewa rules it, not Keith and not me.** If Ewa's answer is no, the
fallback is to keep silent on cancer and include items 1 to 4, which stand on their own.

## Rules that apply to every item above

- **Association, never diagnosis.** Every line says what can raise a marker. No line says what the
  reader has. "Your results indicate", never "you have".
- **No symptom checklists.** A list a reader can score himself against is a self-diagnosis tool.
- **No treatment, no dosage, no management advice.** Phase 0 boundary. Every route ends at a GP.
- **The existing Ewa quote stays** and is arguably the best framing on the page already: *"An elevated
  hs-CRP in a healthy active man is almost always a signal, not a diagnosis."*
- **`Label: one flat sentence` format** for the new causes, matching the atom the AI Overview lifts,
  per the S19 Q4 default. This is the packaging change, and it is half the point of the exercise.

## What happens next

1. **Ewa rules items 1 to 5**, most importantly 5. This document is the request.
2. On approval, the section is rewritten and the article's `dateModified` bumped. The hub is live and
   signed off, so this is a re-approval of changed copy, not a new article.
3. `compliance-preflight` runs on the drafted wording before it goes to her, not instead of.
4. Record `our_rank` for `what does it mean when your inflammatory markers are elevated` and
   `inflammatory markers blood test` in the next `track` snapshot. This is the first test of whether
   completing an AI Overview's passage set moves anything.

**Not approved. Ewa sign-off required before any of this reaches the live article.**
