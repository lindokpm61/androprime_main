#!/usr/bin/env node
/**
 * pdf.js: render a local HTML file to a dimensionally exact PDF.
 *
 * Companion to shot.js. Exists because Chrome's --print-to-pdf CLI rounds the
 * @page size when it converts mm to points: a 185 x 310 mm page came back as
 * 184.83 x 310.05 mm, a 0.17 mm error. That is harmless on a slide and not
 * harmless on packaging artwork, where the whole point is that a printer can
 * measure the proof. puppeteer's page.pdf() takes width/height verbatim.
 *
 *   node andro-prime/12_operations/automation/pdf.js <file-or-url> [options]
 *
 * Options
 *   --out <path>     output .pdf path        (default alongside the input)
 *   --width <css>    page width, any CSS unit e.g. 185mm   (default from @page)
 *   --height <css>   page height                            (default from @page)
 *   --wait <ms>      settle time after load  (default 900)
 *
 * Always prints backgrounds and never adds Chrome's header/footer.
 */

const fs = require('fs');
const path = require('path');

const FRONTEND = path.resolve(__dirname, '../../09_website-app/frontend');
const puppeteer = require(path.join(FRONTEND, 'node_modules', 'puppeteer-core'));

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
  if (!hit) {
    throw new Error(
      'Chrome not found. Looked in:\n  ' + CHROME_CANDIDATES.join('\n  ')
    );
  }
  return hit;
}

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

(async () => {
  const input = process.argv[2];
  if (!input) {
    console.error('usage: node pdf.js <file-or-url> [--out x.pdf] [--width 185mm] [--height 310mm]');
    process.exit(1);
  }

  const isUrl = /^https?:\/\//i.test(input);
  const abs = isUrl ? input : 'file:///' + path.resolve(input).replace(/\\/g, '/');
  const out = arg(
    'out',
    isUrl ? 'out.pdf' : path.resolve(input).replace(/\.html?$/i, '') + '.pdf'
  );
  const width = arg('width', null);
  const height = arg('height', null);
  const wait = parseInt(arg('wait', '900'), 10);

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(abs, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, wait));

    const opts = {
      path: out,
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: !(width && height),
    };
    if (width && height) {
      opts.width = width;
      opts.height = height;
    }

    await page.pdf(opts);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`wrote ${out} (${kb} KB)`);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
