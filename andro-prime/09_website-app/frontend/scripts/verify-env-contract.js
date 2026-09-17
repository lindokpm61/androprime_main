#!/usr/bin/env node
/**
 * EVERY BUILD-TIME VARIABLE THE APP READS IS ACTUALLY BAKED INTO THE BUILD.
 *
 *   node andro-prime/09_website-app/frontend/scripts/verify-env-contract.js
 *
 * WHY THIS EXISTS. `NEXT_PUBLIC_*` is inlined by the compiler, so its value is
 * decided at BUILD time and cannot be repaired by restarting the container. The
 * Coolify build gets those values through Docker build secrets, and the
 * Dockerfile names them one at a time:
 *
 *     --mount=type=secret,id=NEXT_PUBLIC_FOO \
 *     export NEXT_PUBLIC_FOO=$(cat /run/secrets/NEXT_PUBLIC_FOO 2>/dev/null || echo '')
 *
 * That `|| echo ''` is the hazard. A variable the app reads but the Dockerfile
 * never mounts is not an error at build time, not an error at boot, and not an
 * error at request time. It compiles to the empty string, every consumer takes
 * its `?? fallback` branch, and the feature is simply absent from production
 * while working perfectly on the developer's machine, where `.env.local` has it.
 *
 * 🔴 WHAT THIS WOULD HAVE CAUGHT, AND IT IS NOT HYPOTHETICAL. On 2026-09-15 two
 * variables the app reads were missing from the mount list and two that nothing
 * reads were being mounted:
 *
 *   - NEXT_PUBLIC_GA4_MEASUREMENT_ID was never baked, so `GoogleAnalytics`
 *     returned null on every production page. GA4 had never fired in production,
 *     and because `CookieConsent` gates itself on the same variable, the cookie
 *     banner had never rendered there either. Both degrade silently BY DESIGN —
 *     no tag means no non-essential cookies means no banner is required — so the
 *     whole chain was consistent, invisible, and wrong.
 *   - NEXT_PUBLIC_APP_URL was never baked, so `lib/hosts.ts` always took its
 *     hardcoded `https://app.andro-prime.com` fallback. Correct in production by
 *     coincidence; unsettable anywhere else.
 *
 * Nothing in the repo could see either one. tsc cannot: the reads are valid.
 * The build cannot: an empty string is a string. A screenshot cannot: the
 * absent-analytics page looks exactly like the present-analytics page. Only a
 * comparison of the two lists finds it, and until this script nobody was
 * comparing them.
 *
 * WHAT IT ASSERTS
 *   A. Every NEXT_PUBLIC_* the app reads is mounted in the Dockerfile.
 *   B. Every NEXT_PUBLIC_* the Dockerfile mounts is read by the app. A mount
 *      that feeds nothing is how the list stopped describing the app.
 *   C. Every variable the app reads is documented in `.env.example`, which is
 *      the only thing a new deployment is configured from.
 *   D. The dynamic `process.env[...]` sites are still exactly the known ones.
 *      A fourth one would put its keys outside this script's harvest, and the
 *      script would keep passing while checking an incomplete list.
 *   G. No module carries a hardcoded CREDENTIAL OR ORIGIN as a fallback. A is
 *      about a variable arriving empty; G is about what happens next. Until
 *      2026-09-17 `lib/supabase/env.ts` answered a missing variable with the real
 *      production project ref and the real anon key, and
 *      `lib/activate/sendActivationLink.ts` answered one with
 *      `http://localhost:3000` inside a link that gets EMAILED. Neither failed.
 *      Both are the shape A exists to prevent, surviving A by supplying an answer
 *      instead of an error — and the supabase one was invisible because the
 *      fallback ref and the live project happened to be the same, so production
 *      was correct by coincidence rather than by configuration.
 *
 * ⚠ A AND B ARE BOTH ESCAPABLE, DELIBERATELY, VIA THE TABLES BELOW — with a
 * reason recorded next to each escape. The point is not that the two lists can
 * never differ; it is that a difference has to be a sentence somebody wrote.
 */
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

/* Scanned for `process.env.X`. The root files matter as much as the directories:
   Sentry's DSN is read ONLY in instrumentation.ts and instrumentation-client.ts,
   so a scan of app/lib/components alone concludes that NEXT_PUBLIC_SENTRY_DSN is
   an unused mount and tells you to delete it. */
const SCAN_DIRS = ['app', 'lib', 'components']
const SCAN_FILES = [
  'middleware.ts',
  'instrumentation.ts',
  'instrumentation-client.ts',
  'next.config.ts',
]

/* Set by the platform or the toolchain, never by us, never in Coolify. */
const PLATFORM_SET = new Set(['NODE_ENV', 'CI', 'NEXT_RUNTIME', 'NEXT_DIST_DIR'])

/* Read by the app, deliberately NOT a Docker build secret. */
const MOUNT_NOT_REQUIRED = {
  // Nothing today. Kept so the escape hatch is visible rather than invented
  // under pressure the first time someone needs it.
}

/* Mounted by the Dockerfile, deliberately read by nothing. */
const MOUNT_WITHOUT_READER = {
  // Nothing today. Both former entries were removed on 2026-09-15 rather than
  // excused: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (checkout is a server-side
  // redirect; Stripe.js is never loaded in the browser) and
  // NEXT_PUBLIC_PLAUSIBLE_DOMAIN (Plausible was replaced by GA4).
}

/* `next.config.ts` runs ONLY at build time, so anything it reads is build-time
   input whatever its name — the NEXT_PUBLIC_ prefix is about client exposure,
   not about when the value is needed. A var read here and not mounted is
   simply absent from every Coolify build, silently.

   Each entry must record the CONSEQUENCE of leaving it unmounted, so the
   decision is a sentence somebody wrote rather than an omission nobody noticed. */
const BUILD_TIME_NOT_MOUNTED = {
  SENTRY_AUTH_TOKEN:
    'Source maps are NOT uploaded from the Coolify build, so production stack ' +
    'traces stay minified. Every Sentry release row in this org was written by ' +
    "a developer's local build instead. Mounting it means putting a Sentry " +
    'write token in the build; that is Keith\'s call. Raised 2026-09-15, see ' +
    'qa/direction-f-migration-audit.md.',
  SENTRY_ORG: 'Only used alongside SENTRY_AUTH_TOKEN; unmounted for the same reason.',
  SENTRY_PROJECT: 'Only used alongside SENTRY_AUTH_TOKEN; unmounted for the same reason.',
}

/* `process.env[someVariable]` defeats a grep for `process.env.NAME`. Each site
   resolves its key from a table in the same module, so the keys ARE static and
   ARE harvestable — but only if this script knows the site exists. Adding a
   fourth site without adding it here must fail, not silently shrink the corpus.
   Same guard as `assertMirrorIsCurrent` in verify-legal-text.js. */
const DYNAMIC_SITES = {
  'app/api/checkout/kit/route.ts': 'bundleConfig.stripePriceEnv',
  'lib/membership/memberPricing.ts': 'MEMBER_COUPON_ENV',
  'lib/subscriptions/products.ts': 'info.stripePriceEnv',
}

/* The key tables the sites above read from. Harvested by pattern so a new price
   row is picked up without touching this script. */
const DYNAMIC_KEY_SOURCES = [
  { file: 'lib/bundles/config.ts', re: /stripePriceEnv:\s*'([A-Z0-9_]+)'/g },
  { file: 'lib/subscriptions/products.ts', re: /stripePriceEnv:\s*'([A-Z0-9_]+)'/g },
  { file: 'lib/membership/memberPricing.ts', re: /MEMBER_COUPON_ENV\s*=\s*'([A-Z0-9_]+)'/g },
]

const problems = []
function fail(msg) {
  problems.push(msg)
}

/**
 * Blank out comments, preserving every newline so reported line numbers stay true.
 *
 * Needed because assertion F matches a code SHAPE, and this repo documents that
 * shape in prose: `lib/site-url.ts`'s header explains the very `?? fallback`
 * pattern it was written to replace, and matching that comment made the checker
 * report the one module that already does it correctly. A checker that flags the
 * documentation of a rule as a violation of it gets switched off. Same failure the
 * content-doctor guard hit when the verdict scanner described its own input.
 */
function stripComments(src) {
  const blankOut = (m) => m.replace(/[^\n]/g, ' ')
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blankOut) // block and JSDoc
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, p1) => p1 + blankOut(m.slice(p1.length)))
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      walk(full, out)
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

function readSources() {
  const files = []
  for (const dir of SCAN_DIRS) {
    const full = path.join(ROOT, dir)
    if (!fs.existsSync(full)) {
      fail(`scan directory is missing: ${dir}. The harvest would be incomplete.`)
      continue
    }
    walk(full, files)
  }
  for (const file of SCAN_FILES) {
    const full = path.join(ROOT, file)
    if (!fs.existsSync(full)) {
      fail(`scan file is missing: ${file}. The harvest would be incomplete.`)
      continue
    }
    files.push(full)
  }
  return files
}

/** Every `process.env.NAME` in the scanned corpus, minus platform-set names. */
function harvestStaticReads(files) {
  const found = new Map() // name -> Set of relative paths
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    for (const m of src.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      const name = m[1]
      if (PLATFORM_SET.has(name)) continue
      const rel = path.relative(ROOT, file).replace(/\\/g, '/')
      if (!found.has(name)) found.set(name, new Set())
      found.get(name).add(rel)
    }
  }
  return found
}

/** Assertion D: the dynamic sites are exactly the ones we know how to harvest. */
function assertDynamicSitesKnown(files) {
  const actual = new Set()
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    if (/process\.env\[/.test(src)) {
      actual.add(path.relative(ROOT, file).replace(/\\/g, '/'))
    }
  }
  const known = new Set(Object.keys(DYNAMIC_SITES))
  for (const site of actual) {
    if (!known.has(site)) {
      fail(
        `${site} reads process.env[...] with a computed key and is not in DYNAMIC_SITES. ` +
          `Its keys are outside this script's harvest, so every assertion below is ` +
          `checking an incomplete list. Add the site and its key table.`
      )
    }
  }
  for (const site of known) {
    if (!actual.has(site)) {
      fail(
        `DYNAMIC_SITES lists ${site}, which no longer reads process.env[...]. ` +
          `Remove it, so the guard keeps describing the code.`
      )
    }
  }
}

/** Keys reachable only through a computed lookup. */
function harvestDynamicKeys() {
  const keys = new Map()
  for (const { file, re } of DYNAMIC_KEY_SOURCES) {
    const full = path.join(ROOT, file)
    if (!fs.existsSync(full)) {
      fail(`dynamic key table is missing: ${file}`)
      continue
    }
    const src = fs.readFileSync(full, 'utf8')
    let matched = 0
    for (const m of src.matchAll(re)) {
      matched += 1
      if (!keys.has(m[1])) keys.set(m[1], new Set())
      keys.get(m[1]).add(file)
    }
    if (matched === 0) {
      fail(
        `dynamic key table ${file} matched no keys. The pattern has gone stale, ` +
          `so those variables are now invisible to this check.`
      )
    }
  }
  return keys
}

/** The `id=` list from the Dockerfile's build-secret mounts. */
function harvestDockerfileMounts() {
  const full = path.join(ROOT, 'Dockerfile')
  if (!fs.existsSync(full)) {
    fail('Dockerfile not found; cannot verify the build-argument contract.')
    return new Set()
  }
  const src = fs.readFileSync(full, 'utf8')
  const mounts = new Set()
  for (const m of src.matchAll(/--mount=type=secret,id=([A-Z0-9_]+)/g)) {
    mounts.add(m[1])
  }
  if (mounts.size === 0) {
    fail('Dockerfile declares no build secrets. Either the build changed shape or this pattern is stale.')
  }
  /* A mount only does something if the RUN body also exports it. Mounting
     without exporting is the same silent failure one layer down. */
  for (const name of mounts) {
    if (!new RegExp(`export\\s+${name}=`).test(src)) {
      fail(`Dockerfile mounts ${name} but never exports it, so the build cannot see it.`)
    }
  }
  return mounts
}

function harvestEnvExample() {
  const full = path.join(ROOT, '.env.example')
  if (!fs.existsSync(full)) {
    fail('.env.example not found; it is what a new deployment is configured from.')
    return new Set()
  }
  const documented = new Set()
  for (const line of fs.readFileSync(full, 'utf8').split(/\r?\n/)) {
    const m = /^([A-Z0-9_]+)=/.exec(line.trim())
    if (m) documented.add(m[1])
  }
  return documented
}

function main() {
  const files = readSources()
  if (problems.length) return report()

  assertDynamicSitesKnown(files)

  const staticReads = harvestStaticReads(files)
  const dynamicKeys = harvestDynamicKeys()
  const mounts = harvestDockerfileMounts()
  const documented = harvestEnvExample()

  const allRead = new Map(staticReads)
  for (const [name, where] of dynamicKeys) {
    if (!allRead.has(name)) allRead.set(name, new Set())
    for (const w of where) allRead.get(name).add(`${w} (computed key)`)
  }

  const publicRead = [...allRead.keys()].filter((n) => n.startsWith('NEXT_PUBLIC_')).sort()

  // A. read but not baked
  for (const name of publicRead) {
    if (mounts.has(name)) continue
    if (name in MOUNT_NOT_REQUIRED) continue
    const where = [...allRead.get(name)].sort().join(', ')
    fail(
      `${name} is read by the app but the Dockerfile never mounts it, so the ` +
        `production build inlines an empty string and every consumer silently ` +
        `takes its fallback. Read in: ${where}`
    )
  }

  // B. baked but read by nothing
  for (const name of [...mounts].sort()) {
    if (allRead.has(name)) continue
    if (name in MOUNT_WITHOUT_READER) continue
    fail(
      `Dockerfile mounts ${name} but nothing in the app reads it. Remove the ` +
        `mount, or record why it is kept in MOUNT_WITHOUT_READER.`
    )
  }

  // C. read but undocumented
  for (const name of [...allRead.keys()].sort()) {
    if (documented.has(name)) continue
    const where = [...allRead.get(name)].sort().join(', ')
    fail(`${name} is read by the app but absent from .env.example. Read in: ${where}`)
  }

  /* F. `process.env.NEXT_PUBLIC_X ?? fallback` is a defect in THIS repo, however
     correct it looks. The Dockerfile exports every build secret as
     `$(cat ... || echo '')`, so an unsupplied variable arrives as the EMPTY
     STRING — and `??` only fires on null/undefined, so it passes the empty
     string through and the fallback never runs. The consumer then works with
     `''` instead of its default. On NEXT_PUBLIC_APP_URL that emptied APP_URL,
     which would have made `isAppHost()` false for every request site-wide.
     Truthiness (`||`, or an explicit check) is the correct operator here. */
  for (const file of files) {
    const src = stripComments(fs.readFileSync(file, 'utf8'))
    const rel = path.relative(ROOT, file).replace(/\\/g, '/')
    for (const m of src.matchAll(/process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)\s*\?\?/g)) {
      const line = src.slice(0, m.index).split('\n').length
      fail(
        `${rel}:${line} uses \`process.env.${m[1]} ?? …\`. The Dockerfile exports ` +
          `an unsupplied build secret as the empty string, which \`??\` passes ` +
          `through, so the fallback never runs. Use a truthiness check instead.`
      )
    }
  }

  // E. build-time-only reads outside the NEXT_PUBLIC_ prefix
  const configSrc = fs.readFileSync(path.join(ROOT, 'next.config.ts'), 'utf8')
  const configReads = new Set(
    [...configSrc.matchAll(/process\.env\.([A-Z0-9_]+)/g)]
      .map((m) => m[1])
      .filter((n) => !PLATFORM_SET.has(n) && !n.startsWith('NEXT_PUBLIC_'))
  )
  for (const name of [...configReads].sort()) {
    if (mounts.has(name)) continue
    if (name in BUILD_TIME_NOT_MOUNTED) continue
    fail(
      `${name} is read by next.config.ts, which runs only at build time, but the ` +
        `Dockerfile never mounts it — so it is absent from every Coolify build. ` +
        `Mount it, or record the consequence in BUILD_TIME_NOT_MOUNTED.`
    )
  }

  /* G. A hardcoded credential or origin standing in for a variable. Matched on
     COMMENT-STRIPPED source for the same reason F is: this repo documents each
     rule beside the code that obeys it — `lib/site-url.ts` and both modules fixed
     on 2026-09-17 all name `http://localhost:3000` in prose — and a checker that
     reports the documentation of a rule as a violation of it gets switched off.

     Each entry records what a match DOES, not that it is untidy. The test for
     adding one is whether the literal answers a missing variable with something
     that works: that is the property A cannot see, because by then the variable
     has already arrived empty and the `||` has already run. */
  const CREDENTIAL_LITERALS = [
    {
      re: /['"`]https:\/\/[a-z0-9-]+\.supabase\.co/g,
      what: 'a Supabase project URL',
      why:
        'a missing NEXT_PUBLIC_SUPABASE_URL then yields a working client pointed at ' +
        'whichever project was typed here, which is correct only for as long as the ' +
        'two happen to agree',
    },
    {
      re: /['"`]eyJ[A-Za-z0-9_-]{10,}/g,
      what: 'a JWT literal (a Supabase anon or service-role key)',
      why: 'a missing key variable then authenticates as whoever that token belongs to',
    },
    {
      re: /['"`][^'"`\n]*localhost:3000/g,
      what: 'a localhost origin',
      why:
        'it reaches a customer inside an emailed link or a redirect, where it is a ' +
        'browser error rather than a login, and only once the variable goes missing',
    },
  ]
  for (const file of files) {
    const src = stripComments(fs.readFileSync(file, 'utf8'))
    const rel = path.relative(ROOT, file).replace(/\\/g, '/')
    for (const { re, what, why } of CREDENTIAL_LITERALS) {
      for (const m of src.matchAll(re)) {
        const line = src.slice(0, m.index).split('\n').length
        fail(
          `${rel}:${line} hardcodes ${what}. Read it from the environment and throw ` +
            `when it is absent — ${why}. A fallback indistinguishable from success ` +
            `is a decision to fail silently, taken by whoever wrote the \`||\`.`
        )
      }
    }
  }

  report(publicRead.length, allRead.size, configReads.size, files.length)
}

/* The counts are part of the output on PURPOSE. A checker whose corpus silently
   shrinks — a moved directory, a stale pattern — keeps printing OK, and the only
   visible difference is a number nobody was shown. Print what was inspected. */
function report(publicCount, totalCount, configCount, moduleCount) {
  if (problems.length) {
    console.error('verify-env-contract: FAIL\n')
    for (const p of problems) console.error(`  ERROR: ${p}\n`)
    console.error(`${problems.length} problem(s).`)
    process.exit(1)
  }
  const excused = Object.keys(BUILD_TIME_NOT_MOUNTED).length
  console.log(
    `verify-env-contract: OK — ${publicCount} NEXT_PUBLIC_ variables mounted and exported, ` +
      `${totalCount} variables documented, ${configCount} build-time reads in next.config.ts ` +
      `(${excused} deliberately unmounted), ${moduleCount} modules clean of hardcoded credentials.`
  )
}

main()
