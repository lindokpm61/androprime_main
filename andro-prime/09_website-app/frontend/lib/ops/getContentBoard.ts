import { createSupabaseAdminClient } from '@/lib/supabase/admin'

/**
 * Plan step 7.1: the data layer behind `/ops/content`.
 *
 * READ-ONLY BY CONSTRUCTION. Nothing here writes. The plan's rule is that a wrong number should stay
 * a wrong number rather than become a wrong action, so the write actions (7.3) arrive separately and
 * only for the three things that are genuinely gates.
 *
 * FOUR THINGS THIS MUST DO THAT NO EXISTING BOARD DOES, each one a defect this exists to fix:
 *
 *  1. LIST EVERY LANE, INCLUDING THE EMPTY ONES. A board built from the rows that exist cannot show
 *     you the lane that has none, and an empty lane is perfectly consistent with itself. So the
 *     channel table drives the board and renditions are joined onto it, never the other way round.
 *
 *  2. GROUP BY PRODUCTION KIND, NOT PLATFORM. Twenty-one shot renditions across four platforms are
 *     ONE job — a filming day — not four platform problems. Grouping by platform makes one blocked
 *     input look like four separate backlogs and hides that a single day unblocks all of them.
 *
 *  3. SEPARATE COVERAGE FROM HEALTH. Twenty-one renditions sitting untouched at `to-produce` is a
 *     state in which every store agrees perfectly. Coverage asks "is there a row"; health asks "has
 *     anything happened to it". A board that only measures the first reports a stalled pipeline as
 *     green.
 *
 *  4. SURFACE UNREGISTERED WORK AS A FAILURE. A board that silently excludes live posts is worse
 *     than no board. Anything published without a rendition row, or scheduled without the platform
 *     agreeing, is reported here rather than omitted.
 */

// ── Production kind: how a thing is MADE, which is what actually gates it ────
// The distinction the platform axis destroys: a carousel and a Reel both go to Instagram and have
// nothing else in common, while a Reel and a YouTube Short are the same shoot cut twice.

export type ProductionKind = 'written' | 'carousel' | 'shot' | 'newsletter'

const PRODUCTION_KIND: Record<string, ProductionKind> = {
  'text-post': 'written',
  'link-post': 'written',
  carousel: 'carousel',
  reel: 'shot',
  short: 'shot',
  'long-form': 'shot',
  newsletter: 'newsletter',
}

/** An unknown format is 'written' ONLY as a display fallback; it is also reported as an anomaly. */
export function productionKindOf(format: string): ProductionKind {
  return PRODUCTION_KIND[format] ?? 'written'
}

export const PRODUCTION_KIND_LABEL: Record<ProductionKind, string> = {
  written: 'Written',
  carousel: 'Carousel',
  shot: 'Shot on camera',
  newsletter: 'Newsletter',
}

/** What blocks a whole kind, stated once rather than rediscovered per lane. */
export const PRODUCTION_KIND_INPUT: Record<ProductionKind, string> = {
  written: 'a published, signed-off article to atomise',
  carousel: 'a rendered deck and approved captions',
  shot: 'a booked filming day',
  newsletter: 'a published article to republish',
}

// ── Shapes ──────────────────────────────────────────────────────────────────

export interface ChannelRow {
  platform: string
  format: string
  label: string
  lane: string | null
  inPlan: boolean
  connected: boolean
  publisher: string | null
  account: string | null
  publisherBrand: string | null
  mediaKind: string
  mediaMin: number
  mediaMax: number | null
  mediaAspect: string | null
  thumbSpec: string
  bodyMaxChars: number | null
  /** Null means this route has NEVER carried a real post, which `connected` does not tell you. */
  routeVerifiedAt: string | null
  coveragePausedUntil: string | null
  coveragePauseReason: string | null
}

export interface LaneSummary {
  channel: ChannelRow
  kind: ProductionKind
  total: number
  byStatus: Record<string, number>
  /** Renditions that have moved past to-produce. The health half of the coverage/health split. */
  moved: number
  scheduledNext7: number
  lastPublishedAt: string | null
}

export interface KindGroup {
  kind: ProductionKind
  label: string
  input: string
  lanes: LaneSummary[]
  total: number
  moved: number
  /**
   * Lanes in this group that actually HOLD work. Not `lanes.length`: an empty lane is not a problem
   * the blocked input is causing, and counting it overstates the claim.
   *
   * Computed here and NOWHERE ELSE. It was briefly derived independently in the panel component and
   * in the needs-you message, which is two call sites for one fact, and fixing one of them made the
   * page state "not 4 problems" and "not 5 separate problems" about the same lane group.
   */
  lanesWithWork: number
  /** True when the kind holds work and NONE of it has moved: one blocked input, not N problems. */
  stalled: boolean
}

export interface NeedsYou {
  severity: 'blocker' | 'attention'
  what: string
  detail: string
  count: number
}

export interface Anomaly {
  what: string
  detail: string
  count: number
}

export interface ContentBoard {
  fetchedAt: string
  error?: string

  needsYou: NeedsYou[]
  kinds: KindGroup[]
  channels: ChannelRow[]

  media: {
    files: number
    linkedToRenditions: number
    /** Renditions whose channel requires media and that have none linked. */
    owedByChannelSpec: number
    thumbsOwed: number
  }

  approvals: {
    assetsAwaitingEwa: number
    assetsAwaitingBusiness: number
    preflightRed: number
    preflightNotRun: number
  }

  health: {
    coverageSlots: number
    coverageFilled: number
    /** Filled but never moved: the state where every store agrees and nothing is happening. */
    coverageFilledButUnmoved: number
    routesProven: number
    routesTotal: number
  }

  /** The panel the proposal omitted. Step 1.2 is what makes it possible at all. */
  effect: {
    capturedRenditions: number
    totalCaptures: number
    latestCaptureAt: string | null
    savesByVariant: { variant: string; posts: number; withSaves: number; totalSaves: number }[]
  }

  anomalies: Anomaly[]
}

// ── Query ───────────────────────────────────────────────────────────────────

interface RawRendition {
  id: string
  asset_id: string
  platform: string
  format: string
  variant: string | null
  status: string
  thumb_spec: string
  scheduled_for: string | null
  published_at: string | null
  external_url: string | null
  external_post_id: string | null
}

const MOVED_STATUSES = new Set([
  'drafted', 'thumbnail-done', 'approved', 'scheduled', 'published', 'measured',
])

function emptyBoard(error: string): ContentBoard {
  return {
    fetchedAt: new Date().toISOString(),
    error,
    needsYou: [], kinds: [], channels: [],
    media: { files: 0, linkedToRenditions: 0, owedByChannelSpec: 0, thumbsOwed: 0 },
    approvals: { assetsAwaitingEwa: 0, assetsAwaitingBusiness: 0, preflightRed: 0, preflightNotRun: 0 },
    health: { coverageSlots: 0, coverageFilled: 0, coverageFilledButUnmoved: 0, routesProven: 0, routesTotal: 0 },
    effect: { capturedRenditions: 0, totalCaptures: 0, latestCaptureAt: null, savesByVariant: [] },
    anomalies: [],
  }
}

export async function getContentBoard(now: Date = new Date()): Promise<ContentBoard> {
  const db = createSupabaseAdminClient()

  const [channelsRes, rendsRes, assetsRes, articlesRes, mediaRes, linksRes, metricsRes] =
    await Promise.all([
      db.from('content_channels').select('*').order('sort_order'),
      db.from('content_renditions').select(
        'id,asset_id,platform,format,variant,status,thumb_spec,scheduled_for,published_at,external_url,external_post_id',
      ),
      db.from('content_assets').select('id,slug,status,preflight,ewa_task,ewa_signed_at,approved_at,canonical_article_id'),
      db.from('blog_articles').select('id,status'),
      db.from('content_media').select('id,asset_id,kind'),
      db.from('content_rendition_media').select('rendition_id,media_id,role'),
      db.from('content_metrics').select('rendition_id,captured_at,saves'),
    ])

  // An unread table is NOT an empty one. Reporting zero for a failed read is the single most
  // dangerous thing a board can do, because zero looks like a clean state.
  const failed = [
    channelsRes.error && 'content_channels',
    rendsRes.error && 'content_renditions',
    assetsRes.error && 'content_assets',
    articlesRes.error && 'blog_articles',
    mediaRes.error && 'content_media',
    linksRes.error && 'content_rendition_media',
    metricsRes.error && 'content_metrics',
  ].filter(Boolean) as string[]
  if (failed.length) {
    return emptyBoard(`could not read: ${failed.join(', ')}. Nothing below is a measurement.`)
  }

  const channels: ChannelRow[] = (channelsRes.data ?? []).map((c: Record<string, unknown>) => ({
    platform: String(c.platform), format: String(c.format), label: String(c.label),
    lane: (c.lane as string) ?? null,
    inPlan: Boolean(c.in_plan), connected: Boolean(c.connected),
    publisher: (c.publisher as string) ?? null, account: (c.account as string) ?? null,
    publisherBrand: (c.publisher_brand as string) ?? null,
    mediaKind: String(c.media_kind ?? 'none'),
    mediaMin: Number(c.media_min ?? 0),
    mediaMax: c.media_max === null || c.media_max === undefined ? null : Number(c.media_max),
    mediaAspect: (c.media_aspect as string) ?? null,
    thumbSpec: String(c.thumb_spec ?? 'none'),
    bodyMaxChars: c.body_max_chars === null || c.body_max_chars === undefined ? null : Number(c.body_max_chars),
    routeVerifiedAt: (c.route_verified_at as string) ?? null,
    coveragePausedUntil: (c.coverage_paused_until as string) ?? null,
    coveragePauseReason: (c.coverage_pause_reason as string) ?? null,
  }))

  const rends = (rendsRes.data ?? []) as RawRendition[]
  const assets = assetsRes.data ?? []
  const articles = articlesRes.data ?? []
  const links = linksRes.data ?? []
  const metrics = metricsRes.data ?? []

  const chKey = (p: string, f: string) => `${p}/${f}`
  const byChannel = new Map<string, RawRendition[]>()
  for (const r of rends) {
    const k = chKey(r.platform, r.format)
    const list = byChannel.get(k)
    if (list) list.push(r); else byChannel.set(k, [r])
  }

  const in7 = new Date(now.getTime() + 7 * 86_400_000)

  // ── Lanes, driven by the CHANNEL table so an empty lane still appears ──────
  const lanes: LaneSummary[] = channels.map((c) => {
    const rs = byChannel.get(chKey(c.platform, c.format)) ?? []
    const byStatus: Record<string, number> = {}
    for (const r of rs) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1
    const published = rs.map((r) => r.published_at).filter(Boolean).sort() as string[]
    return {
      channel: c,
      kind: productionKindOf(c.format),
      total: rs.length,
      byStatus,
      moved: rs.filter((r) => MOVED_STATUSES.has(r.status)).length,
      scheduledNext7: rs.filter(
        (r) => r.status === 'scheduled' && r.scheduled_for &&
               new Date(r.scheduled_for) >= now && new Date(r.scheduled_for) <= in7,
      ).length,
      lastPublishedAt: published.length ? published[published.length - 1] : null,
    }
  })

  const kinds: KindGroup[] = (['written', 'carousel', 'shot', 'newsletter'] as ProductionKind[])
    .map((kind) => {
      const ls = lanes.filter((l) => l.kind === kind)
      const total = ls.reduce((n, l) => n + l.total, 0)
      const moved = ls.reduce((n, l) => n + l.moved, 0)
      return {
        kind,
        label: PRODUCTION_KIND_LABEL[kind],
        input: PRODUCTION_KIND_INPUT[kind],
        lanes: ls,
        total,
        moved,
        lanesWithWork: ls.filter((l) => l.total > 0).length,
        stalled: total > 0 && moved === 0,
      }
    })
    .filter((g) => g.lanes.length > 0)

  // ── Media, measured against what each channel SAYS it requires (step 6.1) ──
  const linkedRenditionIds = new Set(links.map((l: Record<string, unknown>) => String(l.rendition_id)))
  const chSpec = new Map(channels.map((c) => [chKey(c.platform, c.format), c]))
  const owedByChannelSpec = rends.filter((r) => {
    const c = chSpec.get(chKey(r.platform, r.format))
    if (!c || c.mediaKind === 'none' || c.mediaMin === 0) return false
    return !linkedRenditionIds.has(r.id)
  }).length

  // ── Approvals ─────────────────────────────────────────────────────────────
  const approvals = {
    assetsAwaitingEwa: assets.filter((a: Record<string, unknown>) => a.preflight === 'amber-ewa' && !a.ewa_signed_at).length,
    assetsAwaitingBusiness: assets.filter((a: Record<string, unknown>) => !a.approved_at).length,
    preflightRed: assets.filter((a: Record<string, unknown>) => a.preflight === 'red').length,
    preflightNotRun: assets.filter((a: Record<string, unknown>) => !a.preflight || a.preflight === 'not-run').length,
  }

  // ── Health: coverage and movement are DIFFERENT questions ─────────────────
  const publishedArticles = articles.filter((a: Record<string, unknown>) => a.status === 'published').length
  const plannedChannels = channels.filter((c) => c.inPlan).length
  const coverageFilledButUnmoved = lanes.reduce((n, l) => n + (l.total - l.moved), 0)

  // ── Effect: the A/B/C close test, which step 1.2 is what makes readable ───
  const savesByRendition = new Map<string, number>()
  const capturedIds = new Set<string>()
  let latestCaptureAt: string | null = null
  for (const m of metrics as Record<string, unknown>[]) {
    const rid = String(m.rendition_id)
    capturedIds.add(rid)
    const s = m.saves === null || m.saves === undefined ? null : Number(m.saves)
    if (s !== null) savesByRendition.set(rid, Math.max(savesByRendition.get(rid) ?? 0, s))
    const at = m.captured_at ? String(m.captured_at) : null
    if (at && (!latestCaptureAt || at > latestCaptureAt)) latestCaptureAt = at
  }
  const variantAgg = new Map<string, { posts: number; withSaves: number; totalSaves: number }>()
  for (const r of rends) {
    if (!r.variant) continue
    const agg = variantAgg.get(r.variant) ?? { posts: 0, withSaves: 0, totalSaves: 0 }
    agg.posts += 1
    const s = savesByRendition.get(r.id)
    if (s !== undefined) { agg.withSaves += 1; agg.totalSaves += s }
    variantAgg.set(r.variant, agg)
  }

  // ── Anomalies: unregistered and disagreeing work, reported not omitted ────
  const anomalies: Anomaly[] = []

  const publishedNoUrl = rends.filter(
    (r) => (r.status === 'published' || r.status === 'measured') && !r.external_url?.trim(),
  ).length
  if (publishedNoUrl) {
    anomalies.push({
      what: 'published with no URL',
      detail: 'a rendition claims to have shipped and carries no evidence of where.',
      count: publishedNoUrl,
    })
  }

  const scheduledNoId = rends.filter(
    (r) => r.status === 'scheduled' && !r.external_post_id?.trim(),
  ).length
  if (scheduledNoId) {
    anomalies.push({
      what: 'scheduled with no publisher id',
      detail: 'we call it scheduled and hold nothing that lets us ask the platform about it.',
      count: scheduledNoId,
    })
  }

  const unknownFormats = [...new Set(
    rends.filter((r) => !PRODUCTION_KIND[r.format]).map((r) => r.format),
  )]
  if (unknownFormats.length) {
    anomalies.push({
      what: 'format with no production kind',
      detail: `${unknownFormats.join(', ')} — grouped as Written for display only, which is a guess.`,
      count: unknownFormats.length,
    })
  }

  const orphanRends = rends.filter((r) => !chSpec.has(chKey(r.platform, r.format))).length
  if (orphanRends) {
    anomalies.push({
      what: 'rendition on an unregistered channel',
      detail: 'a rendition exists for a platform/format with no content_channels row, so no board driven by channels can see it.',
      count: orphanRends,
    })
  }

  const assetIds = new Set(assets.map((a: Record<string, unknown>) => String(a.id)))
  const orphanAssets = rends.filter((r) => !assetIds.has(r.asset_id)).length
  if (orphanAssets) {
    anomalies.push({
      what: 'rendition with no parent asset',
      detail: 'the row has no idea behind it.',
      count: orphanAssets,
    })
  }

  // ── What needs you ────────────────────────────────────────────────────────
  const needsYou: NeedsYou[] = []

  if (approvals.preflightRed) {
    needsYou.push({
      severity: 'blocker', what: 'Pre-flight RED',
      detail: 'an unresolved hard compliance failure. Nothing downstream of these should move.',
      count: approvals.preflightRed,
    })
  }
  for (const g of kinds) {
    if (g.stalled) {
      needsYou.push({
        severity: 'blocker', what: `${g.label} lane is stalled`,
        detail: `${g.total} rendition(s) across ${g.lanesWithWork} lane(s), none past to-produce. One blocked input, not ${g.lanesWithWork} problems: it needs ${g.input}.`,
        count: g.total,
      })
    }
  }
  if (approvals.assetsAwaitingEwa) {
    needsYou.push({
      severity: 'attention', what: 'Waiting on Ewa',
      detail: 'amber at pre-flight with no sign-off recorded.',
      count: approvals.assetsAwaitingEwa,
    })
  }
  const neverProven = channels.filter((c) => c.inPlan && c.connected && !c.routeVerifiedAt).length
  if (neverProven) {
    needsYou.push({
      severity: 'attention', what: 'Routes never proven',
      detail: 'connected, in plan, and has never carried a real post. Connected is not evidence.',
      count: neverProven,
    })
  }
  if (owedByChannelSpec) {
    needsYou.push({
      severity: 'attention', what: 'Renditions missing required media',
      detail: 'the channel spec requires media and none is linked in content_media.',
      count: owedByChannelSpec,
    })
  }
  for (const a of anomalies) {
    needsYou.push({ severity: 'blocker', what: a.what, detail: a.detail, count: a.count })
  }

  return {
    fetchedAt: now.toISOString(),
    needsYou,
    kinds,
    channels,
    media: {
      files: (mediaRes.data ?? []).length,
      linkedToRenditions: linkedRenditionIds.size,
      owedByChannelSpec,
      thumbsOwed: rends.filter(
        (r) => r.thumb_spec !== 'none' && !MOVED_STATUSES.has(r.status),
      ).length,
    },
    approvals,
    health: {
      coverageSlots: publishedArticles * plannedChannels,
      coverageFilled: rends.length,
      coverageFilledButUnmoved,
      routesProven: channels.filter((c) => c.routeVerifiedAt).length,
      routesTotal: channels.length,
    },
    effect: {
      capturedRenditions: capturedIds.size,
      totalCaptures: metrics.length,
      latestCaptureAt,
      savesByVariant: [...variantAgg.entries()]
        .map(([variant, v]) => ({ variant, ...v }))
        .sort((a, b) => a.variant.localeCompare(b.variant)),
    },
    anomalies,
  }
}
