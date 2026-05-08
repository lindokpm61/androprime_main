# TRT Launch Readiness — Phase 0 Commercial Planning

*2026-05-08. Replaces (and reframes) the earlier `cqc-trigger-volume-problem-2026-05-08.md` stub. UK + NI scope. UK English.*

---

## Why this doc exists

Research Agent C ([`2026-05-08-funnel-math-option4.md`](research/2026-05-08-funnel-math-option4.md)) modelled the founding-member deposit pipeline against the long-standing "40-deposit CQC trigger" benchmark and found that no kit-strategy option (1, 2, 3, or 4) hits the threshold at v2.2 minimum-case volumes (375 kits over 6 months). Baseline produces ~13–20 deposits; Option 4 (the recommended kit-strategy choice — see [`kit-strategy-decision-brief-2026-05-08.md`](kit-strategy-decision-brief-2026-05-08.md)) produces ~21–33 including elective opt-ins. All options miss the 40-deposit number by ~10+.

This was originally framed as a "regulatory gate problem." **It isn't.**

---

## What the 40 number actually is

Per Keith's clarification (2026-05-08):

> "There is no CQC requirement for the number of genuine patients tied to CQC granting the application. The 40 threshold was an internal figure based on a general average of where we would need to be in order to have consistent flow [of customers] to trigger revenue to TRT treatment."

In plain terms: **CQC has no patient-volume requirement for granting the application.** The CQC application proceeds on its own paperwork timeline (premises, named prescribers, governance, policies, clinical protocols) regardless of how many wellness customers Andro Prime has signed up.

The 40 was an **internal commercial-readiness target** — the rough warm-customer pipeline target needed so that when TRT launches post-CQC, the clinical operation has consistent flow rather than launching into a vacuum.

That changes the problem materially:

| Previously framed as | Actually is |
|---|---|
| A regulatory gate that blocks CQC progression | A commercial KPI for TRT day-1 launch readiness |
| Missing it = the business doesn't progress | Missing it = TRT launches into a smaller pipeline |
| Existential | Manageable |
| Deposit-count-based by design | Deposit-count is a noisy proxy for the actual goal (warm-pipeline-at-launch) |

The original "CQC-trigger volume problem" framing was load-bearing on a faulty premise. Under the corrected framing, most of the levers in the original stub become irrelevant — the problem largely dissolves and what remains is a calmer commercial-planning question.

---

## The deposit mechanic conflates three different things

The £75 founding-member deposit was attempting to do three different jobs in a single transaction:

| Job | Mechanism | What it actually proves |
|---|---|---|
| **Demand evidence** | "Person with low T who could be a future TRT customer" | We already know this from the test result alone — no deposit needed |
| **Customer commitment** | "This person committed money toward our future TRT service" | Some signal, but a noisy one — see below |
| **Capital validation** | "We hold £75 × 40 = £3,000 of refundable deposits" | Almost nothing material to the business |

**Only the first one matters for CQC application** (and even that isn't required — see above). The second is a forecasting nice-to-have. The third is a rounding error.

This means the deposit was structurally over-engineered for the actual job. The data alone (the test result, the email engagement, the supplement-subscription tenure) is sufficient evidence that "this person is a future TRT candidate."

---

## The depositor drop-off bind (Keith's second clarification)

Holding deposits across a 6–12+ month CQC-progression wait creates a structural problem nobody had priced in:

- **40 depositors at the moment of trigger ≠ 40 customers at TRT launch.** If CQC progression takes 6–12+ months, expect 30–50% drop-off. The "40 trigger" is functionally a "20–28 actual depositor" count by the time TRT goes live.
- **Refund admin is the same hit.** When a depositor asks for £75 back, that's admin overhead, cashflow timing impact, and a worse brand signal than never taking the deposit.
- **The deposit constrains commercial flexibility.** While Andro Prime holds the £75, changing product/pricing/scope risks Consumer Rights Act exposure or requires re-consent from every depositor. The deposit is a contract that constrains forward-product decisions.

**The deposit mechanic creates risk on every dimension and proves nothing the data doesn't already prove.** Whether to retire the deposit entirely under Option 4 is held as a separate piece of thinking (Keith's request, 2026-05-08) and is not resolved here. But this doc surfaces it explicitly so future work doesn't lose the thread.

---

## What "TRT day-1 launch readiness" actually needs

Under the corrected framing, the question becomes: **how many warm-converting customers do we want at TRT launch?** And what's the cleanest way to identify them?

Better proxies than deposit-count, ranked by signal quality:

1. **Active Daily Stack subscribers with low-T results** — paid recurring revenue + clinically-qualifying biomarker. Highest signal. Survives time naturally (drop-off self-selects out).
2. **Active Daily Stack subscribers (any result) + opted-in to elective founding-member layer** — Option 4's elective mechanic. Moderate-to-high signal. Self-declared interest.
3. **Email-engaged Kit 1 / Kit 3 customers with low-T results who opened seq-03b** — passive but real engagement. Moderate signal. Low cost to identify.
4. **Founding-member deposits (current mechanism)** — high signal at moment of deposit, decays with time. The mechanism the original 40-number was built for. Now arguably obsolete.

**Under Option 4, signals 1+2+3 produce a richer, less leaky pipeline than the deposit-only path.** The 40-deposit threshold can be reframed as "40+ warm customers across these signals" and is comfortably reachable at v2.2 minimum-case volumes — the original arithmetic problem largely disappears.

---

## The number itself is now flexibly revisable

The "40" was an internal estimate of the TRT day-1 customer base needed for "consistent flow." That estimate predates the kit-strategy decision being made now. With Option 4 generating supplement MRR as the cashflow engine, Phase 0 burn is lower than originally modelled, which means **TRT can plausibly launch with a smaller warm pipeline (20–30 customers) and grow from there** without endangering the business.

This is now a tractable founder + Ewa decision, not a structural problem. The economic stakes:

- **Higher target (40+ at launch):** longer runway between CQC grant and TRT launch, more confident day-1 commercial signal, lower TRT-launch operational stress
- **Lower target (20–30 at launch):** faster TRT launch post-CQC, faster post-CQC revenue mix-shift, marginally bumpier day-1 ops

Either is workable. Choose based on bandwidth and cash position at the time of CQC grant, not by reverse-engineering from a placeholder number set months earlier.

---

## What Keith and Ewa need to decide

Three questions remain. Data can't resolve any of them — they're founder calls.

1. **What is the actual day-1 TRT pipeline target?** The 40 was an estimate; what does Ewa think the right number is from a clinical-operations perspective? (5–10 patients = barely viable; 50+ = comfortable; somewhere between is probably right.)
2. **Should the trigger metric be redefined formally** in `master-implementation-blueprint.md` §1.3 and `03_compliance/CONTEXT.md` Gates table to reflect the warm-pipeline-across-signals framing rather than deposit-count? Probably yes; recommend Ewa-led wording.
3. **Should the deposit mechanic be retired or restructured** under Option 4? Held as separate piece of thinking per Keith 2026-05-08; live consideration given the conflation analysis above.

---

## Out of scope here, picked up elsewhere

- **The full kit-strategy decision** — recommended Option 4. See [`kit-strategy-decision-brief-2026-05-08.md`](kit-strategy-decision-brief-2026-05-08.md).
- **Pricing-doc reconciliation** — separately resolved 2026-05-08 by aligning [`non-regulated-tier-v72-financials.md`](../04_products/catalogue/non-regulated-tier-v72-financials.md) to v2.2 canonical (£99/£119/£179).
- **Whether to retire the deposit mechanic entirely** — Keith holds this as separate thinking.
- **The financial-model rerun against realistic Phase 0 volume scenarios** — needed regardless, but not gated by this doc.

---

## Cross-references

- [Kit Strategy Decision Brief 2026-05-08](kit-strategy-decision-brief-2026-05-08.md)
- [Agent C Funnel Math findings](research/2026-05-08-funnel-math-option4.md)
- [Andro Prime root CLAUDE.md](../CLAUDE.md)
- [Phase 0 Marketing Plan v2.2](../06_marketing/master-plan/phase0-marketing-plan.md)
- [Phase 0 Financial Model v1](phase0-financial-model-v1.md)
- [Master Implementation Blueprint](../10_launch-ops/master-implementation-blueprint.md)
- [Compliance CONTEXT.md](../03_compliance/CONTEXT.md)

---

*Reframed scope doc. Owner: Keith. UK English. 2026-05-08.*
