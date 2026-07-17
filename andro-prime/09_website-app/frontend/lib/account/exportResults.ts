import type { DashboardData } from '@/lib/results/types'

// Marker-agnostic results export. Consumes the same `DashboardData` shape the
// dashboard renders (lib/results/getDashboardData.ts), so an export can never
// drift from what the customer sees on screen. Works for any kit and any marker
// set - including Ferritin/Albumin if/when the lab returns them - because it
// reads whatever markers are present rather than a hard-coded panel.

const KIT_LABELS: Record<string, string> = {
  testosterone: 'Testosterone Health Check',
  'energy-recovery': 'Energy & Recovery Check',
  'hormone-recovery': 'Hormone & Recovery Check',
}

const CSV_HEADER = [
  'Kit',
  'Collected',
  'Marker',
  'Value',
  'Unit',
  'Reference low',
  'Reference high',
  'Status',
]

// RFC 4180 quoting: wrap a cell in quotes only if it contains a comma, a double
// quote, or a newline; double any internal quote. Everything else is emitted
// verbatim so plain numeric/marker cells stay unquoted.
function csvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function isoDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

/**
 * Renders a user's classified results as CSV (RFC 4180, CRLF line endings,
 * trailing newline). Returns a header-only document for any non-'ready' state
 * (no results yet), so the export is always a valid file the user can open.
 */
export function resultsToCsv(data: DashboardData): string {
  const rows: string[] = [CSV_HEADER.map(csvCell).join(',')]

  if (data.state === 'ready') {
    for (const kit of data.kits) {
      const kitLabel = KIT_LABELS[kit.kitType] ?? kit.kitType
      for (const result of kit.results) {
        const collected = isoDate(result.collectedAt)
        for (const m of result.markers) {
          rows.push(
            [
              kitLabel,
              collected,
              m.markerName,
              m.value,
              m.unit,
              m.referenceLow,
              m.referenceHigh,
              m.stateLabel,
            ]
              .map(csvCell)
              .join(',')
          )
        }
      }
    }
  }

  return rows.join('\r\n') + '\r\n'
}
