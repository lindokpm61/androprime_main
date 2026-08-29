# Decision owed: what leads the brand after the monitoring thesis

**Date:** 2026-08-30 | **Decided by:** Keith | **Status:** ✅ **ADOPTED 2026-08-30.** **A2** (conflict-free stays the lead; the record becomes its proof) and **B: "men's health company"**. The ruling is recorded verbatim at section 6. The section 7 sweep is what remains, and two of its items are NOT ours to close: the `brand-description.md` rewrite is Keith-owned copy, and any CA-026 re-clearance is Ewa's.

**Why it was written.** Keith, 2026-08-29: *"our new approach, does that not change our identity as a men's wellness brand? Now that we're marketing the app or the service... our brand remains the same, but it doesn't remain the same."* The instinct is correct and the repo is already inconsistent because of it. This doc states the contradiction, puts the options side by side, recommends one, and lists what a ruling has to sweep.

---

## 1. The contradiction, stated once

**Two binding documents currently give opposite instructions about what customer copy may lead on.**

| Document | Date | What it says |
|---|---|---|
| `../02_brand/messaging-framework.md` | 2026-07-22 | The Patient-owned data pillar is *"retained as a supporting pillar and a privacy receipt inside conflict-free, **not** as the lead;* ***do not open customer copy on them.***" |
| `../07_sales/funnel/site-funnel-model.md` v2 | 2026-08-27 | *"The app is what you market. The kit is what you sell. The membership is what you earn."* |
| `2026-08-24-vertical-agnostic-monitoring-thesis.md` §1 | 2026-08-24 | *"Give away the thinking. Sell the record."* |

The pillar the July decision demoted and the thing the August thesis promoted **are the same thing**. `messaging-framework.md` pillar 1, written May 2026 and still marked **(lead)** in its own heading, reads:

> **Patient-owned data.** The longitudinal record belongs to the customer, not the clinic. Andro Prime is the only UK men's health brand that hands you the data layer, not just a result.

That is the monitoring thesis, four months early. **So the August work did not invent a new identity. It re-promoted a pillar that July had explicitly demoted, and nobody recorded the reversal.** Copy written today can satisfy either document and contradict the other, and both are cited as binding.

**This is not a marketing lag.** The live homepage leading on kits is a lag: it is built faithfully to funnel model v1 and v2 says so on its face. The lag closes when the page is rebuilt. What is in this doc does not close by building anything.

## 2. The second finding: the brand copy is two leads stale

`../02_brand/brand-description.md` is the source for **affiliate briefs, influencer packs, press, the About page, the homepage meta description and every social bio**. It currently:

- leads on patient-owned data, the **May 2026** lead;
- carries a banner dated **2026-07-22** saying the conflict-free rewrite is *"owed by Keith before external reuse"*, which has not happened;
- therefore predates the August thesis entirely.

Whatever is ruled below, that file needs rewriting once, against the ruling, rather than twice.

## 2a. Why it drifted: the August sweep never reached the brand workspace

Checked against git rather than assumed, 2026-08-30.

```
git log -- 02_brand/messaging-framework.md   → last touched 2026-07-22 (647e91b, conflict-free sweep)
git log -- 02_brand/brand-description.md     → last touched 2026-07-22 (647e91b, same commit)
```

The monitoring thesis was adopted 2026-08-25 and `STATE.md` records *"Decision sweep run 2026-08-25."*
**That sweep did not touch either brand file.** It correctly propagated the supplement, kit and app
ordering, the Nutribl chain and the results mechanic, and it stopped at the workspace boundary.

This is the exact failure mode `/decision-sweep` exists for and names in its own description: a
decision implemented correctly in one place and never swept through the older doc layer. It is worth
recording as evidence rather than blame, because it is the second time the brand layer has been the
one left behind, and the pattern suggests **the brand workspace should be an explicit stop on any
sweep that changes what we sell or what we lead on**, not a workspace the sweep reaches only if the
decision was filed there.

## 3. What is actually being asked

Two questions, and they are separable. B can be answered whatever happens to A.

- **Question A: what leads?** Conflict-free, or the record.
- **Question B: what is the category noun?** Keith used "men's wellness brand". That phrase is not in the brand docs as an identity and should probably not enter them.

## 4. Question A: the options

| Option | The lead sentence becomes | For | Against |
|---|---|---|---|
| **A1. The record leads** | *Your numbers, held over time, and yours to keep.* | It is what the funnel model says we market. Pillar 1 was drafted as the lead. It is the only thing a kit-only competitor cannot match | 🔴 **This position was already refuted on evidence.** The 2026-07-20 teardown killed "own interpretation + tracking + trust": Thriva owns the triad, Forth is credible, and the row in the July decision reads *"reseller has weakest build hand."* Leading here re-opens a question that was closed with evidence, against the two brands best placed to win it. It also collides with the cold-start rail (`site-funnel-model.md` §1b): a monitoring lead promises value at month 24 to a man who has no data on the day he is asked to buy |
| **A2. Conflict-free stays the lead; the record becomes its proof** ✅ | Unchanged: separation of incentives. The record is what that separation is *for* | Conflict-free is the only candidate the July review found **structurally uncopyable**: funnels cannot follow without abandoning treatment revenue. It satisfies "market the app", because the app is shown as evidence rather than named as a feature. It respects the cold-start rail, since the two-range card lands on a single result. It leaves the record free to carry the membership later, where the trend claim is honest | It is a harder brief. A refusal has to be demonstrated, not asserted, which is more work per asset than a feature list. It also means the app is never the headline, which will feel wrong every time the product team ships something good |
| **A3. A merged lead** | *The record you own, from the people with no reason to skew it* | Superficially settles it without choosing | Two-clause leads do not survive a hero. It re-opens July without new evidence, and the merged form drifts toward the absolute claim that rail 1 bans. Rejected on the same ground the July review rejected blended positions |

### Recommendation: A2

Not because the app is unimportant, but because of what the app is **for**.

The demo built on 2026-08-29 makes the argument better than prose does, and it is worth being precise about why it works. It is not persuasive because it is an app. It is persuasive because of what it visibly **refuses to do**: no verdict on the free androgen index, no product offered against a low testosterone result, and no sentence connecting his energy score to his vitamin D. **Those three refusals are conflict-free, rendered.** A competitor can copy the dashboard in a quarter. None of the six vertical-committed brands can copy the refusals without giving up the revenue that pays for them.

So: **the app is evidence for the position, not the position.** Marketed that way, the identity is unchanged and the product got better. Marketed as software, a defensible claim has been swapped for a comparable one, on ground the teardown says we lose.

## 5. Question B: the category noun

"Men's wellness brand" should be declined, and the reason is not taste.

- **"Wellness" is a regulatory boundary in this business, not a brand.** It is the Phase 0 wellness tier as against the post-CQC clinical tier. It describes what we are permitted to say, not what we are. Adopting it as an identity would tie the brand's name to a constraint we intend to lift.
- `../02_brand/messaging-framework.md` pillar 4 **already bans the register**: *"no wellness fluff... not Numan, not Hims, not a Harley Street brochure."*
- The docs already have a noun and it has never been the problem: **"a UK men's health company"** (`brand-description.md`), with pillar 2 defining the scope as *"open-ended men's health, not foreclosed."*

**Recommendation: keep "men's health company."** It survives the kit, the app, the membership and the post-CQC clinic without a rewrite, which is exactly what "open-ended" was written to protect. "Men's health testing company" is more accurate about today and forecloses the record and the membership, so it should be avoided as a self-description even while testing is all we sell.

## 6. ✅ Keith's ruling (2026-08-30)

Given directly, on this document: *"go ahead and approve A2 and for question B, men's health company."*

- **Question A, the lead:** ☑ **A2. Conflict-free stays the lead; the record becomes its proof.**
- **Question B, the category noun:** ☑ **"men's health company."**
- **Date:** 2026-08-30
- **Anything the sweep must not touch:** nothing was excluded by Keith. Two exclusions apply by
  standing rule rather than by his instruction, and they are not the sweep's to override:
  **`brand-description.md`'s customer-facing long / short / one-liner copy is a Keith-owned rewrite**
  (its own 2026-07-22 banner says so) and is not rewritten by the sweep; and **any change to CA-026
  approved wording is Ewa's**. The sweep may re-point banners and correct the governing instruction
  at both, and may not write the replacement copy.

### What A2 actually means in practice, so the sweep does not over-read it

Recorded because "the record becomes its proof" is the kind of sentence that gets read as either
"nothing changed" or "the record is now the lead", and it is neither.

1. **The lead is unchanged.** Conflict-free, per `2026-07-22-conflict-free-positioning-decision.md`.
   The copy hierarchy in that decision's rail 2 stands untouched: speed / no-GP earns the click,
   money honesty second, the sharp industry line stays press and GEO only.
2. **The record is promoted from privacy receipt to proof layer.** July filed it as "a supporting
   pillar and a privacy receipt". That undersells what it now does: it is the demonstration of the
   position, not merely a reassurance about data handling. `messaging-framework.md` needs that
   wording corrected.
3. **The "do not open customer copy on it" instruction survives.** The record may appear in customer
   copy as demonstration, and may not be the opening claim. This is the whole content of A2 and it is
   the line the sweep must carry into every file.
4. **"The app is what you market" is not licence to lead on the app.** `site-funnel-model.md` §1a
   keeps its sentence and gains the qualifier: the app is marketed as evidence for the position.
5. **Nothing in the approved claim set moves**, which is why no compliance re-clearance is triggered.
   If a rewrite later introduces a net-new claim, that goes to Ewa on its own merits.

## 7. What a ruling triggers

A `/decision-sweep`, because the fact is stated in more than one place and a one-site fix would convert a quiet inconsistency into a loud contradiction.

| File | What has to change |
|---|---|
| `../02_brand/messaging-framework.md` | The 2026-07-22 governing banner and the pillar order. Under A2 the demotion instruction stays but must be reworded: the record is a **proof layer**, not merely a privacy receipt, and it may appear in customer copy as demonstration even though it may not open it |
| `../02_brand/brand-description.md` | The rewrite owed since 2026-07-22, now against the ruling rather than against July. Long, short and one-liner. Keith-owned, pre-flighted |
| `../07_sales/funnel/site-funnel-model.md` | §1a "the app is what you market" needs the qualifier the ruling supplies, so it stops reading as a licence to lead on the app |
| `2026-08-24-vertical-agnostic-monitoring-thesis.md` | §7 already has a "what it changes" table with a row for the 2026-07-22 positioning decision saying *"extended, not replaced."* That row is the closest thing to a ruling that exists and it is not one. Point it here |
| `../06_marketing/content-machine/CONTEXT.md` and the queue | The canonical-asset rule means derivative copy inherits the lead. A changed lead changes what every future post opens on |
| `../02_brand/2026-07-22-conflict-free-wording-pack.md` (CA-026) | Check whether any approved wording needs re-clearing. **If it does, that is Ewa's, not ours** |

**Compliance note.** Under A2 nothing in the approved claim set moves, so no re-clearance should be needed. Under A1 it very likely is: leading on a longitudinal record edges toward the health-service proposition the thesis already flags in §10.9, and that needs a compliance read before it is a copy decision.

## 8. Falsifier

Recorded so it gets tested rather than forgotten.

**A2 is wrong if the conflict-free line does not move people who have never heard of us.** It is a refusal, and refusals need context to land: a man has to already suspect he is being sold to. The 30-day carousel run is the first thing that could return evidence either way, and its stated bar is 4 to 7 clicks per post. If conflict-free assets underperform record assets by a wide margin on the same audience, this ruling should be reopened with that data rather than defended.

**Note the sample problem before quoting any of it.** The carousel account is at 5 followers and posts are returning 0 to 4 impressions, so nothing it produces yet is a signal. This falsifier is real but it is not yet armed.

## 9. Deliberately deferred

- **Whether "conflict-free" is the right customer-facing phrase.** It is the internal name for the position. The customer-facing wording is CA-026 and is not reopened here.
- **The homepage rebuild.** That is funnel model v1 to v2 lag and it proceeds under whatever is ruled; it is not blocked on this doc.
- **The post-CQC tension.** The durable claim is separation of incentives, never abstinence, and the "never sell testosterone" form stays banned. A clinic launch does not break A2 as long as the separation stays structural. That is a real dependency and it belongs to the clinic plan, not to this ruling.
