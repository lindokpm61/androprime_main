# Approval Record — Retest cadence: the state-keyed interval table (v1)

| Field | Value |
|---|---|
| Register ID | CA-047 |
| Artefact path | `04_products/results-engine/2026-07-17-retest-cadence-table.md` §3 (26 rows) + §3a (the mixed-panel reduction rule) + §4 Q4(b) (the straight-to-GP red-flag line). Fills `RETEST_CADENCE` as designed in `04_products/results-engine/2026-09-06-result-driven-retest-cadence.md` |
| Version | v1 (drafted 2026-07-17; premise, §3a and §5 rewritten 2026-09-07; sent 2026-09-15) |
| Content type | Results-engine logic (retest intervals + whole-panel reduction) with one customer-facing copy item |
| Submitted by | Keith Antony |
| Submitted date | 2026-09-15 (sent 19:46 UTC) |
| Required signers | Ewa (clinical) + Keith (business) |

## 1. Pre-flight evidence (mandatory)

- **Deterministic scanner: not run, and it is not the applicable gate for most of this record.**
  Five of the six items are engine logic (which interval a result state carries, and how nine
  states reduce to one date). They produce no customer-facing string on their own. Same
  disposition as CA-043 (biomarker bands, engine logic).
- 🔴 **THE PRE-FLIGHT RAN 2026-09-15 AND DID NOT CLEAR. The §4 Q4(b) red-flag line may not ship.**
  - **Deterministic floor: CLEAN.** `compliance-preflight/scan.js` returns 🔴 HARD 0 / 🟠 REVIEW 0.
  - 🔴 **Judgement pass: FAILED, on something the scanner cannot see.** The ratified line routes
    **all** chest pain to a GP. That contradicts Ewa's own standing ruling of **2026-08-18: "999
    for sudden or severe, GP for the rest"** (`correspondence/2026-08-18-keith-ewa-fifteen-rulings.md`,
    Ruling 1). As written, a man with sudden severe chest pain is told to speak to his GP.
  - **This is not a reviewer error, and the record should not read as one.** Q5 asked which symptoms
    skip the "try another panel" step and go to a GP; it did not ask 999 versus GP, so she answered
    the question put to her. **The 999 escalation is a layer above her answer, not a correction to
    it.** Her Q5 list is almost word-for-word the GP half of the two-part block already live on
    `cholesterol-test` ("You have chest pain, breathlessness on exertion, or any symptom that
    worries you"). What is missing is the half that sits above it.
  - ✅ **The fix is additive, carries her own signed wording, and needs NO new Ewa ask.** The
    2026-08-18 sweep established that restoring her signed wording verbatim raises no CA. When the
    Q5 line is built into a screen it gains a **"Read this part first. Call 999 now if:"** block
    above the GP list: *"You have sudden or severe chest pain, pain that spreads to your arm, neck,
    jaw or back, or chest pain with breathlessness, sweating or feeling sick. Don't talk yourself
    out of it. Rule out your heart first, every time."*
  - ⚠ **Carry the derivative trap from that same sweep.** On `cholesterol-test` the frontmatter FAQ
    needed the line too and was nearly missed, because it is machine-read into FAQ schema: fixing
    only the human-readable surface applies the ruling where a person reads and not where an AI
    Overview does. **Check every surface the Q5 line lands on for a second machine-read copy.**
- **Judgement pass on the ruling itself:** done. No claim is made, no condition is named, nothing
  crosses the Phase 0 boundary, and the one interval change (3 months) is a narrowing, not a
  widening.

## 2. Items flagged for human decision

Five lettered questions, sent 2026-09-15 19:46 UTC, answered 20:18 UTC. The preamble stated that
answering all five **is** the sign-off, with no separate approval question.

| Q | Item | Ewa's answer | Meaning and effect |
|---|---|---|---|
| 1 | The all-clear interval (bucket C) | **A** | *"6 to 12 months, as currently written."* **No copy sweep**: the dashboard, FAQ, how-it-works page and both LPs already say this. Signing makes it binding rather than incidental |
| 2 | The interval when acting on a finding (bucket B) | **A** | *"3 months for all of them."* ⚠ **Narrows two proposed cells**: normal-testosterone (low half) was proposed 3–6 months, suboptimal-ferritin 3–4. Both are now 3 |
| 3 | GP-routed results (bucket A) | **A** | *"No Andro Prime retest interval at all. The GP directs the timing, and our card shows the referral rather than a retest date."* All 8 bucket A rows become `clinician-led`. The prepaid sub-12 confirmatory recheck (signed 2026-07-26) is untouched |
| 4 | When one panel carries two different answers | 🔴 **C** | *"The vitamin D retest is scheduled normally. The two markers are unrelated and the GP referral does not conflict with it."* **This REJECTS the proposed rule.** See §3 below |
| 5 | The straight-to-GP line | **A** | The red-flag list ratified **verbatim**, not in substance. She declined B (*with your additions or removals*) and C (*a different rule entirely*) |

### The Q5 wording, as signed

> chest pain, breathlessness at rest or on light exertion, unexplained weight loss, blood in stool
> or urine, a new lump, fainting, or any symptom that is new and getting worse week on week.

## 3. The one answer that was not "as drafted", and what it changes

🔴 **Q4 = C rejects the reduction rule proposed in both design documents.** The proposal, in
`2026-09-06-result-driven-retest-cadence.md` §4 and the table's §3a, was that **a GP-routed marker
suppresses the whole-panel retest**. The author's own stated instinct was option (b), suppress the
date but keep the guidance. Ewa took neither.

**The rule as signed: retest timing is decided PER MARKER, never per panel.**

1. A `clinician-led` marker contributes **no date** and **suppresses nothing**.
2. A `confirm` rule always wins and is never suppressed. *(Unchanged, signed 2026-07-26.)*
3. The whole-result date is the **shortest interval among the states that have one**.

**Worked example, as put to her:** a man with CRP 14 mg/L and vitamin D 38 nmol/L gets **a GP
referral for the CRP and a 3-month vitamin D retest**, on the same result.

She also answered the packet's related boundary in the affirmative: a GP referral and one of our
retests **do** coexist, and a GP referral is **not** the end of our involvement for that panel.

⚠ **Rule 1 was carrying something other than cadence.** It was the anti-upsell guard preventing a
man being sent to a doctor and scheduled a kit in the same breath. **That load is now unhomed** and
rests entirely on `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` plus CA-014's
no-upsell-on-a-GP-referral rule, neither of which was written to carry it alone. Compounding it:
✅ **The 90-day boundary is SETTLED 2026-09-15 (Keith): bucket B is scoped OUT of the prepaid rule,
and the cell stores `{ days: 90 }` rather than the phrase.** See
`04_products/results-engine/2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a.
⚠ **Correcting this record's own earlier line: "3 months is exactly 90 days" is wrong.** It is
**89 to 92 days** depending on the start date, and 58 of 1096 start dates across 2026 to 2028 fall
under 90, all in late January or February. The commercial rule would otherwise have applied to
about 5% of men according to the month their blood was drawn.

## 4. Coverage — round 1 reached 21 of 26; round 2 closed the rest

🔴 **A fully answered email is not a fully signed table, and this record exists to prove it.** The
first five questions enumerated the states they covered **in prose** rather than by row id, so the
shortfall was invisible from both ends: Ewa answered every question asked, and every answer was
received. **The gap was found by hand-diffing her prose against the table**, not by any check.

| Bucket | Rows | After round 1 | After round 2 |
|---|---|---|---|
| A — clinician-managed | 8 | **8** | **8** |
| B — acting on a finding | 7 | 6 | **7** + the CRP joints = yes branch |
| C — all-clear / maintenance | 11 | 7 | **11** |
| §4 sub-items | 3 | 1 (Q4b) | **3** (Q4a and Q4c closed) |

✅ **Every row is now ruled.** Round 2 was sent 21:06 UTC and answered 21:33 UTC, and its expected
answer count of eight was **written into this record before it was sent** so the reply could be
counted rather than eyeballed. It matched.

⚠ **Two signed states still have no row in the table at all**: **T > 29 nmol/L** and **vitamin D >
250 nmol/L**, both ruled `clinician-led` in round 1's Q3. They exist in `thresholds.md` (added
2026-08-07) but were never carried into the pack, so the table under-described bucket A when it was
sent. **Both rows must be added before the `Record` can be exhaustive**, which is the whole reason
that shape was chosen. **This is the one coverage item neither round closed**, because it is a
missing row rather than an unanswered question.

## 4a. The follow-up packet — SENT AND ANSWERED 2026-09-15. Every row is now ruled.

**Sent 21:06 UTC, answered 21:33 UTC, 27 minutes.** Gmail thread `1a0a6ded1d6d688b`, reply
`1a0a6fd83d399750`, subject "Retest timing: eight questions the last email did not ask".

**`1: A  2: A  3: B  4: B  5: A  6: A  7: A  8: A`**

✅ **Eight letters against the expected eight. The count was written down before sending and met
exactly**, so nothing in this table rests on an adjacent answer. Validator `signoff-email/validate.js`
exited 0 before the draft was created.

| Q | Fills | Ruling |
|---|---|---|
| 1 | `ft-low` | **A** — 3 months, same as the other markers a man is acting on |
| 2 | the CRP **joints = yes** branch | **A** — 3 months, same as joints = no. Asked rather than inferred |
| 3 | `shbg-low` | 🔴 **B** — 3 months, NOT the 6 to 12 she was offered as A |
| 4 | `shbg-high` | 🔴 **B** — 3 months, NOT the 6 to 12 she was offered as A |
| 5 | `normal-vitamin-d` | **A** — stays seasonal, autumn or winter. No copy change |
| 6 | `normal` (default / unmapped) | **A** — 6 to 12 months, matching the card. She declined "no default at all" |
| 7 | §4 Q4(a) | **A** — both symptom → panel wordings verbatim as proposed |
| 8 | §4 Q4(c) | **A** — **no floor**, never repeat the same in-range marker early |

### 🔴 Three consequences, none of them a problem with her answers

**1. Q3 and Q4 changed the rule KIND, not just the value.** Both SHBG states sat in bucket C at a
proposed 6 to 12 months. At 3 months they are `recheck` (`{ days: n }`), not `maintenance`
(`{ fromMonths, toMonths }`). **They keep their in-range band definitions and carry a bucket B rule
kind.** The bucket headings are presentational; the kind is what the lookup stores.

⚠ **This immediately falsified something written 75 minutes earlier.** The prepaid rule's new
carve-out row enumerated the bucket B markers **by name**, and that list was short by four:
`ft-low`, the joints = yes branch, `shbg-low` and `shbg-high`. Two of those are **in-range states**,
so no amount of re-reading bucket B would have found them. **The carve-out is now scoped by rule
kind rather than by a list**, which is self-maintaining. Recorded in that doc's §2.

**2. Q5 = A preserves a ruling the design cannot store.** "Retest heading into autumn or winter" is
neither `{ days }` nor `{ fromMonths, toMonths }`. **`RETEST_CADENCE` needs a fifth kind before
`normal-vitamin-d` can be expressed**, or the cell falls back to `clinician-led` and shows a man no
date on a normal result. A design gap her answer exposed, not a defect in the answer.

**3. Q7's copy is signed and does not exist.** Two sentences ratified verbatim that were written for
the packet and have never been in the product. **Building them is a copy change owing its own
compliance pre-flight**, and they share a screen with the Q4(b) red-flag line. 🔴 **The composite
screen needs the full stack in order: the 999 block, then the red-flag GP list, then the panel
suggestion.** Pre-flighting either sentence alone would miss that.

⚠ **Two things established before drafting, so the questions are answerable rather than
retrieval exercises.** The **symptom → panel copy does not exist**: a grep over `lib/` and
`components/` returns no such strings, so Q7 proposes wording rather than passing over live text,
and the email says so explicitly. And **two of the six already have live card copy stating an
interval** — `normal-vitamin-d` at `biomarker-copy.ts:162` and `:165` ("retesting in autumn or
winter") and `normal` at `:325` ("Retesting in 6 to 12 months") — so those options are quoted from
the cards and their blast radius is marked as "A changes nothing".

⚠ **The email does NOT cite row ids, deliberately, and that is a refinement of the lesson the last
round taught.** Row ids would let the author reconcile mechanically but mean nothing to the
reviewer, who rules on results and not on table rows. **The mapping lives here instead**, in the
table above, which is what the reverse leg reconciles against.

## 5. Conditions of approval

1. 🔴 **The Q5 red-flag line may not go on screen without its own compliance pre-flight.** Clinical
   sign-off is not compliance clearance, and this is copy shown to a symptomatic man.
2. **Signing fills 21 cells. It does not authorise a build or a deploy.** The map, the §3a rule
   change and the red-flag copy are three separate steps.
3. ⚠ **The map no longer "ships inert", and that safety property must not be relied on.** The
   design doc's §7 argument rested on exactly one cell being signed; there are now 22. Building it
   **will move real dates**, so the build owes its own verification that each signed cell behaves as
   the table says.
4. ✅ ~~Settle which side of 90 days the 3-month bucket B interval falls on.~~ **SETTLED 2026-09-15
   (Keith): bucket B is scoped OUT of the prepaid rule** (a third carve-out row in its §2, beside
   the complement cross-sell and seq-04 e5), **and the cell stores `{ days: 90 }`, not "3 months".**
   The two halves are deliberate: the carve-out is the principled one and lets the number move
   later without reopening the commercial question; the integer means a reader who never finds the
   carve-out still gets the right answer, since 90 is not *less than* 90. 🔴 **The guard: any
   proposal to shorten a bucket B cell below 90 days reopens §2a.** "12 weeks" is 84 days.
5. **Re-read the prepaid rule and CA-014 against the Q4 = C ruling before building the reduction**,
   since they are now the only things carrying the anti-upsell guard.

## 6. Signature block — humans only

| Role | Name | Decision | Conditions | Date |
|---|---|---|---|---|
| Clinical / claims (Ewa) | Dr Ewa Lindo | **APPROVED WITH CHANGES** | Q4 rejects the proposed reduction rule; Q2 narrows two proposed cells. 21 of 26 rows covered | 2026-09-15 |
| Business (Keith) | Keith Antony | **APPROVED** | direct instruction, "CA-47 approved" | 2026-09-15 |
| Compliance pre-flight (Q5 copy) | — | 🔴 **RAN AND DID NOT CLEAR** | deterministic floor clean; judgement pass found the missing 999 escalation. **Blocks the red-flag line only, not the intervals.** See §1 | 2026-09-15 |
| Contractual (Solicitor) | n/a | not required | no contractual/money clause | — |

**Evidence for Ewa's signature.** Direct written reply from `ewalindo@live.co.uk`, 2026-09-15
20:18 UTC. Gmail thread `1a0791e8fa8ed170`; sent message `1a0a69ae55223fe0`, reply
`1a0a6b82da681639`. Five letters against five questions; expected answer count met exactly.

## 7. Outcome

- Final decision: ✅ **APPROVED WITH CONDITIONS, 2026-09-15.** Both required signers in: Ewa
  (clinical, with changes) and Keith (business, direct instruction).
- ✅ **The 21 signed interval cells and the Q4 = C reduction rule are approved and buildable.**
- 🔴 **Condition 1 is NOT cleared and the red-flag line may not ship.** The pre-flight ran: the
  deterministic floor is clean, and the judgement pass found that the ratified line routes all
  chest pain to a GP, contradicting Ewa's standing 2026-08-18 ruling. The fix is additive, uses her
  own signed wording, and needs no new ask. **It blocks that line only; nothing else waits on it.**
- ✅ **THE TABLE IS NOW FULLY RULED, 26 of 26 plus the joints branch and all three §4 sub-items.**
  The follow-up packet (§4a) was sent and answered the same evening, eight letters for eight
  questions. **Two rounds, both matching their expected answer counts exactly.**
- 🔴 **Fully ruled is not buildable.** Three things stand between this and a working lookup, and
  none is Ewa's: `normal-vitamin-d` needs a **fifth rule kind** the design does not have; **two
  signed states have no row** in the table (T > 29, vitamin D > 250); and **two on-screen copy
  items are signed but not compliance-cleared**, one of which failed its pre-flight.
- ✅ Condition 4, the 90-day boundary, was settled the same day; see §5.
- Register updated: 2026-09-15. **CA-047 opened on this record** (highest in use was CA-046,
  nothing was reserved).
- Docs swept the same day: `2026-07-17-retest-cadence-table.md` (§3 all three buckets, §3a, §4, §6),
  `2026-09-06-result-driven-retest-cadence.md` (§3, §4, §7, §9), `retest-mechanism-map.md` (§5 and
  owed items 5, 6, 9), `04_products/STATE.md`.
