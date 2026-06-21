# SEO Data Engine — Single-Source Rebuild (Build Doc)

**Created:** 2026-06-21 | **Owner:** Keith Antony | **Status:** APPROVED FOR BUILD — this is the spec we build from.

> **What this is:** the build specification for rebuilding the keyword/SEO/GEO data layer on
> **DataForSEO as the single source**, retiring the mixed Semrush/DataForSEO data that caused
> drift. It also scopes the deeper competitor teardown (on DFS) and the GEO/LLM dataset.
> Entry point for the wider engine stays `content-engine-roadmap.md`; this doc owns the data layer.

---

## 1. Why this exists (the problem)

The keyword data was built across two providers and never fully reconciled:

1. **Mixed-provider KD.** Locked KD in `keywords.csv` is **Semrush** (one-time trial). The 2026-06-18 re-rank corrected KD on **only four pillars** via DataForSEO. The `kd` column is now a silent blend of two non-comparable scales — sorting it lies. Proven divergence: `crp blood test` Semrush 47 vs DFS 11; `signs of high testosterone` Semrush 49 vs DFS 9.
2. **Corrupted difficulty verdicts propagated.** `competitor-organic-teardown.md`'s "Avoid: KD too high" list (e.g. *what is cortisol 89, ferritin 69, signs of low T 70*) was scored on Semrush KD — the exact metric we disproved. Some "avoid" calls are likely easy wins wrongly buried.
3. **CSV ↔ DB drift.** The engine runs off DB tables (`keyword_queue` → `content_pipeline` → `blog_articles`), **not** `keywords.csv`. Nothing writes CSV `coverage_status` back from the DB, so the plan and reality diverge (the 3 in-flight articles aren't even marked in the CSV; 308/402 rows have blank `coverage_status`).
4. **Selection is unenforced.** No code bridges the prioritised CSV into `keyword_queue`; rows are hand-inserted. What gets written depends on a human remembering the plan, not on the plan driving the work.

**Fix:** rebuild the *data layer* single-source on DFS; preserve the *strategy layer* (pillars, hub/spoke roles, kit mapping, compliance gates — human judgment DFS can't produce); close the CSV↔DB loop so selection is deterministic and the CSV stops lying.

---

## 2. Principles (non-negotiable for this rebuild)

1. **One source for every number that drives selection: DataForSEO.** Volume, KD, SERP composition, AI Overview, GEO/LLM data — all DFS. No exceptions.
2. **Semrush is historical only.** Existing Semrush docs get a dated "metrics superseded — do not feed priority" banner. Their *strategic conclusions* (glossary strategy, digital-PR model) survive; their *numbers* never touch a priority again.
3. **Rebuild data, preserve strategy.** The 10-pillar architecture, hub/spoke roles, kit mapping, ICP, and compliance gates are kept and re-attached to fresh data — not re-derived.
4. **Provenance is explicit.** Every metric row declares its source (`kd_source`, pull date). A future reader can always tell what's trustworthy.
5. **Single operational source of truth for "what's live": the DB.** The CSV is the human-editable plan; the DB is runtime. A reconciler keeps them honest in one direction (DB → CSV coverage).

---

## 3. Confirmed DataForSEO capabilities + real costs

Probed live against the account 2026-06-21. Balance at probe: **$48.07**.

| Capability | Endpoint | Status | Real cost/call |
|---|---|---|---|
| Keyword vol + KD | `/v3/keywords_data/google_ads/search_volume/live` + `/v3/dataforseo_labs/google/bulk_keyword_difficulty/live` | ✅ enabled | ~$0.01 / batch (≤1000 kw) |
| Keyword expansion | `/v3/dataforseo_labs/google/keyword_suggestions/live` · `/related_keywords/live` | ✅ enabled | ~$0.011 |
| Domain content map | `/v3/dataforseo_labs/google/relevant_pages/live` (+ `ranked_keywords`, `domain_intersection`) | ✅ enabled | $0.0101 |
| SERP composition + AI Overview | `/v3/serp/google/organic/live/regular` | ✅ enabled | $0.002 |
| GEO: AI search volume + intent | `/v3/ai_optimization/ai_keyword_data/keywords_search_volume/live` | ✅ enabled | $0.0101 |
| GEO: AI-cited sources + AI vol | `/v3/ai_optimization/llm_mentions/search/live` | ✅ **trial active** | $0.103 |
| GEO: live LLM answer + citations | `/v3/ai_optimization/{provider}/llm_responses/live` — **all 4 providers confirmed** | ✅ **trial active (14-day)** | Perplexity $0.015 · ChatGPT $0.021 · Claude $0.027 · Gemini $0.068 |
| Backlink / PR profile | `/v3/backlinks/summary/live` | ⏸️ **deferred** (subscription; site too new) | n/a |

**Schema quirks found (carry into the tool):**
- LLM Mentions: `platform: "google"` accepts `location_name`; `platform: "chat_gpt"` **rejects `location_name`** (use `location_code` or omit).
- LLM Mentions keyword targeting surfaces *related* AI questions, some tangential (a "testosterone test uk" pull drifted to "osteoporosis"). **GEO pulls need light human curation, not blind ingestion.**
- LLM Responses is per-provider: `/v3/ai_optimization/{provider}/llm_responses/live` — **all four confirmed** (`chat_gpt`, `claude`, `gemini`, `perplexity`). Each has a **free** `/models/` endpoint; pull it to get valid `model_name` values, and pick a **web-search-capable** model.
- **Claude caveat:** `claude-sonnet-4-6` returned an answer but **no citations** in the probe (the other three cite cleanly). Citations are the point of GEO — confirm the right Claude model/`web_search` combo during the build, or treat Claude as answer-only.

**First GEO pull already gave intel:** for "crp blood test" (AI vol ~27,100) AI cites Medichecks, NHS trusts, labtestsonline, redcliffelabs, onedaytests, Cleveland Clinic. ChatGPT's "best private CRP test UK" answer ranked Repose Healthcare (£29.99) and others, each cited. **Andro Prime appears in none of it despite a published CRP article — that gap is the measurable GEO opportunity.**

---

## 4. Tool build — new `tools/dataforseo.mjs` subcommands

Extend the existing single tool (don't fork). Keep `balance|overview|suggest|related`. Add:

| Subcommand | Wraps | Output |
|---|---|---|
| `serp "<kw>"` | SERP organic live/regular | ranked URLs/domains + position, AI Overview present? + AIO cited sources |
| `teardown <domain>` | Labs `relevant_pages` + `ranked_keywords` | competitor's top pages by traffic/keyword footprint |
| `gap <ourDomain> <competitor…>` | Labs `domain_intersection` / ranked-keyword diff | keywords competitors rank for that we don't = backlog |
| `mentions "<kw>" [--platform google\|chat_gpt]` | LLM Mentions search | AI-search questions + cited source domains + AI vol |
| `responses "<prompt>" [--provider chat_gpt]` | LLM Responses live | the LLM answer + citation URLs |

Conventions to preserve: UK/English defaults, `--json` flag, `--limit`, CSV-to-stdout for the keyword-shaped commands, cost printed to stderr, auth from repo-root `.env`. Apply the §3 schema quirks (location handling per platform).

---

## 5. Data model decision (needs Keith sign-off before build)

The drift in §1.3/1.4 is the core maintainability problem. **Recommended model:**

- **`keywords.csv` stays the git-tracked human master** for the *strategy + plan* layer (priority, pillar, kit mapping, compliance, intent) and holds the *refreshed DFS data* columns. Git-tracked = reviewable by Keith, no DB UI needed.
- **New columns:** `kd_source` (always `dfs` post-rebuild), `kd_pulled` (date), `serp_verdict` (who owns page 1, short), `ai_cited` (domains AI cites for this term), `ai_vol`.
- **Two scripts close the loop:**
  - **Importer** (`csv-to-queue`): selected/priority CSV rows → `keyword_queue` as `accepted`. Selection becomes deterministic (priority-ordered), not hand-typed.
  - **Reconciler** (`queue-to-csv`): `blog_articles.status` + `content_pipeline.stage` → write `coverage_status` / `primary_article_slug` back into the CSV. The CSV stops lying.

**Alternative (noted, not recommended now):** make `keyword_queue` (DB) the sole master and reduce the CSV to a generated export. Cleaner single-store, but worse for human review and Keith's editing workflow. **Decision for Keith: CSV-master (recommended) vs DB-master.**

---

## 6. Build & run sequence (phased)

Run the teardown **first** so it generates the universe; score it second. Don't score the stale 402-row CSV.

| Phase | Action | Tooling | Est. cost/pass |
|---|---|---|---|
| 0 | Build the §4 subcommands + §5 scripts | code | $0 |
| 1 | **Competitor teardown** — Medichecks, Thriva, Forth, **Vitall** | `teardown` | ~$0.10 |
| 2 | **Content-gap backlog** — their glossary/ranked keywords minus our coverage | `gap` | ~$0.05 |
| 3 | Assemble candidate universe (teardown gap + existing pillars), dedup | code | $0 |
| 4 | **Vol + KD** for the whole universe, single batch, `kd_source=dfs` | `overview` | ~$0.05 |
| 5 | **SERP + AI Overview** read on priority set (~80–120 terms) | `serp` | ~$0.20 |
| 6 | **GEO** — Mentions + Responses (×4 engines: ChatGPT/Claude/Gemini/Perplexity) on priority money terms (~50) | `mentions`/`responses` | ~$6–7 |
| 7 | **Recompute priority** from DFS-only inputs (§7 formula) against preserved pillar/strategy layer | code | $0 |
| 8 | Write rebuilt `keywords.csv` (new schema, all DFS) | code | $0 |
| 9 | Wire **importer + reconciler**; backfill in-flight rows | code | $0 |
| 10 | Banner Semrush docs historical; add provenance rule to `seo-content-context.md` + `content-engine-roadmap.md` | docs | $0 |

**Total per full rebuild pass: roughly $4–7.** GEO (Phase 6) dominates and is the one to cap — it's a targeted pull, never run-everything.

---

## 7. Priority formula (DFS-only, reproducible)

Replace the implicit Semrush-era scoring with an explicit one so priority is recomputable, not hand-assigned:

```text
priority input = f(
  strategic_role,      # hub anchor > spoke > tail  (from pillar architecture — preserved)
  demand,              # DFS search volume (+ ai_vol for GEO weight)
  winnability,         # SERP-gap verdict (who owns page 1) + DFS KD — SERP read dominates, KD secondary
  geo_opportunity,     # AI Overview present + we're not cited = high
  compliance_gate      # VETO: Ewa-gated / heavy-burden terms cannot be priority 1 regardless
)
```

Winnability uses the **SERP-gap read first** (US-authority / NHS-regional / charity ownership with no UK men's specialist = wedge), with DFS KD as a secondary tie-breaker — never KD alone. **Decision for Keith: confirm the weighting** (default: strategic_role and winnability lead; demand and geo modify; compliance vetoes).

---

## 8. Decisions needed before build starts

1. **Data model** (§5): CSV-master + loop scripts *(recommended)* vs DB-master.
2. **Competitor set** (§6.1): Medichecks, Thriva, Forth, Vitall *(recommended)* — add/remove any?
3. **Priority weighting** (§7): accept the default, or adjust.
4. **GEO budget per pass** (§6.6): cap at ~$5 / ~50 terms *(recommended)*, or set otherwise.
5. **Legacy rows:** rebuild the universe from the teardown and re-validate all 402 existing rows *(recommended)*, or only re-validate priority 1–2 to save cost.

---

## 9. Provenance rule (to be written into `seo-content-context.md`)

> Every keyword metric that drives selection — volume, KD, SERP, AI Overview, GEO — comes from **DataForSEO**. Semrush data is dated historical context and must never feed a priority, a coverage decision, or a brief. Each data row in `keywords.csv` carries `kd_source` and a pull date; a row without them is unverified and cannot be used for selection.

---

## 10. Build checklist

- [x] §5 data-model decision signed off by Keith — **CSV-master + loop (2026-06-21)**
- [x] §4 subcommands added to `tools/dataforseo.mjs` (+ schema quirks) — **`serp`/`teardown`/`ranked`/`gap`/`mentions`/`responses` built + live-validated 2026-06-21**
  - Finding: SERP `live/regular` did not return an AI Overview for "crp blood test" — use `live/advanced` for AIO capture.
  - Finding: `gap` raw output needs filtering (brand/typo/clinical) — reuse `keyword-scout.ts` CLINICAL stoplist + vol/KD/dedup in Phase 2.
- [x] §5 importer + reconciler scripts — **built + verified 2026-06-21.** `scripts/content-engine/csv-to-queue.ts` (CSV priority rows → keyword_queue as **candidate**; cluster-collapse + local-intent/NHS-NAV/gate/owned filters) + `reconcile-coverage.ts` (DB → CSV coverage_status, row-stable).
- [x] Phase 1–2: teardown + content-gap → backlog — **done 2026-06-21.** Output: `competitor-organic-teardown-2026-06-21-dfs.md` + `teardown-gap-backlog-2026-06-21.csv` (544 candidates). Old Semrush teardown bannered historical. Key find: FBC red-cell-index sub-glossary + biomarker glossary; Vitall organically negligible.
- [x] Phase 3–4: assemble/dedup (769 unique, only 5 CSV∩backlog) + DFS vol/KD — **done 2026-06-21.** Output: `keyword-universe-dfs-2026-06-21.csv`. Finding: 473/769 are DFS KD≤20 — Semrush had inflated the whole space; 275 winnable terms (vol≥1000, KD≤25).
- [x] Phase 5–6: SERP/AIO + GEO pulls — **done 2026-06-21 (~$2.08).** Output: `serp-aio-priority-2026-06-21.csv`, `geo-citations-2026-06-21.csv`, `geo-serp-findings-2026-06-21.md`. Findings: AI Overview on 31/35 priority terms; **Andro Prime cited 0/48 LLM answers** (GEO baseline); all 4 engines usable.
- [x] Phase 3.5: bottom-up discovery (`suggest`/`related` on pillar seeds) — **done 2026-06-21.** +243 distinct user-phrased terms (69 winnable) the gap missed; universe → 1,012. Finding: DFS suggest/related is permutation-noisy; needs stemmed dedup.
- [x] Phase 7: stemmed dedup + DFS priority recompute + SERP-validation of top tiers — **done 2026-06-21.** Output: `keywords-rebuilt-dfs-2026-06-21.csv` (review file, 886 distinct; P1 5 · P2 34 · P3 543 · P4 304; 106 compliance-gated). Added navigational/NHS guard (caught `nhs health check`, `alp blood test`, etc.); `blood test` (49.5k, KD 10) verified navigational-NHS → demoted P4. Priority leans SERP-read over KD. **Known residuals for human curation: US-spelling FBC dups, head-term volume artifacts (`manopause`), local-intent terms.**
- [x] Phase 8: swap into `keywords.csv` (master) — **done + verified 2026-06-21.** Row-stable merge (preserves article line-number refs + audit's `f[6/11/12]` column positions; new DFS cols appended at 13+). 1,050 rows (401 preserved: 256 DFS-refreshed / 145 legacy-flagged; 649 net-new). `kd_source=legacy` marks rows not DFS-revalidated. **Coverage audit re-run: all 6 published articles PASS, 0 hard fails, exit 0.** Review file `keywords-rebuilt-dfs-2026-06-21.csv` kept as provenance.
- [x] Phase 9: CSV↔DB loop live — **done 2026-06-21.** Reconciler committed (3 in-flight rows → `drafted` + slug backfilled, audit still green). Importer E2E-verified: 15 candidates in keyword_queue. Importer inserts `candidate` (human promotes at the content gate — where the "standalone article vs coverage-under-a-hub" call lives; auto-dedup can't resolve the FBC mch/mchc/mcv synonym family).
- [x] Phase 10: Semrush docs bannered; provenance rule written — **done 2026-06-21.** Provenance rule added to `seo-content-context.md`; `competitor-organic-teardown.md` + `keyword-clusters.md` bannered historical (metrics superseded, groupings/conclusions kept).
- [x] `content-engine-roadmap.md` Stage-1 updated to point here — **done 2026-06-21.**

---

*This doc supersedes the mixed-provider approach. Backlinks API is deferred until the site has launched and link-building becomes active (per `competitor-organic-teardown.md`: PR is not urgent pre-launch).*
