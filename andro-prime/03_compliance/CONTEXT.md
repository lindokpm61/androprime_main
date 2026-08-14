# Compliance: Context

**Regulatory framework:** UK: ASA CAP Code, EFSA health claims regulation, UK GDPR (UK GDPR / DPA 2018), CQC (post-CQC only), Consumer Rights Act 2015
**Owner workspace:** `03_compliance`
**Integration:** All copy, product, marketing, and engineering work that touches regulated language, personal data, deposit terms, or clinical boundaries must be cleared through this workspace before publishing.
**Live status:** the dated approval tally, approved-but-gated items, DPIA outstanding actions, and open compliance-doc gaps are in `STATE.md`; read it alongside this file.

> **Approvals: check ClickUp FIRST, then the repo (decided 2026-07-31).** ClickUp is the central hub for sign-offs and the repo is the copy. Before answering any "is this approved / signed off / still owed" question, read the hub: **list `901219880207`** (Approvals & Sign-offs, one task per CA-NNN, status carries APPROVED / PENDING) for numbered approvals, and **list `901218140081`** (the blog-article Content Review list, where completing the task IS the approval) for articles and webpages. Workspace `90121729875`. Only then read `content-approval/content-approval-register.md` and the `approval-record-*.md` files, which hold the detail and the pre-flight evidence the board cannot carry. **Never infer sign-off state from a marker inside the artefact** (a `TODO`, a "pending Ewa" note, an unticked box): those go stale the moment the reviewer acts and have already caused false escalations to Ewa. This reverses the 2026-07-26 line that made the repo register the source of truth.

This workspace governs wording risk, privacy, data governance, and regulatory boundary checks for Andro Prime. Two operating modes exist in parallel. Do not conflate them.

---

## Directory Structure

```text
03_compliance/
├── claims-and-labels/          ← Pillar-E andropause claims pack (approved claim wording)
├── content-approval/           ← Approval log for copy, social, ads, email before publish
├── correspondence/             ← Founder/partner compliance correspondence (e.g. Keith/Ewa gate drafts)
├── credentials/
│   └── ewa-trt-training-2025.md ← Evidence for the "Harley Street TRT-trained" claim
├── deletion-policy/            ← Data deletion procedures and retention schedules
├── deposits/
│   └── supplement-pre-order-terms.md   ← Supplement pre-order terms (STALE, dated April). Deposit mechanic shelved 2026-05-08 (Gate 0A is now counted by first paid subscription invoice); file pending reconciliation.
├── dpia/
│   └── phase0-dpia.md          ← DPIA for Phase 0; also holds the Vitall controller-to-controller agreement + sub-processor / data-sharing schedule
├── privacy/
│   └── privacy-policy.md       ← Published privacy policy (UK GDPR compliant)
├── brand-licence/
│   └── inter-company-brand-licence.md  ← IP licence between operating entities
├── 2026-06-04-lowt-nurture-lawful-basis.md     ← Dated decision: low-T nurture lawful basis
├── 2026-06-23-signup-clinical-optin-consent.md ← Dated decision: signup clinical opt-in consent
├── 2026-07-25-terms-privacy-legal-review.md    ← Dated decision: T&C + privacy legal review
├── clinical-governance-position.md ← APPROVED (Dr Ewa Lindo 2026-05-22); source of the "Ewa signs off the system, not individual reports" rule
├── clinical-governance-copy-corrections.md ← Copy corrections flowing from the governance position
├── data-controller-position.md ← Controller vs processor positions for all data flows
├── gdpr-readiness-checklist.md ← Pre-launch GDPR checklist
├── pre-launch-checklist.md     ← DRAFT go/no-go gate (assembled 2026-07-02, pending Keith/Ewa ratification). Consolidates qa-gates + register + DPIA §5.
├── STATE.md                    ← Volatile status: approval tally, gated items, DPIA outstanding actions, open doc gaps
└── terms-and-conditions.md     ← Site-wide T&Cs
```

---

## How to Work Here

### Reviewing copy for compliance

1. Identify the content type: supplement claim, kit claim, founding-member CTA (non-cash email opt-in), results copy, or TRT reference.
2. Check against the Red-Flag Language table below.
3. Check ingredient claims against the EFSA Approved Claims table below.
4. Apply the Phase 0 / post-CQC boundary check: if the copy implies clinical services are live, it fails.
5. Log the approval in **ClickUp first** (the hub), then mirror it into `content-approval/` with the reviewer name and date plus the pre-flight evidence.

### Reviewing a new product or feature

1. Read the relevant product spec in `04_products/`.
2. Identify any data processing, health claims, or financial terms it introduces.
3. Update `dpia/phase0-dpia.md` if new personal data flows are involved.
4. Update `data-controller-position.md` if a new processor relationship is introduced.
5. Flag to Keith before implementation proceeds if the feature crosses into clinical territory.

### Updating privacy or terms documents

1. Read the current file before editing: these are published documents, not drafts.
2. Record the change reason and date in a comment at the top of the file.
3. If the change affects data subject rights or retention periods, re-run the GDPR readiness checklist.
4. Notify Keith before publishing any update to the live privacy policy or T&Cs.

### Adding a new sub-processor or data partner

1. Record the entity in `dpia/phase0-dpia.md` (data-flow / processor tables and the Vitall controller-to-controller / sub-processor schedule) with: name, role, data accessed, legal basis, DPA reference.
2. Update `data-controller-position.md`.
3. Update the privacy policy's sub-processor schedule if required.

---

## Red-Flag Language Reference

Words and phrases that require immediate review before use in any published output.

| Term | Risk | Permitted alternative |
| --- | --- | --- |
| "diagnose" / "diagnosis" | Implies medical act | "Find out what your levels are" |
| "treat" / "treatment" | Medicinal claim | Remove entirely in Phase 0 |
| "cure" | Medicinal claim | Remove entirely |
| "You have low testosterone" | Definitive medical statement | "Your results indicate..." |
| "TRT is available now" | False availability claim | "Be first when we launch" |
| "clinically proven" | Misleading without RCT reference | Remove or cite specific study |
| "Collagen heals your joints" | Medicinal claim | "Vitamin C contributes to normal collagen formation for the normal function of cartilage" |
| "B12 improves your mood" | Unauthorised health claim | "Contributes to normal psychological function" |
| "Ashwagandha" (any context) | No approved EFSA claim; ASA exposure | Silent ingredient; never mention |
| "fix" / "cure" in retest copy | Implies therapeutic outcome | "Find out how your levels have changed" |
| Low-T action (GP referral) fired from Kit 2 results | False trigger: no testosterone confirmation | Only from confirmed T < 12 nmol/L on Kit 1 or Kit 3; never infer low T from Kit 2 energy/recovery markers |
| "GP-built report" / "personalised report" / "Dr Ewa reviewed your results" | Implies bespoke per-customer clinical interpretation (Ewa signs off the *system*, not individual reports) | "Ewa-approved recommendation logic"; see Special Cases |
| "CQC trigger" / "40 patients unlocks CQC" | Implies a regulatory volume gate that does not exist: CQC has no patient-volume requirement | "internal TRT-readiness target" (the "40" is a commercial signal, not a CQC condition) |
| "£75 deposit" (founding member) | Shelved 2026-05-08; no deposit is taken | Remove; FM is a non-cash email opt-in only |

---

## EFSA Approved Claims Reference

Only these claims are permitted for the listed ingredients. Do not rephrase, extend, or imply anything beyond the approved wording.

| Ingredient | Approved claim | Products |
| --- | --- | --- |
| Zinc | "Contributes to the maintenance of normal testosterone levels" | Daily Stack |
| Vitamin D3 | "Contributes to normal muscle function" | Daily Stack |
| Active B12 (Methylcobalamin) | "Contributes to normal energy-yielding metabolism" / "Contributes to normal psychological function" | Daily Stack |
| Vitamin C | "Contributes to normal collagen formation for the normal function of cartilage" | Joint & Recovery Collagen |
| Ashwagandha KSM-66 | **No approved EFSA claim. Silent ingredient. Do not mention.** | Daily Stack (undisclosed) |

> **V7.2 reformulation note (April 2026):** Magnesium has been removed from the Daily Stack formulation. The previous Magnesium fatigue claim ("contributes to the reduction of tiredness and fatigue") is no longer applicable to any Andro Prime product. Do not use this claim in copy. Energy/fatigue claims now flow through Active B12's energy-yielding metabolism claim, which has the additional benefit of being directly tied to a measured biomarker (Active B12 in Kit 2 and Kit 3).

---

## Phase 0 vs Post-CQC Boundary

This is the most important boundary in the business. It must be enforced in every output.

| Phase 0: Permitted | Post-CQC Only: Not permitted until CQC registration is live |
| --- | --- |
| Non-regulated diagnostic kit sales | Regulated clinical intake |
| Supplement subscriptions | TRT prescribing |
| Founding-member list (non-cash email opt-in) | Confirmatory testosterone testing |
| Results reporting with approved wording | Clinical results delivery with prescriber sign-off |
| "Be first when we launch TRT" | "TRT is available" |
| GP referral on a low-T result (T < 12); founding-member list as a separate non-cash opt-in | Anything implying a prescription is being issued |

If any task risks crossing this line: stop. Route to Keith before proceeding.

---

## Special Cases

**Low-T result routing (changed 2026-06-04, Ewa CA-014):** A confirmed testosterone result < 12 nmol/L (Kit 1 or Kit 3) routes to a **GP referral** with no kit/supplement upsell, **not** the founding-member list (that was the old routing; it's superseded and verified in `09_website-app` `lib/results/classifier.ts`). Never infer low T from Kit 2 energy/recovery markers. A consent-gated nurture opt-in may sit alongside the referral (lawful basis pending solicitor). The **founding-member list** itself still exists as a standalone **non-cash email opt-in** (no payment is taken, no contractual right to a future TRT service is created, and customers can leave any time by emailing support), but it is no longer auto-triggered by a low-T result. The £75 deposit was shelved 2026-05-08; do not reference it in any new copy.

**Ashwagandha silent ingredient:** Ashwagandha KSM-66 is in the Daily Stack. It has no approved EFSA claim. It is a silent ingredient: do not name it in any copy, email, social, affiliate brief, or influencer talking points. **This includes prohibition/prohibited-terms sections themselves**: the v2.2 PT/Influencer briefs breached the rule by printing the ingredient name inside their *own* prohibited-list; v2.3 enforces it via an approved-claims allowlist + scripted answers **without ever naming it**. Never regress this. All affiliate and influencer partners must be briefed in writing before code issuance. If a partner makes a public claim about it, the ASA complaint lands on Andro Prime. Partner-brief approvals are logged in `content-approval/` (CA-001…007); CA-001/002 (PT brief + attestation) still need **solicitor** sign-off on the commission clause before shipping.

**Ewa signs off the system, not individual reports:** Dr Ewa Lindo approves the *recommendation logic* (thresholds, result→product mapping, copy); she does **not** review or interpret any individual customer's results. Never describe outputs as a "GP-built report", "personalised report", or "reviewed by our doctor". Use "Ewa-approved recommendation logic". No Ewa-led per-customer add-ons or bespoke interpretations. This keeps the results engine a wellness product, not a clinical act (which would cross the Phase 0 / post-CQC boundary). Source of truth: `clinical-governance-position.md` (APPROVED by Dr Ewa Lindo 2026-05-22).

**Results copy scoping:** Kit 1 tests testosterone only. Do not frame Kit 1 as explaining general fatigue or energy symptoms. That framing belongs to Kit 2 and Kit 3.

**Retest framing:** Always use "Find out how your levels have changed." Never use language that implies the supplement fixed or cured anything.

**pre-launch-checklist.md:** **DRAFT go/no-go gate: assembled 2026-07-02** from `10_launch-ops/implementation-checklists/qa-gates.md` (Gates 1–5 + 0A) + the content-approval register + DPIA §5. **Not yet ratified**: Keith signs off (clinical items co-signed by Ewa) before it governs go-live; until then, live gate status stays in `10_launch-ops/STATE.md` + ClickUp. Do NOT treat the draft as a passed gate.

---

## Health-Data Processing Consent (Art 9)

Biomarker results are **special-category health data**: processing needs an Art 9 condition. Andro Prime uses **explicit consent, Art 9(2)(a)**, and the *where* matters as much as the *what*:

- **Captured at CHECKOUT**, at the point of purchase, carried into Stripe Checkout metadata, then stamped onto the customer/order record by the Stripe webhook. This is the consent that authorises processing the results.
- **NEVER used to gate access to results the customer has already paid for.** Consent must be "freely given" (UK GDPR); making it a condition of delivering an already-purchased service is not freely given and is invalid. Do not build a "consent wall" in front of the results dashboard.
- The **`/auth/consent` page is an 18+ age confirmation only**: it is *not* the health-data consent and must not be conflated with it.
- Approved copy: `content-approval/approval-record-signup-health-processing-consent-2026-06-23.md` (CA-018). Implementation (metadata → webhook stamp) is in `09_website-app`.

---

## Public Media Bucket — what may never enter it

**The bucket:** Supabase Storage `content`, public, created 2026-08-14 (plan step 3.3, gate D3). Path
convention `<asset-slug>/<kind>-<sha256[0:8]>.<ext>`. It exists because Metricool ingests media by
fetching a URL **unauthenticated** at schedule time, so publishable media has to be readable by
anyone holding the path.

**Public means unauthenticated, permanent, CDN-cached and crawlable.** Treat every upload as
published the moment it lands, whether or not a post ever goes out.

**Never put these in it.** Not "avoid" — never:

- **Results PDFs** and any rendered report for an identifiable customer.
- **Biomarker charts, tables or values** belonging to a real person, including anonymised-looking
  ones. A chart with a name stripped off is still that person's health data, and health data is
  special category (Art 9).
- **Customer-supplied photos** of any kind, and anything sent to support.
- **Anything user-derived**: quiz answers, order contents, addresses, screenshots of a dashboard
  with real data in it.
- **Unapproved copy rendered into an image.** A slide is copy. If the words have not cleared
  pre-flight, the PNG of them has not either.

**What belongs in it:** rendered marketing media only — carousel slides, covers, thumbnails,
published video cuts. Working media stays on Drive; site chrome stays in `frontend/public/`.

**Three controls enforce this, at three layers**, because a rule that exists only as prose is
enforced by whoever happens to remember it:

1. **Mime allowlist on the bucket** — `image/png`, `image/jpeg`, `video/mp4` only. A results PDF is
   `application/pdf` and is refused with 415 for **every** caller including the service role.
   Verified 2026-08-14 by attempting it.
2. **No RLS policy on `storage.objects`** — anon and authenticated can neither write nor enumerate;
   an anonymous list returns `[]`. Only the service role writes. Public download is a separate route
   that does not consult RLS, which is why reads still work with zero policies. Verified 2026-08-14:
   anon upload 403, anon delete 403, anon list empty, unauthenticated download 200.
3. **Doctor invariant I11** — every object must match the path convention and its slug must belong
   to a known content asset. This is the layer that catches what a mime type cannot see: a
   correctly-typed PNG that is nonetheless a biomarker chart. An object nobody can account for is a
   violation on its own.

**The content hash in the path is the embargo, not cache-busting.** Slugs are published in the
content queue and the run calendar, so `<slug>/slide-03.png` would be guessable by anyone who reads
the plan, and up to thirty carousels sit in the bucket before their slot. Listing is already denied;
the hash closes the guess.

**If you need to widen any of this**, that is a compliance change, not a config change. Never add a
`select` policy on `storage.objects` (it turns "unguessable" into "enumerable") and never widen the
mime allowlist to admit documents.

---

## Takedown: pulling a retracted claim from every copy of it

Written 2026-08-14 (plan step 3.6). **A retracted claim lives in more places than the one you
edited**, and the count is fixed by how publishing works here: Metricool **re-hosts every asset to
its own CDN at schedule time**, so deleting from our Storage does not delete the published copy.
That is the same fact that makes the storage migration safe, read the other way round.

**Where a copy can be, in the order to clear them:**

| # | Copy | Who can remove it | Notes |
| --- | --- | --- | --- |
| 1 | The **live post** on the platform | Us, in the platform or via Metricool | Do this first. It is the only copy a member of the public actually sees. |
| 2 | The **scheduled/draft post** in Metricool | Us | Anything not yet out. Catch this before it publishes and steps 1 and 3 never arise. |
| 3 | **Metricool's CDN** copy (`static.metricool.com/planner/…`) | **Not directly** — see below | Publicly readable, and it outlives our origin by design. |
| 4 | **Supabase Storage** `content` | Us, service role | Delete the object. Cheap and always do it, but understand it removes the *origin*, not the published copy. |
| 5 | The **repo** | Us | The recipe: deck data files, `captions.md`, the manifest entry. If the claim stays here it gets re-rendered later by someone acting in good faith. |
| 6 | **`content_renditions.body`** | Us | Where the copy that shipped is recorded. Do not silently edit it — supersede it, so the trail still shows what was cleared and when. |
| 7 | **Search / social caches** | Not us | Request removal via the platform's own tool where the claim was indexed. |

**The order matters.** Public-facing first (1, 2), then origins (3, 4), then sources (5, 6), then
caches (7). Reversing it — tidying the repo first — leaves the live post up while you feel finished.

🔴 **Step 3 is UNVERIFIED and it is the weak point.** We do not know whether deleting a Metricool
post also removes its CDN media, or whether that URL stays live indefinitely. Nobody has tested it.
**The experiment that would answer it:** create a throwaway draft on our own brand with a disposable
image, record the `static.metricool.com` URL Metricool assigns, delete the post, then re-fetch the
URL. Until that is run, **assume the CDN copy persists** and treat Metricool support as the route.

**Who rules.** Keith decides a retraction is happening. **Ewa rules anything clinical**: whether a
claim is withdrawn, corrected or restated is a clinical judgement, not an editorial one. Log the
retraction in `content-approval/` against the original approval record, so the register shows the
claim was cleared *and later withdrawn* rather than quietly ceasing to exist.

**Why this exists here rather than in marketing.** An ASA complaint asks you to substantiate a claim
**as it stood when it was made**. That means the trail has to survive the takedown; deleting the
evidence along with the claim is the failure this procedure is written to prevent.

---

## Regulatory Body Reference

| Body | Scope | Relevant to |
| --- | --- | --- |
| ASA / CAP | Advertising claims, health claim substantiation | All marketing copy, email, social, ads |
| EFSA | Health claim approvals for food supplements | Supplement product copy and labelling |
| ICO (UK GDPR / DPA 2018) | Personal data processing, consent, retention | All data flows, privacy policy, DPIA |
| CQC | Regulated health service registration | Post-CQC clinical operations only |
| MHRA | Medicinal product classification | Any copy that risks medicinal claim territory |
| Consumer Rights Act 2015 | Goods fit for purpose, statutory consumer protections | Kit and supplement T&Cs, refund / cancellation handling |

---

## Do Not Use This Workspace For

- General marketing ideation without a compliance angle
- Product design unless the issue is regulatory
- UI or engineering implementation unless data governance is the focus
- Storing published content (content lives in `06_marketing/` and `09_website-app/`)

---

## Skills, tools & MCPs

MCP servers and tools most relevant when working in this workspace. Repo-wired servers are in the root `.mcp.json` (graphify, context7, dataforseo, supabase, clickup); the rest are claude.ai account connectors, some of which need authorising in an interactive session before use. This workspace is skill-and-agent heavy, not MCP-heavy.

**Skills & agents** (repo skills invoke as `/name`):

- **compliance-reviewer** (agent): read-only audit of external-facing copy or a diff against the 03_compliance rules; returns a three-bucket findings report. Never approves (sign-off stays with Ewa or Keith).
- `/compliance-preflight`: the Guardrail #1 pre-flight on any external-facing copy before it ships.
- `/draft-preflight`: earlier-stage check for copy still in progress.
- `/decision-sweep`: propagate a landed claims, legal, or threshold decision through every affected doc.
- `/article-to-review`, `/content-status`: route a drafted article to Ewa sign-off, and track approval status.

**MCPs & tools:**

- **Google Drive / gws CLI** (connector / local CLI): legal documents, approvals correspondence.
- No repo-wired MCP is central here; compliance work is document- and rules-driven.
