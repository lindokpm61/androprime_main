#!/usr/bin/env node
/**
 * The results engine's OWN verdict vocabulary, read from the engine at run time.
 *
 * Consumer: `.claude/skills/compliance-preflight/scan.js` (the verdict-vocabulary
 * detector). Deliberately NOT in `compliance-tables.js`: those tables are literal
 * line patterns shared with G5 (`content-status/scan.js`), which scans
 * content-machine assets. Marker-row panels exist only in the app's marketing
 * pages and its mockups, so a rule about them could never fire in G5. Same
 * reasoning as the folded-scalar machinery, which also stays in scan.js.
 *
 * WHY THIS FILE EXISTS (2026-09-01).
 * The kit and homepage sample-report panels graded markers as Normal /
 * Borderline / Low, a vocabulary the product does not use. Keith retired it on
 * 2026-08-17 and the fix was applied to `/kits/hormone-recovery` alone, because
 * that was the page the pre-flight happened to be pointed at. It was still live
 * on `/`, on `/kits/testosterone` and in the direction mockup two weeks later,
 * and one instance was worse than a wrong word: `/kits/testosterone` asserted
 * free testosterone was "Low" on a warn bar at 0.244, where `classifier.ts`
 * returns `ft-low` only below the lab's referenceLow of 0.198. The page claimed
 * a deficiency the engine does not find, in colour, and a coloured bar IS a
 * verdict.
 *
 * A ruling applied by hand to the file somebody was looking at is not a control.
 * The 2026-08-17 entry says so about itself: "Each row now carries a comment
 * naming its state and threshold; that is a convention, not a check."
 *
 * THE LIST IS DERIVED, NOT TYPED. The allowed words are read out of
 * `lib/results/resultSeverity.ts`'s `BADGES` map, which is the same map
 * `StatusBadge` renders from, so the scanner and the customer's result card
 * cannot drift. Adding a state to the engine teaches the scanner about it in the
 * same commit. This is the `compliance-tables.js` lesson (Observation 97) applied
 * one layer out: a duplicated fact is invisible exactly while the copies agree.
 *
 * Zero-dep CommonJS, path resolved module-relative, so it loads the same from
 * any working directory.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(
  __dirname, '..', '..', '..',
  'andro-prime/09_website-app/frontend/lib/results/resultSeverity.ts'
);

// Retired verdict words: the half that CANNOT be derived, because a map of what
// the engine says has nothing to say about what it used to say. Kept short and
// evidenced rather than open-ended — every entry below is a word that was
// actually found grading a marker on a live surface.
//
// "Optimal" is deliberately absent and the absence is load-bearing. It was
// retired as the label for merely-in-range (Keith, 2026-08-07) but SURVIVES on
// testosterone, where thresholds.md records the >20 band as a signed product
// choice. It is therefore a current label, and `assertDisjoint` below is what
// stops anyone re-adding it here and flagging approved copy.
const RETIRED_VERDICTS = [
  'Normal',      // the one that mattered most: the exact word the wedge exists to challenge
  'Borderline',  // the old amber label, replaced by Monitor
  'Low',         // asserted a deficiency the engine does not return
  'High',
  'Elevated',
  'Deficient',
  'Abnormal',
];

function fail(msg) {
  const e = new Error(msg);
  e.badgeLabelLoad = true;
  throw e;
}

/**
 * Returns { labels, lower, retired, source }.
 *
 * Throws rather than returning an empty set. A guard whose own input step can
 * fail quietly inherits that failure as a wrong answer instead of an error: an
 * empty allowlist would flag every verdict on every page, and an allowlist that
 * silently swallowed a parse failure would clear every one of them. Neither is
 * an acceptable default, so the caller is told the vocabulary could not be read.
 */
// The path is a parameter so the guards below are testable. Production callers
// pass nothing and get the engine.
function loadBadgeLabels(sourcePath) {
  const SRC = sourcePath || SOURCE;
  if (!fs.existsSync(SRC)) {
    fail(`cannot read the engine's verdict vocabulary: ${SRC} does not exist. ` +
         'The verdict detector has no allowlist without it and will not guess one.');
  }
  const src = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

  // Scope to the BADGES record rather than the whole file, so a future object
  // that happens to carry a `label:` key cannot widen the allowlist by accident.
  const open = src.indexOf('export const BADGES');
  if (open === -1) fail(`no \`export const BADGES\` in ${SRC} — has the map been renamed?`);
  const close = src.indexOf('\n}', open);
  if (close === -1) fail(`could not find the end of the BADGES map in ${SRC}.`);

  const region = src.slice(open, close);
  const labels = new Set();
  for (const m of region.matchAll(/\blabel:\s*'([^']+)'/g)) labels.add(m[1]);

  // UNKNOWN_STATE is a real rendered verdict (the fail-quiet badge), so a page
  // may legitimately show it. It sits outside the record.
  const unknown = /UNKNOWN_STATE[^=]*=\s*\{\s*label:\s*'([^']+)'/.exec(src);
  if (unknown) labels.add(unknown[1]);

  // Anchors can move; a parse that "succeeds" with two labels is a failure
  // wearing a success. The map has been six or more distinct labels since it
  // was made exhaustive on 2026-08-07.
  if (labels.size < 5) {
    fail(`only ${labels.size} verdict label(s) parsed out of ${SRC} ` +
         `(${[...labels].join(', ') || 'none'}). Expected at least 5 — the parse is wrong, ` +
         'not the engine. Fix this file rather than trusting the result.');
  }

  const lower = new Set([...labels].map((l) => l.toLowerCase()));

  // The one assertion that stops this file lying. If a retired word is ever
  // re-adopted by the engine, the scanner must learn that from the engine and
  // not keep flagging copy the product now ships.
  const collision = RETIRED_VERDICTS.filter((r) => lower.has(r.toLowerCase()));
  if (collision.length) {
    fail(`«${collision.join('», «')}» is BOTH a current engine label and listed as retired here. ` +
         'The engine wins: remove it from RETIRED_VERDICTS in badge-labels.js.');
  }

  return { labels, lower, retired: RETIRED_VERDICTS, source: SRC };
}

module.exports = { loadBadgeLabels, RETIRED_VERDICTS, SOURCE };
