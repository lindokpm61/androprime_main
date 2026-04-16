import type { Metadata } from 'next'
import Link from 'next/link'
import { TestSelectorQuiz } from '@/components/marketing/TestSelectorQuiz'

export const metadata: Metadata = {
  title: 'Find Your Test | Andro Prime',
  description: 'Answer three quick questions and get routed to the right Andro Prime test.',
}

export default function TestSelectorPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-7 flex flex-col items-start">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 border-2 border-black bg-white mb-8">
                    <span className="w-2 h-2 rounded-none bg-black"></span>
                    <span className="data-label !text-[10px] !text-black">Find your test</span>
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.85] mb-8">
                    Not sure which kit<br />
                    is right for you?
                </h1>
                
                <p className="text-xl md:text-2xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
                    Three questions. About 60 seconds. We route you to the best starting point based on symptoms, training load, and how clear or mixed the picture sounds.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
                    <a href="#selector" className="bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 rounded-none transition-all flex items-center justify-center gap-2">
                        Start the quiz
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                    <a href="#how-it-works" className="bg-white hover:bg-gray-100 border-4 border-black text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 rounded-none transition-all flex items-center justify-center">
                        How it works
                    </a>
                </div>

                <div className="flex items-center gap-2 data-label text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    UKAS ISO 15189 accredited lab. No GP needed. Results in 48 hours.
                </div>
            </div>

            <div className="lg:col-span-5">
                <div className="p-10 border-4 border-black bg-white relative">
                    <div className="absolute top-0 right-0 p-4 text-black font-sans font-black text-xl leading-none">?</div>
                    <div className="data-label flex items-center gap-2 mb-6 pb-4 border-b-2 border-black">
                        <span className="w-2 h-2 rounded-none bg-black animate-pulse"></span>
                        Selector Logic
                    </div>
                    <p className="text-lg font-serif leading-relaxed text-black">
                        Hormone-led symptoms tend toward <strong className="font-sans font-black uppercase tracking-tight">Kit 1</strong>. Recovery, inflammation, and training-load issues tend toward <strong className="font-sans font-black uppercase tracking-tight">Kit 2</strong>. If the picture is mixed or you want the broadest starting point, the selector defaults upward to <strong className="font-sans font-black uppercase tracking-tight">Kit 3</strong>.
                    </p>
                </div>
            </div>
            
        </div>
      </section>

      {/* QUIZ */}
      <section id="selector" className="py-32 bg-gray-50 border-b-4 border-black relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <TestSelectorQuiz />
        </div>
      </section>

      {/* ROUTING SUMMARY */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 border-b-4 border-black pb-8">
                <div className="data-label mb-6">Routing Summary</div>
                <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter leading-none text-black">
                    The selector is built<br />to remove guesswork.
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border-2 border-black p-8 bg-white hover:bg-gray-50 transition-colors">
                    <div className="data-label text-black mb-6 pb-4 border-b-2 border-black inline-block">Kit 1</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Hormone Baseline</h3>
                    <p className="text-black font-serif text-lg leading-relaxed">Best first step when the story sounds explicitly hormone-led (drive, motivation, specific fatigue).</p>
                </div>
                
                <div className="border-2 border-black p-8 bg-white hover:bg-gray-50 transition-colors">
                    <div className="data-label text-black mb-6 pb-4 border-b-2 border-black inline-block">Kit 2</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Energy &amp; Recovery</h3>
                    <p className="text-black font-serif text-lg leading-relaxed">Best first step when recovery, joint inflammation, or systemic deficiency looks more likely than hormones.</p>
                </div>
                
                <div className="border-4 border-black p-8 bg-gray-50 relative">
                    <div className="absolute top-0 right-8 -mt-3 px-3 py-1 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest border-2 border-black">Default Route</div>
                    <div className="data-label text-black mb-6 pb-4 border-b-4 border-black inline-block">Kit 3</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter mb-4">Complete Axis</h3>
                    <p className="text-black font-serif text-lg leading-relaxed">Default when the picture is mixed or when you want the complete picture covering both domains in one go.</p>
                </div>
            </div>
        </div>
      </section>

      {/* HOW IT WORKS / METHODOLOGY STRIP */}
      <section id="how-it-works" className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="data-label flex items-center justify-center gap-4 mb-6">
                    <span className="w-12 h-[2px] bg-black"></span>
                    Methodology
                    <span className="w-12 h-[2px] bg-black"></span>
                </div>
                <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Order. Sample.<br />Post. Done.</h2>
                <p className="text-black font-serif text-xl leading-relaxed">Once you know which test to start with, the process is simple and completely managed from home.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[4px] bg-black -translate-y-1/2 z-0"></div>

                <div className="bg-white border-4 border-black p-10 relative z-10 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-8 -mr-4">1</div>
                    <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">01</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 relative z-20">Order Kit</h3>
                    <p className="text-black font-serif text-base leading-relaxed relative z-20">Choose the right kit and get it sent out quickly via tracked delivery in discreet packaging.</p>
                    <div className="mt-8 pt-6 border-t-2 border-black data-label flex justify-between relative z-20">
                        <span>Action</span>
                        <span className="text-black font-black">User</span>
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-10 relative z-10 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-8 -mr-4">2</div>
                    <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">02</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 relative z-20">Collect Sample</h3>
                    <p className="text-black font-serif text-base leading-relaxed relative z-20">Simple, painless finger-prick collection at home. Best performed fasted early morning.</p>
                    <div className="mt-8 pt-6 border-t-2 border-black data-label flex justify-between relative z-20">
                        <span>Time required</span>
                        <span className="text-black font-black">5 Mins</span>
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-10 relative z-10 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-gray-100 leading-none select-none pointer-events-none -mt-8 -mr-4">3</div>
                    <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">03</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 relative z-20">Post Return</h3>
                    <p className="text-black font-serif text-base leading-relaxed relative z-20">Seal sample in the provided medical transport vial and drop it in any priority postbox.</p>
                    <div className="mt-8 pt-6 border-t-2 border-black data-label flex justify-between relative z-20">
                        <span>Transit</span>
                        <span className="text-black font-black">Tracked 24</span>
                    </div>
                </div>

                <div className="bg-black border-4 border-black p-10 relative z-10 transition-transform duration-300">
                    <div className="absolute top-0 right-0 p-4 text-[150px] font-sans font-black text-gray-900 leading-none select-none pointer-events-none -mt-8 -mr-4">4</div>
                    <div className="w-12 h-12 rounded-none bg-white text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 shadow-none">04</div>
                    <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-white mb-4 relative z-20">Understand</h3>
                    <p className="text-gray-300 font-serif text-base leading-relaxed relative z-20">Get results in plain English within 48h, with a specific next recommendation based on data.</p>
                    <div className="mt-8 pt-6 border-t-2 border-gray-800 data-label flex justify-between relative z-20">
                        <span className="text-gray-400">Status</span>
                        <span className="text-white font-black">System Ready</span>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </>
  )
}
