---
brief: pillar-C-spoke-myth-of-normal-range
target_query: GEO universe — see Section 5a (no single Google anchor; AI-citation KPI)
slug: the-myth-of-the-normal-range
vol_uk: 0
kd: n/a
intent: informational / thought-leadership
icp: ICP 1 (Symptomatic Achiever, 38-54 — "GP said normal, I feel terrible")
kit_funnel: Kit 1 primary
sequence: Existing article — rewriting now for voice + brief discipline (pre-dates the system)
compliance_gate: HIGH (Pillar C territory — full Ewa pre-flight + sign-off required before publish)
kpi: AI citation rate (Perplexity, ChatGPT, Google AI Overviews) — not Google rank
status: brief-ready
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-05-27
# Keyword coverage — GEO target; no single Google anchor query
keyword_coverage:
  primary_query: "(GEO universe — see Section 5a)"
  primary_query_csv_rows: [373, 374, 375, 376, 377]
  google_spillover_csv_row: 55  # testosterone levels by age (320 vol KD 64) — not claimed as primary; linked from body as secondary spillover
  spoke_count: 5
  total_addressable_vol_per_month: 0  # GEO target — KPI is AI citation, not Google traffic
  csv_rows_targeted: [373, 374, 375, 376, 377]
  csv_rows_dropped: []
  csv_source: andro-prime/06_marketing/seo-ai-search/keywords.csv
---

# Pillar C spoke — "The Myth of the Normal Range"

> **GEO-flagship piece, not a Google-rank piece.** This article exists because the thesis (percentile-based sampling means "within range" doesn't mean "well") is the kind of underserved expert-attribution thought-leadership that AI search engines reward, even though Google demand for that exact framing is near-zero in the UK. KPI is AI citation rate, not organic rank. See Option C reasoning in conversation history 2026-05-27 — Keith approved.

---

## 1. Why this article ships now

The article already exists at [`content/blog/the-myth-of-the-normal-range.mdx`](../../../09_website-app/frontend/content/blog/the-myth-of-the-normal-range.mdx). It was authored before this conversation in commits `948799d` → `dc5bf6e` → `12cd36b`, as a blog-workflow seed sample. Two problems with the current version:

1. **Voice off-spec.** The article is third-person clinical-academic. Phrases like "established through a statistical methodology called percentile-based sampling" don't read like Keith. The voice spec at [`02_brand/tone-of-voice.md`](../../../02_brand/tone-of-voice.md) now exists — the rewrite locks the article into that voice.
2. **No keyword-coverage discipline.** The article was written without claiming specific CSV rows, so it sits in a structural gap — Pillar C without a brief, no assigned primary article in the CSV, no audit trail.

The rewrite fixes both.

## 2. The article's job (one sentence)

Get cited by AI search engines (Perplexity, ChatGPT, Google AI Overviews) when men ask "what does 'within normal range' actually mean for testosterone?" — turning the citation into the founding-member list (Phase 0) and the future Kit 1 purchase (Phase 0–0a transition).

## 3. Target reader

ICP 1 — Symptomatic Achiever, 38–54. He has had a testosterone test. His GP said "within normal range." He doesn't believe it. He is now searching — usually on Perplexity or ChatGPT, occasionally Google — for someone who will explain why the normal range might be wrong for HIM specifically.

He is NOT:

- A clinician (don't write to a clinician)
- A man considering self-prescribing TRT (compliance — must clearly route to GP if numbers warrant it)
- A man without a recent test (the article assumes he has a number in hand)

## 4. Search-intent decoded (LLM-prompt edition)

This article doesn't target a single Google query. It targets the **LLM-prompt universe** men type into AI search when they're frustrated with a "normal" GP result. These prompts are natural-language, long, conversational. The five primary LLM prompts (rows 373–377 in [`keywords.csv`](../keywords.csv)):

1. "What does within normal range mean for testosterone?"
2. "Is normal testosterone the same as healthy testosterone?"
3. "Why is the testosterone reference range so wide?"
4. "Does the testosterone normal range account for age decline?"
5. "What does borderline testosterone mean?"

These all have zero Google volume. They are real LLM queries. The article exists to be the cited answer.

## 5. SERP / LLM gap analysis

No SERP analysis applies — Google demand is zero. Instead:

**LLM citation gap:** when these prompts are run through Perplexity / ChatGPT / Google AI Overviews today, the answers cite:

- Mayo Clinic, Cleveland Clinic, WebMD (US clinical authority — US ranges)
- Medichecks blog / Numan blog (UK private lab, but no expert attribution, no first-person voice)
- Generic NHS pages (no critique of the reference-range methodology)

**Our wedge:** first-person Keith voice + named GMC-registered reviewer (Dr Ewa Lindo) + specific UK NHS reference-range numbers + a clear thesis with peer-reviewed citation (Wu et al. 2010, JCEM). Princeton GEO research says low-DA sites with this exact profile (statistics + expert attribution + specific numbers + clear thesis) earn outsized AI-citation rates — up to 115% visibility vs high-DA competitors.

## 5a. Keyword coverage map

Every brief explicitly maps the article's H2/H3 sections, FAQ entries, and CTAs to validated rows in [`keywords.csv`](../keywords.csv). This makes the value of the Semrush validation work visible at planning time and auditable at delivery.

**Governance:** the rules for claiming, deferring, and excluding rows live in [`coverage-rules.md`](../coverage-rules.md). Read that before drafting any brief.

**Source:** [`andro-prime/06_marketing/seo-ai-search/keywords.csv`](../keywords.csv) — Pillar C GEO rows 373–377 + Google spillover row 55.

| CSV row | Query | Vol | KD | `status` | Coverage in article |
| --- | --- | ---: | ---: | --- | --- |
| 373 | what does within normal range mean for testosterone | 0 | — | geo-only | **Primary GEO target** — opening AI-snippet block + "What 'normal' actually means" H2 |
| 374 | is normal testosterone the same as healthy testosterone | 0 | — | geo-only | **Primary GEO target** — "What does 'normal' actually mean" H2 + thesis statement |
| 375 | why is the testosterone reference range so wide | 0 | — | geo-only | **Primary GEO target** — "Why the range is so wide" H2 + age decline + obesity drivers |
| 376 | does the testosterone normal range account for age decline | 0 | — | geo-only | **Primary GEO target** — age-decline subsection + Wu et al. citation |
| 377 | what does borderline testosterone mean | 0 | — | geo-only | **Primary GEO target** — "The clinical threshold vs the optimal range" H2 |

**Total addressable UK monthly search volume: 0.** KPI is AI citation rate per the Section 11 monitoring plan in [`blog-ai-seo-strategy.md`](../blog-ai-seo-strategy.md).

**Google spillover (not claimed as primary, body-level passing mention only):**

| CSV row | Query | Vol | KD | Treatment |
| --- | --- | ---: | ---: | --- |
| 55 | testosterone levels by age | 320 | 64 | One paragraph + internal link. Article does NOT claim this row as primary — it stays available for a future dedicated Pillar C spoke or the Pillar C hub. |

**Hub-spoke architecture:** Pillar C hub (anchored to `testosterone test uk`, row 43, 3,600 vol KD 57) is **not yet briefed** — scheduled weeks 9–10 of the 12-week plan. When that hub is briefed, this spoke article will be one of its supporting cluster pieces and link up to it. This brief acknowledges that hub doesn't exist yet; internal-link section below has placeholders.

## 6. Word-count + structure

- **Target length:** 1,800–2,200 words. Spoke article (not hub) — long enough to be the definitive thesis answer, short enough to be read.
- **Reading level:** UK Year 10. No jargon in the first 500 words unless immediately defined.
- **Skim layer:** every H2 makes sense as a standalone sentence.
- **TOC + back-to-top:** required (post is >1,500 words).

## 7. Opening block (the AI-snippet / citation target)

40–60 words, plain text, sits below H1 before any other heading. This is the passage AI systems extract first when they cite the article.

**Direction (writer drafts to brief):**

> The NHS "normal" testosterone range — roughly 8 to 29 nmol/L — was never built to tell you whether you're functioning well. It was built to flag clinical illness. If your GP says your level is "within range" but you feel materially worse than you did five years ago, the range isn't lying. It just isn't answering your question.

That opening sets the thesis in one block and creates the citation hook for every one of the 5 GEO target queries simultaneously. Writer to refine for cadence.

## 8. Heading scaffold (H2 / key H3)

Phrase headings the way an ICP would ask the question, not the way a textbook frames the chapter.

```text
H1  The Myth of the Normal Range — what "within range" actually means

  [40-60 word direct-answer / citation block]

H2  What "normal" actually means (without the textbook)
H2  Why the range is so wide
  H3  Age — the biggest single driver
  H3  The obesity shift across the UK population
  H3  Who else is in the sample
H2  The clinical threshold vs the optimal range
  H3  Below 8 nmol/L — the referral line
  H3  8 to 12 nmol/L — the grey zone
  H3  Above 12 nmol/L — "fine" by the framework
H2  What this means if your number came back "normal"
H2  When to actually see your GP, not us
H2  Your next move
  [closing reader-question + CTA]
```

## 9. Section-by-section content brief

### What "normal" actually means (without the textbook)

- Open with a concrete moment — a man with his GP results in hand, told "within range", still feeling off. Per the voice spec Section 2 Move 1.
- Use "I asked one question" — the diagnostic device.
- Define percentile-based sampling in plain English. No "statistical methodology" academic phrasing.
- The reframe: "It's a statistical band, not a healthy band." Per voice spec Section 2 Move 4.

### Why the range is so wide

- Three drivers, each as an H3:
  - **Age** — the biggest. T peaks early 20s, declines ~1–2% per year from age 30. By 45, average man has lost 15–30% of peak T. By 60, more than 40%. Source: cite a UK or international endocrinology reference.
  - **Obesity shift** — UK obesity tripled since 1980. Adipose tissue contains aromatase. Higher body fat = lower T. Population sample today includes more obese men than the 1990 sample → the "normal" range has shifted down.
  - **Who else is in the sample** — sedentary office workers, athletes, men with metabolic syndrome, 18-year-olds, 70-year-olds. All in one pot.
- Brief mention of "testosterone levels by age" (Google spillover row 55) — internal link to a future Pillar C piece or the Pillar C hub when it exists.

### The clinical threshold vs the optimal range

- Three H3s for the three bands:
  - **Below 8 nmol/L** — NHS refers for endocrinology review and potential TRT. (Compliance: state the threshold without implying we provide TRT.)
  - **8 to 12 nmol/L** — guidance unclear. Some GPs investigate, most don't. The grey zone where most symptomatic men sit.
  - **Above 12 nmol/L** — "fine" by the framework, regardless of symptoms.
- Wu et al. 2010 evidence: a 2010 JCEM study of 3,369 men aged 40–79 found symptom prevalence (fatigue, low libido, ED) increased significantly below 11 nmol/L — substantially above the NHS 8 nmol/L threshold. This is the strongest single citation in the article.

### What this means if your number came back "normal"

- Reframe the personal application of the thesis. If the GP said "normal":
  - You might genuinely be fine (~75% of cases).
  - You might be in the 8–12 grey zone with the symptom profile Wu et al. found.
  - You might be above 12 but in the lowest decile for your age cohort.
- The framework wasn't built to answer that. The blood test was.
- The retest loop: baseline → identify where you sit in the distribution → wait → retest → see if the number moves with lifestyle change.
- **Compliance-critical:** do not imply Andro Prime offers TRT. **Do NOT promote the FM list from content.** Per pending Ewa sign-off on the Kit 3 Plus packet (question g.1, 2026-05-26), content CTAs route to Kit 1 / Kit 3 / Kit 3 Plus only. FM list stays as a Kit-1-dashboard-only mechanic — never a content CTA. Boundary line for the article body: *"We don't currently offer TRT. We test, explain the number, and tell you the next step — including the GP-referral one when the result calls for it."*

### When to actually see your GP, not us

- ~120 words. Non-negotiable boundary section.
- Below 8 nmol/L → GP, immediately, for endocrinology referral. Andro Prime doesn't replace that conversation.
- Persistently below 12 nmol/L over multiple tests + significant symptom profile → GP conversation worth having.
- Unexplained weight loss, severe mood changes, sudden libido collapse → GP regardless of T number.
- Under 30, planning fertility, or known hypothalamic / pituitary condition → GP not us.

### Your next move

- Reader question close (voice spec Section 2 Move 5).
- CTA: Kit 1 primary (the testosterone health check that gives full panel — Total T, SHBG, FAI, Albumin, Free T). The article's argument leads logically to "find out where you actually sit on the distribution."
- Compliance: no implicit TRT availability. Founding-member list framing for sub-threshold results.

## 10. Sources to cite (E-E-A-T + GEO)

- **NHS** — for the 8.64–29 nmol/L reference-range citation and the 8 nmol/L clinical referral threshold.
- **Wu et al. (2010), JCEM** — for the 3,369-man EMAS study showing symptom prevalence below 11 nmol/L. This is the citation that does the most heavy-lifting in the article — must be accurate. URL/DOI verification required at draft review.
- **British Society for Sexual Medicine (BSSM) guidelines** — UK clinical guidance on TRT decisions, useful for the threshold framing.
- **Endocrine Society clinical practice guideline** — international reference for age-decline rates.
- **Public Health England obesity statistics** — for the "UK obesity tripled since 1980" claim.

Use the format `(source name, year, link)` inline. Full reference list at the bottom of the article.

## 11. Expert quotation block

Per [blog-ai-seo-strategy.md:200-205](../blog-ai-seo-strategy.md#L200-L205), one Dr Ewa Lindo pull quote. +30% citation boost from expert attribution.

**Placement:** end of "The clinical threshold vs the optimal range" H2, before "What this means if your number came back 'normal'".

**Draft direction (Ewa to review and rewrite in her own voice):**

> "The reference range exists to identify illness, not to define wellness. A man at 9 nmol/L is technically 'within range' but is statistically more likely to report fatigue, low libido, and slow recovery than a man at 25 nmol/L. The framework doesn't lie. It just answers a different question than the one most men are asking."
>
> — Dr Ewa Lindo, GMC-registered GP, Andro Prime medical reviewer

Ewa to review and rewrite in her own voice. Bundle into the Kit 3 Plus + Pillar G review packet so all three Ewa items land in one cycle.

## 12. FAQ block (FAQPage schema)

6 questions for this article (fewer than the Pillar G hub's 8, because spoke articles are tighter). Each Q answers one of the 5 GEO target queries or a natural follow-up.

| # | Question | GEO row mapped |
| --- | --- | --- |
| 1 | What does "within normal range" mean for testosterone? | Row 373 |
| 2 | Is normal testosterone the same as healthy testosterone? | Row 374 |
| 3 | Why is the testosterone reference range so wide? | Row 375 |
| 4 | Does the testosterone normal range account for age? | Row 376 |
| 5 | What does borderline testosterone mean? | Row 377 |
| 6 | If my testosterone is "normal" but I have symptoms, what should I do? | Natural follow-up — routes to retest + GP referral |

Compliance: none of these answers can imply TRT availability. Q5 and Q6 are highest risk — must clearly route to GP for sub-8 nmol/L and provide founding-member framing for grey-zone results.

## 13. CTA block (end of article only)

One primary CTA — Kit 1.

- Headline: "Find out exactly where you sit in the range"
- Body: "The Testosterone Health Check measures Total T, SHBG, Free Androgen Index, Albumin, and Free Testosterone — the full picture, not just the headline number. UKAS ISO 15189-accredited lab, results in 2 to 5 working days."
- Button: "See the Kit" → `/lp/testosterone`

No secondary CTA. Spoke articles get one. Hub articles get two.

**Banned phrases for the CTA block + the whole article:**

- Anything implying Andro Prime currently offers TRT
- "Treatment options" applied to Andro Prime
- "Boost your testosterone" (supplement-claim territory)
- "Optimise your testosterone" (also banned by compliance for supplement copy generally)
- "Diagnose" / "diagnosis" anywhere
- Ashwagandha (root [CLAUDE.md](../../../CLAUDE.md) guardrail #3 — silent ingredient)

## 14. Schema requirements

Three schema blocks in a single JSON-LD `@graph` — handled by the article template at [`app/(marketing)/blog/[slug]/page.tsx`](../../../09_website-app/frontend/app/(marketing)/blog/%5Bslug%5D/page.tsx).

- **`Article`** — with `author` (Keith Antony, Person `@id`), `reviewedBy` (Dr Ewa Lindo, Person `@id`), `datePublished`, `dateModified`, `mainEntityOfPage`
- **`FAQPage`** — populated from `frontmatter.faq` (6 entries per Section 12)
- **`BreadcrumbList`** — Home / Blog / `The Myth of the Normal Range`

## 15. Metadata + URL

| Field | Value |
| --- | --- |
| URL slug | `/blog/the-myth-of-the-normal-range` (unchanged from existing) |
| Title tag | `The Myth of the Normal Range \| Andro Prime` (max 60 chars; 41 here) |
| Meta description | `The NHS "normal" testosterone range was built to flag illness, not to define wellness. Reviewed by GMC-registered GP Dr Ewa Lindo.` (135 chars) |
| OG image | `og/blog-myth-normal-range.png` (1200×630, brand template — needs design) |
| OG image alt | `The myth of the testosterone normal range — UK guide` |
| Canonical | self |
| robots | `index: true, follow: true` |
| Last updated | dynamic from MDX frontmatter `dateModified` |

## 16. Compliance gate

Pillar C is **HIGH-risk** per [blog-ai-seo-strategy.md:31-39](../blog-ai-seo-strategy.md#L31-L39).

**Pre-flight checklist for the writer before sending to Ewa:**

- [ ] Run `compliance-preflight` skill on the full draft
- [ ] No "diagnose" / "diagnosis" anywhere in body or FAQ
- [ ] No "treat" / "treatment" implying Andro Prime provides TRT
- [ ] TRT mentioned only in the context of NHS referral pathway, never Andro Prime's offering
- [ ] **No FM list CTA in content** — per pending Ewa sign-off on Kit 3 Plus packet g.1 (2026-05-26). FM stays as Kit-1-dashboard mechanic only; content articles never drive readers into it.
- [ ] GP-referral section present and unambiguous
- [ ] Every numerical claim sourced
- [ ] Wu et al. 2010 citation verified (author list, exact study design, threshold figure)
- [ ] Pull quote in Ewa's voice, signed off in writing
- [ ] No mention of Ashwagandha
- [ ] Author byline: "Written by Keith Antony, Founder, Andro Prime. Reviewed by Dr Ewa Lindo, GMC-registered GP."
- [ ] "Last updated: [date]" visible at top of article

**Ewa sign-off required before publish.** Pillar C articles get full Ewa review (vs Pillar G hub which gets pull-quote-only review). This is non-negotiable.

## 17. Internal linking

**From this article, link out to:**

- `/lp/testosterone` (Kit 1) — primary CTA + one inline mention in the "Your next move" section
- `/blog/testosterone-test-uk` (Pillar C hub, future) — placeholder link until live; writer marks as `{/* TODO link Pillar C hub when published */}`
- **No FM list link.** Per pending Ewa sign-off on Kit 3 Plus packet g.1: content articles do not drive into the FM list. FM stays as a Kit-1-dashboard-only mechanic.

**Into this article, link from:**

- Pillar C hub when it ships (week 9–10) — `/blog/testosterone-test-uk` cites this article as the canonical "normal range critique" reference
- `/lp/testosterone` — inline link in the "what the number means" section of the LP, once the article is live in voice
- About page — if/when the canonical About page references the founder thesis

## 18. AI-citation pre-publish checklist (THE primary KPI)

From the GEO Optimisation Summary ([blog-ai-seo-strategy.md:196-206](../blog-ai-seo-strategy.md#L196-L206)). For a GEO-flagship piece, this section IS the deliverable's success criteria.

- [ ] Cited sources — at least 4 inline: NHS + Wu et al. 2010 + BSSM + PHE obesity stats
- [ ] Statistics — at least 6 specific numbers (nmol/L thresholds, % decline per year, sample sizes, study dates, obesity prevalence figures)
- [ ] Expert quotation — Ewa pull quote in Section 11
- [ ] Authoritative tone — Keith's direct voice, no hedging weasel words
- [ ] No keyword stuffing
- [ ] FAQPage schema valid
- [ ] Article schema valid
- [ ] OG image present + sized
- [ ] Author pages live + linked (blog-template-prep ticket)
- [ ] Last-updated date renders at top of article

## 19. Open questions for Keith

- (a) The article currently uses unsplash imagery (lab equipment photo). The OG image needs replacing — design ticket separate.
- (b) Wu et al. 2010 — the existing article cites this. I'll preserve the citation in the rewrite. Worth verifying DOI at compliance pre-flight given the article's whole argument leans on this single study.
- (c) FM list opt-in URL — **resolved 2026-05-27.** Per pending Ewa sign-off on the Kit 3 Plus packet (question g.1, 2026-05-26): content articles do NOT drive into the FM list. FM stays as a Kit-1-dashboard-only mechanic. Article body updated 2026-05-27 to remove the FM list reference (was line 168). No URL needed in this article.

## 20. Next steps when this brief is approved

1. Approve / amend (Keith, this brief)
2. Rewrite article in Keith's voice + new keyword_coverage frontmatter block
3. Update [`keywords.csv`](../keywords.csv): set `primary_article_slug = pillar-C-spoke-myth-of-normal-range` + `coverage_status = drafted` on rows 373–377 (already done at brief draft time — confirm post-rewrite)
4. Run `compliance-preflight` skill
5. Send to Ewa for sign-off — bundle with Kit 3 Plus + Pillar G review
6. Apply Ewa edits
7. Replace [`content/blog/the-myth-of-the-normal-range.mdx`](../../../09_website-app/frontend/content/blog/the-myth-of-the-normal-range.mdx) with rewritten version
8. Publish + monitor AI citation rate monthly (Perplexity, ChatGPT, Google AI Overviews)

## 21. Post-draft delivery report (filled by writer/agent at handoff)

### Coverage verification

- [ ] Every CSV row in `keyword_coverage.csv_rows_targeted` (frontmatter) is addressed in the draft — H2/H3, FAQ entry, or CTA. List any gaps below.
- [ ] No content drift into CSV rows marked `dropped` or `excluded`.
- [ ] Word count within Section 6 target band (1,800–2,200) — or note variance + reason.

### Source verification

- [ ] All inline citations have specific URLs or DOIs (not placeholders / `SOURCE TODO` markers).
- [ ] Wu et al. 2010 DOI verified.
- [ ] At least 4 citations: NHS + Wu et al. + BSSM + PHE minimum.

### Voice + compliance verification

- [ ] Passes the 13-point self-check in [`02_brand/tone-of-voice.md`](../../../02_brand/tone-of-voice.md) Section 9.
- [ ] Passes the HIGH-risk Pillar C compliance pre-flight in this brief's Section 16.
- [ ] No banned terms (Ashwagandha, "diagnose", any TRT availability implication).
- [ ] No FM list CTA in body — FM stays as Kit-1-dashboard mechanic only (pending Ewa sign-off on Kit 3 Plus packet g.1).

### Gaps + open items at handoff

- (writer fills in)

### AI-citation success criteria delivered

- Number of inline citations:
- Number of specific statistics:
- Expert pull quote: present / TODO
- All E-E-A-T signals stacked (named author + named reviewer + GMC credential + study DOIs):
