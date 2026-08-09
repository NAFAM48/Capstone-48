"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import { apiFetch } from "@/lib/api";
import type { Machine, ProductionRecord, DowntimeEvent } from "@/lib/demo-data";
import type { FactoryOverview } from "@/lib/oee";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function Dashboard() {
  const [data, setData] = useState<{
    machines: Machine[];
    records: ProductionRecord[];
    events: DowntimeEvent[];
    overview: FactoryOverview | null;
  }>({
    machines: [],
    records: [],
    events: [],
    overview: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ machines: Machine[]; records: ProductionRecord[]; events: DowntimeEvent[] }>("/api/machines"),
      apiFetch<{ overview: FactoryOverview; source?: "backend" | "local" }>("/api/oee", { method: "POST" }),
    ])
      .then(([machinesData, oeeData]) => {
        setData({
          machines: machinesData.machines,
          records: machinesData.records,
          events: machinesData.events,
          overview: oeeData.overview,
        });
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load dashboard data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 flex items-center justify-center p-8 md:ml-72">
          <div className="text-slate-600">Loading dashboard overview…</div>
        </main>
      </div>
    );
  }

  if (error || !data.overview) {
    return (
      <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 flex items-center justify-center p-8 md:ml-72 text-red-600">
          {error ?? "Unable to load dashboard details."}
        </main>
      </div>
    );
  }

  const { machines, events, overview } = data;

  const totalProduction = overview.overall.unitsProduced;
  const activeMachinesCount = machines.filter((m) => m.status === "Running").length;
  const totalMachinesCount = machines.length;

  const oeeValue = overview.overall.oee;
  const qualityValue = overview.overall.quality;

  // Calculate target progress against a daily goal of 2000 toys
  const dailyGoal = 2000;
  const targetPercent = Math.min(100, Math.round((totalProduction / dailyGoal) * 1000) / 10);

  // Derive dynamic activities from recent downtime events or machine states
  const recentActivities: Array<{ message: string; time: string; type: "up" | "down" }> = events
    .slice(-4)
    .reverse()
    .map((event) => {
      const machine = machines.find((m) => m.id === event.machineId);
      return {
        message: `Machine "${machine?.name ?? "Asset"}" reported downtime due to: ${event.reason}.`,
        time: event.start ? new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently",
        type: "down" as const,
      };
    });

  if (recentActivities.length === 0) {
    recentActivities.push({
      message: "All production lines synchronized successfully. Operating at peak efficiency.",
      time: "Just now",
      type: "up" as const,
    });
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-up { 
          opacity: 0;
          animation: fadeUp 0.5s ease-out forwards; 
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      <div className="flex min-h-screen flex-col overflow-hidden bg-slate-50 font-sans md:flex-row">
        <Sidebar />

        <main className="w-full min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 md:ml-72">
          
          <div className="mx-auto max-w-7xl">
            {/* Header Area */}
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    NAFAM Toy Factory
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Building Better Toys Every Day. Here is today&apos;s factory performance.
                </p>
              </div>

              {/* Factory Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                </span>
                Factory Operational
              </div>
            </header>

            {/* KPI Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
              
              {/* Stat 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Total Production</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{totalProduction.toLocaleString()}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Toys produced today</p>
              </div>

              {/* Stat 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Active Machines</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{activeMachinesCount}<span className="text-lg text-slate-400">/{totalMachinesCount}</span></p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Machines running</p>
              </div>

              {/* Stat 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Efficiency (OEE)</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(oeeValue)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Production efficiency</p>
              </div>

              {/* Stat 4 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Quality Score</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{formatPercent(qualityValue)}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Pass rate across all lines</p>
              </div>

            </div>

            {/* Middle Section: Progress & Quick Actions */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up delay-200">
              
              {/* Production Progress */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Today&apos;s Target</h2>
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{targetPercent}% Complete</span>
                </div>
                
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{totalProduction.toLocaleString()} Toys</span>
                  <span className="text-slate-500">Goal: {dailyGoal.toLocaleString()}</span>
                </div>
                
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out" 
                    style={{ width: `${targetPercent}%` }}
                  >
                    <div className="absolute inset-0 w-full animate-[shimmer_2s_infinite] bg-white/20"></div>
                  </div>
                </div>
              </div>

              {/* Quick Access Grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/production-monitoring" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Monitoring
                  </Link>
                  <Link href="/efficiency-analytics" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </Link>
                  <Link href="/notifications" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Alerts
                  </Link>
                  <Link href="/reports" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Reports
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Section: Activity Feed */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-300">
              <h2 className="mb-6 text-lg font-bold text-slate-900">Recent Activities</h2>
              
              <ul className="space-y-4">
                {recentActivities.map((act, index) => (
                  <li key={index} className="flex items-start gap-4 animate-fade-up">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      act.type === "up" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                    }`}>
                      {act.type === "up" ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{act.message}</p>
                      <p className="text-xs text-slate-500">{act.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}