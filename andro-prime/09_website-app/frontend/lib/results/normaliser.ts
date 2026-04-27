import type { VitallWebhookPayload, NormalisedBiomarker } from './types'

const EXPECTED_UNITS: Record<string, string> = {
  Testosterone: 'nmol/L',
  SHBG: 'nmol/L',
  'Free Testosterone': 'nmol/L',
  Albumin: 'g/L',
  'Free Androgen Index': '%',
  'Vitamin D': 'nmol/L',
  Magnesium: 'mmol/L',
  'hs-CRP': 'mg/L',
  Ferritin: 'ug/L',
  'Active B12': 'pmol/L',
}

export function normalise(payload: VitallWebhookPayload): NormalisedBiomarker[] {
  return payload.biomarkers.map((b) => {
    const expected = EXPECTED_UNITS[b.name]
    if (expected && b.unit !== expected) {
      throw new Error(
        `Unit mismatch for ${b.name}: expected ${expected}, got ${b.unit}`
      )
    }
    return {
      markerName: b.name,
      value: b.value,
      unit: b.unit,
      referenceLow: b.referenceRange.low,
      referenceHigh: b.referenceRange.high,
    }
  })
}
