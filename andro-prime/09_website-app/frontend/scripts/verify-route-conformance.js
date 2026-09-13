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
 *   3. THAT EVERY EXCLUSION STILL EARNS ITS PLACE (added 2026-09-14, defect R1).
 *      The counted rows are re-measured every run and cannot go stale. The
 *      EXCLUDED rows carried prose nothing re-tested, and one of them hid a
 *      customer-facing page for six batches: `/go` was excluded as "internal
 *      redirect, no UI", which is a correct description of `/go/[slug]` and not
 *      of `/go`, the link-in-bio grid. Each exclusion now names a fact in the
 *      route's own source, and that fact is checked here — on every change,
 *      rather than only when somebody runs the browser sweep. The table lives in
 *      `scripts/route-exclusions.js` and is shared with the reporter, so the two
 *      cannot disagree about which routes are excluded or why.
 *
 * WHAT IT DELIBERATELY DOES NOT CHECK. Whether the rendered class counts are
 * still accurate. That needs a browser, and a stale number in a column is a
 * smaller problem than a stale verdict; `npm run route-conformance` refreshes
 * both.
 *
 * AND IT DOES NOT FAIL ON THE AGE OF A REVIEW, which is a deliberate limit
 * rather than an omission. `evidence` asks whether the stated fact is still
 * true; `reviewed` asks whether that fact still JUSTIFIES the exclusion, which
 * no grep can answer. There is no principled number of days at which a reason
 * expires, so the ages are printed and never gate. See the header of
 * `scripts/route-exclusions.js`.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { judgeExclusions, reviewAgeDays, reviewAgePhrase } = require('./route-exclusions')

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

/* ---------- 3. the exclusions still earn their place (R1) ---------- */

/* The counted rows above are re-measured on every run and cannot go stale. The
   EXCLUDED rows carried prose that nothing re-tested, and one of them hid a
   customer-facing page for six batches: `/go` was excluded as "internal
   redirect, no UI", which describes `/go/[slug]` and not `/go`.

   So each exclusion now names a fact in the route's own source, and that fact is
   checked HERE rather than only in the browser sweep — the sweep needs a dev
   server and runs when somebody remembers, while this runs in `npm test` on
   every change. An exclusion that has stopped being true is a route silently not
   being measured, which is exactly the defect. */
const fileByUrl = new Map()
const collect = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (!e.name.startsWith('_') && e.name !== 'api') collect(p) }
    else if (e.name === 'page.tsx') {
      const rel = path.relative(APP, path.dirname(p)).split(path.sep).filter(Boolean)
      const url = '/' + rel.filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/')
      fileByUrl.set(url === '/' ? '/' : url.replace(/\/$/, ''), path.relative(ROOT, p).split(path.sep).join('/'))
    }
  }
}
collect(APP)

const verdicts = judgeExclusions(
  (url) => fileByUrl.get(url) || null,
  (file) => { try { return fs.readFileSync(path.join(ROOT, file), 'utf8') } catch { return null } },
)
const broken = verdicts.filter((v) => !v.ok)
t(`every excluded route still earns its exclusion (${verdicts.length} checked)`, broken.length === 0,
  `${broken.map((v) => `${v.url}: ${v.problems.join('; ')}`).join('\n       ')}\n       either the route changed and belongs in the count, or the reason needs rewriting.\n       Do NOT widen the evidence to make this pass: that is how /go stayed excluded for six batches.`)

/* THE TABLE AND THE REPORT MUST NAME THE SAME ROUTES. Without this, adding an
   exclusion in code and forgetting the browser sweep leaves a route that is
   neither measured nor listed — invisible from both sides at once. */
const inCode = new Set(verdicts.map((v) => v.url))
const inFile = new Set(Object.keys(report.excluded || {}))
const drift = [...new Set([...inCode, ...inFile])].filter((u) => inCode.has(u) !== inFile.has(u)).sort()
t(`the committed report lists the same exclusions the code declares`, drift.length === 0,
  `${drift.join(', ')}\n       run \`npm run route-conformance\` so the report catches up`)

/* AGE IS REPORTED, NEVER FATAL — see the header of scripts/route-exclusions.js.
   The control is the evidence check above; this is what makes the half no grep
   can answer visible, rather than a second gate that would get switched off. */
const ages = verdicts
  .map((v) => ({ url: v.url, days: reviewAgeDays(v.reviewed), phrase: reviewAgePhrase(v.reviewed) }))
  .sort((a, b) => (b.days ?? Infinity) - (a.days ?? Infinity))
if (ages.length) {
  console.log(`\n  exclusion reasons, oldest review first (reported, not a gate):`)
  for (const a of ages) console.log(`    ${a.url.padEnd(24)} ${a.phrase.replace(/\*\*/g, '')}`)
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
