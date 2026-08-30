/*
 * Andro Prime — icon set build, Interlocked AP.
 *
 * Replaces the Refined Monogram build described in visual-identity.md, which cannot be reused:
 * that one starts by outlining Inter Black glyphs to paths, and this mark is a custom interlock
 * in no typeface, so there is no font to outline.
 *
 * INTERIM. The source here is SOURCE-mark-only.png, a raster from a generative model. That is an
 * acceptable source for the ICON SET specifically, because every output is a fixed-size raster and
 * the vector requirement exists for print and font-independence. It is NOT acceptable for the
 * lockup, the packaging emblem or anything that scales. Re-run this against the hand-drawn vector
 * when it exists; the geometry below does not change.
 *
 *   node build-icons.js            # writes ./out and installs into the Next app
 *   node build-icons.js --dry      # writes ./out only
 *
 * Decisions, and why (verified on screen 2026-08-30, not assumed):
 *   - TILE, not bare glyph. A black-on-transparent mark is invisible on a dark browser tab strip
 *     (#35363a). The tile carries its own ground, so it holds in both light and dark.
 *   - 6% MARGIN. Ladder at 17/11/6/2%: 17 and 11 read muddy at 16px, 2 runs the P's bowl into the
 *     edge. 6 is the largest glyph that still clears the edge.
 *   - HARD THRESHOLD at full resolution, then Lanczos down. The source is anti-aliased and slightly
 *     off-black; the brand is pure #000/#FFF. Thresholding first and resampling after gives clean
 *     edges without the grey fringe a straight downscale leaves.
 */
const sharp = require('../../../../09_website-app/frontend/node_modules/sharp');
const fs = require('fs'), path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'SOURCE-mark-only.png');
const OUT = path.join(HERE, 'out');
const APP = path.resolve(HERE, '../../../../09_website-app/frontend');
const MARGIN = 0.06;
const DRY = process.argv.includes('--dry');

// Minimal PNG-embedded .ico writer. Supported by every browser that matters; a favicon.ico is
// read by browsers, not by Explorer, so BMP encoding buys nothing here.
function ico(pngs) {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2); dir.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8); e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([dir, ...entries, ...pngs.map(p => p.data)]);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const trimmed = await sharp(SRC).trim({ threshold: 20 }).png().toBuffer();
  const { data, info } = await sharp(trimmed).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, n = W * H;

  const rgba = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const glyph = data[i * info.channels] < 128;      // dark pixel = part of the mark
    const o = i * 4;
    rgba[o] = rgba[o + 1] = rgba[o + 2] = 255;         // mark is WHITE, knocked out of the tile
    rgba[o + 3] = glyph ? 255 : 0;
  }
  const glyphPng = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();

  const side = Math.round(Math.max(W, H) / (1 - 2 * MARGIN));
  const master = await sharp({ create: { width: side, height: side, channels: 4,
                                         background: { r: 0, g: 0, b: 0, alpha: 1 } } })
    .composite([{ input: glyphPng, top: Math.round((side - H) / 2), left: Math.round((side - W) / 2) }])
    .png().toBuffer();
  await sharp(master).png().toFile(path.join(OUT, 'master.png'));
  console.log(`mark ${W}x${H} -> tile ${side}x${side} @ ${MARGIN * 100}% margin`);

  const at = async s => sharp(master).resize(s, s, { kernel: 'lanczos3' })
    .png({ compressionLevel: 9 }).toBuffer();

  const sizes = [16, 32, 48, 180, 192, 512];
  const png = {};
  for (const s of sizes) {
    png[s] = await at(s);
    fs.writeFileSync(path.join(OUT, `icon-${s}.png`), png[s]);
  }
  const icoBuf = ico([16, 32, 48].map(s => ({ size: s, data: png[s] })));
  fs.writeFileSync(path.join(OUT, 'favicon.ico'), icoBuf);
  console.log(`out/ written: ${sizes.length} PNGs + favicon.ico (${icoBuf.length} bytes, 16/32/48)`);

  if (DRY) return console.log('--dry: not installing');

  const install = [
    ['favicon.ico',   path.join(APP, 'app/favicon.ico'),        icoBuf],
    ['icon.png',      path.join(APP, 'app/icon.png'),           png[512]],
    ['apple-icon',    path.join(APP, 'app/apple-icon.png'),     png[180]],
    ['icon-192',      path.join(APP, 'public/icon-192.png'),    png[192]],
    ['icon-512',      path.join(APP, 'public/icon-512.png'),    png[512]],
  ];
  for (const [label, dest, buf] of install) {
    fs.writeFileSync(dest, buf);
    console.log(`  installed ${label.padEnd(12)} -> ${path.relative(APP, dest)} (${buf.length} b)`);
  }
})();
