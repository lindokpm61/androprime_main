# Content Machine — Blueprint

**Owner:** Keith Antony | **Status:** Framework v1, 2026-07-06 | **Read first:** `CONTEXT.md`

The full picture: the loop, the channel matrix, how the two spines interconnect, the trust ladder mapped to Andro's real assets, and the measurement stage. Everything here is governed by `03_compliance/CONTEXT.md` and `02_brand/tone-of-voice.md`.

This blueprint imports the useful craft from the two research files in the founder's reference set (`content-playbook-2026.md`, `platforms-vs-gurus-2026.md`) **through the reality-check filter**: only tactics the platforms themselves confirm, never the unverified guru numbers, and never the tactics the platforms now penalise. Where the research and Andro's existing rules already agree (originality, feeling-first hooks, named expertise, no AI tells), that is the point: this business is already built for what the platforms now reward.

---

## 1. The loop

```
                 ┌─────────────────────────────────────────────┐
                 │                   CREATE                     │
   Spine A ──►   │  Blog pillar (canonical, Ewa-signed)         │
   Spine B ──►   │  Founder idea (script, Ewa-signed if claim)  │
                 └───────────────────────┬─────────────────────┘
                                         │  canonical asset
                                         ▼
                 ┌─────────────────────────────────────────────┐
                 │        MANAGE  (this workspace)              │
                 │  one calendar · one compliance route         │
                 │  compliance-preflight → Ewa (if new claim)   │
                 └───────────────────────┬─────────────────────┘
                                         │  cleared asset
                                         ▼
                 ┌─────────────────────────────────────────────┐
                 │                 DISTRIBUTE                    │
                 │  atomise → per-channel derivatives           │
                 │  route CTAs via central kitCTA config        │
                 │  schedule: blog · YT · Shorts/Reels · LI ·   │
                 │            Facebook · email                   │
                 └───────────────────────┬─────────────────────┘
                                         │
                                         ▼
                 ┌─────────────────────────────────────────────┐
                 │                  MEASURE                      │
                 │  feeds v4 KPI framework                       │
                 │  (blocked on GA4 + consent — see STATE)       │
                 └─────────────────────────────────────────────┘
```

**One canonical asset in, many derivatives out, no new claims, one calendar, one gate.**

---

## 2. The channel matrix

Built on the atomisation map in `seo-ai-search/content-atomisation-model.md` §2, with Facebook promoted to a first-class channel and each row corrected for platform reality. "Segment" uses the v4 split (younger ~30-45 / older ~45-70). CTA targets follow the central `kitCTA` config; **no channel CTA ever routes to the founding-member list** (`03_compliance/CONTEXT.md` Special Cases).

| Channel | Format | Derived from | Segment / ICP | Cadence (sustainable) | CTA target |
|---|---|---|---|---|---|
| **Blog (canonical)** | Long-form hub + spokes, MDX | brief → `/article` | Older, search intent (ICP 1/2/3) | Mon + Thu (locked) | `kitCTA` at end only |
| **YouTube long-form** | 8-12 min Keith explainer | canonical asset | Older | 1 per published pillar | Description router |
| **YouTube / short-form video** | 30-60s vertical | canonical asset | Both | ~1-3 / week | Pinned + description router |
| **Instagram Reels** | 30-60s vertical, feeling-first hook | canonical asset | Younger + both | ~1-3 / week | Comment-keyword DM (ManyChat) + bio link → router |
| **TikTok** (optional) | same vertical cut | canonical asset | Younger | opportunistic | Bio link |
| **Facebook** | Native informational post / short video | canonical asset | **Older (primary)** | ~2-3 / week | In-post link → router |
| **LinkedIn (Keith personal)** | Native text + short video | canonical asset or founder moment | Awareness, ICP 1/4, B2B/press | ~2-3 / week | Soft, brand halo / newsletter |
| **Email (Customer.io)** | Sequence hook + body | canonical asset | Both, conversion | per sequence | In-email kit CTA (never FM) |
| **GEO / AI-citation** | Schema, Q&A, citable claims | canonical asset | n/a | inherent | Brand + canonical URL |

**Segment rule of thumb (unchanged from the atomisation model):** long-form + search + Facebook lean older; short-form discovery leans younger; email + LinkedIn serve both / awareness. Same claims everywhere, different shape and platform.

### Per-channel reality-check corrections (the important part)

- **Facebook** is the older segment's home in Engine B. Meta now demotes unoriginal / compilation / reaction content and engagement-bait CTAs ("comment YES"), and is testing link-post caps for unverified pages. So Facebook derivatives are **native uploads with original framing** (not lazy Instagram cross-posts, which can strip licensed audio or misroute a Reel to Feed), no engagement-bait, and the link sits in a post that stands on its own value. Use Facebook's own audio library to avoid audio stripping.
- **Instagram / Reels / Shorts:** the first frame is the hook. About half of Reels are watched muted, so the hook must work visually and in on-screen text, feeling-first. Sends (DM shares) help reach new people, but they are one top signal among watch time and likes, not a magic multiplier; earn genuine shares, do not bait them.
- **LinkedIn** rewards substance and dwell time, not virality or volume. No engagement pods, no "comment to agree," no comment automation. One strong hook on line 1, ends on a question, no bullet lists (per `02_brand/CONTEXT.md`). It stays Keith's personal founder halo and one-way feeder into the brand (`youtube-founder-journey-strategy.md` §2).
- **YouTube** is length-agnostic (there is no "ideal length"); it optimises for satisfaction and retention, not a length target. Custom thumbnails matter (see the thumbnail SOP). Podcasts and TV viewing are large and growing, which suits Keith's long-form explainer line.
- **Cadence everywhere: consistency beats volume.** The platform data is clear that fewer, better posts out-perform high-frequency dumping on IG / LinkedIn / YouTube; the only real penalty is going silent. Do not chase "post 100x a day." Sustainable is the target because Keith is the bottleneck.
- **Originality is now enforced on every discovery surface.** This kills the guru "hook-swap off someone else's viral clip" and "repost everything" tactics. It also happens to be exactly what Andro already does: first-person Keith, real numbers, feeling-first, no reposting. Keep it that way.
- **Comment-to-DM (ManyChat) is adopted on Instagram** as a conversion mechanism: a user comments a keyword ("tired," "brain fog") and the tool auto-DMs a link to the test-selector. It is user-initiated (they comment first), so it is the sanctioned ManyChat use, not unsolicited mass-DM (which stays a spam-flag and is not adopted). It is compliance-gated (DM copy pre-flighted, live-kit keywords only, never routes to the FM list) and requires ManyChat to be added as a data sub-processor first. On the **Facebook feed** a comment trigger reads as engagement-bait (demoted), so keep the native in-post link there. See `sops/sop-comment-to-dm.md`, `templates/dm-keyword-map.md`.
- **Not adopted:** DM automation as a ranking "hack" (it is a conversion tool, not a reach signal), and any of the unverified guru figures ("sends worth 3-5x likes," "two ideal YouTube lengths," "7-11-4 as a ranking rule").

---

## 3. How the two spines interconnect

The blog pillar is the substantiation record; the founder brand is the reach and trust engine that points back to it.

```
  Spine A (blog pillar, Ewa-signed)  ──atomise──►  YT explainer, Shorts, Reels, FB post, email hook
        ▲                                                        │
        │  cites / links up                                      │  drives discovery
        │                                                        ▼
  Spine B (founder journey + LinkedIn halo)  ──feeds──►  new audience → blog / quiz / email → kit
```

- Spine A gives Spine B its facts and its compliance cover: a Reel or FB post inherits the blog asset's Ewa sign-off and cannot exceed it.
- Spine B gives Spine A its distribution: the older man who never enters a gym and never converts off a feed is reached by Keith's YouTube explainer and Facebook post, then researches on the blog, then buys.
- LinkedIn is the founder halo and the one-way feeder (personal → brand), not a brand channel. Cross-promotion runs one direction; the audiences never merge (`youtube-founder-journey-strategy.md` §2).

---

## 4. The trust ladder, mapped to Andro's real assets

The research file's "trust ladder" ranks the signals that make an audience believe you. Andro already holds several of the strongest rungs; the machine's job is to surface them consistently, inside compliance, never to invent them.

| Rung (strongest first) | Andro's real asset | How the machine uses it |
|---|---|---|
| Warm endorsement | PT / affiliate referral (Engine A, currently frozen) | Dormant module; unfreeze on a Keith decision. |
| Proof of audience | Building (new channels) | Grows with consistency; do not fake it. |
| Demonstration of ability in-content | Keith reading real blood numbers on camera; marker explainers | The founder-journey line and long-form explainers. |
| Group / warm testimonials | Customer results over time (post-GA4) | Only with consent and approved wording; no bespoke interpretation. |
| Proof of personal result | Keith's own baseline → retest arc | Founder-journey series; "how my levels changed," never "what fixed them." |
| Borrowed verified proof | Cited sources, EFSA wording, NICE thresholds | On-page and in scripts; boosts AI-citation (Pillar F). |
| Third-party verification | UKAS ISO 15189 lab (Vitall); GMC-registered GP (Ewa, GMC 4758565) | The named authority anchors, per the trust-signal verb test. |

**Compliance overrides the ladder every time.** The verb test still applies: a GP *set / signed off* the recommendation logic (safe); a GP does *not* review or interpret an individual's results (not safe). Use "Ewa-approved recommendation logic," never "reviewed by our doctor."

---

## 5. The measurement stage

Per output, feeding the v4 KPI framework (atomisation model §7, `youtube-founder-journey-strategy.md` §9):

- **Blog:** rankings on the underserved cluster, organic sessions, content → email → kit conversion, AI-citation count (Pillar F).
- **YouTube:** views, retention, subscribers, click-through to the router.
- **Short-form (Reels / Shorts / TikTok):** reach, saves and sends (discovery proxy), link taps, and comment-to-DM opt-ins + DM link taps (ManyChat).
- **Facebook:** reach, native-video retention, link taps.
- **LinkedIn:** dwell / comments (not likes), profile-to-content fit, feeder click-through.
- **Email:** list growth from the entry rung, nurture → kit conversion.

**Hard dependency:** GA4 + consent banner. Server-side plumbing is deployed; the client GA4 + consent banner are pending. Until they are live, content → email → kit attribution is impossible and the measure stage runs on platform-native metrics only. Tracked in `STATE.md` and the marketing analytics docs. Do not promise attribution the plumbing cannot deliver.

---

## 6. Cross-references

- Atomisation map + CTA routing: `seo-ai-search/content-atomisation-model.md`
- GTM frame (two engines): `master-plan/phase0-gtm-v4.md`
- Founder YouTube lines: `content/youtube-founder-journey-strategy.md`
- Founder accounts / bios: `content/social-channel-setup.md`
- Feeling-first doctrine: `master-plan/2026-06-26-feeling-first-content-strategy.md`
- Voice / banned words: `02_brand/tone-of-voice.md`, `02_brand/prohibited-terms.md`
- Compliance law: `03_compliance/CONTEXT.md`
- The research inputs (founder's reference set, not repo source-of-truth): `content-playbook-2026.md`, `platforms-vs-gurus-2026.md`
