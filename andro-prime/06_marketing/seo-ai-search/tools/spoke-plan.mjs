// Turn 149 fan-out children into a SPOKE PLAN: what becomes a page, what becomes an FAQ
// entry inside a page, and what belongs to a product page instead of the blog.
//
// The distinction matters because 122 mechanically-distinct clusters is not 122 articles.
// 60% of them are 0-10/mo long-tail phrasings of a question a sibling already asks, and
// shipping each as its own page is how a 18-article site becomes a 140-thin-page site.
import fs from 'node:fs'

const CSV = 'd:/Androprime_main/andro-prime/06_marketing/seo-ai-search/keywords.csv'
const parseLine = (l) => {
  const o = []; let c = '', q = false
  for (let i = 0; i < l.length; i++) {
    const ch = l[i]
    if (q) { if (ch === '"') { if (l[i + 1] === '"') { c += '"'; i++ } else q = false } else c += ch }
    else if (ch === '"') q = true
    else if (ch === ',') { o.push(c); c = '' }
    else c += ch
  }
  o.push(c); return o
}

// Commercial-transactional: the searcher wants a price or a product, and the repo already
// routes these to /kits and /supplements. Sending them to a blog article is 4b check 2's
// exact failure ("vitamin d test" -> already routed to the Kit 2 page).
const PRODUCT_RX = /\b(price|cost|kit|tesco|boots|at home|home test|buy|cheap|near|order|superdrug|amazon|tablets|capsules|supplement)\b/i

const rows = fs.readFileSync(CSV, 'utf-8').replace(/^\ufeff/, '').split(/\r?\n/).filter((l) => l.trim()).slice(1).map(parseLine)
const fan = rows.filter((r) => r[15] === 'fanout' && r[18] === 'WINNABLE')

// The intent stem: the content-bearing words, minus question scaffolding. Two queries with
// the same stem are the same article no matter how the question is phrased —
// "what is a bad liver function test result" and "liver function blood test abnormal"
// are one page.
const SCAFFOLD = new Set(['what', 'how', 'why', 'when', 'where', 'which', 'who', 'is', 'are', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will', 'my', 'me', 'i', 'you', 'your', 'the', 'a', 'an', 'of', 'in', 'on', 'to', 'for', 'and', 'it', 'its', 'that', 'this', 'be', 'been', 'am', 'get', 'got', 'have', 'has', 'if', 'so', 'no', 'not', 'uk', 'mean', 'means', 'meaning', 'much', 'many', 'take', 'takes', 'about', 'from', 'with', 'by', 'at', 'or', 'test', 'tests', 'testing', 'blood', 'levels', 'level'])
const SYN = { raise: 'increase', boost: 'increase', increasing: 'increase', boosting: 'increase', high: 'high', elevated: 'high', raised: 'high', abnormal: 'high', bad: 'high', red: 'high', flag: 'high', low: 'low', drains: 'low', foods: 'food', eat: 'food', eating: 'food', drink: 'food', diet: 'food', supplement: 'supplement', supplements: 'supplement', tablets: 'supplement', symptom: 'sign', symptoms: 'sign', signs: 'sign', warning: 'sign', normal: 'range', ranges: 'range', values: 'range', chart: 'range', results: 'result', explained: 'result', reading: 'result', read: 'result' }
const stem = (q) => [...new Set(q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/)
  .map((w) => w.replace(/s$/, '')).map((w) => SYN[w] || SYN[w + 's'] || w)
  .filter((w) => w && !SCAFFOLD.has(w)))].sort().join(' ')

// A child whose intent stem equals a PUBLISHED article's stem is that article, not a new
// page. This is the 2026-06-22 failure verbatim: "ferritin test" reached accepted+scaffold
// as a duplicate of the already-drafted ferritin-blood-test before it was caught and rolled
// back. Catch it here, where it costs nothing.
const BLOG = 'd:/Androprime_main/andro-prime/09_website-app/frontend/content/blog'
const publishedStems = new Map(fs.readdirSync(BLOG).filter((f) => f.endsWith('.mdx'))
  .map((f) => f.replace(/\.mdx$/, '')).map((s) => [stem(s.replace(/-/g, ' ')), s]))

const hubs = {}
for (const r of fan) {
  const m = /fanout child of "([^"]+)"/.exec(r[10] || '')
  const parent = m ? m[1].split(' | ')[0] : '?'
  const h = hubs[parent] = hubs[parent] || { spokes: new Map(), product: [] }
  const vol = +r[1] || 0
  if (PRODUCT_RX.test(r[0])) { h.product.push({ q: r[0], vol }); continue }
  const k = stem(r[0])
  const collide = publishedStems.get(k)
  if (collide) { (h.collide = h.collide || []).push({ q: r[0], vol, article: collide }); continue }
  const s = h.spokes.get(k) || { stem: k, queries: [], vol: 0, kd: [] }
  s.queries.push({ q: r[0], vol }); s.vol += vol
  if (r[2]) s.kd.push(+r[2])
  h.spokes.set(k, s)
}

const SPOKE_MIN_VOL = 50
let nSpoke = 0, nFaq = 0, nProd = 0, volSpoke = 0
const plan = []
for (const [parent, h] of Object.entries(hubs)) {
  const all = [...h.spokes.values()].sort((a, b) => b.vol - a.vol)
  const spokes = all.filter((s) => s.vol >= SPOKE_MIN_VOL)
  const faq = all.filter((s) => s.vol < SPOKE_MIN_VOL)
  nSpoke += spokes.length; nFaq += faq.reduce((n, s) => n + s.queries.length, 0); nProd += h.product.length
  volSpoke += spokes.reduce((n, s) => n + s.vol, 0)
  plan.push({ parent, spokes, faq, product: h.product, collide: h.collide || [] })
}
plan.sort((a, b) => b.spokes.reduce((n, s) => n + s.vol, 0) - a.spokes.reduce((n, s) => n + s.vol, 0))

console.log(`SPOKE ARTICLES TO WRITE : ${nSpoke}  (${volSpoke}/mo combined)`)
console.log(`FAQ ENTRIES inside them : ${nFaq}  (long tail, <${SPOKE_MIN_VOL}/mo — coverage, not pages)`)
console.log(`ROUTE TO A PRODUCT PAGE : ${nProd}  (price / kit / at-home intent)`)
for (const p of plan) {
  if (!p.spokes.length && !p.product.length) continue
  console.log(`\n## ${p.parent}`)
  for (const s of p.spokes) {
    console.log(`  SPOKE  ${String(s.vol).padStart(5)}/mo  kd ${String(s.kd.length ? Math.min(...s.kd) : '?').padStart(3)}  -> ${s.queries[0].q}`)
    for (const q of s.queries.slice(1)) console.log(`             also covers: ${q.q} (${q.vol})`)
  }
  if (p.faq.length) console.log(`  FAQ    ${p.faq.length} long-tail question(s): ${p.faq.slice(0, 3).map((s) => s.queries[0].q).join(' / ')}${p.faq.length > 3 ? ' ...' : ''}`)
  if (p.product.length) console.log(`  KITS   ${p.product.map((x) => `${x.q} (${x.vol})`).join(' / ')}`)
  if (p.collide?.length) console.log(`  DUPE   ${p.collide.map((x) => `${x.q} (${x.vol}) == /blog/${x.article}`).join(' / ')}`)
}
fs.writeFileSync('C:/Users/antid/AppData/Local/Temp/claude/d--Androprime-main/a297654d-d9bc-48db-9706-caa5d4cfe386/scratchpad/plan.json', JSON.stringify(plan, null, 1))
