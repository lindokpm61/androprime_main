/*
 * Andro Prime — the Interlocked AP logo build.
 *
 *   node gen-logo.js                  # masters + component path data, default face
 *   node gen-logo.js --face archivo   # archivo | figtree | source
 *   node gen-logo.js --variants       # the approved sheet redrawn, one per wordmark face
 *   node gen-logo.js --compare        # the same lockups as a legibility ladder, 52 / 22 / 14 px
 *   node gen-logo.js --verify         # raster the mark against SOURCE-mark-only.png
 *   node gen-logo.js --ref            # draw at the REFERENCE weights, for the verify diff
 *
 * THIS REPLACES `gen-component.js`, which `logoArt.ts` still names in its header and which is not
 * in the repo. A logo that cannot be regenerated drifts, and this one already did: the site has
 * been in a mixed state since 2026-08-30 (new mark in the browser tab, old mark in the page header)
 * partly because the only route from "approved mark" to "shipped component" was a script nobody has.
 *
 * ── WHERE THE NUMBERS COME FROM ──────────────────────────────────────────────────────────────
 * Every constant is MEASURED off `SOURCE-mark-only.png`, the raster Keith approved on 2026-08-30,
 * by `measure-source.js` and `fit-bowl.js`. Nothing was chosen by eye. Re-run those two to
 * re-derive them.
 *
 * Geometry is in SOURCE PIXELS with y measured down from the glyph's top, because the bowl contains
 * true circular arcs and a circle is only a circle in a square-pixel space. The earlier draft
 * worked in a space that normalised x and y independently, which quietly turns every circle into an
 * ellipse.
 *
 * ── THE BOWL IS A STADIUM, AND GETTING THAT WRONG WAS THE ONE REAL TRAP ───────────────────────
 * A superellipse fitted the bowl with an rms residual of 8.9px on a 1392px glyph, which reads like
 * a good fit and is wrong. A superellipse has poles: at the top of the bowl it forces the outer
 * edge back to the stem, width zero, where the reference measures 0.7320 — 184px of missing ink.
 * The rms hid it because the error lives on a few rows out of 728 and averaging is precisely the
 * operation that makes a boundary error small. It surfaced only when the mark was rendered and the
 * bowl came out visibly rounder than the approved one.
 *
 * The real construction is a STADIUM: straight horizontal top and bottom from the stem, then a true
 * semicircle whose radius equals half the bowl's height. Fitted, it lands at rms 0.64px and a
 * maximum of 3.75px across the whole profile, so it is the construction rather than an
 * approximation of one. Drawn here with SVG arc commands, so it is exact at any size.
 *
 * ── THE ONE DELIBERATE DEPARTURE: WEIGHT ─────────────────────────────────────────────────────
 * `README.md` records that this mark "was the lightest of the four that survived 16px" and "needs
 * more weight than the reference shows before it is safe on a busy tab strip". Measured reference
 * strokes, in source px:
 *
 *     stem 209 · diagonal 200 · bowl waist 181 · bowl top+bottom 174 · crossbar 171
 *
 * The bowl, which is the largest shape on the mark, carries the lightest strokes, so the whole
 * thing reads light. The redraw resolves everything to one vertical weight and one horizontal
 * weight and raises both. Horizontals sit at 86% of verticals, the normal optical correction: a
 * horizontal of equal measure looks heavier than a vertical.
 *
 * THE OUTER SILHOUETTE IS UNTOUCHED. Weight is added inwards, so this is the same mark. Two
 * consequences worth knowing:
 *   - The A's counter narrows at its base. It is a tapering triangle whose base is its widest
 *     point, so it stays open; `--verify` reports the figure.
 *   - The diagonal thickens LEFTWARDS, away from that counter, which pushes the glyph's left edge
 *     out and takes the aspect from 1.224 to about 1.249. The bounding box is computed from the
 *     drawn geometry rather than assumed.
 *
 * ── WHAT FALLS OUT FOR FREE ──────────────────────────────────────────────────────────────────
 * Unifying the horizontal stroke makes the A's crossbar and the bowl's bottom stroke the same band:
 * both run from the counter's bottom to the bowl's outer bottom. In the reference they sat at 597
 * and 591, a 6px misalignment that is generative-model slop rather than design. The redraw aligns
 * them exactly, which is the kind of tightening a hand-drawn master exists to do.
 *
 * ── SOURCE-mark-only.png IS CLIPPED, AND THE SHIPPED ICONS INHERIT IT ────────────────────────
 * `README.md` describes `SOURCE-mark-only.png` as "the mark cropped to its own bounds and squared".
 * It is not: it is the approved mark with 60px cut off the foot of the stem. Measured against the
 * big mark on `SOURCE-approved-2026-08-30.png`, which Keith confirmed on 2026-09-02 is THE approved
 * source, every other landmark is identical to the pixel — stem x 627..835, counter bottom y 613,
 * diagonal baseline y 985, bowl height 614 — and only the stem's foot differs, 1196 against 1136.
 * The descender is 5% short, and on a mark whose whole idea is a P stem dropping past the bowl that
 * is a proportion, not a rounding error.
 *
 * The geometry here therefore reads from the SHEET, and `--verify` diffs against the sheet's mark.
 * ⚠ `build-icons.js` still sources the clipped file, so the favicon, app icon and PWA icons that
 * shipped on 2026-08-30 all carry the short stem, and so did the 16px gate that chose this concept.
 *
 * ── THE SLOT IS REAL AND IS KEPT ─────────────────────────────────────────────────────────────
 * The crossbar does NOT touch the diagonal: there is a ~49px white slot, its left edge cut parallel
 * to the diagonal. That was checked against a magnified crop before being drawn, because a
 * measurement that surprising is usually a bug in the measuring. It is in the approved artwork.
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const HERE = __dirname
const FONTS = path.join(HERE, 'fonts')
const OUT = path.join(HERE, 'out')

/* ── measured geometry, in source px, y down from the glyph top ─────────────────────────────
 * Glyph box in the reference: x 0..1391, y 0..1136 (the source's y 128..1264).            */
const REF = {
  GW: 1392,
  GH: 1197,             // the APPROVED SHEET's glyph height; see the SOURCE-mark-only warning below
  stemR: 835,          // right edge of the shared stem; the bowl springs from here
  bowlCy: 395,         // centre of both bowl arcs
  bowlR: 395,          // outer radius; equals half the bowl height, which is what makes it a stadium
  maxX: 1391,          // outer extreme; bowlCx = maxX - bowlR
  diagSlopePx: -0.49541, // dx/dy of the A's leg, in square pixels
  diagRightAt0: 710.7, // the leg's right edge at the glyph top; this edge does not move
  diagBase: 985.8,     // y at which the leg's baseline sits; below it only the stem runs
  slot: 49.4,          // white gap between the leg's right edge and the crossbar's left edge
  glyphH: 1196,        // the stem's foot, and the glyph's full height. NOT 1136: see below
  // reference stroke weights, for the report and for --ref
  ref: { V: 209, Vdiag: 200, waist: 181, horiz: 174, crossbar: 171 },
}

/* ── production weight ─────────────────────────────────────────────────────────────────────── */
const WEIGHT = { V: 224, hRatio: 0.86 }
WEIGHT.H = Math.round(WEIGHT.V * WEIGHT.hRatio)   // 193

/* ── lockup proportions, measured off the approved lockup in SOURCE-approved-2026-08-30.png ── */
const LOCKUP = {
  markPerCap: 1.5083,       // mark height as a multiple of the wordmark's cap height
  gapPerCap: 0.3333,        // clear space between mark and wordmark
  markTopAboveCap: 0.3500,  // how far the mark's top rises above the cap line
}

const f = (v) => Number(v.toFixed(3))

/**
 * Build the mark in source-pixel space.
 * `useRef` draws at the reference's own (uneven) weights, which is what --verify diffs.
 */
function buildMark({ useRef = false } = {}) {
  const R = REF
  const V = useRef ? R.ref.V : WEIGHT.V
  const H = useRef ? R.ref.horiz : WEIGHT.H
  const waist = useRef ? R.ref.waist : WEIGHT.V
  const vDiag = useRef ? R.ref.Vdiag : WEIGHT.V

  const stemR = R.stemR
  const stemL = stemR - V

  // Bowl: outer stadium fixed, counter carries the weight.
  const bowlCx = R.maxX - R.bowlR
  const bowlTop = R.bowlCy - R.bowlR          // 0
  const bowlBot = R.bowlCy + R.bowlR          // 790
  const rIn = R.bowlR - H
  const counterRight = R.maxX - waist
  const counterCx = counterRight - rIn
  const counterTop = R.bowlCy - rIn
  const counterBot = R.bowlCy + rIn

  // Diagonal: right edge pinned, thickens leftwards away from the A's counter.
  const theta = Math.atan(-R.diagSlopePx)
  const diagW = vDiag / Math.cos(theta)
  const dRight = (y) => R.diagRightAt0 + R.diagSlopePx * y
  const dLeft = (y) => dRight(y) - diagW

  // Crossbar: exactly the bowl's bottom stroke, which is what unifying H buys.
  const barTop = useRef ? 591 : counterBot
  const barBot = bowlBot

  const sub = []

  // 1. the A's leg
  sub.push(
    `M${f(dLeft(0))} 0L${f(dRight(0))} 0` +
    `L${f(dRight(R.diagBase))} ${f(R.diagBase)}L${f(dLeft(R.diagBase))} ${f(R.diagBase)}Z`
  )
  // 2. the shared stem
  sub.push(`M${f(stemL)} 0L${f(stemR)} 0L${f(stemR)} ${f(R.glyphH)}L${f(stemL)} ${f(R.glyphH)}Z`)
  // 3. the bowl's outer wall, clockwise. Two quarter arcs rather than one semicircle: a 180 degree
  //    arc has diametrically opposite endpoints, which makes the large-arc flag ambiguous.
  sub.push(
    `M${f(stemR)} ${f(bowlTop)}L${f(bowlCx)} ${f(bowlTop)}` +
    `A${f(R.bowlR)} ${f(R.bowlR)} 0 0 1 ${f(R.maxX)} ${f(R.bowlCy)}` +
    `A${f(R.bowlR)} ${f(R.bowlR)} 0 0 1 ${f(bowlCx)} ${f(bowlBot)}` +
    `L${f(stemR)} ${f(bowlBot)}Z`
  )
  // 4. the counter, wound the other way so nonzero fill knocks it out
  sub.push(
    `M${f(stemR)} ${f(counterBot)}L${f(counterCx)} ${f(counterBot)}` +
    `A${f(rIn)} ${f(rIn)} 0 0 0 ${f(counterRight)} ${f(R.bowlCy)}` +
    `A${f(rIn)} ${f(rIn)} 0 0 0 ${f(counterCx)} ${f(counterTop)}` +
    `L${f(stemR)} ${f(counterTop)}Z`
  )
  // 5. the crossbar, left edge cut parallel to the leg
  sub.push(
    `M${f(dRight(barTop) + R.slot)} ${f(barTop)}L${f(stemL)} ${f(barTop)}` +
    `L${f(stemL)} ${f(barBot)}L${f(dRight(barBot) + R.slot)} ${f(barBot)}Z`
  )

  const minX = dLeft(R.diagBase)
  const box = { minX, maxX: R.maxX, minY: 0, maxY: R.glyphH }
  return {
    d: sub.join(''),
    box,
    aspect: (box.maxX - box.minX) / R.glyphH,
    strokes: { stem: V, diagonal: vDiag, bowlWaist: waist, bowlHoriz: H, crossbar: Math.round(barBot - barTop) },
    counters: {
      pW: Math.round(counterRight - stemR),
      pH: Math.round(counterBot - counterTop),
      aBase: Math.round(stemL - dRight(barTop)),
    },
  }
}

/** Re-express the mark in a box `H` units tall, bounding box at the origin. */
function markPathAt(mark, H) {
  const s = H / (mark.box.maxY - mark.box.minY)
  const ox = -mark.box.minX * s
  // Arc radii must scale too, so rewrite every number pair AND the two radii in each A command.
  let out = mark.d
  out = out.replace(/A([\d.]+) ([\d.]+) 0 0 ([01]) ([-\d.]+) ([-\d.]+)/g,
    (_, rx, ry, sw, x, y) =>
      `A${f(parseFloat(rx) * s)} ${f(parseFloat(ry) * s)} 0 0 ${sw} ${f(parseFloat(x) * s + ox)} ${f(parseFloat(y) * s)}`)
  out = out.replace(/([ML])([-\d.]+) ([-\d.]+)/g,
    (_, cmd, x, y) => `${cmd}${f(parseFloat(x) * s + ox)} ${f(parseFloat(y) * s)}`)
  return { d: out, width: (mark.box.maxX - mark.box.minX) * s, height: H }
}

// ── wordmark ────────────────────────────────────────────────────────────────────────────────
const FACES = {
  archivo: { file: 'ArchivoBlack-Regular.ttf', weight: 900, label: 'Archivo Black' },
  figtree: { file: 'Figtree.ttf', weight: 900, label: 'Figtree Black' },
  source: { file: 'SourceSans3.ttf', weight: 900, label: 'Source Sans 3 Black' },
}

/**
 * Outline the wordmark, ALREADY PLACED. The transform goes to Python rather than being applied to
 * the returned string, because SVGPathPen emits H and V shorthand and implicit linetos, so path
 * data is not a flat list of coordinate pairs. Rewriting it here by pattern-matching pairs pairs an
 * H's single x with the next command's y; the whole wordmark rendered as a black smear before this
 * was moved. Never post-process foreign path data you did not emit.
 */
function wordmark(faceKey, { text = 'ANDRO PRIME', tracking = 0, scale = 1, dx = 0, dy = 0 } = {}) {
  const face = FACES[faceKey]
  if (!face) throw new Error(`unknown face "${faceKey}" (have: ${Object.keys(FACES).join(', ')})`)
  const fontPath = path.join(FONTS, face.file)
  if (!fs.existsSync(fontPath)) throw new Error(`missing ${fontPath}; run fetch-fonts.sh`)
  const raw = execFileSync('python', [
    path.join(HERE, 'outline-wordmark.py'),
    '--font', fontPath, '--text', text,
    '--weight', String(face.weight), '--tracking', String(tracking),
    '--post-scale', String(scale), '--dx', String(dx), '--dy', String(dy),
  ], { encoding: 'utf8', cwd: HERE })
  return { ...JSON.parse(raw), label: face.label, key: faceKey }
}

function buildLockup(mark, faceKey, H = 100) {
  const cap = H / LOCKUP.markPerCap
  const mk = markPathAt(mark, H)
  const baseline = LOCKUP.markTopAboveCap * cap + cap
  const gap = LOCKUP.gapPerCap * cap
  const word = wordmark(faceKey, { scale: cap / 1000, dx: mk.width + gap, dy: baseline })
  return {
    markD: mk.d, wordD: word.path,
    width: mk.width + gap + word.advanceFinal,
    height: H, face: word.label, faceKey, cap,
  }
}

const svg = (vb, body) => {
  const [, , w, h] = vb.split(' ')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">\n${body}\n</svg>\n`
}
const HEADER = (what) =>
  `<!-- Andro Prime — ${what}.\n     Generated by 02_brand/assets/logos/interlocked-ap/gen-logo.js.\n` +
  `     Do not hand-edit path data: re-run the generator. -->\n`

function writeMasters(faceKey) {
  fs.mkdirSync(OUT, { recursive: true })
  const mark = buildMark()
  const ico = markPathAt(mark, 1000)
  const iconVb = `0 0 ${f(ico.width)} 1000`
  fs.writeFileSync(path.join(OUT, 'icon.svg'),
    HEADER('the Interlocked AP mark, no container, inheriting colour') +
    svg(iconVb, `  <path d="${ico.d}" fill="currentColor" fill-rule="nonzero"/>`))

  const lk = buildLockup(mark, faceKey, 100)
  const lkVb = `0 0 ${f(lk.width)} 100`
  for (const [name, ink, where] of [
    ['lockup-light.svg', '#000000', 'for light grounds'],
    ['lockup-dark.svg', '#ffffff', 'for dark grounds'],
  ]) {
    fs.writeFileSync(path.join(OUT, name),
      HEADER(`the Interlocked AP lockup, ${where} (${lk.face})`) +
      svg(lkVb,
        `  <path d="${lk.markD}" fill="${ink}" fill-rule="nonzero"/>\n` +
        `  <path d="${lk.wordD}" fill="${ink}" fill-rule="nonzero"/>`))
  }

  fs.writeFileSync(path.join(OUT, 'logoArt.data.json'), JSON.stringify({
    generatedBy: 'gen-logo.js', face: lk.face, faceKey: lk.faceKey,
    mark: { d: ico.d, viewBox: iconVb, width: Number(f(ico.width)), height: 1000 },
    lockup: { markD: lk.markD, wordD: lk.wordD, viewBox: lkVb, width: Number(f(lk.width)), height: 100, cap: Number(f(lk.cap)) },
  }, null, 2) + '\n')
  return { mark, lk, iconVb, lkVb }
}

function report(mark) {
  const r = REF.ref
  console.log('MARK, redrawn from the measured reference')
  console.log(`  aspect w/h   ${mark.aspect.toFixed(4)}   (reference 1.2243)`)
  console.log('  strokes, source px      now   was')
  console.log(`    stem                  ${String(mark.strokes.stem).padStart(4)}  ${String(r.V).padStart(4)}`)
  console.log(`    diagonal              ${String(mark.strokes.diagonal).padStart(4)}  ${String(r.Vdiag).padStart(4)}`)
  console.log(`    bowl waist            ${String(mark.strokes.bowlWaist).padStart(4)}  ${String(r.waist).padStart(4)}`)
  console.log(`    bowl top and bottom   ${String(mark.strokes.bowlHoriz).padStart(4)}  ${String(r.horiz).padStart(4)}`)
  console.log(`    crossbar              ${String(mark.strokes.crossbar).padStart(4)}  ${String(r.crossbar).padStart(4)}`)
  console.log('  counters, source px')
  console.log(`    P counter   ${mark.counters.pW} x ${mark.counters.pH}   (reference 375 x 444)`)
  console.log(`    A counter base ${mark.counters.aBase}   (reference 223)`)
}

// ── entry ───────────────────────────────────────────────────────────────────────────────────
module.exports = { buildMark, buildLockup, markPathAt, wordmark, writeMasters, FACES, REF, LOCKUP, svg, HEADER }

if (require.main === module) {
  const argv = process.argv.slice(2)
  const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d }
  if (argv.includes('--variants')) require(path.join(HERE, 'variant-sheets.js'))
  else if (argv.includes('--compare')) require(path.join(HERE, 'compare-faces.js'))
  else if (argv.includes('--verify')) require(path.join(HERE, 'verify-mark.js'))
  else {
    const { mark, lk, lkVb } = writeMasters(arg('--face', 'archivo'))
    report(mark)
    console.log('')
    console.log(`LOCKUP, ${lk.face}`)
    console.log(`  viewBox ${lkVb}   cap height ${lk.cap.toFixed(2)} of 100`)
    console.log('')
    console.log('WROTE to ./out: icon.svg, lockup-light.svg, lockup-dark.svg, logoArt.data.json')
    console.log('(out/ is gitignored: install into the app only once the face is settled)')
  }
}
