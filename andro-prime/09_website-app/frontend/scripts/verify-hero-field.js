#!/usr/bin/env node
/**
 * The hero field's geometry must equal the readout's.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-hero-field.js
 *
 * WHY THIS EXISTS. The only thing that makes the hero field defensible is the
 * claim that every band it draws is a real percentage from
 * `04_products/results-engine/thresholds.md`. The field is deliberately
 * illegible, so if its numbers drift from the readout's the rendered page looks
 * exactly the same and the claim quietly stops being true. There is no visual
 * regression to catch it and no test that would fail. A duplicated fact is
 * invisible precisely while the copies agree, which is why the check has to be
 * mechanical rather than a comment asking the next person to be careful.
 *
 * It compares the four markers that appear in BOTH places. hs-CRP and SHBG are
 * in the field only, so nothing here can check them; that asymmetry is recorded
 * in `lib/home/fieldRows.ts` and is part of the open compliance question.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const PAGE = path.join(ROOT, 'app', '(marketing)', 'page.tsx')
const ROWS = path.join(ROOT, 'lib', 'home', 'fieldRows.ts')

let pass = 0
let fail = 0
const t = (d, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok) { pass++; console.log(`  ok   ${d}`) }
  else { fail++; console.log(`  FAIL ${d}\n       readout: ${JSON.stringify(want)}\n       field:   ${JSON.stringify(got)}`) }
}

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

for (const f of [PAGE, ROWS]) if (!fs.existsSync(f)) die(`missing ${f}`)

// The readout's rows, from the page's own literal.
const page = fs.readFileSync(PAGE, 'utf8').replace(/\r\n/g, '\n')
const readout = {}
const RE_ROW =
  /name:\s*'([^']+)'[^}]*?labLeft:\s*([\d.]+),\s*labWidth:\s*([\d.]+),\s*oursLeft:\s*([\d.]+),\s*oursWidth:\s*([\d.]+),\s*you:\s*([\d.]+)/g
for (const m of page.matchAll(RE_ROW)) {
  readout[m[1]] = { lab: [+m[2], +m[3]], ours: [+m[4], +m[5]], you: +m[6] }
}
if (!Object.keys(readout).length) {
  die(`parsed no readout rows out of ${PAGE}. The literal's shape changed; fix this parser rather than trusting a pass.`)
}

// The field's rows.
const src = fs.readFileSync(ROWS, 'utf8').replace(/\r\n/g, '\n')
const field = {}
const RE_FIELD =
  /marker:\s*'([^']+)',\s*lab:\s*\[([\d.]+),\s*([\d.]+)\],\s*ours:\s*\[([\d.]+),\s*([\d.]+)\],\s*you:\s*([\d.]+),\s*onReadout:\s*(true|false)/g
for (const m of src.matchAll(RE_FIELD)) {
  field[m[1]] = { lab: [+m[2], +m[3]], ours: [+m[4], +m[5]], you: +m[6], onReadout: m[7] === 'true' }
}
if (!Object.keys(field).length) {
  die(`parsed no field rows out of ${ROWS}. Fix this parser rather than trusting a pass.`)
}

console.log('Hero field geometry against the homepage readout\n')
console.log(`  readout markers: ${Object.keys(readout).join(', ')}`)
console.log(`  field markers:   ${Object.keys(field).join(', ')}\n`)

const shared = Object.entries(field).filter(([, v]) => v.onReadout)
t('every marker flagged onReadout is actually on the readout',
  shared.filter(([k]) => !readout[k]).map(([k]) => k), [])

// The count is asserted so that silently dropping a row from either side, which
// would make every remaining comparison pass, cannot read as success.
t('all four shared markers are compared', shared.length, 4)

for (const [name, v] of shared) {
  const r = readout[name]
  if (!r) continue
  t(`${name}: lab band`, v.lab, r.lab)
  t(`${name}: ours band`, v.ours, r.ours)
  t(`${name}: value position`, v.you, r.you)
}

const fieldOnly = Object.entries(field).filter(([, v]) => !v.onReadout).map(([k]) => k)
console.log(`\n  field-only markers (uncheckable here, part of the open CA-045 question): ${fieldOnly.join(', ') || 'none'}`)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail > 0 ? 1 : 0)
