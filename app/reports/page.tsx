"use client";

import Sidebar from "../components/sidebar";

export default function Reports() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { 
          opacity: 0;
          animation: fadeUp 0.4s ease-out forwards; 
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="flex min-h-screen bg-slate-50 font-sans">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            
            {/* Header Area */}
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    NAFAM OEE Control
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Reports
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  View and analyze comprehensive factory performance reports and historical summaries.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Reports Engine Active
              </div>
            </header>

            {/* Report Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
              
              {/* Total Production */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Total Production</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">2,000</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Toys Produced</p>
              </div>

              {/* Efficiency Rate */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Efficiency Rate</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">96%</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Overall throughput speed</p>
              </div>

              {/* Machine Performance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Machine Performance</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">94%</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Asset reliability ratio</p>
              </div>

              {/* Quality Score */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Quality Score</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">98%</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Defect-free yield rate</p>
              </div>

            </div>

            {/* Grid Section: Daily & Weekly Reports */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-200">
              
              {/* Daily Report Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Daily Report Summary</h2>
                <p className="text-xs text-slate-500">Performance logs for the current operating cycle</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Production target achieved successfully.",
                    "All machines operated within expected limits.",
                    "No major production disturbances detected.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weekly Report Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Weekly Report Summary</h2>
                <p className="text-xs text-slate-500">Aggregated metrics across all operating shifts</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Production efficiency improved by 4%.",
                    "Machine utilization remained stable.",
                    "Quality standards were maintained.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Grid Section: Monthly Report & Production Noise Summary */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-300">
              
              {/* Monthly Report Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Monthly Report Summary</h2>
                <p className="text-xs text-slate-500">Long-term factory trend evaluation</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Total production targets were met.",
                    "Factory operations remained efficient.",
                    "Production noise levels decreased.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Production Noise Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Production Noise Summary</h2>
                  <p className="text-xs text-slate-500">Acoustic telemetry overview</p>

                  <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Production noise incidents remain at minimal levels with stable acoustic dampening across all lines.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Nominal Acoustic Range
                  </span>
                </div>
              </div>

            </div>

            {/* Grid Section: Factory Status & Report Generation Status */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up">
              
              {/* Factory Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Factory Status</h2>
                <p className="text-xs text-slate-500">Live operational condition</p>

                <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">System Active</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-900">
                    Operational
                  </p>
                </div>
              </div>

              {/* Report Generation Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Report Generation Status</h2>
                <p className="text-xs text-slate-500">Automated job scheduler</p>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    All factory reports have been generated successfully and synced with the central dashboard server.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </>
  );
}