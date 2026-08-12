# Per-post compliance pre-flight: the ten close-B posts

**Date:** 2026-08-11. **Scope:** the ten assembled POSTS whose close is B, days 2, 5, 8, 11, 14, 17,
20, 23, 26 and 29 of the 30-day run. A post is cover headline (covers.js) + slides 2 to 7 (decks/) +
slide 8 (close B as closes.js builds it for that deck).

**What this adds to what already exists.** The deck-level pre-flight covered slides 2 to 7 (0 HARD,
46 REVIEW). CA-031 approved three close templates and one topic-to-kit mapping. CA-032 approved ten
cover headline rows. None of those covers a whole post. This pass covers the post: the scanner run on
the assembled fragment, then the judgement pass on what only exists once cover, body and close sit on
one asset.

**Findings pass only.** No deck, close or cover copy was edited. Approved copy changes need a new
approval.

**Method.** Each post was assembled to a fragment file with the cover as slide 1 and close B as slide
8, then scanned with:

```bash
node .claude/skills/compliance-preflight/fragment-scan.js \
  --fragment <post>.js --source frontend/content/blog/<slug>.mdx \
  --render png/<slug>/cover-{type|video}.png --render png/<slug>/slide-0{2..7}.png \
  --render png/<slug>/close-B.png
```

The scanner labels the first extracted unit `slide-02`, so its labels run one ahead of the real slide
number. Slide numbers below are the REAL ones: 1 is the cover, 8 is close B.

---

## Run-level HARD, applying to all ten posts

### C1 · HARD · slide 8 says "Link in bio" and there is no link yet

**This applies to all ten close-B posts, and to all thirty posts of the run.** It is carried under the same ID as in the close-C pass because it is the same finding, not a close-C one.

`closes.js` gives all three closes the **identical** `link: 'Link in bio'` string (lines 43, 50 and 57), so every post in the run states the same destination on slide 8. The destination system is the `/go` grid, `09_website-app/frontend/lib/bio-grid.ts`, where `destinationFor()` resolves close A to `/test-selector`, close B to `/kits/<kit>` and close C to `/blog/<slug>`. Which arm a post is in does not matter, because the grid that carries all three arms is gated on one unset variable:

- `CAROUSEL_RUN_START` is **not set**. `frontend/.env.local` contains no such key (grep count: 0), and `bio-grid.ts:107` reads `export const RUN_START_ISO = process.env.CAROUSEL_RUN_START ?? ''`. `bio-grid.ts:159` then reads `if (!RUN_START_ISO) return []`, so `visiblePosts()` returns nothing and the grid renders **empty for every close**. That is deliberate; the file's own comment says "Unset or unparseable renders an empty grid. That is the safe direction."
- The Instagram bio link is **not yet pointed at `/go`**. `09_website-app/STATE.md:15` and `:25` both carry it as owed: "set `CAROUSEL_RUN_START` in Coolify, and point the `keith.antony.ai` Instagram bio at `/go`".

Ship any close-B post before both are done and slide 8 states a destination that resolves to an empty page. On this arm it is the sharpest of the three, because close B is the only close that states a price: the post says "£119. Finger-prick at home" and then hands the reader nowhere to buy it.

It is a publish gate, not a copy defect: no approved copy needs changing, the environment does. **No close-B post ships until both are set.** Remedy is Keith's, in Coolify and in the Instagram profile, not in `closes.js`.

**Origin: CA-031 §3 condition 4, not this pass.** C1 is a standing condition still open, not a new
defect the pre-flight uncovered. `03_compliance/content-approval/approval-record-carousel-closes-2026-08-11.md`
§3 records it as condition 4 of the approval: "Copy approval is not a ship authorisation. The run is
separately gated on the bio-link rotation mechanism, without which the three closes cannot be told
apart", and §5 repeats it: "The run remains gated on the bio-link rotation mechanism and on a
per-post pre-flight for each of the 30 posts." What this pass adds is the evidence that the condition
is still open (the unset `CAROUSEL_RUN_START`, the bio link not yet pointed at `/go`) and the
file-and-line proof, not the condition itself.

### Render-hash check · PASS on this arm

All thirty close renders were re-hashed after the close-A pass found a webfont-fallback defect. Close A and close C are fixed strings and must each be constant across the ten topics; **close B is legitimately per-topic**, because `closesFor()` substitutes `deck.closeBHeadline` and the kit price. The ten `close-B.png` files produce **nine distinct hashes**, which is correct: `how-to-increase-testosterone-naturally` and `myth-of-normal-range` share the headline "Testosterone is in the Testosterone Health Check." and the same Kit 1 price, so their `close-B.html` files are byte-identical (`diff` returns nothing) and their renders are too. No fallback outlier on this arm. Detail in the close-A report, RH-1.

---

## Cross-cutting checks, run once across all ten posts

- **Disclaimer on every slide: CLEAR.** `build.js:69` sets `DISCLAIMER = 'Education, not medical
  advice.'` and `footerHtml()` is emitted by every branch of `render()` (cover, list, cta, statement)
  and by both `cover-video` and `cover-type`. The transparent overlay is derived from `coverVideo` by
  string replacement, so it keeps the footer. Present on 8 of 8 slides on 10 of 10 posts. Presence in
  the HTML is not legibility in the render: see the render obligation below.
- **Em dashes: CLEAR.** Zero U+2014 and zero U+2013 in all ten assembled posts.
- **Regulated vocabulary: CLEAR.** No "treat", "cure", "clinically proven", "guarantee", "TRT",
  "prescription" anywhere in the ten. Every appearance of the diagnosis family is a negation: day 11
  slide 2 "Signs aren't diagnoses.", day 11 slides 3, 4 and 5 note "Suggestive, not diagnostic.", day
  26 slide 2 "Not a diagnosis." Day 8 slide 7 "Most boosters lack the evidence." and "maintenance,
  not boosting" use the regulated word only to refuse the claim.
- **Ashwagandha: CLEAR.** Absent from all ten.
- **Prices: CLEAR.** Only £99, £119 and £179 appear. They match `frontend/lib/pricing.ts` KIT_1 99,
  KIT_2 119, KIT_3 179, and the live kit pages (`app/(marketing)/kits/*`). No V7.1 or transitional
  figure appears anywhere.
- **Kit routing against `frontend/lib/content/kitCTA.ts`: CLEAR on all ten.** Pillars A, B, D and G
  route to KIT_2 and pillar C routes to KIT_1. Every fatigue, brain fog and B12 post in this slice
  carries `kit: 'energy-recovery'`, never Kit 1. The cortisol precedent is not repeated here.
- **The ten scanner HARDs are one repeated finding: the price figure.** Every post scores exactly 1
  HARD, always `figure "99" / "119" / "179" appears nowhere in the source`, always on slide 8. The
  scanner compares a fragment against the ARTICLE it compresses, and a price is not an article fact.
  All three are verified above against `pricing.ts` and the live kit pages. Adjudicated as false
  positives, not ship blockers. They are still reported as HARD below, because that is what the tool
  returned.

---

## Day 2. b12-blood-test. Type cover. Close B.

**Scanner: 1 HARD, 6 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR, see cross-cutting.
- 6 REVIEW: five are dropped-qualifier flags on slides 3, 4 and 5 (deck-level, already in the 46);
  one is the render obligation.

**Judgement**

- **CLEAR. Kit scope.** Close 8 reads "Active B12 is in the Energy & Recovery Check." Active B12
  (holotranscobalamin) is a Kit 2 marker: `04_products/kits/kit-2-energy-recovery-check.md` §3, and
  the live page lists it. Not a Kit 1 topic and not routed to Kit 1.
- **CLEAR. Price.** £119 = KIT_2 rrp.
- **CLEAR. Combination.** Slides 2 and 3 establish that total and active B12 are different tests; the
  close names the active marker, which is the one Kit 2 runs. The close does not widen anything the
  body claims.
- **CLEAR. Thresholds.** Slide 4 "Under 25 is low / 25 to 70 is borderline / Above 70 is normal"
  produced no unsupported-figure finding, so the mdx mirror carries the corrected NG239 bands. Slide
  5 "A result of 40 is borderline" is consistent with the 25 to 70 band.

## Day 5. why-am-i-always-tired. Video cover. Close B.

**Scanner: 1 HARD, 8 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR.
- 8 REVIEW: cover headline "WHY AM I ALWAYS TIRED?" flagged as unhedged (CA-032 approved row, not
  reopened here); two "fix"/"fixed" retest-framing flags on slides 3 and 7; four dropped-qualifier
  flags on slide 5; one on the close, below.

**Judgement**

- **CLEAR. Kit scope, the CA-025 case.** A general-tiredness topic routed to Kit 2, not Kit 1. Close
  8 names four markers rather than a hormone, so no single cause is implied.
- **CLEAR. Marker inventory.** "The four markers in the Energy & Recovery Check are Vitamin D, Active
  B12, hs-CRP and Ferritin." is exact: kit-2 §3 lists those four and nothing else, and the kit page
  says "all four biomarkers". The scanner's dropped-qualifier flag on this line compares it against a
  prose sentence in the article; it is an inventory statement with no causal verb.
- **REVIEW. Combination risk.** The cover asks a question ("WHY AM I ALWAYS TIRED?"), slides 4 and 6
  answer it with sleep, stress, low mood, activity, alcohol and caffeine, none of which the kit
  measures, and slide 7 says "Some tiredness needs a doctor, not a blog." Slide 8 is then the only
  product on the asset, at £119. No line claims the kit answers the cover question; the sequence
  implies it. Neither the deck nor the close creates that alone. A human must rule whether close B is
  the right close for the one topic in the run that argues for six slides that the answer is usually
  not a blood test.

## Day 8. how-to-increase-testosterone-naturally. Type cover. Close B.

**Scanner: 1 HARD, 5 REVIEW.**

- HARD: `figure "99"` on slide 8. Adjudicated CLEAR.
- 5 REVIEW: three dropped-qualifier flags on slides 4 and 5; the zinc line on slide 7, below; one on
  the close ("Testosterone is in the Testosterone Health Check.").

**Judgement**

- **CLEAR. Kit scope.** A testosterone topic on Kit 1. `kitCTA.ts` pillar C routes to KIT_1, and Kit
  1 measures testosterone. £99 = KIT_1 rrp.
- **REVIEW. Combination risk, the ingredient claim on a paid-offer asset.** Slide 7 carries the run's
  only ingredient claim: "Zinc contributes to the maintenance of normal testosterone levels." That is
  the exact EFSA wording and the slide immediately refuses to extend it ("maintenance, not
  boosting"), which is why it clears at deck level. At POST level the same asset ends four lines
  later in a direct commercial offer ("£99. Finger-prick at home..."), which makes the whole carousel
  a marketing communication rather than an article compression. Andro Prime sells a zinc-containing
  product. No product carrying zinc is named or linked anywhere on this post, which is why this is
  not HARD, but the ruling is a human's: whether an authorised nutrient claim may sit on an asset
  whose close is a paid offer.
- **CLEAR. Combination, cover to close.** The cover says "WHAT ACTUALLY RAISES TESTOSTERONE" and the
  close sells a test, which raises nothing. Slide 7 pre-empts it: "There is no overnight switch...
  give them eight to twelve weeks, then measure." The close supplies the measurement, which is what
  the body asked for. No efficacy claim is created.

## Day 11. 14-signs-of-vitamin-d-deficiency. Type cover. Close B.

**Scanner: 1 HARD, 8 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR.
- 8 REVIEW: cover "14 SIGNS OF LOW VITAMIN D" flagged as unhedged with nothing on the slide hedging
  it (CA-032 approved row, not reopened); the repeated "One sign on its own means very little." on
  slides 3, 4 and 5, which drops the article's "usually" (deck-level, in the 46); slide 6 "No signs
  at all."; the close line.

**Judgement**

- **CLEAR. Kit scope.** Vitamin D is a Kit 2 marker (kit-2 §3), pillar A routes to KIT_2, close names
  the Energy & Recovery Check at £119.
- **CLEAR. Combination.** A 13-item symptom list ending in an offer is the shape that would normally
  imply "these signs mean you are deficient, buy the test". Slide 2 negates it up front ("Signs
  aren't diagnoses... Three or four together is worth checking") and every list slide repeats
  "Suggestive, not diagnostic." The close names a marker the kit measures and asserts nothing about
  the signs.

## Day 14. crp-blood-test. Video cover. Close B.

**Scanner: 1 HARD, 4 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR.
- 4 REVIEW: cover "WHAT CRP ACTUALLY MEANS" unhedged (CA-032); three dropped-qualifier flags on
  slides 3 and 6.

**Judgement**

- **CLEAR. Kit scope.** hs-CRP is a Kit 2 marker. £119 correct.
- **REVIEW. Combination risk: the post's band table disagrees with the product it sells.** Slide 3
  item 02 reads "1.0 to 3.0 is average", correctly attributed to the AHA/CDC strata. Slide 8 then
  sells the kit whose own results engine classifies that same range as elevated:
  `frontend/lib/results/classifier.ts:310`, `if (value > 1) return 'elevated-crp'`, and kit-2 §3
  states that hs-CRP at or below 1 is normal and above 1 up to 3 is elevated. A buyer told "average"
  on slide 3 reads "elevated"
  in his report. At deck level the slide is a faithful compression of the article. It only becomes a
  purchase promise when close B attaches a price to the kit that will contradict it. A human must
  rule which wording the buyer sees. Slide 3 item 04 "Over 10 is your GP that week" does match the
  classifier's `>10` GP-referral band.

## Day 17. free-androgen-index. Type cover. Close B.

**Scanner: 1 HARD, 3 REVIEW.**

- HARD: `figure "99"` on slide 8. Adjudicated CLEAR.
- 3 REVIEW: dropped-qualifier flags on slides 3 and 4.

**Judgement**

- **CLEAR. Kit scope.** SHBG is a Kit 1 marker: kit-1 §3 and `app/lp/testosterone/page.tsx:23`. £99
  correct. Pillar C routes to KIT_1.
- **REVIEW. Combination risk, the sharpest in this slice.** Slide 5 states "UK labs don't report FAI
  for men." and "If you already have an FAI on a report, read it as a rough signal, not as your
  usable number." Slide 8 then offers, at £99, the kit whose own live page headlines that marker:
  `app/lp/testosterone/page.tsx:23` "Tests Total T, SHBG, Free Androgen Index (FAI), Albumin, and
  Free T", and kit-1 §3 lists FAI as one of five. The post tells a reader FAI is not his usable
  number and, one slide later, sells him the kit that advertises FAI. Neither slide 5 alone (backed
  by the 2026-07-30 ruling and by the article) nor close B alone creates that. The repo already
  records kit-1 line 72 as contradicting `thresholds.md` on exactly this point, so the defect may sit
  on the product side rather than in this copy. A human must rule.
- **REVIEW. Cover promise and close marker name different numbers.** The cover is "THE NUMBER GPS
  OFTEN MISS" (singular, CA-032). The deck's answer to "the number" is calculated free testosterone:
  slide 5 "They report a calculated free testosterone instead", slide 7 "a calculated free
  testosterone is the figure to ask for". The close names SHBG. A reader who takes the cover at face
  value reads the close as saying SHBG is the missed number. This is a CA-031 mapping question (which
  marker close B names for this topic), not an edit.

## Day 20. how-to-read-blood-test-results. Video cover. Close B.

**Scanner: 1 HARD, 6 REVIEW.**

- HARD: `figure "179"` on slide 8. Adjudicated CLEAR.
- 6 REVIEW: cover "HOW TO READ YOUR RESULTS" unhedged (CA-032); five dropped-qualifier flags on
  slides 4, 5, 6 and 7.

**Judgement**

- **CLEAR. Kit scope and count.** "Nine markers are in the Hormone & Recovery Check." is exact:
  `kit-3-hormone-recovery-check.md` §3 "Biomarker Panel (9 markers)" and the live page "all 9
  markers". £179 = KIT_3 rrp. This is the run's only Kit 3 topic and a whole-panel topic honestly
  maps to the whole-panel kit.
- **REVIEW. Combination risk: the post's only marker list is not the kit's marker list.** Slide 4
  ("What you'll see on a UK panel") lists five units: "nmol/L: testosterone, SHBG", "mg/L: CRP",
  "µg/L: ferritin", "pmol/L: active B12", "g/L: haemoglobin". Four of those five are Kit 3 markers.
  Haemoglobin is not: the nine-marker table in kit-3 §3 has no haemoglobin. Four slides later the
  close says nine markers are in the kit. The post's only marker list and the post's only kit claim
  sit on one asset, so slide 4 can be read as the kit's contents, which would misstate what £179
  buys. The deck alone does not create this, because without the close there is no kit to attribute
  the list to. A human must rule.
- Note, not a finding: the close fills the CA-031 `{Marker}` slot with a count rather than a marker
  name. `slide-8-closes.md` records this exact string as pre-existing and unchanged, so no new copy
  was introduced.

## Day 23. ferritin-blood-test. Video cover. Close B.

**Scanner: 1 HARD, 5 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR.
- 5 REVIEW: cover "YOUR IRON STORES, EXPLAINED" unhedged (CA-032); one "fix" retest-framing flag on
  slide 4; three dropped-qualifier flags on slides 2, 3 and 5.

**Judgement**

- **CLEAR. Kit scope.** Ferritin is a Kit 2 marker. £119 correct.
- **CLEAR. Combination.** This is the shape a combination check is looking for and it holds: slide 7
  says "A low result is a GP question... Iron carries a real overdose risk... We don't sell iron."
  and the close sells the measurement only. That matches our own routing, kit-2 §3 ferritin `<30` low
  → GP referral. The post sells the test and refuses the treatment on the same asset.

## Day 26. brain-fog. Type cover. Close B.

**Scanner: 1 HARD, 8 REVIEW.**

- HARD: `figure "119"` on slide 8. Adjudicated CLEAR.
- 8 REVIEW: one "Fixed" retest-framing flag on slide 5; six dropped-qualifier flags on slides 2, 3, 4
  and 5; one on the close line, below.

**Judgement**

- **CLEAR. Kit scope, the precedent case.** Brain fog on Kit 2, never Kit 1. Kit 1's own spec is
  explicit: "Do not frame it as explaining general fatigue, energy, or recovery symptoms." The deck
  carries `kit: 'energy-recovery'`. Correct.
- **REVIEW. Marker naming on the close.** Slide 8 reads "Ferritin, B12 and vitamin D are in the
  Energy & Recovery Check." Kit 2 measures **Active B12 (holotranscobalamin)**, not total B12: kit-2
  §3, and the kit page labels it "Active B12". This run's own B12 post spends slides 2 and 3
  establishing that the two are different tests and that "a normal total can still hide a low active
  level", and the sibling close on day 5 writes "Active B12". Within this post it is a naming
  imprecision that overstates what the kit runs; across the run it is the one close that names the
  marker the way another post says is misleading. The string is CA-031 mapping copy, so a human must
  rule rather than an editor fix it.
- **CLEAR. Combination.** Slide 6 "Low B12, low iron and low vitamin D don't produce a symptom you
  can point to... The only way to see them is to look" names three things, and the close names the
  same three, all of which Kit 2 measures. The close does not extend the body.

## Day 29. myth-of-normal-range. Video cover. Close B.

**Scanner: 1 HARD, 2 REVIEW.**

- HARD: `figure "99"` on slide 8. Adjudicated CLEAR.
- 2 REVIEW: dropped-qualifier flags on slides 6 and 7.

**Judgement**

- **CLEAR. Kit scope.** A testosterone topic on Kit 1, £99. Pillar C routes to KIT_1.
- **CLEAR. No clinical implication.** Nothing on this post mentions TRT, prescribing or a clinical
  service, on a topic that sits next to that conversation. Slide 5's thresholds carry their source on
  the slide ("NHS · BSSM guidelines, 2023"), which is the 2026-08-04 substantiation rule.
- **REVIEW. Combination risk: the close offers a test that uses the framework the post criticises.**
  For six slides the post argues the band answers the wrong question: slide 5 "8 to 12 nmol/L: the
  grey zone" with the note "Most symptomatic men sit in the grey zone and are told they're fine",
  slide 6 "Symptoms start at eleven", slide 7 "It's answering whether you are ill. Most men reading
  their result are asking whether they are well." Slide 8 then offers the Testosterone Health Check
  at £99. Our own results engine uses `T < 12` low → GP referral with no upsell, and a single normal
  band from 12 to 20 (kit-1 §3). So the exact reader this post is written for, the man at 9 to 11,
  buys the kit and is routed to his GP rather than given the different answer the post implies exists.
  Slide 7's own resolution ("A baseline you can retest tells you more") is what the kit does deliver,
  which is why this is REVIEW and not HARD. A human must rule whether close B may follow this
  argument.

---

## Summary

| Day | Topic | Cover | Close | Scanner HARD | Scanner REVIEW | Judgement HARD | Judgement REVIEW | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2 | b12-blood-test | type | B | 1 | 6 | C1 | 0 | BLOCKED by C1 |
| 5 | why-am-i-always-tired | video | B | 1 | 8 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| 8 | how-to-increase-testosterone-naturally | type | B | 1 | 5 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| 11 | 14-signs-of-vitamin-d-deficiency | type | B | 1 | 8 | C1 | 0 | BLOCKED by C1 |
| 14 | crp-blood-test | video | B | 1 | 4 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| 17 | free-androgen-index | type | B | 1 | 3 | C1 | 2 | BLOCKED by C1, plus REVIEW |
| 20 | how-to-read-blood-test-results | video | B | 1 | 6 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| 23 | ferritin-blood-test | video | B | 1 | 5 | C1 | 0 | BLOCKED by C1 |
| 26 | brain-fog | type | B | 1 | 8 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| 29 | myth-of-normal-range | video | B | 1 | 2 | C1 | 1 | BLOCKED by C1, plus REVIEW |
| **Total** | | | | **10** | **55** | **C1 on all ten** | **8** | 10 blocked, 7 also carry a REVIEW |

All ten scanner HARDs are the same finding, the price figure on slide 8, adjudicated as false
positives against `pricing.ts` and the live kit pages.

**Zero post-specific HARD findings on judgement, and one run-level HARD, C1, which blocks all ten.**
No close-B post ships until `CAROUSEL_RUN_START` is set in Coolify and the `keith.antony.ai`
Instagram bio points at `/go`. That is an environment gate rather than a copy defect, so no copy
change is owed and no approval is reopened, but it is a ship blocker and it applies to every post in
this slice. Setting aside C1, no post-specific defect in this slice blocks shipping. Eight findings
need a human ruling, and seven of the ten posts carry at least one.

An earlier version of this report said "Nothing in this slice is blocked from shipping by this pass."
That was wrong: it read C1 as belonging to the close-C slice, when `closes.js` gives all three closes
the same "Link in bio" string and `bio-grid.ts` gates all three arms on the same unset variable. The
sentence is corrected above.

Scanner counts are from the run with renders declared. Without `--render` each post scores one extra
REVIEW (the undeclared-render warning), which is 65 rather than 55.

**Run-level roll-up: state it as 187, on a no-render basis.** Arms A and C were scanned WITHOUT
`--render` and this arm WITH it, so the three summary tables' REVIEW columns are not on one base. A's
61 and C's 61 each include one undeclared-render line per post; this arm's 55 does not. Converted to
a single no-render basis the run total is **187**: 61 (A) + 65 (B, the 55 above plus the ten
undeclared-render lines a no-render scan adds) + 61 (C). Adding 61 + 55 + 61 = 177 is **wrong by
10**. Anyone aggregating the three tables must either state 187 on a no-render basis or re-run arms A
and C with `--render` first.

## What this pass does NOT cover

- **The renders.** The scanner reads text and cannot read an image. It listed 8 PNGs per post, 80
  files, as an unmet obligation. **Partial exception, added after the first draft:** the ten
  `close-B.png` files have been hashed and the per-topic variation confirmed correct (see the
  render-hash check above). Nobody has viewed the close-B renders, or the covers, or slides 2 to 7. A
  clean text result is not a clearance for copy that ships as pictures.
- **The video covers as they will actually appear.** Only the still `cover-video.png` was declared.
  The composited MP4 from `video.js`, including the transparent overlay burn-in, was not inspected.
- **Captions and first comments.** Not written, so not scanned. A caption can reintroduce every claim
  the slides avoid.
- **The destination pages' own copy.** "Link in bio" resolves, once C1 is cleared, to
  `/kits/<kit>`. The copy on those kit pages was read for marker inventory and price only, not
  pre-flighted as customer-facing copy, and day 17 and day 20 both turn on what the destination page
  says. **The bio link itself is no longer in this list:** whether it resolves at all is covered
  above as C1, a HARD that blocks all ten posts.
- **The live articles.** Sources were the repo MDX mirrors. Where a live article is DB-served it was
  not diffed against its mirror in this pass.
- **CA-031 and CA-032 approved copy.** Cover rows and close templates were checked for consequences,
  not reopened. Several scanner REVIEWs land on approved cover headlines and are recorded, not
  challenged.
- **The other twenty posts.** Closes A and C are separate slices.
- **Clinical sign-off.** This is a findings pass. Sign-off is Ewa's on clinical and claims, Keith's
  on business.
