"use client";

import DashboardShell from "../components/dashboard-shell";

export default function ProductionNoiseAnalysis() {
  return (
    <DashboardShell>
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
                  Production Noise Analysis
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Detect and monitor acoustic disruptions affecting factory performance and stability.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Acoustic Sensors Active
              </div>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
              
              {/* Noise Incidents */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Noise Incidents</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 11.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">08</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Recorded anomalous spikes</p>
              </div>

              {/* Machine Alerts */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Machine Alerts</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">03</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Triggered thresholds</p>
              </div>

              {/* Quality Issues */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Quality Issues</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">02</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Linked to sound anomalies</p>
              </div>

              {/* Production Delays */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Production Delays</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">01</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Impacted production run</p>
              </div>

            </div>

            {/* Grid Section: Noise Level & Filtering Status */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-200">
              
              {/* Current Noise Level */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Current Noise Level</h2>
                <p className="text-xs text-slate-500">Real-time factory ambient spectrum</p>
                
                <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Acoustic Index</p>
                    <p className="mt-1 text-3xl font-black text-emerald-600">LOW</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Stable Operation
                  </span>
                </div>
              </div>

              {/* Production Noise Filtering Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Production Noise Filtering Status</h2>
                <p className="text-xs text-slate-500">DSP algorithm performance</p>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    The production system is filtering abnormal machine activities successfully with active spectral dampening engaged.
                  </p>
                </div>
              </div>

            </div>

            {/* Grid Section: Sensor Monitoring & Production Disturbances */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-300">
              
              {/* Sensor Monitoring */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Sensor Monitoring</h2>
                <p className="text-xs text-slate-500">Telemetry feed from hardware nodes</p>

                <ul className="mt-5 space-y-3">
                  {[
                    { name: "Temperature Sensor", status: "Normal", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                    { name: "Production Sensor", status: "Stable", color: "text-blue-600 bg-blue-50 border-blue-200" },
                    { name: "Machine Sensor", status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                    { name: "Quality Sensor", status: "Operational", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  ].map((sensor, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50">
                      <span className="text-sm font-semibold text-slate-800">{sensor.name}</span>
                      <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${sensor.color}`}>
                        {sensor.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Production Disturbances */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Production Disturbances</h2>
                <p className="text-xs text-slate-500">Logged disruption events</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "No major disturbances detected.",
                    "Machine synchronization successful.",
                    "Production flow operating normally.",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Recent Updates */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up">
              <h2 className="text-lg font-bold text-slate-900">Recent Noise Analysis Updates</h2>
              <p className="text-xs text-slate-500">Latest automated system logs and adjustments</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  "Production noise reduced by 5%.",
                  "Sensor calibration completed.",
                  "Machine alerts resolved successfully.",
                  "Factory performance remains stable.",
                ].map((update, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[0.65rem] font-bold text-slate-700">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{update}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
      </DashboardShell>
  );
}