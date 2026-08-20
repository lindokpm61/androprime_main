---
name: context-audit
description: >
  Check every workspace CONTEXT.md against what is actually on disk. Use when the
  task is "audit the CONTEXT files", "are the docs still accurate", "check for
  doc drift", during the 12_operations quarterly docs-currency cadence, or after
  any change that moves, renames or deletes directories. Reports broken path
  citations, stale "does not exist" claims, and undocumented directories. It
  reports; it does not edit CONTEXT.md.
---

# CONTEXT.md drift audit

Internal skill. The work is mechanical and lives in the script; this file exists
to say what a clean run does and does not mean.

```bash
node .claude/skills/context-audit/audit.js [workspace ...]
```

Default: every `andro-prime/NN_*` workspace with a CONTEXT.md. Exit **0** clean,
**2** drift found, **1** could not run — and exit 1 is never a pass, because an
audit that did not happen has cleared nothing.

## Why it exists

The 2026-07-25 repo-wide manual audit found systemic drift across all 17 CONTEXT
files: one listed 16 of 31 files, another omitted whole subtrees, several "this
directory does not exist" claims were false, one pointed at a financial model
that does not exist, and **09_website-app labelled the live-served
`canonical-site/` as "safe to delete"** — an active deletion hazard against
production pages. Nothing checked any of it, so the drift stayed invisible until
someone paid for a full manual pass. (Observation 13.)

## What it checks, and what it cannot

| Bucket | Meaning |
|---|---|
| 🔴 BROKEN | A backticked path the CONTEXT names does not resolve anywhere |
| 🟠 STALE | A "does not exist" claim about a path that DOES exist |
| 🟠 UNLISTED | A non-gitignored child directory the CONTEXT never mentions |

**A clean run means the paths resolve. It does not mean the document is true.**
Whether the prose is accurate, whether a described file still does what it says,
and whether a pointer is semantically right are all outside what a diff can see.
Say that when reporting a green run, rather than letting it read as "the CONTEXT
is correct".

**Only backticked citations are checked.** Prose mentions are ignored on purpose:
including them produced a flood nobody would read, and a checker people learn to
dismiss is worse than no checker — the same dynamic that turned the old
whole-file em-dash guard into a no-op.

## Reading the findings

- **BROKEN is usually a real fix**, and usually one of: a renamed directory
  (`checklists/` became `implementation-checklists/`), a file that was planned
  and never created, or a genuinely dead pointer.
- **Two residual false-positive shapes are known and left in**, because
  suppressing them costs more coverage than they cost attention:
  slash-enumerations written as if they were paths
  (`api/jobs/middleware/services/webhooks/`, `phase5/6/7-plan.md`).
- **STALE is the highest-value bucket and the rarest.** A false "does not exist"
  suppresses exactly the curiosity that would correct it, which is how the
  `canonical-site/` deletion hazard survived.
- **The script never edits a CONTEXT.md.** Fix findings by hand, and per the repo
  convention, in the same change as whatever moved.

## Beyond path resolution — eight rules for the part the script cannot see

The script answers "do the citations resolve". Everything below is the manual
half, and each rule comes from an audit that produced a confident wrong answer.

**1. A doc recording a decision about an external system is an intention, not a
state — reconcile it against the system.** `06_marketing/content/social-channel-setup.md`
records a locked 2026-07-19 decision to use `keith.antony.tech` and to reject
`.ai` specifically, because "ai" in a health handle signals AI-generated content.
Metricool's `getBrandSettings` returns the connected Instagram as
`keith.antony.ai`, connected 2026-07-28 — nine days AFTER the decision, and
nothing caught it in the ten days since. The same file carries a second instance:
an X handle change on 2026-07-30 with a note to "verify the Metricool connection
still resolves" and no evidence it was ever run. The register is treated as
source of truth for a value it does not control, so a decision recorded correctly
and enacted incorrectly reads as clean from inside the repo forever. Add a
channel-reconciliation pass: pull live handles from Metricool `getBrandSettings`
and LinkedIn from Unipile, diff against the handles asserted in the register. One
read-only call per connector covers every channel. Where a value is not
machine-readable (bio text, avatar), the register must mark it **manually
verified, with a date**, rather than implying it is current. (Observation 181.)

**2. Enumerate the namespace before counting anything in it.** A 498-line
architecture proposal opened its evidence section "All counts read live from
Postgres, not carried forward from a doc", and every count was correct. A single
`list_tables` call then surfaced three tables the document never mentions, two of
which contradict its framing: a metrics table it has no measurement story for,
and a revisions table whose own column comment states the exact requirement the
proposal spends a section designing from scratch. **A live read is only as
complete as its query set** — counting known objects proves freshness, never
coverage. Require the enumeration step before the counting step, record the
enumeration query beside the counts, and explain any object the analysis does not
use, so a reader can tell "this is everything" from "these are the ones I asked
about". (Observation 227.)

**3. Turn the document's own thesis back on the document, and on the layer
beneath it.** A proposal whose central finding was that every serious failure
traces to two copies of one fact with nothing watching was internally consistent
throughout, and reading it on its own terms found nothing. Applying its thesis to
the schema found the create statements for the tables under discussion exist in
no file at all; applying it to the document itself found a fourth long plan
restating two existing ones. A document arguing against duplication, unwatched
state or missing ownership is **asserting a standard, and the standard is
checkable**. Extract the central claim as a test and run it against (a) the layer
below the one addressed and (b) the document itself — the two places it is least
likely to have been pointed. (Observation 228.)

**4. Two copies is a signature, not a finding.** An audit found two directories
of database migrations with differing contents and wrote it up confidently as
drift, recommending one be deleted. On executing that, the second directory
turned out to be gitignored, untracked, regenerated by a sync script, and
documented as a build artifact in a README already sitting in the first
directory. The wrong half of the finding had propagated into three documents
first, because the audit and the execution were separated by several steps.
Before reporting any duplicated-state finding, run two checks and **record their
results in the finding itself**: (a) is each copy tracked by version control, and
(b) does a README, CONTEXT or config file in or above either location already
describe the relationship? Report drift only if both come back negative. Where a
finding recommends deleting something, the tracked/untracked check is mandatory,
not advisory. Duplicated state is expected and correct whenever one copy is
generated, so the finding is incomplete until it establishes that neither copy is
derived from the other. (Observation 231.)

**5. Measure a documented observable where the watcher reads it, not where the
code computes it.** An operations doc told the reader to read Task Scheduler's
"Last Run Result" column as a job's signal, with a table of what each exit code
means. The exit codes were carefully designed, carefully documented, and never
arrived: `process.exit(code)` crashes the runtime on this platform and returns a
crash code instead, reproducibly on every run. Nobody noticed because a crash
code and a real code look identical in a task history, and the job had only ever
been read by a human watching its printed output. It surfaced by accident when a
new job written to the same pattern crashed while being tested twice. **Code
review confirms what a system computes and cannot confirm what it emits**, so any
contract whose whole purpose is to be read by an unattended watcher has to be
measured at the point the watcher reads it: run the job twice and read the actual
value. Keep this as a step distinct from reading the implementation — the
implementation here was correct and the observable was still wrong.
(Observation 233.)

**6. Before regenerating a derived file, review what the regeneration REMOVES.**
A database types file was regenerated to fix a type error; the regeneration
succeeded and a typecheck elsewhere immediately failed on a field that had been
hand-narrowed inside the supposedly generated file. The file carried no marker
saying it had been edited, and the edit was a genuine improvement the generator
cannot reproduce, because it encodes a constraint the generator cannot read.
Regenerating was still right, and it would have shipped a silent regression had
the project's own typecheck not caught it. So: diff the current version against a
fresh generation and read the deletions, not only the additions; take the
verification baseline **before** the change so a regression shows as a delta
rather than an argument about whether it was already there; and where a hand edit
turns out to encode real knowledge, **relocate it somewhere a regeneration cannot
reach** rather than re-applying it and waiting for the next regeneration to
delete it again. A generated file that has been hand-edited is two artifacts
sharing a filename. (Observation 234.)

**7. A one-line verdict with no stated SCOPE reads as a blanket verdict.** This is
a contradiction class the audit should look for by name, and it is not a
disagreement between two stated facts — it is one under-specified sentence that
manufactures the disagreement. Flag any single-line conclusion about a channel,
tool or tactic that states a result without naming the scope it holds over (cold
acquisition versus warm conversion versus retention; paid versus organic; which
segment), **where another doc in the repo assigns that same thing a substantive
role**. A GTM research file carried "WhatsApp: highest reach all ages but
messaging, not an acquisition surface"; two partner ICP docs in the same repo
called WhatsApp groups "the actual decision-making layer" and the "primary trust
layer", and a third made it the send channel for the highest-converting cohort.
Nothing was wrong: the strategy line was about COLD top-of-funnel and the tactical
lines were about warm referral. It just never said so. **The fix is to qualify the
verdict in place and link the tactical docs, never to reverse it** — "not a cold
acquisition surface; is the warm referral and conversion layer, see X and Y".
Research summaries compress a scoped finding into an unscoped sentence, and that
is exactly where cross-doc contradictions get manufactured. (Observation 334.)

**8. A verdict determined by someone else's rule has a shelf life set by that
rule, not by your document.** Where a doc records something as unavailable,
impossible or prohibited because of an external policy — a platform's terms, a
vendor's tier, a regulator's list — it must name **the rule that closes it and the
date that rule was checked**, so a later reader knows what to re-verify instead of
inheriting the conclusion. Without that, a channel closed by a rule stays closed
in the docs after the rule changes, and a channel currently open can silently
close with nothing to notice. Add a re-verification pass: for each externally-gated
constraint, re-check the source before relying on the recorded verdict. And where
the platform's own published text disagrees with secondary reporting, **record both
and mark the item as needing vendor confirmation** — the honest output is a flagged
uncertainty, never a confident pick between them. (Observation 335.)

## Where it runs

Wired into the 12_operations quarterly docs-currency cadence. Also worth running
after any change that moves, renames or deletes a directory, which is when the
drift is created and the cheapest moment to fix it.
