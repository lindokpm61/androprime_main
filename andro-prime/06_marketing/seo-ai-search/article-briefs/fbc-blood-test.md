---
brief: pillar-D-spoke (D.1 / D.3 — fbc)
target_query: fbc blood test
slug: fbc-blood-test
vol_uk: 12100
kd: 34
intent: commercial
icp: ICP 2 (active 35-50, recovery-aware) primary; large NHS-result-checking population served informationally
kit_funnel: Kit 2 (INDIRECT — Andro Prime does NOT run an FBC; the wedge is "what your FBC doesn't measure" -> Kit 2's recovery markers; see Section 1 + Section 13)
sequence: Next-wave D-marker spoke; hangs off the LIVE crp-blood-test hub
compliance_gate: Medium (anaemia/leukaemia worried-well surface; must defuse without diagnosing; honest about what we do NOT offer)
status: brief-ready
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-06-20
keyword_coverage:
  primary_query: "fbc blood test"
  primary_query_csv_row: 63
  spoke_count: 0
  total_addressable_vol_per_month: 20200
  csv_rows_targeted: [63, 65]
  csv_rows_dropped: []
  csv_source: andro-prime/06_marketing/seo-ai-search/keywords.csv
---

# Pillar D spoke — "FBC blood test"

> D-marker spoke. Lean spoke pattern (inherit the [Pillar D hub](./pillar-D-hub-crp-blood-test.md); re-derive only what's FBC-specific). **The strategic exception:** Andro Prime does not sell a full blood count, so this spoke's funnel is deliberately *indirect* — see Section 1.

---

## 1. Why this article ships — and the product-fit flag

`fbc blood test` is 12,100 vol / KD 34 — the **lowest-difficulty, highest-volume commercial anchor in the D pillar** (lower KD than CRP's 47 or ferritin's 57). Paired with `full blood count` (8,100, KD 41) it's ~20,200 addressable. The SERP is the same UK-underserved pattern as the rest of the pillar.

**The honest flag (read before drafting):** a full blood count is a multi-cell-line panel (haemoglobin, haematocrit, MCV, white cells, platelets) run on venous/analyser methodology. **Andro Prime offers no FBC** — Kit 2 is a 4-marker finger-prick panel (Vitamin D, Active B12, hs-CRP, Ferritin). So this article cannot sell the thing the reader searched for. Two routes were considered:

- **(A) Email capture only** (like the H/I/J hubs) — safe but leaves a high-intent, low-KD term converting to nothing.
- **(B) The "what your FBC doesn't measure" bridge — CHOSEN.** A large share of `fbc blood test` intent is "*my full blood count came back normal but I still feel tired/flat — what now?*" An FBC can read perfectly normal while ferritin (iron stores), Vitamin D, Active B12 and hs-CRP — the markers that actually explain fatigue and slow recovery in active men — sit untested. That gap *is* Kit 2. The article explains the FBC honestly and completely, then pivots to the markers an FBC leaves out.

Route B is compliant, genuinely useful, and converts on a real reader job rather than a bait-and-switch. **Keith decision flagged in Section 19** — overrule to Route A if you'd rather not point FBC traffic at Kit 2.

Ships as a spoke off the LIVE CRP hub; up-links resolve (no 404 risk).

## 2. The article's job (one sentence)

Turn the man who Googled "fbc blood test" — usually holding a normal-ish NHS full blood count and still feeling flat — into a Kit 2 buyer by giving him the clearest UK explainer of what an FBC measures, then honestly showing him the recovery markers an FBC does *not* measure and where to get them.

## 3. Target reader

Inherits CRP hub Section 3. ICP 2 primary. FBC traffic skews broad (everyone gets an FBC at some point), so the article serves a large NHS-result-checking population informationally and converts the active-fatigue subset. Same anti-personas as the hub: not clinicians; not people with a diagnosed haematological condition (route to GP); not the worried-well convinced a borderline value means leukaemia (defuse — Section 16).

## 4. Search-intent decoded

`fbc blood test` is informational-with-commercial-underlay, and unusually **post-test**: most searchers already have an FBC result in hand (NHS or private) and want to read it. The article must:

- **Answer the literal question** ("what is an FBC / full blood count, what does it measure") in the opening 40-60 word block.
- **Help him read his own result** at a skim — a plain-English tour of the main components (Hb, haematocrit, MCV, WBC, platelets) and the everyday reasons each runs high or low.
- **Resolve the real job**: "it came back normal — so why do I still feel like this?" -> what an FBC doesn't cover.
- **Defuse worried-well spikes** (a flagged WBC or low Hb does not mean cancer) honestly, with the GP-referral line for the values that do warrant review.
- **Bridge to Kit 2** as the logical next step for the *recovery* markers an FBC leaves out — never as a replacement for the FBC itself.

## 5. SERP gap

Inherits the CRP-hub gap pattern (US clinical authorities + generic UK lab-encyclopedia pages, no UK men-specialist, no recovery framing, no named GMC review). FBC-specific note: because the term is so post-test/clinical, expect NHS, `labtestsonline.org.uk` and patient.info to rank — competent but generic, with no "your FBC is normal and you still feel flat" follow-through. **That follow-through is the entire wedge** and nobody on the SERP owns it. KD 34 is the most winnable anchor in the pillar for a young domain with a live hub linking in.

## 5a. Keyword coverage map

**Source:** [`keywords.csv`](../keywords.csv) — Pillar D FBC rows 63, 65.

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| ---: | --- | ---: | ---: | --- |
| 63 | fbc blood test | 12,100 | 34 | **Primary target** — H1, slug, opening AI-snippet block |
| 65 | full blood count | 8,100 | 41 | "What an FBC actually measures" H2 (FBC = full blood count; named in the first breath) + body throughout |

**Total addressable (primary): ~20,200 vol/mo.**

**Secondary index coverage (folded from keyword_queue triage 2026-06-21).** These FBC sub-component
queries are individually searched but are NOT separate articles — capturing each as its own page
would spawn thin, cannibalising duplicates. They are captured as rows in the "what each line on your
FBC means" component table (Section 6), each with a one-line lay explanation:

| Query | UK vol/mo | KD | Captured as |
| --- | ---: | ---: | --- |
| full blood count check | 18,100 | 9 | FBC primary (variant of row 65) |
| count of lymphocytes | 12,100 | 9 | Lymphocytes row |
| mchc blood test | 12,100 | 0 | MCHC row |
| blood analysis mch · blood test mean corpuscular hemoglobin · corpuscular haemoglobin · mean corpuscular haemoglobin | ~9,900 ea | 0–11 | MCH row (single concept) |
| mcv test | 8,100 | 0 | MCV row |
| haematocrit pcv low | 6,600 | 10 | Haematocrit / PCV row |

Adds **~65,000 vol/mo** of low-KD, intent-aligned long-tail (a man reading his FBC result) to the one
spoke. The component table must therefore include rows for **MCV, MCH, MCHC, haematocrit/PCV, and
lymphocytes** (the brief currently names MCV + haematocrit only). UK spellings: haematocrit, haemoglobin.

**Deconfliction:** the CRP hub explicitly left `fbc blood test` to "D.1 spoke territory — different marker, different anchor" and `full blood count` to "D.3 spoke territory" ([CRP hub Section 5a, "Deliberately not targeted"](./pillar-D-hub-crp-blood-test.md)). This spoke is the canonical home of both. No FAQ overlap with the hub. The ferritin spoke's FAQ Q5 ("can ferritin be low when my FBC is normal?") deliberately points *into* this article — coordinate the cross-link.

## 6. Word-count + structure

- **Target length:** 1,700 words (long-spoke band 1,500-2,000). Shorter than the ferritin spoke — the FBC tour is breadth-not-depth, and depth on the recovery markers lives in their own spokes/hub.
- **Reading level:** UK Year 10. The reader is reading a result, not studying haematology — keep each component to a scannable line or two.
- **Skim layer:** every H2 reads standalone. A small "what each line on your FBC means" table is the AI-extraction centrepiece.
- **TOC + jump links + back-to-top** required.

## 7. Opening block (the AI-snippet target)

40-60 words, plain text, under H1.

**Direction:**

> A full blood count (FBC) is the most common blood test in the UK. It measures your red cells, white cells and platelets, so it screens for things like anaemia, infection and clotting problems in one go. It's a powerful test, but it doesn't measure the markers that most often explain everyday fatigue.

That last line sets up the wedge without over-claiming, and earns the "what it doesn't measure" turn later.

## 8. Heading scaffold (H2 / key H3)

```text
H1  FBC blood test — what a full blood count actually tells you

  [40-60 word direct-answer block]

H2  What an FBC actually measures (the plain-English tour)
  H3  Red cells, haemoglobin and haematocrit — the oxygen-carrying side
  H3  MCV and the red-cell indices — the size clues
  H3  White cells — the infection and immune side
  H3  Platelets — the clotting side
  [compact "reading your FBC" table — AI-extraction centrepiece]
H2  Why your GP ordered it — or why your panel includes it
H2  What "normal" and "abnormal" mean on an FBC
H2  The big one: my FBC came back normal and I still feel flat
  [the bridge — what an FBC does NOT measure: ferritin/iron stores, Vitamin D, Active B12, hs-CRP]
H2  What a single FBC does NOT tell you
H2  When to see your GP, not us
H2  How Andro Prime helps — the markers an FBC misses (Kit 2)
H2  Frequently asked questions
  [FAQ block — Section 12]
H2  Your next move
  [CTA block — Section 13]
```

## 9. Section-by-section content brief

### What an FBC actually measures (the plain-English tour)

- Name it in the first breath: **FBC = full blood count** (rows 63 + 65 satisfied together). One test, three cell families.
- Four short H3s, each a scannable line or two of "what it is / why it runs high or low in everyday terms" — not a haematology lecture:
  - **Red cells, Hb, haematocrit** — oxygen carriers; low = the anaemia question.
  - **MCV + indices** — red-cell *size*; the clue to *which kind* of issue (small cells point toward iron, large toward B12/folate — a natural pointer toward the markers Andro Prime does run).
  - **White cells** — infection/immune; up with infection, and the worried-well's biggest worry — handled calmly.
  - **Platelets** — clotting.
- **Compact table** ("Reading your FBC: line / what it is / common everyday reasons it's high or low"). This is the most AI-extractable asset in the article — keep it clean and sourced.
- Must avoid letting the table read as a self-diagnosis tool: a one-line frame above it ("these are common, everyday reasons — your GP reads the whole picture, not one line").

### Why your GP ordered it — or why your panel includes it

- ~120 words. FBC is the default first test for almost everything — tiredness, infection, pre-op, medication monitoring, "general check." Acknowledge that breadth, then steer to the reader's real question.

### What "normal" and "abnormal" mean on an FBC

- Reference-range honesty, the FBC version of the pillar's recurring "normal vs optimal" move. Ranges vary by lab and by sex; a value just outside the range is common and usually not alarming; the pattern across lines matters more than any single flag. Link to `myth-of-normal-range` (live) as the sibling argument.

### The big one: my FBC came back normal and I still feel flat

- **The heart of the article (~300 words).** The honest pivot. An FBC can be entirely normal while the markers that most often drive fatigue and poor recovery in active men go untested:
  - **Ferritin / iron stores** — iron stores can be depleted with a *normal* haemoglobin (the tank empties before the blood count drops). Link to the ferritin spoke (once live).
  - **Vitamin D** — not on an FBC; UK men routinely low Oct-Mar.
  - **Active B12** — an FBC's MCV only hints at B12 *after* it's affected red-cell size; Active B12 (holotranscobalamin) measures the usable fraction directly. Link to the B12 spoke (once live).
  - **hs-CRP** — low-grade inflammation that explains slow recovery; not an FBC line. Link to the CRP hub (live).
- Frame as complement, not replacement: "A normal FBC is good news and a fair start. It just isn't the whole recovery picture." Compliance: no implication the FBC was wrong or that Andro Prime's test is diagnostically superior — it measures *different* things.

### What a single FBC does NOT tell you

- ~150 words. Defuse-the-worry section. A single flagged line is usually transient (recent infection bumps white cells; hydration shifts haematocrit); the FBC doesn't diagnose on one value; an abnormal flag is a prompt for the GP to look at the pattern, not a verdict. Explicitly: an out-of-range white-cell or haemoglobin value does not mean cancer — most have benign causes — and the genuine red flags belong with the GP (next section).

### When to see your GP, not us

- **Non-negotiable. ~160 words.** Direct, enabling. FBC-specific red flags that are GP territory, not ours: any abnormal FBC line your GP has asked to recheck; persistent or worsening flags; low haemoglobin with breathlessness/dizziness; any FBC abnormality with unexplained weight loss, night sweats, easy bruising/bleeding, or persistent fever -> GP promptly. State plainly: **Andro Prime does not run a full blood count or interpret an abnormal FBC — that's your GP's job. What we do is measure the recovery markers an FBC leaves out.**

### How Andro Prime helps — the markers an FBC misses (Kit 2)

- **One paragraph.** Kit 2 measures ferritin, Vitamin D, Active B12 and hs-CRP — finger-prick at home, UKAS-accredited lab, results 2-5 working days, reviewed by Dr Ewa Lindo. Positioned precisely as the complement to a normal FBC, not a substitute for it. Links to `/kits/energy-recovery` once inline. Carry the honest caveat that a low ferritin result still routes to the GP.

## 10. Sources to cite (E-E-A-T + GEO)

Spoke bar 3 minimum. Writer verifies at draft:

- **NHS** — full blood count / blood tests overview, for the "most common test" framing and component descriptions. (`https://www.nhs.uk/conditions/blood-tests/`)
- **Lab Tests Online UK (Association for Clinical Biochemistry)** — FBC component reference, for the red/white/platelet breakdown (UK-authored, defensible).
- **NICE CKS / NHS** — for the "abnormal FBC needs GP interpretation + red-flag" referral logic (writer picks the cleanest UK reference).
- Shared NHS citation with the hub/ferritin spoke is intentional and correct.

## 11. Expert quotation block

One Dr Ewa Lindo pull quote. **Placement:** inside or just after "my FBC came back normal and I still feel flat" — the article's pivot and the reader's highest-frustration point.

**Draft direction (Ewa to review/rewrite/reject):**

> "A normal full blood count reassures a lot of tired men, and then puzzles them, because they still feel flat. The FBC is a brilliant screen, but it was never designed to measure iron stores, Vitamin D or your active B12 — and those are exactly the things I'd look at next in a man whose count is normal but whose energy isn't. A normal FBC rules things out. It doesn't explain everything."
>
> — Dr Ewa Lindo, GMC-registered GP, Andro Prime medical reviewer

Reviewed by Ewa before publish; rewrite-verbatim or remove if rejected.

## 12. FAQ block (FAQPage schema)

6 questions, FBC-specific, distinct from the hub's and the ferritin spoke's FAQ sets.

| # | Question | Role |
| ---: | --- | --- |
| 1 | What is an FBC blood test? | Direct restatement (rows 63 + 65) |
| 2 | What does a full blood count check for? | The three-cell-family tour in answer form |
| 3 | Can an FBC come back normal and you still feel tired? | **The wedge in FAQ form** — bridges to the recovery markers |
| 4 | Does an FBC test for iron, Vitamin D or B12? | Honest "not directly / not at all" + what does; links to ferritin/B12 spokes |
| 5 | What does an abnormal FBC mean? | Defuse + GP-referral; no diagnosis |
| 6 | Is an FBC the same as a private men's health blood test? | Distinguishes the NHS screen from a recovery-marker panel; sets up Kit 2 honestly |

## 13. CTA block (end of article only)

Single CTA. End only. **Kit 2, framed as complement.**

- Headline: "A normal FBC is a good start. Here's what it doesn't measure."
- Body: "The Energy & Recovery Check measures the four markers a full blood count leaves out — ferritin, Vitamin D, Active B12 and hs-CRP — the ones that most often explain why active men feel flat. Finger-prick at home, UKAS-accredited lab, results in 2 to 5 working days."
- Component: `<InlineKitCTA ctaHref="/kits/energy-recovery" ctaLabel="See the Kit">` + one inline `[See the Kit](/kits/energy-recovery)`.

**The CTA must never imply Kit 2 replaces or is better than an FBC.** It measures different markers. Complement, not substitute.

**Banned phrases** (whole article): "diagnoses anaemia/leukaemia/infection"; "better than / replaces an FBC"; "treats fatigue"; "cures/reverses/fixes"; any FM-list CTA; "Ashwagandha"; no "testosterone" framing (Kit 2 rule).

## 14. Schema requirements

Same three-block `@graph` (`Article` + `FAQPage` + `BreadcrumbList`), auto-generated. Author Keith Antony; `reviewedBy` Dr Ewa Lindo (GP, GMC 4758565). Confirm Person `@id` resolution at draft.

## 15. Metadata + URL

| Field | Value |
| --- | --- |
| URL slug | `/blog/fbc-blood-test` |
| Title tag | `FBC Blood Test — What a Full Blood Count Tells You \| Andro Prime` (writer trims ≤60 before site name) |
| Meta description | `What an FBC (full blood count) measures, how to read a normal result, and the fatigue markers it doesn't test. Reviewed by GMC-registered GP Dr Ewa Lindo.` (writer trims ≤155) |
| OG image | `og/blog-fbc-blood-test.png` or `/api/og/blog/fbc-blood-test` |
| OG image alt | `FBC full blood count — UK guide for men` |
| Canonical | self |
| robots | `index: true, follow: true` |

## 16. Compliance gate

**Medium-risk.** FBC-specific hazards:

1. **Worried-well / cancer fear.** A flagged white-cell or haemoglobin value triggers leukaemia/cancer anxiety. The article must defuse honestly (most flags are benign/transient) without dismissing the genuine red flags, which route to the GP.
2. **No diagnostic over-reach.** The article reads results in everyday terms but must never diagnose anaemia, infection or any condition, and must never position Kit 2 as superior to or a replacement for an FBC.
3. **Honest non-offering.** State clearly that Andro Prime does not run an FBC. Never blur the NHS screen and the Kit 2 recovery panel.

Pre-flight (writer runs `compliance-preflight`):
- [ ] No diagnosis of any condition from FBC values; the "reading your FBC" table framed as everyday-causes, GP-reads-the-pattern
- [ ] No "replaces/better than an FBC"; Kit 2 framed strictly as complement
- [ ] Explicit "Andro Prime does not run a full blood count" line present
- [ ] GP-referral section names the red flags (weight loss, night sweats, easy bruising/bleeding, persistent fever, breathlessness)
- [ ] No "testosterone"; no FM CTA; no Ashwagandha; no "treat"/"cure"
- [ ] Ewa pull quote signed off; byline + "Last updated" date present

**Ewa sign-off required in writing** before publish.

## 17. Internal linking

**From this article, link out to:**

- `/kits/energy-recovery` (Kit 2) — single CTA + one inline mention
- `/blog/crp-blood-test` (D hub, LIVE) — from the "what an FBC misses" hs-CRP point and the "normal vs abnormal" section
- `/blog/myth-of-normal-range` (C spoke, LIVE) — from "what normal means on an FBC"
- `/blog/ferritin-blood-test` (D spoke) — from the MCV/iron clue and the "FBC normal but flat" section; `prefetch={false}` until live
- `/blog/b12-blood-test` (D spoke) — from the MCV/B12 clue; `prefetch={false}` until live

**Into this article, link from:**

- `/blog/ferritin-blood-test` FAQ Q5 ("can ferritin be low when my FBC is normal?") — points here
- `/blog/crp-blood-test` — optional pointer where the hub mentions other routine bloods
- Kit 2 page RelatedArticles (auto once published)

## 18. AI-citation pre-publish checklist

Inherits CRP hub Section 18. Spoke notes:

- The "reading your FBC" component table is a clean, self-contained fact block AI assistants extract and cite directly — keep it sourced and unambiguous.
- `fbc blood test` / `full blood count` both in H1-adjacent positions; no stuffing.
- External links `rel="noopener noreferrer"` via `rehype-external-links` (live).

## 19. Open questions for Keith before draft

Inherits CRP-hub Section 19. One spoke-specific decision, defaulted so the brief is **brief-ready**, flagged for Keith:

- (a) **Funnel route (the product-fit flag from Section 1).** Defaulted to **Route B** — "what your FBC doesn't measure" -> Kit 2 complement CTA. This converts on a real reader job and stays honest. Overrule to **Route A** (email-capture only, no Kit 2 CTA) if you'd rather not aim FBC traffic at Kit 2 at all. This is the one genuinely strategic call on this brief; everything else inherits.

## 20. Next steps when this brief is approved

1. (Brief-ready — Route B defaulted; flip to Route A only if Keith overrules.)
2. Update keywords.csv — `primary_article_slug = fbc-blood-test` on row 63; `coverage_status = briefed` on rows 63, 65.
3. Draft via `/article` -> `article-drafts/fbc-blood-test.mdx`.
4. `compliance-preflight` (auto at step 6).
5. Draft-Writer ingests; Signoff-Concierge opens the Ewa task.
6. Apply Ewa edits; publish via `/publish-article`.
7. `coverage_status = published` on rows 63, 65 at publish.

## 21. Post-draft delivery report (filled at draft handoff 2026-06-20)

Draft: `article-drafts/fbc-blood-test.mdx` (status: draft; pre-Ewa). ~1,650 words. **Route B (the "what your FBC doesn't measure" -> Kit 2 complement) drafted, per Section 19a default.**

### Coverage verification

- [x] Rows 63 + 65 addressed:
  - Row 63 (`fbc blood test`) — title (H1), slug, opening AI-snippet block, FAQ Q1 ✅ (primary PASS)
  - Row 65 (`full blood count`) — named in first breath ("FBC stands for full blood count"), "What an FBC actually measures" H2, body throughout, FAQ Q2 ✅
- [~] Word count ~1,650 (just under the 1,600-1,800 target band; acceptable — breadth-not-depth held).

### Source verification

- [x] All inline citations carry specific URLs; zero `SOURCE TODO`.
- [x] 3 UK citations (meets spoke bar; verified 2026-06-20): NHS (Blood tests overview), Gloucestershire Hospitals NHS (Full Blood Count — components: red/white cells, platelets, Hb, indices; broad screen for anaemia/infection), NHS (Iron deficiency anaemia — the iron-stores bridge). The dedicated nhs.uk `/types/full-blood-count/` page 404'd; the NHS-trust FBC page is the authoritative component substitute.

### Voice + compliance verification

- [x] 13-point voice self-check: **passes 13/13.** Concrete frame opener ("You didn't choose this test. It chose you."). Diagnostic-question device ("then why do I feel like this?"). Reframe ("A normal FBC rules a lot of things out. It doesn't explain everything."). Triadic rhythm ("red cells… white cells… platelets"; the "what an FBC doesn't measure" four-beat). Fragment paragraphs. Closes with a question. Contractions throughout. **No em dashes** (grep-verified). No banned voice-off words. UK English. Terms (MCV, haematocrit, iron deficiency without anaemia) defined in the same sentence.
- [x] Compliance pre-flight (scanner + judgement): **🔴 0 / 🟠 0 / 🟢 clear.** Both `«diagnose»` hits are in negation. Explicit "We don't run a full blood count, and we don't interpret an abnormal one" line present. Kit 2 framed strictly as **complement, not replacement/better-than**. GP red flags (recheck-requested, breathlessness, weight loss/night sweats/bruising/fever) present. No "testosterone", no FM CTA, no Ashwagandha, no EFSA/supplement claim engaged.

### Gaps + open items at handoff

1. **Funnel route — KEITH DECISION.** Drafted as **Route B** (Kit 2 complement CTA) per Section 19a default. If Keith prefers **Route A** (email-capture only, no Kit 2 CTA), the CTA block + "How Andro Prime helps" H2 swap out; rest stands.
2. **Ewa pull quote — sign-off required.** `{/* TODO: Ewa sign-off required before publish */}` MDX comment left before `<ClinicalInsight>`.
3. **Editorial photo: none** (optional; skipped per `/article` step 7b). `imgSrc` unset → branded generated OG card.
4. **ferritin + B12 spoke up-links** referenced conceptually (FAQ Q4 + "what an FBC misses" section) but not yet hyperlinked beyond the live ones; wire `/blog/ferritin-blood-test` + `/blog/b12-blood-test` when those go live (both now drafted, awaiting Ewa). myth-of-normal-range up-link is LIVE.
5. **Keyword audit** runs at promotion (`/publish-article`); primary in title (PASS by inspection).

### Total addressable vol delivered (actual)

- Planned: 20,200 vol/mo (rows 63, 65). Delivered: 20,200 — both rows addressed (63 primary; 65 in dedicated H2 + body + FAQ). Delta: 0.

---

*D-marker spoke. Lowest-KD anchor in the pillar; converts on the "normal FBC, still flat" job via an honest complement CTA. The one strategic call (Section 19a) is funnel route.*
