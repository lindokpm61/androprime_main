import type { AdherenceDay } from '@/lib/membership/checkin'

/** `YYYY-MM-DD` as "14 Aug". A date beats "22 days ago", which reads as arithmetic. */
function formatDay(day: string): string {
  const date = new Date(`${day}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/**
 * The adherence bars.
 *
 * COMPLIANCE, and it is the whole reason the legend is not optional: this chart
 * is about BEHAVIOUR, never blood. Nothing here claims a result has changed.
 * Drawing a rising line next to a health brand without saying what it measures
 * is how a habit tracker becomes an implied clinical claim.
 *
 * A missed day still draws a visible stub rather than nothing, so the row reads
 * as a calendar with a gap rather than as a shorter chart.
 */
export function AdherenceChart({ series }: { series: AdherenceDay[] }) {
  if (series.length === 0) return null

  const answeredDays = series.filter((day) => day.answered > 0).length

  return (
    <>
      <div
        className="membership__chart"
        role="img"
        aria-label={`Daily check-ins over ${series.length} days: ${answeredDays} logged.`}
      >
        {series.map((day) => (
          <i
            key={day.day}
            className={day.answered === 0 ? 'membership__bar membership__bar--missed' : 'membership__bar'}
            style={{ height: `${Math.max(day.fraction * 100, 12)}%` }}
          />
        ))}
      </div>
      <div className="membership__chart-axis">
        <span>{formatDay(series[0].day)}</span>
        <span>Today</span>
      </div>
      <p className="membership__chart-legend">
        This chart is about behaviour, not blood. Nothing here claims your result has changed yet.
      </p>
    </>
  )
}
