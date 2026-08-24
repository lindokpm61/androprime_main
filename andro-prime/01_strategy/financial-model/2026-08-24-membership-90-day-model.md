# Membership model: 90 days, 20 members

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. Nothing here is decided.
**Question it answers:** if twenty people buy a kit, what is actually left after ninety days.

**Read with:** `../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the pricing
came from), `../../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` (what still has to be
built before any of this can happen).

---

## 1. Assumptions, and which ones are guesses

| Assumption | Value | Confidence |
|---|---|---|
| Entry kit | Kit 2, GBP 119 retail, **GBP 63.00 COGS** | 🟢 Vitall-quoted |
| Membership | GBP 49/month, first 30 days included in the kit price | 🟠 Illustrative, not set |
| Payments in 90 days | Day 30, day 60, day 90 = **3 payments** | 🟢 Arithmetic |
| Stripe | 1.5% + GBP 0.20 per transaction | 🟢 Standard UK |
| **Day-30 conversion** | **50%** | 🔴 **A guess, and the single biggest number in this model** |
| Retest at day 90 | Included, Kit 2 again, GBP 63.00 | 🟠 A design choice, modelled both ways |
| Failed sample reserve | 4% of kits, per `master-implementation-blueprint.md` | 🟢 Already in the repo |
| CAC | **Excluded below, shown separately** | 🔴 Unknown |
| Keith's time | **Not costed** | — |
| VAT | **Excluded.** Position on kits and supplements unverified | 🔴 Open |

---

## 2. Per member, over 90 days

A member who buys a kit and converts at day 30:

| Line | Amount |
|---|---|
| Kit | +119.00 |
| 3 monthly payments at GBP 49 | +147.00 |
| **Revenue** | **+266.00** |
| Kit COGS | −63.00 |
| Retest at day 90 | −63.00 |
| Stripe on the kit | −1.99 |
| Stripe on 3 subscriptions | −2.82 |
| **Direct cost** | **−130.81** |
| **Gross, per converting member** | **+135.19** |

A member who **does not** convert at day 30 still leaves +54.01 (kit revenue less kit COGS and Stripe).
**Nobody is loss-making.** That is what the included first month buys.

---

## 3. Fixed costs, which nobody has been counting

Monthly, at launch scale. These run whether you have two members or two hundred.

| Line | Monthly | Note |
|---|---|---|
| Customer.io | 80 | Entry plan, scales with profiles |
| FirstPromoter | 40 | Affiliate attribution, already wired |
| Hetzner | 25 | App hosting |
| Supabase Pro | 20 | Free tier will not carry production |
| Sentry, Cloudflare, domain, misc | 15 | |
| Clinician content (2 answers a month) | 150 | Ewa or a contracted clinician |
| **Total** | **330** | **GBP 990 over 90 days** |

🔴 **Not included and worth checking:** whether the Vitall services agreement carries any minimum spend
or account fee. Nobody has looked.

---

## 4. Twenty kit buyers, ninety days

Ten convert at day 30, on the 50% assumption.

| | Amount |
|---|---|
| 20 kits at GBP 119 | +2,380.00 |
| 30 subscription payments (10 members x 3) | +1,470.00 |
| **Revenue** | **+3,850.00** |
| 20 kits at COGS | −1,260.00 |
| Failed-sample reserve, 4% | −50.40 |
| 10 retests at day 90 | −630.00 |
| Stripe, all transactions | −68.00 |
| Fixed costs, 3 months | −990.00 |
| **Total cost** | **−2,998.40** |
| **Profit, 90 days** | **+851.60** |

**About GBP 284 a month.** If the retest is annual rather than at day 90, it becomes **GBP 1,481.60**, or
about GBP 494 a month.

### What CAC does to that

| Cost per member acquired | 20 members | Profit left |
|---|---|---|
| GBP 0, organic only | 0 | 851.60 |
| GBP 20 | 400 | 451.60 |
| GBP 40 | 800 | **51.60** |
| GBP 60 | 1,200 | **−348.40** |

**At GBP 40 of paid acquisition the whole ninety days nets fifty pounds.** At twenty members this only
works organically.

---

## 5. The same model at scale

Fixed costs held roughly flat, Customer.io nudged up.

| Kit buyers | Converting | Revenue | Direct cost | Fixed | **Profit, 90 days** | Fixed as % of gross |
|---|---|---|---|---|---|---|
| 20 | 10 | 3,850 | 2,008 | 990 | **852** | 54% |
| 50 | 25 | 9,625 | 5,021 | 1,050 | **3,554** | 23% |
| 100 | 50 | 19,250 | 10,041 | 1,200 | **8,009** | 13% |
| 200 | 100 | 38,500 | 20,082 | 1,500 | **16,918** | 8% |

**The shape of the answer: fixed costs eat 54% of gross at twenty members and 13% at a hundred.** Twenty
members is not a business, it is a validation exercise that happens to break even.

---

## 6. What moves the number most

In order.

1. **Day-30 conversion.** Modelled at 50%. At 30% the twenty-member case makes GBP 380; at 70% it makes
   GBP 1,320. **Nothing else in this model has that range, and no spreadsheet can tell you the answer.**
   It is decided by whether the app is any good, which is the thing that has to be built and run.
2. **Whether the retest sits at day 90 or at 12 months.** GBP 630 on twenty members, and it is a product
   decision, not a cost decision: without it the member never gets the proof the subscription promised.
3. **CAC.** At GBP 40 it erases the ninety-day profit at this scale. Organic only, until volume.
4. **Kit COGS.** GBP 63 x every member. A volume discount from Vitall is the only lever with real room, and
   it has never been asked for.

---

## 7. The honest verdict

**At twenty members: no, this is not worth doing for the money.** Eight hundred and fifty pounds over three
months, before any value is put on Keith's time, and one modest paid-acquisition budget wipes it out.

**What twenty members buys is the answer to the only question that matters**, which is what percentage of
people pay at day 30. That number decides whether the hundred-member row is real, and the hundred-member
row is worth **GBP 8,000 a quarter** at 87% gross on the recurring line.

So the case for building it is not the first twenty members. It is that the model has a genuine shape at a
hundred, the fixed costs barely move between the two, and **every member is profitable even if they never
convert**. The downside is bounded and the upside is not.

**What would change this verdict:** a day-30 conversion below about 25%, a CAC above GBP 40 with no
organic route, or discovering that the app takes six months to build rather than six weeks.
