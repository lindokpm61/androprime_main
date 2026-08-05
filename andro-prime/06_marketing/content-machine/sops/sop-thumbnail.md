# SOP: Thumbnail

**Produce the brand-locked thumbnail variants for a video/social asset.** Docs-only: produced by hand in Figma / Canva, no code. Read `templates/thumbnail-template.md` for the design spec. Visual law: `02_brand/visual-identity.md`. Visual north star: the satori OG card at `09_website-app/frontend/app/api/og/blog/[slug]/route.tsx`.

**Trigger:** a YouTube video or a short-form video needs a cover. **Not a written Facebook or LinkedIn post** — see the ruling immediately below.

## RULING (Keith, 2026-08-05): a written post needs no thumbnail. Video does.

**Facebook and LinkedIn text/link posts do not get a bespoke cover.** Reels and videos do, on every surface. This reverses the earlier assumption that a `link-post` owed a 1200x630 export, which had been blocking real posts: on 2026-08-05 two approved, pre-flight-green Facebook posts sat unschedulable behind a thumbnail nobody had made, while the week's Facebook slots went empty.

**Where the image comes from instead: the associated blog article's own photo, used as published.** Take `photoSrc` (or `imgSrc` where the article has no photograph) from the canonical article's frontmatter and attach it. **Do not re-treat it** — no grayscale conversion, no brand overlay, no re-crop. The grayscale rule in step 2 below governs thumbnails you produce, not photographs you inherit from an article.

**Consequence for the gate.** `thumb_spec` on a `facebook/link-post` (and any written-post rendition) is `none`, so `gate_rendition_publish()` skips the thumbnail branch entirely. All four such rows were corrected on 2026-08-05, in the database and in each asset file's `renditions:` block, which is where `thumb` lives. **A written-post rendition carrying a non-`none` `thumb_spec` is now a defect**, not a to-do: it asserts a gate that does not apply and will silently hold the post.

**Roles:** agent specs the text and layout from the template; Keith (or an agent with design access) produces it; Keith approves.

---

## One thumbnail per rendition, not one per size

**Size standardises. Creative does not.** (Keith, 2026-07-31.) Three platforms share the 9:16 canvas and each wants a different image on it, because the cover is doing a different job on each surface. An earlier version of this SOP keyed the filename on the size alone, which made it impossible to store more than one 9:16 cover per asset and quietly assumed a single design served all three.

| Rendition | Size | Filename in `thumb/` |
|---|---|---|
| `instagram` / `reel` | 1080 x 1920 (9:16) | `instagram-reel-9x16.png` |
| `linkedin` / `short` | 1080 x 1920 (9:16) | `linkedin-short-9x16.png` |
| `tiktok` / `short` | 1080 x 1920 (9:16) | `tiktok-short-9x16.png` |
| `youtube` / `short` | 1080 x 1920 (9:16) | `youtube-short-9x16.png` |
| `youtube` / `long-form` | 1280 x 720 (16:9) | `youtube-long-form-1280x720.png` |

**Written posts are deliberately absent from that table.** `facebook/link-post`, `linkedin/link-post` and `linkedin/text-post` are `thumb: none` and produce no file here; their image is the canonical article's own photo (see the ruling above). The 1200x630 rows that used to sit here were removed on 2026-08-05, not left commented out, which is the trap this file warns about elsewhere.

The filename is exactly `<platform>-<format>-<thumb_spec>.png`, which is the rendition's own identity in `content_renditions`. That makes the gate mechanical: for every rendition whose `thumb_spec` is not `none`, a file of that name must exist in the asset's `thumb/` folder before it can be scheduled.

**Where that gate actually runs, since 2026-08-01.** It is `gate_rendition_publish()`, a trigger on `content_renditions` in `09_website-app/database/migrations/20260801_content_state_guards.sql`, firing on INSERT as well as UPDATE. It refuses `scheduled` or later when the thumbnail is not confirmed. **What it is not is the old `thumb_confirmed` frontmatter flag**, which was a boolean a human typed into a markdown file to assert a Drive fact that nothing had checked: the artefact vouching for itself. That flag is retired and putting it back in an asset file is now a HARD failure in `scan.js` and a `content-doctor` I9 violation. Until the Phase 2 Drive job derives confirmation from a real file-exists check on the filename above, confirmation is recorded by a person who looked, through `/content-status`, and the honest reading of the gate today is "somebody confirmed it", not "the file is provably there".

**Model for difference, allow reuse.** If a given asset genuinely reuses one 9:16 cover across all three, copy the file to all three names. That is a per-asset production decision. What the convention must never do is make the difference unstorable, which is what keying on size did.

**Why the job differs by surface** (fill in as the house view settles; these are the structural reasons, not yet Keith's rules):
- **Instagram Reel:** the cover is also the profile-grid tile, and Instagram centre-crops it there, so anything outside the safe square is lost in the grid even though it shows in the feed.
- **TikTok:** the profile grid uses a different ratio again, and the caption overlays the lower band.
- **YouTube Short:** competes in the Shorts feed rather than a grid, so it is read in motion.
- **YouTube long-form:** a click-through fight against a column of suggested videos. The most aggressive of the six: bigger type, higher contrast, usually a face.
- **Facebook / LinkedIn share:** the platform renders the headline as text beside the image, so repeating the headline in the image wastes it.

The blog OG card is generated by the satori route and is left as-is; it is not produced here.

---

## Steps

1. **Take the hook** from the asset (the feeling-first line, in plain English). The marker name is the answer, not the hook.
2. **Apply the brand-locked template** (`templates/thumbnail-template.md`): white ground, black type, Inter `font-black uppercase tracking-tighter`, no accent colour, `rounded-none`, refined monogram. If a photo is used, it is a real man 38-55, rendered grayscale. No stock, no fitness models, no gradients, no glows.
3. **Keep text short** and legible at feed size (a few words). No em dashes in the text.
4. **Run the mini pre-flight on the text** (`sop-compliance-route.md`): no diagnose/treat/cure, no "TRT available," no supplement-efficacy (EFSA-approved wording only; the silent ingredient is never named), no FM-list framing.
5. **Export one file per rendition**, named `<platform>-<format>-<thumb_spec>.png` from the table above, into the asset's `/thumb/` subfolder in Drive (`Content/YYYY-MM/<slug>/thumb/`). One 9:16 export is not three covers: if the three vertical surfaces share a design for this asset, copy the file to all three names deliberately rather than leaving two of them missing.
6. **Keith approves** before it ships (same imagery bar as the Unsplash hold: Keith eyeballs founder-facing imagery first). Once confirmed, `/content-status` flips the matching `content_renditions` row to `thumbnail-done`. That is a database write, not a frontmatter edit: the asset file records which renditions exist, never how far along each one is.

---

## Definition of done

- On-brand per `visual-identity.md`; correct size per surface; text legible muted at feed size.
- Text passed the mini pre-flight; no em dash.
- Keith approved.

## Anti-checklist (stop if any is true)

- Stock photo, fitness model, gradient, glow, colour accent, or rounded corners.
- The thumbnail text makes or implies a claim the canonical asset does not.
