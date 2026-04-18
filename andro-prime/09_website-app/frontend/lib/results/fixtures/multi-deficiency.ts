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
        referenceRange: { low: 9.0, high: 27.6 },
        status: 'borderline',
      },
      {
        name: 'SHBG',
        value: 32.0,
        unit: 'nmol/L',
        referenceRange: { low: 18.3, high: 54.1 },
        status: 'optimal',
      },
      {
        name: 'Free Testosterone',
        value: 0.35,
        unit: 'nmol/L',
        referenceRange: { low: 0.17, high: 0.81 },
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
        referenceRange: { low: 24.0, high: 104.0 },
        status: 'optimal',
      },
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
