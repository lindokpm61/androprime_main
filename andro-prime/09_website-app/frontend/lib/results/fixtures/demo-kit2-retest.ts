import type { ScenarioFixture } from './fixture-types'

/*
 * THE DEMO'S SECOND PURCHASE. Kit 2, FOUR markers, collected 8 November 2026.
 * Written 2026-09-07.
 *
 * 🔴 THE RETEST IS A DIFFERENT KIT FROM THE FIRST BUY, AND THAT IS A RULING.
 * Keith, 2026-09-07: *"the initial buy is Kit 3 and the rebuy or retest is
 * Kit 2."* The first purchase is the nine-marker Hormone & Recovery Check; the
 * included retest is the four-marker Energy & Recovery Check.
 *
 * 🟢 THE PROTOTYPE ALREADY IMPLIED THIS AND NOBODY HAD SAID IT OUT LOUD. Its
 * retest moved exactly these four values -- vitamin D 31 to 58, B12 44 to 74,
 * hs-CRP 1.9 to 1.1, ferritin 71 to 96 -- and left the five hormone markers
 * effectively static (testosterone 10.5 to 10.9, SHBG 34.1 to 36.0). Its own
 * walkthrough says why: *"Open Testosterone. Barely moved, because it does not
 * move on anything we sell."* Retesting on Kit 2 turns "barely moved" into "not
 * retested", which is the honest version of the same point and stops the demo
 * charting five near-identical pairs that mean nothing.
 *
 * 🔴 WHAT THAT DOES TO THE RECORD, and it is the whole reason the demo needed
 * rebuilding rather than patching. Only FOUR of the nine markers have two
 * points. The other five carry their August number with no second reading and
 * no movement word. `demo.ts` builds the row list from the Kit 3 panel and
 * attaches a retest reading only where one exists, which is the prototype's own
 * copy made literal: *"the panel a number came from is a detail on the row, not
 * a place you have to navigate to."*
 *
 * 🔴 NO VERDICT IS TYPED HERE. `classify()` decides, reading
 * `04_products/results-engine/thresholds.md`. Expected states, recorded so a
 * threshold move shows up as a diff:
 *   vitamin D 58   -> `normal-vitamin-d`      (was `low-vitamin-d`: BAND CROSSED)
 *   active B12 74  -> `normal-b12`            (was `borderline-b12`: BAND CROSSED)
 *   hs-CRP 1.1     -> `elevated-crp`          (was `elevated-crp`: same band, fell)
 *   ferritin 96    -> `suboptimal-ferritin`   (was `suboptimal-ferritin`: same band, rose)
 *
 * ⚠ TWO OF THE FOUR CROSS A BAND AND TWO DO NOT, deliberately. A retest where
 * everything resolves is a pitch. The prototype makes the same point in the
 * other direction by keeping testosterone flat; this fixture keeps it by
 * leaving ferritin and hs-CRP inside the bands they started in.
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
  name: 'demo-kit2-retest',
  label: 'Demo: Kit 2 retest, 90 days after the first result',
  testAge: 42,
  payload: {
    orderId: 'demo-order-kit2',
    userId: 'demo-user',
    kitType: 'energy-recovery',
    collectedAt: '2026-11-08T08:00:00Z',
    biomarkers: [
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
