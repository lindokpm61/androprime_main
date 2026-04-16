import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionEyebrow } from '@/components/marketing/SectionEyebrow'
import PullQuote from '@/components/marketing/PullQuote'

export const metadata: Metadata = {
  title: "The Myth of the 'Normal' Range | Andro Prime",
  description:
    "Laboratory reference ranges for testosterone are derived from a cross-section of the population, not an optimised cohort. Here is why falling within the range doesn't mean you're functioning optimally.",
}

export default function MythOfNormalRangePage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <header className="pt-32 pb-20 border-b-4 border-black bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2"><span className="w-2 h-2 bg-black" /> Endocrinology</div>
            <div className="data-label px-3 py-1.5 border-2 border-black bg-gray-50 flex items-center gap-2">8 Min Read</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
            The Myth of the &lsquo;Normal&rsquo; Range: Why Reference Intervals Are Failing Men
          </h1>
          <p className="text-xl md:text-2xl text-black font-serif leading-relaxed max-w-3xl">
            Laboratory reference ranges for testosterone are derived from a cross-section of the population, not an optimised cohort. Here is why falling within the range doesn&rsquo;t mean you&rsquo;re functioning optimally.
          </p>
          <div className="flex items-center gap-4 mt-10 pt-8 border-t-2 border-black">
            <div className="w-12 h-12 border-2 border-black bg-black text-white flex items-center justify-center font-sans font-black text-lg">KA</div>
            <div>
              <strong className="font-sans font-black text-sm uppercase tracking-widest">Keith Anthony</strong>
              <div className="font-serif text-xs text-gray-600 mt-0.5">12 October 2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE BODY */}
      <article className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="prose prose-lg font-serif text-black leading-relaxed space-y-8">
            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mt-16 mb-6">
              What &ldquo;normal&rdquo; actually means
            </h2>
            <p>
              The reference range used by most UK laboratories for testosterone in adult men is approximately <strong>8.64&ndash;29 nmol/L</strong>. This range was not defined by identifying the levels at which men feel and perform optimally. It was established through a statistical methodology called <strong>percentile-based sampling</strong>.
            </p>
            <p>
              In practice, this means the laboratory took blood samples from a broad cross-section of male participants — ranging in age from 18 to 70+, varying significantly in fitness, body composition, metabolic health, and lifestyle — and applied a <strong>2.5th to 97.5th percentile distribution</strong> to define the &ldquo;normal&rdquo; range.
            </p>
            <p>
              The purpose of this methodology is to capture the range within which &ldquo;most people&rdquo; fall. It is explicitly designed to identify clinical outliers — those who fall below or above the statistical normal — not to assess quality of function. In short: it answers the question &ldquo;are you ill?&rdquo; — not &ldquo;are you well?&rdquo;
            </p>

            <div className="p-8 border-2 border-black bg-gray-50 my-12">
              <div className="data-label mb-4">The Statistical Reality</div>
              <p className="font-serif text-base mb-6">The NHS range of 8.64 to 29 nmol/L spans a 236% difference between the low end and the high end. Two men — one at 9 nmol/L and one at 25 nmol/L — both receive the same result: &ldquo;within normal range.&rdquo;</p>
              <p className="font-serif text-base">Clinically, they are not the same. The man at 9 nmol/L is likely to present with fatigue, loss of libido, slower recovery, and impaired mood. The man at 25 nmol/L is unlikely to report any of these symptoms. Yet both are categorised as &ldquo;normal.&rdquo;</p>
            </div>

            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mt-16 mb-6">
              Why the range is so wide
            </h2>
            <p>
              Population-based reference intervals are inherently broad because they are designed to accommodate biological diversity. A 22-year-old ultra-endurance athlete and a 65-year-old sedentary male with metabolic syndrome can both fall within the &ldquo;normal&rdquo; range. Their biological context, however, is entirely different.
            </p>
            <p>
              The reference population used to define testosterone ranges typically includes men across a wide age stratification. Testosterone levels in men peak in the early 20s and decline by approximately <strong>1&ndash;2% per year</strong> from the age of 30. By 45, the average man has lost 15&ndash;30% of his peak testosterone. By 60, more than 40%.
            </p>

            <PullQuote>
              Including older men with naturally declining testosterone in the reference population mechanistically lowers the boundary of what is considered &ldquo;normal.&rdquo;
            </PullQuote>

            <p>
              Additionally, the rise in obesity across Western populations over the past 30 years has had a demonstrated effect on testosterone levels. Adipose tissue contains the enzyme <strong>aromatase</strong>, which converts testosterone to estradiol. Higher body fat percentages directly correlate with lower testosterone levels.
            </p>
            <p>
              This is not a theoretical concern. Obesity prevalence in the UK has nearly tripled since 1980. A reference population sampled today will include a significantly higher proportion of obese men than one sampled in 1990 — meaning the &ldquo;normal&rdquo; range itself has likely shifted downward.
            </p>

            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mt-16 mb-6">
              The clinical threshold vs. the optimal range
            </h2>
            <p>
              The NHS clinical threshold for diagnosing testosterone deficiency (hypogonadism) is generally accepted at around <strong>8 nmol/L</strong>. Below this level, most GPs will consider referral to endocrinology and potential treatment with testosterone replacement therapy (TRT).
            </p>
            <p>
              Between 8 and 12 nmol/L, the guidance is less clear. Some clinicians will investigate further; others will conclude the result is &ldquo;borderline normal&rdquo; and advise lifestyle changes. Above 12 nmol/L, the overwhelming majority of GPs will categorise the result as normal and take no further action — regardless of symptoms.
            </p>
            <p>
              This protocol is clinically defensible. It is designed to identify men who are medically ill, not men who are functionally suboptimal. The problem is that it creates a substantial population of men — those sitting between 8 and 18 nmol/L — who are symptomatic but considered clinically &ldquo;fine.&rdquo;
            </p>

            <div className="p-8 bg-black text-white my-12">
              <div className="data-label text-gray-400 mb-4">
                Published evidence
              </div>
              <p className="font-serif text-base text-gray-300 mb-6">
                A 2010 study published in the <em>Journal of Clinical Endocrinology &amp; Metabolism</em> examined testosterone levels and symptom prevalence in a cohort of 3,369 men aged 40 to 79. The study found that the probability of experiencing three or more classic hypogonadal symptoms — including fatigue, low libido, and erectile dysfunction — increased significantly at testosterone levels below 11 nmol/L.
              </p>
              <p className="font-serif text-base text-gray-300">
                Critically, this threshold is substantially above the NHS referral threshold of 8 nmol/L. Men with levels between 8 and 11 nmol/L were statistically far more likely to report symptoms than men with levels above 15 nmol/L — yet they would not be considered candidates for treatment under current NHS guidelines.
              </p>
              <div className="mt-6 pt-4 border-t border-gray-700 font-mono text-xs text-gray-500">
                Source: Wu et al. (2010). &ldquo;Identification of Late-Onset Hypogonadism.&rdquo; JCEM.
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mt-16 mb-6">
              What this means in practice
            </h2>
            <p>
              A man who feels materially worse than he did five years ago — who is fatigued despite adequate sleep, who has lost interest in sex, who recovers slowly from training, whose mood is flat and motivation is absent — goes to his GP and requests a testosterone test.
            </p>
            <p>
              If the test comes back at 10 nmol/L, his result is classified as <strong>normal</strong>. His GP tells him so. He is given no further investigation, no context for where he sits within the range, and no indication that his level — while technically not deficient — is in the lowest quintile of the male population and consistent with the symptom profile he presented.
            </p>
            <p>
              This is not a failure of the GP. It is a failure of the framework. The reference range was built to answer a binary question: <em>is this man clinically deficient?</em> It was not built to answer: <em>is this man functioning at a level consistent with his age, activity level, and expectations?</em>
            </p>

            <PullQuote>
              &ldquo;Normal&rdquo; is a laboratory classification. It is not a synonym for &ldquo;good.&rdquo;
            </PullQuote>

            <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mt-16 mb-6">
              What Andro Prime does differently
            </h2>
            <p>
              Andro Prime tests testosterone (Total T, SHBG, and Free T) through a UKAS ISO 15189-accredited laboratory — the same accreditation standard used by NHS Labs. The analytical quality is identical.
            </p>
            <p>
              The difference is interpretation.
            </p>
            <p>
              Where the NHS returns a result as &ldquo;within normal limits,&rdquo; Andro Prime tells you exactly where in the range you sit, what that level typically means for a man of your age, and what — if anything — you should do about it.
            </p>
            <p>
              If your result indicates a deficiency, we make a specific supplement recommendation, backed by EFSA-approved health claims. If it suggests you should be seen by a GP, we tell you that directly. And if your results are fine, we tell you that too.
            </p>
            <p>
              We do not diagnose conditions. We do not prescribe medication. We provide clinical-grade testing with contextual interpretation — the thing the NHS system is not structured to do inside an eight-minute appointment.
            </p>
          </div>
        </div>
      </article>

      {/* CTA BAR */}
      <section className="py-16 bg-black text-white border-t-4 border-black">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-sans font-black uppercase tracking-tighter mb-6">Find out where you actually stand.</h2>
          <p className="font-serif text-lg text-gray-300 mb-8 max-w-2xl mx-auto">£29 to £69. Five minutes. Results in 48 hours with plain-English interpretation from a GMC-registered GP.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#tests" className="bg-white text-black hover:bg-gray-100 font-sans font-black uppercase tracking-widest text-sm px-10 py-4 border-2 border-white transition-colors">Choose your test</Link>
            <Link href="/test-selector" className="border-2 border-white text-white hover:bg-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-10 py-4 transition-colors">Take the quiz</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
