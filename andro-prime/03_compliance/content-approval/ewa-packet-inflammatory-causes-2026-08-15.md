# Ewa packet: naming the non-lifestyle causes in `inflammatory-markers-blood-test`

**Date:** 2026-08-15
**Requested by:** Keith Antony
**Ruling required from:** Dr Ewa Lindo (GMC-registered GP, Andro Prime medical reviewer)
**Article:** [`/blog/inflammatory-markers-blood-test`](../../09_website-app/frontend/content/blog/inflammatory-markers-blood-test.mdx) (published, Ewa-approved)
**Section affected:** `### The other half: when it isn't lifestyle` (one section; the rest of the article is untouched)
**Scope reasoning:** [`06_marketing/seo-ai-search/2026-08-15-inflammatory-causes-inclusion-scope.md`](../../06_marketing/seo-ai-search/2026-08-15-inflammatory-causes-inclusion-scope.md)

⛔ **Nothing is approved by this packet and nothing has been changed.** The live article and the
database are untouched. This requests a ruling.

🔗 **Sibling request, same underlying question, already pending:** *"Ewa sign-off: name the 4 medical
causes of fatigue in why-am-i-always-tired (E1-E5)"*. **Ewa may prefer to rule the principle once and
apply it to both**, rather than answer the same question twice. If the principle is refused there it
is refused here, and this packet is withdrawn.

---

## What is being asked

The section already names non-lifestyle causes, in Ewa-approved wording: *"a dental infection (a
low-grade abscess can run hs-CRP up for months without much pain). Gut issues. An undiagnosed
autoimmune condition. A long-tail post-viral picture."*

So the category is not new. Four changes are proposed:

1. **Add injury, surgery and recent procedures**, which the section omits entirely.
2. **Name two example autoimmune conditions** (rheumatoid arthritis, lupus) where it currently says
   "an undiagnosed autoimmune condition".
3. **Give infection its acute scale**, not only the low-grade dental case.
4. **Address cancer**, which the section is silent on and which is a live People Also Ask on the
   target query.

Plus a formatting change: `Label: one flat sentence` blocks, which is the form the Google AI Overview
demonstrably lifts. The current passage is a single narrative paragraph.

## Why cancer is proposed as an inclusion rather than an omission

The instinct is that naming cancer in wellness copy is the riskier choice. The argument for the
opposite:

- It is a live People Also Ask entry on the query this section serves. The reader has already asked it.
- The section currently lists several causes and stops short of the one he is worried about, which
  leaves him to infer rather than be told.
- The genuinely dangerous claim near this topic is any suggestion that our kit screens for cancer.
  **Writing the passage is what puts the explicit denial of that on the page.** Staying silent on the
  topic also stays silent on the disclaimer.

**Ewa rules this.** If the answer is no, items 1 to 3 stand on their own and the cancer paragraph is
dropped with nothing else affected.

## The proposed copy, in full

> ### The other half: when it isn't lifestyle
>
> You've genuinely checked all four of those for eight weeks. The number won't come down. The answer
> probably isn't more discipline.
>
> **It's a different conversation.**
>
> Knowing what can raise a marker is not the same as having any of it. These are the common
> non-lifestyle reasons an inflammatory marker sits high, and not one of them can be identified from
> the number on its own.
>
> **Infection.** Bacterial and viral infections raise CRP quickly, and the rise can be large. A chest
> infection can put CRP into the tens or hundreds, while a low-grade dental abscess runs it up quietly
> for months without much pain.
>
> **Injury, surgery, or a recent procedure.** Physical trauma and operations set off a normal healing
> response that keeps these markers up for weeks afterwards. A hernia repair or a tooth extraction
> eight weeks ago is a mechanical explanation, not a health problem.
>
> **Autoimmune conditions.** Conditions like rheumatoid arthritis and lupus keep inflammation running
> in the background. That is one of the reasons a GP puts these tests on a form in the first place.
>
> **Gut conditions and long-tail post-viral pictures.** Both can hold markers up long after the
> original event, and neither shows up as anything more specific than a raised number.
>
> And the one most men are thinking about and few say out loud.
>
> **Inflammatory markers are not a cancer test.** They cannot rule cancer in and they cannot rule it
> out. They rise in a long list of conditions, most of them common, and none of them can be identified
> from this number on its own. If your result is high and stays high on a retest, that is a GP
> conversation, and it is the reason the retest exists.
>
> None of these are things you fix with a better protein shake. They're things you take to a GP.

## Deliberate constructions, for Ewa to accept or reject

- **An anti-self-diagnosis line opens the block, before any condition is named**: *"Knowing what can
  raise a marker is not the same as having any of it."*
- **Every item says what can raise a marker. No item says what the reader has.** No "you have", no
  "your result means".
- **No symptom checklist.** Nothing a reader can score himself against.
- **No treatment, no dosage, no management advice.** Every route ends at a GP.
- **The cancer paragraph denies a capability rather than asserting one**, and names no cancer type.
- **The existing Ewa `ClinicalInsight` quote stays** and follows the block unchanged.

## Evidence

**Compliance scan** (`.claude/skills/compliance-preflight/scan.js`) on the proposed copy in isolation:
**0 HARD, 1 REVIEW**. Zero em dashes. No ashwagandha, TRT, diagnose, treat, cure, boost or optimise.

⚠️ **The single REVIEW hit is on wording that is already live and already approved**, carried over
unchanged: *"None of these are things you fix with a better protein shake."* The scanner flags `fix`
under the retest/efficacy rule. It is flagged here for transparency, not introduced by this change.
**Ewa may leave it, or replace it** (proposed alternative: *"None of these get sorted with a better
protein shake."*).

**Sources, fetched and verified 2026-08-15:**

| Claim | Source | Verified wording |
| --- | --- | --- |
| Markers are non-specific and cannot identify location or cause | Lab Tests Online UK (Association for Clinical Biochemistry), [C-Reactive Protein (CRP)](https://labtestsonline.org.uk/tests/c-reactive-protein-crp) | "suggests that you have an acute infection or inflammation but it does not help in identifying its location or the condition causing it" |
| A raised CRP is not diagnostic on its own | Lab Tests Online UK, same page | "The CRP blood test is not diagnostic but it provides information to the doctor as to whether inflammation is present" |
| Injury and surgery raise CRP | South Tees Hospitals NHS Foundation Trust, [C Reactive Protein (CRP)](https://www.southtees.nhs.uk/services/pathology/tests/c-reactive-protein-crp/) | "elevated in response to many pathological conditions, including infection, tissue injury, response to surgery, inflammatory disorders" |
| Rheumatoid arthritis and lupus (SLE) are associated | South Tees NHS FT, same page | associated-disease list names rheumatoid arthritis and SLE |
| Cancer sits in the same non-specific list | South Tees NHS FT, same page | associated-disease list names cancer, alongside infection, RA, SLE and others |
| Non-specific, needs clinical evaluation | South Tees NHS FT, same page | "Increases in CRP values are non-specific for many disease processes and should not be interpreted without a complete clinical evaluation" |

## Questions

- **G1 (governs the whole packet):** can we name infection, injury/surgery, and autoimmune conditions
  including rheumatoid arthritis and lupus, in the general frame, source-attributed and GP-routed? If
  no, the packet is dropped and nothing else matters.
- **G2:** is *"Knowing what can raise a marker is not the same as having any of it"* a strong enough
  anti-self-diagnosis guard, opening the block?
- **G3 (the one that needs a clinical judgement, not an editorial one):** does the cancer paragraph go
  in as written, go in reworded, or stay out? The case for inclusion is above; the fallback is silence.
- **G4:** is the infection magnitude fair as written ("a chest infection can put CRP into the tens or
  hundreds")? It is the most reassuring line in the section and also the least precisely sourced.
- **G5:** the pre-existing `fix` line, flagged by the scanner. Leave as published, or reword?

## Trap, carried from the fatigue packet

`content/blog/*.mdx` is **export-only**, generated from `blog_articles` by
`scripts/export-blog-from-db.ts`. Approved copy goes into the **database** and the mirror is
re-exported. Hand-editing the mirror would be silently overwritten.

## Honest limits

⚠️ **This will not by itself produce a citation.** The 2026-08-15 diagnosis measured us as absent from
the organic top 100 on every tracked query, including this one. It closes a real content gap and
completes the passage set the AI Overview is built from; it does not fix the ranking position.

⚠️ Measurement is in place either way: `our_rank` now records our organic position on every tracked
query each month, so the effect of this change is observable rather than assumed.

**Not approved. Nothing shipped.**
