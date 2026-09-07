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
 * 🔴 WHAT MOVED, AND THE RESTRAINT IS THE POINT. Two markers move and one
 * deliberately does not:
 *   - Active B12 45 -> 78 pmol/L. Crosses NG239's 70 into `normal-b12`.
 *   - Ferritin 62 -> 108 ug/L. Crosses 100 into `normal-ferritin`.
 *   - Testosterone 14.2 -> 15.1 nmol/L. Still inside our 12 to 20 band, so it
 *     is STILL `normal-testosterone` and still reads Monitor.
 *
 * The two that move are the nutritional markers, which are the ones that
 * actually respond to supplementation over a 90-day window. Testosterone is
 * left essentially flat because moving it too would turn a demonstration into
 * an efficacy claim, and we have no evidence for one. A demo that shows
 * everything improving is a pitch; this one has to survive a sceptical reader.
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
        // Was 62. Crosses 100 into `normal-ferritin`.
        name: 'Ferritin',
        value: 108.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'optimal',
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
