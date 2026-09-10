# Kit 2 "Same Programme": stage 1 + 2 generation record

**Run:** 2026-09-09 | **Operator:** Keith (via Claude) | **Storyboard:** [`2026-09-09-kit2-same-programme-storyboards.md`](../../2026-09-09-kit2-same-programme-storyboards.md)
**Status:** 🟢 Stages 1 and 2 COMPLETE and approved at the §6a / §6b gates, **including a four-view 360 turnaround per character**. Stage 3 not started.
**Spend this run:** 39.08 credits (248.50 → 209.42, `pro` plan). Verified against `balance()` before and after.

> ⛔ **`/compliance-preflight` has still NOT been run on the storyboard, and the §12 items are still owed to Ewa.** Keith's ruling on 2026-09-09 was to proceed through the character sheets, which carry no claims, no copy, no product and no numbers, and to pre-flight before any clip is generated. **That gate now stands in front of stage 3.**

---

## THE TWO APPROVED SHEETS: these are the stage-3 inputs

| Character | File | `job_id` (pass this forward, do not re-upload) |
|---|---|---|
| **MARK, 44** | `stage2-sheets/mark-sheet-FINAL.png` | `ef3ec90a-4465-42ec-aca6-83d373fad50d` |
| **DAN, mid-40s** | `stage2-sheets/dan-sheet-FINAL.png` | `d00d715f-700f-4ab8-8531-3cb59ca2fd85` |

**The four-view 360 turnarounds** (added 2026-09-09 on Keith's instruction, 21:9 2K, 3120x1328). Front, three-quarter, side profile, back, in one row at consistent scale on a shared ground line:

| Character | File | `job_id` |
|---|---|---|
| **MARK** | `stage2-turnarounds/mark-turnaround-v1.png` | `3ee933ef-5153-4b4c-8e03-43c4ffb38554` |
| **DAN** | `stage2-turnarounds/dan-turnaround-v1.png` | `136fac8e-c66f-4ae3-a54b-9b1893a393c1` |

Both passed first time, with all garment regions inspected at 2x to 4x per the crop rule below. The three-quarter view was included beyond Keith's "front, side and back" because **most shots in this film sit at that angle rather than dead-on**: S1, S3 and S5 are all off-axis. Each turnaround was generated with **two** references, the approved sheet first and the approved base second.

⚠ **Do not carry the split-screen negative tail into a turnaround prompt.** It contains "no duplicate figures", which is correct for a two-panel sheet and directly contradicts a four-view turnaround. It was replaced with "exactly four figures in the image and all four are the same identical original character" plus "no additional people beyond the four views of this one man".

**Which reference to use downstream.** The sheet and the turnaround do different jobs and both should be kept: the **sheet** carries the face at high facial resolution and is the identity anchor; the **turnaround** carries silhouette, proportion, posture and how the wardrobe reads from every angle. For a front-on or near-front frame the sheet is enough. **For S3 (side-on at the barbell), S4 (Dan half-turned, Mark's head down) and any frame where a man is turned away, attach the turnaround as well.**

Their approved stage-1 base images, which stage 3 attaches as **image two** (build and wardrobe):

| Character | File | `job_id` |
|---|---|---|
| **MARK** | `stage1-base/mark-A-soul_2.png` | `9f721183-03f5-4cb9-a17b-96f02bec0771` |
| **DAN** | `stage1-base/dan-v1.png` | `f1d2a354-ecf6-4aec-961d-2dc2a3466e4d` |

All four are 2K. Sheets are 2720x1536 (16:9), bases 1152x2048 (9:16). Every model id below was read back from the **completed job record**, not the submission, per `higgsfield-generation`.

---

## Decisions taken, and by whom

**1. Model for the base image: Keith chose Soul 2.0, on images rather than description.**
§5a of the storyboard escalated this as a ruling Keith had to make, because the recommendation (`soul_2` → `seedream_v5_pro`) contradicted his standing "if images are required, use GPT Image 2" instruction, and because the source praising Soul was a Higgsfield-sponsored video. Rather than ask him to adjudicate a vendor claim blind, all three candidates were priced with `get_cost: true` (free, submits no job) and run on the identical §6a prompt:

| | Model | Credits | Output | Read |
|---|---|---|---|---|
| A | `soul_2` (`text2image_soul_v2`) | **0.12** | 1152x2048 | Best skin: real broken capillaries, uneven tone, greys in the stubble. Slightly more handsome than "ordinary". |
| B | `seedream_v5_pro` | 3 | 1536x2720 | Most ordinary face, but skin sanded and the grey temples largely missing, both explicit brief items. |
| C | `gpt_image_2` @ high/4k | 11 | 2160x3840 | Ordinary *and* textured, greys present, native 4K. Reads slightly lean. |

**Keith picked A.** That lands the pipeline where the storyboard originally recommended, and **it settles §5a: no ruling on the GPT Image 2 instruction is owed**, because his choice here is the ruling. The whole bake-off cost 14.12 credits, less than the round trip it replaced.

**2. Compliance: proceed to sheets, pre-flight before clips.** Keith's call, 2026-09-09. Recorded above.

---

## Rejections at the gates, and why (all four were caught, none shipped)

**a. Dan #1, too handsome and too fit.** `stage1-base/dan-REJECTED-too-handsome-soul_2.png`. Chiselled, styled, visibly athletic, smiling. §2 is explicit that Dan *"is not fitter or better looking. That is the point: the contrast must be internal, not physical, or the ad becomes a fitness ad."* **Cause was a document defect, not a bad roll:** the §6a runbook prompt carried only "not lean and not muscular" (build) and silently dropped the *looks* half of §2's rule. The model filled the gap with its default. Storyboard §6a has been corrected.

**b. Dan #2, overcorrected to gaunt.** `stage1-base/dan-B-soul_2.png`. Hollow-cheeked and drawn, reading *more* knackered than Mark, which inverts the story: Dan's entire function is to be visibly untroubled on the same programme. Fixed by adding "full cheeks, healthy colour, well rested, not gaunt" alongside the not-handsome clause.

**c. Garment brand marks: negation reinforcement, measured.** Prompts phrased as negations ("**no** print, **no** pocket, **no** visible label") produced a mark on **6 of 6** generations: a chest pocket with a red fabricated label reading "MedsIorry"; a pocket plus a corner watermark "PlyPlahe"; a faint hem mark "RAYNE"; and an emblem near the shorts hem on Mark's first sheet. Rewriting the identical requirement as a **positive description of the surface** ("a completely blank plain navy crew-neck cotton t-shirt, smooth uninterrupted single-colour fabric across the entire chest and sleeves, bare unmarked cloth everywhere") came back clean on **3 of 3**, and cleared Mark's shorts on the re-run. `higgsfield-generation` already warned that diffusion models "handle negation poorly and can reinforce the named artefact"; this run measured it. **Note the marks it invents are fabricated brands with garbled lettering. A fabricated brand is still a breach of "unbranded", since the rule is unbranded, not "not someone else's".**

**d. Footwear trade dress: the one that nearly shipped.** Both first-pass sheets rendered running trainers carrying brand trade dress. Dan's had **three side stripes plus a gold tongue tab**, Mark's a swoosh-style side flash. Caught only by cropping the feet at 4-5x; invisible at full-sheet size. This breaks §2 ("no logos or brand marks on any garment, anywhere in the film") **and** §11 ("no identifiable retailer, competitor or premises appears"). Positive phrasing alone did not fix it, because *"running trainer"* carries brand trade dress in the training data by definition. **The fix was to change the garment, not the adjective:** "plain smooth canvas gym plimsolls in a single uniform muted grey, completely smooth blank side panels, plain flat rubber sole, simple flat laces". Both re-runs came back clean.

> **Method note for stage 3 and 4: crop and zoom every garment edge at 4x before approving a frame.** All three garment defects above were invisible at full-sheet size and obvious at 4x. Eyes-on approval of the whole image is not the same as inspecting it.

---

## What stage 2 fixed for free, and why it matters

Dan's approved base (`dan-v1.png`) **carries the red "MedsIorry" pocket label**. That is fine and deliberate: it is the best *face* of the six Dan generations, and §6b re-renders wardrobe entirely from the sheet prompt while matching only the face from the reference. The sheet came back with the pocket and label gone. This is the pipeline working as designed, per §6b: *"This is the stage where a fiddly detail is cheap to remove and the last stage where removing it is free."*

⚠ **Consequence for stage 3, and it is a real one.** §6d attaches the base image as **image two, "a secondary reference for build and wardrobe."** For Dan that reference still has a red brand label on it. Dan's stage-3 identity block must make image two a reference for BUILD ONLY:

> *Image one is the identity reference and the face must match it exactly. Image two is a secondary reference for the face and build only, ignore its clothing entirely. Do not recast. Do not beautify. Do not use either reference as a background or a scene element.*

✅ **This amendment is TESTED, not assumed.** Dan's turnaround was generated with exactly that clause and his labelled base attached as image two, and the red pocket label **did not propagate**: the turnaround came back with a completely blank navy shirt front and back. Use the clause verbatim at stage 3. Still verify the first stage-3 frame at 4x on the chest before queueing the other five.

---

## Superseded files, kept for audit

`stage1-base/`: `mark-B-seedream_v5_pro.png`, `mark-C-gpt_image_2.png` (bake-off losers) · `dan-REJECTED-too-handsome-soul_2.png` · `dan-B-soul_2.png` (gaunt) · `dan-v2.png` (too heavy, watermark artefact) · `dan-v3.png` (hem mark) · `dan-v4/v5/v6.png` (clean garments, weaker faces; v4 used for the sheet A/B)

`stage2-sheets/`: `mark-sheet-seedream_v5_pro.png` (shorts emblem) · `mark-sheet-v2-seedream_v5_pro.png` (shorts clean, trainer flash) · `dan-sheet-from-v1.png` (three-stripe trainers) · `dan-sheet-from-v4.png` (three-stripe trainers, and Dan visibly heavier than Mark, breaking "similar build")

---

## STAGE 3 COMPLETE, 2026-09-09. All six frames approved.

9:16, 2K, 1536x2720, `seedream_v5_pro`. Spend for stage 3: **24 credits** (209.42 → 185.42), covering six frames plus two S6 re-runs.

| Shot | File | `job_id` | References attached |
|---|---|---|---|
| **S1** bedroom, 05:41 | `stage3-frames/S1-bedroom.png` | `ef40d03e-38ea-4211-b0b0-75c27a0faae5` | Mark sheet, Mark base |
| **S2** kitchen, meal prep | `stage3-frames/S2-kitchen.png` | `3f8c2574-74d4-49be-9902-0402a681c367` | Mark sheet, Mark base |
| **S3** gym, mid-set | `stage3-frames/S3-gym-set.png` | `d9651d9a-41d1-4180-91e7-9fb0f55c756b` | Mark sheet, Mark base, **Mark turnaround** |
| **S4** gym, after | `stage3-frames/S4-gym-after.png` | `8a0af45d-df46-40c0-ab47-03e507eff888` | **Mark sheet + Dan sheet** |
| **S5** car park | `stage3-frames/S5-carpark.png` | `ab68c48d-135e-46c9-9eb4-30ea5624aa34` | Mark sheet, Mark base |
| **S6** cupboard | `stage3-frames/S6-cupboard.png` | `fa9e18ed-f2dc-4d18-8bfc-1531cf091f48` | Mark sheet, Mark base |

**S4 held first time, which was the run's main risk.** It is the only frame carrying both identity chains, and the two men came back visibly distinct with no blending. What did it was assigning references to people **by wardrobe colour inside the identity block** ("image one is the SEATED man in the charcoal t-shirt; image two is the STANDING man in the navy t-shirt") rather than by position alone. The §6d fallback of re-running with Dan's sheet as image one was not needed.

**S1's phone rendered a clean, correct `05:41`.** Generated digits usually garble, so this was expected to need compositing and does not.

### What was re-run, and the rule it confirmed

**S6 twice.** The first attempt (`S6-cupboard-REJECTED-labelled-tubs.png`) returned tubs carrying printed label panels, colour bands and ingredient-panel text, from a prompt that asked for "completely blank... bare unmarked surfaces". That is correct positive phrasing, and it failed anyway, because **a retail supplement tub is defined by its label**: the same category-prior trap as the trainers at stage 2. The fix was again to change the noun, not the adjectives: *"tall cylindrical plastic screw-top tubs... **like blank stock containers before any label is applied**"* returned perfectly blank tubs immediately. **Keep the "like X before Y" construction**, which names a real category whose defining property is the absence you want.

The second attempt (`S6-cupboard-altB-boxforeground.png`) had blank tubs but put the white box large and sharp in the foreground, which pre-empts A6's beat: he is meant to set the box down **during** the shot, not have it anchor the opening frame. The approved third run has the cupboard dominant and the box small and heavily defocused in the bottom corner, per §6d.

### S6 went four rounds, and the middle two were my error

The closing shot took four attempts, and the two failures in the middle are the instructive ones because they were **opposite over-corrections of the same constraint**.

1. **Labelled with invented brands.** Printed label panels and colour bands, from a prompt that said "completely blank... bare unmarked surfaces". The category-prior trap: a retail supplement tub is defined by its label.
2. **Blank, and unrecognisable.** Applying the noun-swap fix ("like blank stock containers before any label is applied") produced bare white and black cylinders that could have held flour. Compliant and **useless to the story**, since the beat is a man reaching for his supplements. Keith caught it. **The rule is unbranded, not unrecognisable**, and the naive fix collapses the two.
3. **Blank labels on recognisable bottles.** Amber glass, white child-proof caps, visible capsules, blank white label panels. Category legible, brand absent. Better, but Keith's read was that blank labels look wrong, which they do: real bottles carry printing.
4. 🟢 **APPROVED: printed labels, no brands.** Proper label anatomy (bold name, secondary line, rule, fine print) reading VITAMIN D3, OMEGA 3, MAGNESIUM, MULTIVITAMIN, VITAMIN C. All five verified correctly spelled at 2.4x. The fine print resolves to texture rather than words, which is both what real fine print does at that focus and what stops the model inventing a brand inside it.

**The resolution worth keeping: §11's rule is about BRANDS, not about printing.** Printed labels naming ordinary supplement categories carry no brand, denigrate no identifiable competitor, and look real. The label set was chosen to satisfy the silent-ingredient rule in `03_compliance/CONTEXT.md` Special Cases by naming nothing it covers.

**And one of the names is doing story work.** A **VITAMIN D3** bottle on the shelf is a marker Kit 2 measures: he is already supplementing it without knowing his level, which is the film's argument sitting in the set dressing rather than in a caption.

⚠ **Legible label text raised the stage-4 risk and the durational constraint held it.** Blank labels were trivially safe across five seconds; readable type is where these models warp. The A6 prompt names each word and requires that no letters shift, and the clip was verified frame by frame at 0.2s, 1.0s and 1.8s: **all five names stayed crisp and correctly spelled through to the focus pull.** Keep that wording if the shot is ever re-run.

### Two carried notes for stage 4

⚠ **S3's weight plate is cleared by defocus, not by absence.** The plate carries embossed lettering that is illegible only because it sits in the shallow-focus foreground. If a stage-4 clip pulls focus or moves the camera toward the plate, it needs re-checking at 4x.

⚠ **S2 has a printed food packet at the right edge of frame.** Illegible and croppable, but it is visibly branded packaging and should be cropped or defocused in the edit rather than left to chance.

---

## Compliance pre-flight, run 2026-09-09

**Verdict: NOT APPROVED. `amber-ewa`.** Deterministic floor clean; four judgement items outstanding, three for Ewa and one for Keith.

**Scanner.** Shippable copy scanned as its own unit per step 2a: **0 HARD / 0 REVIEW**. The whole storyboard initially returned 4 HARD / 8 REVIEW, all apparatus. Three were false positives, each a red-flag word used in an ordinary English sense in craft commentary: one about regarding a vendor claim as a hypothesis, one a **crop percentage** read as a savings claim, and one inside a note explaining that the copy uses the table's own approved alternative. **The fourth was a real regression**: §11 named the silent ingredient inside a prohibition list, which `03_compliance/CONTEXT.md` explicitly forbids and flags as a pattern that must never recur. Rewritten to allowlist form. After that plus vocabulary substitutions in commentary, the whole document scans **0/0, exit 0**.

**🟠 For Ewa.**
1. **The elimination structure is the asset's load-bearing move.** "Same programme as the bloke next to him" and "Same programme as me, mate. Same food." argue by elimination that the variable is internal and measurable. §11 asserts no claim is made that the test explains the tiredness, but implication-by-elimination is still implication. Ewa to rule on whether it clears.
2. **"You alright? You've gone grey."** Pallor is a recognised sign of anaemia and **ferritin is one of Kit 2's four markers**, so a layperson's remark about appearance sits inside a film resolving to a ferritin-inclusive panel. The mitigation is that the film's answer is "test", never a condition.
3. **The three §12 AI-actor items**, all still **UNROUTED**: founder disclosure has no translation for a film with no founder on camera; AI-actor platform labelling; and the rule that this man is never captioned or implied to be a real customer or a real result. A ClickUp search on 2026-09-09 found no existing ask, so no request reference exists for any of them.

**🟠 For Keith (business, not clinical).**
4. **The end card names a product that does not exist under that name.** It reads "Men's Energy & Recovery Check"; `09_website-app/frontend/lib/pricing.ts` has `KIT_2.name = 'Energy & Recovery Check'` at £119, and the live kit page uses the same. Either the card matches the product or the product is renamed everywhere. An end card is where the product is identified, so this is a factual claim, not a styling choice.

**🟢 Passed.** No ingredient named and no EFSA claim made anywhere. Phase 0 boundary held: no clinical service, prescribing or confirmatory testing implied. No low-testosterone inference; the film never mentions testosterone and Kit 2's markers are Vitamin D, Active B12, hs-CRP and Ferritin. Kit scoping correct: tiredness and recovery are Kit 2's territory, not Kit 1's. No number appears on screen, so nothing can contradict the results engine. No founding-member language. Kit 2 verified live and purchasable at £119. Supplement tubs unbranded, and the cupboard is closed rather than the tubs binned, which keeps the film clear of denigrating an identifiable competitor and of a message that would work against the Daily Stack. Target emotion is recognition, not health anxiety.

⚠ **This pre-flight cannot write `green`, on its own rules.** Invariant 7 bars the agent that authored copy from clearing it, and this session edited §5, §5d, §6a, §6b, §6b-ii and §11 of the target. An independent pass is required before any `green`. The verdict is therefore **`amber-ewa`** regardless of how the remaining items land.

**Database row: NOT written.** The storyboard is not itself a `content_assets` asset file (it sits in `content-machine/`, not `content-machine/assets/`), so step 6 does not apply. Recorded here instead.

---

## Next: stage 4

⛔ **Blocked on the four items above.** Items 1 to 3 need Ewa and none has been routed; item 4 needs Keith and costs one decision. Stage 4 is `seedance_2_5`, `mode: omni_reference`, 9:16, 720p, 5s per shot, and **`generate_audio: false` set explicitly on every call** because it defaults to true. Per §5d, generate one clip first and read its cost from the completed job before queueing the other five: video cost is the one figure `get_cost` cannot settle for us.

---

## STAGE 4 / A6: the closing shot, 2026-09-09 (late session)

> 🔴 **This section exists because the hour of A6 work before it was recorded NOWHERE.** Four
> artefacts sat on disk with no `job_id`, no prompt and no rationale, and a repo-wide grep for
> `S6b` returned zero hits in any document. The media is gitignored on the promise that "the log
> carries every job_id, so any frame or clip is re-fetchable" — **so a gap in this log is not
> documentation debt, it is data loss.** Those four were recovered only from Higgsfield's own
> generation history, and every mapping below was then verified by exact byte size against the
> file on disk rather than inferred from a filename.
>
> Two fixes landed with this section. **Every asset now carries a `.json` recipe sidecar beside
> it** (`<file>.json`: job_id, model, references, verification, status). And **`.gitignore` was
> changed to ignore the media by EXTENSION rather than by directory** — the old
> `kit2-same-programme/*/` excluded the directories, and git cannot re-include a file whose
> parent directory is excluded, so it was silently swallowing the sidecars too. The recipe would
> have been lost with the media it exists to recover.

### ⚠ Correction to the stage 3 table above: S6's `job_id` is wrong

The table records S6 as `fa9e18ed-f2dc-4d18-8bfc-1531cf091f48`. The file actually on disk at
`stage3-frames/S6-cupboard.png` is **`247bbe41-5db4-4a66-ad83-6b480abbb30d`** (verified, 6,659,068
bytes exact). The frame was re-run at 20:51 and the new output replaced the file without the row
being updated. The recipe and the media had diverged silently, and nothing detected it.

### The A6 lineage, recovered and verified

| File | `job_id` | Res | Verdict |
|---|---|---|---|
| `A6-superseded-blank-labels.mp4` | `25269434-038b-4498-b1d7-816453cc94ca` | 720p | Superseded. Blank labels; compliant but unrecognisable as supplements |
| `A6-superseded-blankbox.mp4` | `2439106f-007c-4f24-94f1-dabc3f241407` | 720p | Superseded on framing. Printed labels, blank box: compliance-correct |
| `A6-cupboard.mp4` | `30348f63-00e5-4dd7-9b60-a4bbdc75223a` | 720p | 🔴 **REJECTED — garbled pack. Do not ship** |
| `A6-continuous-blank-1080p.mp4` | `ba0acc2d-0f2a-4e70-bbe7-220b68de62a4` | 1080p | 🟢 **APPROVED** — replaces `A6-cupboard.mp4` |
| `A6b-counter-blank-1080p.mp4` | `8754acc5-3cd0-4655-b74d-c36a3a3c361a` | 1080p | 🟢 **APPROVED** — locked-off counter plate |

Frames: `S6b-counter-pack.png` = `53db409e` (superseded, carries the rendered pack);
`S6b-counter-blank.png` = `c2e49fd3` (superseded, wrong box geometry);
**`S6b-counter-blank-twin.png` = `d5d9a72d`** (approved plate, 4K).

### 🔴 A6-cupboard.mp4 is the proof that §3's blank-box rule is load-bearing

It was generated with the **packed** counter frame as `end_image`, so the model had to render our
real pack through a camera move. §3 predicts precisely this and calls it "a product
misrepresentation, not a cosmetic error". What came back, read at zoom on the final frame:

- `NMOL/L` → **`NAIL/L`**
- `PMOL/L` → **`PMIL/L`**
- `AT-HOME BLOOD TEST · ENERGY & RECOVERY` → **`AT-HBME BLODD TEST · ENEAGY & RECOVEBY`**
- `Your levels, not your programme.` → mush

Only the large serif headline and the AP monogram survived. **Garbled units on a medical-device
pack in a health ad.** The rule was right and the departure produced exactly the predicted defect.

### The fix was one substitution, not a re-prompt

`S6b-counter-blank-twin.png` was made by **erasing the print off the packed frame** rather than
generating a blank box from scratch — which is why its geometry matches the real pack exactly: it
*is* the same box, wiped. The earlier from-scratch attempt (`c2e49fd3`) came back with a tall,
deep, portrait box; the real AP-E02 is a shallow landscape mailer.

**Technique worth keeping: when a compositing plate has to match a real product, de-brand a shot
of the product rather than generating a blank one. Erasure preserves geometry; generation
re-invents it.**

`A6-continuous-blank-1080p.mp4` is then the rejected clip's own recipe with a single field
changed — `end_image` swapped from the packed frame to the blank plate. Same start frame, same
structure, blank box throughout.

### Verification (both approved clips)

Box face read at ~2.4x with contrast stretched: clean bone card, no printing, no ghost of the
erased artwork, no invented type. Bottle labels `VITAMIN D3`, `OMEGA 3`, `MAGNESIUM`,
`MULTIVITAMIN`, `VITAMIN C` all correctly spelled, fine print resolving to texture. Hands
connected, one person, one pair of hands, no unrequested slow motion. For the locked plate, the
box region measured **1.63/255 mean absolute difference between first and last frame** — that is
film grain, not movement, which is what makes it a single-corner-pin composite with no tracking.

### ⚠ One open deviation for Keith

`seedance_2_5` renders `start_image` + `end_image` as a **hard cut**, not as one continuous move.
Storyboard §7c asks A6 to be a single continuous shot with a rack focus, and §7c defends that
choice explicitly. So there are two shapes on the table and it is a creative call, not a technical
one:

- **Accept the cut** — `A6-continuous-blank-1080p.mp4` alone, cupboard then counter.
- **Cut deliberately** — the cupboard half of the continuous clip, then `A6b-counter-blank-1080p.mp4`,
  which is locked off and holds. Costs an edit decision, gains a cleaner composite and a proper hold.

Neither is shippable until the pack is composited in post, and neither changes the four items
already blocking the film.

**Stage 4 spend this session: 90 credits** (2 x 45, `seedance_2_5` 1080p / 5s / `bitrate_mode: high`).

⚠ **Correction to §5, §5d and the "Next: stage 4" note below: `get_cost` DOES settle video
cost.** All three say video is the one figure a preflight cannot price and mandate generating a
test clip to find out. It is not true — `generate_video` takes `get_cost: true` exactly as the
image tools do, and returned `seedance_2_5` at 9:16 / 5s / audio-off as **32.5 credits at 720p**
and **45 at 1080p with high bitrate**, submitting nothing. The gate cost a full-price clip per run
to discover a number that is free.

---

## A7: the letterbox arrival, a candidate NEW locked ending (2026-09-09)

**Keith chose it on 2026-09-09** from five options put to him after A6's pack-render failure. It is
offered as a replacement for the closing beat, not an addition.

**Why this one, on its merits rather than as a workaround.** It dramatises the flat mail packer,
which `02_brand/STATE.md` records as the whole reason for that pack format: the 65 mm front reads
flat, it posts as a large letter, and on a monthly subscription that compounds twelve times a year
and removes missed deliveries. Nothing has to be said for the shot to say it. It also carries the
product with **no person in frame**, which is what makes it repeatable as a locked ending across
every episode: §13's cold opens vary, this does not, and no episode needs a new performance to
close.

| Asset | `job_id` | Note |
|---|---|---|
| `stage3-frames/S7-letterbox-landed.png` | `fbf10cac-c8be-49e2-9448-e04a633fad05` | End frame, and the composite reference |
| `stage3-frames/S7-letterbox-drop-matched.png` | `b61060f0-10b4-4c2e-8cfa-f716f24d546f` | Start frame, an EDIT of the above |
| `stage3-frames/S7-letterbox-drop.png` | `472fb10e-7d53-4341-aa19-9ee2559c7bcb` | ⛔ Superseded, camera did not match |
| `stage4-clips/A7-letterbox-blank-1080p.mp4` | `b1e9947c-f9d4-4820-8f84-bed3a2f8749c` | 🟢 The clip. 1080p, blank box, 45 credits |

### 🔴 The frame pair had to be EDITED into agreement, not prompted into it

Both frames were first generated in one batch from prompts that were roughly 95% character-identical
— same hallway, same door, same "camera at standing head height looking down and forward", same mat,
same lens block. **They came back with completely different camera positions**: letterbox centred at
top versus off to the right, mat square-on versus raking away. As a start/end pair that drives a
whipping camera move, not a vertical drop.

The fix was to stop generating the second frame and **edit the approved one** instead: hold every
invariant explicitly, then make exactly two changes (empty the mat, put the box through the slot).
The camera is then inherited rather than re-described.

**This is the second time in two sessions that the same manoeuvre was the answer.** The approved
counter plate (`S6b-counter-blank-twin`) exists because the print was *erased off* a shot of the
packed box; the from-scratch blank (`c2e49fd3`), given a careful description, returned a tall deep
portrait box when the real product is a shallow landscape mailer.

> **Rule worth carrying: a shared prompt is a shared DESCRIPTION, not a shared RESULT.** Anything a
> prompt does not pin down is re-sampled on every generation, and the properties that matter for
> continuity — camera position, object geometry, how the light falls — are exactly the spatial ones
> prose is worst at constraining. Where two artefacts must agree, generate one, approve it, and
> produce the other as an edit of it. The edit costs the same as the generation, so there is no
> reason to gamble on agreement.

### The composite window, measured rather than eyeballed

| Frames | What happens |
|---|---|
| 1-33 | Box slides out of the slot and falls |
| 33-35 | Landing impact |
| 46-55 | Final settle, box drops 8 px into the coir |
| **55-121** | **Static hold, 2.75 s** |

Across every sample from f55 to f121 the box face is **pixel-identical**: 788 x 460 px centred at
(642, 1090) in the 1080x1920 master. **Single corner-pin, no motion tracking.**

⚠ **And a correction worth recording, because the failure was mine and it is repeatable.** A
four-frame contact strip *looked* like a slow camera drift, and that read was reported before it was
measured. Tracking the box's bounding box showed zero drift: 0 px horizontally, 0% size change. **A
contact strip is not evidence about motion** — separate tiles cannot be compared by eye for
sub-percent movement, and the same §5d rule that bans judging a garment from a scaled sheet applies
to judging motion from one. Measure it.

A motion spike at f91 is confined to the top band of frame and is the letterbox flap settling. The
box region is unaffected.

### Edit notes

Trim the head: the first ~15 frames are a slow slide out of the slot, and starting nearer the tip
point makes the drop land harder. The fall itself completes in about 1.4 s, mildly slower than real
gravity, so §9.1's "cut any slow motion the model added" applies lightly — a 1.3 to 1.5x retime over
frames 1-45 with the hold untouched. Sound follows §8's logic: the flap snap, then one contact as
the box lands on coir, and **no sting on the product**.

### Status

🟢 Plate approved and verified. 🟠 **The creative decision is Keith's and is not made**: adopting
this as the locked ending changes §1's format rule, which currently fixes the box arriving under
"Test first" in the kitchen. §1 is explicit that a locked ending is inherited by every episode, so
this is a series-level change, not a shot swap. ⛔ Not cleared to ship: the four pre-flight items
still block the film and this shot changes none of them. It introduces a front door and a doormat
but no person, no premises identifier and no claim.

**Spend: 45 credits for the clip, 33 for the three frames (2 x 11 generated, 1 x 11 edited). 78 total.**
