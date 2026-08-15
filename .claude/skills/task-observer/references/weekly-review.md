# Comprehensive Review (scheduled or fallback)

Cross-checks all OPEN observations against all skills, propagates
cross-cutting principles, and applies improvements that don't need user
input. Two modes:

- **Scheduled autonomous review (preferred):** a recurring task (e.g.
  Mon/Wed/Fri mornings) via the platform's scheduler. Runs without the user
  present and applies non-escalated observations autonomously.
- **In-session 7-day fallback:** pending at session start when BOTH are
  true: no scheduled review is registered (or none succeeded in 7+ days),
  AND `skill-observations/last-review-date.txt` contains `never` or a date
  more than 7 days old (a missing file is recreated with `never` — see
  Session Start steps 1 and 3; the file's value is authoritative, a date
  means a review actually ran). In an interactive session a pending
  fallback surfaces as a one-line offer and runs only if the user opts in
  (SKILL.md, Session Start step 3) — it never gates the user's task.

**Reachability — where does scheduled work actually run?** Scheduled mode
requires the scheduling agent's execution environment to read and write
the workspace folder. Persistence and execution context are independent
axes: knowing where the state lives is not enough — check whether the
scheduler runs somewhere that can reach it. Three regimes:

1. **Shared filesystem** (e.g. Cowork's mounted folder): scheduled mode
   works as described.
2. **Local-only filesystem with a cloud scheduler** (e.g. remote routines
   that run on hosted infrastructure): scheduled mode is physically broken
   — the remote agent cannot read `skill-observations/` or stage updates
   to `skill-updates/`. Do not register a routine. Recommend a recurring
   calendar reminder plus a manual "run the skill review" trigger in a
   local session, or syncing the observation log to storage the scheduler
   can reach (e.g. a git repository it can clone).
3. **Local-only filesystem with a local scheduler** (cron, Task Scheduler,
   a terminal-resident loop): works, but the user must keep the local
   agent runnable.

## Approval policy

**Interactive (user present):** always present observations grouped by
skill (number, title, one-sentence summary), flag judgment calls as "needs
your input", and wait for blanket or selective approval before applying.

**Scheduled autonomous (user absent):** apply non-escalated observations by
default — safety comes from the staging-plus-review pattern (nothing is
live until the user installs it). **Escalate without applying** when: (1)
the observation proposes a NEW skill (naming/scope/type/licence need the
user); (2) it removes or substantially restructures existing content; (3)
it self-flags uncertainty ("not sure if…", "worth discussing…"); (4) two
observations conflict. A scheduled run should still apply every
non-escalated item — a review that applies nothing is just a report
generator.

## Steps

**Step 0 — recommend scheduled setup (fallback mode only).** Ordering
guard: run Step 1's no-observations short-circuit FIRST — if there are no
OPEN observations and no outstanding principles, skip Step 0 entirely and
just update the timestamp. A brand-new install must never get a setup
prompt before it has done any work. Otherwise: check
`skill-observations/scheduled-review-decline.txt`: if under 30 days old and
the fallback isn't firing repeatedly, skip. Check for a registered
scheduled task (scheduler presence or
`skill-observations/scheduler-registered.txt`); if found, skip. Before
offering, check reachability (see the regimes above): if the platform's
scheduler runs where it cannot reach the workspace folder (regime 2), do
NOT offer registration — recommend the calendar-reminder-plus-manual-
trigger pattern instead, and skip the rest of this step. Otherwise
offer to set one up. Yes → register via the platform scheduler (Cowork:
`create-shortcut` / `set_scheduled_task`; terminal: cron), name it
`weekly-skill-review`, use the draft prompt at
`skill-observations/scheduled-task-draft.md` if present, then verify the
registration actually succeeded (the scheduler lists the task, or the
platform confirmed creation) BEFORE writing today's date to
`scheduler-registered.txt`. If registration fails or can't be verified, do
NOT write the marker — the marker would permanently suppress the fallback
while no review ever runs. Tell the user registration failed and leave the
fallback active. No → write today's date to
`scheduled-review-decline.txt` (suppresses for 30 days; repeated fallback
firings within the window re-surface the offer). No scheduler available in
this environment → skip silently.

**Step 1 — load.** Archive entries resolved in *previous* sessions (see
Archival on Write in SKILL.md). Read the observation log.

**Settle the delivery mode here, in Step 1, not at Step 8.** The Delivering
section below says to ask once in a new environment and record the answer next to
`last-review-date.txt`. That instruction is read at Step 8 while the answer it
records governs how Steps 5 and 8 are carried out, and nothing in the numbered
Steps creates the file — so the record is the part that gets skipped and the
question returns. Two reviews ran in this installation before the marker existed.
**Derive it before asking:** if the skills directory is tracked by version
control (`git ls-files .claude/skills` returns anything), the mode is `git`;
write `skill-delivery-mode.txt` and tell the user rather than asking them.
Reserve the question for the genuinely ambiguous case. (Observation 252.)

Build the work queue from the structural identifiers, not from a status
filter. The OPEN set is defined as: **status is literally OPEN, OR the
observation has no Status line at all.** Concretely:

1. Enumerate all `### Observation N:` headers first — this is the
   authoritative list of entries in the log.
2. For each header, classify the entry's status by looking for a
   `**Status:**` line within its body. Treat a missing, blank, or any
   non-ACTIONED / non-DECLINED status as OPEN.
3. Never derive the work queue from a `grep '**Status:** OPEN'` alone.
   Derive it from the header list minus the resolved (ACTIONED /
   DECLINED) entries. A grep on an optional field silently drops every
   entry missing that field — the review then confidently reports a
   clean log while a backlog of untriaged observations is skipped.

**Reconciliation guard:** before proceeding, assert that
`count(### Observation headers) == count(status-classified entries)`.
If the counts differ, the delta is statusless entries — surface and
triage them (as OPEN) rather than proceeding as if the log were clean.

**If this installation mirrors the log to an external tracker, reconcile the two
BEFORE building the queue.** A review reads the log alone, so it inherits any
drift silently and then acts on a work queue that the surface the user actually
reads does not agree with. Worse, marking an entry resolved in the log while its
tracker item does not exist leaves the log asserting a resolution the tracker can
never show. Whatever the mirror convention is, it needs a diff, not a promise:
entries in one store and not the other, duplicates, and status mismatches. See
the installation's configuration block in SKILL.md for the concrete command.

Also read all active cross-cutting principles. If there are no OPEN
observations and no outstanding principles: report "no open observations
or outstanding principles", update the timestamp, and stop.

**Step 2 — inventory skills.** List all skills (system prompt
`<available_skills>` or the skills directory). Only user-owned custom
skills can be updated. Known read-only system skills: docx, pdf, xlsx,
pptx, skill-creator, schedule (grow this list when an update fails for
permissions). Observations targeting a system skill are NOT skipped — route
them to a complementary user-owned `{system-skill}-extras` skill containing
only the delta, creating it if needed and noting the pairing in
configuration.

**Step 2b — cluster before prioritising.** An append-only log of encounters is
the right shape for capture and the wrong shape for prioritisation. A recurring
defect generates one observation per encounter — correct at logging time, since
each carries new evidence — but nothing downstream merges them, so the backlog
reports N problems where there is one fix. That distorts prioritisation in *both*
directions: the true cost is spread thin across several low-looking items, while
the count overstates how much distinct work exists. **The thing that keeps
happening is systematically underweighted precisely because it keeps happening.**

Before evaluating anything, group the OPEN set **by the artefact each observation
names** — the file, hook, script, or skill section, not the title:

1. Any group of two or more is **one item whose weight is the group**, not
   several small ones. Prioritise on the group.
2. When you close one member, **close the whole cluster in the same pass**,
   record the fix once, and cross-link the rest to it.
3. Report the cluster count alongside the raw count ("41 OPEN entries, 26
   distinct items"), so the backlog number stops overstating the work.

A cross-reference in an entry's prose is NOT clustering: three entries on one
hook sat OPEN through multiple reviews, were triaged independently each time, and
all closed on a single edit — even though one of them said in its own body that
it was "the third recorded instance". Prose links are evidence that the link
exists, not a mechanism that acts on it. (Observation 99.)

**Step 3 — cross-check observations.** Evaluate every OPEN observation
against every skill — not just the skill named in its header; Principles
often generalise. Build skill → [relevant observations]. Interactive:
present all of it and await approval. Autonomous: apply the approval policy
above and continue.

**Re-test each entry's central claim against the current tree before actioning
it** (SKILL.md, Acting on Observations). Budget for this: in the 2026-08-15
review, **six of the OPEN entries were already fully implemented** — 34, 77,
132, 159, 195 and 200 — because each was fixed during ordinary work and only
this Step 6 ever writes a resolution status. Two of them cited their own
observation number in the SKILL.md text. So the cheapest first pass is
mechanical: for each OPEN entry, grep its target skill file for that entry's own
observation number, and treat a hit as "probably already done, verify and mark".
Four of the six would have fallen out of that grep alone, and it belongs in
`reconcile-observations.js` as a third check, since the log-versus-board diff is
structurally blind to a fact that is stale in both stores. (Observations 160,
253.)

**Step 4 — cross-check principles.** Flag every skill that doesn't yet
comply with each active cross-cutting principle.

**Step 5 — apply.** For each skill with approved/non-escalated items,
produce an updated SKILL.md: integrate insights into the sections where
they belong (never append an observations list at the bottom); preserve
structure, voice, and attribution; place new rules where they logically
live. Follow the editing rules in `references/skill-authoring.md` (live
file as base, staging, diff-before-overwrite).

**Step 6 — mark ACTIONED.** Update each applied observation's status:
`ACTIONED (YYYY-MM-DD) — Applied to [skill-name] (weekly review)`. The
date immediately after the status word is load-bearing: archival is gated
on it (entries archive only when it's before today), so a dateless mark
breaks the cross-session grace period. Do NOT archive same-session — the
next log write on a later day archives them.

**Step 7 — timestamp.** Write today's date to
`skill-observations/last-review-date.txt`.

**Step 8 — deliver and summarise.** Stage updated skills (see Delivery
below), then present:

```
## Weekly Skill Review Complete — [date]

Updated skills ([N] observations, [N] principles applied):

**[skill-name]** — [1-sentence change summary]; observations #[N], #[N]

### Observations Actioned
[numbers and titles]

### Skipped (needs manual review)
[items with reasons]
```

Wait for the user to acknowledge before other work.

## Constraints

- Don't modify observation entries beyond their status field.
- Don't create new skills in a review — note candidates for the user to
  action via the skill-creator.
- Unsure how to integrate an observation → skip it and say so in the
  summary.
- Treat internal observations with the same rigour as open-source.

## Delivering updated skills

**The requirement is a property, not a mechanism: no skill change reaches the
user unreviewed, and every change is revertible.** Two mechanisms satisfy it, and
which one applies depends on how the skills are stored. State the rule as the
property, because a rule stated as its mechanism becomes unfalsifiable — an
environment that already provides the property *more strongly* still reads as
non-compliant, and the agent's only options are pointless friction or
unsanctioned deviation. (Observation 94.)

- **Skills are version-controlled** (e.g. a git-tracked `.claude/skills/`):
  satisfy it with a reviewable commit — one commit per skill or per coherent
  group, never mixed with unrelated work — and say so in the summary. A commit
  diff is reviewable per hunk, revertible, attributable and permanent; a staged
  copy is none of those, and staging thirteen directories for a manual install
  each would have the user reviewing copies instead of diffs.
- **Skills are not version-controlled:** stage to `skill-updates/` as below.

**Ask once, at the first review in a new environment, and record the answer**
next to `last-review-date.txt` (e.g. `skill-delivery-mode.txt` containing
`git` or `staged`), so it is not re-litigated every week.

### Staged delivery (the non-version-controlled mechanism)

Save each updated skill to
`[workspace folder]/skill-updates/[date]/[skill-name]/` — the FULL skill
directory (SKILL.md plus references/, scripts/, assets/ where present),
never SKILL.md alone — and present it for review and installation. In
Cowork: via `present_files` and its upload button. In environments without
a presentation tool (e.g. Claude Code CLI): report the staged path and a
change summary in chat and let the user review and install from there.
Under this mechanism, never write to the live skill directly even where the
skills directory is writable — with no version control there is nothing else
holding the property. For any skill with
supporting files, zip the staged directory into a `.skill` bundle and
present the bundle; a bare SKILL.md install silently truncates a
multi-file skill. Pre-delivery gate (two items, run as the last step
before presenting): (1) grep the staged SKILL.md body for `references/`,
`scripts/`, `assets/` paths and fail the delivery if any referenced file
is missing from the staged set; (2) for multi-file skills, fail the
delivery if the artefact being presented is bare file links rather than
the `.skill` bundle. Sweep build artefacts (`__pycache__/`, `*.pyc`,
`.DS_Store`, `.~lock.*`) before zipping and read the archive listing back
after. When seeding staged
copies from the read-only mount, `chmod -R u+w` the staged path first —
the mount's read-only mode travels with the copy, for directories as
well as files. Do not edit skill files in place — nothing goes live
until the user installs it. **Keep-two rule:** for any skill, keep only
the two most recent date directories under `skill-updates/`; delete
older ones.

### Version-controlled delivery (the commit mechanism)

Edit the live skill files, then commit. The property is held by the commit, so
the obligations move onto it:

- **One commit per skill, or per coherent group of skills**, never mixed with
  unrelated work — a diff the user cannot read in isolation is not a review.
- **Base every edit on a fresh read of the live file**, exactly as under staging
  (`references/skill-authoring.md`). Version control removes the need for a
  staged copy; it does not remove the need to avoid a stale base.
- **Say in the summary what was committed and how to revert it**, so review is
  possible after the fact rather than only before.
- **Do not push a review's commits to a shared branch without the user's
  acknowledgement** unless they have already said to. Committing is the review
  surface; publishing is a separate act.
- The same pre-delivery completeness check still applies: every `references/`,
  `scripts/`, `assets/` path named in the SKILL.md body must exist in the commit.
