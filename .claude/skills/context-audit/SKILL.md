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

## Where it runs

Wired into the 12_operations quarterly docs-currency cadence. Also worth running
after any change that moves, renames or deletes a directory, which is when the
drift is created and the cheapest moment to fix it.
