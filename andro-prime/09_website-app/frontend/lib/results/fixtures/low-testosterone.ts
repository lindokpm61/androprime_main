import type { ScenarioFixture } from './fixture-types'

const fixture: ScenarioFixture = {
  name: 'low-testosterone',
  label: 'Low Testosterone',
  testAge: 42,
  payload: {
    orderId: 'fixture-order-id',
    userId: 'fixture-user-id',
    kitType: 'testosterone',
    collectedAt: '2026-04-01T08:00:00Z',
    biomarkers: [
      {
        name: 'Testosterone',
        value: 9.5,
        unit: 'nmol/L',
        referenceRange: { low: 9.0, high: 27.6 },
        status: 'low',
      },
      {
        name: 'SHBG',
        value: 28.0,
        unit: 'nmol/L',
        referenceRange: { low: 18.3, high: 54.1 },
        status: 'optimal',
      },
      {
        name: 'Free Testosterone',
        value: 0.21,
        unit: 'nmol/L',
        referenceRange: { low: 0.17, high: 0.81 },
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
        name: 'Free Androgen Index',
        value: 33.9,
        unit: '%',
        referenceRange: { low: 24.0, high: 104.0 },
        status: 'borderline',
      },
    ],
  },
  symptomAnswers: [],
}

export default fixture
