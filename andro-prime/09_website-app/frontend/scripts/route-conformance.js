#!/usr/bin/env node
/**
 * Measure every route against Direction F and write the answer into the repo.
 *
 *   npm run dev                              # in another terminal
 *   node scripts/route-conformance.js        # writes design/route-conformance.md
 *   node scripts/route-conformance.js --base http://localhost:3001
 *
 * WHY THIS EXISTS. The rebuild is route by route, so "how many are done" is a
 * number somebody has to state, and a stated number goes stale silently. It did:
 * STATE.md said six routes for long enough that the figure had to be
 * re-measured from scratch on 2026-09-08, and the answer was eleven. A count
 * written in prose has no way to notice that the world moved.
 *
 * So the count is generated, committed, and dated. `design/route-conformance.md`
 * is the artefact; this script is the only thing that should write it.
 *
 * HOW A ROUTE IS JUDGED. It is rendered, and the distinct `f-`/`fb-` classes on
 * it are counted OUTSIDE the shared chrome. The chrome is excluded by landmark
 * (`<header>`, `<footer>`, and the cookie banner) rather than by subtracting a
 * remembered number of classes: the nav and footer are worn by every route
 * including the ones still on the old design, so counting them would score every
 * route as rebuilt. That is the exact trap the earlier hand-count had to work
 * around by subtracting 21.
 *
 * WHAT IT ALSO REPORTS. The F classes that exist in the stylesheets and appear
 * on NO route. That is the one output the retired `reconcile-f-css.js` had that
 * carried real information (its "unpaired selectors"), except measured against
 * rendered routes rather than against drawings, which is what makes it mean
 * "waiting for a page" rather than "disagrees with a mockup".
 *
 * THE STALENESS GUARD IS SEPARATE AND STATIC. `verify-route-conformance.js` runs
 * in `npm test`, needs no browser, and fails if the route set on disk no longer
 * matches the report or if a route has crossed into or out of Direction F since
 * it was written. That is what stops this file becoming the next stale number.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const APP = path.join(ROOT, 'app')
const OUT = path.resolve(ROOT, '..', 'design', 'route-conformance.md')
const OUT_JSON = path.resolve(ROOT, '..', 'design', 'route-conformance.json')

const argv = process.argv.slice(2)
const opt = (f, d) => { const i = argv.indexOf(f); return i === -1 || i === argv.length - 1 ? d : argv[i + 1] }
const BASE = opt('--base', 'http://localhost:3000')

function die(m) { console.error(`ERROR: ${m}`); process.exit(1) }

/* ---------- routes ---------- */

// A dynamic segment needs a real value to render. Declared rather than guessed,
// so a missing sample is a loud failure instead of a 404 scored as "not F".
const SAMPLES = {
  '/authors/[slug]': 'dr-ewa-lindo',
  '/blog/[slug]': 'andropause-male-menopause',
  '/blog/preview/[slug]': 'andropause-male-menopause',
}

// Not part of the public surface, so not part of the count. Each says why.
const EXCLUDED = {
  '/founding-member': 'retired, 307s to /kits',
  '/admin/dashboard': 'internal, no public UI',
  '/ops/content': 'internal, no public UI',
  '/go': 'internal redirect, no UI',
  '/blog/preview/[slug]': 'internal preview of an unpublished draft',
  '/demo': 'runs the authenticated app shell (`ap-*`), not the marketing layer, so Direction F is the wrong question',
}

// Dark-launch flags call `notFound()` on the route itself, so with the flag off
// the page 404s BY DESIGN. Scoring that as "not rebuilt" would be a lie about a
// route that is finished: /membership is one of the rebuilt ones. Declared here
// so a 404 on one of these reads as "not measured" and names what would measure
// it, while a 404 anywhere else stays an error.
const FLAG_GATED = {
  '/membership': 'MEMBERSHIP_ENABLED=true',
  '/account/membership': 'MEMBERSHIP_ENABLED=true',
  '/results-dashboard/handoff': 'GP_HANDOFF_ENABLED=true',
}

function routes(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) { if (!e.name.startsWith('_') && e.name !== 'api') routes(p, acc) }
    else if (e.name === 'page.tsx') {
      const rel = path.relative(APP, path.dirname(p)).split(path.sep).filter(Boolean)
      // A `(group)` is an organisational folder, not a path segment.
      const url = '/' + rel.filter((s) => !(s.startsWith('(') && s.endsWith(')'))).join('/')
      acc.push({ url: url === '/' ? '/' : url.replace(/\/$/, ''), file: path.relative(ROOT, p).split(path.sep).join('/') })
    }
  }
  return acc
}

// A static second opinion, and the only evidence available for a route that
// cannot be rendered anonymously. It reads the page file itself: a rebuilt page
// either composes the scaffold or writes `f-` classes, and a page that does
// neither is not Direction F whatever the renderer could not tell us.
function sourceSignal(file) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8')
  const scaffold = /from '@\/components\/marketing\/FPage'/.test(src)
  const classes = new Set([...src.matchAll(/(?<![A-Za-z0-9_-])((?:f|fb)-[a-z][a-z0-9-]*)(?![A-Za-z0-9_-])/g)].map((m) => m[1]))
  return { scaffold, classes: classes.size }
}

// `not-found.tsx` is a rendered surface with no `page.tsx`, so the directory
// walk cannot see it, and it was counted by hand as one of the rebuilt routes.
// It is reached by asking for a URL that matches nothing.
const SYNTHETIC = [
  { url: '/not-found', href: '/__conformance_probe_404__', file: 'app/not-found.tsx', expectStatus: 404 },
]

const all = routes(APP).sort((a, b) => a.url.localeCompare(b.url))
if (all.length < 20) die(`found only ${all.length} routes under app/. Fix this collector rather than trusting a pass.`)

const measured = all.filter((r) => !(r.url in EXCLUDED))
for (const r of measured) {
  if (r.url.includes('[') && !(r.url in SAMPLES)) {
    die(`no sample value for the dynamic route ${r.url}. Add one to SAMPLES rather than letting it render a 404 and score as not-rebuilt.`)
  }
  r.href = r.url.replace(/\[[^\]]+\]/, (m) => SAMPLES[r.url])
}
for (const s of SYNTHETIC) if (fs.existsSync(path.join(ROOT, s.file))) measured.push(s)
measured.sort((a, b) => a.url.localeCompare(b.url))

/* ---------- the F classes the stylesheets define ---------- */

const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ')
function walk(dir, ext, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name), ext, acc)
    else if (e.name.endsWith(ext)) acc.push(path.join(dir, e.name))
  }
  return acc
}
const definedClasses = new Set()
for (const f of walk(path.join(ROOT, 'styles'), '.css')) {
  const src = stripCssComments(fs.readFileSync(f, 'utf8'))
  let prelude = ''
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]
    if (ch === '{') {
      if (!/^\s*@/.test(prelude)) for (const m of prelude.matchAll(/\.((?:f|fb)-[a-z][a-z0-9-]*)/g)) definedClasses.add(m[1])
      prelude = ''
    } else if (ch === '}' || ch === ';') prelude = ''
    else prelude += ch
  }
}
if (!definedClasses.size) die('parsed no f- classes out of the stylesheets. Fix this parser rather than trusting a pass.')

/* ---------- render ---------- */

let puppeteer = null
for (const c of ['puppeteer-core', path.join(ROOT, 'node_modules', 'puppeteer-core')]) {
  try { puppeteer = require(c); break } catch { /* next */ }
}
if (!puppeteer) die('puppeteer-core not found. Fix: npm install puppeteer-core')

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const chrome = CHROME_CANDIDATES.find((c) => fs.existsSync(c))
if (!chrome) die('no Chrome binary found. Fix: set CHROME_PATH to the executable.')

// Everything inside the shared chrome is removed before counting. The nav and
// the footer are worn by every route including the ones still on the old
// design, so leaving them in would score the whole site as rebuilt.
const COUNT = () => {
  const chromeSel = 'header, footer, .f-cookiewrap, [data-ap-chrome]'
  const inChrome = (el) => !!el.closest(chromeSel)
  const own = new Set()
  const all = new Set()
  for (const el of document.querySelectorAll('[class]')) {
    const cls = String((el.className && (el.className.baseVal !== undefined ? el.className.baseVal : el.className)) || '')
    const hits = cls.split(/\s+/).filter((c) => /^(?:f|fb)-[a-z]/.test(c))
    if (!hits.length) continue
    for (const c of hits) {
      all.add(c)
      if (!inChrome(el)) own.add(c)
    }
  }
  return {
    own: [...own].sort(),
    all: [...all].sort(),
    scaffold: !!document.querySelector('main .f-page, body > .f-page:not(nav):not(footer)'),
    title: document.title,
  }
}

;(async () => {
  console.log(`Route conformance against ${BASE}, ${measured.length} routes\n`)
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] })
  const rows = []
  const seenClasses = new Set()
  for (const r of measured) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1000 })
    let status = 0
    let data = null
    let landed = ''
    try {
      const resp = await page.goto(BASE + r.href, { waitUntil: 'networkidle0', timeout: 180000 })
      status = resp ? resp.status() : 0
      landed = new URL(page.url()).pathname
      data = await page.evaluate(COUNT)
    } catch (e) {
      status = -1
    }
    await page.close()
    const own = data ? data.own : []

    // An authenticated route sends an anonymous visitor to the login page, so
    // what rendered is the LOGIN page, not the route. Counting its classes would
    // score every gated route with whatever /auth/login happens to wear.
    // The 404 surface is REACHED by a 404, so its expected status is 404 and a
    // redirect check against a deliberately unmatched path is meaningless.
    const expected = r.expectStatus || 200
    const redirected = !r.expectStatus && landed && landed !== r.href
    const flagged = status === 404 && r.url in FLAG_GATED

    let verdict
    let note = ''
    if (flagged) { verdict = 'not measured'; note = `404 with the dark-launch flag off; needs \`${FLAG_GATED[r.url]}\`` }
    else if (redirected) { verdict = 'not measured'; note = `redirects to \`${landed}\` for an anonymous visitor` }
    else if (status !== expected && (status < 200 || status >= 400)) verdict = 'ERROR'
    else verdict = own.length > 0 ? 'F' : 'not rebuilt'

    if (verdict === 'F' || verdict === 'not rebuilt') for (const c of own) seenClasses.add(c)
    rows.push({ url: r.url, href: r.href, file: r.file, status, classes: own.length, verdict, note, source: sourceSignal(r.file) })
    console.log(`  ${verdict.padEnd(12)} ${String(verdict === 'F' || verdict === 'not rebuilt' ? own.length : '-').padStart(3)} classes  ${r.url}${note ? `  (${note.replace(/`/g, '')})` : ''}`)
  }
  await browser.close()

  const errors = rows.filter((r) => r.verdict === 'ERROR')
  const f = rows.filter((r) => r.verdict === 'F')
  const not = rows.filter((r) => r.verdict === 'not rebuilt')
  const unmeasured = rows.filter((r) => r.verdict === 'not measured')

  // A route that would not load is not a measurement. Refuse to write a report
  // that would quietly record it as un-rebuilt.
  if (errors.length) {
    console.error(`\n${errors.length} route(s) failed to load: ${errors.map((e) => `${e.url} [${e.status}]`).join(', ')}`)
    console.error('Nothing written. A route that will not render is not evidence that it is un-rebuilt.')
    process.exit(1)
  }

  // Which dark-launch flags were on is not knowable from here: the server owns
  // its own environment. It is INFERRED instead, from whether a flag-gated route
  // rendered at all, so the report states the conditions it was measured under
  // rather than asking the reader to remember them.
  const flagsOn = [...new Set(
    rows.filter((r) => r.url in FLAG_GATED && r.verdict !== 'not measured').map((r) => FLAG_GATED[r.url])
  )].sort()

  const unused = [...definedClasses].filter((c) => !seenClasses.has(c)).sort()
  const today = new Date().toISOString().slice(0, 10)
  const denom = f.length + not.length
  const pct = Math.round((f.length / denom) * 100)

  const md = `# Route conformance: Direction F

**${f.length} of ${denom} measurable routes are Direction F (${pct}%).** Measured ${today}.
${unmeasured.length ? `A further **${unmeasured.length}** could not be measured anonymously; they are listed below with the reason.` : ''}

<!-- GENERATED FILE. Do not edit by hand: run \`npm run route-conformance\` with a dev
     server up. \`verify-route-conformance.js\` runs in \`npm test\` and fails if this
     file no longer describes the repo. -->

A route counts as Direction F when it renders at least one \`f-\`/\`fb-\` class OUTSIDE
the shared chrome. The chrome is excluded by landmark (\`<header>\`, \`<footer>\`, the
cookie banner) rather than by subtracting a remembered class count, because the nav
and footer are worn by every route including the ones still on the old design.

## Rebuilt (${f.length})

| Route | F classes | Source |
|---|---|---|
${f.map((r) => `| \`${r.url}\` | ${r.classes} | \`${r.file}\` |`).join('\n')}

## Not rebuilt (${not.length})

| Route | F classes | Source |
|---|---|---|
${not.map((r) => `| \`${r.url}\` | ${r.classes} | \`${r.file}\` |`).join('\n')}

## Not measured (${unmeasured.length})

Rendered and refused, so their conformance is genuinely unknown rather than zero.
A redirect means an anonymous visitor gets the login page, and counting the login
page's classes would score every gated route with whatever \`/auth/login\` wears.

| Route | Why | Static signal | Source |
|---|---|---|---|
${unmeasured.map((r) => `| \`${r.url}\` | ${r.note} | ${r.source.scaffold ? 'composes the scaffold' : r.source.classes ? `${r.source.classes} F classes in source` : '**no F markers in source**'} | \`${r.file}\` |`).join('\n')}

## Excluded from the count (${Object.keys(EXCLUDED).length})

| Route | Why |
|---|---|
${Object.entries(EXCLUDED).map(([k, v]) => `| \`${k}\` | ${v} |`).join('\n')}

## F classes defined and rendered nowhere (${unused.length})

These exist in the stylesheets and appear on no route. Each is either a component
waiting for a page that has not been rebuilt, or dead. This replaces the retired
\`reconcile-f-css.js\` "unpaired selectors" figure, measured against rendered routes
rather than against the journey frames.

${unused.length ? unused.map((c) => `\`.${c}\``).join(', ') : '_none_'}

---

_Generated by \`frontend/scripts/route-conformance.js\` on ${today}. ${rows.length} routes
rendered at 1440px against a dev server.${flagsOn.length ? ` Dark-launch flags on for this run, inferred from the routes that rendered: ${flagsOn.map((x) => `\`${x}\``).join(', ')}.` : ' No dark-launch flags were on.'}_
`

  fs.writeFileSync(OUT, md)
  fs.writeFileSync(OUT_JSON, JSON.stringify({ generated: today, base: BASE, rows, excluded: EXCLUDED, unused }, null, 2) + '\n')
  console.log(`\n${f.length} of ${denom} measurable routes Direction F (${pct}%), ${unmeasured.length} not measurable anonymously, ${unused.length} classes rendered nowhere`)
  console.log(`wrote ${path.relative(path.resolve(ROOT, '..', '..', '..'), OUT).split(path.sep).join('/')}`)
})().catch((e) => { console.error(e); process.exit(1) })
