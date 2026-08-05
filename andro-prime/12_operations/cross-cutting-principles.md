# Cross-Cutting Principles

Principles that apply across skills, not just the one whose observation surfaced
them. When a skill is edited or authored, check it against every active
principle here. Each principle names the observations it was distilled from.

Created 2026-07-25 (first weekly review).

**This file is the canonical copy. Moved into the repo 2026-08-06** from
`~/.claude/projects/d--Androprime-main/skill-observations/`, which is outside
version control. The `task-observer` methodology calls this a mandatory checklist
during any skill creation or regeneration, and on 2026-08-06 it went from three
principles to ten in a single pass — ten load-bearing rules depending on one
machine, with no history and no backup, while every other load-bearing artefact
in this system is in git. A stub remains at the old path pointing here.

**The observation LOG stays outside the repo, deliberately.** The two files have
different half-lives: the log is append-only session state, hundreds of KB and
churning several times a session, while this is a curated document that changes a
handful of times a month and governs how skills are written. Only the second
belongs in version control.

**When you add a principle here, you are editing a checklist that gates skill
authoring.** Distil it from the observations, name them, and say which skills it
applies to — a principle with no "applies to" line is a sentiment, not a control.

---

## P1 — Verify a system state before you claim it

**Statement:** Never report a verifiable downstream or system state — deployed /
live / built, committed / tracked / ignored, a file's contents, a service's
status — from a mental model or assumption. Run the one cheap command that
settles it first. Asserting-then-being-corrected costs more than the check, and
it spends user trust: the user has to catch the error and you re-verify anyway.

**Concrete checks:** deploy/live → `WebFetch` the changed live URL (two-sided:
new content present AND old content gone); build ran → a build stamp or a
code-driven page's new string; VCS state → `git check-ignore`, `git ls-files`,
`git status`; producer/consumer disagreement (e.g. an MCP serving stale data) →
confirm the consumer reads the same path/object the producer writes **before**
theorising about the producer's internals (compare configured paths + mtimes).

**Applies to:** wrap (Stage 3 deploy verification already encodes the concrete
form), decision-sweep (re-grep to confirm zero residual hits), graphify / any
MCP-diagnostics, and any close-out or status report in any skill.

**Distilled from:** Observations 6, 12, 16, 19 (deploy/VCS state asserted
without verifying) and Observation 3 (MCP stale-data — producer vs consumer path
checked last instead of first).

---

## P2 — Visual work is only verified when its pixels have been seen

**Statement:** A passing type-check, an HTTP 200, a grep for a marker, or a
subagent's "looks good" is necessary but never sufficient for anything that
renders. Stripped HTML loses hierarchy, contrast, and duplication; a text report
is not visual evidence. Before declaring rendered UI done, capture a real
screenshot (headless Chrome) and actually view it — dismissing overlays and
framing the element under test first, or the screenshot verifies nothing.

**Applies to:** page-cro (encodes the concrete gate), run, any design-review
step, and any skill that delegates UI work to a subagent (the orchestrator
screenshots and inspects rather than trusting the agent's summary).

**Distilled from:** Observations 5 and 18.

---

## P3 — Co-locate a doc edit with the code edit it describes

**Statement:** A doc that describes code (a CONTEXT route table, a STATE status
line, a config-value reference) should change in the SAME change as the code,
not in a later sweep. Co-locating the edit is the cheapest defence against
CONTEXT-vs-live drift. A session-end sweep (wrap Stage 1) is the safety net, not
the intended point of capture.

**Applies to:** any code-editing flow, wrap (Stage 1 is the backstop),
decision-sweep (the propagation case of the same principle).

**Distilled from:** Observation 4. (The behavioural preference itself is in
memory: `feedback_doc_sync_with_code`.)

---

## P4 — A reported cause is a hypothesis, not a scope

**Statement:** When someone hands you both a symptom and an explanation ("the
monitor is down, so the output stopped"), the explanation is the FIRST thing to
test, not the frame to work inside. Accepting it silently narrows the work to
whatever it implies, and the actual problem goes unaddressed under the appearance
of a completed fix. Verify the causal link explicitly, and say plainly when it
does not hold.

**Concrete check:** after root-causing any monitoring or pipeline failure, ask
**"would the restored check have caught the reported symptom?"** If no, the
restoration is necessary but not sufficient, and the remaining gap is separate
work that must be named rather than absorbed into the original fix. Observed:
both halves of a user's story were true and unrelated — the monitor had been down
four days, and it could never have detected the missing output, because every
check it ran was a consistency check and the missing output was a perfectly
consistent state. Three gaps existed where one was reported: the job did not run,
nothing noticed it was not running, and nothing checked the thing the user cared
about.

**Applies to:** any incident response or debugging flow, wrap (deploy and
cadence verification), content-doctor and any invariant/monitoring work,
task-observer's surfacing protocol (report the gap you found, not only the gap
you were sent for).

**Distilled from:** Observation 153. Related: Observation 149 (consistency
invariants passing over an empty calendar, because coverage was never an
invariant) — the same blind spot in a different form.

---

## P5 — Confirm an external write by reading the resource, never by reading the write

**Statement:** A write's own response is not evidence that it landed, and your
own record of an external thing is not evidence of its state. Both are beliefs
about a system you do not control. Check the transport envelope first, then
re-read the resource and assert the new state.

**Concrete checks:**
- **Check the envelope before the contents.** Capture the status code (`curl -w
  '%{http_code}'`) and treat anything outside 2xx as failure *before* looking at
  the body. Never pipe a write's response into a single-field extractor: applied
  to an error object it returns nothing, and nothing is indistinguishable from a
  benign empty value. A read-only token produced `403 You do not have permission`
  which printed as `None` and would have been reported as "issue resolved".
- **Re-read before mutating anything you created earlier.** An artefact placed in
  a surface the user also operates is shared mutable state; between two turns
  they may have sent, edited, closed or deleted it. An ID returned by a create
  call is a snapshot, not a lease. On a mutation failure, check whether it was
  *acted on* rather than assuming a transient tool fault, and report the state it
  is actually in — a draft that was already sent without the paragraph you were
  about to add is a materially different situation from "retry the update".
- **Persist the stable identifier, not the prominent one.** Establish whether an
  external id survives an edit by making one and comparing. A value that changes
  on edit is a cache, not a key; store the stable handle alongside it and
  re-resolve the volatile one.
- **Every tracked external surface needs a read-back path recorded next to the
  claim** — what to call, and what it returns — and that read-back must sit
  inside a routine that already runs. A status file written only by the process
  that reads it is internally consistent and externally unfalsifiable. One
  recorded a publishing channel as not yet created while it had been live for
  weeks with four published pieces, found in thirty seconds via a free
  unauthenticated endpoint nobody had ever called. **Date any claim that
  something does not exist**, because that class of claim decays invisibly and
  suppresses the very curiosity that would correct it.

**Applies to:** wrap (deploy and cadence verification), publish-article,
cio-sequence-build, content-status, and any skill that writes to or tracks a
third-party service.

**Distilled from:** Observations 145, 136, 102, 57.

---

## P6 — For an undocumented API the endpoint is the spec, and availability is not identity

**Statement:** Third-party write-ups, MCP READMEs and blog posts about a
reverse-engineered API are frequently stale or generic, and the vendor may differ
from every default they assume. Discover empirically against the live service.
Separately, two working routes to one service are not interchangeable until you
have confirmed they act as the same principal.

**Concrete checks:**
- **Credential names come from the live browser, not the doc.** Substack's session
  cookie is `substack.sid`, not the `connect.sid` every write-up names. Describe a
  credential by its observable properties too (HttpOnly, Secure, the `s%3A`
  signed-session prefix) so it is recognisable when the name differs, and accept
  both likely names where cheap so a mismatch fails soft.
- **Field requiredness comes from the 400.** Probe the create call with a minimal
  payload to discover what is hard-required. To find an id you need, read a
  related GET that already contains it (list endpoints, or an existing object of
  the same type) rather than assuming a `/me` or `/settings` shape, and
  auto-resolve it at runtime instead of making the user hunt for it.
- **Ask every route who it is authenticated as** (`about`, `me`, `whoami`) and
  compare, before choosing. A connector and a CLI to the same service pointed at
  different Google accounts, each holding a folder of the same name. Building on
  the wrong one succeeds, creates the artefact, matches the naming convention,
  and is discovered only when a human goes looking for the contents. Record the
  principal next to the route in the owning CONTEXT.
- Give any script taking a path or URL a `--dry` that echoes the resolved value,
  so a bad assumption surfaces before the live call.

**Applies to:** substack-draft and any content-machine integration, any workflow
choosing between an MCP connector and a local CLI, any new external integration.

**Distilled from:** Observations 36, 37, 106.

---

## P7 — A claim inherits the scope of the method that produced it

**Statement:** State what you actually checked, not the conclusion it suggests.
"I did not find it here" and "it does not exist" are different claims, and being
accidentally right about the second does not retroactively justify making it.

**Concrete checks:**
- **Scope every negative to the search.** Before declaring a resource absent,
  enumerate the plausible locations rather than the first documented one. The
  failure is asymmetric: a wrong positive surfaces as an error and self-corrects,
  a wrong negative silently stops work and pushes the user into doing it by hand
   — and it lands worst when the user is the person who knows the thing exists.
  Mark a conclusion provisional if the search was interrupted.
- **"Conforms" is earned by a complete check.** A pattern-grep may only ever be
  reported as "passes the mechanical checks", never as "conforms" — the rulebook
  contains what a grep cannot see (padding minimums, typography, stroke widths,
  component technique). And **if you resolved a gap by amending the standard, say
  so out loud**, separately from what already met it. A goalpost-move folded into
  a clean conformance claim is the standard bending to the artefact.
- **Test a prerequisite against the tooling already wired** before writing it
  down: a dry run, a help output, a schema read. A prerequisite derived from an
  unstated architectural assumption is confident, specific and purchasable, and
  its specificity is what makes it convincing. One unstated deployment choice
  produced two phantom blockers, both of which would have been procured. Where a
  requirement genuinely depends on a choice, state the choice and tabulate the
  alternatives.

**Applies to:** compliance-preflight (already encodes the concrete form in step
2c and the correspondence-layer rule), decision-sweep, any audit or plan, and any
skill that gates on a resource being present.

**Distilled from:** Observations 54, 24, 104. Closely related to P1.

---

## P8 — A concrete value inside a document is configuration, whether or not it was written as such

**Statement:** Reference docs get reviewed for their rules and reasoning, not for
the accuracy of values mentioned in passing — but a generator reads them
wholesale, so a domain, price, handle, path or id sitting in explanatory prose is
promoted to a value that reaches output. Resolve values against their owning
source of truth, never against the document that happened to mention them.

**Concrete checks:**
- Before emitting copy containing a concrete value, resolve every domain, URL,
  price and handle against its owner (site config for a domain, the pricing
  module for a price). Where a codebase can be counted, prefer the value with
  overwhelming support: one wrong domain appeared twice in a governing playbook
  against 147 correct occurrences, so any counting check would have caught it
  instantly, and nothing counted.
- **When a generated artefact reveals a reference doc was wrong, fix the doc in
  the same change**, or the next generation repeats it.
- **A skill may document how to obtain an identifier; it must not enshrine the
  identifier.** Record concrete values as clearly-marked examples with the
  resolution call beside them, and **never label an environment fact "stable, do
  not re-resolve"** — that converts a value a reader would naturally double-check
  into one they are instructed to trust. Paths must be repo-relative and
  known-present, or described by what to look for.

**Applies to:** all content-generation skills (article, script, hook,
content-week), skill authoring generally, and any skill documenting an external
integration.

**Distilled from:** Observations 59, 58.

---

## P9 — Completeness is verified against a stated inventory, never against apparent finish

**Statement:** Truncated input and partial rewrites both produce artefacts that
read as complete. Coherence is not evidence of completeness, so completeness has
to be checked against something external to the text: what the sender said they
sent, or what the file contained before you replaced it.

**Concrete checks:**
- **A stated quantity is a checksum, and often the only one available.** When a
  message announces a count of pasted or attached items, verify the delivered
  count before doing anything else, and check the last item terminates rather
  than stopping mid-sentence. Three documents were announced, one arrived whole,
  one was cut mid-sentence and one never appeared — and the missing one held the
  framework that filled the largest gap identified that session. Prefer file
  attachments over inline pastes for bulk material: a file either reads or errors.
- **A partial read plus a full rewrite is a deletion of everything not read**, and
  it is invisible in review: the new file is coherent, its tests pass, and a
  wholesale diff is too large to read as a diff. Treat "replace this file" as
  requiring a complete read first. If the file is too large to read fully, that
  is the signal to edit sections instead of rewriting. When a rewrite is genuinely
  warranted, diff the inventories explicitly (functions, exported names, tables,
  headings) and state what was dropped. **Accumulated domain knowledge is the
  first casualty, because it is the part a competent rewrite will not think to
  invent.**

**Applies to:** any file-replacing edit, artifact updates, customer-research and
any skill ingesting user-supplied source material.

**Distilled from:** Observations 49, 103.

---

## P10 — Identity checks need equality, not resemblance

**Statement:** A guard that identifies something by pattern-matching its own name
will admit anything whose name contains it, and naming conventions guarantee that
the closest relatives are exactly those things. The blast radius is set by what
the guard protects, so for a privileged write the check deserves the same scrutiny
as the write.

**Concrete check:** an entry-point guard must compare the resolved BASENAME
exactly, or use the runtime's own identity primitive — never a substring or
suffix test on a path. `/signoff-sync\.ts$/.test(process.argv[1])` is satisfied by
`test-signoff-sync.ts`, so running the test suite executed the script against the
PRODUCTION database and wrote four irreversible clinical sign-off records. It was
not caught by review; it was caught by the writes appearing in test output, and it
was a near miss only because the values happened to be the ones about to be
written deliberately. Extract the predicate into an exported pure function so the
collision case is assertable — a guard evaluated at import time cannot otherwise
be tested by the file it wrongly admits — and where the side effect is
irreversible, put that test first in the file.

**Applies to:** any generated script with an importable core and a side-effecting
`main()`; every content-engine script under `frontend/scripts/`.

**Distilled from:** Observation 146.
