---
brief: pillar-D-spoke (D.ferritin)
target_query: ferritin blood test
slug: ferritin-blood-test
vol_uk: 6600
kd: 57
intent: commercial
icp: ICP 2 (active 35-50, recovery-aware) primary; broader fatigue/iron-checking population served informationally
kit_funnel: Kit 2 only (Ferritin is a Kit 2 marker — but low ferritin is a GP-referral dead-end, no supplement; see Section 13)
sequence: Next-wave D-marker spoke; hangs off the LIVE crp-blood-test hub (no 404 risk on up-links)
compliance_gate: Medium (iron-overdose + anaemia framing raises the bar vs CRP hub; low-ferritin = GP, never a supplement CTA)
status: brief-ready
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-06-20
keyword_coverage:
  primary_query: "ferritin blood test"
  primary_query_csv_row: 74
  spoke_count: 0
  total_addressable_vol_per_month: 52840
  csv_rows_targeted: [74, 75, 76, 77, 78]
  csv_rows_hooked_not_targeted: [79, 80]
  csv_rows_dropped: []
  csv_source: andro-prime/06_marketing/seo-ai-search/keywords.csv
---

# Pillar D spoke — "Ferritin blood test"

> D-marker spoke. Follows the lean spoke pattern established by [`pillar-A-spoke-14-signs-of-vitamin-d-deficiency.md`](./pillar-A-spoke-14-signs-of-vitamin-d-deficiency.md): inherit the [Pillar D hub](./pillar-D-hub-crp-blood-test.md) decisions wholesale; only re-derive what is genuinely different for the ferritin marker. Sections that inherit are flagged rather than re-argued.

---

## 1. Why this article ships

`ferritin blood test` is 6,600 vol / KD 57, but it sits at the mouth of the **largest single marker cluster in the validated D pillar**: the ferritin root (`ferritin`, 18,100) and the clinical variant (`serum ferritin`, 18,100) sit behind it, with `ferritin levels` (9,900) and `ferritin test uk` (140, KD 20) rounding the cluster to ~52,840 addressable vol/mo — bigger than the CRP hub's own anchor. Ferritin is also the **most-searched marker an active man actually owns**: it is the single biomarker that explains "I'm doing everything right and I'm still flat," and the one most likely to already be sitting on an NHS printout he doesn't understand.

It ships as a **spoke, not a hub**, on purpose. The CRP hub (`crp-blood-test`, live) is the canonical D marker-explainer; this article links up to it for the cross-marker "what your bloods mean" frame and inherits its E-E-A-T, schema and compliance machinery. The spoke is heavier than a typical spoke because the cluster is heavy, but it stays in its lane: ferritin specifically, iron stores specifically, with the broader bloods conversation deferred to the hub.

**No 404 risk on internal up-links** — unlike the launch-set spokes, this one's hub (`crp-blood-test`) is already published. Links up resolve immediately.

## 2. The article's job (one sentence)

Turn the man who Googled "ferritin blood test" — because his GP mentioned iron, a private panel returned a number, or he's chasing unexplained fatigue — into a Kit 2 (Energy & Recovery) buyer by giving him the most useful UK-specific ferritin explainer on the SERP, while being honest that a *low* ferritin result routes him to his GP, not to a supplement.

## 3. Target reader

Inherits from [CRP hub Section 3](./pillar-D-hub-crp-blood-test.md). ICP 2 (active 35-50, recovery-aware) is the primary funnel target. Ferritin traffic skews slightly broader-population (fatigue is universal), so the article also serves a non-ICP-2 fatigue-checking reader honestly without straining to convert him.

He is searching because one of:

- **An NHS printout flagged ferritin** (often inside a fatigue work-up) and the surgery didn't explain the number.
- **A private panel returned a ferritin value** he can't act on.
- **He's chasing fatigue / poor recovery** and has read that iron is where to look.

He is NOT: a clinician; a man with diagnosed haemochromatosis or anaemia under active management (route to GP); a worried-well googler convinced a high ferritin means liver disease or cancer (defuse, don't amplify — Section 16).

## 4. Search-intent decoded

`ferritin blood test` reads commercial-with-informational-underlay — the same shape as the CRP hub anchor. He has usually already met the marker and wants the explainer plus a decision. The article must:

- **Answer the literal question** ("what is a ferritin blood test, what does it measure, what's normal") in the opening 40-60 word block.
- **Resolve the real job**: interpret a specific number, decide whether it explains how he feels, decide whether to act, retest, or escalate.
- **Carry the asymmetry honestly**: *low* ferritin and *high* ferritin mean completely different things and route completely differently. Low = depleted iron stores, usually fatigue-relevant, and (at the low end) a GP conversation. High = often inflammation or other causes, sometimes iron overload, a different escalation path.
- **Earn the click to Kit 2** as the logical way to *find out where his ferritin sits* — never as a promise to fix a low number.

## 5. SERP gap

Inherits the CRP-hub gap pattern (US clinical sites + generic UK lab-encyclopedia pages ranking on google.co.uk, zero UK men-specialist, zero recovery-aware framing, zero named GMC-reviewed content). Ferritin-specific notes for the writer to confirm at draft time with a fresh `phrase_organic`/SERP scan:

- Expect Medical News Today, Cleveland Clinic, Mayo (US) and `labtestsonline.org.uk` / NHS pages to dominate — generic, non-men, US ranges in mg vs the UK µg/L.
- The wedge is identical to the hub: **UK µg/L ranges + active-man fatigue/recovery frame + named GP review (Dr Ewa Lindo, GMC 4758565) + first-person Keith voice + an honest "what next" that routes low results to the GP.**
- KD 57 on the anchor is the same difficulty as the CRP hub — achievable on the same E-E-A-T + GEO profile, helped by an internal link from a live hub.

## 5a. Keyword coverage map

**Source:** [`keywords.csv`](../keywords.csv) — Pillar D ferritin cluster (rows 74-78; 79-80 hooked only).

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| ---: | --- | ---: | ---: | --- |
| 74 | ferritin blood test | 6,600 | 57 | **Primary target** — H1, slug, opening AI-snippet block |
| 75 | ferritin test uk | 140 | 20 | "How Andro Prime measures ferritin" H2 + UK-ranges H2 |
| 76 | ferritin levels | 9,900 | 42 | "What counts as low / normal / high" H2 + H3 thresholds |
| 77 | ferritin | 18,100 | 57 | Opening section body (root term; defined in first breath) |
| 78 | serum ferritin | 18,100 | 68 | "What ferritin actually is" H2 (serum ferritin = the lab name for the test) |

**Hooked, NOT claimed as rank targets** (commodity symptom battlegrounds; used as language only, per [`content-calendar.md`](../content-calendar.md) "hooks not rank targets" rule):

| CSV row | Query | UK vol/mo | Why hook-only |
| ---: | --- | ---: | --- |
| 79 | low iron symptoms | 22,200 | Symptom commodity; surfaced as body-feel language in "What low ferritin feels like", not targeted |
| 80 | iron deficiency symptoms | 27,100 | Same; the deficiency-symptom rank fight is not winnable on authority and is partly Pillar A territory (row 25 `5 weird signs of iron deficiency` is pillar-A) |

**Total addressable (targeted rows): ~52,840 vol/mo.** Hook rows add ~49,300 of ambient symptom volume the article touches but does not claim.

**Deconfliction:** the live CRP hub covers ferritin *in passing* only ("Kit 2 measures hs-CRP alongside Ferritin…") and claims none of rows 74-78. This spoke is the canonical home for the ferritin marker explainer. No FAQ overlap with the hub's 8 FAQs (the spoke's FAQ set is ferritin-specific — Section 12).

## 6. Word-count + structure

- **Target length:** 2,000 words (top of the long-spoke band 1,500-2,000 per [`tone-of-voice.md`](../../02_brand/tone-of-voice.md) Section 6 — justified by the heavyweight cluster; this is the largest D spoke). Treat as target not ceiling; 1,900-2,100 acceptable.
- **Reading level:** UK Year 10. No jargon in the first 1,000 words unless defined in the same sentence.
- **Skim layer:** every H2 reads as a standalone sentence for skimmers and AI extractors.
- **TOC + jump links + back-to-top** required (1,500+ word standard).

## 7. Opening block (the AI-snippet target)

40-60 words, plain text, immediately under H1.

**Direction (writer drafts to brief):**

> A ferritin blood test measures the protein that stores iron in your body, so it shows how much iron you have in reserve, not just how much is in your blood right now. In the UK, ferritin under 30 µg/L points to depleted iron stores. It is the single most useful marker for unexplained fatigue.

That opening earns the right to introduce "iron stores" and "µg/L" by defining both immediately, and front-loads the fatigue job the reader actually has.

## 8. Heading scaffold (H2 / key H3)

Phrase headings the way an ICP would ask, not the textbook chapter title.

```text
H1  Ferritin blood test — what your iron stores actually mean

  [40-60 word direct-answer block]

H2  What ferritin actually is (without the textbook)
H2  Why your GP ordered it — or why your panel includes it
H2  What counts as low, normal, and high — the UK numbers
  H3  Under 30 µg/L — depleted iron stores
  H3  30-100 µg/L — the "normal but not optimal" grey zone for active men
  H3  Above the range — when high ferritin isn't more iron
H2  What low ferritin feels like in active men
H2  What a single ferritin reading does NOT tell you
H2  What changes when you actually have the number (baseline -> retest)
H2  When to see your GP, not us
H2  How Andro Prime measures ferritin — Kit 2
H2  Frequently asked questions
  [FAQ block — see Section 12]
H2  Your next move
  [CTA block — see Section 13]
```

## 9. Section-by-section content brief

### What ferritin actually is (without the textbook)
- Open with the body-feel/document cue (the printout, the panel, the "iron is where to look" advice).
- Plain-English definition: ferritin is the protein your body stores iron in. A ferritin test measures your iron *reserve* — the tank, not the fuel currently in the line. That's why it drops before you're frankly anaemic: the tank empties first.
- Name the lab synonym: **"serum ferritin"** is the same test (row 78). Defuse the jargon in one line.
- Must avoid treating ferritin as a diagnosis; it's a store-level signal, interpreted in context.

### Why your GP ordered it — or why your panel includes it
- ~150 words. The reader often landed here because someone else ordered it. Common GP triggers: fatigue work-up, low mood, hair shedding, restless legs, heavy-training athlete review. Common private-panel triggers: energy/recovery panels, comprehensive checks.
- Set up the next H2 with the reader's real question: "OK, but what does my number mean?"

### What counts as low, normal, and high — the UK numbers
Most-cited section per the GEO/AI-extraction model. Three H3s.
- **Under 30 µg/L — depleted iron stores.** UK labs commonly flag ferritin < 30 µg/L as iron deficiency (NICE/BSG use ~30 µg/L as the threshold for iron deficiency in adults; < 15 µg/L is unequivocal). Writer confirms exact UK guideline figure at draft (NICE CKS "Anaemia - iron deficiency" + British Society of Gastroenterology iron-deficiency guidance).
- **30-100 µg/L — the "normal but not optimal" grey zone.** A man can sit at 35 µg/L, print "normal" on an NHS report, and still feel the fatigue of low reserves — especially endurance-training men, where some sports-medicine practice targets higher (≥ 50 µg/L) for symptom resolution. Frame as: "normal for the lab's anaemia cutoff is not the same as optimal for how you feel." This is the ferritin version of the CRP hub's "normal CRP vs low hs-CRP" move and the sibling of [`myth-of-normal-range`](../../09_website-app/frontend/content/blog/myth-of-normal-range.mdx).
- **Above the range — when high ferritin isn't more iron.** Ferritin is an acute-phase reactant: infection, inflammation, recent alcohol, liver issues and obesity all raise it independent of iron. So a high ferritin is NOT automatically iron overload. Genuine overload (haemochromatosis) exists and is a GP conversation. Must not let the reader self-diagnose either way.

### What low ferritin feels like in active men
- Where the article earns time-on-page and AI citations. Body-feel checklist (this is where hook rows 79/80 language lives): flat energy that sleep doesn't fix; legs heavy in the back third of a session; breathlessness on efforts that used to be easy; recovery that's slipped; hair shedding heavier than seasonal; restless legs at night; cold hands. Each gets a one-line "why" (iron's role in oxygen transport / energy metabolism, in EFSA-safe, biological-observation phrasing) and an honest qualifier ("many causes overlap; the test is how you find out").
- **Compliance**: describe iron's biological role, never "Andro Prime's test treats your fatigue." Phrasing bar inherits CRP hub Section 16.

### What a single ferritin reading does NOT tell you
- ~200 words. Defuse-the-worry section.
- A single reading is a snapshot; ferritin moves with recent infection, inflammation, training and a recent meal. A high reading after a cold or a hard week is not a baseline. A low reading still needs a cause (why are stores low?) — which is a GP question, not something a supplement settles.
- It doesn't diagnose anaemia (that's the full blood count's job — link across to the FBC spoke once live), doesn't name a cause on its own, and a high value is not "more iron is better."

### What changes when you actually have the number (baseline -> retest)
- ~200 words. The patient-owned-data loop in the ferritin register: marker -> µg/L -> address the cause -> retest at 8-12 weeks -> delta. Note iron stores move slowly, so the retest window is longer than CRP's. Link up to the CRP hub for the cross-marker version of the loop and to `myth-of-normal-range` for the "normal isn't optimal" argument.

### When to see your GP, not us
- **Non-negotiable. ~180 words.** This section carries more weight than the CRP hub's because iron has a real overdose risk and low ferritin can signal underlying bleeding. Direct, enabling, not disclaiming ([`tone-of-voice.md`](../../02_brand/tone-of-voice.md) Section 7).
- GP, not us, if: ferritin < 30 µg/L (depleted stores need a *cause* found and iron dosed by a clinician — we don't sell iron); any low ferritin **with** unexplained weight loss, change in bowel habit, or blood loss → GP promptly (occult bleeding is the thing not to miss); high ferritin that stays high on retest, or a family history of haemochromatosis → GP; under 18 / known iron-handling condition → GP not us.
- State plainly: **Andro Prime does not sell iron supplements; iron overdose is a real clinical risk and iron must be dosed on your numbers by a GP.** (Mirrors the Kit 2 spec ferritin dead-end, [kit-2 spec Section 5](../../04_products/kits/kit-2-energy-recovery-check.md).)

### How Andro Prime measures ferritin — Kit 2
- **One paragraph.** Ferritin is one of Kit 2's four markers (alongside hs-CRP, Vitamin D, Active B12) — the recovery panel for active men. Finger-prick at home, UKAS-accredited lab (Vitall), results in 2-5 working days, reviewed by Dr Ewa Lindo. Links to `/kits/energy-recovery` once inline.
- **Be explicit and honest:** the kit tells you *where your ferritin sits*; if it comes back low, the result routes you to your GP with context and a letter template, not to a supplement upsell. That honesty is the brand. Do not duplicate the kit page's biomarker copy.

## 10. Sources to cite (E-E-A-T + GEO)
Spoke bar is 3 minimum (hub bar is 5); the cross-marker heavy citation lives in the CRP hub this links up to. Writer verifies exact URLs/figures at draft per the `/article` source-verification rule:

- **NHS** — iron deficiency anaemia overview, for the iron-stores framing and the "tank empties first" logic. (`https://www.nhs.uk/conditions/iron-deficiency-anaemia/`)
- **NICE CKS — Anaemia, iron deficiency** — for the UK ~30 µg/L (and < 15 µg/L unequivocal) thresholds. Writer confirms exact figures at draft.
- **British Society of Gastroenterology** — iron-deficiency guideline, for the "low ferritin needs a cause found" / occult-bleeding referral logic (the GP-referral spine).
- *Optional 4th (endurance grey-zone):* a sports-medicine reference for the ≥ 50 µg/L symptom-resolution target in athletes — writer identifies a defensible source (e.g. a BJSM review) or omits rather than over-claim.

Inline format `(source, year, link)`; full reference list at the foot. Shared NHS citation with the hub is intentional and correct (coverage-rules.md "repeating hub citations is intentional").

## 11. Expert quotation block
One Dr Ewa Lindo pull quote. **Placement:** end of "What a single ferritin reading does NOT tell you", before the baseline->retest H2 (the highest-uncertainty point for the reader).

**Draft direction (Ewa to review/rewrite/reject):**

> "Ferritin is the marker I'd check first in a tired man, and the one most often left at 'normal' when it's actually too low for how he feels. A result of 35 is technically inside the range and still low enough to flatten your training. But low ferritin is also the body asking a question — why are the stores down? — and that question belongs with your GP, not with a supplement."
>
> — Dr Ewa Lindo, GMC-registered GP, Andro Prime medical reviewer

Reviewed by Ewa before publish; if she rewrites, replace verbatim; if she rejects, remove the section.

## 12. FAQ block (FAQPage schema)
6 questions, ferritin-specific, deliberately distinct from the CRP hub's FAQ set (FAQPage uniqueness per [`coverage-rules.md`](../coverage-rules.md) Section 5). Pulled from cluster + the live "people also ask" pattern (writer confirms phrasing at draft).

| # | Question | Role |
| ---: | --- | --- |
| 1 | What is a ferritin blood test? | Direct restatement (rows 74, 77) |
| 2 | What is a normal ferritin level for a man in the UK? | Reference-range query (row 76); answer carries the "normal vs optimal" qualifier |
| 3 | What does low ferritin mean? | Low-end interpretation + GP-referral close |
| 4 | What does high ferritin mean? | High-end: inflammation/other causes, not "more iron"; haemochromatosis = GP |
| 5 | Can ferritin be low when my full blood count is normal? | The store-empties-first point; bridges to the FBC spoke once live |
| 6 | Will a supplement fix low ferritin? | **Compliance-critical** — honest "no off-the-shelf fix; iron is GP-dosed; we don't sell it" |

FAQ Q6 is the compliance-sensitive one: it must NOT recommend an iron supplement, must name the overdose risk, and must close with the GP-referral line.

## 13. CTA block (end of article only)
Single CTA. End only. **Kit 2 only.**

- Headline: "Find out where your ferritin actually sits"
- Body: "The Energy & Recovery Check measures ferritin alongside hs-CRP, Vitamin D and Active B12 — the four markers worth running together for recovery-aware men. Finger-prick at home, UKAS-accredited lab, results in 2 to 5 working days. If your ferritin comes back low, we route you to your GP with context, not to a supplement."
- Component: `<InlineKitCTA ctaHref="/kits/energy-recovery" ctaLabel="See the Kit">` + one inline `[See the Kit](/kits/energy-recovery)` in the "How Andro Prime measures ferritin" section.

**The CTA must not imply Kit 2 fixes low iron.** It sells *finding out the number*. This is the honest frame and the one the Kit 2 spec mandates (ferritin dead-end).

**Banned phrases** (whole article): "diagnoses anaemia" / "treats fatigue" / "Andro Prime's test will tell you what's wrong"; any "iron supplement fixes it" / dosing guidance; "cures"/"reverses"/"fixes"; any FM-list CTA ([feedback_fm_list_not_in_content](C:/Users/antid/.claude/projects/d--Androprime-main/memory/feedback_fm_list_not_in_content.md)); "Ashwagandha" (guardrail #3); no "testosterone" framing (Kit 2 rule — energy/recovery only).

## 14. Schema requirements
Same three-block JSON-LD `@graph` auto-generated by the blog route: `Article` (author Keith Antony; `reviewedBy` Dr Ewa Lindo, GP, GMC 4758565), `FAQPage` (from Section 12), `BreadcrumbList` (Home / Blog / Ferritin blood test). Person `@id` resolves for both via `lib/authors.ts`. Confirm at draft time.

## 15. Metadata + URL

| Field | Value |
| --- | --- |
| URL slug | `/blog/ferritin-blood-test` |
| Title tag | `Ferritin Blood Test — What Your Iron Stores Mean \| Andro Prime` (writer trims to ≤60 before site name) |
| Meta description | `What a ferritin blood test measures, what counts as low or normal for UK men, and why low ferritin is a GP conversation. Reviewed by GMC-registered GP Dr Ewa Lindo.` (writer trims to ≤155) |
| OG image | `og/blog-ferritin-blood-test.png` (1200×630, brand template — or per-article OG route `/api/og/blog/ferritin-blood-test`) |
| OG image alt | `Ferritin blood test — UK guide for men` |
| Canonical | self |
| robots | `index: true, follow: true` |

## 16. Compliance gate
**Medium-risk — slightly higher bar than the CRP hub** because of two ferritin-specific hazards:

1. **Iron overdose.** The article must never recommend, dose, or imply an iron supplement. Low ferritin = GP. State the overdose risk explicitly.
2. **Occult bleeding.** Low ferritin can signal underlying blood loss. The GP-referral block must name the weight-loss / bowel-change / blood-loss red flags so the article never lulls a reader past a serious cause.

Pre-flight checklist (writer runs `compliance-preflight` at step 6 of `/article`):
- [ ] No iron-supplement recommendation or dosing anywhere; FAQ Q6 + GP section both carry the "we don't sell iron, it's GP-dosed" line
- [ ] No "diagnose"/"treat" applied to Andro Prime tests/products
- [ ] GP-referral section present, unambiguous, names occult-bleeding red flags, framed as enabling
- [ ] Every threshold (30, 15, ~50, range figures) sourced
- [ ] Iron's biological role stated as observation, never as a product claim
- [ ] No "testosterone" anywhere (Kit 2 rule); no FM CTA; no Ashwagandha
- [ ] Ewa pull quote in her voice, signed off in writing
- [ ] Byline: "Written by Keith Antony, Founder, Andro Prime. Reviewed by Dr Ewa Lindo, GMC-registered GP." + visible "Last updated" date

**Ewa sign-off required in writing** on the full draft before publish.

## 17. Internal linking
**From this article, link out to:**
- `/kits/energy-recovery` (Kit 2) — single CTA + one inline mention in "How Andro Prime measures ferritin"
- `/blog/crp-blood-test` (D hub, LIVE) — link from "What ferritin actually is" and from the baseline->retest section as the canonical cross-marker reference
- `/blog/myth-of-normal-range` (C spoke, LIVE) — link from the "30-100 grey zone" H3 as the sibling "normal isn't optimal" argument
- `/blog/fbc-blood-test` (D spoke) — link from FAQ Q5 / "single reading" section once the FBC spoke is live; `prefetch={false}` placeholder until then

**Into this article, link from:**
- `/blog/crp-blood-test` — add an inline "ferritin is the iron-stores marker — see our [ferritin blood test guide]" pointer where the hub mentions Kit 2's ferritin marker in passing (low-priority edit, bundle with next D publish)
- Future D spokes + the Kit 2 page's RelatedArticles component (auto-surfaces once published)

## 18. AI-citation pre-publish checklist
Inherits CRP hub Section 18. Spoke notes:
- Ferritin's numeric thresholds (30 / 15 / 50 / 100 µg/L) and the acute-phase-reactant caveat are exactly the statistics-rich, expert-attributed format AI systems extract — front-load them cleanly.
- `ferritin blood test` appears in H1, opening block, one H2, and ≤2 more — no stuffing.
- External links get `rel="noopener noreferrer"` via `rehype-external-links` (live).

## 19. Open questions for Keith before draft
Inherits all CRP-hub Section 19 resolutions (length band, Kit 2-only CTA, pull-quote placement, shared-citation policy). Two spoke-specific items, both defaulted so the brief is **brief-ready**; flagged for Keith/Ewa awareness, not blocking:

- (a) **CTA honesty trade.** Ferritin is in Kit 2 but a *low* result is a GP dead-end (~10-15% of Kit 2 buyers per the kit spec). The CTA therefore sells "find out the number," not "fix low iron." Defaulted to ship that way — it's the compliant + on-brand frame. Keith can overrule toward a softer/email-capture CTA if he'd rather not spend a Kit 2 CTA on traffic that partly dead-ends.
- (b) **Endurance grey-zone (≥ 50 µg/L) claim.** Including the athlete symptom-resolution target strengthens the "normal isn't optimal" wedge but needs a defensible source. Defaulted to: include only if the writer verifies a solid reference at draft; otherwise omit. Ewa confirms at sign-off.

## 20. Next steps when this brief is approved
1. (Brief-ready — no blocking open questions; D-hub decisions inherit.)
2. Update keywords.csv — set `primary_article_slug = ferritin-blood-test` on row 74; `coverage_status = briefed` on rows 74-78.
3. Draft article via `/article` skill -> `article-drafts/ferritin-blood-test.mdx`.
4. `compliance-preflight` (auto at step 6 of `/article`).
5. Draft-Writer ingests (`brief_ready` -> `drafted`); Signoff-Concierge opens the Ewa ClickUp task.
6. Apply Ewa edits; publish via `/publish-article` at the next Mon/Thu slot.
7. Set `coverage_status = published` on rows 74-78 at publish.

## 21. Post-draft delivery report (filled at draft handoff 2026-06-20)

Draft: `article-drafts/ferritin-blood-test.mdx` (status: draft; pre-Ewa). ~1,950 words.

### Coverage verification

- [x] Every CSV row in `csv_rows_covered` (74-78) addressed:
  - Row 74 (`ferritin blood test`) — title (H1), slug, opening AI-snippet block, FAQ Q1 ✅ (primary PASS)
  - Row 75 (`ferritin test uk`) — UK-ranges H2 ("UK practice flags ferritin under 30") + FAQ Q2 ("normal ferritin level for a man in the UK") ✅
  - Row 76 (`ferritin levels`) — "What counts as low, normal, and high" H2 ("the ferritin levels that matter") + threshold H3s ✅
  - Row 77 (`ferritin`) — root term, defined in first breath, throughout ✅
  - Row 78 (`serum ferritin`) — "What ferritin actually is" H2 ("If your report says serum ferritin instead, that's the same test") ✅
- [x] Hook rows 79/80 (`low iron symptoms` / `iron deficiency symptoms`) surfaced as body-feel language only ("Flat energy… Legs that go heavy… Breathlessness…"), not claimed as primary.
- [~] Word count ~1,950 (just under the 1,900-2,100 target band; acceptable — the lean spoke discipline held).

### Source verification

- [x] All inline citations carry specific URLs; zero `SOURCE TODO`.
- [x] 3 citations (meets spoke bar; all UK, all WebFetch/WebSearch-verified 2026-06-20): NHS (Iron deficiency anaemia — symptoms + GI-bleed causes + iron-overdose warning), NICE CKS (Anaemia: iron deficiency — the <30 µg/L threshold + acute-phase-reactant point), British Society of Gastroenterology 2021 (*Gut* 70:2030-2051 — ~⅓ of men with IDA have underlying GI pathology; investigate the cause). The <30 µg/L threshold verified at 92% sensitivity / 98% specificity.
- [x] **Athlete ≥50 µg/L grey-zone target OMITTED** (brief 19b default): no tier-1 UK source survived verification; the "stores empty before haemoglobin falls" mechanism (iron deficiency without anaemia) carries the grey-zone argument instead, which is BSG/NICE-supportable.

### Voice + compliance verification

- [x] 13-point voice self-check: **passes 13/13.** Concrete opener (man, March, ferritin 22). "I asked one question" device. Reframe ("normal for the lab… and optimal for how you feel are two different questions"; "not a 'take a supplement' finding. It's a 'find out why' finding"). Triadic rhythm ("Flat energy… Legs… Breathlessness."; "Baseline. Address the cause. Wait. Retest."; "Sleep. Training load. Thyroid."). Fragment paragraphs ("There it was."; "So, plainly."). Closes with a question. Contractions throughout. **No em dashes** (grep-verified). No banned voice-off words. One "you shouldn't" softened to "it's not a thing to guess at". UK English. Technical terms (serum ferritin, acute-phase reactant, iron deficiency without anaemia) defined in the same sentence.
- [x] Compliance pre-flight (scanner + judgement): **🔴 0 / 🟠 2 / 🟢 clear.** The two 🟠 are both `«fix»`: (1) FAQ Q6 question text "Will a supplement fix low ferritin?" echoes the literal search query; the answer is firmly "no, it's a GP conversation" — compliance-reinforcing, left verbatim; (2) "a full night's sleep doesn't fix" — symptom description, not retest-cured framing. All diagnose/treat/diagnosis uses are in negation. EFSA not engaged (no supplement benefit claims; iron's physiological role stated as observation). No FM CTA, no "testosterone", no Ashwagandha. Low-ferritin = GP routing + iron-overdose risk + occult-bleeding red flags all present.

### Gaps + open items at handoff

1. **Ewa pull quote — sign-off required.** Drafted in her voice per brief Section 11; `{/* TODO: Ewa sign-off required before publish */}` MDX comment left inline before the `<ClinicalInsight>` (does not trip the draft-writer placeholder gate). If she rewrites, replace verbatim; if she rejects, remove the block.
2. **Two 🟠 `«fix»` flags** — both judged compliance-reinforcing/colloquial above; Ewa confirms at sign-off.
3. **Editorial photo: none.** Skipped per `/article` step 7b (optional; health-context risk → ship without rather than force). Keith can add via `scripts/unsplash.mjs use ferritin-blood-test <id>` before publish, or leave the branded generated OG card.
4. **`imgSrc` intentionally unset** → og:image falls back to the branded generated card (per skill; avoids referencing a non-existent `/og/blog-ferritin-blood-test.png`).
5. **FBC-spoke up-link** referenced conceptually in FAQ Q5 but not yet hyperlinked (FBC spoke not live) — wire `/blog/fbc-blood-test` with `prefetch={false}` when that spoke ships. CRP-hub + myth-of-normal-range up-links are LIVE and resolve.
6. **Keyword-coverage audit** runs at promotion (`/publish-article`) since the draft is in `article-drafts/`, not `content/blog/`. Primary query is in the title (PASS by inspection).

### Total addressable vol delivered (actual)

- Planned: 52,840 vol/mo (rows 74-78). Delivered: 52,840 — all five targeted rows addressed (74 primary; 75-78 in dedicated sections/FAQ). Delta: 0. Hook rows 79/80 (~49,300) touched as language, not claimed.

---

*D-marker spoke. Heavyweight by cluster size; lean by brief discipline. Hub up-links resolve (CRP hub live).*
