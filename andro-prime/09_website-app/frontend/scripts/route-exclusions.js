#!/usr/bin/env node
/**
 * The routes route-conformance deliberately does not count, and the EVIDENCE
 * that each exclusion is still earned.
 *
 * ── WHY THIS FILE EXISTS (defect R1) ──────────────────────────────────────
 * `/go` was excluded from the whole Direction F rebuild as *"internal redirect,
 * no UI"*. That sentence is a correct description of `/go/[slug]`, a `route.ts`
 * that records a click and redirects. `/go` itself is the Instagram link-in-bio
 * grid — a rendered, customer-facing page that every profile visitor lands on —
 * and it sat on V2.0 for six batches because **every pass read the exclusion as
 * a category and skipped the row.**
 *
 * The page was rebuilt on 2026-09-12 and the reason corrected. What was still
 * owed, and is what this file is, is the MECHANISM: the counted rows of that
 * report are re-measured on every run and cannot go stale, while the excluded
 * rows carried prose that nothing re-tested, inside a file whose header says
 * GENERATED. **A generated artefact containing an un-generated claim is the
 * worst of both: it reads with the authority of a measurement and has the
 * half-life of a comment.**
 *
 * ── TWO DIFFERENT QUESTIONS, AND BOTH ARE NEEDED ─────────────────────────
 * `evidence` asks *is the stated fact still true?* — mechanically, against the
 * route's own source, on every `npm test`.
 * `reviewed` asks *has anyone looked at whether that fact still JUSTIFIES the
 * exclusion?* — which no grep can answer.
 *
 * `/go` is the case that proves they are different. Its old reason was a FALSE
 * FACT, and evidence would have caught it the first time the sweep ran. But a
 * reason can also be perfectly true and no longer sufficient, and that failure
 * is invisible to any check. One of these halves without the other rebuilds the
 * original defect from a different direction.
 *
 * ⚠ AGE IS REPORTED, NEVER FATAL, AND THAT IS DELIBERATE. There is no
 * principled number of days at which a reason expires, and this repo has
 * already written down what happens to a check that cries wolf on ordinary
 * work: it gets switched off, taking the half that did work with it. The
 * control here is `evidence`, which fails. `reviewed` is metadata that makes
 * the unmechanised half VISIBLE, which is exactly what R1 asked for. Do not
 * "finish the job" by making a date failing.
 *
 * ── WRITING AN EVIDENCE CLAUSE ───────────────────────────────────────────
 * Pick the load-bearing half of the reason — the part that, if it stopped being
 * true, would mean the route should be counted after all. Not the whole
 * sentence: `/demo`'s *"Direction F is the wrong question"* is a judgement, and
 * the checkable half underneath it is that the page renders the app shell's
 * `ap-` classes rather than the marketing layer's.
 *
 * `must` / `mustNot` are matched against the route's own `page.tsx`. The file is
 * DERIVED from the url by the caller rather than named here, so this table
 * cannot disagree with the route collector about where a route lives.
 */
'use strict'

const EXCLUSIONS = {
  '/founding-member': {
    why: 'retired, 307s to /kits',
    reviewed: '2026-09-12',
    // If the redirect goes, the page renders JoinForm again and is public.
    evidence: { must: [/redirect\(\s*['"]\/kits['"]\s*\)/] },
  },

  '/activate': {
    why: 'retired 2026-09-12, 307s to /how-to-sample (deprecated by the QR decision of 2026-06-12)',
    reviewed: '2026-09-12',
    evidence: { must: [/redirect\(\s*['"]\/how-to-sample['"]\s*\)/] },
  },

  '/admin/dashboard': {
    why: 'admin-gated internal tool, no public UI (Direction F since 2026-09-12)',
    reviewed: '2026-09-12',
    // The gate is the whole reason. A1's work made this page the one internal
    // surface that WRITES, so losing the gate is not a conformance problem.
    evidence: { must: [/isAdmin\(/] },
  },

  '/ops/content': {
    why: 'admin-gated internal tool, no public UI (Direction F since 2026-09-12)',
    reviewed: '2026-09-12',
    evidence: { must: [/isAdmin\(/] },
  },

  '/go': {
    why: 'renders a `bio_grid_view` analytics event on every load, so a sweep would pollute the campaign it measures (Direction F since 2026-09-12)',
    // 2026-09-12, when the reason was rewritten and the page rebuilt — NOT the
    // date the evidence clause below was added. The column records when someone
    // last judged the REASON, and stamping it with the date of a mechanical
    // change would reset the one signal it carries.
    reviewed: '2026-09-12',
    // THE ROW THIS FILE EXISTS FOR. The reason is no longer "it has no UI" — it
    // has one, and it is customer-facing. What earns the exclusion now is the
    // server-side event, so that is what is checked. Take the event away and
    // the page should go back into the count.
    evidence: { must: [/trackEvent\(\s*['"]bio_grid_view['"]/] },
  },

  '/blog/preview/[slug]': {
    why: 'internal preview of an unpublished draft, behind a shared token (Direction F: it renders ArticleLayout)',
    reviewed: '2026-09-12',
    // Both halves: a token is required, and a bad one is a 404 rather than a
    // render. Checking only the first would pass a page that read the token and
    // ignored it.
    evidence: { must: [/token\s*!==\s*expected/, /notFound\(\)/] },
  },

  '/demo': {
    why: 'runs the authenticated app shell (`ap-*`), not the marketing layer, so Direction F is the wrong question',
    reviewed: '2026-09-12',
    // The judgement is not checkable; the fact underneath it is. If /demo ever
    // renders the marketing layer, the exclusion stops being earned and this
    // fails rather than being inherited for another six batches.
    evidence: { must: [/(?<![A-Za-z0-9_-])ap-[a-z][a-z0-9_-]*/] },
  },
}

/**
 * Judge every exclusion against the source on disk.
 *
 * `fileFor(url)` is supplied by the caller — the reporter and the static guard
 * each already walk `app/`, and deriving the path here would be a third opinion
 * about where a route lives.
 *
 * Returns one result per exclusion. `ok: false` is a failure, never a warning:
 * an exclusion whose reason has stopped being true is a route that is silently
 * not being measured, which is the entire defect.
 */
function judgeExclusions(fileFor, readFile) {
  return Object.entries(EXCLUSIONS).map(([url, ex]) => {
    const problems = []

    // A missing evidence block is a FAILURE, not a skip. Anything else and the
    // way to exclude a route without justifying it is to omit a key, which is a
    // strictly easier path than writing the reason it exists to demand.
    if (!ex.evidence || !Array.isArray(ex.evidence.must) || ex.evidence.must.length === 0) {
      problems.push('no evidence clause: an exclusion must name a fact that can be checked')
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ex.reviewed || '')) {
      problems.push('no reviewed date')
    }

    const file = fileFor(url)
    let src = null
    if (!file) {
      problems.push('no page.tsx on disk: the route moved or was deleted, and nobody re-read the exclusion')
    } else {
      src = readFile(file)
      if (src === null) problems.push(`could not read ${file}`)
    }

    if (src !== null && ex.evidence) {
      for (const re of ex.evidence.must || []) {
        if (!re.test(src)) problems.push(`${file} no longer matches ${re}`)
      }
      for (const re of ex.evidence.mustNot || []) {
        if (re.test(src)) problems.push(`${file} now matches ${re}, which the exclusion says it must not`)
      }
    }

    return { url, why: ex.why, reviewed: ex.reviewed || null, file, ok: problems.length === 0, problems }
  })
}

/**
 * Whole days between a reviewed date and `now`. Null when the date is unusable.
 *
 * 🔴 BOTH SIDES ARE UTC CALENDAR DAYS, AND THE FIRST VERSION OF THIS FUNCTION
 * WAS NOT. It compared a UTC midnight against `Date.now()`, so at 23:40 BST on
 * 2026-09-13 a reason reviewed that same afternoon printed **"-1 days"** and one
 * reviewed on the 12th printed "1 day". Nothing was wrong with either date; the
 * two sides of the subtraction were in different frames.
 *
 * That is closed register item 10 reappearing in a new file — *"every date was
 * formatted in whatever timezone the runtime happened to be in, so production
 * rendered a date a day early for one hour of every evening of British Summer
 * Time, and the machine it was checked on never showed it"*. It reappeared here
 * because the trap is not in formatting, it is in **subtracting an instant from
 * a calendar date**, and the fix that closed item 10 was scoped to formatters.
 *
 * UTC rather than local, deliberately: this number is printed into a COMMITTED
 * generated report whose `generated` field is already a UTC calendar day, so a
 * local-time answer would make the file differ by who ran it. The cost is that
 * a UK reader late on a BST evening sees a figure one lower than the one on his
 * own wall, which is the right trade for an artefact that gets committed.
 */
function reviewAgeDays(reviewed, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewed || '')) return null
  const then = Date.parse(`${reviewed}T00:00:00.000Z`)
  if (Number.isNaN(then)) return null
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((todayUtc - then) / 86400000)
}

/**
 * The age as a phrase, so every caller says it the same way.
 *
 * A NEGATIVE age is surfaced rather than clamped. It means the reason carries a
 * date that has not happened yet in UTC, which is a typo or someone stamping
 * "today" from a clock ahead of UTC — both worth seeing, and both invisible if
 * the number is quietly floored at zero.
 */
function reviewAgePhrase(reviewed, now = new Date()) {
  const d = reviewAgeDays(reviewed, now)
  if (d === null) return '**never reviewed**'
  if (d < 0) return `${reviewed} (**dated ${-d} day${-d === 1 ? '' : 's'} in the future**)`
  if (d === 0) return `${reviewed} (today)`
  return `${reviewed} (${d} day${d === 1 ? '' : 's'} ago)`
}

module.exports = { EXCLUSIONS, judgeExclusions, reviewAgeDays, reviewAgePhrase }
