---
name: higgsfield-generation
description: >
  Runbook for generating images and video through the Higgsfield MCP connector.
  Use before any Higgsfield generate_image / generate_video / batch call, and
  whenever a Higgsfield job returns a confusing failure — a credit error, a
  silently substituted model, a stretched aspect ratio, or one item in a batch
  failing repeatedly. Owns the submission-layer traps, the results-attribution
  rule, the aspect round-trip, and the known prompting limits. It does NOT
  choose creative direction and does NOT approve spend.
---

# higgsfield-generation

**Internal skill.** A vendor runbook, so it is a working document: it goes stale
when Higgsfield changes its catalogue, and it is only worth what its last
verification is worth. Keep it current rather than complete.

Every failure below cost real credits and presented as something other than what
it was. That is the through-line: **the Higgsfield submission and results layers
fail by returning plausible wrong answers, not errors.**

---

## Step 0 — Re-verify the catalogue before trusting anything here

The capability claims in this file are a **cache with no invalidation**
(`12_operations/cross-cutting-principles.md`, P19). Before relying on any "no
model supports X" statement, re-read the catalogue. It is two read-only calls and
costs nothing:

```text
models_explore(action='list', type='image', input='image', limit=30)
models_explore(action='list', type='video', input='image', limit=14)
balance()
```

Read `medias[].roles`, `parameters[]` and `aspect_ratios[]` per model — **not the
model names and not the marketing tags.** A pipeline depends on a mechanism, and
the mechanism is in the parameter surface.

**Last verified: 2026-08-15.** Plan `pro`, 522.5 credits, `unlim.available:
false`.

---

## What does NOT exist (verified 2026-08-15)

| Mechanism | Status | Consequence |
|---|---|---|
| **Masked inpainting** | **Absent.** Every image model exposes `image` or `image_references` roles only. No model takes a mask. | Pixel-lock outside an edit box is not achievable. The nearest thing is `seedream_v5_pro`'s `is_inpaint` boolean, which is *instruction-based* — it re-renders and does not honour a region. |
| **Negative prompts** | **Absent on every video model.** | Constraints that protect rendered type ("headline changing, letters morphing, text warping") have nowhere to go. The nearest lever is `cinematic_studio_video_v2`'s `cfg_scale` (0-1 prompt adherence). Folding negatives into the positive prompt is a **capability loss, not a port** — diffusion models handle negation poorly and can reinforce the named artefact. |
| **Arbitrary aspect ratios** | **Absent on most models.** Ratios are a fixed list per model. | See the aspect round-trip below. |

**Do not client-side reconstruct a mask.** Compositing the original back outside
an edit box scores a perfect 1.000 SSIM on the untouched region — **true by
construction, and meaningless.** It was tried: the model had re-rendered the
subject larger and shifted, so its new headline extended past the box authored
for the original layout and was sliced off mid-word. A mask is only valid for the
exact geometry it was drawn against, and an instruction editor does not preserve
geometry. Any masking or compositing workaround needs a **visual check at the
seam, at full resolution**, before it is called working.

---

## Submission layer — two interceptions that present as failures

**1. A credit error is a hypothesis, not a finding.** Of five jobs submitted in
one batch, three were accepted and two failed with
`Out of credits on pro (monthly) plan`. The account held 610 credits and the
three accepted jobs cost 12 in total. Resubmitting the two failed indices
immediately, unchanged, succeeded — it was a concurrency/reservation artefact and
the error text was actively misleading. Taken at face value it would have ended
the session with a spurious "you need to top up".

> **Rule:** call `balance()` before repeating a credit error to Keith, and retry
> a failed batch index **once** before reporting a billing problem.

**2. A preset recommendation can intercept a video submission entirely.** The
response carries `declined_preset_id`, which must be echoed back to proceed.
Nothing is wrong; the submission simply did not happen.

Both are submission-layer interceptions wearing the costume of a failure.

---

## Results attribution — read the model back from the completed job

A job submitted with `model: nano_banana_pro` came back reporting
`model: nano_banana_2`. **The substitution was not flagged in the submission
response, only in the job status record.** In a comparative evaluation that
silently mislabels a result: the conclusion "Pro was the weakest of the five"
would have been drawn about a model that never ran.

The catalogue makes this easy to hit. As of 2026-08-15 there are **two entries
whose display name is "Nano Banana Pro"** — id `nano_banana_pro`, and id
`nano_banana_2_shots` whose `name` field is also "Nano Banana Pro". Names are not
identities here.

> **Rule:** in any comparative test, attribute every result from the **completed
> job record's** model field, never from the submitted request. Note any mismatch
> explicitly in the write-up. Silent substitution turns a benchmark into a
> mislabelled anecdote.

---

## Aspect handling — record the source geometry before you submit

**Higgsfield returns the requested ratio exactly, and stretches to reach it.**
Source frames of 1122x1140 and 1122x1206 (roughly 0.93-0.98) have no matching
ratio on most models — the nearest offered is 1:1 — and every result came back
exactly **2048x2048, horizontally stretched, with no warning**. Composited
straight back into a fixed layout that ships a subtly widened face on every post,
which is the kind of error that survives review because no single frame looks
wrong.

Two ways out, in order of preference:

1. **Use a model offering `auto`.** This is new since the observation was logged:
   `nano_banana_2_lite`, `nano_banana_2_shots`, `kling_omni_image`, `grok_image`,
   `outpaint`, `marketing_studio_image` and `ms_image` all list `auto` in their
   `aspect_ratios`, and the video models `cinematic_studio_3_0`, `flux_3_video`,
   `minimax_h3`, `seedance1_5`, `seedance_2_0` and `marketing_studio_video` do
   too. Models **without** `auto` — including `nano_banana_2`, `nano_banana_pro`,
   `gpt_image_2`, `seedream_v4_5`, `seedream_v5_pro` and `flux_2` — will snap.
2. **Record the source dimensions before submitting and rescale the result back
   to them on return.** Check a face or a circular object after the round-trip;
   those show the distortion first.

---

## Prompting limits — stop re-wording when the models agree

**Eyelid aperture and gaze direction cannot be specified independently.** Asked
to lift the eyelids and relax the brow while keeping the subject looking down at
a newspaper, two different models (Seedream 5 Pro and GPT Image 2), across two
separately-worded prompts each, **all four raised the gaze to camera.** The
models appear to treat "open eyes" and "downward gaze" as coupled and resolve the
conflict by discarding the gaze constraint. The failure was silent and
consistent, so a single test would have read as a one-off.

> **Rule:** when several independent models fail the same constraint in the same
> direction, it is a property of the capability, not of the prompt. Stop
> re-wording. Name the limitation and put the trade-off to Keith as a decision —
> either choose a source frame that already has the pose, or accept the change as
> creative and say so, rather than presenting it as the fix he asked for.

---

## Batch uploads — one control beats a third retry

Uploading nine media files to presigned URLs, eight succeeded and one returned
`curl exit 55, Failed sending data to the peer`, repeatedly. It looked like a
transient blip, so it was retried, then retried with a freshly minted upload URL,
and failed identically both times. The file was a valid 64 KB PNG of the right
dimensions.

The real question is whether the fault is in the **slot** (that URL) or the
**payload** (those bytes), and guessing burns attempts. **One control settled
it:** PUT a *different* file's bytes to the *same* failing slot. It returned 200,
proving the slot was fine and the bytes were the trigger. Re-encoding the PNG
(64 KB → 45 KB, identical image) uploaded first time.

> **Rule:** when one item in an otherwise successful batch fails repeatedly, stop
> retrying and run a control that changes exactly one variable — known-good bytes
> to the failing endpoint, or the failing bytes to a known-good endpoint. **Two
> retries that fail identically are evidence of a deterministic cause**, and a
> byte-identical retry of a payload-triggered failure can never succeed. Re-encode
> rather than re-send.

---

## Pre-flight — before any generate call that costs credits

Rules in a skill are not reliably followed under load, so run these rather than
recall them.

- [ ] **Catalogue re-verified this session** (Step 0), if this file's last-verified
      date is more than a couple of weeks old.
- [ ] **The mechanism the step depends on exists in `parameters[]` / `medias[].roles`**
      — checked per model, not inferred from the model name or its tags.
- [ ] **Source dimensions recorded** if the output will be composited back into a
      fixed layout, and a model with `auto` preferred where the source aspect is
      not in the list.
- [ ] **A credit error has been checked against `balance()`** and retried once
      before it is reported to Keith as a billing problem.
- [ ] **Comparative tests read the model from the completed job record**, not the
      request.
- [ ] **Rendered output has been seen at full resolution**, not on a scaled contact
      sheet — a generative model draws punctuation wrong, and a stray full stop
      once reached ten decks and ten paid clips after a 37% montage cleared it
      (P2, and `compliance-preflight`'s render obligation).
- [ ] **Spend is reported with the option**, and the quoted cost traces to the
      layer the defect actually lives in — recompositing cannot fix a defect
      inside the animated photo layer (P26 and task-observer's decision-offering
      rule).

---

**Distilled from:** Observations 187, 188, 190, 191, 194, with the capability
facts cross-checked against 184, 185 and 186 (which remain OPEN for a separate
`vendor-swap-preflight` skill — their principle is about porting a pipeline
between vendors, not about operating this one).

**Related:** `andro-prime/12_operations/cross-cutting-principles.md` — P2 (pixels
seen, at a resolution that resolves the defect), P16 (a metric satisfied by
construction proves nothing), P19 (an external system's configuration is a
cache), P27 (isolate per-item batch failures).
