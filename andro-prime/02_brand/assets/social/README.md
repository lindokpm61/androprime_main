---
doc: social-banner-assets
status: live
owner: Keith Antony
consumed_by: X profile header, YouTube channel banner
last_updated: 2026-07-30
---

# Social banner assets

Channel headers for the founder accounts. Identity decisions (handle, display name, bio, link) live in [`06_marketing/content/social-channel-setup.md`](../../../06_marketing/content/social-channel-setup.md); this folder holds the files themselves.

Both banners share one design system: pure black, the oversized dark-grey `A` watermark, the AP wordmark lockup, two full-width white rules framing a centre block, Keith's black-and-white cutout on the right, and a marker strip along the bottom. Same headshot as the LinkedIn, Instagram and YouTube avatars, which is what carries cross-platform recognition.

## Files

| File | Size | Channel | Live |
| --- | --- | --- | --- |
| `x-header-1500x500-black.png` | 1500 x 500 (3:1) | X, `@KeithAndroPrime` | 2026-07-30 |
| `youtube-banner-2560x1440-black.png` | 2560 x 1440 (16:9) | YouTube, `@keithandroprime` | 2026-06-28 |

## Copy on each

Identical except the sub-line, which is per-channel.

| Slot | X | YouTube |
| --- | --- | --- |
| Eyebrow | `FOUNDER-LED · UK` | `FOUNDER-LED · UK` |
| Headline | `DON'T GUESS. / TEST.` | `DON'T GUESS. / TEST.` |
| Sub-line | `@KEITHANDROPRIME · DAILY · EDUCATION, NOT MEDICAL ADVICE` | `@KEITHANDROPRIME · NEW SHORTS WEEKLY` |
| Marker strip | `VITAMIN D · B12 · FERRITIN · hs-CRP · TESTOSTERONE` | same |

**The markers are not decoration, they are a compliance constraint.** Every marker named must sit in a currently available kit. Vitamin D, B12, ferritin, hs-CRP and testosterone all do. Do not add cortisol, thyroid or metabolic markers to this strip until those kits launch.

The X sub-line carries `EDUCATION, NOT MEDICAL ADVICE` and the YouTube one does not, because the YouTube About text carries the disclaimer in full and the X bio carries it in 160 characters that are already full. Both profiles are covered; the banners differ.

## Safe areas

**X.** The profile photo overlays the bottom-left and the Follow button the bottom-right. Keep text out of the left 240px and the bottom 90px, and out of the bottom-right 220 x 90px. X also crops the top and bottom on narrow viewports, so all text must sit in the middle 60% vertically.

**Verified live 2026-07-31 by screenshot, and the vertical rule turned out to be the one that bites.** The horizontal safe area held: the marker strip starts right of the avatar as intended. The vertical did not. X renders the header wider than 3:1 in the profile column and crops top and bottom, which removed **the marker strip and the lower white rule entirely**, and left the `EDUCATION, NOT MEDICAL ADVICE` sub-line sitting on the crop boundary. There is dead black space above the top rule doing nothing.

**Cause:** the X version was recropped from the 16:9 YouTube frame with the content block left where it sat, and that block sits below the true vertical centre of a 3:1 canvas. **Fix on the next revision:** re-centre the block, and either drop the marker strip on X (3:1 has less room than 16:9 and the strip is the least load-bearing element) or move it above the lower rule. Do not simply extend the canvas: the disclaimer line is the piece that must not be croppable.

**YouTube.** Different safe area entirely, which is why the X version is a recrop rather than a resize. The 1546 x 423 centre region is the only part guaranteed visible across TV, desktop and mobile.

## Regenerating

Source of truth for the design is the Figma file: `https://www.figma.com/design/O4K7R8RlCKRM7EQ7WxFtCn`. Export a new frame from there rather than editing a PNG.

**Do not regenerate these through an image model.** The X version was produced that way on 2026-07-30 and it worked, but the failure mode is specific and serious: image models rewrite faces. That cutout is a real photograph of Keith and it is the recognition asset across four channels, so any generated output has to be checked against the source pixel by pixel, and the original composited back over it if it has drifted at all. Figma is the safer route for anything beyond a text swap.

A 2172 x 724 intermediate exists in Keith's Downloads from the 2026-07-30 generation. **It is superseded and should not be used:** it carries the old `@KEITHANTONYAP` handle, which was changed the same day. If a higher-resolution X header is ever wanted, regenerate from Figma rather than upscaling that file.

## Not filed here

- The **white / light** YouTube variant (`YouTube Banner 2560x1440.png` in Keith's Downloads, 2026-06-28). Matched to the black one and built from the same cutout. File it here if it goes live anywhere; the black variant is what is currently published.
- The **background-removed cutout** (`keith-bw-nbg.png`), which feeds all four channels. It lives in Figma only. Worth committing to `../` when convenient, since it is the shared dependency behind every banner and avatar in the stack.
