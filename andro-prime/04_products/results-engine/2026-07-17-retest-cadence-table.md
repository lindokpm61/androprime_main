# Retest cadence table — for Ewa sign-off

**Status:** ✅ **FULLY SIGNED, 2026-09-15, in two rounds.** Round 1 (five questions, replied 20:18
UTC, `1: A 2: A 3: A 4: C 5: A`) closed 21 rows and **rejected the §3a suppression rule**. Round 2
(eight questions, replied 21:33 UTC, `1: A 2: A 3: B 4: B 5: A 6: A 7: A 8: A`) closed the rest.
Business sign-off: Keith, same day. Compliance record: **CA-047**. Earlier: PROPOSED (drafted
2026-07-17; premise, §3a and §5 rewritten 2026-09-07).

📐 **The build input is a different document.** This table is the **sign-off record**, grouped into
the three buckets the questions were put in. `2026-09-15-retest-cadence-by-rule-kind.md` is the
same rulings **keyed by rule kind**, which is what `RETEST_CADENCE` stores. 🔴 **After round 2 the
buckets and the kinds no longer agree** (two bucket C states carry `recheck` rules, one carries
`seasonal`, and one state sits outside the buckets entirely), so **read the kind from that document
and never from a bucket heading here.**

🔴 **Signed is not built.** One thing now stands between this table and a working lookup: the two
on-screen copy items (§4 Q4(a) and Q4(b)) are clinically signed but **not compliance-cleared** — the
Q4(b) pre-flight ran and failed on a missing 999 escalation. ✅ The two items that used to sit here
are closed: `normal-vitamin-d`'s seasonal ruling has a shape (the `seasonal` kind,
`2026-09-15-seasonal-retest-rule-kind.md`) and the two missing bucket A rows have been added.

> ✅ **COVERAGE: EVERY RESULT STATE THE ENGINE CAN PRODUCE NOW HAS A ROW. 30 of 30.** That is
> **28 rows signed under CA-047**, plus the joints = yes branch, plus §4's Q4(a), Q4(b) and Q4(c),
> plus **one row outside the three buckets** (`fai-reported`, report-only) that is **derived from
> ruling 8 rather than signed here**. ✅ **Asserted mechanically on every build** —
> `09_website-app/frontend/scripts/verify-cadence-coverage.js` diffs this table and the rule-kind
> map against the engine's `ResultState` union, because a document cannot be trusted to notice that
> it is the thing that is short. Closed in two rounds, and the second round exists only because the first was
> written in prose rather than by row. Recording that, because it is the reusable lesson:
>
> | Round | Sent | Answered | Closed |
> |---|---|---|---|
> | Five questions | 2026-09-15 19:46 UTC | 20:18 UTC | 23 rows, and Q4 rejected the §3a suppression rule |
> | Eight questions | 2026-09-15 21:06 UTC | 21:33 UTC | the remaining 5 rows, the joints branch, Q4(a) and Q4(c) |
>
> **Both replies matched their expected answer counts exactly** (five for five, eight for eight), so
> nothing anywhere in this table was inferred from an adjacent answer.
>
> ⚠ **Round 1 is recorded as 23 rows, not the 21 it was credited with at the time**, and the
> correction is the interesting part. Its Q3 enumerated **ten** GP-routed bands and the table had
> only **eight** rows to receive them, so two signed cells had nowhere to land and the round looked
> thinner than it was. **The shortfall was in the table, not in the ruling.** Both rows were added
> 2026-09-15 against the sent email; see the note under §3's bucket A.
>
> 🔴 **One item remains, and it is not Ewa's.** The §4 copy items are clinically signed and
> compliance-blocked. ⚠ **Separately, and not a coverage item:** the card copy for the two newly
> rowed states is still **drafted, not approved** (CA-044 §2 item A, open since 2026-08-07). That
> gates their wording, not their cadence.
**Owner workspace:** `04_products/results-engine`. Compliance authority: `03_compliance/CONTEXT.md` (Guardrail 1 — results copy is clinical, Ewa signs).
**Why now:** raised from `09_website-app/docs/2026-07-17-retest-cta-mechanism-decision.md`. Related ClickUp task: `869e66e9c` (Ewa sign-off — the blocker for the whole retest-CTA fix).

---

## 1. Why this table is needed

> 🔄 **PREMISE REWRITTEN 2026-09-07. The original reason for this pack has been fixed, and a
> different, larger reason has replaced it.** Read this section as current; the struck text below
> is kept so the change is visible rather than silent.

**~~The app currently states three different retest intervals for the same all-clear result~~ — it
no longer does.** Checked against the code on 2026-09-07: `classifier.ts` now reads
`'Retest in 6-12 months'`, `biomarker-copy.ts` contains no "3-6 months" string, and the four
marketing surfaces all say "6 to 12 months". **The copy layer agrees with itself.** That drift was
corrected during ordinary work between July and September, and nobody updated this pack.

**The reason to sign it now is bigger than the drift it was written for.** A result-driven retest
cadence has since been proposed (`2026-09-06-result-driven-retest-cadence.md`): one exhaustive
lookup, keyed by result state, that **every mechanism in the product reads from** rather than each
carrying its own constant. **This table is the document that fills that lookup, cell by cell.** It
has moved from an alignment exercise to the blocking clinical input for a piece of machinery.

That raises the stakes on two things:

- **An unsigned cell cannot ship.** The design deliberately makes any cell you have not ruled on
  return "no Andro Prime retest date, clinician-led", so nothing fires on your silence. But it also
  means the feature stays dark until cells are filled.
- **A new question comes with it**, about whole-panel results rather than single markers. It is
  section 3a below and it is the one I would most want your eye on.

**~~The original framing, kept for the record:~~**

| Surface | What it said in July 2026 | Today |
|---|---|---|
| Dashboard CTA button (`classifier.ts` `retestReminder`) | "Book a retest in **3 months**" | ✅ "Retest in 6-12 months" |
| Marketing site (how-it-works, FAQ, testosterone + hormone LPs) | "**6 to 12 months**" / "6 months" | ✅ All four say "6 to 12 months" |
| Result-card copy (`biomarker-copy.ts`) | optimal-T and default normal "**3–6 months**" | ✅ No "3-6 months" string remains |

Retest timing is a clinical judgement, so it is yours to set. Fill in the "Ewa — agreed" column (and
the notes), and the lookup is built from it.

---

## 2. How to read it — three buckets

Every result the engine can produce falls into one of three cadence buckets:

- **Bucket A — Clinician-managed.** Result routes to a GP referral. The retest is directed by the GP, not by us. We should **not** put an Andro Prime retest interval or a "book a retest" button on these (today they correctly show a GP-referral CTA, not the retest CTA).
- **Bucket B — Acting on a finding.** A below-optimal marker the person is doing something about (supplement, diet, lifestyle). Retest is to see **whether the intervention moved the marker**. This is the only place a short window (**~3 months / 90 days**) is clinically sensible, and it matches the existing subscriber retest email (seq-04 email 5, Day 90).
- **Bucket C — All-clear / maintenance.** Marker is in range, nothing to fix. Retest is baseline maintenance, so the window is **long (6–12 months)** — but see the symptom overlay below, which can move it. **This is the bucket the dashboard button currently sits on while wrongly saying "3 months."**

---

## 2a. The symptom overlay — the interval is a default, not a fixed rule (Keith, 2026-07-17)

The bucket intervals above are the *starting point*. The right retest timing also depends on how the person actually feels, because an in-range result does not always explain their symptoms. The overlay, most relevant to Bucket C:

- **In range AND feeling well** → longer end of the window (e.g. 12 months). Nothing to chase; the result matches how they feel.
- **In range BUT still symptomatic** → the tested marker is not the answer, and repeating the *same* in-range marker sooner will most likely read the same and answers nothing. Two-step path, **in order**:
  1. **Check a panel we supply that has not already been tested**, matched to the most obvious symptoms for it. The scope is deliberately hard-limited: step 1 can *only ever* suggest an untested panel from our own range. If the symptom does not map to one, there is no step 1 — go to step 2.
  2. **Failing that, see your GP** — the safe fallback, and the catch-all for everything step 1 cannot cover. Keith 2026-07-17: GP is the safest option and the backstop the whole overlay funnels to.
  - **Safety carve-out:** the widen-first order is for ordinary lingering symptoms. **Red-flag symptoms, or a result already sitting near a clinical boundary, skip step 1 and go straight to GP.**
- **Was acting on a finding (Bucket B)** → symptom change plus the ~3-month movement window drives it, as already noted.

**The step-1 list is tiny and already defined by the kit structure (Keith 2026-07-17).** Because it can only point to an untested panel we supply, and Kit 3 is the superset, the whole list is essentially:

| Already tested | Still symptomatic (obvious symptoms) | Step 1 suggestion |
|---|---|---|
| Kit 1 (testosterone) only | low energy, fatigue, poor recovery | Kit 2 — Energy & Recovery |
| Kit 2 (energy/recovery) only | low drive, libido, mood | Kit 1 — Testosterone |
| Kit 3 (superset) | — | none left → **GP** |

This mirrors the existing complement cross-sell rule (`2026-07-08-post-result-cross-sell-complement-rule.md`) and what the engine already shows as a secondary CTA on a normal-T Kit 1 card. **Keep the symptom list as short as possible** — the most obvious links only; an exhaustive symptom list is neither possible nor the point, and everything not on it goes to GP.

**Why framed this way (compliance):** "still not right despite clear results → here's the panel we haven't checked, then your GP" is honest and ASA-defensible. "Still feel bad → buy the same kit again sooner" reads as manufacturing a repeat purchase. The honest framing is also the better clinical answer, so we lose nothing by using it. The scope limit above *is* the anti-upsell guardrail: step 1 can only offer an untested panel, so it can never become "buy the next thing" — and where nothing fits, the answer is GP, which we do not sell.

**Approval — DECIDED (Keith 2026-07-17): build the mechanism now, no separate gate.** The overlay logic, the untested-panel scope limit, the GP fallback, and wiring to the symptom answers can all be built immediately — the scope limit makes the mechanism self-policing, so it needs no bespoke clinical approval. Two narrow items still take Ewa's tick **before the feature is shown to customers** (neither blocks starting the build):

1. **The red-flag / GP-first line — genuinely clinical, do not self-author.** Which symptoms mean "straight to GP" rather than "check another panel" is a patient-safety boundary; getting it wrong sends a symptomatic man to a checkout instead of a doctor. A short Ewa tick, not an approval process, but the one input we should not write ourselves.
2. **The two on-screen symptom → panel wordings** ride the **standard results-copy sign-off** every results string already takes — not a new gate; trivial while the list stays this short.

**Cadence numbers — AGREED, not a blocker (Keith 2026-07-17).** The all-clear cadence of **6–12 months** is already the agreed figure — it is what the marketing site (how-it-works, FAQ, LPs) already states and was signed off there. The dashboard button's "3 months" and the card copy's "3–6 months" are therefore **drift to correct down to the agreed 6–12 months** — an alignment job, not a new clinical decision. The only thing that was ever genuinely open was whether 6–12 months still suits someone in range but still symptomatic, and the symptom overlay above is the answer to that. So nothing here blocks the button fix.

**Buildable, not hypothetical:** the engine already collects the person's symptom answers (`symptomAnswers` in the classifier input), so a symptom-conditional cadence has the data it needs.

**Open for Ewa (see Q4 below):** a light copy pass on the short symptom → panel wordings above; where the GP-first red-flag line sits; and whether an earlier *repeat of the same marker* is ever right for a symptomatic-but-clear person (e.g. a borderline trend), and if so the floor (not sooner than X).

---

## 3. The table

Columns: result state → the band that triggers it → what CTA the card shows today → **proposed** retest interval → **Ewa — agreed** (yours to fill) → notes / current-copy conflict.

### Bucket A — Clinician-managed (GP-routed; no Andro Prime retest interval)

> ✅ **SIGNED 2026-09-15 (Ewa, Q3 = A).** *"No Andro Prime retest interval at all. The GP directs
> the timing, and our card shows the referral rather than a retest date."* Every row below is
> `clinician-led`. **All ten rows are covered**: the eight this table was sent with, plus
> `high-testosterone` and `high-vitamin-d`, which her Q3 enumerated by band and which were added as
> rows on 2026-09-15 (see the note under the table). The prepaid sub-12 confirmatory recheck she
> signed on 2026-07-26 is untouched and is the carve-out named in §3a rule 2.

| Result state | Band | Card CTA today | Proposed cadence | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| severely-low-testosterone | T < 5.2 nmol/L | GP referral | Per GP / endocrinology | ✅ **clinician-led, no date** (2026-09-15) | Card already flags endocrinology. |
| low-testosterone | T 5.2–8 | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | |
| equivocal-testosterone | T 8–12 | GP referral | Per GP (confirm) | ✅ **clinician-led, no date** (2026-09-15) | GP to repeat + interpret with free-T. Prepaid `confirm` recheck (0 days, Ewa 2026-07-26) is separate and survives, per §3a rule 2. |
| critically-low-vitamin-d | < 25 nmol/L | GP referral | Per GP (recheck after loading dose) | ✅ **clinician-led, no date** (2026-09-15) | Loading-dose recheck is GP-led; often ~3 mo but their call. |
| high-crp | > 10 mg/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | Not a self-retest; needs investigation. |
| low-ferritin | < 30 µg/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | Iron dosing is clinician-managed. |
| high-ferritin | > 300 µg/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | Needs follow-up panel, not a home retest. |
| low-albumin | < 35 g/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | Separate clinical cause to establish first. |
| high-testosterone | T > 29 nmol/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | **Row added 2026-09-15**; band signed 2026-08-07 (CA-044, *"over 29+"*). A supraphysiological reading is what exogenous testosterone use looks like, so the referral is the answer and a retest date would be the wrong one. Deliberately **not** in `LOW_T_STATES`: it needs the GP referral without the low-T nurture opt-in. 🔴 **Card copy still unapproved, CA-044 item A.** |
| high-vitamin-d | > 250 nmol/L | GP referral | Per GP | ✅ **clinician-led, no date** (2026-09-15) | **Row added 2026-09-15**; band signed 2026-08-07 (CA-044), on her own framing: *"a high/clinical review flag rather than just a technical out-of-range result"*. GP-blocked, so the D3 supplement CTA is suppressed on that card — the last thing a man above the ceiling should be offered is more D3. 🔴 **Card copy still unapproved, CA-044 item A.** |

🔴 **One cell is still missing, and it is a third state nobody had listed:** `fai-reported` (Free Androgen Index, report-only per Ewa ruling 8) has no row here and no entry in the rule-kind map. Found 2026-09-15 by diffing the table against the `ResultState` union rather than by reading either document. **No kind holds "we draw no conclusion from the number, so we recommend no retest of it"**, and `clinician-led` must not be borrowed for it, because that asserts a GP referral on a marker that carries none — which is the FAI `default:` defect in a new place.

✅ **BOTH ROWS ADDED 2026-09-15, AND THE SIGN-OFF THEY RECORD ALREADY EXISTED.** Verified against the
primary source rather than inferred: the Q3 question as sent (Gmail thread `1a0791e8fa8ed170`,
19:46 UTC) enumerates the GP-routed states by band and **ends with "testosterone above 29 nmol/L,
vitamin D above 250 nmol/L"**. Ewa answered **A**. So her answer covered **ten states**, and this
table only ever had eight rows to put them in.

⚠ **The gap was in the table, never in the ruling**, and that distinction is what made this safe to
close without a new ask. The two bands existed in `thresholds.md` from 2026-08-07 but were never
carried into this pack, so the table under-described bucket A at the moment it was sent. **Two
records of the same answer disagreed, and the thinner one was the one the build was reading.**

🔴 **A separate gate on these two rows, and it is still open.** The *cadence* is signed; the **card
copy** for both states is **drafted, not approved**, and has been rendering to customers since
2026-08-07 — `biomarker-copy.ts:81` and `:170`, CA-044 §2 item A. Re-checked 2026-09-15: both
`NOT APPROVED` markers are still in the source and no later approval exists. **That blocks the
wording on those cards; it does not block the cadence cell, which carries no date and no copy.**

### Bucket B — Acting on a finding (retest to see if it moved)

> ✅ **SIGNED 2026-09-15 (Ewa, Q2 = A): "3 months for all of them."** She took the flat option over
> the split (B) and the wider window (C). **This TIGHTENS two proposed cells rather than confirming
> them** — normal-testosterone (low half) was proposed at 3–6 months and suboptimal-ferritin at 3–4,
> and both are now 3. Do not carry the old ranges into the lookup.
>
> ⚠ **One row is NOT signed and one is signed only in half**, see the two notes under the table.

| Result state | Band | Card CTA today | Proposed cadence | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| normal-testosterone (low half) | T 12–20 | Supplement waitlist (+ Kit 2 cross-sell) | 3–6 months | ✅ **3 months** (2026-09-15) — *narrowed from the proposal* | Zinc/Daily Stack nudge; retest to see effect. Borderline sub-band (12–<15) also feeds seq-03d. |
| low-vitamin-d | 25–50 nmol/L | Supplement waitlist | 3 months | ✅ **3 months** (2026-09-15) | D3 reaches steady state ~8–12 weeks. |
| low-b12 | Active B12 < 25 | Supplement waitlist | 3 months | ✅ **3 months** (2026-09-15) | Or GP follow-up if absorption suspected. |
| borderline-b12 | Active B12 25–70 | Supplement waitlist | 3 months | ✅ **3 months** (2026-09-15) | NG239 indeterminate band; often rechecked. |
| elevated-crp / moderate-crp, **joints = no** | hs-CRP 1–3 / 3–10, joints = no | Lifestyle guidance | 3 months | ✅ **3 months** (2026-09-15, first packet Q2) | |
| elevated-crp / moderate-crp, **joints = yes** | hs-CRP 1–3 / 3–10, joints = yes | Supplement waitlist | 3 months | ✅ **3 months** (2026-09-15, **follow-up packet Q2 = A**) | Asked separately rather than inferred: her first answer scoped itself to "no joint symptoms". Same window confirmed, not assumed. |
| suboptimal-ferritin | 30–100 µg/L | None (dietary guidance) | 3–4 months | ✅ **3 months** (2026-09-15) — *narrowed from the proposal* | Dietary iron; GP if it does not improve on retest. |
| ft-low | Free T below lab range | None (discuss with doctor) | Per context / 3–6 months | ✅ **3 months** (2026-09-15, **follow-up packet Q1 = A**) | She took the "same as the other markers someone is acting on" option over the maintenance and the no-date options. |

### Bucket C — All-clear / maintenance (long window; **the button currently says "3 months" here — this is the fix**)

The "proposed cadence" here is the **default for someone in range and feeling well**. Apply the §2a symptom overlay: still symptomatic → test wider / GP, not an early repeat of the same marker.

> ✅ **SIGNED 2026-09-15 (Ewa, Q1 = A): 6 to 12 months, as currently written.** She took the
> as-is option over 12 months (B), 6 months (C) and something else (D). **No copy sweep is
> triggered**: the dashboard, FAQ, how-it-works page and the two landing pages all already say
> this, so the effect of signing is to make the value binding rather than incidental.
>
> 🔴 **She signed 7 of these 11 rows, not all 11.** Her Q1 enumerated the states it covered, and
> four rows are not among them. They are marked below and stay inert.

| Result state | Band | Card CTA today | Proposed cadence (default, feeling well) | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| optimal-testosterone | T > 20 nmol/L | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | Card copy conflict already fixed before signing; now binding. |
| shbg-normal | within lab range | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | Her Q1 named "normal SHBG". |
| shbg-low | below lab range | **Retest CTA** | 6–12 months | 🔴 **3 months** (2026-09-15, **follow-up Q3 = B**) — **NOT a maintenance rule** | She declined A (6–12, same as normal SHBG). ⚠ **This is a change of KIND, not of value: it leaves bucket C's `maintenance` shape entirely.** See the note under this table. |
| shbg-high | above lab range | **Retest CTA** | 6–12 months | 🔴 **3 months** (2026-09-15, **follow-up Q4 = B**) — **NOT a maintenance rule** | As above. GP only if free-T also low. |
| ft-normal | within lab range | None | 6–12 months | ✅ **6–12 months** (2026-09-15) | Her Q1 named "normal free T". |
| normal-vitamin-d | 50–250 nmol/L | **Retest CTA** | Seasonal — retest heading into winter (~Oct) | ✅ **SEASONAL, as it stands** (2026-09-15, **follow-up Q5 = A**) | She declined B (6–12 months, drop the seasonal framing) and C (both). ✅ **The lookup now has a shape for it: the `seasonal` kind, built 2026-09-15. See the note under this table.** No copy change; the card already says it. |
| normal-crp | ≤ 1 mg/L | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | Her Q1 named "normal CRP (at or under 1 mg/L)". |
| normal-ferritin | 100–300 µg/L | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | |
| normal-b12 | Active B12 > 70 | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | Card copy already aligned (plant-based caveat). |
| normal-albumin | ≥ 35 g/L | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15) | |
| normal (default / unmapped marker) | in reference range | **Retest CTA** | 6–12 months | ✅ **6–12 months** (2026-09-15, **follow-up Q6 = A**) | ⚠ **She declined B, "no default at all".** That was the safer construction and the one §2 of the design doc argues for off the back of the `BADGES` defect. **A marker added later now inherits 6–12 months silently rather than showing no date.** Her call, recorded so the next marker's author knows. |

### Outside the three buckets — Report-only (no verdict, therefore no retest recommendation)

> ⚠ **THIS SECTION IS NOT PART OF CA-047 AND WAS NOT PUT TO EWA IN EITHER ROUND.** It is here
> because the row has to exist somewhere and this is the sign-off record — but the signature it
> cites is **ruling 8 of 2026-06-16**, not the 2026-09-15 cadence pack. Recorded as its own section
> rather than dropped into bucket A, B or C, because putting it in one of those would claim a
> sign-off that did not happen.

| Result state | Band | Card CTA today | Proposed cadence | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| fai-reported | Free Androgen Index, deliberately not banded | None (no CTA under any circumstance) | None — we draw no conclusion, so we recommend no retest | ✅ **`none`, no date** — **derived** from ruling 8 (2026-06-16), Keith 2026-09-15 | **Row added 2026-09-15.** 🔴 NOT `clinician-led`: that renders a GP referral and FAI carries none. |

🔴 **This row is DERIVED, and every other row in this table is SIGNED. The difference matters.**
Ruling 8 — *"report-only, do not band it in men"* — is a ruling about **banding**, not about
cadence. What makes the derivation safe is that the cell records the **absence** of a
recommendation: it adds no claim, so it cannot overstate her. ⚠ **Giving FAI an actual retest date
would be a new clinical claim and needs Ewa.**

🔴 **How it was found, because the next one will be found the same way or not at all.** It was in
**neither** this table nor the rule-kind map, and never had been — so it survived two sign-off
rounds and three separate recorded counts of "every row is ruled", **every one of which counted the
rows that existed.** An item absent from every record is invisible to any check that reads a
record. It surfaced only by diffing both documents against the engine's own `ResultState` union,
while testing a just-written claim that the map was complete. That diff now runs on every build:
`09_website-app/frontend/scripts/verify-cadence-coverage.js`.

---

### 🔴 Two of these answers changed the SHAPE of the map, not just its values

**1. SHBG low and high are no longer maintenance states.** Both sat in this bucket at a proposed
6–12 months and both came back at **3 months**. In the design (`2026-09-06-result-driven-retest-cadence.md`
§3) `maintenance` is `{ fromMonths, toMonths }` and a 3-month interval is a `recheck`, which is
`{ days: n }`. **So these two rows keep their bucket C band definitions but carry a bucket B rule
kind.** The bucket headings are a presentational grouping in this document; the KIND is what the
lookup stores, and for these two they now disagree. Do not let the heading pick the kind.

⚠ **Knock-on, already applied:** `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2 carves
out "the bucket B clinical interval" and **enumerates the markers by name**. That list was written
before this answer and is now short by four: `ft-low`, the CRP joints = yes branch, `shbg-low` and
`shbg-high`. All four carry `recheck` rules at 90 days and belong inside the carve-out.

**2. `normal-vitamin-d` could not be expressed by any of the four kinds.** ✅ **RESOLVED 2026-09-15,
by design rather than by another question.** "Retest heading into autumn or winter" is neither
`{ days: n }` nor `{ fromMonths, toMonths }`, and it is certainly not `clinician-led`. Her Q5 = A
ratified the seasonal rule that the card has stated for months, which is the right clinical answer
and changes no copy. **`RETEST_CADENCE` therefore needed a fifth kind before this cell could be
filled at all**, or this row would quietly fall back to `clinician-led` and show a man no date on a
perfectly normal result. That kind now exists — `seasonal`, in
`2026-09-15-seasonal-retest-rule-kind.md` and `lib/results/retestCadence.ts` — and it resolves to a
**sampling window** against the result date rather than to an elapsed interval. **Nothing in her
ruling or her wording changed, and no copy moved.**

---

## 3a. NEW, added 2026-09-07: what happens when one panel carries two different answers

**This is the question I would most want your eye on, and it did not exist when this pack was
written**, because the table above rules on one marker at a time and a Kit 3 result carries nine.

A man's panel can easily produce a **GP-routed marker** (bucket A) and a **correctable deficiency**
(bucket B) in the same result. The system has to produce **one** retest date from nine states.

> 🔴 **RULED 2026-09-15 (Ewa, Q4 = C). THE PROPOSED RULE 1 IS REJECTED.** She took (c): *"The
> vitamin D retest is scheduled normally. The two markers are unrelated and the GP referral does
> not conflict with it."* Not (a) as proposed, and not (b), which was the author's stated instinct.
> **This is the single highest-blast-radius answer in the packet** and it inverts the reduction
> rule rather than confirming it.

**The rule as proposed, kept struck so the change is visible rather than silent:**

1. ~~If any marker is **clinician-led** (bucket A), the automated retest is **suppressed**, EXCEPT~~
   **REJECTED 2026-09-15.**
2. a **confirmatory recheck always wins** and is never suppressed (today that is only the sub-12
   testosterone bands, which you signed on 2026-07-26), then
3. otherwise the **shortest interval** among the remaining markers wins.

### ✅ The rule as SIGNED, 2026-09-15

**Retest timing is decided per marker, never per panel.** A GP referral removes the date for the
marker that triggered it and touches nothing else on the result.

1. A **clinician-led** marker contributes **no date** (bucket A, her Q3 = A). It does not suppress
   any other marker's date.
2. A **confirmatory recheck always wins** (unchanged; sub-12 testosterone, signed 2026-07-26).
3. Otherwise the **shortest interval among the markers that have a date** wins.

**The worked example resolves as:** CRP 14 mg/L produces a GP referral and no date; vitamin D 38
nmol/L produces a 3-month retest; the man gets **both**, and the whole-panel date is 3 months.

**Her answer to the related boundary is therefore YES**, explicitly: a GP referral and one of our
retests **do** coexist, and a GP referral is **not** the end of our involvement for that panel.

⚠ **Two things this makes true that the suppression rule would have prevented, and both need
watching rather than assuming:**

- **The anti-upsell guard is gone from this layer.** The design doc's §4 rule 1 was the mechanism
  stopping a man being sent to a doctor and scheduled a kit in the same breath. That guard now rests
  **entirely** on `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` and on CA-014's
  no-upsell-on-a-GP-referral rule. Neither was written to carry it alone. Re-read both against this
  ruling before building.
- ✅ **SETTLED 2026-09-15 (Keith): bucket B is OUTSIDE the prepaid rule, and the cell stores
  `{ days: 90 }` rather than the phrase "3 months".** So a vitamin D retest alongside a GP referral
  schedules normally and may be offered to a man holding no entitlement. Reasoning:
  `2026-09-07-fast-recheck-must-be-prepaid-or-included.md` §2a.
  ⚠ **An earlier version of this line said "3 months is exactly 90 days". That was wrong.** Three
  calendar months is **89 to 92 days** depending on when the sample was taken, and 58 of 1096 start
  dates across 2026 to 2028 fall under 90, all in late January or February. Had this stayed a
  phrase rather than a number, the commercial rule would have applied to about 5% of men on the
  basis of nothing but the month they tested in. **Store the integer, never the phrase.**

## 4. The questions this table answers for you

1. ~~**All-clear cadence:** is Bucket C 6 months, 12 months, or a range?~~ **SETTLED (Keith 2026-07-17): 6–12 months, already agreed and live on the marketing site.** The button/card fix is alignment to this, not a new decision.
2. **Does optimal-T differ from the healthy nutrient markers,** or is one interval fine across Bucket C? (Minor — 6–12 months covers all of Bucket C unless Ewa wants a split.)
3. **Is 3 months (90 days) strictly a Bucket-B "acting on a finding" window,** never for a healthy man? (Already reflected in the buckets; confirm only if convenient.)
4. **The symptom overlay (§2a):** the ordered path is **(1) check a not-yet-tested panel we supply, (2) failing that, GP** — never an early repeat of the same in-range marker. The scope limit is self-policing, so this needs **no separate approval gate**. What's left for you is light and rides the normal results-copy sign-off:
   - (a) ✅ **SIGNED 2026-09-15 (follow-up packet Q7 = A), both wordings verbatim as proposed.** She
     declined B (with changes) and C (go straight to GP, no panel suggestion). The two sentences:

     > "Your testosterone results are in range. If you are still not feeling right, the markers
     > behind energy and recovery are the next sensible thing to look at: Vitamin D, Active B12,
     > ferritin and hs-CRP. If you would rather not test again, speak to your GP."

     > "Your energy and recovery markers are in range. If you are still not feeling right,
     > testosterone is the next sensible thing to look at. If you would rather not test again,
     > speak to your GP."

     🔴 **THIS COPY DOES NOT EXIST IN THE PRODUCT.** It was written for the packet and ratified
     there, so it is signed but unbuilt. Building it is a copy change and **owes its own compliance
     pre-flight**, exactly like Q4(b). ⚠ **It shares a screen with Q4(b), so the composite needs
     the full escalation stack in order: the 999 block, then the red-flag GP list, then this panel
     suggestion.** Pre-flighting this sentence alone would miss that.
   - (b) ✅ **SIGNED 2026-09-15 (Ewa, Q5 = A), as drafted, with no additions or removals.** The line where someone **skips step 1 and goes straight to GP** is:

     > chest pain, breathlessness at rest or on light exertion, unexplained weight loss, blood in
     > stool or urine, a new lump, fainting, or any symptom that is new and getting worse week on
     > week.

     She took (A) over (B) "as A, with your additions or removals" and (C) "a different rule
     entirely", so the list is ratified verbatim rather than in substance. It closes owed item 6 in
     `retest-mechanism-map.md` §6.

     🔴 **THE PRE-FLIGHT RAN 2026-09-15 AND DID NOT CLEAR. THIS LINE MAY NOT SHIP AS WRITTEN.**
     The deterministic floor is clean (0 HARD / 0 REVIEW), but the judgement pass found that the
     list routes **all** chest pain to a GP, which contradicts Ewa's own standing ruling of
     **2026-08-18: "999 for sudden or severe, GP for the rest"**
     (`../../03_compliance/correspondence/2026-08-18-keith-ewa-fifteen-rulings.md`, Ruling 1).

     **This is not a reviewer error.** Q5 asked which symptoms skip the "try another panel" step,
     not 999 versus GP, so the escalation is a **layer above** her answer rather than a correction
     to it. Her list is almost word-for-word the GP half of the two-part block already live on
     `cholesterol-test`.

     ✅ **The fix is additive, carries her own signed wording and needs no new ask** (the 2026-08-18
     sweep established that restoring signed wording verbatim raises no CA). When this line is
     built into a screen it gains a **"Read this part first. Call 999 now if:"** block above the GP
     list: *"You have sudden or severe chest pain, pain that spreads to your arm, neck, jaw or
     back, or chest pain with breathlessness, sweating or feeling sick. Don't talk yourself out of
     it. Rule out your heart first, every time."*

     ⚠ **Carry that sweep's derivative trap:** its frontmatter FAQ needed the line too and was
     nearly missed, because it is machine-read into FAQ schema. **Check every surface this lands on
     for a second, machine-read copy.**
   - (c) ✅ **SIGNED 2026-09-15 (follow-up packet Q8 = A): NO FLOOR, because there is no case.** She
     took *"we should never repeat the same in-range marker early. A different panel or his GP is
     the answer"* over 3 months, 6 months and a stated alternative. **So the engine needs no
     early-repeat floor at all**, which is simpler than any of the numbers: the §2a widen-first path
     is the whole answer and there is no exception to code around it.

If a single number per bucket is easier than per-row, just set the bucket-level number and note any exceptions.

---

## 5. What changes once you sign

> 🔄 **Rewritten 2026-09-07. The four items that used to be here are DONE**, which is why this pack
> stopped being urgent and then quietly became more important. The dashboard button, the card copy
> and the marketing pages were all aligned to 6-12 months between July and September.

What signing does now:

- **It fills the cadence lookup.** Each row you rule on becomes one cell of
  `RETEST_CADENCE`, the single map every retest mechanism in the product reads from
  (`2026-09-06-result-driven-retest-cadence.md`). Today eight separate mechanisms each carry their
  own interval and only one of them looks at the result.
- **Unsigned cells stay inert by construction.** Anything you have not ruled on returns
  "clinician-led, no Andro Prime date". Nothing fires on your silence, and nothing needs to be
  held back manually.
- **§3a decides what a mixed panel does**, which no current rule covers.
- **The copy layer is already aligned**, so signing 6-12 months for bucket C changes no customer
  copy at all. It just makes the value binding rather than incidental.

**A constraint you should know about, because it limits what a fast interval can do.** Keith adopted
a rule on 2026-09-07: **a result-triggered recheck under 90 days must be prepaid or included in
something the customer already holds, and may never trigger a new sale**
(`2026-09-07-fast-recheck-must-be-prepaid-or-included.md`). So where the clinically right answer is
a fast recheck and the man holds no bundle or membership, the system offers the GP route or the long
window, never a checkout. **You should rule on the clinically correct interval and ignore this**; it
constrains what we may do commercially with your answer, not what your answer should be.

No copy or code change is made against any row until this sheet is signed.

---

## 6. Sign-off

| | Name | Decision | Date |
|---|---|---|---|
| Clinical (cadence), round 1 | Dr Ewa Lindo | ✅ **Agreed with edits.** Direct written reply from `ewalindo@live.co.uk`, 2026-09-15 20:18 UTC, thread `1a0791e8fa8ed170`: `1: A 2: A 3: A 4: C 5: A`. Q4 = C **rejects** the §3a suppression rule; Q2 = A **narrows** two proposed cells to 3 months. **Covered 23 of 28 rows** — credited as 21 of 26 at the time, because its Q3 ruled ten GP-routed bands and the table then had only eight rows to hold them | 2026-09-15 |
| Clinical (cadence), round 2 | Dr Ewa Lindo | ✅ **Agreed with edits.** Direct written reply, 2026-09-15 21:33 UTC, thread `1a0a6ded1d6d688b`: `1: A 2: A 3: B 4: B 5: A 6: A 7: A 8: A`. Q3 and Q4 = B **move both SHBG states off the maintenance kind**; Q5 = A keeps the seasonal rule, which the lookup now stores as the `seasonal` kind. **Closes the remaining 5 rows, the joints branch, and §4 Q4(a) and Q4(c)** | 2026-09-15 |
| Business | Keith Antony | ✅ **APPROVED.** Direct instruction, "CA-47 approved" | 2026-09-15 |
| Compliance pre-flight (final copy) | | 🔴 **RAN AND DID NOT CLEAR.** Deterministic floor clean; the judgement pass found the missing 999 escalation on Q4(b). **Q4(a)'s newly-signed copy has not been pre-flighted at all** and shares the same screen | 2026-09-15 |

**Evidence.** Sign-off email sent 2026-09-15 19:46 UTC (Gmail `1a0a69ae55223fe0`), reply
2026-09-15 20:18 UTC (`1a0a6b82da681639`), both on thread `1a0791e8fa8ed170`. Compliance record:
**CA-047**. The five questions and their lettered options are quoted verbatim in the approval
record, because the letters are meaningless without them.

**Signing does not ship anything.** It fills 21 cells of `RETEST_CADENCE`. The build, the §3a rule
change, and the red-flag copy each need their own step, and the red-flag line needs a pre-flight.
