# RETEST_CADENCE: the signed map, keyed by rule kind

**Status:** ✅ **Every cell below is clinically signed.** CA-047, Ewa, 2026-09-15, in two rounds.
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
is not a kind at all.

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
| **testosterone above 29 nmol/L** | T > 29 | 🔴 **NO ROW** |
| **vitamin D above 250 nmol/L** | > 250 nmol/L | 🔴 **NO ROW** |

🔴 **The last two are signed and have no row in the sign-off table.** Ewa's round 1 Q3 enumerated
them; the table's bucket A was written before the 2026-08-07 upper bands existed and never gained
them. They are in `thresholds.md`. **Add both rows to the sign-off table**, because a `Record`
missing two members of its key union will not compile, which is the entire reason that shape was
chosen.

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

### 🔴 `seasonal` — THE KIND DOES NOT EXIST. 1 state

| Result state | Band | Ruling |
|---|---|---|
| `normal-vitamin-d` | 50–250 nmol/L | **round 2 Q5 = A: retest heading into autumn or winter** |

She declined "6 to 12 months like the other in-range markers" and declined the hybrid. The card has
said this to customers for months and still does, so **her answer changes no copy**:

> "Given seasonal variation in the UK, it is worth retesting in autumn or winter; levels typically
> fall between October and March even when summer levels are good."

🔴 **None of the four designed kinds can hold it.** It is not `{ days }`, not
`{ fromMonths, toMonths }`, and emphatically not `clinician-led`.

**This is the single thing blocking the build**, and the failure mode is worse than a gap: with no
fifth kind, this cell falls through to `clinician-led` and the product **shows a man no retest date
at all on a perfectly normal vitamin D**. A silent wrong answer, on the most common in-range result
the UK produces. **Design the kind before the map ships**, and make the fallback loud rather than
silent in the meantime.

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

⚠ **The rejected rule was carrying something other than cadence.** It was the anti-upsell guard
stopping a man being sent to a doctor and scheduled a kit in the same breath. **That load is now
unhomed** and rests entirely on the prepaid rule plus CA-014's no-upsell-on-a-GP-referral rule,
neither of which was written to carry it alone. **Re-read both against this ruling before building
the reduction.**

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
| 1 | Design the **`seasonal`** rule kind | 🔴 **Yes.** Without it `normal-vitamin-d` shows no date on a normal result |
| 2 | Add **T > 29** and **vitamin D > 250** rows to the sign-off table | 🔴 **Yes.** The `Record` cannot be exhaustive without them |
| 3 | Re-home the **anti-upsell guard** after Q4 = C | 🔴 **Yes**, before the reduction is built |
| 4 | Store every `recheck` as `{ days: 90 }`, never a month count | Yes |
| 5 | Assert the **dual rule** on the three sub-12 states (`clinician-led` + `confirm`) in a fixture | Yes |
| 6 | Fixture per signed cell. **The map no longer ships inert**, so building it moves real dates | Yes |
| 7 | Pre-flight the two copy items **as one screen**, with the 999 block above them | Only for the copy |

⚠ **Item 6 retires a safety property that used to be true.** The design doc argued the map could be
built with no observable effect, because only one cell was signed. Every cell is signed now. **The
build needs its own verification; it can no longer rely on being inert.**
