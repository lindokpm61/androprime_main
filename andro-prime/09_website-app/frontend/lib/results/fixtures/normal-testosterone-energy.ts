import type { ScenarioFixture } from './fixture-types'

const fixture: ScenarioFixture = {
  name: 'normal-testosterone-energy',
  label: 'Normal Testosterone with Energy Symptoms',
  testAge: 42,
  payload: {
    orderId: 'fixture-order-id',
    userId: 'fixture-user-id',
    kitType: 'testosterone',
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
    ],
  },
  symptomAnswers: [{ questionKey: 'energy_symptoms', answer: true }],
}

export default fixture
