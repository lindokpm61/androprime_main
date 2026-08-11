#!/usr/bin/env node
/**
 * The negation guard must not depend on which apostrophe was typed.
 *
 *   node .claude/skills/compliance-preflight/test-curly-negation.js
 *
 * `NEG` is shared by the pre-flight scanner and gate G5, and its contractions
 * originally matched U+0027 only. House style writes U+2019, so a disclaimer
 * written the way the brand actually writes it failed the guard and graded 🔴
 * HARD. Both forms must behave identically, and the adversarial cases must stay
 * blocked — a fix to a guard is a chance to open a hole in it.
 */
'use strict';

const { NEG } = require('./compliance-tables');

let pass = 0;
let fail = 0;

function t(desc, text, expected) {
  const got = NEG.test(text);
  if (got === expected) { pass++; console.log(`  ok   ${desc}`); }
  else { fail++; console.log(`  FAIL ${desc} — expected ${expected}, got ${got}\n       ${JSON.stringify(text)}`); }
}

console.log('NEG apostrophe handling\n');

/* The pair that started it: identical sentences, different apostrophe. */
t('straight: aren\'t diagnoses', "Signs aren't diagnoses.", true);
t('curly:    aren’t diagnoses', 'Signs aren’t diagnoses.', true);

t('straight: doesn\'t diagnose', "This doesn't diagnose anything.", true);
t('curly:    doesn’t diagnose', 'This doesn’t diagnose anything.', true);

t('straight: don\'t treat', "We don't treat anything.", true);
t('curly:    don’t treat', 'We don’t treat anything.', true);

t('straight: can\'t cure', "It can't cure it.", true);
t('curly:    can’t cure', 'It can’t cure it.', true);

t('straight: isn\'t a diagnosis', "That isn't a diagnosis.", true);
t('curly:    isn’t a diagnosis', 'That isn’t a diagnosis.', true);

/* Unaffected forms must keep working. */
t('spaced:   does not constitute a diagnosis', 'This does not constitute a diagnosis.', true);
t('phrase:   informational purposes only', 'For informational purposes only.', true);
t('phrase:   not a substitute', 'Not a substitute for medical advice.', true);

/* ADVERSARIAL. Widening the apostrophe class must not clear a bare claim: if
 * these pass, the guard has become a bypass and every guarded HARD term is
 * clearable by writing a sentence with an apostrophe somewhere in it. */
t('bare claim with no negation', 'We diagnose low testosterone.', false);
t('apostrophe present but no negation', "The doctor's diagnosis was clear.", false);
t('curly apostrophe, no negation', 'The doctor’s diagnosis was clear.', false);
t('negation too far from the term', 'It is not the case. ' + 'x'.repeat(60) + ' We diagnose it.', false);
t('possessive near cure, no negator', 'The clinic’s cure was expensive.', false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
