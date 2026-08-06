import type { ScenarioFixture } from './fixture-types'

const fixture: ScenarioFixture = {
  name: 'multi-deficiency',
  label: 'Multi-Deficiency (Vitamin D + Active B12 + Normal Testosterone)',
  testAge: 42,
  payload: {
    orderId: 'fixture-order-id',
    userId: 'fixture-user-id',
    kitType: 'hormone-recovery',
    collectedAt: '2026-04-01T08:00:00Z',
    biomarkers: [
      {
        name: 'Testosterone',
        value: 16.0,
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
        name: 'Free Testosterone',
        value: 0.35,
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
        name: 'Free Androgen Index',
        value: 50.0,
        unit: '%',
        referenceRange: { low: 35.0, high: 92.6 },
        status: 'optimal',
      },
      {
        name: 'Vitamin D',
        value: 30.0,
        unit: 'nmol/L',
        referenceRange: { low: 50.0, high: 250.0 },
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
        referenceRange: { low: 30.0, high: 442.0 },
        status: 'optimal',
      },
      {
        name: 'Active B12',
        value: 30.0,
        unit: 'pmol/L',
        referenceRange: { low: 37.5, high: null },
        status: 'low',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
