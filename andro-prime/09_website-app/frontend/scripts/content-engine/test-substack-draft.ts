/**
 * Guards the MDX -> Substack body converter used by `--full` (a verbatim republish).
 *
 * WHY THIS EXISTS. A republish is claim-clean ONLY because it reproduces a signed article
 * exactly and adds nothing. That makes the converter, not the drafter, the thing deciding what
 * reaches a public account, and it can break the guarantee in two directions.
 *
 * Adding is the obvious one. Dropping is the one that actually bit: the article's GP
 * safety-netting panel and its clinical attribution both live inside MDX components, so a naive
 * tag-strip produces an issue that reproduces the symptom copy, loses "see your GP that week if",
 * and turns a GMC-registered GP's quoted judgement into an unattributed paragraph in a
 * first-person founder newsletter. A derivative may not exceed its source. It may not fall short
 * of it on safety either, and that failure looks like clean output.
 *
 * No network, no database. Every case is a string in, nodes out.
 *
 * Run: npx tsx scripts/content-engine/test-substack-draft.ts
 */
import { mdxToBody, inlineNodes, CARRY_COMPONENTS, DROP_COMPONENTS, isDirectInvocation } from './substack-draft'

let failures = 0
function check(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`) }
  catch (e) { failures++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`) }
}
function assert(c: unknown, m: string) { if (!c) throw new Error(m) }

type N = Record<string, unknown>
const textOf = (n: N): string =>
  n.type === 'text' ? String(n.text ?? '') : ((n.content as N[]) ?? []).map(textOf).join(' ')
const allText = (ns: N[]) => ns.map(textOf).join(' ')

console.log('\nsubstack-draft — structure')

check('headings keep their level', () => {
  const b = mdxToBody('## Two\n\n### Three\n', 'c')
  const h = b.nodes as N[]
  assert(h[0].type === 'heading' && (h[0].attrs as N).level === 2, 'first should be h2')
  assert(h[1].type === 'heading' && (h[1].attrs as N).level === 3, 'second should be h3')
})

check('a bullet list becomes real list items, not one run-on paragraph', () => {
  const b = mdxToBody('- alpha\n- beta\n- gamma\n', 'c')
  const list = (b.nodes as N[])[0]
  assert(list.type === 'bullet_list', `got ${list.type}`)
  assert((list.content as N[]).length === 3, `expected 3 items, got ${(list.content as N[]).length}`)
})

check('consecutive prose lines join into one paragraph', () => {
  const b = mdxToBody('one line\ncontinues here\n\nsecond para\n', 'c')
  assert(b.nodes.length === 2, `expected 2 paragraphs, got ${b.nodes.length}`)
})

console.log('\nsubstack-draft — links')

check('internal links are absolutised and UTM-tagged; external links are left alone', () => {
  const n = inlineNodes('see [our guide](/blog/x) and [the NHS](https://www.nhs.uk/a)', 'camp') as N[]
  const hrefs = n.flatMap((x) => ((x.marks as N[]) ?? []).map((m) => (m.attrs as N)?.href as string)).filter(Boolean)
  assert(hrefs.some((h) => h.includes('andro-prime.com/blog/x') && h.includes('utm_source=substack')), `internal link not tagged: ${hrefs.join(' | ')}`)
  assert(hrefs.some((h) => h === 'https://www.nhs.uk/a'), 'an external source link must not be rewritten')
})

check('bold and italic are flattened rather than shipped as markdown characters', () => {
  assert(!/[*`]/.test(allText(inlineNodes('**bold** and *soft* and `code`', 'c') as N[])), 'markup leaked into the text')
})

console.log('\nsubstack-draft — components, the safety-relevant half')

// THE ONE THAT MATTERS. Losing this makes the republish less safe than the signed source.
check('SystemAlert (the GP safety net) is CARRIED, with its title and footer', () => {
  const mdx = '<SystemAlert\n  title="When to see your GP, not a blog"\n  footer="We would rather you booked an appointment."\n>\n\nSee your GP that week if you cannot function.\n\n</SystemAlert>\n'
  const b = mdxToBody(mdx, 'c')
  const txt = allText(b.nodes as N[])
  assert(/When to see your GP/.test(txt), 'the panel title must survive')
  assert(/See your GP that week/.test(txt), 'the panel body must survive')
  assert(/would rather you booked/.test(txt), 'the footer must survive')
  assert(b.carried.includes('SystemAlert'), 'it must be reported as carried')
})

check('ClinicalInsight keeps its attribution, so a GP quote cannot read as the founder speaking', () => {
  const mdx = '<ClinicalInsight author="Dr Ewa Lindo" role="GMC-registered GP">\n  "Brain fog is a description, not a diagnosis."\n</ClinicalInsight>\n'
  const txt = allText(mdxToBody(mdx, 'c').nodes as N[])
  assert(/not a diagnosis/.test(txt), 'the quote must survive')
  assert(/Dr Ewa Lindo/.test(txt) && /GMC-registered GP/.test(txt), 'the attribution must survive the tag strip')
})

check('the attribution carries NO em dash, which is banned in customer-facing copy', () => {
  const mdx = '<ClinicalInsight author="Dr Ewa Lindo" role="GP">\n  "A quote."\n</ClinicalInsight>\n'
  assert(!/[—–]/.test(allText(mdxToBody(mdx, 'c').nodes as N[])), 'an em or en dash reached the copy')
})

check('InlineKitCTA is DROPPED and REPORTED, never carried and never silently lost', () => {
  const mdx = '<InlineKitCTA pillar="B">\n\nBuy the [Energy Check](/kits/energy-recovery). Active B12 contributes to normal psychological function.\n\n</InlineKitCTA>\n'
  const b = mdxToBody(mdx, 'c')
  assert(!/Energy Check/.test(allText(b.nodes as N[])), 'the kit CTA must not reach the issue')
  assert(b.dropped.includes('InlineKitCTA'), 'a drop must be reported, or it is indistinguishable from a parser miss')
  assert(DROP_COMPONENTS.has('InlineKitCTA') && !CARRY_COMPONENTS.has('InlineKitCTA'), 'policy is data-driven')
})

check('an unknown component is dropped and reported rather than emitted as raw JSX', () => {
  const b = mdxToBody('<SomeNewThing>\n\ninner text\n\n</SomeNewThing>\n', 'c')
  assert(b.dropped.includes('SomeNewThing'), 'unknown components must be reported')
  assert(!/</.test(allText(b.nodes as N[])), 'no raw tag may reach the body')
})

check('References survive, so the sources ship with the claims', () => {
  const mdx = '<References>\n\n- NHS. Tiredness. [https://www.nhs.uk/a](https://www.nhs.uk/a)\n\n</References>\n'
  const b = mdxToBody(mdx, 'c')
  assert(/NHS. Tiredness/.test(allText(b.nodes as N[])), 'the source list must survive')
  assert(b.carried.includes('References'), 'reported as carried')
})

check('imports, exports and frontmatter fences never reach the body', () => {
  const b = mdxToBody("import X from 'y'\n\nexport const a = 1\n\nreal prose here\n", 'c')
  const txt = allText(b.nodes as N[])
  assert(!/import|export/.test(txt), `build leaked: ${txt}`)
  assert(/real prose/.test(txt), 'the prose must survive')
})

console.log('\nsubstack-draft — entry-point guard')

// Added because importing this module USED to execute the real script: main() was called
// unconditionally at module scope, and this test file was running it on every import.
check('importing the module does not run the script', () => {
  for (const p of ['/x/test-substack-draft.ts', 'test-substack-draft.ts', 'C:\\x\\test-substack-draft.js']) {
    assert(!isDirectInvocation(p), `${p} must not be treated as the entry point`)
  }
  assert(isDirectInvocation('/x/substack-draft.ts'), 'the real file should be the entry point')
  assert(!isDirectInvocation(undefined), 'undefined argv[1] must not run it')
})

console.log('')
if (failures) { console.log(`${failures} test(s) FAILED`); process.exit(1) }
console.log('All substack-draft converter tests passed.')
