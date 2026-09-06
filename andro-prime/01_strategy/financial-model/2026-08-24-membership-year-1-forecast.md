# Membership: 12-month forecast

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. Nothing decided. Computed, not estimated.

**Read with:** `2026-08-24-membership-90-day-model.md` (the unit economics this is built on),
`../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the prices came from).

---

## 1. What is modelled

Kit at GBP 119 (Kit 2, GBP 63.00 COGS) as the paid entry, including the first 30 days of membership.
Membership at **GBP 47/month** thereafter. One retest included per year.

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

| Assumption | Value | Confidence |
|---|---|---|
| Day-30 conversion | 50% | 🔴 Guess |
| Monthly churn | 7% | 🔴 Guess |
| Failed-sample reserve | 4% of kits | 🟢 Repo standard |
| Stripe | 1.5% + GBP 0.20 | 🟢 |
| Fixed opex | GBP 330/month, stepping with Customer.io tier | 🟠 Itemised in the 90-day model |
| **Acquisition ramp** | **4 kits in M1 rising to 50 in M12** | 🔴 **The load-bearing guess** |
| Supplement revenue | **Not modelled.** Shop sits outside the membership | — |
| Keith's time | **Not costed** | — |
| VAT | **Excluded.** See section 6 | 🔴 Open |

---

## 2. Base case, month by month

| Month | Kits | Paying members | Kit revenue | Subscription | Kit cost | Stripe | Fixed | Profit |
|---|---|---|---|---|---|---|---|---|
| 1 | 4 | 0 | 476 | 0 | 262 | 8 | 330 | **−124** |
| 2 | 6 | 2 | 714 | 94 | 393 | 14 | 330 | **71** |
| 3 | 9 | 5 | 1,071 | 228 | 590 | 22 | 330 | **357** |
| 4 | 12 | 9 | 1,428 | 424 | 786 | 32 | 330 | **704** |
| 5 | 16 | 14 | 1,904 | 676 | 1,048 | 45 | 330 | **1,157** |
| 6 | 20 | 21 | 2,380 | 1,005 | 1,310 | 59 | 330 | **1,686** |
| 7 | 25 | 30 | 2,975 | 1,404 | 1,638 | 77 | 330 | **2,335** |
| 8 | 30 | 40 | 3,570 | 1,893 | 1,966 | 96 | 330 | **3,072** |
| 9 | 35 | 52 | 4,165 | 2,466 | 2,293 | 117 | 330 | **3,891** |
| 10 | 40 | 66 | 4,760 | 3,116 | 2,621 | 139 | 330 | **4,786** |
| 11 | 45 | 82 | 5,355 | 3,838 | 2,948 | 163 | 330 | **5,751** |
| 12 | 50 | 98 | 5,950 | 4,627 | 3,276 | 188 | 330 | **6,783** |
| **Year 1** | **292** | **98** | **34,748** | **19,771** | **19,131** | **960** | **3,960** | **30,468** |

**Revenue GBP 54,519 · Cost GBP 24,051 · Profit GBP 30,468 · Margin 56%**

_(The monthly profit column sums to GBP 30,469; the one-pound difference is rounding.)_

**Only month one is negative, at minus GBP 124.** It is cash-positive from month two onward and never
returns.

---

## 3. Three scenarios

Same conversion and churn; only the acquisition ramp changes.

| Scenario | Kits year 1 | Members at M12 | Revenue | **Profit** | Margin |
|---|---|---|---|---|---|
| Slow (2 rising to 25/month) | 144 | 48 | 26,846 | **12,979** | 48% |
| **Base (4 rising to 50/month)** | **292** | **98** | **54,519** | **30,468** | **56%** |
| Strong (8 rising to 100/month) | 584 | 197 | 109,042 | **64,618** | 59% |

---

## 4. Sensitivity, and a correction

Base ramp, varying the two behavioural guesses.

⚠️ **These nine cells are AT GBP 49 and have not been individually rerun.** Only the centre cell was
recomputed: at GBP 47 it is **30,468**, not 31,297. Every other cell falls by about 4% of its own
subscription line, so roughly GBP 500 at 30% conversion and GBP 1,100 at 70%. The **shape** of the
table, which is the only thing it is used for, is unchanged.

| | Churn 5% | Churn 7% | Churn 10% |
|---|---|---|---|
| Conversion 30% | 23,762 | 23,209 | 22,448 |
| Conversion 50% | 32,148 | **31,297** _(30,468 at GBP 47)_ | 30,028 |
| Conversion 70% | 40,535 | 39,246 | 37,469 |

🔴 **This corrects the 90-day model.** That document called day-30 conversion "the single biggest number",
which is true over 90 days and **false over a year**. Across the full range, conversion moves year-one
profit by about GBP 16,000 and churn by about GBP 3,000, while **the acquisition ramp moves it by GBP
53,000** between slow and strong. **How many kits you sell dominates everything else in year one.**

Churn looks almost irrelevant here only because the member base is young. In year two it becomes the
dominant term, because that is when compounding either works for you or against you.

---

## 5. What year one is hiding

**The kit is carrying the business, not the membership.** GBP 34,748 of kit revenue against GBP 19,771 of
subscription, so 64% of year one is one-off sales. That inverts in year two as the member base compounds
and kit sales flatten. **Year one is a testing business with a subscription attached. Year two is the
reverse, or the model has failed.**

🔴 **The retest liability is not in these numbers.** An annual included retest means the first cohort
reaches its retest in month 13, so **zero retest cost appears in year one**. At 98 members that is
**GBP 6,202 of cost carried into year two**, and it grows with the base. Year one looks better than the
business is by roughly that amount.

**Supplement revenue is not modelled at all.** The shop sits outside the membership at member pricing, so
anything it earns is upside on top of the above.

**Keith's time is not costed.** GBP 30,468 of profit against a year of full-time founder work is below a
salary. That is normal for year one and it should be said out loud rather than discovered.

---

## 6. Two cliffs worth seeing before they arrive

🔴 **VAT.** The registration threshold is GBP 90,000 of taxable turnover. **The base case at GBP 54,519 is
under it. The strong case at GBP 109,042 is over it**, and would trigger mandatory registration mid-year.
If the membership is standard-rated at 20%, that is roughly GBP 18,000 off the strong case unless prices
rise. Diagnostic testing may qualify as exempt medical care, but **a subscription that is mostly software
and content probably is not**, and nobody has checked. **Get this answered before pricing is published, not
when the threshold is crossed.**

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
| GBP 0 | 0 | **30,468** |
| GBP 15 | 4,380 | **26,088** |
| GBP 30 | 8,760 | **21,708** |
| GBP 45 | 13,140 | **17,328** |
| GBP 60 | 17,520 | **12,948** |

Paid acquisition survives here in a way it did not in the 90-day model, because the kit margin covers it.
At GBP 30 a member the base case still clears GBP 21,700. **That is the difference a 12-month view makes:
CAC is affordable when you count the subscription tail, and unaffordable when you only count 90 days.**

---

## 7. Read of it

The shape is a real business at the base case and a modest one at slow. It is cash-positive from month two,
carries no inventory, and has bounded downside because every kit buyer is profitable whether or not they
subscribe.

**What decides which column you land in is not conversion, churn or price. It is how many kits you sell.**
Everything in this model traces back to that ramp, and it is the assumption with the least evidence behind
it. Before building the app, the cheapest thing to learn is whether four kits a month is achievable at all
today, because if it is not, none of the rest matters.
