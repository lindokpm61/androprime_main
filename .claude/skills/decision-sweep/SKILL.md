---
name: decision-sweep
description: >
  Propagate a major Andro Prime decision through every associated document.
  Use when a decision has just been made or implemented ("we changed X",
  "sweep the repo for the pricing change", "run the decision sweep for
  <decision>"), or when a decision doc / STATE entry exists but its
  cross-workspace cleanup was never done. ALSO fire it whenever a load-bearing
  VALUE just changed in code or a doc — a threshold, constant, price, routing
  rule, or claim — even if you only edited it in one place; the risk is exactly
  the older doc layer that still states the old value. Finds every doc still
  carrying the superseded fact, updates or SUPERSEDED-banners each one, and
  reports what needs Keith/Ewa/solicitor sign-off. Exists because the 2026-07-05
  audit traced every major repo contradiction to a decision that was implemented
  correctly in one place but never swept through the older doc layer.
---

# Decision Sweep

A decision is not done when it is implemented and recorded once. It is done
when no live document still states the old fact as current. This skill is that
finishing pass.

## When to fire this

Trigger on the CLASS of change, not only on an explicit "sweep" request. If any
of these just changed — in application code, a config constant, or a doc — run
the sweep, because the same fact almost always lives in several older docs too:

- a **threshold or constant** (a trigger value, an interval, a window)
- a **price** or margin
- a **routing rule** (which result goes where, which CTA fires when)
- a **claim** or boundary wording
- a **gate that LIFTED**: a sign-off landed, a restriction expired, a pack was
  approved. Permissions propagate through docs exactly like facts and expire the
  same way, and a stale block is the harder failure to notice, because tooling
  that refuses to act looks obedient rather than broken. Two rules specific to
  this case. **Search on the thing being restricted, not on the wording of the
  restriction**, since prohibitions get paraphrased far more freely than numbers
  do ("GATED", "held for Ewa", "pending decision", "do not produce" were four
  phrasings of one block). And **distinguish the part that lifted from any part
  that remains**: a blanket "unblocked" overshoots as badly as the stale block
  undershot. (Observation 47; CA-028 sweep, 2026-07-31, where a per-pillar gate
  lifted and a per-asset gate did not.)
- **the user asserting a decision already exists** ("I thought we agreed this",
  "this was already decided", "why hasn't this changed"). Fire on this even
  though nothing was just edited. An unwritten decision has the same blast
  radius as a written one and no artefact to grep for, and the docs will still
  be asserting the superseded position confidently. (Observation 93.)
- **an AWAITED INPUT has landed.** A decision approved while an input it names
  is explicitly still owed carries a debt that its own approval conceals, and
  change-triggered review never collects it, because nothing changed: the
  missing thing merely stopped being missing. Two threshold decisions were
  signed off by the domain expert with the authoritative reference data
  recorded as outstanding, tracked honestly in a warning box; the data then
  arrived and contradicted both, and nothing re-opened them. So: when a
  decision is recorded as made without an input it names, register the pending
  input as an explicit **re-open condition on that decision**, not merely as an
  outstanding item elsewhere; on arrival, surface the decision for
  re-ratification by its original owner with the new value beside the approved
  one. "Feed the ranges in" is a data-entry task, not a re-open of the
  judgement that was made without them. (Observation 165.)
- **a defect was found that belongs to a CLASS, not an instance.** When one
  module of a known kind is fixed, the closing step is a sweep of every sibling
  in that class for the same defect, recording which were **checked**, not only
  which were fixed. A privileged-write module was found executing itself from
  its own test suite, causing real writes to production; the fix was applied
  and documented thoroughly in that file's header, and a peer in the same
  directory doing the same class of work carried the identical defect for days
  until a test added for an unrelated reason produced one stray line of output.
  Prefer an invariant that enumerates peers **from disk** rather than from a
  hard-coded list, so a newly added module is covered by default. A
  well-documented local fix is the most convincing form of an unswept one.
  (Observation 157.)

Reconstructing this checklist from memory forfeits the whole point of the skill,
which is the completeness guarantee. If you just edited one of the above in one
place and did not sweep, the decision is not done. (Weekly-review Observation 9,
2026-07-25: a t<15→t<12 threshold change was propagated by hand across code,
tests, copy, and docs without invoking this skill — it happened to be complete,
but on the riskier path.)

## Direction: a sweep can run in reverse

The default direction is outward from a NEW decision toward OLD docs. It also
runs the other way, and that case is invisible to a change-triggered check:
nothing changed, and something new was simply written wrong against a decision
that already governs it. **Ask which layer GOVERNS the fact, not which layer
stated it last.** The most recent artefact is not automatically the authority.

So there is a second, cheaper trigger: **whenever an artefact is authored that
restates a fact already governed by a decision doc** (a threshold, a claims
pack, a rules file), check the governing doc BEFORE publishing, not only when
the governing doc changes. In practice: for the primary claim of any new asset,
grep the product and compliance layers for the same marker, term or number, and
reconcile before it ships. When the new artefact is the wrong one, fix the
artefact and leave the governing doc alone. (Observation 69.)

## What counts as a carrier — sweep by audience surface, not by file extension

A decision is encoded in two kinds of place: the ones that **describe** it and
the ones that **enforce** it. A sweep that visits only Markdown prose leaves the
decision half-applied, and the failure is silent and delayed — nothing breaks at
decision time, and the first symptom arrives later when someone tries to use the
new value and a store rejects the thing the docs prescribe. The person caught
between them usually resolves the conflict by degrading the data, which is
exactly what the change existed to prevent.

Five carrier classes, each of which has already been missed:

1. **Executable constraints.** Database CHECK constraints and enum types, JSON
   and YAML schema files, validator and scanner tables, frontmatter linters,
   and any hardcoded list in a dashboard or generator. `content-funnel-map.md`
   gained a `canonical-article` CTA value and every doc was updated; registering
   an asset that used it still failed, because the CHECK constraint carried the
   old eight values. A grep for one of the *existing* values usually finds them
   all. (Observation 101.)
2. **Code readers of a data shape.** A schema change reaches code that no
   document names. Adding a `variant` column — and with it a new *shape* of row,
   three where the invariant had always been one — reached the repo-side
   scanner's file-owned key list, the mirror writer that now renders three
   identical-looking lines, the nightly doctor invariant requiring a file per
   row, and a channel registry with no row for the new pair. Each degraded
   quietly rather than failing: a mirror with three ambiguous rows still
   renders, and an invariant that goes from PASS to ten violations still runs.
   Grep the table name across the **tooling** directory, not the docs, and rule
   each reader **updated / deliberately unchanged / owed**. Produce the list
   even when it is empty, so "no code reads this" is a recorded finding rather
   than an unasked question. (Observation 238.)
3. **Audience surfaces.** Review pages, dashboards, generated HTML, READMEs and
   mock-ups — the artefacts people actually look at. A `review.html` led with a
   prominent amber "open decision, not decided" panel recommending a cover
   direction that had been decided against the previous day, with the retraction
   already recorded in STATE.md and the code; the sweep skipped it because a
   `.html` file in a content folder does not read as "a doc". Grep the owning
   workspace for the superseded claim's **own words**, not just for filenames.
   Where the fact is volatile, prefer generating the surface's volatile block
   from the source of truth over restating it, since the copy is what goes stale
   and the copy is usually the one on screen. (Observation 207.)
4. **Artefacts authoritative OVER the skill.** Where a documented precedence
   order lets a lower-level artefact override a higher-level rule, changing the
   rule is necessary and never sufficient. A voice rule was changed in both
   owning documents and in the drafting skill, and a targeted grep across those
   files came back clean; a wider sweep found two briefs still carrying the
   superseded instruction as a live directive. Because `/article`'s first hard
   invariant is "if brief and skill disagree, the brief wins", those briefs would
   have silently overridden the new rule for exactly the articles they govern.
   **Sweep in the direction of authority** — outward from the changed rule to
   everything permitted to override it. Distinguish live directives from
   historical audit records: a completed brief's "voice self-check: passes 13/13"
   is an audit trail and must not be edited. A grep restricted to the files you
   edited always reports success, because it asks whether you did what you just
   did rather than whether anything still contradicts it. (Observation 199.)
5. **Mirrored stores, where one copy is a lagging mirror.** A STATE entry read
   "strip the two dead markers from the served bodies"; the markers were deleted
   from `content/blog/*.mdx` and the task read as done, while the site serves
   `blog_articles.body` and all five slugs still matched afterwards. Every local
   check — grep, `git diff`, MDX parse — reported success, because every local
   check reads the mirror. Any change to a mirrored store must **state which
   copy it reached and assert against the other**. (Observation 98; see
   `publish-article` for the article-specific rule.)

**This does not override invariant 4.** The sweep's job is to *find and report*
every carrier; changing application code remains its own task with its own
verification. But an executable carrier that was never enumerated is an
unfinished sweep, not a respected boundary — flag it, name it in the report, and
give it an owner.

### Two review rules for the code half

- **Read what the default branch asserts, not merely that a default exists.** A
  signed clinical decision said one marker was "report-only, do not band it",
  implemented by omitting its `case` so it fell to the switch's `default`. That
  branch was not neutral: it returned a state whose copy read "within the normal
  range" and "no action is needed", while the display layer derived colour bands
  from the supplied reference range, so an out-of-range value rendered red
  beneath a sentence calling it normal. "Do not evaluate X" and "evaluate X as
  normal" are opposite instructions that produce identical-looking code when the
  exclusion is expressed as an omission. Require an explicit branch returning a
  deliberately neutral result, and treat "we let it fall through" as a finding.
  (Observation 164.)
- **A rule implemented once and summarised once is implemented twice.** When a
  change adds or moves a boundary, grep for the marker or **concept name** across
  the codebase rather than for the number, and specifically inspect anything that
  reduces a detailed state into a summary flag for an external system. A new
  upper band was added to a classifier while the same boundary sat in a boolean
  summarising the whole result for the messaging platform — open-ended in exactly
  the way the band was closing. Shipping only the visible half would have had the
  page telling a man to see a doctor while the messaging system enrolled him in
  the all-clear sequence. A search for the threshold *value* would not have found
  it, since the second copy expressed the rule as an unbounded comparison. The
  summary is the copy that drifts, because it looks like reporting rather than
  logic, and it is usually the one that reaches the customer through a different
  channel — so the two halves contradict each other in public. Add to the
  checklist: *does any aggregate or outbound signal encode this same rule?*
  (Observation 167.)

## Input

The decision, stated as: **old fact → new fact, date, owner, decision doc.**
If no dated decision doc exists yet, create one first
(`YYYY-MM-DD-topic.md` in the owning workspace) — the sweep needs a canonical
record to point banners at. For a decision that was only ever agreed in
conversation, writing that doc IS the first step of the sweep: until it exists
there is nothing for the updated docs to point at, and no record that the
reversal was deliberate.

## Hard invariants (violating any of these is a defect)

1. **History is never rewritten.** Dated decision docs, everything in
   `03_compliance/content-approval/`, partner negotiation logs, and research
   snapshots keep their original text. At most they get a short dated
   forward-pointer note. They are listed in the report as deliberately
   untouched.
2. **Approved copy is never silently edited.** Anything logged in the
   content-approval register, any partner-facing brief, any published page or
   legal doc goes on the ESCALATE list for named-human re-approval (Ewa for
   clinical/claims, Keith for business, solicitor where flagged). Never set a
   register row to APPROVED yourself.
3. **Compliance overrides.** If the decision touches claims, routing,
   thresholds, or boundary language, read `andro-prime/03_compliance/CONTEXT.md`
   before editing anything, and run `/compliance-preflight` on any rewritten
   external-facing copy.
4. **Docs sweep, not code sweep.** If code disagrees with the decision, stop
   and flag it — do not change application code as a side effect. Code changes
   are their own task with their own verification.
5. **Stage by explicit path** (never `git add -A` / `git add .`). One commit
   per sweep.
6. **No em dashes** in any customer-facing text you draft as replacement copy.

## Workflow

1. **Define the search-term set.** From the old fact, list every literal form
   it appears in: exact phrases, numbers, prices, product/route names, and
   common paraphrases. Example from the audit: the deposit shelving needed
   "£75", "deposit", "founding member deposit"; the routing change needed
   "T < 12", "founding-member CTA", "FM list", "founding member list".
   Numbers matter as much as words.
2. **Find every carrier.** Graph-first (`mcp__graphify__query_graph`,
   `get_neighbors`) for concept-level hits, then exhaustive `Grep` for each
   literal term across `andro-prime/` (all workspaces), `09_website-app`
   (docs, site copy, email templates), and `.claude/skills/` (skills go stale
   too). Note the graph's docs layer only refreshes on a manual `/graphify`
   run — grep is the authority for docs changed recently. **Cover all five
   carrier classes above, not only prose** — executable constraints, code
   readers of a changed data shape, audience surfaces, artefacts authoritative
   over the skill, and mirrored stores.
3. **Read the blast-radius set regardless of grep results** (table below).
   Rules are often paraphrased rather than quoted, so a zero-hit grep does not
   clear a file that the decision class says must be read.
4. **Classify every hit:**
   - **UPDATE** — live rule, spec, CONTEXT, or reference doc: edit in place to
     the new fact, matching the doc's existing tone and format.
   - **BANNER** — superseded plan or model kept for the record: add a dated
     `> **SUPERSEDED (YYYY-MM-DD):** …` banner at the top pointing at the
     decision doc; do not rewrite the body.
   - **LEAVE** — historical records per invariant 1: list, don't touch.
   - **ESCALATE** — approved copy, partner-facing briefs, published pages,
     legal docs per invariant 2: list with the named owner whose sign-off is
     needed.
5. **Apply UPDATE and BANNER edits.** Update the owning workspace's `STATE.md`
   (and any mirroring status — e.g. `03_compliance/STATE.md` tallies,
   `10_launch-ops/STATE.md` gate lines) and bump each `_Last updated:_` date.
6. **Verify.** Re-run the full search-term set. **Re-grep the pattern CLASS,
   never the line references from your own earlier pass**: those were examples
   of the problem, not the exhaustive set, and treating them as the checklist
   is how a sweep reports clean while carriers remain. Beware a loose grep in
   the other direction too: a keyword that matches the right file in the wrong
   section reads as "already done" (during this review, three observations
   looked actioned on a keyword hit and were not). Expected result: zero hits
   outside the LEAVE and ESCALATE lists. Any residual hit is an unfinished
   sweep, not a rounding error.
7. **Commit** with explicit paths, message
   `docs(sweep): propagate <decision> (<date>)`.
8. **Report** to Keith: files updated / bannered / left / escalated (each with
   path), plus the open sign-offs by owner. The sweep is not complete while
   any ESCALATE item has no owner and date.

## Blast-radius table — minimum read set per decision class

| Decision class | Always read, even on zero grep hits |
| --- | --- |
| Pricing / COGS / margins | `04_products/CONTEXT.md` + `catalogue/`; `01_strategy/financial-model/` + `ltv-cac-*` + `master-implementation-blueprint.md`; `06_marketing/positioning/` + `master-plan/`; `07_sales/funnel/`; `09_website-app/STATE.md` (Stripe prices); `10_launch-ops` backlog |
| Results routing / thresholds | `04_products/results-engine/` + `CONTEXT.md`; `09_website-app/frontend/lib/results/classifier.ts` (flag only, invariant 4); `email-templates/CONTEXT.md` + sequences; `08_customer-journey/flows/`; `06_marketing/positioning/` + `content/` contexts; `03_compliance/CONTEXT.md` + register; `10_launch-ops/CONTEXT.md` QA checklist |
| Channel on/off (affiliate, paid, social) | `06_marketing/CONTEXT.md` + `master-plan/` + `affiliates/` + `paid-media/`; `01_strategy/` financial models + `STATE.md`; `07_sales/sales-gtm-context.md`; `10_launch-ops` KPI tables |
| Claims / compliance rule change | `03_compliance/CONTEXT.md` + `STATE.md`; `02_brand/prohibited-terms.md` + `trust-signals.md`; every file in `06_marketing/affiliates/briefs/` + programme docs; kit specs in `04_products/kits/`; site copy in `09_website-app`; `.claude/skills/compliance-preflight` + `article`; **`06_marketing/seo-ai-search/`** (strategy, calendar, coverage rules, atomisation model, engine roadmap) and **`06_marketing/content-machine/`** (playbooks, SOPs, templates, hook banks) |
| Entity / data / privacy | `03_compliance/dpia/` + `privacy/` + `data-controller-position.md`; `05_partners/` agreements; `09_website-app/CONTEXT.md`; `01_strategy/STATE.md` |
| Product add / remove / reformulation | all of `04_products/`; `06_marketing/seo-ai-search/portfolio-demand-gap-map.md` + briefs; `01_strategy/` models; `05_partners/` (Vitall, manufacturers); `09_website-app` product copy |

## Definition of done

- Zero live docs state the old fact as current (verified by re-grep).
- All five carrier classes enumerated, including a named code-reader list even
  when it is empty.
- Owning STATE.md(s) updated and dated.
- ESCALATE list delivered with named owners.
- One commit, explicit paths, report sent.

## Known backlog (first sweeps to run)

The 2026-07-05 audit action list (`audit-2026-07-05-action-list.md`, repo
root) already contains four pre-scoped sweeps: the low-T→FM routing sweep, the
GP-built/personalised-report sweep, the affiliate-programme allowlist rewrite,
and the v2.2 marketing corpus banners.
