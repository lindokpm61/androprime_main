# Cowork Prompt — Phase 0 Pre-Launch Tracker Setup

**Purpose:** Set up unified tracking for Phase 0 pre-launch sprint (V7-derived 12 items + existing outstanding/landing tasks) in ClickUp, with a Cowork-rendered status view.

**Created:** 2026-05-12
**Target launch date:** Expected 26 May 2026 (2-week sprint), planned cushion 2 June 2026 (3-week sprint).
**Source documents:**
- `D:\Androprime_main\andro-prime\01_strategy\phase0-v7-implications.md` (§11 has the 12 V7 items)
- `D:\Androprime_main\andro-prime\01_strategy\master-implementation-blueprint.md` (existing outstanding/landing tasks)
- `D:\Androprime_main\andro-prime\01_strategy\andro-prime-strategic-model-v7.md` (strategic context)

---

## PROMPT TO PASTE INTO COWORK

You are helping me set up a unified pre-launch tracking system for the Andro Prime Phase 0 launch sprint. The sprint runs from today (12 May 2026) to a target launch of 26 May 2026 (2-week expected) with a planning cushion to 2 June 2026 (3-week planned).

I need this done in three phases. Do them in order and confirm with me before proceeding from one phase to the next.

---

### PHASE A — DISCOVERY (read first, do not modify anything)

Read the following files in this order and summarise what you find at the end of this phase:

1. `D:\Androprime_main\andro-prime\01_strategy\phase0-v7-implications.md` — extract §11 "Workflow changes summary" which contains the 12 V7-derived pre-launch items. Each has a task name, owner (Keith / Ewa / dev), and deadline.

2. `D:\Androprime_main\andro-prime\01_strategy\master-implementation-blueprint.md` — find the existing outstanding and "in-flight to launch" tasks for Phase 0. There may be sections labelled "outstanding," "to do," "landing tasks," "pre-launch," or similar. List every task you find with its status, owner, and target date if available.

3. `D:\Androprime_main\andro-prime\01_strategy\CONTEXT.md` — read for project context and any task lists referenced.

4. Search the `D:\Androprime_main\andro-prime\` directory tree for any files matching patterns like `*todo*`, `*tasks*`, `*outstanding*`, `*landing*`, `*launch*`, `*sprint*`, `*checklist*`, `*action*`. List each match and briefly describe what it contains.

5. Check my existing ClickUp workspace for any Andro Prime project, space, list, or folder that already exists. If there is one, list every active task in it with owner, status, and due date. Do not modify anything in ClickUp during this phase — read only.

**Output at end of Phase A:**

Produce a single summary document with three sections:

- **Section A1: V7 items (12)** — listed from the implications doc §11
- **Section A2: Existing outstanding/landing tasks** — every task found in the file search and existing ClickUp, deduplicated
- **Section A3: Conflicts and overlaps** — flag any V7 item that duplicates an existing task, any existing task that contradicts a V7 item, and any task you're uncertain about

Pause here and ask me to confirm the merged task list before proceeding to Phase B.

---

### PHASE B — CLICKUP SETUP

Once I confirm the task list from Phase A, create the following structure in ClickUp:

**Space:** Andro Prime (use existing if present, create if not)
**Folder:** Phase 0 Pre-Launch Sprint
**List:** Sprint Tasks

**Custom fields to create on the list:**

- **Owner** (dropdown): Keith, Ewa, Dev, External
- **Source** (dropdown): V7 implications, Master blueprint, Existing ClickUp, Discovered
- **Workstream** (dropdown): Marketing, Operations, Architecture, Compliance, Workflow, Cash discipline
- **Severity** (dropdown): Critical, High, Medium, Low
- **Pre-launch required** (checkbox): Yes/No (default Yes for V7 items; review for existing items)
- **Blocker for** (relationship to other tasks): so dependencies are explicit
- **Effort estimate** (number, in days): 1, 2, 3, 5, 8 (Fibonacci-ish)

**Task creation rules:**

1. Each task gets a clear title (action verb + outcome, e.g. "Update brand voice copy to lead with patient-owned data framing")
2. Description includes:
   - Source reference (e.g. "V7 §11 row 1" or "Master blueprint §X.Y")
   - Specific definition of done
   - Any cross-references to other docs
3. Due date: based on source if available, otherwise default to:
   - Critical/High severity → within first 7 days of sprint (by 19 May)
   - Medium severity → within first 14 days (by 26 May)
   - Low severity → by planning cushion deadline (2 June)
4. Owner field populated from source documents
5. Tag any task whose deadline conflicts with the 2 June planning cushion as "AT RISK" and flag in the summary

**Order of operations:**

1. Create the space/folder/list structure
2. Create custom fields
3. Bulk-create all tasks from Phase A merged list
4. Set up dependencies (use the Blocker-for field for anything that has clear ordering)
5. Create a "Daily check" recurring task that fires every weekday morning with a checklist of "what shipped yesterday, what's blocking today, what's at risk"

**Output at end of Phase B:**

Produce a summary listing:
- Total tasks created
- Breakdown by workstream
- Breakdown by owner
- Breakdown by severity
- Any tasks flagged AT RISK
- The ClickUp URL for the list

Pause here and ask me to confirm before proceeding to Phase C.

---

### PHASE C — COWORK STATUS DASHBOARD

Build a Cowork-rendered status dashboard that pulls live data from the ClickUp list and displays:

**Top section: Launch countdown and headline metrics**

- Days until expected launch (26 May 2026) and planning cushion (2 June 2026)
- Total tasks: X complete / Y in progress / Z not started
- Critical and High severity remaining
- Tasks at risk count

**Middle section: Burndown view**

- Simple chart: total open tasks per day from sprint start to today
- Trend line vs ideal burndown (linear from sprint start to 2 June)
- Flag if actual is more than 2 days behind ideal

**Workstream breakdown**

- Grid view: Marketing / Operations / Architecture / Compliance / Workflow / Cash discipline
- Each cell shows: open count, in-progress count, complete count
- Click-through to filtered ClickUp view for that workstream

**Owner breakdown**

- Keith's tasks: list with status
- Ewa's tasks: list with status
- Dev tasks: list with status
- External tasks (if any): list with status

**At-risk panel**

- Tasks flagged AT RISK with reason (deadline conflict, blocked, no owner, etc.)
- Tasks not updated in 48+ hours
- Tasks where dependency is incomplete and own due date is within 3 days

**Daily check log**

- Most recent daily check entry (what shipped yesterday, what's blocking today, what's at risk)
- Link to add today's entry

**Refresh:** Dashboard should refresh on load and provide a manual refresh button. If ClickUp data is more than 1 hour stale on load, show a "stale data" indicator.

**Output at end of Phase C:**

- The dashboard URL or local file path
- Brief instructions on how I trigger a refresh
- Confirmation that the daily check task is recurring correctly

---

### OVERALL CONSTRAINTS

- **Do not modify any source files** (`phase0-v7-implications.md`, `master-implementation-blueprint.md`, `CONTEXT.md`, etc.) during this work. Read-only.
- **Do not delete or archive existing ClickUp tasks** without my explicit confirmation. If a discovered task is genuinely superseded by a V7 item, flag it in Phase A but don't action.
- **Do not invent tasks.** Every task in ClickUp must trace back to either V7 §11 implications doc, the master blueprint, or an existing ClickUp item. No "I thought you might also need" additions.
- **Ask me to confirm at each phase boundary.** Don't proceed Phase A → B → C without explicit go.
- **If you can't access something** (ClickUp auth issue, file permission, etc.), stop and tell me exactly what's blocking. Don't work around it silently.

---

### DEFINITION OF DONE FOR THIS WHOLE SETUP

- All 12 V7 items present in ClickUp with proper metadata
- All existing outstanding/landing tasks merged in, deduplicated
- Dependencies set where they exist
- Daily check recurring task active
- Cowork dashboard renders and refreshes
- I can open the dashboard at any point in the next 3 weeks and see at a glance: what's done, what's blocked, what's at risk, what I personally need to action today

---

### OUT OF SCOPE FOR THIS SETUP

- Actually doing any of the 12 tasks (this is the tracker, not the work)
- Editing V7 or any strategy document
- Setting up any tooling beyond ClickUp and the Cowork dashboard
- Sending notifications, alerts, Slack integration, etc. (can add later if useful)
- Any work that requires Ewa's input — those tasks just get created in ClickUp, the conversation with Ewa is mine to have

---

End of prompt. If anything is unclear, ask me before starting Phase A.

---

## Notes for Keith (not part of the Cowork prompt)

**Why I structured it in three phases:**

1. Phase A is read-only discovery. If Cowork mis-identifies the existing tasks, you catch it before anything gets created in ClickUp. The merge between V7 items and existing tasks is the highest-risk step — get it wrong and you have either duplicates or missing work.

2. Phase B is the structural setup with checkpoint confirmation. The custom fields, ownership, severity, and "at risk" flagging matter — they're what make the dashboard useful in Phase C. If the structure is wrong, fix it before populating.

3. Phase C is the visible layer. Once A and B are right, C is mostly cosmetic. If something doesn't render the way you want, the underlying data is still correct.

**What you might want to tweak before running this:**

- The default dates (Critical/High by 19 May, Medium by 26 May, Low by 2 June) are my assumption. If you want different defaults, edit the rules in Phase B.
- The custom field options (workstreams, severity levels) match V7 §11. If your existing tasks have different categorisation, you might want to add fields rather than force-fit.
- The daily check task firing every weekday morning assumes you actually do daily checks. If you'd rather every 2-3 days, change it.

**One thing I'd resist tweaking:**

The "do not invent tasks" rule. The temptation will be to think "oh, while we're here, let's also add X and Y." That's how a 12-item sprint becomes a 25-item sprint and the 3-week buffer evaporates. The tracker tracks what V7 said matters. If V7 missed something, that's a V7 conversation, not a Cowork conversation.

**After Phase 0 launches:**

The ClickUp structure can be reused. Phase 1 (M13 TRT launch) has its own pre-launch sprint approximately 6 months from now. The same custom fields, severity model, and dashboard pattern work for that. Don't delete this list at launch — archive it. The pattern is reusable.
