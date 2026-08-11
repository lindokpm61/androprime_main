/*
 * Shared media helpers: ffmpeg discovery, image dimensions, SSIM.
 *
 * Extracted from inpaint.js when video.js needed the same band geometry. Both
 * scripts crop the brand band off before a model sees the frame and composite it
 * back afterwards, and both have to agree on where the band starts. A second
 * copy of `dims()` would eventually disagree with the first, and the symptom
 * would be a lockup sliced a few pixels off — visible only once it is posted.
 *
 * No image library is installed and none is wanted here: dimensions come from
 * the file header, and every pixel operation goes through ffmpeg.
 */

const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

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

/** ffprobe ships beside ffmpeg, so derive it rather than search again. */
function findFfprobe(ffmpegBin) {
  if (process.env.FFPROBE_PATH) return process.env.FFPROBE_PATH;
  if (!ffmpegBin) return null;
  const guess = ffmpegBin.replace(/ffmpeg(\.exe)?$/i, (m) => (m.toLowerCase().endsWith('.exe') ? 'ffprobe.exe' : 'ffprobe'));
  try { execFileSync(guess, ['-version'], { stdio: 'ignore' }); return guess; } catch (_) { return null; }
}

const ff = (bin, args) => execFileSync(bin, ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });

/** Width and height straight out of the PNG/JPEG header. */
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

/** Video width/height/fps. Returns null when ffprobe is absent, never throws:
 *  this is used for reporting, and a missing probe must not stop a render. */
function videoInfo(probeBin, file) {
  if (!probeBin) return null;
  try {
    const out = execFileSync(probeBin, [
      '-v', 'error', '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,r_frame_rate,nb_frames',
      '-of', 'default=noprint_wrappers=1:nokey=1', file,
    ]).toString().trim().split('\n');
    const [num, den] = (out[2] || '0/1').split('/').map(Number);
    return {
      w: Number(out[0]), h: Number(out[1]),
      fps: den ? +(num / den).toFixed(2) : null,
      frames: Number(out[3]) || null,
    };
  } catch (_) { return null; }
}

/**
 * Structural similarity between two same-size images, compared on luma.
 *
 * Used as a guard rather than a metric: it answers "is the strip I am about to
 * crop off actually the brand band?" before anything is cropped or spent.
 */
function ssim(ffmpegBin, a, b) {
  /* spawnSync, not execFileSync: ffmpeg writes the SSIM report to STDERR, and
   * execFileSync returns stdout only — it hands you stderr just on a non-zero
   * exit. So the successful run is exactly the case where the number would be
   * thrown away, and the guard built on it would fail open. */
  const res = spawnSync(ffmpegBin, [
    '-hide_banner', '-i', a, '-i', b,
    '-lavfi', '[0:v]format=gray,setsar=1[x];[1:v]format=gray,setsar=1[y];[x][y]ssim',
    '-f', 'null', '-',
  ], { encoding: 'utf8' });
  return parseSsim(`${res.stderr || ''}${res.stdout || ''}`);
}

function parseSsim(text) {
  const all = text.match(/All:\s*([0-9.]+)/);
  if (all) return Number(all[1]);
  const y = text.match(/SSIM\s+Y:\s*([0-9.]+)/);
  return y ? Number(y[1]) : null;
}

module.exports = { findFfmpeg, findFfprobe, ff, dims, videoInfo, ssim };
