# Blog Content Calendar

Single source of truth for **what publishes when**. The blog has a publication gate
(`status: draft | published` in each article's MDX frontmatter), so nothing goes live
until it is scheduled here and flipped. Launching the `/blog` route no longer dumps every
article live at once.

---

## How the gate works

- Each article in `09_website-app/frontend/content/blog/*.mdx` carries `status:` in its frontmatter.
- **`status: published`** → live in production and listed in `/blog`.
- **`status: draft`** (or missing) → hidden in production; still visible on localhost / preview
  builds so it can be reviewed before go-live. Fails safe: a forgotten flag stays hidden.
- The gate is enforced in one place (`lib/blog.ts` → `getAllArticles()` + `isVisible()`), so
  listings, the article page, author pages, the sitemap, and OG images all respect it. A draft's
  direct URL 404s in production.

## Cadence (locked)

**Two articles per week.** Publish days: **Monday + Thursday**.
**Launch: Monday 8 June 2026.** Full set live Thursday 18 June 2026.
*(Re-baselined 2026-06-07 from the original Fri 5 Jun / Tue + Fri schedule, which slipped before any slot was flipped.)*

## Pillar mix target (audience tiers)

Source: `01_strategy/phase0-v7-implications.md` (V7 repositioning, tracker item #31). The pipeline
should *not* be TRT-weighted. Target blend across what we publish:

- **~40% pure-wellness** — general men's health (sleep, training, nutrition, energy), non-TRT.
- **~40% clinical-curious** — the "I tested but my results came back normal, now what?" cohort
  (the majority of Kit 1 / Kit 2 buyers); marker explainers, normal-range framing, what-a-result-means.
- **~20% TRT-specific** — testosterone / andropause / treatment-adjacent narrative.

**Pillar → tier map** (use when selecting the next brief from the queue):

| Tier | Pillars |
|------|---------|
| **Wellness** | A Vitamin D · B Fatigue · Omega-3 loop |
| **Clinical-curious** | D Markers (CRP/ferritin/fbc/b12) · G Inflammation · H Liver · I Metabolic/cholesterol · J Thyroid · C Testosterone (testing/normal-range angle) · F Patient-data (GEO) |
| **TRT-specific** | E Andropause/male-menopause · Sexual function / low sex drive |

**Two structural caveats — read before "correcting" the mix:**

1. **TRT-specific (E + sexual function) is compliance-gated and HELD for Ewa.** Until those pillars
   clear sign-off, the achievable TRT share is **~0%, not 20%** — and that is the correct, safe state
   pre-Ewa, not a miss. The 20% slot opens only once Pillar E is approved.
2. **The pillar set skews clinical-curious by construction** — the highest-demand, lowest-compliance
   gaps (D markers, liver, metabolic, thyroid) are all clinical-curious. Left unmanaged the pipeline
   drifts to ~60%+ clinical-curious. **The operative near-term rule is therefore: protect a wellness
   floor of ~40%** by deliberately interleaving a wellness pillar (A / B / Omega-3) for roughly every
   clinical-curious one, rather than draining the clinical-curious queue first because it ranks easiest.

When briefing the next slot from the queue below, check the running tally of published pieces by tier
and pick to move toward the target (subject to the wellness floor and the TRT gate).

## Publish order (locked)

Order is fixed by the SEO plan and internal-link dependencies. **A.hub + A.1 publish together** —
the A.1 spoke links up to the A.hub three times inline and 404s if it ships first.

| Slot | Target date | Day | Article(s) | File(s) | Pillar |
|------|-------------|-----|------------|---------|--------|
| 1 | Mon 8 Jun 2026 | Launch | Inflammatory Markers Blood Test | `inflammatory-markers-blood-test.mdx` | G hub |
| 2 | Thu 11 Jun 2026 | Thu | Low Vitamin D Symptoms **+** 14 Signs of Vitamin D Deficiency | `low-vitamin-d-symptoms.mdx` **+** `14-signs-of-vitamin-d-deficiency.mdx` | A hub + A.1 spoke |
| 3 | Mon 15 Jun 2026 | Mon | CRP Blood Test | `crp-blood-test.mdx` | D hub |
| 4 | Thu 18 Jun 2026 | Thu | The Myth of the Normal Range | `myth-of-normal-range.mdx` | C spoke |

> All five start as `status: draft`. Each slot goes live by flipping its article(s) to
> `status: published` + stamping the publish date on that day (see procedure below).

**Published state (live):** Slot 1 (8 Jun), Slot 2 (11 Jun), Slot 3 — CRP Blood Test — 15 Jun (`80f38fe`), **Slot 4 — The Myth of the Normal Range — published 18 Jun 2026** (`c1c9c41`). **All 5 launch articles now live.** Next articles come from the demand+gap queue below.

**Beyond the launch set:** **Pillar B hub `why-am-i-always-tired` — published 2026-06-18 (`c1c9c41`+ publish commit).** First **non-clinical / lifestyle** article (SEO lifestyle-hook category, "OVA"=Ewa light sight-check path, CA-016). Owns the ~54k/mo "why am i (always/so) tired" cluster; ties to Kit 2. DFS-re-rank-driven (Semrush had over-rated the cluster's KD).

## How to publish a slot (the flip procedure)

For each article in the slot, on its target date:

1. In the article's frontmatter, set `status: published`.
2. Update `date:` (and `dateModified:` if relevant) to the **actual publish date** — this staggers
   the visible dates so the blog reads as a natural cadence, not a batch dump. (All five currently
   share `2026-05-27`; that gets overwritten at flip time.)
3. Commit by path and deploy. The article goes live on the next build.

## Future articles

New articles (B hub "why am i always tired", C hub "testosterone test uk", further spokes) slot in
after Slot 4 at the same two-per-week cadence. They land in `content/blog/` as `status: draft` and
get added to the table above when scheduled. Order continues per the 12-week plan in
`blog-ai-seo-strategy.md`. Pillar E and the competitor-comparison pages remain blocked on Ewa sign-off.

## Next wave — demand+gap-informed queue (sequenced through the moat lens)

Derived from `portfolio-demand-gap-map.md` + `discovery-symptom-first.md`. **Sequencing rule:** win the
underserved-gap windows first; use commodity symptom terms as *hooks*, never as rank targets; hold
compliance-gated clusters for Ewa. (Read the map's "parity vs moat" note — content is an input, not the edge.)

**Tier 1 — winnable / underserved, low compliance risk (brief these first):**
1. **Liver hub + spokes** — `liver function blood test` 18,100, SERP underserved, no UK men's specialist, decision locked. Highest-value gap. (→ Kit 3 Plus / Liver kit.)
2. **Metabolic** — hooked on `visceral fat` (18,100) but *targeting* the underserved metabolic terms (hba1c, cholesterol, apob). Belly-fat terms = positioning only, not rank targets. (→ Kit 3 Plus.)
3. **Brain fog** (14,800) — maps to B12/thyroid. (→ Kit 2 / Kit 5.)
4. **Omega-3 loop content** — heart/brain + the wide-open `vegan omega 3` (3,600, KD0). (→ Omega-3 supplement loop.)

**Tier 2 — compliance-gated, HOLD for Ewa (Pillar E / ASA sexual-function surface):**
- **Male menopause / andropause** (~10k cluster, low KD) — the umbrella narrative; Pillar E gate.
- **Low sex drive** (Kit 1 front-door) — ASA-sensitive.
- **Night sweats in men** (8,100) — hormone/andropause adjacent; lower risk but pairs with the andropause story; filter illness-related volume.

**Do NOT brief as SEO targets** (commodity battlegrounds we lose on authority): `how to lose belly fat`,
`best omega 3 supplement`, generic testosterone-booster terms. Use the language as hooks only.

**Differentiation work that beats any of the above (per the moat note):** original UK male-health data
piece (digital-PR + AI-citation play) and the test→supplement→retest loop polish. Higher leverage than
another ranking article.
