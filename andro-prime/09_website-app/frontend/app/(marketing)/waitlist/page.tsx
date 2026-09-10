import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/shared/JsonLd'
import { FPage, FSection, FClose, FHero } from '@/components/marketing/FPage'
import { WaitlistForm } from '@/components/marketing/WaitlistForm'
import { KIT_NAMES } from '@/lib/kits/names'
import { PRICING, SLA_COPY } from '@/lib/pricing'
import type { KitType } from '@/lib/results/types'

/**
 * /waitlist, rebuilt in Direction F on 2026-09-09.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NO JOURNEY FRAME EXISTS FOR THIS ROUTE. Layout decided, not ported.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * EVERY WORD IS VERBATIM. The headline, the standfirst, the three problem
 * paragraphs, the five symptom lines, the four process steps and the closing
 * headline are byte-identical to the V2.0 page, as is every string inside
 * `WaitlistForm`. The changes are the two section labels the F grammar requires,
 * and the kit rows now naming themselves from source rather than by hand.
 *
 * 🔴 THE THREE PRICES AND THE THREE KIT NAMES ARE NO LONGER TYPED ON THIS PAGE,
 * AND THAT IS A CORRECTNESS FIX RATHER THAN A TIDY-UP. The V2.0 "Available now"
 * panel hand-wrote `Kit 1: Testosterone Health Check` / `£99`, `Kit 2: Energy &
 * Recovery Check` / `£119` and `Kit 3: Hormone & Recovery Check` / `£179` as six
 * string literals. DESIGN.md's Do list is explicit: *"Derive marker sets, prices
 * and panel copy from `lib/kits/panel.ts` and `lib/pricing.ts`. Never hand-write
 * them onto a surface."* They now come from `PRICING` and `KIT_NAMES`, so a price
 * change breaks the build here instead of leaving a stale number on a page nobody
 * thought to check. ⚠ The names in `KIT_NAMES` carry no "Kit N:" prefix, so the
 * number moves to the row's own mono meta line, where `/kits` already puts it.
 *
 * ⚠ THE TURNAROUND COMES FROM `SLA_COPY` for the same reason. `lib/pricing.ts`
 * carries a written warning beside it that the customer-facing SLA is "2 to 5
 * working days" on Vitall's reasonable endeavours, and that an hours-based SLA
 * must never be advertised. A page that types the string itself is a page that
 * can drift past that warning without touching the file the warning is in.
 *
 * ⚠ NO PHOTOGRAPH. Nothing on this page is a place or a moment; it is a list of
 * what exists, a list of what is missing, and a form. `.f-plate` earns its keep
 * where there is something to look at, and inventing a subject to fill an aside
 * is how a page acquires a stock photograph.
 *
 * ⚠ NO INVERTED PANEL, DELIBERATELY. DESIGN.md reserves it for a conformity
 * statement and allows one per page at most; this page makes no such statement,
 * so it spends none. The `.f-symp .f-dark` card in section 01 is a different
 * component with a different job, and it is the one the direction provides for a
 * line that reframes the list above it.
 */

const BASE_URL = 'https://andro-prime.com'

const waitlistSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Waitlist', item: `${BASE_URL}/waitlist` },
      ],
    },
  ],
}

export const metadata: Metadata = {
  title: 'Join the Waitlist',
  description: 'Three at-home blood tests for men are available now. Join the list to hear first when we add new panels.',
  alternates: { canonical: `${BASE_URL}/waitlist` },
}

const ARROW = <span className="f-pip" aria-hidden="true">&rarr;</span>

/* The three that ship today. `tag` is the V2.0 page's own word for each and is
   the only string in this table that is not imported; the name, the price and
   the slug all come from source. */
const available: { kit: KitType; n: string; tag: string; price: number }[] = [
  { kit: 'testosterone', n: 'Kit 1', tag: 'Base', price: PRICING.KIT_1.rrp },
  { kit: 'energy-recovery', n: 'Kit 2', tag: 'Targeted', price: PRICING.KIT_2.rrp },
  { kit: 'hormone-recovery', n: 'Kit 3', tag: 'Most complete', price: PRICING.KIT_3.rrp },
]

/* Verbatim. The last line is the one that reframes the four above it, so it
   takes `.f-symp .f-dark`, the ink card the direction provides for exactly that
   move. The other four are statements of symptom and stay on `--core`. */
const symptoms = [
  { text: 'Persistent fatigue despite full sleep', dark: false },
  { text: 'Recovery taking 3 days instead of 1', dark: false },
  { text: 'Brain fog and lost focus', dark: false },
  { text: 'Low drive and motivation', dark: false },
  { text: '“GP said I’m fine,” but you know you’re not', dark: true },
]

/* Verbatim bodies. Step 04's body says "2 to 5 working days" in prose and the
   mono footer states the same interval from `SLA_COPY`, which is the value the
   whole site reads. */
const steps = [
  { num: '01', title: 'Order', body: 'Dispatched same day. Fits through your letterbox.', foot: ['Dispatch', 'Same day'] },
  { num: '02', title: 'Collect', body: 'A simple finger-prick sample you can do at the kitchen table.', foot: ['Sample', 'Finger-prick'] },
  { num: '03', title: 'Return', body: 'Drop it in a postbox using the prepaid return envelope.', foot: ['Postage', 'Prepaid'] },
  { num: '04', title: 'Read', body: 'Results in your private dashboard within 2 to 5 working days. Plain English. Specific recommendation.', foot: ['Result', SLA_COPY] },
]

export default function WaitlistPage() {
  return (
    <FPage>
      <JsonLd data={waitlistSchema} />

      {/* ---------- HERO ----------
          The aside is the "Available now" price list, which is the same object
          `/kits` puts in its own hero and survives the containment test for the
          same reason: a price list is not prose. Each row links to its kit page,
          which the V2.0 panel also did. */}
      <FHero
        aside={
          <div className="f-tray" style={{ marginBottom: 0 }}>
            <div className="f-core">
              <p className="f-blab">Available now</p>
              <div style={{ marginTop: 12 }}>
                {available.map(({ kit, n, tag, price }) => (
                  <Link
                    key={kit}
                    href={`/kits/${kit}`}
                    className="f-prow"
                    style={{ textDecoration: 'none' }}
                  >
                    <div>
                      <h3 className="f-prow-t">{KIT_NAMES[kit]}</h3>
                      <p className="f-prow-m">{n} &middot; {tag}</p>
                    </div>
                    <div className="f-prow-p">&pound;{price}</div>
                  </Link>
                ))}
              </div>
              <div className="f-panelfoot">
                <p className="f-sub" style={{ fontSize: 15, marginTop: 0 }}>
                  These three ship today. The list below is for the panels we haven&rsquo;t built yet.
                </p>
              </div>
            </div>
          </div>
        }
      >
        <div className="f-btns" style={{ marginBottom: 18 }}>
          <span className="f-eyebrow">New panels</span>
        </div>
        <h1 className="f-h1">
          The panel you want<br /><span className="f-grey">isn&rsquo;t on the list yet.</span>
        </h1>
        <p className="f-stand" style={{ marginTop: 20 }}>
          Three at-home checks are available now, and they cover testosterone, energy and recovery.
          If the marker you came here for isn&rsquo;t one of them, this is the list to be on.
          We&rsquo;ll email you when we add a new panel, and not for much else.
        </p>

        <div style={{ marginTop: 26 }}>
          <WaitlistForm />
        </div>

        {/* The two promises, as chips. On the V2.0 page they were mono lines
            with tick glyphs; F has no icon vocabulary, and `.f-kchip` is the
            component for a short factual marker. */}
        <div className="f-btns" style={{ marginTop: 20 }}>
          <span className="f-kchip">No spam</span>
          <span className="f-kchip">New panels only</span>
        </div>
      </FHero>

      {/* ---------- 01 · THE PROBLEM ---------- */}
      <FSection>
        <div className="f-splitgrid f-rise">
          <div>
            <p className="f-blab">The problem</p>
            <h2 className="f-h2">
              Normal isn&rsquo;t<br /><span className="f-grey">the same as optimal.</span>
            </h2>
            <p className="f-sub" style={{ marginTop: 16 }}>
              The NHS sets testosterone thresholds to catch clinical deficiency. If you&rsquo;re above
              that threshold, you&rsquo;re &ldquo;fine&rdquo;. Even if you feel terrible.
            </p>
            <p className="f-sub">
              Millions of men sit technically in range but far below the levels that make them feel
              like themselves. They&rsquo;re told to get on with it.
            </p>
            <p className="f-sub">
              Andro Prime gives you the actual data. Not a reassurance. Your numbers, in plain
              English, with a specific recommendation based on where you sit.
            </p>
          </div>

          <div>
            <p className="f-blab" style={{ marginBottom: 12 }}>What men tell us</p>
            <div className="f-symp">
              {symptoms.map(({ text, dark }) => (
                <div key={text} className={dark ? 'f-dark' : undefined}>{text}</div>
              ))}
            </div>
          </div>
        </div>
      </FSection>

      {/* ---------- 02 · THE PROCESS ---------- */}
      <FSection>
        <p className="f-blab">The process</p>
        <h2 className="f-h2">
          Four steps.<br /><span className="f-grey">Results in {SLA_COPY}.</span>
        </h2>
        <div className="f-steps f-rise" style={{ marginTop: 24 }}>
          {steps.map(({ num, title, body, foot }) => (
            <div className="f-step" key={num}>
              <span className="f-no">{num}</span>
              <h3 className="f-h4 mt-2.5 mb-2">{title}</h3>
              <p className="f-sub" style={{ fontSize: 15 }}>{body}</p>
              <div className="f-step-foot">
                <span>{foot[0]}</span>
                <b>{foot[1]}</b>
              </div>
            </div>
          ))}
        </div>
      </FSection>

      {/* ---------- CLOSE ----------
          The second `WaitlistForm`, centred, exactly as the V2.0 page had it.
          `align="center"` centres the block and keeps the consent sentence
          left-aligned inside it, because a wrapping checkbox label centred on
          two lines is harder to read than the same label ranged left. */}
      <FSection rule={false}>
        <FClose inSection>
          <p className="f-blab">One more thing</p>
          <h2>Don&rsquo;t wait for your GP to tell you you&rsquo;re fine.</h2>
          <div style={{ marginTop: 22 }}>
            <WaitlistForm align="center" />
          </div>
          <p className="f-fine" style={{ marginTop: 16 }}>No spam. Unsubscribe anytime.</p>
          <div className="f-btns" style={{ justifyContent: 'center', marginTop: 22 }}>
            <Link href="/kits" className="f-btn f-btn-ghost">
              Or see the three that ship today {ARROW}
            </Link>
          </div>
        </FClose>
      </FSection>
    </FPage>
  )
}
