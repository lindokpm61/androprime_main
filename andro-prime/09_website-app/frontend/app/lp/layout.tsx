import { Nav } from '@/components/shared/Nav'
import { RevealGate } from '@/components/marketing/RevealGate'

/**
 * THE LANDING-PAGE SHELL, rebuilt in Direction F on 2026-09-11 alongside the
 * five pages it wraps.
 *
 * It is rebuilt rather than left alone because it was the last V2.0 surface the
 * `/lp` tree wore: a `border-t-4 border-black` rule and a line of
 * `font-black uppercase tracking-widest`, which would have framed five Direction
 * F pages in the brutalist chrome they had just stopped using. Restyling a
 * shared layer normally MOVES a seam rather than closing it, which is what the
 * `SupplementWaitlistForm` restyle did on 2026-09-09; here it closes one,
 * because all five of this layout's consumers are rebuilt in the same change and
 * there is no sixth.
 *
 * 🔴 THE `.js` GATE AND THE REVEAL OBSERVER WERE MISSING FROM THIS TREE AND THAT
 * IS A REAL DEFECT THE REBUILD SURFACED. They live in the marketing layout and
 * nothing supplied them here, so every `.f-rise` a Direction F landing page
 * carries (`FHero` and `FClose` add it with no way to opt out) would have had
 * nothing to reveal it. It fails in the SAFE direction, because every hiding rule
 * is scoped under `.js` and the class would simply never arrive, so the page
 * renders complete and at rest with no animation at all. That is precisely why it
 * would not have been noticed: the page looks finished and the motion layer is
 * silently absent. `RevealGate` is shared with the marketing layout rather than
 * copied.
 *
 * 🔴 AND THE NAV CLEARANCE WAS WRONG, WHICH IS A LIVE BUG RATHER THAN A REBUILD
 * CHOICE. `<main>` carried `pt-20` (80px), which is V2.0's flush 80px bar.
 * `components/shared/Nav.tsx` has been Direction F for weeks and renders a
 * FLOATING shell — 14px top gutter plus a 62px shell, raised at 800px — and the
 * marketing layout clears it with `pt-[92px] md:pt-[104px]`. The `/lp` tree never
 * got that change, so on the live pages the top of the content sits under the
 * floating nav. Matched to marketing here.
 *
 * ⚠ NO SITE FOOTER, AND NO SITE LINKS IN THE NAV. That is the whole point of a
 * paid landing page and it is unchanged: `Nav variant="lp"` hides the links and
 * swaps the CTA, and the footer is one compliance line rather than four columns.
 * `01_strategy/STATE.md` records the standing position that `/lp` exists for paid
 * message-match only and the canonical, indexable page is `/kits`, because an
 * off-site funnel is the playbook this brand differentiates against.
 */
export default function LpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <RevealGate />
      <Nav variant="lp" />
      {/* Clears the FLOATING F nav, matching the marketing layout exactly. See
          the nav-clearance note above: this was `pt-20` and sat under it. */}
      <main id="main-content" className="pt-[92px] md:pt-[104px]">{children}</main>

      {/* THE COMPLIANCE FOOTER. `.f-page` is on it for the reason
          `components/shared/Footer.tsx` carries the same class: `globals.css`
          sets `p { @apply font-serif }` for V2.0, and without `.f-page` this line
          renders in Merriweather at about 8% under its drawn size, silently.
          Chrome carries its own ramp; the page content gets it from `FPage`. */}
      <div className="f-page" style={{ borderTop: '1px solid var(--hair)' }}>
        <div className="f-wrap" style={{ paddingBlock: 22 }}>
          {/* The SECOND site of the same self-description, changed in the same
              pass as components/shared/Footer.tsx under PRODUCT.md ruling B
              (2026-09-02). Fixing one of two call sites for one fact is worse
              than fixing neither: a duplicated fact is invisible while the
              copies agree, and the first correction is what turns a quiet
              inconsistency into the site saying two different things about what
              the company is. These two cannot be collapsed to one source — the
              LP chrome is deliberately separate from the marketing chrome — so
              they are coupled by this comment and by nothing else. Change both. */}
          <p className="f-fine" style={{ textAlign: 'center', maxWidth: 'none' }}>
            &copy; 2026 Andro Prime Ltd. Men&rsquo;s health information service only. Not
            medical advice. Testing by a UKAS ISO 15189 accredited laboratory.
          </p>
        </div>
      </div>
    </>
  )
}
