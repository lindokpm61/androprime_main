#!/usr/bin/env tsx
/**
 * apply-seo-drafts — put APPROVED SEO fields onto live articles. The counterpart
 * to `check-seo-drafts.ts`, and the only thing in this commission that writes.
 *
 *   npx tsx scripts/content-engine/apply-seo-drafts.ts <drafts.json>            # dry run
 *   npx tsx scripts/content-engine/apply-seo-drafts.ts <drafts.json> --apply    # writes
 *   npx tsx scripts/content-engine/apply-seo-drafts.ts <drafts.json> --revert   # removes the two keys
 *
 * ⚠ DRY BY DEFAULT, AND --apply IS SPELLED OUT. Every other script in this
 * commission reads. This one changes what Google shows for the whole blog, so
 * the default has to be the harmless one.
 *
 * ⚠ IT RE-RUNS THE FULL PRE-FLIGHT BEFORE WRITING A BYTE. Length, the claim
 * guard, house style, published status and an approved review row — the same
 * checks as `check-seo-drafts.ts`, invoked rather than reimplemented, because a
 * batch file can be edited between the check and the apply and the apply is the
 * step that matters. Any failure aborts the whole run before any write.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 🔴 IT IS A JSONB MERGE, NOT A STAGED REVISION, AND THAT IS FORCED BY A
 * COLLISION RATHER THAN CHOSEN FOR CONVENIENCE.
 *
 * `stage_blog_revision` sets `blog_articles.proposed_revision_id`, and that
 * column holds ONE pointer. On 2026-09-14 two articles in this commission —
 * `why-am-i-always-tired` and `inflammatory-markers-blood-test` — each already
 * held a CONTENT re-opt staged 2026-08-18 and blocked on Keith. Staging an SEO
 * revision over those would have orphaned a month-old pending revision: the row
 * survives in `blog_article_revisions`, nothing points at it any more, and
 * `promote_proposed_revision` clears the pointer for good.
 *
 * So the scope='seo' route built earlier that day is the right route for a
 * revision that needs REVIEW, and the wrong one for a change that has already
 * been approved and only has to land. `frontmatter || patch` adds exactly the
 * two keys: not body, not current_revision_id, not proposed_revision_id, not
 * status, not published_at.
 *
 * ⚠ ONE CONSEQUENCE, AND IT IS THE REASON `verify-proposed-seo.ts` EXISTS.
 * Those two pending content re-opts were staged BEFORE `seoTitle` /
 * `seoDescription` existed, so their frontmatter does not carry them. Promoting
 * one copies its whole frontmatter onto the live row and would silently delete
 * the approved SEO field underneath. That check fails the moment a proposed
 * revision would drop a key the live row carries.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

config({ path: path.resolve(__dirname, '..', '..', '.env.local') })

const argv = process.argv.slice(2)
const file = argv.find((a) => !a.startsWith('--'))
const APPLY = argv.includes('--apply')
const REVERT = argv.includes('--revert')
if (!file || (APPLY && REVERT)) {
  console.error('usage: apply-seo-drafts.ts <drafts.json> [--apply | --revert]')
  process.exit(1)
}
const draftsFile: string = file

interface Draft { slug: string; seoTitle?: string; seoDescription?: string }

function preflight(): void {
  /* The gate is the OTHER script, run as a process, so there is exactly one
     definition of what a clean draft is. Re-implementing the checks here is how
     the writer and the checker come to disagree. */
  console.log('Re-running the full pre-flight before any write...\n')
  try {
    const out = execFileSync(
      process.execPath,
      [path.join(__dirname, '..', '..', 'node_modules', 'tsx', 'dist', 'cli.mjs'),
       path.join(__dirname, 'check-seo-drafts.ts'), draftsFile],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    )
    console.log(out.trim().split('\n').slice(-3).join('\n'))
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string }
    console.error(err.stdout ?? '')
    console.error(err.stderr ?? '')
    throw new Error('pre-flight FAILED. Nothing was written. Fix the batch and re-run.')
  }
}

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.')

  const drafts: Draft[] = JSON.parse(fs.readFileSync(path.resolve(draftsFile), 'utf8'))
  if (!REVERT) preflight()

  const db = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await db
    .from('blog_articles')
    .select('id, slug, status, frontmatter')
    .in('slug', drafts.map((d) => d.slug))
  if (error) throw new Error(`read failed: ${error.message}`)
  const bySlug = new Map((data ?? []).map((r) => [r.slug as string, r]))

  const mode = REVERT ? 'REVERT' : APPLY ? 'APPLY' : 'DRY RUN'
  console.log(`\n${mode} over ${drafts.length} article(s)\n`)

  let written = 0
  let fields = 0
  for (const d of drafts) {
    const row = bySlug.get(d.slug)
    if (!row) throw new Error(`${d.slug}: no such article. Aborting before any further write.`)
    const fm = { ...(row.frontmatter as Record<string, unknown>) }

    if (REVERT) {
      const had = ['seoTitle', 'seoDescription'].filter((k) => k in fm)
      if (!had.length) { console.log(`  skip   ${d.slug} (carries neither key)`); continue }
      for (const k of had) delete fm[k]
      console.log(`  revert ${d.slug}  removing ${had.join(', ')}`)
      fields += had.length
    } else {
      const patch: Record<string, string> = {}
      if (d.seoTitle) patch.seoTitle = d.seoTitle
      if (d.seoDescription) patch.seoDescription = d.seoDescription
      if (!Object.keys(patch).length) throw new Error(`${d.slug}: draft proposes nothing.`)
      Object.assign(fm, patch)
      console.log(`  ${APPLY ? 'write ' : 'would '} ${d.slug}  +${Object.keys(patch).join(', +')}`)
      fields += Object.keys(patch).length
    }

    if (APPLY || REVERT) {
      /* Write the WHOLE frontmatter object back, built from the row just read.
         `body`, `status`, `current_revision_id` and `proposed_revision_id` are
         not in the update at all, so no pending revision can be disturbed. */
      const { error: uErr } = await db
        .from('blog_articles')
        .update({ frontmatter: fm })
        .eq('id', row.id)
      if (uErr) throw new Error(`${d.slug}: write failed: ${uErr.message}`)
      written += 1
    }
  }

  console.log(
    `\n${mode}: ${fields} field(s) across ${drafts.length} article(s)` +
      (APPLY || REVERT ? `, ${written} row(s) written.` : '. Nothing was written; pass --apply.'),
  )
}

main().catch((e: unknown) => {
  console.error(`\nERROR: ${e instanceof Error ? e.message : String(e)}`)
  process.exitCode = 1
})
