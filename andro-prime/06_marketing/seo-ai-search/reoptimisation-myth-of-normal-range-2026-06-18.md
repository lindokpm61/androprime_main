# Re-optimisation proposal: "The Myth of the Normal Range"

> **Status: PROPOSAL for Keith + Ewa review. NOT applied.** The article is already published
> and Ewa-signed-off. The changes below are a copy change to a signed clinical article, so they
> require: (1) Ewa sight on the new/changed copy, (2) a `compliance-preflight` pass, (3) re-run
> `audit-keyword-coverage.js`, then (4) flip the new `keywords.csv` rows `planned → published`.
> Created 2026-06-18.

## Why

Post-publish DataForSEO check (2026-06-18) found a low-difficulty UK search cluster the article
sits on top of but doesn't capture. It currently targets only zero-volume GEO/LLM prompts. The
on-page content already discusses the range and age decline, so capturing these is a content-shaping
job, not new research. KD below is DataForSEO scale (not comparable to the Semrush KDs in `keywords.csv`).

| Query (UK) | Vol/mo | DFS KD | Unit |
|---|---|---|---|
| normal testosterone levels in males ng/ml | 720 | 38 | US |
| normal testosterone levels in males | 480 | 23 | – |
| testosterone levels by age | 390 | 1 | – |
| testosterone levels by age chart | 390 | 2 | – |
| normal testosterone levels in males nmol/l | 320 | 2 | **UK** |
| average testosterone levels by age | 110 | 27 | – |
| normal testosterone range | 70 | low | – |
| normal testosterone levels nmol/l | 70 | 0 | **UK** |

Roughly 1,200–1,500/mo on-topic; the by-age / chart / nmol/L wins are KD 0–2.

## The constraint (read first)

The article's whole thesis is that there is **no clean age-banded "normal" range** — that's the myth.
So we must NOT invent a precise "testosterone by age in nmol/L" table to chase the "chart" query: it
would contradict the article and isn't sourced. The honest move is to give readers the *age-decline*
reference the article already contains (Ewa-approved figures), framed as "here's what actually happens
with age, and why the clean chart you're looking for doesn't exist." That captures the intent without
fabricating clinical numbers.

All proposed copy is em-dash-free per the tone rule.

---

## Proposed change 1 — Title (changes H1 + meta title; slug stays the same)

Current: `The Myth of the Normal Range: what "within range" actually means`

- **Option A (recommended):** `Normal Testosterone Levels by Age: what "within range" actually means`
  Captures "normal testosterone levels" + "by age" while keeping the within-range hook. Drops the
  word "myth" from the title (kept throughout the body).
- **Option B (keeps "myth"):** `The Myth of the "Normal" Testosterone Range: levels, age, and what "within range" means`
  Longer; retains brand framing; slightly weaker keyword placement.

> Slug stays `myth-of-normal-range` — it is indexed; do not change it.

## Proposed change 2 — New H2 section

Insert before "What this means if your number came back 'normal'". Uses only figures already approved
in the article (peak in the 20s; ~1–2%/yr from 30; ~15–30% down by 45; >40% by 60; NHS 8–29 nmol/L
not age-adjusted).

```mdx
## Normal testosterone levels by age (and why there is no clean chart)

People search for a "testosterone levels by age chart". Here is the honest answer: a precise,
age-banded "normal" chart does not really exist, and that is the whole point of this article. The
NHS reference range (roughly 8 to 29 nmol/L) is a single band that is not adjusted for age. What
does change with age is the typical level itself.

| Age | What typically happens to testosterone |
|---|---|
| 20s | Lifetime peak |
| 30 onwards | Falls roughly 1 to 2% per year |
| Around 45 | On average 15 to 30% below peak |
| 60 and over | More than 40% below peak |

These are population averages, not personal targets. Two men of the same age can sit far apart and
both be "within range". That is why a single number against one wide band tells you so little, and
why a baseline you can retest matters more than where you fall on a chart.

**A note on units:** UK labs report testosterone in nmol/L. US sources use ng/dL (and supplement
sites often quote ng/mL). If you are comparing a US chart to a UK result, the scales are different,
so check which unit you are reading before you panic about a number.
```

## Proposed change 3 — New FAQ entry

Add to the `faq:` frontmatter block:

```yaml
  - q: "What are normal testosterone levels by age?"
    a: "There is no official age-banded normal range in the UK: the NHS uses one band (roughly 8 to 29 nmol/L) that is not adjusted for age. What changes is the typical level. Testosterone peaks in the early 20s and falls about 1 to 2% per year from age 30, so the average man is 15 to 30% below his peak by 45 and more than 40% below by 60. These are population averages, not personal targets, which is why a baseline you can retest matters more than a single reading against a chart."
```

---

## Keyword → element mapping

| Element | Captures |
|---|---|
| Title (Option A) | normal testosterone levels, normal testosterone levels by age |
| H2 + table | testosterone levels by age, testosterone levels by age chart, average testosterone levels by age |
| Unit note (nmol/L + ng/dL) | normal testosterone levels nmol/l, normal testosterone levels in males nmol/l, (secondary) ng/ml |
| New FAQ | what are normal testosterone levels by age (voice/AI) |

## Sign-off / risk notes for Ewa

- **Reused, already approved:** the age-decline figures (peak 20s, 1–2%/yr, 15–30% by 45, >40% by 60)
  and the NHS 8–29 nmol/L range are taken verbatim from the published, signed article body.
- **New copy needing sight:** the H2 framing, the by-age table presentation, the FAQ answer, the title
  change, and the units note. All factual and consistent with the existing piece, but they are new
  customer-facing clinical wording.
- **Deliberately excluded:** absolute nmol/L-per-age values. If Ewa wants an actual numeric by-age
  reference table, she would need to supply/approve the values and a source; this proposal does not
  invent them.
- Phase 0 boundary intact: no TRT framing, GP-referral language in the existing article unchanged.

## Implementation (only after Ewa sign-off)

1. Apply changes 1–3 to `content/blog/myth-of-normal-range.mdx`.
2. Run `compliance-preflight` on the file.
3. `node scripts/audit-keyword-coverage.js` — confirm the new terms register on-page.
4. Flip the 8 new `keywords.csv` rows (the `pillar-C` / `myth-of-normal-range` ones added 2026-06-18)
   from `coverage_status: planned → published`.
5. `next build`, commit, push, live smoke test (same ritual as the original publish).
