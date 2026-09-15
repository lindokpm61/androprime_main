# Result-driven retest cadence: the result picks the interval, not the mechanism

**Status:** 🟢 **THE CLINICAL INPUTS LANDED 2026-09-15, AND SO DID EVERY DESIGN BLOCKER BEHIND
THEM. The proposal itself is still unbuilt, and is now unblocked rather than waiting on anyone.** Ewa answered all five questions of the cadence packet (`1: A 2: A 3: A 4: C 5: A`,
direct written reply 20:18 UTC, compliance record **CA-047**). **Section 4's reduction rule was
REJECTED and is rewritten below.** A second packet the same evening (`1: A 2: A 3: B 4: B 5: A 6: A
7: A 8: A`, 21:33 UTC) closed the rest, so **every row in the 2026-07-17 table is now ruled** and
the map can be built with real values instead of arriving inert.

⚠ **"No code has changed" stopped being true on 2026-09-15.** No flag has moved and the map is
still unwritten, but three files shipped: `lib/results/retestCadence.ts` (the six rule kinds and the
seasonal resolver, imported by nothing but its test), and 🔴 **`classifier.ts` +
`retestGuidance.ts`, which DID change live behaviour** — result-level CA-014 suppressed 16 retest
purchase links across 6 fixtures. See §4.

✅ **FULLY RULED WAS NOT BUILDABLE, AND NOW IT IS.** Two of round 2's answers changed the map's
SHAPE: `shbg-low`
and `shbg-high` moved off the `maintenance` kind onto `recheck` (§3), and `normal-vitamin-d`'s
seasonal ruling **had no kind at all** and needed a fifth one (§3). ✅ **The fifth kind was designed
and built on 2026-09-15**: `2026-09-15-seasonal-retest-rule-kind.md`. ✅ **The two signed states that had no row in that table
(T > 29 nmol/L, vitamin D > 250 nmol/L) were rowed on 2026-09-15.** ✅ **And a third state neither document
ever listed — `fai-reported` — was found and rowed the same day, as the sixth kind, `none`.**
The map is now complete over the union: 30 states, 30 rows. See §9.
**Raised by:** Keith, 2026-09-06: *"a retest can be fired at any time based on the results.
If testosterone is low, a recheck can be fired within days as opposed to weeks or months."*
**Owner workspace:** `04_products/results-engine`.
📐 **THE BUILD INPUT IS `2026-09-15-retest-cadence-by-rule-kind.md`.** Every cell of the map this
document proposes is now signed, and that file is the signed map **keyed by rule kind**, with its
build checklist. Read it before writing any of the code below. The 2026-07-17 table remains the
sign-off record; its bucket headings are presentational and **no longer match the rule kinds**.

**Depends on:** `retest-mechanism-map.md` (what the eight mechanisms do today),
`2026-07-17-retest-cadence-table.md` (the clinical intervals, ✅ **fully signed 2026-09-15**, 28
rows plus one derived report-only row).
**Decisions needed:** ✅ **none. All five §9 rows are closed as of 2026-09-15**, and so are all four
build-checklist blockers in `2026-09-15-retest-cadence-by-rule-kind.md` §5. 🔴 **What remains is the
BUILD** — checklist items 4 to 6 — plus two things owed elsewhere and neither of them cadence:
the **3f wording** (Ewa; the flagged cohort has an interval but no sentence) and **3c**, whether the
member retest-due email exists at all (Keith). Both tracked in `retest-mechanism-map.md` §6.

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

This is the clinically load-bearing part. **Six kinds as built, not the four proposed here** —
`seasonal` (§ below) and `none` (`fai-reported`, report-only) were both added 2026-09-15. The
authoritative list is `2026-09-15-retest-cadence-by-rule-kind.md` §2; this table is the design
argument for why a rule cannot be a single number.

| Kind | Means | Shape | Example states |
|---|---|---|---|
| `confirm` | Fast confirmatory recheck, measured in days | `{ days: n }` | The three sub-12 testosterone bands (Ewa, 2026-07-26, n = 0). ~~The only signed cell today.~~ **No longer the only one: 21 cells signed 2026-09-15, CA-047.** |
| `recheck` | Acting on a finding, retest to see whether it moved | `{ days: n }` | `low-vitamin-d`, `low-b12` |
| `maintenance` | Nothing to fix, long window | `{ fromMonths, toMonths }` | ~~Every in-range state~~ **CORRECTED 2026-09-15: NOT every in-range state.** `shbg-low` and `shbg-high` are in range and Ewa ruled both at **3 months**, which is a `recheck`. The bucket heading in the 2026-07-17 table is presentational; the KIND is what this map stores, and for those two they disagree |
| ✅ `seasonal` | **DESIGNED AND BUILT 2026-09-15.** Retest against a time of year rather than an elapsed interval | `{ window, minGapDays: 90, minSpanDays: 30 }`, resolving to a sampling WINDOW against the result date | `normal-vitamin-d`. Ewa ruled 2026-09-15 (Q5 = A) that it stays *"retest heading into autumn or winter"*, which is what the card has said for months. `2026-09-15-seasonal-retest-rule-kind.md`; `lib/results/retestCadence.ts`. It is the only kind that can **fail to resolve** (a null anchor date has no answer), and it fails loudly rather than falling back to `clinician-led` |
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

> 🔴 **RULED 2026-09-15 (Ewa). RULE 1 IS REJECTED.** She took option (c) — the deficiency
> schedules normally — over (a) as proposed and (b) suppress-but-keep-the-guidance. Evidence:
> direct written reply from `ewalindo@live.co.uk`, 2026-09-15 20:18 UTC, Q4 = C. Compliance
> record **CA-047**.

**The rule as proposed, struck so the change is visible:**

1. ~~If any state is `clinician-led`, **the automated retest is suppressed**, EXCEPT~~
   **REJECTED 2026-09-15 by Ewa.**
2. a `confirm` rule always wins and is never suppressed, then
3. otherwise the **shortest interval wins**.

Rule 1 was the anti-upsell guard: a man being sent to a doctor should not simultaneously be
scheduled a kit. Rule 2 is the low-T carve-out from section 3. Rule 3 is ordinary
worst-marker-drives-the-date logic.

### ✅ The reduction rule as SIGNED

**Cadence is decided per marker, never per panel.** A `clinician-led` marker contributes no date
and suppresses nothing.

1. A `clinician-led` state yields **no date for that marker**, and does not affect any other.
2. A `confirm` rule always wins and is never suppressed. *(Unchanged.)*
3. The whole-result date is the **shortest interval among the states that have one**. If no state
   has one, there is no date.

Ewa's reasoning, verbatim from the option she chose: *"The two markers are unrelated and the GP
referral does not conflict with it."* Her Q3 answer pairs with this: GP-routed markers get **no
Andro Prime interval at all**, and the card shows the referral rather than a retest date. So the
GP-routed marker still renders as a referral; it simply stops speaking for the rest of the panel.

🔴 **Two consequences to carry into the build, because rule 1 was load-bearing for something other
than cadence.**

- ✅ **RE-HOMED 2026-09-15 (Keith). The anti-upsell guard has its own rule now.** Re-reading the two
  candidates against her ruling showed **neither reached the case**: the prepaid rule binds only
  sub-90-day rechecks (and `recheck` is 90, and carved out), while CA-014 was being applied per
  **marker** though its own wording is per **result**. Applied at the result level it proved **live,
  not forward-looking — 16 retest links across 6 fixtures**, each on a result carrying a GP
  referral, with the per-card guard passing throughout because a per-item check cannot see a
  per-collection rule. Now `resultMayCarryRetestOffer()` in `lib/results/retestGuidance.ts`,
  enforced in `classify()`. ✅ The retest **interval** survives and ✅ complement cross-sells survive.
  Recorded in `../../03_compliance/CONTEXT.md`.
- ✅ **SETTLED 2026-09-15 (Keith). Bucket B is scoped OUT of the prepaid rule, and the stored value
  is `{ days: 90 }` rather than "3 months".** Full reasoning and the arithmetic:
  `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a and the new third row of its §2.
  ⚠ **Correcting a claim this file made earlier the same day: "3 months is exactly 90 days" is
  wrong.** Three calendar months spans **89 to 92 days** depending on the start date, and 58 of
  1096 start dates across 2026 to 2028 land **under** 90, all of them in late January or February.
  Left as calendar arithmetic, the commercial rule would have applied or not applied according to
  the month the man's blood was drawn. **That is why the cell stores an integer and not a phrase.**
  🔴 **The guard: any proposal to shorten a bucket B cell below 90 days reopens §2a** — "12 weeks"
  is 84 days and crosses back under the threshold silently.

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

> 🔄 **REWRITTEN 2026-09-15. This section was built around one signed cell; there are now 22.**
> The struck text below is kept so the change is visible rather than silent.

**~~Exactly one cell is clinically signed~~ (sub-12 testosterone → 0 days, Ewa 2026-07-26).**
**As of 2026-09-15, EVERY ROW IN THE 2026-07-17 TABLE IS RULED** (CA-047, two rounds), plus the CRP
joints = yes branch. The 6-to-12-month maintenance window, which ~~has never had a clinical
signature~~ and was only *agreed* in the business sense, **is now clinically signed**.

🔴 **Nothing is unsigned any more, so the inert-by-default safety net is gone. What remains is
STRUCTURAL, and it is worse than an unsigned cell because it looks finished:**

- ✅ **CLOSED 2026-09-15. `normal-vitamin-d` had a ruling no kind could hold.** Seasonal, per Q5.
  It would have fallen through to `clinician-led` and **shown a man no date on a perfectly normal
  result** — a silent wrong answer rather than a visible gap. The fifth kind now exists and the
  fallthrough is gone: `2026-09-15-seasonal-retest-rule-kind.md`.
- **`shbg-low` and `shbg-high` carry `recheck` rules while sitting in the table's bucket C.** Read
  the kind, never the bucket heading.
- **T > 29 nmol/L and vitamin D > 250 nmol/L are signed but have no row**, so the `Record` cannot
  be exhaustive, which is the whole point of choosing a `Record`. ✅ **Both rows added 2026-09-15**,
  and ⚠ **a third state missing from BOTH documents — `fai-reported` — was found and rowed the same
  day** (the sixth kind, `none`). **30 states, 30 rows**, now asserted on every build.

**The map can now ship with every cell populated.** That is the opposite of the original plan and
it is why §7's old safety argument no longer applies: there is no longer a set of unsigned cells
whose inertness makes the build a no-op.

⚠ **What changed on 2026-09-15 is that the map no longer arrives fully dark.** It arrives with
most of its behaviour live, so "building it changes nothing observable" is no longer true and must
not be relied on as a safety property. **The build now needs its own verification that each signed
cell does what the table says**, because shipping it will move real dates.

**The build was never blocked on Ewa, and still is not.** What has changed is that the behaviour
is largely unblocked too.

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
| 3 | ~~**The reduction ordering** (section 4): GP suppression versus shortest interval, and the low-T carve-out~~ ✅ **RULED 2026-09-15 (Ewa, Q4 = C). Suppression REJECTED; cadence is per marker, never per panel.** Section 4 rewritten. **New work this creates:** the anti-upsell guard rule 1 was carrying now rests solely on the prepaid rule + CA-014, and 3 months sits exactly on the 90-day boundary | Closed; two follow-ons opened | — |
| 4 | ~~Fill the map cell by cell~~ ✅ **DONE 2026-09-15. EVERY CELL IS RULED**, in two rounds (21 in the first, the remaining 5 plus the joints branch in the second, both replies matching their expected answer counts exactly) | **Ewa** | ✅ **Closed, and so are both of the things that blocked the build behind it. Neither was hers.** (1) `normal-vitamin-d`'s seasonal ruling now has a shape, `2026-09-15-seasonal-retest-rule-kind.md`. (2) The **two signed states now have rows** in the 2026-07-17 table (T > 29, vitamin D > 250, added 2026-09-15 under round 1's Q3), so those two no longer block it. ✅ **`fai-reported` was then found missing from BOTH documents and rowed the same day as the sixth kind, `none`** — derived from ruling 8, not signed as cadence. 🔴 **One thing is left and it is not a clinical input:** the anti-upsell guard that Q4 = C unhomed still needs re-homing |
| 5 | ~~Rewrite the 2026-07-17 table's justification before re-sending it~~ ✅ **DONE 2026-09-07, SENT 2026-09-15 19:46 UTC, ANSWERED 20:18 UTC** | Keith | Closed |

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
