# Strategy — Current State

Consolidated status of every open strategic thread: what's locked, what's still owed, and where the authoritative doc lives. Durable constraints are in `CONTEXT.md`; the fixed baseline is `master-implementation-blueprint.md`. This file is the moving layer — update the date on each change.

_Last updated: 2026-07-09._

---

## Gates RESTATED by Keith — 2026-07-09 (supersedes the same-day audit ruling)

- **Canonical text: `CONTEXT.md` → Gates Reference.** Classification unchanged: operational launch gates = qa-gates 1–5 + Gate 0A (the only blockers); 0B/0C = strategic post-launch gates. **The numeric criteria for 0A and 0B are new.**
- **What went wrong first time.** The morning ruling arbitrated four conflicting numeric sets and adopted the `andro-prime-strategic-model-v7.md` (12 May) set as the most recent. It was: _all four sets were pre-deferral._ Every one defined 0A and 0B on supplement metrics (paid pre-orders; kit→supplement conversion), and the **2026-05-23 supplements-deferred decision** (`2026-05-23-phase0-supplements-deferred-plan.md`, approved 11 days _after_ the v7 set) replaced buy-now supplement CTAs with a non-cash waitlist. Gate 0A's 25-pre-order bar was also unreachable against Tier-2's own ~5–20 kit 90-day forecast, even at 100% attach. The arbitration was on the wrong axis.
- **Governing principle now recorded:** at Phase 0a volume no demand threshold is reachable or statistically meaningful, so each gate is defined around **the decision it authorises**, not a volume it cannot reach. A gate that cannot clear does not block anything; it gets ignored. That is how four contradictory definitions accreted.
- **Gate 0A → capped-downside spend authorisation.** Stock private-label only (stability-tested; no bespoke V7.2, no tooling), exposure capped at the phased ~£5,950, MOQ survivable as a total write-off, clean 4-active spec held. Waitlist opt-in rate is a directional read, never a threshold. Recorded explicitly as a **founder bet** (Tier-2: _"breaks the self-financing principle"_), not earned demand.
- **Gate 0B → unit-economics gate** authorising paid scale. Stage 1 (pre-supplement): **CPA < kit gross contribution** (£38 / £53 / £77 direct, per the 2026-06-26 LTV:CAC model). Stage 2 (post-supplement, once attach is observed, not before ~week 8): **CPA < blended LTV** (~£165, 6-month subscriber). Soft signals are tie-breakers at low n. Read at the Tier-2 week 6–12 decision point.
- **Gate 0C → unchanged.** Month 12, cumulative cash vs the £30k "Phase 0 self-funded" threshold. It survived because it is the only candidate definition not defined on a supplement metric. No point M12 target should be quoted yet: see the Phase 0 financial principles section and option-4 Appendix R.
- The earlier "keep the v7 set" flag is **withdrawn**; the v7 doc's 0C stands, its 0A/0B are retired.

---

## Entity & ICO — DONE (2026-06-11/12)

- **Andro Prime Ltd**, no. 17185839, reg. 128 City Road, London EC1V 2NX (inc. 28 Apr 2026, active; SIC 47910 + 86900). Held 50/50 Keith Lindo / Dr Ewa Lindo.
- **Prima Medical Group Ltd does NOT exist** and is not being incorporated — two-entity / brand-holdco structure parked ~18 months. Stale docs that named Prima as data controller / wellness operator were corrected 2026-06-11.
- Data controller = Andro Prime Ltd (single, wellness now + clinical post-CQC). It is also the executed Vitall counterparty; creating Prima would not touch the Vitall contract unless Prima entered the data path (then novation).
- **ICO registration complete: number `ZC172852`** (Tier 1 micro, £52/yr, registered 2026-06-12, renewal ~11 Jun 2027). Inserted into the live privacy page + `privacy-policy.md` + `data-controller-position.md` + DPIA/GDPR checklist. No DPO required at current scale (revisit post-CQC); DP contact = `privacy@andro-prime.com`. _(The private security number is held outside the repo — never publish it.)_
- **Open:** solicitor review; long-term equity split (see next).

## Equity / shareholders' agreement — OPEN, sensitive

- **Registered ownership: 50/50** (Keith / Ewa), as incorporated. The V7 model uses 50/50 as its outcome-projection baseline.
- The **long-term** split is being settled through a **shareholders' agreement** — `entity-structure/shareholders-agreement-draft.md` (negotiating draft, uncommitted, NOT execution-ready). Treat the final split as under negotiation, not closed. Needs solicitor review **and** Ewa's independent legal advice before it means anything.
- **SHA terms are intentionally NOT summarized outside that draft** (Ewa may read shared strategy docs) — the draft is their only home. The earlier "50/50 is final, no future-buyout plan" line in `2026-05-12-single-entity-decision.md` §5.5 was corrected 2026-07-01 to a neutral "under negotiation, governed by the SHA." Do not restate SHA terms into shared docs without Keith's explicit say-so.

## Phase 0 financial principles — LOCKED 2026-05-08 (M12 headline RESTATED 2026-07-09)

- Self-financing cost centre; ~£30k cash by M12. ⚠️ **The old +£39,246 / ~31%-headroom validation is SUPERSEDED (2026-07-09)** — it rested on option-4's 50/50 PT-coded affiliate mix (£13,240 H1 programme spend) from a channel **frozen since June**, plus May inputs (COGS £12 / 15% attach / 4-mo tenure) revised by the 2026-06-26 LTV:CAC model (COGS £10 / 20% attach / 6-mo tenure). Restated on June inputs + affiliate-frozen direct mix in `financial-model/option-4-financial-model-2026-05-08.md` **Appendix R**: mechanically **higher** (~£72–92k range, not a point estimate) because the freeze strips programme cost faster than revenue, **but the binding risk has moved from margin to volume** (the ramp assumed affiliate drove ~50% of it). **Quote no M12 cash figure as a target** until owned-only volume + Phase-0b attach/tenure are observed. Founding-member £75 deposit shelved; FM kept as a non-cash opt-in marker.
- **Daily Stack subscriber tenure is the single biggest swing variable** (planning case 4-mo tenure, conservative vs 12-mo industry). **Critical churn window: days 15–45** — the highest-leverage operational lever in all of Phase 0.
- Phase 0 tripwire: Kit 1 affiliate net below £10 sustained 30 days = restructure trigger.
- Authoritative for unit-economics **method**: `financial-model/option-4-financial-model-2026-05-08.md` (its **M12 headline is superseded — use Appendix R, 2026-07-09**), `research/2026-05-08-phase0-cash-target-benchmark.md`. Authoritative **input set**: `ltv-cac-profitability-model-2026-06-26.md`.

## Tiered-platform financial model v2 — rebuilt 2026-05-25, headlines UNRELIABLE

- `andro-prime-tiered-platform-model-v2.xlsx` rebuilt from `tiered-platform-model-v2.md` (commit `4f36011`; rebuildable via `build_tiered_v2.py`).
- **Key finding:** the v2 markdown's published headlines (AP PASS M36 £1.28M / CL PASS M36 £104k) are **not reproducible bottom-up** from its own stated assumptions — bottom-up undershoots 40–60% on AP and goes negative on CL. Each P&L sheet shows the calibration plug explicitly. **Do not quote v2 headlines as a planning number until reconciled.**
- **Open:** (1) gate evaluation month — doc says M12, the 6-mo-elapsed rule implies M10 (Conflicts_Log row 5); (2) Performance tier has no product spec (operational criteria / comms / retest trigger) — Keith picked "sub-tier of Optimisation" for the model only.

## LTV:CAC + base subscription — model annotated 2026-06-27

- Canonical model: `ltv-cac-profitability-model-2026-06-26.md`. Per-average-kit-buyer LTV ~£88–157. Cold paid never pays back; owned + affiliate only. Attach + tenure swing LTV ~2.6× (first-order); price second-order.
- **Base subscription: recommended £39.95/mo** (premium band; Daily Stack COGS ~£8, margin 60–77%). Validate with a Van Westendorp WTP test before locking — but defer/embed in the quiz (waitlist too small to sample now).
- ⚠️ **Do not use** `07_sales/growth-retention-context.md`'s £520–840 "LTV" — that's top-line best-case revenue, not the canonical contribution model.

## Phase 0a / 0b split — LOCKED 2026-05-23

- **0a (live):** kits 1/2/3 + founding-member list + **supplement waitlist** (bridge). **0b (~2–3 mo):** supplements ship (Daily Stack, Collagen, Complete Men's Stack).
- Supplement-interested customers in 0a → the waitlist (`/supplement-waitlist`, `supplement_waitlist_joined`, CIO segment 24). Supplement subscriptions are NOT purchasable in 0a (Stripe sub route returns a clean 400 by design). Full 0b activation steps: `09_website-app/STATE.md` + plan `2026-05-23-phase0-supplements-deferred-plan.md`. Approved CA-009/CA-010.

## Tier 2 sales creation plan — 2026-06-26

- Front-of-funnel = **paired**: founder short-form (IG Reels + YT Shorts, anchored on Keith's own retest data) + a **£250 Google Search test** (short-form = free accelerant; search = dialable read). Affiliate FROZEN.
- Supplements targeted 6–8 wk via **stock / private-label** closest formula (NOT custom — removes the stability wall); capital fronted ~£5,950 phased; keep close to the 4 actives.
- Social = founder-fronted dedicated accounts (locked): IG `@keith.antony.tech` (existing account; new `@keith.androprime` kept being auto-deactivated, changed 2026-07-19), YT `@keithandroprime`; public name "Keith Antony". Every post gets a compliance pre-flight (a founder account is not an ASA loophole).
- Track A launch copy + 15 short-form hooks drafted (in-palette markers only: testosterone/VitD/B12/ferritin/hs-CRP) — pre-flight clean but **BLOCKED pending Ewa tone sign-off + lab-accreditation substantiation**. Quiz + first-party tracking must be verified before the £250 test runs. Backlog: `10_launch-ops/implementation-checklists/tier2-build-backlog-2026-06-27.md`.

## Exploratory product ideas — Option 4 locked, rest exploratory

- **Locked:** Option 4 kit strategy (Keith 2026-05-08) — all Kit 1 buyers get a result-mapped supplement offer regardless of result; founding-member becomes an elective opt-in layer, not a funnel gate. Brief: `kit-strategy-decision-brief-2026-05-08.md`.
- **Exploratory (not decided):** subscription-as-FM-entry (replace the retired deposit), Kit-1-specific supplement positioning, two-tier pricing (sub ~£39.95 vs one-time ~£65). Open: does FM access persist for one-time buyers; single vs differentiated SKUs; CQC-trigger redefinition if deposits retire.
- Compliance: never use "referral" in copy bridging supplement → TRT pathway (implies clinical referral); use "founding member / priority access." Ashwagandha silent-ingredient rule applies regardless of formulation.

## Vitall competitor pivot — directional decisions 2026-06-01

- **Refined read:** Vitall is a **B2B white-label / picks-and-shovels infra provider** wearing a consumer storefront (tiny organic footprint, zero paid search, partner-branded clone subdomains = the Vitall Sync model). The threat is **NOT demand capture** (men's SERP is wide open) — it's that they could power a better-funded competitor on the same rails and act as **data landlord** over our customers' special-category data (they assert independent-controller status).
- **Keith's directional decisions:** (1) double down on the men's brand — the one defensible thing; (2) white-label their broad panel to capture margin **if** the wholesale quote allows ("their panel + the markers they don't carry" — ApoB/homocysteine/insulin absent from both Vitall flagships = the Kit 3 Plus differentiator holds); (3) PT/affiliate is a price channel we lose on → dead midterm, taper don't hard-cut, mothball FirstPromoter for reuse; (4) build our own supply chain (~18 mo) — contract kit/fulfilment + a reference lab directly. Ewa (GMC GP) = the "requesting clinician" asset that unlocks direct lab access.
- ⚠️ **Constraint — disintermediation is volume-gated:** Thriva declined us 20 Apr 2026 on volume (contact Sophia Schreiber), door open at scale. Serious labs (Thriva/TDL/Inuvi/Randox) gate on volume we lack pre-launch; Vitall's edge = no minimum-volume commitment. So we **stay on Vitall to launch** (don't burn the bridge), starve them of our differentiator + strategy, build brand + volume, then re-approach. Prime direct target = TDL (tier-1 Sonic, powers Medichecks, runs the metabolic markers).
- **Open:** supply-chain scoping doc; re-scope pending Ben feasibility drafts so we don't hand a competitor our differentiator. (The Vitall services agreement was executed 2026-06-02; the "stay on Vitall to launch" decision above is settled, not open.) Related: `05_partners` (Vitall correspondence), `06_marketing/affiliates` (PT taper). Consider a formal `competitive-landscape/` report for the competitive read.
