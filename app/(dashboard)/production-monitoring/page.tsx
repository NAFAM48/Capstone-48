"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { DowntimeEvent, Machine, ProductionRecord } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";

function formatDateTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type MonitoringData = {
  machines: Machine[];
  records: ProductionRecord[];
  events: DowntimeEvent[];
};

export default function ProductionMonitoring() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [events, setEvents] = useState<DowntimeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readingMachineId, setReadingMachineId] = useState("");
  const [readingOutput, setReadingOutput] = useState("");
  const [readingTemp, setReadingTemp] = useState("");
  const [readingTime, setReadingTime] = useState("");
  const [readingMessage, setReadingMessage] = useState<string | null>(null);

  const loadData = async () =>
    apiFetch<MonitoringData>("/api/machines");

  useEffect(() => {
    loadData()
      .then((data) => {
        setMachines(data.machines);
        setRecords(data.records);
        setEvents(data.events);
      })
      .catch((err) => setError(err?.message ?? "Unable to load production data."))
      .finally(() => setLoading(false));
  }, []);

  const handleReadingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReadingMessage(null);
    try {
      await apiFetch("/api/readings", {
        method: "POST",
        body: JSON.stringify({
          machineId: readingMachineId,
          outputCount: Number(readingOutput),
          temperature: readingTemp === "" ? null : Number(readingTemp),
          timestamp: readingTime ? new Date(readingTime).toISOString() : undefined,
        }),
      });
      setReadingMessage("Sensor reading recorded successfully.");
      setReadingOutput("");
      setReadingTemp("");
      setReadingTime("");
      const data = await loadData();
      setMachines(data.machines);
      setRecords(data.records);
      setEvents(data.events);
    } catch (err) {
      setReadingMessage((err as Error)?.message ?? "Unable to record sensor reading.");
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading production telemetry…</div>
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

  const totalUnits = records.reduce((sum, record) => sum + record.unitsProduced, 0);
  const totalDefects = records.reduce((sum, record) => sum + record.defectiveUnits, 0);
  const downtimeMinutes = events.reduce(
    (sum, event) => sum + Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000),
    0
  );

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
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Production Monitoring
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Track units, defects, downtime, and line status in one real-time interface.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Live Telemetry Active
              </div>
            </header>

            {/* KPI Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up delay-100">
              
              {/* Produced Units */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Produced Units</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{totalUnits.toLocaleString()}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Total volume recorded</p>
              </div>

              {/* Defective Units */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Defective Units</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900">{totalDefects.toLocaleString()}</p>
                  <p className="text-sm font-medium text-rose-600">
                    {totalUnits > 0 ? ((totalDefects / totalUnits) * 100).toFixed(1) : 0}% rate
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Rejected during inspection</p>
              </div>

              {/* Downtime */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-500">Total Downtime</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{downtimeMinutes} <span className="text-lg font-normal text-slate-500">min</span></p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Accumulated line stoppage</p>
              </div>

            </div>

            {/* Tables & Events Grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up delay-200">
              
              {/* Production Records Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Production Records</h2>
                    <p className="text-xs text-slate-500">Output logs across active equipment</p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {records.length} Batches
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="pb-3 pt-2">Machine</th>
                        <th className="pb-3 pt-2">Units</th>
                        <th className="pb-3 pt-2">Defects</th>
                        <th className="pb-3 pt-2">Cycle</th>
                        <th className="pb-3 pt-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {records.map((record) => {
                        const machine = machines.find((item) => item.id === record.machineId);
                        return (
                          <tr key={record.id} className="transition-colors hover:bg-slate-50/80">
                            <td className="py-3.5 font-medium text-slate-900">
                              {machine?.name ?? record.machineId}
                            </td>
                            <td className="py-3.5 font-semibold text-slate-800">
                              {record.unitsProduced}
                            </td>
                            <td className="py-3.5">
                              {record.defectiveUnits > 0 ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700">
                                  {record.defectiveUnits}
                                </span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="py-3.5 text-slate-500">
                              {record.cycleTimeSeconds}s
                            </td>
                            <td className="py-3.5 text-right text-xs text-slate-400">
                              {formatDateTime(record.timestamp)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Downtime Events Feed */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Downtime Events</h2>
                    <p className="text-xs text-slate-500">Stoppage and fault log</p>
                  </div>
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {events.length} Incident{events.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="space-y-3">
                  {events.map((event) => {
                    const machine = machines.find((item) => item.id === event.machineId);
                    const minutes = Math.round(
                      (new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000
                    );

                    return (
                      <div key={event.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200 hover:bg-slate-50">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-900">{machine?.name ?? event.machineId}</p>
                          <span className="rounded-md bg-slate-200/60 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-700">
                            {event.reason}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="min-w-0 break-words">
                            {`${formatDateTime(event.start)} → ${formatDateTime(event.end)}`}
                          </span>
                          <span className="shrink-0 font-bold text-amber-600">
                            {minutes}m
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Log Sensor Reading */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-300 lg:col-span-3">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-900">Log Sensor Reading</h2>
                  <p className="text-xs text-slate-500">Record new telemetry for a machine (POST /api/sensor-readings)</p>
                </div>

                <form onSubmit={handleReadingSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-end">
                  <div className="flex-1">
                    <label htmlFor="readingMachine" className="block text-sm font-semibold text-slate-700">Machine</label>
                    <select
                      id="readingMachine"
                      value={readingMachineId}
                      onChange={(e) => setReadingMachineId(e.target.value)}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="" disabled>Select a machine</option>
                      {machines.map((machine) => (
                        <option key={machine.id} value={machine.id}>
                          {machine.name} ({machine.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label htmlFor="readingOutput" className="block text-sm font-semibold text-slate-700">Output Count</label>
                    <input
                      id="readingOutput"
                      type="number"
                      min="0"
                      value={readingOutput}
                      onChange={(e) => setReadingOutput(e.target.value)}
                      required
                      placeholder="e.g. 76"
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="readingTemp" className="block text-sm font-semibold text-slate-700">Temperature (°C)</label>
                    <input
                      id="readingTemp"
                      type="number"
                      step="any"
                      value={readingTemp}
                      onChange={(e) => setReadingTemp(e.target.value)}
                      placeholder="Optional"
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="readingTime" className="block text-sm font-semibold text-slate-700">Timestamp</label>
                    <input
                      id="readingTime"
                      type="datetime-local"
                      value={readingTime}
                      onChange={(e) => setReadingTime(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
                  >
                    Record Reading
                  </button>
                </form>

                {readingMessage && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {readingMessage}
                  </div>
                )}
              </div>

            </div>

          </div>
      </DashboardShell>
  
  );
}