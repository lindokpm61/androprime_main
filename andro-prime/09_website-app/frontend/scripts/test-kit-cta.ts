/**
 * Guards the central CTA routing map (lib/content/kitCTA.ts).
 *
 * The map exists so a pillar can be redirected in one place when a product launches.
 * These tests fail loudly if it drifts from the routes that actually exist, from the
 * kit slugs in lib/pricing.ts, or from the compliance invariants.
 *
 * Run: npx tsx scripts/test-kit-cta.ts   (also part of `npm test`)
 */

import { KIT_CTA, PillarId, resolveKitCTA, isEmailCapture } from '../lib/content/kitCTA'
import { PRICING } from '../lib/pricing'

let failures = 0

function check(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failures++
    console.error(`  ✗ ${name}\n      ${(err as Error).message}`)
  }
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg)
}

// Routes that exist today. Cross-check against 09_website-app/CONTEXT.md "Route Map".
// A CTA must never point at /lp/* (noindex) or at the founding-member list.
const LIVE_ROUTES = new Set([
  '/kits/testosterone',
  '/kits/energy-recovery',
  '/kits/hormone-recovery',
  '/waitlist',
  '/test-selector',
])

const pillars = Object.keys(KIT_CTA) as PillarId[]

console.log('\nkitCTA routing map\n')

check('every pillar points at a route that exists', () => {
  for (const p of pillars) {
    assert(LIVE_ROUTES.has(KIT_CTA[p].href), `pillar ${p} -> ${KIT_CTA[p].href} is not a live route`)
  }
})

check('no CTA points at a noindex /lp/* page', () => {
  for (const p of pillars) {
    assert(!KIT_CTA[p].href.startsWith('/lp/'), `pillar ${p} points at a noindex LP`)
  }
})

check('no CTA points at the founding-member list', () => {
  for (const p of pillars) {
    const href = KIT_CTA[p].href.toLowerCase()
    assert(!href.includes('founding'), `pillar ${p} routes to the FM list, which is banned in content`)
  }
})

check('every kit-backed pillar resolves to a real kit slug', () => {
  for (const p of pillars) {
    const { kit, href } = KIT_CTA[p]
    if (!kit) continue
    const slug = PRICING[kit].slug
    assert(href === `/kits/${slug}`, `pillar ${p} href ${href} does not match ${kit} slug "${slug}"`)
  }
})

check('pillars with no live product hold at email capture', () => {
  for (const p of ['metabolic', 'liver', 'thyroid'] as PillarId[]) {
    assert(isEmailCapture(p), `pillar ${p} should hold at email capture until its kit launches`)
    assert(KIT_CTA[p].redirectWhenLive, `pillar ${p} must document where it redirects when live`)
  }
})

check('Pillar E is gated and refuses to resolve', () => {
  let threw = false
  try {
    resolveKitCTA('E')
  } catch {
    threw = true
  }
  assert(threw, 'Pillar E (andropause) resolved instead of throwing. It is Ewa-gated.')
})

check('an unknown pillar throws rather than silently returning undefined', () => {
  let threw = false
  try {
    resolveKitCTA('Z' as PillarId)
  } catch {
    threw = true
  }
  assert(threw, 'unknown pillar did not throw')
})

check('every non-gated pillar resolves to a usable target', () => {
  for (const p of pillars) {
    if (KIT_CTA[p].gated) continue
    const t = resolveKitCTA(p)
    assert(t.href && t.label, `pillar ${p} resolved without an href or label`)
  }
})

console.log(
  failures === 0
    ? `\n🟢 kitCTA: ${pillars.length} pillars checked, all clean.\n`
    : `\n🔴 kitCTA: ${failures} failure(s).\n`,
)

process.exit(failures === 0 ? 0 : 1)
