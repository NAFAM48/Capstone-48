"use client";

import DashboardShell from "@/app/components/dashboard-shell";

export default function Notifications() {
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
                  Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Stay updated with factory alerts, system notifications, and upcoming maintenance schedules.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Alert Center Active
              </div>
            </header>

            {/* Notification Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
              
              {/* Total Notifications */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Total Notifications</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">12</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Active system alerts</p>
              </div>

              {/* Production Alerts */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Production Alerts</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">4</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Line efficiency notices</p>
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
                  <p className="text-3xl font-bold text-slate-900">3</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Equipment status updates</p>
              </div>

              {/* Maintenance Alerts */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Maintenance Alerts</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">5</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Scheduled services</p>
              </div>

            </div>

            {/* Grid Section: Recent Notifications & System Status */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up delay-200">
              
              {/* Recent Notifications */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <h2 className="text-lg font-bold text-slate-900">Recent Notifications</h2>
                <p className="text-xs text-slate-500">Chronological feed of factory events</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Production target is currently on track.",
                    "Machine 03 requires scheduled maintenance.",
                    "Quality inspection completed successfully.",
                    "Production noise levels remain low.",
                    "Factory systems are operating normally.",
                  ].map((notification, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                          i
                        </span>
                        <span className="text-sm font-medium text-slate-800">{notification}</span>
                      </div>
                      <span className="text-xs text-slate-400">Just now</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* System Status */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">System Status</h2>
                  <p className="text-xs text-slate-500">Overall telemetry health</p>

                  <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Operational</span>
                    </div>
                    <p className="text-sm font-semibold text-emerald-900">
                      All factory systems are operational.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-xs text-slate-500 font-medium">Last automated diagnostic check completed 2 minutes ago.</p>
                </div>
              </div>

            </div>

            {/* Grid Section: Upcoming Maintenance & Factory Updates */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-300">
              
              {/* Upcoming Maintenance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Upcoming Maintenance</h2>
                <p className="text-xs text-slate-500">Scheduled asset interventions</p>

                <ul className="mt-5 space-y-3">
                  {[
                    { task: "Machine 03", date: "July 30" },
                    { task: "Sensor Calibration", date: "August 2" },
                    { task: "Production Line Check", date: "August 5" },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <span className="text-sm font-semibold text-slate-800">{item.task}</span>
                      <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                        {item.date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Factory Updates */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Factory Updates</h2>
                <p className="text-xs text-slate-500">Performance logs and bulletins</p>

                <ul className="mt-5 space-y-3">
                  {[
                    "Production efficiency increased by 3%.",
                    "Machine utilization remains stable.",
                    "No critical alerts detected.",
                    "All quality standards have been met.",
                  ].map((update, idx) => (
                    <li key={idx} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[0.65rem] font-bold text-slate-700">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-700">{update}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
      </DashboardShell>
  );
}