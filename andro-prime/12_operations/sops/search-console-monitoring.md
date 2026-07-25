# SOP: Search Console Monitoring

**Runs in:** `cadences/weekly-ops.md` (weekly SEO pass).
**Purpose:** Confirm the site is being indexed and read the organic-search trend once a week, so an indexing failure, a ranking drop, or a manual action is caught early rather than discovered as a traffic cliff. This SOP is the durable how-to; the week's findings and actions go to ClickUp, not this file.

**SEO owner:** `06_marketing/seo-ai-search`. This workspace runs the weekly glance and routes issues there; it does not own SEO strategy, briefs, or fixes.

**Access:** Google Search Console is accessed in **its own console** (property for `andro-prime.com`). **It is not an MCP.** The deeper diagnostic tool (**dataforseo**) is a wired MCP, used only when the glance flags something worth digging into.

---

## What to check (weekly)

### 1. Coverage / indexing

- Did **this week's new blog articles get indexed?** Publishing is a DB write surfaced by on-demand revalidation (no redeploy), so a page can be live but not yet indexed. Confirm each newly published `/blog/<slug>` is in the index (URL Inspection) and not excluded.
- Scan the Pages (coverage) report for a rise in Not-indexed / Excluded, crawl errors, or newly-excluded URLs.
- Confirm `noindex` is doing its job: `/lp/*` landing pages and any auth routes should **not** be indexed; `/kits/*`, `/supplements/*`, `/blog/*` should be.

### 2. Performance (impressions / clicks / CTR / position)

- Read the trend over the last 7 days vs the prior period: total impressions, clicks, average CTR, average position.
- Spot big movers by query and by page. A page that lost impressions or dropped position is the thing to dig into; a query gaining impressions but with low CTR is a title/description opportunity for `06_marketing`.

### 3. Manual actions / security issues

- Check the Manual Actions and Security Issues reports. Either is a hard escalation: a manual action can deindex the site. Route to `06_marketing/seo-ai-search` and flag to Keith the same day.

### 4. Sitemap status

- Confirm the submitted sitemap (`app/sitemap.ts` output) is read successfully, with no fetch errors and a discovered-URL count that matches roughly what should be live.

---

## What good looks like

- New articles indexed within a reasonable window of publish; no unexpected jump in excluded/not-indexed pages.
- Impressions/clicks flat-to-up week on week; no unexplained cliff in CTR or position.
- Zero manual actions, zero security issues.
- Sitemap read cleanly, URL count sane.
- Note the canonical CTR KPI (Google Search CTR target and alert threshold) lives in the `10_launch-ops` Weekly KPI Targets table; read it there rather than restating it here.

---

## When to escalate to a deeper diagnostic

- A confirmed drop (position or clicks) on a money page or a pillar article, an indexing failure that does not clear, or a suspected algorithm hit: escalate from the GSC glance to a **dataforseo** diagnostic (SERP position tracking, competitor/keyword analysis) and open a ClickUp task against `06_marketing/seo-ai-search`. The `seo-audit` skill frames the deeper technical/on-page pass.
- A **manual action or security issue**: escalate immediately to `06_marketing/seo-ai-search` and Keith; do not wait for the weekly cycle.
- Anything that looks like the app serving the wrong thing (pages 404ing, wrong canonical, stale HTML after a deploy): that is an app issue, route to `09_website-app` (check the Cloudflare edge-cache and Coolify deploy-webhook gotchas in its CONTEXT.md before assuming an SEO cause).
