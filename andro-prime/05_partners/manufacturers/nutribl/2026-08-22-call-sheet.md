# Nutribl — call sheet

**Created:** 2026-08-22 | **Owner:** Keith | **Status:** **CONTACTED 2026-08-23, REPLIED 2026-08-24.** The reply is a **templated welcome pack from Alison at `hello@nutribl.com`, not an answer to the application** (thread `1a030b79827217c2`). It closed two of the three label questions, ignored the third, and did not action the Dropship Light application at all. Question-by-question diff: `correspondence/2026-08-24-alison-nutribl-reply-question-diff.md`. **Next move is ours: book the call at `nutribl.com/t-call.aspx`.**
**Route:** **`hello@nutribl.com`**, the apply address for Dropship Light 3PL, plus a "Schedule a Call" option on their site. ~~trade counter + order line, **0800 061 4487**. No named contact, no account manager, no booking link.~~ **Corrected 2026-08-23:** the 3PL page names an email route and a booking option, so the trade counter is no longer the only door and is the wrong one for a first contact. Draft email: `correspondence/2026-08-23-keith-nutribl-3pl-and-label-mechanics-draft.md`.
**Account:** self-serve trade account created via web form 2026-08-19. ~~**They have never been emailed.**~~ **Emailed 2026-08-23, replied 2026-08-24.** Note for the call: their reply told us to *"set up a trade account with us on the website"*, five days after we told them the account existed. That is the tell that it is an auto-responder, not a read. ~~The only message in the mailbox is an automated registration confirmation from `orders@nutribl.com`.~~ **Corrected 2026-08-23:** the registration confirmation is no longer the only inbound. **Nutribl send a daily "Nutribl Inventory File" email at about 06:00 UTC from `orders@nutribl.com`, with an attached file listing products they have temporarily run out of.** Observed 22 and 23 August. That is a **stock feed we are already receiving and not using**: it is what would tell the shop a SKU is unavailable before a customer orders it. Worth parsing once the shop is live, and worth asking whether the same data is available by API rather than as a daily attachment. **PARSED 2026-08-24 (`THC_InvUpdate_2482026.csv`, 8 rows, SKUs in `PL-xxx` private-label form):** **none of the launch three appear, so D3, B12 and Zinc are all in stock.** Two rows matter anyway, and both are Tier 1 asks below: **`PL-458` Brain Support Complex 90 caps is at -90**, oversold, and it is the only vehicle in their catalogue for pantothenic acid, therefore the only route to a cortisol product; **`PL-399` Garcinia Cambogia Complex is down to 5 units**, and it is one of only two vehicles for chromium, the only compliant glucose product. **Both Tier 1 asks now carry a supply question on top of the formulation question.** Also out: Krill Oil 500mg, and four gummy lines.
**Position:** Nutribl are the SINGULAR remaining lead. Vita Manufacture and Rawcreation are parked on product fit; Synergy Biologics never replied.

**Read with:** `../../../04_products/supplements/supplement-purchase-list.md` (the buy list these questions gate), `outreach-brief.md`.

---

## Do NOT ask these. They are already answered.

Asking a supplier something their own catalogue answers costs credibility on a first call.

| Already known | Source |
|---|---|
| Private label is their business model | 136 of 138 SKUs carry "Wholesale private label orders 4-5 working day lead time" |
| Artwork spec per SKU | Published per product: label size, 2mm bleed, exact submission dimensions, mandatory `PL-xxx.docx` label-text file |
| Lead time | 4 to 5 working days |
| Label design setup | £80 CORE / £140 CLASSIC / £220 PREMIUM one-off. **The CLASSIC 5-slot Starter Bundle at £145 beats building three bottles at £140** |
| Design alterations | £5 to £20 |
| 3D pack-shot renders | £20 (retires the CSS pack shots in the results-page mockups) |
| Vector source files | £109 extra, SER116. **We do not own artwork they design unless we pay** |
| Stock and dosing on the launch three | D3 4,000 IU 365 tabs `1152` £3.00; Zinc 15mg 120 `1121` £2.72; B12 1mg 120 `1009` £3.95. All one-a-day, all in stock |
| **MOQ: 10 units per SKU** | `NutriblDropshipLight3PL.pdf`, stated twice. **The launch three cost about £96.70 of stock in total** |
| **Fulfilment: they have a 3PL service** | Same PDF. Nutribl label your stock and pass it to a 3PL partner who warehouses it and ships your orders. See the section below |

---

## Tier 1 — the four that decide how wide the shop gets

Every one is a **single-ingredient capsule**, the simplest possible manufacturing ask. Each is
the only compliant route to its panel, so a no on any one closes that section of the shop.

| # | Ask | Why it matters |
|---|---|---|
| 1 | **Iodine, single-nutrient, specified dose.** No standalone SKU exists. They use potassium iodide in their vegan multivitamin and gummy premixes, which is the right form. | Half the thyroid section. Selenium alone does not carry it |
| 2 | **Chromium, single-nutrient.** Exists only inside a caffeine fat-burner, a Garcinia weight product, and the iron multivitamin we refuse. | The **only** compliant glucose product. Without it the HbA1c section is empty |
| 3 | **Pantothenic acid (B5), single-nutrient.** Only vehicles are Brain Support Complex at £8.57, kids' gummies, and their B Complex, which uses cyanocobalamin and folic acid | The only claim that names steroid hormones, so the only cortisol product |
| 4 | **Selenium at 100µg instead of 200µg.** Their `1118` is L-selenomethionine, the correct form, but at double our spec and 200µg carries a diabetes signal | Already a known ask. Bundle it with 1 to 3 as one conversation about short runs |

**Frame all four as one question:** *"Will you run single-nutrient capsules at a specified dose,
and what is the MOQ and setup on a short run?"*

## Tier 2 — commercial terms

| # | Ask |
|---|---|
| 5 | ~~**MOQ.**~~ **ANSWERED 2026-08-23: 10 units per SKU.** Do not ask. Gate 0A wanted an MOQ small enough that a total write-off is survivable; the write-off is about £97 |
| 6 | ~~**Can we submit our own print-ready artwork** instead of buying a design tier~~ **ANSWERED 2026-08-24, and it is a yes.** *"You can either do this yourself, yes this option is free of charge - or we can do it for you."* **That makes the GBP 145 CLASSIC Starter Bundle optional and removes the GBP 109 vector-file lock-in entirely.** She did not describe the submission route, but the spec is published per SKU and is confirmed below |
| 7 | **Shelf life / best-before on stock SKUs at dispatch.** Not recorded anywhere in the repo. **DOWNGRADED 2026-08-23**: the failure mode it guards against was an MOQ we cannot sell through, and at 10 units that is a £97 loss. Still worth knowing, no longer a gate |
| 8 | **A better trade tier at volume.** Lever: their Tier 1 discount is close to nothing, trade differs from list on only **4 of 138 SKUs**, so there is room to ask |
| 9 | **Supply continuity.** Can they hold or reserve stock, and what happens on a discontinued line |
| 10 | **Bespoke blending.** The words bespoke, custom formulation, MOQ and setup fee appear nowhere in the catalogue. Lower priority now that separate bottles is decided, but worth knowing whether it exists at all |

## Tier 3 — compliance and legal, none of it in the repo today

These are the ones most likely to be missed and most expensive to discover late.

| # | Ask | Why |
|---|---|---|
| 11 | ~~**Who is the Food Business Operator on a private-label bottle, us or them?**~~ **ANSWERED 2026-08-24, and it lands on us.** Alison, quoting the legislation: *"The food business operator responsible for the food information shall be the operator under whose name or business name the food is marketed."* **Andro Prime is the FBO.** The label must carry a business name and address established in the UK/EU; a PO box is acceptable, an email or web address alone is not. Their own disclaimer already pushes label responsibility to the brand owner, so this is consistent and expected | Confirms what this row predicted. It determines who answers to Trading Standards, and the answer is us |
| 12 | 🔴 **THE TOP OPEN ASK. Put to them 2026-08-23 and NOT answered in the 24 Aug reply.** **The mandatory `PL-xxx.docx` label text: can we choose which authorised claims appear, and add our own wording alongside?** | We need to select specific claims per panel. Their own listings print unauthorised lines, notably "Turmeric may help to support healthy liver function" on five SKUs. We must be able to omit those |
| 13 | **Certificate of Analysis and batch/lot traceability per delivery** | Needed for any complaint, recall or Ewa question. Their disclaimer already states label content is "purely advisory and ultimate responsibility lies with the brand owners" |
| 14 | **Exclusivity, or the absence of it.** Can a competitor buy the identical stock product with a different label? | On stock private label the answer is almost certainly yes. Worth hearing said aloud, because it bounds how defensible the range is and reinforces that the moat is the panel rule, not the bottle |
| 15 | **Vegan D3 at 4,000 IU.** `1152` is vegetarian but not vegan; their only vegan D3 is 1,000 IU. Zinc `1121` carries a soy allergen declaration | Product-page accuracy and a real segment |

## Dropship Light 3PL: READ AND CONFIRMED 2026-08-23

The previous version of this page flagged `NutriblDropshipLight3PL.pdf` as sitting unread in Downloads and
warned that if dropship were real it would be the highest-value item here. **It is real.** The PDF is now
filed alongside this page as `../NutriblDropshipLight3PL.pdf`.

**What the service is.** Not dropship in the strict sense. You buy stock at the 10-unit MOQ, Nutribl print
and apply your labels, and the stock goes to their 3PL partner who warehouses it. Your orders are picked,
packed and shipped from it, tracking flows back to your channel, and you are invoiced monthly for
warehousing and fulfilment. **You own inventory and never touch a box.**

**What it changes here.** Question 5 is answered and questions 7 and 9 lose most of their weight, exactly as
the old flag predicted. It also removes the last argument for holding stock ourselves, which was never
costed anywhere in the repo.

**What it changes for Gate 0A.** The gate is built on capped downside against an MOQ order, with exposure
capped at about £5,950. **The real exposure for the launch three is about £96.70 of stock plus label setup.**
The gate is now measuring a risk two orders of magnitude larger than the one that exists.

**The one place it does not slot in for free.** Their integrations are a fixed list of platforms: Shopify,
WooCommerce, Wix, Amazon, eBay, TikTok Shop and so on, ending in "your custom shopping cart". Our site is
that last tile. The automatic order flow is therefore not free for us, though the work is small: one
handler on `checkout.session.completed` pushing the order to the 3PL, the same shape as the existing Vitall
dispatch route.

### Three questions for the 3PL, NOT for Nutribl

The PDF never names the 3PL partner, and says terms are to be discussed with them directly. Ask these once
Nutribl route you to them.

| # | Ask | Why |
|---|---|---|
| A | **Who are you.** Company name, terms, contract | A third party will hold our stock and receive our customers' names and addresses. Nothing in the repo anticipates a fulfilment processor |
| B | **Warehousing and per-order fulfilment cost** at our volume, and the tier breakpoints | **This sets the retail price.** The repo's only figure is a £2.00 to £3.50 per-order guess in `../../../04_products/supplements/omega-3-loop-spec.md`. On a sub-£20 bottle it is the difference between a £9.95 and a £19.95 price |
| C | **What interface do you expose to a custom cart** — API, file drop, portal, email | Decides how our checkout hands an order over, and whether it is one afternoon of work or a manual process |

### One compliance item this creates

Customer name and delivery address will go to a third-party logistics provider. The processor table in
`../../../03_compliance/privacy/privacy-policy.md` lists Stripe, Customer.io, Supabase, Hetzner and
Cloudflare. It will need a row and a DPA before the first order ships. Not a blocker, and not currently
written down anywhere.

## What the 2026-08-24 reply actually did, and the packaging spec it let us verify

**Scored against the four things asked on 23 August: one answered, one answered by implication, two ignored.**
Full diff in `correspondence/2026-08-24-alison-nutribl-reply-question-diff.md`. The short version:

| Asked | Outcome |
|---|---|
| Apply for Dropship Light 3PL | 🔴 **Not actioned.** She linked back to the same `t-3PL-Fulfilment-Costs.aspx` page that prompted the email |
| Can we supply our own print-ready artwork | ✅ **Yes, and free of charge** |
| Can we choose which authorised claims appear on the label text | 🔴 **Ignored.** This is the compliance gate and it is still open |
| Who is the FBO | ✅ **Us**, quoted from the legislation |
| (implicit) What interface does the 3PL expose to a custom cart | 🔴 **Ignored** |

**The 3PL page does not publish costs.** Checked directly on 2026-08-24. Despite the filename it states only that
the service is flexible, easy to set up, has no minimum order and is low capital; that transfer of your labelled stock
from Nutribl to the 3PL partner is **free**; and that storage and per-order shipping are **"a paid service"** with no
figure attached. The partner is not named. **The only route to the number is the booking link, `nutribl.com/t-call.aspx`.**
That keeps question B in the 3PL table above as the single largest open variable in
`../../../04_products/supplements/supplement-unit-economics-2026-08-24.md`.

**Her price list reconciles exactly with the catalogue figures already recorded above.** New template Classic GBP 80 /
Premium GBP 130; Starter 5 GBP 145 / GBP 225; Standard 10 GBP 235 / GBP 365; Mega 20 GBP 415 / GBP 635; Core templates
from GBP 100. Nothing to correct, and nothing moved.

### Packaging spec, verified on the product pages 2026-08-24

Read off the three launch product pages directly, because her reply pointed at the packaging category pages
rather than answering. **All three launch SKUs are identical in format:**

| Field | Value |
|---|---|
| Format | **150ml Flat Postal**, the letterbox-friendly flat mail packer |
| Bottle | 107 x 79 x 22 mm, white, BMPP/HDPE body, PP snap-on lid |
| Label size | **76 x 60 mm** |
| Artwork submitted at | **80 x 64 mm**, 2 mm bleed each side |
| Applies to | D3 4,000 IU 365 tabs `1152`, B12 1mg 120 caps `1009`, Zinc 15mg 120 caps `1121` |

**The 365-tablet D3 is the same pack as the 120-capsule bottles**, so tablet count does not change the format,
and one artwork spec covers the whole launch range.

**The consequence is a postage one and it is already load-bearing.** A single bottle at 22 mm clears the Royal Mail
Large Letter depth limit of 25 mm. **Three bottles stacked is 66 mm, which is a parcel.** The unit-economics model
assumes one flat GBP 3.00 for both a single and a bundle, and that cannot be right. Direction is now certain: high for
a single, low for the bundle. **Ask the 3PL for both bands, not one number.**

**Stock products come as they are.** *"Stock products have to be taken as they are made - so they have the same
packaging and the same count per bottle as per the website product page."* Custom packaging on a flat mail packer needs
**60,000 capsules or tablets per product**, and on a round PET bottle **500 units per line**. Neither is reachable, so
the pack format is fixed and the only variable is the label.

---

## Two things to bring, not ask

- **The order is three bottles, not one.** D3, B12, Zinc. Quote the CLASSIC 5-slot Starter Bundle
  at £145 back at them, since it undercuts three separate £140 setups and leaves two slots for
  selenium and whichever of the Tier 1 asks lands.
- **We are not asking them to formulate anything.** Every product on the buy list is stock. That is
  a cheap conversation for them and worth saying, because it is the reason a short run on four
  single-nutrient capsules should be an easy yes.
