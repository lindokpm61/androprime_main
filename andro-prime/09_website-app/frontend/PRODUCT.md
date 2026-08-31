# Product

<!-- impeccable:product-schema 1 -->

> **Scope.** This file is the durable product record for the Andro Prime web app and site. It is
> written for design tooling that needs product truth before it may judge a surface. It is NOT a
> source of truth: everything here is sourced from the numbered workspaces, which own it. Where the
> two ever disagree, the workspace wins and this file is stale. Citations are given so that can be
> checked rather than trusted.
>
> Written 2026-08-31 from `01_strategy`, `04_products`, `07_sales`, `02_brand` and `03_compliance`,
> plus three answers from Keith recorded inline.

## Platform

web

## Users

UK men, broadly 35 to 55, who have symptoms or concerns and no clear answer. Three are served and
one is deliberately not.

- **ICP 1, the Symptomatic Achiever.** Fatigue, low libido, brain fog, loss of drive. His GP ran a
  test and said "normal". He does not feel normal. Served by Kit 1.
- **ICP 2, the Proactive Optimiser.** Training hard and not recovering. Energy dips, persistent
  soreness, joints worse than two years ago. Served by Kit 2.
- **ICP 3.** Wants the whole picture in one test rather than guessing which single marker to check.
  Served by Kit 3. Has no viable Phase 0 search channel of its own, so it is reached through the
  funnel rather than through acquisition.
- **ICP 4, the High-Performance Seeker.** Wants a comprehensive optimisation panel including thyroid,
  metabolic and cardiovascular. **There is no product for him and kit copy must not speak to him.**
  A waitlist hook is the only permitted surface.

The situation that defines the job: **he does not yet know which question he is asking.** He cannot
tell whether the problem is thyroid, vitamin D, testosterone or metabolic, and every competitor wants
to answer that question by routing him into a vertical.

Source: `04_products/icp-kit-supplement-alignment-april2026.md`, the primary authority for copy and
UX decisions.

## Product Purpose

Give a man his own numbers, explain what they mean in plain English, and hold them over time so he
can see whether they are moving, without anyone selling him a treatment on the way.

**The funnel, in the words of its own model:**

> **"The app is what you market. The kit is what you sell. The membership is what you earn."**
> `07_sales/funnel/site-funnel-model.md` v2, 2026-08-27

- **Free, the explanation.** Published articles plus a demo account showing the app populated with a
  sample result. Zero customer-data ingestion, zero liability. This is the marketing layer.
- **Paid, the measurement.** The kits. This is the sell.
- **Earned, the record.** The membership: his own numbers held over time against a clinically signed
  action cutoff, with a route out to a GP.

Thesis form: **"Give away the thinking. Sell the record."**
Source: `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` §1 and §10.1.

Success is a man who understands his result well enough to know which question to ask next, and who
comes back to retest.

## Positioning

**The layer that sits before the fork.** Every meaningful UK competitor monetises by routing the
customer into a vertical: TRT, ED, GLP-1, thyroid. The blood test is the on-ramp and the treatment is
the business. None of them can sell a product whose entire value is *not having chosen a vertical
yet*, because to them an undecided customer is an unmonetised one.

Customer-facing articulation, Keith 2026-08-24:

> ZOE sells behaviour change. Bioniq sells a bespoke formula. Function and Superpower sell
> comprehensiveness. **We sell certainty and clarity: knowing where you stand, and whether it is
> moving.**

**The brand lead is conflict-free, and the record is its proof** (Keith, ruling A2, 2026-08-30). Two
constraints follow and both are binding on any surface:

1. **"Market the app" is not licence to LEAD on the app.** Leading on interpretation plus tracking
   plus trust competes on ground already owned by Thriva, and the 2026-07-20 teardown refuted it.
   **What a rival cannot copy is what the app visibly refuses to do. Demonstrate it; do not open
   on it.**
2. **The company describes itself as a men's health company**, not a wellness brand (ruling B,
   2026-08-30).

The conflict-free mechanic, stated as a receipt rather than a claim: a result that needs a doctor
goes to a GP and earns Andro Prime nothing, and no result changes what is offered or what it costs.

Sources: `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` §1,
`01_strategy/2026-08-30-brand-lead-after-the-monitoring-thesis.md` §6.

## Operating Context

The visitor typically arrives from an interpretation article, not from an advert, and often already
holds a set of NHS bloods he does not understand. The article does the understanding; the kit does
the measuring; the app holds the series.

**The sequence is forced, not preferred.** The app cannot hold a record until a first result exists,
so a kit purchase must precede membership. Consequence, locked
(`01_strategy/2026-08-26-membership-offer-window.md`): **membership cannot be bought standalone and
no acquisition surface may sell it.** A surface offering membership to someone with no result is
selling an empty room. Membership is offered once a result lands, inside 30 days.

Collection is a finger-prick at home, posted back in a prepaid envelope. Results arrive in 2 to 5
working days in a private dashboard. No GP appointment, no referral.

🔴 **Open decision, recorded rather than invented (2026-08-31).** The exact front door for a new
visitor is unsettled. The repo's most recent written entry (2026-07-08) makes Kit 3 the quiz default
and taker of direct traffic; Keith has said that is out of date, and the operative frame is the
funnel model above. **The live homepage still leads on kits, which the funnel model names as a known
lag that closes when the page is rebuilt, not a decision.** Do not treat any current page's entry
behaviour as intended.

## Capabilities and Constraints

**The range.** Three at-home blood test kits, one price each, no subscription required.

| Kit | Price | Markers |
|---|---|---|
| Kit 1, Testosterone Health Check | £99 | Total T, SHBG, FAI, Albumin, Free T |
| Kit 2, Energy & Recovery Check | £119 | Vitamin D, Active B12, hs-CRP, Ferritin |
| Kit 3, Hormone & Recovery Check | £179 | All nine of the above |

Marker sets and prices have single sources in code: `lib/kits/panel.ts` and `lib/pricing.ts`. Do not
hand-write either onto a surface.

**Hard product constraints, all of which outrank design and copy goals:**

- **Phase 0 is wellness mode.** TRT, peptides and any regulated clinical service are **not
  available** and must not be implied. Clinical mode is post-CQC and not live.
- **No diagnose, treat or cure language.** ASA and EFSA rules bind every external surface.
- **Ashwagandha is in the Daily Stack formulation and has no approved EFSA claim.** It must never be
  named in any copy anywhere.
- **Free Androgen Index is report-only.** Ewa ruled it not banded in men
  (`04_products/results-engine/thresholds.md` item 8). It renders a value and no verdict, and no
  coloured bar, because a coloured bar is a verdict. Any framing that makes FAI a stand-in for free
  testosterone in men is retracted copy.
- **Status colour is fenced.** It appears only on range-bar fills and status dots inside a results or
  sample-report panel. A coloured bar anywhere else is a bug.
- **No per-customer interpretation.** Ewa approves the recommendation *logic*; she does not review or
  interpret any individual's results. A tailored answer about an individual's own numbers is
  regulated and post-CQC.
- **Per-kit copy frames are fixed** (`icp-kit-supplement-alignment-april2026.md` §9). Kit 1 is "find
  out where your testosterone stands", never "find out why you're tired", because that scenario is
  the documented failure mode. Kit 2 must not claim anything about testosterone. Kit 3 is "9 markers.
  Hormones, energy, recovery, inflammation", never "comprehensive health MOT".

**Terminology.** Customer-facing status words come from the results engine's own vocabulary
(`components/results-engine/StatusBadge.tsx`): In range, Monitor, Action needed, Not interpreted.
Normal / Borderline / Low is a vocabulary the product uses nowhere and a pre-flight has already
caught it once.

## Brand Commitments

- **Voice, non-negotiable.** The pub test: would Keith say this to a friend in a pub? Plain English,
  never clinical ("knackered all the time", not "suboptimal energy levels"). Data first, never
  aspirational or motivational, no wellness fluff. Results copy says "your results indicate", never
  "you have".
- **No em dashes**, in any external-facing writing at all, including partner and customer email.
- **The founders are real and named.** Keith Antony, founder, whose personal brand is a product
  feature. Dr Ewa Lindo, GMC-registered Medical Director, who signs off all results report copy.
  Their quotes are attributed speech, carried verbatim, and are not a redraw's to tighten.
- **The approved visual direction is Direction F**, chosen by Keith from six on 2026-08-27. Its
  authority is `design/mockups/directions/F-field.html` and the implementation is
  `styles/components/f-primitives.css`. Recorded here as a product-level commitment because it was a
  ruling, not a preference. Visual specifics belong in DESIGN.md, not this file.
- **Typeface is ruled:** a serif display over a humanist sans (Keith, 2026-08-30).

## Evidence on Hand

**Real, and usable:**

- **UKAS ISO 15189 accredited laboratory.** Turnaround is "2 to 5 working days", the wording
  confirmed in writing by the lab partner. Do not advertise an hours-based SLA.
- **A GMC-registered Medical Director**, Dr Ewa Lindo, who approves the recommendation logic and
  results report copy.
- **Two attributed founder quotes**, from Keith and Ewa, carried verbatim on `/kits/hormone-recovery`.
- **Eighteen published interpretation articles**, which carry the argument the funnel depends on.
  `how-to-read-blood-test-results.mdx` is the entry point and `myth-of-normal-range.mdx` states the
  two-range case outright.
- **A demo account** showing the app populated with a sample result.
- **Sample report values** on the kit pages are illustrative but engine-true: each row is what the
  results engine would actually return for that value, and its state is derived rather than chosen.

🔴 **Absent, and must never be fabricated** (confirmed by Keith, 2026-08-31):

- **No customer testimonials, reviews, ratings or star counts.**
- **No case studies.**
- **No customer numbers, sales figures or "X men tested" claims.**
- **No press mentions or logo walls.**
- **No real photography of Keith or of the kit.** The approved direction uses photography in its
  bento cells; the built pages carry none, and none may be invented or substituted with stock
  standing in for a real subject.
- **No dispatch cutoff time.** Pages say "dispatched same day" and state no cutoff anywhere, so a
  countdown or a "order within" device would be inventing an operational promise.

## Product Principles

1. **Conflict-free is the lead, and the record is its proof.** Demonstrate what the product refuses
   to do. Never open on the app itself.
2. **The customer has not chosen a question yet.** Copy that assumes he knows whether it is
   testosterone or vitamin D is copy written for someone else. Precision about what a kit can and
   cannot tell him is the product, not a caveat on it.
3. **Give away the thinking, sell the record.** Explanation is free and ungated. The measurement and
   the series are what is paid for.
4. **Compliance outranks persuasion, always.** Where a copy, product, sales or marketing goal
   conflicts with a compliance rule, the compliance rule wins. This is not a tie-break, it is an
   ordering.
5. **Say what the number means, then say what it does not.** "In range" means not clinically ill; it
   does not mean well. That distinction is the whole proposition and it must survive every
   compression.

## Accessibility & Inclusion

**WCAG 2.2 AA is the standard, held as a target rather than a release gate** (Keith, 2026-08-31).
Deviations are recorded rather than blocking, and belong in `09_website-app/STATE.md`.

Two audience facts make this more than boilerplate: the readership skews 40 and above, where
presbyopia is near-universal, and small mono type at 10 to 11.5px is a signature of the approved
visual direction. That pairing is where the standard actually bites.

🟠 **Known open deviation (2026-08-31):** `.f-spec-k` renders `--ink-3` on `--sunk` at 10px for
4.1:1, under the 4.5:1 floor, on 12 instances. The direction's own token comment defines `--ink-3` as
the "floor for functional text" at 4.99:1 **on paper**, so the defect is the pairing, not the token.
