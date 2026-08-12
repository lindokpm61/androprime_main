/* One cover clip per topic, Kling 2.6, window scene. Sequential on purpose:
 * same Replicate endpoint and the same work/ band assets. Each source comes
 * from the deck's own coverPhoto, so the clip and the still can never disagree. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const slugs = fs.readdirSync('decks').filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
let ok = 0, fail = 0;
for (const slug of slugs) {
  const deck = require(`./decks/${slug}.js`);
  const src = deck.coverPhoto;
  const line = `${new Date().toISOString().slice(11,19)}  ${slug.padEnd(40)} src=${src} ... `;
  process.stdout.write(line);
  try {
    execFileSync('node', ['video.js', 'kling26', 'window', src, '--deck', slug], { stdio: 'pipe', timeout: 600000 });
    const out = `cover-video-${slug}.mp4`;
    const size = fs.existsSync(out) ? fs.statSync(out).size : 0;
    console.log(size > 100000 ? `ok (${Math.round(size/1024)}KB)` : `WROTE NOTHING USABLE (${size}B)`);
    ok++;
  } catch (e) {
    console.log('FAILED: ' + String(e.stderr || e.message).slice(0, 200));
    fail++;
  }
}
console.log(`\nDONE: ${ok} clips, ${fail} failed`);
