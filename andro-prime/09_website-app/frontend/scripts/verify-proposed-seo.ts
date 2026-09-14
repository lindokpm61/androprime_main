#!/usr/bin/env tsx
/**
 * Would promoting a pending revision silently delete a field the live page has?
 *
 *   npm run verify:proposed-seo
 *
 * WHY THIS EXISTS. `promote_proposed_revision` copies a revision's whole
 * `frontmatter` onto the article. That is correct for a revision authored against
 * the current row, and destructive for one authored before a key existed.
 *
 * On 2026-09-14 Keith approved 26 SEO fields and they were written onto 15 live
 * articles. Two of those articles — `why-am-i-always-tired` and
 * `inflammatory-markers-blood-test` — were already holding a CONTENT re-opt
 * staged on 2026-08-18, a month before `seoTitle` and `seoDescription` existed.
 * Nothing about promoting those re-opts would error. The frontmatter would be
 * replaced wholesale, the approved snippet would vanish from the search result,
 * `verify-article-seo` would go red at the next run, and the cause would be a
 * promotion that looked entirely routine weeks earlier.
 *
 * 🔴 THE GENERAL SHAPE IS WORTH MORE THAN THE TWO ROWS. A staged revision is a
 * SNAPSHOT of a document, and any snapshot taken before a field was added carries
 * that field's absence as though it were a decision. The longer a revision sits
 * pending, the more likely it is to be silently wrong about something nobody
 * changed in it. Anything that promotes a whole blob needs a check that the blob
 * is not older than the schema it is about to overwrite.
 *
 * ⚠ IT IS A COMMAND, NOT A TEST, for the same reason `verify-article-seo` is: it
 * needs the service key and a network call, and a test that needs secrets is a
 * test that gets skipped, and a skipped test reports green.
 *
 * Exit 1 if any pending revision would drop a key. Exit 1 is never a pass,
 * including when the cause is a missing key rather than a real finding.
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'node:path'

config({ path: path.resolve(__dirname, '..', '.env.local') })

/** The keys a promotion must not silently drop. */
const GUARDED = ['seoTitle', 'seoDescription'] as const

async function main(): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required. ' +
        'A missing key is a failure, not a skip.',
    )
  }
  const db = createClient(url, key, { auth: { persistSession: false } })

  const { data: articles, error } = await db
    .from('blog_articles')
    .select('slug, frontmatter, proposed_revision_id')
    .not('proposed_revision_id', 'is', null)
  if (error) throw new Error(`blog_articles read failed: ${error.message}`)

  if (!articles?.length) {
    console.log('verify-proposed-seo: no article has a pending revision. Nothing to check.')
    return
  }

  const { data: revisions, error: rErr } = await db
    .from('blog_article_revisions')
    .select('id, scope, created_at, frontmatter')
    .in('id', articles.map((a) => a.proposed_revision_id as string))
  if (rErr) throw new Error(`blog_article_revisions read failed: ${rErr.message}`)
  const byId = new Map((revisions ?? []).map((r) => [r.id as string, r]))

  const failures: string[] = []
  for (const a of articles) {
    const rev = byId.get(a.proposed_revision_id as string)
    if (!rev) {
      failures.push(`${a.slug}: proposed_revision_id points at a revision that does not exist.`)
      continue
    }
    const live = (a.frontmatter ?? {}) as Record<string, unknown>
    const proposed = (rev.frontmatter ?? {}) as Record<string, unknown>
    const dropped = GUARDED.filter(
      (k) => typeof live[k] === 'string' && live[k] !== '' && typeof proposed[k] !== 'string',
    )
    if (dropped.length) {
      failures.push(
        `${a.slug}: the pending ${rev.scope} revision (staged ${String(rev.created_at).slice(0, 10)}) ` +
          `does not carry ${dropped.join(' or ')}, and the live row does. Promoting it would ` +
          `delete the approved value with no error. Re-stage the revision from the current row, ` +
          `or carry the key forward onto it, before it is promoted.`,
      )
    } else {
      console.log(
        `  ok  ${a.slug}  pending ${rev.scope} revision carries every guarded key the live row has`,
      )
    }
  }

  console.log('')
  if (failures.length) {
    console.error(
      `verify-proposed-seo: ${failures.length} pending revision(s) would silently drop an ` +
        `approved field.\n`,
    )
    for (const f of failures) console.error(`  ${f}\n`)
    process.exitCode = 1
    return
  }
  console.log(
    `verify-proposed-seo: ${articles.length} pending revision(s), none would drop a guarded key.`,
  )
}

main().catch((e: unknown) => {
  console.error(`ERROR: ${e instanceof Error ? e.message : String(e)}`)
  process.exitCode = 1
})
