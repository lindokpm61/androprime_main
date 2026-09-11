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

  // Third shape added 2026-08-06: a lower bound only (Active B12 returns
  // ">37.5"), which previously fell through to null and left the bar unlabelled.
  const rangeLabel =
    referenceLow !== null && referenceHigh !== null
      ? `Range: ${referenceLow}–${referenceHigh} ${unit}`
      : referenceHigh !== null
      ? `Target: <${referenceHigh} ${unit}`
      : referenceLow !== null
      ? `Target: >${referenceLow} ${unit}`
      : null

  /*
   * Rebuilt in Direction F on 2026-09-11. Same arithmetic, same zones, same
   * labels: `barMax`, the zone widths and `dotPct` are untouched, because they
   * decide where a clinical band sits and that is the engine's answer, not a
   * styling one. What changed is the track's shape and the marker.
   *
   * The value marker is a CASED NEEDLE standing proud of the track rather than a
   * dot sitting inside it, which is the fix the marketing bar already took on
   * 2026-09-02: a dot within a coloured fill fights the colour behind it for
   * contrast at every position, and a needle with a paper casing never does.
   */
  return (
    <div>
      {/* The track is a visual restatement: the value, the unit and the
          reference range are all rendered as text directly below it, and
          StatusBadge carries the verdict in words in the same card. Labelling
          it as well would double-announce, so it is hidden from assistive tech
          rather than given a redundant aria-label. */}
      <div className="f-mkbar" aria-hidden="true">
        <div className="f-mktrack">
          {zones.map((z, i) => (
            <div
              key={i}
              style={{ flex: `0 0 ${z.widthPct}%`, backgroundColor: z.color }}
            />
          ))}
        </div>
        <span className="f-mkneedle" style={{ left: `${dotPct}%` }} />
      </div>
      <div className="f-mklabels">
        <span>
          {value} {unit}
        </span>
        {rangeLabel && <span className="f-mklab-r">{rangeLabel}</span>}
      </div>
    </div>
  )
}
