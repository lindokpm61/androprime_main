/*
 * Carousel slide builder — Andro Prime
 *
 * Renders 1080x1350 (Instagram 4:5) slide HTML for ONE deck. Type is
 * deterministic; only the cover photo is generated. Brand tokens from
 * 02_brand/visual-identity.md + frontend/styles/tokens/{colours,typography}.css:
 * black/white only, no radius, no shadow, Inter 900 / Merriweather / JetBrains Mono.
 *
 *   node build.js --deck why-am-i-always-tired
 *   node build.js --list
 *
 * WAS: one article's copy hardcoded inline as a `slides` array. The 30-day run
 * needs ten decks, so copy now lives in decks/<slug>.js and this file is the
 * renderer alone. Output is namespaced per deck (slides/<slug>/), because ten
 * decks writing to one directory would silently overwrite each other.
 *
 * A deck ends at slide 7. Slide 8 is the CLOSE and is the tested variable of the
 * run, so all three approved closes are written for every deck (close-A/B/C.html)
 * and the schedule in frontend/lib/bio-grid.ts decides which one a given day uses.
 * Slides 1 to 7 are shared by a topic's three posts, which is why the run needs
 * ten decks rather than thirty.
 */

const fs = require('fs');
const path = require('path');
const { closesFor } = require('./closes');
const { coverFor } = require('./covers');

const DECKS = path.join(__dirname, 'decks');

function availableDecks() {
  if (!fs.existsSync(DECKS)) return [];
  return fs
    .readdirSync(DECKS)
    .filter((f) => f.endsWith('.js'))
    .map((f) => path.basename(f, '.js'))
    .sort();
}

const argv = process.argv.slice(2);
if (argv.includes('--list')) {
  console.log(availableDecks().join('\n') || '(no decks in decks/)');
  process.exit(0);
}

const deckArg = argv[argv.indexOf('--deck') + 1];
/* Required rather than defaulted. A silent default would render the wrong
 * article under the right filename, which is invisible until it is posted. */
if (!argv.includes('--deck') || !deckArg || deckArg.startsWith('--')) {
  console.error('Usage: node build.js --deck <slug>\n\nAvailable:');
  console.error('  ' + (availableDecks().join('\n  ') || '(none)'));
  process.exit(1);
}

const deckPath = path.join(DECKS, `${deckArg}.js`);
if (!fs.existsSync(deckPath)) {
  console.error(`No deck "${deckArg}". Available:`);
  console.error('  ' + (availableDecks().join('\n  ') || '(none)'));
  process.exit(1);
}

const deck = require(deckPath);
const closes = closesFor(deck);

const OUT = path.join(__dirname, 'slides', deck.slug);
fs.mkdirSync(OUT, { recursive: true });

const HANDLE = '@keith.antony.ai';
const DISCLAIMER = 'Education, not medical advice.';

/* Solid mark, dark variant (black square, white AP), the correct variant on a
 * light background per 02_brand/visual-identity.md. Outlined paths, so it does
 * not depend on Inter being present. */
const LOGO_MARK = `<svg viewBox="0 0 100 100" width="132" height="132" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#000000"/>
  <path d="M30.885 59.597L28.957 66L19.156 66L30.199 32.545L42.614 32.545L53.656 66L43.855 66L41.928 59.597L30.885 59.597M32.943 52.801L39.869 52.801L36.537 41.759L36.276 41.759 M62.940 66L53.858 66L53.858 32.545L68.298 32.545Q72.023 32.545 74.816 34.016Q77.609 35.486 79.161 38.148Q80.713 40.811 80.713 44.372Q80.713 47.966 79.120 50.596Q77.528 53.226 74.661 54.647Q71.794 56.068 67.972 56.068L62.940 56.068L62.940 66M62.940 39.798L62.940 49.011L66.142 49.011Q67.743 49.011 68.878 48.448Q70.013 47.884 70.626 46.839Q71.239 45.793 71.239 44.372Q71.239 42.935 70.626 41.914Q70.013 40.893 68.878 40.346Q67.743 39.798 66.142 39.798" fill="#ffffff"/>
</svg>`;

/* ------------------------------------------------------------------ css ---- */

const CSS = `
*{margin:0;padding:0;box-sizing:border-box;border-radius:0!important;box-shadow:none!important}
html,body{width:1080px;height:1350px;overflow:hidden}
body{
  font-family:'Inter',-apple-system,sans-serif;
  background:#000;color:#fff;
  display:flex;flex-direction:column;
  position:relative;
  /* greyscale AA: subpixel rendering puts colour fringes on the mono type,
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
/* A close headline can be a full sentence (close B names the kit and its
   markers), which overflows at the display size the short closes use. */
.cta h1.long{font-size:62px;line-height:1.04}

.body{
  font-family:'Merriweather',Georgia,serif;font-weight:300;
  font-size:38px;line-height:1.6;margin-top:48px;max-width:880px;z-index:2;
}
.sub{
  font-family:'Merriweather',Georgia,serif;font-weight:300;
  font-size:38px;line-height:1.5;margin-top:32px;z-index:2;
}

/* ghost numeral: the brand already uses gray-100 for ghost number backgrounds */
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

/* persistent footer lockup: every slide travels alone, so it carries the
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

/* Slide HTML is written to slides/<slug>/, so shared assets sit two levels up.
 * This was `../` when everything rendered into one flat directory; getting it
 * wrong yields a slide that renders with the missing-photo hatch instead of the
 * cover, which looks deliberate enough to ship. */
const ASSET_PREFIX = '../../';

function render(s) {
  const head = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&family=Merriweather:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>`;

  let inner = '';

  if (s.type === 'cover') {
    const photoPath = path.join(__dirname, s.photo);
    const hasPhoto = fs.existsSync(photoPath);
    const bg = hasPhoto
      ? `<img class="photo" src="${ASSET_PREFIX}${s.photo}">`
      : `<div class="photo-missing">cover not generated yet</div>`;
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
        ${s.source ? `<div class="source">${esc(s.source)}</div>` : ''}
      </div>
      ${footerHtml()}
    </div>`;
  } else if (s.type === 'cta') {
    /* 46 characters is where the display size stops fitting two lines at 92px.
     * Measured against the longest approved close, not guessed. */
    const long = s.headline.length > 46 ? ' class="long"' : '';
    inner = `<div class="slide cta invert">
      <div class="eyebrow">${esc(s.eyebrow)}</div><div class="rule"></div>
      <div class="main">
        <h1${long}>${esc(s.headline)}</h1>
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

/* ---------------------------------------------------------------- write ---- */

/* A deck is BODY COPY ONLY, slides 2 to 7. The cover comes from covers.js and is
 * rendered in two formats, because a topic runs three times and alternates
 * between them. Decks used to carry their own cover; that let a deck's cover
 * headline drift from the headline inpainted onto the newspaper, which is the
 * one error the title table exists to make unrepresentable. */
if (deck.slides.length !== 6) {
  console.error(
    `Deck ${deck.slug} has ${deck.slides.length} slides; a deck is 6 (slides 2 to 7). ` +
      'The cover comes from covers.js, the close from closes.js.'
  );
  process.exit(1);
}

deck.slides.forEach((s, i) => {
  const n = String(i + 2).padStart(2, '0');
  fs.writeFileSync(path.join(OUT, `slide-${n}.html`), render(s), 'utf8');
});

for (const [key, close] of Object.entries(closes)) {
  fs.writeFileSync(path.join(OUT, `close-${key}.html`), render(close), 'utf8');
}

/* ---------------------------------------------------------------- covers ---- */

const cover = coverFor(deck.slug);

const COVER_CSS = `
.cv{position:relative;width:1080px;height:1350px;overflow:hidden;background:#000}
.cv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1)}
/* The plate carries all the contrast, so the scrim only has to blend into it. */
.cv .fade{position:absolute;left:0;right:0;bottom:0;height:58%;
  background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.94) 78%,#000 100%);z-index:2}
.cv .plate{position:absolute;left:0;right:0;bottom:0;background:#000;padding:0 84px 150px;z-index:3}
.cv .kick{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;letter-spacing:.16em;
  text-transform:uppercase;color:#fff;opacity:.62;margin-bottom:26px}
.cv h1{font-weight:900;font-size:112px;line-height:.9;letter-spacing:-.035em;text-transform:uppercase;color:#fff}
.cv h1.mid{font-size:92px}
.cv h1.small{font-size:76px}
/* typographic cover */
.ct{position:relative;width:1080px;height:1350px;overflow:hidden;background:#000;color:#fff;
  display:flex;flex-direction:column;padding:88px 84px 200px}
.ct.light{background:#fff;color:#000}
.ct .kick{font-family:'JetBrains Mono',monospace;font-weight:700;font-size:24px;letter-spacing:.16em;text-transform:uppercase;opacity:.62;z-index:2}
/* The headline centres in the space left under the eyebrow, the same treatment
   the body slides use. Previously this was space-between, which pinned the type
   to the floor and left a void that read as a mistake rather than as air. */
.ct .mainc{flex:1;display:flex;flex-direction:column;justify-content:center;z-index:2}
.ct h1{font-weight:900;line-height:.88;letter-spacing:-.04em;text-transform:uppercase}
`;

/*
 * Size ramp, measured against the LONGEST LINE rather than the whole title.
 *
 * Total length is the wrong metric: it made "WHY AM I / ALWAYS TIRED?" (22
 * characters) render at full size, where "ALWAYS TIRED?" alone is wider than the
 * 912px of usable width, so it wrapped to a third line and pushed the block off
 * the bottom. What decides whether a line fits is that line.
 *
 * Widths are calibrated for Inter 900 uppercase at -0.04em against the real rows
 * in covers.js, the longest of which is "STORES, EXPLAINED" at 17 characters.
 */
function coverType(l1, l2, base) {
  const longest = Math.max(l1.length, l2.length);
  if (longest > 17) return Math.round(base * 0.53);
  if (longest > 14) return Math.round(base * 0.62);
  if (longest > 11) return Math.round(base * 0.74);
  return base;
}

function coverHead() {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;700;900&family=Merriweather:wght@300;400;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>${CSS}${COVER_CSS}</style></head><body>`;
}

/* Video cover. The photo (or the still pulled from the clip) carries the
 * newspaper with THIS SAME headline inpainted into it; the plate repeats it so
 * the tile is legible at grid size, where the newsprint is not. Both strings come
 * from one row, so they cannot disagree. */
const photoRel = `${ASSET_PREFIX}${deck.coverPhoto || 'cover-current-b2.jpg'}`;
const hasPhoto = fs.existsSync(path.join(__dirname, deck.coverPhoto || 'cover-current-b2.jpg'));
const coverVideo = `${coverHead()}<div class="cv">
  ${hasPhoto ? `<img src="${photoRel}">` : '<div class="photo-missing">cover frame not generated yet</div>'}
  <div class="fade"></div>
  <div class="plate">
    <div class="kick">${esc(cover.eyebrow)}</div>
    <h1 style="font-size:${coverType(cover.l1, cover.l2, 112)}px">${esc(cover.l1)}<br>${esc(cover.l2)}</h1>
  </div>
  ${footerHtml()}
</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'cover-video.html'), coverVideo, 'utf8');

/* Typographic cover. Same words, no photograph. `typeBg` alternates down the
 * table, which is what gives the grid its black/white rhythm. */
const coverTypeHtml = `${coverHead()}<div class="ct ${cover.typeBg === 'white' ? 'light' : ''}">
  <div class="kick">${esc(cover.eyebrow)}</div>
  <div class="mainc">
    <h1 style="font-size:${coverType(cover.l1, cover.l2, 150)}px">${esc(cover.l1)}<br>${esc(cover.l2)}</h1>
  </div>
  ${footerHtml()}
</div></body></html>`;
fs.writeFileSync(path.join(OUT, 'cover-type.html'), coverTypeHtml, 'utf8');

/* Transparent type layer, composited over the mp4 by video.js. Generated from the
 * SAME string as the still cover, so the animated and static versions cannot
 * drift apart. */
const overlay = coverVideo
  .replace(/<img[^>]*>/, '')
  .replace(/<div class="photo-missing">[\s\S]*?<\/div>/, '')
  .replace('<body>', '<body class="transparent">')
  .replace('</style>', 'body.transparent,body.transparent .cv{background:transparent!important}</style>');
fs.writeFileSync(path.join(OUT, 'cover-overlay.html'), overlay, 'utf8');

console.log(
  `${deck.slug}: wrote ${deck.slides.length} body slides + 3 closes + 2 covers + cover-overlay.html`
);
console.log(`  newspaper headline (inpaint): "${cover.l1}" / "${cover.l2}"`);
console.log(`  ${OUT}`);
console.log(`  next: node render.js --deck ${deck.slug}`);
