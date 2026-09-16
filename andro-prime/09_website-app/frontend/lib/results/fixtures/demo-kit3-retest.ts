import type { ScenarioFixture } from './fixture-types'

/*
 * THE DEMO'S SECOND PURCHASE. Kit 3, NINE markers, collected 8 November 2026.
 * Rewritten 2026-09-13, replacing `demo-kit2-retest`.
 *
 * 🔴 THE RETEST IS THE SAME KIT AS THE FIRST BUY, AND THAT IS D1.
 * Keith, 2026-09-13: *"If someone initially purchased Kit 3 and then has
 * markers in Kit 3 that belong to Kit 1 and 2, then we just send out a Kit 3."*
 * That is what `selectRetestPanel` already does, and it is what the shipped
 * rule returns for this man: he is flagged on six markers spanning both halves
 * of the panel, so the cheapest kit that measures all of them is the Kit 3 he
 * bought. The previous fixture typed `energy-recovery` here, which is the
 * single fact that made the demo disagree with the job.
 *
 * ⚠ THIS SUPERSEDES THE 2026-09-07 RULING, deliberately and in one direction
 * only. That ruling was *"the initial buy is Kit 3 and the rebuy or retest is
 * Kit 2."* The first half stands and is untouched. The second half does not:
 * it hard-coded a kit, which is exactly the thing D1 was raised to remove.
 *
 * 🟢 WHAT THE OLD FIXTURE WAS PROTECTING, AND WHERE IT WENT. Its argument was
 * that a Kit 2 retest leaves five markers with no second point, so the Record
 * tab can teach "what moved, and what was never re-measured". That teaching
 * point is not lost, it is made a different way: **all nine markers now have
 * two points, and the four we sell against are the four that moved.** The
 * contrast carries the argument the omission used to carry, and carries it
 * where a reader can see both halves at once rather than inferring one.
 *
 * 🔴 THE HORMONE HALF DRIFTS DOWN, AND THAT IS A COMPLIANCE DECISION, NOT A
 * DATA-ENTRY ONE. Keith ruled it on 2026-09-13, shown all three options.
 * Testosterone edges DOWN over the ninety days while vitamin D, B12, hs-CRP and
 * ferritin all improve. Two reasons, and the second is the load-bearing one:
 *
 *   1. It is the prototype's own finding made visible instead of implied. Its
 *      walkthrough said *"Barely moved, because it does not move on anything we
 *      sell."* A flat line says that by omission; a line that drifts the wrong
 *      way says it outright, and it is the honest shape of a man who took D3
 *      for a quarter and has an equivocal testosterone he has not acted on.
 *   2. **We hold no claim that anything we sell raises testosterone.** The one
 *      signed claim adjacent to it (CA-042, claim 12, Ewa 2026-08-18) is
 *      *"vitamin D supplementation modestly increased serum testosterone in
 *      deficient men over a year"* -- observational, modest, and over a year.
 *      This retest is at day 90. A visible rise here would be the closest thing
 *      on the site to an efficacy claim, and CA-032 changed a headline over
 *      less. Drifting down asserts nothing in any direction.
 *
 * ⚠ THE THREE HORMONE NUMBERS ARE COUPLED AND MUST STAY COUPLED. The report's
 * own copy tells the reader that FAI "expresses your total testosterone as a
 * percentage of your SHBG" (`biomarker-copy.ts`), and that free testosterone is
 * "the calculated figure your results are based on". So these are not five free
 * values, they are two chosen ones and three that follow:
 *
 *   FAI = Testosterone / SHBG x 100  ->  10.1 / 34.6 x 100 = 29.19, shown 29.2
 *   Free T tracks the same ratio     ->  ratio falls 5.2%, so 0.19 -> 0.180
 *
 * If testosterone or SHBG is ever edited here, recompute both or the screen
 * will contradict the paragraph printed underneath it.
 *
 * 🔴 NO VERDICT IS TYPED HERE. `classify()` decides, reading
 * `04_products/results-engine/thresholds.md`. Expected states, recorded so a
 * threshold move shows up as a diff:
 *   testosterone 10.1 -> `equivocal-testosterone` (was `equivocal-testosterone`: same band, fell)
 *   SHBG 34.6         -> `shbg-normal`            (was `shbg-normal`)
 *   free T 0.180      -> `ft-low`                 (was `ft-low`: same side of the floor, fell)
 *   albumin 43.6      -> `normal-albumin`         (was `normal-albumin`)
 *   FAI 29.2          -> `fai-reported`           (report-only, Ewa ruling 8)
 *   vitamin D 58      -> `normal-vitamin-d`       (was `low-vitamin-d`: BAND CROSSED)
 *   active B12 96     -> `normal-b12`             (baseline now 88: rose inside the band)
 *   hs-CRP 0.4        -> `normal-crp`             (baseline now 0.6: fell inside the band)
 *   ferritin 168      -> `normal-ferritin`        (baseline now 142: rose inside the band)
 *
 * 🔄 AMENDED 2026-09-16, AND THE AMENDMENT CAME FROM THE BASELINE. Ewa's CA-046
 * Q2 = C normalised active B12, hs-CRP and ferritin in `demo-kit3-baseline.ts`.
 * This file's three matching values were written as improvements ON THE OLD
 * BASELINE, so leaving them alone would have inverted every one of them: 74
 * against 88 is a fall, 1.1 against 0.6 is a RISE BACK OUT of the normal band,
 * and 96 against 142 is a fall back into suboptimal. **The day-90 screen would
 * have shown a stranger a man deteriorating on two markers that had been fine**,
 * which is the opposite of what either fixture is for and is not something Ewa
 * was shown or ruled on. All three were re-pointed at the new baseline.
 *
 * ⚠ ONE OF NINE NOW CROSSES A BAND, NOT TWO. Vitamin D is the only crossing
 * left, because B12's crossing depended on a baseline that no longer exists. The
 * argument the old shape carried is unchanged and is now carried by one marker:
 * a retest where everything resolves is a pitch, so the four we sell against all
 * move and nothing on the testosterone half moves at all.
 *
 * 🟢 THE D1 ARGUMENT AT THE TOP OF THIS FILE STILL HOLDS, and the only thing
 * that changed is its arithmetic: "flagged on six markers spanning both halves"
 * is now flagged on THREE, still spanning both halves, so Kit 3 is still what
 * `selectRetestPanel` returns and `test-retest-panel` (6b) still passes.
 *
 * ⚠ WORTH THE SENTENCE, BECAUSE THIS CHANGE GOT IT WRONG FIRST. Normalising
 * active B12, hs-CRP and ferritin looks like it strips the energy half of every
 * flag and drops the man to a Kit 1. It does not: **vitamin D is an
 * energy-panel marker** (`KIT_PANELS['energy-recovery']`) and is still
 * `low-vitamin-d`. Testosterone and free testosterone hold the hormone half,
 * vitamin D holds the energy half, and the span survives on one marker instead
 * of four. The test caught the count and would not have caught the kit, because
 * the kit never moved.
 *
 * 🔴 AT THE NEXT RETEST IT DOES CHANGE, and that is a real consequence rather
 * than a comment. At day 90 vitamin D is `normal-vitamin-d`, so the only flags
 * left are testosterone and free testosterone, **both hormone**, and the rule
 * would return a Kit 1 for the retest after this one. The demo never renders
 * that: `selectRetestPanel` is not called anywhere on the demo path and
 * `retestKit` is read straight off `payload.kitType`. Recorded so the next
 * reader does not discover it as a surprise.
 *
 * ⚠ HIS HORMONE FLAGS DO NOT CHANGE. Total testosterone and free testosterone
 * are still flagged at day 90, and the rule reads the latest result. That is the
 * demo's own argument and it survives: the markers that need a doctor did not
 * move, and the app keeps saying so rather than quietly dropping them.
 *
 * ⚠ COLLECTED FOUR DAYS BEFORE THE RESULT, like the baseline, so `demo.ts`
 * derives a retest result on 12 November -- which is the first result plus
 * `FIRST_CYCLE_RETEST_DAYS`, and is also the prototype's D2. The interval is
 * imported from `entitlement.ts` rather than typed, so if the retest cadence
 * moves this fixture's date moves with it and the two cannot drift.
 *
 * ⚠ The `status` field is descriptive only. Nothing reads it.
 */
const fixture: ScenarioFixture = {
  name: 'demo-kit3-retest',
  label: 'Demo: Kit 3 retest, 90 days after the first result',
  testAge: 42,
  payload: {
    orderId: 'demo-order-kit3-retest',
    userId: 'demo-user',
    kitType: 'hormone-recovery',
    collectedAt: '2026-11-08T08:00:00Z',
    biomarkers: [
      {
        // Was 10.5. Drifted DOWN, still inside the lab's 8.64 to 29.00 and
        // still under the 12 our bands act on. Nothing we sell claims to move
        // this, and after ninety days it has not.
        name: 'Testosterone',
        value: 10.1,
        unit: 'nmol/L',
        referenceRange: { low: 8.64, high: 29.0 },
        status: 'borderline',
      },
      {
        // Was 34.1. Drifted up slightly, well inside the lab's interval. Chosen
        // with testosterone: the pair of them is what sets FAI and free T.
        name: 'SHBG',
        value: 34.6,
        unit: 'nmol/L',
        referenceRange: { low: 20.6, high: 76.7 },
        status: 'optimal',
      },
      {
        // Was 0.19. The T/SHBG ratio fell 5.2%, so this falls with it. Still
        // under the calculated floor of 0.198, so the verdict does not change
        // and the screen says so rather than making anything of the movement.
        name: 'Free Testosterone',
        value: 0.18,
        unit: 'nmol/L',
        referenceRange: { low: 0.198, high: 0.619 },
        status: 'borderline',
      },
      {
        // Was 44.0. Albumin is stable in a healthy man over a quarter; this is
        // ordinary assay noise, not a trend, and it stays a long way inside.
        name: 'Albumin',
        value: 43.6,
        unit: 'g/L',
        referenceRange: { low: 35.0, high: 50.0 },
        status: 'optimal',
      },
      {
        // Was 30.8. DERIVED: 10.1 / 34.6 x 100 = 29.19. Report-only in men
        // (Ewa ruling 8, 2026-06-16). Shown, never concluded from, and it draws
        // a hollow pin with no band behind it.
        name: 'Free Androgen Index',
        value: 29.2,
        unit: '%',
        referenceRange: { low: 35.0, high: 92.6 },
        status: 'low',
      },
      {
        // Was 31, under the lab floor. Now inside it. The band he crossed, and
        // the one the plan tab spent ninety days asking him to move.
        name: 'Vitamin D',
        value: 58.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 250.0 },
        status: 'optimal',
      },
      {
        // 🔄 CA-046 Q2 knock-on: was 74 against a baseline of 44, which crossed
        // NG239's indeterminate band. The baseline is now 88, already clear of
        // it, so 74 would have read as a fall. 96 rises inside the normal band.
        name: 'Active B12',
        value: 96.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'optimal',
      },
      {
        // 🔄 CA-046 Q2 knock-on: was 1.1 against a baseline of 1.9. The baseline
        // is now 0.6, so 1.1 would have been a RISE out of the normal band and
        // the day-90 screen would have shown a stranger a man getting worse on a
        // marker that had been fine. 0.4 keeps the direction of travel honest
        // and introduces no new verdict at retest.
        name: 'hs-CRP',
        value: 0.4,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'optimal',
      },
      {
        // 🔄 CA-046 Q2 knock-on: was 96 against a baseline of 71. The baseline is
        // now 142, so 96 would have been a FALL back into the suboptimal band.
        // 168 is a real rise that stays inside ours (100 to 300).
        name: 'Ferritin',
        value: 168.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'optimal',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
