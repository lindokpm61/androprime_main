import type { ResultState } from '@/lib/results/types'

interface TrafficLightBarProps {
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
  state: ResultState
}

interface Zone {
  color: string
  widthPct: number
}

function buildZones(referenceLow: number | null, referenceHigh: number, barMax: number): Zone[] {
  if (referenceLow !== null) {
    const lowPct = (referenceLow / barMax) * 100
    const optPct = ((referenceHigh - referenceLow) / barMax) * 100
    const highPct = 100 - lowPct - optPct
    return [
      { color: 'var(--color-status-critical)', widthPct: lowPct },
      { color: 'var(--color-status-optimal)', widthPct: optPct },
      { color: 'var(--color-status-warning)', widthPct: highPct },
    ]
  }
  // Upper-only bound (e.g. hs-CRP): green | amber | red
  const greenPct = (referenceHigh / barMax) * 100
  const amberPct = (referenceHigh / barMax) * 100
  const redPct = Math.max(0, 100 - greenPct - amberPct)
  return [
    { color: 'var(--color-status-optimal)', widthPct: greenPct },
    { color: 'var(--color-status-warning)', widthPct: amberPct },
    { color: 'var(--color-status-critical)', widthPct: redPct },
  ]
}

export function TrafficLightBar({
  value,
  unit,
  referenceLow,
  referenceHigh,
  state: _state,
}: TrafficLightBarProps) {
  if (!referenceHigh) return null

  const barMax =
    referenceLow !== null
      ? Math.max(value * 1.3, referenceHigh * 1.4)
      : Math.max(value * 1.3, referenceHigh * 3)

  const dotPct = Math.min(96, Math.max(2, ((value - 0) / barMax) * 100))
  const zones = buildZones(referenceLow, referenceHigh, barMax)

  const rangeLabel =
    referenceLow !== null && referenceHigh !== null
      ? `Range: ${referenceLow}–${referenceHigh} ${unit}`
      : `Target: <${referenceHigh} ${unit}`

  return (
    <div className="traffic-light-bar">
      <div className="traffic-light-bar__track">
        {zones.map((z, i) => (
          <div
            key={i}
            style={{ flex: `0 0 ${z.widthPct}%`, backgroundColor: z.color }}
          />
        ))}
        <div
          className="traffic-light-bar__dot"
          style={{ left: `${dotPct}%` }}
          aria-hidden
        />
      </div>
      <div className="traffic-light-bar__labels">
        <span className="data-label text-xs">
          {value} {unit}
        </span>
        <span className="data-label text-xs" style={{ color: 'var(--color-gray-500)' }}>
          {rangeLabel}
        </span>
      </div>
    </div>
  )
}
