/*
 * Carousel mock — Andro Prime
 * Source article: 14-signs-of-vitamin-d-deficiency.mdx (published, Ewa-reviewed)
 * Renders 1080x1350 (Instagram 4:5) slide HTML. Type is deterministic; only the
 * cover photo is generated. Brand tokens from 02_brand/visual-identity.md +
 * frontend/styles/tokens/{colours,typography}.css — black/white only, no radius,
 * no shadow, Inter 900 / Merriweather / JetBrains Mono.
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'slides');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const HANDLE = '@keith.antony.ai';
const DISCLAIMER = 'Education, not medical advice.';

/* Solid mark, dark variant (black square, white AP) — the correct variant on a
 * light background per 02_brand/visual-identity.md. Outlined paths, so it does
 * not depend on Inter being present. */
const LOGO_MARK = `<svg viewBox="0 0 100 100" width="132" height="132" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#000000"/>
  <path d="M30.885 59.597L28.957 66L19.156 66L30.199 32.545L42.614 32.545L53.656 66L43.855 66L41.928 59.597L30.885 59.597M32.943 52.801L39.869 52.801L36.537 41.759L36.276 41.759 M62.940 66L53.858 66L53.858 32.545L68.298 32.545Q72.023 32.545 74.816 34.016Q77.609 35.486 79.161 38.148Q80.713 40.811 80.713 44.372Q80.713 47.966 79.120 50.596Q77.528 53.226 74.661 54.647Q71.794 56.068 67.972 56.068L62.940 56.068L62.940 66M62.940 39.798L62.940 49.011L66.142 49.011Q67.743 49.011 68.878 48.448Q70.013 47.884 70.626 46.839Q71.239 45.793 71.239 44.372Q71.239 42.935 70.626 41.914Q70.013 40.893 68.878 40.346Q67.743 39.798 66.142 39.798" fill="#ffffff"/>
</svg>`;

/* ---------------------------------------------------------------- copy ---- */
/* Every list slide carries the qualifier from the article body. The article
 * says "signs aren't diagnoses ... suggestive, not diagnostic"; a slide read in
 * isolation must not drop that, which is where compressed copy sharpens a claim. */

const slides = [
  {
    type: 'cover',
    eyebrow: 'Vitamin D',
    headline: '14 signs of low vitamin D',
    sub: 'And the one most UK men miss.',
    /* The cover photo is chosen by hand, not generated per run: it is a fixed
     * base whose only per-article change is the printed headline. Currently
     * base-2 with the eyes opened. See README, "the headline swap is unsolved". */
    photo: 'cover-current-b2.jpg',
  },
  {
    type: 'statement',
    eyebrow: 'Start here',
    ghost: '',
    headline: 'Signs aren’t diagnoses.',
    body: 'They’re body-feel cues that turn up more often in men with low vitamin D. One on its own usually means very little. Three or four together is worth checking.',
  },
  {
    type: 'list',
    eyebrow: 'The list',
    ghost: '01',
    headline: 'Signs 01 to 04',
    items: [
      ['01', 'Tiredness that doesn’t shift with sleep'],
      ['02', 'Low mood through the dark months'],
      ['03', 'Slow recovery from training'],
      ['04', 'Bone ache you can’t pin on a session'],
    ],
    note: 'Suggestive, not diagnostic. One sign on its own means very little.',
  },
  {
    type: 'list',
    eyebrow: 'The list',
    ghost: '05',
    headline: 'Signs 05 to 09',
    items: [
      ['05', 'Muscle weakness in legs and arms'],
      ['06', 'More colds and flu than usual'],
      ['07', 'Lower back pain that creeps up'],
      ['08', 'Hair shedding above the seasonal norm'],
      ['09', 'Slow-healing cuts and grazes'],
    ],
    note: 'Suggestive, not diagnostic. One sign on its own means very little.',
  },
  {
    type: 'list',
    eyebrow: 'The list',
    ghost: '10',
    headline: 'Signs 10 to 13',
    items: [
      ['10', 'Joint stiffness, especially morning'],
      ['11', 'Headaches without obvious cause'],
      ['12', 'Concentration and mental fog'],
      ['13', 'Unrefreshing sleep'],
    ],
    note: 'Suggestive, not diagnostic. One sign on its own means very little.',
  },
  {
    type: 'statement',
    eyebrow: 'Sign 14',
    ghost: '14',
    headline: 'No signs at all.',
    body: 'Low vitamin D runs silent for years in most UK adult men. The signs above only get loud at the more severe end. That is the one most men miss.',
  },
  {
    type: 'statement',
    eyebrow: 'Why it matters',
    ghost: '',
    headline: 'October to March, UK sunlight is too weak.',
    body: 'At UK latitude the skin cannot make meaningful vitamin D through the dark half of the year. Indoor work, sunscreen and body composition compound it.',
    source: 'NHS · Royal Osteoporosis Society',
  },
  {
    type: 'cta',
    eyebrow: 'Find out',
    headline: 'Stop guessing. Get the number.',
    body: 'Vitamin D is one of the markers in our at-home blood test for UK men. Results explained in plain English.',
    link: 'andro-prime.com/test-selector',
  },
];

/* ------------------------------------------------------------------ css ---- */

const CSS = `
*{margin:0;padding:0;box-sizing:border-box;border-radius:0!important;box-shadow:none!important}
html,body{width:1080px;height:1350px;overflow:hidden}
body{
  font-family:'Inter',-apple-system,sans-serif;
  background:#000;color:#fff;
  display:flex;flex-direction:column;
  position:relative;
  /* greyscale AA — subpixel rendering puts colour fringes on the mono type,
     which is a visible defect once the PNG is posted */
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-rendering:geometricPrecision;
}
.slide{width:1080px;height:1350px;display:flex;flex-direction:column;padding:88px 84px 200px;position:relative;overflow:hidden}
.slide.invert{background:#fff;color:#000}
/* eyebrow+rule pin to the top; everything else centres in what is left, so a
   4-item slide and a 5-item slide both sit balanced */
.main{flex:1;display:flex;flex-direction:column;justify-content:center;z-index:2}

.eyebrow{
  font-family:'JetBrains Mono',monospace;font-weight:700;
  font-size:22px;letter-spacing:0.15em;text-transform:uppercase;line-height:1;
  z-index:2;
}
.slide.invert .eyebrow{color:#000}

.rule{width:100%;height:3px;background:#fff;margin:34px 0 0;z-index:2}
.slide.invert .rule{background:#000}

h1{
  font-weight:900;letter-spacing:-0.03em;line-height:0.95;
  z-index:2;
}
.cover h1{font-size:104px;line-height:0.88}
.statement h1{font-size:98px}
.list h1{font-size:76px}
.cta h1{font-size:92px}

.body{
  font-family:'Merriweather',Georgia,serif;font-weight:300;
  font-size:38px;line-height:1.6;margin-top:48px;max-width:880px;z-index:2;
}
.sub{
  font-family:'Merriweather',Georgia,serif;font-weight:300;
  font-size:38px;line-height:1.5;margin-top:32px;z-index:2;
}

/* ghost numeral — the brand already uses gray-100 for ghost number backgrounds */
.ghost{
  position:absolute;right:-56px;bottom:132px;
  font-weight:900;font-size:600px;line-height:0.7;letter-spacing:-0.05em;
  color:#fff;opacity:0.055;z-index:0;user-select:none;
}
.slide.invert .ghost{color:#000;opacity:0.05}

ol{list-style:none;margin-top:56px;z-index:2}
li{display:flex;gap:34px;align-items:baseline;padding:30px 0;border-top:2px solid rgba(255,255,255,0.22)}
li:last-child{border-bottom:2px solid rgba(255,255,255,0.22)}
.n{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:28px;letter-spacing:0.08em;opacity:0.55;min-width:64px}
.t{font-family:'Inter',sans-serif;font-weight:700;font-size:40px;line-height:1.2;letter-spacing:-0.02em}

.note{
  font-family:'JetBrains Mono',monospace;font-weight:400;
  font-size:19px;line-height:1.5;letter-spacing:0.03em;
  margin-top:40px;opacity:0.62;z-index:2;
}
.source{
  font-family:'JetBrains Mono',monospace;font-size:19px;letter-spacing:0.08em;
  text-transform:uppercase;margin-top:44px;opacity:0.55;z-index:2;
}
.link{
  font-family:'JetBrains Mono',monospace;font-weight:700;
  font-size:32px;letter-spacing:0.02em;margin-top:52px;z-index:2;
}
.mark{position:absolute;right:84px;bottom:150px;z-index:2}

/* persistent footer lockup — every slide travels alone, so it carries the
   handle and the disclaimer on its own */
footer{
  position:absolute;left:84px;right:84px;bottom:54px;
  display:flex;justify-content:space-between;align-items:center;
  font-family:'JetBrains Mono',monospace;font-weight:700;
  font-size:18px;letter-spacing:0.14em;text-transform:uppercase;
  opacity:0.72;z-index:3;
  border-top:2px solid rgba(255,255,255,0.28);padding-top:26px;
}
.slide.invert footer{border-top-color:rgba(0,0,0,0.28)}

/* cover */
.cover{padding:0;justify-content:flex-end}
.cover .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
/* Deeper at the foot than a normal scrim: on the bright high-key photo the
   type and the lockup land on newsprint columns, which is busy, so the bottom
   quarter needs to go properly dark rather than just tinted. */
.cover .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.50) 0%,rgba(0,0,0,0.06) 34%,rgba(0,0,0,0.62) 72%,rgba(0,0,0,0.93) 88%,rgba(0,0,0,0.97) 100%);z-index:1}
.cover .inner{position:relative;z-index:2;padding:0 84px 150px}
.cover .eyebrow{margin-bottom:30px}
.cover .photo-missing{position:absolute;inset:0;background:repeating-linear-gradient(45deg,#111,#111 28px,#181818 28px,#181818 56px);z-index:0;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:24px;letter-spacing:0.15em;text-transform:uppercase;color:#555}
`;

/* ----------------------------------------------------------------- html ---- */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function footerHtml() {
  return `<footer><span>${esc(HANDLE)}</span><span>${esc(DISCLAIMER)}</span></footer>`;
}

function render(s, i) {
  const head = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&family=Merriweather:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>`;

  let inner = '';

  if (s.type === 'cover') {
    const photoPath = path.join(__dirname, s.photo);
    const hasPhoto = fs.existsSync(photoPath);
    /* the slide HTML is written into slides/, so the photo sits one level up */
    const bg = hasPhoto
      ? `<img class="photo" src="../${s.photo}">`
      : `<div class="photo-missing">cover.jpg not generated yet</div>`;
    inner = `<div class="slide cover">
      ${bg}<div class="scrim"></div>
      <div class="inner">
        <div class="eyebrow">${esc(s.eyebrow)}</div>
        <h1>${esc(s.headline)}</h1>
        <div class="sub">${esc(s.sub)}</div>
      </div>
      ${footerHtml()}
    </div>`;
  } else if (s.type === 'list') {
    const items = s.items
      .map(([n, t]) => `<li><span class="n">${esc(n)}</span><span class="t">${esc(t)}</span></li>`)
      .join('');
    inner = `<div class="slide list">
      ${s.ghost ? `<div class="ghost">${esc(s.ghost)}</div>` : ''}
      <div class="eyebrow">${esc(s.eyebrow)}</div><div class="rule"></div>
      <div class="main">
        <h1>${esc(s.headline)}</h1>
        <ol>${items}</ol>
        <div class="note">${esc(s.note)}</div>
      </div>
      ${footerHtml()}
    </div>`;
  } else if (s.type === 'cta') {
    inner = `<div class="slide cta invert">
      <div class="eyebrow">${esc(s.eyebrow)}</div><div class="rule"></div>
      <div class="main">
        <h1>${esc(s.headline)}</h1>
        <div class="body">${esc(s.body)}</div>
        <div class="link">${esc(s.link)}</div>
        <div class="mark">${LOGO_MARK}</div>
      </div>
      ${footerHtml()}
    </div>`;
  } else {
    inner = `<div class="slide statement">
      ${s.ghost ? `<div class="ghost">${esc(s.ghost)}</div>` : ''}
      <div class="eyebrow">${esc(s.eyebrow)}</div><div class="rule"></div>
      <div class="main">
        <h1>${esc(s.headline)}</h1>
        <div class="body">${esc(s.body)}</div>
        ${s.source ? `<div class="source">${esc(s.source)}</div>` : ''}
      </div>
      ${footerHtml()}
    </div>`;
  }

  return head + inner + '</body></html>';
}

slides.forEach((s, i) => {
  const n = String(i + 1).padStart(2, '0');
  fs.writeFileSync(path.join(OUT, `slide-${n}.html`), render(s, i), 'utf8');
});

/* Alternate cover: the headline is printed on the newspaper inside the photo,
 * so the overlaid h1 would duplicate it. This variant keeps the eyebrow, the
 * sub-line (which carries the hook the newspaper headline does not) and the
 * footer lockup, and drops the headline. */
const altCover = {
  type: 'cover',
  eyebrow: 'Vitamin D',
  headline: '',
  sub: 'And the one most UK men miss.',
  photo: 'cover-scene.jpg',
};
if (fs.existsSync(path.join(__dirname, altCover.photo))) {
  const html = render(altCover, 0).replace(/<h1>\s*<\/h1>/, '');
  fs.writeFileSync(path.join(OUT, 'cover-alt.html'), html, 'utf8');
}

/* Brand-lockup cover. Mirrors the reference layout: the newspaper headline in
 * the photo IS the hook, so no overlaid headline and no hook line, and the
 * bottom carries the brand lockup instead (where the reference puts its own).
 * Lockup is the light/white master, which needs the scrim to sit on. */
if (fs.existsSync(path.join(__dirname, 'cover-scene.jpg'))) {
  /* Solid black band rather than a gradient. A scrim cannot guarantee contrast
   * over a photo we do not control: the white wordmark landed on a bright plate
   * of eggs and vanished. A band is deterministic whatever the image, and
   * "structural black instead of whitespace" is already the brand rule. */
  const brand = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${CSS}
/* The band carries all the contrast this variant needs, so the scrim drops to a
   soft blend into it. At full strength it was muddying the bright top third of
   the photo, which is the part doing the work. */
.cover .scrim{background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 60%,rgba(0,0,0,0.45) 100%)}
.cover .band{position:absolute;left:0;right:0;bottom:0;height:252px;background:#000;z-index:2}
.cover .lockup{width:430px;display:block;position:absolute;left:84px;top:52px}
.cover footer{border-top:2px solid rgba(255,255,255,0.28)}
</style></head><body>
<div class="slide cover">
  <img class="photo" src="../cover-scene.jpg">
  <div class="scrim"></div>
  <div class="band"><img class="lockup" src="../lockup-dark.svg"></div>
  ${footerHtml()}
</div></body></html>`;
  fs.writeFileSync(path.join(OUT, 'cover-brand.html'), brand, 'utf8');

  /* Same band and lockup with the photo and scrim removed, screenshotted on a
   * transparent background and composited over the mp4. Generated from the same
   * source as the static cover so the two cannot drift apart. */
  const brandOverlay = brand
    .replace(/<img class="photo"[^>]*>/, '')
    .replace(/<div class="scrim"><\/div>/, '')
    .replace('<body>', '<body class="transparent">')
    .replace('</style>', 'body.transparent,body.transparent .slide{background:transparent!important}</style>');
  fs.writeFileSync(path.join(OUT, 'cover-brand-overlay.html'), brandOverlay, 'utf8');
}

/* Transparent type layer for the video cover. Generated from the SAME cover
 * definition as slide-01, so the still and the animated version cannot drift
 * apart: the photo is dropped, the scrim and all type are kept, and the page
 * is screenshotted with a transparent background then composited over the mp4. */
const cover = slides[0];
const overlay = render(cover, 0)
  .replace(/<img class="photo"[^>]*>/, '')
  .replace(/<div class="photo-missing">[\s\S]*?<\/div>/, '')
  .replace('<body>', '<body class="transparent">')
  .replace('</style>', 'body.transparent,body.transparent .slide{background:transparent!important}</style>');
fs.writeFileSync(path.join(OUT, 'cover-overlay.html'), overlay, 'utf8');

console.log(`wrote ${slides.length} slide files + cover-overlay.html to ${OUT}`);

