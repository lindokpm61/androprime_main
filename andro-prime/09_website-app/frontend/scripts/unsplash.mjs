#!/usr/bin/env node
// Unsplash authoring CLI for Andro Prime blog imagery.
//
//   node scripts/unsplash.mjs search "<query>"      → list candidate photos (you pick)
//   node scripts/unsplash.mjs use <slug> <photoId>  → trigger download + write frontmatter
//
// Design notes:
//   - search NEVER auto-picks. A health-context image must be chosen by a human;
//     a "tired man" auto-result can land somewhere off-brand or unsafe.
//   - use <slug> <photoId> performs the MANDATORY Unsplash download-trigger
//     (GET links.download_location) and writes photoSrc/photoAlt/photoCredit/
//     photoCreditUrl into content/blog/<slug>.mdx frontmatter.
//   - Only JSON calls count against the rate limit (Demo = 50/hr); the hotlinked
//     images.unsplash.com URL written to photoSrc does not.
//
// Creds live in the gitignored root .env (UNSPLASH_ACCESS_KEY). The access key is
// the Client-ID used for both search and the download trigger.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- env: walk up from this file until a .env is found (repo root) ---------
function loadRootEnv() {
  let dir = __dirname
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, '.env')
    if (fs.existsSync(candidate)) return parseEnv(fs.readFileSync(candidate, 'utf-8'))
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return {}
}

function parseEnv(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    out[m[1]] = v
  }
  return out
}

const env = loadRootEnv()
const ACCESS_KEY = env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY
if (!ACCESS_KEY) {
  console.error('Missing UNSPLASH_ACCESS_KEY (looked in root .env and process.env).')
  process.exit(1)
}

const API = 'https://api.unsplash.com'
const authHeaders = { Authorization: `Client-ID ${ACCESS_KEY}` }

async function api(url) {
  const res = await fetch(url, { headers: authHeaders })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Unsplash ${res.status} ${res.statusText} — ${body.slice(0, 200)}`)
  }
  const remaining = res.headers.get('x-ratelimit-remaining')
  if (remaining != null) process.stderr.write(`  (rate limit remaining: ${remaining})\n`)
  return res.json()
}

// Build a sized hotlink for the in-page hero from the photo's raw URL.
function heroUrl(raw) {
  return `${raw}${raw.includes('?') ? '&' : '?'}w=1600&q=80&auto=format&fit=crop`
}

async function search(query) {
  if (!query) {
    console.error('Usage: node scripts/unsplash.mjs search "<query>"')
    process.exit(1)
  }
  const url = `${API}/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape&content_filter=high`
  const data = await api(url)
  if (!data.results || data.results.length === 0) {
    console.log(`No results for "${query}".`)
    return
  }
  console.log(`\n${data.total} results for "${query}" — showing ${data.results.length}:\n`)
  for (const p of data.results) {
    console.log(`id: ${p.id}`)
    console.log(`  by:   ${p.user.name}`)
    console.log(`  alt:  ${p.alt_description || '(none)'}`)
    console.log(`  prev: ${p.urls.small}`)
    console.log('')
  }
  console.log('Pick one, then: node scripts/unsplash.mjs use <slug> <id>\n')
}

async function use(slug, photoId) {
  if (!slug || !photoId) {
    console.error('Usage: node scripts/unsplash.mjs use <slug> <photoId>')
    process.exit(1)
  }
  const mdxPath = path.join(__dirname, '..', 'content', 'blog', `${slug}.mdx`)
  if (!fs.existsSync(mdxPath)) {
    console.error(`Article not found: content/blog/${slug}.mdx`)
    process.exit(1)
  }

  const photo = await api(`${API}/photos/${photoId}`)

  // MANDATORY: trigger the download endpoint exactly once when a photo is used.
  if (photo.links?.download_location) {
    await api(photo.links.download_location)
    process.stderr.write('  download trigger sent\n')
  } else {
    console.error('Photo has no download_location — aborting (ToS requires the trigger).')
    process.exit(1)
  }

  const raw = fs.readFileSync(mdxPath, 'utf-8')
  const parsed = matter(raw)
  parsed.data.photoSrc = heroUrl(photo.urls.raw)
  parsed.data.photoAlt = photo.alt_description || parsed.data.title || slug
  parsed.data.photoCredit = photo.user.name
  parsed.data.photoCreditUrl = photo.user.links.html

  // gray-matter's stringify re-emits frontmatter; preserves the body verbatim.
  fs.writeFileSync(mdxPath, matter.stringify(parsed.content, parsed.data), 'utf-8')

  console.log(`\nWired ${slug}.mdx:`)
  console.log(`  photoSrc:       ${parsed.data.photoSrc}`)
  console.log(`  photoAlt:       ${parsed.data.photoAlt}`)
  console.log(`  photoCredit:    ${parsed.data.photoCredit}`)
  console.log(`  photoCreditUrl: ${parsed.data.photoCreditUrl}\n`)
}

const [cmd, a, b] = process.argv.slice(2)
const run = cmd === 'search' ? search(a) : cmd === 'use' ? use(a, b) : null
if (!run) {
  console.error('Usage:\n  node scripts/unsplash.mjs search "<query>"\n  node scripts/unsplash.mjs use <slug> <photoId>')
  process.exit(1)
}
run.catch((e) => {
  console.error(String(e.message || e))
  process.exit(1)
})
