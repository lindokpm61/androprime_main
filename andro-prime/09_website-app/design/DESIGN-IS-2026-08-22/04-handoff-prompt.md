# 04 — Handoff prompt

Copy the fenced block below into a new session. It is self-contained: the next session does not need
this audit, the mockup file, or this conversation.

````
/make-plan Redesign the supplement shelf component on the Andro Prime blood-test results page. Current design failed a Dieter Rams audit at 13/30 (candidate B) and 12/30 (candidate D), with critical gaps in principles #6 honest (B scored 0), #8 thorough (both scored 0), #4 understandable (both 1) and #10 as little design as possible (both 1).

Verdict paragraph (quoted from the audit):
> B scores 13/30 with a 0 on principle #6 (honest), a load-bearing dimension. D scores 12/30. Either condition alone triggers REDESIGN; B meets both. What is being redesigned is not the placement but the shelf component itself: B and D are the same unbuilt component in two frames, fourteen of their twenty principle-scores are the same number for the same reason, and the total difference between them is one point.

Why redesign and not refine: principle #6 (honest) scored 0 for candidate B because the commercial block is byte-identical to a clinical blood-marker block at every frame-level property. That cannot be refined away, because being indistinguishable from the report is what candidate B is. Neither candidate reaches the 20/30 required for REFINE.

Context you need:
- The page reports a UK man's testosterone blood test. Primary user is 35-55, not a clinician, possibly anxious, as likely on a phone as a laptop. Primary task is understanding his own numbers. The supplement shelf is commerce placed on that page: secondary by definition, a guest on someone else's page.
- Binding constraint CA-026 clause 2 (`02_brand/messaging-framework.md`, adopted 2026-07-22): "no result changes what we offer or what it costs." Every customer sees an identical shelf. On a GP-referral result the shelf must not render at all.
- Phase 0 wellness mode: no TRT, no clinical claims, no prescribing language. EFSA-authorised claim wording only. Ashwagandha may never be named. No em dashes in customer-facing copy.
- Dr Ewa Lindo signs off all results-report copy. This plan does not substitute for that.
- Two product decisions are open and must NOT be resolved by this plan: pricing architecture (one blended Daily Stack at £34.95, the only live figure in `pricing.ts`, versus separate single-nutrient bottles) and the zinc dose and salt (spec is 25 mg gluconate, the only available SKU is 15 mg citrate, Ewa's ceiling question unanswered). The current mockups correctly print "Price TBC" and "Dose and salt to be confirmed" rather than committing.

Source AS AUDITED: `andro-prime/09_website-app/design/mockups/results-range-placement-study.html`, candidate B at lines 363-483, candidate D at lines 598-729, shared CSS lines 1-226. **That file is SUPERSEDED and must not be republished** — it draws total testosterone against 6.68 to 25.70 where Vitall's confirmed male interval is 8.64 to 29.00, and it predates the dual-range marker card. It is kept only so these line numbers still resolve. **Build against the live source, `design/mockups/2026-08-21-where-the-range-sits.html`**, and note that two findings below are already fixed there: the range bar has a `role="img"` and descriptive `aria-label`, and the marker card states both ranges in text rather than by colour alone.

Preserve from current design:
- The `:focus-visible` treatment: a 2px offset ring drawn around the WHOLE product card rather than its text, unclipped by any `overflow:hidden` ancestor, correct in both themes, with the product name underlining and the arrow going solid (CSS lines 37, 113, 155, 156). Verified by keyboard in both candidates. Regression check: Tab to each card, confirm the ring surrounds the card boundary and is not clipped.
- The theme token system: all 16 tokens defined in bare `:root` (lines 7-14), redefined under `@media (prefers-color-scheme:dark)` guarded as `:root:not([data-theme="light"])` (15-24), redefined again under `:root[data-theme="dark"]` (25-32), with `body` taking an explicit token background (35). No colour has its only definition inside a media query. An element-by-element diff across themes returned 0 non-colour differences. Regression check: grep the stylesheet for any colour declared only inside a media or `[data-theme]` block.
- All three EFSA claim strings verbatim, which match the authorised table at `03_compliance/CONTEXT.md:106-112` exactly: "Contributes to normal muscle function." / "Contributes to normal energy-yielding metabolism." / "Contributes to the maintenance of normal testosterone levels."
- Candidate D's core idea, that the block declares itself commerce before it begins, which is the only reason D outscored B on principles #1 and #6. Keep the idea; rebuild the execution.

Discard:
- Reuse of the report's own grammar inside the commercial block: `.mk-l`/`.mk-r` layout classes, the `.mk-sec-h` lightning-bolt SVG (path `M13 2 3 14h7l-1 8 10-12h-7z`), the heading text "What this means", and the trailing `.rec` "What we recommend" strip. Evidence: candidate B lines 421-465, candidate D lines 667-711. Caused failure on principle #6 (B scored 0, D scored 1).
- Candidate B's `span.chip.out` "Same on every report" (line 423). It uses the identical component and CSS as the clinical result-status chip "In range" (line 396): same visual weight, opposite semantic function. Caused failure on principle #6.
- Candidate D's `1.42fr 1fr` grid on the shelf (CSS line 207) against `1.28fr 1fr` on the marker block (CSS 75). Measured consequence: the shelf's vertical rule renders at x=810.9 while the marker block's above it renders at x=788.4, a 22.5px misalignment in the same column of the same page. Caused failure on principle #3.
- Candidate D's `opacity` on text (CSS 204, 206), used nowhere else in the file, generating four effective colours that exist in no token (#989899, #C9C9CA light; #6C6C6B, #3E3E3E dark) and degrading 31% in dark. Caused failure on principle #3.
- Candidate D's `.declare{border-top:2px solid var(--hair)}` (CSS 202) on a `background:var(--chip)` ground. `--hair` and `--chip` resolve to the same value in both themes, measured 1.000:1. The rule never renders; it only makes the bar 2px taller. Caused failure on principle #10.
- Three strings from candidate D: "End of your results" (line 660, false, because the consent box and footer both reference results below it), "Your numbers above do not point at any of these" (line 708, a per-reader conclusion inside a block claiming not to read results), and "The shelf is fixed. It does not read your results, so it cannot respond to them. The only thing your result decides is whether it appears at all" (lines 702-703, self-contradicting in two sentences). Caused failures on principles #4 and #6.
- "This is our full range" / "our whole range" (B 462, D 708). Conflicts with `04_products/catalogue/product-catalogue-v7-1.md:25-26`. Caused failure on principle #6.
- "personalised biomarker insights" (B 382, D 619). On the red-flag list at `03_compliance/CONTEXT.md:96` as implying bespoke per-customer clinical interpretation; the mandated alternative is "Ewa-approved recommendation logic". Caused failure on principle #6.

Top 5 moves from the audit, verbatim:
1. Principle #6 honest: Sever the shelf's structural identity with clinical content. Stop reusing `.mk-l`/`.mk-r`, the `.mk-sec-h` lightning icon, the heading text "What this means", and the trailing `.rec` "What we recommend" strip inside the commercial block. The shelf needs its own container, its own explanation pattern and its own terminal treatment. This is the single move that changes the score, and neither candidate makes it: B by design, D only at the surface. Evidence: B lines 421-465 vs 394-419; D lines 667-711 vs 631-656.
2. Principle #8 thorough: Build the states, starting with the one the copy already promises. Empty, loading, error, disabled, and a hover rule for `.btn.ghost`, which currently has none anywhere in the file. Candidate D's copy asserts the shelf disappears on a GP-referral result and nothing implements it; worse, the declaration bar is not tied to the shelf's presence, so it would remain on screen announcing a shop that did not render. Build the hidden state first, it is the one with clinical consequences. Evidence: CSS lines 99-101, 111-114; D line 703.
3. Principles #4 understandable and #6 honest: Give the block a real heading element, and delete the three statements that are false or self-contradicting. The shelf has no heading in either candidate; in D its own title is a `<p>` (line 661), so a heading-navigating reader gets no signal at all for the commerce. Evidence: B has only `h3` at 381 and `h4` at 389; D only `h3` at 618 and `h4` at 626.
4. Principle #6 honest: Unbundle the consent control and rescope the clinical attribution. One control currently binds retention of a health result on file to marketing permission for a future service (B 468-471, D 714-717). Separate them. And "Ewa-approved recommendation logic" (B 472, D 718) sits in the footer, below the shop block, unscoped, reading as though a named GP approved the commerce. Scope it explicitly to the report or move it above the shelf. This is the item with legal exposure rather than design consequences, and it should be fixed first regardless of which placement wins.
5. Principle #3 aesthetic, plus the accessibility floor: Raise the contrast floor and give the range bar a non-colour channel. `--ink-3` at 3.29:1 carries the EFSA claim on every product card, the dose line, the reference range and "VIEW →"; "What we recommend" is 2.99:1 on the grey strip; "FOOD SUPPLEMENT" renders at 4.13px and 2.40:1. On the clinical content, the range bar's zones are distinguishable by hue alone (amber against green measures 1.28:1 light, 1.05:1 dark) and the tick showing where the reader's result falls has no accessible name. Evidence: CSS lines 8, 87, 95, 137-138, 149-153.

Redesign principles in priority order:
1. Honest (#6) — a reader who scrolls past at speed, or who arrives by screen-reader heading navigation, or who screenshots the block alone, cannot mistake the commerce for advice derived from his blood. Success means the block shares no structural device with a marker block, and every label matches what its control does.
2. Thorough (#8) — every state the copy asserts is a state the design implements. Success means the GP-referral hidden state exists, and the declaration cannot outlive the thing it declares.
3. Understandable (#4) — the block is announced by a real heading, and nothing in it asserts a conclusion about this reader's results. Success means a first-time user can name what the block is and what each control does.

Deliverables for the plan:
- New information architecture for the shelf, not derived from the marker-block grammar
- New primary flow, low-fidelity and labelled, compared side by side against candidates B and D
- States checklist: empty, hidden (GP-referral), loading, error, success, focus, disabled, hover
- Token decisions: contrast floor, and whether the shelf gets its own surface token rather than borrowing `--strip`
- Honesty audit on every user-facing string before ship, routed through `03_compliance/CONTEXT.md`
- Migration path: A, B, C and D are unshipped mockups, so there are no users on the old design; state the cutover as "which mockup is retired and when"
- Cutover criteria: what has to be true before this goes to Ewa for sign-off

Anti-patterns to guard against:
- Porting the marker-block structure under new styling. This is the exact failure being redesigned; if the new block still uses `.mk-l`/`.mk-r`, the redesign has not happened.
- Adding a fourth restatement of the non-personalisation promise. It is already stated three times in both candidates and that cost both of them a point on principle #10. One statement, in one place, well made.
- Resolving the open pricing or zinc-dose decisions to make the mockup look finished. "Price TBC" is correct until Keith and Ewa decide.
- Treating this as a choice between A, B, C and D. The audit found the placement question nearly orthogonal to why the design fails.
````
