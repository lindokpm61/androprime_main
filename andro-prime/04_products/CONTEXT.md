# Products Workspace Context

## Purpose
This workspace defines the product catalogue and the logic that links results to offers.

Use it for:
- kit specs
- supplement specs
- pricing logic
- results-engine rules
- CTA triggers
- threshold mapping
- qualifier logic
- cross-sell logic

## Source-of-truth documents — read in this order

1. `icp-kit-supplement-alignment-april2026.md` — **primary source of truth for all copy and UX decisions.** Defines kit-to-ICP alignment, cross-sell architecture, supplement formulation, dashboard selling principle, and compliance rules. Supersedes V7 docs on copy and UX.
2. `catalogue/product-catalogue-v7-1.md` — full product catalogue: specs, COGS, margins, regulatory position
3. `catalogue/non-regulated-tier-v7.md` — Phase 0 non-regulated tier architecture, gate logic, financial forecast
4. `kits/kit-1-launch-guide.md` — Kit 1 lab negotiations, tech stack, Supabase schema, results report design (lab section superseded by `../05_partners/labs/lab-partner-rankings-addendum.md`)
5. `supplements/peptide-opportunity-analysis.md` — collagen supplement + post-CQC peptide therapy opportunity

## What belongs here
- product catalogue
- kit and supplement docs
- pricing docs
- threshold tables
- dashboard recommendation logic
- conversion rule mappings

## Good output looks like
- structured in tables or clear logic
- commercially useful
- compliant with the business model
- consistent with the current product catalogue
- explicit about primary vs secondary CTA logic

## Do not use this workspace for
- campaign strategy
- visual design
- generic copywriting detached from product rules
- partner negotiation notes unless they directly change product logic
