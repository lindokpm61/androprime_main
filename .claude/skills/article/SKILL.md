---
name: article
description: >
  Draft an Andro Prime SEO blog article from an approved brief in
  06_marketing/seo-ai-search/article-briefs/. Use when the task is "write
  article X", "draft the pillar Y hub/spoke", "turn brief Z into an article",
  or "produce the MDX for [slug]". Owns voice-pass, source verification,
  coverage-map mirroring, MDX assembly, and the Section 21 delivery report.
  Does NOT write briefs and never publishes — Ewa sign-off remains mandatory
  before anything ships to /content/blog/.
---

# /article — brief → drafted MDX

The brief carries the strategy and the section-by-section content guidance.
This skill is the process for turning that brief into a Keith-voice MDX file
that clears voice + coverage + compliance gates at handoff.

## Hard invariants

1. **The brief is the spec.** If brief and skill disagree, the brief wins.
2. **Voice + compliance must clear before drafting.** Read `tone-of-voice.md`
   and `/03_compliance/CONTEXT.md` in full before the first paragraph.
3. **No SOURCE TODO markers ship.** Every inline citation lands with a
   specific URL or DOI verified by WebSearch + WebFetch (batch in parallel).
4. **Don't claim CSV rows the brief didn't.** The MDX `keyword_coverage`
   block mirrors the brief's Section 5a table exactly.
5. **You do not publish.** Output lives in `article-drafts/`. Promotion to
   `content/blog/` is gated on Ewa sign-off per CONTEXT.md.

## Workflow

### 1. Load inputs (read-only — in this order)

1. `andro-prime/02_brand/tone-of-voice.md` — Section 9 is the voice-pass bar
2. `andro-prime/03_compliance/CONTEXT.md` — banned terms, EFSA claims, Phase-0 boundary
3. `andro-prime/06_marketing/seo-ai-search/coverage-rules.md` — sibling-pillar table, FAQ deconfliction
4. The article brief — `article-briefs/{slug}.md`
5. `andro-prime/06_marketing/seo-ai-search/keywords.csv` — confirm every row the brief claims has `primary_article_slug` blank or matching

Missing or stale input → surface that, not a partial draft.

### 2. Deconflict (before writing)

- Scan the sibling-pillar overlap table (coverage-rules.md Section 6) for the
  brief's pillar. Note which sibling vocabulary to stay out of.
- Grep candidate FAQ questions against `article-drafts/`, `article-briefs/`,
  and `09_website-app/frontend/content/blog/`. Reframe duplicates per
  coverage-rules.md Section 5.

### 3. Draft to the brief's heading scaffold

Work H2 by H2 in the order the brief specifies (its Section 8). Substance
from brief Section 9; voice from tone-of-voice.md Sections 2–7. Every H2 =
one Keith arc (hook → diagnostic question → reframe → close).

Density (tone-of-voice.md Section 6):

| Length tier | Word count | Fragment frequency |
| --- | --- | --- |
| Hub | 2,200–2,600 | ~1 fragment paragraph per 150 words |
| Spoke (long) | 1,500–2,000 | ~1 per 120 words |
| Spoke (short) | 800–1,500 | ~1 per 100 words |

### 4. Source verification (no placeholders)

- WebSearch in batched parallel for each citation the brief calls for.
- WebFetch the candidate URL to confirm the claim survives at that page.
- Inline format: `(Author, year, [Title](URL))`. Same URL repeated in the
  References section at article bottom.
- If a brief-suggested source doesn't survive (404, content changed, wrong
  journal), flag for Keith with the replacement candidate — don't silently
  swap. The Pillar G hub got bitten by exactly this: Cerqueira et al. 2020
  was named as *Sports Medicine* in the brief but is actually in *Frontiers
  in Physiology*. Verify journal AND URL.

### 5. Voice pass — 13-point self-check

tone-of-voice.md Section 9. Bar: ≥11/13 = pass. Specifically verify Move 1
(concrete opener), Move 2 (diagnostic question device), Move 4 ("It's not X.
It's Y." reframe), Move 5 (closing question), no banned voice-off words, no
"you should" / "you need to". If two long sentences land back-to-back, fix
the rhythm break before delivery.

### 6. Compliance pre-flight (mandatory — auto-invoke)

Invoke the `compliance-preflight` skill on the draft file. Apply its three
buckets — fix all 🔴 HARD; leave 🟠 FLAG-FOR-EWA lines as Keith would have
written them and surface them in the handoff report (step 9); record 🟢
PASS for the audit trail. A clean pre-flight does NOT equal "approved" —
Ewa sign-off on flagged items is the gate, not the skill output.

### 7. Assemble the MDX

Output: `andro-prime/06_marketing/seo-ai-search/article-drafts/{slug}.mdx`.

Use `pillar-G-hub-inflammatory-markers-blood-test.mdx` as the structural
template:

- YAML frontmatter: `title`, `excerpt`, `category`, `date`, `dateModified`,
  `authorSlug`, `reviewerSlug`, `initials`, `dark`, `readTime`, `toc`, `faq`
  (array of `q`/`a` pairs), `imgSrc`, `imgAlt`, `keyword_coverage` block
  mirroring brief Section 5a
- 40–60-word AI-snippet block immediately under H1 (the template renders the
  H1 from `title` — don't repeat it in the body)
- H2 sections in the order the brief specifies
- MDX components: `<EvidenceBox>`, `<PullQuote>` (uses `<div>` not `<p>` —
  MDX hydration constraint), `<ArticleFaq>`, `<ArticleToc>` if the template
  needs explicit invocation
- Inline citations in `(Source, year, [Title](URL))` format
- References section at the bottom with full bibliographic detail + URL

Do not install `@tailwindcss/typography` — `.article-prose` uses direct-child
selectors to avoid cascading into MDX components.

### 8. Fill Section 21 of the brief

Edit the brief file in place: coverage verification, source verification,
voice + compliance summary, gaps + open items, planned vs delivered vol.

### 9. Hand off — three lines, nothing else

- Draft path
- Voice-pass score (X/13) + compliance-preflight counts (🔴 / 🟠 / 🟢)
- Open items requiring Keith or Ewa decision

State explicitly: "Not approved — Ewa sign-off required per CONTEXT.md."

## When to fire

- Brief has `status: brief-ready` and is Keith-approved
- Author pages (`/authors/keith-antony`, `/authors/dr-ewa-lindo`) exist
- Brief Section 16 compliance gate is resolved enough to draft

## When NOT to fire

- Brief has open questions in Section 19 — Keith resolves first
- No brief exists yet — write the brief first; that process surfaces
  strategic decisions drafting can't
- HIGH compliance gate unresolved — never draft past it without Ewa input

## Pairing

- `compliance-preflight` — auto-invoked at step 6, mandatory
- Future `audit-keyword-coverage.js` (coverage-rules.md Section 9) — wire
  in as a final check once 3+ articles exist
