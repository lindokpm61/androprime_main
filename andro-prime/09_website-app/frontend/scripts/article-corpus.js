#!/usr/bin/env node
/**
 * THE PUBLISHED ARTICLE CORPUS, FROM THE SITE'S OWN SITEMAP.
 *
 * WHY THIS IS SHARED RATHER THAN COPIED. `route-list.js` renders exactly ONE
 * article for `/blog/[slug]`, which is correct for a conformance count and wrong
 * for anything that varies per article. Every sweep built from the route list
 * therefore measures one of eighteen articles and prints a complete-looking
 * summary — the same shape as defect M7, where a dynamic route collapsed
 * seventeen articles into one URL and the collapse was invisible because the
 * total was never wrong, only the denominator.
 *
 * `audit-link-integrity.js` already solved this for citations. Rather than a
 * second copy drifting from the first, the resolver lives here and both callers
 * read it — the same move that took 75 lines of duplicated WCAG probe out of
 * `audit-dark-contrast.js`.
 *
 * ⚠ THE SITEMAP IS THE SOURCE ON PURPOSE. It is the site's own answer to "what
 * is published", generated from the same data the pages render from, so it
 * cannot disagree with them the way a hardcoded list or a separate DB query can.
 * The cost is that it only works against a running server, which every caller
 * already needs.
 */
'use strict'

const http = require('node:http')
const https = require('node:https')

/**
 * Every published article path (`/blog/<slug>`), de-duplicated.
 * Resolves to `[]` on any transport failure — callers decide whether an empty
 * corpus is fatal, because for some of them it is and for some it is not.
 */
function articleSlugs({ base, timeout = 15000 } = {}) {
  return new Promise((resolve) => {
    let u
    try {
      u = new URL(`${base}/sitemap.xml`)
    } catch {
      resolve([])
      return
    }
    const mod = u.protocol === 'https:' ? https : http
    const req = mod.request(
      { hostname: u.hostname, port: u.port, path: u.pathname, method: 'GET' },
      (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (c) => {
          body += c
        })
        res.on('end', () => {
          const paths = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)]
            .map((m) => {
              try {
                return new URL(m[1]).pathname
              } catch {
                return ''
              }
            })
            .filter((p) => p.startsWith('/blog/'))
          resolve([...new Set(paths)])
        })
      },
    )
    req.on('error', () => resolve([]))
    req.setTimeout(timeout, () => req.destroy())
    req.end()
  })
}

/**
 * Swap the `/blog/[slug]` placeholder in a route list for the real corpus.
 *
 * `floor` is the smallest corpus the caller will accept: below it, the expansion
 * is a sample pretending to be a corpus and the caller should bail rather than
 * print a confident partial result. Returns `{ routes, slugs, expanded }` so the
 * caller can say what it measured.
 */
async function expandArticleRoutes(routes, { base, timeout, floor = 5, file } = {}) {
  const slugs = await articleSlugs({ base, timeout })
  if (slugs.length < floor) return { routes, slugs, expanded: false }
  const rest = routes.filter((r) => r.url !== '/blog/[slug]')
  const placeholder = routes.find((r) => r.url === '/blog/[slug]')
  const sourceFile = file || placeholder?.file || 'app/(marketing)/blog/[slug]/page.tsx'
  return {
    routes: rest.concat(slugs.map((p) => ({ url: p, file: sourceFile, href: p }))),
    slugs,
    expanded: true,
  }
}

module.exports = { articleSlugs, expandArticleRoutes }
