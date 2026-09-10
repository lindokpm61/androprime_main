import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * THE LEGAL DOCUMENT TRANSFORM, added 2026-09-09 with the Direction F rebuild of
 * `/privacy` and `/terms`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THIS FILE MAY CHANGE HOW THE POLICY LOOKS. IT MAY NOT CHANGE WHAT IT SAYS.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * WHAT THE TWO ROUTES ACTUALLY ARE. `/privacy` and `/terms` are 28-line shells
 * that read a canonical HTML file off disk and inject it with
 * `dangerouslySetInnerHTML`. The documents are 793 and 750 lines of V2.0
 * brutalist markup: `border-b-4 border-black`, `font-sans font-black uppercase
 * tracking-tighter`, `glass-panel`, ink boxes and stroked SVG icons. So "rebuild
 * these two pages in Direction F" is not a 28-line job; it is 1,543 lines of
 * markup whose TEXT is compliance-locked and whose CONTAINERS are the last
 * V2.0 surface on the marketing site.
 *
 * 🔴 WHY A TRANSFORM AND NOT A REWRITE. Retyping a privacy policy and a set of
 * terms into JSX is the obvious approach and it is the wrong one: it puts a
 * human transcription step between an approved legal document and what a
 * customer reads, and nothing downstream would catch a dropped clause, a changed
 * number or a softened obligation. This transform touches ATTRIBUTES ONLY and
 * never text nodes, which turns "did the words change?" from a matter of care
 * into a matter of arithmetic. `scripts/verify-legal-text.js` extracts every text
 * node from the canonical file and from the transform's output and asserts they
 * are identical, and it runs in `npm test`.
 *
 * ⚠ 288 DISTINCT CLASS STRINGS ACROSS THE TWO FILES, so a class-to-class mapping
 * table was never viable. The rules below are four, they are ordered, and each
 * one is a shape rather than a literal.
 *
 * 🔴 THE DOCUMENT LOSES ITS INK PANELS AND ITS ICONS, DELIBERATELY. The V2.0
 * privacy policy contains several full-width ink blocks and eighteen stroked
 * SVGs. Direction F allows one inverted panel per page and reserves it for a
 * conformity statement, and it has no icon vocabulary at all: the single arrow in
 * the system is ruled to be a typographic glyph, *"never a drawn SVG"*. More to
 * the point, the containment ruling of 2026-09-02 says a card holds a
 * transaction or an instrument and prose gets neither, and a privacy policy is
 * 793 lines of prose. It reads as a document now, which is what it is.
 *
 * ⚠ THE HEADINGS KEEP THEIR LEVELS AND THEIR ORDER. Nothing is promoted,
 * demoted, merged or reordered, so the document's outline, its anchor targets and
 * its screen-reader navigation are the same document they were.
 */

/** Which canonical document to load. Both live under `canonical-site/<doc>/`. */
export type LegalDocId = 'privacy' | 'terms'

/**
 * The extraction window. Both files are a full standalone page: `<nav>`, a hero,
 * `<main>`, `<footer>`, plus `<script>` at the end. The app supplies its own nav
 * and footer, so only the hero and `<main>` are wanted.
 *
 * ⚠ THE TWO FILES OPEN THEIR HERO DIFFERENTLY and the previous code carried a
 * different regex in each route file to cope: `/privacy` matched `<header ...
 * </main>` and `/terms` matched `<!-- Hero --> ... <!-- Footer -->`. Two
 * behaviours for one job, in two files, is how they drift; the terms regex also
 * swept up the closing `</main>` AND everything between it and the footer
 * comment. One window, tried in order, for both.
 */
const HERO_ANCHORS = [/<header[\s>]/i, /<!--\s*Hero\s*-->/i, /<main[\s>]/i]
const END_ANCHOR = /<\/main\s*>/i

/**
 * A fixed-size box: `w-8 h-8`, `w-12 h-12`, `w-2 h-2`. In the source these are
 * the badge discs (a step number, the ICO mark) and the small square bullets. The
 * ones with text keep it as a chip; the empty ones are pure decoration and go.
 */
const FIXED_BOX = /\bw-\d+(?:\.\d+)?\s+h-\d+(?:\.\d+)?\b/

/** The V2.0 mono eyebrow. A real semantic class, and `.f-blab` is its F twin. */
const DATA_LABEL = /\bdata-label\b/

function extractRegion(html: string, doc: LegalDocId): string {
  let start = -1
  for (const anchor of HERO_ANCHORS) {
    const m = anchor.exec(html)
    if (m) { start = m.index; break }
  }
  const endMatch = END_ANCHOR.exec(html)
  if (start === -1 || !endMatch) {
    throw new Error(
      `canonical ${doc}: could not find the hero/main window. The canonical file ` +
      `has changed shape; fix this anchor rather than letting the route fall back ` +
      `to a stub, because the fallback is a page with no policy on it.`,
    )
  }
  return html.slice(start, endMatch.index + endMatch[0].length)
}

/**
 * ATTRIBUTES ONLY. Every rule below rewrites or removes an attribute or an
 * entire decorative element; not one of them touches a text node, which is the
 * property `verify-legal-text.js` asserts.
 */
function transform(region: string): string {
  let out = region

  // 0. Defensive: no script may cross into the app from a file on disk, even
  //    though the extraction window sits above the ones these files carry.
  out = out.replace(/<script[\s\S]*?<\/script\s*>/gi, '')

  // 1. The visual-editor ids. Meaningless here and noisy in the DOM.
  out = out.replace(/\s+vid="[^"]*"/g, '')

  // 2. Every SVG. Direction F has no icon vocabulary; see the header.
  out = out.replace(/<svg[\s\S]*?<\/svg\s*>/gi, '')

  // 3. Class rewriting, in order. Anything not matched loses its class entirely
  //    and is styled by `.f-doc`'s element rules instead.
  out = out.replace(/<(\w+)((?:\s+[^\s=>]+(?:="[^"]*")?)*)\s*(\/?)>/g, (tag, name, attrs, selfClose) => {
    const classMatch = /\sclass="([^"]*)"/.exec(attrs)
    let rest = attrs.replace(/\sclass="[^"]*"/g, '')
    if (!classMatch) return `<${name}${rest}${selfClose}>`

    const cls = classMatch[1]
    let mapped: string | null = null
    if (DATA_LABEL.test(cls)) mapped = 'f-blab'
    else if (FIXED_BOX.test(cls)) mapped = 'f-kchip'

    // `style` on a decorative element goes with its class.
    rest = rest.replace(/\sstyle="[^"]*"/g, '')
    return mapped ? `<${name} class="${mapped}"${rest}${selfClose}>` : `<${name}${rest}${selfClose}>`
  })

  // 4. The empty fixed-size boxes are now `<span class="f-kchip"></span>` with
  //    nothing in them: the square bullets and dividers. An empty chip renders as
  //    a stray 2px pill, so they go. Runs after step 3 so the match is on the
  //    mapped class rather than on eight different Tailwind spellings.
  out = out.replace(/<(span|div|i)\s+class="f-kchip"\s*>\s*<\/\1\s*>/g, '')

  return out
}

/**
 * Reads a canonical legal document and returns it as Direction F markup.
 *
 * 🔴 IT THROWS RATHER THAN FALLING BACK. The route files used to catch nothing
 * and return a stub reading *"The canonical privacy content could not be
 * loaded."* under a real `<h1>Privacy Policy</h1>`. That is a page that looks
 * like a privacy policy and contains none, served with a 200, and the only
 * signal is one sentence a reader would have to notice. A missing privacy policy
 * is a compliance failure, so it fails the build or the request loudly instead.
 */
export async function getLegalDocument(doc: LegalDocId): Promise<string> {
  const file = path.join(process.cwd(), 'canonical-site', doc, 'index.html')
  const html = await readFile(file, 'utf8')
  return transform(extractRegion(html, doc))
}

/** Exported for `scripts/verify-legal-text.js`, which runs the same code path. */
export const __internal = { extractRegion, transform }
