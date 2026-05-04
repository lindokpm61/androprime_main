import { consentAction } from '@/lib/auth/actions'

type ConsentPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ConsentPage({ searchParams }: ConsentPageProps) {
  const params = await searchParams
  const next = readParam(params.next)
  const error = readParam(params.error)

  return (
    <section className="min-h-screen bg-gray-100 px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-4 border-black bg-black p-8 text-white sm:p-12">
          <p className="data-label mb-6 text-white">One last step</p>
          <h1 className="max-w-xl text-4xl uppercase tracking-tight sm:text-6xl">
            A couple of quick questions
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-200">
            We need your age to confirm eligibility and want to know if you'd like to receive updates from us.
          </p>
          <div className="mt-10 space-y-4 text-sm uppercase tracking-[0.18em] text-gray-300">
            <p>18+ only</p>
            <p>No spam — ever</p>
            <p>Unsubscribe any time</p>
          </div>
        </div>

        <div className="border-4 border-black bg-white p-8 sm:p-10">
          {error ? (
            <div className="mb-6 border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold uppercase tracking-wide text-red-900">
              {error}
            </div>
          ) : null}

          <form action={consentAction} className="space-y-5">
            {next ? <input type="hidden" name="next" value={next} /> : null}

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
                I'm happy to receive Andro Prime updates and educational emails.
              </span>
            </label>

            <button
              type="submit"
              className="w-full border-2 border-black bg-black px-5 py-3 font-sans text-sm font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              Continue to Dashboard
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
