---
brief: pillar-G spoke G.1
target_query: what does it mean when your inflammatory markers are elevated
slug: what-does-it-mean-when-your-inflammatory-markers-are-elevated
vol_uk: 480
kd: 2
intent: informational
icp: "Mark: UK man 35-55, has a private or GP blood panel in front of him with an inflammatory marker flagged, wants to know whether to worry"
kit_funnel: "Kit 2 / Energy & Recovery Check (transcribed from lib/content/kitCTA.ts, KIT_CTA.G)"
sequence: "First fan-out spoke. Hub (pillar-G-hub-inflammatory-markers-blood-test) is live; this spoke targets a sub-question the hub does not claim."
compliance_gate: "HIGH. Section 16 carries an unresolved scope question on naming disease causes. Ewa pre-flight required before publish."
status: draft  # blocked on Section 19 (Keith). Set to brief-ready once 19 is answered.
owner: Keith Antony
reviewer: Dr Ewa Lindo
last_updated: 2026-08-15
---

# Brief: "what does it mean when your inflammatory markers are elevated"

> **Status: NOT brief-ready.** Sections 1 to 18 are authored. **Section 19 is open and is
> Keith's to answer**, and two of its questions change the article's structure, not just its
> wording. Do not invoke `/article` on this brief until 19 is resolved and `status` is
> `brief-ready`.

## 1. Why this article ships (sequence + rationale)

First spoke from the 2026-08-15 fan-out work ([`2026-08-15-fanout-spoke-plan.md`](../2026-08-15-fanout-spoke-plan.md)),
and the best risk-adjusted target in the set: 480/mo at **KD 2**, against a domain whose best
position anywhere is #22.

The strategic case is in [`2026-08-15-informational-citation-diagnosis.md`](../2026-08-15-informational-citation-diagnosis.md).
We are absent from the organic top 100 on all 23 tracked queries, so the hub cannot be cited on
its head term. A narrow spoke that reaches the top ten of a sub-question can be, because the AI
Overview on the head term decomposes into exactly these sub-questions. This article is the first
test of that mechanism on our own domain.

**The SERP says it is reachable, which is why this query and not a bigger one.** Six of the top
ten are UK private clinics our size or smaller.

## 2. The article's job (one sentence)

Tell a man looking at a flagged inflammatory marker what a raised result actually means, why the
test cannot say what caused it, and what happens next, in a form an answer engine can lift whole.

## 3. Target reader (ICP)

Mark, 35 to 55, UK. He has a result in front of him **right now**, flagged or out of range. He is
not researching inflammation as a topic; he is trying to work out whether he should be worried
before his GP appointment. Anxiety is the dominant emotion and the article's tone has to lower it
without dismissing the finding.

Distinct from the hub's reader, who is earlier: still deciding whether to test at all.

## 4. Search-intent decoded

Informational, urgent, post-test. The query is phrased as a full question, which is why it draws
an AI Overview and a four-item People Also Ask block. The searcher wants three things in order:
what it means, what causes it, what happens now. Nothing about buying.

## 5. SERP gap (analysis)

Live read 2026-08-15, UK, depth 10 (`dataforseo.mjs`, cached in `.fanout-harvest-2026-08-15.json`):

| pos | domain | note |
| --- | --- | --- |
| 3 | arcwestarchive.org.uk | also cited in the AIO |
| 4 | bluecrestwellness.com | private screening |
| 5 | theforburyclinic.co.uk | also cited in the AIO |
| 6 | nhs.uk | |
| 7 | londongpclinic.co.uk | also cited in the AIO; the domain from the diagnosis proof case |
| 8 | medlineplus.gov | |
| 9 | nhsinform.scot | |
| 10 | privatebloodtestslondon.co.uk | also cited in the AIO |
| 11 | healthscreeningclinic.co.uk | |

**Verdict WINNABLE.** Six non-authority domains in the top ten. No Cleveland Clinic, no Healthline,
no Mayo. This is the shape the fan-out thesis predicted and it is unusually clean.

**The AI Overview, verbatim structure** (this is the thing to beat):

1. Untitled definitional paragraph: markers such as CRP or ESR mean the immune system is active and
   there is inflammation somewhere; the tests are **non-specific** and cannot give cause or location.
2. `### Common Causes of High Levels` as `Label: one flat sentence` bullets: Infections / Injuries or
   Surgery / Autoimmune Diseases / Other Factors.
3. `### What Happens Next`: doctors read symptoms and exam alongside the number; more tests may
   follow; a single high result is often rechecked.

Cited: arcwestarchive, theforburyclinic, londongpclinic, patient.info, privatebloodtestslondon,
solvhealth, one YouTube. **Five of seven are small UK clinics.** Sites our size are cited here today.

**The gap.** Every competitor answers the question generically. **None of them answers it for a
training population**, and that is the one thing we can say that they cannot: hard exercise raises
these markers, and a man who trains is the single most likely person to see a mildly raised result
with nothing wrong. The hub already carries this ground (Pettersson 2008 is cited in the liver
article for the same mechanism). That is the wedge.

**People Also Ask** (all four are FAQ candidates, see Section 12): What can cause inflammatory
markers to be high? / What are 5 signs your body has inflammation? / What cancers show high
inflammatory markers? / What will a doctor do if CRP is high?

## 5a. Keyword coverage map

Governance: [`coverage-rules.md`](../coverage-rules.md). Collision-checked against every published
article's `keyword_coverage` block with `tools/coverage-collision.mjs`: **no collisions**.

| CSV row | Query | UK vol/mo | KD | Coverage in article |
| --- | --- | ---: | ---: | --- |
| fanout | what does it mean when your inflammatory markers are elevated | 480 | 2 | **Primary target**: H1, slug, opening block |
| fanout | what does it mean when your blood test shows inflammation | 0 | 35 | H2 1 body |
| fanout | what does it mean if my inflammation markers are high in a blood test | 0 | - | FAQ Q1 |
| fanout | what are the inflammation markers in a blood test | 20 | - | H2 2 |
| fanout | what are 5 signs your body has inflammation | 10 | - | FAQ Q4 |

**Total addressable: ~510/mo.** Low by design. A fan-out spoke is bought for the citation it wins
on its parent, not for its own traffic (diagnosis, "the one mechanism that does not require ranking").

**Explicitly NOT owned here**, and left to the hub: `inflammatory markers blood test` (row 94, the
hub's primary), `what causes inflammation in the body` (row 98), `how to reduce inflammation`
(rows 99/103/294/295/296, EFSA-gated and the hub's FAQ Q8), `best supplements for inflammation`
(row 105). **See Section 19 Q2: the hub's H2 "What high inflammation usually means" sits close to
this spoke's job and one of the two has to give way.**

## 6. Word-count + structure

**1,400 to 1,800 words.** Deliberately shorter than a hub. The query is urgent and narrow, and the
extractable answer has to be near the top. Four H2s, no more.

## 7. Opening block (the AI-snippet target)

Two to three sentences, before any heading, answering the question outright. It must state the
**non-specific** point, because that is the load-bearing fact in every cited source and the thing a
worried reader most needs:

> A raised inflammatory marker means your immune system is active and something in your body is
> causing inflammation. It does not say what, and it does not say where. CRP and ESR are
> deliberately non-specific tests: they tell your doctor to look, not what to look for.

Then, immediately, the differentiator the SERP lacks: for a man who trains hard, a mildly raised
CRP is common and often means the last hard session, not disease.

## 8. Heading scaffold (H2 / key H3)

1. **What a raised inflammatory marker actually tells you** (and what it cannot)
2. **The markers on a UK panel**: CRP, hs-CRP, ESR (H3 each). What each measures, how fast each moves.
3. **What raises them** (H3 per driver, see Section 19 Q1 on which drivers are named)
4. **What happens next**: the recheck, the timescale, and when it is a GP conversation

## 9. Section-by-section content brief

- **H2 1.** Non-specific is the whole point. An analogy that does not trivialise: a smoke alarm tells
  you there is smoke, not where the fire is. Cover the acute-vs-low-grade distinction, because a man
  with CRP 4 and a man with CRP 90 are in completely different conversations and the SERP blurs them.
- **H2 2.** CRP: rises within hours, falls within days. hs-CRP: the same molecule read at low
  concentrations for cardiovascular and recovery context, which is the one Kit 2 carries. ESR: slower,
  older, still ordered. State UK reference ranges against the printed lab range, per house rule.
- **H2 3.** The training driver leads, because it is our ground and nobody else's. Then the general
  drivers. **The disease drivers are Section 19 Q1.**
- **H2 4.** The recheck is the most useful practical fact and every cited source carries it: a single
  raised result is routinely repeated before anything is concluded. Give the timescale. Red flags to
  a GP go in a `SystemAlert`, consistent with the fatigue article.

## 10. Sources to cite (E-E-A-T + GEO)

Every source verified live at draft time by `/article` (WebSearch + WebFetch, no `SOURCE TODO`).

- **NICE / NHS** for CRP and ESR reference ranges and the recheck pathway.
- **Pettersson et al. 2008, British Journal of Clinical Pharmacology** for exercise-induced marker
  elevation. Already used in the liver article for the same mechanism.
- **Ridker** on hs-CRP strata (<1 / 1-3 / >3) for the low-grade band, as used in the CRP article.
- Prefer a primary source over a competitor page in every case. Do not cite the AIO's sources back.

## 11. Expert quotation block

One `ClinicalInsight` from Dr Ewa Lindo on why a single raised marker is not a diagnosis and why the
recheck matters. Ewa to supply or approve wording at review. Do not invent it.

## 12. FAQ block (FAQPage schema)

Four entries, mapped to the live PAA so they are extraction candidates. FAQ retained per the
2026-08-15 deprecation decision (the markup stays; only the Google rich result went away).

1. What does it mean if my inflammation markers are high in a blood test?
2. What can cause inflammatory markers to be high?
3. What will a doctor do if CRP is high?
4. What are 5 signs your body has inflammation?

Deconflict against the existing corpus with `node tools/faq-dedupe.mjs` before drafting: the hub and
`crp-blood-test` are the collision risks. **Q3 and the cancer PAA are Section 19 Q1 territory.**

## 13. CTA block (end of article only)

**Transcribed from `09_website-app/frontend/lib/content/kitCTA.ts`, key `KIT_CTA.G`:**

- `href`: `/kits/energy-recovery`
- `label`: "See the Energy & Recovery Check"
- `kit`: `KIT_2` (carries hs-CRP)
- `redirectWhenLive`: Kit 3 Plus

Not reasoned to, read from the map. End of article only, one CTA, no mid-body product push: the
reader is anxious and mid-problem.

## 14. Schema requirements

`Article` + `FAQPage` + `BreadcrumbList`, per the house graph. `reviewedBy` Dr Ewa Lindo. No `HowTo`
(deprecated, and being removed from the homepage as open item 4).

## 15. Metadata + URL

- **URL:** `/blog/what-does-it-mean-when-your-inflammatory-markers-are-elevated`
- **Title:** to be finalised at draft. Must carry the query and stay under 60 characters, which the
  full query does not: the title will paraphrase while the H1 carries the query verbatim.
- **Category:** Energy & Recovery (matches the hub).

## 16. Compliance gate

🔴 **HIGH.** Read [`/03_compliance/CONTEXT.md`](../../../03_compliance/CONTEXT.md) before drafting.

- **Phase 0 wellness boundary.** No diagnosis, no treatment, no TRT adjacency. This article
  describes what a marker means; it never tells a reader what he has.
- **The disease-cause question is unresolved and is Section 19 Q1.** It is the same boundary the
  diagnosis flagged on fatigue: the second-largest block of the AI Overview is the block we
  deliberately do not write.
- **No anti-inflammatory supplement claims.** Those are EFSA-gated and belong to the hub's FAQ Q8.
- **Ashwagandha rule applies** as everywhere: never named.
- Ewa pre-flight before publish. `compliance-preflight` inside `/article` is necessary, never sufficient.

## 17. Internal linking

**Mandatory, and the reason this spoke exists:**

- Frontmatter **`hub: inflammatory-markers-blood-test`**. This drives the hub-aware related-reading
  ordering added 2026-08-15.
- **One in-body prose link up to `/blog/inflammatory-markers-blood-test` in the first third**, in
  running copy, not a nav module. Frontmatter drives the module; body links carry the weight.
- Sideways to `/blog/crp-blood-test` at the CRP H3, and to `/blog/how-to-read-blood-test-results` at
  the reference-range point.
- **The hub gains one link down to this spoke**, at the section it was carved from. That is a hub
  edit and ships in the same change.
- Pillar G vocabulary throughout (`coverage-rules.md` §6): consumer-symptom language, not Pillar D's
  medical-literate register.

## 18. AI-citation pre-publish checklist

- Answer-first opening, before any H2, stating the non-specific point.
- At least one `Label: one flat sentence` block matching the atom the AIO actually lifts.
- FAQ questions matched to live PAA wording.
- Every number carries its source and its UK unit.
- `llms.txt` updated with the new slug at publish.
- Re-probe the query in the next `track` run and record `our_rank`: this article is the first
  measurable test of the fan-out thesis, and `our_rank` is how we will know.

## 19. Open questions for Keith before draft

**BLOCKING. See the conversation summary; five questions, two of which change the structure.**

1. **Do we name the disease causes?** The AIO's second block names infections, injury/surgery and
   autoimmune conditions (rheumatoid arthritis, lupus), and the PAA asks "what cancers show high
   inflammatory markers". Every cited competitor answers it, including the NHS. Naming them as
   possible causes of a raised marker is a factual statement about a test, not a diagnosis of the
   reader, but it is the exact block the diagnosis flagged as sitting on the Phase 0 boundary. Omit
   it and we do not answer the query, and the AIO has no reason to lift us. **Ewa decides the
   wording; you decide whether we attempt it at all.**
2. **Who owns "what a high result means", this spoke or the hub?** The hub has an H2 called "What
   high inflammation usually means" covering row 98. That is close enough to this spoke's whole job
   to compete with it. Either the spoke takes the job and the hub's H2 shrinks to a paragraph plus a
   link down, or the spoke narrows to "the number and what happens next" and leaves causes to the
   hub. **This changes Section 8.**
3. **General population or active men?** The diagnosis found our content answers a narrower question
   than the query asks, and that this is a real handicap on informational queries. The training angle
   is our only genuine differentiator here. Lead with it and accept a narrower fit, or answer the
   general question first and bring training in as a section?
4. **Does this article get the `Label: sentence` scannable layer?** Decision 3 in the diagnosis, still
   open. The AIO lifts `Label: one flat sentence` atoms; our house voice writes narrative H3s. This is
   the first article where the choice is live, and whatever you decide here sets the pattern for the
   other 31 spokes.
5. **Do we cover ESR?** We do not sell it. But londongpclinic ranks #10 for `crp vs esr` and is cited
   on the head term because of it, which is the proof case the whole fan-out strategy rests on.
   Covering ESR properly is how that citation is won; ignoring it keeps the article tighter to what
   Kit 2 measures.

## 20. Next steps when this brief is approved

1. Keith answers Section 19; brief set to `status: brief-ready`.
2. `/article` on this slug (Phase B). Voice pass, source verification, compliance pre-flight.
3. Optional photo (Phase C), `seed-pipeline` + `draft-writer` (Phase D), `signoff-concierge` (Phase E).
4. Hub edit shipping the link down to this spoke, in the same change as the article going live.
5. Record `our_rank` for this query in the next `track` snapshot as the measurement of the thesis.

## 21. Post-draft delivery report (filled by writer/agent at handoff)

<!-- filled by /article at handoff -->
