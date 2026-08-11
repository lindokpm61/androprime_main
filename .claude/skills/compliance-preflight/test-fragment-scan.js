#!/usr/bin/env node
/**
 * Regression suite for fragment-scan.js (Observation 180).
 *
 *   node .claude/skills/compliance-preflight/test-fragment-scan.js
 *
 * The adversarial cases are the point. A fragment checker that only proves it
 * catches an obvious breach is worthless: the failure mode it exists for is copy
 * that reads CLEAN in isolation, so the suite must show the scanner fires on
 * compressions that no prose scan would flag, AND that it stays quiet on honest
 * ones. Case 3 is the mutation test — without it, a number check that silently
 * matched everything would pass every other case in this file.
 */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SCAN = path.join(__dirname, 'fragment-scan.js');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fragscan-'));

let pass = 0;
let fail = 0;

function write(name, content) {
  const p = path.join(tmp, name);
  fs.writeFileSync(p, content, 'utf8');
  return p;
}

function run(args) {
  try {
    return { out: execFileSync('node', [SCAN, ...args], { encoding: 'utf8' }), code: 0 };
  } catch (e) {
    return { out: (e.stdout || '') + (e.stderr || ''), code: e.status };
  }
}

function check(desc, cond, detail) {
  if (cond) { pass++; console.log(`  ok   ${desc}`); }
  else { fail++; console.log(`  FAIL ${desc}${detail ? `\n       ${detail}` : ''}`); }
}

const SOURCE = write('source.md', `---
title: Source
---
Ferritin under 30 µg/L points to depleted iron stores in adults.
A result of 35 can still be low enough to matter for how you feel.
Low ferritin in a man is a GP conversation, not a supplement order.
Most men with a normal result are genuinely fine.
`);

function deck(name, slides) {
  return write(name, `module.exports = { slug: 'x', kit: 'energy-recovery',
  closeBHeadline: 'x', slides: ${JSON.stringify(slides)} };\n`);
}

console.log('fragment-scan.js\n');

/* 1. A fragment with no source cannot be cleared at all. */
{
  const f = deck('d1.js', [{ type: 'statement', headline: 'Anything', body: 'At all.' }]);
  const r = run(['--fragment', f]);
  check('1  unpaired fragment is a HARD stop', r.code === 2 && /no --source given/.test(r.out));
}

/* 2. An honest compression that keeps its figures and its hedge stays quiet. */
{
  const f = deck('d2.js', [{
    type: 'list', eyebrow: 'The numbers', headline: 'Ferritin, in µg/L',
    items: [['01', 'Under 30 points to depleted stores']],
    note: 'A result of 35 can still be low enough to matter.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('2  honest compression produces no HARD', r.code === 0, r.out);
  check('2b honest compression produces no number finding', !/appears nowhere in the source/.test(r.out));
}

/* 3. MUTATION TEST. The same slide with a figure the source never states.
 *    If this does not fire, the number check is inert and case 2 proves nothing. */
{
  const f = deck('d3.js', [{
    type: 'list', eyebrow: 'The numbers', headline: 'Ferritin, in µg/L',
    items: [['01', 'Under 45 points to depleted stores']],
    note: 'A result of 35 can still be low enough to matter.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('3  invented figure is a HARD finding', r.code === 2 && /figure "45" appears nowhere/.test(r.out), r.out);
}

/* 4. THE OBSERVATION 180 CASE. The source hedges; the compression drops it.
 *    Nothing in this fragment is a banned literal, so a prose scan reads clean. */
{
  const f = deck('d4.js', [{
    type: 'statement', eyebrow: 'The result', headline: 'A result of 35 is low.',
    body: 'It matters for how you feel.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('4  dropped qualifier is surfaced', /qualifier dropped in compression/.test(r.out), r.out);
  check('4b and is named as unhedged on the slide', /NOTHING on this slide hedges it/.test(r.out), r.out);
}

/* 5. A slide whose headline is bare but whose body carries the hedge is graded
 *    differently. Same finding, different meaning; the reviewer needs the split. */
{
  const f = deck('d5.js', [{
    type: 'statement', eyebrow: 'The result', headline: 'A result of 35 is low.',
    body: 'It can still be low enough to matter for how you feel.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('5  hedge surviving elsewhere is reported as such',
    !/NOTHING on this slide hedges it/.test(r.out), r.out);
}

/* 6. The literal floor still applies inside fragment mode, from the SAME table
 *    the prose scanner uses. A fragment mode that lost the banned-term check
 *    would be a downgrade disguised as an upgrade. */
{
  const f = deck('d6.js', [{
    type: 'statement', headline: 'Ashwagandha helps.', body: 'Under 30 is low.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('6  banned literal still HARD-fails in fragment mode',
    r.code === 2 && /ashwagandha/i.test(r.out), r.out);
}

/* 7. A guarded term inside a disclaimer still clears, as in the prose scanner. */
{
  const f = deck('d7.js', [{
    type: 'statement', headline: 'Signs are not a diagnosis.',
    body: 'Under 30 is low. This does not diagnose anything.',
  }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('7  negated guarded term does not HARD-fail', !/🔴 HARD    "diagnos/.test(r.out), r.out);
}

/* 8. The image half. An undeclared shipping surface is a finding, because a
 *    text-clean scan on copy that ships as a picture is not a clearance. */
{
  const f = deck('d8.js', [{ type: 'statement', headline: 'Under 30 is low.', body: 'Most men are fine.' }]);
  const r = run(['--fragment', f, '--source', SOURCE]);
  check('8  undeclared render is a REVIEW finding', /no --render declared/.test(r.out), r.out);
}

/* 9. A declared render that does not exist is a HARD stop: the obligation was
 *    claimed and cannot be met, which is worse than never claiming it. */
{
  const f = deck('d9.js', [{ type: 'statement', headline: 'Under 30 is low.', body: 'Most men are fine.' }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', path.join(tmp, 'nope')]);
  check('9  missing declared render is a HARD stop',
    r.code === 2 && /declared render not found/.test(r.out), r.out);
}

/* 10. The render obligation is always restated, even on a clean run, so a clean
 *     text pass can never be mistaken for a clearance. */
{
  const f = deck('d10.js', [{ type: 'statement', headline: 'Under 30 is low.', body: 'Most men are fine.' }]);
  const r = run(['--fragment', f, '--source', SOURCE, '--render', tmp]);
  check('10 clean run still prints the render obligation',
    /RENDER OBLIGATION/.test(r.out) && /is not a clearance/.test(r.out), r.out);
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
