#!/usr/bin/env node
/**
 * Check a metered-API run record for the two failures that are invisible in a
 * normal-looking output:
 *
 *   1. COST DISCREPANCY — spend materially off the estimate is evidence the
 *      request is not what you assumed, not a stale price. Usually a default
 *      parameter nobody passed.
 *   2. UNBOUND HEADLINE — a capped, sampled or truncated run whose headline
 *      figure is separated from its denominator. The number is what gets acted
 *      on; the caveat beside it does not survive being quoted.
 *
 * It also emits the correctly-denominated headline, so the fix is a copy-paste
 * rather than a rewrite.
 *
 * Usage:  node budget-check.js <run-record.json>
 * Record: { stage, expectedUnitCost, expectedCalls, actualCost,
 *           eligible, tested, qualified, headline }
 *          (eligible/tested/qualified/headline optional — omit for an uncapped run)
 * Exit:   0 clean · 2 at least one HARD · 1 could not run (NEVER a pass)
 */
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('usage: budget-check.js <run-record.json>'); process.exit(1); }
let r;
try { r = JSON.parse(fs.readFileSync(file, 'utf8')); }
catch (e) { console.error(`could not read/parse ${file}: ${e.message}`); process.exit(1); }

const hard = [];
const warn = [];
const need = (k) => { if (r[k] === undefined || r[k] === null) { console.error(`record is missing required field "${k}"`); process.exit(1); } };
['expectedUnitCost', 'expectedCalls', 'actualCost'].forEach(need);

const round = (n, d = 4) => Number(n.toFixed(d));
const expected = r.expectedUnitCost * r.expectedCalls;
const ratio = expected > 0 ? r.actualCost / expected : Infinity;

// --- 1. cost as a side channel on behaviour ---
const TOL = r.tolerance ?? 1.5;
if (ratio >= TOL) {
  hard.push(
    `COST ${round(ratio, 2)}x THE ESTIMATE (expected ${round(expected)}, actual ${round(r.actualCost)}).\n` +
    '      Do NOT update the estimate. Diagnose it: price is an observable side channel on\n' +
    '      what the remote API actually did, so the mental model is what is wrong. Run a\n' +
    '      parameter sweep against the billing endpoint (a handful of calls, balance before\n' +
    '      and after) and check the DEFAULTS first — the parameter nobody passed and\n' +
    '      everybody assumed is the usual culprit. Record the result as a literal cost table\n' +
    '      with its measurement date, so the next author inherits the measurement.');
} else if (ratio <= 1 / TOL) {
  warn.push(
    `spend is ${round(ratio, 2)}x the estimate, i.e. materially CHEAPER than expected.\n` +
    '      Same diagnostic applies: an unexplained delta in either direction means the call\n' +
    '      did something other than what you modelled.');
}

// --- 2. a capped run must carry its denominator in the figure ---
const capped = Number.isFinite(r.eligible) && Number.isFinite(r.tested) && r.tested < r.eligible;
let suggested = null;
if (capped) {
  const untested = r.eligible - r.tested;
  const q = Number.isFinite(r.qualified) ? r.qualified : null;
  const rate = q !== null && r.tested > 0 ? q / r.tested : null;
  suggested =
    (q !== null ? `${q} of ${r.tested} tested` : `${r.tested} of ${r.eligible} tested`) +
    `, ${untested} untested` +
    (rate !== null ? ` (~${Math.round(rate * 100)}% of the tested set qualified; the remaining ${untested} are unmeasured)` : '');

  const h = String(r.headline ?? '');
  const bound = /\bof\s+\d+\b/.test(h) && /untested|unmeasured|unprobed/i.test(h);
  if (!bound) {
    hard.push(
      `UNBOUND HEADLINE: "${h || '(none given)'}" on a capped run (${r.tested} of ${r.eligible}).\n` +
      '      A partial and a complete result are indistinguishable once the number is separated\n' +
      '      from its denominator, and every retelling separates them further. Bind it INTO the\n' +
      '      figure, not into a caveat beside it.\n' +
      `      Use: "${suggested}"`);
  }
  if (Number.isFinite(r.qualified) && r.qualified > r.tested)
    hard.push(`IMPOSSIBLE: qualified (${r.qualified}) exceeds tested (${r.tested}).`);
}

// --- report ---
console.log(`budget-check — ${r.stage ? r.stage + ' — ' : ''}${file}`);
console.log(`  expected ${round(expected)} over ${r.expectedCalls} call(s) · actual ${round(r.actualCost)} · ratio ${round(ratio, 2)}x`);
if (capped) console.log(`  capped run: ${r.tested} of ${r.eligible} eligible tested`);
console.log('');
if (hard.length) { console.log(`HARD (${hard.length})`); hard.forEach((h) => console.log('  ' + h)); console.log(''); }
if (warn.length) { console.log(`REVIEW (${warn.length})`); warn.forEach((w) => console.log('  ' + w)); console.log(''); }
if (!hard.length && !warn.length) console.log('clean — spend matches the model and no figure is unbound.');
process.exit(hard.length ? 2 : 0);
