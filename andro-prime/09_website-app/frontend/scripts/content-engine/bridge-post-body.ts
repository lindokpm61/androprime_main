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

/**
 * Pull the shippable body and first comment out of an asset file. Craft prose is left behind.
 *
 * ONE ASSET CAN CARRY MORE THAN ONE WRITTEN POST. `the-stack` is the first: the same idea has a
 * LinkedIn post and a Facebook post, written for different audiences and different lengths, in one
 * file. Taking the FIRST `POST` line regardless of platform would have bridged the LinkedIn copy
 * into the Facebook rendition and reported success, because both surfaces really do have a body
 * afterwards. So a `POST` line may be qualified with its platform:
 *
 *     POST linkedin        <- scoped, preferred whenever a file holds more than one
 *     POST                 <- bare, and still correct for the single-post case
 *
 * Resolution is strict rather than best-effort: ask for a platform, get that platform's post or a
 * refusal naming what the file actually holds. A wrong body on a live public account is not a
 * failure worth being relaxed about.
 */
export function extractPost(md: string, platform?: string): { body: string; firstComment: string | null } {
  const lines = md.replace(/\r\n/g, '\n').split('\n')

  const isPost = (l: string) => /^POST(\s+[a-z-]+)?$/.test(l.trim())
  const postLines = lines.map((l, i) => ({ l: l.trim(), i })).filter((x) => isPost(x.l))
  if (!postLines.length) throw new Error('no "POST" line: this asset carries no written post')

  const scoped = postLines.filter((x) => x.l !== 'POST')
  const bare = postLines.filter((x) => x.l === 'POST')

  let postAt: number
  if (platform && scoped.some((x) => x.l === `POST ${platform}`)) {
    postAt = scoped.find((x) => x.l === `POST ${platform}`)!.i
  } else if (scoped.length) {
    // The file scopes its posts by platform and none of them is the one asked for. Naming the
    // alternatives is the difference between a fixable message and a puzzle.
    throw new Error(
      `no "POST ${platform ?? '<platform>'}" section. This asset scopes its written posts by platform and holds: ` +
      `${scoped.map((x) => x.l).join(', ')}.`)
  } else if (bare.length > 1) {
    throw new Error(`${bare.length} unqualified "POST" lines. Qualify them (e.g. "POST linkedin") so the right one can be chosen.`)
  } else {
    postAt = bare[0].i
  }

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

  // Scope the first comment to THIS post's section. Searching the whole file would attach the
  // LinkedIn post's comment to the Facebook rendition, which is the same defect as the body one
  // and even harder to spot, because a plausible comment on the wrong post still reads fine.
  const nextPostAt = postLines.map((x) => x.i).find((i) => i > postAt) ?? lines.length
  const fcLine = lines.slice(postAt, nextPostAt).find((l) => /^\*\*First comment:?\*\*/i.test(l.trim()))
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

  const { body, firstComment } = extractPost(fs.readFileSync(path.join(ASSETS, file), 'utf8'), platform)

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
