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
 *   --help
 *
 * Examples
 *   shot.js page.html --selector "section.opt" --nth all --theme both
 *   shot.js page.html --width 390 --name mobile --full
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

if (!['light', 'dark', 'both'].includes(theme)) {
  console.error(`--theme must be light, dark or both (got "${theme}")`);
  process.exit(1);
}
const themes = theme === 'both' ? ['light', 'dark'] : [theme];

const isUrl = /^https?:\/\//i.test(target);
if (!isUrl && !fs.existsSync(target)) {
  console.error(`no such file: ${target}`);
  process.exit(1);
}
const targetUrl = isUrl ? target : pathToFileURL(path.resolve(target)).href;
const prefix = opt('--name', path.basename(target).replace(/\.[^.]+$/, '') || 'shot');

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

  try {
    for (const scheme of themes) {
      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: scale });
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);

      if (stamp) {
        // Runs before any page script, so the artifact sees the stamp on first paint.
        await page.evaluateOnNewDocument((s) => {
          document.documentElement.setAttribute('data-theme', s);
        }, scheme);
      }

      const res = await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 60000 });
      if (res && !res.ok() && isUrl) {
        console.error(`warning: ${res.status()} from ${targetUrl}`);
      }

      // Webfonts move layout after load. Wait for them rather than guessing.
      await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
      if (settle) await new Promise((r) => setTimeout(r, settle));

      // A fixed-width screenshot cannot show sideways body scroll, so the one
      // defect most likely to survive a visual check gets asserted instead.
      const overflow = await page
        .evaluate(() => {
          const d = document.documentElement;
          return d.scrollWidth > window.innerWidth ? d.scrollWidth : 0;
        })
        .catch(() => 0);
      if (overflow) {
        console.error(
          `warning: body scrolls horizontally at ${width}px (content is ${overflow}px wide)`
        );
      }

      const suffix = themes.length > 1 ? `-${scheme}` : '';

      if (selector) {
        const els = await page.$$(selector);
        if (!els.length) throw new Error(`--selector "${selector}" matched nothing`);

        let picks;
        if (nth === 'all') {
          picks = els.map((el, i) => [el, i]);
        } else {
          const i = parseInt(nth, 10);
          if (!els[i]) throw new Error(`--nth ${i} out of range, "${selector}" matched ${els.length}`);
          picks = [[els[i], i]];
        }

        for (const [el, i] of picks) {
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

  console.log(`${written.length} shot${written.length === 1 ? '' : 's'} at ${width}x${height} @${scale}x`);
  for (const f of written) console.log(`  ${f}`);
})().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exit(1);
});
