#!/usr/bin/env node
/**
 * Andro Prime compliance pre-flight scanner — the deterministic floor.
 *
 * Greps copy file(s) for literal red-flag language and known risky patterns
 * from `03_compliance/CONTEXT.md`. This is the fast, reliable layer; it does
 * NOT replace the judgement pass (EFSA claim wording, Phase-0 boundary,
 * efficacy-adjacent phrasing) — that is done by Claude with CONTEXT.md loaded,
 * per the skill. It never edits copy.
 *
 * Usage (run from repo root):
 *   node .claude/skills/compliance-preflight/scan.js <file> [<file> ...]
 *
 * Exit code: 2 if any HARD hit (gate publish), 0 otherwise. REVIEW hits do
 * not fail the gate — they require a human/Ewa decision.
 */
'use strict';
const fs = require('fs');

// The HARD / REVIEW / NEG tables are ONE definition, shared with
// `content-status/scan.js` (gate G5, the copy `/wrap` wires into the commit
// gate). They used to be typed out in both files under a comment promising
// they matched; a comment is not a mechanism. See the header of
// `compliance-tables.js` for the full reasoning. (Observation 97.)
const { HARD, REVIEW, NEG } = require('./compliance-tables');

// ── Folded-scalar reconstruction ────────────────────────────────────────────
// NEG is evaluated per physical line. Inside a YAML block scalar (`>-`, `>`,
// `|`, `|-`) a single logical sentence is hard-wrapped across several physical
// lines, so the negating word lands on a different line from the trigger and
// the detector cannot see it. Two live examples in the MDX frontmatter FAQ of
// `inflammatory-markers-blood-test.mdx`: "…retest, not a" / "diagnosis on its
// own." Both are disclaimers; both were reported 🔴 HARD.
//
// Fix: rebuild each frontmatter block scalar into its logical string, keep a
// per-physical-line offset into it, and evaluate the negation over the logical
// SENTENCE containing the trigger as well as the physical line. This is
// strictly ADDITIVE: the original per-line NEG test still runs first and is
// still sufficient on its own, so the change can only downgrade a hit that a
// folded line break was hiding. It can never upgrade or silence anything the
// line-based detector already cleared.
//
// Scope is deliberately the frontmatter region only. Block-scalar syntax is
// unambiguous there; applying the same reconstruction to prose bodies would
// join unrelated text and widen the negation window for no gain.

const FM_BLOCK = /^(\s*(?:-\s+)*)(?![\s#])[^:\n]+:\s*([|>])[-+]?\d*\s*$/;

// Returns an array parallel to `lines`: null when the line is not inside a
// frontmatter block scalar, else { text, start } where `text` is the joined
// logical scalar and `start` is this line's character offset within it.
function foldedMap(lines) {
  const map = new Array(lines.length).fill(null);
  if (lines[0] !== '---') return map;
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i] === '---') { end = i; break; }
  if (end === -1) return map;

  for (let i = 1; i < end; i++) {
    const h = FM_BLOCK.exec(lines[i]);
    if (!h) continue;
    const keyCol = h[1].length;          // column the key starts at, past any "- "
    const folded = h[2] === '>';         // ">" folds newlines to spaces; "|" keeps them
    const body = [];
    let j = i + 1;
    for (; j < end; j++) {
      const l = lines[j];
      if (!l.trim()) { body.push({ n: j, s: '' }); continue; }
      if (l.length - l.trimStart().length <= keyCol) break;
      body.push({ n: j, s: l.trim() });
    }
    while (body.length && !body[body.length - 1].s) body.pop();
    i = j - 1;
    if (!body.length) continue;

    let text = '';
    const offs = [];
    for (const b of body) {
      offs.push({ n: b.n, start: text.length });
      // A blank line is a paragraph break in both styles; in a literal block
      // every line break is real, so only ">" joins with a space.
      text += b.s + (b.s === '' || !folded ? '\n' : ' ');
    }
    for (const o of offs) map[o.n] = { text, start: o.start };
  }
  return map;
}

// The logical sentence containing `offset`. Sentence boundaries are . ! ? and
// hard newlines (a literal-block line break really does end the line).
function sentenceAt(text, offset) {
  const BOUND = '.!?\n';
  let s = Math.max(0, Math.min(offset, text.length - 1)), e = s;
  while (s > 0 && !BOUND.includes(text[s - 1])) s--;
  while (e < text.length && !BOUND.includes(text[e])) e++;
  return text.slice(s, Math.min(e + 1, text.length)).trim();
}

// Trailing contrastive disclaimer, e.g. "treating inflammation IS a GP
// conversation, NOT a supplement one." NEG only looks backwards from the
// trigger, so this shape reads as a bare medicinal claim to it.
//
// Deliberately narrow, because "X, not Y" is also the shape of a real claim
// ("our formula cures inflammation, not just masks it"):
//   · only gerund/noun trigger forms; the finite verbs ("treats", "cures",
//     "diagnoses") are the claim shapes and are excluded outright;
//   · the trigger must sit in SUBJECT position: a short, conjunction-free and
//     comma-free run to a copula;
//   · the correction must be an explicit contrastive negator in the same
//     sentence, within a short tail of the copula.
// Even then the result is 🟠 REVIEW, never 🟢 OK. The shape is suggestive of a
// disclaimer, not proof of one, and a human decides. REVIEW does not fail the
// gate, so the HARD signal stays clean without the copy being cleared by a
// heuristic.
const CONTRASTIVE_TRIGGER = /\b(treating|treatment|treatments|diagnosis|diagnosing|curing)\b/gi;
const COPULA = /\b(is|are|was|were|remains?|stays?)\b/i;
const SPLITTER = /[,;:]|\b(and|or|but|which|that|because|while|when|if)\b/i;
const CONTRAST_TAIL = /^[^.!?\n]{0,60}?[,;]\s+(not|never|rather than|instead of)\b/i;

function trailingContrastiveNegation(sentence) {
  CONTRASTIVE_TRIGGER.lastIndex = 0;
  let m;
  while ((m = CONTRASTIVE_TRIGGER.exec(sentence)) !== null) {
    const after = sentence.slice(m.index + m[0].length);
    const cop = COPULA.exec(after);
    if (!cop) continue;
    const span = after.slice(0, cop.index);          // trigger → copula
    if (span.length > 40 || SPLITTER.test(span)) continue;
    if (CONTRAST_TAIL.test(after.slice(cop.index + cop[0].length))) return true;
  }
  return false;
}

// ── Signed claims-pack exceptions ───────────────────────────────────────────
// A claims pack can authorise a normally-banned term for one specific compliant
// use. CA-028 permits "andropause treatment" and "diagnose andropause" as a
// SEARCH TERM echoed in a question and answered in a non-treatment frame. With
// no channel for that, the scanner returned HARD on exactly the three uses the
// pack designed and Ewa signed, every run, and the drafter was caught between
// two invariants: removing them fails required keyword coverage. Re-arguing a
// reviewer's own sign-off by hand on every pass is what this replaces.
// (Observation 32, 2026-07-26.)
//
// Declared in frontmatter, one per line, so the permission lives in the asset
// with an audit trail instead of in someone's memory:
//
//   preflight_exceptions:
//     - treatment @ CA-028 : keyword echoed in an FAQ question, answered in a
//       non-treatment frame
//     - diagnose @ CA-028 : same
//
// THE LIMITS ARE THE POINT. This is a channel for a signed exception, not a way
// for a file to declare itself compliant:
//
//  1. **Only `guard: true` terms can be exempted** — the ones the table already
//     recognises as having legitimate compliant uses (diagnose / cure / treat).
//     Everything else is an absolute factual claim that no keyword-coverage
//     requirement can justify: ashwagandha, "clinically proven", a false TRT
//     availability claim, "you have low testosterone", healing joints,
//     exaggerated savings. **Ashwagandha is unguarded, so it is inexemptable by
//     construction** — invariant 4, business-ending, no exceptions, ever.
//  2. **An attempt to exempt an inexemptable term is itself a HARD finding**,
//     whether or not the term appears in the file. Someone reaching for that
//     needs stopping, not ignoring.
//  3. **A malformed line is ignored, so the hit stays HARD.** Fail closed: the
//     author wanted an exemption and does not get one silently.
//  4. **The CA number is required and format-checked.** An exception with no
//     traceable sign-off is not an exception.
//  5. **Unused exceptions are reported.** A declaration that no longer matches
//     anything is a stale reservation, and stale reservations are how a
//     permission outlives the copy it was granted for.
//  6. **G5 (`content-status/scan.js`, the commit gate) does NOT honour this
//     channel.** Content-machine asset frontmatter is schema-validated against a
//     closed key list, and this is a pre-flight concept, not an asset field.
const CA_RE = /^CA-\d{3,}$/;
const EXC_HEADER = /^preflight_exceptions:\s*$/;
const EXC_ITEM = /^\s*-\s*(.+?)\s*@\s*(\S+?)\s*:\s*(.+?)\s*$/;

// Parses the frontmatter block only. Returns { items, errors, refusals }.
// `items` are usable exemptions; `refusals` are attempts at an inexemptable
// term; `errors` are malformed or untraceable lines. Both of the latter two are
// reported and neither ever suppresses a hit.
// `blockLines` is a set of 1-based line numbers belonging to the declaration
// block. The scan MUST skip them. An exception naming "treatment" necessarily
// contains the word "treatment", so scanning its own declaration produces a hit
// that the exception then clears — the entry silently marks itself used and a
// stale exemption looks live forever. This is the apparatus-vs-payload defect
// (Observations 64, 132) reproduced inside the fix for Observation 32: the
// document's own control machinery is not copy, and a scanner that cannot tell
// the difference will always grade the control as the thing it controls.
// Caught by the stale-entry test, which is the only case where the difference
// between "used" and "unused" is observable.
function parseExceptions(lines) {
  const out = { items: [], errors: [], refusals: [], blockLines: new Set() };
  if (lines[0] !== '---') return out;
  let end = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i] === '---') { end = i; break; }
  if (end === -1) return out;

  let inBlock = false;
  for (let i = 1; i < end; i++) {
    if (EXC_HEADER.test(lines[i])) { inBlock = true; out.blockLines.add(i + 1); continue; }
    if (!inBlock) continue;
    if (!/^\s*-\s/.test(lines[i])) {
      if (lines[i].trim() && !/^\s/.test(lines[i])) inBlock = false;  // next top-level key
      else out.blockLines.add(i + 1);                                 // wrapped continuation
      continue;
    }
    out.blockLines.add(i + 1);
    const m = EXC_ITEM.exec(lines[i]);
    if (!m) {
      out.errors.push({ line: i + 1, raw: lines[i].trim(), why: 'malformed — expected "- <term> @ CA-NNN : <reason>"' });
      continue;
    }
    const term = m[1], ca = m[2], why = m[3];
    if (!CA_RE.test(ca)) {
      out.errors.push({ line: i + 1, raw: lines[i].trim(), why: `"${ca}" is not a CA number (expected CA-NNN) — an exception with no traceable sign-off is not an exception` });
      continue;
    }
    const owner = HARD.find((p) => p.re.test(term));
    if (!owner) {
      out.errors.push({ line: i + 1, raw: lines[i].trim(), why: `"${term}" matches no HARD term, so it exempts nothing` });
      continue;
    }
    if (!owner.guard) {
      out.refusals.push({ line: i + 1, term, ca, why: owner.why });
      continue;
    }
    out.items.push({ term, ca, why, line: i + 1, re: owner.re, used: 0 });
  }
  return out;
}

// ── Rendered-text normalisation ─────────────────────────────────────────────
// Scanning source for a phrase tests the AUTHORING, not the claim. The claim is
// made in what renders, and markup splits phrases that the rendered page joins:
// `A real doctor<br />designed your report.` puts the banned sentence on screen
// while the source contains no such string, so an exact search returns clean.
// An external review found one this way that the scanner had passed. The gap is
// invisible in the case that matters most — headings, where the strongest claims
// live and where designers most often break lines for typographic reasons.
// (Observation 122, 2026-08-02.)
//
// Strictly ADDITIVE, by the same design as the folded-scalar reconstruction
// above: every pattern is tested against the RAW line first and a hit there
// reports exactly as it did before. The normalised form can only surface a match
// the markup was hiding; it can never silence or downgrade an existing one.
// The negation guard is evaluated against whichever form produced the match, so
// a disclaimer split by a tag still clears rather than becoming a new false
// positive.
const INLINE_TAG = /<\/?[a-z][^>]*>/gi;

function stripMarkup(s) {
  if (!/[<&]/.test(s)) return s;                 // fast path: nothing to strip
  return s
    .replace(INLINE_TAG, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }
const files = process.argv.slice(2);
if (!files.length) die('usage: node scan.js <file> [<file> ...]');

// A HARD term inside a code comment in a .ts/.tsx/.js source file is NOT
// customer-facing copy — it never renders — so it must not fail the gate.
// Weekly-review Observation 17 (2026-07-25): scanning whole source files
// HARD-flagged comment vocabulary ("treated", "fix") that no customer sees,
// training reviewers to expect false positives and eroding trust in HARD hits.
const CODE_FILE = /\.(ts|tsx|js|jsx|mjs|cjs)$/i;

// Line-oriented heuristic (the scanner is line-by-line): true if the match at
// `idx` sits inside a // line comment or a /* */ block comment on this line.
// Conservative — a leading comment marker, a // before the match, or an unclosed
// inline /* enclosing it. It can miss the middle lines of a multi-line block
// comment; those still surface as HARD, which is the safe direction.
function inCodeComment(line, idx) {
  const lead = line.trimStart();
  if (lead.startsWith('//') || lead.startsWith('*') || lead.startsWith('/*')) return true;
  const before = line.slice(0, idx);
  if (before.includes('//')) return true;
  const open = before.lastIndexOf('/*');
  const close = before.lastIndexOf('*/');
  return open !== -1 && open > close;
}

let hard = 0, review = 0, comment = 0, scanned = 0, exempted = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { console.log(`SKIP  ${f} (not found)`); continue; }
  const lines = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').split('\n');
  const isCode = CODE_FILE.test(f);
  const folded = foldedMap(lines);
  const exc = parseExceptions(lines);
  scanned++;

  // Reported BEFORE the scan, so a rejected exemption cannot be lost in the
  // noise of the findings it was trying to suppress.
  for (const r of exc.refusals) {
    hard++;
    console.log(`\n🔴 HARD  ${f}:${r.line}  REFUSED EXCEPTION for «${r.term}» (${r.ca})\n   That term can never be exempted: ${r.why}\n   Only terms with a recognised compliant use (diagnose / cure / treat) are exemptable. Remove the declaration and the term.`);
  }
  for (const e of exc.errors) {
    console.log(`\n🟠 REVIEW ${f}:${e.line}  unusable preflight_exceptions entry — ${e.why}\n   The hit it was meant to cover, if any, is still gated.\n   ${e.raw.slice(0, 140)}`);
    review++;
  }
  lines.forEach((ln, n) => {
    const text = ln.trim();
    if (!text) return;
    // The exception declarations are the document's control apparatus, not its
    // copy. See parseExceptions: scanning them lets an entry satisfy itself.
    if (exc.blockLines.has(n + 1)) return;
    // The logical sentence this physical line's match sits in, when the line is
    // a hard-wrapped fragment of a YAML block scalar. null everywhere else.
    const logical = (idx) => {
      const ctx = folded[n];
      if (!ctx) return null;
      const lead = ln.length - ln.trimStart().length;
      return sentenceAt(ctx.text, ctx.start + Math.max(0, idx - lead));
    };
    // The same line with inline markup stripped and whitespace collapsed, i.e.
    // approximately what a reader sees. Identical to `ln` when there is no
    // markup, in which case none of the `viaMarkup` branches below can fire.
    const stripped = stripMarkup(ln);
    const hasMarkup = stripped !== ln;
    const MARKUP_NOTE = ' — found only after stripping markup: the phrase is split by a tag in the source and joined when rendered';

    for (const p of HARD) {
      let m = ln.match(p.re);
      let viaMarkup = false;
      if (!m && hasMarkup) { m = stripped.match(p.re); viaMarkup = m !== null; }
      if (!m) continue;
      // Folded-scalar offsets index the PHYSICAL line, so they are only
      // meaningful for a raw-line match. Frontmatter block scalars do not carry
      // inline HTML, so skipping this for a markup match costs nothing.
      const sent = (p.guard && !viaMarkup) ? logical(m.index) : null;
      const negHere = NEG.test(viaMarkup ? stripped : ln);
      if (p.guard && (negHere || (sent && NEG.test(sent)))) {
        const src = negHere ? (viaMarkup ? stripped : text) : sent;
        const note = negHere
          ? (viaMarkup ? ' (markup stripped)' : '')
          : ' (logical sentence rebuilt from a folded YAML block)';
        console.log(`\n🟢 OK    ${f}:${n + 1}  «${m[0]}» in a negation/disclaimer${note} — compliant. Verify exact wording in the judgement pass.\n   ${src.slice(0, 140)}`);
        continue;
      }
      if (p.guard && sent && trailingContrastiveNegation(sent)) {
        review++;
        console.log(`\n🟠 REVIEW ${f}:${n + 1}  «${m[0]}»\n   Trailing contrastive disclaimer ("… is X, not Y") in a folded YAML block: reads as a disclaimer rather than a claim, but the shape is ambiguous. Gate NOT failed; a human confirms.\n   ${sent.slice(0, 140)}`);
        continue;
      }
      // Skipped for a markup match: `m.index` indexes `stripped`, not `ln`, so
      // the comment test would read the wrong column. Reporting rather than
      // exempting is the safe direction.
      if (isCode && !viaMarkup && inCodeComment(ln, m.index)) {
        comment++; console.log(`\n🟡 CODE-COMMENT ${f}:${n + 1}  «${m[0]}» inside a code comment — not customer-facing, gate NOT failed. Confirm it is not a rendered string in the judgement pass.\n   ${text.slice(0, 140)}`);
        continue;
      }
      // Last gate before HARD: a signed, scoped, CA-traceable exemption. Only
      // reachable for `guard: true` patterns — parseExceptions refuses the rest.
      const ex = p.guard ? exc.items.find((x) => x.re === p.re) : null;
      if (ex) {
        ex.used++; exempted++;
        console.log(`\n🔵 SIGNED EXCEPTION ${f}:${n + 1}  «${m[0]}» — permitted by ${ex.ca}: ${ex.why}\n   Gate NOT failed. Confirm the use still matches what ${ex.ca} authorised; the pack governs, not this line.\n   ${(viaMarkup ? stripped : text).slice(0, 140)}`);
        continue;
      }
      hard++; console.log(`\n🔴 HARD  ${f}:${n + 1}  «${m[0]}»${viaMarkup ? MARKUP_NOTE : ''}\n   ${p.why}\n   → ${p.alt}\n   ${(viaMarkup ? stripped : text).slice(0, 140)}`);
    }
    for (const p of REVIEW) {
      let m = ln.match(p.re);
      let viaMarkup = false;
      if (!m && hasMarkup) { m = stripped.match(p.re); viaMarkup = m !== null; }
      if (m) { review++; console.log(`\n🟠 REVIEW ${f}:${n + 1}  «${m[0]}»${viaMarkup ? MARKUP_NOTE : ''}\n   ${p.why}\n   ${(viaMarkup ? stripped : text).slice(0, 140)}`); }
    }
  });

  // A permission that no longer covers anything has outlived the copy it was
  // granted for. Silent staleness is how an exemption survives the rewrite that
  // removed its justification, so it is named rather than ignored.
  for (const x of exc.items) {
    if (x.used) continue;
    review++;
    console.log(`\n🟠 REVIEW ${f}:${x.line}  stale preflight_exceptions entry — «${x.term}» (${x.ca}) matched nothing in this file.\n   Either the copy changed and the exemption should be removed, or it was never needed. An exemption nobody can see expiring is one that outlives its sign-off.`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Scanned ${scanned} file(s).  🔴 HARD: ${hard}   🟠 REVIEW: ${review}   🟡 CODE-COMMENT: ${comment}   🔵 SIGNED EXCEPTION: ${exempted}`);
if (exempted) console.log(`${exempted} hit(s) cleared by a signed claims-pack exception declared in frontmatter. They did NOT fail the gate. The pack governs the use, so re-read it if the copy around the term has changed.`);
if (comment) console.log('CODE-COMMENT hits are in source comments (not customer-facing); they do not fail the gate — confirm none is actually a rendered string.');
if (hard) console.log('HARD hits must be removed/replaced before publish (Decision Priority #1).');
if (review) console.log('REVIEW hits need a human/Ewa decision — do NOT silently rewrite Keith\'s copy.');
if (!hard && !review) console.log('Deterministic floor clean. Still do the CONTEXT.md judgement pass (EFSA wording, Phase-0 boundary).');
process.exit(hard ? 2 : 0);
