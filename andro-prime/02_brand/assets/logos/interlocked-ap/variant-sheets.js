/*
 * Andro Prime — the approved sheet, redrawn as vector, once per candidate wordmark face.
 *
 *   node gen-logo.js --variants
 *
 * WHY THIS AND NOT face-compare.png. The first attempt at "show me the fonts" produced a legibility
 * ladder: the lockup alone, at 52/22/14px. That answers "does it survive small", which is a real
 * question and not the one Keith asked. He asked to see variations of THE APPROVED SHEET, which is
 * the big mark above the lockup, at a size you can actually judge a letterform at. So this rebuilds
 * that composition exactly, in vector, with only the wordmark face changing between sheets.
 *
 * The layout is measured off SOURCE-approved-2026-08-30.png rather than invented:
 *   sheet   2048 x 2048, white
 *   mark    top 215, height 1197        (the approved mark's own bounds on that sheet)
 *   lockup  top 1654, height 181
 * Both are centred on the sheet's vertical axis, which the original very nearly is.
 *
 * Writes out/variant-<face>.png, plus out/variants-compare.png: the original alongside all three,
 * so the comparison is against the approved artwork rather than against memory of it.
 */
'use strict'

const sharp = require('../../../../09_website-app/frontend/node_modules/sharp')
const fs = require('fs')
const path = require('path')
const { buildMark, buildLockup, markPathAt, FACES, svg } = require('./gen-logo.js')

const HERE = __dirname
const OUT = path.join(HERE, 'out')

// measured off the approved sheet
const SHEET = 2048
const MARK_TOP = 215
const MARK_H = 1197
const LOCK_TOP = 1654
const LOCK_H = 181

async function renderPath(d, vbW, vbH, outW, outH, ink = '#000000') {
  const s = svg(`0 0 ${vbW} ${vbH}`, `  <path d="${d}" fill="${ink}" fill-rule="nonzero"/>`)
  return sharp(Buffer.from(s)).resize({ width: Math.round(outW), height: Math.round(outH) }).png().toBuffer()
}

async function variantSheet(mark, faceKey) {
  const mk = markPathAt(mark, MARK_H)
  const markPng = await renderPath(mk.d, mk.width, MARK_H, mk.width, MARK_H)

  const lk = buildLockup(mark, faceKey, LOCK_H)
  const lockPng = await renderPath(
    `${lk.markD} ${lk.wordD}`, lk.width, LOCK_H, lk.width, LOCK_H
  )

  return sharp({ create: { width: SHEET, height: SHEET, channels: 3, background: '#ffffff' } })
    .composite([
      { input: markPng, left: Math.round((SHEET - mk.width) / 2), top: MARK_TOP },
      { input: lockPng, left: Math.round((SHEET - lk.width) / 2), top: LOCK_TOP },
    ])
    .png().toBuffer()
}

function label(text, w, size = 34) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(size * 1.6)}">` +
    `<text x="0" y="${Math.round(size * 1.15)}" font-family="Segoe UI, Arial, sans-serif" ` +
    `font-size="${size}" font-weight="700" fill="#111">${text}</text></svg>`
  )
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const mark = buildMark()
  const keys = Object.keys(FACES)

  const sheets = []
  for (const k of keys) {
    const buf = await variantSheet(mark, k)
    fs.writeFileSync(path.join(OUT, `variant-${k}.png`), buf)
    sheets.push({ key: k, label: FACES[k].label, buf })
    console.log(`  wrote out/variant-${k}.png   (${FACES[k].label})`)
  }

  // Side by side with the approved original, so the comparison has a control.
  const COL = 620
  const GAP = 26
  const LAB = 58
  const original = await sharp(path.join(HERE, 'SOURCE-approved-2026-08-30.png'))
    .resize({ width: COL, height: COL }).flatten({ background: '#ffffff' }).png().toBuffer()

  const cols = [{ label: 'APPROVED original (raster)', buf: original }]
  for (const s of sheets) {
    cols.push({ label: s.label, buf: await sharp(s.buf).resize({ width: COL, height: COL }).png().toBuffer() })
  }

  const W = GAP + cols.length * (COL + GAP)
  const H = GAP + LAB + COL + GAP + 46
  const comps = []
  cols.forEach((c, i) => {
    const x = GAP + i * (COL + GAP)
    comps.push({ input: label(c.label, COL), left: x, top: GAP })
    comps.push({ input: c.buf, left: x, top: GAP + LAB })
  })
  comps.push({
    input: label('the mark is identical in every column; only the wordmark changes. Column 2 is the approved wordmark traced; 3 to 5 are typefaces.', W - GAP * 2, 24),
    left: GAP, top: GAP + LAB + COL + 10,
  })

  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite(comps).png().toFile(path.join(OUT, 'variants-compare.png'))
  console.log('  wrote out/variants-compare.png')
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
