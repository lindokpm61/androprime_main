#!/usr/bin/env node
/*
 * The QUALIFIER vocabulary in `fragment-scan.js` must read a contraction the same
 * way whichever apostrophe was typed.
 *
 *   node .claude/skills/compliance-preflight/test-qualifier-apostrophe.js
 *
 * WHY. Until 2026-09-14 the contractions were spelled with U+2019 only, so
 * `"the part that isn't cortisol"` scored NOT HEDGED while the identical sentence
 * with a typographic apostrophe scored HEDGED. The visible symptom was the
 * scanner's HIGHEST-PRIORITY finding — "qualifier dropped, NOTHING on this slide
 * hedges it" — raised against a sentence made of two negations.
 *
 * Mirror of the NEG defect fixed on 2026-08-11 (`test-curly-negation.js`), which
 * had the same bug pointing the other way. Both tables now take either
 * apostrophe, and this suite exists so the third table nobody has found yet is
 * caught by the pattern rather than by a false finding on real copy.
 *
 * The adversarial half matters more than the positive half: widening a qualifier
 * list makes a REVIEW check MORE permissive, so the cases that must still be
 * NOT HEDGED are what stop the widening becoming a bypass.
 */
const fs = require('node:fs');
const path = require('node:path');

const SRC = fs.readFileSync(path.join(__dirname, 'fragment-scan.js'), 'utf8');

/* Lift the live regex out of the scanner rather than restating it. A test
   carrying its own copy of the pattern under test asserts nothing about the
   scanner, which is the failure this whole skill keeps recording.
 *
 * 🔴 AND THE FIRST VERSION OF THIS FILE COMMITTED THAT EXACT FAILURE, one token
 * deeper, which is why the sequence below is so laboured. It lifted the
 * scanner's QUALIFIER expression and then substituted the TEST'S OWN definition
 * of `APOS` into it — the single token the suite exists to protect. With the
 * scanner reverted to curly-only, the suite rebuilt a byte-identical regex and
 * all 22 cases passed. It could not detect the regression it was written for,
 * and it said so in its own header while doing it.
 *
 * So `APOS` is read from the scanner too, and asserted to contain both
 * apostrophes before anything else runs. The assertion is the real test; the 22
 * cases below only describe what that buys. */
const aposMatch = /const APOS = '([^']*(?:\\'[^']*)*)';/.exec(SRC)
  || /const APOS = (['"])((?:(?!\1).)*)\1;/.exec(SRC);
if (!aposMatch) {
  console.error('FATAL: could not find `const APOS` in fragment-scan.js. The suite cannot');
  console.error('       verify a token it cannot read; failing rather than testing itself.');
  process.exit(1);
}
// eslint-disable-next-line no-eval
const SCANNER_APOS = eval(SRC.slice(aposMatch.index).match(/=\s*(.*?);/)[1]);

const STRAIGHT = String.fromCharCode(0x27);
const CURLY = String.fromCharCode(0x2019);
let fatal = 0;
for (const [name, ch] of [['straight U+0027', STRAIGHT], ['curly U+2019', CURLY]]) {
  if (!new RegExp(SCANNER_APOS).test(ch)) {
    console.error(`FAIL: the scanner's APOS class does not accept the ${name} apostrophe.`);
    console.error(`      APOS is currently ${JSON.stringify(SCANNER_APOS)}.`);
    fatal += 1;
  }
}
if (fatal) {
  console.error('\nThis is the regression this suite exists for. The cases below are not run,');
  console.error('because with a one-sided APOS they would all pass and mean nothing.');
  process.exit(1);
}

const m = /const QUALIFIER = new RegExp\(\s*([\s\S]*?)\s*,\s*'i'\s*\);/.exec(SRC);
if (!m) {
  console.error('FATAL: could not find the QUALIFIER definition in fragment-scan.js.');
  process.exit(1);
}
/* Built from the SCANNER's APOS, read above, never from a local constant. */
// eslint-disable-next-line no-eval
const QUALIFIER = new RegExp(eval(m[1].replace(/\bAPOS\b/g, JSON.stringify(SCANNER_APOS))), 'i');

const cases = [
  // ── the defect, both spellings, same verdict ──────────────────────────────
  ["the part that isn't cortisol", true, 'straight isn\'t'],
  [`the part that isn${CURLY}t cortisol`, true, 'curly isn’t'],
  ["it doesn't move testosterone", true, 'straight doesn\'t'],
  [`it doesn${CURLY}t move testosterone`, true, 'curly doesn’t'],
  ["we don't diagnose anything", true, 'straight don\'t'],
  [`we don${CURLY}t diagnose anything`, true, 'curly don’t'],
  ["you can't read it from symptoms", true, 'straight can\'t'],
  [`you can${CURLY}t read it from symptoms`, true, 'curly can’t'],

  // ── the real sentence that produced the false positive ────────────────────
  ["\"Cortisol belly\" isn't a medical term. What a long stress load does to " +
   "where fat sits, the part that isn't cortisol, and when to talk to a GP.",
    true, 'the live cortisol-belly description'],

  // ── unaffected positives, so the widening did not break the ordinary path ─
  ['levels may be low', true, 'may'],
  ['this is usually enough', true, 'usually'],
  ['is not a diagnosis', true, 'is not'],
  ['never a treatment', true, 'never'],
  ['worth a GP conversation', true, 'worth'],
  ['most men', true, 'most'],

  // ── ADVERSARIAL: the widening must not turn the check into a bypass ───────
  ['Under 25 causes tiredness.', false, 'bare assertion, no qualifier'],
  ['Cortisol drives belly fat.', false, 'bare assertion'],
  ['Your testosterone is low.', false, 'definitive statement'],
  ["Here's what to do this week.", false, 'apostrophe present but not a hedge'],
  [`Here${CURLY}s the plan.`, false, 'curly apostrophe present but not a hedge'],
  ['Isnt a word', false, 'no apostrophe at all, must not match'],
  ['Get your levels checked today.', false, 'imperative, nothing softening it'],
];

let pass = 0;
let fail = 0;
for (const [text, expected, label] of cases) {
  const got = QUALIFIER.test(text);
  if (got === expected) {
    pass += 1;
  } else {
    fail += 1;
    console.error(`  x ${label}`);
    console.error(`     expected ${expected ? 'HEDGED' : 'NOT HEDGED'}, got ${got ? 'HEDGED' : 'NOT HEDGED'}`);
    console.error(`     text: ${JSON.stringify(text)}`);
  }
}

console.log('');
if (fail) {
  console.error(`x ${fail} failed, ${pass} passed`);
  process.exit(1);
}
console.log(`ok ${pass} cases passed (either apostrophe reads the same; ${cases.filter((c) => !c[1]).length} adversarial)`);
