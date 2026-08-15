#!/usr/bin/env node
/**
 * DataForSEO keyword helper for Andro Prime SEO.
 *
 * The ongoing keyword-validation tool (Semrush MCP is one-time/trial only; this is
 * pay-per-call with no unit ceiling — see reference-semrush-options memory). Used by the
 * /article skill to validate spokes before a brief, and ad-hoc for CSV expansion.
 *
 * Auth: reads DATAFORSEO_BASE64 (preferred) or DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD
 * from the repo-root .env. No dependencies — Node 18+ global fetch only.
 *
 * Defaults: UK / English. Output: CSV rows matching the leading columns of
 * 06_marketing/seo-ai-search/keywords.csv  ->  query,vol,kd,cpc,competition,intent
 *
 * Usage:
 *   node dataforseo.mjs balance
 *   node dataforseo.mjs overview "high cortisol symptoms" "what is hba1c"
 *   node dataforseo.mjs overview --file seeds.txt          # one keyword per line
 *   node dataforseo.mjs suggest "cortisol blood test" --limit 40
 *   node dataforseo.mjs related "tsh levels" --limit 40
 *
 *   # competitive teardown (DataForSEO Labs):
 *   node dataforseo.mjs teardown medichecks.com --limit 30      # top pages by traffic
 *   node dataforseo.mjs ranked medichecks.com --limit 100       # keywords a domain ranks for
 *   node dataforseo.mjs gap andro-prime.com medichecks.com thriva.co  # what they rank for, we don't
 *
 *   # SERP + GEO:
 *   node dataforseo.mjs serp "crp blood test"                   # page-1 owners + AI Overview
 *   node dataforseo.mjs mentions "crp blood test" --platform google   # who AI cites (or chat_gpt)
 *   node dataforseo.mjs responses "best private CRP test UK" --provider perplexity  # LLM answer + citations
 *     providers: chat_gpt | claude | gemini | perplexity   (default chat_gpt; --model to override)
 *
 *   # the monthly GEO/AEO citation snapshot:
 *   node dataforseo.mjs track --dry                             # plan + cost estimate, spends nothing
 *   node dataforseo.mjs track                                   # all engines, writes ../geo-snapshots/<date>.csv
 *   node dataforseo.mjs track --engines perplexity,chat_gpt     # subset
 *   node dataforseo.mjs track --file other-prompts.txt
 *     Prompts default to tools/geo-prompts.txt. Diffs against the previous snapshot.
 *     The aio rows carry our_rank: our own organic position on the tracked query,
 *     free off the same call, and the leading indicator the citation columns lack.
 *
 *   # fan-out: the sub-queries a tracked prompt decomposes into, and whether we can reach them:
 *   node dataforseo.mjs fanout --dry                            # plan + cost, spends nothing
 *   node dataforseo.mjs fanout                                  # all informational tracked prompts
 *   node dataforseo.mjs fanout "crp blood test" --probe 15      # one parent
 *   node dataforseo.mjs fanout --merge                          # also append priority 1-2 to keywords.csv
 *     Writes ../fanout-staging-<date>.csv in keywords.csv column order.
 *
 * Add --json for raw rows instead of CSV. Flags go AFTER the positional argument.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://api.dataforseo.com'
const LOCATION = 'United Kingdom'
const LANGUAGE = 'English'

// --- auth ---------------------------------------------------------------
function loadEnv() {
  // repo root is four levels up from this file (06_marketing/seo-ai-search/tools)
  const here = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(here, '../../../..')
  const envPath = path.join(root, '.env')
  const env = {}
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line)
      if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim()
    }
  }
  let basic = env.DATAFORSEO_BASE64
  if (!basic && env.DATAFORSEO_LOGIN && env.DATAFORSEO_PASSWORD) {
    basic = Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString('base64')
  }
  if (!basic) {
    console.error('No DataForSEO credentials in .env (need DATAFORSEO_BASE64 or LOGIN+PASSWORD).')
    process.exit(1)
  }
  return basic
}

const AUTH = loadEnv()

async function call(endpoint, body) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (json.status_code !== 20000) {
    console.error(`API error ${json.status_code}: ${json.status_message}`)
    process.exit(1)
  }
  const task = json.tasks?.[0]
  if (task?.status_code !== 20000) {
    console.error(`Task error ${task?.status_code}: ${task?.status_message}`)
    process.exit(1)
  }
  return { result: task.result || [], cost: json.cost }
}

// Normalise both response shapes (overview items vs *_data-nested items) into one row.
function normalise(item) {
  const d = item.keyword_data || item // suggestions/related nest under keyword_data
  const info = d.keyword_info || {}
  const props = d.keyword_properties || {}
  const intent = d.search_intent_info || {}
  return {
    query: d.keyword ?? item.keyword,
    vol: info.search_volume ?? '',
    kd: props.keyword_difficulty ?? '',
    cpc: info.cpc ?? '',
    competition: (info.competition_level ?? '').toString().toLowerCase(),
    intent: intent.main_intent ?? '',
  }
}

function output(rows, asJson) {
  if (asJson) {
    console.log(JSON.stringify(rows, null, 2))
    return
  }
  console.log('query,vol,kd,cpc,competition,intent')
  for (const r of rows) {
    const q = /[",]/.test(r.query) ? `"${r.query.replace(/"/g, '""')}"` : r.query
    console.log([q, r.vol, r.kd, r.cpc, r.competition, r.intent].join(','))
  }
}

// --- commands -----------------------------------------------------------
async function cmdBalance() {
  const res = await fetch(`${API}/v3/appendix/user_data`, {
    headers: { Authorization: `Basic ${AUTH}` },
  })
  const json = await res.json()
  const money = json.tasks?.[0]?.result?.[0]?.money
  console.log(`DataForSEO balance: $${money?.balance ?? '?'} (login ${json.tasks?.[0]?.result?.[0]?.login ?? '?'})`)
}

async function cmdOverview(keywords, asJson) {
  // Validate specific keywords. keyword_overview is cheaper but silently drops/ nulls
  // some phrases, so we use the dedicated Google Ads search_volume endpoint (reliable
  // row-per-keyword volume/cpc/competition) merged with bulk_keyword_difficulty (KD).
  // Every requested keyword is emitted, even if Google reports null volume — that
  // transparency matters for spoke validation. NOTE: KD here is DataForSEO's scale,
  // which differs from Semrush's — don't compare across providers.
  const [vol, kd] = await Promise.all([
    call('/v3/keywords_data/google_ads/search_volume/live', [
      { keywords, location_name: LOCATION, language_name: LANGUAGE },
    ]),
    call('/v3/dataforseo_labs/google/bulk_keyword_difficulty/live', [
      { keywords, location_name: LOCATION, language_name: LANGUAGE },
    ]),
  ])
  const volMap = new Map((vol.result || []).map((r) => [r.keyword, r]))
  const kdMap = new Map((kd.result[0]?.items || []).map((r) => [r.keyword, r.keyword_difficulty]))
  const rows = keywords.map((q) => {
    const v = volMap.get(q) || volMap.get(q.toLowerCase()) || {}
    return {
      query: q,
      vol: v.search_volume ?? '',
      kd: kdMap.get(q) ?? kdMap.get(q.toLowerCase()) ?? '',
      cpc: v.cpc ?? '',
      competition: (v.competition ?? '').toString().toLowerCase(),
      intent: '',
    }
  })
  output(rows, asJson)
  console.error(`(${rows.length} keywords, cost $${(vol.cost + kd.cost).toFixed(4)})`)
}

async function cmdExpand(endpoint, seed, limit, asJson) {
  const { result, cost } = await call(endpoint, [
    { keyword: seed, location_name: LOCATION, language_name: LANGUAGE, limit, include_serp_info: false },
  ])
  const rows = (result[0]?.items || []).map(normalise)
  // sort by volume desc for readability
  rows.sort((a, b) => (Number(b.vol) || 0) - (Number(a.vol) || 0))
  output(rows, asJson)
  console.error(`(seed "${seed}" -> ${rows.length} keywords, cost $${cost})`)
}

// --- SERP composition + AI Overview ------------------------------------
async function cmdSerp(keyword, asJson) {
  if (!keyword) { console.error('Usage: dataforseo.mjs serp "<keyword>"'); process.exit(1) }
  // /live/advanced, not /regular: regular returns organic items only, so the
  // ai_overview lookup below silently reported "no" on every keyword.
  const { result, cost } = await call('/v3/serp/google/organic/live/advanced', [
    { keyword, location_name: LOCATION, language_name: LANGUAGE, load_async_ai_overview: true },
  ])
  const items = result[0]?.items || []
  const organic = items
    .filter((i) => i.type === 'organic')
    .map((i) => ({ pos: i.rank_absolute, domain: i.domain, url: i.url, title: i.title }))
  const aio = items.find((i) => i.type === 'ai_overview')
  const aioRefs = (aio?.references || aio?.items || [])
    .map((r) => r.domain || r.url)
    .filter(Boolean)
  if (asJson) {
    console.log(JSON.stringify({ keyword, ai_overview: !!aio, ai_overview_sources: aioRefs, organic }, null, 2))
  } else {
    console.log(`SERP "${keyword}"  AI Overview: ${aio ? 'YES' : 'no'}`)
    if (aioRefs.length) console.log(`  AIO sources: ${aioRefs.slice(0, 10).join(', ')}`)
    for (const o of organic.slice(0, 10)) console.log(`  ${o.pos}. ${o.domain}  ${o.url}`)
  }
  console.error(`(cost $${cost})`)
}

// --- competitor teardown (DataForSEO Labs) -----------------------------
async function cmdTeardown(domain, asJson) {
  if (!domain) { console.error('Usage: dataforseo.mjs teardown <domain> [--limit N]'); process.exit(1) }
  const { result, cost } = await call('/v3/dataforseo_labs/google/relevant_pages/live', [
    { target: domain, location_name: LOCATION, language_name: LANGUAGE, limit },
  ])
  const items = result[0]?.items || []
  const rows = items.map((it) => {
    const m = it.metrics?.organic || {}
    return {
      url: it.page_address || it.meta?.canonical || it.meta?.url || '',
      keywords: m.count ?? '',
      etv: m.etv != null ? Math.round(m.etv) : '',
      pos_1: m.pos_1 ?? '',
    }
  })
  rows.sort((a, b) => (Number(b.etv) || 0) - (Number(a.etv) || 0))
  if (asJson) { console.log(JSON.stringify(rows, null, 2)) }
  else {
    console.log('etv,keywords,url')
    for (const r of rows) console.log([r.etv, r.keywords, r.url].join(','))
  }
  console.error(`(${domain} -> ${rows.length} pages, cost $${cost})`)
}

async function cmdRanked(domain, asJson) {
  const { result, cost } = await call('/v3/dataforseo_labs/google/ranked_keywords/live', [
    { target: domain, location_name: LOCATION, language_name: LANGUAGE, limit },
  ])
  const rows = (result[0]?.items || []).map((it) => {
    const kd = it.keyword_data || {}
    const se = it.ranked_serp_element?.serp_item || {}
    return { query: kd.keyword, vol: kd.keyword_info?.search_volume ?? '', pos: se.rank_absolute ?? '', url: se.url ?? '' }
  })
  rows.sort((a, b) => (Number(a.pos) || 999) - (Number(b.pos) || 999))
  output(rows.map((r) => ({ query: r.query, vol: r.vol, kd: '', cpc: '', competition: '', intent: '' })), asJson)
  console.error(`(${domain} -> ${rows.length} ranked keywords, cost $${cost})`)
}

// gap <ourDomain> <competitor...> : keywords competitors rank for that we don't.
async function cmdGap(domains, asJson) {
  const [ours, ...competitors] = domains
  if (!ours || competitors.length === 0) {
    console.error('Usage: dataforseo.mjs gap <ourDomain> <competitor> [competitor...]')
    process.exit(1)
  }
  const fetchRanked = async (domain) => {
    const { result, cost } = await call('/v3/dataforseo_labs/google/ranked_keywords/live', [
      { target: domain, location_name: LOCATION, language_name: LANGUAGE, limit: 1000 },
    ])
    console.error(`  ranked_keywords ${domain}: ${(result[0]?.items || []).length} (cost $${cost})`)
    return result[0]?.items || []
  }
  const ourSet = new Set((await fetchRanked(ours)).map((it) => (it.keyword_data?.keyword || '').toLowerCase()))
  const gap = new Map()
  for (const comp of competitors) {
    for (const it of await fetchRanked(comp)) {
      const kd = it.keyword_data || {}
      const q = (kd.keyword || '').toLowerCase()
      if (!q || ourSet.has(q)) continue
      const vol = Number(kd.keyword_info?.search_volume) || 0
      const prev = gap.get(q)
      if (!prev || vol > prev.vol) gap.set(q, { query: kd.keyword, vol, by: comp })
    }
  }
  const rows = [...gap.values()].sort((a, b) => b.vol - a.vol)
  if (asJson) { console.log(JSON.stringify(rows, null, 2)) }
  else {
    console.log('vol,by,query')
    for (const r of rows) console.log([r.vol, r.by, /[",]/.test(r.query) ? `"${r.query}"` : r.query].join(','))
  }
  console.error(`(gap vs ${competitors.join(', ')} -> ${rows.length} keywords we don't rank for)`)
}

// --- GEO (AI Optimization) ---------------------------------------------
async function cmdMentions(keyword, platform, asJson) {
  if (!keyword) { console.error('Usage: dataforseo.mjs mentions "<kw>" [--platform google|chat_gpt]'); process.exit(1) }
  const body = { target: [{ keyword }], platform, limit }
  if (platform === 'google') { body.location_name = LOCATION; body.language_name = LANGUAGE } // chat_gpt rejects location_name
  const { result, cost } = await call('/v3/ai_optimization/llm_mentions/search/live', [body])
  const items = result[0]?.items || []
  if (asJson) { console.log(JSON.stringify(items, null, 2)) }
  else {
    for (const it of items) {
      console.log(`Q: ${it.question || it.keyword || '(n/a)'}  [AI vol ${it.ai_search_volume ?? '?'}]`)
      for (const s of (it.sources || it.citations || []).slice(0, 8)) console.log(`   - ${s.domain || s.url || ''}`)
    }
  }
  console.error(`(mentions "${keyword}" [${platform}] -> ${items.length}, cost $${cost})`)
}

const DEFAULT_MODEL = { chat_gpt: 'o4-mini', claude: 'claude-sonnet-4-6', gemini: 'gemini-2.5-flash', perplexity: 'sonar-pro' }
async function cmdResponses(prompt, provider, model, asJson) {
  if (!prompt) { console.error('Usage: dataforseo.mjs responses "<prompt>" [--provider chat_gpt|claude|gemini|perplexity] [--model X]'); process.exit(1) }
  if (!DEFAULT_MODEL[provider]) { console.error(`Unknown provider "${provider}" (chat_gpt|claude|gemini|perplexity)`); process.exit(1) }
  const { result, cost } = await call(`/v3/ai_optimization/${provider}/llm_responses/live`, [
    { user_prompt: prompt, model_name: model || DEFAULT_MODEL[provider], web_search: true },
  ])
  const item = result[0]?.items?.[0] || result[0] || {}
  if (asJson) { console.log(JSON.stringify(result, null, 2)) }
  else {
    const sections = item.sections || item.message || []
    const text = Array.isArray(sections)
      ? sections.map((s) => s.text || '').join('\n')
      : JSON.stringify(item).slice(0, 1200)
    console.log(text)
    // surface any citation URLs found anywhere in the payload
    const urls = [...new Set((JSON.stringify(result).match(/https?:\/\/[^"\\\s)]+/g) || []))].slice(0, 15)
    if (urls.length) { console.log('\nCITATIONS:'); for (const u of urls) console.log(`  - ${u}`) }
  }
  console.error(`(responses ${provider}/${model || DEFAULT_MODEL[provider]} -> cost $${cost})`)
}


// Non-fatal sibling of call(). `call` exits the process on an API error, which is
// right for a one-shot lookup and fatal for a 72-call sweep: one transient upstream
// 40101 discarded twelve completed probes and wrote nothing. Retries once, then
// surfaces the error as a value so the row can be written and the run continue.
async function callSoft(endpoint, body, retries = 1) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Basic ${AUTH}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      const task = json.tasks?.[0]
      if (json.status_code !== 20000) throw new Error(`API ${json.status_code}: ${json.status_message}`)
      if (task?.status_code !== 20000) throw new Error(`task ${task?.status_code}: ${task?.status_message}`)
      return { result: task.result || [], cost: json.cost, error: null }
    } catch (e) {
      if (attempt >= retries) return { result: [], cost: 0, error: e.message.slice(0, 120) }
      await new Promise((r) => setTimeout(r, 2000))
    }
  }
}

// --- GEO tracking (the monthly citation snapshot) ------------------------
// Three surfaces, because "are we cited" has three different answers:
//   aio        -> Google AI Overview, read off the organic SERP payload
//   perplexity -> live LLM answer + its citations
//   chat_gpt   -> ditto
// Every row records cited AND mentioned separately: a brand named in prose with
// no link is a real GEO outcome that URL-only matching silently scores as zero.
const OUR_DOMAIN = 'andro-prime.com'
const OUR_NAMES = ['Andro Prime', 'AndroPrime', 'andro-prime.com']
const ENGINES = ['aio', 'perplexity', 'chat_gpt']

// Registrable-domain match, so blog.andro-prime.com counts as ours and a
// look-alike like andro-prime.com.evil.net does not.
function isOurs(u = '') {
  try {
    const h = new URL(u.startsWith('http') ? u : `https://${u}`).hostname.toLowerCase()
    return h === OUR_DOMAIN || h.endsWith(`.${OUR_DOMAIN}`)
  } catch { return false }
}
function mentionsUs(text = '') {
  return OUR_NAMES.some((n) => new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text))
}

function readPrompts(file) {
  const rows = []
  for (const raw of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const m = /^(.*?)\s*#(informational|commercial)\s*$/i.exec(line)
    rows.push({ prompt: (m ? m[1] : line).trim(), kind: m ? m[2].toLowerCase() : 'informational' })
  }
  return rows
}

// Our best organic position on a SERP payload, as `rank_absolute` — the same
// measure the 2026-08-15 diagnosis quoted, so the two are comparable. Returns
// the literal 'unranked' when the SERP read fine and we are simply not in it:
// a blank would be indistinguishable from "not measured on this surface".
function ourOrganicRank(items) {
  const mine = items
    .filter((i) => i.type === 'organic' && isOurs(i.domain || i.url || ''))
    .sort((a, b) => (a.rank_absolute ?? 999) - (b.rank_absolute ?? 999))
  if (!mine.length) return { rank: 'unranked', url: '' }
  return { rank: mine[0].rank_absolute ?? 'unranked', url: mine[0].url || '' }
}

// Measured 2026-08-15, balance before/after, one keyword, AIO on:
//   default depth -> $0.002   (9 organic returned: the API default is 10, NOT 100)
//   depth 10      -> $0.002   (9 organic,  1 related_searches block)
//   depth 20      -> $0.0035  (18 organic)
//   depth 100     -> $0.0155  (96 organic, 10 related_searches blocks)
// Depth is therefore the single biggest cost lever in this file, and the default
// being 10 is the trap: a rank read off a default-depth call can only ever say
// "top 10 or nothing", which collapses the entire range this instrument exists to
// show. `track` pays for depth 100 deliberately; the reachability probe in `fanout`
// only needs the top ten and deliberately does not.
const SERP_DEPTH_COST = { 10: 0.002, 20: 0.0035, 100: 0.0155 }
const serpCost = (d) => SERP_DEPTH_COST[d] ?? (d <= 10 ? 0.002 : 0.0155)

// One (prompt, engine) probe. Returns a row even on failure: a skipped row is
// indistinguishable from a zero later, and zeros are what this file measures.
async function probe(prompt, engine, depth = 100) {
  const base = { prompt, engine, cited: false, mentioned: false, our_rank: '', our_rank_url: '', our_urls: [], sources: [], cost: 0, note: '' }
  try {
    if (engine === 'aio') {
      // MUST be /live/advanced with load_async_ai_overview. /live/regular returns
      // ONLY organic items, so an ai_overview lookup against it can never match and
      // reports a blind probe as a confident "no AI Overview". Same cost ($0.002).
      // depth is pinned (default 100) so "unranked" is a defined statement — not in
      // the top 100 — rather than whatever the API default happens to be. It is 10,
      // which is exactly why this must be explicit: see SERP_DEPTH_COST above.
      const { result, cost, error } = await callSoft('/v3/serp/google/organic/live/advanced', [
        { keyword: prompt, location_name: LOCATION, language_name: LANGUAGE, depth, load_async_ai_overview: true },
      ])
      if (error) return { ...base, cost, note: `ERROR ${error}` }
      const items = result[0]?.items || []
      // our_rank is read off THIS call, at no extra cost. It is the leading
      // indicator the citation columns cannot supply: without it, a month spent
      // climbing from unranked to #40 reads identically to a month of nothing,
      // and the natural reading of a flat `cited=false` is "our copy is losing",
      // which the 2026-08-15 diagnosis showed to be the wrong reading.
      const { rank, url } = ourOrganicRank(items)
      const aio = items.find((i) => i.type === 'ai_overview')
      if (!aio) return { ...base, cost, our_rank: rank, our_rank_url: url, note: 'no AI Overview on this SERP' }
      const refs = (aio.references || aio.items || []).flatMap((r) => [r.url, r.domain]).filter(Boolean)
      const text = JSON.stringify(aio)
      return { ...base, cost, our_rank: rank, our_rank_url: url,
               sources: [...new Set(refs.map((r) => r.replace(/^https?:\/\//, '').split('/')[0]))],
               our_urls: refs.filter(isOurs), cited: refs.some(isOurs), mentioned: mentionsUs(text) }
    }
    const { result, cost, error } = await callSoft(`/v3/ai_optimization/${engine}/llm_responses/live`, [
      { user_prompt: prompt, model_name: DEFAULT_MODEL[engine], web_search: true },
    ])
    if (error) return { ...base, cost, note: `ERROR ${error}` }
    const blob = JSON.stringify(result)
    const urls = [...new Set(blob.match(/https?:\/\/[^"\\\s)]+/g) || [])]
    if (!urls.length && !blob.length) return { ...base, cost, note: 'no answer returned' }
    return { ...base, cost, sources: [...new Set(urls.map((u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' } }).filter(Boolean))],
             our_urls: urls.filter(isOurs), cited: urls.some(isOurs), mentioned: mentionsUs(blob) }
  } catch (e) {
    return { ...base, note: `ERROR ${e.message}`.slice(0, 120) }
  }
}

const SNAP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'geo-snapshots')
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v))

// Snapshot I/O is HEADER-DRIVEN, not positional. The column set has already grown
// once (our_rank, 2026-08-15) and the previous reader addressed cells by index, so
// every merge and diff against an older file would have read one column left of the
// truth without erroring. Reading by name means an older snapshot simply yields ''
// for a column it predates, which is the correct answer.
function parseCsvLine(line) {
  const out = []
  let cur = '', q = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (q) {
      if (ch === '"') { if (line[i + 1] === '"') { cur += '"'; i++ } else q = false } else cur += ch
    } else if (ch === '"') q = true
    else if (ch === ',') { out.push(cur); cur = '' }
    else cur += ch
  }
  out.push(cur)
  return out
}
function readSnapshot(file) {
  const lines = fs.readFileSync(file, 'utf-8').split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []
  const header = parseCsvLine(lines[0])
  return lines.slice(1).map((l) => {
    const cells = parseCsvLine(l)
    return Object.fromEntries(header.map((h, i) => [h, cells[i] ?? '']))
  })
}
const SNAP_COLS = ['date', 'kind', 'prompt', 'engine', 'cited', 'mentioned', 'our_rank', 'our_rank_url', 'our_urls', 'top_sources', 'cost', 'note']
function writeSnapshot(file, rows) {
  const body = rows.map((r) => SNAP_COLS.map((c) => csvCell(r[c] ?? '')).join(','))
  fs.writeFileSync(file, [SNAP_COLS.join(','), ...body].join('\n') + '\n')
}
// 'unranked' and '' are both non-numbers but they mean different things: not in the
// top 100, versus not measured on this surface. Only the first is a rank fact.
const rankNum = (v) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : null }

async function cmdTrack(file, engines, dry, asJson, depth = 100) {
  const prompts = readPrompts(file)
  if (!prompts.length) { console.error(`No prompts in ${file}`); process.exit(1) }
  const plan = prompts.length * engines.length
  // Both numbers are measured, balance before/after, 2026-08-15: responses $0.0148/call,
  // aio $0.0155 at depth 100 (and $0.002 at the API default of 10 — see SERP_DEPTH_COST).
  // The aio figure used to be estimated at $0.003 here and the real total came in 5x
  // over it, which is the kind of gap that only shows up once someone reads the invoice.
  const est = engines.reduce((s, e) => s + prompts.length * (e === 'aio' ? serpCost(depth) : 0.0148), 0)
  console.error(`track: ${prompts.length} prompts x ${engines.length} engines = ${plan} calls, est ~$${est.toFixed(2)}${engines.includes('aio') ? ` (aio at depth ${depth})` : ''}`)
  if (dry) {
    console.error('--dry: nothing called, nothing spent, nothing written.')
    for (const p of prompts.slice(0, 5)) console.error(`  [${p.kind}] ${p.prompt}`)
    if (prompts.length > 5) console.error(`  ... and ${prompts.length - 5} more`)
    return
  }

  const rows = []
  for (const { prompt, kind } of prompts) {
    for (const engine of engines) {
      const r = await probe(prompt, engine, depth)
      rows.push({ ...r, kind })
      const rank = r.engine === 'aio' ? ` ${r.our_rank === 'unranked' ? '[unranked]' : r.our_rank ? `[#${r.our_rank}]` : ''}` : ''
      process.stderr.write(`  ${r.cited ? '✅' : r.mentioned ? '📣' : '·'} ${engine.padEnd(10)} ${prompt}${rank}${r.note ? `  (${r.note})` : ''}\n`)
    }
  }

  const spent = rows.reduce((s, r) => s + (r.cost || 0), 0)
  const date = new Date().toISOString().slice(0, 10)
  fs.mkdirSync(SNAP_DIR, { recursive: true })
  const out = path.join(SNAP_DIR, `${date}.csv`)
  // Merge, never clobber: re-running one engine must not discard rows already paid
  // for by another. Keyed on (prompt, engine); this run wins for cells it covered.
  let merged = rows.map((r) => ({
    date, kind: r.kind, prompt: r.prompt, engine: r.engine, cited: r.cited, mentioned: r.mentioned,
    our_rank: r.our_rank ?? '', our_rank_url: r.our_rank_url ?? '',
    our_urls: r.our_urls.join(' '), top_sources: r.sources.slice(0, 8).join(' '), cost: r.cost ?? '', note: r.note,
  }))
  if (fs.existsSync(out)) {
    const keys = new Set(rows.map((r) => `${r.prompt}|${r.engine}`))
    const kept = readSnapshot(out).filter((r) => !keys.has(`${r.prompt}|${r.engine}`))
    if (kept.length) console.error(`  (merged: kept ${kept.length} rows from the existing ${date} snapshot)`)
    merged = merged.concat(kept)
  }
  writeSnapshot(out, merged)

  // Diff against the most recent EARLIER snapshot, keyed on prompt+engine so a
  // prompt added since then simply has no prior and is reported as new, never as a loss.
  const prior = fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.csv$/.test(f) && f < `${date}.csv`).sort().pop()
  let diff = null
  if (prior) {
    const prev = new Map()
    for (const r of readSnapshot(path.join(SNAP_DIR, prior))) prev.set(`${r.prompt}|${r.engine}`, r)
    const gained = rows.filter((r) => r.cited && prev.get(`${r.prompt}|${r.engine}`)?.cited === 'false')
    const lost = rows.filter((r) => !r.cited && prev.get(`${r.prompt}|${r.engine}`)?.cited === 'true')
    // Rank movement is the point of the our_rank column: it is the leading indicator
    // that says WHY the citation columns did or did not move. A prior snapshot that
    // predates the column has no rank for any cell, so every row reads as "new
    // measurement" rather than as a gain.
    const moved = []
    for (const r of rows.filter((x) => x.engine === 'aio')) {
      const p = prev.get(`${r.prompt}|${r.engine}`)
      if (!p || !p.our_rank) continue
      const was = rankNum(p.our_rank), now = rankNum(r.our_rank)
      if (was === now) continue
      if (was === null && now !== null) moved.push({ prompt: r.prompt, from: 'unranked', to: `#${now}`, dir: 'in' })
      else if (was !== null && now === null) moved.push({ prompt: r.prompt, from: `#${was}`, to: 'unranked', dir: 'out' })
      else if (was !== null && now !== null) moved.push({ prompt: r.prompt, from: `#${was}`, to: `#${now}`, dir: now < was ? 'up' : 'down' })
    }
    diff = { prior, gained, lost, moved }
  }

  // Summarise the MERGED file, not just this run's rows: after a single-engine
  // re-run the two differ, and reporting the run alone understates coverage and
  // reads as though the other engines were never probed.
  const all = readSnapshot(out).map((r) => ({
    kind: r.kind, prompt: r.prompt, engine: r.engine,
    cited: r.cited === 'true', mentioned: r.mentioned === 'true',
    our_rank: r.our_rank || '', note: r.note || '',
  }))
  const tot = (k) => all.filter((r) => r.kind === k)
  const pct = (a) => (a.length ? `${a.filter((r) => r.cited).length}/${a.length}` : '0/0')
  console.error('')
  console.error(`SNAPSHOT ${out}`)
  console.error(`  cited: informational ${pct(tot('informational'))} | commercial ${pct(tot('commercial'))} | mentioned-not-cited ${all.filter((r) => r.mentioned && !r.cited).length}   (whole ${date} snapshot, ${all.length} cells)`)
  const aioRows = all.filter((r) => r.engine === 'aio')
  const aioBlind = aioRows.filter((r) => r.note.includes('no AI Overview')).length
  if (aioRows.length) console.error(`  AI Overview present on ${aioRows.length - aioBlind}/${aioRows.length} SERPs (a 0/0 here means the probe is blind, not that Google shows none)`)
  // The rank line. Read it BEFORE the citation line: you cannot be cited from a
  // page the engine is not surfacing, so a zero above a wall of "unranked" is a
  // restatement of the ranking position, not a verdict on the answer copy.
  const ranked = aioRows.map((r) => ({ ...r, n: rankNum(r.our_rank) })).filter((r) => r.our_rank)
  if (ranked.length) {
    const inTop = ranked.filter((r) => r.n !== null)
    const best = inTop.length ? Math.min(...inTop.map((r) => r.n)) : null
    console.error(`  our_rank (Google organic, rank_absolute, depth ${depth}): ranked on ${inTop.length}/${ranked.length} tracked queries${best ? `, best #${best}` : ''}, unranked on ${ranked.length - inTop.length}`)
    for (const r of inTop.sort((a, b) => a.n - b.n).slice(0, 10)) console.error(`      #${String(r.n).padEnd(4)} ${r.prompt}`)
  }
  const errs = rows.filter((r) => r.note.startsWith('ERROR'))
  console.error(`  spent: $${spent.toFixed(4)} across ${rows.length} calls`)
  if (errs.length) {
    console.error(`  ⚠️  ${errs.length} of ${rows.length} cells ERRORED and are recorded as errors, NOT as zeros.`)
    console.error('      Do not read this snapshot as a citation rate until they are re-run.')
    for (const e of errs.slice(0, 8)) console.error(`      ${e.engine} "${e.prompt}" ${e.note}`)
  }
  if (diff) {
    console.error(`  vs ${diff.prior}:  +${diff.gained.length} gained, -${diff.lost.length} lost`)
    for (const g of diff.gained) console.error(`    + ${g.engine} "${g.prompt}"`)
    for (const l of diff.lost) console.error(`    - ${l.engine} "${l.prompt}"`)
    if (diff.gained.length || diff.lost.length) {
      console.error('  ⚠️  n=1 per cell. LLM answers vary between runs, so a single change is NOT')
      console.error('      evidence of a gain or loss. Re-probe the changed cells before reporting one.')
    }
    if (diff.moved?.length) {
      const sign = { up: '▲', down: '▼', in: '▲', out: '▼' }
      console.error(`  rank moved on ${diff.moved.length} quer${diff.moved.length === 1 ? 'y' : 'ies'}:`)
      for (const m of diff.moved) console.error(`    ${sign[m.dir]} ${m.from} -> ${m.to}  "${m.prompt}"`)
      console.error('      Rank is a single-sample SERP read too, but it is far less volatile than a')
      console.error('      generative answer: a move of a few places is noise, a move in or out is not.')
    } else if (readSnapshot(path.join(SNAP_DIR, prior)).some((r) => r.our_rank)) {
      console.error('  rank: unchanged on every tracked query vs the prior snapshot.')
    } else {
      console.error(`  rank: ${diff.prior} predates the our_rank column, so there is nothing to compare against yet.`)
    }
  } else {
    console.error('  no earlier snapshot: this is the baseline, nothing to diff against.')
  }
  if (asJson) console.log(JSON.stringify({ date, file: out, rows, diff }, null, 2))
}

// --- fan-out discovery: the queries we can actually reach ----------------
// Why this command exists. The 2026-08-15 diagnosis established that we are not in
// the top 99 organic for any tracked head term, that 16 of 19 sources cited in those
// AI Overviews sit in the organic top 30 of the same query, and therefore that a
// better-written answer cannot win a citation from nowhere. The one counter-example
// is the mechanism this command industrialises: londongpclinic.co.uk is cited on
// `crp blood test` while unranked in its top 99, because it ranks #10 for `crp vs
// esr` and the AI Overview decomposed the head term into that sub-question.
//
// So the tracked prompts are the OUTCOME surface, and the queries worth ranking for
// are their fan-out children. This command reads Google's own decomposition of each
// parent — People Also Ask and related searches, both of which ride the $0.002 SERP
// call `track` already makes — qualifies each child for volume and difficulty, then
// spends $0.002 a head establishing the only thing that decides whether a child is
// worth writing: whether the top ten contains sites our size.
//
// It does NOT promote anything. Output is a staging CSV in keywords.csv column order;
// the human promotion gate (coverage-rules.md 4b) is unchanged and still binding.

// Domains we will not outrank this year, so a top ten made only of these is not a
// reachable slot no matter how good the page is. Any .gov / .ac.uk / .nhs.uk counts.
const AUTHORITY = [
  'nhs.uk', 'nhsinform.scot', 'healthline.com', 'clevelandclinic.org', 'mayoclinic.org', 'webmd.com',
  'patient.info', 'medicalnewstoday.com', 'nih.gov', 'verywellhealth.com', 'medlineplus.gov',
  'hopkinsmedicine.org', 'yalemedicine.org', 'bhf.org.uk', 'versusarthritis.org', 'healthdirect.gov.au',
  'bupa.co.uk', 'boots.com', 'nuffieldhealth.com', 'britishlivertrust.org.uk', 'diabetes.org.uk',
  'cancerresearchuk.org', 'blood.co.uk', 'labtestsonline.org.uk', 'wikipedia.org', 'msdmanuals.com',
  'kidney.org', 'heartuk.org.uk', 'thyroiduk.org', 'mind.org.uk', 'bda.uk.com', 'nice.org.uk',
]
// Not authority, but not a slot we can take either. Counting these as "beatable"
// would score a SERP owned by YouTube and Reddit as wide open, which it is not.
const PLATFORM = ['youtube.com', 'reddit.com', 'quora.com', 'facebook.com', 'tiktok.com', 'instagram.com', 'x.com', 'twitter.com', 'pinterest.com', 'linkedin.com']
const bare = (d = '') => d.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase()
const isAuthority = (d) => { const h = bare(d); return /(^|\.)(gov|nhs)\.uk$|\.gov$|\.gov\.[a-z]{2}$|\.ac\.uk$/.test(h) || AUTHORITY.some((a) => h === a || h.endsWith(`.${a}`)) }
const isPlatform = (d) => { const h = bare(d); return PLATFORM.some((p) => h === p || h.endsWith(`.${p}`)) }

// Phase 0 boundary. A child inherits its parent's compliance flag, but a child can
// wander over the line its parent sat safely behind ("how to treat low testosterone"
// is a child of "normal testosterone levels by age"). Anything matching this is
// marked compliance=gate at source, which csv-to-queue refuses to import.
const GATE_RX = /\b(trt|testosterone replacement|hrt|prescri\w*|treatment for|how (do you |to )?treat|cure[sd]?|dosage|dose of|how much .* should i take|steroid|clomid|anastrozole|hcg|injection)\b/i

// Google Ads rejects a keyword containing '?' outright ("invalid characters or
// symbols"), and every People Also Ask entry is a question, so the raw harvest
// cannot be handed to search_volume as-is. It also caps a keyword at 80 characters
// and 10 words. A search query does not carry its own question mark anyway, so the
// stripped form is the one we would target and the one that belongs in keywords.csv.
// The comma is the non-obvious one: `how to increase testosterone to 1,000` is a
// real related search and Google Ads rejects it, taking the whole bulk call with it.
// The digit re-join matters: stripping the comma from `increase testosterone to 1,000`
// leaves `1 000`, which is not a query anyone types and reaches the promotion gate as
// noise. Strip the punctuation, then put the number back together.
const adsSafe = (q) => q.replace(/[?!,."“”‘’'()\[\]{}<>|\\/*+#$%^~`;:]/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/(\d) (\d{3})\b/g, '$1$2')
const adsEligible = (q) => q.length > 0 && q.length <= 80 && q.split(/\s+/).length <= 10

// Off-ICP at source. Andro Prime is UK men's health in Phase 0 wellness mode. A child
// about women, pregnancy, PCOS, children or pets is a real query with real volume and
// it is not ours — queueing one spends an article on an audience we do not serve, and
// writing it would drag the site's topical signal away from the pillar map.
const OFF_ICP_RX = /\b(wom[ae]n|female|females|pregnan\w+|pcos|menopaus\w*|perimenopaus\w*|breastfeed\w*|child|children|kids?|baby|babies|infant|toddler|dogs?|cats?|puppy|horses?)\b/i
// Navigational: the query names a destination, so the answer it wants is that site,
// not ours. Ranking for "thyroid test nhs" means being the thing someone scrolls past.
const NAV_RX = /\b(nhs|reddit|mumsnet|quora|youtube|amazon|ebay|boots|superdrug|wikipedia|login|near me)\b/i
// Intent is NOT uniform across a fan-out set and must not be hardcoded: `vitamin d
// tablets` (14,800/mo) arrives as a child of an informational parent and is a shopping
// query. Labelling it informational would put a product SERP into the informational
// lane, which is the exact confusion geo-prompts.txt warns about. The label is recorded,
// not acted on — the 4b gate decides what to do with it.
const COMMERCIAL_RX = /\b(buy|best|cheap\w*|price[sd]?|cost|tablets?|capsules?|supplements?|kit|shop|order|for sale|deal|brand|vs|review)\b/i

function loadKeywordsCsv() {
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'keywords.csv')
  const lines = fs.readFileSync(file, 'utf-8').replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim())
  const header = parseCsvLine(lines[0])
  const rows = lines.slice(1).map((l) => Object.fromEntries(header.map((h, i) => [h, parseCsvLine(l)[i] ?? ''])))
  return { file, header, rows, byQuery: new Map(rows.map((r) => [(r.query || '').toLowerCase(), r])) }
}

// One parent -> Google's own decomposition of it, off a single $0.002 SERP call.
async function fanoutHarvest(parent) {
  const { result, cost, error } = await callSoft('/v3/serp/google/organic/live/advanced', [
    { keyword: parent, location_name: LOCATION, language_name: LANGUAGE, depth: 100, load_async_ai_overview: true },
  ])
  if (error) return { parent, cost, error, children: [], evidence: [], unranked_citations: [] }
  const items = result[0]?.items || []
  const children = []
  const push = (q, src) => { const t = adsSafe(String(q ?? '').toLowerCase()); if (t) children.push({ query: t, src, parent }) }
  for (const it of items) {
    if (it.type === 'people_also_ask') for (const p of it.items || []) push(p.title ?? p.seed_question, 'paa')
    if (it.type === 'related_searches') for (const s of it.items || []) push(typeof s === 'string' ? s : s?.title, 'related')
  }
  const organic = items.filter((i) => i.type === 'organic')
  const organicDomains = new Set(organic.map((o) => bare(o.domain || o.url)))
  const aio = items.find((i) => i.type === 'ai_overview')
  const refs = (aio?.references || aio?.items || []).filter((r) => r && (r.url || r.domain))
  const evidence = refs.map((r) => ({ domain: bare(r.domain || r.url), title: r.title || '', url: r.url || '' })).filter((e) => e.domain)
  // The londongpclinic case, generalised: a domain cited in the AI Overview that is
  // NOWHERE in the organic top 100 of the same query got there through fan-out. Its
  // page title names the narrower question it owns, and that is the highest-signal
  // lead this command produces — it is a worked example, not a guess.
  const unranked_citations = evidence.filter((e) => !organicDomains.has(e.domain))
  return {
    parent, cost, error: null, children, evidence, unranked_citations,
    our_rank: ourOrganicRank(items).rank, aio: !!aio,
  }
}

// One child -> is the top ten reachable? This is the whole question; volume and KD
// are tiebreakers behind it. Deliberately depth 10 ($0.002, not $0.0155): the verdict
// is a property of the top ten and nothing below it changes the answer. The cost of
// that choice is that we learn whether we are IN the top ten, not what our position
// is if we are not — so this records `ours_top10`, never a rank it cannot support.
async function fanoutProbe(query) {
  const { result, cost, error } = await callSoft('/v3/serp/google/organic/live/advanced', [
    { keyword: query, location_name: LOCATION, language_name: LANGUAGE, depth: 10, load_async_ai_overview: true },
  ])
  if (error) return { query, cost, error, verdict: '', indie: [], ours_top10: '', aio: '' }
  const items = result[0]?.items || []
  const organic = items.filter((i) => i.type === 'organic')
  const top10 = organic.slice(0, 10).map((o) => ({ pos: o.rank_absolute, domain: bare(o.domain || o.url) }))
  const indie = top10.filter((d) => !isAuthority(d.domain) && !isPlatform(d.domain))
  const nhsOwnsTop = top10.slice(0, 2).filter((d) => /(^|\.)nhs\.uk$/.test(d.domain)).length >= 2
  const verdict = nhsOwnsTop ? 'NHS-NAV' : indie.length >= 3 ? 'WINNABLE' : indie.length >= 1 ? 'MIXED' : 'AUTHORITY'
  return {
    query, cost, error: null, verdict, indie, top10,
    ours_top10: top10.some((d) => isOurs(d.domain)) ? 'Y' : 'n',
    aio: items.some((i) => i.type === 'ai_overview') ? 'Y' : 'n',
  }
}

async function cmdFanout(seeds, file, probeN, dry, merge, refresh, asJson) {
  const promptFile = file || path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-prompts.txt')
  // Default parents are the INFORMATIONAL tracked prompts. The commercial six are
  // deliberately excluded: geo-prompts.txt records that engines answer those from
  // comparison hubs and vendor brands, so the lever there is outreach, not ranking.
  const parents = seeds.length ? seeds : readPrompts(promptFile).filter((p) => p.kind === 'informational').map((p) => p.prompt)
  if (!parents.length) { console.error('No parent queries.'); process.exit(1) }

  // Harvest pays for depth 100 ($0.0155) because both of its outputs need it: the
  // related-searches block returns 10 entries at depth 100 against 1 at depth 10, and
  // "cited but not in the organic set" is only a meaningful claim against a top-100
  // organic set. The reachability probe does not, and runs at depth 10 ($0.002).
  const estHarvest = parents.length * serpCost(100)
  const estProbe = probeN * serpCost(10)
  console.error(`fanout: ${parents.length} parents (harvest, depth 100, ~$${estHarvest.toFixed(3)}) + 1 bulk overview (~$0.085) + up to ${probeN} reachability probes (depth 10, ~$${estProbe.toFixed(3)})`)
  console.error(`        estimated total ~$${(estHarvest + 0.085 + estProbe).toFixed(2)}`)
  if (dry) {
    console.error('--dry: nothing called, nothing spent, nothing written.')
    for (const p of parents) console.error(`  parent: ${p}`)
    return
  }

  // 1. harvest -----------------------------------------------------------
  // Cached to disk, because the harvest is ~85% of the cost of this command and the
  // steps after it are the ones that fail. The first run of this tool lost a paid
  // 18-parent harvest to a rejected keyword three steps downstream; a cache means a
  // downstream fix is free to retry. --refresh re-pays deliberately.
  const cacheDate = new Date().toISOString().slice(0, 10)
  const cachePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', `.fanout-harvest-${cacheDate}.json`)
  let spent = 0
  let harvests = []
  const cached = !refresh && fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf-8')) : null
  const cache = { parents, harvests: [], qualified: cached?.qualified ?? {}, probes: cached?.probes ?? {} }
  const saveCache = () => fs.writeFileSync(cachePath, JSON.stringify(cache, null, 1))
  if (cached && cached.parents?.join('|') === parents.join('|')) {
    harvests = cached.harvests
    console.error(`  (reusing today's cached harvest from ${path.basename(cachePath)} — ${harvests.length} parents, $0 spent. --refresh to re-pay.)`)
  } else {
    for (const p of parents) {
      const h = await fanoutHarvest(p)
      spent += h.cost || 0
      harvests.push(h)
      process.stderr.write(`  ${h.error ? '⚠️ ' : '· '}${p}  -> ${h.children.length} children, ${h.unranked_citations.length} cited-without-ranking${h.error ? `  (ERROR ${h.error})` : ''}\n`)
    }
  }
  cache.harvests = harvests
  saveCache()

  const known = loadKeywordsCsv()
  const seen = new Map()
  for (const h of harvests) {
    for (const raw of h.children) {
      // Normalise on READ as well as on write. The harvest cache holds whatever the
      // sanitiser did on the day it was written, so a fix to that sanitiser has to
      // apply here too or a cached run keeps reproducing the bug it just fixed.
      const query = adsSafe(String(raw.query || '').toLowerCase())
      if (!query) continue
      if (/\bnear me\b|\bnear you\b/.test(query)) continue
      if (parents.some((p) => adsSafe(p.toLowerCase()) === query)) continue  // the parent is not its own child
      const prev = seen.get(query)
      if (prev) { prev.parents.add(raw.parent); prev.srcs.add(raw.src); continue }
      seen.set(query, { query, parents: new Set([raw.parent]), srcs: new Set([raw.src]) })
    }
  }
  const fresh = [...seen.values()].filter((c) => !known.byQuery.has(c.query))
  const dupes = [...seen.values()].length - fresh.length
  console.error(`\n  ${seen.size} distinct children, ${dupes} already in keywords.csv, ${fresh.length} new`)
  if (!fresh.length) { console.error('  nothing new to qualify.'); return }

  // 2. qualify: one bulk call for volume + difficulty ---------------------
  // callSoft, not call: `call` exits the process on an API error, which would throw
  // away a paid harvest over one malformed keyword — exactly what happened on the
  // first run. Ineligible keywords are staged with blank volume rather than dropped,
  // because "too long for Google Ads" is a fact about the Ads API, not about the query.
  const eligible = fresh.filter((c) => adsEligible(c.query))
  const skipped = fresh.length - eligible.length
  if (skipped) console.error(`  ${skipped} child(ren) exceed the Google Ads keyword limits (80 chars / 10 words) — staged with no volume, not dropped`)
  const needQual = eligible.filter((c) => !cache.qualified[c.query]).map((c) => c.query).slice(0, 1000)
  if (needQual.length) {
    const [vol, kd] = await Promise.all([
      callSoft('/v3/keywords_data/google_ads/search_volume/live', [{ keywords: needQual, location_name: LOCATION, language_name: LANGUAGE }]),
      callSoft('/v3/dataforseo_labs/google/bulk_keyword_difficulty/live', [{ keywords: needQual, location_name: LOCATION, language_name: LANGUAGE }]),
    ])
    if (vol.error) console.error(`  ⚠️  search_volume failed (${vol.error}) — volumes will be blank, not zero`)
    if (kd.error) console.error(`  ⚠️  bulk_keyword_difficulty failed (${kd.error}) — KD will be blank, not zero`)
    spent += (vol.cost || 0) + (kd.cost || 0)
    const volMap = new Map((vol.result || []).filter((r) => r?.keyword).map((r) => [String(r.keyword).toLowerCase(), r]))
    const kdMap = new Map((kd.result[0]?.items || []).map((r) => [String(r.keyword).toLowerCase(), r.keyword_difficulty]))
    for (const q of needQual) {
      const v = volMap.get(q) || {}
      cache.qualified[q] = {
        vol: v.search_volume ?? '', kd: kdMap.get(q) ?? '',
        cpc: v.cpc ?? '', competition: (v.competition ?? '').toString().toLowerCase(),
      }
    }
    saveCache()
  } else console.error('  (volume + KD served from today\'s cache, $0 spent)')
  for (const c of fresh) Object.assign(c, cache.qualified[c.query] || { vol: '', kd: '', cpc: '', competition: '' })

  // 3. probe the shortlist. Order by (has volume, then KD asc, then volume desc):
  //    for fan-out, low difficulty beats high volume — the child's job is to be
  //    reachable and thereby win a citation on the PARENT, not to bring traffic itself.
  //    Off-ICP and navigational children are excluded from the SHORTLIST, not from the
  //    staging file: they are still recorded, they just do not get paid probes.
  const probeable = fresh.filter((c) => !OFF_ICP_RX.test(c.query) && !NAV_RX.test(c.query) && !GATE_RX.test(c.query))
  const excluded = fresh.length - probeable.length
  if (excluded) console.error(`  ${excluded} child(ren) excluded from the probe budget (off-ICP, navigational, or compliance-gated) — staged, not probed`)
  const shortlist = [...probeable]
    .sort((a, b) => (Number(b.vol) ? 1 : 0) - (Number(a.vol) ? 1 : 0)
      || (Number(a.kd) || 99) - (Number(b.kd) || 99)
      || (Number(b.vol) || 0) - (Number(a.vol) || 0))
    .slice(0, probeN)
  const fromCache = shortlist.filter((c) => cache.probes[c.query]).length
  console.error(`  probing the top ${shortlist.length} of ${probeable.length} for reachability${fromCache ? ` (${fromCache} served from today's cache, $0)` : ''}...`)
  for (const c of shortlist) {
    let r = cache.probes[c.query]
    if (!r) {
      r = await fanoutProbe(c.query)
      spent += r.cost || 0
      if (!r.error) { cache.probes[c.query] = r; saveCache() }
    }
    Object.assign(c, { verdict: r.verdict, indie: r.indie, ours_top10: r.ours_top10, aio: r.aio, probe_error: r.error })
    const badge = { WINNABLE: '🟢', MIXED: '🟡', AUTHORITY: '⛔', 'NHS-NAV': '⛔' }[r.verdict] || '⚠️'
    const best = r.indie?.[0]
    process.stderr.write(`  ${badge} ${String(c.vol || '-').padStart(5)} kd ${String(c.kd || '-').padStart(3)}  ${c.query}${best ? `   (best non-authority: #${best.pos} ${best.domain})` : ''}\n`)
  }
  if (probeable.length > shortlist.length) {
    console.error(`  ⚠️  ${probeable.length - shortlist.length} eligible children were qualified but NOT probed (--probe ${probeN}).`)
    console.error('      They are written to the staging CSV with a blank serp_verdict and priority 3,')
    console.error('      which keeps them out of the queue until someone pays for the probe. Not a rejection.')
  }

  // 4. stage, in keywords.csv column order so a merge is an append, not a reshape.
  const date = new Date().toISOString().slice(0, 10)
  const priorityOf = (c) => {
    if (!c.verdict) return 3                       // unprobed: staged, not queued
    if (c.verdict === 'NHS-NAV' || c.verdict === 'AUTHORITY') return 4
    return c.verdict === 'WINNABLE' ? 1 : 2
  }
  const staged = fresh.map((c) => {
    const parentRow = known.byQuery.get([...c.parents][0].toLowerCase()) || {}
    const gated = GATE_RX.test(c.query) || parentRow.compliance === 'gate'
    const offIcp = OFF_ICP_RX.test(c.query)
    const nav = NAV_RX.test(c.query)
    const evidence = c.indie?.length ? `best non-authority #${c.indie[0].pos} ${c.indie[0].domain}, ${c.indie.length}/10 non-authority` : c.verdict ? 'top10 all authority/platform' : 'not probed'
    // Priority is the only thing csv-to-queue reads, so every exclusion has to land
    // as a priority the importer will not take (its default ceiling is 2). A reason
    // recorded only in `notes` would be invisible to the importer.
    const reason = gated ? 'GATED at source (Phase 0 boundary)' : offIcp ? 'off-ICP (not UK men)' : nav ? 'navigational' : ''
    return {
      query: c.query,
      vol: c.vol ?? '', kd: c.kd ?? '', cpc: c.cpc ?? '', competition: c.competition ?? '',
      intent: COMMERCIAL_RX.test(c.query) ? 'commercial' : 'informational',
      assigned_to: parentRow.assigned_to || '',
      priority: gated ? 9 : offIcp ? 8 : nav ? 7 : priorityOf(c),
      status: 'validated',
      compliance_risk: parentRow.compliance_risk || '',
      notes: `fanout child of "${[...c.parents].join(' | ')}" via ${[...c.srcs].join('+')} ${date}; ${evidence}${reason ? `; ${reason}` : ''}`,
      primary_article_slug: '',
      coverage_status: '',
      kd_source: 'dfs',
      score: '',
      role: 'fanout',
      compliance: gated ? 'gate' : (parentRow.compliance || ''),
      ai_overview: c.aio || '',
      serp_verdict: c.verdict || '',
      sources: 'fanout',
    }
  }).sort((a, b) => a.priority - b.priority || (Number(b.vol) || 0) - (Number(a.vol) || 0))

  const stagePath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', `fanout-staging-${date}.csv`)
  fs.writeFileSync(stagePath, [known.header.join(','), ...staged.map((r) => known.header.map((h) => csvCell(r[h] ?? '')).join(','))].join('\n') + '\n')

  // 5. report ------------------------------------------------------------
  const by = (v) => staged.filter((r) => r.serp_verdict === v)
  console.error('')
  console.error(`STAGED ${stagePath}`)
  console.error(`  ${staged.length} rows  |  🟢 WINNABLE ${by('WINNABLE').length}  🟡 MIXED ${by('MIXED').length}  ⛔ AUTHORITY ${by('AUTHORITY').length}  ⛔ NHS-NAV ${by('NHS-NAV').length}  · unprobed ${staged.filter((r) => !r.serp_verdict).length}`)
  console.error(`  never auto-queued: ${staged.filter((r) => r.compliance === 'gate').length} compliance-gated, ${staged.filter((r) => r.priority === 8).length} off-ICP, ${staged.filter((r) => r.priority === 7).length} navigational`)
  console.error(`  -> ${staged.filter((r) => r.priority <= 2 && r.compliance !== 'gate').length} row(s) at priority 1-2, which is what csv-to-queue will import`)
  console.error(`  spent: $${spent.toFixed(4)}`)
  const cited = harvests.flatMap((h) => h.unranked_citations.map((u) => ({ ...u, parent: h.parent })))
  if (cited.length) {
    console.error('')
    console.error('  CITED WITHOUT RANKING — the fan-out mechanism, caught in the act. Each of these')
    console.error('  domains is in the AI Overview for the parent but nowhere in its organic top 100,')
    console.error('  so it arrived through a sub-question. The page title names which one:')
    for (const u of cited.slice(0, 25)) console.error(`    ${u.parent}  <-  ${u.domain}  "${(u.title || '').slice(0, 90)}"`)
  }
  console.error('')
  console.error('  NEXT: this is a staging file, not a decision. Review it, merge the rows you want')
  console.error('  into keywords.csv (--merge appends the priority 1-2 ones), then run csv-to-queue.ts')
  console.error('  --role fanout. The 4b promotion gate is unchanged and still the article boundary.')

  if (merge) {
    const take = staged.filter((r) => r.priority <= 2 && r.compliance !== 'gate')
    if (!take.length) console.error('\n  --merge: nothing at priority 1-2 to merge.')
    else {
      const raw = fs.readFileSync(known.file, 'utf-8')
      const sep = raw.endsWith('\n') ? '' : '\n'
      fs.appendFileSync(known.file, sep + take.map((r) => known.header.map((h) => csvCell(r[h] ?? '')).join(',')).join('\n') + '\n')
      console.error(`\n  --merge: appended ${take.length} priority 1-2 row(s) to keywords.csv`)
    }
  }
  if (asJson) console.log(JSON.stringify({ date, staged, harvests: harvests.map((h) => ({ ...h, children: h.children.length })) }, null, 2))
}

// --- arg parsing --------------------------------------------------------
const [, , cmd, ...rest] = process.argv
const asJson = rest.includes('--json')
const args = rest.filter((a) => a !== '--json')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 50
const fileIdx = args.indexOf('--file')
const flag = (name, def) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : def }
// positional args = everything that isn't a flag or a flag's value
const FLAGS = new Set(['--limit', '--file', '--platform', '--provider', '--model', '--engines', '--probe', '--depth'])
const dry = args.includes('--dry')
const positional = args.filter((a, i) => !FLAGS.has(a) && !(i > 0 && FLAGS.has(args[i - 1])))

function keywordsFromArgs() {
  if (fileIdx >= 0) {
    const file = args[fileIdx + 1]
    return fs.readFileSync(file, 'utf-8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  }
  // Drop the --limit flag + its value only when present (limitIdx === -1 means absent,
  // and -1+1 === 0 would otherwise wrongly drop the first keyword).
  return args.filter((a, i) => limitIdx < 0 || (i !== limitIdx && i !== limitIdx + 1))
}

switch (cmd) {
  case 'balance':
    await cmdBalance()
    break
  case 'overview':
    await cmdOverview(keywordsFromArgs(), asJson)
    break
  case 'suggest':
    await cmdExpand('/v3/dataforseo_labs/google/keyword_suggestions/live', args[0], limit, asJson)
    break
  case 'related':
    await cmdExpand('/v3/dataforseo_labs/google/related_keywords/live', args[0], limit, asJson)
    break
  case 'serp':
    await cmdSerp(positional[0], asJson)
    break
  case 'teardown':
    await cmdTeardown(positional[0], asJson)
    break
  case 'ranked':
    await cmdRanked(positional[0], asJson)
    break
  case 'gap':
    await cmdGap(positional, asJson)
    break
  case 'mentions':
    await cmdMentions(positional[0], flag('--platform', 'google'), asJson)
    break
  case 'responses':
    await cmdResponses(positional[0], flag('--provider', 'chat_gpt'), flag('--model', ''), asJson)
    break
  case 'track': {
    const here = path.dirname(fileURLToPath(import.meta.url))
    const file = fileIdx >= 0 ? args[fileIdx + 1] : path.join(here, 'geo-prompts.txt')
    const engines = flag('--engines', ENGINES.join(',')).split(',').map((s) => s.trim()).filter(Boolean)
    const bad = engines.filter((e) => !ENGINES.includes(e))
    if (bad.length) { console.error(`Unknown engine(s): ${bad.join(', ')} (valid: ${ENGINES.join(', ')})`); process.exit(1) }
    const depth = Math.max(1, parseInt(flag('--depth', '100'), 10) || 100)
    await cmdTrack(file, engines, dry, asJson, depth)
    break
  }
  case 'fanout': {
    const seeds = positional.filter((a) => !a.startsWith('--'))
    const probeN = Math.max(0, parseInt(flag('--probe', '40'), 10) || 0)
    await cmdFanout(seeds, fileIdx >= 0 ? args[fileIdx + 1] : '', probeN, dry, args.includes('--merge'), args.includes('--refresh'), asJson)
    break
  }
  default:
    console.error('Usage: node dataforseo.mjs <balance|overview|suggest|related|serp|teardown|ranked|gap|mentions|responses|track|fanout> [...]  (see file header)')
    process.exit(1)
}
