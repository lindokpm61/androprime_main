# Direction F go-live: the single plan

**Created:** 2026-09-16 · **Owner:** Keith · **Branch:** `redesign/direction-f` (183 commits
ahead of `main`) · **Production:** `main` @ `4a43864`, built by Coolify

> **THIS FILE IS ITS OWN STATUS STORE.** Tick the boxes here. Do not record progress in a
> session note, a handoff or a ClickUp comment and expect this to know about it.
>
> **It exists because the last plan did not do that.** `~/.claude/plans/we-need-to-run-parsed-oasis.md`
> was written 2026-09-14, executed across two sessions on the 15th and 16th, and **never
> ticked** — it reads today exactly as it read before any of it ran, while its actual state
> lived in three other documents it does not point at. By 2026-09-16 it was wrong about the
> copy register's size (48 rows; it is **78**), the commit count (160; it is **183**), two file
> line numbers, and **three of its nine "do not re-derive these" blockers**, all of which had
> been resolved. A plan and the record of its execution are two artefacts with two half-lives
> and they drift apart silently, because neither one is wrong.

## What this supersedes, and what it does not

| Document | Status |
|---|---|
| `~/.claude/plans/we-need-to-run-parsed-oasis.md` | **Superseded for sequencing.** Keep it: phases 0–2 are done and its method notes (why a production build, why exit 2, why `shot.js`) are still the reference |
| Defects artefact, *Defects Before Launch* — <https://claude.ai/artifact/A2fruYqhLty8Ve9N6ibdf3> | **Still the record of WHAT is wrong.** This file is the record of WHEN each one happens |
| `qa/direction-f-migration-audit.md` | **Still the evidence.** ✅ Its Go/no-go table listed CA-045 as blocker 1, written two minutes after CA-045 was approved; **corrected 2026-09-16**, along with two "Owed to Keith" items that had been done for a day |
| `implementation-checklists/membership-switch-on.md` | **Not superseded. It is Gate E**, and it is a different gate from this one |

---

## The structural change: these are TWO gates, not one

Both source documents treat go-live as a single event with everything in front of it. It is not.

**Eleven of the seventeen open defect rows are not about going live at all.** Six are the
membership switch-on (`3c`, `3d`, `P1`, `P2`, `P4`, `P6`) and `MEMBERSHIP_ENABLED` ships
**false**. Five more are live on `main` today (`H1`, `H2`, `H3`, `S6`, and half of `S5`), so
they are not made worse by merging and not fixed by waiting.

**Separating them takes the go-live gate from seventeen items to five.** That is the whole
value of this document.

---

## Gate A — before the merge

**Five items. Nothing else blocks.** 🔄 **A1 is CLOSED as of 2026-09-16 and A3 as of 2026-09-17,
so three remain: A2 signatures, A4 the screenshot pass, A5 the session-carried sweep.**

### A1 · ✅ CLOSED 2026-09-16 BY OPTION 1. CA-046 IS APPROVED, BOTH SIGNERS, AND THE BUILD IS DONE.

- [x] **Option 1 — send the packet and wait. TAKEN, AND IT CLOSED THE SAME DAY.** Keith sent it;
      Ewa answered three rounds in a single evening. **8 asked / 8 answered · 8 / 8 · 1 / 1**, every
      count met exactly and nothing inferred from an adjacent answer. Keith gave business sign-off
      ("CA-046 approved") as a **separate act with separate evidence**. ClickUp `869exuphq` is
      `approved`. Every ruling that created work is built, tested and looked at:
      `typecheck` / `test` (44 suites) / `build` all exit 0, `scan.js` **0 HARD / 0 REVIEW** where it
      was 1 REVIEW, and every screen rendered through `shot.js` at 1320 and 390 with `--expect-text`.
      Record: `03_compliance/content-approval/ewa-packet-ca-046-public-demo-2026-09-16.md`.
- [ ] ~~**Option 2 — decouple, and merge without the demo.**~~ **Not needed. Not taken.**

> 🔴 **A1 CLOSING LEAVES ONE UNACTIONED LINE IN THE CODE, AND IT IS NOT A TICKBOX ON THIS GATE.**
> `app/(demo)/demo/page.tsx:90` still sets `robots: { index: false, follow: false }`, and the comment
> above it at line 24 says it stands *"UNTIL THE COMPLIANCE GATE CLEARS"*. **The gate has cleared and
> that line has not moved**, so as things stand the demo ships hidden from Google. **Lifting it is a
> separate, deliberate act from closing this gate** and it is the one that actually makes the page
> public; it is Keith's, and nothing here should be read as having taken it.
>
> ⚠ **One condition survives the approval, the same way two survived CA-045.** Copy-register row 32c's
> underlying question reaches `/demo` and has never been put to anyone: whether the *"Ask the
> clinician"* benefit may be named on a public surface **at all**, given the register records that the
> live member screen has only ever rendered that block EMPTY. CA-046 Q6 added the approved Phase 0
> qualifier, which is a **mitigation and not an answer**. Ewa + Keith.
>
> 🟢 **What the three rounds changed on the branch**, so a reader does not have to reconstruct it: the
> demo panel re-cut to three markers carrying a verdict (testosterone held at 10.5 deliberately,
> because it is the only value producing the GP route her Q3 preserved); the results list reordered so
> a referral is not the first badge; the `equivocal-testosterone` sentence reworded **for the demo
> screen only, live report copy untouched**; Ewa's name off the public demo in **both** places;
> the Phase 0 qualifier added in both places the benefit renders; the slider presets moved onto the
> engine's own words, **derived by classifying each preset value rather than typed**; two
> efficacy-adjacent lines reworded; the month-one notice moved to the third person; and the
> supplements bullet removed by **importing `MEMBERSHIP_INCLUDES` rather than deleting the string**.

<details><summary>The original A1, kept because option 2's reasoning is still the reference if a
future surface needs decoupling</summary>

CA-046 is the only external blocker on this gate, and it is with Ewa. `/demo` puts a full
results report, a membership price and ~2 dozen un-pre-flighted prototype strings on an
ungated surface.

- **Option 2 — decouple, and merge without the demo.** `/demo` is **not flag-gated**: it is a
      plain route at `app/(demo)/demo/page.tsx` and the homepage links to it at
      `app/(marketing)/page.tsx:749`. Adding `DEMO_ENABLED` is the house pattern exactly —
      `lib/flags.ts` holds nine of them, all default OFF, and its own header states the property
      that matters here: *"with the flag OFF the app is byte-identical to before the feature
      existed."* Gate the route and the CTA, ship, and let CA-046 clear on its own timetable.

⚠ **Zero traffic does not soften option 1.** The gate governs SHIPPING, and a page is live
whether or not anyone visits it. **That is exactly why option 2 is not a dodge:** a flagged-off
route is not shipped.

</details>

### A2 · 🟡 The copy register's owed signatures — KEITH'S HALF IS DONE, Ewa's is not

The pre-flight itself is **done** (Phase 4, ran 2026-09-15, first time ever; the Closed section
is written and every one of the 78 rows carries a disposition and an owner). What is left is
signature, not work.

▶️ **WORK IT FROM `a2-signoff-packet-2026-09-17.md`, in this directory.** It is the 78-row register
reduced to the rows that are actually owed, grouped so the batch-able ones go in one decision, each
with what changed and what is being agreed to, and the rulings stated as questions with options.

🔄 **CORRECTED 2026-09-17, AND THE OLD FIGURE IS WHY THE PACKET EXISTS.** This item read *"26 rows
needing sign-off, 5 rows needing a ruling"*. That was right **on 2026-09-15**, the date of the
row-by-row disposition table it was copied from. **Eight of those thirty-one have been resolved
since** — by CA-046 on the 16th, by CA-050/051/052 on the 17th, and by two rulings Keith gave on the
16th — and nothing decremented the count, because the disposition table is the only thing that writes
it and it runs once. Each was re-tested against the register and the approval records rather than
re-quoted.

- [x] ✅ **14 rows needing sign-off — Keith. ALL RESOLVED 2026-09-17:** thirteen signed (13, 24, 25,
      14, 35f; 4, 27, 31, 44, 35d, 35e; 45; 32) and row `7` fixed on his "fix it" ruling. ⚠ **Row 7
      was FIVE instances, and the row names two surfaces** — the same false count was live on
      `/test-selector` itself and on `/go`, neither of which row 7 lists
- [x] ✅ **1 ruling — Keith. BUILT 2026-09-17.** Row `38a`, ruled "build it": `/supplement-waitlist`
      now has the product control its FAQ has always promised. ⚠ One clause of that answer, *"You can
      change your mind later"*, is **not** built and is not recorded as built
- [ ] 🟡 **Row 32 is signed by Keith and is NOT approved**, because it carries **two** required
      signers: its own cell says *"Ewa + Keith for anything read as a clinical cadence claim"*, and
      `content-approval/README.md` approves a submission only when all required signers have signed.
      Her half is item 6 of the sign-off email. **Do not read the row as cleared on his signature**
- [ ] 🔴 **4 rows plus 1 ruling — Ewa.** Rows 22, 23, 32c, 33 and ruling 6, plus the cadence half of
      row 32. ⚠ The old wording said the 26 were Keith's; **the register's own by-owner split says
      otherwise**. ✉️ **Drafted 2026-09-17 as a seven-item letter-reply email, Gmail draft
      `r74807119575631549`, validated and NOT SENT.** It rides the citation swap already owed to her
      from 2026-08-21 (`869e9fr6x`). **Sending is Keith's act.** When the letters come back, count
      them against the seven and treat any gap as unanswered rather than closing it by inference
- [ ] **1 click, no copy decision:** ClickUp `869f1wwch` → `approved`. Row 48d, the M7 SEO commission
      Keith approved on 2026-09-14; that list admits only a named human
- [x] Register row 45 is `P5`'s four new sentences on `/subscription/confirmed`. Inside the 14, signed with them; do not track it twice

✅ **Read the headline before deciding how heavy this is: the merge REMOVES fifteen HARD
compliance findings and adds none** — 18 on `main` today against 3 on the branch, and sixteen
of main's eighteen are live verdict-vocabulary defects the branch fixes. **Waiting is not the
conservative option here.**

### A3 · ✅ CLOSED 2026-09-17. Both fixed, and the shape is now guarded rather than just removed.

From plan Phase 5, defect `S5`. Both verified still present on 2026-09-16. Take these two now
and leave the other two for Gate D — these are the two that reach a person.

- [x] `lib/activate/sendActivationLink.ts:29` — fell back to `http://localhost:3000` **inside an
      emailed link**. Dormant only while `NEXT_PUBLIC_SITE_URL` is set, and `S1` is the standing
      proof that exactly this class of variable goes missing with nothing noticing.
      **Now `headerStore.get('origin') || SITE_URL`.** It was the third *"resolve the origin from
      the request, fall back to the site"* caller, and `lib/site-url.ts` exists to hold that
      fallback once — its header already names the other two. This one was missed, and it was the
      only copy still spelling the fallback `localhost`
- [x] `lib/supabase/env.ts:1-3` — shipped a real project ref and anon key as **silent fallbacks**, so
      a missing variable yielded a working-but-wrong client instead of an error.
      **All three fallbacks removed; the getters now throw and name the variable.**
      ⚠ It was invisible because the fallback ref and the live project are the SAME today:
      production was correct by coincidence, not by configuration, and would have stayed correct
      right up until the ref changed. `isSupabaseConfigured()` is untouched, so the call sites that
      degrade gracefully still do

⚠ **The shared shape, and the reason both were here rather than in Gate D:** each degrades into
something that *works and is wrong* rather than something that fails. A fallback indistinguishable
from success is a decision to fail silently, taken by whoever wrote the `||`.

🟢 **What makes this closed rather than fixed-for-now: `verify-env-contract.js` gained assertion G**,
which fails on a hardcoded Supabase URL, a JWT literal or a `localhost:3000` origin anywhere in the
302-module corpus. **Assertion A sees a variable arriving empty; G sees what answers it** — the two
defects above both survived A precisely by supplying an answer instead of an error. It matches on
comment-stripped source, so the three modules that now *describe* the rule in prose do not trip it.

**Verified, and each check was made capable of failing first:** G was run against a probe
reintroducing all three literals verbatim (3 errors, exit 1) before being trusted at exit 0; the
throw path was exercised at 9/9 including the **empty string**, which is how the Dockerfile actually
delivers an unsupplied secret; `typecheck` and the full `npm test` chain exit 0.
🔴 **And the one real risk was settled by measurement, not reasoning: `SUPABASE_SERVICE_ROLE_KEY` is
deliberately not a Docker build secret**, so a build-time read would now break the Coolify deploy.
Making that getter throw *unconditionally* and rebuilding — the only version of the test that cannot
be masked by `.env.local` — passed, with the probe string absent from the output. No build-time path
reaches it.

### A4 · ✅ RAN 2026-09-17, CLEAN — bar the flag-gated routes

- [x] Every route at **1320 and 390**, `--theme light` only (`DESIGN.md` gap 1: dark mode is not
      implemented, so a dark capture proves nothing). **33 anonymously reachable routes, 62 captures**,
      route set taken from `scripts/route-list.js` rather than a second hand-written list
- [x] Used `andro-prime/12_operations/automation/shot.js`, plus `audit-viewport-sweep.js` as the
      machine gate: 🟢 **no overflow and no sub-AA light-ground text across 96 cells**, and it ran a
      **positive control first** — both probes found a planted overflow and a planted 1.9:1 text node,
      so the green is the probes working rather than the probes being silent
- [x] `--expect-text` on every shot, **derived from SOURCE** rather than from the rendered page:
      taking the string off the served page and asserting it is on the served page proves nothing,
      because a stale build hands you its own stale string and passes
- [x] Re-read both `impeccable` critiques. **All five homepage findings are CLOSED, not carried** —
      `.f-invert` 0→6 on each kit page, price objects 0→4, `RelatedArticles` now takes a `variant`
      prop, the dead hover lift fixed by a native `@layer reveal` (so unlayered interaction beats the
      reveal by construction rather than by a fifth higher-specificity modifier), and `.f-steps-open`
      deleted with its seven orphaned rules

**62 captures, 56 clean, 6 flagged, none a page defect.** Four are `/admin/dashboard` and
`/ops/content`, which 307 to `/auth/login` and are therefore **A5's, not A4's**; two are one bad
derived expect-string, where the deriver picked `/authors/[slug]`'s *empty-state* sentence, which
correctly does not render.

🔴 **NOT COVERED, and it needs its own pass:** `/membership`, `/account/membership` and
`/results-dashboard/handoff` are flag-gated and 404 in the shipping state. Measuring them needs a
**flag-on BUILD** — a restart will not do it, per the rebuild rule in Gate B and Gate E.

**This phase carries more weight than it would in a cutover**, because the next thing that happens
after this merge is the first real customer arriving. The bar is *correct on first contact*.

### A5 · 🔴 THE LAST ITEM ON GATE A — the routes no anonymous sweep can reach

⚠ **It grew on 2026-09-17.** The A4 sweep found `/admin/dashboard` and `/ops/content` **307 to
`/auth/login`**, so the two internal boards were never A4's to measure and belong here. That is
measured, not assumed: both were captured, both failed, and the redirect target was read back.

- [ ] The seven `(app)` routes, with a **real session** carried by `shot.js --cookie`. Anonymously
      they 307 to `/auth/login`, so their conformance is genuinely unknown rather than zero
- [ ] Both internal boards (`isAdmin()` allowlist of one address) and `/blog/preview/[slug]`
- [ ] **Render all three error boundaries.** They have no route, so no sweep built from a route list
      has ever reached one. Needs a deliberate throw. The structural half is already verified
- [ ] 🔵 **Keith's decision:** the 10 fixture scenarios on the results dashboard need
      `npm run db:seed`, which writes to **PRODUCTION** — ten fake customers with fake health
      results in the live database. Skip, or approve. **Not doing it means nine of the ten results
      states ship having never been looked at**

---

## Gate B — the merge

- [ ] `MEMBERSHIP_ENABLED=false` in the shell and in `.env.local`. It is the shipping state.
      🔴 **CORRECTED 2026-09-17, AND THIS IS A LOST SAFETY PROPERTY, NOT A WORDING FIX.** This line
      used to read *"with it `true`, `npm test` and `npm run build` **fail** — that is the `P9`
      interlock working, not a regression."* **Measured today, both exit 0 with the flag true.**
      Nothing broke the interlock: it failed a flag-on build because `STRIPE_PRICE_MEMBERSHIP` was
      unset, and **that price now exists and is set**, so the only thing making a flag-on build fail
      has gone. The gate never asserted *"the flag must be off to ship"*; it asserted *"a flag-on
      build must have a price"*, and the two coincided only while the price was missing.
      ⚠ **So a flag left `true` here will now sail through the build and deploy.** Set it false and
      verify it by reading it back — do not rely on the build to catch you, which is what this line
      told you to do for as long as it was true
- [ ] `npm test`, `npm run typecheck`, `npm run build` all exit 0, read from a redirected log and
      never through a pipe (`npm test` is an `&&` chain; the first failure hides everything after it)
- [ ] Record the current production SHA. `main` @ `4a43864` as at 2026-09-16 — **re-read it, do not
      copy this number**
- [ ] Confirm the Coolify **build arguments** match `.env.example`. Every `NEXT_PUBLIC_*` is baked at
      compile time; a wrong one ships and **cannot be fixed by restarting the container**.
      🔄 **And it is no longer only the `NEXT_PUBLIC_*` ones.** `MEMBERSHIP_ENABLED` was added to the
      Dockerfile's mount list on 2026-09-17: six of the nine consumers of `subscriptionCopy.ts` are
      `○ (Static)`, so the flag is read at **build** time there. The prefix governs client exposure,
      not when a value is needed — `verify-env-contract.js` assertion H now holds every flag in
      `lib/flags.ts` to being mounted or recorded runtime-only with its evidence
- [ ] Confirm the GitHub repo webhook is registered in Coolify. Auto-deploy does nothing without it,
      **and its absence looks exactly like a slow build**
- [ ] Merge to `main` by **explicit path staging, no PR**, and push. **The push is the deploy**

### What the merge discharges by itself — verify each in Gate C, do not work them separately

| Row | What merging does |
|---|---|
| **`3f`** | 🔴 **The live compliance breach.** `shbg-low` and `shbg-high` stop selling a retest two of Ewa's rulings forbid. **This is the only item on the whole register where waiting has an ongoing cost to a customer** |
| **`A2`** | The fixture guard ships, so **November stops being a live date** |
| **`M7`** | 26 approved SEO snippets begin rendering on 15 live articles |
| **`P5`** | The rebuilt `/subscription/confirmed` replaces the one promising a letterbox-friendly box for a product nobody can buy |
| **`S1`** | GA4 starts running, and **the cookie banner appears on the live site for the first time ever** |
| **`S4`** | Constraint 1 lifts: a refund or dispute stops being permanently swallowed |

---

## Gate C — immediately after the deploy

### C1 · Establish the deploy actually landed. **A 200 is not verification**

- [ ] The previous build serves happily through a failed deploy. Use the canary ladder in rank
      order: the per-run build id Next emits in the RSC payload, then a **two-sided** check —
      new string present **and** old string absent. **Never a content-addressed chunk name**,
      which is engineered to hold steady
- [ ] If it looks old, suspect **edge cache** before anything else. Cloudflare → Caddy → Coolify.
      Verify with `?_cb=<rand>` first

### C2 · 🔴 DATED — resend the historical refund event. **Expires ~2026-10-15**

Defect `S4`. Stripe retains events for 30 days.

- [ ] Stripe → Developers → Events → the `charge.refunded` from **01:20:06 on 2026-09-15** →
      Resend to the `andro-prime.com` endpoint
- [ ] It repairs the Gate 3 order row (still reads `dispatched` with the £99 refunded) **and is the
      only end-to-end proof the refund handler will ever get on a genuine Stripe event**
- [ ] ⚠ If Resend is not offered for an endpoint that was not subscribed when the event fired, fall
      back to SQL **and say so — do not report the handler as proven either way**

### C3 · Phase 9 verification against production

- [ ] `tsx scripts/verify-http-contract.ts --base https://andro-prime.com --allow-remote`
- [ ] `node scripts/audit-link-integrity.js --base https://andro-prime.com`
- [ ] `node scripts/audit-runtime-errors.js --base https://andro-prime.com`
- [ ] `node scripts/audit-viewport-sweep.js --base https://andro-prime.com`
- [ ] **Build arguments, positively.** Check the served `NEXT_PUBLIC_SITE_URL` in a canonical tag,
      the Supabase URL in a client request, the GA4 id.
      🔄 **Amended 2026-09-17, and the amendment CHANGES WHAT THIS STEP CATCHES.** This item used to
      read *"`lib/supabase/env.ts`'s silent fallback means a missing variable produces a
      working-but-wrong client rather than an error, so this cannot be checked by looking for an
      error."* A3 removed that fallback, so a missing Supabase variable now **throws and names
      itself**. Check positively anyway: **the reasoning only ever applied to Supabase**, and
      `NEXT_PUBLIC_SITE_URL` and the GA4 id still degrade silently — `SITE_URL` falls back to the
      production origin (correct by coincidence, and the reason `lib/site-url.ts` says so in its
      header) and an absent GA4 id renders no tag **and no cookie banner**, which is a consistent,
      invisible, wrong state. So the step is unchanged; only the count of variables that would have
      stayed quiet has gone from three to two
- [ ] `/api/og/blog/[slug]` on a sample of slugs. It fetches Google Fonts **at request time** and
      degrades silently under restricted egress, so it cannot fail locally

### C4 · Confirm what the merge was supposed to discharge

- [ ] 🔴 **`3f` first.** Fetch a result rendering `shbg-low` or `shbg-high` and confirm the
      "Retest in 6–12 months → `/kits`" offer is gone. **This is the compliance one**
- [ ] The 26 SEO snippets: fetch each of the 15 articles, confirm the `<head>` carries the approved
      title and description. The DB-served layer is **not covered by the canary at all**
- [ ] `M7`'s board flip — ClickUp `869f1wwch`. Only a named human may set that list to approved
- [ ] **Watch the cookie banner.** Nobody has ever seen it in production
- [ ] Submit the sitemap to Search Console and watch coverage for a few days

---

## Gate D — after go-live, not blocking it

All live on `main` today, so none is made worse by merging.

- [ ] **`3f`'s sentence.** The substance is ruled on both cohorts (*"your GP decides when to repeat
      this, not us"*). Ten cards need a sentence: **ours to draft**, then pre-flight, then Ewa signs.
      ⚠ Do not close the gap by restoring the retest link — it is the thing the ruling removed
- [ ] **`H1`** — one `prefetch={false}`. Verified 2026-09-16: no instance exists anywhere under
      `components/`, so nothing has been done to it
- [ ] **`H3`** — **read `JAVASCRIPT-NEXTJS-1H`'s event tags first, not a production build.** The
      hydration failure actually recurring is on `/results-dashboard`, not the route the row names
- [ ] **`H2`** — Keith decides what the app host's root does for a visitor with no session
- [ ] **`S6`** — Keith decides on two orphan endpoints. **Sweep the two comments citing them first**;
      a note recording a removal reads, to every grep, exactly like a use
- [ ] **`S5`'s other two** — drafts rendering on any non-`production` `NODE_ENV`, and the hard-coded
      canonical. ⚠ **The count has no agreed scope:** 33 files across `app`/`lib`/`components`,
      41 including `scripts/`, 91 across the frontend. The plan says 47 and names no scope. Fix the
      scope before fixing the files
- [ ] **`R4`** — Keith decides the QR, then insert artwork. The page is built and live and has no
      entrance except a typed URL
- [ ] **14 non-checkout forms** (plan Phase 5) resolve to real handlers statically; **not one has
      ever been submitted**

---

## Gate E — membership switch-on. A separate gate, later

**Do not start this until Gate C is clean.** It has its own checklist, already written:
`implementation-checklists/membership-switch-on.md`. Its item 0 is *"you are on `main`, or the
branch you are about to deploy is merged to it"* — which this plan is what satisfies.

The defect rows it depends on, none of which blocks go-live:

| Row | What it needs | Owner |
|---|---|---|
| `P1` | Sign off terms v1.3. **Still `DRAFT, not synced live`, re-checked 2026-09-16.** One signature clears three rows | Keith |
| `P2` | Comes with `P1` — the Membership section is in the same document | Keith |
| `P6` | ✅ **DECIDED AND APPLIED 2026-09-16/17** (Keith approved the 2026-09-11 draft in full; copy is in `lib/membership/subscriptionCopy.ts`, flag-gated, interlock green with the flag ON). ✅ **H1 AND H3 CLOSED 2026-09-17**: the membership now starts when the RESULT lands (`lib/membership/startOnResult.ts`), with the included days as a Stripe trial on the card the kit checkout keeps, so the promise has code behind it and the clock anchors where the 2026-09-07 ruling says. The interlock gained a mechanic gate that fails the flag flip if that code is absent. ✅ **H2 CLOSED 2026-09-17** (`1475c75`, `llms.txt:7`), and ✅ **H2b APPLIED 2026-09-17** — the same claim had survived on five more files seven times over, invisible to the interlock because its phrase list said "one-off" and A1 says "one price"; four pages now read it from the flag-gated module and two homepage metadata fields took the cut unconditionally (copy-register row 42b). 🟢 **P6'S COPY HALF IS CLOSED, 2026-09-17: CA-050, CA-051 AND CA-052 ARE ALL SIGNED** (board tasks `869f3guna`, `869f3m9hx`, `869f3mqwj`, each read back at `approved`). H-A is CA-052, H2b's flag-on strings and the `/about` chip are CA-051, and every decision on both was ruled **before** the signature. `verify-subscription-claims.js` reads **0 sentences on 0 pages**, and **nothing still outstanding on P6 is a copy question.** ⚠ That 0-on-0 is the same verdict the gate printed on the morning of 2026-09-17 over seven live instances it could not see; what makes it mean something is that the phrase list gained its vocabulary axis, and the one remaining match is a dated `CLAIMS_ALLOW` exemption guarded by a test that fails if the sentence it was granted for ever changes. 🔴 **WHAT IS STILL NOT CLEARED IS THE MECHANIC, NOT THE WORDS**: `STRIPE_PRICE_MEMBERSHIP` is unset and the mechanic gate is RED on it, which is exactly what it exists to catch. 🟠 **And one standing tie survives all three signatures:** CA-050's K-1 and CA-052's N-2 are the same exception stated on two surfaces — *"included in the price of every kit"* and *"it starts when your first result lands"* are both unconditional while `startOnResult.ts` refuses a membership for a confirmed testosterone under 12. **If either takes a scope word the other needs the same one**, and neither may move alone. **The `P9` interlock means the flag physically cannot go on until they change**, so there is no deadline pressure and no risk of half-shipping | Keith decides, we draft |
| `P4` | Confirm Stripe's own dunning retries, as a dependency of the entitlement rule | Keith |
| `3c` | Whether a member gets a retest-due email at all, plus the audience question riding the unsent Ewa packet | Keith + Ewa |
| `3d` | Build the early-claim rule. **Ewa's ruling landed 2026-09-16 (CA-049 Q4 = B)**, so this is build-only: wire branch 2 to `RETEST_CADENCE`, keep the clamp, verify on the dispatch side | Build |
| — | `STRIPE_PRICE_MEMBERSHIP` is documented in `.env.example` and **still unset** | Keith |
| — | 🔴 **THE FLIP IS A REBUILD AND REDEPLOY, NOT AN ENV CHANGE AND A RESTART — found 2026-09-17, and it is new to this gate.** Six of the nine consumers of `subscriptionCopy.ts` are `○ (Static)`, including `/kits` and the homepage, so `isMembershipEnabled()` is evaluated **at build time** there however correct the call site is. **Measured, not reasoned about:** with `MEMBERSHIP_ENABLED=true` set and the server restarted but NOT rebuilt, `/kits` served the flag-OFF heading *"One price."* while `/kits/testosterone` (dynamic) served flag-ON copy — two states, one site, one click apart, on the page that takes the money. That is exactly the coexistence `verify-subscription-claims.js` exists to prevent, reached through the deploy mechanism rather than through the copy, and **the gate cannot see it because it reads source, where every call site is correct.** So: set the variable as a Coolify **build argument**, redeploy, and verify a STATIC route and a DYNAMIC one agree before calling the flip done. Recorded in `subscriptionCopy.ts`'s header and in copy-register row 42b | Build |
| — | Plan Phase 7: the `MEMBERSHIP_ENABLED=true` pass | Build |

---

## Traceability — every open item, and where it went

| Source | Item | Gate |
|---|---|---|
| Defect | `3c` `3d` `P1` `P2` `P4` `P6` | **E** |
| Defect | `3f` breach half · `A2` · `M7` render · `P5` rebuild · `S1` | **B**, discharged by merging; verified in **C4** |
| Defect | `3f` sentence · ~~`H1`~~ · ~~`H2`~~ · ~~`H3`~~ · `S6` · `R4` · `S5` (2 of 4) | **D** — H1/H2/H3 closed 2026-09-17 |
| Defect | ~~`H2b`~~ · ~~the `/about` chip~~ | **E** — ✅ **CLOSED 2026-09-17: CA-051 APPROVED** (board `869f3m9hx` read back), all three copy items ruled before the signature. Copy-register row 42b. **Not a go-live blocker: `MEMBERSHIP_ENABLED` ships false**, except the two homepage metadata fields (CA-051 item J-2), which ship at the MERGE and are row 48's owed item extended from one call site to three |
| Defect | ~~`H-A`~~ | **E** — 🟢 **CLOSED 2026-09-17: CA-052 APPROVED** (board `869f3mqwj` read back), N-1 ruled no-change before the signature. **It was the last copy record gating the flip: nothing still outstanding on `MEMBERSHIP_ENABLED` is a copy question.** The one item of CA-050's eight that survived its signature, by that record's condition 1. The fix was already an approved sentence — CA-050's own homepage string — so it is lifted into a shared constant rather than rewritten: **flag-off delta is zero fields and the homepage sentence is byte-identical.** The rule is now asserted over the whole flag-on payload rather than stated in prose, which is what let one surface of four obey it unnoticed |
| Defect | `S5` (first 2) | **A3** |
| Defect | `S4` | constraint 1 → **B**; constraint 2 → **C2**, dated |
| Defect | `P5` copy approval | inside **A2**'s 26 rows (register row 45) |
| Defect | `M7` board flip | **C4** |
| Plan | Phases 0, 1, 2 | ✅ done — all 7 scripts and all 4 npm scripts exist |
| Plan | Phase 3 remainder | **A5** |
| Plan | Phase 4 signatures | **A2** |
| Plan | Phase 5 remainder | **A3** and **D** |
| Plan | Phase 6 | **A4** |
| Plan | Phase 7 | **E** |
| Plan | Phase 8 | **B** |
| Plan | Phase 9 | **C3** |
| Plan | CA-046 | ✅ **approved 2026-09-16, both signers, three rounds (8/8, 8/8, 1/1), all build work done. A1 CLOSED by option 1.** ⚠ Two things it does not carry: `page.tsx:90` still sets `robots: noindex` and lifting it is a separate act; and copy-register row 32c's Phase 0 question survives the approval, unasked |
| Plan | CA-045 | ✅ approved 2026-09-15, both signers. **The audit's Go/no-go table has not caught up** |
| Plan | Register row 6 (FAI wording) | ✅ resolved — a mis-citation, not clinical. **Was never on the defects artefact** |
| Plan | Nine undocumented flags | ✅ now in `.env.example`. **Was never on the defects artefact** |

⚠ **Two blockers the plan called merge-critical never appeared on the defects artefact**, and both
are now closed. Nobody was ever going to notice either way. Any future blocker list belongs in
**one** place.

---

## The one-line answer

🔄 **FOUR, as of 2026-09-16. `/demo` is done.** ~~Five things stand between here and a live
Direction F site: a decision about `/demo`,~~ **twenty-six signatures, two one-line fixes, a
screenshot pass and a session-carried sweep.** Everything else on either document is either
discharged by the merge itself, or is a membership switch-on that ships with its flag off, or is
already live on `main` and no worse for waiting.

**A1 closed by option 1 on 2026-09-16**: CA-046 approved by both signers, three rounds answered the
same evening (8/8, 8/8, 1/1), every ruling built, tested and rendered. ⚠ **Closing the gate did not
lift the `noindex`**, which is still at `app/(demo)/demo/page.tsx:90` and is a separate deliberate
act; and **copy-register row 32c's Phase 0 question survives the approval**, unasked.

🔴 **And one of them has an ongoing cost while it waits.** Two result cards are selling a
retest two clinical rulings forbid, to real customers, today. Merging is the only thing that
stops it.

🟢 **Gate A is UNCHANGED by the 2026-09-17 session; Gate E moved instead, and its copy half is
now closed.** CA-050, CA-051 and CA-052 are all signed, `verify-subscription-claims.js` reads 0
sentences on 0 pages, and **nothing still outstanding on `MEMBERSHIP_ENABLED` is a copy question** —
what is left there is the mechanic (`STRIPE_PRICE_MEMBERSHIP`), the terms Membership section, the
Phase-0 read the flag names as its own gate, and one deploy fact nobody had measured: **the flip is
a rebuild and redeploy, not an env change and a restart**, because six of the nine consumers of
`subscriptionCopy.ts` are statically prerendered. **None of that shortens this list**, which is
still the four Gate A items above.
