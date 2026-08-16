/**
 * register-x-batch — turn a week's X batch draft into content_assets + content_renditions rows.
 *
 * THE GAP THIS CLOSES. The single-asset path has a tool for every hand-off: `/script` writes the
 * asset file and its rows, and `bridge-post-body.ts` moves the copy into `content_renditions.body`.
 * The X path has no per-post asset file at all — a week is ONE draft holding seven posts
 * (`x-channel-plan.md` §6) — so `bridge-post-body` cannot read it and nothing else ever could.
 * On 2026-08-16 week 2 was registered by a throwaway script written for that one run, which is
 * exactly the state `register-carousel-run.ts` exists to prevent on the carousel lane.
 *
 * WHY IT PARSES RATHER THAN TAKING ARGUMENTS. The copy is pre-flighted at its exact wording. Every
 * byte that ships is read out of the blockquotes in the draft, never re-typed and never passed on a
 * command line, for the same reason `bridge-post-body.ts` extracts rather than re-keys: re-typing
 * approved copy is how a cleared claim quietly stops being one.
 *
 * WHAT IT REFUSES, AND WHY EACH ONE IS A REFUSAL RATHER THAN A WARNING.
 *
 * 1. A post over 280 characters. X's hard ceiling; Metricool will not split a longer message, so
 *    this surfaces at scheduling or at posting time instead. Week 2's first draft had a thread post
 *    at 286 and nothing in the drafting path could see it.
 * 2. A `characters` claim that disagrees with the measured length. The format asks the author to
 *    write down a number a machine can compute, so it gets estimated; all seven were wrong on the
 *    first pass. A field that asserts a measurable fact and is never measured reads as verified.
 * 3. A post with no `slug:`. The slug is the only join between this file and the database.
 * 4. A post with no `slot:`. Choosing when a post goes out is editorial, the same rule
 *    `metricool-schedule.ts` holds. `slot: by-hand` is the explicit way to say a post is not the
 *    scheduler's, and it registers `publisher='manual'` so the scheduler refuses it BY NAME rather
 *    than a reader having to remember the rule (X threads: Metricool cannot split them).
 * 5. A canonical article that is missing or unpublished. A derivative inherits its sign-off from a
 *    published article; without one the approval gate has nothing to stand on.
 * 6. A draft whose frontmatter does not carry `preflight: green`. This tool does not approve
 *    anything, it records a verdict something else reached.
 *
 * WHAT MAKES A BAD RUN RECOVERABLE: `--dry-run` prints every insert and update it would make and
 * writes nothing. Re-running is idempotent — rows are upserted on their natural keys — so a
 * correction to the draft is re-applied by running it again rather than by hand-editing the
 * database.
 *
 * WHAT IT DOES NOT DO: it does not schedule. `metricool-schedule.ts` owns that, reads what this
 * writes, and creates drafts a human arms. It does not approve: `approved_by` comes from the
 * draft's own frontmatter, which a human filled in.
 */
import fs from 'fs'
import path from 'path'
import { loadEnvLocal, admin, logRun, repoRoot } from './_shared'

export const AGENT = 'register-x-batch'
export const X_LIMIT = 280

// ── Parsing. Pure, so every refusal is testable without a database.

export interface BatchPost {
  slug: string
  title: string
  /** `YYYY-MM-DDTHH:mm` London wall clock, or null when the post is by hand. */
  slotLocal: string | null
  byHand: boolean
  body: string
  firstComment: string | null
  claimedChars: number | null
  measuredChars: number
  section: string
  line: number
}

export interface BatchDraft {
  frontmatter: Record<string, string>
  posts: BatchPost[]
  /**
   * Sections that carry copy but no `slug:`. They MUST be surfaced separately: a post is only
   * collected once its slug is seen, so without this a batch of seven with one missing slug
   * registers six and says nothing at all about the seventh. Six of seven looks like success.
   */
  orphanSections: { section: string; line: number }[]
}

/** Minimal flat YAML read. The batch frontmatter is flat by format; anything nested is ignored. */
export function parseFrontmatter(text: string): Record<string, string> {
  const m = /^---\n([\s\S]*?)\n---/.exec(text.replace(/\r\n/g, '\n'))
  if (!m) return {}
  const out: Record<string, string> = {}
  for (const line of m[1].split('\n')) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    const v = kv[2].trim().replace(/^["']|["']$/g, '')
    // A literal `null` is YAML for absent. Left as the string "null" it is TRUTHY, which would
    // have registered an unapproved batch as approved and pushed "null" into a date column.
    if (v === '' || v === 'null' || v === '~') continue
    out[kv[1]] = v
  }
  return out
}

/**
 * A section is `## <heading>` followed by the `slug:` / `slot:` / `title:` lines and one or more
 * blockquotes. A thread is many blockquotes in one section and joins with a blank line between
 * units, which is how it reads when posted by hand.
 */
export function parseBatch(text: string): BatchDraft {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const frontmatter = parseFrontmatter(text)
  const posts: BatchPost[] = []
  const orphanSections: { section: string; line: number }[] = []
  let sawQuoteInSection = false

  let section = ''
  let sectionLine = 0
  let slug: string | null = null
  let title: string | null = null
  let slot: string | null = null
  let quotes: string[][] = []
  let cur: string[] | null = null
  let claimed: number | null = null
  let firstComment: string | null = null

  const flush = () => {
    if (cur) { quotes.push(cur); cur = null }
    if (!slug && sawQuoteInSection && section) orphanSections.push({ section, line: sectionLine })
    sawQuoteInSection = false
    if (slug) {
      const body = quotes.map((q) => q.join('\n').replace(/\n+$/, '')).filter(Boolean).join('\n\n')
      posts.push({
        slug,
        title: title ?? '',
        slotLocal: slot && slot !== 'by-hand' ? slot : null,
        byHand: slot === 'by-hand',
        body,
        firstComment,
        claimedChars: claimed,
        measuredChars: [...body].length,
        section,
        line: sectionLine,
      })
    }
    slug = null; title = null; slot = null; quotes = []; cur = null; claimed = null; firstComment = null
  }

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    const h = /^##\s+(.*)$/.exec(l)
    if (h) { flush(); section = h[1]; sectionLine = i + 1; continue }

    const f = /^`(slug|slot|title):\s*(.+?)`\s*$/.exec(l)
    if (f) {
      if (f[1] === 'slug') slug = f[2].trim()
      else if (f[1] === 'slot') slot = f[2].trim()
      else title = f[2].trim()
      continue
    }
    // Note a blockquote even before a slug is seen, so a section that has copy and no slug is
    // reported rather than vanishing.
    if (/^>/.test(l) && !slug) { sawQuoteInSection = true; continue }
    if (!slug) continue

    if (/^>/.test(l)) { sawQuoteInSection = true; (cur ??= []).push(l.replace(/^>\s?/, '')); continue }
    if (cur) { quotes.push(cur); cur = null }

    const c = /^`(\d+) characters/.exec(l)
    if (c) claimed = Number(c[1])
    // The link-out's reply copy is the URL after the colon on the same annotation line.
    const r = /Link goes in a REPLY, not the post:`\s*(\S+)\s*$/.exec(l)
    if (r) firstComment = r[1]
    // A thread's closing link lives inside its last blockquote, so it needs no special case.
  }
  flush()
  return { frontmatter, posts, orphanSections }
}

// ── Validation. Every failure names the post and what a person must change.

export interface Refusal { ref: string; why: string }

export function validate(d: BatchDraft): Refusal[] {
  const out: Refusal[] = []
  const fm = d.frontmatter

  for (const k of ['canonical_asset', 'platform', 'format', 'publisher', 'queue_row', 'week_of']) {
    if (!fm[k]) out.push({ ref: 'frontmatter', why: `\`${k}\` is missing. The batch cannot be registered without it.` })
  }
  if (fm.preflight !== 'green') {
    out.push({
      ref: 'frontmatter',
      why: `preflight is "${fm.preflight ?? 'unset'}", not "green". This tool records a verdict, it does not reach one. Run /compliance-preflight first.`,
    })
  }
  if (!d.posts.length) out.push({ ref: 'file', why: 'no posts parsed. Each needs a `slug:` line under its `##` heading.' })
  for (const o of d.orphanSections) {
    out.push({ ref: `${o.section} (line ${o.line})`, why: 'this section has copy but no `slug:` line, so it would be registered as nothing at all. The slug is the only join between this file and the database.' })
  }

  const seen = new Set<string>()
  for (const p of d.posts) {
    const ref = `${p.slug || p.section}`
    if (!p.slug) out.push({ ref: p.section, why: 'no `slug:` line. The slug is the only join between this file and the database.' })
    if (p.slug && seen.has(p.slug)) out.push({ ref, why: 'duplicate slug in the same batch.' })
    if (p.slug) seen.add(p.slug)
    if (!p.title) out.push({ ref, why: 'no `title:` line.' })
    if (!p.body.trim()) out.push({ ref, why: 'blockquote is empty, so there is no copy to ship.' })
    if (p.slotLocal === null && !p.byHand) {
      out.push({ ref, why: 'no `slot:` line. Choosing when a post goes out is editorial. Use `slot: YYYY-MM-DDTHH:mm` (Europe/London) or `slot: by-hand`.' })
    }
    if (p.slotLocal && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(p.slotLocal)) {
      out.push({ ref, why: `slot "${p.slotLocal}" is not \`YYYY-MM-DDTHH:mm\` (Europe/London wall clock).` })
    }
    // A thread is posted by hand unit by unit, so only a scheduled post meets X's per-post ceiling.
    if (!p.byHand && p.measuredChars > X_LIMIT) {
      out.push({ ref, why: `${p.measuredChars} characters, over X's ${X_LIMIT} ceiling. Metricool will not split a longer message.` })
    }
    if (p.claimedChars !== null && p.claimedChars !== p.measuredChars) {
      out.push({ ref, why: `the file claims ${p.claimedChars} characters and the copy measures ${p.measuredChars}. Correct the claim, or the copy.` })
    }
  }
  return out
}

/** London wall clock to the UTC instant the database stores. */
export function toUtcIso(slotLocal: string, year = Number(slotLocal.slice(0, 4))): string {
  // BST runs from the last Sunday in March to the last Sunday in October, 01:00 UTC both ends.
  const lastSunday = (m: number) => {
    const d = new Date(Date.UTC(year, m + 1, 0))
    d.setUTCDate(d.getUTCDate() - d.getUTCDay())
    return d
  }
  const naive = new Date(`${slotLocal}:00Z`)
  const bst = naive >= new Date(Date.UTC(lastSunday(2).getUTCFullYear(), 2, lastSunday(2).getUTCDate(), 1))
    && naive < new Date(Date.UTC(lastSunday(9).getUTCFullYear(), 9, lastSunday(9).getUTCDate(), 1))
  return new Date(naive.getTime() - (bst ? 3600_000 : 0)).toISOString()
}

// ── Apply

export interface RunResult {
  assets: { slug: string; created: boolean }[]
  renditions: { slug: string; slot: string; publisher: string; chars: number }[]
  skipped: { slug: string; why: string }[]
  refused: Refusal[]
}

/**
 * The asset lifecycle, in order. Re-running this tool must never walk a row BACKWARDS: a batch
 * whose posts have published sits at `done`, and re-registering it to record a typo correction in
 * the draft would otherwise quietly un-publish it in our own records. Take the later of the two.
 */
export const STATUS_RANK = ['idea', 'hooked', 'scripted', 'recorded', 'edited', 'approved', 'done']
export function laterStatus(existing: string | null | undefined, target: string): string {
  const a = STATUS_RANK.indexOf(existing ?? ''), b = STATUS_RANK.indexOf(target)
  return a > b ? (existing as string) : target
}

export function render(r: RunResult, opts: { dryRun: boolean }): string {
  const L: string[] = []
  L.push(`register-x-batch${opts.dryRun ? ' (DRY RUN — nothing was written)' : ''}`)
  L.push('─'.repeat(72))
  for (const x of r.renditions) {
    L.push(`  ${opts.dryRun ? 'WOULD REGISTER' : 'REGISTERED    '}  ${x.slug.padEnd(34)} ${x.slot.padEnd(18)} ${x.publisher.padEnd(9)} ${String(x.chars).padStart(4)}ch`)
  }
  for (const x of r.skipped ?? []) L.push(`  LEFT ALONE      ${x.slug.padEnd(34)} ${x.why}`)
  for (const x of r.refused) L.push(`  REFUSED  ${x.ref}\n             ${x.why}`)
  L.push('')
  L.push(`  ${r.renditions.length} registered, ${r.skipped?.length ?? 0} left alone, ${r.refused.length} refused.`)
  if (r.skipped?.length) {
    L.push('  LEFT ALONE means the rendition has already moved past this step. This job registers;')
    L.push('  it never rewrites live state. Change it in Metricool, or unslot it there first.')
  }
  if (r.refused.length) L.push('  A REFUSAL IS WORK OWED: each one names what a person must change in the draft.')
  else if (!opts.dryRun && r.renditions.length) L.push('  Next: metricool-schedule --dry-run, then --log. It creates DRAFTS a human arms.')
  return L.join('\n')
}

async function main(): Promise<number> {
  loadEnvLocal()
  const dryRun = process.argv.includes('--dry-run')
  const doLog = process.argv.includes('--log')
  const fileArg = process.argv.find((a) => a.endsWith('.md'))
  if (!fileArg) {
    console.error('usage: register-x-batch <path-to-drafts/x-week-YYYY-MM-DD.md> [--dry-run] [--log]')
    return 1
  }
  const root = repoRoot(process.cwd())
  if (!root) { console.error('register-x-batch: no repo root found from cwd. Refusing to run.'); return 1 }
  const abs = path.isAbsolute(fileArg) ? fileArg : path.join(root, fileArg)
  if (!fs.existsSync(abs)) { console.error(`register-x-batch: ${abs} does not exist.`); return 1 }

  const draft = parseBatch(fs.readFileSync(abs, 'utf-8'))
  const refused = validate(draft)
  if (refused.length) {
    console.log(render({ assets: [], renditions: [], skipped: [], refused }, { dryRun }))
    return 2
  }

  const fm = draft.frontmatter
  const db = admin()
  const { data: art, error: aErr } = await db.from('blog_articles')
    .select('id, status').eq('slug', fm.canonical_asset).maybeSingle()
  if (aErr || !art) {
    console.log(render({ assets: [], renditions: [], skipped: [], refused: [{ ref: fm.canonical_asset, why: `canonical article not found: ${aErr?.message ?? 'no row'}` }] }, { dryRun }))
    return 2
  }
  if (art.status !== 'published') {
    console.log(render({ assets: [], renditions: [], skipped: [], refused: [{ ref: fm.canonical_asset, why: `canonical article is "${art.status}", not published. A derivative inherits a PUBLISHED article's sign-off.` }] }, { dryRun }))
    return 2
  }

  const out: RunResult = { assets: [], renditions: [], skipped: [], refused: [] }
  for (const p of draft.posts) {
    const publisher = p.byHand ? 'manual' : fm.publisher
    const utc = p.slotLocal ? toUtcIso(p.slotLocal) : null

    // Has this rendition already moved past registration? Read BEFORE writing anything: an upsert
    // would reset `status` to to-produce on a post that is scheduled or published, un-scheduling it
    // in our records while it sits live in Metricool. Registering is not the same as owning.
    const { data: existingAsset } = await db.from('content_assets')
      .select('id, status').eq('slug', p.slug).maybeSingle()
    if (existingAsset) {
      const { data: existingRend } = await db.from('content_renditions')
        .select('status, external_post_id').eq('asset_id', existingAsset.id)
        .eq('platform', fm.platform).eq('format', fm.format).maybeSingle()
      if (existingRend && (existingRend.external_post_id || existingRend.status !== 'to-produce')) {
        out.skipped.push({
          slug: p.slug,
          why: `already at "${existingRend.status}"${existingRend.external_post_id ? `, Metricool id ${existingRend.external_post_id}` : ''}`,
        })
        continue
      }
    }
    const note = `${p.section}. ${p.measuredChars} chars.${p.byHand ? ' POST BY HAND: Metricool cannot split an X thread.' : ''}`
      + ` | ${fm.batch ?? 'batch'} (queue row ${fm.queue_row}). Source: ${fileArg}.`
      + ` Inherits ${fm.canonical_asset}, nothing net-new. Pre-flight green ${fm.preflight_date ?? ''}.`

    if (dryRun) {
      out.renditions.push({ slug: p.slug, slot: p.slotLocal ?? 'by-hand', publisher, chars: p.measuredChars })
      continue
    }

    const { data: asset, error: e1 } = await db.from('content_assets').upsert({
      slug: p.slug,
      title: p.title,
      status: laterStatus(existingAsset?.status, fm.approved_by ? 'approved' : 'scripted'),
      content_type: fm.content_type ?? 'educational',
      funnel_stage: fm.funnel_stage ?? 'TOFU',
      funnel_job: fm.funnel_job ?? null,
      awareness: fm.awareness ?? 'problem-aware',
      cta: fm.cta ?? 'quiz',
      markers: fm.markers ? fm.markers.split(',').map((s) => s.trim()).filter(Boolean) : [],
      series: fm.series ?? 'none',
      preflight: 'green',
      preflight_date: fm.preflight_date ?? null,
      canonical_article_id: art.id,
      approved_by: fm.approved_by || null,
      approved_at: fm.approved_date || null,
      notes: note,
    }, { onConflict: 'slug' }).select('id').single()
    if (e1 || !asset) { out.refused.push({ ref: p.slug, why: `asset upsert failed: ${e1?.message}` }); continue }

    const { error: e2 } = await db.from('content_renditions').upsert({
      asset_id: asset.id,
      platform: fm.platform,
      format: fm.format,
      variant: null,
      status: 'to-produce',
      publisher,
      body: p.body,
      first_comment: p.firstComment,
      scheduled_for: utc,
      thumb_spec: 'none',
    }, { onConflict: 'asset_id,platform,format,variant' })
    if (e2) { out.refused.push({ ref: p.slug, why: `rendition upsert failed: ${e2.message}` }); continue }

    out.renditions.push({ slug: p.slug, slot: p.slotLocal ?? 'by-hand', publisher, chars: p.measuredChars })
  }

  console.log(render(out, { dryRun }))
  if (doLog && !dryRun) {
    await logRun({
      agent: AGENT,
      itemRef: fm.queue_row ?? null,
      status: out.refused.length ? 'error' : 'ok',
      detail: { file: fileArg, registered: out.renditions.length, refused: out.refused.length },
    })
  }
  return out.refused.length ? 2 : 0
}

if (/(^|[\\/])register-x-batch\.(ts|js)$/.test(process.argv[1] ?? '')) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(`${AGENT} ERROR:`, (e as Error).message); process.exit(1) })
}
