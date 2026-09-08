#!/usr/bin/env node
/**
 * A Direction F page must COMPOSE the scaffold, not hand-write the assembly.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-f-scaffold.js
 *
 * WHY THIS EXISTS. `components/marketing/FPage.tsx` exists because the hero was
 * copy-pasted across seven files and had drifted into three shapes nobody had
 * noticed. Moving the assembly into a component does not stop that happening
 * again: the next page is still one paste away from a hand-written
 * `.f-ruleground` that looks right and is subtly not. A component that can be
 * bypassed is a convention, and this file is what turns it into a rule.
 *
 * The three sibling checks catch a page that spells the system wrong.
 * This one catches a page that does not use it.
 *
 * WHAT IS CHECKED, and each one is a shape that actually drifted:
 *   1. `className="f-page"`        the page root
 *   2. `className="f-ruleground"`  the hero ground and the HeroField inside it
 *   3. `f-wrap f-sec` + SectionRule  a counted section header
 *   4. `f-wrap f-close`, `f-close`   a close
 *   5. `n=` / `of=` passed to FSection by hand: FPage counts, nobody types it
 *   6. `SectionRule` imported anywhere but FPage.tsx
 *
 * SCOPE is the F surface: `app/(marketing)` and `components/marketing`. The
 * authenticated app, the checkout and the legal pages are not Direction F yet
 * and are not held to it; when they are rebuilt they come into scope by being
 * moved, not by an edit here.
 *
 * ALLOWED, and the reason is in ALLOW below. `/` builds its hero from a film
 * rather than the shared field, which is one page and one assembly, so it stays
 * hand-written rather than growing an `FHero` variant with a single caller.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SCOPE = [path.join(ROOT, 'app', '(marketing)'), path.join(ROOT, 'components', 'marketing')]
const OWNER = path.join(ROOT, 'components', 'marketing', 'FPage.tsx')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])
function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIR.has(e.name)) walk(path.join(dir, e.name), acc) }
    else if (e.name.endsWith('.tsx')) acc.push(path.join(dir, e.name))
  }
  return acc
}

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')
// Only real code: a class name quoted inside a JSX comment is documentation.
const stripJsxComments = (s) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))

const files = SCOPE.flatMap((d) => walk(d)).filter((f) => f !== OWNER)
if (files.length < 5) die(`found only ${files.length} files in scope. The layout changed; fix this collector rather than trusting a pass.`)

if (!fs.existsSync(OWNER)) die(`missing ${rel(OWNER)}, which is the component this check exists to enforce.`)

/**
 * Each rule names the component that owns the shape, so the failure tells the
 * reader what to write instead rather than only what not to.
 */
const RULES = [
  { what: 'the page root', re: /className="f-page"/g, use: '<FPage>' },
  { what: 'the hero ground', re: /className="f-ruleground"/g, use: '<FHero>, which supplies .f-ruleground and the HeroField inside it' },
  { what: 'a counted section header', re: /className="f-wrap f-sec(?: f-sec-cont)?"[^\n]*>\s*\n\s*<SectionRule/g, use: '<FSection>, which takes its number from FPage' },
  { what: 'a close', re: /className="(?:f-wrap f-close|f-close f-rise|f-close)"/g, use: '<FClose>' },
  { what: 'a hand-typed section number', re: /<FSection[^>]*\s(?:n|of)=\{/g, use: 'nothing: FPage counts its own sections, which is the whole point' },
  { what: 'SectionRule directly', re: /import \{[^}]*\bSectionRule\b[^}]*\} from/g, use: '<FSection>, the only thing that should render a SectionRule' },
]

// `/` composes its hero from the film layer, not the shared field. One page, one
// assembly: an FHero variant with a single caller would be worse than this line.
const ALLOW = [
  { file: 'app/(marketing)/page.tsx', what: 'the hero ground', why: 'the homepage hero is the film, not the shared field' },
]

console.log('Direction F scaffold: pages compose it rather than hand-writing it\n')
console.log(`  ${files.length} files in scope (app/(marketing), components/marketing)`)
console.log(`  ${RULES.length} assemblies owned by ${rel(OWNER)}\n`)

let fail = 0
let allowed = 0

for (const f of files) {
  const src = stripJsxComments(read(f))
  for (const r of RULES) {
    r.re.lastIndex = 0
    for (const m of src.matchAll(r.re)) {
      const line = src.slice(0, m.index).split('\n').length
      const ok = ALLOW.find((a) => a.file === rel(f) && a.what === r.what)
      if (ok) { allowed++; continue }
      fail++
      console.log(`  FAIL ${rel(f)}:${line} hand-writes ${r.what}`)
      console.log(`       use ${r.use}`)
    }
  }
}

if (allowed) console.log(`\n  ${allowed} documented exception(s) allowed, see ALLOW in this file`)
console.log(`\n${fail === 0 ? 'every F assembly comes from the scaffold' : `${fail} hand-written assemblies`}`)
process.exit(fail > 0 ? 1 : 0)
