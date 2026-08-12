# Slide-8 closes A/B/C — Instagram carousel, 30-day run

**Status: APPROVED 2026-08-11 (Keith) as CA-031.** Copy approval only; nothing has shipped.
Sign-off: ClickUp [`869egg5e1`](https://app.clickup.com/t/869egg5e1) on Approvals & Sign-offs (`901219880207`), with his ruling recorded per decision in the comment replies. Record: `03_compliance/content-approval/approval-record-carousel-closes-2026-08-11.md`.
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

**C is a delayed kit offer, not a no-ask arm** (Keith, 2026-08-12, ruling K2 on CA-034). The slide makes
no ask, but the article it lands on ends on a kit CTA, so the offer arrives one page later.

**The previous description was wrong and the run was built on it.** It read: *"C is a two-step A: the
article's own CTA routes to the quiz. Score it on clicks that reach the quiz, not on raw article
clicks."* No article routed to the quiz. Eight ended on a kit CTA, and `free-androgen-index` and
`how-to-read-blood-test-results` had no kit CTA component at all, so C was a delayed kit offer on eight,
something else on two, and the described no-ask control on none. **The stated scoring rule was also
unexecutable**, because the quiz click it scored on did not exist on that path.

**Fixed 2026-08-12, so all ten now behave alike:** `free-androgen-index` had its closing paragraph
wrapped in `InlineKitCTA` (its destination, Kit 1, was already right), and
`how-to-read-blood-test-results` had its closing selector ask replaced with a Kit 3 `InlineKitCTA`,
with the selector link moved up into the "Which test should you take?" section so that route survives.
Both live rows updated with an audit revision; 10 of 10 now carry the component.

**What the run therefore tests: the same offer at three distances.** A is the quiz now, B is the kit
now, C is the kit one page later. All three arms end at something we sell, which is a coherent
experiment and a more useful one than the arm-with-no-ask the record used to claim.

**Score C on outbound clicks to the article**, and read it against B for the cost of the extra step.
Do not score it on quiz clicks.

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
| `how-to-read-blood-test-results` | Hormone & Recovery Check | £179 |

**Two topics dropped to reach 10**, for marker redundancy rather than for any compliance reason: `low-vitamin-d-symptoms` (same marker as `14-signs-of-vitamin-d-deficiency`) and `inflammatory-markers-blood-test` (same marker as `crp-blood-test`).

**`andropause-male-menopause` was swapped out** (Keith, 2026-08-11) for `how-to-read-blood-test-results`. It was the only topic carrying the CA-028 per-asset gate, under which each Pillar E derivative needs its own pre-flight plus Ewa's own sight, so it cost three Ewa sightings on a run whose premise is cheap iteration. The replacement carries no per-asset gate, maps honestly to the nine-marker kit, and preserves the single Kit 3 row that andropause was the only source of. **No new copy string was introduced**: close B's Kit 3 line is unchanged and was already in the scanned payload, so the pre-flight result carries.

**`free-androgen-index` body copy** must inherit the article's corrected framing (calculated free testosterone as the reported figure, FAI report-only in men, per the 2026-07-30 ruling). Do not source that topic's slides from `04_products/kits/kit-1-testosterone-health-check.md:72`, which is on record as contradicting `thresholds.md` on exactly this point.

---

## What the copy does

Framed as measurement and price. No ingredient is named and no benefit is asserted, so no EFSA claim is engaged. No result is depicted and no outcome is stated. Every kit named is purchasable now at the price stated (canonical £99 / £119 / £179). Nothing addresses clinical services, and no availability claim is made beyond what the kit pages already carry.

**This approval covers three close templates and one mapping, not 30 posts.** Each post is a separate compression of an article into fragments and needs its own pass.
