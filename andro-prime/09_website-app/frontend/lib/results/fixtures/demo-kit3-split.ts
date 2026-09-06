import type { ScenarioFixture } from './fixture-types'

/*
 * THE PUBLIC DEMO'S HEADLINE RESULT. Added 2026-09-06 for `/demo`.
 *
 * 🔴 THIS IS THE MAN THE HOMEPAGE ALREADY SHOWS, AND THAT IS THE ENTIRE REASON
 * IT EXISTS. `/`'s sample readout draws four rows -- testosterone 14.2 nmol/L,
 * vitamin D 58 nmol/L, active B12 45 pmol/L, ferritin 62 µg/L -- three of them
 * marked as a split between what the laboratory calls normal and what our action
 * band calls Monitor. That readout IS the site's argument: "in range is a
 * statistical band, not a health band."
 *
 * Until now the demo of that argument did not exist and the sample reports on
 * the three pages that take money showed something else, which the 2026-09-03
 * critique raised as its first open question. Every value below that appears on
 * the homepage is carried across unchanged, so a visitor who clicks from the
 * readout into the demo meets the same man rather than a different one.
 *
 * WHERE THE OTHER FIVE MARKERS COME FROM. Kit 3 is a nine-marker panel and the
 * homepage shows four of them, so five values have to exist here that the
 * homepage never states. They are deliberately unremarkable and carried from the
 * existing `multi-deficiency` fixture rather than invented, so the demo adds no
 * flagged marker the homepage does not already flag:
 *   - SHBG 32.0 and Albumin 44.0 are that fixture's values, both mid-range.
 *   - hs-CRP 0.4 is that fixture's value, optimal.
 * Two could NOT be carried, because they are derived from total testosterone and
 * the homepage's total is 14.2 rather than that fixture's 16.0. Carrying them
 * unchanged would have put arithmetic on screen that does not add up, on the one
 * page whose whole pitch is "your actual numbers":
 *   - Free Androgen Index = (total T / SHBG) x 100 = (14.2 / 32) x 100 = 44.4%.
 *     Pure arithmetic. FAI is report-only in men (Ewa ruling 8, 2026-06-16) so
 *     it drives no verdict, but it is still shown and still has to be right.
 *   - Free Testosterone 0.31 nmol/L. ⚠ THIS ONE IS DERIVED AND NOT CONFIRMED.
 *     It holds the free fraction implied by the repo's existing 16.0 / 32 / 44
 *     triple (0.35 nmol/L, 2.19%) and applies it to 14.2. It lands comfortably
 *     inside the assay range (0.198 to 0.619, `thresholds.md`), so it bands as
 *     normal and changes no routing. It is flagged in the demo's compliance
 *     packet rather than treated as settled.
 *
 * THE THREE VERDICTS ARE THE ENGINE'S, NOT TYPED HERE. `classify()` reads these
 * values against `04_products/results-engine/thresholds.md`:
 *   - testosterone 14.2 falls in our 12 to 20 band -> `normal-testosterone` -> Monitor
 *   - vitamin D 58 falls in 50 to 250 -> `normal-vitamin-d` -> In range
 *   - active B12 45 falls in NG239's 25 to 70 -> `borderline-b12` -> Monitor
 *   - ferritin 62 falls in 30 to 100 -> `suboptimal-ferritin` -> Monitor
 * If a threshold moves, this fixture follows it automatically and the homepage
 * readout does NOT, because that one is a hand-built display constant. They will
 * disagree the day a band changes. Check both.
 *
 * ⚠ The `status` field on each marker below is descriptive only: nothing reads
 * it. `buildDashboardFromScenario` passes name, value, unit and the reference
 * range to the classifier and nothing else.
 */
const fixture: ScenarioFixture = {
  name: 'demo-kit3-split',
  label: 'Demo: Kit 3, lab normal against our action bands',
  testAge: 42,
  payload: {
    orderId: 'demo-order',
    userId: 'demo-user',
    kitType: 'hormone-recovery',
    collectedAt: '2026-08-12T08:00:00Z',
    biomarkers: [
      {
        // Homepage readout row 1. Lab normal, our band says Monitor.
        name: 'Testosterone',
        value: 14.2,
        unit: 'nmol/L',
        referenceRange: { low: 8.64, high: 29.0 },
        status: 'borderline',
      },
      {
        name: 'SHBG',
        value: 32.0,
        unit: 'nmol/L',
        referenceRange: { low: 20.6, high: 76.7 },
        status: 'optimal',
      },
      {
        // Derived from 14.2 / 32 / 44. See the header note: not confirmed.
        name: 'Free Testosterone',
        value: 0.31,
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
        // (14.2 / 32) x 100. Report-only in men; shown, never concluded from.
        name: 'Free Androgen Index',
        value: 44.4,
        unit: '%',
        referenceRange: { low: 35.0, high: 92.6 },
        status: 'optimal',
      },
      {
        // Homepage readout row 2. The one row where the two ranges agree.
        name: 'Vitamin D',
        value: 58.0,
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
        // Homepage readout row 4. Lab normal, NICE band says borderline.
        name: 'Ferritin',
        value: 62.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'borderline',
      },
      {
        // Homepage readout row 3. The assay calls 45 normal; NG239 does not.
        // This is the row the homepage calls "the plainest case".
        name: 'Active B12',
        value: 45.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'borderline',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
