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
| Test selector | `/test-selector` | Brand | Quiz: start, in-question, recommendation. **3 states, not yet read from the code in detail.** |
| Kits index | `/kits` | Brand | |
| Kit page template | `/kits/[kit]` | Brand | 3 kits: testosterone, hormone-recovery, energy-recovery. One template. |

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

| Route | States | Verified |
|---|---|---|
| `/activate` | form, success, **not-found**, **wrong-account**, **already-activated** | ✅ the three error states are explicit branches at `app/activate/page.tsx:124`, `:145`, `:163` |

**5 frames.** The three error states are real screens a customer sees, not toasts.

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
| Subscriptions | `/subscriptions` | | |
| Account | `/account` | | |
| Founding member status | `/founding-member-status` | | |

**6 frames.** 🔴 **Membership is the screen that started this**: the build took the mockup's content
and structure and rendered them in the existing app system, which is the divergence in miniature.

---

## 3. The count

| Stage | Frames |
|---|---|
| Land | 4 (home already drawn) |
| Learn | 3 |
| Choose | 3 + 3 quiz states |
| Buy | 2 |
| Account | 5 |
| Activate | 5 |
| Results | 5 + 5 card variants |
| Act | 4 |
| Stay | 6 |
| **Total** | **≈ 45 frames** |

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

1. **The test-selector's quiz states are estimated, not read.** Three is a guess from the route's
   shape. Read `app/(marketing)/test-selector/page.tsx` properly before drawing it.
2. **`/subscriptions`, `/account` and `/founding-member-status` have no enumerated states yet.** They
   are small files and probably single-state, but "probably" is not an inventory.
3. **The blog is the hardest frame and the least specified.** It is the one surface with a documented
   licence to break the brand rules, and long-form reading is where a system either holds or fails.
   Decide whether the blog adopts F's language wholesale or keeps a scoped editorial variant.
4. **CA-045 arms when any of this reaches a live page**, and the F hero imagery is inside that gate.
