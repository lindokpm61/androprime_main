/**
 * Brief-Architect — Phase 3b. The thin deterministic half of the brief stage. The brief
 * itself (SERP gap, coverage map, section-by-section strategy) is human + LLM work that
 * must NOT run headless — same call as Draft-Writer. So Brief-Architect only:
 *
 *   scaffold  (keyword_queue 'accepted' & unbriefed -> 'briefed'): generate the 21-section
 *             brief SKELETON file + a content_pipeline row parked on Keith (G1). Keith then
 *             authors the strategy into that file. LOCAL/manual (writes a repo file).
 *   promote   ('briefed' -> 'brief_ready'): when the brief file's frontmatter says
 *             status: brief-ready AND no scaffold placeholders remain, advance the pipeline
 *             so Draft-Writer can pick it up. Read-only -> safe on the daily cron tick.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/brief-architect.ts --dry    # scaffold + promote, no writes
 *   npx tsx scripts/content-engine/brief-architect.ts          # scaffold new + promote ready
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const DRY = process.argv.includes('--dry')

const REPO_ROOT = path.resolve(process.cwd(), '../../..')
const BRIEFS_REL = 'andro-prime/06_marketing/seo-ai-search/article-briefs'
const BRIEFS_DIR = path.join(REPO_ROOT, BRIEFS_REL)
const TODAY = new Date().toISOString().slice(0, 10)

// Promote refuses while any of these remain, so a bare skeleton can never reach brief_ready.
const SENTINEL = '<!-- SCAFFOLD: Keith to author this section -->'

const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)

const SECTIONS: string[] = [
  '1. Why this article ships (sequence + rationale)',
  "2. The article's job (one sentence)",
  '3. Target reader (ICP)',
  '4. Search-intent decoded',
  '5. SERP gap (analysis)',
  '5a. Keyword coverage map',
  '6. Word-count + structure',
  '7. Opening block (the AI-snippet target)',
  '8. Heading scaffold (H2 / key H3)',
  '9. Section-by-section content brief',
  '10. Sources to cite (E-E-A-T + GEO)',
  '11. Expert quotation block',
  '12. FAQ block (FAQPage schema)',
  '13. CTA block (end of article only)',
  '14. Schema requirements',
  '15. Metadata + URL',
  '16. Compliance gate',
  '17. Internal linking',
  '18. AI-citation pre-publish checklist',
  '19. Open questions for Keith before draft',
  '20. Next steps when this brief is approved',
  '21. Post-draft delivery report (filled by writer/agent at handoff)',
]

function scaffoldFile(q: { query: string; proposed_slug: string; vol: number | null; kd: number | null; pillar: string | null }): string {
  const fm = [
    '---',
    `brief: ${q.pillar ?? 'TBD'} (scaffold)`,
    `target_query: ${q.query}`,
    `slug: ${q.proposed_slug}`,
    `vol_uk: ${q.vol ?? ''}`,
    `kd: ${q.kd ?? ''}`,
    'intent: TBD',
    'icp: TODO',
    'kit_funnel: TODO',
    'sequence: TODO',
    'compliance_gate: TODO (Ewa pre-flight required before publish)',
    "status: draft  # set to 'brief-ready' once authored + G1-approved; Brief-Architect then advances the pipeline",
    'owner: Keith Antony',
    'reviewer: Dr Ewa Lindo',
    `last_updated: ${TODAY}`,
    '---',
    '',
    `# Brief scaffold — "${q.query}"`,
    '',
    `> Auto-generated skeleton (Brief-Architect, ${TODAY}). Author each section, then set`,
    "> `status: brief-ready` in the frontmatter. Remove every scaffold placeholder before that —",
    '> the pipeline will not advance while any remain.',
    '',
  ]
  const body = SECTIONS.map((s) => `## ${s}\n\n${SENTINEL}\n`).join('\n')
  return fm.join('\n') + body
}

// keyword_queue 'accepted' & not yet briefed -> scaffold file + pipeline row (briefed, on Keith).
async function runBriefScaffold() {
  const { data, error } = await admin()
    .from('keyword_queue')
    .select('id, query, proposed_slug, vol, kd, cpc, pillar, notes, coverage_status')
    .eq('status', 'accepted')
    .in('coverage_status', ['unassigned', 'planned'])
  if (error) throw new Error(`read accepted keywords: ${error.message}`)

  for (const row of data ?? []) {
    const slug = row.proposed_slug
    if (!slug) {
      log(`SKIP     keyword "${row.query}" has no proposed_slug`)
      continue
    }
    const filePath = path.join(BRIEFS_DIR, `${slug}.md`)
    const briefRef = `${BRIEFS_REL}/${slug}.md`

    // Don't clobber an existing brief or re-scaffold an existing pipeline row.
    const { data: existingPipe } = await admin().from('content_pipeline').select('id').eq('slug', slug).maybeSingle()
    if (fs.existsSync(filePath) || existingPipe) {
      log(`exists   ${slug}  (brief or pipeline row already present) -> mark queue briefed`)
      if (!DRY) await admin().from('keyword_queue').update({ coverage_status: 'briefed' }).eq('id', row.id)
      continue
    }

    log(`SCAFFOLD ${slug}  <- "${row.query}"  (${briefRef})`)
    if (DRY) continue

    fs.writeFileSync(filePath, scaffoldFile({ ...row, proposed_slug: slug }))
    await admin()
      .from('content_pipeline')
      .insert({ slug, pillar: row.pillar, stage: 'briefed', brief_ref: briefRef, blocked_on: 'keith' })
    await admin().from('keyword_queue').update({ coverage_status: 'briefed' }).eq('id', row.id)
    await logRun({ agent: 'brief-architect', itemRef: slug, status: 'ok', detail: { action: 'scaffolded', brief_ref: briefRef } })
  }
}

// briefed + brief file status:brief-ready (no placeholders) -> brief_ready (Draft-Writer's input).
async function runBriefPromote() {
  const { data, error } = await admin()
    .from('content_pipeline')
    .select('id, slug, brief_ref')
    .eq('stage', 'briefed')
    .not('brief_ref', 'is', null)
  if (error) throw new Error(`read briefed: ${error.message}`)

  for (const row of data ?? []) {
    const filePath = path.join(REPO_ROOT, row.brief_ref as string)
    if (!fs.existsSync(filePath)) {
      log(`waiting  ${row.slug}  (brief file missing: ${row.brief_ref})`)
      continue
    }
    const fm = matter(fs.readFileSync(filePath, 'utf-8'))
    const status = String((fm.data as { status?: string }).status ?? '').toLowerCase()
    if (status !== 'brief-ready') {
      log(`pending  ${row.slug}  (brief status '${status || 'unset'}', not brief-ready)`)
      continue
    }
    const remaining = fm.content.split(SENTINEL).length - 1
    if (remaining > 0) {
      log(`BLOCKED  ${row.slug}  brief-ready but ${remaining} scaffold placeholder(s) remain`)
      if (!DRY) {
        await admin().from('content_pipeline').update({ blocked_on: 'keith', notes: `${remaining} scaffold placeholders unfilled` }).eq('id', row.id)
      }
      continue
    }

    log(`PROMOTE  ${row.slug}  briefed -> brief_ready`)
    if (DRY) continue
    await admin().from('content_pipeline').update({ stage: 'brief_ready', blocked_on: null, notes: null }).eq('id', row.id)
    await logRun({ agent: 'brief-architect', itemRef: row.slug as string, status: 'ok', detail: { action: 'brief_ready' } })
  }
}

async function main() {
  log(`brief-architect tick (briefs ${BRIEFS_REL})`)
  await runBriefScaffold()
  await runBriefPromote()
  log('done.')
}

export { runBriefScaffold, runBriefPromote }

if (process.argv[1]?.endsWith('brief-architect.ts')) {
  main().catch(async (e) => {
    console.error('BRIEF-ARCHITECT ERROR:', (e as Error).message)
    if (!DRY) await logRun({ agent: 'brief-architect', status: 'error', error: (e as Error).message })
    process.exit(1)
  })
}
