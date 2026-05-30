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
 * Add --json for raw rows instead of CSV.
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

// --- arg parsing --------------------------------------------------------
const [, , cmd, ...rest] = process.argv
const asJson = rest.includes('--json')
const args = rest.filter((a) => a !== '--json')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 50
const fileIdx = args.indexOf('--file')

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
  default:
    console.error('Usage: node dataforseo.mjs <balance|overview|suggest|related> [...]  (see file header)')
    process.exit(1)
}
