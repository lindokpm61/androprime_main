# Instagram carousel prototype: "14 signs of low vitamin D"

Working prototype for the daily Instagram carousel on `keith.antony.ai`. **Prototyped, not adopted.
Nothing here has shipped and no copy has been through `/compliance-preflight`.**

Open `review.html` in a browser. It is the review artefact, in four zones: **needs Keith** (the open
decisions and the one live defect), **decided** (the record), **the build** (what exists), and
**archive** (superseded work, collapsed).

**Its run ledger is generated, not written.** `run-status.js` is emitted by
`node plan.js --json > run-status.js` and read by the page; regenerate it after any change to
`covers.js` or the decks, or the ledger will quietly show yesterday's state. The page stamps the
generation date next to the ledger and refuses to invent one if the file is missing. Nothing about
the schedule is restated in the HTML: a second copy of the rules would eventually disagree with the
scripts that actually produce the assets.

Moved into the repo 2026-08-10 from a session scratchpad, where it was the only record of the
base-photo change and the mask position and would have been lost on cleanup.

## What is here

| File | What it is |
| --- | --- |
| `review.html` | The review page. Start here. |
| `run-status.js` | Generated. The run's asset state, for the ledger on `review.html`. |
| `media.js` | Shared ffmpeg discovery, image dimensions and SSIM. Used by `inpaint.js` and `video.js`. |
| `decks/<slug>.js` | Per-topic copy, slides 1 to 7. The only file you write per post. |
| `closes.js` | The three closing slides, approved as CA-031. Not a file to improvise in. |
| `slide-8-closes.md` | The approved close copy and the topic-to-kit mapping. |
| `base-1..6.jpg` | The six approved base photos, 1122x1402, greyscale, band baked in. |
| `cover-current-b2.jpg` | The selected cover: base-2 with the eyes opened. |
| `eyes-before-after.jpg` | The eye fix, native resolution, same crop box. |
| `cover-final-lookup.mp4` | Shortlisted animation 1. Replicate, Kling v2.1. |
| `cover-final-hf-sip.mp4` | Shortlisted animation 2. Higgsfield, Kling 3.0. |
| `cover-final-hf-lookup.mp4` | Shortlisted animation 3. Higgsfield, Kling 3.0. |
| `png/slide-02..08.png` | Body slides, rendered deterministically from brand tokens. |
| everything else | Superseded stills, kept for the decision record. |

Images were re-encoded on the way in: 44 MB of PNG masters became 9.8 MB of JPEG. The type-heavy body
slides stayed PNG because JPEG rings on flat-background type. The three shortlisted videos are
verbatim; the two superseded ones were downscaled.

## Swapping the headline for a new article

```sh
node inpaint.js --l1 "WHY AM I" --l2 "ALWAYS TIRED?" --out cover-why-tired --dry
node inpaint.js --l1 "WHY AM I" --l2 "ALWAYS TIRED?" --out cover-why-tired
```

`--dry` resolves and prints every path, then stops before spending anything. Use it first: Git Bash
rewrites leading-slash arguments into Windows paths, so a wrong path is otherwise invisible until
after the call has been billed.

**The mask box is x 350-785, y 452-750** on the 1122x1140 image area. It was cut against measured ink
extents, not by eye: the headline's ink runs to y=742, the sidebar ends at x=317, the left hand starts
at y=718 and the right hand at x≈800. `work/mask-preview.jpg` shows the box over the cover; look at it
before trusting a changed mask.

The script does not trust the model's output wholesale. Ideogram returns its own resolution (1024x1024
here, from a 1122x1140 source), so the result is rescaled and then merged back through the same mask:
outside the box every pixel comes from the original file. The brand band is re-attached afterwards and
never goes near the model. Verified at 1.000 SSIM above, below, left and right of the box.

If the cover photo ever changes, the mask must be re-cut. It is valid only for the exact geometry it
was drawn against.

## Regenerating the slides

```sh
node build.js --list                                # available decks
node build.js  --deck why-am-i-always-tired         # copy + tokens -> slides/<slug>/*.html
node render.js --deck why-am-i-always-tired         # -> png/<slug>/*.png (1080x1350)
                                                    #    + publish/<slug>/ (the 11-file publish set)
node render.js --deck why-am-i-always-tired close-B # just one slide, no publish set
node render.js --deck why-am-i-always-tired --publish-only   # assemble the set, render nothing
node render.js --deck why-am-i-always-tired --no-publish     # render only
```

**A full render also assembles the publish set**, because the step between rendering and publishing
used to be a hand copy (see below). It needs the deck's cover video to exist, so on a new deck the
order is `build` → `render` → `video.js --deck <slug>` → `render.js --deck <slug> --publish-only`.

## Publishing the media

**`slides/` and `png/` are both gitignored.** Rendered output is not committed (plan step 3.4, gate
D3, 2026-08-14): git holds the recipe, the public Supabase Storage bucket `content` holds what a
machine publishes from. What IS committed is `media-manifest.json`, which records the path, URL,
sha256 and size of every published file, so what shipped stays provable without the bytes in git.

```sh
node publish-media.js --all --dry                   # resolve and print, upload nothing
node publish-media.js --all --prefix carousel-      # upload + verify, write the manifest
node unpublish-media.js --orphans                   # what is in the bucket the manifest doesn't name
node unpublish-media.js --prefix <p> --yes          # remove (dry without --yes)
```

**`--prefix carousel-` is not optional for this run.** The object's first path segment must be the
**asset** slug (`carousel-brain-fog`), not the deck slug (`brain-fog`), because doctor invariant I11
checks that every object in the public bucket belongs to a known `content_assets` row.

**Paths carry an eight-hex content hash** (`slide-02-e875b6e4.png`). That is the embargo, not cache
busting: deck slugs are published in the run calendar, and thirty carousels sit in the bucket for up
to thirty days before their slot. It also makes re-publishing idempotent.

**The manual step between `render.js` and here is GONE (2026-08-17, completing plan step 3.4).** It
had never been written down: rendering produces 12 or 13 files, a post publishes 11 of them, and one
of those has a different name. `render.js` now writes `publish/<slug>/` itself and
`publish-media.js` reads from it by default, so the chain runs end to end with nothing carried by
hand. Proved on the way in: the assembled set is **byte-identical to the hand-made one across all
110 files**, so no object path moved and nothing was re-uploaded.

The two rules it encodes:

- **Selection is an allowlist**, not "everything except the intermediates": exactly
  `cover-type.png`, `slide-02…07.png`, `close-A|B|C.png`, taken from what `schedule.js` addresses.
  An exclusion list fails **open** — the next render artefact anyone adds ships to a public bucket
  on the next run. `cover-overlay.png` and `cover-video.png` are inputs to the video composite, and
  `slide-01.png` is the superseded direction-A cover; none is published.
- **The rename**: `cover-video-<slug>.mp4` at this directory's root → `<slug>/cover-video.mp4`.
  `video.js` names by deck at the root because the non-deck path names by model and scene, so
  minting ten decks would overwrite one file ten times.

**A missing file refuses the whole set** rather than writing a partial one, and the set is pruned of
anything outside the allowlist before it is written. A 10-file set uploads cleanly and reads as
finished; the post that addresses the eleventh file is where it surfaces, which is the media-less
carousel that step 1.3 found live in the shared scheduler. All three paths (missing video, missing
slide, stale file) are exercised, not assumed.

⚠️ **What may never go in that bucket is a compliance rule, not a convention:** results PDFs,
biomarker charts, customer photos, anything user-derived, and unapproved copy rendered into an image.
See `03_compliance/CONTEXT.md`, "Public media bucket", and the takedown path beneath it.

**Copy lives in `decks/<slug>.js`, not in `build.js`.** It used to be a hardcoded
`slides` array for the vitamin D article; the 30-day run needs ten decks, so
`build.js` is now the renderer alone. Output is namespaced per deck because ten
decks writing to one directory would silently overwrite each other.

## The title table

**`covers.js` holds one row per topic and every cover asset is generated from it.**
Three consumers, one row:

1. the newspaper headline inpainted into the photo (`inpaint.js --l1 --l2`)
2. the overlay plate on the video cover
3. the typographic cover

The newsprint and the plate say the same words **on purpose**: the newspaper is
the scene, the plate is what makes the tile legible at grid size, where newsprint
is not. Setting them from one row makes a mismatched cover unrepresentable, and a
mismatch is not obviously broken to whoever schedules it, it just looks like a
mistake nobody made on purpose.

The line break is stored, never computed: `inpaint.js` takes two lines and the
newsprint layout depends on where the break falls, so it is an editorial decision.

**A deck MUST set its own `coverPhoto`, and there is no default.** The video cover prints the
headline twice, once in the newspaper inside the photograph and once on the plate. One table drives
both, so they cannot disagree, **but only if the photo is this topic's photo.** `build.js` used to
fall back to `cover-current-b2.jpg` when `coverPhoto` was unset, which carries the vitamin D
headline: a B12 deck rendered "WHAT YOUR B12 REALLY SAYS" on the plate over a newspaper reading "14
SIGNS OF LOW VITAMIN D". The existence check did not catch it, because the fallback file exists. The
fallback is gone (2026-08-11); an unset `coverPhoto` now renders the missing-photo hatch, which is
obviously unfinished in a way a wrong headline is not.

```sh
node plan.js              # the whole run: per topic, per post, and what is owed
node plan.js --commands   # the inpaint calls for the frames still missing
node plan.js --json > run-status.js   # the same plan as data, for review.html
```

**Cover format is a property of the appearance, not the topic.** A topic runs
three times and alternates video / type. The assignment is `(topic + appearance)
% 2` and **not** `day % 2`: 2 divides 10, so day-parity locks every topic to one
format for the whole run while the cell counts still read 5/5/5/5/5/5.
`plan.js` refuses to print a schedule that fails `checkBalance()`.

`--deck` is required rather than defaulted: a silent default renders the wrong
article under the right filename, which stays invisible until it is posted.

**A deck is 6 slides (2 to 7), and `build.js` refuses anything else.** The cover
comes from `covers.js` and the close from `closes.js` under CA-031. Both covers
and all three closes are written for every deck; the schedule decides which pair
a given day uses.

**Ten decks, twenty covers, thirty posts.** A topic's three posts share slides 2
to 7 and differ on the cover format and the close. So the run needs ten body
decks, ten video covers and ten type covers, not thirty of anything.

**All ten decks are written and rendered** (2026-08-11). Each was compressed from
its own published, Ewa-reviewed article in `content/blog/`, which is what close C
links to. Two rules that are easy to break when adding or editing one:

1. **Close B's kit comes from the CA-031 mapping in `slide-8-closes.md`**, not from
   judgement. Kit 1 is testosterone only, so a fatigue, energy or brain-fog topic
   names Kit 2 or Kit 3 and never Kit 1. `closesFor()` throws on an unknown kit,
   but it cannot catch a plausible wrong one.
2. **Source the slides from the article, not from the kit spec.** The
   `free-androgen-index` deck is the worked example: `kit-1-testosterone-health-check.md:72`
   is on record as contradicting `thresholds.md` on how FAI should be framed, so
   that deck follows the article (UK labs report calculated free testosterone for
   men, FAI for women).

The copy has been checked against `03_compliance/CONTEXT.md`. It has **not** been
through `/compliance-preflight`, and CA-031 approves three close templates and one
mapping, not the thirty posts.

The refactor is verified lossless: re-rendering `14-signs-of-vitamin-d-deficiency`
reproduces the committed prototype PNGs **byte-identically** on all six body
slides.

Render online: the slides pull Inter, Merriweather and JetBrains Mono from Google Fonts, and the
fallback face changes the type metrics. Set `CHROME_PATH` if Chrome is not in a standard location.

**`render.js` skips slide 01 by design.** The cover template overlays the headline on a text-free
photo (direction A). The live cover is direction B: the headline is printed inside the photograph and
the band is already baked in, so template-rendering it stacks the headline twice. Under direction B
the cover is the photo itself rescaled to 1080x1350, at `png/slide-01.jpg`.

`cover.js`, `inpaint.js` and `video.js` call Replicate and read `REPLICATE_API_TOKEN` via
`replicate-token.js`, which resolves the repo-root `.env` relative to the checkout. They previously
hardcoded an absolute path that only worked on one machine.

Regenerated slides match the committed originals at 0.996 to 0.998 SSIM; the remainder is font
antialiasing, not content.

> **`build.js` arrived corrupted and was repaired.** Its curly apostrophes and em dashes had been
> double-encoded (`’` stored as `â€™`), plus a stray BOM, so a rebuild produced "Signs arenâ€™t
> diagnoses." on slide 02. The committed PNGs predate the corruption, which is why the damage was
> invisible until the pipeline was actually run. Fixed 2026-08-10. If you edit this file, check it
> stays UTF-8 without a BOM.

## The two things that decide whether this becomes a channel

1. ~~**The headline swap is unsolved.**~~ **Solved 2026-08-10.** The mask was cut against the current
   cover and one swap proven end to end: `cover-why-tired.jpg` carries a different headline on the
   same photograph, and **every pixel outside the mask box is identical to the source, measured at
   1.000 SSIM on all four surrounding regions.** That is the property the whole 30-day run rests on.
   Route is Replicate (Ideogram v3, about £0.07 a call). **Higgsfield cannot do this at all**: no model
   in its catalogue accepts a mask input, so every edit re-renders the whole frame and the subject
   drifts.

2. ~~**Metricool may not be able to schedule an Instagram carousel through its API.**~~
   **Answered 2026-08-10: it can**, with either a still or a video in frame 1. Two 8-slide drafts were
   created on the `Keith Antony AI` brand (`blogId 6693691`), ids `360411107` and `360411483`, and read
   back intact. Mechanics: `media` takes an array of **public URLs**, `instagramData.type = "POST"`, and
   a carousel is just more than one media entry. Metricool re-hosts everything on its own CDN, and the
   frame-1 assets survive unchanged (1080x1350; the video stays h264, 5.04s).
   **Caveat: this proves the scheduling path, not the publish path.** Both are drafts with
   `autoPublish: false` that were never pushed to Instagram, so Instagram's own carousel rules are
   still unexercised.

## Higgsfield findings (2026-08-10)

- No masked inpainting anywhere in the catalogue. This is the blocker above.
- Kling 3.0 has **no `negative_prompt`**. The Replicate call relied on one to stop the printed headline
  warping. Without it, low-motion scenes hold and high-motion scenes do not.
- The pro plan's **unlimited allowance does not apply over MCP** (`unlim.available: false`).
  Generations spend credits: 2 to 7 per image, 5 to 7.5 per video.
- It returns the requested aspect ratio **exactly**, stretching to reach it. Record the source
  dimensions before the call and rescale on return, or faces come back subtly widened.

## Animating the cover

```sh
node build.js --deck <slug> && node render.js --deck <slug>   # the type layer first
node video.js kling lookup cover-<slug>.jpg --deck <slug> --dry   # crop + check, no spend
node video.js kling lookup cover-<slug>.jpg --deck <slug>         # render
node video.js kling lookup ... --recomposite work/x-raw.mp4       # rebuild from a clip
```

**The finished video cover is three layers: animated photo + brand band + type layer.** The type
layer (`cover-overlay.png`) carries the eyebrow, the headline plate, the rule and the footer, and it
is what makes the tile legible at grid size where the newsprint is not. **Always pass `--deck`.**
Without it you get an animated photograph with no headline on it; `video.js` says so loudly, and
refuses outright if a named deck has no rendered type layer.

The plate and the newspaper headline cannot disagree: both are generated from the same `covers.js`
row. But that guarantee only holds if the deck names its own `coverPhoto` — see the title table
section above.

**The band never reaches the model.** It is cropped off before animating and composited back over
every frame at 1080x1350. Until 2026-08-11 the file only *said* that: `crop` appeared once, inside
the comment claiming it was handled, and the one clip rendered against it came back with the lockup
painted over by the model. That defect would have cost all ten clips of the run.

The band height is read from `work/band.png`, never hardcoded, because it is baked at a different
height in every base (195px on base-5 to 263px on base-1). **The crop refuses rather than guesses:**
the source's bottom strip is compared against that band and the run aborts below 0.97 SSIM. A
band-free frame scores 0.034; a cover of different geometry is refused on width alone. Both matter,
because a blind crop removes 262px of photograph and the clip still looks plausible in a terminal.

On the way back the clip is scaled to cover the image area and centre-cropped, **never stretched** —
models return their own aspect (wan gave 560x704 from a near-square frame) and stretching widens the
face. The raw model output is kept in `work/`, because a missing band and a mangled band look
identical once the clip is finished.

## Known defects to fix before this ships

- The brand band is baked at a different height in every base, 195px on base-5 to 263px on base-1.
  It should be composited at a fixed height from the template.
- Source material is the binding constraint, not production: of 18 published articles only about 12
  map to a live kit marker, so 30 daily posts means re-cutting roughly 12 topics two or three ways.
