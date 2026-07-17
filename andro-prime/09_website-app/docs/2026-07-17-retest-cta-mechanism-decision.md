# Retest CTA — mechanism decision & spec

_Date: 2026-07-17. Status: **PROPOSED**, pending sign-off (Keith = business, Ewa = clinical cadence, compliance = copy). Owner: 09_website-app._

Raised by Keith after reviewing the results dashboard: the "Book a retest in 3 months" button "doesn't seem to have a mechanism behind it other than taking them directly to a reorder or an order page." This doc records what the button actually does today, why that is wrong on three counts, and the recommended fix (a cheap honest relabel now, a real reminder mechanism later).

---

## 1. Current behaviour (verified 2026-07-17)

The button is the `retestReminder` CTA:

- Defined in [classifier.ts:61-65](../frontend/lib/results/classifier.ts#L61-L65): `label: 'Book a retest in 3 months'`, `href: '/kits'`.
- Rendered as a plain `<Link>` in [ResultConvert.tsx:15](../frontend/components/results-engine/ResultConvert.tsx#L15). No click handler, no event fired, no state written.
- `/kits` is the standard [kit listing page](../frontend/app/(marketing)/kits/page.tsx) — the same page a first-time buyer lands on.

**There is no mechanism.** Clicking it navigates to the shop immediately. Nothing:
- schedules or stores a retest-due date,
- sends a reminder at (or ever near) the 3-month mark,
- gates the reorder to 3 months, or
- attaches the retest/subscriber discount the marketing promises.

It is a straight reorder link wearing the label of a scheduling feature.

### Where it appears

`retestReminder` is the **primary** CTA on healthy results:

- `optimal-testosterone` ([classifier.ts:348-350](../frontend/lib/results/classifier.ts#L348-L350))
- all SHBG states — `shbg-low` / `shbg-normal` / `shbg-high` ([classifier.ts:353-355](../frontend/lib/results/classifier.ts#L353-L355))
- every all-clear non-testosterone marker that falls through to the default return: `normal-vitamin-d`, `normal-crp`, `normal-ferritin`, `normal-b12`, `normal-albumin`, `normal` ([classifier.ts:409](../frontend/lib/results/classifier.ts#L409))

So a man whose bloods come back clean sees "Book a retest in 3 months" as his headline next step, and it drops him on the shop. This is not an edge case.

Note the interaction with the dark maintenance offer (`MAINTENANCE_OFFER_ENABLED`, default OFF): when that flag is on and the **whole** result is all-clear, the maintenance offer replaces the retest CTA on every card ([classifier.ts:327-329](../frontend/lib/results/classifier.ts#L327-L329)). On a mixed result the healthy cards still show retest. The two all-clear CTAs overlap and should be reconciled when the maintenance offer is designed for launch.

---

## 2. Why it's wrong — three separate problems

### P1 — No mechanism (the reported issue)
Covered above. The label makes a promise ("Book a retest in 3 months") the product does not keep.

### P2 — "3 months" is the wrong number for these results, and it's borrowed from the wrong context
The button shows on **fully in-range** markers. Re-testing a healthy marker at 3 months is not clinically indicated. Every other surface says 6–12 months for this exact case:

- [how-it-works/page.tsx:376](../frontend/app/(marketing)/how-it-works/page.tsx#L376) — "All results in range → A retest reminder at 6 to 12 months."
- [faq/page.tsx:136](../frontend/app/(marketing)/faq/page.tsx#L136) — healthy range → "Retest in 6 to 12 months."
- [lp/testosterone/page.tsx:361](../frontend/app/lp/testosterone/page.tsx#L361) — "retest reminder in 6 months."
- [lp/hormone-recovery/page.tsx:467](../frontend/app/lp/hormone-recovery/page.tsx#L467) — "retest reminder in 6 months."

Where does "3 months" legitimately belong? The **supplement-effect** retest: [seq-04-email-5-retest-prompt](../frontend/email-templates/html/seq-04-email-5-retest-prompt.html), triggered by `subscription_started`, fires at **Day 90** to prompt a before/after retest for someone who has been supplementing. That 90-day window is correct *for a subscriber correcting a deficiency* — not for a healthy man with nothing to move. The dashboard button has taken the subscriber cadence and stamped it on the all-clear card.

### P3 — The reminder the marketing promises doesn't exist for kit buyers
Marketing repeatedly promises a passive "retest reminder." The only retest reminder that exists ([seq-04 email 5](../frontend/email-templates/html/seq-04-email-5-retest-prompt.html)) fires off `subscription_started`, i.e. **supplement subscribers only**. A kit buyer who is all-clear and doesn't subscribe gets no reminder at all. The button is the only retest touchpoint he sees, and it does nothing but link to the shop.

---

## 3. Decision (recommended)

Two phases. Phase 1 stops the dishonesty immediately with a copy change; Phase 2 builds the feature the label implies.

### Phase 1 — Honesty fix (copy + timing only, ship now)

Do not keep a button that claims a mechanism that isn't there.

1. **Relabel the CTA** so it describes what it does. Options for Keith/compliance to pick from:
   - "Order your next kit" (plainest, purely a reorder link — safest)
   - "Retest when you're ready" (softer, still a link)
   Avoid any label with a fixed month count until the timing is settled with Ewa.
2. **Fix the timing everywhere it's quoted as a number.** If Ewa confirms 6–12 months for all-clear, no on-dashboard number should say 3. If a per-state number is wanted, it must come from Ewa per marker, not a single global "3 months."
3. This is a one-line change to `CTAS.retestReminder` in [classifier.ts](../frontend/lib/results/classifier.ts#L61-L65) plus a compliance pre-flight on the new label. No new code paths.

**Ship gate for Phase 1:** Ewa signs the cadence; compliance pre-flights the label.

### Phase 2 — Real retest reminder (the feature the label promised)

Build a genuine reminder so "book a retest" means something. Recommended shape:

1. **On an all-clear result, stamp a `retest_due_at` date** when the result is processed. The date comes from an Ewa-approved, per-result-type cadence table (e.g. optimal-T 6mo, healthy nutrient markers 6–12mo, subscriber/deficiency-correction 90 days). This is computed server-side in the same place the result is classified/persisted (`getDashboardData` / `processResult`), alongside the existing classifier output.
2. **Emit a Customer.io attribute/event carrying `retest_due_at`** so a single CIO campaign can send the reminder when the date arrives — for **all** kit buyers, not just subscribers. Reuse the compliance framing already locked for seq-04 email 5: "find out how your levels have changed," never "find out if the supplement fixed you."
3. **The reminder email links to a reorder URL that carries the discount** the marketing already promises ("retest discount for supplement subscribers once the range is live," [how-it-works step 5](../frontend/app/(marketing)/how-it-works/page.tsx)). Discount mechanics depend on the supplement range going live — track that dependency, don't promise the discount before it exists.
4. **The dashboard button** then either (a) stays a simple reorder link (the reminder does the timing work), or (b) becomes "Remind me to retest" that confirms the stored date. (a) is simpler and recommended; the passive reminder is the real value, not a button.

**Ship gate for Phase 2:** Ewa signs the per-result cadence table; compliance pre-flights the reminder email; the discount half waits on the supplement range.

---

## 4. Compliance notes

- Retest cadence is a **clinical** judgement → Ewa owns the numbers. No cadence ships without her sign-off (consistent with the results-report copy sign-off rule in the root guardrails).
- The reminder copy must not imply the retest will show a supplement "worked/fixed" you — reuse the seq-04 framing rule ([seq-04 onboarding §compliance note](../frontend/email-templates/sequences/seq-04-subscriber-onboarding.md)).
- No em dash in any customer-facing label or email copy.
- A "book a retest" CTA on a healthy result must not read as manufacturing a reason to re-buy where none is clinically indicated — the honest relabel plus the correct (longer) cadence defuses this.

---

## 5. Open questions for sign-off

1. **Ewa:** confirm the retest cadence per result type. Is all-clear 6 months, 12 months, or a range? Does optimal-T differ from healthy nutrient markers? Is the 90-day window strictly a subscriber/deficiency-correction case? **Draft sign-off sheet ready:** `04_products/results-engine/2026-07-17-retest-cadence-table.md`.
2. **Keith:** which Phase 1 relabel? Ship the relabel standalone now, or hold for Phase 2?
3. **Keith/product:** is Phase 2 worth building pre-launch, or is the honest relabel enough until the supplement range and its retest discount are live (the discount is the main reason to reorder)?
4. **Design:** reconcile the retest CTA with the dark maintenance offer so healthy results don't end up with two competing all-clear CTAs when that flag flips on.

---

## 6. Cross-references

- Button definition: [classifier.ts:61-65](../frontend/lib/results/classifier.ts#L61-L65); routing at [:348-355](../frontend/lib/results/classifier.ts#L348-L355) and [:409](../frontend/lib/results/classifier.ts#L409).
- Render: [ResultConvert.tsx](../frontend/components/results-engine/ResultConvert.tsx).
- Existing retest email (subscriber, Day 90): [seq-04-email-5-retest-prompt.html](../frontend/email-templates/html/seq-04-email-5-retest-prompt.html), spec in [seq-04-subscriber-onboarding.md](../frontend/email-templates/sequences/seq-04-subscriber-onboarding.md).
- Marketing cadence promises: how-it-works, FAQ, testosterone LP, hormone-recovery LP (see §2, P2).
- Adjacent all-clear CTA: maintenance offer (`MAINTENANCE_OFFER_ENABLED`, dark) — [classifier.ts:104-106, 327-329](../frontend/lib/results/classifier.ts#L104-L106).
