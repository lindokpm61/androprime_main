import type { AdherenceDay } from '@/lib/membership/checkin'
import { LOOP_SKIN, type LoopSurface } from './surface'

/** `YYYY-MM-DD` as "14 Aug". A date beats "22 days ago", which reads as arithmetic. */
function formatDay(day: string): string {
  const date = new Date(`${day}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

interface Props {
  series: AdherenceDay[]
  /** Which design system to wear. See `surface.ts`. */
  surface?: LoopSurface
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
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * REDRAWN 2026-09-12 against `membership-F.html` Frame H, blocks 05 to 09.
 * Three structural changes, and the frame's own summary of them is "three
 * changes, none of them colour":
 *
 *   1. THE BARS SIT IN A SUNK WELL. Before this the chart was the only element
 *      on the screen with no material under it while everything else sat in a
 *      tray, and twenty two flat marks on bare paper read as a barcode.
 *   2. WEIGHT ENCODES THE STREAK. Days inside the live run are full ink, days
 *      before it are lighter, and a day with nothing logged is a hollow outline
 *      rather than a near invisible stub, so a gap reads as a gap rather than
 *      as a rendering fault. `inStreak` comes from the series, which takes it
 *      from `currentStreak`: see the note on that field for why the chart does
 *      not work it out for itself.
 *   3. TODAY IS CAPPED AND CARRIES THE SCREEN'S ONE PULSE, on the cap and never
 *      on the bar, so a still capture of the chart is still a correct chart.
 *
 * 🔴 THE HUE IS THE ONE THING THE FRAME PROPOSES THAT IS NOT TAKEN. It paints
 * the bars in the optimal-range green. `tokens/colours.css` ties that token to
 * a RANGE VERDICT, and green beside a biomarker reads as "your numbers are
 * good", which is the exact claim the legend below exists to prevent. Owed to
 * Keith as a decision; the reasoning is in `f-app.css` beside the classes.
 */
export function AdherenceChart({ series, surface = 'app' }: Props) {
  if (series.length === 0) return null

  const skin = LOOP_SKIN[surface]
  const answeredDays = series.filter((day) => day.answered > 0).length
  const missedDays = series.length - answeredDays
  const streakDays = series.filter((day) => day.inStreak).length

  /* WHERE THE RUN STARTS IS DATA, so the marker is positioned from the series
     rather than typed. The first flagged day's index over the window gives the
     left edge; the run always reaches the right-hand end because the streak is
     by definition the days up to now. A streak longer than the window simply
     starts at 0. */
  const firstStreak = series.findIndex((day) => day.inStreak)
  const runLeft = firstStreak < 0 ? null : (firstStreak / series.length) * 100

  const lastIndex = series.length - 1

  return (
    <>
      <div className={skin.well}>
        <div
          className={skin.chart}
          role="img"
          aria-label={
            `Daily check-ins over ${series.length} days: ${answeredDays} logged, ` +
            `${missedDays} missed` +
            (streakDays > 0 ? `, and the last ${streakDays} days unbroken.` : '.')
          }
        >
          {series.map((day, index) => {
            const missed = day.answered === 0
            const className = missed
              ? skin.barMissed
              : index === lastIndex && day.inStreak
                ? skin.barToday
                : day.inStreak
                  ? skin.barStreak
                  : skin.bar

            return (
              <i
                key={day.day}
                className={className}
                /* A missed day keeps a floor so the slot stays visible as an
                   outline. A logged day is drawn at its real proportion. */
                style={{ height: missed ? '20%' : `${Math.max(day.fraction * 100, 12)}%` }}
              />
            )
          })}
        </div>

        {runLeft !== null && streakDays > 1 && (
          <div className={skin.streakRun} aria-hidden="true">
            <em style={{ marginLeft: `${runLeft}%`, width: `${100 - runLeft}%` }} />
            <span style={{ left: `${runLeft}%` }}>{streakDays} day streak</span>
          </div>
        )}
      </div>

      <div className={skin.axis}>
        <span>{formatDay(series[0].day)}</span>
        <span>Today</span>
      </div>
      <p className={skin.note}>
        This chart is about behaviour, not blood. Nothing here claims your result has changed yet.
      </p>
    </>
  )
}
