/*
 * Andro Prime — measure the approved Interlocked AP reference raster.
 *
 *   node measure-source.js
 *
 * WHY THIS EXISTS. `SOURCE-mark-only.png` is a raster from a generative model and it is what Keith
 * approved on 2026-08-30. The vector master has to BE that mark, not a plausible mark, so the
 * redraw starts from measured edges rather than from looking at it. This prints the numbers the
 * generator is built on; it changes nothing on disk.
 *
 * It reports, in source pixels and normalised to the glyph's own bounding box:
 *   - the glyph bounds
 *   - the shared stem's left and right edges
 *   - the A crossbar's top and bottom
 *   - the P bowl's outer right edge and its counter
 *   - the A diagonal's edges at top and at the baseline
 * Normalised numbers are what the generator uses, so the drawing is resolution-independent.
 */
const sharp = require('../../../../09_website-app/frontend/node_modules/sharp')
const path = require('path')

const SRC = path.join(__dirname, 'SOURCE-mark-only.png')
const INK = 128 // below this on a greyscale copy counts as ink

;(async () => {
  const img = sharp(SRC).greyscale()
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  const at = (x, y) => data[(y * W + x) * C] < INK

  // --- glyph bounds -------------------------------------------------------
  let x0 = W, x1 = -1, y0 = H, y1 = -1
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (at(x, y)) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  const gw = x1 - x0 + 1
  const gh = y1 - y0 + 1

  // Runs of ink along a scanline, as [start, end] pairs in source pixels.
  const runsRow = (y) => {
    const out = []
    let s = null
    for (let x = x0; x <= x1; x++) {
      const on = at(x, y)
      if (on && s === null) s = x
      if (!on && s !== null) { out.push([s, x - 1]); s = null }
    }
    if (s !== null) out.push([s, x1])
    return out
  }
  const runsCol = (x) => {
    const out = []
    let s = null
    for (let y = y0; y <= y1; y++) {
      const on = at(x, y)
      if (on && s === null) s = y
      if (!on && s !== null) { out.push([s, y - 1]); s = null }
    }
    if (s !== null) out.push([s, y1])
    return out
  }

  const n = (v, o, span) => ((v - o) / span).toFixed(4)
  const nx = (v) => n(v, x0, gw)
  const ny = (v) => n(v, y0, gh)

  console.log('SOURCE-mark-only.png')
  console.log(`  image        ${W} x ${H}`)
  console.log(`  glyph bounds x ${x0}..${x1} (w ${gw}), y ${y0}..${y1} (h ${gh})`)
  console.log(`  aspect       ${(gw / gh).toFixed(4)} (w/h)`)
  console.log('')

  // --- scanlines across the whole glyph ----------------------------------
  console.log('ROW RUNS (source px, then normalised x)')
  for (const f of [0.02, 0.06, 0.12, 0.20, 0.32, 0.45, 0.52, 0.58, 0.62, 0.66, 0.72, 0.80, 0.90, 0.98]) {
    const y = Math.round(y0 + f * (gh - 1))
    const r = runsRow(y)
    const norm = r.map(([a, b]) => `${nx(a)}-${nx(b)}`).join('  ')
    console.log(`  y=${f.toFixed(2)} (${y})  runs=${r.length}  ${norm}`)
  }
  console.log('')

  console.log('COLUMN RUNS (source px, then normalised y)')
  for (const f of [0.02, 0.10, 0.25, 0.40, 0.50, 0.55, 0.62, 0.70, 0.80, 0.90, 0.98]) {
    const x = Math.round(x0 + f * (gw - 1))
    const r = runsCol(x)
    const norm = r.map(([a, b]) => `${ny(a)}-${ny(b)}`).join('  ')
    console.log(`  x=${f.toFixed(2)} (${x})  runs=${r.length}  ${norm}`)
  }
  console.log('')

  // --- the stem: the column band that is ink for (almost) the full height -
  let stemL = null, stemR = null
  for (let x = x0; x <= x1; x++) {
    const r = runsCol(x)
    const full = r.length === 1 && (r[0][1] - r[0][0]) > 0.9 * gh
    if (full && stemL === null) stemL = x
    if (full) stemR = x
  }
  console.log('SHARED STEM (columns inked for >90% of the glyph height)')
  console.log(`  x ${stemL}..${stemR}  width ${stemR - stemL + 1}px`)
  console.log(`  normalised ${nx(stemL)} .. ${nx(stemR)}  width ${((stemR - stemL + 1) / gw).toFixed(4)}`)
  console.log('')

  // --- the bottom of the glyph is the stem alone: find where that starts --
  let soleStemFrom = null
  for (let y = y1; y >= y0; y--) {
    const r = runsRow(y)
    if (r.length === 1 && r[0][0] >= stemL - 2 && r[0][1] <= stemR + 2) soleStemFrom = y
    else break
  }
  console.log('STEM FOOT (rows where the stem is the only ink)')
  console.log(`  y ${soleStemFrom}..${y1}   normalised ${ny(soleStemFrom)} .. 1.0`)
  console.log('')

  // --- the P bowl's extreme right, and the row it happens on --------------
  let bowlR = -1, bowlRy = -1
  for (let y = y0; y <= y1; y++) {
    const r = runsRow(y)
    if (!r.length) continue
    const rightmost = r[r.length - 1][1]
    if (rightmost > bowlR) { bowlR = rightmost; bowlRy = y }
  }
  console.log('P BOWL')
  console.log(`  extreme right x=${bowlR} at y=${bowlRy}  normalised x ${nx(bowlR)}, y ${ny(bowlRy)}`)

  // counter of the P: the largest white run to the right of the stem
  let cTop = null, cBot = null, cL = null, cR = null
  for (let y = y0; y <= y1; y++) {
    const r = runsRow(y)
    if (r.length < 2) continue
    const afterStem = r.filter(([a]) => a > stemR)
    if (!afterStem.length) continue
    const gapL = r.find(([a]) => a > stemR)
    if (!gapL) continue
    const holeL = stemR + 1
    const holeR = gapL[0] - 1
    if (holeR - holeL < 10) continue
    if (cTop === null) cTop = y
    cBot = y
    if (cL === null || holeL < cL) cL = holeL
    if (cR === null || holeR > cR) cR = holeR
  }
  console.log(`  counter x ${cL}..${cR}, y ${cTop}..${cBot}`)
  console.log(`  counter normalised x ${nx(cL)}..${nx(cR)}, y ${ny(cTop)}..${ny(cBot)}`)
  console.log(`  bowl ring thickness right = ${bowlR - cR}px (${((bowlR - cR) / gw).toFixed(4)} of width)`)
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
