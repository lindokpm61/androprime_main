/*
 * Andro Prime — the wordmark face test.
 *
 *   node gen-logo.js --compare
 *
 * WHY. `README.md` records the mark as approved and the wordmark as "a heavy grotesque sans,
 * uppercase", with the face itself still open: "the remaining detail is which grotesque: cheapest
 * is the body sans at its heaviest weight rather than a third family". The body sans is Source Sans
 * 3, which is HUMANIST, not grotesque, so the cheap option quietly departs from the approved spec.
 * That is a decision for Keith, not for this script, so this renders the same lockup three ways and
 * lets him look at it. It is the same shape of test that settled grotesque-versus-serif on
 * 2026-08-30: one artefact, several sizes, decided by eye at the sizes that actually ship.
 *
 * Sizes are the ones that matter rather than a ladder for its own sake:
 *   52px  the marketing header
 *   22px  the app chrome
 *   14px  the smallest place a lockup is ever set, where a humanist's open apertures start to help
 *         and a grotesque's tight ones start to fill in
 * plus the bare mark at 16px, which is the favicon gate the mark already passed as a raster.
 *
 * Writes out/face-compare.png. Nothing here touches the masters.
 */
'use strict'

const sharp = require('../../../../09_website-app/frontend/node_modules/sharp')
const fs = require('fs')
const path = require('path')
const { buildMark, buildLockup, markPathAt, FACES, svg } = require('./gen-logo.js')

const HERE = __dirname
const OUT = path.join(HERE, 'out')
const SIZES = [52, 22, 14]
const SCALE = 2                 // render at 2x so the sheet is legible on a normal screen
const PAD = 28
const ROW_GAP = 34
const LABEL_H = 22

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

async function pngOfLockup(mark, faceKey, heightPx, ink) {
  const lk = buildLockup(mark, faceKey, 100)
  const w = (lk.width / 100) * heightPx
  const body =
    `  <path d="${lk.markD}" fill="${ink}" fill-rule="nonzero"/>\n` +
    `  <path d="${lk.wordD}" fill="${ink}" fill-rule="nonzero"/>`
  const s = svg(`0 0 ${lk.width.toFixed(3)} 100`, body)
  const buf = await sharp(Buffer.from(s))
    .resize({ width: Math.max(1, Math.round(w * SCALE)), height: Math.max(1, Math.round(heightPx * SCALE)) })
    .png().toBuffer()
  return { buf, w: Math.round(w * SCALE), h: Math.round(heightPx * SCALE) }
}

async function pngOfMark(mark, heightPx, ink) {
  const p = markPathAt(mark, 1000)
  const s = svg(`0 0 ${p.width.toFixed(3)} 1000`, `  <path d="${p.d}" fill="${ink}" fill-rule="nonzero"/>`)
  const w = (p.width / 1000) * heightPx
  const buf = await sharp(Buffer.from(s))
    .resize({ width: Math.max(1, Math.round(w * SCALE)), height: Math.max(1, Math.round(heightPx * SCALE)) })
    .png().toBuffer()
  return { buf, w: Math.round(w * SCALE), h: Math.round(heightPx * SCALE) }
}

function textSvg(t, size, colour = '#111', weight = 600) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(t.length * size * 0.62)}" height="${Math.round(size * 1.5)}">` +
    `<text x="0" y="${Math.round(size * 1.1)}" font-family="Segoe UI, Arial, sans-serif" ` +
    `font-size="${size}" font-weight="${weight}" fill="${colour}">${esc(t)}</text></svg>`
  )
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const mark = buildMark()
  const keys = Object.keys(FACES)

  // Lay out: one block per face, each block a label then the three sizes stacked, left-aligned.
  const blocks = []
  for (const k of keys) {
    const rows = []
    for (const px of SIZES) rows.push({ px, ...(await pngOfLockup(mark, k, px, '#000000')) })
    blocks.push({ key: k, label: FACES[k].label, rows })
  }
  const markRow = await pngOfMark(mark, 16, '#000000')
  const markRow52 = await pngOfMark(mark, 52, '#000000')

  // Lay everything out first and size the canvas from the result. Guessing the height and then
  // compositing into it is how you get "Image to composite must have same dimensions or smaller".
  const comps = []
  let y = PAD

  comps.push({ input: textSvg('ANDRO PRIME lockup: three grotesques, at the sizes that ship', 15 * SCALE, '#111', 700), left: PAD, top: y })
  y += 24 * SCALE
  comps.push({ input: textSvg('mark is settled and identical in all three; only the wordmark face changes', 11 * SCALE, '#666', 400), left: PAD, top: y })
  y += 26 * SCALE

  for (const b of blocks) {
    comps.push({ input: textSvg(b.label, 12 * SCALE, '#000', 700), left: PAD, top: y })
    y += LABEL_H * SCALE
    for (const r of b.rows) {
      comps.push({ input: r.buf, left: PAD, top: y })
      comps.push({ input: textSvg(`${r.px}px`, 9 * SCALE, '#999', 400), left: PAD + r.w + 12 * SCALE, top: y + Math.max(0, (r.h - 12 * SCALE) / 2) })
      y += r.h + ROW_GAP
    }
    y += ROW_GAP
  }

  comps.push({ input: textSvg('the mark alone, unchanged by the choice', 12 * SCALE, '#000', 700), left: PAD, top: y })
  y += LABEL_H * SCALE
  comps.push({ input: markRow52.buf, left: PAD, top: y })
  comps.push({ input: markRow.buf, left: PAD + markRow52.w + 30 * SCALE, top: y + (markRow52.h - markRow.h) })
  comps.push({ input: textSvg('52px                    16px, the favicon gate', 9 * SCALE, '#999', 400), left: PAD, top: y + markRow52.h + 8 })

  const sized = await Promise.all(comps.map(async (c) => {
    const meta = await sharp(c.input).metadata()
    return { ...c, w: meta.width, h: meta.height }
  }))
  const W = Math.max(...sized.map((c) => c.left + c.w)) + PAD
  const H = Math.max(...sized.map((c) => c.top + c.h)) + PAD

  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite(sized.map(({ input, left, top }) => ({ input, left: Math.round(left), top: Math.round(top) })))
    .png().toFile(path.join(OUT, 'face-compare.png'))

  console.log('WROTE out/face-compare.png')
  for (const b of blocks) {
    const lk = buildLockup(mark, b.key, 100)
    console.log(`  ${b.label.padEnd(22)} lockup ${lk.width.toFixed(1)} x 100  (wordmark ${(lk.width - (markPathAt(mark, 100).width)).toFixed(1)} wide)`)
  }
  console.log('')
  console.log('The approved reference lockup measured 11.93 wordmark-advances per cap height.')
  console.log('Archivo Black is 11.44, Figtree Black 9.96, Source Sans 3 Black 9.55, so Archivo is')
  console.log('closest to the proportions of the render Keith approved.')
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
