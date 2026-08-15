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
   `content/blog/` is gated on Ewa sign-off per CONTEXT.md. Going live is the
   `/publish-article` skill's job, never this one.
6. **In-article product links go to indexable pages.** Every `InlineKitCTA`
   and inline product link targets `/kits/*` or `/supplements/*` (indexable),
   **never `/lp/*`** (noindex + robots-disallowed — link equity is wasted and
   the crawl signal is incoherent). Use **keyword-rich anchor text** (the
   target page's primary keyword, e.g. "blood test for tiredness" → not "see
   the kit"). This was retrofitted across all 5 articles 2026-06-10; don't
   reintroduce it.
7. **Declared keywords must be on the page.** Every query in the MDX
   `keyword_coverage.csv_rows_covered` has to actually appear in the rendered
   article (primary in title or a heading). Declaring coverage you didn't
   write is the bug the audit (step 9) exists to catch.
8. **Never hand-write Unsplash frontmatter.** The editorial photo
   (`photoSrc`/`photoAlt`/`photoCredit`/`photoCreditUrl`) is only ever written
   by `scripts/unsplash.mjs use` — it fires the ToS-mandatory download trigger
   that a hand-edit skips, which is an attribution-compliance breach. Pick the
   photo by hand; never auto-pick (health-context risk). Photo is optional —
   ship without one rather than force a weak/risky image.
9. **Drafts live under `06_marketing`, not `frontend/`.** The output path is
   `andro-prime/06_marketing/seo-ai-search/article-drafts/{slug}.mdx` (note: the
   draft is named by **slug**, even when the brief is a hub named
   `pillar-X-hub-{slug}.md`). A `find`/glob from `09_website-app/frontend/` will
   miss it and make an existing draft look like none exists. **On a re-run, READ
   the existing draft before regenerating** — if `Write` refuses with "file has
   not been read yet", that's proof the draft already exists; revise it instead
   of drafting from scratch.

## Workflow

### 1. Load inputs (read-only — in this order)

1. `andro-prime/02_brand/tone-of-voice.md` — Section 9 is the voice-pass bar
1b. `andro-prime/02_brand/references/narrative-devices.md` — nine structural
   devices derived from the spoken corpus. This is the "make it read human"
   layer; §9/§9a only catch what's wrong, this supplies what's missing.
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
from brief Section 9; voice from tone-of-voice.md Sections 2–7.

**The Keith arc (hook → diagnostic question → reframe → close) is the default
shape available to a section, not the shape every section takes.** Giving every
H2 the same skeleton is the strongest AI signal a draft can carry, and it
survives every word-level edit. Vary the section shapes deliberately: some
sections open on the reframe, some carry only a scene, some end without
resolving. Step 5c measures this and it is currently our live failure. See
`narrative-devices.md` → "The structural audit", audits 1 and 6.

Reach into `narrative-devices.md` for the shape of each section. Do not run
the list; pick what fits. The three that carry the most weight in article
prose:

- **Ordinary build, then rupture** (device 1) — patient mundane setup, then
  break it in a few flat words. Never signpost with "but then everything
  changed."
- **A physical object for an invisible state** (device 3) — the answer to
  writing a symptom without clinical language. Find the object, not the
  adjective. Claim-adjacent, so pre-flight whatever you write.
- **The banal scene carries the load** (device 6) — if a paragraph describes
  how something feels and names no specific object, place, or time, it isn't
  finished.

Per-section questions are **not** a quota (see narrative-devices.md, "What
this corpus does not support"). One genuine question per piece beats one
forced question per H2; the forced version is what reads as formula.

Density (tone-of-voice.md Section 6):

| Length tier | Word count | Fragment frequency |
| --- | --- | --- |
| Hub | 2,200–2,600 | ~1 fragment paragraph per 150 words |
| Spoke (long) | 1,500–2,000 | ~1 per 120 words |
| Spoke (short) | 800–1,500 | ~1 per 100 words |

**These bands count PROSE ONLY: everything after the frontmatter, excluding
embedded components and the reference list.** A band without its measurement
method is not a spec, it is an opinion with a number attached — anyone can
satisfy it or fail it at will by choosing a boundary, and the disagreement then
surfaces as an argument about the article rather than about the definition. A
draft measured everything-after-frontmatter came to 2,293 against a 1,600–2,000
band and looked 15% over; measured as prose only it was 1,708 and comfortably
inside. **Both numbers are defensible**, and two published siblings measured the
first way gave 1,477 and 1,733 while one of their own delivery reports cited
"~1,700" for the file measuring 1,477 — so the reporting had already drifted
between methods with nobody noticing. This is not cosmetic: components and
references were 34% of that document, and on a compliance-heavy article the
safety callout is both mandatory and long, so the stricter reading penalises
exactly the articles carrying the most required apparatus. Quote **both figures
with labels** in the Section 21 report. (Observation 176.)

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

### 5. Voice pass — 14-point self-check + AI-tells pass

tone-of-voice.md Section 9. **Bar: fail on 3+ misses**, which is how the source
document itself phrases it. Do NOT hard-code the box count here: count the
checklist items in `tone-of-voice.md` at read time and score against that.
A denominator copied into this file drifts the moment the source gains or
loses a box, and it already did — this skill cited a bar against a count the
checklist no longer carried, so the score was arithmetically meaningless while
looking precise. Never let a skill hard-code a number owned by another file.
(Observation 41.)

Specifically verify Move 1 (concrete opener), Move 2 (diagnostic
question device), Move 4 ("It's not X. It's Y." reframe), Move 5 (closing
question), no banned voice-off words, no "you should" / "you need to". If two
long sentences land back-to-back, fix the rhythm break before delivery.

Then run **Section 9a — AI tells** as a separate pass. It is not scored into
the 14: every hit is a rewrite before handoff. Six checks — throat-clearing
openers, meta-joiners, inanimate subjects doing human verbs,
narrator-from-a-distance, vague declaratives, negative listing. Section 9 asks
"does this sound like Keith"; 9a asks "does this sound like a machine". A
draft can pass the first and fail the second.

**Run the no-repeated-openers check by hand — nothing automates it.** The rule is
library-wide (`tone-of-voice.md` §3) and until 2026-08-15 that file claimed this
voice pass performed the check. It never did, and five of six published articles
had converged on one opening construction while the spec asserted otherwise. From
`09_website-app/frontend/content/blog`:

```bash
for f in $(ls -t *.mdx | head -8); do echo "--- $f"; \
  awk 'f&&NF&&!/^(import|export|<|#|:|\||-{3})/{print substr($0,1,60);exit} /^---$/{c++} c==2{f=1}' "$f"; done
```

If the draft's opener echoes any of them, rewrite it before handoff. **Never let
a spec assert an automated check unless something automated does it** — the
assertion is load-bearing in the reader's head, converting a rule they would have
verified by hand into one they assume is covered, so the failure is silent AND
accumulating. (Observation 175.)

**Two authoring rules for this pass, both learned the hard way.**

**The house spec wins over any general-purpose writing skill.** Imported skills
like `stop-slop` overlap `tone-of-voice.md` and will sometimes contradict it,
because a house rule often breaks a generic one deliberately. Never chain both
and let two skills own competing pass/fail bars for the same draft: diff the two
rule sets, port the non-conflicting deltas into the house spec, and where the
house rule deliberately breaks a generic one, say so in the spec so the next
reader does not "fix" it back. (Observation 39.)

**A prohibition written only from bad examples will condemn the good case too.**
Before adding any style rule, collect a violating set AND a permitted-but-similar
set, then encode the *discriminator*, not the surface form. Ship the rule with a
test the reader can apply. The §9a personification ban is the worked example:
the discriminator is "can you name a human actor and keep the meaning? If yes,
name them; if not, the inanimate subject IS the argument and it stays" — which
is why "the range was built to answer one question" survives a ban that kills
"the marker tells a story". (Observation 44.)

**Read the draft for these; do not grep for them.** Every one is a pattern,
not a token. A grep tight enough to avoid false positives misses "the test
*has* told you" and "the reference range tells you" while reporting a clean
pass, which is worse than not running the check. Grep is useful only for the
literal tokens (em dash, banned words).

**On personification (check 3), apply the named-actor test before cutting:**
can you name a human actor and keep the meaning? If yes, name them. If the
inanimate thing genuinely is the actor in the claim, it stays. The
reference-range articles are built on "the range was built to answer one
question" and that construction appears in approved clinical copy. Cutting it
would break both the argument and a signed quote.

Section 9a also carries four **carve-outs** (rule of three, the "It's not X.
It's Y." pivot, deliberate fragments, question-led openers). Generic
anti-AI-writing tools ban all four; they are house voice. Do not strip them,
and do not import an outside prose skill that fights them.

#### 5c. Shape-convergence check (structural — run last, before compliance)

Sections 9 and 9a test words. This tests **shape**, and it is the pass that
catches the residue people describe as "reads fine but feels AI-written".
Authority: `tone-of-voice.md` §9b, procedure in
`02_brand/references/narrative-devices.md` → "The structural audit".

**Run it on the skeleton, never on the prose.** Structural tells are invisible
at reading distance because good sentences hide them. Extract first, then judge.

1. **Extract this draft's skeleton.** The H2 list in order; for each section,
   its opening move and its closing move; where the Move 4 reframe lands; how
   many genuine questions appear and where; tangent count; where resolution
   happens.

2. **Diff against the last three published articles.** Source of truth is
   `09_website-app/frontend/content/blog/*.mdx`, ordered by frontmatter `date:`
   descending. Pull their H2 lists and compare:

   ```bash
   # Absolute path on purpose. The Bash tool's cwd persists between calls, so a
   # relative `cd` here silently resolves somewhere else and returns an empty
   # result that reads as "no convergence found". This bit during authoring.
   B=/d/Androprime_main/andro-prime/09_website-app/frontend/content/blog
   for f in "$B"/*.mdx; do echo "$(grep -m1 '^date:' "$f" | sed 's/date: *//')  $(basename "$f")"; done | sort -r | head -3
   grep -h '^## ' "$B"/*.mdx | sed 's/[:(].*//' | sed 's/ *$//' | sort | uniq -c | sort -rn | head -20
   ```

   The second command is the **library-wide slot check** and is the more useful
   of the two. Any editorial H2 appearing in more than about a third of the
   library is a converged slot; rename or restructure it in this draft.

3. **Apply the six audits** from `narrative-devices.md`. Expect audits 4
   (reference specificity) and 5 (reader engagement) to pass: the citation rules
   and the second-person register already put us on the human side, and a scan
   of the full library on 2026-08-10 found zero vague attributions. Expect 1, 2
   and 6 to need work.

4. **Pick one or two interventions** from the menu, not more, and different from
   the last piece. Record which you picked and why in the step 10 handoff report.
   Applying all of them uniformly recreates the problem one level up.

**Known converged slots as of 2026-08-10** (measured across all 18 published
articles, refresh this by re-running the command above):

| Slot | Frequency | Action |
| --- | --- | --- |
| `## Your next move` as the closing H2 | 18 of 18 | Template CTA block, a product decision. **Stays.** |
| `## What changes when you actually have the number` | 7 of 18, verbatim | Rename per article. |
| `## Why your GP ordered it, or why your panel includes it` | 5 of 18, verbatim | Rename per article. |
| `## How Andro Prime measures [marker]` | 10 of 18 | Vary the framing; the section itself is required. |

**Two rules that keep this pass honest.**

**The template CTA block is not a finding.** `## Your next move` and the kit
routing under it are a deliberate, repeated product surface. Do not "fix" it and
do not count it as a convergence hit. The audit is about the *editorial* H2s
around it. Flagging a deliberate template as a defect is how a structural check
gets ignored.

**Do not let the fix become the next tell.** This is the third time this spec
has met the same disease: the stock "I asked him one question" opener was
retired after it propagated, the per-H2 diagnostic question was qualified after
it produced the formula feel, and the H2 slots above are the current instance.
Each was a good device applied uniformly. So: rotate the intervention, vary it
across pieces, and never write a rule here that mandates one shape for every
section. `tone-of-voice.md` §6's "each H2 is one arc" is a default available to a
section, not a template every section takes.

### 6. Compliance pre-flight (mandatory — auto-invoke)

Invoke the `compliance-preflight` skill on the draft file. Apply its buckets —
fix all 🔴 HARD; leave 🟠 FLAG-FOR-EWA lines as Keith would have
written them and surface them in the handoff report (step 9); record 🟢
PASS for the audit trail. A clean pre-flight does NOT equal "approved" —
Ewa sign-off on flagged items is the gate, not the skill output. Surface the
🟠 lines in the handoff report (step 10).

**"Fix all HARD" has one exception, and it is not a judgement call you make.**
Where a governing claims pack SANCTIONS a red-flag term for keyword coverage —
CA-028 permits "andropause treatment" and "diagnose andropause" as a search term
echoed in a question and answered in a non-treatment frame — removing it fails
the keyword-coverage invariant (#7), so the two rules collide and the drafter is
stuck. Declare the permission instead, in the draft's frontmatter, and the
scanner clears it as 🔵 SIGNED EXCEPTION with the CA cited:

```yaml
preflight_exceptions:
  - treatment @ CA-028 : keyword echoed in an FAQ question, answered in a non-treatment frame
```

Only terms with a recognised compliant use (diagnose / cure / treat) can be
declared; anything else is refused as a HARD finding in its own right, and
**ashwagandha can never be exempted under any circumstance**. A declaration with
no valid CA number, or one that matches nothing in the file, is reported and the
underlying hit stays gated. Never invent a CA number to clear a gate: if no pack
authorises the use, the term comes out. (Observation 32.)

### 7. Assemble the MDX

Output: `andro-prime/06_marketing/seo-ai-search/article-drafts/{slug}.mdx`.

Use `pillar-G-hub-inflammatory-markers-blood-test.mdx` as the structural
template:

- YAML frontmatter: `title`, `excerpt`, `category`, `date`, `dateModified`,
  `authorSlug`, `reviewerSlug`, `initials`, `dark`, `readTime`, `toc`, `faq`
  (array of `q`/`a` pairs), `imgAlt`, `keyword_coverage` block
  mirroring brief Section 5a. Leave `imgSrc` unset (og:image defaults to the
  branded generated card). Do NOT hand-add the `photo*` fields — step 7b's tool
  writes them.
- **`ewa_rulings` (array of strings): required whenever a 🟠 line needs a NAMED
  decision from Ewa, not just her approval of the article.** One string per
  question, each phrased so ticking it IS the answer ("Confirm CA-028 §4 governs
  the 'treatment' query-echo in the H2 + FAQ Q6, or comment to redline").
  `signoff-concierge` turns each into a real ClickUp checklist item and
  `syncApprovals` refuses to approve until every one is ticked. Omit the key
  entirely for an ordinary article; an empty array is the same as absent.
  **Do not put a ruling request only in a ClickUp comment.** That is how the
  andropause hub (2026-07-29) was approved by a bare status flip with two CA-028
  rulings asked twice and never answered: a binary gate cannot carry a
  non-boolean answer, so silence became a yes. Every 🟠 line you surface in step
  10 that asks Ewa to *decide* something belongs here.
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

### 7b. Editorial photo (Unsplash) — optional, human-curated

Adds the on-site listing-card + in-body hero photo. The social og:image stays
the branded generated card regardless — this photo never touches og:image.

From `09_website-app/frontend` (network needs sandbox disabled):

1. `node scripts/unsplash.mjs search "<query>"` — run a query that matches the
   article's subject. Returns 12 candidates (id, photographer, alt, preview).
2. **Pick by hand.** Single relevant subject, editorial not stocky, nothing that
   reads as clinical/distress/off-brand in a health context. Never auto-pick the
   top result. If nothing is clearly right, skip the photo — it's optional.
3. `node scripts/unsplash.mjs use <slug> <photoId>` — fires the mandatory
   download trigger and writes the four `photo*` fields. Works whether the slug
   lives in `article-drafts/` or `content/blog/`.

The grayscale/contrast brand treatment + mandatory "Photo by X on Unsplash"
attribution (UTM on both links) are applied automatically by `ArticlePhoto`.
Surface the chosen image (photographer + Unsplash photo URL) in the handoff so
Keith can confirm or swap (`use <slug> <newId>`) before it goes live.

Rate limit is Demo 50 req/hr (search + the trigger count; the hotlinked image
does not) — plenty for authoring. See the Unsplash reference note for creds.

### 8. Fill Section 21 of the brief

Edit the brief file in place: coverage verification, source verification,
voice + compliance summary, gaps + open items, planned vs delivered vol.

**Write the compliance section as an ALLOWLIST of what the copy does, never as a
list of what it avoids.** Written the obvious way — the terms swept for, the
categories confirmed absent, the rules honoured — this report is a prohibition
list, and the compliance scanner this same skill mandates at step 6 then reads
those terms and grades the report as violating copy. On 2026-08-07 the shippable
article scanned completely clean while the report about it produced **seven HARD
and six REVIEW findings, every one its own vocabulary.** Rewriting it in
allowlist form cleared all of them while carrying identical information.

Use fields that cannot be filled with prohibited vocabulary:

```text
Compliance: categories swept: N | result: clean | framing: measurement, not outcome
Boundary: held throughout, scoped to the specific unlaunched item
Length: N words prose (excl. components + references) / N words total
```

`compliance-preflight` states this rule in its own reporting step, and stating it
there does not prevent it, because **the defect is generated by a step in THIS
skill** and a drafter following step 8 correctly produces it by default. A
recurring false positive that a second document already knows how to avoid is a
routing failure between documents, not a knowledge gap: put the guidance at the
point of authorship. (Observation 177; same family as 53, 70, 216.)

### 9. Keyword-coverage audit (auto-run, gate)

From `09_website-app/frontend`: `node scripts/audit-keyword-coverage.js`. It
walks `content/blog/` and reports per-article coverage. The new article must show:

- primary query **PASS** (in title or a heading) — a FAIL here is a blocker
- every declared `csv_rows_covered` query present — no high-vol **MISS** lines

Resolve any FAIL or high-volume MISS before handoff: weave the missing query in
where the content already covers the concept (don't keyword-stuff). `OPP` lines
(unowned on-topic cluster gaps) are FYI for the next brief, not blockers. If the
draft still lives in `article-drafts/` rather than `content/blog/`, this gate
instead runs at promotion via `/publish-article`.

### 10. Hand off — three lines, nothing else

- Draft path
- Voice-pass (X misses, bar is fail at 3+) + compliance (🔴 / 🟠 / 🟢) + audit (primary PASS/FAIL, covered N/M)
- Editorial photo: photographer + Unsplash photo URL for Keith to confirm/swap (or "none")
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
- `scripts/unsplash.mjs` — the editorial-photo tool at step 7b (search → human
  pick → `use` writes frontmatter + fires the ToS download trigger). Built
  2026-06-18; resolves slugs in `article-drafts/` or `content/blog/`.
- `scripts/audit-keyword-coverage.js` — the keyword gate at step 9 (built
  2026-06-10, implements coverage-rules.md Section 9). On-page presence +
  cov-aware opportunity. Exit 2 if a published article is missing its primary.
- `/publish-article` — the downstream skill that promotes a signed-off draft
  to live (status flip, hub/spoke co-publish, related-reading wiring, audit
  gate, build, smoke test). `/article` hands to it; never publishes itself.
