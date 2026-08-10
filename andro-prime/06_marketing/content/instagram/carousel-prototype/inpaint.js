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
const { execFileSync } = require('child_process');

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
const MASTHEAD = arg('masthead', 'Andro Prime');
const OUTNAME = arg('out', 'cover-new');
const SRC = path.resolve(__dirname, arg('src', 'work/cover-img.jpg'));
const MASK = path.resolve(__dirname, arg('mask', 'work/mask.png'));
const BAND = path.resolve(__dirname, arg('band', 'work/band.png'));

if (!LINE1 || !LINE2) {
  console.error('Usage: node inpaint.js --l1 "LINE ONE" --l2 "LINE TWO" [--out name]');
  process.exit(1);
}

/* Type instruction first, scene context second: that ordering is what fixed the
 * earlier generations. Kept deliberately short, because Ideogram's text fidelity
 * falls off as the prompt lengthens. The standfirst is deliberately absent — the
 * first pass could not place it cleanly and the page only has to carry a masthead
 * and two headline lines. Fewer strings to get right. */
const PROMPT = [
  'A newspaper front page.',
  `At the top, a masthead in a classic serif reading exactly: "${MASTHEAD}".`,
  'Below it a very large bold headline on two lines:',
  `line one reads exactly "${LINE1}", line two reads exactly "${LINE2}".`,
  'Everything else is plain small grey newsprint columns, too small to read.',
  'Printed in black ink on off-white newsprint, matching the paper texture, fold and lighting around it.',
  'No other headlines and no other large words.',
].join(' ');

/* ---------------------------------------------------------------- ffmpeg --- */

const FFMPEG_CANDIDATES = [
  process.env.FFMPEG_PATH,
  'ffmpeg',
  'C:/Users/antid/Downloads/ffmpeg-6.0-essentials_build/ffmpeg-6.0-essentials_build/bin/ffmpeg.exe',
  '/usr/bin/ffmpeg',
  '/opt/homebrew/bin/ffmpeg',
].filter(Boolean);

function findFfmpeg() {
  for (const c of FFMPEG_CANDIDATES) {
    try { execFileSync(c, ['-version'], { stdio: 'ignore' }); return c; } catch (_) {}
  }
  return null;
}

const ff = (bin, args) => execFileSync(bin, ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

function dims(file) {
  const b = fs.readFileSync(file);
  if (b.slice(1, 4).toString() === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error(`cannot read dimensions of ${file}`);
}

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

  console.log(`masthead : ${MASTHEAD}`);
  console.log(`headline : ${LINE1} / ${LINE2}`);
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

  let final = merged;
  if (fs.existsSync(BAND)) {
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
