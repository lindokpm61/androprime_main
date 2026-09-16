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

**Five items. Nothing else blocks.**

### A1 · 🔴 `/demo`: clear CA-046, or decouple it. **Keith decides which, and it is the decision that sets the date.**

CA-046 is the only external blocker on this gate, and it is with Ewa. `/demo` puts a full
results report, a membership price and ~2 dozen un-pre-flighted prototype strings on an
ungated surface.

- [ ] **Option 1 — send the packet and wait.** ClickUp `869exuphq`. She has answered five-question
      packets in 12, 22 and 35 minutes this month, so the wait may be short. The packet is drafted.
- [ ] **Option 2 — decouple, and merge without the demo.** `/demo` is **not flag-gated**: it is a
      plain route at `app/(demo)/demo/page.tsx` and the homepage links to it at
      `app/(marketing)/page.tsx:749`. Adding `DEMO_ENABLED` is the house pattern exactly —
      `lib/flags.ts` holds nine of them, all default OFF, and its own header states the property
      that matters here: *"with the flag OFF the app is byte-identical to before the feature
      existed."* Gate the route and the CTA, ship, and let CA-046 clear on its own timetable.

⚠ **Zero traffic does not soften option 1.** The gate governs SHIPPING, and a page is live
whether or not anyone visits it. **That is exactly why option 2 is not a dodge:** a flagged-off
route is not shipped.

### A2 · 🔴 The copy register's owed signatures — 26 rows and 5 rulings

The pre-flight itself is **done** (Phase 4, ran 2026-09-15, first time ever; the Closed section
is written and every one of the 78 rows carries a disposition and an owner). What is left is
signature, not work.

- [ ] 26 rows needing sign-off — **Keith**
- [ ] 5 rows needing a ruling — **Keith + Ewa**
- [ ] Register row 45 is `P5`'s four new sentences on `/subscription/confirmed`. It is inside the 26; do not track it twice

✅ **Read the headline before deciding how heavy this is: the merge REMOVES fifteen HARD
compliance findings and adds none** — 18 on `main` today against 3 on the branch, and sixteen
of main's eighteen are live verdict-vocabulary defects the branch fixes. **Waiting is not the
conservative option here.**

### A3 · 🟡 Two migration landmines that put a wrong answer in front of a customer

From plan Phase 5, defect `S5`. Both verified still present on 2026-09-16. Take these two now
and leave the other two for Gate D — these are the two that reach a person.

- [ ] `lib/activate/sendActivationLink.ts:29` — falls back to `http://localhost:3000` **inside an
      emailed link**. Dormant only while `NEXT_PUBLIC_SITE_URL` is set, and `S1` is the standing
      proof that exactly this class of variable goes missing with nothing noticing
- [ ] `lib/supabase/env.ts:1-3` — ships a real project ref and anon key as **silent fallbacks**, so
      a missing variable yields a working-but-wrong client instead of an error

⚠ **The shared shape, and the reason both are here rather than in Gate D:** each degrades into
something that *works and is wrong* rather than something that fails. A fallback indistinguishable
from success is a decision to fail silently, taken by whoever wrote the `||`.

### A4 · 🔴 Look at it — plan Phase 6, never started

- [ ] Every route at **1320 and 390**, `--theme light` only (`DESIGN.md` gap 1: dark mode is not
      implemented, so a dark capture proves nothing)
- [ ] Use `andro-prime/12_operations/automation/shot.js`. It is the only sanctioned path, and it
      **returns a verdict as well as a picture** — it caught two horizontal-overflow defects on
      2026-09-16 that the source could not show
- [ ] `--expect-text` on every shot: a screenshot cannot tell *"my change did not apply"* from
      *"the server served stale HTML"*
- [ ] Re-read the two `impeccable` critiques in `frontend/.impeccable/critique/` and confirm the
      homepage's 2 P0s and 3 P1s are closed or knowingly carried

**This phase carries more weight than it would in a cutover**, because the next thing that happens
after this merge is the first real customer arriving. The bar is *correct on first contact*.

### A5 · 🟡 The routes no anonymous sweep can reach — plan Phase 3 remainder

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

- [ ] `MEMBERSHIP_ENABLED=false` in the shell and in `.env.local`. It is the shipping state. With
      it `true`, `npm test` and `npm run build` **fail** — that is the `P9` interlock working, not
      a regression
- [ ] `npm test`, `npm run typecheck`, `npm run build` all exit 0, read from a redirected log and
      never through a pipe (`npm test` is an `&&` chain; the first failure hides everything after it)
- [ ] Record the current production SHA. `main` @ `4a43864` as at 2026-09-16 — **re-read it, do not
      copy this number**
- [ ] Confirm the Coolify **build arguments** match `.env.example`. Every `NEXT_PUBLIC_*` is baked at
      compile time; a wrong one ships and **cannot be fixed by restarting the container**
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
      the Supabase URL in a client request, the GA4 id. `lib/supabase/env.ts`'s silent fallback
      means a missing variable produces a working-but-wrong client rather than an error, **so this
      cannot be checked by looking for an error**
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
| `P6` | Decide what thirteen sentences say instead. **The `P9` interlock means the flag physically cannot go on until they change**, so there is no deadline pressure and no risk of half-shipping | Keith decides, we draft |
| `P4` | Confirm Stripe's own dunning retries, as a dependency of the entitlement rule | Keith |
| `3c` | Whether a member gets a retest-due email at all, plus the audience question riding the unsent Ewa packet | Keith + Ewa |
| `3d` | Build the early-claim rule. **Ewa's ruling landed 2026-09-16 (CA-049 Q4 = B)**, so this is build-only: wire branch 2 to `RETEST_CADENCE`, keep the clamp, verify on the dispatch side | Build |
| — | `STRIPE_PRICE_MEMBERSHIP` is documented in `.env.example` and **still unset** | Keith |
| — | Plan Phase 7: the `MEMBERSHIP_ENABLED=true` pass | Build |

---

## Traceability — every open item, and where it went

| Source | Item | Gate |
|---|---|---|
| Defect | `3c` `3d` `P1` `P2` `P4` `P6` | **E** |
| Defect | `3f` breach half · `A2` · `M7` render · `P5` rebuild · `S1` | **B**, discharged by merging; verified in **C4** |
| Defect | `3f` sentence · `H1` · `H2` · `H3` · `S6` · `R4` · `S5` (2 of 4) | **D** |
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
| Plan | CA-046 | **A1** |
| Plan | CA-045 | ✅ approved 2026-09-15, both signers. **The audit's Go/no-go table has not caught up** |
| Plan | Register row 6 (FAI wording) | ✅ resolved — a mis-citation, not clinical. **Was never on the defects artefact** |
| Plan | Nine undocumented flags | ✅ now in `.env.example`. **Was never on the defects artefact** |

⚠ **Two blockers the plan called merge-critical never appeared on the defects artefact**, and both
are now closed. Nobody was ever going to notice either way. Any future blocker list belongs in
**one** place.

---

## The one-line answer

**Five things stand between here and a live Direction F site: a decision about `/demo`,
twenty-six signatures, two one-line fixes, a screenshot pass and a session-carried sweep.**
Everything else on either document is either discharged by the merge itself, or is a
membership switch-on that ships with its flag off, or is already live on `main` and no worse
for waiting.

🔴 **And one of them has an ongoing cost while it waits.** Two result cards are selling a
retest two clinical rulings forbid, to real customers, today. Merging is the only thing that
stops it.
