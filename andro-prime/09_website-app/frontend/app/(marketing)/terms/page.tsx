import type { Metadata } from 'next'
import { getLegalDocument } from '@/lib/legal/canonical'
import { FPage } from '@/components/marketing/FPage'

/**
 * /terms, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT ONE WORD OF THE TERMS CHANGED, AND THAT IS MECHANICALLY ASSERTED.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Same shape as `/privacy` and the same module does the work: 750 lines of
 * canonical HTML read off disk, attributes rewritten, text nodes untouched, and
 * `scripts/verify-legal-text.js` in `npm test` asserting the text is identical
 * to `canonical-site/terms/index.html`. Reasoning in `lib/legal/canonical.ts`.
 *
 * 🔴 THE EXTRACTION WINDOW WAS DIFFERENT HERE AND IS NOT ANY MORE. This file
 * matched `/<!-- Hero -->([\s\S]*?)<!-- Footer -->/i` while `/privacy` matched
 * `/(<header[\s\S]*?<\/main>)/i`: two regexes, in two files, doing one job, on
 * two documents generated from one template. That is how a pair drifts, and this
 * pair had already drifted in a way that mattered, since the terms window ran
 * PAST `</main>` and swallowed everything between it and the footer comment. One
 * window now, tried in order, for both.
 *
 * 🔴 AND THE STUB FALLBACK IS GONE. It served a 200 carrying an `<h1>Terms and
 * Conditions</h1>` over the sentence "The canonical terms content could not be
 * loaded." Terms a customer is told they agreed to, which are not on the page
 * they were pointed at, is a consumer-law problem before it is a bug. It throws
 * now.
 */

const BASE_URL = 'https://andro-prime.com'

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: "What you're agreeing to when you buy from us. Written clearly.",
  alternates: { canonical: `${BASE_URL}/terms` },
}

export default async function TermsPage() {
  const document = await getLegalDocument('terms')

  return (
    <FPage>
      <section className="f-wrap f-sec f-sec-hero">
        <div className="f-doc" dangerouslySetInnerHTML={{ __html: document }} />
      </section>
    </FPage>
  )
}
