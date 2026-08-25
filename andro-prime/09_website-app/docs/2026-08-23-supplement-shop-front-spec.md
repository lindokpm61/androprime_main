# Supplement shop front: what exists, what is missing, what has to be decided

**Created:** 2026-08-23 | **Owner:** Keith | **Status:** SPEC. No code written against it.

**Standing requirement (Keith, 2026-08-23):** we need a shop front regardless of how the supplements are
obtained or who fulfils them, and **orders go through Stripe**. Supply and fulfilment are a separate
workstream and do not gate this one.

> 🔴 **SUPERSEDED IN DIRECTION, 2026-08-24.** This document assumes the supplement shop is the thing being built. Keith has since moved supplements to a secondary shop at member price, with **the app as the product and the kit as the gateway** (`../../01_strategy/STATE.md`, 2026-08-24). The technical findings below remain accurate and useful — the three hardcoded catalogue sites, the auth gate on subscription checkout, the missing dispatch table, sections 4a to 4c — but the priority ordering and the framing of the shop as the launch product are not current. Nothing here is decided or built.

**Read with:** `../../01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` (**ADOPTED 2026-08-25**; the app is the product, supplements are a member-priced shop) and `../../01_strategy/STATE.md` (the shop lives at `/supplements`,
organised by panel, identical for every visitor), `../../04_products/supplements/supplement-purchase-list.md`
(what is in the range and why), `../STATE.md`.

---

## The headline: this is a catalogue and pages job, not a commerce build

**The supplement subscription backend is already built, deployed, and wired to email.** It was built for
the Daily Stack and it is product-agnostic. Nothing in it needs designing from scratch.

| Piece | Where | State |
|---|---|---|
| Subscription checkout | `app/api/checkout/subscription/route.ts` | Live. Stripe `mode: 'subscription'`, GB shipping address, phone, billing address, FirstPromoter attribution |
| Subscription table | `supplement_subscriptions` (user_id, product_slug, stripe_subscription_id, status) | Live in Supabase, typed in `lib/supabase/types.ts` |
| Purchase | `checkout.session.completed`, `type === 'subscription'` branch | Live. Inserts the row, emits `subscription_started`, reports the sale to FirstPromoter |
| Renewal | `invoice.payment_succeeded` | Live. Sets `active`, sends the T-06 renewal receipt |
| Failed payment | `invoice.payment_failed` | Live. Sets `past_due`, sends T-07 |
| Cancellation | `customer.subscription.deleted` | Live. Sets `cancelled`, sends T-08 |
| Self-service billing | `app/api/checkout/portal/route.ts` | Live. Stripe billing portal |
| Account UI | `app/(app)/subscriptions/page.tsx`, `lib/subscriptions/getSubscriptions.ts` | Live |
| Post-purchase | `app/(marketing)/subscription/confirmed/page.tsx` | Live |
| Product map | `lib/subscriptions/products.ts` | Live, and **wrong**: see below |

So the question is not "how do we build a shop". It is "what do we put in it, who is allowed to buy, and
what happens to the order after Stripe".

---

## 1. The catalogue is hardcoded in three places and all three are stale

The three product slugs the system knows about are `daily-stack`, `collagen` and `complete-mens-stack`.
**None of them is a product any more.** Separate single bottles were decided 2026-08-22, and collagen is
out of the range on "no marker".

Those slugs are hardcoded in **three separate files**:

| File | What it holds |
|---|---|
| `lib/subscriptions/products.ts` | `PRODUCT_MAP`: slug to display name and price string |
| `app/api/checkout/subscription/route.ts` | `SUB_PRICE_IDS`: slug to Stripe price env var |
| `lib/pricing.ts` | `DAILY_STACK_MO`, `COLLAGEN_MO`, `COMPLETE_STACK_MO` |

**Do not update them one at a time.** `products.ts` calls itself "single source of truth for slug to
display name / price" and it is not one: the price appears there as a display string and again in
`pricing.ts` as a number, and the set of valid slugs appears there and again in the checkout route. Fixing
one is what makes the disagreement visible. **Collapse them into one module that all three read**, then
change the range once.

**Proposed shape**, one entry per bottle, carrying the panel that owns it, since the shop is organised by
panel:

```ts
export interface SupplementProduct {
  slug: string
  name: string
  panel: string          // the section it sits under, e.g. testosterone, energy
  marker: string         // the marker whose authorised claim admits it to the range
  claim: string          // the EFSA wording, verbatim, never paraphrased
  priceMonthly: number   // the number. Format at the edges, store it once
  stripePriceEnv: string
}
```

The `claim` field earns its place. The compliance rule is that authorised wording is quoted verbatim, and
holding it in the catalogue means a product page cannot drift from it through hand-edited copy.

## 2. A cold visitor cannot buy, and that is backwards

`app/api/checkout/subscription/route.ts` opens with `requireAuthenticatedApiUser`. **Supplements are the
acquisition product**, so most buyers arrive from search with no account, and today they meet a login wall
before they can pay.

**The kit path already solved this and the code is there to copy.** `app/api/checkout/kit/route.ts` passes
`customer_email: user?.email ?? undefined`, so a guest can pay, and the webhook does 3-case user
resolution: logged in, existing by email, or brand new. For a new guest it creates the auth user, seeds the
Customer.io profile, generates a magic link and emits `guest_purchase_account_created`.

**Change: drop the auth requirement from the subscription route and let the existing webhook resolution
handle it.** Highest-value change in this document, and a small one.

## 3. Pages

| Route | Today | Needed |
|---|---|---|
| `/supplements` | Waitlist page for the Daily Stack and Collagen, with `SupplementWaitlistForm` | The shop index, organised by panel, identical for every visitor |
| `/supplements/daily-stack` | Product page for a product that no longer exists | Delete or repurpose |
| `/supplements/collagen` | Product page for a product cut from the range | Delete |
| `/supplements/[slug]` | Does not exist | One page per bottle, driven by the catalogue module |
| `/supplement-waitlist`, `/supplement-waitlist-status` | Live | Retire when the shop opens, and decide what the existing list is told |

**The waitlist has an audience owed something.** People signed up expecting the Daily Stack. What launches
is three separate bottles, one of which was never named in the waitlist copy. That is a launch email, not a
page change, and it should be written before the pages change under them.

## 4. Fulfilment handoff: the trigger is the invoice, not the checkout

Whoever ships, we or a 3PL, needs an order. The model for this already exists: `triggerVitallDispatch` in
the Stripe webhook calls the fulfiller's API on purchase and records the result.

**The difference that matters: a subscription ships every month, not once.** Hooking dispatch to
`checkout.session.completed` would ship the first bottle and never ship again. **Hook it to
`invoice.payment_succeeded`**, which Stripe fires for the first invoice as well as every renewal, so one
trigger covers the whole lifecycle. That handler exists today and currently only updates status and sends a
receipt.

**There is no supplement order table.** `supplement_subscriptions` records the subscription, not the
shipments. A recurring physical product needs a row per dispatch: for support ("where is this month's
bottle"), for retrying a failed dispatch, and to make webhook replay safe rather than double-shipping. That
table does not exist and is new work.

## 4a. CORRECTION to section 4: monthly billing does not mean monthly shipment

**Section 4 above says hook fulfilment to `invoice.payment_succeeded`. That is wrong for this range, and
the arithmetic is in our own buy list.**

| SKU | Pack | One a day | Bottle lasts |
|---|---|---|---|
| Vitamin D3 4,000 IU | **365 tablets** | 1/day | **12 months** |
| Vitamin B12 1mg | 120 capsules | 1/day | **4 months** |
| Zinc 15mg | 120 capsules | 1/day | **4 months** |

The buy list quotes GBP 0.25, GBP 0.99 and GBP 0.68 "per month", which is correct as **cost** per month,
and it has been read as though it were a **shipment** per month. It is not. Shipping a D3 bottle every
month gives a one-year subscriber twelve years of tablets.

**Billing cadence and dispatch cadence are separate things and must be modelled separately.** Bill monthly
if that is the commercial decision, but dispatch when the customer runs out.

**Consequence for the schema.** `supplement_subscriptions` currently holds `product_slug`,
`stripe_subscription_id`, `status`, `started_at` and nothing else. It needs a **`next_dispatch_due`** date,
advanced by the product's own supply duration on each dispatch, and the dispatch job runs off that date
rather than off a Stripe event. `invoice.payment_succeeded` keeps its existing job of recording payment and
sending the receipt.

**Consequence for the product model.** Each product needs a `supply_days` field (or `servings` plus
`servings_per_day`). It drives dispatch timing, months of cover, and the reorder alarm. It is not cosmetic.

**Open, and it is Keith's:** whether a monthly subscription that ships once a year is the right offer at
all for D3, or whether that SKU is sold annually, or at a different price on a different cadence. The
365-tablet pack is the cheapest per month in the range by a wide margin, so this is worth getting right
rather than avoiding.

## 4b. CMS: products must be rows, not code

**Requirement (Keith, 2026-08-23):** adding the fourth, fifth and tenth supplement must not mean editing
code. Today it means editing three TypeScript files and hand-writing a page component per product, which
does not survive a range of ten.

**Use the pattern the repo already has.** `blog_articles` lives in Supabase, is written through a function
with a revision trail, and triggers a revalidate on write. Products should work the same way. **Do not add
Contentful, Sanity or Payload**: it would be a second content system alongside one that already works, with
its own auth, its own outage surface and its own bill.

**New table `supplement_products`**, one row per bottle, replacing the three hardcoded sites in section 1:

| Column | Notes |
|---|---|
| `slug` | URL, and the key already used by `supplement_subscriptions.product_slug` |
| `name`, `description`, `body` | Editorial copy |
| `panel` | The section it sits under. The shop is organised by panel |
| `marker` | The marker whose authorised claim admits it to the range |
| `claim` | EFSA wording, **verbatim**. Held here so a page cannot drift from it by hand-editing |
| `supply_days` | See 4a. Drives dispatch cadence and stock cover |
| `stripe_price_id` | **The price ID, never a price number** |
| `status` | `draft` / `live`. A row is not sellable until it is `live` |
| `sort_order`, `image_url` | Presentation |

**The split that keeps it honest: Stripe owns price and payability, Supabase owns editorial.** A price is
never typed into a row or a page. It is read from Stripe against `stripe_price_id` and cached, or synced
into a column written only by a Stripe webhook. That is what stops the range regrowing the exact bug
section 1 describes, where a number lives in `pricing.ts` and a formatted string lives in `PRODUCT_MAP` and
the two can disagree silently.

**Adding a supplement therefore has two steps, not one:** create the product and price in Stripe, then
insert the row. That is honest, and it is still not a deploy.

**One page template, not one page per product.** `/supplements/[slug]` rendering from the row. The CMS
achieves nothing while `/supplements/daily-stack` and `/supplements/collagen` are hand-written files.

**The compliance consequence, and the reason `status` exists.** Product copy that can be edited without a
deploy can also be edited without a compliance pre-flight, and product copy carries EFSA claims. The blog
has the same exposure and answers it with a pipeline state and a publish gate. A `draft` row that does not
render is the minimum equivalent here.

**Who edits it.** At three products, Supabase Studio directly. Build an admin screen when the range is big
enough that Keith is editing weekly, not before. There is an existing `app/admin/dashboard` to hang it off
when that day comes.

## 4c. Stock control: Stripe will happily sell what we do not have

**Stripe has no inventory management.** It will take payment for the eleventh bottle when ten exist. Every
stock gate is ours to build, and it has to sit **before** the checkout session is created, because a gate
that fires at webhook time has already taken the money and costs a refund plus the Stripe fee.

**Two different stock questions, and they get confused.**

| Question | Whose stock | What answers it |
|---|---|---|
| Can we accept this order? | **Ours, sitting at the fulfiler** | A stock count we hold, reconciled against theirs |
| Can we restock? | **Nutribl's** | Their daily inventory file, already arriving about 06:00 and currently unused |

**Where truth lives.** The fulfiler holds the physical stock and has the real count. Whether they expose it,
and how, is now a **fourth question for the 3PL**, alongside who they are, what they charge, and what
interface they give a custom cart. Two shapes are possible and the answer decides the build:

- **They expose a feed.** Read it, cache it, gate on it. Simplest and most correct.
- **They do not.** We hold `stock_units` ourselves, decrement on dispatch, increment on a recorded restock,
  and **reconcile on a schedule against whatever they do report**. A self-held count drifts, and a count
  that has silently drifted is worse than no count at all.

**Three gates, all needed:**

1. **Render.** No buy button on an out-of-stock product. Say "back in stock" rather than failing silently.
2. **Checkout.** Re-check immediately before creating the Stripe session. Render-time alone is a race: a
   page can be cached, or left open in a tab for an hour.
3. **Dispatch.** The fulfiler will reject or short-ship an order for stock that is not there. That has to
   surface as a support event, not a silent failure.

### The part that actually matters: subscribers are a recurring claim on stock

A one-off sale consumes one unit. **A subscription consumes a unit every supply period, indefinitely.** Ten
bottles is not ten customers. Combined with 4a, the real unit is **subscriber-months of cover**:

| SKU | 10 units at MOQ | Cover at 30 subscribers |
|---|---|---|
| D3, 12 months per bottle | **120 subscriber-months** | **4 months** |
| B12, 4 months per bottle | 40 subscriber-months | **1.3 months** |
| Zinc, 4 months per bottle | 40 subscriber-months | **1.3 months** |

**Two things fall out of that table.** Launch quantity should be sized in months of cover, not to the
minimum order: **MOQ is a floor, not a target.** And cover burns down at very different rates per SKU, so
B12 and zinc empty roughly three times faster than D3 at the same subscriber count.

**So the reorder alarm is measured in weeks of cover, not units left.** A "fewer than 5 units" alert is
meaningless when one SKU's unit is a year of supply and another's is four months. The threshold is set by
reorder lead time: Nutribl quote 4 to 5 working days for private label, plus labelling and transit into the
fulfiler, so realistically two to three weeks. Alarm comfortably above that.

**Overselling a subscription is worse than overselling a one-off**, which is the argument for holding real
cover rather than running lean. A one-off oversell is one apology and one refund. A subscription oversell is
a monthly promise we cannot keep, made to someone who has already handed us a card.

**None of this exists today.** There is no inventory concept anywhere in the schema, and
`supplement_subscriptions` has no dispatch fields at all.

## 4d. Commercial model: singles, bundle, or shop membership (raised by Keith, 2026-08-24)

Three models were put on the table. This section reads them against the actual pack sizes, because the
supply durations in 4a are what decide which one works.

**Verified pack facts** (Nutribl catalogue CSV, the `Suggested serving` column, checked 2026-08-24):

| SKU | ID | Pack | Serving | Supply | Trade | Alternatives in catalogue |
|---|---|---|---|---|---|---|
| D3 4000iu tablets | 1152 | 365 | 1/day | 12 months | GBP 3.00 | **1289: 4000iu, 60 gummies, GBP 3.83, 2 months.** 1259: 4000iu, 150 gummies, 5 months. 1095: 3000iu+K2, 90 caps, 3 months |
| B12 methylcobalamin | 1009 | 120 | 1/day | 4 months | GBP 3.95 | **None. One SKU in the whole catalogue** |
| Zinc 15mg | 1121 | 120 | 1/day | 4 months | GBP 2.72 | **None. One SKU in the whole catalogue** |

### A. Bundle: three bottles, one monthly price. RECOMMENDED

**This is the answer to the 12-month D3 problem, and the reason is retention, not cost.** In a bundle the
customer's reason to stay subscribed is the **shortest-cycle** item, not the longest. B12 and zinc run out
every 4 months, so they keep renewing; the D3 bottle lasting a year stops being a retention hole and
becomes a COGS advantage at GBP 0.25 a month.

**Keith's first-payment arithmetic is right.** All three bottles cost GBP 9.67 of stock. Add roughly GBP 3
of fulfilment and about GBP 0.65 of Stripe fee, so the first shipment costs about GBP 13.30 all in. At any
realistic price the first payment covers it, so a customer who cancels in month two has still been
profitable.

**RETRACTION of the cancellation-exposure point raised 2026-08-23.** That note said a customer who cancels
after one payment walks away with a year of D3 and framed it as an exposure worth designing around. **The
D3 bottle costs GBP 3.00.** The exposure is three pounds, not thirty, and it does not justify changing the
SKU, repacking, or restructuring the offer. Recorded as a correction rather than deleted, because the
earlier framing is what prompted the model question.

**If a synchronised cycle is wanted**, two units of 1289 (60 gummies, 2 months each) give a clean 4-month
cycle matching B12 and zinc: one box every four months holding 2x D3 + 1x B12 + 1x zinc, GBP 14.33 of stock
per cycle, GBP 3.58 a month. That is 7x the COGS of the 365 pack and still above 85 percent margin at GBP
29.95. **Only worth it if a regular physical delivery is judged to matter commercially**, and it trades
tablets for gummies, which is a brand and sugar question, not a cost one.

### B. Subscription fee for access to the shop. NOT NOW, GOOD LATER

At three SKUs this is a marketing skin on model A, and it adds risk without adding revenue:

- **Cold traffic does not want a membership.** Supplements are the acquisition product and search intent is
  per ingredient. Someone searching "vitamin D supplement" bounces off a club.
- **It is a different consumer-contract shape** from selling goods, with its own cancellation and refund
  expectations. New compliance surface for no extra margin.
- **The margin is in the product, not the access.** COGS is GBP 1.92 against a GBP 20 to 35 retail. Access
  models earn their keep when the marginal product is cheap and the value is curation.
- **It fights the brand position.** "The supplement brand that tells you to measure first" is a product
  story.

**It becomes a strong offer at eight to ten SKUs as "pick any three for GBP X a month".** That caps COGS,
makes the panel structure do commercial work, and is a real reason to widen the range. Hold it as the v2
model, not the launch model.

### C. Break the 365 bottle down to 30. NOT AVAILABLE, AND NOT NEEDED

Nutribl print labels onto **stock** bottles. Repacking bulk into 30-count units is contract packing, and
the catalogue has no bespoke route: the words bespoke, custom formulation, MOQ and setup fee appear
nowhere in it. Expect a no, and it is worth one line on the call rather than a plan.

**It is moot anyway.** A 4,000 IU D3 at 60 units already exists (1289), so the pack-size lever is a SKU
choice, not a manufacturing ask. **Zinc and B12 have no alternative pack size at all**, one SKU each in the
whole catalogue, so for those two the question does not arise: four months is what four months is.

### The thing none of the three models covers: single-bottle buyers

**If the only offer is a bundle, a visitor who wants zinc cannot buy zinc.** That is a real cost, because
search intent is per ingredient and supplements are the top of the funnel. **Sell both**: singles as the
acquisition product on the per-ingredient pages, the bundle as the upsell and the retention product. The
catalogue model in 4b supports it already; the bundle is one more row with its own Stripe price.

## 4e. "So drop subscriptions and sell one-offs" (Keith, 2026-08-24)

**The premise is right and it is verified.** B12 and zinc are 4-month bottles, D3 is a 12-month bottle,
one a day in all three cases. A **monthly** subscription would bill twelve times to ship three times, and
that is indefensible.

**The conclusion skips an option, because a subscription does not have to be monthly.** Stripe prices carry
an `interval` and an `interval_count`. `interval: 'month', interval_count: 4` bills every four months. One
payment, one bottle, one shipment. **The mismatch disappears completely without giving up recurring
revenue.** Nothing about the existing checkout, webhook or portal code changes; it is a property of the
Stripe price, not of our integration.

### Two reasons to fix the interval rather than remove the subscription

**1. It contradicts a decision taken two days earlier.** `01_strategy/STATE.md`, 2026-08-22, argues
supplements should lead the funnel on three grounds, and one of them is that "supplements are **monthly
rather than one-off**, and they fund the kits". Recurring revenue is not a detail of the shop, it is a
premise of the decision to put supplements at the top of the funnel at all. Removing it is a strategy
change and would need a decision sweep, not a shop-front tweak. **That is Keith's call to make, but it
should be made knowingly.**

**2. Dropping subscriptions is MORE code, not less.** Everything that exists today is subscription
machinery: the `supplement_subscriptions` table, four webhook branches, the T-06/T-07/T-08 lifecycle
emails, the billing portal, the account UI. **There is no one-off supplement path at all.** A one-off
supplement needs a new table (the subscription table cannot hold it), a new webhook branch and new
transactional emails. "Cancel subscriptions" means building something new to replace something that
already works.

### Recommendation: subscribe and save, at a 4-month interval

Sell both, which is the standard pattern for consumables and the right one here:

- **One-off** at full price. This is what cold search traffic converts on, and supplements are the
  acquisition product, so the low-friction option has to exist.
- **Subscription every 4 months** at 10 to 15 percent off. Same product, same shipment cadence, honest
  arithmetic, and it captures the recurring revenue the strategy assumes.

The bundle runs on the same 4-month cadence, one price.

### D3 is the only awkward one, and it costs GBP 3.00

At a 12-month bottle the choices are an annual subscription, one-off only, or the 60-unit SKU (1289) at 7x
the COGS for cadence alignment. **Do not over-engineer a three pound item.** Annual renewal is a real
consumer behaviour for vitamins, and in a bundle the point in 4d still holds: the renewal driver is the
shortest-cycle item.

## 5. Open decisions, none of them technical

| # | Decision | Owner | Blocks |
|---|---|---|---|
| 1 | **One-off purchase as well as subscription?** See 4e. Recommendation is BOTH, at a **4-month** subscription interval rather than monthly. A one-off is a different Stripe mode, a new webhook branch and a new table, since `supplement_subscriptions` cannot hold it | Keith | Scope |
| 1a | **Do we keep recurring revenue at all?** Keith raised dropping subscriptions entirely on 2026-08-24. It contradicts the 2026-08-22 strategy premise that supplements are "monthly rather than one-off", so it is a decision sweep if taken | Keith | The whole shop model |
| 2 | **Price.** Nothing is set. The only live figure is the £34.95 Daily Stack, a product that no longer exists | Keith | Every page, and the catalogue module |
| 3 | **Bundle or bottles.** See 4d: the recommendation is BOTH, singles for acquisition and a bundle for retention. Open item is the bundle price and whether it discounts | Keith | Catalogue shape |
| 3a | ~~**Is a monthly subscription right for a 12-month D3 bottle?**~~ **LARGELY ANSWERED in 4d**: in a bundle the renewal driver is the shortest-cycle item, so the 12-month bottle is a cost advantage rather than a problem. Residual: whether a regular physical delivery matters enough to pay 7x COGS for the 60-unit SKU | Keith | Product model and dispatch |
| 3b | **How much stock do we open with?** MOQ is 10 and that is a floor, not a target. Size it in months of cover, per SKU | Keith | The first Nutribl order |
| 4 | **Results page route to the shop.** Decided in direction (a route, not a shelf inside the report) but the placement pick `869eng0g5` is still open | Keith | The results page, not the shop |
| 5 | **Product page copy sign-off.** Claims quoted verbatim, Ewa on anything clinical | Ewa | Publishing, not building |

## 6. What can start today, with nothing else answered

1. Collapse the three hardcoded catalogue sites into one module.
2. Drop the auth gate on subscription checkout and prove the guest path end to end.
3. Build `/supplements` and `/supplements/[slug]` against the catalogue module, with placeholder prices.
4. Add the `supplement_products` table and move the catalogue into it, so step 1's module becomes a thin
   reader over rows.
5. Add the dispatch table, `next_dispatch_due` on the subscription, and the stock columns, with the fulfiler
   call stubbed. Dispatch runs off the due date, not off a Stripe event (see 4a).

None of that depends on the supplier, the 3PL, the price or Ewa. What it cannot do is **go live**: a live
page needs a real price and signed-off copy.
