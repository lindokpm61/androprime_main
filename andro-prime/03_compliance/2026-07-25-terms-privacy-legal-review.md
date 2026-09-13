# Terms & Privacy — structured UK-law review (2026-07-25)

**Reviewer:** in-house (Claude), at Keith's direction. **Scope:** `03_compliance/terms-and-conditions.md` + `03_compliance/privacy/privacy-policy.md` (source of truth, including DRAFT bundle / lab-cancel sections not yet live), cross-checked against the live `canonical-site/{terms,privacy}/index.html`.

> **This is NOT legal advice and NOT ratification.** It is a structured pre-solicitor de-risk against the four regimes the terms live under: Consumer Rights Act 2015 (CRA), Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (CCRs), UK GDPR / DPA 2018, and the unfair-terms rules (CRA Part 2). Residual legal liability is only closed by a qualified UK solicitor with professional-indemnity cover. Method: the Anthropic `claude-for-legal` pack turned out to be corporate/US-oriented with no consumer-T&C skill, so its `marketing-claims` / `dpa` lenses were applied alongside the UK statutes directly.

**Bottom line:** structurally sound and unusually consumer-friendly (statutory-rights savings clauses, death/PI + fraud carve-outs, generous refund windows). No landmines. One genuine substantive gap (cancellation characterisation) plus a cluster of easy publish-blockers.

---

## Applied this session (the 🔴 batch)

| # | Fix | Where | Statute |
| --- | --- | --- | --- |
| 1 | Removed the `[analytics platform]` placeholder (→ Google Analytics 4 only) | privacy md | UK GDPR Art 13 transparency |
| 2 | Kit 3 marker count "nine" → "seven" (3 + 4 markers) | privacy md | Art 13 accuracy / consumer info |
| 3 | "Last updated" bumped to **July 2026**, version to **1.2** | terms + privacy md AND live canonical HTML (privacy live was stale at April 2026 / v1.0) | CCRs Sch 2 / Art 13 |
| 4 | Entity block "Andro Prime (trading name)" → "Andro Prime Ltd (trading as Andro Prime)" | terms md (canonical HTML already correct) | CCRs Sch 2 trader identity |
| 7 (wording) | Supplement cooling-off: removed the "first subscription only" limiter (the right attaches to each new distance contract) and replaced "partial refund at our discretion" with the hygiene-exemption position (aligns with the Returns section) | terms md + live canonical terms HTML | CCRs reg 28(3), reg 34(9) |

**Deploy note:** the barcode fix, founding-member removal, SLA, and the above are material changes to live pages → the Terms' own "Changes to These Terms" clause requires **emailing existing customers** on deploy, and the version/date bump reflects that.

---

> **▶ STATUS UPDATE 2026-09-13 (in-house pass, Keith's no-solicitor-budget decision).** Items **6, 8, 11
> and 12 are now CLOSED in the source md**, and a **Membership** section was added to the Terms
> (v1.3) alongside a v1.4 Privacy revision. Items **9 and 10 re-checked and substantially closed**
> already. Items **5 and 13 remain OPEN**, and item 13 is now larger by design. Two new findings were
> raised, **one of which was WRONG and was withdrawn the same day after Keith corrected it** (see items
> 14 and 15: FirstPromoter is dormant behind the affiliate freeze, not a live processor, and the
> Cookies section is accurate). Per-item detail is marked inline below. Nothing here is approved or
> synced live: both documents are DRAFT pending Keith.

## Open — genuinely want a solicitor (or Keith's commercial call)

**5. Cancellation: goods vs service — DIRECTION SET (Keith 2026-07-25).** The Terms previously ended the cancellation right on the basis that "the service is in progress" (kit opened + sample taken) — asserted without a clear footing. **Keith's characterisation:** a kit has two parts — (i) the **physical kit = goods**, and (ii) the **lab analysis + results dashboard = service**. This resolves to CCR path (b): the physical kit is sealed goods, so the return right ends on unsealing under the **reg 28(3) sealed-for-hygiene exemption** (the industry-standard basis for at-home test kits), and the analysis/results service follows. The single-kit "Opened kits" clause and the bundle first-kit cancellation clause were reworded 2026-07-25 to this footing (physical product sealed for hygiene → return right ends on opening; service follows). Refinement noted: the "service" is the analysis + results dashboard, not merely the app that displays them. **Still for the solicitor:** confirm the mixed goods+service (reg 28(3) + reg 36) treatment and whether the results service needs its own consent-to-immediate-supply + acknowledgment at checkout; but the drafting now rests on a defensible, articulated basis rather than a bare assertion.

**6. Subscription price/term variation (unfair-terms grey list, CRA Sch 2 paras 11–15).** ✅ **CLOSED 2026-09-13 (Terms v1.3).** "Change prices at any time" + "continued use = acceptance of updated terms" are fine for one-off buys but risk unfairness for **ongoing subscriptions** unless notice + a right to cancel before the change takes effect is given. The pre-order section already does this; the general subscription + "Changes" sections did not. **Fix:** the "Pricing" section now carves ongoing subscriptions out explicitly (30 days' notice by email, stating old price, new price and effective date, with a right to cancel before it bites), and "Changes to These Terms" splits one-off purchases from subscriptions, gives the same 30-day notice for any material change, and states that continued use of the site is **not** treated as agreement to a material change to a subscription already held.

**8. ADR Regulations 2015.** ✅ **CLOSED 2026-09-13 (Terms v1.3).** Terms said a customer "may refer to an approved ADR scheme" but didn't state whether Andro Prime *participates* in one — the regs require that disclosure. **Fix:** the Contact section now states plainly that Andro Prime is not currently a member of and does not use an approved ADR scheme, says why it is telling the customer that, confirms the courts remain open, and commits to naming a scheme here if one is joined. A negative disclosure is a compliant disclosure; the defect was the silence, not the absence of a scheme.

## Open — DPO / privacy (lower risk)

**9. Consent scope for the bundle.** 🟢 **SUBSTANTIALLY CLOSED, re-checked 2026-09-13.** The Art 9(2)(a) basis for *using the first result to schedule the recheck* rests on the checkout consent (CA-018), and the "How We Use Your Data" table states it explicitly on the bundle row. Privacy v1.4 extends the same treatment to membership: a new row covers using a result to set the retest date and choose the panel, on the same basis. **Residual:** CA-018's approved wording should be read once more against the membership use, since it was written before membership existed. Low risk, Keith's call, not a blocker.

**10. Storage-location consistency.** 🟢 **SUBSTANTIALLY CLOSED, re-checked 2026-09-13.** Half of this item is moot: **Vercel is no longer used** (hosting is Hetzner via Coolify), so it is not a US processor in the stack at all. The policy already names a transfer mechanism per provider (UK Addendum to the EU SCCs for Cloudflare and Customer.io). v1.4 adds Sentry, which is on the **EU region (de.sentry.io)** and so stays inside the EEA. **No residual:** an earlier cut of this update flagged FirstPromoter's transfer mechanism as unverified, but FirstPromoter is dormant and has been reverted out of the policy entirely (see item 14).

**11. Consent withdrawal mid-order.** ✅ **CLOSED 2026-09-13 (Privacy v1.4).** Not addressed before: what happens to an in-flight paid order if health-data consent is withdrawn before results land. **Fix:** a new block under "Health and biomarker data" sets out three cases (sample not yet analysed, sample already analysed, and members), confirms we will never require withdrawal as the price of a refund or re-consent as the price of something already paid for, and gives privacy@andro-prime.com as the route with a commitment to confirm what was stopped and what had to be kept.

**12. Sentry not disclosed.** ✅ **CLOSED 2026-09-13 (Privacy v1.4).** Confirmed it belongs in the table: Sentry is wired in the error boundaries and instrumentation, live. Two corrections to this item as written: it is on the **EU region (Germany)**, not US, and **session replay is disabled** (tree-shaken out in `instrumentation-client.ts`), so the incidental-PII exposure is narrower than feared. Added to the processor table, the transfers section and retention. **Residual, flagged inline:** the 90-day retention figure is Sentry's standard, not read from our own account settings.

**13. md ↔ live divergence.** 🔴 **STILL OPEN, and now LARGER by design (2026-09-13).** The source md is ahead of the live canonical HTML in several places. Terms v1.3 and Privacy v1.4 add substantially to that gap deliberately: the Membership section is gated behind `MEMBERSHIP_ENABLED` and must not go live before the flag, and the privacy revision carries three unresolved pre-publication blockers. **A full sign-off-gated sync of both documents into `canonical-site/terms/index.html` and `canonical-site/privacy/index.html` is owed**, and `frontend/scripts/verify-legal-text.js` will hold the rendered pages to whatever that sync lands. Do not sync piecemeal.

---

## New, found on the way in (2026-09-13) — not on any previous list

**14. ❌ WITHDRAWN — "FirstPromoter is a live, undisclosed processor" was WRONG.** Raised and reverted on 2026-09-13, in the same session, after **Keith corrected it**: the PT/affiliate layer has been **FROZEN since 2026-06-07** (`../06_marketing/STATE.md`, "PT / affiliate programme: FROZEN", where FirstPromoter is recorded as *"live but dormant"*). Re-checked on his challenge, and he is right at every level: `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` is **empty**, so `FirstPromoterScript` returns null; the **live site serves zero FirstPromoter markers** and sets **no cookie**, plain or with a `?fpr=` referral parameter. It is not a processor, because it is not processing anything. All of it has been reverted out of Privacy v1.4.

🔴 **The mistake, recorded because it generalises.** The code path was read correctly, and then the **environment state was inferred from `.env.local`** — a local development file — and never confirmed against what production actually serves. **A component gated on an env var is not live merely because its code exists**, and a repo cannot tell you the value of a variable that lives in the deployment platform. The check that would have caught it in one command was `curl` against the live page. Note the shape: item 12's finding (Sentry) was **real** and survived exactly the same verification, so the method was not wrong, only the stopping point.

⚠ **Adjacent and also corrected: the claim that the cookie section was false is withdrawn too.** GA4 is the only analytics tag that runs, and it is properly gated by **Google Consent Mode v2** with `ad_storage` and `analytics_storage` denied by default *before* gtag.js loads, flipped only on banner opt-in (`components/analytics/GoogleAnalytics.tsx`). The policy's "marketing cookies only if you consent" line is **accurate**.

**15. ⚠ LATENT, NOT LIVE: `FirstPromoterScript` has no consent gate, and the freeze is what is protecting us.** This is what survives of item 14, downgraded to its true size. `FirstPromoterScript` is gated **only** on its env var, unlike `GoogleAnalytics`, which is gated on consent. So the thing preventing a non-essential tracking cookie being set pre-consent today is the affiliate freeze plus an empty variable, **not the code**. Whoever unfreezes the programme will populate one env var and silently begin setting `_fprom_tid` before consent, which would then be a genuine PECR reg 6 problem and would make the Cookies section false.

**This does not block anything now and must not be logged as a live defect.** It is an **unfreeze precondition**, recorded in `../06_marketing/STATE.md` alongside the two preconditions already met. Whoever takes the unfreeze decision gates the script on the consent state the banner already tracks, and adds FirstPromoter to the processor table **at that point** and not before: a dormant integration should not be disclosed as though it were processing data.

**16. The DMCCA gap is largely answered and was never a solicitor item.** ✅ **ANSWERED 2026-09-13.** See `2026-09-07-dmcca-subscription-regime-gap.md` §0. The regime is **not in force** (January 2027 target, implementing regulations unpublished), so it is not a launch blocker, and the reminder-timing question could not have been answered by a solicitor either. The new Membership section voluntarily adopts the expected duties so commencement becomes a review rather than a rewrite. **Still genuinely open for a solicitor when there is budget:** whether the membership is in scope at all given the first 30 days are bundled into a one-off purchase.

## Checked and sound (🟢)

Liability carve-outs (death/PI, fraud) correct; statutory-rights savings clauses present; the bundle **Art 22 automated-scheduling disclosure** is well-drafted (no significant effect + human-review offer, consistent with the "no automated decision-making" line); banked-kit 12-month-expiry-with-refund-backstop *exceeds* statutory generosity; ICO reg + controller identity present; Vitall correctly framed as a separate controller; retention rows coherent; UK-only jurisdiction clause fine for UK-resident customers.
