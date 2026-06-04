# Decision note — low-T routing: GP referral + nurture (not FM, not Kit 3)

**Status:** Decided by Keith 2026-06-04. **Pending Ewa (recommendation logic) + solicitor (lawful basis) sign-off before any code/doc change.**
**Supersedes:** the `low-testosterone` row of `results-to-product-mapping.md` and the matching lines in `conversion-rules.md` and `kit-3-hormone-recovery-check.md`.
**Owner workspace:** `04_products/results-engine`. Compliance authority: `03_compliance/CONTEXT.md` (Guardrail 1). Related task: ClickUp `869d99kzh` (06. solicitor lawful-basis).

---

## 1. The decision

1. **Low testosterone (T < 12 nmol/L), any kit → GP referral as the primary result-card CTA.** Not the FM list, not a kit upsell, not a hard supplement push. Rationale: don't sell a clinically-low man another test or product; GP referral is the honest, ASA/CQC/Ewa-defensible next step, and matches the "we test, explain, tell you the next step incl. GP" framing.
2. **Still capture the lead.** The result is already stored (`lab_results` / `biomarker_values`). Segment in Customer.io — the `low_testosterone` trait is *already* set by `buildCioTraits()` in `lib/results/processResult.ts` — and run a **consent-gated nurture program** to keep the high-intent low-T lead warm for the post-CQC clinical/TRT business. This replaces the FM-list "join our TRT waitlist" ask.
3. **Kit 3 / Kit 3 Plus upsell → normal / ambiguous results only.** Kit 1 normal → Kit 3; Kit 3 normal → Kit 3 Plus (once it ships). NOT low-T. Rationale: Kit 3 exists to resolve "is it hormones, nutrition, or inflammation" ambiguity — a definitive low-T has no ambiguity, and Kit 3 just re-tests the same T plus tangential markers.

---

## 2. Current state — what's coded today (the verification, 2026-06-03/04)

The 2026-05-26 Kit 3 repositioning was never propagated into the results engine; the engine still routes low-T to FM.

| Surface | Says today | Action |
|---|---|---|
| `results-to-product-mapping.md:21` (self-titled "source of truth") | low-T → Founding-member list | update to GP referral + nurture |
| `conversion-rules.md:19` | low-T → `founding_member_listed` | update conversion target |
| `kit-3-hormone-recovery-check.md:141,168` | T<12 → FM primary | update |
| `classifier.ts:189` | `primaryCta: CTAS.foundingMember` | swap → `CTAS.gpReferral` |

### Kit 1 / 2 / 3 routing — full picture
- **The low-T branch is shared by Kit 1 AND Kit 3** (same `low-testosterone` state). So the one-line swap at `classifier.ts:189` fixes **both kits at once** — there is no separate Kit 3 change.
- **Kit 2 (energy-recovery) is already correct and aligned with "push supplements":** low Vit D / low B12 / CRP+joints → supplement waitlist; high-CRP / low-ferritin / low-albumin → GP referral (`GP_BLOCK_STATES`, `classifier.ts:91`); multi-deficiency → supplement waitlist. No change needed.
- **Kit 3 energy markers + GP blocks route like Kit 2** (correct), and the **"don't cross-sell Kit 1 from Kit 3" rule is correctly implemented** — the Kit 1 cross-sell secondary only fires for `kitType === 'energy-recovery'`, never Kit 3 (`classifier.ts:227/235/269`).
- **Minor drift to tidy:** `suboptimal-ferritin` returns no CTA in code (`classifier.ts:260`), where the mapping says "lifestyle guidance (dietary iron)." Cosmetic — likely educational copy with no button — fix alongside.

---

## 3. Engine gaps (so this isn't mistaken for a one-line job)

- **The low-T → GP change is a one-line swap** (`CTAS.foundingMember` → `CTAS.gpReferral`).
- **The upsell is NOT** — `CtaType` in `lib/results/types.ts` has only `kit-1-cross-sell` / `kit-2-cross-sell`. There is **no Kit 3 / Kit 3 Plus CTA**. Wiring the normal/ambiguous upsell needs a new CTA type + definition + mapping rows.
- **Kit 3-normal → Kit 3 Plus** is the slot for the Kit 3 Plus upsell (Kit 3 normal currently → supplement waitlist). Leave until Kit 3 Plus actually ships (deferred T+1–2 weeks; see [[project-kit3-repositioning]]).

---

## 4. Compliance gates — this reactivates the lawful-basis question

Store + segment + nurture is a **new purpose** for special-category (health) data: using a low-T result to nurture a man toward a future regulated TRT service. It does **not** escape the lawful-basis requirement — it makes it central.

- **Lawful basis — Keith interim-approved 2026-06-04:** **Article 6(1)(a) consent AND Article 9(2)(a) explicit consent**, captured at the "keep your results + stay in touch" point via a separate, un-bundled, un-pre-ticked opt-in with a stored consent record. Storing the result to *deliver his test* is already covered; the *new* purpose (segment + nurture) is what this consent covers. **Solicitor review deferred to post-launch** (will not advise until after launch); task 06 `869d99kzh` stays open as the post-launch confirmation. Full approval + conditions: `03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`; DPIA updated 2026-06-04. **Open prerequisite:** `buildCioTraits()` already sends a `low_testosterone` trait to Customer.io (health-derived → US processor) — needs explicit-consent coverage + IDTA/SCCs + special-category DPA, or orchestrate without the flag, before nurture activation.
- **CQC substance-over-form:** a nurture program that's really "warming low-T men for our TRT launch" is still pipeline-building for a regulated service pre-registration. Keep it genuine education / relationship / soft "we'll let you know" — **no TRT or treatment promises, no supplement claims for low T.**
- **Ewa (recommendation logic):** what a low-T result recommends, and every nurture email, go through compliance-preflight + Ewa. Per [[feedback-no-bespoke-clinician-interpretation]], Ewa signs off the *system* (triggers, thresholds, GP-referral CTAs), not per-customer reports.

---

## 5. Implementation order (nothing built yet)

1. **This note** → Ewa + solicitor.
2. **Doc updates** — rewrite the low-T rows in `results-to-product-mapping.md`, `conversion-rules.md`, `kit-3-hormone-recovery-check.md`; note the upsell-on-normal model.
3. **Sign-off** — Ewa on the low-T recommendation + nurture copy; solicitor on the Art 6/9 consent (task 06).
4. **Code** — low-T → GP referral (one-line); add Kit 3 / Kit 3 Plus CTA type + upsell wiring for normal/ambiguous; tidy `suboptimal-ferritin`; build the consent capture + nurture sequence (copy → compliance → Ewa → CIO build).

## 6. Separate but related — the live FM surfaces

The FM opt-in is currently **live and publicly promoted** (open join route `app/api/founding-member/join`, homepage section, `/founding-member` page, account link), with **0 opt-ins** so far. It contradicts "not pushing FM." Decide alongside: **take those surfaces down + disable the join route**, or sort the FM lawful basis. (Keith leaning take-down.)

## Open questions for Ewa
- Is GP referral the right primary for *all* low-T (T<12), or only below a deeper threshold, with 12–15 borderline handled differently?
- Acceptable framing/cadence for the nurture program pre-CQC (education + "stay informed" only)?
- Any low-T result wording that must change on the card itself once it routes to GP rather than FM?
