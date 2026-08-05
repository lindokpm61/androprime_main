#!/usr/bin/env node
/**
 * THE compliance detector tables. One definition, two consumers.
 *
 * Consumers:
 *   · `.claude/skills/compliance-preflight/scan.js`  — the advisory pre-flight scanner
 *   · `.claude/skills/content-status/scan.js`        — gate G5, wired into the commit
 *                                                      gate by `/wrap` Stage 3
 *
 * WHY THIS FILE EXISTS (Observation 97, 2026-07-31; consolidated 2026-08-05).
 * `HARD` and `NEG` were typed out in both scanners, under a comment reading
 * "copied verbatim from compliance-preflight/scan.js". That comment was true
 * when written. It is not a mechanism: nothing imported, nothing checksummed,
 * no test asserted the two agreed, so the first fix applied to one copy would
 * have diverged them silently. This is the same defect and the same remedy as
 * `content-status/db-owned-keys.json` (three copies of the DB-owned key list,
 * already diverged, consolidated 2026-08-01 on Keith's ruling: one definition,
 * the strict superset wins).
 *
 * WHAT WAS AND WAS NOT WRONG WHEN THIS WAS CONSOLIDATED, recorded because the
 * observation overstated it and the correction matters to anyone reading it
 * later. The two tables were byte-identical at the time of the merge, so no
 * verdict on any real copy changed. The suppression machinery in the pre-flight
 * scanner (`FM_BLOCK` / `foldedMap` / `sentenceAt` /
 * `trailingContrastiveNegation`) is genuinely absent from the G5 consumer, but
 * it is scoped to YAML frontmatter block scalars ONLY, and G5 scans the BODY
 * only, so it could never have fired there. Verified 2026-08-05: an identical
 * hard-wrapped disclaimer reports 🟢 OK on line 5 (frontmatter) and 🔴 HARD on
 * line 9 (body) from the SAME scanner. The machinery therefore stays in
 * `compliance-preflight/scan.js` where it applies, and is deliberately not
 * exported here. What is shared is what both consumers actually evaluate.
 *
 * The vocabularies `content-doctor` invariant 2 parses out of
 * `content-status/scan.js` source (`STATUS_ORDER`, `REND_ORDER`, `PLATFORMS`,
 * `FORMATS`, `THUMBS`) are NOT in this file and must not be moved into it —
 * that invariant reads them from that source literally.
 *
 * Zero-dep CommonJS, `require`d by module-relative path from both consumers, so
 * it resolves the same from any working directory.
 */
'use strict';

// HARD — unambiguous banned literals. Presence ⇒ must fix before publish.
// `alt` is the permitted alternative from the CONTEXT.md red-flag table.
// `guard: true` marks terms whose benign/disclaimer use is common enough that a
// negation context clears them (see NEG).
const HARD = [
  { re: /\bashwagandha\b/i, why: 'Silent ingredient — no approved EFSA claim; ASA exposure lands on Andro Prime.', alt: 'Never mention. Remove entirely, any context.' },
  { re: /\bdiagnos(e|es|is|ed|ing)\b/i, why: 'Implies a medical act.', alt: '"Find out what your levels are"', guard: true },
  { re: /\bcure(s|d)?\b/i, why: 'Medicinal claim.', alt: 'Remove entirely.', guard: true },
  { re: /\btreat(s|ed|ing|ment|ments)?\b/i, why: 'Medicinal claim (verify benign use, e.g. data "treatment").', alt: 'Remove entirely in Phase 0.', guard: true },
  { re: /\bclinically proven\b/i, why: 'Misleading without an RCT reference.', alt: 'Remove, or cite a specific study.' },
  { re: /TRT is (now |currently )?available|available now\b.*TRT/i, why: 'False availability claim — TRT is not live (pre-CQC).', alt: '"Be first when we launch TRT"' },
  { re: /you have low testosterone\b/i, why: 'Definitive medical statement.', alt: '"Your results indicate…"' },
  { re: /\b(heals?|healing)\b.*\b(joints?|cartilage|body|tissue)\b/i, why: 'Medicinal claim ("Collagen heals your joints").', alt: '"Vitamin C contributes to normal collagen formation for the normal function of cartilage"' },
  { re: /\b(1[5-9]|[2-9]\d)\s*%\s*off\b|\bbiggest discount\b|\bexclusive deal\b|\blimited time\b|\bhalf[- ]price\b/i, why: 'Inflated/exaggerated savings claim — the partner code is exactly 10%; ASA polices exaggerated savings.', alt: '"10% off" / "£107 with my code (£119 RRP)" — the exact figure only.' },
];

// REVIEW — heuristics that need a human/Ewa decision. Do NOT auto-fix; these
// often sit on Keith's voice and must not be silently rewritten.
// Consumed by compliance-preflight/scan.js only; G5 does not run REVIEW.
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

module.exports = { HARD, REVIEW, NEG };
