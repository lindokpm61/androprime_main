# Supplement + membership model: what exists, what is missing

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** GAP ANALYSIS. Nothing here is a decision.

**The plan being assessed:** kit sold at full retail as the paid entry, then a membership at GBP 39 to 59
a month carrying the supplements plus a data layer, at 91 to 94% margin on the recurring line. Set out in
`../04_products/supplements/supplement-unit-economics-2026-08-24.md` section 10.

**Method:** checked against the live schema, the frontend, and the workspace STATE files, not from memory.

> 🔴 **PARTIALLY ANSWERED LATER THE SAME DAY.** The headline below says the between-tests product does not exist. Two things landed after it was written: a designed loop (baseline, plan, adherence, retest countdown, published in artifact `21e25b82-cedd-4241-8817-12bb33fec378`), and the discovery that the **Confirmation bundle is already built and Ewa-signed** behind `BUNDLES_ENABLED`. The gap list below is still accurate as a build inventory; the framing that nothing exists is not.

---

## The headline: the biggest gap is not code, and it is not supply

**Most of the machinery exists.** What does not exist is **a reason for the membership to be worth GBP 39
to 59 a month between tests.**

The dashboard today does something **once**: you buy a kit, you get a report. ZOE can charge monthly
because their app does something every day. **Our membership currently has nothing to deliver in months 2
through 11**, and that, not stock or code, is what decides whether this price is defensible.

Everything else on this page is a task. This one is a product that has not been designed.

---

## 1. Decisions not yet made (Keith)

| # | Decision | Blocks |
|---|---|---|
| 1 | **Is the model membership-led at all?** It partially reverses the 2026-08-22 "supplements lead the funnel" decision: supplements stay the marketing entry, the kit becomes the first purchase | Everything below |
| 2 | **The membership price**, and whether there are tiers | Stripe setup, every page |
| 3 | **Single supplement prices**, and whether singles are sold at all | Catalogue |
| 4 | **What the membership includes**, precisely. Supplements, dashboard, credit, retest cadence, what else | The product gap above |
| 5 | **Kit price.** GBP 99 holds the blended margin near 85%; GBP 149 lifts it to about 86% and is defensible against LetsGetChecked | Financial model |
| 6 | **Credit expiry and rollover** (section 9a of the economics doc) | Terms, accounting |
| 7 | **How much opening stock**, in months of cover per SKU | First Nutribl order |

## 2. Supply: nothing has been bought and no one has been contacted

| Item | State |
|---|---|
| Nutribl relationship | **Zero human contact.** Trade account only. Application email drafted, sitting in Gmail drafts, unsent |
| 3PL | **Not applied for.** Provider unnamed, fees unknown, custom-cart interface unknown, stock feed unknown |
| Stock | **Nothing ordered.** MOQ 10 per SKU, about GBP 96.70 for the launch three |
| Label artwork | **Does not exist.** Own artwork versus a design tier is unanswered. Zinc artwork additionally blocked on Ewa |
| Fulfilment cost | **GBP 3.00 is a guess.** It is the largest single variable in the whole economic model |
| Food Business Operator | **Unestablished.** Probably us, nothing in the repo says so |

## 3. Product and brand assets that do not exist

- **Product photography or pack shots.** The results-page mockups used CSS approximations. Nutribl offer 3D
  renders at GBP 20.
- **Product page copy** for three bottles, each carrying verbatim EFSA wording.
- **The membership proposition itself**: name, what it includes, how it is explained on a page.
- **A launch email to the supplement waitlist**, who signed up for a Daily Stack that no longer exists.

## 4. Code and data: what is already there

Verified against the live schema and app.

| Capability | State |
|---|---|
| Kit checkout, guest allowed | ✅ Live |
| Stripe subscription checkout, GB shipping | ✅ Live |
| Subscription lifecycle: started, renewed, failed, cancelled | ✅ Live, all four webhook branches |
| Billing portal, account UI | ✅ Live |
| Lab pipeline: `kit_orders`, `sample_registrations`, `lab_results`, `biomarker_values` | ✅ Live |
| Vitall dispatch | ✅ Live and verified |
| Results engine, classifier, dashboard | ✅ Live |
| Two-kit bundle machinery: `bundle_dispatches` | ✅ Built, flag-gated |
| Revenue views: `v_supplement_mrr`, `v_result_to_supplement_conversion` | ✅ Exist |

## 5. Code and data: what is missing

| Missing | Why it is needed | Size |
|---|---|---|
| **`supplement_products` table** | Catalogue is hardcoded in three files naming three dead products | Small |
| **One `/supplements/[slug]` template** | Each product is a hand-written page today | Small |
| **Stock / inventory** | No concept anywhere in the schema. Stripe will sell the eleventh of ten bottles | Medium |
| **Supplement dispatch table** | `supplement_subscriptions` records the subscription, not shipments. No support answer to "where is my bottle", no replay safety | Medium |
| **`next_dispatch_due`** | Dispatch runs on supply duration, not on a Stripe event | Small |
| **Membership / entitlement model** | **Nothing like it exists.** No membership, tier, entitlement or credit concept in the schema at all | **Large** |
| **Credit ledger** | Issue, redeem, expire, and carry the balance-sheet liability | Medium |
| **Retest scheduling** | The cadence table is a PROPOSED doc pending Ewa, not code | Medium |
| **Guest checkout on subscriptions** | Subscription checkout still requires login; kit checkout does not | Small |
| **The between-tests product** | See the headline. **Not yet designed, so not yet sizeable** | **Unknown** |

## 6. Compliance and legal, none of it done

| Item | Owner | Note |
|---|---|---|
| **Membership framing** against the Phase 0 wellness boundary and CA-026 | Compliance | A club bundling testing and supplements edges toward a health-service proposition. **A read before it is a pricing decision** |
| **Zinc dose ruling** | Ewa | Drafted, unsent. Blocks zinc artwork |
| **Product page copy sign-off** | Ewa | Every claim verbatim |
| **Terms for the membership**: cancellation, unclaimed credit, unshipped supply | Solicitor / Keith | Answer before the first dispute, not after |
| **Fulfilment processor in the privacy policy** | Compliance | A 3PL will hold customer names and addresses. Not in the processor table |
| **VAT position on these SKUs** | Keith | Most supplements are zero-rated, unverified for these, and gummies can differ |
| **Results access on cancellation** | Compliance | Under UK GDPR the customer has a right of access. Gate interpretation, never the numbers |

## 7. Models and plans now known to be wrong

These are not gaps, they are **incorrect artefacts still in circulation**, which is worse.

- **The financial model and the LTV/CAC models** are built on GBP 34.95/month for a 30-day blended pack
  that cannot be manufactured. Section 5 of the economics doc quantifies the error.
- **Gate 0A** is sized on about GBP 5,950 of capped exposure. Real exposure at MOQ 10 is about GBP 96.70.
- **`lib/pricing.ts`, `PRODUCT_MAP` and `SUB_PRICE_IDS`** all name products that no longer exist.
- **`/supplements` and its two child pages** market a Daily Stack and a Collagen that are out of the range.

## 7a. What the other brands actually put inside the membership (researched 2026-08-24)

The open question from the headline: what fills the months between tests. Here is what the comparators
actually deliver.

| Brand | Price | What the membership contains |
|---|---|---|
| **Superpower** | **USD 199/yr, about USD 17/month** | Annual blood test 100+ biomarkers, **mid-year retest of 60+**, dashboard of 100+ metrics, personalised action plan, **message your care team on demand**, supplement marketplace at member pricing, prescription and peptide access |
| **Function Health** | USD 365/yr | Same shape: annual panel, dashboard, clinician review, action plan, member marketplace |
| **ZOE** | GBP 9.99 to 59.99/month, test bought separately | **A daily habit loop.** Photograph a meal and get an instant score, processed-food risk scanner, streaks and goals, **AI nutrition coach** |
| **Bioniq PRO** | GBP 199/month | Blood test, bespoke granule formula built to results, retest at 6 months |

### There are only three answers, and everyone picks one or two

1. **A daily habit loop.** ZOE. You open the app every day because logging a meal returns something. The
   test is the on-ramp; the loop is the product.
2. **A human.** Function and Superpower. "Message your care team", a personalised action plan, a clinician
   who reviewed your numbers. The value is access to expertise.
3. **A marketplace at member pricing.** Function and Superpower again, as a secondary layer.

### 🔴 The finding that should change the offer: nobody gives supplements away

**Function and Superpower do not include supplements in the membership.** They run a **marketplace with
member-exclusive pricing** and sell them separately, on top of a fee that already covers 100+ biomarkers a
year and clinician access.

**Including the supplements is more generous than what the market leaders do**, and it is the part of our
plan carrying the physical cost and the fulfilment problem. Selling them at member pricing instead would
keep the recurring line almost pure margin and remove stock, dispatch cadence and inventory from the
membership entirely. **That is worth considering as an alternative to the model in economics section 10.**

### What Andro Prime can and cannot deliver today

| Leg | Available now? |
|---|---|
| **A human** | 🔴 **NO.** Phase 0 cannot give clinical advice, and Ewa is a single GP who signs copy, not a care team. This leg is closed until CQC |
| **A daily habit loop** | 🟠 **Partially, and unbuilt.** `symptom_answers` and `qualifier_responses` exist as tables, so symptom tracking against markers is the natural shape. Nothing is built |
| **Trend and retest cadence** | 🟠 The data spans a user's orders already, but a trend needs two tests, and most members will have one. The cadence table is a PROPOSED doc pending Ewa |
| **Member pricing / credit** | 🟢 Cheap to deliver, nothing built |
| **Member content** | 🟢 The content machine exists. Low perceived value on its own |

### The honest consequence for price

**We cannot sell the leg that justifies the top of the market.** Superpower charge about USD 17 a month
**with** a care team and 160 biomarkers a year. Bioniq charge GBP 199 **with** a bespoke formula, which we
cannot manufacture either.

A launch membership of supplements, dashboard, trend, retest cadence and member pricing is a real product,
but it is realistically a **GBP 19 to 29 a month** product in the UK, not GBP 59. **GBP 59 requires either
the daily loop built or the clinical leg opened, and only one of those is within our control before CQC.**

**So the choice is explicit:**

- **Price at GBP 19 to 29 now**, ship the honest version, and raise price when the loop or the clinician
  arrives. Margin at GBP 29 is 88.9%, just under the 90% target.
- **Or build the daily loop first** and launch at GBP 39 to 59. That is a product build, not a pricing
  decision, and it is the only route to 90%+ that does not depend on CQC.

**The one advantage nobody else has** is still the catalogue rule: we only stock a supplement where we test
the marker its claim names. Superpower's marketplace sells whatever sells. That is the argument for a
premium against a *supplement* brand. It is not, on its own, an argument for GBP 59 a month against a
*testing membership*.

## 8. Shortest path to knowing whether the plan is real

In order, and the first two are one afternoon each:

1. **Send the Nutribl email.** It is written and sitting in drafts. It starts the longest external chain.
2. **Send the Ewa zinc question.** Written, sitting in drafts. Unblocks the third bottle.
3. **Get the 3PL's fulfilment fee.** The largest variable in the model, and one question.
4. **Design the between-tests product.** The one genuine unknown, and the thing the entire membership price
   rests on. Until this exists there is no membership, only a supplement subscription with a high price.
