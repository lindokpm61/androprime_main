/*
 * The production plan for the 30-day run, generated from the title table.
 *
 *   node plan.js            the whole run
 *   node plan.js --commands just the inpaint commands, ready to paste
 *
 * Everything an asset needs comes from covers.js, so nothing here is hand-typed.
 * The point is not the printout: it is that the newspaper headline and the
 * overlay plate are emitted from ONE row, so a cover whose newsprint says one
 * article and whose plate says another cannot be produced by following this.
 */

const fs = require('fs');
const path = require('path');
const { TOPIC_ORDER, coverFor, coverFormat, checkBalance } = require('./covers');

const RUN_DAYS = 30;
const commandsOnly = process.argv.includes('--commands');

const balance = checkBalance(RUN_DAYS);
if (!balance.ok) {
  console.error('SCHEDULE IS UNBALANCED, the run would not be readable:');
  for (const p of balance.problems) console.error(`  - ${p}`);
  process.exit(1);
}

/* Which topics still need a frame with their own headline inpainted. A deck
 * without a coverPhoto on disk is the one thing that silently produces a cover
 * with the WRONG newspaper headline, because the template falls back to the
 * default base, which carries the vitamin D headline. */
function frameFor(slug) {
  const deckPath = path.join(__dirname, 'decks', `${slug}.js`);
  if (!fs.existsSync(deckPath)) return { deck: false, photo: null, exists: false };
  const deck = require(deckPath);
  const photo = deck.coverPhoto || null;
  return {
    deck: true,
    photo,
    exists: Boolean(photo && fs.existsSync(path.join(__dirname, photo))),
  };
}

if (commandsOnly) {
  for (const slug of TOPIC_ORDER) {
    const c = coverFor(slug);
    const f = frameFor(slug);
    if (f.exists) continue;
    console.log(`# ${slug}`);
    console.log(
      `node inpaint.js --l1 ${JSON.stringify(c.l1)} --l2 ${JSON.stringify(c.l2)} --out cover-${slug} --dry`
    );
  }
  process.exit(0);
}

console.log('30-DAY RUN PLAN\n');
console.log('Balance:', JSON.stringify(balance.fmt), JSON.stringify(balance.close), '\n');

console.log('PER TOPIC');
console.log('slug'.padEnd(40), 'newspaper headline'.padEnd(34), 'type bg'.padEnd(9), 'frame');
for (const slug of TOPIC_ORDER) {
  const c = coverFor(slug);
  const f = frameFor(slug);
  const state = !f.deck ? 'NO DECK' : f.exists ? 'ready' : 'NEEDS INPAINT';
  console.log(slug.padEnd(40), `${c.l1} / ${c.l2}`.padEnd(34), c.typeBg.padEnd(9), state);
}

console.log('\nPER POST');
console.log('day'.padEnd(5), 'topic'.padEnd(40), 'cover'.padEnd(7), 'close');
for (let day = 1; day <= RUN_DAYS; day++) {
  const t = (day - 1) % TOPIC_ORDER.length;
  const k = Math.floor((day - 1) / TOPIC_ORDER.length);
  console.log(
    String(day).padEnd(5),
    TOPIC_ORDER[t].padEnd(40),
    coverFormat(t, k).padEnd(7),
    'ABC'[(day - 1) % 3]
  );
}

const needed = TOPIC_ORDER.filter((s) => !frameFor(s).exists);
console.log(`\nASSETS OWED: ${needed.length} inpainted frame(s) + the same number of clips.`);
if (needed.length) console.log('  ' + needed.join('\n  '));
console.log('\nRun `node plan.js --commands` for the inpaint calls (each ends in --dry).');
