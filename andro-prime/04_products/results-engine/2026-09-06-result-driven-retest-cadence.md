# Result-driven retest cadence: the result picks the interval, not the mechanism

**Status:** 🔵 **PROPOSED.** Nothing here is decided, nothing is built, no flag moves.
**Raised by:** Keith, 2026-09-06: *"a retest can be fired at any time based on the results.
If testosterone is low, a recheck can be fired within days as opposed to weeks or months."*
**Owner workspace:** `04_products/results-engine`.
**Depends on:** `retest-mechanism-map.md` (what the eight mechanisms do today),
`2026-07-17-retest-cadence-table.md` (the clinical intervals, **still unsigned**).
**Decisions needed:** two from Keith, one from Ewa. Section 9.

---

## 1. The claim, and the fact that it is already half true

Keith is right, and the useful part is that **one of the eight mechanisms already works this
way**. The Confirmation bundle reads the actual testosterone value when the first result lands
and, below 12 nmol/L (`BORDERLINE_T_FLOOR`), stamps the recheck due **immediately**:
`CONFIRMATION_INTERVAL_DAYS = 0`. **Ewa signed that 0 on 2026-07-26.** At 12 or above the
prepaid kit banks to 6 months instead.

So "days rather than months, when the result warrants it" is not a new idea needing invention.
It is live logic with clinical sign-off, in `lib/bundles/confirmation.ts`.

**The problem is that it is the only one.** The other seven mechanisms pick their interval from
a constant that never looks at the result. Cadence is currently a property of *the mechanism
that happens to be firing* rather than of *the number that came back*, which is backwards, and
it is the root cause of all three defects in `retest-mechanism-map.md`.

---

## 2. The proposal in one line

**One lookup, keyed by result state, that every mechanism reads from.**

```
RETEST_CADENCE: Record<ResultState, RetestRule>
```

Placed beside `BADGES` in `lib/results/resultSeverity.ts`, or as a sibling module importing
`ResultState`.

### Why this exact shape, and not a switch

The codebase already does this twice: `BIOMARKER_COPY` and `BADGES` are both exhaustive
`Record<ResultState, …>` maps. That is deliberate, and `resultSeverity.ts` records why in its
own header. `BADGES` **used to be a switch with a `default:`**. Eight states quietly
accumulated behind that default and five of them mean the result is FINE, so an all-clear Kit 2
rendered four black ACTION NEEDED alarms above Ewa-approved copy saying no action was needed.
Nobody chose that. The default did.

An exhaustive `Record` makes it a **compile-time requirement**: adding a biomarker state to the
union without deciding its retest rule fails the build. For a value that decides whether we post
a man a kit, that is the right level of enforcement. It is also the exact failure this repo has
already paid for once.

---

## 3. The rule cannot be a number

This is the clinically load-bearing part. Four kinds, not one:

| Kind | Means | Shape | Example states |
|---|---|---|---|
| `confirm` | Fast confirmatory recheck, measured in days | `{ days: n }` | The three sub-12 testosterone bands. **The only signed cell today (Ewa, 2026-07-26, n = 0).** |
| `recheck` | Acting on a finding, retest to see whether it moved | `{ days: n }` | `low-vitamin-d`, `low-b12` |
| `maintenance` | Nothing to fix, long window | `{ fromMonths, toMonths }` | Every in-range state |
| `clinician-led` | **No Andro Prime date at all.** The GP directs it | no date | The GP-block set |

### Why `clinician-led` must be an explicit branch

A GP-routed result must not fall through to a number. If "do not schedule this" is expressed as
an omission, it becomes "schedule it like anything else" the moment a default exists, and the
two are indistinguishable in the code. This repo has the scar: an Ewa ruling that FAI was
"report-only, do not band it" was implemented by omitting its `case`, and the default branch
returned copy reading *"within the normal range"* and *"no action is needed"* over a value the
display layer was drawing in red.

**So `clinician-led` returns a deliberately neutral result, and there is no default.**

### The one genuine exception, and why it survives

The sub-12 testosterone bands are GP-routed **and** get a `confirm` rule. That is not a
contradiction: the confirmatory second morning sample is precisely **the thing a GP needs** to
act. We supply it, we do not diagnose. That framing is already the recorded position from the
2026-06-04 low-T routing decision, and it is what makes the immediate recheck defensible rather
than opportunistic.

---

## 4. Nine markers, one date

A Kit 3 result carries nine states and therefore up to nine rules. The customer needs one date.

**Proposed reduction rule:**

1. If any state is `clinician-led`, **the automated retest is suppressed**, EXCEPT
2. a `confirm` rule always wins and is never suppressed, then
3. otherwise the **shortest interval wins**.

Rule 1 is the anti-upsell guard: a man being sent to a doctor should not simultaneously be
scheduled a kit. Rule 2 is the low-T carve-out from section 3. Rule 3 is ordinary
worst-marker-drives-the-date logic.

🔴 **This ordering is a clinical judgement, not a coding one, and it is the single item most
worth Ewa's eye.** It decides what happens to a man with one GP-routed marker and one
correctable deficiency: today he would be scheduled on the deficiency; under rule 1 he would
not be scheduled at all.

---

## 5. It forces the anchor, and that is a feature

A result-driven cadence can only be anchored to **the result landing**. There is no other
moment at which the deciding value exists.

That is the same conclusion the membership anchor recommendation in `01_strategy/STATE.md`
already reached, from a completely different argument (an included month starting at purchase is
30 days of an empty room). **Two independent lines of reasoning converging on the same anchor is
the strongest evidence available that it is the right one.**

> ✅ **DECIDED 2026-09-07 (Keith): "anchor everything to results".** Doc:
> `../../01_strategy/2026-09-07-anchor-everything-to-the-result.md`. This section is satisfied and
> is no longer a dependency. **The anchor was ruled on its own merits, not as a side effect of
> adopting this proposal**, so sections 1 to 4 and 6 to 8 still need their own ruling and the
> proposal as a whole remains PROPOSED.

---

## 6. What it fixes on the way past

- **Defect 3a** (`retest-mechanism-map.md`): the all-clear member gets a 90-day retest the code
  itself calls *"selling a test we do not think he needs"*, because `memberHasMarkerToMove` never
  consults the classifier. Its own comment states the fix: *"replace the body with the
  classifier's verdict over the member's most recent result. Nothing else needs to change."*
  **This lookup is that verdict.** The membership stops needing a cadence rule of its own.
- **A fifth copy of the same fact.** `biomarker-copy.ts` hand-writes intervals into prose per
  marker ("retesting in 6-12 months is worthwhile"). Those become derived from the lookup rather
  than independently maintained, which is the only durable fix for copy drift.
- **The bundle constants** (`BANK_RECHECK_MONTHS`, `SECOND_DISPATCH_DELAY_DAYS`) become defaults
  the lookup can override on a result basis, rather than the whole answer.

It does **not** fix defect 3b (the membership retest is a one-shot). That is a separate build
task and stays open.

---

## 7. Shipping it safely: the map arrives inert

**Exactly one cell is clinically signed** (sub-12 testosterone → 0 days, Ewa 2026-07-26). The
6-to-12-month maintenance window is *agreed* in the business sense, since it is what the
marketing site has said for months and Keith confirmed it on 2026-07-17, but it has never had a
clinical signature. Everything between those two poles is unsigned.

**So the map ships with only the signed and agreed cells populated, and every unsigned cell
returns `clinician-led` or preserves today's behaviour.** Building the mechanism then changes
nothing observable until Ewa fills a cell in, which is the same discipline `MEMBERSHIP_ENABLED`
and `BUNDLES_ENABLED` already use: the machinery lands first, dark, and the clinical decision
turns it on cell by cell rather than all at once.

This also means **the build is not blocked on Ewa.** Only the behaviour is.

---

## 8. The constraint that keeps it honest

A fast recheck fired by a bad result is a repeat purchase triggered by bad news, and that is a
pattern we have already written down as unacceptable. The 2026-07-17 table's own compliance note
says it plainly: *"Still feel bad → buy the same kit again sooner"* reads as manufacturing a
repeat purchase, while *"here is the panel we have not checked, then your GP"* is honest and
ASA-defensible.

The low-T recheck survives that test for two specific reasons: the kit is **prepaid inside the
bundle**, so no new sale is triggered by the bad news, and the sample exists **for a doctor**.

🔴 **Proposed hard rule, and it should be adopted or rejected explicitly rather than assumed:**

> **A recheck at less than 90 days must be prepaid or included in an existing entitlement.
> It may never trigger a new sale.**

✅ **ADOPTED 2026-09-07 (Keith).** Recorded in its own dated file,
`2026-09-07-fast-recheck-must-be-prepaid-or-included.md`, because it was adopted while this
proposal as a whole is still PROPOSED, and a decision that lives only inside another document's
body goes stale unnoticed. That file also scopes it: it governs **result-triggered** rechecks of
an already-tested marker, and deliberately does not touch the complement cross-sell or the
subscription-anchored seq-04 e5 prompt. It enumerates every live CTA and finds **no current
violation**.

That points this whole feature at bundles and the membership rather than at the shop. It costs
revenue in the abstract and it is the version that survives an ASA reading, which is the same
trade the conflict-free position takes everywhere else.

---

## 9. What is owed, and by whom

| # | Item | Owner | Blocks |
|---|---|---|---|
| 1 | ~~**The anchor**: adopt the result landing as the anchor for every retest date (section 5)~~ ✅ **DONE 2026-09-07, adopted as stated.** Superseded by: the timed-bundle fallback when no result ever arrives (`2026-09-07-anchor-everything-to-the-result.md` §5) | Keith | Building the timed-bundle change |
| 2 | ~~**The prepaid-or-included constraint** (section 8): adopt or reject~~ ✅ **ADOPTED 2026-09-07**, `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` | Keith | Nothing. Settled: the feature points at bundles and the membership, never at the shop |
| 3 | **The reduction ordering** (section 4): GP suppression versus shortest interval, and the low-T carve-out | **Ewa** | The whole-result date on any mixed panel |
| 4 | Fill the map cell by cell | **Ewa**, via the 2026-07-17 table | Behaviour only, not the build |
| 5 | Rewrite the 2026-07-17 table's justification before re-sending it | Keith | Item 4 |

**Item 5 is a real prerequisite and not housekeeping.** That table now becomes the document that
fills the lookup, so it moves from nice-to-have to the blocking clinical input. But its section 1
asks Ewa to resolve a three-way copy contradiction **that has since been fixed**, and its section
5 lists work already done. Sent as written, she would be ruling on a state of the world that no
longer exists. See `retest-mechanism-map.md` section 5.

---

## 10. What this does not propose

- It does not change any interval. Every number in the map is either already signed, already
  agreed, or left unsigned and inert.
- It does not change application code. This is a design record.
- It does not touch the membership one-shot defect, the GBP 47 versus GBP 49 model gap, or the
  first-month anchor, all of which are tracked in `retest-mechanism-map.md` and
  `01_strategy/STATE.md`.
