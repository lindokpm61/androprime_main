import type { ScenarioFixture } from './fixture-types'

const fixture: ScenarioFixture = {
  name: 'elevated-crp',
  label: 'Elevated hs-CRP (1–10 mg/L)',
  testAge: 38,
  payload: {
    orderId: 'fixture-order-id',
    userId: 'fixture-user-id',
    kitType: 'energy-recovery',
    collectedAt: '2026-04-01T08:00:00Z',
    biomarkers: [
      {
        name: 'Vitamin D',
        value: 72.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 175.0 },
        status: 'optimal',
      },
      {
        name: 'hs-CRP',
        value: 4.5,
        unit: 'mg/L',
        referenceRange: { low: null, high: 1.0 },
        status: 'borderline',
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
        value: 82.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: 188.0 },
        status: 'optimal',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
