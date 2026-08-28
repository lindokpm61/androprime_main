# Website / App: Current State

Volatile, dated status: what is live / verified / owed **right now**. Durable architecture and access mechanics are in `CONTEXT.md`; this file is the moving layer. Update the date whenever a line changes.

_Last updated: 2026-08-27 (**KEITH PICKED D, then F.** F carries a film of the kitchen table on the morning the post arrived, with an illegible letter rather than the kit; his words on it are "this is the one that we will go with". Still open below: 🔴 **THE MEMBERSHIP UI AS BUILT DOES NOT MATCH THE MOCKUP, AND KEITH HAS CALLED A REDESIGN.** Diagnosis accepted: the build took the mockup's CONTENT and STRUCTURE but rendered them in the EXISTING app design system, a choice written into the top of `styles/pages/membership.css` ("same visual grammar as subscriptions.css and the results dashboard"). The two languages are systematically different: the mockup uses 1px hairline rules, a single 400px framed device with blocks divided by inner rules, JetBrains Mono tabular numerals, Inter body copy at 0.85rem, a full light/dark token set and optimal/warning washes; the build uses 4px slab borders, separate bordered cards, sans-black numerals, serif body copy and fixed black-on-white with no dark mode. **NOTHING IS TO BE BUILT until the approach is agreed** (Keith, 2026-08-26). The sequence he set: the mockup must first carry the FULL JOURNEY, every screen the user sees mapped inside it, and only then does the app get rebuilt against it. ✅ **THE FORK THAT GATED EVERYTHING ELSE IS ANSWERED (Keith, 2026-08-27): APP-WIDE.** The question was whether this is a membership-only redesign or an APP-WIDE design system change. It matters because mockup screens 1, 5 and 6 (the two-range card, the marker list, the trend) ARE the results dashboard rather than membership screens, so the mockup already assumes the whole authenticated app looks like this; and because a membership-only redesign leaves a member moving between `/results-dashboard` and `/membership` seeing two different products. **Scope, so it is not underestimated**: already drawn are the six membership screens, the two-range card (`design/mockups/2026-08-21-where-the-range-sits.html`) and the range placement study. NOT drawn are signup and passwordless login, the consent screen, checkout details, order confirmed, the pre-results tracker in its four order states, sample-failed, the results dashboard in a normal result, GP-referral routing, account, subscriptions and billing, cancellation, the retest arriving, and the failure states the mockup itself lists as omissions. Roughly 15 to 20 screens beyond what exists, several with multiple states. Proposed approach, NOT yet agreed: settle the scope fork; inventory every reachable screen and state from the live routes rather than from memory; draw the journey as a flow with no visual design so the sequence is agreed first; extend the mockup one journey stage at a time; rebuild starting from design tokens rather than page by page. Earlier: 🟢 **THE MEMBERSHIP NOW HAS A 30-DAY OFFER WINDOW, AND KITS ARE NEVER DISCOUNTED.** Decision: `01_strategy/2026-08-26-membership-offer-window.md`. **Both models run**: kits sold one-off at full retail, membership as a recurring layer on top. A membership may be JOINED only while a lab result has come back within the last 30 days; miss it and the way back in is another kit at full retail, which opens a new 30 days; nothing carries over on rejoining. **One rule covers four cases** (new customer, decliner returning, cancelled member rejoining, what carries over) which is why it is one predicate, `lib/membership/offer.ts`, and not four. It gates JOINING, never STAYING: an existing member's window is irrelevant until he cancels. **Enforced server-side** in `app/api/checkout/subscription/route.ts` (409 `offer-window-closed`), because the paywall hiding itself is not a gate; proved live, 409 with a 68-day-old result and straight through to the price lookup with a 7-day-old one. **Kits carry NO member discount for anyone**: the member coupon is off the kit checkout, the benefit is off the paywall's includes list, and `lib/membership/memberPricing.ts` is kept but DARK and re-aimed at supplements, which is what the adopted thesis actually says. It stays dark until supplements are listed in the shop, because a paywall must not sell a benefit with no delivery path. **The 'Before your first result' paywall is DELETED**: membership can no longer be bought standalone. Three top-level states now, not four: member / inside the window / outside it. The outside-it screen is a door, not a refusal, and it says so. **204 assertions (was 178), proved to fail**: sabotaging the window boundary and its anchor produced 13 failures and exit 1, including the named anti-abuse case. Typecheck, typecheck:scripts, full `npm test` and the production build all green. Earlier: 🔴 **THE COOLIFY FLAG SET HAS DRIFTED FROM `deployment/env/vars.md`, AND IT WAS FOUND THE HARD WAY.** `MEMBERSHIP_ENABLED` is **`true` in Coolify**, not off, which every doc and every commit message on this feature has assumed. So the membership UI push (`b93e832`) did not land dark: it made a £47/month paywall visible to any signed-in user, and a POST to `/api/checkout/subscription` with `productSlug: membership` returned a real **`cs_live_`** Stripe session — before the compliance read on the framing, with no membership terms, and against a price recorded as unverified. `ACCOUNT_ADDRESS_ENABLED` is **also on** and also documented `🚫 OFF` (the "Delivery address" section renders on the live `/account`), so this is a SET that has drifted, not one variable. `ACCOUNT_DATA_CONTROLS_ENABLED` appears correctly off. Keith is flipping `MEMBERSHIP_ENABLED` off in Coolify (2026-08-26) and auditing the rest against `vars.md`; **re-verify after the restart** — the check that discriminates is `/membership` for an AUTHENTICATED user, 404 when off and 200 when on, because an unauthenticated request 307s to login either way and tells you nothing. **The lesson is that a dark launch is only as dark as the deployed environment**, and nothing in this repo was checking the deployed value against the documented one: the flag convention in `lib/flags.ts` is careful and correct, and it was verified locally, which proved nothing about production. A post-deploy assertion on the live host belongs in `/wrap`. Earlier: 🟢 **MEMBERSHIP V1 IS FEATURE-COMPLETE: THE UI IS BUILT, BEHIND `MEMBERSHIP_ENABLED` (STILL OFF).** `app/(app)/membership/` is ONE route with FOUR states, not two. The paywall branch was going to print "nothing is wrong today" to a man with LOW TESTOSTERONE, because it branched on "is there a marker to log against" and folded the all-clear member together with a flagged member who has no daily behaviour to log. Caught by rendering the page against a real account rather than a fixture. "Is anything flagged" is now a SEPARATE question, and it is derived from the SAME map that badges his result card: that map moved out of `components/results-engine/StatusBadge.tsx` into `lib/results/resultSeverity.ts`, verbatim and with no copy changes, so the two surfaces cannot disagree about whether a man has a problem. **The check-in loop is marker-linked and REFUSES to cover every marker.** Vitamin D, active B12 and ferritin get a three-tap loop; testosterone and hs-CRP deliberately get NONE, because neither has an honest daily behaviour we can ask about and asking for data the app cannot act on is how a logging habit dies. **New migration `20260826_checkin_one_per_day.sql`, APPLIED and PROVED** (positive control, refusal, second positive control on the next UTC day, cleaned to zero): the table's original `unique (order_id, question_key)` stops constraining the instant order_id is NULL, so without it a double-tap inflates a member's streak. The day key is UTC in both the index and `lib/membership/checkin.ts:dayKey()`, and they must stay in step. **Member pricing resolves the DISPLAYED discount from the Stripe coupon itself**, never a hardcoded "25% off"; where a campaign code and the member price collide, `betterCoupon` gives the larger of two percentages and otherwise honours the code the customer explicitly supplied. **`scripts/test-membership.ts` is now 178 assertions (was 64) and proved to fail**: sabotaging the streak grace rule, the severity order, the adherence cap and the coupon comparison produced 7 failures and exit 1. **Flag-off proved live, not argued**: with `MEMBERSHIP_ENABLED` unset, `/membership` 404s for an authenticated user, `/api/membership/checkin` 404s, the app nav renders exactly Results / Subscriptions / Account with zero occurrences of the string "Membership", and `/api/webhooks/*` still returns 405 rather than a redirect. **The check-in write path was exercised end to end** against a real session: insert 201, update 200, unknown key 400, out-of-range 422, unauthenticated 401, and exactly one row per question per day after all of it. 🔴 **STILL NOT SWITCHABLE-ON, and the UI does not change that**: the compliance read on the membership framing is the hard gate, the membership terms are undrafted, and `STRIPE_PRICE_MEMBERSHIP` / `STRIPE_COUPON_MEMBER` are unverified. 🔴 **ASK THE CLINICIAN HAS NO DELIVERY MECHANISM.** The paywall sells it as an included benefit and the member screen renders its honest empty state; there is no table, no clinician workflow and no published answer. That is a LAUNCH dependency, not a UI gap. **Two named seams** carried forward for Ewa: the within-severity ordering in `MOVABLE_STATES` is a v1 default and not a clinical ranking, and the all-clear cadence split in `lib/membership/sync.ts` still errs in the member's favour. Earlier: 🟢 **MEMBERSHIP V1 BACKEND IS BUILT, APPLIED AND PUSHED, BEHIND `MEMBERSHIP_ENABLED` (OFF). THE UI IS THE ONLY PIECE LEFT.** Commits `f3f98e7` (schema), `47a48ba` (backend), `3a5f8b2` (cross-host fix). **Scope decision (Keith, 2026-08-26): v1 carries NO PHYSICAL SUPPLEMENTS** — the retest entitlement, dashboard and trend, the check-in loop and member pricing. That is what decouples it from a supply chain with no supplier contact yet, and it matches what Function and Superpower actually do (member PRICING, not inclusion). 🟢 **THE 'ONE LARGE ITEM' TURNED OUT TO BE MOSTLY SMALL, because two existing systems are already product-agnostic.** (1) A membership is **a new subscription SLUG**, not a new subsystem: the checkout route, `PRODUCT_MAP`, the billing portal and all FOUR Stripe lifecycle branches are slug-driven, so one slug plus one price buys checkout, renewal, dunning, cancellation and self-serve billing. (2) **`bundle_dispatches` + the `bundle-sweep` job ARE the retest mechanism** — that table was already “a kit owed to a user at a future date” with a daily sweep and an address-check email, so the sweep gained ONE pass rather than a second dispatch path. **Migration `20260826_membership_v1.sql`, APPLIED and PROVED.** `memberships` (a date plus an active check; no ledger, since the 2026-08-24 reframing made the retest an entitlement conditional on being active ON the date); `bundle_dispatches` generalised (`source`, `membership_id`, nullable `parent_order_id`); **`symptom_answers.order_id` made nullable**, which was a hard blocker — it was NOT NULL, so the between-tests check-in loop could not write a row at all. Dropping two NOT NULLs would have quietly permitted an orphaned bundle row and a shapeless symptom row, so the nullability moved into CHECK constraints keyed on the new discriminators rather than simply disappearing. **All five controls proved by attempting the write** (this repo has already shipped a CHECK that admitted the one row it forbade because `NULL or false` is NULL), **including a POSITIVE control**, without which the four refusals could equally have been an unrelated failure. Test rows cleaned up; all three tables back to zero. Types regenerated (additive but for six lines, the Row/Insert/Update variants of the two columns that became nullable). **`scripts/test-membership.ts`, 64 assertions, in `npm test`, and proved to fail.** Sabotaging the active check produced 4 failures and **exposed a defect in the suite itself**: the 36-assertion cross-product computed its expectation by calling the function under test, so it was tautological and moved with the bug. Expected set now written literally; the same sabotage produces 8. Two judgement calls are asserted rather than implied: **`past_due` COUNTS as an active member** (Stripe sets it while dunning runs and T-07 gives three emails to fix a card), `cancelled` and `unpaid` do not. Tests 3h/3i are the canaries: if a lapsed member whose date has passed is ever owed a retest, the credit ledger has returned. **Catalogue collapsed from THREE sources to one** (`PRODUCT_MAP`, the checkout route's private `SUB_PRICE_IDS`, and three dead `*_MO` constants in `lib/pricing.ts`, all naming products out of the range). Retired slugs kept but `purchasable: false`, because `productName` still feeds the account UI and four CIO payloads for anyone holding one. ⚠️ **DELIBERATE V1 SIMPLIFICATION, marked as a named seam in `lib/membership/sync.ts`: the all-clear cadence split is not yet exact.** Deciding “has this member a number to move” is a CLASSIFIER question, not a SQL one — `biomarker_values` stores only value and the lab reference range, and our action cutoff is deliberately STRICTER than the lab's (the whole point of the two-range card), so a SQL range check would wrongly mark someone all-clear. v1 errs in the MEMBER'S FAVOUR: anyone with a result gets the 90-day retest. Replace the function body with the classifier's verdict to make it exact; nothing else changes. 🔴 **THREE MORE CROSS-HOST LINKS FOUND, AND THE MISS IS THE LESSON.** The earlier audit reported “6 links in 3 files” but searched ONE DIRECTION ONLY (app routes on marketing pages) and never the mirror image. `account`, `results-dashboard` and `subscriptions` each linked to marketing routes; two were `next/link`, which cannot client-navigate across origins, so the app host could have rendered a marketing page under a noindex header. Found by accident while reading a file for its layout conventions, not by any check. Now plain `<a>` via `urlFor`. **A directional audit reports clean for the direction it was not pointed in.** ⚠️ **STRIPE: Keith created the product/price and set `STRIPE_PRICE_MEMBERSHIP` in Coolify, and it is NOT VERIFIED.** Cannot be verified from here: the local key is TEST mode, Coolify's is LIVE, and price ids do not resolve across modes, so any lookup would fail identically whether or not it was set up correctly. Owed at switch-on: confirm £47.00, GBP, recurring monthly, active, and that the id came from LIVE mode. Also confirm the four webhook events are enabled and that the Customer Portal permits cancelling this product (a member able to join but not leave is a consumer-rights problem, not a UX one). **Do NOT enable Stripe automatic tax**: under the £90k threshold no VAT is charged and £47 is the whole price. 🔴 **`MEMBERSHIP_ENABLED` IS OFF AND MUST STAY OFF until (a) the COMPLIANCE READ on the membership framing against the Phase 0 boundary and CA-026 — the hard launch gate, and the gap analysis is explicit it is a read before it is a pricing decision — and (b) the membership terms are drafted (cancellation, an unclaimed retest, results access after cancellation).** The value is the literal string `true`; it is NOT `NEXT_PUBLIC_`, so it is read live and needs no rebuild. The flag gates the SERVER path too: the checkout route refuses the slug when off, so a hidden paywall cannot be subscribed to by hand. **REMAINING: the UI** (paywall + member states from `design/mockups/membership-first-cycle.html`, the check-in loop, and the member-pricing coupon). Earlier the same day: **THE HOST MIGRATION IS COMPLETE. DEPLOY 2 IS LIVE (`d1c00cf`) AND THE 20 CUSTOMER.IO TEMPLATES WERE REPOINTED FIRST.** `andro-prime.com` now serves MARKETING ONLY; `app.andro-prime.com` serves the authenticated app. **Step 1, the templates, done BEFORE the flip so nothing depended on the 308s as a safety net.** Repointed by script (`scratchpad/cio_repoint.py`) against the App API (`https://api-eu.customer.io`, `CUSTOMERIO_APP_API_KEY`), **deliberately NOT by reading the bodies through the agent's context**: these are version-locked approved copy and retyping them risks a silent wording change. The only mutation was a regex over two exact URL shapes. **Verified by two INDEPENDENT code paths:** an action-side sweep over all 48 actions on all 23 campaigns reporting **0 remaining authenticated apex links**, and a template-side scan reporting **all 34 authenticated links on the app host, 0 on the apex, all 45 marketing links untouched and 0 wrongly moved**. Partial `PUT` semantics were proved on ONE action first: body grew by exactly 4 bytes (`app.`) and `subject`, `name`, `layout`, `preheader_text`, `from` and `sending_state` came back byte-identical. ⚠️ **The public App API has no `workflow_action_ids` field** (that is the internal shape the MCP proxies); assuming it scanned **zero** actions while reporting zero changes, which reads exactly like “nothing needed changing”. Caught only because the script prints the scanned count. Use `GET /v1/campaigns/{id}/actions`, which returns full action objects including `body`. **Step 2, Deploy 2: `CUTOVER_PHASE` 1 → 2.** Live matrix: apex `/account`, `/results-dashboard`, `/subscriptions`, `/auth/login`, `/order/confirmed`, `/supplement-waitlist-status` all **308** to the app host, and `/auth/callback?token_hash=...&type=email` **preserves the query**, which is what 308 rather than 301 was for. Apex marketing (`/`, `/kits`, `/blog`, `/authors/*`, `/supplements`, `/test-selector`) unchanged at 200. App host serves `/auth/login` and `/order/confirmed`, and 308s `/kits` and `/blog` home. **`/api/webhooks/stripe` returns 405 with no redirect on BOTH hosts.** A legacy apex `/account` link still resolves end-to-end. Apex homepage still `x-nextjs-prerender: 1` with a cache HIT; `x-robots-tag` still present on the app host and absent on the apex. ⚠️ **`protectedRoutes` in `middleware.ts` was deliberately NOT trimmed**, correcting the plan: those entries only LOOK dead: unreachable on the apex because `routeDecision` redirects first, but the app host still needs every one of them. 🔴 **Sentry lagged the deploy AGAIN and is now disproved three times as a canary:** at the moment the build id had already flipped and the behaviour had already changed, Sentry's newest release was still the PREVIOUS commit. The per-run RSC build id (`"b":"..."`) is the canary; this one went `zL3ScPGTwqsQbrX1icQZG` → `_jMn3i7owafDNQtdWQCkR`. Earlier: **HOST ROUTING IS LIVE. Deploy 1 is PUSHED AND VERIFIED IN PRODUCTION** (`c613c1d..4c66d77`). Deploy canary done properly this time: the per-run build id from the live RSC payload, captured pre-push as `lAgyCnqkAWIt0KFyMNZuC`, asserted stable across two reads, and read post-deploy as `HjTV5exWquCVS-OqYTk5o` after ~200s. **Live matrix all correct:** on `app.andro-prime.com`, `/` → 307 `/results-dashboard`, `/kits` `/blog` and `/authors/keith-antony` → 307 to the apex with the path preserved (**`/authors` is NOT swallowed by the `/auth` prefix**), `/results-dashboard` → 307 to the app-host login with `next` preserved, `/auth/login` and `/order/confirmed` serve 200. On the apex, `/` `/kits` `/blog` `/authors/*` are unchanged at 200, and `/account` → 307 to the APP-host login, which is phase 1 deliberately driving every session onto the app host. **`/api/webhooks/stripe` returns 405 with no redirect on BOTH hosts**, so Stripe/Vitall/QStash are untouched. The Cloudflare noindex rule is still present on the app host and still absent on the apex. **The apex homepage is still `x-nextjs-prerender: 1` with `x-nextjs-cache: HIT`**, so the dynamic-rendering regression did not ship. No Cloudflare purge was needed: the app host returned `cf-cache-status: DYNAMIC` throughout rather than a stale cached 200. 🟢 **VERIFIED 2026-08-26: the Supabase redirect allowlist is correct and END-TO-END SIGN-IN WORKS ON THE APP HOST.** Keith ran a real magic-link round trip on `app.andro-prime.com/auth/login` and reported it good; corroborated independently in the database rather than taken on report, `auth.users` showing a successful `last_sign_in_at` 2.9 minutes old (1 of 3 users inside 30 minutes). `verifyOtp` cannot complete unless Supabase accepted the redirect to the app host, so the round trip IS the allowlist proof. **Phase 1 is therefore complete and fully verified.** For the record, the attempt to confirm the allowlist non-destructively beforehand was INVALID and would have reported a false pass: An attempt to confirm it non-destructively via `/auth/v1/authorize?redirect_to=...` was INVALID and would have reported a false pass: a control using a deliberately bogus host returned the identical 302 to Google, proving that endpoint does not validate `redirect_to` at authorize time. Supabase enforces the allowlist only on the way BACK, so **nothing short of a real magic-link round trip on `app.andro-prime.com/auth/login` proves it**. Until that is run, the risk is that sign-in is broken for all 3 users; blast radius is sign-in only and the fix is a dashboard edit, not a revert. Originally committed as `76b7e35`, Deploy 1 of the two-stage cutover to `app.andro-prime.com` (plan: `~/.claude/plans/lets-move-to-the-delightful-honey.md`). The app host serves the authenticated app; **the apex still serves it too**, so nothing can break and the first real session on a new cookie domain has a rollback point. `CUTOVER_PHASE` is 1; flipping it to 2 is Deploy 2. 🔴 **TWO PREREQUISITES ARE KEITH'S AND MUST LAND BEFORE THIS IS PUSHED.** (1) `NEXT_PUBLIC_APP_URL=https://app.andro-prime.com` in Coolify — `NEXT_PUBLIC_` is inlined at BUILD time, so it must exist before the build, not after (the code does fall back to the same literal, so this one is belt-and-braces). (2) **`https://app.andro-prime.com/**` added to Supabase Auth → URL Configuration → Redirect URLs.** This one genuinely blocks: the middleware auth gate now sends both hosts to the APP-host login, so `emailRedirectTo` resolves to the app host, and Supabase rejects a redirect target that is not on the allowlist. Push without it and sign-in breaks. **`lib/hosts.ts` is the single source of truth for the route→host mapping**; routing and link generation read the same prefix list so they cannot drift, and `routeDecision` is pure so the rule is testable at all (it otherwise exists only in production, behind a proxy, on two hostnames, mid-cutover). `scripts/test-host-routing.ts`, 96 cases, wired into `npm test`, and **proved to fail**: sabotaging the prefix matcher to a bare `startsWith` produced exactly the three `/authors` and `/accounts-payable` failures it exists to catch, with exit 1. 🔴 **THE BLOCKER IT FIXES:** `getPublicBaseUrl` in `app/auth/callback` checked `NEXT_PUBLIC_SITE_URL` BEFORE the request host, and that is set to the apex in production, so the function was request-aware in name only — **its own comment asserted the opposite behaviour**. Harmless on one host; on two it is a login bug wearing a cookie bug's clothes (verifyOtp sets the host-only cookie on the app host, the redirect lands on the apex, the cookie is not sent, the user is logged out). 🔴 **SCOPE CORRECTION FOUND MID-BUILD: `/order/confirmed` and `/subscription/confirmed` are AUTHENTICATED pages and move too.** They sit in the `(marketing)` group but each calls `getCurrentUser()`, and the order reference is read through the **USER-scoped** Supabase client, so RLS needs the session. Left on the apex they would render permanently logged-out and the buyer would never see their order reference again, **silently reverting the 2026-08-04 fix on the highest-value page in the purchase flow**. Moving them also collapsed 4 of the 6 known cross-host links to same-host. ⚠️ **A REGRESSION I INTRODUCED AND CAUGHT ONLY BY DIFFING THE BUILD'S ROUTE TABLE:** reading `headers()` in the `(marketing)` layout to make the nav host-aware opts the **entire marketing tree** into dynamic rendering and loses the static prerender the site depends on. Typecheck, 96 unit tests, the full `npm test` chain and the rendered output were ALL green. Reverted; the marketing and LP layouts are now explicitly not host-aware, with the reason in the file. **Accepted degradation:** the two confirmation pages take one 307 back to the apex on a marketing nav click. **Rule for next time: a call added to a LAYOUT is verified by a build and its route table, never by a typecheck and a unit run.** `Nav` gained a `HostLink` that emits a plain `<a>` across hosts and a `next/link` within one, because **`next/link` cannot client-navigate across origins** and would otherwise client-render the app page on the marketing host, bypassing middleware. **`/api` is dual-served and never redirected** (Stripe, Vitall and QStash webhooks are registered against the apex). **Verified on a local production build driven with real `Host` headers:** app-host root, marketing and `/authors` all redirect correctly and **`/authors` is NOT swallowed by the `/auth` prefix**; the auth gate sends both hosts to the app-host login with `next` preserved; `/api/webhooks/stripe` returns 405 rather than a redirect on both hosts; the apex homepage is still prerendered static (`initialRevalidate: false`); and the rendered apex nav emits an absolute cross-host `<a>` for Log in while `/kits` stays relative. **Still owed after the push:** the 20 Customer.io template edits and Deploy 2. Earlier, 2026-08-25: **THE SIX UNPUSHED COMMITS ARE PUSHED AND DEPLOYED, AND THE CUSTOMER.IO LINK AUDIT IS DONE — IT WAS POINTED AT THE WRONG ROUTE.** **Three decisions taken by Keith, 2026-08-25:** (a) push all six; (b) **`/results-dashboard` MOVES to `app.andro-prime.com`, and now** — auth moves with it, which settles the cookie question, so **no wildcard `.andro-prime.com` cookie is needed and none should be set**; (c) the crawlable-duplicate exposure is closed by a **Cloudflare rule now** (Keith's action, see below), with the middleware host routing landing later as foundation item 1 rather than as an emergency fix. **PUSHED: `7143ff7..c613c1d`, and it was SIX commits, not the four the handoff said** — `0ad09a5` (Nutribl welcome pack) and `b2c74b4` (Laura's sleeve answers) sit BELOW `f8719da`, both docs-only. Worth recording because the handoff's suggested `git reset --hard f8719da` would have dropped THREE commits including `c613c1d`, the STATE commit recording the subdomain decision. Not done; nothing was rewritten. **DEPLOY VERIFIED:** Sentry's newest release is now `c613c1d2df82213a4824127dc49d4e951bf4a225`, and apex `/`, `/kits`, `/blog` and `/auth/login` all return 200. ⚠️ **But Sentry is NOT a sound primary deploy canary here, and this file previously implied it was.** Before the push, Sentry already carried releases for `07c5b7f` and `f8719da`, both of which were unpushed: a local production build with `SENTRY_AUTH_TOKEN` in the environment creates the release itself, so the signal fires on “someone built this”, not “the server deployed this”. It was usable this once only because `c613c1d` happened to be the one commit with no local build. **The primary canary stays the per-run build id served by the live host**; treat Sentry as corroboration and never as proof. 🔴 **THE CUSTOMER.IO AUDIT INVERTS THE ASSUMPTION THIS FILE HAS CARRIED. `/results-dashboard` appears in ZERO templates. TWENTY templates hardcode an absolute apex URL to a DIFFERENT authenticated route: nineteen `https://andro-prime.com/account`, and one `https://andro-prime.com/auth/login`.** So the pre-move task is real and roughly the size predicted, but it was aimed at the wrong route: work scoped from the old note would have audited the dashboard, found nothing, and read the templates as clean while twenty live templates still pointed at the old hostname. Enumerated template ids — **`/account`:** 7, 19, 22, 23, 28, 29, 35, 36, 37, 38, 39, 40, 42, 44, 45, 47, 48, 49, 55; **`/auth/login`:** 46 (T-09 Guest Purchase Account Created). Spread across the results sequences, subscriber onboarding, churn prevention, the dunning chain and the T-0x transactionals. Every OTHER absolute URL in the templates is marketing (`/kits/*`, `/test-selector`, `/supplement-waitlist`, `/`) and correctly stays on the apex. **So the move owes: 20 template edits plus 301s for `/account` and `/auth/login`, and nothing at all for `/results-dashboard`.** **Method note, because the obvious route does not work:** `GET /v1/environments/219186/templates` returns only ONE template and is not a listing of campaign content; the working call is **`POST /v1/environments/219186/templates/by_id`** with an `ids` array, which is a batch READ despite the verb. Universal search (`/search`) is fuzzy, not literal, so it cannot answer “does this exact string appear”. 🟢 **DONE AND VERIFIED 2026-08-25 — the Cloudflare rule is LIVE and correctly scoped.** Keith created it; verified by request. `X-Robots-Tag: noindex, nofollow` is PRESENT on `app.andro-prime.com` at `/`, `/kits`, `/blog`, `/auth/login`, `/kits/testosterone` and `/results-dashboard`, including on an edge-cached `x-nextjs-cache: HIT`, and ABSENT on the apex at `/`, `/kits`, `/blog`, `/kits/testosterone`, `/supplements`, `/about` and `/faq`, and on `www` (which 301s to the apex). 🔴 **It took two attempts, and the first failure is worth recording because it reported itself as healthy.** The rule was created as a **Request** Header Transform Rule, which can never affect a response, AND with the expression pasted into the visual builder's free-text Value box, so it saved as `URI Full | wildcard | r#"http.host eq "app.andro-prime.com""#` — a condition testing whether the URI wildcard-matches that literal sentence, which no request can ever satisfy. It displayed **Active** in green while matching zero requests. **The lesson for every future scoped rule: a rule that matches NOTHING is observationally identical to a correctly-scoped rule if you only verify that the blast radius is clean.** The apex-is-unaffected check passed perfectly, for the wrong reason. Assert both halves: header present on the target, absent everywhere else. **The working form is the builder, not the expression editor** — `Field: Hostname`, `Operator: equals`, `Value: app.andro-prime.com`; a raw `http.host eq "..."` expression is only valid inside the Expression Editor, which is not what the form opens in. **This rule is PERMANENT, not a stopgap.** `app.andro-prime.com` will serve an authenticated app that should never be indexed, so it stays in place after the middleware host routing lands, which is a further reason it beat a redirect: nothing has to be unpicked later. It does not stop crawlers FETCHING the app host, since `robots.txt` there still says `Allow: /`; that is intended, because they must fetch to see the header. Original recommendation, for the record: recommended shape is a **Transform Rule → Modify Response Header** adding `X-Robots-Tag: noindex, nofollow` when `http.host eq "app.andro-prime.com"`. Deliberately NOT a redirect: a redirect on that hostname would have to be unpicked the moment the middleware starts serving the app there, whereas the header is surgical, leaves humans unaffected, and composes correctly with the existing `robots.txt` (which says `Allow: /`, so crawlers still fetch the page and therefore still see the header). Remember the homepage is `s-maxage=31536000` and now edge-cached under the new hostname, so **purge Cloudflare for `app.andro-prime.com`** the first time it serves something different. Earlier the same day: **`app.andro-prime.com` IS LIVE, AND THE WEB APP GETS ITS OWN HOSTNAME UNDER THE EXISTING NEXT.JS APP.** Keith set the DNS up in-session and it verified: resolves to Cloudflare (`172.67.204.152`, `104.21.93.51`), **proxied (orange cloud)**, valid certificate, `HTTP/2 200`, `x-powered-by: Next.js`, so Coolify is already routing the hostname to the same build. **Steps 1 to 4 of the subdomain setup are done; no second service, no second deploy.** **Architecture decided (Keith, 2026-08-25): ONE Next.js app under `09_website-app/frontend`, two hostnames, routed by the `Host` header in `middleware.ts`.** No monorepo split, no forked codebase; the earlier measurement stands (the `(app)` and `(marketing)` groups share only `lib/auth/session` and `lib/flags`, so the split does not get harder by waiting). The membership app becomes new routes inside the existing `(app)` group, which already holds the dashboard, account and subscriptions. ⚠️ **Right now the subdomain serves a byte-identical copy of the marketing site**, because middleware does not yet route by host. Largely defused by accident: `lib/site-url.ts` holds a single `SITE_URL` constant, so the canonical on `app.andro-prime.com` reads `https://andro-prime.com`, the sitemap `<loc>`s all point home, and `robots.txt` names the main-domain sitemap. **Two follow-ups: `robots.txt` on the app host still says `Allow: /`** (a Cloudflare redirect or WAF rule is the no-code fix until middleware lands), and **the marketing homepage is `cache-control: s-maxage=31536000` with `x-nextjs-cache: HIT`**, so it is now edge-cached under the new hostname too and will need a Cloudflare purge for `app.andro-prime.com` the first time that host serves something different. **FOUR FOUNDATION ITEMS before any membership screen is built**, in dependency order: (1) the hostname rewrite in `middleware.ts`; (2) **`/auth/*` moves to the subdomain** so only one host ever handles a session; (3) host-aware config, a second `SITE_URL` and a `noindex` robots for the app host; (4) the membership/entitlement schema, which the gap analysis rates the one Large item and which is now just a date plus an active-membership check since the credit ledger was struck. 🟢 **DECIDED 2026-08-25, see the lead above — the auth flow MOVES to the subdomain and no wildcard cookie is set. Retained for the reasoning: the auth cookie.** `lib/supabase/middleware.ts` sets cookies with **no explicit `domain`**, so they are host-only and a session created on `andro-prime.com` will not be sent to `app.andro-prime.com`. Two routes: set the cookie domain to `.andro-prime.com`, or move the whole auth flow onto the subdomain. **Recommendation: move the auth flow.** A wildcard cookie is readable by every present and future subdomain, and this cookie gates special-category health data. 🟢 **DECIDED 2026-08-25 — YES, AND NOW (see the lead above): does the existing `/results-dashboard` move to the subdomain too?** Recommendation yes, and now, because the dashboard IS the app under the adopted decision and splitting the authenticated experience across two hostnames costs both and buys neither. Moving now costs 3 users and 1 real result; moving later costs live sessions and every results link in Customer.io. **Check first: CIO email templates are not visible from the repo and may hardcode `andro-prime.com/results-dashboard`; those need updating plus 301s.** Every in-repo reference is a relative path, so the code side is cheap. 🟢 **SUPERSEDED 2026-08-26: the pause held for new website work, but the two accessibility commits that were parked pending a decision (`e7e66db`, `07c5b7f`) were NOT reset and are now pushed and live.** The focus indicators, the `<select>` colour, the kit-tab semantics and the `aria-live` regions are in production; the evidence disclosure is live as code but dark behind `EVIDENCE_DISCLOSURE_ENABLED` (OFF), so no visible change from that one. `wip/results-a11y-2026-08-25` still exists and is now redundant. Original entry: 🛑 **ALTERATIONS TO THE LIVE WEBSITE ARE PAUSED (Keith, 2026-08-25)** until the web app is in place; the website is revisited after. Earlier the same day: **VERCEL'S `web-design-guidelines` SKILL IS INSTALLED AND HAS BEEN RUN ON THE RESULTS ENGINE; FOCUS AND ANNOUNCEMENT DEFECTS FIXED.** Installed to `.agents/skills/web-design-guidelines` (symlinked into `.claude/skills/`, `skills-lock.json` updated); it is a thin wrapper that fetches 103 rules from `vercel-labs/web-interface-guidelines/command.md` at run time. Chosen over the taste-skill family because it carries **no aesthetic opinions** and so cannot fight the brand system; taste-skill's rubric was read and would have told us to drop Inter, abandon pure black, vary the border radius, add texture and put stock imagery behind a blood result, all of which the 02_brand table forbids. 🔴 **The finding that mattered: `dashboard-panels.css` held the ONLY `:focus` rule in the entire styles tree, and what it did was `outline-none` with a white-to-#f9fafb background swap as the replacement**, which is not a perceptible indicator. Fixed: `.kit-tab` and `.result-history-select` now take `outline: 2px solid currentColor`, inset on the tabs so it stays visible against both the white inactive and black active states. **Verified by keyboard-driven screenshot in all three states**, via a temporary page since the `(app)` layout guards itself with `requireAuthenticatedUser()` independently of `middleware.ts` (that page has been deleted). Also fixed: `<select>` given an explicit `color` (appearance-none inherits the OS palette under Windows dark mode); kit tabs given `type="button"`, full `tablist`/`tab`/`aria-selected` semantics, roving tabindex and arrow-key navigation; both nurture-consent components given `role="status" aria-live="polite"` on their error and success states, **`aria-live` having appeared 0 times anywhere in the app**; the traffic-light track marked `aria-hidden` because the value, unit, range and StatusBadge verdict are all already adjacent text, so labelling it would double-announce. tsc clean, full suite green. ⚠️ **NOT fixed, needs the approval route: two em dashes in live customer-facing copy** — `OPTIONAL — STAY INFORMED` at `LowTNurtureConsent.tsx:46` and `BorderlineNurtureConsent.tsx:49`. Both files carry version-locked approved copy (CA-014, Ewa + Keith, 2026-06-04), so the label was left alone rather than edited in place. ⚠️ **Still open and now found twice:** the range bar conveys its zones by colour alone, logged by the Rams audit on 2026-08-22 at 1.28:1 amber-vs-green and found independently by the Vercel pass in a different component. Passes worth recording: `prefers-reduced-motion` covers all three animations, no `transition: all` anywhere, a skip-to-content link exists, and the `(app)` layout double-guards auth. Earlier the same day: **THE MEMBERSHIP MOCKUP IS RE-CUT TO THE ADOPTED DECISION, AND THE PUBLISHED ARTIFACT IS VERIFIED BYTE-IDENTICAL TO THE REPO SOURCE.** Reworked inside the 2026-08-25 decision sweep (commit `803cb4c`) and republished; the served artifact diffed against `design/mockups/membership-first-cycle.html` returns IDENTICAL at 60,193 characters, so the two are in step and neither needs re-doing. **Six screens now, not five**, and eight changes from v1, carried in the mockup's own changelog block: GBP 49 becomes **GBP 47**, VAT-inclusive-ready; **the GBP 99 credit is gone**, replaced by an entitlement conditional on being an active member on the stated retest date, which deletes the ledger and the expiry term; **cadence split** (day 90 is a first-cycle onboarding retest for a member with a number to move, annual thereafter, and annual from the start for the all-clear member); **a new two-range card is now the opening screen**, drawing the lab reference interval and our clinical action cutoff on one axis with the citation; **the all-clear member gains his own screen set**, deliberately not sized because the 93% non-referral figure does not transfer to a nine-marker panel and the real share is unmeasurable until about thirty results; **the check-in row is marker-linked at three taps** (sleep and steps dropped, they do not move vitamin D, and asking for data the app cannot act on is how a logging habit dies); and **Ask the clinician** appears in the published-answer form only. 🔴 **ONE FACTUAL ERROR FOUND AND FIXED ON REVIEW (2026-08-25): the paywall screen read "Price includes VAT."** Below the GBP 90,000 threshold nothing is VAT-registered and no VAT is charged, so the line asserted a tax that is not being collected, and an unregistered business must not indicate that a price includes VAT. It also contradicted the same page's own annotation two blocks down ("below it the whole GBP 47 is kept") and its own banner ("VAT position unverified"). Line deleted rather than reworded, since "cancel any time" was already carried under the CTA; the wording waits on the accountant question. **TWO MORE FOUND IN THE SAME READ.** (2) **The day-90 vitamin D row was drawn amber at 58 nmol/L.** The live classifier (`lib/results/classifier.ts`) bands vitamin D critically low under 25, low under 50, and normal to the assay ceiling, so 58 is a normal result the engine would draw green. Amber on the one number the member spent sixty days moving says the intervention failed, on the screen whose whole job is to show it worked. Now green. (3) **The h1 said "seven screens" and there are six**, and the caveat bar still called GBP 47 illustrative when it is the adopted price (the VAT treatment is what is unverified). All three corrections are listed in the mockup's own changelog. Verified by screenshot in both themes at each change, and the artifact republished from the file. ⚠️ **Flagged, not changed:** on the day-90 screen the same testosterone 10.5 that is amber and "below the action cutoff" on day 14 is drawn with the neutral "stricter than your lab" marker. Defensible either way, so it is Keith's call, not a silent edit. ⚠️ **Unchanged and still true: nothing is built, and no copy on it is compliance-checked or clinically signed.** What is no longer true is "prices illustrative" — GBP 47 is the adopted price. Earlier, 2026-08-24: **MEMBERSHIP APP MOCKUP FILED IN THE REPO, five screens, concept only.** Source: `design/mockups/membership-first-cycle.html`, published as artifact `21e25b82-cedd-4241-8817-12bb33fec378` ("The First Cycle"), https://claude.ai/code/artifact/21e25b82-cedd-4241-8817-12bb33fec378 . **Republish that file to update the artifact; keep the two in step** — filed in the repo rather than left in a scratchpad for the same reason the placement study was. Screens: day 0-14 baseline (kit tracker, three-tap check-in, results prediction), day 14-30 plan (four markers with one finding, prediction reveal, adherence streak, behaviour chart), day 30 paywall (GBP 49/month selling the retest not the app, with an explicit "your results are yours either way" decline), day 31-90 member (retest booked with a ship date, and the two-point proof rail with an empty dated second dot), and a full-width two-panel screen showing nine markers merged across two kits with the GBP 99 retest credit choice. **FAI is drawn faithfully as reported-not-interpreted per CA-034 K1**, and the behaviour chart deliberately shows behaviour rising rather than implying blood moved. Built to the live brand system: square corners, no shadows, black on white, status green/amber for data only, Inter and JetBrains Mono. Carries a black-on-white / white-on-black toggle, because the artifact viewer renders in the READER's theme and Keith read the dark render as a reversed palette. **Concept only, nothing built, prices illustrative, copy not compliance-checked or clinically signed.** Earlier: **SUPPLEMENT SHOP FRONT SPECCED, and the finding is that the commerce backend is ALREADY BUILT**: `docs/2026-08-23-supplement-shop-front-spec.md`. Subscription checkout, the `supplement_subscriptions` table, purchase / renewal / failed-payment / cancellation webhook branches, the billing portal and the account UI are all live and product-agnostic, built for the Daily Stack. What is left is a catalogue and pages job. Three findings worth acting on: **the catalogue is hardcoded in THREE files** (`lib/subscriptions/products.ts`, `SUB_PRICE_IDS` in the checkout route, `lib/pricing.ts`) and all three name products that no longer exist, so they must be collapsed before the range changes rather than fixed one at a time; **subscription checkout requires an authenticated user** while kit checkout allows a guest, which is backwards now that supplements lead the funnel, and the kit path's 3-case webhook resolution is the code to copy; and **dispatch cadence is NOT billing cadence**, which corrects a claim made earlier the same day in this file that recurring fulfilment should hook `invoice.payment_succeeded`. It should not: the D3 SKU is **365 tablets, a 12-month bottle**, and B12 and zinc are 120 capsules, 4 months each. The buy list's "per month" figures are COST per month and were read as SHIPMENT per month. Dispatch must run off a **`next_dispatch_due`** date advanced by each product's own supply duration. **There is no supplement dispatch table**, only the subscription row, and no inventory concept anywhere in the schema. **Two requirements added by Keith 2026-08-23**: products must be **CMS rows, not code** (a `supplement_products` table on the `blog_articles` pattern, one `/supplements/[slug]` template, Stripe owning price and Supabase owning editorial, and a `draft`/`live` status because copy editable without a deploy is copy editable without a compliance pre-flight); and **stock control**, where the load-bearing point is that **Stripe has no inventory management and will sell the eleventh of ten bottles**, so the gate must sit before the checkout session is created. A subscriber is a RECURRING claim on stock, so cover is measured in **subscriber-months** and the reorder alarm in **weeks of cover**, not units left. A fourth question is now owed to the 3PL: do they expose a stock feed. Earlier: **A RAMS DESIGN AUDIT OF PLACEMENTS B AND D FAILED BOTH: 13/30 and 12/30, verdict REDESIGN**, filed in `design/DESIGN-IS-2026-08-22/`. D scored LOWER than the option it was recommended over, on blind-briefed evidence. The finding that matters: the placement question is nearly orthogonal to why the design fails — 14 of the 20 principle-scores are the same number for the same reason. Both inherit **five missing interaction states**, **no heading element for the shelf**, **light-theme AA failures on the EFSA claim line of every card (3.29:1)**, a **range bar conveying its zones by colour alone** (amber vs green 1.28:1), six keyboard-unreachable actions, a **consent box binding health-data retention to marketing permission**, and an **unscoped "Ewa-approved" line sitting beneath the commerce**. None of that changes with placement. **Superseded in direction the same day**: Keith decided the shop lives at `/supplements` organised by panel, so the results page needs a route to it rather than a shelf in the report (see `01_strategy/STATE.md`). Earlier that day: (**RESULTS-PAGE SUPPLEMENT PLACEMENT: a fourth option, D "declared block", is built and recommended; Keith has not picked.** Nothing shipped, no code touched: this is a mockup decision, ClickUp `869eng0g5`, owned by `04_products/STATE.md`. **The study's source now lives in the repo** at `design/mockups/results-range-placement-study.html`, published as artifact `fbab8253-4da1-4cc4-8258-e593a3263908` ("Where the Range Sits"). It was filed because the previous session kept it only in a scratchpad, so adding option D began by recovering the source out of the published page. Republish that file to update the artifact; keep the two in step. D is B's report grammar plus an inverted full-width bar declaring the block a shop, so the thin "same on every report" chip is deleted rather than restyled. All four recorded mockup defects fixed across every variant, including **no printed price and no printed zinc dose or salt**, both being open decisions. Earlier, 2026-08-21: (**VITALL NO LONGER RECEIVES THE CUSTOMER'S REAL EMAIL OR PHONE.** `createOrder` now sends a synthetic per-user address, `${users.id}-andro-prime@vitall.co.uk`, via the new `lib/vitall/identity.ts`, and no phone at all. **VERIFIED LIVE on build `YkyBJR98Hg-R6OZScV582`** (commit `a80fb29`): build id flipped from `ZQpD7MSIamNmGhMxpVzfa`, extraction proved stable and non-empty first, site 200, and Sentry's newest release names `a80fb29bfd78e4ebd1708fc96f7d9dd02064e60a`. This is what makes Vitall's two undisableable items (auto account creation and logins on `andro-prime.vitall.co.uk`) moot rather than pending, and it removes a paid-then-400 dispatch risk when a customer already has a Vitall account under another partner. Detail in `05_partners/labs/vitall/CONTEXT.md`. Earlier, 2026-08-18: (**PLAN STEP 6.3: `gate_rendition_publish()` NOW READS THE MEDIA REQUIREMENT OFF `content_channels`**, not off `content_renditions.thumb_spec`, and the `platform`/`format` CHECK enums are replaced by a **foreign key to `content_channels (platform, format)`** — so adding a platform is one row and no code, proved by adding Pinterest with a format the database had never seen. Migrations `20260818_generic_publish_gate.sql` and `20260818_renditions_channel_fk.sql`. 🔴 **The enums had already drifted**: `platform` listed `pinterest`, `format` did not list `pin`. The media half of the gate fires on **UPDATE-arrival only** — media links cannot exist before the row does, and the INSERT path is how a run already live in Metricool gets recorded — with new invariant **I14** covering the resting state. `content_renditions.thumb_spec` deliberately NOT dropped: redundant (0/91 disagree with the channel) but five consumers read it. Doctor is now 14 invariants. Earlier the same day: **FOUR MIGRATIONS APPLIED for content-machine plan steps 5.3/5.4, the claim tier ladder**: `20260818_content_claim_tiers.sql` (`content_asset_claims`, `content_claim_sets.superseded_at`, the `content_pins_superseded` view, and `gate_rendition_publish()` re-created with a claim block), then three follow-ups — `..._tier1_nullsafe.sql`, `..._gate_on_arrival.sql`, `20260818_content_assets_claims_classified_at.sql`. **`lib/supabase/types.ts` IS regenerated** (additive only, +172 lines), which also closes the `weekly_slots` gap noted below. 🔴 **`gate_rendition_publish()` is now the phase's function, superseding `20260801_content_state_guards.sql` section 4**: every prior rule carried forward unchanged, plus one — a rendition may not ARRIVE at scheduled-or-later while its asset holds an unresolved tier 2 or tier 3 claim. **Arrival only, deliberately**: the first-applied form re-checked resting rows and would have frozen `metricool-writeback` and the id remap on 14 live assets, which makes the database wrong about the world and calls it enforcement. **A tier 1 CHECK constraint also shipped broken for ten minutes**: two branches, a nullable column, and `NULL or false` is NULL, which Postgres ADMITS — so the one row it forbade walked through it. Caught only because every control was proved by attempting the write. New nightly invariant **content-doctor I13** (13 total), RED today on 7 true findings. `tsc` clean, doctor suite green. Earlier: **Four article changes: `cholesterol-test` LIVE with the 999 chest-pain line on two surfaces (body + FAQ frontmatter), and THREE STAGED as proposed revisions rather than written to `body` (fatigue, inflammatory, and `low-vitamin-d-symptoms` correcting PHE "recommends" to "consider" on Ewa's CA-042 ruling), because on an already-published row a `body` write IS a publish via the revalidate trigger. All three held on Keith. Two mirror-sync gaps found and logged.** Earlier: **`content_channels.weekly_slots` APPLIED, and `content-doctor` I10 now measures CADENCE rather than emptiness.** Migration `20260816_content_channels_weekly_slots.sql`, smallint NOT NULL DEFAULT 1 with a `>= 1` check; only `linkedin/text-post` moves, to 2. I10 previously asked "is anything queued", which compares against 1 because 1 is the only number an emptiness test has, so a lane running at half its documented cadence passed green for two consecutive weeks. Going dark and running under cadence are now DISTINCT findings, with a regression test holding the line, and the shortfall is measured forward-only on purpose. First live run caught `linkedin/text-post` at 1 of 2 and it later cleared honestly when a real post filled the slot. ⚠️ **`lib/supabase/types.ts` is NOT regenerated for the new column** — the doctor uses its own loader so nothing is broken, but it is owed before app code reads it. Also **`compliance-tables.js` matched the fix family by hand-listed inflection**, so `fixable` walked through both advisory scanners; now matched by stem with a 19-case suite. **NOT a G5 gap**: that consumer imports `{ HARD, NEG }` only, and an earlier note claiming the commit gate shared it was wrong. Earlier: **INTERNAL LINKING IS NOW HUB-AWARE, deployed.** `app/(marketing)/blog/[slug]/page.tsx` ordered related-reading by category then recency, so an article's inbound links were whatever shared its label; it now orders hub, then siblings under the same hub, then category, then the rest, driven by a new optional `hub:` frontmatter field on `ArticleFrontmatter`. No article carries `hub:` yet, so the live ordering is unchanged until one does: **the code is live, the behaviour is dormant by design.** tsc clean. Also **`promote-keyword.ts` had a real defect**: the 4b existing-claim check parsed keywords.csv with `line.split(',')`, so any quoted field containing a comma shifted every column right and the gate refused promotions with a fabricated reason. Latent for months; the 2026-08-15 fan-out rows are the first with a comma inside quotes. Now uses a quote-aware parser. Earlier: **KIT 1 SCOPE FIX SHIPPED to four marketing pages** and verified in a real render at two viewports: the fatigue framing is narrowed to the hormonal presentation and a routing card now hands the fatigue reader to Kit 2, closing the contradiction where the results engine enforced CA-025 and the marketing pages did not. Working tree at time of writing; a push deploys it. Also: the carousel "Ewa has not signed off the 30 posts" blocker is STALE and retracted (CA-034 + CA-035 both approved); and the dev server on port 3000 500s on every page, unrelated to any change here. Earlier: 2026-08-15 (**AEO groundwork: llms.txt now lists all 18 published articles (was 2), and `/test-selector`, `/blog` and the site-wide Organization graph gained structured data; committed, deploy state recorded below.** Earlier: 🔴 **THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE**: there is no reachable `nc-server-01` and no box with the documented 320 GB disk, which is the whole argument for putting the second copy of shot media there; one host's SSH key has CHANGED and was deliberately not overridden. Blocks the cold archive; nothing at risk while it waits, since no asset has reached `recorded`. Earlier: **`npm test` EXITS 0 and all twelve app test files run again**, after
the last two typecheck errors were fixed; **both were live defects in the heartbeat's alarm path**,
not typing noise, and one had a green test whose fixture reproduced the bug. **D5 ANSWERED: there
is no watch path, every push builds and deploys**, proved by three markdown-only commits each
producing a Sentry release. Earlier: **three migrations for content-machine Phase 1**: `variant` on
`content_renditions` with a `NULLS NOT DISTINCT` unique key, four metric columns on
`content_metrics`, and an `instagram/carousel` channel row. **Schema baseline RE-DUMPED** the same
day and its header now names them, since baseline and migrations share a date. Types regenerated;
app typecheck 0 errors, `typecheck:scripts` still failing on the same two pre-existing
`doctor-heartbeat` errors. Earlier: **new `panel` pillar → Kit 3**, and a self-inflicted **two-minute 500** on `/blog/how-to-read-blood-test-results` from switching DB content before the code that defines the pillar had deployed; reverted inside a minute, all 19 articles re-checked at 200, then redone in the correct order. ~~**`npm test` fails on three PRE-EXISTING typecheck errors** and aborts before the rest of the suite runs.~~ **Re-tested 2026-08-15: `npm test` exits 0, the whole chain passes.** The three errors are fixed; the claim is retracted. Earlier: **two published articles gained kit CTAs** via direct `blog_articles` writes for K2, both checked as rendered images, and the **drafting workspace** was found behind live on the FAI wording while the real mirror was in sync all along. Earlier: **two live copy defects found by the carousel pre-flight and fixed**: the test-selector routing fatigue readers to a testosterone-only kit (CA-033) and the Kit 1 page grading FAI, both verified live; run start pulled in to 2026-08-17. Earlier: `/go` link-in-bio grid for the carousel run built and DEPLOYED, verified live on the real deploy; earlier: the `/waitlist` page was still pre-launch copy months after launch: fixed and verified on a real render; plus results-engine FAI report-only, the badge default, two new upper bands, and the Customer.io all-clear ceiling).))_


---

## 🟢 DECIDED: the redesign is APP-WIDE, driven from the mockups (Keith, 2026-08-27)

**Keith, 2026-08-27:** *"My decision is that we are going to do an app-wide redesign from the
mock-ups."* **This answers the fork that has gated the membership work since 2026-08-26.** It is not
a membership-only redesign. Every surface a customer sees is in scope, and the mockup carries the
complete journey before any of it is built, which is the sequence he set and has not changed.

**What prompted it: he noticed the live site speaks in more than one voice.** His words, that there
are differences between *"the marketing, the apps and results, and there's a third one where I can't
remember what it is right now."* **The third one is the BLOG.** There are three deliberately
different design languages in the codebase today, each with its own file saying so in its header:

| Language | File | What it is |
|---|---|---|
| **Brand** | `styles/themes/brand-theme.css` | Marketing and canonical site. Black and white only, **no radius, no shadows**, Inter headings over Merriweather serif body. |
| **App** | `styles/themes/app-theme.css` | Dashboard and results. **Status colours permitted here and nowhere else**, plus a motion carve-out (one pulsing live dot, one load reveal) under brand-guidelines 8.3. |
| **Blog** | `styles/base/blog-skin.css` | Editorial / lab-manual. Cream surface and a hard offset block-shadow, **deliberately breaking two brand non-negotiables**, namespaced so it cannot leak. |

**A fourth exists on paper only:** the membership mockup language (1px hairlines, a single 400px
framed device, JetBrains Mono numerals, full light and dark tokens), which is what the 2026-08-26
diagnosis found the build had failed to adopt. And direction F is arguably a fifth (Geist, 28px
squircle with a concentric inner core, large ambient shadow, light and dark tokens).

⚠️ **So the honest count is three shipped languages and two proposed ones, and an app-wide redesign
means choosing one and rewriting the rest against it.** Each of the three was a reasonable local
decision with a documented rationale; none was wrong on its own. **That is precisely why nobody
caught the divergence: every file justified itself, and no artefact was responsible for the whole.**

**Route inventory taken 2026-08-27: 46 `page.tsx` routes**, of which the customer journey spine is
roughly twenty and the rest are legal, auth, ops and admin surfaces that can inherit rather than be
drawn.

✅ **THREE FOLLOW-ON DECISIONS, all Keith, same day.** (1) **Direction F's language becomes the
app-wide system**: Geist, 28px squircle with a 22px concentric inner core, very large low-opacity
ambient shadow, luminance wash plus film grain, full light and dark tokens. Marketing is therefore
settled and the app follows it, rather than the two being reconciled. (2) **The first mockup pass is
the JOURNEY SPINE only**; legal, ops, admin and auth-edge surfaces inherit the system rather than
being drawn. (3) **The medium is an HTML canvas, not Figma** — all frames on one pan-and-zoom page,
so contrast, overflow and dark mode are testable rather than drawn, and the tokens become the actual
CSS variables with no translation step.

✅ **STEP 1 IS DONE: `design/journey-inventory.md`**, the frame-by-frame inventory the mockup gets
built from. **≈45 frames** across nine journey stages. Two findings worth carrying:

- **The 29 result states in `lib/results/biomarker-copy.ts` are CARD VARIANTS, not screens.** The
  mockup needs the marker card in five band postures (low, normal, optimal, high, critical GP-block);
  the rest is copy inside the same shape. Reading that number as 29 screens would have inflated the
  job by an order of magnitude.
- **Light and dark is a token flip, not a redraw**, so it does not double the count. It does mean
  every frame must be CHECKED in both, which is the argument for the HTML canvas over a drawing.

🔵 **NEXT:** four open items are listed at the end of the inventory and are wanted before drawing
starts, the load-bearing one being whether **the blog adopts F wholesale or keeps a scoped editorial
variant**. It is the only surface with a documented licence to break the brand rules, and long-form
reading is where a system either holds or fails.

## ⚠️ THE IMAGERY GATE WAS FILED UNDER THE WRONG RULE, and it is CA-045 now (2026-08-27)

🔴 **"CA-039 pre-flight" was wrong in ten places across this file and the six direction mockups.**
**CA-039 is the public media bucket rule** ("what may never enter it"), approved by Keith on
2026-08-17, ClickUp [`869ek4a8y`](https://app.clickup.com/t/869ek4a8y). It governs the Supabase
Storage `content` bucket that Metricool fetches from unauthenticated, and its own text puts this
asset outside it: *"rendered marketing media only... site chrome stays in `frontend/public/`"*. A
homepage hero film is site chrome. **The bucket rule has nothing to say about it and never did.**

**How the label got there, because the original was right.** `design/homepage-direction-brief.md`
says three separate things in three sentences: nothing may imply a clinical service, treatment or
result; CA-039 governs the bucket; and anything promoted to a live page needs a pre-flight. Later
sessions compressed that into "CA-039 pre-flight", welding a storage rule onto an imagery gate.
**The general shape: a compressed citation keeps the authority of the thing it cites and loses the
scope**, and it then reads as more precise than the sentence it came from.

✅ **The gate itself is real and is now CA-045**, open on Approvals & Sign-offs
(`901219880207`). It fails the Keith-only entry test at question 2, a homepage hero is
customer-facing copy, so it does not go on the Keith-only board.

**Scope:** F's hero film and poster (`assets/f/`) plus the five generated photographs F inherits from
D (`assets/d/img-1..5`). **Nothing is owed while it is a mockup**; the gate arms when a direction is
built into the site.

**Four of the five judgement questions are already evidenced** on a full-resolution frame: no people,
no hands, no clinic, no blood, no sample; nothing user-derived, it is model-generated; no copy
rendered into the image, the sheet carries no letterhead, logo, heading, numbers or readable words at
2x. ⚠️ **The fifth is the whole risk and is a judgement, not a check: does an illegible letter on a
kitchen table read as a lab result?** That is claim-adjacent, so the entry test's "unsure means route
up" points it at Ewa rather than Keith alone.

**The scanner will not answer it.** `compliance-preflight/scan.js` reads copy and this asset has no
words. Record it N/A with the reason and substitute the judgement pass, exactly as CA-039's own
record did on the same problem.

## ✅ RESOLVED: commit `8c8066f` reached origin (2026-08-27)

**It is on `origin/main`, verified with `git branch -r --contains 8c8066f`, and local and origin are
level at 0 ahead / 0 behind.** The push happened after the entry below was written and nobody came
back to update it, so the blocker read as live for several hours after it had gone. **The lesson is
the general one about negative claims**: "not pushed", "not built", "nobody has asked" all decay
faster than any other kind of recorded fact, and re-testing one costs a single command. Re-run the
check before quoting a blocker, and prefer naming the command that would clear it over asserting the
absence.

**Original entry, kept for the record:** the homepage-directions work was committed but not on origin,
because `git push origin main` was denied by the permission classifier at wrap and the denial was not
worked around.

```
git log --oneline origin/main..HEAD     # expect: 8c8066f
git push origin main
```

**When it lands: no served change is possible.** Zero paths in the commit are under `frontend/`, so a
Coolify build will run and serve nothing new. Report it as "a deploy ran and contained no live-served
change", never as "nothing deployed", and do not hunt for a canary that cannot move.

**Contents:** 19 files, +4526/-1014. Six homepage directions plus `picker.html` and
`assets/{d,e,f}/`, the reconciled brief, and the four STATE entries below.

**Also left dirty in the tree, deliberately, from another session:** the `02_brand` packaging sleeve
renders, `.thresholds.md.bak`, `.site-funnel-model.md.bak`, `.tmp.driveupload/` and
`.claude/skills/web-design-guidelines/`. None of it is this session's and none of it was staged.

**One known em dash survives in this file**, inside the 2026-08-26 membership block. Verified
inherited, not introduced: the identical fragment is on the removed side of the diff, and it only
moved because the `_Last updated:` line was prefixed. It belongs to that entry's author.

## F's hero film replaced with Keith's own take, same treatment reapplied (2026-08-27)

🔵 **Keith found an error in the shipped clip and generated a replacement himself**, Higgsfield asset
`ed970bc9-ba07-4897-ab7e-b37da64614b9`, and asked for the same treatment plus the music stripped.
Then, seeing it in the page, he asked for it slowed. **Final: `assets/f/table.mp4` is 709 KB,
15.46s, half speed, silent**, and `assets/f/poster.jpg` is **98 KB** from the loop's own first
frame. Verified in the page at 1440 in both themes.

**The treatment is the same command, only the numbers move.** Source is 8.04s, 1280x720, 24fps, and
it arrived **with an AAC track**, which `-an` removes. Full chain as shipped:

```
# 1. slow to half speed, interpolating rather than duplicating frames
ffmpeg -y -i rawD.mp4 -filter_complex "[0:v]setpts=2.0*PTS,minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1[v]" -map "[v]" -an -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium slow-mci.mp4

# 2. crossfade the tail back over the head, strip audio, encode for the web.
#    The two trim points are DURATION and DURATION MINUS 0.5s. Recompute both
#    for any new source; they are the only numbers that move.
ffmpeg -y -i slow-mci.mp4 -filter_complex "[0:v]setsar=1,split[a][b];[a]trim=0:15.458333,setpts=PTS-STARTPTS[base];[b]trim=15.458333:15.958333,setpts=PTS-STARTPTS,format=yuva420p,fade=t=out:st=0:d=0.5:alpha=1[tail];[base][tail]overlay[v]" -map "[v]" -an -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 31 -preset slow -movflags +faststart table.mp4

# 3. poster from the loop's OWN first frame, so there is no jump on takeover
ffmpeg -y -i table.mp4 -frames:v 1 -q:v 3 poster.jpg
```

✅ **THE CROSSFADE IS EASIER ON THIS CLIP, AND THE REASON IS WORTH KEEPING.** Nothing hard-edged moves
in it: mug, sheet and glasses sit still and only the light travels, so the dissolve has a lighting
change to hide and no object to double. That is exactly what the previous clip could not do, and why
that one needed the bookend (same still as `start_image` and `end_image`). **This one needs no
bookend**: half a second of dissolve brings the last frame to within **3.68** of the first, against
the rubric already in use, under about 4 is invisible. The general rule that falls out: **a crossfade
loop is cheap when only light moves and expensive when objects move**, so check what moves before
reaching for the upstream fix.

🟢 **IT WAS TOO FAST, AND HE CALLED IT, WHICH IS TWICE NOW ON THIS HERO.** As generated it ran about
four times faster than the clip it replaced: light **4.7 to 6.0**, vapour **4.5 to 15.9**, against
the previous clip's light **0.3 to 1.4**, vapour **0.3 to 3.7**. The *relation* passed the old test,
light stayed subordinate to vapour, which is why it was flagged rather than changed unasked. **It is
now at half speed**, the same fix an earlier cut took: `setpts=2.0*PTS` then
`minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, then the same crossfade.
**The pattern to carry forward: this hero has now been called too fast twice, so slow a generated
clip toward the approved pace BEFORE showing it, rather than measuring the ratio and flagging.**

✅ **SIGNED OFF ON THE PACE. Keith, 2026-08-27, on the half-speed loop: *"the hero pace is great"*.**
Half speed is the settled answer for this clip; the third-speed option that was on the table is not
needed and is closed. **The F hero film is DONE** and the only thing still standing between it and a
live page is the pre-flight on the imagery, which is **CA-045**, opened 2026-08-27.

⚠️ **ONE OF THE SPEED NUMBERS LIES, and it will lie again.** After halving, the vapour behaves as
expected (4.5 to 15.9 becomes **1.6 to 9.6**) but the bare-table figure barely moves (4.7 to 6.0
becomes **3.7 to 5.5**), which reads as "the slowdown did nothing". It did. That region's number is
mostly per-frame film grain, and **grain is regenerated every frame, so it does not slow when the
footage does**. Sample a region containing the object whose motion you care about, never a flat one,
or the metric reports the noise floor instead of the motion.

🔵 **THE ASSET URLS NOW CARRY A `?v=` NUMBER, and it is load bearing.** Replacing a file in place at
the same path left Keith's browser playing the OLD bytes through a reload, while the served file and
the disk file hashed identically. The headless screenshot used to verify could never reproduce it: it
launches a clean profile with an empty cache every run, so it refetches by construction and reported a
pass. `poster.jpg?v=N` and `table.mp4?v=N` in `F-field.html` fix it at the source. **Bump N in the same
edit that replaces either file**, and the same applies to any other mockup asset swapped in place.

✅ **Interpolation was checked before it was accepted**, since mci artefacts show on chaotic motion:
frame by frame on the tea surface the rim stays crisp with no smearing, and a frame-to-frame
alignment search found zero pixels of introduced jitter in either the source or the interpolated
output.

**Compliance is unchanged and still gated.** The sheet is soft grey squiggles: no letterhead, no logo,
no heading, no numbers, no readable words, verified at 2x zoom on a full-resolution frame. No people,
no hands, no clinic, no visible blood. 🔴 **The CA-045 pre-flight still gates it.**

## F's hero recut: the tube became an illegible letter, and the loop is now bookended (2026-08-27)

🔵 **Keith raised the compliance risk himself before I did**, on the generated sample tube in the F
hero: *"It might be sailing a little bit close to the wind."* His proposal: replace it with a letter
or report, dim the wording, keep the mug oriented as it is, rest the glasses on the letter, and have
a breeze gently flutter the page.

**The compliance line, stated so it is not re-litigated later.** An **unbranded, unreadable** sheet on
a kitchen table makes no claim. It is post nobody has dealt with, which is the emotional truth of the
brand. What would cross the line is a legible letterhead, anything reading as a named lab or the NHS,
or any readable figures or ranges: those imply a clinical service and a per-customer result, which
brief section 2 forbids outright. **So the sheet carries soft grey lines of type with no letterhead,
no logo, no heading, no numbers and no readable words**, and at page scale under the scrim it is
illegible anyway. 🔴 **The CA-045 pre-flight still gates it.**

**Two generations to place it.** The first put the letter in the left half, where the headline sits,
and left the glasses beside it rather than on it. The second pinned the composition explicitly:
entire left half empty, every object in the right third, glasses lying open across the sheet.

🔴 **THE LOOP PROBLEM GOT HARDER, AND THE FIX IS WORTH KEEPING.** A fluttering page has an arrow of
time, so ping-pong was already out (see the entry below). **A crossfade alone also failed**: the sheet
is in a different position at every moment, so dissolving the tail over the head showed **two
overlapping sheets** and washed the type off the page for the length of the blend. Searching every
candidate end frame did not rescue it, because no frame matched the first one. Worse, a whole-frame
search gave a **confidently wrong** answer, because it was dominated by slow light drift rather than
by the paper; scoring only the paper region gave a different and better result.

✅ **The fix was upstream, not in ffmpeg.** `seedance1_5` accepts both a `start_image` and an
`end_image`, and **passing the same still as both makes the clip return to its own opening state**.
The paper region then matched frame zero at **2.7**, against 11.4 for the best crossfade point without
it, and half a second of dissolve hid the remainder. **Order to use in future: bookend first, prompt
the motion as a round trip, crossfade only for what is left.**

**One more correction on the way:** the first bookended take lifted the sheet clean off the table
with the glasses holding nothing. Re-prompted with the motion dialled right down ("the sheet never
leaves the table", corner rises about a centimetre) and it behaved.

**This clip is NOT slowed**, unlike its predecessor. Measured per second, the light side of the frame
changes 0.4 to 1.4 while the paper and steam change 3.8 to 13.5, so the light is already subordinate
to the motion it should be subordinate to. Slowing it would have made the flutter sluggish to solve a
problem that no longer exists.

**F hero assets as of this entry** (superseded 2026-08-27, see the entry above): `assets/f/table.mp4` (254 KB, 7.42s, bookended loop) and
`assets/f/poster.jpg` (67 KB, from the loop's own first frame). Submission note: the video call was
intercepted once by a preset recommendation and needed `declined_preset_id` echoed back, exactly as
the higgsfield-generation runbook documents.

## 🟢 F IS THE ONE, and the loop had to be rebuilt to get there (2026-08-27)

**Keith, 2026-08-27, on F with the video in:** *"I think the video works really well... if we could do
something about that, I think this is the one that we will go with."* **The "that" was a real defect
he caught and I had shipped**, so it is worth recording precisely.

🔴 **THE DEFECT: a ping-pong loop reverses irreversible motion.** Both E and F were looped by
ping-pong, forward then reversed, which gives a mathematically perfect seam for free. That is correct
for E, where the only motion is light raking across a surface and running it backwards looks
identical. **It is wrong for F, where steam rises from a mug: reversed, the steam visibly sucks back
into the cup.** Nothing flagged it because the seam metric was perfect; the seam was never the
problem.

✅ **THE FIX: a crossfade loop.** The clip was regenerated at 8s (`seedance1_5`, same start frame) and
now plays **forward only**, with the last 1.5s dissolved back over the first 1.5s in ffmpeg
(`trim` + `fade=alpha` + `overlay`). Every frame runs in the correct direction, the seam is hidden by
the dissolve, and the cost is 1.5s of clip plus a faint ghost during the dissolve that the scrim and
the headline make invisible. Loop is 6.54s, **330 KB**. The poster is now taken from the loop's own
first frame rather than the source's, so there is no jump when the video takes over.

**THE RULE, for any future looping footage:** ping-pong is valid only when nothing in frame has a
direction. Light, shadow, reflection and shimmer are fine. **Steam, smoke, liquid, pouring, draining,
falling, walking and anything with an arrow of time are not.** Crossfade instead, and budget the
crossfade length out of the clip. E's loop is still a ping-pong and is still correct, which is the
cleanest illustration of the distinction.

**Verification note worth keeping:** a first-frame-versus-last-frame difference score cannot catch
this. Ping-pong scores a perfect 0 and is still wrong. The check that works is looking at the motion
itself, which here meant a contact sheet of the mug across the loop point.

✅ **THEN THE SPEED, same day.** Keith on the fixed loop: *"the video is perfect, except I think it's
a little fast. It looks like the sun or the shadow is moving at twice the speed of everything else."*
Correct, and it is a **relative** reading: the shadow was outpacing the steam. **Now runs at half
speed**, slowed with `setpts=2.0*PTS` and re-interpolated with `minterpolate` (mci/aobmc) so the
drift stays smooth instead of stepping on duplicated frames, which is what a naive slowdown of 24fps
footage gives you. Slowing everything rather than isolating the light was the right call: steam at
half speed reads calmer, which the page wants anyway. Interpolation was checked frame by frame on the
steam for smearing before it was accepted, since chaotic motion is where mci artefacts show.
**The clip got smaller doing it**, 330 KB to **269 KB**, because slower motion compresses better.
Loop is now 7.5s.

**F hero assets as of this entry** (superseded twice since, see the entries above): `assets/f/table.mp4` (269 KB, 7.5s, half speed, crossfade loop) and
`assets/f/poster.jpg` (77 KB, taken from the loop's own first frame).

## KEITH PICKED D, and E and F test its hero ground (2026-08-27)

🟢 **The direction is decided: D, Machined.** Keith, 2026-08-27, on the mockups: *"D wins for me. It's
fairly close to what I imagined, and I'm surprised."* **A, B and C are now reference, not
candidates.** They stay on disk because the picker is worth keeping intact, but no further work goes
into them.

🔵 **What he asked for next, and it is a narrow ask:** two more variations, E and F, **on the bones of
D**, because he thinks more can be done with the hero background. His words: it is very subtle, he
likes what is in D, and he wondered about video *"or something else, or just make the background in
the hero section a little more creative."*

**So E and F change exactly one thing.** Everything below the header is D unaltered: same trays and
inset cores, same asymmetrical bento, same Geist, same tokens, same copy, same cited numbers. The
only variable is the hero ground, which is the only thing there is to judge between them.

| | The hero ground | Cost |
|---|---|---|
| **D. Machined** | Luminance wash plus a repeating rule at two scales | Nothing |
| **E. Machined / Cast** | Four seconds of filmed light moving across a pale machined surface | **690 KB video** |
| **F. Machined / Field** | A film of the kitchen table on the morning the post arrived, with the data field over it | **254 KB video** |

**E takes the direction's metaphor literally.** If the page is built as machined objects, the ground
behind the type is the material those objects are cut from. Generated with Higgsfield
(`kling_omni_image` for the start frame, `seedance1_5` for four seconds of motion), then
**ping-ponged in ffmpeg** (`reverse` + `concat`) so it loops with no visible seam. **One asset serves
both themes**: the footage is very nearly monochrome, so dark mode applies `filter: invert(1)` and
gets a dark machined surface with light raking across it. Encoded at crf 31, 1280x720, silent,
faststart, **690 KB**. A flat scrim sits over it because the headline does not clear 4.5:1 against
the bare footage. Assets in `design/mockups/directions/assets/e/`.

**F is now two layers, after Keith asked on 2026-08-27 to put a real video in its hero** and see
"what a video around what we're doing would look like". Underneath: an ordinary kitchen table at the
moment the kit is on it, mug, tube, envelope, reading glasses, light moving across pale wood.
**No people, no hands, no clinic, no visible blood**, so nothing implies a clinical service. Over it:
the canvas field from the same six markers the readout uses, all transcribed from
`04_products/results-engine/thresholds.md`, dropped to 34% opacity because over a photograph the same
lines that read as data over a flat ground read as scratches. The picture says where you are; the
field says what we do there.

**The colour treatment is contrast work, not decoration, and it took two generations to get there.**
The first frame came back warm and mid-toned, mean luminance 130 of 255, which on a near-white page
with near-black type would have had to be lifted so hard it looked washed out. Regenerated high key,
then graded to monochrome, lifted, and given a **directional** scrim: heaviest at the left where the
headline sits, lightest at the right where the objects are. Dark theme **darkens** the same file
rather than inverting it, because inverting a real scene turns a pale table black and the objects
white, which reads as a photographic negative rather than a night kitchen. E can invert because
E is a material, not a scene.

**Cost: 269 KB, well under half of E**, because almost nothing in F's frame moves and h264 rewards
that. Assets in `design/mockups/directions/assets/f/`.

**So the E vs F trade is no longer free vs paid.** Both now carry video. E is 690 KB of abstract
material; F is 307 KB of the actual product moment plus the data. **F is the cheaper and the more
literal of the two**, which was not true before Keith asked for this.

**Both keep every rule D established**, with one deliberate exception: F is now photographic, which is what Keith asked to see. E stays material and light rather than a person. No
scroll listener, static under `prefers-reduced-motion` (F draws one frame; E needed JS to pause,
since CSS has no lever for video), and neither depends on JS to render: E degrades to its poster
frame, F falls back to D's plain CSS rule. **Impeccable: E 21, F 24**, both inheriting D's accepted
set. E is lower because removing the wash and the repeating rule from its stylesheet, once the film
replaced them, removed dead CSS the detector was right to flag.

🔵 **The picker now carries six**, keys 1 to 6. Same verbatim harness.

✅ **ANSWERED: F.** See the entry above. And separately, still open: whether the marketing site and the app
share one design system.

## A, B and C rebuilt as v2, and all four now sit behind a picker (2026-08-27)

🔵 **Keith typed `/prototype` and ruled: rebuild A, B and C, D stands as built.** `/prototype` is
`disable-model-invocation: true`, which blocks Claude from calling it through the Skill tool but not
from executing it once a human invokes it. That distinction is worth writing down, because the
previous entry recorded the block without recording that user invocation lifts it.

🔵 **The picker is at `design/mockups/directions/picker.html`.** Markup, CSS and key wiring are
verbatim from the skill's `PICKER.md`, which the brief required and which forbids a hand-rolled
substitute. **One adaptation, and it was forced:** each direction is a complete standalone page with
its own stylesheet, so variants mount as **iframes** rather than as inlined markup. Four full
stylesheets in one document would collide on class names and the comparison would be worthless.
Switching still re-mounts, so entrance animations re-run exactly as the picker contract requires.
Keys 1 to 4 and the arrow keys switch, `R` replays, `?v=N` persists the choice, and `?t=light` /
`?t=dark` on the harness is passed through to whichever direction is mounted so all four can be
compared in one theme.

**The divergence rule that shaped v2: each direction spends a DIFFERENT one of the brief's four
levers.** The brief diagnosed v1 as flat because it used almost none of photography, scale, texture
or motion. Making all four pull the same lever would have wasted the picker, so:

| | Lever | Palette | Display face | Layout family | Header |
|---|---|---|---|---|---|
| **A. Specimen** | Photography at scale | Warm bone | Newsreader | Full-bleed plate bands | A photograph under a slow drift |
| **B. Instrument** | Density and data | Cold near-black | Space Grotesk | Data hero plus snap rail | A readout that draws itself and counts up |
| **C. Broadsheet** | Texture and print | Screened newsprint | Instrument Serif | Multi-column, drop cap, halftone plates | Masthead rules drawing across |
| **D. Machined** | Light and depth | White and silver | Geist | Asymmetrical bento | A luminance wash and a drifting rule |

**Assumption stated to Keith and not challenged:** his "non-photographic motion" call settled **D's**
header, and section 6's three levers (motion, depth, imagery) are things to diverge across rather
than repeat. If that is wrong, A is the direction that changes.

**Impeccable across all four: A 3, B 1, C 3, D 24.** v1 was 138. Every remaining finding is a
recorded decision:

- **A and C keep `all-caps-body`** on their label furniture. Both are print-derived directions and
  caps-as-label is the typographic system rather than decoration. The gratuitous ones were removed:
  the kit spec line is not a label and no longer reads as one.
- **B and C carry `overused-font`** on Space Grotesk and Instrument Serif, the same finding class v1
  carried on Inter and D carries on Geist. Section 8 of the brief hands this class to Keith.
- **D's 24 are unchanged and documented** in the entry below: twelve `nested-cards` because the
  double-bezel IS that direction, seven structural `clipped-overflow-container`, and four accepted
  singles.
- **The eyebrow chips, kickers and numbered step labels came out of all three**, as they did from D.
  The detector is right that they are generated-page scaffolding, and they were the single thing
  making four different directions look like the same template.

**Three real defects the verification caught, one per direction:**

1. 🔴 **A's conflict-free receipt was 1.0:1 in dark theme.** The block hardcoded light-on-dark
   literals so that it would invert from the page; in dark theme the page is already dark, so it
   became near-white text on a near-white ground. **Inverse colours have to be tokens that flip with
   the theme.** Fixed with an `--inv-bg` / `--inv-fg` pair, and verified by eye in dark.
2. **B skipped a heading level**, h2 straight to h4, because the timeline steps were h4 to sit under
   a number that has now been deleted.
3. **A's hero photograph was too dark to read as a photograph** at 390, which defeats the entire
   axis of that direction. Brightness and crop corrected.

**All three carry the `.js` gate D needed**, so no page renders as a blank column if the
IntersectionObserver never fires, and `?still=1` gives a settled render for screenshots. **Verified
at a true 390 and at 1440, both themes, full-page, with no horizontal overflow on any of the four.**

**Every number is still cited** to `04_products/results-engine/thresholds.md` with the arithmetic in
a comment beside it. B shows six markers rather than four, so it additionally cites hs-CRP and SHBG,
the latter deliberately banded on the range the lab returns rather than a fixed number, per ruling 7.

✅ **ANSWERED SAME DAY: Keith picked D.** See the entry above. The original note read:
🔴 **THE CHOICE IS KEITH'S AND NOTHING ELSE MOVES UNTIL IT IS MADE.** The skill stops here by
design. To promote one: `/prototype keep <name>`. To diverge again around one:
`/prototype riff <name>`.

**Still open, and both still need Keith:** (1) which direction; (2) whether the marketing site and
the app share one design system.

## Direction D built, imagery generated, and the Figma question answered (2026-08-27)

🔵 **`design/mockups/directions/D-machined.html` exists and is verified.** The fourth direction from
`homepage-direction-brief.md` section 9, built with `high-end-visual-design`. Variance engine roll:
**Soft Structuralism** (that skill's own consumer and health archetype) crossed with the
**Asymmetrical Bento**. It is in the index alongside A, B and C.

**It answers "flat and barren" with light and depth rather than more structure.** Every card is a
28px tray holding a concentric 22px inset core, every marker track is a recessed well, and the page
sits under one very large low-opacity ambient shadow with fixed film grain over it. Nothing glows
and nothing is coloured.

**Keith's call on the header (2026-08-27): non-photographic motion.** So the hero carries no
photograph. Three moving layers instead: a luminance wash breathing over fifteen seconds, a drifting
measurement rule at two scales behind the type, and a staggered mask reveal on the headline. All
transform and opacity, no scroll listener, all collapsing to static under `prefers-reduced-motion`.
Photography enters lower down, in the bento cells.

**Four aesthetic departures, and they are the whole direction:** radius (none to a 28px squircle),
shadow (none to diffused ambient), typeface (**Inter to Geist**, because `high-end-visual-design`
bans Inter outright and keeping it would have made D a version of B), and ground (flat white to a
luminance wash plus grain). One accent, amber, used only as the borderline chip fill with near-black
text on it. **Every compliance rail is untouched.**

**Five photographs generated and committed** to `design/mockups/directions/assets/d/`, via Higgsfield
`kling_omni_image` to the `02_brand/CONTEXT.md` photography spec: ordinary British men 38 to 55,
kitchen, home evening, hands with a sample tube, an office at 4pm, a municipal changing room. All
checked by eye, one regenerated because the pose read as mocking the subject rather than showing him.
🔴 **They are claim-adjacent and have NOT been pre-flighted.** That is CA-045. Mockup only until it clears.

**Three real defects the verification caught, none of which a text report would have found:**

1. **The whole page below the hero rendered blank.** Every section was gated behind an
   IntersectionObserver, so with no observer there was no content, only a white column. Now every
   entry animation sits behind a `.js` class the page adds to itself, and `?still=1` renders the
   settled state. **Content must not depend on JS to be visible.**
2. **Real horizontal overflow.** The hero luminance wash is 150vw wide and centred, pushing the
   document to 507px at a 390 viewport, with `overflow-x:hidden` on `body` masking it. The hero now
   clips its own decorative layers and body no longer hides the next one.
3. **The headline mask boxes clipped their own glyphs**, because `overflow:hidden` on a 1.06
   line-height leaves no room for ascenders or descenders.

**Impeccable: 38 findings down to 24, and the 24 are deliberate.** Twelve `nested-cards` (the
double-bezel IS the direction), seven `clipped-overflow-container` (the hero wash, the rule mask, the
rounded image corners, four inlaid tracks), two `overused-font` on Geist and Geist Mono (**the same
finding class v1 carried on Inter, and section 8 of the brief hands it to Keith**), one
`repeating-stripes-gradient` (the measurement rule, which is the header answer), one
`aphoristic-cadence` (Keith's settled copy, which the brief forbids rewriting), one `all-caps-body`
(the readout verdict labels, which are instrument vocabulary). Sixteen were genuinely fixed, and the
fix list is worth reading: **the kickers, the eyebrow chip and the 01/02/03 step labels are gone**,
because the detector is right that they are generated-page scaffolding and they were the one thing
making D look like every other wellness page. The functional text floor was lifted from the brief's
11px to **12px**, since section 3 calls this a presbyopia demographic.

**Every number is still cited.** Four markers, each carrying its arithmetic in a comment beside it,
all from `04_products/results-engine/thresholds.md`: testosterone 14.2 and vitamin D 58 agree with
the lab; **Active B12 45 and ferritin 62 are the two splits**, where the assay says normal and our
GP-approved bands say borderline.

🔵 **FIGMA QUESTION ANSWERED (Keith, 2026-08-27): a new file, not the social one.** Created at
**<https://www.figma.com/design/3la8nvgxYC9fey8QLDuFaA>** ("Andro Prime homepage directions"). It
holds a `D tokens` variable collection, the phone frame at 390, the desktop frame at 1440 with the
asymmetric bento row, and a **sources and departures panel** carrying the same citations as the HTML.
Two constraints found: the plugin API **cannot rename a document** (so a first file with an em dash
in its name, `IAYgjVx5mplKefQydRACbD`, is stray and Keith should delete it), and the plan **caps a
variable collection at one mode**, so dark values ride in each variable's description instead of a
Dark mode. The existing Figma file `O4K7R8RlCKRM7EQ7WxFtCn` is social assets only and was left alone.

✅ **DISCHARGED 2026-08-27, see the entry above: Keith typed `/prototype` and A, B and C were rebuilt as v2.** The original note read:
🔴 **STILL OWED, AND ONLY KEITH CAN DO IT: A, B and C have no v2.** `/prototype` is
`disable-model-invocation: true`, so Claude cannot invoke it and hand-rolling a substitute is
disallowed. The imagery, the tokens and the verification method are now on disk waiting for it. The
line to type:

```
/prototype four homepage directions per andro-prime/09_website-app/design/homepage-direction-brief.md
```

**Open, and both still need Keith:** (1) which direction; (2) whether the marketing site and the app
share one design system.

## Three homepage design directions drawn and phone-verified (2026-08-27)

🔵 **`design/mockups/directions/` holds A-specimen, B-instrument, C-broadsheet plus an index.**
Same copy, same compliance rails, same sourced data; only the visual language differs. Built with
the `design-taste-frontend` skill (design read, dials, pre-flight) and checked with the Impeccable
detector. **Keith's call, nothing agreed.**

**The unlock: the packaging already broke the guidelines, and it broke them well.** The kit renders
(`02_brand/assets/packaging/renders/`) are warm bone stock, serif product names and hairline rules.
`brand-guidelines`/`visual-identity.md:97` still say white background, Inter Black uppercase
headlines and "structural black borders". `.blog-skin` is already a documented cream departure. So
the site is the only surface still following v2.0 literally, and these directions bring it into line
with where the brand already went rather than inventing anything. **Keith believed rounded-none and
no-shadow were not brand rules; they are, in writing.** Changing them is his decision (brand
sign-off is Keith, not Ewa: clinical and claims only).

**The detector found a real accessibility defect, not a style quibble: 138 anti-patterns, 69 of them
functional text below 11px and 37 below 4.5:1 contrast.** For a phone-first site aimed at men 38 to
55 that is a legibility failure. Fixed across all three; **138 down to 4**. The remaining 4 are one
finding repeated: `overused-font: inter`. **Deliberately not fixed**, because Inter is the
documented brand face and the logo glyphs are Inter Black outlined to paths.

**Verified at a true 390px viewport with Playwright**, not desktop-with-a-breakpoint. Two bugs were
caught only by looking: a `padding` shorthand on `.sec`/`.hero` silently wiped `.wrap`'s horizontal
padding, and headless Chrome enforces a minimum window width, so early 390px captures were laid out
at ~500px and cropped, which read as an overflow bug that did not exist.

**Serving locally:** `python -m http.server 8090` from the repo root, then
`/andro-prime/09_website-app/design/mockups/directions/`. The pages take `?t=light` / `?t=dark` to
force either theme, and `?dbg=1` on A reports anything wider than the viewport.

**SUPERSEDED SAME DAY by Keith's review of the three.** His read: they "still look pretty flat and
barren". Diagnosis accepted and it is not typography. All three were type and rules on a flat ground
with three small product photographs and one animation invisible in a screenshot; the brand rules
forbid shadows, gradients and accent colour, so the only levers left were photography, scale,
texture and motion, and v1 used almost none of them.

**Three rulings followed, all Keith, all 2026-08-27:**

1. **The visual brand guidelines are now ADVISORY.** Break them where breaking them produces a
   better modern result. Compliance rails are untouched. Full entry in `02_brand/STATE.md`.
2. **Do not use the packaging renders.** They are the actual product packaging and the boxes are
   white. Generate site imagery instead, to the photography spec in `02_brand/CONTEXT.md`.
3. **The header needs motion, depth or imagery**, not words on a flat background.

**v1 archived at `design/mockups/directions/v1-2026-08-27/`.** Reference, not a starting point.

🔵 **The brief for the next pass is `design/homepage-direction-brief.md`**, written to survive the
session boundary. It carries the permission boundaries, the phone-first two-surface model, the
imagery split (Higgsfield for photography, `imagegen-frontend-web` for section references), the
image-first build order, the four directions including D from `high-end-visual-design`, the hard
constraints that each caused a real v1 defect, and the verification method.

🔴 **`/prototype` CANNOT be invoked by Claude.** It is locked to explicit user invocation and
hand-rolling a substitute is disallowed. **Keith must type it.** Everything else in the brief Claude
can drive.

**Open, and both need Keith:** (1) which direction; (2) whether the marketing site and the app share
one design system. **Both answered 2026-08-27, see the entry above:** the directions are built as HTML with the Figma
file as a parallel artefact, and a new Figma file was created rather than writing into the social one.


## Vitall dispatch sends a synthetic patient identifier (2026-08-21)

**VERIFIED LIVE 2026-08-21** on build `YkyBJR98Hg-R6OZScV582`, commit `a80fb29`.

**Deploy verification, for the record.** The change is server-only, so a client-chunk fingerprint would have been structurally blind to it; the canary used was the **per-run build id** from the RSC payload (rung 1, layer-agnostic), captured pre-push as `ZQpD7MSIamNmGhMxpVzfa` with the same command used to poll, and asserted stable and non-empty before being trusted. Post-push it read `YkyBJR98Hg-R6OZScV582`. Corroborated by a second independent signal: Sentry's newest release is `a80fb29bfd78e4ebd1708fc96f7d9dd02064e60a`. Site returns 200.

**What changed:**

- New `frontend/lib/vitall/identity.ts` exporting `vitallPatientEmail(userId)` → `${userId}-andro-prime@vitall.co.uk`, with the full rationale and policy trail in the file header.
- `frontend/app/api/vitall/dispatch/route.ts` sends that instead of `user.email`, and **no longer sends `phone`** (also dropped from the `users` select). `user.email` is still read, but only to key the Customer.io `kit_dispatched` event on our own canonical identifier.
- `frontend/scripts/e2e/place-vitall-test-orders.ts` mirrors the production path.
- `docs/vitall-integration-spec.md` updated: sample payload, field notes for `email` and `phone`, and the "email already associated with a different partner account" 400 annotated as mitigated.
- **New test: `frontend/scripts/test-vitall-patient-payload.ts`, 21 assertions, added to the `npm test` chain.** The patient block is now built by `buildVitallPatient()` in `lib/vitall/identity.ts` rather than inline in the route, so the rule is a named unit. **Its signature takes no email and no phone parameter**, so neither can be passed by accident. The tests assert the synthetic shape, that no real mailbox or phone appears anywhere in the serialised payload, that `phone` is absent as a key (not merely undefined), that the lab's fields pass through untouched, and the dedupe invariant (stable per user, distinct between users, independent of order and of profile-name changes).
- **The test was verified to actually fail.** Sabotaging `vitallPatientEmail()` to return a real gmail address produced 7 failures including "the payload does not contain the real email address"; restoring it returned 21/21. A regression test that has never been seen red is not evidence.

**Why:** Vitall-side automations were emailing our customers directly (order confirmation, "received at lab", "results available", all observed arriving from Raizel). Ben Starling disabled those on 2026-08-21 but **cannot** disable auto account creation on `andro-prime.vitall.co.uk` or existing logins on it. A disabled automation is a config flag; an unreachable mailbox is not. Vitall use email only as the account's unique key and ignore anything `@vitall.co.uk` on a partner account: it is their own in-clinic pattern.

**Safe because nothing keys on it:** results match on `partner_order_id` (`app/api/webhooks/vitall/route.ts`), kit-to-order linkage is Vitall pre-printing against the order with no customer-side kit registration, the bundle's second kit reuses the same `user_id`, and the trend view in `lib/results/getDashboardData.ts` already spans all of a user's orders. `lib/vitall/client.ts` exposes only `createOrder` and `getAvailableTests`, so no code path looks a customer up at Vitall by email.

**Derived from `users.id`, never the order id** — Vitall dedupe patients on this address, so a per-user value keeps a repeat customer consolidated on one Vitall patient record.

**Timing:** done before real customers exist. One live order (Keith's own) plus test orders, so **no backfill and no migration**.

**Verified on both sides.** `npm test` and both typecheck projects are green, and the payload assertions cover everything we control. **Vitall's acceptance is no longer taken on trust:** a throwaway probe against the SANDBOX (`vitallsync.com`) called `/order/create` with `probe-...-andro-prime@vitall.co.uk` and it was **ACCEPTED**, order `322945081`, with the address echoed back verbatim and `"phone": null` in the returned patient record. So Vitall's validator does not reject its own domain and does not require a phone number. The probe touched no database: it built the payload by hand and was deleted after the run, so nothing was seeded into `users` or `kit_orders`.

**Two facts worth keeping from that probe:** the **sandbox accepts the same `VITALL_CLIENT_ID` / `VITALL_CLIENT_SECRET` as production**, so testing needs only `VITALL_SANDBOX=true` and no separate credentials; and `VITALL_SANDBOX=false` in `.env.local`, so **running the e2e order script as-is places REAL orders against production Vitall** and also writes to the production database. Force the flag in the script, not in `.env.local`.

**Open, pending Ben:** whether the email string appears on the pre-printed kit or the Lab Request Form. Cosmetic only, routing does not depend on it, but if it prints we want the field suppressed or a friendlier format agreed. Also open: whether the already-created Vitall accounts can be deleted rather than left dormant.

---

## THREE ARTICLE CHANGES: one LIVE, two STAGED, and the difference is the revalidate trigger (2026-08-18)

**`cholesterol-test` changed LIVE.** Ewa's 2026-08-18 chest-pain ruling added a 999 escalation for
sudden or severe chest pain. Written through `upsert_blog_article()` so the revision trail carries an
editor (`claude/ewa-ruling-2026-08-18-chest-pain-999`). Body 15,996 to 16,431 chars.

**Two surfaces, because the FAQ is a second one and it is easy to miss.** The body gained the 999 block
inside the existing `SystemAlert`; the **frontmatter `faq`** entry "When should I see a GP about my
cholesterol?" gained the same escalation prepended to her signed text. That FAQ array is machine-read
into FAQ schema, so a body-only fix would have applied the ruling where a human reads and not where an
AI Overview does.

⚠️ **`sync-mirror.ts` is BODY-ONLY by design, so it could not carry the FAQ change.** It preserves each
mirror file's hand-written frontmatter verbatim, which is the right behaviour and also means a
frontmatter change is invisible to it. `export-blog-from-db.ts` does carry frontmatter but rewrites
**all 19 files unconditionally** with no diff check, so it is the wrong tool for a one-field change.
The mirror's FAQ was therefore brought into agreement with the DB by hand and **verified by parsing it
back with `gray-matter` and comparing to the DB string**, rather than by eye. **This is a real gap in
the "put it in the DB and re-export the mirror" rule**, which is stated in three places as though it
were complete: `content/blog/*.mdx` is also the **import source**, so a stale mirror FAQ is what a
future `import-blog-to-db` run would push back. Logged as task-observer observation 314.

**Three articles changed STAGED, not live**, all via `stage-reopt.ts`, all at `content_pipeline`
`reoptimising` / `blocked_on = keith`, all live bodies unchanged:

| Article | Proposed revision | Why |
| --- | --- | --- |
| `why-am-i-always-tired` | `b591ae0c-735e-4fcd-ada2-83836854ce91` | the fatigue block, Q2-cleared |
| `inflammatory-markers-blood-test` | `9bfa70a7-f7ea-4027-a765-5d1b1b4c2e5f` | the inflammatory block, cancer paragraph as written |
| `low-vitamin-d-symptoms` | `069199cf-1fc6-4c5d-ac66-721647c61b00` | CA-042 Q1: PHE "recommends" corrected to "consider", in the body paragraph AND the FAQ |

⚠️ **The vitamin D one carries the frontmatter mirror trap too**, since its FAQ changed: when it is
promoted, `sync-mirror.ts` will not carry the FAQ edit to `content/blog/low-vitamin-d-symptoms.mdx`.

🔴 **The mechanism distinction is the load-bearing part.** `blog_articles` carries an `AFTER UPDATE`
trigger firing the revalidate webhook, so on an **already-published** article a write to `body` is a
publish, in seconds. The approval packets' standing line, *"copy goes into the database and the mirror
is re-exported; each article still goes through its own publish gate afterwards"*, is true for a draft
row and **false for a live one**: there is no gate left after the write. `stage_blog_revision` writing
`proposed_revision_id` is the only mechanism that makes "in the database, not published" true for a
live article. Logged as task-observer observation 315.

---

## Kit 2 and Kit 3 sample-report panels re-derived from the results engine (2026-08-17)

**Both kit pages had their first-ever compliance pre-flight and the sample panels failed it.** They were
grading markers against a vocabulary the product does not use, with several verdicts the engine would
never return. `app/(marketing)/kits/energy-recovery/page.tsx` and `.../hormone-recovery/page.tsx`.

- **Adopted the product's own badge vocabulary** (Keith, 2026-08-17). Every row now carries the label
  `components/results-engine/StatusBadge.tsx` would render for that value, plus its `filled` flag, plus
  the bar zone from `resolveBarZones`. The pages previously read Normal / Borderline / Low, which
  appears nowhere in the engine. **"Normal" mattered most**: `StatusBadge`'s own comment records Keith
  retiring "Optimal" for merely-in-range in August because the badge must not contradict the article,
  and the kit pages were using the exact word the brand's wedge exists to challenge.
- **Two rows contradicted rulings made five days earlier**, applied in one place and never swept: FAI
  was graded `Normal` with a green bar though K1 (CA-034) had settled it as report-only and fixed only
  the Kit 1 LP; and hs-CRP 2.1 and 1.2 both read `Normal` though E1 held `classifier.ts:310` at `> 1`
  and that reached the carousel deck but neither kit page.
- **FAI now renders with no bar at all**, matching `resolveBarZones` returning `[]` and its reason: a
  coloured bar IS a verdict. The row renderer gained a `barColor &&` guard for it.
- 🔴 **A contrast defect was caught only by screenshotting.** The filled badges first rendered as solid
  black boxes with black text: the `data-label` component class sets its own colour and beats a plain
  `text-white` utility. `tsc` passed, the copy scan passed, the JSX read correctly, and the panel was
  unreadable. Fixed with `!text-white` / `!text-black`, verified at 2x on both pages.
- ⚠️ **Free Testosterone has exactly two states**, `ft-normal` and `ft-low`, split on the LAB's
  `referenceLow`, which arrives per sample and exists nowhere in this repo. 0.31 is labelled `In range`
  as the likely reading and is documented inline as illustrative; it is also the correct Vermeulen
  result for the panel's own total T, SHBG and albumin, so it cannot move alone.
- ⚠️ **The panels are hand-typed strings with nothing enforcing them.** `StatusBadge` is an exhaustive
  `Record<ResultState, BadgeConfig>` precisely because eight states once hid behind a default and
  badged an all-clear Kit 2 with four black alarms. These panels have no such constraint, which is how
  they drifted. Each row now carries a comment naming its state and threshold; that is a convention,
  not a check.

**Not deployed at time of writing.** The live pages still carry the old labels.

## The doctor gained I12, I7 stopped alarming on its own correction, and 3.1's objective is written (2026-08-16)

### 🔴 I12: a rendition we call `scheduled` must actually be ARMED at the platform

**New invariant, and it caught a live miss on its first run: 29 of the 30 carousel posts carry
`draft: true, autoPublish: false` and will not publish.** Full account and the owner's action in
[`06_marketing/content-machine/STATE.md`](../06_marketing/content-machine/STATE.md); what belongs
here is the detector.

**It reads `draft` and `autoPublish` off the SAME per-post fetch I3 already makes**, so a new
invariant covering thirty posts added **zero** network calls. `PostState`'s `found` variant now
carries the flags; `readArmFlags` returns `null` unless both parse as genuine booleans, and `null`
routes to UNCHECKED rather than to a pass, so a change in Metricool's response shape cannot turn the
check green.

**A 72-hour horizon is the whole design.** The standing rule is that the pipeline creates drafts and
a human flips them, so failing at creation time would make I12 permanently red and therefore
ignored. Beyond 72h an unarmed post is a NOTE naming the rule; inside 72h it is a VIOLATION. **72
rather than 24 so three nightly runs get to say so** before a slot is missed, and one skipped run
cannot swallow the only warning. Nine tests, including the miss itself as a regression.

🔴 **The general defect worth carrying forward: `content_renditions.status` records OUR action, not
the platform's state.** It was written by the job that created the posts and read as a promise that
Metricool would send them. Every local check agreed with itself because they all read that one
column. Existence (I3) is a much weaker claim than armedness, and only the second is what "scheduled"
is taken to mean.

### I7 was failing on the document that FOUND the discrepancy

**`maskRetired` now treats a double-quoted span as a quotation, not a claim.** I7 had gone red on the
sentence recording the 19-vs-18 published-article correction, because it matched the count inside the
quotation marks. Both docs that wrote the correction down were alarmed on; a doc that had stayed
silent would have passed. **A detector that reads prose has to distinguish use from mention**, or the
cheapest way to keep the board green is to not write the correction down. Straight and curly double
quotes only: single quotes would swallow every apostrophe. Three tests, including the live sentence.

**Doctor is 10 of 12 PASS.** The two FAILs are I10 (Substack's pre-existing coverage red, now joined
by `x/text-post`, which has nothing queued in the next 7 days) and I12.

### Plan step 3.1's unwritten clause: the recovery objective

**The restore MECHANICS were documented on 2026-08-14 and the OBJECTIVE never was**, which is the
half of step 3.1 nobody had closed. Now in `CONTEXT.md`, read from Supabase's own documentation
rather than from an earlier doc in this repo: **RPO 24 hours** (backups are daily), **retention 7
days** on Pro, **PITR is a separate add-on at roughly $100/mo** and is not enabled.

🔴 **Supabase's daily backup does NOT include Storage objects.** Plan step 3.4 moved the published
media out of git and into the `content` bucket, so **that media is now covered by neither git nor the
database backup**. The manifest plus the renderer make it reproducible, which is a rebuild rather
than a restore, and nobody has timed it.

**Recommendation on PITR: not at 3 orders, yes before the first serious order week.** Order volume is
the trigger, not the calendar.

> ✅ **DEFERRED TO OCTOBER by Keith, 2026-08-18, and it is consistent with the recommendation rather
> than against it.** Measured the same day rather than assumed: **3 orders total, most recent
> 2026-08-04, none in the last 7 days, one in the last 30.** The volume that would justify $100/mo
> has not arrived, so this is the recommendation being followed.
>
> **What is accepted until it is ruled:** RPO stays 24 hours, so a restore can lose up to a day of
> orders, quiz results and biomarker values. At roughly one order a month that is close to nothing;
> at ten orders a week it is a day of revenue and a day of customers' health data.
>
> 🔴 **October is a BACKSTOP, not the gate, and the gate can fire first.** The trigger is volume, and
> two things built to move volume are running between now and then: the 30-day carousel run
> publishing daily to 2026-09-15, and live GEO outreach. **If they work, the trigger fires before the
> review date.** So the early exit is written down as a number rather than left as a judgement call
> made too late: **10 paid orders in any rolling 7 days, or 25 cumulative, whichever comes first.**
> Either means buy it then.
>
> **This is not a deferral of media protection.** Supabase's backup excludes Storage objects, so the
> 110 published carousel files are covered by neither git nor the database backup, and PITR would not
> change that — it is a database feature. Separate problem, still open, reproducible from the
> manifest plus the renderer but never timed.
>
> **It has a surface rather than only this note:** ClickUp [`869ek4drv`](https://app.clickup.com/t/869ek4drv),
> due 2026-10-01, on the Keith-Only Sign-offs list. A deferral recorded only in a STATE paragraph is
> the same shape as the bucket rule that sat unsigned for three days because no board carried it.

## Kit 1 scope fix shipped to four marketing pages (2026-08-15)

Decision and full verification record: [`04_products/2026-08-15-kit1-scope-marketing-pages-decision.md`](../04_products/2026-08-15-kit1-scope-marketing-pages-decision.md).
Keith's go, 2026-08-15. **CA-025 / `04_products/CONTEXT.md` §5 was live in the results engine and
contradicted by the marketing pages**, open since 2026-08-02.

- **Changed:** `app/(marketing)/kits/testosterone/page.tsx` (lead narrowed to the hormonal
  presentation, two out-of-scope symptom cards replaced, **new routing card to Kit 2**),
  `app/lp/testosterone/page.tsx` (same, and it is the **paid-ad** surface),
  `app/(marketing)/kits/page.tsx` (Kit 1 "Right for" + a mirror sentence), `app/(marketing)/page.tsx`
  (Kit 1 card copy only). 48 insertions, 9 deletions.
- **The remedy is CA-033's, applied one layer up:** split and route, delete nothing. Deleting the
  fatigue words would have relocated the problem, leaving the fatigue reader on Kit 1 with worse copy.
- ✅ **Verified in a real browser render, not asserted from the diff.** `tsc --noEmit` exit 0;
  `compliance-preflight` **0 HARD** across all four (2 REVIEW, both pre-existing homepage items,
  confirmed against the diff); all four pages 200 with the new strings present and `exhausted by 3pm`,
  `brain fog`, `low energy, low drive` and `essential for men experiencing fatigue` all gone, 0
  failures; screenshots read as images at 1400px and at a true 390px mobile viewport with
  `scrollWidth === innerWidth === 390`, so the new card adds no horizontal overflow.
  `test-quiz-routing.ts` 21/21, `test-kit-cta.ts` clean.
- 🔵 **Deliberately NOT changed: the homepage "Symptom Diagnostic" block.** It reads out of scope in
  isolation but sits under a testosterone-thresholds H2, carries no CTA and is followed by the
  three-kit grid. A code comment now says so, so a later reviewer does not "fix" it into incoherence.
- 🔜 **Flagged, not decided:** `/kits/testosterone` offers **Kit 3 (£179)** as the sideways option
  where **Kit 2 (£119)** is the complement under the 2026-07-08 complement rule. Offering only the
  dearer kit to a reader we have just sent elsewhere reads as an upsell. Kit-ladder question.
- ⚠️ **Owed: a regression guard.** CA-033 shipped 21 assertions so no fatigue combination can return
  Kit 1 again. **Prose has no equivalent, and four weeks of drift on an approved rule is what that
  absence looks like.** A string-level check is proposed in the decision doc.

## The local dev server on port 3000 returns 500 on every page (2026-08-15)

🔴 Found while verifying the Kit 1 change, and **unrelated to it**: `http://localhost:3000` returns
**500 on every route tested**, including `/about`, `/faq`, `/how-it-works` and `/blog`, none of which
the change touched. A clean `next dev` on another port serves all four at **200**, so the codebase is
fine and that particular running process is not. Recorded because somebody is looking at a broken
local site and may read it as a real fault.

## AEO groundwork: llms.txt caught up, and three pages gained structured data (2026-08-15)

✅ **DEPLOYED AND VERIFIED LIVE 2026-08-15** (commit `c03ead0`). Three independent canaries, each confirmed absent from the previous build before the push and present after, flipping together at t+140s: `"@type":"Blog"` on `/blog` (0 to 1), article links in `/llms.txt` (1 to 18), and `hello@andro-prime.com` in the homepage Organization graph (0 to 1). All four changed URLs return 200. **Live `/blog` serves 18 `BlogPosting` entries and no `cortisol-belly`**, so the draft gate behaves in production as the code predicted and the schema inherits it rather than adding a second one.

- **`public/llms.txt` now lists all 18 published articles, up from 2.** It had not been regenerated
  since 2026-07-24, so everything published after that was invisible to any model reading it.
  Grouped into five clusters with the GP-review and UK-specificity line at the top of the section.
  **Descriptions are condensed from each article's own approved `frontmatter.excerpt`**, not written
  fresh, so no unreviewed copy shipped. `compliance-preflight` 0 HARD / 1 REVIEW (the unchanged
  Clinical Boundaries paragraph, TRT inside a denial of availability), adjudicated CLEAR.
- ⚠️ **`llms.txt` has no generator and nothing keeps it in sync.** A repo-wide search for any script
  that writes it returns nothing: it is hand-maintained, which is why it drifted to 2 of 18. Every
  future publish silently re-opens the same gap.
- **`/test-selector` and `/blog` have page-specific structured data for the first time**, closing two
  items from the 2026-08-02 on-page AI-visibility review. `/test-selector`: `BreadcrumbList` +
  `WebPage`. `/blog`: `BreadcrumbList` + `Blog` with a `BlogPosting` per article, **derived from the
  article list rather than hand-listed**, so it cannot drift from what the page renders.
- **Deliberately `WebPage`/`Blog`, never `MedicalWebPage`.** The medical types assert a clinical
  service and sit outside the Phase 0 boundary. The 2026-08-02 review predicted this recommendation
  would recur and it did; the refusal stands.
- **The Organization graph in `app/layout.tsx` gained `legalName`, `logo`, `sameAs` and
  `contactPoint`**, so it reaches every page. Values sourced, not invented: `Andro Prime Ltd` and
  `hello@andro-prime.com` from `03_compliance/terms-and-conditions.md`, and the three **company**
  channels from `06_marketing/content/social-channel-setup.md`. **Keith's personal X and LinkedIn are
  excluded from the Organization entity by choice** — flag if you want them in.
- ✅ **Verified in the rendered DOM, not in source.** `tsc --noEmit` exit 0, then both pages fetched
  from a dev server and their JSON-LD parsed. **This caught a real defect before it shipped:**
  `BlogListItem.date` is a display string ("12 Oct 2026") and `datePublished` must be ISO 8601, so
  the blog schema is built from the raw article rows via `isoDate`. A source review would have passed
  it.
- 🔵 **Not a defect, recorded so it is not re-flagged:** `/blog` renders 19 `BlogPosting` entries in
  dev against 18 published rows. The extra is `cortisol-belly` (`status: draft`); production filters
  to published-only via the anon key and RLS, and `/blog/cortisol-belly` 404s live. The new schema
  inherits that gate rather than adding a second one.

## 🔴 THE HETZNER SERVER INVENTORY IN THE DOCS MATCHES NOTHING REACHABLE (2026-08-14)

**Found while starting plan step 3.5's cold archive, which is specified to live on `nc-server-01`.**
Measured by connecting, not by reading a document:

| Address | What answered | Disk |
| --- | --- | --- |
| `37.27.250.169` | **nc-server-03** | 122 GB free of 150 GB |
| `37.27.85.240` | **nc-dev-02** | 87 GB free of 150 GB |
| `188.245.220.164` | 🔴 **host key CHANGED**, not connected | unknown |
| `49.13.166.153` | connection timed out | unknown |

**There is no reachable `nc-server-01`, and the names do not resolve in DNS.** The 2026-08-13
proposal describes `nc-server-01` as a CPX31 x86 box with **320 GB** of local disk and
`nc-server-02` as CAX31 Arm64. **Neither reachable box has a 320 GB disk** and neither carries
either name. The 320 GB figure is load-bearing: it is the whole argument for putting the second
copy of unrecoverable shot media there.

**No server address exists anywhere in the repo or in either `.env`** — the only textual reference
is a comment in `drive-folders.ts`. So the inventory has never been checkable from here.

⚠️ **The host key on `188.245.220.164` has changed** (it is the address with three `known_hosts`
entries). Benign if that box was rebuilt or reimaged, and not benign otherwise. **Deliberately not
overridden**: this needs a knowing decision, not a script passing `StrictHostKeyChecking=no`.

✅ **RESOLVED the same night, by Keith's Hetzner console screenshot.** The console labels and the OS
hostnames simply disagree: **`nc-server-01` IS `37.27.250.169`**, which reports its own hostname as
`nc-server-03`, and `nc-server-02` is `37.27.85.240`, reporting `nc-dev-02`. The other two addresses
are not part of this project, so **the changed host key is not on either Andro Prime box** and is
moot here. **Both are 160 GB**, so the documented "320 GB" was the total across the pair. The cold
archive is built and proved against `37.27.250.169`.

**The durable lesson, since it will mislead the next person too: `hostname` is NOT how you confirm
which of these machines you are on.** Identify by IP.

**This is the same failure shape as the Supabase-tier correction made hours earlier** — an
infrastructure fact written into a document once, cited onward by later documents, and never
re-read from the machines it describes.

⚠️ **Unrelated but found in passing: `~/.ssh/root password.txt` holds a root password in plain
text** on this machine. Not opened. Worth moving into a password manager, particularly ahead of CQC.

## `npm test` RUNS AGAIN, D5 is answered, and the heartbeat's alarm path was broken (2026-08-14)

### `npm test` exits 0 for the first time since the errors appeared

**All twelve app test files run.** The suite is `typecheck:scripts && <12 files>`, and that
typecheck had been exiting 1 on three errors in content tooling, so **none of the twelve ever
ran** — including the results-classifier regressions, quiz routing, checkout, the bundle suites
and the Customer.io consent gate. One error was cleared on 2026-08-14 by regenerating
`lib/supabase/types.ts`; **the last two are now fixed** and `test-classifier-regressions.ts` alone
is back to 34 assertions over the clinical routing.

**This did NOT require the package move.** Plan step 2.1 bundles the fix with relocating 29
scripts to `packages/content-engine/` and updating ~25 path references, four of which are
absolute paths inside Windows scheduled tasks. The move is deferred while the carousel run is
starting; the two-line fix that delivers the actual value is done.

🔴 **Both "type errors" were live defects in the alarm path, not typing noise.** `doctor-heartbeat`
is the job that reports the nightly doctor's DEATH, and both faults sat in the escalation it
exists to deliver:

- `findOpenTask` read `t.status?.status`, the RAW ClickUp shape, on a `CuTask` that has no
  `status` property. It evaluated to `undefined` on every task, so no task ever counted as
  settled and the function returned **the first marker-named task whether or not it was closed**.
  The next time the doctor went quiet, the alarm would have been a comment on a long-resolved
  task.
- `createTask` was called with three positional arguments where it takes one object, so `listId`
  would have arrived as the whole args object and the task creation would have failed outright.

**Both were latent** — the heartbeat has run daily and never had to alarm, so neither path had
executed. **A test was green over the first one**, because its fixture supplied `{ status: {
status: 'complete' } }` cast to `CuTask`: the fixture reproduced the defect instead of catching
it, and the `as CuTask` cast is what let the compiler stop asking. Fixture corrected to the real
field with no cast.

### D5 ANSWERED: yes, a docs-only commit triggers a full build and deploy

**There is no watch path. Every push to `main` builds and deploys**, whatever it touched.
Measured rather than read off a console: three consecutive **markdown-only** commits on 2026-08-13
(`95f534d`, `f7f7aaa`, `77b7db0` — two `.md` files each, no code) each produced its own **Sentry
release**, and a release is created by the Next build uploading source maps, so a build ran for
each one.

**What it costs:** a full container build and swap for a commit that changes no served byte. **The
risk worth naming is not the waste**: it is that a docs commit deploys whatever state the build is
in. If a dependency or a config drift has broken the build since the last code change, a
documentation edit is what discovers it, in production.

**Not yet decided:** whether to configure a watch path. Coolify has no API token in this repo, so
setting one is a console action for Keith. This entry is the answer to the question, not the
change.

## Schema: `variant` on renditions, four metric columns, and the baseline re-dumped (2026-08-14)

**Three migrations applied, all for Phase 1 of the content-machine plan.** Detail and reasoning in
`06_marketing/content-machine/STATE.md`; what belongs here is the database layer.

| File | What |
| --- | --- |
| `20260814_content_renditions_variant.sql` | `variant` column; unique key becomes `(asset_id, platform, format, variant)` **`NULLS NOT DISTINCT`** |
| `20260814_content_metrics_carousel_and_video.sql` | `saves`, `reach`, `video_views`, `watch_seconds` |
| `20260814_content_channels_instagram_carousel.sql` | one registry row, `in_plan = false` pending Keith's ruling |

**`NULLS NOT DISTINCT` is the load-bearing clause and Postgres 17 is what allows it.** The default
treats nulls as distinct, so a plain four-column key would have silently weakened the old
one-row-per-`(asset, platform, format)` guarantee for the 44 renditions that carry no variant.
**Both directions were proved against the live database** inside a transaction that was then rolled
back: a duplicate null-variant insert is still refused, a second row differing only by variant is
allowed.

**`database/schema/baseline-2026-08-14.sql` was RE-DUMPED after the migrations ran** and its header
now names them, because the baseline and the migrations carry the same date and the ordering could
not otherwise be inferred from the filenames. Object counts re-verified against the live catalogue
and unchanged (29 tables, 6 views, 8 functions, 19 triggers, 11 enums, 24 policies, 29 RLS-enabled,
95 indexes), which is the expected result for column additions and a one-for-one constraint swap.
**The two schema migrations are already in the baseline; the channel-row one is not**, because a
`--schema-only` dump carries no data.

**`lib/supabase/types.ts` regenerated** and carries `variant`, `saves`, `reach`, `video_views` and
`watch_seconds`. App typecheck 0 errors. **`npm run typecheck:scripts` still fails on the same two
PRE-EXISTING `doctor-heartbeat.ts` errors** and nothing new; that is Phase 2.1's work.

## New `panel` pillar for Kit 3, and a two-minute 500 on a published article (2026-08-13)

**`lib/content/kitCTA.ts` gained a `panel` pillar** → `/kits/hormone-recovery`, Kit 3, label "See the Hormone & Recovery Check" (Keith, 2026-08-13). It existed for `how-to-read-blood-test-results`, whose CTA had nowhere correct to point: every other pillar resolves to Kit 1, Kit 2 or the waitlist, and routing whole-panel intent at a four-marker kit is the "nearly match" the map's own comment warns against. Kit 3 is what CA-031's approved mapping names for that topic and what close B on the same article already says. **Both carousel-relevant CTAs now carry UTM tagging**, which the hard-coded `ctaHref` form silently skipped.

⚠️ **Incident, self-inflicted, resolved: `/blog/how-to-read-blood-test-results` returned 500 for about two minutes.** The article body (in `blog_articles`) was switched to `pillar="panel"` **before** the code that defines that pillar had deployed, so `resolveKitCTA` threw at render. Reverted the body within the minute, confirmed 200, then re-checked **all 18 published articles at 200** before continuing. _(Count corrected 2026-08-14, from 19: `blog_articles` holds 19 rows but one, `cortisol-belly`, has been a draft since it was created on 2026-08-07 and has never been published — `published_at` is null and `updated_at` equals `created_at`. The original figure counted rows rather than published rows. This was invariant I7's only live violation.)_ **The DB write is instant and the deploy is not, so the two cannot be one step.** Correct order, used for the redo: deploy the code, verify it, then switch the content. Recorded as OBS-219.

**The obvious deploy canary was useless here and that is the reusable part.** A client-chunk fingerprint on the article page sat unchanged through **ten polls over five minutes**, because `kitCTA.ts` is server-side and never reaches a client bundle: the probe could not have moved regardless of deploy state, and ten flat readings are indistinguishable from a failed deploy. What settled it was **the new capability as its own probe** — the resolved CTA emitting `/kits/hormone-recovery?utm_source=blog&utm_medium=article&utm_campaign=how-to-read-blood-test-results`, a string only the new build can produce.

**`npm test` does not currently pass, and it did not before this session either.** Three pre-existing typecheck errors in `scripts/content-engine/doctor-heartbeat.ts` (2) and `metricool-schedule.ts` (1), identical at `cc51f1b`. The suite aborts at typecheck, so **every test after it silently does not run** — which is how a real failure in `test-kit-cta.ts` went unnoticed until it was run standalone. Worth fixing, because a suite that stops at the first gate is not a suite.

---

## Two published articles gained kit CTAs, and the repo mirror was found behind live (2026-08-12)

**Live content change, made directly to `blog_articles`** because there is no repo-to-DB push path for article bodies: `content-sync.ts` only mirrors DB state INTO the repo and issues no writes. The DB is authoritative for what a reader sees; `06_marketing/seo-ai-search/article-drafts/*.mdx` is a mirror.

**What changed**, both rows written with an audit revision (`blog_article_revisions.editor = k2-close-c-kit-cta-2026-08-12`), guarded so a non-matching string would have been a no-op rather than a partial write:

- **`free-androgen-index`**: its existing closing kit ask wrapped in `<InlineKitCTA ctaHref="/kits/testosterone">`. Destination unchanged, it was already correct.
- **`how-to-read-blood-test-results`**: closing **test-selector** ask replaced with a Kit 3 CTA (`/kits/hormone-recovery`, nine markers, no price). The selector link was **moved up** into the "Which test should you take?" section, because that CTA was the article's only `/test-selector/` link and deleting it outright would have removed the route.

Driven by **K2 on CA-034**: close C of the carousel run lands on these articles, and the run now tests one offer at three distances. **10 of 10 carousel articles now carry the component**, verified by query, and **both pages were checked as rendered images** at the CTA, not as stripped HTML.

✅ **Mirror re-synced and clean. An earlier version of this entry overstated the problem and is corrected here.**

**The git mirror is `frontend/content/blog/*.mdx`, and it has a keeper: `scripts/content-engine/sync-mirror.ts`.** DB is the source of truth, the script is body-only (frontmatter kept verbatim), it writes only on a genuine difference, and it runs after the orchestrator tick. Before tonight **all published articles were in sync**. *(Count corrected 2026-08-15: this line read "all 19 published articles"; the database has **18** rows at `status = 'published'` and the mirror holds 18 `.mdx` files. The 19th is `cortisol-belly`, which is a **draft** and shows on `/blog` in dev only, because `SHOW_DRAFTS` in `lib/blog.ts` is `NODE_ENV !== 'production'`.)* The two DB writes above put exactly those two files out of sync; `npx tsx scripts/content-engine/sync-mirror.ts` restored them and a re-run reports **"mirror already in sync"**.

**What was actually stale is a different directory.** `06_marketing/seo-ai-search/article-drafts/free-androgen-index.mdx` still carried the pre-K1 FAI wording. That is the **drafting workspace**, not the mirror: nothing syncs it, it is not slug-aligned (pillar-named files, a dated `-reopt-2026-07-30` variant, two `myth-of-normal-range` copies, no `why-am-i-always-tired`), and it is not expected to track live. **So the packet's live-versus-mirror caveat was already discharged by tooling I had not found**, and the "eight undiffed articles" risk recorded earlier did not exist.

⚠️ **The residual is smaller and real: `article-drafts/` is a trap for anyone drafting derivatives.** It reads like a per-article source, it is where a search for `<slug>.mdx` lands first, and its copies can be arbitrarily far behind live. That is exactly how the pre-K1 FAI wording was picked up here. **Derivative work should source `frontend/content/blog/<slug>.mdx`**, which the carousel pre-flight correctly did (`--source frontend/content/blog/<slug>.mdx`).

**Two schema facts worth keeping**, both contradicting the CA-034 packet: `blog_articles` has **no `has_kit_cta` column** (the real test is whether `body` contains `InlineKitCTA`), and **`current_revision_id` is stale on both rows**, pointing at revisions whose body matches neither the live body nor the newest revision. The 2026-08-10 voice pass also inserted revisions without repointing it, so this is existing practice rather than damage introduced here, but the pointer cannot currently be trusted to identify the live body.

**And one process fact, learned the slow way.** There was no need to hand-write the mirror update: `sync-mirror.ts` does it, correctly and body-only. It was not found because the search went looking for a repo-to-DB **push** path (which genuinely does not exist, and `content-sync.ts` says so loudly) and stopped there, rather than for a DB-to-repo **export**. **Both directions exist as scripts and they are not the same question.** `import-blog-to-db.ts` and `export-blog-from-db.ts` are the other two.

---

## Two live copy defects the carousel pre-flight found in the app, both fixed and verified (2026-08-12)

Neither was in the carousel. Both were in the product the carousel points at, and both were found only because the per-post pass followed the destination rather than stopping at the slide.

- **The test-selector routed fatigue readers to a testosterone-only kit.** Q1 option (a) read *"I am knackered, my drive has gone, or I just do not feel like myself anymore"*, which is two presentations in one option, so a brain fog, B12 or tiredness reader picked it, answered desk-based on Q2, and `getResult` returned **Kit 1**. That is what **CA-025** forbids. Fixed by splitting the option, not rewriting the map: (a) narrowed to the hormonal presentation, new stored value `d` for the fatigue picture routing to **Kit 2**, every existing branch untouched. **Approved as CA-033** (Keith, conditional on this fix; Ewa not required because the remedy removes the out-of-scope outcome rather than accepting it). `scripts/test-quiz-routing.ts` added, 21 assertions, wired into `npm test`; the map had **zero** coverage before. **Verified live** on build `vgLPXfPWVcFM2ESumkN3o`, on the plain URL as well as a cache-busted one.
- **The Kit 1 landing page graded the one marker the engine refuses to grade.** It rendered FAI as `36.9` with a **`Borderline`** badge, beside Total T `Borderline` and SHBG `Normal`, on a value just above the lab floor of 35.0, so it read as a near-miss finding. `classifier.ts:295` maps FAI to `fai-reported`, whose copy is *"Reported for reference, not interpreted"*, returning no CTA and excluded from vetoing an all-clear. Badge → **`Not interpreted`** (grey, dashed), subtitle "Bioavailable testosterone ratio" → "Ratio of total T to SHBG". **Keith ruled FAI stays on the panel** (the lab returns it, the customer receives it, we do not interpret it), so **nothing was deleted**. **Verified live**: new strings present, old subtitle absent, on the served page.

⚠️ **`/test-selector` carries `cache-control: s-maxage=31536000`, a one-year edge cache.** It behaved on both deploys, but on a page whose copy changes for compliance reasons that header is a standing risk. Not actioned.

⚠️ **Deploy verification lesson, recorded because it cost three attempts.** A build-ID canary reported a false positive: the baseline had gone stale behind an intervening push, so it flipped for the *previous* commit's build. Only the copy assertion beside it caught that. **Watch the changed string, not a build fingerprint** — and an earlier attempt watched a content-hashed chunk filename, which cannot change when a commit touches no frontend source, so it could only ever have reported failure. (`OBS-212`.)

---

## `/go` link-in-bio grid for the carousel run: LIVE (2026-08-11)

Attribution surface for the 30-day Instagram carousel run (design + metrics in `06_marketing/STATE.md`; copy approved as CA-031). **Deployed and verified on the real deploy**, commit `c69dff5`.

**Verified live, not inferred from the push:** `/go` serves 200; the served HTML carries `<meta name="robots" content="noindex, nofollow">`; `/go/start` 307s to `/test-selector` tagged `utm_term=unmatched`; `/go/d05` 307s to **`/kits/energy-recovery`** tagged `close-B`, which is `why-am-i-always-tired` routing to Kit 2 rather than Kit 1, so the CA-025 scoping rule holds in production and not only in the doc; `/go/d06` 307s to `/blog/brain-fog` tagged `close-C`. Rendered at a true 390px mobile viewport with `document.scrollWidth === window.innerWidth === 390`.

**BOTH DONE (Keith, 2026-08-12):** `CAROUSEL_RUN_START` is set in Coolify to **`2026-08-17T12:00:00Z`**, buildtime and runtime both ticked, and the `keith.antony.ai` Instagram bio is pointed at `/go` and tested by Keith.

🔵 **RESOLVED 2026-08-15: Ewa HAS signed off the 30 posts. The sentence below is stale and is kept as the record of the risk as it stood on 2026-08-12.** The posts were approved as **CA-034** (7 of 7 ruled) and the captions as **CA-035**, both in the register and both `approved` on the board. Do not read the line below as a live blocker.

🔴 **THE RUN START MOVED IN, from 2026-09-01 to 2026-08-17 (Keith, 2026-08-12).** That is **five days** from the decision, not twenty. It compressed everything still owed before day 1, and the binding one was not code: **Ewa had not signed off the 30 posts.** CA-031 and CA-032 approved the close templates and the headline rows; neither covers the posts. Nothing may ship without that signature, and it now has a five-day window.

⚠️ **Two consequences, neither obvious from the page.**

1. **The run start is now a posting constraint, not just a config value.** `visiblePosts()` reveals day 1 at the anchor instant and each later day exactly 24h on, so **nothing may be posted before 2026-08-17 12:00 UTC** (13:00 BST), and each daily post should go out at or after that time of day. Post earlier and the tile a reader taps through for does not exist yet.
   ✅ **HONOURED IN THE SCHEDULE, 2026-08-13.** All 30 Metricool posts are set to **13:00 Europe/London**, exactly the anchor instant on day 1 and +24h thereafter. This constraint was load-bearing in practice, not just on paper: Keith asked for the run to start "after 12 a.m." on the 17th, which would have put **every** post 12 hours ahead of its own tile for the whole run. It was reconciled onto the anchor rather than by moving `CAROUSEL_RUN_START`. **If the anchor ever moves, `06_marketing/content/instagram/carousel-prototype/schedule.js` moves with it** — its `--check` asserts day 1 is 2026-08-17 13:00 London and fails the build of the schedule otherwise, so the two cannot drift apart silently.
2. **The live page cannot confirm the variable arrived**, so do not read it as verification. `/go` currently serves *"Nothing posted yet. In the meantime, three questions will point you at the right test."* with a `/go/start` CTA, and that is the identical output for BOTH `RUN_START_ISO` unset AND set to a future date, because `visiblePosts()` returns `[]` on either. The two states are indistinguishable from outside. It resolves either after a deploy plus a check past 2026-08-17, or by reading the running container's environment. The empty state is a designed fallback with a working CTA, not a dead end, which softens the per-post pre-flight's C1 finding without clearing it.

- **`app/go/page.tsx`** renders one tile per posted day, newest first, mirroring how the Instagram grid reads. **`app/go/[slug]/route.ts`** records the click server-side then 307s to that post's destination with UTMs stamped (`utm_content` = post, `utm_term` = close). **`lib/bio-grid.ts`** holds the ten topics, the three closes and the rotation.
- **The bio link is set ONCE and never rotated, and that is the whole point.** Rotating it daily was the first design and it is wrong: Instagram keeps surfacing a post for days, so a day-3 post collects clicks on day 8 when a rotated link points at a different close. Late clicks would attribute to the wrong close, and the later the click the more wrong. Each post instead owns a permanent `/go/<slug>`.
- **Two new server-side events**, `bio_grid_view` and `bio_tile_click`. Server-side deliberately: the traffic arrives in Instagram's in-app browser, the worst place to depend on client JS, and a tile click is a redirect that must be recorded before the user leaves. The pair separates "the post was interesting" from "the offer was interesting".
- **Titles are read from `blog_articles` via `getAllArticles()`, never from the repo MDX**, and that decision was load-bearing rather than tidy. The MDX mirror still carries the pre-correction Free Androgen Index headline that the 2026-07-30 ruling overturned, so hardcoding titles would have put a retracted framing on a live page. Reading through means a re-titled article corrects itself.
- **`noindex` via page metadata, and deliberately NOT added to `robots.ts` disallow.** A disallowed page cannot be crawled, so the crawler never reads the noindex and the page can still be indexed from an inbound link. The two are mutually exclusive; this picks the one that works. It is absent from `app/sitemap.ts` already, which is an explicit allowlist.
- **An unknown slug redirects to the quiz rather than 404ing**, and records the miss. A bio-link tap that dead-ends is a lost visitor; the quiz is the ratified cold-traffic destination anyway, so the failure degrades to the default instead of to nothing, and a broken tile shows in the data rather than as silence.
- **Verified: `tsc --noEmit` clean, `compliance-preflight` 0 HARD / 0 REVIEW, and rendered at a true 390px mobile viewport** with `document.scrollWidth === window.innerWidth === 390`, so there is no horizontal overflow hiding behind `body{overflow-x:hidden}`. The rotation was read off the render: closes cycle A/B/C up the page with no topic repeating.
- **Screenshot method note, because it produced a false defect.** `chrome --headless --window-size=W,H --screenshot` does **not** set the layout viewport: it lays out wider and crops to W, so a narrow capture shows clipped text that is not clipped in a real browser. The first `/go` capture looked broken; an existing known-good page clipped identically at the same width, which is what identified the tool rather than the page. Use `Emulation.setDeviceMetricsOverride` over CDP (Node 24 has a global `WebSocket`, so no npm dependency is needed).
- **~~OWED before the run~~ DONE 2026-08-12:** `CAROUSEL_RUN_START` is set in Coolify to `2026-08-17T12:00:00Z` and the Instagram bio points at `/go`. Unset still renders the empty state by design rather than exposing the unposted schedule, which is why the served page cannot distinguish "set to a future date" from "never set". See the run-start block near the top of this file for the posting constraint that date creates.
- **Flagged, Keith's call:** the site-wide cookie banner covers the top two tiles on first visit. Everywhere else that is cosmetic; here the top tile is the newest post, which is the single thing most visitors arrive looking for.

## The `/waitlist` page was still a pre-launch page, months after launch (2026-08-07)

Found by Keith opening the destination of a new article's call-to-action. **`/waitlist` told every
visitor the brand was "launching soon" and listed Kit 1, Kit 2 and Kit 3 under a "What's coming"
heading, at the exact prices they are buyable for today.** Verified against reality before touching
anything: `/kits` serves all three at £99 / £119 / £179, HTTP 200, with live buy paths.

**Four live articles funnel readers into that page** and inherited the claim:
`cholesterol-test`, `liver-function-blood-test`, `signs-of-stress-in-men` and `thyroid-test`, plus the
`cortisol-belly` draft now with Ewa. They route via the `metabolic` / `liver` / `stress` / `thyroid`
pillars in `lib/content/kitCTA.ts`, which hold at email capture **by design** because no live product
matches those intents. **The routing was correct and is unchanged; the page's premise was what had
gone stale.**

**Fixed in `app/(marketing)/waitlist/page.tsx` and `components/marketing/WaitlistForm.tsx`:** the hero
now leads with "The panel you want isn't on the list yet" and states that three checks are available
now; the panel is relabelled **"Available now"** with each kit linked to its own page and a line
saying these three ship today; the form success message points at `/kits` instead of promising to
email when the brand launches; the page metadata, the "Early Access" badge and the "Early access"
trust item are all corrected.

- **No future product is named.** Kit 3 Plus and Kit 5 Thyroid are next in the locked sequence but
  their May timings have passed, and **Kit 6 Cortisol is parked** pending Vitall on dried-blood-spot
  viability. Naming any of them would have recreated the same failure one product later. The page now
  promises a category, not a roadmap.
- **Consent copy changed, flagged deliberately.** The opt-in label moved from "Email me launch updates
  and early-access offers" to "Email me when new panels launch, and occasional offers." Same
  processing purpose, no scope change, but it is the record of what subscribers agree to and is worth
  a solicitor's eye at the next review.
- **Verified on a real render, not a typecheck.** Screenshotted the served page on the dev server.
  **The screenshot caught two stale claims a grep had missed** (the "EARLY ACCESS" trust badge and the
  consent line), which were then fixed and re-shot. Final rendered sweep: zero hits on every stale
  phrase, zero em dashes, all three kit links present.

**The wider lesson, and it is not fixed by this change.** The article's own call-to-action wording was
correctly scoped to the one unlaunched thing and passed `compliance-preflight` cleanly. The pass
checks the copy under review; nothing checks the page that copy links to. **A shared destination is
the highest-leverage place for a stale claim to hide, because nothing that links to it changes when it
goes stale.** Recorded in the task-observer log as an extension needed to the availability check.

## Results engine: four defects closed, two new bands built (2026-08-07)

Triggered by Vitall confirming their per-assay reference ranges on 2026-08-06, which made several
long-standing gaps visible for the first time. Commits `56f3a5e`, `1ce4850`, `56b8ff9`. Full
reconciliation: [`05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md`](../05_partners/labs/vitall/2026-08-06-analytes-reconciliation.md).

**1. Free Androgen Index was asserting normality for every value.** Ewa's ruling is report-only, and that
was implemented by leaving FAI out of the classifier, so it fell to a `default` branch that badged the card
"Optimal", headed its footer "Keep it up", and told the customer "within the normal range / no action is
needed" for any number, including below the lab's floor of 35.0, while the bar rendered it red. Those
strings also print on the **CSV export and the GP handoff sheet**. Now a dedicated `fai-reported` state:
no badge verdict, no traffic-light bar, no CTA. Wording approved by Ewa 2026-08-07 ("fine for now").

**2. An all-clear result badged every marker "Action Needed".** The badge was a switch with a default, and
eight of twenty-eight states had no case; five of them mean the result is fine. A clean Kit 2, the most
common result we will ship, showed four black alarms on four in-range markers. Now an exhaustive
`Record<ResultState, BadgeConfig>`, so a new state cannot be added without deciding its badge, verified by
adding a throwaway state and confirming the build fails. Runtime fallback now fails quiet, not loud.

**3. Two new GP-routed upper bands** (Ewa, 2026-08-07): testosterone `> 29`, vitamin D `> 250`. See
`04_products/STATE.md` for her ruling.

**4. The bands were not a classifier-only change, and this is the one that would have hurt.**
`isTestosteroneAllClear()` and the vitamin D leg of `results_all_clear` had no upper bound either, and both
feed **Customer.io**. A man at 35 nmol/L would have been GP-referred on his dashboard while simultaneously
being enrolled in **seq-03c, the reassurance sequence for normal results**. Both closed here.

Also: SHBG fallback moved off a generic 17-55 onto Vitall's 20.6-76.7; Active B12's `>37.5` reference range
now renders on the card (it was the only marker showing none, because the display keyed on the upper bound
alone); testosterone card copy corrected to the real range; the unit guard now folds micro-sign variants;
an unmapped marker warns instead of being silently dropped; all fixture ranges aligned to the real assay,
including B12's invented upper bound, which is what hid defect 2 from QA.

**Regression coverage went from 26 assertions to 34**, pinning both new cut-points, the GP routing and the
Customer.io signal. `npm test` still cannot run end to end: it dies at its first step, `typecheck:scripts`,
on three PRE-EXISTING errors in content-engine scripts (`doctor-heartbeat.ts` x2, `metricool-schedule.ts`)
that have nothing to do with the results engine. **The results suites had to be invoked directly.** Worth
fixing on its own: the guard protecting the results engine sits behind an unrelated broken typecheck.

**Found in passing and fixed:** the results card still told a normal-testosterone customer the Daily Stack
provides "30mg of elemental zinc". Ewa cut it to **25 mg** on 2026-08-02 and `daily-stack.md` records that
as applied to "all three site surfaces the same day". The results engine was not one of the three. The LP
was already correct.

## DEPLOYED 2026-08-04: `order_ref`, `is_test`, one base-URL helper

The three items left open by the £9900 pass, plus the base-URL duplication.
**Shipped in commit `b85b810` and VERIFIED LIVE 2026-08-04**: `GET /order/confirmed`
returns the new order-reference block ("Your order reference", "confirmation email we have
just sent"), neither of which existed anywhere in the codebase before this change.
Migrations were applied to prod Supabase ahead of the deploy, which is the required order:
the code selects `order_seq` on the kit-order insert, so shipping it against a table
without the column would have broken order creation.

**The live Customer.io template was swapped after the deploy and is done** (below), so the
chain is complete end to end: a kit purchase now emits `order_ref`, the confirmation email
renders it, and the customer can find it again on `/order/confirmed`, on `/account`, or by
quoting it to support. Nothing on this item is outstanding except seeing one real purchase
through.

**Verification note worth keeping: the Sentry releases endpoint is not a deploy signal.**
It still showed the previous commit nine minutes after the new build was demonstrably
serving, because a release row is created by the sourcemap-upload step, not by the deploy.
Use a two-sided page canary against the live URL; treat the release list as evidence about
sourcemaps only.

### `order_ref`: customer-facing order reference, BUILT

Built to `docs/2026-08-04-customer-facing-order-reference-spec.md` (option B, our own
sequence, not Vitall's number).

| Piece | Where |
| --- | --- |
| `kit_orders.order_seq` (identity, live base 10000) | migration `20260804_kit_orders_order_seq.sql` |
| `AP-{order_seq}` rendering + `parseOrderRef` for support lookup | `frontend/lib/orders/orderRef.ts` |
| `order_ref` on the `purchase` event | `app/api/webhooks/stripe/route.ts` (kit branch) |
| `Order ref: {{ event.order_ref \| default: event.order_id }}` | `email-templates/html/transactional-t01-order-confirmed.html:46` (spec) **and CIO template 38** (live) |
| Reference shown on `/order/confirmed` | `app/(marketing)/order/confirmed/page.tsx` + `lib/orders/getOrderRefForCheckoutSession.ts` |
| Reference shown per order on `/account` | `lib/account/getAccountData.ts` + `app/(app)/account/page.tsx` |
| Support lookup by reference / email / Vitall id | `lib/admin/findOrders.ts` + `app/admin/dashboard/page.tsx` |

`order_id` (the UUID) is still emitted: it is the join key for downstream events and
Vitall's `partnerOrderId`. It is just no longer the thing a human is asked to read out.

**Support lookup, the other half of the reference.** `AP-10042` is only worth anything if
whoever the customer quotes it to can find the order, and there was no order-search surface
anywhere. `/admin/dashboard` now has one. It classifies the query by shape rather than
making support choose a field: digits with an optional `AP` prefix are a reference (`AP-10042`,
`ap 10042`, `10042` all parse), an `@` means email, anything else is treated as a Vitall order
id for when the conversation is with Ben rather than the customer. It runs on the service-role
client, because support is looking up somebody else's order by definition and RLS would return
nothing. Test orders are badged in the results so a process test is never mistaken for a sale.

**Found while building it: `/auth/post-checkout` dropped `session_id` on the way back.**
It redirected to `failureUrl`, which carries no query. A first-time buyer always goes
through that route, so the confirmation page could never have resolved a reference for the
one customer who most needs it. It now preserves `session_id` and stamps `post_checkout=1`,
and the page treats that stamp as "sign-in already attempted" so the pair cannot loop.

**Live-DB state after backfill** (verified by query, not inference):

| `order_seq` | `vitall_order_id` | `is_test` |
| --- | --- | --- |
| 1 | 322942444 | true |
| 2 | 322942529 | true |
| 3 | 322947256 | true |

Live orders start at **AP-10000**, above the test rows, so no real customer is handed a
reference that reads like an internal test. Verified on the sequence itself
(`last_value 10000, is_called false`), not assumed from the migration.

**The migration did not work as first written, and the fix is worth keeping in mind for any
future identity backfill.** `add column ... generated by default as identity` hands the
existing rows `1..N` immediately, in arbitrary order, so the backfill that then assigns the
same range collides against `kit_orders_order_seq_key`: Postgres checks a unique index row by
row, not at end of statement, and the first attempt failed on `duplicate key value ... Key
(order_seq)=(1) already exists`. It now runs in two passes, parking the values in the negative
range to free `1..N` first. The file was edited rather than superseded because the failed
attempt rolled back, so no version of it had ever run.

Second sharp edge, not in the spec: `restart with 10000` moves the sequence's CURRENT value
but leaves its `start_value` at 1, so a later bare `restart` would have dropped straight back
into the test range. The floor is moved by its own migration,
`20260804_kit_orders_order_seq_start_floor.sql`, which runs next in filename order.
Verified in prod: `start_value` is 10000.

### DONE 2026-08-04, after the deploy: the live Customer.io template

The live T-01 content lives in CIO (campaign 11 → action 82 → template 38) and is what
customers actually receive; the repo HTML is only the spec. Template 38 now reads:

```liquid
Order ref: {{ event.order_ref | default: event.order_id }}
```

**The sequence was deliberate: code deployed first (`b85b810`), template swapped second.**
Swapping first would have left `event.order_ref` undefined on any order placed in between.

**And it is a `default:` fallback rather than a bare swap**, in both CIO and the repo HTML,
so the one bad outcome is unreachable: if `order_ref` is ever missing or empty the line
renders the UUID, which is exactly the behaviour that shipped for months, instead of "Order
ref:" followed by nothing on a receipt. `order_seq` is an identity column so it should never
be empty; the fallback costs nothing and removes the need to be right about that.

Verified after the write, not assumed: body length is the original 5576 plus exactly the 27
characters added, and the tag counts (14 paragraphs, 3 tables, 5 `<td>`, 4 Liquid outputs, 9
Liquid tags), the merge-field order, and the subject all match the pre-edit template.

**Still worth one real purchase** to see an `AP-1000x` land in an inbox end to end. Nothing
is blocked on it, and the fallback means a bad outcome degrades to the old UUID rather than
to a blank.

### `is_test`: internal orders no longer count as sales, BUILT

`kit_orders.is_test` (migration `20260804_kit_orders_is_test.sql`), set true on the three
process-test rows. Every KPI view that counts kit orders now filters it out:
`v_gate_tracker.total_kits_sold`, `v_weekly_kit_sales`, `v_kit_pipeline`, and
`v_result_to_supplement_conversion` (joined through `lab_results.order_id`).
`v_gate_tracker.total_kits_sold` **went 2 → 0**, which is the true Gate 0A count.

Nothing in the app writes `is_test`; it is set by hand. Any NEW view over `kit_orders` has
to carry the filter; the reminder is in the header of `database/views/pipeline_overview.sql`.

### Base-URL helper: nine copies, now one, BUILT

`process.env.NEXT_PUBLIC_SITE_URL ?? 'https://andro-prime.com'` was pasted into nine
modules with three different spellings of the fallback (`??`, `||`, and one
`http://localhost:3000`). Now `frontend/lib/site-url.ts` exports `SITE_URL` (trailing slash
stripped) and `siteUrl(path)`.

Three callers deliberately did **not** collapse, and each now carries a comment saying why:

- `app/auth/callback/route.ts` and `lib/auth/actions.ts` resolve the origin from the
  request first (x-forwarded-host / Origin) so preview deployments work; they only use
  `SITE_URL` as the fallback.
- `app/layout.tsx`'s `BASE_URL` stays the hard-coded production origin because schema.org
  `@id` values are stable global identifiers and must not change on a preview host.
  `metadataBase` on the same file is the one that follows `SITE_URL`.

Out of scope and left alone: `scripts/content-engine/*` (different precedence,
`CONTENT_ENGINE_BASE_URL` first, and its own env loader) and the deprecated
`lib/activate/sendActivationLink.ts`.

### The `/order/confirmed` hydration error: the previous diagnosis was wrong

Pulled the actual events from Sentry rather than reasoning from the code. `JAVASCRIPT-NEXTJS-7`
is **39 occurrences spread across the whole site**, not a `/order/confirmed` problem:

| Transaction | Count |
| --- | --- |
| `/blog/preview/:slug` | 14 |
| `/blog` | 11 |
| `/blog/:slug` | 6 |
| `/kits/*` | 6 |
| `/checkout/details` | 1 |
| `/order/confirmed` | **1** |

**So the auth-branch theory is falsified.** `/blog` and `/kits/testosterone` have no auth
branch and no client state, and they fail identically to the pages that have both. Every
event is Chrome (148 then 150) on Windows with no user attached, and 14 of them are on
`/blog/preview/*`, a Keith-only route. That is the documented browser-extension case:
something writes attributes onto the document element before React hydrates.

**Done:** `suppressHydrationWarning` on `<html>` and `<body>` in `app/layout.tsx`. React
only suppresses one level deep, so this silences the extension's attributes without hiding
a genuine mismatch inside any page. The previously-proposed "small redesign of
/order/confirmed" is **not** the fix and was not done.

**CONFIRMED by Keith 2026-08-04.** He loaded `/blog` in an incognito window with extensions
off. The page rendered normally **and Sentry recorded no new `JAVASCRIPT-NEXTJS-7` event**;
its last occurrence is still `2026-08-04T19:05:11Z`, which predates both the mitigation
deploy and the incognito load. The extension diagnosis stands and the auth-branch theory is
dead. No engineering work follows.

The Sentry check was the part that mattered: React recovers from a hydration mismatch, so
the page looks identical whether or not one fired, and a screenshot alone could not have
settled it.

**One caveat for the next reader, because it changes what this issue's silence means.**
`suppressHydrationWarning` on `<html>`/`<body>` means attribute-level mismatches injected
before hydration no longer report at all, so Sentry going quiet on this issue is now the
expected state regardless of cause and is no longer evidence of anything. React suppresses
only one level deep, so a genuine mismatch INSIDE a page would still surface, as a new
issue rather than as this one.

**Optional tidy-up, BLOCKED ON TOKEN SCOPE, needs Keith:** resolving `JAVASCRIPT-NEXTJS-7`
so it drops out of the unresolved count. Attempted 2026-08-04 and refused:
`PUT /api/0/organizations/andro-prime/issues/120214399/` with `{"status":"resolved"}`
returns `403 You do not have permission to perform this action`, and reading the issue back
confirms it is still `unresolved`. **The `SENTRY_AUTH_TOKEN` in `frontend/.env.local` is
read-only.** It carries issue-READ scope; resolving, ignoring, assigning and commenting all
need `event:write` / `issue:write`. Either click resolve in the dashboard, or issue a
write-scoped token if this should be automatable.

Gates: `tsc` clean, `npm run build` exit 0, `npm test` exit 0 (0 failed across all suites).

---

## FIXED 2026-08-04: every kit order confirmation told the customer they had been charged £9900

Found by Keith reading his own confirmation email from the Kit 1 process test. `Amount: £9900`
for a £99 kit. Kit 2 would have read £11900, Kit 3 £17900.

**Cause.** Stripe holds money in integer pence. The t01 template renders the value literally:

```html
email-templates/html/transactional-t01-order-confirmed.html:47
  Amount: &pound;{{ event.amount }}
```

`app/api/webhooks/stripe/route.ts` has a `formatGbp()` helper for exactly this, and its own
comment says *"Templates render `£{{ amount }}`"*. **The kit-purchase emit was the only one of
four that failed to call it:**

| Line | Event | Before |
| --- | --- | --- |
| ~322 | kit purchase | `amount: session.amount_total` ← **raw pence** |
| ~377 | supplement purchase | `formatGbp(...)` ✅ |
| ~414 | invoice paid | `formatGbp(...)` ✅ |
| ~447 | invoice due | `formatGbp(...)` ✅ |

**Fixed at the emit, deliberately not at the template.** The template is shared with the three
sibling emails that already pass a formatted value; changing it would have broken those. The
emit now calls `formatGbp()` and carries a comment saying why it is required.

Gates: `tsc` clean, `npm run build` clean.

**Reach:** every kit order confirmation sent to date. In practice that is the three internal test
orders, since no external customer has bought yet, so no real customer saw it. It would have hit
the first one who did.

### Raised in the same pass, specced not built. ALL THREE NOW BUILT 2026-08-04, see the entry at the top of this file

- **`order_ref`, a customer-facing order reference.** The same email shows
  `Order ref: 1b429c90-8a80-4c7e-85fb-5873660489fd`, a raw UUID, which is unusable down a phone.
  Full spec with options considered: `docs/2026-08-04-customer-facing-order-reference-spec.md`.
  Recommendation is our own `AP-10042`-style sequence, **not** Vitall's order number: theirs is
  not yet written when the confirmation email fires (the dispatch is a separate fire-and-forget
  call made after the emit), and the lab is expected to change to TDL in ~18 months.
- **`/order/confirmed` shows the customer no reference at all.** Verified: the page reads
  `session_id` from the query string and renders nothing from it. Close the email and there is no
  way to find your order.
- **Still no `is_test` flag in the schema.** Three internal test orders now sit in `kit_orders`
  (`322942444` cancelled, `322942529`, `322947256`) with nothing distinguishing them from sales.

---

## P0 FIXED 2026-08-04: a prefetched GET logout was signing customers out seconds after checkout

**Found by Keith running a real Kit 1 purchase through live checkout.** He was thrown to `/auth/login?error=Invalid login credentials`, then the dashboard white-screened on the password banner. Both symptoms, one root cause.

**Root cause.** `app/auth/logout/route.ts` was a **GET** handler that called `signOut()` unconditionally, linked from `Nav.tsx` and `AppPlaceholder.tsx` as an ordinary `<Link>`. Next.js prefetches links that enter the viewport, and the app nav is `fixed`, so the Log Out link was permanently visible and permanently prefetched. **The browser signed the user out with no click at all.**

Evidence, not inference:

- **Supabase auth log:** login `15:43:15` (magic link, post-checkout) → `logout` `15:43:41`, 26 seconds later, user-initiated: no. Then `POST /token grant_type=password` → `400 invalid_credentials` at `15:46:42`.
- **Sentry `JAVASCRIPT-NEXTJS-V`** breadcrumbs show `?_rsc=` prefetch GETs to the sibling nav links (`/subscriptions`, `/account`) plus a third `[Filtered]` one. The app nav has exactly three links; the third is Log Out.
- **No `PUT /user` anywhere in the auth log**, so the password the customer "set" was never written. `auth.users.updated_at` confirms it.

**Second symptom, same cause.** With the session dead, the banner's X (dismiss) also white-screened. Both dashboard actions call `revalidatePath('/results-dashboard')`, which re-renders `app/(app)/layout.tsx`, which calls `requireAuthenticatedUser()`, which calls `redirect()`. `redirect()` throws, and **the app had zero `error.tsx` files**, so it fell through to `global-error.tsx`: an unstyled page with no branding and no way back. React surfaced it as *"An unexpected response was received from the server."*

**Fixed (7 files):**

| File | Change |
| --- | --- |
| `app/auth/logout/route.ts` | `GET` → **`POST`**, redirect 303. No GET export remains. Carries a do-not-reintroduce note |
| `components/shared/Nav.tsx` | Log Out is a POST form + button (desktop + mobile); other CTAs stay links |
| `components/app/AppPlaceholder.tsx` | Same; dropped the now-unused `Link` import |
| `app/(app)/error.tsx` | **NEW.** Branded boundary for the signed-in app; leads with "Sign in again"; surfaces the Sentry digest as a support reference |
| `app/error.tsx` | **NEW.** Root boundary for the marketing site |
| `lib/dashboard/actions.ts` | Both actions check the session **before** `revalidatePath`, returning "Your session has expired" instead of throwing |
| `components/app/PasswordBanner.tsx` | Dismiss awaits properly (the new return type broke `startTransition`'s void contract) |

Gates: `tsc` clean, `npm run build` clean, `npm test` green, compliance scan **0 HARD / 0 REVIEW** on both new customer-facing pages. Verified no `href="/auth/logout"` remains and the route exports only `POST`.

**The general rule, worth not relearning:** a GET must never destroy state. Prefetch is only the first thing to trip it; link scanners, antivirus and browser preload all issue speculative GETs.

### Still open from the same session

- ~~**`/order/confirmed` hydration mismatch.** The page branches on `isLoggedIn` (lines 96, 99) while the post-checkout flow changes that state underneath it.~~ **SUPERSEDED 2026-08-04.** This diagnosis was wrong, and it was wrong because it reasoned from the code instead of reading the events. Only 1 of 39 occurrences is on `/order/confirmed`; the rest are spread over `/blog`, `/blog/preview/*` and `/kits/*`, which have no auth branch at all. See the entry at the top of this file for the tag breakdown and the actual fix.
- **Sentry read access is now available to tooling.** `SENTRY_AUTH_TOKEN` in `.env.local` was upload-only (`project:releases`); Keith replaced it with one carrying issue-read scope, so production exceptions can be pulled directly. Note it is org-scoped: use `/api/0/organizations/{org}/issues/{id}/events/latest/`, not the project-less path, which 404s.

---

## RESOLVED (2026-08-02, later the same day): the four strings below are fixed in the working tree, and one of the four was never a finding

Ewa signed the wording packet and Keith ruled the two business-status items, both by
email the same evening. **Shipped in commit `965b775` and VERIFIED LIVE 2026-08-02**,
two-sided across three pages: every old string absent AND every new string present on
`/`, `/how-it-works` and `/supplements/daily-stack`, with the deliberately-kept
"designed your report" heading confirmed still serving.

| String | Ruling | Now reads |
| --- | --- | --- |
| `EFSA Regulated` (Footer, every page) | Keith, 2026-08-02 | `EFSA-Approved Claims` |
| `GP-designed report` (homepage `HowTo` JSON-LD :45) | Keith: prohibited | "recommendation logic approved by a GMC-registered GP" |
| `GP-designed report` (homepage body :324) | Keith: prohibited | as above |
| `A real doctor designed your report.` (how-it-works) | **NOT a finding — left alone** | unchanged |

**The fourth row is the important one, and it closes a contradiction this file
created.** The entry below flagged that heading as non-compliant. The Ewa packet,
amended the same day, recorded the opposite: the 2026-07-07 ruling in
`clinical-governance-copy-corrections.md:141` approves "designed" as system-authorship
framing, and by then **two** independent site reviews had already re-flagged it in
error. This file made it three. **Keith's ruling settles it: "designed" as
system-authorship is fine; `GP-designed report` — the compound naming the GP as the
report's designer — is not.** Do not re-flag the heading.

**Also fixed in the same pass, from the Ewa packet (CA-030):** the "treated men" claim
about her (she does not treat, she sees — a live factual misstatement about a named
GP), her TRT/Harley Street credential line on two pages, the `GMC Registered Practice`
badge on `lp/daily-stack` plus the two `GP-Led Formulation` siblings, the
`Personalised to your data` labels on three surfaces, the attributed-quote wording on
three surfaces, and zinc 30mg → 25mg with the claim paraphrase deleted. Compliance
pre-flight run as a delta against the pre-edit baseline: **0 findings introduced, 1
HARD + 5 REVIEW removed.** Full rulings in
`03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`.

### SUPERSEDED, kept for the audit trail: "FOUR non-compliant strings are LIVE on the site, found by review, not yet fixed" (2026-08-02, morning)

An on-page and AI-visibility review (`06_marketing/seo-ai-search/2026-08-02-on-page-ai-visibility-review.md`) flagged them and each was then confirmed in **live source**, not just in build output:

| String | Location | Reach |
| --- | --- | --- |
| `EFSA Regulated` | `frontend/components/shared/Footer.tsx:47` | **every page** |
| `GP-designed report` (inside the `HowTo` JSON-LD) | `frontend/app/(marketing)/page.tsx:45` | homepage, machine-readable |
| `GP-designed report` (body copy) | `frontend/app/(marketing)/page.tsx:324` | homepage |
| `A real doctor designed your report.` | `frontend/app/(marketing)/how-it-works/page.tsx:426` | how-it-works |

**EFSA does not regulate businesses**, so the badge asserts a regulatory status that does not exist, and it is in the footer, so it is on every page. **`GP-designed report` is prohibited framing** and one instance sits inside structured data, which is the worst place for it: machine-readable, and read by exactly the systems that quote a site back as fact. The compliant wording is already elsewhere on both pages: "Recommendation logic approved by a GMC-registered GP".

**Not fixed in this session, deliberately.** These are external-facing copy, so Guardrail #1 applies: route through `03_compliance/CONTEXT.md` before the replacement wording ships. The removals themselves are not judgement calls, but the replacements are.

**A detection lesson worth more than the four fixes.** The `how-it-works` instance is split across a `<br />`, so its text nodes concatenate without a space and an exact-string grep for the sentence does not find it. **Any prohibited-phrase sweep that greps for whole sentences will miss anything broken across markup**, which is most headings on this site.

## Eight published article bodies edited: dead editorial markers removed (2026-08-01)

`blog_articles.body` and the MDX mirror both edited for `14-signs-of-vitamin-d-deficiency`, `b12-blood-test`, `fbc-blood-test`, `ferritin-blood-test`, `how-to-increase-testosterone-naturally`, `liver-function-blood-test`, `low-vitamin-d-symptoms`, `thyroid-test`. Commit `67b9aa1`. Found by `content-doctor` invariant 6; the full audit trail is in `06_marketing/content-machine/STATE.md`, which owns this.

**No rendered output changed, and that was verified rather than assumed.** The markers were JSX comments, which are stripped at render. Proven by fetching `myth-of-normal-range`, whose benign `{/* CTA BLOCK */}` is **still** in the database and returns **zero** hits in the served HTML. So the standard two-sided served-page canary does not apply here: the removed string never appeared in the HTML to begin with, and "old string absent" would have been true before the edit as well. **No `/api/revalidate` call was needed or made.** Verification was done at the layer where the change actually is: `blog_articles` now returns 0 of 18 bodies matching any obligation marker.

**Worth keeping, because it will recur:** a change to `blog_articles.body` is not automatically a change to the page. Comments, frontmatter and anything the renderer drops are invisible downstream. **Before reaching for the served-HTML canary, establish whether the edited text can reach the HTML at all** — otherwise the check passes for the wrong reason and reports a deploy it never observed.

---

## Two live article CTAs corrected: they claimed we had not launched (2026-07-31)

Keith spotted the stress-article CTA. Both fixed in `blog_articles.body` (the served column), revision recorded, `current_revision_id` repointed, revalidated by slug, and verified two-sided against the served HTML: old strings absent, new strings present on both pages. Commit `e029278`.

- **`signs-of-stress-in-men`** said "No kit to sell you today" and "first to know when our men's-health checks launch". Three kits are purchasable (Stripe live, checkout E2E `869d99m5a` passed, all three kit pages serving with prices), so that was false on a page two clicks from a buyable kit. **Live since 2026-06-30 and it survived eight revisions**, most recently 2026-07-24, untouched. The waitlist ROUTING is unchanged and correct: there is no cortisol kit, and `kitCTA.ts` deliberately holds `stress` at email capture. Only the prose changed; it now scopes the gap to cortisol and points to the test selector.
- **`inflammatory-markers-blood-test`** said Joint & Recovery Collagen was "Launching shortly". Supplements were deferred 2026-05-23 to a non-cash waitlist, Gate 0A is not met, and no Stripe price IDs exist. Now says it is not on sale and no date is set. The EFSA Vitamin C wording is untouched.
- **Pre-flight was run as a delta, not on absolute counts**: both files scanned against their pre-edit baseline, zero findings introduced, zero removed, identical sets. The 2 HARD and 9 REVIEW the scanner reports on `inflammatory-markers-blood-test` are all pre-existing in Ewa-approved copy at untouched lines. **Not fixed here, and worth a separate look since two are HARD.**
- **Audit note:** the other three waitlist CTAs (`cholesterol-test`, `liver-function-blood-test`, `thyroid-test`) were checked and are correctly scoped to genuinely unlaunched panels. No change needed.

## DONE: Pillar E ungated in `kitCTA.ts` (2026-07-31)

`lib/content/kitCTA.ts` carried `E: { ..., gated: true }` with the comment "Pillar E content must not exist until Ewa signs the andropause claims pack", and `resolveKitCTA()` threw for it by design. Ewa signed that pack on **2026-07-26** (CA-028) and `/blog/andropause-male-menopause` went **live 2026-07-30**, so the comment was false and the throw guarded nothing. Raised by the CA-028 decision sweep, fixed as its own task.

- **It was dormant, not broken.** The andropause article does not use `InlineKitCTA`; it hand-writes its links to `/test-selector/`, `/kits/testosterone/` and `/kits/hormone-recovery/`. So nothing called `resolveKitCTA('E')` and the page served 200 throughout.
- **What changed:** `gated: true` dropped from `E` (target unchanged at `/kits/testosterone`, `KIT_1`, which is inside CA-028 §5's Kit 1 / Kit 3 permission); the `(GATED)` marker removed from the `PillarId` union; the block comment and the file-header compliance invariant rewritten to record the ungating and its date.
- **The gating mechanism was deliberately KEPT.** `gated?: true` on `KitCTATarget` and the throw in `resolveKitCTA()` both stay, so the next pillar that needs a gate still gets a build failure rather than a silent no-op. Only Pillar E's use of it was removed.
- **Test rewritten, not deleted.** `scripts/test-kit-cta.ts` previously asserted "Pillar E is gated and refuses to resolve". It now asserts two things: that Pillar E resolves and routes to `KIT_1` / `/kits/testosterone` (so the CA-028 routing permission is enforced in CI, not just documented), and that the gating mechanism itself still throws when a pillar is marked gated, restoring state in a `finally`.
- **Verified 2026-07-31:** `npx tsx scripts/test-kit-cta.ts` green, 10 pillars, 10 checks. `npx tsc --noEmit` clean. Full `npm test` exit 0.
- **Still open, and it is a judgement call rather than a defect:** the andropause article does not use `InlineKitCTA` while ten other articles do. Adopting it would route its CTA through the central map, which is the whole point of the map, but it changes CTAs on a live page and the article currently links to three destinations rather than one. Not done here.

## Sign-off gate: first live run corrected the design, and it worked (2026-07-30, commits `39f86a8`, `6c2b50c`)

The gate below shipped reading the **checkbox**. Its first real use showed that was the wrong signal, and the fix is now live.

- **What she actually did:** on the FAI re-opt Ewa answered all five rulings by typing her answer onto the end of each checklist item ("leave it as is", "Keep it", "that's fine") and ticked one of five. Reading the tick alone would have **blocked a fully-answered set**, the mirror image of the bug the gate exists to fix.
- **Her behaviour is better than the design was.** A tick records that she agreed; the text records what she said, and only the second is usable in an audit. So `rulingStates(task, originals)` now counts an item as answered if ticked **or** carrying appended text, extracts that text as the ruling, and compares against the rulings as submitted (read from the reviewed frontmatter, so it diffs against structured data). Item names come back HTML-escaped and are decoded first, or every quoted ruling looks edited. Without originals it falls back to the tick, which is the conservative direction.
- **`recordRulingAnswers` writes her answers into `content_review_log.notes` on approval.** Proven on the live run: the FAI reopt row now reads "Rulings answered at approval (5/5)" with her wording against each question.
- **Re-opt track was missing the gate entirely** on the first pass. `reopt-concierge` read frontmatter from the **live** row, so a re-opt that changes the title named the task after the old one and `ewa_rulings` (which exists only on the proposed revision) was invisible. Now reads the proposed revision, creates the checklist, and shares one `parkedOnRulings` helper and one `rulingsFrom` parser with the new-article track so they cannot fork.
- **End-to-end result:** 5/5 answered, task completed, the 07:00 tick promoted revision `73bf7d77` over live copy, and her answers are in the compliance record. 23 assertions on `scripts/test-rulings-gate.ts`, 32 in the suite, all green.

## Sign-off gate hardened: a named ruling can no longer be answered by silence (2026-07-30, commit `1245ea9`)

The content-engine review gate was binary (ClickUp status `complete` = approved). The andropause hub was approved that way on 2026-07-29 with two CA-028 rulings asked twice, in comments, and never answered. Nothing in the pipeline noticed, because a boolean gate cannot carry a non-boolean answer.

- **Named rulings are now real ClickUp checklist items** under `RULINGS_CHECKLIST` ("Rulings required before approval"), sourced from the draft's new **`ewa_rulings`** frontmatter array. Real checklist items are machine-readable; checkboxes typed into a description are not.
- **`isApproved()` now requires `complete` AND zero unresolved rulings.** That one predicate closes the hole; the rest feeds it.
- **`syncApprovals` has a third state.** Complete-with-unticked-rulings is neither pending nor approved: parked on Ewa, outstanding items written to `content_pipeline.notes`, logged as a `blocked` run, and commented on the task **once** (the prior note is the idempotency marker, so the daily tick can't spam her).
- **`signoff-concierge`** creates the checklist, puts the ruling warning **above** the completion instruction (burying it below is how the original request got closed past), records the rulings in `content_review_log.notes` at submission so the trail shows what was asked even when no answer arrives, and treats a checklist failure as non-fatal but loud.
- **Regression-tested:** `scripts/test-rulings-gate.ts`, 13 assertions, wired into `npm test`. Full suite green, `tsc` clean. The live ClickUp half was exercised end-to-end on throwaway tasks (create, add checklist, mark complete, gate refuses, tick items, gate approves, delete).
- **No retro-break:** tasks created before this carry no checklists, so `unresolvedRulings` returns empty and they behave exactly as before. Confirmed by `orchestrator --dry`: the andropause hub still approves.
- **Skills updated in step:** `/article` documents `ewa_rulings` and requires it for any amber line needing a decision rather than an approval; `/article-to-review` documents the gate, and its invariant 3 was corrected (it claimed re-running `draft-writer` "re-gates" a submitted article; the stage selectors make it a silent no-op).

## WTP quiz block + homepage hero flip: SHIPPED 2026-07-25 (commit `03d4bd5`)

The Van Westendorp willingness-to-pay block is live inside the test-selector quiz, and the homepage hero primary CTA now routes to the quiz (ratified by Keith 2026-07-25; resolves site-funnel-model §5). Built and verified via an Opus 4.8 implement/verify agent loop (adversarial code verify: SHIP, zero blockers; runtime browser verify: all pass; screenshots reviewed by eye).

- **Quiz is now 5 steps** (`components/marketing/TestSelectorQuiz.tsx`): Q1-Q3 → step 4 = recommendation shown **un-priced** + optional WTP card (4 VW £ inputs, age band 18-24/25-34/35-44/45-54/55+, equal-prominence submit/skip) → step 5 = price reveal + CTAs + the unchanged email capture. The VW questions price the **bundle concept matching the recommended kit** (test now + retest later, one order, described without any price) — the only un-anchored read available since bundle prices are dark behind `BUNDLES_ENABLED`. Resolves site-funnel-model §4's open bundle-alignment decision: the WTP block tests bundle price points explicitly; the quiz keeps routing to single kits until the flag flips.
- **Event:** anonymous `quiz_wtp` via the public `/api/events` sink (added to the `EventName` union + `ALLOWED` set). No email, no identity, no cookies (PECR-clean attribution). Submit rows carry `wtp_too_cheap/bargain/expensive/too_expensive` (jsonb numbers), `age_band`, `bundle_concept`, `symptom_flags`, `monotonic`; **skip fires `skipped:true` with no answers** (completion-rate denominator). Retake noise accepted at n≈50 (no anonymousId by design; sanity-check row count vs `quiz_complete` at read time). GA4 mirror receives the params but they are invisible without custom dimensions — **deliberate; Supabase `events` is the analysis source.** Pure logic + read-time SQL: `lib/quiz/wtp.ts`; suite `scripts/test-quiz-wtp.ts` (33 assertions) wired into `npm test`.
- **Hero** (`app/(marketing)/page.tsx`): primary "Find your test in 60 seconds" → `/test-selector`, secondary "Explore Test Kits" → `/kits`, tertiary text link "Or see how it works first" → `/how-it-works`. Intended trade: catalogue CTR drops, routed-AOV + WTP volume rise; glance at week-2 `quiz_complete` volume.
- **Compliance pre-flight run 2026-07-25** (agent, scanner + judgement pass): no HARD fails; previously-approved result-card strings confirmed byte-identical (moved, not edited). Two flags resolved by Keith same day: buttons reworded "See/Skip, just show **the** price" (killed a personalised-pricing misread), and the efficacy-adjacent opener reworded to "Many men choose to retest later to see how their numbers have moved" (drops the claim-adjacency; no Ewa gate needed). Scanner's one HARD hit was a false positive ("treated" in a code comment).
- **DPIA note (from the pre-flight):** the `quiz_wtp` payload carries age band + symptom flags but **no identifier of any kind** (no email, no anonymousId, nothing stored beyond the anonymous events row), so the "anonymous" characterisation holds; recorded here for the DPIA owner rather than editing `03_compliance/dpia/phase0-dpia.md` unilaterally.
- **Owed next:** the **n≈50 WTP read** (read-time SQL in site-funnel-model §4) → feeds the £169/£199/£259 bundle reprice decision (ltv-cac model v2, load-bearing). The block is a **temporary research instrument: retire or rework it once the read is taken.** ClickUp `869e74w93` closes with this ship.

## Two-kit bundle mechanism: LIVE 2026-07-26 (`BUNDLES_ENABLED=true` + `ACCOUNT_ADDRESS_ENABLED=true`)

Built per `2026-07-24-bundle-mechanism-build.md` (this workspace's `docs/`) and the approved bundle plan. **Committed to main + pushed 2026-07-24** (dark behind the flag). ⚠️ The push triggers a Coolify redeploy of the dark code; nothing changes visibly in prod because everything is flag-gated (flag off → byte-identical to before). Nothing applied to any DB. Four verifier rounds passed (A, B+D, C, final integration). Key decisions: **bank-not-refund** on a Confirmation all-clear (auto-refund loses the Stripe fee; a manual, no-questions-asked refund-on-request path exists via `scripts/ops/cancel-bundle.ts` + a manual £70 Stripe refund), soft address-check window (4 days, auto-dispatch to whatever address is current), interval-shaped Confirmation trigger (`CONFIRMATION_INTERVAL_DAYS`, default 0, single reviewable constant for Ewa), and (kit-page design, same session) **bundle-forward pages that close on the offer** with **Kit 3's £259 SKU reframed as a "retest add-on"** rather than a second "bundle" (Kit 3 is already sold on its page as a bundle of two kits).

- **Migration** `database/migrations/20260725_bundle_dispatches.sql` (+ supabase mirror): new `bundle_dispatches` table (owed second kit), state machine `scheduled → trigger_met → awaiting_window → dispatched` (terminals `not_needed`/`cancelled`). **APPLIED to the live DB 2026-07-26** (Supabase `androprime` / `phqrjtnflovicgkngieu`; RLS + select-own policy verified).
- **`lib/bundles/`** (`config.ts`, `checkout.ts`, `confirmation.ts`, `sweep.ts`, `dispatch.ts`): three SKUs: Confirmation £169 (Kit 1 base, Kit 1 retest, result-triggered, `shouldTriggerConfirmation` at t<12 nmol/L, aligned to GP-referral low-T 2026-07-25; customer-facing name **Recheck Bundle**), Prove-It £199 (Kit 2 base, Kit 2 retest, timed day-~90, flagship), Full-picture £259 (Kit 3 base, **Kit 2** retest, timed day-~90). `BANK_RECHECK_MONTHS=6`, `ADDRESS_CHECK_WINDOW_DAYS=4`.
- **`app/api/jobs/bundle-sweep/route.ts`**: daily QStash-verified sweep advancing the state machine (matures due rows → sends CIO `bundle_address_check` event → after the 4-day window, dispatches the second kit via the existing `/api/vitall/dispatch`, reused verbatim). **QStash Schedule REGISTERED 2026-07-26** (scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, cron `0 6 * * *`, POST to the prod route, not paused); fires daily but no-ops while `BUNDLES_ENABLED` is off.
- **Checkout + webhook:** `app/api/checkout/kit/route.ts` accepts a `bundle` param and resolves one of three new Stripe price envs (`STRIPE_PRICE_BUNDLE_CONFIRMATION` / `_PROVEIT` / `_FULLPICTURE`); **the 3 Stripe products/prices + the 3 Coolify env vars were created 2026-07-25 (Keith)** — the checkout pipe is now wired. `BUNDLES_ENABLED` itself is **currently `false` in prod** (Keith set it true mid-session to test, then back to false once the render fix landed; it stays false until the gates below clear). `app/api/webhooks/stripe/route.ts` inserts the `bundle_dispatches` row on a bundle purchase (kit_type metadata stays the base kit, so the existing first-kit insert + dispatch flow is untouched).
- **Result hook:** `processVitallResult` (`lib/results/processResult.ts`) now calls `resolveConfirmationOutcome` for an open Confirmation row: low (<12) schedules the recheck; not-low (≥12, i.e. borderline 12–<15 or all-clear ≥15) banks it to the +6mo recheck. No refund logic in code; refund-on-request is `scripts/ops/cancel-bundle.ts` (flips the row to `cancelled`) then a manual Stripe refund, by design.
- **Frontend (kit-page CRO rebuild, same session):** all three kit detail pages were reverted to their pristine git originals and rebuilt **fully flag-gated**: flag OFF renders each page byte-identical to production (verified: original JSX preserved verbatim in the `else` branches); flag ON renders a **bundle-forward** design where the hero leads with the offer and the page **closes on the single-vs-bundle chooser** (no trailing related-reading blog cards or competing-kit cross-sell, which a CRO pass flagged as focus-stealers). Testosterone + Energy lead the hero with the bundle as primary; **Hormone keeps Kit 3 (£179) as primary and presents the day-90 retest as a prominent add-on** (its chooser sits on a white panel inside the black finale so the black bundle card reads). `BundleChoice` gained optional label-override props so the Kit 3 card reads "Kit 3 plus a Retest / Track your change" not "bundle". `bundle` threads through the `/checkout/details` redirect hop (mirrors how `discount` already survives it). All verified by headless-Chrome screenshots. **Bundle copy is PENDING compliance pre-flight + Ewa sign-off**; marked in code, not yet run.
- **CRO evaluation run (page-cro skill) on all three pages**: heuristic (no live conversion data yet). Top remaining lever flagged: **no social proof anywhere** (no testimonials / review counts / test numbers); needs real tester data from Keith before a social-proof block can be built. Also paused this session: integrating the kit **sleeve-cover designs** (`02_brand/assets/packaging/concept-sleeve-fronts-all-kits.html`, HTML concepts, on-brand) as product imagery on the chooser cards (one sleeve on single, two on the bundle); Keith said hold. Both are open follow-ups.
- **Tests:** 3 new suites wired into `npm test` (`test-bundle-sweep.ts` 20 assertions, `test-bundle-confirmation.ts` 27, `test-bundle-checkout.ts` 37); all green; `tsc --noEmit` clean.

**Render fix (2026-07-25, commit `0c1070f`):** the three kit pages were statically pre-rendered, so `isBundlesEnabled()` was baked at build time (the Dockerfile only feeds `NEXT_PUBLIC_*` into the build, so `BUNDLES_ENABLED` was never present and the flag froze OFF; toggling the deployed env var did nothing to the kit-page UI, though the dynamic checkout/webhook/sweep handlers always honoured it). Added `export const dynamic = 'force-dynamic'` to all three (Option A) so they render per-request and the runtime flag wins with no rebuild. Verified by an Opus runtime agent across both flag states on one build (flag OFF = byte-identical to prod, zero bundle surfaces; flag ON = chooser on all three, 169/199/259), screenshots reviewed. **Deployed with `BUNDLES_ENABLED=false`, so no visible change.** Trade-off: these three pages are now SSR per-request (lost static caching) — reclaim via the Dockerfile build-arg route (Option B) once bundles are permanently live post-launch if caching matters.

**WENT LIVE 2026-07-26 (Keith):** both `BUNDLES_ENABLED=true` and `ACCOUNT_ADDRESS_ENABLED=true` set in Coolify + app redeployed (env changes needed the restart to apply — the first redeploy shipped the code/legal but the flags only took on the explicit restart). **Verified live by smoke test:** the bundle-forward chooser renders on all three kit pages at the correct prices (`/kits/testosterone` £169 Recheck, `/kits/energy-recovery` £199 Prove-It, `/kits/hormone-recovery` £259 Full-Picture); live `/terms` + `/privacy` carry the bundle sections. Non-blocking residuals: prices remain WTP hypotheses (gate #10, reprice via env after the quiz read); `/account` address-surface visual QA under an authed session still worth a manual eyeball. All gates below are closed.

**Before the flag flipped (`BUNDLES_ENABLED=true`), these were owed (all now DONE):**

1. ~~Solicitor **D2 gate**~~ → **RATIFIED in-house 2026-07-25** (Keith decision: no external solicitor review). Bundle Terms section ("Test Bundles (Two-Kit Purchases)") **APPROVED by Keith + Ewa** and folded into `03_compliance/terms-and-conditions.md` (banner now `[APPROVED 2026-07-25]`); Privacy clauses in `privacy-policy.md` (v1.3.2: bundle purpose row + automated-scheduling disclosure + retention row). Keith's product decisions all approved (12-month banked-retest refund backstop; retest portion refundable up to dispatch; customer-facing name "Recheck Bundle"). **Only residual = the mechanical live-sync at flag-flip:** copy the approved Test-Bundles section into live `canonical-site/terms/index.html` and the Privacy clauses into the live `/privacy`, coupled to `BUNDLES_ENABLED` so /terms never advertises an unpurchasable bundle. **→ DONE 2026-07-26: synced at the flag-flip** — the customer-facing Test Bundles section added to live `canonical-site/terms/index.html` (after Diagnostic Kits) and the three bundle clauses (purpose row + automated-scheduling disclosure + retention row) added to live `canonical-site/privacy/index.html`; source-doc banners flipped to SYNCED. Ships with the `BUNDLES_ENABLED=true` redeploy. General-T&C review residuals (subscription-variation notice, ADR naming, solicitor's optional mixed goods+service confirmation) tracked in `03_compliance/2026-07-25-terms-privacy-legal-review.md`.
2. ~~**F3/F4 ClickUp build gates** (subtasks of B1 prereqs `869e74vwz`).~~ **DONE 2026-07-26** — both subtasks `complete` in ClickUp: F3 `869e8w56x` (Bundle Terms + Privacy clauses drafted in-house, solicitor waived, Keith ratified), F4 `869e8w573` (Keith + Ewa + compliance Phase-0 boundary ruling: Confirmation bundle vs "confirmatory testosterone testing").
3. ~~**Ewa sign-off**: threshold + Phase-0 boundary + intervals.~~ **DONE.** Threshold + boundary **RESOLVED 2026-07-25** (`shouldTriggerConfirmation` aligned to t<12; wellness "Recheck" framing). Intervals **SIGNED OFF 2026-07-26** (Keith relay): `CONFIRMATION_INTERVAL_DAYS = 0` (immediate recheck at trigger) + `SECOND_DISPATCH_DELAY_DAYS = 90` (Prove-It/Full-picture day-90) both approved as coded.
4. ~~**Compliance pre-flight** on the `BundleChoice` copy.~~ **DONE 2026-07-26**: pre-flight run (0 HARD; price-split arithmetic accurate on all three: £99+£70=£169 / £119+£80=£199 / £179+£80=£259; Prove-It/Full-picture retest mechanic uses the approved "see how your numbers have changed" wording). The one flagged line (Recheck mechanic, "your second test ships only if your first result comes back low…") is **CLEARED**: **Ewa approved it as a wellness recheck, not "confirmatory testosterone testing"** (Keith relay 2026-07-26); the "Recheck Bundle" customer-facing name is the mechanism of that ruling. `BundleChoice` PENDING markers updated to match.
5. ~~**Create 3 Stripe bundle prices** + populate the three env vars in Coolify.~~ **DONE 2026-07-25 (Keith).**
6. ~~**Register the QStash Schedule** for `/api/jobs/bundle-sweep` (cron `0 6 * * *`).~~ **DONE 2026-07-26** — scheduleId `scd_5YpFh9tnXmSe2uZewrHZ6iNT3rTW`, POST `https://andro-prime.com/api/jobs/bundle-sweep`, daily 06:00 UTC, 3 retries, not paused. Fires now but no-ops (`{skipped:true}`) until `BUNDLES_ENABLED` flips.
7. ~~**Build the CIO `bundle_address_check` campaign.**~~ **BUILT DRAFT 2026-07-26** — campaign `24` ("T-11 — Bundle Address Check"), type transactional, trigger event `bundle_address_check`, single email action `108` (draft), template `55` (from Keith/identity 1, subject "Please confirm your delivery address", preheader set, CTA → `/account`, `4 days` synced to `ADDRESS_CHECK_WINDOW_DAYS`). Pre-flight 0 HARD (pure logistics copy, no health claim, no em dash); Liquid lint 0 errors (local + live); no `{% if %}` branches. Copy **APPROVED by Ewa + Keith 2026-07-26 (CA-027**, `03_compliance/content-approval/approval-record-bundle-address-check-2026-07-26.md`). **Not activated** (draft) — activation gated only on `BUNDLES_ENABLED` + `ACCOUNT_ADDRESS_ENABLED` live.
8. **Address-update surface** the address-check email links to — **BUILT 2026-07-26, dark behind `ACCOUNT_ADDRESS_ENABLED`** (default OFF; new flag in `lib/flags.ts`). Self-serve "Delivery address" section on `/account` (`components/account/AddressSection.tsx`) + `PUT /api/account/address` (auth-required, 404 when flag off, writes only the caller's own `users` row) + `lib/account/getAddress.ts` loader. Edits the exact `users` address columns the second-kit dispatch snapshots (`lib/bundles/dispatch.ts`), so a mid-window update ships to the new address with no extra code. Country forced GB (UK-only). tsc clean; compliance scan 0/0/0 (pure logistics copy, no health claim, no em dash). **Set `ACCOUNT_ADDRESS_ENABLED=true` in Coolify alongside `BUNDLES_ENABLED` so the email never links to a dark surface.** **Visual QA still owed** (flag-on + authed local session).
9. ~~**Apply the migration** (`20260725_bundle_dispatches.sql`) to a live/staging DB.~~ **DONE 2026-07-26** — applied to the live Supabase project `androprime` (`phqrjtnflovicgkngieu`; single project, no separate staging). Verified: `bundle_dispatches` table (12 cols), RLS enabled, select-own policy, both indexes + `set_updated_at` trigger present. Empty + unused until `BUNDLES_ENABLED` flips (no row is written while the flag is off).
10. Working prices (£169/£199/£259) remain hypotheses pending the Van Westendorp WTP read; easy reprice (one env var per SKU), not a blocker to flag-flip but flagged so it isn't forgotten.

## Middleware auth-gate + Context7 tooling (2026-07-24): code done, deploy owed

- **`/supplement-waitlist-status` now gated in `middleware.ts`** (added to `protectedRoutes` + `matcher`). Defence-in-depth + a consistent login redirect; the page already self-guards via `getCurrentUser()` → `return null`, so this is a UX/consistency fix, not a data-leak. CONTEXT route-table row updated to match. ⚠️ **Committed this session; a push = Coolify redeploy, so it goes live on the next deploy**; smoke-test `/supplement-waitlist-status` (logged-out → login redirect) after.
- **Context7 MCP** added to the local gitignored `.mcp.json` (keyless `@upstash/context7-mcp` v3.2.4); usage pointer added to CONTEXT.md "How to Work Here" (third-party library docs: Next/React/Supabase/Stripe/QStash; graphify stays for our own code). Needs an MCP reconnect to load.

## DEPLOYED 2026-07-24: CA-026 copy + full design pass + blog DB update (all live, verified)

The three passes below (CA-026 money-pages rewrite, full-site strategy-alignment fixes, design-guidelines fixes) shipped together as one deploy 2026-07-24, plus the blog DB content update.

- **Commit `e09f8c6`** (104 files: CA-026 copy + design overhaul + `llms.txt` regen + blog mirror + docs), pushed to main → Coolify. **First build FAILED: OOM-killed at the in-Docker `next build` type-check step** (compiled fine in 51s, then process killed, exit 255, no `Type error:` printed; a clean local `next build` of the same commit passed all 75 routes, confirming code was clean). No outage: Coolify discarded the failed build and kept the prior version serving. **Retry via empty commit `d58bfbd` succeeded** (transient server-load OOM; Docker layer cache made the retry ~2.5 min). If this recurs: add `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds` to `next.config.ts` (we gate types locally with `tsc --noEmit`, so the in-Docker typecheck is redundant and is the memory-heavy step that dies).
- **Live smoke test green (2026-07-24):** homepage B1 hero, /kits C1 block (no bundle prices), /terms SLA "2 to 5 working days" (24-48h gone), how-it-works discount line gone, regenerated /llms.txt (FM + partner-code prices + TRT pre-announce gone, A1 folded in), ferritin blog article (Vitall name gone, UKAS retained).
- **Blog DB import done:** `import-blog-to-db.ts` ran (17/17 upserted, all published). **Landmine avoided:** `free-androgen-index` mirror was `status: draft` while the live DB had it `published` (published earlier via the ClickUp orchestrator sequence, which never updated the MDX mirror); mirror reconciled to `published` before import so the raw import didn't unpublish a live article. DB verified post-import: `(Vitall)` and the per-customer-review phrasing removed from bodies.
- **F7 (UKAS cert) downgraded, NOT a blocker:** substantiation is on file (signed services agreement §3.6 + 2026-04-22 quote); only the per-lab certificate artefact is outstanding, which the Vitall negotiation log already classifies non-blocking. ClickUp `869e8w57e`. Wording guardrail holds: "analysed by a UKAS ISO 15189-accredited lab" only, never "UKAS-accredited report" / "Vitall is accredited".
- **Still owed** (unchanged by the deploy): everything in the two "Owed / flagged" + "Design rulings owed" lists below. (F3/F4 bundle gates, ClickUp `869e8w56x`/`869e8w573` under B1 prereqs `869e74vwz`, both now **complete 2026-07-26**.)

## Full-site design-guidelines audit + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6` / retrigger `d58bfbd`)

Four-agent audit of every surface against `02_brand/brand-guidelines.md` v2.0 hard rules (+ visual-identity.md logo authority), then four implementation agents. Verification green: `tsc`, `npm test`, `npm run build` (75 pages), banned-pattern scan clean (remaining `hover:bg-black` hits are all §5.3-sanctioned button fills, not card inversions). Fixed: **full-card hover inversions** removed everywhere (homepage/kit/how-it-works/waitlist step cards, quiz options, RelatedArticles, BlogListings, ArticleLayout, LP energy); **all marketing motion** stripped (pulsing dots, fade-up entrances, hover-translates, animated accordions/progress bars, dead `animate-[fadeIn]` landmines); `statusPulse` keyframes now opacity-only + reduced-motion-guarded; **colour fence enforced** (sample-panel bars tokenised to `bg-statusWarning`/`bg-statusOptimal` incl. the §3.3 token-note item; red/orange/green raw classes eliminated; coloured status TEXT removed on subscriptions + `text-amber-600` homepage value; latent `.status-*` text/bg/border utilities deleted; red error text → black on consent/account/waitlist forms); **offset block-shadows outside `.blog-skin`** removed (SupplementWaitlistForm, JoinForm); gradient stripe overlays deleted (hormone-recovery CTA `#333`, live /terms disclaimer panel); rounded-full dot + 3 `rx/ry` icon rects squared; serif app headings → Inter black; button spec sweep (primary border-4/text-sm, `transition-all`→`transition-colors` ~60 sites, app utility-button pattern ×9); mono-label tracking normalised to `tracking-[0.15em]` (~60 labels); off-roster grays mapped to the §3.2 set; Nav logo hover-scale + link transitions removed; auth/activate brought to spec; **tailwind hardened** (theme-level borderRadius all 0px, boxShadow all none; banned utilities can no longer compile).

**Design rulings owed (Keith):** ~~(a) sample-report COLOUR on the homepage hero + LPs~~ **RESOLVED 2026-07-26 (Keith): §3.3 carve-out extended to cover the sample-report panel wherever it appears (kit pages, LPs, homepage hero); colour kept, fence unchanged (commits `1657235`/`da14812`)**; (b) looping hero background video vs "marketing fully static" (mitigations exist: reduced-motion/mobile/data-saver skip, grayscale); sanction in guidelines or drop to poster; (c) blueprint grid-line gradient textures (hormone-recovery:104/398, supplement-waitlist:44, blog dot pattern); bless or remove; ~~(d) one-primary-CTA-per-page rule vs long pages with repeated CTAs~~ **RESOLVED 2026-07-26 (Keith): §5.5 clarified to "one primary action per page; a single CTA may repeat down a long LP; only competing primary CTAs banned"**; (e) QualifierGate YES/NO hover inversion (buttons, but card-sized); (f) minors: `.glass-panel` rename (30 consumers), footer "EFSA Regulated" badge, double back-to-top on TOC'd articles, 1px badge chips, 8px accent borders outside supplement context, sans-black emphasis paragraphs.

**LP design-conformance audit (2026-07-26, 2 Opus agents, full per-rule pass, kit + supplement split):** all 5 LPs = **0 HARD breaks, but NOT full conformance** (~9 MINOR deviations, several systemic). PASSING: buttons (rounded-none, border-4/2, transition-colors, no transforms), no rounded SVG linecaps, colour fenced to sample-panel range bars only (badges B&W), no competing primary CTAs, no gradient/shadow/glass/hover-inversion. MINOR (owed, **Keith deferred the fix decision** at wrap): (1) `text-gray-400` meta on the black step-4 cards → should be `gray-300` (testo 333 / energy 278 / hormone 387, §3.2a); (2) hormone founders' black card `gray-200`/`gray-400`/`gray-600` → `gray-300`/`gray-700` (564/575/580, §3.2a); (3) final CTA `text-xl` vs §5.2 `text-sm` (3 kit LPs); (4) final-CTA arrow `strokeWidth="4"` vs §8.8 2-3 (3 kit LPs); (5) card padding below §6.5 `p-10` desktop min (`p-8`/`p-6`/`p-5`, systemic across all 5); (6) primary CTA padding `px-10 py-5` vs §5.2 `px-8 py-4`; (7) hormone `gray-400` de-emphasis on light surfaces (415 £218 strikethrough, 620-621 table) outside the contrast-device purpose; (8) hormone ghost numbers use a `WebkitTextStroke` outline vs §8.4 solid `gray-100`/`gray-800` fill; (9) daily-stack missing `border-t-4` divider before the FAQ (§7.3). Proposed fix split: **bucket A** (safe class swaps: 1,2,4,7,9) + **bucket B** (visual/aesthetic call: 3,5,6,8). **ALL 9 FIXED 2026-07-26 (Keith: "fix all issues")** across all 5 LPs: (1) black step-4 meta → `gray-300`; (2) hormone founders' card → `gray-300`/`gray-700`; (3) final CTAs → `text-sm`; (4) final-CTA arrows → `strokeWidth="2"`; (5) every content card → `md:p-10` (mobile kept ≥ `p-6` min); (6) primary CTAs → `px-8 py-4` (final CTAs also normalised off `px-12 py-6`); (7) hormone light-surface de-emphasis (£218 strike + comparison table No cells) → `gray-500`; (8) BOTH hormone ghost-number instances (383 process step + 335 biomarker card, the second not line-cited in the audit) → solid `gray-100`/`gray-800` fill, `WebkitTextStroke` removed; (9) daily-stack FAQ section given `border-t-4 border-black`. Verified: `next build` exit 0 (all 5 LPs prerendered, tsc + lint clean), real headless-Chrome full-page screenshots reviewed by eye (desktop 1440 + mobile 390) — layouts intact, no overflow, dividers present. **Now full design conformance on the audited rules.**

## Full-site strategy-alignment review + fix pass: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

Seven-agent review of every customer-facing surface (money pages, marketing long-tail, 5 LPs, logged-in app + results engine, shared chrome/schema, blog MDX mirror, email templates) against the conflict-free positioning (CA-026), pricing v2 (£99/£119/£179 anchors; bundles NOT yet shippable), and the compliance rails. CA-026 verbatim conformity CONFIRMED on all 8 money pages; single-kit pricing correct everywhere; **zero bundle prices leaked anywhere**. Safe fixes implemented (43 files); verification green: `tsc --noEmit`, `npm test` (classifier suite extended to 26 assertions incl. a dead-route guard), `npm run build`, banned-string scan of every added line clean. Highlights of the fix pass: how-it-works retest-discount promise deleted; sitewide footer de-Vitalled; `/gp-referral` 404 CTA repointed to the live GP handoff; false Kit 3 cortisol claim corrected; founding-member-status page retired (redirect `/account`); `public/llms.txt` regenerated on CA-026 wording (partner-code prices, FM section, TRT pre-announcement removed); live /terms 24-48h SLA corrected to "2 to 5 working days"; blog mirror de-Vitalled ×8 + per-customer-review rephrase ×9 (**mirror only, DB import NOT run**; diff `status:` vs DB first, then import + revalidate); D+ conformity lines added to kit LPs; em-dash sweep (incl. punctuation-only edits to Ewa-signed `biomarker-copy.ts`: claims word-identical, needs her nod).

**Owed / flagged (full list in the session report):** (a) CA-026 F7 UKAS certificate filing: pre-push blocker; (b) Ewa sitting bundle: per-customer-review lines deliberately left on how-it-works :426-430 + homepage "GP-designed report", the rephrased kit-page privacy answers + blog rephrases (nod), the 6 vs 12 nmol/L GP-threshold contradiction on how-it-works, biomarker-copy punctuation nod, T-range inconsistency (8–35 vs 10–35 vs 8–29); (c) Keith decisions: ~~LP positioning rebuild~~ **DONE 2026-07-26 as "step 2"** (commits `2e1e306` + `f8e4ebb`, both VERIFIED LIVE via two-sided canaries + element screenshots at 640/1280px): the flagged "GP-adversarial heroes" dissolved on inspection (hero lines are approved customer language: "Your GP said normal…", "Five minutes. No GP needed."); the real tells were the mockup labels, now de-protocolled and **matched to real classifier routing** ("Further investigation advised" → routing-neutral "Your next step, based on your numbers" after a first swap wrongly promised a GP conversation on a 14.2-borderline mockup; GP referral fires only on total T <12); CA-026 A1 receipt added verbatim to lp/collagen + lp/daily-stack (previously carried none); lp/hormone-recovery "The Fix" eyebrow → "The Next Step". **Ewa packet (her wording, untouched):** her attributed "clinical protocols … effective" quote ×4 (3 kit LPs + kits/hormone-recovery:630); ~~TRT-Trained badges, "we test first then we fix it", "founding-customer discount" promise ×7 surfaces~~ **SWEPT 2026-07-26, VERIFIED LIVE** (two-sided homepage canary: "act on it" present, "Then fix it" absent; commit `101db60`, 15 files: founder quote → "Then you know exactly where you stand", homepage H2 → "Then act on it" + "Intervention Protocols" label → "Data-Led Supplements", TRT badges → UKAS/GMC on 7 surfaces, founding-customer discount removed app-wide with JSON-LD kept in sync; greps 0, tsc clean). **Kit-page follow-up SWEPT + VERIFIED LIVE 2026-07-26** (commit `ec5f30b`, canary on /kits/hormone-recovery): "The Fix"/"THE FIX" headings → "The Next Step", "FIX" watermark → "DATA", "Next Step Protocol"/"ANALYSIS PROTOCOL ACTIVE" labels de-protocolled, stale hero PENDING comments synced; audit also confirmed NO bundle-price leak (hero bundle CTAs correctly `bundlesEnabled`-gated) and no "Confirmation" naming leak. **Left for Ewa** (packet assembled 2026-07-26 → `03_compliance/content-approval/ewa-packet-2026-07-26-lp-clinical-wording-and-countersignature-backlog.md`; ClickUp `869e9fk23`, list "Content Review — Ewa"; now also folds in the quote ×4 + how-it-works:449 second attributed blockquote + the CA-003→027 countersignature backlog)**:** her attributed "clinical protocols … effective" quote on kits/hormone-recovery:630 (her wording) + the how-it-works:430 "treated men" prose; stale /waitlist page, category-absolute "Other providers give you numbers" lines, £218 strikethrough framing, "EFSA Regulated" footer badge, dead canonical-site/lp static trees (**ashwagandha leak sweep 2026-07-26: 0 facing leaks — whole frontend clean incl. git-ignored files; canonical-site now holds only privacy/terms HTML, the flagged tree is already gone**; the Medichecks-name concern in these trees was NOT part of the ashwagandha sweep and is still open); (d) solicitor: terms/privacy FM + Vitall-naming sections, bundle terms (D2 gate); (e) email sequences (seq-03d cadence + "even if your GP says you're fine" subject, seq-01/06 GP framing, seq-04 discount framing); CIO-side, need Ewa/Keith pass before/at activation; T-04 SUPERSEDED-bannered, verify CIO doesn't reference it; (f) strategy-doc nit: LTV model v2 says £39.95/mo subscription vs catalogue/site £34.95 Daily Stack.

## CA-026 money-pages rewrite: DEPLOYED + verified live 2026-07-24 (commit `e09f8c6`)

The conflict-free positioning rewrite (CA-026 approved wording, verbatim) is implemented across 8 files in `app/(marketing)/`: homepage hero + meta descriptions (B1; title kept for SEO), /kits C1 money block, FAQ C2 + FAQPage schema, D+ conformity lines on testosterone / energy-recovery / hormone-recovery kit pages, A1 standing claim on About, A1 + live-receipts section on how-it-works. Verification green: `tsc --noEmit`, `npm test` (148 assertions), `npm run build`; zero em dashes / competitor names / banned absolutes in changed files. Also reconciled in-scope stale copy: how-it-works low-T routing still described the retired FM/TRT pathway (now the live CA-014 GP-referral framing), FAQ "Founding Member territory" band label removed, 2 pre-existing competitor mentions de-branded, 2 pre-existing schema em dashes fixed. **⚠️ UNCOMMITTED by design: pushing = Coolify redeploy = the new positioning goes live. Keith's go.** After push: eyeball homepage/kits/faq/how-it-works live, then re-run PSI once (copy-only changes; hero perf work untouched).

**Pre-existing compliance flags found during the build (NOT touched, for the Ewa sitting):** (a) "GP-designed report" on the homepage (HowTo schema step 4 + visible step 4): the proposed-but-unconfirmed standard chip per 02_brand STATE; (b) how-it-works "A real doctor reviewed your result" + "Dr Ewa signs off every result interpretation": per-customer-review implications the compliance CONTEXT bars (system-level rule). Both predate this rewrite.

## Mobile performance pass (2026-07-19): homepage hero

Mobile PageSpeed was imperfect; three commits cut mobile page weight from ~2.35 MB to ~0.7 MB and lifted mobile PSI from **85 to a settled ~88** (median of warm re-runs 87/88/88; a one-off 85 immediately after the round-3 redeploy was cold-start noise: first PSI hit after a Coolify redeploy inflates FCP + render-blocking via a slow TTFB, ignore it). All work DEPLOYED + verified live 2026-07-19. Desktop lab is already 100. **Decision (Keith, 2026-07-19): stop here**: 88 mobile / 100 desktop is a good result for a marketing site with a video hero, and the remaining points are infrastructure-bound, not code-bound (see below).

Stable warm metrics: TBT 40–90ms 🟢, CLS 0.013 🟢, Speed Index 2.1–2.9s 🟢; the two amber metrics holding the score are **FCP 2.1s** and **LCP 3.6s** (Moto G Power / Slow-4G, Lighthouse 13.4). Key finding: both are gated by the **render-blocking CSS + TTFB critical chain** (≈1,770ms render-blocking, consistent across warm runs), NOT by payload: LCP moved only 3.9→3.6 despite a much smaller poster, proving the hero image bytes were never the bottleneck. The next real lever is therefore **a CDN/edge (e.g. Cloudflare) in front of Coolify to cut TTFB**, which would lift FCP and LCP together; inlining critical CSS is fiddly in the App Router for small payoff. Neither pursued; parked as the only remaining path to 90+.

- **Round 1 (commit `675557b`, DEPLOYED + verified live):** `HeroBackground.tsx` skips the decorative hero video entirely on <1024px / data-saver / reduced-motion (keeps the static poster); `preload="none"` added. `hero.mp4` re-encoded 1.66 MB → 667 KB (540p, 24fps, desaturated to match the CSS grayscale) plus new `hero.webm` (VP9) 491 KB served first. GA `gtag.js` + FirstPromoter `fpr.js` moved from `afterInteractive` to `lazyOnload` (the inline consent-denied bootstrap stays early, so Consent Mode / GDPR behaviour is unchanged).
- **Round 2 (commit `35829de`, DEPLOYED + verified live):** hero poster 113 KB JPG → 51 KB WebP via `<picture>` (JPG fallback), preload retargeted to WebP. **Sentry Session Replay removed** from the client SDK (`instrumentation-client.ts`: dropped `replaysOnErrorSampleRate`; error + perf monitoring kept); `bundleSizeOptimizations` added in `next.config.ts`. Long `Cache-Control` (1y) headers for `/videos` + static images (repeat-visit win; stable paths, so **rename a media file to bust its cache**).
- **Round 3 (commit `bd6468f`, DEPLOYED + verified live):** mobile-only 800px poster `hero-poster-800.webp` (~28 KB) served via media-scoped `<picture>` + media-scoped preloads (desktop keeps the 1280px WebP); only Inter (H1 font) is now preloaded, Merriweather + JetBrains Mono set `preload: false`. Verified live: `/videos/hero-poster-800.webp` 200, both media-scoped image preloads present in `<head>`, font preloads down from 4 woff2 to 1 (Inter). Net effect on score was ~neutral (+1); it confirmed the LCP is chain-bound not byte-bound (see finding above), which is the useful result.
- **Not pursued (parked):** dropping the faint mobile bg image for a CSS tint was the presumed "decisive LCP fix" but round 3 showed the poster bytes are not the bottleneck, so it would help little; stripping client-side Sentry from marketing routes is a minor JS trim. The one lever with real headroom is the CDN/TTFB path above. All parked per the stop decision.
- **⚠️ Commit hygiene note:** commit `bd6468f` unexpectedly also swept in 11 unrelated already-dirty WIP docs (`06_marketing/content-machine/*`, `01_strategy/STATE.md`, a new substack asset) despite explicit path staging; no git pre-commit hook exists, most likely the VSCode Source Control integration auto-staged them. Not rewritten (already pushed). Worth confirming those content files were ready to ship.

---

## OPEN DECISION: retest CTA has no mechanism (2026-07-17)

Keith flagged that the "Book a retest in 3 months" button on healthy results just links to `/kits` with no reminder/scheduling behind it, and "3 months" contradicts the 6–12 month cadence promised across the marketing site. Written up in `docs/2026-07-17-retest-cta-mechanism-decision.md` (status PROPOSED). Recommends: Phase 1 honest relabel + timing fix (one-liner in `classifier.ts`), Phase 2 real `retest_due_at` reminder via Customer.io for all kit buyers (not just subscribers). **Owed:** Ewa signs the per-result cadence; Keith picks the relabel and whether Phase 2 is pre-launch. **Tracked in ClickUp** (Sprint: Pre-launch): parent `869e66e8p` + 6 subtasks. Cadence sheet: `04_products/results-engine/2026-07-17-retest-cadence-table.md`. **Resolution 2026-07-17:** all-clear cadence of **6–12 months is agreed** (already the live marketing figure), so the button "3 months" + card copy "3–6 months" are just drift to align down to it; no clinical sign-off owed, Phase 1 dev task `869e66eau` unblocked. **Symptom overlay DECIDED** (build now, self-policing scope): in range but still symptomatic → step 1 check an untested panel we supply (Kit 1↔Kit 2; Kit 3→GP), else GP. Only a **light copy tick** from Ewa remains (red-flag GP-first line + the two symptom→panel wordings, on the normal results-copy pass); task `869e66e9c` downgraded from blocker.
- **Phase 1 timing fix DEPLOYED 2026-07-17 (commit `f5e6912`, pushed to main).** `classifier.ts` retest CTA label `Book a retest in 3 months` → `Retest in 6–12 months`; `biomarker-copy.ts` three retest lines (optimal-T, ft-normal, default-normal) aligned `3–6`/`3 to 6` → `6–12`/`6 to 12 months`. Compliance pre-flight clean (0 HARD). `npm test` green. Dev task `869e66eau` done. (Optional: content-approval log entry, not self-approved.)
- **Phase 2 reminder: LIVE 2026-07-18.** Code deployed (commit `8beec61`, `next build` green), `RETEST_REMINDER_ENABLED` flipped ON in Coolify, and CIO campaign **23 activated (state `running`, email action 106 `sending_state: automatic`)**. Note: Keith activated the campaign but the email action was still `draft` (a running date-campaign with a draft message silently sends nothing); flipped to `automatic` to complete activation. Zero immediate sends: every stamped `retest_due_at` is +6 months forward, so the first real reminder is ~6 months out. Code mechanism: `buildCioTraits` (`lib/results/processResult.ts`) stamps a `retest_due_at` CIO attribute (result date + `RETEST_REMINDER_MONTHS` = 6, start of the agreed 6–12mo window) on a whole-result all-clear, behind new flag `isRetestReminderEnabled()` (`RETEST_REMINDER_ENABLED`, default OFF, `lib/flags.ts`). Unit test `scripts/test-retest-reminder.ts` (9 assertions, wired into `npm test`); `npm test` + `tsc --noEmit` green.
  - **CIO campaign built DRAFT 2026-07-18 (env 219186):** `seq-07: Retest Reminder (all-clear)`, **campaign id 23**, type `date`, `date_triggered_attribute = retest_due_at`, frequency `once`, 9:00 customer TZ / Europe-London fallback. Email action **106** (template **54**), `sending_state: draft`, from Keith (identity 1), subject "Time for a fresh reading", preheader set. Copy = `frontend/email-templates/sequences/retest-reminder-all-clear.md` + rendered HTML `email-templates/html/retest-reminder-all-clear-email-1-*.html`. CIO liquid lint 0 errors (only `{% unsubscribe_url %}`). NOT activated.
  - **Still to do before live:** ~~(a) Ewa signs the email copy~~ **DONE: CA-022.** ~~(b1) deploy the Phase 2 code~~ **DONE: commit `8beec61`.** **(b2) flip `RETEST_REMINDER_ENABLED=true` in Coolify → Settings → Environment Variables (runtime var; needs container restart); KEITH's action, not doable from the repo.** ~~(c) verify date interpretation + backfill + test-send~~ **DONE 2026-07-18:** CIO stored a seeded Unix-seconds `retest_due_at` (format accepted); backfill is a non-issue (activate with `backfill:false`, and every stamped date is +6mo forward so no past population exists); test email sent to keith@andro-prime.com via `verify/email`. ~~(d) suppression filter~~ **DEFERRED to supplement launch**: `subscription_started` never fires in Phase 0, so the subscriber population is empty and there is nothing to suppress; add it (as a `global_exit_condition` on the subscriber segment) alongside the discount when supplements ship. ~~(e) human activation go/no-go~~ **DONE 2026-07-18: Keith activated; the email action was still `draft` (a running date-campaign with a draft message silently sends nothing) so it was flipped to `automatic` to complete activation. Campaign LIVE.** (f) subscriber discount deferred to supplement range. NB: seeding the test profile fired one bounce via seq-03c and left an un-deletable profile (agents can't delete); Keith deleted `retest-verify@andro-prime.com` in the UI 2026-07-18.
  - **All committed:** code + test + email copy/HTML + CA-022 record in `8beec61`; the `package.json` test wiring, `test-account-export.ts`, CA-022 register row, and this STATE.md committed 2026-07-18. Dev task `869e66eb0`.

---

## Bucket A/B account + results features: LIVE 2026-07-19 (all three flags ON in Coolify, deployed by Keith); copy signed off (CA-023/024/025); built dark 2026-07-17 (0bd4e9a)

Implemented from `docs/2026-07-17-bucket-ab-implementation-plan.md` (research-driven, from `docs/2026-07-17-research-to-feature-gap-analysis.md`). Everything is behind a default-OFF env flag; with flags unset the app is byte-identical to before. `npm test` green (account-export suite = 28 assertions added), `npm run build` green.

- **F4 account data controls: `ACCOUNT_DATA_CONTROLS_ENABLED` (OFF).** Adds a "Data & privacy" section to `/account`: a data-use statement ("we do not sell your data", EU residency, Art 9 consent, Vitall = independent controller), a **results CSV export** (`GET /api/account/export`, read-only, reuses `getDashboardData`→`resultsToCsv`), and an **erasure REQUEST** (`POST /api/account/erasure-request` → `emitOpsAlert` only; records a request, deletes nothing). Ship gate: **copy APPROVED 2026-07-19 (CA-024); `ACCOUNT_DATA_CONTROLS_ENABLED` flipped LIVE 2026-07-19; ops-alert address confirmed 2026-07-19 (Keith): erasure requests route to the monitored `keith@andro-prime.com`, 30-day SLA from receipt.** Retention/deletion policy DRAFTED (`03_compliance/deletion-policy/retention-and-deletion-policy.md`), pending sign-off; automated deletion still not built (request-only feature is fine live).
- **F5 kit-scope note: `KIT_SCOPE_NOTE_ENABLED` (OFF).** "What this test did not tell you" paragraph on a normal-T Kit 1 result (in `KitTabs`), enforcing the Kit 1 testosterone-only scope rule and defusing the Kit 2 cross-sell as an upsell. Ship gate: **copy APPROVED 2026-07-19 (CA-025), pre-flight 0 HARD; `KIT_SCOPE_NOTE_ENABLED` flipped LIVE 2026-07-19.**
- **F3 / U1 GP handoff: `GP_HANDOFF_ENABLED` (OFF).** Printable one-page GP summary at `/results-dashboard/handoff` (identity, UKAS-accredited-lab line per Vitall §3.6, per-kit marker table with reference ranges, "questions to ask your GP", not-a-diagnosis disclaimer using "Ewa-approved recommendation logic" framing). Zero new dependency: print-CSS HTML + browser "Save as PDF" (`PrintButton`). Dashboard shows a "Prepare GP summary" link only when a result routes to a GP referral. Ship gate: **copy APPROVED 2026-07-19 (CA-023) by Ewa via Keith; `GP_HANDOFF_ENABLED` flipped LIVE 2026-07-19.**
- **Renderer decision:** no PDF lib in the repo; Vitall's `results_pdf` sits unused in `lab_results.raw_payload`. Chose zero-dependency CSV + print-CSS. A server-generated PDF (jspdf/puppeteer) is a later, deliberate dependency decision.
- **Not verified:** live authenticated render-drive of the three surfaces (both dashboard/handoff pages `getCurrentUser()`-gate before the dev-fixture path, so it needs a logged-in test user + seeded result). Do this with the DevFixtureBar before flipping any flag.
- **Status: LIVE 2026-07-19.** Committed `0bd4e9a`; copy sign-offs CA-023/024/025 recorded; all three flags set to `true` in Coolify and deployed by Keith. Authenticated smoke-test of the three surfaces is Keith's eyeball (agent has no logged-in prod session). Remaining: sign off the DRAFT retention/deletion policy (Keith + solicitor + Ewa; does not block the live request-only feature). The F4 ops-alert-address item is confirmed (2026-07-19, `keith@andro-prime.com` monitored).

### ⚠️ OWED to compliance: automated deletion is blocked on a missing policy

`03_compliance/deletion-policy/` is **empty**: there is no retention schedule. The erasure-*request* mechanism above is deliberately request-only. **Automated hard-delete must not be built until a retention/deletion policy exists**; it would have to encode legal retention rules (UK tax 6-year record-keeping, the Vitall independent-controller copy we cannot compel to delete, Stripe + Customer.io records keyed on email). Owner: Keith/solicitor + Ewa, against `03_compliance/gdpr-readiness-checklist.md` §6 (SAR/erasure, currently unchecked). The `kit_orders.data_purged` status already notes a Vitall-side purge does not cascade to our copy; that cascade is the unbuilt process.

---

## Content-engine on-ramp + local MCP tooling (2026-07-14)

- **New script `frontend/scripts/content-engine/seed-pipeline.ts`** bridges hand-authored `/article` drafts into the DB pipeline. Hand-authored articles skip the keyword-queue, so they never get a `content_pipeline` row, so Draft-Writer / Signoff-Concierge never see them and no ClickUp review task is created. `seed-pipeline.ts --slug <slug>` seeds a `brief_ready` row (idempotent; reuses Draft-Writer + Signoff-Concierge rather than duplicating them). Proven end-to-end: `free-androgen-index` seeded, drafted into `blog_articles`, and **ClickUp review task `869e4uwk5` created** with the pipeline at `in_review`. Do NOT use `/publish-article` for DB-pipeline articles: its build+push forces the Coolify redeploy the DB workflow exists to avoid.
- **Local MCP servers wired in the gitignored `.mcp.json`** (headless-capable, unlike the claude.ai OAuth connectors): `supabase` (`@supabase/mcp-server-supabase`, read-only, project-ref `phqrjtnflovicgkngieu`), `clickup` (`@taazkareem/clickup-mcp-server@0.14.4`, `CLICKUP_API_KEY` + team `90121729875`; the free/LIMITED tier covers the task/comment tools we use), plus the earlier `dataforseo` creds fix. Secrets are inlined because `${VAR}` substitution does not reach the MCP process. Stripe deliberately NOT wired (the package has no tool-scoping, so a live key would expose writes; use a read-only restricted key or the hosted connector). Customer.io stays on its hosted connector (no clean local stdio package).
- **Publish-strand bug found + fixed (2026-07-15).** `publishDue` in `orchestrator.ts` now re-reads the ClickUp task's CURRENT due date each tick, instead of trusting the `target_date` frozen into `content_pipeline` at approval. Root cause: `cholesterol-test` was Ewa-approved 2026-06-24 with a real due date of 2026-07-02, but the DB publish slot was stuck at a placeholder `2027-01-01`, so it sat approved-but-unpublished for ~3 weeks (every tick marked it "scheduled"). `syncApprovals` captures the due date once and never reconciled it. Fix keeps ClickUp authoritative for the slot until the article is live (falls back to the stored value if the ClickUp read fails).
- **Two articles published this session (2026-07-15):** `how-to-read-blood-test-results` (Ewa-approved, was waiting on the daily tick) and `cholesterol-test` (the stranded one above), both flipped live via the orchestrator, no Coolify redeploy. Content board now: **15 published**, plus `free-androgen-index` correctly `in_review` on Ewa (her task still "to do").

---

## Integrations: live status

### Stripe: LIVE for kits
- Kit checkouts return `cs_live` on production; live keys + `STRIPE_PRICE_KIT_1/2/3` populated in Coolify. Supplement price IDs (`_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK`) **intentionally unset** until Phase 0b; the subscription route returns a clean 400, not a 500, and supplement pages are coming-soon + waitlist.
- **Live prices:** Kit 1 £99 `price_1Ta1IoLU0SDiIplTCBeHUi4g` · Kit 2 £119 `price_1TcaopLU0SDiIplThAK94iVM` · Kit 3 £179 `price_1Ta1KxLU0SDiIplTZXYzeJ4X`. Kit 2's original `...4WwdIKIS` was mispriced £117 (£2 undercharge), now archived; resolved + verified 2026-05-30 (prices are immutable, so a corrected one was created).
- **Live webhook endpoint created 2026-06-25** at `/api/webhooks/stripe`: 4 events (`checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`). It did **not** exist before: the first real live purchase charged the card but fired no webhook (no order, no dispatch) until this was created + `STRIPE_WEBHOOK_SECRET` re-set. Idempotency via `processed_stripe_events`. Subscription/invoice events are inert until Phase 0b.
- **Coupons (live):** `SUBSCRIBER10` (`oyOOwEuq`) + `LAUNCHDAY10` (`oayVKPWk`), auto-applied via `?discount=<CODE>` → env `STRIPE_COUPON_*` (commit `f3f963d`). Verified end-to-end (Kit 2 + SUBSCRIBER10 → £107.10; Kit 1 + LAUNCHDAY10 → £89.10). `SUBSCRIBER20` intentionally does not exist in live. No promotion codes (coupon auto-apply only).
- Admin cash position: `lib/admin/getCashPosition.ts` → `stripe.balance.retrieve()` (GBP only), Keith-only `/admin/dashboard`, graceful-degrades to 0 + inline error on failure.

### Customer.io: transactional LIVE + verified
- Verified on a **real** purchase (2026-06-25/26) after fixing the email-identifier **collision**: every CIO call now keys on email (`lib/customerio/identity.ts`, commit `61e4a39`). Workspace 219186, EU datacenter.
- Live + verified: T-01/02/03/09; seq-03a + seq-03b; **seq-03c/03d results-signal fix** (shipped 2026-06-26, `e8ea86e`): seg-22 redefined to the `results_all_clear` attribute, seq-03d repointed to the `borderline_nurture_consented` event; live retest passed (kit3 all-clear → seg-22, kit2 low-VitD → seg-21, consent → event delivered after fixing Email 1's `event.kit_name` silent-drop, `3a87392`). Spec: `docs/seq-03-results-signal-fix-spec-2026-06-26.md` (ClickUp 869dw3ge8).
- CA-019 (collection copy) + CA-020 (testosterone-value reword) approved. `unsubscribe_url` uses the `{% %}` Liquid tag.

### Vitall: lab E2E proven
- Live purchase → order → dispatch proven 2026-06-25 (order `322942444`). Webhook lands at `/api/webhooks/vitall` → QStash → `/api/jobs/process-result`. The lab does **not** retry failed webhooks; QStash must be live before the pipeline activates.

### GA4: live
- `G-D5M4J5M3F6` + consent banner, in production since 2026-06-18 (server-side mirror + client gtag; `lib/analytics/`). Phase 1 (server-side Measurement Protocol mirror) verified via GA4 Realtime 2026-06-16; Phase 2 (Consent Mode v2 default-denied + `CookieConsent.tsx` brutalist banner, Accept/Reject equal weight per ICO) live 2026-06-18. Analytics is the only togglable category; ad/personalization stay permanently denied (no ad pixels).

### Low-T routing + nurture: DEPLOYED 2026-06-07, nurture campaign DRAFT

- Low-T (T<12) → **GP referral, no upsell** is live (`classifier.ts`, `resolveCta`); the founding-member list was **taken down** in the live app (join route → 410, `/founding-member` → 307 `/kits`, FM removed from nav/homepage/sitemap). Dormant infra deliberately left (`JoinForm`, `founding_member_list` table 0 rows). Static canonical-site FM sweep also done (`e280a89`); legal T&C/privacy FM sections deliberately left (describe a dormant mechanism, need Ewa review; not a promotion).
- **Consent mechanism built + live:** `POST /api/lowt-nurture/consent` (un-pre-ticked opt-in on the low-T card, below the GP CTA) records consent then sends `low_testosterone` + `lowt_nurture_consent` traits to CIO + fires `lowt_nurture_consented`. Version const in `lib/results/lowtNurtureConsent.ts` (`2026-06-04-v1`), version-locked to CA-014. Migration `lowt_nurture_consent` applied to prod.
- **`buildCioTraits` gating (compliance):** no longer emits `low_testosterone`/`testosterone_value`/`borderline_testosterone` at result-processing: the consent route is the sole gate (closed a pre-consent special-category exposure to a US processor). Energy traits (`low_vitamin_d`/`low_b12`/`elevated_crp`/`crp_level`/`low_ferritin`) are **gated in code on the CA-018 health-processing consent as of 2026-07-07** (fail-closed helper `lib/results/healthProcessingConsent.ts`; raw `crp_level` kept but gated: seq-03a's hs-CRP >10 branch compares the numeric), **deploy pending**. ⚠️ Deploy sequencing: must ship **with or after** the CA-018 checkout-consent deploy, otherwise no customer has consent stamped and seq-03a personalization silently degrades. Conservative default per the open DPIA §4 decision; reversible if Keith + Ewa document a lawful basis instead. **CIO recon 2026-07-07 (live workspace 219186):** seq-03a enters via segment 21 (attribute-change→true on `low_vitamin_d`/`low_b12`/`elevated_crp`) so non-consented users simply never enter (intended degradation, no misfire); `crp_level`/`low_ferritin` appear in no trigger/segment (Liquid-only); seq-03c uses only ungated `results_all_clear` (segment 22); all other running campaigns have empty filters. Profile cleanup NOT needed: all 6 existing CIO profiles are bare (no health attributes stamped). CIO transfer safeguard resolved (CIO DPA = EU SCCs + UK Addendum + DPF cert; no bespoke IDTA).
- **CIO campaign 5** ("seq-03b Low-T Nurture, consented") repurposed to trigger `lowt_nurture_consented`, 3 education-only emails (day 0/+3/+14), **state DRAFT by design**: go-live is a human go/no-go; no TRT/treatment promises. Lawful basis = Keith interim-approved Art 6(1)(a)+9(2)(a) (`03_compliance/2026-06-04-lowt-nurture-lawful-basis.md`); solicitor confirmation task `869d99kzh` open post-launch.

### Kit cross-sell repair: 2026-07-08

An audit found all three kit-to-kit cross-sells non-functional. Repaired + a governing rule set (Keith, 2026-07-08): **post-result cross-sell = the complement, never the superset** (`04_products/results-engine/2026-07-08-post-result-cross-sell-complement-rule.md`).

- **Kit 1 → Kit 2: LIVE, unconditional.** Normal-T Kit 1 returns `secondaryCta: CTAS.kit2CrossSell` (→ `/kits/energy-recovery`). The prior `energy_symptoms` gate was dropped (signal never captured; Kit 2 is the honest default). Includes borderline T (12–<15). Pre-existing compliant Kit 2 helper copy.
- **Kit 2 → Kit 1 broken link: FIXED.** `kit1CrossSell.href` was `/kits/testosterone-health` (404, no such route); corrected to `/kits/testosterone`. Fires for Kit 2 multi-deficiency or Vit-D/B12 + age ≥40. Regression added.
- **Kit 3 cross-sell: removed.** The briefly-added `kit-3-cross-sell` CtaType is deleted; Kit 3 re-sells markers a buyer already has, so it has no post-result cross-sell role. It stays a front-of-funnel default (the test-selector) + direct-traffic product. (Closes the old "engine gap" line by retiring the concept, not building it.)
- **Dead code removed:** the retired `foundingMember` CTA (type `founding-member-list`, unreferenced) deleted from the registry + CtaType union.
- Tests: classifier suite 22 assertions, + consent-gate 37 + maintenance-offer 42; tsc + build clean.

### All-clear maintenance offer: BUILT DARK 2026-07-07, flag OFF, pending Ewa sign-off

- New `maintenance-offer` CtaType + `resolveCtas()` all-clear branch (below every GP-block/GP-referral and low-T/borderline check), gated on `MAINTENANCE_OFFER_ENABLED === 'true'` (server-side, read per call, default OFF = provably inert; flag-OFF output byte-identical, test-asserted). Copy rendered verbatim from `07_sales/funnel/all-clear-maintenance-offer-copy.md` (one card, per-kit claims block via `maintenanceClaimsForKit()`); anchor-card pattern renders the offer once per all-clear result. Button → `/supplement-waitlist` (Phase 0a; no checkout built).
- Events `supplement_offer_shown` / `supplement_offer_clicked` wired through the first-party `/api/events` + GA4 pattern with `segment: 'all_clear'`; fire only when the flag is on.
- Tests: `scripts/test-maintenance-offer.ts` (41 assertions) in `npm test`; suite + tsc + build clean.
- **Ship path:** Ewa signs `07_sales/funnel/all-clear-offer-signoff-pack.md` → flip the env flag + deploy. A "no" ships nothing.

### Lab-cancel ops alert: DEPLOYED 2026-06-30/07-01, alert campaign DRAFT

- Vitall `order-cancelled` → status flip + `emitOpsAlert()` live (commit `9ca878e`, E2E-verified: route returned `202 {orderCancelled:true}`, DB flipped, ops profile got `internal_ops:true`). **CIO campaign 22** ("OPS: Lab Order Cancelled", transactional, trigger `lab_order_cancelled`, template 53) is **DRAFT**; event fires but no email sends until Keith activates it (email delivery not yet tested). Never auto-refunds.

### Ewa author / Person schema: credentials verified

- `lib/authors.ts` Person schema live with verified credentials (GMC **4758565**, licensed GP; `sameAs` = `https://www.gmc-uk.org/doctors/4758565`; "Harley Street TRT-trained" substantiated, cert filed at `03_compliance/credentials/ewa-trt-training-2025.md`). Approved vs avoid phrasings are in that credential file. **Open (low priority):** professional photo (still `/og/default.png` placeholder), LinkedIn `sameAs` (add once her profile is populated), cert PDF storage decision.

### Tracker v1 ("My Story"): designed, NOT built

- Full design spec exists as mockups in `docs/mockups/` (`tracker-v1-scenarios.html` is the primary reference: 8 scenarios, 4 marker-card states, proportional-time sparkline rules, declining-marker + threshold-crossing rules, hs-CRP lower-is-better). Queued for M3–M4 post-launch. **All tracker display logic is frontend-only**: the DB already holds everything; the gap is the display layer (no `Sparkline.tsx`/`TrendBadge.tsx`/`timeline_events` table). Open with Ewa before code: trend-classifier algorithm, retest-date calc, supplement-event API schema.

### Central CTA routing (`kitCTA`): BUILT 2026-07-09, articles not yet migrated

- `lib/content/kitCTA.ts` is the single pillar → CTA-target map, mirroring `06_marketing/seo-ai-search/content-atomisation-model.md` §4. `components/marketing/InlineKitCTA.tsx` takes a `pillar` prop and resolves through it. Guarded by `scripts/test-kit-cta.ts` (wired into `npm test`): asserts every pillar hits a live route, no CTA points at `/lp/*` or the FM list, kit slugs match `lib/pricing.ts`, the three no-live-product pillars hold at email capture, and **Pillar E throws** (Ewa-gated andropause).
- **Built because it did not exist.** Three docs instructed routing through a central `kitCTA` config that had never been written; nine articles hard-coded `ctaHref` instead. Surfaced by the 2026-07-09 content-machine dry run.
- **Migration COMPLETE 2026-07-09.** All **15 articles** (not nine: six existed only in the DB) now name a pillar. Deployed, imported, revalidated, and verified live: all 14 published articles return 200 with byte-identical href, UTM string, and button label; the draft verified via `/blog/preview`. Redirecting a pillar is now one line in `lib/content/kitCTA.ts`.

**Safe order for any future content+code change** (learned the hard way, see below): deploy the component → confirm it is live by rendering a **non-public draft** through `/blog/preview/<slug>?token=$PREVIEW_SECRET` → `import-blog-to-db.ts` → `/api/revalidate` → smoke test. Note the asset-fingerprint trick does **not** detect a server-component deploy (client chunks are unchanged); the draft-preview canary does.

### Two landmines found while migrating (both fixed 2026-07-09)

- **The MDX mirror was stale on `status`.** `b12-blood-test`, `fbc-blood-test` and `ferritin-blood-test` carried `status: draft` in `content/blog/` while the DB had them **published**. `import-blog-to-db.ts` takes status from frontmatter, so running it **silently unpublished three live articles**. This actually happened during the migration and was caught and reverted within minutes. Mirror corrected. **Before ever running the import, diff the mirror's `status:` against the DB, not just the body.**
- **Content and code must ship together, code first.** The DB body and the deployed component are one unit. Importing `pillar=` bodies while the old `ctaHref`-only component was still live **500'd every blog article**. Restored by rolling the DB back within minutes. The component is now backwards-compatible (accepts both), so the safe order is: **deploy the component, confirm it is live, then import the content.** Never the reverse.

---

## Content-engine Action: Content Library mirror step added (2026-07-13)

- `content-library-sync.ts` added to `scripts/content-engine/` (reuses `clickup.ts`; hierarchy + task helpers appended there). The daily `content-engine.yml` run now has a "Content Library mirror" step after the blog-mirror sync (`continue-on-error: true`, so it can never fail the engine). One-way git → ClickUp: upserts one task per `06_marketing/content-machine/assets/*.md` into list `901219526361`; fingerprint-diffed, idempotent (verified 2026-07-13: 0/0/3 unchanged on re-run). Owner docs: `06_marketing/content-machine/` (STATE + build spec).
  **[CORRECTED 2026-08-01 by Phase 1: the mirror's SOURCE moved, its direction did not.** The status it pushes now comes from `content_assets`, because the asset files no longer carry one. Still one task per asset, still one-way, still read-only in ClickUp. Anything in this entry that reads "git wins" is now "the database wins".]**

---

## Phase 0b activation checklist (supplements, deferred)

1. Create live Stripe products + prices for Daily Stack / Collagen / Complete Men's Stack.
2. Add `STRIPE_PRICE_DAILY_STACK` / `_COLLAGEN` / `_COMPLETE_STACK` to Coolify; redeploy.
3. Configure the Billing customer portal in **live** mode (per-mode setting); required for `/api/checkout/portal`; currently unconfigured because there are no 0a subscriptions.
4. Decide dunning: **Stripe-native** Smart Retries vs **CIO T-07** emails; mutually exclusive, running both = double emails. Recommendation: Stripe-native at launch, CIO T-07 as a later reversible brand upgrade.
5. seq-04 Day-75 retest needs `SUBSCRIBER10` (already live); optionally set a fixed `redeem_by` window when the sequence goes live. seq-05 pause option needs the Stripe subscription pause confirmed live in the portal.

---

## LP lab-claim standardised (2026-07-25, deployed)

- The three kit landing pages (`app/lp/{testosterone,energy-recovery,hormone-recovery}`) used a mix of "UKAS accredited lab" (short) and "UKAS ISO 15189 accredited lab". Standardised all instances (visible hero line + SEO metadata) to **"UKAS ISO 15189 accredited lab"** (CA-026 standard; substantiated by Vitall services agreement §3.6). Committed `de074da`, deployed via Coolify, and verified live on production (old short-form absent on all three).
