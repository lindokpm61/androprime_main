import type { TrendPoint } from '@/lib/membership/getMembershipView'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function shortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

interface Props {
  markerName: string
  /** Oldest first. */
  trend: TrendPoint[]
  /** The retest date, drawn as the appointment that has not happened yet. */
  pendingRetestAt: Date | null
}

/* The plot area, in CSS pixels. Height is fixed and width is fluid, which is
   what lets the type stay at a real size at every card width: see the note on
   the SVG below. */
const PLOT_H = 116
const TOP = 26        // headroom for a value label above the highest point
const BASE = PLOT_H   // the axis

/**
 * One marker over time.
 *
 * 🔴 IT IS A PLOT, NOT A RAIL, SINCE 2026-09-12, and the difference is the whole
 * point of the panel. The previous version spaced the readings along a single
 * horizontal line with the value printed above each one. Every reading therefore
 * sat at the same height whatever it said, so the one question the screen exists
 * to answer, did my number move, was carried entirely by the reader comparing
 * two small numerals. Keith, looking at a real pair: "it should be a panel with a
 * graph or something". Height encodes the value now, so a rise looks like a rise
 * before anything is read. Same argument the demo's `TwoPointPlot` makes.
 *
 * 🔴 THE MARKS ARE SVG AND THE TYPE IS HTML, AND THAT SPLIT IS NOT FUSSINESS.
 * The first version of this put everything in one `viewBox` scaled to 100% width,
 * which is how the demo does it, and it was wrong here: the demo's plot lives
 * inside a 320px phone frame, while this card is over a thousand pixels wide on a
 * desktop, so the whole drawing was scaled up by more than three and the dates
 * rendered larger than the headline. A viewBox scales its text along with its
 * geometry and there is no way to opt one out. So the geometry keeps a viewBox
 * (with `preserveAspectRatio="none"`, since a straight line between two points
 * is still that line under a non-uniform scale, and `vector-effect` keeps the
 * stroke an honest width), and every label is ordinary positioned HTML at a real
 * font size. Found by looking at the render, not by reading the code.
 *
 * ⚠ NO REFERENCE BANDS, DELIBERATELY. Drawing the healthy range behind the line
 * would make this a second implementation of `components/app-shell/RangeTrack`,
 * which does exactly that on live data and which batch 3 declined to duplicate
 * for the same reason. This plot answers "what did it do", the marker block above
 * it answers "what does that mean", and keeping those separate is what stops a
 * chart from implying a verdict it was not given.
 *
 * ⚠ AND IT DOES NOT SAY WHETHER THE MOVE WAS REAL. No "risen", no "improved", no
 * arrow. What counts as a change rather than assay noise is per-marker and
 * clinical, it is Ewa's to set, and until she does, the honest thing is to show
 * the readings and let them speak. See `lib/results/markerHistory.ts`.
 *
 * ONLY OUR OWN KITS FEED THIS. We do not ingest results from other providers: a
 * number typed in from a photo has no assay identity and no collection time,
 * testosterone needs a morning sample, and a line drawn between two different
 * assays is an artefact that looks like information. The refusal is a
 * positioning asset, not a missing feature.
 */
export function TrendPlot({ markerName, trend, pendingRetestAt }: Props) {
  if (trend.length === 0) return null

  const unit = trend[trend.length - 1]?.unit ?? ''
  const values = trend.map((p) => p.value)

  /* THE SCALE IS PADDED AROUND THE READINGS, NOT ANCHORED AT ZERO. A zero
     baseline would flatten a real move on any marker whose working range sits
     far from zero, which is most of them. The padding is generous enough that a
     single reading does not sit on the floor of its own chart. */
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const span = hi - lo
  const pad = span === 0 ? Math.max(Math.abs(hi) * 0.25, 1) : span * 0.45
  const floor = lo - pad
  const ceil = hi + pad

  /** A value to a pixel offset from the top of the plot area. */
  const y = (value: number) => BASE - ((value - floor) / (ceil - floor || 1)) * (BASE - TOP)

  /* The known readings occupy the left of the plot and the pending retest takes
     the right-hand slot, so the gap before it reads as time that has not passed
     yet rather than as a missing reading. Percentages are inset so the first and
     last labels have room to sit centred without clipping. */
  const slots = trend.length + (pendingRetestAt ? 1 : 0)
  const INSET = 11
  const xPct = (index: number) =>
    slots === 1 ? 50 : INSET + (index / (slots - 1)) * (100 - INSET * 2)

  const described = trend
    .map((p) => `${p.value} ${p.unit} on ${formatDate(p.collectedAt)}`)
    .join(', ')
  const label = pendingRetestAt
    ? `${markerName}: ${described}. Next reading due ${shortDate(pendingRetestAt)}.`
    : `${markerName}: ${described}.`

  const lastIndex = trend.length - 1
  const lastY = y(trend[lastIndex].value)

  return (
    <>
      <div className="f-plot" role="img" aria-label={label}>
        <div className="f-plot-area" style={{ height: `${PLOT_H}px` }}>
          <svg
            className="f-plot-svg"
            viewBox={`0 0 100 ${PLOT_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {trend.slice(1).map((point, i) => (
              <line
                key={`seg-${point.collectedAt}-${i}`}
                x1={xPct(i)}
                y1={y(trend[i].value)}
                x2={xPct(i + 1)}
                y2={y(point.value)}
                className="f-plot-line"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* THE RUN UP TO A PENDING RETEST IS DASHED, because the value at the
                end of it is unknown. A solid line to the "?" would draw a
                trajectory nobody has measured. It is held level rather than
                sloped for the same reason. */}
            {pendingRetestAt && (
              <line
                x1={xPct(lastIndex)}
                y1={lastY}
                x2={xPct(slots - 1)}
                y2={lastY}
                className="f-plot-line f-plot-pending"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          <span className="f-plot-axis" />

          {trend.map((point, i) => {
            const isLatest = i === lastIndex
            return (
              <span
                key={`pt-${point.collectedAt}-${i}`}
                className="f-plot-pt"
                style={{ left: `${xPct(i)}%`, top: `${y(point.value)}px` }}
              >
                <span className={isLatest ? 'f-plot-v f-plot-v-now' : 'f-plot-v'}>{point.value}</span>
                <span className={isLatest ? 'f-plot-dot f-plot-dot-now' : 'f-plot-dot'} />
              </span>
            )
          })}

          {pendingRetestAt && (
            <span className="f-plot-pt" style={{ left: `${xPct(slots - 1)}%`, top: `${lastY}px` }}>
              <span className="f-plot-v f-plot-v-next">?</span>
              <span className="f-plot-dot f-plot-dot-next" />
            </span>
          )}
        </div>

        <div className="f-plot-dates">
          {trend.map((point, i) => (
            <span
              key={`d-${point.collectedAt}-${i}`}
              className="f-plot-d"
              style={{ left: `${xPct(i)}%` }}
            >
              {formatDate(point.collectedAt)}
            </span>
          ))}
          {pendingRetestAt && (
            <span className="f-plot-d" style={{ left: `${xPct(slots - 1)}%` }}>
              {shortDate(pendingRetestAt)}
            </span>
          )}
        </div>
      </div>

      <p className="f-fine">
        {trend.length === 1 ? (
          <>
            Two points is not a trend. It is the smallest number that can answer whether anything
            moved, which is why the second one is the product.
          </>
        ) : (
          <>Measured in {unit}, from your own kits only. We do not chart results from anywhere else.</>
        )}
      </p>
    </>
  )
}
