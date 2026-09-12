#!/usr/bin/env node
/**
 * Every date a customer reads is formatted in one module, in one timezone.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-date-format.js
 *
 * WHY THIS EXISTS. Eight files had each written their own four-line
 * `formatDate`, and a ninth copy sat inside a file that already had one. None of
 * them was wrong on its own; the damage was that none of them set `timeZone`, so
 * every one formatted in whatever zone the runtime happened to be in — UTC in
 * the production container, Europe/London on the machine where the page was
 * checked. The same order therefore rendered a different day in the two places,
 * for any timestamp in the hour before midnight BST.
 *
 * That is the class of defect a reviewer cannot catch, because both readings
 * look correct to whoever is looking at one of them. It was also recorded in
 * STATE.md as an outstanding item ("the third copy of formatDate") for three
 * batches, during which the count quietly went from three to eight: a note
 * asking the next person to be careful is not a control, and the tenth copy
 * would have been written by someone who never read it.
 *
 * So this check enforces the two things that matter, and nothing else:
 *
 *   1. No date formatting outside `lib/date/format.ts`.
 *   2. That module sets an explicit `timeZone`. Without this the module could
 *      lose the one line the whole exercise was for, every duplicate would still
 *      be gone, and the check would still be green.
 *
 * ⚠ SCOPE IS THE THREE SOURCE TREES, NOT `scripts/`. The content-engine scripts
 * use `Intl.DateTimeFormat().formatToParts` to build a scheduling field for an
 * external API. That is a machine payload in a fixed zone, not a sentence
 * anybody reads, and it needs the parts rather than the string.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TREES = ['app', 'components', 'lib']
const MODULE_REL = path.join('lib', 'date', 'format.ts')

/* `toLocaleString` is deliberately absent: it is the number formatter as well as
   a date one, and prices are formatted all over the codebase. Dates go through
   the two Locale*String forms and the Intl constructor, which is all three. */
const BANNED = [
  { re: /\.toLocaleDateString\s*\(/g, name: 'toLocaleDateString' },
  { re: /\.toLocaleTimeString\s*\(/g, name: 'toLocaleTimeString' },
  { re: /new\s+Intl\.DateTimeFormat\s*\(/g, name: 'Intl.DateTimeFormat' },
]

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, out)
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

/* The module is the exemption, so it has to exist and it has to still carry the
   policy. A guard whose exempted file can quietly stop doing the thing is a
   guard for the wrong invariant. */
const modulePath = path.join(ROOT, MODULE_REL)
if (!fs.existsSync(modulePath)) {
  die(`${MODULE_REL} is missing. Every date in the app was folded into it; ` +
      `if it has moved, move this check's MODULE_REL with it.`)
}
const moduleSrc = fs.readFileSync(modulePath, 'utf8')
if (!/timeZone:\s*TIME_ZONE/.test(moduleSrc) || !/const TIME_ZONE = '[^']+'/.test(moduleSrc)) {
  die(`${MODULE_REL} no longer sets an explicit timeZone on every format. ` +
      `Without it each date reverts to the zone the runtime happens to be in, ` +
      `which is UTC in production and Europe/London in development — the exact ` +
      `defect this module was written to end.`)
}
const zone = /const TIME_ZONE = '([^']+)'/.exec(moduleSrc)[1]

const offenders = []
for (const tree of TREES) {
  const dir = path.join(ROOT, tree)
  if (!fs.existsSync(dir)) continue
  for (const file of walk(dir, [])) {
    const rel = path.relative(ROOT, file)
    if (rel === MODULE_REL) continue
    const src = fs.readFileSync(file, 'utf8')
    for (const { re, name } of BANNED) {
      re.lastIndex = 0
      let m
      while ((m = re.exec(src)) !== null) {
        const line = src.slice(0, m.index).split('\n').length
        offenders.push(`${rel.replace(/\\/g, '/')}:${line}  ${name}`)
      }
    }
  }
}

if (offenders.length) {
  console.error(
    `\nERROR: ${offenders.length} date format${offenders.length === 1 ? '' : 's'} ` +
    `outside lib/date/format.ts:\n`,
  )
  for (const o of offenders) console.error(`  ${o}`)
  console.error(
    `\nImport formatLongDate / formatMediumDate / formatShortDate / ` +
    `formatLongDateNoYear / formatWeekdayDate from '@/lib/date/format' instead. ` +
    `If the screen genuinely needs a format none of those produce, add it THERE ` +
    `with the sentence saying what it is for — one more local copy is how the ` +
    `last eight happened.\n`,
  )
  process.exit(1)
}

console.log(`  OK   every date formats in lib/date/format.ts, timeZone ${zone}`)
console.log(`\n${TREES.length} trees clean, 0 stray formatters\n`)
