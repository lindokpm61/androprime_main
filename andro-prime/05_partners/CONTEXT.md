# Partners Workspace Context

## Purpose
This workspace evaluates and manages external partners.

Use it for:
- lab partner evaluation
- manufacturer evaluation
- requirement capture
- commercial comparison
- API/SLA requirement notes
- partner risk analysis

## What belongs here
- lab comparison notes
- negotiation targets
- API requirements
- manufacturer shortlist notes
- partner-specific risk and constraint documents

## Good output looks like
- comparative
- factual
- clear about preferred vs benchmark-only partners
- explicit about commercial and operational implications

## Do not use this workspace for
- campaign writing
- product messaging
- general strategy unless it is specifically partner-driven
- engineering implementation beyond partner requirements

## Directory Structure

### Cross-partner files (this level)
- `labs/lab-partner-rankings-addendum.md` — current lab partner shortlist and rankings

### Active partner directories
When a partner moves from evaluation to active engagement, create a dedicated directory under the appropriate category (`labs/`, `manufacturers/`, `future-clinical-partners/`).

Each active partner directory should contain:
- A `CONTEXT.md` describing the partner, engagement status, and subdirectory layout
- A negotiation log (living document tracking what's agreed, open, and divergent from assumptions)
- Raw meeting and correspondence records in subdirectories

The internal structure will vary by partner type. Labs involve API integration, biomarker constraints, and clinical governance. Manufacturers involve MOQ gates, formulation specs, and lead times. Define the structure in each partner's own `CONTEXT.md`.

### Benchmark-only partners
Partners kept for comparison only (no active engagement) stay as single files in `labs/benchmark-only/` or equivalent. No subdirectory needed.
