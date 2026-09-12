import type { Metadata } from 'next'
import { FPage, FSection, FHero } from '@/components/marketing/FPage'
import { SLA_COPY } from '@/lib/pricing'
import { urlFor } from '@/lib/hosts'

/**
 * /how-to-sample, built 2026-09-12. The sanctioned replacement for `/activate`.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * FRAME AD, `design/mockups/journey/lp-sample-F.html`.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * 🔴 THIS PAGE IS A DEPRECATION FINISHING, NOT A REDRAW. `/activate` was the
 * login-gated per-order kit-activation screen and was deprecated on 2026-06-12
 * (`docs/2026-06-12-activate-qr-deprecation.md`, owner Keith). That decision
 * named its replacement — "a single static public page hosting a short
 * how-to-sample video plus the step text, linked from a GENERIC QR" — and
 * nobody built it, so for three months the route was a deprecated screen with
 * no successor. `/activate` now redirects here.
 *
 * TWO THINGS THIS PAGE MUST NOT HAVE, and they are the reason it exists. No
 * sign-in, because the QR is printed identically on every kit insert and there
 * is no order to match it to. And no kit code, because there is no per-order
 * code any more: the deprecation decision records that nothing was ever
 * printing one, so the flow being replaced was served but unreachable.
 *
 * 🔴 THE FIVE STEPS ARE TRANSCRIBED, NOT WRITTEN. They are the `INSTRUCTIONS`
 * array from `app/activate/page.tsx`, which is the part of the deprecated flow
 * that survives its deprecation. Byte-identical. The login gate, the kit code
 * and all three error states go with the route.
 *
 * 🔴 THE FRAME'S VIDEO SLOT IS NOT BUILT, AND THAT IS DELIBERATE. Frame AD
 * draws an EMPTY slot captioned "does not exist yet", which is the honest way
 * to draw a dependency in a mockup and the wrong thing to ship: a live page
 * that tells a man holding a lancet about a film he cannot watch is worse than
 * a page that does not mention one. The film is still owed — it is the other
 * half of the deprecation decision's replacement — and when it exists it goes
 * between the standfirst and the steps, which is where the frame puts it.
 *
 * ⚠ THE STEPS ARE PLAIN ROWS, NOT THE FRAME'S NUMBERED CARDS. Frame AD draws
 * each step as a bordered card with a ghost numeral. The containment ruling of
 * 2026-09-02 postdates that drawing and settles it: a card holds a transaction
 * or an instrument, a step is prose, and all four prose grids take one rule
 * above and nothing else. `.f-step` already renders that way site-wide.
 *
 * ⚠ `.f-steps-1`, ADDED FOR THIS PAGE. Five is the one step count that cannot
 * fill `.f-steps`: at four-up it leaves a cell empty and at two-up it leaves a
 * cell empty, and an empty cell in a numbered sequence reads as a step somebody
 * forgot. That is the `.f-steps-3` argument at a different count. The second
 * reason is the reader: this is a procedure carried out one step at a time, one
 * handed, by someone who has just pricked his finger, and a grid asks him to
 * scan sideways mid-task. Argued in f-primitives.css.
 *
 * ⚠ NOINDEX, follow. It is a support page reached from a QR on the kit insert,
 * not an acquisition page, and it is deliberately absent from `app/sitemap.ts`.
 * Flipping it to indexable is a content decision (it would be a thin page in
 * the index competing with `/how-it-works`), not a build one.
 *
 * ⚠ THE STANDFIRST'S CLINICAL HALF IS EXISTING COPY. "Do it fasted, first thing
 * in the morning, for the most accurate hormone results" is `/how-it-works`
 * verbatim, which is also where the homepage and `/test-selector` take it from.
 * The two sentences before it are new and describe the page rather than the
 * sample. Registered as row 44.
 */

export const metadata: Metadata = {
  title: 'How to take your sample | Andro Prime',
  description: 'Five steps, about five minutes. Your at-home finger-prick, start to finish.',
  robots: { index: false, follow: true },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* VERBATIM from the deprecated `/activate` page's `INSTRUCTIONS`. Do not
   reword: this is the only copy on the page that tells a man how to draw his
   own blood, and it shipped in that form. */
const STEPS = [
  {
    num: '01',
    title: 'Wash your hands',
    body: 'Wash with warm water for 30 seconds to increase blood flow. Dry completely.',
  },
  {
    num: '02',
    title: 'Use the lancet',
    body: 'Twist off the cap. Press it firmly against the side of your fingertip until you hear a click.',
  },
  {
    num: '03',
    title: 'Fill the tube',
    body: 'Gently squeeze your finger. Wipe away the first drop, then fill the tube to the top line. Massage from palm to fingertip if slow.',
  },
  {
    num: '04',
    title: 'Seal and pack',
    body: 'Snap the lid closed tightly. Place the tube in the biohazard bag, then into the original return box.',
  },
  {
    num: '05',
    title: 'Post today',
    body: 'Use the pre-paid return envelope. Drop it in a priority postbox before the last collection of the day.',
  },
]

export default function HowToSamplePage() {
  return (
    <FPage>
      <FHero narrow>
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">Your kit</span>
        </div>
        <h1 className="f-h1">How to take your sample.</h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Five steps, about five minutes. No account needed, and nothing to enter. Do it fasted,
          first thing in the morning, for the most accurate hormone results.
        </p>
      </FHero>

      {/* ---------- 01 · THE FIVE STEPS ---------- */}
      <FSection narrow>
        <p className="f-blab">The five steps</p>

        {/* 🔴 THE STEPS CARRY NO REVEAL AT ALL, AND THAT IS A DECISION THIS PAGE
            HAD TO MAKE RATHER THAN A CLASS SOMEBODY FORGOT.

            The list begins at 751px in a 900px viewport, which puts it in the
            band between the observer's 88% root and the bottom of the screen —
            visible to the reader, not yet "arriving" to the observer. As ONE
            target (`.f-rise` on the grid, which is what every other steps
            section wears) 7% of a 590px element fell inside the root against a
            threshold of 8%: six pixels short, so the list stayed INVISIBLE with
            no scroll able to fix it, because by then it had been passed. Moving
            the target onto each step did not solve it, it moved it: step 02
            then sat at 850px with 0% inside the root. Anything whose top lands
            in that band has the same problem, and a page cannot choose its
            reader's viewport height.

            So the answer is not a smaller target, it is no target. This is a
            procedure someone follows while holding a lancet, and the direction's
            own rule is that nothing which moves carries information. Fading in
            the instructions performs them; being present is the whole job.
            `verify-scroll-reveal.js` names the stuck element now, which is what
            made both attempts diagnosable instead of a hunt. */}
        <div className="f-steps f-steps-1" style={{ marginTop: 24 }}>
          {STEPS.map(({ num, title, body }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num}</span>
              <h2 className="f-h4 mt-2.5 mb-2">{title}</h2>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>

        {/* The one piece of the deprecated page that is not a step and is not
            furniture: what to do when it is not working. Verbatim from that
            page, where it sat as a rule-left callout under the instructions.
            It is a `.f-well` here because the reader who needs it is stuck, and
            the direction's well is how this system marks an aside that is read
            out of sequence. */}
        <div className="f-well" style={{ marginTop: 30 }}>
          <p className="f-blab">If the blood will not come</p>
          <p className="f-sub" style={{ fontSize: 15, marginTop: 8 }}>
            If you can&rsquo;t get enough blood, use the spare lancets provided on a different
            finger. Standing up and swinging your arm can help increase flow.
          </p>
        </div>
      </FSection>

      {/* ---------- 02 · AFTER YOU POST IT ---------- */}
      <FSection narrow>
        <p className="f-blab">After you post it</p>
        <h2 className="f-h2">
          Results land in<br /><span className="f-grey">your dashboard.</span>
        </h2>

        <div className="f-tray f-rise" style={{ marginTop: 24, marginBottom: 0 }}>
          <div className="f-core">
            <p className="f-sub" style={{ marginTop: 0 }}>
              Results in your dashboard within {SLA_COPY} of the lab receiving your sample, in plain
              English, with a specific next step.
            </p>
            {/*
              A ghost button, not the primary one, and Frame AD argues it: at
              this moment the reader has just posted a sample and there is
              nothing in the dashboard yet. The page's job ends when the
              envelope is in the postbox.

              The app host, so a plain <a> and an absolute URL. next/link cannot
              client-navigate across origins; left as a Link it would render the
              dashboard on the apex and bypass the middleware redirect. Same
              rule the nav and the 404 follow.
            */}
            <div className="f-btns" style={{ marginTop: 20 }}>
              <a href={urlFor('/results-dashboard')} className="f-btn f-btn-ghost">
                Go to your dashboard {ARROW}
              </a>
            </div>
          </div>
        </div>
      </FSection>
    </FPage>
  )
}
