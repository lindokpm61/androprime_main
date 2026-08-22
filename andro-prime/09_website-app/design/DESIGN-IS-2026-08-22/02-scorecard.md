# 02 — Scorecard

Anchors applied verbatim from the `design-is` Phase 2 rubric. Scores are 0–3 integers, principles
equally weighted, maximum 30.

Three rules were applied throughout, and applied hardest to D, which the auditor authored:
**tie-breaker — when uncertain between two scores, pick the lower**; **score worst, not mean**; and
**no bonuses, no weights**.

Evidence anchors refer to `01-evidence.md`.

---

## Candidate B — Report block

**1. Good design is innovative — Score: 1/3**
Evidence: §B1 — the shelf reproduces the standard inline product-recommendation pattern used across
the UK DTC blood-test peer set, and its one novel move (the disclaimer chip) is an 8px reuse of an
existing component.
Justification: 1 rather than 2 because nothing here refreshes the pattern with a clear improvement;
the design's distinguishing idea is to be *less* visible than the norm, which is not innovation.

**2. Good design makes a product useful — Score: 2/3**
Evidence: §A6, §B4.1 — the marker block completes the primary task intact; the shelf is adjacent
surface, and "See the range" is a decoy action pointing at content already on screen.
Justification: 2 rather than 3 because the anchor for 3 requires no decoy actions, and there is one.

**3. Good design is aesthetic — Score: 2/3**
Evidence: §B3 (cards at 1.00:1 against their own ground), §D (`.pdose` inheriting an 8.5px UA
margin into a 3px card rhythm).
Justification: 2 rather than 1 because there are exactly two visual inconsistencies inside the
audited block and no jarring violation; B's two vertical rules measure identical at x=788.4.

**4. Good design makes a product understandable — Score: 1/3**
Evidence: §A5 (the shelf has no heading element), §A12 (jargon: nmol/L, Ref:, methylcobalamin,
"salt", "DOSE TBC"), §B4.4 ("View →" and "See the range" are two unstated destinations).
Justification: 1 rather than 2 because more than one control is unclear and jargon is present
throughout, which is the anchor for 1 exactly.

**5. Good design is unobtrusive — Score: 2/3**
Evidence: §B1 — the shelf adopts the report's grammar wholesale and does not compete visually with
the content around it.
Justification: 2 rather than 3 because the chrome is quiet but visible; the deception created by
that quietness is scored under #6, not double-counted here.

**6. Good design is honest — Score: 0/3**
Evidence: §B1 (every frame-level property byte-identical to a clinical marker block, including the
SVG icon path and the heading text), §B2 (the clinical status-chip component carries a marketing
disclosure), §A12 (hidden cost: purchase-shaped cards, a "Subscriptions" nav, no billing terms in
frame), §B4 (four label-to-behaviour mismatches).
Justification: 0 rather than 1 because the anchor for 0 is *any* deceptive flow, and disguised
advertising in which commerce is structurally indistinguishable from clinical content — with the
result-status component itself repurposed to carry the disclaimer — is the strongest form of it.

**7. Good design is long-lasting — Score: 2/3**
Evidence: §D — uppercase mono eyebrows at .13em tracking, and a hairline-rule grid.
Justification: 2 rather than 3 because two current trend markers are present, and rather than 1
because there are no more than that inside B's block.

**8. Good design is thorough down to the last detail — Score: 0/3**
Evidence: §A6 — empty, loading, error, success and disabled are all absent, and `.btn.ghost` has no
hover rule at all.
Justification: 0 by the anchor, which sets 0 at four or more missing states; five are missing.

**9. Good design is environmentally friendly — Score: 2/3**
Evidence: §A10 (0 bytes JS, 0 idle animation), §A8 (dark mode fully honoured), §A7
(`prefers-reduced-motion` does not reset `.parrow`).
Justification: 2 rather than 3 because the anchor for 3 requires reduced-motion respected and three
elements still transition; motion is otherwise gated to hover, which is the anchor for 2.

**10. Good design is as little design as possible — Score: 1/3**
Evidence: §B4.1 (the "See the range" CTA), §B1 (the non-personalisation promise stated three ways:
chip, explanation column, recommend strip).
Justification: 1 rather than 2 because three elements are removable without breaking the task, which
is the anchor for 1.

### **Total: B = 13/30**

---

## Candidate D — Declared block

**1. Good design is innovative — Score: 2/3**
Evidence: §C1 — explicitly declaring commerce as commerce, in an inverted full-width bar before the
block begins, is not present in the UK DTC blood-test peer set.
Justification: 2 rather than 3 because the anchor for 3 requires the new pattern to ship *with
restraint*, and the same promise is restated three times (§C, §D).

**2. Good design makes a product useful — Score: 2/3**
Evidence: §A6, and the same decoy "See the range" control as B (§C6 context).
Justification: 2 for the same reason as B; the primary task completes and one decoy action remains.

**3. Good design is aesthetic — Score: 1/3**
Evidence: §C2 — **the shelf's vertical rule sits at x=810.9 against the marker block's x=788.4, a
22.5px misalignment in the same column of the same page**. Plus §C3 (a dead 2px border), §C4
(off-palette opacity colours), §C5 (a unique 1.02fr split producing an 8.6px asymmetry, a one-off
19px pad, a 2px gap override).
Justification: 1 rather than 2 because the anchor for 1 is met twice over: five inconsistencies, and
separately one jarring violation. The misalignment alone qualifies.

**4. Good design makes a product understandable — Score: 1/3**
Evidence: §A5 (no heading element; D's block title is a `<p>`), §C6.1 ("End of your results" is
false — results content continues below it), §C6.3 (two sentences that contradict each other),
§A12 (the same jargon as B).
Justification: 1 rather than 2 because more than one control and more than one statement are
unclear. D improves the framing and adds two new comprehension defects doing it.

**5. Good design is unobtrusive — Score: 1/3**
Evidence: §C1 — the declaration bar is the second-largest text in the app at 21px/800 on a
full-bleed inverted ground, and D's `.app` is 122px taller than B's (+12.5%).
Justification: 1 rather than 2 because the block does not recede; it is the loudest element on the
page after the result number itself. This is deliberate and it is still what the principle measures.

**6. Good design is honest — Score: 1/3**
Evidence: §C1 (disguised advertising mitigated at the surface, unchanged in structure — same layout
classes, same SVG icon, same "What this means" heading, same trailing recommend strip), §C6.2
("Your numbers above do not point at any of these" is a per-reader conclusion inside a block that
claims not to read results), §C7 (a conditional-absence state asserted but not implemented, with the
bar not tied to the shelf's presence), §A12 (the same hidden-cost finding as B).
Justification: 1 rather than 0 because a full-width declaration in the reader's path is a material
reduction in deception, not a cosmetic one; 1 rather than 2 because one dark pattern survives, which
is the anchor for 1 exactly.

**7. Good design is long-lasting — Score: 1/3**
Evidence: §D — uppercase mono eyebrows, a hairline-rule grid, and additionally a full-bleed inverted
band with an oversized uppercase display headline.
Justification: 1 rather than 2 because three current trend markers are present against B's two, and
the third is the element D is built around.

**8. Good design is thorough down to the last detail — Score: 0/3**
Evidence: §A6 (five states missing), §C7 (D's own copy asserts a state the design does not
implement, and the declaration bar would survive the shelf's absence).
Justification: 0 by the anchor. D is marginally worse than B here, having promised a state it did
not build, but the floor is already reached.

**9. Good design is environmentally friendly — Score: 2/3**
Evidence: §A10, §A8, §A7 — identical to B; the +842-byte delta is 0.6% of wire weight and
`domInteractive` ordering flips between runs.
Justification: 2, identical to B and for the identical reason.

**10. Good design is as little design as possible — Score: 1/3**
Evidence: §C3 (the dead border), §C6.1 (a false eyebrow), §C6.2 (a removable sentence), the "See the
range" CTA, and the promise stated three times (§C).
Justification: 1 rather than 0 because the page is not dominated by decoration; five removable
elements is the top of the anchor-1 band, against B's three at the bottom of it.

### **Total: D = 12/30**

---

## Side by side

| # | Principle | B | D | |
|---|---|---|---|---|
| 1 | innovative | 1 | **2** | D |
| 2 | useful | 2 | 2 | — |
| 3 | aesthetic | **2** | 1 | B |
| 4 | understandable | 1 | 1 | — |
| 5 | unobtrusive | **2** | 1 | B |
| 6 | honest | 0 | **1** | D |
| 7 | long-lasting | **2** | 1 | B |
| 8 | thorough | 0 | 0 | — |
| 9 | environmentally friendly | 2 | 2 | — |
| 10 | as little design as possible | 1 | 1 | — |
| | **Total** | **13** | **12** | |

**D wins the two principles that answer the actual business question (#1, #6) and loses three
execution principles (#3, #5, #7).** Every point D loses is a defect its author introduced and could
remove in an afternoon — a grid ratio, a dead border, an opacity, one trend marker. Every point B
loses on #6 is structural and cannot be fixed without changing what B is.

The 1-point gap is inside the noise of this instrument. **The scorecard does not separate these two
designs, and should not be used to pick between them.** What it does establish is that both fail,
for reasons that are mostly shared and mostly nothing to do with placement.
