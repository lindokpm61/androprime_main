# Strategy: Current State

Consolidated status of every open strategic thread: what's locked, what's still owed, and where the authoritative doc lives. Durable constraints are in `CONTEXT.md`; the fixed baseline is `master-implementation-blueprint.md`. This file is the moving layer; update the date on each change.

_Last updated: 2026-08-24 (**THE OFFER IS BEING RESHAPED AROUND AN APP, AND THE MECHANISM FOR IT IS ALREADY BUILT AND SWITCHED OFF.** Keith, 2026-08-24, exploratory: kit as gateway, **the app as the product**, supplements demoted to a shop at member price. Positioning is **"one test is not a decision"**: the incumbents advertise the clinical solution and their funnel depends on one result being enough to start a programme, so they cannot occupy that ground. 🔴 **The Confirmation bundle in `lib/bundles/config.ts` already implements it** — second testosterone kit auto-dispatched when the first reads under 12 nmol/L, `CONFIRMATION_INTERVAL_DAYS = 0`, **Ewa signed the immediate recheck 2026-07-26**, all-clear banks for a 6-month recheck — gated off behind `BUNDLES_ENABLED`. **This answers the 2026-07-20 refutation rather than overruling it**: that review assessed a FEATURE (the results brain, which Thriva has) and this is a POSITION (decision support, which nobody occupies). **Two compliance constraints**: the 12 nmol/L figure is BSSM's and must carry its citation inline (already a recorded ASA substantiation exposure), and a sub-12 result routes to a GP per the 2026-06-04 decision, which strengthens rather than blocks the story — we supply the second morning sample a GP needs, we do not diagnose. **Measured the same day**: 3 kit orders ever, 3 users, 0 in 30 days, 17 ranked keywords, best position 18, ~20 organic visits/month, none commercial-intent (`2026-08-24-can-we-sell-four-kits-a-month.md`). **Keith's reading, accepted: that is the absence of marketing, not its failure** — nothing has been promoted. Financial models filed: `financial-model/2026-08-24-membership-90-day-model.md` and `...-year-1-forecast.md` (base case GBP 55,362 revenue / GBP 31,297 profit / 57%, cash-positive from month 2). **NOTHING DECIDED, NOTHING BUILT, NO FLAG FLIPPED.** **Ordering, and it is load-bearing: the app-led-versus-shop-led decision must be made BEFORE any Nutribl stock order and before label artwork is commissioned.** Stock is about GBP 97 and reversible; artwork is where the commercial model becomes physical, and a bottle designed for shelf comparison is a different object from one designed as part of a protocol. The shop-front build in `../09_website-app/docs/2026-08-23-supplement-shop-front-spec.md` also waits on it. If app-led is taken it partially reverses the 2026-08-22 "supplements lead the funnel" decision (supplements stay the MARKETING entry, the kit becomes the first PURCHASE) and needs a decision sweep. Earlier: **SUPPLEMENTS LEAD THE FUNNEL, AND THE LOOP LIVES IN MARKETING** — Keith, 2026-08-22. Three linked decisions, none of them previously written down.)_

---

## 🟢 ADOPTED: the pre-vertical monitoring layer, app-led (Keith, 2026-08-25)

**THE APP IS THE PRODUCT, THE KIT IS THE WAY IN, SUPPLEMENTS BECOME A MEMBER-PRICED SHOP.** Decision doc:
`2026-08-24-vertical-agnostic-monitoring-thesis.md` (filed 08-24 as a draft, **ADOPTED 2026-08-25**). Adopted
on **inference, not measurement**, with the section 8 falsifier recorded so it stays testable: if the quiz
motive question shows buyers who cannot name their suspected problem are a negligible share, the thesis is
wrong and the app is a GBP 19-29 retention tool. **Reason to decide now rather than wait: the measurement is
not available and does not become available** without shipping (you need ~30 results for the all-clear rate
and a working channel for conversion), while holding it open stalls the Nutribl chain, the artwork, and the
compliance/solicitor/accountant queues, all of which run on external clocks.
**UNBLOCKS: the Nutribl stock order and the label artwork**, both explicitly held pending this.
**REVERSES: partially reverses the 2026-08-22 "supplements lead the funnel" decision** (supplements stay a
MARKETING entry; the kit becomes the first PURCHASE; the app becomes the PRODUCT). Decision sweep run
2026-08-25.
**Owed externally:** compliance read on the positioning sentence + membership framing; solicitor on the
entitlement terms; accountant on supply characterisation + supplement VAT rating; a **second contracted
clinician** for published answers (Ewa is already the bottleneck).

The claim: every meaningful UK
competitor monetises by routing into a vertical (TRT, ED, GLP-1, thyroid), so none can sell a product whose
value is *not having chosen one yet*. **This is a claim about COMMITMENT, not capability**, which is what
distinguishes it from the 2026-07-20 refutation (that killed "nobody owns interpretation + tracking + trust",
a capability claim, and it stays killed). Checked against the teardown's own table: **six of seven competitors
are vertical-committed, including Thriva, which has since added a GLP-1 programme.** The honest counter-example
is **Forth** (no prescribing, dashboard, track-over-time), which is agnostic on capability but not positioned
that way; treat Forth as the brand to watch.

**Concrete mechanic proposed: show BOTH ranges on every marker card.** Vitall's male testosterone reference
range is **8.64-29.00 nmol/L** against our **<12** low cut, and `../04_products/results-engine/thresholds.md`
already annotates that gap as "deliberately different at the low end (the whole test-led thesis)". The framing
is the SfE/ACB 2023 phrase **"action cutoffs, not reference ranges"**. Hiding our range is not an option: the
lab range is returned with every result, the customer has a right of access under UK GDPR, and concealing the
disagreement IS the "moving the goalposts" charge we exist to refuse. Four of nine markers carry a real
disagreement (T, Active B12, ferritin); vitamin D matches; SHBG/Free T are assay-driven.

**A correction that must not propagate: the "~93% all-clear" figure is wrong.** It is a NON-REFERRAL rate
(Medichecks refers ~7% to a GP). `research/2026-07-20-mainstream-buyer-deep-research.md` carries the caveat
"non-referral does not equal normal result" in its body and drops it in its executive summary. Do not re-cite
93% as an all-clear figure. Our own Kit 3 all-clear rate is unknown and unmeasurable at 3 orders; it needs ~30
results. 🔴 **SHARPENED 2026-08-25 (Keith): "normal" is a property of the PANEL, not of the person.** A
single-vertical test comes back clear far more often than an agnostic one, which is why Numan needs "fear
nothing" framing. Testosterone alone is ~3 independent dimensions and finds something in ~1 man in 5; nine
markers across two axes finds something in >1 in 3; 14 markers ~51%, 17 ~58%. **Testing one thing is how you
miss it, and that is the product argument FOR the agnostic panel.** Consequently **the earlier claim that the
all-clear member is "the core customer" is WITHDRAWN** (it rested on the same bad 93%): the centre of gravity
is the man with one or two things flagged across an agnostic panel, and the all-clear member is a case to
serve, not the case to build around. **The discipline is not "never widen", it is CHOSEN not BUNDLED**: a
separate panel a member elects because he has a question is a product; markers added to one test he never
asked about, to raise the hit rate, is the incumbent playbook. By 17 markers our detection rate is in Numan's
territory and the only thing separating us is who decided. **This licenses the already-locked roadmap**
(`../04_products/CONTEXT.md`, 2026-05-27): Kit 3 Plus metabolic → **Kit 5 Thyroid** (anchor `private thyroid
test`, 880 vol, **KD 11**, no spec doc) → Kit 6 Cortisol parked. Note the two softest SEO targets in the file
(KD 11 and KD 6) are both on the pre-vertical side, not the testosterone side. Earlier framing: Numan ran that
experiment (21 markers, refund if normal, ASA found only 4-10% qualified) and earned a misleading-advertising
ruling for it. Monetise MOVEMENT, not flags.

**The review pass (section 10 of the doc) raises nine gaps. THREE ARE NOW ANSWERED (Keith, 2026-08-24):**
(1) **Free tier: content plus a demo, never a data tier.** The free layer is the 18 already-published articles
(`myth-of-normal-range.mdx` already states the two-range case in its own FAQ) plus a demo login showing a
sample result, so marketing has something to point at. **Give away the thinking, sell the record.**
(2) **External results: NO.** An earlier draft wrongly called provider-agnostic the "logical endpoint" of
vertical-agnostic; **they are independent axes** (Thriva ingests external results while being firmly
vertical-committed). Ingestion is corrosive on its own merits: provenance is the whole asset, testosterone is
diurnal so an unknown-time sample is uninterpretable, cross-assay trends are artefacts, and the 2026-07-20
teardown already called external upload "a feature, not a moat." **The refusal is a positioning asset:
"we only chart what we can stand behind."** Optional later middle ground: store an external PDF as an
uninterpreted file, excluded from the trend.
(3) **Web app, not native.** Keith: no App Store. Store commission of 15-30% would break the recurring
margin, and a web app keeps any install step out of a funnel whose top is interpretation content.
🔴 **Accepted cost, recorded 2026-08-25 so it is not rediscovered: Apple Health is PERMANENTLY UNREACHABLE.**
HealthKit is native-iOS-only with no web API; Google's Health Connect is native-only too. The step/sleep data
already in a member's phone cannot be read. **What a web backend CAN reach over server-side OAuth: Oura,
Whoop, Fitbit, Garmin, Withings** (aggregators Terra/Vital/Rook collapse them for a fee; premature at zero
users, but Vital spans wearables AND lab ordering). **Build none of it yet:** the load-bearing input is
whether he took the capsule, which no wearable knows.
🟢 **Design rule that fell out: LOG ONLY WHAT CONNECTS TO THE MARKER BEING MOVED.** The mockup asked for
capsule + sleep + sun + steps; sleep and steps do not move vitamin D and were dropped. Asking a member to
report data the product cannot act on is how a logging habit dies. The marker does the scoping, so the row
stays short without needing a rule about row length. **Compliance rail attached:** a member may log a symptom
and see his own trend, but the app must NEVER connect the two for him ("your energy improved because your
vitamin D rose" is per-customer interpretation, post-CQC). Show both lines, say nothing about the relation.
**(4) PRICE: GBP 47/month, VAT-inclusive-ready** (nets GBP 39.17 at 20%). Reasoning is price STABILITY, not
revenue: the VAT threshold is GBP 90,000 rolling and the year-1 base case (GBP 55,362) sits under it, so the
full GBP 47 is retained now and the sticker never changes on crossing. Pricing at GBP 39 and adding VAT later
would force a visible 20% rise or a 17% cut to the recurring line. Cost held consciously: a 20% higher ask at
the day-30 screen, the highest-variance number in the business. **Note the forecast's own conclusion: price
is the THIRD lever. The ramp moves year one by ~GBP 53,000, price by ~GBP 9,000, churn by ~GBP 3,000.**
Consider annual prepay (GBP 470/yr reads as GBP 39/mo, removes 12 churn decisions), which is what Function
and Superpower both do.
**(5) CONTENTS: both legs open, one restricted.** Daily habit loop included (tables exist, mockup drawn, no
regulatory exposure, unbuilt) but it must score ADHERENCE not health, with the retest as the payoff.
🔴 **The clinical leg's boundary is the ACT, not the person**: `03_compliance/CONTEXT.md` (sourced to
`clinical-governance-position.md`, Ewa-approved 2026-05-22) forbids per-customer interpretation by anyone, so
swapping in a different qualified clinician does not move the line. **The form that works is a PUBLISHED
general answer** (member asks, clinician answers publicly, everyone sees it) and it is already funded at
GBP 150/mo in the model as "clinician content". Never call it a care team, consultation, or review.
**(CADENCE) First retest at day 90 as the onboarding proof event, ANNUAL thereafter on a stated date.**
Three payments are collected before day 90 costs anything. Quarterly forever is ~58% gross at GBP 47 and is
what the BMJ criticised Numan for; a retest attached to an actively-held membership is defensible where a
fixed testing schedule is not.
🟢 **(ENTITLEMENT) A BENEFIT, NEVER A CREDIT (Keith, 2026-08-24). Gym logic, not gift-voucher logic.**
Keith's objection: "includes one kit a year" is earned over 12 months but cancellable any time, so a member
who pays 3 months and leaves still believes he is owed a kit. **The money risk is small** (only a month-one
redemption loses money: -GBP 12 at month 1, +GBP 80 by month 3, +GBP 503 at 12 months); **the ambiguity risk
is not**, because the Consumer Rights Act construes ambiguity against the drafter. **The fix is a change of
OBJECT, not of arithmetic:** not "you hold GBP 99 of credit that expires" (a thing the member owns: liability,
ledger, challengeable expiry term, arguable dispute) but **"membership includes your retest on its scheduled
date, and you must be an active member on that date"** (a benefit: nothing owed to a non-member, no liability,
no expiry to defend). The upgrade path survives as *put your retest toward a larger panel and pay the
difference*, preserving the commercial virtue economics 9a was written for (gross RISES with every upgrade).
**This DELETES two build items:** the credit ledger (was Medium) and open decision 6 (credit expiry/rollover),
both struck in the gap analysis; economics 9a amended in FRAMING with its arithmetic left standing. Still
needs a **solicitor** on the terms, and it must be prominent at point of sale, not in the T&Cs (Numan's ASA
ruling A22-1153049 was for burying exactly this). **The mockup still uses the GBP 99 credit language and
needs reworking**, along with its day-90-forever cycle.
🔴 **VAT ERROR CORRECTED IN THREE DOCS:** they recorded "most supplements are zero-rated". UK food supplements
are generally **STANDARD-RATED at 20%**, excluded from food zero-rating; gummies land there as confectionery.
Any margin line assuming zero-rating carries a 20% error. Also: **exempt is WORSE than zero-rated** (blocks
input-VAT recovery). Two accountant questions owed in writing: how the membership supply is characterised
(standard / exempt / mixed with apportionment), and whether the three launch SKUs are standard-rated. Answer
the second **before the first Nutribl order**.
**Still open: only whether the app-led read is adopted at all.** Also flagged: the
brand's lead marker (testosterone) is the one that will NOT move on wellness supplements, so the marketing hook
and the retention mechanism point at different kits; a native app would lose 15-30% of the recurring line to
store commission; the longitudinal series depends on Vitall assay continuity and deserves a notice clause;
free general-purpose AI is now the real substitute for "explain my blood test"; and clinical copy surface
scales with this thesis while Ewa does not.

🟢 **One finding INVERTS an existing conclusion.** `2026-08-24-can-we-sell-four-kits-a-month.md` calls our 17
ranked keywords "the wrong traffic, not merely too little of it", because they are informational blood-test
interpretation queries ("how to read your blood test results", position 18, 590/mo; "inflammation markers",
2,900/mo) and we do not sell an FBC panel. **Under this thesis that traffic is exactly the ICP**: people holding
numbers they do not understand who have not chosen a vertical. The 125 winnable sub-queries at a combined
58,990/mo, reachable by re-optimising the 17 existing articles, become the funnel rather than a slow SEO play.
If the thesis is adopted, that doc's section 2 needs a superseding note.

**Falsifier recorded:** if the quiz motive question shows buyers who cannot name their suspected problem are a
negligible share, the thesis is wrong and the app is a GBP 19-29 retention tool, not the product. The
instrument exists (section 6.6 of the mainstream research) and **has never been fielded**; it needs one new
motive option, "I have symptoms and I do not know what is causing them".


## Artifact sweep, 2026-08-25 (carrier class 0: stores outside version control)

Four published artefacts swept for the app-led decision. **A published page carries more authority than the
doc it came from and is checked far less often**, so it decays in the most expensive direction.

| Artifact | Action |
|---|---|
| **The Supplement Shelf** `76bd093b` | **SWEPT + source committed** (had none). See `../04_products/STATE.md` for the factual error found on it |
| **The Empty Square** `29218457` | **BANNERED.** Position stands; the GBP 5,950 Gate 0A figure (real: ~GBP 96.70) and the 93% claim corrected inline; section 06's three supplement rules explicitly preserved |
| **Strategy v2** `f4a70548` | **v2.3 → v2.4.** Extended, not overturned. Nothing on it was wrong |
| **Where the Range Sits** `fbab8253` | 🔴 **STILL OWED.** No repo source. It is a placement study for the results page and the app-led decision changed **what that display contains** (two ranges, not one), so all three of its options now show a superseded component |

🔴 **CORRECTION TO A CLAIM MADE THIS SESSION: the corporate / employer channel WAS already on the record,
and a `.md` grep missed it.** It is **revenue idea B3** in the Strategy v2 dashboard, dated 2026-07-20,
medium confidence: *"SME wellness bulk kits. Per-seat or bulk kits sold to employers and occupational-health
brokers. Lower CAC, higher volume, and the employer pays, which softens the D2C churn problem. Stays inside
Phase 0 wellness. **Validate with 3-5 broker conversations first.**"* Keith raised the same idea
independently on 2026-08-25 and the recommended next step was independently the same (one buyer
conversation), which is corroboration rather than duplication. **The reason it was reported as never
considered: it lives in an HTML artifact source, not a Markdown doc, so a `**/*.md` grep cannot see it.**
That is the same carrier-class-0 blindness this sweep exists to fix, and it argues for including
`**/*.html` in the search-term set by default.

---

## Supplements lead the funnel, and the loop lives in marketing (Keith, 2026-08-22)

> 🔴 **DECISION 1 BELOW IS PARTIALLY REVERSED (Keith, 2026-08-25).** The app-led decision above supersedes
> "supplements are the acquisition product, kits are the monetisation." **Supplements remain a MARKETING
> entry and become a member-priced shop; the KIT is the first purchase and the APP is the product.** The
> supplement launch is no longer on its own timetable ahead of the kit. **Decisions 2 and 3 STAND unchanged**
> and are strengthened rather than weakened: the loop still lives in marketing, the shop still shows everyone
> the same bottles at the same prices, nobody's result still triggers anything, CA-026 clause 2 is still never
> engaged, and the Keith/Regulatory/Ewa routing split is untouched. See
> `2026-08-24-vertical-agnostic-monitoring-thesis.md`.

Three decisions taken together. They change the shape of Phase 0 and they are all Keith's, not
clinical.

**1. Supplements are the acquisition product, kits are the monetisation.** Far more people search
for supplements than for a £99 blood test, supplements are monthly rather than one-off, and they
fund the kits. Supplement launch is therefore **not gated on kit volume** and proceeds on its own
timetable. The loop runs both ways: kit buyers are pushed to supplements, supplement buyers are
pushed to the test.

**2. The loop lives in MARKETING, not in the product.** The shop shows everyone the same bottles
at the same prices, always, **organised by panel** with identical contents for every visitor. The
argument for testing is a category-level argument (*do not guess, measure*), not a per-customer
mechanic. **Nobody's result triggers anything.**

This resolves the CA-026-clause-2-versus-biomarker-loops conflict that
`04_products/STATE.md` records as deliberately deferred. There is nothing to reconcile: with
no per-result behaviour anywhere, clause 2 is never engaged, and **no carve-out or wording
exception needs writing**. **Clause 2 stands** — Keith's words were "I'm still maintaining the
line for the moment", so treat it as held rather than permanently locked.

The moat survives, and it is a brand position rather than a mechanic: **we are the supplement
brand that tells you to measure first.** No commodity seller says that, because it costs them
sales.

**3. Governance: this was never a clinical question and should not have been on Ewa's list.**
CA-026 clause 2 is a positioning rule Keith wrote in `02_brand/messaging-framework.md`. The
split, for future routing:

| Question | Owner |
|---|---|
| Does the shop vary by result? Catalogue, pricing, architecture, funnel order, shop placement | **Keith** — commercial |
| What wording may connect an individual's marker to a product | **Regulatory** (ASA/CAP, MHRA borderline, EFSA general-population claims) — a compliance read, not a GP |
| Zinc ceiling, D3-above-assay exclusion, GP-referral thresholds, interpretation copy | **Ewa** — clinical safety only |

**Consequence: the shop can ship on general-population EFSA claims today**, with no new ruling from
anyone. The connecting language is an enhancement layered on later, in parallel rather than in
series. **Amending clause 2 would need a decision sweep**, since it is cited as substantiation in
approved copy (see the open CA-026 §P citation problem on ClickUp `869e9fr6x`) — but on the
decision above, no amendment is required.

---

## Decision sweep: the Vitall shelf-life / order-vs-dispatch ask was closed 2026-07-22 and never propagated (2026-08-04)

Keith's 2026-07-22 direction (ClickUp [`869e74vwz`](https://app.clickup.com/t/869e74vwz), comment) established that **the deferred second-kit dispatch is our mechanism, not Vitall's**: we place each order ourselves via their createOrder API at trigger time, so Vitall never holds or splits anything. Two asks died with it, "confirm order-time vs dispatch-time separation" (resolved by design) and "get the kit shelf-life figure in writing" (moot, since the second kit is never pre-bought or held).

**The decision landed in one ClickUp comment and propagated nowhere.** Six carriers were still telling readers both were owed, four of them written *after* the decision:

| Carrier | Status |
|---|---|
| ClickUp `869e74vwz` task **title** | swept: also stale on Ewa, who signed 2026-07-26 |
| ClickUp `869e74vwz` **description** banner + item 1 | swept |
| ClickUp `869e74vwz` latest **comment** (2026-07-26) | superseded by a new sweep comment |
| `ltv-cac-profitability-model-2026-07-21.md` §Caveats | swept |
| `01_strategy/STATE.md` (the 2026-07-21 bundle entry) | swept; it was stale on all three of its owed items |

**The residual is satisfied too.** The one thing that survived 22 July was "a courtesy confirmation that staggered singleton orders are business as usual." Ben's 2026-07-21 email supplies it: *"register the six orders via API or dashboard and we will fulfil from there."* Nothing is owed to Vitall on the bundle mechanism.

**Same session, adjacent find:** the hs-CRP assay question was re-opened twice against `thresholds.md` despite Ben confirming it in writing on 2026-04-30 ("your profile includes hsCRP"), because that file carried no provenance for its assay assumptions. Provenance table added to `04_products/results-engine/thresholds.md`; see `04_products/STATE.md`. Root cause both times: an unresolved-*looking* instruction with no pointer to whether it had been answered elsewhere.

---

## Strategy artifacts updated for bundle go-live (2026-07-26)

Both published strategy artifacts updated in place (same URLs) to reflect the two-kit bundle go-live (LIVE 2026-07-26). **"The Empty Square"** (`29218457`): bundle path-step flipped to DONE/live, the built-and-live list gained the bundles + WTP quiz + hero-to-quiz routing, the section-05 SKU cards flipped to LIVE, and the Confirmation "auto-refund on all-clear" mechanic was corrected to bank-by-default / refund-on-request (matches shipped behaviour; the customer-facing name is "Recheck"), F4 ruling marked resolved, closing rewritten. **"Strategy v2 · Conflict-Free"** (`f4a70548`): masthead bumped to v2.3, B1 lead SKU flipped from "now priced" to LIVE 2026-07-26. **Repo-source note:** Empty Square had no repo source (generated inline previously); reconstructed a clean source at `research/2026-07-24-empty-square-strategy-synthesis.html` (closes the sync gap). The Strategy-v2 repo source `research/2026-07-20-vitall-strategy-report.html` was stale at v2.1; re-synced to v2.3.

## Strategy artifacts refreshed to live status (2026-07-24)

Both published strategy artifacts updated in place (same URLs) to reflect what shipped since 07-21: the "Ewa wording lock owed" status is cleared (CA-026 approved 07-22) and the conflict-free money pages are now shown LIVE (deployed 07-24). **"The Empty Square"** (`29218457`): positioning moved to built/live, the money-pages path-step flipped to DONE, the Ewa-sitting body now notes CA-026 + UKAS F7 both closed (remaining: Track A tone, maintenance-offer, symptom-overlay packs + the F4 bundle ruling), articles 15→17. **"Strategy v2 · Conflict-Free"** (`f4a70548`): header changelog bumped to v2.2. Still-owed items (Prove-It bundle build, Ep 0 shoot, £250 test, GEO send, WTP quiz) left as owed. URLs are in the prior 07-21/07-22 entries below.

## WORDING APPROVED: CA-026 (Keith + Ewa, 2026-07-22)

The positioning wording is signed: **§P + A1 (standing claim) + B1 (hero) + C1 (/kits money block) + C2 (FAQs) + D1/D2 (bundle lines) + D+ (per-kit lines) + E2 (press line, the clinic-proof form; E1 retired unused)**. Logged as CA-026. The positioning decision's last dependency is cleared: **the decision sweep and the money-pages rewrite are now unblocked.** Still gated separately: D2/the Kit 1 bundle page (solicitor terms + the Phase 0 confirmatory-testing boundary ruling, audit F3/F4, on the B1 prerequisites task) and the F7 UKAS-certificate filing for the CA record. The Ewa sitting's remaining agenda: the F4 ruling + the three pre-existing sign-off packs (Track A tone, maintenance offer, symptom overlay).

## Ewa agrees the position in principle; wording pack drafted + audited (2026-07-22)

Ewa agreed the position and the principles of the statement (2026-07-22, via Keith; "we're not marketers" = wording production delegated). Customer-facing wording pack drafted at `02_brand/2026-07-22-conflict-free-wording-pack.md` (hero, standing claim, /kits money block, bundle lines, press line; options per section so the sitting is a pick, not a writing task). Compliance-reviewer audit folded in; **two new rulings surfaced for Keith + Ewa beyond wording choice**: (1) the "Confirmation bundle" sits on the compliance CONTEXT Phase 0 table's "confirmatory testosterone testing = post-CQC only" line: needs an explicit in-bounds ruling (wellness reading: second non-regulated kit feeding the existing GP route) or a reshape/rename before the bundle page ships; (2) press line E1 ("no reason to sell you testosterone") needs a retirement-at-clinic-launch plan or the clinic-proof E2 variant. Also: the "we earn the same either way" phrasing used in earlier strategy discussion is NOT substantiable once supplements attach: canonical substantiable claim is **"a low result earns us nothing."** ClickUp: Ewa-sitting task `869e7pmu9` + B1 prerequisites `869e74vwz` updated.

## DECIDED: conflict-free positioning ADOPTED (Keith, 2026-07-22)

The candidate position from the 2026-07-20 teardown is now **the** positioning: Andro Prime is the conflict-free men's health testing brand ("the men's testosterone test with no reason to sell you testosterone", internal articulation). Decision doc with alternatives-considered, wording rails, and the falsifier: `2026-07-22-conflict-free-positioning-decision.md`. **Still owed: the exact customer-facing sentence is locked with Ewa** (batched Ewa sitting; never the absolute "we will never sell testosterone"; durable claim = separation of incentives) **before** the money-pages rewrite ships. **Decision sweep deliberately deferred until the wording lock**: then run `/decision-sweep` across `06_marketing/positioning/product-marketing-context.md`, `02_brand/messaging-framework.md`, homepage metadata, etc. Unblocks: money-pages rewrite, Track A message-match, B1 pages, GEO outreach framing. Both strategy artifacts updated to reflect the adoption.

## Bundle working prices accepted + LTV model v2 (2026-07-21)

Keith accepted **working bundle prices** (chat, 2026-07-21, pending Van Westendorp WTP validation; no verified WTP exists for the band): **Confirmation (Kit 1) £169** (£99 + £70 conditional retest; the £70 is banked as the 6–12-mo recheck or refunded on an all-clear), **Prove-It (Kit 2, flagship) £199** (£119 + £80 day-90 retest), **Full-picture (Kit 3) £259** (£179 + £80 day-90 Kit 2 retest). Pricing rule: retest ~30% off when prepaid, first kit never discounted, split shown on page. New model doc `ltv-cac-profitability-model-2026-07-21.md` (extends, does not supersede, the 2026-06-26 model; pointer added there): bundle contributions **£48/£68/£92**, Prove-It buyer LTV £103 planning / ~£146 target / £207 best, all v1 channel verdicts survive, Gate 0B stage-1 bar restated per-SKU, cash-forward + deferred-revenue/refund/banked-kit lines specified, measurement-date table for every new input. ~~Owed before build: Vitall order-vs-dispatch separation + kit shelf life in writing; solicitor terms paragraph (banked-kit validity ~12 mo); Ewa signs the Kit 1 confirmation interval.~~ **ALL THREE CLOSED; swept 2026-08-04.** (1) **Vitall order-vs-dispatch + shelf life: closed 2026-07-22** by Keith's direction on ClickUp [`869e74vwz`](https://app.clickup.com/t/869e74vwz) — the deferred second-kit dispatch is *our* mechanism, not Vitall's (we place each order via their createOrder API at trigger time), so separation is resolved by design and **shelf life is moot: the second kit is never pre-bought or held**. The residual "courtesy confirmation that staggered singleton orders are business as usual" is satisfied by Ben's 2026-07-21 email ("register the six orders via API or dashboard and we will fulfil from there"). (2) **Solicitor terms paragraph: satisfied in-house 2026-07-25** (F3, ClickUp `869e8w56x`; solicitor waived). (3) **Ewa signed the Kit 1 Confirmation interval 2026-07-26** (`CONFIRMATION_INTERVAL_DAYS=0` + day-90), alongside the F4 Phase-0 boundary ruling. Bundles went **LIVE 2026-07-26**. If B1 is greenlit as product spec, move pricing into `04_products` per the 2026-07-20 note. Strategy artifact updated (v4) with prices + financial section. **The v2 strategy dashboard artifact was also updated in place to v2.1** (`research/2026-07-20-vitall-strategy-report.html`, same live URL): mainstream-confirmation box + billing-distrust copy nuance, B1 card rewritten with the three priced bundle shapes, Numan "fear nothing"/ASA row, £88 tile pointed at the v2 model, stale "verify next" items closed (mainstream mining done; WTP re-scoped as the sole load-bearing gap), and a new copy rail: never write "we will never sell testosterone" (durable claim = separation of incentives, survives the clinic).

## Mainstream-buyer deep research landed + re-verified COMPLETE (2026-07-21)

Third-party evidence pass on the adversarial review's A4 gap ("no read on the mainstream £99 buyer"): `research/2026-07-20-mainstream-buyer-deep-research.md` (deep-research workflow, 19 sources, 25 claims through 3-vote adversarial verification; the interim 14/6/5 tally was completed by a resume run → **final 17 confirmed / 8 refuted**). Headlines: the mainstream buyer is an episodic NHS-defaulter (YouGov 34% first-time, 11% habitual), **speed of access is the dominant trigger** (52%; only 37% of eligible men ever invited to an NHS Health Check), **reassurance is the category's centre of gravity**: Medichecks refers only ~7% of customers to a GP and refuses subscriptions on clinical grounds (BMJ 2022;379:o2518); Numan's "fear nothing" £128 refund-if-normal test proves the reassurance mechanic sells, and its ASA ruling (A22-1153049: only 4-10% qualified, subscription buried) shows the trust-destroying way to run it; supports keeping Tracker v1 parked and gives the Confirmation bundle's "bank it or money back" a precedent + a compliance cautionary tale. **Anti-upsell sentiment is confirmed mainstream but is billing distrust (undisclosed follow-up charges + subscription traps), not anti-TRT ideology**: conflict-free claim should lead with money honesty for the mass buyer; the TRT funnel itself is press-documented (sub-£20 tests → ~£2k+/yr pathways). ⚠️ **WTP correction vs the interim write-up:** the "£500 median health budget so £99–179 is comfortably affordable" claim was **refuted**: no verified WTP evidence for the price band exists, making the quiz **Van Westendorp block load-bearing** (§6.6 lists the full quiz/post-purchase instrumentation, incl. a new funnel-awareness question). Retest-cadence note for B1: baseline + confirmation/6–12-month retest sits inside defensible practice; faster cadences drew BMJ/RCPath criticism at Numan.

## Competitor teardown + adversarial review: the "open lane" thesis is dead (2026-07-20)

A Fable adversarial review + a web-verified UK competitor teardown (`competitive-landscape/2026-07-20-uk-testing-competitor-teardown.md`) **refuted the 2026-07-19 analysis's core claim** that "nobody owns interpretation + tracking + trust." **Thriva owns that triad** (GP review + optimal-range trend dashboard + wearables + subscription); Forth largely does; Medichecks has the best accreditation. So the "Results Brain" is table-stakes on contested ground, not a moat, especially for a Vitall reseller.

**The defensible position both the review and teardown converge on:** a male-positioned testosterone brand that is deliberately NOT a treatment funnel: *"the men's testosterone test with no reason to sell you testosterone."* Numan/Voy/Manual/Hims UK all monetise the low-T and ED click into TRT (£59.99-£99/mo) and ED meds; Andro Prime's locked low-T-to-GP constraint becomes the moat those funnels structurally cannot copy, and the generalists (Thriva/Forth/Medichecks) don't make the claim because they aren't men's brands. **This is a candidate positioning decision for Keith** (honesty limits: don't assert rivals sell data; "named GMC GP" is thin, lead on "conflict-free"). **Price correction:** the "Voy £29" in the 2026-07-17 doc is wrong; verified standing price is £33.95 (from £54.99). Best new revenue idea surfaced: a prepaid baseline + 90-day retest two-kit SKU. Corrections folded into `research/2026-07-19-vitall-unmet-needs-reddit-quora.md` (addendum) and `research/2026-07-20-fable-adversarial-review.md`. Still owed (Keith/first-party only): prevalence + WTP on the mainstream buyer.

## Strategy artifact v2 + B1/LTV clarifications (2026-07-20)

The strategy dashboard artifact was fully rewritten (v2, `research/2026-07-20-vitall-strategy-report.html`, same live URL) around the conflict-free "not a treatment funnel" position; the v1 open-lane version was removed. **Artifact LTV number corrected:** a tile had mislabelled the ~£165 6-month-subscriber LTV as "blended LTV per customer"; it now shows ~£88 blended LTV per acquired customer (£60-157 range, 2026-06-26 model) and reconciles the ~£165 subscriber figure. **No STATE/CONTEXT change: their £165 (Gate 0B, "6-month subscriber") is correctly labelled and was left alone.** Kit contribution £38/53/77 is net of the 2.5% card fee; catalogue gross margin is £40.50/56/81 (both correct, different definitions).

**Two recommendations surfaced (NOT decided, for Keith):**
- **B1 (prepaid baseline + 90-day retest two-kit SKU) attaches to Kit 2 (Energy & Recovery).** Its markers (Vit D, Active B12, hs-CRP, ferritin) move in ~8-16 weeks and the retest proves the Daily Stack worked (drives the supplement sub). Kit 3 works too (baseline Kit 3 + cheaper Kit 2 retest). Kit 1 is NOT a prove-it bundle (T does not move on wellness supps + efficacy-claim risk); its legit two-kit form is a confirmation bundle (second morning sample before the GP referral). Kit 4 (Metabolic, exploratory) would be the strongest prove-it home if it ships. Compliance: frame retest as "see if your numbers moved", never "proves our supplement works" (Ewa); low ferritin / low-T still route to GP. If B1 is greenlit, move this into `04_products`.
- **Build B1 as a canonical, indexable `/kits` page on the main site, NOT an off-site landing page.** The conflict-free positioning depends on transparency, not a hidden funnel (an off-site funnel LP is the Numan/Voy playbook we are differentiating against). Use `/lp` only for paid message-match; the day-90 retest is an app + Customer.io lifecycle flow, not a landing page. Owned by `09_website-app` (canonical-site/lp/app split) if actioned.

## Vitall teardown: unmet-needs VOC + sized keyword map (2026-07-19)

New competitor-teardown research: `research/2026-07-19-vitall-unmet-needs-reddit-quora.md` plus interactive report `research/2026-07-19-vitall-unmet-needs-report.html`. A 6-domain Reddit/Quora VOC (~90 threads: hormones, GLP-1/cardiometabolic, STI, cancer, fatigue/nutrition, and the testing-experience meta). It independently corroborates the 2026-07-17 unmet-needs doc (longitudinal-tracking gap, normal-vs-optimal, finger-prick failure, ferritin intensity, anti-upsell hostility) and is cross-linked to it, not superseding; the Voy £29 collision stays unique to the 07-17 doc. The sized keyword to kit map lives in `06_marketing/seo-ai-search/vitall-keyword-to-kit-map-sized-2026-07-19.csv`.

Prioritised product ideas echo existing strategy rather than replacing it: Tier-1 = a "Results Brain" (plain-English interpretation + provider-agnostic longitudinal tracking, reinforces the `2026-05-12-longitudinal-tracker-decision.md` re-open) and a symptom-to-panel selector; Tier-2 = connected GLP-1 monitoring, an STI window-calculator / multi-site / Mgen escalation panel, and a cancer intent-router with a standalone PSA (a flagged range gap). Research only; no decisions taken, all items are for Keith to action.

## Gates RESTATED by Keith: 2026-07-09 (supersedes the same-day audit ruling)

- **Canonical text: `CONTEXT.md` → Gates Reference.** Classification unchanged: operational launch gates = qa-gates 1–5 + Gate 0A (the only blockers); 0B/0C = strategic post-launch gates. **The numeric criteria for 0A and 0B are new.**
- **What went wrong first time.** The morning ruling arbitrated four conflicting numeric sets and adopted the `andro-prime-strategic-model-v7.md` (12 May) set as the most recent. It was: _all four sets were pre-deferral._ Every one defined 0A and 0B on supplement metrics (paid pre-orders; kit→supplement conversion), and the **2026-05-23 supplements-deferred decision** (`2026-05-23-phase0-supplements-deferred-plan.md`, approved 11 days _after_ the v7 set) replaced buy-now supplement CTAs with a non-cash waitlist. Gate 0A's 25-pre-order bar was also unreachable against Tier-2's own ~5–20 kit 90-day forecast, even at 100% attach. The arbitration was on the wrong axis.
- **Governing principle now recorded:** at Phase 0a volume no demand threshold is reachable or statistically meaningful, so each gate is defined around **the decision it authorises**, not a volume it cannot reach. A gate that cannot clear does not block anything; it gets ignored. That is how four contradictory definitions accreted.
- **Gate 0A → capped-downside spend authorisation.** Stock private-label only (stability-tested; no bespoke V7.2, no tooling), exposure capped at the phased ~£5,950, MOQ survivable as a total write-off, clean 4-active spec held. Waitlist opt-in rate is a directional read, never a threshold. Recorded explicitly as a **founder bet** (Tier-2: _"breaks the self-financing principle"_), not earned demand.
- **Gate 0B → unit-economics gate** authorising paid scale. Stage 1 (pre-supplement): **CPA < kit gross contribution** (£38 / £53 / £77 direct, per the 2026-06-26 LTV:CAC model). Stage 2 (post-supplement, once attach is observed, not before ~week 8): **CPA < blended LTV** (~£165, 6-month subscriber). Soft signals are tie-breakers at low n. Read at the Tier-2 week 6–12 decision point.
- **Gate 0C → unchanged.** Month 12, cumulative cash vs the £30k "Phase 0 self-funded" threshold. It survived because it is the only candidate definition not defined on a supplement metric. No point M12 target should be quoted yet: see the Phase 0 financial principles section and option-4 Appendix R.
- The earlier "keep the v7 set" flag is **withdrawn**; the v7 doc's 0C stands, its 0A/0B are retired.

---

## Entity & ICO: DONE (2026-06-11/12)

- **Andro Prime Ltd**, no. 17185839, reg. 128 City Road, London EC1V 2NX (inc. 28 Apr 2026, active; SIC 47910 + 86900). Held 50/50 Keith Lindo / Dr Ewa Lindo.
- **Prima Medical Group Ltd does NOT exist** and is not being incorporated; two-entity / brand-holdco structure parked ~18 months. Stale docs that named Prima as data controller / wellness operator were corrected 2026-06-11.
- Data controller = Andro Prime Ltd (single, wellness now + clinical post-CQC). It is also the executed Vitall counterparty; creating Prima would not touch the Vitall contract unless Prima entered the data path (then novation).
- **ICO registration complete: number `ZC172852`** (Tier 1 micro, £52/yr, registered 2026-06-12, renewal ~11 Jun 2027). Inserted into the live privacy page + `privacy-policy.md` + `data-controller-position.md` + DPIA/GDPR checklist. No DPO required at current scale (revisit post-CQC); DP contact = `privacy@andro-prime.com`. _(The private security number is held outside the repo; never publish it.)_
- **Open:** solicitor review; long-term equity split (see next).

## Equity / shareholders' agreement: OPEN, sensitive

- **Registered ownership: 50/50** (Keith / Ewa), as incorporated. The V7 model uses 50/50 as its outcome-projection baseline.
- The **long-term** split is being settled through a **shareholders' agreement**: `entity-structure/shareholders-agreement-draft.md` (negotiating draft, uncommitted, NOT execution-ready). Treat the final split as under negotiation, not closed. Needs solicitor review **and** Ewa's independent legal advice before it means anything.
- **SHA terms are intentionally NOT summarized outside that draft** (Ewa may read shared strategy docs); the draft is their only home. The earlier "50/50 is final, no future-buyout plan" line in `2026-05-12-single-entity-decision.md` §5.5 was corrected 2026-07-01 to a neutral "under negotiation, governed by the SHA." Do not restate SHA terms into shared docs without Keith's explicit say-so.

## Phase 0 financial principles: LOCKED 2026-05-08 (M12 headline RESTATED 2026-07-09)

- Self-financing cost centre; ~£30k cash by M12. ⚠️ **The old +£39,246 / ~31%-headroom validation is SUPERSEDED (2026-07-09)**: it rested on option-4's 50/50 PT-coded affiliate mix (£13,240 H1 programme spend) from a channel **frozen since June**, plus May inputs (COGS £12 / 15% attach / 4-mo tenure) revised by the 2026-06-26 LTV:CAC model (COGS £10 / 20% attach / 6-mo tenure). Restated on June inputs + affiliate-frozen direct mix in `financial-model/option-4-financial-model-2026-05-08.md` **Appendix R**: mechanically **higher** (~£72–92k range, not a point estimate) because the freeze strips programme cost faster than revenue, **but the binding risk has moved from margin to volume** (the ramp assumed affiliate drove ~50% of it). **Quote no M12 cash figure as a target** until owned-only volume + Phase-0b attach/tenure are observed. Founding-member £75 deposit shelved; FM kept as a non-cash opt-in marker.
- **Daily Stack subscriber tenure is the single biggest swing variable** (planning case 4-mo tenure, conservative vs 12-mo industry). **Critical churn window: days 15–45**, the highest-leverage operational lever in all of Phase 0.
- Phase 0 tripwire: Kit 1 affiliate net below £10 sustained 30 days = restructure trigger.
- Authoritative for unit-economics **method**: `financial-model/option-4-financial-model-2026-05-08.md` (its **M12 headline is superseded; use Appendix R, 2026-07-09**), `research/2026-05-08-phase0-cash-target-benchmark.md`. Authoritative **input set**: `ltv-cac-profitability-model-2026-06-26.md`.

## Tiered-platform financial model v2: rebuilt 2026-05-25, headlines UNRELIABLE

- `andro-prime-tiered-platform-model-v2.xlsx` rebuilt from `tiered-platform-model-v2.md` (commit `4f36011`; rebuildable via `build_tiered_v2.py`).
- **Key finding:** the v2 markdown's published headlines (AP PASS M36 £1.28M / CL PASS M36 £104k) are **not reproducible bottom-up** from its own stated assumptions; bottom-up undershoots 40–60% on AP and goes negative on CL. Each P&L sheet shows the calibration plug explicitly. **Do not quote v2 headlines as a planning number until reconciled.**
- **Open:** (1) gate evaluation month: doc says M12, the 6-mo-elapsed rule implies M10 (Conflicts_Log row 5); (2) Performance tier has no product spec (operational criteria / comms / retest trigger); Keith picked "sub-tier of Optimisation" for the model only.

## LTV:CAC + base subscription: model annotated 2026-06-27

- Canonical model: `ltv-cac-profitability-model-2026-06-26.md`. Per-average-kit-buyer LTV ~£88–157. Cold paid never pays back; owned + affiliate only. Attach + tenure swing LTV ~2.6× (first-order); price second-order.
- **Base subscription: recommended £39.95/mo** (premium band; Daily Stack COGS ~£8, margin 60–77%). Validate with a Van Westendorp WTP test before locking, but defer/embed in the quiz (waitlist too small to sample now).
- ⚠️ **Do not use** `07_sales/growth-retention-context.md`'s £520–840 "LTV"; that's top-line best-case revenue, not the canonical contribution model.

## Phase 0a / 0b split: LOCKED 2026-05-23

- **0a (live):** kits 1/2/3 + founding-member list + **supplement waitlist** (bridge). **0b (~2–3 mo):** supplements ship (Daily Stack, Collagen, Complete Men's Stack).
- Supplement-interested customers in 0a → the waitlist (`/supplement-waitlist`, `supplement_waitlist_joined`, CIO segment 24). Supplement subscriptions are NOT purchasable in 0a (Stripe sub route returns a clean 400 by design). Full 0b activation steps: `09_website-app/STATE.md` + plan `2026-05-23-phase0-supplements-deferred-plan.md`. Approved CA-009/CA-010.

## Tier 2 sales creation plan: 2026-06-26

- Front-of-funnel = **paired**: founder short-form (IG Reels + YT Shorts, anchored on Keith's own retest data) + a **£250 Google Search test** (short-form = free accelerant; search = dialable read). Affiliate FROZEN.
- Supplements targeted 6–8 wk via **stock / private-label** closest formula (NOT custom: removes the stability wall); capital fronted ~£5,950 phased; keep close to the 4 actives.
- Social = founder-fronted dedicated accounts (locked): IG `@keith.antony.tech` (existing account; new `@keith.androprime` kept being auto-deactivated, changed 2026-07-19), YT `@keithandroprime`; public name "Keith Antony". Every post gets a compliance pre-flight (a founder account is not an ASA loophole).
- Track A launch copy + 15 short-form hooks drafted (in-palette markers only: testosterone/VitD/B12/ferritin/hs-CRP); pre-flight clean but **BLOCKED pending Ewa tone sign-off + lab-accreditation substantiation**. Quiz + first-party tracking must be verified before the £250 test runs. Backlog: `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`.

## Exploratory product ideas: Option 4 locked, rest exploratory

- **Locked:** Option 4 kit strategy (Keith 2026-05-08): all Kit 1 buyers get a result-mapped supplement offer regardless of result; founding-member becomes an elective opt-in layer, not a funnel gate. Brief: `kit-strategy-decision-brief-2026-05-08.md`.
- **Exploratory (not decided):** subscription-as-FM-entry (replace the retired deposit), Kit-1-specific supplement positioning, two-tier pricing (sub ~£39.95 vs one-time ~£65). Open: does FM access persist for one-time buyers; single vs differentiated SKUs; CQC-trigger redefinition if deposits retire.
- Compliance: never use "referral" in copy bridging supplement → TRT pathway (implies clinical referral); use "founding member / priority access." Ashwagandha silent-ingredient rule applies regardless of formulation.

## Vitall competitor pivot: directional decisions 2026-06-01

- **Refined read:** Vitall is a **B2B white-label / picks-and-shovels infra provider** wearing a consumer storefront (tiny organic footprint, zero paid search, partner-branded clone subdomains = the Vitall Sync model). The threat is **NOT demand capture** (men's SERP is wide open): it's that they could power a better-funded competitor on the same rails and act as **data landlord** over our customers' special-category data (they assert independent-controller status).
- **Keith's directional decisions:** (1) double down on the men's brand, the one defensible thing; (2) white-label their broad panel to capture margin **if** the wholesale quote allows ("their panel + the markers they don't carry": ApoB/homocysteine/insulin absent from both Vitall flagships = the Kit 3 Plus differentiator holds); (3) PT/affiliate is a price channel we lose on → dead midterm, taper don't hard-cut, mothball FirstPromoter for reuse; (4) build our own supply chain (~18 mo): contract kit/fulfilment + a reference lab directly. Ewa (GMC GP) = the "requesting clinician" asset that unlocks direct lab access.
- ⚠️ **Constraint, disintermediation is volume-gated:** Thriva declined us 20 Apr 2026 on volume (contact Sophia Schreiber), door open at scale. Serious labs (Thriva/TDL/Inuvi/Randox) gate on volume we lack pre-launch; Vitall's edge = no minimum-volume commitment. So we **stay on Vitall to launch** (don't burn the bridge), starve them of our differentiator + strategy, build brand + volume, then re-approach. Prime direct target = TDL (tier-1 Sonic, powers Medichecks, runs the metabolic markers).
- **Open:** supply-chain scoping doc; re-scope pending Ben feasibility drafts so we don't hand a competitor our differentiator. (The Vitall services agreement was executed 2026-06-02; the "stay on Vitall to launch" decision above is settled, not open.) Related: `05_partners` (Vitall correspondence), `06_marketing/affiliates` (PT taper). Consider a formal `competitive-landscape/` report for the competitive read.
