import type { BarZone, ClassifiedResult } from '@/lib/results/types'

/*
 * THE TWO-RANGE TRACK. The prototype's central device, rebuilt on live data.
 *
 * 🔴 IT DRAWS TWO DIFFERENT THINGS AND THEY ARE DELIBERATELY DIFFERENT SHAPES.
 * The coloured fill inside the rail is OUR action bands, straight from
 * `ClassifiedResult.displayZones`. The bracket underneath is the LABORATORY's
 * own reference interval, from `referenceLow`/`referenceHigh` on the same
 * result. The entire argument of the business is the gap between them, so they
 * are drawn as fill against outline rather than as two coloured bars that a
 * caption has to tell apart.
 *
 * 🔴 `compare` IS THE ARGUMENT, NOT A SETTING. With it on, our fill is removed
 * and the laboratory's bracket is left exactly where it was. That is the view a
 * standard report gives, and the point is that the reader watches it happen to
 * his own number rather than being told about it. Nothing about the value or
 * the lab interval changes, because nothing about them is ours to change.
 *
 * ⚠ IT INVENTS NO CLINICAL CONTENT. Every position on this track is computed
 * from fields the classifier already returns. There is no threshold typed here,
 * no band boundary, and no named cutoff: the prototype named its cut line ("UK
 * clinical action cutoff") and that string is not in the engine, so it is not
 * drawn. The zone boundary is already visible where the fill changes colour.
 */

type Tone = 'ok' | 'warn' | 'crit' | 'flat'

const TONE_FOR_ZONE: Record<BarZone['color'], Tone> = {
  optimal: 'ok',
  warning: 'warn',
  critical: 'crit',
}

/**
 * The rail's upper bound, carried over verbatim from `TrafficLightBar` so the
 * two renderings of one result cannot disagree about where the value sits.
 */
export function barMaxFor(r: Pick<ClassifiedResult, 'value' | 'referenceHigh' | 'displayZones'>): number {
  const lastFiniteUpTo =
    [...r.displayZones].reverse().find((z) => z.upTo !== null)?.upTo ?? r.referenceHigh ?? r.value
  return Math.max(r.value * 1.3, lastFiniteUpTo * 1.5)
}

/** A number's position on the rail, clamped so a wild value cannot escape it. */
function pct(v: number, max: number): number {
  return Math.max(0, Math.min(100, (v / max) * 100))
}

/** Trims trailing zeroes so 0.310 reads 0.31 and 58.0 reads 58. */
function tick(n: number): string {
  return Number(n.toFixed(3)).toString()
}

export interface RangeTrackProps {
  result: ClassifiedResult
  /** Strip our bands and leave the laboratory's interval. */
  compare?: boolean
  /** Report-only markers get a hollow pin and no bands, ever. */
  reportOnly?: boolean
  tone: Tone
}

export function RangeTrack({ result, compare = false, reportOnly = false, tone }: RangeTrackProps) {
  const max = barMaxFor(result)
  const hideBands = compare || reportOnly

  // Zones, as absolute spans. `upTo: null` means "to the end of the rail".
  const zones: { tone: Tone; left: number; width: number }[] = []
  let prev = 0
  for (const z of result.displayZones) {
    const boundary = z.upTo ?? max
    const left = pct(prev, max)
    zones.push({ tone: TONE_FOR_ZONE[z.color], left, width: pct(boundary, max) - left })
    prev = boundary
    if (z.upTo === null) break
  }

  // Ticks: the rail's ends, our band boundaries, and the laboratory's bounds.
  // Boundaries that are ours are set bold, which is what makes the comparison
  // legible: turn `compare` on and the bold numbers stop being emphasised.
  const ours = result.displayZones.map((z) => z.upTo).filter((v): v is number => v !== null)
  const labs = [result.referenceLow, result.referenceHigh].filter((v): v is number => v !== null)
  const marks = [...new Set([0, ...ours, ...labs, max])]
    .filter((v) => v >= 0 && v <= max)
    .sort((a, b) => a - b)

  const hasBracket = result.referenceLow !== null && result.referenceHigh !== null
  const brkLeft = hasBracket ? pct(result.referenceLow as number, max) : 0
  const brkWidth = hasBracket ? pct(result.referenceHigh as number, max) - brkLeft : 0

  return (
    <div>
      <div className="ap-track">
        {zones.map((z, i) => (
          <span
            key={i}
            className="ap-zone"
            data-tone={z.tone}
            data-hidden={hideBands || undefined}
            style={{ left: `${z.left}%`, width: `${z.width}%` }}
          />
        ))}
        <span
          className="ap-pin"
          data-tone={tone}
          data-hollow={reportOnly || undefined}
          style={{ left: `${pct(result.value, max)}%` }}
        />
      </div>

      {/* The laboratory's interval, as a bracket under the rail. */}
      <div className="ap-labrow">
        {hasBracket && <span className="ap-brk" style={{ left: `${brkLeft}%`, width: `${brkWidth}%` }} />}
      </div>

      <div className="ap-scale">
        {marks.map((m, i) => (
          <s
            key={m}
            data-edge={i === 0 ? 'l' : i === marks.length - 1 ? 'r' : undefined}
            data-hard={!hideBands && ours.includes(m) ? 'true' : undefined}
            style={{ left: `${pct(m, max)}%` }}
          >
            {tick(m)}
          </s>
        ))}
      </div>

      <Legend compare={compare} reportOnly={reportOnly} zones={zones} hasBracket={hasBracket} />
    </div>
  )
}

function Legend({
  compare,
  reportOnly,
  zones,
  hasBracket,
}: {
  compare: boolean
  reportOnly: boolean
  zones: { tone: Tone }[]
  hasBracket: boolean
}) {
  const bracket = hasBracket ? (
    <div>
      <span className="ap-sw" data-kind="brk" /> Your lab&rsquo;s male reference range
    </div>
  ) : null

  if (reportOnly) {
    return (
      <div className="ap-legend">
        {bracket}
        <div>
          <span className="ap-sw" data-kind="ring" /> Reported, no verdict
        </div>
      </div>
    )
  }

  // Comparing: the laboratory's interval is the only thing left to key.
  if (compare) return <div className="ap-legend">{bracket}</div>

  const seen: Tone[] = []
  for (const z of zones) if (!seen.includes(z.tone)) seen.push(z.tone)

  const LABEL: Record<Tone, string> = {
    crit: 'Outside our band',
    warn: 'Between the two ranges',
    ok: 'Where we would want it',
    flat: 'Reported',
  }

  return (
    <div className="ap-legend">
      {seen.map((t) => (
        <div key={t}>
          <span className="ap-sw" data-tone={t} /> {LABEL[t]}
        </div>
      ))}
      {bracket}
    </div>
  )
}
