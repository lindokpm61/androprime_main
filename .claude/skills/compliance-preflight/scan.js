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

// HARD — unambiguous banned literals. Presence ⇒ must fix before publish.
// `alt` is the permitted alternative from the CONTEXT.md red-flag table.
const HARD = [
  { re: /\bashwagandha\b/i, why: 'Silent ingredient — no approved EFSA claim; ASA exposure lands on Andro Prime.', alt: 'Never mention. Remove entirely, any context.' },
  { re: /\bdiagnos(e|es|is|ed|ing)\b/i, why: 'Implies a medical act.', alt: '"Find out what your levels are"', guard: true },
  { re: /\bcure(s|d)?\b/i, why: 'Medicinal claim.', alt: 'Remove entirely.', guard: true },
  { re: /\btreat(s|ed|ing|ment|ments)?\b/i, why: 'Medicinal claim (verify benign use, e.g. data "treatment").', alt: 'Remove entirely in Phase 0.', guard: true },
  { re: /\bclinically proven\b/i, why: 'Misleading without an RCT reference.', alt: 'Remove, or cite a specific study.' },
  { re: /TRT is (now |currently )?available|available now\b.*TRT/i, why: 'False availability claim — TRT is not live (pre-CQC).', alt: '"Be first when we launch TRT"' },
  { re: /you have low testosterone\b/i, why: 'Definitive medical statement.', alt: '"Your results indicate…"' },
  { re: /\b(heals?|healing)\b.*\b(joints?|cartilage|body|tissue)\b/i, why: 'Medicinal claim ("Collagen heals your joints").', alt: '"Vitamin C contributes to normal collagen formation for the normal function of cartilage"' },
];

// REVIEW — heuristics that need a human/Ewa decision. Do NOT auto-fix; these
// often sit on Keith's voice and must not be silently rewritten.
const REVIEW = [
  { re: /\bimproves? your (mood|energy|libido|sleep|focus|drive)\b/i, why: 'Unauthorised health claim — must use exact EFSA wording (see CONTEXT.md EFSA table).' },
  { re: /\b(fix|fixed|fixes|fixing)\b/i, why: 'Retest/efficacy framing — use "find out how your levels have changed", never "fixed".' },
  { re: /\bdeposit\b|£\s?75\b/i, why: '£75 founding-member deposit was shelved 2026-05-08 — must not appear in new copy. FM list is non-cash.' },
  { re: /\bmagnesium\b/i, why: 'Magnesium removed from Daily Stack (V7.2, Apr 2026) — must not be presented as an ingredient or carry the old fatigue claim.' },
  { re: /\b(secure|securing|reserve|reserving|pay|payment|pre-?order)\b.{0,40}\b(founding member|FM list|the list)\b|\b(founding member|FM list)\b.{0,40}\b(secure|securing|reserve|pay|payment|deposit)\b/i, why: 'FM list is a non-cash email opt-in — no financial/"securing" language.' },
  { re: /\b(founding member|TRT|first cohort)\b/i, why: 'FM/TRT CTA is valid only on a confirmed T < 12 nmol/L (Kit 1/3) result — never inferred from Kit 2 energy markers. Confirm trigger gate.' },
  { re: /\b(zinc|vitamin\s?d3?|b\s?12|methylcobalamin|vitamin\s?c|collagen|biotin|selenium)\b.{0,60}\b(support|supports|help|helps|boost|boosts|improve|improves|maintain|maintains|contributes?|for normal|reduces?)\b/i, why: 'Ingredient + benefit on one line — the benefit must be the EXACT EFSA-approved wording for that ingredient (see CONTEXT.md EFSA table). No rephrasing or extension.' },
  { re: /\bsubstitute for (medical|professional|GP|doctor) (advice|care)\b|\bnot a substitute\b/i, why: 'Verify the medical-advice disclaimer is present and correctly worded; results copy must not claim to replace medical advice.' },
];

// Negation / disclaimer context — a guarded HARD term inside one of these is
// the *compliant* disclaimer ("do not constitute a diagnosis"), not a breach.
const NEG = /\b(do(es)?\s+not|don'?t|doesn'?t|not|never|no|cannot|can'?t|isn'?t|aren'?t)\b[^.]{0,40}\b(diagnos|treat|cure)|(diagnos\w*|treatment|cure)\b[^.]{0,30}\b(advice|only|informational|purposes)\b|informational purposes only|do(es)?\s+not\s+constitute|not a substitute/i;

function die(m) { console.error(`ERROR: ${m}`); process.exit(1); }
const files = process.argv.slice(2);
if (!files.length) die('usage: node scan.js <file> [<file> ...]');

let hard = 0, review = 0, scanned = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { console.log(`SKIP  ${f} (not found)`); continue; }
  const lines = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n').split('\n');
  scanned++;
  lines.forEach((ln, n) => {
    const text = ln.trim();
    if (!text) return;
    for (const p of HARD) {
      const m = ln.match(p.re);
      if (!m) continue;
      if (p.guard && NEG.test(ln)) {
        console.log(`\n🟢 OK    ${f}:${n + 1}  «${m[0]}» in a negation/disclaimer — compliant. Verify exact wording in the judgement pass.\n   ${text.slice(0, 140)}`);
        continue;
      }
      hard++; console.log(`\n🔴 HARD  ${f}:${n + 1}  «${m[0]}»\n   ${p.why}\n   → ${p.alt}\n   ${text.slice(0, 140)}`);
    }
    for (const p of REVIEW) {
      const m = ln.match(p.re);
      if (m) { review++; console.log(`\n🟠 REVIEW ${f}:${n + 1}  «${m[0]}»\n   ${p.why}\n   ${text.slice(0, 140)}`); }
    }
  });
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`Scanned ${scanned} file(s).  🔴 HARD: ${hard}   🟠 REVIEW: ${review}`);
if (hard) console.log('HARD hits must be removed/replaced before publish (Decision Priority #1).');
if (review) console.log('REVIEW hits need a human/Ewa decision — do NOT silently rewrite Keith\'s copy.');
if (!hard && !review) console.log('Deterministic floor clean. Still do the CONTEXT.md judgement pass (EFSA wording, Phase-0 boundary).');
process.exit(hard ? 2 : 0);
