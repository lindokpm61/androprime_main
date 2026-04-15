# Andro Prime: AI Agent Organisational Chart

Based on the Phase 0 business model—which prioritises launching diagnostic kits, building a supplement MRR, and establishing a pre-qualified pipeline for clinical services—an AI-first approach is highly viable.

Here is how you can map out the traditional business functions into a team of specialised, autonomous AI agents.

---

## 1. The Orchestrator (CEO & Strategy Agent)

**Traditional Role:** CEO, Head of Strategy
**Core Function:** High-level decision making, resource allocation, and KPI monitoring.

**Responsibilities:**
- Monitors the "Weekly Tripwires" (e.g., Kit sales at 15–25/week, Blended CAC ≤ £50).
- Executes "Gate Decisions" (e.g., authorises the £4k–7k supplement MOQ order once 25+ pre-orders hit at Gate 0A).
- Coordinates the other agents, triggering the Growth Agent to scale ads or the Affiliate Agent to increase PT outreach based on dashboard metrics.

**Data Sources:** Financial models, KPI dashboards, daily revenue metrics.

---

## 2. "The Keith Agent" (Brand Voice & Copywriting)

**Traditional Role:** Chief Marketing Officer / Lead Copywriter
**Core Function:** Generates all outward-facing creative content, strictly adhering to the founder's plain-speaking, "pub-test" brand voice.

**Responsibilities:**
- Drafts Google/Meta ad copy, LinkedIn posts, and Reddit replies for r/UKTRT.
- Writes email sequences (seq-01 through seq-05) ensuring they sound personal ("Knackered all the time" instead of "Suboptimal energy levels").
- Addresses the 4 distinct ICPs with tailored messaging (e.g., Symptomatic Achiever vs. Proactive Optimiser).

**Rules Engine:** Fails any copy that sounds like a generic "clinic brochure" or pastel wellness brand.

---

## 3. "The Ewa Agent" (Medical Review & Compliance)

**Traditional Role:** Chief Medical Officer / General Counsel / CQC Prep Lead
**Core Function:** A strict compliance and safety filter for all generated content.

**Responsibilities:**
- Scans every landing page and email for EFSA-approved health claims (e.g., restricts "heals joints" to "contributes to normal collagen formation").
- Ensures absolute zero mention of TRT or clinical therapies on Phase 0 wellness pages.
- Approves the plain-language copy for the Thriva API biomarker results dashboard.

**Rules Engine:** Hard block on the words "diagnose" or "diagnosis"; enforces correct medical disclaimers.

---

## 4. The Performance Master (Paid Growth Agent)

**Traditional Role:** Head of Acquisition / Media Buyer
**Core Function:** Manages paid channel deployment (Layers 3–7) according to strict budget caps and performance triggers.

**Responsibilities:**
- Monitors Google Search intent campaigns (Week 1) and manages the £1,200/mo budget.
- Activates Meta warm retargeting only after the pixel has 3 weeks of data.
- Watches CTR (target > 5%) and CAC. Automatically requests "The Keith Agent" to rewrite headlines if CTR drops below 2%, or pauses campaigns if CAC exceeds £55.

---

## 5. The Networker (Affiliate & Partnerships Agent)

**Traditional Role:** Business Development / Influencer Manager
**Core Function:** Drives the Layer 1 & 2 "Affiliate-first" acquisition playbook.

**Responsibilities:**
- Scrapes, qualifies, and conducts cold outreach to UK micro-influencers (10k-150k followers) and Personal Trainers.
- Pitches the 20% commission structure + 15% client discount hook.
- Generates, issues, and tracks FirstPromoter affiliate codes, logging content sent and codes used.

---

## 6. The Architect (Web Production & Tech Agent)

**Traditional Role:** CTO / UX Developer
**Core Function:** Builds and maintains the digital storefront and API logic.

**Responsibilities:**
- Maintains the individual kit landing pages, ensuring price and lab accreditation are above the fold.
- Develops and refines the "Test Selector Quiz" routing logic.
- Maintains the Thriva API integration and triggers the correct conditional logic for the Results Dashboard (e.g., T < 12 nmol/L triggers the Founding Member CTA).

---

## 7. The Nurturer (CRM & Lifecycle Agent)

**Traditional Role:** Customer Success / Lifecycle Marketer
**Core Function:** Manages the Customer.io email flows and customer state transitions.

**Responsibilities:**
- Ingests the results from the Thriva API to trigger the correct post-kit sequence (e.g., triggering `seq-03a-result-energy-deficiency` vs `seq-03b-result-low-testosterone`).
- Monitors the 45-day engagement window to deploy the churn prevention sequence.
- Follows up on supplement pre-orders to ensure the 25+ deposit threshold is accurately tracked for Gate 0A.

---

## How They Interact (A Typical Flow)

1. **The Networker** signs a new PT. They share a code.
2. A customer buys *Kit 1*. **The Architect** ensures the purchase flows smoothly and pings the Thriva API.
3. The lab results return: *Testosterone is 10 nmol/L.*
4. **The Nurturer** triggers the `seq-03b` email flow (Founding Member pitch), drafted by **The Keith Agent** and pre-approved for compliance by **The Ewa Agent**.
5. **The Orchestrator** sees the deposit come in, updating the Monthly KPIs to check against the 40+ deposit threshold needed for formal CQC application prep.

---

**Cross-reference:** `01_strategy/ai-agent-enterprise-map.md` for the full enterprise map including engineering, logistics, and support agents.
