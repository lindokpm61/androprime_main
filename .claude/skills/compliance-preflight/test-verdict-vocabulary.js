#!/usr/bin/env node
/**
 * The verdict-vocabulary detector, and the vocabulary it derives.
 *
 *   node .claude/skills/compliance-preflight/test-verdict-vocabulary.js
 *
 * WHAT IS BEING PROTECTED. A sample-report panel grades a marker with a value, a
 * coloured bar and a word. The word has to be one the results engine would
 * actually return, because a labelled coloured bar IS a verdict. Three surfaces
 * shipped Normal / Borderline / Low, which the engine has never returned, and one
 * of them asserted free testosterone was "Low" at a value `classifier.ts` calls
 * `ft-normal`. Keith retired the vocabulary on 2026-08-17 and the fix reached the
 * single page the pre-flight was pointed at.
 *
 * THE NEGATIVE CASES ARE THE LOAD-BEARING HALF. A detector on `status:` that
 * cannot tell a marker row from a frontmatter key would flag every content asset
 * in the repo, and an advisory list that cries wolf gets skimmed — the failure
 * mode `compliance-tables.js` records for the curly apostrophe. `lab: 'Lab
 * normal'` in particular MUST stay clear: quoting the other party's word is the
 * entire point of the two-range readout, and it sits on the same physical line as
 * the field that is checked.
 *
 * Everything here runs the SHIPPED path — a real `scan.js` child process over a
 * real file — rather than reaching inside for the regexes. The detector's value
 * is what it does to a file, and the scoping guards live in the caller.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadBadgeLabels, RETIRED_VERDICTS, SOURCE } = require('./badge-labels');

const SCAN = path.join(__dirname, 'scan.js');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'verdict-vocab-'));

let pass = 0;
let fail = 0;

function t(desc, got, expected) {
  if (got === expected) { pass++; console.log(`  ok   ${desc}`); }
  else { fail++; console.log(`  FAIL ${desc} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`); }
}

/** Run the real scanner over a real file and return its output plus exit code. */
function scan(name, content) {
  const f = path.join(TMP, name);
  fs.writeFileSync(f, content);
  try {
    return { out: execFileSync(process.execPath, [SCAN, f], { encoding: 'utf8' }), code: 0 };
  } catch (e) {
    return { out: String(e.stdout || ''), code: e.status };
  }
}

const flagged = (name, content) => /is not a verdict the results engine returns/.test(scan(name, content).out);
const emphasised = (name, content) => /retired verdict vocabulary/.test(scan(name, content).out);

// ── The derived vocabulary ──────────────────────────────────────────────────

console.log('Derived vocabulary\n');

const V = loadBadgeLabels();
console.log(`  source: ${SOURCE}`);
console.log(`  labels: ${[...V.labels].join(', ')}\n`);

t('the engine yields a usable allowlist', V.labels.size >= 5, true);
t('"In range" is derived, not typed', V.lower.has('in range'), true);
t('"Monitor" is derived', V.lower.has('monitor'), true);
t('"See Your GP" is derived', V.lower.has('see your gp'), true);
t('"Borderline" is NOT a label the engine returns', V.lower.has('borderline'), false);

/* "Optimal" is the trap. It was retired as the label for merely-in-range but
 * survives on testosterone as a signed product choice, so it is a CURRENT label.
 * Listing it as retired would flag copy the product ships. */
t('"Optimal" is a current label', V.lower.has('optimal'), true);
t('"Optimal" is not listed as retired', RETIRED_VERDICTS.some((r) => r.toLowerCase() === 'optimal'), false);

/* The guard that stops this file lying: no retired word may also be current. */
t('retired and current sets are disjoint',
  RETIRED_VERDICTS.filter((r) => V.lower.has(r.toLowerCase())).length, 0);

// ── The loader fails loudly, never quietly ──────────────────────────────────
//
// An allowlist that silently came back empty would flag every verdict on every
// page; one that silently came back permissive would clear every one of them.
// Neither is a safe default, so the loader must throw and the scanner must stop.

console.log('\nLoader guards\n');

function throws(fn) { try { fn(); return false; } catch (e) { return true; } }

t('a missing source throws', throws(() => loadBadgeLabels(path.join(TMP, 'nope.ts'))), true);

const noAnchor = path.join(TMP, 'no-badges.ts');
fs.writeFileSync(noAnchor, "export const OTHER = { label: 'In range' }\n");
t('a renamed BADGES map throws', throws(() => loadBadgeLabels(noAnchor)), true);

const tooFew = path.join(TMP, 'few.ts');
fs.writeFileSync(tooFew, "export const BADGES = {\n  a: { label: 'In range' },\n  b: { label: 'Monitor' },\n}\n");
t('a parse yielding too few labels throws rather than passing', throws(() => loadBadgeLabels(tooFew)), true);

// ── The field detector: what it must catch ──────────────────────────────────

console.log('\nVerdict fields — must be caught\n');

const ROW = (status) =>
  `const rows = [\n  { label: 'Total testosterone', value: '14.2', status: '${status}', band: 'warn', width: '35%' },\n]\n`;

t('status: Borderline on a marker row', flagged('a.tsx', ROW('Borderline')), true);
t('status: Normal on a marker row', flagged('b.tsx', ROW('Normal')), true);
t('status: Low on a marker row — the deficiency the engine does not find',
  flagged('c.tsx', ROW('Low')), true);
t('an invented word nobody has used yet', flagged('d.tsx', ROW('Slightly off')), true);

t('ours: Normal in a two-range readout',
  flagged('e.tsx', "const r = { marker: 'Vitamin D', lab: 'Lab normal', ours: 'Normal', split: false }\n"), true);

t('the mockup shape, a v-ours span',
  flagged('f.html', '<div class="verd mono"><span class="v-lab">Lab normal</span><span class="v-ours">Borderline</span></div>\n'), true);

t('a JSX prop rather than an object key',
  flagged('g.tsx', "<Row label='SHBG' value='38.5' band='ok' status='Normal' />\n"), true);

t('the gate actually fails (exit 2)', scan('h.tsx', ROW('Borderline')).code, 2);

// ── The field detector: what it must NOT catch ──────────────────────────────

console.log('\nVerdict fields — must stay clear\n');

for (const label of V.labels) {
  t(`current label "${label}" clears`, flagged(`ok-${label.replace(/\W/g, '')}.tsx`, ROW(label)), false);
}

/* The live kit pages write "Action needed" where the engine writes "Action
 * Needed". A capitalisation difference is not a compliance defect and must not
 * fail a gate; it would train reviewers to expect false positives. */
t('casing drift on a current label clears', flagged('case.tsx', ROW('Action needed')), false);
t('casing drift the other way clears', flagged('case2.tsx', ROW('IN RANGE')), false);

/* THE ONE THAT SITS ON THE SAME LINE AS A CHECKED FIELD. "Lab normal" is the
 * other party's word; quoting it is what the two-range readout is for. */
t('lab: Lab normal is not a verdict field',
  flagged('lab.tsx', "const r = { lab: 'Lab normal', ours: 'Monitor', split: true }\n"), false);
t('a v-lab span is not a verdict field',
  flagged('lab.html', '<span class="v-lab">Lab normal</span>\n'), false);

/* `status:` is a schema key across this repo. Without the marker-row guard the
 * detector would flag every content asset and every frontmatter block. */
t('frontmatter status: draft clears', flagged('fm1.md', '---\nstatus: draft\ntitle: A post\n---\n'), false);
t('frontmatter status: published clears', flagged('fm2.md', '---\nstatus: published\n---\n'), false);
t('a scheduling record clears',
  flagged('sched.tsx', "const rendition = { platform: 'instagram', status: 'scheduled' }\n"), false);
t('an HTTP status clears', flagged('http.tsx', "const res = { status: 'ok', body: null }\n"), false);

/* Row context is label+value or the bar. A line with neither is not a panel. */
t('status with a value but no label or bar clears',
  flagged('half.tsx', "const x = { value: '14.2', status: 'Normal' }\n"), false);

/* A commented-out row is not customer-facing. */
const commented = scan('cmt.tsx', "// { label: 'SHBG', value: '38.5', status: 'Normal', band: 'ok' },\n");
t('a commented-out row does not fail the gate', commented.code, 0);
t('a commented-out row is still reported as CODE-COMMENT', /CODE-COMMENT/.test(commented.out), true);

// ── The prose shape ─────────────────────────────────────────────────────────
//
// One of the eight instances was not a field at all: "on the action bands our GP
// approved, they read <b>borderline</b>". REVIEW, not HARD — emphasis is also
// ordinary writing and a human rules.

console.log('\nEmphasised retired verdicts — REVIEW\n');

t('the live prose instance',
  emphasised('p1.html', '<p>On the action bands our GP approved, they read <b>borderline</b>.</p>\n'), true);
t('a verdict chip in a mockup',
  emphasised('p2.html', '<div class="chip">Lab: normal<br><b>Normal</b></div>\n'), true);
t('<strong> counts too', emphasised('p3.html', '<p>It reads <strong>Elevated</strong>.</p>\n'), true);

t('the gate is NOT failed by the prose shape',
  scan('p4.html', '<p>They read <b>borderline</b>.</p>\n').code, 0);

t('an emphasised CURRENT label clears',
  emphasised('p5.html', '<p>They read <b>Monitor</b>.</p>\n'), false);
t('emphasis around a whole phrase is not a verdict',
  emphasised('p6.html', '<p><b>Normal is a statistical band, not a health band.</b></p>\n'), false);
t('unemphasised prose about lab normal clears',
  emphasised('p7.html', '<p>A standard report would say normal and stop.</p>\n'), false);

// ── End to end, against the real regression ─────────────────────────────────

console.log('\nEnd to end\n');

const BEFORE = [
  "const marks = [",
  "  { label: 'Total testosterone', sub: 'Your baseline level', value: '14.2', unit: 'nmol/L', status: 'Borderline', band: 'warn', width: '35%' },",
  "  { label: 'SHBG', sub: 'Binding globulin', value: '38.5', unit: 'nmol/L', status: 'Normal', band: 'ok', width: '55%' },",
  "  { label: 'Free testosterone', sub: 'What your body can use', value: '0.244', unit: 'nmol/L', status: 'Low', band: 'warn', width: '15%' },",
  "]",
  "",
].join('\n');

const AFTER = BEFORE
  .replace("status: 'Borderline'", "status: 'Monitor'")
  .replace("status: 'Normal'", "status: 'In range'")
  .replace("status: 'Low', band: 'warn'", "status: 'In range', band: 'ok'");

const before = scan('before.tsx', BEFORE);
const after = scan('after.tsx', AFTER);

t('the pre-fix panel fails the gate', before.code, 2);
t('all three rows are reported',
  (before.out.match(/is not a verdict the results engine returns/g) || []).length, 3);
t('the post-fix panel is clean', /is not a verdict/.test(after.out), false);
t('the post-fix panel passes the gate', after.code, 0);

/* The report has to name the fix, not just the fault: an operator who does not
 * already know the vocabulary needs the allowed words and where they come from. */
t('the report names the allowed words', /"In range"/.test(before.out), true);
t('the report names the engine file', /resultSeverity\.ts/.test(before.out), true);

fs.rmSync(TMP, { recursive: true, force: true });

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
