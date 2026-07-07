# Tier 2 Build Backlog — Trackable Checklist

**Created:** 2026-06-27 | **Owner:** Keith | **Status:** Live tracker. Tick items as completed. Synthesises the build work implied by this session's decisions. Source docs: [Tier 2 sales plan](../../06_marketing/master-plan/2026-06-26-tier2-sales-creation-plan.md), [LTV:CAC model](../../01_strategy/ltv-cac-profitability-model-2026-06-26.md), [feeling-first doctrine](../../06_marketing/master-plan/2026-06-26-feeling-first-content-strategy.md), [attach playbook](../../07_sales/funnel/supplement-conversion.md), [day-15-45 retention](../../08_customer-journey/day-15-45-retention-experience-2026-05-08.md).

**Tags:** `[NEW]` build from scratch · `[FINISH]` exists as draft/spec, needs completing/activating · `[VERIFY]` likely exists, confirm it works.

---

## ⭐ Minimum to start creating sales THIS week (Track A core)

- [x] `[DONE 2026-07-02]` Instagram + YouTube accounts set up ([@keith.androprime](https://www.instagram.com/keith.androprime/) · [@keithandroprime](https://www.youtube.com/@keithandroprime)) — confirm link-in-bio → quiz + UTM
- [ ] `[NEW]` Feeling-first landing page live (the ad + short-form destination)
- [ ] `[VERIFY]` Quiz / test-selector live and capturing
- [ ] `[VERIFY/BUILD]` End-to-end tracking: visitor → quiz → checkout → purchase
- [ ] `[NEW]` First 5 short-form videos shot + posted
- [ ] `[NEW]` Google Ads campaign built + 2 A/B headlines (compliance-cleared)
- [ ] `[FINISH]` seq-01 + seq-06 activated in Customer.io
- [ ] `[FINISH]` Newsletter issue-001 sent

---

## TRACK A — Front-of-funnel (sell now)

### Channels
- [x] `[DONE]` Channel setup spec — handles, bios, instructions (`06_marketing/content/social-channel-setup.md`)
- [x] `[DONE 2026-07-02]` Instagram — founder Creator account [`@keith.androprime`](https://www.instagram.com/keith.androprime/) live — confirm headshot, bio, link-in-bio + UTM
- [x] `[DONE 2026-07-02]` YouTube — Brand Account [`@keithandroprime`](https://www.youtube.com/@keithandroprime) live — confirm description, links, Shorts
- [x] `[DONE]` YouTube **banner** — built in Figma, safe-area-correct, founder photo placed + feathered, inverted alt (file `O4K7R8RlCKRM7EQ7WxFtCn`). To publish: delete red guide (done on white frame) + export 2560×1440 PNG
- [ ] `[NEW]` Grab `@androprime` brand handles on both platforms (hold the name)
- [ ] `[NEW]` Google Ads account + billing

### Landing pages
- [ ] `[NEW]` Feeling-first landing page (reframes "blood test" → feeling/outcome; supports the 2-headline A/B)
- [ ] `[VERIFY]` Quiz / test-selector (`/test-selector`) live + capturing

### Copy *(all DRAFTED 2026-06-27, pre-flight clean — pending Ewa tone + lab-claim substantiation before ship; in `06_marketing/content/track-a-launch-copy.md`)*
- [x] `[DRAFTED]` 2 A/B headlines (Variant A feeling-led / Variant B generic men's-test)
- [x] `[DRAFTED]` Landing page copy (hero ×2 + body)
- [x] `[DRAFTED]` 15 short-form hooks (in-palette; cortisol/thyroid/metabolic excluded until those kits launch)
- [ ] `[BLOCKED]` Ship gate: confirm lab-accreditation claim + Ewa sign-off on tone

### Email
- [ ] `[FINISH]` Activate seq-01 (waitlist) in Customer.io
- [ ] `[FINISH]` Activate seq-06 (quiz nurture) in Customer.io
- [ ] `[FINISH]` Send newsletter issue-001
- [ ] `[NEW]` Draft newsletter issues 2–3 (cadence)

### Content (organic engine)
- [ ] `[NEW]` Short-form production workflow / format defined
- [ ] `[NEW]` First 5 short-form videos (anchor on own retest data)
- [ ] `[BUILD]` Feeling-door blog hub: weight / belly
- [ ] `[BUILD]` Feeling-door blog hub: stress
- [ ] `[BUILD]` Feeling-door blog hub: sleep
- [ ] `[BUILD]` Feeling-door blog hub: low mood

### Tracking (do first)
- [ ] `[VERIFY/BUILD]` First-party events end-to-end (visitor → quiz_start → initiate_checkout → purchase) + GA4
- [ ] `[NEW]` Meta pixel + Google tag live (build retargeting pools now)

---

## TRACK B — Supplements + retention (Phase 0b, ~6–8 weeks)

### Product / operational (the gate)
- [ ] `[ACTION]` Send the 4 manufacturer emails (stock-first)
- [ ] `[ACTION]` Commit the supplement capital
- [ ] `[DECISION]` Pick the stock formula + vet ingredient list vs compliance
- [ ] `[NEW]` Stripe: Daily Stack monthly price (£39.95)
- [ ] `[NEW]` Stripe: Daily Stack quarterly price (~£107.85)
- [ ] `[NEW]` Stripe: Complete Stack price(s)

### Product pages + copy
- [ ] `[NEW]` Daily Stack subscription page (feeling-first, EFSA-bounded)
- [ ] `[NEW]` Complete Stack page
- [ ] `[NEW]` Collagen page (secondary)

### Attach (results → supplement; flow-4)
- [ ] `[BUILD]` Recommend/Convert CTAs in results dashboard → one-click to Stripe sub
- [ ] `[BUILD]` All-clear maintenance offer branch *(pending Ewa sign-off)* — built dark 2026-07-07 behind `MAINTENANCE_OFFER_ENABLED` (default off); copy + sign-off pack in `07_sales/funnel/`; ships on Ewa's yes (flag flip + deploy)
- [ ] `[NEW]` Attach events: `supplement_offer_shown`, `supplement_offer_clicked` — built dark 2026-07-07 with `segment: all_clear` property; fire only when the flag is on

### Tenure / retention
- [ ] `[BUILD]` seq-04 augmentation — Day 15 nudge
- [ ] `[BUILD]` seq-04 augmentation — Day 25 pre-billing
- [ ] `[BUILD]` seq-04 augmentation — Day 35 "is it working?"
- [ ] `[BUILD]` seq-04 augmentation — Day 45 nudge
- [ ] `[FINISH]` Activate seq-05 churn + 30-day pause mechanic
- [ ] `[NEW]` Quarterly billing: plan toggle at attach
- [ ] `[NEW]` Quarterly billing: Day-25 monthly→quarterly nudge email
- [ ] `[NEW]` Cohort/churn tracking (Stripe events → Day-30/45/90 retention)
- [ ] `[NEW]` Retest-loop wiring (Day-75 prompt + subscriber code + retest = 2nd-kit path)

### Physical
- [ ] `[NEW]` Daily Stack packaging (stock product relabelled)
- [ ] `[NEW]` First-box "start-here" insert card
- [ ] `[NEW]` Second-box "month-two" insert card

---

## Decisions that gate the builds (Keith, not a build)
- [ ] Lock base subscription price at £39.95
- [ ] Ewa sign-off on the all-clear maintenance offer
- [ ] Commit supplement capital + send the 4 manufacturer emails
- [ ] Affiliate unfreeze (parked — the only *profitable* paid channel per the model)

---

*Tick boxes inline as work completes. When Phase 0b produces real attach + tenure data, update the [LTV:CAC model](../../01_strategy/ltv-cac-profitability-model-2026-06-26.md) — that's when the model stops being an estimate.*
