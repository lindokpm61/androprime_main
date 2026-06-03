import type { VitallWebhookPayload, VitallRawPanel } from '@/lib/vitall/types'
import type { NormalisedBiomarker } from './types'

// Maps Vitall biomarker names to our internal canonical names.
// Vitall may return different name/name_simple values depending on the panel.
const NAME_MAP: Record<string, string> = {
  Testosterone: 'Testosterone',
  'Total Testosterone': 'Testosterone', // Vitall sends name "Total Testosterone" (spec v2 example)
  SHBG: 'SHBG',
  'Free Testosterone': 'Free Testosterone',
  Albumin: 'Albumin',
  'Free Androgen Index': 'Free Androgen Index',
  'Vitamin D': 'Vitamin D',
  'hs-CRP': 'hs-CRP',
  CRP: 'hs-CRP',
  'C-Reactive Protein': 'hs-CRP',
  Ferritin: 'Ferritin',
  'Active B12': 'Active B12',
  Holotranscobalamin: 'Active B12',
}

const EXPECTED_UNITS: Record<string, string> = {
  Testosterone: 'nmol/L',
  SHBG: 'nmol/L',
  'Free Testosterone': 'nmol/L',
  Albumin: 'g/L',
  'Free Androgen Index': '%',
  'Vitamin D': 'nmol/L',
  'hs-CRP': 'mg/L',
  Ferritin: 'ug/L',
  'Active B12': 'pmol/L',
}

// Parses Vitall's reference range string into low/high numbers.
// Handles formats: "50 - 250", "50-250", "<45", ">10"
function parseReference(ref: string): { low: number | null; high: number | null } {
  if (!ref) return { low: null, high: null }

  const rangeMatch = ref.match(/^([\d.]+)\s*[-–]\s*([\d.]+)$/)
  if (rangeMatch) return { low: parseFloat(rangeMatch[1]), high: parseFloat(rangeMatch[2]) }

  const upperMatch = ref.match(/^<\s*([\d.]+)$/)
  if (upperMatch) return { low: null, high: parseFloat(upperMatch[1]) }

  const lowerMatch = ref.match(/^>\s*([\d.]+)$/)
  if (lowerMatch) return { low: parseFloat(lowerMatch[1]), high: null }

  return { low: null, high: null }
}

export function normalise(payload: VitallWebhookPayload): NormalisedBiomarker[] {
  // results is "[]" (string) for non-results-available statuses
  if (!Array.isArray(payload.results) || payload.results.length === 0) {
    throw new Error('No results in webhook payload')
  }

  const panels = payload.results as VitallRawPanel[]
  const biomarkers: NormalisedBiomarker[] = []

  for (const panel of panels) {
    for (const item of panel.results) {
      const internalName = NAME_MAP[item.name] ?? NAME_MAP[item.name_simple]
      if (!internalName) continue

      const value = parseFloat(item.result)
      if (isNaN(value)) continue

      const { low, high } = parseReference(item.reference)
      const expectedUnit = EXPECTED_UNITS[internalName]

      if (expectedUnit && item.units !== expectedUnit) {
        throw new Error(
          `Unit mismatch for ${item.name}: expected ${expectedUnit}, got ${item.units}`
        )
      }

      biomarkers.push({
        markerName: internalName,
        value,
        unit: item.units,
        referenceLow: low,
        referenceHigh: high,
      })
    }
  }

  if (biomarkers.length === 0) {
    throw new Error('No recognised biomarkers found in results')
  }

  return biomarkers
}

// True if ANY marker we track came back without a usable numeric value — Vitall
// reports a failed/insufficient marker as a null/blank `result` + a `note`
// (Ben Starling, 2026-06-02). Under the full-panel-redo policy (Keith, 2026-06-03)
// a single failed tracked marker fails the whole order. Untracked markers are
// ignored. Does not catch a marker omitted entirely from the payload — Vitall
// sends the row with a null value rather than dropping it.
export function hasSampleFailure(payload: VitallWebhookPayload): boolean {
  if (!Array.isArray(payload.results)) return false
  for (const panel of payload.results as VitallRawPanel[]) {
    for (const item of panel.results) {
      const internalName = NAME_MAP[item.name] ?? NAME_MAP[item.name_simple]
      if (!internalName) continue
      if (!Number.isFinite(parseFloat(item.result))) return true
    }
  }
  return false
}
