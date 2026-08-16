#!/usr/bin/env node
/**
 * The retest/efficacy REVIEW rule must match the fix family by stem.
 *
 *   node .claude/skills/compliance-preflight/test-fix-family.js
 *
 * The rule was written as four hand-listed inflections, `(fix|fixed|fixes|
 * fixing)`. `fixable` is not one of them, so "So far, so fixable" on a live
 * cholesterol post cleared both the pre-flight scanner and the fragment scanner
 * and was found by a human reading the copy instead. The enumeration is the
 * defect: every missing inflection is silent, and nothing about a passing scan
 * distinguishes "no efficacy framing here" from "an inflection nobody listed".
 *
 * So this suite asserts the SHAPE of the rule, not a longer list. The negative
 * cases are load-bearing in the other direction — a stem match that swallows
 * `prefix` or `fixture` would put noise into an advisory list, and an advisory
 * list that cries wolf gets skimmed, which is the failure mode the 2026-08-11
 * curly-apostrophe note in compliance-tables.js records for a HARD gate.
 */
'use strict';

const { REVIEW } = require('./compliance-tables');

const rule = REVIEW.find((r) => /fix/.test(String(r.re)));
if (!rule) {
  console.error('FATAL: no fix-family rule found in REVIEW — has it been renamed or removed?');
  process.exit(1);
}

let pass = 0;
let fail = 0;

function t(desc, text, expected) {
  const got = rule.re.test(text);
  if (got === expected) { pass++; console.log(`  ok   ${desc}`); }
  else { fail++; console.log(`  FAIL ${desc} — expected ${expected}, got ${got}\n       ${JSON.stringify(text)}`); }
}

console.log('Fix-family REVIEW rule\n');
console.log(`  rule: ${String(rule.re)}\n`);

/* The four the enumeration already covered. These must not regress. */
t('fix',    'We can fix your levels.', true);
t('fixed',  'Your levels can be fixed.', true);
t('fixes',  'The stack fixes it.', true);
t('fixing', 'Fixing your testosterone.', true);

/* THE ONE THAT WALKED THROUGH. Verbatim from
 * assets/2026-08-16-the-number-not-on-the-panel.md line 53. */
t('fixable — the live miss', 'So far, so fixable. Read the panel instead of the headline.', true);

/* The rest of the family the enumeration also missed. */
t('unfixable', 'It is not unfixable.', true);
t('fixer',     'A quick fixer for low energy.', true);
t('fixers',    'These are the fixers.', true);

/* Case and boundary behaviour. */
t('capitalised',      'Fixable in weeks.', true);
t('hyphen boundary',  'So far, so fix-able.', true);
t('sentence-final',   'Is it fixable?', true);

/* NEGATIVE. A stem match must not swallow unrelated words that merely contain
 * the letters. If any of these flip to true the rule is generating noise. */
t('prefix',    'The prefix is wrong.', false);
t('suffix',    'Check the suffix.', false);
t('affix',     'Affix the label.', false);
t('fixture',   'The fixture is booked.', false);
t('fixtures',  'Two fixtures this week.', false);
t('fixation',  'A fixation on numbers.', false);
t('fixate',    'Do not fixate on one reading.', false);
t('crucifix',  'A crucifix hung there.', false);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
