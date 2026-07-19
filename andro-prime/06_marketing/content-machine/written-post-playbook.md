# Written-Post Playbook: LinkedIn + Facebook + Substack (Spine B)

**Owner:** Keith Antony | **Status:** Craft reference v1, 2026-07-12 (Substack added 2026-07-18) | **Read first:** `founder-content-system.md` §5, `avatar-mark.md`, `../seo-ai-search/content-atomisation-model.md`

The repeatable craft for the three **text-first** platforms. YouTube and Instagram are video (see `long-form-script-playbook.md` and `script-playbook.md`); LinkedIn, Facebook, and Substack are written posts. Same canonical claims, different shape. All three are **derivatives** of the Ewa-signed canonical asset (or, on personal LinkedIn / Substack, Keith's real journey): they may reshape and shorten but **may not add a claim the canonical asset does not already make** (atomisation model). Generate LinkedIn and Facebook with `/script <topic> linkedin` and `/script <topic> facebook`; Substack is produced by repurposing a published article (see the Substack section for the flow).

Every post runs `/compliance-preflight` before it ships. No em dashes (brand rule). No engagement-bait CTAs (both platforms demote them).

---

## LinkedIn (Keith's personal profile, the founder halo and feeder)

**Who and why.** Keith's own profile, not a company page (per `founder-content-system.md` §5; if a company page is stood up later this section is revisited). LinkedIn is the one place the founder identity is expected up front, so the "why I built this" comes out more openly than on Instagram. Mark is a professional, so the avatar fits here well. The job is trust and dwell time, not virality; it feeds the brand one way (personal to brand, audiences never merge).

**Format: the founder POV post.**

1. **Line 1 is the hook**, standalone and punchy (it is all most people see before "see more"). Best archetypes: **Contrarian** (the normal-range wedge as thought leadership) and **Personal story**.
2. **A one-line re-hook / stakes** after the break.
3. **Short paragraphs, never bullet lists** (brand rule, `02_brand/CONTEXT.md`). Tell the story or the insight in Keith's voice. The founder reveal ("that gap is why I'm building Andro Prime") is welcome here, unlike the hook-held rule on video.
4. **End on a genuine question** to the reader (drives comments and dwell). Not "comment YES", not engagement-bait.
5. **CTA is soft and personal-to-brand:** "I'm building X", or a link in the first comment, routed to the quiz / email rung. Never a hard sell, never the Founding-Member list.

**Emotion:** recognition / vindication (professional men who were dismissed) plus credibility. **Funnel:** usually TOFU or MOFU (founder halo and feeder).

**Rails:** Keith's voice only; no pods, no "comment to agree", no automation; substance over reach; plus all standing compliance rails (certainty not cure, no diagnose/treat/fix, Kit-scoped, ashwagandha silent, no TRT, real numbers only).

---

## Facebook (brand page, older segment)

**Who and why.** Brand page, older segment (per the atomisation map: long-form plus search plus Facebook skews older). This reader is more clinical-curious and patient, reads more, and is less driven by a three-second scroll-stop. The job is plain-English education that stands on its own.

**Format: the informational explainer post.**

1. **A calm, plain hook line**, feeling-first but not TikTok-punchy ("If you're over 40 and tired all the time, there's one number a standard blood test often skips").
2. **A few short informational paragraphs** that deliver real value on their own: what the marker is, the "normal is not optimal" idea, why it matters to a tired man. Best archetypes: **Teacher**, **Breakdown**, **Investigator**.
3. **A soft in-post link to the router** (quiz / email rung). The post must stand on its own value; do not lean on link-dumping (Meta is testing link caps for unverified pages), and never engagement-bait.

Upload native (not lazy Instagram cross-posts, which strip audio or misroute). Native video reuse (the long-form and its short pulls) also lives here. Cadence about 2 to 3 per week.

**Emotion:** recognition / curiosity. **Funnel:** usually TOFU or MOFU (older, patient).

**Rails:** original informational framing (Meta demotes compilation/reaction); no engagement-bait; soft router link only; plus all standing compliance rails.

---

## Substack (founder newsletter, Keith-fronted)

**Who and why.** A founder-fronted publication ("Keith Antony · Andro Prime"), Keith's first-person voice, the same halo as personal LinkedIn (identity decision, 2026-07-18; see `../content/social-channel-setup.md`). Its job is **reach, referral traffic, and AI-citation**, not SEO backlinks: links in a Substack post body are `nofollow`, so they pass no ranking authority to androprime.com. Treat it as a republish-and-discovery surface that also earns AI-search mentions, and route readers back to the owned funnel. **Funnel:** usually TOFU or MOFU (founder halo and feeder).

**List decision (2026-07-18): distribution surface only.** Substack captures subscriber emails on its own platform, separate from Customer.io. For now Substack is a distribution surface: route every reader on to our own quiz / Customer.io email rung, and **do not push "subscribe" as the primary CTA or treat the Substack list as owned data**. Actively growing the Substack list as an owned audience would make Substack a new data processor holding customer PII, which needs compliance to approve Substack as a **sub-processor first** (the same gate ManyChat sits behind: `03_compliance` sub-processor schedule + privacy policy). Until that sign-off exists, keep it distribution-only.

**Republish-safe rule (protects the blog's SEO).** The blog pillar is the canonical, indexable, source-of-truth asset. Always publish the article on androprime.com **first**, let it index, **then** republish on Substack, and reference-link back to the canonical URL ("the full version, with sources, lives on our site"). Never publish net-new health content to Substack ahead of the blog: that risks Substack out-ranking our own page and breaks the substantiation trail.

**Two formats:**

1. **Republished pillar (primary).** Take a *published, Ewa-signed* article, add a 2 to 4 line first-person founder intro ("here's what I dug into this week, and why it matters if you're always tired"), paste the article body, and close with a reference link back to the canonical page plus the soft router CTA. Claim-clean by inheritance: it carries the article's Ewa sign-off and adds nothing.
2. **Founder essay (secondary).** Keith's own journey / reflection (the "Read Your Blood" arc in newsletter form). Same derivative discipline: any biomarker claim must already live in a signed canonical asset, real numbers only, retest framed as "how my levels have changed", never "what fixed them". A net-new claim goes to Ewa before it ships.

**Rails:** founder-fronted, Keith's voice only; every issue runs `/compliance-preflight` before it sends (it is advertising, same ASA rules as a landing page); no em dashes; soft router CTA to the quiz / email rung, never the Founding-Member list; UTM the back-links (`?utm_source=substack`). **Cadence:** about 1 per week, repurposed from that week's published pillar. Consistency beats volume; miss an issue rather than ship off-voice or non-compliant.

**Production flow (no `/script substack` mode yet):** Substack issues are assembled by repurposing, not generated fresh. Start from a published article, add the founder intro and back-link, and (for a founder essay) you may draft off `/script <topic> linkedin` as a base and expand it. Pre-flight the finished issue before sending. A dedicated `/script <topic> substack` generator is a future add (logged in `STATE.md`).

---

## All three platforms: shared rules

- **Derivative discipline.** Inherit the canonical asset's claims; add none. A new claim goes back to the article for re-clearance.
- **Earn the share, do not bait it.** "Send this to a mate who's always knackered" beats "comment YES." Bait is demoted on both.
- **Route the CTA our way:** quiz / email rung for cold and warm; the kit only for clearly product-aware readers; never the Founding-Member list.
- **Founder disclosure.** Natural on Keith's personal LinkedIn; the Facebook brand page is inherently brand. Either way, it is advertising.
- **Retest posts** follow the retest rule: "how my levels have changed", never "what fixed them".

---

## Output (what `/script <topic> linkedin|facebook` returns)

Stamp the funnel tag, name the emotion, then write the full post.

**LinkedIn:**

```
Funnel: <TOFU|MOFU> (<Attract|Capture>) | job: <short> | cta: <quiz|email-rung> | format: linkedin-post | marker: <marker>
Emotion: <one>
Source: <Ewa-signed article name, or "Keith's own journey (Line 2)">

POST
<line 1 hook>

<re-hook / stakes>

<short paragraphs, Keith's voice, no bullet lists, founder reveal welcome>

<genuine question to the reader>

[first comment] <soft personal-to-brand CTA + routed link>

Flags: <real numbers needed; claim-inheritance vs the article; anything to watch>
```

**Facebook:**

```
Funnel: <TOFU|MOFU> (<Attract|Capture>) | job: <short> | cta: <quiz|email-rung> | format: facebook-post | marker: <marker>
Emotion: <one>
Source: <Ewa-signed article name, or flag>

POST
<calm plain hook line>

<informational paragraphs that stand on their own value>

<soft in-post link to the router>

Flags: <real numbers needed; claim-inheritance vs the article; native-upload reminder; anything to watch>
```

Close with: "Pre-flight this post with /compliance-preflight before publishing."

---

_Sources: `founder-content-system.md` §5 (the channel rules), `../seo-ai-search/content-atomisation-model.md` (derivative discipline), `avatar-mark.md`, `03_compliance/CONTEXT.md`. Generate with `/script <topic> linkedin` or `/script <topic> facebook`._
