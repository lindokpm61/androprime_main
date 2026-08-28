# Journey Inventory — every frame the app-wide redesign has to draw

**Status: step 1 of the app-wide redesign, complete as a first pass, 2026-08-27.**
Built to serve the decision Keith made on 2026-08-27: the redesign is **app-wide**, driven from the
mockups, and **the mockup carries the complete journey before anything is rebuilt**. Volatile status
lives in `STATE.md`; this file is the working inventory and changes as screens are drawn.

**Three decisions this file assumes** (Keith, 2026-08-27):

| Decision | Answer |
|---|---|
| Which language survives | **Direction F's.** Geist, 28px squircle with a 22px concentric inner core, very large low-opacity ambient shadow, luminance wash plus fixed film grain, full light and dark token set. |
| Scope of the first pass | **Journey spine only.** The screens a customer walks through. Legal, ops, admin and auth-edge surfaces inherit the system rather than being drawn. |
| Medium | **HTML canvas.** All frames on one pan-and-zoom page, real data, real light and dark, testable contrast and overflow. |

---

## 1. What is actually wrong, stated once

**Three design languages ship today**, each with a file whose header explains why it is different, and
each defensible on its own:

| Language | File | Grammar |
|---|---|---|
| Brand | `styles/themes/brand-theme.css` | Black and white only. No radius, no shadows. Inter headings, Merriweather serif body. |
| App | `styles/themes/app-theme.css` | Status colours permitted here and nowhere else. Motion carve-out: one pulsing dot, one load reveal. |
| Blog | `styles/base/blog-skin.css` | Cream editorial surface, hard offset block-shadow. Namespaced so it cannot leak. |

**Two more exist on paper:** the membership mockup's language (1px hairlines, a 400px framed device,
JetBrains Mono numerals, light and dark tokens) and direction F's, which is now the answer.

**Nobody caught the divergence because every file justified itself and no artefact owned the whole.**
That is the actual defect an app-wide system fixes, and it is why the inventory below exists before
any drawing starts.

---

## 2. The spine

46 `page.tsx` routes exist. The spine below is what a customer walks through. **Counts are FRAMES to
draw, where a frame is a distinct layout, not a distinct URL** — three kit pages sharing one template
are one frame plus a note.

### Land

| Frame | Route | Speaks today | Notes |
|---|---|---|---|
| Home | `/` | Brand | **Direction F is already drawn.** Reuse, do not redraw. |
| Landing page template | `/lp/[product]` | Brand | 5 routes: testosterone, hormone-recovery, energy-recovery, daily-stack, collagen. One template. |
| Blog index | `/blog` | **Blog skin** | The cream surface and block-shadow are the sharpest break from everything else. |
| Blog article | `/blog/[slug]` | **Blog skin** | Long-form typography is the hardest thing to restyle without losing readability. |

### Learn

| Frame | Route | Speaks today |
|---|---|---|
| How it works | `/how-it-works` | Brand |
| About | `/about` | Brand |
| FAQ | `/faq` | Brand |

### Choose

| Frame | Route | Speaks today | States |
|---|---|---|---|
| Test selector | `/test-selector` | Brand | ✅ **READ 2026-08-28. FIVE quiz steps, not three**, plus the page around them |
| Kits index | `/kits` | Brand | 615 lines, hand written |
| ~~Kit page template~~ **Three kit pages** | `/kits/testosterone`, `/kits/hormone-recovery`, `/kits/energy-recovery` | Brand | 🔴 **THERE IS NO TEMPLATE AND NO `[kit]` ROUTE.** Three hand-written pages: 530, 882 and 463 lines, sharing only leaf components |

**10 frames, not 6.** Two corrections, and this is the first one that moves the count UP:

- 🔴 **THE QUIZ IS FIVE STEPS.** `components/marketing/TestSelectorQuiz.tsx`, 514 lines. Steps 1 to 3
  are the questions (Q1 has **four** options, not three). **Step 4 is a four-question Van Westendorp
  price study plus an age band**, shown with the recommendation and deliberately WITHOUT its price.
  **Step 5 is the price reveal plus an email capture** with four states and an unticked consent box.
  The two nobody had written down are the two that carry money and consent.
- 🔴 **"One template" was wrong on both counts.** There is no dynamic `[kit]` route and no shared
  template: three separate pages sharing only `KitCheckoutButton`, `BundleChoice`, `JsonLd` and
  `RelatedArticles`. The 882-line one is nearly twice the others, so they are not even the same page
  with different words. That is 3 frames, not 1, and it is real work nobody had scheduled.

✅ **DRAWN 2026-08-28: `design/mockups/journey/test-selector-F.html`**, frames N (the page), N2 (the
three questions), N3 (the price study) and N4 (the reveal and the capture). 🔵 **Still to draw on
this stage: `/kits` and the three kit pages.**

⚠️ **Three things in the quiz are approved and the redesign must not disturb them:** the scoring map
(2026-05-18, updated 2026-05-26 and 2026-08-12), the Q1 option wording (**split**, not reworded, for
CA-033: "drive has gone" is hormonal, "knackered" is the fatigue picture CA-025 says Kit 1 must never
answer), and the fact that **the display letter is not the stored value** (A/B/C/D render in reading
order while the stored values stay a/d/b/c). 🔴 **And no price of ours may appear on step 4**, per
`07_sales/funnel/site-funnel-model.md` §4, because the Van Westendorp read is only clean un-anchored.

### Buy

| Frame | Route | Speaks today |
|---|---|---|
| Checkout details | `/checkout/details` | Brand |
| Order confirmed | `/order/confirmed` | Brand |

### Account

Five auth frames, all currently Brand: `/auth/signup`, `/auth/consent`, `/auth/login`, `/auth/link`,
`/auth/reset`. **Consent is the one with compliance weight** (health-data processing, CA-018) and its
wording is approved copy that the redesign must not disturb.

### Activate

🔴 **DEPRECATED ROUTE — DO NOT DRAW THESE FIVE FRAMES.** `/activate` was scrapped by decision on
2026-06-12 (`docs/2026-06-12-activate-qr-deprecation.md`, Keith), and `app/activate/page.tsx` carries
the header comment saying so: *"Do not extend."* The login gate goes and the per-order kit code goes,
and **four of the five frames go with them** — the sign-in form and all three error states exist only
because a kit code is matched against an account. Verified 2026-08-28: nothing in `app/`,
`components/` or `lib/` links to `/activate`, and no per-order QR was ever printed, so the flow is
served but unreachable.

| Route | States | Verified |
|---|---|---|
| ~~`/activate`~~ | ~~form, success, not-found, wrong-account, already-activated~~ | ❌ deprecated 2026-06-12; marked, not deleted |
| `/how-to-sample` (**not built**) | one page: the how-to-sample video plus the five steps | 🔵 the sanctioned replacement; its copy already exists as `INSTRUCTIONS` in `app/activate/page.tsx` |

**1 frame, not 5.** The replacement is generic: no login, no order ID, the same QR on every kit
insert, reaching the customer at the open-the-box moment. Drawing the retired flow would commit a
dead screen into the new design system, which is the same class of mistake as laundering unapproved
copy into looking finished.

### Results — the densest part of the journey

| Route | States | Verified |
|---|---|---|
| `/results-dashboard` | **`no-results`**, **`sample-failed`**, **`pre-results`**, results | ✅ explicit branches at `page.tsx:206`, `:234`, `:269`, then the results path |
| `/results-dashboard` | results + **GP-referral present** | ✅ detected at `:323` by any marker whose CTA is `gp-referral`; it changes the whole page's posture |
| `/results-dashboard/handoff` | the printable GP summary | Approved copy, CA-023 |

**5 frames.** Plus the marker card, which is one component in band variants:

**29 result states exist** in `lib/results/biomarker-copy.ts`, across testosterone, SHBG, free T,
vitamin D, B12, CRP, ferritin, albumin and FAI. ⚠️ **These are 29 CARD variants, not 29 screens.**
The mockup needs the card drawn in its band positions — low, normal, optimal, high, and the critical
GP-block posture — which is **5 card variants**, with the rest being copy inside the same shape.

🔴 **Two of the 29 render copy Ewa never approved** (`high-testosterone`, `high-vitamin-d`; source
markers at `biomarker-copy.ts:81` and `:170`). That is CA-044 and it is a live compliance issue, not
a design one, but the redesign must not quietly launder it into new copy.

### Act

| Frame | Route | Speaks today |
|---|---|---|
| Supplements index | `/supplements` | Brand |
| Supplement page template | `/supplements/[product]` | Brand | 2 routes: daily-stack, collagen. |
| Supplement waitlist | `/supplement-waitlist` | Brand |
| Waitlist status | `/supplement-waitlist-status` | App |

### Stay

| Frame | Route | States | Verified |
|---|---|---|---|
| Membership | `/membership` | entitlement **`pending`**, **`none`**, active | ✅ branches at `membership/page.tsx:134`, `:162` |
| Subscriptions | `/subscriptions` | one active card, **empty**, and **six status badges** | ✅ enumerated 2026-08-28; `STATUS_LABELS:22`, empty branch at `:74` |
| Account | `/account` | profile, history, manage, **address** and **data and privacy** (both flag-dark), **empty history**, **nine order statuses** | ✅ enumerated 2026-08-28; `ORDER_STATUS_LABELS:25`, empty branch at `:104` |
| ~~Founding member status~~ | ~~`/founding-member-status`~~ | ❌ **RETIRED 2026-07-22**, the file is `redirect('/account')` | ✅ header comment, 4 lines total |

**5 frames, not 6.** ⚠️ **`/founding-member-status` is ZERO frames**: the programme is closed, the
join API 410s and `founding_member_list` holds no rows. It is the **second** route this inventory
scheduled for drawing that a header comment had already retired, after `/activate`, and both were
caught by reading the first ten lines of the file. That check now runs before anything is drawn.

⚠️ **The six subscription statuses and the nine order statuses are VARIANTS, not screens**, the same
reading error the 29 result states invited. Six badges on one card and nine labels in one row. 🔴 **Membership is the screen that started this**: the build took the mockup's content
and structure and rendered them in the existing app system, which is the divergence in miniature.

✅ **DRAWN 2026-08-28: `design/mockups/journey/membership-F.html`.** Frames H (member), H2 (the four
retest entitlement states as a row), I (the paywall), I2 (the three paywall headings as a row) and J
(the offer shut, both variants). All 24 enumerated parts of the live route are placed; **Ask the
clinician is restored in its POPULATED form** and the MEMBER chip is back, both from
`membership-first-cycle.html` rather than from the live page. Verified by screenshot at 1440 in both
themes and at a true 390.

✅ **DRAWN 2026-08-28: `design/mockups/journey/account-F.html`**, which closes this stage. Frames K
(`/account` populated, including both flag-dark sections), K2 (the nine order statuses as a row, plus
the empty history), L (`/subscriptions` with the active card and the empty state), L2 (the six status
badges) and M (the retired route, drawn as a note so the inventory stops counting it). Verified by
screenshot at 1440 in both themes and at a true 390.

🔴 **The most important thing about `/subscriptions` is invisible on it:** opening the page calls
`markViewedCancelPage`, which flags the Customer.io profile, feeds segment 20 and enrols the customer
into the **seq-05 churn-prevention campaign**. Viewing the screen IS the cancel-intent signal, so it
is a retention surface whether it looks like one or not, and "Manage billing" hands the customer to
Stripe, which is the one place in the signed-in app where the design system stops.

---

## 3. The count

| Stage | Frames |
|---|---|
| Land | 4 (home already drawn) |
| Learn | 3 |
| Choose | 10 (6 drawn: the page and five quiz steps; 4 left: the index and three kit pages) |
| Buy | 2 |
| Account | 5 |
| Activate | 1 (the replacement page; the old 5 are deprecated) |
| Results | 5 + 5 card variants |
| Act | 4 |
| Stay | 5 (the sixth was a retired route) |
| **Total** | **≈ 44 frames** (45, then 41 when `/activate` was found deprecated, then 40 when `/founding-member-status` was found retired, then **up to 44** when the quiz turned out to be five steps and the kit pages turned out not to share a template) |

**Light and dark is a token flip, not a redraw**, so it does not double the number. It does mean every
frame has to be checked in both, which is exactly what an HTML canvas makes cheap and a static
drawing makes impossible.

---

## 4. Deliberately NOT drawn

These inherit the system without a frame: `/privacy`, `/terms`, `/contact`, `/authors/[slug]`,
`/blog/preview/[slug]`, `/waitlist`, `/go`, `/admin/dashboard`, `/ops/content`,
`/(app)/founding-member`, and the `/subscription/confirmed` variant of order-confirmed.

**If any of these turns out to carry a layout the system cannot express, it comes back onto the
list.** Being out of scope is a claim about the system's coverage, not a claim that the page does not
matter.

---

## 5. Open, and needed before drawing starts

1. ✅ **CLOSED 2026-08-28, and the guess was low.** Five steps, not three, and the page itself is a
   full marketing page around them. The estimate was made from the route's shape, which is exactly
   the method that cannot see a Van Westendorp block or an email capture, because neither is visible
   in a route name. **Sizing a component from its route is how the two commercially loaded steps
   stayed unwritten for as long as they did.**
2. ✅ **CLOSED 2026-08-28. `/subscriptions` and `/account` are enumerated and drawn**, and
   `/founding-member-status` turned out to be retired rather than single-state. "Probably
   single-state" was wrong in both directions: `/account` carries two flag-dark sections and nine
   order statuses, and the third route carries nothing at all.
3. **The blog is the hardest frame and the least specified.** It is the one surface with a documented
   licence to break the brand rules, and long-form reading is where a system either holds or fails.
   Decide whether the blog adopts F's language wholesale or keeps a scoped editorial variant.
4. **CA-045 arms when any of this reaches a live page**, and the F hero imagery is inside that gate.
