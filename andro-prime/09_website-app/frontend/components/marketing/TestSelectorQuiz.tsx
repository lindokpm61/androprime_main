'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PRICING } from '@/lib/pricing'

interface QuizResult {
  kit: 'kit1' | 'kit2' | 'kit3'
  title: string
  href: string
  price: string
  reason: string
  label: string
}

const RESULTS: Record<string, QuizResult> = {
  kit1: {
    kit: 'kit1',
    label: 'Kit 1',
    title: 'Start with the Testosterone Health Check.',
    href: '/kits/testosterone',
    price: `£${PRICING.KIT_1.rrp}`,
    reason: 'Your answers point most strongly at hormonal health. Kit 1 tests Total T, SHBG, and Free Testosterone so you can see not just what your level is, but how much of that testosterone your body can actually use.',
  },
  kit2: {
    kit: 'kit2',
    label: 'Kit 2',
    title: 'Start with the Energy and Recovery Check.',
    href: '/kits/energy-recovery',
    price: `£${PRICING.KIT_2.rrp}`,
    reason: 'Your answers point toward recovery, inflammation, and common deficiencies. Kit 2 tests Vitamin D, Active B12, hs-CRP, and Ferritin.',
  },
  kit3: {
    kit: 'kit3',
    label: 'Kit 3',
    title: 'Get the complete picture with Hormone & Recovery.',
    href: '/kits/hormone-recovery',
    price: `£${PRICING.KIT_3.rrp}`,
    reason: 'Your picture is broad or mixed enough that the full panel is the right call. Kit 3 combines hormone markers with the energy and recovery panel in one test.',
  },
}

function getResult(q1: string, q2: string, q3: string): QuizResult {
  if (q1 === 'c' || q3 === 'c') return RESULTS.kit3
  if (q1 === 'a' && q2 === 'b' && q3 === 'b') return RESULTS.kit1
  if (q1 === 'a' && q3 === 'b') return RESULTS.kit1
  if (q1 === 'b' && q2 === 'a') return RESULTS.kit2
  if (q1 === 'b' && q3 === 'a') return RESULTS.kit2
  return RESULTS.kit3
}

export function TestSelectorQuiz() {
  const [step, setStep] = useState(1)
  const [q1, setQ1] = useState('')
  const [q2, setQ2] = useState('')
  const [q3, setQ3] = useState('')

  const handleQ1 = (val: string) => {
    setQ1(val)
    setStep(2)
  }
  const handleQ2 = (val: string) => {
    setQ2(val)
    setStep(3)
  }
  const handleQ3 = (val: string) => {
    setQ3(val)
    setStep(4)
  }
  const reset = () => {
    setQ1(''); setQ2(''); setQ3('')
    setStep(1)
  }

  const result = step === 4 ? getResult(q1, q2, q3) : null
  const progressPercent = (step / 3) * 100

  return (
    <div id="quiz-card" className="bg-white border-4 border-black p-8 md:p-16">
      
      {/* Progress Bar Header */}
      {step < 4 && (
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12 pb-8 border-b-4 border-black">
          <span className="data-label text-sm shrink-0 w-40">Question {step} of 3</span>
          <div className="flex-grow h-3 bg-gray-200 border-2 border-black relative w-full">
              <div 
                className="absolute top-0 left-0 h-full bg-black transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              ></div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">What is your main reason for testing?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ1('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">I am knackered, my drive has gone, or I just do not feel like myself anymore.</span>
                </button>
                <button type="button" onClick={() => handleQ1('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">I am training hard but not recovering like I used to. Tired, sore, or running on empty.</span>
                </button>
                <button type="button" onClick={() => handleQ1('c')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option C</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">No specific complaint. I just want to know where I stand.</span>
                </button>
            </div>
        </div>
      )}

      {step === 2 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">Are you physically active?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ2('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I train regularly.</span>
                </button>
                <button type="button" onClick={() => handleQ2('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Not much. Mostly desk-based and not training consistently.</span>
                </button>
            </div>
        </div>
      )}

      {step === 3 && (
        <div className="quiz-step is-active animate-[fadeIn_0.4s_ease-out_forwards]">
            <h2 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tighter mb-10 leading-[0.9]">Have you had blood tests like this before?</h2>
            <div className="grid gap-4">
                <button type="button" onClick={() => handleQ3('a')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option A</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Not in years, or never.</span>
                </button>
                <button type="button" onClick={() => handleQ3('b')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option B</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I have had testosterone tested and it came back borderline or low.</span>
                </button>
                <button type="button" onClick={() => handleQ3('c')} className="quiz-option group w-full text-left p-6 md:p-8 border-2 border-black bg-white hover:bg-black transition-colors">
                    <span className="block data-label text-gray-500 group-hover:text-gray-400 mb-3">Option C</span>
                    <span className="block text-xl font-serif text-black group-hover:text-white transition-colors">Yes. I have had general health bloods done but nothing specific.</span>
                </button>
            </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="result-card is-active animate-[slideUp_0.5s_ease-out_forwards]">
            <div className="data-label mb-8 flex items-center gap-4">
                <span className="w-12 h-[2px] bg-black"></span>
                Your Result
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-4 border-black pb-8">
                <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 border-black font-sans font-black uppercase text-xs tracking-widest mb-4 ${result.kit === 'kit3' ? 'bg-black text-white' : 'text-black'}`}>
                        <span className={`w-2 h-2 rounded-none ${result.kit === 'kit3' ? 'bg-white' : 'bg-black'}`}></span> {result.label}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-[0.9]">{result.title}</h2>
                </div>
                <div className="text-5xl font-sans font-black text-black shrink-0">{result.price}</div>
            </div>
            
            <p className="text-xl font-serif text-black mb-12 leading-relaxed">
                {result.reason}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href={result.href} className="bg-black text-white hover:bg-white hover:text-black border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                  Order {result.label}
                </Link>
                {result.kit !== 'kit3' ? (
                  <Link href="/kits/hormone-recovery" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                    Or get full picture (Kit 3)
                  </Link>
                ) : (
                  <Link href="/kits/hormone-recovery" className="bg-white text-black hover:bg-gray-100 border-4 border-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 text-center transition-colors">
                    Read more about Kit 3
                  </Link>
                )}
            </div>
            
            <button type="button" onClick={reset} className="data-label text-gray-500 hover:text-black transition-colors underline">Retake the quiz</button>
        </div>
      )}
    </div>
  )
}
