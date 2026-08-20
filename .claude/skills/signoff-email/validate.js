#!/usr/bin/env node
/**
 * Validate a clinical-reviewer sign-off email body BEFORE it becomes a draft.
 *
 * Enforces the format the reviewer has demonstrably answered across every prior
 * thread, and refuses the three shapes that have already cost a round-trip:
 *   - a sub-lettered item (2a / 2b), which she flattens to one letter silently
 *   - an item carrying more than one question, same failure one level up
 *   - a trailing umbrella ("sign off on all of the above"), which is the item
 *     that authorises the work and the item that gets dropped
 *
 * Usage:  node .claude/skills/signoff-email/validate.js <email-body.txt>
 * Exit:   0 clean · 2 at least one HARD · 1 could not run (NEVER a pass)
 */
const fs = require('fs');

const path = process.argv[2];
if (!path) { console.error('usage: validate.js <email-body.txt>'); process.exit(1); }
let raw;
try { raw = fs.readFileSync(path, 'utf8'); }
catch (e) { console.error(`could not read ${path}: ${e.message}`); process.exit(1); }

const lines = raw.replace(/\r\n/g, '\n').split('\n');
const hard = [];
const warn = [];
const add = (a, n, m) => a.push(`${String(n).padStart(4)}  ${m}`);

// --- item segmentation: a top-level item starts "1." / "1)" at line start ---
const ITEM = /^\s*(\d+)[.)]\s+(.*)$/;
const SUBLETTER = /^\s*(\d+)([a-z])[.)]\s/;
const OPTION = /^\s*([A-Z])[.):]\s+\S/;
const UMBRELLA = /(sign[- ]?off on (all|the above)|approve all|all of the above|overall approval|the set as a whole)/i;

const items = [];
lines.forEach((ln, i) => {
  const sub = ln.match(SUBLETTER);
  if (sub) { add(hard, i + 1, `SUB-LETTERED ITEM "${sub[1]}${sub[2]}" — one question = one number = one letter. Split it into two numbered items.`); return; }
  const m = ln.match(ITEM);
  if (m) items.push({ num: Number(m[1]), line: i + 1, head: m[2], body: [], opts: [] });
  else if (items.length) {
    const cur = items[items.length - 1];
    cur.body.push(ln);
    if (OPTION.test(ln)) cur.opts.push(ln.trim()[0]);
  }
});

if (!items.length) add(hard, 0, 'NO NUMBERED ITEMS found. The reviewer answers numbers; an email with none has no reply protocol.');

// --- per-item checks ---
for (const it of items) {
  const text = [it.head, ...it.body].join('\n');
  const qs = (text.match(/\?/g) || []).length;
  if (qs > 1) add(hard, it.line, `ITEM ${it.num} carries ${qs} question marks — it is more than one decision. Split it.`);
  if (qs === 0) add(warn, it.line, `item ${it.num} asks no explicit question; confirm it is answerable by a single letter.`);
  if (it.opts.length < 2) add(hard, it.line, `ITEM ${it.num} has ${it.opts.length} lettered option(s) — every item needs at least A and B so the answer is a letter.`);
  if (/[—―]/.test(text)) add(hard, it.line, `ITEM ${it.num} contains an em dash (banned in outbound copy).`);
  if (/[\w./-]+\.(md|tsx?|jsx?|mjs|json|ya?ml)\b/.test(text)) add(warn, it.line, `item ${it.num} cites a file path; quote the exact copy under ruling inline instead — she rules on text, not on links.`);
}

// --- umbrella: the item that authorises the work is the one that gets dropped ---
if (items.length) {
  const last = items[items.length - 1];
  if (UMBRELLA.test([last.head, ...last.body].join(' ')))
    add(hard, last.line, `TRAILING UMBRELLA at item ${last.num}. This is the item that authorises the work and the one she drops. Either make the specifics constitute the approval (say so in the preamble) or move it to item 1.`);
  // item 1 is the sanctioned position for an approval question; anything
  // between 1 and last is drift toward the trailing shape.
  for (const it of items.slice(1, -1))
    if (UMBRELLA.test([it.head, ...it.body].join(' '))) add(warn, it.line, `item ${it.num} reads like an approval question in the middle; it belongs at item 1 or nowhere.`);
}

// --- numbering must be 1..N contiguous, or the reply cannot be matched back ---
const nums = items.map((i) => i.num);
const expected = nums.map((_, i) => i + 1);
if (nums.join(',') !== expected.join(',')) add(hard, items[0] ? items[0].line : 0, `NUMBERING is ${nums.join(',')}; must be ${expected.join(',')} contiguous from 1.`);

// --- document-level ---
if (!/reply\s+(with\s+)?(just\s+)?the\s+letters?/i.test(raw))
  add(hard, 0, 'MISSING the reply-by-letter instruction. Every answered thread carried it.');
if (/[—―]/.test(raw) && !hard.some((h) => /em dash/.test(h)))
  add(hard, 0, 'Em dash present outside a numbered item (banned in outbound copy).');

// --- report (plain text: a literal escape printed as "[31m" is worse
//     than no colour, and this runs in several terminals) ---
console.log(`signoff-email format check — ${path}`);
console.log(`  ${items.length} numbered item(s): ${nums.join(', ') || 'none'}\n`);
if (hard.length) { console.log(`HARD (${hard.length})`); hard.forEach((h) => console.log('  ' + h)); console.log(''); }
if (warn.length) { console.log(`REVIEW (${warn.length})`); warn.forEach((w) => console.log('  ' + w)); console.log(''); }
if (!hard.length && !warn.length) console.log('clean — format matches the shape she answers.');
process.exit(hard.length ? 2 : 0);
