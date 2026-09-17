# Membership switch-on checklist

**Created:** 2026-09-13 · **Owner:** Keith · **Closes:** defect **P3**
**Run:** in one sitting, in this order. Do not start it on a Friday.

> **Why this exists as a checklist rather than a task.** P3 recorded "verify the
> Stripe membership price" on a task board. That is the wrong instrument: the
> failure mode is **charging the wrong amount to a real card**, and a task board
> surfaces that a week later. These items have value at exactly one moment and
> no value at any other, which is what a checklist is for.
>
> **And the mechanical ones are commands, not readings.** A line saying *"check
> the price is £47"* is a human comparing two numbers on two screens at the end
> of a long sitting, which is when people are worst at it. Where a machine can
> do the comparing, the line below says run this.

---

## 0. Before you start

- [ ] You are on `main`, or the branch you are about to deploy is merged to it.
      **`redesign/direction-f` deploys nothing**, so a guard that lives only
      there is not protecting production. This bites A2 specifically.
- [ ] `npm test` passes on the branch being deployed.
- [ ] You have the Stripe dashboard open on the **live** account, not test.

---

## 1. The prices. Mechanical, run the command.

```
cd andro-prime/09_website-app/frontend
npm run verify:prices -- --switch-on
```

- [ ] Exit code is **0**. Anything else stops the switch-on.

It reads every `STRIPE_PRICE_*` the app can spend, retrieves each from the live
Stripe account, and asserts amount, currency, one-off-versus-recurring, the
monthly interval, and that the price is not archived. Expected amounts are
**derived from `lib/pricing.ts` and `lib/subscriptions/products.ts`**, never
retyped, so the check cannot quietly agree with a stale copy of itself.

**What it will not judge, deliberately.** Bundle prices are recorded in
`lib/bundles/config.ts` as working hypotheses pending the willingness-to-pay
read, so the repo claims no amount for them. The check asserts their shape and
**reports** their amount. Read those figures with your own eyes; nothing else
will.

⚠ **`--switch-on` is the strict mode and it is the one to use here.** A plain
run tolerates a price that is merely unset behind a flag that is also off, which
is correct on an ordinary day and exactly wrong on this one.

**If it fails,** it prints every active price on the account underneath the
failures, with ids, so you can set the right variable without going to hunt for
it in the dashboard.

🔵 **Known as at 2026-09-13, from the first run of this check:** the live
account already holds **Andro Prime Membership at £47.00, every 1 month,
active** (`price_1U8VKR…`). So the membership price exists and is correct; what
is missing is `STRIPE_PRICE_MEMBERSHIP` pointing at it in the deployment
environment. That is one variable, and it is item 2.

---

## 2. The environment

- [x] `STRIPE_PRICE_MEMBERSHIP` is set in **Coolify**, not only in a local
      `.env.local`. A local file proves nothing about production.
      **Keith set it on 2026-09-13**, with the £47 price id.
- [ ] ⚠ **The value is UNCONFIRMED from the repo side.** Coolify's environment
      cannot be read from here, so "it is set" is Keith's report and not a
      verified fact. **The id it should hold is
      `price_1U8VKRLU0SDiIplTUnr5cyWJ`**, which is the only £47.00 per month
      active price on the live Stripe account, confirmed by a direct read on
      2026-09-13. Match the last characters and tick this.
- [ ] Re-run item 1 **against the deployed environment**, because the variable
      that matters is the one the server holds, and the failure this whole
      checklist exists to prevent is a mismatch between the two.

  🔴 **THERE IS NO MECHANISM FOR THAT LINE YET, AND SAYING "if you can" WAS THE
  GAP.** The check runs where the developer is, and the environment that takes
  the money is somewhere else. Until this is closed, the honest status of the
  membership price in production is **reported, not verified**. Two ways to
  close it, neither built as at 2026-09-13:

  - Exec into the Coolify container and run `npm run verify:prices -- --switch-on`
    there. No new code, needs shell access to the running container.
  - An admin-gated route that runs the same pure check server-side and reports,
    so production verifies itself. Small, because `lib/stripe/priceExpectations.ts`
    is already pure and has no dependency on where it runs. ⚠ Note the known
    problem first: `/admin/dashboard` is served from the apex while the session
    cookie is host-only to the app host, which produced an infinite redirect
    during the A1 work.

  🟢 **PARTIALLY CLOSED 2026-09-17 for the FLAG, though not for the price.**
  `npx tsx scripts/verify-flag-parity.ts --base https://andro-prime.com` reads the
  **served bytes** of one `○ (Static)` consumer and one `ƒ (Dynamic)` one and
  reports which state each is in. It needs no shell access and no new route, and
  it answers the question this section is really asking — *what is the deployed
  environment actually serving* — from outside. **Run against production on
  2026-09-17 it reports both surfaces OFF**, so whatever `MEMBERSHIP_ENABLED`
  holds in Coolify, no customer is being shown membership copy today.
  ⚠ **That is an answer about COPY, not about the variable.** A build predating
  the flag-gated module also serves OFF. It cannot tell you the price is set, and
  it cannot tell you the variable is false — only that nothing membership-shaped
  is reaching a customer.

### 2b · 🔴 The flip is a REBUILD, and until 2026-09-17 it could not have worked at all

- [x] **`MEMBERSHIP_ENABLED` is mounted in the Dockerfile.** Added 2026-09-17.
      It was in neither the mount list nor any checker, so **setting it in Coolify
      could not have flipped six of the nine copy surfaces**: `/`, `/kits`,
      `/about`, `/how-it-works` and the `/lp/*` pages are `○ (Static)`, so
      `isMembershipEnabled()` is evaluated during `next build` there, and with no
      mount there was nothing for a build argument to flow into. The three
      `ƒ (Dynamic)` consumers would have flipped and the other six would not.
- [ ] **Set it as a Coolify BUILD ARGUMENT and redeploy — not a runtime variable
      and a restart.** A mount is not a value; the mount only gives the value
      somewhere to land.
- [ ] **Then run the parity check against production and require exit 0.** It is
      the acceptance test for this item: two surfaces, one built and one served
      per request, agreeing about the same flag.

  ⚠ **Measured, not reasoned about.** Built with the flag on and served with it
  **off** — the exact shape of an env-change-and-restart — `/kits` served flag-ON
  copy while `/kits/testosterone` served flag-OFF, and the parity check caught it
  and named the rebuild as the repair. Built and served consistently, it passes.
  **Nothing that reads source can see this**, because in source every call site is
  already correct; the defect lives in when the value was read, not in where.

- [x] **`main` does read this variable**, so setting it is meaningful rather
      than inert: `lib/subscriptions/products.ts` on `main` carries the
      membership entry with `stripePriceEnv: 'STRIPE_PRICE_MEMBERSHIP'`, and
      `isMembershipEnabled()` exists there too. Confirmed by reading `main`
      rather than the working branch.
- [x] **Nothing changed for a customer when it was set.** `MEMBERSHIP_ENABLED`
      is still off, so no membership surface renders and no row can be written.
- [ ] `ACCOUNT_ADDRESS_ENABLED` is on, or you accept that the retest email's
      only call to action lands on a page that renders no address (see 3c).

---

## 3. The copy interlock

- [ ] The build passes with `MEMBERSHIP_ENABLED=true`.

`scripts/verify-subscription-claims.js` fails the build whenever the membership
flag is true while any of the **eighteen sentences** (thirteen until the 2026-09-15 `CLAIMS` widening) telling a buyer there is no
subscription remains. That is **P6**, so this line is a confirmation rather than
a judgement: if the build passes, the sweep happened.

🔴 **THAT LAST SENTENCE WAS FALSE UNTIL 2026-09-14, AND THIS IS THE LINE IT
WOULD HAVE BEEN TICKED ON.** The interlock was wired into `npm test`, never onto
the build, so `npm run build` exited **0** with the flag on and the thirteen
sentences untouched. Anyone working down this checklist would have run the
build, seen green, and ticked P6 off at the exact moment real money was being
switched on. Measured, both before and after the fix.

Two changes make the line true: a **`prebuild`** hook that runs the interlock,
and the interlock **loading `.env.local`** the way `next build` does — without
the second, a flag set in `.env.local` was visible to the build and invisible to
its gate. `MEMBERSHIP_ENABLED=false npm run build` still overrides the file.

⚠ **A green build is only evidence if the gate is ON the build.** Before
trusting this item, confirm the run actually printed the interlock's report:

```
npm run build 2>&1 | grep -c "MEMBERSHIP_ENABLED"
```

Zero means the gate did not run, whatever the exit code said.

---

## 4. The things that are still decisions, not checks

Each of these is a defect with a name. None is closed by this checklist, and the
flag should not flip while any of them is open.

- [ ] **P1 / P2** — the membership terms are signed off by Keith. Drafted
      2026-09-13 as `terms-and-conditions.md` v1.3, unapproved.
      ⚠ **It is DRAFTED, not missing.** Checked 2026-09-17: `## Membership` is a
      full section written to the law in force, voluntarily adopting the DMCCA
      Part 4 duties, with three residual items flagged for a solicitor. The work
      left is sign-off and the flip-day sync, **not writing it** — the published
      `canonical-site/terms/index.html` carries zero occurrences of the word
      because v1.4 deliberately held the section back, which is correct while the
      flag is off.
- [ ] 🟠 **F3 — the terms never say what DAY 1 is, and silence there is not
      neutral. BLOCKED ON A DECISION, deferred 2026-09-17 by Keith.** The section
      says *"On day 31 we charge the card you used"* and *"your first 30 days"*,
      and never names the start. Read plainly that implies **day 1 = purchase**,
      while `lib/membership/startOnResult.ts` anchors the clock to the **result** —
      so a customer could compute a different charge date from the terms than the
      one he is actually charged on, and the voluntarily-adopted reminder duty is
      computed from that same anchor.
      🔴 **Why it is not just a drafting job:** the anchor is already stated
      **unconditionally** on two approved surfaces (CA-050 **K-1**, CA-052 **N-2**)
      while the code refuses a membership under 12 nmol/L. The terms would be a
      **third** surface of that same tied claim, so writing it either extends the
      tie to three records or breaks step with the other two. **Answer it in the
      same sitting as K-1/N-2** — deferred deliberately, not overlooked.
- [ ] **P2** — the terms and privacy notice are **synced to the canonical HTML**
      (`canonical-site/terms/index.html`, `canonical-site/privacy/index.html`).
      The markdown is not what the site serves.
- [x] 🟢 **P7 — the subscription checkout refuses a customer who already holds a
      live membership. Built 2026-09-14.** `liveMembershipFor` +
      `refusesSecondMembership` (`lib/membership/liveMembership.ts`) run before
      the Stripe call; a live member gets a 409 and is sent to his account, and
      `JoinButton` navigates there rather than offering a retry that would be
      refused again. A failed insert in the Stripe webhook now raises
      `emitOpsAlert` instead of a console line, because by then the card has
      already been charged.

      **Asked before the offer window, deliberately.** An existing member's
      window is usually shut, so the other order answers him *"order a test to
      start a new one"* — wrong, and expensive advice for a man already paying.

      14 assertions, suite 333 → 347. **All four reintroductions were measured**
      (deleting the guard; removing the alert; swapping the status list for the
      portal's; and a control run) and each fails the expected ids. ⚠ **Still to
      be verified by eye at item 5**: with the flag off and only fixture rows in
      the table, there is no state in which a second join can be clicked today.
- [ ] **A2** — the two seeded developer memberships are gone from production, or
      the guard that ignores them is deployed. Their retest dates are **16 and
      17 November 2026**, and the flag being off is the only thing holding them.
- [ ] **P5** — the subscription confirmation page copy is approved.

- [x] 🟢 **THE CANCELLATION ROUTE EXISTS FOR A MEMBERSHIP. Built 2026-09-13.**
      `resolveBillingSubscriptionId` in `lib/membership/sync.ts` reads both
      tables, the portal route uses it, and `getSubscriptions` renders both.
      12 assertions, suite 321 → 333, and both defects were deliberately
      reintroduced to prove the guards fail (exactly 2 failures, exit 1) before
      being restored. ⚠ **Still to be verified by eye at item 5**, because with
      the flag off and only fixture rows in the table there is no state in which
      the flow can be clicked through today.

      _Original entry, kept for the record:_

- [ ] ~~🔴 **THE CANCELLATION ROUTE EXISTS FOR A MEMBERSHIP.**~~ Added 2026-09-13
      after it was found by asking a question about Stripe Billing. Both
      `getSubscriptions` and `app/api/checkout/portal/route.ts` query
      **`supplement_subscriptions` only**, and a membership owns a row in
      **`memberships`**. Under the auto-renew ruling every kit buyer is a
      membership-only customer, so every one of them reaches the empty state on
      the page meant to let them cancel, the portal route 404s, and
      `BillingPortalButton` does not handle the 404: **the click is a silent
      no-op.** Recorded in `09_website-app/STATE.md` as a HARD finding before
      today; repeated here because it is a switch-on blocker and was not on this
      list.

      ⚠ **This is the mechanism behind a contract promise, not a UI nicety.**
      The terms drafted on 2026-09-13 say *"You can cancel your membership at
      any time, from your account, in the same number of steps it took to
      join."* Shipping membership without this makes that sentence false, and it
      is the duty the DMCCA regime is most explicit about.

- [x] 🟢 **THE STRIPE CUSTOMER PORTAL IS CONFIGURED AND ACTIVE.** Done by Keith
      on 2026-09-13 and **read back from the API rather than taken on report**:
      `bpc_1UFKXeLU0SDiIplTH3V9TiK1`, `active: true`, `is_default: true`. The
      route passes no explicit `configuration`, so being the default is what
      makes it the one that loads.

      **The two fields that had to match the contract both do:**

      | Stripe | Terms |
      |---|---|
      | `subscription_cancel.mode = at_period_end` | *"Cancellation takes effect at the end of the period you have paid for. You keep access until then."* |
      | `proration_behavior = none` | *"We do not refund part-used months."* |

      Also recorded: `subscription_update` **disabled** (correct, there is one
      plan), `invoice_history` and `payment_method_update` enabled, cancellation
      reason asked, and the headline reads **"Andro Prime"**, two words.

- [ ] ⚠ **DECIDE: `customer_update` currently allows `email`.** Allowed updates
      are `name, email, address, phone`. Changing an email in the Stripe portal
      **does not break anything** — the webhook resolves a subscription to a user
      by **Stripe subscription id**, and the Customer.io key comes from our own
      `users` row via `cioKeyForUserId`, never from Stripe's customer object.
      What it does is **diverge**: Stripe's receipts and dunning go to the new
      address while the login, the app's mail and the CIO profile still use the
      old one, and the customer believes he has changed his email. Name, address
      and phone are billing details and are fine to self-serve. **Recommendation:
      drop `email` from the allowed list and keep email changes in the account.**

- [ ] **Legal policies: the portal carries no Terms or Privacy link**
      (`terms_of_service_url` and `privacy_policy_url` are both unset). That is
      arguably right today, because the live pages have no membership section and
      still describe a *"wellness information service"*. Set them in **Public
      business information** as part of the same sitting that syncs the legal
      pages, not before.

---

## 5. The first live transaction

- [ ] Buy a membership with a real card, on the live site.
- [ ] The Stripe charge is **£47.00**, and the interval reads monthly.
- [ ] A `memberships` row exists for that user, `status: active`.
- [ ] `membership_retest_due_at` is stamped. ⚠ **Nothing stamps it as at
      2026-09-13**, which is one of the four things stopping Customer.io
      campaign 25 sending.
- [ ] `/account/membership` renders the member state, not the paywall.
- [ ] Cancel it from `/subscriptions`, confirm the Stripe subscription ends, and
      confirm the row moves to `cancelled`. **The terms promise cancellation is
      as easy as joining, so this is a promise being tested, not a smoke test.**
- [ ] Refund the charge.

---

## 6. After

- [ ] `09_website-app/STATE.md` records the date, the price id, and the first
      transaction.
- [ ] P3 is marked closed on the defect register with the run output attached.
- [ ] Re-run `npm run verify:prices` once more, a week later. A price can be
      edited in the Stripe dashboard by a human at any time, and nothing in the
      application would notice.
