"use client";

import DashboardShell from "../components/dashboard-shell";
import { getFactoryOverview } from "@/lib/oee";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function EfficiencyAnalytics() {
  const machines = getMachines();
  const records = getProductionRecords();
  const events = getDowntimeEvents();
  const overview = getFactoryOverview(machines, records, events);

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
                  Efficiency Analytics
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Monitor OEE trends, throughput, and primary downtime drivers across all lines and shifts.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Analytics Engine Active
              </div>
            </header>

            {/* Overall OEE 4-Card Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
              
              {/* OEE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Overall OEE</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(overview.overall.oee)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Combined factory score</p>
              </div>

              {/* Availability */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Availability</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(overview.overall.availability)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Uptime runtime ratio</p>
              </div>

              {/* Performance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Performance</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(overview.overall.performance)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Speed and cycle efficiency</p>
              </div>

              {/* Quality */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Quality</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(overview.overall.quality)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Good units pass rate</p>
              </div>

            </div>

            {/* OEE Trend & Downtime Pareto Grid */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr] animate-fade-up delay-200">
              
              {/* OEE Trend */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">OEE Trend</h2>
                    <p className="text-xs text-slate-500">Historical performance timeline analysis</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {overview.trend.map((item) => {
                    const percentage = Math.min(100, Math.max(0, (item.value / 250) * 100));
                    return (
                      <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                          <p className="text-sm font-bold text-blue-600">{item.value}</p>
                        </div>
                        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                          <div 
                            style={{ width: `${percentage}%` }} 
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Downtime Pareto */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Downtime Pareto</h2>
                    <p className="text-xs text-slate-500">Root cause breakdown</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {overview.downtimePareto.map((item, index) => (
                    <div key={item.reason} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-800">{item.reason}</span>
                      </div>
                      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                        {item.minutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Throughput by Line */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Throughput by Line</h2>
                  <p className="text-xs text-slate-500">Total manufacturing yield per production stream</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {overview.throughputByLine.map((item) => (
                  <div key={item.line} className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:border-slate-200 hover:bg-slate-50">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Stream Name</p>
                    <p className="text-base font-bold text-slate-900">{item.line}</p>
                    <div className="mt-4 flex items-baseline gap-2">
                      <p className="text-3xl font-black text-blue-600">{item.units.toLocaleString()}</p>
                      <span className="text-xs font-semibold text-slate-500">units produced</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
      </DashboardShell>
   
  );
}