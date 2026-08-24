# Membership: 12-month forecast

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. Nothing decided. Computed, not estimated.

**Read with:** `2026-08-24-membership-90-day-model.md` (the unit economics this is built on),
`../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the prices came from).

---

## 1. What is modelled

Kit at GBP 119 (Kit 2, GBP 63.00 COGS) as the paid entry, including the first 30 days of membership.
Membership at GBP 49/month thereafter. One retest included per year.

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
| 2 | 6 | 2 | 714 | 98 | 393 | 14 | 330 | **75** |
| 3 | 9 | 5 | 1,071 | 238 | 590 | 22 | 330 | **367** |
| 4 | 12 | 9 | 1,428 | 442 | 786 | 32 | 330 | **721** |
| 5 | 16 | 14 | 1,904 | 705 | 1,048 | 45 | 330 | **1,185** |
| 6 | 20 | 21 | 2,380 | 1,048 | 1,310 | 60 | 330 | **1,728** |
| 7 | 25 | 30 | 2,975 | 1,464 | 1,638 | 78 | 330 | **2,394** |
| 8 | 30 | 40 | 3,570 | 1,974 | 1,966 | 97 | 330 | **3,152** |
| 9 | 35 | 52 | 4,165 | 2,571 | 2,293 | 119 | 330 | **3,994** |
| 10 | 40 | 66 | 4,760 | 3,249 | 2,621 | 141 | 330 | **4,916** |
| 11 | 45 | 82 | 5,355 | 4,001 | 2,948 | 166 | 330 | **5,912** |
| 12 | 50 | 98 | 5,950 | 4,824 | 3,276 | 191 | 330 | **6,976** |
| **Year 1** | **292** | **98** | **34,748** | **20,614** | **19,132** | **973** | **3,960** | **31,297** |

**Revenue GBP 55,362 · Cost GBP 24,065 · Profit GBP 31,297 · Margin 57%**

**Only month one is negative, at minus GBP 124.** It is cash-positive from month two onward and never
returns.

---

## 3. Three scenarios

Same conversion and churn; only the acquisition ramp changes.

| Scenario | Kits year 1 | Members at M12 | Revenue | **Profit** | Margin |
|---|---|---|---|---|---|
| Slow (2 rising to 25/month) | 144 | 48 | 27,259 | **13,386** | 49% |
| **Base (4 rising to 50/month)** | **292** | **98** | **55,362** | **31,297** | **57%** |
| Strong (8 rising to 100/month) | 584 | 197 | 110,724 | **66,275** | 60% |

---

## 4. Sensitivity, and a correction

Base ramp, varying the two behavioural guesses.

| | Churn 5% | Churn 7% | Churn 10% |
|---|---|---|---|
| Conversion 30% | 23,762 | 23,209 | 22,448 |
| Conversion 50% | 32,148 | **31,297** | 30,028 |
| Conversion 70% | 40,535 | 39,246 | 37,469 |

🔴 **This corrects the 90-day model.** That document called day-30 conversion "the single biggest number",
which is true over 90 days and **false over a year**. Across the full range, conversion moves year-one
profit by about GBP 16,000 and churn by about GBP 3,000, while **the acquisition ramp moves it by GBP
53,000** between slow and strong. **How many kits you sell dominates everything else in year one.**

Churn looks almost irrelevant here only because the member base is young. In year two it becomes the
dominant term, because that is when compounding either works for you or against you.

---

## 5. What year one is hiding

**The kit is carrying the business, not the membership.** GBP 34,748 of kit revenue against GBP 20,614 of
subscription, so 63% of year one is one-off sales. That inverts in year two as the member base compounds
and kit sales flatten. **Year one is a testing business with a subscription attached. Year two is the
reverse, or the model has failed.**

🔴 **The retest liability is not in these numbers.** An annual included retest means the first cohort
reaches its retest in month 13, so **zero retest cost appears in year one**. At 98 members that is
**GBP 6,202 of cost carried into year two**, and it grows with the base. Year one looks better than the
business is by roughly that amount.

**Supplement revenue is not modelled at all.** The shop sits outside the membership at member pricing, so
anything it earns is upside on top of the above.

**Keith's time is not costed.** GBP 31,297 of profit against a year of full-time founder work is below a
salary. That is normal for year one and it should be said out loud rather than discovered.

---

## 6. Two cliffs worth seeing before they arrive

🔴 **VAT.** The registration threshold is GBP 90,000 of taxable turnover. **The base case at GBP 55,362 is
under it. The strong case at GBP 110,724 is over it**, and would trigger mandatory registration mid-year.
If the membership is standard-rated at 20%, that is roughly GBP 18,000 off the strong case unless prices
rise. Diagnostic testing may qualify as exempt medical care and supplements are usually zero-rated, but
**a subscription that is mostly software and content probably is not**, and nobody has checked. **Get this
answered before pricing is published, not when the threshold is crossed.**

🔴 **CAC.** Everything above assumes organic acquisition.

| CAC per kit buyer | Year-1 spend | Profit after |
|---|---|---|
| GBP 0 | 0 | **31,297** |
| GBP 15 | 4,380 | **26,917** |
| GBP 30 | 8,760 | **22,537** |
| GBP 45 | 13,140 | **18,157** |
| GBP 60 | 17,520 | **13,777** |

Paid acquisition survives here in a way it did not in the 90-day model, because the kit margin covers it.
At GBP 30 a member the base case still clears GBP 22,000. **That is the difference a 12-month view makes:
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
