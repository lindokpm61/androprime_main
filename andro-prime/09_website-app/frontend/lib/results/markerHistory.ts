import type { ClassifiedResult, KitData, KitType } from './types'

/**
 * ONE MARKER, EVERY TIME IT HAS BEEN MEASURED, ACROSS ALL KITS.
 *
 * WHY THIS EXISTS. A retest-against-original page needs the pair of readings for
 * each marker, and nothing in the real app produced one: the only cross-time
 * surface is the membership trend rail, which plots values and says nothing
 * about which reading is which. The pairing logic DID exist, inside
 * `components/app-shell/DemoStage.tsx`, where it is a client component and
 * therefore unavailable to every server surface that needs it.
 *
 * 🔴 IT FLATTENS ACROSS KITS, AND THAT IS THE WHOLE POINT.
 * `getDashboardData` groups results by `kit_type` into `KitData`, which is right
 * for a dashboard listing purchases and wrong for a comparison: if a Kit 3 buy
 * is retested with a Kit 2, the baseline and the retest land in two different
 * buckets and the four shared markers never meet. The demo's own comment names
 * this as the reason it could not use the shared helper. The fix is NOT to
 * change the grouping, which the dashboard depends on, but to ignore it here: a
 * marker's history is a property of the PERSON, not of the kit that happened to
 * measure it.
 *
 * ⚠ WHAT THIS DELIBERATELY DOES NOT DO: say whether a marker moved. The demo's
 * `movementWord` calls anything inside 0.5% of the previous value "Unchanged",
 * a figure that sits far below analytical variation for every marker we run, so
 * on a real page it would report a rise that is pure assay noise as a rise. What
 * counts as a real change is per-marker and clinical, and it is Ewa's to set. A
 * page can render this history without ever making that claim; it cannot make
 * the claim without her.
 *
 * ⚠ AND IT IS AGNOSTIC ABOUT WHICH KIT A RETEST IS. `869eyg5bh` records that the
 * sweep dispatches the same kit while the demo shows a step-down to Kit 2, and
 * that is undecided. Joining by marker name is correct under both answers: with
 * a same-kit retest every marker finds a partner, with a step-down only the
 * shared ones do and the rest carry `previous: null`. Nothing below needs to
 * change when that ruling lands.
 */

export interface MarkerReading {
  marker: ClassifiedResult
  /** ISO timestamp, or null when the result carries no collection date. */
  collectedAt: string | null
  kitType: KitType
  resultId: string
}

export interface MarkerHistory {
  markerName: string
  /** Oldest first. Never empty. */
  readings: MarkerReading[]
  /** The most recent reading. */
  latest: MarkerReading
  /**
   * The reading immediately before `latest`, or null when there is only one.
   *
   * ⚠ NOT NECESSARILY THE BASELINE. With two readings `previous` and `first` are
   * the same object, which is every case the product can currently produce: a
   * member gets ONE retest ever (`retest-mechanism-map.md` defect 3b). They
   * diverge the moment a third reading exists, and at that point a page has to
   * choose which comparison it is making and say so on screen. Both are exposed
   * so that choice is made in the surface rather than silently here.
   */
  previous: MarkerReading | null
  /** The oldest reading. The "original test" in "retest against the original". */
  first: MarkerReading
}

/**
 * A reading with no collection date sorts OLDEST.
 *
 * The alternative, treating it as newest, is what the database's own ordering
 * does: Postgres puts NULLs first under `order by received_at desc`, so an
 * undated row arrives at the top of a newest-first list and would be taken as
 * the latest reading. A row we cannot date must not be allowed to displace a
 * dated one as "your most recent result", because that is the reading a page
 * puts a man's current number in. Sorting it oldest makes it visible in the
 * history and never authoritative.
 */
function sortKey(reading: MarkerReading): string {
  return reading.collectedAt ?? ''
}

export function markerHistories(kits: readonly KitData[]): MarkerHistory[] {
  const byMarker = new Map<string, MarkerReading[]>()

  for (const kit of kits) {
    for (const result of kit.results) {
      for (const marker of result.markers) {
        const reading: MarkerReading = {
          marker,
          collectedAt: result.collectedAt,
          kitType: kit.kitType,
          resultId: result.resultId,
        }
        const list = byMarker.get(marker.markerName)
        if (list) list.push(reading)
        else byMarker.set(marker.markerName, [reading])
      }
    }
  }

  const out: MarkerHistory[] = []
  for (const [markerName, readings] of byMarker) {
    /* Oldest first. `localeCompare` on ISO strings is a correct chronological
       comparison and matches how `getDashboardData` already sorts kits, so the
       two orderings cannot disagree. */
    readings.sort((a, b) => sortKey(a).localeCompare(sortKey(b)))

    const latest = readings[readings.length - 1]
    out.push({
      markerName,
      readings,
      latest,
      previous: readings.length > 1 ? readings[readings.length - 2] : null,
      first: readings[0],
    })
  }

  /* Stable, alphabetical, so a page that lists markers does not reorder itself
     between renders as results arrive. A surface that wants clinical ordering
     imposes its own; this one only has to be deterministic. */
  out.sort((a, b) => a.markerName.localeCompare(b.markerName))
  return out
}

/** Only the markers measured more than once: the ones a comparison can show. */
export function remeasured(histories: readonly MarkerHistory[]): MarkerHistory[] {
  return histories.filter((h) => h.previous !== null)
}

/**
 * Only the markers measured ONCE.
 *
 * Not a leftover list. Under a NARROWED retest these are most of the panel, and
 * the Record tab is built around showing them: "not retested" is information a
 * member needs, because the alternative is a page that quietly drops markers and
 * reads as though they were never measured.
 *
 * ⚠ The demo stopped exercising this on 2026-09-13 (D1): its retest is a Kit 3,
 * so every marker has two points. The function is NOT dead: `selectRetestPanel`
 * narrows 30 of the 255 Kit 3 flag combinations. But it is no longer checked by
 * eye anywhere, only by `scripts/test-marker-history.ts` section 3.
 */
export function measuredOnce(histories: readonly MarkerHistory[]): MarkerHistory[] {
  return histories.filter((h) => h.previous === null)
}
