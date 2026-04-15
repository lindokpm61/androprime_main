# Product 1: Testosterone Health Check Kit
## Complete Launch Deep-Dive — Lab Negotiations, Website Architecture, Results Report Design

**Date:** March 30, 2026
**Owner:** Keith Anthony
**Product:** £39 At-Home Testosterone Health Check Kit
**Purpose:** Phase 0 revenue + TRT pipeline builder

**Note:** The lab partner section of this document has been superseded by `05_partners/labs/lab-partner-rankings-addendum.md` following the Medichecks/Leger acquisition. Always refer to that document for current lab partner rankings.

---

## Part 1: Lab Partner Negotiations

*See `05_partners/labs/lab-partner-rankings-addendum.md` for the current, post-consolidation rankings.*

The original shortlist and rationale below is preserved for context.

### 1.1 The Original Shortlist

#### Option A: Thriva Solutions

Still the clear frontrunner. API-first, white-labels for Ted's Health (men's hormone testing — your exact use case), UKAS ISO 15189 accredited, 96.2% sample success rate.

See `05_partners/labs/thriva/` for negotiation notes and email templates.

#### Option B: One Day Tests / BloodLink

**No longer recommended.** One Day Tests operates its own TRT service — conflict of interest risk. Contact for pricing benchmark only. See `05_partners/labs/benchmark-only/`.

#### Option C: Vitall

Strong backup. Already white-labels for GenderGP and TR;BE. UKAS accredited. See `05_partners/labs/vitall/`.

#### Option D: Forth

Worth a pricing conversation. Less evidence of true white-label capability. See `05_partners/labs/forth/`.

#### Option E: Medichecks

**Struck off.** Acquired Leger Clinic — now a direct competitor. Do not approach.

### 1.2 Negotiation Priorities (in order)

1. Speed to market — can they get you live in 2-4 weeks?
2. Low/no minimums — can't commit to 500 kits/month before validating demand
3. API integration — manual order processing doesn't scale
4. Branded customer experience — kit and results must feel like Andro Prime
5. Wholesale pricing — target £12-18 per test, all-in

### 1.3 Timeline for Lab Selection

| Day | Action |
|-----|--------|
| Day 1 | Send emails to Thriva Solutions + Vitall |
| Day 1 | Send pricing enquiry to BloodLink + Forth (benchmark only) |
| Day 3-5 | Discovery calls with Thriva and Vitall |
| Day 8-10 | Request formal pricing proposals |
| Day 11-14 | Compare proposals, negotiate key terms |
| Day 15 | Sign agreement with chosen partner |
| Day 16-21 | Onboarding, branding setup, integration planning |
| Day 22-28 | First test kits ready to ship |

---

## Part 2: Website Architecture

### 2.1 What You're Building

This is NOT a full clinical platform. That comes later with Semble for TRT patients. This is a focused e-commerce site that does exactly five things:

1. Sells the £29-39 testosterone health check kit
2. Takes founding member deposits (£75)
3. Captures customer data into Supabase
4. Triggers kit fulfilment (API to lab partner or manual initially)
5. Delivers results and converts low-T results into TRT pipeline

### 2.2 Recommended Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Hosting | Coolify (existing setup) | Already running, familiar, cheap |
| Frontend | Next.js or Astro | Fast, SEO-friendly, modern |
| Database | Supabase | Already running, handles auth, real-time |
| Payments | Stripe | Industry standard, handles subscriptions too |
| Automation | n8n | Already running, connects everything |
| Email | Resend or Mailgun (via n8n) | Transactional + marketing emails |
| Analytics | Plausible or PostHog | Privacy-friendly, GDPR compliant |
| Lab Integration | API (Thriva) or webhook/email (BloodLink) | Depends on partner |

### 2.3 Data Flow Architecture

```
CUSTOMER JOURNEY:

1. Customer visits androprime.co.uk/test
2. Clicks "Check Your Levels" → Stripe Checkout
3. Stripe processes payment → webhook fires
4. n8n workflow receives webhook:
   a. Creates customer record in Supabase (orders table)
   b. Sends order confirmation email
   c. Places order with lab partner (API call to Thriva or email to BloodLink)
   d. Creates Supabase auth account for results access
5. Lab ships kit to customer (2-3 days)
6. Customer collects sample, posts back to lab
7. Lab processes sample (24-48 hours)
8. Lab returns results:
   - If API: webhook/polling picks up results → n8n stores in Supabase
   - If manual: CSV/email → n8n parses and stores in Supabase
9. n8n sends "Results Ready" email with magic link to /results
10. Customer views branded results page
11. If testosterone <12 nmol/L:
    - Report shows amber/red
    - CTA: "Your levels suggest you may benefit from specialist support.
      Join Founding Members for priority TRT access."
    - Link to /founding-member
12. Regardless of result:
    - Follow-up email sequence (Day 3, Day 7, Day 14)
```

### 2.4 Supabase Schema (Core Tables)

```sql
-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postcode TEXT,
  phone TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  source TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  product TEXT NOT NULL,
  amount_pence INTEGER NOT NULL,
  stripe_payment_intent TEXT,
  stripe_session_id TEXT,
  status TEXT DEFAULT 'paid',
  lab_order_id TEXT,
  kit_dispatched_at TIMESTAMPTZ,
  sample_received_at TIMESTAMPTZ,
  results_ready_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  customer_id UUID REFERENCES customers(id),
  total_testosterone DECIMAL,
  shbg DECIMAL,
  free_testosterone DECIMAL,
  result_json JSONB,
  report_viewed_at TIMESTAMPTZ,
  cta_clicked TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pipeline tracking
CREATE TABLE pipeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  stage TEXT DEFAULT 'kit_purchased',
  low_testosterone BOOLEAN DEFAULT false,
  founding_member BOOLEAN DEFAULT false,
  trt_converted BOOLEAN DEFAULT false,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 Build Timeline

| Day | Task |
|-----|------|
| Day 1-2 | Set up Next.js project, deploy to Coolify, connect domain |
| Day 3-4 | Build homepage and product page |
| Day 5 | Integrate Stripe Checkout (product + founding member) |
| Day 6-7 | Build n8n workflows (payment webhook → Supabase → lab order → emails) |
| Day 8-9 | Build results dashboard (auth + display) |
| Day 10-11 | Build founding member page, FAQ, about, how it works |
| Day 12-13 | Write and publish 5 blog posts |
| Day 14 | Testing — full end-to-end flow with test payments |
| Day 15-16 | Fix bugs, polish copy, mobile responsive check |
| Day 17 | Privacy policy, terms of sale, cookie consent |
| Day 18-19 | Analytics setup (Plausible/PostHog), UTM tracking |
| Day 20-21 | Soft launch to personal network for feedback |

---

## Part 3: Results Report Design

### 3.1 The Strategic Purpose

The results report is NOT just information delivery. It is the single most important conversion mechanism in Phase 0. Every man who sees a red or amber testosterone result is a warm TRT lead. The report's job is to:

1. Deliver clear, trustworthy results (builds brand credibility)
2. Contextualise the results in language the customer understands (not medical jargon)
3. Provide actionable lifestyle guidance (creates value even for normal results)
4. Convert low-T results into founding member deposits (pipeline)
5. Encourage retesting (recurring revenue for normal-range results)

### 3.2 Results Page Structure

**Section 1: Headline Result**

Big, clear, unmissable. Colour coded:
- **GREEN (>15 nmol/L):** "Within healthy range"
- **AMBER (10-15 nmol/L):** "Lower end of range — worth monitoring"
- **RED (<10 nmol/L):** "Below typical range — consider specialist advice"

These are information thresholds, NOT diagnostic thresholds. The copy must not say "You have low testosterone" or "You need treatment." Ewa signs off on all threshold language.

**Section 2: What Your Results Mean**

Written in Keith's voice — plain English, no jargon.

For a RED result (<10 nmol/L):
> "Your testosterone level of [X] nmol/L is below the typical range for men your age. This doesn't automatically mean something is wrong — testosterone varies by time of day, stress levels, sleep, and other factors. But if you're experiencing symptoms like persistent fatigue, low mood, reduced motivation, or changes in body composition, this result is worth discussing with a healthcare professional who understands male hormones."

For an AMBER result (10-15 nmol/L):
> "Your testosterone level of [X] nmol/L is at the lower end of the typical range. Many men at this level feel fine. Others experience symptoms that creep up gradually — tiredness that doesn't shift, harder to stay motivated, changes in mood. If any of that sounds familiar, it's worth keeping an eye on."

**Section 3: Your Full Results**

Table format with your result, reference range, traffic light indicator, and one-line plain-English explanation.

**Section 4: Lifestyle Context**

3-4 actionable recommendations regardless of result (sleep, training, stress, nutrition). These build value and trust.

**Section 5: Your Next Step (the Conversion Section)**

For RED/AMBER results — Founding member CTA:

> "TRT is coming. Be first. Priority access. £75 fully refundable deposit, applied as credit when you start. [BECOME A FOUNDING MEMBER →]"

For GREEN results — Retest and supplement CTA:

> "Your levels look healthy right now. Retesting every 6-12 months helps you spot changes early. [SET A REMINDER →] / [SUPPLEMENT WAITLIST →]"

### 3.3 Follow-Up Email Sequence

| Email | Timing | Subject |
|-------|--------|---------|
| 1 | Result delivery | "Your testosterone results are in" |
| 2 | Day 3 | "What your testosterone number actually means" |
| 3 | Day 7 | "3 things that actually move the needle on testosterone" |
| 4 | Day 14 | "Have you thought about what's next?" |

### 3.4 Report Design Principles

1. **Mobile-first.** Most men will open the "results ready" email on their phone.
2. **The number comes first.** Big number, clear colour, one-line interpretation — above the fold.
3. **Plain English throughout.** Never write "hypogonadal range" when you can write "below typical levels for your age."
4. **Always include the GP referral option.** Even when pushing founding member, always mention "speak to your GP." Ethically correct and legally protective.
5. **Don't oversell.** The report should feel like a trusted health resource, not a sales funnel.

---

## Critical Challenges

**Challenge 1: £39 price point may be wrong.**
Medichecks sells a testosterone test from £39. At £29 as a launch price (£29 - £17 COGS = £12 gross margin), 100 kits with 10% founding member conversion = 10 deposits = £750 + 10 warm TRT leads worth £22,200/year in TRT revenue. The margin hit on kit pricing is irrelevant against the pipeline value.

**Challenge 2: 100 kits in 6 weeks is ambitious from a cold start.**
At a 2% website conversion rate, you need 120 unique visitors per day to your product page. From LinkedIn organic alone, this requires 5,000-8,000 followers with strong engagement. Consider lowering Gate 0A to 50 kits in 6 weeks, or budget £500-1,000 for targeted ads to drive initial kit sales.

**Challenge 3: Results delivery dependency.**
If your lab partner only delivers results via their own portal (not via API), you lose control of the most important conversion moment. API access is non-negotiable.

---

## Immediate Next Actions

| Priority | Action | Timeline |
|----------|--------|----------|
| 1 | Send emails to Thriva Solutions + Vitall | Today |
| 2 | Get Ewa to define exact panel + report thresholds | This week |
| 3 | Start website build (homepage + product page + Stripe) | This week |
| 4 | Draft results report copy for Ewa's clinical review | Week 2 |
| 5 | Lab partner calls and pricing comparison | Week 1-2 |
| 6 | Sign lab agreement | Week 2-3 |
| 7 | Build n8n automation (payment → order → results) | Week 2-3 |
| 8 | Build results dashboard | Week 3 |
| 9 | End-to-end testing | Week 3-4 |
| 10 | Soft launch | Week 4 |

---

**Last updated:** March 30, 2026
**Status:** Ready for execution
**Owner:** Keith Anthony
**Cross-reference:** `05_partners/labs/lab-partner-rankings-addendum.md` (supersedes Part 1 lab rankings), `04_products/results-engine/` for results logic and dashboard copy
