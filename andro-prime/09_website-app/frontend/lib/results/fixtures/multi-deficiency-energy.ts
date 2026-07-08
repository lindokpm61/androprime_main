import type { ScenarioFixture } from './fixture-types'

// Kit 2 (energy-recovery) multi-deficiency: low Vitamin D + low Active B12 (two
// deficiency-state markers) on a 40+ customer. Exercises the multi-deficiency
// branch's energy-recovery -> kit-1 cross-sell (guards the /kits/testosterone
// href fix). No testosterone marker — Kit 2 does not measure it.
const fixture: ScenarioFixture = {
  name: 'multi-deficiency-energy',
  label: 'Multi-Deficiency, Kit 2 (Low Vitamin D + Low Active B12)',
  testAge: 42,
  payload: {
    orderId: 'fixture-order-id',
    userId: 'fixture-user-id',
    kitType: 'energy-recovery',
    collectedAt: '2026-04-01T08:00:00Z',
    biomarkers: [
      {
        name: 'Vitamin D',
        value: 30.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 175.0 },
        status: 'low',
      },
      {
        name: 'hs-CRP',
        value: 0.4,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'optimal',
      },
      {
        name: 'Ferritin',
        value: 95.0,
        unit: 'ug/L',
        referenceRange: { low: 30.0, high: 400.0 },
        status: 'optimal',
      },
      {
        name: 'Active B12',
        value: 30.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: 188.0 },
        status: 'low',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
