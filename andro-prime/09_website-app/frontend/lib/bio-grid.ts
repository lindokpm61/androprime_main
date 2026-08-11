/**
 * Link-in-bio grid for the 30-day Instagram carousel run on `keith.antony.ai`.
 *
 * WHY THIS EXISTS. An Instagram carousel has no per-slide link, so the profile
 * link is the only door. The run tests three different closing slides against
 * each other (06_marketing/STATE.md, Instagram carousel section; copy approved
 * as CA-031), and a click can only be attributed to a close if the destination
 * identifies it.
 *
 * WHY NOT ROTATE THE BIO LINK DAILY. That was the first proposal and it is
 * wrong. Instagram keeps surfacing a post for days after it goes up, and on a
 * cold account most reach is late non-follower traffic. A day-3 post collects
 * clicks on day 8, by which time a rotated bio link points at a different
 * close, so late clicks are attributed to the wrong one — and the later the
 * click, the more wrong. That is worse than no attribution, because it looks
 * like data. Here the bio link is set ONCE and never changes: each post owns a
 * permanent `/go/<slug>` of its own, so attribution is correct whenever the tap
 * happens.
 *
 * The extra hop costs nothing. A carousel viewer must pass through the profile
 * link regardless, so there is no shorter path being given up.
 */

export type CloseKey = 'A' | 'B' | 'C'

/**
 * Kit slugs as routed under /kits. Kit 1 (`testosterone`) measures testosterone
 * ONLY and must never be offered as the answer to fatigue or brain fog
 * (03_compliance/CONTEXT.md, "Results copy scoping"; the rule itself is CA-025).
 * That constraint is what decides the `kit` field on the fatigue-type topics
 * below, and it is the easiest thing here to get wrong, because the topic and
 * the kit feel adjacent.
 */
export type KitSlug = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

export type Topic = {
  /** `blog_articles.slug`. The join key for the live title and for close C. */
  slug: string
  /** Where close B points. Governed by the Kit 1 scoping rule above. */
  kit: KitSlug
}

/**
 * The ten topics, in rotation order. Ten (not twelve) so that 10 x 3 closes is
 * exactly 30 posts and every topic runs all three closes, which makes each
 * topic its own control.
 *
 * Dropped for marker redundancy: `low-vitamin-d-symptoms` (same marker as
 * `14-signs-of-vitamin-d-deficiency`) and `inflammatory-markers-blood-test`
 * (same marker as `crp-blood-test`). Swapped out by Keith 2026-08-11:
 * `andropause-male-menopause`, which was the only topic carrying the CA-028
 * per-asset gate; `how-to-read-blood-test-results` replaced it and keeps the
 * single Kit 3 row.
 */
export const TOPICS: readonly Topic[] = [
  { slug: '14-signs-of-vitamin-d-deficiency', kit: 'energy-recovery' },
  { slug: 'b12-blood-test', kit: 'energy-recovery' },
  { slug: 'ferritin-blood-test', kit: 'energy-recovery' },
  { slug: 'crp-blood-test', kit: 'energy-recovery' },
  // Fatigue and brain fog: Kit 2, never Kit 1. See KitSlug above.
  { slug: 'why-am-i-always-tired', kit: 'energy-recovery' },
  { slug: 'brain-fog', kit: 'energy-recovery' },
  { slug: 'free-androgen-index', kit: 'testosterone' },
  { slug: 'how-to-increase-testosterone-naturally', kit: 'testosterone' },
  { slug: 'myth-of-normal-range', kit: 'testosterone' },
  { slug: 'how-to-read-blood-test-results', kit: 'hormone-recovery' },
] as const

/**
 * The three closes under test. `label` is what the grid tile says the tap will
 * do, so it must describe the destination rather than sell it: the tile is a
 * router, and a persuasive label here would contaminate the very comparison the
 * run exists to make.
 */
export const CLOSES: Record<CloseKey, { label: string; hint: string }> = {
  A: { label: 'Find the right test', hint: 'Three questions, about a minute' },
  B: { label: 'See the test', hint: 'What it measures, and what it costs' },
  C: { label: 'Read the full article', hint: 'The long version, with the sources' },
}

export type BioPost = {
  /** Path segment: `/go/<slug>`. Opaque and short; the detail rides in the event props. */
  slug: string
  /** 1-based position in the run. */
  day: number
  topic: Topic
  close: CloseKey
  /** Site-relative path. UTMs are stamped by the route handler, not baked in here. */
  destination: string
}

/**
 * ISO date (UTC) of day 1 of the run. Until this is set to a real start date the
 * grid renders empty, which is the safe direction: a bio link that shows nothing
 * is recoverable, one that reveals the unposted schedule is not.
 */
export const RUN_START_ISO = process.env.CAROUSEL_RUN_START ?? ''

export const RUN_LENGTH_DAYS = TOPICS.length * 3

function destinationFor(topic: Topic, close: CloseKey): string {
  switch (close) {
    case 'A':
      return '/test-selector'
    case 'B':
      return `/kits/${topic.kit}`
    case 'C':
      return `/blog/${topic.slug}`
  }
}

/**
 * The rotation: `topic = (day - 1) % 10`, `close = (day - 1) % 3`.
 *
 * 10 and 3 are coprime, so across 30 days every (topic, close) pair occurs
 * exactly once. That gives three properties for free, all of which would
 * otherwise have to be hand-scheduled and would drift the moment anything moved:
 * a topic never runs on consecutive days (it reappears every 10), it carries a
 * different close each time it does, and no close is bunched into one stretch of
 * account maturity — which in month one is the strongest force acting on reach,
 * and would otherwise be read as a close winning.
 */
export function buildSchedule(): BioPost[] {
  return Array.from({ length: RUN_LENGTH_DAYS }, (_, i) => {
    const day = i + 1
    const topic = TOPICS[i % TOPICS.length]
    const close = (['A', 'B', 'C'] as const)[i % 3]
    return {
      slug: `d${String(day).padStart(2, '0')}`,
      day,
      topic,
      close,
      destination: destinationFor(topic, close),
    }
  })
}

export function findPost(slug: string): BioPost | undefined {
  return buildSchedule().find((p) => p.slug === slug)
}

/**
 * Posts live enough to show, newest first, mirroring how the Instagram grid
 * itself reads. Anything not yet posted is withheld: the grid is a mirror of the
 * feed, not a schedule, and publishing tomorrow's headline early would both spoil
 * it and put unposted copy on a public page ahead of its per-post pre-flight.
 */
export function visiblePosts(now: Date = new Date()): BioPost[] {
  if (!RUN_START_ISO) return []
  const start = Date.parse(`${RUN_START_ISO}T00:00:00Z`)
  if (Number.isNaN(start)) return []
  const elapsedDays = Math.floor((now.getTime() - start) / 86_400_000) + 1
  if (elapsedDays < 1) return []
  return buildSchedule()
    .filter((p) => p.day <= elapsedDays)
    .reverse()
}
