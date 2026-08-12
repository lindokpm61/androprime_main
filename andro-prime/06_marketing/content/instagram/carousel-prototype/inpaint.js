/*
 * Swap the masthead + headline printed on the cover photograph, per article.
 *
 * This is the step the whole 30-day run depends on. Ideogram v3 takes `image`
 * plus `mask`, where BLACK pixels are repainted and WHITE pixels are preserved,
 * so the mask is a white canvas with one black box over the masthead/headline
 * block. Everything else — the man, his hands, the kitchen, the rest of the
 * page — is outside the box and never redrawn. That is what keeps the character
 * identical across a grid, and it is the thing no whole-frame editor can do.
 *
 * Inpainting beats compositing type in post because the newsprint has texture,
 * a fold and a light gradient across it; flat overlaid type reads as pasted on.
 *
 * The model's output is NOT trusted wholesale. Ideogram returns its own
 * resolution, so the result is rescaled to the source and then merged back
 * through the same mask: outside the box every pixel comes from the original
 * file, byte for byte. The brand band is re-attached afterwards and never goes
 * near the model.
 *
 *   node inpaint.js --l1 "WHY AM I" --l2 "ALWAYS TIRED?" --out why-am-i-tired
 *   node inpaint.js --l1 "..." --l2 "..." --raw-only     (skip the composite)
 *
 * Needs REPLICATE_API_TOKEN (see replicate-token.js). About £0.07 a call.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const token = require('./replicate-token.js')();
const MODEL = 'ideogram-ai/ideogram-v3-quality';

/* ------------------------------------------------------------------ args --- */

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
const has = (name) => process.argv.includes(`--${name}`);

const LINE1 = arg('l1');
const LINE2 = arg('l2');
/* ALL CAPS, deliberately. Both approved reference covers (cover-current-b2.jpg,
 * cover-why-tired.jpg) print ANDRO PRIME in caps, so caps is the set standard.
 * With the literal set title-case the model followed the case of the string only
 * about 8 times in 10, and the two that came back "Andro Prime" were the only
 * tiles on the grid that did not match their neighbours. Setting the literal in
 * caps AND saying so in the prompt removes the coin-flip. */
const MASTHEAD = arg('masthead', 'ANDRO PRIME');
const OUTNAME = arg('out', 'cover-new');
const SRC = path.resolve(__dirname, arg('src', 'work/cover-img.jpg'));
const MASK = path.resolve(__dirname, arg('mask', 'work/mask.png'));
const BAND = path.resolve(__dirname, arg('band', 'work/band.png'));

/* An arbitrary masked repaint, for the times the region is not a headline.
 * Added 2026-08-12 to shave the scalp on the base photograph: the man is copied
 * through byte for byte by every cover, so his hair can only be changed on the
 * ONE source, never per cover, or the grid ends up with ten slightly different
 * men. Reusing this file rather than writing a sibling is deliberate: the
 * rescale-and-maskedmerge below is the part that protects everything outside
 * the box, and a second copy of that geometry would drift from this one, which
 * is the same reason media.js exists. */
const PROMPT_OVERRIDE = arg('prompt');

if (!PROMPT_OVERRIDE && (!LINE1 || !LINE2)) {
  console.error('Usage: node inpaint.js --l1 "LINE ONE" --l2 "LINE TWO" [--out name]');
  console.error('   or: node inpaint.js --prompt "..." --mask work/mask-head.png --no-band [--out name]');
  process.exit(1);
}

/* Type instruction first, scene context second: that ordering is what fixed the
 * earlier generations. Kept deliberately short, because Ideogram's text fidelity
 * falls off as the prompt lengthens. The standfirst is deliberately absent — the
 * first pass could not place it cleanly and the page only has to carry a masthead
 * and two headline lines. Fewer strings to get right. */
const HEADLINE_PROMPT = [
  'A newspaper front page.',
  `At the top, a masthead in a classic serif, in capital letters, reading exactly: "${MASTHEAD}".`,
  /* The clause after the semicolon is the fit instruction, and it is what makes
   * the stored break reachable. The break is data (see covers.js), but the longest
   * line one in the table, WHAT ACTUALLY RAISES at 20 characters, does not fit the
   * mask box at the size a 12-character line like TESTOSTERONE wants. Given no way
   * to resolve that, the model picked one of two escapes: re-wrap onto a third
   * line, or honour the break and pad line two with a full stop.
   *
   * Note the earlier wording, "each line condensed to fill the full column width",
   * made this WORSE: re-wrapping to three lines satisfies it perfectly, so it
   * argued for the failure it was meant to stop. State the two-line limit as a
   * hard bound and name the remedy instead: line one is set smaller. */
  'Below it a very large bold headline on exactly two lines and no more, broken only where shown; line one is set smaller and narrower than line two so that all of line one fits on a single line:',
  `line one reads exactly "${LINE1}", line two reads exactly "${LINE2}".`,
  /* Covers the masthead as well as the headline, because scoping it to "both
   * headline lines" simply moved the stray full stop up to ANDRO PRIME. Phrased
   * as "no punctuation that is not shown" rather than "no terminal punctuation",
   * because ALWAYS TIRED? and BRAIN FOG? end in a question mark that IS stored
   * data and has to survive. */
  'Copy the masthead and both headline lines exactly as given and add no full stop, comma or other punctuation that is not shown.',
  'Everything else is plain small grey newsprint columns, too small to read.',
  'Printed in black ink on off-white newsprint, matching the paper texture, fold and lighting around it.',
  'No other headlines and no other large words.',
].join(' ');

const PROMPT = PROMPT_OVERRIDE || HEADLINE_PROMPT;

/* ---------------------------------------------------------------- ffmpeg --- */

/* Shared with video.js, which crops and re-attaches the same band. */
const { findFfmpeg, ff, dims } = require('./media.js');

/* ------------------------------------------------------------------ http --- */

function req(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body ? JSON.stringify(body) : null;
    const r = https.request(
      { method, hostname: u.hostname, path: u.pathname + u.search,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json',
                   ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}) } },
      (res) => { let d = ''; res.on('data', (c) => (d += c));
        res.on('end', () => { try { resolve({ status: res.statusCode, json: JSON.parse(d) }); }
                              catch (_) { resolve({ status: res.statusCode, raw: d }); } }); }
    );
    r.on('error', reject);
    if (payload) r.write(payload);
    r.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.headers.location) return resolve(download(res.headers.location, dest));
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

const dataUri = (p) => `data:image/png;base64,${fs.readFileSync(p).toString('base64')}`;

/* ------------------------------------------------------------------ main --- */

(async () => {
  for (const p of [SRC, MASK]) {
    if (!fs.existsSync(p)) { console.error(`missing ${p}`); process.exit(1); }
  }
  const src = dims(SRC);
  const msk = dims(MASK);
  if (src.w !== msk.w || src.h !== msk.h) {
    console.error(`mask ${msk.w}x${msk.h} does not match source ${src.w}x${src.h}`);
    process.exit(1);
  }

  if (PROMPT_OVERRIDE) {
    console.log(`prompt   : (override) ${PROMPT_OVERRIDE.slice(0, 90)}${PROMPT_OVERRIDE.length > 90 ? '...' : ''}`);
  } else {
    console.log(`masthead : ${MASTHEAD}`);
    console.log(`headline : ${LINE1} / ${LINE2}`);
  }
  console.log(`source   : ${SRC} (${src.w}x${src.h})`);
  console.log(`mask     : ${MASK} (${msk.w}x${msk.h})`);
  console.log(`band     : ${BAND}${fs.existsSync(BAND) ? '' : '  [MISSING, band will not be re-attached]'}`);
  console.log(`output   : ${path.join(__dirname, OUTNAME + '.png')}`);

  /* --dry resolves and echoes every path, then stops before spending anything.
   * Git Bash rewrites leading-slash arguments into Windows paths, so a wrong
   * path is otherwise invisible until it has already cost a call. */
  if (has('dry')) { console.log('\n--dry: resolved only, no API call made.'); return; }

  const create = await req('POST', `https://api.replicate.com/v1/models/${MODEL}/predictions`, {
    input: { prompt: PROMPT, image: dataUri(SRC), mask: dataUri(MASK) },
  });
  if (create.status >= 400) {
    console.error(`create failed (${create.status}):`, JSON.stringify(create.json || create.raw).slice(0, 900));
    process.exit(1);
  }

  let pred = create.json;
  process.stdout.write('inpainting');
  while (pred.status === 'starting' || pred.status === 'processing') {
    await sleep(3000);
    process.stdout.write('.');
    pred = (await req('GET', `https://api.replicate.com/v1/predictions/${pred.id}`)).json;
  }
  console.log('');
  if (pred.status !== 'succeeded') { console.error('failed:', pred.status, pred.error); process.exit(1); }

  const work = path.join(__dirname, 'work');
  if (!fs.existsSync(work)) fs.mkdirSync(work, { recursive: true });
  const raw = path.join(work, `${OUTNAME}-raw.png`);
  await download(Array.isArray(pred.output) ? pred.output[0] : pred.output, raw);
  console.log(`raw model output : ${raw} (${dims(raw).w}x${dims(raw).h})`);

  if (has('raw-only')) return;

  const bin = findFfmpeg();
  if (!bin) {
    console.error('\nffmpeg not found, so the composite step was skipped. Set FFMPEG_PATH.');
    console.error(`The raw model output is at ${raw}.`);
    process.exit(1);
  }

  /* Rescale to the source, then merge back through the mask. maskedmerge takes
   * pixels from the OVERLAY where the mask is white, so the original wins
   * everywhere outside the box and only the box comes from the model. */
  const merged = path.join(work, `${OUTNAME}-merged.png`);
  ff(bin, ['-i', raw, '-i', SRC, '-i', MASK,
    '-filter_complex',
    `[0:v]scale=${src.w}:${src.h},format=rgb24,setsar=1[a];[1:v]format=rgb24,setsar=1[b];` +
    `[2:v]format=gray,scale=${src.w}:${src.h}[m];[a][b][m]maskedmerge`,
    merged]);

  /* --no-band: the band belongs on a finished COVER. When the output is itself a
   * new source photograph (the shaved base), attaching it here would bake the
   * lockup into the file every later cover is built from, and inpaint.js would
   * then stack a second band on top of the first. */
  let final = merged;
  if (has('no-band')) {
    final = path.join(__dirname, `${OUTNAME}.png`);
    fs.copyFileSync(merged, final);
    console.log('band NOT re-attached (--no-band): this output is a source image, not a cover');
  } else if (fs.existsSync(BAND)) {
    final = path.join(__dirname, `${OUTNAME}.png`);
    ff(bin, ['-i', merged, '-i', BAND,
      '-filter_complex', '[0:v]setsar=1[a];[1:v]setsar=1[b];[a][b]vstack', final]);
    console.log(`band re-attached : ${dims(BAND).w}x${dims(BAND).h}`);
  } else {
    console.log(`no band at ${BAND}, leaving the image area only`);
  }

  console.log(`\nfinished cover   : ${final} (${dims(final).w}x${dims(final).h})`);
  console.log('Outside the mask box this file is pixel-identical to the source by construction.');
})();
