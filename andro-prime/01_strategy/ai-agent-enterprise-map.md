# Andro Prime: End-to-End AI Enterprise Map

To bring Andro Prime to market and sustainably maintain it, we need to think beyond just marketing. The business requires repeatable engineering, strict governance, resilient supply chains, and continuous customer support.

By looking at the complete lifecycle—from GTM build to ongoing infrastructure maintenance—here is the comprehensive map of the AI agents required to run this company.

---

## 1. Executive & Governance
*These agents guide the ship and ensure the business doesn't breach legal limits.*

### A. The Orchestrator (Strategy & Finance)
- **Bring to Market:** Simulates financial models, sets the CAC limits, define Gate 0A/0B thresholds, and allocates budget based on the Phase 0 plan.
- **Ongoing Maintenance:** Directs revenue. Pauses failing agents, scales winning ones. Reconciles Stripe payouts against inventory costs.
- **Interfaces with:** Stripe, Xero/Accounting APIs, and all sub-agents.

### B. The CQC & Compliance Guard ("Ewa Agent")
- **Bring to Market:** Drafts protocols for the CQC application (safeguarding, risk assessments, clinical governance). Approves final EFSA claims for Phase 0 launch.
- **Ongoing Maintenance:** An active interceptor. Reviews every single piece of output (ads, emails, dashboard text) before it goes live. Monitors changing FSA/MHRA regulations and alerts the CEO if past copy needs updating.

---

## 2. Engineering, Infrastructure & Data
*These agents build the product and keep the lights on.*

### C. The Full-Stack Architect (Next.js & Supabase)
- **Bring to Market:** Scaffolds the Next.js application, implements the styling (brand guidelines), builds the interactive "Test Selector Quiz," and integrates Stripe & Thriva APIs.
- **Ongoing Maintenance:** Handles technical debt. Updates NPM dependencies, resolves React hydration errors, patches security vulnerabilities, and optimises Core Web Vitals to keep the site fast.

### D. The Database & SysOps Admin
- **Bring to Market:** Designs the Supabase PostgreSQL schema (users, orders, lab_results, subscriptions). Sets up Row Level Security (RLS) policies for GDPR compliance.
- **Ongoing Maintenance:** Monitors API uptime (Thriva/Stripe webhooks). Generates TypeScript types for the frontend whenever schema changes. Runs automated daily database backups and flags slow SQL queries or Edge Function timeouts.

---

## 3. Revenue, Acquisition & Content
*These agents are the engine for customer acquisition.*

### E. The Performance Media Buyer
- **Bring to Market:** Sets up Google Ads / Meta Business Manager pixels. Launches the initial highly-targeted search campaigns (e.g., "GP refused testosterone test").
- **Ongoing Maintenance:** A mathematical trader. Adjusts bids daily. Pauses ads breaching the £55 CAC limit. Creates A/B tests for landing pages and routes traffic to the winner.

### F. The SEO & Organic Growth Machine
- **Bring to Market:** Crawls competitor architectures (Voy, Medichecks) and maps out a programmatic SEO structure (e.g., `/[symptom]-blood-test-uk`).
- **Ongoing Maintenance:** Crawls Google Search Console weekly. Identifies decaying content and updates it. Monitors Reddit/Quora for long-tail queries and autonomously drafts and publishes highly relevant blog posts that adhere to the "Keith" persona.

### G. The Creative Factory ("Keith Agent")
- **Bring to Market:** Writes all foundational copy: landing pages, the seq-01 waitlist emails, video scripts.
- **Ongoing Maintenance:** Constantly generates fresh ad creatives, LinkedIn posts, and weekly newsletters to prevent ad fatigue. Never deviates from the plain-spoken UK brand voice.

### H. The Networker (Affiliates & RevOps)
- **Bring to Market:** Scrapes Instagram/TikTok for UK men's fitness influencers. Sets up the FirstPromoter tracking links.
- **Ongoing Maintenance:** Runs ongoing cold email outreach. Automates commission payout calculations. Chases PTs whose affiliate links have gone dormant with "reactivation" offers.

---

## 4. Operations, Logistics & Customer Experience
*These agents handle the physical realities of the business.*

### I. The Supply Chain & Inventory Agent
- **Bring to Market:** Identifies component pricing. Helps place the initial Gate 0A supplement MOQ order.
- **Ongoing Maintenance:** Connects to the Shopify/Custom e-com backend and the 3PL (Third Party Logistics) provider. Tracks outbound kits. When "Daily Stack" sachets drop below a 30-day supply buffer, it autonomously drafts the purchase order for the manufacturer.

### J. The CRM Lifecycle Automator
- **Bring to Market:** Builds the Customer.io logic trees. Connects the Thriva API payload to the email triggers (e.g., linking low Vitamin D to `seq-03a`).
- **Ongoing Maintenance:** Cleans the CRM. Merges duplicate patient profiles. Strips out hard-bouncing emails to protect domain reputation. Monitors the 45-day churn window and fires intervention emails.

### K. The Customer Support & Triage Desk
- **Bring to Market:** Ingests the entire product catalogue, shipping rules, and lab FAQ so it has a perfect knowledge base.
- **Ongoing Maintenance:** Monitors the support inbox. Automates replies for "Where is my kit?" by calling the Royal Mail API. Flags complex or medical questions (e.g., "My finger won't bleed enough") for human intervention.

---

## Summary of the Steady-State Loop

In ongoing maintenance, these agents talk to each other. For example:

1. **The Infrastructure Agent** detects the Thriva API is down.
2. It alerts the **Performance Buyer** to pause Google Ads instantly so you don't pay for broken traffic.
3. It alerts the **Support Agent** to put an auto-responder on the inbox saying "Lab results are delayed by 2 hours due to system updates."
4. Once resolved, ads turn back on, and the **Orchestrator** logs the downtime effect on the weekly tripwire.

---

**Cross-reference:** `01_strategy/ai-agent-org-chart.md` for role-by-role responsibilities and interaction flows.
