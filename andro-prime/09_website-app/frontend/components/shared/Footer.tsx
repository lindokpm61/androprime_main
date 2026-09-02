import Link from 'next/link'
import { Logo } from './Logo'
import { CookieSettingsLink } from '@/components/analytics/CookieSettingsLink'

const diagnosticsLinks = [
  { label: 'Testosterone Health Check', href: '/kits/testosterone' },
  { label: 'Energy & Recovery Check', href: '/kits/energy-recovery' },
  { label: 'Hormone & Recovery Check', href: '/kits/hormone-recovery' },
  { label: 'Diagnostic Quiz', href: '/test-selector' },
]

const companyLinks = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

/**
 * Restyled into Direction F on 2026-08-30 from design/mockups/journey/chrome-F.html
 * Frame AE. 🔴 chrome-F.html IS NOT APPROVED; built to be judged running.
 *
 * THIS IS THE COMPLIANCE SURFACE, NOT DECORATION. One file, 25 routes. The
 * medical-disclaimer paragraph, the two accreditation chips, the eleven links
 * and the registered-company line live HERE AND NOWHERE ELSE. Per learn-F.html
 * it is also the only inbound path to /about and /faq: nothing else in app/ or
 * components/ links to either.
 *
 * Two things not to "tidy":
 *
 *   The eight Company links keep their live order rather than being regrouped.
 *   The order is what a returning reader's muscle memory is built on.
 *
 *   Cookie settings stays in the list and does NOT move to the bottom bar. It is
 *   the only control in the footer, and burying a consent reopener in small
 *   print is the pattern the ICO wording exists to prevent.
 *
 * Copy is unchanged from V2.0, deliberately: the 2026-08-28 approval covers
 * layouts, not copy, and this paragraph is compliance-bearing.
 */
export function Footer() {
  return (
    <footer className="f-footer f-page">
      <div className="f-tray">
        <div className="f-core">

          <div className="f-foot">

            {/* Brand column */}
            <div>
              <Link href="/" className="inline-flex" aria-label="Andro Prime home">
                <Logo variant="dark" className="h-8 w-auto" />
              </Link>
              {/* SELF-DESCRIPTION, NOT A DISCLAIMER, and the two do different jobs
                  in one paragraph. Sentence one says what the company IS and is
                  governed by PRODUCT.md ruling B (Keith, 2026-08-30): a men’s health
                  company, not a wellness brand. It read "wellness information
                  service" until 2026-09-02, contradicting the ruling on every page
                  the shared chrome renders.

                  ⚠ "information service" IS LOAD-BEARING AND STAYS. It is the
                  Phase-0 hedge: we provide information, not health services, which
                  is the line that cannot move before CQC. Ruling B changes the
                  adjective, not the noun. Sentences two and three do the disclaimer
                  work and are untouched.

                  The apostrophe is &rsquo; because that is the house entity (115
                  uses against 1); the lone &apos; in this paragraph was the outlier
                  and is corrected rather than matched, so one paragraph does not
                  render two different apostrophes. */}
              <p className="f-legal">
                Andro Prime is a men&rsquo;s health information service. Our kits show you
                your numbers. They don&rsquo;t diagnose conditions, replace your GP, or
                constitute medical advice. If you have a health concern, talk to a
                doctor.
              </p>
              <div className="f-chips">
                <span className="f-chip">
                  <i />
                  UKAS ISO 15189
                </span>
                <span className="f-chip">
                  <i />
                  EFSA-approved claims
                </span>
              </div>
            </div>

            {/* Diagnostics column */}
            <div>
              {/* h3, not h4: the page's last heading is an h2, so h4 skipped a level on
                  every route on the site. The visual size is set by `.f-foot h3, .f-foot h4`
                  in f-primitives.css and is unchanged. */}
              <h3>Diagnostics</h3>
              <ul>
                {diagnosticsLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company column */}
            <div>
              <h3>Company</h3>
              <ul>
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <CookieSettingsLink />
                </li>
              </ul>
            </div>

          </div>

          <div className="f-footbar">
            <span style={{ flex: '1 1 auto', maxWidth: '74ch' }}>
              &copy; 2026 Andro Prime Ltd. Registered in England &amp; Wales. Testing
              carried out by a UKAS ISO 15189 accredited laboratory. Supplement
              claims are EFSA-approved.
            </span>
            <span className="f-stat" style={{ flex: '0 0 auto' }}>
              <span>Sys.stat: online</span>
              <span>Sec: AES-256</span>
            </span>
          </div>

        </div>
      </div>
    </footer>
  )
}
