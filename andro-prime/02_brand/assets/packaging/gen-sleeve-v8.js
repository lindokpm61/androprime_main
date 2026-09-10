#!/usr/bin/env node
/**
 * gen-sleeve-v8.js — Andro Prime kit sleeves, built to Vitall's cutter templates.
 *
 * v8 exists because v7b was drawn to an ASSUMED fold line. Vitall's `.eps` carried no
 * crease layer, so v7b halved the 304 mm flat into two 152 mm faces. The real cutter
 * templates (assets/packaging/dieline/) show panels of 122 / 23 / 122 / 22 with a 23 mm
 * SPINE panel between the faces, so each face is 169 x 122 mm. v7b's face was 30 mm too
 * tall and 10 mm too wide, and everything drawn from it inherited that.
 *
 * Everything below is in MILLIMETRES. The SVG user unit IS 1 mm.
 *
 *   node gen-sleeve-v8.js            # writes the HTML for every carton x palette
 *
 * Two outputs per combination:
 *   *-proof.html   dimension callouts, crease lines, die line, bleed guides  (for us)
 *   *-print.html   artwork only, bleeding to the page edge                   (for Mega-Pak)
 */
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const LOGO = path.join(HERE, '..', 'logos', 'interlocked-ap');

// ---------------------------------------------------------------- brand marks
const iconSvg = fs.readFileSync(path.join(LOGO, 'icon.svg'), 'utf8');
const ICON_D = iconSvg.match(/<path[^>]*\sd="([^"]+)"/)[1];
const ICON_VB = '0 0 1186.168 1000';
const ICON_AR = 1186.168 / 1000;

const lockup = fs.readFileSync(path.join(LOGO, 'lockup-light.svg'), 'utf8');
const WORD_D = [...lockup.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1])[1];
const WX = 140.71, WY = 23.2, WW = 931.892 - 140.71, WH = 89.51 - 23.2;
const WORD_AR = WW / WH; // 11.9316

// ---------------------------------------------------------------- cartons
const CARTONS = {
  capillary: {
    label: 'Capillary Test Kit', file: 'Capillary Test Kit Artwork for Window 169x122x23mm.pdf',
    W: 169, H: 304, tab: 15, face: 122, spine: 23, tuck: 22,
    aperture: { w: 118, h: 67, r: 5, fromLeftOfBack: 24.09 },
  },
  tasso: {
    label: 'IVI Tasso Kit', file: 'IVI_Tasso_Kit.pdf',
    W: 178, H: 400, tab: 7, face: 144, spine: 53, tuck: 52,
    aperture: null,
  },
};

const BLEED = 5; // Vitall: "leave a 5mm artwork bleed around edge of sleeve and inside aperture"

const PALETTES = {
  purewhite: { id: 'purewhite', label: 'pure white board', paper: '#FFFFFF', ink: '#000000', muted: '#8a8a8a' },
  warmwhite: { id: 'warmwhite', label: 'warm white board', paper: '#F4F1EA', ink: '#141414', muted: '#8f897d' },
};

// ---------------------------------------------------------------- kits
const KITS = [
  { ref: 'AP-T01', eyebrow: 'AT-HOME BLOOD TEST · TESTOSTERONE', title: 'Testosterone',
    sub: 'Find out if testosterone is the cause.',
    markers: [['TESTOSTERONE', 'NMOL/L'], ['FREE TESTOSTERONE', 'PMOL/L'], ['SHBG', 'NMOL/L'],
      ['FREE ANDROGEN INDEX', 'INDEX'], ['ALBUMIN', 'G/L']] },
  { ref: 'AP-E02', eyebrow: 'AT-HOME BLOOD TEST · ENERGY & RECOVERY', title: 'Energy & Recovery',
    sub: 'Your levels, not your programme.',
    markers: [['VITAMIN D', 'NMOL/L'], ['ACTIVE B12', 'PMOL/L'], ['HS-CRP', 'MG/L'], ['FERRITIN', 'µG/L']] },
  { ref: 'AP-H03', eyebrow: 'AT-HOME BLOOD TEST · NINE MARKERS', title: 'Hormone & Recovery',
    sub: 'Nine markers. Hormones and recovery in one panel.',
    markers: [['TESTOSTERONE', 'NMOL/L'], ['FREE TESTOSTERONE', 'PMOL/L'], ['SHBG', 'NMOL/L'],
      ['FREE ANDROGEN INDEX', 'INDEX'], ['ALBUMIN', 'G/L'], ['VITAMIN D', 'NMOL/L'],
      ['ACTIVE B12', 'PMOL/L'], ['HS-CRP', 'MG/L'], ['FERRITIN', 'µG/L']] },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const n = (v) => Number(v.toFixed(3));

// ---------------------------------------------------------------- front panel
function frontPanel(kit, c) {
  const W = c.W, H = c.face;
  const CH = 23;                    // black channel, matches the box depth
  const L = CH + 10;                // type left edge
  const R = W - 12;                 // type right edge
  const o = [];

  o.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="var(--paper)"/>`);
  o.push(`<rect x="0" y="0" width="${CH}" height="${H}" fill="var(--ink)"/>`);

  // wordmark up the channel
  const wmH = 7.4, wmL = n(wmH * WORD_AR);
  const wmY = n(H - (H - wmL) / 2), wmX = n((CH - wmH) / 2);
  o.push(`<g transform="translate(${wmX},${wmY}) rotate(-90)"><use href="#wordmark" width="${wmL}" height="${wmH}" style="color:var(--paper)"/></g>`);

  // mark
  const mkH = 10;
  o.push(`<use href="#mark" x="${L}" y="9" width="${n(mkH * ICON_AR)}" height="${mkH}" style="color:var(--ink)"/>`);

  const rule = (y, w) => `<line x1="${L}" y1="${y}" x2="${R}" y2="${y}" stroke="var(--ink)" stroke-width="${w}"/>`;
  o.push(rule(27.5, 0.25));
  o.push(`<text x="${L}" y="32.4" class="mono" font-size="2.5" letter-spacing="0.32">${esc(kit.eyebrow)}</text>`);
  o.push(`<text x="${L}" y="43.6" class="serif" font-size="9.2">${esc(kit.title)}</text>`);
  o.push(`<text x="${L}" y="49.8" class="sans" font-size="3.1" opacity="0.75">${esc(kit.sub)}</text>`);
  o.push(rule(54.5, 0.25));

  // markers: the band is fixed, the pitch adapts so 4 and 9 both sit correctly
  const top = 54.5, bot = 97, count = kit.markers.length;
  const pitch = (bot - top) / count;
  const fs = Math.min(2.7, pitch * 0.46);
  kit.markers.forEach(([name, unit], i) => {
    const base = n(top + pitch * (i + 1) - pitch * 0.32);
    o.push(`<text x="${L}" y="${base}" class="mono" font-size="${n(fs)}" letter-spacing="0.1">${esc(name)}</text>`);
    o.push(`<text x="${R}" y="${base}" class="mono" font-size="${n(fs)}" font-weight="700" text-anchor="end">${esc(unit)}</text>`);
    o.push(rule(n(top + pitch * (i + 1)), 0.18));
  });

  o.push(rule(101.5, 0.25));
  o.push(`<text x="${L}" y="106.2" class="mono" font-size="2.6" font-weight="700" letter-spacing="0.2">ANALYSED IN A UKAS-ACCREDITED UK LABORATORY</text>`);
  o.push(`<rect x="${L}" y="110.4" width="7.6" height="4.6" fill="none" stroke="var(--ink)" stroke-width="0.22"/>`);
  o.push(`<text x="${n(L + 3.8)}" y="113.7" class="mono" font-size="2.3" font-weight="700" text-anchor="middle">IVD</text>`);
  o.push(`<text x="${n(L + 9.6)}" y="113.7" class="mono" font-size="2.3" letter-spacing="0.16">CE · UKCA</text>`);
  o.push(`<text x="${n(L + 35)}" y="113.7" class="mono" font-size="2.1" letter-spacing="0.14" fill="var(--muted)">REF · ${kit.ref}</text>`);
  o.push(`<text x="${R}" y="113.7" class="mono" font-size="2.9" font-weight="700" letter-spacing="0.3" text-anchor="end">ANDRO-PRIME.COM</text>`);
  return o.join('\n      ');
}

// ---------------------------------------------------------------- spine panel
function spinePanel(c) {
  const W = c.W, H = c.spine;
  const wmH = Math.min(7, H * 0.42), wmL = n(wmH * WORD_AR);
  return [
    `<rect x="0" y="0" width="${W}" height="${H}" fill="var(--ink)"/>`,
    `<use href="#wordmark" x="${n((W - wmL) / 2)}" y="${n((H - wmH) / 2)}" width="${wmL}" height="${wmH}" style="color:var(--paper)"/>`,
  ].join('\n      ');
}

// ---------------------------------------------------------------- back panel
function backPanel(kit, c, proof) {
  const W = c.W, H = c.face, o = [];
  // The channel sits on the RIGHT of the back so that after the 180° flat rotation it
  // lands on the same physical edge as the front's. Type must therefore stop clear of it.
  const CH = 23;
  const L = 12, R = W - CH - 10;
  o.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="var(--paper)"/>`);
  o.push(`<rect x="${W - CH}" y="0" width="${CH}" height="${H}" fill="var(--ink)"/>`);

  const wmH = 7.4, wmL = n(wmH * WORD_AR);
  o.push(`<g transform="translate(${n(W - 23 + (23 - wmH) / 2)},${n(H - (H - wmL) / 2)}) rotate(-90)"><use href="#wordmark" width="${wmL}" height="${wmH}" style="color:var(--paper)"/></g>`);

  const mkH = 8;
  o.push(`<use href="#mark" x="${L}" y="9" width="${n(mkH * ICON_AR)}" height="${mkH}" style="color:var(--ink)"/>`);
  o.push(`<text x="${n(L + mkH * ICON_AR + 4)}" y="15.2" class="mono" font-size="2.6" font-weight="700" letter-spacing="0.22">SEE YOUR RESULTS AT ANDRO-PRIME.COM</text>`);
  o.push(`<text x="${n(L + mkH * ICON_AR + 4)}" y="19.6" class="sans" font-size="2.5" opacity="0.75">Your kit is already linked to you. Nothing to register.</text>`);

  if (c.aperture) {
    const a = c.aperture;
    const ax = a.fromLeftOfBack, ay = n((H - a.h) / 2);
    if (proof) o.push(`<rect x="${n(ax + BLEED)}" y="${n(ay + BLEED)}" width="${n(a.w - BLEED * 2)}" height="${n(a.h - BLEED * 2)}" rx="${Math.max(0, a.r - BLEED)}" ry="${Math.max(0, a.r - BLEED)}" fill="#f0f0f0"/>`);
    // Every aperture guide is PROOF-ONLY. On the print file the board simply runs through
    // the hole, which is what "5 mm artwork bleed inside aperture" asks for; the die is
    // Vitall's existing tool, so drawing it as artwork would print a magenta line.
    if (proof) o.push(`<rect class="dieline" x="${ax}" y="${ay}" width="${a.w}" height="${a.h}" rx="${a.r}" ry="${a.r}" fill="none"/>`);
    if (proof) o.push(`<rect class="bleedline" x="${n(ax + BLEED)}" y="${n(ay + BLEED)}" width="${n(a.w - BLEED * 2)}" height="${n(a.h - BLEED * 2)}" rx="${Math.max(0, a.r - BLEED)}" ry="${Math.max(0, a.r - BLEED)}" fill="none"/>`);
    if (proof) o.push(`<text class="marks" x="${n(ax + a.w / 2)}" y="${n(ay - 2.4)}" font-size="2.2" text-anchor="middle">DIE-CUT APERTURE ${a.w} × ${a.h} mm · r${a.r} · ARTWORK BLEEDS 5 mm IN</text>`);
  }

  // Below the aperture there are only ~27.5 mm before the IVD row. Four stacked lines
  // overran it, so the regulatory block runs in TWO columns.
  const by = c.aperture ? n((H + c.aperture.h) / 2) + 6 : 44;
  const colL = [
    'In-vitro diagnostic for self-collection.',
    'Read the enclosed instruction sheet before use.',
  ];
  const colR = [
    'Distributed by Andro Prime Ltd (Co. 17185839), UK.',
    'Analysed in a UKAS-accredited UK laboratory. Store below 25°C.',
  ];
  const colRx = n(L + (R - L) * 0.46);
  colL.forEach((t, i) => o.push(`<text x="${L}" y="${n(by + i * 3.6)}" class="sans" font-size="2.35">${esc(t)}</text>`));
  colR.forEach((t, i) => o.push(`<text x="${colRx}" y="${n(by + i * 3.6)}" class="sans" font-size="2.35">${esc(t)}</text>`));
  o.push(`<text x="${L}" y="${n(by + 2 * 3.6)}" class="sans" font-size="2.35">Do not use if the pouch is damaged.</text>`);

  o.push(`<rect x="${L}" y="110.4" width="7.6" height="4.6" fill="none" stroke="var(--ink)" stroke-width="0.22"/>`);
  o.push(`<text x="${n(L + 3.8)}" y="113.7" class="mono" font-size="2.3" font-weight="700" text-anchor="middle">IVD</text>`);
  o.push(`<text x="${n(L + 9.6)}" y="113.7" class="mono" font-size="2.3" letter-spacing="0.16">CE · UKCA</text>`);
  o.push(`<text x="${n(L + 35)}" y="113.7" class="mono" font-size="2.1" letter-spacing="0.14" fill="var(--muted)">REF · ${kit.ref}</text>`);
  o.push(`<text x="${R}" y="113.7" class="mono" font-size="2.9" font-weight="700" letter-spacing="0.3" text-anchor="end">ANDRO-PRIME.COM</text>`);
  return o.join('\n      ');
}

// ---------------------------------------------------------------- a page
function page(kit, c, pal, proof) {
  const PW = c.W + BLEED * 2, PH = c.H + BLEED * 2;
  const x0 = BLEED, y0 = BLEED;
  const yTab = y0, yBack = y0 + c.tab, ySpine = yBack + c.face, yFront = ySpine + c.spine, yTuck = yFront + c.face;
  const o = [];

  o.push(`<rect x="0" y="0" width="${PW}" height="${PH}" fill="var(--paper)"/>`);
  o.push(`<rect x="${x0}" y="${yTab}" width="${c.W}" height="${c.tab}" fill="var(--paper)"/>`);

  // BACK, rotated 180: the spine wraps the box's top edge, so this face reads inverted in the flat
  o.push(`<g transform="translate(${x0},${yBack}) rotate(180,${c.W / 2},${c.face / 2})">
      ${backPanel(kit, c, proof)}
    </g>`);
  o.push(`<g transform="translate(${x0},${ySpine})">
      ${spinePanel(c)}
    </g>`);
  o.push(`<g transform="translate(${x0},${yFront})">
      ${frontPanel(kit, c)}
    </g>`);

  if (proof) {
    o.push(`<rect class="trim" x="${x0}" y="${y0}" width="${c.W}" height="${c.H}" fill="none"/>`);
    [yBack, ySpine, yFront, yTuck].forEach((y) =>
      o.push(`<line class="crease" x1="${x0}" y1="${y}" x2="${x0 + c.W}" y2="${y}"/>`));
    const tag = (y, t) => `<text class="marks" x="${x0 + 2}" y="${y}" font-size="2.2">${esc(t)}</text>`;
    o.push(tag(yTab + 4, `GLUE TAB ${c.tab} mm`));
    o.push(tag(yBack + 4, `BACK ${c.W} × ${c.face} mm — ROTATED 180°`));
    o.push(tag(ySpine + 4, `SPINE ${c.W} × ${c.spine} mm`));
    o.push(tag(yFront + 4, `FRONT ${c.W} × ${c.face} mm`));
    o.push(tag(yTuck + 4, `TUCK ${c.W} × ${c.tuck} mm`));
    o.push(`<text class="marks" x="${x0}" y="${PH - 1.5}" font-size="2.2">${esc(kit.ref)} · ${c.label} · TRIM ${c.W} × ${c.H} + ${BLEED} BLEED · PANELS ${c.tab}/${c.face}/${c.spine}/${c.face}/${c.tuck} · TRUE SIZE</text>`);
  }
  return `<div class="page"><svg class="pg" viewBox="0 0 ${PW} ${PH}" xmlns="http://www.w3.org/2000/svg">
      ${o.join('\n      ')}
    </svg></div>`;
}

// ---------------------------------------------------------------- document
function doc(c, pal, proof) {
  const PW = c.W + BLEED * 2, PH = c.H + BLEED * 2;
  const pages = KITS.map((k) => page(k, c, pal, proof)).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>Andro Prime sleeve v8 — ${esc(c.label)} — ${esc(pal.label)} — ${proof ? 'proof' : 'print'}</title>
<style>
  @page { size: ${PW}mm ${PH}mm; margin: 0; }
  html,body { margin:0; padding:0; background:#fff; }
  .page { width:${PW}mm; height:${PH}mm; page-break-after:always; position:relative; overflow:hidden; }
  svg.pg { display:block; width:${PW}mm; height:${PH}mm; }
  /* The real design faces, self-hosted so the PDF embeds THEM rather than silently
     falling back to Consolas / Arial / Georgia the way v7b did. All three are SIL OFL,
     so self-hosting and outlining are permitted. Run fetch-fonts.sh if fonts/ is empty. */
  @font-face { font-family:'Inter';          src:url('fonts/Inter.ttf') format('truetype');          font-weight:100 900; font-display:block; }
  @font-face { font-family:'JetBrains Mono'; src:url('fonts/JetBrainsMono.ttf') format('truetype');  font-weight:100 800; font-display:block; }
  @font-face { font-family:'Merriweather';   src:url('fonts/Merriweather.ttf') format('truetype');   font-weight:300 900; font-display:block; }
  :root { --paper:${pal.paper}; --ink:${pal.ink}; --muted:${pal.muted}; }
  .mono  { font-family:'JetBrains Mono',Consolas,monospace; fill:var(--ink); }
  .serif { font-family:'Merriweather',Georgia,serif; font-weight:700; fill:var(--ink); }
  .sans  { font-family:'Inter',Arial,Helvetica,sans-serif; fill:var(--ink); }
  .trim    { stroke:#00A0E1; stroke-width:0.2; stroke-dasharray:2 1.2; }
  .crease  { stroke:#F5D000; stroke-width:0.35; }
  .dieline { stroke:#E6007E; stroke-width:0.35; stroke-dasharray:2.4 1.4; }
  .bleedline { stroke:#E6007E; stroke-width:0.15; stroke-dasharray:1 1; opacity:0.55; }
  .dieband { }
  .marks   { font-family:Consolas,monospace; fill:#E6007E; }
</style></head><body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="mark" viewBox="${ICON_VB}"><path fill="currentColor" fill-rule="nonzero" d="${ICON_D}"/></symbol>
  <symbol id="wordmark" viewBox="0 0 ${n(WW)} ${n(WH)}"><path transform="translate(${-WX},${-WY})" fill="currentColor" d="${WORD_D}"/></symbol>
</svg>
${pages}
</body></html>`;
}

// ---------------------------------------------------------------- emit
let count = 0;
for (const c of Object.values(CARTONS)) {
  for (const pal of Object.values(PALETTES)) {
    for (const proof of [true, false]) {
      const name = `sleeve-v8-${c.W}x${c.H}-${pal.id}-${proof ? 'proof' : 'print'}.html`;
      fs.writeFileSync(path.join(HERE, name), doc(c, pal, proof));
      console.log('  wrote', name, `(page ${c.W + BLEED * 2} x ${c.H + BLEED * 2} mm)`);
      count++;
    }
  }
}
console.log(`\n${count} files. Panels — capillary ${CARTONS.capillary.tab}/${CARTONS.capillary.face}/${CARTONS.capillary.spine}/${CARTONS.capillary.face}/${CARTONS.capillary.tuck}, tasso ${CARTONS.tasso.tab}/${CARTONS.tasso.face}/${CARTONS.tasso.spine}/${CARTONS.tasso.face}/${CARTONS.tasso.tuck}`);
