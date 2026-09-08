#!/usr/bin/env node
/**
 * Measure every text node that sits on a DARK ground against its real
 * composited backdrop, on real rendered pages.
 *
 *   npm run dev                                  # in another terminal
 *   node scripts/audit-dark-contrast.js          # default: 16 routes at 1440
 *   node scripts/audit-dark-contrast.js --base http://localhost:3001 --routes /demo,/blog
 *
 * WHY THIS EXISTS, AND WHY IT IS SEPARATE FROM `verify-on-ink.js`. Keith
 * reported unreadable text on black panels on 2026-09-08; the worst node
 * measured 2.39:1 against a 4.5 requirement, on the line that says CALL 999.
 * No static check could have found it, because nothing about the offending rule
 * was wrong when read: `.fb-alert p` was written for a light card and was
 * correct there. The defect was INHERITANCE — a dark bar picked the rule up
 * later — and inheritance only exists once the page is assembled.
 *
 * So this is the deep half of the pair. `verify-on-ink.js` runs in `npm test`
 * and holds the MECHANISM shut: the ramp stays readable, the four copies of the
 * dark table stay equal, the panel does not paint itself with the token it
 * remaps. This one needs a dev server and a browser, so it runs on demand —
 * whenever a dark panel is added, moved, or re-parented. It is what produced
 * the "12 failing text nodes to 0 across 16 routes" figure in STATE.md.
 *
 * WHAT IT MEASURES, and why each part is there rather than being simplified:
 *   - the backdrop is COMPOSITED up the ancestor chain, because a translucent
 *     panel over a dark stage is not the colour its own `background` says
 *   - element `opacity` is folded into the text alpha, because over a dark
 *     ground opacity composites toward the BACKGROUND: it darkens grey text on
 *     black rather than quieting it, which is what made the original report
 *     hard to read
 *   - only leaf-ish nodes with their own text are judged, so a container is not
 *     blamed for its children
 *   - only DARK grounds are reported (luminance < 0.2), which is the class of
 *     defect this exists for; light-ground contrast is a separate sweep
 *
 * Exits 1 if any text node on a dark ground is under its WCAG AA floor.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const argv = process.argv.slice(2)
if (argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8')
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n')
  process.exit(0)
}
const opt = (f, d) => { const i = argv.indexOf(f); return i === -1 || i === argv.length - 1 ? d : argv[i + 1] }

const BASE = opt('--base', 'http://localhost:3000')
const WIDTH = parseInt(opt('--width', '1440'), 10)

const DEFAULT_ROUTES = [
  '/', '/kits', '/kits/testosterone', '/kits/energy-recovery', '/kits/hormone-recovery',
  '/how-it-works', '/membership', '/blog',
  '/blog/andropause-male-menopause', '/blog/14-signs-of-vitamin-d-deficiency',
  '/blog/why-am-i-always-tired', '/blog/myth-of-normal-range', '/blog/low-vitamin-d-symptoms',
  '/authors/dr-ewa-lindo', '/authors/keith-antony', '/demo',
]
const ROUTES = opt('--routes', '').trim() ? opt('--routes', '').split(',').map((r) => r.trim()).filter(Boolean) : DEFAULT_ROUTES

/* ---------- puppeteer-core and Chrome are located, not depended on ---------- */
// Same resolution as 12_operations/automation/shot.js: neither is a declared
// dependency of this repo, so both are found at run time and named if missing.

const PUPPETEER_CANDIDATES = [
  'puppeteer-core',
  path.resolve(__dirname, '../node_modules/puppeteer-core'),
  path.resolve(__dirname, '../../../12_operations/automation/node_modules/puppeteer-core'),
]
let puppeteer = null
for (const c of PUPPETEER_CANDIDATES) { try { puppeteer = require(c); break } catch { /* next */ } }
if (!puppeteer) {
  console.error(
    'puppeteer-core not found. Tried:\n' + PUPPETEER_CANDIDATES.map((c) => `  ${c}`).join('\n') +
    `\n\nFix: npm install puppeteer-core --prefix "${path.resolve(__dirname, '../../../12_operations/automation')}"`
  )
  process.exit(1)
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)
const chrome = CHROME_CANDIDATES.find((c) => fs.existsSync(c))
if (!chrome) {
  console.error('no Chrome binary found. Tried:\n' + CHROME_CANDIDATES.map((c) => `  ${c}`).join('\n') + '\n\nFix: set CHROME_PATH to the executable.')
  process.exit(1)
}

/* ---------- the audit, evaluated inside the page ---------- */

const AUDIT = () => {
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/)
    if (!m) return null
    const p = m[1].split(',').map((v) => parseFloat(v.trim()))
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 }
  }
  const over = (fg, bg) => fg.rgb.map((c, i) => c * fg.a + bg[i] * (1 - fg.a))

  // The backdrop is whatever actually ends up behind the glyphs: every
  // translucent ancestor composited down onto the root's own ground.
  const bgOf = (el) => {
    let n = el
    let acc = [255, 255, 255]
    const chain = []
    while (n && n !== document.documentElement) {
      const c = parse(getComputedStyle(n).backgroundColor)
      if (c && c.a > 0) chain.push(c)
      n = n.parentElement
    }
    const root = parse(getComputedStyle(document.documentElement).backgroundColor)
    if (root && root.a > 0) chain.push(root)
    for (let i = chain.length - 1; i >= 0; i--) acc = over(chain[i], acc)
    return acc
  }

  const out = []
  for (const el of document.querySelectorAll('*')) {
    if (el.children.length > 0) {
      const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      if (!hasOwnText) continue
    }
    const txt = (el.textContent || '').trim()
    if (txt.length < 2) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    const r = el.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const opa = parseFloat(cs.opacity)
    const col = parse(cs.color)
    if (!col) continue
    const bg = bgOf(el)
    const eff = { rgb: col.rgb, a: col.a * (isNaN(opa) ? 1 : opa) }
    const fg = over(eff, bg)
    const cr = ratio(fg, bg)
    const size = parseFloat(cs.fontSize)
    const weight = parseInt(cs.fontWeight, 10) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const need = large ? 3 : 4.5
    if (cr < need && lum(bg) < 0.2) {
      const cls = el.className && (el.className.baseVal !== undefined ? el.className.baseVal : String(el.className))
      out.push({
        cls: String(cls || '').slice(0, 46),
        tag: el.tagName,
        ratio: Math.round(cr * 100) / 100,
        need,
        size: Math.round(size * 10) / 10,
        opacity: isNaN(opa) ? 1 : opa,
        color: cs.color,
        bg: 'rgb(' + bg.map((v) => Math.round(v)).join(',') + ')',
        text: txt.slice(0, 46),
      })
    }
  }
  const seen = new Set()
  return out.filter((o) => { const k = o.cls + o.ratio; if (seen.has(k)) return false; seen.add(k); return true })
}

/* ---------- drive ---------- */

;(async () => {
  console.log(`Dark-ground contrast, ${ROUTES.length} routes at ${WIDTH}px against ${BASE}\n`)
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox'] })
  let total = 0
  let loadFails = 0
  const byClass = {}
  for (const route of ROUTES) {
    const page = await browser.newPage()
    await page.setViewport({ width: WIDTH, height: 1200 })
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 120000 })
    } catch {
      console.log(`${route}  LOAD FAIL — is the dev server up on ${BASE}?`)
      loadFails++
      await page.close()
      continue
    }
    const fails = await page.evaluate(AUDIT)
    if (fails.length) {
      console.log(`\n${route}`)
      for (const f of fails) {
        console.log(`  ${String(f.ratio).padStart(5)}:1 (need ${f.need})  ${f.size}px op:${f.opacity}  .${f.cls || '(none)'}  ${f.color} on ${f.bg}`)
        console.log(`         "${f.text}"`)
        byClass[f.cls] = (byClass[f.cls] || 0) + 1
      }
    }
    total += fails.length
    await page.close()
  }
  await browser.close()

  console.log('\n================ SUMMARY ================')
  console.log(`routes audited: ${ROUTES.length - loadFails}${loadFails ? ` (${loadFails} failed to load)` : ''}`)
  console.log(`failing text nodes on dark grounds: ${total}`)
  if (total) {
    console.log('by class:')
    Object.entries(byClass).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  .${k || '(none)'}`))
    console.log('\nThe fix is almost never a second colour on the failing rule. Put `.f-on-ink`')
    console.log('on the element that HAS the dark background and delete its own `background`')
    console.log('declaration: it re-points the ink ramp for the whole subtree. See f-primitives.css.')
  }
  // A route that would not load is not a pass.
  process.exit(total > 0 || loadFails === ROUTES.length ? 1 : 0)
})().catch((e) => { console.error(e); process.exit(1) })
