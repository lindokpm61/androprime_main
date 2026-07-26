# Privacy Policy

**Page URL:** `/privacy/`
**Last updated:** July 2026
**Version:** 1.2

> **DRAFT (2026-07-09) - pending Ewa sign-off; live page NOT yet synced.** This working copy adds the low testosterone nurture purpose and its lawful basis, and removes the founding-member list advertising. The changed sections are flagged inline. The LIVE /privacy page (`app/(marketing)/privacy/page.tsx`) has NOT been updated to this wording; syncing it is a separate step requiring sign-off.

<!--
Change log:
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

| Provider | Purpose | Data shared | Role |
| --- | --- | --- | --- |
| Vitall | Sample analysis and results | Name, DOB, sample | Separate controller |
| Stripe | Payment processing | Billing details | Processor |
| Customer.io | Email delivery and CRM | Name, email, order data | Processor |
| Supabase | Secure database hosting | All account data | Processor |
| Vercel | Website hosting | Usage/request data | Processor |

**We do not sell your data. We never have.**

We do not share your data with:
- Insurers
- Employers
- Other health providers (in Phase 0)
- Data brokers
- Social media platforms for targeting (we use first-party data only)

---

## Data Transfers Outside the UK

Some of our service providers are based outside the UK or process data on servers outside the UK. Where this applies, we ensure appropriate safeguards are in place, including UK IDTA-standard contractual clauses or adequacy decisions.

---

## How Long We Keep Your Data

| Data type | Retention period | Reason |
| --- | --- | --- |
| Account and identity data | 3 years after last activity | Operational and support purposes |
| Health / biomarker results | 3 years after last kit purchase | Retest comparison and support |
| Order and payment records | 7 years | UK tax law requirement |
| Bundle / retest scheduling records | Until the retest is sent, cancelled, or expires (banked retests expire 12 months after purchase), then per the order and health retention periods above | Delivering the second kit you have paid for |
| Email marketing consent | Until you withdraw consent | Legal obligation |
| Customer support communications | 2 years | Support and dispute resolution |
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
