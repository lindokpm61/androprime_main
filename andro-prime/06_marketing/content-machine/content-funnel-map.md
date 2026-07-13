# Content Funnel Map (Spine B and the content engine)

**Owner:** Keith Antony | **Status:** Decision + convention v1, 2026-07-09 | **Read first:** `avatar-mark.md`, `founder-content-system.md`

Defines the **content/acquisition funnel**: which content does which job on the way to a sale, and the markup every asset carries so its stage and purpose are explicit. This is the pre-click funnel. The post-click **lifecycle funnel** (email sequences, result-state routing, retest, churn) is owned by `07_sales/CONTEXT.md` and this doc defers to it for BOFU and Retention mechanics. The two connect at exactly two seams: the **email rung** and the **kit purchase**.

This consolidates three things already in the repo: the lifecycle funnel (`07_sales`), the CTA routing rules (`content/youtube-founder-journey-strategy.md` section 7), and the feeling-first content tags (`master-plan/2026-06-26-feeling-first-content-strategy.md`). It does not replace them.

---

## The four stages

| Stage | Job | Awareness | Feeling-first tag | CTA destination |
| --- | --- | --- | --- | --- |
| **TOFU (Attract)** | Stop the scroll, name the feeling, plant the problem. No selling. | unaware to problem-aware | feeling | Soft: follow / watch, at most the free quiz. Never a kit. |
| **MOFU (Capture)** | Teach the mechanism ("test, don't guess"), capture the email. This is Path B. | problem-aware to solution-aware | clinical | The free email rung / quiz. |
| **BOFU (Convert)** | Convert to a kit purchase. Which kit, why us, objections, dashboard proof. | solution-aware to product-aware to customer | solution | The kit (1/2/3), intent-matched via the central router. |
| **RETENTION + Advocacy** | Retest loop, subscription attach, "how my levels changed", referral, testimonials that feed the top. | customer to advocate | (post-purchase) | Retest kit, subscription, referral. |

**Rule of thumb for stage:** the stage is set by the content's **job**, not its format. A short video is usually TOFU, but a "which kit is right for you" short is BOFU. A long video is usually MOFU, but the founder Ep 0 baseline is TOFU. Tag by job.

---

## What content sits where

**TOFU (Attract).** Short-form Reels / Shorts / TikTok (feeling hooks from `/hook` and `/script`); symptom-language blog hubs ("why am I always tired", "brain fog"); the founder-journey Ep 0 baseline; Facebook informational posts for the older segment. Metric: reach, 3-second retention, follows. Compliance note: TOFU never carries a kit CTA and never a claim; it opens the loop, it does not sell.

**MOFU (Capture).** Long-form YouTube explainers (`/script <topic> long`, Line 1); the marker explainer articles ("ferritin blood test", "what your GP skips"); the symptom quiz; the symptom-guide lead magnet; the email nurture that follows capture (seq-06 quiz-no-purchase bridges here). Metric: email captures, quiz completions. This is the heart of Path B: symptom guide / quiz to email to nurture to kit.

**BOFU (Convert).** Kit pages; comparison and alternative pages ("vs Medichecks", "InsideTracker alternative"); results-dashboard demo; pricing and "how it works"; objection content; the waitlist and conversion sequences (seq-01, tail of seq-06). Metric: kit purchases, conversion rate. Routing: intent-match to the best live kit via the central router (inflammation/CRP to Kit 2 now; liver to email capture until the kit launches).

**RETENTION + Advocacy.** Founder-journey Ep 2+ retest checkpoints ("how my levels have changed", never "what fixed them"); subscriber onboarding (seq-04, includes the Day-75 retest prompt); churn save (seq-05); the referral programme; testimonials and UGC that feed back into TOFU. Metric: attach rate (canonical target 15%+), tenure, retest rate, referrals. Mechanics owned by `07_sales`.

---

## Where the two funnels meet

- **Seam 1, the email rung.** TOFU and MOFU content routes cold and warm viewers to the free quiz / symptom guide, which drops them into the email nurture. That nurture is the start of the lifecycle funnel (`07_sales` Funnel Stage Reference: "Quiz complete, no purchase" to seq-06; "Waitlist" to seq-01).
- **Seam 2, the kit purchase.** BOFU content converts to a kit. The `purchase` event is the lifecycle funnel's "Kit purchased, result pending" stage. From there the post-click funnel (result-state routing, subscriber, retest, churn) takes over, and Retention content supports it.

Never route content into the Founding-Member list (CQC/ASA). Content CTAs go to the quiz / email rung, Kit 1/2/3, retest, or referral only.

---

## The markup (every asset carries this)

Tag every content asset with a funnel block so its stage and job are explicit and reportable. For MDX articles, put it in frontmatter. For video scripts and hooks, put it in the header. The content-machine skills (`/hook`, `/script`) stamp it automatically; add it by hand to articles and older assets.

Fields:

- `funnel_stage`: `TOFU` | `MOFU` | `BOFU` | `RETENTION`
- `funnel_job`: short phrase, the specific activity (e.g. "problem-aware scroll-stop", "mechanism explainer + email capture", "kit decision / objection handling", "retest loop")
- `awareness`: `unaware` | `problem-aware` | `solution-aware` | `product-aware` | `customer` | `advocate`
- `cta`: `follow` | `quiz` | `email-rung` | `kit-1` | `kit-2` | `kit-3` | `retest` | `referral`
- `format`: `short-video` | `long-video` | `article` | `email` | `social-post`
- `marker` (optional): the biomarker the asset is built on (`ferritin`, `vitamin-d`, `b12`, `hs-crp`, `testosterone`)
- `content_type`: `educational` | `personal-story` | `proof-result` | `objection-comparison`. This is the asset's **JOB axis**: what kind of piece it is (teaching a mechanism, telling Keith's own story, showing a result, or handling an objection/comparison), distinct from the script playbook's story structures (which describe how a piece is told, not what job it does).

For founder content, this whole markup block now lives as **asset-file frontmatter** in `content-machine/assets/` (one file per idea; see `templates/asset-file.md`) rather than a standalone header. Top-level `format` still applies to single-format assets (an article, an email); founder assets instead carry a `format` per rendition, since one shoot fans out to several platform shapes.

Example (short-form, TOFU):

```yaml
funnel_stage: TOFU
funnel_job: problem-aware scroll-stop (ferritin / fatigue)
awareness: problem-aware
cta: quiz
format: short-video
marker: ferritin
```

Example (long-form explainer, MOFU):

```yaml
funnel_stage: MOFU
funnel_job: mechanism explainer + email capture (ferritin)
awareness: solution-aware
cta: email-rung
format: long-video
marker: ferritin
```

---

## How to use it when planning content

1. Decide the **job** first (attract / capture / convert / retain). That sets the stage.
2. Pick the **format and CTA** the stage allows (TOFU never sells; BOFU routes to a kit).
3. Generate with the right tool (`/hook` and `/script` for TOFU/MOFU short and long; `/article` for MOFU/BOFU written).
4. Confirm the tag block the skill stamped, and file the asset by its stage.
5. Read coverage by stage: a healthy engine has enough TOFU to feed MOFU, enough MOFU to feed BOFU, and Retention content live before the first retest lands.

**Balance rule:** at Phase 0a volume the constraint is TOFU reach (cold attention) and the MOFU email rung (turning it into a list). BOFU content is low-effort to produce and easy to over-index on; do not build a shelf of kit pages while the top of the funnel is empty.

---

_Sources consolidated: `07_sales/CONTEXT.md` (lifecycle funnel), `content/youtube-founder-journey-strategy.md` section 7 (CTA routing), `master-plan/2026-06-26-feeling-first-content-strategy.md` (feeling/clinical/solution tags), `master-plan/2026-06-26-tier2-sales-creation-plan.md` (the plays and the email rung). Plan and tag content with this map; generate with `/hook` and `/script`._
