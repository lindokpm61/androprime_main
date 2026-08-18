/**
 * remap-metricool-ids — re-attach our renditions to the Metricool posts that actually exist.
 *
 * WHY IT EXISTS. Arming a draft in Metricool does not update a post, it REPLACES it: the old post
 * is deleted and a new one is minted with a new id. Every id we stored at scheduling time therefore
 * dies the moment that batch is armed, and everything that keys on the id breaks silently in the
 * same instant — doctor I3 (does the id still resolve), `metricool-writeback` (which joins on it to
 * record what published), and `metricool-metrics` (which joins analytics through it).
 *
 * This has been hand-written as a throwaway three times. It is a script now because the cause is
 * structural: it will happen again on the next arming pass, and the pass after that.
 *
 * THE MATCH IS BY SLOT, AND THAT IS THE WHOLE DESIGN DECISION. The id is exactly the thing that is
 * unreliable, so it cannot also be the key. What survives an arming is the SLOT: the network plus
 * the publication instant, which is what a human set and what neither side rewrites. One post per
 * network per instant is a rule the calendar already enforces.
 *
 * 🔴 IT REFUSES AMBIGUITY RATHER THAN GUESSING. Two live posts in one slot on one network is not a
 * remap this script is entitled to make: the whole point is that our id is untrustworthy, so there
 * is nothing left to break the tie with. It reports and changes nothing. A wrong remap is worse
 * than a dead id, because a dead id announces itself and a wrong one reads as healthy while
 * attributing one post's numbers to another post's asset.
 *
 * ⚠️ IT ONLY FIXES THE ID. It deliberately does NOT write `external_url`, `status` or publication
 * evidence, even when the live post is plainly published. That is `metricool-writeback`'s job and
 * it already does it well; duplicating it here would give two writers one column. The intended
 * sequence is: remap, then writeback, then the doctor.
 *
 * Usage:
 *   npx tsx scripts/content-engine/remap-metricool-ids.ts            # dry run, writes nothing
 *   npx tsx scripts/content-engine/remap-metricool-ids.ts --apply    # writes external_post_id only
 *   ... --from 2026-08-17 --to 2026-09-16   # window, defaults to the next 45 days from today
 */

import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { loadEnvLocal } from './_shared'
import { NETWORK, creds } from './metricool-schedule'
import { utcFromWallClock } from './metricool-writeback'

export const AGENT = 'remap-metricool-ids'

/** A rendition as this job needs it: what we think the id is, and which slot it belongs to. */
export interface Rendition {
  id: string
  slug: string
  platform: string
  status: string
  external_post_id: string
  /** UTC ISO instant. */
  scheduled_for: string
}

/** A live Metricool post, reduced to the three facts a slot match needs. */
export interface LivePost {
  id: string
  network: string
  /** UTC ISO instant, derived from Metricool's wall clock plus its zone. */
  instant: string
  publishedUrl: string | null
  providerStatus: string | null
}

export type Verdict =
  | { kind: 'ok'; r: Rendition }
  | { kind: 'remap'; r: Rendition; to: LivePost }
  | { kind: 'missing'; r: Rendition; why: string }
  | { kind: 'ambiguous'; r: Rendition; why: string }

/**
 * Decide what one rendition's slot means. Pure, so every branch is testable with no network.
 *
 * `ok` and `remap` are both healthy outcomes. `missing` is a finding rather than a failure: a slot
 * with no live post is what a deleted or never-armed post looks like, and this job is not entitled
 * to invent one.
 */
export function classify(r: Rendition, live: LivePost[]): Verdict {
  const network = NETWORK[r.platform]
  if (!network) return { kind: 'missing', r, why: `no Metricool network mapping for platform "${r.platform}"` }

  const inSlot = live.filter((p) => p.network === network && p.instant === r.scheduled_for)

  if (inSlot.length === 0) {
    return { kind: 'missing', r, why: `Metricool has no ${network} post at ${r.scheduled_for}` }
  }
  if (inSlot.length > 1) {
    return {
      kind: 'ambiguous', r,
      why: `${inSlot.length} ${network} posts share the slot ${r.scheduled_for} (${inSlot.map((p) => p.id).join(', ')}); the stored id cannot break the tie because the stored id is what is in doubt`,
    }
  }

  const only = inSlot[0]
  return only.id === r.external_post_id ? { kind: 'ok', r } : { kind: 'remap', r, to: only }
}

// ── Metricool I/O ───────────────────────────────────────────────────────────

/**
 * Metricool's list endpoint wants a LOCAL wall clock as `yyyy-MM-dd'T'HH:mm:ss`, with no offset and
 * no zone suffix. Verified against the live API on 2026-08-18, which rejects the compact
 * `20260817000000` form with an explicit ValidationError naming the format it wants.
 *
 * 🔴 A WRONG PARAMETER NAME IS NOT AN ERROR HERE. Sending `from`/`to` instead of `start`/`end`
 * returns HTTP 200 with `{"data":[]}`, which is indistinguishable from a brand that genuinely has
 * no posts in the window. The same trap `metricool-metrics` records for the wrong brand. That is
 * why the caller treats an empty list as a finding to report rather than as a clean run.
 */
export function stamp(day: string, endOfDay = false): string {
  return `${day}T${endOfDay ? '23:59:59' : '00:00:00'}`
}

export type Lister = (blogId: string, from: string, to: string) => Promise<LivePost[]>

export function metricoolLister(
  c: { userId: string; token: string },
  fetchImpl: typeof fetch = fetch,
): Lister {
  return async (blogId, from, to) => {
    const q = new URLSearchParams({
      blogId, userId: c.userId, userToken: c.token,
      start: stamp(from), end: stamp(to, true),
    })
    const res = await fetchImpl(`https://app.metricool.com/api/v2/scheduler/posts?${q}`, {
      headers: { 'X-Mc-Auth': c.token },
    })
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Metricool answered HTTP ${res.status} listing posts for brand ${blogId}`)
    }
    const parsed = JSON.parse(await res.text()) as { data?: RawPost[] }
    return (parsed.data ?? []).flatMap(toLive)
  }
}

interface RawPost {
  id?: number | string
  publicationDate?: { dateTime?: string; timezone?: string }
  providers?: { network?: string; status?: string; publicUrl?: string }[]
}

/**
 * One Metricool post becomes one LivePost PER NETWORK, because a single scheduled post can carry
 * several providers and each is a separate slot from our side: our renditions are one row per
 * platform.
 */
export function toLive(p: RawPost): LivePost[] {
  const wall = p.publicationDate?.dateTime
  const zone = p.publicationDate?.timezone ?? 'Europe/London'
  const instant = wall ? utcFromWallClock(wall, zone) : null
  if (!instant || p.id === undefined || p.id === null) return []
  return (p.providers ?? [])
    .filter((pr) => pr.network)
    .map((pr) => ({
      id: String(p.id),
      network: pr.network as string,
      instant,
      publishedUrl: pr.publicUrl ?? null,
      providerStatus: pr.status ?? null,
    }))
}

// ── Database I/O ────────────────────────────────────────────────────────────

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function loadRenditions(from: string, to: string): Promise<Rendition[]> {
  const { data, error } = await db()
    .from('content_renditions')
    .select('id, platform, status, external_post_id, scheduled_for, content_assets!inner(slug)')
    .not('external_post_id', 'is', null)
    .gte('scheduled_for', `${from}T00:00:00Z`)
    .lte('scheduled_for', `${to}T23:59:59Z`)
    .order('scheduled_for')
  if (error) throw new Error(`could not read renditions: ${error.message}`)
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: String(r.id),
    slug: String((r.content_assets as { slug: string }).slug),
    platform: String(r.platform),
    status: String(r.status),
    external_post_id: String(r.external_post_id),
    scheduled_for: new Date(String(r.scheduled_for)).toISOString(),
  }))
}

export type Writer = (renditionId: string, newId: string) => Promise<void>

export const writeLive: Writer = async (renditionId, newId) => {
  const { error } = await db()
    .from('content_renditions')
    .update({ external_post_id: newId })
    .eq('id', renditionId)
  if (error) throw new Error(error.message)
}

// ── Run ─────────────────────────────────────────────────────────────────────

export interface RunResult {
  ok: number
  remapped: { slug: string; platform: string; from: string; to: string; slot: string }[]
  missing: { slug: string; platform: string; why: string }[]
  ambiguous: { slug: string; platform: string; why: string }[]
  failed: { slug: string; platform: string; why: string }[]
}

export function exitCodeFor(r: RunResult): 0 | 2 | 3 {
  if (r.failed.length) return 2
  if (r.ambiguous.length) return 3
  return 0
}

export async function runRemap(args: {
  renditions: Rendition[]
  live: LivePost[]
  write: Writer
  dryRun: boolean
}): Promise<RunResult> {
  const out: RunResult = { ok: 0, remapped: [], missing: [], ambiguous: [], failed: [] }

  for (const r of args.renditions) {
    const v = classify(r, args.live)
    if (v.kind === 'ok') { out.ok += 1; continue }
    if (v.kind === 'missing') { out.missing.push({ slug: r.slug, platform: r.platform, why: v.why }); continue }
    if (v.kind === 'ambiguous') { out.ambiguous.push({ slug: r.slug, platform: r.platform, why: v.why }); continue }

    if (!args.dryRun) {
      try {
        await args.write(r.id, v.to.id)
      } catch (e) {
        out.failed.push({ slug: r.slug, platform: r.platform, why: (e as Error).message })
        continue
      }
    }
    out.remapped.push({
      slug: r.slug, platform: r.platform,
      from: r.external_post_id, to: v.to.id, slot: r.scheduled_for,
    })
  }
  return out
}

export function render(r: RunResult, opts: { dryRun: boolean }): string {
  const L: string[] = []
  L.push(`${AGENT} — match by SLOT, never by the id we are trying to fix${opts.dryRun ? ' (DRY RUN, nothing written)' : ''}`)
  L.push('')
  L.push(`  ${r.ok} already correct, ${r.remapped.length} re-mapped, ${r.missing.length} with no live post, ${r.ambiguous.length} ambiguous`)
  if (r.remapped.length) {
    L.push('')
    L.push(opts.dryRun ? '  WOULD RE-MAP:' : '  RE-MAPPED:')
    for (const x of r.remapped) L.push(`   · ${x.slug}  ${x.platform}  ${x.from} → ${x.to}   slot ${x.slot}`)
  }
  for (const x of r.missing) L.push(`   ⚠ ${x.slug}  ${x.platform}: ${x.why}`)
  for (const x of r.ambiguous) L.push(`   🔴 REFUSED  ${x.slug}  ${x.platform}: ${x.why}`)
  for (const x of r.failed) L.push(`   🔴 FAILED  ${x.slug}  ${x.platform}: ${x.why}`)
  L.push('')
  L.push('  This job fixes the id and nothing else. Run metricool-writeback next to pick up URLs and')
  L.push('  publication evidence through the repaired ids, then content-doctor to confirm I3.')
  return L.join('\n')
}

/**
 * 🔴 A SUFFIX MATCH IS WRONG HERE, and it fired on the first test run: `test-remap-metricool-ids.ts`
 * ENDS WITH `remap-metricool-ids.ts`, so a `/…\.ts$/` regex made importing the module from its own
 * test suite execute `main()` against the live API and the production database. The rest of this
 * directory already uses basename equality, which is immune; this file was the only one that did
 * not, and it now matches them.
 */
export function isDirectInvocation(argv1: string | undefined): boolean {
  if (!argv1) return false
  const base = path.basename(argv1)
  return base === 'remap-metricool-ids.ts' || base === 'remap-metricool-ids.js'
}

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

export async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = !process.argv.includes('--apply')
  const today = new Date()
  const plus = new Date(today.getTime() + 45 * 864e5)
  const from = arg('from', today.toISOString().slice(0, 10))
  const to = arg('to', plus.toISOString().slice(0, 10))

  const c = creds()
  if (!c.ok) { console.error(`${AGENT}: missing ${c.missing.join(', ')}`); return 2 }

  const brands = (process.env.METRICOOL_BLOG_IDS?.trim() || '6633045,6693691').split(',').map((s) => s.trim()).filter(Boolean)
  const lister = metricoolLister(c)

  const live: LivePost[] = []
  for (const b of brands) live.push(...await lister(b, from, to))

  const renditions = await loadRenditions(from, to)
  const result = await runRemap({ renditions, live, write: writeLive, dryRun })
  console.log(render(result, { dryRun }))
  return exitCodeFor(result)
}

if (isDirectInvocation(process.argv[1])) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(2) })
}
