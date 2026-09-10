#!/usr/bin/env node
/**
 * proof-pdf.js: render a local HTML print proof to PDF at true size.
 *
 * Page size comes from the document's own `@page` rule, so one script serves every
 * carton and palette. Chrome-locating logic mirrors shot.js.
 *
 *   node proof-pdf.js <in.html> <out.pdf>
 *
 * WHY IT SERVES OVER HTTP RATHER THAN file://
 * Chrome refuses `@font-face` requests from a file:// origin. The page still renders,
 * because CSS falls back to a system face, so nothing looks broken - but the PDF then
 * embeds Consolas/Arial/Georgia instead of the design faces, and the substitution is
 * invisible unless you inspect the embedded font list. That is exactly what the v7b
 * sleeve proofs shipped. Serving the file's own directory over 127.0.0.1 fixes it.
 *
 * Verify any output:
 *   python3 -c "from pypdf import PdfReader; p=PdfReader('out.pdf').pages[0]; \
 *     print([str(p['/Resources']['/Font'][k].get_object().get('/BaseFont')) for k in p['/Resources']['/Font']])"
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('D:/Androprime_main/andro-prime/09_website-app/frontend/node_modules/puppeteer-core');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA || ''}/Google/Chrome/Application/chrome.exe`,
  '/usr/bin/google-chrome',
];
function findChrome() {
  for (const c of CHROME_CANDIDATES) if (c && fs.existsSync(c)) return c;
  throw new Error('Chrome not found. Set CHROME_PATH.\n' + CHROME_CANDIDATES.map((c) => '  ' + c).join('\n'));
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
};

function serve(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
      const file = path.join(root, rel);
      if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404); return res.end('not found');
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

(async () => {
  const src = process.argv[2];
  const out = process.argv[3];
  if (!src || !out) throw new Error('usage: proof-pdf.js <in.html> <out.pdf>');

  const abs = path.resolve(src);
  const server = await serve(path.dirname(abs));
  const port = server.address().port;

  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  try {
    const page = await browser.newPage();
    const missing = [];
    page.on('requestfailed', (r) => missing.push(r.url()));
    page.on('response', (r) => { if (r.status() >= 400) missing.push(`${r.status()} ${r.url()}`); });

    await page.goto(`http://127.0.0.1:${port}/${encodeURIComponent(path.basename(abs))}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    // Assert the declared faces actually loaded. A silent fallback is the whole reason
    // this script exists, so it fails loudly rather than writing a wrong-typeface PDF.
    const unloaded = await page.evaluate(() => {
      const want = new Set();
      for (const s of document.styleSheets) {
        let rules; try { rules = s.cssRules; } catch { continue; }
        for (const r of rules || []) if (r.constructor.name === 'CSSFontFaceRule') {
          want.add(r.style.getPropertyValue('font-family').replace(/['"]/g, '').trim());
        }
      }
      const loaded = new Set();
      document.fonts.forEach((ff) => { if (ff.status === 'loaded') loaded.add(ff.family.replace(/['"]/g, '').trim()); });
      return [...want].filter((f) => !loaded.has(f));
    });
    if (unloaded.length) throw new Error(`declared @font-face never loaded: ${unloaded.join(', ')}`);
    if (missing.length) console.warn('  ! failed requests:', missing.slice(0, 5).join(', '));

    await page.pdf({
      path: out,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
    server.close();
  }
  console.log('wrote', out, (fs.statSync(out).size / 1024).toFixed(1) + 'KB');
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
