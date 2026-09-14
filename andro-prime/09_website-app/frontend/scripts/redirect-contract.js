#!/usr/bin/env node
/**
 * Every deliberate redirect this site serves, and the EVIDENCE that each one is
 * still declared where this table says it is.
 *
 * ── WHY THIS FILE EXISTS ──────────────────────────────────────────────────
 * `test-host-routing.ts` proves `routeDecision()` returns the right verdict for
 * a given host and path. It is a good test and it has never fetched a URL.
 * Nothing in this repo has. So a redirect could be correct in the function and
 * wrong on the wire — a middleware matcher that never runs, a `redirect()` a
 * refactor turned into a `notFound()`, a config entry that stopped being
 * reachable — and every check would stay green.
 *
 * That gap is worth closing before a migration specifically, because a redirect
 * is the one thing a reader meets without asking for it. This module is the
 * table; `verify-http-contract.ts` is what drives it over real HTTP.
 *
 * ── THE TABLE DOES NOT OWN THE FACTS, IT POINTS AT THEM ───────────────────
 * Three kinds of row, and only the first is typed out here:
 *
 *   1. IN-PAGE  — a server `redirect()` inside a `page.tsx` or a `route.ts`.
 *                 Typed below, with an `evidence` regex judged against that
 *                 file, exactly as `route-exclusions.js` does it.
 *   2. CONFIG   — `redirects()` in `next.config.ts`. NOT typed: parsed out of
 *                 the config, so a redirect added there without a contract row
 *                 is a hard failure rather than a silent omission.
 *   3. HOST     — the apex/app-host split. NOT typed: computed from
 *                 `lib/hosts.ts` via `route-list.js`'s `APP_PREFIXES` and
 *                 `CUTOVER_PHASE`, so this table cannot disagree with the
 *                 routing it is checking.
 *
 * The rule behind all three: a duplicated fact is invisible exactly while the
 * copies agree, and the first correction is what makes it visible. So only the
 * facts that live nowhere else get typed.
 *
 * ── A SERVER redirect() IS 307, NOT 301 ───────────────────────────────────
 * Next's `redirect()` emits **307** on a document request; `permanentRedirect()`
 * emits 308. `next.config.ts` `permanent: true` is **308**. These are not
 * interchangeable and none of them is 301 or 302. Written down because the
 * obvious "fix" when a status looks wrong is to make it 301, which would change
 * method semantics on POST and is not what any of these routes mean.
 *
 * ── OVERLAP WITH route-exclusions.js IS CLOSED BY ASSERTION ───────────────
 * `/founding-member` and `/activate` already appear there with redirect-shaped
 * evidence, because a route that redirects has no UI to count. Rather than copy
 * those clauses, `judgeRedirectContract()` asserts that every redirect-shaped
 * exclusion has a row here. Two files, one fact, checked in one direction.
 *
 * Usage:
 *   node scripts/redirect-contract.js          # judge the offline half, print the table
 *   require('./redirect-contract.js')          # { CONTRACT, judgeRedirectContract, configRedirects }
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { ROOT, die } = require('./route-list.js')

/* ------------------------------------------------------------------ table */

/**
 * `from`     the path requested, on `host` ('apex' | 'app')
 * `to`       the expected Location. A function receives { SITE, APP } origins.
 * `status`   the exact status code expected on the wire
 * `file`     the source that declares it, relative to frontend/
 * `evidence` regexes that must match that file, or the row is stale
 * `why`      why this redirect exists at all
 */
const CONTRACT = [
  {
    from: '/founding-member',
    to: '/kits',
    status: 307,
    host: 'apex',
    file: 'app/(marketing)/founding-member/page.tsx',
    why: 'the founding-member programme was retired 2026-06-04; the page is a bare redirect',
    evidence: [/redirect\(\s*['"]\/kits['"]\s*\)/],
  },
  {
    from: '/activate',
    to: '/how-to-sample',
    status: 307,
    host: 'apex',
    file: 'app/activate/page.tsx',
    why: 'deprecated by the QR decision of 2026-06-12; kit inserts may still carry the printed path',
    evidence: [/redirect\(\s*['"]\/how-to-sample['"]\s*\)/],
  },
  /* 🔴 THESE TWO REDIRECT TWICE, AND ONLY THE FIRST HOP IS OBSERVABLE HERE.
     Both pages contain `redirect('/account')`, and both are in middleware's
     `protectedRoutes`, so the AUTH GATE FIRES FIRST: an anonymous request never
     reaches the page and sees a 307 to /auth/login instead. The first version of
     this table declared `/account` and failed against the running server, which
     is the table being wrong rather than the site.

     The split is the useful part. `to` is what an anonymous client can be shown
     to receive, which is the only thing an HTTP check can honestly assert.
     `evidence` still pins the in-page `redirect('/account')`, so the fact behind
     the gate is checked too — by reading the source, which is where that fact
     is observable. Neither half alone covers it. */
  {
    from: '/founding-member-status',
    to: '/auth/login',
    status: 307,
    host: 'app',
    file: 'app/(app)/founding-member-status/page.tsx',
    why: 'retired with the founding-member programme; the page redirects to /account, but it is auth-gated so anonymous traffic stops at login',
    locationMust: [/next=%2Ffounding-member-status/],
    evidence: [/redirect\(\s*['"]\/account['"]\s*\)/],
  },
  {
    from: '/supplement-waitlist-status',
    to: '/auth/login',
    status: 307,
    host: 'app',
    file: 'app/(app)/supplement-waitlist-status/page.tsx',
    why: 'folded into /account in the Direction F rebuild; auth-gated, so anonymous traffic stops at login',
    locationMust: [/next=%2Fsupplement-waitlist-status/],
    evidence: [/redirect\(\s*['"]\/account['"]\s*\)/],
  },
  {
    from: '/lp/foundations',
    to: '/lp/hormone-recovery',
    status: 308,
    host: 'apex',
    file: 'next.config.ts',
    config: true, // also parsed out of the config; see configRedirects()
    why: 'the duplicate Kit 3 landing page; affiliate and ad links may still carry the old slug',
    evidence: [/source:\s*['"]\/lp\/foundations['"]/, /permanent:\s*true/],
  },
  {
    /* `/go/start` IS THE EMPTY-STATE CTA ON THE BIO GRID, AND ITS "UNMATCHED"
       ATTRIBUTION IS THE POINT, NOT AN ACCIDENT. `app/go/page.tsx` explains it
       in place: linking the button at `/go/d01` would record every pre-run
       click against the first carousel post, seeding the baseline with clicks
       on a post nobody has seen. `start` matches nothing on purpose, so the
       handler routes it to the quiz and records it as unmatched — true, and
       separable at read time.

       Declared here because `audit-link-integrity.js` correctly flagged it as a
       redirect nobody had written down, and "intentional" is a property of the
       author's head until it is in a table something re-tests. If the slug ever
       becomes a real post, this row fails and someone has to think about the
       attribution again. */
    from: '/go/start',
    to: '/test-selector',
    status: 307,
    host: 'apex',
    file: 'app/go/page.tsx',
    why: 'the bio grid\'s empty-state CTA; routes to the quiz and is recorded as unmatched so pre-run clicks do not pollute a real post\'s baseline',
    locationMust: [/utm_content=unknown/, /utm_term=unmatched/, /utm_source=instagram/],
    evidence: [/href="\/go\/start"/],
  },
  {
    // The click handler, not a page. An unknown slug must NEVER 404: it is a
    // link-in-bio destination and a 404 there is a dead Instagram profile link.
    from: '/go/__no_such_slug__',
    to: '/test-selector',
    status: 307,
    host: 'apex',
    file: 'app/go/[slug]/route.ts',
    why: 'an unrecognised bio-grid slug falls back to the quiz rather than 404-ing a live profile link',
    // The UTM stamp is the route's entire purpose, so it is part of the contract.
    locationMust: [/utm_content=unknown/, /utm_term=unmatched/],
    evidence: [/unmatched/],
  },
]

/* ------------------------------------------------- config redirects, parsed */

/**
 * The `redirects()` entries in next.config.ts, as `{ source, destination, permanent }`.
 * Parsed rather than typed so a new config redirect cannot arrive without a
 * contract row. Deliberately a shallow parse: these entries are plain object
 * literals, and a parser clever enough to handle anything else would be a
 * second thing to maintain.
 */
function configRedirects() {
  const file = path.join(ROOT, 'next.config.ts')
  const src = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  const block = src.match(/async\s+redirects\s*\(\s*\)\s*\{([\s\S]*?)\n\s*\},?\n/)
  if (!block) {
    // No redirects() at all is a legitimate state, but it must be DISTINGUISHED
    // from "the parser stopped working", which is why this looks for the method
    // rather than for entries.
    if (!/redirects\s*\(/.test(src)) return []
    die('found a redirects() in next.config.ts but could not parse its body. Fix this parser rather than trusting a pass.')
  }
  const out = []
  for (const m of block[1].matchAll(/source:\s*['"]([^'"]+)['"][\s\S]*?destination:\s*['"]([^'"]+)['"][\s\S]*?permanent:\s*(true|false)/g)) {
    out.push({ source: m[1], destination: m[2], permanent: m[3] === 'true' })
  }
  return out
}

/* ---------------------------------------------------------------- judgement */

/**
 * The offline half: does every row still describe the tree, and does the tree
 * contain a redirect the table has not heard of? Returns a list of problems;
 * an empty list means the contract is internally sound. It says NOTHING about
 * what the server actually returns — that is verify-http-contract.ts's job, and
 * keeping the two apart is what lets this run with no server.
 */
function judgeRedirectContract() {
  const problems = []

  // 1. Every row's evidence still matches its own source file.
  for (const row of CONTRACT) {
    const f = path.join(ROOT, row.file)
    if (!fs.existsSync(f)) {
      problems.push(`${row.from}: declares ${row.file}, which does not exist. The redirect moved or went.`)
      continue
    }
    const src = fs.readFileSync(f, 'utf8')
    for (const re of row.evidence || []) {
      if (!re.test(src)) {
        problems.push(`${row.from}: evidence ${re} no longer matches ${row.file}. Either the redirect changed or this row is stale.`)
      }
    }
    if (!row.evidence || !row.evidence.length) {
      problems.push(`${row.from}: has no evidence clause. A row nothing re-tests is a comment with the authority of a check.`)
    }
  }

  // 2. Every config redirect has a row. This is the direction that catches an
  //    addition; direction 1 only catches a removal.
  for (const c of configRedirects()) {
    const row = CONTRACT.find((r) => r.from === c.source)
    if (!row) {
      problems.push(`next.config.ts redirects ${c.source} -> ${c.destination} and no CONTRACT row declares it. Add one.`)
      continue
    }
    const expect = c.permanent ? 308 : 307
    if (row.status !== expect) {
      problems.push(`${c.source}: next.config.ts says permanent=${c.permanent} (${expect}) and the contract row says ${row.status}.`)
    }
    if (row.to !== c.destination) {
      problems.push(`${c.source}: next.config.ts sends it to ${c.destination} and the contract row says ${row.to}.`)
    }
  }

  // 3. Every redirect-shaped route-conformance exclusion has a row here. The two
  //    files describe the same fact from different sides: a route excluded
  //    BECAUSE it redirects is a route this table must be able to drive.
  let EXCLUSIONS = null
  try { ({ EXCLUSIONS } = require('./route-exclusions.js')) } catch { /* optional */ }
  if (EXCLUSIONS) {
    for (const [url, ex] of Object.entries(EXCLUSIONS)) {
      const shaped = (ex.evidence?.must || []).some((re) => /redirect\\\(/.test(re.source))
      if (shaped && !CONTRACT.some((r) => r.from === url)) {
        problems.push(`route-exclusions.js excludes ${url} for redirecting, and no CONTRACT row drives it. One of the two files is out of date.`)
      }
    }
  }

  // 4. The table cannot go vacuous. A collector that returns nothing passes
  //    every assertion built on it, which is the failure mode this whole suite
  //    is written against.
  if (CONTRACT.length < 7) {
    problems.push(`CONTRACT has only ${CONTRACT.length} rows. Seven redirects were declared on 2026-09-14; a shorter table means rows were deleted rather than that redirects were.`)
  }

  return problems
}

module.exports = { CONTRACT, configRedirects, judgeRedirectContract }

/* --------------------------------------------------------------- standalone */

if (require.main === module) {
  const problems = judgeRedirectContract()
  const cfg = configRedirects()
  console.log('Redirect contract: every deliberate redirect, judged against its own source\n')
  console.log(`  ${CONTRACT.length} rows; ${cfg.length} of them declared in next.config.ts`)
  for (const r of CONTRACT) {
    console.log(`  ${String(r.status)}  ${r.host.padEnd(4)}  ${r.from}  ->  ${r.to}`)
    console.log(`        ${r.why}`)
    console.log(`        declared in ${r.file}`)
  }
  console.log()
  if (problems.length) {
    console.error(`🔴 ${problems.length} problem(s):`)
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(1)
  }
  console.log('🟢 contract is internally sound. This says nothing about what the server returns —')
  console.log('   run scripts/verify-http-contract.ts against a running server for that.')
}
