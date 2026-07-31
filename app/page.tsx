import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Zero-config custom animations for a polished load-in effect */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { 
          opacity: 0;
          animation: fadeUp 0.8s ease-out forwards; 
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-50 flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
            alt="Manufacturing facility background"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-100/90 to-slate-100/40"></div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-24">
          
          {/* Left Column: Hero Text */}
          <div className="space-y-8 lg:max-w-2xl animate-fade-up">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 backdrop-blur-sm">
                NAFAM Toy Factory
              </span>
              <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Remove noise, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
                  surface truth.
                </span>
              </h1>
            </div>
            
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Track machine status, cycle time, good vs. defective output, downtime reasons, and shift context with a single, precision-engineered dashboard.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link 
                href="/login" 
                className="group inline-flex items-center justify-center rounded-xl bg-blue-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-blue-700/40"
              >
                Sign In
                <svg className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow"
              >
                <svg className="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Demo Dashboard
              </Link>
            </div>
          </div>

          {/* Right Column: Feature Card */}
          <div className="w-full lg:max-w-lg animate-fade-up delay-200">
            <div className="relative rounded-[2rem] border border-white/40 bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl sm:p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-blue-900/10">
              {/* Subtle top highlight for the card */}
              <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
              
              <div className="space-y-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Abstraction Pillar</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">OEE-first visibility</h2>
                </div>
                
                <div className="space-y-5">
                  {/* Metric 1 */}
                  <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/50 p-4 transition-colors hover:bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Metrics preserved</p>
                      <p className="mt-1 text-sm text-slate-600">Machine status, cycle time, yield, downtime reason codes, and shift context.</p>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/50 p-4 transition-colors hover:bg-white">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Noise filtered out</p>
                      <p className="mt-1 text-sm text-slate-600">Raw vibration, sensor jitter, and micro-behavior are omitted from the abstraction.</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight Box */}
                <div className="rounded-2xl bg-slate-900 p-5 text-left shadow-inner">
                  <p className="text-sm font-semibold text-blue-300">OEE Formula Definition</p>
                  <p className="mt-2 text-sm text-slate-300">
                    <span className="text-white font-medium">Effectiveness</span> = Availability × Performance × Quality. 
                    This platform is built strictly around that headline metric.
                  </p>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}