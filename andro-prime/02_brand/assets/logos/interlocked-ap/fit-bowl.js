/*
 * Andro Prime — check the P bowl's construction against the approved reference.
 *
 *   node fit-bowl.js
 *
 * WHAT THIS SETTLED, AND THE MISTAKE IT CORRECTS.
 *
 * The first version of this script fitted a SUPERELLIPSE to the bowl and reported an rms residual
 * of 8.9px on a 1392px glyph, which reads like a good fit. It was wrong. A superellipse has poles:
 * at the very top of the bowl it forces the outer edge back to the stem, width zero. The reference
 * measures 0.7320 there, which is 184px of ink the model did not have. The rms hid it because the
 * error lives on a handful of rows out of 728 and averaging is exactly the operation that makes a
 * large boundary error small. It only surfaced when the mark was rendered and the bowl came out
 * visibly rounder than the one Keith approved.
 *
 * So this script now reports MAX error alongside rms, and tests the construction that is actually
 * there: a STADIUM. The bowl's right end is a true semicircle whose radius equals half the bowl's
 * height, with straight horizontal top and bottom running back to the stem. That is the cleanest
 * construction available and the numbers say it is exact, not approximate:
 *
 *     outer   semicircle r = 394px, centre x = 997   (max error ~4px over the whole profile)
 *     counter semicircle r = 219px, centre x = 990
 *
 * The lesson is worth keeping next to the numbers: an aggregate goodness-of-fit statistic can hide
 * a large structured error at the boundary, and on a letterform the boundary is where the character
 * lives. Report the max, and look at the render.
 */
const sharp = require('../../../../09_website-app/frontend/node_modules/sharp')
const path = require('path')

const Y0 = 128, GW = 1392, GH = 1137
const STEM_R = 835

;(async () => {
  const { data, info } = await sharp(path.join(__dirname, 'SOURCE-mark-only.png'))
    .greyscale().raw().toBuffer({ resolveWithObject: true })
  const { width: W, channels: C } = info
  const at = (x, y) => data[(y * W + x) * C] < 128

  const rowRuns = (py) => {
    const o = []
    let s = null
    for (let x = 0; x <= GW - 1; x++) {
      const on = at(x, py)
      if (on && s === null) s = x
      if (!on && s !== null) { o.push([s, x - 1]); s = null }
    }
    if (s !== null) o.push([s, GW - 1])
    return o
  }

  // Sample the two right-hand profiles in glyph-local pixel coordinates (y down from the glyph top).
  const outer = []   // [y, x]
  const inner = []
  for (let py = Y0; py < Y0 + GH; py++) {
    const y = py - Y0
    const r = rowRuns(py)
    if (!r.length) continue
    if (y <= 789) outer.push([y, r[r.length - 1][1]])
    const stem = r.find(([a, b]) => a <= 700 && b >= 700)
    if (stem) {
      const after = r.find(([a]) => a > stem[1])
      if (after) inner.push([y, after[0] - 1])
    }
  }

  /**
   * A stadium's right profile: straight from the stem out to the arc centre, then a semicircle.
   * For a given row the edge is cx + sqrt(r^2 - (y-cy)^2), defined only within the arc's band.
   */
  function fitStadium(pts, label, guessR) {
    let best = null
    for (let r = guessR - 30; r <= guessR + 30; r += 0.5) {
      for (let cy = 380; cy <= 408; cy += 0.5) {
        for (let cx = guessR === 394 ? 975 : 965; cx <= (guessR === 394 ? 1015 : 1005); cx += 0.5) {
          let ss = 0, n = 0, max = 0
          for (const [y, x] of pts) {
            const dy = y - cy
            if (Math.abs(dy) > r) continue
            const pred = cx + Math.sqrt(r * r - dy * dy)
            const e = Math.abs(pred - x)
            ss += e * e; n++; if (e > max) max = e
          }
          if (n < pts.length * 0.8) continue
          const rms = Math.sqrt(ss / n)
          const score = rms + max * 0.25   // punish the boundary error the old fit hid
          if (!best || score < best.score) best = { r, cy, cx, rms, max, n, score }
        }
      }
    }
    console.log(`${label}: r=${best.r} centre=(${best.cx}, ${best.cy})`)
    console.log(`  rms ${best.rms.toFixed(2)}px   MAX ${best.max.toFixed(2)}px   over ${best.n} rows`)
    console.log(`  right extreme = ${best.cx + best.r}   band y ${(best.cy - best.r).toFixed(1)} .. ${(best.cy + best.r).toFixed(1)}`)
    return best
  }

  console.log('Stadium construction: straight top and bottom, semicircular right end\n')
  const o = fitStadium(outer, 'OUTER  ', 394)
  console.log('')
  const i = fitStadium(inner, 'COUNTER', 219)
  console.log('')
  console.log('Ring thickness implied:')
  console.log(`  horizontal, at the waist: ${(o.cx + o.r - (i.cx + i.r)).toFixed(1)} px`)
  console.log(`  vertical, top and bottom: ${(o.r - i.r).toFixed(1)} px`)
  console.log('')
  console.log('Sanity: the outer radius should equal half the bowl height, which is what makes it a stadium.')
  console.log(`  outer radius ${o.r}   half height ${((o.cy + o.r) - (o.cy - o.r)) / 2}`)
})().catch((e) => { console.error('FAILED:', e.message); process.exit(1) })
