import Link from 'next/link'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

/**
 * THE AUTH CARD, rebuilt in Direction F on 2026-09-08 from
 * design/mockups/journey/auth-F.html Frames X, X2 and X3.
 *
 * ONE COMPONENT, FOUR ROUTES. `/auth/login`, `/auth/signup`, `/auth/reset` and
 * `/auth/link` are 25-line wrappers around this file, passing a title, a
 * standfirst and a server action. Frame X2 enumerates what changes between the
 * modes and it is FIVE THINGS, no more: the heading, the standfirst, which
 * fields render, the submit label, and which cross-links appear (each mode hides
 * its own). Nothing else may vary, and the switches below are written so that a
 * new mode has exactly five places to touch.
 *
 * COPY CARRIED VERBATIM. Every string here is the one that shipped, including
 * the marketing opt-in sentence and the four cross-link labels. The titles and
 * standfirsts arrive as props from the route files and are untouched.
 *
 * BEHAVIOUR CARRIED VERBATIM, and one piece of it is deliberately left wrong.
 * ⚠ The signup `age` field has `min={18}` and NO `required` attribute, while
 * `/auth/consent` and `/checkout/details` both make the same 18+ fact mandatory.
 * Frame X2 flags it and hands it to Keith as a behaviour question, so it is
 * reproduced exactly as it ships rather than quietly fixed inside a restyle:
 * adding one word here would change who can create an account, which is not a
 * redesign's call. See STATE.md.
 *
 * 🔴 THE PITCH PANEL WAS INK AND IS NOW LIGHT. See the auth block in
 * f-primitives.css for the reasoning: the inverted panel is spent once per page
 * on a conformity statement, and a dark half inside a `.f-core` inverts the
 * tray → core depth ladder. Frame X draws both halves light.
 */

type AuthMode = 'login' | 'signup' | 'reset' | 'link'

type AuthCardProps = {
  mode: AuthMode
  title: string
  description: string
  action: (formData: FormData) => Promise<void>
  message?: string
  error?: string
  nextPath?: string
}

/* THE PITCH LIST. Three claims, unchanged from what ships. They are here rather
   than in the four route files because all four modes show the same three: it is
   a statement about the product, not about the mode. */
const PITCH = [
  'Results in your private dashboard',
  'EU data hosting: GDPR compliant',
  'GP-set ranges and explanations',
]

/* The submit label, one of Frame X2's five differences. */
const SUBMIT: Record<AuthMode, string> = {
  login: 'Log In',
  signup: 'Create Account',
  reset: 'Send Reset Link',
  link: 'Email me a sign-in link',
}

/* The cross-links, and each mode hides its own. Written as data so "each mode
   hides its own" is one filter rather than four hand-maintained conditionals,
   which is how the set drifts. "Back to site" has no mode and always renders. */
const XLINKS: { mode?: AuthMode; href: string; label: string }[] = [
  { mode: 'login', href: '/auth/login', label: 'Log in' },
  { mode: 'signup', href: '/auth/signup', label: 'Create account' },
  { mode: 'reset', href: '/auth/reset', label: 'Reset password' },
  { mode: 'link', href: '/auth/link', label: 'Email me a sign-in link' },
  { href: '/', label: 'Back to site' },
]

export function AuthCard({
  mode,
  title,
  description,
  action,
  message,
  error,
  nextPath,
}: AuthCardProps) {
  // Which fields render: Frame X2's third difference. Password and the OAuth
  // block are for the two modes that actually authenticate; reset and link only
  // ever need an address to send to.
  const wantsPassword = mode !== 'reset' && mode !== 'link'

  return (
    <section className="f-wrap" style={{ paddingTop: 52, paddingBottom: 52 }}>
      <div className="f-tray">
        {/* padding 0, so the two halves run to the card's own edges and the
            divider is the full height of it. `.f-core` already clips, which is
            what keeps the panels inside the 22px radius. */}
        <div className="f-core" style={{ padding: 0 }}>
          <div className="f-auth">
            <div className="f-auth-pitch">
              <span className="f-eyebrow">Andro Prime</span>
              <h1 className="f-h2" style={{ marginTop: 16 }}>{title}</h1>
              <p className="f-sub" style={{ marginTop: 12, marginBottom: 20 }}>{description}</p>
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
              {/* Both banner strings arrive in the URL from whichever server
                  action redirected here, so the text is not this component's and
                  there is no fixed list of it. See lib/auth/actions.ts. */}
              {message ? <div className="f-banner f-banner-msg">{message}</div> : null}

              {error ? (
                <div className="f-banner f-banner-err" role="alert">
                  <span className="f-banner-k">Error</span>
                  {error}
                </div>
              ) : null}

              {wantsPassword ? (
                <>
                  <OAuthButtons nextPath={nextPath} />
                  <div className="f-or">or</div>
                </>
              ) : null}

              <form action={action}>
                {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

                <label className="f-formrow">
                  <span className="f-blab">Email</span>
                  <input
                    className="f-inp"
                    name="email"
                    type="email"
                    required
                    placeholder="you@andro-prime.com"
                  />
                </label>

                {wantsPassword ? (
                  <label className="f-formrow">
                    <span className="f-blab">Password</span>
                    <input
                      className="f-inp"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      placeholder="Minimum 8 characters"
                    />
                  </label>
                ) : null}

                {mode === 'signup' ? (
                  <>
                    <label className="f-formrow">
                      <span className="f-blab">Age</span>
                      {/* ⚠ NO `required`, and that is what ships. See the note at
                          the top of this file: it is Keith's call, not a
                          restyle's. */}
                      <input
                        className="f-inp"
                        name="age"
                        type="number"
                        min={18}
                        placeholder="18+ only"
                      />
                    </label>

                    <label className="f-consent">
                      <input name="marketingConsent" type="checkbox" />
                      <span>
                        I&rsquo;m happy to receive Andro Prime updates and educational emails.
                      </span>
                    </label>
                  </>
                ) : null}

                <button type="submit" className="f-btn f-btn-block" style={{ marginTop: 20 }}>
                  {SUBMIT[mode]}
                </button>
              </form>

              <div className="f-xlinks">
                {XLINKS.filter((l) => l.mode !== mode).map((l) => (
                  <Link key={l.href} href={l.href} className="f-kchip">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
