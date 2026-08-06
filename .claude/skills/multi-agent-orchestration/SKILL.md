---
name: multi-agent-orchestration
description: >
  Brief, fan out, verify and repair work across multiple agents. Use when a task
  will be split across parallel subagents, when briefing a builder against a
  written spec, when running a build/verify loop, or when a validator's findings
  will be fed to an automated fixer. Also use when the task is "fan this out",
  "run these in parallel", "have an agent check the other agent's work", or
  before writing any workflow script that spawns agents. Owns the pre-launch
  environment check, brief fidelity, fan-out safety, verifier independence, and
  the rules that stop an automated fixer destroying deliberate work. It does NOT
  replace the Workflow tool; it is what you read before writing one.
---

# Multi-Agent Orchestration

Distilled from six failures in live orchestration runs, every one of which
produced confident, plausible, wrong output rather than an error. That is the
signature of this whole class: **a badly-orchestrated fleet does not crash, it
agrees with itself.**

This skill is client-agnostic and contains no business specifics; it could be
published as-is if that is ever wanted.

## The one-line version

An agent inherits your spec's optimism, your brief's wording and nothing else.
It cannot see what is actually wired up, it cannot tell a scoped rule from an
absolute one, and it will resolve any gap by producing something that looks like
compliance. Every rule below follows from that.

---

## 1. Before you brief — check the environment, not the spec

**An approved spec is a statement of intent written before anyone checked what is
reachable.** When a builder meets an item it cannot satisfy, its strong default
is to fake compliance: stub it, infer a plausible credential name, or emit a
passing result for a check it never performed. The last is the dangerous one,
because the artefact then reports green on an assertion it cannot make — exactly
the defect a verification tool exists to eliminate.

- **Enumerate the spec's external dependencies** (credentials, APIs, services,
  files, schema objects) and confirm each is reachable **from where the code will
  actually run**, not from where you are sitting.
- **Fold the results into the brief as named facts**, never as an exercise for
  the subagent. One minute of checking converts a guaranteed wasted round into a
  single line of briefing.
- **Mandate three-valued results.** Every check resolves to PASS / FAIL /
  UNCHECKED-with-reason. An unavailable dependency yields UNCHECKED, and
  **UNCHECKED must be visually impossible to mistake for PASS.** A binary forces
  every unperformed check to be reported as one of the two things it definitively
  is not.
- **Require the unimplementable item to stay in place, marked** — never deleted
  from the spec. A silently dropped requirement is indistinguishable from a met
  one.

**If the task touches CI, a scheduled job or a deployment, say so in the brief:
the runtime reads the COMMITTED or DEPLOYED state, not the working tree.** An
agent inspecting only its working tree once reported that a fix "must be
committed before 07:00 UTC or the next cron run will corrupt downstream data".
The reasoning was sound and the premise was false: CI runs committed code,
nothing was committed, so the next run would execute the old script correctly.
There was no deadline, and the real hazard was the opposite — committing PART of
the change, since the fix and its data had to land together.

- **Ask for the ATOMICITY requirement (which files must land together), never for
  a deadline.**
- **When an agent reports urgency, verify the premise before inheriting it.** An
  invented deadline is more dangerous than a missed one, because it pressures the
  reviewer into skipping the checks that would catch it.

## 2. Writing the brief — fidelity beats safety

**Quote project rules VERBATIM from the file that owns them, with the file path.**
Do not paraphrase and do not harden.

A project's real rule banned a typographic character in EXTERNAL-FACING writing.
The brief restated it as "banned anywhere, including code comments, docs and
output", which sounded safer and was not the rule. Agents then spent effort
avoiding it in internal comments whose own files already used it, one escalated a
single instance as a decision, and the validator raised a formal finding against
lines that did not violate the actual standard. The tightening created work,
noise and a false finding, and left the codebase **less** internally consistent.

- **Scope is part of the rule.** "External-facing", "published copy",
  "user-visible strings" — dropping the qualifier is a change to the rule, not a
  safe simplification.
- If a stricter version is genuinely wanted, **label it as a deliberate
  tightening with a reason**, so downstream agents can tell "the project forbids
  this" from "this task forbids this".

**Bind the SUBJECT of every prohibition as tightly as the predicate.** "No AGENT
may write a migration" is a different check from "no migration must exist". A
validator given the second correctly found a migration and raised a BLOCKER — but
it had been written by the ORCHESTRATOR, deliberately, to repair a defect no
builder was permitted to touch. The finding was factually true and completely
wrong.

- **Give the validator an explicit list of sanctioned out-of-band changes with
  their justification**, so it verifies them as intended rather than reporting
  them as breaches.

## 3. Fan-out design — file disjointness is necessary, not sufficient

Before parallelising, ask two questions, not one:

1. Do these agents touch the same **files**?
2. **Do these agents need the same FACT?**

Two agents were parallelised correctly on disjoint files and still collided
semantically: both needed the same canonical list, so both wrote their own copy,
and a third already existed from an earlier stage. Three hand-maintained copies
of one list, no agreement check, and **already diverged** — the copy used by the
automated nightly alarm watched fewer entries than the copy used by the hand-run
tool, so the more important checker was the weaker one. The project's entire
purpose was eliminating duplicated facts.

- Where two tasks share a definition, **extract it into a single owned module in
  a prior sequential step** and instruct every downstream agent to import it, or
  give both tasks to one agent.
- Where shared state is unavoidable, **add an explicit check that the copies
  agree**, and treat the copy used by automation as the one that must be
  strictest.

**Agents that cannot conflict in the filesystem can still conflict in the model.**
Duplication comes from parallel authorship of one idea, not from concurrent
writes to one file, and the copy that ends up weakest is rarely the one anybody
is watching.

## 4. Verification — it is only worth its cost when it can disagree

**Name the independent route in the verifier's brief.** Re-running the builder's
own code and observing the same output confirms nothing; it is the implementation
agreeing with itself. In the run that worked, the builder read the database
through one client and the verifier through a completely different one, which
turned "the numbers look right" into "the numbers reconcile against an
independent derivation".

- **Forbid confirming any claim by re-running the builder's code.**
- Self-audit is **structurally blind** to intent-versus-behaviour gaps: the
  builder knows what it meant the check to do, so it cannot see "this passes
  because it silently examined nothing".

**Require an explicit terminal verdict, separate from the findings list.** A
verifier asked only for findings will always produce findings — adversarial
framing has no natural stopping point. By round four a loop was surfacing only
hypothetical constructions, each further round carrying more regression risk than
it removed, and the orchestrator could not tell from the list alone, because a
long list of hypotheticals looks like a long list of faults.

- Ask for one field: **ship / iterate, with what must change.**
- Ask the verifier **to say plainly when it has crossed from finding faults to
  finding hypotheticals.**
- State that **a soft answer costs more than a harsh one**, so it does not hedge
  to seem thorough.

## 5. Acting on findings — the fixer is the dangerous stage

An automated fixer briefed to repair every blocker was one step from reverting a
schema change that carried the only record of a real business approval. The loop
had to be stopped by hand.

- **A finding about an out-of-band or infrastructural change is
  ORCHESTRATOR-OWNED.** The fixer must surface it and refuse to act unilaterally.
- **A fixer must never be able to revert something no builder was allowed to
  create.** If that is possible in your design, the design is wrong.
- Triage findings for actor-scope errors before feeding them anywhere: for each,
  ask *who did this, and were they forbidden to?*

## Pre-flight — run this before launching any fleet

Rules in a skill are not reliably followed under load, so check the brief against
them rather than trusting that you wrote it correctly.

- [ ] Every external dependency in the spec **checked for reachability from the
      runtime**, and the result stated in the brief as a fact.
- [ ] Checks are **three-valued**, and UNCHECKED cannot be misread as PASS.
- [ ] Every quoted project rule is **verbatim, with its file path and its scope
      intact**; any deliberate tightening is labelled as such.
- [ ] Every prohibition **names its subject** (which actor), not just the act.
- [ ] The validator has the list of **sanctioned out-of-band changes**.
- [ ] Parallel agents checked for **shared facts**, not only shared files; any
      shared definition extracted to one owner in a prior step.
- [ ] The verifier has a **named independent route** and is forbidden from
      re-running the builder's code.
- [ ] The verifier must return a **ship/iterate verdict** separate from findings.
- [ ] The fixer **cannot revert** anything a builder was forbidden to create.
- [ ] If CI, cron or deploy is involved: the brief says the runtime reads
      **committed state**, and asks for **atomicity, not a deadline**.

## Distilled from

Observations 108 (environment check before briefing; three-valued results),
109 (verifier route independence; terminal verdict), 116 (actor-scoped
prohibitions; fixer must not revert orchestrator acts), 117 (verbatim rules;
scope is load-bearing), 118 (shared facts, not just shared files), 120
(committed state, not the working tree; atomicity over deadlines).
