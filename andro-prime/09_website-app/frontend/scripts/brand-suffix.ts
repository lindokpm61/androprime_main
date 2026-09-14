/**
 * What the root layout appends to every page title, read from the layout itself.
 *
 * Extracted on 2026-09-14 when a second reader appeared. `verify-article-seo.ts`
 * had this inline and `check-seo-drafts.ts` needed exactly the same thing — and a
 * check that MEASURES a title against a budget, while carrying its own idea of
 * what the budget includes, is how two green runs come to disagree about one
 * article. One fact, one home, now three readers (`verify-metadata.js` reads the
 * template for the same reason, on the static routes).
 *
 * It is read rather than typed because changing `app/layout.tsx` must not be a
 * silent way of changing what any of these checks measure.
 */
import fs from 'node:fs'
import path from 'node:path'

/** `app/` sits one level up from `scripts/`. */
const ROOT = path.resolve(__dirname, '..')

export function brandSuffix(): string {
  const src = fs.readFileSync(path.join(ROOT, 'app', 'layout.tsx'), 'utf8')
  const m = /template\s*:\s*(['"])([^'"]*)\1/.exec(src)
  if (!m) {
    throw new Error(
      'brand-suffix: no title.template in app/layout.tsx. Fix that file rather than this line.',
    )
  }
  return m[2].replace('%s', '')
}

/**
 * The budget a BARE `seoTitle` has, once the brand suffix is accounted for.
 *
 * The bound in `lib/blog.ts` is on the RENDERED title, which is what a search
 * result shows; the value an author types is the bare one. Every draft of a title
 * has to do that subtraction, so it is done here once rather than in each
 * author's head, where it has a reliable habit of being forgotten.
 */
export function bareTitleBudget(renderedMax: number): number {
  return renderedMax - brandSuffix().length
}
