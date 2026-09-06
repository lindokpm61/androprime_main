# Membership model: 90 days, 20 members

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. Nothing here is decided.
**Question it answers:** if twenty people buy a kit, what is actually left after ninety days.

> 🔄 **RERUN AT GBP 47 on 2026-09-07.** Built at GBP 49, which was a placeholder: Keith had already
> ruled the sticker at **GBP 47** on 2026-08-24 on VAT-threshold grounds, and this model was never
> updated. The rerun was validated by first reproducing every published figure at GBP 49 from the
> stated assumptions, so the new numbers come from the same arithmetic rather than a re-estimate.
> **Sections 2, 4, 5 and 7 carry new figures.** Two things are flagged rather than changed: the
> conversion-sensitivity pair in §6, which does not reproduce from this model's own method and did not
> before the price change either; and the "3 payments" assumption in §1, which the 2026-09-07 anchor
> ruling may reduce to 2 (see the note under §2).
>
> **The headline effect: 90-day profit at twenty members falls from GBP 852 to GBP 793, and the GBP 40
> CAC row changes sign.**

**Read with:** `../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the pricing
came from), `../../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` (what still has to be
built before any of this can happen).

---

## 1. Assumptions, and which ones are guesses

| Assumption | Value | Confidence |
|---|---|---|
| Entry kit | Kit 2, GBP 119 retail, **GBP 63.00 COGS** | 🟢 Vitall-quoted |
| Membership | **GBP 47/month**, first 30 days included in the kit price | 🟢 **Both halves are now decided.** The included month: Keith, 2026-08-27 (`../2026-08-27-first-month-included-in-kit-price.md`). The price: **GBP 47**, Keith 2026-08-24, on VAT-threshold grounds (`../2026-08-24-vertical-agnostic-monitoring-thesis.md` §11, and §6 of the year-1 forecast). **Reran at 47 on 2026-09-07**; the GBP 49 this model was built on was a placeholder that predated the ruling and was never a decision. |
| Payments in 90 days | Day 30, day 60, day 90 = **3 payments** | 🟠 **Arithmetic, but see the anchor note below.** |
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
| 3 monthly payments at GBP 47 | +141.00 |
| **Revenue** | **+260.00** |
| Kit COGS | −63.00 |
| Retest at day 90 | −63.00 |
| Stripe on the kit | −1.99 |
| Stripe on 3 subscriptions | −2.72 |
| **Direct cost** | **−130.71** |
| **Gross, per converting member** | **+129.29** |

A member who **does not** convert at day 30 still leaves +54.01 (kit revenue less kit COGS and Stripe),
which the price change does not touch. **Nobody is loss-making.** That is what the included first month
buys.

> 🔵 **The 2026-09-07 anchor ruling puts a question mark over "3 payments".** The included month now
> starts when the **result lands**, not at purchase (`../2026-09-07-anchor-everything-to-the-result.md`).
> With a result back around day 14, the included month runs to about day 44 and the payments fall at
> roughly day 44, 74 and 104: **two inside 90 days from purchase, not three.** Whether that matters
> depends on whether "90 days" here means from purchase or from the result, which this model never had
> to say because the two used to be the same date. **Not reworked**, because it is a modelling choice
> rather than an error, but at two payments the per-member gross falls to about GBP 82 and the
> twenty-member profit to about GBP 323. Worth settling before this model is quoted at anyone.

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
| 30 subscription payments (10 members x 3) at GBP 47 | +1,410.00 |
| **Revenue** | **+3,790.00** |
| 20 kits at COGS | −1,260.00 |
| Failed-sample reserve, 4% | −50.40 |
| 10 retests at day 90 | −630.00 |
| Stripe, all transactions | −66.85 |
| Fixed costs, 3 months | −990.00 |
| **Total cost** | **−2,997.25** |
| **Profit, 90 days** | **+792.75** |

**About GBP 264 a month.** If the retest is annual rather than at day 90, it becomes **GBP 1,422.75**, or
about GBP 474 a month.

### What CAC does to that

| Cost per member acquired | 20 members | Profit left |
|---|---|---|
| GBP 0, organic only | 0 | 792.75 |
| GBP 20 | 400 | 392.75 |
| GBP 40 | 800 | **−7.25** |
| GBP 60 | 1,200 | **−407.25** |

🔴 **The GBP 40 row changed sign when the price was corrected.** At GBP 49 it cleared GBP 51.60; at the
real price of GBP 47 it loses GBP 7.25. **A two-pound price difference is the whole margin at this
scale**, which is the clearest possible statement of how thin twenty members is. At twenty members this
works organically or not at all.

---

## 5. The same model at scale

Fixed costs held roughly flat, Customer.io nudged up.

| Kit buyers | Converting | Revenue | Direct cost | Fixed | **Profit, 90 days** | Fixed as % of gross |
|---|---|---|---|---|---|---|
| 20 | 10 | 3,790 | 2,007 | 990 | **793** | 56% |
| 50 | 25 | 9,475 | 5,018 | 1,050 | **3,407** | 24% |
| 100 | 50 | 18,950 | 10,036 | 1,200 | **7,714** | 13% |
| 200 | 100 | 37,900 | 20,073 | 1,500 | **16,328** | 8% |

**The shape of the answer: fixed costs eat 56% of gross at twenty members and 13% at a hundred.** Twenty
members is not a business, it is a validation exercise that happens to break even.

---

## 6. What moves the number most

In order.

1. **Day-30 conversion.** Modelled at 50%. ⚠️ **The 30% and 70% figures below do not reproduce from
   this model's own method and are left as written rather than silently replaced.** Re-running §4's
   arithmetic gives about GBP 527 at 30% and GBP 1,177 at 70% (at GBP 49), against the GBP 380 and
   GBP 1,320 printed here. The gap is not the price change; it predates it, and whatever produced these
   two numbers is not the calculation in §4. **Treat the range as directional only until someone
   re-derives it.** As written: at 30% the twenty-member case makes GBP 380; at 70% it makes
   GBP 1,320. **Nothing else in this model has that range, and no spreadsheet can tell you the answer.**
   It is decided by whether the app is any good, which is the thing that has to be built and run.
2. **Whether the retest sits at day 90 or at 12 months.** GBP 630 on twenty members, and it is a product
   decision, not a cost decision: without it the member never gets the proof the subscription promised.
3. **CAC.** At GBP 40 it erases the ninety-day profit at this scale. Organic only, until volume.
4. **Kit COGS.** GBP 63 x every member. A volume discount from Vitall is the only lever with real room, and
   it has never been asked for.

---

## 7. The honest verdict

**At twenty members: no, this is not worth doing for the money.** Just under eight hundred pounds over
three months, before any value is put on Keith's time, and one modest paid-acquisition budget does not
merely wipe it out but takes it negative.

**What twenty members buys is the answer to the only question that matters**, which is what percentage of
people pay at day 30. That number decides whether the hundred-member row is real, and the hundred-member
row is worth **GBP 8,000 a quarter** at 87% gross on the recurring line.

So the case for building it is not the first twenty members. It is that the model has a genuine shape at a
hundred, the fixed costs barely move between the two, and **every member is profitable even if they never
convert**. The downside is bounded and the upside is not.

**What would change this verdict:** a day-30 conversion below about 25%, a CAC above GBP 40 with no
organic route, or discovering that the app takes six months to build rather than six weeks.
