/*
 * Cover-image generation via Replicate.
 *   node cover.js            -> default model (recraft, cheapest at $0.04)
 *   node cover.js ideogram   -> Ideogram v3 Quality ($0.09), best typography
 *   node cover.js flux       -> Flux 1.1 Pro ($0.04)
 *
 * Needs REPLICATE_API_TOKEN in the repo root .env (or the environment).
 * The image is generated WITHOUT any text in it. The headline is set by the
 * template in Inter Black over the photo, so the type is deterministic and the
 * model never has to render a letterform.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const replicateToken = require('./replicate-token.js');
const REPO_ENV = replicateToken.ENV_PATH;

function loadToken() {
  return replicateToken({ required: false });
}

const MODELS = {
  recraft:  { version: 'recraft-ai/recraft-v3',            price: '$0.04' },
  ideogram: { version: 'ideogram-ai/ideogram-v3-quality',  price: '$0.09' },
  flux:     { version: 'black-forest-labs/flux-1.1-pro',   price: '$0.04' },
};

/* Brand is black and white only, so the cover is shot monochrome rather than
 * desaturated in post.
 *
 * `window` carries no text at all: the headline is set by the template over the
 * top, so the model never draws a letterform.
 * `tube` is the opposite bet. The headline is printed on the newspaper inside
 * the scene, so the model HAS to render type. That is the one case where the
 * text-capable models are worth their higher price. */
const HEADLINE = '14 SIGNS OF LOW VITAMIN D';

const SCENES = {
  window: [
    'Editorial black and white photograph, high contrast monochrome.',
    'A man in his mid forties stands at a kitchen window in a British home on a grey winter morning,',
    'looking out at flat overcast light. Shot from inside, slightly behind him, three quarter view.',
    'Weak diffused daylight, deep shadows, grain of 35mm film.',
    'Serious documentary tone, not a stock photo smile. Muted, sober, quiet.',
    'Plain composition with clear empty space in the lower third of the frame.',
    'No text, no words, no lettering, no logos, no watermarks.',
  ].join(' '),

  /* Built directly off the reference frame. The earlier versions failed because
   * the subject was centred and head-on, holding the paper up to the lens, which
   * reads as a stock shot. The reference works because it is an ASYMMETRIC lived-in
   * scene: paper left of centre, laptop right, breakfast in the foreground,
   * window light from the left, and the subject looking at the camera rather
   * than at the paper. Composition is the whole job here, so it is described
   * position by position. */
  /* Third attempt at the reference layout. Two things broke attempt two:
   * (1) style_reference_images degraded the type badly and dragged the
   * composition back toward the centred reference frame it was given, so it is
   * gone; (2) the prompt had grown to twenty clauses, which dilutes the
   * headline instruction — Ideogram's text fidelity falls off as the prompt
   * lengthens. This version is half the length and states the type FIRST,
   * before any scene description. */
  breakfast2: [
    'Bright high-key black and white photograph, monochrome, soft daylight, fine grain, candid and lived-in.',
    'A newspaper front page fills the middle of the frame. Its masthead reads exactly "ANDRO PRIME".',
    'Below the masthead a bold black headline on two lines:',
    'line one reads exactly "14 SIGNS OF", line two reads exactly "LOW VITAMIN D".',
    'Nothing else on the page is printed large; the rest is small unreadable newsprint.',
    'A man of about 45 sits at a kitchen table having breakfast, holding that ordinary tabloid newspaper',
    'up in both hands left of centre, his head and shoulders visible above it, looking into the lens.',
    'On the table: a plate of scrambled eggs at the left, a dark mug in the middle,',
    'and an open laptop at the right seen from behind.',
    'Behind him wooden kitchen cabinets and a microwave. A bright window and a leafy plant on the left.',
  ].join(' '),

  /* Matches the reference layout Keith sent: person seated at a kitchen table
   * holding a tabloid up, breakfast on the table, bright daylight behind.
   * The reference is warm colour; 02_brand §9.1 mandates desaturated imagery
   * and names "bright, saturated" as a don't, so this stays monochrome but goes
   * HIGH KEY rather than moody. The darkness was the problem, not the absence
   * of colour. Masthead reads ANDRO PRIME, which is where the reference puts
   * its own brand. */
  breakfast: [
    'Bright high-key black and white editorial photograph, light and airy, soft even daylight,',
    'monochrome, fine 35mm grain, low contrast, no deep shadows.',
    'A real ordinary man aged about 45 sits at a kitchen table in a British home in the morning,',
    'holding an ordinary tabloid newspaper up in both hands at chest height, reading it.',
    'His whole face and head are clearly visible above the top edge of the newspaper. Candid, unposed, relaxed.',
    'The newspaper is a normal small tabloid at realistic everyday size, roughly the width of his shoulders,',
    'in correct natural proportion to his body and the table. Not oversized, not a broadsheet, not filling the frame.',
    'At the very top of the front page is a masthead in small capitals reading exactly: "ANDRO PRIME".',
    'Below the masthead is one bold black headline on two lines.',
    'The first line reads exactly: "14 SIGNS OF".',
    'The second line reads exactly: "LOW VITAMIN D".',
    'Those words appear once each and nothing else on the page is printed large.',
    'The headline is sharp, straight and legible in a heavy tabloid sans serif;',
    'below it small columns of grey newsprint too small to read.',
    'On the table: a mug of tea and a plate of breakfast. Behind him a bright kitchen window',
    'with pale daylight flooding in, kitchen units and shelves softly out of focus.',
    'Clear empty space across the bottom of the frame. No logos, no watermarks, no other large text.',
  ].join(' '),

  /* The one that works. Same trick as `tube` (headline printed in the scene, so
   * Ideogram is the model), but a kitchen table instead of a carriage, because
   * the tube version produced a newspaper the size of a door and stopped
   * reading as real. Scale is stated explicitly and repeatedly: an ordinary
   * TABLOID, shoulder width, correct proportion to the man and the table. A
   * tabloid front page genuinely does carry a headline this big, so the type
   * can be legible without the prop being absurd. */
  kitchen: [
    'Editorial black and white documentary photograph, high contrast monochrome, 35mm film grain.',
    'A man in his forties sits at a kitchen table in an ordinary British home on a grey winter morning,',
    'reading a newspaper held open in both hands at normal reading distance, elbows near the table.',
    'His face is visible above the top edge of the paper, looking down at it, serious and unglamorous.',
    'The newspaper is an ORDINARY TABLOID newspaper at realistic everyday size,',
    'roughly the width of his shoulders, in correct natural proportion to his body and the table.',
    'It is a normal small newspaper, not oversized, not a giant broadsheet, not filling the frame.',
    'The front page carries one bold black tabloid headline set on two lines.',
    'The first line reads exactly: "14 SIGNS OF".',
    'The second line reads exactly: "LOW VITAMIN D".',
    'Those five words appear once each and nothing else on the page is printed large.',
    'The headline is sharp, straight and legible, in a heavy condensed tabloid sans serif.',
    'Below it are small columns of ordinary grey newsprint, too small to read.',
    'On the table beside him: a mug of tea and a plate. Behind him a kitchen counter and a window',
    'with flat overcast daylight. Camera at seated eye level, facing him straight on.',
    'No logos, no watermarks, no other large text anywhere in the frame.',
  ].join(' '),

  /* Two corrections after the first pass. (1) Given the headline as one string,
   * both text models mis-set it: Ideogram dropped a word, Flux duplicated one.
   * Giving it an explicit line structure and stating each line reads "exactly"
   * is what these models actually follow. (2) "point of view of a standing
   * passenger" was read as a scene description, not a camera instruction, so
   * both shot it head-on. The angle has to be stated as camera direction. */
  tube: [
    'Editorial black and white documentary photograph, high contrast monochrome, 35mm film grain.',
    'HIGH ANGLE SHOT, camera held high and tilted steeply downward.',
    'The camera is at the eye level of a person standing up inside a busy London Underground carriage,',
    'looking down at a man in his forties seated on the bench below, legs crossed,',
    'holding a newspaper open on his lap and reading it.',
    'We look down onto the front page of the newspaper and onto the top of his head and his crossed legs.',
    'The newspaper front page carries one large bold black headline set on two lines.',
    'The first line reads exactly: "14 SIGNS OF".',
    'The second line reads exactly: "LOW VITAMIN D".',
    'Those five words appear once each and nothing else on the page is printed large.',
    'The headline is sharp, straight and perfectly legible, in a bold condensed newspaper serif.',
    'Below it are small columns of ordinary grey newsprint, too small to read.',
    'Around him other commuters stand and sit, slightly blurred. Handrails, poles, carriage windows,',
    'overhead strip lighting. Crowded, ordinary, unglamorous, serious documentary tone.',
    'No logos, no watermarks, no other large text anywhere in the frame.',
  ].join(' '),
};

const which = (process.argv[2] || 'recraft').toLowerCase();
const scene = (process.argv[3] || 'window').toLowerCase();
const PROMPT = SCENES[scene];
if (!PROMPT) { console.error(`scenes: ${Object.keys(SCENES).join(', ')}`); process.exit(1); }
const model = MODELS[which];
if (!model) {
  console.error(`unknown model "${which}". options: ${Object.keys(MODELS).join(', ')}`);
  process.exit(1);
}

const token = loadToken();
if (!token) {
  console.error('MISSING REPLICATE_API_TOKEN.');
  console.error(`Add this line to ${REPO_ENV} then re-run:`);
  console.error('  REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxx');
  process.exit(2);
}

function req(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body ? JSON.stringify(body) : null;
    const r = https.request(
      {
        method,
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        },
      },
      (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try { resolve({ status: res.statusCode, json: JSON.parse(d) }); }
          catch (_) { resolve({ status: res.statusCode, json: null, raw: d }); }
        });
      }
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

(async () => {
  console.log(`model: ${model.version}  (~${model.price} per image)`);

  /* Ideogram v3 has style_reference_images but no character reference, so this
   * carries the grade and the look across generations, not the same face.
   * True character consistency is not available on this model. */
  let styleRefs;
  const refPath = path.join(__dirname, 'style-ref.jpg');
  if (which === 'ideogram' && fs.existsSync(refPath)) {
    styleRefs = [`data:image/jpeg;base64,${fs.readFileSync(refPath).toString('base64')}`];
    console.log('using style-ref.jpg as a style reference');
  }

  const create = await req('POST', `https://api.replicate.com/v1/models/${model.version}/predictions`, {
    input: {
      prompt: PROMPT,
      aspect_ratio: '4:5',
      /* 1024x1280 is 4:5 — the earlier 1024x1365 was 3:4 and was being cropped */
      ...(which === 'recraft' ? { size: '1024x1280', style: 'realistic_image' } : {}),
      ...(styleRefs ? { style_reference_images: styleRefs } : {}),
    },
  });

  if (create.status >= 400) {
    console.error(`create failed (${create.status}):`, create.json || create.raw);
    process.exit(1);
  }

  let pred = create.json;
  process.stdout.write('generating');
  while (pred.status === 'starting' || pred.status === 'processing') {
    await sleep(2000);
    process.stdout.write('.');
    const poll = await req('GET', `https://api.replicate.com/v1/predictions/${pred.id}`);
    pred = poll.json;
  }
  console.log('');

  if (pred.status !== 'succeeded') {
    console.error('failed:', pred.status, pred.error);
    process.exit(1);
  }

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const out = path.join(__dirname, `cover-${which}-${scene}.jpg`);
  await download(url, out);
  console.log(`saved ${out}`);
  console.log('now re-run: node build.js  (then re-screenshot)');
})();
