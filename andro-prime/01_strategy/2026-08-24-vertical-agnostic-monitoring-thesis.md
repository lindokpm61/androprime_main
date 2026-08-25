# Decision: Andro Prime is the pre-vertical monitoring layer

**Date:** 2026-08-24 | **Decided by:** Keith, **2026-08-25** | **Status:** 🟢 **ADOPTED.** The app is the product, the kit is the way in, supplements become a member-priced shop. Adopted on inference rather than measurement, with the falsifier in section 8 recorded so it stays testable.

**Adopted with these settled** (sections 10 and 11): £47/month VAT-inclusive-ready · one included test event a year, day 90 first cycle then annual · entitlement is a membership benefit tied to a stated date, never a credit · no ingestion of external results · web app only · free layer is the published articles plus a demo · the daily loop does not carry the price and is built last.

**What it unblocks:** the Nutribl stock order and the label artwork, both of which were explicitly held pending this decision, plus the compliance, solicitor and accountant queues in section 11.

**What it reverses:** partially reverses the 2026-08-22 "supplements lead the funnel" decision. Supplements remain a marketing entry; the kit becomes the first purchase and the app becomes the product. **Decision sweep run 2026-08-25.**

**Read with:** `2026-07-22-conflict-free-positioning-decision.md` (the parent position, which this extends rather than replaces), `competitive-landscape/2026-07-20-uk-testing-competitor-teardown.md` (the refutation this must be distinguished from), `2026-08-24-can-we-sell-four-kits-a-month.md` (the distribution constraint), `../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` (the build inventory), `../04_products/results-engine/thresholds.md` (the two-range mechanic in section 3).

---

## 1. The proposition

Every meaningful UK competitor monetises by routing the customer into a **vertical**: TRT, ED, GLP-1, thyroid. The blood test is the on-ramp and the treatment is the business. That structure means none of them can sell a product whose entire value is **not having chosen a vertical yet**, because for them an undecided customer is an unmonetised one.

Andro Prime's proposition is the layer that sits before that fork:

> **A man does not know whether his problem is thyroid, vitamin D, testosterone or metabolic. He wants to understand his numbers and watch them, so he can work out which question he is actually asking, before anyone sells him an answer.**

The kit is how he gets his first numbers. **The app is the product**, and the app is what gets marketed. Supplements demote to a member-priced shop, which is what Function and Superpower both actually do.

## 2. Why this is not the thesis that was refuted on 2026-07-20

This distinction is load-bearing. A future reader will otherwise assume this doc re-litigates a dead claim.

The 2026-07-20 teardown refuted **"nobody owns interpretation plus longitudinal tracking plus trust."** That is a claim about **capability**, and it was correctly killed: Thriva owns the triad, Forth largely does.

This is a claim about **commitment**. Not "we can build a better dashboard" but "we have not picked a vertical, and they have." Capability can be copied. Commitment cannot be un-picked without abandoning the revenue that pays for the company.

Checked brand by brand against the teardown's own table:

| Brand | Vertical it monetises | Agnostic? |
|---|---|---|
| Numan | TRT ~£74.50/mo, ED meds | No |
| Voy | TRT from £99/mo, GLP-1 | No |
| Manual | TRT | No |
| Hims UK | ED, hypogonadism | No |
| **Thriva** | **GLP-1 programme (Wegovy/Mounjaro)** | **No, and this is recent** |
| Medichecks | GLP-1 monitoring, no prescribing | Partly |
| **Forth** | None. No prescribing at all | **Yes** |

Six of seven are vertical-committed. **Thriva, the brand that killed the v1 thesis, has since picked a vertical.** It cannot credibly claim indifference to the answer while running a weight-loss drug programme.

**The honest counter-example is Forth**, not Thriva: dashboard, track-over-time, doctor comments on out-of-range results, no prescribing, from £40. Forth is genuinely agnostic on capability. It is *positioned* as a lab that sells kits, not as a monitoring layer, and it has not made the claim. That is a positioning gap, not a capability gap, and positioning gaps close faster than build gaps. **Forth is the brand to watch: it is two decisions away from being us.**

## 3. The concrete mechanic: two ranges on one screen

The thesis is not abstract. It is already implemented in the results engine and can be shown on a single card.

Vitall's male reference range for total testosterone is **8.64 to 29.00 nmol/L**. Our low cut is **12**, and everything below it routes to a GP. `thresholds.md` annotates that gap in one line: *"Deliberately different at the low end (the whole test-led thesis)."*

So a man at 10.5 nmol/L is **in range** by his lab and **low** by us. The Society for Endocrinology / ACB 2023 position statement gives the distinction its name in five words: **"action cutoffs, not reference ranges."** A reference range answers where 95% of men sit. An action cutoff answers below what number someone should do something. Almost nobody explains that difference to a customer.

**The ruling this doc proposes: show both ranges, on every marker, always.** Where ours is stricter, say so and cite why.

Three reasons it cannot be otherwise:

1. **The lab range cannot be hidden.** It is returned with every result (Ben's instruction is explicit: do not hardcode, always use the returned range), the customer has a right of access to it under UK GDPR, and the app's own design principle is gate the interpretation, never the numbers.
2. **Hiding it is the exact criticism we exist to refuse.** "Moving the goalposts" is the Imperial endocrinologist's published charge against private clinics. Calling a man low without showing that his lab called him in range is that charge, committed invisibly.
3. **It is already mandatory.** The 12 nmol/L figure is BSSM 2023 and carries a recorded ASA substantiation exposure, so the citation has to be on the screen regardless. Once it is, showing the lab range costs nothing and buys the whole argument.

Per-marker there are three relationships, and `thresholds.md` already knows which is which:

| Relationship | Markers | What the card shows |
|---|---|---|
| **Deliberately stricter than the assay** | Testosterone (12 vs 8.64), Active B12 (NG239 25/70 vs assay 37.5), Ferritin (30 vs classic 15) | Both ranges, the disagreement, and the citation |
| **Effectively identical** | Vitamin D (low below 50, against a range starting at 50) | One range. The agreement is itself reassuring |
| **Assay-driven, no fixed number of ours** | SHBG, Free Testosterone (per Ewa's ruling 7) | The returned range only |

## 4. What this does to the all-clear member

The prior framing treated a member with nothing wrong as a design gap to be patched. That was the supplement-membership framing leaking through: if the product is supplements, a well man has nothing to buy.

> 🔴 **CORRECTED 2026-08-25 (Keith). An earlier version of this section called the all-clear member "the core customer" and treated him as the majority. Both claims rested on the 93% figure corrected in section 6, and neither survives.**
>
> **"Normal" is a property of a panel, not of a person.** A single-vertical test comes back clear far more often than an agnostic one, which is the whole reason Numan needs "fear nothing" framing. Our own share is **unknown and currently unmeasurable** at three orders; it needs roughly thirty results. Statistically it sits in the 60s on nine markers, pushed up by our partly-derived markers and down by a self-selected symptomatic buyer.
>
> **The centre of gravity is therefore the man with one or two things flagged across an agnostic panel**, not the man with nothing. The all-clear member is a case the product must serve, not the case it is built around, and the original five-screen mockup flow was closer to right than the reframe of it.

He still needs designing for: he has a complete baseline, nothing to act on, the longest retention runway (he is never routed out to a GP), and the only product that makes his numbers mean anything is one that sees them again.

**And the panel-breadth argument runs BOTH ways, which the earlier draft missed.**

**In favour of the agnostic panel:** each marker flags about 5% of well men by construction, because reference intervals are conventionally the central 95% of a reference population. Testosterone alone is roughly three independent dimensions and finds something in about one man in five; nine markers across two axes finds something in more than one in three. **Testing one thing is how you miss it.** That is an argument for breadth, and it is the product argument the pre-vertical thesis rests on.

| Markers | Chance a well man flags something |
|---|---|
| 3 (testosterone axis, independent dimensions) | 14% |
| 5 (Kit 1) | 23% |
| 9 (Kit 3) | 37% |
| 14 (plus Kit 3 Plus metabolic) | 51% |
| 17 (plus Kit 5 thyroid) | 58% |
| 21 (Numan) | 66% |

**Against it:** Numan ran the other version of this. Their "fear nothing" test is 21 markers with a refund if everything is normal, and **the ASA found only 4 to 10% of users qualified**, alongside a ruling that the advertising was misleading.

**The line between the two is not the marker count. It is who decided.**

| | |
|---|---|
| ✅ **Chosen** | A separate panel a man elects because he has a question he cannot answer. This is the pre-vertical thesis working: he does not know whether it is thyroid or metabolic, so he tests the next axis |
| ❌ **Bundled** | Markers added to a single test he did not ask about, so that more people flag and more people can be sold something. The incumbent playbook |

By 17 markers our detection rate is in Numan's territory, and at that point **the only thing separating us from them is whether the customer asked for the test.** That is the discipline, and it has to be written into how panels are sold rather than assumed.

**The roadmap this licenses already exists** and is locked (`../04_products/CONTEXT.md`, sequence locked 2026-05-27): **Kit 3 Plus** metabolic add-on (HbA1c, fasting insulin, ApoB, homocysteine, lipids, deferred post-launch), then **Kit 5 Thyroid** at T+6 to 8 weeks, then **Kit 6 Cortisol** parked pending Vitall confirming dried-blood-spot viability. Kit 5's anchor term `private thyroid test` is 880 volume at **keyword difficulty 11**, and Kit 5 **has no spec doc**. Note that the two softest SEO targets in the whole file, KD 11 here and KD 6 on the interpretation head term, both sit on the pre-vertical side of the range rather than the testosterone side.

**Alongside breadth, monetise movement.** An in-range marker drifting across two tests is genuinely interesting, is not a diagnostic claim, is not manufactured by widening, and is unavailable from anyone selling a single test.

## 5. Evidence for

- **No kit-only model closes.** Blended kit-only LTV is ~£88 against paid CAC of £193 to £654. The recurring layer taking LTV to ~£241 is the only thing that makes any paid channel arguable. The app is not an addition to the business, it is the condition for there being one. (⚠️ The "roughly quadruples LTV" phrasing in `2026-08-24-can-we-sell-four-kits-a-month.md` section 5 does not reconcile with £88 to £241, which is 2.7x. Fix before relying on it.)
- **The structural claim survives its own data** (section 2). Six of seven competitors are vertical-committed, including the one that refuted the v1 thesis.
- **The mechanism is already built.** The Confirmation bundle is shipped and Ewa-signed (2026-07-26), gated behind `BUNDLES_ENABLED`. The two-range mechanic is already in `thresholds.md`. `biomarker_values`, `symptom_answers` and `qualifier_responses` all exist.
- **The build gap is smaller than the gap analysis states.** That analysis rated the membership "Large" while sizing a membership that *carries supplements*: stock, credit ledger, dispatch table, 3PL. Demote supplements to a member-priced shop and nearly every heavy item stops being membership infrastructure.
- **Subscriptions are not the problem, opaque ones are.** Thriva's £45 draws no complaint cluster. Numan's does, and the complaints are surprise charges and buried recurring orders, plus an ASA ruling.

## 6. Evidence against, and what is simply unverified

Recorded at full strength, because a thesis argued only from its supporting evidence is not yet a decision.

- **Zero category retention evidence exists.** The claim that Thriva has a substantial retest cohort was tested and **refuted 0-3**. This thesis rests on retention that nobody in this market has demonstrated.
- **The reason the space is empty may be that it does not monetise.** The vertical is where the margin is. Agnostic means monetising attention, either via subscription margin (needs the retention that has no evidence) or via repeat testing (which the category's most clinically conservative player publicly refuses as not clinically appropriate).
- **The mass motive is reassurance, not tracking.** Verified: Numan's positive reviews centre on ease, speed and human help, and **no source shows positive reviews centring on dashboard or tracking features despite Numan actively marketing one.** Thriva's tracking subscription is real but self-selecting, so Thriva evidence overstates tracking demand for the category.
- **The pre-vertical buyer has never been sized.** The mainstream research binarised the motive as reassurance versus tracking. "Something is wrong and I do not know which thing it is" is a third motive that was never measured separately. It is the ICP this entire thesis is built on and there is no number for it.
- **Our own all-clear rate is unknown and currently unmeasurable.** Plausibly in the 60s to low 70s on Kit 3 against a symptomatic population, but with three orders on the books it cannot be measured. It needs roughly 30 results to mean anything.
- **Price is unresolved.** The mockup assumes £49/month. The gap analysis concluded that without a daily loop or a clinician, this is realistically a £19 to £29 product in the UK.
- **The 93% correction.** Earlier strategy discussion cited "~93% all-clear." That is a **non-referral** rate (Medichecks refers ~7% to a GP), not an all-clear rate. The research file's body carries the warning that non-referral does not equal a normal result and its executive summary drops it. Do not re-cite 93% as an all-clear figure.

## 7. What it changes

| Decision | Effect |
|---|---|
| **2026-08-22, supplements lead the funnel** | **Partially reversed.** Supplements stay a marketing entry and become a member-priced shop; the kit becomes the first purchase and the app becomes the product. Needs the sweep |
| **2026-07-22, conflict-free positioning** | **Extended, not replaced.** Conflict-free explains why we can be trusted; pre-vertical explains what we are for. The two-range card is conflict-free made concrete |
| **2026-07-20, "the results brain is table stakes"** | **Re-scoped, not overruled.** That assessed capability; this asserts commitment |
| **`09_website-app/docs/2026-08-23-supplement-shop-front-spec.md`** | Superseded in direction. Technical findings stand |

## 8. Falsifier

Recorded so it gets tested rather than forgotten.

**If the quiz motive question shows that buyers who cannot name their suspected problem are a negligible share of respondents, the thesis is wrong**, and the correct read is that the category really is reassurance-first. In that case the kit is the product and the app is a retention tool priced accordingly, at £19 to £29 rather than £49.

The instrument already exists in section 6.6 of the mainstream-buyer research: the motive question ("peace of mind / a baseline to track / an answer to a symptom / ammunition for my GP"), the Van Westendorp block, and "would you rather prepay a retest bundle or subscribe?". **It has never been fielded.** One option needs adding to the motive question: *"I have symptoms and I do not know what is causing them."* That option is the thesis.

## 9. Open questions, in the order they block work

The two structural ones are section 10 items 1 and 2. Neither has been addressed anywhere in the repo, and each changes what gets built.

| # | Question | Blocks |
|---|---|---|
| 1 | ~~Is there a free tier?~~ **ANSWERED 2026-08-24: content plus a demo, never a data tier.** See 10.1 | Closed |
| 2 | ~~Do we accept results from other providers?~~ **ANSWERED 2026-08-24: no.** See 10.2 | Closed. Provenance is the asset; cross-assay trends are artefacts |
| 3 | ~~Web app or native?~~ **DECIDED 2026-08-24: web app.** See 10.1a | Closed. No store commission, and no install step in the funnel |
| 4 | ~~Membership price~~ **DECIDED 2026-08-24: £47/month, VAT-inclusive-ready.** See section 11 | Closed |
| 5 | ~~What the membership includes~~ **DECIDED 2026-08-24: both legs open.** See section 11 | Closed |
| 6 | **Whether the app-led read is adopted at all** | The Nutribl stock order and the label artwork commission. **The only one left** |

## 10. Review pass: what the thesis does not yet answer

Written as a deliberate second pass against section 1, not as supporting material.

### 1. The free layer is content plus a demo (ANSWERED 2026-08-24, Keith)

The strategy is "market the app," but the app is only reachable by buying a kit, so the thing being marketed sat behind a £99 to £179 paywall. **Resolved: the free layer is the content that already exists, plus a demo account. It is not a product tier and it never ingests customer data.**

**Give away the thinking. Sell the record.**

- **Free: the explanation.** Eighteen articles are already published and already carry the argument. `myth-of-normal-range.mdx` states it outright in its own FAQ: *"The NHS testosterone reference range, roughly 8 to 29 nmol/L, is a statistical band, not a health band. Within range means you're not clinically ill. It doesn't mean you're well."* That is the two-range case from section 3, free, indexed, and matched to the interpretation traffic. `how-to-read-blood-test-results.mdx` is the entry point.
- **Free: a demo.** A login showing the app populated with a sample result, so the marketing has something to point at other than a checkout. Zero ingestion, zero liability, and it removes the only real argument for a genuine free tier (that you cannot market a product nobody can see).
- **Paid: the record.** Your own numbers, held over time, against a clinically signed action cutoff, with a route out to a GP. That requires our kit, for the provenance reason in section 10.2 rather than a commercial one.

**Consequence for the funnel, and it is a better story than an uploader.** A man arrives with NHS bloods he does not understand. The article explains what "in range" does and does not mean. The honest next step is not "upload them," because they were a different assay at an unknown time of day. It is "start a baseline you can actually compare against." The content does the understanding, the kit does the measuring, the app holds the series.

### 1a. Web app, not native (DECIDED 2026-08-24, Keith)

**No native app, no app store.** Store commission of 15 to 30% on the recurring line would break the margin the whole model is built on, and Keith has ruled it out.

Second-order benefit worth recording: a web app is reachable by URL, so there is **no install step between an article and the product.** Under a thesis whose funnel is interpretation content, an app-store install sitting between the two would be the single worst place to put friction.

**The accepted cost, recorded so it is not rediscovered as a surprise: Apple Health is permanently unreachable.** HealthKit is native-iOS only with no web API, and Google's equivalent (Health Connect, after the Fit REST API was wound down) is likewise native-only. So the step and sleep data already sitting in a member's phone cannot be read. A thin native companion built purely for sync would probably not attract store commission, since that applies to digital goods sold inside the app, but Apple has been aggressive on adjacent cases and no strategy should rest on it.

**What a web backend CAN reach, over ordinary server-side OAuth:** Oura, Whoop, Fitbit, Garmin and Withings. That covers ring and watch owners, who are precisely the tracking-minded minority Thriva's evidence tells us self-selects. Aggregators (Terra, Vital, Rook) collapse five integrations into one for a fee; premature at zero users, though Vital is worth remembering because it spans wearables and lab ordering.

**Build none of it yet.** The load-bearing input is whether he took the capsule, which no wearable knows and which is a tap by nature. Add one integration when members ask, chosen by what they actually own, which the quiz can establish.

### 1b. Log only what connects to the marker (2026-08-25)

A design rule that came out of the same question and is easy to get wrong. The mockup's check-in row originally asked for the capsule, sleep, sun and steps. **Sleep and steps do not move vitamin D.** They were there because they read as healthy.

Asking a member to report data the product cannot act on is the fastest way to kill a logging habit, and the rule is therefore: **the daily inputs are scoped to the marker being moved.** For vitamin D that is the capsule, daylight, and the symptom that sent him for the test. A member moving ferritin sees different inputs. This keeps the loop to three taps without a rule about three taps, because the marker does the scoping.

One compliance rail attaches: a member may log a symptom and see his own trend, but **the app must never connect the two for him.** "Your energy improved because your vitamin D rose" is a per-customer interpretation and is post-CQC. Show both lines, say nothing about the relationship.

### 2. Provider-agnostic is NOT the endpoint of vertical-agnostic (corrected 2026-08-24, Keith)

**An earlier draft of this section claimed that accepting results from any provider is the logical endpoint of the vertical-agnostic thesis, and that this cannibalises the kit. That was wrong on the first half, and the correction resolves the second.**

**They are independent axes.** Vertical-agnostic means we do not route you into TRT, ED or GLP-1. Provider-agnostic means we chart numbers we did not produce. Nothing connects them: Thriva accepts external results (manual entry) while being firmly vertical-committed. You can hold the entire pre-vertical position while charting only your own data.

**And ingesting arbitrary results is bad on its own merits, not merely expensive.**

- **Provenance is the whole asset.** The defensible claim is a *governed* series. A number typed in from a photo has no assay identity, no collection time, no chain of custody. Charting it and applying our action cutoff to it means interpreting a result we did not produce, from an assay we do not know.
- **Testosterone makes this concrete.** It has strong diurnal variation and requires a morning sample. A total testosterone figure from an unknown time of day is not comparable to ours at all, and it is the marker the brand leads on.
- **Cross-assay comparison is not valid.** Vitall's male range is 8.64 to 29.00; another lab's is different because the assay is different. A trend drawn across two assays is an artefact, and we would be drawing conclusions from it.
- **Every parse error is a health-data error**, which is the worst category to be wrong in, and the input space (NHS printouts, PDFs, photos, portals) is unbounded.
- **It is not a moat anyway.** Thriva already does it, and the 2026-07-20 teardown assessed it as "a feature, not a moat, and it fights Thriva on home turf."

**The refusal is a positioning asset, not a limitation.** *We only chart what we can stand behind* is a stronger conflict-free statement than accepting everything, and it is clinically true rather than commercially convenient.

**Defensible middle, if any of it is wanted later:** let a member *store* an external PDF or note against their timeline as a file, explicitly uninterpreted and excluded from the trend. Low cost, no liability, no pollution of the series. It is a filing cabinet, not an input.

**Recommendation: do not ingest external results.** Say why, out loud, as part of the position.

### 3. Testosterone is the marker least able to demonstrate the app

The brand is Andro Prime, the spearhead claim is testosterone, and the app's value proposition is "watch your number move."

**Testosterone does not move on wellness supplements.** That is already recorded in the strategy file as the reason Kit 1 is not a prove-it bundle, with an efficacy-claim risk attached. The markers that do move in 8 to 16 weeks are vitamin D, active B12, hs-CRP and ferritin, which is Kit 2.

So the brand's lead marker is the one that will show a flat line, and the markers that demonstrate the product are on the kit with less brand pull. That is not fatal, but it means the marketing hook and the retention mechanism point at different kits, and nobody has reconciled them.

### 4. The existing traffic is wrong for a kit business and right for this one

`2026-08-24-can-we-sell-four-kits-a-month.md` records 17 ranked keywords, best position 18, and concludes the traffic is "the wrong traffic, not merely too little of it," because the terms are informational blood-test-interpretation queries and we do not sell an FBC panel.

**Under this thesis that conclusion inverts.** "How to read your blood test results" (590/mo, our best position at 18), "inflammation markers" (2,900/mo) and five variants of "what does FBC mean" are people who have numbers they do not understand and have not chosen a vertical. That is the ICP, described exactly.

The same doc records 125 winnable sub-queries across the 17 existing articles at a combined 58,990/mo, achievable by re-optimisation rather than new writing. Under a kit thesis that is a slow SEO play against commercial terms we do not rank for. Under this thesis it is the funnel, already partly built, aimed at the right people. **This is the strongest unclaimed argument in favour, and it is currently written down as a negative.**

### 5. The cold-start problem: the product is weakest exactly when it must convert

A monitoring product compounds. Its value at month 24 is obvious and its value at month 1 is a promise, because a member with one data point has no trend at all. You are asking for £49 a month against value that arrives later, from a brand with no track record, in a category with no retention evidence.

Every comparator solves this with something that delivers on day one: ZOE with a daily loop, Function and Superpower with a human. We can currently sell neither. The two-range card in section 3 is the best day-one asset in the file precisely because it delivers meaning on a single result, and it should probably be treated as the answer to this problem rather than as a compliance nicety.

### 6. The longitudinal series depends on a supplier we do not control

A trend requires assay continuity. If Vitall changes assay, changes lab, alters a reference range or the relationship ends, historical values stop being strictly comparable and the core asset degrades. A one-off kit seller does not carry this risk; a monitoring product does, and it grows with the length of the series.

This deserves a line in the Vitall agreement (notice of assay or reference-range changes) and it is cheap to ask for now, expensive to discover later. It also connects to the data-landlord concern already recorded in the conflict-free decision.

### 7. The free substitute is now very good

The nearest competitor for "help me understand my blood test" is not Thriva, it is a general-purpose AI assistant, and it is free, instant and unembarrassing. That substitute did not meaningfully exist when the category formed.

What it cannot do is hold a governed longitudinal series, apply a clinically signed-off action cutoff, or route a red flag to a GP. Those are the defensible legs and the positioning should name them explicitly rather than assume the comparison is against other kit brands.

### 8. Clinical copy surface scales with this thesis, and Ewa does not

Every marker, every band, every trend state and every two-range explanation is copy that a GP has to sign. `thresholds.md` already carries wording confirmations outstanding, and the zinc question has been sitting unsent in drafts. The monitoring product multiplies the surface that requires sign-off while the signing capacity stays one part-time GP.

This is an operational constraint on how fast the thesis can ship, and it argues for launching a small, fully-signed marker set rather than the full nine at once.

### 9. The boundary gets closer, not further away

A product that watches trends and tells a man when something has moved is nearer to a health service than one that sells a test and reports a number. The gap analysis already flags that a club bundling testing and supplements "edges toward a health-service proposition" and needs a compliance read before it is a pricing decision. Under this thesis that read becomes more urgent, not less.

The framing that survives is the existing one: we never say what it is, we show what moved and route red flags to a GP. The product as drawn respects this. **The pitch as currently spoken does not.** "Understand and monitor your data so you can decide whether it is thyroid, vitamin D, testosterone or GLP-1" is a differential-diagnosis framing and must not become a headline without a compliance read. The compliant form keeps the strategic force and drops the diagnostic claim: *see what your numbers are doing before you commit to anything.*

---

## 11. The membership: contents, price and cadence (Keith, 2026-08-24)

### What it is, in one line

**ZOE sells behaviour change. Bioniq sells a bespoke formula. Function and Superpower sell comprehensiveness. We sell certainty and clarity: knowing where you stand, and whether it is moving.**

That is the customer-facing form of the pre-vertical thesis, and it is the articulation to build the copy around. It is also why ZOE is the wrong benchmark: ZOE's photograph returns an instant score because they own a scoring model, which is a coaching product. The shape-matched comparators are Function (USD 365/yr, about £24/month equivalent) and Superpower (USD 199/yr, about £13), both annual-prepay, both with a care team, both US and VC-subsidised.

### Both legs open, with one of them in a restricted form

| Leg | Status | Note |
|---|---|---|
| **Daily habit loop** | ✅ **Included.** Tables exist (`symptom_answers`, `qualifier_responses`), mockup drawn, zero regulatory exposure | Not built |
| **Clinical answers** | ⚠️ **Included in the PUBLISHED-ANSWER form only** | Already budgeted at £150/mo |
| Member-priced supplement shop | ✅ Included | Not a supplement subscription |
| The record, held and explained | ✅ The core | Requires our kits, per 10.2 |

**The daily loop's design constraint.** It cannot return a health score today, so it must not try. The honest shape is the one the mockup already states: *"the chart is about behaviour, not blood."* We score adherence to the one thing the member said he would change, and **the retest is the payoff.** Retention therefore depends entirely on the retest being dated, certain and included; without that the loop decays around week three.

**The clinical leg's hard boundary, and it is not about who answers.** `03_compliance/CONTEXT.md`, sourced to `clinical-governance-position.md` (Ewa-approved 2026-05-22), is explicit: Ewa approves the recommendation *logic*, she does **not** review or interpret any individual customer's results, and there are to be **no per-customer add-ons or bespoke interpretations**. Substituting a different qualified professional does not move that line, because **the regulated thing is the act, not the person.** A tailored answer about an individual's own numbers is per-customer interpretation and it is post-CQC.

**The form that works, and it is already in the model:** a member submits a question, a qualified professional answers it **generally and publicly**, and every member sees the answer. Health information rather than clinical advice. The 90-day model already carries "Clinician content, 2 answers a month, £150" in fixed costs, so this leg is already funded; it is currently filed as content rather than sold as a benefit.

**Never call it:** a care team, your doctor, a consultation, a review, or anything implying someone looked at your results. Needs a compliance read before it appears on a pricing page. Three practical items: who the clinician is (Ewa is already a bottleneck, so probably a second contracted person), what their indemnity covers for published general answers, and the framing sign-off.

### Price: £47 a month, VAT-inclusive-ready

**The sticker is £47, not £39 and not £49.**

| Sticker | Net of 20% VAT |
|---|---|
| £39 | £32.50 |
| £46.80 | £39.00 |
| **£47** | **£39.17** |
| £49 | £40.83 |

The reasoning is **price stability, not revenue now**. The VAT registration threshold is £90,000 of taxable turnover on a rolling 12 months, and the year-1 base case at £55,362 sits under it (only the strong case at £110,724 crosses, around month 9). So below the threshold the full £47 is retained, and on crossing it the sticker never has to change. Pricing at £39 and later adding VAT would force either a visible 20% rise to £46.80 or absorbing a 17% cut to the recurring line.

**The cost, held consciously:** £47 is a 20% higher ask at the day-30 screen, which the 90-day model names as the single highest-variance number in the business. This is a judgement, not a measurement.

**And price was the wrong lever to argue about.** The year-1 forecast's own conclusion: *"What decides which column you land in is not conversion, churn or price. It is how many kits you sell."* The acquisition ramp moves the year-one answer by about £53,000; price moves it by about £9,000 across its whole range; churn by about £3,000.

**Consider annual prepay**, which is what both shape-matched comparators do. £470/year reads as £39/month, pulls twelve months of cash forward, and removes twelve separate churn decisions, which matters more than anything else in a category with zero retention evidence.

### Cadence: ONE included test event per year

**The day-90 retest is a first-cycle onboarding event, not the standing cadence.**

The financial and clinical answers agree here. At one test event a year (£58.50) a £47 sticker is roughly 87% gross and the model works; the mockup's own note sets the floor at *"below about £39 the test cost eats the model."* At a retest every 90 days it is four events a year, £234 against £564, and gross collapses to about 58% at £47 and worse below that. **No price fixes a quarterly cadence.**

Clinically it points the same way: a quarterly retest cadence is exactly what the BMJ criticised Numan for against RCPath minimum retesting intervals, and a baseline plus one confirmation or 6-to-12-month retest sits inside defensible practice.

The year-1 forecast already assumes one retest per year and is on the right side of this. **The mockup is not, and its day-90 cycle needs an explicit decision: onboarding event, or standing cadence.**

### The entitlement model: a benefit, never a credit (Keith, 2026-08-24)

**Keith's objection, and it is right:** "membership includes one kit a year" is an entitlement earned over twelve months but cancellable at any time. A member who pays three months, leaves, and comes back believing he is still owed a kit is a dispute, a chargeback and a one-star review about a subscription trap, which is exactly the complaint cluster we position against.

**The money risk is small; the ambiguity risk is not.** At £47 against a £58.50 test event:

| Member leaves after | Paid | Net after the kit |
|---|---|---|
| 1 month | £47 | **−£12** |
| 2 months | £94 | +£34 |
| 3 months | £141 | +£80 |
| 12 months | £564 | +£503 |

Only a month-one redemption loses money. The real exposure is legal: under the Consumer Rights Act terms must be transparent and fair, and **ambiguity is construed against the drafter**, so a vague entitlement is lost by default.

**The fix is a change of object, not of arithmetic.** Two descriptions of the same commercial outcome behave completely differently:

| Framing | Consequence |
|---|---|
| ❌ *"You have £99 of credit and it expires"* | A thing the member owns. Balance-sheet liability, a ledger to build, an expiry term that is challengeable as unfair, and a genuinely arguable dispute at cancellation |
| ✅ *"Membership includes your retest on its scheduled date"* | A benefit of being a member. Nothing owed to a non-member, no liability, no expiry to defend, and the condition is a date the member has been looking at for months |

**Gym logic, not gift-voucher logic.** Entitlement is conditional on being an active member on the stated date. The upgrade path survives intact: *put your included retest toward a larger panel and pay the difference*, which keeps the commercial virtue that section 9a of the economics doc was written for (gross rises with every upgrade) without ever creating an owned balance.

**This deletes two items from the build:** the credit ledger (was rated Medium) and open decision 6 on credit expiry and rollover. Both existed only because the benefit was modelled as a credit. Struck in `../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md`; economics section 9a amended in framing, with its arithmetic left standing.

**Cadence that falls out of it:** first retest at **day 90** as the onboarding proof event, with three payments already collected before it costs anything, then **annual thereafter on a stated date**. This also answers the clinical objection: a retest attached to a membership actively held is defensible, where a fixed annual testing schedule is the schedule-driven cadence the BMJ criticised at Numan.

**Still needs a solicitor** on the terms wording, and it must be prominent at the point of sale rather than in the T&Cs. Numan's ASA ruling (A22-1153049) was for burying the subscription, and this is the same trap.

### VAT: corrected, and still an accountant question

🔴 **A live assumption was probably backwards.** Three docs recorded that "most supplements are zero-rated in the UK." **UK food supplements (vitamins, minerals and similar) are generally STANDARD-RATED at 20%**, specifically excluded from food zero-rating, and gummies would be standard-rated as confectionery in any case. Corrected in `../04_products/supplements/supplement-unit-economics-2026-08-24.md`, `../10_launch-ops/2026-08-24-supplement-membership-gap-analysis.md` and `financial-model/2026-08-24-membership-year-1-forecast.md`. Any margin line assuming a zero-rated revenue line carries a 20% error.

**Also note: exempt is worse than zero-rated.** An exempt supply (the medical-care route for diagnostic testing) blocks recovery of input VAT on related costs, so "it might be exempt" is not the good outcome it reads as.

**Two questions for an accountant, in writing, and they are worth more than further modelling:**

1. How is the membership supply characterised: standard-rated digital subscription, exempt medical care, or a mixed supply requiring apportionment?
2. Are the three launch supplement SKUs standard-rated?

Answer 2 **before the first Nutribl order**, since it changes the member-price maths.

---

**Method note.** Competitor commitments are read from `competitive-landscape/2026-07-20-uk-testing-competitor-teardown.md`. Retention, motive and ASA figures are from `research/2026-07-20-mainstream-buyer-deep-research.md` (19 sources, 3-vote adversarial verification, 17 confirmed / 8 refuted); the 93% correction is against that file's own body caveat. Ranges, bands and marker composition are read from `../09_website-app/frontend/lib/results/classifier.ts`, `../09_website-app/frontend/lib/results/types.ts` and `../04_products/results-engine/thresholds.md`. Traffic and keyword figures are from `2026-08-24-can-we-sell-four-kits-a-month.md` (DataForSEO, 2026-08-24). The 1 minus 0.95^n calculation is arithmetic from the standard central-95% reference-interval convention, not a sourced clinical figure, and our own markers are not fully independent (FAI and Free T are derived), so the 37% figure for nine markers is an upper bound.
