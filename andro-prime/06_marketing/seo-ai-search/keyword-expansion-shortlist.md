# Keyword Expansion Shortlist (DataForSEO, UK, May 2026)

Curated from a `suggest` sweep of 14 priority seeds (raw backing data:
`keyword-expansion-staging.csv`, 364 rows, $0.18). Off-ICP rows (female/menopause/veterinary)
and near-zero volume stripped; Google Ads close-variants collapsed to canonical heads below.

**KD note:** all KD values here are **DataForSEO scale**, NOT comparable to the Semrush KDs in
`keywords.csv`. Internally consistent within this list only. (DataForSEO scores these much lower
than Semrush — see the tool README.)

**Headline:** the biggest low-difficulty cluster is **liver function** — and it wasn't on our pillar
map at all. Plus the biomarker-test queries are uniformly low-KD and high-volume, reinforcing the
glossary strategy from the Semrush teardown.

---

## Canonical clusters (collapsed, ranked by addressable volume)

| Cluster (canonical head) | Best-phrasing vol | KD | Combined cluster vol | Kit | Status |
|---|---|---|---|---|---|
| **Liver function test** | `liver function blood test` 18,100 | **18** | ~50k+ (incl. normal values, interpretation, abnormal/deranged, results, ALT) | Kit 3 (liver markers) | **Buildable now** |
| **TSH / thyroid** | `serum tsh levels` 22,200 / `tsh levels` 8,100 | 37–41 | ~40k+ (normal/low/high tsh, thyroid results) | Kit 5 (thyroid) | **Future kit — park/build-ahead** |
| **High cortisol** | `symptoms of high cortisol` 12,100 | **18** | ~16k+ (cortisol blood test 2,900 / KD13) | Kit 6 (cortisol) | **Future kit — park/build-ahead** |
| **Ferritin** | `ferritin blood test` 8,100 | **12** | ~10k+ | Kit 2 / Kit 3 (iron) | **Buildable now** |
| **Luteinising hormone** | `luteinising hormone` 8,100 | 44 | ~10k+ (`what is LH` 1,000 / KD13) | Kit 1 | **Buildable now** |
| **Testosterone (marker)** | `testosterone on blood test` 3,600 | **8** | ~8k+ (signs of high T 1,900/KD9, free T cluster) | Kit 1 / Pillar C | **Buildable now** |
| **Vitamin D test** | `vitamin d blood test` 2,400 | **8** | ~2.4k (commercial-adjacent to our A hub) | Kit 2 / Pillar A | **Buildable now** |

## What this changes

1. **Liver function is a new, large, low-KD opportunity.** `liver function blood test` 18,100 at DFS KD 18,
   with a deep long-tail (normal values KD 4–17, interpretation KD 24, abnormal/deranged KD 16–20). Maps
   cleanly to Kit 3's liver markers (ALT/GGT/ALP). **Recommend a liver-function hub + spokes** — possibly
   its own pillar. Biggest single finding of the sweep.
2. **Phrasing changes KD dramatically — pick the easy variant as the H1.** `symptoms of high cortisol`
   (KD 18) vs `high cortisol symptoms` (KD 58) target the same SERP; `testosterone on blood test` (KD 8)
   vs head terms. Always target the lowest-KD phrasing of a cluster and treat the rest as variants.
3. **Kit-availability gates content.** Liver / ferritin / LH / testosterone / vitamin-D map to **current
   kits** (Kit 1/2/3) → buildable now. **Cortisol (Kit 6) and thyroid (Kit 5) are future kits** → content
   is premature until the kit exists (or build 1–2 weeks ahead of each kit launch, per the future-kit
   sequencing). Don't publish test-intent content for a kit we can't sell yet.
4. All of these are health content → **Ewa sign-off required** before any goes live, same as the 5 launch articles.

## Recommended merge into keywords.csv (pending Keith approval)

Add only the **canonical heads** (not the 364 variants) for the buildable-now clusters, with
`coverage_status=unassigned`, `notes="DFS-KD; expansion sweep 2026-05-30"`:
- `liver function blood test` (18,100), `liver function test results` (2,900), `abnormal liver function test` (1,600)
- `ferritin blood test` (8,100), `what is ferritin blood test` (1,300)
- `luteinising hormone` (8,100), `what is luteinising hormone` (1,000)
- `testosterone on blood test` (3,600), `signs of high testosterone` (1,900)
- `vitamin d blood test` (2,400)

Hold cortisol + thyroid heads in this shortlist (don't merge) until Kit 5/6 are confirmed.
