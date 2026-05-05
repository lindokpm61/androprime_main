import Link from 'next/link'
import { OAuthButtons } from '@/components/auth/OAuthButtons'

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
          <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-white/20 mb-8">
            <span className="w-2 h-2 bg-white" />
            <span className="data-label !text-white/60 !text-[10px]">Andro Prime</span>
          </div>
          <h1 className="max-w-xl font-sans font-black text-4xl uppercase tracking-tighter leading-[0.9] sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300 font-serif">
            {description}
          </p>
          <div className="mt-12 space-y-4 border-t-2 border-white/10 pt-10">
            {[
              'Results in your private dashboard',
              'EU data hosting — GDPR compliant',
              'GMC-registered doctor review',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="text-white shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="data-label !text-white/70">{item}</span>
              </div>
            ))}
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

          {mode !== 'reset' ? (
            <>
              <OAuthButtons nextPath={nextPath} />
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-black/20" />
                <span className="data-label text-xs text-black/40">OR</span>
                <div className="h-px flex-1 bg-black/20" />
              </div>
            </>
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
