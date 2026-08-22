# 00 — Scope lock

**Audit date:** 2026-08-22
**Method:** `design-is` (Dieter Rams' ten principles, 0–3 per principle, max 30)
**Requested by:** Keith, "run the whole thing against design B and D"

## Location note

The `design-is` skill puts its output at repo root. This audit is filed under
`09_website-app/design/` instead, next to the artefact it audits, because this repo keeps
everything inside a numbered workspace and a root-level folder would sit outside that convention.
Same contents, same file names.

## What is being audited

Two candidate placements for the **supplement product shelf** on the Andro Prime blood-test
results page, drawn from `design/mockups/results-range-placement-study.html`:

| Candidate | Name | Lines | Shelf markup |
|---|---|---|---|
| **B** | Report block | 363–483 | `div.supblock` |
| **D** | Declared block | 598–729 | `div.declare` + `div.supblock.declared` |

Candidates **A** (sidebar rail, 241–362) and **C** (full-bleed band, 484–597) are **out of scope**
for this audit. They remain in the file and in the published artifact.

### Audited surface boundary

Only what renders inside each candidate's `div.app` — the mock application shell. That is what a
customer would see.

**Explicitly excluded from the audited surface:** each section's `div.opt-head`, `p.opt-thesis` and
`div.notes`. Those are an author's commentary *about* the design, including a stated preference.
Scoring them would feed the audit its own conclusions and get them back as findings. The evidence
subagents were told to ignore them.

## Primary user and primary task

**Primary user:** a UK man, roughly 35–55, who has paid for a Testosterone Health Check, posted a
blood sample, and is opening his result for the first time. He is not a clinician. He may be
anxious. He is reading on a phone as often as a laptop.

**Primary task:** *understand what his own numbers mean.* Nothing else on the page outranks that.

**The audited element is secondary by definition.** The supplement shelf is commerce placed on a
page whose job is comprehension. Every principle below has to be read against that: the shelf is a
guest on someone else's page, and the design question is what a guest is allowed to do.

## Constraints the design must hold

- **CA-026 clause 2** (`02_brand/messaging-framework.md`, adopted 2026-07-22): *"no result changes
  what we offer or what it costs."* Both candidates must show an identical shelf to every customer.
- **No result-conditional upselling** (Keith, 2026-08-21). Supersedes the all-clear maintenance
  offer. On a GP-referral result the shelf does not render at all.
- **Phase 0 wellness mode.** No TRT, no clinical claims, no prescribing language.
- **EFSA-authorised claim wording only**, and the ashwagandha silent-ingredient rule.
- **No em dashes** in customer-facing copy.
- **Ewa Lindo signs off** all results-report copy. This audit does not and cannot substitute for that.
- **Brand tokens:** Archivo (display/body) + IBM Plex Mono (utility), the existing token palette,
  light and dark.

## Open product decisions that deliberately show as TBC

Both candidates print `Price TBC` and `Dose and salt to be confirmed`. That is not an unfinished
mockup, it is a refusal to print an undecided fact:

- **Pricing architecture is open** (`04_products/STATE.md`): one blended Daily Stack at £34.95, the
  only live figure in `pricing.ts`, versus separate single-nutrient bottles.
- **Zinc dose and salt are open**: spec is 25 mg gluconate, the only available SKU is 15 mg citrate,
  and Ewa's ceiling question is unanswered.

Evidence subagents were not told why these read TBC, so that they would report what a user sees
rather than what the author intended.

## Reference designs

None supplied. The implicit peer set for a UK direct-to-consumer blood-test result page is Thriva,
Medichecks, Numan and Manual. Principle #1 (innovative) is scored against that peer set.

## Declared conflict of interest

**I designed candidate D earlier in this same session, and recommended it.** An author scoring their
own work against a rival is the single largest threat to this audit's validity.

Mitigations actually applied:

1. All five evidence subagents were briefed **blind** — no indication of which candidate was
   authored by whom, which was recommended, or that any recommendation exists.
2. Author commentary was excluded from the audited surface (above), so the subagents could not read
   the case for D and return it as evidence.
3. The Rams anchors are applied verbatim, and the tie-breaker rule (**when uncertain, score lower**)
   is applied to D specifically as the option I have a stake in.
4. The verdict follows mechanically from the scorecard. It is not chosen and then justified.

This does not eliminate the bias. It is disclosed so the scorecard can be read with it in view.

## Evidence gathered (Phase 1)

Five subagents, all forbidden from scoring:

1. **Structural** — element counts, nesting depth, repeated patterns, dead classes, and a
   declaration-by-declaration comparison of the shelf block against a real marker block.
2. **Visual** — spacing and type scales, colour token count, computed contrast in both themes,
   state checklist, orphan styles.
3. **Copy & honesty** — every user-facing string, inflations, dark patterns, label-to-behaviour
   mismatches, EFSA claim wording, em dashes. Briefed to read `03_compliance/CONTEXT.md` and CA-026.
4. **Weight & friction** — JS bytes, requests, TTI, idle animation, reduced-motion, dark-mode
   correctness across all three theme states.
5. **Accessibility** — WCAG contrast per token, focus order, keyboard reachability, landmarks,
   heading hierarchy, colour-only state.

Rendered screenshots (both themes at 1320px, plus 390px) were produced with
`12_operations/automation/shot.js` and given to the visual and accessibility subagents, because this
skill's own visual step expects an `agent-browser` skill that is not installed here.
