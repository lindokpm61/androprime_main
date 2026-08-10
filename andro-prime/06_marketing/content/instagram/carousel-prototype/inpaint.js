/*
 * Replace the masthead + headline block on the supplied kitchen photo.
 *
 * Ideogram v3 takes `image` + `mask`, where BLACK pixels are inpainted and
 * WHITE pixels are preserved. So the mask is a white canvas with one black box
 * over the masthead/headline/subhead area, and everything else in the photo
 * (the man, the kitchen, the breakfast, the laptop, the rest of the page) is
 * left untouched.
 *
 * Inpainting is the right tool here rather than compositing type in post: the
 * newsprint has texture, a fold and a light gradient across it, so a flat text
 * overlay would read as pasted on. The model reproduces the paper's own
 * lighting and grain around the new type.
 *
 *   node inpaint.js [n]     n = variant number for the output filename
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const token = require('./replicate-token.js')();
const MODEL = 'ideogram-ai/ideogram-v3-quality';

const SRC = path.join(__dirname, 'source-kitchen.png');
const MASK = path.join(__dirname, 'mask.png');
const n = process.argv[2] || '1';

/* Type instruction first, scene context second — same ordering that fixed the
 * earlier generations. Kept deliberately short; Ideogram's text fidelity falls
 * off as the prompt lengthens. */
/* Standfirst dropped. The first pass could not place it cleanly and the type
 * layer carries the hook line anyway, so the page only has to render a masthead
 * and a two-line headline. Fewer strings to get right. */
const PROMPT = [
  'A newspaper front page.',
  'At the top, a masthead in a classic serif reading exactly: "Andro Prime".',
  'Below it a very large bold headline on two lines:',
  'line one reads exactly "14 SIGNS OF", line two reads exactly "LOW VITAMIN D".',
  'Everything else is plain small grey newsprint columns, too small to read.',
  'Printed in black ink on off-white newsprint, matching the paper texture, fold and lighting around it.',
  'No other headlines and no other large words.',
].join(' ');

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

(async () => {
  for (const p of [SRC, MASK]) {
    if (!fs.existsSync(p)) { console.error(`missing ${p}`); process.exit(1); }
  }

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

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const out = path.join(__dirname, `inpainted-${n}.png`);
  await download(url, out);
  console.log(`saved ${out}`);
})();
