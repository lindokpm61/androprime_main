---
name: artifact-capabilities-extras
description: >
  Connector-calling rules that pair with the built-in artifact-capabilities
  skill. Use alongside it whenever a published Artifact page will call an MCP
  connector at runtime — a dashboard reading live data, a page that watches a
  tool, anything using window.claude.* against a server. Owns two failures the
  built-in guidance does not cover: the connector name is a DIFFERENT STRING in
  the manifest and in the call, and the convenience result field is a derived
  field that can silently fail to derive. Both render as empty data rather than
  as an error.
---

# artifact-capabilities-extras

**Delta skill.** The built-in `artifact-capabilities` skill is system-owned and
cannot be edited here, so this file carries only the additions this project has
paid for. It replaces nothing: load the built-in skill as normal — it remains
the authority on which capabilities exist and what the current contract is — and
apply this on top when writing the calling code.

**Created by Keith Antony / Andro Prime.** Client-agnostic in substance, but
**not currently published** — route methodology feedback to the author directly
rather than to a public repository.

---

## Rule 1 — The manifest name and the call-time name are different strings

A page declares its connector in the manifest and then names it again at call
time, and **the two require different forms of the name.** The manifest takes a
tool-prefix segment that the platform resolves to a display name at publish; the
runtime call takes the display name itself, which is a **per-viewer fact and
therefore unknowable when the page is written.**

Using the manifest string for both is the natural mistake, because the same
identifier appears to name the same thing.

**Do not hardcode the call-time name. Discover it at runtime.** The standard
preamble:

1. List the available tools.
2. Find the connector actually offering the tool you want.
3. Use its exact `server` value from that listing.
4. Read the tool's `readOnlyHint` in the same pass — a watch-style call refuses
   tools annotated as writes, and finding that out later costs another
   round-trip.

**Where a name is declared in one place and used in another, check whether the
two require the same form. A platform that resolves names at publish time has,
by definition, two forms.**

## Rule 2 — Read the authoritative field, not only the derived one

The result envelope offers a convenience accessor for the response body. Its own
specification reads roughly: *structured output when present, else the first text
block parsed as JSON when it parses, else that text verbatim.* **That definition
contains two conditionals, so it is a derivation that can degrade or be absent** —
while the authoritative content blocks are always there.

A dashboard that read only the convenience field reported "unreadable response"
on every section. The connector wrapped its JSON in explanatory prose and a
guarded envelope, the derivation had nothing clean to hand back, and the page
concluded the response was unreadable while the data sat untouched one field
away.

What made this easy to get wrong is the surrounding advice to use the convenience
field *instead of digging through* the blocks — good ergonomics for the common
case, and a trap for the uncommon one.

So: **try the structured field, then the convenience field, then the raw blocks**,
and treat failure of all three as a real error worth reporting in detail.

**A field whose specification includes the words "when present" and "when it
parses" will sometimes be neither, and code that reads only it inherits every one
of those conditionals as a silent failure mode.**

## Rule 3 — An unknown must never render as a zero

Both failures above surfaced as a **blank or zero dashboard rather than an
error**, because the page treated an empty result as a legitimate nought. Two
independent weaknesses had to line up: a wrong identifier, and a renderer that
could not distinguish "no data arrived" from "the measured value is zero".

**A zero is a claim about the world.** A display that cannot tell absence from
zero converts every fetch failure into a confident false statement, which is
worse than an error, because nobody investigates a number.

Render three distinct states — loaded, empty-and-confirmed, and failed — and make
the failed state say what actually arrived.

---

## Pre-flight — before publishing any connector-backed page

1. **Is the call-time server name discovered rather than hardcoded?** Grep the
   page source for the manifest's server string appearing inside a runtime call.
   A literal match between the two is the bug in Rule 1.
2. **Does every read path fall back?** Structured → convenience → raw blocks, in
   that order, with the final failure branch printing the shape it received. A
   generic "could not parse" forces the next person to guess too.
3. **Does any numeric tile render `0` when the fetch failed?** If absence and
   zero share a rendering, fix that before shipping.
4. **Test the parser without the host.** Shape-handling is the testable part:
   extract the reader and run it against the plausible envelopes — a bare
   structured result, prose wrapping JSON, and a guarded envelope. For any
   response whose shape you did not observe in the authoring session, write the
   reader defensively.

---

**Distilled from:** Observations 67 and 68.

**Related:** `andro-prime/12_operations/cross-cutting-principles.md` — P15 (a
negative result is a claim about your query, not about the world) is the general
form of Rule 3, and P16 covers the fallback-testing habit in Rule 4.
