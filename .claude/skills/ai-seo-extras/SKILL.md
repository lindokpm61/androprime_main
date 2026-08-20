---
name: ai-seo-extras
description: >
  Freshness and discovery rules that pair with the built-in ai-seo skill. Use
  alongside it for any AEO/GEO work: schema and rich-result eligibility calls,
  keyword and opportunity discovery, and any claim about what a search or answer
  engine currently does. Owns two failures the built-in guidance does not cover:
  a skill encoding a third party's rules inherits their release schedule but not
  their changelog, and a keyword map built from your own seeds returns only what
  you already believed while failing silently.
---

# AI SEO — the local delta

Pairs with the built-in `ai-seo` skill, which is not ours to edit. Read that
first; this adds only what it does not carry. Both rules below cost real work
when they were missed.

## 1. Perishable platform facts need a stamp; durable reasoning does not

**A skill that encodes someone else's rules inherits their release schedule but
not their changelog.** Durable reasoning and perishable facts age at completely
different rates, so a document interleaving them without marking which is which
**decays at the speed of its fastest-rotting claim while still reading, in full,
like it was written yesterday.** A version number on the whole file tells you
when the file was touched, not whether this sentence is still true.

So, when writing or relying on any AEO/GEO guidance:

- **Stamp the claim, not the file.** Any statement of a third party's *current*
  behaviour carries an inline `as of YYYY-MM` at the point of use, so a reader
  sees its age where they read it rather than inferring it from frontmatter.
- **Quarantine the perishable.** Keep platform facts in their own block, headed
  "Platform facts (verify before relying)", separate from the reasoning. Then
  the lines needing a web check are visibly distinct from the ones that do not.
- **Standing rule for this repo: verify any rich-result or schema-eligibility
  claim against current vendor documentation before acting on it.** That class of
  claim turns over faster than any skill gets updated. Google's FAQ rich-result
  deprecation is the worked example: a load-bearing justification changed under
  at least two of our docs and nothing in the skill could have signalled it.
- When such a fact does turn over, it is a **`/decision-sweep` trigger**, because
  the stale version is almost certainly restated in the older doc layer.

(Observation 254.)

## 2. Mine the world before concluding a seam is exhausted

**A map built from your own assumptions can only return what you already
believed, and it fails silently** — a seed-expanded keyword map returns a clean
empty answer rather than an error, which reads as "nothing left here" rather than
"my map does not extend there". **The categories worth most are the ones you had
no word for**, so by construction they cannot arrive from your own taxonomy.

Make "mine the world" a first-class discovery step alongside seed expansion, and
run it **before** concluding a seam is exhausted:

- Pull each named competitor's ranked keywords and diff against ours. Most tools
  expose this for cents, so cost is not the reason it gets skipped.
- Tally which **domains** and which **surfaces** appear in the answers being
  tracked, not only which of our own pages do. What the target surface actually
  cites is the other outside-in signal.
- **Phrase any exhaustion claim against the map that was searched, never against
  the market:** "no remaining candidates in the seed-expanded set", not "the seam
  is exhausted".

This is the same shape as the negative-result rule in
`12_operations/cross-cutting-principles.md` P15, applied to discovery rather than
to lookup. (Observation 274.)

## 3. Record the leading indicator beside every outcome

**A zero is not a finding until the measurement can say which of its possible
causes it excludes.** Recording only the outcome variable produces a number that
is *stable, cheap, correct and unattributable* — the most dangerous combination,
because correctness and repeatability are exactly what make it feel safe to act
on.

The GEO citation snapshot is the worked case: `cited: false` held flat while the
underlying position moved from unranked to roughly #40, which is real progress
the outcome variable cannot express. `our_rank` was added for exactly this and is
now live, pulled from the same `/live/advanced` call the `aio` engine already
makes, so it costs nothing extra on the Google surface.

The general rule, applied wherever a metric gets designed:

- **A snapshot recording an outcome must also record the nearest upstream
  variable that gates it**, chosen so a flat outcome can still show movement.
- Where that variable is genuinely unavailable, **the tool must print which
  causes its output cannot distinguish, in the same place it prints the result** —
  the same shape as the probe-blindness line (`AI Overview present on N/24`), one
  layer up.
- Before recording a zero, ask what would have to move first, and whether the
  snapshot can see it.

(Observation 259; same family as 258 — an output that cannot contradict a
plausible reading of itself.)

## When to fire this

Alongside `ai-seo`, on any AEO/GEO work: schema decisions, rich-result
eligibility, citation tracking, and every keyword or opportunity discovery pass
that could end in "there is nothing more here".
