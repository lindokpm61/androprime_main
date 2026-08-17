/*
 * Rasterise a deck's slide HTML to 1080x1350 PNGs with headless Chrome, then
 * assemble the publish set.
 *
 * Type never touches a model: Chrome renders it.
 *
 *   node build.js --deck why-am-i-always-tired && node render.js --deck why-am-i-always-tired
 *   node render.js --deck why-am-i-always-tired slide-03      one slide, no publish set
 *   node render.js --deck why-am-i-always-tired close-B       one close, no publish set
 *   node render.js --deck why-am-i-always-tired --publish-only   assemble, render nothing
 *   node render.js --deck why-am-i-always-tired --no-publish     render only
 *
 * Fonts come from Google Fonts over the network, so render online or the
 * fallback face will change the type metrics.
 *
 * THE PUBLISH SET, AND WHY IT IS HERE (plan step 3.4, completed 2026-08-17)
 *
 * Rendering produces 12 or 13 files; a post publishes 11 of them under partly
 * different names. That gap used to be a manual copy nobody wrote down, which is
 * why `png/<slug>/` and the publish set disagreed about what a file is called.
 * `publish-media.js` deliberately refused to guess at it and said the fix belonged
 * upstream, here. This is that fix: `publish/<slug>/` is now written by the same
 * step that renders, so the recipe runs end to end with no hand-carried step.
 *
 * Two rules, and both are load-bearing:
 *
 *   SELECTION IS AN ALLOWLIST, NOT AN EXCLUSION LIST. The set is exactly what
 *   schedule.js addresses: cover-type.png, slide-02..07, close-A/B/C. Written as
 *   "everything except the intermediates" it would fail OPEN — the next render
 *   artefact anyone adds would silently ship to a public bucket. As an allowlist it
 *   fails closed: a new file is ignored until someone names it here.
 *
 *   THE MP4 IS RENAMED, AND ITS ABSENCE IS A REFUSAL. video.js writes
 *   `cover-video-<deck>.mp4` at this directory's root (one file per deck, because
 *   the non-deck path names by model and scene and minting ten would overwrite one
 *   file ten times); a post wants it as `<deck>/cover-video.mp4`. If it is missing,
 *   NO publish set is written at all. A 10-file set would upload cleanly, and
 *   schedule.js would then build a video post whose first media does not exist —
 *   the media-less-carousel failure that step 1.3 found live in the shared
 *   scheduler. Ten good files are worse than none here, because they look finished.
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

const PUBLISH_ONLY = argv.includes('--publish-only');
const NO_PUBLISH = argv.includes('--no-publish');

const SLIDES = path.join(__dirname, 'slides', deckArg);
const OUT = path.join(__dirname, 'png', deckArg);
const PUBLISH = path.join(__dirname, 'publish', deckArg);

if (!fs.existsSync(SLIDES) && !PUBLISH_ONLY) {
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
if (!chrome && !PUBLISH_ONLY) {
  console.error('Chrome not found. Set CHROME_PATH to the binary and re-run.');
  console.error('Looked in:\n  ' + CHROME_CANDIDATES.join('\n  '));
  process.exit(1);
}

if (!PUBLISH_ONLY) fs.mkdirSync(OUT, { recursive: true });

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
/* Flags are excluded explicitly. This filter used to take the first argument that was neither
 * `--deck` nor its value, which was correct while `--deck` was the only flag: the moment a second
 * one existed, `--publish-only` would have been read as a slide name and the run would have died
 * on "No such slide: --publish-only". */
const only = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--deck')[0];
const targets = PUBLISH_ONLY ? [] : fs
  .readdirSync(SLIDES)
  .filter((f) => f.endsWith('.html'))
  .filter((f) =>
    only
      ? f === `${only}.html`
      /* cover-overlay is the transparent type layer video.js composites over the
       * mp4. It was written by build.js and rendered by nothing, so the animated
       * cover had no title plate at all — the same gap as the band crop: a step
       * documented in one file and absent from the next. The transparency comes
       * from --default-background-color=00000000 below. */
      : /^(slide-\d+|close-[ABC]|cover-(video|type|overlay))\.html$/.test(f)
  );

if (!targets.length && !PUBLISH_ONLY) {
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

if (targets.length) console.log(`\nwrote ${targets.length} file(s) to ${OUT}`);

/* ------------------------------------------------------- the publish set --- */

/* Exactly what schedule.js addresses, in the order it addresses it. Derived from the consumer
 * rather than from what happens to be on disk, so this list and the post it builds cannot drift
 * apart silently: schedule.js takes mediaNames[0] as the cover (mp4 for a video post, cover-type
 * for a still), slides 02 to 07 as the body, and one close as the last of eight. */
const PUBLISH_PNGS = [
  'cover-type.png',
  ...['02', '03', '04', '05', '06', '07'].map((n) => `slide-${n}.png`),
  'close-A.png',
  'close-B.png',
  'close-C.png',
];
/* video.js writes one per deck at this directory's root; a post wants it deck-local and unsuffixed.
 * This single line IS the rename that used to be done by hand. */
const VIDEO_SRC = path.join(__dirname, `cover-video-${deckArg}.mp4`);
const VIDEO_DEST = 'cover-video.mp4';

function assemblePublishSet() {
  const missing = PUBLISH_PNGS.filter((f) => !fs.existsSync(path.join(OUT, f)));
  const noVideo = !fs.existsSync(VIDEO_SRC);

  if (missing.length || noVideo) {
    /* Refuse as a SET. A partial publish set is the dangerous outcome, not the safe one: it uploads
     * cleanly, reads as finished, and only fails when a post addresses the file that is not there. */
    console.error(`\npublish set NOT assembled for "${deckArg}" — the set is incomplete:`);
    if (missing.length) console.error(`  missing render output: ${missing.join(', ')}`);
    if (noVideo) {
      console.error(`  missing cover video   : ${path.basename(VIDEO_SRC)}`);
      console.error(`  mint it with          : node video.js --deck ${deckArg}`);
    }
    console.error(`  then                  : node render.js --deck ${deckArg} --publish-only`);
    return false;
  }

  fs.mkdirSync(PUBLISH, { recursive: true });

  /* Prune first. A file that has left the allowlist, or a deck renamed upstream, would otherwise
   * sit here forever and be uploaded on every run: publish-media.js takes the DIRECTORY as its
   * input, so anything in it is published by definition. */
  const keep = new Set([...PUBLISH_PNGS, VIDEO_DEST]);
  const stale = fs.readdirSync(PUBLISH).filter((f) => !keep.has(f));
  for (const f of stale) fs.rmSync(path.join(PUBLISH, f), { force: true });

  for (const f of PUBLISH_PNGS) fs.copyFileSync(path.join(OUT, f), path.join(PUBLISH, f));
  fs.copyFileSync(VIDEO_SRC, path.join(PUBLISH, VIDEO_DEST));

  console.log(`\npublish set: ${PUBLISH_PNGS.length + 1} file(s) in ${path.relative(__dirname, PUBLISH).replace(/\\/g, '/')}`);
  console.log(`  ${path.basename(VIDEO_SRC)} -> ${VIDEO_DEST}`);
  if (stale.length) console.log(`  pruned: ${stale.join(', ')}`);
  console.log(`\nupload with: node publish-media.js --deck ${deckArg} --prefix carousel-`);
  return true;
}

/* Assembled by default on a full render, skipped for a single-slide render (the set would be built
 * from a mix of fresh and stale files, and nobody rendering one slide is publishing).
 *
 * The exit code differs by intent, deliberately. `--publish-only` means "give me the set", so
 * failing to produce it is a failure. A default assembly after a successful render means "and also
 * the set": the render is what was asked for and it worked, so a deck whose video has not been
 * minted yet reports the gap and still exits 0. Failing the render for it would make minting a new
 * deck look broken at the step that succeeded. */
if (PUBLISH_ONLY) {
  process.exit(assemblePublishSet() ? 0 : 1);
} else if (!NO_PUBLISH && !only) {
  assemblePublishSet();
}
