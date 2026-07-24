---
name: wrap
description: End-of-session close-out sweep for Andro Prime. Use when Keith says "wrap", "wrap up", "close out", "update memory", "update clickup", "update github", "commit and push", or gives any two of those together. Reconciles STATE.md/CONTEXT.md for every workspace touched this session, updates ClickUp, then commits by explicit path and pushes to main. Replaces the manual "update memory" + "update clickup" + "update github" chain.
---

# /wrap — session close-out sweep

One command that does the three chores Keith otherwise asks for separately at the end of every session: repo state update, ClickUp update, git commit + push. Run all three stages unless Keith names just one ("wrap, no clickup" skips stage 2).

## Stage 1 — Repo state (the new "update memory")

Business knowledge lives in the repo, not in Claude's memory files (migration 2026-07-02).

1. Run `git status --porcelain` and review this session's conversation to list every workspace touched (`andro-prime/NN_*/`).
2. For each touched workspace:
   - **STATE.md** (volatile status): update what changed this session — decisions made, tasks completed, blockers cleared, new open items. Use absolute dates (today's date), never "today"/"yesterday".
   - **CONTEXT.md** (durable facts): only update if a lasting fact changed (a threshold approved, a tool swapped, a policy set). Do not log session narrative here.
3. If a decision was made by Keith or Ewa in this session (approval, threshold, pricing, sign-off), it MUST land in the owning workspace's STATE.md with the date and who decided.
4. Do not write to `~/.claude/projects/.../memory/` unless the fact is personal/behavioral/tooling, not business.

## Stage 1b — Skill observations (task-observer)

The `task-observer` skill logs skill-improvement observations during the session to `~/.claude/projects/d--Androprime-main/skill-observations/log.md` (the stable project folder, alongside `memory/`).

1. **Flush then surface, don't apply.** Flush any pending observations to the log per task-observer's rules, then surface OPEN observations as a grouped summary: improvements grouped by skill, new-skill candidates listed separately. Log-and-defer — do NOT rewrite any SKILL.md during wrap unless Keith explicitly names one ("update the article skill"). Applying skill edits is task-observer's own review step, not a wrap chore.

### Three-way ownership — file each learning by type, never twice

A single learning goes in exactly ONE of these. Do not duplicate across them.

- **Durable fact or preference** (a threshold, a business rule, a behavioural preference) → **memory** (`memory/`, if personal/behavioural/tooling) or the owning workspace **CONTEXT.md** (if business). Handled in Stage 1.
- **Dated live-status change** (deployed, approved, activated, signed-off) → the owning workspace **STATE.md**. Handled in Stage 1.
- **Skill-definition improvement** (a SKILL.md needs a new rule/enforcement, or a new skill is warranted) → a **task-observer observation**, surfaced here, applied later on review. NOT memory, NOT STATE.

Memory owns the *fact*. STATE owns the *status*. task-observer owns the *skill edit*. If a learning feels like it belongs in two, split it: e.g. "Keith wants docs synced when code changes" is a behavioural preference (memory) AND a candidate rule for the code-editing skills (task-observer observation) — the fact goes to memory, the skill-edit suggestion goes to the log.

## Stage 2 — ClickUp

- ALWAYS pass `workspace_id: "90121729875"` on every ClickUp call. Sprint list: `901217968514`.
- Close tasks completed this session; add comments to tasks progressed; create tasks only for genuinely new work items Keith agreed to.
- If a task's status is ambiguous, leave it and flag it in the final report instead of guessing.

## Stage 3 — Git

- Stage by explicit path only — NEVER `git add -A` or `git add .`.
- Only stage files this session actually created or changed. Look at the working tree first; if there are unrelated dirty files from another session, leave them and say so.
- Commit straight to main (no branches, no PRs for solo work), conventional-commit style matching repo history, e.g. `docs(products): ...`, `feat(content-engine): ...`.
- Push to origin main.
- If a customer-facing copy file is being committed, scan it for em dashes first (banned as an AI tell); flag any found rather than silently shipping.
- If any file under `andro-prime/06_marketing/content-machine/assets/` is being committed, run the content gate scanner on those files first: `node .claude/skills/content-status/scan.js <file> [<file> ...]`. A 🔴 HARD hit (exit 2) blocks the commit until it is fixed; 🟠 REVIEW items are advisories and do not block.

## Report

End with a terse plain-English summary, no narration:
- workspaces updated (which STATE/CONTEXT files)
- ClickUp tasks closed/updated (names, not IDs)
- commit hash + files committed
- anything skipped or ambiguous that needs Keith's call
