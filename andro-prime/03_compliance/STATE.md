# Compliance: Current State

Volatile status for the compliance workspace. Durable rules, the Pre-Flight Checklist, EFSA claims, and red-flag language are in `CONTEXT.md`. The full decision ledger is `content-approval/content-approval-register.md`; this file is the at-a-glance live status. Update the date on each change.

_Last updated: 2026-07-26._

---

## Legal + site copy: recent changes

**2026-07-26: bundle address-check email APPROVED (CA-027) + Confirmation interval signed off.** The `bundle_address_check` email (delivery-address confirmation before the second-kit auto-dispatch) was drafted, run through `/stop-slop`, pre-flighted (0 HARD, no health claim, no em dash), and **APPROVED by Ewa + Keith** (Keith relay; written countersignature recommended). Logged **CA-027** in the register (record `content-approval/approval-record-bundle-address-check-2026-07-26.md`); built as DRAFT Customer.io campaign 24 (template 55), not activated. Separately, the **`CONFIRMATION_INTERVAL_DAYS`=0 + day-90 second-dispatch interval** left open as "a separate Ewa item" in the 2026-07-25 entry below is now **SIGNED OFF (Ewa, Keith relay 2026-07-26)**: 0 = immediate recheck, accepted for the Phase-0 wellness recheck; `config.ts` comment updated. With that, all bundle build/engineering gates are complete (incl. #8 address surface, #9 migration applied to the live DB); activation pends the `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` flip + the Terms/Privacy live-sync. Cross-ref `09_website-app/STATE.md` bundle entry.

**2026-07-25: bundle Terms section RATIFIED (Keith + Ewa).** Keith approved the draft; the "Test Bundles (Two-Kit Purchases)" section in `terms-and-conditions.md` is now `[APPROVED 2026-07-25]` and part of the T&C (in-house, no external solicitor this round, by Keith's decision). Privacy bundle clauses (v1.3.2) approved alongside. **Held out of the live /terms + /privacy until `BUNDLES_ENABLED`** (coupled to the bundle launch, so the live pages never describe an unpurchasable bundle); only residual on this section is the mechanical live-sync at flag-flip. Also this session: a structured in-house UK-law review of the whole T&C + Privacy was run and saved (`2026-07-25-terms-privacy-legal-review.md`); its 🔴 fixes are applied, and the general-T&C residuals (subscription-variation notice, ADR naming, optional solicitor confirm of the goods+service cancellation basis) remain open there. Cross-ref `09_website-app/STATE.md` gate 1, ClickUp F3 `869e8w56x`.

**2026-07-25: "Confirmation bundle" reframed to "Recheck Bundle" (Phase-0 boundary mitigation).** The compliance-reviewer + Keith flagged the Confirmation bundle's "confirmatory testosterone testing" framing as a Phase-0/post-CQC boundary risk (confirmatory T testing is post-CQC-only in CONTEXT.md). Reframed all customer-facing DRAFT copy: renamed "Confirmation Bundle" → "Recheck Bundle" and replaced "confirmatory test/retest" with a wellness biological-variability recheck framing, across `terms-and-conditions.md` (Test Bundles section; DRAFT banner now carries an explicit open-sign-offs block), `privacy/privacy-policy.md` (v1.3.1: purpose row + automated-scheduling disclosure), and the dark testosterone kit page (`kits/testosterone/page.tsx`: CTA, `bundleName`, hero + mechanic). Internal `bundle="confirmation"` code type unchanged (B1/F3/F4/config unaffected). Threshold wording kept neutral ("low or on the low side"). **Both sign-offs RESOLVED 2026-07-25 (Keith relay of Ewa; written countersignature still recommended for the clinical record):** (1) Ewa agrees the wellness "recheck" framing → Phase-0 boundary signed off (wellness recheck of a naturally variable marker, not clinical confirmatory testing); (2) trigger aligned to <12: `shouldTriggerConfirmation` is now `value < BORDERLINE_T_FLOOR` (was `< BORDERLINE_T_CEILING`/15), so borderline 12–<15 banks. Code + all 3 bundle suites updated and green (confirmation 35 / checkout 37 / sweep 21; `tsc` clean); copy + docs swept (Terms, Privacy v1.3.2, kit page, `confirmation.ts`, build-record, 09 STATE). ClickUp F4 `869e8w573` closed. `CONFIRMATION_INTERVAL_DAYS`=0 remains a separate Ewa item (interval, not threshold).

**2026-07-25: dead static trees deleted (silent-ingredient + stale-copy risk removed).** Cleared the unserved `canonical-site/*` mirrors (about, blog, contact, design-system, faq, founding-member, home, kits, shared, supplements, test-selector, waitlist) and the entire static `frontend/lp/*.html` tree: 33 files total (incl. the how-it-works mirror), which still carried ashwagandha (silent-ingredient), Medichecks, founding-member and TRT copy. **Kept** the served `canonical-site/terms/` + `canonical-site/privacy/` slices (the only canonical paths read by app code, via their `page.tsx`). Served LP pages are `app/lp/*` (untouched); `robots.ts` `/lp/` disallow still points at those live routes. Verified before deleting: no served route/rewrite/public mapping consumed the deleted files; the app's own `styles/` tree (not `canonical-site/shared`) provides the custom classes on the served slices. Closes the repo-hygiene bullet on ClickUp `869e934t9`. Uncommitted; effective on next deploy.

**2026-07-25: testosterone reference range + GP-floor resolved (Keith decisions).** Three surfaces disagreed: dashboard "8–35", biomarker-copy "10–35", emails "roughly 8 to 29 (NHS)". Keith ruled: **(1) go with Vitall**: result-display copy now cites Vitall's actual testosterone reference range **9 to 27.6 nmol/L** (consistent across all 4 testosterone fixtures; matches what customers see next to their number). Applied to `results-dashboard/page.tsx` + `biomarker-copy.ts` (arithmetic corrected to "threefold"). **(2) Stick with the signoff**: biomarker-copy's GP-floor line now uses the signed-off **12 nmol/L** ("Most GPs only flag testosterone as low below around 12 nmol/L"), consistent with CA-014 + the classifier + the how-it-works GP-threshold fix above. **Emails deliberately left on "the NHS reference range ~8 to 29"**: that is a distinct, defensible external reference (the NHS/GP band, anchoring the "your GP uses a blunt threshold" argument in seq-01/03c/03d), not the lab range. Offered to Keith to align the emails to Vitall too if he wants literally one number everywhere.

**2026-07-25: /how-it-works testosterone GP-threshold contradiction fixed.** The FAQ (both the JSON-LD `acceptedAnswer` and the rendered FAQ, `how-it-works/page.tsx`) said GP attention warranted at "testosterone below 6 nmol/L", contradicting the same page's routing (below 12) and the Ewa-signed classifier (all total T < 12 nmol/L GP-routes; CA-014 2026-06-04, sub-bands 2026-06-16). Corrected 6 → 12 to match the signed-off threshold. No new sign-off (applying her decided value). The dead `canonical-site/how-it-works` mirror may still carry "6"; slated for deletion with the other stragglers (task `869e934t9`).

**2026-07-25: per-customer-review stragglers fixed on live /how-it-works.** Two lines missed by the 2026-05-22 clinical-governance sweep ("A real doctor reviewed your result"; "signs off every result interpretation") reworded to system-authorship framing per the already-approved rule in `clinical-governance-copy-corrections.md` (see its 2026-07-25 straggler-fix note). No new sign-off required. The homepage "GP-designed report" line was confirmed compliant (approved wording, T2.5) and left as-is. Live surface fixed (`app/(marketing)/how-it-works/page.tsx`); publishes on next deploy.

**2026-07-24 (Keith-directed; no external solicitor review this round):**

- **Privacy: founding-member removed from the LIVE page.** The founding-member references were still live in `09_website-app/frontend/canonical-site/privacy/index.html` (intro, "who this policy covers", Account Activity list item, and the "joined the founding-member list" purpose row) even though the v1.2 draft removed them 2026-07-09. FM programme is shelved (Keith 2026-07-24), so all four were removed from the live canonical HTML. Source `privacy/privacy-policy.md` was already FM-free. **Still NOT synced live:** the v1.2 low-T-nurture additions and the v1.3 bundle clauses (both remain DRAFT, sign-off pending).
- **Terms: barcode sample-registration instruction corrected (LIVE).** The live `/terms` told customers to "register your sample using the unique barcode before posting it." There is no such step: Vitall pre-associates the tube barcode and links the sample to the customer at dispatch (`partner_order_id`); `sample_registrations` is never written by app code; `/activate` is deprecated (`09_website-app/docs/2026-06-12-activate-qr-deprecation.md`). Corrected in both the source `terms-and-conditions.md` and live `canonical-site/terms/index.html`; the "right to cancel ends" trigger reworded from "registered your barcode" to "taken your sample". Stale results SLA in the source md (24-48h) aligned to the live "2 to 5 working days".
- **Bundle clauses drafted (DRAFT, gated).** Two-kit bundle Terms section + Privacy clauses drafted in-house behind DRAFT banners in `terms-and-conditions.md` and `privacy-policy.md` (v1.3), satisfying the bundle-terms gate without solicitor review (Keith 2026-07-24). Ships when `BUNDLES_ENABLED` flips; two product decisions still need Keith's confirm (see the Terms DRAFT banner). Cross-ref `09_website-app/STATE.md` bundle entry gate 1.

> **Deploy note:** the terms + privacy live-HTML edits are file changes only. They publish on the next `09_website-app` build/deploy, which is Keith's call.

---

## Content-approval status (live tally)

Source of truth for individual decisions: `content-approval/content-approval-register.md`. **The register's "As of 2026-06-04: 13 APPROVED, 2 PENDING" header line is itself stale**: CA-016 through CA-020 have since been filed. Current standing:

- **19 APPROVED / 3 PENDING** (CA-001 → CA-022). CA-021 (GEO third-party outreach email, Keith 2026-07-13) and CA-022 (retest-reminder all-clear email, Ewa + Keith 2026-07-18) added.
- **Pending:**
  - **CA-001** (PT-Brief v2.3): Ewa + Keith signed; **solicitor** §E commission clause outstanding.
  - **CA-002** (PT-Attestation v2.3): Ewa + Keith signed; **solicitor** clause 9 outstanding.
  - **CA-017** (Newsletter Issue 002, "myth of the normal range"): awaiting **Ewa + Keith**; CIO broadcast build + send gated on sign-off.

> "APPROVED" in the register means **copy-approved**, not shipped. Only a named human sets a row to APPROVED; never automation.

## Approved but still gated (copy-approved ≠ live)

- **CA-006** (partner activation comms): copy only; build/activation gated on isolated CIO partner space, Attio→CIO sync, e-sign, FirstPromoter, and CA-001/003.
- **CA-011** (Phase 0a partner broadcast): approved; broadcast still gated on CA-006 build.
- **CA-012** (Newsletter Issue 001, CRP): approved; send gated on go/no-go + subscriber-list accrual.
- **CA-014 / CA-015** (low-T nurture consent copy + seq-03b): approved; activation gated on migration + Customer.io DPA/SCCs + sequence build; seq-03b builds as **DRAFT only**, activation a separate go/no-go.
- **CA-018** (health-data processing consent, Consent A): **Half 1** built at checkout 2026-06-23, prod migration applied, **deploy pending**. **Half 2** (clinical opt-in) held pending solicitor CQC-recruiting question.
- **CA-019** (kit collection instructions): approved; ship gated: push live **before** Vitall customer-emails disabled; CIO re-upload as DRAFT; Vitall per-kit protocol confirmation (Ben thread).
- **CA-020** (seq-03c/03d testosterone-value reword): applied + live as draft templates; seq-03c activation-ready; **seq-03d stays draft** pending trigger redesign.
- **CA-021** (GEO third-party outreach email): copy-approved (Keith 2026-07-13); affiliate line held until the channel is unfrozen.
- **CA-022** (retest-reminder all-clear email), approved 2026-07-18 and **LIVE**: CIO campaign 23 (`seq-07`) activated 2026-07-18. First real send ~6 months out (dates are +6mo forward). Suppression filter + retest discount deferred to supplement launch.

## Low-T routing (verified live)

Low-T (<12 nmol/L) result routing changed 2026-06-04 to **GP referral, no upsell** + consent-gated nurture (CA-013 result-card copy, CA-014 consent UI, CA-015 seq-03b). Verified live in `09_website-app/frontend/lib/results/classifier.ts`. Superseded the prior TRT-service + founding-member-queue pitch. Solicitor confirmation of the nurture lawful basis is **deferred to post-launch** (ClickUp `869d99kzh`; Keith interim-approved 2026-06-04).

**GP-framing sweep done 2026-07-07**: "GP-built report"/"personalised report" removed from live docs and site strings per the "Ewa signs off the system" ruling; the `clinical-governance-copy-corrections.md` conflict (it re-proposed "GP-built report") is resolved with a dated ruling note. Standard chip **"GP-designed report" pending Ewa confirmation**. Escalated: v2.4 brief corrections (`06_marketing/affiliates/briefs/v2.4-framing-corrections.md`, bundle with parked CA-001/002), blog MDX bylines (CA-011 verb framing flagged), Keith's LinkedIn posts 1/2/4, canonical-site testimonial "interpreted by doctors". Changed site strings (`app/(marketing)/page.tsx`, `canonical-site/home/index.html`) need a deploy to take effect. Preflight on changed strings: 0 HARD / 2 REVIEW (both pre-existing "Harley Street TRT-trained" credential text).

**Doc-layer sweep completed 2026-07-07**: all live-rule docs corrected or SUPERSEDED-bannered (29 files; report: `04_products/results-engine/2026-06-04-low-t-routing-decision-sweep-report-2026-07-07.md`). Escalations still open: `06_marketing/content/linkedin/keith-launch-posts-v1.md` Post 5 FM-scarcity line (Keith, review note added in-file); `privacy/privacy-policy.md` still advertises the FM list at ~33/37/90/117 (Keith + Ewa, legal doc, launch-blocking, untouched by the sweep); `brand-licence/inter-company-brand-licence.md` L86 "founding member deposits" (solicitor, pre-flagged in-file).

**Privacy policy DRAFT (2026-07-09)**, `privacy/privacy-policy.md` v1.2 DRAFT: FM-list advertising removed + low-T nurture purpose/lawful basis (Art 6(1)(a) + 9(2)(a), per DPIA §1/§5) added; **pending Ewa sign-off, live `/privacy` page NOT yet synced** (ClickUp `869e0bc7k`). Clears the two privacy items above (FM advertising + DPIA §5 nurture-purpose line) once signed off.

## Trust-language corrections (Keith, 2026-07-09): RESOLVED, pending Ewa's note

Three items surfaced by the content-machine dry run (`06_marketing/content-machine/dry-runs/2026-07-09-pillar-B-why-am-i-always-tired.md`). Keith directed the fixes on 2026-07-09; all are applied and verified live. **Ewa has not been asked to re-sight CA-016**, and should be told the CTA sentence changed (the change moves toward the CONTEXT rule, it does not add a claim).

- **"reviewed by our GMC-registered medical lead"** in the live `why-am-i-always-tired.mdx` kit CTA implied per-customer clinical review of results. **Fixed:** now "What we recommend from your numbers follows logic approved by our GMC-registered medical lead, Dr Ewa Lindo." This is the CONTEXT-permitted "Ewa-approved recommendation logic" in plain English: she approves the *logic*, not the individual's results. Imported + revalidated + verified live.
- **"Clinically reviewed by Dr Ewa Lindo, GMC #4758565" asserted on videos she never reviews.** Under the hybrid role split she signs off the canonical article and the recommendation logic, and reviews a founder script only when it carries a net-new claim, so a claim-free derivative video never reaches her. **Fixed at the source rule** (`content/youtube-founder-journey-strategy.md` §8) and in every doc that copied it: `content-machine/templates/youtube-description.md`, `content-machine/founder-content-system.md`, `content/youtube-scripts/example-scripts-line1-line2.md`, and the dry-run example. New default attributes the review to the **article the video is atomised from**. Where Ewa *did* review the script (net-new claim, or an Ewa digital-twin short), the bare line stays accurate and is still permitted. Nothing had shipped: YouTube has no content yet.
- **CTA button read "Join the list"** on the live `signs-of-stress-in-men` article, one of the five FM grep strings, though it routed to `/waitlist`. **Fixed:** button now "Join the waitlist" (the `kitCTA` default for the stress pillar, so the override was simply removed). The body sentence carried the same ambiguity ("Join the list and you'll get…", "first in line") and was corrected too. FM grep on both articles is clean. Verified live.

Historical note: `08_customer-journey/flows/flow-4-results-to-action.md` and `07_sales/growth-retention-context.md` still contain the string "join the list", in a prohibition statement and an FM-era social-proof example respectively. Neither is live customer copy. Left as-is.

## DPIA: outstanding actions before launch

From `dpia/phase0-dpia.md` §5. Done: **ICO registration ZC172852** (2026-06-12); **Vitall controller-to-controller agreement executed 2026-06-02**; **Supabase data-centre location confirmed Ireland (EU)** (2026-07-05 audit; DPA incorporated via Supabase standard terms, no separately signed DPA, per `dpia/phase0-dpia.md` §2/§5). Still open:

- Health-data consent checkbox (CA-018): built at checkout, migration applied, **deploy pending**.
- Backfill: pre-existing / guest customers hold no `health_processing_consent_version`: decide whether retained results need a separate consent touch: **Pending**.
- Separate Art 9(2)(a) opt-in for low-T storage + nurture: **Pending (gates nurture activation)**.
- Update privacy policy to describe the low-T nurture purpose + lawful basis: **Pending**.
- Data-deletion workflow (manual acceptable for launch): **Pending**.
- Confirm all biomarker panels exclude unstable postal markers: **In progress** (panel builder; Keith/Ewa).
- Solicitor confirmations (checkout lawful basis; low-T nurture): **Deferred** (Keith interim-approved).

## Deposits

- Founding-member **£75 deposit shelved 2026-05-08**; FM is now a non-cash email opt-in (page taken down 2026-06-04, dormant).
- Supplement Gate-0A: **deposit mechanic shelved 2026-05-08**: counted by first paid subscription invoice (per `10_launch-ops/implementation-checklists/qa-gates.md`).

## Known gaps / owed (compliance-doc hygiene)

- **`pre-launch-checklist.md`: DRAFT assembled 2026-07-02** (consolidates qa-gates Gates 1–5 + 0A, the approval register, and DPIA §5). **Pending Keith/Ewa ratification** before it governs go-live.
- **DPIA internal contradiction (unreconciled):** §4 risk row still says "Customer.io is US-based: UK IDTA standard contractual clauses to be executed before launch," while §5 and the processor table conclude the DPA (EU SCCs + UK Addendum) + DPF UK-Extension cert mean **no separate IDTA is needed**. Reconcile the risk row.
- **Missing directories referenced by `CONTEXT.md`:** `deletion-policy/` and `lab-partner-data-governance/` do not exist on disk; the Vitall DSA / sub-processor schedule currently lives only as prose in the DPIA.
- **`deposits/supplement-pre-order-terms.md` is stale**: dated April, still deposit-based with `[£TBC]` prices, not reconciled with the 2026-05-08 deposit shelving or the supplements-deferred plan.
