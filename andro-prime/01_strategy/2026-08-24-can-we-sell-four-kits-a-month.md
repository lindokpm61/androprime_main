# Can we sell four kits a month today? Measured, not estimated

**Created:** 2026-08-24 | **Owner:** Keith | **Status:** FINDING. Measured against the live database and live SERP data.

**Why this exists:** `financial-model/2026-08-24-membership-year-1-forecast.md` rests on one load-bearing
assumption, an acquisition ramp starting at four kits in month one. Every other number traces back to it.
This checks whether that first month is achievable.

**Answer: no, and the gap is roughly thirty-fold.**

> 🔴 **CORRECTED THE SAME DAY, and the correction changes what the numbers mean.** Keith, 2026-08-24: the database figures below are **test data and the absence of marketing, not the failure of it.** Nothing has ever been promoted beyond publishing articles. Zero users after zero promotion is evidence about effort, not about demand. The measurements stand; the inference that there is 'no working channel' was too strong and is withdrawn. The correct statement is that **no channel has been attempted**, which is a different problem with a different fix.
>
> 🔴 **And section 6's recommendation is superseded.** It advised proving a channel with a waitlist before building. Later the same day the **Confirmation bundle was found already built and Ewa-signed** in `../09_website-app/frontend/lib/bundles/config.ts`, gated off behind `BUNDLES_ENABLED`. A waitlist tests the same demand a launch tests and cannot capture it, so with a shipped mechanism sitting behind a flag the waitlist is the weaker move. See `STATE.md` 2026-08-24.

---

## 1. What the database says

Queried live, 2026-08-24.

| Measure | Value |
|---|---|
| Kit orders, **all time** | **3** (2 in June, one of them cancelled; 1 in August) |
| Registered users, all time | **3** |
| **Users created in the last 30 days** | **0** |
| Supplement waitlist | 4 |
| Founding-member list | **0** |
| Supplement subscriptions | 0 |
| Published articles | 19 |

One of the three orders is Keith's own. **The site has produced zero new users in thirty days.**

## 2. What the search data says

DataForSEO, `andro-prime.com`, UK, live 2026-08-24.

| Measure | Value |
|---|---|
| Keywords ranking anywhere in the top 100 | **17** |
| Best position held | **18** |
| Estimated organic traffic | **~20 visits a month** |
| Commercial-intent keywords ranked | **0** |

Every ranking term is informational and most are page 8 to 10:

| Rank | Keyword | Volume |
|---|---|---|
| 18 | how to read your blood test results | 590 |
| 63 | inflammatory markers nhs | 70 |
| 83 | blood test results reading | 590 |
| 89 | inflammation markers | 2,900 |
| 95–99 | five variations of "what does FBC mean" | 40–1,000 |

🔴 **Note what that list is.** People asking what a full blood count means. **We do not sell an FBC panel.**
The traffic we do have is the wrong traffic, not merely too little of it.

This corroborates rather than contradicts `06_marketing/STATE.md`, which already records the domain
"absent from the organic top 100 on all 23 tracked queries" and cited in "0 of 72 cells" where an AI
Overview was present.

## 3. The arithmetic, using our own conversion bar

`06_marketing/STATE.md` sets the bar itself, and honestly flags it as assumed rather than measured:

> A GBP 99-179 kit from a brand nobody has heard of should convert cold traffic at roughly **0.5-1%**, so
> one sale needs about **100 to 200 sessions**.

| | |
|---|---|
| Sessions needed for 4 kits a month, at 0.75% | **~530** |
| Sessions available today | **~20** |
| **Gap** | **~26x** |

Month one of the forecast requires roughly **twenty-six times the traffic that exists**, and of a different
kind, since none of the current traffic has purchase intent.

## 4. Which channels are actually open

| Channel | State |
|---|---|
| **SEO, commercial terms** | Absent from the top 100 on every one. Competitors on those SERPs sit on domains ranking 264 to 355 on authority. **Months, not weeks** |
| **SEO, fan-out re-optimisation** | The one identified route: 125 winnable sub-queries across 17 existing articles, combined 58,990/mo. Re-optimisation, not new writing. Still months |
| **Paid search** | CPC GBP 1.45 to 4.91 on the terms we want, all HIGH competition. At 0.75% conversion that is **GBP 193 to 654 per order** against a blended LTV near GBP 241. **Only the cheapest keyword is even arguable** |
| **Founder / organic social** | Open, zero marginal cost, partly built. The carousel run has a stated bar of 4 to 7 clicks per post |
| **PT / affiliate / influencer** | **FROZEN since 2026-06-07.** FirstPromoter dormant, CA-001/CA-002 parked pending a solicitor |
| **WhatsApp** | **Dead.** 360dialog ruling 2026-08-21, Meta-level restriction, channel closed |

## 5. What this means for the forecast

**The ramp is not a forecast. It is a hypothesis with no channel behind it.** The model is arithmetically
sound and the unit economics hold; it simply describes a business that does not yet have a way to acquire
anyone.

**And it reframes this whole week's work.** Every session has been spent on what to build: the shop, the
membership, the app, the loop, the pricing. **The measured constraint is not the product. It is
distribution, and it has been for months.** An app cannot convert traffic that does not arrive.

**The counter-argument, which is real:** the membership roughly quadruples LTV per acquired customer, and
that is exactly what makes paid acquisition arithmetically possible. On kit-only economics a GBP 193 CAC is
a heavy loss. Against a blended LTV near GBP 241 it is thin but survivable. **So the membership is not
merely a revenue idea, it is the thing that could make a paid channel viable at all.** That argues for
building it, but not for building it first.

## 6. The cheapest next thing to learn

The single number every model in the last week has guessed at is **what percentage of cold traffic buys**.
Nothing has ever converted cold traffic here, so it has never been measured.

The 30-post carousel run is already planned, already compliance-approved under CA-034 and CA-035, and costs
nothing but time. It has a stated success bar. **Run it, and it returns the one number that unlocks every
other model on the shelf**, including whether paid search can ever work.

**Recommended order:** prove a channel, measure the conversion, then build the app for the traffic that
exists. Building the app first means building the middle of a funnel that has no top.

---

**Method note.** Database figures are live queries against the production Supabase, 2026-08-24. Search
figures are DataForSEO Labs `ranked_keywords` and `keyword_overview`, UK location, same date. The 0.5-1%
conversion bar is the repo's own and is explicitly recorded there as assumed, not measured.
