import Link from 'next/link'

type AuthMode = 'login' | 'signup' | 'reset'

type AuthCardProps = {
  mode: AuthMode
  title: string
  description: string
  action: (formData: FormData) => Promise<void>
  message?: string
  error?: string
  nextPath?: string
}

export function AuthCard({
  mode,
  title,
  description,
  action,
  message,
  error,
  nextPath,
}: AuthCardProps) {
  return (
    <section className="min-h-screen bg-gray-100 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-4 border-black bg-black p-8 text-white sm:p-12">
          <p className="data-label mb-6 text-white">Phase 4 Auth Foundation</p>
          <h1 className="max-w-xl text-4xl uppercase tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-200">
            {description}
          </p>
          <div className="mt-10 space-y-4 text-sm uppercase tracking-[0.18em] text-gray-300">
            <p>EU-hosted data foundation</p>
            <p>Protected biomarker access</p>
            <p>Supabase session-based routing</p>
          </div>
        </div>

        <div className="border-4 border-black bg-white p-8 sm:p-10">
          {message ? (
            <div className="mb-6 border-2 border-black bg-gray-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-900">
              {error}
            </div>
          ) : null}

          <form action={action} className="space-y-5">
            {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

            <label className="block">
              <span className="data-label mb-2 block">Email</span>
              <input
                name="email"
                type="email"
                required
                className="w-full border-2 border-black bg-white px-4 py-3 font-sans text-sm font-semibold text-black outline-none transition focus:bg-gray-100"
                placeholder="you@andro-prime.com"
              />
            </label>

            {mode !== 'reset' ? (
              <label className="block">
                <span className="data-label mb-2 block">Password</span>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  className="w-full border-2 border-black bg-white px-4 py-3 font-sans text-sm font-semibold text-black outline-none transition focus:bg-gray-100"
                  placeholder="Minimum 8 characters"
                />
              </label>
            ) : null}

            {mode === 'signup' ? (
              <>
                <label className="block">
                  <span className="data-label mb-2 block">Age</span>
                  <input
                    name="age"
                    type="number"
                    min={18}
                    className="w-full border-2 border-black bg-white px-4 py-3 font-sans text-sm font-semibold text-black outline-none transition focus:bg-gray-100"
                    placeholder="18+ only"
                  />
                </label>

                <label className="flex items-start gap-3 border-2 border-black px-4 py-4">
                  <input
                    name="marketingConsent"
                    type="checkbox"
                    className="mt-1 h-4 w-4 border-2 border-black"
                  />
                  <span className="text-sm leading-relaxed text-black">
                    I’m happy to receive Andro Prime updates and educational emails.
                  </span>
                </label>
              </>
            ) : null}

            <button
              type="submit"
              className="w-full border-2 border-black bg-black px-5 py-3 font-sans text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              {mode === 'login'
                ? 'Log In'
                : mode === 'signup'
                  ? 'Create Account'
                  : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold uppercase tracking-wide">
            {mode !== 'login' ? (
              <Link href="/auth/login" className="underline">
                Log in
              </Link>
            ) : null}
            {mode !== 'signup' ? (
              <Link href="/auth/signup" className="underline">
                Create account
              </Link>
            ) : null}
            {mode !== 'reset' ? (
              <Link href="/auth/reset" className="underline">
                Reset password
              </Link>
            ) : null}
            <Link href="/" className="underline">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
