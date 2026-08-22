# 03 — Verdict

## REDESIGN — both candidates

**B scores 13/30 with a 0 on principle #6 (honest), a load-bearing dimension. D scores 12/30.**
Either condition alone triggers REDESIGN under the Phase 3 rule; B meets both. The verdict follows
mechanically from `02-scorecard.md` and was not chosen in advance.

## What is actually being redesigned

Not the placement. **The shelf component itself.**

B and D are the same unbuilt component shown in two frames. They share 148 and 152 elements
respectively, of which the overwhelming majority is byte-identical markup. Of the twenty
principle-scores across both candidates, **fourteen are the same number for the same reason**. The
two candidates differ on three execution principles and two framing principles, and the total
difference is one point — inside this instrument's noise.

That is the finding. The A/B/C/D placement question, which is what this study was built to answer,
turns out to be nearly orthogonal to why the design fails. Both candidates inherit:

- five missing interaction states (#8 = 0 for both)
- a shelf with no heading element in either
- a light theme that fails WCAG AA on the EFSA claim line of every product card
- a range bar on the clinical content that conveys its zones by colour alone
- six keyboard-unreachable actions, including the consent control
- a consent box binding health-data retention to marketing permission
- a named GP's approval line sitting unscoped beneath the commerce

None of those is a placement question. All of them will still be there whichever of A, B, C or D
Keith picks.

## Why REDESIGN and not REFINE

For **B**, principle #6 scored 0 because the commercial block is byte-identical to a clinical marker
block at every frame-level property — same border, same grid ratio, same background, same header
classes, same status-chip component, same right-column heading text, **same SVG icon path**, same
trailing strip, same slot in the sequence. The only distinguishers are text strings. That cannot be
refined away, because being indistinguishable from the report *is what B is*. Removing it is a
redesign by definition.

For **D**, the honesty score improves to 1 and the aesthetic score falls to 1. Its declaration bar
is a genuine material reduction in deception. But underneath it, D reuses the same layout classes,
the same lightning-bolt icon, the same "What this means" heading and the same "What we recommend"
strip as the clinical content. **The declaration changed; the grammar did not.** And D introduces
three copy defects that undercut its own thesis, including one sentence asserting a conclusion about
the reader's blood inside a block that claims not to read it.

Neither total reaches the 20 required for REFINE. Neither is close.

## Note on the auditor

This audit was produced by the author of candidate D, who had also recommended it. That is disclosed
in `00-scope.md` with the four mitigations applied. The result is that **D scored lower than the
option it was recommended over**, on evidence gathered by subagents briefed blind. The recommendation
does not survive this audit unchanged, which is what an audit is for.

---

## The five highest-leverage moves

**1. Sever the shelf's structural identity with clinical content. (#6 honest — §B1, §C1)**
Stop reusing `.mk-l`/`.mk-r`, the `.mk-sec-h` lightning icon (`M13 2 3 14h7l-1 8 10-12h-7z`), the
heading text "What this means", and the trailing `.rec` "What we recommend" strip inside the
commercial block. The shelf needs its own container, its own explanation pattern and its own
terminal treatment. This is the single move that changes the score, and **neither B nor D makes it**
— B by design, D only at the surface.

**2. Build the states, starting with the one the copy already promises. (#8 thorough — §A6, §C7)**
Empty, loading, error, disabled, and a hover rule for `.btn.ghost`, which currently has none. D's own
copy asserts the shelf disappears on a GP-referral result and nothing implements it — worse, the
declaration bar is not tied to the shelf's presence, so it would remain on screen announcing a shop
that did not render. Build the hidden state first; it is the one with clinical consequences.

**3. Give the block a real heading, and delete the three statements that are false or
self-contradicting. (#4 understandable, #6 honest — §A5, §C6)**
The shelf has no heading element in either candidate; in D its own title is a `<p>`, so a
heading-navigating reader gets no signal at all for the commerce. Then remove: "End of your results"
(results content continues below it), "Your numbers above do not point at any of these" (a per-reader
conclusion inside a block claiming not to read results), and "The shelf is fixed. It does not read
your results, so it cannot respond to them. The only thing your result decides is whether it appears
at all" (self-contradicting in two sentences).

**4. Unbundle the consent control and rescope the clinical attribution. (#6 honest — §A12)**
One control currently binds retention of a health result on file to marketing permission for a
future service. Separate them. And "Ewa-approved recommendation logic" sits in the footer, below the
shop block, unscoped — a named GP's approval reading as though it covers the commerce. Scope it
explicitly to the report, or move it above the shelf. **This is the item with legal exposure rather
than design consequences, and it is the one to fix first regardless of which placement wins.**

**5. Raise the contrast floor and give the range bar a non-colour channel. (#3 aesthetic, plus the
accessibility floor — §A1, §A2, §A3)**
`--ink-3` at **3.29:1** carries the EFSA claim on every product card, the dose line, the reference
range and "VIEW →". "FOOD SUPPLEMENT" renders at 4.13px and **2.40:1**. And on the clinical content,
the range bar's zones are distinguishable by hue alone — amber against green measures **1.28:1** —
with the tick showing where the reader's own result falls carrying no accessible name at all.

---

## Two things to keep, and to regression-check

**The focus treatment.** `:focus-visible` draws a 2px offset ring on the **whole product card**, not
just its text, unclipped by any `overflow:hidden` ancestor, correct in both themes, with the card
name underlining and the arrow going solid. Verified by keyboard in both candidates. Do not lose this
in the redesign. Regression check: Tab to each card and confirm the ring surrounds the card boundary.

**The theme system.** All 16 tokens defined in bare `:root`, redefined under `prefers-color-scheme`
guarded as `:root:not([data-theme="light"])`, redefined again under `:root[data-theme="dark"]`, with
`body` taking an explicit token background. No colour has its only definition inside a media query.
A full element-by-element diff across themes returned **0** non-colour differences. Regression check:
grep the stylesheet for any colour declared only inside a media or `[data-theme]` block. The
exception to preserve-as-is: the nav, statusbar and pack artwork hardcode the light palette and drop
to **1.07:1** against the page in dark. That should be fixed, not preserved.
