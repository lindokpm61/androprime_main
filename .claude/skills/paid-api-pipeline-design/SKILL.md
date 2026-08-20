---
name: paid-api-pipeline-design
description: >
  Design rules for tools that call a metered or paid API in stages. Use when
  writing, extending or debugging any script that spends money per call — a
  harvest-then-enrich pipeline, a bulk lookup, a sampled probe, a classifier
  scoring results from a paid feed — and whenever a run costs materially more
  than expected, a cached stage reproduces a fixed bug, or a capped run's headline
  count is about to be reported. Owns five failures that all look like ordinary
  output: money sitting upstream of the bugs, price as an unread signal, a cache
  preserving the bugs that filled it, a partial count read as a total, and a
  membership test that fails toward the answer you were hoping for.
---

# paid-api-pipeline-design

Rules for tools that spend money per call. Every one of these produced a
plausible-looking result that was wrong, which is the shared shape: **in a
metered pipeline the expensive failures do not raise errors, they return
numbers.**

**Created by Keith Antony / Andro Prime.** Client-agnostic in substance, but
**not currently published** — route methodology feedback to the author directly
rather than to a public repository. A licence is chosen at publication; until
then treat it as shared privately, not as open source.

---

## Rule 1 — Checkpoint at the cost boundary, not at the end

**In a metered pipeline the probability of a stage failing is roughly inverse to
its cost.** The expensive stage is usually a single well-understood call; the
cheap stages downstream are where the fiddly data handling lives. So **the money
is always upstream of the bugs.**

A harvest stage once completed and paid, then the next stage died because one
harvested value contained a character the following endpoint rejects. The helper
there exited the process on an API error, so the entire paid harvest was
discarded and had to be re-bought to test a one-line fix.

Two things become structural, not optional:

1. **Persist the expensive stage's output to a keyed on-disk cache the moment it
   completes**, before any downstream work runs.
2. **Forbid fatal error handling anywhere downstream of a paid stage.** Errors
   become values, so a partial result is still written.

**Authoring smell test:** *if the last line of this script throws, what did I
just pay for and lose?*

## Rule 2 — Price is an observable side channel on what the API actually did

When spend disagrees with your mental model, **the mental model is what is
wrong**, and the disagreement is usually about a **default: the parameter nobody
passed and everybody assumed.**

A run came back at five times its estimate. The tempting reading is "the estimate
is stale, update it". Measuring the price curve instead — a handful of calls,
balance before and after — showed the endpoint's default depth was ten, not the
hundred the code's comments had assumed for months. That single fact invalidated
far more than the cost line: every rank previously read off that call could only
ever have said "top ten or nothing", and the same parameter also governed how many
result blocks came back, which changed the tool's actual yield.

So: **treat an unexplained cost delta as a behavioural discrepancy to be
diagnosed, never a number to be corrected.** The diagnostic is a parameter sweep
against the billing endpoint, and its output belongs **in the tool as a literal
cost table with its measurement date**, so the next author inherits the
measurement rather than the assumption.

A delta in the cheap direction gets the same treatment. It also means the call did
something other than what you modelled.

## Rule 3 — A cache preserves the bugs of the code that filled it

Any transform applied only on the way IN will, after the first cache hit, be
silently absent. The symptom appears at the point of use, long after the fix that
was supposed to prevent it.

A sanitiser bug was fixed on the write path. The next run reused a cache written
by the buggy version and reproduced the identical failure, which read as *"the fix
did not work"* rather than *"the fix did not reach this data"*. Two runs were
burned before anyone looked at the cache.

**A cache turns every write-path transform into a version boundary.** Either:

- **apply the normalisation again on read** (usually cheaper, and self-healing for
  old cache files), or
- **stamp the cache with the transform's version and invalidate on mismatch.**

Prefer the read path. It fixes files already on disk.

## Rule 4 — Bind the denominator into the figure, not into a caveat beside it

**A partial result and a complete one are indistinguishable once the number is
separated from its denominator, and every retelling separates them further.**

A discovery tool probed the cheapest 40 of about 160 eligible candidates (a
default spend cap) and reported "32 qualified", with a warning that the unprobed
rows were "not a rejection". It was still read as *"there are only a handful of
viable targets left"*. Probing the remainder cost cents and found roughly three
times as many again, at an undecayed hit rate. The write-up then compounded it by
showing the four best rows without saying they were a sample of 32.

The caveat was present and correct. It did not help, because **caveats do not
survive being quoted, summarised or skim-read, and the number is the thing that
gets acted on.**

- Headline: **"32 of 40 tested, 123 untested"**, never "32 qualified" plus a note.
- Where a hit rate on the tested portion is known, **project it explicitly**:
  "~80% of the tested set qualified; the remaining 123 are unmeasured". Leaving
  the reader to do that arithmetic is what produces the wrong ceiling.
- **Every excerpt carries its own denominator:** "four of the 32", never a bare
  four.

## Rule 5 — A membership test inherits its default from whichever class you enumerated

And **you always enumerate the closed one**, because that is the one you can
finish typing.

A reachability classifier decided "can we compete with this domain?" by testing
membership of a hand-typed list of about thirty authority domains. Anything absent
counted as beatable. It scored a national broadcaster, a university medical
publisher, a national insurer and two high-street pharmacy chains as "sites our
size", and reported roughly 2.6 times as many winnable targets as a measured check
gives. The failure is invisible in the output: an inflated count looks exactly
like a real one, and it was quoted twice before anything contradicted it.

So, before shipping any list-based classifier:

1. **Ask which way the unknown case falls.** If that direction is also the answer
   the user is hoping for, the classifier will confirm the hope **at exactly the
   rate the list is incomplete.**
2. **Where the negative class is open-ended, do not enumerate it.** Score against
   a *measurable property* instead — one bulk call for the whole run is usually
   enough — and make the ambiguous case fall to the **conservative** side.
3. Watch the interaction with Rule 2's defaults: an entity with no measurable
   local profile can read as zero, which is why the ambiguous case must not
   default to weak.
4. **Where an allowlist genuinely must remain, it is a floor**, and the tool says
   so *at the point of output*, not in a comment.

## Enforcement — run this, do not just read the rules

```bash
node .claude/skills/paid-api-pipeline-design/budget-check.js <run-record.json>
```

Record shape (the last four are optional; omit them for an uncapped run):

```json
{ "stage": "probe", "expectedUnitCost": 0.002, "expectedCalls": 50,
  "actualCost": 0.50, "eligible": 200, "tested": 50, "qualified": 40,
  "headline": "40 qualified" }
```

That record is the shape of the failure, and it fails: 5x the estimate, and a
headline of "40 qualified" on a run that tested 50 of 200.

It enforces Rules 2 and 4: it fails a run whose spend is materially off the
estimate (default tolerance 1.5x, override with `tolerance`) and a capped run
whose headline is not bound to its denominator — and it **emits the corrected
headline** so the fix is a copy-paste. Exit **0** clean, **2** at least one HARD,
**1** could not run, which is never a pass.

Verified in both directions before shipping: exit 2 on the real run record that
produced Rules 2 and 4, catching both defects; exit 0 on a clean run and on a
capped run whose headline IS bound; exit 1 on a malformed record.

Rules 1, 3 and 5 are design-time and cannot be checked from a run record. They are
the pre-flight below.

## Pre-flight — before the first paid run of any new or changed pipeline

1. **If the last line throws, what did I just pay for and lose?** If the answer is
   "the expensive stage", checkpoint it to disk first.
2. **Is there any fatal error path downstream of a paid stage?** Convert it to a
   value.
3. **Does anything read from a cache that a transform also writes to?** If so, the
   transform runs on read too, or the cache is version-stamped.
4. **Is this run capped, sampled or truncated?** If yes, the headline carries the
   denominator before anyone sees it.
5. **Does any classifier here test membership of a hand-written list?** If yes,
   name which way an unknown falls, and check that it is not the hoped-for answer.
6. **Is there a measured cost table in the tool, with a date?** If not, measure it
   on the first run and write it in.

## When to fire this

Writing or extending any tool that spends per call. Debugging a run that cost more
than expected, or one where a fix "did not work". Reporting any count that came
out of a capped or sampled process. Reviewing a classifier that scores results from
a paid feed.
