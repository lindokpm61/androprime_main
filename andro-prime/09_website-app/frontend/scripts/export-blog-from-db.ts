/**
 * Git mirror: export blog_articles from Supabase back to content/blog/*.mdx as a
 * versioned backup of the now-DB-sourced blog. The running site never reads these
 * files (lib/blog.ts reads the DB) — they exist for git history + recoverability,
 * and they keep the file-based audit (audit-keyword-coverage.js) valid.
 *
 * Exports draft + published rows (skips archived = taken down). Reconstructs each
 * file as YAML frontmatter + MDX body via gray-matter.
 *
 * Run from frontend/:
 *   npx tsx scripts/export-blog-from-db.ts --dry     # print summary, write nothing
 *   npx tsx scripts/export-blog-from-db.ts           # write content/blog/*.mdx
 *
 * Committing is intentionally NOT done here — the scheduled mirror job stages by
 * path and commits separately, so a human/agent controls when history is written.
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    let val = m[2]
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = val
  }
}
loadEnvLocal()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key || key === 'placeholder-service-role-key') {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (.env.local).')
  process.exit(1)
}

const dry = process.argv.includes('--dry')
const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const outDir = path.join(process.cwd(), 'content/blog')

async function main() {
  const { data, error } = await sb
    .from('blog_articles')
    .select('slug,status,body,frontmatter')
    .in('status', ['draft', 'published'])
    .order('slug')
  if (error || !data) {
    console.error('Query failed:', error?.message)
    process.exit(1)
  }

  for (const row of data) {
    const fm = { ...(row.frontmatter as Record<string, unknown>), status: row.status }
    const file = matter.stringify(row.body ?? '', fm)
    const target = path.join(outDir, `${row.slug}.mdx`)
    if (dry) {
      console.log(`DRY  ${row.slug}.mdx  (${row.status}, ${file.length} bytes)`)
    } else {
      fs.writeFileSync(target, file, 'utf-8')
      console.log(`WROTE ${row.slug}.mdx  (${row.status})`)
    }
  }
  console.log(`\n${dry ? 'Would export' : 'Exported'} ${data.length} article(s) to content/blog/.`)
}

main()
