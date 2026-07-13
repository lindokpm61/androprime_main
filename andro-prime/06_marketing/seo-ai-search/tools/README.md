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
