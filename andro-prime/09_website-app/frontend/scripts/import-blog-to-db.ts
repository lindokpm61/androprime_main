/**
 * One-off + re-runnable: import the live blog MDX files in content/blog/ into the
 * Supabase `blog_articles` table (Phase 1 of the content-engine decoupling).
 *
 * Idempotent: uses the upsert_blog_article() RPC, so re-running updates rows in place
 * and appends a fresh revision. Only content/blog/ is imported — the historical
 * pre-publish sources in 06_marketing/seo-ai-search/article-drafts/ are the same
 * articles under different slugs and would create duplicates, so they are skipped.
 *
 * Run from frontend/:  npx tsx scripts/import-blog-to-db.ts
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/types'

// Minimal .env.local loader (no dotenv dependency; only sets vars not already present).
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    const key = m[1]
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}
loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key || key === 'placeholder-service-role-key') {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (.env.local).')
  process.exit(1)
}

const sb = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const contentDir = path.join(process.cwd(), 'content/blog')

// Coerce YAML-parsed dates to YYYY-MM-DD, matching lib/blog.ts normalizeFrontmatter,
// so the stored frontmatter renders identically to the file-based version.
function coerceDates(fm: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...fm }
  for (const k of ['date', 'dateModified', 'isoDate']) {
    const v = out[k]
    if (v instanceof Date) out[k] = v.toISOString().slice(0, 10)
    else if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) out[k] = v.slice(0, 10)
  }
  return out
}

async function main() {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.mdx'))
  let failures = 0
  for (const f of files) {
    const raw = fs.readFileSync(path.join(contentDir, f), 'utf-8')
    const { data, content } = matter(raw)
    const slug = f.replace(/\.mdx$/, '')
    // These are the live files — default published unless the frontmatter says otherwise.
    const status = data.status === 'draft' ? 'draft' : 'published'
    // JSON round-trip drops Date objects (Date.toJSON -> ISO), then coerce date fields to date-only.
    const fm = coerceDates(JSON.parse(JSON.stringify(data)))
    const keywordCoverage = (fm.keyword_coverage as unknown) ?? null

    const { data: id, error } = await sb.rpc('upsert_blog_article', {
      p_slug: slug,
      p_status: status,
      p_body: content,
      p_frontmatter: fm as never,
      p_keyword_coverage: keywordCoverage as never,
      p_editor: 'migration',
    })
    if (error) {
      console.error(`FAIL  ${slug}: ${error.message}`)
      failures++
    } else {
      console.log(`OK    ${slug}  [${status}]  -> ${id}`)
    }
  }
  console.log(`\nImported ${files.length - failures}/${files.length} article(s).`)
  if (failures) process.exitCode = 1
}

main()
