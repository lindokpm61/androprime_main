/**
 * sync-mirror — keep the git-tracked blog mirror (content/blog/*.mdx) honest with the
 * live DB. The DB (blog_articles) is the source of truth; content/blog is a backup mirror
 * (reference-seo-blog-architecture). After a publish or a re-opt promote, the live body
 * changes in the DB but the mirror goes stale. This re-syncs it.
 *
 * BODY-ONLY by design: it replaces only the body of an existing mirror file and keeps the
 * file's frontmatter block verbatim (preserving hand-written YAML + comments), so diffs stay
 * clean and truthful. It writes a file ONLY when the body genuinely differs — in-sync files
 * are never touched (no spurious churn). A published article with no mirror file yet is
 * created from the DB (frontmatter reconstructed via gray-matter for the new file only).
 *
 * Wired into the content-engine workflow after the orchestrator tick (which is when promotes
 * happen); the workflow commits any changed mirror files. Also runnable by hand.
 *
 * Run from frontend/:
 *   npx tsx scripts/content-engine/sync-mirror.ts --dry
 *   npx tsx scripts/content-engine/sync-mirror.ts
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { loadEnvLocal, admin, logRun } from './_shared'

loadEnvLocal()
const DRY = process.argv.includes('--dry')
const MIRROR = path.join(process.cwd(), 'content', 'blog')
const log = (...a: unknown[]) => console.log(DRY ? '[dry]' : '[live]', ...a)
const norm = (s: string) => s.replace(/\r\n/g, '\n').trim()

async function main() {
  if (!fs.existsSync(MIRROR)) throw new Error(`mirror dir not found: ${MIRROR} (run from frontend/)`)
  const { data: arts, error } = await admin().from('blog_articles').select('slug, body, frontmatter').eq('status', 'published')
  if (error) throw new Error(`read blog_articles: ${error.message}`)

  const changed: string[] = []
  for (const a of (arts ?? []).sort((x, y) => x.slug.localeCompare(y.slug))) {
    const file = path.join(MIRROR, `${a.slug}.mdx`)
    if (!fs.existsSync(file)) {
      // new article, no mirror yet: create from DB (stringify is fine — no prior hand-format to keep)
      log(`CREATE  ${a.slug}.mdx (no mirror yet)`)
      changed.push(a.slug)
      if (!DRY) fs.writeFileSync(file, matter.stringify(a.body, (a.frontmatter ?? {}) as object))
      continue
    }
    const raw = fs.readFileSync(file, 'utf-8')
    if (norm(matter(raw).content) === norm(a.body)) continue // in sync — never touch

    // body-only update: keep the file's frontmatter block verbatim, swap the body
    const fmBlock = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
    if (!fmBlock) { log(`SKIP    ${a.slug} (no frontmatter block parsed — leaving for manual review)`); continue }
    log(`SYNC    ${a.slug}.mdx (body diverged -> updating from DB)`)
    changed.push(a.slug)
    if (!DRY) fs.writeFileSync(file, `${fmBlock[0]}\n${a.body.replace(/^\n+/, '')}\n`)
  }

  if (!changed.length) { log('mirror already in sync — nothing written'); return }
  log(`${DRY ? 'would update' : 'updated'} ${changed.length} mirror file(s): ${changed.join(', ')}`)
  if (!DRY) await logRun({ agent: 'sync-mirror', status: 'ok', detail: { synced: changed } })
}

main().catch(async (e) => {
  console.error('SYNC-MIRROR ERROR:', (e as Error).message)
  if (!DRY) await logRun({ agent: 'sync-mirror', status: 'error', error: (e as Error).message })
  process.exit(1)
})
