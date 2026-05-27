---
ticket: blog-template-prep
status: scoped — not started
owner: Keith Antony
estimate: ~half day (4–5 hrs focused)
blocks: publish of Pillar G hub article (`/blog/inflammatory-markers-blood-test`) + every subsequent pillar/spoke
last_updated: 2026-05-27
---

# Blog template prep — pre-publish bundle

## Goal (one sentence)

Bring the blog template up to E-E-A-T + GEO publishing standard so the Pillar G hub — and every subsequent article — can ship without per-article schema gymnastics, while collecting the credentials and reviewer attribution that AI search and Google YMYL ranking both require.

## Why now

The 2026-05-27 on-page SEO checklist sweep flagged this as a half-day block before the first hub article. The Pillar G hub brief (`06_marketing/seo-ai-search/article-briefs/pillar-G-hub-inflammatory-markers-blood-test.md`) confirms the dependency: Section 14 (schema) + Section 17 (internal linking) reference author pages, reviewedBy fields, and an internal-link lint rule that don't exist yet. Pillar D hub (the biggest single-query opportunity in the entire plan, 18.1k vol) lands six weeks after Pillar G and inherits all the same dependencies — so the work here is leveraged across the whole 12-week sequencing plan, not just one article.

## Scope — in / out

**In scope (must ship for Pillar G hub publish):**

1. Author pages (Keith + Ewa) at fixed URLs with Person schema
2. Article frontmatter + Article schema extended for `reviewer` / `reviewedBy` + `dateModified`
3. ArticleLayout byline updated to render named author + reviewer with links
4. FAQPage schema rendering from MDX frontmatter
5. TOC + jump-links + back-to-top component for 1,500+ word posts
6. Remove placeholder articles from `app/(marketing)/blog/page.tsx`

**Out of scope (separate tickets — flagged at the bottom):**

- `lint-blog.js` internal-link rule (defer until 3+ articles published — needs real links to lint against)
- WebP discipline (defer — needs OG image asset pipeline decision)
- CI compliance gate on `content/blog/**` PRs (separate ticket: "Wire CI compliance gate" in SEO outstanding list)
- Programmatic author rotation / multiple writers (not needed; Keith + Ewa is the full byline universe in Phase 0)
- Article schema's `wordCount` field (nice-to-have; Google ignores it for ranking)

## Current state (baseline before this ticket)

Verified from the codebase 2026-05-27:

| Thing | Status | Location |
| --- | --- | --- |
| Blog index page | Exists, has placeholder articles | [`app/(marketing)/blog/page.tsx`](../../09_website-app/frontend/app/(marketing)/blog/page.tsx) |
| Article route | Exists with Article + BreadcrumbList schema | [`app/(marketing)/blog/[slug]/page.tsx`](../../09_website-app/frontend/app/(marketing)/blog/[slug]/page.tsx) |
| MDX loader | Exists, frontmatter typed | [`lib/blog.ts`](../../09_website-app/frontend/lib/blog.ts) |
| ArticleLayout | Exists, byline is initial-bubble only (no role, no link) | [`components/marketing/ArticleLayout.tsx`](../../09_website-app/frontend/components/marketing/ArticleLayout.tsx) |
| MDX components | `PullQuote`, `StatBox`, `EvidenceBox` available in MDX | wired in `[slug]/page.tsx:13` |
| One real article | `the-myth-of-the-normal-range.mdx` | [`content/blog/the-myth-of-the-normal-range.mdx`](../../09_website-app/frontend/content/blog/the-myth-of-the-normal-range.mdx) |
| Author pages | **Don't exist** | — |
| `reviewedBy` in schema | **Missing** — only `author` | `[slug]/page.tsx:75-78` |
| `dateModified` | **Missing** — only `datePublished` | `[slug]/page.tsx:73` |
| FAQPage schema | **Not wired from MDX** | — |
| TOC + back-to-top | **Doesn't exist** | — |

## Item-by-item breakdown

### 1. Author bio data + types (15 min)

Create a single source of truth for author/reviewer data so schema + bylines + author pages all pull from one place.

**File:** `andro-prime/09_website-app/frontend/lib/authors.ts` (new)

```ts
export type AuthorRole = 'founder' | 'medical-reviewer'

export interface Author {
  slug: 'keith-antony' | 'dr-ewa-lindo'
  name: string
  role: AuthorRole
  jobTitle: string
  bio: string                  // 2–3 sentences for byline tooltip / Person schema
  longBio: string              // ~150 words for author page body
  initials: string
  imgSrc?: string
  credentials?: string         // e.g. 'GMC 1234567' for Ewa
  sameAs: string[]             // LinkedIn, GMC profile, etc.
}

export const AUTHORS: Record<string, Author> = { /* ... */ }
export function getAuthor(slug: string): Author | undefined { /* ... */ }
```

**Decision needed (Keith):** what goes in each `longBio`. I can draft both — see Section "Open decisions" below.

### 2. Author pages at fixed URLs (60–75 min)

**Files:**

- `app/(marketing)/authors/[slug]/page.tsx` — dynamic route generating both pages from `AUTHORS`
- `components/marketing/AuthorBioCard.tsx` — used on author page + as inline byline footer

Each page renders:

- Photo + name + role + credentials
- `longBio`
- "Articles by this author" / "Articles reviewed by this author" list (uses `getAllArticles()` + filter by `frontmatter.author` / `frontmatter.reviewer`)
- Person schema with `@id` matching the URL, `sameAs` links, `jobTitle`, `worksFor: Andro Prime`

URLs:

- `/authors/keith-antony`
- `/authors/dr-ewa-lindo`

robots: `index: true, follow: true` (these are meant to rank as author-name searches).

### 3. Extend MDX frontmatter (20 min)

**File:** `andro-prime/09_website-app/frontend/lib/blog.ts`

Add to `ArticleFrontmatter`:

```ts
authorSlug: 'keith-antony'             // required
reviewerSlug?: 'dr-ewa-lindo'          // optional, but required for all health pillars
dateModified?: string                  // defaults to date if absent
faq?: Array<{ q: string; a: string }>  // populates FAQPage schema; rendered inline by default
toc?: boolean                          // default true for posts > 1,500 words; can override
```

Migrate the existing `the-myth-of-the-normal-range.mdx` to include `authorSlug: keith-antony`. Keep the legacy `author` / `initials` fields working as fallbacks for one release, then remove.

### 4. Update Article schema (15 min)

**File:** `app/(marketing)/blog/[slug]/page.tsx`

Schema changes:

- `author` becomes a `@id` reference to the author page Person schema (resolves cross-page) — `{ '@id': '${BASE_URL}/authors/${authorSlug}/#person' }`
- Add `reviewedBy` when `reviewerSlug` is set, same pattern
- Add `dateModified` (falls back to `datePublished`)
- Add FAQPage block when `frontmatter.faq` is non-empty

### 5. ArticleLayout byline update (20 min)

**File:** `components/marketing/ArticleLayout.tsx`

Replace lines 31–41 (the initial-bubble block) with a named byline + reviewer line:

```text
Written by [Keith Antony, Founder →]    ← link to /authors/keith-antony
Reviewed by [Dr Ewa Lindo, GMC-registered GP →]  ← link to /authors/dr-ewa-lindo
Published: 12 Oct 2026 · Last updated: 27 May 2026
```

Visual: keep the existing data-label + border style. Two-line byline. Initial bubble retained on the left.

### 6. FAQ block component (30 min)

**File:** `components/marketing/ArticleFaq.tsx` (new)

Renders Q&A from `frontmatter.faq` as accessible `<details>` elements (or styled accordion matching `FaqAccordion` already used on LPs).

Placed in `ArticleLayout` automatically after the article body, before the CTA, when `frontmatter.faq` is set.

FAQPage schema in `[slug]/page.tsx` reads the same array.

### 7. TOC + jump links + back-to-top (45 min)

**File:** `components/marketing/ArticleToc.tsx` (new)

- Builds TOC from H2 headings in the MDX (server-side via `rehype-slug` + `rehype-autolink-headings`)
- Sticky on desktop sidebar, collapsible accordion on mobile
- "Back to top" floating button after 1,500 words scrolled

Wire `rehype` plugins in the MDX pipeline if not already present.

### 8. Remove blog index placeholders (10 min)

**File:** `app/(marketing)/blog/page.tsx`

Per the SEO outstanding-task list: "Drop placeholder articles in app/(marketing)/blog/page.tsx — they still ship to production; remove when first real hub goes live."

Replace placeholder array with the result of `getAllArticles()`. If only one article exists, show only one.

### 9. Smoke test + acceptance (30 min)

Local dev run, verify:

- `/authors/keith-antony` renders, Person schema validates at `validator.schema.org`
- `/authors/dr-ewa-lindo` renders, Person schema validates
- Existing `/blog/the-myth-of-the-normal-range` still renders after frontmatter migration
- Article schema validates with `reviewedBy` populated
- FAQPage schema validates (test with a temp FAQ block in the existing article — revert after)
- Blog index shows real articles only
- Lighthouse SEO score >= 95 on a sample article page

## Acceptance criteria

Ticket closes when ALL of these are true:

- [ ] `lib/authors.ts` exists with `Keith Antony` + `Dr Ewa Lindo` populated
- [ ] `/authors/keith-antony` + `/authors/dr-ewa-lindo` ship, return 200, Person schema valid
- [ ] `ArticleFrontmatter` extended with `authorSlug`, `reviewerSlug`, `dateModified`, `faq`
- [ ] Existing article's frontmatter migrated; article renders unchanged visually except byline format
- [ ] Article schema includes `reviewedBy` + `dateModified` + FAQPage when set
- [ ] ArticleLayout renders the new byline format with both author + reviewer linked
- [ ] FAQ block renders from frontmatter; FAQPage schema reads from same source
- [ ] TOC + back-to-top renders on posts > 1,500 words
- [ ] Blog index page shows only real articles (placeholders removed)
- [ ] All schemas validate at validator.schema.org
- [ ] Existing article still passes `compliance-preflight` skill after migration

## Effort breakdown

| Item | Estimate |
| --- | --- |
| 1. Author data + types | 15 min |
| 2. Author pages | 60–75 min |
| 3. Frontmatter extension | 20 min |
| 4. Article schema update | 15 min |
| 5. ArticleLayout byline | 20 min |
| 6. FAQ block + schema | 30 min |
| 7. TOC + back-to-top | 45 min |
| 8. Blog index cleanup | 10 min |
| 9. Smoke test + validate | 30 min |
| **Total** | **~4–4.5 hrs focused** |

## Open decisions for Keith

- **(a) Keith long bio.** ✅ **Resolved 2026-05-27.** Keith approved the lived-experience frame; final copy in `02_brand/author-bios.md`. `lib/authors.ts` reads from there.

- **(b) Ewa long bio.** ✅ **Resolved 2026-05-27.** CV received; TRT credential substantiated via Harley Street TRT certificate (26 Nov 2025) filed at [03_compliance/credentials/ewa-trt-training-2025.md](../../03_compliance/credentials/ewa-trt-training-2025.md); GMC number 4758565 verified on public register; LinkedIn deferred (profile empty — link to be added later); current practice St James Medical Practice Croydon. Final long bio + short bio + schema field values in [02_brand/author-bios.md](../../02_brand/author-bios.md). Only outstanding gap: professional photo (same placeholder as About page).

- **(c) Article reviewer signal for non-health articles.** If you ever publish a non-health article (e.g. company news), `reviewerSlug` will be left empty. Schema handles this fine. Just confirming intent: every health article has Ewa reviewing; non-health doesn't need it.

- **(d) TOC visibility threshold.** Default I've drafted is "show TOC if post > 1,500 words." Pillar G hub is 2,400 words → TOC shows. Existing `the-myth-of-the-normal-range` is shorter → no TOC. OK with that auto-rule, or want a frontmatter `toc: true/false` override only? My read: keep the auto rule, allow override.

## Optional follow-ups (post-Pillar G hub publish)

These appear in the SEO outstanding-task list separately and don't gate Pillar G:

- `lint-blog.js` internal-link rule (best done with 3+ live articles)
- WebP / alt-text discipline + image asset pipeline
- CI compliance gate on `content/blog/**` PRs
- Programmatic OG image generation (so each article doesn't need a manual 1200×630)

## Sequencing options

How this fits with the Pillar G hub article draft:

| Option | Sequence | Pros | Cons |
| --- | --- | --- | --- |
| A. Template first | Build template → draft article → publish | Article publishes immediately on draft completion | Author bio decisions block start (~1 day delay) |
| B. Parallel | Draft article + build template at same time | Saves a day | Risk of small rework if frontmatter shape shifts mid-build |
| C. Article first | Draft article → build template → publish | Article draft surfaces real frontmatter needs | Article sits unpublishable for ~half a day after draft is done |

My read: **Option B** if you're answering questions (a)/(b)/(c)/(d) above today; otherwise Option C. Option A is the slowest.
