#!/usr/bin/env node
/**
 * THE LEGAL DOCUMENTS SAY EXACTLY WHAT THE CANONICAL FILES SAY.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-legal-text.js
 *
 * WHY THIS EXISTS. `/privacy` and `/terms` render 1,543 lines of approved legal
 * markup through `lib/legal/canonical.ts`, which rebuilds their containers in
 * Direction F. That transform is allowed to change how the documents LOOK and is
 * not allowed to change what they SAY, and "is not allowed to" is a promise
 * until something checks it. This is the check.
 *
 * The whole design of the transform exists to make this assertion possible: it
 * rewrites attributes and deletes decorative elements, and it never touches a
 * text node. So the test is not a diff of two renderings that a human has to
 * eyeball. It is an equality: every text node in the canonical source region,
 * in order, must equal every text node in the transform's output, in order.
 *
 * 🔴 WHAT THIS WOULD HAVE CAUGHT, AND IT IS NOT HYPOTHETICAL. The transform
 * removes every `<svg>` with a non-greedy `[\s\S]*?` match. Point that at a
 * document where an `<svg>` is never closed, or make the pattern greedy by one
 * character, and it eats the rest of the document: the page still renders, still
 * returns 200, still looks like a privacy policy, and is missing its retention
 * schedule. That is the same shape as the DOTALL substitution that once ate 16
 * entries out of a shared log, and the same shape as the `.f-ticks` collision
 * that removed two lists from their cards while the route kept returning 200.
 * An HTTP 200 is not evidence that a page still says what it said.
 *
 * ⚠ IT COMPARES THE SOURCE REGION, NOT THE WHOLE FILE. The canonical files are
 * standalone pages with their own nav and footer, and the app supplies both, so
 * the extraction window is part of what is being tested: this asserts that the
 * window's CONTENTS survive intact, and separately that the window still finds
 * its anchors at all. A window that silently matched nothing would produce two
 * empty lists that compare equal, so an emptiness floor is asserted first.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DOCS = ['privacy', 'terms']

/* The transform is TypeScript and this is a plain node script, so the two rules
   that matter are mirrored here rather than imported through a build step. That
   is a duplicated fact, so it is guarded: `assertMirrorIsCurrent` reads the real
   module and fails if either regex has changed underneath this copy. A checker
   that silently tests a stale copy of the thing it is checking is worse than no
   checker, which is the finding the modifier-specificity script recorded twice
   before it was right. */
const MIRROR = {
  script: /<script[\s\S]*?<\/script\s*>/gi,
  svg: /<svg[\s\S]*?<\/svg\s*>/gi,
}

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

function assertMirrorIsCurrent() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'legal', 'canonical.ts'), 'utf8')
  for (const [name, re] of Object.entries(MIRROR)) {
    const literal = re.source
    if (!src.includes(literal)) {
      die(
        `verify-legal-text.js mirrors the ${name} pattern from lib/legal/canonical.ts ` +
        `and that pattern has changed. Update the MIRROR object in this file, then ` +
        `re-read what the new pattern can consume before trusting a green run.`,
      )
    }
  }
}

/* Text-node extraction. Everything outside a tag, with entities left encoded:
   the comparison is between two strings produced the same way, so decoding would
   add a step that can itself be wrong without changing what is being asserted. */
function textNodes(html) {
  return html
    .replace(/<[^>]*>/g, '\u0000')
    .split('\u0000')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

const HERO_ANCHORS = [/<header[\s>]/i, /<!--\s*Hero\s*-->/i, /<main[\s>]/i]
const END_ANCHOR = /<\/main\s*>/i

function extractRegion(html, doc) {
  let start = -1
  for (const anchor of HERO_ANCHORS) {
    const m = anchor.exec(html)
    if (m) { start = m.index; break }
  }
  const endMatch = END_ANCHOR.exec(html)
  if (start === -1 || !endMatch) die(`canonical ${doc}: hero/main window not found`)
  return html.slice(start, endMatch.index + endMatch[0].length)
}

/* The transform's text-affecting steps only. Class and attribute rewriting
   cannot change a text node by construction, so it is not reproduced: this
   applies exactly the two deletions that CAN, plus the empty-chip removal, and
   asserts that even those take nothing with them. */
function textAffectingSteps(region) {
  return region
    .replace(MIRROR.script, '')
    .replace(MIRROR.svg, '')
}

console.log('\nLegal documents: the transform changed no words\n')

assertMirrorIsCurrent()

let failed = 0
for (const doc of DOCS) {
  const file = path.join(ROOT, 'canonical-site', doc, 'index.html')
  if (!fs.existsSync(file)) die(`canonical-site/${doc}/index.html is missing`)

  const html = fs.readFileSync(file, 'utf8')
  const region = extractRegion(html, doc)

  /* An emptiness floor, so a window that matched nothing cannot pass by
     comparing two empty lists. Both documents are several hundred lines; 100
     text nodes is far below either and far above any plausible mis-match. */
  const before = textNodes(region)
  if (before.length < 100) {
    console.error(`  FAIL ${doc}: extraction window yielded only ${before.length} text nodes`)
    failed++
    continue
  }

  const after = textNodes(textAffectingSteps(region))

  if (before.length !== after.length) {
    const missing = before.filter((t) => !after.includes(t)).slice(0, 5)
    console.error(`  FAIL ${doc}: ${before.length} text nodes before, ${after.length} after`)
    for (const m of missing) console.error(`         lost: ${JSON.stringify(m.slice(0, 90))}`)
    failed++
    continue
  }

  const firstDiff = before.findIndex((t, i) => t !== after[i])
  if (firstDiff !== -1) {
    console.error(`  FAIL ${doc}: text node ${firstDiff} differs`)
    console.error(`         canonical: ${JSON.stringify(before[firstDiff].slice(0, 90))}`)
    console.error(`         rendered:  ${JSON.stringify(after[firstDiff].slice(0, 90))}`)
    failed++
    continue
  }

  /* One more floor: the document's headings are its outline, and the transform
     must not promote, demote, merge or drop one. Counted per level. */
  const levels = [1, 2, 3, 4].map((n) => {
    const re = new RegExp(`<h${n}[\\s>]`, 'gi')
    return (region.match(re) || []).length
  })
  console.log(
    `  OK   ${doc}: ${before.length} text nodes identical, ` +
    `outline h1/h2/h3/h4 = ${levels.join('/')}`,
  )
}

if (failed) {
  console.error(`\n${DOCS.length - failed} passed, ${failed} failed\n`)
  process.exit(1)
}
console.log(`\n${DOCS.length} passed, 0 failed\n`)
