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
5. **If this session put a public-facing asset into the world, file it.** A live brand asset (a profile image, banner, logo variant, channel art, a published handle or display name) needs a repo home and a line in the owning workspace's STATE.md saying where it is and where it is live. An asset that exists only on the platform has no version, no owner and no compliance history, and cannot be swept when the brand changes. (Observation 80.)
6. **Before retiring, deleting, merging or folding any shared resource** (a ClickUp list, a Drive folder, a doc, a sequence, a channel), enumerate its full contents AND anything automated hanging off it first. Propose the retirement with that inventory attached, never from the name alone. A resource that looks redundant from its title routinely turns out to be the only home of something, or to have a webhook, schedule or skill pointed at it. (Observation 26.)

**This stage is the safety net, not the intended point of capture.** Keith's standing preference is that a doc describing code changes in the SAME change as the code (a middleware gate + its CONTEXT route-table row; a threshold + the STATE entry) — co-locating the edit is the cheapest defence against the CONTEXT-vs-live drift the repo's own conventions warn about. If wrap is finding un-synced docs at session end, they should have been synced at edit time; note them here but treat the pattern as a prompt to sync earlier next time. (Observation 4, 2026-07-25.)

## Stage 1b — Skill observations (task-observer)

The `task-observer` skill logs skill-improvement observations during the session to `~/.claude/projects/d--Androprime-main/skill-observations/log.md` (the stable project folder, alongside `memory/`). Two hooks nudge it: a `SessionStart` hook (`.claude/hooks/task-observer-activate.sh`) invites invocation at session start, and a throttled `PostToolUse` re-nudge (`.claude/hooks/task-observer-renudge.sh`, at most once per ~25 min) re-injects the reminder so it survives context summarization. Both are soft nudges: neither hard-enforces invocation, and in a long auto-summarized session live capture still lapses. **Treat the backfill below as the first-class path, not a fallback.** (Diagnosed 2026-07-25 after live capture lapsed twice in one session; see log Observations 7, 15, 16. The hooks + settings.json are gitignored, so they are local-only.)

1. **Backfill is the default: reconstruct this session's observations first.** Do not assume live capture happened. Verify by checking the log's newest entries against this session; in practice expect to backfill, because long summarized sessions almost always lose live capture. Scan the whole session for skill-improvement signal, checking each of: (a) a SKILL.md rule that was missing, wrong, or under-specified; (b) a hook or enforcement gap (a hook that fired wrongly, did not fire, or was misread); (c) a step done manually that a skill should own, or a new-skill candidate; (d) a correction Keith made more than once. Append anything found to the log FIRST, in the skill's format (numbered from the log's current max), under a dated retroactive-backfill header. Only then proceed. A session's skill-improvement signal is lost if wrap does not backfill it.
2. **Flush then surface, don't apply.** Flush any pending observations to the log per task-observer's rules, then surface OPEN observations as a grouped summary: improvements grouped by skill, new-skill candidates listed separately. Log-and-defer — do NOT rewrite any SKILL.md during wrap unless Keith explicitly names one ("update the article skill"). Applying skill edits is task-observer's own review step, not a wrap chore.
3. **Mirror every observation onto the ClickUp board in the same pass** (list `901220039345`, Stage 2 below). New entry → new task `OBS-NNN | title | STATE`. Status change → move the task and put the resolution line in its body. The board is where Keith reads the backlog and where "has this already been done?" gets answered, so an observation that exists only in the log is invisible to him. **And before surfacing anything as outstanding, check the board**: this session found an observation still marked OPEN that had been actioned an hour earlier in the same session.

### Three-way ownership — file each learning by type, never twice

A single learning goes in exactly ONE of these. Do not duplicate across them.

- **Durable fact or preference** (a threshold, a business rule, a behavioural preference) → **memory** (`memory/`, if personal/behavioural/tooling) or the owning workspace **CONTEXT.md** (if business). Handled in Stage 1.
- **Dated live-status change** (deployed, approved, activated, signed-off) → the owning workspace **STATE.md**. Handled in Stage 1.
- **Skill-definition improvement** (a SKILL.md needs a new rule/enforcement, or a new skill is warranted) → a **task-observer observation**, surfaced here, applied later on review. NOT memory, NOT STATE.

Memory owns the *fact*. STATE owns the *status*. task-observer owns the *skill edit*. If a learning feels like it belongs in two, split it: e.g. "Keith wants docs synced when code changes" is a behavioural preference (memory) AND a candidate rule for the code-editing skills (task-observer observation) — the fact goes to memory, the skill-edit suggestion goes to the log.

## Stage 2 — ClickUp

- ALWAYS pass `workspace_id: "90121729875"` on every ClickUp call.
- **ClickUp is the hub, the repo is the mirror.** Several lists mirror repo state, and Sprint is only one of them. Reconcile *every* list this session touched, not just the named one:

  | List | ID | Mirrors | Reconcile rule |
  |---|---|---|---|
  | Sprint (Pre-launch) | `901217968514` | delivery work | close/comment tasks this session moved |
  | Content Library | `901219526361` | `06_marketing/content-machine/assets/` | any new or changed asset file needs a task whose status equals the file's `status` field (idea / hooked / scripted / recorded / edited / approved / done) |
  | Approvals & Sign-offs | `901219880207` | `03_compliance/content-approval/` | one task per CA-NNN; **log the approval here first**, then mirror to the repo register |
  | Content Review (blog articles) | `901218140081` | per-article Ewa sign-off | task complete = approved; never edit status to represent an approval |
  | Skill Observations | `901220039345` | `skill-observations/log.md` | one task per observation, `OBS-NNN \| title \| STATE`; `to do` = OPEN, `complete` = ACTIONED/DECLINED. Any observation logged this session needs a task; any status change needs the task moved |

  The vocabularies differ per list (Sprint has no `scripted` status), so map to the list's own statuses rather than copying one list's words into another.
- Close tasks completed this session; add comments to tasks progressed; create tasks only for genuinely new work items Keith agreed to.
- If a task's status is ambiguous, leave it and flag it in the final report instead of guessing.
- **Never set an approval status yourself.** Only a named human approves. Reading these lists is how you learn what is signed off; writing them is not how you sign anything off.

## Stage 3 — Git

- Stage by explicit path only — NEVER `git add -A` or `git add .`.
- Only stage files this session actually created or changed. Look at the working tree first; if there are unrelated dirty files from another session, leave them and say so.
- Commit straight to main (no branches, no PRs for solo work), conventional-commit style matching repo history, e.g. `docs(products): ...`, `feat(content-engine): ...`.
- **Commit-message mechanics (the Bash tool runs POSIX sh, not PowerShell).** Use a POSIX heredoc — `git commit -F - <<'EOF' … EOF` — or a single-line `-m`. NEVER a PowerShell here-string (`@'…'@`) in the Bash tool: it is invalid in sh and silently corrupts the message (the `@` leaks into the subject) rather than erroring, costing a commit+amend round-trip. For large or quote-heavy messages, write the message to a file with the Write tool and `git commit -F <file>`. (Observation 11, 2026-07-25.)
- Push to origin main.
- **A push to `main` auto-triggers a Coolify build + deploy** (`andro-prime/09_website-app/deployment/coolify/deploy.md`) of every non-flag-gated change — so a push IS a deploy. Never report "nothing deployed" after a push, and never assert "deployed/live" without confirming it (both were wrong in the 2026-07-25 session, misleading Keith).
- **Verify the deploy — only when this session changed a live-served surface** (a page under `app/`, a `lib/` module a page renders, or the served `canonical-site/terms|privacy` slices; skip for docs/STATE/ClickUp-only sessions):
  1. Pick a **two-sided canary**: a live URL plus BOTH a string this session ADDED and a string it REMOVED. New-string-present is necessary but not sufficient — the old build can already contain that string elsewhere (shared components, meta, feature lists), so "new present" alone gives false positives. **Old-string-absent is what proves the new build shipped.** Where a build stamp / version exists, prefer that. Prefer a code-driven `app/*.tsx` page — it only changes after a full `next build`, so it proves the build ran (a canonical-HTML-only change is a weaker signal). (Observation 16, 2026-07-25.)
  2. Coolify builds take a few minutes. Confirm the app is up (`WebFetch https://andro-prime.com/api/health` or `/`), then fetch the canary URL and check both conditions. **Match case-insensitively** (`grep -i`, or lowercase both sides): text rendered uppercase via a CSS `text-transform`/`uppercase` class still reads as the AUTHORED casing in the HTML source, so a case-sensitive match on the on-screen form silently misses and reports a false failure. Match the source string, not the visually-styled form. (Observation 19, 2026-07-25.)
  3. Report one of three states explicitly: **verified live** (new present AND old absent) / **build in progress** (old string still present, or new absent — give the exact re-verify command and offer to poll again before ending; poll on old-string-absent, which is the reliable signal) / **possibly failed** (still not flipped after several minutes → tell Keith to check the Coolify dashboard). Never leave deploy state unstated or guessed.
  4. **A deploy is not a flag flip. If the shipped change is gated behind a runtime env var, the canary above proves nothing** — it proves the code shipped, while the behaviour stays off because the running container never got the variable. Add a SECOND canary that exercises the gated behaviour itself (hit the route, read the rendered output, check the flag's observable effect), and report code-shipped and behaviour-live as two separate states. Coolify env changes need a container restart to take effect, so "I set the variable" is not "the variable is in the process". (Observation 29.)
  5. **Content served from the database is not covered by the deploy canary at all.** Blog article bodies live in `blog_articles.body`, not in the built bundle, so a copy fix is live or not live independently of any build. Verify those by fetching the served page and checking both sides (old string absent, new string present) after calling `/api/revalidate` with the slug. See `publish-article` for the full rule. (Observation 84.)
- If a customer-facing copy file is being committed, scan it for em dashes first (banned as an AI tell); flag any found rather than silently shipping. **Scope the scan to the customer-facing RENDER surface** (canonical HTML slices, `.tsx`/JSX copy strings) or to the DIFF of body copy — not whole source `.md` files, which interleave internal DRAFT/APPROVED banners, changelog HTML-comments, and pre-existing copy, so a whole-file count drowns real new violations in internal/pre-existing noise. (Observation 8, 2026-07-25.)
- **Two em-dash hooks exist, with different severity — do not model them as one** (both gitignored/local, `.claude/hooks/`): (a) a **non-blocking** PostToolUse warning that fires on internal docs and only reports a count (it never sweeps pre-existing content, so old em dashes persist until a manual sweep); (b) a **BLOCKING** guard, `em-dash-guard.js`, that refuses the write until the em dash is removed. When a save is blocked, fix the flagged line and re-save; do not assume "non-blocking" and move on. (Observations 14 + 15, 2026-07-25.)
- **The blocking guard is now DELTA-SCOPED, fixed 2026-07-31 (Observations 22, 28, 91 all closed by this change).** It reads only the text an edit introduces (`content` for Write, `new_string` for Edit, each `edits[].new_string` for MultiEdit) and **never reads the file on disk**. Pre-existing em dashes elsewhere in a file no longer fire it, so the "fires twenty times on text you did not touch" behaviour described below is history, not current behaviour. Line numbers now report as positions inside the text you just wrote (`[line N]`, or `[edit 2, line N]`), not as file line numbers.
- **Its `COPY_ROOTS` were narrowed in the same change.** Now `09_website-app/frontend/{content,app,components}/`, `06_marketing/content-machine/{assets,drafts}/`, `06_marketing/content/{email,linkedin}/` and `08_customer-journey/`, backed by an `INTERNAL_PATHS` deny-list (`/seo-ai-search/`, `/master-plan/`, `/article-briefs/`, `/sops/`, `/templates/`, `CONTEXT.md`, `STATE.md`, `README.md`, `*-playbook.md`). The blanket `06_marketing/` and `07_sales/` roots are gone. **Known gap left deliberately:** `07_sales/funnel/` offer copy and `06_marketing/affiliates/briefs/` are genuinely external-facing and are NOT guarded, because their directories are otherwise internal planning. Check those by hand.
- **What this means for a wrap.** If the guard fires now, it is flagging something in *your* edit and you should fix it, not dismiss it. The old advice to note-and-move-on no longer applies and should not be followed. Regression suite: `node .claude/hooks/test-em-dash-guard.js` (20 cases, covers block paths and fail-open silence).
- **Historical note, kept because it explains the fix.** Before 2026-07-31 the guard was whole-file: a single-line edit to a legacy dash-heavy doc blocked and reported every pre-existing em dash. During the CA-028 sweep on 2026-07-31 it fired about twenty times across seventeen files, up to 75 pre-existing hits in one file, none introduced by the edit. The correct response each time was to ignore it, which is what made it worth fixing: being trained to dismiss a blocking guard converts it into a no-op for the real case it was built to catch.
- If any file under `andro-prime/06_marketing/content-machine/assets/` is being committed, run the content gate scanner on those files first: `node .claude/skills/content-status/scan.js <file> [<file> ...]`. A 🔴 HARD hit (exit 2) blocks the commit until it is fixed; 🟠 REVIEW items are advisories and do not block.

## Report

End with a terse plain-English summary, no narration:
- workspaces updated (which STATE/CONTEXT files)
- ClickUp tasks closed/updated (names, not IDs)
- commit hash + files committed
- anything skipped or ambiguous that needs Keith's call
