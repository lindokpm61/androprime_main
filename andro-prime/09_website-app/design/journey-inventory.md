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
| Blog index | `/blog` | **Blog skin, under review** | 🔄 **BACK ON THE BOARD 2026-08-29.** Keith asked for a complete `blog-F.html` rebuild with the missing elements. Drawn as Frame AP. The 2026-08-27 ruling stands until he rules again |
| Blog article | `/blog/[slug]` | **Blog skin, under review** | 🔄 **BACK ON THE BOARD 2026-08-29.** Frames AL (the article), AM (**the twelve MDX components**, none of which the first draft drew), AN (the two emphasis ladders), AO (the tail). Plus AQ for `/authors/[slug]` |

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
| **Total** | **≈ 45 frames** (45, then 41 when `/activate` was found deprecated, then 40 when `/founding-member-status` was found retired, then up to 44 when the quiz turned out to be five steps and the kit pages turned out not to share a template, then **45** when the kit pages turned out to have a second state behind `BUNDLES_ENABLED`). ⚠ **ALL 40 PAGE FRAMES, THE 5 MARKER-CARD VARIANTS, AND THE 7 CHROME FRAMES ARE DRAWN. TWO SURFACES REMAIN: the OG share cards (section C).** A full sweep on 2026-08-29 (triggered by Keith spotting the missing footer) found **eleven missing surfaces** and **no 404 page anywhere in the codebase**. The 404 was built the same day; the other ten are drawn in `chrome-F.html` as frames AE to AK. **The spine now covers the pages AND the things on every page.** See the block below this table. The two blog frames came off the board rather than being drawn, because the blog keeps its own language by Keith's 2026-08-27 ruling. |

### ✅ CLOSED 2026-08-29: THE SWEEP FOUND ELEVEN MISSING SURFACES. THE 404 IS BUILT, THE REST ARE DRAWN

**Keith caught the first one after the spine was called complete** ("we dont appear to have the
footers"), then asked for a complete check. This section is that check. The method was to stop
enumerating routes and instead enumerate **every file in `app/` that renders**, every component in
`components/`, and every layout, then diff each against the ten journey files.

**Why the original count missed all of it in one stroke:** the inventory was derived from the route
tree. Every page a customer can reach became a frame, which is mechanical and defensible and has
exactly one blind spot: **shared chrome is rendered by a layout, not a page, so it has no route and
never enters a route-derived list.** Every gap below except the 404 and the share cards is on the
other side of that line. `results-F.html` shows the same failure in miniature: it enumerated twenty
items of page chrome from `results-dashboard/page.tsx` *and its components*, which is thorough, and
still missed the nav, because the nav is in the layout above it.

**All 46 routes are accounted for.** The gaps are entirely in the non-route layer.

✅ **RESOLVED THE SAME DAY.** The 404 was **built** (`app/not-found.tsx`, verified in a real browser
on a production build: 404 status and exactly one nav and one footer on `/nonsense`,
`/blog/<missing>`, `/authors/<missing>` and `/kits/<missing>`). Sections **A and B are drawn**, in
`design/mockups/journey/chrome-F.html`, frames AE to AK. The three items in sections D, E and F are
handed back rather than closed, because none of them is a design decision. The tables below are kept
as the record of what was missing and why.

🔴 **SECTION C IS STILL OPEN, AND THIS LINE PREVIOUSLY SAID OTHERWISE.** It read "everything
else in sections A, B and C is drawn". **The two OG share cards are not drawn**, in `chrome-F.html`
or anywhere else, and the claim was written in the same pass that drew the frames rather than after
checking them. Corrected when Keith asked whether the journey was now complete, which is the third
time in one day that a completeness claim about this set has been wrong, and the second time the
error was mine rather than inherited. **A completeness claim written from intent rather than from a
re-run of the check is not evidence**, and the cost of re-running it here was one grep.

#### A. Shared chrome that is not drawn

| Surface | Where it lives | Reach | Note |
|---|---|---|---|
| **The site footer** | `components/shared/Footer.tsx`, 111 lines, via `app/(marketing)/layout.tsx:28` | **25 routes** | Brand column with the *"wellness information service ... they don't diagnose conditions, replace your GP, or constitute medical advice"* paragraph, **UKAS ISO 15189** and **EFSA-Approved Claims** chips, a 4-link Diagnostics column, a 7-link Company column plus the cookie-settings trigger, and a copyright bar with the registered-company line and the `SYS.STAT` / `SEC` mono strings. **The densest block of compliance and legal linkage on the site**, and per `learn-F.html` the only inbound path to `/about` and `/faq`. Not in any journey file, and not in `F-field.html` either, so the chosen direction never stated what its footer looks like |
| **The cookie-consent banner** | `components/analytics/CookieConsent.tsx`, 81 lines, via the ROOT layout | **every route** | The first thing every new visitor sees, over the hero, on every page. PECR / UK GDPR, and the source notes **Accept and Reject are deliberately equal-weight because the ICO requires rejecting to be as easy as accepting** ... which is a visual-design requirement recorded only in a code comment. It is visible in this session's own screenshots of `/faq` and `/how-it-works` and was never drawn |
| **`Nav variant="app"`** | `components/shared/Nav.tsx` via `app/(app)/layout.tsx` | 6 app routes | The authenticated top bar. Logo links to `/results-dashboard` rather than `/`, and the CTA is a log-out. None of the four `(app)` frames shows it |
| **The nav mobile drawer** | `Nav.tsx:219-301`, `menuOpen` state | **every route under 768px** | A hamburger toggle and a full drawer with its own link list and close behaviour. No mockup shows it in any variant, so the mobile nav has no frame at all |
| **`SkipToContent`** | `components/shared/SkipToContent.tsx` via the ROOT layout | every route | Small, but a genuinely visible state: it appears on first keyboard tab. Undrawn means undesigned |

#### B. Failure surfaces that are not drawn, and one that does not exist

| Surface | Lines | Note |
|---|---|---|
| `app/error.tsx` | 62 | The marketing error boundary. "Something went wrong.", a **Try again** button, **Back to site**, a support email, and the Sentry `digest` quoted as a reference. Added 2026-08-04 precisely so errors stop falling through to the unstyled last resort. Not drawn |
| `app/(app)/error.tsx` | 75 | The authenticated error boundary. Not drawn |
| `app/global-error.tsx` | 23 | The last resort: renders its own bare `<html>`, no styling, no branding, no navigation. **Deliberately unstyled**, but the frame set should say so rather than be silent |
| **`not-found.tsx`** | **0** | 🔴🔴 **THERE IS NO 404 PAGE ANYWHERE IN THE CODEBASE.** `find app -name "not-found*"` returns nothing, so every mistyped URL, dead inbound link and expired share serves **Next.js's default black-and-white 404**: no logo, no nav, no footer, no route back into the site. This is the one item in this audit that is not a missing frame, it is a **missing page, live right now** |

#### C. Off-site brand surfaces that are not drawn

| Surface | Lines | Note |
|---|---|---|
| `app/opengraph-image.tsx` | 107 | The default 1200x630 share card: how every non-article link renders in WhatsApp, iMessage, Slack, LinkedIn and X. For a business whose acquisition is social and paid, this is a first-impression surface with no frame |
| `app/api/og/blog/[slug]/route.tsx` | 331 | Per-article share cards, `card` and `social` variants. Off the board only if the blog's off-board ruling is read to cover its share cards too, which it does not obviously do: the ruling was about the blog keeping `blog-skin.css`, and a share card is not the blog's skin |

#### D. One frame that was drawn and was not marked as a proposal ✅ RESOLVED 2026-08-29

🔴 **`results-F.html` section 08 draws a footer that does not exist.** Four links, *"How we set
our ranges"*, *"What we do not test"*, *"Your data"*, *"Delete my results"*, plus *"Nothing here is a
diagnosis"*. **None of those strings appears anywhere in `app/`, `components/` or `lib/`, and
`app/(app)/layout.tsx` renders no footer at all.** So the one journey file that drew a footer invented
one, on the one stage that has none. That is the `/activate` lesson running backwards: a lifecycle
check catches a route that is drawn and dying; it cannot catch a **component that is drawn and never
existed**.

✅ **KEITH KEPT IT, 2026-08-29.** So this is now a decision rather than an accident: **the
authenticated area gains a footer it does not have today**, and `results-F.html` records it as a
PROPOSAL. Three changes went with keeping it. The two links with no page behind them
(*"How we set our ranges"*, *"What we do not test"*) are **drawn differently** from the two that
resolve, so the frame cannot be misread as four working links. The two that resolve
(*"Your data"*, *"Request erasure"*) point at the `Data & privacy` section of `/account`, which is
real and CA-024 approved but **dark behind `ACCOUNT_DATA_CONTROLS_ENABLED`**. And 🔴 **one label was
reduced**: *"Delete my results"* became *"Request erasure"*, because
`components/account/DataPrivacySection.tsx` **records an erasure request and does not delete**, so a
footer promising deletion on special-category health data claimed an immediacy the approved copy is
careful not to claim. That is a claim reduction back onto approved language and needs no fresh
sign-off, on the CA-001 / CA-003 precedent.

**When it is built it belongs in `app/(app)/layout.tsx`**, one file for six routes, for the reason
`app/lp/layout.tsx` already demonstrates: a fact that lives in one file cannot drift.

#### E. One fact no frame states

**The `/auth/*` routes have no nav and no footer.** There is no `app/auth/layout.tsx`, so those five
pages render under the ROOT layout alone: the AuthCard on an otherwise empty page, with no way back
into the site except the browser's back button. `auth-F.html` draws the card correctly and never says
this, so a rebuild reading it would most likely add chrome that is currently absent. Whether that
absence is deliberate is worth one line from Keith.

#### F. Dead code the sweep turned up

Not frames, but found by the same pass and worth a cleanup commit: **five components with zero
references anywhere in `app/`, `components/`, `lib/`, `content/` or `scripts/`** ...
`components/marketing/TrustBar.tsx`, `BiomarkerPanel.tsx`, `KitCard.tsx`,
`components/commerce/SubscribeButton.tsx`, `components/app/AppPlaceholder.tsx` ... plus an **empty
`components/lp/` directory**.

#### Confirmed clean (checked, and genuinely covered)

- **All 46 routes** appear in this inventory, including the five `/lp/*` pages under the `/lp/*` row.
- **The printed GP handoff IS drawn**, as Frame G in `results-states-F.html`, explicitly as a print
  artefact that leaves F's language on purpose. It is implemented with Tailwind `print:` variants,
  not an `@media print` block, which is why a stylesheet grep finds nothing.
- **The Google OAuth button IS drawn** in `auth-F.html`, with a note explaining that Microsoft is
  withheld rather than forgotten.
- **`PasswordBanner` is drawn** (`results-F` item 01); **`DevFixtureBar` was deliberately dropped** as
  dev-only.
- **~20 blog components** (`ArticleLayout`, `ArticleToc`, `PullQuote`, `EvidenceBox`, `References`,
  `SystemAlert`, `BackToTop`, `NewsletterForm` and the rest) are correctly out of scope: the blog
  came off the board on 2026-08-27.
- **The activate components** are attached to the deprecated route.

#### What closed this, and what is still open

`design/mockups/journey/chrome-F.html` is the eleventh file in the journey set and the one the other
ten assumed. Seven frames:

| Frame | Surface | Note |
|---|---|---|
| **AE** | The site footer | The frame Keith asked for. Its two dependencies on Frame AH run both ways: the footer holds the only control that reopens consent |
| **AF** | The nav, three variants as a row | Records that the app variant's logo does **not** go home, and that **the log-out is a POST form and never a link** because Next prefetches links in a fixed nav and a GET log-out signed users out with no click |
| **AG** | The mobile drawer, plus the scrolled state | The drawer pushes rather than overlays, drawn as the live behaviour with the overlay question left open on purpose |
| **AH** | The cookie banner | Draws the equal-weight Accept/Reject that the ICO requires, so the rule stops living only in a code comment |
| **AI** | The 404 | A record, not a proposal: it was built first |
| **AJ** | The three error boundaries | Including `global-error.tsx` drawn **unstyled**, because restyling it into F would specify a screen that cannot render |
| **AK** | The skip link | The only part of the interface that is invisible until it is the most important thing on screen |

**What `chrome-F.html` does NOT cover**, and the frame list above is the whole of it: the two OG
share cards in section C, and `app/activate/layout.tsx`, whose centred-logo header belongs to the
deprecated route and dies with it. Two further absences are worth a decision but are not undrawn
surfaces, because there is nothing to draw: **there is no `loading.tsx` anywhere in the app**, so no
route has a loading state and every navigation to a dynamic route holds the previous screen until the
server answers; and **`/how-to-sample` is drawn (Frame AD) but has never been built**, which is the
404 situation in reverse.

Verified at 1440 and a true 390, in both themes, zero em dashes.

**Still open, and both are Keith's:** the unstated absence of chrome on `/auth/*` (section E) and the
dead-code cleanup (section F). Section D was answered on 2026-08-29: the footer stays, as a proposal.

#### The blog rebuild, 2026-08-29

The first F blog draft lost on 2026-08-27 with a verdict that named its own condition: *"There's a
lot of detail missing from the F blog you created, which at the moment I don't know if you can
capture."* Keith asked for the rebuild on 2026-08-29, so the useful move was to find the detail
rather than re-argue the texture.

🔴 **The detail is a twelve-piece editorial component system**, and eleven of the twelve were in
no frame: `Caveat`, `Note`, `PullQuote`, `Punchline`, `PublishedEvidence`, `StatBox`, `SystemAlert`,
`ClinicalInsight`, `InlineKitCTA`, `EvidenceBox`, `SysHeading`, `NumberedHeading` (which has its own
inverted `feature` variant). Read the live left-rule weights in order: **4px grey, 4px black, 6px,
8px.** That is a four-step emphasis ladder built by a writer who needed four volumes of aside, and
the first draft collapsed all four into one. It was never a cream-versus-wash question.

The rebuild gives F a ladder of its own, spent on **ground** rather than border weight: nothing,
sunk, sunk-with-accent, core, core-with-ring, tray, tray-with-wash, inverted. **Two things F cannot
reproduce and the file says so**: the dot pattern has no F equivalent, and the hard offset
block-shadow is a statement of flatness that F's ambient shadow contradicts by design. Against that,
**the live blog has no dark mode and cannot easily get one**, since the cream ground and the hard
black shadow are both light-only decisions.

⚠ **One rung collapsed on the first render of the specimen sheet** (`Note` and `PublishedEvidence`
drawn with the same ground and rule) and was caught by looking at the picture rather than the markup:
the source was symmetric and reasonable, and the eye is what notices two rungs landing in the same
place. Separated, and recorded in the frame.

**Owed either way, independent of the ruling:** `blog-skin.css` is a written, namespaced, deliberate
exception to two brand non-negotiables and it is documented only in its own header. **It is not
referenced in `02_brand`**, so the next reader meets the rule without the exception.

#### The rule this adds

**Enumerate the LAYOUTS, not only the pages, and take the layout list from the framework's own
composition mechanism** (`layout.tsx`, `_app`, base templates), never from the route list. Each
distinct layout is at least one frame, and the number worth writing down is **layout to route-count**,
because that is what says how load-bearing a single frame is. Add the inverse check too: **for every
frame drawn, confirm the component it depicts exists**, since a route-based lifecycle check says
nothing about a drawn component that was never real.

---

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
