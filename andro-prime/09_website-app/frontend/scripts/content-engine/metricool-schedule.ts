/**
 * metricool-schedule — push approved renditions to Metricool as DRAFTS, then reconcile.
 *
 * This is the "approval to Metricool scheduling" job from
 * `06_marketing/content-machine/content-pipeline-automation-plan.md` §5 Phase 2. It exists
 * because on 2026-08-05 nothing in this repo could schedule a post: `createScheduledPost`
 * appeared nowhere, Metricool was read-only here (the doctor's I3 probe), and every post on
 * the week of 2026-08-03 had been hand-loaded on 2026-07-31. The week's four approved assets
 * sat unscheduled while their slots passed.
 *
 * WHAT IT DOES NOT DO, DELIBERATELY.
 *
 * 1. It does not choose a slot. `scheduled_for` must already be set; a rendition without one
 *    is REFUSED and named. Picking when a post goes out is an editorial judgement, and the
 *    plan's governing rule is "automate the plumbing, never automate a gate."
 *
 * 2. It does not read post copy out of the asset markdown. The copy comes from
 *    `content_renditions.body`, and a rendition without one is REFUSED. This was measured
 *    rather than assumed: across the 17 asset files the postable copy has at least three
 *    different shapes (a `POST` line then a blockquote; a bare blockquote with no `POST` line,
 *    which is how three real published posts are written; and none at all for video scripts,
 *    which are shot lists rather than copy). Any parser over that set is a heuristic, and the
 *    failure mode of a wrong guess here is publishing the wrong words to a live public account.
 *    `content_renditions.body` is already the record of what actually shipped on all nine
 *    renditions that have ever shipped, so this reads the store that already means that.
 *
 * 3. It does not flip a post live. Posts are created with `draft: true` — the standing
 *    decision of 2026-07-31 (plan §7.1), recorded as a decision rather than a probation
 *    period, so relaxing it later is a fresh decision and not a default quietly expiring.
 *
 * WHAT MAKES A BAD RUN RECOVERABLE: every post it creates is a draft, and every refusal is
 * printed with the rendition named and the reason stated. It never writes a plausible
 * substitute for something it could not determine.
 */
import path from 'path'
import fs from 'fs'
import { loadEnvLocal, admin, logRun, repoRoot } from './_shared'

export const AGENT = 'metricool-schedule'

// ── Types

export interface SchedulableRendition {
  id: string
  asset_id: string
  asset_slug: string
  asset_status: string
  platform: string
  format: string
  body: string | null
  first_comment: string | null
  status: string
  scheduled_for: string | null
  external_post_id: string | null
  publisher: string | null
  canonical_article_slug: string | null
}

export type Verdict =
  | { kind: 'send'; rendition: SchedulableRendition }
  | { kind: 'skip'; rendition: SchedulableRendition; why: string }
  | { kind: 'refuse'; rendition: SchedulableRendition; why: string }

/**
 * Our platform vocabulary is not Metricool's. `x` is `twitter` on their side, and the
 * mapping is explicit rather than a lowercase-and-hope, so a platform we have never
 * pushed through Metricool is REFUSED by name instead of being sent under a guessed
 * network string that their API would accept and mis-route.
 */
export const NETWORK: Record<string, string> = {
  linkedin: 'linkedin',
  facebook: 'facebook',
  x: 'twitter',
  instagram: 'instagram',
  threads: 'threads',
  bluesky: 'bluesky',
}

/**
 * Platforms where we attach the canonical article's own photograph.
 *
 * Facebook only, and that is Keith's ruling of 2026-08-05: a written post needs no bespoke
 * thumbnail, and its image is the associated blog article's photo used as published. The
 * LinkedIn text-posts deliberately ship without media — both posts published to date did,
 * and adding an image to them is a content decision nobody has made.
 */
export const MEDIA_PLATFORMS = new Set(['facebook'])

// ── Eligibility. Pure, so every branch is testable without a network or a database.

/**
 * Decide one rendition's fate. Three outcomes, never two: `skip` means "correctly not our
 * business today" and `refuse` means "this one is owed and cannot proceed", and collapsing
 * them would either hide real blockers among routine skips or alarm on every already-scheduled
 * row forever. The doctor learned this the same way (PASS / FAIL / UNCHECKED, never a binary).
 */
export function classify(r: SchedulableRendition, now: Date = new Date()): Verdict {
  if (r.external_post_id?.trim()) {
    return { kind: 'skip', rendition: r, why: `already carries external_post_id ${r.external_post_id}` }
  }
  if (['scheduled', 'published', 'measured'].includes(r.status)) {
    return { kind: 'skip', rendition: r, why: `status is "${r.status}" but no external_post_id: that is drift for the doctor (I3/I8), not work for this job` }
  }
  if (!['approved', 'done'].includes(r.asset_status)) {
    return { kind: 'skip', rendition: r, why: `asset "${r.asset_slug}" is at status "${r.asset_status}", so it has not been approved yet` }
  }

  // Past this point the asset IS approved, so anything still standing in the way is owed.
  if (!NETWORK[r.platform]) {
    return { kind: 'refuse', rendition: r, why: `platform "${r.platform}" has no Metricool network mapping. Publish it by its own route, or add the mapping deliberately.` }
  }
  if (r.publisher && r.publisher !== 'metricool') {
    return { kind: 'refuse', rendition: r, why: `publisher is "${r.publisher}", not metricool. This job must not take over a rendition routed elsewhere.` }
  }
  if (!r.body?.trim()) {
    return { kind: 'refuse', rendition: r, why: 'content_renditions.body is empty. The copy that ships is read from that column and is never guessed from the asset markdown.' }
  }
  if (!r.scheduled_for) {
    return { kind: 'refuse', rendition: r, why: 'scheduled_for is not set. Choosing the slot is an editorial decision this job deliberately does not make.' }
  }
  const when = new Date(r.scheduled_for)
  if (Number.isNaN(when.getTime())) {
    return { kind: 'refuse', rendition: r, why: `scheduled_for "${r.scheduled_for}" is not a readable timestamp` }
  }
  if (when.getTime() <= now.getTime()) {
    return { kind: 'refuse', rendition: r, why: `scheduled_for ${r.scheduled_for} has already passed. Re-slot it rather than posting into the past.` }
  }
  return { kind: 'send', rendition: r }
}

// ── Media: the canonical article's own photograph, read from STRUCTURED frontmatter.

/**
 * Pull `photoSrc` (a real photograph) or `imgSrc` (the article's card, where it has no
 * photograph) out of a blog MDX file's frontmatter, plus its alt text.
 *
 * This parses YAML frontmatter keys, NOT prose, which is the whole reason it is allowed to
 * exist while §2 above refuses to parse the post body. A frontmatter key is a declared field
 * with one meaning; a blockquote in a markdown body is whatever the author felt like that day.
 * Returns null rather than throwing: a missing image is a post without media, not a failure.
 */
export function articleImage(mdx: string): { url: string; alt: string } | null {
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(mdx)
  if (!fm) return null
  const block = fm[1]

  const scalar = (key: string): string | null => {
    // Either `key: value` on one line, or a YAML folded/literal block (`>-`, `|`) whose
    // value is the indented lines beneath it. Both forms are live in this repo.
    //
    // The block indicator is detected AFTER capturing and trimming, never by a lookahead
    // wedged between `:` and the value. The lookahead version was written first and was
    // wrong in a way the test caught: `[ \t]*` backtracks to match zero spaces, which slides
    // the lookahead onto the space instead of the `>` and lets it succeed, so `photoSrc: >-`
    // returned the literal string `>-` as the image URL. A guard a quantifier can step around
    // is not a guard.
    const line = new RegExp(`^${key}:[ \\t]*(.*)$`, 'm').exec(block)
    if (line) {
      const v = line[1].trim()
      if (v && !/^[>|]/.test(v)) return v.replace(/^['"]|['"]$/g, '')
    }
    const folded = new RegExp(`^${key}:[ \\t]*[>|]-?[ \\t]*\\r?\\n((?:[ \\t]+\\S.*\\r?\\n?)+)`, 'm').exec(block)
    if (!folded) return null
    // A folded scalar joins its lines; these are URLs, so join with nothing and strip
    // indentation. No "does this look like another key" filter: the capture only takes
    // INDENTED lines, so the next key (which is not indented) already ends it, and a
    // key-shaped test throws away the value itself, because `https://...` starts `https:`.
    return folded[1].split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join('')
  }

  const url = scalar('photoSrc') ?? scalar('imgSrc')
  if (!url) return null
  const alt = scalar('photoAlt') ?? scalar('imgAlt') ?? ''
  return { url: url.startsWith('/') ? `https://andro-prime.com${url}` : url, alt }
}

/** Locate and read the canonical article's MDX, or null if there is none. */
export function readArticleImage(articleSlug: string | null, root: string): { url: string; alt: string } | null {
  if (!articleSlug) return null
  const p = path.join(root, 'andro-prime', '09_website-app', 'frontend', 'content', 'blog', `${articleSlug}.mdx`)
  if (!fs.existsSync(p)) return null
  return articleImage(fs.readFileSync(p, 'utf-8'))
}

// ── Payload

export interface MetricoolPayload {
  text: string
  firstCommentText: string
  providers: { network: string }[]
  publicationDate: { dateTime: string; timezone: string }
  autoPublish: boolean
  draft: boolean
  shortener: boolean
  hasNotReadNotes: boolean
  media: string[]
  mediaAltText: string[]
  smartLinkData: { ids: string[] }
  descendants: unknown[]
  [k: string]: unknown
}

/** Metricool wants a local wall-clock string plus an IANA zone, never an offset. */
export function wallClock(iso: string, timeZone = 'Europe/London'): string {
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(d).reduce<Record<string, string>>((a, p) => (a[p.type] = p.value, a), {})
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}`
}

export function buildPayload(
  r: SchedulableRendition,
  image: { url: string; alt: string } | null,
  timeZone = 'Europe/London',
): MetricoolPayload {
  const network = NETWORK[r.platform]
  const useMedia = MEDIA_PLATFORMS.has(r.platform) && image !== null
  const payload: MetricoolPayload = {
    text: r.body ?? '',
    firstCommentText: r.first_comment ?? '',
    providers: [{ network }],
    publicationDate: { dateTime: wallClock(r.scheduled_for ?? '', timeZone), timezone: timeZone },
    autoPublish: true,
    // The standing decision (plan §7.1, Keith 2026-07-31). Changing this is a decision, not a flag.
    draft: true,
    shortener: false,
    hasNotReadNotes: false,
    media: useMedia && image ? [image.url] : [],
    mediaAltText: useMedia && image ? [image.alt] : [],
    smartLinkData: { ids: [] },
    descendants: [],
  }
  // Only the network actually being posted to gets its networkData block, per the API contract.
  if (network === 'linkedin') payload.linkedinData = { previewIncluded: false, type: 'post' }
  if (network === 'facebook') payload.facebookData = { type: 'POST' }
  if (network === 'twitter') payload.twitterData = { tags: [] }
  if (network === 'instagram') payload.instagramData = { type: 'POST' }
  return payload
}

// ── Metricool I/O

export const METRICOOL_VARS = ['METRICOOL_USER_TOKEN', 'METRICOOL_USER_ID', 'METRICOOL_BLOG_ID'] as const

export function creds(env: Record<string, string | undefined> = process.env) {
  const missing = METRICOOL_VARS.filter((k) => !env[k]?.trim())
  return {
    ok: missing.length === 0, missing: [...missing],
    token: env.METRICOOL_USER_TOKEN ?? '', userId: env.METRICOOL_USER_ID ?? '', blogId: env.METRICOOL_BLOG_ID ?? '',
  }
}

export type Creator = (p: MetricoolPayload) => Promise<{ ok: true; id: string } | { ok: false; why: string }>

export function metricoolCreator(c: ReturnType<typeof creds>, fetchImpl: typeof fetch = fetch): Creator {
  const q = `blogId=${encodeURIComponent(c.blogId)}&userId=${encodeURIComponent(c.userId)}&userToken=${encodeURIComponent(c.token)}`
  return async (p) => {
    try {
      const res = await fetchImpl(`https://app.metricool.com/api/v2/scheduler/posts?${q}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Mc-Auth': c.token },
        body: JSON.stringify(p),
      })
      const text = await res.text()
      if (res.status < 200 || res.status >= 300) return { ok: false, why: `Metricool answered HTTP ${res.status}: ${text.slice(0, 300)}` }
      let id: unknown
      try { id = (JSON.parse(text) as { data?: { id?: unknown } })?.data?.id } catch { /* fall through */ }
      if (id === undefined || id === null || `${id}`.trim() === '') {
        // A 2xx whose id we cannot read is the worst case: the post may well exist. Say so
        // rather than reporting success (which would strand an untracked post) or failure
        // (which would invite a duplicate on the next run).
        return { ok: false, why: `Metricool answered ${res.status} but no post id could be read from the response. CHECK THE CALENDAR BY HAND before re-running, a post may already exist. Body: ${text.slice(0, 300)}` }
      }
      return { ok: true, id: `${id}` }
    } catch (e) {
      return { ok: false, why: `Metricool request failed: ${(e as Error).message}` }
    }
  }
}

// ── Reporting

export interface RunResult {
  sent: { slug: string; platform: string; id: string; when: string }[]
  failed: { slug: string; platform: string; why: string }[]
  refused: { slug: string; platform: string; why: string }[]
  skipped: number
}

export function exitCodeFor(r: RunResult): 0 | 2 | 3 {
  if (r.failed.length) return 2
  if (r.refused.length) return 3
  return 0
}

export function render(r: RunResult, opts: { dryRun: boolean }): string {
  const L: string[] = []
  L.push(`metricool-schedule${opts.dryRun ? ' (DRY RUN — nothing was sent)' : ''}`)
  L.push('─'.repeat(72))
  for (const s of r.sent) L.push(`  ${opts.dryRun ? 'WOULD SEND' : 'SENT     '}  ${s.slug}  ${s.platform}  ${s.when}${s.id ? `  id=${s.id}` : ''}`)
  for (const f of r.failed) L.push(`  FAILED     ${f.slug}  ${f.platform}\n               ${f.why}`)
  for (const f of r.refused) L.push(`  REFUSED    ${f.slug}  ${f.platform}\n               ${f.why}`)
  L.push('')
  L.push(`  ${r.sent.length} sent, ${r.failed.length} failed, ${r.refused.length} refused, ${r.skipped} skipped (nothing owed).`)
  if (r.refused.length) L.push('  A REFUSAL IS WORK OWED, not an error: each one names what a person must supply.')
  if (!r.sent.length && !r.failed.length && !r.refused.length) L.push('  Nothing was eligible. That is a clean run, not a silent one.')
  return L.join('\n')
}

// ── Main

export async function loadRenditions(): Promise<SchedulableRendition[]> {
  const { data, error } = await admin()
    .from('content_renditions')
    .select('id, asset_id, platform, format, body, first_comment, status, scheduled_for, external_post_id, publisher, content_assets!inner(slug, status, canonical_article_id, blog_articles(slug))')
  if (error) throw new Error(`content_renditions read failed: ${error.message}`)
  return (data ?? []).map((row) => {
    const a = (row as unknown as { content_assets: { slug: string; status: string; blog_articles: { slug: string } | null } }).content_assets
    return {
      id: (row as { id: string }).id,
      asset_id: (row as { asset_id: string }).asset_id,
      asset_slug: a?.slug ?? '(unknown)',
      asset_status: a?.status ?? '(unknown)',
      platform: (row as { platform: string }).platform,
      format: (row as { format: string }).format,
      body: (row as { body: string | null }).body,
      first_comment: (row as { first_comment: string | null }).first_comment,
      status: (row as { status: string }).status,
      scheduled_for: (row as { scheduled_for: string | null }).scheduled_for,
      external_post_id: (row as { external_post_id: string | null }).external_post_id,
      publisher: (row as { publisher: string | null }).publisher,
      canonical_article_slug: a?.blog_articles?.slug ?? null,
    }
  })
}

export async function runSchedule(args: {
  renditions: SchedulableRendition[]
  create: Creator
  root: string
  dryRun: boolean
  now?: Date
  writeBack?: (id: string, postId: string, scheduledFor: string) => Promise<void>
}): Promise<RunResult> {
  const out: RunResult = { sent: [], failed: [], refused: [], skipped: 0 }
  for (const r of args.renditions) {
    const v = classify(r, args.now ?? new Date())
    if (v.kind === 'skip') { out.skipped++; continue }
    if (v.kind === 'refuse') { out.refused.push({ slug: r.asset_slug, platform: `${r.platform}/${r.format}`, why: v.why }); continue }

    const image = MEDIA_PLATFORMS.has(r.platform) ? readArticleImage(r.canonical_article_slug, args.root) : null
    const payload = buildPayload(r, image)
    if (args.dryRun) {
      out.sent.push({ slug: r.asset_slug, platform: `${r.platform}/${r.format}`, id: '', when: payload.publicationDate.dateTime })
      continue
    }
    const res = await args.create(payload)
    if (!res.ok) { out.failed.push({ slug: r.asset_slug, platform: `${r.platform}/${r.format}`, why: res.why }); continue }
    try {
      await args.writeBack?.(r.id, res.id, r.scheduled_for ?? '')
    } catch (e) {
      // The post exists and our store does not know. That is exactly the drift this whole
      // system was built to stop, so it is a FAILURE with the id in the message, not a warning.
      out.failed.push({
        slug: r.asset_slug, platform: `${r.platform}/${r.format}`,
        why: `POST CREATED IN METRICOOL AS id=${res.id} BUT THE WRITE-BACK FAILED: ${(e as Error).message}. Set external_post_id by hand before re-running or you will duplicate it.`,
      })
      continue
    }
    out.sent.push({ slug: r.asset_slug, platform: `${r.platform}/${r.format}`, id: res.id, when: payload.publicationDate.dateTime })
  }
  return out
}

async function writeBackLive(id: string, postId: string, _scheduledFor: string): Promise<void> {
  const { error } = await admin()
    .from('content_renditions')
    .update({ status: 'scheduled', external_post_id: postId, publisher: 'metricool' })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const startedAt = new Date().toISOString()

  const root = repoRoot()
  if (!root) { console.error('metricool-schedule: no repo root found from cwd. Refusing to run.'); return 1 }

  const c = creds()
  if (!c.ok && !dryRun) {
    console.error(`metricool-schedule: missing credential(s): ${c.missing.join(', ')}. Refusing to run.`)
    return 1
  }

  const renditions = await loadRenditions()
  const result = await runSchedule({
    renditions, root, dryRun,
    create: metricoolCreator(c),
    writeBack: writeBackLive,
  })

  console.log(render(result, { dryRun }))
  const code = exitCodeFor(result)
  if (doLog && !dryRun) {
    await logRun({
      agent: AGENT,
      status: code === 0 ? 'ok' : code === 2 ? 'error' : 'blocked',
      detail: { exit_code: code, sent: result.sent, failed: result.failed, refused: result.refused, skipped: result.skipped },
      startedAt,
    })
  }
  return code
}

/**
 * Exact basename, never a suffix match — `test-metricool-schedule.ts` ends with
 * `metricool-schedule.ts`, and that exact collision made `signoff-sync` write four live
 * clinical signatures from its own test suite on 2026-08-04. This job posts to a public
 * social account, so the same mistake here is a published post nobody asked for.
 */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'metricool-schedule.ts' || base === 'metricool-schedule.js'
}

if (isDirectInvocation(process.argv[1])) {
  main().then((code) => process.exit(code)).catch((e) => {
    console.error('METRICOOL-SCHEDULE ERROR:', (e as Error).message)
    process.exit(1)
  })
}
