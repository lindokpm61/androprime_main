# Live Site SEO Audit — andro-prime.com

**Date:** 2026-06-15
**Tool:** DataForSEO OnPage API (JS-rendered crawl, mobile Lighthouse) + manual smoke tests
**Scope:** Technical + on-page. **Not** included: off-page/backlinks, keyword-rank tracking.
**Re-run:** OnPage `task_post` to `andro-prime.com`, `enable_javascript+enable_browser_rendering`, `max_crawl_pages:100`; Lighthouse via `on_page/lighthouse/live/json` per URL. Creds in root `.env` (`DATAFORSEO_BASE64`).

---

## Headline

**OnPage score: 94.1 / 100. Technically healthy.** 22 pages crawled — the full internally-linked public surface. Noindex `/lp/*` landers and auth-gated app routes (`/account`, `/results-dashboard`, `/subscriptions`, checkout, etc.) are not link-reachable, so they're correctly outside the indexable crawl.

**Clean across the board:** no duplicate titles/meta, no missing titles or descriptions, no redirect chains, all pages HTTPS, canonical present on every page, SEO-friendly URLs throughout.

---

## Findings by severity

### 🟡 Known / self-healing
- **1× 404 — `/blog/myth-of-normal-range`.** Forward-linked from the live articles; it's Slot 4, still `draft`. Resolves automatically when Slot 4 publishes (scheduled Thu 18 Jun 2026). No action.

### 🟡 Performance — Core Web Vitals
- **Render-blocking resources on 21/22 pages.** CSS/JS blocking first paint, affects LCP. Broad Next.js pattern, not page-specific. Fix = preload critical CSS / defer non-critical JS. See the **Core Web Vitals** section below for measured numbers.

### 🟢 Minor on-page
- **4 short titles:** `/about` (19 chars), `/how-it-works` (26), `/privacy` (28), `/test-selector` (28). Worth expanding the two that target search intent — `how-it-works` and `test-selector` — with keywords. `about`/`privacy` are low priority (not rank targets).
- **Low content-rate on 17 pages.** Text-to-HTML ratio low — mostly design-heavy marketing/kit pages, largely noise. Spot-check none are genuinely thin.
- **3 images missing `title` attribute.** Minor; `alt` is the one that matters for SEO/accessibility — confirm alt present.

### ✅ CRP article (Slot 3, just published)
200, canonical, HTTPS, SEO-friendly URL, valid doctype. Only the site-wide render-blocking flag; no CRP-specific issue. Publish confirmed technically sound.

---

## Core Web Vitals (mobile Lighthouse)

_Measured on 3 representative templates: homepage, a kit page (`/kits/energy-recovery`), a blog article (`/blog/crp-blood-test`)._

| Template | Perf score | LCP | CLS | TBT | FCP | Speed Index |
|---|---|---|---|---|---|---|
| Homepage `/` | 81 | **4.2 s** ⚠️ | 0 ✅ | 250 ms | 1.7 s | 2.0 s |
| Kit 2 `/kits/energy-recovery` | 83 | **4.0 s** ⚠️ | 0 ✅ | 210 ms | 1.8 s | 1.8 s |
| CRP `/blog/crp-blood-test` | 85 | **4.0 s** ⚠️ | 0 ✅ | 160 ms | 1.7 s | 1.7 s |

**Read:** CLS is perfect (0, threshold ≤0.1). FCP, Speed Index and TBT are all in the good range. **LCP (~4.0–4.2 s) is the single weak metric** — it sits at the "needs improvement / poor" boundary (Google: good ≤2.5 s, poor >4.0 s) and is what holds the perf scores at 81–85 instead of green. Root cause aligns with the render-blocking-resources flag: the largest element (hero) paints late because CSS/JS blocks the critical path.

**LCP fix levers (in order):** preload the LCP hero asset (image/font); inline or preload critical CSS and defer the rest; ensure the hero image has `priority`/`fetchpriority=high` and is correctly sized; trim render-blocking JS. CLS being 0 means no layout-shift work is needed — this is purely a load-order problem.

---

## Caveats / what this audit does NOT cover
- **Off-page:** no backlink profile, referring domains, or authority analysis (would need Semrush — MCP blocked on current plan — or DataForSEO Backlinks API).
- **Rank tracking:** keyword positions not measured here (separate from the keyword-coverage audit in `audit-keyword-coverage.js`).
- **Crawl boundary:** only internally-linked pages (22). Intentional noindex pages and auth-gated routes excluded by design.

## Recommended next actions (priority order)
1. (Auto) Slot 4 publishes Thu 18 Jun → clears the only 404.
2. (Low effort) Expand `how-it-works` + `test-selector` titles with keywords.
3. (Perf) Address render-blocking resources if CWV numbers below warrant it.
4. (Hygiene) Add `title`/confirm `alt` on the 3 flagged images.
