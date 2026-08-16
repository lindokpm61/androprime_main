/**
 * Move a finished written post from its asset file into `content_renditions.body`.
 *
 * THE SEAM THIS CLOSES. `/script` writes the post into the asset file's `## Script` section, which
 * is correct: the file owns identity and craft. `metricool-schedule.ts` reads the copy from
 * `content_renditions.body` and says so plainly ("never guessed from the asset markdown"), which is
 * also correct: the database owns what ships. **Nothing joined the two.** So a post could be
 * written, pre-flighted green and approved, and still be refused at scheduling for having no copy,
 * with the copy sitting in git the whole time. Two of four owed posts were in exactly that state on
 * 2026-08-16, and the empty column read as "not written yet".
 *
 * WHY EXTRACT RATHER THAN RETYPE. The copy is Ewa-adjacent, pre-flighted and approved at its exact
 * wording. Re-keying it by hand is how a cleared claim quietly becomes an uncleared one. This reads
 * the bytes that were signed off.
 *
 * SHAPE IT EXPECTS, per written-post-playbook.md: a `POST` line, then the body as consecutive `> `
 * blockquote lines, then an optional `**First comment:**` line. The blockquote markers are stripped;
 * blank quoted lines become paragraph breaks. Anything else in the section is craft commentary and
 * is deliberately NOT shipped.
 *
 * Usage:
 *   npx tsx scripts/content-engine/bridge-post-body.ts <slug> <platform> <format>   (dry)
 *   npx tsx scripts/content-engine/bridge-post-body.ts <slug> <platform> <format> --apply
 */
import fs from 'node:fs'
import path from 'node:path'
import { loadEnvLocal } from './_shared'
import { createClient } from '@supabase/supabase-js'

const ASSETS = path.resolve(process.cwd(), '../../06_marketing/content-machine/assets')
const APPLY = process.argv.includes('--apply')
const [slug, platform, format] = process.argv.slice(2).filter((a) => !a.startsWith('--'))

/** Pull the shippable body and first comment out of an asset file. Craft prose is left behind. */
export function extractPost(md: string): { body: string; firstComment: string | null } {
  const lines = md.replace(/\r\n/g, '\n').split('\n')

  const postAt = lines.findIndex((l) => l.trim() === 'POST')
  if (postAt === -1) throw new Error('no "POST" line: this asset carries no written post')

  const quoted: string[] = []
  for (let i = postAt + 1; i < lines.length; i++) {
    const l = lines[i]
    if (/^>\s?/.test(l)) { quoted.push(l.replace(/^>\s?/, '')); continue }
    if (l.trim() === '' && quoted.length) { quoted.push(''); continue }
    if (quoted.length) break
  }
  if (!quoted.length) throw new Error('the POST line is not followed by a blockquote body')

  // Collapse the run of blanks a markdown blockquote produces between paragraphs.
  const body = quoted.join('\n').replace(/\n{3,}/g, '\n\n').trim()

  const fcLine = lines.find((l) => /^\*\*First comment:?\*\*/i.test(l.trim()))
  const firstComment = fcLine
    ? fcLine.replace(/^\*\*First comment:?\*\*\s*/i, '').trim() || null
    : null

  return { body, firstComment }
}

async function main() {
  if (!slug || !platform || !format) {
    throw new Error('usage: bridge-post-body.ts <slug> <platform> <format> [--apply]')
  }
  loadEnvLocal()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  const db = createClient(url, key, { auth: { persistSession: false } })

  const file = fs.readdirSync(ASSETS).find((f) => f.endsWith(`-${slug}.md`))
  if (!file) throw new Error(`no asset file ending in "-${slug}.md" under ${ASSETS}`)

  const { body, firstComment } = extractPost(fs.readFileSync(path.join(ASSETS, file), 'utf8'))

  const { data: rows, error: rErr } = await db
    .from('content_renditions')
    .select('id,body,status,content_assets!inner(slug)')
    .eq('platform', platform).eq('format', format)
    .eq('content_assets.slug', slug)
  if (rErr) throw new Error(`rendition read failed: ${rErr.message}`)
  if (!rows?.length) throw new Error(`no ${platform}/${format} rendition for "${slug}"`)
  if (rows.length > 1) throw new Error(`${rows.length} matching renditions; refusing to guess`)
  const rend = rows[0]

  console.log(`asset  : ${file}`)
  console.log(`target : ${platform}/${format}  (${rend.status})`)
  console.log(`body   : ${body.length} chars, ${body.split('\n\n').length} paragraph(s)`)
  console.log(`comment: ${firstComment ? `${firstComment.length} chars` : 'none'}`)
  console.log('\n--- body as it would ship ---')
  console.log(body)
  if (firstComment) console.log(`\n--- first comment ---\n${firstComment}`)

  // Never silently overwrite copy that already shipped or was edited in place.
  if (rend.body && rend.body.trim() && rend.body.trim() !== body) {
    throw new Error('this rendition already holds DIFFERENT copy. Refusing to overwrite; resolve by hand.')
  }

  if (!APPLY) { console.log('\nDRY RUN. Nothing written. Re-run with --apply.'); return }

  const patch: Record<string, string> = { body }
  if (firstComment) patch.first_comment = firstComment
  const { error: uErr } = await db.from('content_renditions').update(patch).eq('id', rend.id)
  if (uErr) throw new Error(`update failed: ${uErr.message}`)
  console.log(`\n✅ written to content_renditions.body for ${slug} ${platform}/${format}.`)
}

main().catch((e) => { console.error('🔴 FAILED:', (e as Error).message); process.exit(1) })
