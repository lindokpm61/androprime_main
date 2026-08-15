# Diagnosis: why informational GEO is 0/54, and it is not the answer copy

**Date:** 2026-08-15
**Owner:** Keith Antony
**Status:** Diagnosed (measured, not inferred). Decisions it forces are listed at the end and are Keith's.
**Workspace:** `06_marketing/seo-ai-search`
**Cost of the diagnosis:** $0.119 of DataForSEO, on top of the $0.78 baseline sweep.
**Inputs:** the 2026-08-15 `track` baseline ([`geo-snapshots/2026-08-15.csv`](./geo-snapshots/2026-08-15.csv)), plus
seven live SERP probes taken the same day.

---

## The headline, and it overturns the working assumption

The working assumption behind the informational half of the tracker was: **sites our size get cited on
these queries, so our 18 articles are competing and losing on answer quality.** The first half of that
is true. The second half is false.

**We are not in the top 99 organic results for any of the three queries diagnosed.** Not ranked low.
Not present.

| Query | AI Overview | Cited sources | Our best organic position |
|---|---|---|---|
| `crp blood test` | present, 8 refs, 4 passages | easytests #6, theforburyclinic #10, pharmacyexprezz #20, medipolglobal #22, ncbi #30, londongpclinic unranked, YouTube x2 | **not in top 99** |
| `why am i always tired` | present, 6 refs, 4 passages | bhf #4, hadwenhealth #5, healthklinix #6, healthline #10, YouTube #11 | **not in top 99** |
| `low vitamin d symptoms` | present, 10 refs, 5 passages | clevelandclinic #2, boots #4, coreprescribingsolutions #6, benenden #7, healthdirect #9, yalemedicine #11, plus nhs.uk / patient.info / medscape from outside the top 12 | **not in top 99** |

Positions are `rank_absolute` from `/v3/serp/google/organic/live/advanced` at `depth: 100`, UK / English,
taken 2026-08-15.

**Sixteen of the nineteen cited web sources sit in the organic top 30 of the same query.** The AI
Overview is, on these three queries, overwhelmingly a re-presentation of the classic top ten with a
long tail to about #30. It is not a separate competition that a better-written answer wins from
nowhere.

### The domain-level number that settles it

`dataforseo_labs/google/ranked_keywords` for `andro-prime.com`, UK, 2026-08-15:

- **17 ranked keywords in total, for the entire domain.**
- **Best position anywhere: #22** (`how to read your blood test results`, vol 590).
- **Four of eighteen articles rank for anything at all**: `how-to-read-blood-test-results`,
  `inflammatory-markers-blood-test`, `fbc-blood-test`, `crp-blood-test` (the last on one keyword,
  `what are infection markers in blood`, at #87).
- **Fourteen of eighteen articles rank for nothing.**
- Only one of the seventeen is above #100. The rest are #71 to #110.

Caveat, stated so it is not over-read: `ranked_keywords` reflects DataForSEO's keyword database, so
genuinely obscure long-tail positions can be missing from it. The three head-term probes above are
direct SERP reads at depth 100 and carry no such caveat. Indexation itself is fine: a `site:` probe
returns 77 URLs including the blog articles, so this is a ranking problem, not a crawling one.

**So the informational 0/54 is fully explained before answer quality is considered at all.** You cannot
be cited from a page the engine is not surfacing.

---

## The passage diff, done anyway, because it says something different from what we expected

The diff was still worth running. It answers the next question: **when we do get visibility, will we be
extracted?** Answer: on one query yes, on one query partly, on one query no, and the reasons are
specific.

Every AI Overview on all three queries has the identical shape: an untitled two-to-three sentence
definition, then two or three **titled blocks of `Label: one flat sentence` bullets**, then a
conversational follow-up prompt. The cited passage is always that label-to-sentence atom.

### `low vitamin d symptoms`: our content already wins this on merit

AIO passage "Common Signs and Symptoms" (cited to clevelandclinic, boots, patient.info,
coreprescribingsolutions, benenden): constant tiredness, bone and joint aches, muscle weakness,
frequent sickness, low mood.

[`low-vitamin-d-symptoms.mdx`](../../09_website-app/frontend/content/blog/low-vitamin-d-symptoms.mdx)
covers **all five**, plus hair and skin, plus the NICE nmol/L bands, plus osteomalacia from the
"Severe or Long-Term Effects" passage, and sources the infection point to the Martineau 2017 *BMJ*
meta-analysis of 25 randomised trials, which is better evidence than anything in the cited set.

**There is no content gap here.** There is a packaging gap: our six symptoms are H3 headings written for
voice ("Tiredness that doesn't shift with sleep", "Mood that drops with the daylight") each followed by
a 60 to 100 word narrative paragraph. The engine lifts `Constant tiredness: Feeling very low on energy
even after a full night of rest.` Ours has to be reconstructed from prose before it can be lifted. That
is a real handicap, but it is a second-order one behind rank 99+.

### `why am i always tired`: a genuine content gap, and it is a compliance-shaped one

AIO passage "Common Lifestyle Causes" maps onto our article almost exactly: sleep, stress, food and
drink, hydration. We have all of it.

AIO passage "Common Medical Causes" is: **iron deficiency anaemia, thyroid problems, vitamin D and B12
shortages, sleep apnoea**, one mechanism sentence each.

[`why-am-i-always-tired.mdx`](../../09_website-app/frontend/content/blog/why-am-i-always-tired.mdx)
names **none of the four**. Our equivalent section, "When tiredness is more than lifestyle", is a
`ClinicalInsight` quote plus a red-flag `SystemAlert` that routes to the GP. It is a good section. It
answers a different question from the one asked.

This is worth saying plainly: **the second-largest block of the AI Overview is the block we
deliberately do not write.** Naming iron deficiency anaemia, hypothyroidism, B12 and sleep apnoea as
common causes of fatigue is a factual statement about a symptom, not a diagnosis of a reader, and every
cited source does it, including the BHF and the NHS. Whether that block can be written inside the
Phase 0 boundary is a compliance question, not an SEO one, and it needs Ewa. Flagged, not assumed.

### `crp blood test`: partial, and the gap is the acute end of the range

Our lead paragraph is a close match for the AIO's definitional passage, and the FAQ block on the live
page (server-rendered `<details>`, verified in the fetched DOM, not just in JSON-LD) contains seven
answers that are near-ideal extraction candidates.

The gap is passage "What the Numbers Mean": the AIO gives **normal under 3 to 5, mild 10 to 50, high
above 50 to 200+ mg/L**. We give under 5 mg/L NHS and the hs-CRP strata under 1 / 1 to 3 / over 3,
because [`crp-blood-test.mdx`](../../09_website-app/frontend/content/blog/crp-blood-test.mdx) is
scoped to low-grade inflammation in otherwise-well active men. **The article answers a narrower
question than the query asks.** Same for "Why Doctors Use It": we have "who puts hs-CRP on a form",
which is the ordering pathway, not the clinical purpose, and we never name the bacterial-versus-viral
discrimination or rheumatoid arthritis / lupus / IBD.

The recurring pattern across all three: **our best content is scoped to active UK men, and the query is
asked by the general population.** That scoping is a real positioning asset on the commercial half of
the funnel. On the informational half it means the passage does not answer the question that was typed.

---

## The one mechanism that does not require ranking, proven on this data

`londongpclinic.co.uk` was cited in the `crp blood test` AI Overview and **does not rank in the top 99
for `crp blood test`**. It was the only such case among the nineteen cited web sources, so it is the
existence proof for the "get cited without ranking" path.

The mechanism is query fan-out. Their cited page is titled *CRP and ESR Tests: What Inflammatory Markers
Reveal About Your Health*, and a direct probe confirms it: **`londongpclinic.co.uk` ranks #10 for
`crp vs esr`.** The AI Overview decomposed `crp blood test` into sub-questions, one of them about the
two markers, and pulled the page that owns that narrower question.

**This is the reachable lever.** We will not outrank Cleveland Clinic on `crp blood test` this year. A
new-ish domain with a good page can reach the top ten on `crp vs esr`, and that is a citation on the
head term. It also reframes what the tracked prompt list is for: the 24 prompts are the **outcome**
surface, and the queries we should actually be trying to rank on are their fan-out children.

---

## What this means for the tracker

`track` measures the outcome and records `top_sources`, which is what made this diagnosis possible. It
does **not** record our own organic position on the tracked query, which is the leading indicator that
explains the outcome. For three months the baseline would have read "0 cited" every month with no way
to tell whether the cause was answer quality, ranking, or crawling, and the natural reading of a flat
zero beside a list of small competitors is "our copy is losing", which is the wrong reading.

**Recommendation: add an `our_rank` column to the snapshot**, populated from the same
`/live/advanced` call the `aio` engine already makes, at no additional cost for the Google surface.
A month where `our_rank` moves from unranked to #40 is progress even while `cited` stays false, and
without that column the tracker cannot show it.

---

## Decisions this forces

> **Decision 1 is TAKEN and implemented, same day (2026-08-15).** The keyword queue is re-pointed at
> fan-out sub-queries, and the `our_rank` recommendation above is built. Both are described in
> [`tools/README.md`](./tools/README.md) (`fanout`, and `our_rank` under `track`). Decisions 2 to 4
> remain open and are unchanged. What was built:
>
> - **`node dataforseo.mjs fanout`** reads Google's own decomposition of each tracked informational
>   prompt (People Also Ask + related searches), qualifies each child, and probes its top ten for
>   whether it contains sites our size. First run: 218 children, 32 `WINNABLE`; 36 merged into
>   `keywords.csv` at priority 1-2, 25 imported as `keyword_queue` candidates via
>   `csv-to-queue.ts --role fanout`. The 4b promotion gate is unchanged and still the article boundary.
> - **The mechanism reproduced independently.** The run caught nine domains cited in a parent's AI
>   Overview while absent from its organic top 100 — londongpclinic on `crp blood test` among them,
>   which is the case this document reasoned from, recovered by a general procedure rather than by hand.
> - **`our_rank` is live on the tracker**, and its first reading extends the finding below: **not just
>   the three diagnosed queries — we are absent from the top 100 on all 23 tracked queries that
>   returned a SERP**, commercial and informational alike.
>
> ⚠️ The correction that matters for reading this document later: the SERP endpoint's **default depth
> is 10, not 100**. Any rank read off a default-depth call can only say "top 10 or nothing". The
> depth-100 reads quoted throughout this document are unaffected — they set `depth` explicitly — but
> the tracker's `aio` probe did not, and now does, at $0.0155 a call against $0.002.

1. ~~**Does the informational workstream stay pointed at head terms, or move to fan-out sub-queries?**~~
   **TAKEN 2026-08-15: moved to fan-out sub-queries.** The evidence said the second, and the queue
   now selects for it.
2. **Do we write the "common medical causes" block on fatigue?** Needs Ewa, not SEO. It is the single
   largest identified content gap and it sits exactly on the compliance boundary.
3. **Do the articles get a scannable `Label: sentence` layer** alongside the current voice, or does the
   voice stay untouched? This is a real tension with the brand writing standard and it is Keith's call,
   not a technical one.
4. **Does the CRP article widen to the acute bands**, or stay deliberately scoped to the recovery range
   and accept that it will not answer the head query?

The one thing the evidence does close: **rewriting answer copy alone will not move informational
citations while the domain ranks 17 keywords with a best position of #22.**
