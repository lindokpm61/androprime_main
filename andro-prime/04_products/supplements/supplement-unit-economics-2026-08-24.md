# Supplement unit economics: a worked example

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** WORKING MODEL. **No price is set.** Every retail
figure below is illustrative and chosen to show the shape, not proposed.

> 🔴 **DIRECTION MOVED, 2026-08-24, after this was written.** Sections 1 to 7 are the supplement unit economics and stand. Sections 8 to 10 walk through pricing models that were then overtaken: the current direction is **the app as the product, the kit as the gateway, supplements at member price in a secondary shop** (`../../01_strategy/STATE.md`). Section 10's market research and the 90%-margin arithmetic remain the reference for any membership pricing. Nothing here is decided.

**Read with:** `supplement-purchase-list.md` (the SKUs and trade prices),
`../../09_website-app/docs/2026-08-23-supplement-shop-front-spec.md` sections 4a to 4e (why the cadence is
4-monthly), `daily-stack.md` (the superseded blended product this replaces).

---

## The finding that has to come first: the GBP 34.95 anchor does not transfer

`daily-stack.md` specifies **60 capsules, 2 per day, a 30-day supply**, at **GBP 34.95/month**. That is a
true monthly consumable: the customer finishes the pack every month and pays every month.

**Stock single-nutrient bottles are not monthly consumables.** They are 4-month and 12-month packs. The
separate-bottles decision of 2026-08-22 was taken on the COGS side, where it is a clear win (GBP 1.92/month
against a blend that cannot be manufactured at all). **Nobody checked the revenue side, and that is where it
costs.**

You cannot charge GBP 34.95 a month for a bottle of zinc the customer can price-check at Holland &
Barrett. **The blend's commercial value was that it was not comparable to anything.** Three named
commodity bottles are comparable to everything.

**Consequence: the supplement revenue line in the financial model and the LTV/CAC model are both built on
GBP 34.95/month and are now wrong.** Quantified at the bottom of this page. That is a decision sweep, not
an edit.

---

## 1. The verified costs

**Product**, from the Nutribl catalogue, Tier 1 trade, checked against the `Suggested serving` column:

| SKU | ID | Pack | Serving | Supply | Trade | Cost per month of supply |
|---|---|---|---|---|---|---|
| Vitamin D3 4000iu | 1152 | 365 tablets | 1/day | **12 months** | GBP 3.00 | GBP 0.25 |
| Vitamin B12 1mg | 1009 | 120 capsules | 1/day | **4 months** | GBP 3.95 | GBP 0.99 |
| Zinc 15mg | 1121 | 120 capsules | 1/day | **4 months** | GBP 2.72 | GBP 0.68 |
| **All three** | | | | | **GBP 9.67** | **GBP 1.92** |

**Per shipment**, and these are the numbers that actually decide the model:

| Line | Figure | Confidence |
|---|---|---|
| Fulfilment: 3PL pick, pack and postage | **GBP 3.00** | 🔴 **STILL UNVERIFIED, AND NOW ASKED. 2026-08-24:** Nutribl were asked on 23 Aug and their 24 Aug reply routed straight back to `t-3PL-Fulfilment-Costs.aspx`, which despite its name **publishes no costs at all** (transfer to the 3PL partner is free, storage and per-order shipping are "a paid service", no figures, no partner named). The only route to the number is a booked call: `nutribl.com/t-call.aspx`. The repo's own estimate stays a GBP 2.00 to 3.50 guess in `omega-3-loop-spec.md` |
| Stripe, UK card | 1.5% + GBP 0.20 | Standard UK pricing |

✅ **The packaging assumption is now VERIFIED (2026-08-24)**, read off all three Nutribl product pages.
**All three launch SKUs are identical: 150ml Flat Postal, bottle 107 x 79 x 22 mm, white HDPE with a PP
snap-on lid.** That holds for the 365-tablet D3 as well as the two 120-capsule bottles, so pack count does
not change the format. Label size 76 x 60 mm; artwork submitted at 80 x 64 mm with 2 mm bleed each side.

🔴 **And it confirms the postage-band problem rather than clearing it.** A single bottle at 22 mm
clears the Royal Mail Large Letter depth limit of 25 mm and posts as a large letter. **Three bottles stacked
is 66 mm, which is a parcel**, in a different and higher band. So a single flat GBP 3.00 cannot be right for
both, and every bundle-versus-single comparison below is built on the assumption that it is. The direction
is now certain: **GBP 3.00 is high for a single and low for the bundle.** The size of the gap is still a
question for the 3PL, and it is the same call as the row above.

## 2. The thing that dominates single-SKU economics

**Fulfilment costs more than the product does.** GBP 3.00 to ship a GBP 2.72 bottle of zinc.

| | Zinc, one-off | Bundle of 3, one-off |
|---|---|---|
| Product | GBP 2.72 | GBP 9.67 |
| Fulfilment | GBP 3.00 | GBP 3.00 |
| **Fulfilment as a share of cost** | **52%** | **24%** |

**The bundle carries GBP 6.95 more product for GBP 0.00 more shipping.** That single fact is the strongest
argument for the bundle, and the strongest argument against building the business on single cheap bottles.

## 3. Single SKU, sold one-off

Zinc, a 4-month bottle, at three illustrative prices:

| Retail | Stripe | Product | Fulfilment | Total cost | Gross | Margin | What the customer pays per month |
|---|---|---|---|---|---|---|---|
| GBP 12.95 | 0.39 | 2.72 | 3.00 | 6.11 | **6.84** | 53% | GBP 3.24 |
| GBP 16.95 | 0.45 | 2.72 | 3.00 | 6.17 | **10.78** | 64% | GBP 4.24 |
| GBP 19.95 | 0.50 | 2.72 | 3.00 | 6.22 | **13.73** | 69% | GBP 4.99 |

The other two at one illustrative price each:

| SKU | Retail | Product | Fulfilment | Stripe | Total cost | Gross | Margin | Per month to customer |
|---|---|---|---|---|---|---|---|---|
| B12, 4 months | GBP 16.95 | 3.95 | 3.00 | 0.45 | 7.40 | **9.55** | 56% | GBP 4.24 |
| D3, 12 months | GBP 14.95 | 3.00 | 3.00 | 0.42 | 6.42 | **8.53** | 57% | **GBP 1.25** |

**Note what D3 does to the customer's arithmetic.** A GBP 14.95 bottle that lasts a year is GBP 1.25 a
month. It is the most obviously good value item in the range and the cheapest to supply. It is the right
product to lead acquisition with, and the worst one to build recurring revenue on.

## 4. The bundle, month by month

**Illustrative: GBP 39.95 per box, billed every 4 months.** The customer has continuous supply of all
three. D3 only reships once a year because the bottle lasts a year.

| Month | Charged | Ships | Product | Fulfil | Stripe | Cost | **Net** |
|---|---|---|---|---|---|---|---|
| 0 | **GBP 39.95** | D3 + B12 + Zinc | 9.67 | 3.00 | 0.80 | 13.47 | **26.48** |
| 1 | 0 | nothing | | | | | |
| 2 | 0 | nothing | | | | | |
| 3 | 0 | nothing | | | | | |
| 4 | **GBP 39.95** | B12 + Zinc | 6.67 | 3.00 | 0.80 | 10.47 | **29.48** |
| 5 to 7 | 0 | nothing | | | | | |
| 8 | **GBP 39.95** | B12 + Zinc | 6.67 | 3.00 | 0.80 | 10.47 | **29.48** |
| 9 to 11 | 0 | nothing | | | | | |
| **Year 1** | **GBP 119.85** | 3 boxes | 23.01 | 9.00 | 2.40 | **34.41** | **GBP 85.44** |

**Year 1 margin 71%. Revenue per customer per month, averaged: GBP 9.99.**

Month 12 opens year two with a full box again, since the D3 runs out.

**At GBP 59.95 per box**, the same shape: year 1 revenue GBP 179.85, cost GBP 35.31, gross **GBP 144.54**,
margin **80%**, GBP 14.99 per customer per month.

## 5. The reality check against the old model

| Model | Revenue per customer, year 1 | Per month |
|---|---|---|
| Daily Stack blend, GBP 34.95/month, 30-day pack | **GBP 419.40** | GBP 34.95 |
| Separate bottles, bundle at GBP 39.95 per 4 months | GBP 119.85 | GBP 9.99 |
| Separate bottles, bundle at GBP 59.95 per 4 months | GBP 179.85 | GBP 14.99 |

**The bundle at GBP 39.95 delivers 29% of the modelled revenue per customer. At GBP 59.95 it delivers
43%.** To match the old model you would have to charge GBP 139.80 for a box of three commodity bottles,
which is not sellable.

**This is not an argument against separate bottles.** The blend cannot be manufactured from stock and does
not qualify under Gate 0A, so separate bottles is the only route that exists. It is an argument that
**the revenue side of the supplement plan has to be rebuilt around a much lower figure per customer**, and
that the volume assumptions behind "supplements fund the kits" need re-running.

## 6. What would change these numbers most

In order of leverage:

1. **The 3PL's real fulfilment fee.** At GBP 3.00 it is half the cost of a single zinc sale. At GBP 1.50 it
   transforms single-SKU margin; at GBP 5.00 single bottles stop being worth selling at all. **This is one
   question to one supplier and it is the largest open variable in the model.**
2. **Bundle versus singles mix.** The bundle spreads one fulfilment fee over three products. A customer
   base that buys singles is materially less profitable than the same revenue in bundles.
3. **Price.** Nothing is set. Every figure above is illustrative.
4. **Product cost.** Least important. The whole three-bottle range costs GBP 9.67, and even a 30% trade
   improvement moves year-one gross by under GBP 8.

## 8. RECOMMENDED STRUCTURE: joining payment, then a monthly maintenance fee (Keith, 2026-08-24)

Keith's proposal: one larger first payment that covers the first box outright, then a lower monthly fee,
with the next box arriving at month 4. **It works, and it solves a real problem that flat monthly pricing
has.**

### Why the joining payment earns its place

At a flat GBP 9.95 a month with no joining fee, **month zero is cash-negative**: you collect GBP 9.95 and
spend GBP 13.02 putting the first box in the post. You are underwater on every new customer until month
two, which is exactly when cancellation risk is highest.

**With a GBP 19.95 joining payment you are in profit from day one and never go negative again**, at any
cancellation point. That is the whole argument for the structure.

### The recommended set

| Item | Price |
|---|---|
| **Bundle** | **GBP 19.95 joining payment, then GBP 9.95/month.** Free delivery. Next box every 4 months |
| D3 4000iu, 365 tablets (12 months) | GBP 16.95 |
| B12 1mg, 120 capsules (4 months) | GBP 17.95 |
| Zinc 15mg, 120 capsules (4 months) | GBP 15.95 |
| Delivery on single orders under GBP 25 | GBP 2.95 |

### Month by month, first year

| Month | Charged | Ships | Cost | Net | Cumulative |
|---|---|---|---|---|---|
| 0 | **19.95** | D3 + B12 + Zinc | 13.17 | +6.78 | **+6.78** |
| 1 | 9.95 | nothing | 0.35 | +9.60 | +16.38 |
| 2 | 9.95 | nothing | 0.35 | +9.60 | +25.98 |
| 3 | 9.95 | nothing | 0.35 | +9.60 | +35.58 |
| 4 | 9.95 | B12 + Zinc | 10.02 | -0.07 | +35.51 |
| 5 | 9.95 | nothing | 0.35 | +9.60 | +45.11 |
| 6 | 9.95 | nothing | 0.35 | +9.60 | +54.71 |
| 7 | 9.95 | nothing | 0.35 | +9.60 | +64.31 |
| 8 | 9.95 | B12 + Zinc | 10.02 | -0.07 | +64.24 |
| 9 | 9.95 | nothing | 0.35 | +9.60 | +73.84 |
| 10 | 9.95 | nothing | 0.35 | +9.60 | +83.44 |
| 11 | 9.95 | nothing | 0.35 | +9.60 | **+93.04** |
| **Year 1** | **129.40** | 3 boxes | 36.36 | | **93.04, margin 72%** |

**The cumulative column never dips below zero.** The two shipping months are roughly break-even and every
other month is nearly pure margin. **Cancel at any point and the customer has been profitable.**

### The constraint to be honest about: the bundle cannot offer a big discount

Buying the same year of continuous supply as singles at the prices above costs **GBP 118.65** (three B12,
three zinc, one D3). The bundle is GBP 129.40. **The bundle is not cheaper, and it cannot easily be made
much cheaper**, because your entire economic gain from bundling is **two saved fulfilment fees, about GBP
6.00 a year.** Three cheap commodity bottles cannot fund a dramatic bundle discount and a strong margin at
the same time.

**So sell the bundle on delivery and convenience, not on price.** Free delivery on the bundle against GBP
2.95 on single orders under GBP 25 is a visible **GBP 8.85 a year** advantage that costs you nothing you
were not already spending, plus "you never run out and never have to think about it". That is the honest
proposition, and it is a normal one.

**It also repairs single-SKU margin.** A GBP 2.95 delivery charge on a GBP 15.95 zinc bottle takes that
sale from 61% to 67% and stops fulfilment eating half the cost. Charging for delivery under a threshold is
standard practice on UK supplement sites.

### D3 is the acquisition hero, and its pricing should not fight that

A 365-tablet bottle at GBP 16.95 is **GBP 1.41 a month** for a year of vitamin D, at 62% margin. It is the
cheapest thing in the range to supply and the most obviously good value to buy. **Lead acquisition with it,
then upsell the bundle.** Do not try to force its per-month price up to match the others; it cannot be done
and it would waste the best offer you have.

### Stripe note on monthly billing

Monthly charging means twelve Stripe fees a year instead of three, and the fixed 20p component bites hardest
on small amounts: at GBP 9.95 the effective rate is about 3.5%, not 1.5%. **It costs roughly GBP 2 a year
per customer more than 4-monthly billing.** Worth it for the lower headline number and the smoother cash
curve, but worth knowing rather than discovering.

### Still to be confirmed before any of this is published

**The GBP 3.00 fulfilment figure is the whole model.** At GBP 1.50 every single-SKU sale improves by GBP
1.50 and the delivery charge could be dropped. At GBP 5.00 single bottles stop being viable and the bundle
becomes the only sensible product. Ask the 3PL before publishing a price. **Asked 2026-08-23, not answered:** Nutribl routed back to a 3PL page that publishes no costs, so this now needs the booked call.

**And ask for TWO figures, not one.** The pack dimensions were verified on 2026-08-24 (see section 1): a single bottle posts as a Large Letter, three stacked do not. Every table on this page uses one flat fee for both.

## 9. TWO BETTER MODELS, once premium positioning is a constraint (Keith, 2026-08-24)

**Keith's direction:** do not compete with Holland & Barrett, because competing there declares the product
low value. The customer hunting best value is not our customer, since the whole point of the supplement is
to be the entry to a funnel that runs supplement to kit to programme.

**That reframes section 8 rather than refining it.** The GBP 9.95 model is not a cautious version of the
right answer, it is aimed at the wrong buyer.

### The reframe: price is a filter, not just a margin

A GBP 9.95 a month supplement selects for price-sensitive buyers. **Those people will never buy a GBP 99
kit, and they will certainly never buy a programme.** You would be paying acquisition cost to fill the top
of the funnel with people constitutionally unable to travel down it.

**And three named commodity bottles cannot be sold at a premium, no matter what the brand says**, because
each one is independently price-checkable in thirty seconds. The blend escaped comparison by being
un-decomposable. The way back to a premium price is not better copy over the same three bottles: **it is to
change the unit of sale to something that has no comparator.**

### MODEL A: Membership. Supplements are included, not sold. RECOMMENDED

The product is membership of Andro Prime. Supplements are a benefit inside it, alongside the thing that has
real perceived value and no high-street equivalent: **the blood test.**

**Illustrative: GBP 29.95/month.** Includes continuous supplement supply, the results dashboard, and one
Kit 1 per year, **unlocking at month 4** rather than on day one.

| Month | Charged | Ships | Cost | Net | Cumulative |
|---|---|---|---|---|---|
| 0 | 29.95 | supplement box (3 bottles) | 13.32 | +16.63 | +16.63 |
| 1 to 3 | 29.95 each | nothing | 0.65 each | +29.30 each | +104.53 |
| 4 | 29.95 | **Kit 1** + supplement box | 68.82 | -38.87 | **+65.66** |
| 5 to 7 | 29.95 each | nothing | 0.65 each | +29.30 each | +153.56 |
| 8 | 29.95 | supplement box | 10.32 | +19.63 | +173.19 |
| 9 to 11 | 29.95 each | nothing | 0.65 each | +29.30 each | **+261.09** |
| **Year 1** | **GBP 359.40** | 3 supplement boxes + 1 kit | 98.31 | | **GBP 261.09, 73%** |

**GBP 261 of gross per member per year, against GBP 93 for the GBP 9.95 bundle. Nearly three times.**

**Why it works:**

- **Not comparable to anything.** Nobody sells this bundle, so nobody can price it against you.
- **It recovers the GBP 34.95 anchor** that section 5 shows the separate-bottles decision destroyed, and it
  does so by attaching the cheap thing (GBP 1.92/month of supplements) to the valuable thing.
- **It collapses two funnel steps into one.** Every member is a tested customer, which is exactly the
  population that converts to a programme. Today the supplement buyer and the kit buyer are separate people
  who have to be persuaded twice.
- **The margin holds** at 73% even while giving away a GBP 99 kit.

**The kit unlock at month 4 is load-bearing.** Ship it on day one and a month-two canceller costs you GBP
58.50 of kit for GBP 59.90 of revenue. At month 4 you have collected GBP 119.80 first, and the cumulative
line never goes negative. This is the phone-contract pattern and customers understand it.

**Watch:** higher price means fewer signups, and supplements were chosen to lead the funnel partly because
they are a low-friction entry. Model A trades volume for value per customer, deliberately. If the funnel
needs a cheap doorway as well, keep single bottles on sale at premium prices for that job (see B).

### MODEL B: Premium range plus a members' tier. Lower risk, lower ceiling

Keep selling products, but at unapologetically premium prices, and layer a light membership over the top.

**Illustrative:** singles at GBP 24.95 (D3, 12 months), GBP 27.95 (B12), GBP 24.95 (zinc). Members pay
**GBP 24.95/month** for continuous supply of all three, free delivery, and kit credit.

Year 1 at GBP 24.95/month: revenue GBP 299.40, costs GBP 38.85 (product 23.01, fulfilment 9.00, Stripe
6.84), **gross GBP 260.55 at 87%.**

**Higher margin than A, because no kit is given away.** But **the whole premium rests on brand alone**, and
the customer is paying GBP 299 a year for GBP 23 of product they can decompose into three named nutrients.
That is a defensible position for a brand with a doctor attached and a testing story, and it is a fragile
one the first time a customer does the arithmetic.

**B is the safer build and the weaker moat. A is the harder sell and the real business.**

### Variant worth costing later: two tests a year

Model A with **two kits a year** instead of one. COGS rises to about GBP 149/year, so at GBP 24.95/month
the gross falls to roughly GBP 150 at 50%. Worse margin, much stronger proposition, and it maximises the
tested population that programmes eventually sell into. Worth modelling properly once Model A is decided,
not before.

### Comparison

| Model | Year 1 revenue per customer | Year 1 gross | Margin | Price-comparable? |
|---|---|---|---|---|
| Section 8: GBP 19.95 + GBP 9.95/mo bundle | 129.40 | 93.04 | 72% | **Yes, easily** |
| **A: membership at GBP 29.95/mo with a kit** | **359.40** | **261.09** | 73% | **No** |
| B: premium range, members at GBP 24.95/mo | 299.40 | 260.55 | 87% | Partly |
| Superseded Daily Stack blend at GBP 34.95/mo | 419.40 | n/a | n/a | No |

### Two flags before either is built

🔴 **Compliance.** A membership that bundles blood testing with supplements and is sold on club language
moves closer to a health-service proposition, which is the boundary `03_compliance/CONTEXT.md` exists to
police. It is very likely fine as a wellness product, but **it is a compliance read before it is a pricing
decision**, and the "exclusive club" framing in particular needs checking against CA-026 and the Phase 0
boundary. Also consumer law: what happens to an unclaimed kit when a member cancels at month 3 needs
answering in the terms before launch, not after the first dispute.

🔴 **It is a new offer architecture.** The 2026-08-22 decision that supplements lead the funnel assumed
supplements were sold as products. A membership is not the same shape and the strategy doc should say so
explicitly rather than being left to imply the old model. **Decision sweep if Model A is taken.**

## 9a. FIX to Model A: include CREDIT, not a kit (Keith, 2026-08-24)

> 🟠 **AMENDED THE SAME DAY: the ECONOMICS below stand, the LEGAL FRAMING does not.** Keith, 2026-08-24:
> "credit" describes a thing the member owns, and that creates the exact problem section 9a's own condition 1
> anticipates. A member who pays three months, cancels, and returns believing he still holds GBP 99 of credit
> is a dispute we lose by default, because under the Consumer Rights Act ambiguity is construed against the
> drafter, and expiry on something the customer thinks he bought is challengeable as an unfair term.
>
> **The fix is a change of object, not of arithmetic. Keep the GBP 99 contribution; drop the credit
> characterisation.** The benefit is: *membership includes your retest on its scheduled date, and you can put
> it toward a larger panel and pay the difference.* Entitlement is conditional on **being an active member on
> that date**, not on holding a balance.
>
> This preserves the commercial virtue section 9a was written for (gross RISES with every upgrade, because
> the member tops up) while removing all three of the conditions above: **no expiry policy to defend
> (condition 1), no balance-sheet liability (condition 2), and no credit ledger to build.** Condition 3, the
> Vitall COGS exposure, survives unchanged and still belongs in the risk column.
>
> Cadence, decided the same day: **first retest at day 90 as the onboarding proof event, annual thereafter,
> on a stated date.** See `../../01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` section 11.
> Tiering by contribution amount (GBP 99 / GBP 199) still works and is unaffected by the reframing.

**Keith's objection, and it is right:** "includes one kit a year" is an inclusive benefit whose cost we do
not control. Kit 1 is GBP 99 retail, Kit 2 is GBP 119, Kit 3 is GBP 179, and planned kits reach GBP 200
plus. Members will naturally take the dearest one, and **the promise gets more expensive every time the
catalogue grows.** Model A as written in section 9 quietly hands the pricing of our own membership to
whatever we add to the range next.

### What it costs today if the kit is free

Membership at GBP 29.95/month is GBP 359.40 a year. Supplements, fulfilment and Stripe come to GBP 39.81,
leaving **GBP 319.59 of gross before the kit.**

| Kit taken | Retail | COGS | Year 1 gross | Margin |
|---|---|---|---|---|
| Kit 1 Testosterone | GBP 99 | 58.50 | 261.09 | 73% |
| Kit 2 Energy & Recovery | GBP 119 | 63.00 | 256.59 | 71% |
| Kit 3 Hormone & Recovery | GBP 179 | 98.00 | 221.59 | 62% |
| A future GBP 249 kit | GBP 249 | ~140 | ~179.59 | ~50% |

**The margin falls every time the range improves.** That is the wrong incentive to build into an offer.

### The fix: a fixed credit, redeemable against anything

**Membership includes GBP 99 of testing credit a year**, redeemable against any kit. Take Kit 1 and it
costs nothing. Take Kit 3 and pay the GBP 80 difference.

**Our exposure is fixed at GBP 99 of retail, whatever the catalogue does.** One membership price survives
an arbitrarily large kit range, which is the same principle as putting products in a CMS rather than in
code: **stop the offer needing a redesign every time the range grows.**

### And it inverts the incentive, which is the real prize

| Kit redeemed against GBP 99 credit | Member tops up | Year 1 revenue | Kit COGS | Year 1 gross | Margin |
|---|---|---|---|---|---|
| Kit 1 | GBP 0 | 359.40 | 58.50 | 261.09 | 73% |
| Kit 2 | GBP 20 | 379.40 | 63.00 | **276.59** | 73% |
| Kit 3 | GBP 80 | 439.40 | 98.00 | **301.59** | 69% |
| A future GBP 249 kit | GBP 150 | 509.40 | ~140 | **~329.59** | ~65% |

**Under the free-kit model gross falls with every upgrade. Under the credit model it rises.** The member's
top-up more than covers the incremental COGS in every case, because kit COGS runs at roughly 55% of retail
across the range. **Every upgrade is now revenue rather than leakage**, and a growing kit catalogue becomes
an asset to the membership instead of a liability.

### Three things the credit needs before it ships

1. **An expiry and rollover policy.** Does unused credit roll over, expire annually, or accrue? Unredeemed
   credit is breakage in your favour, which makes it a **consumer-fairness question as much as a commercial
   one**. "Use it or lose it" needs to be prominent and defensible, not buried.
2. **A balance-sheet position.** Unredeemed credit is a liability, not profit. It should not be recognised
   as revenue until redeemed or expired. Worth getting right from the first member rather than unpicking
   later.
3. **Protection against Vitall's prices moving.** Credit denominated in retail pounds fixes what we give
   away, not what it costs us. If Vitall raise the per-kit COGS, our exposure rises with it. Not a reason
   to change the design, but it belongs in the risk column.

### Growth path: tier the membership once there are five or more kits

At three kits, one membership price with a GBP 99 credit is the right shape. Once the range is wide, tiers
that carry different credit amounts (GBP 99 / GBP 199) are the natural extension, and they arrive without
redesigning anything, because the credit is already the mechanism.

**Section 9 Model A should be read as amended by this section**: the recommendation is membership with
credit, not membership with a kit.

## 10. THE 90% MODEL, and the market research behind it (2026-08-24)

**Keith's challenge:** there must be a model that yields 90% gross margin, the kit-plus-supplement
combination is the moat, and the value hunter is not our customer. **He is right, and every model above
was anchored to the wrong number.**

### What the market actually charges

Desk research, 2026-08-24. All UK-available.

| Brand | Model | Price | Personalisation |
|---|---|---|---|
| **Bioniq GO** | Personalised supplement subscription | **from GBP 103.90/month** | **A QUIZ. No blood test at all** |
| **Bioniq PRO** | Blood test then bespoke formula, retest at 6 months | **from GBP 199/month** | Blood |
| **ZOE** | **Test sold separately GBP 149 to 299**, then app membership | **GBP 9.99/mo on 12-month, up to GBP 59.99 monthly** | Gut/metabolic test |
| Thriva | Testing, app-first, quarterly retest subscription | Tests from GBP 49 to 59 | Blood, no supplements |
| Numan | Male hormone test bundled into TRT and ED pathways | Test GBP 88 | Blood |
| LetsGetChecked | Male hormone panel | GBP 149 | Blood |
| Medichecks / Randox | Testing only | GBP 46 upward | Blood |

**The finding that reframes everything: Bioniq GO charges over GBP 100 a month for supplements
personalised by a questionnaire.** We were debating GBP 9.95 to GBP 29.95 for supplements that would be
backed by an actual measured marker. **We were pricing at roughly a tenth of a competitor whose
personalisation is weaker than ours.**

The GBP 9.95 anchor was not forced by arithmetic. It was inherited from thinking of these as three
commodity bottles, which is exactly the frame Keith rejected.

### Where the 90% actually lives

90% gross margin means COGS at or below 10% of revenue. Supplements cost GBP 23.01 of product and GBP 9.00
of fulfilment a year. **That is a fixed GBP 32 of cost, so the margin is decided entirely by the price.**

| Membership price | Year 1 revenue | Total COGS | Gross | Margin |
|---|---|---|---|---|
| GBP 29.95/mo | 359.40 | 39.81 | 319.59 | 88.9% |
| **GBP 39/mo** | 468.00 | 41.49 | 426.51 | **91.1%** |
| **GBP 49/mo** | 588.00 | 43.29 | 544.71 | **92.6%** |
| **GBP 59/mo** | 708.00 | 45.09 | 662.91 | **93.6%** |
| GBP 99/mo | 1,188.00 | 52.29 | 1,135.71 | 95.6% |

**90% starts at about GBP 39 a month.** Below that the fixed GBP 32 of goods is too large a share; above it
the model is a software business with a small physical cost attached.

### The rule that follows, and it is the one every model above broke

🔴 **A kit cannot sit inside a 90% product.** Kit COGS runs at 55 to 59% of kit retail: GBP 58.50 on a GBP
99 Kit 1, GBP 98 on a GBP 179 Kit 3. Vitall take that, and no pricing decision of ours changes it.
**Including any kit in the recurring product caps the blended margin in the low 80s permanently.**

**ZOE solved this exact problem and their answer is the correct one: sell the test, subscribe the
software.** The test is a separate purchase at its own margin. The recurring product is the layer with no
marginal cost.

### RECOMMENDED: kit as paid entry, membership as the data layer

| Element | Price | Margin | Role |
|---|---|---|---|
| **Kit** | GBP 99 to 179, full retail | 41 to 45% | **Paid entry.** Funds itself, qualifies the customer, produces the data |
| **Membership** | ~~GBP 39 to 59/month~~ → **GBP 47/month**, VAT-inclusive-ready | **91 to 94%** | ~~Supplements included~~ → **supplements at MEMBER PRICE, not included.** Plus the record, both ranges explained, published clinician answers, one included test event a year |
| Retests | Member price, or **the included annual test event** (~~the GBP 99 credit from 9a~~) | 41 to 45% | Recurring reason to re-engage |

> 🔴 **THIS TABLE WAS STALE, corrected 2026-08-25 during the app-led decision sweep.** It sits outside section 9a and therefore outside 9a's amendment banner, so it went on asserting the credit model and the GBP 39-59 band after both had been superseded. **The price is GBP 47** (`../../01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` §11), **supplements are sold at member price rather than included** (which is what Function and Superpower actually do, and it removes stock, dispatch and the 3PL from the membership), and **there is no credit**: the included annual test event is a membership benefit tied to a stated date, never a balance the member owns.

**Year 1 per customer at GBP 47/month with a GBP 99 Kit 1 entry:** the GBP 687 / GBP 101.79 / GBP 585.21 figures below were computed at GBP 49 and are now indicative only; re-run against GBP 47, one test event a year, and supplements sold rather than included.

**Be honest about the blend.** 90%+ is achievable on the subscription and it is not achievable across a
business that also posts physical lab tests, because a third party takes 55% of every kit. Raising Kit 1
to GBP 149 lifts the blended figure to about 86% and is defensible against LetsGetChecked at GBP 149 and
Numan at GBP 88, but it is a real pricing decision rather than a free one.

### The moat, stated as a rule rather than a slogan

Keith's framing: data first, the data proves the requirement, rather than guessing at Holland & Barrett.

**The market research says nobody at the accessible end is doing it.** Bioniq GO personalises on a quiz.
Vitl personalises on a quiz. Bioniq PRO does use blood, at GBP 199 a month. Thriva tests but sells no
supplements. Numan tests but routes to prescription.

**And our version of it is already written down as a catalogue constraint, not a marketing claim:** "we
stock a supplement only where we test the marker its authorised claim names"
(`supplement-purchase-list.md`). That is a rule a competitor cannot copy without giving up the majority of
their range, which is what makes it a moat rather than a tagline. It is also why the range is only three
products, and **that constraint is now an asset to be advertised rather than a limitation to apologise
for.**

The itch it scratches is one sentence: *am I wasting money on supplements?* The answer is *we will show you
your number, and we will only sell you things whose claim names a number we measured.*

### Two flags on gating

🔴 **Do not gate raw results behind the membership.** ZOE require an active subscription to see test
results and are criticised for it. Under UK GDPR the customer has a right of access to their own health
data, and a paid-for test whose results vanish on cancellation is both a compliance risk and a brand
problem for a company whose whole pitch is honesty about data. **Gate the trend view, the ongoing
interpretation, the retest cadence and the protocol. Never the numbers themselves.**

🔴 **This partially reverses the 2026-08-22 decision** that supplements lead the funnel as the acquisition
product. Under this model supplements remain the **marketing** entry, because that is where the search
volume is, but the **first purchase** is the kit, since a supplement sold without data contradicts the
proposition. That is a decision sweep, and it is Keith's call.

## 7. What this does NOT model

- **Postage band for a 3-bottle box** versus a single flat postal pack. Flagged in section 1, and **the pack dimensions are now verified (2026-08-24): 107 x 79 x 22 mm each, so one bottle is a Large Letter and three stacked at 66 mm is a parcel.** The bands differ; only the size of the gap is still open.
- **Returns, breakages and re-sends.** No figure exists anywhere in the repo.
- **CAC.** Gross margin is not profit. The LTV/CAC models in `../../01_strategy/` are built on the
  GBP 34.95 monthly figure and need re-running against section 5.
- 🔴 **VAT. CORRECTED 2026-08-24: this almost certainly had it the wrong way round.** The earlier text here
  read "most food supplements are zero-rated in the UK". **UK food supplements (vitamins, minerals and
  similar) are generally STANDARD-RATED at 20%**, specifically excluded from food zero-rating; gummies would
  likely be standard-rated as confectionery in any case, so both routes land in the same place. If so, every
  margin figure in this document that assumes a zero-rated revenue line carries a **20% error**, and it flows
  into the member-price maths and the LTV/CAC models downstream. **Not a modelling fix: get it in writing
  from an accountant before the first Nutribl order and before any price is published.** See
  `../../01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` section 11.
