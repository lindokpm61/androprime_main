# SERP + GEO Findings — DataForSEO, UK, 2026-06-21

Phases 5–6 of the single-source rebuild (`seo-data-rebuild-build-doc.md`). All DataForSEO.
Artifacts: `serp-aio-priority-2026-06-21.csv` (35 priority terms), `geo-citations-2026-06-21.csv`
(48 LLM answers). Total pull cost ~$2.08.

---

## Headline

**Our space is AI-mediated and we are invisible in it.** AI Overviews appear on **31 of 35** priority
SERPs, the LLMs answer these buyer questions with cited sources — and **Andro Prime is cited 0 times
across 48 LLM answers** (4 engines × 12 money queries). GEO is not a side-bet here; it is the channel.

---

## Phase 5 — SERP + AI Overview (35 winnable priority terms)

- **AI Overview present on 31/35 (89%).** Ranking organically is increasingly being *summarised* by an
  AIO above the fold — so the citation game matters as much as the blue link.
- **SERP-gap verdicts:** 14 CONTESTED (a UK DTC — Medichecks/Thriva/Forth — already in the top-5),
  20 MIXED, 1 pure WEDGE. The verdict is deliberately strict (WEDGE = *every* top-5 is a US authority /
  NHS / charity with no DTC). MIXED is the real contestable middle.
- Pure-wedge example: `serum gamma gt level` (8,100, KD 4) — top-5 = MedlinePlus / Cleveland / a single
  NHS trust, no UK consumer specialist.

## Phase 6 — GEO citation baseline (4 engines × 12 buyer queries)

Engines: ChatGPT (o4-mini), Claude (sonnet-4-6), Gemini (2.5-flash), Perplexity (sonar-pro), all with
web search. Queries = buyer-intent "best private [test] UK" across our kit/pillar markers (CRP,
ferritin, FBC, testosterone, cholesterol, cortisol, thyroid, liver, B12, vitamin D, HbA1c, inflammation).

- **Andro Prime: 0 citations.** Across all 48 answers.
- **Who the LLMs cite** (directional — see caveat): privatebloodtestslondon, Medichecks, Blue Horizon,
  Holdens, Nuffield, OneDayTests, Forth, Thriva, MonitorMyHealth, plus a long tail of private clinics —
  **and Reddit.**
- **The AI-cited set ≠ the organic-ranked set.** Smaller private clinics, comparison/listicle pages,
  and Reddit threads punch above their organic weight in AI answers. Being cited is about being the
  *kind* of source an LLM reaches for (clear structured answers, comparisons, community corroboration),
  not just ranking.
- All four engines return citations and are usable for ongoing tracking.

---

## What this changes

1. **GEO becomes a first-class workstream with a measured baseline (0).** The Measurement-Analyst
   (~July) tracks Andro-Prime citation count per engine over time off this zero.
2. **The rebuilt priority formula should weight `geo_opportunity` heavily** — AIO present + we're not
   cited = high-leverage. Most priority terms qualify.
3. **Content structure for citation, not just ranking:** crisp answer-first blocks, comparison tables,
   FAQ/schema, named UK-male framing — the formats LLMs lift. (Reinforces the existing AI-snippet block
   + FAQPage schema rules.)
4. **Reddit matters for GEO** — corroboration in community threads feeds AI answers (consistent with the
   existing Reddit-engagement rules in `seo-content-context.md`).

---

## Caveats

- **Citation-frequency ranking is directional, not exact.** The Phase-6 aggregator truncated some
  domain strings and included Gemini `vertexaisearch` redirect wrappers. The *set* of cited brands and
  the 0-Andro-Prime finding are solid; precise per-domain counts need a clean re-parse of the raw
  payloads when GEO tracking is operationalised (Measurement-Analyst).
- SERP-gap verdict is a coarse heuristic (top-5 domain classes); use it to triage, not as final word.
- Money-query framing was buyer-intent ("best private X UK"); informational GEO (e.g. "what is X") will
  cite a different, more explainer-heavy set — worth a second pass when prioritising glossary spokes.

---

*Phases 5–6 of the single-source rebuild. Next: Phase 7 (recompute priority from DFS-only inputs) →
Phase 8 (rebuilt `keywords.csv`) → Phase 9 (CSV↔DB loop) → Phase 10 (provenance rule).*
