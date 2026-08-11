#!/usr/bin/env node
/**
 * FRAGMENT PRE-FLIGHT — the mode the prose scanner cannot be (Observation 180).
 *
 *   node fragment-scan.js --fragment <file> --source <file> [--render <path>] [...]
 *
 * WHY THIS EXISTS. `scan.js` is calibrated on prose: sentences with room for a
 * qualifier, a hedge and the education-not-medical-advice framing. A growing
 * share of what must clear is FRAGMENT copy — carousel slides, hooks, spoken
 * script lines, short posts — atomised from a signed-off article. Two failure
 * modes fall outside a prose scan:
 *
 *   1. A compliant source sentence compresses into a non-compliant fragment,
 *      because the qualifier is the first thing cut for length. The fragment
 *      then reads CLEAN in isolation: the claim is implicit rather than stated,
 *      and a scanner looking for stated claims sees nothing.
 *   2. The copy ships as a rendered image, so the visual carries claim weight
 *      the text does not. A text-only scan returns clean and is not a clearance.
 *
 * The remedy for (1) is to refuse to read a fragment alone. Every fragment is
 * checked AGAINST ITS SOURCE, and the checks are about the DELTA:
 *   · a figure in the fragment that is nowhere in the source is unsupported
 *   · a qualifier the source carries and the fragment drops is a sharpened claim
 * The remedy for (2) is that a declared render is reported as an unmet obligation
 * rather than silently ignored: this file cannot read an image and says so.
 *
 * SEPARATE FILE ON PURPOSE. `scan.js` is one half of the pair wired into gate G5
 * via `compliance-tables.js`. Adding modes to it risks the commit gate for no
 * gain. The HARD/REVIEW tables are REQUIRED from that same single definition, so
 * the literal detector cannot drift from the prose scanner's.
 *
 * Zero-dep CommonJS.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { HARD, REVIEW, NEG } = require('./compliance-tables');

/* ------------------------------------------------------------------ args --- */

function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }

const argv = process.argv.slice(2);
const pairs = [];
let cur = null;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--fragment') {
    if (cur) pairs.push(cur);
    cur = { fragment: argv[++i], source: null, render: [] };
  } else if (a === '--source') {
    if (!cur) die('--source given before any --fragment');
    cur.source = argv[++i];
  } else if (a === '--render') {
    if (!cur) die('--render given before any --fragment');
    cur.render.push(argv[++i]);
  } else {
    die(`unrecognised argument "${a}". Usage: --fragment <file> --source <file> [--render <path>]`);
  }
}
if (cur) pairs.push(cur);
if (!pairs.length) {
  console.error('Usage: node fragment-scan.js --fragment <file> --source <file> [--render <path>] [...]');
  process.exit(1);
}

/* ------------------------------------------------------------- extraction --- */

/**
 * Pull the SHIPPABLE strings out of a fragment file.
 *
 * Deck files are JavaScript, and most of their bytes are comments explaining the
 * compliance reasoning. Scanning those would grade the apparatus as the copy —
 * step 2a of the skill, one level in. So a deck is `require`d and only the copy
 * fields are read.
 *
 * `source` is deliberately excluded: it is a citation line ("NICE CKS · BSG"),
 * not a claim, and its years would otherwise read as unsupported figures.
 * `ghost` is excluded because it is a decorative watermark, usually a row count.
 */
function fragmentUnits(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.js') {
    const deck = require(path.resolve(file));
    if (!Array.isArray(deck.slides)) die(`${file} has no slides array`);
    const units = [];
    deck.slides.forEach((s, i) => {
      const label = `slide-${String(i + 2).padStart(2, '0')}`;
      const parts = [];
      if (s.eyebrow) parts.push(s.eyebrow);
      if (s.headline) parts.push(s.headline);
      if (s.body) parts.push(s.body);
      if (Array.isArray(s.items)) for (const it of s.items) parts.push(it[1]);
      if (s.note) parts.push(s.note);
      units.push({ label, text: parts.join(' · ') });
    });
    return units;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '');
  return [{ label: path.basename(file), text: body }];
}

/** The source corpus for SENTENCE matching: prose only, markup flattened. */
function sourceText(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`#>|]/g, ' ');
}

/**
 * The source corpus for FIGURES is deliberately a different one.
 *
 * Sentence matching wants prose, so it strips tags. Figures must not: an MDX
 * article carries real numbers inside component attributes
 * (`<NumberedHeading n="01">`), and stripping the tag takes the figure with it.
 * Running this for the first time reported five invented numbers on the one deck
 * that had already shipped, all of them present in the article — a checker whose
 * false positives land on known-good copy gets switched off within a week.
 *
 * Frontmatter IS excluded: keyword volumes and CSV row ids are metadata, and
 * including them would silently clear a fabricated figure that happened to match
 * one. URLs go too, for the same reason with worse odds.
 */
function sourceDigits(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const body = raw
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/https?:\/\/\S+/g, ' ');
  return new Set((body.match(NUM) || []).map(normaliseNum));
}

/** "01" and "1" are the same figure; only the typography of a list differs. */
function normaliseNum(n) {
  return n.replace(/,/g, '').replace(/^0+(?=\d)/, '');
}

/* -------------------------------------------------------------- numbers --- */

/**
 * Every figure in the fragment must exist in the source.
 *
 * This is the highest-value deterministic check on compressed copy, because
 * compression is exactly where a number gets rounded, merged or misremembered,
 * and a wrong threshold on a slide is an unsubstantiated claim that reads with
 * total confidence. Comparison is on the digit string, so "70 to 90%" matches a
 * source saying "70 to 90 percent".
 */
const NUM = /\d+(?:[.,]\d+)*/g;

function numberFindings(unitText, srcDigits) {
  const out = [];
  const seen = new Set();
  for (const m of unitText.match(NUM) || []) {
    const norm = normaliseNum(m);
    if (seen.has(norm)) continue;
    seen.add(norm);
    if (!srcDigits.has(norm)) out.push(m);
  }
  return out;
}

/* ------------------------------------------------------------ qualifiers --- */

/**
 * The qualifier vocabulary. Deliberately broad: a false "this fragment kept a
 * hedge" is a miss, so anything that softens an assertion counts.
 */
const QUALIFIER = new RegExp(
  '\\b(may|might|can|could|often|usually|sometimes|typically|generally|commonly|' +
  'tend|tends|tended|roughly|about|around|approximately|almost|nearly|some|most|' +
  'many|suggestive|indicative|associated|linked|varies|vary|varying|average|' +
  'on average|worth|guide|guideline|rarely|seldom|likely|unlikely|possible|' +
  'possibly|probably|partly|largely|mostly|up to|at least|isn’t|is not|' +
  'not|never|doesn’t|don’t|cannot|can’t)\\b', 'i');

const STOP = new Set(('a an and or the of to in on for with is are was were be been it its ' +
  'this that these those you your yours he his they them their as at by from but if ' +
  'so than then there here what which who when while into out up down over under ' +
  'about above below more most less least very just also too only own same s t don ' +
  'now i we our us me my').split(/\s+/));

function contentWords(s) {
  return new Set(
    s.toLowerCase()
      .replace(/[^a-z0-9\s’']/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  );
}

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+|\s+·\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12);
}

/**
 * Match a fragment sentence to the source sentence it most likely came from,
 * then report a qualifier the source carried and the fragment dropped.
 *
 * The overlap threshold is intentionally conservative. A missed pairing costs a
 * finding that a human would have to spot anyway; a spurious pairing costs the
 * reviewer's trust in every other finding on the page, which is more expensive.
 */
function qualifierFindings(unitText, srcSentences) {
  const out = [];
  for (const frag of sentences(unitText)) {
    if (QUALIFIER.test(frag)) continue;           // fragment kept a hedge
    /* Two content words is the floor, not three. A short headline is precisely
     * the dangerous case — at feed size it is often the only line read — and a
     * three-word minimum skipped every one of them, which would have made this
     * whole check pass exactly the copy it exists to catch. Caught by case 4 of
     * the suite; the first threshold was set for prose sentences by reflex. */
    const fw = contentWords(frag);
    if (fw.size < 2) continue;
    let best = null;
    let bestScore = 0;
    for (const src of srcSentences) {
      const sw = contentWords(src);
      let shared = 0;
      for (const w of fw) if (sw.has(w)) shared++;
      const score = shared / fw.size;
      if (shared >= 2 && score > bestScore) { bestScore = score; best = src; }
    }
    if (best && bestScore >= 0.6 && QUALIFIER.test(best)) {
      out.push({ frag, src: best, score: bestScore });
    }
  }
  /* Whether the hedge survives ANYWHERE on the same slide changes what the
   * finding means, and the reviewer cannot tell from the line alone. A headline
   * that drops the qualifier while its own body keeps it is a reading-order
   * question: at feed size the headline is often all that is read. A slide with
   * no qualifier at all is a sharpened claim with nothing holding it. */
  const hedgedElsewhere = QUALIFIER.test(unitText);
  for (const o of out) o.hedgedElsewhere = hedgedElsewhere;
  {
  }
  return out;
}

/* -------------------------------------------------------------- literals --- */

function literalFindings(text) {
  const hard = [];
  const review = [];
  for (const rule of HARD) {
    const m = text.match(rule.re);
    if (!m) continue;
    if (rule.guard && NEG.test(text)) continue;   // compliant disclaimer use
    hard.push({ term: m[0], why: rule.why, alt: rule.alt });
  }
  for (const rule of REVIEW) {
    const m = text.match(rule.re);
    if (m) review.push({ term: m[0], why: rule.why });
  }
  return { hard, review };
}

/* ------------------------------------------------------------------ main --- */

let hardCount = 0;
let reviewCount = 0;
const renderObligations = [];

for (const p of pairs) {
  console.log(`\n${'='.repeat(70)}\nFRAGMENT: ${p.fragment}`);

  if (!fs.existsSync(p.fragment)) die(`missing fragment file: ${p.fragment}`);

  /* A fragment cannot be cleared in isolation. This is the whole point of the
   * mode, so an unpaired fragment is a HARD stop, not a warning. */
  if (!p.source) {
    console.log('🔴 HARD  no --source given. A fragment is a compression of something');
    console.log('         signed off; without the source there is nothing to check the');
    console.log('         compression against, and "reads clean" is not evidence.');
    hardCount++;
    continue;
  }
  if (!fs.existsSync(p.source)) die(`missing source file: ${p.source}`);
  console.log(`SOURCE:   ${p.source}`);

  const srcDigits = sourceDigits(p.source);
  const srcSentences = sentences(sourceText(p.source));

  for (const unit of fragmentUnits(p.fragment)) {
    const lines = [];

    const { hard, review } = literalFindings(unit.text);
    for (const h of hard) { lines.push(`  🔴 HARD    "${h.term}" — ${h.why}\n              → ${h.alt}`); hardCount++; }
    for (const r of review) { lines.push(`  🟠 REVIEW  "${r.term}" — ${r.why}`); reviewCount++; }

    for (const n of numberFindings(unit.text, srcDigits)) {
      lines.push(`  🔴 HARD    figure "${n}" appears nowhere in the source.\n              An unsupported number on a slide reads as fact. Verify or cut.`);
      hardCount++;
    }

    for (const q of qualifierFindings(unit.text, srcSentences)) {
      const scope = q.hedgedElsewhere
        ? 'this line only; the slide hedges elsewhere'
        : 'NOTHING on this slide hedges it';
      lines.push(`  🟠 REVIEW  qualifier dropped in compression — ${scope} (overlap ${(q.score * 100).toFixed(0)}%)`);
      lines.push(`              fragment: ${q.frag}`);
      lines.push(`              source:   ${q.src}`);
      reviewCount++;
    }

    if (lines.length) {
      console.log(`\n  [${unit.label}]`);
      lines.forEach((l) => console.log(l));
    }
  }

  /* The image half of Observation 180. This file reads text. If the copy ships
   * as a render, the render is what the reader sees and what carries the claim,
   * so a clean text pass is reported as INCOMPLETE rather than as a pass. */
  if (p.render.length) {
    for (const r of p.render) {
      const exists = fs.existsSync(r);
      const n = exists && fs.statSync(r).isDirectory()
        ? fs.readdirSync(r).filter((f) => /\.(png|jpe?g|mp4|webp)$/i.test(f)).length
        : exists ? 1 : 0;
      renderObligations.push({ fragment: p.fragment, render: r, exists, n });
      if (!exists) { console.log(`\n  🔴 HARD    declared render not found: ${r}`); hardCount++; }
    }
  } else {
    console.log('\n  🟠 REVIEW  no --render declared. If this copy ships as a rendered image,');
    console.log('             it cannot be cleared on text alone; the visual carries claim');
    console.log('             weight the text does not.');
    reviewCount++;
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`FRAGMENT PRE-FLIGHT: ${hardCount} HARD · ${reviewCount} REVIEW`);

if (renderObligations.length) {
  console.log('\nRENDER OBLIGATION — this scanner reads text and cannot read an image.');
  console.log('A human must view these before any clearance is claimed:');
  for (const r of renderObligations) {
    console.log(`  ${r.exists ? '·' : '✗'} ${r.render}${r.exists ? ` (${r.n} file${r.n === 1 ? '' : 's'})` : ' — NOT FOUND'}`);
  }
}

console.log('\nA clean fragment scan is not a clearance. It means the compression was');
console.log('checked against its source and the literal floor passed. Sign-off is Ewa’s');
console.log('(clinical/claims) or Keith’s (business), per CONTEXT.md.');

process.exit(hardCount > 0 ? 2 : 0);
