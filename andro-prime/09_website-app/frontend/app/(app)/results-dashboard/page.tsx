import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth/session'
import { getDashboardData } from '@/lib/results/getDashboardData'
import { isKitScopeNoteEnabled, isGpHandoffEnabled } from '@/lib/flags'
import { DevFixtureBar, ResultsReadyView } from '@/components/results-engine'
import { PasswordBanner } from '@/components/app/PasswordBanner'
import { AppStrip, AppShell } from '@/components/app/AppShell'
import type { PreResultsOrderStatus, KitType } from '@/lib/results/types'
import { urlFor } from '@/lib/hosts'
import { numberWord, panelCount, panelSentenceList } from '@/lib/kits/panel'

export const metadata: Metadata = {
  title: 'Your Results',
  robots: { index: false, follow: false },
}

/*
 * /results-dashboard, REBUILT IN DIRECTION F ON 2026-09-11. Batch 3.
 *
 * Frames: results-states-F.html D (pre-results), E (no-results), F
 * (sample-failed). The results-present state is `ResultsReadyView` and is drawn
 * by results-F.html Frame C. Pictures, not a spec.
 *
 * 🔴 NOT ONE WORD OF COPY CHANGED, AND ALL THREE FRAMES REWROTE IT. This is the
 * single biggest decision in this file, so the reasoning is here rather than in
 * a commit message. Each frame's own header says its copy is "not
 * compliance-checked and is not clinically signed", and taking it would have
 * shipped, in one commit:
 *
 *   FRAME F, AN UNVERIFIED CAUSAL CLAIM. "It is almost always the volume of
 *   blood in the tube" states a cause for sample failure that appears nowhere in
 *   the lab agreement, the products workspace, or any approved copy. The live
 *   sentence says a finger-prick sample sometimes does not give the lab enough
 *   to work with, which says less and is supported.
 *
 *   FRAME F, A STRONGER OPERATIONAL PROMISE. "A replacement kit is on its way to
 *   you at no cost" against the live "We're arranging a replacement kit... our
 *   team will be in touch by email". One asserts a dispatch that has happened;
 *   the other describes a process. Only the second is true at the moment this
 *   screen renders.
 *
 *   FRAME F, TWO LINKS TO ROUTES THAT DO NOT EXIST. "Track the replacement" has
 *   no surface behind it, and "How to get a good sample" is `/how-to-sample`,
 *   which Frame AD draws and which the 2026-09-11 buy-stage handoff established
 *   DOES NOT EXIST and needs a film nobody has made.
 *
 *   FRAME D, AN INVENTED SLA. The tracker carries per-step timestamps and an
 *   "Expected by Thu 18 Aug". `getDashboardData` returns an order STATUS and no
 *   timeline, so both would be fabricated, and kits-F already ruled on this exact
 *   shape: an invented operational promise in a mockup is read by the rebuild as
 *   an existing one.
 *
 *   FRAME D, FOUR NEW EDUCATIONAL CARDS including a description of laboratory
 *   batch controls. The four cards that ship (DOC.01 to DOC.04) are the ones
 *   already live.
 *
 * So the LAYOUT is the frames' and the WORDS are the live page's, which is the
 * same call the `/lp` rebuild made in batch 2. Everything above is owed to Keith
 * as a copy decision, not quietly taken or quietly dropped.
 *
 * ⚠ FRAME C'S "ONE UPGRADE" IS ALREADY BUILT, IN THE OTHER DESIGN SYSTEM, AND
 * BETTER. The frame proposes a two-range track showing the laboratory's
 * reference interval against our action bands. `components/app-shell/
 * RangeTrack.tsx` does exactly that on live data, and it deliberately refuses
 * two things the frame draws: the named "clinical action cutoff" rule, because
 * that string is not in the engine, and any threshold typed by hand. Building
 * the frame's version in `f-` would be a second implementation of one clinical
 * device, and the weaker of the two. Not built. If the dashboard is to gain the
 * two-range track it should SHARE that component, which is a decision about the
 * two systems rather than a styling task.
 *
 * ⚠ THE FRAME ALSO DRAWS A "signed by Dr Ewa Lindo" ATTRIBUTION LINE. Not built.
 * A named clinical attribution on a results surface is hers to grant.
 */

interface PageProps {
  searchParams: Promise<{ dev?: string }>
}

// ── Tracker config ──────────────────────────────────────────────────────────

const TRACKER_STEPS = ['Kit dispatched', 'Sample received', 'Analysing', 'Results ready'] as const

/*
 * 🔴 THIS INDEX IS THE STEP BEING WAITED FOR, NOT THE STEP REACHED, AND MISREADING
 * IT PUT "RESULTS READY" ON A SCREEN THAT SAYS THE SAMPLE IS STILL AT THE LAB.
 *
 * Read it as "the milestone you are waiting for": an order-placed customer is
 * waiting for the kit to be dispatched (0), and an analysing customer is waiting
 * for the results (3). The tracker renders everything below the index as done and
 * the index itself as current, which is right under that reading and is why the
 * live tracker has always been correct.
 *
 * What it is NOT is a description of where the order has got to. The batch-3
 * rebuild added two new surfaces that assumed it was: the status strip printed
 * `TRACKER_STEPS[index]` and the sidebar chip printed `index + 1 of 4`, so an
 * analysing order announced "RESULTS READY" and "Step 4 of 4" above a heading
 * reading "Your sample is being analysed." Caught by screenshotting the route
 * after logging in, and by nothing else: every check in the suite passed.
 *
 * `STATUS_CHIP` below is the achieved state, and it is what those two surfaces
 * use now. Two maps, because they answer two different questions.
 */
const STATUS_TO_STEP: Record<PreResultsOrderStatus, number> = {
  'order-placed':    0,
  'kit-sent':        1,
  'sample-received': 2,
  'analysing':       3,
}

/** Where the order actually IS, for the strip and the chip. */
const STATUS_CHIP: Record<PreResultsOrderStatus, string> = {
  'order-placed':    'Order placed',
  'kit-sent':        'Kit on its way',
  'sample-received': 'Sample received',
  'analysing':       'Analysing',
}

const STATUS_COPY: Record<PreResultsOrderStatus, { heading: string; subtext: string }> = {
  'order-placed': {
    heading: 'Your kit is being prepared.',
    subtext: "We've placed your order with the lab. Your kit will be dispatched within 1–2 working days.",
  },
  'kit-sent': {
    heading: 'Your kit is on its way.',
    subtext: 'Your kit has been dispatched. It should arrive within 2–3 working days.',
  },
  'sample-received': {
    heading: "We've got your sample.",
    subtext: 'Your sample has arrived at the lab. Analysis takes 1–3 working days.',
  },
  'analysing': {
    heading: 'Your sample is being analysed.',
    subtext: "The lab is processing your results. You'll get an email as soon as they're ready.",
  },
}

const KIT_CARD_BODY: Record<KitType, string> = {
  'testosterone':
    `Your kit tests ${panelSentenceList('testosterone')}. These are the ${numberWord(panelCount('testosterone'))} markers that tell you where your testosterone actually stands, not just whether you're 'in range'.`,
  'energy-recovery':
    `Your kit tests ${panelSentenceList('energy-recovery')}, the ${numberWord(panelCount('energy-recovery'))} markers most directly linked to energy, recovery, and inflammation in active men.`,
  'hormone-recovery':
    'Your kit tests a full hormone and recovery panel including testosterone, free testosterone, and key nutrient and inflammation markers linked to fatigue and recovery.',
}

// ── StatusTracker ────────────────────────────────────────────────────────────

/*
 * ONE DOM, TWO AXES. The live version rendered the whole tracker twice, once in
 * a `sm:hidden` vertical stepper and once in a `hidden sm:block` horizontal one,
 * so the four labels and the completion arithmetic existed in two places and a
 * change to either had to be made twice. `.f-prog` turns its own axis at 640px,
 * so there is one copy of the steps and no way for the two to disagree.
 */
function StatusTracker({ orderStatus }: { orderStatus: PreResultsOrderStatus }) {
  const currentStep = STATUS_TO_STEP[orderStatus]

  return (
    <ol className="f-prog">
      {TRACKER_STEPS.map((label, i) => {
        const done = i < currentStep
        const now = i === currentStep
        return (
          <li
            key={label}
            className={
              done ? 'f-prog-s f-prog-done' : now ? 'f-prog-s f-prog-now' : 'f-prog-s'
            }
            aria-current={now ? 'step' : undefined}
          >
            <span className="f-prog-mark" aria-hidden="true" />
            <span className="f-prog-lab">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

// ── EducationCards ───────────────────────────────────────────────────────────

function EducationCards({ kitType }: { kitType: KitType }) {
  const kitBody = KIT_CARD_BODY[kitType] ?? KIT_CARD_BODY['testosterone']

  const cards = [
    {
      id: 'DOC.01',
      title: "What's in your kit",
      subtitle: kitType === 'testosterone' ? '(Kit 1: Testosterone + SHBG)' : undefined,
      body: kitBody,
    },
    {
      id: 'DOC.02',
      title: 'Testosterone and you',
      body: "Testosterone is one of the body's core regulatory hormones. Most men know it matters. But very few know their actual number. The 'normal' range runs from roughly 9 to 27.6 nmol/L. That's a threefold difference. Where you sit in that range matters.",
    },
    {
      id: 'DOC.03',
      title: 'At the lab',
      body: "Your sample is tested by a UKAS ISO 15189-accredited laboratory. Each biomarker is measured against a calibrated reference range. Your results are released automatically once processing is complete. You'll get a notification the moment they're ready.",
    },
    {
      id: 'DOC.04',
      title: 'Reading your results',
      body: 'Your results will show your number, what it means in plain English, and what options exist if you want to act on it. No jargon. No generic advice. Everything you see will be specific to your numbers.',
    },
  ]

  return (
    <div className="f-waitgrid">
      {cards.map((card) => (
        <div key={card.id} className="f-tray f-rise">
          <div className="f-core f-waitcard">
            <p className="f-blab">{card.id}</p>
            <h3>{card.title}</h3>
            {card.subtitle && <p className="f-waitcard-sub">{card.subtitle}</p>}
            <div className="f-waitcard-b">{card.body}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ResultsDashboardPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  if (!user) return null

  const { dev } = await searchParams
  const data = await getDashboardData(user.id, dev)

  const jar = await cookies()
  const showPasswordBanner = !jar.get('ap_pwd_prompt_dismissed')?.value

  const devBar = process.env.NODE_ENV !== 'production' ? <DevFixtureBar currentScenario={dev} /> : null

  // ── No orders ─────────────────────────────────────────────────────────────
  if (data.state === 'no-results') {
    return (
      <>
        {showPasswordBanner && <PasswordBanner />}
        <AppStrip label="Your results" right="No kit yet" />
        <AppShell
          chip="Nothing to show"
          heading="Nothing here yet."
          intro="This page holds your results and your order status, and nothing else lives here. Once a kit is on its way, this is where it appears."
        >
          {devBar}
          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Your results</p>
              <p className="f-sub">
                Once you&rsquo;ve purchased a kit, your results and order status will appear here.
              </p>
              {/* Cross-host: /kits is MARKETING on the apex. */}
              <a href={urlFor('/kits')} className="f-btn" style={{ marginTop: 22 }}>
                Buy a kit <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </AppShell>
      </>
    )
  }

  // ── State A0: Sample failed ───────────────────────────────────────────────
  if (data.state === 'sample-failed') {
    return (
      <>
        {showPasswordBanner && <PasswordBanner />}
        <AppStrip label="Your results" right="Sample issue" />
        <AppShell
          chip="Sample issue"
          heading="We couldn&rsquo;t process your sample."
          intro="A recollection is being arranged. Your original order still covers it, and there is nothing to pay."
        >
          {devBar}
          <div className="f-tray f-rise">
            <div className="f-core">
              <span className="f-stat f-stat-w">Status: sample issue</span>
              <p className="f-sub" style={{ marginTop: 18 }}>
                Sometimes a finger-prick sample doesn&rsquo;t give the lab enough to work with. It
                happens, and it isn&rsquo;t anything you did wrong. We&rsquo;re arranging a
                replacement kit so you can try again at no extra cost, and our team will be in touch
                by email with the details.
              </p>
              <a href="mailto:support@andro-prime.com" className="f-btn" style={{ marginTop: 22 }}>
                Contact support <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </AppShell>
      </>
    )
  }

  // ── State A: Pre-results ──────────────────────────────────────────────────
  if (data.state === 'pre-results') {
    const { orderStatus, kitType } = data
    const copy = STATUS_COPY[orderStatus]

    return (
      <>
        {showPasswordBanner && <PasswordBanner />}
        <AppStrip label="Your results" right={STATUS_CHIP[orderStatus]} />
        <AppShell
          chip={STATUS_CHIP[orderStatus]}
          heading={copy.heading}
          intro={copy.subtext}
        >
          {devBar}

          <div className="f-tray f-rise">
            <div className="f-core">
              <p className="f-blab">Where your kit is</p>
              <StatusTracker orderStatus={orderStatus} />
            </div>
          </div>

          <p className="f-blab" style={{ marginTop: 34 }}>
            While you wait &middot; what we&rsquo;re testing
          </p>
          <EducationCards kitType={kitType} />
        </AppShell>
      </>
    )
  }

  // ── State B: Results ready ────────────────────────────────────────────────
  // GP handoff link (dark behind GP_HANDOFF_ENABLED). Shown only when a result
  // actually routes to a GP referral, i.e. the case where taking a summary to
  // the GP is the point. Inert while the flag is OFF.
  const hasGpReferral = data.kits.some((kit) =>
    kit.results.some((r) =>
      r.markers.some(
        (m) => m.primaryCta?.type === 'gp-referral' || m.secondaryCta?.type === 'gp-referral'
      )
    )
  )
  const showHandoffLink = isGpHandoffEnabled() && hasGpReferral

  return (
    <ResultsReadyView
      kits={data.kits}
      showKitScopeNote={isKitScopeNoteEnabled()}
      banner={showPasswordBanner ? <PasswordBanner /> : null}
      sidebarTop={devBar}
      belowTabs={
        showHandoffLink ? (
          <div className="f-tray" style={{ margin: '0 0 20px' }}>
            <div className="f-core f-subfoot" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
              <div style={{ maxWidth: '44ch' }}>
                <p className="f-blab">Taking this to your GP?</p>
                <p className="f-sub">
                  Prepare a one-page summary of your results, with the reference ranges and
                  questions to ask, that you can print or save as a PDF.
                </p>
              </div>
              <a href="/results-dashboard/handoff" className="f-btn">
                Prepare GP summary <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        ) : null
      }
    />
  )
}
