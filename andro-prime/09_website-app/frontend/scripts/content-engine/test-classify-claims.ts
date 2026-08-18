/**
 * Guards classify-claims: the tokenising, the walk direction, and the four ways a claim ladder can
 * lie.
 *
 * WHY THIS EXISTS. The verdicts this tool writes are a database gate: an open tier 2 or tier 3 stops
 * a rendition scheduling. So its failure directions are asymmetric and both are expensive.
 *
 * Inventing an inheritance records a check that never happened, and records it in the table an ASA
 * complaint would be answered from. That has already happened once, in this file's own subject: the
 * first version of the classifier walked from the 40 signed claims towards the copy and reported a
 * four-line X post about vitamin D thresholds as carrying the osteomalacia claim and the 4,000 IU
 * toxicity ceiling, neither of which appears in it. The regression at the bottom of the tokenising
 * section is that exact post and that exact pair.
 *
 * Missing one is the other half: a net-new figure that auto-passes is a claim shipped with nobody's
 * signature behind it. So the tests assert not only what is found but what is REFUSED a pass — in
 * particular that copy the tool cannot reach produces no verdicts AND does not read as clean.
 *
 * No network, no database, no credentials. Every entry point takes its inputs as arguments.
 *
 * Run: npx tsx scripts/content-engine/test-classify-claims.ts
 */
import {
  normalise, sentences, numTokens, sameFigure, authoritiesIn, hedgesIn, fingerprint,
  assertionsIn, trace, tierFor, netNewReason, surfaceIsCramped, dedupeUnaccounted, classify,
  type ClaimIn, type SurfaceIn,
} from './classify-claims'

let failures = 0
function check(name: string, fn: () => void) {
  try { fn(); console.log(`  ✓ ${name}`) }
  catch (e) { failures += 1; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`) }
}
function assert(cond: unknown, msg: string) { if (!cond) throw new Error(msg) }

/** The four vitamin D threshold claims as they are actually signed in set v1, verbatim. */
const CLAIMS: ClaimIn[] = [
  { id: 'c1', position: 1, claim: 'NICE defines a 25(OH)D level under 25 nmol/L as vitamin D deficiency in adults.', source_name: 'NICE CKS, Vitamin D deficiency in adults' },
  { id: 'c2', position: 2, claim: 'NICE defines 25 to 50 nmol/L as vitamin D insufficiency.', source_name: 'NICE CKS, Vitamin D deficiency in adults' },
  { id: 'c4', position: 4, claim: 'The Endocrine Society 2011 clinical practice guideline recommends serum 25(OH)D between 75 and 125 nmol/L for adults broadly.', source_name: 'Holick et al., 2011, JCEM 96(7): 1911-1930' },
  { id: 'c8', position: 8, claim: 'Prolonged vitamin D deficiency below 25 nmol/L can soften bone in adults, which is osteomalacia.', source_name: 'NICE CKS, Vitamin D deficiency in adults' },
  { id: 'c9', position: 9, claim: 'Above 125 nmol/L is toxicity-watch territory, and doses above 4,000 IU a day without monitoring carry a calcium-handling risk.', source_name: 'Holick et al., 2011, JCEM 96(7): 1911-1930' },
]

/** The live X post, as it sits in content_renditions.body. 280-character surface. */
const X_POST: SurfaceIn = {
  label: 'x/text-post',
  maxChars: 280,
  body: [
    'UK Vitamin D thresholds, in the units your lab actually prints.',
    '',
    'Under 25 nmol/L: deficient.',
    '25 to 50: insufficient.',
    '75 to 125: the band most active men want.',
    '',
    'Most UK men sit in that second band from October to March.',
  ].join('\n'),
}

console.log('\nclassify-claims\n')

// ── Normalising: one spelling per fact

check('percent and % are the same unit', () => {
  assert(normalise('70 to 90 per cent').includes('%'), 'per cent must fold to %')
  assert(normalise('70 percent').includes('%'), 'percent must fold to %')
})

check('a comma in a number does not make it a different number', () => {
  assert(normalise('4,000 IU').includes('4000'), '4,000 must fold to 4000')
})

check('a curly apostrophe is not a different word', () => {
  assert(normalise('doesn’t').includes("doesn't"), 'curly apostrophes must fold')
})

// ── Sentences

check('a COLON is not a sentence boundary', () => {
  const s = sentences('Under 25 nmol/L: deficient.')
  assert(s.length === 1, `split into ${s.length}: ${JSON.stringify(s)}`)
  assert(s[0].includes('deficient'), 'the meaning must stay with the threshold, not split off it')
})

check('a newline IS a boundary, because a carousel slide has no full stop', () => {
  const s = sentences('Ferritin is the tank, not the fuel\nIt measures the reserve you hold')
  assert(s.length === 2, `expected 2 sentences, got ${s.length}`)
})

// ── Numbers: what counts as a claim and what is an illustration

check('a bare number is an illustration, not a threshold', () => {
  const t = numTokens('A 40 sits inside normal on most reports.')
  assert(t.length === 0, `collected ${JSON.stringify(t)} from a number with no unit and no boundary`)
})

check('a number with a clinical unit is collected', () => {
  const t = numTokens('active B12 under 25 pmol/L is low')
  assert(t.length === 1 && t[0].value === '25' && t[0].unit === 'pmol/l', JSON.stringify(t))
})

check('a number behind a boundary word is collected with no unit at all', () => {
  const t = numTokens('under 30 is where UK practice flags it')
  assert(t.length === 1 && t[0].threshold === 'under', JSON.stringify(t))
})

check('BOTH ends of a bare range are collected: the first carries its boundary AFTER it', () => {
  const t = numTokens('75 to 125: the band most active men want.')
  assert(t.length === 2, `expected both ends, got ${JSON.stringify(t)}`)
  assert(t.map((x) => x.value).join(',') === '75,125', JSON.stringify(t))
})

check('a figure matches across a dropped unit but not across a wrong one', () => {
  assert(sameFigure({ value: '25', unit: null, threshold: 'under' }, { value: '25', unit: 'nmol/l', threshold: 'under' }),
    'a compressed surface prints the range without the unit and it is the same figure')
  assert(!sameFigure({ value: '25', unit: 'pmol/l', threshold: null }, { value: '25', unit: 'nmol/l', threshold: null }),
    '25 pmol/L and 25 nmol/L are different markers and must never match')
})

// ── Authorities and hedges

check('the source name counts as an authority the claim carries', () => {
  const fp = fingerprint(CLAIMS[2])
  assert(fp.authorities.includes('the Endocrine Society'), `authorities were ${JSON.stringify(fp.authorities)}`)
})

check('a hedge in the signed claim is picked up', () => {
  assert(hedgesIn('for adults broadly').includes('broadly'), 'broadly is a qualifier')
  assert(authoritiesIn('the NHS lists tiredness').includes('the NHS'), 'nhs is an authority')
})

check('an ALIAS is the same body, not a second one the copy dropped', () => {
  // "NICE CKS" in a source line and "NICE" in a post are one citation. Reading them as two made every
  // NICE-sourced claim tier 2 for want of a word no social post has ever contained.
  assert(JSON.stringify(authoritiesIn('NICE CKS, Vitamin D deficiency')) === JSON.stringify(['NICE']),
    `NICE CKS resolved to ${JSON.stringify(authoritiesIn('NICE CKS, Vitamin D deficiency'))}`)
  assert(authoritiesIn('NICE NG239').length === 1, 'a NICE guideline number is NICE')
  assert(authoritiesIn('Gloucestershire Hospitals NHS FT').join() === 'the NHS', 'a trust lab is the NHS')
  assert(authoritiesIn('the BHF puts it at 1 in 250').join() === 'the British Heart Foundation', 'BHF resolves')
})

// ── The walk: assertions, not claims

check('a line with no figure and no attribution is not an assertion this tool reads', () => {
  const a = assertionsIn({ label: 's', maxChars: null, body: 'Ferritin is the tank, not the fuel.' })
  assert(a.length === 0, `read ${JSON.stringify(a.map((x) => x.quote))} as checkable`)
})

check('an assertion traces to the claim sharing the most figures, ties on position', () => {
  const fps = new Map(CLAIMS.map((c) => [c.id, fingerprint(c)]))
  const a = assertionsIn(X_POST)
  const range = a.find((x) => x.quote.startsWith('75 to 125'))!
  const cov = trace(range, CLAIMS, fps)
  assert(cov.source?.id === 'c4', `75-125 traced to ${cov.source?.id}, not the Endocrine Society range`)
  const deficient = a.find((x) => x.quote.startsWith('under 25'))!
  // c1 and c8 both carry 25 nmol/L. The tie breaks on position, which is arbitrary but STABLE, so a
  // re-run cannot silently re-attribute a verdict a human has already read.
  assert(trace(deficient, CLAIMS, fps).source?.id === 'c1', 'a tie must break on the earliest position')
})

check('REGRESSION: a thresholds post does NOT inherit osteomalacia or the 4,000 IU ceiling', () => {
  // The defect the walk direction was changed to fix. Both claims share a figure with this post and
  // share none of its subject; the first design reported both as carried.
  const got = classify(CLAIMS, [X_POST]).verdicts.map((v) => v.position).filter((p) => p !== null)
  assert(!got.includes(8), `claim 8 (osteomalacia) was reported as carried: ${JSON.stringify(got)}`)
  assert(!got.includes(9), `claim 9 (4,000 IU toxicity) was reported as carried: ${JSON.stringify(got)}`)
  assert(got.includes(1) && got.includes(2) && got.includes(4),
    `the three thresholds the post DOES state must still be found, got ${JSON.stringify(got)}`)
})

// ── The ladder

check('a dropped attribution is tier 2, and the reason names the body that was dropped', () => {
  const fps = new Map(CLAIMS.map((c) => [c.id, fingerprint(c)]))
  const a = assertionsIn(X_POST).find((x) => x.quote.startsWith('under 25'))!
  const { tier, reason } = tierFor(CLAIMS[0], X_POST, a, fps.get('c1')!)
  assert(tier === 2, `expected tier 2, got ${tier}`)
  assert(/NICE/.test(reason), `the reason must name the dropped authority: ${reason}`)
})

check('a 280-character surface is named as the RULED reason, not as an authoring choice', () => {
  assert(surfaceIsCramped(X_POST), '280 chars is the cramped case')
  assert(!surfaceIsCramped({ label: 'l', maxChars: 3000, body: '' }), 'a long-form surface is not')
  const fps = new Map(CLAIMS.map((c) => [c.id, fingerprint(c)]))
  const a = assertionsIn(X_POST).find((x) => x.quote.startsWith('under 25'))!
  assert(/cannot carry the qualifier/.test(tierFor(CLAIMS[0], X_POST, a, fps.get('c1')!).reason),
    'tier 2 on a capped surface must cite the half of the ruling it falls under')
})

check('attribution ANYWHERE on the surface is enough: tier 1 does not need it in the same line', () => {
  const surface: SurfaceIn = {
    label: 'linkedin/text-post', maxChars: 3000,
    body: 'NICE is clear about the bands here.\nUnder 25 nmol/L is deficiency, in adults.',
  }
  const fps = new Map(CLAIMS.map((c) => [c.id, fingerprint(c)]))
  const a = assertionsIn(surface).find((x) => x.quote.includes('25 nmol/l'))!
  const { tier } = tierFor(CLAIMS[0], surface, a, fps.get('c1')!)
  assert(tier === 1, `a post that names NICE in its opening line has not dropped it, got tier ${tier}`)
})

check('a figure no signed claim carries is tier 3, and it has NO claim_id', () => {
  const surface: SurfaceIn = {
    label: 'x/text-post', maxChars: 280,
    body: 'Reasonable sunscreen use drops skin synthesis by around 95%.',
  }
  const v = classify(CLAIMS, [surface]).verdicts
  const t3 = v.filter((x) => x.tier === 3)
  assert(t3.length === 1, `expected one tier 3, got ${JSON.stringify(v)}`)
  assert(t3[0].claimId === null, 'a net-new claim maps to no signed claim, so it carries no claim_id')
  assert(/95/.test(t3[0].reason), `the reason must name the figure: ${t3[0].reason}`)
})

check('tier 3 says back to the ARTICLE, never to Ewa as a derivative', () => {
  const reason = netNewReason({
    uncoveredFigures: [{ value: '95', unit: '%', threshold: null }],
    uncoveredAuthorities: [], source: null, sharedFigures: 0,
  })
  assert(/back to the article/.test(reason), reason)
})

check('one line can be BOTH a covered tier 2 and an uncovered tier 3', () => {
  const surface: SurfaceIn = {
    label: 'x/text-post', maxChars: 280,
    body: 'Under 25 nmol/L is deficient, and sunscreen drops synthesis by 95%.',
  }
  const v = classify(CLAIMS, [surface]).verdicts
  assert(v.some((x) => x.tier === 3), 'the uncovered 95% must still be raised')
  assert(v.some((x) => x.tier === 2), 'the covered threshold must still be classified')
  // Closing one must not close the other, which is why they are two rows rather than one worst-case.
  assert(v.filter((x) => x.tier === 2 || x.tier === 3).length === 2, JSON.stringify(v))
})

check('the WORST surface decides a claim carried on two of them', () => {
  const long: SurfaceIn = { label: 'linkedin/text-post', maxChars: 3000, body: 'NICE defines under 25 nmol/L as deficiency in adults.' }
  const short: SurfaceIn = { label: 'x/text-post', maxChars: 280, body: 'Under 25 nmol/L: deficient.' }
  const v = classify(CLAIMS, [long, short]).verdicts.filter((x) => x.position === 1)
  assert(v.length === 1, `one verdict per claim per asset, got ${v.length}`)
  assert(v[0].tier === 2, 'stated with its attribution on LinkedIn and without it on X is a tier 2')
})

// ── The four ways it could lie

check('no shippable copy is UNCHECKED, never an empty pass', () => {
  const r = classify(CLAIMS, [{ label: 'x/text-post', maxChars: 280, body: '   ' }])
  assert(r.unchecked !== null, 'an empty body must not classify')
  assert(/NOT a clean result/.test(r.unchecked!), r.unchecked!)
  assert(r.verdicts.length === 0, 'and it must produce no verdicts')
})

check('an empty claim set is UNCHECKED, not an asset with nothing to inherit', () => {
  const r = classify([], [X_POST])
  assert(r.unchecked !== null, 'no claims means nothing was measured')
})

check('copy this tool cannot reach reports zero verdicts AND its own reach', () => {
  // The ferritin carousel: six mechanism claims, not one number. Zero verdicts is the honest answer
  // and the coverage counters are what stop it reading as a pass.
  const ferritin: SurfaceIn = {
    label: 'instagram/carousel(a)', maxChars: null,
    body: 'Ferritin is the tank, not the fuel.\nIt measures the iron you hold in reserve, and the tank empties first.',
  }
  const r = classify(CLAIMS, [ferritin])
  assert(r.unchecked === null, 'there IS copy, so this is not UNCHECKED')
  assert(r.verdicts.length === 0, 'and no figure in it, so there is nothing to classify')
  assert(r.coverage.assertionsRead === 0, 'the report must be able to say it read nothing')
  assert(r.coverage.claimsInSet === CLAIMS.length && r.coverage.claimsWithFigures > 0,
    'and must be able to say how much of the set this direction of walk can reach at all')
})

check('a set of mechanism claims reports how little of itself is reachable', () => {
  // The counter that stops "0 verdicts" reading as "0 problems": on the real set only 12 of 40 claims
  // carry a figure, so 28 of them cannot be reached from the copy side at all.
  const mechanism: ClaimIn[] = [
    { id: 'm1', position: 1, claim: 'Ferritin is the protein the body stores iron in.', source_name: 'NICE CKS' },
    { id: 'm2', position: 2, claim: 'Iron stores run down before the iron in the blood does.', source_name: 'NICE CKS' },
  ]
  const c = classify(mechanism, [{ label: 's', maxChars: null, body: 'Ferritin is the tank, not the fuel.' }]).coverage
  assert(c.claimsWithFigures === 0 && c.claimsInSet === 2,
    `a figure-free set must report itself unreachable, got ${JSON.stringify(c)}`)
})

check('a prevalence claim is surfaced as unaccounted, and never written as a verdict', () => {
  const r = classify(CLAIMS, [X_POST])
  const u = r.unaccounted.map((x) => x.quote)
  assert(u.some((q) => q.startsWith('most uk men')), `expected the prevalence line, got ${JSON.stringify(u)}`)
  assert(!r.verdicts.some((v) => v.quote.startsWith('most uk men')), 'it must not become a row')
})

check('three carousel variants of one body are ONE finding, not three', () => {
  const one = { surface: 'instagram/carousel(a)', quote: 'most men never find out', shape: 'prevalence' }
  const deduped = dedupeUnaccounted([
    one,
    { ...one, surface: 'instagram/carousel(b)' },
    { ...one, surface: 'instagram/carousel(c)' },
  ])
  assert(deduped.length === 1, `expected 1 finding, got ${deduped.length}`)
  assert(deduped[0].surface.split(',').length === 3, 'and it must still name all three surfaces')
})

check('tierFor NEVER returns tier 3: a traced claim is inherited, not net-new', () => {
  const fps = new Map(CLAIMS.map((c) => [c.id, fingerprint(c)]))
  for (const a of assertionsIn(X_POST)) {
    for (const c of CLAIMS) {
      const { tier } = tierFor(c, X_POST, a, fps.get(c.id)!)
      assert(tier === 1 || tier === 2, `tierFor returned ${tier}, which would file an inheritance as net-new`)
    }
  }
})

console.log(`\n${failures === 0 ? '✓ all checks passed' : `✗ ${failures} check(s) failed`}\n`)
process.exit(failures === 0 ? 0 : 1)
