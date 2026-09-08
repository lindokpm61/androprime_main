import { consentAction } from '@/lib/auth/actions'

/**
 * /auth/consent, rebuilt in Direction F on 2026-09-08 from
 * design/mockups/journey/auth-F.html Frame Y. Same split card as `AuthCard`,
 * its own page because it is a fifth mode with no email and no password.
 *
 * 🔴 THIS ROUTE IS NOT THE HEALTH-DATA CONSENT, AND ITS NAME SAYS OTHERWISE.
 * The stage inventory recorded it as "the one with compliance weight (health-data
 * processing, CA-018), its wording approved copy that the redesign must not
 * disturb". Frame Y checked and both halves are wrong: this page asks an age for
 * 18+ eligibility and offers a marketing opt-in. There is no Article 9(2)(a)
 * wording on it, no CA-018 sentence and nothing version-locked. The health-data
 * consent is on `/checkout/details`, gating payment.
 *
 * That does NOT make the copy free. It is still customer-facing, so it is carried
 * verbatim: the heading, the standfirst, the three pitch lines and the opt-in
 * sentence are the strings that ship.
 *
 * ✅ BOTH OPEN QUESTIONS ARE RULED (Keith, 2026-09-08). **The route keeps its
 * name**, misleading as it is: a rename buys nothing a reader can see and costs a
 * redirect plus every server action, middleware prefix and email link that points
 * here. The correction lives in this header and in STATE.md instead, so the next
 * reader is not misled the way the stage inventory was. And **`/auth/signup`'s
 * age field is now `required`**, with a server-side 18+ gate in `signupAction`
 * mirroring `consentAction`'s, so the same eligibility fact is enforced at all
 * three of its collection points rather than two.
 *
 * The marketing opt-in sentence is also word-for-word the one on `/auth/signup`.
 * Left duplicated rather than lifted into a shared constant, because the two are
 * separate consent moments and collapsing them would make a copy change to one
 * silently change the other.
 */

type ConsentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

const PITCH = ['18+ only', 'No spam, ever', 'Unsubscribe any time']

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const params = await searchParams
  const next = readParam(params.next)
  const error = readParam(params.error)

  return (
    <section className="f-wrap" style={{ paddingTop: 52, paddingBottom: 52 }}>
      <div className="f-tray">
        <div className="f-core" style={{ padding: 0 }}>
          <div className="f-auth">
            <div className="f-auth-pitch">
              <span className="f-eyebrow">One last step</span>
              <h1 className="f-h2" style={{ marginTop: 16 }}>A couple of quick questions</h1>
              <p className="f-sub" style={{ marginTop: 12, marginBottom: 20 }}>
                We need your age to confirm eligibility and want to know if you&rsquo;d like to
                receive updates from us.
              </p>
              <ul className="f-ticks">
                {PITCH.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="f-auth-form">
              {error ? (
                <div className="f-banner f-banner-err" role="alert">
                  <span className="f-banner-k">Error</span>
                  {error}
                </div>
              ) : null}

              <form action={consentAction}>
                {next ? <input type="hidden" name="next" value={next} /> : null}

                <label className="f-formrow">
                  <span className="f-blab">Age</span>
                  <input
                    className="f-inp"
                    name="age"
                    type="number"
                    min={18}
                    required
                    placeholder="18+ only"
                  />
                </label>

                <label className="f-consent">
                  <input name="marketingConsent" type="checkbox" />
                  <span>
                    I&rsquo;m happy to receive Andro Prime updates and educational emails.
                  </span>
                </label>

                <button type="submit" className="f-btn f-btn-block" style={{ marginTop: 20 }}>
                  Continue to Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
