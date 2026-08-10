# Slide-8 closes A/B/C — Instagram carousel, 30-day run

**Status:** PROPOSED 2026-08-11. Pre-flight clean; **not approved, not shipped.**
Sign-off: ClickUp [`869egg5e1`](https://app.clickup.com/t/869egg5e1) on Approvals & Sign-offs (`901219880207`). CA number assigned on approval.
Run design, metrics and rotation: `06_marketing/STATE.md`, Instagram carousel section.

Slides 1 to 7 are identical across all three closes, so the close is the only variable in the run.

---

## A. Router → `/test-selector`

> Not sure which test you'd even need?
> Three questions. About a minute.
> Link in bio.

The ratified destination for cold short-form (`07_sales/funnel/site-funnel-model.md` §2), so A is the control. Its clicks also feed the Van Westendorp block, the only planned source for the bundle-pricing read at n≈50.

## B. Direct offer → the kit page

Template, instantiated per topic from the mapping below:

> {Marker} is in the {Kit name}.
> £{price}. Finger-prick at home, results in 2 to 5 working days.
> Link in bio.

Worked instance:

> Vitamin D is in the Energy & Recovery Check.
> £119. Finger-prick at home, results in 2 to 5 working days.
> Link in bio.

Mechanics are lifted verbatim from the live landing pages (`app/lp/energy-recovery`, `app/lp/hormone-recovery`). If those pages change, this file changes with them.

## C. No ask → the article

> This is the short version.
> The full article, with every source linked.
> Link in bio.

C is a two-step A: the article's own CTA routes to the quiz. Score it on clicks that reach the quiz, not on raw article clicks.

---

## Topic-to-kit mapping for B

Kit 1 covers testosterone. Kit 2 covers vitamin D, Active B12, hs-CRP and ferritin. Fatigue and brain-fog topics therefore name Kit 2 or Kit 3.

| Topic | Kit named | Price |
| --- | --- | --- |
| `14-signs-of-vitamin-d-deficiency` | Energy & Recovery Check | £119 |
| `b12-blood-test` | Energy & Recovery Check | £119 |
| `ferritin-blood-test` | Energy & Recovery Check | £119 |
| `crp-blood-test` | Energy & Recovery Check | £119 |
| `why-am-i-always-tired` | Energy & Recovery Check | £119 |
| `brain-fog` | Energy & Recovery Check | £119 |
| `free-androgen-index` | Testosterone Health Check | £99 |
| `how-to-increase-testosterone-naturally` | Testosterone Health Check | £99 |
| `myth-of-normal-range` | Testosterone Health Check | £99 |
| `andropause-male-menopause` | Hormone & Recovery Check | £179 |

**Two topics dropped to reach 10**, for marker redundancy rather than for any compliance reason: `low-vitamin-d-symptoms` (same marker as `14-signs-of-vitamin-d-deficiency`) and `inflammatory-markers-blood-test` (same marker as `crp-blood-test`).

**`andropause-male-menopause` is the only topic carrying the CA-028 per-asset gate**, under which each Pillar E derivative needs its own pre-flight plus Ewa's own sight. Keeping it costs three Ewa touches across the run; the other nine cost none.

**`free-androgen-index` body copy** must inherit the article's corrected framing (calculated free testosterone as the reported figure, FAI report-only in men, per the 2026-07-30 ruling). Do not source that topic's slides from `04_products/kits/kit-1-testosterone-health-check.md:72`, which is on record as contradicting `thresholds.md` on exactly this point.

---

## What the copy does

Framed as measurement and price. No ingredient is named and no benefit is asserted, so no EFSA claim is engaged. No result is depicted and no outcome is stated. Every kit named is purchasable now at the price stated (canonical £99 / £119 / £179). Nothing addresses clinical services, and no availability claim is made beyond what the kit pages already carry.

**This approval covers three close templates and one mapping, not 30 posts.** Each post is a separate compression of an article into fragments and needs its own pass.
