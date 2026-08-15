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

// One (prompt, engine) probe. Returns a row even on failure: a skipped row is
// indistinguishable from a zero later, and zeros are what this file measures.
async function probe(prompt, engine) {
  const base = { prompt, engine, cited: false, mentioned: false, our_urls: [], sources: [], cost: 0, note: '' }
  try {
    if (engine === 'aio') {
      // MUST be /live/advanced with load_async_ai_overview. /live/regular returns
      // ONLY organic items, so an ai_overview lookup against it can never match and
      // reports a blind probe as a confident "no AI Overview". Same cost ($0.002).
      const { result, cost, error } = await callSoft('/v3/serp/google/organic/live/advanced', [
        { keyword: prompt, location_name: LOCATION, language_name: LANGUAGE, load_async_ai_overview: true },
      ])
      if (error) return { ...base, cost, note: `ERROR ${error}` }
      const items = result[0]?.items || []
      const aio = items.find((i) => i.type === 'ai_overview')
      if (!aio) return { ...base, cost, note: 'no AI Overview on this SERP' }
      const refs = (aio.references || aio.items || []).flatMap((r) => [r.url, r.domain]).filter(Boolean)
      const text = JSON.stringify(aio)
      return { ...base, cost, sources: [...new Set(refs.map((r) => r.replace(/^https?:\/\//, '').split('/')[0]))],
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

async function cmdTrack(file, engines, dry, asJson) {
  const prompts = readPrompts(file)
  if (!prompts.length) { console.error(`No prompts in ${file}`); process.exit(1) }
  const plan = prompts.length * engines.length
  // Measured 2026-08-15: responses $0.0148/call. AIO rides the organic SERP endpoint,
  // which is cheaper; estimated here and corrected from the real total after the run.
  const est = engines.reduce((s, e) => s + prompts.length * (e === 'aio' ? 0.003 : 0.0148), 0)
  console.error(`track: ${prompts.length} prompts x ${engines.length} engines = ${plan} calls, est ~$${est.toFixed(2)}`)
  if (dry) {
    console.error('--dry: nothing called, nothing spent, nothing written.')
    for (const p of prompts.slice(0, 5)) console.error(`  [${p.kind}] ${p.prompt}`)
    if (prompts.length > 5) console.error(`  ... and ${prompts.length - 5} more`)
    return
  }

  const rows = []
  for (const { prompt, kind } of prompts) {
    for (const engine of engines) {
      const r = await probe(prompt, engine)
      rows.push({ ...r, kind })
      process.stderr.write(`  ${r.cited ? '✅' : r.mentioned ? '📣' : '·'} ${engine.padEnd(10)} ${prompt}${r.note ? `  (${r.note})` : ''}\n`)
    }
  }

  const spent = rows.reduce((s, r) => s + (r.cost || 0), 0)
  const date = new Date().toISOString().slice(0, 10)
  fs.mkdirSync(SNAP_DIR, { recursive: true })
  const out = path.join(SNAP_DIR, `${date}.csv`)
  const header = 'date,kind,prompt,engine,cited,mentioned,our_urls,top_sources,cost,note'
  // Merge, never clobber: re-running one engine must not discard rows already paid
  // for by another. Keyed on (prompt, engine); this run wins for cells it covered.
  let merged = rows.map((r) => [
    date, r.kind, r.prompt, r.engine, r.cited, r.mentioned,
    r.our_urls.join(' '), r.sources.slice(0, 8).join(' '), r.cost ?? '', r.note,
  ])
  if (fs.existsSync(out)) {
    const keys = new Set(rows.map((r) => `${r.prompt}|${r.engine}`))
    const prevLines = fs.readFileSync(out, 'utf-8').split(/\r?\n/).slice(1).filter(Boolean)
    const kept = prevLines
      .map((l) => l.match(/(".*?"|[^,]*)(,|$)/g).map((s) => s.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')))
      .filter((c) => !keys.has(`${c[2]}|${c[3]}`))
    if (kept.length) console.error(`  (merged: kept ${kept.length} rows from the existing ${date} snapshot)`)
    merged = merged.concat(kept)
  }
  fs.writeFileSync(out, [header, ...merged.map((c) => c.map(csvCell).join(','))].join('\n') + '\n')

  // Diff against the most recent EARLIER snapshot, keyed on prompt+engine so a
  // prompt added since then simply has no prior and is reported as new, never as a loss.
  const prior = fs.readdirSync(SNAP_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.csv$/.test(f) && f < `${date}.csv`).sort().pop()
  let diff = null
  if (prior) {
    const prev = new Map()
    const lines = fs.readFileSync(path.join(SNAP_DIR, prior), 'utf-8').split(/\r?\n/).slice(1).filter(Boolean)
    for (const l of lines) {
      const c = l.match(/(".*?"|[^,]*)(,|$)/g).map((s) => s.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'))
      prev.set(`${c[2]}|${c[3]}`, c[4] === 'true')
    }
    const gained = rows.filter((r) => r.cited && prev.get(`${r.prompt}|${r.engine}`) === false)
    const lost = rows.filter((r) => !r.cited && prev.get(`${r.prompt}|${r.engine}`) === true)
    diff = { prior, gained, lost }
  }

  // Summarise the MERGED file, not just this run's rows: after a single-engine
  // re-run the two differ, and reporting the run alone understates coverage and
  // reads as though the other engines were never probed.
  const all = fs.readFileSync(out, 'utf-8').split(/\r?\n/).slice(1).filter(Boolean)
    .map((l) => l.match(/(".*?"|[^,]*)(,|$)/g).map((s) => s.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')))
    .map((c) => ({ kind: c[1], prompt: c[2], engine: c[3], cited: c[4] === 'true', mentioned: c[5] === 'true', note: c[9] || '' }))
  const tot = (k) => all.filter((r) => r.kind === k)
  const pct = (a) => (a.length ? `${a.filter((r) => r.cited).length}/${a.length}` : '0/0')
  console.error('')
  console.error(`SNAPSHOT ${out}`)
  console.error(`  cited: informational ${pct(tot('informational'))} | commercial ${pct(tot('commercial'))} | mentioned-not-cited ${all.filter((r) => r.mentioned && !r.cited).length}   (whole ${date} snapshot, ${all.length} cells)`)
  const aioBlind = all.filter((r) => r.engine === 'aio' && r.note.includes('no AI Overview')).length
  if (all.some((r) => r.engine === 'aio')) console.error(`  AI Overview present on ${all.filter((r) => r.engine === 'aio').length - aioBlind}/${all.filter((r) => r.engine === 'aio').length} SERPs (a 0/0 here means the probe is blind, not that Google shows none)`)
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
  } else {
    console.error('  no earlier snapshot: this is the baseline, nothing to diff against.')
  }
  if (asJson) console.log(JSON.stringify({ date, file: out, rows, diff }, null, 2))
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
const FLAGS = new Set(['--limit', '--file', '--platform', '--provider', '--model', '--engines'])
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
    await cmdTrack(file, engines, dry, asJson)
    break
  }
  default:
    console.error('Usage: node dataforseo.mjs <balance|overview|suggest|related|serp|teardown|ranked|gap|mentions|responses|track> [...]  (see file header)')
    process.exit(1)
}
