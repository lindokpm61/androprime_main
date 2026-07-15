---
brief: pillar-D-hub
target_query: how to read blood test results
slug: how-to-read-blood-test-results
vol_uk: 720
kd: 3
kd_source: dfs, 2026-07-14
intent: informational (interpretation-intent; pre-decision, spans awareness to consideration)
icp: spans ICP 1 / 2 / 3 (interpretation-intent umbrella). The man arrives holding numbers he cannot read (NHS printout, private panel, or a result he pasted into ChatGPT). Served by the same article regardless of which kit he eventually needs; routed via the test selector, not pre-sorted into a kit.
kit_funnel: test-selector routing (primary CTA `/test-selector/`) then Kit 1 (`/kits/testosterone/`) + Kit 2 (`/kits/energy-recovery/`) as the two named next steps. This hub serves the whole panel, so it does not pre-assume a kit.
sequence: Pillar D parent hub, publishing as the interpretation umbrella above the marker spokes (CRP, ferritin, B12, FBC, and the coming testosterone / SHBG markers). Sequence after at least one marker spoke is live so there is a real down-link target; co-ordinate with the CRP hub publish cycle.
compliance_gate: LOW-MEDIUM (interpretation / marker-explainer territory; must NOT diagnose; strong GP-referral section required. Ewa pre-flight + written sign-off mandatory.)
status: brief-ready
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-07-14
# Keyword coverage summary (full table in "Keyword coverage" section below)
keyword_coverage:
  primary_query: "how to read blood test results"
  primary_query_csv_row: 70
  spoke_count: 7
  total_addressable_vol_per_month: 5320
  total_addressable_incl_tangential_faq: 11920
  csv_rows_targeted: [70, 69]
  csv_rows_to_promote_from_candidate: [739, 738, 726, 647, 737]
  csv_rows_faq_only_tangential: [453]
  csv_rows_dropped: []
  csv_source: andro-prime/06_marketing/seo-ai-search/keywords.csv
---

# Pillar D hub: "How to read your blood test results"

> The interpretation umbrella for Pillar D. Follows the 21-section structure established by [`pillar-D-hub-crp-blood-test.md`](./pillar-D-hub-crp-blood-test.md) and [`pillar-G-hub-inflammatory-markers-blood-test.md`](./pillar-G-hub-inflammatory-markers-blood-test.md). Section deltas vs. those templates are flagged inline where this hub's job (teach a man to read a whole panel) diverges from a single-marker hub. **Coverage note (read first):** per [`coverage-rules.md`](../coverage-rules.md) Section 6, Pillar D is the canonical marker-explainer pillar. This hub sits ABOVE the marker spokes and links DOWN to them. It must NOT restate per-marker copy: it explains each marker in one or two sentences, then links to the spoke that owns it.

---

## 1. Why this article ships as the Pillar D parent

`how to read blood test results` at 720 vol / KD 3 (row 70, validated, kd_source=dfs 2026-07-14) is not the biggest query in the plan, but it anchors the highest-leverage job on the whole content map: the man who already has the numbers and cannot read them.

The strategic case is not the raw volume. It is what this article replaces. Primary customer research ([`voc-reddit-quora-2026-07-14.md`](./voc-reddit-quora-2026-07-14.md), VOC Theme B "I can get the numbers, I can't read them", confidence High, 5+ sources) shows men are already doing this job with the wrong tool. Verbatim from the communities:

- *"USE CHATGPT, it's a HUGE asset for figuring out bloodwork."*
- *"upload the results into it and have it keep an eye on it, it gives very solid recommendations."*
- Recurring uploaded-lab-screenshot posts begging strangers for interpretation (*"Another Male Excel post"*).

That is the demand this hub captures: men pasting their bloods into a general chatbot because nothing trustworthy explains them. This article is the credible, GMC-reviewed replacement for that behaviour. It is also a prime GEO / AI-citation asset by construction: question-headed H2s, structured reference-range tables, and named-expert review are exactly the format AI systems extract and cite back ([`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) GEO playbook).

The KD is low (3) because the SERP for this query is generic and non-UK-men-specialist. The volume clusters: seven near-identical interpretation queries (row 70 plus six candidate rows, see Section 5a) sit at 720 vol each, and the whole cluster reads one intent. Own the intent, own the cluster.

## 2. The article's job (one sentence)

Turn the man who Googled "how to read blood test results" (or who was about to paste his printout into ChatGPT) into someone who can read a UK men's health panel himself, trusts Andro Prime to be the honest guide, and takes the test selector as his logical next step, without the article ever diagnosing him or restating what the marker spokes already own.

## 3. Target reader

This query is interpretation-intent, so it spans all three ICPs. They converge on the same need (read these numbers) and are served by the same article. The kit routing happens downstream, via the selector, not by pre-sorting the reader here.

**The shared position, whichever ICP:** he is holding numbers he did not choose the framing for. One of:

- **NHS GP printout.** He got a routine bloods result (fatigue work-up, general check, pre-op) with reference ranges but no plain-English reading. He does not want to book another appointment to ask "so what does this mean".
- **Private panel result.** He already paid a competitor (Medichecks, Forth, Thriva, Bupa) and the report gave him values without a usable interpretation.
- **A result he was about to paste into a chatbot.** VOC Theme B: he trusts the numbers, distrusts his ability to read them, and the market's current answer is a general LLM. He is looking for something more trustworthy.

**How the three ICPs colour it:**

- **ICP 1 (dismissed symptomatic, 38-55)** often lands here after a testosterone number he was told was "normal" (VOC Theme A). He needs the "normal is not the same as optimal" idea, and the morning-timing rule for testosterone, more than anyone.
- **ICP 2 (active 35-50, recovery-aware)** is reading a recovery / energy panel and wants to know which markers matter and what "high" means.
- **ICP 3 (preventative 40+, comprehensive-minded)** is reading a broad screen and wants the whole map before he books.

He is NOT:

- A clinician (medical-literate frame, not academic register).
- A patient with a diagnosed condition reading disease-monitoring bloods (compliance: never write to that audience; route to GP).
- A worried-well googler who wants the article to tell him what is wrong. The article defuses and points to the GP, it never diagnoses.

## 4. Search-intent decoded

`how to read blood test results` is informational, pre-decision, interpretation-first. The reader has the numbers; he has not decided to buy anything. The article must:

- **Answer the literal question** ("how do I actually read these numbers") in the opening 40-60 word block, framed as the four things a result is telling you: the marker, the value, the reference range, and the units.
- **Teach the transferable skill, not one marker.** This is the delta vs the CRP hub. The reader wants a method he can apply to any line on any panel: what a reference range is, why "normal" can still mean symptomatic, why units matter, why timing matters for some markers, what a retest tells you.
- **Route by teaching him to self-sort**, then hand him to the test selector rather than a single kit. He may not know which panel he needs; that is the selector's job.
- **Defuse worry without dismissing it.** Some of this intent is anxious (VOC Theme B: *"These results are freaking me out"*). Give honest ranges, name the GP-referral lines, do not spike anxiety.
- **Earn the click to the test selector** by making a proper baseline feel like the logical next step, never the only one.

## 5. SERP gap (writer to refresh at draft time)

**The wedge (from the VOC evidence, not just a SERP scan):** the current top answer for this intent is not really a web page at all. It is a general-purpose chatbot, because no trustworthy UK, men-specialist, GMC-reviewed page reads a panel in plain English. That is the gap. The written SERP for `how to read blood test results` is generic health-portal and non-UK content (NHS overview pages, US consumer-medical sites, lab encyclopedias). None of it:

- reads a UK men's panel specifically,
- teaches the reference-range-vs-optimal distinction that VOC Theme A men need,
- carries named GMC-reviewed authorship,
- or gives an honest, non-diagnostic "what next" that includes "this is a GP conversation".

**Our wedge:** UK reference-range literacy + the normal-vs-optimal reframe + morning-timing and units discipline + named GP review (Dr Ewa Lindo, GMC 4758565) + first-person Keith voice + a "read it yourself" method that a man (or an AI extractor) can actually follow, ending in a "what next" that never drifts into treatment claims.

**Writer action at draft time:** run a fresh `serp_organic_live_advanced` scan for `how to read blood test results` (location UK, kd_source=dfs), and log the top 15 in the table below before drafting. Confirm the "no UK men-specialist, no named-reviewer" gap still holds. Do not ship this section as prose only; the table is a GEO asset.

| Position | Domain | Country | Type | Gap they leave |
| ---: | --- | --- | --- | --- |
| _writer fills at draft time from fresh DFS SERP scan_ | | | | |

Princeton GEO research (referenced in [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md)) shows low-DA sites with statistics-rich, expert-attributed content earn outsized AI-citation rates. A reference-range interpretation hub, dense with UK cutoffs, units, and named strata, is exactly the format AI systems extract and cite. The GEO angle for this article is stronger than the Google angle: `what should i do with my blood test results` (row 202, 0 vol, geo-only, Pillar F target) is an AI-citation opportunity this hub can also earn without targeting on Google. Mention it as an AI-citation angle only.

## 5a. Keyword coverage map

Coverage governance lives in [`coverage-rules.md`](../coverage-rules.md): read before locking this section. **Source:** [`andro-prime/06_marketing/seo-ai-search/keywords.csv`](../keywords.csv).

**Validated rows this hub claims / covers:**

| CSV row | Query | UK vol/mo | KD | Status in CSV | Coverage in article |
| ---: | --- | ---: | ---: | --- | --- |
| 70 | how to read blood test results | 720 | 3 | validated, pillar-D | **Primary target**: H1, slug, opening AI-snippet block |
| 69 | blood test results explained | 720 | 19 | validated, pillar-D | Secondary: one H2 + title/meta support; near-synonym of row 70, same intent |

**Cluster rows currently at `status=candidate` in the discovery backlog: must be PROMOTED and assigned to this slug (see Section 20):**

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| ---: | --- | ---: | ---: | --- |
| 739 | how to interpret blood test results | 720 | 3 | Covered by primary intent: opening block + method H2s (near-synonym of row 70) |
| 738 | how can i read my blood test results | 720 | 9 | Covered by primary intent: opening block + "read it yourself" method |
| 726 | blood test results chart | 720 | 10 | The reference-range table H2 ("what the numbers mean") + FAQ |
| 647 | can i see my blood test results online nhs | 1,000 | 3 | Short FAQ: access/where-to-find question; links to NHS App guidance |
| 737 | urea and electrolytes blood test results explained | 720 | 0 | One H3 under the "common panels" reading example + FAQ (U&E is a common NHS printout line the reader holds) |

> Row numbers 739 / 738 / 726 / 647 / 737 verified against `keywords.csv` on 2026-07-14 (all `status=candidate`, `notes=teardown/discovery 2026-06-21`, `kd_source=dfs`). If a row has shifted by draft time, re-grep by query string rather than trusting the number.

**Tangential: FAQ ONLY, do NOT let it dominate:**

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| ---: | --- | ---: | ---: | --- |
| 453 | how long do blood test results take | 6,600 | 0 | **One short FAQ answer only.** Different job (turnaround, not interpretation). High volume, wrong intent for this hub. A single honest FAQ (NHS timescales + Andro Prime's 2-5 working days) captures it without letting logistics hijack an interpretation article. Do not build an H2 around it. |

**AI-citation-only (not a Google target):**

| CSV row | Query | UK vol/mo | KD | Coverage |
| ---: | --- | ---: | ---: | --- |
| 202 | what should i do with my blood test results | 0 | n/a | geo-only (Pillar F). Mention as an AI-citation angle in the "what next" section; do not target on Google. Canonical home is Pillar F when it ships. |

**Total addressable UK monthly search volume (interpretation cluster): ~5,320/mo** (rows 70, 69, 739, 738, 726, 647, 737). **Including the tangential row 453 FAQ: ~11,920/mo**: but row 453 is a different intent captured by one FAQ, so the honest interpretation-cluster figure is 5,320.

**Hub-spoke claims:** this hub claims **row 70** as `primary_article_slug = pillar-D-hub-how-to-read-blood-test-results`, and **row 69** (`blood test results explained`) as a co-primary near-synonym (same slug, same intent: not a separate article). The five candidate rows, once promoted, are covered by this hub in passing / FAQ; their `primary_article_slug` should be set to this hub too where the intent is genuinely the same (739, 738), and left blank / `deferred` where a future dedicated spoke is more natural (737 U&E could later anchor a spoke). Writer confirms the split with Keith at promotion time.

**Deliberately not targeted / not restated (owned by marker spokes, per coverage-rules.md Section 6):**

| Query family | Owned by | Why this hub does not claim it |
| --- | --- | --- |
| `crp blood test` and CRP cluster | Pillar D CRP hub (`/blog/crp-blood-test`) | Marker spoke owns the depth. This hub links down, explains CRP in one sentence only. |
| `fbc blood test`, `full blood count` | FBC spoke (`/blog/fbc-blood-test`) | Marker spoke. One-sentence mention + down-link. |
| `ferritin` / iron cluster | Ferritin spoke (`/blog/ferritin-blood-test`) | Marker spoke. |
| `b12` cluster | B12 spoke (`/blog/b12-blood-test`) | Marker spoke. |
| `testosterone` / SHBG / free-T cluster | Pillar C + coming D testosterone/SHBG spokes | This hub teaches the morning-timing and normal-vs-optimal *reading rule* only, then links to Pillar C / the spoke. It must not become a testosterone explainer. |
| `cholesterol test` | Pillar I (metabolic) | Moved D → I on 2026-06-18. Not this hub. |

**FAQ / cross-pillar deconfliction (must run before publish):** grep the candidate FAQ questions against existing briefs, drafts, and live MDX per [`coverage-rules.md`](../coverage-rules.md) Section 5. The "when to see your GP" and "normal vs optimal" framings will echo the CRP hub and the myth-of-normal-range article: keep this hub's versions method-level and general, and link down to the marker spokes for the per-marker specifics, so the answers are scope-different (hub = the method, spoke = the marker).

## 6. Word-count + structure

- **Target length:** 2,600 words. Band 2,500-2,800; anything past 2,900 needs a length-justification note. Rationale: this hub teaches a transferable reading method across a whole panel, so it is broader than a single-marker hub, but per coverage-rules.md it must NOT restate marker depth: the down-links carry that weight. That keeps it from bloating past the CRP hub's 2,700. Treat 2,600 as a target, not a ceiling.
- **Reading level:** UK Year 10 (Flesch-Kincaid grade ≤ 10). No jargon in the first 1,000 words unless defined in the same sentence.
- **Skim layer:** every H2 must read as a standalone question or statement so a skimmer (or an AI extractor) can navigate by headings alone.
- **TOC + jump links + back-to-top** required (on-page SEO standard for 1,500+ word posts).
- **One reference-range table** (the "blood test results chart" intent, row 726): a real, sourced, UK-range table is the single most extractable GEO asset in the article.

## 7. Opening block (the AI-snippet target)

40-60 words, plain text, immediately under H1. This is the passage AI systems extract first.

**Direction (writer drafts to brief):**

> To read a blood test result, you need four things: the marker (what was measured), the value (your number), the reference range (the lab's normal band), and the units. The catch is that "inside the range" is not the same as "optimal". This guide shows you how to read each one for a UK men's panel.

That opening defines the method in the first breath and plants the normal-vs-optimal idea (the reframe the whole article turns on) before paragraph two.

## 8. Heading scaffold (H2 / key H3)

Phrase headings the way an ICP would ask, not the way a textbook frames a chapter. Medical-literate, plain English.

```text
H1  How to read your blood test results: a plain-English guide for UK men

  [40-60 word direct-answer block]

H2  The four things every result is telling you
  H3  The marker, the value, the range, the units
H2  What a reference range actually is (and what it isn't)
  H3  Why "normal" is a statistical band, not a health target
  H3  Why the same marker has different ranges at different labs
H2  Why "normal" can still mean you feel terrible
  [the normal-vs-optimal reframe: the article's spine; VOC Theme A]
H2  Units matter more than you think
  H3  nmol/L, mg/L, ng/mL, µg/L, pmol/L: reading the label, not just the number
H2  Timing changes the number: the morning-testosterone rule
H2  How to read the common lines on a UK men's panel
  H3  Testosterone (and why total isn't the whole story) → links to Pillar C / spoke
  H3  Inflammation: CRP / hs-CRP → links to CRP hub
  H3  Iron and ferritin → links to ferritin spoke
  H3  B12 → links to B12 spoke
  H3  FBC / full blood count → links to FBC spoke
  H3  U&E (urea and electrolytes): what that block on the NHS printout means
H2  What one result does NOT tell you
H2  What a retest tells you that a single reading can't (baseline → retest)
H2  When to see your GP, not us
H2  Where to actually find your results (NHS App + private)
H2  Which test should you take?  [test-selector routing]
H2  Frequently asked questions
  [FAQ block: see Section 12]
H2  Your next move
  [CTA block: see Section 13]
```

## 9. Section-by-section content brief

### The four things every result is telling you

- Open with the concrete moment (the printout in his hand, the private report, the screenshot he was about to paste into a chatbot: pick ONE, phrased fresh, per [`tone-of-voice.md`](../../02_brand/tone-of-voice.md) Move 1 and the no-repeated-openers rule §3). Do NOT reuse the CRP hub's opener or the myth-article opener.
- Name the four components plainly: marker, value, reference range, units. This is the transferable skill the whole article delivers.
- Bridge: "Once you can see those four things on any line, you can read any panel. The rest of this guide is what each one is actually telling you, and where 'normal' quietly misleads you."

### What a reference range actually is (and what it isn't)

- Define a reference range in plain English: the band the lab expects "most people" to fall inside, set by sampling a broad population and drawing lines at the 2.5th and 97.5th percentile. It is designed to flag outliers (is this person ill?), not to define optimal (is this person well?).
- Explain why the same marker reads a different range at different labs (different reference populations, different assays). This is the row-726 "chart" intent handled honestly: there is no single universal chart, and that is the point.
- Keep this general and method-level. Do NOT restate any marker's specific range here: that belongs to the marker spokes and to the reading-the-common-lines section's down-links.

### Why "normal" can still mean you feel terrible

This is the article's spine and the VOC Theme A wound ("normal is a lie they tell you", confidence High). ~250 words.

- The reframe (tone-of-voice Move 4): "You don't have a results problem. You have a range-question problem. The range answers 'are you ill'. You were asking 'am I well'. Two different questions."
- Ground it in the testosterone example without becoming a testosterone article: a total-T inside the 8-29 nmol/L band can still sit low for how a man feels, partly because total T is not the same as the testosterone his body can use (free T, SHBG). One or two sentences, then link OUT to Pillar C / the myth-of-normal-range article for the full argument. Do not deep-dive.
- Compliance: this section names the gap between statistical-normal and symptomatic. It must NOT tell the reader he has low testosterone or any deficiency. Frame: "a number inside the range does not on its own rule your symptoms in or out: that is a conversation to have with the full picture, and sometimes with your GP."

### Units matter more than you think

- The under-taught literacy point that makes this hub genuinely useful. A number is meaningless without its unit. Same marker, different unit, wildly different reading.
- Teach the common UK units by sight: nmol/L (testosterone), mg/L (CRP), µg/L (ferritin), ng/L or pmol/L (B12 / active B12). One clean table. This is a strong GEO extractable.
- The actionable line: "Before you panic at a number, check the unit and the range printed next to it. A value that looks alarming in one unit is routine in another."
- Do NOT restate each marker's clinical meaning here: units only. Marker meaning lives in the spokes.

### Timing changes the number: the morning-testosterone rule

- Short H2, ~150 words. A reading-literacy rule most men never hear: some markers move with the time of day. Testosterone is highest in the morning and drops through the day, so a UK testosterone reading is only meaningful from a morning sample (typically before 11am), and ideally fasted per lab guidance.
- Why it matters for reading a result: an afternoon testosterone number read against a morning-calibrated range is a mismatch, not a verdict. If the reader's testosterone was drawn in the afternoon, that alone can explain a low-looking figure.
- Keep it to the reading rule. Link to Pillar C / the testosterone spoke for the testosterone depth. Source the morning-timing convention (UK lab guidance / NICE / Lab Tests Online UK: writer verifies at draft).

### How to read the common lines on a UK men's panel

The hub-as-parent section. This is where the down-linking happens. For EACH marker: one or two sentences on what it is and what "reading it" means, then a link to the spoke. **Do NOT restate the spoke's range copy** (coverage-rules.md Section 6). The rule for this section: if you find yourself writing a third sentence about a marker, cut it and link down.

- **Testosterone**: total vs free vs SHBG in one line; "total alone can mislead". Link → Pillar C / testosterone spoke.
- **Inflammation: CRP / hs-CRP**: "a liver protein that rises when something is irritating your immune system; under 5 mg/L is the standard NHS cutoff". One sentence. Link → `/blog/crp-blood-test`.
- **Iron / ferritin**: "your iron store; low ferritin is a common, missable cause of tiredness in active men". One sentence. Link → `/blog/ferritin-blood-test`.
- **B12**: one sentence. Link → `/blog/b12-blood-test`.
- **FBC / full blood count**: "the headline panel: red cells, white cells, platelets". One sentence. Link → `/blog/fbc-blood-test`.
- **U&E (urea and electrolytes)**: the row-737 intent. Plain: "the kidney-and-salts block on most NHS printouts: sodium, potassium, urea, creatinine". Explain what the block IS (so the man holding an NHS printout recognises it), not how to diagnose from it. No dedicated spoke yet, so give two sentences max and a "if a U&E value is flagged, that is a GP conversation" line.

### What one result does NOT tell you

Short H2, ~200 words. The defuse-the-worry section (VOC Theme B anxiety).

- A single result is a snapshot, not a diagnosis. It names a value, not a cause.
- One out-of-range value on one day is often noise: recent illness, a hard training session, dehydration, the time of day, the meal before the test.
- It does not tell you what to do on its own. A doctor reads it as part of a picture. So should you.
- Explicit non-diagnosis line for compliance: "A number outside the range is a prompt to look closer, not a verdict. It doesn't name a disease, and neither should anyone reading it off a single sheet."

### What a retest tells you that a single reading can't (baseline → retest)

- ~200 words. The patient-owned-data thesis (VOC Theme C, and Pillar F's territory). The point of testing is not the number, it is the trend: baseline → change one thing → retest → read the delta.
- Keep it short and link UP to Pillar F (patient-owned-data hub) once it exists; until then `prefetch={false}` and no hard link.
- Triadic-rhythm candidate (tone-of-voice §3): "A single reading is a snapshot. A retest is a sentence. A year of readings is a paragraph."

### When to see your GP, not us

**Non-negotiable for compliance.** ~180 words. Direct, no waffle. Framed as enabling, not disclaiming (tone-of-voice §7).

- Any result the lab has flagged as needing urgent attention → GP / NHS 111 as the lab advises, promptly.
- A testosterone reading suggesting low T (total T under 12 nmol/L on a proper morning sample) → **that is a GP conversation, not an upsell.** State it plainly. No kit, no supplement, no FM list off the back of a low-T number.
- Ferritin in the deficiency range, or hs-CRP over 10 mg/L on a non-acute reading → GP, not a cross-sell.
- Any result plus red-flag symptoms (unexplained weight loss, night sweats, persistent fever, blood where it shouldn't be) → GP urgently.
- Under 18 / known chronic condition / on treatment → GP, not us.
- Line to include: "Reading your own results is about knowing what to ask and when to act. Sometimes the answer the number points to is: book the GP. We will tell you when that is the honest next step."

### Where to actually find your results (NHS App + private)

- Short, ~120 words. Handles the row-647 intent (`can i see my blood test results online nhs`) as genuine utility.
- NHS results: via the NHS App / GP online services, though not every practice releases every result the same way; some need a GP conversation first. Point to NHS App guidance (writer verifies URL).
- Private results: delivered by the testing provider; Andro Prime results land in the customer dashboard.
- Do not overbuild this; it is a utility answer, not the article's spine.

### Which test should you take?

- The routing section, ~150 words. Because this hub serves the whole panel, it routes to the **test selector**, not a single kit. The reader may not know which panel he needs: the selector is the honest answer.
- Frame: "If reading your last result left you wanting a proper baseline, the question is which panel. That depends on what you're actually chasing." Then two named next steps:
  - Chasing a testosterone answer (dismissed, "normal but feel awful") → Kit 1 (Testosterone).
  - Chasing energy / recovery (tiredness, slow recovery, inflammation) → Kit 2 (Energy & Recovery).
- Primary CTA is the selector; Kit 1 and Kit 2 are the two named paths off it. See Section 13.
- Do NOT duplicate kit-page biomarker copy. One inline sentence each, then the link.

## 10. Sources to cite (E-E-A-T + GEO)

Every numerical / clinical claim cites a source inline. **List of source CATEGORIES to cite: writer verifies exact URLs at draft time per the source-verification rule in the `/article` skill. Do not fabricate specific study citations.**

- **NHS: blood tests overview** for the general "how blood tests work / what reference ranges are / how to see NHS results" framing and the standard CRP <5 mg/L cutoff. Canonical: [https://www.nhs.uk/conditions/blood-tests/](https://www.nhs.uk/conditions/blood-tests/) (same NHS reference used in the CRP hub). Plus NHS App guidance for the "see results online" section.
- **Lab Tests Online UK** (UK Association for Clinical Biochemistry and Laboratory Medicine): the canonical UK consumer reference for what individual markers are and how reference ranges are set. Cite for the reference-range-is-population-based explanation and for per-marker one-liners.
- **UK private-lab reference ranges** (e.g. a named UKAS-accredited lab's published ranges): for the units table and the "ranges differ by lab" point. Cite the actual lab whose ranges are shown; do not present a range as universal.
- **A named UK guideline**: for testosterone: the morning-sample / repeat-measurement convention and the low-T threshold. Candidate: NICE guidance on testosterone / hypogonadism, or the British Society for Sexual Medicine (BSSM) guidelines on adult testosterone deficiency (the <12 nmol/L and morning-sample convention). Writer identifies and verifies the exact guideline at draft time via WebSearch + WebFetch.
- **NICE / NHS reference for U&E and FBC** interpretation framing (kidney-function and full-blood-count blocks): general, non-diagnostic, writer verifies.

Use the format `(source name, year, link)` inline; full reference list at the bottom of the article. Shared citations with the CRP hub (NHS, and any repeated marker source) are intentional and correct: the audit script in [`coverage-rules.md`](../coverage-rules.md) Section 9 should not flag shared canonical citations as duplicates.

## 11. Expert quotation block

One Dr Ewa Lindo pull quote (per [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md) GEO playbook; +30% citation boost from expert attribution).

**Placement:** at the end of the "Why 'normal' can still mean you feel terrible" section: the article's highest-stakes reframe and the point where a dismissed man most needs a GP's voice to validate that the question, not his sanity, was the problem.

**Draft direction (Ewa to review and rewrite in her own voice):**

> "A reference range answers one question: is this person outside what we'd expect for the population? It was never built to answer 'is this man well and performing as he should'. Those are different questions, and a lot of men get waved off because the first one came back fine. Reading your own results well means knowing which question your number actually answered."
>
>: Dr Ewa Lindo, GMC-registered GP, Andro Prime medical reviewer

**Compliance:** the pull quote must be reviewed by Ewa before publish. If she rewrites it, replace verbatim. If she rejects it, remove the section. Leave a `{/* TODO Ewa sign-off */}` marker in the MDX.

## 12. FAQ block (FAQPage schema)

8 questions, structured for direct AI extraction. Grep every question against existing briefs / drafts / live MDX before locking (coverage-rules.md Section 5): this hub's FAQs must not collide with the CRP hub's or the marker spokes'.

| # | Question | Source rows | Role |
| ---: | --- | --- | --- |
| 1 | How do I read my blood test results? | 70, 739, 738 | Direct restatement of primary + near-synonyms: the method in 3-4 lines |
| 2 | What do the numbers on a blood test mean? | 726 | The marker/value/range/units chart intent; short, links to the table H2 |
| 3 | What does it mean if my result is "normal" but I still feel unwell? | (VOC Theme A; long-tail) | The reframe as a Q; highest time-on-page; links to Pillar C |
| 4 | Why are the reference ranges different on different reports? | (long-tail) | Range-is-population-based; reassurance |
| 5 | Can I see my blood test results online on the NHS? | 647 | Access/utility; NHS App pointer |
| 6 | What is a U&E (urea and electrolytes) blood test result? | 737 | Plain description of the NHS printout block; non-diagnostic; GP-referral close |
| 7 | How long do blood test results take? | 453 | **Tangential: one honest answer only** (NHS timescales + Andro Prime 2-5 working days). Do not expand. |
| 8 | Should I see my GP about a result, or can I sort it myself? | (compliance-critical) | GP-referral question; must reinforce the boundary; links to the "when to see your GP" H2 |

Q6 and Q8 are the compliance-sensitive ones. Q6 describes what the U&E block IS (sodium, potassium, urea, creatinine = kidney and salts), lists it as a common printout section, and closes with "if a value there is flagged, that's a GP conversation": it must NOT interpret a specific U&E value as a diagnosis. Q8 must reinforce, not blur, the Phase 0 boundary.

## 13. CTA block (end of article only)

Single CTA, end only, never mid-article. **This hub serves the whole panel, so the primary CTA is the TEST SELECTOR, not a single kit** (the reader may not know which panel he needs).

**Primary CTA: Test selector:**

- Headline: "Not sure which test reads the number you're chasing?"
- Body: "Answer a few questions and we'll point you to the panel that actually measures what you're worried about. Finger-prick at home, UKAS-accredited lab (Vitall), results in 2 to 5 working days."
- Button: "Find your test" → `/test-selector/`

**Two named next steps under the selector (secondary):**

- **Kit 1 (Testosterone)**: "Chasing a testosterone answer after a 'normal' result? Start here." → `/kits/testosterone/`
- **Kit 2 (Energy & Recovery)**: "Chasing energy, recovery or inflammation? Start here." → `/kits/energy-recovery/`

> **Path note (RESOLVED 2026-07-14, Keith):** blog articles link to the indexable kit pages `/kits/testosterone/` and `/kits/energy-recovery/`, never `/lp/*` (per `seo-content-context.md` blog-rule 5). The `/test-selector/` primary CTA is unchanged.

**Banned phrases for the CTA block (and the whole article):**

- "Diagnoses" / "treats" / "cures" / "reverses" / "fixes" anything (compliance red-flag list).
- "We'll tell you what's wrong with you" / any per-customer clinical-interpretation claim (Ewa signs off the system, not individual reports: use "Ewa-approved recommendation logic" if the review is referenced at all).
- Any FM (founding-member) list CTA: content CTAs never route to the FM list.
- "Ashwagandha": guardrail #3, everywhere, always.
- Any low-T inference or upsell off a testosterone number: low T routes to GP.

## 14. Schema requirements

Three schema blocks in a single JSON-LD `@graph`:

- **`Article`**: `author` (Keith Antony, Person, url `/authors/keith-antony`), `reviewedBy` (Dr Ewa Lindo, Person, `jobTitle` GP, credential reference GMC 4758565, url `/authors/dr-ewa-lindo`), `datePublished`, `dateModified`, `mainEntityOfPage`.
- **`FAQPage`**: populated from Section 12.
- **`BreadcrumbList`**: Home / Blog / `How to read your blood test results`.

Confirm both author pages are live in `lib/authors.ts` at draft time.

## 15. Metadata + URL

| Field | Value |
| --- | --- |
| URL slug | `/blog/how-to-read-blood-test-results` |
| Title tag | `How to Read Blood Test Results: UK Guide \| Andro Prime` (54 chars, ≤ 60) |
| Meta description | `Read your blood test results in plain English: markers, ranges, units, and why "normal" can still mean symptomatic. GMC-reviewed UK guide.` (140 chars, ≤ 155) |
| Hero / share image | Unsplash pull via `scripts/unsplash.mjs` at `/article` step 7b; human selects best fit, which sets frontmatter `imgSrc` (used as the in-article hero AND the 1200x630 share image). If nothing is selected, `/api/og/blog/how-to-read-blood-test-results` auto-generates the branded OG as fallback. No design step, not a publish blocker. |
| Hero image alt (if an Unsplash photo is selected) | `How to read your blood test results: UK guide` |
| Canonical | self |
| robots | `index: true, follow: true` |
| Last updated | dynamic from MDX frontmatter `dateModified`, displayed in body |

## 16. Compliance gate

**LOW-MEDIUM.** Interpretation / marker-explainer territory. Slightly higher runway than the single-marker CRP hub because this hub touches testosterone-reading and "normal but symptomatic" (VOC Theme A), which is the highest-sensitivity framing in the plan: it must name the normal-vs-optimal gap without ever telling a man he has low testosterone or any deficiency. Ewa pre-flight + written sign-off mandatory.

**Pre-flight checklist for the writer before sending to Ewa:**

- [ ] Run `compliance-preflight` skill on the full draft (auto-invoked at step 6 of `/article`).
- [ ] No "diagnose" / "diagnosis" applied to Andro Prime tests or to the reader's numbers anywhere.
- [ ] No "treat" / "treatment" / "fix" / "cure" applied to Andro Prime products or to any result.
- [ ] The normal-vs-optimal section names the gap but never states the reader has low T / a deficiency.
- [ ] Low testosterone (total T < 12 nmol/L, morning sample) routes to GP as "a GP conversation", with NO kit/supplement/FM upsell attached.
- [ ] Ferritin-deficiency and hs-CRP > 10 mg/L route to GP, not a cross-sell.
- [ ] GP-referral section ("When to see your GP, not us") present, unambiguous, enabling not disclaiming.
- [ ] U&E FAQ (Q6) describes the block, does not interpret a value as a diagnosis, closes with GP line.
- [ ] Every clinical threshold / unit / range shown is sourced (source categories per Section 10; writer verified URLs).
- [ ] No TRT availability implied (Phase 0). Educational mention only if at all.
- [ ] Ewa pull quote in her voice, signed off in writing.
- [ ] No FM list CTA anywhere. No "ashwagandha" anywhere.
- [ ] Author byline: "Written by Keith Antony, Founder, Andro Prime. Reviewed by Dr Ewa Lindo, GMC-registered GP."
- [ ] "Last updated: [date]" visible at top of article.
- [ ] No em dashes and no en dashes anywhere (repo hook blocks the write otherwise).

**Ewa sign-off required in writing** on the full draft before publish.

## 17. Internal linking

**This hub is a PARENT.** Its job is to link DOWN to the marker spokes and to be the canonical interpretation umbrella. Per [`coverage-rules.md`](../coverage-rules.md) Section 6, marker spokes handle per-marker depth; this hub explains each marker in one or two sentences then links down. **Avoid duplicating marker copy.**

**From this article, link DOWN / OUT to (use `prefetch={false}` for any target not yet live):**

- `/blog/crp-blood-test` (Pillar D CRP hub): from the CRP line in "common lines" + FAQ.
- `/blog/ferritin-blood-test` (ferritin spoke): from the iron/ferritin line.
- `/blog/b12-blood-test` (B12 spoke): from the B12 line.
- `/blog/fbc-blood-test` (FBC spoke): from the FBC line.
- `/blog/free-androgen-index` (when live): from the testosterone / free-T reading line.
- `/blog/myth-of-normal-range` (when live): from the "normal can still mean terrible" section, as the fuller version of the normal-vs-optimal argument.
- Pillar C testosterone hub/spoke: from the testosterone reading line and the morning-timing section.
- `/test-selector/`, `/kits/testosterone/`, `/kits/energy-recovery/`: CTA + the "which test" section (see Section 13 path note).
- Pillar F patient-owned-data hub (retest / trend): from the "baseline → retest" section, WHEN it exists; until then `prefetch={false}` and no hard link.

**Into this article, link FROM (each marker spoke up-links to this hub as the canonical interpretation umbrella):**

- Each Pillar D marker spoke (CRP, ferritin, B12, FBC, and the coming testosterone/SHBG spokes): add an up-link to this hub in a "how to read this result" line. This hub is the canonical parent; the spokes are the depth.
- `/blog/myth-of-normal-range`: cross-link back for the reading-method context.

**Lint:** `lint-blog.js` internal-link rule applies once 3+ articles are live. Build then. Any link to a not-yet-published target uses `prefetch={false}` to avoid a 404 if this hub ships ahead of a spoke: co-ordinate publish order so at least one real down-link target (CRP hub) is live first.

## 18. AI-citation pre-publish checklist

From the GEO Optimisation Summary in [`blog-ai-seo-strategy.md`](./blog-ai-seo-strategy.md). All true before publish.

- [ ] Cited sources: at least 4 inline (NHS + Lab Tests Online UK + a UK private-lab range source + a named UK guideline for testosterone).
- [ ] Statistics / specifics: at least 8 (reference-range bands, unit list, morning-timing threshold, low-T threshold, retest window, NHS turnaround, etc.).
- [ ] Expert quotation: Ewa pull quote in Section 11.
- [ ] One extractable reference-range / units table (the row-726 "chart" asset).
- [ ] Question-headed H2s (AI-extraction format).
- [ ] Authoritative, direct voice; no hedging weasel words.
- [ ] No keyword stuffing: `how to read blood test results` in H1, opening block, one H2, maybe once more. That's it.
- [ ] FAQPage schema valid (validate at `validator.schema.org`).
- [ ] Article schema valid.
- [ ] Share image resolves: either a selected Unsplash `imgSrc` or the `/api/og/blog/[slug]` auto-fallback (no design step).
- [ ] Author pages live and linked.
- [ ] Last-updated date renders at top of article.

## 19. Open questions for Keith before draft

1. **CTA path: RESOLVED 2026-07-14 (Keith).** Blog articles link to indexable `/kits/*`, never `/lp/*` (per `seo-content-context.md` blog-rule 5). The two named next-step links use `/kits/testosterone/` and `/kits/energy-recovery/`; the `/test-selector/` primary CTA is unchanged. Applied throughout.
2. **Row 69 co-primary vs future spoke.** This brief treats `blood test results explained` (720/KD19, row 69) as a co-primary near-synonym under this same slug, not a separate article. Confirm: or reserve row 69 for a dedicated spoke (unlikely, given identical intent).
3. **Candidate-row promotion split.** Rows 739 and 738 are pure near-synonyms of the primary (assign `primary_article_slug` = this hub). Row 737 (`urea and electrolytes...explained`, 720/KD0) could instead anchor a future dedicated U&E spoke rather than being absorbed here. Absorb into the hub now, or leave 737 `deferred` for a spoke? Default: cover in the hub, leave `primary_article_slug` blank / `deferred` so a spoke can claim it later.
4. **Word-count target.** Set at 2,600 (band 2,500-2,800). Confirm, given the down-link discipline keeps it from bloating.
5. **Testosterone depth guardrail.** This hub teaches the *reading rule* for testosterone (normal-vs-optimal, morning timing) and links out to Pillar C. Confirm that is the right boundary and the testosterone/SHBG spoke (not this hub) owns the marker depth.

## 20. Next steps when this brief is approved

1. Approve / amend (Keith, this brief), resolving the Section 19 open questions (CTA path first).
2. **keywords.csv updates:**
   - Set `primary_article_slug = pillar-D-hub-how-to-read-blood-test-results` and `coverage_status = briefed` on **row 70** (`how to read blood test results`) and **row 69** (`blood test results explained`).
   - **Promote from `candidate` and assign `primary_article_slug` / `coverage_status = briefed`:** rows **739** (`how to interpret blood test results`), **738** (`how can i read my blood test results`), **726** (`blood test results chart`), **647** (`can i see my blood test results online nhs`). Use the guarded promoter (`promote-keyword.ts --query "..." --dry` then live) per coverage-rules.md Section 4b; assign this hub as primary where intent is identical (739, 738), leave primary blank/covered where a spoke may later claim (726, 647 per Keith's call).
   - **Row 737** (`urea and electrolytes blood test results explained`): promote from candidate; per Q3, either assign this hub or leave `deferred` for a future U&E spoke (Keith's call). Do NOT assign a row number you cannot re-verify: re-grep by query string at promotion time (numbers verified 2026-07-14 but the backlog shifts).
   - **Row 453** (`how long do blood test results take`): leave as-is or mark `deferred`: covered by one FAQ only, not claimed as primary (different intent).
   - **Row 202** (`what should i do with my blood test results`): no change: stays geo-only (Pillar F); AI-citation angle only.
3. Draft article via `/article` skill (auto-invokes `compliance-preflight` at step 6).
4. Run the FAQ + normal-vs-optimal deconfliction grep against the CRP hub, the marker spokes, and the myth-of-normal-range article (coverage-rules.md Section 5) before locking.
5. Send to Ewa for written sign-off (draft + pull quote).
6. Apply Ewa edits.
7. Build the MDX + schema in `content/blog/how-to-read-blood-test-results.mdx`.
8. Co-ordinate publish order: at least the CRP hub live first so a real down-link target exists; `prefetch={false}` on any not-yet-live spoke link.
9. Publish + monitor; AI-citation tracking starts the month after publish.
10. Update `coverage_status = published` on all targeted rows in keywords.csv.

## 21. Post-draft delivery report (filled by writer/agent at handoff)

When the article draft is complete, the writer (or `/article` agent) fills this section in. Keith reviews against this checklist before the draft moves to Ewa pre-flight.

### Coverage verification

- [ ] Every CSV row in `keyword_coverage.csv_rows_targeted` + promoted candidate rows is addressed:
  - Row 70 (`how to read blood test results`): H1, slug, opening AI-snippet block, primary intent throughout
  - Row 69 (`blood test results explained`): one H2 + title/meta support
  - Row 739 (`how to interpret blood test results`): opening block + method H2s + FAQ Q1
  - Row 738 (`how can i read my blood test results`): "read it yourself" method + FAQ Q1
  - Row 726 (`blood test results chart`): reference-range table H2 + FAQ Q2
  - Row 647 (`can i see my blood test results online nhs`): "where to find your results" H2 + FAQ Q5
  - Row 737 (`urea and electrolytes...explained`): U&E H3 + FAQ Q6
  - Row 453 (`how long do blood test results take`): FAQ Q7 only (tangential, confirmed not expanded into an H2)
- [ ] No content drift into marker-spoke territory: CRP / ferritin / B12 / FBC / testosterone each get ≤ 2 sentences + a down-link; no range copy restated (coverage-rules.md Section 6).
- [ ] Word count within the Section 6 band (2,500-2,800): **____ words.**

### Source verification

- [ ] All inline citations have specific URLs / DOIs. Zero `SOURCE TODO` markers.
- [ ] ≥ 4 citations: NHS blood-tests overview, Lab Tests Online UK, a named UK private-lab reference-range source, a named UK guideline for testosterone (morning-sample + low-T threshold). All URLs verified at draft.

### Voice + compliance verification

- [ ] 13-point voice self-check (tone-of-voice.md Section 9): __/13. Opener fresh (not reused from CRP hub or myth article: no-repeated-openers rule). Reframe present ("You don't have a results problem, you have a range-question problem"). Triadic rhythm present ("A single reading is a snapshot. A retest is a sentence. A year of readings is a paragraph."). Fragment paragraphs ~every 150 words. Closes with a question to the reader. Contractions throughout. UK English. Every technical term defined in the sentence it first appears. No banned voice-off words.
- [ ] 10-point compliance pre-flight (Section 16): results below.
- [ ] No em dashes, no en dashes. No Ashwagandha. No FM list CTA. No low-T upsell. No "treat"/"cure"/"fix"/"diagnose" applied to products or results.

### Compliance pre-flight summary (from `compliance-preflight` skill)

- **HARD FAIL:** ____
- **FLAG FOR EWA:** ____
- **PASS:** ____

### Gaps + open items at handoff

1. Ewa pull quote: sign-off required (`{/* TODO Ewa sign-off */}` marker left in MDX).
2. CTA path RESOLVED (Keith 2026-07-14): `/kits/*` applied (Section 19 Q1).
3. Down-link targets not yet live (which spokes are `prefetch={false}` at ship).
4. Image: Unsplash pull + human-select at `/article` step 7b; if none is selected, the dynamic `/api/og/blog/[slug]` OG covers it. Not a publish blocker, no design step.
5. Any source the writer could not verify to a specific URL.

### Total addressable vol delivered (actual)

- Planned interpretation cluster: ~5,320 vol/mo (rows 70, 69, 739, 738, 726, 647, 737) + 6,600 tangential FAQ (row 453).
- Delivered: ____ vol/mo across ____ rows.
- Delta: ____.

---

*Parent-hub brief for Pillar D. The interpretation umbrella above the marker spokes; links down, never restates marker copy (coverage-rules.md Section 6).*
