# Pillar architecture re-rank — Semrush vs DataForSEO (2026-06-18)

> **What this is:** a re-validation of the Stage-2 pillar table in
> [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md), which was built on Semrush in May 2026.
> Andro Prime moved to DataForSEO as the sole keyword/SERP tool (Semrush dropped — see
> [[reference-dataforseo]]). This pulls fresh DFS UK vol + KD for every current pillar anchor and a
> set of candidate new-pillar anchors, and recommends expanding the pillar set from 7 to ~10.
> Companion to [`keyword-rerank-dataforseo-2026-06-18.md`](./keyword-rerank-dataforseo-2026-06-18.md)
> (that re-ranked backlog *spokes*; this re-ranks the *pillars*). Pull cost ~$0.19.

## Read-this-first caveats

1. **DFS KD ≠ Semrush KD scale.** The two KD columns are different rulers. The signal is *directional*
   (both say "easier than Semrush claimed"), not a like-for-like delta. Per the rerank convention, **DFS
   KD is not written into the `keywords.csv` `kd` column** (which is Semrush-scaled) — it goes in `notes`.
2. **DFS returns no volume for several head terms.** Both DFS endpoints (`google_ads/search_volume` and
   `dataforseo_labs/keyword_overview`) null out `testosterone test uk`, `andropause`, and the
   thyroid-function head terms. That is a genuine DFS data gap, not a tooling bug. Marked "no data".
3. **DFS `KD 0` + null volume = "no data", not "easy".** (KD 0 *with* real volume = genuinely easy,
   e.g. `vegan omega 3`.) Don't mistake an unscored term for a winnable one.
4. **This is a prioritisation signal, not a mandate.** Compliance, ICP, funnel and product-launch timing
   still decide what gets built.

---

## Part 1 — Current pillars: Semrush (locked doc) vs DataForSEO (fresh)

| Pillar | Anchor query | Semrush Vol / KD | **DFS Vol / KD** | Movement |
|---|---|---|---|---|
| **A** Vitamin D | low vitamin d symptoms | 9,900 / 36 | **9,900 / 22** | vol same, easier |
| **B** Fatigue | why am i always tired | 12,100 / 47 | **14,800 / 35** | bigger + easier |
| **C** Testosterone | testosterone test uk | 3,600 / 57 | **no data / —** | DFS can't size it |
| **D** Markers | crp blood test | 18,100 / 47 | **27,100 / 11** | much bigger + far easier |
| **G** Inflammation | inflammatory markers blood test | 1,000 / 23 | **2,400 / 22** | bigger, same KD |
| **E** Andropause | andropause | 5,400 / 42 | **no data / 30** | DFS can't size head term |
| **F** Patient-data (GEO) | *(how often should i get a blood test)* | — | **40 / —** | confirms zero search demand |

**Findings:**

- **The Semrush KD over-statement holds at pillar level, not just spokes.** Every pillar DFS could size
  came in easier (A 36→22, B 47→35, D 47→**11**). The underserved-gap thesis is even more winnable than
  the doc implies.
- **Pillar D is the standout.** 27,100 vol at KD 11 — the doc undersells the single best pillar. (Matches
  the 18 Jun spoke rerank: the whole D marker family is the highest-leverage next build.)
- **Pillars C and E are unmeasurable in DataForSEO.** Their head terms return null volume; only KD
  resolves. Clusters are real (`male menopause symptoms` 1,600 / KD 22 does return) but DFS isn't the
  tool to size them. **GSC will be the truth source** once query data accrues (~July). Worth noting: C and
  E are the two highest-compliance pillars *and* the two least-measurable ones.
- **F confirmed GEO-only.** `how often should i get a blood test` = 40 vol/mo — no Google demand, as designed.

---

## Part 2 — Candidate new pillars (DataForSEO, fresh)

| Candidate | Best anchor | DFS Vol / KD | Supporting cluster | Product route | Verdict |
|---|---|---|---|---|---|
| **Liver** | liver function blood test | **18,100 / 18** | liver blood test 18,100/30; normal range uk 720/12; abnormal 390/12 | Kit 3 Plus / Liver (unlaunched) → email | ✅ **Add now** |
| **Metabolic** | hba1c | **40,500 / 22** | hba1c test 18,100/25; hba1c normal range 14,800/22; cholesterol test 9,900/26; visceral fat 18,100/55 *(hook)* | Kit 3 Plus (unlaunched) → email | ✅ **Add now** |
| **Thyroid** | thyroid test | **6,600 / 10** | tsh levels 8,100/37; thyroid blood test normal levels 260/17; thyroid peroxidase 390/7 | Kit 5 (unlaunched) → email | ✅ **Add, staged** |
| **Brain fog** | brain fog | **14,800 / 33** | — | Kit 2 / Kit 5 | ⚠️ **B-spoke first**, promote later |
| **Omega-3** | omega 3 benefits | 8,100 / 50 | vegan omega 3 3,600/**0** | Omega-3 supplement | 🟡 supplement-content loop, not a pillar |
| **Cortisol / stress** | cortisol | 90,500 / 69 | high cortisol symptoms 12,100/58 | future cortisol kit | 🟡 huge but hard head + no product → hold |
| **Sexual function** | low sex drive | 2,900 / 42 | night sweats in men *(no data)*/44 | Kit 1 (ASA-gated) | 🔴 compliance-gated (with Pillar E) |
| **Hair loss** | blood test for hair loss | 1,000 / 0 | hair loss men 480/48 | programmatic/symptom | 🟡 keep as programmatic page, not a pillar |
| **Gut health** | gut health test | 1,900 / 0 | — | no product | 🟡 thin + no product → hold |

---

## Part 3 — Recommendation: 7 → 10 pillars

Promote three to full pillars; queue one as a spoke; hold the rest.

### New pillar H — Liver (→ email capture, redirect to Liver kit / Kit 3 Plus)
Anchor `liver function blood test` 18,100 / **KD 18**. Decision already locked in the demand-gap queue as
the highest-value gap. The cluster is deep with low-KD long-tail (normal range, abnormal, "what does it
show"). **Compliance: Medium** — liver disease + alcohol adjacency; never diagnose, strong GP-referral for
abnormal results. Brief queued: `article-briefs/pillar-H-hub-liver-function-blood-test.md`.

### New pillar I — Metabolic (→ email capture, redirect to Kit 3 Plus)
Anchor `hba1c` 40,500 / **KD 22** — the single largest winnable cluster in this re-research. **But:** the
hba1c SERP is diabetes-authority territory (Diabetes UK, NHS), so the *underserved-gap SERP check is
mandatory before brief-ready* — the winnable men's-health angle may be the metabolic framing
(cholesterol 9,900/26, apob ~KD12, visceral-fat hook) rather than the hba1c head term. **Compliance:
Medium-High** — HbA1c is the diabetes diagnostic marker; the article must never imply diagnosis and must
route diabetic-range results to a GP. Brief queued: `article-briefs/pillar-I-hub-metabolic-health.md`.

### New pillar J — Thyroid (→ email capture, redirect to Kit 5)
Anchor `thyroid test` 6,600 / **KD 10** — very winnable. Needs Kit 5 (not launched), so produce against
email capture now and redirect on launch (standard build-now-redirect-later model). **Compliance: Medium**
— hypo/hyperthyroid are diagnosed conditions; marker-explainer + GP-referral pattern. Brief queued:
`article-briefs/pillar-J-hub-thyroid-test.md`.

### Brain fog — B-spoke, not (yet) a pillar
14,800 / KD 33 is pillar-sized by volume, but it sits inside Pillar B's symptom territory (fatigue →
B12/thyroid/Vit D). A standalone pillar risks cannibalising B. Run it as B's flagship spoke; promote to its
own pillar only if GSC shows it pulling distinct queries.

### Hold / not-pillars
Omega-3 (supplement-content loop), cortisol (hard head + no product), hair-loss (programmatic), gut-health
(thin + no product), sexual-function/night-sweats (Ewa/ASA-gated with Pillar E).

---

## Cross-cutting notes

- **All three new pillars route to email capture now** — none has a live kit (Kit 3 Plus / Liver / Kit 5
  unlaunched). Content is evergreen; CTA flips when the product ships (atomisation-model §4 central CTA map).
- **All three carry Medium+ compliance** despite low KD, because each names a diagnosable disease. None is a
  "free" low-risk win like the D marker spokes — each needs Ewa sign-off on the marker-explainer + GP-referral.
- **Sequencing vs the existing queue:** the 18 Jun spoke rerank says the **D marker spokes** (ferritin, fbc,
  b12 — KD ≤ 26, low compliance, off the live CRP hub) are the highest-leverage *immediate* build. The new
  pillars here are the next *strategic* expansion. Suggested order: D marker spokes → Liver hub → Metabolic
  hub (after SERP gap check) → Thyroid hub. Confirm with Keith.

## Decisions taken (2026-06-18)

- Add pillars **H Liver, I Metabolic, J Thyroid** to the strategy doc (DFS column added alongside Semrush,
  not overwriting it).
- Three hub briefs **queued** in `article-briefs/` (status `queued`, not `brief-ready` — each still needs the
  SERP underserved-gap check, full CSV cluster lock, and Ewa compliance assessment before drafting).
- New pillar anchor + top spoke rows added to `keywords.csv` as `coverage_status=planned`, `assigned_to`
  set, DFS KD in `notes` (CSV `kd` left blank — Semrush-scaled column).

*Owner: Keith Antony. Pulled via `tools/dataforseo.mjs` (UK/en). DFS balance after: $48.40.*
