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

**Four refinements, each from a check that passed while the artefact was wrong:**

- **Match the inspection resolution to the smallest feature the check must
  resolve, and name that feature before choosing the view.** Ten covers were
  cleared on a contact sheet at ~37% linear; a stray full stop in one masthead is
  a few pixels at full size and vanishes entirely there, so the defect class under
  review was invisible in the artefact used to review it. Worse, the one item
  zoomed was chosen because it looked suspicious *on the sheet*, so the sample was
  drawn by the signal that could not resolve the defect. Report the split
  honestly: "layout checked on a sheet, type checked at full size" is auditable;
  "all ten verified" is not.
- **Verify in the WHOLE document, not in an extracted fragment.** A new section
  was verified by extracting it into a standalone file with the page's own CSS and
  screenshotting that. It rendered perfectly and it was also 8,686px down a
  13,225px page with no navigation, so the user reasonably concluded it was
  absent. Every check passed: the content was present, correct, and effectively
  invisible. Locate the element in the rendered page and report its position as a
  fraction of document height; below roughly half is a finding, not a detail.
  **Present is not the same as findable**, and a verification that isolates the
  artefact from its context cannot tell the difference.
- **When a rendering check reports a defect, run the same check against a
  known-good control before believing it.** `chrome --headless=new
  --window-size=430,1600 --screenshot` lays the page out wider and crops the
  image, so every capture showed text clipped at the right edge — an unambiguous
  broken-responsive-layout signature on a page that was correct. Drive
  `Emulation.setDeviceMetricsOverride` over CDP instead (Node 24 exposes a global
  `WebSocket`, so no npm dependency), and assert
  `document.documentElement.scrollWidth === window.innerWidth` in the same pass,
  which converts "looks clipped" into a measured yes/no. **A measurement
  instrument can manufacture the very defect it is meant to detect, and a
  fabricated defect is more expensive than a missed one, because it directs
  effort at working code.**
- **Displayed output is a rendering, not the artefact — vary the viewer before
  blaming the producer.** A log read as mojibake under a default-encoding read
  command; the producer was changed to force an encoding, with a comment asserting
  the corruption. Re-reading with an explicit encoding showed the file had been
  correct all along. Shipping a change whose comment states an unverified cause is
  the worse half: it survives as a confident, wrong explanation that the next
  reader believes, because comments explaining a workaround are rarely re-tested.
  When the cause turns out wrong, **revert the change** rather than keeping it
  with a corrected comment.

**Applies to:** page-cro (encodes the concrete gate), run, compliance-preflight
(the render obligation), wrap, any design-review step, and any skill that
delegates UI work to a subagent (the orchestrator screenshots and inspects rather
than trusting the agent's summary).

**Distilled from:** Observations 5, 18, 213, 205, 206, 112.

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

- **Verify on the surface the audience sees.** A mitigation confirmed in the API
  response and again in staging was still absent from the live page, because
  inner layers accept and discard changes silently. The rendered artefact is the
  claim; everything before it is a step in a pipeline.
- **A probe must assert it exercised the case.** A check that returns green
  without having examined anything is the worst possible result, and a throwaway
  probe reading the wrong response key produces exactly that: a confident zero.
  Make the probe report what it looked at, not only what it concluded, and treat
  **zero as the most dangerous result** — verify the response shape before
  believing the count.
- **A generated dashboard or report that hardcodes live state will lie silently**
  from the moment it is generated. Either it reads its numbers at render time or
  it carries the timestamp of the data it froze, prominently enough to survive a
  skim.

**Applies to:** wrap (deploy and cadence verification), publish-article,
cio-sequence-build, content-status, and any skill that writes to or tracks a
third-party service.

**Distilled from:** Observations 145, 136, 102, 57, 155, 115, 154, 55.

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

**Smoke-test a new connector before trusting a number it returns.** Three traps,
all of which return plausible data rather than an error:

- **Vendor benchmark defaults masquerade as account data.** A dashboard figure
  that looks like yours may be the vendor's sample or industry baseline. Confirm
  at least one number against a value you can independently verify.
- **A zero means either "not yet populated" or "never will be"**, and the two
  need opposite responses. Establish which before reporting it as a result.
- **Reconcile accounts on handles or IDs, never on display names.** Display names
  collide, change, and are set by whoever created the account.

**Applies to:** substack-draft and any content-machine integration, any workflow
choosing between an MCP connector and a local CLI, Metricool / Customer.io /
Sentry connector work, any new external integration.

**Distilled from:** Observations 36, 37, 106, 60, 61, 63.

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

---

## P11 — Inventory the enforcement that exists, and prove a control can be satisfied

**Statement:** Before adding a control, find out what already enforces the thing.
And before shipping one, perform the remedy it demands and confirm that clears
it. A control nobody can satisfy is not strict, it is broken, and a control added
beside three existing ones is not safety, it is drift waiting to happen.

**Concrete checks:**
- **Enumerate existing enforcement first.** Ask what already fails if this goes
  wrong: a database constraint, a CI job, a hook, a test, a scanner. Adding a
  fourth checker to a rule three things already guard creates copies that will
  diverge, and the weakest copy is rarely the one anyone watches (see P5's
  read-back note and Observation 118).
- **Test the remedy, not just the alarm.** Do the thing the alarm demands and
  confirm it goes quiet. An alarm that cannot be cleared by its own stated remedy
  trains people to ignore it, which converts a control into decoration — the same
  end state as the whole-file em-dash guard that fired twenty times on text
  nobody had touched.
- **A planning surface must enforce the executor's invariants.** If a queue,
  board or calendar can express a state the executing system will refuse, the
  gap surfaces as a mysterious failure at run time rather than as an invalid
  entry at plan time.

**Applies to:** content-status and content-doctor, compliance-preflight, the
em-dash guard, wrap, and any new checker or gate.

**Distilled from:** Observations 114, 156, 52.

---

## P12 — A claim that will outlive its context needs an anchor to the thing it describes

**Statement:** Prose rots silently because nothing checks it. Any durable claim
about a file, a fact, or a number needs something that fails when the claim stops
being true — otherwise the first reader to trust it inherits an error with no way
to detect it.

**Concrete checks:**
- **Pin a doc's claim about a file to a test.** Where a document asserts that a
  file contains, exports or enforces something, add an assertion that fails when
  it no longer does. This is how `content-doctor` guards the scanner vocabulary,
  and it is why deleting or renaming those constants turns an invariant UNCHECKED
  rather than silently passing.
- **A synthesis must cite a recoverable artefact.** A summary, brief or research
  note whose sources cannot be re-opened is unfalsifiable; a late-arriving source
  must be reconciled against conclusions already drawn, not appended.
- **An agent's factual claim persisted into a reusable prompt becomes
  authoritative and propagates.** Anything written into a template, playbook or
  brief is read as established fact by every later run, so a claim that entered
  as an inference must be marked as one or verified before it is saved. Related:
  P8 (a concrete value in a document is configuration) and Observation 139
  (evidence grade on a recorded cause).

**Applies to:** all content-generation skills, customer-research, article briefs
and playbooks, task-observer's own logging format.

**Distilled from:** Observations 119, 46, 125.

---

## P13 — Design the blocked case before the happy path needs it

**Statement:** A recurring workflow whose every lane depends on one scarce input
stops entirely when that input is unavailable, and a migration plan that has not
been checked against the anti-pattern it is meant to avoid will reproduce it.
Decide what happens when the dependency is missing while it is cheap to decide.

**Concrete checks:**
- **Every recurring workflow needs at least one lane that does not depend on the
  scarce resource** — the founder being on camera, a reviewer's sign-off, a
  third-party credential. Otherwise the cadence silently becomes "nothing shipped
  this week" and the reason is invisible in the output.
- **Check a phased-migration recommendation against the anti-pattern it exists to
  avoid.** A dual-store transition proposed to reduce risk usually IS the
  documented failure mode, so state explicitly how the window closes and what
  detects it if it does not.

**Applies to:** content-week, article-to-review, cio-sequence-build, any
migration or phased-rollout plan.

**Distilled from:** Observations 51, 56.

---

## P14 — Survey the whole corpus before writing the parser

**Statement:** Sampling proves a format is possible; only counting proves it is
safe. A parser written against the first few examples encodes assumptions the
tail of the corpus violates, and the failure lands as silently wrong output
rather than as an error.

**Concrete check:** before building anything that reads a body of
human-maintained input, enumerate the whole set and count the shapes present —
how many carry each field, how many deviate, what the outliers look like. Where
the corpus is too irregular to parse reliably, that is a finding to report, not a
problem to solve with a more clever regex. Related: P9 (completeness against a
stated inventory) and Observation 129 (a filter converts misses into apparent
completeness).

**Applies to:** any importer, scanner or migration reading existing files;
content-machine tooling; anything parsing CONTEXT/STATE docs.

**Distilled from:** Observation 152.

---

## P15 — A negative result is a claim about your query, not about the world

**Statement:** An empty or zero result fuses two claims: "the thing is not there"
and "I asked the right place". Only the second is cheap to check, and it must be
checked first, because a query aimed at the wrong scope fails as a success.

**Concrete checks:**
- **Multi-tenant APIs:** assert a POSITIVE control in the same call before
  believing a zero — a known-present item comes back, or the returned count
  matches an independently known number. Listing a scheduler's date window under
  the configured brand id returned HTTP 200 and an empty array while thirty posts
  sat on the other brand; nothing errored, and the honest reading of that response
  on its own is the false conclusion. Never assume tenant scoping is uniform
  across an API: `GET /posts/{id}` answered under either brand while the sibling
  list call did not, so "it worked for the by-id call" is not evidence.
- **Directional searches:** "I could not find X going in direction A" is not "X
  does not exist". Enumerate by listing the directory, not by grepping one verb,
  since import/export/sync/mirror rarely share vocabulary.
- **Enumerate the namespace before counting in it.** A live read is only as
  complete as its query set; counting known objects proves freshness, never
  coverage. Record the enumeration query beside the counts.
- **Missing metric fields:** absence and zero are opposite claims, and for
  difficulty, risk and cost metrics the coercion always errs toward "do it".
  Carry a missing value as unknown; never let it default into the favourable end
  of its own scale.
- When a search returns nothing, **restate what was actually searched for** before
  acting on the absence, and be most suspicious when the missing thing is what a
  maintained system would obviously have.
- **Negative CAPABILITY and AVAILABILITY claims carry their search space in the
  sentence.** n=1 supports "absent here", never "does not exist". An absence found
  in one vendor's catalogue was written down as a property of the product
  category. Write "not available at [vendor], one of eleven on the shortlist"
  rather than "impossible". The test: **would this sentence survive one more
  vendor, one more search, or one more API call?** If a single additional lookup
  could falsify it, it is a finding about the thing looked at, not about the
  world. This applies in STATE.md and in chat equally, since chat is where a
  wrong negative actually changes what someone does.

**Applies to:** any skill probing an external API, compliance-preflight,
context-audit, article-to-review keyword validation, wrap Stage 1, and any
supplier or vendor assessment.

**Distilled from:** Observations 237, 218, 227, 171, 329.

---

## P16 — A checker's green is a claim made by software nobody checked

**Statement:** The first run of a new detector measures the detector, not the
corpus. And the first output of a verification tool worth trusting is a RED one
you caused deliberately; until then a pass is indistinguishable from a tool that
cannot see.

**Concrete checks:**
- **A large finding count is evidence about the matcher until proven otherwise.**
  A CONTEXT drift auditor's first run reported 198 broken path citations; four
  narrowing passes took it to 9, every one hand-verified. Shipping the first
  version would have been worse than shipping nothing, because a checker that
  floods trains its reader to skim and then to dismiss.
- **Break the thing it watches and confirm it goes red.** A restore drill
  reported "23 of 24 policies missing" when the real cause was carriage returns
  in values parsed from a CLI, then reported "all 35 checks match" while five
  foreign keys had silently failed to restore, because its census counted indexes
  and not constraints. A green verdict was reachable with referential integrity
  missing, which is the exact failure the tool existed to detect.
- **Every filter inside a checker needs its own test that it suppresses
  something.** A gitignore filter shelled out to `git check-ignore` with
  backslash paths, which silently match nothing and exit 1, read as "nothing is
  ignored" — so the suppression did nothing and looked like a slightly noisier
  repo.
- **Prefer an allowlist census to a hand-picked property list**, since the failure
  mode is always the property nobody enumerated. Enumerate what a pass does NOT
  cover, and state the known residual false-positive shapes in the tool's output.
- Where the tool excuses an error class as benign, assert that no CONSEQUENCE of
  that class is separately being reported as a defect.

**Applies to:** context-audit, compliance-preflight, content-status, any new
scanner, invariant, drill or audit script.

**Distilled from:** Observations 161, 247.

---

## P17 — A test and the code it tests must meet the contract independently

**Statement:** A suite validates behaviour against its fixtures, never against
reality. Fixtures are an assumption about the world written in the same confident
tone as the assertions, and they are the one part of a suite that nothing else
checks.

**Concrete checks:**
- **Fixtures are constructed WITHOUT casts.** A type assertion inside a fixture
  removes exactly the independence that makes the test worth running: production
  code read a field that did not exist on the type it read from, the typechecker
  had reported it for weeks, and it was dismissed as noise because a unit test
  covering that behaviour passed — passing because its fixture was built in the
  same wrong shape and then cast. The test did not merely miss the bug, it
  certified it. If a cast seems unavoidable, that is the finding.
- **A passing test over code the typechecker complains about is evidence to
  investigate, never evidence to dismiss the complaint.**
- **Enumerate the SHAPES a field can take, not a representative value**, and
  require one fixture per shape. A field that could arrive as a bounded pair, an
  upper bound only, or a lower bound only had every fixture supplying a bounded
  pair, so the third shape had no coverage and the UI branch mishandling it was
  never exercised — on the one marker that really returns it.
- **When an external contract is confirmed, updating the fixtures to match is
  part of receiving it**, not cleanup. Derive fixtures from a real payload where
  one is available.

**Applies to:** any skill that writes or reviews tests; supabase-postgres-best-practices;
code review of anything consuming a third-party payload.

**Distilled from:** Observations 241, 166.

---

## P18 — Bind external records on content, never on position

**Statement:** When adopting a pre-existing external record into a local row, the
join key must be something that would be WRONG if the records were mismatched.
Position, order and timing are satisfied equally well by the wrong pairing.

**Concrete check:** use the coarse key (the slot, the date) only to NARROW
candidates, then require an exact match on something the item itself carries and
that differs between items — the approved caption text, byte for byte. **Refuse
rather than fall back:** no nearest-match, and no "only one candidate so it must
be it" when the content disagrees. Report each refusal with what it costs, so a
person can see the item will otherwise proceed unrecorded. The obvious
sort-both-lists-and-zip implementation produces a correct-looking result on the
day it is written and attaches the wrong id the first time anything shifts; a
wrong id is invisible from every direction, because the row looks healthy, every
later job trusts it, and the eventual symptom is one item reporting another's
outcome as its own.

**Applies to:** any reconciliation of an external system into a local store;
content-week, content-status, the Metricool and ClickUp mirrors.

**Distilled from:** Observation 240. The other half of the same trust boundary is
P15.

---

## P19 — Another system's configuration is a cache with no invalidation

**Statement:** A document describing an external system's plan, tier, quota,
inventory or enabled state is a cache. Its age is invisible and its confidence is
unchanged by being wrong. Re-read the system before repeating the claim or acting
on it.

**Concrete check:** **the trigger is cheap to spot — you are about to tell a human
to purchase, enable, upgrade or click something. That sentence is the
checkpoint.** Six documents said the database was on the free tier with no managed
backup; the organisation had been on the paid tier for some time, the claim
originated in one document and was cited onward by a plan, a STATE file and that
day's own new work, and the user was told to go and buy something he already
owned. In the same session a server inventory named a machine with a disk size
matching no reachable host, and the machine that WAS the right one reported a
different hostname than its console label, so a first pass concluded it did not
exist. Both were one API call or one SSH command from being checked.

**Applies to:** wrap Stage 1, decision-sweep, context-audit, any status report
that names an external service.

**Distilled from:** Observation 246. Related: P1.

---

## P20 — A refused destructive one-off is evidence the operation deserved a tool

**Statement:** When a destructive one-off is blocked or feels risky, the reflex is
to work around the shape of the refusal. Ask instead whether the operation will be
needed again, or whether some document already promises it exists.

**Concrete check:** a bulk delete against production almost always wants an
explicit target, a **dry run by default**, an affirmative `--yes`, and a printed
list of what it matched — and those are the same properties that make it safe to
run once. An inline `node -e` carrying a service-role key and issuing a bulk
DELETE was refused; writing a proper named script instead produced
`unpublish-media.js`, which was ALSO the deliverable a later plan step required (a
written, repeatable takedown path) and grew an `--orphans` mode that turned out to
be the exact inverse of an invariant being built alongside it. The one-off would
have deleted the objects and left nothing behind. **If a procedure document
describes the operation in prose, the script IS the missing half of that
document.**

**Applies to:** any implementation work touching production data; wrap,
decision-sweep indirectly.

**Distilled from:** Observation 244.

---

## P21 — Convert a semantic rule into an ownership check before trying to build it

**Statement:** When a compliance or safety rule is handed over as "fail if X
appears", check whether X is observable by the thing doing the checking. If it is
not, the literal implementation becomes a filename heuristic that passes trivially
and reads like enforcement.

**Concrete check:** restate it as **"fail unless everything present is accounted
for by a known owner"**. A step asking a doctor invariant to fail if results PDFs,
biomarker charts or customer photos appear in a public bucket is unbuildable —
nothing can look at a PNG and see that it is a biomarker chart. Inverted to an
allowlist (every object must match the path convention AND its first path segment
must be a live content asset slug) it became buildable and stronger, because a
results PDF, a customer photo and a stray export are all things no asset would
ever claim, so it catches the whole class including members nobody enumerated.
**A blocklist only catches hazards someone thought of; an allowlist over
provenance catches the ones nobody thought of, which is the category that causes
incidents.** Put the preventative control at a layer that CAN see the property (a
bucket-level mime allowlist refusing `application/pdf` for every caller including
the service role), and name the layers explicitly so nobody mistakes the detective
one for the preventative one.

**Applies to:** compliance-preflight, content-status, any invariant written from a
prose safety requirement.

**Distilled from:** Observation 245.

---

## P22 — A written procedure is a hypothesis until it is walked once

**Statement:** A list of everywhere something can be, written from reasoning, is a
hypothesis about the world. Its errors are invisible precisely because it looks
complete, and the missing entry is usually the layer so close to home it was
treated as part of the origin rather than as a copy.

**Concrete checks:**
- Mark a procedure **UNWALKED** until one real instance has been taken through
  every step, and record the walk. A seven-step takedown procedure named the
  publisher's CDN, the platform, storage, the repo and the database, and missed
  the CDN sitting directly in front of our own domain; it surfaced ninety minutes
  later when a deploy removed files from the origin and every image under the old
  path kept serving 200 from the edge cache.
- Where a step cannot be walked (it needs a live incident, a paid action, a third
  party), **say so at that step** rather than leaving it looking equal in
  confidence to the walked ones.
- **In any enumeration of caches or copies, verify per-object rather than by
  sample** — caches expire unevenly, and in that incident one asset type at the
  same path returned 404, so a single spot-check would have confirmed the wrong
  answer.

**Applies to:** compliance-preflight, any runbook, SOP or incident procedure;
12_operations generally.

**Distilled from:** Observation 248.

---

## P23 — A dependency-ordered plan has usually only checked the backwards edges

**Statement:** A plan that claims to be ordered by dependency has typically
verified that each step's prerequisites came earlier. The dangerous edge points
forwards: an early step silently needing a later step's output looks perfectly
ordered until someone tries to do it.

**Concrete checks:**
- When authoring a phased plan, run an explicit pass asking of every step **"what
  does this step CONSUME, and which step produces it?"** — and record the answer
  even when it is "nothing", because a step whose inputs are unexamined is where a
  backwards dependency hides. Step 1.3 of a seven-phase plan required the shared
  scheduler to build a media-carrying post, and the table saying which media
  belong to which post was step 6.2, five phases later.
- **An acceptance criterion computed from a file the agent is forbidden to edit is
  not a criterion, it is a trap.** Before pinning acceptance to a command's
  output, check which inputs that command reads; if any sit outside the permitted
  edit surface, widen the fence or move the criterion. The agent's only honest
  move otherwise is to report the conflict rather than pick a rule to break.
- When executing a step whose done-when turns out to be unreachable, the
  deliverable is **the evidenced blocker plus whatever part IS reachable**,
  recorded in the plan against the original wording — never a quiet skip or a
  forced completion.

**Applies to:** multi-agent-orchestration (brief authoring), any skill that
authors or executes a phased plan.

**Distilled from:** Observation 239, and the 2026-08-11 unnumbered entry on
acceptance criteria versus scope fences.

---

## P24 — A naming convention is a data model

**Statement:** Keying a name on an attribute that siblings SHARE does not merely
make variation awkward, it makes variation unrepresentable, and the resulting
collision reads as completeness rather than as an error.

**Concrete check:** name an artefact after the **full identity** of the thing it
belongs to, not one of its properties; where a database row already carries that
identity, mirror it exactly. A thumbnail SOP specified `thumb-9x16.png`, keyed on
the size three platforms share and omitting the platform that distinguishes them,
so the convention could represent one of the three renditions and had no way to
represent the other two. It fails silently in the safe-looking direction: with one
file present, a gate asking "does the thumbnail exist" is satisfied, the asset
ships, and three surfaces carry a cover nobody chose to share. **Test a proposed
convention by asking whether two sibling items could ever need to differ; if they
could, the name must carry whatever distinguishes them, even if today they happen
to be identical.** Model for difference and allow deliberate reuse; never let the
naming scheme be the thing that decides two items are the same.

**Applies to:** content-week, content-status, any asset or artefact convention.

**Distilled from:** Observation 105.

---

## P25 — An established family of files encodes solutions you have not met yet

**Statement:** Copying a sibling's surface while missing its edges produces
something that looks conventional and fails in the way the convention existed to
prevent. The solutions usually live at the edges of the file — setup, teardown,
async handling, exit codes, entry-point guards.

**Concrete checks:**
- **Read at least one sibling END TO END before writing a new file into an
  existing directory**, and explicitly enumerate the structural problems it
  solves, then confirm the new file addresses each. A new test file modelled on
  the visible portion of a sibling collected async checks and never awaited them,
  so the suite printed its pass summary and made its exit decision before any
  async check resolved: a failing check would have printed after "All checks
  passed" and still exited 0. Both siblings had already solved it, by two
  different correct methods.
- **An entry-point guard is security-adjacent even when it looks like
  boilerplate**, because its failure mode is executing production work as a side
  effect of an import. Use exact basename equality, never a suffix or `endsWith`
  match: a regex ending in the script name also matches `test-<name>.ts`, so
  importing the module to test it ran a live job against production data and a
  real external service. Explicit review question: **does the guard's pattern also
  match `test-<name>`?**

**Applies to:** any code-writing skill; supabase-postgres-best-practices; scripts
under `scripts/content-engine/` and `.claude/`.

**Distilled from:** Observations 236, 250.

---

## P26 — Eliminate the alternatives before spending someone else's time

**Statement:** A hypothesis that explains the evidence is not the same as the only
hypothesis that explains it. When the user is the one who will pay for the next
step, the bar is elimination of the alternatives, not consistency with the
symptom.

**Concrete check:** before asking a user to perform an external action to resolve
a failure, **re-read and echo EVERY input to the failing operation, not just the
suspected one**, and state which inputs changed since the last attempt. Where a
config file is the source, print the whole relevant block rather than the single
key. A database dump failed to authenticate; the password had just been supplied,
was diagnosed as wrong, and the user was sent to a third-party dashboard to reset
it. On the retry the same password worked: the connection host in the config had
reverted between turns, and only the suspected field had been re-read. **Asking
someone to reset a credential is not a free diagnostic step** — it is irreversible
for the old value, it costs a context switch, and it teaches them that the agent's
requests may be unnecessary.

**Applies to:** any skill that asks the user for a credential or an external
action; wrap, supabase, cio-sequence-build.

**Distilled from:** Observation 235. Related: P4.

---

## P27 — Clamp at the source, and isolate per-item failures in a batch

**Statement:** A generator mapping variable-length content into a length-capped
destination field must clamp at assembly time, and a batch run must isolate
per-item failures so one bad item is a re-run of one, not a restart of all.

**Concrete check:** batch-creating 16 Substack drafts, 15 succeeded and one failed
with a 400 naming `draft_subtitle` as too long, because its article excerpt was
281 characters against an undocumented ~200-character cap — a field that is fine
as blog meta and too long as a subtitle. Clamp source-derived fields to the
destination's known limit at assembly (truncate at a word boundary), rather than
passing them through raw. Keep batch drivers as per-item calls or catch-per-item,
and report which items failed so the re-run is targeted. **When a limit is
discovered empirically, bake it into the tool** so it never recurs.

**Applies to:** any batch generator feeding an external API; content-week,
cio-sequence-build, the Substack and Metricool jobs.

**Distilled from:** Observation 38.

---

## P28 — Record the RUN, not only the findings

**Statement:** Absence of evidence and absence of a search are different facts and
must be stored differently. Any store recording only findings can express "nothing
is wrong" and "nobody looked" with the same bytes, and a reader cannot tell which
one they are seeing. Three states have to be separable: **not run**, **ran and
found nothing**, **ran and found something.**

**Concrete check:** deriving "checked" from the presence of findings collapses the
first two, and it collapses them in the direction that reads as safe — an empty
findings list looks like a clean bill of health and is indistinguishable from a
check that never executed. So a check writes a run record (timestamp, scope, and
what it examined) independently of whether it produced findings. The scheduled-agent
version of this is already load-bearing here: a nightly checker that stops running
is silent, and **its silence is byte-identical to a clean night**, which is why
liveness is watched from outside by a heartbeat rather than inferred from its own
output. The same logic applies to any pre-flight, audit or sweep whose result gets
quoted later.

**Second form, in a text matcher rather than an instrument.** A checker scoped to a
specific location must report the count it **matched in that location**, because
zero matches and zero failures render identically and the first is the more
dangerous state. `content-doctor` I7 asserts that counts quoted in STATE docs match
the database; it passed while the newest dated section was stale, because it
matched **zero assertions there** and reported clean. "0 current assertions in the
newest section" is itself a finding. This is the positive-control problem applied
to a parser: the matcher needs something it is known to catch, or its silence
proves nothing. (Observation 303.)

**Applies to:** compliance-preflight, content-status, context-audit, decision-sweep,
wrap Stage 1b, content-doctor, and every scheduled agent in
`12_operations/automation/`.

**Distilled from:** Observations 323 and 303; related to 322 and 131.

---

## P29 — Give the expensive half of a rule a bounded form

**Statement:** When a rule names two actions and one is materially more expensive
than the other, the expensive one is the one that gets skipped — and the cheap one
being done makes the whole step look complete. Give the expensive half a bounded
form (a targeted query rather than an open-ended read, a copy-pasteable snippet
rather than a described intention), or it will keep failing however many places
the rule is written down.

**Concrete checks:**
- **"Read CONTEXT.md and STATE.md"** failed on the STATE half for ten weeks
  because CONTEXT.md has an obvious stopping point and a 1,260-line STATE.md does
  not. The bounded form is `grep -in "<subject>" STATE.md` before reporting on any
  named programme, channel or partner. (See `andro-prime/CLAUDE.md`.)
- **"Archive on write" plus "follow the numbering discipline"** ran 0/3 and 3/3
  respectively from the same commands in one session; the difference was that one
  shipped bash and the other shipped prose.
- **Corollary for status stores:** a volatile-status file that grows without bound
  stops being readable, and an unreadable status file is functionally the same as
  no status file, except that it looks like diligence was possible.

**Applies to:** task-observer, wrap, context-audit, and any skill whose steps mix
a cheap check with an open-ended read.

**Distilled from:** Observations 343, 342.

---

## P30 — Compute the field or delete it

**Statement:** A format field that asserts a **measurable** fact will be filled in
by estimate unless something measures it, and the estimate will be confidently
wrong in the direction that looks fine. Either compute the field or remove it,
because a wrong number in a field labelled with a unit is worse than no number: it
reads as measured, so nobody re-measures it.

**Concrete check:** a batch drafting format asked each post for a character count
and nothing computed it. Seven of seven were wrong, all of them understating,
which is exactly the direction that keeps a draft looking within limit. The same
shape covers durations, word counts, file sizes, costs and reading times — any
slot where a human or a model supplies a number a machine could have produced.
Before shipping a template, walk its fields and ask of each: *what measures this?*
If the answer is "the author's judgement" and the field claims a unit, either wire
the measurement in or cut the field.

**Applies to:** content-week, script, hook, article, cio-sequence-build, and any
template or frontmatter schema with a numeric field.

**Distilled from:** Observation 285.
