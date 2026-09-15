#!/usr/bin/env tsx
/**
 * EVERY `/go/dNN` TILE RESOLVES TO ITS OWN DESTINATION, AND THAT DESTINATION IS
 * A REAL ROUTE.
 *
 *   npx tsx andro-prime/09_website-app/frontend/scripts/verify-bio-grid.ts
 *   npx tsx .../verify-bio-grid.ts --base http://localhost:3000   # also fetch them
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT AN HTTP CHECK BY DEFAULT.
 *
 * `/go/[slug]` is the permanent link behind each tile of the 30-day carousel
 * run. It is the one surface whose traffic arrives from Instagram's in-app
 * browser, so it is deliberately server-side: it records the click, then 307s to
 * that post's destination with attribution stamped on.
 *
 * 🔴 AN UNKNOWN SLUG DOES NOT 404. It redirects to `/test-selector` with
 * `utm_content=unknown` and `utm_term=unmatched`, on purpose — a bio-link tap
 * that dead-ends is a lost visitor, so the failure mode degrades to the default
 * rather than to nothing. That is the right product behaviour and it is also why
 * a broken tile is INVISIBLE from the outside: the visitor still lands
 * somewhere, the handler still returns 307, and the only trace is a utm value in
 * a row nobody reads. So the tile list has to be checked against the schedule
 * rather than by observing that the link "works".
 *
 * 🔴 AND THE HANDLER CANNOT BE DRIVEN OVER HTTP WITHOUT WRITING TO PRODUCTION.
 * `trackEvent` uses the service-role client, and this repo has no local
 * Supabase — `.env.local`'s project ref IS the live project. Curling the 30
 * tiles to "test" them writes 30 fake `bio_tile_click` rows into production
 * analytics and fires 30 GA4 events. The schedule is pure (`buildSchedule` takes
 * no arguments and reads no env), so importing it proves the same thing with no
 * side effect. `--base` exists for checking the DESTINATIONS, which are ordinary
 * marketing pages and safe to fetch; it never touches `/go` itself.
 *
 * WHAT IT ASSERTS
 *   1. The schedule is exactly RUN_LENGTH_DAYS entries.
 *   2. Every slug is `dNN`, zero-padded, distinct, and days run 1..N with no gaps.
 *   3. `findPost()` resolves EVERY slug — i.e. no tile silently takes the
 *      unknown-slug path.
 *   4. Every destination is a rooted path, and the (topic, close) rotation really
 *      does cover each pair exactly once, which is the property the whole
 *      10-x-3 coprime design claims.
 *   5. With `--base`, every distinct destination returns a non-error status.
 */

import { buildSchedule, findPost, RUN_LENGTH_DAYS } from '../lib/bio-grid'

let failures = 0
let passes = 0
function check(label: string, condition: boolean): void {
  if (condition) {
    passes += 1
  } else {
    failures += 1
    console.error(`  [FAIL] ${label}`)
  }
}

const baseArg = process.argv.indexOf('--base')
const BASE = baseArg > -1 ? process.argv[baseArg + 1] : null

async function main() {
  const schedule = buildSchedule()

  console.log(`\nBio-grid schedule — ${schedule.length} tiles\n`)

  // (1) size
  check(
    `schedule has RUN_LENGTH_DAYS (${RUN_LENGTH_DAYS}) entries, got ${schedule.length}`,
    schedule.length === RUN_LENGTH_DAYS,
  )

  // (2) slug shape, uniqueness, and contiguous days
  const slugs = schedule.map((p) => p.slug)
  check('every slug matches /^d\\d{2}$/', slugs.every((s) => /^d\d{2}$/.test(s)))
  check('all slugs distinct', new Set(slugs).size === slugs.length)
  const days = schedule.map((p) => p.day).sort((a, b) => a - b)
  check(
    'days are 1..N with no gaps',
    days.every((d, i) => d === i + 1),
  )

  // (3) THE ONE THAT MATTERS: no tile falls through to the unknown-slug default
  for (const post of schedule) {
    check(`findPost('${post.slug}') resolves (else the tile 307s to /test-selector as 'unknown')`,
      findPost(post.slug)?.slug === post.slug)
  }

  // (4) destinations are rooted paths, and the rotation covers every pair once
  check(
    'every destination is a rooted path',
    schedule.every((p) => typeof p.destination === 'string' && p.destination.startsWith('/')),
  )
  const pairs = schedule.map((p) => `${p.topic.slug}|${p.close}`)
  check(
    `every (topic, close) pair occurs exactly once — ${pairs.length} tiles, ${new Set(pairs).size} distinct pairs`,
    new Set(pairs).size === pairs.length,
  )

  // (5) optional: the destinations resolve. Safe — these are marketing pages.
  const destinations = [...new Set(schedule.map((p) => p.destination))].sort()
  console.log(`\n  ${destinations.length} distinct destinations:`)
  for (const d of destinations) console.log(`    ${d}`)

  if (BASE) {
    console.log(`\n  resolving destinations against ${BASE} …`)
    for (const d of destinations) {
      let status = 0
      try {
        const res = await fetch(new URL(d, BASE), { redirect: 'manual' })
        status = res.status
      } catch {
        status = 0
      }
      check(`${d} -> ${status || 'request failed'}`, status > 0 && status < 400)
    }
  } else {
    console.log('\n  (destinations not fetched — pass --base <url> to resolve them)')
  }

  console.log(`\nverify-bio-grid: ${passes} passed, ${failures} failed\n`)
  process.exit(failures > 0 ? 1 : 0)
}

main()
