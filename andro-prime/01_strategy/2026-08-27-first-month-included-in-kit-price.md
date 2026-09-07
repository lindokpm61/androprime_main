# The first 30 days of membership are included in the kit price

**Decided:** 2026-08-27 · **Owner:** Keith · **Status:** ADOPTED
**Swept:** 2026-09-06 (`/decision-sweep`)

> **Why this file exists.** The ruling was taken on 2026-08-27 and written down
> only inside two other documents' bodies (`08_customer-journey/journey-spine.md`
> stage 9 and `07_sales/funnel/site-funnel-model.md` §4, commit `d695683`). It
> had no canonical record of its own, so `01_strategy` (the workspace that owns
> the revenue model) and `2026-08-26-membership-offer-window.md` §6 both went on
> asserting the opposite for ten days, and Keith caught it when the assistant
> quoted the stale text back to him. This file is that missing record. It is
> what every updated doc now points at.

## 1. The decision

**The first 30 days of membership are included in the kit price.**

A kit buyer is a member from the moment the kit is bought. Stage 9 of the
journey therefore stops being *"will you start paying £47"* and becomes
*"you are already a member until [date], do you want to carry on"*. That is a
continuation conversation, not a sales one, and it changes the stage-9 emails
from a sales sequence into a continuation sequence.

## 2. What it supersedes

| Superseded | Where it was stated |
|---|---|
| "Whether the first month of membership is included in the kit price" is STILL OPEN | `01_strategy/STATE.md` line 5 (the 2026-08-26 entry in the accretion chain) |
| "The free first month ... Still divergent, still undecided" | `2026-08-26-membership-offer-window.md` §6, first bullet |

Both were written on 2026-08-26, the day before the ruling.

## 3. What it resolves, and in whose favour

It was a **model-versus-build divergence**, and it resolves in favour of the
models. Both financial models already assumed the included month:

- `financial-model/2026-08-24-membership-90-day-model.md` line 17: *"first 30
  days included in the kit price"*.
- `financial-model/2026-08-24-membership-year-1-forecast.md` line 12: Kit 2 at
  GBP 119 as the paid entry, *"including the first 30 days of membership"*.

So no forecast moves as a result of this ruling. **The build is the side that is
now out of step**, and section 5 records exactly how.

## 4. What it does NOT decide

Three things fell out of this ruling. **Two were decided on 2026-09-07; the
third is still open.** The original wording of each is kept underneath its
ruling, so nobody reads a closed item as though it had never been open, and so
the one recommendation that turned out to be wrong stays visible as an error.

1. ✅ **DECIDED 2026-09-07: the RESULT LANDING** (Keith, *"anchor everything to
   results"*). Doc: `2026-09-07-anchor-everything-to-the-result.md`. The included
   month, the offer window and every retest date now share one anchor. **What was
   open, as written on 2026-08-27:** The included month would start at
   PURCHASE; the 30-day offer window starts when the RESULT lands; and the code
   has a third anchor, `createMembership` stamping `started_at` and the retest
   date from STRIPE CHECKOUT. A slow lab puts all three out of step.
   *Assistant recommendation, not decided:* anchor all three to the result
   landing. Before a result exists there is no trend, no check-in loop and no
   retest to be entitled to, so an included month starting at purchase is 30
   days of an empty room, given away rather than sold, and it can expire before
   the result exists if the kit sits in a drawer. It also gives the retest its
   clinically correct anchor (90 days after the baseline, not after a card was
   charged). **Owner: Keith.**
2. ✅ **DECIDED 2026-09-07: AUTO-RENEW.** The card is charged GBP 47 on day 31,
   automatically, with a supporting price line on all kit pages (new site only).
   Doc: `2026-09-07-auto-renew-at-day-30.md`. Keith: *"I don't see why an opt-in
   is necessary, as we are sticking to our cadence that the first month is free,
   and then on day 31, we charge them."*
   🔴 **The recommendation below was WRONG and is kept as the record of the error.**
   It collapsed **prominence** into **opt-in**, which are different obligations.
   Numan's ASA ruling (A22-1153049) was for **burying** the subscription, not for
   having one, and the adopted thesis already states the rule correctly as
   *"prominent at the point of sale rather than in the T&Cs"*. **What was open, as
   written on 2026-08-27:** If month one is included and automatic, does a card
   charge on day 31 by default?
   *Assistant recommendation, not decided:* OPT-IN, on brand grounds rather than
   legal ones. A card charging on day 31 for something the kit page called
   "included" is the pattern the conflict-free position forbids. It costs
   conversion, and that is the trade. ~~**Owner: Keith.**~~ **Closed.**
3. **What it does to the GBP 47 price.** GBP 47 was adopted for VAT-threshold
   stability (`lib/subscriptions/products.ts`, Keith 2026-08-26). A free first
   month moves the threshold arithmetic. **Owner: Keith, with the accountant.**

Also flagged, unresolved: every kit buyer becoming a member turns the headline
metric from **attach rate** into **day-30 retention**, and the forecasts should
be read accordingly.

## 5. The build does not implement this (carrier class 1 and 2)

Flagged, not changed: application code is its own task with its own
verification (decision-sweep invariant 4).

| Carrier | State on 2026-09-06 |
|---|---|
| `lib/subscriptions/products.ts` | Membership is `£47/mo` against `STRIPE_PRICE_MEMBERSHIP`, with no notion of an included period. |
| `lib/membership/sync.ts` `createMembership` | Stamps `started_at` and `next_retest_due_at` from the checkout moment. Nothing defers the first charge. |
| Stripe checkout | **No `trial_period_days` or `trial_end` anywhere in the repo.** The build has no mechanic that can express an included month. |
| `lib/membership/entitlement.ts` | `ACTIVE_MEMBER_STATUSES` **already includes `trialing`**, and the comment requires it to stay in step with the partial unique index `memberships_one_live_per_user` in `20260826_membership_v1.sql`. |

**The useful finding is the last row.** The entitlement layer and the database
already model a trialing member correctly; an included month would light up an
existing, tested path rather than needing a new one. What is missing is only the
writer: nothing ever sets `trialing`, because checkout never opens a trial.

**This is gated and not customer-visible.** Membership is behind
`MEMBERSHIP_ENABLED`, `/membership` is an app route that `notFound()`s when the
flag is off, and no public page quotes the membership price. So the build being
out of step is a launch blocker, not a live mis-statement to customers.

## 6. Where this is now recorded

Swept 2026-09-06. See `STATE.md` for the file-by-file list.
