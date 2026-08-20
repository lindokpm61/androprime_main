---
name: artifact-design-extras
description: >
  Composition and revision rules that pair with the built-in artifact-design
  skill. Use alongside it when building or updating a published Artifact page,
  especially one with a severity-coloured table, status board or gate list, and
  ALWAYS before updating an artifact published in an earlier session. Owns two
  failures the built-in guidance does not cover: semantic colour is
  compositional and can cancel itself on the highest-severity row, and a
  rendered page is a lossy projection that cannot be safely revised without its
  source file.
---

# artifact-design-extras

**Delta skill.** The built-in `artifact-design` skill is system-owned and cannot
be edited here, so this file carries only the additions this project has paid
for. It replaces nothing: load the built-in skill as normal for design direction
and page fundamentals, and apply this on top.

**Created by Keith Antony / Andro Prime.** Client-agnostic in substance, but
**not currently published** — route methodology feedback to the author directly
rather than to a public repository.

---

## Rule 1 — Semantic colour is compositional, not atomic

**A semantic surface and a semantic chip of the same severity must not be
layered.** When a row is tinted with a severity, chips of that same severity
sitting on the row must invert to a solid fill.

A gate board tinted its two urgent rows with the semantic "bad" background and
put a "bad" pill in each row's due-date column. Both drew from the same token
pair, so **on exactly the two rows that carried a deadline the pill lost its chip
form and rendered as bare coloured text.** The markup was correct. Every token
was correct. The composition destroyed the strongest signal on the page.

Note where the damage lands: **on the highest-severity element, which is the one
that most needed to be seen.** A token that reads correctly in isolation can
cancel itself when the same severity is applied to both a surface and the mark on
top of it, so severity has to keep working when two levels of it stack.

It was invisible in source and obvious in a screenshot, which is the whole
argument for Rule 3.

## Rule 2 — The source file IS the artifact

**A page whose source is not stored somewhere durable can be redeployed but not
safely revised.**

The documented way to read a published artifact converts it to markdown and
answers a prompt over it. That cannot return the original HTML, so rebuilding an
update from it silently discards whatever the projection could not carry — in one
case a hand-built diagram and a mockup. What made an update safe was finding the
original source file in a previous session's scratchpad and editing that.

Two consequences:

- **Write the source into the project, not a session-scoped scratchpad**, whenever
  the artifact is a deliverable someone will want changed later. A scratchpad is
  the wrong home for anything with a revision future.
- **Reframe the fetch step as a conflict check, not a content read.** Running it
  is still worth doing — it proved the published version matched the local source,
  so no other session's edits were about to be overwritten. That is a genuinely
  useful thing to learn, and it is not the thing the step looks like it is for.

**A rendered page is a lossy projection of its source.** Any workflow that
updates published output has to keep the source, or every later revision is a
rewrite that quietly drops what the projection could not represent.

## Rule 3 — Verify in the whole document, and at a resolution that resolves the defect

Both of the above were caught by looking, not by reading source. The general
forms live in the repo principles and are load-bearing here:

- **Verify a new section IN the whole document, never as an extracted fragment.**
  A fragment render proves the markup and proves nothing about reachability or
  ordering. A section verified this way rendered perfectly and sat 8,686px down a
  13,225px page with no navigation; the reader reasonably concluded it was
  absent. Locate the element in the rendered page and report its position as a
  fraction of document height — below roughly half is a finding to act on, not a
  detail. For any document that accumulates sections over time, add a contents
  list once it passes a handful, marking open items distinctly from record.
- **Match inspection resolution to the smallest feature the check must resolve.**
  Say what that feature is before choosing the view.

See `andro-prime/12_operations/cross-cutting-principles.md` P2 for both in full.

---

## Rule 4 — The favicon is required, must not change, and cannot be read back

The Artifact tool requires `favicon` on every publish, tells you to keep it
**stable** across redeploys because users find their tab by its icon, and exposes
**no way to read the current one**. Not in `action: "list"`, not in the publish
result, not in a fetch of the page. So on any cross-session update, you are being
asked to preserve a value you cannot observe.

**A field that is required, must not change, and cannot be read back is
unsatisfiable by anyone who did not write it.** Any API asking a caller to
preserve a value must give the caller a way to fetch it; otherwise "keep it
stable" is advice only the original author can follow, and everyone else is
guessing under an instruction not to. Note that `capabilities` and `contract`
already solve this correctly on the same tool: omit the field and the stored
value carries forward.

Until the tool surfaces the stored favicon, or makes it optional on an update
that passes `url`, the handling is:

1. On a redeploy of an artifact **this session** published, reuse the emoji you
   passed the first time. That is readable, because it is in the transcript.
2. On a **cross-session** update, do not guess silently. **Ask the user what the
   favicon was**, or state explicitly in the report that the icon may have
   changed and name what you passed.
3. Never treat a redeploy with a guessed favicon as a no-op. A silently changed
   tab icon reads to the user as a different page.

**A rule to "keep X the same" is only enforceable if X is readable.** Where a
system requires a value on every write, stores it, and never exposes it for
reading, it has made its own consistency rule impossible to follow, and the cost
lands on whoever inherits the object. (Observations 310 and 318, the same defect
recorded twice from opposite ends.)

## Pre-flight — before publishing or updating an artifact page

1. **Severity stack check.** List every place a semantic token is applied to a
   surface, and every place one is applied to a mark. Where the same severity
   appears in both on the same row, the mark inverts to solid fill.
2. **Source durability check.** Is the source file somewhere that outlives this
   session? If it is in a scratchpad and the page is a deliverable, move it into
   the project before publishing.
3. **Updating an existing artifact?** Locate the original source file FIRST. If
   it cannot be found, say so and stop rather than rebuilding from the rendered
   page — the rebuild is the failure in Rule 2, and it presents as a successful
   publish.
4. **Screenshot the whole page**, not a fragment, and report where any new
   section lands as a fraction of document height.
5. **Favicon on a cross-session update?** You cannot read the stored one. Either
   ask the user what it was, or state in the report what you passed and that the
   icon may have changed. Never let a silent icon change ride along inside an
   otherwise unrelated redeploy.

---

**Distilled from:** Observations 229, 230, 310 and 318, with 205 and 213 carried
by P2.
