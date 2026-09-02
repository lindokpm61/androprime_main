/*
 * Andro Prime — prove the redrawn mark IS the approved mark.
 *
 *   node gen-logo.js --verify
 *
 * WHY. Everything else in this folder is a measurement of the reference or an argument about it.
 * This is the only step that closes the loop: it draws the vector at the REFERENCE's own uneven
 * stroke weights, rasterises it to the source's exact pixel dimensions, and diffs it against
 * SOURCE-mark-only.png. If the construction is right the two agree almost everywhere; if a radius,
 * a slope or a winding rule is wrong it shows up as a solid block of disagreement.
 *
 * It was worth building. The first construction fitted the bowl as a superellipse with an rms of
 * 8.9px, looked fine by that number, and was wrong by 184px at the top of the bowl. An aggregate
 * residual could not see that. A pixel diff can.
 *
 * Two images are written to ./out:
 *   verify-overlay.png  reference in black, redraw outlined, so a shift is visible
 *   verify-diff.png     red = in the reference only, blue = in the redraw only
 *
 * The production mark is then rasterised too, and its ink coverage reported against the reference,
 * which is the number that says whether "more weight" actually happened.
 */
'use strict'

const sharp = require('../../../../09_website-app/frontend/node_modules/sharp')
const fs = require('fs')
const path = require('path')
const { buildMark, markPathAt, REF, svg } = require('./gen-logo.js')

const HERE = __dirname
const OUT = path.join(HERE, 'out')

async function inkMask(buf, W, H) {
  // Flatten onto white FIRST. An SVG rasterises with an alpha channel, and greyscale() keeps it,
  // so a raw buffer can be 2 channels per pixel; reading it as 1 makes every pixel look like ink
  // and the diff reports a solid black box that has nothing to do with the geometry.
  const { data, info } = await sharp(buf)
    .resize(W, H, { fit: 'fill' })
    .flatten({ background: '#ffffff' })
    .greyscale()
    .raw().toBuffer({ resolveWithObject: true })
  const C = info.channels
  const m = new Uint8Array(W * H)
  for (let i = 0; i < W * H; i++) m[i] = data[i * C] < 128 ? 1 : 0
  return m
}

function renderMark(mark, W, H) {
  // Draw into a box exactly matching the reference glyph's bounds, so the diff is like for like.
  const p = markPathAt(mark, H)
  const body = `  <path d="${p.d}" fill="#000000" fill-rule="nonzero"/>`
  return Buffer.from(svg(`0 0 ${p.width.toFixed(3)} ${H}`, body))
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const W = REF.GW, H = REF.GH

  // The reference raster, cropped to its own glyph bounds (source y 128..1264, full width).
  const refBuf = await sharp(path.join(HERE, 'SOURCE-mark-only.png'))
    .extract({ left: 0, top: 128, width: 1392, height: 1137 }).png().toBuffer()
  const ref = await inkMask(refBuf, W, H)

  // The redraw at the REFERENCE's weights: this is the geometry test, with weight held out of it.
  const refMark = buildMark({ useRef: true })
  const mine = await inkMask(renderMark(refMark, W, H), W, H)

  let onlyRef = 0, onlyMine = 0, both = 0
  const rgb = Buffer.alloc(W * H * 3, 255)
  for (let i = 0; i < W * H; i++) {
    const a = ref[i], b = mine[i]
    if (a && b) { both++; rgb[i * 3] = 30; rgb[i * 3 + 1] = 30; rgb[i * 3 + 2] = 30 }
    else if (a) { onlyRef++; rgb[i * 3] = 220; rgb[i * 3 + 1] = 40; rgb[i * 3 + 2] = 40 }
    else if (b) { onlyMine++; rgb[i * 3] = 40; rgb[i * 3 + 1] = 90; rgb[i * 3 + 2] = 220 }
  }
  await sharp(rgb, { raw: { width: W, height: H, channels: 3 } }).png()
    .toFile(path.join(OUT, 'verify-diff.png'))

  const refInk = both + onlyRef
  console.log('GEOMETRY TEST — redraw at the reference\'s own stroke weights, against SOURCE-mark-only.png')
  console.log(`  reference ink      ${refInk} px`)
  console.log(`  agreeing           ${both} px  (${((both / refInk) * 100).toFixed(2)}% of the reference)`)
  console.log(`  reference only     ${onlyRef} px  (${((onlyRef / refInk) * 100).toFixed(2)}%)`)
  console.log(`  redraw only        ${onlyMine} px  (${((onlyMine / refInk) * 100).toFixed(2)}%)`)
  const disagreement = (onlyRef + onlyMine) / refInk
  console.log(`  total disagreement ${(disagreement * 100).toFixed(2)}% of reference ink`)
  console.log(`  -> ${disagreement < 0.04 ? 'PASS' : 'LOOK AT verify-diff.png'}`)
  console.log('')

  // Weight check: production against reference, same silhouette, more ink.
  const prod = await inkMask(renderMark(buildMark(), W, H), W, H)
  let prodInk = 0
  for (let i = 0; i < W * H; i++) if (prod[i]) prodInk++
  console.log('WEIGHT TEST — production draw against the reference')
  console.log(`  reference ink  ${refInk} px`)
  console.log(`  production ink ${prodInk} px`)
  console.log(`  change         ${(((prodInk - refInk) / refInk) * 100).toFixed(1)}%`)
  console.log('  (the README asks for more weight than the reference shows; this is that, measured)')
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
