# Site + Funnel Working Model (current conflict-free strategy)

> **v2, 2026-08-27. Rewritten against the monitoring thesis.** v1 (2026-07-25, ratified) was
> written when the business was a kit business, and every surface in it had "convert to a kit"
> as its one job. `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` changed what
> the product is: *"The kit is how he gets his first numbers. The app is the product, and the
> app is what gets marketed."* v1 was therefore one thesis out of date, and the live homepage
> is built faithfully to it. **What v2 does NOT change: the routing split (broad through the
> quiz, hot-intent direct), the WTP instrument, and every compliance rail.** Those survive the
> thesis change intact. What it changes is what each surface is for. v1 is recoverable from git history.

---

## 1. The strategy in one line

**Give away the thinking. Sell the record.** (Keith, 2026-08-24, thesis section 10.1.)

A man does not know whether his problem is thyroid, vitamin D, testosterone or metabolic. He
wants to understand his numbers and watch them, so he can work out which question he is
actually asking before anyone sells him an answer. The free layer is the explanation: the
published articles, plus a demo account. The paid layer is the record: his own numbers, held
over time, against a clinically signed action cutoff, with a route out to a GP.

Layered on top, unchanged and still binding:

- **Conflict-free positioning** (`01_strategy/2026-07-22-conflict-free-positioning-decision.md`):
  (1) any result that needs a doctor goes to a GP and earns us nothing; (2) no result changes
  what we offer or what it costs.
- **Copy hierarchy (rail 2):** speed / no-GP hook earns the click, money honesty second. The
  sharp industry line ("no reason to sell you testosterone") is press and GEO only, never
  on-site hero.

## 1a. The three things, and why they are not competing

This is the distinction v1 did not have, and the one that resolves "what are we actually
selling":

| | What it is | When it is asked for |
| --- | --- | --- |
| **The app** | The differentiator, and the reason to buy anything | Marketed everywhere, sold nowhere |
| **The kit** | The on-ramp. How a record starts | The only thing a cold visitor can buy |
| **The membership** | How the app monetises | Offered once a result lands, inside 30 days |

**The app is what you market. The kit is what you sell. The membership is what you earn.**

The kit-first sequence is not a marketing preference, it is forced: the app cannot hold a
record until a first result exists. `01_strategy/2026-08-26-membership-offer-window.md` already
locked the consequence, and it binds every surface in this document: **membership cannot be
bought standalone, and no acquisition surface may sell it.** The "Before your first result"
paywall was deleted for exactly this reason. A surface that offers a membership to someone
with no result is selling an empty room.

## 1b. The cold-start constraint (thesis section 5)

A monitoring product compounds: its value at month 24 is obvious and its value at month 1 is a
promise, because a member with one data point has no trend at all.

**So no acquisition surface may lead on "watch your numbers move."** At the moment of purchase
there is nothing to watch, and a promise of future value is the weakest thing to put in a hero
from a brand with no track record.

What the site leads on instead is the one piece of app value that lands on a **single** result:
**the difference between having a number and understanding it.** The thesis nominates the
two-range card as the best day-one asset in the file for precisely this reason. It is app
value, it is deliverable on the first result, and it is a promise the kit keeps immediately.

The existing homepage section *"Your results are normal." That's not an answer.* is already
this argument. It is currently below the fold, underneath a convenience hero.

---

## 2. Surface roles (each surface has one job)

| Surface | Who lands here | The one job | Primary route | Conflict-free surfacing |
| --- | --- | --- | --- | --- |
| **Blog / organic** | Men with numbers they do not understand, no vertical chosen | **Do the understanding, then offer a baseline.** The front door under this thesis | Quiz (primary) or kit page | Article CTAs |
| **Homepage `/`** | Broad, brand, and undecided traffic | **Establish that the product is the record, and route the undecided** | Quiz (primary), Browse all tests (secondary) | Speed hero + money-honesty subline |
| **Demo account** | Anyone who wants to see the product before paying | Show the app populated, with zero ingestion and zero liability | Back to the quiz or a kit page | Sample data must be visibly sample data |
| **Landing pages `lp/*`** | Hot, single-intent paid-search traffic | Convert at the lowest CAC, zero added friction | Direct to on-page checkout (`#order`) | Intent-matched hero + one receipt line; NO quiz |
| **Quiz `/test-selector`** | Symptom-led and undecided | Route to the right kit AND capture WTP + buyer-profile | Result → kit page → checkout | Position strip; the WTP block (Section 4) |
| **`/kits` + kit pages** | Comparison and considered buyers | Convert | Kit page → checkout | Per-kit D+ receipt (CA-026) |
| **Short-form (Track A)** | Cold discovery | Drive to the quiz | Link-in-bio / DM → quiz | Symptom hooks; conflict-free stays the press/GEO line |

**Two changes from v1, and one addition.**

1. **The blog moves to the top of the table**, because under this thesis it is the front door
   rather than top-of-funnel education. Thesis section 4: the 17 existing articles and 125
   winnable sub-queries at a combined 58,990/mo are "the funnel, already partly built, aimed at
   the right people," and the doc notes this is currently written down in our own files as a
   negative. A man searching "what does FBC mean" or "how to read your blood test results"
   lands on an article, not on `/`. **The highest-leverage surface under this thesis is the
   article's next step, not the hero.**

2. **The homepage's job changes** from "establish the position" to "establish that the product
   is the record." The routing it performs is unchanged.

3. **The demo account is a surface, and it does not exist.** It was answered by Keith on
   2026-08-24 as half of the free layer and has no build behind it. See Section 5.

### The article's next step, and why it is not an uploader

The honest next step from an article is **not** "upload your NHS bloods." Those were a
different assay at an unknown time of day, so they cannot start a comparable series, and
offering to ingest them would make the record dishonest at row one. The next step is: **start
a baseline you can actually compare against.** That is the kit, and the reason it is the kit is
provenance rather than commerce.

### What no acquisition surface may do

- **Sell or price the membership.** It is not purchasable before a result exists.
- **Lead on the trend, the series, or "watch your number move."** Section 1b.
- **Imply clinical services are live**, or describe outputs as a GP-built or personalised
  report. `03_compliance/CONTEXT.md`, Phase 0 boundary and the Ewa clinical-governance line.
- **Mention ashwagandha KSM-66.** Anywhere, ever.

---

## 3. Routing model

```text
CONTENT / ORGANIC  (the front door under this thesis)
  "what does FBC mean" / "how to read blood test results" / "inflammation markers"
        │
        ▼
  ARTICLE  ·  does the understanding, free
        │
        ▼
  "start a baseline you can compare against"  →  quiz (or kit page direct)

BROAD / SYMPTOM / BRAND  ─────────────►  ROUTE THROUGH THE QUIZ
  Short-form (Track A) → link-in-bio / DM → quiz
  Homepage hero        → quiz
  Blog / organic       → quiz (or kit page)
        │
        ▼
  QUIZ  ·  3 symptom questions → recommended kit (name + why, NO price yet)
        │
        ▼
  ★ WTP + buyer-profile block  (un-priced, non-gating)
        │
        ▼
  price reveal + CTA → /kits/[slug] → checkout → Stripe

HOT / SINGLE-INTENT PAID SEARCH  ─────►  GO DIRECT (bypass quiz)
  Paid search ("testosterone test") → lp/testosterone → #order → checkout → Stripe

                    ▼  EVERYTHING MEETS AT CHECKOUT  ▼
        this document ends here; the journey continues in
        08_customer-journey/journey-spine.md
```

The split is unchanged from v1 and survives the thesis change: the quiz is the router for
people who do not know which kit they need, and forcing it on someone who searched a specific
test adds friction and raises CAC. The `lp/* → checkout` bypass is deliberate and correct.

**The second funnel starts where this one ends.** Acquisition sells a kit. The membership is
sold later, to the same man, by the app, in a 30-day window that opens when his result lands.
Neither this document nor `kit-purchase.md` owns that; the spine does.

---

## 4. The quiz as the strategic hinge

Unchanged from v1. The quiz does two jobs, and the second is why the routing matters.

**Job 1: router (built).** `components/marketing/TestSelectorQuiz.tsx`: 3 symptom questions map
to Kit 1 / Kit 2 / Kit 3, with Kit 3 as the default-up on genuine two-panel overlap. Result
routes to the kit page, not straight to checkout. Keep it.

**Job 2: the price-validation and buyer-profile capture (BUILT 2026-07-25, commit `03d4bd5`;
ClickUp `869e74w93` closed).** The Van Westendorp WTP block is the *only* planned source for
validating the £169 / £199 / £259 bundle price points (flagged load-bearing in
`01_strategy/ltv-cac-profitability-model-2026-07-21.md`, read at n roughly 50). It fires an
anonymous `quiz_wtp` event (submit and skip; skip rows are the denominator). Read the data
with:

```sql
select props->>'bundle_concept' bundle, props->>'age_band' age_band,
       (props->>'wtp_too_cheap')::numeric  too_cheap,
       (props->>'wtp_bargain')::numeric    bargain,
       (props->>'wtp_expensive')::numeric  expensive,
       (props->>'wtp_too_expensive')::numeric too_expensive
from public.events
where event_name = 'quiz_wtp' and (props->>'skipped')::boolean = false;
```

Filter non-monotonic rows at read time (a `monotonic` flag is precomputed per row). The block
is a temporary research instrument: retire or rework it once the n≈50 read is taken.

Placement inside the quiz flow, in this order:

1. The 3 symptom questions.
2. The recommended kit shown by name and reason, **price hidden**.
3. **The WTP + buyer-profile block**: the four Van Westendorp price-perception questions plus a
   short buyer-profile set. Framed as "two quick questions so we price this fairly for men like
   you." Soft and optional; it never blocks the kit CTA.
4. Price reveal + CTA to the kit page.

Two rules for the block:

- **Un-anchored.** Ask WTP before the customer sees our price. If the priced result card shows
  first, their answers just echo our number and the read is worthless.
- **Non-gating.** Same pattern as the existing optional email capture: the result and the buy
  path show regardless of whether they answer.

**Open under v2:** the WTP block prices *the bundle concept* (test now + retest later, one
order). The membership now also carries a retest, and the first-month decision of 2026-08-27
puts a month of membership inside the kit price. Whether the bundle concept and the membership
are now the same offer wearing two names is **unresolved**, and it is a live risk to the read.
Flagged, not answered here: it belongs with gap-analysis decision #5.

---

## 5. Build vs model: what needs to change

| Item | Current build | Model | Owner / gate |
| --- | --- | --- | --- |
| **Homepage hero argument** | Kit hero: "Know your numbers in days. Five minutes at home." Speed, convenience, postage | **Should establish the record**: the difference between having a number and understanding it (Section 1b). The *"Your results are normal." That's not an answer.* block already carries the argument and is below the fold | **Keith, open.** Copy work, then compliance pre-flight |
| **Article next-step CTAs** | Mixed. Audited 2026-08-12: some route to the quiz, some to a kit page, some prose-only | Standardise on "start a baseline you can compare against" → quiz or kit page. Highest leverage change in this document | Copy; `06_marketing` owns the articles |
| **Demo account** | **Does not exist** | Half of the free layer, answered by Keith 2026-08-24. Populated app, sample data, zero ingestion | Build + compliance read on sample-data labelling |
| Homepage hero primary CTA | Quiz primary, kits secondary, how-it-works tertiary | As built | **Done 2026-07-25**, commit `03d4bd5`. (`07_sales/STATE.md` recorded this as still pending until 2026-08-27; corrected) |
| WTP + buyer-profile block | Built per Section 4 | As built, but see the open bundle/membership collision above | ClickUp `869e74w93` closed |
| Landing pages `lp/*` | Hero → `#order` direct checkout | Unchanged (correct); add one conflict-free receipt line if missing | Copy check |
| Track A landing spec | Reframed 2026-07-26 to the cold/short-form quiz destination | As reframed | Ewa gate 2 still open on the copy |
| seq-06 Quiz Nurture | RUNNING (CIO campaign 9, live 2026-07-26) | As built | Done |
| **Marketing site vs app design language** | Marketing site is 4px slab borders, black-on-white, uppercase black sans. The app is being rebuilt to hairline rules, mono numerals, dark mode | **Unresolved.** If the app moves and the site does not, a man crosses a visible product boundary at login, on the exact journey this thesis says is the business | **Keith, open.** Gates the redesign scope |
| `kit-purchase.md` | Pre-strategy routing assumptions in its acquisition half | Point its acquisition half here; keep its post-checkout half | Housekeeping |

---

## 6. The desired results this produces

- **The record is what gets marketed**, so the differentiator is visible before purchase rather
  than after it, which is the whole point of the demo and the free article layer.
- **Routed AOV.** Undecided traffic through the quiz gets the Kit 3 default-up.
- **The pricing read.** Quiz volume at n roughly 50 gives the Van Westendorp data that unblocks
  the £169 / £199 / £259 reprice decision (a Gate 0B / bundle-launch input). No other source is
  planned.
- **Position where it belongs.** Conflict-free leads on the brand surfaces (blog, homepage,
  quiz, kit pages) and stays low-friction on the hot-intent surfaces.
- **Clean measurement.** Broad traffic through one router; hot traffic on intent-matched LPs.
  The two paths stay separable in analytics.

---

## 7. Source-of-truth pointers

- **Thesis:** `01_strategy/2026-08-24-vertical-agnostic-monitoring-thesis.md` (what the product
  is; sections 4, 5 and 10.1 are the ones this document is built on).
- **The offer window:** `01_strategy/2026-08-26-membership-offer-window.md` (why no acquisition
  surface may sell the membership).
- **The rest of the journey:** `08_customer-journey/journey-spine.md`, which owns every stage
  from checkout onward and names the doc that owns each one.
- Positioning: `01_strategy/2026-07-22-conflict-free-positioning-decision.md` + CA-026 wording
  pack `02_brand/2026-07-22-conflict-free-wording-pack.md`.
- Compliance rails: `03_compliance/CONTEXT.md` (read before any copy written from this doc).
- Post-checkout kit funnel: `07_sales/funnel/kit-purchase.md` (valid from checkout onward).
- Quiz build: `09_website-app/frontend/components/marketing/TestSelectorQuiz.tsx` +
  `app/(marketing)/test-selector/`.
- Landing pages: `09_website-app/frontend/app/lp/*`.
- WTP intent: ClickUp `869e74w93`; `01_strategy/ltv-cac-profitability-model-2026-07-21.md`.
- Short-form path: `06_marketing/content/track-a-launch-copy.md`.
