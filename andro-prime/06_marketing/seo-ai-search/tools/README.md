# SEO keyword tools

## dataforseo.mjs

Pay-per-call keyword validation/expansion via the DataForSEO API. This is the **ongoing**
keyword tool — Semrush MCP is one-time/trial only (see the `reference-semrush-options` memory).
Used by the `/article` skill to validate spokes before writing a brief, and ad-hoc for expanding
`keywords.csv`.

**Auth:** reads `DATAFORSEO_BASE64` (or `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`) from the
repo-root `.env`. No dependencies — Node 18+ only. Defaults to UK / English.

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
groups (e.g. "what is hba1c"). That's a real Google-vs-Semrush-clickstream difference, not a bug —
the tool still emits the row so the gap is visible. `suggest`/`related` use DataForSEO Labs volume,
which is populated more often.
