# QA: Canonical Pages

## Code-level audit — full 17-page pass, 2026-05-18

Audit method: code review against the Canonical Page QA Criteria below.
**Coverage: all 17 canonical pages now audited** (1 reference page `/kits/testosterone/` April 2026 + the remaining 16 on 2026-05-18). The earlier "10 pages" / "spot-check only" framing is retired — there were 16 unaudited pages, not 10, and all have now been read individually.

Live-interaction checks (forms actually submitting, Stripe redirect, accordion animation, responsive rendering) remain outstanding — see "Items Requiring Live Test" and are blocked on deploy + Stripe/Supabase/Vitall credentials.

---

## Canonical Page QA Criteria

- Header functions on desktop and mobile (Nav component, working drawer)
- Sticky / hero CTA anchors to the correct section or route
- No broken drawer/hamburger JS
- Footer intact
- Page is indexable (no `robots: noindex`) — except legal pages where appropriate
- Brand voice: no em dash (`—` / `&mdash;`) in user-visible copy
- Commerce wired: KitCheckoutButton / SubscribeButton present with correct `kitType` / `productSlug`
- Correct price displayed
- No prohibited/medicinal claims; Phase 0 wellness/clinical split respected
- Ashwagandha never mentioned anywhere (Guardrail #3)

---

## Shared Components (verified)

- **Nav** (`components/shared/Nav.tsx`) — applied globally via `app/(marketing)/layout.tsx` as `variant="marketing"`. Mobile drawer functional (toggle :112-148, drawer :153-177, closes on link click + on resize ≥768px). Logo → `/`. Links: Tests, Supplements, Founding Member, Blog. Sticky CTA "Choose your test" → `/kits`. PASS. Minor: Nav labels destination "Tests", Footer labels same destination "Diagnostics" — copy inconsistency, not a defect.
- **Footer** (`components/shared/Footer.tsx`) — global, intact, links resolve, no em dashes. PASS.
- **KitCheckoutButton** (`components/commerce/KitCheckoutButton.tsx`) — prop `kitType`; POSTs `/api/checkout/kit`. Used correctly on kit pages.
- **SubscribeButton** (`components/commerce/SubscribeButton.tsx`) — prop `productSlug`; POSTs `/api/checkout/subscription`. **NOT used by either supplement page** — see P1 issues.

---

## `/kits/testosterone/` — Reference review (April 2026)

PASS on all structural checks (nav, mobile drawer, sticky CTA, `id="order"`, KitCheckoutButton `kitType="testosterone"`, trust bar, FAQ, 5 biomarkers, GMC section, indexable). One FAIL: em dash in CTA button copy (`page.tsx:63,329` — "Order the Kit — £99", "See Kit 3 — £179"). Carried into Known Issues as P2.

---

## 16-page audit — 2026-05-18

Result legend: PASS / FAIL / WARN.

### `/kits/energy-recovery/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | via layout |
| Hero/sticky CTA → real route | PASS | KitCheckoutButton + `#order` :271 |
| KitCheckoutButton kitType="energy-recovery" | PASS | :124, :277 |
| Price £119 | PASS | :125, :278, schema :28 |
| Trust bar / FAQ / biomarkers | PASS | :130 / :256 / :202 |
| Em dash in visible copy | FAIL (P2) | :125, :278 "Order the Kit — £119"; :289 "See Kit 3 — £179" |
| Prohibited claims | PASS | — |

### `/kits/hormone-recovery/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Hero/sticky CTA | PASS | KitCheckoutButton :123; `#order` :691 |
| KitCheckoutButton kitType="hormone-recovery" | PASS | :123, :712 |
| Price £179 | PASS | :124, :713, schema :28 |
| Trust bar / FAQ / 9 biomarkers | PASS | 9 biomarkers :227-281; FAQ :652 |
| TRT framing | PASS | future-tense "when our clinical service launches" :684 |
| Em dash in visible copy | FAIL (P2) | :124, :713 `&mdash;` "Order the Kit — £179"; :62 FAQ "You could —" |

### `/supplements/daily-stack/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| SubscribeButton wired | **FAIL (P1)** | SubscribeButton NOT used. "Select Subscription" :351 / "Add to Cart" :372 are bare `<button>` with no handler; hero/CTA are `#order` anchors (:115, :409). Checkout not wired — product cannot be bought. |
| Medicinal claims | PASS | EFSA-style only :62,69,77 |
| Ashwagandha | PASS (Guardrail #3 clear) | absent; ingredients = Zinc, D3, Active B12 only |
| Price | PASS | £34.95/mo, £39.95 one-off |
| Em dash visible copy | PASS | em dashes only in metadata/JSON-LD |

### `/supplements/collagen/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| SubscribeButton wired | **FAIL (P1)** | SubscribeButton NOT used. Pricing section :327-375 is a static table with **no buy CTA at all**; "Subscribe" CTAs are `#pricing` scroll anchors (:115,408,411). Checkout not wired. |
| Medicinal claims | PASS | EFSA Vitamin C claim only :71; hs-CRP>10 → GP referral |
| Ashwagandha | PASS | absent |
| Collagen price £29.95 | PASS | £29.95/mo, £34.95 one-off — :116,337,352,409 (consistent on this page) |
| Em dash visible copy | PASS | metadata/JSON-LD only |

### `/kits/` (hub)
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Links to all 3 kit pages | PASS | :243 / :318 / :393 + table CTAs |
| No broken JS; prices £99/£119/£179 | PASS | |
| Em dash visible copy | PASS | JSON-LD only :25,31,37 |

### `/supplements/` (hub)
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Links to both supplement pages | PASS | :180 / :210 |
| Ashwagandha | PASS | absent |
| Prices £34.95 / £29.95 | PASS | :165, :195 |
| Em dash visible copy | PASS | metadata/JSON-LD only |

### `/test-selector/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Quiz renders / posts / logic | PASS | `TestSelectorQuiz` POSTs `/api/forms/test-selector` (:120); `getResult()` :53-65 — Kit 3 earned not default; GDPR consent unticked. (Rewired Session 30 — reflects current state.) |
| Em dash in visible copy | FAIL (P2) | `components/marketing/TestSelectorQuiz.tsx:249` success message |
| Prohibited claims | PASS | — |

### `/founding-member/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Form wired | PASS | `JoinForm` POSTs `/api/founding-member/join` |
| TRT NOT "available now" | **PASS** | all future-conditional: "Be first when our clinical TRT service launches" :52; "No clinical service is currently available" :60; "depends on a clinical assessment by our GP at launch... does not guarantee any particular outcome" :34 |
| Non-cash framing (no deposit) | **PASS** | "No payment is taken. You are not signing up for treatment, paying a deposit, or agreeing to anything" :18; JoinForm "No payment. No commitment." :126 |
| Em dash in visible copy | FAIL (P2) | :18, :55 `&mdash;`, :106; `JoinForm.tsx:56` |

### `/how-it-works/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| TRT framing | PASS | "once we're CQC registered" :367; "No payment, no commitment" :375 |
| Collagen price consistency | PASS (fixed 2026-05-18) | :374 was "£99.95/month" → corrected to £29.95/month |
| Kit 3 marker count | WARN (P2) | :334 "Seven markers" — contradicts "nine markers" on hormone-recovery (:115) |
| Em dash visible copy | PASS | JSON-LD only |

### `/faq/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Prohibited claims | PASS | ":396 "do not diagnose, treat, or cure" is a compliant disclaimer/negation |
| Collagen price | PASS | £29.95/month :411 (consistent) |
| Sticky jump-nav | PASS | `sticky top-20`, anchors valid :77-89 |
| Em dash visible copy | PASS | uses en dash `–` for ranges, no em dash |

### `/about/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Approved copy only | PASS (fixed 2026-05-18) | Keith founder quote approved (Keith, 2026-05-18) — `[DRAFT]` marker removed. Dr Ewa quote card **removed** pending her sign-off; her factual bio (no draft marker, descriptive credentialing) retained. Grid collapsed to single column. Type-checks clean. |
| Em dash in visible copy | PASS (fixed 2026-05-18) | both `[ DRAFT — NOT YET APPROVED ]` markers (the only em dashes on this page) removed by the above |
| Prohibited claims | PASS | — |

### `/contact/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Form present and wired | WARN (P2) | No `<form>`/endpoint — contact is `mailto:hello@andro-prime.com` only (:57,66,177). Confirm mailto-only is intended. |
| TRT framing / claims | PASS | GP-referral framing correct |
| Em dash visible copy | PASS | — |

### `/privacy/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | no robots block |
| Content present | PASS | renders `canonical-site/privacy/index.html` via `dangerouslySetInnerHTML` |
| Em dash / claims in body | UNKNOWN (WARN P3) | body injected from external HTML — not auditable from page file; audit `canonical-site/privacy/index.html` separately |

### `/terms/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | no robots block |
| Content present | PASS | renders `canonical-site/terms/index.html` via `dangerouslySetInnerHTML` |
| Em dash / claims in body | UNKNOWN (WARN P3) | same as privacy — audit `canonical-site/terms/index.html` separately |

### `/blog/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Newsletter form | WARN (P2) | `<form>` :124 has no `onSubmit`/`action` — submit does nothing |
| Double `<main>` | WARN (P3) | own `<main pt-32>` :55 nested inside layout `<main pt-20>` |
| Placeholder articles | WARN (P3) | 4 cards link `slug:'#'` :13-16; pagination :134-136 non-functional |
| Em dash visible copy | PASS | — |

### `/waitlist/`
| Check | Result | Notes |
|-------|--------|-------|
| Nav / footer / indexable | PASS | |
| Form present and wired | PASS | `WaitlistForm` POSTs `/api/forms/waitlist`; GDPR consent unticked default. (Rewired Session 30.) |
| Em dash in visible copy | FAIL (P2) | `components/marketing/WaitlistForm.tsx:47` success message |
| Prohibited claims | PASS | — |

---

## Known Issues (aggregated, prioritised)

| Priority | Issue | File:line | Action |
|----------|-------|-----------|--------|
| ~~P1~~ **RESOLVED 2026-05-18** | Daily Stack checkout not wired | `supplements/daily-stack/page.tsx` | FIXED: `<SubscribeButton productSlug="daily-stack">` wired in pricing card; one-off column + one-off hero/CTA links removed; subscription-only. Type-checks clean. |
| ~~P1~~ **RESOLVED 2026-05-18** | Collagen had no buy CTA at all | `supplements/collagen/page.tsx` | FIXED: comparison table replaced with subscription card + `<SubscribeButton productSlug="collagen">`; one-off hero/CTA links removed; subscription-only. Type-checks clean. |
| ~~P1~~ **RESOLVED 2026-05-18** | Collagen priced "£99.95/month" | `how-it-works/page.tsx:374` | FIXED → £29.95/month (now consistent with collagen page + hub + faq) |
| ~~P1 (compliance)~~ **RESOLVED 2026-05-18** | Unapproved Dr Ewa + founder quotes live with `[ DRAFT — NOT YET APPROVED ]` | `about/page.tsx` | FIXED: Keith quote approved (Keith) → marker removed; Dr Ewa quote card removed pending her sign-off; bio retained. Type-checks clean. |
| ~~P2~~ **RESOLVED 2026-05-18** | Kit 3 "Seven markers" vs "nine markers" elsewhere | `how-it-works/page.tsx:334` | FIXED → "Nine markers." (consistent with hormone-recovery + canonical Kit 3 = 9). NOTE: the marker bullet list on that card is abbreviated (bundles Total T/SHBG/Free T, omits FAI + Albumin) — cosmetic, logged for a later content pass, not changed here to avoid unreviewed copy expansion. |
| ~~P2~~ **RESOLVED 2026-05-18 (intended)** | Contact page is mailto-only, no wired form | `contact/page.tsx:57,66,177` | CONFIRMED INTENDED (Keith, 2026-05-18). Email-only is a deliberate brand stance — the page thesis is "No chatbot. No ticket system. Just an inbox." No code change. **Dead code note:** `app/api/forms/contact/route.ts` is built but unwired (logs `contact_form` to `lifecycle_events`); keep for a possible future form or remove in a cleanup pass — not launch-blocking. |
| ~~P2~~ **RESOLVED 2026-05-18 (end-to-end)** | Blog newsletter `<form>` has no handler | `blog/page.tsx:124-127` | FIXED + WIRED: dead static form replaced with `<NewsletterForm />` (new `components/marketing/NewsletterForm.tsx`) POSTing to new `app/api/forms/newsletter/route.ts`. Route upserts `marketing_consent:true`, calls `identifyUser` (email + `newsletter_subscriber:true` + `newsletter_signup_source:'blog'`, so the CIO profile is emailable + segmentable) then emits `newsletter_signup`. Explicit unticked GDPR consent + /privacy link. Type-checks clean. **CIO side built (Keith chose segment + draft welcome):** DRAFT campaign 20 "seq-07 — Newsletter Welcome" (trigger `newsletter_signup`, single immediate email, no stop-goal) + segment 23 "Newsletter Subscribers" (`newsletter_subscriber=true`, audience for the future editorial broadcast). Copy `seq-07-newsletter-welcome.md` pre-flighted clean. **Remaining:** Keith voice/business sign-off + human go/no-go before activation; editorial broadcast content not yet written. |
| ~~P2~~ **RESOLVED 2026-05-18** | Em dash in visible copy (CTA buttons) | `kits/testosterone/page.tsx`; `kits/energy-recovery/page.tsx`; `kits/hormone-recovery/page.tsx` | FIXED: all "Order the Kit — £NN" / "See Kit 3 — £179" CTAs → colon (`Order the Kit: £99`). hormone-recovery `&mdash;`+`&pound;` variant handled. Audit line refs were stale (drifted); fixed by content match. The `:62`/`:43` FAQ em dashes are **JSON-LD only** (visible FAQ at hormone-recovery:680 already reads "You could.") — reclassified P3 (meta), not visible P2. |
| ~~P2~~ **RESOLVED 2026-05-18** | Em dash in visible copy | `founding-member/page.tsx:18,55,106`; `components/founding-member/JoinForm.tsx`; `components/marketing/TestSelectorQuiz.tsx`; `components/marketing/WaitlistForm.tsx` | FIXED: em dash → full stop in all visible/success copy. Founding-member non-cash framing meaning preserved exactly (pure re-punctuation, no claim change). Remaining em dashes in these files are code comments + `founding-member:8` metadata description (= P3 systemic, intentionally left). |
| P3 | Double nested `<main>` | `blog/page.tsx:55` | Inner `<main>` → `<div>` |
| P3 | Blog placeholder articles link `#`; pagination dead | `blog/page.tsx:13-16,134-136` | Acceptable pre-launch; track |
| P3 | Privacy/Terms body copy injected from `canonical-site` HTML — not auditable from page file | `privacy/page.tsx`, `terms/page.tsx` | Audit `canonical-site/privacy|terms/index.html` separately |
| P3 (systemic) | Em dash pervasive in `metadata`/JSON-LD strings (titles, OG, schema) — surfaces in search/social snippets, not body copy | most pages | Decide whether brand voice rule extends to meta; sweep if so |

---

## P1 Watch-Item Verdicts (the two originally flagged)

- **Collagen displayed price** — PASS on the collagen page itself (£29.95/mo, £34.95 one-off, consistent), and on the supplements hub + FAQ. BUT `how-it-works/page.tsx:374` contradicts with "£99.95/month" (logged P1).
- **Founding-member TRT/deposit language** — PASS. No "available now"/imminent TRT; all future-conditional. Explicit non-cash framing ("No payment is taken... paying a deposit... or agreeing to anything"). No deposit/cash language anywhere.
- **Ashwagandha (Guardrail #3)** — PASS. Zero occurrences of "ashwagandha"/"KSM-66" across all pages and components.

---

## One-off purchase — decision + remediation log (2026-05-18)

- **Decision (Keith, 2026-05-18):** Phase 0 supplements ship **subscription-only**. One-off was specced in product docs but never built at any layer (no Stripe one-off price ID, no `mode:'payment'` route). Rationale: subscription tenure is the dominant Phase 0 economic lever; a one-off cannibalises it.
- **Reference implementation:** `app/lp/daily-stack/page.tsx` + `app/lp/collagen/page.tsx` were already correct (use `SubscribeButton`, subscription-only) — the canonical pages were brought into line with them.
- **Code fixed:** `app/(marketing)/supplements/daily-stack/page.tsx` + `…/collagen/page.tsx` — `SubscribeButton` wired, one-off buttons/columns/price lines removed, hero + bottom CTAs subscription-only. `npx tsc --noEmit` clean.
- **Docs annotated:** `04_products/supplements/daily-stack.md`, `…/joint-recovery-collagen.md`, `04_products/catalogue/product-catalogue-v7-1.md` — one-off marked deferred. **Still stale (lower priority):** `04_products/catalogue/non-regulated-tier-v7.md:116,135` (older catalogue version) — update or supersede when catalogue versions are reconciled.
- **Legacy mirror — NOT a served route, flagged not fixed:** `canonical-site/supplements/daily-stack/index.html` + `…/collagen/index.html` still contain the old two-column one-off layout. `canonical-site/` is **not routed** (no `next.config.ts` rewrite; only `privacy`/`terms` `page.tsx` inject canonical-site HTML). These two supplement HTML files are a stale design mirror — recommend **delete or reconcile** them when the canonical-site mirror is next cleaned up, to prevent a future contributor reviving subscription-inconsistent markup. Not launch-blocking (users never hit them).

## Items Requiring Live Test (still outstanding)

- Header scroll behaviour; mobile drawer open/close animation
- KitCheckoutButton / SubscribeButton loading state + Stripe redirect (once supplement buttons wired)
- FAQ accordion expand/collapse
- Test selector quiz flow + recommendation logic end-to-end
- Contact / waitlist / blog-newsletter forms actually submit
- All internal hrefs resolve
- ~~Render at 375 / 768 / 1280 px~~ — **PARTIAL (2026-05-23):** Live browser capture done at 375 / 390 / 768 / 1280 against production for all 18 canonical + 6 LP routes. Full findings in [mobile-qa-2026-05-23.md](./mobile-qa-2026-05-23.md). Summary: 1280 clean; 768 has 3 sub-pixel overflows; 12 routes overflow at 375. Root causes are 4 fixable families (LP hero h1s missed by c84c619, 3 comparison tables, terms page sticky sidebars, two supplement-tile inline issues). Re-run required after fixes ship.

**Blocked by:** Supabase auth, Stripe Price IDs, Coolify deployment.
