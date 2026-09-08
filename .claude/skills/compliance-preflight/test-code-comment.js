#!/usr/bin/env node
/**
 * Tests for the CODE-COMMENT bucket (2026-09-08, Observation 541).
 *
 * Two defects, one cause. The bucket exists to separate a banned phrase in
 * developer commentary from the same phrase in copy a customer will read, and:
 *
 *   1. it was consulted for HARD hits and NOT for REVIEW hits, so a flagged
 *      phrase inside a `/* … *​/` header landed in the customer-copy bucket
 *      beside a genuine finding, and the summary presented them identically;
 *   2. the detector was line-local, so it caught `//`, a leading `*` and an
 *      inline block, and missed the continuation lines of a block comment that
 *      do not start with `*` — which is the style this repo uses most for
 *      exactly the long explanatory prose that trips the tables.
 *
 * THE NEGATIVE CASES ARE THE LOAD-BEARING HALF. Widening a "this is not
 * customer copy" bucket makes the gate more permissive, so every commented form
 * is paired with the same phrase in a rendered string that must still be graded.
 *
 * Fixtures are written to a temp dir at run time, so nothing scannable is added
 * to the repo.
 *
 * Usage (from repo root):
 *   node .claude/skills/compliance-preflight/test-code-comment.js
 * Exit code: 0 all pass, 1 any failure.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCANNER = path.join(__dirname, 'scan.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-comment-'));

const OPEN = '/' + '*';
const CLOSE = '*' + '/';

const CASES = [
  {
    name: 'HARD term in a // line comment',
    // Deliberately NOT a negated phrasing: "we do not diagnose" is cleared by
    // the negation guard before the comment bucket is ever consulted, so it
    // would pass for the wrong reason and prove nothing about this bucket.
    lines: ['// this helper will diagnose the caller', 'export const x = 1;'],
    line: 1, term: 'diagnose', expect: '🟡',
  },
  {
    name: `HARD term in an inline ${OPEN} ${CLOSE} block`,
    lines: [`const x = 1; ${OPEN} diagnose the caller ${CLOSE}`],
    line: 1, term: 'diagnose', expect: '🟡',
  },
  {
    name: 'HARD term on a block continuation line WITH a leading star',
    lines: [OPEN, ' * this will diagnose the caller', ' ' + CLOSE, 'export const x = 1;'],
    line: 2, term: 'diagnose', expect: '🟡',
  },
  {
    name: 'HARD term on a block continuation line WITHOUT a leading star (the miss)',
    lines: [OPEN, 'this will diagnose the caller', CLOSE, 'export const x = 1;'],
    line: 2, term: 'diagnose', expect: '🟡',
  },
  {
    name: 'HARD term in a JSX {' + OPEN + ' ' + CLOSE + '} comment',
    lines: ['export const C = () => (', `  <div>{${OPEN} we diagnose nothing ${CLOSE}}</div>`, ');'],
    line: 2, term: 'diagnose', expect: '🟡',
  },
  {
    name: 'REVIEW term in a block comment goes to CODE-COMMENT, not REVIEW',
    lines: [OPEN, 'the magnesium row was removed in V7.2 and must not come back', CLOSE, 'export const x = 1;'],
    line: 2, term: 'magnesium', expect: '🟡',
  },

  // ---- NEGATIVE: rendered strings must still be graded --------------------
  {
    name: 'NEGATIVE the same HARD term in a rendered JSX string is still HARD',
    lines: ['export const C = () => (', '  <p>We diagnose low testosterone.</p>', ');'],
    line: 2, term: 'diagnose', expect: '🔴',
  },
  {
    name: 'NEGATIVE the same REVIEW term in a rendered JSX string is still REVIEW',
    lines: ['export const C = () => (', '  <p>Now with magnesium.</p>', ');'],
    line: 2, term: 'magnesium', expect: '🟠',
  },
  {
    name: 'NEGATIVE code after the block CLOSES on the same line is not a comment',
    lines: [OPEN, 'a note', `${CLOSE} export const label = "We diagnose low testosterone";`],
    line: 3, term: 'diagnose', expect: '🔴',
  },
  {
    name: 'NEGATIVE a block that closed on an earlier line does not shield later code',
    lines: [OPEN, 'a note', CLOSE, 'export const label = "We diagnose low testosterone";'],
    line: 4, term: 'diagnose', expect: '🔴',
  },
  {
    name: `NEGATIVE ${OPEN} inside a trailing // comment must not open a block`,
    lines: [`const x = 1; // see ${OPEN} below`, 'export const label = "We diagnose low testosterone";'],
    line: 2, term: 'diagnose', expect: '🔴',
  },
];

let failed = 0;
CASES.forEach((c, i) => {
  const file = path.join(dir, `case-${i}.tsx`);
  fs.writeFileSync(file, c.lines.join('\n') + '\n');

  let out;
  try {
    out = execFileSync(process.execPath, [SCANNER, file], { encoding: 'utf8' });
  } catch (e) { out = (e.stdout || '') + (e.stderr || ''); }

  const hit = out.split('\n').find((l) =>
    l.includes(`case-${i}.tsx:${c.line}`) && l.toLowerCase().includes(`«${c.term.toLowerCase()}`));
  const got = hit ? hit.trim().slice(0, 2) : '(no hit)';
  const ok = got === c.expect;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  expected ${c.expect}  got ${got}  ${c.name}`);
  if (!ok) console.log(`      line ${c.line} «${c.term}»\n${out}`);
});

fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n${CASES.length - failed}/${CASES.length} passed.`);
process.exit(failed ? 1 : 0);
