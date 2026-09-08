#!/usr/bin/env node
/**
 * Measure every route against Direction F and write the answer into the repo.
 *
 *   # in another terminal, and BOTH env vars matter — see below
 *   MEMBERSHIP_ENABLED=true NEXT_PUBLIC_APP_URL=http://app.andro-prime.com npm run dev
 *   node scripts/route-conformance.js        # writes design/route-conformance.md
 *   node scripts/route-conformance.js --base http://localhost:3001
 *
 * 🔴 TWO HOSTS, ONE APP, AND THAT CHANGES HOW THIS IS RUN (2026-09-08).
 * `lib/hosts.ts` serves marketing from the apex and `/auth` plus the
 * authenticated app from `app.andro-prime.com`. Each route is therefore fetched
 * from the origin that OWNS it, with Chrome's `--host-resolver-rules` mapping the
 * app hostname onto the dev server so the request arrives with the real Host
 * header. Without that, an app-host route 308s to the PRODUCTION app host and
 * this script measures a different deployment: before it was fixed, the five
 * `/auth/*` rows read "0 classes, not rebuilt" while describing what `main`
 * serves, and the redirect check could not see it because a cross-host 308 keeps
 * the same pathname.
 *
 * ⚠ `NEXT_PUBLIC_APP_URL=http://app.andro-prime.com` ON THE DEV SERVER IS NOT
 * OPTIONAL, and the failure is ugly rather than obvious. The resolver changes
 * only where a NAME resolves; it does not change a scheme. The middleware
 * redirects with ABSOLUTE urls built from that variable, so if it still says
 * `https://`, every app-host route that redirects gets a TLS handshake against a
 * plain-HTTP dev server and dies as `ERR_SSL_PROTOCOL_ERROR`. Setting it to the
 * `http://` form makes the app's own absolute redirects match what the resolver
 * can serve. Do NOT set it to `http://localhost:3000` instead: that makes the
 * app host and the apex the same origin, and the middleware then routes the 28
 * marketing routes away and they all fail. There is no single origin that serves
 * both halves, by design.
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
 * on NO route this run could reach. That is the one output the retired
 * `reconcile-f-css.js` had that carried real information (its "unpaired
 * selectors"), except measured against rendered routes rather than against
 * drawings, which is what makes it mean "waiting for a page" rather than
 * "disagrees with a mockup".
 *
 * ⚠ IT IS SPLIT IN TWO, since 2026-09-08, AND THE SPLIT IS THE POINT. The list
 * used to be published under "either waiting for a page, or dead", which was
 * wrong about 78 of its 105 entries. A class is absent from these counts for
 * three innocent reasons besides being dead: the shared chrome is excluded by
 * landmark on purpose (`.f-nav`, `.f-footer`), a control can sit behind an
 * interaction this run never performs (`/test-selector`'s form is at step 4 of
 * five), and an error or success block needs a request to have resolved. So the
 * discriminator is whether any marketing SOURCE file still asks for the class,
 * using the same static read `sourceSignal` does. Only the group in no source
 * file is a deletion candidate, and even there a route may simply be unbuilt.
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

/* WHICH HOST SERVES WHAT. Mirrors APP_ROUTE_PREFIXES in lib/hosts.ts, which is
   the single source of truth for the route→host mapping. Duplicated here rather
   than imported because this is a plain CJS script and that module is TS with
   path aliases; the guard below fails loudly if the two ever diverge, so the copy
   cannot rot silently. */
const APP_HOST = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.andro-prime.com').replace(/\/+$/, '')
const APP_PREFIXES = ['/auth', '/results-dashboard', '/account', '/subscriptions', '/founding-member-status', '/supplement-waitlist-status', '/order/confirmed', '/subscription/confirmed']
{
  // The copy above must equal the real list. A route silently added to
  // lib/hosts.ts and not here would be measured on the wrong host and reported
  // with confidence, which is the exact failure this whole patch is fixing.
  const ts = fs.readFileSync(path.join(ROOT, 'lib', 'hosts.ts'), 'utf8')
  const block = ts.match(/export const APP_ROUTE_PREFIXES = \[([\s\S]*?)\] as const/)
  if (!block) die('could not find APP_ROUTE_PREFIXES in lib/hosts.ts. Fix this reader rather than trusting a pass.')
  // Comments FIRST. The real array carries a long comment explaining why
  // '/membership' is NOT in it, and a bare string match reads that quoted path
  // as a member, so the guard failed on its own reader and reported a list
  // containing the one route the comment exists to exclude.
  const body = block[1].replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ')
  const real = [...new Set([...body.matchAll(/'([^']+)'/g)].map((m) => m[1]))].sort()
  const mine = [...APP_PREFIXES].sort()
  if (JSON.stringify(real) !== JSON.stringify(mine)) {
    die(`APP_PREFIXES here disagrees with lib/hosts.ts.\n  hosts.ts: ${real.join(' ')}\n  here:     ${mine.join(' ')}\nUpdate this script's copy.`)
  }
}
/* Exact-or-segment-boundary, never a bare startsWith: '/accounts-payable' must
   not match '/account'. Same rule lib/hosts.ts matchesPrefix applies. */
const onAppHost = (url) => APP_PREFIXES.some((p) => url === p || url.startsWith(p + '/'))

/* 🔴 THE HOSTNAME IS THE APP HOST'S; THE SCHEME AND PORT ARE THE DEV SERVER'S.
   `APP_HOST` is `https://app.andro-prime.com`. Chrome's resolver MAP redirects
   where the NAME resolves to, and changes nothing else, so navigating to the
   https URL made Chrome open a TLS handshake against a plain-HTTP dev server and
   every app-host route came back as a load failure. `--ignore-certificate-errors`
   does not help: there is no certificate, there is no TLS at all.
   So the fetch origin keeps the app HOSTNAME, which is the only part the
   middleware reads, and takes its scheme from BASE. The Host header still says
   `app.andro-prime.com`, which is the whole point. */
const APP_RESOLVABLE = !/^(localhost|127\.|\[?::1)/.test(new URL(APP_HOST).hostname)
const APP_FETCH_ORIGIN = APP_RESOLVABLE
  ? `${new URL(BASE).protocol}//${new URL(APP_HOST).hostname}`
  : APP_HOST
const originFor = (url) => (onAppHost(url) ? APP_FETCH_ORIGIN : BASE)

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
  /* Map the app hostname onto whatever host:port BASE points at, so an app-host
     route is fetched with its REAL Host header and the middleware serves it
     instead of 308-ing to production. Only applied when the app host is a real
     remote name; if somebody has already pointed NEXT_PUBLIC_APP_URL at
     localhost, there is nothing to map. */
  const appHostname = new URL(APP_HOST).hostname
  const baseAuthority = new URL(BASE).host
  const resolverArgs = APP_RESOLVABLE
    ? [`--host-resolver-rules=MAP ${appHostname} ${baseAuthority}`]
    : []
  if (APP_RESOLVABLE) console.log(`  note  ${appHostname} mapped to ${baseAuthority}; app-host routes fetched from ${APP_FETCH_ORIGIN}`)
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', ...resolverArgs] })
  const rows = []
  const seenClasses = new Set()
  for (const r of measured) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 1000 })
    let status = 0
    let data = null
    let landed = ''
    let landedOrigin = ''
    try {
      const resp = await page.goto(originFor(r.url) + r.href, { waitUntil: 'networkidle0', timeout: 180000 })
      status = resp ? resp.status() : 0
      // 🔴 THE ORIGIN IS RECORDED, NOT JUST THE PATHNAME, since 2026-09-08.
      // `middleware.ts` host-routes /auth, /account, /results-dashboard and the
      // rest to the APP host (lib/hosts.ts APP_ROUTE_PREFIXES). That is a 308 to
      // a different ORIGIN at the SAME path, so a pathname-only comparison saw
      // no redirect at all and scored the route as rendered.
      // What actually rendered was https://app.andro-prime.com, i.e. PRODUCTION,
      // which serves `main`. So the five /auth/* rows read "0 classes, not
      // rebuilt" while measuring a different deployment, confidently and
      // silently. That is worse than the "not measured" it should have said.
      landed = new URL(page.url()).pathname
      landedOrigin = new URL(page.url()).origin
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
    const offOrigin = !!landedOrigin && landedOrigin !== new URL(originFor(r.url)).origin
    const redirected = !r.expectStatus && landed && (landed !== r.href || offOrigin)
    const flagged = status === 404 && r.url in FLAG_GATED

    let verdict
    let note = ''
    if (flagged) { verdict = 'not measured'; note = `404 with the dark-launch flag off; needs \`${FLAG_GATED[r.url]}\`` }
    // Named separately from the login-redirect case because the remedy is
    // different and knowable: run with the app host pointed at this dev server.
    else if (offOrigin) { verdict = 'not measured'; note = `host-routed to \`${landedOrigin}\`, so what rendered was that deployment and not this branch; measurable with \`NEXT_PUBLIC_APP_URL=${BASE}\`` }
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
    // An app-host route that will not load is almost always the scheme mismatch
    // the header describes, so name the remedy rather than leave the symptom.
    const appFails = errors.filter((e) => onAppHost(e.url))
    if (appFails.length && APP_RESOLVABLE) {
      const h = new URL(APP_HOST).hostname
      console.error(`\n${appFails.length} of them are served by ${h}, not by the apex.`)
      console.error('The usual cause is the dev server advertising https for the app host, so the')
      console.error('middleware\'s absolute redirects ask for TLS from a plain-HTTP server. Restart it as:')
      console.error(`  MEMBERSHIP_ENABLED=true NEXT_PUBLIC_APP_URL=http://${h} npm run dev`)
    }
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

  /* THE THIRD CASE, added 2026-09-08. A class can be absent from every rendered
     route and still be neither waiting nor dead: it can be behind an
     interaction. This renderer loads each route once, anonymously, and never
     clicks, so a form control that appears at step 4 of a five-step quiz is
     invisible to it.
     The discriminator is the SOURCE, using the same static read that supplies
     the not-measured routes' second opinion: a class written in a marketing
     source file is being rendered by SOMETHING, whatever this run could reach.
     Naming the two groups separately is the whole point, because "dead" invites
     a deletion and "reachable only by interacting" forbids one. */
  const inSource = new Set()
  for (const dir of [path.join(ROOT, 'app'), path.join(ROOT, 'components')]) {
    const walk = (d) => {
      if (!fs.existsSync(d)) return
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name)
        if (e.isDirectory()) { if (!['node_modules', '.next', '.git', '.impeccable', 'out'].includes(e.name)) walk(p) }
        else if (/\.(tsx|ts)$/.test(e.name)) {
          const s = fs.readFileSync(p, 'utf8')
          for (const m of s.matchAll(/(?<![A-Za-z0-9_-])((?:f|fb)-[a-z][a-z0-9-]*)(?![A-Za-z0-9_-])/g)) inSource.add(m[1])
        }
      }
    }
    walk(dir)
  }
  const stateOnly = unused.filter((c) => inSource.has(c))
  const orphan = unused.filter((c) => !inSource.has(c))
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

These exist in the stylesheets and appear on no route THIS RUN COULD REACH. Each
route is loaded once, anonymously, and never interacted with, so the list below is
split by whether any marketing source file still asks for the class. This replaces
the retired \`reconcile-f-css.js\` "unpaired selectors" figure, measured against
rendered routes rather than against the journey frames.

### Asked for by a source file, so not dead (${stateOnly.length})

**Do not read this group as deletable.** Something renders them; this run did not
see them, and there are three separate reasons for that, so absence here is not
evidence of absence:

1. **Excluded by design.** A route's class set deliberately omits the shared
   chrome, counted by landmark, so \`.f-nav\`, \`.f-footer\` and the cookie banner's
   classes render on every route and appear in none of the counts.
2. **Behind an interaction.** Each route is loaded once and never clicked. The
   form controls on \`/test-selector\` are at step 4 of a five-step quiz.
3. **Behind a request state.** An error or success block needs a POST to have
   failed or succeeded.

⚠ The old wording put all of these under "waiting for a page, or dead", which was
wrong about most of the list: it is ${stateOnly.length} of ${unused.length}.

${stateOnly.length ? stateOnly.map((c) => `\`.${c}\``).join(', ') : '_none_'}

### In no source file at all (${orphan.length})

Either a component waiting for a page that has not been rebuilt, or dead. This is
the group to read when looking for something to delete, and even here a class may
be waiting: ${not.length} routes are still on the old design.

${orphan.length ? orphan.map((c) => `\`.${c}\``).join(', ') : '_none_'}

---

_Generated by \`frontend/scripts/route-conformance.js\` on ${today}. ${rows.length} routes
rendered at 1440px against a dev server, each on the host that serves it (\`${APP_PREFIXES.join('`, `')}\` on the app host, everything else on the apex).${flagsOn.length ? ` Dark-launch flags on for this run, inferred from the routes that rendered: ${flagsOn.map((x) => `\`${x}\``).join(', ')}.` : ' No dark-launch flags were on.'}_
`

  fs.writeFileSync(OUT, md)
  fs.writeFileSync(OUT_JSON, JSON.stringify({ generated: today, base: BASE, rows, excluded: EXCLUDED, unused, stateOnly, orphan }, null, 2) + '\n')
  console.log(`\n${f.length} of ${denom} measurable routes Direction F (${pct}%), ${unmeasured.length} not measurable anonymously, ${unused.length} classes not rendered (${stateOnly.length} asked for by a source file, ${orphan.length} in no source)`)
  console.log(`wrote ${path.relative(path.resolve(ROOT, '..', '..', '..'), OUT).split(path.sep).join('/')}`)
})().catch((e) => { console.error(e); process.exit(1) })
