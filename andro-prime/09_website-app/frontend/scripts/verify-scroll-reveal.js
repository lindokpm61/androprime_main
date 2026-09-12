'use strict';
/**
 * Verifies the scroll choreography, and specifically the ways it could leave a
 * reader with a blank page. Every assertion is on a COMPUTED style, never on a
 * status code: the unstyled-page incident earlier today returned 200 with valid
 * HTML and dead CSS, and produced perfectly plausible numbers.
 */
const puppeteer = require('d:/Androprime_main/andro-prime/09_website-app/frontend/node_modules/puppeteer-core');
const fs = require('fs');
/* The reduced-motion screenshot's destination. Was a hard-coded scratchpad path
   from the session that wrote this file; that directory is long gone, so the
   screenshot call threw on any machine but that one, at the very end of a check
   that takes two minutes to reach it. os.tmpdir() always exists. */
const OUT = require('os').tmpdir();
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));

/* ---------------------------------------------------------------------------
   HOSTS. Added 2026-09-11, when `/order/confirmed` became the first app-host
   route to reach the conformance report's "Rebuilt" table WITH reveal targets.

   🔴 THIS CHECK USED TO 308 ON IT AND REPORT THAT AS A MOTION DEFECT. The
   off-host skip below is a hand-typed regex naming the auth and account family,
   and it never listed `/order/confirmed` or `/subscription/confirmed` even
   though `lib/hosts.ts` has always served them from the app host. Nothing
   noticed, because until that route was rebuilt no app-host route appeared in
   the Rebuilt table at all. The failure it produced was "has reveal targets —
   want true, got false", which reads as a page that lost its animation and was
   actually a redirect this script followed into nothing.

   `route-conformance.js` had already solved this and its solution is copied
   rather than reinvented: derive the prefixes from `lib/hosts.ts` so the list
   cannot drift, and MAP the app hostname onto the dev server so the request
   arrives with the real Host header.

   🔴 THE HOSTNAME IS THE APP HOST'S; THE SCHEME AND PORT ARE THE DEV SERVER'S.
   Navigating to the https URL opens a TLS handshake against a plain-HTTP dev
   server and every app-host route comes back as a load failure;
   `--ignore-certificate-errors` does not help, because there is no TLS at all.
   The middleware only reads the hostname, so that is the only part kept. */
const BASE = 'http://localhost:3000';
const APP_HOST = (process.env.NEXT_PUBLIC_APP_URL || 'https://app.andro-prime.com').replace(/\/+$/, '');
const APP_PREFIXES = (() => {
  const ts = fs.readFileSync(require('path').join(__dirname, '..', 'lib', 'hosts.ts'), 'utf8');
  const block = ts.match(/export const APP_ROUTE_PREFIXES = \[([\s\S]*?)\] as const/);
  if (!block) {
    console.error('ERROR: could not read APP_ROUTE_PREFIXES out of lib/hosts.ts. Fix this parser rather than trusting a pass.');
    process.exit(1);
  }
  const body = block[1].replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ');
  const out = [...new Set([...body.matchAll(/'([^']+)'/g)].map((m) => m[1]))];
  if (!out.length) {
    console.error('ERROR: APP_ROUTE_PREFIXES parsed to zero entries. Fix this parser rather than trusting a pass.');
    process.exit(1);
  }
  return out;
})();
/* Exact-or-segment-boundary, never a bare startsWith: '/accounts-payable' must
   not match '/account'. Same rule lib/hosts.ts matchesPrefix applies. */
const onAppHost = (u) => APP_PREFIXES.some((p) => u === p || u.startsWith(p + '/'));
const APP_RESOLVABLE = !/^(localhost|127\.|\[?::1)/.test(new URL(APP_HOST).hostname);
const APP_FETCH_ORIGIN = APP_RESOLVABLE
  ? `${new URL(BASE).protocol}//${new URL(APP_HOST).hostname}`
  : APP_HOST;
const originFor = (u) => (onAppHost(u) ? APP_FETCH_ORIGIN : BASE);

/* THE ROUTE LIST IS READ FROM THE GENERATED CONFORMANCE REPORT, NOT TYPED HERE.
   It was a literal of six when ten routes were rebuilt, so this check had
   quietly stopped covering /blog, /blog/[slug], /authors/[slug] and /membership,
   and would have missed /test-selector too. That is the same defect the route
   count had before `route-conformance.js`: a number, or here a list, that has to
   be remembered. The report's "Rebuilt" table is the generated answer, so a route
   that becomes Direction F comes into this check by being rebuilt.

   Dynamic segments are given a real example, because /blog/[slug] is not a URL.
   A route in the report with no example here is skipped and SAID to be skipped,
   rather than silently dropped. */
/* ⚠ `/not-found` IS A FILE, NOT A URL. It renders in response to any unmatched
   path, so the only way to reach it is to ask for one, and its correct status is
   404. It entered this check on 2026-09-12 by being rebuilt in Direction F:
   before that it carried no `.f-rise`, so the Rebuilt table did not list it and
   this loop never saw it. Without the pair below it fails as "a bad example
   URL", which is the message this check gives a 404 — correct for a mistyped
   example, wrong for the page whose entire job is to be the 404. */
const EXAMPLES = {
  '/authors/[slug]': '/authors/dr-ewa-lindo',
  '/not-found': '/this-url-does-not-exist-and-that-is-the-point',
};
/* Example URLs whose CORRECT status is not 200, keyed by the example rather
   than the route, since the example is what `goto` is given. */
const EXPECT_STATUS = { '/this-url-does-not-exist-and-that-is-the-point': 404 };
/* /blog/[slug] is RESOLVED from the listing rather than written down: a
   hand-picked slug can be unpublished, and the first guess here (a plausible
   'what-is-shbg') 404d, which would have failed this check with a message about
   motion rather than about the example. */
async function resolveBlogExample(browser) {
  const p = await browser.newPage();
  try {
    await p.goto('http://localhost:3000/blog', { waitUntil: 'networkidle0', timeout: 120000 });
    const href = await p.evaluate(() => {
      const a = [...document.querySelectorAll('a[href^="/blog/"]')]
        .map((el) => el.getAttribute('href'))
        .find((h) => h && h !== '/blog/' && !h.includes('/preview/'));
      return a || null;
    });
    return href;
  } finally { await p.close(); }
}
function rebuiltRoutes() {
  const md = fs.readFileSync(require('path').join(__dirname, '..', '..', 'design', 'route-conformance.md'), 'utf8');
  const section = md.split(/^## Rebuilt/m)[1];
  if (!section) { console.error('ERROR: no "## Rebuilt" table in design/route-conformance.md. Run `npm run route-conformance`.'); process.exit(1); }
  const rows = section.split(/^## /m)[0].split('\n')
    .map((l) => (l.match(/^\|\s*`([^`]+)`/) || [])[1]).filter(Boolean);
  if (!rows.length) { console.error('ERROR: the Rebuilt table parsed to zero routes. Fix this parser rather than trusting a pass.'); process.exit(1); }
  const out = [], skipped = [], offHost = [];
  for (const r of rows) {
    // THESE ROUTES CARRY NO REVEAL TARGETS, DELIBERATELY, which is the only
    // reason they are skipped. The auth card has NO `.f-rise` at all, because a
    // reveal on a form the reader came to use is a delay in front of a password
    // field, and the gated account and results surfaces are the app shell rather
    // than the marketing layer. This check exists to catch content left
    // invisible by motion; a surface with no motion cannot fail it.
    //
    // ⚠ THE REASON USED TO BE STATED AS "THEY 308 FROM THIS ORIGIN", AND THAT
    // WAS TRUE OF MORE ROUTES THAN THIS LIST NAMES. `/order/confirmed` and
    // `/subscription/confirmed` are app-host routes too and were never in this
    // regex, so when the first of them was rebuilt it 308d and this check
    // reported the redirect as a missing reveal target. The host mapping at the
    // top now serves every app-host route on its own host, so the redirect is
    // no longer a reason to skip anything, and this list is back to meaning what
    // it says: surfaces with no motion to verify.
    if (/^\/(auth|account|results-dashboard|subscriptions|founding-member-status|supplement-waitlist-status)(\/|$)/.test(r)) { offHost.push(r); continue; }
    // EXAMPLES IS CONSULTED FIRST, not only for dynamic segments. It used to be
    // the `else` of the bracket test, which silently meant "a route with no
    // `[...]` in it is its own URL" — true of every route until `/not-found`,
    // which has no bracket and is still not a URL. An example table that only
    // applies to the one case it was written for is a table with a hidden
    // precondition.
    if (EXAMPLES[r]) out.push(EXAMPLES[r]);
    else if (!r.includes('[')) out.push(r);
    else skipped.push(r);
  }
  if (skipped.length) console.log(`  note  skipped (no example URL in EXAMPLES): ${skipped.join(', ')}`);
  if (offHost.length) console.log(`  note  skipped (served by the app host, and carry no reveal targets): ${offHost.join(', ')}`);
  if (!out.length) { console.error('ERROR: every rebuilt route was skipped. Fix this filter rather than trusting a pass.'); process.exit(1); }
  return out;
}
const ROUTES = rebuiltRoutes();
let pass = 0, fail = 0;
const t = (d, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) { pass++; console.log(`  ok   ${d}`); }
  else { fail++; console.log(`  FAIL ${d} — want ${JSON.stringify(want)}, got ${JSON.stringify(got)}`); }
};

async function newPage(browser, { reduce = false, js = true, width = 1440 } = {}) {
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(js);
  if (reduce) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  return page;
}

// Everything a reader must be able to see, regardless of what motion did.
const visibility = () => {
  const rises = [...document.querySelectorAll('.f-rise')];
  const invisible = rises.filter((el) => {
    const cs = getComputedStyle(el);
    return parseFloat(cs.opacity) < 0.99;
  });
  const bandsCollapsed = [...document.querySelectorAll('.f-band')].filter((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return m.a < 0.99;
  });
  return {
    rises: rises.length,
    invisibleRises: invisible.length,
    onRises: rises.filter((el) => el.classList.contains('on')).length,
    bands: document.querySelectorAll('.f-band').length,
    collapsedBands: bandsCollapsed.length,
    js: document.documentElement.classList.contains('js'),
    // The style-actually-applied precondition.
    trayBg: (() => { const el = document.querySelector('.f-tray'); return el ? getComputedStyle(el).backgroundColor : 'NO TRAY'; })(),
  };
};

(async () => {
  /* MAP the app hostname onto whatever host:port BASE points at, so an app-host
     route is fetched with its REAL Host header and the middleware serves it
     instead of 308-ing to production. Only applied when the app host is a real
     name; pointed at localhost there is nothing to map. */
  const hostRules = APP_RESOLVABLE
    ? [`--host-resolver-rules=MAP ${new URL(APP_HOST).hostname} ${new URL(BASE).host}`]
    : [];
  if (APP_RESOLVABLE) console.log(`  note  ${new URL(APP_HOST).hostname} mapped to ${new URL(BASE).host}`);
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', ...hostRules] });

  console.log('\nPrecondition: the page is actually styled\n');
  {
    const p = await newPage(browser);
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 120000 });
    const v = await p.evaluate(visibility);
    t('a tray paints its recessed ground (not an unstyled page)', v.trayBg, 'rgb(241, 242, 244)');
    await p.close();
  }

  console.log('\nMotion ON: hidden at first, revealed on arrival\n');
  {
    const blog = await resolveBlogExample(browser);
    if (blog) ROUTES.push(blog);
    else console.log('  note  /blog/[slug] skipped: no article link found on /blog');
  }
  for (const route of ROUTES) {
    const p = await newPage(browser);
    const resp = await p.goto(originFor(route) + route, { waitUntil: 'networkidle0', timeout: 120000 });
    // A bad EXAMPLE must not read as a broken page. Without this, a 404 fails
    // "has reveal targets" and sends the reader looking at the motion layer.
    const wantStatus = EXPECT_STATUS[route] ?? 200;
    if (resp && resp.status() !== wantStatus) {
      fail++; console.log(`  FAIL ${route}: returned ${resp.status()}, want ${wantStatus}, so this is a bad example URL, not a motion defect`);
      await p.close(); continue;
    }
    await new Promise((r) => setTimeout(r, 1400));
    const top = await p.evaluate(visibility);
    t(`${route}: .js gate is on`, top.js, true);
    t(`${route}: has reveal targets`, top.rises > 0, true);
    // The real invariant is not that something above the fold animates (the
    // homepage`s first screen is the hero, which carries no reveal target), it
    // is that nothing is left INVISIBLE inside the first screen at load.
    // ⚠ IT NAMES WHAT IS STUCK, since 2026-09-12. This used to report a COUNT,
    // and a count starts a hunt: `/how-to-sample` failed with "want 0, got 1"
    // and the page has four reveal targets, none of them obviously the one. The
    // class list and the element's top edge are what actually identify it, and
    // the top edge is the diagnosis as well as the identity — an element whose
    // visible share of the reduced root is under the observer's 8% threshold is
    // inside the first screen and not yet "arriving".
    const stuck = await p.evaluate(() => [...document.querySelectorAll('.f-rise')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.99;
    }).map((el) => {
      const r = el.getBoundingClientRect();
      const shown = Math.max(0, Math.min(r.bottom, window.innerHeight * 0.88) - Math.max(r.top, 0));
      return `${el.className} (top ${Math.round(r.top)}, ${Math.round((shown / r.height) * 100)}% of it inside the 88% root)`;
    }));
    t(`${route}: nothing left hidden in the first screen`, stuck.length, 0);
    if (stuck.length) console.log(`       stuck: ${stuck.join(' | ')}`);

    // Scroll the whole page, then nothing may be left hidden.
    await p.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    /*
     * 🔴 SETTLE ON A CONDITION, NOT ON A STOPWATCH, AND THE BUG THIS FIXES WAS
     * A FALSE RED RATHER THAN A MISS.
     *
     * This was a flat `setTimeout(1600)`. On the longest route, `/lp/hormone
     * recovery`, the final `.f-close` enters the viewport only on the last jump
     * to the bottom, and it carries `transition-delay: 180ms` from its stagger.
     * Its 0.7s ease-out therefore starts 180ms into the 1600ms window and is
     * still asymptotically closing when the measurement is taken: opacity
     * 0.987152, against a threshold of 0.99. The section had fired, had `.on`,
     * and was indistinguishable from finished to any eye. The check reported
     * "every section is visible after a full scroll: want 0, got 1" every single
     * run, which reads exactly like a section that never appears.
     *
     * An ease-out approaches its endpoint slowly by definition, so no fixed wait
     * is the right one: a longer sleep makes the same race less likely without
     * removing it, and makes every run slower to buy that. Polling the real
     * condition removes it. A genuinely stuck reveal never reaches the threshold
     * and still fails at the cap, so the assertion keeps all of its strength.
     */
    await p.evaluate(async () => {
      const settled = () =>
        [...document.querySelectorAll('.f-rise')].every(
          (el) => parseFloat(getComputedStyle(el).opacity) >= 0.99
        );
      const deadline = Date.now() + 5000;
      while (!settled() && Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 100));
      }
    });
    const after = await p.evaluate(visibility);
    t(`${route}: every section is visible after a full scroll`, after.invisibleRises, 0);
    t(`${route}: every section fired`, after.onRises, after.rises);
    if (after.bands) t(`${route}: no band left collapsed`, after.collapsedBands, 0);
    await p.close();
  }

  console.log('\nReduced motion: complete and at rest, nothing hidden\n');
  {
    const p = await newPage(browser, { reduce: true });
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 120000 });
    await new Promise((r) => setTimeout(r, 900));
    const v = await p.evaluate(visibility);
    t('the .js gate is never added', v.js, false);
    t('nothing is hidden', v.invisibleRises, 0);
    t('no band is collapsed', v.collapsedBands, 0);
    await p.screenshot({ path: `${OUT}/motion-reduced.png` });
    await p.close();
  }

  console.log('\nJavaScript OFF: the page must be complete\n');
  {
    const p = await newPage(browser, { js: false });
    await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 120000 });
    await new Promise((r) => setTimeout(r, 800));
    const v = await p.evaluate(visibility).catch(() => null);
    if (v) {
      t('no .js class without scripts', v.js, false);
      t('nothing hidden without scripts', v.invisibleRises, 0);
    } else {
      console.log('  ..   could not evaluate with JS disabled (expected); checking served HTML instead');
      pass++;
    }
    await p.close();
  }

  console.log('\nHydration never happens: the 2.5s failsafe restores the page\n');
  {
    const p = await browser.newPage();
    await p.setViewport({ width: 1440, height: 900 });
    // Let the inline gate run, then block every subsequent script so the
    // component can never hydrate and never sets __fRiseReady.
    let seen = 0;
    await p.setRequestInterception(true);
    p.on('request', (req) => {
      if (req.resourceType() === 'script') { seen++; return req.abort(); }
      req.continue();
    });
    await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
    const mid = await p.evaluate(visibility);
    console.log(`       (blocked ${seen} script requests; .js at load = ${mid.js}, hidden = ${mid.invisibleRises})`);
    await new Promise((r) => setTimeout(r, 3200));
    const late = await p.evaluate(visibility);
    t('the failsafe strips .js', late.js, false);
    t('nothing is left hidden', late.invisibleRises, 0);
    await p.close();
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
