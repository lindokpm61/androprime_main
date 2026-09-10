# "Same Programme" — Kit 2 short-form, two storyboards for AI video generation

**Created:** 2026-09-09 | **Owner:** Keith | **Status:** 🟠 DRAFT. **Pre-flight RUN 2026-09-09, verdict `amber-ewa`. Stages 1 to 4 are generated; nothing is cleared to ship.**

> **Stages 1 to 4 complete, 2026-09-09.** Both character sheets, both 360 turnarounds, all six starting frames and all six Version A clips exist. **Five passed their gates. A6 did not, and this line previously claimed it had.** The A6 take of that moment (`A6-cupboard.mp4`, job `30348f63`) was generated with our real pack rendered by the model and it **garbled the pack**: `NMOL/L` came back as `NAIL/L`, `PMOL/L` as `PMIL/L`, `AT-HOME BLOOD TEST` as `AT-HBME BLODD TEST`. That is §3's predicted failure, and §3's blank-box rule is therefore confirmed rather than cautionary. **Two approved replacements now exist**, both 1080p with a blank box throughout for compositing: `A6-continuous-blank-1080p.mp4` (`ba0acc2d`) and the locked-off counter plate `A6b-counter-blank-1080p.mp4` (`8754acc5`). One open creative call between them is recorded in the log. Files, `job_id`s, every rejection and the compliance pre-flight in full are recorded in **[`2026-09-09-kit2-same-programme-production-log.md`](2026-09-09-kit2-same-programme-production-log.md)**, which is the status store for this plan: read it before resuming. Spend to date roughly **300 credits**. **The media itself is deliberately not in git** (gate D3: git holds the recipe, Drive holds the media); the log carries every `job_id`, so any frame or clip is re-fetchable.
>
> ⛔ **Four items block SHIPPING, and generating is not one of them.** The shippable copy scans 0 HARD / 0 REVIEW and the whole document now scans 0/0, but the judgement pass raised three items for Ewa (the elimination structure; the "gone grey" line against the ferritin marker; the three §12 AI-actor rulings) and one for Keith (**the end card names "Men's Energy & Recovery Check"; the product is "Energy & Recovery Check"**). All four are now routed on the Approvals & Sign-offs board. Detail and reasoning in the production log.
>
> ⚠ **Version B is NOT generated, deliberately.** Its dialogue is Ewa item 2, so it waits on her ruling rather than being shot and then re-cut.
**Product:** Kit 2, Men's Energy & Recovery Check, £119. Markers: Vitamin D (25-OH), Active B12 (holoTC), hs-CRP, Ferritin.
**Written to:** `avatar-mark.md` (Mark, 44), `hook-playbook.md` §2 and §4, `script-playbook.md`, `03_compliance/CONTEXT.md`, `.claude/skills/higgsfield-generation/SKILL.md`.
**New content type:** this is the first asset in the repo built around **AI-generated actors rather than Keith on camera.** Section 12 records what that breaks in the existing rails. Read it before shooting anything.

**Revised 2026-09-09 (second pass):** sections 5 to 9 are new or rewritten. They fold in a production method for photoreal AI video (reference-first pipeline, imperfection engine, director-style prompting, sound design, edit pass) and replace the thin model note that was §5. **Every model id, mode and parameter below was verified against the live Higgsfield catalogue on 2026-09-09**, and that check corrected a real error in the previous draft. See §14 for what was verified, what was corrected, and which claims are still somebody's opinion.

---

## 1. The format, and the one rule that governs it

Keith's premise, 2026-09-09: a repeatable series where the cold open varies and the closing beat is locked. Man in a relatable scenario, resolving to the blood test and the Kit 2 box.

**The locked ending is "test first", not "here is the answer".** Kit 2 is the measurement, not the solution. This is the whole rule, and it matters more in a format than in a one-off, because a locked ending is inherited by every episode: a claim baked into the grammar of the series passes pre-flight one script at a time while the series as a whole drifts. The box comes into frame under the words **"Test first"** and **"Find out what your levels are"**, and the second of those is the red-flag table's own approved alternative for the medical-act phrasing it replaces. Nothing on screen says the test resolves the tiredness.

**Target emotion (both versions): recognition and relief.** Not fear. `script-playbook.md` Step 4 bars driving health anxiety to sell, and this concept does not need it: the pull is being seen, not being scared.

**Archetype:** Contrarian (consensus says train harder and eat cleaner; the variable is one you cannot see), with Magician stacked as the silent cold open.

**Head fake:** the viewer predicts a discipline story and gets a measurement story. The clues are planted in advance, which is what makes it land rather than confuse: every shot before the turn shows a man doing everything correctly.

---

## 2. Character bible (lock this before generating a single frame)

Consistency across shots is the hard part of AI video, and it is won at the reference-image stage, not in the video prompts. Generate one hero still of Mark, approve it, then carry it into every clip as the reference. Same for Dan. The mechanics of that are §6.

**MARK, 44.** UK. Operations manager. The avatar, unchanged.
- Build: ordinary. Trains, but is not lean or built. Slight softness at the waist. This is deliberate: a shredded actor breaks the story.
- Face: short dark hair going grey at the temples, two-day stubble, tired around the eyes, slight shadow under them.
- Wardrobe: plain charcoal cotton t-shirt, black training shorts, worn trainers. **No logos or brand marks on any garment, anywhere in the film.**
- Register: contained. He is not miserable and he does not sigh at the camera. He is a competent man quietly running out of road.

**DAN, mid-40s.** The training partner. Second character, used sparingly.
- Similar age and similar build, visibly unbothered. He is not fitter or better looking. That is the point: the contrast must be internal, not physical, or the ad becomes a fitness ad.
- Wardrobe: navy t-shirt, grey shorts. Unbranded.

**Sets:** a British bedroom before dawn, an ordinary British domestic kitchen, a plain commercial gym floor, a daytime car park. Nothing aspirational. No glass-walled boutique gym.

**Grade:** muted, cool, slightly desaturated. Handheld with light grain. Documentary realism, not commercial gloss. The look should feel like something a mate filmed.

### 2a. 🔴 The imperfection rule, and why it is a production requirement rather than a taste note

**A generated face fails by being too good, not by being too rough.** The failure mode has a name, the uncanny valley: a face reads as human up to a point, and past that point the remaining error reads as *wrong* rather than as *stylised*. Symmetry, poreless skin, even skin tone and a flawless hairline are what push it over. So realism here is not a quality setting to turn up. It is a set of imperfections that have to be **asked for explicitly**, because every image model's default is to remove them.

This is not a fringe opinion. Higgsfield's own bundled `character-sheet` workflow carries it as a named module — its "anti-AI realism engine" specifies visible pores, natural asymmetry, uneven tone, matte rather than dewy skin, and "no beauty filter, no AI-airbrushed look" — and it makes the module **mandatory, not optional**, on any photoreal preset. That workflow also carries a second rule that matters for Mark at 44: *avoid babyface and youthful rounded proportions for adult characters*, and specify mature bone structure instead. Both are reproduced in the reference prompt in §6.

**The imperfection set for Mark**, to be carried verbatim into the hero still and the character sheet:

> visible fine skin texture with natural pores, slight asymmetry between the two sides of the face, uneven skin tone across the cheeks and forehead, faint broken capillaries at the nose, two-day stubble growing unevenly with a patch at the jaw, shallow lines at the corners of the eyes and across the forehead, faint shadow under both eyes, hairline receded slightly at the temples with individual grey hairs rather than an even grey wash, matte skin with no sheen and no highlight blooms, no digital smoothing, no beauty filter, no airbrushing, no glossy or plastic skin, mature adult bone structure with a defined rather than soft-round jaw, not youthful, not idealised

⚠ **This is also the compliance-safe direction, which is convenient but not the reason.** An idealised man beside tiredness copy edges toward an aspirational-transformation read; an ordinary knackered 44-year-old does not. Where the craft and the compliance point the same way, take the win, but note that the craft argument stands on its own.

### 2b. Strip the small stuff out of the reference

**Anything small, fiddly or high-frequency in the reference will degrade across a video generation, and can drag the character's identity with it.** A small hat, a lanyard, a watch face, a drawstring, a chest logo, a printed graphic, jewellery, a visible zip pull: the model has to re-solve each of them every frame, it will not solve them the same way twice, and the error budget it spends there is taken from the face.

So the reference stills are built **deliberately plainer than the finished shot needs to be**:

- Plain charcoal crew-neck t-shirt. No pocket, no print, no visible label, no contrast stitching.
- No watch, no wristband, no ring, no chain, no glasses.
- Hair short and unstyled. No cap, no headband.
- Trainers worn but plain, and kept out of the character-sheet close-up entirely.

This dovetails with the existing unbranded rule in §2 but is a different constraint with a different reason: that one is legal, this one is mechanical. Both apply.

---

## 3. VERSION A — no dialogue (recommended primary)

Six shots, roughly 31 seconds. Sound is ambience and a sparse music bed added in the edit, no generated speech. **This is the version I would make first:** it carries no lip sync risk, no accent risk, and no line that could be misheard as a claim.

| # | Sec | Frame | On-screen text |
|---|---|---|---|
| A1 | 0-5 | Dark bedroom before dawn. Close on a phone screen reading 05:41. A hand silences it. Pull wider: Mark is already awake on his back, eyes open, staring at the ceiling. | **He's doing everything right.** |
| A2 | 5-10 | Kitchen, still dark, single overhead light. Meal-prep containers on the counter, chicken and rice. He clips the lids on and stacks them into a kit bag by the door. | *(none)* |
| A3 | 10-15 | Gym floor. Mid-set, controlled, genuine effort, sweat at the hairline. He racks the bar and holds still for a second longer than he should. | *(none)* |
| A4 | 15-20 | Same gym, after. Dan claps him once on the shoulder, says something we do not hear, swings his bag up and walks out easily. Mark stays sitting on the bench, forearms on his knees, head down. | **Same programme as the bloke next to him.** |
| A5 | 20-25 | Car park, bright early-afternoon daylight. Mark in the driver's seat, keys in his hand, car not started. Head back against the rest, eyes shut. | **Still gone by two.** |
| A6 | 25-31 | Home kitchen, daylight. A cupboard opens onto a shelf of unbranded supplement tubs. His hand goes up, hesitates, closes the cupboard. He sets the Kit 2 box on the counter instead. Hold on the box. | **Test first.** → end card |

**End card:** Andro Prime wordmark · *Men's Energy & Recovery Check* · **Find out what your levels are.**

**Why A6 is built the way it is.** He closes the cupboard, he does not bin the tubs. The order is test then supplement, never test instead of supplement, because we will be selling the Daily Stack into this same audience within months and a clip whose punchline is "supplements are pointless" becomes a hostage against our own product. The tubs are unbranded and generic so nothing on screen denigrates an identifiable competitor, which is a CAP 3.42 exposure as well as a legal one.

### Where the prompts live

**Every prompt for this film is in §6, in the order it is run.** They are not repeated here, deliberately: the storyboard above is the creative document and §6 is the runbook, and two copies of a prompt is how one of them goes stale.

What §6 contains, per shot: a **starting-frame** prompt (stage 3, a still) and then a **clip** prompt (stage 4, the movement). That split is the method. A video prompt written without a generated starting frame in front of it is a guess about six things at once.

**A6 note, and it is a compliance point rather than a craft one:** generate the shot with a **blank white box** and composite the real Kit 2 packaging in post. Asking a video model to render our actual box is the single most likely way to end up with a plausible but wrong pack, and a wrong pack in a health ad is a product misrepresentation, not a cosmetic error. The same rule covers the wordmark and every word of on-screen type.
---

## 4. VERSION B — with dialogue

Same spine. The turn is carried by Dan instead of by a text card. Twenty-four spoken words in total, which is deliberate: short lines are where AI lip sync still holds up.

**B1.** Gym, end of session. Dan racking plates, Mark sitting.
> **DAN:** "You alright? You've gone grey."
> **MARK:** "Yeah. Just knackered."

**B2.** Dan picks up his bag.
> **DAN:** "You've been knackered since March."
>
> *(Mark half-laughs. Says nothing.)*

**B3.** Dan at the door, turning back.
> **DAN:** "Same programme as me, mate. Same food."
> **MARK:** "I know."

**B4.** Car park. Mark in the driver's seat, keys in hand, car not started. No dialogue.

**B5.** Kitchen. The cupboard of tubs. His hand goes up, hesitates, closes it.

**B6.** He sets the Kit 2 box on the counter. Hold.
> **Text:** **Same programme. So what's different?** → end card

**End card:** as Version A.

**Why the closing line is a question.** "Same programme, different levels" is the sharper line and it is almost verbatim Kit 2's locked narrative, *your levels, not your programme*. It also asserts that his levels are different, which is a statement about a man who has not been tested. The question form keeps the whole film on the right side of the line: it poses, and the product answers. Flag both versions to pre-flight and let the stricter one win.

**Compliance read on the dialogue.** No character states or implies a diagnosis. Nobody says low anything. Neither man is a healthcare professional, which keeps this clear of the implied clinical endorsement problem that sank the pharmacy-assistant version of the concept. "Same programme, same food" does the work by elimination without anyone claiming what the variable is.

### 4a. Directing the dialogue, rather than typing the lines

A line typed on its own gets read flat, and flat delivery on a real-looking face is where the uncanny valley bites hardest. The method that corrects it is to write each beat as a **director's block in three parts** rather than as script text: where we are and who is present, what actually happens, and what the frame looks like when it ends. The model is being told how the scene plays, not just what is said.

**Block shape, per clip:**

```
STAGE      where we are, who is in frame, who is not, the light
EVENT      what happens, in order, including who speaks first,
           the pauses, and what the face does between the words
END STATE  what the frame looks like on the last held beat
[DIALOGUE] the exact line, and nothing but the line
```

**B1, written as a directed block:**

> **STAGE.** A plain commercial gym floor at the end of a session, no signage. Two men in their forties. One stands at a rack sliding weight plates off a barbell; the other sits on a bench a few feet away, forearms on his knees. Nobody else is in frame. Flat overhead gym light.
>
> **EVENT.** The standing man lifts a plate off the bar, glances across at the seated man, and pauses with the plate still in his hands. He speaks first, level and unbothered, more observation than concern. The seated man does not lift his head immediately. He answers after a beat, short, closing the subject rather than opening it, and looks back down at the floor before the line has finished landing.
>
> **END STATE.** The standing man is still holding the plate, half-turned toward the bench. The seated man is looking at the floor. Neither is looking at the other.

**Accents are specified, never named.** "Add a UK accent" produces an impression of one. What produces a usable read is naming the speaker, placing him, and setting his pace, energy and state before the line:

> **DAN.** English, Midlands, unhurried. Ordinary speaking voice, no performance, no comedic broadness. Low energy, mid-session tiredness, entirely relaxed. He is not worried about his mate; he is making conversation while racking plates. Slight downward inflection at the end of the sentence.
>
> **MARK.** English, same region, quieter and flatter than Dan. Speaks on an out-breath. The second word is shorter than the first.

⚠ **This is where the previous draft's own warning gets its remedy.** §5 already said that a UK accent landing in the uncanny valley does more brand damage than the dialogue version earns. The accent spec above is the mitigation, and §5c gives the architecture that removes the risk almost entirely by not asking a video model to invent the voice at all.

**Bracket convention.** Seedance-family prompts distinguish spoken lines from sound by symbol, so keep the three separate and never let a spoken line sit loose in the prose:

| Wrapper | Carries |
|---|---|
| `[square brackets]` | spoken dialogue, exact words only |
| `(round brackets)` | music or score |
| `**asterisks**` | sound effects and ambience |

---

## 5. The generation pipeline

**Balance after the stage 1 + 2 run: 215.42 credits, Pro plan (verified 2026-09-09).** Stages 1 and 2 cost **33.08 credits** in total, including every rejected generation.

✅ **Image cost is now verified, and it did not need a test job.** `get_cost: true` returns the credit cost **without submitting anything**, so any image-stage cost flagged as unverified is resolved for free: `soul_2` @ 9:16 2k = **0.12**, `seedream_v5_pro` @ 16:9 2k = **3**, `gpt_image_2` @ high/4k = **11**. Only **video** cost still needs a real test job, because it varies with duration and resolution. The earlier instruction to verify cost "against one test clip" was right for §5b and wrong for §§6a to 6d.

**The architecture matters more than the model.** Character consistency is won by generating one approved hero still per character and carrying it into every clip as an identity reference. Do not generate six shots from six text prompts and hope the same man comes back.

### 5a. The order, and why it is this order

Four stages. Each one exists because the stage after it is worse at that job.

| # | Stage | Model | Why this one |
|---|---|---|---|
| 1 | **Hero still** — one photoreal frame of Mark's face and build | `soul_2` (Higgsfield Soul 2.0) | Built for realistic character and portrait work, and it is the strongest available at putting human imperfection into a face rather than sanding it off. ⚠ **Max 1 reference image** (verified), so it can start the chain but cannot do stage 3. |
| 2 | **Character sheet** — full body plus close-up, one sheet, 16:9, 2K | `seedream_v5_pro` (Seedream 5.0 Pro) | Sharper and more controllable than the alternatives for a multi-view layout, takes **multiple** `image_references`, and offers 16:9 and a 2K tier natively (all verified). |
| 3 | **Start frames** — the first frame of each of the six shots, 9:16 | `seedream_v5_pro`, sheet + hero still both attached | Two references beat one for identity. The sheet carries the face, the hero still carries the build and the wardrobe. |
| 4 | **Video** — six clips | `seedance_2_5`, `mode: omni_reference` | Takes true image references rather than only a start frame, which is what actually holds a face across a clip. |

**Why not run the whole thing from GPT Image 2.** ✅ **SETTLED 2026-09-09. Keith chose `soul_2`, on the images, and no ruling is outstanding.** Rather than ask him to adjudicate a vendor-sponsored claim from a description, all three candidates were priced with `get_cost: true` and run on the identical §6a prompt for 14.12 credits total: `soul_2` (0.12) gave the strongest skin, with real broken capillaries, uneven tone and greys through the stubble, but the most conventionally handsome face; `seedream_v5_pro` (3) gave the most ordinary face but sanded the skin and dropped the grey temples, both explicit brief items; `gpt_image_2` at high/4k (11) was ordinary and textured with native 4K, but read slightly lean. **Keith picked Soul.** The standing GPT Image 2 instruction is not overridden here, it is superseded for this asset by his own choice on the output. The paragraph below is kept because its mechanical findings about `gpt_image_2` remain true and will matter the next time the question comes up.

⚠ **The general lesson, worth carrying to the next escalation: price the experiment before escalating the decision.** A round trip to Keith cost more than the fourteen credits that answered the question with pictures.

The argument for moving off it is mechanical rather than aesthetic. `gpt_image_2` defaults to **`quality: low` and `resolution: 1k`** (verified in the catalogue). A character sheet generated on defaults is therefore a low-quality 1K image, and a soft 1K sheet used as the identity reference for six video clips propagates its softness into every one of them. It can be raised to `quality: high, resolution: 4k`, at cost, and if Keith wants the pipeline kept on one model that is the way to do it. Two further facts either way: `gpt_image_2` exposes no `auto` aspect ratio, so it **snaps and stretches** any source geometry not on its list (the aspect trap in `higgsfield-generation`), and its media role is `image`, not `image_references`.

⚠ **And the source of the recommendation has an interest.** The production method this section is built from comes from a video **sponsored by Higgsfield**, in which Higgsfield's own Soul model is the one praised for realism. That does not make the observation wrong, and Soul's catalogue entry does describe exactly that specialism, but it is a vendor's own channel recommending the vendor's own model and should be regarded as a hypothesis to test on one frame, not as a benchmark. **The cheap test is two hero stills, one on `soul_2` and one on `seedream_v5_pro`, same prompt, judged side by side at full resolution.** Do that before committing the pipeline.

### 5b. Version A (silent)

**`seedance_2_5`**, `mode: omni_reference`, 9:16, 720p, 5s per shot, **`generate_audio: false`**.

⚠ **`generate_audio` defaults to `true` on this model** (verified), so leaving it unset gets a soundtrack nobody asked for on a version whose whole premise is that the edit carries the bed. This is a required parameter, not a preference.

### 5c. Version B (dialogue) — generate silent, then lip-sync

> ⚠ **Correction, 2026-09-09 (second pass), of a correction.** An earlier revision of this section stated in red that **"there is no Wan 2.7"** and retired it as a hallucinated model. **That is wrong, and it has been re-checked.** A direct `models_explore` `get` on `wan2_7` returns the model: *"Wan 2.7"*, provider Wan, description **"Synchronized audio, character-consistent video"**, roles `start_image` / `end_image` / `audio_references`, 9:16 among its aspect ratios, 2 to 15s, 720p and 1080p, tagged `audio, character, consistent, sync` and carrying `supports_unlim`. Every capability the first draft claimed for it is real, including the `start_image` role the retraction said it lacked.
>
> **How the wrong correction happened, because it is the more useful half.** The check ran a catalogue search, saw `wan2_6`, did not see `wan2_7`, and converted absence-from-a-result-set into absence-from-the-catalogue. A search returning a neighbour is not evidence that a sibling is missing; only an id lookup that fails is. This is the log's own rule about negative existence claims arriving in a document that was written to be more careful than the thing it was correcting, which is exactly when one gets believed. **For a named artefact, check the artefact, not a query that ought to have contained it.**

**The silent-then-lip-sync route below is still the recommendation**, and it always was the stronger architecture. What changes is that it is now chosen on its merits rather than because the alternative was believed not to exist. `wan2_7` is a live fallback, not a phantom.

**The replacement is a better architecture anyway: generate silent, then lip-sync.**

1. Generate each dialogue clip **silent**, exactly as Version A (`seedance_2_5`, `omni_reference`, `generate_audio: false`). Identity and performance are solved without the voice in play.
2. Produce the voice separately, and control it completely.
3. Marry them with **`sync_so` ("Sync Lipsync 3")**, which takes `input_video` and `input_audio` and has a `sync_mode` for reconciling a duration mismatch (`bounce`, `loop`, `cut_off`, `silence`, `remap`) — all verified.

**Why this is the right shape for this asset specifically.** It removes the accent risk from the model entirely: a generated UK regional accent that lands slightly wrong is a brand problem on a health ad, and the remedy is not a better prompt, it is not asking a video model to invent a voice. It also means the dialogue can be re-cut without re-generating the picture.

**If a single-model route is wanted instead**, the ranked in-catalogue options are `seedance_2_5` with `generate_audio: true` (same model as the picture, one less moving part), then `minimax_h3` (2K, takes `start_image` plus `audio_references`), then `flux_3_video` (start and end frames, synchronised audio, 5 to 20s). All three verified present.

**Production note for Version B: shoot the dialogue in singles.** One character per clip, cutting between them, so lip sync only ever has to hold on one face at a time. Two-handers with both faces in frame are where generated dialogue falls apart.

### 5d. Before any credit is spent

Rules are not followed reliably under load, so run these rather than recall them. This is the `higgsfield-generation` pre-flight, scoped to this asset.

- [ ] ⛔ **`/compliance-preflight` has been run on this document and the §12 rulings are answered. STILL OUTSTANDING, and it is now the gate in front of stage 3.** Keith ruled on 2026-09-09 that stages 1 and 2 could proceed ahead of it, because character sheets carry no claims, no copy, no product and no numbers. That ruling does not extend to any clip.
- [x] Hero still A/B done and judged **at full resolution**, not on a contact sheet. Run three ways (Soul / Seedream / GPT Image 2); Keith chose Soul. See §5a.
- [x] The reference stills carry the §2a imperfection set and the §2b strip-out.
- [ ] `generate_audio: false` is set explicitly on every Version A call.
- [ ] One test clip generated and its cost read from the completed job before the other five are queued. **Video only.** Image cost is settled by `get_cost: true`, which submits no job. See §5.
- [x] Model read back from the **completed job record**, not the submitted request, on anything comparative. No substitutions occurred across 17 image jobs.
- [ ] Source dimensions recorded for anything being composited back into a locked layout.
- [ ] **NEW, and it caught the worst defect of the run: every garment edge cropped and inspected at 4x before a frame is approved.** Three separate brand marks (a red chest label, a shorts emblem, three-stripe trainers) were invisible at full-image size and obvious at 4x. Eyes-on approval of a whole image is not inspection of it.
- [ ] **NEW: Dan's stage-3 identity block amended so image two is a reference for BUILD ONLY.** His approved base still carries a red pocket label that §6b cleaned off the sheet but not off the base. See `2026-09-09-kit2-same-programme-production-log.md`.

---

## 6. The generation runbook — four stages, in order

🔴 **THIS IS THE ORDER, AND IT IS NOT A SUGGESTION.** Each stage exists to constrain the one after it, so running them out of order does not save a step, it removes the constraint. The single most common way to waste a day on this is to write six video prompts and hope the same man comes back in all of them.

```
STAGE 1   base image        soul_2              1 per character   →  job_id
STAGE 2   character sheet   seedream_v5_pro     1 per character   →  job_id
STAGE 3   starting frames   seedream_v5_pro     6 (one per shot)  →  job_id x6
STAGE 4   clips             seedance_2_5        6                 →  the film
```

**Every stage is gated on eyes-on approval of the one before it.** Do not queue stage 3 until the sheet is approved. An error at stage 1 is one credit; the same error discovered at stage 4 is thirteen generations and the reference work on top.

### 6.0 What makes the chain seamless

**Pass the `job_id` forward. Never download and re-upload.** `medias[].value` accepts a `media_id` **or a `job_id` from a previous generation** (verified in the tool schema), so the output of stage 1 is the input to stage 2 by reference. Nothing round-trips through disk, nothing is re-encoded, and the identity reference at stage 3 is bit-identical to the thing that was approved at stage 2.

**Preflight every new prompt shape with `get_cost: true`.** It returns the credit cost **without submitting a job**. Per-generation cost for this asset is still unverified, and this is how it stops being unverified without spending anything.

⚠ **`use_unlim`: omit it.** Left out, the server decides and returns `unlim_choice` — the question to put to Keith — rather than silently charging or silently spending an allowance. Do not set it either way on his behalf.

**Read the model back from the completed job record**, not from the submission. The catalogue carries more than one entry sharing a display name, and a silent substitution turns a comparison into a mislabelled anecdote.

---

### 6a. STAGE 1 — the base image

**Model `soul_2`. One image per character. 9:16, quality `2k`. No references attached.**

This is the identity anchor, and everything downstream inherits its defects. It is generated on Soul rather than on the sheet model because this stage has exactly one job: produce a face with human imperfection in it. ⚠ `soul_2` accepts **max 1 reference image** (verified), which is fine here because it takes none, and is the reason stage 2 moves to a different model.

**Keep the prompt short.** Soul responds to a compact brief and starts inventing when over-specified. The long-form physical detail belongs at stage 2, where the sheet locks it.

> **MARK, stage 1.** Photoreal portrait of an ordinary 44-year-old British man, chest-up, facing camera, neutral expression. Tired around the eyes. Short dark hair receding slightly at the temples with grey coming through. Two-day stubble. Plain charcoal crew-neck t-shirt. Soft diffused daylight, plain mid-grey background. Visible skin texture and pores, natural asymmetry, matte skin, no retouching, no beauty filter. Mature adult bone structure, not youthful. Documentary realism, not a headshot. Original character, not a likeness of any real or identifiable person.

> **DAN, stage 1.** Photoreal portrait of a completely ordinary British man in his mid-forties, chest-up, facing camera, relaxed neutral expression, calm and untroubled. Plain unremarkable everyman face, average looking, ordinary forgettable features. Average healthy build with a slightly soft face and a little weight on him. Full cheeks, healthy colour, well rested. Short mid-brown hair, plain and unstyled. Light stubble. He wears a completely blank plain navy crew-neck cotton t-shirt, smooth uninterrupted single-colour fabric across the entire chest and sleeves, bare unmarked cloth everywhere. Soft diffused daylight, plain mid-grey background. Visible skin texture and pores, natural asymmetry, uneven skin tone, matte skin, no retouching, no beauty filter. Mature adult bone structure. Documentary realism, not a headshot. Original character, not a likeness of any real or identifiable person.

🔴 **This prompt was rewritten on 2026-09-09 after the original failed twice at this gate, and both failures are instructive.** The version it replaces read *"Similar build and age to an ordinary gym-goer, not lean and not muscular"*, which covers **build** and silently drops **looks**. §2 makes the looks half load-bearing (*"He is not fitter or better looking. That is the point"*), the prompt did not carry it, and the model returned a chiselled, styled, visibly athletic man: exactly the fitness-ad failure §2 names. The first correction then overshot into gaunt and hollow-cheeked, which reads as **more** knackered than Mark and inverts the story, since Dan's whole function is to be visibly untroubled on the same programme. Hence both "average looking, ordinary forgettable features" **and** "full cheeks, healthy colour, well rested" have to be present together. **General rule: where §2 marks a constraint as the point of the character, the executed prompt carries that constraint in its own words, never a paraphrase of the trait it governs.**

⚠ **"Original" is load-bearing and stays in every prompt from here on.** The bundled workflow's own IP principle is original characters only, never a recognisable real person's likeness, and it is our rule too: these two men are a dramatisation, and neither may resemble anybody identifiable. It is written into the prompt rather than left as an intention.

**GATE.** View both at full resolution, not on a contact sheet. Reject and re-run if either face is smooth, symmetrical, glossy, or younger than the brief. **A too-perfect face at stage 1 cannot be corrected downstream** — every later stage is told to preserve it.

---

### 6b. STAGE 2 — the character sheet

**Model `seedream_v5_pro`. `resolution: 2k`. `aspect_ratio: 16:9`. Stage 1 `job_id` attached as `image_references`.**

16:9 because the sheet is a two-panel layout, not a deliverable. The deliverable aspect arrives at stage 3.

⚠ **Strip the small stuff here, permanently** (§2b). Whatever is on the sheet is what the model will try to re-solve on every frame of every clip: no watch, no print, no pocket, no label, no chain, no cap, no drawstring. This is the stage where a fiddly detail is cheap to remove and the last stage where removing it is free.

🔴 **But do NOT strip it by writing the strip-out as a negation. That was tested on 2026-09-09 and it fails.** Prompts phrased as "no print, no pocket, no visible label" produced a garment mark on **6 of 6** generations, including a chest pocket carrying a red fabricated brand label, a rendered corner watermark, a faint embossed hem mark, and an emblem on Mark's shorts. Rewriting the identical requirement as a **positive description of the surface** came back clean on **3 of 3**. A negation is a mention, and a mention is an instruction: "no logo" puts `logo` into the conditioning and the model has no operator for deleting it, so it renders one. Use this shape instead, and note it is what the approved sheets were actually generated from:

> He wears a **completely blank** plain charcoal crew-neck cotton t-shirt, **smooth uninterrupted single-colour fabric** across the entire chest and sleeves, **bare unmarked cloth everywhere**. **Completely blank** plain black training shorts, **smooth uninterrupted single-colour fabric, bare unmarked cloth**. Bare wrists, bare hands, bare neck.

🔴 **Footwear needs a different remedy, and it is the one that nearly shipped.** Positive phrasing alone did not clear the shoes: both first-pass sheets came back wearing running trainers carrying real brand trade dress, Dan's with **three side stripes and a gold tongue tab**, Mark's with a swoosh-style side flash. This breaks §2 and §11, and it was **invisible at full-sheet size**, caught only by cropping the feet at 4x. The reason no adjective clears it is that *"running trainer"* carries brand trade dress in the training data by definition, so **change the garment, not the adjective**:

> On his feet, **plain smooth canvas gym plimsolls** in a single uniform muted grey, completely smooth blank side panels, plain flat rubber sole, simple flat laces, entirely unmarked footwear.

⚠ **A fabricated brand is still a breach.** Several of the marks above were invented names with garbled lettering rather than copies of a real brand. That does not help: the rule in §2 is *unbranded*, not *not somebody else's brand*.

> **Split-screen character sheet composition. Left side: a full-body shot of the man standing upright in a neutral straight standing pose facing camera, both feet flat on the ground, arms relaxed at his sides, full head-to-toe framing with the whole body and both feet visible, not cropped, not sitting. Right side: a tight chest-up portrait of the same man. Identical original character on both sides. Single subject only, exactly one person, only the character in frame. Pure white seamless studio background, professional character sheet presentation.**
>
> **The face must match the attached reference exactly. Do not recast. Do not beautify. Do not use the reference image as a background or a scene element.**
>
> Ordinary 44-year-old British man. Ordinary build, not lean and not muscular, slight softness at the waist. Short dark hair going grey at the temples, receded slightly, individual grey hairs rather than an even grey wash. Two-day stubble growing unevenly with a thinner patch at the jaw. Faint shadow under both eyes.
>
> [§2a imperfection set, in full.]
>
> Wearing a plain charcoal crew-neck cotton t-shirt with no print, no pocket and no visible label, plain black training shorts, and plain worn trainers. No watch, no jewellery, no glasses, no hat, no bag.
>
> Soft diffused studio lighting without harsh reflections. Natural anatomy, unretouched commercial photography, sharp focus on skin texture detail.
>
> No text, no watermark, no logos, no frame borders, no other people, no duplicate figures, no mannequin, no reflections, no props, no furniture, no background objects. No babyface, no overly youthful rounded proportions. No beauty filter, no digital smoothing, no airbrushing, no plastic skin, no glossy skin.

Repeat for Dan, changing only the age band, hair, and the navy t-shirt and grey shorts.

### 6b-ii. STAGE 2b, the 360 turnaround (added 2026-09-09 on Keith's instruction)

**Model `seedream_v5_pro`. `resolution: 2k`. `aspect_ratio: 21:9`. TWO references: the approved stage-2 sheet `job_id` first, the stage-1 base `job_id` second.** 3 credits each, same as the sheet.

The split-screen sheet locks the face but says nothing about how a man reads in profile or from behind, and **S3, S4 and S5 are all off-axis**. So each character also gets a four-view turnaround: front, three-quarter, side profile, back, in one row at consistent scale on a shared ground line. The three-quarter view is included because that is the angle most shots actually sit at.

> **Character turnaround model sheet. Four consistent full-body views of the same man in a single horizontal row, evenly spaced, all at identical scale, all standing on the same ground line, each shown head-to-toe with both feet visible and not cropped. From left to right: view one is a straight front view facing camera; view two is a three-quarter view turned about 45 degrees; view three is a full side profile seen from directly beside him; view four is a back view seen from directly behind, showing the back of his head and shoulders, his face not visible. Neutral straight standing pose in every view, arms relaxed at his sides, feet flat on the ground. Exactly four figures in the image and all four are the same identical original character, same height, same build, same hair, same clothing in every view. Pure white seamless studio background, professional character turnaround sheet presentation.**
>
> **Image one is the identity reference and the face must match it exactly. Image two is a secondary reference for the face and build only, ignore its clothing entirely. Do not recast. Do not beautify. Do not use either reference as a background or a scene element.**
>
> [physical description and the §2a imperfection set, as §6b]
>
> [the §6b positive wardrobe block, with "across the entire chest, **back** and sleeves" and "front and back" on the shorts]
>
> Soft diffused studio lighting without harsh reflections, identical lighting and identical exposure across all four views. Natural anatomy, unretouched commercial photography, sharp focus on skin texture detail. Empty seamless studio. No text, no watermark, no logos, no labels, no stripes, no side flashes, no contrast overlays, no frame borders, **no additional people beyond the four views of this one man**, no mannequin, no reflections, no props, no furniture, no background objects.

🔴 **Do NOT paste the §6b negative tail into this prompt.** It contains **"no duplicate figures"**, which is correct for a two-panel sheet and **directly contradicts a four-view turnaround.** A negative tail is written against a composition, not against a character, so it does not travel between compositions. Replace it with the four-figure count above.

⚠ **The wardrobe block needs "back" added explicitly.** §6b's version describes the chest and sleeves, which is all a front-facing sheet shows. A turnaround renders the back of the shirt and the seat of the shorts, and an unspecified surface is an invented one.

**GATE.** Four figures, one man, same height and build in all four. Back view must show the back of the head with the face not visible. Then **crop the back view and the footwear at 2x or more and inspect them** (§5d). Both characters passed first time on 2026-09-09.

**GATE.** Both panels must be the same man. Left panel standing, whole body, uncropped. Right panel a genuine close-up, not a second full body. Face still carries the stage-1 imperfections. **If the sheet has beautified him, stop and re-run rather than proceeding** — the sheet is what stage 3 is told to match.

---

### 6c. The two blocks every stage-3 prompt carries

Written once here, referenced by all six. Neither is optional and neither is decoration.

**The identity block**, first, before any scene description:

> **Image one is the identity reference and the face must match it exactly. Image two is a secondary reference for build and wardrobe. Do not recast. Do not beautify. Do not use either reference as a background or a scene element.**

Each clause has a specific failure behind it. *Do not recast* stops a different man who merely matches the description. *Do not beautify* stops the imperfection set being sanded off, which the model does by default. *Do not use as background* stops the reference being composited into the scene as a picture on a wall.

**The lens block**, last, after the scene description:

> Shot on a 35mm lens at f/1.8, shallow depth of field, focus on the eyes. Visible fine film grain. Muted, slightly desaturated colour, cool cast. Documentary realism, not commercial gloss. No lens flare, no bloom, no vignette.

⚠ **Do not vary the lens block per shot.** Six clips generated independently read as one shoot because this is identical across all of them. A6's shallow-focus hold is emphasised in its own scene text as well, which is a deliberate restatement, not a different setting.

---

### 6d. STAGE 3 — the six starting frames

**Model `seedream_v5_pro`. `aspect_ratio: 9:16`. `resolution: 2k`. TWO references attached, in this order: the stage-2 sheet `job_id` first, the stage-1 base image `job_id` second.**

Order matters because the identity block refers to them by position. The sheet is image one because it carries the face across two views; the base image is image two because it carries the build and the wardrobe.

Each prompt below is: **[identity block] + [the frame] + [lens block]**. The frame text is written as a still, in the present tense, describing the first frame of the shot rather than the action of the shot.

- **S1** — A dark British bedroom before dawn, curtains drawn, cool blue light. A phone on a bedside table shows 05:41 on its screen, the brightest thing in the frame. Behind it and slightly out of focus, a 44-year-old man lies on his back under a duvet with both eyes open, looking straight up at the ceiling. Close framing on the phone with the man soft behind it.
- **S2** — An ordinary British kitchen, dark outside the window, one overhead light on. A 44-year-old man in a plain charcoal t-shirt stands at the counter with three meal-prep containers of chicken and rice in front of him, one lid in his hands. An open gym bag sits on the floor by the door behind him.
- **S3** — A plain commercial gym floor with no signage or branding anywhere. A 44-year-old man stands at a barbell mid-set, arms under load, sweat at the hairline, jaw set. Close framing, chest-up.
- **S4** — A gym floor after a session. A man in a navy t-shirt stands with a bag over one shoulder, half-turned. A second man in a charcoal t-shirt sits on a bench a few feet away, forearms on his knees, head down, looking at the floor. Both men in frame together, wide.
- **S5** — Bright early-afternoon daylight in an ordinary British car park. A 44-year-old man sits in the driver's seat of a parked car, car keys held loosely in his lap, engine off, dashboard dark, head tipped back against the headrest with both eyes closed. Shot through the windscreen from the front.
- **S6** — An ordinary British kitchen in daylight. An open kitchen cupboard shows a shelf of plain unlabelled supplement tubs. A man's hand is raised toward them, stopped short, not touching. A plain white rectangular box sits on the counter below, out of focus.

⚠ **S4 is the one to check hardest.** It is the only frame with both characters in it, so it is the only place the two identity chains have to hold simultaneously. If Dan drifts toward Mark, generate it with Dan's sheet as image one and Mark's as image two and take whichever run holds both.

**GATE, and this is the important one.** These six frames are the film. **If a starting frame does not look cinematic, the clip generated from it will not either** — the video stage inherits the frame's grade, its lighting and its face, and it is far harder to recover a look at stage 4 than to re-run a still at stage 3. Re-run at stage 3 until all six are right. This is the stage where credits and hours are actually saved.

---

### 6e. STAGE 4 — the six clips

**Model `seedance_2_5`. `mode: omni_reference`. `aspect_ratio: 9:16`. `resolution: 720p`. `duration: 5`. 🔴 `generate_audio: false`.**

**Two medias per call:** the shot's stage-3 `job_id` as `start_image`, and the stage-2 sheet `job_id` as `image_references`.

⚠ **Attaching the sheet as well as the start frame is ours, not the source method's.** The source stops at the starting frame. `seedance_2_5` exposes both roles (verified), and the belt-and-braces carry is worth one extra reference on a six-shot run where identity drift is the main risk. **Test it on one clip against a start-frame-only run before committing to it** — if it changes nothing, drop it.

⚠ **`generate_audio` defaults to `true`.** Left unset, Version A comes back with a soundtrack nobody asked for on the version whose entire premise is that the edit carries the bed.

Now the prompts animate the frame. **Write the body, not the feeling** (§7a), and give every beat a trigger.

- **A1** ← S1 — "The man lying in the bed lifts his own near arm out from under the duvet and reaches forward toward the phone on the bedside table. His shoulder, upper arm, forearm and wrist stay visible and physically connected to his body for the whole reach, moving into frame from his own body rather than appearing at the edge of frame. He presses the phone screen once with his index finger, and the screen goes dark. He lets his arm drop back down onto the bed beside him. He does not sit up and does not turn his head. Camera pulls back slowly and steadily to reveal him lying on his back, both eyes open, gaze held on the ceiling. He blinks twice, slowly. Exactly one person in the room and only one pair of hands. [Lens block]"

  🔴 **Rewritten 2026-09-09 after the first render failed, and the failure was caused by this prompt.** The original read *"A hand enters frame and presses the phone screen once."* **A hand with no owner and no origin is a disembodied subject by construction**, and the model rendered it exactly that way: a hand severed at the wrist entering from the left frame edge at mid-height, while the man's shoulder sat above and behind it, so the geometry ruled out it being his own hand. It read as a second person reaching in from off camera. Keith caught it on the first viewing.
  
  **The rule this gives, and it applies to every clip prompt from here on: name the owner, name the origin, and require the connection.** Any body part that acts gets (a) whose it is, (b) where it comes from in the scene, and (c) an explicit instruction that the limb stays visibly joined to the body. "A hand enters frame" is never acceptable; "he lifts his own arm from under the duvet, forearm and wrist staying connected" is. Note the other five prompts in this section all name their actor ("He presses lids", "He completes the lift", "The man in the navy t-shirt puts one hand"), and **A1 was the only disembodied one and the only one that failed this way** — so the defect is diagnosable by reading the prompt, before spending a credit. This is also §7a's own rule ("performance in physical verbs, write the body") being broken by the first prompt in the runbook that follows it.
- **A2** ← S2 — "He presses lids onto three containers, one at a time, unevenly spaced. He stacks them and lowers them into the open gym bag by the door. His movements are even and unhurried. He does not look at the containers while he closes them. Static camera. [Lens block]"
- **A3** ← S3 — "He completes the lift and sets the bar back onto the rack. He keeps both hands on the bar, elbows locked, and stays still looking down at it for two full seconds after the set has ended. Handheld, close, slight natural drift. [Lens block]"
- **A4** ← S4 — "The man in the navy t-shirt puts one hand on the seated man's shoulder, pats twice, lifts his bag and walks out of frame at an easy pace without looking back. The seated man does not move, does not look up, and stays looking at the floor between his feet after the other man has gone. Static camera, wide, one uninterrupted shot, no cut. [Lens block]"
- **A5** ← S5 — "He stays still with his head against the headrest and his eyes closed. His hand does not move toward the ignition. Static camera with a faint handheld drift. [Lens block]"
- **A6** ← S6 — "His hand holds still near the tubs for a beat, then withdraws and pushes the cupboard door closed. Focus begins on the tubs on the shelf; on the door closing, focus pulls forward to the white box on the counter and the background goes soft. He sets his hand flat on the counter beside the box. Camera holds still. [Lens block]"

**GATE.** Watch each clip at full size before generating the next. Reject any clip with unrequested slow motion, a face that has drifted from the sheet, a hand that resolves wrongly, or a garment that has grown a logo or a print.

**Then §9.** Everything after this — the trim, the grain, the box, the wordmark, every word of on-screen type — happens in the edit and never in the model.

---

## 7. Directing the shot

### 7a. Performance in physical verbs

The existing instruction "do not write emotion words the model cannot see" is right, and this is the vocabulary that replaces them. Write the body, and the emotion arrives.

| Instead of | Write |
|---|---|
| exhausted | shoulders drop, head tips back against the rest, eyes close, does not move for two seconds |
| resigned | hand rises toward the shelf, stops short, closes the door |
| forced cheerfulness | mouth moves into a smile, eyes do not change |
| defeated | forearms on knees, head down, gaze on the floor between his feet |
| pushing through | jaw sets, breathes out through the nose, grip tightens on the bar |

**Give each beat a trigger.** A performance note with no cue lands somewhere in the clip at random. Anchor it: *"after the door closes, his hand stays flat on the counter"* is directable; *"he looks resigned"* is not.

### 7b. Camera focus

State what is sharp, and state when that changes. A6 is the shot that turns on this: the cupboard of tubs is sharp, the hand enters, and on the door closing the focus moves to the box on the counter. Written out, that is a **rack focus with a trigger**, and it should be prompted as one rather than left to the model:

> Focus begins on the tubs on the shelf. On the cupboard door closing, focus pulls forward to the white box on the counter, and the background goes soft.

### 7c. Camera movement is a choice, and it carries meaning

The movement is not decoration and should never be default. What each of the six is doing, and why:

| Shot | Movement | Why |
|---|---|---|
| A1 | slow pull back from the phone to the bed | the reveal is that he was already awake; the move *is* the reveal |
| A2 | static | routine reads as routine when the camera is not interested in it |
| A3 | handheld, close, slight drift | effort, and the drift keeps it from looking staged |
| A4 | static wide, uninterrupted | the contrast has to be readable in one shot; a cut here would let the viewer off |
| A5 | static, through the windscreen, faint handheld drift | he is observed rather than accompanied |
| A6 | static, hold, focus pull only | the decision is the movement |

⚠ **A4 is deliberately a single uninterrupted wide, and this is the one to defend in review.** The temptation is to cut between the two men for energy. Cutting there destroys the beat: the whole point is that both men are in the same frame under the same lights having done the same session, and separating them into two shots re-frames it as a comparison the edit is making rather than one the viewer notices.

---

## 8. Sound design

Version A generates no audio, so all of this is built in the edit. Specifying it here matters because the ambience is what stops a silent clip reading as a silent *clip*.

**Diegetic** — sound the characters would hear. Specify per shot, in detail, rather than as a mood:

- **A1** a single soft phone alarm tone, cut mid-cycle by the tap. Then room tone only: a fridge hum through the wall, one car passing outside.
- **A2** three lids clicking on, one at a time, not evenly spaced. A bag zip. A single cupboard door.
- **A3** plates settling on the bar as it lands in the rack. Breath through the nose. Distant gym floor noise, no music.
- **A4** one shoulder pat. A bag lifted. Footsteps leaving, receding, and not stopping.
- **A5** a car door already shut, so: nothing. Traffic well outside. This is the quietest shot and it should be.
- **A6** a cupboard door closing softly rather than clicking shut. The box set down on a hard counter, one contact.

**Non-diegetic** — score and effects only the viewer hears. Use sparingly and place them on a frame, not across a section.

- A sparse sustained bed enters under A2 and stays flat until A4.
- **One low sub-bass hit landing on the exact frame Dan's footsteps stop being audible in A4.** That is the turn of the film, and it is the only place in 31 seconds that gets a deliberate emphasis.
- The bed resolves, rather than swells, under A6. Nothing triumphant. The ending is a decision, not a victory.

⚠ **No music sting on the box.** A sting on a product reveal in a health ad reads as a promise about the product. The bed resolving does the same structural job without asserting anything.

---

## 9. The edit pass

Generated clips arrive too clean and slightly too slow. Four passes, in this order, and none of them is optional:

1. **Trim first, before anything else.** Cut the head and tail of every clip to the beat that earns its place. Generated clips habitually open with a half-second of nothing and close with a drift; both read as AI. **And cut any slow motion the model has added on its own** — unrequested slow motion is one of the most reliable tells there is, and it will appear even when nothing asked for it.
2. **Add a slow push or pull on the static shots.** A 100% to 106% push across A5, and a slow pull out on A6 after the box lands. Small, and under the threshold where it reads as a move.
3. **Add grain, lightly.** The single highest-value step for believability. Enough to break the digital cleanliness, not enough to notice as an effect. Then a very slight edge softening, so the frame stops being uniformly sharp corner to corner the way a real lens never is.
4. **Composite the box, the wordmark and every word of on-screen type here, never in the model.** Already the rule in §3 for the pack; it applies identically to the text cards and the end card.

⚠ **No letterbox bars.** Cinema bars are a common realism trick and they are wrong for this asset: the deliverable is 9:16 for feeds where vertical space is the scarce resource, and cropping 10 to 15 per cent from the top and bottom of a vertical video to imitate a widescreen frame throws away the format's only advantage. Bars belong on 16:9 content pretending to be anamorphic, not here.

---

## 10. The four-check

1. **Genuinely interesting to Mark?** Yes. It is his Tuesday, and the recognition is the product.
2. **As compressed as it can be?** Version A carries four text cards and no speech across 31 seconds.
3. **Does the hook hook on its own?** A1 works muted and with no text: a man awake before his alarm, staring at a ceiling.
4. **What emotion at the end?** Recognition, then relief at the existence of a next step. That is what was aimed for.
5. **Compliance:** ⛔ `/compliance-preflight` NOT RUN. Required before anything is generated.

---

## 11. Compliance notes carried into pre-flight

- No claim anywhere that the test explains, resolves or improves the tiredness. The promise is the measurement.
- No number appears on screen in either version. If one is ever added it must be a real result, never invented.
- Every marker implied is one Kit 2 actually measures.
- The film names no supplement and makes no ingredient claim of any kind. The silent-ingredient rule in `03_compliance/CONTEXT.md` Special Cases holds throughout, and is satisfied by naming nothing rather than by listing exclusions.
- No low-testosterone inference. Kit 2 markers are Vitamin D, Active B12, hs-CRP and Ferritin, and nothing in either film points at testosterone.
- Contrarian energy is aimed at the assumption that effort is the variable, never at GPs or the profession.
- Supplement tubs are unbranded. No identifiable retailer, competitor or premises appears.
- Mid-funnel, not top. It carries a product, so it does not count against the TOFU lane that is required to carry no kit CTA.
- **New, from §6a and §6b:** both characters are specified as **original** and must not resemble an identifiable real person. This is an IP constraint as well as an honesty one, and it is written into the reference prompt rather than left as an intention.
- **New, from §8:** no non-diegetic sting lands on the product. Emphasis on a product in a health ad is an implied assertion about it.

---

## 12. 🔴 What this asset breaks, and needs a ruling on

**The rails assume Keith is on camera, and here he is not.** Two specific gaps:

1. **Founder disclosure.** `hook-playbook.md` §4 and the `script-playbook.md` four-check both require founder disclosure present in the video. That rule was written for founder-fronted content and has no translation for a film with no founder in it. The end card identifies the advertiser, which is probably the functional equivalent, but that is an inference and should be an explicit ruling.

2. **AI-generated actors are not covered anywhere in the repo.** Meta and TikTok both expect realistic AI-generated content to be labelled at upload, and the honest position is to tick it. The more important rule is editorial: **this man is a dramatisation and must never be captioned, described or implied to be a real customer or a real result.** A fictional scenario is a safe category; the same footage captioned as somebody's experience becomes a fabricated testimonial, and our own rule already says a testimonial cannot state a claim the advertiser could not state directly.

3. **New: the imperfection method makes the actor more convincing, and that raises the stakes on point 2 rather than lowering them.** §2a exists to defeat the uncanny valley, and it works by making a generated man harder to identify as generated. Everything in point 2 therefore binds harder after this revision than before it. The platform label is not optional and the caption discipline is not a formality.

Recommend all three go to pre-flight, and the second and third to Ewa, before the first credit is spent. If the format runs as a series, the resolution beat should be pre-flighted once and locked as an approved asset so each new episode only needs its cold open checked.

---

## 13. Cold opens for later episodes (same locked ending)

- **The cupboard.** He opens it and forty tubs come out at him.
- **The 1am scroll.** Forums, contradicting answers, blue light on his face.
- **"Your bloods came back normal."** Framed on what a standard panel does not measure, never on the GP.
- **The 3pm slump**, relocated: van, desk, school run.

---

## 14. What was verified, what was corrected, and what is still opinion

The production method in §§5 to 9 comes from an external source. It is written up here as instructions, so it is worth being explicit about which parts are checked facts and which are somebody's taste.

**Verified against the live Higgsfield catalogue, 2026-09-09** (`models_explore`, `balance`):

| Claim | Status |
|---|---|
| `seedance_2_5` exists, `mode: omni_reference`, 9:16, 480p/720p/1080p, 4-30s | ✅ confirmed |
| `seedance_2_5` `generate_audio` defaults to **true** | ✅ confirmed, and it makes the "set false" instruction load-bearing |
| `seedream_v5_pro` exists, 16:9, 2K tier, takes multiple `image_references` | ✅ confirmed |
| `soul_2` exists and is scoped to realistic character and portrait work | ✅ confirmed |
| `soul_2` accepts **max 1** reference image | ✅ confirmed, and it is why the pipeline moves to Seedream at stage 2 |
| `gpt_image_2` defaults to `quality: low`, `resolution: 1k` | ✅ confirmed |
| `sync_so` exists and takes `input_video` + `input_audio` | ✅ confirmed |
| Balance 248.5, plan `pro` | ✅ confirmed |

**Corrected by the check:**

✅ **"Wan 2.7" DOES exist — this row previously said it did not, and that was the error.** An earlier pass retired the model as hallucinated on the strength of a catalogue search that returned `wan2_6` and not `wan2_7`. A direct id lookup on 2026-09-09 returns it in full, with the synchronised-audio, character-consistent and `start_image` capabilities the original recommendation claimed. See §5c. The real lesson survives but inverts: **a negative existence claim is the most decay-prone thing you can write down, and "my query did not return it" is not "it is not there".** The silent-then-lip-sync route is kept because it is better, not because `wan2_7` is unavailable.

⚠ **Two model names in the source were mis-transcribed** and are decoded here so they can actually be called: what the source calls "Cance / Cense / Cedense 2.5" is **Seedance 2.5** (`seedance_2_5`), and "Cream 5.0 Pro" is **Seedream 5.0 Pro** (`seedream_v5_pro`). "Hickfield" is Higgsfield.

**Still opinion, and flagged as such:**

- **That Soul beats the alternatives on human realism.** The source is a Higgsfield-sponsored video praising a Higgsfield model. Plausible, and consistent with the model's own catalogue description, but not independent. §5a names the one-frame A/B that settles it.
- **That GPT Image 2 is "too noisy" and degrades on each pass.** The degradation claim is untested here. The *defaults* finding in §5a is checkable and is the part worth acting on; the rest is a preference, and it sits against a standing instruction from Keith, so it is his call and not a decision this document should make quietly.
- **Cost.** Per-generation cost remains unverified. One test clip, read from the completed job, before six.
