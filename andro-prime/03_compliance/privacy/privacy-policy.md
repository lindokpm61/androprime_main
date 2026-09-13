# Privacy Policy

**Page URL:** `/privacy/`
**Last updated:** September 2026
**Version:** 1.4 (DRAFT, not synced live)

> **DRAFT (2026-09-13) - pending Keith sign-off; live page NOT yet synced.** This working copy adds the membership and check-in data, discloses **Sentry**, which was live and undisclosed, and answers what happens to an in-flight order when health-data consent is withdrawn. It carries **one inline item to verify before publication** (search this file for "BEFORE PUBLISH"). The LIVE /privacy page (`canonical-site/privacy/index.html`) has NOT been updated to this wording; syncing it is a separate step requiring sign-off. Earlier draft matter from v1.2 (the low-testosterone nurture purpose and its lawful basis) is still pending Ewa sign-off and is unchanged by this revision.

<!--
Change log:
- v1.4 DRAFT (2026-09-13): in-house pass on Keith's decision of 2026-09-13 (no
  solicitor budget at this stage). Closes review items 11 and 12 from
  `../2026-07-25-terms-privacy-legal-review.md`, and the membership gap.
  (a) MEMBERSHIP + CHECK-IN DATA. Daily check-in answers are special category
      health data and were nowhere in this policy while 109 rows of them sat in
      the production database. Added to "Health and biomarker data", to the
      lawful-basis table (four new purpose rows), and to retention (two rows).
  (b) SENTRY DISCLOSED (review item 12). Live in the error boundaries since
      before this policy was last revised, absent from the processor table.
      EU region (de.sentry.io), session replay disabled. Retention figure is
      Sentry's standard, NOT read from our account: flagged inline to verify.
  (c) ❌ WITHDRAWN SAME DAY: a FirstPromoter disclosure and a PECR blocker.
      An earlier cut of v1.4 added FirstPromoter to the processor table, the
      transfers section and the cookie section, and raised the missing consent
      gate as a publication blocker. KEITH CORRECTED IT: the PT/affiliate layer
      has been FROZEN since 2026-06-07, so nothing is running. Re-checked and he
      is right on every point. `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` is empty,
      so the component returns null; the LIVE site serves zero FirstPromoter
      markers and sets no cookie, plain or with a `?fpr=` parameter. All of it
      reverted. The residual latent risk (no consent gate in the code, which
      fires the moment the programme unfreezes and someone fills in the env var)
      is recorded where it belongs, as an UNFREEZE PRECONDITION in
      `../../06_marketing/STATE.md`, not as a defect in this document.
      🔴 THE ERROR WORTH REMEMBERING: the code path was read correctly and the
      ENV STATE was inferred from `.env.local` without checking it, then never
      confirmed against the running site. A component gated on an env var is not
      live because its code exists. Check what the server actually serves.
  (d) CONSENT WITHDRAWN MID-ORDER (review item 11). Previously unaddressed.
      Now states what happens before analysis, after analysis, and for members,
      and that we will never require re-consent for something already paid for.
  ✅ THE COOKIE SECTION IS ACCURATE, verified rather than assumed. GA4 is the
      only analytics tag that runs and it is gated by Google Consent Mode v2,
      denied by default before gtag.js loads. ONE inline item remains to verify
      before publication (Sentry's retention figure), marked "BEFORE PUBLISH".
  Review items 9 and 10 were re-checked and are substantially closed already:
  the Art 9(2)(a) bundle-scheduling basis is stated in the purpose table, and
  the storage-location wording now names a mechanism per provider. Vercel is no
  longer used (hosting is Hetzner via Coolify), so that half of item 10 is moot.
  Item 13 (md vs live divergence) remains OPEN and is now larger, by design.
- LIVE-SYNC (2026-07-24, Keith): the founding-member REMOVALS from the v1.2 draft
  were synced into the live canonical page (canonical-site/privacy/index.html):
  intro sentence, "who this policy covers" clause, the Account Activity list item,
  and the "joined the founding-member list" purpose row are gone. Reason: the
  founding-member programme is shelved (Keith 2026-07-24). NOTE: only the FM
  removals were synced live; the v1.2 low-testosterone-nurture ADDITIONS and the
  v1.3 bundle clauses below remain DRAFT and are NOT on the live page. NOTE: the
  live founding-member landing page was already down (2026-06-04); this closes the
  last customer-facing FM references in the privacy policy.
- **v1.3 bundle clauses SYNCED LIVE 2026-07-26:** at the `BUNDLES_ENABLED` flag-flip, all three bundle clauses (the "Managing your test bundle" purpose row, the "Automated scheduling of your recheck" disclosure, and the "Bundle / retest scheduling records" retention row) were copied into the live `/privacy` page (`canonical-site/privacy/index.html`). They are no longer DRAFT/gated; the "DRAFT" / "Live page NOT synced" notes in the entries below are historical.
- v1.3.2 DRAFT (2026-07-25): recheck trigger aligned to <12 nmol/L (the signed-off
  GP-referral low-T threshold; was <15) per Keith/Ewa; the automated-scheduling
  disclosure now says "low" not "low or on the low side". Ewa signed off the
  Phase-0 wellness framing (Keith relay).
- v1.3.1 DRAFT (2026-07-25): Phase-0 boundary reframe of the bundle wording.
  Renamed the customer-facing "Confirmation Bundle" to "Recheck Bundle" and
  replaced "confirmatory retest / confirmatory test" with wellness "recheck"
  language (a naturally-variable-marker recheck, not clinical confirmatory
  testosterone testing, which is post-CQC only). Threshold wording kept neutral
  ("low or on the low side") because the trigger band (code <15 vs signed-off GP
  threshold <12) is still Ewa's to sign. Internal code type stays `confirmation`.
  Affected: the bundle purpose row + the automated-scheduling disclosure. Mirrors
  the Terms reframe (terms-and-conditions.md, same date). Still DRAFT / gated.
- v1.3 DRAFT (2026-07-24): Added the two-kit test bundle mechanism. (a) New
  "Managing your test bundle" purpose row in "How We Use Your Data" (lawful basis
  Contract; plus explicit consent Art 9(2)(a) for the Confirmation Bundle, which
  uses your first testosterone result to decide whether the confirmatory retest
  ships now or is banked). (b) New "Automated scheduling of your Confirmation
  retest" disclosure under the automated-decision statement, confirming the step
  produces no legal or similarly significant effect and offering human review.
  (c) New retention row for bundle / retest scheduling records. Drafted in-house,
  pending Keith ratification; gated with the bundle terms behind BUNDLES_ENABLED.
  Live page NOT synced. Source: 09_website-app bundle mechanism build record
  (docs/2026-07-24-bundle-mechanism-build.md), lib/bundles/.
- v1.2 DRAFT (2026-07-09): (a) Added the low-testosterone nurture purpose + lawful
  basis to the "How We Use Your Data" table, lawful basis Art 6(1)(a) consent +
  Art 9(2)(a) explicit consent, per DPIA phase0-dpia.md §1/§5 and source doc
  2026-06-04-lowt-nurture-lawful-basis.md. (b) Removed founding-member list
  advertising (intro, "who this policy covers", account-activity data list, and
  the "joined the founding-member list" confirmation row). The founding-member
  page was taken down 2026-06-04. PENDING Ewa sign-off; live page NOT yet synced.
- v1.1 (2026-06-23): Clarified that explicit consent for health-data processing
  is captured at the point of purchase (checkout), as a required step before
  payment, version-locked and timestamped (CA-018; ClickUp task 34). NB: an
  earlier draft this day placed it behind the results dashboard; that was reverted
  because gating already-paid results on consent breaches "freely given" — consent
  belongs at the purchase decision. Source doc:
  03_compliance/2026-06-23-signup-clinical-optin-consent.md.
  NOTE: the LIVE /privacy page (app/(marketing)/privacy/page.tsx) must be synced
  to this wording at publish — a separate step requiring Keith's go-ahead.
- v1.0 (April 2026): Initial.
-->

---

## Page Header

**H1:** Your privacy, in plain English.

**Subhead:** We collect health data. That means we take this seriously.

---

## Introduction

<!-- DRAFT (2026-07-09): founding-member list advertising removed from this section; pending Ewa sign-off. -->

Andro Prime is a UK men's health company. We sell home diagnostic kits and supplement subscriptions.

Because you share health information with us, this policy matters more than the average privacy page. We've written it to be read, not skimmed.

**Who this policy covers:** anyone who visits andro-prime.com, buys a kit or supplement, or registers an account.

---

## Who We Are

**Andro Prime Ltd** (trading as Andro Prime)
Registered in England and Wales
Company registration number: 17185839
Registered address: 128 City Road, London, EC1V 2NX, United Kingdom

Data controller contact: **privacy@andro-prime.com**

We are registered with the Information Commissioner's Office (ICO). Our ICO registration number is ZC172852.

If you have any questions about how we handle your data, email us at privacy@andro-prime.com. We'll respond within five working days.

---

## What Data We Collect

### 1. Account and identity data
- Full name
- Email address
- Date of birth
- Password (encrypted — we cannot read it)

We collect this when you register an account or check out as a guest.

### 2. Health and biomarker data (special category data)

This is the most sensitive data we hold. When you return a kit for analysis, your blood sample is tested by our laboratory partner. We receive your results and store them in your secure account dashboard.

Depending on which kit you purchased, your results may include:
- Total testosterone, SHBG, and free testosterone (Kit 1)
- Vitamin D, Active B12 (Holotranscobalamin), hs-CRP, and ferritin (Kit 2)
- All seven markers above (Kit 3)

Under UK GDPR, health data is **special category data**. We process it only on the basis of your **explicit consent**, which you give at the point of purchase (checkout) as a required step before payment. We record the exact wording you agreed to along with the date and time. You can withdraw it at any time (see **Your Rights**), which will not affect any processing we carried out before you withdrew.

**Your results are never shared with insurers, employers, or any third party for commercial purposes.**

**If you are a member, your daily check-in answers are health data too.** Membership includes a short set of questions you can answer each day, chosen to relate to the marker your results suggest is worth watching. Your answers, the days you logged them, and the trend we draw from them are special category health data and are held under the same explicit consent as your results. Nobody outside Andro Prime sees them, they are never used to advertise to you, and the monthly clinician answer published to members is written from general questions, never from any individual's check-in data.

**What happens if you withdraw your consent while an order is in progress.** You can withdraw your health-data consent at any time, including after you have paid but before your results arrive. If you do:

- We stop processing your health data from that point. We cannot undo processing already carried out.
- **If your sample has not yet been analysed**, we will cancel the analysis where it is still possible to do so, and refund the analysis portion of what you paid. The physical kit follows the normal return rules in our Terms.
- **If your sample has already been analysed**, the laboratory has produced a result. We will not display it to you, will not email it to you, and will not use it to recommend anything. You can ask us to delete it, and we will, subject to the limited records we must keep by law (see **How Long We Keep Your Data**).
- **If you are a member**, withdrawing consent stops the check-in loop and stops us using a result to set your retest date. Your membership continues unless you also cancel it, and you can still cancel at any time from your account.
- We will never make you withdraw consent in order to get a refund, or make you re-consent in order to receive something you have already paid for.

To withdraw consent, email privacy@andro-prime.com. We will confirm what we have stopped and what, if anything, we have had to keep.

### 3. Order and payment data
- Billing address
- Order history
- Payment method details (card type and last four digits only)

We use **Stripe** to process payments. Andro Prime does not store your full card number. Stripe's own privacy policy governs the data they hold on your behalf.

### 4. Account activity data
<!-- DRAFT (2026-07-09): founding-member list membership item removed; pending Ewa sign-off. -->
- Which kit you purchased
- Your results dashboard interactions
- Supplement subscriptions active on your account

### 5. Communications data
- Emails you send us and our replies
- Customer support exchanges
- Survey or feedback responses (if you choose to participate)

### 6. Website usage data
- Pages visited
- Time on site
- Device type and browser
- IP address (anonymised for analytics)
- Referral source (how you found us)

We use **Google Analytics 4** for this. No health data is passed to analytics tools. IP addresses are anonymised before storage.

---

## How We Use Your Data

<!-- DRAFT (2026-07-09): added the low-testosterone nurture row; removed the founding-member confirmation row. Lawful basis per DPIA §1/§5 and 2026-06-04-lowt-nurture-lawful-basis.md. Pending Ewa sign-off. -->

| What we use it for | Legal basis | Data used |
| --- | --- | --- |
| Delivering your kit and processing your order | Contract | Identity, order, payment |
| Displaying your results in your dashboard | Explicit consent | Biomarker / health data |
| Sending your results report by email | Explicit consent | Health data, email |
| Processing your supplement subscription | Contract | Identity, order, payment |
| Sending order and shipping confirmations | Contract | Identity, email |
| Managing your test bundle and sending the second kit (retest) you have paid for, including scheduling and address confirmation | Contract; plus your explicit consent (Art 9(2)(a)) where we use your first result to decide when the recheck is due (Recheck Bundle) | Identity, order, and (Recheck Bundle only) your first testosterone result |
| Running your membership: billing it, showing you what it includes, and applying member pricing | Contract | Identity, order, payment |
| Reminding you by email before your included membership period converts to a paid one | Contract | Identity, email, membership dates |
| Working out when your included retest is due, and sending it | Contract, for sending and delivering the kit; plus your explicit consent (Art 9(2)(a)) for the part that uses your result to decide the date and which panel to send | Identity, order, address, and your most recent result |
| Running the daily check-in and drawing the trend you see on your dashboard | Explicit consent (Art 9(2)(a)), with consent as the lawful basis (Art 6(1)(a)) | Your check-in answers, the days you logged, and the marker they relate to |
| Recommending supplements based on your results | Explicit consent | Health data |
| Keeping you informed about our future clinical service, where your result shows low testosterone and you opt in to hear from us (low-T nurture) | Explicit consent (Art 9(2)(a)), with consent as the lawful basis (Art 6(1)(a)) | Low testosterone status, email |
| Sending marketing emails (opt-in only) | Consent | Email |
| Improving our website and services | Legitimate interests | Usage data (anonymised) |
| Complying with legal obligations (e.g. tax records) | Legal obligation | Order, identity |
| Fraud prevention | Legitimate interests | Order, identity, IP |

We do not use automated decision-making or profiling in a way that produces legal or similarly significant effects on you.

<!-- SYNCED LIVE 2026-07-26: bundle automated-scheduling disclosure is now on the live /privacy page (canonical-site/privacy/index.html), copied at the BUNDLES_ENABLED flag-flip. -->

**Automated scheduling of your recheck.** If you buy the Recheck Bundle, our system automatically checks whether your first testosterone reading is low in order to decide whether to send your recheck kit now or to hold it as a prepaid credit for your next recommended retest. This is an automated step, but it does not produce a legal or similarly significant effect on you: you receive the retest you have paid for either way, and you can ask us to refund the retest portion instead at any time before it is sent. If you would like a person to review this, email privacy@andro-prime.com.

---

## Lab Partner: Vitall

Your blood sample is analysed by **Vitall** (Healthy Human Labs Ltd), our UKAS-accredited laboratory partner (ISO 15189). Vitall fulfils the kit, coordinates the laboratory analysis, and returns your results to Andro Prime. For the laboratory testing, Vitall acts as a **separate, independent data controller** in its own right (not a processor acting on our instruction): it determines how it handles your sample and testing data for the purpose of providing the testing service, and is responsible for its own compliance under UK GDPR.

Vitall does not use your health data for their own marketing or product development. Your results are displayed through the Andro Prime dashboard, not Vitall's portal.

Vitall's handling of your testing data is governed by its own terms at https://vitall.co.uk/terms and by our controller-to-controller services agreement with Vitall, a copy of which is available on request.

---

## Who Else Receives Your Data

We share data with the following third parties. Our payment, hosting and CRM providers act as our data processors under a data processing agreement; Vitall acts as a separate, independent controller for the laboratory testing (see above).

| Provider | Purpose | Data shared | Where it is held | Role |
| --- | --- | --- | --- | --- |
| Vitall | Sample analysis and results | Name, DOB, sample | United Kingdom | Separate controller |
| Stripe | Payment processing | Billing details | UK account | Processor |
| Customer.io | Email delivery and CRM | Name, email, order data | European Union region | Processor |
| Supabase | Secure database hosting | All account data | Ireland | Processor |
| Hetzner | Website and application hosting | Usage and request data | Finland | Processor |
| Cloudflare | Content delivery, DNS and security | Usage and request data | Global edge network | Processor |
| Sentry | Error monitoring, so we can find and put faults right | Error reports and the technical request details attached to them, which can incidentally include your account identifier and the page you were on | Germany (EU region) | Processor |

**Sentry** records errors, not activity. It is switched on so that a page that breaks for you is a fault we can see and put right rather than one you have to report. Session replay is disabled, so it does not record your screen, and we do not send it your name, your email, or any biomarker result.

**We do not sell your data. We never have.**

We do not share your data with:
- Insurers
- Employers
- Other health providers (in Phase 0)
- Data brokers
- Social media platforms for targeting (we use first-party data only)

---

## Data Transfers Outside the UK

Your account data and your results are held in the European Economic Area. Our database is in Ireland, our website and application servers are in Finland, and our email provider stores our data in its European Union region. Your payments are handled through our UK Stripe account.

Transfers from the UK to the European Economic Area are covered by the UK's adequacy regulations, so no additional transfer agreement is required for them.

Our error monitoring provider, Sentry, stores our error reports in its European Union region (Germany), so that data stays in the EEA as well.

Two of our providers, Cloudflare and Customer.io, are headquartered in the United States even though the data described above sits in the locations listed. For those, we rely on the UK Addendum to the EU Standard Contractual Clauses, which forms part of the data processing terms we accepted with each of them.

We do not transfer your health or biomarker results, or your membership check-in answers, outside the European Economic Area.

---

## How Long We Keep Your Data

| Data type | Retention period | Reason |
| --- | --- | --- |
| Account and identity data | 3 years after last activity | Operational and support purposes |
| Health / biomarker results | 3 years after last kit purchase | Retest comparison and support |
| Order and payment records | 7 years | UK tax law requirement |
| Bundle / retest scheduling records | Until the retest is sent, cancelled, or expires (banked retests expire 12 months after purchase), then per the order and health retention periods above | Delivering the second kit you have paid for |
| Membership records (start date, payments, cancellation, retest dates) | 7 years for the payment records, per UK tax law; other membership records 3 years after the membership ends | Legal obligation, and support and dispute resolution |
| Membership check-in answers and the trend built from them | 3 years after your membership ends, or until you withdraw consent or ask us to delete them, whichever is first | Showing you a trend over time, which needs the earlier entries to be meaningful |
| Email marketing consent | Until you withdraw consent | Legal obligation |
| Customer support communications | 2 years | Support and dispute resolution |
| Error monitoring records (Sentry) | 90 days | Finding faults and putting them right |
<!-- ⚠ VERIFY BEFORE PUBLISH (2026-09-13): 90 days is Sentry's standard error retention, not a figure read from our own account settings. Confirm it in the Sentry org settings and correct this row if the plan differs. -->

| Website usage data (anonymised) | 26 months | Analytics platform standard |

When data reaches its retention limit, we delete or anonymise it securely.

You can request earlier deletion at any time. See **Your Rights** below.

---

## Cookies

We use cookies and similar technologies to run the site and understand how it is used.

**Essential cookies** — required for the site to work. These cannot be turned off.

**Analytics cookies** — help us understand how people use the site. We use Google Analytics 4 with IP anonymisation. You can opt out via our cookie banner or by installing the Google Analytics opt-out browser extension.

**Marketing cookies** — only set if you consent via our cookie banner.

You can update your cookie preferences at any time via the cookie settings link in the footer.

<!--
✅ VERIFIED ACCURATE 2026-09-13 (second pass, after Keith corrected a wrong finding).
An earlier draft of this revision added a "Referral cookies" paragraph for
FirstPromoter and asserted this section was false because that cookie was set
without consent. BOTH CLAIMS WERE WRONG and have been withdrawn:

- The PT/affiliate programme has been FROZEN since 2026-06-07
  (`../../06_marketing/STATE.md`, "PT / affiliate programme: FROZEN" — FirstPromoter
  recorded there as "live but dormant"). `NEXT_PUBLIC_FIRSTPROMOTER_TRACKING_ID` is
  EMPTY, so `FirstPromoterScript` returns null and renders nothing.
- Checked against the live site on 2026-09-13, not against the source: zero
  FirstPromoter markers in the served HTML, and no Set-Cookie on the homepage
  either plain or with a `?fpr=` referral parameter. No referral cookie exists.
- GA4, the only analytics tag that does run, is properly gated: Google Consent
  Mode v2 with ad_storage AND analytics_storage denied by default BEFORE gtag.js
  loads, flipped to granted only on banner opt-in
  (`components/analytics/GoogleAnalytics.tsx`). The sentence above is accurate.

⚠ LATENT, NOT LIVE — belongs to the affiliate UNFREEZE, not to this document.
`FirstPromoterScript` has no consent gate in the code; it is gated only on its env
var. Today the freeze and the empty env var are what prevent a non-essential cookie
being set without consent, not the code. Whoever unfreezes the programme will
populate one env var and silently start setting `_fprom_tid` pre-consent, which
WOULD then make this section false and WOULD be a PECR reg 6 problem. Recorded as
an unfreeze precondition in `../../06_marketing/STATE.md`. Do not pre-emptively
disclose FirstPromoter here: it is not a processor until it processes something.
-->

---

## Your Rights Under UK GDPR

You have the right to:

**Access** — request a copy of the data we hold about you.

**Correction** — ask us to correct inaccurate or incomplete data.

**Erasure** — ask us to delete your data ("right to be forgotten"). Some data must be retained for legal reasons (e.g. tax records) but we will tell you what we can and cannot delete.

**Restriction** — ask us to pause processing your data in certain circumstances.

**Portability** — receive a copy of your data in a structured, machine-readable format (where applicable).

**Withdraw consent** — where we rely on consent to process your data (particularly your health data), you can withdraw that consent at any time. This will not affect the lawfulness of processing before withdrawal.

**Object** — to processing based on legitimate interests.

**To exercise any of these rights:** email privacy@andro-prime.com with the subject line "Data Request". We will respond within one calendar month.

If you are unhappy with how we have handled your data, you have the right to lodge a complaint with the **Information Commissioner's Office (ICO):** ico.org.uk/make-a-complaint

---

## Security

We take the following steps to protect your data:

- All data in transit is encrypted (TLS 1.2+)
- All data at rest is encrypted in our database
- Access to health data is restricted to authorised personnel only
- Our database infrastructure (Supabase) is hosted in certified, secure data centres
- We conduct regular access reviews

If we ever discover a breach that affects your rights and freedoms, we will notify you and the ICO within 72 hours as required by law.

---

## Children

Our services are for adults aged 18 and over. We do not knowingly collect data from anyone under 18. If you believe we have done so in error, contact us immediately at privacy@andro-prime.com.

---

## Changes to This Policy

If we make material changes to how we use your data, we will notify you by email and update the "Last updated" date above.

Minor updates (wording, formatting, provider name changes) may be made without notification, but the policy will always be current at andro-prime.com/privacy.

---

## Contact

Questions, requests, or concerns:

**Email:** privacy@andro-prime.com
**Response time:** within 5 working days

Andro Prime
128 City Road, London, EC1V 2NX, United Kingdom
Company number: 17185839
