import type { BarZone, ResultState } from '@/lib/results/types'

interface TrafficLightBarProps {
  value: number
  unit: string
  referenceLow: number | null
  referenceHigh: number | null
  displayZones: BarZone[]
  state: ResultState
}

export function TrafficLightBar({
  value,
  unit,
  referenceLow,
  referenceHigh,
  displayZones,
}: TrafficLightBarProps) {
  if (displayZones.length === 0) return null

  // Extend the bar 50% past the last defined threshold, or 30% past the value — whichever is larger
  const lastFiniteUpTo =
    [...displayZones].reverse().find((z) => z.upTo !== null)?.upTo ??
    referenceHigh ??
    value
  const barMax = Math.max(value * 1.3, lastFiniteUpTo * 1.5)

  // Build visual zone segments
  const zones: { color: string; widthPct: number }[] = []
  let prev = 0
  for (const zone of displayZones) {
    const boundary = zone.upTo !== null ? zone.upTo : barMax
    zones.push({
      color: `var(--color-status-${zone.color})`,
      widthPct: Math.max(0, ((boundary - prev) / barMax) * 100),
    })
    prev = boundary
    if (zone.upTo === null) break
  }

  const dotPct = Math.min(96, Math.max(2, (value / barMax) * 100))

  const rangeLabel =
    referenceLow !== null && referenceHigh !== null
      ? `Range: ${referenceLow}–${referenceHigh} ${unit}`
      : referenceHigh !== null
      ? `Target: <${referenceHigh} ${unit}`
      : null

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
        {rangeLabel && (
          <span className="data-label text-xs" style={{ color: 'var(--color-gray-500)' }}>
            {rangeLabel}
          </span>
        )}
      </div>
    </div>
  )
}
