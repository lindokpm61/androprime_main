/**
 * metricool-writeback — ask Metricool what actually went out, and record it.
 *
 * This is the other half of `metricool-schedule.ts`. That job creates a post and stores its
 * `external_post_id`; nothing has ever read back. It is the "Metricool write-back poll" from
 * `06_marketing/content-machine/content-pipeline-automation-plan.md` §5 Phase 2, and step 0.2 of
 * `06_marketing/content-machine/2026-08-14-content-machine-plan.md`.
 *
 * WHY IT EXISTS. Invariant I4 ("no scheduled rendition has a date in the past") has been red every
 * morning since 2026-08-03, and its own message names the ambiguity it cannot resolve: a rendition
 * still `scheduled` after its slot "either published and nothing wrote back, or it silently did not
 * go out". Those two need opposite responses and no check in this repo could tell them apart,
 * because telling them apart requires asking the publisher. At the time of writing, eight
 * renditions sit in exactly that state, and thirty carousel posts begin publishing on 2026-08-17.
 *
 * WHAT IT DOES. For every rendition this system scheduled through Metricool and still believes is
 * pending, it resolves the post and, if the platform reports PUBLISHED, records three things: the
 * status, the publication time, and the live URL the platform gave back.
 *
 * WHAT IT DOES NOT DO, DELIBERATELY.
 *
 * 1. It never invents a URL. `external_url` is written only from the provider's own `publicUrl`.
 *    A published post whose provider returns no URL is recorded as published WITHOUT a URL and
 *    named in the output, because a constructed link that 404s is worse than an absent one.
 *
 * 2. It never clears an id and never touches a rendition it did not schedule. A post that no
 *    longer resolves is I3's finding (`content-doctor`), which exists to see exactly that. This
 *    job reports it and moves on rather than "tidying up" a disagreement between two stores by
 *    deleting one side of it.
 *
 * 3. It never marks something published on our own timer. Only the platform's own
 *    `providers[].status === 'PUBLISHED'` counts. A post whose slot has passed while Metricool
 *    still reports it pending is REPORTED, not written: that is the "silently did not go out"
 *    branch I4 could never distinguish, and it is work owed rather than a state to record.
 *
 * 4. It does not move an asset's status. Renditions are its business; assets are the gate's.
 *
 * WHAT MAKES A BAD RUN RECOVERABLE: `--dry-run` prints every write it would make and performs
 * none, and each row it does write is one UPDATE keyed by rendition id, with the id it read from
 * Metricool printed alongside. Nothing is deleted and no status ever moves backwards.
 */
import { loadEnvLocal, admin, logRun } from './_shared'
import { NETWORK } from './metricool-schedule'

export const AGENT = 'metricool-writeback'

// ── Types

export interface PendingRendition {
  id: string
  asset_slug: string
  platform: string
  format: string
  status: string
  scheduled_for: string | null
  external_post_id: string
  external_url: string | null
}

/** One provider entry inside a Metricool scheduler post. */
export interface ProviderState {
  network: string
  id?: string
  status?: string
  publicUrl?: string
  detailedStatus?: string
}

export interface MetricoolPost {
  id?: string | number
  draft?: boolean
  publicationDate?: { dateTime?: string; timezone?: string }
  providers?: ProviderState[]
}

export type PostLookup =
  | { state: 'found'; post: MetricoolPost }
  | { state: 'missing' }
  | { state: 'unresolvable'; why: string }

export type Verdict =
  | { kind: 'write'; publishedAt: string | null; url: string | null; note?: string }
  | { kind: 'pending'; why: string }
  | { kind: 'report'; why: string }
  | { kind: 'refuse'; why: string }

// ── Time: the inverse of metricool-schedule's `wallClock`.

/**
 * How far ahead of UTC a zone is at a given instant, in milliseconds.
 *
 * `hour12: false` can render midnight as hour "24" rather than "00" in some runtimes, which
 * would push the result a day out. Normalised here rather than trusted.
 */
export function zoneOffsetMs(instant: number, timeZone: string): number {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date(instant)).reduce<Record<string, string>>((a, x) => (a[x.type] = x.value, a), {})
  const hour = p.hour === '24' ? 0 : Number(p.hour)
  const asIfUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), hour, Number(p.minute), Number(p.second))
  return asIfUtc - instant
}

/**
 * Turn Metricool's local wall-clock string plus IANA zone into a UTC instant.
 *
 * Metricool never sends an offset, only a wall clock and a zone name, so the offset has to be
 * derived. The offset depends on the instant and the instant depends on the offset, so this
 * iterates twice: the first pass uses the naive reading to find a candidate offset, the second
 * re-derives it at the corrected instant, which is what makes a value near a DST boundary land
 * on the right side of the change.
 *
 * Verified against live data: `2026-08-06T12:15:00` Europe/London resolves to `11:15Z`, which is
 * exactly the `scheduled_for` already stored for that rendition.
 */
export function utcFromWallClock(wall: string, timeZone = 'Europe/London'): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(wall.trim())
  if (!m) return null
  const naive = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6] ?? '0'))
  let t = naive
  for (let i = 0; i < 2; i += 1) t = naive - zoneOffsetMs(t, timeZone)
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}

// ── Decision. Pure, so every branch is testable without a network or a database.

/**
 * Find the provider entry that corresponds to our platform.
 *
 * Our vocabulary is not Metricool's (`x` is `twitter`), and the mapping is the one already
 * declared in `metricool-schedule.ts` rather than a second copy of it here. A platform with no
 * mapping cannot be matched, which is a refusal rather than a guess.
 */
export function pickProvider(post: MetricoolPost, platform: string): ProviderState | null {
  const network = NETWORK[platform]
  if (!network) return null
  return (post.providers ?? []).find((p) => p.network === network) ?? null
}

/**
 * Decide what one rendition's lookup means.
 *
 * Five outcomes, not two. `pending` and `report` are deliberately distinct from `refuse`:
 * a post Metricool has not sent yet is routine until its slot passes, and becomes a finding
 * afterwards. Collapsing them would either alarm on every future-dated post or stay silent on
 * the exact failure this job was built to surface.
 */
export function classify(r: PendingRendition, lookup: PostLookup, now: Date = new Date()): Verdict {
  if (lookup.state === 'missing') {
    return { kind: 'report', why: `Metricool has no post with id ${r.external_post_id}. That is invariant I3's finding, not this job's to fix: the id changed or the post was deleted. This job will not clear an id.` }
  }
  if (lookup.state === 'unresolvable') {
    return { kind: 'report', why: `could not find out: ${lookup.why}. Unverified is not the same as unpublished, so nothing is written.` }
  }

  const post = lookup.post
  const provider = pickProvider(post, r.platform)
  if (!provider) {
    const nets = (post.providers ?? []).map((p) => p.network).join(', ') || 'none'
    return { kind: 'refuse', why: `post ${r.external_post_id} carries no provider for platform "${r.platform}" (expected network "${NETWORK[r.platform] ?? '(unmapped)'}", post has: ${nets}). The id and the rendition disagree about what this post is.` }
  }

  const state = (provider.status ?? '').toUpperCase()

  if (state === 'PUBLISHED') {
    const wall = post.publicationDate?.dateTime
    const zone = post.publicationDate?.timezone ?? 'Europe/London'
    const publishedAt = wall ? utcFromWallClock(wall, zone) : null
    const url = provider.publicUrl?.trim() || null

    // A publication time that disagrees with our own slot means the post was moved inside
    // Metricool after we scheduled it. Recorded, not corrected: this job's business is what
    // happened, and someone should know the plan changed underneath the plan.
    let note: string | undefined
    if (publishedAt && r.scheduled_for) {
      const drift = Math.abs(new Date(publishedAt).getTime() - new Date(r.scheduled_for).getTime())
      if (drift > 60_000) note = `publication time ${publishedAt} differs from our scheduled_for ${r.scheduled_for} by ${Math.round(drift / 60_000)} min: the post was moved in Metricool after we scheduled it`
    }
    if (!url) note = `${note ? note + '; ' : ''}provider reported PUBLISHED but returned no publicUrl, so external_url stays null rather than being constructed`
    return { kind: 'write', publishedAt, url, note }
  }

  if (state.includes('ERROR') || state === 'FAILED') {
    return { kind: 'refuse', why: `the platform REPORTED A FAILURE for this post: status "${provider.status}"${provider.detailedStatus ? ` (${provider.detailedStatus})` : ''}. It did not go out. This is the branch invariant I4 could never distinguish from a missing write-back, and it needs a person.` }
  }

  if (post.draft === true) {
    return { kind: 'report', why: `still a DRAFT in Metricool (provider status "${provider.status ?? 'none'}"). Someone has to flip it live; that is the standing decision of 2026-07-31, not an oversight.` }
  }

  const slotPassed = r.scheduled_for ? new Date(r.scheduled_for).getTime() <= now.getTime() : false
  if (slotPassed) {
    return { kind: 'refuse', why: `slot ${r.scheduled_for} has passed but Metricool still reports status "${provider.status ?? 'none'}"${provider.detailedStatus ? ` (${provider.detailedStatus})` : ''}. It has NOT published. Nothing is written, because recording a publish that did not happen is worse than the red invariant.` }
  }
  return { kind: 'pending', why: `not published yet, status "${provider.status ?? 'none'}", slot ${r.scheduled_for ?? '(none)'} still ahead` }
}

// ── Metricool I/O

export type Reader = (postId: string) => Promise<PostLookup>

export function metricoolReader(
  c: { blogId: string; userId: string; token: string },
  fetchImpl: typeof fetch = fetch,
): Reader {
  const q = `blogId=${encodeURIComponent(c.blogId)}&userId=${encodeURIComponent(c.userId)}&userToken=${encodeURIComponent(c.token)}`
  return async (postId) => {
    try {
      const res = await fetchImpl(`https://app.metricool.com/api/v2/scheduler/posts/${encodeURIComponent(postId)}?${q}`, {
        headers: { 'X-Mc-Auth': c.token },
      })
      if (res.status === 404) return { state: 'missing' }
      if (res.status < 200 || res.status >= 300) return { state: 'unresolvable', why: `Metricool answered HTTP ${res.status}` }
      const text = await res.text()
      try {
        const parsed = JSON.parse(text) as { data?: MetricoolPost }
        const post = parsed?.data
        if (!post) return { state: 'unresolvable', why: 'Metricool answered 200 with no data object' }
        return { state: 'found', post }
      } catch {
        return { state: 'unresolvable', why: `Metricool answered 200 with unreadable JSON: ${text.slice(0, 200)}` }
      }
    } catch (e) {
      return { state: 'unresolvable', why: `Metricool request failed: ${(e as Error).message}` }
    }
  }
}

// ── Reporting

export interface RunResult {
  written: { slug: string; platform: string; publishedAt: string | null; url: string | null; note?: string }[]
  refused: { slug: string; platform: string; why: string }[]
  reported: { slug: string; platform: string; why: string }[]
  pending: number
  failed: { slug: string; platform: string; why: string }[]
}

export function exitCodeFor(r: RunResult): 0 | 2 | 3 {
  if (r.failed.length) return 2
  if (r.refused.length) return 3
  return 0
}

export function render(r: RunResult, opts: { dryRun: boolean }): string {
  const L: string[] = []
  L.push(`metricool-writeback${opts.dryRun ? ' (DRY RUN — nothing was written)' : ''}`)
  L.push('─'.repeat(72))
  for (const w of r.written) {
    L.push(`  ${opts.dryRun ? 'WOULD SET' : 'PUBLISHED'}  ${w.slug}  ${w.platform}  at ${w.publishedAt ?? '(no time)'}`)
    L.push(`               ${w.url ?? '(no url returned)'}`)
    if (w.note) L.push(`               NOTE: ${w.note}`)
  }
  for (const f of r.failed) L.push(`  FAILED     ${f.slug}  ${f.platform}\n               ${f.why}`)
  for (const f of r.refused) L.push(`  REFUSED    ${f.slug}  ${f.platform}\n               ${f.why}`)
  for (const f of r.reported) L.push(`  UNRESOLVED ${f.slug}  ${f.platform}\n               ${f.why}`)
  L.push('')
  L.push(`  ${r.written.length} recorded published, ${r.failed.length} failed, ${r.refused.length} refused, ${r.reported.length} unresolved, ${r.pending} still ahead of their slot.`)
  if (r.refused.length) L.push('  A REFUSAL IS WORK OWED: each one names a post that did NOT go out, or an id that does not match its rendition.')
  if (!r.written.length && !r.failed.length && !r.refused.length && !r.reported.length) L.push('  Nothing had published since the last run. That is a clean run, not a silent one.')
  return L.join('\n')
}

// ── Database

export async function loadPending(): Promise<PendingRendition[]> {
  const { data, error } = await admin()
    .from('content_renditions')
    .select('id, platform, format, status, scheduled_for, external_post_id, external_url, content_assets!inner(slug)')
    .eq('publisher', 'metricool')
    .eq('status', 'scheduled')
    .not('external_post_id', 'is', null)
  if (error) throw new Error(`content_renditions read failed: ${error.message}`)
  return (data ?? []).map((row) => {
    const a = (row as unknown as { content_assets: { slug: string } }).content_assets
    return {
      id: (row as { id: string }).id,
      asset_slug: a?.slug ?? '(unknown)',
      platform: (row as { platform: string }).platform,
      format: (row as { format: string }).format,
      status: (row as { status: string }).status,
      scheduled_for: (row as { scheduled_for: string | null }).scheduled_for,
      external_post_id: ((row as { external_post_id: string }).external_post_id ?? '').trim(),
      external_url: (row as { external_url: string | null }).external_url,
    }
  })
}

export type Writer = (id: string, patch: { published_at: string | null; external_url: string | null }) => Promise<void>

/**
 * Only the three columns this job owns are ever sent, and a null is never written over a value:
 * a publish we could not time, or could not link, must not erase a time or link already there.
 */
export const writeBackLive: Writer = async (id, patch) => {
  const { error } = await admin()
    .from('content_renditions')
    .update({
      status: 'published',
      ...(patch.published_at ? { published_at: patch.published_at } : {}),
      ...(patch.external_url ? { external_url: patch.external_url } : {}),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Orchestration

export async function runWriteback(args: {
  renditions: PendingRendition[]
  read: Reader
  write: Writer
  dryRun: boolean
  now?: Date
}): Promise<RunResult> {
  const out: RunResult = { written: [], refused: [], reported: [], pending: 0, failed: [] }
  const now = args.now ?? new Date()

  for (const r of args.renditions) {
    const where = `${r.platform}/${r.format}`
    if (!r.external_post_id) {
      out.reported.push({ slug: r.asset_slug, platform: where, why: 'no external_post_id, so there is nothing to ask about' })
      continue
    }
    const lookup = await args.read(r.external_post_id)
    const v = classify(r, lookup, now)

    if (v.kind === 'pending') { out.pending += 1; continue }
    if (v.kind === 'report') { out.reported.push({ slug: r.asset_slug, platform: where, why: v.why }); continue }
    if (v.kind === 'refuse') { out.refused.push({ slug: r.asset_slug, platform: where, why: v.why }); continue }

    if (args.dryRun) {
      out.written.push({ slug: r.asset_slug, platform: where, publishedAt: v.publishedAt, url: v.url, note: v.note })
      continue
    }
    try {
      await args.write(r.id, { published_at: v.publishedAt, external_url: v.url })
      out.written.push({ slug: r.asset_slug, platform: where, publishedAt: v.publishedAt, url: v.url, note: v.note })
    } catch (e) {
      // The post is live and our store still says otherwise. That is the drift this system
      // exists to end, so it is a FAILURE with the facts in the message, not a warning.
      out.failed.push({
        slug: r.asset_slug, platform: where,
        why: `post ${r.external_post_id} IS PUBLISHED at ${v.url ?? '(no url)'} BUT THE WRITE-BACK FAILED: ${(e as Error).message}. The rendition still reads "scheduled" and I4 will stay red until it is corrected.`,
      })
    }
  }
  return out
}

export async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const startedAt = new Date().toISOString()

  const env = process.env
  const missing = ['METRICOOL_USER_TOKEN', 'METRICOOL_USER_ID', 'METRICOOL_BLOG_ID'].filter((k) => !env[k]?.trim())
  if (missing.length) {
    console.error(`metricool-writeback: missing credential(s): ${missing.join(', ')}. Refusing to run.`)
    return 1
  }

  const renditions = await loadPending()
  const result = await runWriteback({
    renditions,
    read: metricoolReader({
      blogId: env.METRICOOL_BLOG_ID ?? '', userId: env.METRICOOL_USER_ID ?? '', token: env.METRICOOL_USER_TOKEN ?? '',
    }),
    write: writeBackLive,
    dryRun,
  })

  console.log(render(result, { dryRun }))
  const code = exitCodeFor(result)
  if (doLog && !dryRun) {
    await logRun({
      agent: AGENT,
      status: code === 0 ? 'ok' : code === 2 ? 'error' : 'blocked',
      detail: { exit_code: code, written: result.written, refused: result.refused, reported: result.reported, pending: result.pending, failed: result.failed },
      startedAt,
    })
  }
  return code
}

/**
 * Exact basename, never a suffix match — `test-metricool-writeback.ts` ends with
 * `metricool-writeback.ts`, and that exact collision made `signoff-sync` write four live clinical
 * signatures from its own test suite on 2026-08-04.
 */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = argv1.split(/[\\/]/).pop() ?? ''
  return base === 'metricool-writeback.ts' || base === 'metricool-writeback.js'
}

/**
 * `process.exitCode` and a natural exit, NOT `process.exit(code)`.
 *
 * Forcing the exit here crashes on Windows with a libuv assertion
 * (`!(handle->flags & UV_HANDLE_CLOSING)`, async.c:76) and returns -1073740791 instead of the
 * intended code, reproducibly, on every run. `metricool-schedule.ts` does force it and has the
 * same crash; `content-doctor-cron.ts` exits cleanly. Since Task Scheduler's "Last Run Result"
 * is the documented signal for these jobs, an exit code replaced by a crash code would turn a
 * clean run into what looks like a failure, and every alarm here would be noise.
 */
if (isDirectInvocation(process.argv[1])) {
  main()
    .then((code) => { process.exitCode = code })
    .catch((e) => {
      console.error('METRICOOL-WRITEBACK ERROR:', (e as Error).message)
      process.exitCode = 1
    })
}
