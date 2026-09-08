#!/usr/bin/env node
/**
 * The committed route-conformance report must still describe this repo.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-route-conformance.js
 *
 * WHY THIS EXISTS. `design/route-conformance.md` is a generated count, and a
 * generated count that nothing checks is just a stale number with better
 * provenance. That is the failure it was built to end: STATE.md said "six
 * routes" long enough that the figure had to be re-measured from scratch, and
 * the answer was ten.
 *
 * Generating the report needs a browser and a dev server. This check needs
 * neither, so it can run in `npm test` on every change, which is the only place
 * staleness can actually be caught.
 *
 * WHAT IT CHECKS, and each is chosen to fire only when the report is genuinely
 * wrong rather than merely old:
 *
 *   1. THE ROUTE SET. Every `page.tsx` on disk appears in the report, and every
 *      route in the report still exists. Adding or deleting a route makes the
 *      report incomplete, which no amount of re-reading it would reveal.
 *
 *   2. WHICH SIDE OF THE LINE EACH ROUTE IS ON. The report records, per route,
 *      whether its source carried any Direction F marker at generation time: it
 *      composes the scaffold, or it writes `f-` classes. If that BOOLEAN has
 *      flipped, a route has crossed into or out of Direction F and the count is
 *      wrong. The boolean rather than the class count is deliberate: adding a
 *      section to a rebuilt page changes the count and changes nothing about the
 *      answer, and a check that cries wolf on ordinary work gets switched off.
 *
 * WHAT IT DELIBERATELY DOES NOT CHECK. Whether the rendered class counts are
 * still accurate. That needs a browser, and a stale number in a column is a
 * smaller problem than a stale verdict; `npm run route-conformance` refreshes
 * both.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'app')
const REPORT = path.resolve(ROOT, '..', 'design', 'route-conformance.json')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

if (!fs.existsSync(REPORT)) {
  die(`missing ${path.relative(ROOT, REPORT).split(path.sep).join('/')}. Run \`npm run route-conformance\` with a dev server up.`)
}
const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'))
if (!Array.isArray(report.rows) || !report.rows.length) die('the report has no rows. Regenerate it rather than trusting a pass.')

/* ---------- the routes on disk ---------- */

function routes(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (!e.name.startsWith('_') && e.name !== 'api') routes(p, acc) }
    else if (e.name === 'page.tsx') {
      const rel = path.relative(APP, path.dirname(p)).split(path.sep).filter(Boolean)
      const url = '/' + rel.filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/')
      acc.push(url === '/' ? '/' : url.replace(/\/$/, ''))
    }
  }
  return acc
}
const onDisk = new Set(routes(APP))
if (onDisk.size < 20) die(`found only ${onDisk.size} routes under app/. Fix this collector rather than trusting a pass.`)

// Surfaces the report measures that have no page.tsx to find.
for (const r of report.rows) if (r.file && r.file.endsWith('not-found.tsx')) onDisk.add(r.url)

const inReport = new Set([...report.rows.map((r) => r.url), ...Object.keys(report.excluded || {})])

let pass = 0
let fail = 0
const t = (d, ok, detail) => {
  if (ok) { pass++; console.log(`  ok   ${d}`) }
  else { fail++; console.log(`  FAIL ${d}${detail ? `\n       ${detail}` : ''}`) }
}

console.log(`Route conformance report: still describes this repo\n`)
console.log(`  report generated ${report.generated}, ${report.rows.length} routes measured`)
console.log(`  ${onDisk.size} routes on disk\n`)

const missing = [...onDisk].filter((u) => !inReport.has(u)).sort()
const gone = [...inReport].filter((u) => !onDisk.has(u)).sort()
t(`every route on disk is in the report`, missing.length === 0,
  `${missing.join(', ')}\n       a new route was added; run \`npm run route-conformance\` with a dev server up`)
t(`every route in the report still exists`, gone.length === 0,
  `${gone.join(', ')}\n       a route was deleted or moved; regenerate the report`)

/* ---------- which side of the line ---------- */

const hasMarkers = (file) => {
  const p = path.join(ROOT, file)
  if (!fs.existsSync(p)) return null
  const src = fs.readFileSync(p, 'utf8')
  return /from '@\/components\/marketing\/FPage'/.test(src) ||
    /(?<![A-Za-z0-9_-])(?:f|fb)-[a-z][a-z0-9-]*(?![A-Za-z0-9_-])/.test(src)
}

const crossed = []
for (const r of report.rows) {
  if (!r.source) continue
  const then = !!(r.source.scaffold || r.source.classes > 0)
  const now = hasMarkers(r.file)
  if (now === null) continue // the route-set check above already reports this
  if (then !== now) crossed.push(`${r.url}: source ${then ? 'had' : 'had no'} F markers when measured, ${now ? 'now has them' : 'now has none'} (report says "${r.verdict}")`)
}
t(`no route has crossed into or out of Direction F since ${report.generated}`, crossed.length === 0,
  `${crossed.join('\n       ')}\n       the count in the report is out of date; run \`npm run route-conformance\``)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
