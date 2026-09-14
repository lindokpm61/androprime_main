#!/usr/bin/env node
/**
 * No component file under `components/` is without a consumer.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-dead-components.js
 *
 * WHY THIS EXISTS, AND WHY IT IS A SCRIPT RATHER THAN A SHELL SNIPPET IN A DOC.
 * `design/journey-inventory.md` section F has carried a dead-component sweep
 * three times. The August one recorded five names; a fortnight later the true
 * count was ten. The 2026-09-12 re-run deleted those ten and CLEARED FOUR THAT
 * WERE DEAD, because it matched the component's IDENTIFIER and an identifier
 * cannot tell a use from a mention:
 *
 *   - `KitCard` matched `type KitCard = {`, a local type alias of the same name.
 *   - `FaqAccordion` and `SectionEyebrow` matched COMMENTS, in three files,
 *     each one recording that the component had been removed. Writing down the
 *     removal is what kept them alive to the grep.
 *   - `JoinForm` had a real import inside a page whose first statement is
 *     `redirect('/kits')`. The consumer existed and never executed.
 *
 * The replacement derivation published in that doc matched a JSX tag instead,
 * which fixes the first three and introduced one of its own: it assumed THE FILE
 * NAME EQUALS THE COMPONENT NAME, so `DemoTheme.tsx` (which exports
 * `DemoThemeProvider`), `InternalChrome.tsx` and `articleMdx.tsx` all reported
 * dead and all three are live. It named seven files and four were real.
 *
 * So the unit here is not the file name. It is THE SET OF NAMES THE FILE
 * EXPORTS, read out of the file, and a file is live when anything outside it
 * reaches one of them. Two shapes count as reaching, and neither can be written
 * in a comment by accident:
 *
 *   1. AN IMPORT whose specifier resolves to this file. Structural, so a type
 *      alias, a prose mention and a removal note are all invisible to it.
 *   2. A JSX TAG `<Name`, which is how an `.mdx` article reaches a component
 *      that is wired in through the MDX map rather than imported by name.
 *
 * ⚠ TWO BLIND SPOTS ARE INHERITED AND ONE OF THEM IS DEFENDED.
 *
 *   - A consumer that imports a component and then never renders it, because it
 *     sits behind an unconditional `redirect()`, reads as live here. That is
 *     `JoinForm`'s original shape. Nothing cheap distinguishes it, so it is
 *     stated rather than half-handled: READ THE CONSUMER BEFORE TRUSTING A PASS.
 *   - A dynamic import is NOT a blind spot here, because `import('./x')` carries
 *     the same literal specifier a static one does and resolves the same way.
 *     `next/dynamic` is covered by that: `dynamic(() => import('...'))` has the
 *     literal inside it. What cannot be resolved is a COMPUTED specifier, and
 *     rather than leave that as an assumption the check looks for one and fails
 *     loudly if it appears.
 *
 *     ⚠ The first draft of that guard failed on the NAME instead, matching
 *     `dynamic\s*\(` and `import\s*\(` anywhere in the file. It fired on
 *     eighteen sites, seventeen of which were real-but-harmless script imports
 *     and one of which was the prose `already render dynamic (\`ƒ\` in the build
 *     output)` inside a comment on `/membership`. That is precisely the defect
 *     this check exists to end, reproduced inside the check itself on its first
 *     run: an identifier match cannot tell a use from a mention, and the guard
 *     had to be re-written to resolve the specifier rather than spot the word.
 *
 * DIRECTION. A component with no consumer FAILS. Deleting it is not always the
 * answer — a component can be waiting for a page that is not built yet — but
 * that is a decision somebody has to make and record, so the escape hatch is an
 * explicit entry in KEPT below, with a reason, not silence.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CANDIDATE_TREE = 'components'
const CONSUMER_TREES = ['app', 'components', 'lib', 'content', 'scripts']
const CONSUMER_EXT = ['.ts', '.tsx', '.mdx']

/*
 * DELIBERATELY KEPT WITH NO CONSUMER. Empty today, and that is the point: every
 * component in the tree is reachable. An entry here is a decision with a date
 * and a reason on it, which is the thing the three previous sweeps did not have.
 *
 *   { file: 'components/x/Y.tsx', since: 'YYYY-MM-DD', why: '...' }
 */
const KEPT = []

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

const SKIP_DIR = new Set(['node_modules', '.next', '.git', '.impeccable', 'out'])

function walk(dir, exts, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (SKIP_DIR.has(e.name)) continue
      walk(path.join(dir, e.name), exts, acc)
    } else if (exts.some((x) => e.name.endsWith(x))) {
      acc.push(path.join(dir, e.name))
    }
  }
  return acc
}

const read = (f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n')
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/')

/* ---------- two blanked views of one file ----------
   Every regex below runs against one of these rather than against the raw
   source, and which one it runs against is the whole correctness argument.
   Blanking replaces characters with spaces and keeps newlines, so a line number
   computed on a view is the line number in the file.

     .noComments      — comments gone, string literals intact. For reading an
                        import SPECIFIER, which is itself a string literal.
     .noCommentsOrStrings — both gone. For spotting a code SHAPE, where a
                        matching run of characters inside prose is a mention.

   Both views were written after the same mistake twice in one hour. Matching
   `dynamic\s*\(` on raw source fired on the comment `already render dynamic
   (\`ƒ\` in the build output)`; matching `import\s*\(` fired on the message
   `${n} import(s) resolve outside frontend/`. Neither is an import. This is the
   defect the check exists to end, so the check may not commit it. */
function views(src) {
  const noComments = src.split('')
  const noCode = src.split('')
  const blank = (arr, i) => { if (arr[i] !== '\n') arr[i] = ' ' }
  let i = 0
  const n = src.length
  // A template literal can nest `${ ... }` containing more literals, so the
  // state is a stack rather than a flag.
  const stack = []
  /* 🔴 REGEX LITERALS HAVE TO BE RECOGNISED, AND THE UNTERMINATED GUARD BELOW IS
     WHAT SAID SO. `lib/account/exportResults.ts:32` is `/[",\n\r]/.test(s)`: a
     regex whose character class contains a double quote. Without this branch the
     scanner opened a string state there and blanked the rest of the file.
     A leading `/` is a regex rather than a division when the last significant
     character cannot END an expression — so after `(`, `,`, `=`, `:`, `[`, `!`,
     `&`, `|`, `?`, `{`, `}`, `;`, `return` or the start of a line, but not after
     an identifier, a number, or a closing bracket. Its body is blanked in the
     code view too: `/import\s*\(/` is a pattern, not a call. */
  let prev = ''
  let prevWord = ''
  /* A keyword ends in an identifier character and still cannot end an
     expression, so the character test alone reads `return /[",\n\r]/` as a
     division. That is the exact line this branch was added for. */
  const KEYWORD_BEFORE_REGEX = new Set([
    'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
    'case', 'do', 'else', 'yield', 'await', 'throw',
  ])
  const canPrecedeRegex = (p) =>
    p === '' || !/[A-Za-z0-9_$)\]]/.test(p) || KEYWORD_BEFORE_REGEX.has(prevWord)
  while (i < n) {
    const c = src[i]
    const top = stack[stack.length - 1]
    /* A template's `${ ... }` is ORDINARY CODE and takes the same branch as the
       top level, rather than a reduced copy of it. The reduced copy is what this
       scanner had first, and it left out the regex case: `` `"${s.replace(/"/g,
       '""')}"` `` on the same line that forced the regex branch then opened a
       string state on the quote inside `/"/g`. Two code paths for one language
       is how a scanner disagrees with itself. */
    if (!top || top === '${') {
      if (top === '${' && c === '}') { stack.pop(); i++; continue }
      if (c === '/' && src[i + 1] === '/') { stack.push('//'); blank(noComments, i); blank(noCode, i); i++; continue }
      if (c === '/' && src[i + 1] === '*') { stack.push('/*'); blank(noComments, i); blank(noCode, i); i++; continue }
      if (c === '/' && canPrecedeRegex(prev)) {
        let j = i + 1
        let inClass = false
        for (; j < n; j++) {
          const d = src[j]
          if (d === '\\') { j++; continue }
          if (d === '\n') break // an unterminated regex: it was a division after all
          if (d === '[') inClass = true
          else if (d === ']') inClass = false
          else if (d === '/' && !inClass) break
        }
        if (j < n && src[j] === '/') {
          for (let k = i + 1; k < j; k++) blank(noCode, k)
          prev = '/'
          i = j + 1
          continue
        }
      }
      if (c === "'" || c === '"' || c === '`') { stack.push(c); blank(noCode, i); prevWord = ''; i++; continue }
      if (/[A-Za-z_$]/.test(c)) {
        let j = i
        while (j < n && /[\w$]/.test(src[j])) j++
        prevWord = src.slice(i, j)
        prev = src[j - 1]
        i = j
        continue
      }
      if (!/\s/.test(c)) { prev = c; prevWord = '' }
      i++
      continue
    }
    if (top === '//') {
      if (c === '\n') stack.pop()
      else { blank(noComments, i); blank(noCode, i) }
      i++
      continue
    }
    if (top === '/*') {
      blank(noComments, i); blank(noCode, i)
      if (c === '*' && src[i + 1] === '/') { blank(noComments, i + 1); blank(noCode, i + 1); stack.pop(); i += 2; continue }
      i++
      continue
    }
    // inside a string or template
    if (c === '\\') { blank(noCode, i); blank(noCode, i + 1); i += 2; continue }
    if (top === '`' && c === '$' && src[i + 1] === '{') { stack.push('${'); i += 2; continue }
    blank(noCode, i)
    // A closed literal is a VALUE, so a `/` after it is division. `prev` is set
    // to an identifier character rather than to the quote, because the quote
    // itself would read as "cannot end an expression" and open a fake regex.
    if (c === top) { stack.pop(); prev = 'x' }
    i++
  }
  /* A regex literal containing a quote — `/['"]/` — would open a string state
     this scanner never closes, and every line after it would be blanked as if
     it were prose. That failure is silent and it is the shape that would make
     this check pass while seeing nothing, so it is asserted rather than hoped
     for: at end of file nothing may still be open. */
  while (stack.length && stack[stack.length - 1] === '//') stack.pop()
  return {
    noComments: noComments.join(''),
    noCommentsOrStrings: noCode.join(''),
    unterminated: stack.length ? stack[stack.length - 1] : null,
  }
}

/* ---------- what each candidate file exports ----------
   Value exports only, and the name is taken from the declaration rather than
   from the file. `export type` is excluded on purpose: a type is exactly what
   `KitCard` was mistaken for, and a type-only export cannot be rendered. */
function exportedNames(src) {
  const names = new Set()
  for (const m of src.matchAll(/export\s+(?:default\s+)?(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z_$][\w$]*)/g)) {
    names.add(m[1])
  }
  // `export { A, B as C }` — the exported name is what a consumer imports.
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    if (/^\s*type\s/.test(m[1])) continue
    for (const part of m[1].split(',')) {
      const t = part.trim()
      if (!t || /^type\s/.test(t)) continue
      const as = /\bas\s+([A-Za-z_$][\w$]*)/.exec(t)
      names.add(as ? as[1] : t.split(/\s+/)[0])
    }
  }
  return names
}

/* ---------- resolve an import specifier to a file on disk ---------- */
function resolveSpecifier(spec, fromFile) {
  let base
  if (spec.startsWith('@/')) base = path.join(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = path.resolve(path.dirname(fromFile), spec)
  else return null // a package, not one of ours
  for (const cand of [base, `${base}.tsx`, `${base}.ts`, path.join(base, 'index.tsx'), path.join(base, 'index.ts')]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand
  }
  return null
}

/* ---------- collect ---------- */

const candidates = walk(path.join(ROOT, CANDIDATE_TREE), ['.tsx'])
if (candidates.length < 40) {
  die(`found only ${candidates.length} components — the tree moved. Fix this collector rather than trusting a pass.`)
}

const consumers = []
for (const tree of CONSUMER_TREES) consumers.push(...walk(path.join(ROOT, tree), CONSUMER_EXT))
if (consumers.length < 100) {
  die(`found only ${consumers.length} consumer files — the trees moved. Fix this collector rather than trusting a pass.`)
}

// file path -> set of files that import from it
const importedBy = new Map()
// every `<Name` tag rendered anywhere, with where
const jsxTags = new Map()
// an `import(...)` whose argument is not a plain string: unresolvable, so fatal
const computedSites = []

for (const f of consumers) {
  const raw = read(f)
  /* 🔴 `views()` IS FOR TYPESCRIPT ONLY, AND MDX IS WHY THIS IS A BRANCH RATHER
     THAN ONE PATH. An `.mdx` article is prose, so its apostrophes are
     apostrophes: "don't" would open a string state the scanner never closes and
     every line after it would be blanked, which the unterminated guard then
     reports as a broken file. MDX carries no JS comments and no import
     specifiers — a component reaches it through the map in `articleMdx.tsx` —
     so the only thing worth reading out of one is the JSX tag, and the only
     thing worth stripping is the JSX brace-comment form, which the regex below
     spells out. (Spelling it out in this sentence instead closed this comment
     early and made the next eleven lines parse as code — the third time in one
     file that a mention was read as the thing it mentions.) */
  const isMdx = f.endsWith('.mdx')
  let src, code
  if (isMdx) {
    src = raw.replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => m.replace(/[^\n]/g, ' '))
    code = src
  } else {
    const v = views(raw)
    if (v.unterminated) {
      die(`${rel(f)} left a ${v.unterminated === '/*' ? 'block comment' : `${v.unterminated} literal`} open at end of file. ` +
          `That is this scanner losing its place, not the file being broken — probably a regex literal ` +
          `containing a quote. Everything after it was read as prose, so a pass here would mean nothing.`)
    }
    src = v.noComments
    code = v.noCommentsOrStrings
  }
  const note = (spec) => {
    const target = resolveSpecifier(spec, f)
    if (!target || target === f) return
    if (!importedBy.has(target)) importedBy.set(target, new Set())
    importedBy.get(target).add(rel(f))
  }
  // static `from '...'`, and `import('...')` / `dynamic(() => import('...'))`,
  // which carry the same literal specifier and resolve the same way.
  for (const m of src.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g)) note(m[1])
  for (const m of src.matchAll(/(?<![.\w$])import\s*\(\s*(['"])([^'"]+)\1\s*\)/g)) note(m[2])
  // the shape that cannot be resolved: a computed specifier. Read off the
  // strings-blanked view, so `${n} import(s) resolve outside frontend/` in an
  // assertion message is not mistaken for one.
  for (const m of code.matchAll(/(?<![.\w$])import\s*\(\s*(?![)\s])/g)) {
    computedSites.push(`${rel(f)}:${code.slice(0, m.index).split('\n').length}`)
  }
  for (const m of src.matchAll(/<([A-Z][\w.]*)(?=[\s/>\n])/g)) {
    const name = m[1].split('.')[0]
    if (!jsxTags.has(name)) jsxTags.set(name, new Set())
    jsxTags.get(name).add(`${rel(f)}:${src.slice(0, m.index).split('\n').length}`)
  }
}

if (computedSites.length) {
  console.error('\nERROR: an import with a computed specifier appeared, and this check cannot resolve one.\n')
  for (const s of computedSites) console.error(`  ${s}`)
  console.error(
    '\nA component reached only that way would be reported dead and deleted. Teach ' +
    'this check to resolve it, or add the target to KEPT with the reason, before ' +
    'the next sweep runs.\n',
  )
  process.exit(1)
}

/* ---------- verdict ---------- */

const keptSet = new Map(KEPT.map((k) => [k.file, k]))
const dead = []
let live = 0

for (const f of candidates.sort()) {
  const r = rel(f)
  const names = exportedNames(views(read(f)).noComments)
  if (!names.size) {
    dead.push({ file: r, why: 'exports nothing' })
    continue
  }
  const byImport = importedBy.get(f)
  const byJsx = [...names].flatMap((n) => [...(jsxTags.get(n) || [])].filter((site) => !site.startsWith(`${r}:`)))
  if ((byImport && byImport.size) || byJsx.length) { live++; continue }
  dead.push({ file: r, why: `exports ${[...names].join(', ')} — nothing imports it and nothing renders it` })
}

console.log('Dead components: every file under components/ has a consumer\n')
console.log(`  ${candidates.length} component files, ${consumers.length} files scanned for consumers`)
console.log(`  ${live} live, ${dead.length} without a consumer, ${KEPT.length} deliberately kept\n`)

const unexplained = dead.filter((d) => !keptSet.has(d.file))
for (const k of KEPT) {
  if (!candidates.some((f) => rel(f) === k.file)) {
    die(`KEPT names ${k.file}, which no longer exists. Remove the entry rather than leaving a stale exemption.`)
  }
  if (!dead.some((d) => d.file === k.file)) {
    die(`KEPT names ${k.file}, which now HAS a consumer. Remove the entry — an exemption that is not exempting anything hides the next real one.`)
  }
  console.log(`  KEPT ${k.file} — since ${k.since}, ${k.why}`)
}

if (unexplained.length) {
  console.error(`\nERROR: ${unexplained.length} component${unexplained.length === 1 ? '' : 's'} with no consumer:\n`)
  for (const d of unexplained) console.error(`  ${d.file}\n       ${d.why}`)
  console.error(
    '\nDelete it, wire it up, or add it to KEPT in this file with a date and a reason. ' +
    'Read the consumer before deciding: a component imported by a page that begins ' +
    'with an unconditional redirect() reads as live here and renders nowhere.\n',
  )
  process.exit(1)
}

console.log(`\n${candidates.length} components, 0 without a consumer\n`)
