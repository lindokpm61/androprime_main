# Retest cadence table — for Ewa sign-off

**Status:** PROPOSED (drafted 2026-07-17; **premise, §3a and §5 rewritten 2026-09-07** because the
copy drift this pack was written to fix had since been fixed, and the pack would have asked Ewa to
rule on a state of the world that no longer existed). **Every interval below is a draft for Ewa to
confirm, change, or reject. Nothing ships until Ewa signs.**
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

| Result state | Band | Card CTA today | Proposed cadence | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| severely-low-testosterone | T < 5.2 nmol/L | GP referral | Per GP / endocrinology | | Card already flags endocrinology. |
| low-testosterone | T 5.2–8 | GP referral | Per GP | | |
| equivocal-testosterone | T 8–12 | GP referral | Per GP (confirm) | | GP to repeat + interpret with free-T. |
| critically-low-vitamin-d | < 25 nmol/L | GP referral | Per GP (recheck after loading dose) | | Loading-dose recheck is GP-led; often ~3 mo but their call. |
| high-crp | > 10 mg/L | GP referral | Per GP | | Not a self-retest; needs investigation. |
| low-ferritin | < 30 µg/L | GP referral | Per GP | | Iron dosing is clinician-managed. |
| high-ferritin | > 300 µg/L | GP referral | Per GP | | Needs follow-up panel, not a home retest. |
| low-albumin | < 35 g/L | GP referral | Per GP | | Separate clinical cause to establish first. |

### Bucket B — Acting on a finding (retest to see if it moved)

| Result state | Band | Card CTA today | Proposed cadence | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| normal-testosterone (low half) | T 12–20 | Supplement waitlist (+ Kit 2 cross-sell) | 3–6 months | | Zinc/Daily Stack nudge; retest to see effect. Borderline sub-band (12–<15) also feeds seq-03d. |
| low-vitamin-d | 25–50 nmol/L | Supplement waitlist | 3 months | | D3 reaches steady state ~8–12 weeks. |
| low-b12 | Active B12 < 25 | Supplement waitlist | 3 months | | Or GP follow-up if absorption suspected. |
| borderline-b12 | Active B12 25–70 | Supplement waitlist | 3 months | | NG239 indeterminate band; often rechecked. |
| elevated-crp / moderate-crp (lifestyle branch) | hs-CRP 1–3 / 3–10, joints = no | Lifestyle guidance | 3 months | | Non-GP branch only; joints = yes → supplement waitlist, same window. |
| suboptimal-ferritin | 30–100 µg/L | None (dietary guidance) | 3–4 months | | Dietary iron; GP if it does not improve on retest. |
| ft-low | Free T below lab range | None (discuss with doctor) | Per context / 3–6 months | | Usually driven by high SHBG; if total-T also low → GP (combined-low copy). |

### Bucket C — All-clear / maintenance (long window; **the button currently says "3 months" here — this is the fix**)

The "proposed cadence" here is the **default for someone in range and feeling well**. Apply the §2a symptom overlay: still symptomatic → test wider / GP, not an early repeat of the same marker.

| Result state | Band | Card CTA today | Proposed cadence (default, feeling well) | Ewa — agreed | Notes |
|---|---|---|---|---|---|
| optimal-testosterone | T > 20 nmol/L | **Retest CTA** | 6–12 months | | Card copy currently says "3–6 months" — conflict to resolve. |
| shbg-normal | within lab range | **Retest CTA** | 6–12 months | | |
| shbg-low | below lab range | **Retest CTA** | 6–12 months | | Note-not-act in isolation; interpret with free-T. |
| shbg-high | above lab range | **Retest CTA** | 6–12 months | | As above; GP only if free-T also low. |
| ft-normal | within lab range | None | 6–12 months | | Card copy currently says "3–6 months" — conflict. |
| normal-vitamin-d | ≥ 50 nmol/L | **Retest CTA** | Seasonal — retest heading into winter (~Oct) | | Card already suggests autumn/winter; treat as its own seasonal rule, not a fixed month count. |
| normal-crp | ≤ 1 mg/L | **Retest CTA** | 6–12 months | | |
| normal-ferritin | 100–300 µg/L | **Retest CTA** | 6–12 months | | |
| normal-b12 | Active B12 > 70 | **Retest CTA** | 6–12 months | | Card copy already says "6–12 months" (plant-based caveat) — aligned. |
| normal-albumin | ≥ 35 g/L | **Retest CTA** | 6–12 months | | |
| normal (default / unmapped marker) | in reference range | **Retest CTA** | 6–12 months | | Card copy currently says "3–6 months" — conflict. |

---

## 3a. NEW, added 2026-09-07: what happens when one panel carries two different answers

**This is the question I would most want your eye on, and it did not exist when this pack was
written**, because the table above rules on one marker at a time and a Kit 3 result carries nine.

A man's panel can easily produce a **GP-routed marker** (bucket A) and a **correctable deficiency**
(bucket B) in the same result. The system has to produce **one** retest date from nine states.

**Proposed reduction rule, and the ordering is the whole question:**

1. If any marker is **clinician-led** (bucket A), the automated retest is **suppressed**, EXCEPT
2. a **confirmatory recheck always wins** and is never suppressed (today that is only the sub-12
   testosterone bands, which you signed on 2026-07-26), then
3. otherwise the **shortest interval** among the remaining markers wins.

**Rule 1 is the one that needs you.** It means a man with, say, a high CRP routing him to a GP
**and** a low vitamin D would get **no Andro Prime retest scheduled at all**, where today the
deficiency alone would have scheduled one. The reasoning is that a man being sent to a doctor should
not simultaneously be scheduled a kit by us, and that his GP may change everything anyway. **The
cost is that a genuine, correctable deficiency stops being followed up by us.**

Three ways it could go, and I have no view worth more than yours:

- **(a) As proposed.** GP routing suppresses everything. Safest on the "do not compete with the
  doctor" axis, weakest on deficiency follow-up.
- **(b) Suppress the retest but keep the guidance.** No date, no kit, but the card still says what
  the deficiency is and what to do about it. My instinct, but it is a clinical call.
- **(c) Let the deficiency schedule normally.** The GP referral and the retest are about different
  markers and do not conflict.

**A related boundary, also yours:** is there any result where a GP referral and one of our retests
should genuinely coexist, or is the GP referral always the end of our involvement for that panel?

## 4. The questions this table answers for you

1. ~~**All-clear cadence:** is Bucket C 6 months, 12 months, or a range?~~ **SETTLED (Keith 2026-07-17): 6–12 months, already agreed and live on the marketing site.** The button/card fix is alignment to this, not a new decision.
2. **Does optimal-T differ from the healthy nutrient markers,** or is one interval fine across Bucket C? (Minor — 6–12 months covers all of Bucket C unless Ewa wants a split.)
3. **Is 3 months (90 days) strictly a Bucket-B "acting on a finding" window,** never for a healthy man? (Already reflected in the buckets; confirm only if convenient.)
4. **The symptom overlay (§2a):** the ordered path is **(1) check a not-yet-tested panel we supply, (2) failing that, GP** — never an early repeat of the same in-range marker. The scope limit is self-policing, so this needs **no separate approval gate**. What's left for you is light and rides the normal results-copy sign-off:
   - (a) a **copy pass on the short symptom → panel wordings** in the §2a table (Kit 1→Kit 2, Kit 2→Kit 1) — kept deliberately minimal;
   - (b) where is the line where someone **skips step 1 and goes straight to GP** (red-flag symptoms / near-boundary results)?
   - (c) if a symptomatic person wants an early repeat of the *same* marker for a borderline trend, what floor (not sooner than X)?

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
| Clinical (cadence) | Dr Ewa Lindo | ☐ Agreed as drafted ☐ Agreed with edits (see column) ☐ Changes needed | |
| Business | Keith Antony | | |
| Compliance pre-flight (final copy) | | | |
