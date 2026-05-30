# Liver Health — Product Opportunity + Hybrid Decision

**Created:** 2026-05-30 | **Owner:** Keith | **Status:** **Direction LOCKED 2026-05-30 — HYBRID** (Keith). Standalone Liver Health Check + liver markers in Kit 3 Plus + content cluster now. Not yet specced for build, not priced (COGS pending Ben), not compliance-cleared (pending Ewa).

## DECISION (2026-05-30): Hybrid

1. **Content cluster now** — kit-agnostic, ranks regardless of SKU. Head + spokes seeded into `keywords.csv` (`future-kit-liver`). No-regret leg, build first.
2. **Standalone Liver Health Check (~£69–79)** — message-matched front door for the 18.1k `liver function blood test` searchers; cheap acquisition entry; upsells to Kit 1 / Kit 3 Plus. Provisional spec below.
3. **Liver markers also in Kit 3 Plus** — locked IN (resolves `kit-3-plus.md` §3 pending decision). Comprehensive buyer gets liver without a second purchase.

### Provisional standalone spec (V0.1 — not approved/priced)

| Field | Provisional value | Decision from |
|---|---|---|
| Name | "Andro Prime Liver Health Check" (provisional) | Keith + pre-flight |
| Markers | ALT, GGT, ALP, bilirubin (+ albumin, already in Kit 1 panel) | Ewa + Ben |
| Price | **£45–55 provisional** — set against the market benchmark below, NOT a free choice (an earlier £69–79 placeholder was ~2× market and is withdrawn) | Keith + Ben COGS |
| Format | At-home finger-prick (standard LFT biochem — cheaper than hormone immunoassay) | Ben |
| Strategic role | **Acquisition front door** — captures high-volume liver search, upsells to hormone/metabolic line. NOT a TRT-pipeline or supplement driver (no EFSA liver-supplement claim; statins are POM). | — |
| Compliance | Flag elevated → GP referral. **Never diagnose NAFLD/liver disease.** Same gate pattern as Kit 3 Plus metabolic framing. | Ewa |

**Competitor price benchmark (fetched 2026-05-30):** Medichecks Liver Function Test **£39** (7 markers: ALT, ALP, GGT, bilirubin, total protein, albumin, globulin); Thriva **£48.60** (subscription, ~same 7-marker panel). The standalone liver test is a **commoditised £39–49 segment** — unlike Kit 1/2/3 which sit in a premium space where the brand/dashboard/Ewa premium is defensible. A liver searcher can buy Medichecks at £39, so we can't carry a large premium here.

**Viability flag:** the standalone kit's economics hinge entirely on Vitall COGS vs a ~£45 ceiling. If liver-panel COGS ≤ ~£25, a £45–49 kit works (~45% margin) and the front-door thesis holds. If COGS > ~£30, the standalone is margin-thin and should be reconsidered — in which case the content + Kit-3-Plus-inclusion legs still stand on their own (content ranks regardless; liver in Kit 3 Plus is marginal cost on a premium kit). **Get Ben's COGS before committing to the standalone.**

---

## Supporting analysis (the case for the decision)
**Source:** DataForSEO UK sweep + SERP check (2026-05-30); Semrush competitor teardown (`06_marketing/seo-ai-search/competitor-organic-teardown.md`).

## The finding

Answering "what kit could be lucrative that we don't offer / aren't capitalising on", two things surfaced:

### A) NOT currently available — Liver function (the standout)

- **Demand:** `liver function blood test` **18,100/mo** (DataForSEO KD 18), with a deep low-difficulty long-tail (normal values KD 4–17, interpretation KD 24, abnormal/deranged KD 16–20, results 2,900/KD18, "alt liver function test" 1,900/KD20). **~50k+ combined.** Bigger and easier than `hba1c blood test` (12,100/KD46) that anchored the Kit 3 Plus metabolic case.
- **SERP underserved (validated):** top 10 = British Liver Trust (charity), Mayo/Cleveland (US), NHS + SPS-NHS + NHS regional, Lab Tests Online. **No UK men's-health specialist. Medichecks only #12.** Same gap pattern as the CRP/inflammation cluster we already targeted.
- **Currently:** liver markers (ALT, AST, GGT) are only a **"decision pending" line-item in the Kit 3 Plus draft** (`kit-3-plus.md` §3) and in the post-CQC Premium Panel. Not a Phase 0 product. The metabolic-kit Semrush sweep never surfaced this volume.
- **Feasibility:** ALT/GGT/ALP/bilirubin are standard, cheap finger-prick biochemistry Vitall already supports (Forth/Medichecks both sell them). Albumin is **already in Kit 1**.
- **On-thesis:** fatty liver (NAFLD) ↔ metabolic syndrome ↔ low testosterone; men 35–60 + alcohol/lifestyle "is my liver ok" anxiety. Not off-brand if framed through men's metabolic health.

**Two routes (not mutually exclusive):**
1. **Lock liver markers into Kit 3 Plus** as a flagship inclusion (low marginal COGS, large SEO pull). Resolves the §3 pending decision in favour of YES.
2. **Standalone "Liver Health Check"** low-price entry kit (~£69–89) that captures the 18.1k head term and upsells to Kit 3 / Kit 3 Plus. A cheaper acquisition front-door than Kit 1.

### B) Available but NOT capitalised — Ferritin / iron (quick win, no new product)

- Ferritin is **already in Kit 2 + Kit 3.** `ferritin blood test` **8,100/KD12**, SERP underserved (US authorities + NHS + Boots, no men's specialist). We test the marker but run zero SEO/positioning to capture the people searching for it (Kit 2 is framed "Energy & Recovery", not iron status).
- **Action:** a ferritin/iron content cluster routing to Kit 2 + surface "iron/ferritin status" in Kit 2 positioning. Pure upside, no build.

## Already on the roadmap (not new — for completeness)

- Thyroid/TSH ~40k (`serum tsh levels` 22,200) → **Kit 5** (planned, [[project-future-kit-opportunities]]).
- Cortisol ~16k (`symptoms of high cortisol` 12,100/KD18) → **Kit 6** (gated on Vitall dried-blood-spot/diurnal feasibility).
- HbA1c / lipids / ApoB / homocysteine → **Kit 3 Plus** draft (`kit-3-plus.md`).

## Caveats / validation before committing

- KD figures are **DataForSEO scale** (not comparable to the Semrush KDs in `keywords.csv`); volume (18,100) is provider-agnostic Google data and robust. Sanity-check KD on Semrush scale if/when units return.
- **Compliance (Ewa):** liver-disease / NAFLD framing must flag elevated → GP referral, never diagnose. Same gate pattern as the Kit 3 Plus metabolic framing already drafted.
- **COGS (Ben/Vitall):** extend the existing Kit 3 Plus feasibility email with a standalone liver-panel COGS + finger-prick viability question.

## Recommended next step

Decide route 1 vs 2 (or both), then: (a) extend Ben's COGS question, (b) add liver markers to the Ewa compliance-gate email, (c) seed `liver function blood test` + long-tail into `keywords.csv` under Pillar D / a liver cluster, shippable as content pre-launch to build demand.
