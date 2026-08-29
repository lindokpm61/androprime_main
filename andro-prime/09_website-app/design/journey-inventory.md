# Journey Inventory — every frame the app-wide redesign has to draw

**Status: step 1 of the app-wide redesign, complete as a first pass, 2026-08-27.**
Built to serve the decision Keith made on 2026-08-27: the redesign is **app-wide**, driven from the
mockups, and **the mockup carries the complete journey before anything is rebuilt**. Volatile status
lives in `STATE.md`; this file is the working inventory and changes as screens are drawn.

🟢 **APPROVED 2026-08-28: the frames drawn on or before that date.** Keith signed off the six drawn
files as the design record: *"everything up until this point on this mock-up journey I'm happy with
and is approved."* It is a design approval and nothing beyond one. **The full statement of what it
covers and the four things it does NOT do is the entry at the top of `STATE.md`, and it is not
restated here on purpose**, because a boundary held in two places drifts in one of them. Two rules
fall out of it for this file: **the six approved files are the ones named in that entry**, so
anything drawn after 2026-08-28 is undrawn-then-unapproved until Keith says otherwise and must not
inherit today's approval by sitting under the same heading; and **approval of a frame is never
approval of the copy inside it**, so every ⚠️ and 🔴 copy constraint below survives untouched.

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
| ~~Landing page template~~ **Five hand-written pages** | `/lp/*` | Brand | 🔴 **No `[product]` route.** 246 / 266 / 412 / 505 / **723** lines, five different section lists. A real shared `layout.tsx` (stripped nav + one compliance line) and no template |
| ~~Blog index~~ | `/blog` | **Blog skin** | ✅ **OFF THE BOARD.** Keith 2026-08-27: the blog keeps `blog-skin.css`. F lost that frame; `blog-F.html` stands as the record |
| ~~Blog article~~ | `/blog/[slug]` | **Blog skin** | ✅ **OFF THE BOARD**, same ruling |

✅ **DRAWN 2026-08-29: `design/mockups/journey/lp-sample-F.html`**, Frame AC (the LP shell plus a
variance table across the five) and Frame AD (`/how-to-sample`). Verified at 1440 and a true 390,
both themes.

🔴 **"ONE TEMPLATE" WAS WRONG FOR THE THIRD TIME, AND THIS IS THE LARGEST INSTANCE.** Five
hand-written files with a **three-fold spread** and two different section-comment styles. What is
genuinely shared is `app/lp/layout.tsx`. ⚠️ **The kit pages, the supplement product pages and these
all made the same error, and the auth routes made it in reverse** (four routes, one component). Four
structural guesses in this inventory, four wrong, in both directions.

🔴 **`/lp/hormone-recovery` IS THE KIT 3 PAGE AGAIN.** Eleven sections: Kit 3's ten in the same order
plus a closing CTA, and its COMPARE section carries Kit 3's heading verbatim, "All three kits, side
by side". **That is the THIRD comparison table of the same three products**, after `/kits` and
`/kits/hormone-recovery`. 723 lines duplicating an 882-line page, with a third founders block and Dr
Ewa's sixth appearance.

⚠️ **Nothing in the codebase links to any `/lp/` route.** Correct by design for ad-reached pages, but
`01_strategy/STATE.md` records that nothing has been promoted, so **these five pages, 2,152 lines,
may never have been used.**

### Learn

| Frame | Route | Speaks today | Notes |
|---|---|---|---|
| How it works | `/how-it-works` | Brand | 493 lines, 9 sections. Carries **A1 (CA-026) verbatim** |
| About | `/about` | Brand | 195 lines, the shortest route in the set |
| ~~FAQ~~ **The facts page** | `/faq` | Brand | 🔴 **NOT AN FAQ.** 477 lines, 9 sections, zero question-and-answer pairs |

✅ **DRAWN 2026-08-29: `design/mockups/journey/learn-F.html`.** Frames S, T and U. Lifecycle check
ran first: all three alive, no retirement comment, no docs entry, and **no feature-flag read
anywhere** in the three files (the fifth rule, earned on the kit pages). Verified by screenshot at
1440 and a true 390 in both themes.

🔴 **`/faq` IS NOT AN FAQ, AND THE ROUTE NAME IS THE ONLY THING THAT SAYS IT IS.** It is a long-form
biomarker education page: three statistics, three clinical band tables, four EFSA claim quotations, a
seven-row marker table, the NHS-gap essay and the **C2 (CA-026) price block**. Its own schema object
is called `factsSchema`, which is the only place the code admits what it is. The footer labels it
"FAQ". **The actual FAQs live on the three kit pages**, in the grid standardised on 2026-08-29.
Whether it keeps the name is Keith's call; drawing it as an FAQ would have committed the wrong
answer.

🔴 **THE PANEL IS UNDERSTATED ON BOTH LEARN PAGES, BY THE SAME TWO MARKERS.** `/how-it-works` lists
Kit 1 as **three** markers (Total T, SHBG, Free T) where every commerce surface says **five**;
`/faq`'s "every marker we test" table lists **seven** and its copy commits to the number ("we test the
seven that actually answer the question") where the panel is **nine**. **FAI and Albumin are missing
from both.** 🔴 **And on `/faq` the contradiction is internal**: the CA-026 approved block on the same
page says the price buys "the markers that matter for men, **including free testosterone via FAI**".
An approved sentence and an unapproved table on one route disagreeing about what the product
contains. Both pages predate FAI and Albumin joining the panel and were never swept. **Copy fix,
Keith's, not a frame fix.**

⚠️ **Three duplicated facts confirmed on this stage.** A1 (CA-026) is rendered verbatim on **both**
`/about` and `/how-it-works`; Dr Lindo is presented **three times** across the journey (`/about`,
`/how-it-works`, the Kit 3 founders block); and the four-step process card now exists in four
hand-written copies. A signed claim held in two places is the worst of the three, because correcting
it has to reach every copy or the site quotes two versions of one approved statement.

⚠️ **Band tables publish clinical thresholds outside the engine.** Checked for vitamin D: the two
boundaries `classifier.ts:303-304` enforces (< 25, < 50) match the page exactly. The 75 and 125
splits above them have **no engine equivalent** and are the ones that can drift silently.

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
three questions), N3 (the price study) and N4 (the reveal and the capture).

✅ **DRAWN 2026-08-28: `design/mockups/journey/kits-F.html`, AND THIS CLOSES THE CHOOSE STAGE.**
Frames O (`/kits`, all six sections), P (`/kits/testosterone`, eleven sections), Q
(`/kits/energy-recovery`, eight), R (`/kits/hormone-recovery`, ten) and **P2, a state that was not on
this list**. Lifecycle check ran first and the route is alive: no retirement comment, no docs entry,
and the densest inbound linking on the site (footer, homepage, `/how-it-works`, `/about`,
`/supplements`, `/waitlist`, `/order/confirmed`, two landing pages, the selector's three
recommendations, `lib/content/kitCTA.ts`, `sitemap.ts`). Verified by screenshot at 1440 and a true
390 in both themes.

🔴 **THE THIRD CORRECTION, AND IT IS A STATE RATHER THAN A COUNT: `BUNDLES_ENABLED`.** Every kit page
calls `isBundlesEnabled()` and branches on it **twice**, in the hero and at the close. With the flag
on, the hero leads with a bundle price and the close becomes a `BundleChoice`. It is not a swapped
button: **the related-reading block and the competing-kit cross-sell are both REMOVED**, by direction
(Keith, 2026-07-24, the page should end on the buying decision). Three kit pages, two states each,
**six page endings, not three**. `deployment/env/vars.md` records the flag OFF, so the flag-off state
is drawn as the page and the flag-on state is Frame P2, drawn once because the shape is identical on
all three. ⚠️ vars.md is a record rather than a reading of production, and there is an open ticket for
exactly that drift on a different flag.

**The rule this adds: a route's states are not only its JSX branches.** The `/test-selector`
correction came from reading the component's steps, and the same method here would still have missed
this, because the branch is not shaped like one: it is a `const` read at the top of the file from an
environment variable, and the two `? :` that consume it are 300 lines apart. **Grep the route for
flag reads before declaring its states enumerated.**

⚠️ **Three things in the quiz are approved and the redesign must not disturb them:** the scoring map
(2026-05-18, updated 2026-05-26 and 2026-08-12), the Q1 option wording (**split**, not reworded, for
CA-033: "drive has gone" is hormonal, "knackered" is the fatigue picture CA-025 says Kit 1 must never
answer), and the fact that **the display letter is not the stored value** (A/B/C/D render in reading
order while the stored values stay a/d/b/c). 🔴 **And no price of ours may appear on step 4**, per
`07_sales/funnel/site-funnel-model.md` §4, because the Van Westendorp read is only clean un-anchored.

### Buy

| Frame | Route | Speaks today | States |
|---|---|---|---|
| Checkout details | `/checkout/details` | Brand | ✅ **READ 2026-08-29.** 80-line route around a **177-line form**: three fields, **six error strings**, a submitting state |
| Order confirmed | `/order/confirmed` | Brand | ✅ **READ 2026-08-29. Three renderable states**, plus one redirect that renders nothing |

**4 frames, not 2**, and the correction is the same one the test selector forced: **a route's line
count measures its wrapper, not its surface.** `/checkout/details` is the smallest-looking page in
the set and everything that matters is in `components/commerce/CheckoutDetailsForm.tsx`.

✅ **DRAWN 2026-08-29: `design/mockups/journey/buy-F.html`.** Frames V (the form), V2 (the six errors
plus submitting), W (the receipt) and W2 (the three states). Lifecycle check first: both alive, no
retirement comment, no docs entry. ⚠️ **Both are `robots: index:false`**, the only two frames in the
journey set deliberately invisible to search.

🔴 **CA-018 IS CAPTURED ON `/checkout/details`, NOT ONLY ON `/auth/consent`.** This file records the
health-data consent against `/auth/consent` in the Account stage and calls that route "the one with
compliance weight". The Article 9(2)(a) consent is taken **on the checkout form, at the point of
purchase**, by design: the source comment says it is captured there "so it is freely given as part of
deciding to buy", it is **required to proceed to payment**, and it is version-locked to
`HEALTH_PROCESSING_CONSENT_VERSION` = `2026-06-23-v1` (`lib/auth/consentVersions.ts:18`). The comment
adds: *"Any wording change needs a new version string + a fresh CA record."* **The Account stage may
carry consent copy of its own and that is worth checking when those frames are drawn, but the Buy
stage is where a buyer actually gives it.**

⚠️ **The order reference has a scar worth keeping.** Until 2026-08-04 `/order/confirmed` read
`session_id` and rendered nothing from it, so a customer who closed the confirmation email could not
find their reference. Resolving one requires being signed in, so **the fallback state is what a
first-time buyer sees**. The signed-out arrival is a redirect to `/auth/post-checkout` carrying a
loop guard (`post_checkout=1`) whose comment records that a failed sign-in used to bounce a customer
between the two routes forever. **An inventory that counts screens misses a redirect.**

### Account

Five auth frames, all currently Brand: `/auth/signup`, `/auth/consent`, `/auth/login`, `/auth/link`,
`/auth/reset`.

🔴 **4 FRAMES, NOT 5, AND THIS IS THE KIT-PAGE ERROR IN REVERSE.** Four of the five routes
are the SAME COMPONENT in four modes: `components/auth/AuthCard.tsx`, 177 lines,
`mode = login | signup | reset | link`, wrapped by four 25-line routes that pass in a title, a
standfirst and a server action. They differ in five things and no more: the heading, the
standfirst, which fields render, the submit label, and which cross-links show. On the kit pages
this file said "one template, three kits" and there was no template. Here it said five frames and
there is one component. **Both readings came from route names rather than files, and they were
wrong in opposite directions.**

🔴 **`/auth/consent` CARRIES NO HEALTH-DATA CONSENT. VERIFIED 2026-08-29 BY READING IT.**
~~Consent is the one with compliance weight (health-data processing, CA-018) and its wording is
approved copy that the redesign must not disturb.~~ Both halves were wrong. The route asks an
**age** (18+ eligibility) and offers a **marketing opt-in**. No Article 9(2)(a) wording, no CA-018
sentence, nothing version-locked. The health-data consent is on `/checkout/details`, gating
payment. ⚠️ **The route name is the second mismatch in this inventory**, after `/faq`: both
names describe what a reader would assume rather than what the page holds.

🔴 **18+ IS COLLECTED THREE TIMES AND ENFORCED TWICE.** `/checkout/details` takes a date of
birth with a `max` attribute and an `isAtLeast18()` re-check; `/auth/consent` takes an `age` with
`min={18}` and **required**; `/auth/signup` takes an `age` with `min={18}` and **no `required`**.
Mandatory in two places, optional in the third. Behaviour question, Keith's.

⚠️ **The marketing opt-in sentence exists twice**, word for word, on `/auth/signup` and
`/auth/consent`. Fifth member of the duplicated-fact pattern. **OAuth is Google only**, and the
source records that Microsoft is deliberately withheld pending Azure app registration.

✅ **DRAWN 2026-08-29: `design/mockups/journey/auth-F.html`.** Frames X (the card, login mode),
X2 (the four modes as a row), X3 (the message and error banners) and Y (`/auth/consent`).
Lifecycle check first: all five alive, no retirement comment, no flag read. Verified by screenshot
at 1440 and a true 390 in both themes.

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

| Frame | Route | Speaks today | Notes |
|---|---|---|---|
| Supplements index | `/supplements` | Brand | 213 lines |
| ~~Supplement page template~~ **Two hand-written pages** | `/supplements/daily-stack`, `/supplements/collagen` | Brand | 🔴 **No `[product]` route.** 263 lines EACH, same 9-section skeleton, **250 of 263 lines differ** |
| Waitlist form states | shared component | n/a | 🔴 **5 states on 3 routes**, never inventoried |
| Supplement waitlist | `/supplement-waitlist` | Brand | 184 lines |
| Waitlist status | `/supplement-waitlist-status` | App | 61 lines, `(app)` group, noindex, **3 states incl. a blank one** |

**5 frames, not 4.** ✅ **DRAWN 2026-08-29: `design/mockups/journey/act-F.html`** (Frames Z, Z2, Z3,
AA, AB). Verified by screenshot at 1440 and a true 390 in both themes.

🔴 **READ THIS BEFORE REBUILDING THIS STAGE: THE STRATEGY MOVED UNDER IT, AND ONLY THE DOCS CHECK
FOUND IT.** Every route is alive with no retirement comment, so the code says nothing is wrong.
`docs/2026-08-23-supplement-shop-front-spec.md` opens **"SUPERSEDED IN DIRECTION, 2026-08-24"**:
supplements moved to a **secondary shop at member price**, with the app as the product and the kit as
the gateway. **Adopted 2026-08-25.** `01_strategy/STATE.md` (2026-08-26) adds that member pricing is
for supplements and **"stays dark until supplements are listed in the shop"**, the shop living at
`/supplements`, organised by panel, identical for every visitor. These four routes are **pre-decision
waitlist pages**. They are drawn because a customer reaches them today and their copy is still true;
⚠️ **this is the stage most likely to be redrawn**, and the replacement is not drawable because it is
adopted in direction and undecided in substance.

**The product pages sit between the two errors this inventory has made.** Not a template (no dynamic
route, two hand-written files, like the kits) and not two unrelated pages (same nine sections in the
same order). **250 of 263 lines differ and the formulation data is not the same shape in both**, so
no shared component could render them unchanged. They are the same page written twice. Both files
being exactly 263 lines is a coincidence.

🔴 **A signed-out visitor to `/supplement-waitlist-status` gets a blank page**: `if (!user) return
null`, no redirect, no prompt, no empty state. `/order/confirmed` redirects in the same situation, so
the pattern exists and this route does not use it. **Behaviour fix, Keith's.**

⚠️ **Four EFSA claims sit on `/supplements` attached to products that have not shipped**, quoted
verbatim. **Dr Ewa appears on both product pages**, taking her to five presentations across the
journey.

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
| Land | 2, **both drawn**: the homepage and the LP shell. The two blog frames came off the board (the blog keeps its own skin) |
| Learn | 3, **all drawn** |
| Choose | 11, **all drawn**: the selector page and its five steps, the index, three kit pages, and the bundles-on state |
| Buy | 4, **all drawn**: the form, its six errors, the receipt, its three states |
| Account | 4, **all drawn**: the card, its four modes, its banners, and the consent route |
| Activate | 1, **drawn**: `/how-to-sample`, the replacement page. The old 5 are deprecated |
| Results | 5 + 5 card variants |
| Act | 5, **all drawn**: the index, the two product pages as one skeleton, the form's five states, the waitlist, the status route |
| Stay | 5 (the sixth was a retired route) |
| **Total** | **≈ 45 frames** (45, then 41 when `/activate` was found deprecated, then 40 when `/founding-member-status` was found retired, then up to 44 when the quiz turned out to be five steps and the kit pages turned out not to share a template, then **45** when the kit pages turned out to have a second state behind `BUNDLES_ENABLED`). ✅ **ALL 40 FRAMES PLUS THE 5 MARKER-CARD VARIANTS ARE DRAWN. THE JOURNEY SPINE IS COMPLETE (2026-08-29).** The two blog frames came off the board rather than being drawn, because the blog keeps its own language by Keith's 2026-08-27 ruling. |

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
