# Reverse-Engineering a Kit From Unserved Demand (analysis)

**Created:** 2026-05-30 | **Owner:** Keith | **Status:** Strategy analysis. No product approved.
**Question:** can we design a biomarker kit *backwards* from an unserved market demand, instead of forwards from a kit we already have? Prompted by `peptide-opportunity-analysis.md`.

> **CORRECTION (2026-05-30, Keith):** the IGF-1/peptide candidate below is the **wrong shape** for the current goal. The aim is **Phase-0 self-sustaining kit → EFSA-claimable supplement loops** (no CQC dependency), with cohorts portable to CQC later. Peptides/IGF-1 are CQC/prescription-dependent — the exact delay we're escaping — and have no Phase-0 supplement. For the correct, recentred analysis (omega-3 index, thyroid→selenium/iodine, homocysteine→B-complex) see **`../supplements/biomarker-supplement-loops.md`**. The method/gates below remain useful; IGF-1 is parked as a *post-CQC* idea only.

## The method (four gates a candidate must pass)

1. **Stable, finger-prick-viable biomarker** legitimately measures the thing. (Rules out haemolysis-sensitive analytes — Mg/K — and stool/saliva/imaging markers. See `daily-stack.md` magnesium note.)
2. **Compliant payoff pathway** — the result routes to either an EFSA-claimable supplement OR a pre-qualification pipeline into a (future) regulated service, FM-list style. No result that leads nowhere we can legally sell.
3. **Real, underserved demand** — DataForSEO volume + SERP gap.
4. **Vitall can run it** on the postal model.

A candidate that fails any gate is out. The method is the deliverable as much as the candidate.

## Lead candidate: the GH / IGF-1 axis ("Recovery & Optimisation")

**Biomarker:** IGF-1 (insulin-like growth factor 1) — the standard, stable, finger-prick-viable proxy for growth-hormone status. Passes gate 1. (Likely gate 4 too — confirm with Ben.)

**Why it's the strongest fit:** a low IGF-1 result is a **pre-qualified lead for the post-CQC prescription peptide service** (Sermorelin / CJC-1295 / Ipamorelin) — the highest-margin product in the whole portfolio (`peptide-opportunity-analysis.md`: 80% margin, £450k Y3). This mirrors the existing Kit 1 → low-T → FM list → TRT logic exactly. The kit is the Phase 0 **data front-door** that turns peptide-curious demand into a measurable, owned funnel.

**Demand (DataForSEO UK, 2026-05-30) — and the honest catch:**

| Term | Vol | KD | Read |
|---|---|---|---|
| peptides | 90,500 | 34 | Huge topic interest |
| bpc-157 | 40,500 | 10 | Huge, low KD |
| hgh | 12,100 | 66 | — |
| igf-1 | 6,600 | 23 | The biomarker concept |
| pt-141 | 4,400 | 12 | Sexual-function peptide |
| sermorelin | 3,600 | 29 | GH secretagogue |
| **igf-1 test** | **390** | 0 | **Test-intent demand is tiny** |
| **growth hormone test** | **140** | 0 | **Tiny** |

**The catch:** demand for the *topic* (peptides, BPC-157) is enormous, but demand for an *IGF-1 test* is tiny. So this is **not an SEO-acquisition product** — nobody is googling "IGF-1 test." It's acquired the same way the Daily Stack is: via content adjacency + as a pipeline qualifier, not search-to-cart.

**The compliance gate is heavy (this is the real blocker):**
- In Phase 0 we **cannot offer or imply** GH/peptide therapy (not available; even post-CQC it's off-label pending Ewa).
- It is **illegal to advertise prescription-only / unlicensed medicines to the public** (MHRA). So content **must not promote BPC-157, TB-500, Sermorelin etc. as solutions.** We can ride the *adjacent* educational topic — the GH axis, what IGF-1 means, and **natural** ways to support it (sleep, protein, training, body composition, all of which genuinely move IGF-1/GH) — but not "buy peptides."
- The kit framing must be "measure your GH/recovery axis + lifestyle guidance + interest waitlist," never "find out if you need peptides." Same boundary discipline as the TRT/FM line, but a hotter surface. **Ewa gate, mandatory.**

**Other caveats:** IGF-1 alone is a thin kit — likely bundles as a "Recovery & Performance" add to Kit 2/3 or the ICP-4 metabolic line. And the high-margin payoff is post-CQC; Phase 0 it's a data + lifestyle + waitlist product only.

## Candidates that FAIL the method (the gate working)

- **NAD+ / longevity** (`nad supplement` 12,100) — no standard finger-prick NAD test; supplement claims (NMN/NR) are murky. Fails gate 1 + 2.
- **Biological age** (1,900) — epigenetic / DNA-methylation based; not finger-prick chemistry, and DNA is on the do-not-build list. Fails gate 1.
- **Libido / sexual function** (`pt-141` 4,400) — biomarkers overlap Kit 1 + prolactin (already covered); PT-141 is post-CQC Rx. Not a clean new kit.

## Verdict

The GH/IGF-1 axis is the one genuine reverse-engineered kit: it passes the biomarker, demand-adjacency and pipeline gates, and it reverse-engineers the portfolio's highest-margin future service. **But its viability is gated on compliance (Ewa) far more than on the biology**, and its payoff is post-CQC. Treat it as a *post-Kit-3-Plus / pre-CQC pipeline-builder candidate*, not a near-term build. Next step if pursued: a focused Ewa conversation on (a) what GH-axis/IGF-1 content and kit framing is ASA/MHRA-safe in Phase 0, and (b) her post-CQC appetite for peptide prescribing (already flagged in `peptide-opportunity-analysis.md` §3).
