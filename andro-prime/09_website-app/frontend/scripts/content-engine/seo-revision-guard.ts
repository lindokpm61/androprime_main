/**
 * seo-revision-guard — does this metadata revision still only move metadata?
 *
 * KEITH'S RULING, 2026-09-14 (defect register M7): "review a revision of this
 * type as it is an SEO description and tag, not a clinical observation." A
 * `<title>` tag and a meta description are metadata, so a revision that changes
 * only those two is reviewed as an SEO revision and does not go to Ewa.
 *
 * This module is the one qualification on that, and it exists because of a
 * ruling Ewa had already made. The 2026-08-18 tier ladder (Q14) says:
 *
 *   Tier 1  carried verbatim, or reworded with no proposition added  AUTO-PASS
 *   Tier 2  compressed, or on a surface that cannot carry the qualifier  -> Ewa
 *   Tier 3  net-new: asserts something no signed claim covers  -> the ARTICLE
 *
 * 🔴 A 260-CHARACTER DESCRIPTION CUT TO 160 IS THE TIER 2 SENTENCE ALMOST WORD
 * FOR WORD — "compressed, on a surface that cannot carry the qualifier". So the
 * two rulings do not conflict; they compose, and the boundary between them is
 * mechanical. A description that REWORDS approved copy adds no proposition and
 * is tier 1, which auto-passes with no Ewa — that is Keith's ruling, and it is
 * the ordinary case. A description that arrives carrying a figure, an authority
 * or a prevalence shape the article itself does not carry, or that drops the
 * qualifier holding one of those down, has stopped being metadata and is the
 * case Ewa reserved. This module tells the two apart and routes accordingly.
 *
 * ⚠ WHAT IT DOES NOT DO. It does not check that the revision is metadata-only.
 * That is a STRUCTURAL fact and it is enforced one layer down, in
 * `stage_blog_revision`, which refuses to record a scope='seo' revision whose
 * body differs from the live body by a byte or whose frontmatter differs outside
 * `seoTitle`/`seoDescription`. Re-implementing that test here would put a second
 * copy of the rule in a place a caller could skip. The database settles shape;
 * this settles meaning.
 *
 * ⚠ IT FAILS TOWARD REVIEW, ALWAYS. Every uncertain case routes to Ewa. The cost
 * of a false positive is one item on her queue that turns out fine; the cost of a
 * false negative is a claim that moved without a clinician seeing it, on a
 * surface Google shows to a man deciding whether to order a blood test.
 *
 * The vocabulary is IMPORTED from `classify-claims.ts` rather than restated:
 * units, authorities, hedges and assertion shapes are one closed set per fact,
 * and a second copy here would drift the first time a body was added there.
 */
import {
  normalise,
  numTokens,
  sameFigure,
  authoritiesIn,
  hedgesIn,
  ASSERTION_SHAPES,
  type NumToken,
} from './classify-claims'

/**
 * Hedges that do not count, ON THEIR OWN, as evidence a claim is still qualified.
 *
 * Found by feeding the guard a deliberately bad draft on 2026-09-14: *"Cortisol
 * over 550 nmol/L causes belly fat. NICE says so. Here is what to do about your
 * middle this week."* dropped every qualifier, and the dropped-qualifier test did
 * not fire — because `hedgesIn` matched the word **"about"**, used there as a
 * plain preposition. The draft was caught anyway, by the net-new figure and the
 * net-new citation, which is the guard's depth working as intended; but a
 * description that compressed a hedged claim while happening to contain "about"
 * or "around" prepositionally would have passed on the strength of a word doing
 * no work at all.
 *
 * These stay in the shared `HEDGES` list, which is right for `classify-claims.ts`
 * where a whole post is being read and an incidental match costs little. Here the
 * surface is 160 characters and a single incidental match is the difference
 * between routing to a clinician and not, so this narrows locally rather than
 * editing a vocabulary that a clinical ruling rests on. Narrowing makes the guard
 * STRICTER, which is the safe direction.
 */
const WEAK_HEDGES = new Set(['about', 'around', 'up to', 'from', 'to'])

/** Where a metadata revision goes once it has been read. */
export type SeoRoute = 'seo' | 'clinical'

export interface SeoGuardFinding {
  /** Which of the two fields raised it. */
  field: 'seoTitle' | 'seoDescription'
  /** The ladder tier this corresponds to, so the reason cites Ewa's own rule. */
  tier: 2 | 3
  reason: string
}

export interface SeoGuardVerdict {
  route: SeoRoute
  findings: SeoGuardFinding[]
  /** Printed on the review task so a human can see what was read, not just the verdict. */
  summary: string
}

/**
 * The copy a proposed SEO field is allowed to draw on: everything about this
 * article that has ALREADY been through review.
 *
 * The body is included deliberately. A description legitimately summarises a
 * point made in the seventh paragraph, and scoring it against the excerpt alone
 * would send every honest summary to Ewa — which is the failure mode that makes
 * a gate get routed around.
 */
export interface ApprovedCopy {
  title: string
  excerpt: string
  body: string
}

function approvedText(a: ApprovedCopy): string {
  return `${a.title}\n${a.excerpt}\n${a.body}`
}

/**
 * Sentences with NO length filter, for the subset test only.
 *
 * 🔴 `sentences()` in `classify-claims.ts` drops anything twelve characters or
 * shorter, which is right where it is used — a twelve-character line carries no
 * traceable assertion in a whole post. It is catastrophic in a SUBSET test,
 * because the filter applies to BOTH sides: a short net-new sentence is removed
 * from the proposal before the comparison, so `.every()` is satisfied over a list
 * the offending sentence was already deleted from. Vacuous satisfaction.
 *
 * Found by an independent review, with the boundary sitting exactly on the
 * filter. Against the real b12 description:
 *
 *   + " T is low."      (9 chars)  -> exempt, and it should not be
 *   + " You are low."   (12 chars) -> exempt, and it should not be
 *   + " Your cells cannot use total B12 at all."  (39) -> correctly not exempt
 *
 * Both of the passing ones are the `You have low testosterone` family from the
 * red-flag table: a definitive medical statement, carrying no figure, no
 * authority and no assertion shape, so tests 1 to 3 are blind to them too. The
 * deterministic scanner returned 0 HARD / 0 REVIEW on both, so this was a hole in
 * BOTH layers rather than one backstopped by the other.
 *
 * The exemption's stated rule is "every SENTENCE of the proposed text appears in
 * the excerpt". This makes the code test that rule, rather than testing "every
 * sentence longer than twelve characters".
 */
function allSentences(text: string): string[] {
  return normalise(text)
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function fmtFigure(f: NumToken): string {
  return f.unit ? `${f.value} ${f.unit}` : f.value
}

/**
 * Read one proposed field against the approved copy.
 *
 * Four tests, in the order that puts the cheapest and most decisive first. Each
 * one is a question about what the NEW text asserts that the OLD text did not —
 * never about style, length or wording, both of which are the whole point of an
 * SEO field and neither of which is anyone's clinical business.
 */
function readField(
  field: 'seoTitle' | 'seoDescription',
  proposed: string,
  approved: ApprovedCopy,
): SeoGuardFinding[] {
  const text = proposed.trim()
  if (!text) return []

  const all = approvedText(approved)
  const findings: SeoGuardFinding[] = []

  // (1) NET-NEW FIGURE. A threshold or a measured number that appears nowhere in
  // the article is tier 3: the copy asserts something the article never cleared,
  // and it goes back to the article rather than to Ewa as a derivative.
  const approvedFigures = numTokens(all)
  const newFigures = numTokens(text).filter(
    (f) => !approvedFigures.some((a) => sameFigure(f, a)),
  )
  if (newFigures.length) {
    findings.push({
      field,
      tier: 3,
      reason:
        `states ${newFigures.map(fmtFigure).join(', ')}, which appears nowhere in the article's ` +
        `approved title, excerpt or body. A figure that is new on the snippet is net-new copy, ` +
        `not a trim.`,
    })
  }

  // (2) NET-NEW AUTHORITY. Citing a body the article does not cite is the same
  // failure from the attribution side.
  const approvedAuthorities = authoritiesIn(all)
  const newAuthorities = authoritiesIn(text).filter((a) => !approvedAuthorities.includes(a))
  if (newAuthorities.length) {
    findings.push({
      field,
      tier: 3,
      reason:
        `cites ${newAuthorities.join(', ')}, which the article does not cite. An attribution the ` +
        `article has not earned cannot first appear in a search snippet.`,
    })
  }

  // (3) NET-NEW ASSERTION SHAPE. A prevalence, proportion or comparative claim
  // that the article does not make anywhere. These carry no number and no
  // authority, so tests 1 and 2 are blind to them — "most men over 40" is a
  // claim, and it is exactly the sort of line that gets written to fill 160
  // characters attractively.
  for (const shape of ASSERTION_SHAPES) {
    if (shape.re.test(text) && !shape.re.test(all)) {
      findings.push({
        field,
        tier: 3,
        reason:
          `makes a ${shape.name} claim the article does not make anywhere. It carries no figure ` +
          `and no citation, so nothing else here can see it.`,
      })
    }
  }

  // (4) THE DROPPED QUALIFIER, WHICH IS THE ONE THIS GUARD EXISTS FOR.
  //
  // This is "linked to" surviving a 100-character cut as "causes". The new text
  // restates something checkable — it carries a figure the article carries, or an
  // assertion shape the article makes — while every hedge the article put around
  // that statement has gone. Ewa's tier 2 names this precisely, and names the
  // reason: whether a squeezed line still means what she signed is the judgement
  // she reserved for herself.
  //
  // It only fires when the text asserts something. A description with no figure
  // and no assertion shape has nothing to hedge, and demanding a "may" in it
  // would send every ordinary snippet to review.
  /*
   * ⚠ A VERBATIM SUBSET OF THE EXCERPT THAT DROPS NO QUALIFIER IS NOT A
   * COMPRESSION. Without this the commonest shape in the whole commission failed.
   *
   * Test 4 below compares the fragment's hedges against hedges anywhere in the
   * approved copy — title, excerpt AND body. So a description carrying no hedge
   * looks like a compression whenever the BODY hedges anything, which a clinical
   * article always does. `b12-blood-test` hit it: the proposed description is the
   * approved excerpt with one sentence removed, the removed sentence being the
   * reviewer credential, and the restated clause is unchanged to the byte. It was
   * routed to a clinician for dropping a qualifier it never had.
   *
   * 🔴 THE FIRST VERSION OF THIS EXEMPTION WAS JUSTIFIED BY AN ARGUMENT ABOUT THE
   * WRONG TEST, AND AN INDEPENDENT REVIEW BROKE IT WITH A WORKED EXAMPLE. It said
   * a whole-sentence subset "shows a reader strictly less, so it cannot be adding
   * a proposition" — but ADDING is what tests 1 to 3 check. Test 4 checks whether
   * a qualifier was REMOVED, and deleting a whole sentence is the most complete
   * way to remove one. "Shows strictly less" is test 4's danger condition, not a
   * safety argument for skipping it. The counter-example was two sentences, the
   * second holding the hedge:
   *
   *   excerpt:  "Active B12 matters more than total B12 for how you feel.
   *              This may vary by lab and is not a diagnosis."
   *   proposed: "Active B12 matters more than total B12 for how you feel."
   *
   * Every proposed sentence was a verbatim excerpt sentence, so the exemption
   * fired and the comparative shipped unqualified with "is not a diagnosis"
   * deleted. So the exemption now carries the condition it always needed: the
   * sentences being DROPPED must themselves carry no qualifier. A credential line
   * carries none, which is why the real case still passes.
   *
   * Three narrowings, each load-bearing:
   *   · SENTENCE granularity, so lifting "under 25 is deficient" out of "levels
   *     may be low, so under 25 is deficient" is not a match;
   *   · the EXCERPT only, never the body — the body is a different surface with
   *     different surrounding context;
   *   · the DROPPED sentences must be hedge-free, per the above.
   */
  const excerptAll = allSentences(approved.excerpt)
  const excerptSet = new Set(excerptAll)
  const proposedAll = allSentences(text)

  /* Every proposed sentence is one of the excerpt's, measured WITHOUT the length
     filter — see `allSentences`. */
  const everySentenceIsApproved =
    excerptSet.size > 0 &&
    proposedAll.length > 0 &&
    proposedAll.every((s) => excerptSet.has(s))

  /* And nothing qualifying was thrown away with the sentences that went. */
  const proposedSet = new Set(proposedAll)
  const droppedSentences = excerptAll.filter((s) => !proposedSet.has(s))
  const droppedHedges = droppedSentences.flatMap((s) => hedgesIn(s)).filter((h) => !WEAK_HEDGES.has(h))

  const isVerbatimExcerptSubset = everySentenceIsApproved && droppedHedges.length === 0

  const restatesSomething =
    numTokens(text).length > 0 || ASSERTION_SHAPES.some((s) => s.re.test(text))
  if (restatesSomething && !isVerbatimExcerptSubset) {
    const approvedHedges = hedgesIn(all)
    const proposedHedges = hedgesIn(text).filter((h) => !WEAK_HEDGES.has(h))
    if (approvedHedges.length && !proposedHedges.length) {
      findings.push({
        field,
        tier: 2,
        reason:
          `restates a checkable point with no qualifier, while the article holds that ground with ` +
          `"${approvedHedges.slice(0, 4).join('", "')}". Tier 2, compressed onto a surface that ` +
          `cannot carry the qualifier (Dr Ewa Lindo, 2026-08-18, Q14).`,
      })
    }
  }

  return findings
}

/**
 * The verdict for a whole staged SEO revision.
 *
 * `route: 'seo'` means Keith's ruling applies unqualified: this is a description
 * and a tag, it adds no proposition, and it is reviewed as metadata.
 * `route: 'clinical'` means the guard found something that is no longer metadata,
 * and it says which field and why in Ewa's own vocabulary.
 */
export function guardSeoRevision(args: {
  seoTitle?: string | null
  seoDescription?: string | null
  approved: ApprovedCopy
}): SeoGuardVerdict {
  const findings = [
    ...readField('seoTitle', args.seoTitle ?? '', args.approved),
    ...readField('seoDescription', args.seoDescription ?? '', args.approved),
  ]

  if (!findings.length) {
    const checked = [
      args.seoTitle?.trim() ? 'seoTitle' : null,
      args.seoDescription?.trim() ? 'seoDescription' : null,
    ].filter(Boolean)
    return {
      route: 'seo',
      findings: [],
      summary:
        checked.length
          ? `${checked.join(' and ')} read against the article's approved copy: no net-new figure, ` +
            `no net-new citation, no net-new assertion shape, no dropped qualifier. Tier 1 — ` +
            `reworded with no proposition added, which auto-passes with no clinical review ` +
            `(Q14, 2026-08-18). Reviewed as metadata per Keith's ruling of 2026-09-14.`
          : `no SEO field is set on this revision, so there is nothing to read.`,
    }
  }

  const worst = findings.some((f) => f.tier === 3) ? 3 : 2
  return {
    route: 'clinical',
    findings,
    summary:
      `Routed to clinical review rather than SEO review: ${findings.length} finding` +
      `${findings.length > 1 ? 's' : ''}, worst tier ${worst}. Keith's 2026-09-14 ruling covers a ` +
      `description and a tag that reword approved copy; this one does more than reword.`,
  }
}
