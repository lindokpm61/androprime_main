# Social Channel Setup: Founder Channels (IG + YouTube + Substack)

**Created:** 2026-06-27 | **Owner:** Keith | **Status:** Setup reference. Founder-fronted short-form is the lead free top-of-funnel lever in the [Tier 2 plan](../master-plan/2026-06-26-tier2-sales-creation-plan.md) (Play 1). Voice + topic per [feeling-first doctrine](../master-plan/2026-06-26-feeling-first-content-strategy.md). Compliance per `03_compliance/CONTEXT.md`.

## Decisions (locked 2026-06-27)

- **Founder-fronted, dedicated accounts:** Keith's face/voice/own test data, NOT a faceless `@androprime` logo account, and NOT Keith's existing personal profiles (don't mix personal life; keeps analytics clean).
- **Founder-branded handles** (keeps the personal performance edge + builds the brand asset):
  - Instagram: **`@keith.antony.tech`** _(superseded 2026-07-19, see note below)_
  - YouTube: **`@keithandroprime`**
- **Public name = "Keith Antony"** (the pseudonym), never the legal surname.
- **Also grab a brand handle** on both platforms to hold the name (secondary/repost only). **YouTube: reserved 2026-07-09 as `@androprime-men`** (the exact `@androprime` was not used). **Instagram: `@androprime` still to grab** (or `@androprime.men` if the exact is taken). These are placeholders, not channels: no content, no branding, no posting.

**Instagram handle change (2026-07-19):** the `@keith.androprime` handle above is **superseded**. Instagram kept auto-deactivating freshly created accounts, so the founder presence moves to an **existing, established account: `@keith.antony.tech`**. The handle is a non-ideal fallback (chosen over `@keith.antony.ai`, because "ai" in a health handle wrongly signals AI-generated content and undermines trust); the **branding is carried by the profile Name field and bio, not the handle**. When creating the `@androprime` placeholder, create it from inside the established account (not a cold signup) so it survives the same deactivation pattern.

---

## Instagram

- **Account type:** Professional → **Creator** (Reels insights, public-figure framing).
- **Username:** `@keith.antony.tech` (existing established account; the planned `@keith.androprime` kept being auto-deactivated as a new account, see the 2026-07-19 note in Decisions). The handle is just the URL slug; the branding lives in the Name field and bio below.
- **Name field** (bold, searchable, 30 char): `Keith Antony · Andro Prime`
- **Category:** Health & Wellness Website (or "Entrepreneur").
- **Profile photo:** clean headshot of Keith (same image as YouTube). Not the logo.
- **Bio** (≤150 char):
  > Stop guessing why you feel flat.
  > Men's health, read from your blood 🩸
  > Founder, Andro Prime. UK.
  > Education, not medical advice.
  > Find your test ↓
- **Link:** feeling-first landing page or `/test-selector`, tagged `?utm_source=instagram&utm_medium=bio`. Link direct unless you need >1 link.

## YouTube

- **Setup:** create as a **Brand Account** (transferable, add managers, keeps personal Gmail off it). Not a personal-channel.
- **Channel name:** `Keith Antony · Andro Prime`
- **Handle:** `@keithandroprime`
- **Avatar:** same headshot as IG. **Banner:** tagline ("Men's health, read from your blood") + handle + "New Shorts weekly".
- **Description (About):**
  > I'm Keith Antony, founder of Andro Prime. I got tired of being told my bloods were "normal" while feeling anything but. So I started measuring.
  >
  > This is the plain-English version of what your blood can actually tell you: why you're tired, why recovery slowed down, what "normal testosterone" really means, and the markers most men never get tested. No hype, no magic supplements. Just the numbers and what they mean.
  >
  > I test myself and share the real results.
  >
  > Education, not medical advice. Always speak to your GP about your health.
  >
  > Find out what your blood says → [link]
- **Keywords/tags:** men's health UK, blood test, testosterone, fatigue, tiredness, vitamin D, B12, ferritin, recovery, men's health over 40, at home blood test.
- **Links:** Website (quiz, `?utm_source=youtube`), Instagram.
- **Banner:** built in Figma: safe-area-correct (1546×423 essentials), founder photo placed + feathered, white primary + black inverted alt. File: `https://www.figma.com/design/O4K7R8RlCKRM7EQ7WxFtCn`. Publish: pick a frame → export 2560×1440 PNG (white frame's red safe-area guide already removed). Both complete and matched: white and black both use the background-removed cut-out (`keith-bw-nbg.png`); figure on pure white, or emerging from black. Pick whichever reads best.

---

## Substack (founder newsletter, added 2026-07-18)

- **Account type:** a founder-fronted **publication**, Keith's first-person voice (identity decision 2026-07-18). Not a faceless brand publication. Matches the LinkedIn / YouTube founder halo.
- **Publication name:** `Keith Antony · Andro Prime` (matches YouTube / IG).
- **Byline / author:** Keith Antony (the pseudonym). Never the legal surname, same as everywhere else.
- **Handle / URL:** `keithandroprime.substack.com` (matches `@keithandroprime`). A custom domain (e.g. a subdomain of `androprime.com`) is an optional later upgrade: better brand and a cleaner canonical story, not needed to start.
- **Avatar:** same headshot as IG / YouTube. **Not the logo.**
- **About / bio** (pre-flight-clean, mirror the IG bio):
  > Stop guessing why you feel flat.
  > Men's health, read from your blood.
  > I test myself and share the real numbers, in plain English.
  > Founder, Andro Prime. UK.
  > Education, not medical advice.
- **What it does (role):** a **distribution + discovery + AI-citation surface**, not an SEO backlink play (body links are `nofollow`, no ranking value). Republish published, Ewa-signed pillars with a short founder intro, and route readers back to the site + quiz / email rung. Full craft + the republish-safe and list-routing rules: `../content-machine/written-post-playbook.md` (Substack section).
- **List rule (2026-07-18):** distribution surface only. Route readers to our own quiz / Customer.io rung; do not push "subscribe" as the primary CTA. Growing the Substack list as owned data needs compliance to approve Substack as a **data sub-processor first** (the ManyChat gate).
- **Hold the brand name:** grab `androprime.substack.com` as a placeholder (no content), same as the IG / YouTube brand-handle holds.
- **Rails:** every issue is advertising: run `/compliance-preflight` before publishing, same ASA rules as a landing page. UTM the back-links (`?utm_source=substack`). No em dashes. Publish the blog article first and reference-link back so we never out-rank our own page.

---

## Shared rules

1. **Hold the brand name** on both platforms with a secondary placeholder. YouTube done (`@androprime-men`, 2026-07-09); Instagram `@androprime` outstanding. Sign into each once a quarter: both platforms reclaim handles from dormant, empty accounts, so a bare placeholder is not a permanent lock.
2. **Avatar and Name field identical across both:** discoverability. (Applies to the *primary* founder accounts, not the placeholders.) **Handles now diverge** (IG `@keith.antony.tech`, YouTube `@keithandroprime`) because Instagram forced the existing-account fallback, so the **Name field `Keith Antony · Andro Prime` and the shared headshot** carry cross-platform recognition, not the handle.
3. **Every post is advertising for the business.** A founder account is not a compliance loophole: same ASA rules as a landing page (no diagnose/treat/cure, no supplement-efficacy, ashwagandha silent). Run every caption/script through the pre-flight, like the launch hooks ([track-a-launch-copy.md](track-a-launch-copy.md)).
4. **UTM every link** so IG/YT → quiz → sale attributes (Track A tracking).
5. The **bios themselves are pre-flight-clean:** "education, not medical advice" disclaimer, no health claims.
6. **Cross-link** IG ↔ YouTube.

## Content source

Hooks/scripts: [track-a-launch-copy.md](track-a-launch-copy.md), drawn from the feeling keyword set (`../seo-ai-search/tools/staging-feeling-first/`). Every hook must map to a marker in a currently-available kit (testosterone; Vitamin D, B12, ferritin, hs-CRP); do not promote cortisol/thyroid/metabolic tests until those kits launch.
