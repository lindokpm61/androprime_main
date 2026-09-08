#!/usr/bin/env node
/**
 * shot.js: headless screenshots of a local HTML file or a public URL.
 *
 * Exists because there is no browser MCP wired here, and rendered UI is not
 * allowed to be called done on the strength of stripped HTML or an agent's
 * text report. See 02_brand and the artifact placement study for the case that
 * produced it: three mockups read fine in source and one of them put the shop
 * above the results on mobile.
 *
 * Drives system Chrome through puppeteer-core. Neither is installed by this
 * file; both are located at run time and named in the error if missing.
 *
 *   node andro-prime/12_operations/automation/shot.js <file-or-url> [options]
 *
 * Options
 *   --out <dir>        output directory            (default ./shots)
 *   --name <prefix>    output filename prefix      (default the input basename)
 *   --width <px>       viewport width              (default 1320)
 *   --height <px>      viewport height             (default 1100)
 *   --scale <n>        device pixel ratio          (default 2 at <=600px wide, else 1.5)
 *   --theme <t>        light | dark | both         (default both)
 *   --stamp            also set data-theme on <html>, to test the explicit
 *                      toggle as well as the OS default. Without this, only
 *                      prefers-color-scheme is emulated, which is the state
 *                      most viewers are actually in.
 *   --selector <css>   shoot matching elements instead of the viewport
 *   --nth <n|all>      which match of --selector                (default 0)
 *   --full             full-page screenshot rather than viewport
 *   --wait <ms>        extra settle time after fonts resolve    (default 250)
 *   --localstorage k=v seed localStorage before the page loads, repeatable.
 *                      The common one is the cookie banner, which is `fixed`
 *                      and overlays every element shot of a running site:
 *                        --localstorage ap_cookie_consent=denied
 *   --motion           keep animations. OFF by default: see "at rest" below.
 *   --no-walk          skip the scroll walk. See "at rest" below.
 *   --hide <css>       hide matching elements before capture, repeatable. For
 *                      the `fixed` furniture that sits on top of an element
 *                      shot wherever the element happens to be: the sticky nav,
 *                      a cookie banner, a chat bubble. `visibility:hidden`, so
 *                      layout is unchanged and only the overlay goes.
 *   --expect <css>     fail unless the selector is present in the served DOM,
 *                      repeatable. A screenshot cannot tell "my change did not
 *                      apply" from "the server served stale HTML"; this can.
 *   --expect-text <s>  fail unless the string is in the served DOM.
 *   --help
 *
 * ---------------------------------------------------------------------------
 * CAPTURING A PAGE "AT REST" — read this before reporting a blank shot
 * ---------------------------------------------------------------------------
 * A faint, blank or half-empty capture is a TOOLING ARTEFACT until proven
 * otherwise. Scroll-triggered reveal animations start elements at `opacity: 0`,
 * and a headless browser never scrolls, so everything below the fold is
 * captured in its pre-reveal state. This produced four separate "the page is
 * broken" reports before it was understood, one of them a full-page shot that
 * looked catastrophic.
 *
 * Two defences run BY DEFAULT, and the discriminator that makes the result
 * falsifiable runs after them:
 *
 *   1. `prefers-reduced-motion: reduce` is emulated. This design system honours
 *      it by never adding the `.js` class, so every element renders at rest by
 *      design. This is the correct mechanism, not a trick. `--motion` opts out.
 *   2. The page is walked to the bottom in 70%-viewport steps with a pause per
 *      step, then returned to the top and allowed to settle, which fires any
 *      observer that reduced-motion did not disarm. `--no-walk` opts out.
 *   3. After both, every element carrying a reveal class is queried for its
 *      computed opacity. Anything still hidden is REPORTED BY NAME and the exit
 *      code is non-zero — an element hidden after a full walk is a real defect,
 *      the same element hidden without one is an artefact of the capture, and
 *      the picture alone cannot tell you which. The walk plus the query is the
 *      evidence; the picture is not.
 *
 * Also asserted on every run, because each was once diagnosed as a code bug:
 *   - the laid-out `window.innerWidth` matches the requested width
 *   - the document has stylesheets at all (an unstyled capture is usually
 *     `next dev` and `next build` fighting over `.next`, not a CSS regression)
 *   - the body has non-zero height, with page and console errors printed if not
 *   - horizontal overflow, WITH the names of the elements that overflow
 *
 * The HTTP cache is disabled, so a replaced-in-place asset cannot come back
 * stale the way it does for a returning browser.
 *
 * Examples
 *   shot.js page.html --selector "section.opt" --nth all --theme both
 *   shot.js page.html --width 390 --name mobile --full
 *   shot.js http://localhost:3000/membership --localstorage ap_cookie_consent=denied
 *   shot.js http://localhost:3000/blog --expect-text "Direction F" --full
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// ---------------------------------------------------------------- arguments

const argv = process.argv.slice(2);

if (!argv.length || argv.includes('--help') || argv.includes('-h')) {
  const src = fs.readFileSync(__filename, 'utf8');
  process.stdout.write(src.slice(src.indexOf('/**'), src.indexOf('*/') + 2) + '\n');
  process.exit(argv.length ? 0 : 1);
}

function opt(flag, fallback) {
  const i = argv.indexOf(flag);
  return i === -1 || i === argv.length - 1 ? fallback : argv[i + 1];
}
// Every occurrence of a repeatable flag, in order.
function optAll(flag) {
  const out = [];
  argv.forEach((a, i) => {
    if (a === flag && i < argv.length - 1) out.push(argv[i + 1]);
  });
  return out;
}
const flag = (f) => argv.includes(f);

const target = argv[0];
const outDir = path.resolve(opt('--out', 'shots'));
const width = parseInt(opt('--width', '1320'), 10);
const height = parseInt(opt('--height', '1100'), 10);
const scale = parseFloat(opt('--scale', width <= 600 ? '2' : '1.5'));
const theme = opt('--theme', 'both');
const selector = opt('--selector', null);
const nth = opt('--nth', '0');
const settle = parseInt(opt('--wait', '250'), 10);
const fullPage = flag('--full');
const stamp = flag('--stamp');
const reducedMotion = !flag('--motion');
const walk = !flag('--no-walk');
const storage = optAll('--localstorage');
const hideSelectors = optAll('--hide');
const expectSelectors = optAll('--expect');
const expectText = optAll('--expect-text');

if (!['light', 'dark', 'both'].includes(theme)) {
  console.error(`--theme must be light, dark or both (got "${theme}")`);
  process.exit(1);
}
const themes = theme === 'both' ? ['light', 'dark'] : [theme];

const isUrl = /^https?:\/\//i.test(target);
// A LOCAL target may carry a query string, and it has to survive. The journey
// mockups read their own URL for `?still=1` (which disables the scroll reveal
// so a full-page shot is not half empty) and `?t=light|dark`. Checking
// existsSync against the raw argument rejected those pages outright, so the
// query is split off before the check and re-attached to the file:// URL.
const qi = isUrl ? -1 : target.indexOf('?');
const targetPath = qi === -1 ? target : target.slice(0, qi);
const targetQuery = qi === -1 ? '' : target.slice(qi);
if (!isUrl && !fs.existsSync(targetPath)) {
  console.error(`no such file: ${targetPath}`);
  process.exit(1);
}
const targetUrl = isUrl ? target : pathToFileURL(path.resolve(targetPath)).href + targetQuery;
const prefix = opt('--name', path.basename(targetPath).replace(/\.[^.]+$/, '') || 'shot');

// Classes and attributes this repo uses for scroll-triggered reveals. An
// element carrying one of these AND computing to opacity 0 after the walk is
// the falsifiable case: a real defect, or a capture that never fired.
const REVEAL_SELECTOR =
  '.rise, .reveal, .fade-in, .fade-up, [data-reveal], [data-animate], [class*="reveal"], [class*="rise"]';

// ------------------------------------------------------------- dependencies

// puppeteer-core is not a declared dependency anywhere in this repo. It is
// present as a transitive dep of the frontend, which is convenient and not a
// guarantee, so every candidate path is tried and the failure names the fix.
const PUPPETEER_CANDIDATES = [
  'puppeteer-core',
  path.resolve(__dirname, 'node_modules/puppeteer-core'),
  path.resolve(__dirname, '../../09_website-app/frontend/node_modules/puppeteer-core'),
];

function loadPuppeteer() {
  for (const c of PUPPETEER_CANDIDATES) {
    try {
      return require(c);
    } catch (_) {
      /* try the next one */
    }
  }
  console.error(
    'puppeteer-core not found. Tried:\n' +
      PUPPETEER_CANDIDATES.map((c) => `  ${c}`).join('\n') +
      `\n\nFix: npm install puppeteer-core --prefix "${__dirname}"`
  );
  process.exit(1);
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

function findChrome() {
  for (const c of CHROME_CANDIDATES) {
    if (fs.existsSync(c)) return c;
  }
  console.error(
    'no Chrome or Edge binary found. Tried:\n' +
      CHROME_CANDIDATES.map((c) => `  ${c}`).join('\n') +
      '\n\nFix: set CHROME_PATH to the executable.'
  );
  process.exit(1);
}

// -------------------------------------------------------------------- shoot

(async () => {
  const puppeteer = loadPuppeteer();
  const executablePath = findChrome();
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      // Chrome's subpixel antialiasing puts red/blue fringes on text in the
      // captured PNG. Invisible on screen, obvious once the image is posted or
      // zoomed, and CSS font-smoothing does not fix it because it is a browser
      // setting. Mandatory whenever the shot is a deliverable.
      '--disable-lcd-text',
      '--font-render-hinting=none',
    ],
  });

  const written = [];
  const problems = [];   // anything that makes the capture untrustworthy

  try {
    for (const scheme of themes) {
      const page = await browser.newPage();

      // A returning browser hits caches a fresh headless one never sees, so an
      // asset replaced in place at the same URL comes back stale for the human
      // and fresh for the harness. Disable the cache so both agree.
      await page.setCacheEnabled(false);

      const consoleErrors = [];
      page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + (e && e.message ? e.message : e)));
      page.on('console', (m) => {
        if (m.type() === 'error') consoleErrors.push('console: ' + m.text());
      });

      await page.setViewport({ width, height, deviceScaleFactor: scale });

      const media = [{ name: 'prefers-color-scheme', value: scheme }];
      if (reducedMotion) media.push({ name: 'prefers-reduced-motion', value: 'reduce' });
      await page.emulateMediaFeatures(media);

      if (stamp) {
        // Runs before any page script, so the artifact sees the stamp on first paint.
        await page.evaluateOnNewDocument((s) => {
          document.documentElement.setAttribute('data-theme', s);
        }, scheme);
      }

      if (storage.length) {
        const pairs = storage.map((kv) => {
          const eq = kv.indexOf('=');
          return eq === -1 ? [kv, ''] : [kv.slice(0, eq), kv.slice(eq + 1)];
        });
        await page.evaluateOnNewDocument((entries) => {
          try {
            for (const [k, v] of entries) window.localStorage.setItem(k, v);
          } catch (_) { /* storage blocked; the caller sees the banner and knows why */ }
        }, pairs);
      }

      const res = await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });
      if (res && !res.ok() && isUrl) {
        console.error(`warning: ${res.status()} from ${targetUrl}`);
      }

      // Webfonts move layout after load. Wait for them rather than guessing.
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});

      // The walk. Reduced-motion disarms the reveal in this design system, but
      // not every page honours it, and a page that does not is exactly the page
      // whose capture looks broken. Walking costs a second and removes the
      // ambiguity, so it runs unless explicitly disabled.
      if (walk) {
        await page.evaluate(async () => {
          const pause = (ms) => new Promise((r) => setTimeout(r, ms));
          const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
          // The page height is recomputed every step: a reveal can add height,
          // and `body.scrollHeight` under-reports when the scroll container is
          // the documentElement, which silently truncates the walk.
          const full = () => Math.max(
            document.documentElement.scrollHeight,
            document.body ? document.body.scrollHeight : 0
          );
          const step = Math.max(1, Math.round(window.innerHeight * 0.7));
          // Down. An observer with a negative bottom rootMargin needs the
          // element well inside the viewport, so overshoot past the end.
          for (let y = 0; y <= full(); y += step) {
            window.scrollTo(0, y);
            await frame();
            await pause(120);
          }
          window.scrollTo(0, full());
          await frame();
          await pause(200);
          // Up. Some observers only fire on an element entering from the other
          // edge, and the return trip is free.
          for (let y = full(); y >= 0; y -= step) {
            window.scrollTo(0, y);
            await frame();
            await pause(60);
          }
          window.scrollTo(0, 0);
          await frame();
          await pause(200);
        }).catch(() => {});
      }

      // After the walk, so hiding the nav cannot affect what the observers saw.
      if (hideSelectors.length) {
        const hidCount = await page.evaluate((sels) => {
          let n = 0;
          for (const s of sels) {
            for (const el of document.querySelectorAll(s)) { el.style.visibility = 'hidden'; n++; }
          }
          return n;
        }, hideSelectors).catch(() => 0);
        if (!hidCount) console.error(`warning: --hide matched nothing (${hideSelectors.join(', ')})`);
      }

      if (settle) await new Promise((r) => setTimeout(r, settle));

      // --------------------------------------------------- capture integrity
      // Each of these was once reported to a human as a code defect.
      const diag = await page
        .evaluate((revealSel) => {
          const d = document.documentElement;
          const hidden = [];
          for (const el of document.querySelectorAll(revealSel)) {
            // An element that is not laid out at all — display:none, or inside a
            // container collapsed at this width — is neither a capture artefact
            // nor a defect, and counting it makes the guard cry wolf at every
            // breakpoint. Only elements the browser actually placed are evidence.
            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;
            const cs = getComputedStyle(el);
            if (parseFloat(cs.opacity) < 0.05 || cs.visibility === 'hidden') {
              const id = el.id ? '#' + el.id : '';
              const cls = el.className && typeof el.className === 'string'
                ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
                : '';
              hidden.push(el.tagName.toLowerCase() + id + cls);
            }
          }
          const wide = [];
          for (const el of document.querySelectorAll('body *')) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.right > window.innerWidth + 1) {
              const id = el.id ? '#' + el.id : '';
              const cls = el.className && typeof el.className === 'string'
                ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                : '';
              wide.push(`${el.tagName.toLowerCase()}${id}${cls} (right ${Math.round(r.right)}px)`);
            }
          }
          return {
            innerWidth: window.innerWidth,
            bodyHeight: document.body ? document.body.scrollHeight : 0,
            sheets: document.styleSheets.length,
            scrollWidth: d.scrollWidth,
            hidden: hidden.slice(0, 12),
            hiddenTotal: hidden.length,
            wide: wide.slice(0, 6),
            wideTotal: wide.length,
          };
        }, REVEAL_SELECTOR)
        .catch(() => null);

      if (diag) {
        // A window-size request is not a viewport, and the difference is silent.
        if (diag.innerWidth !== width) {
          problems.push(
            `laid out at ${diag.innerWidth}px but captured at ${width}px — the shot is a ` +
            `${diag.innerWidth}px render cropped to ${width}px, so every measurement off it is wrong`
          );
        }
        // No stylesheets is the signature of `next dev` and `next build` sharing
        // `.next`, which presents as a CSS regression and is not one.
        if (diag.sheets === 0) {
          problems.push(
            'the document has NO stylesheets. This is almost always `next dev` and `next build` ' +
            'fighting over .next, not a CSS regression. Kill the dev server by port, rebuild, re-shoot'
          );
        }
        if (!diag.bodyHeight) {
          problems.push('body height is 0 — the page did not render' +
            (consoleErrors.length ? '. Page errors:\n    ' + consoleErrors.slice(0, 5).join('\n    ') : ''));
        }
        if (diag.hiddenTotal) {
          problems.push(
            `${diag.hiddenTotal} reveal element${diag.hiddenTotal === 1 ? '' : 's'} still hidden after ` +
            `the ${walk ? 'walk' : 'load (walk disabled)'}: ${diag.hidden.join(', ')}` +
            (walk ? '\n    A reveal element hidden after a full walk is a real defect, not a capture artefact.'
                  : '\n    Re-run without --no-walk before calling this a defect.')
          );
        }
        if (diag.scrollWidth > diag.innerWidth) {
          problems.push(
            `body scrolls horizontally at ${width}px (content is ${diag.scrollWidth}px wide)` +
            (diag.wideTotal ? `\n    overflowing: ${diag.wide.join(', ')}` +
              (diag.wideTotal > diag.wide.length ? ` …and ${diag.wideTotal - diag.wide.length} more` : '')
              : '')
          );
        }
      }

      // The DOM assertion catches "did it apply"; the screenshot catches "is it
      // right"; neither substitutes for the other.
      for (const sel of expectSelectors) {
        const found = await page.$(sel);
        if (!found) {
          problems.push(`--expect "${sel}" matched nothing in the served DOM — the server may be stale`);
        }
      }
      if (expectText.length) {
        const html = await page.content();
        for (const s of expectText) {
          if (!html.includes(s)) {
            problems.push(`--expect-text "${s}" is not in the served DOM — the server may be stale`);
          }
        }
      }

      const suffix = themes.length > 1 ? `-${scheme}` : '';

      if (selector) {
        const els = await page.$$(selector);
        if (!els.length) {
          // "matched nothing" has the same three causes as a blank shot, so say
          // what was measured rather than only what failed.
          throw new Error(
            `--selector "${selector}" matched nothing` +
            (diag ? ` (body height ${diag.bodyHeight}px, ${diag.sheets} stylesheets)` : '') +
            (consoleErrors.length ? `\npage errors:\n  ${consoleErrors.slice(0, 5).join('\n  ')}` : '')
          );
        }

        let picks;
        if (nth === 'all') {
          picks = els.map((el, i) => [el, i]);
        } else {
          const i = parseInt(nth, 10);
          if (!els[i]) throw new Error(`--nth ${i} out of range, "${selector}" matched ${els.length}`);
          picks = [[els[i], i]];
        }

        for (const [el, i] of picks) {
          // An element below the fold is captured where it sits; scrolling it
          // into view first also gives any observer a last chance to fire.
          await el.evaluate((node) => node.scrollIntoView({ block: 'center' })).catch(() => {});
          await new Promise((r) => setTimeout(r, 120));
          const tag = nth === 'all' || picks.length > 1 ? `-${i}` : '';
          const file = path.join(outDir, `${prefix}${tag}${suffix}.png`);
          await el.screenshot({ path: file });
          written.push(file);
        }
      } else {
        const file = path.join(outDir, `${prefix}${suffix}.png`);
        await page.screenshot({ path: file, fullPage });
        written.push(file);
      }

      await page.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`${written.length} shot${written.length === 1 ? '' : 's'} at ${width}x${height} @${scale}x` +
    (reducedMotion ? ', reduced-motion' : ', motion ON') + (walk ? ', walked' : ', NOT walked'));
  for (const f of written) console.log(`  ${f}`);

  if (problems.length) {
    console.error('\nthe capture is not trustworthy as it stands:');
    for (const p of problems) console.error('  - ' + p);
    process.exit(2);
  }
})().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
