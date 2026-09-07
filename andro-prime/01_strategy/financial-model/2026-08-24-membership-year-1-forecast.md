# Membership: 12-month forecast

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. Nothing decided. Computed, not estimated.

**Read with:** `2026-08-24-membership-90-day-model.md` (the unit economics this is built on),
`../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the prices came from).

---

## 1. What is modelled

**All three kits** as the paid entry, each including the first 30 days of membership.
Membership at **GBP 47/month** thereafter. One retest included per year.

| Kit | Price | COGS | Gross | Gross % |
|---|---|---|---|---|
| Kit 1 Testosterone | GBP 99 | GBP 58.50 | GBP 40.50 | 40.9% |
| Kit 2 Energy & Recovery | GBP 119 | GBP 63.00 | GBP 56.00 | 47.1% |
| Kit 3 Hormone Recovery | GBP 179 | GBP 98.00 | GBP 81.00 | 45.3% |
| **Blended at the mix below** | **GBP 122.62** | **GBP 67.03** | **GBP 55.59** | **45.3%** |

Prices read from `09_website-app/frontend/app/(marketing)/kits/page.tsx` on 2026-09-07. COGS are the
Vitall-quoted figures in `../../04_products/catalogue/product-catalogue-v7-1.md`.

> ✅ **Both inputs are now settled, and one of them was settled inside this very document.**
> The included first month: Keith, 2026-08-27, `../2026-08-27-first-month-included-in-kit-price.md`.
> This forecast assumed it before it was ruled, so the ruling moved nothing here.
>
> 🔄 **The price is GBP 47 and this section used to say GBP 49, contradicting its own §6.** Section 6
> has recorded *"the membership sticker is GBP 47, not GBP 39"* as Keith's 2026-08-24 decision since
> the day this file was written. The model was built at 49 and never rerun, so the document argued
> against itself: **§1 modelled a price §6 said was not the price.** GBP 49 was never a decision, only
> a placeholder. **Rerun at 47 on 2026-09-07**, validated by first reproducing every published figure
> at 49 from the stated assumptions, so the new numbers come from the same arithmetic and not a
> re-estimate.
>
> 🔄 **RERUN ACROSS ALL THREE KITS, 2026-09-07** (Keith: *"run the forecast on all the kits at 47"*).
> This model previously used **Kit 2 alone as a proxy for every kit sold.** It now runs the real
> three-kit mix, which is what the included month actually applies to: **every kit buyer becomes a
> member**, not only the Kit 2 buyer. Validated the same way as the GBP 47 rerun, by first reproducing
> every Kit-2-only figure exactly from the stated assumptions, so the new numbers come from the same
> arithmetic and not a re-estimate.
>
> **Net effect: revenue up GBP 1,059, profit down GBP 182, margin down 1.4 points.** The blended gross
> per kit (GBP 55.59) lands within 41p of Kit 2's (GBP 56.00), because Kit 1 drags and Kit 3 lifts by
> almost exactly the same amount. **The old proxy was accidentally near-perfect on profit and wrong on
> revenue and margin**, which matters because section 6 reads margin off this model and because
> **revenue is what the VAT threshold counts.**

| Assumption | Value | Confidence |
|---|---|---|
| **Kit mix (Kit 1 / 2 / 3)** | **68 / 148 / 38, i.e. 26.8% / 58.3% / 15.0%** | 🔴 **New load-bearing guess.** Provenance below |
| Day-30 conversion | 50% | 🔴 Guess |
| Monthly churn | 7% | 🔴 Guess |
| Failed-sample reserve | 4% of kits | 🟢 Repo standard |
| Stripe | 1.5% + GBP 0.20 | 🟢 |
| Fixed opex | GBP 330/month, stepping with Customer.io tier | 🟠 Itemised in the 90-day model |
| **Acquisition ramp** | **4 kits in M1 rising to 50 in M12** | 🔴 **The load-bearing guess** |
| Supplement revenue | **Not modelled.** Shop sits outside the membership | — |
| Keith's time | **Not costed** | — |
| VAT | **Excluded.** See section 6 | 🔴 Open |

**Where the mix came from, and why it is only half-trustworthy.** The proportions are taken from
`../../04_products/catalogue/non-regulated-tier-v72-financials.md` §4.1. That file carries a staleness
banner, and it was checked before use: the banner covers §§4.2 to 4.4 and **explicitly exempts §4.1**
(*"Volume assumptions in §4.1 are unaffected"*). Only the proportions were borrowed, never the volumes.
**The weakness is that it is a 6-month Phase 0 table being applied to a 12-month membership ramp**, and
nothing validates that Phase 0 proportions hold through month 12. Inventing a mix would have been worse.

---

## 2. Base case, month by month

| Month | Kits | Paying members | Kit revenue | Subscription | Kit cost | Stripe | Fixed | Profit |
|---|---|---|---|---|---|---|---|---|
| 1 | 4 | 0 | 490 | 0 | 279 | 8 | 330 | **−127** |
| 2 | 6 | 2 | 736 | 94 | 418 | 14 | 330 | **67** |
| 3 | 9 | 5 | 1,104 | 228 | 627 | 23 | 330 | **352** |
| 4 | 12 | 9 | 1,471 | 424 | 837 | 33 | 330 | **696** |
| 5 | 16 | 14 | 1,962 | 676 | 1,115 | 46 | 330 | **1,147** |
| 6 | 20 | 21 | 2,452 | 1,005 | 1,394 | 60 | 330 | **1,673** |
| 7 | 25 | 30 | 3,066 | 1,405 | 1,743 | 78 | 330 | **2,319** |
| 8 | 30 | 40 | 3,679 | 1,894 | 2,091 | 98 | 330 | **3,053** |
| 9 | 35 | 52 | 4,292 | 2,466 | 2,440 | 119 | 330 | **3,869** |
| 10 | 40 | 66 | 4,905 | 3,116 | 2,789 | 142 | 330 | **4,761** |
| 11 | 45 | 82 | 5,518 | 3,838 | 3,137 | 166 | 330 | **5,723** |
| 12 | 50 | 98 | 6,131 | 4,627 | 3,486 | 191 | 330 | **6,751** |
| **Year 1** | **292** | **98** | **35,806** | **19,773** | **20,356** | **976** | **3,960** | **30,286** |

**Revenue GBP 55,578 · Cost GBP 25,292 · Profit GBP 30,286 · Margin 54%**

_(The rounded monthly profit column sums to GBP 30,284; the two-pound difference is rounding.)_

**Only month one is negative, at minus GBP 127.** It is cash-positive from month two onward and never
returns.

**What moved and what did not.** The member and subscription columns are **unchanged**, because the mix
does not touch conversion, churn or price. Every difference in this table sits in the kit line: revenue
up GBP 1,059, kit cost up GBP 1,225, Stripe up GBP 16.

---

## 3. Three scenarios

Same conversion and churn; only the acquisition ramp changes.

| Scenario | Kits year 1 | Members at M12 | Revenue | **Profit** | Margin | Profit was (Kit 2 only) |
|---|---|---|---|---|---|---|
| Slow (2 rising to 25/month) | 144 | 48 | 27,298 | **12,820** | 47% | 12,979 |
| **Base (4 rising to 50/month)** | **292** | **98** | **55,578** | **30,286** | **54%** | 30,468 |
| Strong (8 rising to 100/month) | 584 | 197 | 111,157 | **64,532** | 58% | 64,618 |

**Profit is flat to within about GBP 180 in every column.** The mix does not change the business; it
changes the revenue line and the margin.

### 3a. Mix sensitivity (added 2026-09-07)

The mix is now a load-bearing guess, so here is its whole plausible range at the base ramp.

| Mix (K1 / K2 / K3) | Blended price | Blended COGS | Revenue | **Profit** | Margin |
|---|---|---|---|---|---|
| Entry-heavy 50/35/15 | GBP 118.00 | GBP 66.00 | 54,229 | **29,270** | 54.0% |
| **Documented 27/58/15** | **GBP 122.62** | **GBP 67.03** | **55,578** | **30,286** | **54.5%** |
| Equal thirds | GBP 132.33 | GBP 73.17 | 58,414 | **31,216** | 53.4% |
| Premium-heavy 15/35/50 | GBP 146.00 | GBP 79.83 | 62,405 | **33,125** | 53.1% |

**Profit moves about GBP 3,900 across the whole range. The ramp moves it GBP 52,000.**

Note that **margin FALLS as the mix goes premium** even though profit rises. Kit 3 has a worse gross
percentage than Kit 2 (45.3% against 47.1%), and the 100%-margin subscription line becomes a smaller
share of a larger revenue base. A premium mix is more profit on worse margin, which is the opposite of
how it tends to be assumed to work.

---

## 4. Sensitivity, and a correction

Base ramp, varying the two behavioural guesses.

⚠️ **These nine cells are AT GBP 49 AND AT KIT 2 ONLY, and have not been individually rerun.** Only the
centre cell was recomputed: at GBP 47 across all three kits it is **30,286**, not 31,297. Every other
cell falls by about 4% of its own subscription line (the price effect) **plus a flat GBP 182 (the mix
effect, which does not vary with conversion because the kit line does not)**, so roughly GBP 700 at 30%
conversion and GBP 1,300 at 70%. The **shape** of the table, which is the only thing it is used for, is
unchanged.

| | Churn 5% | Churn 7% | Churn 10% |
|---|---|---|---|
| Conversion 30% | 23,762 | 23,209 | 22,448 |
| Conversion 50% | 32,148 | **31,297** _(30,286 at GBP 47, all kits)_ | 30,028 |
| Conversion 70% | 40,535 | 39,246 | 37,469 |

🔴 **This corrects the 90-day model.** That document called day-30 conversion "the single biggest number",
which is true over 90 days and **false over a year**. Across the full range, conversion moves year-one
profit by about GBP 16,000 and churn by about GBP 3,000, while **the acquisition ramp moves it by GBP
52,000** between slow and strong (GBP 51,712 on the all-kits rerun in section 3; it was GBP 53,000 when
this model ran Kit 2 alone). **How many kits you sell dominates everything else in year one.**

Churn looks almost irrelevant here only because the member base is young. In year two it becomes the
dominant term, because that is when compounding either works for you or against you.

---

## 5. What year one is hiding

**The kit is carrying the business, not the membership.** GBP 35,806 of kit revenue against GBP 19,773 of
subscription, so 64% of year one is one-off sales. That inverts in year two as the member base compounds
and kit sales flatten. **Year one is a testing business with a subscription attached. Year two is the
reverse, or the model has failed.**

🔴 **The retest liability is not in these numbers.** An annual included retest means the first cohort
reaches its retest in month 13, so **zero retest cost appears in year one**. At 98 members and the
blended COGS of GBP 67.03 that is **GBP 6,599 of cost carried into year two** (was GBP 6,202 at Kit 2
COGS), and it grows with the base. Year one looks better than the business is by roughly that amount.

⚠️ **Two open defects make even that figure optimistic, and both are recorded elsewhere.** First,
`../../04_products/results-engine/retest-mechanism-map.md` §3a: the 365-day path is **unreachable in the
build**, so every member is currently stamped for a retest at day 90, which would land inside year one
rather than month 13. Second, §3b: the build gives a member **one retest ever**, while this model and the
customer copy both say one per year. **Until 3a and 3b are decided, both the timing and the recurrence of
this liability are unsettled**, and this paragraph assumes the doc rather than the code.

**Supplement revenue is not modelled at all.** The shop sits outside the membership at member pricing, so
anything it earns is upside on top of the above.

**Keith's time is not costed.** GBP 30,286 of profit against a year of full-time founder work is below a
salary. That is normal for year one and it should be said out loud rather than discovered.

**Three things the all-kits rerun does NOT model** (added 2026-09-07):

- **Conversion is held at 50% across all three kits.** A GBP 99 Kit 1 buyer and a GBP 179 Kit 3 buyer
  almost certainly do not convert to GBP 47/month at the same rate, and Kit 3 is the likelier member.
  There is no evidence to model that, so it is left flat. **If Kit 3 converts better, every figure above
  is conservative.**
- **The mix is a Phase 0 6-month table applied to a 12-month ramp.** See the provenance note in section 1.
- **Kit 3 Plus (GBP 239 provisional) is not modelled**, because its COGS is still TBD pending Ben's quote
  (`../../04_products/kits/kit-3-plus.md`).

---

## 6. Two cliffs worth seeing before they arrive

🔴 **VAT.** The registration threshold is GBP 90,000 of taxable turnover. **The base case at GBP 55,578 is
under it. The strong case at GBP 111,157 is over it**, and would trigger mandatory registration mid-year.
If the membership is standard-rated at 20%, that is roughly GBP 18,500 off the strong case unless prices
rise. **The all-kits rerun pushed the strong case GBP 2,115 further over the line**, so the margin of
safety on that column is thinner than it was, not wider. Diagnostic testing may qualify as exempt medical
care, but **a subscription that is mostly software and content probably is not**, and nobody has checked.
**Get this answered before pricing is published, not when the threshold is crossed.**

⚠️ **Flagged, not fixed: that GBP 18,500 is computed on TOTAL revenue, not on the membership line.** The
sentence says *"if the membership is standard-rated"*, but 20% of the strong case's GBP 39,546 of
subscription is about GBP 6,600 if GBP 47 is VAT-inclusive, not GBP 18,500. The larger number is what you
get by VAT-ing everything, kits included. Which one is right depends on the supply characterisation still
owed to the accountant, so **both are premature**. The method is carried forward unchanged so that this
rerun does not silently alter an argument it was not asked to alter.

🔴 **Corrected 2026-08-24: this paragraph previously said "supplements are usually zero-rated". That is
almost certainly wrong.** UK food supplements are generally **standard-rated at 20%**, specifically excluded
from food zero-rating, and gummies would be standard-rated as confectionery in any case. Also note **exempt
is worse than zero-rated**: an exempt supply blocks recovery of input VAT on the related costs, so
"it might be exempt medical care" is not the good outcome it reads as. The characterisation of the supply
(single composite versus mixed, with apportionment) is what decides the number, and it is an accountant
question, not a modelling one.

🟢 **Pricing consequence, taken 2026-08-24 (Keith): the membership sticker is GBP 47, not GBP 39.** At 20%
that nets GBP 39.17, so the price never has to change on crossing the threshold. Below the threshold the
full GBP 47 is retained, which is upside for the whole of year one on the base case. The alternative,
pricing at GBP 39 and later adding VAT, forces either a visible 20% rise to GBP 46.80 or absorbing a 17%
cut to the recurring line. See `../2026-08-24-vertical-agnostic-monitoring-thesis.md` section 11.

🔴 **CAC.** Everything above assumes organic acquisition.

| CAC per kit buyer | Year-1 spend | Profit after |
|---|---|---|
| GBP 0 | 0 | **30,286** |
| GBP 15 | 4,380 | **25,906** |
| GBP 30 | 8,760 | **21,526** |
| GBP 45 | 13,140 | **17,146** |
| GBP 60 | 17,520 | **12,766** |

Paid acquisition survives here in a way it did not in the 90-day model, because the kit margin covers it.
At GBP 30 a member the base case still clears GBP 21,500. **That is the difference a 12-month view makes:
CAC is affordable when you count the subscription tail, and unaffordable when you only count 90 days.**

---

## 7. Read of it

The shape is a real business at the base case and a modest one at slow. It is cash-positive from month two,
carries no inventory, and has bounded downside because every kit buyer is profitable whether or not they
subscribe.

**What decides which column you land in is not conversion, churn, price or mix. It is how many kits you
sell.** Mix, added on 2026-09-07, moves year-one profit by about GBP 3,900 across its whole plausible
range, against GBP 52,000 for the ramp. **It changes the revenue line and the margin, not the business.**
Everything in this model traces back to that ramp, and it is the assumption with the least evidence behind
it. Before building the app, the cheapest thing to learn is whether four kits a month is achievable at all
today, because if it is not, none of the rest matters.
