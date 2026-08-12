# Per-post compliance pre-flight: the ten close-C posts

**Date: 2026-08-11. Scope: the ten assembled POSTS that carry close C, being days 3, 6, 9, 12, 15, 18, 21, 24, 27 and 30 of the 30-day run.** Post rows taken from `node plan.js` (PER POST table), not assumed.

A post here means cover headline (`covers.js`) + slides 2 to 7 (`decks/<slug>.js`) + slide 8 (close C as `closes.js` builds it). CA-031 approved the three close templates and one mapping; CA-032 approved the ten cover headline rows. Neither covers an assembled post. This pass covers the ten that carry close C. **Nothing was edited.** Findings only.

## Method, and one thing to know when reading the counts

Each post was assembled into a fragment file under the session scratchpad (`posts/post-NN-<slug>.js`) and scanned with:

```
node "d:\Androprime_main\.claude\skills\compliance-preflight\fragment-scan.js" --fragment <post file> --source "…\content\blog\<slug>.mdx"
```

`fragment-scan` labels its units `slide-${i+2}`, and the assembled post puts the cover at index 0, so **its label runs one ahead of the real slide number**: `slide-02` is the cover (slide 1), `slide-03` to `slide-08` are slides 2 to 7, `slide-09` is close C (slide 8). Every slide number quoted below is the REAL one.

`close C produced zero scanner findings on all ten posts.` Every scanner finding sits in the cover or the body, which the deck-level pass already saw; what is new here is the judgement section.

---

## Run-level findings, applying to all ten posts

These are not restated per post. Each post section names the ones that hit it.

### C1 · HARD · slide 8 says "Link in bio" and there is no link yet

Close C slide 8, third line: `Link in bio`. The destination system is the `/go` grid (`frontend/lib/bio-grid.ts`), where close C resolves to `/blog/<topic.slug>`. Two preconditions are still open:

- `CAROUSEL_RUN_START` is **not set**. `frontend/.env.local` has no such key, and `bio-grid.ts` reads `export const RUN_START_ISO = process.env.CAROUSEL_RUN_START ?? ''`, with an unset value rendering an empty grid by design.
- The Instagram bio link is **not yet pointed at `/go`**. `09_website-app/STATE.md:15` and `:25` both carry it as owed: "set `CAROUSEL_RUN_START` in Coolify, and point the `keith.antony.ai` Instagram bio at `/go`".

Ship a close-C post before both are done and slide 8 states a destination that resolves to an empty page. Not a copy defect, and not a reason to touch approved copy: it is a publish gate. **No close-C post ships until both are set.**

**Origin: CA-031 §3 condition 4, not this pass.** C1 is a standing condition still open, not a new defect the pre-flight uncovered. `03_compliance/content-approval/approval-record-carousel-closes-2026-08-11.md` §3 records it as condition 4 of the approval: "Copy approval is not a ship authorisation. The run is separately gated on the bio-link rotation mechanism, without which the three closes cannot be told apart", and §5 repeats it: "The run remains gated on the bio-link rotation mechanism and on a per-post pre-flight for each of the 30 posts." What this pass adds is the evidence that the condition is still open (the unset `CAROUSEL_RUN_START`, the bio link not yet pointed at `/go`) and the file-and-line proof, not the condition itself.

**Scope correction.** C1 is not close-C-specific and this section originally read as though it were. `closes.js` gives all three closes the identical `link: 'Link in bio'` string (lines 43, 50 and 57), and `bio-grid.ts:159` returns an empty list for every close when `RUN_START_ISO` is unset, so the gate closes on `/test-selector` and `/kits/<kit>` exactly as it does on `/blog/<slug>`. **C1 blocks all 30 posts of the run, not the ten in this slice.** It is now carried verbatim as a run-level HARD in `preflight-per-post-close-A.md` and `preflight-per-post-close-B.md` as well, so the three reports give one ship answer rather than three.

### C2 · REVIEW · close C is not the ask-free arm the approval record describes

`slide-8-closes.md:41` states: "C is a two-step A: the article's own CTA routes to the quiz. Score it on clicks that reach the quiz, not on raw article clicks." That is not what the ten destinations do.

- Eight of the ten articles carry an `InlineKitCTA` that routes to a **kit page**, not the quiz. Confirmed in the MDX and in the live `blog_articles` rows (`has_kit_cta = true`).
- `free-androgen-index` and `how-to-read-blood-test-results` carry **no CTA of any kind**. Confirmed both in the MDX (only `EvidenceBox`, `PullQuote`, `BlogToc`, `ClinicalInsight`, `SystemAlert` appear) and live (`has_kit_cta = false`). `app/(marketing)/blog/[slug]/page.tsx` adds no page-level CTA either.

Two consequences a human must rule on. First, close C is a **delayed kit offer** for eight of the ten, not a no-ask arm, so it is not the clean control the run design assumes. Second, the stated scoring rule cannot be executed as written, because no quiz click exists on that path. This is a finding against the approval record's rationale, not a request to change slide copy.

### C3 · REVIEW · one post's close-C render is not the same image as the other nine

`png/crp-blood-test/close-C.png` hashes `e40bc34f72ba879985a865ae9a4baec0`. The other nine all hash `ce1ad5c874ae9552faa4863c65477b0d`. Viewed side by side, the copy is identical and the difference is in the monospaced type: the eyebrow `THE LONG VERSION`, the `Link in bio` line and the footer that carries `EDUCATION, NOT MEDICAL ADVICE.` are set in a different face. `build.js` pulls Inter, Merriweather and JetBrains Mono from Google Fonts at render time, so a render made without the webfont falls back. The disclaimer is present and legible in both, so this is not a HARD. But the run's entire premise is that slide 8 is the only variable, and day 24 would ship a slide 8 that differs from the other nine for a reason that has nothing to do with the experiment. Re-render before shipping.

**Re-rendered, and the defect was not confined to this arm.** `node render.js --deck crp-blood-test close-C` was run; `png/crp-blood-test/close-C.png` now hashes `ce1ad5c874ae9552faa4863c65477b0d` at 43,735 bytes, matching the other nine exactly, and was re-opened to confirm the serif line, the `Link in bio` line and the footer disclaimer all read correctly. All thirty close renders were then hashed. **A second instance of the same fallback was found on the close-A arm**, `png/how-to-read-blood-test-results/close-A.png`, and has been re-rendered too; it is recorded as RH-1 in `preflight-per-post-close-A.md`. The standing rule the re-hash enforces: close A and close C are fixed strings and must each be constant across the ten topics, close B is legitimately per-topic. Current state: close A one hash across ten, close C one hash across ten, close B nine hashes across ten (the two Kit 1 topics share a byte-identical close). All three PASS.

### C4 · CLEAR · the disclaimer is on every slide, and price and vocabulary are clean

- **Disclaimer.** `build.js` calls `footerHtml()` in all four slide templates (`cover`, `list`, `cta`, `statement`) and in both cover formats plus `cover-overlay.html`, which is derived from the video cover with the footer retained. Verified visually on three renders (`ferritin/cover-video.png`, `brain-fog/cover-type.png`, `crp/close-C.png` and `ferritin/close-C.png`): `EDUCATION, NOT MEDICAL ADVICE.` reads on all of them.
- **Price.** No price string appears anywhere in the ten assembled posts. Close C carries no kit and no price, so the suspended V7.1 and transitional sets cannot appear. For completeness the `KITS` table in `closes.js` (£99 / £119 / £179) matches `frontend/lib/pricing.ts` (`KIT_1.rrp 99`, `KIT_2.rrp 119`, `KIT_3.rrp 179`), though close C never renders it.
- **Em dashes.** None in any shipped line across the ten posts.
- **Regulated vocabulary.** No treat, cure, or clinically proven. No ashwagandha. Every appearance of diagnosis language is a negation: day 21 slide 2 "Signs aren't diagnoses.", day 21 slides 3 to 5 "Suggestive, not diagnostic.", day 6 slide 2 "Not a diagnosis." Every appearance of boost language is a negation: day 18 slide 6 "Most boosters lack the evidence." and "maintenance, not boosting".

### C5 · REVIEW · five of the six video-cover posts have no cover

Days 3, 9, 12, 18 and 27 use the video cover, and none of those topics has an inpainted newspaper frame, so `cover-video.png` renders the black "cover frame not generated yet" hatch. Verified visually on `png/ferritin-blood-test/cover-video.png`. Day 21 is the only close-C video post with a real frame. Not a claim, but slide 1 does not exist yet for five of these ten.

### C6 · REVIEW · the one real cover photograph shows a man who is not Keith

`png/14-signs-of-vitamin-d-deficiency/cover-video.png` (day 21) is a synthetic photograph of a man holding a newspaper mastheaded ANDRO PRIME. The account is `@keith.antony.ai`, a founder account whose premise is that the founder is the product feature, and nothing on the slide marks the image as an illustration. Whether that reads as a customer or an endorser is a human call, and it will recur on every video cover once the other frames are minted.

---

## Per post

### Day 3 · ferritin-blood-test · video cover · close C

Scanner: **0 HARD · 6 REVIEW.**

- Slide 1 (cover): qualifier dropped, nothing on the slide hedges it. `YOUR IRON STORES, EXPLAINED` against the article's "so it shows how much iron you have in reserve, not just how much is moving through your blood right now". CA-032 approved row; inherited, not actionable here.
- Slide 2: `It measures the iron you hold in reserve.` Slide hedges elsewhere.
- Slide 3: `30 to 100 reads normal for the lab` against the article's "30 to 100 µg/L: normal for the lab, not always optimal for you". Slide hedges elsewhere.
- Slide 4: literal `fix` in `Flat energy a full night doesn't fix`. Retest/efficacy framing rule.
- Slide 5: `Low iron, normal blood count.` Slide hedges elsewhere.
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** Close C names no kit. Second hop (C2) is the article's `InlineKitCTA pillar="D"`, which `kitCTA.ts` routes to Kit 2 Energy & Recovery. Ferritin is a Kit 2 marker. Correct.
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 7 is the GP rail, "A low result is a GP question… We don't sell iron." Close C then offers the article, not a product. That pairing weakens rather than sharpens.
- Applies: C1 (HARD), C2, C5.

### Day 6 · brain-fog · type cover · close C

Scanner: **0 HARD · 8 REVIEW.**

- Slide 2: `Brain fog is a description.` against "Brain fog is a description, not a diagnosis, and most of the time the cause is everyday lifestyle." The dropped hedge is restored by the body's own next line, "Not a diagnosis."
- Slide 3: `Blood-sugar swings from a fast-carb breakfast` and `Four or five ordinary things, stacked up over weeks.`
- Slide 4: `Eight hours in bed, six of sleep.` and `Each one chips at the quality while the hours on paper look fine.`
- Slide 5: literal `Fixed` in `Fixed wake time, weekends included`, plus `Protein and fibre at breakfast`.
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR**, and this is the CA-025 case. Close C names no kit. Second hop is `InlineKitCTA pillar="B"`, routed to Kit 2. Kit 1 is testosterone only and is never reached from this post. The deck's own header comment states the rule; the routing honours it.
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 6 says "Low B12, low iron and low vitamin D don't produce a symptom you can point to", and the second hop lands on the kit that measures exactly those three. Nothing implies the kit explains fog; slide 2 has already denied that fog is a diagnosis.
- Applies: C1 (HARD), C2.

### Day 9 · myth-of-normal-range · video cover · close C

Scanner: **0 HARD · 3 REVIEW.** The cleanest of the ten.

- Slide 6: `The referral threshold sits 3 below that.` against "The NHS referral threshold sits 3 nmol/L below where symptoms become statistically likely." The unit is dropped, not the substance; the same slide carries "below 11 nmol/L".
- Slide 7: the eyebrow `Why it matters` paired to a hedged source sentence. Noise, not a finding.
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** Second hop is `InlineKitCTA pillar="C"` to Kit 1 Testosterone Health Check. The topic is the testosterone reference range and Kit 1 measures testosterone. This is the one direction the cortisol precedent permits: exact match, not near match.
- PRICE: **CLEAR** (C4).
- COMBINATION: **REVIEW.** Slide 5 sets out the NHS/BSSM bands ("Below 8 nmol/L: the NHS referral line", "8 to 12 nmol/L: the grey zone") and slide 6 says symptoms start at eleven. Close C then sends the reader to an article whose only CTA is the testosterone kit. The post therefore reads: here is the line your result may fall below, and here is where to buy the test that measures it. Each half is accurate and neither is a treatment claim, but the sequence is the closest thing in this slice to an implied clinical route, on the one topic where Andro Prime explicitly does not sit in the TRT conversation. A human should rule whether the deck's own guardrail (slide 7, "It's answering whether you are ill… A baseline you can retest tells you more") carries far enough once the destination is a kit page rather than the quiz.
- Applies: C1 (HARD), C2, C5.

### Day 12 · b12-blood-test · video cover · close C

Scanner: **0 HARD · 7 REVIEW.**

- Slide 2: `A standard test reads total B12.`
- Slide 3: four findings, all the same shape. `70 to 90% is bound to haptocorrin`, `It's carried to the liver and excreted` (source says "mostly carried off"), `20 to 30% is bound to transcobalamin`, `That fraction is the active one`.
- Slide 4: `Active B12, in pmol/L` against "Active B12 is reported in pmol/L, and ranges vary by lab." The slide's own note restores it: "Reference ranges vary by lab."
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** Second hop is `pillar="D"` to Kit 2. Active B12 is a Kit 2 marker.
- PRICE: **CLEAR** (C4).
- THRESHOLDS: **CLEAR.** Slide 4 carries `Under 25 is low` / `25 to 70 is borderline` / `Above 70 is normal`. The live DB row for `b12-blood-test` (updated 2026-08-11, status published) carries "the bands Kit 2 reads against follow the NICE NG239 three-band scheme: under 25 pmol/L is low, 25 to 70 is borderline, and above 70 is the target", and contains no "under 35" string. Slide and destination agree.
- COMBINATION: **REVIEW.** Slide 4's `source` line is `NICE NG239`, and slide 8 promises "The full article, with every source linked." The article names NG239 in prose and **does not link it**. Its only two external links are `nhs.uk/conditions/vitamin-b12-or-folate-deficiency-anaemia/` and `gloshospitals.nhs.uk/…/active-b12-holotranscobalamin/`. So on the one post where a slide cites a guideline to carry a house cut-point, the close makes a promise about the destination that the destination does not keep. The numbers are substantiated (`classifier.ts:325`, Ewa 2026-06-16, re-ratified 2026-08-07); it is the link claim that is inaccurate. Either link NG239 in the article or accept that slide 8 overstates the destination on this post.
- Applies: C1 (HARD), C2, C5.

### Day 15 · why-am-i-always-tired · type cover · close C

Scanner: **0 HARD · 8 REVIEW.**

- Slide 1 (cover): `WHY AM I ALWAYS TIRED?` qualifier dropped, nothing on the slide hedges it. CA-032 approved row.
- Slide 2: literal `fix` in `Sleepy you can fix tonight`.
- Slide 4: four findings on the NHS list slide, all matching the same source sentence: `The usual suspects`, `What the NHS lists`, `Too little activity`, `Alcohol and caffeine`. Low-value pairings against one long enumerating sentence.
- Slide 6: literal `fixed` in `A fixed wake time, weekends included`.
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR**, and this is the second CA-025 case. Close C names no kit. Second hop is `pillar="B"` to Kit 2. Fatigue never reaches Kit 1.
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 7 is the GP rail, "Some tiredness needs a doctor, not a blog", and close C's only ask is to read further. No product implication is created.
- Provenance note, not a finding: the deck header records that these lines were compressed from the live `blog_articles` body, not from the repo MDX. This scan used the MDX. The two bodies differ by 1 byte in length, so the comparison holds, but it was not diffed character by character.
- Slide 7's `source` line is `NHS · Andro Prime, why am I always tired?`, so the post cites the article that close C then links to. Circular, harmless, and correct under the 2026-07-09 trust-language rule that keeps Ewa's name off claim-free derivatives.
- Applies: C1 (HARD), C2.

### Day 18 · how-to-increase-testosterone-naturally · video cover · close C

Scanner: **0 HARD · 5 REVIEW.**

- Slide 3: `Ranked by what the evidence supports` (source: "ranked by what the evidence actually supports") and `Lose excess body fat, the biggest one` (source: "the biggest lever for most men", so "for most men" is the dropped hedge). The slide's note restores the framing: "Not ranked by what sells supplements."
- Slide 4: **nothing on this slide hedges it.** `A review pooling 24 studies found weight loss, by diet or surgery, was followed by a meaningful rise, and the more men lost, the bigger the rise.` The article says the same but names the year and the paper. This is the one REVIEW in the slice where a compressed causal statement stands with no qualifier on its own slide, and it asserts a direction of effect on testosterone. A human should rule.
- Slide 6: literal `Zinc contributes`, flagged by the ingredient-plus-benefit rule.
- Plus the standing render REVIEW.

**Judgement.**
- EFSA WORDING: **CLEAR, ruled rather than dropped.** The slide reads "Zinc contributes to the maintenance of normal testosterone levels." `03_compliance/CONTEXT.md:108` gives the approved wording as "Contributes to the maintenance of normal testosterone levels". Verbatim match, no extension, and the next sentence negates the upsell reading: "Read that carefully: maintenance, not boosting." Nothing else in the deck names an ingredient, and ashwagandha appears nowhere.
- KIT SCOPE: **CLEAR.** Second hop is `pillar="C"` to Kit 1. Kit 1 measures testosterone. Exact match.
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 7, "There is no overnight switch… give them eight to twelve weeks, then measure", plus a close that asks for nothing. The one ingredient line sits between two negations.
- Applies: C1 (HARD), C2, C5.

### Day 21 · 14-signs-of-vitamin-d-deficiency · video cover · close C

Scanner: **0 HARD · 8 REVIEW.**

- Slide 1 (cover): `14 SIGNS OF LOW VITAMIN D`, nothing on the slide hedges it. CA-032 approved row, and at grid size the cover is the whole tile with no body copy behind it. Inherited.
- Slide 3: three findings, `Low mood through the dark months`, `Slow recovery from training`, and `One sign on its own means very little.` against the article's "One sign on its own **usually** means very little."
- Slides 4 and 5: the same dropped `usually` in the repeated note.
- Slide 6: `No signs at all.`
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** Second hop is `pillar="A"` to Kit 2. Vitamin D is a Kit 2 marker.
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 2 opens "Signs aren't diagnoses" and each list slide repeats "Suggestive, not diagnostic." Close C adds no ask.
- Cover: this is the only close-C post with a minted frame, and it is the C6 case. Verified visually: the newsprint headline and the overlay plate both read 14 SIGNS OF LOW VITAMIN D, so the one mismatch the title table exists to prevent has not occurred.
- Applies: C1 (HARD), C2, C6.

### Day 24 · crp-blood-test · type cover · close C

Scanner: **0 HARD · 5 REVIEW.**

- Slide 1 (cover): `WHAT CRP ACTUALLY MEANS`, nothing hedges. CA-032 approved row.
- Slide 3: `Under 1.0 is the low band` and `The framework UK private labs read against.` against "On the more precise framework **most** private labs use".
- Slide 6: eyebrow `In active men` against the article heading "What high CRP **usually** means in active men".
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** Second hop is `pillar="D"` to Kit 2, which carries hs-CRP (`kitCTA.ts`, pillar G comment: "carries hs-CRP").
- PRICE: **CLEAR** (C4).
- COMBINATION: **CLEAR.** Slide 3's fourth band, "Over 10 is your GP that week", plus slide 7's retest framing. Close C adds no ask.
- Applies: C1 (HARD), C2, **C3 (this is the odd render)**.

### Day 27 · free-androgen-index · video cover · close C

Scanner: **0 HARD · 4 REVIEW.** Second cleanest.

- Slide 3: `Only 1 to 3% is completely free` (source: "Only **around** 1 to 3%") and `The total counts the locked-up and the free as if they were the same thing.`
- Slide 4: `High SHBG, shrinking free fraction.`
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR, with a note.** Close C names no kit, and this article carries no CTA at all, so no kit is reachable from this post. If one is ever added it must be pillar C to Kit 1, which does carry SHBG (`04_products/kits/kit-1-testosterone-health-check.md:71`), so the deck's `kit: 'testosterone'` is right for the close-B appearances on days 7 and 17.
- PRICE: **CLEAR** (C4).
- COMBINATION: **REVIEW, and it is the C2 case at its sharpest.** Slide 7 tells the reader "a calculated free testosterone is the figure to ask for", and close C then promises the full article. The article has no CTA, so the post terminates. A reader told what to ask for is handed nowhere to ask. That is not a compliance defect, and arguably it is the most conservative outcome in the slice, but it means day 27 cannot produce the outbound click the run is scored on.
- The corrected framing survives compression: slide 5 states "UK labs don't report FAI for men", and slide 6 keeps the source's own limit, "not as a routine upgrade on every test". The 2026-07-30 ruling holds. `04_products/kits/kit-1-testosterone-health-check.md:72` was not used.
- Applies: C1 (HARD), C2, C5.

### Day 30 · how-to-read-blood-test-results · type cover · close C

Scanner: **0 HARD · 7 REVIEW.**

- Slide 1 (cover): `HOW TO READ YOUR RESULTS`, nothing hedges. CA-032 approved row.
- Slide 4: `What you'll see on a UK panel`, nothing on the slide hedges it, against "Once you can see those four things on any line, you can read any panel."
- Slide 5: `An afternoon reading is a mismatch.` The article's fuller line, "a mismatch, not a verdict", carries the qualifier.
- Slide 6: `A cold, a brutal session, a poor night, dehydration, the meal before the test.` and `Any of them nudges a marker without your baseline having moved at all.` against "any of them **can** nudge a marker".
- Slide 7: eyebrow `Why it matters`. Noise.
- Plus the standing render REVIEW.

**Judgement.**
- KIT SCOPE: **CLEAR.** No kit named on the slide and no CTA at the destination. The deck's `kit: 'hormone-recovery'` (Kit 3, nine markers) is unused by close C.
- PRICE: **CLEAR** (C4).
- COMBINATION: **REVIEW**, same shape as day 27. The post ends at an article with no onward route, so the close-C arm produces no measurable next step on this topic either.
- Applies: C1 (HARD), C2.

---

## Summary

| Day | Topic | Cover | Close | HARD | REVIEW | Judgement HARD | Judgement REVIEW |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | ferritin-blood-test | video | C | 0 | 6 | C1 | C2, C5 |
| 6 | brain-fog | type | C | 0 | 8 | C1 | C2 |
| 9 | myth-of-normal-range | video | C | 0 | 3 | C1 | C2, C5, combination |
| 12 | b12-blood-test | video | C | 0 | 7 | C1 | C2, C5, NG239 not linked |
| 15 | why-am-i-always-tired | type | C | 0 | 8 | C1 | C2 |
| 18 | how-to-increase-testosterone-naturally | video | C | 0 | 5 | C1 | C2, C5, unhedged slide 4 |
| 21 | 14-signs-of-vitamin-d-deficiency | video | C | 0 | 8 | C1 | C2, C6 |
| 24 | crp-blood-test | type | C | 0 | 5 | C1 | C2, C3 |
| 27 | free-androgen-index | video | C | 0 | 4 | C1 | C2, C5, dead end |
| 30 | how-to-read-blood-test-results | type | C | 0 | 7 | C1 | C2, dead end |
| | **totals** | | | **0** | **61** | 1 run-level HARD on all ten | |

Scanner totals: **0 HARD, 61 REVIEW** across the ten posts. Every post exits 0. Of the 61, ten are the standing "no `--render` declared" line and can be discharged: `png/<slug>/` exists for all ten topics with `cover-video.png`, `cover-type.png`, `slide-02` to `slide-07` and `close-C.png` present. Discharging them still needs a human to look at the images, and C3, C5 and C6 are what looking at them found.

**Run-level roll-up: state it as 187, on a no-render basis.** Arms A and C were scanned WITHOUT `--render` and arm B WITH it, so the three summary tables' REVIEW columns are not on one base. A's 61 and C's 61 each include one undeclared-render line per post; B's 55 does not. Converted to a single no-render basis the run total is **187**: 61 (A) + 65 (B, its 55 plus the ten undeclared-render lines a no-render scan adds) + 61 (C). Adding 61 + 55 + 61 = 177 is **wrong by 10**. Anyone aggregating the three tables must either state 187 on a no-render basis or re-run arms A and C with `--render` first.

**One HARD, and it is a publish gate rather than a copy defect: C1.** No close-C post may ship until `CAROUSEL_RUN_START` is set and the Instagram bio link points at `/go`.

---

## What this pass does NOT cover

- **Closes A and B.** Days 1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20, 22, 23, 25, 26, 28 and 29 are not in this slice. Close B is the arm that names a kit and a price, so the CA-025 kit-scope and price checks bite hardest there and are only reachable indirectly here.
- **Approval.** This is a findings pass. It grants nothing. Clinical and claims sign-off is Ewa's, business sign-off is Keith's, and CA-031 and CA-032 remain approved copy that was not edited.
- **The 46 REVIEW items from the deck-level pre-flight.** This pass re-surfaces the ones that fall inside a close-C post; it does not close any of them.
- **Motion.** The six video-cover posts ship an mp4. Only the still `cover-video.png` and the `cover-overlay.png` composite were examined. No clip was played, and five of the six have no frame to build one from.
- **The Instagram caption and first comment.** They do not exist in this prototype at all, and a caption can carry a claim the slides do not.
- **Alt text and accessibility.**
- **The destination pages themselves.** `/blog/<slug>` body text was read from the DB, but the rendered page, `/kits/*` and `/test-selector` copy were not pre-flighted here.
- **Character-level mirror-versus-live equality.** The repo MDX mirrors and the live `blog_articles` bodies differ by at most 10 bytes for all ten topics, consistent with whitespace, and the b12 bands and NG239 mention were checked in the live row directly. They were not diffed character by character, so the scan source is a close stand-in for the destination, not a proven identical one.
