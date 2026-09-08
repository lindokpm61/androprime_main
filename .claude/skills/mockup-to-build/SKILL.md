---
name: mockup-to-build
description: >
  Port a design artefact into the real build: a mockup HTML into a route, a
  direction into a component, a critique's fix into the page it was written
  against. Use when the task is "build this mockup", "port X to the site",
  "make the page match the direction", "roll this out to the other pages", or
  "apply the critique". ALSO fire it whenever a page is being redrawn against
  any source that renders — a mockup, a prototype, a sibling page, a published
  artefact — because that is the case where the source carries precise values
  and the default failure is silently re-deriving them. Owns the cascade traps,
  the token traps, the port-completeness check and the render-based
  verification. It does not decide visual direction, and it never signs off
  copy.
---

# Mockup to build

**Internal skill.** Andro Prime specific: it names this repo's mockup
directories, `f-primitives.css`, `shot.js` and the Direction F scaffold.

A design artefact that renders is a **specification, not a wireframe**. The
numbers are in it, someone chose them, and re-deriving them substitutes taste
for a decision that was already made and approved. Every failure below shares
one shape: **the source reads correctly and the output is wrong**, so a reviewer
reading the stylesheet sees the right instruction and a reviewer glancing at the
page sees a plausible result. Nothing errors. Nothing fails a typecheck. Nothing
shows in a diff. The whole skill exists because that class of defect is invisible
to every gate a frontend normally has, and visible in about four seconds to a
rendered screenshot with a computed-value assertion beside it.

Distilled from 26 observations logged between 2026-08-22 and 2026-09-08, every
one of them a defect that shipped or nearly shipped.

## Hard invariants (violating any of these is a defect)

1. **Verify the artefact that RUNS, never the artefact that describes it.** A
   computed value from a rendered page is evidence about behaviour; a
   declaration in a source file is evidence about intent. They diverge silently
   and always in the flattering direction. This is the single rule the other
   invariants are special cases of.
2. **Open the artefact; do not read prose about it.** Form does not survive
   summarisation. A description can be complete, accurate, carefully read, and
   still leave you holding the wrong object — and an artefact's own header
   comment is the most convincing place to learn the wrong thing about it.
   Where the file opens in one command, reading about it instead is not a
   shortcut, it is a different task.
3. **Take the artefact's VALUES, not just its structure.** Porting the markup
   and re-deriving the CSS produces work that passes every check derived from
   the code and fails the one check the artefact existed to provide. The tell
   that this is happening is that the output looks good and self-consistent: a
   coherent re-derivation hides drift far better than a broken one.
4. **A deviation from a supplied specification is a decision to surface, never a
   note to bury in the implementation.** A comment asserting the deviation as
   established practice is the most durable way to hide it, because the next
   reader receives it as context rather than as a choice.
5. **Never edit a file another session is writing.** Before the first write,
   stat the files this task will touch (`find <dir> -mmin -30`). Recent writes
   mean a live writer: stop and surface it. This repo runs parallel agent
   sessions on one working tree and git gives no signal at all.
6. **This skill reports CSS findings; it does not silently repair them.** An
   orphan rule may be unbuilt work someone intends to build. Every finding gets
   a ruling: unbuilt, dead, or a live defect.

## Workflow

### 1. Inventory before you produce

The default assumption is that what you are being asked for already exists in
some form, and the second assumption is that it exists in more than one.

- **Sort by mtime before reading any file.** In a directory of iterations,
  filename plausibility is not recency. A script's hardcoded input path proves
  what was current when the script was written, not what is current now.
- **Enumerate the component's call sites before repairing any one of them.** A
  component with N call sites has N chances to drift and N candidate references,
  and one of the siblings is usually already right. The diff between siblings is
  cheaper to read than the diff against the specification. Fixing one of two
  call sites for the same fact is worse than fixing neither: a duplicated fact
  is invisible exactly while the copies agree, and the first correction is what
  makes it visible.
- **"Should we roll this out to the other pages?" is answered by the import
  graph, not by a plan.** Grep for the component and for the class stem.
- **Look for the half that produces no output.** Unfinished work does not always
  look unfinished: where a feature needs two halves in different files, building
  one leaves a system that is silent rather than broken. `audit-css.js --only
  orphan` is that grep.

### 2. Read the source artefact, in the browser

Open it. Shoot it. Then read its source with the render in front of you.

```bash
node andro-prime/12_operations/automation/shot.js \
  andro-prime/09_website-app/design/mockups/directions/F-field.html \
  --out shots --name source --theme both --full
```

`shot.js` captures at rest by default (emulated reduced motion, plus a scroll
walk) and **exits 2 naming any reveal element still hidden**. A faint or blank
capture is a tooling artefact until that check says otherwise; do not report it
as a broken page.

**An annotated artefact is two documents and they can disagree in either
direction.** Trusting the prose ships something the artefact never showed;
trusting the pixels ships a bug the artefact already warned about. Only diffing
them tells you which you are looking at, and the port is the first thing that
ever forces that diff. Where the artefact's own label enumerates its contents
("nine sections"), count them — an unchecked enumeration inverts its purpose,
because the reader trusts it, finds the artefact disagrees, and now has two
sources to reconcile instead of one to read.

**Triage the source's own self-documented defects BEFORE the build, not during
it.** "Reproduce this exactly" cannot be satisfied by an artefact that contains
known defects, and the decision about each one belongs to the person who asked.

### 3. Audit the source and the target stylesheet

```bash
node .claude/skills/mockup-to-build/audit-css.js <mockup.html>
node .claude/skills/mockup-to-build/audit-css.js \
  andro-prime/09_website-app/frontend/styles/components/f-primitives.css
```

Four checks, each for a defect invisible to source review — `--only orphan |
duplicate | losing | literal`, `--help` for the full rationale. Run it on
**both sides**: porting a pattern into a second context is the cheapest audit
the original will ever get, because the first use is reviewed as a whole design
and the second is reviewed property by property.

Measured when the tool was written: the F-field mockup's **entire**
reduced-motion branch is dead on specificity — eight selectors, not the one that
was diagnosed by hand — while the live stylesheet is clean. That asymmetry is
the point of running it on the source.

### 4. Port, watching the cascade

The cascade traps, each of which has shipped:

- **A specificity collision is a property-by-property contest, not a
  rule-by-rule one.** A fix scoped to the symptom leaves the same bug live on
  every property nobody inspected. And a system verified by diffing declarations
  cannot detect it at all, because the losing declaration is present, correct
  and inert.
- **A modifier that overrides a base declaration also overrides every
  conditional override of that base.** So the edit is never one selector: it is
  one selector plus every conditional that mentions the property. Specificity
  bugs live in the state you are *not* looking at.
- **Scoping a rule to a container is not scoping it to that container's own
  content.** Anywhere components are composed into a styled region (MDX bodies,
  rich text, slots), the region's element rules and the components' own rules
  compete, and specificity decides — not intent. An element-targeted body rule
  once outranked every single-class component rule and took the typeface off 37
  of 51 labels.
- **A shared stylesheet delivers the rule, not the effect.** A selector is a
  contract with a markup SHAPE. A page that shares the class vocabulary but not
  the structure gets the declaration and not the outcome, with no signal, and
  every name-based audit reporting success. The propagation question is never
  "does the target load this file", it is "does the target's markup satisfy this
  selector".
- **A rule that must be restated at every site is enforced by diligence.** The
  dangerous version fails by inheritance, because the inherited value is valid,
  renders cleanly, and is indistinguishable from an intentional choice. State
  such rules at the highest level the cascade allows.
- **Two rule blocks for one selector is a latent defect, not untidiness.** Where
  the same key can be set in two places and the resolution is positional rather
  than semantic, the trigger is the next person to edit the wrong copy.

And the layout traps:

- **Spacing is a property of the SEQUENCE, not of the element.** Give it to the
  thing that owns the relationship. Split across the participants you get a
  value nobody authored, which no single-component review can catch and which
  fails silently in both directions, doubled or absent, depending on which
  neighbour was written first.
- **`display:flex` on an element whose children are author-supplied** turns "one
  more link in this sentence" into a layout change. Inheriting such a rule from
  working code proves the old content never exercised the case, not that the
  rule is safe. Ask what input range a borrowed rule was actually exposed to.
- **A percentage-based mask is a latent responsive defect the desktop render
  cannot show.**

And the token traps:

- **A design artefact references tokens by NAME, and names are stable while
  values are not.** Every visual distinction the design draws between two named
  tokens is an unstated assertion that they differ, and it becomes false the
  moment either is re-ruled. A check that both are *declared* passes happily
  while they are declared identical.
- **An undefined custom property is a silent zero.** A duplicated token block is
  what hides it. Where a value is resolved by the platform rather than the code,
  the source is evidence about intent only.
- **Fix a whole colour-defect CLASS by remapping tokens at the boundary, not by
  editing every rule.** A rule that reads a token is already correct for every
  theme the token knows about; the bug is that nobody told the subtree which
  ramp it is on. The corollary: every hardcoded literal is a permanent opt-out
  of theming (`--only literal`).
- **Text `opacity` is not a dimmer, it is a contrast reducer toward the
  background**, so its effect reverses between light and dark surfaces. A
  hierarchy built from alpha is not portable; ramps are background-aware by
  construction and alpha is not.

**If you edit several sibling files by pattern, validate every match before
mutating any file.** An assertion that fires between two writes converts a wrong
result into a PARTIAL one, which is worse than either succeeding or failing
cleanly. And an exact-match patch tool composing multi-line patterns has a hidden
dependency on line endings, which are not uniform across this repo.

### 5. Verify by rendering, with an assertion beside the picture

```bash
node andro-prime/12_operations/automation/shot.js http://localhost:3000/<route> \
  --localstorage ap_cookie_consent=denied --hide ".f-nav" \
  --expect-text "<a string only the new code emits>" --theme both --full
```

- **The DOM assertion catches "did it apply"; the screenshot catches "is it
  right".** Neither substitutes for the other. A screenshot alone cannot
  distinguish "my change did not work" from "the server served stale HTML".
- **When a rendered check disagrees with a measured check, resolve the TRANSPORT
  before re-opening the code.** Fetch the served markup and grep it for the
  changed string: one request, no browser, cache, port or process ambiguity in
  it.
- **An HTTP 200 sweep is not a rendering check.** It was used three times as one
  while a shipped CSS collision was deleting content from a swept page.
- **Every screen rendering is not every screen being REACHABLE.** Enumerate the
  source's event handlers (`addEventListener`, `onClick`, `data-*` markers) and
  check each has a counterpart. One grep lists the affordances in seconds.
- **A behaviour the user described in motion cannot be delivered as a still.**
  Building one interactive instance is cheaper than the round trip.
- **Verify a stateful UI by comparing the MATRIX, not a screenshot** — every
  state against the reference, not the state that happens to be on screen.

### 6. Close the loop back to the source

The step that is always skipped, and the one that decides whether this defect
comes back.

- **A correction applied downstream of a generative artefact does not travel
  back up it.** If the fix belongs to a component the mockup also draws, the fix
  has two call sites and fixing only the code sets a timer on the defect
  returning through the next port. The tell is cheap and nobody checks it: two
  shipped pages rendering the same component with different words.
- **A faithful port of a source that predates a later ruling reproduces the
  pre-ruling decision, and fidelity is the reason nobody checks.** Before
  porting, ask what has been ruled since the artefact was drawn.
- **A design artefact drifts from the system it depicts.** "Is this consistent
  with our design system" is two questions: consistent with the system as
  implemented, and consistent with the artefact that claims to describe it.
  Answer the first. A new proposal drawn inside a stale reference inherits its
  staleness without anyone choosing that.
- **A correction stored inside the artefact it corrected is invisible to the
  next artefact.** Feedback given once must end up somewhere the next piece of
  work has to pass through, or it gets given again — and the second time is
  evidence that the storage was wrong, not that the note was unclear. In this
  repo that place is `frontend/DESIGN.md` or this file, not a comment in the
  stylesheet where it was hit.

## Pre-flight — run this before reporting the port done

Rules in a skill are not reliably followed during creative flow, so this is the
re-read. Every item is a question with a checkable answer.

1. Did I open and SHOOT the source artefact, or did I read prose about it?
2. Did I take its values, or re-derive them? Name one number I copied.
3. `audit-css.js` run on both the source and the target — findings ruled?
4. Did I grep for existing call sites before writing a new one?
5. Screenshot of the built route, at rest, both themes, `--expect-text` passing?
6. Did I read a COMPUTED value for at least the properties I changed, rather
   than only the declaration?
7. Narrow viewport checked, not inferred from the desktop render?
8. Does any fix here also belong in the mockup? If yes, is it applied there or
   listed as owed?
9. Any deviation from the source surfaced to Keith as a decision, not buried?
10. Was anything I touched also being written by another session?

## When to fire this

- "Build / port / roll out this mockup or direction"
- "Make the page match the design"
- "Apply the critique" / "fix the findings on this page"
- Any redraw of an existing surface against a source that renders
- Whenever a CSS change is about to be reported as done on the strength of the
  source rather than the render

## What this skill does NOT do

- Choose visual direction — that is `impeccable` and Keith.
- Approve copy — a ported page carrying copy goes through
  `/compliance-preflight`, and reproducing existing copy into an artefact is
  **transcription**: sampling it invites inventing the rest.
- Change the design system's rulings. If the port needs a token re-ruled,
  surface it; a token value change is a `/decision-sweep` trigger (carrier
  class 8).
