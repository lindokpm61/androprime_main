---
name: publish-article
description: >
  Promote a signed-off Andro Prime article from draft to live. Use when the
  task is "publish article X", "flip slot N to published", "take the vit-D hub
  live", or "ship the next blog slot". Owns the status flip, hub/spoke
  co-publish check, indexable-link + keyword-coverage gates, related-reading
  wiring, build, commit/push, and live smoke test. Does NOT write or edit
  article copy, and never grants Ewa sign-off — it assumes sign-off already
  exists and refuses without it.
---

# /publish-article — signed-off draft → live

This is the downstream half of `/article`. `/article` drafts and gates the
content; this skill takes a *signed-off* article from `status: draft` to live,
correctly and verifiably, without re-litigating the copy.

## Hard invariants

1. **Ewa sign-off is the gate — you don't grant it.** Confirm the article is
   covered by a recorded Ewa approval (blanket or per-article) before touching
   `status`. No sign-off → stop and surface that. Publishing isn't a copy
   change, so it needs no *new* sign-off — but it needs the *existing* one.
2. **Hub + spoke publish together.** A spoke that links to its hub 404s if the
   hub isn't live (the A.1 ↔ A.hub rule). If you publish a spoke, its hub must
   already be live or go in the same batch. Check both directions.
3. **No `/lp/*` links ship.** Verify every in-article product link targets
   `/kits/*` or `/supplements/*` (indexable), never `/lp/*` (noindex). This is
   `/article` invariant 6 — re-verified here as a gate, not assumed.
4. **The keyword audit must pass.** `node scripts/audit-keyword-coverage.js`
   shows the article: primary PASS + every declared `csv_rows_covered` present.
   A FAIL or high-vol MISS blocks the publish — fix the copy first (weave the
   term where the content already covers it), don't ship the gap.
5. **Status-based gate, not date-based.** Going live = flip `status: published`
   + stamp `date`/`dateModified`. Prod shows `published` immediately on deploy.
6. **Build before push, smoke-test after deploy.** Coolify deploys `origin/main`
   via `next build`; a broken build = a broken site. Stage by path, never
   `git add -A`.

## Workflow

### 1. Pre-flight (read-only — all must pass before any edit)

- **Sign-off**: confirm the article is under a recorded Ewa approval. None → stop.
- **Forward-links**: grep the article's `/blog/*` links. Any pointing at a
  still-draft article will 404 until that slot ships. This is the accepted,
  self-healing pattern (live articles already do it) — but **surface it** so
  it's a conscious choice, not a surprise.
- **Co-publish**: if it's a spoke, confirm its hub is live/in-batch (invariant 2).
- **Link target gate**: `grep -rn "/lp/" content/blog/<slug>.mdx` → must be empty.
- **Keyword gate**: run `scripts/audit-keyword-coverage.js`; the article must
  PASS primary + show no high-vol MISS.
- **Copy drift**: if any body/frontmatter copy changed since sign-off, auto-invoke
  `compliance-preflight` on the file. (A pure status flip needs no re-check.)

### 2. Flip status

In `content/blog/<slug>.mdx` frontmatter: `status: draft` → `published`; set
`date` and `dateModified` to today (match the existing unquoted `YYYY-MM-DD`
format — `lib/blog.ts normalizeFrontmatter` coerces, but match the house style).
Do the hub and every co-published spoke in the same pass.

### 3. Wire related-reading (product → blog surfacing)

The published article should surface on the topically-relevant product pages.
`components/marketing/RelatedArticles.tsx` is **slug-list-driven** today — each
product page passes `slugs={[...]}`. Confirm the new slug is in the right
page(s)' preference list; add it if missing. (If/when RelatedArticles is
refactored to category-driven, this step becomes automatic — drop it then.)
The component is 404-safe, so a published slug appears immediately; a draft slug
stays hidden.

### 4. Build gate

From `09_website-app/frontend`: `npm run build`. Confirm `/blog/<slug>`
generates as a static route and the build exits 0. A draft that doesn't compile
fails here, not in prod.

### 5. Commit + push

Stage by path (the `.mdx` files + any RelatedArticles/CSV edits). Two clean
commits is fine (e.g. `feat(blog): publish ...` + `chore(seo): coverage_status`).
Push to `main` (no PR — house workflow). Co-author trailer as usual.

### 6. Smoke test (live — after the Coolify deploy lands, ~3–4 min)

Poll a fresh marker until the deploy lands (a new article 404→200, or a new
in-body link appearing), then verify:

- `/blog/<slug>` → **200**
- in sitemap **as Googlebot**: `curl -A Googlebot .../sitemap.xml | grep <slug>`
- in-article CTAs resolve to indexable `/kits|/supplements` **200** (not `/lp/`)
- related-reading renders on the mapped product page(s)
- hub→spoke (and spoke→hub) links resolve 200
- robots.txt still clean (no AI/Googlebot `Disallow: /` regression)

### 7. Bookkeeping

- `keywords.csv`: set `coverage_status: published` on the article's primary +
  covered rows (the audit's bookkeeping side stays honest).
- Note the publish in the content calendar / session memory (which slots are live).

## When to fire

- Article is signed off (Ewa) and `status: draft` in `content/blog/`
- Its hub (if a spoke) is live or being published in the same batch
- Keyword + link gates pass

## When NOT to fire

- No recorded Ewa sign-off → stop, this skill can't grant it
- Keyword audit FAILs or has a high-vol MISS → fix copy first (often via the
  article author / a quick weave), then publish
- A spoke whose hub is still draft and not in this batch → publish the hub too,
  or don't ship the spoke

## Pairing

- `/article` — the upstream skill that drafts + gates; hands the signed-off draft here
- `scripts/audit-keyword-coverage.js` — the keyword gate (step 1 + invariant 4)
- `compliance-preflight` — only if copy drifted since sign-off (step 1)
