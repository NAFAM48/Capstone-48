"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import { summarizeByMachine, type MachineSummary } from "@/lib/oee";
import type { DowntimeEvent, Machine, ProductionRecord } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function MachineAnalytics() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [events, setEvents] = useState<DowntimeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    apiFetch<{ machines: Machine[]; records: ProductionRecord[]; events: DowntimeEvent[] }>("/api/machines")
      .then((data) => {
        setMachines(data.machines);
        setRecords(data.records);
        setEvents(data.events);
      })
      .catch((err) => setError(err?.message ?? "Unable to load machine analytics."))
      .finally(() => setLoading(false));
  }, []);

  const loadData = async () => {
    const data = await apiFetch<{ machines: Machine[]; records: ProductionRecord[]; events: DowntimeEvent[] }>(
      "/api/machines"
    );
    setMachines(data.machines);
    setRecords(data.records);
    setEvents(data.events);
  };

  const deleteMachine = async (summary: MachineSummary) => {
    if (
      !window.confirm(
        `Delete machine "${summary.machine.name}" (${summary.machine.id})?\n\nThis removes the machine and its downtime events from the backend. This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingId(summary.machine.id);
    setActionMessage(null);
    try {
      await apiFetch(`/api/machines/${summary.machine.id}`, { method: "DELETE" });
      setActionMessage({ type: "success", text: `Machine "${summary.machine.name}" deleted.` });
      await loadData();
    } catch (err) {
      setActionMessage({ type: "error", text: (err as Error)?.message ?? "Unable to delete machine." });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading machine analytics…</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-red-600">{error}</div>
      </DashboardShell>
    );
  }

  const machineSummaries = summarizeByMachine(machines, records, events);
  const activeCount = machines.filter((machine) => machine.status === "Running").length;
  const downCount = machines.filter((machine) => machine.status === "Down").length;
  const idleCount = machines.filter((machine) => machine.status === "Idle").length;

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

            {actionMessage && (
              <div
                className={`mb-6 flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                  actionMessage.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}
              >
                <span>{actionMessage.text}</span>
                <button
                  type="button"
                  onClick={() => setActionMessage(null)}
                  className="text-xs font-bold uppercase tracking-wide opacity-70 hover:opacity-100"
                >
                  Dismiss
                </button>
              </div>
            )}

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
                      <th className="pb-3 pt-2 text-right">Actions</th>
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
                          <td className="py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => deleteMachine(row)}
                              disabled={deletingId === row.machine.id}
                              title={`Delete ${row.machine.name}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                            >
                              {deletingId === row.machine.id ? (
                                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              {deletingId === row.machine.id ? "Deleting" : "Delete"}
                            </button>
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
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900">
                          {formatPercent(row.summary.oee)}
                        </span>
                        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">Overall OEE</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteMachine(row)}
                        disabled={deletingId === row.machine.id}
                        title={`Delete ${row.machine.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
      </DashboardShell>

  );
}