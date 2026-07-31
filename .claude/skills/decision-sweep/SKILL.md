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
   run — grep is the authority for docs changed recently.
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
- Owning STATE.md(s) updated and dated.
- ESCALATE list delivered with named owners.
- One commit, explicit paths, report sent.

## Known backlog (first sweeps to run)

The 2026-07-05 audit action list (`audit-2026-07-05-action-list.md`, repo
root) already contains four pre-scoped sweeps: the low-T→FM routing sweep, the
GP-built/personalised-report sweep, the affiliate-programme allowlist rewrite,
and the v2.2 marketing corpus banners.
