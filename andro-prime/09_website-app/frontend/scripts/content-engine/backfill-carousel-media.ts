/**
 * Backfill `content_media` + `content_rendition_media` for the 30-day carousel run.
 *
 * WHY THIS EXISTS. Plan step 6.2 created the media tables and deliberately left them EMPTY, because
 * a backfill invented inside a migration is a guess. The `/ops/content` board then, correctly,
 * reported all 30 carousel renditions as "missing the media their channel requires" — which is true
 * of our records and false of the world: those posts carry eight media each, already re-hosted by
 * Metricool and ready to publish. **A board whose largest number is a bookkeeping artefact teaches
 * you to skim it**, and panel 01 is the one that must never be skimmed. So the records get fixed.
 *
 * THE SOURCE IS THE GENERATOR, NOT A GUESS. `carousel-prototype/schedule.js --json` is what actually
 * produced the thirty posts; it emits each post's `slug`, `close` and the ORDERED `mediaNames`.
 * `media-manifest.json` maps each logical name to its published URL, sha256 and byte count. Between
 * them there is nothing left to infer: which files, in what order, for which variant.
 *
 * IDEMPOTENT. Media is keyed on (asset_id, uri) and links on (rendition_id, media_id, role), so a
 * second run inserts nothing and reports zero changes rather than duplicating.
 *
 * Usage:
 *   npx tsx scripts/content-engine/backfill-carousel-media.ts --dry     (default: shows, writes nothing)
 *   npx tsx scripts/content-engine/backfill-carousel-media.ts --apply
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { loadEnvLocal } from './_shared'
import { createClient } from '@supabase/supabase-js'

const APPLY = process.argv.includes('--apply')

const PROTOTYPE = path.resolve(
  process.cwd(),
  '../../06_marketing/content/instagram/carousel-prototype',
)

interface GeneratedPost {
  day: number
  slug: string
  close: string
  format: string
  mediaNames: string[]
}

interface ManifestEntry { path: string; url: string; sha256: string; bytes: number }
type Manifest = Record<string, Record<string, ManifestEntry>>

/** `.mp4` is the only video in this set; everything else is a carousel still. */
function kindOf(name: string): 'image' | 'video' {
  return name.toLowerCase().endsWith('.mp4') ? 'video' : 'image'
}

async function main() {
  loadEnvLocal()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  const db = createClient(url, key, { auth: { persistSession: false } })

  // ── Read the two sources ──────────────────────────────────────────────────
  const schedulePath = path.join(PROTOTYPE, 'schedule.js')
  if (!fs.existsSync(schedulePath)) throw new Error(`generator not found at ${schedulePath}`)
  const posts: GeneratedPost[] = JSON.parse(
    execFileSync('node', [schedulePath, '--json'], { encoding: 'utf8', cwd: PROTOTYPE, maxBuffer: 32 * 1024 * 1024 }),
  )
  const manifest: Manifest = JSON.parse(
    fs.readFileSync(path.join(PROTOTYPE, 'media-manifest.json'), 'utf8'),
  )

  console.log(`generator: ${posts.length} posts`)
  console.log(`manifest : ${Object.keys(manifest).length} topics, ` +
    `${Object.values(manifest).reduce((n, t) => n + Object.keys(t).length, 0)} files`)

  // Every post must be eight media, or the source disagrees with the run and nothing should be
  // written off it. This is the generator's own invariant, re-asserted here rather than trusted.
  const wrong = posts.filter((p) => p.mediaNames.length !== 8)
  if (wrong.length) throw new Error(`${wrong.length} post(s) do not carry 8 media; refusing to backfill`)

  // ── Resolve renditions ────────────────────────────────────────────────────
  const { data: assets, error: aErr } = await db
    .from('content_assets').select('id,slug').like('slug', 'carousel-%')
  if (aErr) throw new Error(`content_assets read failed: ${aErr.message}`)
  const assetBySlug = new Map((assets ?? []).map((a) => [a.slug as string, a.id as string]))

  const { data: rends, error: rErr } = await db
    .from('content_renditions').select('id,asset_id,variant')
    .eq('platform', 'instagram').eq('format', 'carousel')
  if (rErr) throw new Error(`content_renditions read failed: ${rErr.message}`)
  const rendByAssetVariant = new Map(
    (rends ?? []).map((r) => [`${r.asset_id}::${r.variant}`, r.id as string]),
  )
  console.log(`database : ${assetBySlug.size} carousel assets, ${rendByAssetVariant.size} renditions\n`)

  // ── Plan the writes ───────────────────────────────────────────────────────
  interface PlannedLink { rendId: string; uri: string; position: number }
  const mediaWanted = new Map<string, { assetId: string; kind: string; uri: string; checksum: string; bytes: number }>()
  const links: PlannedLink[] = []
  const problems: string[] = []

  for (const p of posts) {
    const assetSlug = `carousel-${p.slug}`
    const assetId = assetBySlug.get(assetSlug)
    if (!assetId) { problems.push(`day ${p.day}: no content_assets row for "${assetSlug}"`); continue }
    const rendId = rendByAssetVariant.get(`${assetId}::${p.close}`)
    if (!rendId) { problems.push(`day ${p.day}: no rendition for ${assetSlug} variant ${p.close}`); continue }

    p.mediaNames.forEach((name, i) => {
      const entry = manifest[p.slug]?.[name]
      if (!entry) { problems.push(`day ${p.day}: ${p.slug}/${name} is not in the manifest`); return }
      mediaWanted.set(`${assetId}::${entry.url}`, {
        assetId, kind: kindOf(name), uri: entry.url, checksum: entry.sha256, bytes: entry.bytes,
      })
      links.push({ rendId, uri: entry.url, position: i + 1 })
    })
  }

  if (problems.length) {
    console.error('🔴 REFUSING TO WRITE. The sources do not agree with the database:')
    for (const p of problems.slice(0, 12)) console.error(`   ${p}`)
    if (problems.length > 12) console.error(`   ...and ${problems.length - 12} more`)
    process.exit(2)
  }

  console.log(`planned  : ${mediaWanted.size} distinct media rows, ${links.length} rendition links`)
  console.log(`           (${posts.length} posts x 8 = ${posts.length * 8} links expected)`)

  if (!APPLY) {
    console.log('\nDRY RUN. Nothing written. Re-run with --apply.')
    const sample = [...mediaWanted.values()].slice(0, 3)
    for (const m of sample) console.log(`   ${m.kind.padEnd(5)} ${m.uri.split('/').slice(-2).join('/')}  ${m.bytes}B`)
    return
  }

  // ── Write ─────────────────────────────────────────────────────────────────
  const mediaRows = [...mediaWanted.values()].map((m) => ({
    asset_id: m.assetId, kind: m.kind, aspect: m.kind === 'video' ? '4x5' : '4x5',
    uri: m.uri, origin: 'render', checksum: m.checksum, bytes: m.bytes,
    notes: 'backfilled 2026-08-16 from carousel-prototype/media-manifest.json + schedule.js --json',
  }))
  const { error: mErr } = await db
    .from('content_media').upsert(mediaRows, { onConflict: 'asset_id,uri', ignoreDuplicates: true })
  if (mErr) throw new Error(`content_media write failed: ${mErr.message}`)

  // Re-read to resolve ids, since upsert with ignoreDuplicates returns nothing for existing rows.
  const { data: allMedia, error: m2Err } = await db.from('content_media').select('id,asset_id,uri')
  if (m2Err) throw new Error(`content_media re-read failed: ${m2Err.message}`)
  const mediaId = new Map((allMedia ?? []).map((m) => [`${m.asset_id}::${m.uri}`, m.id as string]))

  const rendAsset = new Map((rends ?? []).map((r) => [r.id as string, r.asset_id as string]))
  const linkRows = links.map((l) => {
    const aId = rendAsset.get(l.rendId)!
    const mId = mediaId.get(`${aId}::${l.uri}`)
    if (!mId) throw new Error(`no media id resolved for ${l.uri}`)
    return { rendition_id: l.rendId, media_id: mId, role: 'body', position: l.position }
  })

  const { error: lErr } = await db
    .from('content_rendition_media')
    .upsert(linkRows, { onConflict: 'rendition_id,media_id,role', ignoreDuplicates: true })
  if (lErr) throw new Error(`content_rendition_media write failed: ${lErr.message}`)

  const [{ count: mediaCount }, { count: linkCount }] = await Promise.all([
    db.from('content_media').select('*', { count: 'exact', head: true }),
    db.from('content_rendition_media').select('*', { count: 'exact', head: true }),
  ])
  console.log(`\n✅ content_media: ${mediaCount} rows. content_rendition_media: ${linkCount} rows.`)
  console.log('   Re-run to confirm idempotence: the counts must not move.')
}

main().catch((e) => { console.error('🔴 FAILED:', (e as Error).message); process.exit(1) })
