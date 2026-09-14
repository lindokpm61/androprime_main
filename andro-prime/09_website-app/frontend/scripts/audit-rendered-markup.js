#!/usr/bin/env node
/**
 * The four markup questions that can only be asked of an ASSEMBLED page, asked
 * of every route in a real browser.
 *
 *   # in another terminal, and both env lines matter — see route-conformance.js
 *   MEMBERSHIP_ENABLED=true npm run dev
 *   node scripts/audit-rendered-markup.js
 *   node scripts/audit-rendered-markup.js --routes /blog,/waitlist --verbose
 *
 * WHY THIS EXISTS. Defect register M6, and M6 is a statement about numbers
 * rather than about headings:
 *
 *   "STATE records 'heading skips to 0' from the August accessibility batch.
 *    That was true of the routes measured then. Every route rebuilt since has
 *    been free to reintroduce it, BECAUSE THE NUMBER WAS RECORDED RATHER THAN
 *    THE CHECK."
 *
 * Eight routes had gone back to skipping a level under a figure that said zero.
 * Fixing those eight against a number nothing re-measures buys one clean audit
 * and no more, so the check comes first and the fixes are held by it.
 *
 * WHAT IT MEASURES, and each one is a register row:
 *
 *   HEADINGS (M6)    the rendered h1..h6 sequence never jumps a level.
 *   IDS (M4)         no id appears twice in one document. `/waitlist` rendered
 *                    its signup form in two places, both hard-coding
 *                    id="waitlist-email", so BOTH <label for> resolved to the
 *                    FIRST input: clicking the second form's label moved focus
 *                    to a field elsewhere on the page.
 *   NAMES (M5)       no focusable link or button is announced without a name.
 *                    Each blog card wrapped its photograph in a second link to
 *                    the same article, containing an <img alt=""> and no text,
 *                    so a screen reader met an unnamed link immediately before
 *                    the real one and a keyboard user tabbed the grid twice.
 *   HEAD (M1, M7)    the brand appears once in <title>, and an indexable page's
 *                    title and description fit what a search result shows.
 *
 * 🔴 WHY THE HEAD IS MEASURED HERE AS WELL AS IN `verify-metadata.js`, WHICH IS
 * NOT DUPLICATION. That check is static and runs in `npm test` with no server,
 * so it holds the mechanism shut on every commit — and it can only read
 * `export const metadata` literals. `/blog/[slug]` and `/authors/[slug]` build
 * theirs in `generateMetadata` from the articles table and from
 * `lib/authors.ts`, and M7's two longest descriptions are on exactly those two
 * routes. A static read cannot see them at all. This one reads the rendered
 * `<head>`, so it is the only place those routes are measured.
 *
 * ⚠ THE CHROME IS INCLUDED, DELIBERATELY, and it is the opposite of the rule
 * `route-conformance.js` follows. That report excludes the nav and footer
 * because they are worn by every route and would score an unrebuilt page as
 * rebuilt. Here the chrome is part of the defect: `/order/confirmed` skips h2 to
 * h4 IN ITS FOOTER, and a reader tabbing the page does not know which part of it
 * a component came from. A skip is a skip wherever the two headings were
 * authored.
 *
 * ⚠ ONE VIEWPORT, AND THAT IS AN ARGUMENT RATHER THAN AN OVERSIGHT. R2 was
 * missed for four pages because a check measured a single viewport, so the
 * omission is worth stating: heading order, ids and accessible names come from
 * the DOM, and this app renders one DOM and rearranges it in CSS. Nothing here
 * is responsive. A check whose ANSWER could change with width belongs in
 * `verify-scroll-reveal.js`, which sweeps heights for exactly that reason.
 *
 * 🔴 RESTART THE DEV SERVER BEFORE A RUN YOU INTEND TO BELIEVE, AND THAT IS NOT
 * SUPERSTITION. Measured on 2026-09-14 while this check was being built:
 * `components/shared/Footer.tsx` was edited from `<h3>` to `<h2>`, and a
 * long-lived `next dev` kept serving the h3 — through the edit, through a
 * `.next/cache` delete, and for as long as the process lived. `curl` on the
 * rendered page and a `grep` of the source disagreed with each other for
 * minutes. It happened twice, both times on that file, which is a SHARED SERVER
 * COMPONENT reached through every route's RSC payload.
 *
 * The failure mode is the dangerous direction: the check reports a defect that
 * the tree no longer has, or — worse, and this is the one to fear — reports a
 * FIX that the tree does not have, because the stale payload still holds the old
 * markup. So a run that contradicts the source is a question about the server,
 * not an answer about the code, and the cheapest way to settle it is
 * `curl <route> | grep` against the element in dispute before believing either.
 *
 * Exits 1 on any failure. Routes that redirect an anonymous visitor, and routes
 * behind a dark-launch flag or a secret that is absent, are reported as NOT
 * MEASURED and named.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const {
  ROOT, die, discoverRoutes, SYNTHETIC, FLAG_GATED, TOKEN_GATED, hrefFor,
  hostRouting, browserDriver, chromePath,
} = require('./route-list')

const argv = process.argv.slice(2)
if (argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8')
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n')
  process.exit(0)
}
const opt = (f, d) => { const i = argv.indexOf(f); return i === -1 || i === argv.length - 1 ? d : argv[i + 1] }
const BASE = opt('--base', 'http://localhost:3000')
const WIDTH = parseInt(opt('--width', '1440'), 10)
const VERBOSE = argv.includes('--verbose')

const TITLE_MAX = 60
const DESC_MAX = 160

/*
 * THE ALLOWLIST, a ratchet in the same shape as `verify-retired-vocabulary.js`:
 * route, the date it was listed, the number of offences it had that day, and
 * why it is not simply fixed. A count may be lowered and never raised, and a
 * route that has gone clean is a FAILURE, because a stale exemption is how the
 * next real one hides.
 *
 * Empty is the intended state. An entry here means a defect that needs somebody
 * else's decision, not one that is merely inconvenient.
 */
const ALLOW = []

/*
 * ROUTES WHOSE HEAD LENGTHS ARE SOMEBODY ELSE'S QUESTION.
 *
 * 🔴 A DYNAMIC ROUTE COLLAPSES A CORPUS INTO ONE URL, AND THIS SWEEP'S UNIT IS A
 * URL. `/blog/[slug]` renders ONE sampled article, so any length it reports is a
 * fact about that article and reads as a fact about the route. When M7 was
 * raised it reported an 89-character title and a 192-character description, both
 * correct — and the 5th and 7th worst of nineteen. **17 of 19 articles were
 * over on at least one field**, and this check could not have said so.
 *
 * So the question moved rather than being allowlisted here. Keith's decision,
 * 2026-09-14: articles get `seoTitle` / `seoDescription`, and
 * `scripts/verify-article-seo.ts` measures every row in the corpus against the
 * same bounds, through the same resolver the page renders with.
 *
 * ⚠ ONLY THE LENGTH RULES MOVE. The brand-doubling rule still applies here,
 * because that is a fact about the ROUTE's metadata and the layout template
 * above it, not about any article's copy. Two questions, two owners, and the
 * owner is named rather than implied — an unexplained skip is how `/go` stayed
 * outside the rebuild for six batches.
 */
const HEAD_OWNED_ELSEWHERE = {
  '/blog/[slug]': '`npm run verify:article-seo`, which measures all 19 articles rather than the one this route samples',
}

/* ------------------------------------------------------------------ routes */

const requested = opt('--routes', '').trim()
let routes = discoverRoutes()
for (const s of SYNTHETIC) if (fs.existsSync(path.join(ROOT, s.file))) routes.push(s)
for (const r of routes) if (!r.href) r.href = hrefFor(r.url, 'audit-rendered-markup')

/* 🔴 NOTHING IS EXCLUDED, AND THAT IS THE POINT OF THE ROW THAT ASKED FOR IT.
   `route-conformance.js` excludes `/go` from its count, on a reason that is now
   true — the page fires an analytics event server-side on every render, so a
   sweep of it seeds the campaign's own baseline. M1's doubled title was ON
   `/go`. A route being outside one report's scope says nothing about whether it
   has a heading order, and `/go` is where every Instagram profile visitor
   lands. So this sweep takes the whole surface, and the analytics cost is paid
   knowingly: it is a handful of rows on a dev database, not production. */
if (requested) {
  const want = new Set(requested.split(',').map((r) => r.trim()).filter(Boolean))
  routes = routes.filter((r) => want.has(r.url))
  if (!routes.length) die(`--routes matched nothing. Known: ${discoverRoutes().map((r) => r.url).join(' ')}`)
}
routes.sort((a, b) => a.url.localeCompare(b.url))
if (!requested && routes.length < 20) die(`found only ${routes.length} routes under app/. Fix the collector rather than trusting a pass.`)

/* ----------------------------------------------------------------- measure */

/**
 * Runs INSIDE the page. Everything it returns is read off the rendered DOM.
 *
 * The accessible-name computation is deliberately a NARROW approximation of the
 * spec: aria-labelledby, then aria-label, then text content (including the alt
 * text of descendant images, which `innerText` drops), then title. It is not a
 * full accname implementation and does not try to be — it is tuned to answer
 * one question, "would a screen reader announce this control with nothing to
 * say", and a false negative here is a defect that stays open, never a false
 * alarm that trains someone to switch the check off.
 */
const MEASURE = () => {
  const text = (el) => {
    if (!el) return ''
    let t = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (!t) {
      for (const img of el.querySelectorAll('img[alt]')) {
        const a = (img.getAttribute('alt') || '').trim()
        if (a) { t = a; break }
      }
    }
    if (!t) {
      for (const svg of el.querySelectorAll('svg title')) {
        const a = (svg.textContent || '').trim()
        if (a) { t = a; break }
      }
    }
    return t
  }

  const accName = (el) => {
    const by = el.getAttribute('aria-labelledby')
    if (by) {
      const parts = by.split(/\s+/).map((id) => text(document.getElementById(id))).filter(Boolean)
      if (parts.length) return parts.join(' ')
    }
    const label = (el.getAttribute('aria-label') || '').trim()
    if (label) return label
    const t = text(el)
    if (t) return t
    return (el.getAttribute('title') || '').trim()
  }

  const hiddenFromAT = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      if (n.getAttribute && n.getAttribute('aria-hidden') === 'true') return true
      if (n.hasAttribute && n.hasAttribute('hidden')) return true
    }
    return false
  }

  const rendered = (el) => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    // An `.sr-only` skip link has zero box and IS focusable and IS announced.
    return el.getClientRects().length > 0 || cs.position === 'absolute' || cs.position === 'fixed'
  }

  const focusable = (el) => {
    const ti = el.getAttribute('tabindex')
    if (ti !== null && parseInt(ti, 10) < 0) return false
    if (el.hasAttribute('disabled')) return false
    return true
  }

  const pathOf = (el) => {
    const bits = []
    for (let n = el; n && n.nodeType === 1 && bits.length < 4; n = n.parentElement) {
      let s = n.tagName.toLowerCase()
      if (n.id) { s += '#' + n.id; bits.unshift(s); break }
      const cls = (n.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
      if (cls.length) s += '.' + cls.join('.')
      bits.unshift(s)
    }
    return bits.join(' > ')
  }

  /* ---- headings, in document order, chrome included ---- */
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter((h) => rendered(h) && !hiddenFromAT(h))
    .map((h) => ({
      level: parseInt(h.tagName.slice(1), 10),
      text: text(h).slice(0, 70),
      where: h.closest('footer') ? 'footer' : h.closest('header,nav') ? 'header' : 'page',
    }))

  /* ---- duplicate ids ---- */
  const byId = new Map()
  for (const el of document.querySelectorAll('[id]')) {
    const id = el.getAttribute('id')
    if (!id) continue
    if (!byId.has(id)) byId.set(id, [])
    byId.get(id).push(pathOf(el))
  }
  const duplicateIds = [...byId.entries()]
    .filter(([, els]) => els.length > 1)
    .map(([id, els]) => ({ id, count: els.length, where: els.slice(0, 3) }))

  /* ---- focusable things with nothing to announce ---- */
  const unnamed = []
  for (const el of document.querySelectorAll('a[href], button, [role="button"], [role="link"]')) {
    if (!rendered(el)) continue
    if (hiddenFromAT(el)) continue
    if (!focusable(el)) continue
    if (accName(el)) continue
    unnamed.push({
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute('href') || '',
      where: pathOf(el),
    })
  }

  /* ---- the head ---- */
  const metaContent = (sel) => {
    const el = document.querySelector(sel)
    return el ? (el.getAttribute('content') || '') : null
  }
  const robots = metaContent('meta[name="robots"]') || ''

  return {
    title: document.title,
    description: metaContent('meta[name="description"]'),
    noindex: /noindex/i.test(robots),
    headings,
    duplicateIds,
    unnamed,
    h1Count: headings.filter((h) => h.level === 1).length,
  }
}

/* -------------------------------------------------------------------- run */

const driver = browserDriver()
const chrome = chromePath()
const { originFor, resolverArgs, note: hostNote } = hostRouting(BASE)

/* The brand the root title template appends, read from the layout rather than
   typed, for the same reason `verify-metadata.js` reads it: a changed template
   must not silently disarm the rule that depends on it. */
const BRAND = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'app', 'layout.tsx'), 'utf8')
  const m = /template\s*:\s*(['"])([^'"]*)\1/.exec(src)
  if (!m) die('no title.template in app/layout.tsx. Fix that file rather than this line.')
  return m[2].replace('%s', '').replace(/^\s*\|\s*/, '').trim()
})()

;(async () => {
  console.log(`Rendered markup audit against ${BASE} at ${WIDTH}px, ${routes.length} routes`)
  if (hostNote) console.log(`  note  ${hostNote}`)
  console.log('')

  const browser = await driver.launch({
    executablePath: chrome,
    headless: 'new',
    args: ['--no-sandbox', ...resolverArgs],
  })

  const findings = []
  const notMeasured = []
  const measured = []

  for (const r of routes) {
    const page = await browser.newPage()
    await page.setViewport({ width: WIDTH, height: 1000 })
    let status = 0
    let landed = ''
    let data = null
    try {
      const resp = await page.goto(originFor(r.url) + r.href, { waitUntil: 'networkidle0', timeout: 180000 })
      status = resp ? resp.status() : 0
      landed = new URL(page.url()).pathname
      data = await page.evaluate(MEASURE)
    } catch (e) {
      notMeasured.push({ url: r.url, why: `load failed: ${String(e.message || e).split('\n')[0]}` })
      await page.close()
      continue
    }
    await page.close()

    const expected = r.expectStatus || 200
    if (status === 404 && r.url in FLAG_GATED) {
      notMeasured.push({ url: r.url, why: `404 with the dark-launch flag off; needs \`${FLAG_GATED[r.url]}\`` })
      continue
    }
    if (status === 404 && r.url in TOKEN_GATED) {
      notMeasured.push({ url: r.url, why: `404 without its secret; needs \`${TOKEN_GATED[r.url]}\`` })
      continue
    }
    if (landed !== r.href && !r.expectStatus) {
      notMeasured.push({ url: r.url, why: `redirects to ${landed} for an anonymous visitor` })
      continue
    }
    if (status !== expected) {
      findings.push({ url: r.url, kind: 'status', detail: `returned ${status}, expected ${expected}` })
      continue
    }

    measured.push(r.url)

    /* ---- M6: heading order ---- */
    const hs = data.headings
    for (let i = 1; i < hs.length; i++) {
      if (hs[i].level > hs[i - 1].level + 1) {
        findings.push({
          url: r.url,
          kind: 'heading',
          detail:
            `h${hs[i - 1].level} -> h${hs[i].level} skips h${hs[i - 1].level + 1}` +
            ` (${hs[i].where})\n      before: ${JSON.stringify(hs[i - 1].text)}` +
            `\n      after:  ${JSON.stringify(hs[i].text)}`,
        })
      }
    }

    /* ---- M4: duplicate ids ---- */
    for (const d of data.duplicateIds) {
      findings.push({
        url: r.url,
        kind: 'id',
        detail: `id ${JSON.stringify(d.id)} appears ${d.count} times: ${d.where.join(' , ')}`,
      })
    }

    /* ---- M5: focusable, announced with nothing ---- */
    for (const u of data.unnamed) {
      findings.push({
        url: r.url,
        kind: 'name',
        detail: `<${u.tag}${u.href ? ` href="${u.href}"` : ''}> is focusable with no accessible name: ${u.where}`,
      })
    }

    /* ---- M1: the brand, once ---- */
    const brandHits = BRAND ? data.title.split(BRAND).length - 1 : 0
    if (brandHits > 1) {
      findings.push({
        url: r.url,
        kind: 'title',
        detail: `<title> contains ${JSON.stringify(BRAND)} ${brandHits} times: ${JSON.stringify(data.title)}`,
      })
    }

    /* ---- M7: what a search result shows ---- */
    if (!data.noindex && !(r.url in HEAD_OWNED_ELSEWHERE)) {
      if (data.title.length > TITLE_MAX) {
        findings.push({ url: r.url, kind: 'head', detail: `<title> is ${data.title.length} characters, over ${TITLE_MAX}: ${JSON.stringify(data.title)}` })
      }
      if (data.description === null) {
        findings.push({ url: r.url, kind: 'head', detail: 'indexable page with no meta description; it inherits the root layout\'s, so this page and the homepage describe themselves identically' })
      } else if (data.description.length > DESC_MAX) {
        findings.push({ url: r.url, kind: 'head', detail: `meta description is ${data.description.length} characters, over ${DESC_MAX}` })
      }
    }

    if (VERBOSE) {
      console.log(`  ${r.url}`)
      console.log(`    title ${data.title.length}  desc ${data.description === null ? '-' : data.description.length}  ${data.noindex ? 'noindex' : 'indexable'}  h1x${data.h1Count}`)
      console.log(`    headings ${hs.map((h) => 'h' + h.level).join(' ')}`)
    }
  }

  await browser.close()

  /* ---- the ratchet ---- */
  const byRoute = new Map()
  for (const f of findings) byRoute.set(f.url, (byRoute.get(f.url) || 0) + 1)
  const hard = []
  const allowed = []
  const seenAllow = new Set()
  for (const f of findings) {
    const a = ALLOW.find((x) => x.route === f.url)
    if (!a) { hard.push(f); continue }
    seenAllow.add(f.url)
    if (byRoute.get(f.url) > a.max) hard.push({ ...f, detail: `${f.detail}\n      (route allowlisted at ${a.max} on ${a.since}; it now has ${byRoute.get(f.url)}. The ratchet only turns down.)` })
    else allowed.push(f)
  }
  /* 🔴 THE STALE-EXEMPTION RULE ONLY APPLIES TO A FULL SWEEP. Under `--routes`
     the allowlisted route is usually not in the set, so "it has no offences"
     would mean "it was not looked at" — and the first run of this script under
     `--routes` reported exactly that, as a failure, on a clean tree. A rule
     that cannot tell absence of evidence from evidence of absence must not be
     armed in the mode where absence is the normal case. */
  if (!requested) {
    for (const a of ALLOW) {
      if (!seenAllow.has(a.route)) {
        hard.push({ url: a.route, kind: 'allowlist', detail: `allowlisted at ${a.max} offences since ${a.since}, and it now has none. Remove the entry.` })
      }
    }
  } else {
    const unseen = ALLOW.filter((a) => !measured.includes(a.route))
    if (unseen.length) console.log(`  note  --routes run: ${unseen.length} allowlist entr${unseen.length === 1 ? 'y is' : 'ies are'} outside this route set and were not re-tested (${unseen.map((a) => a.route).join(', ')}).\n`)
  }

  /* Printed on every run, pass or fail. A question this check has handed to
     another one must be visible here, or the next reader infers from silence
     that it was asked. */
  const handed = Object.entries(HEAD_OWNED_ELSEWHERE).filter(([url]) => measured.includes(url))
  if (handed.length) {
    console.log('')
    console.log(`Head lengths NOT judged here (${handed.length}), because a dynamic route samples a corpus:`)
    for (const [url, owner] of handed) console.log(`  ${url}  ->  ${owner}`)
  }

  console.log('')
  if (notMeasured.length) {
    console.log(`Not measured (${notMeasured.length}):`)
    for (const n of notMeasured) console.log(`  ${n.url}  ${n.why}`)
    console.log('')
  }

  if (allowed.length) {
    console.log(`Allowlisted (${allowed.length}), each on a dated, shrinking exemption:`)
    for (const f of allowed) console.log(`  [${f.kind}] ${f.url}  ${f.detail}`)
    console.log('')
  }

  if (hard.length) {
    const counts = {}
    for (const f of hard) counts[f.kind] = (counts[f.kind] || 0) + 1
    console.error(`${hard.length} failure${hard.length === 1 ? '' : 's'} over ${measured.length} measured routes: ` +
      Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ') + '\n')
    let last = ''
    for (const f of hard) {
      if (f.url !== last) { console.error(`  ${f.url}`); last = f.url }
      console.error(`    [${f.kind}] ${f.detail}`)
    }
    console.error('')
    process.exit(1)
  }

  console.log(
    `audit-rendered-markup: ${measured.length} routes clean ` +
    `(no heading skipped, no id twice, every focusable control named, the brand once in every title, ` +
    `indexable titles <= ${TITLE_MAX} and descriptions <= ${DESC_MAX}).`
  )
})()
