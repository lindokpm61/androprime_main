# PLAN: Ashwagandha Affiliate-Doc Rewrite + v2.2 Quarantine

**Rank:** 2 of 5
**Type:** Compliance doc rewrite + file quarantine (no code changes)
**Effort:** ~2 hours
**Dependencies:** none (independent of the low-T sweep; both can run in either order)

---

## Goal

Ashwagandha KSM-66 is in the Daily Stack but has no approved EFSA health claim. The root rule (root `CLAUDE.md` Guardrail 3 + `03_compliance/CONTEXT.md` ~129): **never name it in anything partner-facing or partner-scripted — anywhere, ever.** The v2.2 partner briefs breached this by printing the ingredient name inside their own forbidden-lists; v2.3 fixed it with an approved-claims **allowlist** plus scripted answers that never name the ingredient. The rule at `03_compliance/CONTEXT.md` ~129 ends: "Never regress this."

The v2.3 partner-facing briefs are clean (verified 2026-07-07: zero matches). But the internal **programme docs** that generate and script partner behaviour still carry the v2.2 breach pattern — they name the ingredient in forbidden-lists and literally script partners to say the word "ashwagandha" aloud to clients. The audit marks this as **must be done before any affiliate unfreeze**, and the LTV model calls affiliate "the only paid channel that's profitable" — so this rewrite is the gating precondition for reopening the channel.

## Read FIRST (in this order)

1. `andro-prime/03_compliance/CONTEXT.md` — full file; especially the affiliate/silent-ingredient rules (~129) and the EFSA approved-claims allowlist.
2. `andro-prime/06_marketing/affiliates/briefs/PT-Brief-v2.3.md` and `Influencer-Brief-v2.3.md` — study exactly how they handle ingredient questions without naming anything. **Copy their pattern; do not invent your own.**
3. `andro-prime/06_marketing/affiliates/CONTEXT.md` — the freeze status and workspace rules.

## The rewrite pattern

- **Forbidden-lists must not name the ingredient.** Replace entries like `"Ashwagandha" — anywhere, ever` with an allowlist statement: "Partners may only make the claims printed on the approved-claims card. Any statement about any ingredient not on that card is prohibited."
- **Scripted answers must not name it either** — that is the exact v2.2 breach. Replace scripts like "If a client asks specifically about ashwagandha — answer: 'I'm not allowed to make claims about ashwagandha...'" with the v2.3-style deflection, e.g.: "If a client asks about any specific ingredient: 'I can only speak to the approved claims on the card. The full formulation and evidence are on the Andro Prime site.'" (Match the actual v2.3 wording you find in step 2.)
- **One internal-only rationale block may keep the name.** Each programme doc may retain a single block, clearly fenced and headed `> INTERNAL ONLY — never copy any part of this block into partner-facing material or partner scripts.`, that explains the rule with the ingredient named once. Everything else in the doc must be name-free.

## Files to rewrite (find by quoted string, not line number — verified 2026-07-07)

1. `andro-prime/06_marketing/affiliates/pt-programme.md` — hits at ~9, 176, 255, 274, 328 (forbidden-list entry), 339-345 ("Section C: The Ashwagandha rule (absolute)" incl. 600mg formulation detail and the spoken-answer script at ~345), 427, 515, 534, 633. Restructure Section C into the fenced internal-only block; convert every scripted/partner-visible mention to the allowlist pattern.
2. `andro-prime/06_marketing/affiliates/influencer-programme.md` — hits at ~9, 199, 249 (forbidden-list), 319 (audit-flag term list). Same treatment. For the audit-flag term list (terms to scan partner content for): keep the scanning intent but move the named term into the internal-only block ("scan for the silent ingredient's name — see internal block"), so the doc section that could be shared never prints it.
3. `andro-prime/06_marketing/affiliates/influencer/partner-icp-influencer-uk.md` — ~175, 177, 178: this scripts the content of the brief PDF sent to partners ("Don't mention ashwagandha..."). Rewrite the specified PDF content to the allowlist phrasing. The PDF spec must never contain the name.
4. Assess-and-fix (internal analysis docs; fix only where text is destined for partners or scripts speech, otherwise mark the mention internal-only):
   - `andro-prime/06_marketing/affiliates/partner-icp-content-tilt-brief.md` ~70, 107, 159
   - `andro-prime/06_marketing/affiliates/pt-network/partner-icp-pt-uk.md` ~159
   - `andro-prime/06_marketing/affiliates/commission-structure.md` ~335

## Quarantine the v2.2 binaries

In `andro-prime/06_marketing/affiliates/briefs/`:

1. Create `superseded-v2.2/` with a `README.md`: "Superseded by the v2.3 allowlist briefs. Never send these to anyone. Kept for record only. The v2.2 files breach the silent-ingredient rule (`03_compliance/CONTEXT.md`)."
2. `git mv` these 10 files into it: `PT-Brief-v2.2.docx`, `PT-Brief-v2.2.pdf`, `PT-Attestation-v2.2.docx`, `PT-Attestation-v2.2.pdf`, `Influencer-Brief-v2.2.docx`, `Influencer-Brief-v2.2.pdf`, `Influencer-Attestation-v2.2.docx`, `Influencer-Attestation-v2.2.pdf`, `Gym-Partnership-Onepager-v2.2.docx`, `Gym-Partnership-Onepager-v2.2.pdf`.
3. Delete the 5 stale LibreOffice lock files (`.~lock.*.pdf#`). Check `git status` first: if untracked, plain-delete; if tracked, `git rm`. They indicate files were once open in LibreOffice — if a lock file reappears after deletion, stop and tell Keith (a program still has the file open).

## Do NOT touch

- The five v2.3 files (`PT-Brief-v2.3.md`, `Influencer-Brief-v2.3.md`, `Gym-Partnership-Onepager-v2.3.md`, `PT-Attestation-v2.3.md`, `Influencer-Attestation-v2.3.md`) — they are clean AND they sit in the content-approval register as CA-001/CA-002 pending solicitor sign-off. Any edit would invalidate the approval trail. (Their "GP-built report" wording issue is handled by a separate plan, via a v2.4 proposal file, not by editing them.)
- `03_compliance/content-approval/` records and the root `CLAUDE.md` Guardrail 3 (the root file deliberately names the ingredient once — that is by design; leave it).

## Edge cases a weaker model would miss

1. **The goal is not zero mentions of the word.** The rule must survive, discoverable, in internal docs — otherwise the next writer doesn't know it exists. The breach is the name appearing in (a) anything sent to partners, (b) anything partners are scripted to say, (c) forbidden-lists that get copied into partner materials. Fence, don't erase.
2. **Do not "improve" the deflection script wording beyond the v2.3 pattern.** The v2.3 briefs were built to pass compliance; match them.
3. **The rewrite does not unfreeze affiliates.** The channel stays FROZEN (a separate Keith decision). Do not change any freeze language.
4. **The other unfreeze precondition** (the "GP reviewed the system" framing sweep, a separate plan) is still open — note that in your report so nobody reads this commit as "affiliates ready".
5. **Binary files can't be grepped** — after the move, the acceptance grep will pass trivially for them; the quarantine (not a text fix) is the control for the binaries.
6. Commit conventions: stage by explicit path only (never `git add -A`/`.`), commit straight to main, message style `docs(affiliates): ...`, end with the Co-Authored-By line.

## Step-by-step order

1. Read the three read-first files; extract the exact v2.3 deflection wording.
2. Rewrite `pt-programme.md` (largest file, sets the pattern).
3. Rewrite `influencer-programme.md`, then `partner-icp-influencer-uk.md`.
4. Assess-and-fix the three secondary docs.
5. Quarantine binaries + delete lock files.
6. Verification grep (below).
7. Update `andro-prime/06_marketing/STATE.md` (affiliate/PT section): add dated line "Affiliate-doc silent-ingredient rewrite done 2026-07-XX (audit precondition 1 of 2 for unfreeze; GP-framing sweep still open; unfreeze remains a Keith decision)." Bump `_Last updated:_`. If `06_marketing/affiliates/CONTEXT.md` tracks preconditions, note it there too.
8. One commit to main.

## Acceptance criteria

- [ ] `rg -in "ashwagandha|ksm" andro-prime/06_marketing/ --glob "*.md"` — every hit is inside a block explicitly headed INTERNAL ONLY (or is a historical dated record). Zero hits in forbidden-lists, partner scripts, or PDF-content specs.
- [ ] `rg -in "ashwagandha|ksm" andro-prime/06_marketing/affiliates/briefs/ --glob "*.md"` — zero hits.
- [ ] `git diff --stat` shows the five v2.3 brief/attestation files unchanged.
- [ ] `briefs/superseded-v2.2/` contains the 10 binaries + README; `ls andro-prime/06_marketing/affiliates/briefs/` shows no `*v2.2*` and no `.~lock*` at the top level.
- [ ] The scripted client-question answer in both programme docs matches the v2.3 brief pattern and names no ingredient.
- [ ] `06_marketing/STATE.md` bumped with the precondition note; report states affiliates remain FROZEN.
- [ ] One commit on main, staged by explicit paths.
