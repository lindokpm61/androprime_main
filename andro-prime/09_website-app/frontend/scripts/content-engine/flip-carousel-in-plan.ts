/**
 * Flip `content_channels.instagram/carousel.in_plan` to true, once the run has PROVED it publishes.
 *
 * WHY THIS IS NOT A ONE-LINE UPDATE. `in_plan` is the coverage DENOMINATOR. Flipping it takes the
 * grid from 18 x 9 = 162 slots to 18 x 10 = 180, which moves every coverage percentage in the
 * business at once. It also brings the lane under doctor invariant I10, since the carousel is
 * `lane-1`: from that moment an empty carousel week is a reported coverage failure rather than an
 * invisible one. Both are wanted; neither should happen by accident.
 *
 * 🔴 THE GUARD THAT MATTERS: this REFUSES to flip while `route_verified_at` is null.
 *
 * `in_plan` means "a lane we intend to cover systematically". Committing the denominator to a route
 * that has never successfully published anything is exactly the error `route_verified_at` exists to
 * prevent: treating "connected" as evidence. As of 2026-08-16 the carousel route had thirty posts
 * scheduled, eight media each, and had never published once. Day 1 (2026-08-17 13:00 London) is what
 * answers it. If Instagram rejects the carousel, the lane is not viable and the denominator must not
 * have moved for it.
 *
 * `route_verified_at` is set by step 6.1's rule: a rendition that actually reached `published` with a
 * real external_url. So the guard is not a date check, it is "has this route carried a real post".
 * Re-run the 6.1 route-verification update, or let the write-back job record the publish, first.
 *
 * Usage:
 *   npx tsx scripts/content-engine/flip-carousel-in-plan.ts            (dry: shows the effect)
 *   npx tsx scripts/content-engine/flip-carousel-in-plan.ts --apply
 *   npx tsx scripts/content-engine/flip-carousel-in-plan.ts --apply --force-unproven
 *        ^ only with a written reason. It defeats the one guard this script has.
 */
import { loadEnvLocal } from './_shared'
import { createClient } from '@supabase/supabase-js'

const APPLY = process.argv.includes('--apply')
const FORCE = process.argv.includes('--force-unproven')

async function main() {
  loadEnvLocal()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  const db = createClient(url, key, { auth: { persistSession: false } })

  const { data: ch, error: cErr } = await db
    .from('content_channels')
    .select('platform,format,in_plan,lane,route_verified_at,route_verified_evidence')
    .eq('platform', 'instagram').eq('format', 'carousel').single()
  if (cErr) throw new Error(`could not read the channel row: ${cErr.message}`)

  console.log('instagram/carousel')
  console.log(`  lane              : ${ch.lane}`)
  console.log(`  in_plan           : ${ch.in_plan}`)
  console.log(`  route_verified_at : ${ch.route_verified_at ?? 'NEVER — this route has not published'}`)
  if (ch.route_verified_evidence) console.log(`  evidence          : ${ch.route_verified_evidence}`)

  if (ch.in_plan) {
    console.log('\nAlready in plan. Nothing to do.')
    return
  }

  // The denominator, before and after, computed rather than quoted.
  const [{ count: articles }, { count: planned }] = await Promise.all([
    db.from('blog_articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    db.from('content_channels').select('*', { count: 'exact', head: true }).eq('in_plan', true),
  ])
  const before = (articles ?? 0) * (planned ?? 0)
  const after = (articles ?? 0) * ((planned ?? 0) + 1)
  console.log(`\nDenominator: ${articles} published articles x ${planned} planned channels = ${before} slots`)
  console.log(`             flipping makes it x ${(planned ?? 0) + 1} = ${after} slots (+${after - before})`)
  console.log('Every coverage percentage in the doc layer moves by this, and I10 starts watching the lane.')

  if (!ch.route_verified_at && !FORCE) {
    console.error('\n🔴 REFUSING. This route has never carried a real post.')
    console.error('   in_plan means "a lane we cover systematically". Committing the denominator to')
    console.error('   an unproven route is treating "connected" as evidence, which is the exact')
    console.error('   mistake route_verified_at exists to catch.')
    console.error('   Wait for day 1 to publish, confirm it on the account, then re-run.')
    process.exit(2)
  }
  if (!ch.route_verified_at && FORCE) {
    console.warn('\n⚠️  --force-unproven: flipping an UNPROVEN route. Record why in 06_marketing/STATE.md.')
  }

  if (!APPLY) {
    console.log('\nDRY RUN. Nothing written. Re-run with --apply.')
    console.log('AFTER APPLYING, in the same session:')
    console.log('  1. npx tsx scripts/content-engine/content-doctor.ts   (I7 will fail until step 2)')
    console.log('  2. update the topmost dated section of 06_marketing/content-machine/STATE.md')
    console.log(`     to the new counts: ${after} slots, and re-read filled/backlog from the doctor.`)
    console.log('  3. only that ONE section: I7 asserts on the newest dated section, older ones are history.')
    return
  }

  const { error: uErr } = await db
    .from('content_channels')
    .update({ in_plan: true, updated_at: new Date().toISOString() })
    .eq('platform', 'instagram').eq('format', 'carousel')
  if (uErr) throw new Error(`update failed: ${uErr.message}`)

  console.log(`\n✅ instagram/carousel is now in plan. Grid ${before} -> ${after} slots.`)
  console.log('🔴 I7 WILL NOW FAIL until the topmost dated STATE section quotes the new counts.')
  console.log('   That failure is correct: the docs assert a denominator that just changed.')
  console.log('   Run content-doctor, then fix that ONE section with the numbers it reports.')
}

main().catch((e) => { console.error('🔴 FAILED:', (e as Error).message); process.exit(1) })
