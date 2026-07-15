# Content strategy: Tier-1 ideas (Decode Results, Free-T hero, Track/retest)

*Created 2026-07-14. Built on the primary-source VOC in `voc-reddit-quora-2026-07-14.md`. Extends the existing pillar architecture in `seo-content-context.md`, `blog-ai-seo-strategy.md`, and `content-engine-roadmap.md`. Does NOT replace them.*

> **Read this first.** This plan is an extension layer, not a new pillar set. It maps three product ideas onto pillars that already exist (C testosterone, D markers explained, F patient-owned data) and onto the already-published `myth-of-normal-range` article. Where a topic already has a home or an owner decision, that is noted. All search volumes below are DIRECTIONAL and must be validated against `portfolio-demand-gap-map.md` plus a fresh DataForSEO pull before any brief is written (data-provenance rule, `seo-content-context.md`: DFS only, never Semrush).

## The through-line

The three ideas are one funnel narrative the VOC already speaks:

1. "Normal" is a lie (Free-T hero, the hook, Persona 1).
2. So get the test that reads your usable testosterone.
3. Here is what your results actually mean (Decode, the product, both personas).
4. And here is how we watch the trend so it never sneaks up on you (Track/retest, retention, Persona 2).

Content should ladder that sequence, not silo it.

---

## Mapping to existing pillars (no new pillars created)

| Tier-1 idea | Existing home | What is net-new here |
|---|---|---|
| Free-T / SHBG / FAI hero ("normal is a lie") | Pillar C (Testosterone) + published `myth-of-normal-range` article | The total-vs-free and SHBG angle as a distinct sub-cluster, backed by VOC Theme A |
| Decode My Results (interpretation) | Pillar D (Blood test markers explained) | A per-marker explainer set framed as "what your result means and what to do", the ChatGPT-replacement job |
| Track + retest reminders | Pillar F (Patient-owned data, GEO flagship) + retention email row | Retest-cadence and trend content as a named cluster |

---

## Sub-cluster 1: "Normal isn't optimal" (Free-T hero, under Pillar C)

Owns VOC Theme A, the loudest, highest-intensity, best-defended message. Product tie: Kit 1 measures Free T, SHBG, FAI, Albumin, Free T, most competitors report total T only.

Anchor asset already exists: `content/blog/myth-of-normal-range.mdx` (published, Ewa-signed). There is also a pending reoptimisation proposal (`reoptimisation-myth-of-normal-range-2026-06-18.md`) awaiting Ewa. **Do not spin up a competing hub. Extend the existing article and add spokes around it.**

Proposed spokes (validate volumes first):

- Total vs Free Testosterone: what the difference actually means (awareness, high intent).
- What is SHBG, and why it can make "normal" testosterone useless (awareness).
- Morning testosterone testing: why timing changes your result (fixes a top interpretation error).
- nmol/L vs ng/dL: reading UK vs US testosterone results (UK-specific, near-zero competition, note this partly overlaps the pending reoptimisation unit-note, coordinate so they do not collide).

Note: several of these terms (e.g. "testosterone normal range vs optimal range") were deprecated in the May-2026 Semrush validation for zero UK volume (`seo-content-context.md`). Re-check on DFS before committing, the earlier null may have been a Semrush artefact.

## Sub-cluster 2: "Decode your bloods" (interpretation, under Pillar D)

Owns VOC Theme B. This is the ChatGPT-as-doctor replacement and the strongest AI-search citation surface. Pillar D already targets `crp blood test` (18.1k), `fbc blood test`, `nhs blood test`, etc. Add a men's-panel interpretation layer:

- Per-marker explainer set (programmatic-ready, one page per marker): Testosterone, Free T, SHBG, FAI, Vitamin D, Active B12, Ferritin, hs-CRP. Format: "[Marker] blood test results explained: high, low, and what to do." Route through `/programmatic-seo`, highest AI-search leverage per unit effort.
- "My results are freaking me out": a calm walkthrough of a men's panel (shareable, uses the exact VOC phrase).
- Why your GP's "you're fine" and your symptoms can both be true (links Theme A and Theme B).

Compliance: interpret and educate only. No "diagnose / treat / cure". Low-T result copy routes to GP referral, not a supplement upsell. Ewa signs off all marker interpretation copy.

## Sub-cluster 3: "Track, don't guess" (retest + trend, under Pillar F + retention)

Owns VOC Theme C and D. Retention and subscription pillar. Pillar F is the patient-owned-data GEO flagship (measured by AI citation, no Google volume target), this cluster gives it concrete articles.

- How often should men retest their bloods? A sensible schedule (answers a constant VOC question, Ewa to approve cadence).
- What your testosterone trend tells you that a single test can't (shareable, the "10 years of bloodwork" insight).
- Do testosterone-boosting supplements actually work? An honest, test-first answer (targets Persona 3, EFSA-safe, ashwagandha silent).
- Vitamin D and testosterone: what the evidence really shows (Vit D was the one supplement VOC repeatedly credited, deficiency-framed, ties to Pillar A).

---

## Priority and build order (LOCKED 2026-07-14, DFS-validated)

> **Validation status: COMPLETE and reconfirmed via MCP.** All Google-volume topics are locked against live DataForSEO data (UK, English, pulled 2026-07-14, `kd_source=dfs`, so every row can drive a brief). The `mcp__dataforseo__*` connector was fixed (unset env-var creds in `.mcp.json`) and reconnected, and a second pull through the MCP tool **confirmed the REST figures exactly**, with two refinements now folded in: CRP is KD 12 (not 11), and ferritin difficulty is now known at **KD 41** (the demand map only had its volume), which makes ferritin the hardest of the marker explainers. The provisional scores are retired. The HOLD group (Free-T / SHBG / FAI) is sized and resolved, see rank 2.

The demand map's governing rule applies: the keyword game gets us to parity, the moat is the test-to-result-to-supplement-to-retest loop plus AI citation. So topics are ranked by role. Two roles:

- **Volume assets** (rank into underserved Google demand): DFS-verified demand + beatable KD.
- **Merit / AI-citation assets** (Pillar F logic): built to convert Persona 1 or earn AI citations, not for Google volume.

| Rank | Topic | Cluster | Role | DFS basis (UK, 2026-07-14) | Confidence |
|---|---|---|---|---|---|
| 1 | Clear the pending `myth-of-normal-range` reoptimisation (title + by-age H2 + nmol/L unit note + FAQ), fold the nmol/L spoke in | 1 | Volume | ~1,200-1,500/mo cluster at KD 0-2 (reoptimisation doc, DFS 2026-06-18); already drafted, Ewa sign-off pending | High |
| 2 | **Free Androgen Index + SHBG cluster** (hub: FAI + SHBG; spokes: what is shbg, high shbg, what is free testosterone) | 1 | Volume + conversion | **free androgen index 3,600 / KD 0**; shbg 2,400 / KD 14; high shbg 590 / KD 4; what is free testosterone 390 / KD 1; what is shbg 320 / KD 11 | High |
| 3 | CRP marker explainer | 2 | Volume | crp 27,100 / KD 12; Pillar D already live | High |
| 4 | B12 + Vitamin D + Ferritin explainers (build in this order, ferritin is hardest) | 2 | Volume | b12 blood test 3,600 / KD 10; vitamin d blood test 2,400 / KD 15; ferritin blood test 8,100 / KD 41 | High |
| 5 | "Results freaking me out" full-panel walkthrough | 2 | Merit / AI-citation | VOC Theme B; no single head term ("...results explained" is null / KD 49), built as the ChatGPT-replacement + AI-citation asset | Med (role-justified) |
| 6 | Retest cadence + trend cluster | 3 | Merit / AI-citation | "how often should you test testosterone" returned no DFS data, confirming near-zero demand; build for Pillar F AI-citation, not volume | Med (role-justified) |
| 7 | "Do testosterone boosters actually work" (test-first) | 3 | Hook, NOT SEO target | booster 27,100 but contested (Numan/Manual) + commodity, so per the map it is a hook into the loop, never an SEO battleground | Med |

**Build order:** ship 1, then 2 (the Free-T/SHBG/FAI cluster, now the highest-value winnable play), then 3 and 4. Run 5 and 6 in parallel as GEO assets (no volume gate). Treat 7 as a shareable hook, low SEO effort.

**The HOLD resolved, and it promoted the Free-T angle.** The Free-T / SHBG / FAI cluster was the best-owned MESSAGE (Theme A, the Kit 1 differentiator) and is now proven to be a winnable Google play, not just a merit asset. **Free Androgen Index at 3,600 / KD 0 is one of the easiest winnable terms in the whole portfolio**, and Kit 1 measures FAI directly. So it jumps to rank 2, above the Kit 2 markers, on higher purchase-intent plus near-zero difficulty. Build the cluster as a hub (Free Androgen Index + SHBG, the two head terms) with the low-KD long-tails ("what is shbg", "high shbg", "what is free testosterone") as spokes.

**What the DFS pull ruled OUT as Google targets** (build only as merit / AI-citation copy inside other assets, never brief for volume): `free testosterone` (null vol / KD 29), `free testosterone test` (null / KD 38), `total vs free testosterone` (null / KD null), `testosterone blood test results explained` (null / KD 49). Also confirmed near-zero (no DFS data returned, so the May-2026 Semrush null was NOT an artefact): `testosterone normal range vs optimal range`, `how often should you test testosterone`. The retest cluster (rank 6) therefore stays a GEO asset, as designed.

---

## Formats that feed GEO / AI-search

- Question-headed H2s using verbatim VOC / Quora phrasing (e.g. "Can you have normal testosterone but low-T symptoms?"), LLMs lift these as answers. Pair with FAQPage schema (hand to `schema-markup`) and the on-page checklist.
- Per-marker explainers are the citation moat, structured, consistent, brand-tagged, so Andro Prime becomes the source AI returns for "what does high SHBG mean". This is the credible replacement for the ChatGPT behaviour in VOC Theme B.
- One data / shareable asset per cluster once real quiz or kit data exists (e.g. an anonymised "distribution of Free T among men told they are 'normal'"), earns links and social, the demand-creation layer.
- Short-form founder video off each anchor via `/hook` and `/script` (they already enforce the compliance rails: no invented bloodwork numbers, no TRT or ashwagandha).

---

## Compliance guardrails (baked into every brief)

- Phase 0 wellness only. No TRT offered or implied. TRT content stays educational, never "we offer it".
- EFSA-authorised claims only for any supplement mention. Ashwagandha stays silent, always.
- Low-T framing routes to GP referral, not a supplement upsell (locked 2026-06-04).
- No em dashes in customer-facing copy. No "diagnose / treat / cure".
- Every article runs `/compliance-preflight` and needs Ewa sign-off before publish, via the existing `article-briefs/` to `/article` to `/publish-article` flow.

## Next steps

1. Validate all provisional volumes against `portfolio-demand-gap-map.md` and a fresh DataForSEO pull, lock the build order.
2. Turn the retest hub (#6) and the "results freaking me out" walkthrough (#4) into briefs in `article-briefs/`, and coordinate the Free-T spokes with the pending `myth-of-normal-range` reoptimisation so they do not overlap.
3. Batch the 8 per-marker explainers as a programmatic set.
