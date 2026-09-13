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
 *   active B12 74     -> `normal-b12`             (was `borderline-b12`: BAND CROSSED)
 *   hs-CRP 1.1        -> `elevated-crp`           (was `elevated-crp`: same band, fell)
 *   ferritin 96       -> `suboptimal-ferritin`    (was `suboptimal-ferritin`: same band, rose)
 *
 * ⚠ TWO OF NINE CROSS A BAND AND SEVEN DO NOT, deliberately. A retest where
 * everything resolves is a pitch. Both crossings are on markers we sell a
 * product against and hold an EFSA claim for; nothing on the testosterone half
 * crosses anything, which is the whole point of the shape.
 *
 * ⚠ HIS FLAGS DO NOT CHANGE, so the NEXT retest is a Kit 3 too. Total
 * testosterone and free testosterone are still flagged, hs-CRP and ferritin are
 * still flagged, and the rule reads the latest result. That is correct and it
 * is the demo's own argument: the markers that need a doctor did not move,
 * and the app keeps saying so rather than quietly dropping them.
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
        // Was 44, inside NG239's indeterminate 25 to 70. Now above it.
        name: 'Active B12',
        value: 74.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'optimal',
      },
      {
        // Was 1.9. Fell, but 1.1 is still inside the same band, so the verdict
        // does not change and the screen says so rather than celebrating.
        name: 'hs-CRP',
        value: 1.1,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'borderline',
      },
      {
        // Was 71. A real rise, still under 100, so still the same band.
        name: 'Ferritin',
        value: 96.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'borderline',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
