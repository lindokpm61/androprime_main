#!/usr/bin/env node
/**
 * The two-kit bundles are retired. This asserts they stay that way.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-bundles-dark.js
 *
 * ── WHY IT EXISTS ─────────────────────────────────────────────────────────
 * Keith retired the bundle offer on 2026-09-17, in two steps. Prove-It (£199)
 * and Full-picture (£259) go because the membership's included retest already
 * gives a man the day-90 retest they sell, so charging £80 for it is not
 * redundancy, it is selling him something he owns. The Recheck (£169) followed
 * on the same day: *"at this stage, I don't really think we need it. The only
 * thing that we need to be sure is that the bundle enabled flag stays at false."*
 *
 * Decision: `01_strategy/2026-09-17-a-low-result-starts-no-membership.md` §4.
 *
 * 🔴 THIS FILE EXISTS BECAUSE "STAYS AT FALSE" WAS A CONVENTION AND NOT A
 * CONTROL. At the moment the decision was taken, `BUNDLES_ENABLED` was false by
 * ABSENCE — no line in `.env.local`, a blank in `.env.example`, and not one
 * check anywhere in `scripts/` asserting anything about it. The single thing the
 * ruling asked to be sure of was the one thing nothing was watching. A rule that
 * matters and has no guard is a promise, and this repo has spent a lot of this
 * month's sessions relearning that.
 *
 * ── IT CHECKS TWO THINGS, AND THE SECOND IS THE ONE PEOPLE FORGET ─────────
 * 1. The flag is not on.
 * 2. **Every surface that can render a bundle still asks the flag.** A flag only
 *    protects what checks it, so "keep it false" quietly stops being true the
 *    moment someone simplifies a ternary away. The three kit pages each hold a
 *    `bundlesEnabled ? … : …` around both a hero CTA and a close block; if that
 *    conditional goes, the offer renders whatever the env says.
 *
 * ⚠ WHAT IT DOES NOT DO. It does not delete anything. The bundle code is
 * dormant, not dangerous, and the decision explicitly left it in place: the
 * flag-off layout on each kit page is a complete alternative that already ships,
 * so there is no half-state to clean up. This check is what makes leaving it
 * safe.
 *
 * ⚠ AND IT CANNOT SEE THE TERMS. `/terms` renders `canonical-site/terms/index.html`
 * at runtime and neither the route nor `lib/legal/canonical.ts` consults this
 * flag, so the "Test Bundles (Two-Kit Purchases)" section serves on BOTH sites
 * today with the flag off, describing a purchase nobody can make. That is a copy
 * change owed to the membership terms sync (go-live P1/P2), not something a flag
 * can gate, and it is named here so the gap is visible from the guard rather
 * than only from the decision doc.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
require('dotenv').config({ path: path.join(ROOT, '.env.local') })

const read = (p) => fs.readFileSync(p, 'utf8')

/* Each surface that can put a bundle in front of a customer, and the token that
   proves it still asks first. Named individually rather than counted, so a
   failure says WHICH page stopped gating. */
const GATED_SURFACES = [
  'app/(marketing)/kits/testosterone/page.tsx',
  'app/(marketing)/kits/energy-recovery/page.tsx',
  'app/(marketing)/kits/hormone-recovery/page.tsx',
]

const problems = []

console.log('\nBundles are retired. Checking they stay dark.\n')

// ── 1. the flag itself ─────────────────────────────────────────────────────
const raw = process.env.BUNDLES_ENABLED
const flagOn = raw === 'true'
if (flagOn) {
  problems.push(
    'BUNDLES_ENABLED is "true". The two-kit bundles were retired on 2026-09-17 ' +
      '(01_strategy/2026-09-17-a-low-result-starts-no-membership.md §4). Turning this ' +
      'on puts a £199 Prove-It offer back on /kits/energy-recovery as the PRIMARY call ' +
      'to action, selling a day-90 retest the membership already includes.',
  )
} else {
  console.log(`  ok   BUNDLES_ENABLED is ${raw === undefined ? 'unset' : `"${raw}"`}, so no bundle can be bought.`)
}

// ── 2. the surfaces still ask ──────────────────────────────────────────────
for (const rel of GATED_SURFACES) {
  const p = path.join(ROOT, rel)
  if (!fs.existsSync(p)) {
    // Deleting the page is not this check's business; failing loudly on a path
    // that moved is, because a silently-skipped surface is the whole defect.
    problems.push(`${rel} is missing. If it moved, update GATED_SURFACES here in the same change.`)
    continue
  }
  const src = read(p)
  const asks = src.includes('isBundlesEnabled()')
  const renders = src.includes('BundleChoice')
  if (renders && !asks) {
    problems.push(
      `${rel} renders BundleChoice and no longer calls isBundlesEnabled(). ` +
        'The flag only protects what checks it.',
    )
  } else if (renders) {
    console.log(`  ok   ${rel} still gates its bundle on the flag.`)
  } else {
    console.log(`  ok   ${rel} renders no bundle at all.`)
  }
}

// ── 3. a fresh environment starts dark ─────────────────────────────────────
const examplePath = path.join(ROOT, '.env.example')
if (fs.existsSync(examplePath)) {
  const line = read(examplePath)
    .split('\n')
    .find((l) => l.trim().startsWith('BUNDLES_ENABLED'))
  if (line && line.split('=')[1].trim() !== '') {
    problems.push(`.env.example sets ${line.trim()}. A copied environment must start dark.`)
  } else {
    console.log('  ok   .env.example leaves it blank, so a copied environment starts dark.')
  }
}

console.log('')

if (problems.length) {
  console.error('  FAIL the bundles are not dark.\n')
  for (const p of problems) console.error(`    ${p}\n`)
  console.error(
    '       Retired 2026-09-17. Prove-It and Full-picture sell a retest the membership\n' +
      '       includes; the Recheck was dropped with them. Re-opening any of it is a\n' +
      '       Keith decision, and the Recheck also needs the fast-recheck rule read\n' +
      '       first (04_products/results-engine/2026-09-07-fast-recheck-must-be-prepaid-\n' +
      '       or-included.md): a result-triggered recheck under 90 days may never\n' +
      '       trigger a new sale, so prepaid is the only door it ever fitted through.\n',
  )
  process.exit(1)
}

console.log('  ok   bundles are dark and every surface still asks.\n')
console.log('       ⚠ NOT covered: the live /terms still carries the Test Bundles section')
console.log('         on both sites. No flag gates it; it is owed to the membership terms')
console.log('         sync (go-live P1/P2).\n')
process.exit(0)
