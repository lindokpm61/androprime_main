/*
 * Rasterise a deck's slide HTML to 1080x1350 PNGs with headless Chrome.
 *
 * Type never touches a model: Chrome renders it.
 *
 *   node build.js --deck why-am-i-always-tired && node render.js --deck why-am-i-always-tired
 *   node render.js --deck why-am-i-always-tired slide-03      one slide
 *   node render.js --deck why-am-i-always-tired close-B       one close
 *
 * Fonts come from Google Fonts over the network, so render online or the
 * fallback face will change the type metrics.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const argv = process.argv.slice(2);
const deckArg = argv[argv.indexOf('--deck') + 1];
if (!argv.includes('--deck') || !deckArg || deckArg.startsWith('--')) {
  console.error('Usage: node render.js --deck <slug> [slide-03|close-B]');
  process.exit(1);
}

const SLIDES = path.join(__dirname, 'slides', deckArg);
const OUT = path.join(__dirname, 'png', deckArg);

if (!fs.existsSync(SLIDES)) {
  console.error(`No built slides for "${deckArg}". Run: node build.js --deck ${deckArg}`);
  process.exit(1);
}

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('Chrome not found. Set CHROME_PATH to the binary and re-run.');
  console.error('Looked in:\n  ' + CHROME_CANDIDATES.join('\n  '));
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

/*
 * Slide 01 is deliberately NOT rendered by default.
 *
 * The cover template overlays the headline on a text-free photo (direction A).
 * The live cover is direction B: the headline is printed inside the photograph
 * and the brand band is already baked in, so template-rendering it stacks the
 * headline twice. Under direction B the cover is the photo itself, rescaled to
 * 1080x1350.
 *
 * `node render.js --deck <slug> slide-01` still works, for anyone reviving
 * direction A.
 */
const only = argv.filter((a, i) => a !== '--deck' && argv[i - 1] !== '--deck')[0];
const targets = fs
  .readdirSync(SLIDES)
  .filter((f) => f.endsWith('.html'))
  .filter((f) =>
    only ? f === `${only}.html` : /^(slide-(?!01)\d+|close-[ABC])\.html$/.test(f)
  );

if (!targets.length) {
  console.error(only ? `No such slide: ${only}` : `No slide HTML in ${SLIDES}`);
  process.exit(1);
}

for (const file of targets) {
  const name = path.basename(file, '.html');
  const dest = path.join(OUT, `${name}.png`);
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      '--virtual-time-budget=10000',
      '--window-size=1080,1350',
      `--screenshot=${dest}`,
      `file:///${path.join(SLIDES, file).replace(/\\/g, '/')}`,
    ],
    { stdio: 'ignore' }
  );
  console.log(`${name}.png`);
}

console.log(`\nwrote ${targets.length} file(s) to ${OUT}`);
