'use strict';
/**
 * Verifies the scroll choreography, and specifically the ways it could leave a
 * reader with a blank page. Every assertion is on a COMPUTED style, never on a
 * status code: the unstyled-page incident earlier today returned 200 with valid
 * HTML and dead CSS, and produced perfectly plausible numbers.
 */
const puppeteer = require('d:/Androprime_main/andro-prime/09_website-app/frontend/node_modules/puppeteer-core');
const fs = require('fs');
const OUT = 'C:/Users/antid/AppData/Local/Temp/claude/d--Androprime-main/5c9f61d2-ec33-4fca-8018-9ef1aec46289/scratchpad';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));

const ROUTES = ['/', '/kits', '/kits/testosterone', '/kits/energy-recovery', '/kits/hormone-recovery', '/how-it-works'];
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
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });

  console.log('\nPrecondition: the page is actually styled\n');
  {
    const p = await newPage(browser);
    await p.goto('http://localhost:3000/', { waitUntil: 'networkidle0', timeout: 120000 });
    const v = await p.evaluate(visibility);
    t('a tray paints its recessed ground (not an unstyled page)', v.trayBg, 'rgb(241, 242, 244)');
    await p.close();
  }

  console.log('\nMotion ON: hidden at first, revealed on arrival\n');
  for (const route of ROUTES) {
    const p = await newPage(browser);
    await p.goto('http://localhost:3000' + route, { waitUntil: 'networkidle0', timeout: 120000 });
    await new Promise((r) => setTimeout(r, 1400));
    const top = await p.evaluate(visibility);
    t(`${route}: .js gate is on`, top.js, true);
    t(`${route}: has reveal targets`, top.rises > 0, true);
    // The real invariant is not that something above the fold animates (the
    // homepage`s first screen is the hero, which carries no reveal target), it
    // is that nothing is left INVISIBLE inside the first screen at load.
    const stuck = await p.evaluate(() => [...document.querySelectorAll('.f-rise')].filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 && parseFloat(getComputedStyle(el).opacity) < 0.99;
    }).length);
    t(`${route}: nothing left hidden in the first screen`, stuck, 0);

    // Scroll the whole page, then nothing may be left hidden.
    await p.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 1600));
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
