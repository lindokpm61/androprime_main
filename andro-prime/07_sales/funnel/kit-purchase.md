# Kit Purchase Funnel

**Owner workspace:** `07_sales` | **Read first:** `../CONTEXT.md`, `../../04_products/icp-kit-supplement-alignment-april2026.md` (selection + cross-sell authority)

The kit purchase funnel is the **live revenue path**: how a cold visitor becomes a paid kit order. It starts at first touch and ends when the order is confirmed and the kit ships. From the Vitall results webhook onward, `../../08_customer-journey/flows/flow-4-results-to-action.md` takes over (results, attach, cross-sell) and this doc hands off to it.

Kits are the Phase 0 product that is **actually purchasable today** (supplements are deferred to Phase 0b, so supplement CTAs are waitlist opt-ins). This funnel is therefore the one that takes real money now.

> **Source-of-truth boundaries (do not re-author here):** pricing → `../../04_products/catalogue/product-catalogue-v7-1.md`; kit specs + markers → `../../04_products/kits/`; results routing + cross-sell after a result → `flow-4-results-to-action.md` + `../../04_products/CONTEXT.md`; email copy → `../../09_website-app/frontend/email-templates/`. This doc defines the **stages and handoff rules** only.

---

## Scope

- **Starts:** first touch (a content asset, a search result, a DM link, a newsletter).
- **Ends:** `order/confirmed` + kit dispatched.
- **Hands off to:** `flow-4-results-to-action.md` at the Vitall `result_received` webhook.
- **Does not cover:** supplement attach (→ `supplement-conversion.md`), results routing (→ flow-4), post-CQC clinical conversion (→ `post-cqc-clinical-conversion.md`).

---

## The stages

```
AWARENESS ──► LANDING / ROUTER ──► KIT SELECTION ──► CHECKOUT ──► CONFIRMED ──► DISPATCH ──► [handoff: flow-4]
 (off-site)     (test-selector,      (kit page)       (details +    (order)      (Vitall)
                 blog, homepage)                        Stripe)
```

### 1. Awareness (top of funnel, off-site)

Per GTM v4 (`../../06_marketing/master-plan/phase0-gtm-v4.md`): two engines, **zero paid ads**. Engine B (owned content / DTC) carries the near-term load; Engine A (PT / affiliate) is **FROZEN** (2026-06-07).

Entry sources, each with a CTA pointing down-funnel:

- Founder short-form (IG / YouTube / Facebook), blog SEO, LinkedIn, newsletter — the content machine (`../../06_marketing/content-machine/`).
- Instagram comment-to-DM (ManyChat): a keyword comment auto-DMs a link to the test-selector (`../../06_marketing/content-machine/sops/sop-comment-to-dm.md`).

**Current status:** most feeders are dark — founder channels not launched, ManyChat not set up (needs sub-processor sign-off), the quiz nurture (seq-06) is DRAFT. The pages below are built and live; the traffic to them is not yet flowing.

### 2. Landing / router (front door)

The **test-selector** (`/test-selector`) is the primary router for cold content traffic and the first page Andro Prime owns in the journey. It is **not the only door** — a visitor can land on the blog or a kit page directly and buy without ever taking the quiz.

- A 3-question quiz routes by symptom picture: hormone-led → Kit 1, recovery / inflammation → Kit 2, mixed → **Kit 3 (default up)**. Logic authority: `../../04_products/icp-kit-supplement-alignment-april2026.md`.
- The recommendation is **shown regardless of email** (value first). Email + consent is a **soft opt-in**, not a gate.
- On opt-in it fires `quiz_complete` and sets `quiz_recommended_kit` + `quiz_symptom_flags` (Customer.io identify, keyed on email), which feed **seq-06 (Quiz Nurture, DRAFT)**.
- The result CTA routes to the recommended **kit page** (`/kits/testosterone` | `/energy-recovery` | `/hormone-recovery`), with Kit 3 offered as the broaden-up secondary. It does **not** jump straight to checkout.

Built + live-wired: `09_website-app/frontend/app/(marketing)/test-selector/` + `components/marketing/TestSelectorQuiz.tsx` + `app/api/forms/test-selector/route.ts`.

### 3. Kit selection

| Kit | Price (10% code) | Markers | Positioning |
|---|---|---|---|
| **Kit 1 — Testosterone** | £99 (£89.10) | Total T, SHBG, FAI, Albumin, Free T | Hormone-led symptoms |
| **Kit 2 — Energy & Recovery** | £119 (£107.10) | Vitamin D, Active B12, hs-CRP, Ferritin | Recovery / energy / inflammation |
| **Kit 3 — Hormone & Recovery** | £179 (£161.10) | Kit 1 + Kit 2 (9 markers) | Mixed picture; the default-up route |

Kit pages carry the "add to basket / start checkout" CTA → `POST /api/checkout/kit`. Pricing is owned by the catalogue; the numbers here are the funnel headline only.

### 4. Checkout

Flow: kit page → `POST /api/checkout/kit` → if DOB / sex / consent are missing, the API returns `needsDetails` and the customer is sent to **`/checkout/details`** to supply them → resubmit → **Stripe Checkout** → `success_url: /order/confirmed`.

Captured at checkout (`app/api/checkout/kit/route.ts`):

- **kitType** → resolves the Stripe Price ID (env `STRIPE_PRICE_KIT_1/2/3`, set live in Coolify).
- **DOB** with an **18+ age gate** (order refused under 18), and **sex** — both reused from the user record for a returning customer.
- **CA-018 health-data processing consent** (Art 9(2)(a)), version-stamped (`HEALTH_PROCESSING_CONSENT_VERSION`). Captured **at the point of purchase** where it is freely given; a customer who already consented is **not** re-asked. Carried through Stripe metadata → stamped on the user record by the Stripe webhook.
- **Discount codes:** allowlisted `?discount=` coupons (`SUBSCRIBER10` from seq-04 retest, `LAUNCHDAY10` from seq-01 launch); a bad code silently degrades to full price, never blocks the sale. Separately, FirstPromoter referral attribution rides the `_fprom_tid` cookie into metadata (the affiliate 10% path — dormant while Engine A is frozen).
- Stripe collects GB shipping + billing address + phone; GBP; card only.

**Guest checkout is supported.** Guests are identified in Customer.io by email (not an auth UUID), which keeps the quiz / purchase / result profile unified and avoids the `users`-table FK 500.

### 5. Confirmed

Stripe `checkout.session.completed` → the webhook (`app/api/webhooks/stripe/route.ts`) creates the order, stamps consent, and fires downstream events. Guest purchases also create an account (`guest_purchase_account_created` → **T-09**). Order confirmation → **T-01**; post-purchase nurture (result pending) → **seq-02**.

### 6. Dispatch → handoff

Kit dispatched → **T-02** (tracking). Customer activates (`../../08_customer-journey/flows/flow-3-kit-activation.md`), does the finger-prick, posts to Vitall. When Vitall returns results, the `result_received` webhook fires and **this funnel hands off to `flow-4-results-to-action.md`**.

---

## Events fired in this funnel

| Event | Fired when | Downstream |
|---|---|---|
| `quiz_complete` | Test-selector opt-in | seq-06 (Quiz Nurture, DRAFT) |
| `purchase` | Stripe payment confirmed | T-01, seq-02 |
| `guest_purchase_account_created` | Guest order creates an account | T-09 |
| `kit_dispatched` | Kit posted to customer | T-02 |
| `result_received` | Vitall results webhook | **handoff → flow-4** |

Attribution: `quiz_complete` and `purchase` carry page-attribution UTMs, so newsletter / content → quiz → purchase is traceable (GA4 live since 2026-06-18).

---

## Phase 0a vs 0b

- **Kits are live and purchasable now** (Phase 0a) — this is the current revenue path.
- **Supplements are deferred** — any supplement CTA in the post-result flow is a waitlist opt-in until Phase 0b (see flow-4 + `supplement-conversion.md`). That is an attach concern, downstream of this funnel.

---

## Handoff rules

1. This funnel owns everything up to and including dispatch. **Do not** define results routing, cross-sell-after-result, or attach logic here — those are flow-4 and `supplement-conversion.md`.
2. A change to kit price, marker set, or the Stripe Price IDs must be reflected in the catalogue and `09_website-app/STATE.md` (Stripe config), not just here.
3. A change to the quiz routing logic must stay consistent with `icp-kit-supplement-alignment-april2026.md` (the selection authority).

---

## Cross-sell status (audited + repaired 2026-07-08)

A full audit of the results-engine (`classifier.ts` `resolveCtas`) against the flow-4 spec found the **supplement attach path sound but all three kit-to-kit cross-sells non-functional**. Two were fixed in code; one is gated on an open data decision.

**Supplement attach (result → product):** all firing, routed to the waitlist in Phase 0a (low Vit D / B12 → waitlist; 2+ deficiencies → waitlist, was Complete Men's Stack; elevated CRP + joint qualifier → waitlist / lifestyle; low ferritin / critically-low Vit D / high CRP → GP referral; T > 20 / SHBG → retest). The all-clear maintenance offer is built dark behind `MAINTENANCE_OFFER_ENABLED`. This layer is healthy.

**Kit-to-kit cross-sell:**

| Cross-sell | Trigger | Before 2026-07-08 | Now |
|---|---|---|---|
| Kit 1 → Kit 2 | normal T + energy symptoms | branch existed but **dead** (`energy_symptoms` never written) | branch live, but **still dead in prod** until the signal is wired (below) |
| Kit 2 → Kit 1 | multi-deficiency, or Vit-D/B12 + age ≥40 | fired but link **404'd** (`/kits/testosterone-health`) | **FIXED** → `/kits/testosterone` |
| Kit 1/3 → Kit 3 | normal / ambiguous T (Kit 1) | **not built** (known gap) | **BUILT** (`kit-3-cross-sell` CtaType); normal-T Kit 1 → Kit 2 if energy symptoms else Kit 3 |

Also removed the retired `foundingMember` CTA (dead code). Classifier suite: 20 assertions; tsc + build clean.

### The one open decision — Kit 1 → Kit 2 signal (owner: Keith)

The Kit 2 cross-sell is wired but its trigger, `energy_symptoms`, is **never written to `symptom_answers`** in production (checkout records only DOB / sex / consent). So today every normal-T Kit 1 buyer takes the safe **Kit 3** default; the targeted Kit 2 refinement never fires. Two ways to feed the signal, both un-built:

- **A — ask at Kit 1 checkout.** The `/checkout/details` step already writes per-order data, so this is the "designed" path for `symptom_answers`. Cost: one customer-facing question in the buy flow (needs copy + `/compliance-preflight`).
- **B — reuse the quiz.** The test-selector already captures it as `quiz_symptom_flags`, but that lives in Customer.io keyed by email, and `symptom_answers` is keyed by order — so bridging it needs a persistence step at order creation. No friction; covers quiz-takers only; more plumbing.

The question belongs only on the **Kit 1** path (Kit 2 buyers already test the energy markers; Kit 3 buyers already have them). The ladder works without this; it only sharpens the normal-T Kit 1 secondary from "always Kit 3" to "Kit 2 if tired, else Kit 3."

- **seq-06 is DRAFT** — the quiz nurture will not send until it is activated in Customer.io; the capture works today but the follow-up does not.

---

## Cross-references

- Selection + cross-sell logic: `../../04_products/icp-kit-supplement-alignment-april2026.md`
- Results handoff: `../../08_customer-journey/flows/flow-4-results-to-action.md`
- Attach (supplements): `supplement-conversion.md`
- GTM frame: `../../06_marketing/master-plan/phase0-gtm-v4.md`
- Checkout + consent code: `09_website-app/frontend/app/api/checkout/kit/route.ts`, `lib/auth/consentVersions.ts`
- Email sequences: `../../09_website-app/frontend/email-templates/`
