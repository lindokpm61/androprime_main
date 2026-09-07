import type { ScenarioFixture } from './fixture-types'

/*
 * THE PUBLIC DEMO'S SECOND POINT. Added 2026-09-07 for `/demo`'s member state.
 *
 * WHY IT EXISTS. The record tab needs two results and there was only ever one.
 * `buildDashboardFromScenario` stacks results of the same kit type, so passing
 * `['demo-kit3-split', 'demo-kit3-retest']` produces the two-point record
 * without any new machinery.
 *
 * THIS IS THE SAME MAN, 92 DAYS LATER. Every marker in `demo-kit3-split` is
 * here, in the same order, on the same reference ranges. Collected 2026-11-12,
 * which is the split fixture's result + 90 and the date the 2026-09-07 anchor
 * ruling puts the included retest on.
 *
 * 🔴 WHAT MOVED, AND THE RESTRAINT IS THE POINT. Three different outcomes, on
 * purpose, because a retest where everything clears is a pitch:
 *   - Active B12 45 -> 78 pmol/L. CLEARS: crosses NG239's 70 into `normal-b12`.
 *   - Ferritin 62 -> 92 ug/L. IMPROVES BUT DOES NOT CLEAR: a real 30-point rise
 *     that is still <= 100, so it stays `suboptimal-ferritin` and still reads
 *     Monitor.
 *   - Testosterone 14.2 -> 15.1 nmol/L. FLAT: still inside our 12 to 20 band,
 *     so it is STILL `normal-testosterone`.
 *
 * The two that move are the nutritional markers, which are the ones that
 * actually respond to supplementation over a 90-day window. Testosterone is
 * left flat because moving it would turn a demonstration into an efficacy claim
 * we have no evidence for.
 *
 * 🔴 FERRITIN IS THE ONE THAT CARRIES ITS WEIGHT TWICE. Ninety-two rather than
 * a clearing value is the honest outcome (iron stores rebuild slowly), and it is
 * ALSO what keeps the member state demonstrable: `markerToMove` in
 * `lib/membership/checkin.ts` only offers a daily loop for vitamin D, B12 and
 * ferritin, so if every movable marker cleared, the day-104 plan screen would
 * correctly show no loop and the demo would never show the check-in loop or the
 * adherence chart at all. An earlier draft used 108 and did exactly that.
 *
 * ⚠ NOTHING HERE CLAIMS A CAUSE. The record tab draws two points and never
 * joins them to an intervention. Whether the supplement moved the number is a
 * per-customer interpretation and is post-CQC, which is the same rule the
 * prototype records as the third of its three deliberate demonstrations.
 *
 * THE VERDICTS ARE THE ENGINE'S. `classify()` reads these values against
 * `04_products/results-engine/thresholds.md`; nothing is typed here. If a band
 * moves, this fixture follows it and the story above may stop being true. The
 * boundaries it was built against, read from `classifier.ts` on 2026-09-07:
 * ferritin <= 100 suboptimal and <= 300 normal; Active B12 <= 70 borderline and
 * above that normal; testosterone <= 20 normal.
 *
 * DERIVED VALUES, kept arithmetically honest against the new total:
 *   - Free Androgen Index = (15.1 / 33.0) x 100 = 45.8%.
 *   - Free Testosterone holds the 2.19% free fraction the split fixture uses,
 *     applied to 15.1: 0.33 nmol/L. Same unconfirmed derivation as that
 *     fixture's 0.31, and flagged the same way.
 */
const fixture: ScenarioFixture = {
  name: 'demo-kit3-retest',
  label: 'Demo: Kit 3 retest, 90 days on',
  testAge: 42,
  payload: {
    orderId: 'demo-order-retest',
    userId: 'demo-user',
    kitType: 'hormone-recovery',
    collectedAt: '2026-11-12T08:00:00Z',
    biomarkers: [
      {
        // Was 14.2. Still inside 12 to 20, so the verdict does not change.
        name: 'Testosterone',
        value: 15.1,
        unit: 'nmol/L',
        referenceRange: { low: 8.64, high: 29.0 },
        status: 'borderline',
      },
      {
        name: 'SHBG',
        value: 33.0,
        unit: 'nmol/L',
        referenceRange: { low: 20.6, high: 76.7 },
        status: 'optimal',
      },
      {
        // 2.19% of 15.1. See the header note: derived, not confirmed.
        name: 'Free Testosterone',
        value: 0.33,
        unit: 'nmol/L',
        referenceRange: { low: 0.198, high: 0.619 },
        status: 'optimal',
      },
      {
        name: 'Albumin',
        value: 44.0,
        unit: 'g/L',
        referenceRange: { low: 35.0, high: 50.0 },
        status: 'optimal',
      },
      {
        // (15.1 / 33.0) x 100. Report-only in men; shown, never concluded from.
        name: 'Free Androgen Index',
        value: 45.8,
        unit: '%',
        referenceRange: { low: 35.0, high: 92.6 },
        status: 'optimal',
      },
      {
        // Was 58. Still comfortably inside 50 to 250; no verdict change.
        name: 'Vitamin D',
        value: 62.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 250.0 },
        status: 'optimal',
      },
      {
        name: 'hs-CRP',
        value: 0.4,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'optimal',
      },
      {
        // Was 62. A real rise, still <= 100, so still `suboptimal-ferritin`.
        name: 'Ferritin',
        value: 92.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'borderline',
      },
      {
        // Was 45. Crosses NG239's 70 into `normal-b12`.
        name: 'Active B12',
        value: 78.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'optimal',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
