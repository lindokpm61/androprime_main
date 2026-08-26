import type { TrendPoint } from '@/lib/membership/getMembershipView'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

interface Props {
  markerName: string
  /** Oldest first. */
  trend: TrendPoint[]
  /** The retest date, drawn as the unanswered point. Null when none is owed. */
  pendingRetestAt: Date | null
}

/**
 * One marker over time, with the retest drawn as the point that has not
 * happened yet.
 *
 * ONLY OUR OWN KITS FEED THIS. We do not ingest results from other providers: a
 * number typed in from a photo has no assay identity and no collection time,
 * testosterone needs a morning sample, and a line drawn between two different
 * assays is an artefact that looks like information. The refusal is a
 * positioning asset, not a missing feature.
 */
export function TrendRail({ markerName, trend, pendingRetestAt }: Props) {
  if (trend.length === 0) return null

  const future = pendingRetestAt
    ? { label: '?', when: pendingRetestAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) }
    : null

  const points = [
    ...trend.map((point) => ({ label: String(point.value), when: formatDate(point.collectedAt) })),
    ...(future ? [future] : []),
  ]

  // Evenly spaced between 20% and 80% so the first and last labels have room to
  // sit under their dots without clipping at the rail's ends.
  const position = (index: number) =>
    points.length === 1 ? 50 : 20 + (index / (points.length - 1)) * 60

  const unit = trend[trend.length - 1]?.unit ?? ''
  const described = points
    .map((point) => (point.when ? `${point.label} on ${point.when}` : point.label))
    .join(', ')

  return (
    <>
      <div
        className="membership__rail"
        role="img"
        aria-label={`${markerName}: ${described}.`}
      >
        <span className="membership__rail-line" />
        {points.map((point, index) => (
          <span
            key={`${point.label}-${point.when}-${index}`}
            className={
              future && index === points.length - 1
                ? 'membership__point membership__point--future'
                : 'membership__point'
            }
            style={{ left: `${position(index)}%` }}
          >
            <span className="membership__point-value">{point.label}</span>
            <span className="membership__point-dot" />
            <span className="membership__point-when">{point.when}</span>
          </span>
        ))}
      </div>
      <p className="membership__rail-note">
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
