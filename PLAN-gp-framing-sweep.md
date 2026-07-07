# PLAN: "GP Reviewed the System, Not Your Results" Framing Sweep

**Rank:** 3 of 5
**Type:** Compliance doc + site-copy sweep (small code/content edits possible)
**Effort:** ~2-3 hours
**Dependencies:** run AFTER (or coordinate with) PLAN-ashwagandha-affiliate-rewrite — both touch `pt-programme.md`, so line numbers will have drifted; always locate by quoted string.

---

## Goal

Dr Ewa signs off the **system** (thresholds, recommendation logic, report copy templates). She does **not** review or interpret any individual customer's results. Copy that says "GP-built report", "personalised report", or "a doctor reviews your results" implies bespoke per-patient clinical interpretation — a regulated-activity claim the Phase 0 wellness business must never make.

The canonical ruling already exists: `03_compliance/CONTEXT.md` ~86 (Red-Flag table) and ~131 (Special Case: "Ewa signs off the system, not individual reports"). But as of 2026-07-07 there is a live three-way conflict: the compliance workspace's own corrections worksheet **re-authorises** "GP-built report" as an acceptable chip, and the partner briefs + kit specs still use "GP-built report"/"personalised report" throughout. This sweep aligns everything to the canonical ruling.

## Read FIRST

1. `andro-prime/03_compliance/CONTEXT.md` — full file; especially ~86 and ~131.
2. `andro-prime/02_brand/trust-signals.md` ~28-50 — the SAFE / NOT-SAFE formula. SAFE = past-tense authorship acting on system artifacts ("a GP set / designed / developed / wrote / signed off... the report, the ranges"). NOT SAFE = present-tense action on the customer ("reviews / interprets / checks... your results").
3. `andro-prime/02_brand/CONTEXT.md` — voice rules (customer-facing replacements must match voice; **no em dashes in customer-facing copy**).

## Default replacements (use these unless local context demands otherwise)

| Prohibited phrase | Default replacement |
|---|---|
| "GP-built report" | "GP-designed report" (authorship of the template, not the instance) |
| "personalised report" | "detailed report" or "your report" |
| "reviews your results" / "reviewed by a doctor" / "doctor review" (per-patient) | "a GP designed the ranges and recommendation logic" |
| "personalised report from a GP" | "plain-English report built on GP-designed logic" |

Flag "GP-designed report" as the proposed standard chip in your final report — Ewa confirms it in her sign-off session. It follows the trust-signals SAFE formula, but she has final say on customer-facing wording.

## What is SAFE and must NOT be stripped

- "Dr Ewa Lindo signs off all the report copy" — system-level, past-tense, TRUE. Keep.
- "Built on a GMC-registered GP's guidance" — safe. Keep.
- Factual descriptions of report length/detail — e.g. kit-3's "(longest report of the three kits)" stays; only the word "personalised" goes.

## Worklist (locate by quoted string; line refs verified 2026-07-07)

### A. Fix in place

1. `andro-prime/03_compliance/clinical-governance-copy-corrections.md` — **the conflict source.** At ~95 it proposes "(if a shorter chip is needed: 'GP-built report')" and at ~100 "Clear data, a GP-built report, and actionable recommendations". Replace the proposed chip/lines with the default replacements. Then add at the top of the file, under the H1: `> Ruling note (2026-07-XX): "GP-built report" and "personalised report" are prohibited per 03_compliance/CONTEXT.md (Red-Flag table + "Ewa signs off the system" special case). Earlier suggestions in this worksheet that used those phrases have been corrected in place.` Do not otherwise restructure the worksheet — its "Now:" lines documenting what the live site said are historical evidence; leave them.
2. `andro-prime/04_products/kits/kit-1-testosterone-health-check.md` ~102 — "the test, the lab, and a GP-built report — for £99" → use "GP-designed report" (and remove the em dash if the sentence is customer-facing copy: "...and a GP-designed report, for £99").
3. `andro-prime/04_products/kits/kit-3-hormone-recovery-check.md` ~31 ("full personalised report (longest report of the three kits)"), ~47, ~112, ~254 — apply defaults.
4. `andro-prime/04_products/catalogue/product-catalogue-v7-1.md` ~106 — "full personalised report" → "full detailed report". (~113 already states the correct system-level rule; leave it.)
5. `andro-prime/06_marketing/affiliates/pt-programme.md` ~137, ~306, ~380, ~418 — apply defaults. At ~306 ("GP-built — ...signs off all the report copy") only the chip is wrong; the sign-off sentence is SAFE, keep it.
6. `andro-prime/02_brand/trust-signals.md` ~41 — the pending-Ewa long-form still reads "It is clear, GP-built information about your own data" → "It is clear, GP-designed information about your own data". Add beside the doc's status line: "(wording adjusted 2026-07-XX to remove 'GP-built' per compliance CONTEXT; included in Ewa re-review)".

### B. Escalate via proposal file (approved/partner-facing — do NOT edit in place)

The v2.3 briefs are in the content-approval register (CA-001/CA-002, pending solicitor). Create `andro-prime/06_marketing/affiliates/briefs/v2.4-framing-corrections.md` containing, for each file, the exact current sentence and the exact proposed replacement:

- `PT-Brief-v2.3.md` ~92 — "GP-built — Dr Ewa Lindo signs off all the report copy."
- `Influencer-Brief-v2.3.md` ~30 — "Our GP, Dr Ewa Lindo, signs off the personalised report." and ~90 — "GP-built — ...signs off all the report copy."
- `Gym-Partnership-Onepager-v2.3.md` ~21 — "UKAS-accredited lab, GP-built report, plain-English recommendations."

Head the file: "Proposed v2.4 wording corrections — requires Ewa re-approval; bundle with the pending CA-001/CA-002 solicitor pass. v2.3 files deliberately untouched to preserve the approval trail." Never mark anything APPROVED yourself.

### C. Live site sweep (code/content)

1. Run: `rg -in "GP-built|personalised report|reviewed by a doctor|doctor review|reviews your results" andro-prime/09_website-app/frontend/app andro-prime/09_website-app/frontend/components andro-prime/09_website-app/frontend/content andro-prime/09_website-app/frontend/lib`
2. For hits in marketing pages/components (`app/(marketing)`, `components/marketing`, `components/results-engine`, `lib/results/biomarker-copy.ts` etc.): apply the default replacements. These are customer-facing — no em dashes, keep the voice.
3. **For hits in `frontend/content/blog/*.mdx`: do NOT edit.** Published articles are Ewa-approved under CA-011 (blanket). List each hit in the escalation section of your report instead.
4. Every changed customer-facing string goes into your final report for Ewa's review list, and run the `/compliance-preflight` skill over the set of changed strings if the skill is available; include its findings.
5. Do not deploy anything. Commit only; note in the report that the site changes need a deploy (Keith/dev step) to take effect.

## Edge cases a weaker model would miss

1. **The distinction is per-patient vs system, not "mentions a GP".** Stripping every GP mention would destroy the brand's core trust signal. Only present-tense/per-patient framing goes.
2. **`clinical-governance-copy-corrections.md` is itself a corrections worksheet** — its "Now:" lines quote the (bad) live site copy as evidence. Those quotes are records; fix only its *proposed* wording.
3. **Blog MDX = approved copy.** Editing it silently breaks the CA-011 approval trail. Escalate.
4. **The v2.3 briefs must remain byte-identical** — the fix travels via the v2.4 proposal file.
5. **`pt-programme.md` will have been restructured by the ashwagandha plan** if that ran first. Search by phrase; if a phrase is gone, note it and move on.
6. **Em-dash ban applies to every customer-facing replacement you write** (use comma, colon, or period). Internal doc notes may use em dashes.

## Step-by-step order

1. Read-first files.
2. Section A fixes (start with the conflict source, file 1).
3. Section B proposal file.
4. Section C site sweep + preflight.
5. Verification greps (below).
6. Update `02_brand/STATE.md` and `03_compliance/STATE.md`: dated note "GP-framing sweep done 2026-07-XX; standard chip 'GP-designed report' pending Ewa confirmation; v2.4 brief corrections + blog MDX hits escalated." Bump both `_Last updated:_` dates.
7. One commit to main, staged by explicit path per file, message `docs(compliance,brand): sweep per-patient GP framing to system-level ruling`.

## Acceptance criteria

- [ ] `rg -in "GP-built report|personalised report" andro-prime/ --glob "*.md"` — remaining hits only in: the compliance CONTEXT red-flag table (the rule), trust-signals NOT-SAFE list, dated approval/decision records, the v2.4 proposal file (quoting old text), blog MDX (escalated), and the untouched v2.3 briefs (escalated via proposal).
- [ ] The three-way conflict is dead: `clinical-governance-copy-corrections.md` no longer proposes "GP-built report" and carries the ruling note.
- [ ] `v2.4-framing-corrections.md` exists with exact old→new pairs for all 4 brief locations.
- [ ] Site-code hits fixed or escalated; changed strings listed for Ewa; `/compliance-preflight` findings included; nothing deployed.
- [ ] v2.3 briefs and blog MDX byte-identical (`git diff` clean on them).
- [ ] Both STATE files bumped; one commit on main.
