# RETEST_CADENCE: the signed map, keyed by rule kind

**Status:** ✅ **Every cell below is clinically signed.** CA-047, Ewa, 2026-09-15, in two rounds.
✅ **AND BUILT, 2026-09-16** — `RETEST_CADENCE` in `lib/results/retestCadence.ts`, checklist items 4,
5 and 6 closed, 117 assertions in `npm test`. 🔴 **Nothing reads it yet**, so no date has moved for
any customer. See §6.
**Owner workspace:** `04_products/results-engine`. **Business sign-off:** Keith, 2026-09-15.
**This document decides nothing.** It is the same rulings as `2026-07-17-retest-cadence-table.md`,
re-projected into the shape the code actually stores. Where the two disagree on presentation, this
one is the build input and that one is the sign-off record.

---

## 1. Why this projection exists, and why the other table cannot be read directly

The sign-off table groups states into three **buckets** (clinician-managed, acting on a finding,
all-clear). That grouping is how the questions were put to Ewa and it is how she answered, so it is
the right shape for a sign-off record and the wrong shape for a lookup.

🔴 **After round 2 the buckets and the rule kinds no longer agree, and a build that reads the
bucket headings will produce wrong cadences.** Two in-range states that sit in bucket C came back
at 3 months, which is a `recheck`, not a `maintenance` window. One more came back seasonal, which
was not a kind at all until 2026-09-15 and is now the fifth one (§2).

**So: read the KIND column here. Never infer a kind from a bucket heading.**

---

## 2. The map

### `clinician-led` — no Andro Prime date at all. 10 states

Ewa, round 1 Q3 = A: *"No Andro Prime retest interval at all. The GP directs the timing, and our
card shows the referral rather than a retest date."*

| Result state | Band | Rowed in the sign-off table? |
|---|---|---|
| `severely-low-testosterone` | T < 5.2 nmol/L | yes |
| `low-testosterone` | T 5.2–8 | yes |
| `equivocal-testosterone` | T 8–12 | yes |
| `critically-low-vitamin-d` | < 25 nmol/L | yes |
| `high-crp` | > 10 mg/L | yes |
| `low-ferritin` | < 30 µg/L | yes |
| `high-ferritin` | > 300 µg/L | yes |
| `low-albumin` | < 35 g/L | yes |
| `high-testosterone` | T > 29 | ✅ **row added 2026-09-15** |
| `high-vitamin-d` | > 250 nmol/L | ✅ **row added 2026-09-15** |

✅ **The last two were signed and had no row in the sign-off table. Both rows now exist.** Ewa's
round 1 Q3 enumerated them; the table's bucket A was written before the 2026-08-07 upper bands
existed and never gained them. They are in `thresholds.md`. The rows were needed because a `Record`
missing two members of its key union will not compile, which is the entire reason that shape was
chosen.

**Verified at the primary source rather than inferred**, because a sign-off must never be read off
an adjacent answer. The Q3 question as sent (Gmail `1a0a69ae55223fe0`, 19:46 UTC) lists the
GP-routed bands and **ends with "testosterone above 29 nmol/L, vitamin D above 250 nmol/L"**. She
was shown both and answered **A**, and their GP routing was separately signed on 2026-08-07
(CA-044). ⚠ **Her answer covered ten states; the table offered eight rows.** The gap was in the
table, not the ruling — which is why closing it needed no new ask.

🔴 **Their card COPY is a different gate and it is still shut.** `biomarker-copy.ts:81` and `:170`
both carry `NOT APPROVED` markers and have rendered to customers since 2026-08-07 (CA-044 §2
item A), re-verified 2026-09-15. **A `clinician-led` cell carries no date and no copy, so the
cadence is unaffected** — but nobody should read "row added" as "these two cards are clear".

### `confirm` — fast confirmatory recheck, in days. 3 states, and they are ALSO clinician-led

| Result state | Rule | Signed |
|---|---|---|
| `severely-low-testosterone` | `{ days: 0 }` | Ewa, **2026-07-26** |
| `low-testosterone` | `{ days: 0 }` | Ewa, 2026-07-26 |
| `equivocal-testosterone` | `{ days: 0 }` | Ewa, 2026-07-26 |

⚠ **These three carry two rules at once and that is deliberate, not a conflict.** They are
GP-routed **and** get an immediate confirmatory recheck, because the confirmatory second morning
sample is precisely the thing a GP needs in order to act. We supply it; we do not diagnose. The
recheck is **prepaid inside the Confirmation bundle**, so no sale is triggered by the bad news.

**In the reduction, `confirm` always wins and is never suppressed.** See §3 rule 2.

### `recheck` — acting on a finding, `{ days: 90 }`. 10 states

Ewa, round 1 Q2 = A (*"3 months for all of them"*) and round 2 Q1, Q2, Q3, Q4.

| Result state | Band | Signed | Note |
|---|---|---|---|
| `low-vitamin-d` | 25–50 nmol/L | round 1 | |
| `low-b12` | active B12 < 25 | round 1 | |
| `borderline-b12` | active B12 25–70 | round 1 | |
| `normal-testosterone` (low half) | T 12–20 | round 1 | ⚠ proposed 3–6 months; **narrowed** to 3 |
| `suboptimal-ferritin` | 30–100 µg/L | round 1 | ⚠ proposed 3–4 months; **narrowed** to 3 |
| `elevated-crp` / `moderate-crp`, **joints = no** | hs-CRP 1–3 / 3–10 | round 1 | |
| `elevated-crp` / `moderate-crp`, **joints = yes** | hs-CRP 1–3 / 3–10 | **round 2 Q2** | Asked separately. Round 1 scoped itself to "no joint symptoms", so this was never inferred |
| `ft-low` | free T < lab reference low | **round 2 Q1** | |
| `shbg-low` | < lab reference low | 🔴 **round 2 Q3 = B** | **Bucket C in the sign-off table. NOT maintenance** |
| `shbg-high` | > lab reference high | 🔴 **round 2 Q4 = B** | **Bucket C in the sign-off table. NOT maintenance** |

🔴 **The last two are the trap this document exists for.** They are in-range states, they sit under
a heading that says "all-clear / maintenance", and their rule is a 90-day `recheck`. Anything that
derives a kind from the bucket will get them wrong, and will get them wrong silently.

**Why 90 and not "3 months":** three calendar months is 89 to 92 days depending on the start date,
and 58 of 1096 start dates across 2026 to 2028 fall **under** 90, all in late January or February.
Stored as a phrase, the prepaid rule would have applied to roughly 5% of men according to the month
their blood was drawn. Keith, 2026-09-15:
`2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a. **Store the integer, never the phrase.**

✅ **Every `recheck` cell is scoped OUT of the prepaid-or-included rule**, by rule kind rather than
by a list of markers. That carve-out was originally written as a list and was wrong within 75
minutes, because round 2 added four states to this kind and two of them were in-range.

### `maintenance` — nothing to fix, `{ fromMonths: 6, toMonths: 12 }`. 8 states

Ewa, round 1 Q1 = A (*"6 to 12 months, as currently written"*) and round 2 Q6.

| Result state | Band | Signed |
|---|---|---|
| `optimal-testosterone` | T > 20 nmol/L | round 1 |
| `shbg-normal` | within lab range | round 1 |
| `ft-normal` | within lab range | round 1 |
| `normal-crp` | ≤ 1 mg/L | round 1 |
| `normal-ferritin` | 100–300 µg/L | round 1 |
| `normal-b12` | active B12 > 70 | round 1 |
| `normal-albumin` | ≥ 35 g/L | round 1 |
| `normal` (default / unmapped) | in reference range | **round 2 Q6 = A** |

**No copy sweep falls out of any of this.** The dashboard, FAQ, how-it-works page and both landing
pages already say 6 to 12 months. Signing made the value binding rather than incidental.

⚠ **The `normal` fallback is a real default, by choice.** Round 2 offered "no default at all, every
marker ruled individually, anything unruled shows no date" and **she declined it**. So a marker
added later **inherits 6 to 12 months silently** rather than showing nothing. That is the opposite
of the posture §2 of `2026-09-06-result-driven-retest-cadence.md` argues for off the back of the
`BADGES` defect. It is her call and it is recorded here so the next marker's author knows the
default will catch their state whether or not they think about it.

### ✅ `seasonal` — DESIGNED AND BUILT 2026-09-15. 1 state

| Result state | Band | Ruling |
|---|---|---|
| `normal-vitamin-d` | 50–250 nmol/L | **round 2 Q5 = A: retest heading into autumn or winter** |

She declined "6 to 12 months like the other in-range markers" and declined the hybrid. The card has
said this to customers for months and still does, so **her answer changes no copy**:

> "Given seasonal variation in the UK, it is worth retesting in autumn or winter; levels typically
> fall between October and March even when summer levels are good."

**None of the four designed kinds could hold it.** It is not `{ days }`, not
`{ fromMonths, toMonths }`, and emphatically not `clinician-led`. **A fifth kind now exists:**
`2026-09-15-seasonal-retest-rule-kind.md`, built in
`09_website-app/frontend/lib/results/retestCadence.ts`.

```ts
{ kind: 'seasonal'; window: SeasonalWindow; minGapDays: 90; minSpanDays: 30 }
```

**It resolves to a sampling WINDOW against the result date, not to a single date**, because her
ruling constrains when the blood is drawn and a mechanism has to subtract its own lead time. Two
guards, one inherited and one Keith's: a **90-day floor** (the prepaid-or-included rule reaches
`seasonal`, unlike `recheck`, which is carved out of it) and a **30-day minimum usable window**.
Swept over all 1096 anchor dates in 2026–2028: gaps run 90 to 302 days, never under 90, never past
the 12-month edge of `maintenance`, and the one unavoidable annual discontinuity is placed in early
December rather than on 30 September where the unguarded rule puts it.

⚠ **What this cell no longer does is the point.** Before, it fell through to `clinician-led` and the
product **showed a man no retest date at all on a perfectly normal vitamin D** — a silent wrong
answer on the most common in-range result the UK produces. The kind is also the only one that can
**fail to resolve** (a null `collectedAt` has no answer at all), and it says so out loud rather than
guessing.

---

### ✅ `none` — report-only. We draw no conclusion, so we recommend no retest. 1 state

**Decided 2026-09-15 (Keith).** Derived from Ewa ruling 8, 2026-06-16, and **no new clinical input
was sought or needed** — see the boundary at the end of this section.

| Result state | Band | Ruling |
|---|---|---|
| `fai-reported` | Free Androgen Index, deliberately not banded | **Ewa ruling 8, 2026-06-16: *"report-only, do not band it in men"*** |

🔴 **THIS KIND IS NOT `clinician-led`, AND THE TWO MUST NEVER BE COLLAPSED.** Both yield no date,
and that is precisely why they have to stay apart: **they yield it for opposite reasons, and one of
them renders a GP referral.**

- `clinician-led` says **a doctor decides the timing.** It is an assertion about the result, and the
  card shows a referral instead of a date.
- `none` says **we have no verdict at all**, so we make no claim in either direction. No referral,
  no date, nothing.

Borrowing `clinician-led` for FAI would assert a GP route on a marker that carries none. That is
**the FAI `default:` defect in a new place**, and it is the one this repo has already paid for:
ruling 8 was first implemented by omitting a `case`, and the default branch then told men an
out-of-range value was *"within the normal range"* and that *"no action is needed"*.

✅ **The shape mirrors `retestGuidance.ts` deliberately.** That module faced the identical question
about GUIDANCE, for this same marker, and gave it its own `{ kind: 'none' }` rather than reusing a
neighbour — with the reason in its own comment: *"nothing is missing here, and a later pass must
not mistake it for a gap and fill it in."* Same marker, same ruling, same answer, same shape, and
the test suite asserts that the precedent still holds rather than trusting that it does.

⚠ **THE BOUNDARY, because this cell is DERIVED and the others are signed.** Ruling 8 is a ruling
about banding, not about cadence. What makes the derivation safe is that **`none` records the
ABSENCE of a recommendation** — it adds no claim, so it cannot overstate her. 🔴 **Giving FAI an
actual retest date would be a new clinical claim and needs Ewa.**

🔴 **HOW THIS CELL WAS FOUND, because the next one will be found the same way or not at all.** It
was in **neither** the sign-off table nor this map, and never had been. It therefore survived two
clinical sign-off rounds and three separate recorded counts of "every row is ruled" — **every one
of which counted the rows that existed.** An item absent from every record is invisible to any
check that reads a record. It surfaced only by diffing both documents against the `ResultState`
union itself, while testing a sentence that had just been written into six files claiming the map
was complete. That diff is now `scripts/verify-cadence-coverage.js`, wired into `npm test`.

---

## 3. The reduction: nine markers, one date

✅ **Signed 2026-09-15, round 1 Q4 = C.** Ewa **rejected** the suppression rule both design
documents proposed. Her words: *"The vitamin D retest is scheduled normally. The two markers are
unrelated and the GP referral does not conflict with it."*

**Cadence is decided per marker, never per panel.**

1. A `clinician-led` state yields **no date for that marker**, and **suppresses nothing**.
2. A `confirm` rule **always wins** and is never suppressed.
3. Otherwise the whole-result date is the **shortest interval among the states that have one**.
4. If no state has one, there is no date.

**Worked example, as put to her:** CRP 14 mg/L plus vitamin D 38 nmol/L returns **a GP referral for
the CRP and a 3-month vitamin D retest on the same result**. She confirmed the related boundary
explicitly: a GP referral is **not** the end of our involvement for that panel.

✅ **The rejected rule was carrying something other than cadence, and that load is now re-homed
(Keith, 2026-09-15).** It was the anti-upsell guard stopping a man being sent to a doctor and
scheduled a kit in the same breath. Re-reading the prepaid rule and CA-014 against her ruling
showed neither reached it: the prepaid rule binds only **sub-90-day** rechecks and `recheck` is 90
and carved out, while CA-014 was being applied **per marker** though its wording is per **result**.

🔴 **Applied at the result level it turned out to be live, not forward-looking: 16 retest links
across 6 fixtures**, every one on a result that had just told a man to see his doctor. The per-card
compliance guard passed throughout, because **a per-item check cannot see a per-collection rule.**
Now `resultMayCarryRetestOffer()`, enforced in `classify()` and guarded from both directions.
✅ **The retest INTERVAL survives** (Ewa-signed card copy; removing it would recreate defect 3f) and
✅ **complement cross-sells survive** (they offer an untested panel and re-test nothing).

---

## 4. What is NOT in this map

- **The symptom overlay.** A man in range but still unwell is widened to an untested panel, then to
  his GP, and **never to an early repeat of the same marker** (round 2 Q8 = A: *no floor, because
  there is no case*). That is a routing rule, not a cadence cell.
- **The straight-to-GP red-flag line and the symptom → panel wordings.** Both clinically signed,
  both **on-screen copy**, both outside this map. 🔴 **Neither may ship yet:** the red-flag line's
  pre-flight ran and failed on a missing 999 escalation, and the panel wordings have never been
  pre-flighted and do not exist in the product. They share a screen, which needs the full stack in
  order: **999 block, then the red-flag GP list, then the panel suggestion.**

---

## 5. Build checklist

| # | Item | Blocking? |
|---|---|---|
| 1 | ~~Design the **`seasonal`** rule kind~~ ✅ **DONE 2026-09-15.** `2026-09-15-seasonal-retest-rule-kind.md`; `lib/results/retestCadence.ts` + 44 assertions in `npm test`. Inert: nothing imports it yet | ~~🔴 Yes~~ **Unblocked.** Items 2 and 3 are now the blockers |
| 2 | ~~Add **T > 29** and **vitamin D > 250** rows to the sign-off table~~ ✅ **DONE 2026-09-15.** Both rows added to bucket A; the table is now 28 rows. Signed under round 1 Q3, verified against the sent email, no new ask | ~~🔴 Yes~~ **Unblocked**, together with item 2b |
| 2b | ~~Decide the `fai-reported` cell~~ ✅ **DONE 2026-09-15 (Keith): the sixth kind, `none`.** Found by diffing this map against the `ResultState` union — it was the one state in **neither** this map nor the sign-off table, and never had been. Rowed in both, and `retestCadence.ts` gained `{ kind: 'none' }`, mirroring the shape `retestGuidance.ts` already chose for this same marker. ⚠ **Derived from Ewa ruling 8, not signed as cadence** — safe only because the kind records the ABSENCE of a recommendation; **giving FAI a retest date would be a new claim and needs Ewa** | ~~🔴 Yes~~ **Unblocked.** 30 states, 30 rows, asserted on every build by `verify-cadence-coverage.js` |
| 3 | ~~Re-home the **anti-upsell guard** after Q4 = C~~ ✅ **DONE 2026-09-15 (Keith).** It now lives in `resultMayCarryRetestOffer()`, enforced in `classify()`: **when any marker on a result is GP-routed, the result offers no retest to buy.** CA-014 read at the RESULT level, which is the level its own wording uses. ⚠ **It suppressed 16 live links across 6 fixtures** — the per-card guard had passed throughout, because a per-item check cannot see a per-collection rule. ✅ The retest **interval** survives (Ewa-signed card copy) and ✅ complement cross-sells survive (untested panels). Recorded in `03_compliance/CONTEXT.md` | ~~🔴 Yes~~ **Unblocked.** The reduction can be built |
| 4 | ~~Store every `recheck` as `{ days: 90 }`, never a month count~~ ✅ **DONE 2026-09-16.** `RECHECK_DAYS = 90`, one named integer, asserted to be an integer and asserted to be the value every `recheck` rule carries | ~~Yes~~ **Closed** |
| 5 | ~~Assert the **dual rule** on the three sub-12 states (`clinician-led` + `confirm`) in a fixture~~ ✅ **DONE 2026-09-16.** The three cells carry both rules; the suite asserts that exactly three cells are dual, that they are those three, that each reduces to the confirmatory recheck, and that the reduction does not depend on which rule the cell lists first | ~~Yes~~ **Closed** |
| 6 | ~~Fixture per signed cell. **The map no longer ships inert**, so building it moves real dates~~ ✅ **DONE 2026-09-16.** `scripts/test-retest-cadence-map.ts`, 117 assertions, in `npm test` | ~~Yes~~ **Closed** |
| 7 | ~~Pre-flight the two copy items **as one screen**, with the 999 block above them~~ ✅ **DONE 2026-09-16. Pre-flighted, and APPROVED as CA-048, both signers in.** It was **three** screens, not two: Kit 3 had no wording and now has one. ⚠ **Approval fills the copy and authorises no build:** four conditions ride with the screen, of which the render obligation is undischarged and the alert container is undecided | ~~Only for the copy~~ **Closed** |

✅ **EVERY ROW IS NOW CLOSED (2026-09-16).** Items 1, 2, 2b and 3 on 2026-09-15; items 4, 5 and 6
with the map and its fixture on 2026-09-16; item 7 with CA-048. ⚠ **A closed checklist is not a
shipped feature:** the map is built and **read by nothing**, and the screen is approved and **not
built**. Both of those are separate pieces of work with their own verification, and neither is
tracked by this table any more.

⚠ **Item 6 retires a safety property that used to be true.** The design doc argued the map could be
built with no observable effect, because only one cell was signed. Every cell is signed now. **The
build needs its own verification; it can no longer rely on being inert.**

---

## 6. Build record — 2026-09-16

✅ **THE MAP IS BUILT. Items 4, 5 and 6 are closed, and nothing reads it yet.**
`RETEST_CADENCE` in `09_website-app/frontend/lib/results/retestCadence.ts`, beside the six kinds it
was waiting on. 30 states, 30 cells, 33 rules (the three duals are the difference).

**The shape changed by one word, and the reason is item 5.** The design doc proposed
`Record<ResultState, RetestRule>`; what is built is `Record<ResultState, RetestCell>`, where a cell
is a **non-empty tuple** of rules. A single-rule cell cannot hold the three sub-12 testosterone
states, which carry `clinician-led` **and** `confirm` at once and always have — so the alternative
was a second map of confirm overlays, which is the duplicated-fact shape this repo keeps paying
for. ⚠ **The tuple is non-empty by construction on purpose:** an empty cell reads as "nothing
decided" and behaves as "nothing recommended", and "we recommend nothing" is a real clinical
position (`none`) that has to be **stated**. `Record` already made a missing state a compile error;
the tuple makes an empty one a compile error too.

**The reduction is built with it**, as signed: `clinician-led` contributes nothing and suppresses
nothing, `confirm` always wins, otherwise shortest-wins, and no contributor means no date.
⚠ **`confirm`-always-wins is written as its own branch although every `confirm` is currently zero
days**, so "wins" and "shortest" agree today and the branch looks redundant. It is asserted against
a **synthetic 180-day `confirm` that no fixture produces**, because the agreement is a coincidence
of the current value: move the confirmatory recheck off zero and a pure shortest-wins rule would
silently stop scheduling the confirmatory sample.

🔴 **"No date" and "no answer" are kept apart in the return type.** A `seasonal` rule with a null
anchor has no answer at all (`collectedAt` is nullable in the schema), and the reduction reports it
as `unresolved` rather than collapsing it into "no retest recommended" — the same defect the
seasonal kind exists to close, one layer up.

**The fixture is an independent restatement, not a read-back.** Every expected rule is a literal
(`{ kind: 'recheck', days: 90 }`), never the constant the code uses, so changing `RECHECK_DAYS` to
84 fails the suite instead of quietly agreeing with itself. ⚠ **That property was verified by
breaking the map four ways** — shortening the interval past the 90-day commercial floor, moving
`shbg-low` into the maintenance bucket, deleting the `confirm` from a dual cell, and collapsing
`fai-reported` into `clinician-led` — and confirming the suite failed each time (16, 4, 9 and 4
assertions respectively) before restoring the file and checking the hash matched.

**Two cross-checks the suite adds that neither document asked for:**

- **The prepaid-or-included rule, expressed over the map instead of over a list of markers.** Swept
  across every 2026 anchor date: **no cell contributes a sub-90-day interval** except `confirm`,
  which is prepaid inside the Confirmation bundle by construction. That is
  `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §1 as an assertion rather than a promise.
- **`clinician-led` and the "See Your GP" badge are asserted to be the same set, in both
  directions.** They are two independently maintained maps encoding one clinical fact, and
  `resultMayCarryRetestOffer()` derives from the badge — so a disagreement would route a man to his
  doctor on the card while quietly scheduling him a retest, or the reverse.

⚠ **The confirmatory `0` is stored twice** — here and as `CONFIRMATION_INTERVAL_DAYS` in
`lib/bundles/config.ts`, which the bundle dispatch path reads. It is **not** imported, because
`config.ts` reaches `classifier.ts` and `classifier.ts` is where this map gets wired in next; the
import would build the cycle in advance. The duplication is held shut by an assertion instead, so
the two diverging is a failing build rather than a silent disagreement.

🔴 **WHAT IS NOT DONE: THE WIRING.** None of the eight mechanisms in `retest-mechanism-map.md`
reads this yet, and nothing imports the map but its test. **No date moves for any customer as a
result of this change.** That is deliberate — this change is reviewable line by line against a
clinical document, the next one changes what lands in a man's letterbox — but it means the map is
**correct and inert**, which is exactly the state item 6's warning says cannot be relied on twice.
The wiring is the next piece of work and it needs its own verification against the eight
mechanisms, not this one.
