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

> 🔄 **RERUN AGAIN ACROSS ALL THREE KITS on 2026-09-07** (Keith: *"run the forecast on all the
> kits at 47"*), to match the year-1 forecast, which was rerun the same day. This model used **Kit 2
> alone** as the entry kit and as the retest kit. It now uses the blended three-kit figures:
> **price GBP 122.62, COGS GBP 67.03**, at the mix 68 / 148 / 38 documented in
> `../../04_products/catalogue/non-regulated-tier-v72-financials.md` §4.1. **Sections 1, 2, 4, 5, 6 and 7
> carry new figures.**
>
> **The headline effect: 90-day profit at twenty members falls from GBP 793 to GBP 740**, and the
> break-even CAC tightens from about GBP 40 to about GBP 37 a member. The direction is the opposite of
> the year-1 forecast's, where the mix was roughly profit-neutral, and the reason is the **retest**: at
> twenty members it is bought at blended COGS but never sold, so a richer mix raises a cost with no
> matching revenue inside the 90 days.

**Read with:** `../../04_products/supplements/supplement-unit-economics-2026-08-24.md` (where the pricing
came from), `../../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` (what still has to be
built before any of this can happen).

---

## 1. Assumptions, and which ones are guesses

| Assumption | Value | Confidence |
|---|---|---|
| Entry kit | **All three kits, blended: GBP 122.62 retail, GBP 67.03 COGS** | 🟢 Vitall-quoted COGS; 🔴 the MIX is a guess |
| Kit mix (Kit 1 / 2 / 3) | **68 / 148 / 38, i.e. 26.8% / 58.3% / 15.0%** | 🔴 From `../../04_products/catalogue/non-regulated-tier-v72-financials.md` §4.1, whose staleness banner explicitly exempts §4.1. A Phase 0 6-month table, so treat as directional |
| Membership | **GBP 47/month**, first 30 days included in the kit price | 🟢 **Both halves are now decided.** The included month: Keith, 2026-08-27 (`../2026-08-27-first-month-included-in-kit-price.md`). The price: **GBP 47**, Keith 2026-08-24, on VAT-threshold grounds (`../2026-08-24-vertical-agnostic-monitoring-thesis.md` §11, and §6 of the year-1 forecast). **Reran at 47 on 2026-09-07**; the GBP 49 this model was built on was a placeholder that predated the ruling and was never a decision. |
| Payments in 90 days | Day 30, day 60, day 90 = **3 payments** | 🟠 **Arithmetic, but see the anchor note below.** |
| Stripe | 1.5% + GBP 0.20 per transaction | 🟢 Standard UK |
| **Day-30 conversion** | **50%** | 🔴 **A guess, and the single biggest number in this model** |
| Retest at day 90 | Included, **the member's own kit again, GBP 67.03 blended** | 🟠 A design choice, modelled both ways |
| Failed sample reserve | 4% of kits, per `master-implementation-blueprint.md` | 🟢 Already in the repo |
| CAC | **Excluded below, shown separately** | 🔴 Unknown |
| Keith's time | **Not costed** | — |
| VAT | **Excluded.** Position on kits and supplements unverified | 🔴 Open |

---

## 2. Per member, over 90 days

A member who buys a kit and converts at day 30:

| Line | Amount |
|---|---|
| Kit (blended) | +122.62 |
| 3 monthly payments at GBP 47 | +141.00 |
| **Revenue** | **+263.62** |
| Kit COGS (blended) | −67.03 |
| Retest at day 90 (blended) | −67.03 |
| Stripe on the kit | −2.04 |
| Stripe on 3 subscriptions | −2.72 |
| **Direct cost** | **−138.82** |
| **Gross, per converting member** | **+124.80** |

_(Was +129.29 at Kit 2 alone. The kit line gains GBP 3.62 of revenue and GBP 4.03 of COGS, and the
retest adds another GBP 4.03 of cost with no revenue against it.)_

A member who **does not** convert at day 30 still leaves +53.55 (kit revenue less kit COGS and Stripe),
was +54.01. **Nobody is loss-making**, on any kit in the range. That is what the included first month
buys, and it survives the mix.

> 🔵 **The 2026-09-07 anchor ruling puts a question mark over "3 payments".** The included month now
> starts when the **result lands**, not at purchase (`../2026-09-07-anchor-everything-to-the-result.md`).
> With a result back around day 14, the included month runs to about day 44 and the payments fall at
> roughly day 44, 74 and 104: **two inside 90 days from purchase, not three.** Whether that matters
> depends on whether "90 days" here means from purchase or from the result, which this model never had
> to say because the two used to be the same date. **Not reworked**, because it is a modelling choice
> rather than an error, but at two payments the per-member gross falls to about GBP 79 and the
> twenty-member profit to about GBP 279 (was GBP 82 and GBP 323 before the all-kits rerun). Worth
> settling before this model is quoted at anyone.

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
| 20 kits at GBP 122.62 blended | +2,452.40 |
| 30 subscription payments (10 members x 3) at GBP 47 | +1,410.00 |
| **Revenue** | **+3,862.40** |
| 20 kits at blended COGS | −1,340.60 |
| Failed-sample reserve, 4% | −53.62 |
| 10 retests at day 90 | −670.30 |
| Stripe, all transactions | −67.94 |
| Fixed costs, 3 months | −990.00 |
| **Total cost** | **−3,122.46** |
| **Profit, 90 days** | **+739.94** |

**About GBP 247 a month** (was GBP 264). If the retest is annual rather than at day 90, it becomes
**GBP 1,410.24**, or about GBP 470 a month.

### What CAC does to that

| Cost per member acquired | 20 members | Profit left |
|---|---|---|
| GBP 0, organic only | 0 | 739.94 |
| GBP 20 | 400 | 339.94 |
| GBP 40 | 800 | **−60.06** |
| GBP 60 | 1,200 | **−460.06** |

🔴 **The GBP 40 row changed sign when the price was corrected, and the all-kits rerun drove it further
under.** At GBP 49 on Kit 2 it cleared GBP 51.60; at GBP 47 on Kit 2 it lost GBP 7.25; across all three
kits it loses GBP 60.06. **Break-even CAC is now about GBP 37 a member, down from about GBP 40.**
A two-pound price difference was already the whole margin at this scale, and a four-pound COGS
difference is the same story. At twenty members this works organically or not at all.

---

## 5. The same model at scale

Fixed costs held roughly flat, Customer.io nudged up.

| Kit buyers | Converting | Revenue | Direct cost | Fixed | **Profit, 90 days** | Fixed as % of gross |
|---|---|---|---|---|---|---|
| 20 | 10 | 3,862 | 2,132 | 990 | **740** | 57% |
| 50 | 25 | 9,656 | 5,331 | 1,050 | **3,275** | 24% |
| 100 | 50 | 19,312 | 10,662 | 1,200 | **7,450** | 14% |
| 200 | 100 | 38,624 | 21,325 | 1,500 | **15,799** | 9% |

_(Kit-2-only profits were 793 / 3,407 / 7,714 / 16,328.)_

**The shape of the answer: fixed costs eat 57% of gross at twenty members and 14% at a hundred.** Twenty
members is not a business, it is a validation exercise that happens to break even. **The mix does not
change that shape**, it just moves every row down by about 3 to 4%.

---

## 6. What moves the number most

In order.

1. **Day-30 conversion.** Modelled at 50%. ⚠️ **The 30% and 70% figures below do not reproduce from
   this model's own method and are left as written rather than silently replaced.** Re-running §4's
   arithmetic gives about GBP 455 at 30% and GBP 1,025 at 70% (all kits at GBP 47; it was GBP 527 and
   GBP 1,177 at GBP 49 on Kit 2), against the GBP 380 and GBP 1,320 printed here. The gap is not the price change; it predates it, and whatever produced these
   two numbers is not the calculation in §4. **Treat the range as directional only until someone
   re-derives it.** As written: at 30% the twenty-member case makes GBP 380; at 70% it makes
   GBP 1,320. **Nothing else in this model has that range, and no spreadsheet can tell you the answer.**
   It is decided by whether the app is any good, which is the thing that has to be built and run.
2. **Whether the retest sits at day 90 or at 12 months.** GBP 670 on twenty members (was GBP 630 on
   Kit 2 alone), and it is a product decision, not a cost decision: without it the member never gets the proof the subscription promised.
3. **CAC.** At GBP 40 it erases the ninety-day profit at this scale. Organic only, until volume.
4. **Kit COGS.** GBP 67.03 blended x every member, and **x2 for anyone who converts**, because the
   retest is the same kit again. A volume discount from Vitall is the only lever with real room, and it
   has never been asked for. **The all-kits rerun makes this lever bigger, not smaller.**

---

## 7. The honest verdict

**At twenty members: no, this is not worth doing for the money.** About seven hundred and forty pounds
over three months, before any value is put on Keith's time, and one modest paid-acquisition budget does
not merely wipe it out but takes it negative.

**What twenty members buys is the answer to the only question that matters**, which is what percentage of
people pay at day 30. That number decides whether the hundred-member row is real, and the hundred-member
row is worth **about GBP 7,500 a quarter** at roughly 88% gross on the recurring line.

So the case for building it is not the first twenty members. It is that the model has a genuine shape at a
hundred, the fixed costs barely move between the two, and **every member is profitable even if they never
convert**. The downside is bounded and the upside is not.

**What would change this verdict:** a day-30 conversion below about 25%, a CAC above GBP 40 with no
organic route, or discovering that the app takes six months to build rather than six weeks.
