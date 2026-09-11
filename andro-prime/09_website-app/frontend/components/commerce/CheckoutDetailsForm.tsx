'use client'

import { useMemo, useState } from 'react'

/**
 * THE CHECKOUT DETAILS FORM, rebuilt in Direction F on 2026-09-11.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * NOT ONE WORD CHANGED, AND NOT ONE BRANCH.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Every string is the one that shipped: both hints, all six error lines, both
 * button labels, the trailing note and the consent sentence. The endpoint, the
 * `discount` read, the bundle threading, the four-check validation order and its
 * first-failure return are untouched. What changed is the class attributes, plus
 * the two accessibility additions named below.
 *
 * 🔴 THE CONSENT SENTENCE IS APPROVED COPY AND IS VERSION-LOCKED. Article 9(2)(a)
 * health-data consent, approved as CA-018 (Ewa and Keith), pinned to
 * `HEALTH_PROCESSING_CONSENT_VERSION` in `lib/auth/consentVersions.ts`, currently
 * `2026-06-23-v1`. It is captured here rather than on `/auth/consent` on purpose,
 * "so it is freely given as part of deciding to buy", and it gates payment. Frame
 * V states the consequence for a redesign plainly: it may not be reworded, not
 * shortened to fit a card, and not split across two lines for rhythm. It is
 * reproduced character for character below, including the sentence-final period
 * sitting outside the link.
 *
 * 🔴 THE 18 GATE IS ENFORCED TWICE AND STATED THREE TIMES, AND A RESTYLE IS
 * EXACTLY HOW ONE OF THE THREE GOES MISSING. The date input carries `max` at
 * today minus eighteen years, `isAtLeast18()` re-checks on submit, and "18+ only"
 * is in the trust row on the page. Frame V draws the native date input and says
 * why: a prettier custom control would drop the first of the three and nobody
 * would notice, because the other two would still be there. It is still
 * `type="date"` and it still carries `max`.
 *
 * IT INVENTS NO CONTROLS. `.f-inp`, `.f-consent`, `.f-blab`, `.f-err`, `.f-btn`
 * and `.f-btn-block` are the layer `/test-selector` added on 2026-09-08 and
 * `/auth/*` and `WaitlistForm` reused. DESIGN.md names this file as one of the
 * four surfaces they were deliberately named generically FOR.
 *
 * 🟢 TWO THINGS ARE NEW IN THE COMPONENT LAYER, both argued in
 * f-primitives.css: `.f-opt.f-on.f-on` (the first `.f-opt` group on the site that
 * HOLDS a choice rather than routing on the same gesture that makes it) and the
 * `.f-flagchip` on "Required", which is where the page spends its one emphasis.
 * Frame V argues that spend: the consent box is the single required control and
 * the one thing that blocks the button. The frame drew that emphasis in amber and
 * the token is ink since 2026-09-03, so it arrives as an ink pill with paper text
 * at 19.69:1 rather than as the 6.18:1 amber fill the frame shows.
 *
 * ⚠ THE ERROR IS NOT RED AND MAY NOT BE. `tokens/colours.css`: the status triad
 * owns saturation, and a form validation failure is not a verdict about anybody's
 * blood. `role="alert"` announces it instead of tinting it. Same reasoning and
 * same wording as `WaitlistForm` and the `.f-err` block itself.
 *
 * 🟢 TWO ACCESSIBILITY ADDITIONS, NEITHER OF WHICH TOUCHES COPY OR A BRANCH.
 * The sex buttons were bare `<button>` elements: no group semantics, and a
 * selected state carried only in the class attribute, so a screen reader was told
 * nothing about which was chosen. They now sit in a `role="group"` labelled by
 * the visible `.f-blab`, and each carries `aria-pressed`. They stay buttons
 * rather than becoming radios: radios are the better long-term shape but they
 * change the control's keyboard model, and that is a behaviour decision rather
 * than a restyle.
 */

type KitType = 'testosterone' | 'energy-recovery' | 'hormone-recovery'

/* The stored values are unchanged: `male` and `female` are what the API receives
   and what the lab's reference ranges key off. Only the RENDERED label is
   written out here. The V2.0 markup printed the raw value and uppercased it in
   CSS, so the control read "MALE" / "FEMALE"; Frame V draws "Male" / "Female",
   and the F label register is not a shouted one. Registered as a presentational
   case change, not a copy change: no word differs. */
const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const

function maxDobIso(): string {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)
  return today.toISOString().slice(0, 10)
}

function isAtLeast18(dobIso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) return false
  const dob = new Date(dobIso)
  const eighteen = new Date()
  eighteen.setFullYear(eighteen.getFullYear() - 18)
  return dob <= eighteen
}

// `bundle` is threaded through as a prop (not read from the URL, unlike `discount`)
// because it comes validated from the page (see checkout/details/page.tsx) and must
// match `kitType` exactly for the server-side bundle/base-kit check. Omitted, the
// re-POST body below is byte-identical to today: JSON.stringify drops an undefined
// `bundle` key.
export function CheckoutDetailsForm({ kitType, bundle }: { kitType: KitType; bundle?: string }) {
  const [dob, setDob] = useState('')
  const [sex, setSex] = useState<'male' | 'female' | ''>('')
  const [healthConsent, setHealthConsent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const maxDob = useMemo(() => maxDobIso(), [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!dob) {
      setError('Please enter your date of birth.')
      return
    }
    if (!isAtLeast18(dob)) {
      setError('You must be 18 or over to order a kit.')
      return
    }
    if (!sex) {
      setError('Please select male or female.')
      return
    }
    if (!healthConsent) {
      setError('Please confirm you consent to us processing your health information to provide your test.')
      return
    }

    setLoading(true)
    // Preserve the ?discount= code carried over from the kit page redirect.
    const discount = new URLSearchParams(window.location.search).get('discount') ?? undefined
    try {
      const res = await fetch('/api/checkout/kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kitType, dobIso: dob, sex, healthConsent, discount, bundle }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
        return
      }

      setError(data.error ?? 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ---------- DATE OF BIRTH ---------- */}
      <div className="f-formrow" style={{ marginBottom: 24 }}>
        <label className="f-blab" htmlFor="dob">
          Date of birth
        </label>
        {/* Still `type="date"`, still carrying `max`. See the 18-gate note in the
            file header: this attribute is one of the three statements of the gate
            and the only one a restyle can silently delete. */}
        <input
          id="dob"
          name="dob"
          type="date"
          value={dob}
          max={maxDob}
          onChange={(event) => setDob(event.target.value)}
          required
          className="f-inp"
        />
        <p className="f-sub" style={{ fontSize: 14.5, marginTop: 9 }}>
          You must be 18 or over. We use this to apply the correct lab reference ranges.
        </p>
      </div>

      {/* ---------- SEX ---------- */}
      <div className="f-formrow" style={{ marginBottom: 24 }}>
        <span className="f-blab" id="sex-label">Sex (biological)</span>
        {/* Two columns rather than `.f-opts`' single stack. The quiz's options are
            full sentences and stack; these are one word each, and stacking two
            one-word controls down a 880px column reads as a list of links rather
            than as a choice between two things. */}
        <div
          className="f-opts"
          style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0 }}
          role="group"
          aria-labelledby="sex-label"
        >
          {SEX_OPTIONS.map(({ value, label }) => {
            const selected = sex === value
            return (
              <button
                type="button"
                key={value}
                onClick={() => setSex(value)}
                aria-pressed={selected}
                className={selected ? 'f-opt f-on' : 'f-opt'}
              >
                <span className="f-opt-t">{label}</span>
              </button>
            )
          })}
        </div>
        <p className="f-sub" style={{ fontSize: 14.5, marginTop: 9 }}>
          Reference ranges for testosterone differ between male and female biology. The lab needs this to analyse your sample correctly.
        </p>
      </div>

      {/* ---------- HEALTH-DATA PROCESSING CONSENT ----------
          Article 9(2)(a), captured here at the point of purchase so it is freely
          given as part of deciding to buy. Required to proceed to payment. Copy
          version-locked to HEALTH_PROCESSING_CONSENT_VERSION; approved CA-018
          (Ewa + Keith). Any wording change needs a new version string + a fresh
          CA record. The sentence below is byte-identical to the approved text. */}
      <label className="f-consent" htmlFor="healthConsent" style={{ marginTop: 22 }}>
        <input
          id="healthConsent"
          name="healthConsent"
          type="checkbox"
          checked={healthConsent}
          onChange={(event) => setHealthConsent(event.target.checked)}
          required
        />
        <span>
          <span className="f-flagchip" style={{ marginRight: 8, verticalAlign: 'middle' }}>Required</span>
          I consent to Andro Prime processing my health information, including my test
          results and the answers I provide, to run my test service and show me my
          results.{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            How we use your data
          </a>
          .
        </span>
      </label>

      {/* ---------- ERROR ----------
          One at a time, above the button, because the form returns on the first
          failure rather than validating everything and listing the results.
          Frame V2 flags that as a real behaviour to keep or change deliberately;
          it is kept, which is what makes this a restyle. */}
      {error && (
        <p className="f-err" role="alert">
          {error}
        </p>
      )}

      {/* ---------- SUBMIT ----------
          The label changes and no spinner appears. Frame V2: that is the whole
          motion budget this surface spends and the right place to spend it, since
          a label that says what is happening survives reduced motion where a
          spinner does not. `.f-btn:disabled` drops the ink fill rather than
          fading it, so the inactive state stays readable at 7.8:1. */}
      <button type="submit" disabled={loading} className="f-btn f-btn-block" style={{ marginTop: 26 }}>
        {loading ? 'Redirecting to checkout…' : 'Continue to payment'}
      </button>

      {/* Left-aligned, where the V2.0 page centred it. `.f-fine` carries a 66ch
          measure and this string is 78 characters, so it always wraps; centred,
          the second line lands as a short ragged tail under a full-width ink
          button. Frame V2 sets the same note left under the same button. No word
          changes. */}
      <p className="f-fine" style={{ marginTop: 12 }}>
        Next: secure payment, phone number, and delivery address on our payment provider.
      </p>
    </form>
  )
}
