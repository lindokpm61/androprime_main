# Blog Content Calendar

Single source of truth for **what publishes when**. The blog has a publication gate
(`status: draft | published` in each article's MDX frontmatter), so nothing goes live
until it is scheduled here and flipped. Launching the `/blog` route no longer dumps every
article live at once.

---

## How the gate works

- Each article in `09_website-app/frontend/content/blog/*.mdx` carries `status:` in its frontmatter.
- **`status: published`** → live in production and listed in `/blog`.
- **`status: draft`** (or missing) → hidden in production; still visible on localhost / preview
  builds so it can be reviewed before go-live. Fails safe: a forgotten flag stays hidden.
- The gate is enforced in one place (`lib/blog.ts` → `getAllArticles()` + `isVisible()`), so
  listings, the article page, author pages, the sitemap, and OG images all respect it. A draft's
  direct URL 404s in production.

## Cadence (locked)

**Two articles per week.** Publish days: **Tuesday + Friday**.
**Launch confirmed: Friday 5 June 2026.** Full set live Tuesday 16 June 2026.

## Publish order (locked)

Order is fixed by the SEO plan and internal-link dependencies. **A.hub + A.1 publish together** —
the A.1 spoke links up to the A.hub three times inline and 404s if it ships first.

| Slot | Target date | Day | Article(s) | File(s) | Pillar |
|------|-------------|-----|------------|---------|--------|
| 1 | Fri 5 Jun 2026 | Launch | Inflammatory Markers Blood Test | `inflammatory-markers-blood-test.mdx` | G hub |
| 2 | Tue 9 Jun 2026 | Tue | Low Vitamin D Symptoms **+** 14 Signs of Vitamin D Deficiency | `low-vitamin-d-symptoms.mdx` **+** `14-signs-of-vitamin-d-deficiency.mdx` | A hub + A.1 spoke |
| 3 | Fri 12 Jun 2026 | Fri | CRP Blood Test | `crp-blood-test.mdx` | D hub |
| 4 | Tue 16 Jun 2026 | Tue | The Myth of the Normal Range | `myth-of-normal-range.mdx` | C spoke |

> All five start as `status: draft`. Each slot goes live by flipping its article(s) to
> `status: published` + stamping the publish date on that day (see procedure below).

## How to publish a slot (the flip procedure)

For each article in the slot, on its target date:

1. In the article's frontmatter, set `status: published`.
2. Update `date:` (and `dateModified:` if relevant) to the **actual publish date** — this staggers
   the visible dates so the blog reads as a natural cadence, not a batch dump. (All five currently
   share `2026-05-27`; that gets overwritten at flip time.)
3. Commit by path and deploy. The article goes live on the next build.

## Future articles

New articles (B hub "why am i always tired", C hub "testosterone test uk", further spokes) slot in
after Slot 4 at the same two-per-week cadence. They land in `content/blog/` as `status: draft` and
get added to the table above when scheduled. Order continues per the 12-week plan in
`blog-ai-seo-strategy.md`. Pillar E and the competitor-comparison pages remain blocked on Ewa sign-off.
