# Per-post compliance pre-flight: the ten close-A posts

**Date:** 2026-08-11. **Scope:** the ten assembled POSTS whose close is A: days 1, 4, 7, 10, 13, 16, 19, 22, 25, 28 of the 30-day run. One post = cover headline (`covers.js`) + slides 2 to 7 (`decks/<slug>.js`) + slide 8 (close A as `closes.js` builds it). Slide numbers below are POST slide numbers, 1 to 8.

**What this adds to what already exists.** The deck-level pre-flight covered slides 2 to 7 only (0 HARD, 46 REVIEW). CA-031 approved the three close templates and one mapping; CA-032 approved the ten cover headline rows. None of those covered an assembled post, so the covers had never been scanned against their source article, and the close had never been checked in combination with the topic it lands on. This pass covers both.

**Method.** Each post was assembled to `…/scratchpad/posts/day-NN-<slug>.js` (+ a readable `.txt`) and scanned with:

```
node d:\Androprime_main\.claude\skills\compliance-preflight\fragment-scan.js \
  --fragment <post> --source d:\…\frontend\content\blog\<slug>.mdx
```

The scanner labels a slides array `slide-(i+2)`; index 0 here is the post's slide 1 (the cover), so its `slide-NN` is the post's slide NN-1. Counts below are the scanner's own totals; the mapping to post slide numbers is applied in the prose.

**Findings pass only.** No deck, close or cover copy was edited. Nothing below is an edit request; CA-031 and CA-032 copy changes need a new approval.

---

## Findings that recur across posts

Referenced by ID in the per-post sections rather than restated.

### C1 · HARD · slide 8 says "Link in bio" and there is no link yet

**Run-level, and it applies to all ten posts in this slice.** It is carried under the same ID as in the close-C pass because it is the same finding, not a close-C one: it blocks all 30 posts of the run.

`closes.js` gives all three closes the **identical** `link: 'Link in bio'` string (lines 43, 50 and 57), so every post in the run states the same destination on slide 8. The destination system is the `/go` grid, `09_website-app/frontend/lib/bio-grid.ts`, where `destinationFor()` resolves close A to `/test-selector`, close B to `/kits/<kit>` and close C to `/blog/<slug>`. Which arm a post is in does not matter, because the grid that carries all three arms is gated on one unset variable:

- `CAROUSEL_RUN_START` is **not set**. `frontend/.env.local` contains no such key (grep count: 0), and `bio-grid.ts:107` reads `export const RUN_START_ISO = process.env.CAROUSEL_RUN_START ?? ''`. `bio-grid.ts:159` then reads `if (!RUN_START_ISO) return []`, so `visiblePosts()` returns nothing and the grid renders **empty for every close**. That is deliberate; the file's own comment says "Unset or unparseable renders an empty grid. That is the safe direction."
- The Instagram bio link is **not yet pointed at `/go`**. `09_website-app/STATE.md:15` and `:25` both carry it as owed: "set `CAROUSEL_RUN_START` in Coolify, and point the `keith.antony.ai` Instagram bio at `/go`".

Ship any post before both are done and slide 8 states a destination that resolves to an empty page. This is a publish gate, not a copy defect: no approved copy needs changing, the environment does. **No post in this slice ships until both are set.** Remedy is Keith's, in Coolify and in the Instagram profile, not in `closes.js`.

**Origin: CA-031 §3 condition 4, not this pass.** C1 is a standing condition still open, not a new defect the pre-flight uncovered. `03_compliance/content-approval/approval-record-carousel-closes-2026-08-11.md` §3 records it as condition 4 of the approval: "Copy approval is not a ship authorisation. The run is separately gated on the bio-link rotation mechanism, without which the three closes cannot be told apart", and §5 repeats it: "The run remains gated on the bio-link rotation mechanism and on a per-post pre-flight for each of the 30 posts." What this pass adds is the evidence that the condition is still open (the unset `CAROUSEL_RUN_START`, the bio link not yet pointed at `/go`) and the file-and-line proof, not the condition itself.

### RH-1 · REVIEW, now cleared · the ten close-A renders were not the same image

Close A is a fixed string with no per-topic substitution, stated in this report's own scope note, so its ten renders must be byte-identical. Nine were. `png/how-to-read-blood-test-results/close-A.png` was not: it hashed `85691d9086ee406ff92ab57a6d15cb16` at 47,209 bytes against `54df525cb6945d9487ae10e511f51faf` at 47,749 bytes on the other nine. Detail and remedy are in the day 10 section below. The same defect on the same file tree was recorded by the close-C pass as C3, on `png/crp-blood-test/close-C.png`.

**Graded REVIEW, on the same reasoning the close-C pass gave C3.** The defect carries no claim content: the copy is identical line for line, only the type face differs, and the disclaimer is present and legible in both renders. One mechanism cannot be HARD on this arm and REVIEW on the close-C arm, so it is REVIEW here too. **C1 is this report's only run-level HARD.**

Both files were re-rendered and all thirty close renders were re-hashed. The rule the check enforces: **close A and close C are fixed strings and must each be constant across the ten topics; close B is legitimately per-topic** because `closesFor()` substitutes `deck.closeBHeadline` and the kit price.

| Close | Distinct hashes across ten topics | Expected | Result |
| --- | --- | --- | --- |
| A | 1 · `54df525cb6945d9487ae10e511f51faf` · 47,749 bytes · ten of ten | 1 | **PASS** (was 2 before the re-render) |
| B | 9 | 9 or 10 | **PASS** |
| C | 1 · `ce1ad5c874ae9552faa4863c65477b0d` · 43,735 bytes · ten of ten | 1 | **PASS** (was 2 before the re-render) |

Close B lands on 9 rather than 10 because `how-to-increase-testosterone-naturally` and `myth-of-normal-range` carry the same `closeBHeadline` ("Testosterone is in the Testosterone Health Check.") and the same Kit 1 price, so their `close-B.html` files are byte-identical (`diff` returns nothing) and their renders are too. That is correct, not a collision.

### KS-1 · close A's destination can return a kit that measures nothing the post is about

Close A is the router: `slide-8-closes.md` §A, "Router → `/test-selector`". The post promises the router answers the reader's question: **"Not sure which test you'd even need? / Three questions. About a minute."**

The router is `components/marketing/TestSelectorQuiz.tsx`. It never asks about the marker. Q1 is "What is your main reason for testing?" with three options:

- A: "I am knackered, my drive has gone, or I just do not feel like myself anymore."
- B: "I am training hard but not recovering like I used to. Tired, sore, or running on empty."
- C: "No specific complaint. I just want to know where I stand."

Scoring, `getResult()` lines 73 to 85:

```js
if (q1 === 'a') return q2 === 'a' ? RESULTS.kit3 : RESULTS.kit1
if (q1 === 'b') return q3 === 'b' ? RESULTS.kit3 : RESULTS.kit2
if (q1 === 'c') return RESULTS.kit1
```

So **q1=a + q2=b (desk-based) → Kit 1**, and **q1=c → Kit 1**, and the result card then reads: "Start with the Testosterone Health Check. … Kit 1 tests Total T, SHBG, and Free Testosterone." Kit 1 is testosterone only (`04_products/kits/kit-1-testosterone-health-check.md` §3; `lib/content/kitCTA.ts` pillar C → KIT_1). It carries no vitamin D, no active B12, no hs-CRP and no ferritin.

CA-025 (`03_compliance/content-approval/approval-record-kit-scope-note-2026-07-19.md`) states the rule as "Kit 1 measures testosterone only, never framed as explaining general fatigue", and it is LIVE behind `KIT_SCOPE_NOTE_ENABLED=true`. `kitCTA.ts` lines 90 to 92 state the governing precedent in its own words: "Do not 'nearly match' these to Kit 2: sending liver-function intent to an energy kit is the mis-route this map exists to prevent." Here the mis-match is worse than "nearly": a man who reads eight slides about active B12 and answers "I am knackered" plus "mostly desk-based" is handed a kit with no B12 in it.

This is post-level by construction. It does not exist in the deck (which names no destination) and it does not exist in CA-031 (which approved a string, not a landing). It exists only where a Kit-2-marker topic meets close A.

Partial mitigation, not a cure: every non-Kit-3 result also renders a secondary "Or get full picture (Kit 3)" link to `/kits/hormone-recovery`, which does carry the Kit 2 markers. The primary answer, the H2 the reader is given, is still the testosterone-only kit.

The remedy is not in the post copy and cannot be. It is either in the router (a Q1 option that catches a desk-based, marker-curious reader) or in the destination close A uses for these topics. That is Keith's call, with Ewa on the scope question.

### CV-1 · five covers assert with no hedge, and the cover is the whole tile on the grid

The cover had never been scanned against its article before this pass. On five of the ten, the scanner matched the cover line to a source sentence that carries a qualifier the cover drops, with **nothing on that slide hedging it**, and a cover has no body copy by design (`build.js` `coverVideo` / `coverTypeHtml` render eyebrow + two headline lines only). The hedge arrives on slide 2, which a profile-grid viewer never opens.

CA-032 approved these rows and this is not a request to change them. It is the one thing a deck-level pass structurally could not see, so it is recorded for a human ruling. Affected: days 1, 4, 10, 13, 25.

---

## Day 1 · 14-signs-of-vitamin-d-deficiency · cover video · close A

**Scanner: 0 HARD · 8 REVIEW.**

### REVIEW

- **KS-1, escalated.** Vitamin D is a Kit 2 marker. Slide 6 actively recruits the reader who will answer Q1 option C: headline "No signs at all.", body "Low vitamin D runs silent for years in most UK adult men… That is the one most men miss." The post tells an asymptomatic man he is the one most likely to be deficient, then the close offers three questions, and the router's only option for "no specific complaint" returns the testosterone-only kit. Vitamin D is not named in CA-025's wording (which names fatigue), so this is a human's ruling rather than an automatic HARD. If CA-025 is read as a general kit-scope rule and not a fatigue-specific one, this is HARD.
- **CV-1.** Slide 1 cover: "14 SIGNS OF LOW VITAMIN D". Source: "The most common signs of low Vitamin D in UK adult men are…". "Most common" is dropped and nothing on the tile carries it. 100% overlap.
- Scanner, slide 3: "Low mood through the dark months" and "Slow recovery from training" drop "most common" from the same source sentence. Slide hedges elsewhere ("Suggestive, not diagnostic").
- Scanner, slides 3, 4 and 5: the repeated note "One sign on its own means very little." drops "usually" from the article's "One sign on its own usually means very little." Three instances, one string.
- Scanner, slide 6: "No signs at all." vs source "No signs at all: the one most UK men miss".
- Undeclared render (1 of the 8). Renders exist at `png/14-signs-of-vitamin-d-deficiency/` (13 files, including `cover-video.png` and `close-A.png`); a human must still view them.

### CLEAR

- Price accuracy: close A names no kit and no price. Zero "£" in the assembled post.
- Diagnosis language is a negation throughout: slide 2 "Signs aren't diagnoses.", slides 3 to 5 "Suggestive, not diagnostic."
- No em dash. No treat/cure/clinically proven. No ashwagandha.
- Disclaimer "Education, not medical advice." on all 8 slides (`build.js` `footerHtml()` is emitted by every render branch and by both cover templates; the video overlay composites full-duration, `video.js` `eof_action=repeat`).

---

## Day 4 · crp-blood-test · cover type · close A

**Scanner: 0 HARD · 5 REVIEW.**

### REVIEW

- **KS-1, escalated.** hs-CRP is a Kit 2 marker and is in no version of Kit 1. Same ruling question as day 1.
- **CV-1.** Slide 1 cover: "WHAT CRP ACTUALLY MEANS", nothing on the tile hedges it. The article's own sentence is a scoped promise about bands and cutoffs; the cover is an unqualified claim to explain what CRP means.
- Scanner, slide 3: "Under 1.0 is the low band": qualifier dropped, slide hedges elsewhere via the note and the AHA/CDC source line.
- Scanner, slide 3: "The framework UK private labs read against." vs source "On the more precise framework **most** private labs use…". "Most" dropped; the slide asserts it is *the* framework UK private labs use. 60% overlap, and this one is a factual widening rather than a tone softening, so it is worth a human's eye even though the slide hedges elsewhere.
- Scanner, slide 6: eyebrow "In active men" vs source "What high CRP **usually** means in active men".
- Undeclared render. `png/crp-blood-test/` holds 12 files, but there is **no `slide-01.png` and no inpainted newspaper frame** for this topic (`plan.js`: NEEDS INPAINT), so slide 1 currently renders the missing-photo hatch. Not shippable until minted.

### CLEAR

- Slide 3 item "Over 10 is your GP that week" preserves the article's escalation rail.
- No price, no kit named, no em dash, no banned vocabulary, disclaimer on all 8.

---

## Day 7 · free-androgen-index · cover video · close A

**Scanner: 0 HARD · 4 REVIEW.**

### REVIEW

- Scanner, slide 3: "Only 1 to 3% is completely free" drops "around" from "Only **around** 1 to 3% is completely free".
- Scanner, slide 3: the note "The total counts the locked-up and the free as if they were the same thing." drops "**still** read comfortably mid-range" hedging from the source sentence.
- Scanner, slide 4: "High SHBG, shrinking free fraction." paired at 80% overlap to the article's limit sentence ("earn their keep when SHBG is high or low, not as a routine upgrade on every test"). The pairing is loose; the limit itself is preserved verbatim on slide 6, so this reads as a scanner artefact rather than a lost qualifier. Recorded so the reviewer is not chasing it.
- Undeclared render. `png/free-androgen-index/` has 12 files and **no slide-01**: this is a video-cover post with no inpainted frame (`plan.js`: NEEDS INPAINT). Not shippable until minted.

### CLEAR

- **KS-1 does not apply.** This is a testosterone topic. Q1 option A routes to Kit 1 or Kit 3; both carry SHBG and a **calculated Free Testosterone** (`kit-1-testosterone-health-check.md` §3: "Free Testosterone | calculated (nmol/L)"). Slide 7 tells the reader "a calculated free testosterone is the figure to ask for", and the router's answer actually contains that figure. Topic and destination match.
- The 2026-07-30 FAI framing survives compression intact: slide 5 "UK labs don't report FAI for men." and slide 6's "not as a routine upgrade on every test".
- Slide 7 uses "regards", not "treats". No price, no em dash, disclaimer on all 8.

---

## Day 10 · how-to-read-blood-test-results · cover type · close A

**Scanner: 0 HARD · 7 REVIEW.**

### REVIEW

- **Combination risk, post-level.** Slide 4 lists five units the reader "will see on a UK panel", including `g/L: haemoglobin`. No Andro Prime kit measures haemoglobin, and Kit 1 (a reachable router answer, KS-1) reports only nmol/L markers. The slide is honest read alone: it describes a UK panel, not our panel. Followed immediately by "Not sure which test you'd even need? Three questions.", a reader can take the recommended kit to cover the panel just itemised. Neither slide creates that on its own. A human must rule.
- **CV-1.** Slide 1 cover: "HOW TO READ YOUR RESULTS" vs source "This guide shows you how to read each one for a UK men's panel." Nothing on the tile hedges it, 67% overlap.
- Scanner, slide 4: headline "What you'll see on a UK panel" vs source "**Once** you can see those four things on any line, you **can** read any panel." Nothing on this slide hedges it.
- Scanner, slide 5: "An afternoon reading is a mismatch." The article's "not a verdict" tail is dropped; the slide body keeps the mechanism.
- Scanner, slide 6 (two findings): "A cold, a brutal session, a poor night, dehydration, the meal before the test." and "Any of them nudges a marker without your baseline having moved at all." both drop "**can** nudge". "Nudges" states it; "can nudge" allows it. The slide hedges elsewhere.
- Scanner, slide 7: eyebrow "Why it matters" paired to the article's closing sentence. Artefact of a two-word eyebrow, no action.
- Undeclared render. `png/how-to-read-blood-test-results/` has 12 files, no slide-01, frame NEEDS INPAINT.

### RENDER DEFECT · REVIEW, found and fixed · the close-A instance of C3

- **This post's close-A render was not the same image as the other nine.** `png/how-to-read-blood-test-results/close-A.png` hashed `85691d9086ee406ff92ab57a6d15cb16` at **47,209 bytes**, while all nine other close-A renders hashed `54df525cb6945d9487ae10e511f51faf` at **47,749 bytes**. Close A is a fixed string with no per-topic substitution (`closes.js` `closesFor()` returns the same four lines for every deck), so the ten renders must be byte-identical, and they were not.
- **Viewed, both files, side by side** against `png/ferritin-blood-test/close-A.png` as the control. The copy is identical line for line. The difference is the type: the serif line **"Three questions. About a minute."** is set in a narrower, lighter face in the day 10 render. `build.js` pulls Inter, Merriweather and JetBrains Mono from Google Fonts over the network at render time, and `render.js`'s own header warns "render online or the fallback face will change the type metrics". This is a webfont fallback, and it is the **same signature the close-C pass recorded as C3** on `png/crp-blood-test/close-C.png`. Two arms, one file tree, one defect.
- **Fixed and re-proved.** Re-rendered with `node render.js --deck how-to-read-blood-test-results close-A`. The file now hashes `54df525cb6945d9487ae10e511f51faf` at 47,749 bytes, matching the other nine exactly. Re-opened and viewed: the serif line and the footer `EDUCATION, NOT MEDICAL ADVICE.` both read correctly in Merriweather and JetBrains Mono. `png/crp-blood-test/close-C.png` was re-rendered in the same pass and now matches its own nine. See RH-1 for the full re-hash of all thirty close renders.
- **Graded REVIEW, not HARD**, matching C3 on the close-C arm: the copy is identical line for line, only the type face differs, and the disclaimer is legible in both, so nothing about the claim content changes. It is graded as a defect rather than an artefact because the run's premise is that slide 8 is the only variable. A close-A post shipping a slide 8 that differs from the other nine for a reason unrelated to the experiment would corrupt the arm it is meant to measure. It was missed by this pass first time round because no render was hashed or opened; the sibling close-C pass caught its own instance with a one-line hash check.

### CLEAR

- Slide 3 "It includes 19 people in 20." and the 95% construction are supported; no unsupported figure anywhere in the post.
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 13 · ferritin-blood-test · cover type · close A

**Scanner: 0 HARD · 6 REVIEW.**

### REVIEW

- **KS-1, escalated.** Ferritin is a Kit 2 marker, absent from Kit 1.
- **Combination risk, post-level, and the sharpest on this post.** Slide 7 is the GP rail and the deck header calls it unsoftenable: **"A low result is a GP question."** / "Iron carries a real overdose risk, and in men depleted stores can point to slow blood loss. The cause gets found first. We don't sell iron." The very next thing the reader sees is slide 8: "Not sure which test you'd even need? Three questions. About a minute." The post says the answer is a doctor and then immediately offers a purchase router. Nothing false is stated; the reading order is the risk. A human must rule whether the GP rail survives being the second-to-last slide.
- **CV-1.** Slide 1 cover: "YOUR IRON STORES, EXPLAINED", 67% overlap, nothing on the tile hedges it.
- Scanner, slide 2: "It measures the iron you hold in reserve." drops the article's "not just how much is moving through your blood right now" contrast.
- Scanner, slide 3: "30 to 100 reads normal for the lab" vs source "30 to 100 µg/L: normal for the lab, **not always optimal for you**".
- Scanner, slide 4: literal hit `"fix"` (retest/efficacy framing). The line is **"Flat energy a full night doesn't fix"**, a negation, so this is a scanner false positive. No action.
- Scanner, slide 5: "Low iron, normal blood count." drops "**can** be low" from the source. 80% overlap; the body restores the mechanism.
- Undeclared render. `png/ferritin-blood-test/` has 12 files, no slide-01, frame NEEDS INPAINT.

### CLEAR

- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 16 · brain-fog · cover video · close A

**Scanner: 0 HARD · 8 REVIEW.**

### HARD: must not ship as assembled

- **KS-1.** Brain fog is one of the three topics CA-025 names. A reader of this post who answers Q1 "I am knackered, my drive has gone, or I just do not feel like myself anymore" and Q2 "Mostly desk-based and not training consistently" is returned **Kit 1, the Testosterone Health Check**, on a post whose own slide 6 says the invisible drivers are "Low B12, low iron and low vitamin D", none of which Kit 1 measures. The deck's own header carries the rule: "Close B names Kit 2 and must never name Kit 1… The topic and the kit feel adjacent, which is why it is written down rather than left to judgement." Close A satisfies the letter of that (it names no kit) and defeats it in effect, because its destination names one. Remedy is in the router or in close A's destination for this topic, not in the post copy.

### REVIEW

- Scanner, slide 2: "Brain fog is a description." The article's "**not a diagnosis**" is on the same source line and does survive, in the body ("Not a diagnosis."). Artefact of the headline/body split; no action.
- Scanner, slide 3: "Blood-sugar swings from a fast-carb breakfast" and the note "Four or five ordinary things, stacked up over weeks." drop "and ordinary things can be moved" / the "so your blood sugar holds steady" mechanism.
- Scanner, slide 4: "Eight hours in bed, six of sleep." vs source "You **can** lie down for eight hours and get six of **broken, shallow** sleep." The slide states as fact what the source allows as possible.
- Scanner, slide 4: "Each one chips at the quality while the hours on paper look fine.": verbatim from source; qualifier flag is an artefact.
- Scanner, slide 5: literal hit `"Fixed"`. The line is **"Fixed wake time, weekends included"**, an adjective, not efficacy. False positive, no action.
- Scanner, slide 5: "Protein and fibre at breakfast" drops the source's "so your blood sugar holds steady through the morning".
- Undeclared render. `png/brain-fog/` has 12 files, no slide-01; video-cover post with **no inpainted frame** (NEEDS INPAINT). Not shippable until minted.

### CLEAR

- Slide 7 preserves the red-flag rail verbatim in substance: "Fog that came on suddenly, or arrives with a low mood that won't lift, real memory loss or any neurological symptom, is a GP conversation that week."
- Diagnosis language is a negation ("Not a diagnosis.").
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 19 · myth-of-normal-range · cover type · close A

**Scanner: 0 HARD · 3 REVIEW.** Lowest count of the ten.

### REVIEW

- **Combination risk, post-level.** Six slides argue that the reference range answers the wrong question and that "Most symptomatic men sit in the grey zone and are told they're fine" (slide 5 note, with the 8 to 12 nmol/L band above it). Slide 8 then asks "Not sure which test you'd even need?" and routes to a kit. But our own results engine sends **T below 12 nmol/L from Kit 1 or Kit 3 to a GP referral, no upsell** (CA-013, recorded at `kit-1-testosterone-health-check.md:134`). A grey-zone man who buys off this post gets routed back to the doctor the post has just characterised as unsatisfying. Nothing on any slide promises otherwise; the implication that our test resolves the grey zone is created by topic-plus-close and by neither alone. A human must rule.
- Scanner, slide 6: "The referral threshold sits 3 below that." vs source "The NHS referral threshold sits 3 **nmol/L** below where symptoms become **statistically likely**." The unit and "statistically" are both dropped. The unit is recoverable from slide 5; "statistically likely" is not.
- Scanner, slide 7: eyebrow "Why it matters" pairing artefact. No action.
- Undeclared render. `png/myth-of-normal-range/` has 12 files, no slide-01, frame NEEDS INPAINT.

### CLEAR

- **KS-1 does not apply.** Testosterone topic; every router answer (Kit 1 or Kit 3) measures testosterone.
- No TRT implication anywhere: the deck stays on measurement and on what the range is answering. Slide 5 carries provenance on the slide itself ("NHS · BSSM guidelines, 2023"), which is the 2026-08-04 substantiation requirement met.
- Cover "WHAT 'NORMAL' REALLY MEANS" was not flagged; CV-1 does not apply.
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 22 · b12-blood-test · cover type · close A

**Scanner: 0 HARD · 7 REVIEW.**

### HARD: must not ship as assembled

- **KS-1.** B12 is one of the three topics CA-025 names. Q1=a + Q2=b, or Q1=c, returns the Testosterone Health Check to a reader who has just read eight slides about active B12. Kit 1 contains no B12. Remedy is in the router or the destination, not in the post copy.

### REVIEW

- **Combination risk, post-level, and the most serious of the four GP-rail cases.** Slide 7 is the red flag: "Nerve symptoms go to your GP." / "Numbness, pins and needles, or changes in balance, memory or concentration need a GP **without delay**. Some of what B12 deficiency does to the nerves can become **permanent** if it's left." Slide 8 immediately offers "Three questions. About a minute." A reader who recognises himself in slide 7 is handed a purchase router as the last thing he sees. The article carries the same warning but ends on it; the post does not. A human must rule on reading order.
- Scanner, slide 2: "A standard test reads total B12." drops "**but only the active fraction… so a normal total can still hide a low active level**". Slide hedges elsewhere.
- Scanner, slide 3 (four findings): "70 to 90% is bound to haptocorrin" (source: "**Most of it**, 70 to 90 percent"), "It's carried to the liver and excreted" (source: "**mostly** carried off"), "20 to 30% is bound to transcobalamin" (source: "**Only** the 20 to 30 percent… **can** be delivered"), "That fraction is the active one".
- Scanner, slide 4: "Active B12, in pmol/L" vs source "Active B12 is reported in pmol/L, and ranges **vary by lab**". The slide's own note restores it verbatim.
- Undeclared render. `png/b12-blood-test/` has 12 files, no slide-01, frame NEEDS INPAINT.

### CLEAR

- **The NG239 bands check out.** Slide 4 carries "Under 25 is low / 25 to 70 is borderline / Above 70 is normal", sourced NICE NG239. The scan produced **zero unsupported-figure findings** for this post, which confirms 25 and 70 are both present in the mdx mirror: the corrected bands are in the source and the slide is not misstating our own cut-point. The slide also carries "Reference ranges vary by lab. Read the band printed on your own report."
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 25 · why-am-i-always-tired · cover video · close A

**Scanner: 0 HARD · 8 REVIEW.**

### HARD: must not ship as assembled

- **KS-1.** Fatigue is the topic CA-025 names in its own wording ("never framed as explaining general fatigue"). The deck header states the rule explicitly: "Fatigue is NOT a Kit 1 story. Kit 1 measures testosterone only and must never be offered as the answer to general tiredness (CA-025)". Close A names no kit, and its router then does: Q1=a "I am knackered" + Q2=b "mostly desk-based" → **Kit 1**. Q1 option B does mention "Tired, sore, or running on empty", but it is gated on "I am training hard", so the desk-based tired man the deck is written for cannot reach Kit 2 through it. The one deck that wrote the rule down is the one the close defeats. Remedy is in the router or the destination, not in the post copy.

### REVIEW

- **Combination risk, post-level.** Slide 7 is the GP rail: "Some tiredness needs a doctor, not a blog." / "See your GP that week if it came on suddenly, if it stops you doing normal things, or if it arrives with unexplained weight loss, breathlessness or a low mood that won't lift." Slide 8 then offers the router. Same reading-order question as days 13, 16 and 22.
- **CV-1.** Slide 1 cover: "WHY AM I ALWAYS TIRED?" vs source "The deeper flat feeling… is **rarely** about one bad night." Nothing on the tile hedges it.
- Scanner, slide 2: literal hit `"fix"`. The line is **"Sleepy you can fix tonight."** This is a sleep claim about being sleepy, not a results or efficacy claim about a marker, and the scanner's rule targets retest framing. Reads as a false positive, but it is the one `fix` hit in the ten that is not plainly an adjective or a negation, so it is left for a human rather than dismissed.
- Scanner, slide 4 (four findings): "The usual suspects", "What the NHS lists", "Too little activity", "Alcohol and caffeine" all pair to the single NHS list sentence. Artefacts of splitting one sourced sentence into list items; the slide carries the NHS attribution.
- Scanner, slide 6: literal hit `"fixed"` on **"A fixed wake time, weekends included"**, adjective. False positive.
- Undeclared render. `png/why-am-i-always-tired/` has 12 files **including `slide-01.png`**, and this topic has its inpainted frame (`cover-why-tired.jpg`). One of only two posts in this slice whose cover asset exists.

### CLEAR

- Slide 7 attributes to the article, not to Ewa personally, per the 2026-07-09 trust-language correction.
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Day 28 · how-to-increase-testosterone-naturally · cover type · close A

**Scanner: 0 HARD · 5 REVIEW.**

### REVIEW

- **EFSA wording, ingredient claim.** Slide 6: **"Zinc contributes to the maintenance of normal testosterone levels. Read that carefully: maintenance, not boosting."** This matches `03_compliance/CONTEXT.md` line 108 verbatim: `| Zinc | "Contributes to the maintenance of normal testosterone levels" | Daily Stack |`. Against the repo's source of truth it is exact and the slide states the limit plainly, so no defect is asserted here. Two things a human should still rule: (a) the EU register entry for this claim carries the tail "**in the blood**", which CONTEXT.md's row omits; I checked the repo table, not the register, so whoever owns that table should confirm which is authoritative; (b) the claim is used detached from the product it is approved for (Daily Stack is not named anywhere in the post, and close A routes to a test selector), so the conditions of use are not on the asset.
- **Combination risk, post-level.** Cover reads "WHAT ACTUALLY RAISES TESTOSTERONE" and, on the grid, the cover is the whole tile with no body copy to carry a limit. Slide 4 then states an outcome with no hedge on the slide: "A review pooling 24 studies found weight loss, by diet or surgery, was followed by a meaningful rise, and the more men lost, the bigger the rise." The deck argues the opposite of an efficacy promise from slide 7 ("There is no overnight switch", levers move "over weeks to months"), but a grid viewer sees only the cover and a swiper sees slide 4 before slide 7. CA-032 approved this cover row on exactly this reasoning and no change is proposed; recorded because the assembled post is the first artefact where the cover and slide 4 sit together.
- Scanner, slide 3: "Ranked by what the evidence supports" drops "**actually**"; "Lose excess body fat, the biggest one" drops "(the biggest lever **for most men**)". The second is a real widening: "for most men" becomes universal.
- Scanner, slide 4: the Corona sentence, "NOTHING on this slide hedges it", 100% overlap. Source drops "**a 2013 review**" and "**either** a low-calorie diet or surgery".
- Undeclared render. `png/how-to-increase-testosterone-naturally/` has 12 files, no slide-01, frame NEEDS INPAINT.

### CLEAR

- **KS-1 does not apply.** Testosterone topic; Kit 1 and Kit 3 both measure it.
- No ashwagandha. Zinc is the only ingredient named in the post, consistent with the deck header.
- No price, no kit named, no em dash, disclaimer on all 8.

---

## Summary

| Day | Topic | Cover | Close | Scanner HARD | Scanner REVIEW | Judgement HARD | Judgement REVIEW |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 14-signs-of-vitamin-d-deficiency | video | A | 0 | 8 | **C1** | KS-1 escalated, CV-1 |
| 4 | crp-blood-test | type | A | 0 | 5 | **C1** | KS-1 escalated, CV-1 |
| 7 | free-androgen-index | video | A | 0 | 4 | **C1** | none |
| 10 | how-to-read-blood-test-results | type | A | 0 | 7 | **C1** | panel/kit inference, CV-1, RH-1 (REVIEW, fixed) |
| 13 | ferritin-blood-test | type | A | 0 | 6 | **C1** | KS-1 escalated, GP rail order, CV-1 |
| 16 | brain-fog | video | A | 0 | 8 | **C1, KS-1** | none beyond scanner |
| 19 | myth-of-normal-range | type | A | 0 | 3 | **C1** | grey-zone implication vs CA-013 |
| 22 | b12-blood-test | type | A | 0 | 7 | **C1, KS-1** | GP rail order (nerve symptoms) |
| 25 | why-am-i-always-tired | video | A | 0 | 8 | **C1, KS-1** | GP rail order, CV-1, `fix` |
| 28 | how-to-increase-testosterone-naturally | type | A | 0 | 5 | **C1** | EFSA tail, cover + slide 4 |
| | **Totals** | | | **0** | **61** | **C1 on all ten; KS-1 on 3** | |

61 scanner REVIEW includes one "no `--render` declared" line per post (10 of the 61); the scan was run without `--render`, as specified. Renders do exist on disk under `png/<slug>/`; the ten close-A slides have now been hashed and two of them opened (RH-1), and the covers plus slides 2 to 7 remain a human-view obligation.

**Run-level roll-up: state it as 187, on a no-render basis.** Arms A and C were scanned WITHOUT `--render` and arm B WITH it, so the three summary tables' REVIEW columns are not on one base. A's 61 and C's 61 each include one undeclared-render line per post; B's 55 does not. Converted to a single no-render basis the run total is **187**: 61 (A) + 65 (B, its 55 plus the ten undeclared-render lines a no-render scan adds) + 61 (C). Adding 61 + 55 + 61 = 177 is **wrong by 10**. Anyone aggregating the three tables must either state 187 on a no-render basis or re-run arms A and C with `--render` first.

**Two HARD findings block this slice, and they block it in different ways.**

- **C1 blocks all ten, and all thirty.** It is a publish gate: `CAROUSEL_RUN_START` is unset and the Instagram bio does not point at `/go`, so slide 8's "Link in bio" resolves to an empty grid on every close. Keith's action, in Coolify and in the profile. Nothing in this slice ships until it is done.
- **KS-1 blocks days 16, 22 and 25 on top of that**, and needs Keith on the business call plus Ewa on the scope call. It cannot be fixed in the post copy.

RH-1 is a REVIEW, not a HARD, matching C3's grading of the identical defect on the close-C arm, and it is now cleared: the day 10 close-A render has been re-rendered and all thirty close renders re-hashed. C1 remains this report's only run-level HARD.

Asset state, separate from compliance: eight of the ten posts have **no inpainted cover frame** and currently render the missing-photo hatch as slide 1 (days 4, 7, 10, 13, 16, 19, 22, 28). Only days 1 and 25 have theirs. Days 7 and 16 are video-cover posts with no frame at all.

Price accuracy across all ten: **CLEAR**. Close A names no kit and no price, and there is no "£" character in any of the ten assembled posts. `closes.js` KITS (£99 / £119 / £179) matches `lib/pricing.ts` `KIT_1.rrp` / `KIT_2.rrp` / `KIT_3.rrp`. No V7.1 or transitional figure appears anywhere in this slice.

## What this pass does NOT cover

- **The rendered images and the video covers.** This is a text scan. Every post carries an undeclared-render REVIEW for that reason, and the render is what the reader actually sees. **Exception, added after the first draft of this report:** the ten `close-A.png` renders were hashed and two were opened, which is how RH-1 was found. The covers, slides 2 to 7 and the video composites have still not been viewed by anyone. No clearance can be claimed for those until someone does.
- **The twenty posts that carry close B or close C.** Days 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 30 are outside this slice. Close B is the one that names a kit and a price, so the kit-scope and price checks land differently there and must be done on those posts.
- **Sign-off.** A clean fragment scan is not an approval. Every HARD and every REVIEW above needs Keith (business) or Ewa (clinical / claims). CA-031 and CA-032 remain approvals of templates and rows, not of posts.
- **The caption, the first comment and the hashtags.** None of those are in `covers.js`, the decks or `closes.js`, so none of them were assembled or scanned. **The link-in-bio target is no longer in this list:** whether the bio link resolves at all is covered above as C1, a HARD. What is still not covered is the *copy* on the pages behind it. `/go`, `/test-selector` and `/kits/*` were read for routing behaviour only, not pre-flighted as customer-facing copy.
- **The `/test-selector` page and quiz copy as customer-facing copy.** It was read as the destination that determines KS-1. Its own wording has not been pre-flighted here.
- **Whether `03_compliance/CONTEXT.md` line 108's zinc wording matches the EU register.** Checked against the repo table only.
- **Anything about the articles themselves.** The mdx files were used as the source corpus, not audited. The open finding against the `myth-of-normal-range` article recorded in `03_compliance/STATE.md` is untouched by this pass.
