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

**Cost:** ~$0.78 for the full 24 x 3 sweep. `aio` rides the organic SERP endpoint at $0.002;
`responses` is $0.0148.

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
