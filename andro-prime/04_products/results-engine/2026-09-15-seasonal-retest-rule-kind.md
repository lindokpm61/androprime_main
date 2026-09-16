# The `seasonal` retest rule kind: a time of year, not an elapsed interval

**Decided:** 2026-09-15 · **Owner:** Keith · **Status:** BUILT, and inert
**Closes:** item 1 of the build checklist in `2026-09-15-retest-cadence-by-rule-kind.md` §5,
the one item marked as blocking the whole cadence build.
**Owner workspace:** `04_products/results-engine`.
**Code:** `09_website-app/frontend/lib/results/retestCadence.ts`, with
`scripts/test-retest-cadence-seasonal.ts` wired into `npm test` (44 assertions, after the `none`
kind joined it on 2026-09-15).

**No clinical sign-off is owed by this document.** Ewa's ruling already exists (CA-047 round 2
Q5 = A) and is unchanged by anything here. This gives that ruling a shape the engine can store.
**One number in it is Keith's and is flagged as such: §5.**

---

## 1. What was blocking, in one paragraph

Ewa ruled `normal-vitamin-d` (50-250 nmol/L) at *"retest heading into autumn or winter"*. She was
offered the 6-to-12-month maintenance window that every other in-range marker got, and declined
it, and declined the hybrid. The cadence design has four rule kinds: `confirm` and `recheck` are
`{ days }`, `maintenance` is `{ fromMonths, toMonths }`, `clinician-led` carries no date. **A time
of year is none of those.**

The consequence was not a gap. With four kinds the cell falls through to `clinician-led`, and the
product **shows a man no retest date at all on a perfectly normal vitamin D** — the most common
in-range result the UK produces. A confident wrong answer on the majority case, which is why this
item blocked items 2 and 3 rather than queuing behind them.

---

## 2. The shape

```ts
{ kind: 'seasonal'; window: SeasonalWindow; minGapDays: number; minSpanDays: number }
```

resolved against the date the result landed:

```ts
resolveSeasonal(rule, anchorIso) -> { ok: true; from; to; gapDays; spanDays }
                                  | { ok: false; reason: 'no-anchor' | 'invalid-anchor' }
```

**It returns a window, not a date, and that is load-bearing.** Her ruling constrains **when the
blood is drawn**, not when we prompt. A kit has to be ordered, posted and used on a morning of the
man's choosing, so any mechanism firing off this rule subtracts its own lead time from `from`. The
rule exposes both edges and knows nothing about dispatch: **the clinical fact and the logistics
stay in separate layers**, which is the same separation `retestGuidance.ts` already draws between
the information a man is owed and the offer he is made.

### The window

`UK_VITAMIN_D_SEASON` = **1 October to 31 March**, taken from Ewa's own approved sentence:
*"levels typically fall between October and March even when summer levels are good."* Not from
meteorological autumn, which starts in September and is not what she wrote.

### The algorithm, in one line

> Take the first annual occurrence of the window whose reachable remainder is at least
> `minSpanDays` long, where "reachable" means no earlier than `minGapDays` after the result.
> Clamp **into** that window rather than waiting for the whole of it.

---

## 3. The two guards, and why neither number is invented

### `minGapDays` = 90, inherited from an adopted rule

Without a floor, a result landing on 30 September yields a retest on **1 October, one day later**,
on a normal result. That is a sub-90-day result-triggered recheck, and
`2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §1 forbids it unless it is prepaid or
included. §8 puts it in cadence terms: *"No cell in `RETEST_CADENCE` may carry a sub-90-day
interval for a customer with no prepaid or included entitlement."*

⚠ **`seasonal` is INSIDE that rule, and `recheck` is not.** The carve-out in §2 was granted to the
`recheck` kind **on the substance** — a recheck watches whether an intervention moved a marker,
which is the same species as the seq-04 e5 supplement-effect prompt. A seasonal retest of a
**normal** result is not that. It is a fresh prompt on an in-range number, which is the species §7
of that document already blesses at 6 to 12 months precisely because it sits outside the window.
So the 90 is inherited from a decision Keith already made, not chosen here.

**Swept result: 0 of 1096 anchor dates produce a gap under 90 days.** The prepaid rule is satisfied
by construction rather than by review.

### `minSpanDays` = 30, and 🔴 this one IS Keith's

Without a span floor the reachable remainder of the window collapses as the anchor moves through
autumn. An anchor of 30 December yields a **two-day** sampling window, 30 to 31 March. A mechanism
cannot land a kit in two days, so the opportunity is lost silently and the next one is a year away.

**This is the only number in the design that is neither clinical nor inherited.** It is
operational: the shortest remaining window in which a prompt can still produce a sample. It is
isolated in one named constant, `SEASONAL_MIN_SPAN_DAYS`, so it can move without touching the
shape, and moving it moves one thing and nothing else — see §5.

---

## 4. The discontinuity: it cannot be removed, only placed

**A window is an arc and the year is a circle, so a rule of this shape has exactly one
discontinuity per year.** Swept across all 1096 anchor dates in 2026 to 2028, this design places
it at **2/3 December**:

| Anchor | Sampling window | Gap |
|---|---|---|
| 2 December 2026 | 2 to 31 March 2027 | 90 days |
| 3 December 2026 | 1 October 2027 to 31 March 2028 | 302 days |

**One day of difference in when a man's blood was drawn moves his retest by 212 days**, and there
is no version of this rule without such a day. So the question is not whether to have one but
where to put it, and the answer is clinical:

- **The men on the far side of this cliff were sampled in early winter.** They already hold an
  in-season reading, so the seasonal argument is spent for them and waiting for the next season is
  the right answer rather than a consolation.
- **The unguarded rule puts the cliff at 30 September / 2 October**, where it lands on men with
  **summer** readings: exactly the cohort Ewa's sentence is written for. That placement is the
  defect; this one is the design.

🔴 **This is the same class of defect as `{ days: 90 }` versus "3 months"**
(`2026-09-07-...` §2a, where three calendar months turned out to be 89 to 92 days and 5.3% of start
dates fell the wrong side of a commercial rule). A boundary nobody chose, deciding a man's outcome
by the month his blood happened to be drawn. **It was found the same way, by sweeping every date
rather than checking a few**, and the sweep is now an assertion in the test suite rather than a
paragraph in a document.

---

## 5. What moving `minSpanDays` does, so the choice is visible

| `minSpanDays` | Cliff falls on | Shortest window | Longest gap |
|---|---|---|---|
| 1 (no guard) | 31 Dec / 1 Jan | **1 day** — unusable | 273 days |
| 14 | 18 / 19 Dec | 14 days | 286 days |
| **30 (chosen)** | **2 / 3 Dec** | **30 days** | **302 days** |
| 60 | 2 / 3 Nov | 60 days | 332 days |

Every row satisfies the 90-day floor and every row keeps the sampling window inside October to
March. The trade is only ever **how much room a mechanism gets versus how early the cliff bites**,
and 30 was chosen as the smallest span that still leaves a full month to order, receive and use a
kit. ⚠ **Raising it past 60 starts pushing men past the 12-month edge of the maintenance window**,
which breaks the property in §6.

---

## 6. The safety property that makes adopting this cheap

`maintenance` is 6 to 12 months, and it is what `normal-vitamin-d` would have been given had Ewa
taken the option she declined. Swept over three years, the seasonal kind produces gaps of
**90 to 302 days**. So:

> ✅ **The seasonal kind can bring a man forward, and can never push him past the window he would
> otherwise have had.** 302 days is inside 12 months; 90 days is earlier than the 6-month near edge.

It is bounded on both sides by rules that already exist: it can tie a `recheck` at 90 days and it
can never be later than `maintenance`. **That is what makes this a safe change rather than a
clinical one** — it moves men earlier within a range already signed, and never later.

---

## 7. Failing loudly, which is the whole point of the kind

🔴 **`seasonal` is the only kind that can fail to resolve.** `recheck` and `maintenance` are
elapsed intervals and mean something without a calendar; a time of year does not. With no anchor
date there is no answer at all.

This is a real runtime state, not a theoretical one: `SingleResult.collectedAt` is `string | null`
and reads `received_at`, which is nullable. So the resolver returns
`{ ok: false, reason: 'no-anchor' }` and **every caller has to handle it**.

Every silent alternative reproduces the defect this kind was created to close — a date anyway, or
"no date", or a quiet fall back to `clinician-led`. **This repo has already paid twice for a
clinical instruction implemented as an omission:** Ewa's FAI ruling ("report-only, do not band it")
became a missing `case` and the default branch told men an out-of-range value was *"within the
normal range"*; and the `BADGES` switch accumulated eight states behind a `default:` until an
all-clear Kit 2 showed four black ACTION NEEDED alarms. **A gap that announces itself is cheap. A
default that answers confidently is what costs.**

---

## 8. What this deliberately does not do

- ~~🔴 **No `RETEST_CADENCE` map**~~ ✅ **BUILT 2026-09-16, in this same file, with checklist items
  4, 5 and 6.** When this document was written, items 2 and 3 blocked it; all four blockers closed
  on 2026-09-15 (the two missing signed rows, the `fai-reported` cell as the sixth kind `none`, and
  the anti-upsell guard re-homed as result-level CA-014).
  ⚠ **The inertness argument this bullet made has now been SPENT, exactly as it predicted.** It
  said shipping the kinds without the map is what keeps the change inert, and that this was the
  last item that could rely on it. The map is still inert today — nothing imports it but its test —
  but it is inert **by an absence of wiring**, not by an absence of signed values, and an absence
  of wiring is one import away from being untrue. That is why the map carries a fixture per signed
  cell instead of an argument. Build record:
  `2026-09-15-retest-cadence-by-rule-kind.md` §6.
  ⚠ **Corrected at wrap, and the correction is the point:** this bullet asserted a blocker that had
  been cleared hours earlier, in a document created the same morning. **Recency is not currency** —
  a doc is stale relative to the last write in its subject area, not to its own creation time.
- 🔴 **No customer-facing sentence, and no copy change.** `biomarker-copy.ts` already carries Ewa's
  approved wording for this state verbatim, and has for months — verified in this session at
  `lib/results/biomarker-copy.ts:162` and `:165`. That is why her answer changes no copy.
  ⚠ **Surfacing the computed window to a customer as a date would be new copy and needs its own
  compliance pre-flight.** The window is for mechanisms, not for the card.
- **No reduction.** `intervalDaysFor` defines what each kind contributes, including that
  `clinician-led` contributes `null` and not `0`. Rule 2 of the signed reduction (`confirm` always
  wins, never suppressed) belongs with the map and waits for it.

---

## 9. What the next person needs to know

1. **Read the KIND, never a bucket heading.** Unchanged from
   `2026-09-15-retest-cadence-by-rule-kind.md`, and `seasonal` makes it sharper: `normal-vitamin-d`
   sits in bucket C, "all-clear / maintenance", and is not a `maintenance` rule.
2. **Every consumer of a rule needs the anchor date.** Seasonal cannot express itself as an
   interval at all without one. This is the first kind that **requires** the result-landing anchor
   rather than merely benefiting from it, which is an independent line arriving at the decision
   `2026-09-07-anchor-everything-to-the-result.md` already made.
3. **Do not re-derive the window from a calendar library or `Date.now()`.** The module is pure and
   date-only in UTC, deliberately; the reasoning about the one-day BST drift is in its header.
4. **If you change `minSpanDays`, re-run the sweep.** The test pins the cliff to December. That
   assertion failing is the design speaking, not the test being brittle.
