# Research → Feature Gap Analysis

**Date:** 2026-07-17
**Inputs:** `01_strategy/research/2026-07-17-reddit-quora-unmet-needs.md` (+ its addendum) and `09_website-app/docs/reddit-quora-application-unmet-needs-analysis-2026-07-17.md`
**Method:** each ranked need from both reports checked against the live application (`frontend/`), not against the plan docs.
**Owner workspace:** `09_website-app`

This document does not restate the research. It answers one question: **given what the app actually does today, what should we build?**

> **Working addendum 2026-07-17 — "assume both markers are delivered."** Keith asked what unlocks *now* if we take it as given that Ferritin and Albumin ARE returned in the payload (pending the 14 July end-to-end test confirming it). That analysis is the **"If both markers are delivered" section** near the end of this doc. The P0 section immediately below is preserved as the standing verification task; read the two together.

---

## P0 — the contract says we buy Ferritin. The API says we don't receive it.

**This outranks every feature below and should be resolved before any of them are scoped.**

> **Revised 2026-07-17 after reading the signed contract.** An earlier draft of this section called this a mis-advertising exposure. **That was wrong, and in the wrong direction.** The executed agreement contracts Ferritin explicitly. The exposure is commercial, not advertising: we may be **paying for a marker we are not receiving**.

### The contradiction

**Schedule 1 of the executed services agreement** (`05_partners/labs/vitall/signed-services-agreement-2026-06-02.md`, signed by both parties 2026-06-02, PDF governs):

| Kit | Markers (contracted) | Partner cost |
|---|---|---|
| Andro Prime Hormone Check (Kit 1) | Free Testosterone, **Albumin & SHBG**, Testosterone | £58.50 |
| Andro Prime Energy & Metabolism (Kit 2) | Vitamin D, CRP, Active B12, **Ferritin** | £63.00 |
| Andro Prime Combo Test (Kit 3) | Vit D, CRP, Free T, **Albumin & SHBG**, Testosterone, Active B12, **Ferritin** | £98.00 |

**Vitall `GET /tests`, pulled 2026-06-22** (`09_website-app/CONTEXT.md`):

| Kit | shortCode | Markers the API enumerates |
|---|---|---|
| Kit 1 | `andro-prime-hormone-check` | Free Androgen Index, Free Testosterone, SHBG, Testosterone |
| Kit 2 | `andro-prime-energy-metabolism` | Vitamin D, C-reactive Protein, Vitamin B12 (Active) |
| Kit 3 | `andro-prime-combo-test` | union of the above (7) |

…with the parenthetical *"Albumin/Ferritin are in `NAME_MAP` but in none of the 3 kits (dead entries)."*

**Ferritin is in the contract at £63.00 for Kit 2 and £98.00 for Kit 3. It is not in the API's panel list.** `04_products/CONTEXT.md` carries Kit 2 COGS at exactly £63.00, so we are being invoiced for the four-marker panel.

### Splitting the two markers — they are different problems

**Albumin: probably fine, and probably a display problem.** Ben confirmed in writing on 2026-04-30: *"albumin is measured and used in the calculation."* The contract bundles it as a single **"Albumin & SHBG"** line. So albumin is almost certainly **measured as an input to the Vermeulen Free T calculation but not returned as a standalone reportable result** — which is exactly what the API shows (SHBG and Free T come back; Albumin doesn't). That is a legitimate assay design and the £58.50 buys what it says.

The problem is that `/kits/testosterone` advertises Albumin as a **displayed marker with its own card**, renders a mocked **"Albumin 42.0 g/L Normal"** value, and explains *"Testing it allows accurate calculation of your Free Testosterone."* The explanation is true. The card we cannot populate is the issue. **Confirm whether Albumin appears in the results payload; if it doesn't, the kit page needs the card removed and the copy reframed to "measured and used to calculate your Free T" rather than "here is your Albumin number."**

**Ferritin: the real question, and it is worth money.** The contract names Ferritin as a discrete marker, distinct from any calculation input. There is no bundling story to explain it away. Either:

1. **The `/tests` enumeration is a loose summary, not an authoritative analyte list.** There is real support for this: the same note admits *"`/tests` returns names only, no units; live units for Vit D / CRP / B12 (Active) still unconfirmed"*, and the naming is demonstrably loose on both sides — the contract says "Albumin & SHBG" while the API returns "Sex Hormone Binding Globulin" *plus* a "Free Androgen Index" the contract never mentions. If contract-naming and API-naming don't reconcile for Kit 1, the Ferritin absence may be nothing.
2. **The account shortCode config does not match the contract** → we are paying £63.00/£98.00 for a four/seven-marker panel and receiving three/seven-minus-one. That is a per-order overpayment on every Kit 2 and Kit 3 sold, plus a dead classifier.

**Reading 2 is the one that costs money on every order.** Note the COGS is the tell: we are billed for the panel the contract describes.

### What is built behind it either way

- `lib/results/classifier.ts` — four Ewa-signed-off ferritin bands (`<30` low, `30–100` suboptimal, `100–300` normal, `>300` high), dated 2026-06-16.
- `lib/results/biomarker-copy.ts` — full Ewa-approved copy for all four ferritin states.
- `lib/results/processResult.ts` — reads Ferritin, gates `low_ferritin` on CA-018 consent.
- `lib/results/fixtures/low-ferritin.ts` — a GP-block test scenario.
- `04_products/kits/kit-2-energy-recovery-check.md` — threshold table, GP-referral rule, *"Affects ~10–15% of Kit 2 buyers"*, and an owed *"Ferritin GP letter template"*.

If reading 2 is correct, all of that is dead code against a paid-for marker, and Kit 2 is sold as four markers while delivering three.

### What evidence we actually have (and what we don't)

Checked 2026-07-17. The honest state is that **no real Vitall result has ever come back**, so nothing empirically settles this yet.

- **The "front half" is proven; the back half is not.** `vitall-negotiation-log.md`: a real live-site purchase auto-created and dispatched an order on 2026-06-25 (`vitall_order_id=322942444`). That proves order → dispatch. It does **not** prove results: the `results-available` webhook — the one that actually carries the markers — has never fired with real data.
- **The mock test payloads include Ferritin and Albumin, but we wrote them ourselves.** `frontend/scripts/e2e/test-vitall-webhook.ts` posts Kit 1/2/3 payloads containing Ferritin (24.0, 68.0) and Albumin (43.0). These are **hand-authored fixtures**, built from the contract/spec to prove our normaliser *can* handle those markers. They are not Vitall output and prove nothing about what Vitall sends. The `dump-vitall-tests.ts` comment is explicit that its whole purpose was to get the truth "instead of guessing from demo results."
- **The only real Vitall signal we hold is `GET /tests` (2026-06-22), and it omits both markers.** That catalogue pull is what built `normaliser.ts`'s `NAME_MAP`, and it lists Energy & Metabolism as Vitamin D / C-reactive Protein / Vitamin B12 (Active) only — no Ferritin, no Albumin.

So the picture is: contract says 4, website says 4, our own mock data says 4, and the single piece of genuine Vitall data says 3. The tie-breaker — a real results payload — does not exist yet.

**The resolution is already in motion.** The 14 July end-to-end test (`correspondence/2026-07-14-keith-sample-kits-process-test.md`) exists to run real samples through the full pipeline before launch, and Ben has agreed to it via the real client-fulfilment path. **When those results come back, the answer is in the payload:** check whether Ferritin and Albumin appear, and confirm the live units for Vit D / CRP / B12 at the same time (also still unconfirmed). That single run settles the panel question empirically — the written answer from Ben below is the belt-and-braces version, not a substitute.

### Action

**Email Ben and ask for the exact analyte list returned for each of the three shortCodes, in writing, naming Ferritin and Albumin specifically.** Frame it against Schedule 1 — the contract is the leverage here, not a query. Ask in the same email:

1. Is Ferritin returned as a reportable result on `andro-prime-energy-metabolism` and `andro-prime-combo-test`? If not, why are we billed the Schedule 1 price?
2. Is Albumin returned as a reportable result, or measured only as a Free T calculation input?
3. What are the live units for Vitamin D, CRP and Active B12? (Still unconfirmed, and needed regardless.)
4. What is the QNS / rejected-sample rate on our kits? (Needed for F2 and for Gate 0B.)

That is one email covering the panel question, the units gap, and the QNS number. **It is the highest-value single action in this document.**

**Related contractual obligation worth checking in the same pass:** §3.14.6 requires us to reference Vitall as the Testing Services provider on relevant product pages with a link to `https://vitall.co.uk/terms`, and §3.14.7 requires patient-facing claims about tests and their clinical meaning to be consistent with Vitall-approved wording (they supplied an approved-wording pack on 22 May). Our ferritin explainer copy on `/kits/energy-recovery` is a patient-facing claim about a test. It should be checked against that pack regardless of how the panel question resolves.

### What this means for the research (pending the payload)

Both reports lean hard on ferritin, so their ferritin-dependent recommendations are **conditional on the panel question resolving in our favour** — not confirmed, not dead, just unverified until the real result lands:

- The strategy doc's **Theme 5** ("Ferritin is the most emotionally charged marker in the corpus", 98-upvote top comment) recommends enriching the low-ferritin GP-referral card. **If Ferritin is returned, this is actionable. If not, the card cannot render and the recommendation is inert.** Do not build on it until the payload confirms.
- The **addendum A1** claims the 1,404-upvote brain-fog post validates Kit 2 because *"the two markers that solved his problem are two of our four."* **That holds only if Ferritin is in the panel.** If it isn't, only vitamin D is ours (his root causes were ferritin at 22 and vitamin D at 19), and Kit 2 catches one of his two, not two.
- The application doc's **Theme 5** proposes a GP handoff pack partly on the strength of the ferritin cohort. The feature survives on other evidence regardless; the ferritin citation is the part that is conditional.

Either way, the *market* signal is robust — ferritin demand is real, with a documented 98-upvote grievance about GPs dismissing it. So there are two clean outcomes: **if the payload has Ferritin, the built-and-waiting card is validated by real demand; if it doesn't, this becomes an argument to add Ferritin to the panel** (route to `04_products` for panel composition and Ben on feasibility — ferritin is generally fine on the postal finger-prick model, unlike Mg/K per the haemolysis constraint). There is no outcome where the research was wrong about the market; the only open question is whether we currently deliver the marker.

---

## What already exists (so we don't rebuild it)

The research recommends several things we have, which changes the shape of the work:

| Research asks for | Status in the live app |
|---|---|
| Longitudinal tracker | **Designed, not built.** `docs/mockups/tracker-v1-*.html` — 4 mockups, 8 scenarios, sparkline + threshold-crossing rules. `STATE.md`: *"All tracker display logic is frontend-only — the DB already holds everything; the gap is the display layer."* Queued M3–M4. |
| Result → Explain → Educate → Recommend → Convert | **Live.** `lib/results/`, enforced, never leads with Convert. |
| Never cross-sell off a clinical signal | **Live.** GP hard-blocks on hs-CRP >10 and low ferritin; low-T → GP referral, no upsell. |
| Named GP over algorithm | **Live.** `lib/authors.ts`, GMC 4758565, verified, `sameAs` to the GMC register. |
| Don't lead with "AI insights" | **Already true.** No AI framing on the dashboard. Keep it that way — Theme 6 says it is a *negative* trigger. |
| Recommendation logic versioned + auditable | **Live.** Version-locked consent (`lowtNurtureConsent.ts`), classifier regression suite, Ewa sign-off dates in code comments. |
| Health data not sold; EU residency | **Live.** Supabase Ireland, CA-018 consent gating, fail-closed helper. |

**The single biggest lever is that the tracker is already designed.** The research's #1 finding (a 3-year-unresolved market gap) meets a spec that is sitting in `docs/mockups/` waiting on an M3–M4 slot. That is not a build-from-scratch decision; it is a **scheduling** decision.

---

## Ranked feature recommendations

### F1 — Pull Tracker v1 forward from M3–M4 (highest leverage)

**Need:** Strategy Theme 1 (214-comment thread, unresolved 3 years, *"just going to go with Google Sheets"*); App doc rank 2 (13/37, "proof that changes worked").
**Today:** Designed, queued post-launch, DB already holds the data.
**Gap:** `Sparkline.tsx`, `TrendBadge.tsx`, `timeline_events` table.

The strategy doc argues the tracker is the one asset a £29 Voy kit structurally cannot copy, because the moat is owning the series rather than the draw. The app doc independently reaches the same place via the proof loop. Two reports, different methods, same conclusion.

**Do not build it all.** Ship the read-only slice first:

1. `Sparkline.tsx` + `TrendBadge.tsx` over existing result rows — no new capture, no new schema.
2. "What changed since last time" on the second result. This alone answers *"the number just sits there."*
3. Defer `timeline_events` (supplement/lifestyle overlay) to v2. It needs the Ewa conversation `STATE.md` already flags (trend-classifier algorithm, retest-date calc, supplement-event schema) and it is the expensive half.

**Honest caveat, carried from the research:** every voice in the 214-comment thread is a quantified-self power user. The gap is real; that *our* buyer wants it is Medium confidence. The read-only slice is the cheap way to find out, and the app doc's own validation plan (interview 5–10 less technical UK men) should run alongside rather than after.

**Blocked on:** nothing. This is schedulable now.

---

### F2 — Sample-confidence panel + a QNS recovery path

**Need:** Strategy Theme 4 (*"a total waste of effort"*, £20–40 nurse draw is the market's answer); App doc rank 4 (11/37).
**Today:** **Nothing.** No sample-quality surface. Vitall `sample-issue` is handled out-of-band like `order-cancelled` — an ops alert, not a customer journey.
**Gap:** the whole thing.

A £99–£179 kit that yields no result is a refund, a bad review, and a lost customer. We have no in-app answer.

Minimum viable version:

1. Surface collection date, lab status, and sample quality on the result.
2. A **no-friction replacement path** when a sample is rejected — this is the one that protects revenue and reviews.
3. State plainly why finger-prick is appropriate for these analytes. We have a genuinely strong, non-marketing answer available (the haemolysis reasoning in `04_products/CONTEXT.md`), and Theme 6 says provenance beats claims. Avoid "clinically accurate".

**Blocked on:** the QNS/rejected-sample rate from Ben. Both research docs flag that we do not have this number and that it is not in the Gate 0B economics. **Get the number first** — it sizes the feature and may reveal it is P0 rather than P1.

---

### F3 — GP handoff pack

**Need:** Strategy Theme 5 + App doc rank 5 (9/37); the tracker-tool thread lists *"share your progress privately with a doctor"* as a headline feature.
**Today:** GP-referral CTA is live with genuinely good copy (*"Take your ferritin number and the reference range to your appointment"* — already the right instinct). But there is **no export**. The referral is a dead end: we tell him to go, and hand him nothing to take.
**Gap:** a PDF containing identity, collection method/date, lab + UKAS accreditation, results with reference ranges, trend, and questions to ask.

This is the highest-value item that is *pure advocacy and makes no clinical claim*. It also converts the GP referral from a loss (we route him away with nothing) into the moment he trusts us most.

Note `04_products/kits/kit-2-energy-recovery-check.md` already owes a *"Ferritin GP letter template"* that was never built. Generalise it rather than building the ferritin-specific one — especially since (see P0) the ferritin card cannot currently fire.

**Blocked on:** Ewa + `/03_compliance` sign-off on wording before it ships. Non-negotiable. The line between "advocacy" and "diagnosis" is exactly what she owns.

---

### F4 — Account data controls (export + deletion)

**Need:** Strategy Theme 6 (privacy unprompted in 3 threads, *"you definitely shouldn't be hosting peoples medical records like this"*); App doc rank 7.
**Today:** I read `app/(app)/account/page.tsx` — **there is no export, no deletion, no data-use explanation.** The page has no such surface at all.
**Gap:** all of it.

This is the cheapest credibility win available. We already have the substance — Ireland residency, consent gating, no data sale, a named GMC-registered GP. We just don't *say* it or *give* it anywhere the customer can see. Meanwhile a UK GDPR right-to-erasure request currently has no self-service route.

1. Plain-English "how your health data is used, and that we do not sell it".
2. PDF + CSV export (shares the F3 renderer).
3. Account + health-data deletion.

**Blocked on:** nothing technical. Deletion semantics need a compliance read (retention vs erasure against the lab record).

---

### F5 — "What this test did not tell you"

**Need:** App doc Theme 1 (*"an immediate cross-sell can feel like an upsell unless the knowledge gap is made explicit"*); Strategy Theme 6 (*"turn around and sell your health info… to try to sell you supplements"* — our model described as an accusation).
**Today:** The Kit 1 → Kit 2 cross-sell is live and **unconditional** on a normal-T result (2026-07-08 complement rule).
**Gap:** a normal-T man is shown a cross-sell with no stated reason why his fatigue might still be unexplained.

This is small, cheap, and directly defuses the upsell objection. It is also already the documented rule in `04_products/CONTEXT.md` ("Kit 1 copy scope" — *"the correct frame is: find out if testosterone is the cause"*, and the negative-review scenario it names is precisely this). **We have the rule; the dashboard doesn't implement its spirit.**

One paragraph: *"Kit 1 tested testosterone. Your result is in range, so testosterone is unlikely to be the cause. It did not test Vitamin D, B12 or inflammation, which are the other common explanations."* Then the Kit 2 card reads as honest rather than as a sale.

**Blocked on:** copy through `/03_compliance` pre-flight.

---

### F6 — Result triage summary

**Need:** App doc rank 6 (7/37, "results that inform without causing panic").
**Today:** `biomarker-copy.ts` is careful and well-written per marker, but there is no whole-result verdict above the cards.
**Gap:** a three-state banner — needs prompt follow-up / worth discussing / in range.

Lower priority than F1–F5: our copy is already unusually good and we do not do alarm-colour-without-context. But on a Kit 3 (9 markers) the man has no top-line read.

**Blocked on:** Ewa — a whole-result verdict is closer to clinical territory than a per-marker card and must not become an implied diagnosis.

---

## Deliberately not recommended

- **AI results chat.** Both docs say it: commodity, and Theme 6 shows the target cohort *actively avoids* AI-reads-your-bloods products. We have the better asset (a named GP) and should not dilute it.
- **Gamification/streaks.** Answers neither "do I feel better" nor "did my numbers move".
- **Partner-buys-for-him flow.** n=1 (azorCH). Note only.
- **"Bring your own bloods" (upload an external PDF).** Genuinely interesting — it decouples us from the commodity assay and is what InsideTracker paywalled to resentment. But it imports someone else's sample quality into our results engine and puts Ewa's name next to a number we did not produce. **Ewa question before it is a product question.** Park until F1 ships.

---

## Which surface does each feature touch? (the tracker is not most of this)

The most common way to misread this document is to assume these features go "on the tracker." They do not. There are **two distinct surfaces**, and almost everything attaches to the one that is already live.

- **The single-result dashboard — LIVE.** `/results-dashboard`, built from `lib/results/` (`MarkerCard.tsx` + Ewa-approved `biomarker-copy.ts`). It renders the cards for one result set when it arrives. Deployed and working today.
- **The tracker — MOCKUP ONLY.** `docs/mockups/tracker-v1-*.html`. Its job is showing **multiple results over time** (sparklines, trends, "what changed"). Not built.

| Feature | Surface | Build type |
|---|---|---|
| U1 low-ferritin advocacy card | **Live dashboard** | Enhance an existing card |
| U2 suboptimal-ferritin actionable card | **Live dashboard** | Wire an existing copy state to an existing card |
| F5 "what this test didn't tell you" | **Live dashboard** | Enhance |
| F2 sample-confidence panel | **Live dashboard** | New, on a live surface |
| F3 GP handoff pack | **Live dashboard + account** | New, on live surfaces |
| F4 account data controls | **Live account page** | New, on a live surface |
| U4 Albumin "measured not estimated" | **Live marketing page** `/kits/testosterone` | Copy change |
| U5 Kit 2 foreground ferritin | **Live marketing page** `/kits/energy-recovery` | Copy change |
| F6 result triage summary | **Live dashboard** | New, on a live surface |
| **U3 / F1 tracker** | **The tracker (mockup)** | New surface — the only true net-new build |

**So: everything except U3/F1 sits on surfaces that already exist.** The ferritin work (U1, U2) enhances cards that already render. None of it requires building the tracker, and none of it is "put on the tracker."

### Why the tracker is genuinely later, not just unbuilt

The tracker shows change *over time*, which needs a customer to hold **two results**. At pre-launch volume nobody has retested, so the tracker would have no data to display for months — until customers return for a second kit. Every single-result feature (U1, U2, F5, F3, F2, F6) fires on the **first** result, which is the only kind that exists right now.

That reframes U3 honestly: "ferritin is the tracker's hero marker" is an argument for **why the tracker is worth building later**, not a now-item. It is removed from the now-list. When the tracker is built, its cheap first slice is still "what changed since last time" (F1) — but that slice is inert until a second result exists, so it is correctly sequenced after launch, after the first retests land.

---

## Suggested sequence

All "Now" and "Next" items sit on **live surfaces** (single-result dashboard, account, marketing pages). The tracker is the only new surface and is correctly last, because it has no data until customers retest.

| Phase | Items | Surface | Blocked on |
|---|---|---|---|
| **Now** | P0 ferritin/albumin verification | — | The 14 Jul end-to-end test result + written confirmation from Ben |
| **Now** | F4 data controls · F5 "what this didn't test" | Live account / dashboard | Compliance read only |
| **Now (if markers confirmed)** | U2 suboptimal-ferritin card | Live dashboard | Copy + band already exist; near-free |
| **Next** | F3 GP handoff + U1 low-ferritin advocacy card | Live dashboard + account | Ewa wording sign-off |
| **Next** | U4 Albumin claim · U5 Kit 2 ferritin lead | Live marketing pages | Verify Voy (U4) + compliance |
| **After the number** | F2 sample-confidence + QNS path | Live dashboard | Vitall QNS rate |
| **Later (post-launch, data-gated)** | F1 tracker read-only slice, then v2 overlay · F6 triage | **Tracker (new build)** | Needs a second result to exist; + Ewa (trend algorithm, whole-result verdict) |

**The single highest-value action is finishing the 14 July end-to-end test with real sample kits.** When the real `results-available` payload comes back it settles four things at once: whether Ferritin is delivered (P0), whether Albumin is delivered, the live units for Vit D / CRP / B12 (unconfirmed), and — via the same kits — the QNS/rejected-sample rate (F2, Gate 0B). The written email to Ben is the belt-and-braces confirmation and the commercial-leverage record; the test is what actually answers it. Both point at the same person, so fold them into one exchange.

---

## If both markers are delivered — what unlocks now

*This section assumes the 14 July end-to-end test confirms Ferritin and Albumin arrive in the `results-available` payload (Albumin as a displayed value, not only a Free T calculation input). Under that assumption, P0 dissolves and the picture changes as follows.*

### The one thing that changes everything: the low-ferritin card is live, and it's the highest-intensity surface in the product

Across both research passes, **ferritin carried more emotional intensity than testosterone.** The 98-upvote top comment on the "normal" thread is a ferritin-and-restless-legs story; the recurring grievance is a GP calling 19 or 24 "normal" while the person feels wrecked. If ferritin is delivered, then **the single most emotionally charged result in the entire app is one we already classify, already have Ewa-approved copy for, and currently route to a dead end** — "see your GP", i.e. back to the exact institution the anger is aimed at.

That is not a reason to change the clinical routing (low ferritin → GP referral is Ewa's call and correct — iron dosing has genuine overdose risk). It is the reason to **build the advocacy layer on top of it first**, because this is the card where it matters most. Everything below flows from that.

### Now-buildable, in priority order

**U1 — Low-ferritin advocacy card + GP handoff (this is F3, and ferritin is its killer use case).**
The existing card already has the right instinct in copy (*"Take your ferritin number and the reference range to your appointment"*). Make that real: the card renders the number, the reference range, the specific thing to ask the GP for and why it's reasonable to ask, and a one-tap PDF to hand over. This is pure advocacy, makes no clinical claim, and is exactly what the community gives each other (*"Ask specifically for B12, folate, ferritin… put it in writing if needed"*). **Ferritin promotes F3 from "good feature on general evidence" to "build now, because the flagship scenario is live."** Still needs Ewa sign-off on wording — but the wording is advocacy, not diagnosis, which is the buildable side of her line.

**U2 — The suboptimal-ferritin (30–100) actionable card.**
This is the quiet winner. It is **not** a GP block and **not** a supplement CTA — the approved copy already gives dietary iron guidance (*"red meat, liver, lentils, spinach and fortified cereals… pairing with Vitamin C increases absorption"*) plus a retest prompt. It is the largest ferritin cohort, it is Phase-0a-safe (no product, no GP hard-block), and it directly answers the App-doc's rank-1 need — *"a result without a next step feels unfinished"* — for exactly the ambiguous-middle band that otherwise feels like limbo. **Low effort: the copy and classifier band already exist; this is wiring an existing state to an existing card pattern.**

**U3 — Ferritin becomes the tracker's hero marker (strengthens F1).**
The single most-wanted before/after in the whole corpus is a ferritin trajectory: *"my ferritin was 22… iron infusion… raised it to 300… sleeping like a baby"*, *"worked hard for 9 months to get it to 25"*, the brain-fog author's *"week 6 my ferritin was 58."* Ferritin and Vitamin D are both **retestable deficiency markers that visibly move in weeks** — the ideal proof-loop markers. If ferritin is live, the tracker's "what changed since last time" (F1's cheap first slice) has a concrete, emotionally-loaded hero on day one instead of an abstract line chart. **This raises F1's confidence for our actual buyer, not just the quantified-self cohort** — the ferritin-tracker want shows up in mainstream fatigue threads, not only r/QuantifiedSelf.

**U4 — Albumin becomes a defensible answer to the £29 Voy problem (Theme 3).**
Strategy Theme 3 is that Kit 1's panel is a commodity with a £29 floor and *"cannot be sold on the panel."* Albumin is a small crack of daylight. Ben confirmed we **measure** albumin and use it in the Vermeulen Free T calculation. Most budget finger-prick kits assume an albumin constant rather than measuring it — which makes their Free T an estimate and ours a measurement. If albumin is delivered and displayable, `/kits/testosterone` can make a true, specific, checkable claim: *"We measure your albumin and calculate Free T from it. Many cheaper tests assume a standard value, which makes their Free T an estimate."* That is a differentiator on the exact panel that is otherwise indistinguishable from Voy — **verify what Voy actually does before making the comparative claim** (and run it past `/03_compliance`, since it's a competitor comparison). It doesn't close the 3.4x price gap, but it stops the panel being a pure commodity.

**U5 — Kit 2 can foreground ferritin in marketing, and the brain-fog content angle is validated.**
Addendum A1 now holds in full: the 1,404-upvote brain-fog post's two root causes (ferritin + vitamin D) are **both** in Kit 2. Kit 2 currently lists ferritin fourth; it is the highest-intensity marker we carry and could lead. Pair with the still-open, one-query "brain fog vs fatigue" DataForSEO test (owner: `06_marketing/seo-ai-search`) before rewriting the Kit 2 angle.

### What does NOT change under this assumption

- **F2 (sample confidence + QNS path), F4 (data controls), F5 ("what this didn't test"), F6 (triage)** are all marker-agnostic. They stand exactly as written. F4 and F5 remain the cheapest now-wins and are not blocked on anything.
- **The units gap remains.** "Markers delivered" ≠ "units confirmed." Vit D / CRP / B12 (and now ferritin/albumin) live units are still unverified against real output, and the normaliser logs a loud warning + keeps the as-sent unit precisely so a mismatch is caught rather than silently mis-thresholded. The end-to-end test still has to confirm units even in the happy path.

### Revised now-list under the assumption

| Was | Under "both markers delivered" |
|---|---|
| P0 verification (blocker) | Dissolves to a confirmation step; units still to verify |
| F3 GP handoff — "Next" | **Promote toward Now** — ferritin is the killer use case (U1) |
| new | **U2 suboptimal-ferritin actionable card** — low effort, copy+band exist, Phase-0a-safe |
| F1 tracker read-only slice | Unchanged in effort; **higher confidence** — ferritin is the hero marker (U3) |
| F4 data controls · F5 "what this didn't test" | Unchanged — still the cheapest now-wins |
| new | **U4 Albumin "measured not estimated"** Kit 1 differentiator — verify Voy + compliance first |

**Net:** three additional things become buildable now (U1 promoted, U2 new, U4 new), and F1 gains confidence. None of them are large. U2 in particular is close to free — an approved copy state wired to an existing card. The critical-path dependency is unchanged: it all rides on the 14 July result actually arriving with these markers in it.

---

## Flags owed to the research (pending the payload)

These are **conditional**, not corrections — they hold only if the real result confirms Ferritin/Albumin are missing. Flagged in the source docs on 2026-07-17.

1. `01_strategy/research/2026-07-17-reddit-quora-unmet-needs.md` **Theme 5** — the low-ferritin card is built and ready but may never fire; the enrichment recommendation is conditional on the panel delivering Ferritin. Flagged in place.
2. Same doc, **addendum A1** — *"the two markers that solved his problem are two of our four"* holds only if Ferritin is in the panel; otherwise only vitamin D is ours. Flagged in place.
3. `09_website-app/docs/reddit-quora-application-unmet-needs-analysis-2026-07-17.md` **Theme 5** — the GP handoff pack survives on other evidence; only its ferritin citation is conditional.

Neither report was wrong about the market. Both assumed the panel matches the contract and the website — which it may well do. The one unverified link in the chain is whether the lab actually returns Ferritin and Albumin, and only a real results payload closes it.
