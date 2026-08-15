# SEO keyword tools

## dataforseo.mjs

Pay-per-call keyword validation/expansion via the DataForSEO API. This is the **ongoing**
keyword tool: Semrush MCP is one-time/trial only (see the `reference-semrush-options` memory).
Used by the `/article` skill to validate spokes before writing a brief, and ad-hoc for expanding
`keywords.csv`.

**Auth:** reads `DATAFORSEO_BASE64` (or `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`) from the
repo-root `.env`. No dependencies: Node 18+ only. Defaults to UK / English.

```bash
cd andro-prime/06_marketing/seo-ai-search/tools
node dataforseo.mjs balance
node dataforseo.mjs overview "high cortisol symptoms" "what is hba1c"   # validate specific keywords
node dataforseo.mjs overview --file seeds.txt                          # one keyword per line
node dataforseo.mjs suggest "cortisol blood test" --limit 40           # long-tail expansion
node dataforseo.mjs related "tsh levels" --limit 40                    # "searches related to"
```

Output is CSV matching the leading columns of `../keywords.csv` (`query,vol,kd,cpc,competition,intent`).
Add `--json` for raw rows. Pipe to a file to stage candidates for review before merging.

## DataForSEO MCP server

As of 2026-07-13 the official DataForSEO MCP server (`dataforseo-mcp-server`, npm) is also wired
into this repo. It exposes 89 DataForSEO endpoints as MCP tools (SERP, DataForSEO Labs, keyword
data, AI-optimization / LLM-mentions) for interactive use, alongside the CLI `dataforseo.mjs` above.

- **Config:** repo-root `.mcp.json`, server key `dataforseo`. Launched Windows-safe via
  `cmd /c npx -y dataforseo-mcp-server@latest`.
- **Auth:** `${DATAFORSEO_USERNAME}` / `${DATAFORSEO_PASSWORD}` env expansion (no secrets in
  `.mcp.json`). These are persisted as Windows **user** env vars; `DATAFORSEO_USERNAME` is the same
  value as `.env`'s `DATAFORSEO_LOGIN` (the MCP server names it `USERNAME`, not `LOGIN`). Re-run
  `setx`/`[Environment]::SetEnvironmentVariable` from `.env` if creds rotate.
- **Loads at Claude Code startup**: reload the window after config changes before the tools appear.
- **Schema gotcha:** MCP tools take `language_code` (e.g. `"en"`), NOT the CLI's `language_name`
  (`"English"`). `location_name: "United Kingdom"` still works.
- **Cost still applies**: same pay-per-call pricing as the CLI; the MCP wrapper is not free/trial.

### Costs (observed May 2026)
- `overview`: ~$0.085 per call (search_volume $0.075 flat + bulk KD), any number of keywords up to ~1000.
- `suggest` / `related`: ~$0.011 per call.
- Balance check: free.

### GEO endpoint costs (measured 2026-08-15, balance before/after)
The two `ai_optimization` subcommands were unpriced here until they were probed. They differ by 10x,
which decides how each one gets used:

- `mentions` (`llm_mentions/search/live`, `--platform google`): **$0.150 per call.** Returns the
  question universe around a keyword with AI search volume per question, plus the domains cited for
  each. Discovery, not monitoring: 20 keywords is $3.00, so run it **quarterly** to refresh the
  cited-hub list, not monthly.
- `responses` (`{provider}/llm_responses/live`, perplexity/sonar-pro, `web_search: true`):
  **$0.0148 per call.** Returns the live LLM answer plus its citation URLs. Cheap enough to be the
  backbone of recurring tracking: **20 prompts x 3 engines is about $0.89 a month.**

⚠️ **One `responses` call is a sample, not a measurement.** These are live generative answers and they
vary between runs, so a single call cannot distinguish "we lost a citation" from ordinary variance.
Any tracker built on this either samples each prompt more than once or states its noise floor. Do not
report a month-over-month delta from n=1.

### KD is NOT comparable to Semrush
DataForSEO's keyword_difficulty uses a different model/scale than Semrush. Observed divergence is
large (e.g. "signs of high testosterone" = DFS 9 vs Semrush 49). **The KD values already in
`keywords.csv` are Semrush-derived (the locked pillar map).** When adding new rows from this tool,
either (a) keep DFS KD and note the source in the `notes` column, or (b) leave `kd` blank and only
trust DFS KD on its own scale. Do not sort a mixed-provider KD column as if the numbers are equivalent.

### Volume nuance
`overview` uses Google Ads search_volume, which returns `null` for some informational phrases Google
groups (e.g. "what is hba1c"). That's a real Google-vs-Semrush-clickstream difference, not a bug;
the tool still emits the row so the gap is visible. `suggest`/`related` use DataForSEO Labs volume,
which is populated more often.

### CLI vs MCP: which to use

The MCP is not a replacement for `dataforseo.mjs`; both wrap the same paid API at the same cost. Split
them by whether the output feeds the pipeline:

- **Output feeds a file or the pipeline** (keywords.csv, staging CSVs, briefs, teardowns, GEO baselines)
  → **use the CLI.** It emits the exact `keywords.csv` column order, bakes in the composite logic the
  MCP can't do in one call (`overview` merges search_volume + bulk KD and emits null-volume rows for
  transparency; `gap` diffs our ranked keywords against N competitors), and locks the UK defaults +
  `kd_source` conventions the single-source DFS rebuild depends on. This is the SOLE pipeline tool.
- **Output is a throwaway answer in conversation, or you're exploring an endpoint the CLI doesn't wrap**
  (the CLI covers ~10 of 89 endpoints; e.g. `search_intent`, `keyword_ideas`, `historical_serps`)
  → **use the MCP.** Saves the shell round-trip for in-chat lookups and prototyping.
- **When an MCP endpoint proves repeatedly useful to the engine, promote it to a CLI subcommand** rather
  than embedding raw MCP calls in skills; keep the pipeline deterministic and single-tool.

## track — the monthly GEO/AEO citation snapshot

```bash
node dataforseo.mjs track --dry                          # plan + cost estimate, spends nothing
node dataforseo.mjs track                                # all 3 engines -> ../geo-snapshots/<date>.csv
node dataforseo.mjs track --engines aio                  # one engine; MERGES into today's file
```

Prompts live in `geo-prompts.txt`, tagged `#informational` or `#commercial`. **Keep the list stable**:
a prompt that disappears between runs is indistinguishable from a lost citation.

Three surfaces, because "are we cited" has three different answers: `aio` (Google AI Overview),
`perplexity`, `chat_gpt`. Each cell records `cited` (our domain in the sources, registrable-domain
matched) and `mentioned` (brand named in prose with no link) **separately** — a mention without a
link is a real GEO outcome that URL-only matching scores as zero.

**Cost:** ~$1.08 for the full 24 x 3 sweep at the default depth 100 (`responses` $0.0148,
`aio` $0.0155). `--depth 10` drops the aio leg to $0.002 a call and the sweep to ~$0.76, at the
price described under `our_rank` below. Both figures are measured, balance before/after.

### `our_rank` — the leading indicator, added 2026-08-15

The `aio` rows carry **`our_rank`**: our own best organic position on the tracked query, as
`rank_absolute`, read off the same call at no extra charge beyond the depth. `our_rank_url` names
the page. It exists because the citation columns alone cannot be read honestly: the 2026-08-15
diagnosis established that we are not in the top 99 for any tracked head term, so a flat `cited=false`
was a restatement of the ranking position and not a verdict on the copy — and three months of that
would have looked identical whether we were climbing or standing still.

- **`unranked` is a value, not a blank.** Blank means "not measured on this surface" (every
  `perplexity` and `chat_gpt` row, since rank is a Google-surface fact). `unranked` means the SERP
  was read and we are not in it. Do not let a reader conflate the two.
- **Depth is the whole argument for the cost increase.** The API's default depth is **10**, so a
  default-depth read can only ever say "top 10 or nothing" and collapses the entire range the column
  exists to show. A month moving from unranked to #40 is the progress this tracker has to be able to
  report. Pay the $0.0155.
- The summary prints the rank line **above** the citation line, and the diff reports rank movement
  separately from citation gain/loss. Rank is a single sample too, but far less volatile than a
  generative answer: a few places is noise, in-or-out is not.

**Measured SERP cost by depth** (2026-08-15, balance before/after, one keyword, AIO on). Depth is
the largest cost lever in this file:

| depth | cost | organic returned | related_searches blocks |
|---|---|---|---|
| default | $0.002 | 9 | 1 |
| 10 | $0.002 | 9 | 1 |
| 20 | $0.0035 | 18 | — |
| 100 | $0.0155 | 96 | 10 |

### Three things this tool learned the hard way

- **The AIO probe MUST use `/v3/serp/google/organic/live/advanced` with `load_async_ai_overview: true`.**
  `/live/regular` returns **only `organic` items**, so an `ai_overview` lookup against it can never
  match and reports a blind probe as a confident "no AI Overview" — on all 24 queries. Same $0.002.
  The summary now prints `AI Overview present on N/24 SERPs` for exactly this reason: **a 0/0 there
  means the probe is blind, not that Google shows none.** (OBS-258.)
- **A single run is n=1 per cell.** These are live generative answers and they vary between runs, so
  one appearance or disappearance is not a gain or a loss. The diff says so; do not report a
  month-over-month delta from a single sample without re-probing the changed cells.
- **Errored cells are recorded as errors, never as zeros**, and the summary refuses to let a
  partially-failed sweep read as a clean citation rate. `callSoft` retries once and returns the
  error as a value, because the first run lost twelve completed probes to one transient 40101 that
  called `process.exit`.

## fanout — the sub-queries a tracked prompt decomposes into

```bash
node dataforseo.mjs fanout --dry                        # plan + cost, spends nothing
node dataforseo.mjs fanout                              # all 18 informational tracked prompts
node dataforseo.mjs fanout "crp blood test" --probe 15  # one parent
node dataforseo.mjs fanout --merge                      # also append priority 1-2 rows to keywords.csv
node dataforseo.mjs fanout --refresh                    # re-pay for the harvest instead of using today's cache
```

**Why it exists.** The 2026-08-15 diagnosis closed off the obvious reading of the informational
0/54: we are not in the top 99 organic for any tracked head term, and 16 of the 19 sources cited in
those AI Overviews sit in the organic top 30 of the same query. A better-written answer cannot win a
citation from nowhere. The one counter-example is the mechanism this command industrialises —
`londongpclinic.co.uk` is cited on `crp blood test` while unranked in its top 99, because it ranks
**#10 for `crp vs esr`** and the AI Overview decomposed the head term into that sub-question.

So the 24 tracked prompts are the **outcome** surface, and the queries worth ranking for are their
**fan-out children**. This reads Google's own decomposition of each parent (People Also Ask and
related searches, both riding the SERP call), qualifies each child for volume and difficulty, then
spends $0.002 a head on the only question that decides whether a child is worth writing: **does the
top ten contain sites our size?**

**Verdicts**, from the top ten of the child's own SERP. "Non-authority" excludes NHS/`.gov`/`.ac.uk`
and the big health publishers, and separately excludes platforms (YouTube, Reddit) — counting those
as beatable would score a SERP owned by Reddit as wide open.

| verdict | meaning | staged priority |
|---|---|---|
| `WINNABLE` | 3+ of the top 10 are non-authority | 1 |
| `MIXED` | 1-2 non-authority | 2 |
| `AUTHORITY` / `NHS-NAV` | top 10 is all authority, or NHS holds #1-2 | 4 |
| (blank) | qualified but not probed (`--probe` budget) | 3 — staged, **not a rejection** |

**Three exclusions are applied at source, as priorities the importer will not take** — a reason
recorded only in a `notes` field would be invisible to `csv-to-queue`:

- **compliance-gated** (priority 9): TRT, prescribing, treatment, dosage. A child can wander over
  the Phase 0 line its parent sat safely behind ("how to treat low testosterone" is a child of
  "normal testosterone levels by age").
- **off-ICP** (priority 8): women, pregnancy, PCOS, children, pets. Real queries with real volume,
  not ours, and writing them drags topical signal off the pillar map.
- **navigational** (priority 7): `nhs`, `reddit`, `boots`. The query names a destination, so ranking
  for it means being the thing someone scrolls past.

**Output is a staging file, never a decision:** `../fanout-staging-<date>.csv`, in the exact
keywords.csv column order so a merge is an append. Each row's `notes` carries the parent query, the
harvest source, and the measured evidence (`best non-authority #4 theforburyclinic.co.uk, 5/10
non-authority`) — which is what the 4b promotion gate needs to judge it, and `csv-to-queue` now
carries that note through into the queue row rather than overwriting it.

`intent` is derived per child and **not** inherited: `vitamin d tablets` (14,800/mo) arrives as a
child of an informational parent and is a shopping query. Commercial children are still imported as
candidates — routing them to a `/kits` or `/supplements` page instead of an article is exactly the
call the 4b gate exists to make — but the label has to be truthful for that call to be possible.

**Cost:** ~$0.45 for the full 18-parent run (harvest at depth 100 $0.0155 x18, one bulk qualify
$0.085, 40 probes at depth 10 $0.002). Harvest, qualify and probe results are **all cached to
`.fanout-harvest-<date>.json`** (gitignored), so re-running the same day is free — the first live run
lost a paid harvest to a rejected keyword three steps downstream, and the cache is what makes a
downstream fix free to retry.

**Baseline 2026-08-15:** 18 parents → 218 distinct children, 194 new, every eligible one probed.
**125 WINNABLE**, 24 MIXED, 1 AUTHORITY, 5 NHS-NAV; 13 gated, 20 off-ICP, 7 navigational. 149 merged
at priority 1-2 (combined 58,990/mo), 25 imported as queue candidates. The run also caught the
mechanism live: nine domains cited in a parent's AI Overview while absent from its organic top 100,
including londongpclinic on `crp blood test`.

⚠️ **`--probe` defaults to 40, and the first pass reported "32 WINNABLE, 154 unprobed", which was
read as a near-exhausted seam.** Probing the remaining 123 cost $0.25 and found 93 more. The hit rate
did not decay even though the first 40 were deliberately the lowest-KD. **Raise `--probe` to cover
the whole eligible set on a real run** — the default exists to keep an exploratory run cheap, and a
partial count reads exactly like a total unless you check the cap.

## faq-dedupe.mjs — FAQ question duplication across the whole corpus

```bash
node faq-dedupe.mjs                  # published mirror + briefs
node faq-dedupe.mjs --drafts         # also read article-drafts/ (STALE, warns)
node faq-dedupe.mjs --threshold 0.5  # loosen near-duplicate sensitivity
node faq-dedupe.mjs --json
```

Replaces the per-article manual grep in `coverage-rules.md` §5, and is the FAQ half of the §9 audit
script. Exit codes match the house convention: **0 clean, 2 duplicates found, 1 could not run, which
is never a pass.** A zero-file read exits 1 rather than reporting a clean corpus.

**Why it beats the grep it replaced.** The grep needed the candidate question string, so it could only
find exact matches; the expensive collisions are near-matches, and on this corpus the sharpest one is
a **1.00 token match** the grep was structurally unable to see ("What is a normal CRP level in the UK?"
against "What is a normal hs-CRP level in the UK?"). The grep also read `article-drafts/`, which is the
stale drafting workspace. And duplication is a property of the set, not of the article being written,
so a per-article check is partial by construction.

**Baseline 2026-08-15:** 124 questions, 18 published articles + 19 briefs. **1 exact duplicate, 1 near
duplicate**, both between `crp-blood-test` and `inflammatory-markers-blood-test`, which are hub and
spoke on the same marker and are the case §5 already permits when the answers are scope-different.

⚠️ **Do not re-tune the threshold to make findings disappear.** 0.6 is the default because at 0.5 the
count goes 1 → 21 and almost all of it is noise of the form "What is a B12 blood test?" against "What
is a CRP blood test?", which are different markers and different queries. Neither list the tool prints
is automatically a defect: judge each pair, do not bulk-reword for a green exit.
