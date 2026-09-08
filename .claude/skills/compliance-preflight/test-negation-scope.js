#!/usr/bin/env node
/**
 * Tests for the two 2026-09-08 changes to the shared negation guard.
 *
 *   Observation 390 — the guard was evaluated per PHYSICAL LINE. Prose in these
 *     files is one paragraph per line, so a negation attached to one sentence
 *     cleared a bare claim in the next sentence of the same line. It is now
 *     scoped to the sentence the matched term sits in.
 *   Observation 495 — the negator list covered `not`-forms and missed
 *     NEGATIVE-QUANTIFIER SUBJECTS, so "Nothing here is a diagnosis" was graded
 *     HARD: the scanner firing hardest on the copy that most reduces the claim.
 *
 * Both halves are exercised, and the ADVERSARIAL half is the load-bearing one.
 * Widening a negator list makes a HARD gate more permissive, so every new
 * negator is paired with a claim that must still be caught.
 *
 * Unit-level on purpose: `negatedAt` is shared by three scanners
 * (compliance-preflight/scan.js, compliance-preflight/fragment-scan.js and
 * content-status/scan.js, which is gate G5 on the commit gate), so a defect
 * here is a defect in all three and a fixture-driven test would only exercise
 * one.
 *
 * Usage (from repo root):
 *   node .claude/skills/compliance-preflight/test-negation-scope.js
 * Exit code: 0 all pass, 1 any failure.
 */
'use strict';

const { HARD, negatedAt, sentenceAround } = require('./compliance-tables');

// The guarded terms, i.e. the ones a negation is allowed to clear.
const GUARDED = HARD.filter((p) => p.guard);

/** Reproduce what a consumer does: every guarded term is evaluated
 *  INDEPENDENTLY, and the text is flagged if any one of them is unnegated.
 *  Stopping at the first match instead reports CLEARED for
 *  "We do not diagnose. Our stack treats low testosterone." because `diagnos`
 *  is checked before `treat` — which is a bug in the harness, not the scanner,
 *  and the negative case is what surfaced it. */
function verdict(text) {
  let matched = false;
  for (const p of GUARDED) {
    const m = text.match(p.re);
    if (!m) continue;
    matched = true;
    if (!negatedAt(text, m.index)) return 'FLAGGED';
  }
  return matched ? 'CLEARED' : 'NO-MATCH';
}

const CASES = [
  // ---- Observation 390: sentence scope -------------------------------------
  {
    name: '390 the reviewer control: negation in sentence 1 must NOT clear sentence 2',
    text: 'This kit does not treat anything. It diagnoses low testosterone.',
    expect: 'FLAGGED',
  },
  {
    name: '390 same shape, reversed order',
    text: 'It diagnoses low testosterone. This kit does not treat anything.',
    expect: 'FLAGGED',
  },
  {
    name: '390 negation in the SAME sentence still clears',
    text: 'This kit does not treat anything, and it is not a diagnosis.',
    expect: 'CLEARED',
  },
  {
    name: '390 three sentences, the claim in the middle',
    text: 'We do not diagnose. Our stack treats low testosterone. Nothing here is medical advice.',
    expect: 'FLAGGED',
  },
  {
    name: '390 a disclaimer alone is still cleared',
    text: 'These results do not constitute a diagnosis.',
    expect: 'CLEARED',
  },

  // ---- Observation 495: negative-quantifier subjects ------------------------
  { name: '495 the live footer', text: 'They do not diagnose conditions, replace your GP, or constitute medical advice.', expect: 'CLEARED' },
  { name: '495 "This is not a diagnosis"', text: 'This is not a diagnosis.', expect: 'CLEARED' },
  { name: '495 "We do not diagnose"', text: 'We do not diagnose.', expect: 'CLEARED' },
  { name: '495 "Nothing here is a diagnosis" (the failing form)', text: 'Nothing here is a diagnosis.', expect: 'CLEARED' },
  { name: '495 "None of this is a diagnosis"', text: 'None of this is a diagnosis.', expect: 'CLEARED' },
  { name: '495 "No part of this is a diagnosis"', text: 'No part of this is a diagnosis.', expect: 'CLEARED' },
  { name: '495 "At no point is this a diagnosis"', text: 'At no point is this a diagnosis.', expect: 'CLEARED' },
  { name: '495 "Neither result is a diagnosis"', text: 'Neither result is a diagnosis.', expect: 'CLEARED' },
  { name: '495 "In no way is this a diagnosis"', text: 'In no way is this a diagnosis.', expect: 'CLEARED' },

  // ---- ADVERSARIAL: the widening must not clear real claims ----------------
  {
    name: 'ADVERSARIAL a bare claim is still flagged',
    text: 'Our Daily Stack treats low testosterone.',
    expect: 'FLAGGED',
  },
  {
    name: 'ADVERSARIAL a negative quantifier about something ELSE does not clear the claim',
    text: 'Nothing was left out of the panel. Our stack treats low testosterone.',
    expect: 'FLAGGED',
  },
  {
    name: 'ADVERSARIAL "nothing" too far from the trigger in the same sentence',
    text: 'Nothing about the packaging, the freepost envelope or the lancet changes the fact that it treats low testosterone.',
    expect: 'FLAGGED',
  },
  {
    name: 'ADVERSARIAL an unguarded term is never cleared by any negation',
    text: 'This contains no ashwagandha.',
    expect: 'NO-MATCH',   // ashwagandha is unguarded, so it is not in GUARDED
  },

  // ---- sentenceAround itself -----------------------------------------------
  { name: 'sentenceAround picks the containing sentence', fn: () =>
      sentenceAround('One. Two here. Three.', 'One. Two h'.length - 1) === 'Two here.' },
  { name: 'sentenceAround handles a newline boundary', fn: () =>
      sentenceAround('One line\nSecond line', 12) === 'Second line' },
  { name: 'sentenceAround on empty input is safe', fn: () => sentenceAround('', 5) === '' },
  { name: 'sentenceAround past the end is safe', fn: () => sentenceAround('abc', 99) === 'abc' },
];

let failed = 0;
for (const c of CASES) {
  let ok, got;
  if (c.fn) {
    got = c.fn();
    ok = got === true;
  } else {
    got = verdict(c.text);
    ok = got === c.expect;
  }
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.expect ? `expected ${c.expect} got ${got}  ` : ''}${c.name}`);
  if (!ok && c.text) console.log(`      «${c.text}»`);
}

console.log(`\n${CASES.length - failed}/${CASES.length} passed.`);
process.exit(failed ? 1 : 0);
