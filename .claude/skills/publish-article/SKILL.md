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
   **Read that approval in ClickUp, which is the hub**: the blog-article Content
   Review list `901218140081` (workspace `90121729875`), where a **completed task
   IS the approval** and change requests are comments. The repo is the mirror and
   lags it. Never treat a marker inside the article as evidence either way: a
   `{/* TODO Ewa */}` block, a "pending" note, or an unticked box is stale the
   moment the reviewer acts, and two such markers caused false escalations on
   2026-07-31 for articles she had already approved. Equally, absence of a repo
   register row is not absence of sign-off (the 2026-07-13 false alarm).
1b. **An article edit writes `blog_articles.body`. Writing only a revision is a
   silent no-op.** The schema has `blog_articles.body`, `blog_article_revisions.body`
   and `blog_articles.current_revision_id`, which strongly implies the pointer
   selects what is served. It does not: `lib/blog.ts` serves from
   `blog_articles.body`, and the revisions table is read only by the preview
   route. So an edit written as a new revision with the pointer repointed
   returns success on every assertion, shows zero bad strings in the DB, and
   changes the live page not at all. Write `blog_articles.body` (and
   `.frontmatter`), and separately record a revision for history.
   **Then verify at the surface the user sees, two-sided**: fetch the served
   HTML and confirm the old string is ABSENT and the new string is PRESENT,
   matching on a full distinctive sentence rather than a keyword — a keyword
   count is polluted by nav, schema and related-article cards, and two checks
   were misread that way. Revalidation must be called explicitly with the slug
   (`POST /api/revalidate`, `x-revalidate-secret`, `{"slug": "..."}`); the DB
   webhook busts the global tag but the article page carries a 1h ISR backstop.
   (Observation 84.)

   **Assert on content that survives compilation — never on a component name.**
   Articles are authored in MDX with named components, and those compile to
   styled elements carrying neither the component name nor a semantic tag. After
   stripping a marker from a served body, a check for
   `PullQuote|ClinicalInsight|blockquote` in the fetched HTML returned zero on
   both live pages, which read unambiguously as "the pull quote is gone" — on
   production, immediately after a database write. Grepping the quote's own
   visible text found it twice on each page. **A check written in the authoring
   vocabulary against an artefact that speaks the rendered vocabulary can only
   ever fail, and its failure is indistinguishable from the failure it was meant
   to detect** — which manufactures a false alarm at exactly the moment a real
   one would be believed. Pick a distinctive substring of the visible prose, and
   choose one carrying no apostrophes or quotes, since HTML entity encoding
   defeats a literal match. Where a structural assertion really is wanted,
   resolve the component to the element it renders first and record that mapping
   beside the test. (Observation 100.)

   **Validate a repo-to-store body sync against a record it should leave
   UNCHANGED.** Three articles were pushed from repo MDX to the served column;
   only two had been edited, and the third moved by 199 bytes. The cause was not
   content: repo files are CRLF under `autocrlf` on Windows while stored bodies
   are LF, and the frontmatter-stripping slice added a leading and a trailing
   blank line. So a file with zero intended changes was rewritten on a live page
   while every check in the script passed, because the script compared its own
   output to itself and the read-back matched what it had just written. Sync had
   been verified for the two edited files and not the third, on the reasoning
   that an unedited file could not diverge — but **the divergence was introduced
   by the transport, not the edit**, and an unchanged record is the only
   available oracle for whether the transport is lossless. So: normalise line
   endings explicitly at the extraction boundary, and assert the extraction is
   byte-identical for at least one unchanged control record before writing any
   record. Second rule from the same incident: **a failed history snapshot must
   abort the write, never downgrade to a warning.** The first version logged a
   warning and wrote anyway, so the failure that removed the safety net also
   removed the evidence needed to detect what it had cost; recovery was possible
   only because a prior revision happened to hold the pre-push body.
   (Observation 201.)

   **Editing `content/blog/*.mdx` does not discharge a debt recorded
   against the served body.** The repo file and the served body are two stores of
   the same content and the repo one is a lagging mirror. A STATE entry reading
   "strip the two dead markers from the served bodies" was satisfied in the
   mirror only, and every local check — grep, `git diff`, MDX parse — reported
   success, because every local check reads the mirror; all five slugs still
   matched the marker afterwards. **The failure is invisible from the side you
   are working on:** the diff is correct, the parse is clean, the debt is
   untouched. After any edit to `content/blog/*.mdx`, query `blog_articles.body`
   for the same condition and report BOTH, so "done in the mirror, owed in the
   served body" is the default reported shape rather than a later discovery.
   (Observation 98 — the same dual-store hazard as the `status:` frontmatter
   field, arriving through the other door: that time the mirror was read as
   truth, this time it was written as truth.)
1c. **Residual review markers block the publish.** Grep the body for `TODO`,
   `FIXME`, `XXX`, `sign-off` and `before publish` before flipping status, and
   stop while any survive. These are JSX comments: they render to nothing, so no
   amount of checking the live page will ever surface them, and two of them sat
   in published articles for a day and sixteen days respectively. If the marker's
   condition has in fact been met, delete the marker as part of this step rather
   than shipping past it. A marker that can be published past teaches everyone
   that it never really blocked anything. (Observation 87.)
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
- **Update `frontend/public/llms.txt` in the same pass.** Publishing an article
  must update the file that *advertises* articles. There is **no generator** for
  it: it is hand-maintained, so it is wrong by default and reports as healthy —
  every automated check available to it (does it exist, does it parse, does it
  serve) is a check on **form**, and form is exactly what a stale file retains.
  It has already sat at 2 of 18 articles, understating the content estate by 89%
  to precisely the audience the GEO workstream exists to reach, since the file
  exists so ChatGPT, Perplexity and Claude can enumerate the site. **Completeness
  can only be checked against the set being described**, so verify the count:

  ```bash
  # from 09_website-app/frontend — these two numbers must match
  grep -c '/blog/' public/llms.txt
  # vs. the count of blog_articles rows at status='published'
  ```

  Owed, and worth building before this drifts again: a `sync-llms-txt.ts` beside
  `sync-mirror.ts` that renders the Educational Content section from
  `blog_articles` at `status='published'` and leaves the hand-written brand and
  product sections alone, plus a `content-doctor` check diffing the two counts.
  (Observation 257. The list was hand-corrected to 18; the generator does not
  exist, so the underlying defect is intact.)
- **A frontmatter-only change is NOT mirrored, and the instruction sounds like it
  is.** `sync-mirror.ts` is **body-only by design**: it replaces only the body of
  an existing mirror file and keeps the frontmatter block verbatim. So "re-export
  the mirror" carries a body edit and silently does nothing for a change to `faq`,
  `title`, `description` or dates. There is no `--slug` filter and no
  frontmatter-aware exporter, so today the only path is a hand-patch of the `.mdx`
  — do that consciously and say so, rather than running `sync-mirror` and
  reporting success. **A partial synchroniser paired with a total-sounding
  instruction produces drift invisible from both ends:** the tool reports success,
  the instruction was followed, and the two stores disagree anyway.
  (Observation 314.)

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
