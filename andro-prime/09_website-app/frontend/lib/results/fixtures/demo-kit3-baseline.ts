import type { ScenarioFixture } from './fixture-types'

/*
 * THE DEMO'S FIRST PURCHASE. Kit 3, nine markers, collected 10 August 2026.
 * Written 2026-09-07 for the from-scratch rebuild of `/demo`.
 *
 * 🔴 THESE ARE THE PROTOTYPE'S OWN NUMBERS, CARRIED ACROSS UNCHANGED, and that
 * was Keith's explicit choice on 2026-09-07 when he asked for the demo to be
 * rebuilt "page for page, panel for panel" from
 * `design/prototypes/demo-account-interactive.html`. He was shown both options
 * and picked this one. Every value below is that file's `base` field.
 *
 * ⚠ WHAT IT COST, so the next reader does not think it was missed. The fixture
 * this replaces (`demo-kit3-split`) held the man the HOMEPAGE readout shows --
 * testosterone 14.2, vitamin D 58, B12 45, ferritin 62 -- chosen so a visitor
 * clicking from `/` into the demo met the same man. **He is a different man
 * now.** `/`'s sample readout and this fixture no longer agree, and nothing
 * detects that automatically because the homepage readout is a hand-built
 * display constant. If the two are meant to match again, the homepage is the
 * file to change; it was left alone here because changing it is a separate,
 * compliance-registered decision.
 *
 * 🟢 WHAT IT BOUGHT. The prototype's man is the one its screens were drawn for,
 * and three of them only work on him:
 *   - Testosterone 10.5 lands in the 8 to 12 EQUIVOCAL band: inside the
 *     laboratory's printed range and underneath the number a GP acts on. That
 *     is the single sharpest screen in the drawing -- the report routes him out
 *     of the business and says so -- and it is unreachable on a man at 14.2.
 *   - Vitamin D 31 is the one number he is asked to move, which is what gives
 *     the plan tab a subject. `markerToMove()` returns `vitamin-d` from this.
 *   - Free testosterone 0.190 sits just BELOW the calculated range while total
 *     testosterone is inside it, which is the panel disagreeing with itself.
 *
 * 🔴 NO VERDICT IS TYPED HERE. `classify()` reads these values against
 * `04_products/results-engine/thresholds.md` and decides every band, badge and
 * string. The states it should produce, recorded so a threshold change is
 * visible as a diff rather than as a silent re-band:
 *   testosterone 10.5  -> `equivocal-testosterone`  (GP)
 *   SHBG 34.1          -> `shbg-normal`
 *   free T 0.190       -> `ft-low`
 *   albumin 44         -> `normal-albumin`
 *   FAI 30.8           -> `fai-reported`            (no verdict, ever)
 *   vitamin D 31       -> `low-vitamin-d`
 *   active B12 44      -> `borderline-b12`
 *   hs-CRP 1.9         -> `elevated-crp`
 *   ferritin 71        -> `suboptimal-ferritin`
 *
 * ⚠ THE COLLECTION DATE IS FOUR DAYS BEFORE THE RESULT, ON PURPOSE. `demo.ts`
 * derives the result date as collection + `RESULT_LAG_DAYS`, so 10 August here
 * produces a result on 14 August -- the prototype's D1, the date its member
 * screen, its charge date and its retest date are all measured from. The
 * prototype's own header flags that its waiting tracker said the sample arrived
 * on 14 August, contradicting D1 by four days, and declined to guess which was
 * wrong. Deriving both from one collection date is what resolves it.
 *
 * ⚠ MARKER ORDER IS THE PROTOTYPE'S, NOT `KIT_PANELS`'. Row order comes from
 * this array, and the two canonical orders disagree twice: the prototype puts
 * the report-only Free Androgen Index LAST in the hormone group, and Active B12
 * SECOND in the energy group. Both are deliberate in the drawing -- the row with
 * no verdict sits at the bottom of its group rather than in the middle of it --
 * so the fixture carries that order and the screens read it straight.
 *
 * ⚠ The `status` field on each marker is descriptive only: nothing reads it.
 * `buildDashboardFromScenario` and `getDemoEngineInput` pass name, value, unit
 * and the reference range to the classifier and nothing else.
 */
const fixture: ScenarioFixture = {
  name: 'demo-kit3-baseline',
  label: 'Demo: Kit 3 first result, the prototype’s man',
  testAge: 42,
  payload: {
    orderId: 'demo-order-kit3',
    userId: 'demo-user',
    kitType: 'hormone-recovery',
    collectedAt: '2026-08-10T08:00:00Z',
    biomarkers: [
      {
        // Inside the lab's 8.64 to 29.00 and under the 12 our bands act on.
        // Both true at once, which is the screen the prototype was built for.
        name: 'Testosterone',
        value: 10.5,
        unit: 'nmol/L',
        referenceRange: { low: 8.64, high: 29.0 },
        status: 'borderline',
      },
      {
        name: 'SHBG',
        value: 34.1,
        unit: 'nmol/L',
        referenceRange: { low: 20.6, high: 76.7 },
        status: 'optimal',
      },
      {
        // Just under the calculated floor while total T is inside its range.
        name: 'Free Testosterone',
        value: 0.19,
        unit: 'nmol/L',
        referenceRange: { low: 0.198, high: 0.619 },
        status: 'borderline',
      },
      {
        name: 'Albumin',
        value: 44.0,
        unit: 'g/L',
        referenceRange: { low: 35.0, high: 50.0 },
        status: 'optimal',
      },
      {
        // Report-only in men (Ewa ruling 8, 2026-06-16). Shown, never concluded
        // from, and it draws a hollow pin with no band behind it.
        name: 'Free Androgen Index',
        value: 30.8,
        unit: '%',
        referenceRange: { low: 35.0, high: 92.6 },
        status: 'low',
      },
      {
        // The one number he is asked to move. Under the lab floor of 50.
        name: 'Vitamin D',
        value: 31.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 250.0 },
        status: 'low',
      },
      {
        // The assay calls anything above 37.5 normal. NG239 treats 25 to 70 as
        // indeterminate, so 44 is fine by the lab and unresolved by the
        // guideline. The clearest case of the two ranges disagreeing.
        name: 'Active B12',
        value: 44.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'borderline',
      },
      {
        name: 'hs-CRP',
        value: 1.9,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'borderline',
      },
      {
        name: 'Ferritin',
        value: 71.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'borderline',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
