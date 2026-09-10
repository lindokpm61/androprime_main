import type { Metadata } from 'next'
import { getLegalDocument } from '@/lib/legal/canonical'
import { FPage } from '@/components/marketing/FPage'

/**
 * /privacy, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT ONE WORD OF THE POLICY CHANGED, AND THAT IS MECHANICALLY ASSERTED.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * This route is 28 lines and always was, but the page it serves is 793 lines of
 * canonical HTML read off disk. `lib/legal/canonical.ts` does the work and its
 * header carries the reasoning; the short version is that it rewrites ATTRIBUTES
 * and never text nodes, and `scripts/verify-legal-text.js` in `npm test`
 * extracts every text node from `canonical-site/privacy/index.html` and from the
 * transform's output and fails the build if they differ by one character.
 *
 * 🔴 THE STUB FALLBACK IS GONE, AND ITS REMOVAL IS THE POINT OF THIS EDIT
 * BEYOND THE RESTYLE. This file used to end with:
 *
 *     return '<section ...><h1>Privacy Policy</h1><p>The canonical privacy
 *             content could not be loaded.</p></section>'
 *
 * A read failure or a changed anchor therefore served a 200 with a real `<h1>`
 * reading "Privacy Policy" and no policy under it, and the only signal was one
 * sentence a reader had to notice and act on. A privacy policy that silently
 * isn't there is a UK GDPR Article 13 failure wearing the costume of a working
 * page. `getLegalDocument` throws instead, which surfaces as a build failure or
 * a 500: both are loud, and loud is the correct failure mode for this document.
 *
 * ⚠ `FPage` WITH NO `FHero` AND NO `FSection`, WHICH IS WHY IT PASSES
 * `verify-f-scaffold.js`. The check's rule is that a marketing page built from a
 * hero and numbered sections must compose the scaffold; a legal document has
 * neither, and `.f-page` is the TYPE RAMP every F surface needs, which `FPage`
 * supplies. This is the same distinction `app/auth/layout.tsx` relies on.
 */

const BASE_URL = 'https://andro-prime.com'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'We collect health data. That means we take this seriously.',
  alternates: { canonical: `${BASE_URL}/privacy` },
}

export default async function PrivacyPage() {
  const document = await getLegalDocument('privacy')

  return (
    <FPage>
      <section className="f-wrap f-sec f-sec-hero">
        <div className="f-doc" dangerouslySetInnerHTML={{ __html: document }} />
      </section>
    </FPage>
  )
}
