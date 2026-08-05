#!/usr/bin/env node
/**
 * Tests for the signed claims-pack exception channel in `scan.js`.
 *
 * Why this exists (Observation 32, 2026-07-26): a claims pack can authorise a
 * normally-banned term for one specific compliant use. CA-028 permits
 * "andropause treatment" and "diagnose andropause" as a search term echoed in a
 * question and answered in a non-treatment frame, so the scanner returned HARD
 * on exactly the uses Ewa signed, every run, and removing them would have failed
 * the keyword-coverage invariant.
 *
 * THIS IS THE ONE CHANGE IN THE SCANNER THAT CAN WEAKEN THE GATE, so the suite
 * is weighted accordingly: the happy path is three cases and the adversarial
 * half is nine. What is being defended is that a file cannot declare itself
 * compliant. Every rejection path must leave the underlying hit gated.
 *
 * Fixtures are written to a temp dir at run time, so nothing scannable is added
 * to the repo (a fixture full of medicinal claims would otherwise show up in
 * every future repo-wide sweep).
 *
 * Usage (from repo root):
 *   node .claude/skills/compliance-preflight/test-signed-exceptions.js
 * Exit code: 0 all pass, 1 any failure.
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SCANNER = path.join(__dirname, 'scan.js');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'preflight-exc-'));

const ASH = 'ashwa' + 'gandha';   // split so this test file is not itself a hit

// `want`  substrings that MUST appear in the output
// `deny`  substrings that must NOT appear
// `exit`  expected process exit code (2 = gate failed)
const CASES = [
  // ---- the happy path ------------------------------------------------------
  {
    name: 'HAPPY: a guarded term with a valid CA is cleared and cited',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment @ CA-028 : keyword echoed in an FAQ question, answered in a non-treatment frame',
      '---', '', 'Is andropause treatment available on the NHS?',
    ],
    want: ['🔵 SIGNED EXCEPTION', 'CA-028'], deny: ['🔴 HARD'], exit: 0,
  },
  {
    name: 'HAPPY: two exceptions from one pack, both used',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment @ CA-028 : keyword echo',
      '  - diagnose @ CA-028 : keyword echo',
      '---', '', 'Can a GP diagnose andropause?', 'Is treatment available?',
    ],
    want: ['🔵 SIGNED EXCEPTION'], deny: ['🔴 HARD'], exit: 0,
  },
  {
    name: 'HAPPY: the exception does not leak to an unexempted term',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment @ CA-028 : keyword echo',
      '---', '', 'Treatment options vary.', 'This is clinically proven.',
    ],
    want: ['🔵 SIGNED EXCEPTION', '🔴 HARD', 'clinically proven'], deny: [], exit: 2,
  },

  // ---- the adversarial half ------------------------------------------------
  {
    name: 'ATTACK: the silent ingredient can never be exempted',
    file: [
      '---', 'preflight_exceptions:',
      `  - ${ASH} @ CA-028 : we would very much like this to pass`,
      '---', '', `Our stack contains ${ASH}.`,
    ],
    want: ['REFUSED EXCEPTION', '🔴 HARD'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: refusing an inexemptable term fires even when the term is absent',
    file: [
      '---', 'preflight_exceptions:',
      `  - ${ASH} @ CA-028 : pre-emptive`,
      '---', '', 'Entirely innocent copy.',
    ],
    want: ['REFUSED EXCEPTION'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: a non-guarded absolute claim cannot be exempted',
    file: [
      '---', 'preflight_exceptions:',
      '  - clinically proven @ CA-028 : marketing would like this',
      '---', '', 'Our kit is clinically proven.',
    ],
    want: ['REFUSED EXCEPTION', '🔴 HARD'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: no CA number means no exception, and the hit stays gated',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment @ TRUSTME : signed by nobody',
      '---', '', 'Treatment is available today.',
    ],
    want: ['🔴 HARD', 'not a CA number'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: a malformed entry fails closed',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment because we said so',
      '---', '', 'Treatment is available today.',
    ],
    want: ['🔴 HARD', 'malformed'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: the block is ignored outside frontmatter',
    file: [
      'preflight_exceptions:',
      '  - treatment @ CA-028 : declared in the body, which is not a signed place',
      '', 'Treatment is available today.',
    ],
    want: ['🔴 HARD'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: a term matching no HARD pattern exempts nothing',
    file: [
      '---', 'preflight_exceptions:',
      '  - bananas @ CA-028 : irrelevant',
      '---', '', 'Treatment is available today.',
    ],
    want: ['🔴 HARD', 'matches no HARD term'], deny: ['🔵 SIGNED EXCEPTION'], exit: 2,
  },
  {
    name: 'ATTACK: an unused exception is reported as stale, not silently kept',
    file: [
      '---', 'preflight_exceptions:',
      '  - treatment @ CA-028 : the copy this covered has since been rewritten',
      '---', '', 'Find out what your levels are.',
    ],
    want: ['stale preflight_exceptions'], deny: ['🔵 SIGNED EXCEPTION', '🔴 HARD'], exit: 0,
  },
  {
    name: 'CONTROL: with no exceptions block the gate behaves exactly as before',
    file: ['---', 'slug: x', '---', '', 'Treatment is available today.'],
    want: ['🔴 HARD'], deny: ['🔵 SIGNED EXCEPTION', 'preflight_exceptions'], exit: 2,
  },
];

let pass = 0, fail = 0;
CASES.forEach((c, i) => {
  const f = path.join(dir, `case-${i}.md`);
  fs.writeFileSync(f, c.file.join('\n') + '\n', 'utf8');

  let out = '', code = 0;
  try {
    out = execFileSync(process.execPath, [SCANNER, f], { encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
    code = e.status;
  }

  // Assertions run over the FINDINGS only. The summary block always names every
  // bucket ("🔴 HARD: 0   🔵 SIGNED EXCEPTION: 0"), so matching the whole output
  // would make every `deny` trivially true and the suite would pass vacuously.
  const findings = out.split('─'.repeat(60))[0];

  const problems = [];
  if (code !== c.exit) problems.push(`exit ${code}, wanted ${c.exit}`);
  for (const w of c.want) if (!findings.includes(w)) problems.push(`missing "${w}"`);
  for (const d of c.deny) if (findings.includes(d)) problems.push(`must not contain "${d}"`);

  if (!problems.length) { pass++; console.log(`PASS  ${c.name}`); }
  else { fail++; console.log(`FAIL  ${c.name}\n      ${problems.join('; ')}`); }
});

fs.rmSync(dir, { recursive: true, force: true });
console.log(`\n${pass}/${pass + fail} passed.`);
process.exit(fail ? 1 : 0);
