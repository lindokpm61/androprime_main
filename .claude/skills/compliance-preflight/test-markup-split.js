#!/usr/bin/env node
/**
 * Tests for rendered-text normalisation in `scan.js`.
 *
 * Why this exists (Observation 122, 2026-08-02): an external review reported a
 * prohibited sentence on a live page. An exact-string search over the source
 * returned nothing, which briefly read as the review being wrong. The phrase was
 * authored with a tag inside it, so the rendered page carries the sentence and
 * the source never does. **A scanner that passes on the tag-split form provides
 * false assurance on exactly the highest-visibility copy**, because headings are
 * both where the strongest claims live and where designers most often break
 * lines. The fix strips inline markup and collapses whitespace before matching.
 *
 * The risk of that fix is the opposite failure, so it is tested in both
 * directions: the SUPPRESSION cases below assert that stripping markup does not
 * silence a disclaimer that used to clear, and the CONTROL cases assert that an
 * unmarked line reports exactly as it did before, with no markup annotation.
 *
 * Fixtures are written to a temp dir at run time, so nothing scannable is added
 * to the repo (a fixture full of medicinal claims would otherwise show up in
 * every future repo-wide sweep).
 *
 * Usage (from repo root):
 *   node .claude/skills/compliance-preflight/test-markup-split.js
 * Exit code: 0 all pass, 1 any failure.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCANNER = path.join(__dirname, 'scan.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-markup-'));

// `expect`  the verdict emoji expected on that line
// `markup`  true  => the finding MUST carry the markup-split annotation
//           false => it must NOT (a raw match must report exactly as before)
//           null  => don't care
const CASES = [
  {
    name: 'SPLIT by <br /> : the bug being fixed',
    line: '<h2>You have low<br />testosterone</h2>',
    expect: '🔴', markup: true,
  },
  {
    name: 'SPLIT by an inline element with a space in it',
    line: '<p>This is clinically<em> </em>proven.</p>',
    expect: '🔴', markup: true,
  },
  {
    name: 'SPLIT by a self-closing tag mid-phrase',
    line: '<p>Our kit is clinically<wbr />proven to work.</p>',
    expect: '🔴', markup: true,
  },
  {
    name: 'SPLIT across an entity-padded gap',
    line: '<h3>You have low&nbsp;<span>testosterone</span></h3>',
    expect: '🔴', markup: true,
  },
  {
    name: 'CONTROL : same claim with no markup reports as before, unannotated',
    line: 'You have low testosterone.',
    expect: '🔴', markup: false,
  },
  {
    name: 'SUPPRESSION : a disclaimer split by a tag must still clear',
    line: '<p>These results do not constitute a<br />diagnosis.</p>',
    expect: '🟢', markup: null,
  },
  {
    name: 'SUPPRESSION : an unsplit disclaimer must still clear',
    line: '<p>This does not constitute a diagnosis.</p>',
    expect: '🟢', markup: null,
  },
  {
    name: 'CONTROL : markup present but no banned phrase stays silent',
    line: '<p>Find out what your <strong>levels</strong> are.</p>',
    expect: null, markup: null,
  },
  {
    name: 'ADVERSARIAL : stripping tags must not JOIN two innocent phrases into a claim',
    // "…proven" ends one element and "clinically" opens the next; the rendered
    // text reads "proven. Clinically" and must not match "clinically proven".
    line: '<li>Lab proven.</li><li>Clinically checked.</li>',
    expect: null, markup: null,
  },
];

let pass = 0, fail = 0;
CASES.forEach((c, i) => {
  const f = path.join(dir, `case-${i}.md`);
  fs.writeFileSync(f, c.line + '\n', 'utf8');

  let out = '';
  try {
    out = execFileSync(process.execPath, [SCANNER, f], { encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');   // exit 2 on HARD is expected
  }

  const verdictLines = out.split('\n').filter((l) => /^(🔴|🟢|🟠)/.test(l));
  const got = verdictLines.length ? verdictLines[0].slice(0, 2).trim() : null;
  const annotated = /found only after stripping markup/.test(out);

  const verdictOk = c.expect === null ? verdictLines.length === 0 : got === c.expect;
  const markupOk = c.markup === null ? true : annotated === c.markup;

  if (verdictOk && markupOk) {
    pass++;
    console.log(`PASS  expected ${c.expect || 'silence'}  got ${got || 'silence'}  ${c.name}`);
  } else {
    fail++;
    console.log(`FAIL  expected ${c.expect || 'silence'}${c.markup === null ? '' : c.markup ? ' +markup-note' : ' -markup-note'}  got ${got || 'silence'}${annotated ? ' +markup-note' : ' -markup-note'}  ${c.name}`);
    if (verdictLines.length) console.log(`      ${verdictLines[0].slice(0, 160)}`);
  }
});

fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n${pass}/${pass + fail} passed.`);
process.exit(fail ? 1 : 0);
