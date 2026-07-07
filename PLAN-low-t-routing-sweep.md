# PLAN: Low-T Routing Decision Sweep

**Rank:** 1 of 5 (do this first)
**Type:** Compliance doc sweep (no code changes)
**Effort:** ~2-3 hours of edits across ~25 files
**Dependencies:** none

---

## Goal

On 2026-06-04 the business changed how low-testosterone results are handled. The **old rule**: a confirmed T < 12 nmol/L result triggered a founding-member (FM) list CTA / £75 deposit pitch. The **new rule (live, verified in code)**: T < 12 on Kit 1/3 routes to **GP referral with no upsell**, plus an optional consent-gated education nurture (seq-03b Part B, Customer.io campaign 5, deliberately DRAFT). The founding-member list survives only as a dormant standalone non-cash email opt-in; its page was taken down 2026-06-04 (join route returns 410, `/founding-member` redirects to `/kits`). The £75 deposit was shelved earlier, on 2026-05-08.

The code was fixed. The doc layer was not. As of 2026-07-07, **~25 documents still state the old routing as a live rule** — including a results-engine rule doc, a QA checklist, and brand guardrail docs. Any future model or human reading them will re-implement the old, compliance-prohibited behaviour. This sweep removes that regression vector.

## Canonical sources (read these FIRST, before editing anything)

1. `andro-prime/03_compliance/CONTEXT.md` — the whole file (Guardrail 1), especially the Special Case at ~line 127 (CA-014) and line 119. This is the canonical statement of the new rule.
2. `andro-prime/03_compliance/STATE.md` lines ~31-33 — confirms the routing is verified live in `andro-prime/09_website-app/frontend/lib/results/classifier.ts`.
3. `andro-prime/09_website-app/frontend/email-templates/sequences/seq-03b-low-t.md` lines 1-15 — already-corrected description of seq-03b; use its wording as the model.
4. `.claude/skills/decision-sweep/SKILL.md` — this sweep follows its invariants. The two that matter most: **never rewrite dated history** (dated decision docs, anything in `03_compliance/content-approval/`, negotiation logs — at most add a dated forward-pointer), and **never silently edit approved or founder-voice copy** (escalate instead).

## The replacement facts (use these exact facts in every rewrite)

- Low-T (T < 12 nmol/L, Kit 1 or Kit 3) → GP referral card (CA-013), **no upsell, no product CTA**. Changed 2026-06-04.
- Optional follow-up: consent-gated education-only nurture (CA-014 consent UI + CA-015 seq-03b Part B; CIO campaign 5 stays DRAFT until a human go/no-go).
- Founding-member list: dormant standalone non-cash email opt-in only. Never a results CTA. Page down since 2026-06-04 (join = 410, page = redirect to /kits).
- £75 FM deposit: shelved 2026-05-08. Never mention as live.

## SUPERSEDED banner format (copy this style exactly)

```
> ⛔ **SUPERSEDED 2026-06-04 — historical only.** Low-T (T < 12) now routes to GP referral with no upsell + optional consent-gated nurture; the founding-member list is decommissioned as a results CTA (join route 410, page redirects). Canonical rule: `03_compliance/CONTEXT.md` (CA-013/014/015). The £75 FM deposit was shelved 2026-05-08.
```

---

## IMPORTANT: find text by quoted string, not line number

Line numbers below were verified 2026-07-07 but will drift. Always locate the target by searching for the quoted phrase in the file. If a quoted phrase is not found, grep the file for "founding" and assess — it may already be fixed; if so, skip and note it in your report.

## Category A — fix in place (living rule/reference docs)

Rewrite the stale lines to state the new rule. Do not add banners here — these files are read as current truth.

1. `andro-prime/09_website-app/frontend/email-templates/CONTEXT.md`
   - ~86: "Founding-member CTA only appears when T < 12 nmol/L is confirmed" → replace the checklist item with: "Low-T (T < 12) results route to GP referral with no upsell. The only low-T email beyond the notification is the consent-gated education nurture (seq-03b Part B, CIO campaign 5, DRAFT). No founding-member CTA exists in any email."
   - ~108: delete the Liquid-vars table row for `customer.is_founding_member` / `founding_member_listed` (attribute retired).
   - ~119: delete the `event.month_year` row (it existed only for the retired seq-03b Email 7 monthly FM update).
   - ~133: delete the Special Case block "seq-03b Email 7 (monthly founding member update)..." and replace with: "seq-03b Part B (low-T education nurture) is consent-gated; activation in Customer.io is a human go/no-go, never automatic."
   - ~147: while in this file, also fix "The Customer.io account is not yet set up (as of April 2026)" → "Customer.io is live (EU datacenter, workspace 219186); transactional sends verified on a real purchase 2026-06-25/26. Live/draft campaign state lives in `09_website-app/STATE.md`."
2. `andro-prime/07_sales/funnel/supplement-conversion.md` ~46 — "FM CTA gated to T<12 on Kit 1/3 only" → "Low-T (T < 12, Kit 1/3) routes to GP referral, no upsell (2026-06-04 ruling); consent-gated education nurture is the only follow-up". Keep the rest of the guardrail line (system-level rules only; ashwagandha silent) intact.
3. `andro-prime/01_strategy/CONTEXT.md` ~95 — Strategic Constraints row "Founding member CTA | Only triggered by confirmed T < 12 nmol/L..." → "Low-T routing | T < 12 (Kit 1/3) → GP referral, no upsell, consent-gated nurture only (2026-06-04). FM list is a dormant standalone non-cash opt-in, never a results CTA."
4. `andro-prime/06_marketing/positioning/product-marketing-context.md` ~42 AND ~263 — both list "founding-member list opt-in" as the low-T conversion action. Replace with GP referral + consent-gated nurture; ICP 1's conversion action becomes the GP-referral journey (and Kit 1 purchase itself).
5. `andro-prime/06_marketing/content/copy-content-context.md` ~116-127 — rewrite the whole seq-03b block. Old goal "Convert to founding-member list opt-in" and Emails 3/4/7+ (FM mention, scarcity, monthly nurture) are gone. New description: Part A = result notification + GP referral (all low-T customers); Part B = consent-gated education-only nurture, no product sell, no TRT promotion (mirror `07_sales/CONTEXT.md` ~74).
6. `andro-prime/06_marketing/seo-ai-search/seo-content-context.md` ~25 and ~29 — delete the `/founding-member/` row from the indexed-pages table and remove "Founding Member" from the priority crawl order (page removed 2026-06-04; it redirects).
7. `andro-prime/04_products/results-engine/kit3-combined-result-rule.md` ~16, ~44, ~120 — "must route to the founding-member list" → GP referral rule. **Highest-priority file in this category — it is a results-engine rule doc.** Before editing, skim `frontend/lib/results/classifier.ts` (low-T handling ~lines 139-141, 255-260) so your rewrite matches the code.
8. `andro-prime/02_brand/messaging-framework.md` ~41, ~64 — same replacement as item 3.
9. `andro-prime/02_brand/prohibited-terms.md` ~103 — "Founding-member CTA — Kit 1/Kit 3, confirmed T < 12 nmol/L only" → "Founding-member CTA: retired 2026-06-04. Low-T routes to GP referral, no upsell. Never surface an FM CTA from results."
10. `andro-prime/01_strategy/ai-agent-org-chart.md` ~83 — same replacement.
11. `andro-prime/10_launch-ops/qa/results-dashboard.md` ~60, ~74 — QA steps must now verify the GP-referral card (CA-013) appears on T < 12 AND that **no** FM/product CTA appears on that path. Rewrite the verification steps accordingly.
12. Align partially-fixed product docs with their own top banners (body still contradicts banner):
    - `andro-prime/04_products/kits/kit-1-testosterone-health-check.md` ~124 (results table T<12 CTA), ~134, ~163, ~206, ~211, ~222.
    - `andro-prime/04_products/catalogue/non-regulated-tier-v7.md` ~57, ~108, ~156.
    - `andro-prime/04_products/kits/kit-2-energy-recovery-check.md` ~119, ~189 — these say "Kit 2 cannot trigger FM CTA", which presumes an FM CTA exists for Kit 1/3. Replace with: "No kit has an FM CTA (retired 2026-06-04). Kit 2 has no testosterone marker, so it never triggers the low-T GP-referral path."

## Category B — banner only (historical/planning records; do NOT line-edit the body)

Add the banner (format above) at the very top, immediately after the H1. If a top banner already exists, extend it to explicitly cover low-T routing + the shelved deposit instead of adding a second banner.

- `andro-prime/01_strategy/master-implementation-blueprint.md` (stale at ~101, ~344, ~370, ~591) — top banner; also paste a one-line `> ⛔ SUPERSEDED 2026-06-04 — see banner at top.` directly above each of those four stale sections so a reader landing mid-file can't miss it.
- `andro-prime/04_products/kits/kit-1-launch-guide.md` — banner exists at ~3; extend it to cover FM routing (stale body at ~317, 345, 364, 374, 413, 485).
- `andro-prime/04_products/icp-kit-supplement-alignment-april2026.md` — banner exists near ~249; verify it covers ~251 and ~271; extend if not.
- `andro-prime/09_website-app/docs/` historical build records — one top banner each, worded: "⚠️ Historical build-phase record (April-May 2026). Superseded in part: low-T → GP referral, no upsell (2026-06-04); FM deposit shelved 2026-05-08, page taken down 2026-06-04. Do not implement from this document." Files: `implementation-plan.md` (~245, ~406), `app-requirements.md` (~199), `cro-context.md` (~36), `phase5-implementation-plan.md` (~652), `phase7-implementation-plan.md` (~519), `screen-specs/account-screens.md` (~254 — contains customer-facing FM-deposit copy), `screen-specs/biomarker-result-card.md` (~123, ~173).

## Category C — escalate (do NOT silently edit)

- `andro-prime/06_marketing/content/linkedin/keith-launch-posts-v1.md` ~176 — "Founding member places — for the future TRT programme — open at launch." This is Keith's personal-voice draft copy. Do not rewrite his voice. Add directly above the post: `> ⚠️ REVIEW (Keith): FM scarcity framing predates 2026-06-04; the FM page is down. Suggested replacement: "And if your result flags something that needs a doctor, we tell you that straight, with a GP referral letter included."` (Note: no em dashes in the suggested customer-facing sentence — the em dash is banned in customer-facing copy.)
- Anything inside `03_compliance/content-approval/`, dated decision docs (`YYYY-MM-DD-*.md`), and partner negotiation logs: leave untouched; list them in your report as deliberately untouched.

## Category D — already fixed; do not touch (verify only)

`07_sales/sales-gtm-context.md`, `10_launch-ops/CONTEXT.md` ~121, `09_website-app/CONTEXT.md` ~182/196, `04_products/supplements/daily-stack.md` ~88, `04_products/results-engine/results-to-product-mapping.md`, `04_products/results-engine/conversion-rules.md`, `04_products/results-engine/biomarker-copy.md`, `04_products/CONTEXT.md` ~127, `04_products/catalogue/product-catalogue-v7-1.md` ~139, `04_products/kits/kit-3-hormone-recovery-check.md`, `email-templates/sequences/seq-03b-low-t.md`, `08_customer-journey/flows/flow-4-results-to-action.md` (Branch D2 banner at ~227-229), `10_launch-ops/implementation-checklists/qa-gates.md` (banner at ~6).

---

## Edge cases a weaker model would miss

1. **The FM list is dormant, not abolished.** Correct references to the FM list as "a dormant standalone non-cash email opt-in" survive (e.g. in STATE files and strategy docs). Only kill statements that (a) route low-T results to it, (b) present the £75 deposit as live, or (c) present the page/scarcity pitch as live. Do not mass-delete every "founding member" mention.
2. **Two separate decisions are entangled in old docs**: the deposit was shelved 2026-05-08; the routing changed 2026-06-04. Blueprint lines mix both. Banners must cite both dates (the template above does).
3. **seq-03b still exists.** Do not delete seq-03b references — redescribe them (Part A notification + Part B consented nurture). Only "Email 7 monthly founding member update" is fully retired.
4. **The privacy policy also advertises the FM list** (`03_compliance/privacy/privacy-policy.md` ~33, 37, 90, 117). That is a separate launch-blocking item requiring Keith + Ewa (legal doc). Do NOT edit it here — list it in your report as out of scope.
5. **`06_marketing/STATE.md` cold-to-warm bridge line says "editorial-broadcast, never FM"** — that is correct current state; leave it.
6. **Do not tick anything in `audit-2026-07-05-action-list.md`** — that file is a snapshot; ClickUp is the tracker.

## Step-by-step order

1. Read the four canonical sources.
2. Category A files, in the order listed (results-engine and QA docs first — items 7 and 11 — because they are the most dangerous if someone works from them mid-sweep).
3. Category B banners.
4. Category C escalation notes.
5. Final sweep: `rg -in "founding.member|founding member" andro-prime/ --glob "*.md"` — review every remaining hit against the allowed-context list in the acceptance criteria. Also run `rg -in "£75 deposit|founding.member deposit" andro-prime/ --glob "*.md"`.
6. Update `03_compliance/STATE.md`: add a dated line under the low-T routing entry — "Doc-layer sweep completed 2026-07-XX (all live-rule docs corrected or bannered; escalations: keith-launch-posts-v1, privacy policy)." Bump `_Last updated:_`.
7. Write a short sweep report at `03_compliance/decisions/` or alongside the decision record if one exists (if unsure, append to your final message instead): lists of UPDATED / BANNERED / ESCALATED / DELIBERATELY UNTOUCHED.
8. Commit directly to main (no PR). Stage each file by explicit path (`git add <path>` per file — never `git add -A` or `.`). Suggested message: `docs(compliance): sweep 2026-06-04 low-T routing decision through doc layer (25 files)` with a body listing categories. End the message with the Co-Authored-By line per repo convention.

## Acceptance criteria

- [ ] `rg -in "founding" andro-prime/ --glob "*.md"` produces zero hits that state low-T → FM routing, the FM CTA, or the FM deposit **as a live rule**. Every remaining hit is one of: a dated decision/approval/history doc; under a SUPERSEDED/historical banner; a correct description of the dormant non-cash opt-in or of the 2026-06-04 change; the privacy policy (escalated, out of scope); the Category C escalation note itself.
- [ ] The 8 audit-cited locations (audit item at `audit-2026-07-05-action-list.md` line 17) all show new text or a banner.
- [ ] The 5 additional live-rule docs the audit missed (kit3-combined-result-rule, messaging-framework, prohibited-terms, ai-agent-org-chart, qa/results-dashboard) are fixed.
- [ ] Category D files are byte-identical (`git diff` shows no changes to them).
- [ ] `03_compliance/STATE.md` bumped; escalations (Keith's LinkedIn post, privacy policy) explicitly listed for Keith.
- [ ] One commit on main, staged by explicit paths.
