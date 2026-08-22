# Nutribl — trade account registration (2026-08-19)

**Status: this is the ONLY Nutribl item in the mailbox. No enquiry has ever been sent to Nutribl and
no human at Nutribl has ever replied.**

Verified 2026-08-22 by searching `keith@andro-prime.com` for `nutribl`, and separately for
`{from:nutribl.com to:nutribl.com} in:anywhere`. Both return this one thread.

| Field | Value |
|---|---|
| Date | 2026-08-19 22:05 UTC |
| From | `orders@nutribl.com` |
| To | `keith@andro-prime.com` |
| Subject | Thank you for registering |
| Type | **Automated** trade-account registration confirmation |
| Thread id | `1a01c0f0d37c251a` |

Body, in substance: confirms the account is registered, links to order history, carries an order
line (0800 061 4487) and a marketing block. Nothing product-specific, nothing negotiated, no person
named.

## What this means for the record

The 138-product catalogue and the Tier 1 pricing used throughout `04_products/STATE.md` came from
**self-serve access to the logged-in trade account**, not from a conversation. That distinction
matters:

- There is **no quote**. Catalogue pricing is list pricing at a tier, not a negotiated position, and
  it carries no volume commitment either way.
- There is **no MOQ confirmation** beyond what the site publishes.
- The question "do Nutribl blend at all" — recorded in `04_products/STATE.md` as *question one on
  the call* — has never been put to anyone. It is now moot for the Daily Stack, which is dead, but
  it was never answered.
- ~~The **Joint & Recovery container problem**~~ — **superseded, see the catalogue analysis below.
  There is no container problem.** Nutribl ID 1129 is a 1000 ml HDPE jar holding 300 g of collagen
  powder, in stock. The earlier 400 ml / 320 ml ceiling was read off the wrong subset of the range.

## The correction this file exists to prevent

`04_products/STATE.md` and `10_launch-ops/STATE.md` both carried "Nutribl still never contacted".
On 2026-08-22 that was corrected to "Nutribl HAVE been contacted" on the strength of recollection,
then **re-corrected the same day against this mailbox evidence**. Registering for an account and
contacting a supplier are different events, and they happened seventeen minutes apart on the same
evening, which is almost certainly the source of the conflation: the Synergy and Vita enquiries went
out at 21:48 and this registration landed at 22:05.

## Position as at 2026-08-22 (Keith)

**Nutribl are the singular lead.** Across every catalogue reviewed, their pricing is the most reasonable, and the separate-bottles economics in `04_products/STATE.md` are built on their numbers. The three manufacturers who were actually emailed are ruled out on product fit: their ranges do not suit our panels.

The account was created by **filling in a form on their website**, not by sending an email, which is why no outbound message exists in the mailbox. That is a real commercial relationship in the sense that matters — a live trade account with tier pricing — but it is not a conversation, and **nobody at Nutribl has been asked a question or has answered one**.

Note also what the registration email does NOT contain: there is no invitation to book a meeting, no named contact and no account manager. The only human route offered is the **order line, 0800 061 4487**. The "set up the account, then book a time" language belongs to **Vita Manufacture's reply of 2026-08-20**, which arrived the same night and says exactly that.

## VERIFIED FROM THE CATALOGUE EXPORT, 2026-08-22

Source: `nutribl_catalogue - Products.csv` (138 rows, exported 2026-08-20), analysed 2026-08-22. The account page itself (`nutribl.com/account.aspx`) is behind login and cannot be read from here — confirmed, it serves a sign-in form.

### Private label: answered, no call needed

**136 of 138 SKUs carry the lead time "Wholesale private label orders 4-5 working day lead time."** Private label is not a service to request, it is what Nutribl are. The export also publishes, per SKU: **Label size**, **Label artwork spec** (universally "requires 2 mm bleed on each side" plus exact submission dimensions), and a **Label text file** (`PL-xxx.docx`) carrying the mandatory label copy. 105 SKUs give an artwork spec, 136 give a label text file.

### The three bottles, verified in stock

| Product | ID | Trade | Serving | Per month |
|---|---|---|---|---|
| Vitamin D3 4000iu **365 Tablets** — 150ml Flat Postal | 1152 | £3.00 | 1/day | **£0.25** |
| Zinc 15mg 120 Capsules — 150ml Flat Postal | — | £2.72 | 1/day | **£0.68** |
| Vitamin B12 Methylcobalamin 1mg 120 Capsules — 150ml Flat Postal | — | £3.95 | 1/day | **£0.99** |

All three in stock, size 1 HPMC capsules or 8 mm tablets, 150 ml Flat Postal packs (107 x 79 x 22 mm), label 76 x 60 mm, artwork submitted at 80 x 64 mm. **£1.92/month combined COGS, which confirms the figure in `04_products/STATE.md` exactly.** The D3 SKU is precisely the "4,000 IU · 365 tabs" product already drawn in the results-page mockups.

### Collagen: the container problem does not exist

**Nutribl ID 1129, `Collagen Powder 300g Plus Essential Vitamins — Unflavoured — 1000ml Cylinder Jar`.** A Pont 1000 ml HDPE jar, 104 x 141.7 mm, white CT closure with inner seal, label 200 x 100 mm, in stock, trade £15.42. One scoop is 10.35 g, so 300 g is ~29 servings against our 30-serving spec.

That directly contradicts the 2026-08-20 finding that Joint & Recovery fits no Nutribl container. It does. What differs is the **formulation**: their stock 300 g product is collagen plus B-vitamins and vitamin C, not hydrolysed Type I & III + UC-II + MSM + hyaluronic acid. So the collagen question was never about packaging, and the bespoke-vs-sachets-vs-smaller-serving trilemma was solving the wrong problem.

### What is actually left to ask

1. **MOQ.** Not in the export at all.
2. **Print, setup or plate charge**, as distinct from the per-unit trade price.
3. **A better trade tier at volume.** Worth raising because **the current tier is barely a discount**: trade price differs from list on only **4 of 138 SKUs**, and the observed discounts are 0.0%, 0.9%, 4.5%, 5.7% and 15.1%. "Tier 1" is close to list pricing.
4. **Collagen only:** will they run a bespoke blend into the existing 1000 ml jar, and at what MOQ.

Questions 1 to 3 apply to a launch that is otherwise fully specified. Question 4 is a separate track and does not block the three bottles.

**Next action: ring 0800 061 4487.** There is no email thread to reply to and no booking link to use.

---

## THE PDF CATALOGUE ANSWERS THE SETUP AND PRINT COST, 2026-08-22

Source: `Catalogue.pdf`, 96 pages, supplied by Keith 2026-08-22 and downloaded fresh from the trade account. **It indexes 164 entries against the CSV export's 138 rows.** The difference is exactly **26 service SKUs**, which the CSV omitted. That is why MOQ and print cost looked unanswerable from the export: they were never missing from Nutribl, only from the spreadsheet.

### Private-label setup, three tiers, all published

| Tier | What it is | New template | Per extra product | 5 products | 10 | 20 |
|---|---|---|---|---|---|---|
| **CORE** | Their pre-designed template, your logo and brand colours | £50 (SER104) | £15 (SER104d) | £100 (SER104a) | £165 (SER104c) | £300 (SER104b) |
| **CLASSIC** | Custom template designed to your spec, reusable across the range | £80 (SER102) | £20 (SER102f) | £145 (SER102b) | £235 (SER102c) | £415 (SER102d) |
| **PREMIUM** | As CLASSIC, plus per-product customisation across the range | £130 (SER103) | £30 (SER103e) | £225 (SER103b) | £365 (SER103c) | £635 (SER103d) |

**Cost to put our three bottles on the shelf: £80 CORE, £140 CLASSIC, £220 PREMIUM, one-off.** Against a £1.92/month COGS, setup is not a barrier at any tier.

**CLASSIC Starter Bundle is the buy.** Five product slots for £145 against £140 for three built individually. Five pounds for two spare slots, and the range is explicitly planned to grow with the panels (Keith, 2026-08-22).

### Ancillary services

- **Logo design £99** (SER107). Not needed, we have an identity.
- **Design alterations £5 / £10 / £20** (SER111 / SER118 / SER119, basic / moderate / advanced). Iteration is cheap.
- **3D rendered product image packs £20** (SER101). **This retires the CSS pack shots in the results-page mockups** — real renders for the site at £20.
- 🔴 **Vector source files £109** (SER116). *"If you want the vector files for any artwork we design there is an extra charge for this."* **If Nutribl design the label, we do not own the artwork unless we pay.** Price that in at the start, or supply our own artwork to their published spec and skip the design fee entirely.

### The remaining question is now sharper and smaller

Not "will they print our branding" and not "what does setup cost". Both are answered. It is:

1. **MOQ.** The only figure absent from both the CSV and the PDF.
2. **Can we supply finished artwork instead of buying a design tier?** The catalogue publishes a full artwork spec per SKU (label size, 2 mm bleed, exact submission dimensions), which implies yes, but every setup SKU is worded as *Nutribl designing for us*. If we can submit our own print-ready file, setup drops toward zero and the SER116 lock-in disappears.

### Label facts that affect Ewa and the product decision

- 🔴 **The D3 4,000 IU 365-tablet SKU carries its own caution:** *"As this is a high strength product it is recommended for use under guidance of your health professional, or pharmacist."* That is the manufacturer's own wording on the product we intend to sell to every customer. **It strengthens the case for the D3-above-ceiling carve-out rather than weakening it**, and it is label copy we would have to carry.
- **The three bottles are not uniformly vegan.** D3 4,000 IU 365 tablets is *"suitable for vegetarians but not vegans"*. B12 methylcobalamin and Zinc are both Vegan Society registered. The only vegan D3 in the range is **1,000 IU** (PL-327, 180 vegan algae-derived tablets, £3.70). So the choice is 4,000 IU non-vegan or 1,000 IU vegan; we cannot have both.
- **Zinc carries a soy allergen declaration:** bulking agent is brown rice flour, and *"Brown Rice is grown in the same field as Soybean."* Must appear on our label.
- Zinc is **citrate** (PL-485, £2.72), confirming the spec gap against 25 mg gluconate. Its catalogue entry carries the full authorised claim list including *"the maintenance of normal testosterone levels in the blood"*.
- Several SKUs note: *"Registered with the Vegan Society under our brand. Please speak to us about applying to use this trademark on own label products."* A certification path exists and is a conversation, not a purchase.

### Collagen: closer to spec than the earlier read said

Against our Joint & Recovery spec, **PL-489 (300 g unflavoured, 1000 ml jar, £15.42)** delivers three of five actives at or above spec and misses two:

| Spec | Nutribl PL-489 | |
|---|---|---|
| Hydrolysed collagen 10 g (bovine, Type I & III) | Hydrolysed **marine** collagen 10 g (93% protein) | dose met, source differs |
| Vitamin C 80 mg | 180 mg | exceeds |
| Hyaluronic acid 5 mg | 25 mg | exceeds |
| UC-II 40 mg | absent | **missing** |
| MSM 500 mg | absent | **missing** |

Plus a B-vitamin complex we did not ask for. Marine collagen also makes it unsuitable for vegetarians, where bovine would have been too.

**And they demonstrably CAN blend what is missing.** Their own **Pet Joint Support Powder 150 g (PL-450, £6.90)** contains glucosamine, hydrolysed collagen peptides, green-lipped mussel, **MSM 125 mg**, turmeric, **hyaluronic acid** and manganese, in a powder. The capability is in the building; it is currently pointed at dogs. That makes "will you blend this for humans" a much more answerable question than the earlier bespoke-or-nothing framing.

### Panel-aligned SKUs already in the range, for the shop organised by panel

- **Testosterone:** Zinc 15 mg (PL-485, £2.72) · Maca Root 5000 mg **with zinc, carrying the testosterone claim** (PL-385, £5.42) · Saw Palmetto (PL-149, £4.18) · Plant Sterols Prostate Support for men (PL-368, £6.44)
- **Energy and recovery:** B12 methylcobalamin (PL-456, £3.95) · Vitamin B Complex (PL-433, £4.78) · CoQ10 100 mg (PL-293, £6.89) · magnesium range
- **Heart and omega:** **Vegan Omega 3 Algal Oil, DHA 400 mg + EPA 200 mg (PL-493, £9.73)** and fish oil (PL-167, £5.40). This is the Omega-3 Index loop product named as the lead loop in `supplements/biomarker-supplement-loops.md`, and it exists in vegan algal form.
- **Liver:** Liver Support Choline Complex (PL-426, £4.57), carrying *"choline contributes to the maintenance of normal liver function"* — an authorised claim, consistent with the 2026-08-20 correction of the liver no-claim assumption.
- **Bone:** Vitamin K2 MK-7 (PL-409, £4.32) · D3 3,000 IU + K2 (PL-476, £3.64)
