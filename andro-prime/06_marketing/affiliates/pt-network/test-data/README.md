# Attio Schema Test — Test Data

**Purpose:** Validate the Attio People + Deals schema works in practice before importing 200 real PT records.

**Status:** Test data only — DO NOT use these as real outreach targets. All 5 PTs are fictional. Names prefixed with `TEST -` for easy filtering and cleanup.

---

## Files

- `test-people-import.csv` — 5 fictional Person records
- `test-deals-import.csv` — 5 fictional Deal records, one per Person

---

## What this tests

| Coverage | How |
|---|---|
| All 3 cohort tags | 1 flagship, 2 first-wave, 2 standard |
| All 3 primary channels | 2 IG, 2 LinkedIn, 1 mixed |
| 5 sourcing channels | IG hashtag, LinkedIn search, CIMSPA, REPs, Competitor tag |
| 5 pipeline stages | Sourced, Contacted, Replied — positive, Onboarded, No reply |
| All 3 audience match scores | High, Medium, Low |
| Compliance flag | Onboarded record has it ticked; others blank |
| Numeric fields | Varied IG follower counts (4k–87k) and LI connections |

If all 5 records import cleanly and every field renders as expected on the record detail view, the schema works.

---

## Import order

1. **People first** — Attio needs the Person records to exist before Deal records can link to them.
2. **Deals second** — uses the `Associated People` column to link by name match.

---

## Import steps in Attio

### People

1. Workspace → People → Records view
2. Click "Add" → "Import" → "CSV"
3. Upload `test-people-import.csv`
4. Map each CSV column to the corresponding Attio attribute:
   - `Name` → Name
   - `Email` → Email addresses
   - `Description` → Description
   - `Instagram` → Instagram
   - `LinkedIn` → LinkedIn
   - `City` → City (custom)
   - `Follower count (IG)` → Follower count (IG)
   - `Connection count (LI)` → Connection count (LI)
   - `Audience match score` → Audience match score
5. Run a preview, confirm 5 rows, import.

### Deals

1. Workspace → Deals → Records view
2. Click "Add" → "Import" → "CSV"
3. Upload `test-deals-import.csv`
4. Map columns:
   - `Deal name` → Deal name
   - `Deal stage` → Deal stage
   - `Associated People` → Associated People (match by name)
   - `Sourcing channel` → Sourcing channel
   - `Cohort tag` → Cohort tag
   - `Primary channel` → Primary channel
   - `Compliance attested` → Compliance attested
   - `Last touch date` → Last touch date
5. Run preview, confirm linkage to Person records, import.

### Cleanup before going live

After validation, filter for Names starting with `TEST -` and delete all 5 People + 5 Deals. Do this BEFORE importing the real 200 PTs so test data doesn't contaminate the live database.

---

## What to look for after import

| Check | Where |
|---|---|
| All 5 People appear with full attributes | People table view |
| All 5 Deals appear in Sourced/Contacted/etc stages | Deals Kanban view |
| Each Deal links to the correct Person | Click into a Deal — see "Associated People" |
| Pipeline view shows stage distribution | Deals → Kanban |
| Filtering by Cohort tag = "Flagship candidate" returns 1 row | Filter on Deals |
| Filtering by Primary channel = "Instagram" returns 2 rows | Filter on Deals |
| Sorting by Follower count (IG) descending puts Marcus Whitfield first (87k) | People table |

If any of these checks fail, the schema needs adjusting before you import the real list.
