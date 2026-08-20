---
name: supabase-postgres-best-practices-extras
description: >
  Constraint-authoring and constraint-TESTING rules that pair with the
  vendor-maintained supabase-postgres-best-practices skill. Use alongside it
  whenever you write, change, or verify a CHECK constraint, a trigger guard, or
  any predicate whose job is to REFUSE a state, and whenever you run SQL against
  a live database in order to test something. Owns three failures the upstream
  rules do not cover: a CHECK that evaluates to NULL admits the row it exists to
  refuse, a negative test that accepts any error reports its own broken setup as
  a pass, and a DO block with exception handlers reads as a dry run while
  committing like a write.
---

# Postgres constraint authoring and testing — the local delta

Pairs with `supabase-postgres-best-practices`, which is vendor-maintained
(`supabase/agent-skills`, upstream GitHub) and gets overwritten on update. These
three rules live here so they survive that. Read the upstream skill first; this
file adds only what it does not carry.

All three share one shape: **a guard that cannot fail, and a test that cannot
tell the difference.**

## 1. A CHECK whose expression can evaluate to NULL admits the row it exists to refuse

In three-valued logic a constraint passes unless it evaluates to **false**, so a
predicate returning NULL lets the row through. Inside a multi-branch CHECK, every
comparison against a **nullable** column must use `is [not] distinct from`, never
`=` or `<>`.

```sql
-- WRONG: if approved_by is NULL this branch is NULL, not false, and the row is admitted
check ( status <> 'approved' or approved_by <> '' )

-- RIGHT: null-safe, so the branch can actually return false
check ( status is distinct from 'approved' or approved_by is not distinct from null )
```

`=` and `<>` look interchangeable with the null-safe forms and differ **precisely
on the row the constraint was written for**. Which gives the test rule below its
teeth: a constraint that forbids a specific combination is not verified until
that exact combination has been attempted and refused.

**A guard that cannot evaluate to false cannot refuse anything.** Any predicate
written to forbid a state must be tested by attempting that state, because a
predicate returning NULL for it is indistinguishable, by reading, from one
returning false. (Observation 321.)

## 2. "It threw" is not "it refused"

A negative test that treats **any** error as the expected refusal passes when its
own setup fails. So a negative test must:

1. **assert its own preconditions actually took effect** before making the
   attempt (the row exists, the column holds what you think, the prior statement
   committed); and
2. **match the specific expected failure** — the constraint name, or the error
   code and message — never merely "an error happened".

The failure direction is what makes this bad: it yields a **false pass on the
control that matters most**, and it does so most often against a brand-new
object, which is exactly when the setup is unfamiliar and most likely to be
wrong. A test that cannot distinguish the error it wants from the errors it does
not want reports its own broken setup as the behaviour it was written to confirm,
and reports it most confidently on the newest, least-understood code.
(Observation 325; same family as 321 and 251 — a check whose input step can fail
quietly inherits that failure as a wrong answer.)

## 3. A DO block with exception handlers reads as a dry run and commits like a write

**Error handling is not isolation, and it reads like isolation.** A construct that
catches failures gives a strong impression of being safe to run while saying
nothing whatever about what its **successes** do.

Any block that writes in order to test something must be wrapped in an explicit
transaction and rolled back, and the rollback **verified by re-reading the
affected tables** rather than assumed from the shape of the code:

```sql
begin;
  -- create a temp table first, so results survive as ROWS
  create temp table _probe(step text, ok boolean) on commit drop;
  -- ... the attempts, recording into _probe ...
  select * from _probe;          -- read the results BEFORE the rollback
rollback;
-- then re-read the real tables to confirm nothing persisted
```

Return results as **rows**, not as notices: notices are frequently swallowed by
the transport, and a test whose output is invisible gets re-run, more dangerously
each time. And when writing the test, **name the containment mechanism** —
"contained by an explicit `begin; … rollback;`, verified by re-reading `x`" —
rather than "this catches errors". (Observation 279.)

## When to fire this

Alongside `supabase-postgres-best-practices`, whenever the work involves writing
or changing a CHECK constraint or trigger guard, proving that a gate refuses what
it should, or running any write-shaped SQL against a live database to find
something out.
