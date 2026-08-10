/*
 * Animate the cover still into a short looping clip for slide 1.
 *   node video.js wan       -> wan-2.2-i2v-fast   (cheapest)
 *   node video.js seedance  -> seedance-1-lite
 *   node video.js kling     -> kling-v2.1         (best motion, priciest)
 *
 * Source frame: cover-recraft.jpg (the still that is already approved as the
 * cover). Camera stays locked; only the subject moves. Subtle beats ambitious:
 * hands near the face are where these models break, and a carousel cover only
 * needs enough motion to catch the eye in a feed.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const token = require('./replicate-token.js')();

/* The finished grayscale cover, headline already inpainted. Animating THIS is
 * the hard case: the headline is rendered type, and warping type is the single
 * thing video models are worst at. Every scene below therefore pins the
 * newspaper still and moves only the man. */
/* argv[4] overrides the source frame. The band is cropped off before animating
 * and re-composited afterwards: a burnt-in band would be warped by the video
 * model along with everything else, and the lockup has to stay pin sharp. */
const SOURCE = path.join(__dirname, process.argv[4] || 'cover-scene.jpg');

/* The mug is the failure point. The source frame only has a small pale mug on
 * the windowsill, so if the prompt just says "lifts the mug" the model invents
 * a new one mid-shot and the handle changes shape. Name the exact object, state
 * that it is the one already in frame, and assert continuity explicitly. */
const MUG =
  'the same plain pale ceramic mug that is already sitting on the windowsill in front of him: ' +
  'a simple straight-sided cup with one small round handle. ' +
  'It is the identical mug for the whole shot. Its shape, size, colour and handle never change. ' +
  'No second mug appears and the mug never transforms.';

/* Two scenes. `mug` is what Keith asked for and is the hard one: a grip forming
 * on a small object near the face is where i2v models break. `ambient` removes
 * the held object entirely and gets its motion from the body and the room,
 * which is far more reliable and still stops a scroll. Pick with argv[3]. */
const PAPER_STILL =
  'The newspaper stays completely still, flat and square to the camera, held in the same position ' +
  'for the entire shot. Its headline and masthead do not move, do not bend and do not change: ' +
  'every letter stays exactly as it is and stays perfectly legible. ';

const SCENES = {
  /* Keith's first idea. Hardest of the three: the mug is on the table below the
   * paper, so reaching it means one hand leaves the newspaper, which is exactly
   * what makes the page drift and the headline warp. The paper is pinned to his
   * left hand explicitly so only the right arm moves. */
  sip:
    'Locked-off camera, no camera movement. ' + PAPER_STILL +
    'He keeps hold of the newspaper with his left hand so it does not move. ' +
    'With his right hand he reaches down to the table, picks up the dark ceramic mug by its handle, ' +
    'raises it to his mouth, takes one slow sip, and sets it back down on the table in the same spot. ' +
    'His grip on the handle stays consistent, fingers through the handle. ' +
    'Only his right arm and the mug move. Black and white, soft daylight, unchanged throughout.',

  /* Keith's second idea, and the safer one: nothing but his head and eyes move,
   * so the paper has no reason to drift at all. */
  lookup:
    'Locked-off camera, no camera movement. ' + PAPER_STILL +
    'He lifts his eyes from the page and looks up and off to the left, as if someone has just walked ' +
    'into the kitchen behind the camera. His expression softens slightly. He holds the look for a moment, ' +
    'then lowers his eyes back down to the page. ' +
    'Only his eyes, head and eyebrows move. His hands and the newspaper do not move at all. ' +
    'Black and white, soft daylight, unchanged throughout. Nothing else in the room moves.',

  /* Fallback if both of the above warp the type: the least motion that still
   * reads as alive in a feed. */
  breathe:
    'Locked-off camera, no camera movement. ' + PAPER_STILL +
    'He is completely still except for slow breathing and one slow blink. ' +
    'Faint steam rises from the mug on the table. The bare branches outside the window move very slightly. ' +
    'His hands and the newspaper do not move at all. ' +
    'Black and white, soft daylight, unchanged throughout.',

  mug:
    'Locked-off camera, no camera movement. ' +
    `He picks up ${MUG} ` +
    'He grips the handle with his fingers through it, handle on the near side facing the camera, ' +
    'thumb resting on top of the handle. He raises the mug to his mouth, takes one slow sip, ' +
    'and lowers it back to the windowsill, still looking out of the window throughout. ' +
    'His hand stays clearly wrapped around the handle for the whole shot. ' +
    'Overcast winter daylight, unchanged throughout. Black and white, 35mm film grain, ' +
    'documentary stillness. Nothing else in the room moves.',

  ambient:
    'Locked-off camera, no camera movement. His hands stay exactly where they are and he holds ' +
    'nothing. He breathes slowly, blinks, shifts his weight slightly from one foot to the other, ' +
    'and turns his head a few degrees to follow something outside the window. ' +
    'The net curtain moves very slightly. Overcast winter daylight, unchanged throughout. ' +
    'Black and white, 35mm film grain, documentary stillness. Nothing else in the room moves.',
};

const scene = (process.argv[3] || 'mug').toLowerCase();
const PROMPT = SCENES[scene];
if (!PROMPT) { console.error(`scenes: ${Object.keys(SCENES).join(', ')}`); process.exit(1); }

const NEGATIVE =
  'newspaper moving, paper drifting, paper bending, headline changing, letters morphing, ' +
  'text warping, masthead changing, page turning, ' +
  'mug changing shape, different mug, second mug, handle changing, handle disappearing, ' +
  'cup morphing, object transforming, duplicated objects, ' +
  'camera pan, zoom, colour, saturation, warping hands, extra fingers, morphing face, ' +
  'subtitles, watermark';

const MODELS = {
  wan: {
    slug: 'wan-video/wan-2.2-i2v-fast',
    input: (img) => ({ image: img, prompt: PROMPT, resolution: '480p', num_frames: 81 }),
  },
  seedance: {
    slug: 'bytedance/seedance-1-lite',
    input: (img) => ({ image: img, prompt: PROMPT, duration: 5, resolution: '480p' }),
  },
  kling: {
    slug: 'kwaivgi/kling-v2.1',
    input: (img) => ({ start_image: img, prompt: PROMPT, negative_prompt: NEGATIVE, duration: 5, mode: 'standard' }),
  },
};

const which = (process.argv[2] || 'wan').toLowerCase();
const model = MODELS[which];
if (!model) { console.error(`options: ${Object.keys(MODELS).join(', ')}`); process.exit(1); }

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

(async () => {
  if (!fs.existsSync(SOURCE)) { console.error(`missing source frame: ${SOURCE}`); process.exit(1); }

  /* data URI keeps it to one request and avoids needing the file to be public */
  const b64 = fs.readFileSync(SOURCE).toString('base64');
  const dataUri = `data:image/jpeg;base64,${b64}`;

  console.log(`model: ${model.slug}`);
  const create = await req('POST', `https://api.replicate.com/v1/models/${model.slug}/predictions`, {
    input: model.input(dataUri),
  });

  if (create.status >= 400) {
    console.error(`create failed (${create.status}):`, JSON.stringify(create.json || create.raw).slice(0, 900));
    process.exit(1);
  }

  let pred = create.json;
  process.stdout.write('rendering');
  while (pred.status === 'starting' || pred.status === 'processing') {
    await sleep(4000);
    process.stdout.write('.');
    pred = (await req('GET', `https://api.replicate.com/v1/predictions/${pred.id}`)).json;
  }
  console.log('');

  if (pred.status !== 'succeeded') {
    console.error('failed:', pred.status, pred.error);
    process.exit(1);
  }

  const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
  const out = path.join(__dirname, `cover-video-${which}-${scene}.mp4`);
  await download(url, out);

  const metrics = pred.metrics || {};
  console.log(`saved ${out}`);
  console.log(`predict time: ${metrics.predict_time ? metrics.predict_time.toFixed(1) + 's' : 'n/a'}`);
})();
