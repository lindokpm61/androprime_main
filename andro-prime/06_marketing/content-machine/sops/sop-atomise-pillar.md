# SOP — Atomise a Pillar

**Turn one canonical, Ewa-signed blog asset into its per-channel derivatives, with no new claims.** Extends `seo-ai-search/content-atomisation-model.md` §5. Read `content-machine-blueprint.md` §2 (channel matrix) first.

**Trigger:** a blog pillar (hub or spoke) is live (or draft-signed) and it is that pillar's turn on the calendar.

**Roles:** agent produces derivatives; Keith records any founder video and approves; Ewa is only involved if a derivative would add a claim (it should not).

---

## Steps

1. **Confirm the source is signed.** The canonical asset must be Ewa-signed (or blanket-approved under the CA-011 pattern). If it is not, stop; atomisation cannot outrun sign-off.
2. **Pull the claim set.** List the claims the canonical asset actually makes (markers, EFSA supplement wording, thresholds, "next step" language). This is the ceiling. **No derivative may exceed it.**
3. **Identify the feeling hook and the live-kit marker.** Lead every derivative on the body-feeling; confirm the marker maps to a live kit (T; Vit D / B12 / ferritin / hs-CRP). If it does not, the derivative routes to email capture, not a kit.
4. **Produce the derivatives** (use the templates):
   - YouTube long-form script (per `youtube-founder-journey-strategy.md`; Keith records) → `templates/youtube-description.md` for the description + router.
   - 30-60s vertical pulls for Shorts / Reels (/ TikTok) → `templates/short-form-script.md`.
   - Facebook native post → `templates/facebook-post.md` (native upload, original framing, no engagement-bait, own audio).
   - LinkedIn post (Keith's voice) → `templates/linkedin-post.md`.
   - Email hook + body for the sequence → hand to `/cio-sequence-build` (copy lives in `09_website-app/frontend/email-templates/`).
   - Thumbnails for each video/social surface → `sop-thumbnail.md`.
5. **Route the CTA.** Set / confirm the pillar's target in the central `kitCTA` config (`content-atomisation-model.md` §4). Intent-match to the best *live* product; where none exists, route to email capture. **Never the founding-member list.**
6. **Run the compliance route.** Every derivative through `sop-compliance-route.md`. Because they inherit the signed canonical asset and add no claim, they should pass pre-flight without a fresh Ewa step. Any 🔴, or any new claim, sends that derivative back.
7. **Schedule.** Place each on the `unified-content-calendar.md` weekly view; attach thumbnail; queue on the platform. Keith presses go.
8. **Log for measurement.** Note the derivative set against the pillar so reach / clicks can be attributed later (platform-native until GA4 live).

---

## Definition of done

- Every derivative carries only claims present in the signed canonical asset.
- Every hook is feeling-first and maps to a live-kit marker.
- CTAs route via `kitCTA`, never to the FM list.
- Each passed pre-flight; thumbnails attached; scheduled with Keith's go.

## Anti-checklist (stop if any is true)

- The canonical asset is not signed.
- A derivative introduces a marker, claim, or benefit the canonical asset does not make.
- A hook promotes a marker whose kit is not live.
- A CTA points at the FM list or implies TRT is available.
