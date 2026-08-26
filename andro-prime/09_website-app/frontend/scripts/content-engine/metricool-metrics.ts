/**
 * metricool-metrics — ask Metricool how each published post actually performed, and record it.
 *
 * Plan step 1.2 of `06_marketing/content-machine/2026-08-14-content-machine-plan.md`, the half
 * that follows the `content_metrics` migration (D7, Keith 2026-08-14).
 *
 * WHY IT EXISTS. `content_metrics` has existed since 2026-07-28 and has had no writer: its eight
 * rows are a single hand capture from that day. So every count the content machine reports is a
 * PRODUCTION count — assets written, renditions scheduled, posts published — and not one of them
 * is an OUTCOME. The 30-day carousel run is an A/B/C test of three closing slides, and until
 * something writes captures, the test has no readable result.
 *
 * THE TRAP THIS JOB IS SHAPED AROUND, and it is not the schema. The run rotates cleanly, so
 * topic effects cancel. But close A's ten posts average run-day 14.5 against close C's 16.5, so
 * COMPARING RUNNING TOTALS AT ONE MOMENT RANKS THE CLOSES BY PUBLISH DATE, in A's favour. The
 * comparison has to be at a FIXED AGE — saves at seven days. That is a requirement on CADENCE,
 * not on the schema, and it is why this job runs daily and why it reports its own seven-day
 * coverage on every run: a job that silently stops capturing looks exactly like a job with
 * nothing to capture.
 *
 * WHAT IT DOES NOT DO, DELIBERATELY.
 *
 * 1. It never invents a number. A metric the platform did not report is written as NULL, never
 *    as zero. Null and zero are different findings and only one of them is about the post.
 *
 * 2. It never moves a rendition's status to `measured`. That transition is a decision nobody has
 *    made, and it would silently change what `published` counts mean to I8 and I10.
 *
 * 3. It never matches on position or on timing. A metrics row is joined to a rendition by the
 *    PLATFORM's own post id, read out of `external_url`, which `metricool-writeback` writes from
 *    the provider's `publicUrl` and never constructs. An unmatched analytics row is reported, not
 *    attached to the nearest candidate.
 *
 * 4. It never assumes it asked the right brand. Metricool's analytics endpoints are brand-scoped
 *    and answer 200 with an empty array for the wrong brand — so "no data" and "wrong account"
 *    are the same response. Every brand we own is queried, and an empty result is reported as
 *    empty rather than read as zero engagement.
 *
 * WHAT IS VERIFIED AND WHAT IS NOT, as of 2026-08-14. The X, LinkedIn and Facebook shapes were
 * read from live data. THE INSTAGRAM SHAPE HAS NOT BEEN: no Instagram post has ever published on
 * either brand, so the endpoint answers 200 with an empty array and that proves nothing about
 * its field names. The Instagram mapper below is therefore written against candidate names and
 * the job PRINTS every unmapped key it sees, so the first live capture on 2026-08-17 tells us
 * the real schema instead of us guessing it now.
 */
import path from 'path'
import { loadEnvLocal, admin, logRun } from './_shared'
import { NETWORK } from './metricool-schedule'

export const AGENT = 'metricool-metrics'

/**
 * Every Metricool brand this business owns. Both are queried for every network.
 *
 * `METRICOOL_BLOG_ID` names ONE of them (6633045, "Keith Andro Prime"). The carousel run is on
 * the other (6693691, "Keith Antony AI"), and so is the personal Facebook page. A job that asked
 * only the configured brand would return an empty array for the carousel run and report it as a
 * clean run with nothing to capture. Measured 2026-08-14.
 */
export const BRANDS = (process.env.METRICOOL_BLOG_IDS?.trim() || '6633045,6693691').split(',').map((s) => s.trim()).filter(Boolean)

/** How far back to ask. Wide enough to re-capture a month-old post, narrow enough to stay cheap. */
export const LOOKBACK_DAYS = 45

/** The age the close test is read at. Reported on, not enforced: the cadence is what delivers it. */
export const FIXED_AGE_DAYS = 7

/**
 * The day this poll started existing. Posts published before it are OUT of the seven-day
 * coverage denominator.
 *
 * Not a convenience. Eleven renditions published between 2026-07-18 and 2026-08-06, when nothing
 * captured anything, and their age-7 readings are gone for good. Counting them would hold the
 * coverage report red forever on a gap no future run can close, and a permanent red is how a
 * real alarm becomes wallpaper — the exact failure the doctor's I4 history already records. They
 * are excluded here and named once in `06_marketing/content-machine/STATE.md` instead.
 */
export const MEASURING_SINCE = '2026-08-14T00:00:00Z'

// ── Types

export interface MeasurableRendition {
  id: string
  asset_slug: string
  platform: string
  format: string
  variant: string | null
  published_at: string | null
  external_url: string | null
  external_post_id: string | null
}

/** One row from Metricool's per-post analytics, as it arrives. Shapes differ per network. */
export type AnalyticsRow = Record<string, unknown>

export interface Capture {
  rendition_id: string
  captured_at: string
  impressions: number | null
  reach: number | null
  reactions: number | null
  comments: number | null
  shares: number | null
  saves: number | null
  video_views: number | null
  watch_seconds: number | null
  raw: AnalyticsRow
}

// ── Identity: the platform's own post id, from both sides of the join.

/**
 * The platform post id inside one of our stored URLs.
 *
 * `external_url` is written by `metricool-writeback` from the provider's own `publicUrl` and is
 * never constructed, so it is the one place our store holds the PLATFORM's identity for a post.
 * `external_post_id` is Metricool's scheduler id and is a different namespace entirely; using it
 * here would match nothing and look like a platform with no analytics.
 */
export function postIdFromUrl(platform: string, url: string | null): string | null {
  if (!url) return null
  const u = url.trim()
  if (!u) return null
  if (platform === 'x') return /\/status\/(\d+)/.exec(u)?.[1] ?? null
  if (platform === 'linkedin') {
    // Two URL shapes are live in this store, and they are NOT the same identifier.
    //   .../feed/update/urn:li:share:7492520684275970048   (Metricool wrote it; joins)
    //   .../posts/keithantony_..._activity-7487916942582964226-lqj4   (Unipile wrote it)
    // LinkedIn's ACTIVITY urn and SHARE urn are different numbers for one post, so the second
    // shape cannot be joined to an analytics row keyed on the share urn. It is still parsed, so
    // the report can say which namespace the rendition is in rather than "no id".
    const share = /(urn:li:[a-zA-Z]+:\d+)/.exec(u)?.[1]
    if (share) return share
    const activity = /activity-(\d+)/.exec(u)?.[1]
    return activity ? `urn:li:activity:${activity}` : null
  }
  // Facebook and Instagram both end in the item's own id; Facebook's analytics `postId` is
  // `<pageId>_<postId>`, so the tail is what the two sides share.
  const tail = /\/(?:posts|p|reel)\/([A-Za-z0-9_-]+)\/?$/.exec(u)?.[1] ?? /\/(\d+)\/?$/.exec(u)?.[1]
  return tail ?? null
}

/** The platform post id inside one analytics row, whatever the network calls it. */
export function postIdFromRow(platform: string, row: AnalyticsRow): string | null {
  const first = (...keys: string[]): string | null => {
    for (const k of keys) {
      const v = row[k]
      if (typeof v === 'string' && v.trim()) return v.trim()
      if (typeof v === 'number') return `${v}`
    }
    return null
  }
  if (platform === 'x') return first('tweetId', 'postId', 'id')
  if (platform === 'linkedin') return first('postId', 'shareUrn', 'id')
  /**
   * 🔴 INSTAGRAM COMPOUNDS ITS ID THE OPPOSITE WAY ROUND TO FACEBOOK, and the two used to share
   * this branch. Measured 2026-08-25 against seven live rows:
   *
   *     facebook   postId = `<pageId>_<postId>`     the TAIL is the post
   *     instagram  postId = `<mediaId>_<userId>`    the TAIL is the ACCOUNT
   *
   * So splitting on the underscore and taking the tail returned `31817303084` for every post on
   * the account. Seven published carousels each reported "has analytics but no rendition claims
   * it" against that one id, while the renditions reported "no analytics row mentions this post",
   * and `content_metrics` held zero Instagram rows for the whole run. Both halves of the join
   * were working; they were keyed on different things.
   *
   * The permalink is the fix, not a better split: `url` is the only field in the row that shares
   * a namespace with `external_url`, which is what our side derives its id from. Joining both
   * sides through `postIdFromUrl` makes that agreement structural rather than coincidental.
   *
   * The media id (the LEADING half) is the fallback when a row carries no permalink. It will not
   * join to a shortcode, but it is at least unique per post, so the unmatched report names seven
   * different posts instead of printing the account id seven times.
   */
  if (platform === 'instagram') {
    const fromUrl = postIdFromUrl('instagram', first('url', 'link', 'permalink'))
    if (fromUrl) return fromUrl
    const raw = first('postId', 'id', 'mediaId', 'igId')
    if (!raw) return null
    return raw.includes('_') ? raw.slice(0, raw.indexOf('_')) : raw
  }
  // Facebook's `postId` is `<pageId>_<postId>`; the second half is what appears in the URL.
  const raw = first('postId', 'id', 'mediaId', 'igId')
  if (!raw) return null
  return raw.includes('_') ? raw.slice(raw.indexOf('_') + 1) : raw
}

// ── Mapping: analytics row -> our columns. One table per network, candidates in order.

const NUM = (v: unknown): number | null => {
  if (v === null || v === undefined) return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

/**
 * Candidate field names per network, most specific first.
 *
 * X, LinkedIn and Facebook were read off live rows on 2026-08-14. INSTAGRAM WAS NOT, and still has
 * not been: two carousel posts have published and Metricool has produced no Instagram analytics row
 * for either, on either brand, across every date range tried on 2026-08-18. The Instagram names
 * below were corrected on that date against Metricool's own published field list instead. See the
 * block comment on the `instagram` entry: the previous mapping led with a field Metricool itself
 * marks "do not use".
 */
export const FIELD_MAP: Record<string, Partial<Record<keyof Omit<Capture, 'rendition_id' | 'captured_at' | 'raw'>, string[]>>> = {
  x: {
    impressions: ['totalImpressions', 'organicImpressions'],
    reactions: ['totalLikes'],
    comments: ['totalReplies'],
    shares: ['totalRetweets'],
    saves: ['totalBookmarks'],
    video_views: ['totalVideoViews'],
  },
  linkedin: {
    impressions: ['impressions'],
    reach: ['uniqueImpressions'],
    reactions: ['likes'],
    comments: ['comments'],
    shares: ['shares'],
  },
  facebook: {
    impressions: ['impressions', 'totalImpressions'],
    reach: ['reach', 'uniqueImpressions'],
    reactions: ['reactions', 'likes'],
    comments: ['comments'],
    shares: ['shares'],
    video_views: ['videoViews'],
    watch_seconds: ['videoWatchTime', 'totalWatchTime'],
  },
  /**
   * INSTAGRAM, corrected 2026-08-18 against Metricool's OWN published field list
   * (`getAnalyticsAvailableMetrics`, network=instagram, connector=posts), not against a live row:
   * nothing has produced an Instagram analytics row yet, and the guesses below were wrong in a way
   * that would have failed silently.
   *
   * 🔴 `impressions` IS DEPRECATED FOR INSTAGRAM. Metricool's own description of IGPO11 is "Do not
   * use this field", and the previous mapping had it FIRST, so a stale deprecated value would have
   * beaten the real one. The live organic field is `views` (IGPO28), "number of times that the
   * posts have been displayed (organic data)". `videoViews`, `impressionsTotal` and the organic
   * `clicks` are deprecated too.
   *
   * 🔴 Six of the old candidates DO NOT EXIST in Instagram's vocabulary at all: `totalImpressions`,
   * `accountsReached`, `saves`, `totalSaved`, `bookmarks`, `totalLikes`, `totalComments`,
   * `totalShares`, `plays`, `reelPlays`. They were carried over from the X and Facebook shapes.
   *
   * ⚠️ There is NO watch-time field on this connector, so `watch_seconds` stays null for Instagram
   * by fact rather than by omission. Left mapped to nothing on purpose: an empty list is a recorded
   * finding, a missing key is an oversight.
   *
   * ⚠️ Still one inference: these are the Data Studio metric names, and the per-post analytics
   * endpoint this script reads could in principle key its rows differently. The `unmapped` report
   * below remains the thing that turns this into knowledge on the first live capture. It is now a
   * check on a documented name rather than on a guess.
   */
  instagram: {
    impressions: ['views', 'impressions'],
    reach: ['reach'],
    reactions: ['likes'],
    comments: ['comments'],
    shares: ['shares'],
    saves: ['saved'],
    video_views: ['videoViews'],
    watch_seconds: [],
  },
}

/** Keys that carry identity or copy rather than a measurement, so an unmapped report ignores them. */
const NON_METRIC_KEYS = new Set([
  'blogId', 'pageId', 'companyId', 'postId', 'tweetId', 'id', 'mediaId', 'igId', 'url', 'link',
  'permalink', 'text', 'comment', 'created', 'createdAt', 'timestamp', 'type', 'mediaType',
  'picture', 'thumbnail', 'network', 'timezone', 'dateTime',
  // Added 2026-08-25 from the first live Instagram rows. `businessId` is an account identifier
  // that happens to be all digits, and `filter` is the name of the Instagram filter applied and
  // arrives as an empty string, which `Number('')` reads as a finite 0. Both were being reported
  // as "numeric fields nothing here reads", which is the one report standing between an
  // unverified mapping and a month of silent nulls. Noise in it is not cosmetic.
  'businessId', 'userId', 'filter', 'imageUrl', 'content', 'publishedAt',
])

export function mapRow(platform: string, row: AnalyticsRow, renditionId: string, capturedAt: string): Capture {
  const map = FIELD_MAP[platform] ?? {}
  const pick = (field: keyof typeof map): number | null => {
    for (const k of map[field] ?? []) {
      const v = NUM(row[k])
      if (v !== null) return v
    }
    return null
  }
  return {
    rendition_id: renditionId,
    captured_at: capturedAt,
    impressions: pick('impressions'),
    reach: pick('reach'),
    reactions: pick('reactions'),
    comments: pick('comments'),
    shares: pick('shares'),
    saves: pick('saves'),
    video_views: pick('video_views'),
    watch_seconds: pick('watch_seconds'),
    raw: row,
  }
}

/**
 * Numeric keys in a row that no mapping claims.
 *
 * This is the mechanism that turns the unverified Instagram mapping into a verified one on the
 * first live capture, instead of a silent set of nulls that reads exactly like a post nobody
 * engaged with.
 */
export function unmappedNumericKeys(platform: string, row: AnalyticsRow): string[] {
  const claimed = new Set(Object.values(FIELD_MAP[platform] ?? {}).flat())
  return Object.keys(row)
    .filter((k) => !claimed.has(k) && !NON_METRIC_KEYS.has(k))
    .filter((k) => NUM(row[k]) !== null)
    .sort()
}

// ── Seven-day coverage: the property the close test actually depends on.

export interface AgeCoverage {
  due: number
  covered: number
  missing: { slug: string; variant: string | null; publishedAt: string }[]
}

/**
 * Does every post old enough to be read at the fixed age have a capture near that age?
 *
 * Reported on every run, because the failure it guards against is invisible otherwise: a poll
 * that stopped a week ago produces exactly the same output as a poll with nothing new to record,
 * and the datapoint it missed cannot be recovered afterwards. Metricool holds running totals, so
 * numbers can be backfilled; an age-7 reading cannot.
 */
export function ageCoverage(
  rends: MeasurableRendition[],
  captures: { rendition_id: string; captured_at: string }[],
  now: Date,
  ageDays = FIXED_AGE_DAYS,
  toleranceDays = 1,
): AgeCoverage {
  const byRendition = new Map<string, string[]>()
  for (const c of captures) byRendition.set(c.rendition_id, [...(byRendition.get(c.rendition_id) ?? []), c.captured_at])

  const out: AgeCoverage = { due: 0, covered: 0, missing: [] }
  const floor = new Date(MEASURING_SINCE).getTime()
  for (const r of rends) {
    if (!r.published_at) continue
    const published = new Date(r.published_at).getTime()
    // Published before anything was capturing. Its age-7 reading was never takeable, so counting
    // it as a miss would make this report permanently red on a gap no run can close.
    if (published < floor) continue
    const mark = published + ageDays * 864e5
    // Not yet due: the window has not closed, so a missing datapoint is not a miss.
    if (now.getTime() < mark + toleranceDays * 864e5) continue
    out.due += 1
    const hit = (byRendition.get(r.id) ?? []).some((c) => Math.abs(new Date(c).getTime() - mark) <= toleranceDays * 864e5)
    if (hit) out.covered += 1
    else out.missing.push({ slug: r.asset_slug, variant: r.variant, publishedAt: r.published_at })
  }
  return out
}

// ── Metricool I/O

export type AnalyticsReader = (network: string, blogId: string, fromIso: string, toIso: string) => Promise<{ ok: true; rows: AnalyticsRow[] } | { ok: false; why: string }>

export function metricoolAnalytics(
  c: { userId: string; token: string },
  fetchImpl: typeof fetch = fetch,
): AnalyticsReader {
  return async (network, blogId, fromIso, toIso) => {
    const q = `blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(c.userId)}&userToken=${encodeURIComponent(c.token)}`
    // `from` and `to`, NOT `start` and `end`: the scheduler endpoint takes the second pair and
    // this one answers HTTP 500 for it, naming the missing parameter. Two endpoints on one API
    // with two spellings, so it is written down rather than remembered.
    const url = `https://app.metricool.com/api/v2/analytics/posts/${encodeURIComponent(network)}?${q}&from=${fromIso}&to=${toIso}`
    try {
      const res = await fetchImpl(url, { headers: { 'X-Mc-Auth': c.token } })
      const text = await res.text()
      // 403 means this brand has no connection for that network. Not an error: the other brand
      // is where that platform lives.
      if (res.status === 403) return { ok: true, rows: [] }
      if (res.status < 200 || res.status >= 300) return { ok: false, why: `HTTP ${res.status}: ${text.slice(0, 200)}` }
      const parsed = JSON.parse(text) as { data?: AnalyticsRow[] }
      return { ok: true, rows: parsed.data ?? [] }
    } catch (e) {
      return { ok: false, why: `request failed: ${(e as Error).message}` }
    }
  }
}

// ── Reporting

export interface RunResult {
  captured: { slug: string; variant: string | null; platform: string; saves: number | null; impressions: number | null }[]
  unmatched: { platform: string; postId: string; brand: string }[]
  noData: { slug: string; variant: string | null; platform: string; why: string }[]
  unmapped: Record<string, string[]>
  failed: { ref: string; why: string }[]
  coverage: AgeCoverage
  brandsQueried: string[]
}

export function exitCodeFor(r: RunResult): 0 | 2 | 3 {
  if (r.failed.length) return 2
  if (r.coverage.missing.length) return 3
  return 0
}

export function render(r: RunResult, opts: { dryRun: boolean }): string {
  const L: string[] = []
  L.push(`metricool-metrics${opts.dryRun ? ' (DRY RUN — nothing was written)' : ''}`)
  L.push('─'.repeat(72))
  for (const c of r.captured) {
    const bits = [c.impressions !== null ? `${c.impressions} impressions` : null, c.saves !== null ? `${c.saves} saves` : null]
      .filter(Boolean).join(', ') || 'no numbers reported'
    L.push(`  ${opts.dryRun ? 'WOULD RECORD' : 'RECORDED    '}  ${c.slug}${c.variant ? ` ${c.variant}` : ''}  ${c.platform}  ${bits}`)
  }
  for (const n of r.noData) L.push(`  NO DATA     ${n.slug}${n.variant ? ` ${n.variant}` : ''}  ${n.platform}\n                ${n.why}`)
  for (const u of r.unmatched) L.push(`  UNMATCHED   ${u.platform} post ${u.postId} (brand ${u.brand}) has analytics but no rendition claims it`)
  for (const f of r.failed) L.push(`  FAILED      ${f.ref}\n                ${f.why}`)
  for (const [platform, keys] of Object.entries(r.unmapped)) {
    if (!keys.length) continue
    L.push(`  UNMAPPED    ${platform} reports numeric fields nothing here reads: ${keys.join(', ')}`)
    L.push('                Promote one into a column only when something queries it (D7); until then it is in `raw`.')
  }
  L.push('')
  L.push(`  ${r.captured.length} captured, ${r.noData.length} with no data, ${r.unmatched.length} unmatched, ${r.failed.length} failed. Brands queried: ${r.brandsQueried.join(', ')}.`)
  const c = r.coverage
  L.push(`  ${FIXED_AGE_DAYS}-day coverage: ${c.covered} of ${c.due} post(s) past the mark have a datapoint within a day of it.`)
  if (c.missing.length) {
    L.push('  A MISSING SEVEN-DAY DATAPOINT CANNOT BE BACKFILLED. Metricool holds running totals, so a number can be')
    L.push('  recovered later; a reading AT an age cannot. Each of these is a post the close test can no longer use at 7 days:')
    for (const m of c.missing) L.push(`    · ${m.slug}${m.variant ? ` ${m.variant}` : ''}, published ${m.publishedAt.slice(0, 10)}`)
  }
  if (!r.captured.length && !r.noData.length && !r.failed.length) {
    L.push('  Nothing had published that could be measured. That is a clean run, not a silent one.')
  }
  return L.join('\n')
}

// ── Database

export async function loadMeasurable(): Promise<MeasurableRendition[]> {
  const { data, error } = await admin()
    .from('content_renditions')
    .select('id, platform, format, variant, published_at, external_url, external_post_id, content_assets!inner(slug)')
    .in('status', ['published', 'measured'])
  if (error) throw new Error(`content_renditions read failed: ${error.message}`)
  return (data ?? []).map((row) => {
    const a = (row as unknown as { content_assets: { slug: string } }).content_assets
    const r = row as unknown as MeasurableRendition
    return { ...r, asset_slug: a?.slug ?? '(unknown)' }
  })
}

export async function loadCaptures(renditionIds: string[]): Promise<{ rendition_id: string; captured_at: string }[]> {
  if (!renditionIds.length) return []
  const { data, error } = await admin()
    .from('content_metrics')
    .select('rendition_id, captured_at')
    .in('rendition_id', renditionIds)
  if (error) throw new Error(`content_metrics read failed: ${error.message}`)
  return (data ?? []) as { rendition_id: string; captured_at: string }[]
}

export type CaptureWriter = (c: Capture) => Promise<void>

export const writeCaptureLive: CaptureWriter = async (c) => {
  const { error } = await admin().from('content_metrics').insert(c as never)
  if (error) throw new Error(error.message)
}

// ── Orchestration

export async function runMetrics(args: {
  renditions: MeasurableRendition[]
  priorCaptures: { rendition_id: string; captured_at: string }[]
  read: AnalyticsReader
  write: CaptureWriter
  brands?: string[]
  dryRun: boolean
  now?: Date
}): Promise<RunResult> {
  const now = args.now ?? new Date()
  const brands = args.brands ?? BRANDS
  const capturedAt = now.toISOString()
  const out: RunResult = {
    captured: [], unmatched: [], noData: [], unmapped: {}, failed: [],
    coverage: { due: 0, covered: 0, missing: [] }, brandsQueried: brands,
  }

  const byPlatform = new Map<string, MeasurableRendition[]>()
  for (const r of args.renditions) byPlatform.set(r.platform, [...(byPlatform.get(r.platform) ?? []), r])

  const from = new Date(now.getTime() - LOOKBACK_DAYS * 864e5).toISOString().slice(0, 19)
  const to = new Date(now.getTime() + 864e5).toISOString().slice(0, 19)
  const written: { rendition_id: string; captured_at: string }[] = []

  for (const [platform, rends] of byPlatform) {
    const network = NETWORK[platform]
    if (!network) {
      // Not a failure. Substack publishes through its own script and Metricool has never heard
      // of it, so this route has nothing to say about those renditions — which is a different
      // statement from "the job broke", and only one of the two is work owed.
      for (const r of rends) {
        out.noData.push({ slug: r.asset_slug, variant: r.variant, platform, why: `"${platform}" is not a Metricool network, so this route cannot measure it. Its metrics, if any, come from wherever it publishes.` })
      }
      continue
    }

    // Index our side by the PLATFORM's post id. A rendition with no external_url has no platform
    // identity, which is a finding about the write-back rather than about the post.
    const mine = new Map<string, MeasurableRendition>()
    for (const r of rends) {
      const id = postIdFromUrl(platform, r.external_url)
      if (!id) {
        out.noData.push({ slug: r.asset_slug, variant: r.variant, platform, why: `no platform post id could be read from external_url (${r.external_url ?? 'null'}). Analytics are joined on the platform's own id, so this rendition cannot be matched until the write-back records a URL.` })
        continue
      }
      mine.set(id, r)
    }

    const seen = new Set<string>()
    for (const brand of brands) {
      const res = await args.read(network, brand, from, to)
      if (!res.ok) { out.failed.push({ ref: `${platform}@${brand}`, why: res.why }); continue }
      for (const row of res.rows) {
        const id = postIdFromRow(platform, row)
        if (!id) { out.failed.push({ ref: `${platform}@${brand}`, why: `an analytics row carries no post id in any known field (keys: ${Object.keys(row).slice(0, 12).join(', ')})` }); continue }
        const r = mine.get(id)
        if (!r) { out.unmatched.push({ platform, postId: id, brand }); continue }
        seen.add(id)

        const extra = unmappedNumericKeys(platform, row)
        if (extra.length) out.unmapped[platform] = [...new Set([...(out.unmapped[platform] ?? []), ...extra])].sort()

        const capture = mapRow(platform, row, r.id, capturedAt)
        if (!args.dryRun) {
          try {
            await args.write(capture)
          } catch (e) {
            out.failed.push({ ref: `${r.asset_slug} ${platform}`, why: `content_metrics insert failed: ${(e as Error).message}` })
            continue
          }
        }
        written.push({ rendition_id: r.id, captured_at: capturedAt })
        out.captured.push({ slug: r.asset_slug, variant: r.variant, platform, saves: capture.saves, impressions: capture.impressions })
      }
    }

    // A published post the analytics endpoint never mentioned. Said out loud, because on
    // Instagram this is the shape the unverified mapping would take if the endpoint reports
    // carousels somewhere else entirely.
    for (const [id, r] of mine) {
      if (seen.has(id)) continue
      // Two known cases where the id we hold and the id analytics reports are different
      // NAMESPACES for the same post, so no amount of polling will ever join them. Named
      // specifically, because "no analytics row mentions it" would send someone looking for a
      // missing post rather than a mismatched identifier.
      let why = `published, but no ${network} analytics row mentions post ${id} on brand(s) ${brands.join(', ')}. Either the platform has not reported it yet, or this network's analytics live somewhere this job is not looking.`
      if (platform === 'linkedin' && id.startsWith('urn:li:activity:')) {
        why = `its external_url carries an ACTIVITY urn (${id}) and Metricool reports LinkedIn analytics keyed on the SHARE urn. Those are different numbers for one post, so this rendition cannot be joined by id at all. Both posts in this state were published through Unipile rather than Metricool; a Metricool-published LinkedIn post carries the share urn and joins cleanly.`
      }
      if (platform === 'facebook') {
        why = `published, but no facebook analytics row mentions post ${id}. Measured 2026-08-14: the id in a Facebook post URL and the id in its analytics row DIFFER (…337201122 in the URL against …355201122 in analytics for the same post), so Facebook cannot be joined on the URL tail either. Left unjoined rather than matched on timing, which would attach one post's numbers to another.`
      }
      out.noData.push({ slug: r.asset_slug, variant: r.variant, platform, why })
    }
  }

  out.coverage = ageCoverage(args.renditions, [...args.priorCaptures, ...written], now)
  return out
}

export async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const startedAt = new Date().toISOString()

  const env = process.env
  const missing = ['METRICOOL_USER_TOKEN', 'METRICOOL_USER_ID'].filter((k) => !env[k]?.trim())
  if (missing.length) {
    console.error(`metricool-metrics: missing credential(s): ${missing.join(', ')}. Refusing to run.`)
    return 1
  }

  const renditions = await loadMeasurable()
  const result = await runMetrics({
    renditions,
    priorCaptures: await loadCaptures(renditions.map((r) => r.id)),
    read: metricoolAnalytics({ userId: env.METRICOOL_USER_ID ?? '', token: env.METRICOOL_USER_TOKEN ?? '' }),
    write: writeCaptureLive,
    dryRun,
  })

  console.log(render(result, { dryRun }))
  const code = exitCodeFor(result)
  if (doLog && !dryRun) {
    await logRun({
      agent: AGENT,
      status: code === 0 ? 'ok' : code === 2 ? 'error' : 'blocked',
      detail: {
        exit_code: code, captured: result.captured.length, no_data: result.noData.length,
        unmatched: result.unmatched.length, unmapped: result.unmapped, failed: result.failed,
        coverage: result.coverage,
      },
      startedAt,
    })
  }
  return code
}

/** Exact basename, never a suffix match — `test-metricool-metrics.ts` ends with this name. */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'metricool-metrics.ts' || base === 'metricool-metrics.js'
}

/** `process.exitCode`, not `process.exit(code)`: the latter crashes on this machine (libuv). */
if (isDirectInvocation(process.argv[1])) {
  main()
    .then((code) => { process.exitCode = code })
    .catch((e) => {
      console.error('METRICOOL-METRICS ERROR:', (e as Error).message)
      process.exitCode = 1
    })
}
