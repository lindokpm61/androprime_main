# Attio Configuration Spec — v2 (v2.3-aligned, as-built)

Status: **Supersedes `attio-config-spec-v1.md`** (which was v2.2-stale — wrong free-kit caps, removed bonuses, old recurring-tier model). This v2 reflects the v2.3 economics (`01_strategy/financial-model/option-4-financial-model-2026-05-08.md`, confirmed in `andro-prime-strategic-model-v7.md:36,432`) and the **actual configured state** of the live Attio workspace "Andro Prime" as of 2026-05-18.

Treat `attio-config-spec-v1.md` as deprecated. Do not build from it.

---

## v2.3 commercial truth (the numbers this CRM encodes)

- Affiliate base fee **£15 flat per kit** (not %). Customer discount **10%** via code.
- **+£10** Kit 3 upsell (universal — no flagship £20). **+£10** supplement-conversion (referred customer subscribes within 60d). Max per-kit payout **£35**.
- PT tiers are **one-off graduation bonuses**: Silver **£200**, Gold **£400** (paid once, first month reaching the tier; not recurring). Bronze £0.
- **Removed in v2.3** (must NOT appear anywhere): £10 first-month activation bonus; monthly recurring tier-retention cash; £20 flagship Kit 3; £250/mo flagship retainer (→ £100/piece content, cap 2/mo).
- Free kits: 5 flagship (Kit 3) + ~20 first-wave (Kit 2); gyms capped **3 head trainers each**. Standard PTs: no free kit.
- 50/50 direct/PT-coded sales mix. Payout monthly, 15th, £30 min threshold.

## Object model (as-built)

Three standard objects, no custom objects (deliberate — avoids bloat).

- **Person** = the individual partner + who they are / vetting / standing / FirstPromoter-mirror.
- **Deal** = one engagement record per partner; owns the **pipeline + onboarding-process events**.
- **Company** = Gyms (also Talent agency / Lab / Supplier via `partnership_type`).
- **Person → Company** via existing `gym_affiliation` (a PT "trains at" a gym).
- **Join key to FirstPromoter** = the affiliate code (`deals.firstpromoter_code`). FirstPromoter is the system of record for sales/commission/payout; Attio only **mirrors** rollups (never hand-typed).

### Person attributes (partner)
Pre-existing reused: `city`, `follower_count_ig`, `connection_count_li`, `gym_affiliation` (→Company), `audience_match_score` (High/Med/Low).
Added 2026-05-18: `affiliate_type` (PT / Influencer / Gym owner / Other), `sub_segment` (A1 recovery→Kit2 / A2 testosterone→Kit1 / Unsegmented), `specialty` (multi), `uk_region`, `certification_body` (multi: CIMSPA/REPs/Level 3/Level 4/Other/Unverified), `client_base_size`, `training_setting`, `compliance_state` (Cleared/Watch/Auto-reject/Pending review), `strike_count`, `last_strike_date`, `tier` (Bronze/Silver/Gold/Flagship/Inactive — **PT only**; influencers have no tier), `first_sale_date`, `last_sale_date`, `kit_count_30d`, `kit_count_lifetime` (last 4 = FirstPromoter mirrors, synced not typed).

### Deal attributes (engagement / onboarding process)
Pre-existing reused: `stage` (pipeline status), `cohort_tag` (Flagship/First-wave/Standard candidate), `sourcing_channel`, `primary_channel`, `compliance_attested` (bool), `firstpromoter_code`, `last_touch_date`, `associated_people`, `associated_company`.
Added 2026-05-18: `free_kit_type` (None/Kit 2/Kit 3), `free_kit_dispatch_date`, `brief_sent_date`, `attestation_signed_date`, `code_issued_date`.

### Company attributes (gym / partner org)
Pre-existing reused: `categories`.
Added 2026-05-18: `partnership_type`, `gym_tier` (First-wave/Standard/Pending), `inhouse_pt_count`, `free_kits_committed`, `free_kits_dispatched`, `qr_placement_confirmed_date`, `gym_code`, `attestation_signed_gymside_date`.

## Pipeline (Deal `stage`)

Decision: **11-stage full funnel** (per `pt-programme.md`). The workspace already had an 11-status set from a prior partial config; 5 missing canonical funnel stages were **added** (additive, nothing archived): `Identified`, `Vetted — pass`, `Qualifying`, `Brief sent`, `Attestation pending`.

Canonical funnel order + mapping to existing statuses (existing kept to avoid orphaning any test deals):

| # | Canonical stage | Status used |
|---|---|---|
| 1 | Identified | `Identified` (new) |
| 2 | Vetted — pass | `Vetted — pass` (new) |
| 3 | Cold outreach sent | `Contacted` (existing) |
| 4 | Replied | `Replied - positive` / `Replied — maybe` / `No reply` (existing — richer sentiment, keep) |
| 5 | Qualifying | `Qualifying` (new) |
| 6 | Onboarding call booked | `Call booked` (existing) |
| 7 | Brief sent | `Brief sent` (new) |
| 8 | Attestation pending | `Attestation pending` (new) |
| 9 | Code live — onboarded | `Onboarded` (existing) |
| 10 | Active | `Active` (existing) |
| 11 | Dormant / Lost | `Dormant` + terminal `Declined` / `Dead` (existing) |
| — | Legacy/unused | `Sourced` (pre-dates `Identified` — candidate to archive) |

**Open follow-up (NOT done — needs Keith, not destructive-by-default):** reorder statuses into the funnel order above in the Attio UI, and archive the genuinely redundant ones (`Sourced`) **only after confirming no live/test deals sit in them**. Left additive per the agreed "report before archiving" rule.

## What is NOT in Attio (by design)

- End customers (the men buying kits) — live in Customer.io + Stripe, never Attio.
- Sales/commission/payout truth — FirstPromoter.
- Partner activation comms (welcome → training → first-sale → anti-dormancy) — **isolated Customer.io partner space** (decision 2026-05-18), strictly separated from customer seq-01..09. Not built yet.

## Outstanding (tracked in ClickUp)

1. **Rev v2.2 → v2.3** of `briefs/PT-Brief-v2.2.pdf`, `PT-Attestation-v2.2.pdf`, `Influencer-Brief/Attestation-v2.2.pdf`, `Gym-Partnership-Onepager-v2.2.pdf` — partners must not sign stale-terms documents. **Hard blocker before onboarding anyone.** Compliance/Ewa-adjacent.
2. Stand up isolated Customer.io partner space + activation sequence.
3. E-signature mechanism for attestation (referenced, not set up).
4. ~~Add Attio to the data-processor map / ROPA (now holds partner personal data)~~. **DONE 2026-07-19**: added to `03_compliance/data-controller-position.md` §4a (Data Processor Relationships) with US-transfer + frozen-dormant notes. Attio standard DPA still to be reviewed (folds into the parked DPA workstream).
5. Pipeline reorder/rationalise (above).
6. UI: turn OFF Attio email/calendar auto-create (stops Gmail-record bloat) → then archive non-partner Gmail-sourced People (reversible).
7. UI: create 3 saved views of the Deal pipeline filtered by `affiliate_type` = PT / Influencer / Gym owner.

## FirstPromoter ↔ Attio boundary

Attio owns: recruitment funnel, vetting attributes, cohort, A1/A2, compliance/strike state, free-kit logistics, brief/attestation dates, gym↔PT links. Attio mirrors (read-only, synced): `first_sale_date`, `last_sale_date`, `kit_count_30d`, `kit_count_lifetime`, effective `tier`. FirstPromoter owns: every sale, attribution, commission/bonus calc, payout. Reconciliation key: the code.
