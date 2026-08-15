# Reddit: the status was "ongoing" and nothing has ever happened. Here is why, and it is not neglect

**Date:** 2026-08-15
**Owner:** Keith Antony
**Status:** ✅ **DECIDED 2026-08-15 (Keith): NARROW REOPEN, option B below.** Status is now
**`active (last artefact: none yet)`**. The scope rule is written into
`seo-content-context.md` and leads the Reddit section; `ongoing` is banned as a status on the
outreach tracker. The "a decision is owed" framing below is superseded and kept as the reasoning.
**Workspace:** `06_marketing/seo-ai-search`

---

## What the record said, and what is true

[`geo-third-party-presence-outreach.md`](./geo-third-party-presence-outreach.md) carries Reddit under
"Not outreach: presence", naming **r/UKTRT** and **r/HENRYUKLifestyle**, with **Status: ongoing**.

- `06_marketing/content/reddit/`, the directory the rules in
  [`seo-content-context.md`](./seo-content-context.md) require reply drafts to be tracked in, was
  created **2026-04-13 and is empty**. Four months, zero artefacts.
- No Reddit account, post, comment or draft is recorded anywhere in the repo.

**"Ongoing" was never true.** It is the status a task gets when nobody wants to write `not started`
against it, and it is worse than `not started` because it is not on anyone's list to fix.

## Both named targets were wrong, checked against Reddit directly

| Named target | Reality (checked 2026-08-15) |
|---|---|
| **r/HENRYUKLifestyle** | **Does not exist.** The real subreddit is **r/HENRYUK**, and it is a **tax and personal-finance** community: its top post of the month is *"The Laffer Curve in action: Scottish tax hike for high earners backfires"*. Wrong name and wrong category. |
| **r/UKTRT** | Exists and is **effectively dormant**. `new` returns **one post**; `top` over the past month returns **nothing at all**. |

`02_brand/CONTEXT.md` names a third, **r/testosterone**, which resolves to **r/Testosterone** and is
genuinely large (204,666 subscribers) and very active.

## The real obstacle, and it is structural rather than a capacity problem

A semantic sweep for the communities that match UK men's health, private blood tests and results
interpretation returns **19 subreddits and not one exact, semantic or adjacent match. All twelve
surfaced are "peripheral", top confidence 0.666.** There is no natural home community.

Worse, the highest-confidence matches are **SteroidsUK, r/Testosterone, moreplatesmoredates,
nattyorjuice, team3dalpha**: TRT and PED communities. **That is the conflict.** The live threads on
r/Testosterone today are *"High E2 and testosterone on 200mg TRT"*, *"can you draw mastreon and test
same syringe?"*, *"Is it worth starting TRT and HcG?"*. **Every one of those is a question the Phase 0
boundary forbids us from answering**, and a testing company's founder answering TRT dosing questions
is precisely the risk that boundary exists to prevent.

So the workstream did not stall because nobody got round to it. **It stalled because the places that
want our expertise are the places we are not allowed to be useful in, and nobody wrote that down.**
Four months of `ongoing` is what an unstated blocker looks like.

## There is one compliant slice, and it is narrow but real

The same r/Testosterone feed also carries, in the same six posts: *"I recently got my total
testosterone test done and have a few questions"* and *"High SHBG / decent total T / average free T,
what would you do?"*

**Results interpretation is exactly our competence and it sits inside the boundary.** We explain what
Total T, SHBG, Free T and FAI mean and what they do not mean. We do not prescribe, do not discuss
protocols, and route anything clinical to a GP. That is the same job `/blog/free-androgen-index` and
`/blog/how-to-read-blood-test-results` already do, and it is the one thing on Reddit our compliance
position makes us *better* at than the loudest voices in the room rather than worse.

Worth noting alongside: **Reddit is cited in today's GEO baseline three times** (`best testosterone
test UK`, `best home blood test kit UK 2026`, and `brain fog causes`), so the surface does feed the
engines we are trying to appear in.

## The decision owed, with a recommendation

**Recommend: option B, and write the scope rule down before anything is posted.**

- **A. Close it.** Mark `declined`, delete the empty directory, remove Reddit from the target list.
  Honest, costs nothing, and loses a cited surface.
- **B. Reopen it narrowly (recommended).** One community, **r/Testosterone**, one thread type:
  **posts where someone has bloods in hand and is asking what the numbers mean.** Never a dosing,
  protocol, PED or TRT-initiation thread, regardless of how answerable it looks. The existing
  non-negotiables still apply on top (never pitch, never link unprompted, Keith is identifiable,
  mention Andro Prime only if directly asked for a recommendation). **Add the new rule explicitly:
  scope is results interpretation only, and a thread's topic disqualifies it before its content is
  read.**
- **C. Leave it as "ongoing".** Rejected. It is the status that produced four empty months.

**Whichever is chosen, two things need doing to the record**, because the failure here was bookkeeping
before it was strategy:

1. **Fix the two wrong subreddit names** in `geo-third-party-presence-outreach.md`, and drop r/UKTRT
   as dormant.
2. **Ban `ongoing` as a status on that table.** Every other row uses `not started` / `contacted` /
   `replied` / `listed` / `declined`, all of which are checkable against evidence. `ongoing` is the
   only one that cannot be falsified, which is why it survived four months of nothing happening. If a
   presence row needs a live status, make it **`active (last artefact: <date>)`**, so an empty
   directory makes the status visibly false.
