/*
 * Animate the cover still into a short looping clip for slide 1.
 *   node video.js wan       -> wan-2.2-i2v-fast   (cheapest)
 *   node video.js seedance  -> seedance-1-lite
 *   node video.js kling     -> kling-v2.1         (best motion, priciest)
 *
 *   node video.js kling lookup cover-current-b2.jpg --deck 14-signs-of-vitamin-d-deficiency
 *   node video.js ... --dry                    resolve and check, no spend
 *   node video.js ... --recomposite work/x-raw.mp4    rebuild from an existing clip
 *
 * ALWAYS PASS --deck. It supplies the rendered type layer, and without it the
 * output is an animated photograph with no headline plate on it. The finished
 * video cover is: photo (animated) + brand band + type layer, and the plate
 * repeats the headline printed into the newspaper because both come from the
 * same covers.js row.
 *
 * Camera stays locked; only the subject moves. Subtle beats ambitious: hands
 * near the face are where these models break, and a carousel cover only needs
 * enough motion to catch the eye in a feed.
 *
 * THE BAND NEVER REACHES THE MODEL. It is cropped off before animating and
 * composited back over every frame afterwards, because a burnt-in band gets
 * warped along with everything else and the lockup has to stay pin sharp.
 * This file used to only SAY that. The 2026-08-11 model test sent the band
 * through wan-2.2 and it came back painted over with table, mug and laptop;
 * the word `crop` appeared exactly once in this file, inside the comment
 * claiming it was handled. Anyone trusting the comment spent money and got a
 * destroyed lockup. It would have cost all ten clips of the run, not one.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const token = require('./replicate-token.js')();
const { findFfmpeg, findFfprobe, ff, dims, videoInfo, ssim } = require('./media.js');

const argFlag = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : fallback;
};
const has = (name) => process.argv.includes(`--${name}`);

/* Positional argv is kept because STATE.md and review.html both quote it. */
const positional = process.argv.slice(2).filter((a, i, all) =>
  !a.startsWith('--') && !(all[i - 1] || '').startsWith('--'));

/* The finished greyscale cover, headline already inpainted and band baked on.
 * Animating THIS is the hard case: the headline is rendered type, and warping
 * type is the single thing video models are worst at. Every scene below
 * therefore pins the newspaper still and moves only the man. */
const SOURCE = path.resolve(__dirname, argFlag('src', positional[2] || 'cover-current-b2.jpg'));

/* The same strip inpaint.js re-attaches, and the only place the band height is
 * known. It is NOT a constant: the band is baked at a different height in every
 * base (195px on base-5 to 263px on base-1), so a hardcoded number would slice
 * the lockup on any cover but one. */
const BAND = path.resolve(__dirname, argFlag('band', 'work/band.png'));

/*
 * The transparent type layer: eyebrow, headline plate, rule, handle and
 * disclaimer, rendered by Chrome from the same covers.js row that supplied the
 * headline printed into the newspaper. Compositing it is what makes the clip the
 * finished video cover rather than an animated photograph.
 *
 * build.js has always written cover-overlay.html and said, in a comment, that
 * this file composites it over the mp4. This file had never heard of it and
 * render.js did not rasterise it, so the step existed only in prose — the same
 * shape of gap as the band crop, found the same way: by checking rather than
 * reading.
 */
const DECK = argFlag('deck');
const OVERLAY = path.resolve(
  __dirname,
  argFlag('overlay', DECK ? path.join('png', DECK, 'cover-overlay.png') : 'png/__no_deck__')
);

/* Instagram's slot-1 geometry. The band keeps its proportion of the frame. */
const OUT_W = 1080;
const OUT_H = 1350;

/* Below this, the strip about to be cropped off is not the brand band, so the
 * crop would eat the photograph instead. 0.97 passes re-encoded JPEG copies of
 * the same band and fails a band-free frame outright — measured, not guessed. */
const BAND_MATCH_MIN = 0.97;

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
  /* Keith's idea, 2026-08-12: he looks out of the window as someone passes
   * outside. Two risks the wording has to manage, neither of them the paper.
   *
   * The passer-by is a SECOND FIGURE, and a second figure is the reliable i2v
   * break: it arrives with a warped face, or it walks in through the wall, or it
   * resolves as his own reflection in the glass. So it is pinned outside, behind
   * the glass, small, distant and out of focus, and told never to enter. A
   * silhouette at that size cannot have a face to get wrong.
   *
   * And the window is camera-LEFT, so turning to it turns his face away from the
   * lens. The turn is a few degrees and he comes back, because a cover whose
   * subject ends in profile stops reading as eye contact at grid size. */
  window:
    'Locked-off camera, no camera movement. ' + PAPER_STILL +
    'Outside the tall window at the left of the frame, a person in a dark winter coat walks past ' +
    'from left to right at a normal walking pace, on the other side of the glass, clearly visible ' +
    'against the bright sky as a dark silhouette with their back and side to us, their face never ' +
    'visible. They stay outside and never come near the glass. ' +
    'He notices the movement, lifts his eyes from the page and turns his head slightly towards the ' +
    'window to watch them pass, keeping his face mostly towards the camera and never turning to ' +
    'full profile, then turns back to square and lowers his eyes to the page. ' +
    'Only his eyes, head and eyebrows move. His hands and the newspaper do not move at all. ' +
    'Black and white, soft daylight, unchanged throughout. Nothing else in the room moves.',

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

const scene = (positional[1] || 'lookup').toLowerCase();
const PROMPT = SCENES[scene];
if (!PROMPT) { console.error(`scenes: ${Object.keys(SCENES).join(', ')}`); process.exit(1); }

const NEGATIVE =
  'newspaper moving, paper drifting, paper bending, headline changing, letters morphing, ' +
  'text warping, masthead changing, page turning, ' +
  'mug changing shape, different mug, second mug, handle changing, handle disappearing, ' +
  'cup morphing, object transforming, duplicated objects, ' +
  'camera pan, zoom, colour, saturation, warping hands, extra fingers, morphing face, ' +
  /* Added for the `window` scene and harmless to the rest, which have no second
   * figure either. Deliberately does NOT say "second person": the passer-by is
   * wanted, just only ever outside, behind the glass and faceless at that size. */
  /* NOT "figure at the window": the first `window` run came back with no
   * passer-by at all, and a negative that close to the wanted element is the
   * likeliest suppressor. Only the ways it can go wrong are listed. */
  'person inside the room, someone entering the kitchen, second face, ' +
  'face reflected in the window, person climbing through the window, ' +
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
  /* Kling 2.6 Pro. There is no `mode` switch on this one: it is Pro-tier only,
   * so unlike v2.1 there is no cheap variant to fall back to if the quality is
   * not worth the rate.
   *
   * Two defaults here are actively wrong for a carousel cover and are set
   * explicitly rather than inherited:
   *   · aspect_ratio defaults to 16:9. The band-free source is 1122x1140, so
   *     16:9 would recompose a nearly-square frame into landscape and the
   *     newspaper would not survive the crop back to 1080x1350. Only 16:9, 9:16
   *     and 1:1 are offered, so 1:1 is the one that matches.
   *   · generate_audio defaults to TRUE. A cover clip autoplays muted in a feed,
   *     so the audio is output nobody will ever hear, on a model billed by the
   *     second of output. Off. */
  kling26: {
    slug: 'kwaivgi/kling-v2.6',
    input: (img) => ({
      start_image: img, prompt: PROMPT, negative_prompt: NEGATIVE,
      duration: 5, aspect_ratio: '1:1', generate_audio: false,
    }),
  },
};

const which = (positional[0] || 'kling').toLowerCase();
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

/* ------------------------------------------------------------- the band --- */

/**
 * Crop the band off, having first PROVED the strip is the band.
 *
 * The check exists because the failure it prevents is silent: hand this a frame
 * that has no band (work/cover-img.jpg) or a base with different geometry
 * (base-5 is 1132x1390, not 1122x1402) and a blind crop removes 262px of
 * photograph instead. The clip still renders, still looks plausible in a
 * terminal, and is wrong.
 */
function cropBand(bin, work) {
  const src = dims(SOURCE);
  const band = dims(BAND);

  if (band.w !== src.w) {
    console.error(`\nband is ${band.w}px wide, source is ${src.w}px.`);
    console.error('The band belongs to a different cover geometry. Re-cut it, or pass --band.');
    process.exit(1);
  }
  if (band.h >= src.h) {
    console.error(`\nband (${band.h}px) is not shorter than the source (${src.h}px).`);
    process.exit(1);
  }

  /* Compare the source's bottom strip against the band itself. */
  const strip = path.join(work, 'band-check.png');
  ff(bin, ['-i', SOURCE, '-vf', `crop=${band.w}:${band.h}:0:${src.h - band.h}`, strip]);
  const match = ssim(bin, strip, BAND);

  if (match === null) {
    console.error('\ncould not compare the source strip against the band (ffmpeg gave no SSIM).');
    console.error('Refusing to crop blind. Fix ffmpeg, or pass --band explicitly.');
    process.exit(1);
  }
  if (match < BAND_MATCH_MIN) {
    console.error(`\nthe bottom ${band.h}px of ${path.basename(SOURCE)} is NOT the brand band.`);
    console.error(`SSIM against ${path.basename(BAND)} is ${match.toFixed(3)}, below ${BAND_MATCH_MIN}.`);
    console.error('Cropping would cut into the photograph. Pass a cover that carries the band.');
    process.exit(1);
  }

  const frame = path.join(work, `${path.parse(SOURCE).name}-noband.jpg`);
  ff(bin, ['-i', SOURCE, '-vf', `crop=${src.w}:${src.h - band.h}:0:0`, '-q:v', '2', frame]);

  console.log(`band     : ${band.w}x${band.h}, matched at SSIM ${match.toFixed(4)} — cropped off`);
  console.log(`to model : ${path.basename(frame)} (${src.w}x${src.h - band.h}), band excluded`);
  return { frame, src, band };
}

/**
 * Put the band back over every frame and fit to 1080x1350.
 *
 * The clip is scaled to cover the image area and centre-cropped rather than
 * stretched. Models return their own resolution and aspect (wan gave 560x704
 * from a near-square frame), and stretching to fit widens the face — the same
 * failure already documented for Higgsfield. Losing a few pixels at the edge is
 * recoverable; a subtly wider man across thirty covers is not.
 */
function compositeBand(bin, probe, clip, geom, out) {
  const { src, band } = geom;

  /* Both halves must be even for yuv420p, and must sum to exactly OUT_H. */
  let bandH = Math.round((band.h * OUT_W) / src.w);
  bandH -= bandH % 2;
  const imgH = OUT_H - bandH;

  const before = videoInfo(probe, clip);
  if (before) {
    const clipAspect = before.w / before.h;
    const areaAspect = src.w / (src.h - band.h);
    console.log(`raw clip : ${before.w}x${before.h} @ ${before.fps}fps`);
    if (Math.abs(clipAspect - areaAspect) / areaAspect > 0.01) {
      console.log(`           aspect ${clipAspect.toFixed(3)} vs ${areaAspect.toFixed(3)} sent — ` +
        'scaling to cover and centre-cropping, not stretching');
    }
  }

  /* pad + overlay, NOT `-loop 1` + vstack.
   *
   * The obvious spelling is to loop the band and stack it under the clip, and it
   * does not terminate: vstack takes its duration from the LONGEST input, the
   * looped still is infinite, and `shortest=1` on the filter plus `-shortest` on
   * the output do not stop it either. Measured — it held the clip's final frame
   * and wrote 8MB of band in 25 seconds before it was killed. A single-frame
   * image input with overlay's default eof_action=repeat has no such edge: the
   * encode ends with the video stream, which is the only thing that should end
   * it. */
  /* The band goes back BEFORE the type layer, not instead of it. Reassembling
   * photo+band first reproduces the geometry the still template renders from
   * (the whole 1122x1402 cover fitted to 1080x1350), so the animated cover and
   * png/<deck>/cover-video.png line up frame for frame. The plate then covers
   * the band exactly as it does in the still. */
  const useOverlay = fs.existsSync(OVERLAY);
  const inputs = ['-i', clip, '-i', BAND];
  let chain =
    `[0:v]scale=${OUT_W}:${imgH}:force_original_aspect_ratio=increase,` +
      `crop=${OUT_W}:${imgH},pad=${OUT_W}:${OUT_H}:0:0,setsar=1[v];` +
    `[1:v]scale=${OUT_W}:${bandH},setsar=1[b];` +
    `[v][b]overlay=0:${imgH}:eof_action=repeat[photo];`;

  if (useOverlay) {
    inputs.push('-i', OVERLAY);
    chain += `[2:v]scale=${OUT_W}:${OUT_H},setsar=1[t];` +
      `[photo][t]overlay=0:0:eof_action=repeat,format=yuv420p[o]`;
  } else {
    chain += `[photo]format=yuv420p[o]`;
  }

  ff(bin, [
    ...inputs, '-filter_complex', chain,
    '-map', '[o]', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p',
    out,
  ]);

  const after = videoInfo(probe, out);
  console.log(`band back: bottom ${bandH}px composited over every frame, never sent to the model`);
  if (useOverlay) {
    console.log(`type     : ${path.relative(__dirname, OVERLAY)} composited — plate matches the newsprint`);
  } else {
    console.log('type     : NO OVERLAY — this is an animated photograph, not a finished cover.');
    console.log('           The headline plate is missing. Pass --deck <slug> after:');
    console.log(`             node build.js --deck <slug> && node render.js --deck <slug>`);
  }
  console.log(`saved    : ${out}${after ? ` (${after.w}x${after.h} @ ${after.fps}fps)` : ''}`);
}

/* ------------------------------------------------------------------ main --- */

(async () => {
  if (!fs.existsSync(SOURCE)) { console.error(`missing source frame: ${SOURCE}`); process.exit(1); }
  if (!fs.existsSync(BAND)) {
    console.error(`missing band: ${BAND}`);
    console.error('Without it the band cannot be removed or restored. Refusing to render.');
    process.exit(1);
  }

  const bin = findFfmpeg();
  if (!bin) {
    console.error('ffmpeg not found, so the band could not be cropped. Set FFMPEG_PATH.');
    console.error('Rendering without it would send the lockup through the model. Refusing.');
    process.exit(1);
  }
  const probe = findFfprobe(bin);

  /* A named deck whose type layer has not been rendered is a mistake, not a
   * choice: it would spend a model call and return an animated photograph with
   * no headline on it, which is only obvious if someone opens the file. */
  if (DECK && !fs.existsSync(OVERLAY)) {
    console.error(`\ndeck "${DECK}" has no rendered type layer at ${path.relative(__dirname, OVERLAY)}.`);
    console.error('Build and render it first, then re-run:');
    console.error(`  node build.js --deck ${DECK} && node render.js --deck ${DECK}`);
    process.exit(1);
  }

  const work = path.join(__dirname, 'work');
  if (!fs.existsSync(work)) fs.mkdirSync(work, { recursive: true });

  const out = path.join(__dirname, `cover-video-${which}-${scene}.mp4`);
  const geom = cropBand(bin, work);

  /* Re-composite an existing raw clip. No API call: this is how a clip rendered
   * before the crop existed gets its band back, and how the composite step is
   * tested without spending anything. */
  const recomposite = argFlag('recomposite');
  if (recomposite) {
    const clip = path.resolve(__dirname, recomposite);
    if (!fs.existsSync(clip)) { console.error(`missing clip: ${clip}`); process.exit(1); }
    console.log(`\n--recomposite: ${path.basename(clip)}, no API call`);
    compositeBand(bin, probe, clip, geom, out);
    return;
  }

  console.log(`model    : ${model.slug}`);
  console.log(`scene    : ${scene}`);
  console.log(`output   : ${out}`);

  /* --dry resolves and echoes everything, and leaves the cropped frame on disk
   * to be looked at, then stops before spending. Git Bash rewrites
   * leading-slash arguments into Windows paths, so a wrong path is otherwise
   * invisible until after the call has been billed. */
  if (has('dry')) {
    console.log('\n--dry: band cropped and checked, no API call made.');
    console.log(`Inspect ${path.relative(__dirname, geom.frame)} before spending.`);
    return;
  }

  /* data URI keeps it to one request and avoids needing the file to be public */
  const b64 = fs.readFileSync(geom.frame).toString('base64');
  const dataUri = `data:image/jpeg;base64,${b64}`;

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

  /* The model's output is kept, unmodified, next to the finished clip. It is the
   * only way to tell a model failure from a composite failure afterwards, which
   * is exactly the confusion the first reading of the 2026-08-11 test fell into:
   * a missing band was blamed on the model when the step was simply absent. */
  const raw = path.join(work, `cover-video-${which}-${scene}-raw.mp4`);
  await download(url, raw);

  const metrics = pred.metrics || {};
  console.log(`predict  : ${metrics.predict_time ? metrics.predict_time.toFixed(1) + 's' : 'n/a'}`);
  console.log(`raw      : ${path.relative(__dirname, raw)}  (band-free, as returned)`);

  compositeBand(bin, probe, raw, geom, out);
})();
