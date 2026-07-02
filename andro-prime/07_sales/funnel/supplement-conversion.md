# Supplement Conversion (Attach) — Playbook

**Updated:** 2026-06-27 (was a stub). Owns the *strategy, levers, target and measurement* for attach rate (kit buyer → supplement subscriber). The conversion **mechanics** (result-state CTAs, biomarker cards) live in [flow-4-results-to-action.md](../../08_customer-journey/flows/flow-4-results-to-action.md) Part C — this doc does not duplicate them. Economic case: [ltv-cac-profitability-model](../../01_strategy/ltv-cac-profitability-model-2026-06-26.md).

## Why attach is first-order

The LTV:CAC model proves it: **attach rate and tenure are the two levers that decide whether the business is profitable** — they swing per-customer LTV ~2–2.6×, far more than price or paid spend. Attach is half of what makes owned acquisition (the engine) pay. **Target: ≥15%** (locked 2026-07-02 — reconciles the earlier ≥20% here with growth-retention-context's ≥15%; **<10% after 80 results → restructure the result flow**).

## The attach moment

Results delivery (flow-4 Part B/C). Attach happens on the biomarker card's **Recommend → Convert** sections, at the moment of the result. This is the explanation-premium in action: the result's *explanation* earns the right to recommend (feeling-first → relief of understanding → permission to act). The supplement is the action the data justifies — never a detached "buy our pills" CTA.

## The attach levers, ranked

1. **Results-report quality** — the explanation that produces "now I understand → I can act." The biggest lever; it's also why the feeling-first doctrine matters here.
2. **Match specificity** — "the B12 your data calls for," not "our multivitamin." Data-justified beats generic.
3. **The all-clear path** — see below. The biggest *structural* lever, and it's currently switched off.
4. **Offer + price** — subscription-default at £34.95/mo (the £39.95 increase is a pending Phase-0b decision); Complete Stack £54.95 for 2+ deficiencies (per flow-4).
5. **Friction** — one-click from the results card to Stripe, pre-matched, no choosing.

## ⚠️ The all-clear problem (the biggest attach cap, currently un-addressed)

flow-4 specifies: **Normal Vitamin D → "No CTA." Normal B12 → "No CTA." T > 20 → no supplement CTA.** That is correct on the data-led thesis (don't sell a correction for a deficiency that isn't there) — but it has a structural consequence nobody has costed:

**A large share of Kit 2 buyers come back in range.** For healthy-ish men, all-clear is the *majority* outcome. Under the current rules, that majority gets **no supplement offer → 0% attach from the biggest segment.** The design is structurally capping attach by giving most customers nothing to convert on.

**The lever:** all-clear ≠ no-offer. Reframe to **maintenance**, which the EFSA claims support exactly ("contributes to the *maintenance of normal* testosterone levels"). The angle already exists in the system — seq-03c "Normal doesn't mean optimal" and the Day-35 retention email's "keep the floor solid." Surfacing a maintenance-framed Daily Stack offer on the all-clear path is likely the single largest attach-rate move available.

**But it's a genuine thesis tension — do not resolve it unilaterally.** The brand sells *against* guess-pills ("don't guess, test"). Selling a maintenance stack to someone whose data says they're fine skirts that line. The honest version is defensible ("your data's good; this is the dose that keeps it there, and the retest proves it stays") and fear-free; a "you might still be deficient" version is not. **This needs explicit Ewa + compliance sign-off before it ships** — it's a claims *and* positioning decision, not a copy tweak. Flagged for Keith.

## Measurement — make the model's attach guess real

Instrument the attach funnel and **segment by result state** (this is what turns the LTV model from estimate to fact):

| Event | Definition |
|---|---|
| `result_received` | results delivered (already fired, flow-4) |
| `supplement_offer_shown` | a Recommend/Convert CTA rendered (NEW — needed) |
| `supplement_offer_clicked` | customer tapped it (NEW) |
| `subscription_started` | attach (already fired, flow-4 Branch D1) |

**Attach rate = `subscription_started` ÷ `result_received`, split by segment: deficiency vs all-clear vs low-T.** The **all-clear attach rate** is the number to watch — it's currently structurally ~0% and is the biggest upside. Cohort by start-month, same as the tenure metrics.

## Compliance guardrails

Per flow-4 + `03_compliance/CONTEXT.md`: "your results indicate," never "you have"; EFSA claims verbatim (Zinc → maintenance of normal testosterone; D3 → normal muscle function; Active B12 → energy-yielding metabolism / psychological function); FM CTA gated to T<12 on Kit 1/3 only; no per-customer Ewa interpretation (system-level rules only); ashwagandha silent. **The all-clear maintenance offer is the one item requiring fresh sign-off** (thesis + claims).

## Cross-references

- [flow-4-results-to-action.md](../../08_customer-journey/flows/flow-4-results-to-action.md) — the conversion mechanics + result-state CTA logic (the HOW).
- [day-15-45-retention-experience](../../08_customer-journey/day-15-45-retention-experience-2026-05-08.md) — the tenure half of the LTV equation.
- [ltv-cac-profitability-model](../../01_strategy/ltv-cac-profitability-model-2026-06-26.md) — why attach is first-order.
- `04_products/supplements/daily-stack.md` — formulation + EFSA claims + ashwagandha silent rule.
- `growth-retention-context.md` (this workspace) — attach target (≥15%), churn, referral, retest loop.