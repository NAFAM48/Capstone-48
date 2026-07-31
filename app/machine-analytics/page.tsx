"use client";

import Sidebar from "../components/sidebar";
import { summarizeByMachine } from "@/lib/oee";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function MachineAnalytics() {
  const machines = getMachines();
  const records = getProductionRecords();
  const events = getDowntimeEvents();
  const machineSummaries = summarizeByMachine(machines, records, events);
  
  const activeCount = machines.filter((machine) => machine.status === "Running").length;
  const downCount = machines.filter((machine) => machine.status === "Down").length;
  const idleCount = machines.filter((machine) => machine.status === "Idle").length;

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
                  Machine Analytics
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor machine health, operational status, and OEE performance breakdown per asset.
                </p>
              </div>

              {/* Asset Health Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
                </span>
                {activeCount} / {machines.length} Active Lines
              </div>
            </header>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up delay-100">
              
              {/* Total Machines */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Total Asset Pool</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{machines.length}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Monitored factory units</p>
              </div>

              {/* Running */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Running Normal</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{activeCount}</p>
                  <p className="text-sm font-medium text-emerald-600">
                    {Math.round((activeCount / machines.length) * 100)}% active
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Optimal operating state</p>
              </div>

              {/* Idle / Down */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Idle / Down</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{idleCount + downCount}</p>
                  <span className="text-xs text-slate-500">({downCount} Down, {idleCount} Idle)</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Requires attention or schedule</p>
              </div>

            </div>

            {/* OEE Comparison Table */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-200">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Machine OEE Comparison</h2>
                  <p className="text-xs text-slate-500">Overview of active production metrics across shifts</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pt-2">Machine</th>
                      <th className="pb-3 pt-2">Line</th>
                      <th className="pb-3 pt-2">Shift</th>
                      <th className="pb-3 pt-2">Status</th>
                      <th className="pb-3 pt-2 text-right">OEE Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {machineSummaries.map((row) => {
                      const isRunning = row.machine.status === "Running";
                      const isDown = row.machine.status === "Down";

                      return (
                        <tr key={row.machine.id} className="transition-colors hover:bg-slate-50/80">
                          <td className="py-3.5 font-semibold text-slate-900">
                            {row.machine.name}
                          </td>
                          <td className="py-3.5 text-slate-600">
                            {row.machine.line}
                          </td>
                          <td className="py-3.5 text-slate-500">
                            {row.machine.shift}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                isRunning
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isDown
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isRunning
                                    ? "bg-emerald-500"
                                    : isDown
                                    ? "bg-rose-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {row.machine.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-bold text-slate-900">
                            {formatPercent(row.summary.oee)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Machine Breakdowns */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2 animate-fade-up delay-300">
              {machineSummaries.map((row) => (
                <div key={row.machine.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{row.machine.name}</h3>
                      <p className="text-xs text-slate-500">{row.machine.line} · {row.machine.shift}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-slate-900">
                        {formatPercent(row.summary.oee)}
                      </span>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Overall OEE</p>
                    </div>
                  </div>

                  {/* Component Progress Bars */}
                  <div className="mt-6 space-y-3">
                    {/* Availability */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Availability</span>
                        <span className="text-slate-900">{formatPercent(row.summary.availability)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: formatPercent(row.summary.availability) }}
                        />
                      </div>
                    </div>

                    {/* Performance */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Performance</span>
                        <span className="text-slate-900">{formatPercent(row.summary.performance)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: formatPercent(row.summary.performance) }}
                        />
                      </div>
                    </div>

                    {/* Quality */}
                    <div>
                      <div className="mb-1 flex justify-between text-xs font-semibold">
                        <span className="text-slate-600">Quality</span>
                        <span className="text-slate-900">{formatPercent(row.summary.quality)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: formatPercent(row.summary.quality) }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}