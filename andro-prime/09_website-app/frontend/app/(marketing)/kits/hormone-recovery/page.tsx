import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hormone & Recovery Check — Kit 3',
  description: 'The most complete at-home blood test for men. All 9 markers: full testosterone panel plus energy, recovery, and inflammation. £69.',
}

export default function KitHormoneRecoveryPage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-none border-2 border-black bg-white mb-8">
              <span className="w-2 h-2 rounded-none bg-black"></span>
              <span className="data-label !text-[10px] !text-black">DATA FIRST</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[85px] font-sans font-black text-black uppercase tracking-tighter leading-[0.9] mb-8">
              Nine numbers every man over 40 should know.
            </h1>

            <p className="text-lg md:text-xl text-black font-serif mb-12 max-w-2xl leading-relaxed">
              Hormones, energy, recovery, and inflammation. One test. Nine biomarkers. The full picture of what&apos;s actually going on inside your body, with a specific recommendation based on your data.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto mb-12">
              <Link href="#order" className="w-full sm:w-auto bg-black hover:bg-white border-4 border-black text-white hover:text-black font-sans font-black uppercase tracking-widest text-sm px-8 py-5 rounded-none transition-all flex items-center justify-center gap-3">
                Order the Kit &mdash; &pound;69
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </Link>
              <div className="data-label flex items-center gap-2 bg-gray-100 px-4 py-2 border-2 border-black">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Most complete
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 data-label border-t-2 border-black pt-6 w-full">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                UKAS ISO 15189 Accredited Lab
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Free UK Delivery
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                GMC-Registered Doctor
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="glass-panel p-8 relative bg-gray-50 aspect-square flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-black -ml-1 -mt-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-black -mr-1 -mt-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-black -ml-1 -mb-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-black -mr-1 -mb-1"></div>

              <div className="flex justify-between items-start">
                <div className="data-label text-black">KIT.ID // 003</div>
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="square"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
              </div>

              <div className="text-center">
                <div className="text-7xl font-sans font-black uppercase tracking-tighter text-black mb-2">KIT 3</div>
                <div className="font-sans font-bold uppercase tracking-widest text-lg">Hormone &amp; Recovery</div>
              </div>

              <div className="space-y-2 border-t-2 border-black pt-4">
                <div className="flex justify-between items-center">
                  <span className="data-label">Biomarkers</span>
                  <span className="data-value">9</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="data-label">Turnaround</span>
                  <span className="data-value">48H</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="data-label">Method</span>
                  <span className="data-value">Finger-Prick</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE REALITY */}
      <section className="py-24 border-y-4 border-black bg-black text-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="data-label flex items-center justify-center gap-4 mb-8">
            <span className="w-12 h-[2px] bg-white"></span>
            THE REALITY
            <span className="w-12 h-[2px] bg-white"></span>
          </div>
          <h2 className="text-5xl md:text-7xl font-sans font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            You don&apos;t know what you don&apos;t know.
          </h2>
          <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-300">
            Maybe it&apos;s your testosterone. Maybe it&apos;s your vitamin D. Maybe it&apos;s inflammation you can&apos;t feel yet. Maybe it&apos;s all three. You can spend months guessing, or you can find out in 48 hours. This kit tests the nine markers that matter most for how you feel, recover, and perform. Not 30 markers you&apos;ll never use. Just the ones that actually move the needle.
          </p>
        </div>
      </section>

      {/* 3. BIOMARKERS */}
      <section className="py-32 bg-gray-50" id="biomarkers">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 md:flex justify-between items-end">
            <div className="max-w-2xl">
              <div className="data-label flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-black"></span>
                THE DATA
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black uppercase tracking-tighter text-black leading-[0.9] mb-6">
                Everything Kit 1 and Kit 2 test. In one kit.
              </h2>
              <p className="text-xl font-serif leading-relaxed text-black">
                Nine biomarkers across hormones, energy, and recovery. Each one tells you something specific about what your body is doing.
              </p>
            </div>
            <div className="mt-8 md:mt-0 data-label border-2 border-black px-4 py-2 bg-white inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-black status-dot-pulse"></span>
              ANALYSIS PROTOCOL ACTIVE
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">01</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Total Testosterone</h3>
              <p className="text-black font-serif leading-relaxed">The total amount of testosterone in your blood. Your baseline. If this is low, everything else &mdash; energy, mood, drive &mdash; takes a hit.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">02</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">SHBG</h3>
              <p className="text-black font-serif leading-relaxed">Sex Hormone Binding Globulin. It binds to testosterone and makes it unusable. High SHBG means your total T might look fine on paper while you still feel terrible.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">03</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Free Androgen Index</h3>
              <p className="text-black font-serif leading-relaxed">The ratio of total testosterone to SHBG. A more sensitive indicator of testosterone availability than Total T alone &mdash; particularly useful when SHBG is high or shifting.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">04</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Albumin</h3>
              <p className="text-black font-serif leading-relaxed">The main carrier protein in your blood. Testing albumin allows accurate calculation of Free Testosterone &mdash; without it, the number is an estimate.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">05</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Free Testosterone</h3>
              <p className="text-black font-serif leading-relaxed">The testosterone your body can actually use. Calculated from your Total T, SHBG, and Albumin. This is the number that matters most for how you feel day to day.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">06</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Vitamin D</h3>
              <p className="text-black font-serif leading-relaxed">Most UK men are deficient, especially October to March. Low vitamin D directly affects muscle function, recovery, and energy. You won&apos;t know without testing.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">07</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Active B12</h3>
              <p className="text-black font-serif leading-relaxed">Holotranscobalamin &mdash; the form of B12 your cells can actually use. Standard tests often miss deficiency. Low Active B12 affects energy, nerve function, and recovery between sessions.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">08</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">hs-CRP <span className="text-sm tracking-normal">(Inflammation)</span></h3>
              <p className="text-black font-serif leading-relaxed">A high-sensitivity inflammation marker. In active men, elevated hs-CRP is often linked to joint and connective tissue stress &mdash; but it can have several causes. Your dashboard explains what your specific reading means.</p>
            </div>

            <div className="glass-panel p-8 flex flex-col hover:bg-gray-50 transition-colors relative">
              <div className="absolute top-4 right-4 data-label text-gray-400">09</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black mb-4 pr-8">Ferritin</h3>
              <p className="text-black font-serif leading-relaxed">Your iron stores. Low ferritin is one of the most common and most overlooked causes of fatigue in men. Often normal on a basic NHS panel. Rarely tested unless you ask for it specifically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE PROCESS */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black"></span>
              THE PROCESS
              <span className="w-12 h-[2px] bg-black"></span>
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">Five minutes.<br/>No GP needed.</h2>
            <p className="text-black font-serif text-xl leading-relaxed">No appointment. No waiting room. No referral letter.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[50%] left-[10%] right-[10%] h-[2px] bg-black -translate-y-[50%] z-0"></div>

            <div className="group border-2 border-black rounded-none shadow-none p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-6 -mr-2">1</div>
              <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">01</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">Order</h3>
              <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">Dispatched same day. Fits through your letterbox.</p>
            </div>

            <div className="group border-2 border-black rounded-none shadow-none p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-6 -mr-2">2</div>
              <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">02</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">Collect</h3>
              <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">A simple finger-prick sample you can do at the kitchen table.</p>
            </div>

            <div className="group border-2 border-black rounded-none shadow-none p-10 relative z-10 bg-white hover:bg-black transition-colors duration-200">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-gray-100 group-hover:text-white leading-none select-none pointer-events-none -mt-6 -mr-2">3</div>
              <div className="w-12 h-12 rounded-none bg-white border-4 border-black text-black group-hover:bg-black group-hover:border-white group-hover:text-white flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20 transition-colors duration-200">03</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-black group-hover:text-white mb-4 relative z-20 transition-colors duration-200">Return</h3>
              <p className="text-black group-hover:text-gray-300 font-serif text-base leading-relaxed relative z-20 transition-colors duration-200">Drop it in a postbox using the prepaid return envelope.</p>
            </div>

            <div className="border-4 border-black rounded-none shadow-none p-10 relative z-10 bg-black text-white">
              <div className="absolute top-0 right-0 p-4 text-[120px] font-sans font-black text-white leading-none select-none pointer-events-none -mt-6 -mr-2">4</div>
              <div className="w-12 h-12 rounded-none bg-white text-black flex items-center justify-center font-sans font-black text-xl mb-8 relative z-20">04</div>
              <h3 className="text-2xl font-sans font-black uppercase tracking-tighter text-white mb-4 relative z-20">Read</h3>
              <p className="text-gray-300 font-serif text-base leading-relaxed relative z-20">Your results appear in your private dashboard within 48 hours. Every marker explained in plain English. Every recommendation based on your actual data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE FULL PICTURE */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="data-label flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-black"></span>
                THE FULL PICTURE
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.95] mb-8">
                One test instead of two.<br/>One price instead of two.
              </h2>
              <p className="text-black font-serif text-xl mb-12 leading-relaxed">
                Kit 3 includes everything in Kit 1 (testosterone) and Kit 2 (energy and recovery) in a single test. Separately, those two kits cost &pound;73. Kit 3 gives you all nine markers for &pound;69.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-black uppercase tracking-tight text-xl mb-2">More data, better answers.</h4>
                    <p className="font-serif text-black leading-relaxed">Your testosterone, energy, recovery, and inflammation markers all interact. Testing them together shows the full picture, not just one piece of it.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-black uppercase tracking-tight text-xl mb-2">One sample, one envelope, one result.</h4>
                    <p className="font-serif text-black leading-relaxed">No need to order two kits and do two finger pricks on two different mornings.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-sans font-black uppercase tracking-tight text-xl mb-2">Strongest recommendations.</h4>
                    <p className="font-serif text-black leading-relaxed">More markers mean more specific advice. If multiple things are off, your report shows exactly which ones and what to do about each.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundSize: '40px 40px',
                  backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)'
                }}
              />
              <div className="glass-panel p-10 bg-white relative z-10 border-4 border-black">
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 data-label !text-[10px] border-b-4 border-l-4 border-black">MATH</div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-6">
                    <div>
                      <h4 className="font-sans font-black uppercase text-xl">Kit 1</h4>
                      <p className="font-serif text-sm text-gray-600">Testosterone Profile</p>
                    </div>
                    <div className="font-mono font-bold text-2xl">&pound;29</div>
                  </div>
                  <div className="flex justify-between items-center border-b-2 border-black pb-6">
                    <div>
                      <h4 className="font-sans font-black uppercase text-xl">Kit 2</h4>
                      <p className="font-serif text-sm text-gray-600">Energy &amp; Recovery</p>
                    </div>
                    <div className="font-mono font-bold text-2xl">&pound;44</div>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <div className="font-sans font-black uppercase text-lg">Purchased Separately</div>
                    <div className="font-mono font-bold text-xl line-through">&pound;73</div>
                  </div>
                  <div className="bg-black text-white p-6 mt-6 flex justify-between items-center">
                    <div>
                      <h4 className="font-sans font-black uppercase text-2xl">Kit 3</h4>
                      <p className="font-serif text-sm text-gray-300">All 9 Biomarkers</p>
                    </div>
                    <div className="font-mono font-bold text-4xl">&pound;69</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. THE FIX / DASHBOARD PREVIEW */}
      <section className="py-32 bg-white border-y-4 border-black relative overflow-hidden">
        <div className="absolute -left-20 top-[50%] -translate-y-1/2 text-[300px] font-sans font-black text-gray-50 opacity-50 select-none pointer-events-none leading-none">FIX</div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="p-8 bg-black text-white border-4 border-black">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
                  <div className="w-3 h-3 rounded-none bg-white status-dot-pulse"></div>
                  <span className="data-label !text-white">DASHBOARD_PREVIEW</span>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Marker</div>
                    <div className="font-sans font-bold text-xl">Vitamin D</div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400 mb-1 uppercase tracking-wider">Result</div>
                    <div className="font-mono font-black text-3xl text-white">28 <span className="text-base text-gray-400 font-normal">nmol/L</span></div>
                    <div className="inline-block bg-white text-black text-xs font-bold px-2 py-1 mt-2 uppercase tracking-widest">Deficient</div>
                  </div>
                  <div className="border-t border-gray-700 pt-6 mt-6">
                    <div className="text-xs font-mono text-gray-400 mb-2 uppercase tracking-wider">Next Step Protocol</div>
                    <p className="font-serif text-sm leading-relaxed">Immediate supplementation required. Begin 4,000 IU daily dosing protocol. Re-test in 90 days to confirm absorption and level correction.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="data-label flex items-center gap-4 mb-6">
                <span className="w-12 h-[2px] bg-black"></span>
                THE FIX
              </div>
              <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter leading-[0.95] mb-8">
                We don&apos;t just give you numbers.
              </h2>
              <p className="text-black font-serif text-xl mb-10 leading-relaxed">
                Every biomarker comes with a plain-English explanation and a specific next step. If your vitamin D is low, you&apos;ll know what to take and the right dose. If your testosterone is below where it should be, your report explains what your level means and what to consider next. If something needs a GP, we&apos;ll tell you directly.
              </p>
              <div className="pl-6 border-l-4 border-black py-2">
                <p className="font-sans font-black uppercase text-lg tracking-tight">Your results are reviewed by a GMC-registered doctor. No guesswork. No generic advice. Just your data and what it means for you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILT FOR */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black"></span>
              BUILT FOR
              <span className="w-12 h-[2px] bg-black"></span>
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-6">
              The men&apos;s health check your GP doesn&apos;t offer.
            </h2>
            <p className="text-black font-sans font-black text-xl uppercase tracking-widest border-2 border-black inline-block px-6 py-3 bg-white mt-4">
              If you&apos;re not sure where to start, start here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-10 bg-white">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <p className="font-serif text-xl leading-relaxed text-black">
                The man who hasn&apos;t had a proper check-up in years and wants to know where he stands.
              </p>
            </div>
            <div className="glass-panel p-10 bg-white">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <p className="font-serif text-xl leading-relaxed text-black">
                The man who isn&apos;t sure whether it&apos;s his testosterone, his energy, or something else entirely.
              </p>
            </div>
            <div className="glass-panel p-10 bg-white">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <p className="font-serif text-xl leading-relaxed text-black">
                The man who wants one comprehensive test instead of guessing which single marker to check.
              </p>
            </div>
            <div className="glass-panel p-10 bg-white border-4 border-black">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <p className="font-serif text-xl leading-relaxed text-black font-bold">
                The man over 40 who knows something&apos;s shifted but can&apos;t pinpoint what.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOUNDERS */}
      <section className="py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-black text-black uppercase tracking-tighter mb-4">
              Built by men who needed it.<br/>Backed by doctors who understand it.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-10 flex flex-col bg-gray-50 border-2 border-black">
              <div className="mb-8">
                <div className="w-20 h-20 bg-black text-white font-sans font-black text-3xl flex items-center justify-center border-4 border-black mb-4">KA</div>
                <h4 className="font-sans font-black uppercase text-xl">Keith Anthony</h4>
                <div className="data-label text-gray-500">Founder</div>
              </div>
              <div className="flex-grow">
                <p className="font-serif text-lg leading-relaxed text-black italic">
                  &quot;I spent two years being told my levels were &apos;normal for my age&apos; while feeling completely burnt out. I built this company because the standard approach is broken. We test first. Then we fix it.&quot;
                </p>
              </div>
            </div>

            <div className="glass-panel p-10 flex flex-col bg-white border-4 border-black">
              <div className="mb-8">
                <div className="w-20 h-20 bg-white text-black font-sans font-black text-3xl flex items-center justify-center border-4 border-black mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="23" y2="12"></line><line x1="23" y1="8" x2="19" y2="12"></line></svg>
                </div>
                <h4 className="font-sans font-black uppercase text-xl">Dr Ewa Lindo</h4>
                <div className="data-label text-gray-500">Medical Director</div>
              </div>
              <div className="flex-grow">
                <p className="font-serif text-lg leading-relaxed text-black italic">
                  &quot;Normal ranges are statistical averages, not targets for how you should actually feel. I review our clinical protocols to ensure your data translates into effective, actionable health steps.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. COMPARE KITS */}
      <section className="py-32 bg-gray-50 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="data-label flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-[2px] bg-black"></span>
              COMPARE
              <span className="w-12 h-[2px] bg-black"></span>
            </div>
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter">
              All three kits, side by side.
            </h2>
          </div>

          <div className="overflow-x-auto pb-8">
            <table className="w-full min-w-[800px] border-collapse text-left border-4 border-black bg-white">
              <thead>
                <tr className="bg-black text-white">
                  <th className="p-6 border-b-4 border-r-2 border-black font-sans font-black uppercase text-xl w-1/4">Spec</th>
                  <th className="p-6 border-b-4 border-r-2 border-black font-sans font-black uppercase text-xl w-1/4">Kit 1: Testosterone</th>
                  <th className="p-6 border-b-4 border-r-2 border-black font-sans font-black uppercase text-xl w-1/4">Kit 2: Energy &amp; Recovery</th>
                  <th className="p-6 border-b-4 border-black bg-white text-black font-sans font-black uppercase text-2xl w-1/4 relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-[50%] bg-black text-white text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 whitespace-nowrap">Most Complete</div>
                    Kit 3: Hormone &amp; Recovery
                  </th>
                </tr>
              </thead>
              <tbody className="font-serif">
                <tr>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase tracking-tight text-gray-500 bg-gray-50">Price</td>
                  <td className="p-6 border-b-2 border-r-2 border-black text-2xl font-mono font-bold">&pound;29</td>
                  <td className="p-6 border-b-2 border-r-2 border-black text-2xl font-mono font-bold">&pound;44</td>
                  <td className="p-6 border-b-2 border-black text-3xl font-mono font-black border-l-4 border-l-black bg-gray-50">&pound;69</td>
                </tr>
                <tr>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase tracking-tight text-gray-500 bg-gray-50">Markers</td>
                  <td className="p-6 border-b-2 border-r-2 border-black leading-relaxed">Total T, SHBG, FAI, Albumin, Free T</td>
                  <td className="p-6 border-b-2 border-r-2 border-black leading-relaxed">Vit D, Active B12, hs-CRP, Ferritin</td>
                  <td className="p-6 border-b-2 border-black font-bold border-l-4 border-l-black bg-gray-50">All 9 markers</td>
                </tr>
                <tr>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase tracking-tight text-gray-500 bg-gray-50">Best For</td>
                  <td className="p-6 border-b-2 border-r-2 border-black">Testosterone only</td>
                  <td className="p-6 border-b-2 border-r-2 border-black">Energy, recovery, joints</td>
                  <td className="p-6 border-b-2 border-black font-bold border-l-4 border-l-black bg-gray-50">Full picture</td>
                </tr>
                <tr>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase tracking-tight text-gray-500 bg-gray-50">Testosterone?</td>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase">Yes</td>
                  <td className="p-6 border-b-2 border-r-2 border-black font-sans font-bold uppercase text-gray-400">No</td>
                  <td className="p-6 border-b-2 border-black font-sans font-black uppercase border-l-4 border-l-black bg-gray-50">Yes</td>
                </tr>
                <tr>
                  <td className="p-6 border-b-4 border-r-2 border-black font-sans font-bold uppercase tracking-tight text-gray-500 bg-gray-50">Energy + Recovery?</td>
                  <td className="p-6 border-b-4 border-r-2 border-black font-sans font-bold uppercase text-gray-400">No</td>
                  <td className="p-6 border-b-4 border-r-2 border-black font-sans font-bold uppercase">Yes</td>
                  <td className="p-6 border-b-4 border-black font-sans font-black uppercase border-l-4 border-l-black bg-gray-50">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-6 border-r-2 border-black bg-gray-100"></td>
                  <td className="p-6 border-r-2 border-black">
                    <Link href="/kits/testosterone" className="inline-flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-sm hover:underline">
                      Order <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </Link>
                  </td>
                  <td className="p-6 border-r-2 border-black">
                    <Link href="/kits/energy-recovery" className="inline-flex items-center gap-2 font-sans font-bold uppercase tracking-widest text-sm hover:underline">
                      Order <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </Link>
                  </td>
                  <td className="p-6 border-black border-l-4 border-l-black bg-black text-white">
                    <div className="font-sans font-black uppercase tracking-widest text-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-none status-dot-pulse"></span>
                      You&apos;re here
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="py-32 bg-white border-t-4 border-black">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-sans font-black text-black uppercase tracking-tighter mb-4">
              FAQ
            </h2>
            <div className="data-label">SYSTEM_QUERY</div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">Does it hurt?</h3>
              <p className="font-serif leading-relaxed text-black">It&apos;s a quick prick on the fingertip. Most men say it&apos;s completely painless. We include extra lancets just in case.</p>
            </div>
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">How long do results take?</h3>
              <p className="font-serif leading-relaxed text-black">Once our UKAS accredited lab receives your sample, your dashboard is updated within 48 hours.</p>
            </div>
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">Does the &pound;69 cover everything?</h3>
              <p className="font-serif leading-relaxed text-black">Yes. The kit, the lab analysis for all nine biomarkers, the prepaid return postage, and access to your results dashboard are all included.</p>
            </div>
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">Is my data private?</h3>
              <p className="font-serif leading-relaxed text-black">Completely. We use bank-level encryption. Your results are strictly between you, our medical team, and your private dashboard. We never share data with third parties.</p>
            </div>
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">Why not just buy Kit 1 and Kit 2 separately?</h3>
              <p className="font-serif leading-relaxed text-black">You could. They&apos;d cost &pound;73 combined. Kit 3 gives you all nine markers for &pound;69, with one sample instead of two. And testing everything together gives a more complete picture, which means better recommendations.</p>
            </div>
            <div className="glass-panel p-8 bg-white border-2 border-black">
              <h3 className="font-sans font-black uppercase text-xl mb-4">What if my testosterone comes back low?</h3>
              <p className="font-serif leading-relaxed text-black">Your report will explain exactly what your level means and what to consider next. If your results meet the threshold, we&apos;ll invite you to join our founding member programme, which secures your place at the front of the queue when our clinical service launches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. END SECTION */}
      <section className="py-40 relative bg-black overflow-hidden border-t-4 border-black text-white">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333)',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}
        />

        <div className="absolute top-12 left-12 data-label opacity-100 hidden md:block text-gray-400 text-sm">SYS.READY // UKAS.V1</div>
        <div className="absolute bottom-12 right-12 data-label opacity-100 hidden md:block text-gray-400 text-sm">END.SEQ // KIT.3</div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-[80px] lg:text-[100px] font-sans font-black uppercase tracking-tighter text-white leading-[0.85] mb-10">
            One test.<br/>Nine answers.<br/>The full picture.
          </h2>
          <p className="text-2xl font-serif mb-16 max-w-3xl mx-auto leading-relaxed text-gray-300">
            A finger prick. A prepaid envelope. 48 hours. That&apos;s it.
          </p>

          <Link href="#order" className="inline-flex bg-white text-black hover:bg-gray-200 border-4 border-black font-sans font-black uppercase tracking-widest text-xl px-12 py-6 rounded-none transition-all items-center justify-center gap-4">
            Order the Kit &mdash; &pound;69
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>

          <div className="mt-12 flex items-center justify-center gap-3 text-sm font-sans font-bold uppercase tracking-widest text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12"></polyline></svg>
            One-off purchase. Results in your personal dashboard. No GP needed.
          </div>
        </div>
      </section>
    </>
  )
}

