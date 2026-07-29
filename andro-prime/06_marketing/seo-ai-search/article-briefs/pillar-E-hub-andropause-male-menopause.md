---
brief: pillar-E-hub
target_query: andropause / male menopause (co-primary head terms)
slug: andropause-male-menopause
vol_uk: "cluster ~12-15k/mo (heads unsized individually in DFS; sized demand sits in the symptom/question long-tails: male menopause symptoms 1,600, do men go through menopause 1,600, plus age/is-it-real/how-long)"
kd: heads KD 22-30; achievable long-tails KD 10-18
kd_source: dfs, 2026-07-26 (re-validate exact rows at draft)
intent: informational (symptom-syndrome, "is this happening to me")
icp: ICP 1 primary (dismissed symptomatic man, 40-55, noticing age-related change he's been told is "just getting older"). Secondary ICP 3 (preventative 45+).
kit_funnel: "test-selector routing (primary CTA `/test-selector/`), then Kit 1 (`/kits/testosterone/`) and Kit 3 (broader hormone panel) as the two named next steps. Per CA-028 §8: Kit 1 / Kit 3 only, never Kit 2, never the FM list."
compliance_gate: HIGH. Governed by CA-028 (`03_compliance/claims-and-labels/pillar-E-andropause-claims-pack.md`, APPROVED as drafted 2026-07-26). The pack signs the RULES; this individual article still needs its own `compliance-preflight` + Ewa written sight at draft (CA-028 per-asset gate).
governed_by: CA-028
status: brief-ready
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-07-26
keyword_coverage:
  primary_query: "andropause / male menopause"
  csv_rows_targeted: [108, 109, 110, 122]
  csv_rows_candidate_to_promote: [119]
  csv_rows_flagged_contested: [121]
  csv_source: andro-prime/06_marketing/seo-ai-search/keywords.csv
  note: "rows 108 (andropause) + 109 (male menopause) were split in the CSV (E.hub / E.1). MERGED into one combined hub (Keith 2026-07-26) to avoid cannibalisation; both are co-primary near-synonyms under this slug. Rows were `coverage_status=gate`; CA-028 (signed 2026-06-18) clears the gate."
---

# Pillar E hub: "Andropause (the 'male menopause')"

> The Pillar E parent hub, the syndrome-level explainer. Follows the 21-section structure established by [`pillar-D-hub-how-to-read-blood-test-results.md`](./pillar-D-hub-how-to-read-blood-test-results.md). **Read first:** [`../../../03_compliance/claims-and-labels/pillar-E-andropause-claims-pack.md`](../../../03_compliance/claims-and-labels/pillar-E-andropause-claims-pack.md) (CA-028). This is the most compliance-sensitive article in the whole plan; every say/don't-say call below traces to a CA-028 section. If any line here conflicts with CA-028 or CONTEXT.md, they win.

---

## 1. Why this article ships as the Pillar E parent

"Andropause" and "male menopause" are the words UK men actually type when they feel age-related decline and go looking for what's happening to them. The cluster is large (roughly 12-15k/mo across the umbrella) and, since the 2026-07-26 DFS refresh, winnable: `male menopause symptoms` 1,600 at KD 18, `do men go through menopause` 1,600, `andropause treatment` 170 at KD 10, `what are 3 symptoms of andropause` 210 at KD 10, plus the head terms at KD 22-30. No UK men's-health specialist owns it honestly.

The strategic case is the honesty angle (CA-028 §3). The NHS position is that "male menopause" is an unhelpful term: unlike the female menopause it is not a single, defined event, and most symptoms blamed on it have other causes. We adopt that position rather than fight it, because it is true (so it clears ASA substantiation), it separates us from the "boost your T" crowd, and it leads naturally to the one thing we can honestly offer: a test that shows a man where his testosterone actually sits, so he stops guessing. The article is also a strong GEO / AI-citation asset by construction: `is male menopause real`, `do men go through menopause`, `is there such a thing as male menopause` are exactly the question-shaped queries LLMs answer.

> **Not `manopause` (49,500, KD 10, CSV row 121, CONTESTED).** The head looks irresistible but its SERP is owned by an established "Manopause" brand and `manopause symptoms` is KD 91. Treat it as an alt-term mention inside the hub, never the anchor. Flagged CONTESTED in the CSV for exactly this reason.

## 2. The article's job (one sentence)

Turn the man who searched "andropause" or "male menopause" (worried, half-sure it's real, half-sure he's imagining it) into someone who understands the term honestly, knows the symptoms can have several causes, trusts Andro Prime to be the straight voice, and takes a testosterone test as the logical next step, without the article ever diagnosing him, implying TRT, or telling him he "has" andropause (CA-028 §5).

## 3. Target reader

**ICP 1 (dismissed symptomatic, 40-55), primary.** He has noticed a change: energy down, drive down, recovery slower, mood flatter, and he's been told (by a mate, a GP, or himself) that it's "just age". He's searching the word to find out if it's a real thing and whether he can do anything about it. He is anxious but not acutely unwell.

**ICP 3 (preventative 45+), secondary.** Reading to understand what's ahead and whether to get a baseline.

He is NOT: a man seeking TRT (we do not sell it, CA-028 §5); a man in acute crisis (route to GP); someone wanting the article to confirm a self-diagnosis (it defuses and points to a test + GP, CA-028 §4).

## 4. Search-intent decoded

Informational, syndrome-level, pre-decision. He wants three things answered: is this real, what are the symptoms, and what can I do. The article must:

- **Answer "is it real" honestly and early** (the NHS-caveated frame, CA-028 §3/§4): yes there is a real thing (testosterone does gradually decline with age), but "male menopause" oversells it, and most of what gets blamed on it has other causes.
- **Lead with the body-feel, not the marker** (tone-of-voice §7): the man searches the feeling (energy, drive, recovery, mood), not "testosterone nmol/L". Write to the feeling, then bridge to the test.
- **Keep the symptom-to-cause bridge non-diagnostic** (CA-028 §4): a symptom list cannot tell you the cause; a blood test can show where testosterone sits; what it means is a conversation with your GP.
- **Route to a test, then a GP where clinical** (CA-028 §6/§8): Kit 1 / Kit 3 CTA for the "find out your number" step; GP referral for ED, low mood, symptoms affecting daily life, and under-40s.
- **Never imply treatment** (CA-028 §5): no TRT, no "boost/optimise", no "fix your levels", no waiting-list-for-treatment CTA.

## 5. SERP + GEO gap (writer refreshes at draft)

**The wedge:** the written SERP is NHS/Bupa/Healthline generalist content that either dismisses the term flatly or drifts toward treatment. None of it is a UK men's-specialist, GMC-reviewed page that (a) validates the feeling, (b) tells the honest NHS-caveated truth about the term, and (c) gives a concrete, non-diagnostic next step (test your actual number, and here's when it's a GP conversation). That is our lane.

**Writer action at draft:** run a fresh `serp_organic_live_advanced` for `male menopause` and `andropause` (UK, kd_source=dfs), log the top 15 in the table below, confirm the "no UK men-specialist, honest-but-not-dismissive, named-reviewer" gap holds.

| Position | Domain | Country | Type | Gap they leave |
| ---: | --- | --- | --- | --- |
| _writer fills at draft from fresh DFS SERP scan_ | | | | |

**GEO angle (stronger than the Google angle here):** `is male menopause real` (170), `do men go through menopause` (1,600), `is there such a thing as male menopause` (170) are question-shaped and AI-extractable. Question-headed H2s + FAQPage schema + named GMC reviewer are what earn the citation. This hub is a Pillar F-style citation asset as well as a ranking one.

## 5a. Keyword coverage map

Coverage governance: [`coverage-rules.md`](../coverage-rules.md). **Source:** [`keywords.csv`](../keywords.csv). All rows currently `coverage_status=gate`; CA-028 clears the gate, so they move to `briefed` on approval of this brief.

**Rows this hub claims / covers:**

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| ---: | --- | ---: | ---: | --- |
| 108 | andropause | unsized (head) | 30 | Co-primary: H1, slug, opening block, topical anchor |
| 109 | male menopause | unsized (head) | 29 | Co-primary near-synonym (same intent, same SERP): H1, title/meta |
| 110 | male menopause symptoms | 1,600 | 18/22 | Major H2 ("the symptoms, and why a list can't tell you the cause") |
| 122 | do men go through menopause | 1,600 | n/a | The "is it real" H2 + FAQ |
| 119 | andropause treatment | 170 | 10 | **Handled carefully:** an H2 that answers the intent *educationally* (lifestyle, testing, and "when it's a GP conversation"), NOT a treatment offer. No TRT (CA-028 §5). Promote from candidate; see §19 Q3. |

**Covered in passing / FAQ (not claimed as primary):**

- `is male menopause real`, `is there such a thing as male menopause`, `male menopause age / what age`, `how long does male menopause last`, `what are 3 symptoms of andropause`, `andropause meaning`, `andropause age`: FAQ + section mentions. All near-synonyms of the hub intent.

**Flagged / not anchored:**

- Row 121 `manopause` (49,500, KD 10, CONTESTED): alt-term mention only, never the anchor (§1 note).
- `night sweats men` (row 385, kit-1-hook, unassigned): a symptom hook that touches andropause but is tagged to Kit 1; mention in passing, do not claim (coverage-rules cannibalisation).

**Total addressable (realistic winnable): ~12-15k/mo across the umbrella** (heads + sized long-tails), KD 10-30. Writer re-validates exact rows at draft (the head strings return unsized in some DFS pulls; the synonyms carry the volume).

## 6. Word-count + structure

- **Target length:** 2,400 words (band 2,200-2,600). Syndrome-level explainer; broader than a single-marker hub but must NOT restate marker depth (link down to Pillar C / D).
- **Reading level:** UK Year 10 (Flesch-Kincaid ≤ 10). Feeling-first; no jargon in the first 1,000 words unless defined in-sentence.
- **Skim + GEO layer:** every H2 a standalone question or statement; TOC + jump links + back-to-top; question-headed H2s for AI extraction.

## 7. Opening block (the AI-snippet + voice opener)

40-60 words under H1, plain text. Answers "is it real" honestly in the first breath.

**Direction (writer drafts to brief, must clear the no-repeated-openers rule, tone-of-voice §3):** open on a concrete moment, a man in his 40s who noticed the change and was told it was "just age", phrased fresh. Do NOT reuse any live article's opener (the library already leans on "a man brought me his results" / "a man told me": check openers before drafting). Then the honest one-liner: there is a real thing here, but "male menopause" is a loose name for it, and a symptom list alone can't tell you if testosterone is your problem.

## 8. Heading scaffold (H2 / key H3)

Phrase headings the way an ICP asks (tone-of-voice Move 2), not textbook. Each H2 is one Keith arc (hook, question, reframe, close).

```text
H1  Andropause (the "male menopause"): what it is, the symptoms, and what to do

  [40-60 word direct-answer block]

H2  Is the "male menopause" actually real?
  [NHS-caveated honesty, CA-028 §3/§4: yes to gradual T decline, no to a single switch-off event]
H2  What andropause actually feels like
  [feeling-first symptom picture: energy, drive, recovery, mood, sleep; row 110]
  H3  Why a symptom list can't tell you the cause  [the reframe; CA-028 §4]
H2  Do all men go through it, and at what age?  [row 122 + age long-tails]
H2  What else could it be?  [honest differential: sleep, stress, lifestyle, low Vit D, thyroid; link OUT to Pillar A / B / D, do not restate]
H2  How you actually find out: test your testosterone  [the one honest next step; CA-028 §4]
  H3  Total vs free testosterone, and morning timing  [reading rule only; link to Pillar C / free-androgen-index]
H2  "Andropause treatment": what the honest options are  [row 119; educational: lifestyle + testing + GP; NO TRT, CA-028 §5]
H2  When this is a GP conversation, not a test  [CA-028 §6: ED, low mood, daily-life impact, under-40s]
H2  Which test should you take?  [test-selector routing; Kit 1 / Kit 3, CA-028 §8]
H2  Frequently asked questions  [FAQ, §12]
H2  Your next move  [CTA, §13]
```

## 9. Section-by-section content brief

**Is the "male menopause" actually real?** The honesty spine (CA-028 §3). Yes: testosterone drops about 1-2% a year from the late 30s (tone-of-voice: concrete number, not "significantly"). No: it is not a universal switch-off like the female menopause, and the NHS says the term is misleading because most symptoms blamed on it have other causes. The reframe (tone-of-voice Move 4): "It isn't that the male menopause is a myth. It's that 'menopause' is the wrong word for a slow, uneven change that may or may not be about testosterone at all." Compliance: state the honest position; do NOT tell the reader he has it (CA-028 §5).

**What andropause actually feels like.** Feeling-first (tone-of-voice §7). The body-feel picture: energy, drive, recovery, mood, sleep, using the reader's language. Row 110. Then the non-diagnostic bridge (CA-028 §4 approved line): "Low energy, low mood, poor sleep, a softer sex drive: these can be age-related testosterone change, or they can be sleep, stress, or lifestyle. A symptom list can't tell you which. A blood test can tell you where your testosterone actually sits."

**Why a symptom list can't tell you the cause.** The reframe H3. The point of the whole article: a symptom checklist feels like an answer and isn't one. It names a feeling, not a cause.

**Do all men go through it, and at what age?** Row 122 + age long-tails. Honest: it varies, many men notice little; there is no fixed age. Non-diagnostic.

**What else could it be?** The honest differential and a strong internal-link section. Sleep, stress, training load, low Vitamin D, thyroid. One or two sentences each, then link OUT (coverage-rules §6): Vit D to Pillar A (`/blog/low-vitamin-d-symptoms`), tiredness to Pillar B (`/blog/why-am-i-always-tired`), thyroid to `/blog/thyroid-test`, markers to Pillar D. Do NOT restate their content. This section protects the reader from over-attributing everything to testosterone, which is also the honest (ASA-safe) thing to do.

**How you actually find out: test your testosterone.** The one honest next step (CA-028 §4). Bridge to Kit 1 / Kit 3. Keep the testosterone depth to the reading rule (total vs free, morning timing) and link to Pillar C / `/blog/free-androgen-index` and `/blog/myth-of-normal-range` for the full argument (coverage-rules §6: E answers "is this andropause?", C answers "what's my number?"). Do not become a testosterone explainer.

**"Andropause treatment": what the honest options are.** Row 119, the compliance tightrope. The searcher wants "treatment"; we answer the intent honestly without offering or implying one. Frame: the honest first move is to find out your actual number, not to reach for a fix; lifestyle (sleep, training, weight, alcohol) genuinely moves how men in this bracket feel; and if testosterone is genuinely low, that is a GP conversation. NO TRT, no "boost/optimise/restore", no supplement efficacy claim, no waiting-list CTA (CA-028 §5). The single permitted forward-reference, only if unavoidable, is the exact Phase-0 line "be first to know when we launch our clinical service" (CA-028 §4), no TRT by name.

**When this is a GP conversation, not a test.** Non-negotiable (CA-028 §6). Direct, enabling not disclaiming (tone-of-voice §7). ED (paired with a GP line, never a product CTA alone, because ED can be an early cardiovascular flag). Low mood / loss of interest (mental-health referral, not a test/supplement CTA). Symptoms affecting daily life or relationship. Under-40s with these symptoms (likelier another cause, stronger GP steer). Approved-line direction from CA-028 §4/§6.

**Which test should you take?** Test-selector primary; Kit 1 (testosterone answer) and Kit 3 (broader hormone panel) as the two named next steps (CA-028 §8). One inline sentence each, then the link. Never Kit 2. Never the FM list.

## 10. Sources to cite (E-E-A-T + GEO)

Every clinical/numerical claim cites a source inline. Writer verifies exact URLs at draft (source-verification rule in `/article`); do not fabricate.

- **NHS "Male menopause"** page: the canonical source for the honest, caveated framing (term misleading, symptoms have other causes). This is the spine citation.
- **A named UK guideline for the testosterone reading rule** (morning sample + repeat measurement + the low-T threshold): NICE / British Society for Sexual Medicine (BSSM). Writer identifies and verifies.
- **A UK source for the 1-2%/year age-related decline** figure.
- **Lab Tests Online UK** for total vs free testosterone / SHBG one-liners (then link to Pillar C, do not deep-dive).

## 11. Expert quotation block

One Dr Ewa Lindo pull quote (GEO citation boost). Placement: end of "Is the male menopause actually real?" (the honesty spine, where a GP's voice validates the straight answer). Draft direction (Ewa to review/rewrite in her own voice, or remove): a line that says the honest thing, testosterone declines with age but a symptom list is not a diagnosis, and the useful move is to measure. Leave `{/* TODO Ewa sign-off */}` in the MDX. This article's clinical sight is mandatory regardless (CA-028 per-asset gate).

## 12. FAQ block (FAQPage schema)

8 questions, AI-extractable. Grep against existing briefs/drafts/live MDX before locking (coverage-rules §5).

| # | Question | Source | Role |
| ---: | --- | --- | --- |
| 1 | Is the male menopause real? | 122 / VOC | Honest yes-and-no; the spine |
| 2 | What are the symptoms of the male menopause? | 110 | Feeling-first list + the "can't tell you the cause" caveat |
| 3 | Do all men go through andropause? | 122 | Varies; no fixed event |
| 4 | At what age does the male menopause start? | age long-tails | Ranges, honest |
| 5 | How long does the male menopause last? | how-long long-tail | Honest, non-diagnostic |
| 6 | Is there a treatment for andropause? | 119 | Educational: find your number, lifestyle, GP; NO TRT (CA-028 §5) |
| 7 | Can a blood test diagnose andropause? | VOC | No: a test shows your testosterone; a diagnosis is a GP conversation (CA-028 §4) |
| 8 | Should I see my GP or take a test first? | compliance-critical | Reinforces the boundary (CA-028 §6) |

Q6, Q7, Q8 are the compliance-sensitive ones: no treatment offered, no diagnosis claimed, boundary reinforced.

## 13. CTA block (end only)

Primary CTA the **test selector** (the reader may not know which panel). Kit 1 / Kit 3 as named next steps (CA-028 §8).

- **Primary:** "Not sure if testosterone is part of this? Find out where yours actually sits." → `/test-selector/`
- **Kit 1 (Testosterone):** "Want the testosterone answer specifically? Start here." → `/kits/testosterone/`
- **Kit 3 (broader hormone panel):** "Want the wider hormone picture? Start here." → `/kits/[kit-3-slug]/`

**Banned in the CTA and whole article (CA-028 §5 + CONTEXT.md):** TRT / treatment / therapy; "boost/optimise/restore/fix" testosterone; "diagnose"; "you have andropause / low T"; any FM-list CTA; any TRT waiting-list line; any competitor comparison (that is the `/compare/` cluster, not Pillar E); ashwagandha, ever.

## 14. Schema requirements

`@graph` with `Article` (author Keith Antony; `reviewedBy` Dr Ewa Lindo, GMC 4758565), `FAQPage` (from §12), `BreadcrumbList` (Home / Blog / Andropause). Confirm author pages live in `lib/authors.ts`.

## 15. Metadata + URL

| Field | Value |
| --- | --- |
| URL slug | `/blog/andropause-male-menopause` |
| Title tag | `Andropause (Male Menopause): Symptoms & What to Do \| Andro Prime` (writer trims to ≤ 60) |
| Meta description | Honest, ≤ 155 chars: is it real, the symptoms, why a symptom list can't tell you the cause, and how to find out where your testosterone sits. GMC-reviewed. |
| Hero image | Unsplash pull at `/article` 7b, else `/api/og/blog/[slug]` fallback. No design blocker. |
| Canonical | self · robots index,follow |

## 16. Compliance gate

**HIGH. Governed by CA-028.** This is the most compliance-sensitive article in the plan. Pre-flight checklist for the writer before Ewa sight:

- [ ] Run `compliance-preflight` on the full draft.
- [ ] No "TRT / treatment / therapy / prescribe" anywhere (CA-028 §5). "Andropause treatment" section answers the intent educationally only.
- [ ] No "boost / optimise / restore / fix" your testosterone (CA-028 §5, tone-of-voice §4).
- [ ] No "diagnose" and no "you have andropause / low T" (CA-028 §5). The reader is never told he has it.
- [ ] Symptom-to-cause bridge stays non-diagnostic (CA-028 §4 approved lines).
- [ ] GP-referral section present for ED, low mood, daily-life impact, under-40s (CA-028 §6); ED never paired with a product CTA alone.
- [ ] Low testosterone routes to GP (CA-028 §6), no kit/supplement/FM upsell attached to a low number.
- [ ] CTA is Kit 1 / Kit 3 / test-selector only; no FM list; no TRT waiting-list line (CA-028 §8).
- [ ] No competitor naming or comparison (that is the `/compare/` cluster / CA-030-to-be, not Pillar E; CA-028 §5).
- [ ] Terms "andropause / male menopause" used framed as NHS-caveated (CA-028 §3, E3 resolved).
- [ ] No ashwagandha. No em dashes / en dashes (repo hook + tone-of-voice §3).
- [ ] Ewa pull quote in her voice, signed in writing.
- [ ] Byline: "Written by Keith Antony. Reviewed by Dr Ewa Lindo, GMC-registered GP."

**Ewa written sight on the full draft is mandatory** (CA-028 per-asset gate: the pack signs the rules, not the article).

## 17. Internal linking

**Parent hub.** Links DOWN / OUT; does not restate sibling content (coverage-rules §6).

- OUT to Pillar C testosterone hub + `/blog/free-androgen-index` + `/blog/myth-of-normal-range` (the testosterone reading rule, total vs free, normal-vs-optimal).
- OUT to Pillar A `/blog/low-vitamin-d-symptoms`, Pillar B `/blog/why-am-i-always-tired`, `/blog/thyroid-test`, Pillar D markers (the "what else could it be" differential).
- CTA to `/test-selector/`, `/kits/testosterone/`, Kit 3.
- Use `prefetch={false}` for any not-yet-live target.
- FROM: the symptom spokes (night sweats, low sex drive, etc., when built) up-link to this hub as the Pillar E parent.

## 18. AI-citation pre-publish checklist

- [ ] ≥ 4 inline cited sources (NHS male-menopause + a UK guideline + the decline-rate source + Lab Tests Online UK).
- [ ] ≥ 8 specifics (decline rate, age ranges, threshold, morning-timing rule, etc.).
- [ ] Ewa pull quote (§11).
- [ ] Question-headed H2s + FAQPage schema valid.
- [ ] Direct, non-hedging voice; no keyword stuffing.
- [ ] Author pages live; last-updated renders.

## 19. Open questions for Keith before draft

1. **Merge E.hub + E.1: DECIDED (Keith, 2026-07-26) = single combined hub.** The CSV split `andropause` (row 108, E.hub) and `male menopause` (row 109, E.1) into two articles; they share one intent and one SERP (`male menopause and andropause` is a single 5,400 term), so two would cannibalise (coverage-rules §1). This brief IS the combined hub: rows 108 and 109 are co-primary near-synonyms under one slug, not two articles. `male menopause` is not reserved for a separate article. (CSV cleanup: retire the E.1 designation on row 109, point it at this slug.)
2. **Kit 3 slug.** Confirm the live Kit 3 URL for the CTA.
3. **`andropause treatment` (row 119, commercial intent).** Confirm the educational-only treatment section is the right call (answer the intent, offer nothing), given the commercial intent. Default: yes, per CA-028 §5.
4. **Founder-journey tie-in.** CA-028 §7 permits a founder-journey andropause episode (Keith describes what he noticed + that he tested, never self-diagnosis). Out of scope for this article, but flag if you want a short first-person aside vs keeping Keith's story to the video.

## 20. Next steps when this brief is approved

1. Approve / amend (Keith), resolving §19 (the merge decision first).
2. **keywords.csv:** set `primary_article_slug = pillar-E-hub-andropause-male-menopause` + `coverage_status = briefed` on rows 108, 109, 110, 122; promote row 119 (`andropause treatment`) from candidate via the guarded promoter and assign it here (or leave for a dedicated spoke per Q3); leave row 121 (`manopause`) covered-in-passing, `deferred` (CONTESTED). All were `gate`; CA-028 cleared the gate.
3. Draft via `/article` (auto-invokes `compliance-preflight`).
4. FAQ + differential deconfliction grep against the Vit D / tired / thyroid / myth-of-normal-range articles (coverage-rules §5/§6).
5. **Ewa written sight mandatory** (CA-028 per-asset gate) + pull-quote sign-off.
6. Build MDX + schema; publish via `/publish-article`; co-ordinate so down-link targets are live (`prefetch={false}` otherwise).
7. Update `coverage_status = published` on targeted rows.

## 21. Post-draft delivery report

_Drafted 2026-07-26 via `/article` (inside `/article-to-review`). Draft: [`../article-drafts/andropause-male-menopause.mdx`](../article-drafts/andropause-male-menopause.mdx). Status: drafted, pre-flighted, awaiting Ewa written sight (CA-028 per-asset gate). NOT approved, NOT published._

**Coverage delivered.** 2,420 words (band 2,200-2,600). Primary `andropause` / `male menopause` in H1, title, meta, opening block. Rows covered on-page: 108 (andropause), 109 (male menopause), 110 (male menopause symptoms, the "what it feels like" H2), 122 (do men go through menopause, the "is it real" + "do all men" H2s + FAQ), 119 (andropause treatment, the educational H2 + FAQ Q6, candidate pending guarded promotion). Covered in passing: `manopause` (row 121, one alt-term mention, not anchored), `is male menopause real`, `at what age`, `how long does`, plus the age/is-it-real long-tails via question-headed H2s + 8-question FAQPage. Kept OUT of sibling vocabulary: links down to Pillar C (free-androgen-index, myth-of-normal-range, increase-testosterone-naturally) for the marker depth rather than restating it (coverage-rules §6, E↔C split). Full keyword audit deferred to `/publish-article` (draft still in `article-drafts/`).

**Source verification (WebSearch + WebFetch, no SOURCE TODO).** 4 distinct UK sources, all live and claim-checked at draft: NHS "The 'male menopause'" (term framing + ~1%/yr decline from 30-40 + symptoms often non-hormonal + late-onset hypogonadism uncommon + see-GP); BSSM guidelines (Hackett et al. 2023, *World J Mens Health* 41(3):508-537, via doi.org/10.5534/wjmh.221027) for morning 7-11am sampling, repeat on 2 occasions, the 12 nmol/L threshold, free-T in the 8-12 borderline; Lab Tests Online UK Testosterone Test for total/free/SHBG binding (1-4% free); British Heart Foundation Erectile dysfunction for ED as an early cardiovascular warning sign. Decline figure stated as NHS's "about 1% a year" (not the brief's "1-2%") to match the cited source exactly.

**Voice 13-point self-check: 13/13.** Fresh concrete opener (48-year-old told "just your age"; no reuse of "a man brought me his results" / retired "I asked him one question"); diagnostic-question device varied per section; two "It's not X, it's Y" reframes ("'menopause' is the wrong word…"; "you have a 'which cause is it' problem"); triadic rhythm ("Low energy. Low mood. Low drive."); fragment paragraphs throughout; closes on a reader question; contractions throughout; 0 em/en dashes; 0 voice-off words; 0 "you should / you need to"; UK spellings; plain-English, marker terms defined in-sentence.

**Compliance pre-flight (keyed to CA-028).** Scanner: 3 🔴 HARD remaining, all the *designed keyword-coverage exception* (see below); 0 🟠 REVIEW after noise cleanup; 0 🟡. Banned-term sweep clean: 0 TRT / therapy / boost / optimise / restore, 0 ashwagandha, 0 FM-list / waiting-list, 0 Kit 2, no competitor naming. CTA is test-selector + Kit 1 (`/kits/testosterone/`) + Kit 3 (`/kits/hormone-recovery/`) only. GP-referral section present for ED (BHF-cited), low mood, daily-life impact, under-40s; ED never paired with a product CTA; a total < 12 nmol/L routes to GP with no upsell. Symptom-to-cause bridge uses the CA-028 §4 approved wording. Ewa pull-quote present as draft direction with a `{/* TODO Ewa sign-off */}` marker (§11).

**🟠 FLAG FOR EWA (3 HARD scanner hits = intentional, CA-028-sanctioned):** the deterministic scanner marks these HARD because the literal red-flag table says "treatment"/"diagnose" must be removed in Phase 0. They are retained deliberately as *search-term-in-the-question, answered in the non-treatment / non-diagnostic frame CA-028 §4 + brief §12 Q6/Q7 prescribe*, and are required on-page coverage for row 119 (`andropause treatment`) and the `diagnose andropause` GEO query (invariant #7):
  - L190 H2 `## Is there a treatment for andropause?` → answered "There's no andropause treatment to buy… we don't diagnose and we don't prescribe."
  - L51 FAQ Q6 `Is there a treatment for andropause?` → same educational, no-treatment answer.
  - L59 FAQ Q7 `Can a blood test diagnose andropause?` → answered "No… it can't tell you that you 'have' andropause… what it means is a GP conversation."
  Ewa's call: confirm CA-028's Pillar-E educational-frame permission governs the general red-flag "remove entirely" rule for these three query-echo uses, or redline the phrasing.

**Gaps / open items.** (1) Row 119 `andropause treatment` still `candidate` in the CSV: promote via the guarded promoter before publish (§19 Q3 default = yes). (2) keywords.csv rows 108/109/110/122 still `gate`: set `primary_article_slug` + `coverage_status=briefed` (§20 step 2); row 121 stays `deferred`/covered-in-passing. (3) Ewa pull-quote wording is draft direction, needs her sight/sign-off. (4) Editorial photo added in Phase C (human-picked). (5) **Ewa written sight on the full draft is mandatory** (CA-028 per-asset gate); this delivery report is the pre-check, not the gate.

---

*Pillar E parent-hub brief. Governed by CA-028. The syndrome-level umbrella above the Pillar E symptom spokes; links down to Pillar C for the testosterone marker depth, never restates it (coverage-rules §6). Most compliance-sensitive article in the plan: Ewa written sight mandatory at draft.*
